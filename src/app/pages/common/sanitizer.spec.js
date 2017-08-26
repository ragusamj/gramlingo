import test from "tape";
import Sanitizer from "./sanitizer";

test("Checker should sanitize string and only leave spanish characters", (t) => {
    t.equal(Sanitizer.sanitize("#&abc123ÁáÉéÍíÓóÚúüÑñªº..,û"), "abc123ÁáÉéÍíÓóÚúüÑñªº");
    t.end();
});

test("Checker should sanitize string and trim multiple whitespaces", (t) => {
    t.equal(Sanitizer.sanitize("abc    123"), "abc 123");
    t.end();
});

test("Checker should sanitize string and leave :", (t) => {
    t.equal(Sanitizer.sanitize("12:34"), "12:34");
    t.end();
});

test("Checker should sanitize string and leave /", (t) => {
    t.equal(Sanitizer.sanitize("3/4"), "3/4");
    t.end();
});