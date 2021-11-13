import { List } from "@jasonsbarr/collections/lib/List.js";
import {
  Expr,
  ENum,
  EBool,
  EStr,
  ENil,
  EVar,
  EFunc,
  EApply,
  ELet,
  ELetrec,
  exprToString,
  Num,
  Bool,
  Str,
  Nil,
  Var as Ident,
  Func as Lambda,
  Apply,
  Let,
  Letrec,
  typeToString,
  TypeVariable,
  TypeOperator,
  makeFunctionType,
  numType,
  boolType,
  strType,
  nilType,
  env,
  analyze,
} from "../src/infer.js";

const expr1 = EApply({
  arg: ENum(),
  func: EFunc({ param: "a", body: EVar("a") }),
});

const expr2 = EVar("a");

const expr3 = EApply({
  arg: ENum(),
  func: EFunc({
    param: "a",
    body: EApply({ arg: ENum(), func: EVar("func") }),
  }),
});

const expr4 = ELet({
  name: "val",
  defn: EStr(),
  body: EApply({ arg: EVar("val"), func: EVar("cap") }),
});

const expr5 = ELet({
  name: "val",
  defn: EStr(),
  body: EApply({ arg: EVar("val"), func: EVar("func") }),
});

const expr6 = Apply(
  Apply(Ident("pair"), Apply(Ident("f"), Num())),
  Apply(Ident("f"), Bool())
);

const expr7 = Letrec(
  "factorial",
  Lambda(
    "n",
    Apply(
      Apply(Apply(Ident("cond"), Apply(Ident("zero"), Ident("n"))), Num()),
      Apply(
        Apply(Ident("times"), Ident("n")),
        Apply(Ident("factorial"), Apply(Ident("pred"), Ident("n")))
      )
    )
  ),
  Apply(Ident("factorial"), Num())
);

const exprs = [expr1, expr2, expr3, expr4, expr5, expr6, expr7];

const var1 = TypeVariable();
const var2 = TypeVariable();
const var3 = TypeVariable();
const var4 = TypeVariable();
const pairTy = TypeOperator({ name: "*", types: List(var1, var2) });
const newEnv = env(
  ["true", boolType],
  ["false", boolType],
  ["nil", nilType],
  ["func", makeFunctionType(numType, numType)],
  ["a", numType],
  ["cap", makeFunctionType(strType, strType)],
  ["pair", makeFunctionType(var1, makeFunctionType(var2, pairTy))],
  [
    "cond",
    makeFunctionType(
      boolType,
      makeFunctionType(var3, makeFunctionType(var3, var3))
    ),
  ],
  ["zero", makeFunctionType(numType, boolType)],
  ["pred", makeFunctionType(numType, numType)],
  ["times", makeFunctionType(numType, makeFunctionType(numType, numType))],
  ["f", makeFunctionType(var4, var4)]
);

for (let expr of exprs) {
  // let n = exprToString(expr);
  // console.log(n);
  try {
    let t = typeToString(analyze(expr, newEnv));
    console.log(t);
  } catch (e) {
    console.log(e.message);
    // console.log(e.stack);
  }
}
