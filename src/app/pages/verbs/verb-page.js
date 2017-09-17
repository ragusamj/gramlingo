
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
            let pageData = this.createPageData(index);
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

    createPageData(index) {
        let pageData = this.verbs[index];
        pageData.toggler = "toggle-verbs-data";
        return pageData;
    }

    onSearchResultSelected(e) {
        this.onPageDataChanged(e.detail);
        this.browserEvent.emit("url-change", "/verbs/" + this.verbs[e.detail].name.toLowerCase());
    }

    onPageDataChanged(index){
        let pageData = this.createPageData(index);
        this.setHeader(pageData);
        this.browserEvent.emit("page-data-updated", pageData);
    }

    setHeader(pageData) {
        document.getElementById("verb-name").innerHTML = pageData.name;
        let mode = document.getElementById("verb-mode");
        mode.setAttribute("data-translate", (pageData.regular ? "verbs-regular-header" : "verbs-irregular-header"));
        this.i18n.translate(mode);
    }
}

export default VerbPage;
