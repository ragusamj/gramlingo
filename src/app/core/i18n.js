
let currentLanguage = window.localStorage.getItem("language") || "es-ES";
let translationsMap = {};

class I18n {

    addTranslation(language, translations) {
        translationsMap[language] = translations;
    }

    setLanguage(language) {
        currentLanguage = language;
        window.localStorage.setItem("language", language);
        this.translateApplication();
    }

    translate(element) {
        let key = element.getAttribute("data-translate");
        element.innerHTML = translationsMap[currentLanguage][key] || key;
    }

    translateApplication() {
        let elements = document.querySelectorAll("[data-translate]");
        elements.forEach((element) => {
            this.translate(element);
        });
    }
}

export default I18n;
