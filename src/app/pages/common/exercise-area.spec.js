import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../core/browser-event";
import Dom from "../../core/mock/dom";
import ExerciseArea from "./exercise-area";
import Visualizer from "./visualizer";
import Walker from "./walker";

const browserEvent = new BrowserEvent();
sinon.spy(browserEvent, "on");

test("Walker should listen to the 'keydown' event", (t) => {
    Dom.sandbox("", {}, () => {
        new ExerciseArea(browserEvent, new Visualizer(), new Walker());
        t.true(browserEvent.on.calledWith("keydown"));
        t.end();
    });
});

test("Walker should listen to the 'page-field-list-updated' event", (t) => {
    Dom.sandbox("", {}, () => {
        new ExerciseArea(browserEvent, new Visualizer(), new Walker());
        t.true(browserEvent.on.calledWith("page-field-list-updated"));
        t.end();
    });
});
