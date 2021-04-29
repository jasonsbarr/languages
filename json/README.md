# JSON Parser

A simple interpreter that turns valid JSON strings into JavaScript objects by way of an abstract syntax tree.

Yes, the AST is a bit of overkill, but I'm focused on the process more than the result right now.

Obviously in a real project you'd just use `JSON.parse`, but this is a learning project.

Throws an error on invalid input.

Implementation language: JavaScript.

## Usage

To start the REPL, use `node src/repl.js`. Then simply enter your code. `JSON.stringify` is called on the input in the REPL, so you don't have to worry about the details of formatting. Just use JavaScript objects, arrays, and primitives.
