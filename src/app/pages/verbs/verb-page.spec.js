import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../core/browser-event";
import VerbPage from "./verb-page";

const html = "<div id='verb-name'></div><div id='verb-mode'></div>";
const ir = { name: "Ir", regular: false };
const comer = { name: "Comer", regular: true };
const verbs = [ir, comer];

let browserEvent = new BrowserEvent();
sinon.spy(browserEvent, "emit");

const http = {
    getJSON: sinon.stub().yields(["mock-JSON-data"])
};

const i18n = {
    translate: sinon.stub()
};

const exerciseArea = {
    build: sinon.stub(),
    fields: {
        ir: {
            dataPath: "path[0]"
        }
    },
    updateContext: sinon.stub()
};

const exerciseAreaListener = {
    attach: sinon.stub(),
    detach: sinon.stub()
};

const verbInflater = {
    inflate: sinon.stub().returns(verbs)
};

const searchEngine = {
    initialize: sinon.stub()
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
    return new VerbPage(browserEvent, http, i18n, exerciseArea, exerciseAreaListener, verbInflater, searchEngine, searchListener);
};

test("VerbPage should load verb data on the first page attach", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.equal(http.getJSON.firstCall.args[0], "/data/verbs.json");
        t.end();
    });
});

test("VerbPage should report progress when loading verb data, TODO", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        // trigger the progress callback, this test is just a stub
        http.getJSON.callArgWith(2, { loaded: 123, total: 456 });
        t.end();
    });
});

test("VerbPage should use cached verb data after first page attach", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        http.getJSON.resetHistory();
        http.getJSON.yields(["mock-JSON-data"]);
        page.attach(pageTemplate, onPageChanged, {});
        page.attach(pageTemplate, onPageChanged, {});

        t.equal(http.getJSON.callCount, 1);
        t.end();
    });
});

test("VerbPage should inflate the verb data", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(verbInflater.inflate.firstCall.args, [["mock-JSON-data"]]);
        t.end();
    });
});

test("VerbPage should attach the exercise area listener", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { type: "" });

        t.true(exerciseAreaListener.attach.called);
        t.end();
    });
});

test("VerbPage should attach the search listener", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.true(searchListener.attach.called);
        t.end();
    });
});

test("VerbPage should load the page with the default verb", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        searchEngine.initialize.reset();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(searchEngine.initialize.firstCall.args, [verbs]);
        t.end();
    });
});

test("VerbPage should load the page with a verb from the parameters, uppercase", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        searchEngine.initialize.reset();

        page.attach(pageTemplate, onPageChanged, { name: "COMER" });

        t.deepEqual(searchEngine.initialize.firstCall.args, [verbs]);
        t.end();
    });
});

test("VerbPage should load the page with a verb from the parameters, lowercase", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        searchEngine.initialize.reset();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(searchEngine.initialize.firstCall.args, [verbs]);
        t.end();
    });
});

test("VerbPage should not emit any events for unknown verbs", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { name: "unknownverb" });

        t.false(browserEvent.emit.called);
        t.end();
    });
});

test("VerbPage should execute the callback when the page has loaded", (t) => {
    dom.sandbox(html, {}, () => {
        onPageChanged.resetHistory();
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.true(onPageChanged.called);
        t.end();
    });
});

test("VerbPage should execute the callback when the page has loaded with an unknown verb", (t) => {
    dom.sandbox(html, {}, () => {
        onPageChanged.resetHistory();
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {  name: "unknownverb" });

        t.true(onPageChanged.called);
        t.end();
    });
});

test("VerbPage should set the verb name as header on page load", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.equal(document.getElementById("verb-name").innerHTML, "Ir");
        t.end();
    });
});

test("VerbPage should show the verb regularity on page load, regular", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { name: "Comer" });

        t.equal(document.getElementById("verb-mode").getAttribute("data-translate"), "verbs-regular-header");
        t.end();
    });
});

test("VerbPage should show the verb regularity on page load, irregular", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.equal(document.getElementById("verb-mode").getAttribute("data-translate"), "verbs-irregular-header");
        t.end();
    });
});

test("VerbPage should show the verb regularity on page load, irregular", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.equal(document.getElementById("verb-mode").getAttribute("data-translate"), "verbs-irregular-header");
        t.end();
    });
});

test("VerbPage should translate the verb regularity on page load", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});

        t.deepEqual(i18n.translate.firstCall.args, [document.getElementById("verb-mode")]);
        t.end();
    });
});

test("VerbPage should listen to the 'search-result-selected' event and emit the event 'url-change'", (t) => {
    dom.sandbox(html, {}, () => {

        t.plan(1);
        let page = setup();
        browserEvent.on("url-change", (e) => {
            t.equal(e.detail, "/verbs/comer");
        });
 
        page.attach(pageTemplate, onPageChanged, {});
        browserEvent.emit("search-result-selected", 1);
    });
});

test("VerbPage should listen to the 'search-result-selected' event and update the exercise area context", (t) => {
    dom.sandbox(html, {}, () => {

        t.plan(1);
        let page = setup();
 
        page.attach(pageTemplate, onPageChanged, {});
        exerciseArea.updateContext.resetHistory();
        browserEvent.emit("search-result-selected", 1);

        t.deepEqual(exerciseArea.updateContext.firstCall.args, [{ verb: comer, toggler: "toggle-verbs-data" }]);
    });
});

test("VerbPage should listen to the 'search-result-selected' event and update the header", (t) => {
    dom.sandbox(html, {}, () => {

        let page = setup();
 
        page.attach(pageTemplate, onPageChanged, {});
        browserEvent.emit("search-result-selected", 1);

        t.equal(document.getElementById("verb-name").innerHTML, "Comer");
        t.end();
    });
});

test("VerbPage should detach and remove the 'search-result-selected' event listener", (t) => {
    dom.sandbox(html, {}, () => {

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

test("VerbPage should detach and detach the exercise area listener", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        page.detach();

        t.true(exerciseAreaListener.detach.called);
        t.end();
    });
});

test("VerbPage should detach and detach the search listener", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, {});
        page.detach();

        t.true(searchListener.detach.called);
        t.end();
    });
});
