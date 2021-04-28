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

class Lexer {
  constructor(input) {
    this.input = input;
    this.pos = 0;
  }
}

module.exports = Lexer;
