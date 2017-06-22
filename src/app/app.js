import BrowserEvent from "./core/browser-event";
import Http from "./core/http";
import I18n from "./core/i18n";
import PageBroker from "./core/router/page-broker";
import PathFinder from "./core/router/path-finder";
import Router from "./core/router/router";
import Toggler from "./core/widgets/toggler";

import enUS from "./translations/en-US";
import esES from "./translations/es-ES";
import ruRU from "./translations/ru-RU";
import svSE from "./translations/sv-SE";

import Menu from "./menu";

import Checker from "./pages/common/checker";
import ExerciseAreaListener from "./pages/common/exercise-area-listener";
import ExerciseArea from "./pages/common/exercise-area";
import ElementWalker from "./pages/common/walkers/element-walker";
import InputWalker from "./pages/common/walkers/input-walker";
import SearchListener from "./pages/common/search/search-listener";
import SearchResult from "./pages/common/search/search-result";

import Erro404Page from "./pages/error/error-404-page";
import HomePage from "./pages/home/home-page";
import NumeralsPage from "./pages/numerals/numerals-page";
import VerbPage from "./pages/verbs/verb-page";
import WorldPage from "./pages/world/world-page";

const browserEvent = new BrowserEvent();
const http = new Http();
const i18n = new I18n();

class App {

    constructor() {

        browserEvent.on("click", this.onLanguageChanged);
        browserEvent.on("page-change-success", this.onPageChangeSuccess);

        i18n.addTranslation("en-US", enUS);
        i18n.addTranslation("es-ES", esES);
        i18n.addTranslation("sv-SE", svSE);
        i18n.addTranslation("ru-RU", ruRU);

        const routes = [
            {
                paths: ["/"],
                page: new HomePage(),
                template: "/app/pages/home/home-page.html"
            },
            {
                paths: ["/verbs", "/verbs/:name"],
                page: new VerbPage(browserEvent, http, i18n),
                template: "/app/pages/verbs/verb-page.html"
            },
            {
                paths: ["/numerals", "/numerals/:type"],
                page: new NumeralsPage(),
                template: "/app/pages/numerals/numerals-page.html"
            },
            {
                paths: ["/world", "/world/:part"],
                page: new WorldPage(),
                template: "/app/pages/world/world-page.html"
            },
            {
                paths: ["*"],
                page: new Erro404Page(),
                template: "/app/pages/error/error-404-page.html"
            }
        ];

        new ExerciseAreaListener(browserEvent, new Checker(), new ExerciseArea(), new InputWalker());
        new Menu(browserEvent);
        new Router(browserEvent, new PathFinder(routes), new PageBroker(browserEvent, http, "page-placeholder"));
        new SearchListener(browserEvent, new SearchResult(browserEvent, new ElementWalker()));
        new Toggler(browserEvent);
    }

    onLanguageChanged(e) {
        if(e.target && e.target.hasAttribute("data-language")) {
            let language = e.target.getAttribute("data-language");
            i18n.setLanguage(language);
        }
    }

    onPageChangeSuccess() {
        i18n.translateApplication();
    }
}

new App();

export default App;
