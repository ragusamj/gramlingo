let data = require("./data");
let topojson = require("topojson-client");

class GeoJson {
    static isArray(object) {
        return Array.isArray(object) &&
               Array.isArray(object[0]) &&
               Array.isArray(object[0][0]);
    }
}

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

class BoundingBox {

    constructor(object) {

        this.x1 = this.y1 = Infinity;
        this.x2 = this.y2 = -Infinity;

        if(GeoJson.isArray(object)) {
            for(let points of object) {
                this.reduce(points);
            }
        }
        else if (Array.isArray(object)) {
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

class Ring {

    constructor(object) {

        this.points = [];

        if(GeoJson.isArray(object)) {
            for(const points of object) {
                this.quantize(points);
            }
        }
        else if (Array.isArray(object)) {
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

class Features {

    constructor(values, strategy) {
        this.values = this.map(values.features, strategy);
    }

    map(features, strategy) {
        return features.map((f, i) => {
            const feature = {
                index: i,
                shapes: []
            };
            if(f.geometry.type === "Polygon") {
                feature.shapes.push(new strategy(f.geometry.coordinates));
            }
            if(f.geometry.type === "MultiPolygon") {
                for(const coordinates of f.geometry.coordinates) {
                    feature.shapes.push(new strategy(coordinates));
                }
            }
            return feature;
        });
    }
}

class BoundingBoxes {
    constructor(featureCollection) {
        const bboxes = new Features(featureCollection, BoundingBox);
        for(const feature of bboxes.values) {
            feature.possibleNeighbors = bboxes.values;
        }
        this.neighbors = new Neighbors(bboxes.values);
    }
}

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

class BacktrackingColorizer {
    constructor(neighbors, numberOfColors) {
        this.numberOfColors = numberOfColors;
        this.colors = [...Array(neighbors.length)];
        this.map(this.createPath(neighbors), neighbors, 0, "");
        this.colorCount = this.countColors();
    }

    map(path, neighbors, index, indent) {
        if(path[index] === undefined) {
            return true;
        }

        process.stdout.write(indent +"@" + path[index] + " (" + index + ") " + "\n");

        for(let color = 0; color < this.numberOfColors; color++) {
            if(this.isFree(color, neighbors[path[index]])) {
                process.stdout.write(indent + "Got color " + color + "\n");
                this.colors[path[index]] = color;

                if(this.map(path, neighbors, index + 1, indent + " ")) {
                    return true;
                }

                this.colors[path[index]] = undefined;
            }
        }

        process.stdout.write(indent + "Backtracking " + path[index] + " (" + index + ")\n");
        
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

    createPath(neighbors) {
        const path = [];
        const cache = {};
        this.addNeighborsToPath(neighbors, 0, cache, path);
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
                path.push(i);
            }
        }
    }

    countColors() {
        let colorCount = 0;
        for(let color of this.colors) {
            colorCount = Math.max(colorCount, color);
        }
        return colorCount + 1;
    }
}

let featureCollection = topojson.feature(data, data.objects.world);
let features = new Rings(featureCollection);
new BacktrackingColorizer(features.neighbors.values, 4);