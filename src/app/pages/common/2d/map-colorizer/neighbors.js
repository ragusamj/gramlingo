class Neighbors {

    constructor(features) {
        this.values = this.intersect(features);
    }

    intersect(features) {
        return features.map((feature) => {
            const neighbors = [];
            for(const shape of feature.shapes) {
                for(const nfeature of feature.possibleNeighbors) {
                    for(const nshape of nfeature.shapes) {
                        if(nfeature.index !== feature.index && neighbors.indexOf(nfeature.index) === -1 && nshape.intersects(shape)) {
                            neighbors.push(nfeature.index);
                        }
                    }
                }
            }
            return neighbors;
        });
    }
}

export default Neighbors;