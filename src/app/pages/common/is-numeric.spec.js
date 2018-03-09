import test from "tape";
import IsNumeric from "./is-numeric";

test("IsNumeric should return true for 123", (t) => {
    t.true(IsNumeric(123));
    t.end();
});

test("IsNumeric should return false for a string", (t) => {
    t.false(IsNumeric(""));
    t.end();
});
