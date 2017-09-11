import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../core/browser-event";
import VerbPage from "./verb-page";

const ir = { name: "Ir", regular: false };
const comer = { name: "Comer", regular: true };
const verbs = [ir, comer];
const fields = {
    ir: {
        dataPath: "path[0]"
    }
};

let browserEvent = new BrowserEvent();
sinon.spy(browserEvent, "emit");

const http = {
    getJSON: sinon.stub().yields(["mock-JSON-data"])
};

const i18n = {
    translate: sinon.stub()
};

const fieldGenerator = {
    build: sinon.stub().returns(fields)
};

const verbInflater = {
    inflate: sinon.stub().returns(verbs)
};

const searchListener = {
    attach: sinon.stub(),
    detach: sinon.stub()
};

const pageTemplate = {};
const onPageChanged = sinon.stub();

const setup = () => {
    browserEvent = new BrowserEvent();
    sinon.spy(browserEvent, "emit");
    return new VerbPage(browserEvent, http, i18n, fieldGenerator, verbInflater, searchListener);
};

test("VerbPage should load verb data on first page attach", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.equal(http.getJSON.firstCall.args[0], "/data/verbs.json");
        t.end();
    });
});

test("VerbPage should report progress when loading verb data, TODO", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        // trigger the progress callback, this test is just a stub
        http.getJSON.callArgWith(2, { loaded: 123, total: 456 });
        t.end();
    });
});

test("VerbPage should use cached verb data after first page attach", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        http.getJSON.resetHistory();
        http.getJSON.yields(["mock-JSON-data"]);
        page.attach(pageTemplate, onPageChanged, {});
        page.attach(pageTemplate, onPageChanged, {});

        t.equal(http.getJSON.callCount, 1);
        t.end();
    });
});

test("VerbPage should inflate verb data", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(verbInflater.inflate.firstCall.args, [["mock-JSON-data"]]);
        t.end();
    });
});

test("VerbPage should attach search listener", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.true(searchListener.attach.called);
        t.end();
    });
});

test("VerbPage should load page with default verb", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-searchable-data-updated", verbs]);
        t.end();
    });
});

test("VerbPage should load page with verb from parameter, uppercase", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { name: "COMER" });

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-searchable-data-updated", verbs]);
        t.end();
    });
});

test("VerbPage should load page with verb from parameter, lowercase", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { name: "comer" });

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-searchable-data-updated", verbs]);
        t.end();
    });
});

test("VerbPage should not emit any events for unknown verbs", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { name: "unknownverb" });

        t.false(browserEvent.emit.called);
        t.end();
    });
});

test("VerbPage should execute callback when page has loaded", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        onPageChanged.resetHistory();
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.true(onPageChanged.called);
        t.end();
    });
});

test("VerbPage should execute callback when page has loaded with unknown verb", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        onPageChanged.resetHistory();
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {  name: "unknownverb" });

        t.true(onPageChanged.called);
        t.end();
    });
});

test("VerbPage should generate page layout from verb data and page template", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        fieldGenerator.build.resetHistory();
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(fieldGenerator.build.firstCall.args, [pageTemplate, ir]);
        t.end();
    });
});

test("VerbPage should cache generated page layout", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        fieldGenerator.build.resetHistory();
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});
        page.attach(pageTemplate, onPageChanged, {});

        t.equal(fieldGenerator.build.callCount, 1);
        t.end();
    });
});

test("VerbPage should emit event 'page-searchable-data-updated' on page load", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-searchable-data-updated", verbs]);
        t.end();
    });
});

test("VerbPage should emit event 'page-field-list-updated' on page load", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(browserEvent.emit.secondCall.args, ["page-field-list-updated", fields]);
        t.end();
    });
});

test("VerbPage should set verb name as header on page load", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.equal(document.getElementById("verb-name").innerHTML, "Ir");
        t.end();
    });
});

test("VerbPage should show verb regularity on page load, regular", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { name: "Comer" });

        t.equal(document.getElementById("verb-mode").getAttribute("data-translate"), "verbs-regular-header");
        t.end();
    });
});

test("VerbPage should show verb regularity on page load, irregular", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.equal(document.getElementById("verb-mode").getAttribute("data-translate"), "verbs-irregular-header");
        t.end();
    });
});

test("VerbPage should show verb regularity on page load, irregular", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.equal(document.getElementById("verb-mode").getAttribute("data-translate"), "verbs-irregular-header");
        t.end();
    });
});

test("VerbPage should translate verb regularity on page load", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(i18n.translate.firstCall.args, [document.getElementById("verb-mode")]);
        t.end();
    });
});

test("VerbPage should detach page and remove 'search-result-selected' event listener", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {

        t.plan(1);
        let page = setup();
        browserEvent.on("url-change", () => {
            t.fail();
        });

        page.attach(pageTemplate, onPageChanged, {});
        page.detach();
        browserEvent.emit("search-result-selected", 0);

        t.pass();
    });
});

test("VerbPage should detach page and detach search listener", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});
        page.detach();

        t.true(searchListener.detach.called);
        t.end();
    });
});

test("VerbPage should listen to 'search-result-selected' event and emit 'url-change'", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {

        t.plan(1);
        let page = setup();
        browserEvent.on("url-change", (e) => {
            t.equal(e.detail, "/verbs/comer");
        });
 
        page.attach(pageTemplate, onPageChanged, {});
        browserEvent.emit("search-result-selected", 1);
    });
});

test("VerbPage should listen to 'search-result-selected' event and emit 'page-data-updated'", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {

        t.plan(1);
        let page = setup();
        browserEvent.on("page-data-updated", (e) => {
            if(e.detail === comer) {
                t.pass();
            }
        });
 
        page.attach(pageTemplate, onPageChanged, {});
        browserEvent.emit("search-result-selected", 1);
    });
});

test("VerbPage should listen to 'search-result-selected' event and update header", (t) => {
    dom.sandbox("<div id='verb-name'></div><div id='verb-mode'></div>", {}, () => {

        let page = setup();
 
        page.attach(pageTemplate, onPageChanged, {});
        browserEvent.emit("search-result-selected", 1);

        t.equal(document.getElementById("verb-name").innerHTML, "Comer");
        t.end();
    });
});
