const attributes = ["innerHTML", "placeholder"];
const defaultAttribute = "innerHTML";
const defaultSelector = "data-translate";

const languageMap = {
    en: "en-US",
    es: "es-ES",
    ru: "ru-RU",
    sv: "sv-SE"
};

class I18n {

    constructor() {
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
    }

    translate(element, attribute, selector) {
        let key = element.getAttribute(selector || defaultSelector);
        element[attribute || defaultAttribute] = this.translationsMap[this.currentLanguage][key] || key;
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
