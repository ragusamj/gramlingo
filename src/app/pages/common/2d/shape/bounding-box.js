import Polygon from "./polygon";

class BoundingBox {

    constructor(object) {

        this.x1 = this.y1 = Infinity;
        this.x2 = this.y2 = -Infinity;

        if(Polygon.isGeoJSON(object)) {
            for(let points of object) {
                this.reduce(points);
            }
        }
        else if (Polygon.isPlain(object)) {
            this.reduce(object);
        }
    }

    reduce(points) {
        for(const point of points) {
            this.x1 = Math.min(this.x1, point[0]);
            this.y1 = Math.min(this.y1, point[1]);
            this.x2 = Math.max(this.x2, point[0]);
            this.y2 = Math.max(this.y2, point[1]);
        }
    }

    intersects(other) {
        return this.x1 < other.x2 &&
               this.x2 > other.x1 &&
               this.y1 < other.y2 &&
               this.y2 > other.y1;
    }
}

export default BoundingBox;

