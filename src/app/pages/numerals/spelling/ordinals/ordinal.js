import IntegerDictionary from "../dictionaries/integer-dictionary";
import OrdinalDictionary from "../dictionaries/ordinal-dictionary";

class Ordinal {

    static spell(number, genderType) {

        let units = [];
        let spelling;

        if (number <= 30) {
            units.push(this.getTen(number));
        }
        else {
            this.walk(number, units);
        }

        spelling = this.createSpellingCombinations(units);
        this.setGender(spelling, genderType);
        return spelling;
    }

    static walk(number, units) {
        let numberString = number.toString();
        let unit = this.calculateStartingUnit(numberString);

        for (let i = 0; i < numberString.length - 1; i++) {

            let part = parseInt(numberString.substr(i, unit === 10 ? 2 : 1), 10);

            if (unit === 10 && part > 0 && number < 10000) {
                units.push(this.getTen(part));
            }
            else if (unit === 100 && part > 0) {
                units.push(this.getHundred(part));
            }
            else if (unit === 1000 && number < 10000) {
                units.push(this.getThousands(part));
            }
            else if (number === 10000 && i === 0) {
                units.push([IntegerDictionary[10] + OrdinalDictionary[1000]]); // 'diezmilésimo' ...
            }

            unit = (unit === 10 ? 1000 : unit / 10);
        }
    }

    static calculateStartingUnit(numberString) {
        let position = (numberString.length - 1) % 3;
        return (position === 0 ? 1000 : Math.pow(10, position));
    }

    static getTen(x) {
        if (x <= 30) {
            return OrdinalDictionary[x].slice();
        }
        else {
            let one = x % 10;
            let ten = Math.floor((x % 100) / 10) * 10;
            return one === 0 ?
                [OrdinalDictionary[ten].slice()] : // 'sexagésimo', 'septuagésim0'...
                [OrdinalDictionary[ten].slice() + " " + OrdinalDictionary[one].slice()]; // 'trigésimo primero', 'octogésimo tercero' ...
        }
    }

    static getHundred(x) {
        let hundred = x * 100;
        return OrdinalDictionary[hundred].slice(); // 'centésimo', 'ducentésimo' ...
    }

    static getThousands(x) {
        let spelling = [""];
        if (x > 1) {
            spelling[0] = IntegerDictionary[x]; // 'dosmilésimo' ...
        }
        spelling[0] += OrdinalDictionary[1000].slice(); // 'mil'
        return spelling;
    }

    static createSpellingCombinations(units) {

        let spelling = [],
            combinations = 1,
            index;

        for (let i = 0; i < units.length; i++) {
            combinations *= units[i].length;
        }

        for (let i = 0; i < combinations; i++) {
            spelling.push("");
        }

        for (let i = 0; i < units.length; i++) {
            index = 0;
            for (let j = 0; j < spelling.length; j++) {
                if (index > units[i].length - 1) {
                    index = 0;
                }
                spelling[j] += units[i][index];
                if (i < units.length - 1) {
                    spelling[j] += " ";
                }
                index++;
            }
        }

        return spelling;
    }

    static setGender(spelling, genderType) {
        for (let i = 0; i < spelling.length; i++) {
            spelling[i] = spelling[i].replace(/@/g, genderType);
            spelling[i] = spelling[i].replace(/@/g, "");
        }
    }
}

export default Ordinal;
