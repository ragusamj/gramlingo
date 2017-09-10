import throttle from "lodash.throttle";
import KeyCode from "../walkers/key-code";
import SearchEngine from "./search-engine";

const searchTypingDelay = 250;

class SearchListener {

    constructor(browserEvent, searchResultVisualizer) {
        this.browserEvent = browserEvent;
        this.searchResultVisualizer = searchResultVisualizer;

        this.throttledSearch = throttle((e) => {
            if(e.target.hasAttribute("data-search-input") && !(this.isWalkerKey(e.keyCode) || e.keyCode === KeyCode.enter)) {
                let result = this.searchEngine.search(e.target.value);
                this.searchResultVisualizer.show(result);
            }
        }, searchTypingDelay, { leading: false });
        
        this.browserEvent.on("click", this.onSearchResultClick.bind(this));
        this.browserEvent.on("keydown", this.onKeydown.bind(this));
        this.browserEvent.on("keyup", this.throttledSearch);
        this.browserEvent.on("page-searchable-data-updated", this.onSearchablePageDataUpdated.bind(this));
    }

    onSearchablePageDataUpdated(e) {
        this.searchEngine = new SearchEngine(e.detail);
    }

    onSearchResultClick(e) {
        this.searchResultVisualizer.select(e.target);
        this.searchResultVisualizer.close();
    }

    onKeydown(e) {
        if(e.target.hasAttribute("data-search-input")) {
            if(this.isWalkerKey(e.keyCode)) {
                this.searchResultVisualizer.walk(e.keyCode);
            }
            if(e.keyCode === KeyCode.enter) {
                this.searchResultVisualizer.selectCurrent();
                this.searchResultVisualizer.close();
            }
        }
    }

    isWalkerKey(key) {
        return key === KeyCode.downArrow || key === KeyCode.upArrow;
    }
}

export default SearchListener;
