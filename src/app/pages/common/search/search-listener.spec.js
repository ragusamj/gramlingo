import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../core/browser-event";
import SearchListener from "./search-listener";

const search = {
    onClick: sinon.stub(),
    onKeydown: sinon.stub(),
    onKeyup: sinon.stub()
};

let searchListener;

let setup = () => {

    search.onClick.resetHistory();
    search.onKeydown.resetHistory();
    search.onKeyup.resetHistory();

    searchListener = new SearchListener(new BrowserEvent(), search);
    searchListener.attach();

    return document.querySelector("input");
};

test("SearchListener should call 'onClick' on the event 'click'", (t) => {
    dom.sandbox("<input/>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("click"));

        t.true(search.onClick.called);
        t.end();
    });
});

test("SearchListener should call 'onKeydown' on the event 'keydown'", (t) => {
    dom.sandbox("<input/>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("keydown"));

        t.true(search.onKeydown.called);
        t.end();
    });
});

test("SearchListener should call 'onKeyup' on the event 'keyup'", (t) => {
    dom.sandbox("<input/>", {}, () => {
        let clock = sinon.useFakeTimers();
        let input = setup();

        input.dispatchEvent(new Event("keyup"));
        clock.tick(100);

        t.true(search.onKeyup.called);
        t.end();
    });
});

test("SearchListener should detach and remove event listeners", (t) => {
    dom.sandbox("<input/>", {}, () => {
        
        let input = setup();

        searchListener.detach();

        input.dispatchEvent(new Event("keydown"));

        t.false(search.onKeydown.called);
        t.end();
    });
});
