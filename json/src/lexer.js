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

function isPunc(char) {
  return /[\[\]\{\},:]/.test(char);
}

function isHexadecimalChar(char) {
  return /[0-9a-fA-F]/.test(char);
}

function isDot(char) {
  return /\./.test(char);
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
    this._tokens = [];
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

  lookahead() {
    return this.input[this.pos + 1];
  }

  eoi() {
    return this.input.charAt(this.pos) === "";
  }

  readWhile(predicate) {
    let str = "";
    while (!this.eoi() && predicate(this.peek())) {
      str += this.next();
    }
    return str;
  }

  read() {
    while (!this.eoi()) {
      this._tokens.push(this.readNext());
    }
    return this._tokens;
  }

  readNext() {
    const ch = this.peek();

    if (isDoubleQuote(ch)) {
      return this.readString();
    }

    if (isPositiveDigit(ch) || ch == "-") {
      return this.readNumber();
    }

    if (isChar(ch)) {
      return this.readKeyword();
    }

    if (isPunc(ch)) {
      const start = this.col;

      this.next(); // skip over punctuation char;

      return createToken({
        type: "Punc",
        value: ch,
        start,
        end: this.pos,
      });
    }
  }

  readString() {
    const start = this.col;
    this.next(); // skip opening quotation mark
    const value = this.readEscaped();
    return createToken({
      type: "String",
      value,
      start,
      end: this.pos,
    });
  }

  readNumber() {
    const start = this.col;
    let ch = this.peek();
    let numStr = "";
    if (ch == "-") {
      numStr += ch;
      this.next(); // skip minus sign
    }
    numStr += this.readWhile((char) => isDigit(char));
    ch = this.peek();
    if (isDot(ch)) {
      numStr += ch;
      this.next(); // skip dot
      numStr += this.readWhile((char) => isDigit(char));
    }
    ch = this.peek();
    if (ch == "e" || ch == "E") {
      // is exponential notation
      numStr += ch;
      this.next(); // skip e
      ch = this.peek();
      if (ch == "+" || ch == "-") {
        numStr += ch;
        this.next(); // skip + or -
      }
      numStr += this.readWhile((char) => isDigit(char));
    }
    return createToken({
      type: "Number",
      value: Number(numStr),
      start,
      end: this.col,
    });
  }

  readKeyword() {
    const start = this.col;
    let kwStr = "";
    kwStr += this.readWhile((ch) => isChar(ch));
    const end = this.pos;
    if (kwStr == "true" || kwStr == "false") {
      return createToken({
        type: "Boolean",
        value: kwStr == "true" ? true : false,
        start,
        end,
      });
    }
    if (kwStr == "null") {
      return createToken({
        type: "Null",
        value: null,
        start,
        end,
      });
    }

    // This should never happen because creating JSON should error on invalid input
    // Unless of course the JSON is being formatted by hand and mistakes are made
    throw new Error(`Invalid identifier ${kwStr} at ${start}:${end}`);
  }

  tokens() {
    return this._tokens;
  }

  readEscaped() {
    let escaped = false;
    let str = "";
    // this.next();
    while (!this.eoi()) {
      let ch = this.next();
      if (escaped) {
        str += this.readEscapeSequence(ch);
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == '"') {
        break;
      } else {
        str += ch;
      }
    }
    return str;
  }

  readEscapeSequence(ch) {
    let str = "";
    let seq = "";
    if (ch == "n") {
      str += "\n";
    } else if (ch == "b") {
      str += "\b";
    } else if (ch == "f") {
      str += "\f";
    } else if (ch == "r") {
      str += "\r";
    } else if (ch == "t") {
      str += "\t";
    } else if (ch == "v") {
      str += "\v";
    } else if (ch == "0") {
      str += "\0";
    } else if (ch == "'") {
      str += "'";
    } else if (ch == '"') {
      str += '"';
    } else if (ch == "\\") {
      str += "\\";
    } else if (ch == "x") {
      // is hexadecimal escape sequence
      seq = this.readWhile((ch) => isHexadecimalChar(ch));
      str += String.fromCharCode(parseInt(seq, 16));
    } else if (ch == "u") {
      // is Unicode escape sequence
      seq = this.readWhile((ch) => isHexadecimalChar(ch));
      str += String.fromCodePoint(parseInt(seq, 16));
    }
    return str;
  }
}

module.exports = Lexer;
