import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../core/browser-event";
import ElementWalker from "../walkers/element-walker";
import KeyCode from "../walkers/key-code";
import SearchResultPopup from "./search-result-popup";

const html =
    "<script id='search-result-template'>" +
        "<ul></ul>" +
    "</script>" +
    "<script id='search-result-item-template'>" +
        "<li id='search-result-item'>" +
            "<span id='pre'></span>" +
            "<span id='match'></span>" +
            "<span id='post'></span>" +
            "<span id='source'></span>" +
        "</li>" +
    "</script>" +
    "<div id='search-result-container'></div>";

const browserEvent = new BrowserEvent();
const walker = new ElementWalker();
const searchResultPopup = new SearchResultPopup(browserEvent, walker);

sinon.spy(browserEvent, "emit");
sinon.spy(walker, "link");
sinon.spy(walker, "walk");

test("SearchResultVisualizer should ignore empty results", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [] };
        searchResultPopup.show(result);
        let container = document.getElementById("search-result-container");
        t.equal(container.innerHTML, "");
        t.end();
    });
});

test("SearchResultVisualizer should show result property 'pre'", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ pre: "pre" }] };
        searchResultPopup.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[0].innerHTML, "pre");
        t.end();
    });
});

test("SearchResultVisualizer should show result property 'match'", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ match: "match" }] };
        searchResultPopup.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[1].innerHTML, "match");
        t.end();
    });
});

test("SearchResultVisualizer should show result property 'post'", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ post: "post" }] };
        searchResultPopup.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[2].innerHTML, "post");
        t.end();
    });
});

test("SearchResultVisualizer should show result property 'source'", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ source: "source" }] };
        searchResultPopup.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[3].innerHTML, "source");
        t.end();
    });
});

test("SearchResultVisualizer should set index attribute on each item", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ index: 123 }] };
        searchResultPopup.show(result);
        let li = document.querySelector("li");
        t.equal(li.getAttribute("data-search-result-index"), "123");
        t.end();
    });
});

test("SearchResultVisualizer should indicate if max number of search results were exceeded", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }], maxExceeded: true };
        searchResultPopup.show(result);
        let ul = document.querySelector("ul");
        t.equal(ul.lastChild.innerHTML, "...");
        t.end();
    });
});

test("SearchResultVisualizer should link walker", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResultPopup.show(result);
        t.true(walker.link.called);
        t.end();
    });
});

test("SearchResultVisualizer should walk the result", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResultPopup.show(result);
        searchResultPopup.walk(KeyCode.downArrow);
        t.true(walker.walk.calledWith(KeyCode.downArrow));
        t.end();
    });
});

test("SearchResultVisualizer should select current walked item", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ index: 0 }] };
        searchResultPopup.show(result);
        searchResultPopup.walk(KeyCode.downArrow);
        searchResultPopup.selectCurrent();
        t.true(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResultVisualizer should not select current walked item if the item has no index", (t) => {
    dom.sandbox(html, {}, () => {
        browserEvent.emit.reset();
        let result = { matches: [{ }] };
        searchResultPopup.show(result);
        searchResultPopup.walk(KeyCode.downArrow);
        searchResultPopup.selectCurrent();
        t.false(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResultVisualizer should select current walked item and ignore undefined element", (t) => {
    dom.sandbox(html, {}, () => {
        browserEvent.emit.reset();
        let result = { matches: [{ }] };
        searchResultPopup.show(result);
        searchResultPopup.walk(KeyCode.downArrow);
        searchResultPopup.select(undefined);
        t.false(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResultVisualizer should select element with attribute 'data-search-result-index' on click", (t) => {
    dom.sandbox(html, {}, () => {
        browserEvent.emit.reset();
        let element = document.createElement("div");
        element.setAttribute("data-search-result-index", "0");
        searchResultPopup.click(element);
        t.true(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResultVisualizer should not select element without attribute 'data-search-result-index' on click", (t) => {
    dom.sandbox(html, {}, () => {
        browserEvent.emit.reset();
        let element = document.createElement("div");
        searchResultPopup.click(element);
        t.false(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResultVisualizer should not select undefined element on click", (t) => {
    dom.sandbox(html, {}, () => {
        browserEvent.emit.reset();
        searchResultPopup.click(undefined);
        t.false(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResultVisualizer should close result list", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResultPopup.show(result);
        searchResultPopup.close();
        let ul = document.getElementById("search-result-container");
        t.equal(ul.innerHTML, "");
        t.end();
    });
});
