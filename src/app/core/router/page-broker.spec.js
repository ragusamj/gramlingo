import sinon from "sinon";
import test from "tape";
import Dom from "../mock/dom";
import BrowserEvent from "../browser-event";
import PageBroker from "./page-broker";

const browserEvent = new BrowserEvent();
sinon.spy(browserEvent, "emit");

const http = {
    getHTML: sinon.stub().yields("<p></p>")
};

test("PageBroker should emit event 'page-change-start'", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-change-start", "/page"]);
        t.end();
    });
});

test("PageBroker should get page template for route", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);

        t.true(http.getHTML.calledWith("/page.html"));
        t.end();
    });
});

test("PageBroker should cache page template for route", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);
        t.true(http.getHTML.calledWith("/page.html"));

        broker.go(route);
        http.getHTML = sinon.stub().yields("<p></p>");

        t.false(http.getHTML.calledWith("/page.html"));
        t.end();
    });
});

test("PageBroker should attach page", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let clock = sinon.useFakeTimers();
        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);
        clock.tick();

        t.true(route.page.attach.called);
        t.end();
    });
});

test("PageBroker should add page template to placeholder element", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let clock = sinon.useFakeTimers();
        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);
        clock.tick();
        route.page.attach.yield();

        t.equal(document.querySelector("div").outerHTML, "<div id=\"placeholder\"><p></p></div>");
        t.end();
    });
});

test("PageBroker should emit event 'page-change-success'", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let clock = sinon.useFakeTimers();
        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);
        browserEvent.emit.reset();
        clock.tick();
        route.page.attach.yield();

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-change-success", "/page"]);
        t.end();
    });
});

test("PageBroker should emit event 'dom-content-changed'", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let clock = sinon.useFakeTimers();
        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);
        browserEvent.emit.reset();
        clock.tick();
        route.page.attach.yield();

        t.deepEqual(browserEvent.emit.lastCall.args, ["dom-content-changed"]);
        t.end();
    });
});

test("PageBroker should detach page", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let clock = sinon.useFakeTimers();
        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };
        let lastRoute = { page: { detach: sinon.stub() } };
        broker.currentRoute = lastRoute;

        broker.go(route);
        clock.tick();

        t.true(lastRoute.page.detach.called);
        t.end();
    });
});
