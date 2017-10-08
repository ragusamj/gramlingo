import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../core/browser-event";
import ExerciseAreaListener from "./exercise-area-listener";

const exerciseArea = {
    onBlur: sinon.stub(),
    onKeydown: sinon.stub(),
    onMouseout: sinon.stub(),
    onMouseover: sinon.stub(),
    onToggleSuccess: sinon.stub()
};

let exerciseAreaListener = new ExerciseAreaListener(new BrowserEvent(), exerciseArea);

const setup = () => {
    
    exerciseArea.onBlur.resetHistory();
    exerciseArea.onKeydown.resetHistory();
    exerciseArea.onMouseout.resetHistory();
    exerciseArea.onMouseover.resetHistory();
    exerciseArea.onToggleSuccess.resetHistory();
    
    exerciseAreaListener = new ExerciseAreaListener(new BrowserEvent(), exerciseArea);
    exerciseAreaListener.attach();
    
    return document.querySelector("input");
};

test("ExerciseAreaListener should call 'onBlur' on the event 'blur'", (t) => {
    dom.sandbox("<input/>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("blur"));

        t.true(exerciseArea.onBlur.called);
        t.end();
    });
});

test("ExerciseAreaListener should call 'onKeydown' on the event 'keydown'", (t) => {
    dom.sandbox("<input/>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("keydown"));

        t.true(exerciseArea.onKeydown.called);
        t.end();
    });
});

test("ExerciseAreaListener should call 'onMouseout' on the event 'mouseout'", (t) => {
    dom.sandbox("<input/>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("mouseout"));

        t.true(exerciseArea.onMouseout.called);
        t.end();
    });
});

test("ExerciseAreaListener should call 'onMouseover' on the event 'mouseover'", (t) => {
    dom.sandbox("<input/>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("mouseover"));

        t.true(exerciseArea.onMouseover.called);
        t.end();
    });
});

test("ExerciseAreaListener should call 'onToggleSuccess' on the event 'toggle-success'", (t) => {
    dom.sandbox("<input/>", {}, () => {
        let input = setup();

        input.dispatchEvent(new Event("toggle-success"));

        t.true(exerciseArea.onToggleSuccess.called);
        t.end();
    });
});

test("ExerciseAreaListener should detach and remove event listeners", (t) => {
    dom.sandbox("<input/>", {}, () => {
        
        let input = setup();

        exerciseAreaListener.detach();

        input.dispatchEvent(new Event("keydown"));

        t.false(exerciseArea.onKeydown.called);
        t.end();
    });
});
