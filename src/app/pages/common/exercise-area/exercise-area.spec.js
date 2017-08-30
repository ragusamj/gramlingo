import sinon from "sinon";
import test from "tape";
import Dom from "../../core/mock/dom";
import ExerciseArea from "./exercise-area";

const html = 
    "<script id='popup-template'><table><tbody></tbody></table></script>" +

    "<script id='popup-traffic-light-template'>" +
        "<tr>" +
            "<td id='answer'></td>" +
            "<td id='diff'></td>" +
            "<td id='solution'></td>" +
        "</tr>" +
    "</script>" +

    "<script id='popup-alternatives-template'>" +
        "<tr>" +
            "<td id='alternative'></td>" +
        "</tr>" +
    "</script>" +

    "<div id='icon-1'></div>" +
    "<div id='popup-1'></div>" +
    "<input id='input-1'/>";

const field = { iconId: "icon-1", inputId: "input-1", popupId: "popup-1", prefill: true };
const solutions = ["alternative 1"];

test("ExerciseArea should update field and set input value", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.updateField(field, solutions);
        t.equal(document.getElementById("input-1").value, "alternative 1");
        t.end();
    });
});

test("ExerciseArea should update field and set input value to empty string if inputs shouldn't be filled", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        field.prefill = false;
        exerciseArea.updateField(field, solutions);
        t.equal(document.getElementById("input-1").value, "");
        field.prefill = true;
        t.end();
    });
});

test("ExerciseArea should update field and disable input if there are no solutions", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        let noSolutions = [];
        field.prefill = false;
        exerciseArea.updateField(field, noSolutions);
        t.true(document.getElementById("input-1").disabled);
        field.prefill = true;
        t.end();
    });
});

test("ExerciseArea should update field and set input value to '-' if there are no solutions", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        let noSolutions = [];
        exerciseArea.prefill = false;
        exerciseArea.updateField(field, noSolutions);
        t.equal(document.getElementById("input-1").value, "-");
        t.end();
    });
});

test("ExerciseArea should update field and set input type to 'text' if the value is a string", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.updateField(field, solutions);
        t.equal(document.getElementById("input-1").type, "text");
        t.end();
    });
});

test("ExerciseArea should update field and set input type to 'number' if the value is numeric", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.prefill = true;
        exerciseArea.updateField(field, [123]);
        t.equal(document.getElementById("input-1").type, "number");
        t.end();
    });
});

test("ExerciseArea should update field and set input type to 'number' if the value is numeric and the input shouldn't be filled", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.prefill = false;
        exerciseArea.updateField(field, [123]);
        t.equal(document.getElementById("input-1").type, "number");
        t.end();
    });
});

test("ExerciseArea should update field and hide icon", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.show("icon-1");
        exerciseArea.updateField(field, solutions);
        t.equal(document.getElementById("icon-1").className, "");
        t.end();
    });
});

test("ExerciseArea should update field and hide popup", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.showPopup("popup-1");
        exerciseArea.updateField(field, solutions);
        t.equal(document.getElementById("popup-1").className, "");
        t.end();
    });
});

test("ExerciseArea should show accepted answer and hide icon if there are no solutions", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.show("icon-1");
        exerciseArea.showAnswer(field, { accepted: true, alternatives: [] });
        t.equal(document.getElementById("icon-1").className, "");
        t.end();
    });
});

test("ExerciseArea should show accepted answer and hide popup if there are no solutions", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.showPopup("popup-1");
        exerciseArea.showAnswer(field, { accepted: true, alternatives: [] });
        t.equal(document.getElementById("popup-1").className, "");
        t.end();
    });
});

test("ExerciseArea should show accepted answer and show icon if there are solutions", (t) => {
    Dom.sandbox(html, {}, () => {
        let clock = sinon.useFakeTimers();
        let exerciseArea = new ExerciseArea();
        exerciseArea.hide("icon-1");
        exerciseArea.showAnswer(field, { accepted: true, alternatives: ["alternative 2"], diff: [] });
        t.equal(document.getElementById("icon-1").className, "fa-plus-circle text-info show");
        clock.tick(3000);
        t.end();
    });
});

test("ExerciseArea should show rejected answer and show icon", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.hide("icon-1");
        exerciseArea.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        t.equal(document.getElementById("icon-1").className, "fa-exclamation-circle text-danger show");
        t.end();
    });
});

test("ExerciseArea should show rejected answer and show popup", (t) => {
    Dom.sandbox(html, {}, () => {
        let clock = sinon.useFakeTimers();
        let exerciseArea = new ExerciseArea();
        exerciseArea.hide("popup-1");
        exerciseArea.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        t.equal(document.getElementById("popup-1").className, "show");
        clock.tick(3000);
        t.end();
    });
});

test("ExerciseArea should show rejected answer and hide popup automatically", (t) => {
    Dom.sandbox(html, {}, () => {
        let clock = sinon.useFakeTimers();
        let exerciseArea = new ExerciseArea();
        exerciseArea.showPopup("popup-1");
        exerciseArea.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        clock.tick(3000);
        t.equal(document.getElementById("popup-1").className, "");
        t.end();
    });
});

test("ExerciseArea should show rejected answer and display the answer", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.showAnswer(field, { accepted: false, alternatives: [], answer: "answer", diff: [] });
        t.equal(document.querySelectorAll("td")[0].innerHTML, "answer");
        t.end();
    });
});

test("ExerciseArea should show rejected answer and display the diff between the answer and the solution", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.showAnswer(field, { accepted: false, alternatives: [], diff: [[0, "vamo"], [-1, "s"], [1, "z"]], });
        t.equal(document.querySelectorAll("td")[1].innerHTML,
            "<span>vamo</span><span class=\"missing-letter\">s</span><span class=\"text-danger alien-letter\">z</span>");
        t.end();
    });
});

test("ExerciseArea should show rejected answer and display the solution", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.showAnswer(field, { accepted: false, alternatives: [], diff: [], solution: "solution" });
        t.equal(document.querySelectorAll("td")[2].innerHTML, "solution");
        t.end();
    });
});

test("ExerciseArea should show popup and display solutions", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.showAnswer(field, { accepted: false, alternatives: ["solution", "solution 2"], diff: [], solution: "solution" });
        t.equal(document.querySelectorAll("td")[3].innerHTML, "solution 2");
        t.end();
    });
});

test("ExerciseArea should hide popup and handle non existing element", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.hide("does-not-exist");
        t.equal(document.getElementById("does-not-exist"), null);
        t.end();
    });
});

test("ExerciseArea should show element", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.show("icon-1");
        t.equal(document.getElementById("icon-1").className, "show");
        t.end();
    });
});

test("ExerciseArea should hide element", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.hide("icon-1");
        t.equal(document.getElementById("icon-1").className, "");
        t.end();
    });
});

test("ExerciseArea should show popup", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();
        exerciseArea.showPopup("popup-1");
        t.equal(document.getElementById("popup-1").className, "show");
        t.end();
    });
});

test("ExerciseArea should hide last shown popup before showing popup", (t) => {
    Dom.sandbox(html, {}, () => {
        let exerciseArea = new ExerciseArea();

        let lastPopup = document.createElement("div");
        lastPopup.id = "popup-2";
        document.body.appendChild(lastPopup);

        exerciseArea.showPopup("popup-1");
        exerciseArea.showPopup("popup-2");

        t.equal(document.getElementById("popup-1").className, "");
        t.equal(document.getElementById("popup-2").className, "show");
        t.end();
    });
});
