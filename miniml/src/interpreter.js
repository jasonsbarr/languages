import parse from "./parser.js";

const evaluate = (ast) => JSON.stringify(ast, null, 2);

export default (input) => evaluate(parse(input));
