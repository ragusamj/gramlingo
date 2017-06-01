import PhoneticIndexer from "./phonetic-indexer";

// \u00E1-\u00FC === á, é, ñ, ü etc...
const spanishLetters = /^[a-z\u00E1-\u00FC]+$/i;
const maxSearchResults = 10;

class VerbSearchService {

    constructor(verbs) {
        this.verbs = verbs;
        this.indexer = new PhoneticIndexer();
    }

    search(term) {
        let matches = [];
        if(spanishLetters.test(term)) {

            this.assertPhoneticIndex();
            this.matchFromStart(term, matches);
            this.matchInside(term, matches);
            this.matchPhonetically(matches, term);

            matches.sort((a, b) => {
                return b.weight - a.weight;
            });

            matches.length = maxSearchResults;
        }
        return {
            matches: matches,
            maxExceeded: matches.length >= maxSearchResults
        };
    }

    assertPhoneticIndex() {
        if(!this.phoneticIndex) {
            this.phoneticIndex = {};
            this.verbs.forEach((verb, index) => {
                Object.keys(verb).forEach((key) => {
                    this.index(verb[key], index, key === "name" ? "name" : "form");
                });
            });
        }
    }

    index(obj, verbIndex, type) {
        if(typeof obj === "string") {
            let keys = this.indexer.index(obj);
            keys.forEach((key, i) => {
                let values = this.phoneticIndex[key] = this.phoneticIndex[key] || [];
                values.push({type: type, verbIndex: verbIndex, value: obj, r: i});
            });
        }
        else if (Array.isArray(obj)){
            obj.forEach((value) => {
                this.index(value, verbIndex, type);
            });
        }
        else if (typeof obj === "object") {
            Object.keys(obj).forEach((key) => {
                this.index(obj[key], verbIndex, type);
            });
        }
    }

    matchFromStart(term, matches) {
        for(let i = 0; i < this.verbs.length; i++) {
            if(matches.length >= maxSearchResults) {
                break;
            }
            let verb = this.verbs[i];
            let name = verb.name.toLowerCase();
            if(name === term) {
                matches.push({
                    weight: 100,
                    pre: "",
                    match: term,
                    post: "",
                    source: "",
                    index: i
                });
            }
            else {
                if(this.startsWith(name, term)) {
                    matches.push({
                        weight: 90,
                        pre: "",
                        match: term,
                        post: name.substr(term.length),
                        source: "",
                        index: i
                    });
                }
            }
        }
    }

    matchInside(term, matches) {
        if(matches.length < maxSearchResults) {
            for(let i = 0; i < this.verbs.length; i++) {
                if(matches.length >= maxSearchResults) {
                    break;
                }
                let verb = this.verbs[i];
                let name = verb.name.toLowerCase();
                let index = name.indexOf(term);
                if(index > 0) {
                    matches.push({
                        weight: 80 - index,
                        pre: name.substring(0, index),
                        match: term,
                        post: name.substring(index + term.length),
                        source: "",
                        index: i
                    });
                }
            }
        }
    }

    matchPhonetically(matches, term) {
        if(matches.length < maxSearchResults) {
            let dupecache = [];
            let keys = this.indexer.index(term);
            for(let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let index = this.phoneticIndex[key];
                if(index) {
                    for(let j = 0; j < index.length; j++) {
                        let match = index[j];
                        let value = match.value.toLowerCase();
                        let source = this.verbs[match.verbIndex].name.toLowerCase();
                        let dupekey = value + "_" + source;
                        if(dupecache.indexOf(dupekey) === -1) {
                            dupecache.push(dupekey);
                            let weight = (match.value === term ? 60 : 50) - (match.type === "name" ? 0 : 1);
                            matches.push({
                                weight: weight,
                                pre: "",
                                match: value,
                                post: "",
                                source: source,
                                index: match.verbIndex
                            });
                        }
                    }
                }
            }
        }
    }

    startsWith(str, pattern) {
        return str.lastIndexOf(pattern, 0) === 0;
    }
}

export default VerbSearchService;
