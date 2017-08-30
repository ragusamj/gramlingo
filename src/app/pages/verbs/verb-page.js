import FieldGenerator from "../common/field-generator";
import VerbInflater from "./verb-inflater";

const defaultVerbIndex = 624; // Ir

class VerbPage {

    constructor(browserEvent, http, i18n) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.i18n = i18n;
    }

    attach(pageTemplate, onPageChanged, parameters) {
        this.loadVerbs(() => {
            this.loadPage(pageTemplate, onPageChanged, parameters);
        });
    }

    detach() {
        this.removeListener();
    }

    loadVerbs(callback) {
        if(this.verbs) {
            callback();
        }
        else {
            this.http.getJSON("/data/verbs.json", (data) => {
                this.verbs = VerbInflater.inflate(data);
                callback();
            }, (event) => {
                // console.log("loading verbs, recieved", event.loaded, "bytes of", event.total);
                return event;
            });
        }
    }

    loadPage(pageTemplate, onPageChanged, parameters) {
        let index = this.getVerbIndex(parameters.name) || defaultVerbIndex; // TODO: this will fail for index 0 (falsy)
        let pageData = this.verbs[index];
        if(!this.fields) {
            this.fields = FieldGenerator.build(pageTemplate, pageData);
        }
        onPageChanged();
        this.removeListener = this.browserEvent.on("search-result-selected", this.onSearchResultSelected.bind(this));
        this.browserEvent.emit("page-searchable-data-updated", this.verbs);
        this.browserEvent.emit("page-field-list-updated", this.fields);
        this.onPageDataChanged(index);
    }

    getVerbIndex(name) {
        if(name) {
            for(let i = 0; i < this.verbs.length; i++) {
                if(this.verbs[i].name.toLowerCase() === name.toLowerCase()) {
                    return i;
                }
            }
        }
        return undefined;
    }

    onSearchResultSelected(e) {
        this.onPageDataChanged(e.detail);
        this.browserEvent.emit("url-change", "/verbs/" + this.verbs[e.detail].name.toLowerCase());
    }

    onPageDataChanged(index){
        this.setHeader(this.verbs[index]);
        this.browserEvent.emit("page-data-updated", this.verbs[index]);
    }

    setHeader(verb) {
        document.getElementById("verb-name").innerHTML = verb.name;
        let mode = document.getElementById("verb-mode");
        mode.setAttribute("data-translate", (verb.regular ? "verbs-header-regular" : "verbs-header-irregular"));
        this.i18n.translate(mode);
    }
}

export default VerbPage;
