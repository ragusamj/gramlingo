import debounce from "lodash.debounce";

const searchTypingDelay = 250;

class SearchListener {

    constructor(browserEvent, search) {
        this.browserEvent = browserEvent;
        this.search = search;
        this.debouncedKeyup = debounce(this.search.onKeyup.bind(this.search), searchTypingDelay);
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("click", this.search.onClick.bind(this.search)),
            this.browserEvent.on("keydown", this.search.onKeydown.bind(this.search)),
            this.browserEvent.on("keyup", this.debouncedKeyup)
        ];
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }
}

export default SearchListener;
