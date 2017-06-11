import debounce from "lodash.debounce";
import KeyCode from "../walkers/key-code";
import SearchEngine from "./search-engine";

const searchTypingDelay = 300;

class SearchListener {

    constructor(browserEvent, searchResult) {
        this.browserEvent = browserEvent;
        this.searchResult = searchResult;

        this.deferredSearch = debounce((e) => {
            if(e.target.hasAttribute("data-search-input") && !(this.isWalkerKey(e.keyCode) || e.keyCode === KeyCode.enter)) {
                let result = this.searchEngine.search(e.target.value);
                this.searchResult.show(result);
            }
        }, searchTypingDelay);
        
        this.browserEvent.on("click", this.onSearchResultClick.bind(this));
        this.browserEvent.on("keydown", this.onKeydown.bind(this));
        this.browserEvent.on("keyup", this.deferredSearch);
        this.browserEvent.on("page-searchable-data-updated", this.onSearchablePageDataUpdated.bind(this));
    }

    onSearchablePageDataUpdated(e) {
        this.searchEngine = new SearchEngine(e.detail);
    }

    onSearchResultClick(e) {
        this.searchResult.select(e.target);
        this.searchResult.close();
    }

    onKeydown(e) {
        if(e.target.hasAttribute("data-search-input")) {
            if(this.isWalkerKey(e.keyCode)) {
                this.searchResult.walk(e.keyCode);
            }
            if(e.keyCode === KeyCode.enter) {
                this.searchResult.selectCurrent();
                this.searchResult.close();
            }
        }
    }

    isWalkerKey(key) {
        return key === KeyCode.downArrow || key === KeyCode.upArrow;
    }
}

export default SearchListener;
