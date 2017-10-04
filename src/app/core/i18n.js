const attributes = ["innerHTML", "placeholder"];
const defaultAttribute = "innerHTML";
const defaultSelector = "data-translate";

const languageMap = {
    en: "en-US",
    es: "es-ES",
    sv: "sv-SE"
};

class I18n {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
        this.translationsMap = {};
        this.currentLanguage = localStorage.getItem("language") || this.getUserLanguage();
    }

    addTranslation(language, translations) {
        this.translationsMap[language] = translations;
    }

    setLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem("language", language);
        this.translateApplication();
        this.browserEvent.emit("dom-content-changed");
    }

    translate(element, attribute, selector) {
        let key = element.getAttribute(selector || defaultSelector);
        element[attribute || defaultAttribute] = this.translationsMap[this.currentLanguage][key] || key;
    }

    translateApplication() {
        for(let attribute of attributes) {
            let selector = attribute === defaultAttribute ?
                defaultSelector :
                defaultSelector + "-" + attribute;
            let elements = document.querySelectorAll("[" + selector + "]");
            for(let element of elements) {
                this.translate(element, attribute, selector);
            }
        }
    }

    getUserLanguage() {
        let languages = navigator.languages || [navigator.language || navigator.userLanguage];
        for (let language of languages) {
            let isocode = language.substr(0, 2);
            if(languageMap[isocode]) {
                return languageMap[isocode];
            }
        }
        return "es-ES";
    }
}

export default I18n;
