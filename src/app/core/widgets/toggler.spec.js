import test from "tape";
import Dom from "../mock/dom";
import BrowserEvent from "../browser-event";
import Toggler from "./toggler";

const html =
"<button data-toggler data-toggler-on='on' data-toggler-off='off' data-toggler-expand-area='expand'>" +
    "<span id='on'>On</span>" +
    "<span id='off'>Off</button>" +
"</button>" + 
"<div id='expand'>Expand</div>";

test("Toggler should find all togglers on the event 'dom-content-changed'", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        new Toggler(browserEvent);

        browserEvent.emit("dom-content-changed");

        let off = document.getElementById("off");
        t.equal(off.style.display, "none");
        t.end();
    });
});

test("Toggler should toggle on the event 'click'", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let button = document.querySelector("[data-toggler]");
        let on = document.getElementById("on");

        new Toggler(browserEvent).onDomContentChanged();
        button.dispatchEvent(new Event("click"));

        t.equal(on.style.display, "none");
        t.end();
    });
});

test("Toggler should ignore elements without the attribute 'data-toggler' on the event 'click'", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let button = document.querySelector("[data-toggler]");
        button.removeAttribute("data-toggler");
        let on = document.getElementById("on");

        new Toggler(browserEvent).onDomContentChanged();
        button.dispatchEvent(new Event("click"));

        t.equal(on.style.display, "");
        t.end();
    });
});

test("Toggler should toggle", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let button = document.querySelector("[data-toggler]");
        let on = document.getElementById("on");
        let off = document.getElementById("off");

        new Toggler(browserEvent).onDomContentChanged();

        button.dispatchEvent(new Event("click"));
        t.equal(on.style.display, "none");
        t.equal(off.style.display, "");

        button.dispatchEvent(new Event("click"));
        t.equal(on.style.display, "");
        t.equal(off.style.display, "none");

        t.end();
    });
});

test("Toggler should allow toggle with only on/off specified, no expand area", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let button = document.querySelector("[data-toggler]");
        button.removeAttribute("data-toggler-expand-area");
        let on = document.getElementById("on");
        let off = document.getElementById("off");

        new Toggler(browserEvent).onDomContentChanged();

        button.dispatchEvent(new Event("click"));
        t.equal(on.style.display, "none");
        t.equal(off.style.display, "");

        t.end();
    });
});

test("Toggler should allow toggle with only an expand area specified, no on/off", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let button = document.querySelector("[data-toggler]");
        button.removeAttribute("data-toggler-on");
        button.removeAttribute("data-toggler-off");
        let expand = document.getElementById("expand");

        new Toggler(browserEvent).onDomContentChanged();

        button.dispatchEvent(new Event("click"));
        t.equal(expand.style.height, "");

        button.dispatchEvent(new Event("click"));
        t.equal(expand.style.height, "0px");

        t.end();
    });
});

test("Toggler should use initial state if set", (t) => {
    Dom.sandbox(html, {}, () => {
        let browserEvent = new BrowserEvent();
        let button = document.querySelector("[data-toggler]");
        button.setAttribute("data-toggler-state", "off");
        let on = document.getElementById("on");
        let off = document.getElementById("off");

        new Toggler(browserEvent).onDomContentChanged();

        t.equal(on.style.display, "none");
        t.equal(off.style.display, "");

        t.end();
    });
});