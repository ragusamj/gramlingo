import sinon from "sinon";
import test from "tape";
import Dom from "../mock/dom";
import BrowserEvent from "../browser-event";
import Router from "./router";

const route = {};
const finder = {};
const broker = {};

// navigation isn't implemented in jsdom yet, so no window.location = "/foo/bar" :(
// https://github.com/tmpvar/jsdom/issues/1717

test("Router should push state on event 'url-change'", (t) => {
    Dom.sandbox("", {}, () => {

        // navigation isn't implemented in jsdom yet :(
        // https://github.com/tmpvar/jsdom/issues/1565
        window.history.pushState = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        browserEvent.emit("url-change", "/");

        t.deepEqual(window.history.pushState.lastCall.args, [ {}, "", "/" ]);
        t.end();
    });
});

test("Router should find the route that matches the address bar on event 'DOMContentLoaded'", (t) => {
    Dom.sandbox("", { url: "http://example.com/page" }, () => {

        finder.getRoute = sinon.stub().returns(route);
        broker.go = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        window.dispatchEvent(new Event("DOMContentLoaded"));

        t.deepEqual(finder.getRoute.firstCall.args, ["/page"]);
        t.end();
    });
});

test("Router should go to the route that matches the address bar on event 'DOMContentLoaded'", (t) => {
    Dom.sandbox("", {}, () => {

        finder.getRoute = sinon.stub().returns(route);
        broker.go = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        window.dispatchEvent(new Event("DOMContentLoaded"));

        t.deepEqual(broker.go.firstCall.args, [route]);
        t.end();
    });
});

test("Router should find the route that matches the address bar on event 'popstate'", (t) => {
    Dom.sandbox("", { url: "http://example.com/page" }, () => {

        finder.getRoute = sinon.stub().returns(route);
        broker.go = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        window.dispatchEvent(new Event("popstate"));

        t.deepEqual(finder.getRoute.firstCall.args, ["/page"]);
        t.end();
    });
});

test("Router should go to the route that matches the address bar on event 'popstate'", (t) => {
    Dom.sandbox("", {}, () => {

        finder.getRoute = sinon.stub().returns(route);
        broker.go = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        window.dispatchEvent(new Event("popstate"));

        t.deepEqual(broker.go.firstCall.args, [route]);
        t.end();
    });
});

test("Router should find the route that matches the address bar on event 'click'", (t) => {
    Dom.sandbox("<a href='/page' data-route-link></a>", { url: "http://example.com" }, () => {

        finder.getRoute = sinon.stub().returns(route);
        broker.go = sinon.stub();
        window.history.pushState = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        let a = document.querySelector("a");
        a.dispatchEvent(new Event("click"));

        t.deepEqual(finder.getRoute.firstCall.args, ["/page"]);
        t.end();
    });
});

test("Router should go to the route that matches the address bar on event 'click'", (t) => {
    Dom.sandbox("<a href='/page' data-route-link></a>", { url: "http://example.com" }, () => {

        finder.getRoute = sinon.stub().returns(route);
        broker.go = sinon.stub();
        window.history.pushState = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        let a = document.querySelector("a");
        a.dispatchEvent(new Event("click"));

        t.deepEqual(broker.go.firstCall.args, [route]);
        t.end();
    });
});

test("Router should ignore the event 'click' if route matches", (t) => {
    Dom.sandbox("<a href='/page' data-route-link></a>", { url: "http://example.com" }, () => {

        finder.getRoute = sinon.stub().returns(undefined);
        broker.go = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        let a = document.querySelector("a");
        a.dispatchEvent(new Event("click"));

        t.false(broker.go.called);
        t.end();
    });
});

test("Router should ignore the event 'click' from elements without the attribute 'data-route-link'", (t) => {
    Dom.sandbox("<a href='/page'></a>", { url: "http://example.com" }, () => {

        broker.go = sinon.stub();
        let browserEvent = new BrowserEvent();
        new Router(browserEvent, finder, broker);

        let a = document.querySelector("a");
        a.dispatchEvent(new Event("click"));

        t.false(broker.go.called);
        t.end();
    });
});
