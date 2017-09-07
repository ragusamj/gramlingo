import dom from "jsdom-sandbox";
import test from "tape";
import I18n from "./i18n";

let setup = () => {
    let i18n = new I18n();
    i18n.addTranslation("en-US", { "translation-key": "english translation" });
    i18n.addTranslation("es-ES", { "translation-key": "spanish translation" });
    return i18n;
};

test("I18n should set language", (t) => {
    dom.sandbox("<span id='test-element' data-translate='translation-key'></span>", {}, () => {
        let i18n = setup();
        i18n.setLanguage("es-ES");

        let element = document.getElementById("test-element");
        t.equal(element.innerHTML, "spanish translation");

        t.end();
    });
});

test("I18n should save language in localStorage", (t) => {
    dom.sandbox("<span id='test-element' data-translate='translation-key'></span>", {}, () => {
        let i18n = setup();
        i18n.setLanguage("es-ES");

        t.equal(window.localStorage.getItem("language"), "es-ES");

        t.end();
    });
});

test("I18n should use language in localStorage", (t) => {
    dom.sandbox("<span id='test-element' data-translate='translation-key'></span>", {}, () => {

        window.localStorage.setItem("language", "es-ES");
        let i18n = setup();
        i18n.translateApplication();

        let element = document.getElementById("test-element");
        t.equal(element.innerHTML, "spanish translation");

        t.end();
    });
});

test("I18n should translate elements with 'data-translate' attribute", (t) => {
    dom.sandbox("<span id='test-element' data-translate='translation-key'></span>", {}, () => {
        let i18n = setup();
        i18n.translateApplication();

        let element = document.getElementById("test-element");
        t.equal(element.innerHTML, "english translation");

        t.end();
    });
});

test("I18n should translate elements with 'data-translate-*' attribute", (t) => {
    dom.sandbox("<span id='test-element' data-translate-placeholder='translation-key'></span>", {}, () => {
        let i18n = setup();

        i18n.translateApplication();
        let element = document.getElementById("test-element");
        t.equal(element.placeholder, "english translation");
    
        t.end();
    });
});

test("I18n should fallback to translation key if no translation exists", (t) => {
    dom.sandbox("<span id='test-element' data-translate='translation-does-not-exist'></span>", {}, () => {
        let i18n = setup();
        i18n.translateApplication();

        let element = document.getElementById("test-element");
        t.equal(element.innerHTML, "translation-does-not-exist");

        t.end();
    });
});

test("I18n should translate single elements with default selector and default attribute", (t) => {
    dom.sandbox("", {}, () => {
        let i18n = setup();

        let element = document.createElement("div");
        element.setAttribute("data-translate", "translation-key");
        i18n.translate(element);

        t.equal(element.innerHTML, "english translation");

        t.end();
    });
});

test("I18n should use secondary language if primary doesn't match any translated language", (t) => {
    dom.sandbox("", {}, () => {
        global.navigator = { languages: ["xx-XX", "en-US"] };
        let i18n = setup();

        let element = document.createElement("div");
        element.setAttribute("data-translate", "translation-key");
        i18n.translate(element);

        t.equal(element.innerHTML, "english translation");

        t.end();
    });
});

test("I18n should use fallback to navigator.language if present", (t) => {
    dom.sandbox("", {}, () => {
        global.navigator = { language: "en-US" };
        let i18n = setup();

        let element = document.createElement("div");
        element.setAttribute("data-translate", "translation-key");
        i18n.translate(element);

        t.equal(element.innerHTML, "english translation");

        t.end();
    });
});

test("I18n should use fallback to navigator.userLanguage if present", (t) => {
    dom.sandbox("", {}, () => {
        global.navigator = { userLanguage: "en-US" };
        let i18n = setup();

        let element = document.createElement("div");
        element.setAttribute("data-translate", "translation-key");
        i18n.translate(element);

        t.equal(element.innerHTML, "english translation");

        t.end();
    });
});

test("I18n should use default to spanish translations if the browser language doesn't match any translated language", (t) => {
    dom.sandbox("", {}, () => {
        global.navigator = { language: "xx-XX" };
        let i18n = setup();

        let element = document.createElement("div");
        element.setAttribute("data-translate", "translation-key");
        i18n.translate(element);

        t.equal(element.innerHTML, "spanish translation");

        t.end();
    });
});
