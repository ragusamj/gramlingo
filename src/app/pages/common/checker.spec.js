import test from "tape";
import Dom from "../../core/mock/dom";
import Checker from "./checker";

const checker = new Checker();

test("Checker should mark empty answer", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check([], "");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: ""
        });
        t.end();
    });
});

test("Checker should accept correct answer with no solutions", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["voy"], "voy");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "voy",
            solution: "voy"
        });
        t.end();
    });
});

test("Checker should accept correct answer with solutions", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["fuera", "fuese"], "fuera");
        t.deepEqual(result, {
            accepted: true,
            alternatives: ["fuese"],
            answer: "fuera",
            solution: "fuera"
        });
        t.end();
    });
});

test("Checker should accept correct answer of type number with solutions", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check([123], "123");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "123",
            solution: 123
        });
        t.end();
    });
});

test("Checker should ignore case", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["voy"], "Voy");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "Voy",
            solution: "voy"
        });
        t.end();
    });
});

test("Checker should accept correct answer with extra whitespace", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["cuarenta y cinco"], "  cuarenta  y  cinco   ");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "  cuarenta  y  cinco   ",
            solution: "cuarenta y cinco"
        });
        t.end();
    });
});

test("Checker should sanitize input and accept correct answer", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["bañé"], "#&ºbañé..,");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "#&ºbañé..,",
            solution: "bañé"
        });
        t.end();
    });
});

test("Checker should sanitize input and accept time spans", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["12:34"], "12:34");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "12:34",
            solution: "12:34"
        });
        t.end();
    });
});

test("Checker should sanitize input and accept fractions", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["1/2"], "1/2");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "1/2",
            solution: "1/2"
        });
        t.end();
    });
});

test("Checker should reject incorrect answer", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["vamos"], "vamo");
        t.deepEqual(result, {
            accepted: false,
            alternatives: [],
            answer: "vamo",
            diff: [[ 0, "vamo" ], [-1, "s"]],
            solution: "vamos"
        });
        t.end();
    });
});

test("Checker should reject incorrect answer with solutions", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["vayamos", "vamos"], "vamo");
        t.deepEqual(result, {
            accepted: false,
            alternatives: ["vayamos", "vamos"],
            answer: "vamo",
            diff: [[0, "vamo"], [-1, "s"]],
            solution: "vamos"
        });
        t.end();
    });
});

test("Checker should reject incorrect answer with solutions and choose most similar correct solution", (t) => {
    Dom.sandbox("", {}, () => {
        let result = checker.check(["fuese", "fuera"], "fueses");
        t.deepEqual(result, {
            accepted: false,
            alternatives: ["fuese", "fuera"],
            answer: "fueses",
            diff: [[0, "fuese"], [1, "s"]],
            solution: "fuese"
        });
        t.end();
    });
});
