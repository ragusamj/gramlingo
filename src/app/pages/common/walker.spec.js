import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../core/browser-event";
import Dom from "../../core/mock/dom";
import Walker from "./walker";

const browserEvent = new BrowserEvent();
sinon.spy(browserEvent, "on");

test("Walker should listen to the 'page-field-list-updated' event", (t) => {
    Dom.sandbox("", {}, () => {
        new Walker(browserEvent);
        t.true(browserEvent.on.calledWith("page-field-list-updated"));
        t.end();
    });
});

test("Walker should listen to the 'keydown' event", (t) => {
    Dom.sandbox("", {}, () => {
        new Walker(browserEvent);
        t.true(browserEvent.on.calledWith("keydown"));
        t.end();
    });
});

test("Walker should link", (t) => {
    Dom.sandbox("<input id='input-1'/><input id='input-2'/>", {}, () => {

        let walker = new Walker(browserEvent);
        let elements = {
            "input-1": {},
            "input-2": {}
        };

        walker.link({ detail: elements });

        t.deepEqual(walker._linkedList, { "input-1": { next: "input-2", previous: undefined }, "input-2": { previous: "input-1" } });
        t.end();
    });
});

test("Walker should not link disabled elements", (t) => {
    Dom.sandbox("<input id='input-1'/><input id='input-2' disabled/><input id='input-3'/>", {}, () => {

        let walker = new Walker(browserEvent);
        let elements = {
            "input-1": {},
            "input-2": {},
            "input-3": {}
        };

        walker.link({ detail: elements });

        t.deepEqual(walker._linkedList, { "input-1": { next: "input-3", previous: undefined }, "input-3": { previous: "input-1" } });
        t.end();
    });
});