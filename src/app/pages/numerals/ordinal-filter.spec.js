import test from "tape";
import filter from "./ordinal-filter";

test("OrdinalFilter should add an ordinal sign if the first solution has an ordinal sign, feminine", (t) => {
    
    let element = { value: "3" };
    let solutions = ["3ª"];
    
    filter(element, solutions);
    
    t.deepEqual(element.value, "3ª");
    t.end();
});

test("OrdinalFilter should add an ordinal sign if the first solution has an ordinal sign, masculine", (t) => {
    
    let element = { value: "3" };
    let solutions = ["3º"];
    
    filter(element, solutions);
    
    t.deepEqual(element.value, "3º");
    t.end();
});

test("OrdinalFilter should not add an ordinal sign if the first solution doesn't have an ordinal sign", (t) => {
    
    let element = { value: "3" };
    let solutions = ["3"];
    
    filter(element, solutions);
    
    t.deepEqual(element.value, "3");
    t.end();
});

test("OrdinalFilter should not add an ordinal sign if the element value already has an ordinal sign", (t) => {
    
    let element = { value: "3ª" };
    let solutions = ["3ª"];
    
    filter(element, solutions);
    
    t.deepEqual(element.value, "3ª");
    t.end();
});


test("OrdinalFilter should ignore elements without the property 'value'", (t) => {

    let element = {};
    let solutions = ["3ª"];

    filter(element, solutions);

    t.end();
});
