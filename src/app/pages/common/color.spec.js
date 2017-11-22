import test from "tape";
import Color from "./color";

test("Color should return color scheme", (t) => {
    t.equal(Color.scheme().blue, "#007bff");
    t.end();
});

test("Color should shade a color by 0", (t) => {
    t.equal(Color.shade("#ff0000", 0), "#ff0000");
    t.end();
});

test("Color should shade a color by 0.5", (t) => {
    t.equal(Color.shade("#009900", 0.5), "#80cc80");
    t.end();
});

test("Color should shade color by -0.5", (t) => {
    t.equal(Color.shade("#000099", -0.5), "#00004d");
    t.end();
});

test("Color should convert hex color to RGB, #000000", (t) => {
    t.deepEqual(Color.rgb("#000000"), { r: 0, g: 0, b: 0 });
    t.end();
});

test("Color should convert hex color to RGB, #7f7f7f", (t) => {
    t.deepEqual(Color.rgb("#7f7f7f"), { r: 127, g: 127, b: 127 });
    t.end();
});

test("Color should convert hex color to RGB, #ffffff", (t) => {
    t.deepEqual(Color.rgb("#ffffff"), { r: 255, g: 255, b: 255 });
    t.end();
});

test("Color should convert hex color to vec4, #aaaaaa", (t) => {
    t.deepEqual(Color.vec4("#aaaaaa", 1), [0.6666666666666666, 0.6666666666666666, 0.6666666666666666, 1]);
    t.end();
});

test("Color should convert hex color to vec4, #ffffff", (t) => {
    t.deepEqual(Color.vec4("#ffffff", 0.5), [1, 1, 1, 0.5]);
    t.end();
});
