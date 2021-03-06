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

    if (isArray(node)) {
      return this.evalArray(node);
    }

    if (isObject(node)) {
      return this.evalObject(node);
    }
  }

  evalObject(node) {
    let obj = {};

    node.value.forEach((value) => {
      obj[value.name] = this.eval(value.value);
    });

    return obj;
  }

  evalArray(node) {
    return node.value.map((value) => {
      return this.eval(value);
    });
  }
}

module.exports = function evaluate(input) {
  const evaluator = Evaluator.new(parse(input));
  return evaluator.eval();
};
