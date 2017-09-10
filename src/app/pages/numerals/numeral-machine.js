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

    ask(value) {

        let result = { matches: [] };

        let fractionMatch = value.match(fractionRegexp);
        if(fractionMatch) {
            let fractions = Fraction.spell(parseInt(fractionMatch[1]), parseInt(fractionMatch[2]));
            for(let item of fractions) {
                result.matches.push({ pre: "", match: item, post: "", source: "fractions", index: 0 });
            }
        }

        let timeMatch = value.match(timespanRegexp);
        if(timeMatch) {
            let time = Time.spell(parseInt(timeMatch[1]), parseInt(timeMatch[2]));
            for(let item of time) {
                result.matches.push({ pre: "", match: item, post: "", source: "time", index: 0 });
            }
        }

        if(!value || /[^0-9]/.test(value)) {
            return result;
        }

        if(value >= 0 && value <= 23) {
            let time = Time.spell(parseInt(value), 0);
            for(let item of time) {
                result.matches.push({ pre: "", match: item, post: "", source: "time", index: 0 });
            }
        }

        if(value >= 0 && value <= 2900) {
            let century = Century.spell(Math.floor(value / 100) * 100);
            result.matches.push({ pre: "", match: century, post: "", source: "centuries", index: 0 });
        }

        if(value >= 0 && value <= 1000000) {
            let integer = Integer.spell(parseInt(value));
            result.matches.push({ pre: "", match: integer, post: "", source: "integers", index: 0 });
        }

        if(value > 0 && value <= 10000) {
            let ordinals = Ordinal.spell(parseInt(value), OrdinalSuffix.masculine);
            for(let item of ordinals) {
                result.matches.push({ pre: "", match: item, post: "", source: "ordinals", index: 0 });
            }
        }

        return result;
    }
}

export default NumeralMachine;