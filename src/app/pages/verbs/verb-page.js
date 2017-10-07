
const defaultVerb = "Ir";

class VerbPage {

    constructor(browserEvent, http, i18n, fieldGenerator, verbInflater, searchEngine, searchListener) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.i18n = i18n;
        this.fieldGenerator = fieldGenerator;
        this.verbInflater = verbInflater;
        this.searchEngine = searchEngine;
        this.searchListener = searchListener;
    }

    attach(pageTemplate, onPageChanged, parameters) {
        this.loadVerbs(() => {
            this.loadPage(pageTemplate, onPageChanged, parameters);
        });
        this.removeListeners = [
            this.browserEvent.on("search-result-selected", this.onSearchResultSelected.bind(this))
        ];
        this.searchListener.attach();
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
        this.searchListener.detach();
    }

    loadVerbs(callback) {
        if(this.verbs) {
            callback();
        }
        else {
            this.http.getJSON("/data/verbs.json", (data) => {
                this.verbs = this.verbInflater.inflate(data);
                callback();
            }, (event) => {
                // console.log("loading verbs, recieved", event.loaded, "bytes of", event.total);
                return event;
            });
        }
    }

    loadPage(pageTemplate, onPageChanged, parameters) {
        let index = this.getVerbIndex(parameters.name || defaultVerb);
        if(index === undefined) {
            onPageChanged();
        }
        else {
            this.createContext(index);
            if(!this.fields) {
                this.fields = this.fieldGenerator.build(pageTemplate, this.context);
            }
            onPageChanged();
            this.searchEngine.initialize(this.verbs);
            this.browserEvent.emit("page-field-list-updated", this.fields);
            this.onPageDataChanged(index);
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
        this.onPageDataChanged();
        this.browserEvent.emit("url-change", "/verbs/" + this.context.verb.name.toLowerCase());
    }

    onPageDataChanged() {
        this.setHeader();
        this.browserEvent.emit("page-data-updated", this.context);
    }

    setHeader() {
        document.getElementById("verb-name").innerHTML = this.context.verb.name;
        let mode = document.getElementById("verb-mode");
        mode.setAttribute("data-translate", (this.context.verb.regular ? "verbs-regular-header" : "verbs-irregular-header"));
        this.i18n.translate(mode);
    }
}

export default VerbPage;
