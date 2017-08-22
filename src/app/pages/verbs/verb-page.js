import Page from "../common/page";

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
                this.inflate(data);
                callback();
            }, (event) => {
                // console.log("loading verbs, recieved", event.loaded, "bytes of", event.total);
                return event;
            });
        }
    }

    inflate(data) {
        this.verbs = data
            .map((verb) => {
                return {
                    name: verb[0],
                    regular: !!verb[1],
                    presentparticiple: [verb[2]],
                    pastparticiple: [verb[3]],
                    indicative: {
                        present: verb[4],
                        imperfect: verb[5],
                        preterite: verb[6],
                        future: verb[7],
                        conditional: verb[8]
                    },
                    subjunctive: {
                        present: verb[9],
                        imperfect: verb[10],
                        future: verb[11]
                    },
                    imperative: {
                        affirmative: verb[12],
                        negative: verb[9].map((person, i) => {
                            return person.map((variant) => {
                                return (i > 0  && variant) ? ("no " + variant) : undefined;
                            });
                        })
                    }
                };
            })
            .sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
    }

    loadPage(pageTemplate, onPageChanged, parameters) {
        let index = this.getVerbIndex(parameters.name) || defaultVerbIndex; // TODO: this will fail for index 0 (falsy)
        let pageData = this.verbs[index];
        if(!this.fields) {
            this.fields = new Page().apply(pageTemplate, pageData);
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
