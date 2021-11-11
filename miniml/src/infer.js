import {
  createType,
  VariantInfo,
} from "@jasonsbarr/functional-core/lib/types/createType.js";
import { switchType } from "@jasonsbarr/functional-core/lib/types/switchType.js";
import { List } from "@jasonsbarr/collections/lib/List.js";
import { Set } from "@jasonsbarr/collections/lib/Set.js";
import {
  Option,
  Some,
  None,
} from "@jasonsbarr/functional-core/lib/types/Option.js";
import { length } from "@jasonsbarr/iterable/lib/length.js";
import { join } from "@jasonsbarr/iterable/lib/join.js";
import { cons } from "@jasonsbarr/collections/lib/List.js";
import { fromCharCode } from "@jasonsbarr/functional-core/lib/string/fromCharCode.js";
import { charCodeAt } from "@jasonsbarr/functional-core/lib/string/charCodeAt.js";

const fst = (pair) => pair[0];
const snd = (pair) => pair[1];

const exprVariants = [
  /**
   * Expression literals
   * value of type
   */
  VariantInfo("ENum"),
  VariantInfo("EBool"),
  VariantInfo("EStr"),
  VariantInfo("ENil"),
  /**
   * Identifiers
   * EVar of String
   */
  VariantInfo("EVar"),
  /**
   * Function expressions
   * EFunc of {
   *  name: String
   *  body: Expr
   * }
   */
  VariantInfo("EFunc"),
  /**
   * Function applications
   * EApply of {
   *  arg: Expr
   *  func: Expr
   * }
   */
  VariantInfo("EApply"),
  /**
   * Let expressions
   * ELet of {
   *  name: String,
   *  defn: Expr
   *  body: Expr
   * }
   */
  VariantInfo("ELet"),
  /**
   * Letrec expressions
   * ELetrec of {
   *  name: String,
   *  defn: Expr
   *  body: Expr
   * }
   */
  VariantInfo("ELetrec"),
];

const Expr = createType("Expr", exprVariants);
const { ENum, EBool, EStr, ENil, EVar, EFunc, EApply, ELet, ELetrec } = Expr;
const getVal = ({ value }) => value;

const exprToString = (expr) =>
  switchType(
    Expr,
    {
      ENum: getVal,
      EBool: getVal,
      EStr: getVal,
      ENil: () => "nil",
      EVar: ({ value: name }) => name,
      EFunc: ({ value: { name, body } }) =>
        `fun ${name} -> ${exprToString(body)}`,
      EApply: ({ value: { arg, func } }) =>
        `${exprToString(arg)} ${exprToString(func)}`,
      ELet: ({ value: { name, defn, body } }) =>
        `let ${name} = ${exprToString(defn)} in ${exprToString(body)}`,
      ELetrec: ({ value: { name, defn, body } }) =>
        `let rec ${name} = ${exprToString(defn)} in ${exprToString(body)}`,
    },
    expr
  );

/**
 * A type variable stands for an arbitrary type. All TyVars have a unique id,
 * but names are only assigned lazily when needed
 * TyVar of {
 *  id: int,
 *  instance: Option<Type>
 *  name: Option<String>
 * }
 */
const TyVar = (id, instance, name) => ({ id, instance, name });

/**
 * An n-ary type constructor which builds a new type
 * TyOp of {
 *  name: String,
 *  types: List<Type>
 * }
 */
const TyOp = (name, types) => ({ name, types });

const typeVariants = [
  /**
   * TypeVariable of TyVar
   */
  VariantInfo("TypeVariable"),
  /**
   * TypeOperator of TyOp
   */
  VariantInfo("TypeOperator"),
];

const Type = createType("Type", typeVariants);
const { TypeVariable, TypeOperator } = Type;

let nextVariableId = 0;
let nextUniqueName = "a";

const makeVariable = () => {
  const newVar = TyVar(nextVariableId, None(), None());
  nextVariableId++;
  return TypeVariable(newVar);
};

const getNextUniqueName = () => {
  const name = nextUniqueName;
  nextUniqueName = fromCharCode(charCodeAt(0, nextUniqueName) + 1);
  return name;
};

/**
 * Assign name to TyVar
 * Type -> String
 *
 * Mutates ty.value.name if name is not already assigned
 * Should only pass TypeVariable instances to this function,
 * but I'll define a case for TypeOperators anyway, just in case
 */
const getVariableName = (ty) =>
  switchType(
    Type,
    {
      TypeVariable: (tyvar) => {
        return switchType(
          Option,
          {
            Some: ({ value: name }) => name,
            None: () => {
              const newName = getNextUniqueName();
              tyvar.value.name = Some(newName);
              return newName;
            },
          },
          tyvar.value.name
        );
      },
      TypeOperator: ({ value: { name } }) => name,
    },
    ty
  );

const typeToString = (ty) =>
  switchType(
    Type,
    {
      TypeVariable: ({ value: { instance } }) =>
        instance.fold(
          () => getVariableName(ty),
          () => typeToString(instance)
        ),
      TypeOperator: ({ value: { name, types } }) => {
        switch (length(types)) {
          case 0:
            return name;

          case 2:
            return `${typeToString(types.atUnsafe(0))} ${name} ${typeToString(
              types.atUnsafe(1)
            )}`;

          default:
            return `${name} ${join(" ", types.map(typeToString))}`;
        }
      },
    },
    ty
  );

/**
 * env of List<(String * Type)>
 */
const env = (...pairs) => {
  let temp = [];
  for (let pair of pairs) {
    temp.push(cons(fst(pair), snd(pair)));
  }
  return List.of(temp);
};

const makeFunctionType = (from, to) =>
  TypeOperator({ name: "->", types: List(from, to) });
const numType = () => TypeOperator({ name: "Number", types: List.empty() });
const boolType = () => TypeOperator({ name: "Boolean", types: List.empty() });
const strType = () => TypeOperator({ name: "String", types: List.empty() });
const nilType = () => TypeOperator({ name: "Nil", types: List.empty() });
