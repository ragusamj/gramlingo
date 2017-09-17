import dom from "jsdom-sandbox";
import test from "tape";
import FieldGenerator from "./field-generator";
import Template from "../../core/template/template";

const generator = new FieldGenerator();

const fieldTemplate = 
    "<script id='excercise-area-template'>" +
        "<div id='popup'></div>" +
        "<div id='icon'></div>" +
        "<input id='input' type='text'/>" +
    "</script>";

test("FieldGenerator should build and return field list with data paths", (t) => {
    dom.sandbox(fieldTemplate, {}, () => {
        let pageTemplate = new Template("<div data-field-path='path'></div>");

        let fieldList = generator.build(pageTemplate, { path: [ {} ] });

        let key = Object.keys(fieldList)[0];
        t.equal(fieldList[key].dataPath, "path[0]");
        t.end();
    });
});

test("FieldGenerator should build and return field list with icon ids", (t) => {
    dom.sandbox(fieldTemplate, {}, () => {
        let pageTemplate = new Template("<div data-field-path='path'></div>");

        let fieldList = generator.build(pageTemplate, { path: [ {} ] });

        let key = Object.keys(fieldList)[0];
        t.true(fieldList[key].iconId.startsWith("icon_"));
        t.end();
    });
});

test("FieldGenerator should build and return field list with input ids", (t) => {
    dom.sandbox(fieldTemplate, {}, () => {
        let pageTemplate = new Template("<div data-field-path='path'></div>");

        let fieldList = generator.build(pageTemplate, { path: [ {} ] });

        let key = Object.keys(fieldList)[0];
        t.equal(fieldList[key].inputId, key);
        t.end();
    });
});

test("FieldGenerator should build and return field list with popup ids", (t) => {
    dom.sandbox(fieldTemplate, {}, () => {
        let pageTemplate = new Template("<div data-field-path='path'></div>");

        let fieldList = generator.build(pageTemplate, { path: [ {} ] });

        let key = Object.keys(fieldList)[0];
        t.true(fieldList[key].popupId.startsWith("popup_"));
        t.end();
    });
});

test("FieldGenerator should build and append popup to template", (t) => {
    dom.sandbox(fieldTemplate, {}, () => {
        let pageTemplate = new Template("<div data-field-path='path'></div>");

        generator.build(pageTemplate, { path: [ {} ] });
        
        let parent = pageTemplate.querySelector("[data-field-path]");
        let popup = parent.childNodes[0];
        t.true(popup.id.startsWith("popup_"));
        t.end();
    });
});

test("FieldGenerator should build and append icon to template", (t) => {
    dom.sandbox(fieldTemplate, {}, () => {
        let pageTemplate = new Template("<div data-field-path='path'></div>");

        generator.build(pageTemplate, { path: [ {} ] });
        
        let parent = pageTemplate.querySelector("[data-field-path]");
        let icon = parent.childNodes[1];
        t.true(icon.id.startsWith("icon_"));
        t.end();
    });
});

test("FieldGenerator should build and append input to template", (t) => {
    dom.sandbox(fieldTemplate, {}, () => {
        let pageTemplate = new Template("<div data-field-path='path'></div>");

        let fieldList = generator.build(pageTemplate, { path: [ {} ] });

        let key = Object.keys(fieldList)[0];
        let parent = pageTemplate.querySelector("[data-field-path]");
        let input = parent.querySelector("#" + key);
        t.equal(input.nodeName, "INPUT");
        t.end();
    });
});
