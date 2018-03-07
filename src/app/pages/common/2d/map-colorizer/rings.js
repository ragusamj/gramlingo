import BoundingBoxes from "./bounding-boxes";
import Features from "./features";
import Neighbors from "./neighbors";
import Ring from "./ring";

class Rings {
    constructor(featureCollection) {
        const bboxes = new BoundingBoxes(featureCollection);
        const rings = new Features(featureCollection, Ring);
        let i = 0;
        for(const feature of rings.values) {
            feature.possibleNeighbors = bboxes.neighbors.values[i].map((n) => {
                return rings.values[n];
            });
            i++;
        }
        this.neighbors = new Neighbors(rings.values);
    }
}

export default Rings;