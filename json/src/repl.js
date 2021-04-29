const repl = require("repl");
const evaluate = require("./evaluator");

function eval(cmd, context, filename, callback) {
  callback(null, evaluate(JSON.stringify(cmd)));
}

function print(input) {
  return input.trim();
}

repl.start({
  prompt: "json> ",
  input: process.stdin,
  output: process.stdout,
  eval,
  ignoreUndefined: true,
  writer: print,
});
