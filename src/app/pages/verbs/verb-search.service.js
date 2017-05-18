// \u00E1-\u00FC === á, é, ñ, ü etc...
const spanishLetters = /^[a-z\u00E1-\u00FC]+$/i;
const maxSearchResults = 10;

class VerbSearchService {

    constructor(verbs) {
        this._verbs = verbs;
    }

    search(term) {
        let matches = [];
        if(spanishLetters.test(term)) {
            this._matchFromStart(term, matches);
            this._matchInside(term, matches);
            matches.sort((a, b) => {
                return b.weight - a.weight;
            });
        }
        return {
            matches: matches,
            maxExceeded: matches.length >= maxSearchResults
        };
    }

    _matchFromStart(value, matches) {
        for(let i = 0; i < this._verbs.length; i++) {
            if(matches.length >= maxSearchResults) {
                break;
            }
            let verb = this._verbs[i];
            let name = verb.name.toLowerCase();
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
                let name = verb.name.toLowerCase();
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
}

export default VerbSearchService;
