import test from "tape";
import Dom from "./mock/dom";
import BrowserEvent from "./browser-event";

const browserEvent = new BrowserEvent();

test("BrowserEvent should register event", (t) => {
    Dom.sandbox("", {}, () => {
        t.plan(1);
        browserEvent.on("keydown", () => {
            t.assert(true);
        });
        document.dispatchEvent(new Event("keydown"));
    });
});

test("BrowserEvent should handle multiple listeners", (t) => {
    Dom.sandbox("", {}, () => {
        t.plan(2);
        browserEvent.on("mouseover", () => {
            t.assert(true);
        });
        browserEvent.on("mouseover", () => {
            t.assert(true);
        });
        document.dispatchEvent(new Event("mouseover"));
    });
});

test("BrowserEvent should remove listener", (t) => {
    Dom.sandbox("", {}, () => {
        let removeListener = browserEvent.on("mouseout", () => {
            t.fail();
        });
        removeListener();
        document.dispatchEvent(new Event("mouseout"));
        t.end();
    });
});

test("BrowserEvent should emit event using CustomEvent", (t) => {
    Dom.sandbox("", {}, () => {
        t.plan(1);
        browserEvent.on("custom-event", () => {
            t.assert(true);
        });
        browserEvent.emit("custom-event");
    });
});

test("BrowserEvent should emit event using the old way", (t) => {
    Dom.sandbox("", {}, () => {
        t.plan(1);
        delete window.CustomEvent;
        browserEvent.on("custom-event-the-old-way", () => {
            t.assert(true);
        });
        browserEvent.emit("custom-event-the-old-way");
    });
});