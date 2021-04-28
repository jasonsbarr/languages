const Lexer = require("../src/lexer");

describe("Create a Lexer object", () => {
  it("Should create a Lexer object with the appropriate properties", () => {
    const lexer = new Lexer("abc");
    const match = {
      input: "abc",
      pos: 0,
      col: 1,
      tokens: [],
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
      col: 1,
      tokens: [],
    };

    expect(lexer).toMatchObject(match);
  });
});

describe("Create a String token", () => {
  test("Lexer#readString should return a String token", () => {
    const json = JSON.stringify("hello");
    const lexer = new Lexer(json);
    const match = {
      type: "String",
    };

    expect(lexer.readString()).toMatchObject(match);
  });

  test("Lexer#readString should return a String token with the correct value", () => {
    const json = JSON.stringify("hello");
    const lexer = new Lexer(json);
    const match = {
      type: "String",
      value: "hello",
    };

    expect(lexer.readString()).toMatchObject(match);
  });
});

describe("Create a Number token", () => {
  test("Lexer#readNumber should return a Number token", () => {
    const json = JSON.stringify(3.1415);
    const lexer = new Lexer(json);
    const match = {
      type: "Number",
    };

    expect(lexer.readNumber()).toMatchObject(match);
  });
});
