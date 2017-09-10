import Fraction from "./spelling/fractions/fraction";
import Century from "./spelling/centuries/century";
import Integer from "./spelling/integers/integer";
import Ordinal from "./spelling/ordinals/ordinal";
import OrdinalSuffix from "./spelling/ordinals/ordinal-suffix";
import Time from "./spelling/time/time";

const fractionRegexp = /^([0-9][0-9]?|100)\/([2-9]|[1-9][0-9]|100)$/;
const timespanRegexp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

class NumeralMachine {

    constructor(i18n) {
        this.i18n = i18n;
    }

    ask(type, value) {

        let result = { matches: [] };

        if(!value || /[^0-9:/]/.test(value)) {
            return result;
        }

        switch(type) {
            case "fractions":
                this.getFraction(value, result);
                break;
            case "time":
                this.getTime(value, result);
                break;
            case "centuries":
                this.getCenturies(value, result);
                break;
            case "integers":
                this.getIntegers(value, result);
                break;
            case "ordinals":
                this.getOrdinals(value, result);
                break;
        }

        return result;
    }

    getFraction(value, result) {
        let fractionMatch = value.match(fractionRegexp);
        if(fractionMatch) {
            let fractions = Fraction.spell(parseInt(fractionMatch[1]), parseInt(fractionMatch[2]));
            for(let item of fractions) {
                result.matches.push({ pre: "", match: item, post: "", source: "", index: 0 });
            }
        }
    }

    getTime(value, result) {
        let timeMatch = value.match(timespanRegexp);
        if(timeMatch) {
            let time = Time.spell(parseInt(timeMatch[1]), parseInt(timeMatch[2]));
            for(let item of time) {
                result.matches.push({ pre: "", match: item, post: "", source: "", index: 0 });
            }
        }
        if(value >= 0 && value <= 23) {
            let time = Time.spell(parseInt(value), 0);
            for(let item of time) {
                result.matches.push({ pre: "", match: item, post: "", source: "", index: 0 });
            }
        }
    }

    getCenturies(value, result) {
        if(value >= 0 && value <= 2900) {
            let century = Century.spell(Math.floor(value / 100) * 100);
            result.matches.push({ pre: "", match: century, post: "", source: "", index: 0 });
        }
    }

    getIntegers(value, result) {
        if(value >= 0 && value <= 1000000) {
            let integer = Integer.spell(parseInt(value));
            result.matches.push({ pre: "", match: integer, post: "", source: "", index: 0 });
        }
    }

    getOrdinals(value, result) {
        if(value > 0 && value <= 10000) {
            let ordinals = Ordinal.spell(parseInt(value), OrdinalSuffix.masculine);
            for(let item of ordinals) {
                result.matches.push({ pre: "", match: item, post: "", source: "", index: 0 });
            }
        }
    }
}

export default NumeralMachine;