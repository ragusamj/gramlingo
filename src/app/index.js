import EventBroker from "./core/event-broker";
import I18n from "./core/i18n";

import enUS from "./translations/en-US";
import esES from "./translations/es-ES";
import ruRU from "./translations/ru-RU";
import svSE from "./translations/sv-SE";

import VerbPage from "./pages/verbs/verb-page";

class Index {

    constructor() {

        EventBroker.add.call(this, "click", this._onLanguageChanged.bind(this));

        I18n.addTranslation("en-US", enUS);
        I18n.addTranslation("es-ES", esES);
        I18n.addTranslation("sv-SE", svSE);
        I18n.addTranslation("ru-RU", ruRU);

        this.page = new VerbPage();
        this.page.load();

        I18n.translateApplication();
    }

    setLanguage(language) {
        I18n.setLanguage(language);
    }

    _onLanguageChanged(e) {
        if(e.target && e.target.hasAttribute("data-language")) {
            let language = e.target.getAttribute("data-language");
            I18n.setLanguage(language);
        }
    }
}

new Index();

export default Index;
