import debounce from "lodash.debounce";
import KeyCode from "../walkers/key-code";

const searchTypingDelay = 250;

class SearchListener {

    constructor(browserEvent, engine, visualizer, who) {
        this.browserEvent = browserEvent;
        this.engine = engine;
        this.visualizer = visualizer;
        this.who = who;

        this.debouncedSearch = debounce((e) => {
            if(e.target.hasAttribute("data-search-input") && !(this.isWalkerKey(e.keyCode) || e.keyCode === KeyCode.enter)) {
                let result = this.engine.search(e.target.value);
                this.visualizer.show(result);
            }
        }, searchTypingDelay);
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("click", this.onSearchResultClick.bind(this)),
            this.browserEvent.on("keydown", this.onKeydown.bind(this)),
            this.browserEvent.on("keyup", this.debouncedSearch),
            this.browserEvent.on("page-searchable-data-updated", this.onSearchablePageDataUpdated.bind(this))
        ];
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }

    onSearchablePageDataUpdated(e) {
        this.engine.initialize(e.detail);
    }

    onSearchResultClick(e) {
        this.visualizer.click(e.target);
    }

    onKeydown(e) {
        if(e.target.hasAttribute("data-search-input")) {
            if(this.isWalkerKey(e.keyCode)) {
                this.visualizer.walk(e.keyCode);
            }
            if(e.keyCode === KeyCode.enter) {
                this.visualizer.selectCurrent();
            }
        }
    }

    isWalkerKey(key) {
        return key === KeyCode.downArrow || key === KeyCode.upArrow;
    }
}

export default SearchListener;
