import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import ExerciseArea from "./exercise-area";

const html = "<input id='input-1' value='value'/>";

const checker = {
    check: sinon.stub().returns({ accepted: true })
};

const exerciseAreaPopup = {
    show: sinon.stub(),
    hideElement: sinon.stub()
};

const fieldGenerator = {
    build: sinon.stub()
};

const walker = {
    link: sinon.stub(),
    walk: sinon.stub().returns(true)
};

const field = { iconId: "icon-1", inputId: "input-1", popupId: "popup-1" };
const solutions = ["alternative 1"];
const exerciseArea = new ExerciseArea(checker, exerciseAreaPopup, fieldGenerator, walker);
/*
test("ExerciseArea should check input value on the event 'blur'", (t) => {
    dom.sandbox(html, {}, () => {
        checker.check.resetHistory();
        
        let input = document.getElementById("id");
        exerciseArea.onBlur();

        t.deepEqual(checker.check.lastCall.args, [["alternative"], "value"]);
        t.end();
    });
});
*/
/*
const field = { dataPath: "path", iconId: "icon-id", popupId: "popup-id" };

const setup = () => {
    let exerciseAreaListener = new ExerciseAreaListener(new BrowserEvent(), exerciseArea);
    exerciseAreaListener.onPageFieldListUpdated({ detail: { "id": field } });
    exerciseAreaListener.onPageDataUpdated({ detail: { "path": ["alternative"], toggler: "toggler" } } );
    return exerciseAreaListener;
};

test("ExerciseAreaListener should show answer on the event 'blur'", (t) => {
    dom.sandbox("<input type='text' id='id' value='value'/>", {}, () => {

        setup();
        let input = document.getElementById("id");

        input.dispatchEvent(new Event("blur"));

        t.deepEqual(exerciseArea.showAnswer.lastCall.args, [
            { dataPath: "path", iconId: "icon-id", popupId: "popup-id" }, { accepted: true }]);
        t.end();
    });
});

test("ExerciseAreaListener should execute field filters on the event 'blur'", (t) => {
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

test("ExerciseAreaListener should ignore unknown blur events", (t) => {
    dom.sandbox("", {}, () => {

        setup();
        checker.check.reset();
        new ExerciseAreaListener(new BrowserEvent(), checker, exerciseArea, walker);

        document.dispatchEvent(new Event("blur"));

        t.false(checker.check.called);
        t.end();
    });
});

test("ExerciseAreaListener should move to adjacent input on the event 'keydown'", (t) => {
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

test("ExerciseAreaListener should prevent default if the walker walked on the event 'keydown'", (t) => {
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

test("ExerciseAreaListener should not prevent default if the walker didn't walk on the event 'keydown'", (t) => {
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

test("ExerciseAreaListener should ignore 'keydown' events from unknown targets", (t) => {
    dom.sandbox("<input id='input-id' />", {}, () => {

        setup();
        walker.walk.reset();
        let input = document.getElementById("input-id");

        input.dispatchEvent(new Event("keydown"));

        t.false(walker.walk.called);
        t.end();
    });
});

test("ExerciseAreaListener should show popup on the event 'mouseover' from an icon", (t) => {
    dom.sandbox("<div id='icon-id' />", {}, () => {

        setup();
        let icon = document.getElementById("icon-id");

        icon.dispatchEvent(new Event("mouseover"));

        t.deepEqual(exerciseArea.showPopup.lastCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseAreaListener should ignore 'mouseover' events from unknown targets", (t) => {
    dom.sandbox("<div id='unknown-id' />", {}, () => {

        setup();
        exerciseArea.showPopup.reset();
        let icon = document.getElementById("unknown-id");

        icon.dispatchEvent(new Event("mouseover"));

        t.false(exerciseArea.showPopup.called);
        t.end();
    });
});

test("ExerciseAreaListener should show popup on the 'mouseout' event from an icon", (t) => {
    dom.sandbox("<div id='icon-id' />", {}, () => {

        setup();
        let icon = document.getElementById("icon-id");

        icon.dispatchEvent(new Event("mouseout"));

        t.deepEqual(exerciseArea.hide.lastCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseAreaListener should ignore 'mouseout' events from unknown targets", (t) => {
    dom.sandbox("<div id='unknown-id' />", {}, () => {

        setup();
        exerciseArea.hide.reset();
        let icon = document.getElementById("unknown-id");

        icon.dispatchEvent(new Event("mouseout"));

        t.false(exerciseArea.hide.called);
        t.end();
    });
});

test("ExerciseAreaListener should link the walker when page data is updated", (t) => {
    dom.sandbox("", {}, () => {

        let exerciseAreaListener = setup();
        walker.link.reset();

        exerciseAreaListener.onPageDataUpdated({ detail: { "path": ["alternative"] }});

        t.deepEqual(walker.link.firstCall.args, [["id"]]);
        t.end();
    });
});

test("ExerciseAreaListener should update fields on the event 'toggle-success'", (t) => {
    dom.sandbox("", {}, () => {

        let exerciseAreaListener = setup();
        exerciseArea.updateField.resetHistory();

        exerciseAreaListener.onToggleSuccess({ detail: { id: "toggler", state: "on" }});

        t.deepEqual(exerciseArea.updateField.firstCall.args, [ field, [ "alternative" ], "on" ]);
        t.end();
    });
});

test("ExerciseAreaListener should ignore the event 'toggle-success' from unknown togglers", (t) => {
    dom.sandbox("", {}, () => {

        let exerciseAreaListener = setup();
        exerciseArea.updateField.resetHistory();

        exerciseAreaListener.onToggleSuccess({ detail: { id: "unknown", state: "on" }});

        t.false(exerciseArea.called);
        t.end();
    });
});
*/

