import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../core/browser-event";
import ElementWalker from "../walkers/element-walker";
import KeyCode from "../walkers/key-code";
import SearchResultVisualizer from "./search-result-visualizer";

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
const searchResultVisualizer = new SearchResultVisualizer(browserEvent, walker);

sinon.spy(browserEvent, "emit");
sinon.spy(walker, "link");
sinon.spy(walker, "walk");

test("SearchResultVisualizer should ignore empty results", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [] };
        searchResultVisualizer.show(result);
        let container = document.getElementById("search-result-container");
        t.equal(container.innerHTML, "");
        t.end();
    });
});


test("SearchResultVisualizer should show result property 'pre'", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ pre: "pre" }] };
        searchResultVisualizer.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[0].innerHTML, "pre");
        t.end();
    });
});

test("SearchResultVisualizer should show result property 'match'", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ match: "match" }] };
        searchResultVisualizer.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[1].innerHTML, "match");
        t.end();
    });
});

test("SearchResultVisualizer should show result property 'post'", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ post: "post" }] };
        searchResultVisualizer.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[2].innerHTML, "post");
        t.end();
    });
});

test("SearchResultVisualizer should show result property 'source'", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ source: "source" }] };
        searchResultVisualizer.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[3].innerHTML, "source");
        t.end();
    });
});

test("SearchResultVisualizer should set index attribute on each item", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ index: 123 }] };
        searchResultVisualizer.show(result);
        let li = document.querySelector("li");
        t.equal(li.getAttribute("data-search-result-index"), "123");
        t.end();
    });
});

test("SearchResultVisualizer should indicate if max number of search results were exceeded", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }], maxExceeded: true };
        searchResultVisualizer.show(result);
        let ul = document.querySelector("ul");
        t.equal(ul.lastChild.innerHTML, "...");
        t.end();
    });
});

test("SearchResultVisualizer should link walker", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResultVisualizer.show(result);
        t.true(walker.link.called);
        t.end();
    });
});

test("SearchResultVisualizer should walk the result", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResultVisualizer.show(result);
        searchResultVisualizer.walk(KeyCode.downArrow);
        t.true(walker.walk.calledWith(KeyCode.downArrow));
        t.end();
    });
});

test("SearchResultVisualizer should select current walked item", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResultVisualizer.show(result);
        searchResultVisualizer.walk(KeyCode.downArrow);
        searchResultVisualizer.selectCurrent();
        t.true(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResultVisualizer should select current walked item and ignore undefined element", (t) => {
    dom.sandbox(html, {}, () => {
        browserEvent.emit.reset();
        let result = { matches: [{ }] };
        searchResultVisualizer.show(result);
        searchResultVisualizer.walk(KeyCode.downArrow);
        searchResultVisualizer.select(undefined);
        t.false(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResultVisualizer should close result list", (t) => {
    dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResultVisualizer.show(result);
        searchResultVisualizer.close();
        let ul = document.getElementById("search-result-container");
        t.equal(ul.innerHTML, "");
        t.end();
    });
});
