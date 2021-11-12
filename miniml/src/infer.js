import {
  createType,
  VariantInfo,
} from "@jasonsbarr/functional-core/lib/types/createType.js";
import { switchType } from "@jasonsbarr/functional-core/lib/types/switchType.js";
import { List } from "@jasonsbarr/collections/lib/List.js";
import { Set } from "@jasonsbarr/collections/lib/Set.js";
import { Map } from "@jasonsbarr/collections/lib/Map.js";
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
import { equals } from "@jasonsbarr/functional-core/lib/object/equals.js";
import { not } from "@jasonsbarr/functional-core/lib/helpers/not.js";
import { noop } from "@jasonsbarr/functional-core/lib/helpers/noop.js";

const fst = (pair) => pair[0];
const snd = (pair) => pair[1];
const fail = (msg) => {
  throw new Error(msg);
};

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
   *  param: String
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

export const Expr = createType("Expr", exprVariants);
export const {
  ENum,
  EBool,
  EStr,
  ENil,
  EVar,
  EFunc,
  EApply,
  ELet,
  ELetrec,
} = Expr;
const getVal = ({ value }) => value;

export const exprToString = (expr) =>
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

export const Type = createType("Type", typeVariants);
export const { TypeVariable, TypeOperator } = Type;

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
      TypeVariable: ({ value: tyvar }) => {
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
          tyvar.name
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
          () => getVariableName(ty.value),
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
 * env of List<(String, Type)>
 */
export const env = (...pairs) => {
  let temp = [];
  for (let pair of pairs) {
    temp.push(cons(fst(pair), snd(pair)));
  }
  return List.of(temp);
};

const extendEnv = (e, pair) => cons(cons(fst(pair), snd(pair)), e);

const makeFunctionType = (from, to) => TypeOperator(TyOp("->", List(from, to)));

// define primitive type operators
const numType = () => TypeOperator(TyOp("Number", List.empty()));
const boolType = () => TypeOperator(TyOp("Boolean", List.empty()));
const strType = () => TypeOperator(TyOp("String", List.empty()));
const nilType = () => TypeOperator(TyOp("Nil", List.empty()));

/**
 * The machinery for type inference
 */
// Prune returns the currently defining instance of t.
// As a side effect, collapses the list of type instances. The function Prune
// is used whenever a type expression has to be inspected: it will always
// return a type expression which is either an uninstantiated type variable or
// a type operator; i.e. it will skip instantiated variables, and will
// prune them from expressions to remove long chains of instantiated variables.
const prune = (t) =>
  switchType(
    Type,
    {
      TypeVariable: () => {
        if (Option.isSome(t.value.instance)) {
          let newInstance = prune(t.value.instance);
          t.value.instance = Some(newInstance);
          return newInstance;
        }
        return t;
      },
      _: () => t,
    },
    t
  );

const occursInType = (v, t2) =>
  switchType(
    Type,
    {
      TypeVariable: (pruned) => equals(pruned, v),
      TypeOperator: ({ value: { types } }) => occursIn(v, types),
    },
    prune(t2)
  );

const occursIn = (t, types) => types.includes((t2) => occursInType(t, t2));

const isGeneric = (v, nonGeneric) => not(nonGeneric.includes(v));

// Makes a copy of a type expression.
// The type t is copied. The the generic variables are duplicated and the
// nonGeneric variables are shared.
const fresh = (t, nonGeneric) => {
  let table = Map();

  const loop = (tp) =>
    switchType(
      Type,
      {
        TypeVariable: (p) => {
          if (isGeneric(p, nonGeneric)) {
            if (table.has(p)) {
              table.getWithDefault(p, noop());
            } else {
              let newVar = makeVariable();
              table = table.set(p, newVar);
              return newVar;
            }
          } else {
            return p;
          }
        },
        TypeOperator: ({ value: op }) => ({ ...op, types: op.types.map(loop) }),
      },
      prune(tp)
    );

  return loop(t);
};

// Get the type of identifier name from the type environment env
const getType = (name, env, nonGeneric) =>
  env
    .find(([n, _]) => equals(n, name))
    .fold(
      () => fail(`Undefined symbol ${name}`),
      ({ value }) => fresh(snd(value), nonGeneric)
    );

// Unify the two types t1 and t2. Makes the types t1 and t2 the same.
const unify = (t1, t2) => {
  let a = prune(t1);
  let b = prune(t2);

  if (Type.isTypeVariable(a)) {
    if (!equals(a, b)) {
      occursInType(a, b)
        ? fail("Recursive unification")
        : (a.value.instance = Some(b));
    }
  } else if (Type.isTypeOperator(a) && Type.isTypeVariable(b)) {
    unify(b, a);
  } else if (Type.isTypeOperator(a) && Type.isTypeOperator(b)) {
    const { name: name1, types: types1 } = a.value;
    const { name: name2, types: types2 } = b.value;
    if (name1 !== name2 || types1.size !== types2.size) {
      fail(`Type mismatch ${typeToString(a)} != ${typeToString(b)}`);
    }

    types1.zip(types2).each(([t1, t2]) => unify(t1, t2));
  }
};

// Computes the type of the expression given by expr.
// The type of the expr is computed in the context of the
// supplied type environment env. Data types can be introduced into the
// language simply by having a predefined set of identifiers in the initial
// environment. environment; this way there is no need to change the syntax or, more
// importantly, the type-checking program when extending the language.
export const analyze = (exp, env) => {
  const loop = (exp, env, nonGeneric) =>
    switchType(
      Expr,
      {
        ENum: () => numType,
        EBool: () => boolType,
        EStr: () => strType,
        ENil: () => nilType,
        EVar: () => getType(name, env, nonGeneric),
        EApply: ({ value: { arg, func } }) => {
          const funTy = loop(func, env, nonGeneric);
          const argTy = loop(arg, env, nonGeneric);
          const retTy = makeVariable();
          unify(makeFunctionType(argTy, retTy), funTy);
          return retTy;
        },
        EFunc: ({ value: { param, body } }) => {
          const paramTy = makeVariable();
          const newEnv = extendEnv(env, cons(param, paramTy));
          const newNonGeneric = nonGeneric.append(paramTy);
          const retTy = loop(body, newEnv, newNonGeneric);
          return makeFunctionType(paramTy, retTy);
        },
        ELet: ({ value: { name, defn, body } }) => {
          const defnTy = loop(defn, env, nonGeneric);
          return loop(body, extendEnv(env, cons(name, defnTy)));
        },
        ELetrec: ({ value: { name, defn, body } }) => {
          const newTy = makeVariable();
          const newEnv = extendEnv(env, cons(name, newTy));
          const newNonGeneric = nonGeneric.append(newTy);
          const defnTy = loop(defn, newEnv, newNonGeneric);
          unify(newTy, defnTy);
          return loop(body, newEnv, newNonGeneric);
        },
      },
      exp
    );

  return loop(exp, env, Set.empty());
};
