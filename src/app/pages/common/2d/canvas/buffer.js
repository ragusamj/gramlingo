import earcut from "earcut";
import Color from "../../color";

const pointSize = 2;

class Buffer {

    static create(geometries) {
        const buffer = { data: [], byColor: {} };
        const geometriesByColor = this.sortByColor(geometries);

        this.bufferByColor = {};
        
        for(let color of Object.keys(geometriesByColor)) {
            const offset = buffer.data.length;
            for(let geometry of geometriesByColor[color]) {
                if(geometry.type === "Polygon") {
                    this.triangulate(geometry.polygons, buffer.data);
                }
                if(geometry.type === "MultiPolygon") {
                    for(let polygons of geometry.polygons) {
                        this.triangulate(polygons, buffer.data);
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

    static sortByColor(geometries) {
        const sorted = {};
        for(let geometry of geometries) {
            sorted[geometry.color] = sorted[geometry.color] || [];
            sorted[geometry.color].push(geometry);
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