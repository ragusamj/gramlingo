import dom from "jsdom-sandbox";
import test from "tape";
import ElementWalker from "./element-walker";
import KeyCode from "./key-code";

test("ElementWalker should walk to previous element when up arrow is pressed", (t) => {
    dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);
        walker.currentElementId = "element-2";

        walker.walk(KeyCode.upArrow);

        t.equal(document.getElementById("element-1").className, "selected");
        t.end();
    });
});

test("ElementWalker should walk to next element when next arrow is pressed", (t) => {
    dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);
        walker.currentElementId = "element-1";

        walker.walk(KeyCode.downArrow);

        t.equal(document.getElementById("element-2").className, "selected");
        t.end();
    });
});

test("ElementWalker should default to the first element in the list", (t) => {
    dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);

        walker.walk(KeyCode.downArrow);

        t.equal(document.getElementById("element-1").className, "selected");
        t.end();
    });
});

test("ElementWalker should ignore unknown keys", (t) => {
    dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);

        walker.walk(15);

        t.equal(document.getElementById("element-1").className, "");
        t.equal(document.getElementById("element-2").className, "");
        t.end();
    });
});

test("ElementWalker should stop at the end of the list", (t) => {
    dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);

        walker.walk(KeyCode.downArrow);
        walker.walk(KeyCode.downArrow);
        walker.walk(KeyCode.downArrow);

        t.equal(document.getElementById("element-1").className, "");
        t.equal(document.getElementById("element-2").className, "selected");
        t.end();
    });
});

test("ElementWalker should ignore last visited element if it no longer exists", (t) => {
    dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);
        walker.currentElementId = "element-3";

        walker.walk(KeyCode.downArrow);

        t.equal(document.getElementById("element-1").className, "selected");
        t.end();
    });
});
