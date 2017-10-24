import test from "tape";
import dice from "./dice-coefficient";

const data = [
    [undefined,   "",          1,                  "not equal, undefined"],
    ["",          "",          1,                  "equal, empty"],
    ["a",         "a",         1,                  "equal, one character"],
    ["a",         "b",         0,                  "not equal, one character"],
    ["",          "b",         0,                  "not equal, a empty"],
    ["a",         "",          0,                  "not equal, b empty"],
    ["A",         "a",         1,                  "equal, one character, case sensitive"],
    ["wrench",    "garage",    0,                  "not equal"],
    ["the same",  "the same",  1,                  "equal"],
    ["UPPERCASE", "uppercase", 1,                  "equal, case sensitive"],
    ["reading",   "heading",   0.8333333333333334, "similar, same length"],
    ["n-gram",    "bi-gram",   0.7272727272727273, "similar, different length, ab"],
    ["bi-gram",   "n-gram",    0.7272727272727273, "similar, different length, ba"],
    ["night",     "nacht",     0.25,               "similar, same first and last"],
    ["this phrase has words", "this phrase has extra words", 0.8780487804878049, "similar, extra word, ab"],
    ["this phrase has extra words", "this phrase has words", 0.8780487804878049, "similar, extra word, ba"]
];

test("dice-coefficient should compare two strings", (t) => {

    for(let x of data) {
        let actual = dice(x[0], x[1]);
        t.equal(actual, x[2], x[3]);
    }

    t.end();
});