
const SpanishLetters = {
    "Aacute": "00C1", // Á
    "aacute": "00E1", // á
    "Eacute": "00C9", // É
    "eacute": "00E9", // é
    "Iacute": "00CD", // Í
    "iacute": "00ED", // í
    "Ntilde": "00D1", // Ñ
    "ntilde": "00F1", // ñ
    "Oacute": "00D3", // Ó
    "oacute": "00F3", // ó
    "Uacute": "00DA", // Ú
    "uacute": "00FA", // ú
    "Uuml":   "00DC", // Ü
    "uuml":   "00FC"  // ü
};

const SpanishOrdinalSigns = {
    "ordf": "00AA", // ª
    "ordm": "00BA"  // º
};

class Sanitizer {

    static getLetterString() {
        let letters = "";
        for(let key of Object.keys(SpanishLetters)) {
            letters += "\\u" + SpanishLetters[key];
        }
        return letters;
    }

    static getOrdinalSignString() {
        let signs = "";
        for(let key of Object.keys(SpanishOrdinalSigns)) {
            signs += "\\u" + SpanishOrdinalSigns[key];
        }
        return signs;
    }

    static getUnicodeRegexp() {
        return new RegExp("[^0-9a-zA-Z\\s:/" + this.getLetterString() + this.getOrdinalSignString() + "]", "g");
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
