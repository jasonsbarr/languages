import {
  createType,
  VariantInfo,
} from "@jasonsbarr/functional-core/lib/types/createType.js";
import { switchType } from "@jasonsbarr/functional-core/lib/types/switchType.js";

const variantInfos = [
  /**
   * Expression literals
   * [EType] of { value: type }
   */
  VariantInfo("ENum"),
  VariantInfo("EBool"),
  VariantInfo("EStr"),
  VariantInfo("ENil"),
  /**
   * Identifiers
   * EVar of { name: String }
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
