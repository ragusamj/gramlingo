import dom from "jsdom-sandbox";
import test from "tape";
import BrowserEvent from "./browser-event";

const browserEvent = new BrowserEvent();

test("BrowserEvent should register event", (t) => {
    dom.sandbox("", {}, () => {
        t.plan(1);
        browserEvent.on("keydown", () => {
            t.pass();
        });
        document.dispatchEvent(new Event("keydown"));
    });
});

test("BrowserEvent should handle multiple listeners", (t) => {
    dom.sandbox("", {}, () => {
        t.plan(2);
        browserEvent.on("mouseover", () => {
            t.pass();
        });
        browserEvent.on("mouseover", () => {
            t.pass();
        });
        document.dispatchEvent(new Event("mouseover"));
    });
});

test("BrowserEvent should remove listener", (t) => {
    dom.sandbox("", {}, () => {
        let removeListener = browserEvent.on("mouseout", () => {
            t.fail();
        });
        removeListener();
        document.dispatchEvent(new Event("mouseout"));
        t.end();
    });
});

test("BrowserEvent should emit event using CustomEvent", (t) => {
    dom.sandbox("", {}, () => {
        t.plan(1);
        browserEvent.on("custom-event", () => {
            t.pass();
        });
        browserEvent.emit("custom-event");
    });
});

test("BrowserEvent should emit event using the old way", (t) => {
    dom.sandbox("", {}, () => {
        t.plan(1);
        delete window.CustomEvent;
        browserEvent.on("custom-event-the-old-way", () => {
            t.pass();
        });
        browserEvent.emit("custom-event-the-old-way");
    });
});
