import Page from "../common/page";

const defaultVerbIndex = 624; // Ir

class VerbPage {

    constructor(browserEvent, http, i18n) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.i18n = i18n;
        this.browserEvent.on("search-result-index-updated", this.onSearchResulIndexUpdated.bind(this));
    }

    load(pageTemplate, onPageLoaded) {
        this.loadVerbs(() => {
            this.applyPageTemplate(pageTemplate, onPageLoaded);
        });
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
        this.browserEvent.emit("page-searchable-data-updated", this.verbs);
    }

    applyPageTemplate(pageTemplate, onPageLoaded) {
        let pageData = this.verbs[defaultVerbIndex];
        if(!this.fields) {
            this.fields = new Page().apply(pageTemplate, pageData);
        }
        onPageLoaded();
        this.browserEvent.emit("page-field-list-updated", this.fields);
        this.onPageDataChanged(defaultVerbIndex);
    }

    onSearchResulIndexUpdated(e) {
        this.onPageDataChanged(e.detail);
    }

    onPageDataChanged(index){
        this.setHeader(this.verbs[index]);
        this.browserEvent.emit("page-data-updated", this.verbs[index]);
        this.browserEvent.emit("page-field-list-updated", this.fields);   
    }

    setHeader(verb) {
        document.getElementById("verb-name").innerHTML = verb.name;
        let mode = document.getElementById("verb-mode");
        mode.setAttribute("data-translate", (verb.regular ? "verbs-header-regular" : "verbs-header-irregular"));
        this.i18n.translate(mode);
    }
}

export default VerbPage;
