import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../core/browser-event";
import WorldMapListener from "./world-map-listener";

const worldMap = {
    onMousedown: sinon.stub(),
    onMousemove: sinon.stub(),
    onMouseup: sinon.stub(),
    onResize: sinon.stub(),
    onWheel: sinon.stub()
};

let worldMapListener;

let setup = () => {

    worldMap.onMousedown.resetHistory();
    worldMap.onMousemove.resetHistory();
    worldMap.onMouseup.resetHistory();
    worldMap.onResize.resetHistory();
    worldMap.onWheel.resetHistory();

    worldMapListener = new WorldMapListener(new BrowserEvent(), worldMap);
    worldMapListener.attach();

    return document.querySelector("div");
};

test("WorldMapListener should call 'onMousedown' on the event 'mousedown'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("mousedown"));

        t.true(worldMap.onMousedown.called);
        t.end();
    });
});

test("WorldMapListener should call 'onMousemove' on the event 'mousemove'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("mousemove"));

        t.true(worldMap.onMousemove.called);
        t.end();
    });
});

test("WorldMapListener should call 'onMouseup' on the event 'mouseup'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("mouseup"));

        t.true(worldMap.onMouseup.called);
        t.end();
    });
});

test("WorldMapListener should call 'onResize' on the event 'resize'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("resize"));

        t.true(worldMap.onResize.called);
        t.end();
    });
});

test("WorldMapListener should call 'onWheel' on the event 'wheel'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("wheel"));

        t.true(worldMap.onWheel.called);
        t.end();
    });
});

test("WorldMapListener should detach and remove event listeners", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        worldMapListener.detach();

        input.dispatchEvent(new Event("mouseup"));

        t.false(worldMap.onMouseup.called);
        t.end();
    });
});
