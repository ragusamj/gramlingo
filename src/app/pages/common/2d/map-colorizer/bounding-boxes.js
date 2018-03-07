import BoundingBox from "./bounding-box";
import Features from "./features";
import Neighbors from "./neighbors";

class BoundingBoxes {
    constructor(polygons) {
        const bboxes = new Features(polygons, BoundingBox);
        for(const feature of bboxes.values) {
            feature.possibleNeighbors = bboxes.values;
        }
        this.neighbors = new Neighbors(bboxes.values);
    }
}

export default BoundingBoxes;