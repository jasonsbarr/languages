const Lexer = require("./lexer");

function createNode({ type, value, start, end }) {
  return {
    type,
    value,
    start,
    end,
  };
}

function isPunc(token) {
  return token.type == "Punc";
}

function isString(token) {
  return token.type == "String";
}

function isNumber(token) {
  return token.type == "Number";
}

function isBoolean(token) {
  return token.type == "Boolean";
}

function isNull(token) {
  return token.type == "Null";
}

function getPunc(token) {
  if (isPunc(token)) {
    return token.value;
  }
  throw new Error(
    `Expected punctuation token, got ${token.type} at ${token.start}:${token.end}`
  );
}

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.input = lexer.read();
    this.pos = 0;
    this._ast = null;
  }

  static new(lexer) {
    return new Parser(lexer);
  }

  parse() {
    return this._ast;
  }
}

module.exports = {
  Parser,
  parse: function (input) {
    const lexer = Lexer.new(input);
    const parser = Parser.new(lexer);
    return parser.parse();
  },
};
