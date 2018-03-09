import IsNumeric from "../../is-numeric";

class Polygon {

    static inside(point, polygon) {
        // Ray casting, http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i][0];
            let yi = polygon[i][1];
            let xj = polygon[j][0];
            let yj = polygon[j][1];
            if (((yi > point[1]) !== (yj > point[1])) && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        return inside;
    }

    static isGeoJSON(object) {
        return Array.isArray(object) && this.isPlain(object[0]);
    }

    static isPlain(object) {
        return Array.isArray(object) &&
               Array.isArray(object[0]) &&
               object[0].length === 2 &&
               IsNumeric(object[0][0]) &&
               IsNumeric(object[0][1]);
    }
}

export default Polygon;