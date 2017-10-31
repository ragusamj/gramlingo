import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import ExerciseArea from "./exercise-area";
import KeyCode from "../walkers/key-code";

const html = 
    "<input id='input-1' data-walkable-field/>" +
    "<div id='icon-id'></div>";

const pageTemplate = {};

const fields = {
    "input-1": {
        dataPath: "some.path",
        iconId: "icon-id",
        inputId: "input-1",
        popupId: "popup-id"
    }
};

const context = {
    toggler: "toggle-some-data",
    some: {
        path: ["alternative 1", "alternative 2"]
    }
};

const checker = {
    check: sinon.stub().returns({ accepted: true })
};

const exerciseAreaPopup = {
    click: sinon.stub(),
    show: sinon.stub(),
    showAnswer: sinon.stub(),
    hideElement: sinon.stub()
};

const fieldGenerator = {
    build: sinon.stub().returns(fields)
};

const walker = {
    link: sinon.stub(),
    walk: sinon.stub().returns(true)
};

const setup = () => {
    const exerciseArea = new ExerciseArea(checker, exerciseAreaPopup, fieldGenerator, walker);
    exerciseArea.build(pageTemplate, context);
    exerciseArea.updateContext(context);
    return exerciseArea;
};

test("ExerciseArea should build the fields", (t) => {
    dom.sandbox(html, {}, () => {
        fieldGenerator.build.resetHistory();
        setup();
        
        t.deepEqual(fieldGenerator.build.firstCall.args, [pageTemplate, context]);
        t.end();
    });
});

test("ExerciseArea should update the context and set the toggler state from localStorage", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();

        localStorage.setItem(context.toggler, "on");
        exerciseArea.updateContext(context);
        t.equal(context.toggleState, "on");

        localStorage.setItem(context.toggler, "off");
        exerciseArea.updateContext(context);
        t.equal(context.toggleState, "off");

        delete context.toggleState;

        t.end();
    });
});

test("ExerciseArea should update the context and link the walker", (t) => {
    dom.sandbox(html, {}, () => {
        walker.link.reset();
        let exerciseArea = setup();

        exerciseArea.updateContext(context);
        
        t.deepEqual(walker.link.firstCall.args, [["input-1"]]);
        t.end();
    });
});

test("ExerciseArea should update a field and set its input value", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseArea.updateField(fields["input-1"], context.some.path, "on");
        t.equal(document.getElementById("input-1").value, "alternative 1");
        t.end();
    });
});

test("ExerciseArea should update a field and treat undefined state as 'on'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseArea.updateField(fields["input-1"], context.some.path, undefined);
        t.equal(document.getElementById("input-1").value, "alternative 1");
        t.end();
    });
});

test("ExerciseArea should update a field and set its input value to an empty string if inputs shouldn't be filled", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseArea.updateField(fields["input-1"], context.some.path, "off");
        t.equal(document.getElementById("input-1").value, "");
        t.end();
    });
});

test("ExerciseArea should update a field and disable its input if there are no solutions", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let noSolutions = [];
        exerciseArea.updateField(fields["input-1"], noSolutions, "on");
        t.true(document.getElementById("input-1").disabled);
        t.end();
    });
});

test("ExerciseArea should update a field and set its input value to '-' if there are no solutions", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let noSolutions = [];
        exerciseArea.updateField(fields["input-1"], noSolutions, "on");
        t.equal(document.getElementById("input-1").value, "-");
        t.end();
    });
});

test("ExerciseArea should update a field and set its input type to 'text' if the value is a string", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseArea.updateField(fields["input-1"], context.some.path, "on");
        t.equal(document.getElementById("input-1").type, "text");
        t.end();
    });
});

test("ExerciseArea should update a field and set its input type to 'number' if the value is numeric", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseArea.updateField(fields["input-1"], [123], "on");
        t.equal(document.getElementById("input-1").type, "number");
        t.end();
    });
});

test("ExerciseArea should update a field and set its input type to 'number' if the value is numeric and the input shouldn't be filled", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseArea.updateField(fields["input-1"], [123], "off");
        t.equal(document.getElementById("input-1").type, "number");
        t.end();
    });
});

test("ExerciseArea should check the answer on the event 'blur'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let input = document.getElementById("input-1");
        input.value = "value";
        checker.check.resetHistory();
        
        exerciseArea.onBlur({ target: input });

        t.deepEqual(checker.check.firstCall.args, [context.some.path, "value"]);
        t.end();
    });
});

test("ExerciseArea should show the answer on the event 'blur'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseAreaPopup.showAnswer.resetHistory();
        
        exerciseArea.onBlur({ target: document.getElementById("input-1") });

        t.deepEqual(exerciseAreaPopup.showAnswer.firstCall.args, [fields["input-1"], { accepted: true }]);
        t.end();
    });
});

