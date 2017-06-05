import sinon from "sinon";
import test from "tape";
import Walker from "./walker";

// window.getSelection isn't implemented in jsdom yet :(
// https://github.com/tmpvar/jsdom/issues/321
let setup = (elements) => {
    global.document = {
        getElementById: (id) => {
            return elements[id];
        }
    };
};

test("Walker should walk to previous element when up arrow is pressed", (t) => {

    let walker = new Walker();
    let elements = {
        "input-1": { select: sinon.stub() },
        "input-2": {}
    };

    setup(elements);

    walker.link(Object.keys(elements));
    walker.walk(walker.KeyCode.upArrow, "input-2");

    t.true(elements["input-1"].select.called);
    t.end();
});

test("Walker should walk to previous element and skip disabled elements", (t) => {

    let walker = new Walker();
    let elements = {
        "input-1": { select: sinon.stub() },
        "input-2": { disabled: true },
        "input-3": {}
    };

    setup(elements);

    walker.link(Object.keys(elements));
    walker.walk(walker.KeyCode.upArrow, "input-3");

    t.true(elements["input-1"].select.called);
    t.end();
});

test("Walker should walk to next element when down arrow is pressed", (t) => {

    let walker = new Walker();
    let elements = {
        "input-1": {},
        "input-2": { select: sinon.stub() }
    };

    setup(elements);

    walker.link(Object.keys(elements));
    walker.walk(walker.KeyCode.downArrow, "input-1");

    t.true(elements["input-2"].select.called);
    t.end();
});

test("Walker should walk to next element when enter key is pressed", (t) => {

    let walker = new Walker();
    let elements = {
        "input-1": {},
        "input-2": { select: sinon.stub() }
    };

    setup(elements);

    walker.link(Object.keys(elements));
    walker.walk(walker.KeyCode.enter, "input-1");

    t.true(elements["input-2"].select.called);
    t.end();
});

test("Walker should walk to next element and skip disabled elements", (t) => {

    let walker = new Walker();
    let elements = {
        "input-1": { },
        "input-2": { disabled: true },
        "input-3": { select: sinon.stub() }
    };

    setup(elements);

    walker.link(Object.keys(elements));
    walker.walk(walker.KeyCode.downArrow, "input-1");

    t.true(elements["input-3"].select.called);
    t.end();
});

test("Walker should ignore unknown keys", (t) => {

    let walker = new Walker();
    let elements = {
        "input-1": { select: sinon.stub() },
        "input-2": { select: sinon.stub() }
    };

    setup(elements);

    walker.link(Object.keys(elements));
    walker.walk(15, "input-1");
    walker.walk(15, "input-2");

    t.false(elements["input-1"].select.called);
    t.false(elements["input-2"].select.called);
    t.end();
});
