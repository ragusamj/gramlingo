import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../core/browser-event";
import Dom from "../../../core/mock/dom";
import SearchListener from "./search-listener";
import KeyCode from "../walkers/key-code";

const searchResult = {
    close: sinon.spy(),
    select: sinon.spy(),
    selectCurrent: sinon.spy(),
    show: sinon.spy(),
    walk: sinon.spy()
};

let setup = () => {

    searchResult.close.reset();
    searchResult.select.reset();
    searchResult.selectCurrent.reset();
    searchResult.show.reset();
    searchResult.walk.reset();

    let browserEvent = new BrowserEvent();
    new SearchListener(browserEvent, searchResult);
    browserEvent.emit("page-searchable-data-updated", [{name:"test"}]);

    let input = document.querySelector("input");
    input.value = "test";
    return input;
};

test("SearchListener should search on event 'keyup'", (t) => {
    Dom.sandbox("<input data-search-input/>", {}, () => {
        let clock = sinon.useFakeTimers();
        let input = setup();

        input.dispatchEvent(new Event("keyup"));
        clock.tick(300);

        t.true(searchResult.show.called);
        t.end();
    });
});

test("SearchListener should only search if the event is from an element with the attribute 'data-search-input'", (t) => {
    Dom.sandbox("<input />", {}, () => {
        let clock = sinon.useFakeTimers();
        let input = setup();

        input.dispatchEvent(new Event("keyup"));
        clock.tick(300);

        t.false(searchResult.show.called);
        t.end();
    });
});

test("SearchListener should not search if the enter key is pressed", (t) => {
    Dom.sandbox("<input data-search-input/>", {}, () => {
        let clock = sinon.useFakeTimers();
        let input = setup();

        let e = new Event("keyup");
        e.keyCode = KeyCode.enter;
        input.dispatchEvent(e);
        clock.tick(300);

        t.false(searchResult.show.called);
        t.end();
    });
});

test("SearchListener should not search if the down arrow is pressed", (t) => {
    Dom.sandbox("<input data-search-input/>", {}, () => {
        let clock = sinon.useFakeTimers();
        let input = setup();

        let e = new Event("keyup");
        e.keyCode = KeyCode.downArrow;
        input.dispatchEvent(e);
        clock.tick(300);

        t.false(searchResult.show.called);
        t.end();
    });
});

test("SearchListener should not search if the up arrow is pressed", (t) => {
    Dom.sandbox("<input data-search-input/>", {}, () => {
        let clock = sinon.useFakeTimers();
        let input = setup();

        let e = new Event("keyup");
        e.keyCode = KeyCode.upArrow;
        input.dispatchEvent(e);
        clock.tick(300);

        t.false(searchResult.show.called);
        t.end();
    });
});

test("SearchListener should select the clicked element", (t) => {
    Dom.sandbox("<input data-search-input/><div></div>", {}, () => {
        setup();

        let element = document.querySelector("div");
        element.dispatchEvent(new Event("click"));

        t.deepEqual(searchResult.select.lastCall.args, [element]);
        t.end();
    });
});

test("SearchListener should close the result when the clicked element is selected", (t) => {
    Dom.sandbox("<input data-search-input/><div></div>", {}, () => {
        setup();

        let element = document.querySelector("div");
        element.dispatchEvent(new Event("click"));

        t.true(searchResult.close.called);
        t.end();
    });
});

test("SearchListener should ignore keydown events from elements without the attribute 'data-search-input'", (t) => {
    Dom.sandbox("<input data-search-input/><div></div>", {}, () => {
        setup();

        let element = document.querySelector("div");
        element.dispatchEvent(new Event("keydown"));

        t.false(searchResult.walk.called);
        t.false(searchResult.select.called);
        t.end();
    });
});

test("SearchListener should walk down in the result on event 'keydown'", (t) => {
    Dom.sandbox("<input data-search-input/>", {}, () => {
        let input = setup();

        let e = new Event("keydown");
        e.keyCode = KeyCode.downArrow;
        input.dispatchEvent(e);

        t.deepEqual(searchResult.walk.lastCall.args, [KeyCode.downArrow]);
        t.end();
    });
});

test("SearchListener should walk up in the result on event 'keydown'", (t) => {
    Dom.sandbox("<input data-search-input/>", {}, () => {
        let input = setup();

        let e = new Event("keydown");
        e.keyCode = KeyCode.upArrow;
        input.dispatchEvent(e);

        t.deepEqual(searchResult.walk.lastCall.args, [KeyCode.upArrow]);
        t.end();
    });
});

test("SearchListener should select current item in search result when the enter key is pressed", (t) => {
    Dom.sandbox("<input data-search-input/>", {}, () => {
        let input = setup();

        let e = new Event("keydown");
        e.keyCode = KeyCode.enter;
        input.dispatchEvent(e);

        t.true(searchResult.selectCurrent.called);
        t.end();
    });
});

test("SearchListener should close search result when the enter key is pressed", (t) => {
    Dom.sandbox("<input data-search-input/>", {}, () => {
        let input = setup();

        let e = new Event("keydown");
        e.keyCode = KeyCode.enter;
        input.dispatchEvent(e);

        t.true(searchResult.close.called);
        t.end();
    });
});
