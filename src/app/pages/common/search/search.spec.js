import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import Search from "./search";
import KeyCode from "../walkers/key-code";

const searchResultPopup = {
    click: sinon.stub(),
    selectCurrent: sinon.stub(),
    show: sinon.stub(),
    walk: sinon.stub()
};

const searchEngine = {
    search: sinon.stub().returns("result")
};

const search = new Search(searchEngine, searchResultPopup);


test("Search should select the clicked element on the event 'click'", (t) => {
    dom.sandbox("", {}, () => {
        searchResultPopup.click.resetHistory();

        search.onClick({ target: {} });

        t.true(searchResultPopup.click.called);
        t.end();
    });
});

test("Search should walk down the result on the event 'keydown'", (t) => {
    dom.sandbox("<input data-search-input/>", {}, () => {

        searchResultPopup.walk.resetHistory();
        let e = { keyCode: KeyCode.downArrow, target: document.querySelector("input") };

        search.onKeydown(e);

        t.deepEqual(searchResultPopup.walk.firstCall.args, [KeyCode.downArrow]);
        t.end();
    });
});

test("Search should walk up the result on the event 'keydown'", (t) => {
    dom.sandbox("<input data-search-input/>", {}, () => {

        searchResultPopup.walk.resetHistory();
        let e = { keyCode: KeyCode.upArrow, target: document.querySelector("input") };

        search.onKeydown(e);

        t.deepEqual(searchResultPopup.walk.firstCall.args, [KeyCode.upArrow]);
        t.end();
    });
});

test("Search should not walk the result on the event 'keydown' if the key isn't a walker key", (t) => {
    dom.sandbox("<input data-search-input/>", {}, () => {

        searchResultPopup.walk.resetHistory();
        let e = { keyCode: KeyCode.enter, target: document.querySelector("input") };

        search.onKeydown(e);

        t.false(searchResultPopup.walk.called);
        t.end();
    });
});

test("Search should select the current element the event 'keydown' if the enter key was pressed", (t) => {
    dom.sandbox("<input data-search-input/>", {}, () => {

        searchResultPopup.selectCurrent.resetHistory();
        let e = { keyCode: KeyCode.enter, target: document.querySelector("input") };

        search.onKeydown(e);

        t.true(searchResultPopup.selectCurrent.called);
        t.end();
    });
});

test("Search should ignore keydown events from elements without the attribute 'data-search-input'", (t) => {
    dom.sandbox("<input data-search-input/><div></div>", {}, () => {

        searchResultPopup.selectCurrent.resetHistory();
        let e = { keyCode: KeyCode.enter, target: document.querySelector("div") };
        
        search.onKeydown(e);

        t.false(searchResultPopup.selectCurrent.called);
        t.end();
    });
});

test("Search should search and show the result", (t) => {
    dom.sandbox("<input data-search-input value='ir'/>", {}, () => {

        searchEngine.search.resetHistory();
        searchResultPopup.show.resetHistory();
        let r = 82;
        let e = { keyCode: r, target: document.querySelector("input") };
        
        search.onKeyup(e);

        t.deepEqual(searchEngine.search.firstCall.args, ["ir"]);
        t.deepEqual(searchResultPopup.show.firstCall.args, ["result"]);
        t.end();
    });
});

test("Search should ignore keyup events from elements without the attribute 'data-search-input'", (t) => {
    dom.sandbox("<input />", {}, () => {

        searchEngine.search.resetHistory();
        let e = { target: document.querySelector("input") };
        
        search.onKeyup(e);

        t.false(searchEngine.search.called);
        t.end();
    });
});

test("Search should not search if the enter key is pressed", (t) => {
    dom.sandbox("<input data-search-input/>", {}, () => {

        searchEngine.search.resetHistory();
        let e = { keyCode: KeyCode.enter, target: document.querySelector("input") };
        
        search.onKeyup(e);

        t.false(searchEngine.search.called);
        t.end();
    });
});

test("Search should not search if the down arrow is pressed", (t) => {
    dom.sandbox("<input data-search-input/>", {}, () => {

        searchEngine.search.resetHistory();
        let e = { keyCode: KeyCode.downArrow, target: document.querySelector("input") };
        
        search.onKeyup(e);

        t.false(searchEngine.search.called);
        t.end();
    });
});

test("Search should not search if the up arrow is pressed", (t) => {
    dom.sandbox("<input data-search-input/>", {}, () => {

        searchEngine.search.resetHistory();
        let e = { keyCode: KeyCode.upArrow, target: document.querySelector("input") };
        
        search.onKeyup(e);

        t.false(searchEngine.search.called);
        t.end();
    });
});
