import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../core/browser-event";
import Dom from "../../../core/mock/dom";
import ElementWalker from "../walkers/element-walker";
import KeyCode from "../walkers/key-code";
import SearchResult from "./search-result";

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
const searchResult = new SearchResult(browserEvent, walker);

sinon.spy(browserEvent, "emit");
sinon.spy(walker, "link");
sinon.spy(walker, "walk");

test("SearchResult should ignore empty results", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [] };
        searchResult.show(result);
        let container = document.getElementById("search-result-container");
        t.equal(container.innerHTML, "");
        t.end();
    });
});


test("SearchResult should show result property 'pre'", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ pre: "pre" }] };
        searchResult.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[0].innerHTML, "pre");
        t.end();
    });
});

test("SearchResult should show result property 'match'", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ match: "match" }] };
        searchResult.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[1].innerHTML, "match");
        t.end();
    });
});

test("SearchResult should show result property 'post'", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ post: "post" }] };
        searchResult.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[2].innerHTML, "post");
        t.end();
    });
});

test("SearchResult should show result property 'source'", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ source: "source" }] };
        searchResult.show(result);
        let li = document.querySelector("li");
        t.equal(li.childNodes[3].innerHTML, "source");
        t.end();
    });
});

test("SearchResult should set index attribute on each item", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ index: 123 }] };
        searchResult.show(result);
        let li = document.querySelector("li");
        t.equal(li.getAttribute("data-search-result-index"), "123");
        t.end();
    });
});

test("SearchResult should indicate if max number of search results were exceeded", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ }], maxExceeded: true };
        searchResult.show(result);
        let ul = document.querySelector("ul");
        t.equal(ul.lastChild.innerHTML, "...");
        t.end();
    });
});

test("SearchResult should link walker", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResult.show(result);
        t.true(walker.link.called);
        t.end();
    });
});

test("SearchResult should walk the result", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResult.show(result);
        searchResult.walk(KeyCode.downArrow);
        t.true(walker.walk.calledWith(KeyCode.downArrow));
        t.end();
    });
});

test("SearchResult should select current walked item", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResult.show(result);
        searchResult.walk(KeyCode.downArrow);
        searchResult.selectCurrent();
        t.true(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResult should select current walked item and ignore undefined element", (t) => {
    Dom.sandbox(html, {}, () => {
        browserEvent.emit.reset();
        let result = { matches: [{ }] };
        searchResult.show(result);
        searchResult.walk(KeyCode.downArrow);
        searchResult.select(undefined);
        t.false(browserEvent.emit.calledWith("search-result-selected"));
        t.end();
    });
});

test("SearchResult should close result list", (t) => {
    Dom.sandbox(html, {}, () => {
        let result = { matches: [{ }] };
        searchResult.show(result);
        searchResult.close();
        let ul = document.getElementById("search-result-container");
        t.equal(ul.innerHTML, "");
        t.end();
    });
});
