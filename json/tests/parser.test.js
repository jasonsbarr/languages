const { Parser, parse } = require("../src/parser");
const Lexer = require("../src/lexer");

describe("Parser class should construct new parser", () => {
  test("It should construct a new parser with the given input", () => {
    const lexer = Lexer.new(JSON.stringify(3.1415));
    const p = Parser.new(lexer);
    const match = {
      lexer,
      input: [
        { type: "Number", value: 3.1415 },
        { type: "EOI", value: "EOI" },
      ],
      pos: 0,
      _ast: null,
    };

    expect(p).toMatchObject(match);
  });
});

describe("Parse a number token", () => {
  test("It should correctly parse a Number token", () => {
    const num = Parser.new(Lexer.new(JSON.stringify(3.1415))).parseNext();
    const match = {
      type: "Number",
      value: 3.1415,
    };

    expect(num).toMatchObject(match);
  });
});

describe("Parse a String token", () => {
  test("It should correctly parse a String token", () => {
    const str = Parser.new(Lexer.new(JSON.stringify("hello"))).parseNext();
    const match = {
      type: "String",
      value: "hello",
    };

    expect(str).toMatchObject(match);
  });
});

describe("Parse a Boolean token", () => {
  test("It should correctly parse Boolean tokens", () => {
    const t = Parser.new(Lexer.new(JSON.stringify(true))).parseNext();
    const f = Parser.new(Lexer.new(JSON.stringify(false))).parseNext();
    const matchT = {
      type: "Boolean",
      value: true,
    };
    const matchF = {
      type: "Boolean",
      value: false,
    };

    expect(t).toMatchObject(matchT);
    expect(f).toMatchObject(matchF);
  });
});

describe("Parse a Null token", () => {
  test("It should correctly parse a Null token", () => {
    const n = Parser.new(Lexer.new(JSON.stringify(null))).parseNext();
    const match = {
      type: "Null",
      value: null,
    };

    expect(n).toMatchObject(match);
  });
});
