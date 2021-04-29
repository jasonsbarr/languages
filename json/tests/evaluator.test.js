const evaluate = require("../src/evaluator");

describe("Evaluating primitives", () => {
  test("It should properly evaluate a number", () => {
    expect(evaluate(JSON.stringify(42))).toEqual(42);
    expect(evaluate(JSON.stringify(3.1415))).toEqual(3.1415);
  });

  test("It should properly evaluate a string", () => {
    expect(evaluate(JSON.stringify("hello"))).toEqual("hello");
  });

  test("It should properly evaluate a boolean", () => {
    expect(evaluate(JSON.stringify(true))).toEqual(true);
    expect(evaluate(JSON.stringify(false))).toEqual(false);
  });

  test("It should properly evaluate null", () => {
    expect(evaluate(JSON.stringify(null))).toEqual(null);
  });
});

describe("Evaluating arrays", () => {
  test("Evaluate an empty array", () => {
    expect(evaluate(JSON.stringify([]))).toEqual([]);
  });

  test("Evaluate one-dimensional arrays", () => {
    expect(evaluate(JSON.stringify([1, 2, 3]))).toEqual([1, 2, 3]);
    expect(evaluate(JSON.stringify(["a", "b", "c"]))).toEqual(["a", "b", "c"]);
  });

  test("Evaluate two-dimensional arrays", () => {
    const json = JSON.stringify([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    const arr = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    expect(evaluate(json)).toEqual(arr);
  });
});

describe("Evaluating objects", () => {
  test("Evaluate an empty object", () => {
    expect(evaluate(JSON.stringify({}))).toEqual({});
  });

  test("Evaluate a simple object", () => {
    const json = JSON.stringify({ a: "hi", b: 42 });

    expect(evaluate(json)).toEqual({ a: "hi", b: 42 });
  });

  test("Evaluate an object with an array for a value", () => {
    const json = JSON.stringify({ arr: [1, 2, 3], test: "hello" });

    expect(evaluate(json)).toEqual({ arr: [1, 2, 3], test: "hello" });
  });

  test("Evaluate nested objects", () => {
    const json = JSON.stringify({
      obj: { x: 47, y: 42 },
      a: true,
      hi: "there",
    });

    expect(evaluate(json)).toEqual({
      obj: { x: 47, y: 42 },
      a: true,
      hi: "there",
    });
  });

  test("Evaluate a complex object", () => {
    const json = JSON.stringify({
      obj: {
        nested: true,
        obj2: { desc: "This is a nested nested object" },
        arr: [1, 2, 3, 4],
      },
      nil: null,
    });

    expect(evaluate(json)).toEqual({
      obj: {
        nested: true,
        obj2: { desc: "This is a nested nested object" },
        arr: [1, 2, 3, 4],
      },
      nil: null,
    });
  });
});
