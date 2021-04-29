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
  constructor(tokens) {
    this.input = tokens;
    this.pos = 0;
  }
}
