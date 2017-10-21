class PhoneticIndexer {

    constructor() {
        this.indexers = {
            "B": this.bv,
            "C": this.c,
            "D": this.d,
            "F": this.noop,
            "G": this.g,
            "J": this.j,
            "K": this.noop,
            "L": this.noop,
            "M": this.noop,
            "N": this.nr,
            "Ñ": this.ntilde,
            "P": this.noop,
            "Q": this.q,
            "R": this.nr,
            "S": this.s,
            "T": this.noop,
            "V": this.bv,
            "W": this.noop,
            "Z": this.z,
            "X": this.x,
        };
    }

    index(text) {
        let result = { primary: "", secondary: "" };
        text = text.toUpperCase();
        for(let index = 0; index < text.length; index++) {
            if(this.vowel(text, index, result) || this.ll(text, index, result)) {
                continue;
            }
            let consonant = text[index];
            if(this.indexers[consonant]) {
                this.indexers[consonant](text, index, result);
            }
        }
        return this.resolve(result);
    }

    vowel(text, index, result) {
        if(["H","A","Á","E","É","I","Í","O","Ó","U","Ú","Ü"].indexOf(text[index]) > -1) {
            let vowel = index === 0 ? "A" : "";
            result.primary += vowel;
            result.secondary += vowel;
            return true;
        }
        return false;
    }

    noop(text, index, result) {
        result.primary += text[index];
        result.secondary += text[index];
    }

    bv(text, index, result) {
        result.primary += "B";
        result.secondary += "B";
    }

    c(text, index, result) {
        if(["E", "I"].indexOf(text[index + 1]) > -1) {
            result.primary += "S";
            result.secondary += "S";
        }
        else if(text[index + 1] === "H") {
            result.primary += "X";
            result.secondary += "X";
        }
        else {
            result.primary += "K";
            result.secondary += "K";
        }
    }

    d(text, index, result) {
        result.primary += "T";
        if(!(index !== 1 && ["A", "I"].indexOf(text[index - 1]) > -1 && ["A", "O"].indexOf(text[index + 1]) > -1)) {
            result.secondary += "T";
        }
    }

    g(text, index, result) {
        if(["E", "I"].indexOf(text[index + 1]) > -1) {
            result.primary += "X";
            result.secondary += "X";
        }
        else if(index === 0 && text[index + 1] === "Ü") {
            result.primary += "A";
            result.secondary += "A";
        }
        else {
            result.primary += "G";
            result.secondary += "G";
        }
    }

    j(text, index, result) {
        result.primary += "X";
        result.secondary += "X";
    }

    ll(text, index, result) {
        if(text[index] === "Y" && ["A","E","O","U"].indexOf(text[index + 1]) > -1) {
            result.primary += "LL";
            result.secondary += "LL";
            return true;
        }
        return false;
    }

    q(text, index, result) {
        result.primary += "K";
        result.secondary += "K";
    }

    nr(text, index, result) {
        if(text[index + 1] !== text[index]) {
            result.primary += text[index];
            result.secondary += text[index];
        }
    }

    ntilde(text, index, result) {
        result.primary += "N";
        result.secondary += "N";
    }

    s(text, index, result) {
        result.primary += "S";
        if(text[index + 1] !== "T") {
            result.secondary += "S";
        }
    }

    z(text, index, result) {
        result.primary += "S";
        result.secondary += "S";
    }

    x(text, index, result) {
        result.primary += "KS";
        result.secondary += "KS";
    }

    resolve(result) {
        return result.primary === result.secondary ? [result.primary] : [result.primary, result.secondary];
    }
}

export default PhoneticIndexer;
