import {
  createType,
  VariantInfo,
} from "@jasonsbarr/functional-core/lib/types/createType.js";

const variantInfos = [
  /**
   * ProgramN of {
   *  prog: Ast Array
   * }
   */
  VariantInfo("Program"),
  /**
   * Num of {
   *  value: Number
   * }
   */
  VariantInfo("Num"),
  /**
   * Str of {
   *  value: String
   * }
   */
  VariantInfo("Str"),
  /**
   * Bool of {
   *  value: Boolean
   * }
   */
  VariantInfo("Bool"),
  /**
   * Nil of {
   *  value: null
   * }
   */
  VariantInfo("Nil"),
  /**
   * Func of {
   *  param: String,
   *  body: Ast
   * }
   */
  VariantInfo("Func"),
  /**
   * Assign of {
   *  name: String
   *  expr: Ast
   * }
   */
  VariantInfo("Assign"),
  /**
   * Let of {
   *  name: String,
   *  decl: Assign,
   *  rec: Boolean
   *  body: Ast
   * }
   */
  VariantInfo("Let"),
  /**
   * Apply of {
   *  arg: Ast,
   *  func: Ast
   * }
   */
  VariantInfo("Apply"),
];

export const Ast = createType("Ast", variantInfos);

export const { Program, Num, Str, Bool, Nil, Func, Assign, Let, Apply } = Ast;
