import Path from "../shape/path";

class BacktrackingColorizer {

    constructor(neighbors, options) {

        options = options || {};
        this.numberOfColors = options.numberOfColors || 10;
        this.startIndexIslands = options.startIndexIslands || 0;
        this.maxAttempts = options.maxAttempts || neighbors.length * 100;

        const path = options.path || new Path(neighbors);

        this.attempts = 0;
        this.colors = [...Array(neighbors.length)];
        this.walk(path.values, neighbors, 0);
        this.colorCount = this.countColors();
    }

    walk(path, neighbors, index) {
        let feature = path[index];
        if(feature === undefined || neighbors[feature] === undefined) {
            this.solved  = true;
            return true;
        }
        if(++this.attempts >= this.maxAttempts) {
            this.solved  = false;
            return true;
        }
        if(neighbors[feature].length === 0) {
            this.startIndexIslands = this.startIndexIslands >= this.numberOfColors ? 0 : this.startIndexIslands;
            this.colors[feature] = this.startIndexIslands++;
            return this.walk(path, neighbors, index + 1);
        }
        for(let color = 0; color < this.numberOfColors; color++) {
            if(this.isFree(color, neighbors[feature])) {
                this.colors[feature] = color;
                if(this.walk(path, neighbors, index + 1)) {
                    return true;
                }
                this.colors[feature] = undefined;
            }
        }
        return false;
    }

    isFree(color, neighbors) {
        for(let neighbor of neighbors) {
            if(this.colors[neighbor] === color) {
                return false;
            }
        }
        return true;
    }

    countColors() {
        let colorCount = 0;
        for(let color of this.colors) {
            colorCount = Math.max(colorCount, color || 0);
        }
        return colorCount + 1;
    }
}

export default BacktrackingColorizer;