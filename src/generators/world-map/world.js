const d3GeoProjection = require("d3-geo-projection");
const shapefile = require("shapefile");
const topojsonClient = require("topojson-client");
const topojsonServer = require("topojson-server");
const topojsonSimplify = require("topojson-simplify");

const shp = __dirname + "/naturalearth/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp";
const height = 810;
const width = 1600;
const quantization = 1e3; // powers of ten, 1e4, 1e5, 1e6...
const simplificationMinWeight = 0.00000001;

shapefile
    .read(shp)
    .then((geojson) => {

        let projection = d3GeoProjection.geoRobinson().fitSize([width, height], geojson);
        let projected = d3GeoProjection.geoProject(geojson, projection);
        let topology = topojsonServer.topology({ world: projected }, quantization);
        let transform = topology.transform;
        let presimplified = topojsonSimplify.presimplify(topology, topology.planarTriangleArea);
        let simplified = topojsonSimplify.simplify(presimplified, simplificationMinWeight);
        let quantized = topojsonClient.quantize(simplified, transform);

        for(let geometry of quantized.objects.world.geometries) {
            let id = geometry.properties.iso_a2;
            geometry.properties = {
                id: id
            };
        }

        process.stdout.write(JSON.stringify(quantized, null, 2) + "\n");
    })
    .catch(error => process.stderr.write(error.stack));