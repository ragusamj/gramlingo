import Polygon from "./polygon";

class Ring {

    constructor(object) {

        this.points = [];

        if(Polygon.isGeoJSON(object)) {
            for(const points of object) {
                this.quantize(points);
            }
        }
        else if (Polygon.isPlain(object)) {
            this.quantize(object);
        }
    }

    quantize(points) {
        for(const point of points) {
            this.points.push([
                Math.floor(point[0]),
                Math.floor(point[1])
            ]);
        }
    }

    intersects(other) {
        for(const t of this.points) {
            for(const o of other.points) {
                if(t[0] === o[0] && t[1] === o[1]) {
                    return true;
                }
            }
        }
        return false;
    }
}

export default Ring;