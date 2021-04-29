const { parser } = require("./parser");

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
