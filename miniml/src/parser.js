import {
  Program,
  Num,
  Str,
  Bool,
  Nil,
  Func,
  Assign,
  Let,
  VarDecl,
  Apply,
} from "./ast.js";

// match tokens
const match = (name) => (token) => name === token.type || name === token.value;
const matchLet = match("let");
const matchRec = match("rec");
const matchFun = match("fun");
const matchIf = match("if");
const matchThen = match("then");
const matchElse = match("else");
const matchTrue = match("true");
const matchFalse = match("false");
const matchNil = match("nil");
const matchBegin = match("begin");
const matchEnd = match("end");
const matchAnd = match("and");
const matchWith = match("with");
const matchPlus = match("+");
const matchMinus = match("-");
const matchDiv = match("/");
const matchMul = match("*");
const matchExp = match("**");
const matchGt = match(">");
const matchLt = match("<");
const matchGte = match(">=");
const matchLte = match("<=");
const matchEq = match("==");
const matchNe = match("!=");
const matchNot = match("!");
const matchAndOp = match("&&");
const matchOr = match("||");
const matchBind = match("=");
const matchStrConcat = match("++");
const matchListConcat = match("@");
const matchCons = match("::");
const matchLparen = match("(");
const matchRparen = match(")");
const matchDot = match(".");
const matchComma = match(",");
const matchLbracket = match("[");
const matchRbracket = match("]");
const matchLbrace = match("{");
const matchRbrace = match("}");
const matchSemi = match(";");
const matchColon = match(":");
const matchNewline = match("\n");

// match booleans
const matchBool = (token) => matchTrue(token) || matchFalse(token);

// match keywords
const matchKeyword = (token) =>
  matchLet(token) ||
  matchRec(token) ||
  matchFun(token) ||
  matchIf(token) ||
  matchThen(token) ||
  matchElse(token) ||
  matchBegin(token) ||
  matchEnd(token) ||
  matchAnd(token) ||
  matchWith(token);

// match binary operators
const matchBinOp = (token) =>
  matchPlus(token) ||
  matchMinus(token) ||
  matchDiv(token) ||
  matchMul(token) ||
  matchExp(token) ||
  matchGt(token) ||
  matchLt(token) ||
  matchGte(token) ||
  matchLte(token) ||
  matchEq(token) ||
  matchNe(token) ||
  matchAndOp(token) ||
  matchOr(token) ||
  matchBind(token) ||
  matchStrConcat(token) ||
  matchListConcat(token) ||
  matchCons(token);

// match unary operators
const matchUnOp = (token) =>
  matchMinus(token) || matchNot(token) || matchMul(token) || matchExp(token);

const matchExprTerm = (token) => matchSemi(token) || matchNewline(token);
