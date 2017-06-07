import debounce from "lodash.debounce";
import Template from "../../core/template";
import Page from "../common/page";
import ElementWalker from "../common/walkers/element-walker";
import KeyCode from "../common/walkers/key-code";
import VerbSearchService from "./verb-search.service";

const defaultVerbIndex = 624; // Ir
const searchTypingDelay = 300;

class VerbPage {

    constructor(browserEvent, http, i18n) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.i18n = i18n;
    }

    load(pageTemplate, onDOMChanged) {
        this.http.getJSON("/data/verbs.json", (verbs) => {
            this.inflate(verbs);
            this.initSearch();
            this.applyPageTemplate(pageTemplate, onDOMChanged);
        }, (event) => {
            // console.log("loading verbs, recieved", event.loaded, "bytes of", event.total);
            return event;
        });
    }

    inflate(verbs) {
        this.verbs = verbs
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

    initSearch() {
        this.walker = new ElementWalker();
        this.destroyOnSearchKeydown = this.browserEvent.on("keydown", (e) => {
            if(e.target.hasAttribute("data-verb-search")) {
                if(this.walker.isWalkable(e.keyCode)) {
                    this.walker.walk(e.keyCode);
                }
                if(e.keyCode === KeyCode.enter) {
                    let element = document.getElementById(this.walker.currentElementId);
                    this.changePageData(element);
                    this.closeSearchResult();
                }
            }
        });
        this.searchService = new VerbSearchService(this.verbs);
        this.deferredSearch = debounce((e) => {
            if(e.target.hasAttribute("data-verb-search") && !(this.walker.isWalkable(e.keyCode) || e.keyCode === KeyCode.enter)) {
                let result = this.searchService.search(e.target.value);
                this.showSearchResult(result);
            }
        }, searchTypingDelay);
        this.destroyOnSearch = this.browserEvent.on("keyup", this.deferredSearch);
        this.destroyOnSearchResultClick = this.browserEvent.on("click", this.onSearchResultClick.bind(this));
    }

    applyPageTemplate(pageTemplate, onDOMChanged) {
        let pageData = this.verbs[defaultVerbIndex];
        this.fields = new Page().apply(pageTemplate, pageData);
        onDOMChanged();
        this.browserEvent.emit("page-field-list-updated", this.fields);
        this.onPageDataChanged(defaultVerbIndex);
    }

    showSearchResult(result) {

        let template = Template.fromElementId("search-result-template");
        let itemTemplate = Template.fromElementId("search-result-item-template");
        let ul = template.querySelector("ul");
        this.ids = [];

        if(result.matches.length > 0) {

            result.matches.forEach((match) => {
                let item = itemTemplate.clone();
                item.set("pre", { innerHTML: match.pre });
                item.set("match", { innerHTML: match.match });
                item.set("post", { innerHTML: match.post });
                item.set("source", { innerHTML: match.source });
                let li = item.set("search-result-item");
                li.setAttribute("data-verb-index", match.index);
                this.ids.push(li.id);
                ul.appendChild(item.fragment());
            });

            if(result.maxExceeded) {
                template.add(ul, "li", { innerHTML: "..." });
            }

            template.replaceContent("search-result-container");

            this.walker.link(this.ids);
        }
    }

    onSearchResultClick(e) {
        this.changePageData(e.target);
        this.closeSearchResult();
    }

    changePageData(element) {
        if(element.hasAttribute("data-verb-index")) {
            let index = element.getAttribute("data-verb-index");
            this.onPageDataChanged(index);
        }
    }

    closeSearchResult() {
        let ul = document.getElementById("search-result-list");
        if(ul) {
            ul.classList.add("hide");
        } 
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
