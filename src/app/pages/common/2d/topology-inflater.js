class TopologyInflater {

    static inflate(topology) {
        let geometries = [];
        for(let key of Object.keys(topology.objects)) {
            for(let geometry of topology.objects[key].geometries) {
                let inflated = this.inflateGeometry(topology, geometry);
                this.copyProperties(geometry, inflated);
                geometries.push(inflated);
            }
        }
        return geometries;
    }

    static inflateGeometry(topology, geometry) {
        let inflated = { polygons: [] };
        for(let arc of geometry.arcs) {
            if(geometry.type === "Polygon") {
                inflated.polygons.push(this.stitch(topology, arc));
            }
            if(geometry.type === "MultiPolygon") {
                let polygons = [];
                for(let multi of arc) {
                    polygons.push(this.stitch(topology, multi));
                }
                inflated.polygons.push(polygons);
            }
        }
        return inflated;
    }

    static stitch(topology, arc) {
        const polygon = [];
        for(let index of arc) {
            let coordinates = this.resolve(topology, index);
            polygon.push(...coordinates);
        }
        return polygon;
    }

    static resolve(topology, index) {
        let coordinates;
        if(index < 0) {
            coordinates = this.decodeArc(topology, topology.arcs[~index]);
            coordinates.reverse();
        }
        else {
            coordinates = this.decodeArc(topology, topology.arcs[index]);
        }
        return coordinates;
    }

    static decodeArc(topology, arc) {
        let x = 0, y = 0;
        return arc.map((point) => {
            return [
                (x += point[0]) * topology.transform.scale[0] + topology.transform.translate[0],
                (y += point[1]) * topology.transform.scale[1] + topology.transform.translate[1]
            ];
        });
    }

    static copyProperties(source, target) {
        target.type = source.type;
        for(let key of Object.keys(source.properties)) {
            target[key] = source.properties[key];
        }
    }
}
    
export default TopologyInflater;
    