const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

class Polygon {

    static isGeoJSON(object) {
        return Array.isArray(object) && this.isPlain(object[0]);
    }

    static isPlain(object) {
        return Array.isArray(object) &&
               Array.isArray(object[0]) &&
               object[0].length === 2 &&
               isNumeric(object[0][0]) &&
               isNumeric(object[0][1]);
    }
}

export default Polygon;