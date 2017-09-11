
const defaultVerb = "Ir";

class VerbPage {

    constructor(browserEvent, http, i18n, fieldGenerator, verbInflater, searchListener) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.i18n = i18n;
        this.fieldGenerator = fieldGenerator;
        this.verbInflater = verbInflater;
        this.searchListener = searchListener;
    }

    attach(pageTemplate, onPageChanged, parameters) {
        this.loadVerbs(() => {
            this.loadPage(pageTemplate, onPageChanged, parameters);
        });
        this.searchListener.attach();
    }

    detach() {
        this.removeListener();
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
            let pageData = this.verbs[index];
            if(!this.fields) {
                this.fields = this.fieldGenerator.build(pageTemplate, pageData);
            }
            onPageChanged();
            this.removeListener = this.browserEvent.on("search-result-selected", this.onSearchResultSelected.bind(this));
            this.browserEvent.emit("page-searchable-data-updated", this.verbs);
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
        mode.setAttribute("data-translate", (verb.regular ? "verbs-regular-header" : "verbs-irregular-header"));
        this.i18n.translate(mode);
    }
}

export default VerbPage;
