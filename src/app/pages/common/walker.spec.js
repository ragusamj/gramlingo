import sinon from "sinon";
import test from "tape";
import ApplicationEvent from "../../core/application-event";
import BrowserEvent from "../../core/browser-event";
import Mocument from "../../core/mocks/mocument";
import Walker from "./walker";

const mocument = new Mocument();
const applicationEvent = new ApplicationEvent();
const browserEvent = new BrowserEvent();

sinon.spy(applicationEvent, "on");
sinon.spy(browserEvent, "on");

const walker = new Walker(applicationEvent, browserEvent);

test("walker should listen to the 'page-field-list-updated' application event", (t) => {
    t.true(applicationEvent.on.calledWith("page-field-list-updated"));
    t.end();
});

test("walker should listen to the 'keydown' browser event", (t) => {
    t.true(browserEvent.on.calledWith("keydown"));
    t.end();
});

test("walker should link", (t) => {

    let elements = {
        "input-1": {},
        "input-2": {}
    };

    mocument
        .mockElement("input-1", {})
        .mockElement("input-2", {});

    walker.link(elements);

    t.deepEqual(walker._linkedList, { "input-1": { next: "input-2", previous: undefined }, "input-2": { previous: "input-1" } });
    t.end();
});

test("walker should not link disabled elements", (t) => {

    let elements = {
        "input-1": {},
        "input-2": { disabled: true },
        "input-3": {}
    };

    mocument.mockElements(elements);

    walker.link(elements);

    t.deepEqual(walker._linkedList, { "input-1": { next: "input-3", previous: undefined }, "input-3": { previous: "input-1" } });
    t.end();
});
