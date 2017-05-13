
let currentLanguage = window.localStorage.getItem("language") || "es-ES";
let translationsMap = {};

class I18n {

    static addTranslation(language, translations) {
        translationsMap[language] = translations;
    }

    static setLanguage(language) {
        currentLanguage = language;
        window.localStorage.setItem("language", language);
        I18n.translateApplication();
    }

    static translate(element) {
        let key = element.getAttribute("data-translate");
        element.innerHTML = translationsMap[currentLanguage][key] || key;
    }

    static translateApplication() {
        let elements = document.querySelectorAll("[data-translate]");
        elements.forEach((element) => {
            I18n.translate(element);
        });
    }
}

export default I18n;
