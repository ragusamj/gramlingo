import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import BrowserEvent from "../../../core/browser-event";
import ExerciseAreaListener from "./exercise-area-listener";

const field = { dataPath: "path", iconId: "icon-id", popupId: "popup-id", prefill: true };

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
    walk: sinon.stub().returns(true)
};

const setup = () => {
    let exerciseAreaListener = new ExerciseAreaListener(new BrowserEvent(), checker, exerciseArea, walker);
    exerciseAreaListener.onPageFieldListUpdated({ detail: { "id": field } });
    exerciseAreaListener.onPageDataUpdated({ detail: { "path": ["alternative"] } } );
    return exerciseAreaListener;
};

test("ExerciseArea should check input value on 'blur' event", (t) => {
    dom.sandbox("<input type='text' id='id' value='value'/>", {}, () => {

        setup();
        let input = document.getElementById("id");

        input.dispatchEvent(new Event("blur"));

        t.deepEqual(checker.check.lastCall.args, [["alternative"], "value"]);
        t.end();
    });
});

test("ExerciseArea should show answer on 'blur' event", (t) => {
    dom.sandbox("<input type='text' id='id' value='value'/>", {}, () => {

        setup();
        let input = document.getElementById("id");

        input.dispatchEvent(new Event("blur"));

        t.deepEqual(exerciseArea.showAnswer.lastCall.args, [
            { dataPath: "path", iconId: "icon-id", popupId: "popup-id", prefill: true }, { accepted: true }]);
        t.end();
    });
});

test("ExerciseArea should execute field filters on 'blur' event", (t) => {
    dom.sandbox("<input type='text' id='id' value='value'/>", {}, () => {

        setup();
        let input = document.getElementById("id");
        let filter = sinon.spy();
        field.filter = filter;

        input.dispatchEvent(new Event("blur"));

        t.deepEqual(filter.lastCall.args, [input, ["alternative"]]);

        delete field.filter;
        t.end();
    });
});

test("ExerciseArea should ignore unknown blur events", (t) => {
    dom.sandbox("", {}, () => {

        setup();
        checker.check.reset();
        new ExerciseAreaListener(new BrowserEvent(), checker, exerciseArea, walker);

        document.dispatchEvent(new Event("blur"));

        t.false(checker.check.called);
        t.end();
    });
});

test("ExerciseArea should toggle inputs on 'click' event", (t) => {
    dom.sandbox("<button id='toggle-button' data-toggle-inputs />", {}, () => {

        setup();
        let button = document.getElementById("toggle-button");

        button.dispatchEvent(new Event("click"));
        t.false(field.prefill);

        button.dispatchEvent(new Event("click"));
        t.true(field.prefill);

        t.end();
    });
});

test("ExerciseArea should toggle inputs on 'click' event and update fields", (t) => {
    dom.sandbox("<button id='toggle-button' data-toggle-inputs />", {}, () => {

        setup();
        let button = document.getElementById("toggle-button");

        button.dispatchEvent(new Event("click"));

        t.deepEqual(exerciseArea.updateField.lastCall.args, [
            { dataPath: "path", iconId: "icon-id", popupId: "popup-id", prefill: false  }, ["alternative"]]);

        field.prefill = true;
        t.end();
    });
});

test("ExerciseArea should toggle inputs with matching field group on 'click' event", (t) => {
    dom.sandbox("<button id='toggle-button' data-toggle-inputs='path' />", {}, () => {

        setup();
        let button = document.getElementById("toggle-button");

        button.dispatchEvent(new Event("click"));
        t.false(field.prefill);

        button.dispatchEvent(new Event("click"));
        t.true(field.prefill);

        t.end();
    });
});

test("ExerciseArea should not toggle inputs without matching field group on 'click' event", (t) => {
    dom.sandbox("<button id='toggle-button' data-toggle-inputs='nonmatching.path' />", {}, () => {

        setup();
        let button = document.getElementById("toggle-button");

        button.dispatchEvent(new Event("click"));
        t.true(field.prefill);

        t.end();
    });
});

