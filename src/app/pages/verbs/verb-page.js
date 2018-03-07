import VerbInflater from "./verb-inflater";

const defaultVerb = "Ir";

class VerbPage {

    constructor(browserEvent, i18n, cachedInflater, exerciseArea, exerciseAreaListener, searchEngine, searchListener) {
        this.browserEvent = browserEvent;
        this.i18n = i18n;
        this.cachedInflater = cachedInflater;
        this.exerciseArea = exerciseArea;
        this.exerciseAreaListener = exerciseAreaListener;
        this.searchEngine = searchEngine;
        this.searchListener = searchListener;
    }

    attach(pageTemplate, onPageChanged, parameters) {
        this.cachedInflater.get("/data/verbs.json", VerbInflater, {}, "verbs-loader-popup-loading-verbs", (data) => {
            this.verbs = data;
            this.loadPage(pageTemplate, onPageChanged, parameters);
        });
        this.removeListeners = [
            this.browserEvent.on("search-result-selected", this.onSearchResultSelected.bind(this))
        ];
        this.exerciseAreaListener.attach();
        this.searchListener.attach();
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
        this.exerciseAreaListener.detach();
        this.searchListener.detach();
    }

    loadPage(pageTemplate, onPageChanged, parameters) {
        let index = this.getVerbIndex(parameters.name || defaultVerb);
        if(index === undefined) {
            onPageChanged();
        }
        else {
            this.createContext(index);
            this.exerciseArea.build(pageTemplate, this.context);
            onPageChanged();
            this.translateHeader();
            this.searchEngine.initialize(this.verbs);
            this.exerciseArea.updateContext(this.context);
        }
    }

    getVerbIndex(name) {
        for(let i = 0; i < this.verbs.length; i++) {
            if(this.verbs[i].name.toLowerCase() === name.toLowerCase()) {
                return i;
            }
        }

        // TODO: show error message, verb 'blargear' not found
        return undefined;
    }

    createContext(index) {
        this.context = {
            verb: this.verbs[index],
            toggler: "toggle-verbs-data"
        };
    }

    onSearchResultSelected(e) {
        this.createContext(e.detail);
        this.translateHeader();
        this.exerciseArea.updateContext(this.context);
        this.browserEvent.emit("url-change", "/verbs/" + this.context.verb.name.toLowerCase());
    }

    translateHeader() {
        document.getElementById("verb-name").innerHTML = this.context.verb.name;
        let mode = document.getElementById("verb-mode");
        mode.setAttribute("data-translate", (this.context.verb.regular ? "verbs-regular-header" : "verbs-irregular-header"));
        this.i18n.translate(mode);
    }
}

export default VerbPage;
