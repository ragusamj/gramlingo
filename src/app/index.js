import ApplicationEvent from "./core/application-event";
import BrowserEvent from "./core/browser-event";
import Http from "./core/http";
import I18n from "./core/i18n";
import Router from "./core/router";

import enUS from "./translations/en-US";
import esES from "./translations/es-ES";
import ruRU from "./translations/ru-RU";
import svSE from "./translations/sv-SE";

import Visualizer from "./pages/common/visualizer";
import Walker from "./pages/common/walker";
import VerbPage from "./pages/verbs/verb.page";
import NumeralsPage from "./pages/numerals/numerals.page";

const applicationEvent = new ApplicationEvent();
const browserEvent = new BrowserEvent();
const http = new Http();

class Index {

    constructor() {

        browserEvent.on("click", this._onLanguageChanged.bind(this));

        I18n.addTranslation("en-US", enUS);
        I18n.addTranslation("es-ES", esES);
        I18n.addTranslation("sv-SE", svSE);
        I18n.addTranslation("ru-RU", ruRU);

        let routes = {
            "/verbs": {
                page: new VerbPage(applicationEvent, browserEvent, http),
                template: "/app/pages/verbs/verb.page.html",
                isDefault: true
            },
            "/numerals": {
                page: new NumeralsPage(),
                template: "/app/pages/numerals/numerals.page.html"
            }
        };

        new Router(applicationEvent, http, routes, "page-placeholder");
    }

    _onLanguageChanged(e) {
        if(e.target && e.target.hasAttribute("data-language")) {
            let language = e.target.getAttribute("data-language");
            I18n.setLanguage(language);
        }
    }
}

new Visualizer(applicationEvent, browserEvent);
new Walker(applicationEvent, browserEvent);
new Index();

export default Index;
