# p5.js TypeScript Bootstrap

Includes gulp build to compile TS based sketch definitions, build step that auto-generates TS
definitions for p5.js, with support for p5 instance-mode, and relevant starter files.

This is convenient for auto-completion of p5.js

## Instructions
1. $ `npm install`
2. $ `gulp`

## TODOs
- Ensure all lines less than 100 characters. Add lint-checker?
- Reorder dependencies in package.json and gulpfile
- Add non-trivial bootstrap files for bootstrap
- To eliminate dependency on explicit library file path via npm. Build p5.js from source as bower package, then move lib/p5.js as gulp task?. Overkill?
- Add (minimal) tests
- Specify npm dependencies, with p5.js in particular, version explictly to known compatible version 