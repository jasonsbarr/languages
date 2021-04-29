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
