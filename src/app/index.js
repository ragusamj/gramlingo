import BrowserEvent from "./core/browser-event";
import Http from "./core/http";
import I18n from "./core/i18n";
import Router from "./core/router";
import timeout from "./core/timeout";

import enUS from "./translations/en-US";
import esES from "./translations/es-ES";
import ruRU from "./translations/ru-RU";
import svSE from "./translations/sv-SE";

import Menu from "./menu";
import Checker from "./pages/common/checker";
import ExerciseAreaListener from "./pages/common/exercise-area-listener";
import ExerciseArea from "./pages/common/exercise-area";
import Walker from "./pages/common/walker";
import VerbPage from "./pages/verbs/verb.page";
import NumeralsPage from "./pages/numerals/numerals.page";

const browserEvent = new BrowserEvent();
const http = new Http();
const i18n = new I18n();

class Index {

    constructor() {

        browserEvent.on("click", this._onLanguageChanged.bind(this));

        i18n.addTranslation("en-US", enUS);
        i18n.addTranslation("es-ES", esES);
        i18n.addTranslation("sv-SE", svSE);
        i18n.addTranslation("ru-RU", ruRU);
        i18n.translateApplication();

        let routes = {
            "/verbs": {
                page: new VerbPage(browserEvent, http, i18n),
                template: "/app/pages/verbs/verb.page.html",
                isDefault: true
            },
            "/numerals": {
                page: new NumeralsPage(),
                template: "/app/pages/numerals/numerals.page.html"
            }
        };

        new ExerciseAreaListener(browserEvent, new Checker(), new ExerciseArea(), new Walker());
        new Menu(browserEvent);
        new Router(browserEvent, http, i18n, routes, "page-placeholder", timeout);
    }

    _onLanguageChanged(e) {
        if(e.target && e.target.hasAttribute("data-language")) {
            let language = e.target.getAttribute("data-language");
            i18n.setLanguage(language);
        }
    }
}

new Index();

export default Index;
