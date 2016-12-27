///<reference path="p5.d.ts" />

var sketch = function (p : p5) {
  p.setup = function () {
    p.createCanvas(600, 400);
  };
};

// TODO(freefood): fix data.json to have more explicit type 
new p5(sketch, false, false);