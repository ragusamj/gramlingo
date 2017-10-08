import KeyCode from "../walkers/key-code";

class Search {

    constructor(engine, searchResultPopup) {
        this.engine = engine;
        this.searchResultPopup = searchResultPopup;
    }

    onClick(e) {
        this.searchResultPopup.click(e.target);
    }

    onKeydown(e) {
        if(e.target.hasAttribute("data-search-input")) {
            if(this.isWalkerKey(e.keyCode)) {
                this.searchResultPopup.walk(e.keyCode);
            }
            if(e.keyCode === KeyCode.enter) {
                this.searchResultPopup.selectCurrent();
            }
        }
    }

    onKeyup(e) {
        if(e.target.hasAttribute("data-search-input") && !(this.isWalkerKey(e.keyCode) || e.keyCode === KeyCode.enter)) {
            let result = this.engine.search(e.target.value);
            this.searchResultPopup.show(result);
        }
    }

    isWalkerKey(key) {
        return key === KeyCode.downArrow || key === KeyCode.upArrow;
    }
}

export default Search;