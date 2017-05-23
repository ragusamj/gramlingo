import test from "tape";
import Dom from "./mock/dom";
import I18n from "./i18n";

test("I18n should translate elements with 'data-translate' attribute", (t) => {
    Dom.sandbox("<span id='test-element' data-translate='translation-key'></span>", {}, () => {

        let i18n = new I18n();
        i18n.addTranslation("en-US", { "translation-key": "translated value" });
        i18n.setLanguage("en-US");

        let element = document.getElementById("test-element");
        t.equal(element.innerHTML, "translated value");

        t.end();
    });
});

test("I18n should translate elements with 'data-translate-*' attribute", (t) => {
    Dom.sandbox("<span id='test-element' data-translate-placeholder='translation-key'></span>", {}, () => {

        let i18n = new I18n();
        i18n.addTranslation("en-US", { "translation-key": "translated value" });
        i18n.setLanguage("en-US");

        let element = document.getElementById("test-element");
        t.equal(element.placeholder, "translated value");

        t.end();
    });
});

test("I18n should fallback to translation key if no translation exists", (t) => {
    Dom.sandbox("<span id='test-element' data-translate='translation-does-not-exist'></span>", {}, () => {

        let i18n = new I18n();
        i18n.addTranslation("en-US", { "translation-key": "translated value" });
        i18n.setLanguage("en-US");

        let element = document.getElementById("test-element");
        t.equal(element.innerHTML, "translation-does-not-exist");

        t.end();
    });
});

test("I18n should translate single elements with default selector and default attribute", (t) => {
    Dom.sandbox("", {}, () => {

        let i18n = new I18n();
        i18n.addTranslation("en-US", { "translation-key": "translated value" });
        i18n.setLanguage("en-US");

        let element = document.createElement("div");
        element.setAttribute("data-translate", "translation-key");
        i18n.translate(element);

        t.equal(element.innerHTML, "translated value");

        t.end();
    });
});
