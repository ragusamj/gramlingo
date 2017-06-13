import sinon from "sinon";
import test from "tape";
import Dom from "./mock/dom";
import BrowserEvent from "./browser-event";
import Router from "./router";

const browserEvent = new BrowserEvent();

const http = {
    getHTML: sinon.stub().yields("<div data-translate='message'></div>")
};

const i18n = {
    translateApplication: sinon.stub()
};

const routes  = {
    "/page": { page: {}, template: "/page.html", isDefault: true },
    "/another-page": { page: {}, template: "/another-page.html" }
};

test("Router should initialize on event 'DOMContentLoaded' and use default route", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {
        t.plan(1);
        let clock = sinon.useFakeTimers();

        routes["/page"].page.attach = (pageTemplate, onPageAttached) => {
            onPageAttached();
            t.true(http.getHTML.calledWith("/page.html"));
        };

        new Router(browserEvent, http, i18n, routes, "placeholder");
        document.dispatchEvent(new Event("DOMContentLoaded"));
        clock.tick();
    });
});

test("Router should initialize on event 'DOMContentLoaded' and set window.location.hash to default route", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {
        t.plan(1);
        let clock = sinon.useFakeTimers();

        routes["/page"].page.attach = (pageTemplate, onPageAttached) => {
            onPageAttached();
            t.equal(window.location.hash, "#/page");
        };

        new Router(browserEvent, http, i18n, routes, "placeholder");
        document.dispatchEvent(new Event("DOMContentLoaded"));
        clock.tick();
    });
});

test("Router should initialize on event 'DOMContentLoaded' and use route from address bar", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {
        t.plan(1);
        let clock = sinon.useFakeTimers();

        routes["/another-page"].page.attach = (pageTemplate, onPageAttached) => {
            onPageAttached();
            t.true(http.getHTML.calledWith("/another-page.html"));
        };

        new Router(browserEvent, http, i18n, routes, "placeholder");
        document.location.hash = "#/another-page";
        document.dispatchEvent(new Event("DOMContentLoaded"));
        clock.tick();
    });
});

test("Router should initialize on event 'DOMContentLoaded' and not load any page if no route is found", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {

        let clock = sinon.useFakeTimers();

        routes["/page"].isDefault = false;
        routes["/page"].page.attach = () => {
            t.fail();
        };

        new Router(browserEvent, http, i18n, routes, "placeholder");
        document.dispatchEvent(new Event("DOMContentLoaded"));
        clock.tick();

        t.end();
    });
});

test("Router should fetch template on event 'hashchange'", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {
        t.plan(1);
        let clock = sinon.useFakeTimers();

        routes["/another-page"].page.attach = sinon.stub();

        new Router(browserEvent, http, i18n, routes, "placeholder");
        document.location.hash = "#/another-page";
        window.dispatchEvent(new Event("hashchange"));

        t.true(http.getHTML.calledWith("/another-page.html"));
        clock.tick();
    });
});

test("Router should emit event 'route-change-start' before attaching page", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {
        t.plan(1);
 
        routes["/another-page"].page.attach = sinon.stub();

        browserEvent.on("route-change-start", (e) => {
            t.equal(e.detail, "/another-page");
        });

        new Router(browserEvent, http, i18n, routes, "placeholder");
        document.location.hash = "#/another-page";
        window.dispatchEvent(new Event("hashchange"));
    });
});

test("Router should emit event 'route-change-success' after attaching page", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {
        t.plan(1);
        let clock = sinon.useFakeTimers();

        routes["/another-page"].page.attach = (pageTemplate, onPageAttached) => {
            onPageAttached();
        };

        browserEvent.on("route-change-success", (e) => {
            t.equal(e.detail, "/another-page");
        });

        new Router(browserEvent, http, i18n, routes, "placeholder");
        document.location.hash = "#/another-page";
        window.dispatchEvent(new Event("hashchange"));
        clock.tick();
    });
});

test("Router should translate application", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {
        t.plan(1);

        let clock = sinon.useFakeTimers();

        routes["/another-page"].page.attach = (pageTemplate, onPageAttached) => {
            onPageAttached();
            t.true(i18n.translateApplication.called);
        };

        new Router(browserEvent, http, i18n, routes, "placeholder");
        document.location.hash = "#/another-page";
        window.dispatchEvent(new Event("hashchange"));
        clock.tick();
    });
});

test("Router should detach current page", (t) => {
    Dom.sandbox("<div id='placeholder'></div>", {}, () => {
 
        let clock = sinon.useFakeTimers();
        routes["/page"].page.attach = (pageTemplate, onPageAttached) => {
            onPageAttached();
        };
        routes["/page"].page.detach = sinon.stub();
        routes["/another-page"].page.attach = sinon.stub();

        new Router(browserEvent, http, i18n, routes, "placeholder");

        document.location.hash = "#/page";
        window.dispatchEvent(new Event("hashchange"));
        clock.tick();

        document.location.hash = "#/another-page";
        window.dispatchEvent(new Event("hashchange"));
        clock.tick();

        t.true(routes["/page"].page.detach.called);

        t.end();
    });
});
