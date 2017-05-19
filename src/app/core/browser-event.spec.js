import test from "tape";
import Mocument from "./mocks/mocument";
import BrowserEvent from "./browser-event";

const browserEvent = new BrowserEvent();
const mocument = new Mocument();

test("BrowserEvent should register event", (t) => {
    t.plan(1);
    browserEvent.on("mock-keydown", () => {
        t.assert(true);
    });
    mocument.body.fireEvent("mock-keydown");
});

test("BrowserEvent should handle multiple listeners", (t) => {
    t.plan(2);
    browserEvent.on("mock-mouseover", () => {
        t.assert(true);
    });
    browserEvent.on("mock-mouseover", () => {
        t.assert(true);
    });
    mocument.body.fireEvent("mock-mouseover");
});

test("BrowserEvent should remove listener", (t) => {
    let removeListener = browserEvent.on("mock-mouseout", () => {
        t.fail();
    });
    removeListener();
    mocument.body.fireEvent("mock-mouseout");
    t.end();
});
