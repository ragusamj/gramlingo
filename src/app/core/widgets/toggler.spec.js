import test from "tape";
import Dom from "../mock/dom";
import BrowserEvent from "../browser-event";
import Toggler from "./toggler";

const html =
"<div data-toggler-on='a' data-toggler-off='b'>" +
    "<button id='a' data-toggler></button>" +
    "<button id='b' data-toggler></button>" +
"</div>";

test("Toggler should find all togglers on the event 'dom-content-changed'", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        new Toggler(browserEvent);

        browserEvent.emit("dom-content-changed");

        let off = document.getElementById("b");
        t.equal(off.style.display, "none");
        t.end();
    });
});

test("Toggler should toggle on the event 'click'", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let on = document.getElementById("a");

        new Toggler(browserEvent).onDomContentChanged();
        on.dispatchEvent(new Event("click"));

        t.equal(on.style.display, "none");
        t.end();
    });
});

test("Toggler should ignore elements without the attribute 'data-toggler' on the event 'click'", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let on = document.getElementById("a");
        on.removeAttribute("data-toggler");

        new Toggler(browserEvent).onDomContentChanged();
        on.dispatchEvent(new Event("click"));

        t.equal(on.style.display, "");
        t.end();
    });
});

test("Toggler should toggle", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let on = document.getElementById("a");
        let off = document.getElementById("b");

        new Toggler(browserEvent).onDomContentChanged();

        on.dispatchEvent(new Event("click"));
        t.equal(on.style.display, "none");
        t.equal(off.style.display, "");

        off.dispatchEvent(new Event("click"));
        t.equal(on.style.display, "");
        t.equal(off.style.display, "none");

        t.end();
    });
});

test("Toggler should use initial state if set", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let on = document.getElementById("a");
        let off = document.getElementById("b");
        on.parentElement.setAttribute("data-toggler-state", "off");

        new Toggler(browserEvent).onDomContentChanged();

        t.equal(on.style.display, "none");
        t.equal(off.style.display, "");

        t.end();
    });
});
