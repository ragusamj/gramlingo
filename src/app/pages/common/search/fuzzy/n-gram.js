export default (value, n) => {
    let grams = [];
    for(let i = 0; i < value.length - 1; i++){
        grams[i] = value.slice(i, i + n);
    }
    return grams;
};