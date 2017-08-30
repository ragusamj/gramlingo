class IntegerGenerator {

    random() {
        return Math.random();
    }

    range(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }
}

export default IntegerGenerator;