import {
  createType,
  VariantInfo,
} from "@jasonsbarr/functional-core/lib/types/createType.js";
import { switchType } from "@jasonsbarr/functional-core/lib/types/switchType.js";
import { Record } from "@jasonsbarr/functional-core/lib/types/Record.js";
import { List } from "@jasonsbarr/collections/lib/List.js";
import { Set } from "@jasonsbarr/collections/lib/Set.js";

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
const TyVar = Record("id", "instance", "name");

/**
 * An n-ary type constructor which builds a new type
 * TyOp of {
 *  name: String,
 *  types: List<Type>
 * }
 */
const TyOp = Record("name", "types");

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
