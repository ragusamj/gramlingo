import feature from "topojson-client/src/feature";
//import neighbors from "topojson-client/src/neighbors";

class TopologyInflater {

    static inflate(topology) {
        //console.log(neighbors(topology.objects.world.geometries));
        return feature(topology, topology.objects.world).features;
    }
}
    
export default TopologyInflater;
    