import test from "tape";
import IntegerGenerator from "./integer-generator";

test("IntegerGenerator should randomize between min and max", (t) => {
    let random = new IntegerGenerator().randomize(1, 10);
    t.true(random >= 1 && random <= 10);
    t.end();
});
