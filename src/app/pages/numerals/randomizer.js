import Integer from "./spelling/integers/integer";

class Randomizer {

    getNumbers() {

        let result = [];
        let now = new Date();
        let numbers = [
            this.getRandomNumber(1, 29),
            this.getRandomNumber(30, 100),
            this.getRandomNumber(100, 1000),
            this.getRandomNumber(now.getFullYear() - 300, now.getFullYear() + 50),
            this.getRandomNumber(10000, 100000),
            this.getRandomNumber(100000, 1000000)
        ];

        this.shuffleArray(numbers);

        for (var number of numbers) {
            result.push({
                q: [[number]],
                a: [[Integer.spell(number)]]
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

export default Randomizer;