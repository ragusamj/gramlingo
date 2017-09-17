import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../core/browser-event";
import NumeralsPage from "./numerals-page";
import OrdinalFilter from "./ordinal-filter";

const html =
    "<div id='numerals-type-header'></div>" +
    "<button data-numeral-button></button>" +
    "<button data-randomize-fields></button>" +
    "<button data-switch-fields></button>" +
    "<div data-field-header-path='numerals[0].q'></div>" +
    "<div id='ask-the-machine-body'></div>" +
    "<input id='ask-the-machine-input'>123</input>";

const fields = {
    input: {
        dataPath: "numerals[0].a[0]"
    }
};

let numerals = [{ q: [["q"]], a: [["a"]] }];

let browserEvent = new BrowserEvent();
sinon.spy(browserEvent, "emit");

const i18n = {
    translate: sinon.stub()
};

const fieldGenerator = {
    build: sinon.stub().returns(fields)
};

const numeralsGenerator = {
    randomize: sinon.stub().returns(numerals)
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
    return new NumeralsPage(browserEvent, i18n, fieldGenerator, numeralsGenerator, searchListener);
};

const setNumerals = (data) => {
    numerals.length = 0;
    for(let item of data) {
        numerals.push(item);
    }
};

test("NumeralsPage should use numeral type from parameters", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { type: "time" });

        t.equal(page.type, "time");
        t.end();
    });
});

test("NumeralsPage should default to numeral type 'integers'", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { type: "" });

        t.equal(page.type, "integers");
        t.end();
    });
});

test("NumeralsPage should attach the search listener", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { type: "" });

        t.true(searchListener.attach.called);
        t.end();
    });
});

test("NumeralsPage should randomize numbers on page attach", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        numeralsGenerator.randomize.resetHistory();

        page.attach(pageTemplate, onPageChanged, { type: "fractions" });

        t.deepEqual(numeralsGenerator.randomize.firstCall.args, ["fractions"]);
        t.end();
    });
});

test("NumeralsPage should cache generated page layout", (t) => {
    dom.sandbox(html, {}, () => {
        fieldGenerator.build.resetHistory();
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        page.attach(pageTemplate, onPageChanged, { type: "integers" });

        t.equal(fieldGenerator.build.callCount, 1);
        t.end();
    });
});

test("NumeralsPage should add field filters for ordinals", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { type: "ordinals" });

        t.equal(fields.input.filter, OrdinalFilter);
        t.end();
    });
});

test("NumeralsPage should emit the event 'page-searchable-data-updated'", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        browserEvent.emit.reset();

        page.attach(pageTemplate, onPageChanged, { type: "time" });

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-searchable-data-updated", "time"]);
        t.end();
    });
});

test("NumeralsPage should emit the event 'page-field-list-updated'", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        browserEvent.emit.reset();

        page.attach(pageTemplate, onPageChanged, { type: "integers" });

        t.deepEqual(browserEvent.emit.secondCall.args, ["page-field-list-updated", fields]);
        t.end();
    });
});

test("NumeralsPage should emit the event 'page-data-updated'", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        browserEvent.emit.reset();

        page.attach(pageTemplate, onPageChanged, { type: "fractions" });

        t.deepEqual(browserEvent.emit.thirdCall.args, ["page-data-updated", { numerals: numerals, toggler: "toggle-numerals-data" }]);
        t.end();
    });
});

test("NumeralsPage should change the numeral type on the event 'click' from a 'data-numeral-button' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-numeral-button]");
        button.setAttribute("data-numeral-button", "fractions");

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        button.dispatchEvent(new Event("click"));

        t.equal(page.type, "fractions");
        t.end();
    });
});

test("NumeralsPage should randomize numbers on the event 'click' from a 'data-numeral-button' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-numeral-button]");
        button.setAttribute("data-numeral-button", "fractions");

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        numeralsGenerator.randomize.resetHistory();
        button.dispatchEvent(new Event("click"));

        t.deepEqual(numeralsGenerator.randomize.firstCall.args, ["fractions"]);
        t.end();
    });
});

test("NumeralsPage should emit the event 'page-searchable-data-updated' on the event 'click' from a 'data-numeral-button' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-numeral-button]");
        button.setAttribute("data-numeral-button", "centuries");

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        browserEvent.emit.reset();
        button.dispatchEvent(new Event("click"));

        t.deepEqual(browserEvent.emit.firstCall.args, ["page-searchable-data-updated", "centuries"]);
        t.end();
    });
});

