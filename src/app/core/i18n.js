const attributes = ["innerHTML", "placeholder"];
const defaultAttribute = "innerHTML";
const defaultSelector = "data-translate";

class I18n {

    constructor() {
        this._currentLanguage = window.localStorage.getItem("language") || "es-ES";
        this._translationsMap = {};
    }

    addTranslation(language, translations) {
        this._translationsMap[language] = translations;
    }

    setLanguage(language) {
        this._currentLanguage = language;
        window.localStorage.setItem("language", language);
        this.translateApplication();
    }

    translate(element, attribute, selector) {
        let key = element.getAttribute(selector || defaultSelector);
        element[attribute || defaultAttribute] = this._translationsMap[this._currentLanguage][key] || key;
    }

    translateApplication() {
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
