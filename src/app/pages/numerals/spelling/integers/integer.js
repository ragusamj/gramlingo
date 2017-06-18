import IntegerDictionary from "../dictionaries/integer-dictionary";

class Integer {

    static spell(number) {
        return number <= 29 ? this.getTen(number, false) : this.walk(number);
    }

    static walk(number) {
        let spelling = "";
        let numberString = number.toString();
        let unit = this.calculateStartingUnit(numberString);
        let part;
        for (let i = 0; i < numberString.length - 1; i++) {
            part = parseInt(numberString.substr(i, unit === 10 ? 2 : 1), 10);
            spelling += this.visitTen(part, numberString, unit, i);
            spelling += this.visitHundred(part, number, unit);
            spelling += this.visitThousand(part, number, numberString, unit, i);
            unit = (unit === 10 ? 1000 : unit / 10);
        }
        return spelling.trim();
    }

    static calculateStartingUnit(numberString) {
        let position = (numberString.length - 1) % 3;
        return (position === 0 ? 1000 : Math.pow(10, position));
    }

    static visitTen(part, numberString, unit, index) {
        if (unit === 10 && part > 0) {
            let isBeforeMillion = (index + 8 === numberString.length);
            return this.getTen(part, isBeforeMillion) + " ";
        }
        return "";
    }

    static visitHundred(part, number, unit) {
        if (unit === 100 && part > 0) {
            return this.getHundred(part, number) + " ";
        }
        return "";
    }

    static visitThousand(part, number, numberString, unit, index) {
        let spelling = "";
        if (unit === 1000) {
            if (index + 7 === numberString.length && !(part === 0 && number >= 1000000000)) {
                spelling += this.getMillions(part, number) + " ";
            }
            else if (index + 10 === numberString.length && number === 1000000000) {
                spelling += this.getBillions() + " ";
            }
            else if (!(part === 0 && number >= 10000000)) {
                spelling += this.getThousands(part, index) + " ";
            }
        }
        return spelling;
    }

    static getTen(part, isBeforeMillion) {
        let spelling = "";
        if (part <= 29) {
            spelling = this.getTenGrammatically(part, isBeforeMillion);
        }
        else {
            let one = part % 10;
            let ten = part - one;
            spelling = IntegerDictionary[ten] + (one > 0 ? " y " + this.getTenGrammatically(one, isBeforeMillion) : ""); // 'treinta', 'noventa y nueve', 'treinta y un millones'
        }
        return spelling;
    }

    static getTenGrammatically(part, isBeforeMillion) {
        return part === 1 || part === 21 ?
            IntegerDictionary[part][isBeforeMillion ? 1 : 0] : // 'uno', 'veintiuno' o 'un millón' o 'veintiún millones'
            IntegerDictionary[part]; // 'uno' a 'veintinueve'
    }

    static getHundred(part, number) {
        let spelling = "";
        if (number === 100) {
            spelling = IntegerDictionary[100][0]; // 'cien'
        }
        else {
            let hundred = part * 100;
            spelling = (hundred > 100 ? IntegerDictionary[hundred] : IntegerDictionary[hundred][1]); // 'ciento', 'doscientos', ... 'quinientos' ...
        }
        return spelling;
    }

    static getThousands(part, index) {
        let spelling = "";
        if (index === 0 && part > 1) {
            spelling += this.getTen(part, false) + " "; // 'dos (mil)', 'tres (mil)' ...
        }
        return spelling + IntegerDictionary[1000]; // 'mil'
    }

    static getMillions(part, number) {
        let spelling = "";
        if (number < 10000000) {
            spelling = this.getTen(part, true) + " "; // 'uno (millón)', 'tres (millones)' ...
        }
        return spelling + IntegerDictionary[1000000][number < 2000000 ? 0 : 1]; // 'millón', 'millones'
    }

    static getBillions() {
        return IntegerDictionary[1000000000]; // phew!
    }
}

export default Integer;
