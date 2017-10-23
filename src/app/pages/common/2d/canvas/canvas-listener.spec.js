import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../../core/event/browser-event";
import CanvasListener from "./canvas-listener";

const canvas = {
    onMousedown: sinon.stub(),
    onMousemove: sinon.stub(),
    onMouseup: sinon.stub(),
    onResize: sinon.stub(),
    onWheel: sinon.stub()
};

let canvasListener;

let setup = () => {

    canvas.onMousedown.resetHistory();
    canvas.onMousemove.resetHistory();
    canvas.onMouseup.resetHistory();
    canvas.onResize.resetHistory();
    canvas.onWheel.resetHistory();

    canvasListener = new CanvasListener(new BrowserEvent(), canvas);
    canvasListener.attach();

    return document.querySelector("div");
};

test("CanvasListener should call 'onMousedown' on the event 'mousedown'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("mousedown"));

        t.true(canvas.onMousedown.called);
        t.end();
    });
});

test("CanvasListener should call 'onMousemove' on the event 'mousemove'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("mousemove"));

        t.true(canvas.onMousemove.called);
        t.end();
    });
});

test("CanvasListener should call 'onMouseup' on the event 'mouseup'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("mouseup"));

        t.true(canvas.onMouseup.called);
        t.end();
    });
});

test("CanvasListener should call 'onResize' on the event 'resize'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();
        let clock = sinon.useFakeTimers();

        input.dispatchEvent(new Event("resize"));
        clock.tick(100);

        t.true(canvas.onResize.called);
        t.end();
    });
});

test("CanvasListener should call 'onWheel' on the event 'wheel'", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("wheel"));

        t.true(canvas.onWheel.called);
        t.end();
    });
});

test("CanvasListener should detach and remove event listeners", (t) => {
    dom.sandbox("<div><div>", {}, () => {
        let input = setup();

        canvasListener.detach();

        input.dispatchEvent(new Event("mouseup"));

        t.false(canvas.onMouseup.called);
        t.end();
    });
});
