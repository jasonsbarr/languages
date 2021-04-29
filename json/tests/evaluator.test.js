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
