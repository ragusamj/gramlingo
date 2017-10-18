import dom from "jsdom-sandbox";
import test from "tape";
import sinon from "sinon";
import BrowserEvent from "../browser-event";
import Toggler from "./toggler";

let browserEvent;

const html =
"<button data-toggler='toggler' data-toggler-on='on' data-toggler-off='off' data-toggler-expand-area='expand'>" +
    "<span id='on'>On</span>" +
    "<span id='off'>Off</button>" +
"</button>" + 
"<div id='expand'>Expand</div>";

const setup = (document) => {
    browserEvent = new BrowserEvent();
    document.createRange = () => {
        return {
            selectNodeContents: sinon.stub(),
            getBoundingClientRect: sinon.stub().returns({ bottom: 0, top: 0 })
        };
    };
};

test("Toggler should find all togglers on the event 'dom-content-changed'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let browserEvent = new BrowserEvent();
        new Toggler(browserEvent);

        browserEvent.emit("dom-content-changed");

        let off = document.getElementById("off");
        t.equal(off.style.display, "none");
        t.end();
    });
});

test("Toggler should toggle on the event 'click'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let button = document.querySelector("[data-toggler]");
        let on = document.getElementById("on");

        new Toggler(browserEvent).onDomContentChanged();
        button.dispatchEvent(new Event("click"));

        t.equal(on.style.display, "none");
        t.end();
    });
});

test("Toggler should emit the event 'toggle-success' on the event 'click'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        sinon.spy(browserEvent, "emit");
        let button = document.querySelector("[data-toggler]");

        new Toggler(browserEvent).onDomContentChanged();
        button.dispatchEvent(new Event("click"));

        t.deepEqual(browserEvent.emit.firstCall.args, ["toggle-success", { id: "toggler", state: "off" }]);
        t.end();
    });
});

test("Toggler should ignore elements without the attribute 'data-toggler' on the event 'click'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
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
    dom.sandbox(html, {}, () => {
        setup(document);
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

test("Toggler should toggle and save the item state, default", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let button = document.querySelector("[data-toggler]");

        new Toggler(browserEvent).onDomContentChanged();

        button.dispatchEvent(new Event("click"));
        t.equal(localStorage.getItem("toggler"), "off");

        t.end();
    });
});

test("Toggler should toggle and save the item state if the attribute 'data-toggler-save-state' is set to true", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let button = document.querySelector("[data-toggler]");
        button.setAttribute("data-toggler-save-state", "true");

        new Toggler(browserEvent).onDomContentChanged();

        button.dispatchEvent(new Event("click"));
        t.equal(localStorage.getItem("toggler"), "off");

        t.end();
    });
});

test("Toggler should toggle and not save the item state if the attribute 'data-toggler-save-state' is set to false", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let button = document.querySelector("[data-toggler]");
        button.setAttribute("data-toggler-save-state", "false");

        new Toggler(browserEvent).onDomContentChanged();

        button.dispatchEvent(new Event("click"));
        t.equal(localStorage.getItem("toggler"), undefined);

        t.end();
    });
});

test("Toggler should use saved state for items on the event 'dom-content-changed'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let on = document.getElementById("on");
        let off = document.getElementById("off");
        localStorage.setItem("toggler", "off");

        new Toggler(browserEvent).onDomContentChanged();

        t.equal(on.style.display, "none");
        t.equal(off.style.display, "");

        t.end();
    });
});

test("Toggler should allow toggle with only on/off specified, no expand area", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
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
    dom.sandbox(html, {}, () => {
        setup(document);
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

test("Toggler should set expand area overflow to 'initial' on the event 'transitionend' if state is 'on'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let expand = document.getElementById("expand");

        new Toggler(browserEvent).onDomContentChanged();
        expand.dispatchEvent(new Event("transitionend"));

        t.equal(expand.style.overflow, "initial");
        t.end();
    });
});

test("Toggler should set expand area overflow to '' on the event 'transitionend' if state is 'off'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let button = document.querySelector("[data-toggler]");
        let expand = document.getElementById("expand");

        new Toggler(browserEvent).onDomContentChanged();
        button.dispatchEvent(new Event("click"));
        expand.dispatchEvent(new Event("transitionend"));

        t.equal(expand.style.overflow, "");
        t.end();
    });
});

test("Toggler should handle an undefined toggler list on the event 'transitionend'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let expand = document.getElementById("expand");

        new Toggler(browserEvent);
        expand.dispatchEvent(new Event("transitionend"));

        t.equal(expand.style.overflow, "");
        t.end();
    });
});

test("Toggler should set expand area overflow to '' on the event 'click' if state is 'off'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let button = document.querySelector("[data-toggler]");
        let expand = document.getElementById("expand");

        new Toggler(browserEvent).onDomContentChanged();
        expand.dispatchEvent(new Event("transitionend"));
        button.dispatchEvent(new Event("click"));

        t.equal(expand.style.overflow, "");
        t.end();
    });
});

test("Toggler should ignore items without expand area on the event 'transitionend'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let button = document.querySelector("[data-toggler]");
        button.removeAttribute("data-toggler-expand-area");
        let expand = document.getElementById("expand");
        expand.style.overflow = "auto";

        new Toggler(browserEvent).onDomContentChanged();
        expand.dispatchEvent(new Event("transitionend"));

        t.equal(expand.style.overflow, "auto");
        t.end();
    });
});

test("Toggler should use initial state if set", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
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

test("Toggler should resize expand areas on the window event 'resize'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let expand = document.getElementById("expand");
        expand.style.height = "1px"; // layout isn't implemented in jsdom
        let clock = sinon.useFakeTimers();

        new Toggler(browserEvent).onDomContentChanged();
        window.dispatchEvent(new Event("resize"));

        clock.tick(100);
        t.equal(expand.style.height, "0px");

        t.end();
    });
});

test("Toggler should ignore items without expand areas on the window event 'resize'", (t) => {
    dom.sandbox(html, {}, () => {
        setup(document);
        let button = document.querySelector("[data-toggler]");
        button.removeAttribute("data-toggler-expand-area");
        let expand = document.getElementById("expand");
        expand.style.height = "0px"; // layout isn't implemented in jsdom
        let clock = sinon.useFakeTimers();

        new Toggler(browserEvent).onDomContentChanged();
        window.dispatchEvent(new Event("resize"));

        clock.tick(500);
        t.equal(expand.style.height, "0px");
        clock.tick(500);
        t.equal(expand.style.height, "0px");

        t.end();
    });
});