test("NumeralsPage should emit the event 'page-field-list-updated' on the event 'click' from a 'data-numeral-button' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-numeral-button]");

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        browserEvent.emit.reset();
        button.dispatchEvent(new Event("click"));

        t.deepEqual(browserEvent.emit.secondCall.args, ["page-field-list-updated", fields]);
        t.end();
    });
});

test("NumeralsPage should emit the event 'page-data-updated' on the event 'click' from a 'data-numeral-button' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-numeral-button]");

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        browserEvent.emit.reset();
        button.dispatchEvent(new Event("click"));

        t.deepEqual(browserEvent.emit.thirdCall.args, ["page-data-updated", { numerals: numerals, toggler: "toggle-numerals-data" }]);
        t.end();
    });
});

test("NumeralsPage should emit the event 'url-change' on the event 'click' from a 'data-numeral-button' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-numeral-button]");
        button.setAttribute("data-numeral-button", "integers");

        page.attach(pageTemplate, onPageChanged, { type: "centuries" });
        browserEvent.emit.reset();
        button.dispatchEvent(new Event("click"));

        t.true(browserEvent.emit.lastCall.args, ["url-change", "/numerals/integers"]);
        t.end();
    });
});

test("NumeralsPage should randomize numbers on the event 'click' from a 'data-randomize-fields' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-randomize-fields]");

        page.attach(pageTemplate, onPageChanged, { type: "fractions" });
        numeralsGenerator.randomize.resetHistory();
        button.dispatchEvent(new Event("click"));

        t.deepEqual(numeralsGenerator.randomize.firstCall.args, ["fractions"]);
        t.end();
    });
});

test("NumeralsPage should keep the switched state on the event 'click' from a 'data-randomize-fields' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-randomize-fields]");

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        page.switchToggled = true;
        setNumerals([{ q: [["q"]], a: [["a"]] }]);
        button.dispatchEvent(new Event("click"));

        t.deepEqual(page.pageData.numerals, [{ q: [["a"]], a: [["q"]] }]);

        t.end();
    });
});

test("NumeralsPage should toggle the switched state on the event 'click' from a 'data-switch-fields' button", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let button = document.querySelector("[data-switch-fields]");

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        setNumerals([{ q: [["q"]], a: [["a"]] }]);

        button.dispatchEvent(new Event("click"));
        t.deepEqual(page.pageData.numerals, [{ q: [["a"]], a: [["q"]] }]);
        t.true(page.switchToggled);

        button.dispatchEvent(new Event("click"));
        t.deepEqual(page.pageData.numerals, [{ q: [["q"]], a: [["a"]] }]);
        t.false(page.switchToggled);

        t.end();
    });
});

test("NumeralsPage should set question headers", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let headerContainer = document.querySelector("[data-field-header-path]");

        setNumerals([{ q: [["segunda"]], a: [["2ª"]] }]);
        page.attach(pageTemplate, onPageChanged, { type: "ordinals" });

        t.equal(headerContainer.innerHTML, "segunda");
        t.end();
    });
});

test("NumeralsPage should translate numeral headers", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let header = document.getElementById("numerals-type-header");
        i18n.translate.resetHistory();

        page.attach(pageTemplate, onPageChanged, { type: "ordinals" });

        t.equal(header.getAttribute("data-translate"), "numerals-ordinals-header");
        t.deepEqual(i18n.translate.firstCall.args, [header]);
        t.end();
    });
});

test("NumeralsPage should translate the 'ask the machine' body", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let body = document.getElementById("ask-the-machine-body");
        i18n.translate.resetHistory();

        page.attach(pageTemplate, onPageChanged, { type: "time" });

        t.equal(body.getAttribute("data-translate"), "numerals-ask-the-machine-time-body");
        t.deepEqual(i18n.translate.firstCall.args, [body]);
        t.end();
    });
});

test("NumeralsPage should setup the 'ask the machine' input", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();
        let input = document.getElementById("ask-the-machine-input");

        page.attach(pageTemplate, onPageChanged, { type: "centuries" });

        t.equal(input.value, "");
        t.equal(input.placeholder, "1700");
        t.end();
    });
});

test("NumeralsPage should detach page and remove 'click' event listener", (t) => {
    dom.sandbox(html, {}, () => {

        t.plan(1);
        let page = setup();
        let button = document.querySelector("[data-numeral-button]");
        browserEvent.on("url-change", () => {
            t.fail();
        });

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        page.detach();
        button.dispatchEvent(new Event("click"));

        t.pass();
    });
});

test("NumeralsPage should detach page and detach search listener", (t) => {
    dom.sandbox(html, {}, () => {
        let page = setup();

        page.attach(pageTemplate, onPageChanged, { type: "integers" });
        page.detach();

        t.true(searchListener.detach.called);
        t.end();
    });
});
