class Path {

    constructor(neighbors, startIndex) {
        this.values = this.plot(neighbors, startIndex || 0);
    }

    plot(neighbors, startIndex) {
        const path = [];
        const cache = {};
        this.addNeighborsToPath(neighbors, startIndex, cache, path);
        this.addWithoutNeighborsToPath(neighbors, cache, path);
        return path;
    }

    addNeighborsToPath(neighbors, index, cache, path) {
        for(let neighbor of neighbors[index]) {
            if(!cache[neighbor]) {
                cache[neighbor] = true;
                path.push(neighbor);
                this.addNeighborsToPath(neighbors, neighbor, cache, path);
            }
        }
    }

    addWithoutNeighborsToPath(neighbors, cache, path) {
        for(let i = 0; i < neighbors.length; i++) {
            if(!cache[i]) {
                path.unshift(i);
            }
        }
    }
}

export default Path;