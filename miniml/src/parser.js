import {
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
} from "./ast.js";
import read from "./lexer.js";

// match tokens
const match = (name) => (token) => name === token.type || name === token.value;
const matchNum = match("number");
const matchStr = match("string");
const matchBool = match("boolean");
const matchIdentifier = match("identifier");
const matchLet = match("let");
const matchRec = match("rec");
const matchFun = match("fun");
const matchIf = match("if");
const matchThen = match("then");
const matchElse = match("else");
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
const matchMod = match("%");
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
const matchArrow = match("->");
const matchAlt = match("|");
const matchPipe = match("|>");
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
const matchNewline = match("newline");

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
  matchMod(token) ||
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
  matchCons(token) ||
  matchPipe(token);

// match unary operators
const matchUnOp = (token) =>
  matchMinus(token) || matchNot(token) || matchMul(token);

// match valid expression separators
const matchExprSep = (token) =>
  matchRparen(token) ||
  matchRbracket(token) ||
  matchRbrace(token) ||
  matchComma(token) ||
  matchDot(token);

const parser = (tokens) => {
  let pos = 0;
  const peek = () => tokens[pos];
  const skip = () => ++pos;
  const next = () => tokens[++pos];
  const eof = () => peek() === undefined;
  const lookahead = (i) => tokens[pos + i];
  const croak = (msg) => {
    throw new SyntaxError(msg);
  };
  const fst = (arr) => arr[0];
  const lst = (arr) => arr[arr.length - 1];
  const skipIf = (pred, expected) => {
    const tok = peek();
    if (pred(tok)) {
      skip();
    } else {
      croak(
        `Unexpected token ${tok.value} (expected ${expected}) at line ${tok.line}, col ${tok.col}`
      );
    }
  };
  const matchExprTerm = (token) =>
    matchSemi(token) || matchNewline(token) || eof();

  /**
   * Apply ->
   *  Func nil
   *  | Func expr*
   */
  const parseApply = (func) => {
    let args = [];
    let tok = peek();

    while (!eof() && !matchExprTerm(tok) && !matchExprSep(tok)) {
      args.push(parseExpr());
      tok = peek();
    }

    if (args.length === 0) {
      croak(
        `Function application must have at least 1 argument at line ${func.value.loc.line}, col ${func.value.loc.col}`
      );
    }

    const makeApply = (func, args) =>
      args.length === 1
        ? Apply({ arg: fst(args), func, loc: func.loc })
        : Apply({
            arg: lst(args),
            func: makeApply(func, args.slice(0, -1)),
            loc: func.loc,
          });

    return makeApply(func, args);
  };

  const maybeBinary = (left, prec = 0) => {
    return left;
  };

  /**
   * atom ->
   *  | '(' expr ')'
   *  | number
   *  | string
   *  | boolean
   *  | nil
   *  | identifier
   */
  const parseAtom = () => {
    let tok = peek();

    if (matchLparen(tok)) {
      // skip left paren
      skip();

      if (matchRparen(peek())) {
        // skip right paren
        skip();
        return Nil({ value: null, loc: { line: tok.line, col: tok.col } });
      }

      const expr = parseExpression();

      skipIf(matchRparen, ")");

      return expr;
    }

    // must be atomic token - skip it to advance the stream
    skip();

    if (matchNum(tok)) {
      return Num({ value: tok.value, loc: { line: tok.line, col: tok.col } });
    }

    if (matchStr(tok)) {
      return Str({ value: tok.value, loc: { line: tok.line, col: tok.col } });
    }

    if (matchBool(tok)) {
      return Bool({
        value: tok.value,
        loc: { line: tok.line, col: tok.col },
      });
    }

    if (matchNil(tok)) {
      return Nil({ value: tok.value, loc: { line: tok.line, col: tok.col } });
    }

    if (matchIdentifier(tok)) {
      return Ident({
        name: tok.value,
        loc: { line: tok.line, col: tok.col },
      });
    }

    croak(
      `Unrecognized token ${tok.value} at line ${tok.line}, col ${tok.col}`
    );
  };

  const parseLet = () => {};

  const parseKeyword = () => {
    const tok = peek();

    if (matchLet(tok)) {
      return parseLet();
    }
  };

  /**
   * expr ->
   *    atom
   */
  const parseExpr = () => {
    if (matchKeyword(peek())) {
      return parseKeyword();
    }

    const expr = maybeBinary(parseAtom(), 0);

    return maybeBinary(expr, 0);
  };

  /**
   * expression ->
   *    expr
   *  | Apply
   */
  const parseExpression = () => {
    let expr = parseExpr();
    let tok = peek();

    if (!matchExprSep(tok) && !matchExprTerm(tok)) {
      expr = parseApply(expr);
    }

    return maybeBinary(expr, 0);
  };

  const parseProgram = () => {
    let prog = [];

    while (!eof()) {
      prog.push(parseExpression());
      skipIf(matchExprTerm, "newline or ;");

      // if multiple terminators, skip them all
      while (!eof() && matchExprTerm(peek())) {
        skip();
      }
    }

    return Program({
      prog,
    });
  };

  return parseProgram();
};

export default (input) => parser(read(input));
