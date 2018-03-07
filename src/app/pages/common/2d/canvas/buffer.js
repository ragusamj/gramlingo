import earcut from "earcut";
import Color from "../../color/color";

const pointSize = 2;

class Buffer {

    static create(features) {
        const buffer = { data: [], byColor: {} };
        const featuresByColor = this.sortByColor(features);

        this.bufferByColor = {};
        
        for(let color of Object.keys(featuresByColor)) {
            const offset = buffer.data.length;
            for(let feature of featuresByColor[color]) {
                if(feature.geometry.type === "Polygon") {
                    this.triangulate(feature.geometry.coordinates, buffer.data);
                }
                if(feature.geometry.type === "MultiPolygon") {
                    for(let coordinates of feature.geometry.coordinates) {
                        this.triangulate(coordinates, buffer.data);
                    }
                }
            }
            buffer.byColor[color] = buffer.byColor[color] || {
                vec4: Color.vec4(color),
                length: (buffer.data.length - offset) / pointSize,
                offset: offset / pointSize
            };
        }

        return buffer;
    }

    static sortByColor(features) {
        const sorted = {};
        for(let feature of features) {
            sorted[feature.properties.color] = sorted[feature.properties.color] || [];
            sorted[feature.properties.color].push(feature);
        }
        return sorted;
    }

    static triangulate(polygons, data) {
        let points = earcut.flatten(polygons);
        let triangles = earcut(points.vertices, points.holes, points.dimensions);
        for(let t of triangles) {
            let i = t * pointSize;
            data.push(points.vertices[i], points.vertices[i + 1]);
        }
    }
}

export default Buffer;