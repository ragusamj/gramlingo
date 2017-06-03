const attributes = ["innerHTML", "placeholder"];
const defaultAttribute = "innerHTML";
const defaultSelector = "data-translate";

class I18n {

    constructor() {
        this.translationsMap = {};
    }

    addTranslation(language, translations) {
        this.translationsMap[language] = translations;
    }

    setLanguage(language) {
        this.currentLanguage = language;
        window.localStorage.setItem("language", language);
        this.translateApplication();
    }

    translate(element, attribute, selector) {
        let key = element.getAttribute(selector || defaultSelector);
        element[attribute || defaultAttribute] = this.translationsMap[this.currentLanguage][key] || key;
    }

    translateApplication() {
        this.currentLanguage = window.localStorage.getItem("language") || "es-ES";
        attributes.forEach((attribute) => {
            let selector = attribute === defaultAttribute ?
                defaultSelector :
                defaultSelector + "-" + attribute;
            let elements = document.querySelectorAll("[" + selector + "]");
            elements.forEach((element) => {
                this.translate(element, attribute, selector);
            });
        });
    }
}

export default I18n;
