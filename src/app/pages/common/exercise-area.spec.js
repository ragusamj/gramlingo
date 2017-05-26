import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../core/browser-event";
import Dom from "../../core/mock/dom";
import ExerciseArea from "./exercise-area";

let checker = {
    check: sinon.stub().returns({ accepted: true })
};

let visualizer = {
    hidePopup: sinon.spy(),
    showAnswer: sinon.spy(),
    showPopup: sinon.spy(),
    updateField: sinon.spy()
};

let walker = {
    link: sinon.spy(),
    walk: sinon.spy()
};

let setup = () => {
    let exerciseArea = new ExerciseArea(new BrowserEvent(), checker, visualizer, walker);
    exerciseArea.onPageFieldListUpdated({detail: { "id": { dataPath: "path", iconId: "icon-id", popupId: "popup-id" } }});
    exerciseArea.onPageDataUpdated({ detail: { "path": ["alternative"] }});
    return exerciseArea;
};

test("ExerciseArea should check input value on 'blur' event", (t) => {
    Dom.sandbox("<input type='text' id='id' value='value'/>", {}, () => {

        setup();

        let input = document.getElementById("id");
        input.dispatchEvent(new Event("blur"));

        t.deepEqual(checker.check.lastCall.args, [["alternative"], "value"]);
        t.end();
    });
});

test("ExerciseArea should show answer on 'blur' event", (t) => {
    Dom.sandbox("<input type='text' id='id' value='value'/>", {}, () => {

        setup();

        let input = document.getElementById("id");
        input.dispatchEvent(new Event("blur"));

        t.deepEqual(visualizer.showAnswer.lastCall.args, [
            { dataPath: "path", iconId: "icon-id", popupId: "popup-id" }, { accepted: true }]);
        t.end();
    });
});

test("ExerciseArea should ignore unknown blur events", (t) => {
    Dom.sandbox("", {}, () => {

        setup();

        checker.check.reset();
        new ExerciseArea(new BrowserEvent(), checker, visualizer, walker);
        document.dispatchEvent(new Event("blur"));

        t.false(checker.check.called);
        t.end();
    });
});

test("ExerciseArea should hide fields on 'click' event", (t) => {
    Dom.sandbox("<button id='hide-button' data-hide-button />", {}, () => {

        setup();

        let button = document.getElementById("hide-button");
        button.dispatchEvent(new Event("click"));

        t.true(visualizer.hidden);
        t.end();
    });
});

test("ExerciseArea should hide fields on 'click' event and update fields", (t) => {
    Dom.sandbox("<button id='hide-button' data-hide-button />", {}, () => {

        setup();

        let button = document.getElementById("hide-button");
        button.dispatchEvent(new Event("click"));

        t.deepEqual(visualizer.updateField.lastCall.args, [
            { dataPath: "path", iconId: "icon-id", popupId: "popup-id" }, ["alternative"]]);
        t.end();
    });
});

test("ExerciseArea should show fields on 'click' event", (t) => {
    Dom.sandbox("<button id='show-button' data-show-button />", {}, () => {

        setup();

        let button = document.getElementById("show-button");
        button.dispatchEvent(new Event("click"));

        t.false(visualizer.hidden);
        t.end();
    });
});

test("ExerciseArea should show fields on 'click' event and update fields", (t) => {
    Dom.sandbox("<button id='show-button' data-show-button />", {}, () => {

        setup();

        let button = document.getElementById("show-button");
        button.dispatchEvent(new Event("click"));

        t.deepEqual(visualizer.updateField.lastCall.args, [
            { dataPath: "path", iconId: "icon-id", popupId: "popup-id" }, ["alternative"]]);
        t.end();
    });
});

test("ExerciseArea should move to adjacent input on 'keydown'", (t) => {
    Dom.sandbox("<input id='input-id' data-walkable-field />", {}, () => {

        setup();

        let event = document.createEvent("Event");
        event.initEvent("keydown", true, true);
        event.keyCode = 38;

        let input = document.getElementById("input-id");
        input.dispatchEvent(event);

        t.deepEqual(walker.walk.lastCall.args, [38, "input-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore 'keydown' events from unknown targets", (t) => {
    Dom.sandbox("<input id='input-id' />", {}, () => {

        setup();
        walker.walk.reset();

        let input = document.getElementById("input-id");
        input.dispatchEvent(new Event("keydown"));

        t.false(walker.walk.called);
        t.end();
    });
});

test("ExerciseArea should show popup on 'mouseover' event from icon", (t) => {
    Dom.sandbox("<div id='icon-id' />", {}, () => {

        setup();

        let icon = document.getElementById("icon-id");
        icon.dispatchEvent(new Event("mouseover"));

        t.deepEqual(visualizer.showPopup.lastCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore 'mouseover' events from unknown targets", (t) => {
    Dom.sandbox("<div id='unknown-id' />", {}, () => {

        setup();
        visualizer.showPopup.reset();

        let icon = document.getElementById("unknown-id");
        icon.dispatchEvent(new Event("mouseover"));

        t.false(visualizer.showPopup.called);
        t.end();
    });
});

test("ExerciseArea should show popup on 'mouseout' event from icon", (t) => {
    Dom.sandbox("<div id='icon-id' />", {}, () => {

        setup();

        let icon = document.getElementById("icon-id");
        icon.dispatchEvent(new Event("mouseout"));

        t.deepEqual(visualizer.hidePopup.lastCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore 'mouseout' events from unknown targets", (t) => {
    Dom.sandbox("<div id='unknown-id' />", {}, () => {

        setup();
        visualizer.hidePopup.reset();

        let icon = document.getElementById("unknown-id");
        icon.dispatchEvent(new Event("mouseout"));

        t.false(visualizer.hidePopup.called);
        t.end();
    });
});
