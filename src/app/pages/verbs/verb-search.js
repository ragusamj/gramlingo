import debounce from "lodash.debounce";
import Indices from "./indices";
import EventBroker from "../../core/event-broker";

// \u00E1-\u00FC === á, é, ñ, ü etc...
const spanishLetters = /^[a-z\u00E1-\u00FC]+$/i;
const searchTypingDelay = 300;
const maxSearchResults = 10;

class VerbSearch {

    constructor(verbs, onVerbChanged) {
        this._verbs = verbs;
        this._verbs.sort((a, b) => {
            return a[Indices.name].localeCompare(b[Indices.name]);
        });
        this._onVerbChanged = onVerbChanged;
        this._deferredSearch = debounce((e) => {
            this._search(e);
        }, searchTypingDelay);
        this._destroyOnSearch = EventBroker.add("keyup", this._deferredSearch);
        this._destroyOnSearchResultClick = EventBroker.add("click", this._onSearchResultClick.bind(this));
    }

    destroy() {
        this._destroyOnSearch();
        this._destroyOnSearchResultClick();
    }

    _search(e) {
        if(e.target && e.target.hasAttribute("data-verb-search")) {

            let matches = [];

            if(spanishLetters.test(e.target.value)) {
                this._matchFromStart(e.target.value, matches);
                this._matchInside(e.target.value, matches);
                matches.sort((a, b) => {
                    return b.weight - a.weight;
                });
            }

            let maxExceeded = matches.length >= maxSearchResults;
            this._showSearchResult(matches, maxExceeded);
        }
    }

    _matchFromStart(value, matches) {
        for(let i = 0; i < this._verbs.length; i++) {
            if(matches.length >= maxSearchResults) {
                break;
            }
            let verb = this._verbs[i];
            let name = verb[Indices.name].toLowerCase();
            if(name === value) {
                matches.push({
                    weight: 100,
                    pre: "",
                    match: value,
                    post: "",
                    index: i
                });
            }
            else {
                if(this._startsWith(name, value)) {
                    matches.push({
                        weight: 90,
                        pre: "",
                        match: value,
                        post: name.substr(value.length),
                        index: i
                    });
                }
            }
        }
    }

    _matchInside(value, matches) {
        if(matches.length < maxSearchResults) {
            for(let i = 0; i < this._verbs.length; i++) {
                if(matches.length >= maxSearchResults) {
                    break;
                }
                let verb = this._verbs[i];
                let name = verb[Indices.name].toLowerCase();
                let index = name.indexOf(value);
                if(index > 0) {
                    matches.push({
                        weight: 90 - (index * 10),
                        pre: name.substring(0, index),
                        match: value,
                        post: name.substring(index + value.length),
                        index: i
                    });
                }
            }
        }
    }

    _startsWith(str, pattern) {
        return str.lastIndexOf(pattern, 0) === 0;
    }

    _showSearchResult(matches, maxExceeded) {
        let searchResult = document.createDocumentFragment();

        matches.forEach((match) => {
            let row = document.createElement("div");
            row.setAttribute("data-verb-index", match.index);
            searchResult.appendChild(row);
            let pre = document.createTextNode(match.pre);
            row.appendChild(pre);
            let m = document.createElement("strong");
            m.innerHTML = match.match;
            row.appendChild(m);
            let post = document.createTextNode(match.post);
            row.appendChild(post);
        });

        if(maxExceeded) {
            let more = document.createElement("div");
            more.innerHTML = "...";
            searchResult.appendChild(more);
        }

        let popup = document.getElementById("search-result");
        while (popup.firstChild) {
            popup.removeChild(popup.firstChild);
        }
        popup.appendChild(searchResult);
        popup.className = matches.length > 0 ? "search-result visible" : "search-result hidden";
    }

    _onSearchResultClick(e) {
        if(e.target && e.target.hasAttribute("data-verb-index")) {
            let index = e.target.getAttribute("data-verb-index");
            this._onVerbChanged(index);
            let popup = document.getElementById("search-result");
            popup.className = "search-result hidden";
        }
    }
}

export default VerbSearch;
