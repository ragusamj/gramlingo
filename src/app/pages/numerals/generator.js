import Fraction from "./spelling/fractions/fraction";
import Century from "./spelling/centuries/century";
import Integer from "./spelling/integers/integer";
import Time from "./spelling/time/time";

class Generator {

    constructor() {
        this.actions = {
            centuries: this.randomizeCenturies.bind(this),
            fractions: this.randomizeFractions.bind(this),
            integers: this.randomizeIntegers.bind(this),
            time: this.randomizeTime.bind(this),
        };
        this.lastCenturiesValues = [];
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

    randomizeCenturies() {
        
        let result = [];
        let buffer = [];

        while(buffer.length < 6) {
            let century = this.getRandomNumber(0, 29) * 100;
            if(buffer.indexOf(century) === -1 && this.lastCenturiesValues.indexOf(century) === -1) {
                buffer.push(century);
                result.push({
                    q: [[century + "-" + (century + 99)]],
                    a: [[Century.spell(century)]]
                });
            }
        }

        this.lastCenturiesValues = buffer;
        
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
                a: [Fraction.spell(fraction[0], fraction[1])]
            });
        }
        
        return result;
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

    randomizeTime() {
        
        let result = [];
        let times = [
            [this.getRandomNumber(0, 23), this.getRandomNumber(0, 59)],
            [this.getRandomNumber(0, 23), this.getRandomNumber(0, 59)],
            [this.getRandomNumber(0, 23), this.getRandomNumber(0, 59)],
            [this.getRandomNumber(0, 23), this.getRandomNumber(0, 59)],
            [this.getRandomNumber(0, 23), this.getRandomNumber(0, 59)],
            [this.getRandomNumber(0, 23), this.getRandomNumber(0, 59)]
        ];

        this.shuffleArray(times);
        
        for (let time of times) {
            result.push({
                q: [[this.formatTimeSpan(time[0], time[1])]],
                a: [Time.spell(time[0], time[1])]
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

    padLeft(value, length, padchar) {
        let result = value.toString();
        let pad;
        for (pad = length - result.length; pad > 0; pad--) {
            result = padchar + result;
        }
        return result;
    }
        
    formatTimeSpan(hour, minute) {
        return this.padLeft(hour, 2, "0") + ":" + this.padLeft(minute, 2, "0");
    }
}

export default Generator;