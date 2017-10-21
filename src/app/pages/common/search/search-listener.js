import debounce from "../../../core/event/debounce";

const searchTypingDelay = 100;

class SearchListener {

    constructor(browserEvent, search) {
        this.browserEvent = browserEvent;
        this.search = search;
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("click", this.search.onClick.bind(this.search)),
            this.browserEvent.on("keydown", this.search.onKeydown.bind(this.search)),
            this.browserEvent.on("keyup", debounce(this.search.onKeyup.bind(this.search), searchTypingDelay))
        ];
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }
}

export default SearchListener;
