import FractionDictionary from "../dictionaries/fraction-dictionary";
import IntegerDictionary from "../dictionaries/integer-dictionary";
import Integer from "../integer/integer";

class Fraction {

    static spell(numerator, denominator) {
        let spelling = [];
        let numeratorSpelling = this.getNumerator(numerator);
        let denominatorSpellings = this.getDenominator(denominator);
        let plural = numerator > 1 ? "s" : "";
        for (let i = 0; i < denominatorSpellings.length; i++) {
            spelling.push(numeratorSpelling + " " + denominatorSpellings[i] + plural);
        }
        return spelling;
    }

    static getNumerator(numerator) {
        return numerator === 1 || numerator === 21 ?
            IntegerDictionary[numerator][1] : // un, not uno
            Integer.spell(numerator);
    }

    static getDenominator(denominator) {

        let spelling = [];

        if (denominator < 11 || denominator === 100) {
            spelling.push(FractionDictionary[denominator]); // medio, tercio, centavo ...
            return spelling;
        }

        let denominatorSpelling = Integer.spell(denominator);
        denominatorSpelling = this.addSuffix(denominatorSpelling, denominator);
        denominatorSpelling = denominatorSpelling.replace(/é/g, "e");

        spelling.push(denominatorSpelling);

        if (denominator <= 15) {
            let zavoSpelling = denominatorSpelling.replace(/ceavo$/, "zavo"); // onceavo, onzavo ...
            spelling.push(zavoSpelling);
        }

        if (denominatorSpelling.indexOf(" ") > 0) {
            denominatorSpelling = denominatorSpelling.replace(" y ", "i");
            denominatorSpelling = denominatorSpelling.replace(" ", "");
            denominatorSpelling = denominatorSpelling.replace(" ", "");
            spelling.push(denominatorSpelling);
        }
    
        return spelling;
    }

    static addSuffix(spelling, denominator) {

        let lastdigit = denominator % 10;

        if (denominator > 19 && lastdigit > 0) {
            if (lastdigit === 1) {
                spelling = spelling.substr(0, spelling.length - 1);
            }
            spelling += " ";
        }

        let lastchar = spelling.charAt(spelling.length - 1);

        if (lastchar === "o" || lastchar === "a") {
            spelling = spelling.substr(0, spelling.length - 1);
        }

        return spelling + "avo";
    }
}

export default Fraction;
