import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../browser-event";
import PageBroker from "./page-broker";

const browserEvent = new BrowserEvent();
sinon.spy(browserEvent, "emit");

const http = {
    getHTML: sinon.stub().yields("<div id='template'></div>")
};

test("PageBroker should emit the event 'page-change-start'", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-change-start", "/page"]);
        t.end();
    });
});

test("PageBroker should get the page template for a route", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);

        t.true(http.getHTML.calledWith("/page.html"));
        t.end();
    });
});

test("PageBroker should cache the page template for a route", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);
        t.true(http.getHTML.calledWith("/page.html"));

        broker.go(route);
        http.getHTML = sinon.stub().yields("<div id='template'></div>");

        t.false(http.getHTML.calledWith("/page.html"));
        t.end();
    });
});

test("PageBroker should attach a page", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let clock = sinon.useFakeTimers();
        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);
        clock.tick();

        t.true(route.page.attach.called);
        t.end();
    });
});

test("PageBroker should attach a page with a fresh template", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let template;
        let clock = sinon.useFakeTimers();
        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: (pageTemplate) => {
            pageTemplate.add("template", "DIV");
            template = pageTemplate;
        } }, path: "/page", template: "/page.html" };

        broker.go(route);
        clock.tick();
        t.equal(template.querySelector("#template").innerHTML, "<div></div>");

        broker.go(route);
        clock.tick();
        t.equal(template.querySelector("#template").innerHTML, "<div></div>");

        t.end();
    });
});

test("PageBroker should add a page template to a placeholder element", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let clock = sinon.useFakeTimers();
        let broker = new PageBroker(browserEvent, http, "placeholder");
        let route = { page: { attach: sinon.stub() }, path: "/page", template: "/page.html" };

        broker.go(route);
        clock.tick();
        route.page.attach.yield();

        t.equal(document.querySelector("div").outerHTML, "<div id=\"placeholder\"><div id=\"template\"></div></div>");
        t.end();
    });
});

test("PageBroker should emit the event 'page-change-success'", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

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

test("PageBroker should emit the event 'dom-content-changed'", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

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

test("PageBroker should detach a page", (t) => {
    dom.sandbox("<div id='placeholder'></div>", {}, () => {

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
