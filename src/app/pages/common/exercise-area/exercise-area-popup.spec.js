import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import ExerciseAreaPopup from "./exercise-area-popup";

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

const field = { iconId: "icon-1", inputId: "input-1", popupId: "popup-1" };

test("ExerciseAreaPopup should show an accepted answer and hide the icon if there are no solutions", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showElement("icon-1");
        exerciseAreaPopup.showAnswer(field, { accepted: true, alternatives: [] });
        t.equal(document.getElementById("icon-1").className, "");
        t.end();
    });
});

test("ExerciseAreaPopup should show an accepted answer and hide the popup if there are no solutions", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.show("popup-1");
        exerciseAreaPopup.showAnswer(field, { accepted: true, alternatives: [] });
        t.equal(document.getElementById("popup-1").className, "");
        t.end();
    });
});

test("ExerciseAreaPopup should show an accepted answer and show the icon if there are solutions", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.hideElement("icon-1");
        exerciseAreaPopup.showAnswer(field, { accepted: true, alternatives: ["alternative 2"], diff: [] });
        t.equal(document.getElementById("icon-1").className, "fa-plus-circle text-info show");
        t.end();
    });
});

test("ExerciseAreaPopup should show a rejected answer and show the icon", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.hideElement("icon-1");
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        t.equal(document.getElementById("icon-1").className, "fa-exclamation-circle text-danger show");
        t.end();
    });
});

test("ExerciseAreaPopup should show a rejected answer and show the popup", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.hideElement("popup-1");
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        t.equal(document.getElementById("popup-1").className, "show");
        t.end();
    });
});

test("ExerciseAreaPopup should show a rejected answer and hide the popup automatically", (t) => {
    dom.sandbox(html, {}, () => {
        let clock = sinon.useFakeTimers();
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.show("popup-1");
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        clock.tick(3000);
        t.equal(document.getElementById("popup-1").className, "");
        t.end();
    });
});

test("ExerciseAreaPopup should show a rejected answer and display the answer", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], answer: "answer", diff: [] });
        t.equal(document.querySelectorAll("td")[0].innerHTML, "answer");
        t.end();
    });
});

test("ExerciseAreaPopup should show a rejected answer and display the diff between the answer and the solution", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], diff: [[0, "vamo"], [-1, "s"], [1, "z"]], });
        t.equal(document.querySelectorAll("td")[1].innerHTML,
            "<span>vamo</span><span class=\"missing-letter\">s</span><span class=\"text-danger alien-letter\">z</span>");
        t.end();
    });
});

test("ExerciseAreaPopup should show a rejected answer and display the solution", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], diff: [], solution: "solution" });
        t.equal(document.querySelectorAll("td")[2].innerHTML, "solution");
        t.end();
    });
});

test("ExerciseAreaPopup should not close the popup automatically if the user clicks inside of it", (t) => {
    dom.sandbox(html, {}, () => {
        let clock = sinon.useFakeTimers();
        let popup = document.getElementById("popup-1");
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        exerciseAreaPopup.click({ target: popup });
        clock.tick(3000);
        t.equal(popup.className, "show");
        t.end();
    });
});

test("ExerciseAreaPopup should close the popup if the user clicks outside of it", (t) => {
    dom.sandbox(html, {}, () => {
        let clock = sinon.useFakeTimers();
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        clock.tick(100);
        exerciseAreaPopup.click({ target: document.getElementById("input-1") });
        t.equal(document.getElementById("popup-1").className, "");
        t.end();
    });
});

test("ExerciseAreaPopup should not allow outside clicks while the popup is opening", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: [], diff: [] });
        exerciseAreaPopup.click({ target: document.getElementById("input-1") });
        t.equal(document.getElementById("popup-1").className, "show");
        t.end();
    });
});

test("ExerciseAreaPopup should show the popup and display the solutions", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showAnswer(field, { accepted: false, alternatives: ["solution", "solution 2"], diff: [], solution: "solution" });
        t.equal(document.querySelectorAll("td")[3].innerHTML, "solution 2");
        t.end();
    });
});

test("ExerciseAreaPopup should hide the popup without crashing if the element doesn't exist", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.hideElement("does-not-exist");
        t.equal(document.getElementById("does-not-exist"), null);
        t.end();
    });
});

test("ExerciseAreaPopup should show an element", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.showElement("icon-1");
        t.equal(document.getElementById("icon-1").className, "show");
        t.end();
    });
});

test("ExerciseAreaPopup should hide an element", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.hideElement("icon-1");
        t.equal(document.getElementById("icon-1").className, "");
        t.end();
    });
});

test("ExerciseAreaPopup should show the popup", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();
        exerciseAreaPopup.show("popup-1");
        t.equal(document.getElementById("popup-1").className, "show");
        t.end();
    });
});

test("ExerciseAreaPopup should hide the last shown popup before showing the popup", (t) => {
    dom.sandbox(html, {}, () => {
        let exerciseAreaPopup = new ExerciseAreaPopup();

        let lastPopup = document.createElement("div");
        lastPopup.id = "popup-2";
        document.body.appendChild(lastPopup);

        exerciseAreaPopup.show("popup-1");
        exerciseAreaPopup.show("popup-2");

        t.equal(document.getElementById("popup-1").className, "");
        t.equal(document.getElementById("popup-2").className, "show");
        t.end();
    });
});
