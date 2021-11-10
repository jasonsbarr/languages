import repl from "repl";
import evaluate from "./interpreter.js";

function evalProg(cmd, context, filename, callback) {
  callback(null, evaluate(cmd));
}

function print(input) {
  return input;
}

repl.start({
  prompt: "MiniML> ",
  input: process.stdin,
  output: process.stdout,
  eval: evalProg,
  ignoreUndefined: true,
  writer: print,
});
