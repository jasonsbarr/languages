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
});
