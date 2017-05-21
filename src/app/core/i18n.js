
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

    translate(element) {
        let key = element.getAttribute("data-translate");
        element.innerHTML = this._translationsMap[this._currentLanguage][key] || key;
    }

    translateApplication() {
        let elements = document.querySelectorAll("[data-translate]");
        elements.forEach((element) => {
            this.translate(element);
        });
    }
}

export default I18n;
