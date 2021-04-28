const Lexer = require("../src/lexer");

describe("Create a Lexer object", () => {
  it("Should create a Lexer object with the appropriate properties", () => {
    const lexer = new Lexer("abc");
    const match = {
      input: "abc",
      pos: 0,
    };

    expect(lexer).toMatchObject(match);
  });

  it("Should create a Lexer object with JSON input", () => {
    const json = JSON.stringify({
      prop1: "a string",
      prop2: ["an", "array"],
      bool: true,
    });
    const lexer = new Lexer(json);
    const match = {
      input: json,
      pos: 0,
    };

    expect(lexer).toMatchObject(match);
  });
});
