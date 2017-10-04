const d3GeoProjection = require("d3-geo-projection");
const shapefile = require("shapefile");

const shp = __dirname + "/naturalearth/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp";

function randomize(min, max) {
    return min + Math.random() * (max - min);
}

function getRandomColor() {
    let h = randomize(0, 350);
    let s = randomize(70, 100);
    let l = randomize(30, 60);
    return "hsl(" + h + "," + s + "%," + l + "%)";
}

shapefile
    .read(shp)
    .then((geojson) => {

        let height = 512;
        let width = 1024;

        let projected = d3GeoProjection.geoProject(geojson, d3GeoProjection.geoRobinson());

        let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 " + width + " " + height + "\">";
        let cache = {};

        projected.features.forEach(function(feature) {
                
            svg += "<g id=\"" + feature.properties.iso_a2 + "\">";
            function recurse(geometryData) {
                if(Array.isArray(geometryData) && Array.isArray(geometryData[0][0])) {
                    geometryData.forEach(function(item) {
                        recurse(item);
                    });
                }
                else {
                    svg += "<g fill=\"" + getRandomColor() + "\" opacity=\"0.5\">";
                    geometryData.forEach(function(point) {
                        if(!cache[point[0] + "X" + point[1]]) {
                            svg += "<circle cx=\"" + point[0] + "\" cy=\"" + point[1] + "\" r=\"6.5\"/>";
                            cache[point[0] + "X" + point[1]] = point;
                        }
                    });
                    svg += "</g>";
                }
            }
            recurse(feature.geometry.coordinates);
            svg += "</g>";
        });

        svg += "</svg>";
        process.stdout.write(svg);

    })
    .catch(error => process.stderr.write(error.stack));