test("ExerciseArea should execute field filters on the event 'blur'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let input = document.getElementById("input-1");
        let field = fields["input-1"];
        field.filter = sinon.stub();

        exerciseArea.onBlur({ target: input });

        t.deepEqual(field.filter.firstCall.args, [input, context.some.path]);

        delete field.filter;
        t.end();
    });
});

test("ExerciseArea should ignore unknown 'blur' events", (t) => {
    dom.sandbox(html + "<input id='input-unknown' value='value'/>", {}, () => {
        let exerciseArea = setup();
        checker.check.reset();
        
        exerciseArea.onBlur({ target: document.getElementById("input-unknown") });

        t.false(checker.check.called);
        t.end();
    });
});

test("ExerciseArea should send click events to the excerise popup on the event 'click'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let mockEvent = {};
        
        exerciseArea.onClick(mockEvent);

        t.true(exerciseAreaPopup.click.calledWith(mockEvent));
        t.end();
    });
});

test("ExerciseArea should move to an adjacent input on the event 'keydown'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let input = document.getElementById("input-1");
        let e = { keyCode: KeyCode.downArrow, preventDefault: sinon.stub(), target: input };
        walker.walk.resetHistory();

        exerciseArea.onKeydown(e);

        t.deepEqual(walker.walk.firstCall.args, [KeyCode.downArrow, input.id]);
        t.end();
    });
});

test("ExerciseArea should prevent the default action if the walker walked on the event 'keydown'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let input = document.getElementById("input-1");
        let e = { keyCode: KeyCode.downArrow, preventDefault: sinon.stub(), target: input };
        walker.walk.resetHistory();

        exerciseArea.onKeydown(e);

        t.true(e.preventDefault.called);
        t.end();
    });
});

test("ExerciseArea should not prevent the default action if the walker didn't walk on the event 'keydown'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let input = document.getElementById("input-1");
        let e = { keyCode: KeyCode.downArrow, preventDefault: sinon.stub(), target: input };
        walker.walk.returns(false);
        walker.walk.resetHistory();

        exerciseArea.onKeydown(e);

        t.false(e.preventDefault.called);
        t.end();

        walker.walk.returns(true);
    });
});

test("ExerciseArea should ignore unknown 'keydown' events", (t) => {
    dom.sandbox(html + "<input id='input-unknown' value='value'/>", {}, () => {
        let exerciseArea = setup();
        walker.walk.resetHistory();
        
        exerciseArea.onKeydown({ target: document.getElementById("input-unknown") });

        t.false(walker.walk.called);
        t.end();
    });
});

test("ExerciseArea should show the popup on the event 'mouseover' from an icon", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let icon = document.getElementById("icon-id");
        exerciseAreaPopup.show.resetHistory();

        exerciseArea.onMouseover({ target: icon });

        t.deepEqual(exerciseAreaPopup.show.firstCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore unknown 'mouseover' events", (t) => {
    dom.sandbox(html + "<div id='icon-unknown'></div>", {}, () => {
        let exerciseArea = setup();
        exerciseAreaPopup.show.resetHistory();
        
        exerciseArea.onMouseover({ target: document.getElementById("icon-unknown") });

        t.false(exerciseAreaPopup.show.called);
        t.end();
    });
});

test("ExerciseArea should show the popup on the event 'mouseout' from an icon", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        let icon = document.getElementById("icon-id");
        exerciseAreaPopup.hideElement.resetHistory();

        exerciseArea.onMouseout({ target: icon });

        t.deepEqual(exerciseAreaPopup.hideElement.firstCall.args, ["popup-id"]);
        t.end();
    });
});

test("ExerciseArea should ignore unknown 'mouseout' events", (t) => {
    dom.sandbox(html + "<div id='icon-unknown'></div>", {}, () => {
        let exerciseArea = setup();
        exerciseAreaPopup.hideElement.resetHistory();
        
        exerciseArea.onMouseout({ target: document.getElementById("icon-unknown") });

        t.false(exerciseAreaPopup.hideElement.called);
        t.end();
    });
});

test("ExerciseArea should set the toggle state on the event 'toggle-success'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseAreaPopup.hideElement.resetHistory();
        
        exerciseArea.onToggleSuccess({ detail: { id: "toggle-some-data", state: "off" }});

        t.equal(context.toggleState, "off");
        t.end();
    });
});

test("ExerciseArea should hide the popup on the event 'toggle-success'", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseAreaPopup.hideElement.resetHistory();
        
        exerciseArea.onToggleSuccess({ detail: { id: "toggle-some-data", state: "on" }});

        t.true(exerciseAreaPopup.hideElement.calledWith("popup-id"));
        t.end();
    });
});

test("ExerciseArea should ignore unknown 'toggle-success' events", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseArea = setup();
        exerciseAreaPopup.hideElement.resetHistory();
        
        exerciseArea.onToggleSuccess({ detail: { id: "unknown", state: "on" }});

        t.false(exerciseAreaPopup.hideElement.called);
        t.end();
    });
});
