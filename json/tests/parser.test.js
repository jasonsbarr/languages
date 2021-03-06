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

describe("Parse an array", () => {
  test("It should correctly parse an empty array", () => {
    const a = Parser.new(Lexer.new(JSON.stringify([]))).parseNext();
    const match = {
      type: "Array",
      value: [],
    };

    expect(a).toMatchObject(match);
  });

  test("It should correctly parse a flat array", () => {
    const a = Parser.new(
      Lexer.new(JSON.stringify([42, "test", true]))
    ).parseNext();
    const match = {
      type: "Array",
      value: [
        { type: "Number", value: 42 },
        { type: "String", value: "test" },
        { type: "Boolean", value: true },
      ],
    };

    expect(a).toMatchObject(match);
  });

  test("It should correctly parse an array with nesting", () => {
    const a = Parser.new(
      Lexer.new(JSON.stringify([42, "test", [true, 3.1415], "last"]))
    ).parseNext();
    const match = {
      type: "Array",
      value: [
        { type: "Number", value: 42 },
        { type: "String", value: "test" },
        {
          type: "Array",
          value: [
            { type: "Boolean", value: true },
            { type: "Number", value: 3.1415 },
          ],
        },
        { type: "String", value: "last" },
      ],
    };

    expect(a).toMatchObject(match);
  });
});

describe("Parse an object", () => {
  test("It should correctly parse an empty object", () => {
    const o = Parser.new(Lexer.new(JSON.stringify({}))).parseNext();
    const match = {
      type: "Object",
      value: [],
    };

    expect(o).toMatchObject(match);
  });

  test("It should correctly parse an object with properties", () => {
    const o = Parser.new(
      Lexer.new(JSON.stringify({ test: "hello", meaning: 42 }))
    ).parseNext();
    const match = {
      type: "Object",
      value: [
        { name: "test", value: "hello" },
        { name: "meaning", value: 42 },
      ],
    };
  });

  test("It should correctly parse an object with an array for a property", () => {
    const o = Parser.new(
      Lexer.new(JSON.stringify({ arr: [1, 2, 3], hi: "there" }))
    ).parseObject();
    const match = {
      type: "Object",
      value: [
        {
          name: "arr",
          value: {
            type: "Array",
            value: [
              { type: "Number", value: 1 },
              { type: "Number", value: 2 },
              { type: "Number", value: 3 },
            ],
          },
        },
        { name: "hi", value: { type: "String", value: "there" } },
      ],
    };

    expect(o).toMatchObject(match);
  });

  test("It should correctly parse an object with an object for a property", () => {
    const o = Parser.new(
      Lexer.new(JSON.stringify({ obj: { test: "hello" }, num: 47 }))
    ).parseNext();
    const match = {
      type: "Object",
      value: [
        {
          name: "obj",
          value: {
            type: "Object",
            value: [
              { name: "test", value: { type: "String", value: "hello" } },
            ],
          },
        },
        { name: "num", value: { type: "Number", value: 47 } },
      ],
    };

    expect(o).toMatchObject(match);
  });
});

describe("Exported parse function should work correctly", () => {
  test("Parse a complex object", () => {
    const o = parse(
      JSON.stringify({
        hi: "there",
        obj: { meaning: 42 },
        arr: [1, 2],
        bool: true,
        nil: null,
        evv: {
          coords: {
            x: 38.0434,
            y: -87.5272,
          },
        },
      })
    );
    const match = {
      type: "Object",
      value: [
        { name: "hi", value: { type: "String", value: "there" } },
        {
          name: "obj",
          value: {
            type: "Object",
            value: [{ name: "meaning", value: { type: "Number", value: 42 } }],
          },
        },
        {
          name: "arr",
          value: {
            type: "Array",
            value: [
              { type: "Number", value: 1 },
              { type: "Number", value: 2 },
            ],
          },
        },
        { name: "bool", value: { type: "Boolean", value: true } },
        { name: "nil", value: { type: "Null", value: null } },
        {
          name: "evv",
          value: {
            type: "Object",
            value: [
              {
                name: "coords",
                value: {
                  type: "Object",
                  value: [
                    { name: "x", value: { type: "Number", value: 38.0434 } },
                    { name: "y", value: { type: "Number", value: -87.5272 } },
                  ],
                },
              },
            ],
          },
        },
      ],
    };

    expect(o).toMatchObject(match);
  });
});
