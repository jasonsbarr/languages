const Lexer = require("../src/lexer");

describe("Create a Lexer object", () => {
  it("Should create a Lexer object with the appropriate properties", () => {
    const lexer = Lexer.new("abc");
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
    const lexer = Lexer.new(json);
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
    const lexer = Lexer.new(json);
    const match = {
      type: "String",
    };

    expect(lexer.readString()).toMatchObject(match);
  });

  test("Lexer#readString should return a String token with the correct value", () => {
    const json = JSON.stringify("hello");
    const lexer = Lexer.new(json);
    const match = {
      type: "String",
      value: "hello",
    };

    expect(lexer.readString()).toMatchObject(match);
  });

  test("Lexer#readString should return the correct value when an escape character is in the string", () => {
    const json = JSON.stringify("\n");
    const lexer = Lexer.new(json);
    const match = {
      type: "String",
      value: "\n",
    };
    const result = lexer.readString();

    expect(result).toMatchObject(match);
    expect(result.value.length).toEqual(1);
  });
});

describe("Create a Number token", () => {
  test("Lexer#readNumber should return a Number token", () => {
    const json = JSON.stringify(3.1415);
    const lexer = Lexer.new(json);
    const match = {
      type: "Number",
    };

    expect(lexer.readNumber()).toMatchObject(match);
  });

  test("Lexer#readNumber should return a Number token with the correct integer value", () => {
    const json = JSON.stringify(17);
    const lexer = Lexer.new(json);
    const match = {
      type: "Number",
      value: 17,
    };

    expect(lexer.readNumber()).toMatchObject(match);
  });

  test("Lexer#readNumber should return a number token with the correct value when the number is negative", () => {
    const json = JSON.stringify(-17);
    const lexer = Lexer.new(json);
    const match = {
      type: "Number",
      value: -17,
    };

    expect(lexer.readNumber()).toMatchObject(match);
  });

  test("Lexer#readNumber should return a Number with the correct float value", () => {
    const json = JSON.stringify(3.1415);
    const lexer = Lexer.new(json);
    const match = {
      type: "Number",
      value: 3.1415,
    };

    expect(lexer.readNumber()).toMatchObject(match);
  });

  test("Lexer#readNumber should return a Number with the correct float value when the JSON string uses exponential notation", () => {
    const json = JSON.stringify(3.1415e100);
    const lexer = Lexer.new(json);
    const match = {
      type: "Number",
      value: 3.1415e100,
    };

    expect(lexer.readNumber()).toMatchObject(match);
  });
});

describe("Create a Boolean token", () => {
  test("Lexer#readKeyword should return a Boolean token when value is true or false", () => {
    const json = JSON.stringify(true);
    const lexer = Lexer.new(json);
    const match = {
      type: "Boolean",
    };

    expect(lexer.readKeyword()).toMatchObject(match);
  });

  test("Lexer#readKeyword should return a Boolean token with the appropriate true or false value", () => {
    expect(Lexer.new(JSON.stringify(true)).readKeyword()).toMatchObject({
      type: "Boolean",
      value: true,
    });
    expect(Lexer.new(JSON.stringify(false)).readKeyword()).toMatchObject({
      type: "Boolean",
      value: false,
    });
  });
});

describe("Create a Null token", () => {
  test("Lexer#readKeyword should return a Null token for null values", () => {
    expect(Lexer.new(JSON.stringify(null)).readKeyword()).toMatchObject({
      type: "Null",
      value: null,
    });
  });
});

describe("Correctly tokenize an empty object or array", () => {
  test("Lexer#read should return the correct values for an empty object", () => {
    const json = JSON.stringify({});
    const lexer = Lexer.new(json);
    const match = [
      { type: "Punc", value: "{" },
      { type: "Punc", value: "}" },
      { type: "EOI", value: "EOI" },
    ];

    expect(lexer.read()).toMatchObject(match);
  });

  test("Lexer#read should return the correct values for an empty array", () => {
    const json = JSON.stringify([]);
    const lexer = Lexer.new(json);
    const match = [
      { type: "Punc", value: "[" },
      { type: "Punc", value: "]" },
      { type: "EOI", value: "EOI" },
    ];

    expect(lexer.read()).toMatchObject(match);
  });
});

describe("Correctly tokenize JSON strings", () => {
  test("Lexer#read should correctly tokenize an object with at least one property", () => {
    const json = JSON.stringify({ test: "hello" });
    const lexer = Lexer.new(json);
    const match = [
      { type: "Punc", value: "{" },
      { type: "String", value: "test" },
      { type: "Punc", value: ":" },
      { type: "String", value: "hello" },
      { type: "Punc", value: "}" },
      { type: "EOI", value: "EOI" },
    ];

    expect(lexer.read()).toMatchObject(match);
  });

  test("Lexer#read should correctly tokenize an array with multiple values", () => {
    const json = JSON.stringify(["hi", true, 3.1415]);
    const lexer = Lexer.new(json);
    const match = [
      { type: "Punc", value: "[" },
      { type: "String", value: "hi" },
      { type: "Punc", value: "," },
      { type: "Boolean", value: true },
      { type: "Punc", value: "," },
      { type: "Number", value: 3.1415 },
      { type: "Punc", value: "]" },
      { type: "EOI", value: "EOI" },
    ];

    expect(lexer.read()).toMatchObject(match);
  });

  test("Lexer#read should correctly tokenize an array with an object", () => {
    const json = JSON.stringify([{ test: "hi" }, 47]);
    const lexer = Lexer.new(json);
    const match = [
      { type: "Punc", value: "[" },
      { type: "Punc", value: "{" },
      { type: "String", value: "test" },
      { type: "Punc", value: ":" },
      { type: "String", value: "hi" },
      { type: "Punc", value: "}" },
      { type: "Punc", value: "," },
      { type: "Number", value: 47 },
      { type: "Punc", value: "]" },
      { type: "EOI", value: "EOI" },
    ];

    expect(lexer.read()).toMatchObject(match);
  });

  test("Lexer#read should correctly tokenize an object with an array and at least one other property", () => {
    const json = JSON.stringify({
      test: ["hi", 42],
      str: "programming is fun",
    });
    const lexer = Lexer.new(json);
    const match = [
      { type: "Punc", value: "{" },
      { type: "String", value: "test" },
      { type: "Punc", value: ":" },
      { type: "Punc", value: "[" },
      { type: "String", value: "hi" },
      { type: "Punc", value: "," },
      { type: "Number", value: 42 },
      { type: "Punc", value: "]" },
      { type: "Punc", value: "," },
      { type: "String", value: "str" },
      { type: "Punc", value: ":" },
      { type: "String", value: "programming is fun" },
      { type: "Punc", value: "}" },
      { type: "EOI", value: "EOI" },
    ];

    expect(lexer.read()).toMatchObject(match);
  });
});
