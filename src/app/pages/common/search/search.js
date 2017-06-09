import debounce from "lodash.debounce";
import Template from "../../../core/template";
import ElementWalker from "../walkers/element-walker";
import KeyCode from "../walkers/key-code";
import SearchEngine from "./search-engine";

const searchTypingDelay = 300;

class Search {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
        this.walker = new ElementWalker();

        this.deferredSearch = debounce((e) => {
            if(e.target.hasAttribute("data-search-input") && !(this.walker.isWalkable(e.keyCode) || e.keyCode === KeyCode.enter)) {
                let result = this.searchEngine.search(e.target.value);
                this.showSearchResult(result);
            }
        }, searchTypingDelay);
        
        this.browserEvent.on("click", this.onSearchResultClick.bind(this));
        this.browserEvent.on("keydown", this.onKeydown.bind(this));
        this.browserEvent.on("keyup", this.deferredSearch);
        this.browserEvent.on("page-searchable-data-updated", this.onSearchablePageDataUpdated.bind(this));

        this.template = Template.fromElementId("search-result-template");
        this.itemTemplate = Template.fromElementId("search-result-item-template");
    }

    onSearchablePageDataUpdated(e) {
        this.searchEngine = new SearchEngine(e.detail);
    }

    onKeydown(e) {
        if(e.target.hasAttribute("data-search-input")) {
            if(this.walker.isWalkable(e.keyCode)) {
                this.walker.walk(e.keyCode);
            }
            if(e.keyCode === KeyCode.enter) {
                let element = document.getElementById(this.walker.currentElementId);
                this.changeDataIndex(element);
                this.closeSearchResult();
            }
        }
    }

    showSearchResult(result) {

        let template = this.template.clone();
        let ul = template.querySelector("ul");
        this.ids = [];

        if(result.matches.length > 0) {

            result.matches.forEach((match) => {
                let item = this.itemTemplate.clone();
                item.set("pre", { innerHTML: match.pre });
                item.set("match", { innerHTML: match.match });
                item.set("post", { innerHTML: match.post });
                item.set("source", { innerHTML: match.source });
                let li = item.set("search-result-item");
                li.setAttribute("data-search-result-index", match.index);
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
        this.changeDataIndex(e.target);
        this.closeSearchResult();
    }

    changeDataIndex(element) {
        if(element.hasAttribute("data-search-result-index")) {
            let index = element.getAttribute("data-search-result-index");
            this.browserEvent.emit("search-result-index-updated", index);
        }
    }

    closeSearchResult() {
        let ul = document.getElementById("search-result-list");
        if(ul) {
            ul.classList.add("hide");
        } 
    }
}

export default Search;
