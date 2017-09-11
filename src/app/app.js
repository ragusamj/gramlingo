import BrowserEvent from "./core/browser-event";
import Http from "./core/http";
import I18n from "./core/i18n";
import PageBroker from "./core/router/page-broker";
import PathFinder from "./core/router/path-finder";
import Router from "./core/router/router";
import Toggler from "./core/widgets/toggler";

import enUS from "./translations/en-US";
import esES from "./translations/es-ES";
import svSE from "./translations/sv-SE";

import Menu from "./menu";

import Checker from "./pages/common/exercise-area/checker";
import ExerciseAreaListener from "./pages/common/exercise-area/exercise-area-listener";
import ExerciseArea from "./pages/common/exercise-area/exercise-area";
import ElementWalker from "./pages/common/walkers/element-walker";
import InputWalker from "./pages/common/walkers/input-walker";
import FieldGenerator from "./pages/common/field-generator";
import IntegerGenerator from "./pages/common/integer-generator";
import SearchEngine from "./pages/common/search/search-engine";
import SearchListener from "./pages/common/search/search-listener";
import SearchResultVisualizer from "./pages/common/search/search-result-visualizer";

import Erro404Page from "./pages/error/error-404-page";
import HomePage from "./pages/home/home-page";

import NumeralGenerator from "./pages/numerals/numeral-generator";
import NumeralsPage from "./pages/numerals/numerals-page";
import NumeralsSearchEngine from "./pages/numerals/numerals-search-engine";

import VerbInflater from "./pages/verbs/verb-inflater";
import VerbPage from "./pages/verbs/verb-page";

import WorldMap from "./pages/world/world-map";
import WorldMapListener from "./pages/world/world-map-listener";
import WorldPage from "./pages/world/world-page";

const browserEvent = new BrowserEvent();
const http = new Http();
const i18n = new I18n();
const fieldGenerator = new FieldGenerator();

class App {

    constructor() {

        browserEvent.on("click", this.onLanguageChanged);
        browserEvent.on("page-change-success", this.onPageChangeSuccess);

        i18n.addTranslation("en-US", enUS);
        i18n.addTranslation("es-ES", esES);
        i18n.addTranslation("sv-SE", svSE);

        const routes = [
            {
                paths: ["/"],
                page: new HomePage(),
                template: "/app/pages/home/home-page.html"
            },
            {
                paths: ["/verbs", "/verbs/:name"],
                page: new VerbPage(
                    browserEvent, http, i18n, fieldGenerator,
                    new VerbInflater(),
                    new SearchListener(browserEvent, new SearchEngine(), new SearchResultVisualizer(browserEvent, new ElementWalker()))
                ),
                template: "/app/pages/verbs/verb-page.html"
            },
            {
                paths: ["/numerals", "/numerals/:type"],
                page: new NumeralsPage(
                    browserEvent, i18n, fieldGenerator,
                    new NumeralGenerator(new IntegerGenerator()),
                    new SearchListener(browserEvent, new NumeralsSearchEngine(), new SearchResultVisualizer(browserEvent, new ElementWalker()))
                ),
                template: "/app/pages/numerals/numerals-page.html"
            },
            {
                paths: ["/world", "/world/:part"],
                page: new WorldPage(browserEvent, new WorldMapListener(browserEvent, new WorldMap(browserEvent))),
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
