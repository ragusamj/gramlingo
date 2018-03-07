import feature from "topojson-client/src/feature";
import neighbors from "topojson-client/src/neighbors";

class TopologyInflater {

    static inflate(topology, options) {
        const objects = topology.objects[options.key];
        return {
            neighbors: neighbors(objects.geometries),
            features: feature(topology, objects).features
        };
    }
}
    
export default TopologyInflater;
    