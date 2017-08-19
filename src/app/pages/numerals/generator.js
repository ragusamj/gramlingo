import Fraction from "./spelling/fractions/fraction";
import Integer from "./spelling/integers/integer";

class Generator {

    constructor() {
        this.actions = {
            integers: this.randomizeIntegers.bind(this),
            fractions: this.randomizeFractions.bind(this)
        };
    }

    all() {
        let generated = {};
        for (let key of Object.keys(this.actions)) {
            generated[key] = this.actions[key]();
        }
        return generated;
    }

    get(key) {
        return this.actions[key]();
    }

    randomizeIntegers() {

        let result = [];
        let now = new Date();
        let integers = [
            this.getRandomNumber(1, 29),
            this.getRandomNumber(30, 100),
            this.getRandomNumber(100, 1000),
            this.getRandomNumber(now.getFullYear() - 300, now.getFullYear() + 50),
            this.getRandomNumber(10000, 100000),
            this.getRandomNumber(100000, 1000000)
        ];

        this.shuffleArray(integers);

        for (let integer of integers) {
            result.push({
                q: [[integer]],
                a: [[Integer.spell(integer)]]
            });
        }

        return result;
    }

    randomizeFractions() {
        
        let result = [];
        let fractions = [
            [this.getRandomNumber(1, 5), this.getRandomNumber(2, 5)],
            [this.getRandomNumber(1, 5), this.getRandomNumber(2, 5)],
            [this.getRandomNumber(1, 5), this.getRandomNumber(6, 10)],
            [this.getRandomNumber(1, 10), this.getRandomNumber(6, 10)],
            [this.getRandomNumber(1, 10), this.getRandomNumber(2, 5)],
            [this.getRandomNumber(1, 10), this.getRandomNumber(11, 30)],
            [this.getRandomNumber(11, 100), this.getRandomNumber(31, 100)]
        ];

        this.shuffleArray(fractions);
        
        for (let fraction of fractions) {
            result.push({
                q: [[fraction[0] + "/" + fraction[1]]],
                a: [[Fraction.spell(fraction[0], fraction[1])]]
            });
        }
        
        return result;
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffleArray(array) {
        // Fisher-Yates Shuffle
        let i = array.length;
        if (array.length > 0) {
            while (--i) {
                let j = Math.floor(Math.random() * (i + 1));
                let tempi = array[i];
                let tempj = array[j];
                array[i] = tempj;
                array[j] = tempi;
            }
        }
    }
}

export default Generator;