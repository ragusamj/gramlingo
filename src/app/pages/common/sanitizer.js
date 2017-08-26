
const SpanishUnicodes = {
    "Á": "00C1",
    "á": "00E1",
    "É": "00C9",
    "é": "00E9",
    "Í": "00CD",
    "í": "00ED",
    "Ó": "00D3",
    "ó": "00F3",
    "Ú": "00DA",
    "ú": "00FA",
    "ü": "00FC",
    "Ñ": "00D1",
    "ñ": "00F1",
    "ª": "00AA",
    "º": "00BA"
};

class Sanitizer {

    static getUnicodeString() {
        let unicodeString = "";
        for(let key of Object.keys(SpanishUnicodes)) {
            unicodeString += "\\u" + SpanishUnicodes[key];
        }
        return unicodeString;
    }

    static getUnicodeRegexp() {
        return new RegExp("[^0-9a-zA-Z\\s:/" + this.getUnicodeString() + "]", "g");
    }

    static sanitize(s) {
        if(!this.regexpSanitizer) {
            this.regexpSanitizer = this.getUnicodeRegexp();
        }
        return s
            .replace(/\s+/g, " ")
            .replace(this.regexpSanitizer, "")
            .trim();
    }
}

export default Sanitizer;
