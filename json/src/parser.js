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
    `Expected punctuation token, got ${token.type} at ${token.start}`
  );
}

function match(expected, actual) {
  if (actual.type == expected) {
    return true;
  }
  throw new Error(
    `Expected ${expected}, got ${actual.type} at ${actual.start}`
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

    if (isPunc(tok) && getPunc(tok) == "[") {
      return this.parseArray();
    }

    if (isPunc(tok) && getPunc(tok) == "{") {
      return this.parseObject();
    }

    if (isString(tok) || isNumber(tok) || isBoolean(tok) || isNull(tok)) {
      this.next(); // advance token stream pointer
      return createNode({
        type: tok.type,
        value: tok.value,
        start: tok.start,
        end: tok.end,
      });
    }
  }

  parseArray() {
    const start = this.peek().start;

    this.skipPunc("[");

    const elements = this.parseArrayElements();

    const tok = this.peek();

    this.skipPunc("]");

    return createNode({
      type: "Array",
      value: elements,
      start,
      end: tok.end,
    });
  }

  parseObject() {
    const start = this.peek().start;

    this.skipPunc("{");

    const properties = this.parseObjectProperties();

    const tok = this.peek();

    this.skipPunc("}");

    return createNode({
      type: "Object",
      value: properties,
      start,
      end: tok.end,
    });
  }

  parseArrayElements() {
    let tok = this.peek();
    let elements = [];

    if (this.peek().value != "]") {
      elements.push(this.parseNext());
    }

    tok = this.peek();

    while (isPunc(tok) && getPunc(tok) == ",") {
      this.skipPunc(",");
      elements.push(this.parseNext());
      tok = this.peek();
    }

    return elements;
  }

  parseObjectProperties() {
    let properties = [];

    return properties;
  }

  skipPunc(expected) {
    const tok = this.peek();

    if (tok.value == expected) {
      this.next(); // skip over the token
      return true;
    }
    throw new Error(`Expected ${expected}, got ${tok.value} at ${tok.start}`);
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
