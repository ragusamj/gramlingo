import ngram from "./n-gram";

export default (a, b) => {

    a = a ? a.toUpperCase() : "";
    b = b ? b.toUpperCase() : "";

    if (a === b) {
        return 1;
    }

    if (a.length < 2 && b.length < 2) {
        return 0;
    }

    let left = new Set(ngram(a, 2));
    let right = new Set(ngram(b, 2));

    let intersection = [...left].filter(x => right.has(x));

    return intersection.length / (left.size + right.size) * 2;
};
