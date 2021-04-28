function isDigit(char) {
  return /[0-9]/.test(char);
}

function isPositiveDigit(char) {
  return /[1-9]/.test(char);
}

function isChar(char) {
  return /\w/.test(char);
}

function isDoubleQuote(char) {
  return /\"/.test(char);
}

function isBracket(char) {
  return /[\[\]\{\}]/.test(char);
}

function isKeyword(word) {
  return /true|false|null/.test(word);
}

function createToken({ type, value, start, end }) {
  return {
    type,
    value,
    start,
    end,
  };
}

class Lexer {
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.col = 1;
    this.tokens = [];
  }

  static new(input) {
    return new Lexer(input);
  }

  next() {
    this.col++;
    return this.input[this.pos++];
  }

  peek() {
    return this.input[this.pos];
  }

  eoi() {
    return this.input[this.pos] === "";
  }

  readWhile(predicate) {
    let str = "";
    while (!this.eoi() && predicate(this.peek())) {
      str += this.next();
    }
    return str;
  }

  readString() {
    const start = this.col;
    this.next(); // skip opening quotation mark
    const value = this.readWhile(() => !isDoubleQuote(this.peek()));
    return createToken({
      type: "String",
      value,
      start,
      end: this.pos,
    });
  }

  readNumber() {}
}

module.exports = Lexer;
