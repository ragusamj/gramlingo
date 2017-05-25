import test from "tape";
import Dom from "../../core/mock/dom";
import Walker from "./walker";

test("Walker should link", (t) => {
    Dom.sandbox("<input id='input-1'/><input id='input-2'/>", {}, () => {

        let walker = new Walker();
        let elements = {
            "input-1": {},
            "input-2": {}
        };

        walker.link(elements);

        t.deepEqual(walker._linkedList, { "input-1": { next: "input-2", previous: undefined }, "input-2": { previous: "input-1" } });
        t.end();
    });
});

test("Walker should not link disabled elements", (t) => {
    Dom.sandbox("<input id='input-1'/><input id='input-2' disabled/><input id='input-3'/>", {}, () => {

        let walker = new Walker();
        let elements = {
            "input-1": {},
            "input-2": {},
            "input-3": {}
        };

        walker.link(elements);

        t.deepEqual(walker._linkedList, { "input-1": { next: "input-3", previous: undefined }, "input-3": { previous: "input-1" } });
        t.end();
    });
});
