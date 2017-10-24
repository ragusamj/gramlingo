import "core-js/modules/es6.string.ends-with";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";

import BrowserEvent from "./core/event/browser-event";
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

import CachedInflater from "./pages/common/cached-inflater";
import Canvas from "./pages/common/2d/canvas/canvas";
import CanvasListener from "./pages/common/2d/canvas/canvas-listener";
import CanvasWorker from "./pages/common/2d/canvas/canvas-worker";
import Checker from "./pages/common/exercise-area/checker";
import ExerciseAreaListener from "./pages/common/exercise-area/exercise-area-listener";
import ExerciseAreaPopup from "./pages/common/exercise-area/exercise-area-popup";
import ExerciseArea from "./pages/common/exercise-area/exercise-area";
import FieldGenerator from "./pages/common/exercise-area/field-generator";
import ElementWalker from "./pages/common/walkers/element-walker";
import InputWalker from "./pages/common/walkers/input-walker";
import IntegerGenerator from "./pages/common/integer-generator";
import LoaderPopup from "./pages/common/loader-popup";
import Search from "./pages/common/search/search";
import SearchEngine from "./pages/common/search/search-engine";
import SearchListener from "./pages/common/search/search-listener";
import SearchResultPopup from "./pages/common/search/search-result-popup";

import Erro404Page from "./pages/error/error-404-page";
import HomePage from "./pages/home/home-page";

import NumeralsGenerator from "./pages/numerals/numerals-generator";
import NumeralsPage from "./pages/numerals/numerals-page";
import NumeralsSearchEngine from "./pages/numerals/numerals-search-engine";

import VerbPage from "./pages/verbs/verb-page";

import WorldMap from "./pages/world/world-map/world-map";
import WorldPage from "./pages/world/world-page";

// core
const browserEvent = new BrowserEvent();
const http = new Http();
const i18n = new I18n(browserEvent);

// pages
const cachedInflater = new CachedInflater(http, new LoaderPopup(i18n));
const exerciseArea = new ExerciseArea(new Checker(), new ExerciseAreaPopup(), new FieldGenerator(), new InputWalker());
const exerciseAreaListener = new ExerciseAreaListener(browserEvent, exerciseArea);
const searchEngine = new SearchEngine();
const numeralsSearchEngine = new NumeralsSearchEngine();

const canvas = new Canvas("world-map"); 
const canvasListener = new CanvasListener(browserEvent, new CanvasWorker(browserEvent, canvas));
const worldMap = new WorldMap(browserEvent, canvas, canvasListener);

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
                    browserEvent, i18n, cachedInflater, exerciseArea, exerciseAreaListener, searchEngine,
                    new SearchListener(browserEvent, new Search(searchEngine, new SearchResultPopup(browserEvent, new ElementWalker())))
                ),
                template: "/app/pages/verbs/verb-page.html"
            },
            {
                paths: ["/numerals", "/numerals/:type"],
                page: new NumeralsPage(
                    browserEvent, i18n, exerciseArea, exerciseAreaListener,
                    new NumeralsGenerator(new IntegerGenerator()),
                    numeralsSearchEngine,
                    new SearchListener(browserEvent, new Search(numeralsSearchEngine, new SearchResultPopup(browserEvent, new ElementWalker())))
                ),
                template: "/app/pages/numerals/numerals-page.html"
            },
            {
                paths: ["/world", "/world/:iso"],
                page: new WorldPage(browserEvent, cachedInflater, exerciseArea, exerciseAreaListener, worldMap),
                template: "/app/pages/world/world-page.html"
            },
            {
                paths: ["*"],
                page: new Erro404Page(),
                template: "/app/pages/error/error-404-page.html"
            }
        ];

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
