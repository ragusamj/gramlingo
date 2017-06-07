import test from "tape";
import Dom from "../../../core/mock/dom";
import ElementWalker from "./element-walker";
import KeyCode from "./key-code";

test("ElementWalker should walk to previous element when up arrow is pressed", (t) => {
    Dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);
        walker.currentElementId = "element-2";

        walker.walk(KeyCode.upArrow);

        t.equal(document.getElementById("element-1").className, "selected");
        t.end();
    });
});

test("ElementWalker should walk to next element when next arrow is pressed", (t) => {
    Dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);
        walker.currentElementId = "element-1";

        walker.walk(KeyCode.downArrow);

        t.equal(document.getElementById("element-2").className, "selected");
        t.end();
    });
});

test("ElementWalker should default to the first element in the list", (t) => {
    Dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);

        walker.walk(KeyCode.downArrow);

        t.equal(document.getElementById("element-1").className, "selected");
        t.end();
    });
});

test("ElementWalker should ignore unknown keys", (t) => {
    Dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);

        walker.walk(15);

        t.equal(document.getElementById("element-1").className, "");
        t.equal(document.getElementById("element-2").className, "");
        t.end();
    });
});

test("ElementWalker should stop at the end of the list", (t) => {
    Dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
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
    Dom.sandbox("<div id='element-1'></div><div id='element-2'></div>", {}, () => {
        let walker = new ElementWalker();
        walker.link(["element-1", "element-2"]);
        walker.currentElementId = "element-3";

        walker.walk(KeyCode.downArrow);

        t.equal(document.getElementById("element-1").className, "selected");
        t.end();
    });
});

test("ElementWalker should consider down arrow a walkable key", (t) => {
    Dom.sandbox("", {}, () => {
        let walker = new ElementWalker();
        t.true(walker.isWalkable(KeyCode.downArrow));
        t.end();
    });
});

test("ElementWalker should consider down arrow a walkable key", (t) => {
    Dom.sandbox("", {}, () => {
        let walker = new ElementWalker();
        t.true(walker.isWalkable(KeyCode.upArrow));
        t.end();
    });
});

test("ElementWalker should not consider enter key a walkable key", (t) => {
    Dom.sandbox("", {}, () => {
        let walker = new ElementWalker();
        t.false(walker.isWalkable(KeyCode.enter));
        t.end();
    });
});
