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
   * Ident of {
   *  name: String
   * }
   */
  VariantInfo("Ident"),
  /**
   * Func of {
   *  param: String,
   *  body: Ast
   * }
   */
  VariantInfo("Func"),
  /**
   * Let of {
   *  name: String,
   *  expr: Ast,
   *  body: Ast,
   *  rec: Boolean
   * }
   */
  VariantInfo("Let"),
  /**
   * VarDecl of {
   *  name: String,
   *  expr: Ast
   *  rec: Boolean
   * }
   */
  VariantInfo("VarDecl"),
  /**
   * Apply of {
   *  arg: Ast,
   *  func: Ast
   * }
   */
  VariantInfo("Apply"),
];

export const Ast = createType("Ast", variantInfos);

export const {
  Program,
  Num,
  Str,
  Bool,
  Nil,
  Ident,
  Func,
  Let,
  VarDecl,
  Apply,
} = Ast;
