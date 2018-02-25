const fs = require("fs");

const d3GeoProjection = require("d3-geo-projection");
const topojsonClient = require("topojson-client");
const topojsonServer = require("topojson-server");
const topojsonSimplify = require("topojson-simplify");

const quantization = 1e3; // powers of ten, 1e4, 1e5, 1e6...
const simplificationMinWeight = 0.00000001;


fs.readFile(__dirname + "/geojson/sweden-counties.json", "utf8", (error, data) => {

    let geojson = JSON.parse(data);

    let projection = d3GeoProjection.geoWinkel3();
    let projected = d3GeoProjection.geoProject(geojson, projection);
    let topology = topojsonServer.topology({ items: projected }, quantization);
    let transform = topology.transform;
    let presimplified = topojsonSimplify.presimplify(topology, topology.planarTriangleArea);
    let simplified = topojsonSimplify.simplify(presimplified, simplificationMinWeight);
    let quantized = topojsonClient.quantize(simplified, transform);

    for(let geometry of quantized.objects.items.geometries) {
        let id = geometry.properties.name;
        geometry.properties = {
            id: id
        };
    }

    process.stdout.write("this.geojson = " + JSON.stringify(quantized, null, 2) + "\n");
});