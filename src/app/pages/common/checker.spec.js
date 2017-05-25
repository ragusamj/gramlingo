import test from "tape";
import Dom from "../../core/mock/dom";
import Checker from "./checker";

const checker = new Checker();

test("Checker should ignore empty answer", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check([], "");
        t.equal(undefined, result);
        t.end();
    });
});

test("Checker should ignore correct answer with no alternatives", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["voy"], "voy");
        t.equal(undefined, result);
        t.end();
    });
});

test("Checker should ignore case in answer and solution", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["voy"], "Voy");
        t.equal(undefined, result);
        t.end();
    });
});
