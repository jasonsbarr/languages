const { parse } = require("./parser");

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

function isArray(node) {
  return node.type == "Array";
}

function isObject(node) {
  return node.type == "Object";
}

class Evaluator {
  constructor(ast) {
    this.ast = ast;
  }

  static new(ast) {
    return new Evaluator(ast);
  }

  eval(node) {
    node = node || this.ast;

    if (isString(node) || isNumber(node) || isBoolean(node) || isNull(node)) {
      return node.value;
    }
  }

  evalObject(node) {}

  evalArray(node) {}
}

module.exports = function evaluate(input) {
  const evaluator = Evaluator.new(parse(input));
  return evaluator.eval();
};
