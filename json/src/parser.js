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

  next() {
    return this.input[this.pos++];
  }

  peek() {
    return this.input[this.pos];
  }

  eoi() {
    return this.input[this.pos].type == "EOI";
  }

  parse() {
    if (!this.eoi()) {
      this._ast = this.parseNext();
    }
    return this._ast;
  }

  parseNext() {
    const tok = this.peek();

    if (isString(tok)) {
      this.next(); // advance token stream pointer

      return createNode({
        type: "String",
        value: tok.value,
        start: tok.start,
        end: tok.end,
      });
    }

    if (isNumber(tok)) {
      this.next(); // advance token stream pointer

      return createNode({
        type: "Number",
        value: tok.value,
        start: tok.start,
        end: tok.end,
      });
    }
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
