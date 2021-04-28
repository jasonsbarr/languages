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

function isHexadecimalChar(char) {
  return /[0-9a-fA-F]/.test(char);
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
    const value = this.readEscaped();
    this.next(); // skip closing quotation mark
    return createToken({
      type: "String",
      value,
      start,
      end: this.pos,
    });
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

  readNumber() {}
}

module.exports = Lexer;
