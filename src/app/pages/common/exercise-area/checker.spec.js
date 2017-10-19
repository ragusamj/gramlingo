import dom from "jsdom-sandbox";
import test from "tape";
import Checker from "./checker";

const checker = new Checker();

test("Checker should mark an empty answer", (t) => {
    dom.sandbox("", {}, () => {
        let result = checker.check([], "");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: ""
        });
        t.end();
    });
});

test("Checker should accept a correct answer with no solutions", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should accept a correct answer with solutions", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should accept a correct answer of the type 'number' with solutions", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should ignore the case in an answer", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should ignore and preserve the case in a solution", (t) => {
    dom.sandbox("", {}, () => {
        let result = checker.check(["Voy"], "voy");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "voy",
            solution: "Voy"
        });
        t.end();
    });
});

test("Checker should accept a correct answer with extra whitespace", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should sanitize the input and accept a correct answer", (t) => {
    dom.sandbox("", {}, () => {
        let result = checker.check(["bañé"], "#&bañé..,");
        t.deepEqual(result, {
            accepted: true,
            alternatives: [],
            answer: "#&bañé..,",
            solution: "bañé"
        });
        t.end();
    });
});

test("Checker should sanitize the input and accept time spans", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should sanitize the input and accept fractions", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should reject an incorrect answer", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should reject an incorrect answer with solutions", (t) => {
    dom.sandbox("", {}, () => {
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

test("Checker should reject incorrect an answer with solutions and choose the most similar correct solution", (t) => {
    dom.sandbox("", {}, () => {
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
