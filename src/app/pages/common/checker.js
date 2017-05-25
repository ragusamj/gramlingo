import diff from "fast-diff";

class Checker {
    check(variants, answer) {

        answer = this.sanitize(answer);

        if(!answer) {
            return undefined;
        }

        let result = {
            diffs: [],
            isCorrect: false
        };

        for(let variant of variants) {
            let a = variant.toLocaleLowerCase();
            let b = answer.toLocaleLowerCase();
            if(a === b) {
                result.isCorrect = true;
            }
            else {
                result.diffs.push(diff(a, b));
            }
        }

        if(result.diffs.length === 0) {
            return undefined;
        }

        return result;
    }

    sanitize(s) {
        // TODO:
        // [^0-9a-z\u00E1-\u00FC]+$/i;
        return s;
    }
}

export default Checker;
