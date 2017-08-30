import test from "tape";
import IntegerGenerator from "./integer-generator";

const generator = new IntegerGenerator();

test("IntegerGenerator should randomize", (t) => {
    let random = generator.random();
    t.true(random >= 0 && random <= 1);
    t.end();
});

test("IntegerGenerator should randomize range between min and max", (t) => {
    let random = generator.range(1, 10);
    t.true(random >= 1 && random <= 10);
    t.end();
});
