import Fraction from "./spelling/fractions/fraction";
import Century from "./spelling/centuries/century";
import Integer from "./spelling/integers/integer";
import Ordinal from "./spelling/ordinals/ordinal";
import OrdinalSuffix from "./spelling/ordinals/ordinal-suffix";
import Time from "./spelling/time/time";

class NumeralGenerator {

    constructor(integerGenerator) {
        this.integerGenerator = integerGenerator;
        this.actions = {
            centuries: this.randomizeCenturies.bind(this),
            fractions: this.randomizeFractions.bind(this),
            integers: this.randomizeIntegers.bind(this),
            ordinals: this.randomizeOrdinals.bind(this),
            time: this.randomizeTime.bind(this),
        };
        this.lastCenturiesValues = [];
        this.lastFractionValues = [];
        this.lastIntegerValues = [];
        this.lastOrdinalValues = [];
        this.lastTimeValues = [];
    }

    randomize(key) {
        if(key) {
            return this.actions[key]();
        }

        let generated = {};
        for (let key of Object.keys(this.actions)) {
            generated[key] = this.actions[key]();
        }
        return generated;
    }

    randomizeCenturies() {
        
        let result = [];
        let buffer = [];

        while(buffer.length < 6) {
            let century = this.integerGenerator.randomize(0, 29) * 100;
            if(buffer.indexOf(century) === -1 && this.lastCenturiesValues.indexOf(century) === -1) {
                buffer.push(century);
            }
        }

        for (let century of buffer.sort((a, b) => (a - b))) {
            result.push({
                q: [[century + "-" + (century + 99)]],
                a: [[Century.spell(century)]]
            });
        }

        this.lastCenturiesValues = buffer;
        
        return result;
    }

    randomizeFractions() {
        
        let result = [];
        let buffer = [];
        
        while(buffer.length < 6) {
            let numerator = this.integerGenerator.randomize(1, 10);
            let denominator = this.integerGenerator.randomize(2, 10);
            let fraction = numerator + "/" + denominator;
            if(buffer.indexOf(fraction) === -1 && this.lastFractionValues.indexOf(fraction) === -1) {
                buffer.push(fraction);
                result.push({
                    p: numerator / denominator,
                    q: [[fraction]],
                    a: [Fraction.spell(numerator, denominator)]
                });
            }
        }

        this.lastCenturiesValues = buffer;
        
        return result.sort((a, b) => a.p - b.p);
    }

    randomizeIntegers() {

        let result = [];
        let buffer = [];
        let now = new Date();
        let ranges = [
            [1, 29],
            [30, 100],
            [100, 1000],
            [now.getFullYear() - 300, now.getFullYear() + 50],
            [10000, 100000],
            [100000, 1000000]
        ];

        for (let range of ranges) {
            let integer;
            do {
                integer = this.integerGenerator.randomize(range[0], range[1]);
            }
            while(this.lastIntegerValues.indexOf(integer) !== -1);
            buffer.push(integer);
            result.push({
                q: [[integer]],
                a: [[Integer.spell(integer)]]
            });
        }
    
        this.lastIntegerValues = buffer;
        return result;
    }

    randomizeOrdinals() {
        
        let result = [];
        let buffer = [];
        let ranges = [
            [1, 12],
            [13, 29],
            [13, 29],
            [100, 999],
            [1000, 4999],
            [5000, 10000]
        ];
        
        for (let range of ranges) {
            let ordinal;
            do {
                ordinal = this.integerGenerator.randomize(range[0], range[1]);
            }
            while(buffer.indexOf(ordinal) !== -1 || this.lastOrdinalValues.indexOf(ordinal) !== -1);
            buffer.push(ordinal);
            let ordinalType = this.randomizeOrdinalType(ordinal);
            result.push({
                q: [[ordinal + ordinalType.sign]],
                a: [Ordinal.spell(ordinal, ordinalType.suffix)]
            });
        }
            
        this.lastOrdinalValues = buffer;
        return result.sort((a, b) => a.q[0][0] - b.q[0][0]);
    }

    randomizeOrdinalType(ordinal) {
        let r = Math.random();
        if((ordinal === 1 || ordinal === 3) && r <= 0.3) {
            return { suffix: OrdinalSuffix.neuter, sign: "" };
        }
        return r < 0.5 ?
            { suffix: OrdinalSuffix.feminine, sign: "ª" } :
            { suffix: OrdinalSuffix.masculine, sign: "º" };
    }

    randomizeTime() {

        let result = [];
        let buffer = [];

        while(buffer.length < 6) {
            let hour = this.integerGenerator.randomize(0, 23);
            let minute = this.integerGenerator.randomize(0, 59);
            let time = this.formatTimeSpan(hour, minute);
            if(buffer.indexOf(time) === -1 && this.lastTimeValues.indexOf(time) === -1) {
                buffer.push(time);
                result.push({
                    q: [[time]],
                    a: [Time.spell(hour, minute)]
                });
            }
        }

        this.lastTimeValues = buffer;
        
        return result.sort((a, b) => a.q[0][0].localeCompare(b.q[0][0]));
    }

    formatTimeSpan(hour, minute) {
        return (hour < 10 ? "0" : "") + hour + ":" + (minute < 10 ? "0" : "") + minute;
    }
}

export default NumeralGenerator;