test("ExerciseArea should update a field and set its input value", (t) => {
    dom.sandbox(html, {}, () => {
        exerciseArea.updateField(field, solutions, "on");
        t.equal(document.getElementById("input-1").value, "alternative 1");
        t.end();
    });
});

test("ExerciseArea should update a field and treat undefined state as 'on'", (t) => {
    dom.sandbox(html, {}, () => {
        exerciseArea.updateField(field, solutions, undefined);
        t.equal(document.getElementById("input-1").value, "alternative 1");
        t.end();
    });
});

test("ExerciseArea should update a field and set its input value to an empty string if inputs shouldn't be filled", (t) => {
    dom.sandbox(html, {}, () => {
        exerciseArea.updateField(field, solutions, "off");
        t.equal(document.getElementById("input-1").value, "");
        t.end();
    });
});

test("ExerciseArea should update a field and disable its input if there are no solutions", (t) => {
    dom.sandbox(html, {}, () => {
        let noSolutions = [];
        exerciseArea.updateField(field, noSolutions, "on");
        t.true(document.getElementById("input-1").disabled);
        t.end();
    });
});

test("ExerciseArea should update a field and set its input value to '-' if there are no solutions", (t) => {
    dom.sandbox(html, {}, () => {
        let noSolutions = [];
        exerciseArea.updateField(field, noSolutions, "on");
        t.equal(document.getElementById("input-1").value, "-");
        t.end();
    });
});

test("ExerciseArea should update a field and set its input type to 'text' if the value is a string", (t) => {
    dom.sandbox(html, {}, () => {
        exerciseArea.updateField(field, solutions, "on");
        t.equal(document.getElementById("input-1").type, "text");
        t.end();
    });
});

test("ExerciseArea should update a field and set its input type to 'number' if the value is numeric", (t) => {
    dom.sandbox(html, {}, () => {
        exerciseArea.updateField(field, [123], "on");
        t.equal(document.getElementById("input-1").type, "number");
        t.end();
    });
});

test("ExerciseArea should update a field and set its input type to 'number' if the value is numeric and the input shouldn't be filled", (t) => {
    dom.sandbox(html, {}, () => {
        exerciseArea.updateField(field, [123], "off");
        t.equal(document.getElementById("input-1").type, "number");
        t.end();
    });
});
