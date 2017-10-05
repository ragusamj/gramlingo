class Topojson {
    
    static transform(topology, arcs, coordinates) {
        for(let item of arcs) {
            if(Array.isArray(item)) {
                this.transform(topology, item, coordinates);
            }
            else {
                let buffer;
                if(item < 0) {
                    buffer = this.arcToCoordinates(topology, topology.arcs[~item]);
                    buffer.reverse();
                }
                else {
                    buffer = this.arcToCoordinates(topology, topology.arcs[item]);
                }
                coordinates.push(...buffer);
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
    
export default Topojson;
    