test("ExerciseArea should ignore 'click' event if element doesn't have the attribute 'data-toggle-inputs'", (t) => {
    dom.sandbox("<button id='toggle-button' />", {}, () => {

        setup();
        let button = document.getElementById("toggle-button");
        field.prefill = true;

        button.dispatchEvent(new Event("click"));

        t.true(field.prefill);
        t.end();
    });
});

test("ExerciseArea should move to adjacent input on 'keydown'", (t) => {
    dom.sandbox("<input id='input-id' data-walkable-field />", {}, () => {

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

test("ExerciseArea should prevent default if the walker walked on 'keydown'", (t) => {
    dom.sandbox("<input id='input-id' data-walkable-field />", {}, () => {

        setup();
        let event = document.createEvent("Event");
        event.initEvent("keydown", true, true);
        event.keyCode = 38;
        sinon.spy(event, "preventDefault");
        let input = document.getElementById("input-id");

        input.dispatchEvent(event);

        t.true(event.preventDefault.called);
        t.end();
    });
});

test("ExerciseArea should not prevent default if the walker didn't walk on 'keydown'", (t) => {
    dom.sandbox("<input id='input-id' data-walkable-field />", {}, () => {

        walker.walk.returns(false);
        setup();
        let event = document.createEvent("Event");
        event.initEvent("keydown", true, true);
        event.keyCode = 38;
        sinon.spy(event, "preventDefault");
        let input = document.getElementById("input-id");

        input.dispatchEvent(event);

        t.false(event.preventDefault.called);
        t.end();

        walker.walk.returns(true);
    });
});

test("ExerciseArea should ignore 'keydown' events from unknown targets", (t) => {
    dom.sandbox("<input id='input-id' />", {}, () => {

        setup();
        walker.walk.reset();
        let input = document.getElementById("input-id");

        input.dispatchEvent(new Event("keydown"));

        t.false(walker.walk.called);
        t.end();
    });
});

test("ExerciseArea should show popup on 'mouseover' event from icon", (t) => {
    dom.sandbox("<div id='icon-id' />", {}, () => {

        setup();
        let icon = document.getElementById("icon-id");

        icon.dispatchEvent(new Event("mouseover"));

        t.deepEqual(exerciseArea.showPopup.lastCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore 'mouseover' events from unknown targets", (t) => {
    dom.sandbox("<div id='unknown-id' />", {}, () => {

        setup();
        exerciseArea.showPopup.reset();
        let icon = document.getElementById("unknown-id");

        icon.dispatchEvent(new Event("mouseover"));

        t.false(exerciseArea.showPopup.called);
        t.end();
    });
});

test("ExerciseArea should show popup on 'mouseout' event from icon", (t) => {
    dom.sandbox("<div id='icon-id' />", {}, () => {

        setup();
        let icon = document.getElementById("icon-id");

        icon.dispatchEvent(new Event("mouseout"));

        t.deepEqual(exerciseArea.hide.lastCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore 'mouseout' events from unknown targets", (t) => {
    dom.sandbox("<div id='unknown-id' />", {}, () => {

        setup();
        exerciseArea.hide.reset();
        let icon = document.getElementById("unknown-id");

        icon.dispatchEvent(new Event("mouseout"));

        t.false(exerciseArea.hide.called);
        t.end();
    });
});

test("ExerciseArea should link walker when page data is updated", (t) => {
    dom.sandbox("", {}, () => {

        let exerciseAreaListener = setup();
        walker.link.reset();

        exerciseAreaListener.onPageDataUpdated({ detail: { "path": ["alternative"] }});

        t.deepEqual(walker.link.firstCall.args, [["id"]]);
        t.end();
    });
});

test("ExerciseArea should preserve show/hide mode when field list is updated", (t) => {
    dom.sandbox("", {}, () => {

        let exerciseAreaListener = setup();
        field.prefill = false;

        exerciseAreaListener.onPageFieldListUpdated({detail: {}});

        t.false(field.prefill);
        t.end();
    });
});
