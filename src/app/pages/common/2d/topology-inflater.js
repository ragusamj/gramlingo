import polylabel from "polylabel";
import Shape from "./shape";

class TopologyInflater {

    static inflate(topology) {
        let geometries = [];
        for(let key of Object.keys(topology.objects)) {
            for(let item of topology.objects[key].geometries) {
                let geometry = this.inflateGeometry(topology, item);
                geometries.push(geometry);
            }
        }
        return geometries;
    }

    static inflateGeometry(topology, item) {
        let geometry = { polygons: [] };
        this.inflateArcs(geometry, topology, item);
        this.addProperties(geometry, item);
        return geometry;
    }

    static inflateArcs(geometry, topology, item) {
        for(let arcs of item.arcs) {
            let polygon = [];
            this.recurse(topology, arcs, polygon);
            geometry.polygons.push(polygon);
        }
    }
    
    static recurse(topology, arcs, polygon) {
        for(let item of arcs) {
            if(Array.isArray(item)) {
                this.recurse(topology, item, polygon);
            }
            else {
                this.stitch(topology, item, polygon);
            }
        }
    }

    static stitch(topology, index, polygon) {
        let coordinates;
        if(index < 0) {
            coordinates = this.arcToCoordinates(topology, topology.arcs[~index]);
            coordinates.reverse();
        }
        else {
            coordinates = this.arcToCoordinates(topology, topology.arcs[index]);
        }
        polygon.push(...coordinates);
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

    static addProperties(geometry, item) {
        geometry.max = Shape.max(geometry.polygons);
        geometry.centroid = polylabel([geometry.max], 0.5);
        for(let key of Object.keys(item.properties)) {
            geometry[key] = item.properties[key];
        }
    }
}
    
export default TopologyInflater;
    