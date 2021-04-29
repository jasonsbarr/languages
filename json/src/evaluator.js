const { parser } = require("./parser");

function isString(node) {
  return node.type == "String";
}

function isNumber(node) {
  return node.type == "Number";
}

function isBoolean(node) {
  return node.type == "Boolean";
}

function isNull(node) {
  return node.type == "Null";
}

class Evaluator {
  constructor(ast) {
    this.ast = ast;
  }

  static new(ast) {
    return new Evaluator(ast);
  }

  eval() {}
}

module.exports = function evaluate(input) {
  const evaluator = Evaluator.new(parser(input));
  return evaluator.eval();
};
