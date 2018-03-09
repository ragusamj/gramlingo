export default (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};