import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../core/browser-event";
import Dom from "../../core/mock/dom";
import ExerciseAreaListener from "./exercise-area-listener";

const checker = {
    check: sinon.stub().returns({ accepted: true })
};

const exerciseArea = {
    hide: sinon.spy(),
    showAnswer: sinon.spy(),
    showPopup: sinon.spy(),
    updateField: sinon.spy()
};

const walker = {
    link: sinon.spy(),
    walk: sinon.spy()
};

const setup = () => {
    let exerciseAreaListener = new ExerciseAreaListener(new BrowserEvent(), checker, exerciseArea, walker);
    exerciseAreaListener.onPageFieldListUpdated({detail: { "id": { dataPath: "path", iconId: "icon-id", popupId: "popup-id" } }});
    exerciseAreaListener.onPageDataUpdated({ detail: { "path": ["alternative"] }});
    return exerciseAreaListener;
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

        t.deepEqual(exerciseArea.showAnswer.lastCall.args, [
            { dataPath: "path", iconId: "icon-id", popupId: "popup-id" }, { accepted: true }]);
        t.end();
    });
});

test("ExerciseArea should ignore unknown blur events", (t) => {
    Dom.sandbox("", {}, () => {

        setup();

        checker.check.reset();
        new ExerciseAreaListener(new BrowserEvent(), checker, exerciseArea, walker);
        document.dispatchEvent(new Event("blur"));

        t.false(checker.check.called);
        t.end();
    });
});

test("ExerciseArea should toggle inputs on 'click' event", (t) => {
    Dom.sandbox("<button id='toggle-button' data-toggle-inputs />", {}, () => {

        setup();
        let button = document.getElementById("toggle-button");
        exerciseArea.prefill = true;

        button.dispatchEvent(new Event("click"));
        t.false(exerciseArea.prefill);

        button.dispatchEvent(new Event("click"));
        t.true(exerciseArea.prefill);

        t.end();
    });
});

test("ExerciseArea should toggle inputs on 'click' event and update fields", (t) => {
    Dom.sandbox("<button id='toggle-button' data-toggle-inputs />", {}, () => {

        setup();
        let button = document.getElementById("toggle-button");

        button.dispatchEvent(new Event("click"));

        t.deepEqual(exerciseArea.updateField.lastCall.args, [
            { dataPath: "path", iconId: "icon-id", popupId: "popup-id" }, ["alternative"]]);
        t.end();
    });
});

test("ExerciseArea should ignore 'click' event if element doesn't have the attribute 'data-toggle-inputs'", (t) => {
    Dom.sandbox("<button id='toggle-button' />", {}, () => {

        setup();
        let button = document.getElementById("toggle-button");
        exerciseArea.prefill = true;

        button.dispatchEvent(new Event("click"));
        t.true(exerciseArea.prefill);

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

        t.deepEqual(exerciseArea.showPopup.lastCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore 'mouseover' events from unknown targets", (t) => {
    Dom.sandbox("<div id='unknown-id' />", {}, () => {

        setup();
        exerciseArea.showPopup.reset();

        let icon = document.getElementById("unknown-id");
        icon.dispatchEvent(new Event("mouseover"));

        t.false(exerciseArea.showPopup.called);
        t.end();
    });
});

test("ExerciseArea should show popup on 'mouseout' event from icon", (t) => {
    Dom.sandbox("<div id='icon-id' />", {}, () => {

        setup();

        let icon = document.getElementById("icon-id");
        icon.dispatchEvent(new Event("mouseout"));

        t.deepEqual(exerciseArea.hide.lastCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore 'mouseout' events from unknown targets", (t) => {
    Dom.sandbox("<div id='unknown-id' />", {}, () => {

        setup();
        exerciseArea.hide.reset();

        let icon = document.getElementById("unknown-id");
        icon.dispatchEvent(new Event("mouseout"));

        t.false(exerciseArea.hide.called);
        t.end();
    });
});

test("ExerciseArea should link walker when page data is updated", (t) => {
    Dom.sandbox("", {}, () => {

        let exerciseAreaListener = setup();
        walker.link.reset();
        exerciseAreaListener.onPageDataUpdated({ detail: { "path": ["alternative"] }});

        t.deepEqual(walker.link.firstCall.args, [["id"]]);
        t.end();
    });
});
