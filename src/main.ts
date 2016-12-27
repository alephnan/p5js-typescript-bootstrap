///<reference path="p5.d.ts" />

import { helperFunction } from './helper';

var sketch = function (p : p5) {
  p.setup = function () {
    console.log(helperFunction("Foo"));
    
    p.createCanvas(600, 400);
  };
};

// TODO(freefood): fix data.json to have more explicit type 
new p5(sketch, false, false);