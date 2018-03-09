import feature from "topojson-client/src/feature";
import neighbors from "topojson-client/src/neighbors";

class WorldInflater {

    static inflate(topology) {
        return {
            bbox: topology.bbox,
            neighbors: neighbors(topology.objects.world.geometries),
            features: feature(topology, topology.objects.world).features
        };
    }
}
    
export default WorldInflater;
    