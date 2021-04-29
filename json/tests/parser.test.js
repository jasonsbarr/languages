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
