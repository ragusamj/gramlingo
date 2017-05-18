import debounce from "lodash.debounce";
import get from "lodash.get";
import Template from "../../core/template";
import VerbSearchService from "./verb-search.service";

const searchTypingDelay = 300;

class VerbPage {

    constructor(applicationEvent, browserEvent, http, i18n) {
        this._applicationEvent = applicationEvent;
        this._browserEvent = browserEvent;
        this._http = http;
        this._i18n = i18n;
    }

    load(pageTemplate, onDOMChanged) {
        this._http.getJSON("/data/verbs.json", (verbs) => {
            this._inflate(verbs);
            this._initSearchListeners();
            this._applyPageTemplate(pageTemplate, onDOMChanged);
        }, (event) => {
            // console.log("loading verbs, recieved", event.loaded, "bytes of", event.total);
            return event;
        });
    }

    _inflate(verbs) {
        this._verbs = verbs
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

    _initSearchListeners() {
        this._deferredSearch = debounce((e) => {
            if(e.target && e.target.hasAttribute("data-verb-search")) {
                let result = this._searchService.search(e.target.value);
                this._showSearchResult(result);
            }
        }, searchTypingDelay);
        this._destroyOnSearch = this._browserEvent.on("keyup", this._deferredSearch);
        this._destroyOnSearchResultClick = this._browserEvent.on("click", this._onSearchResultClick.bind(this));
    }

    _getDefaultVerbIndex() {
        let result = this._searchService.search("ir");
        return result.matches[0].index;
    }

    _applyPageTemplate(pageTemplate, onDOMChanged) {

        // TODO: this function does many things
        this._searchService = new VerbSearchService(this._verbs);
        let index = this._getDefaultVerbIndex();
        let pageData = this._verbs[index];

        // TODO: Move to common class for all pages
        /********************************************************/
        this._fields = {};
        let fieldTemplate = Template.fromElementId("excercise-area-template");
        let fieldContainers = pageTemplate.querySelectorAll("[data-field-path]");
        fieldContainers.forEach((fieldContainer) => {
            let fieldPath = fieldContainer.getAttribute("data-field-path");
            let fieldData = get(pageData, fieldPath);
            fieldData.forEach((variants, i) => {
                let dataPath = fieldPath + "[" + i + "]";
                let field = fieldTemplate.clone();
                let input = field.getElementById("input");
                input.id = dataPath + "_input";
                fieldContainer.appendChild(field.fragment());
                this._fields[input.id] = { dataPath: dataPath };
            });
        });
        /********************************************************/

        onDOMChanged();
        this._applicationEvent.emit("page-field-list-updated", this._fields);
        this._onPageDataChanged(index);
    }

    _showSearchResult(result) {

        let template = Template.fromElementId("search-result-template");

        let ul = template.getElementById("search-result-list");
        ul.className = result.matches.length > 0 ? "search-result visible" : "search-result hidden";

        result.matches.forEach((match) => {
            let li = template.add(ul, "li");
            template.add(li, "span", { innerHTML: match.pre });
            template.add(li, "strong", { innerHTML: match.match });
            template.add(li, "span", { innerHTML: match.post });
            li.setAttribute("data-verb-index", match.index);
        });

        if(result.maxExceeded) {
            template.add(ul, "li", { innerHTML: "..." });
        }

        template.replaceContent("search-result-container");
    }

    _onSearchResultClick(e) {
        if(e.target && e.target.hasAttribute("data-verb-index")) {
            let index = e.target.getAttribute("data-verb-index");
            let ul = document.getElementById("search-result-list");
            ul.className = "search-result hidden";
            this._onPageDataChanged(index);
        }
    }

    _onPageDataChanged(index){
        this._setHeader(this._verbs[index]);
        this._applicationEvent.emit("page-data-updated", this._verbs[index]);
        this._applicationEvent.emit("page-field-list-updated", this._fields);   
    }

    _setHeader(verb) {
        document.getElementById("verb-name").innerHTML = verb.name;
        let mode = document.getElementById("verb-mode");
        mode.setAttribute("data-translate", (verb.regular ? "verbs-header-regular" : "verbs-header-irregular"));
        this._i18n.translate(mode);
    }
}

export default VerbPage;
