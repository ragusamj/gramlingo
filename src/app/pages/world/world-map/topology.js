class Topology {

    static inflate(topology) {
        let geometries = [];
        for(let key of Object.keys(topology.objects)) {
            for(let geometry of topology.objects[key].geometries) {
                let polygons = [];
                for(let arcs of geometry.arcs) {
                    let polygon = [];
                    this.stitch(topology, arcs, polygon);
                    polygons.push(polygon);
                }
                let transformed = {
                    polygons: polygons
                };
                this.copy(geometry, transformed);
                geometries.push(transformed);
            }
        }
        return geometries;
    }

    static copy(geometry, transformed) {
        for(let key of Object.keys(geometry.properties)) {
            transformed[key] = geometry.properties[key];
        }
    }
    
    static stitch(topology, arcs, polygon) {
        for(let item of arcs) {
            if(Array.isArray(item)) {
                this.stitch(topology, item, polygon);
            }
            else {
                let coordinates;
                if(item < 0) {
                    coordinates = this.arcToCoordinates(topology, topology.arcs[~item]);
                    coordinates.reverse();
                }
                else {
                    coordinates = this.arcToCoordinates(topology, topology.arcs[item]);
                }
                polygon.push(...coordinates);
            }
        }
    }

    static arcToCoordinates(topology, arc) {
        let x = 0, y = 0;
        return arc.map(function(point) {
            return [
                (x += point[0]) * topology.transform.scale[0] + topology.transform.translate[0],
                (y += point[1]) * topology.transform.scale[1] + topology.transform.translate[1]
            ];
        });
    }
}
    
export default Topology;
    