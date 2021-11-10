const keywords = [
  "let",
  "rec",
  "fun",
  "in",
  "if",
  "then",
  "else",
  "true",
  "false",
  "nil",
  "begin",
  "end",
];

const operators = [
  "+",
  "-",
  "/",
  "*",
  ">",
  "<",
  "<=",
  ">=",
  "==",
  "!=",
  "!",
  "&&",
  "||",
  "=",
  "++",
  "@",
  "::",
];

const opChars = "+-/*><=!&|";

const punc = ["(", ")", ".", ",", "[", "]", "{", "}", ";", ":"];

const isOpChar = (char) => opChars.indexOf(char) > -1;

const isIdStart = (char) => /[a-zA-Z_$]/.test(char);

const isIdChar = (char) => /[a-zA-Z0-9_$]/.test(char);

const isDigit = (char) => /[0-9]/.test(char);

const isKeyword = (str) => keywords.includes(str);

const isOperator = (str) => operators.includes(str);

const isPunc = (char) => punc.includes(char);

const isWhitespace = (char) => / \t/.test(char);

const isHexadecimalChar = (char) => /[0-9a-fA-F]/.test(char);

const read = (input) => {
  let pos = 0;
  let line = 0;
  let col = 0;
  let tokens = [];
  const peek = () => input.charAt(pos);
  const next = () => {
    if (peek() === "\n") {
      col = 0;
      line++;
    } else {
      col++;
    }

    return input.charAt(pos++);
  };
  const eof = () => peek() === "";
  const croak = (msg) => {
    throw new SyntaxError(msg);
  };
  const makeToken = (type, value) => ({
    type,
    value,
    line,
    col,
    pos,
  });

  const readWhile = (pred) => {
    let str = "";

    while (pred(peek())) {
      str += next();
    }

    return str;
  };

  const readEscapeSequence = (ch) => {
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
      seq = readWhile((ch) => isHexadecimalChar(ch));
      str += String.fromCharCode(parseInt(seq, 16));
    } else if (ch == "u") {
      // is Unicode escape sequence
      if (peek() === "{") {
        next();
      }
      seq = readWhile((ch) => isHexadecimalChar(ch));
      str += String.fromCodePoint(parseInt(seq, 16));
      if (peek() === "}") {
        next();
      }
    }
    return str;
  };

  const readEscaped = (end) => {
    let escaped = false;
    let str = "";
    next();

    while (!eoi()) {
      let ch = next();

      if (escaped) {
        str += readEscapeSequence(ch);
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else if (ch == "\n") {
        croak(`Unexpected EOL in string literal at line ${line}, col ${col}`);
      } else {
        str += ch;
      }
    }

    return str;
  };

  const readString = () => makeToken("string", readEscaped('"'));

  const readNumber = () => {
    let str = readWhile(isDigit);

    if (peek() === ".") {
      str += next();
    }

    str += readWhile(isDigit);

    return makeToken("number", Number(str));
  };

  const readIdent = () => {
    let str = readWhile(isIdChar);

    if (str === "true" || str === "false") {
      return makeToken("boolean", str === "true");
    }

    if (str === "nil") {
      return makeToken("nil", null);
    }

    if (isKeyword(str)) {
      return makeToken(str, str);
    }

    return makeToken("identifier", str);
  };

  const readOp = () => {
    const str = readWhile(isOpChar);

    if (isOperator(str)) {
      return makeToken("operator", str);
    }

    croak(`Unrecognized token ${str} at line ${line}, col ${col}`);
  };

  const readNext = () => {
    if (isWhitespace(peek())) {
      while (isWhitespace(peek())) {
        next();
      }
    }

    let ch = peek();

    if (isDigit(ch)) {
      return readNumber();
    }

    if (ch === '"') {
      return readString();
    }

    if (isIdStart(ch)) {
      return readIdent();
    }

    if (isOpChar(ch)) {
      return readOp();
    }

    if (isPunc(ch)) {
      return makeToken("punc", ch);
    }

    croak(`Unrecognized character ${ch} at line ${line}, col ${col}`);
  };

  while (!eof()) {
    let token = readNext();

    if (token) {
      tokens.push(token);
    }
  }

  return tokens;
};

export default read;
