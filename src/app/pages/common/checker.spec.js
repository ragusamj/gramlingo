import test from "tape";
import Dom from "../../core/mock/dom";
import Checker from "./checker";

const checker = new Checker();

test("Checker should mark empty answer", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check([], "");
        t.deepEqual(result, { accepted: true, alternatives: [] });
        t.end();
    });
});

test("Checker should accept correct answer with no alternatives", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["voy"], "voy");
        t.deepEqual(result, { accepted: true, alternatives: [] });
        t.end();
    });
});

test("Checker should accept correct answer with alternatives", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["fuera", "fuese"], "fuera");
        t.deepEqual(result, { accepted: true, alternatives: ["fuese"] });
        t.end();
    });
});

test("Checker should ignore case", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["voy"], "Voy");
        t.deepEqual(result, { accepted: true, alternatives: [] });
        t.end();
    });
});

test("Checker should accept correct answer with extra whitespace", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["cuarenta y cinco"], "  cuarenta  y  cinco   ");
        t.deepEqual(result, { accepted: true, alternatives: [] });
        t.end();
    });
});

test("Checker should sanitize input and accept correct answer", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["bañé"], "#&ºbañé..,");
        t.deepEqual(result, { accepted: true, alternatives: [] });
        t.end();
    });
});

test("Checker should reject incorrect answer", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["vamos"], "vamo");
        t.deepEqual(result, {
            accepted: false,
            alternatives: [],
            diff: [[ 0, "vamo" ], [-1, "s"]]
        });
        t.end();
    });
});

test("Checker should reject incorrect answer with alternatives", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["vayamos", "vamos"], "vamo");
        t.deepEqual(result, {
            accepted: false,
            alternatives: ["vayamos", "vamos"],
            diff: [[0, "vamo"], [-1, "s"]]
        });
        t.end();
    });
});

test("Checker should reject incorrect answer with alternatives and choose most similar correct alternative", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["fuese", "fuera"], "fueses");
        t.deepEqual(result, {
            accepted: false,
            alternatives: ["fuese", "fuera"],
            diff: [[0, "fuese"], [1, "s"]]
        });
        t.end();
    });
});
