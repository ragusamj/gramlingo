import PhoneticIndexer from "./phonetic-indexer";
import Sanitizer from "../sanitizer";

const spanishLetters = new RegExp("^[a-z" + Sanitizer.getLetterString() + "]+$", "i");
const maxSearchResults = 10;

class SearchEngine {

    constructor(data) {
        this.data = data;
        this.indexer = new PhoneticIndexer();
    }

    search(term) {
        let matches = [];
        let maxExceeded = false;
        if(spanishLetters.test(term)) {

            let dupecache = [];
            this.matchExact(term, matches, dupecache);
            this.matchPhonetically(matches, term, dupecache);

            matches.sort((a, b) => {
                return b.weight - a.weight;
            });

            maxExceeded = matches.length >= maxSearchResults;
            matches.length = maxExceeded ? maxSearchResults : matches.length;
        }
        return {
            matches: matches,
            maxExceeded: maxExceeded
        };
    }

    assertPhoneticIndex() {
        if(!this.phoneticIndex) {
            this.phoneticIndex = {};
            this.data.forEach((item, index) => {
                Object.keys(item).forEach((key) => {
                    this.index(item[key], index, key);
                });
            });
        }
    }

    index(obj, dataIndex, type) {
        if(typeof obj === "string") {
            let keys = this.indexer.index(obj);
            keys.forEach((key, i) => {
                let values = this.phoneticIndex[key] = this.phoneticIndex[key] || [];
                values.push({type: type, dataIndex: dataIndex, value: obj, r: i});
            });
        }
        else if (Array.isArray(obj)){
            obj.forEach((value) => {
                this.index(value, dataIndex, type);
            });
        }
        else if (typeof obj === "object") {
            Object.keys(obj).forEach((key) => {
                this.index(obj[key], dataIndex, type);
            });
        }
    }

    matchExact(term, matches, dupecache) {
        for(let i = 0; i < this.data.length; i++) {
            if(matches.length >= maxSearchResults) {
                break;
            }
            let item = this.data[i];
            let name = item.name.toLowerCase();
            if(name === term) {
                matches.push({
                    weight: 100,
                    pre: "",
                    match: term,
                    post: "",
                    source: "",
                    index: i
                });
                dupecache.push(name + "_" + name);
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

    matchPhonetically(matches, term, dupecache) {
        if(matches.length < maxSearchResults) {
            this.assertPhoneticIndex();
            let keys = this.indexer.index(term);
            for(let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let index = this.phoneticIndex[key];
                if(index) {
                    for(let j = 0; j < index.length; j++) {
                        let match = index[j];
                        let value = match.value.toLowerCase();
                        let source = this.data[match.dataIndex].name.toLowerCase();
                        let dupekey = value + "_" + source;
                        if(dupecache.indexOf(dupekey) === -1) {
                            dupecache.push(dupekey);
                            let weight = (match.value === term ? 80 : 70) - (match.type === "name" ? 0 : 1);
                            matches.push({
                                weight: weight,
                                pre: "",
                                match: value,
                                post: "",
                                source: source,
                                index: match.dataIndex
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

export default SearchEngine;
