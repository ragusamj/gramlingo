import dom from "jsdom-sandbox";
import test from "tape";
import BrowserEvent from "./browser-event";

test("BrowserEvent should register an event", (t) => {
    dom.sandbox("", {}, () => {
        const browserEvent = new BrowserEvent();
        t.plan(1);
        browserEvent.on("keydown", () => {
            t.pass();
        });
        document.dispatchEvent(new Event("keydown"));
    });
});

test("BrowserEvent should handle multiple listeners", (t) => {
    dom.sandbox("", {}, () => {
        const browserEvent = new BrowserEvent();
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

test("BrowserEvent should remove a listener", (t) => {
    dom.sandbox("", {}, () => {
        const browserEvent = new BrowserEvent();
        let removeListener = browserEvent.on("mouseout", () => {
            t.fail();
        });
        removeListener();
        document.dispatchEvent(new Event("mouseout"));
        t.end();
    });
});

test("BrowserEvent should remove multiple listeners, regardless of in which order they were added", (t) => {
    dom.sandbox("", {}, () => {
        const browserEvent = new BrowserEvent();
        t.plan(1);

        let removeFirst = browserEvent.on("keydown", () => {
            t.fail();
        });
        let removeSecond = browserEvent.on("keydown", () => {
            t.fail();
        });
        browserEvent.on("keydown", () => {
            t.pass();
        });

        removeFirst();
        removeSecond();

        document.dispatchEvent(new Event("keydown"));
    });
});

test("BrowserEvent should emit event using CustomEvent", (t) => {
    dom.sandbox("", {}, () => {
        const browserEvent = new BrowserEvent();
        t.plan(1);
        browserEvent.on("custom-event", () => {
            t.pass();
        });
        browserEvent.emit("custom-event");
    });
});
