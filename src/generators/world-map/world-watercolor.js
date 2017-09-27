let fs = require("fs");
let mapshaper = require("mapshaper");

let root = "naturalearth/ne_50m_admin_0_countries/ne_50m_admin_0_countries";

let input = {
    "countries.dbf": fs.readFileSync(root + ".dbf"),
    "countries.prj": fs.readFileSync(root + ".prj"),
    "countries.shp": fs.readFileSync(root + ".shp")
};

function getCountries(data) {

    let countries = {};
    let geojson = JSON.parse(data);

    geojson.features.forEach(function(feature) {

        let iso = feature.properties.iso_a2;
        countries[iso] = {
            polygons: [],
            properties: feature.properties
        };

        function recurse(geometryData) {
            if(Array.isArray(geometryData) && Array.isArray(geometryData[0][0])) {
                geometryData.forEach(function(item) {
                    recurse(item);
                });
            }
            else {
                let polygon = [];
                geometryData.forEach(function(point) {
                    polygon.push({ x: point[0], y: point[1] });
                });
                countries[iso].polygons.push(polygon);
            }
        }
        recurse(feature.geometry.coordinates);
    });

    return countries;
}

function getBounds(countries) {

    let bounds = { ymin: 0, xmin: 0, ymax: 0, xmax: 0 };

    Object.keys(countries).forEach(function(iso) {
        countries[iso].polygons.forEach(function(polygon) {
            polygon.forEach(function(point) {
                bounds.xmin = Math.min(bounds.xmin, point.x);
                bounds.ymin = Math.min(bounds.ymin, point.y);
                bounds.xmax = Math.max(bounds.xmax, point.x);
                bounds.ymax = Math.max(bounds.ymax, point.y);
            });
        });
    });

    bounds.width = (bounds.xmin * -1) + bounds.xmax;
    bounds.height = (bounds.ymin * -1) + bounds.ymax;
    bounds.ratio = bounds.width / bounds.height;

    return bounds;
}

function createMap(data, width) {

    let countries = getCountries(data);
    let bounds = getBounds(countries);
    let scale = bounds.width / width;

    Object.keys(countries).forEach(function(iso) {
        countries[iso].polygons.forEach(function(polygon) {
            polygon.forEach(function(point) {
                point.xGridAligned = (((bounds.xmin) - point.x) / scale) * -1;
                point.yGridAligned = (bounds.ymax - point.y) / scale;
                point.xPixel = Math.floor(point.xGridAligned);
                point.yPixel = Math.floor(point.yGridAligned);
            });
        });
    });

    return {
        bounds: bounds,
        countries: countries,
        image: {
            width: width,
            height: Math.floor(width / bounds.ratio)
        },
        scale: scale
    };
}

function randomize(min, max) {
    return min + Math.random() * (max - min);
}

function getRandomColor() {
    let h = randomize(0, 350);
    let s = randomize(70, 100);
    let l = randomize(30, 60);
    return "hsl(" + h + "," + s + "%," + l + "%)";
}

function draw(map) {

    let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 " + map.image.width + " " + map.image.height + "\">";
    let cache = {};

    Object.keys(map.countries).forEach(function(iso) {
        svg += "<g id=\"" + iso + "\">";
        map.countries[iso].polygons.forEach(function(polygon) {
            svg += "<g fill=\"" + getRandomColor() + "\" opacity=\"0.5\">";
            polygon.forEach(function(point) {
                if(!cache[point.xPixel + "X" + point.yPixel]) {
                    svg += "<circle cx=\"" + point.xPixel + "\" cy=\"" + point.yPixel + "\" r=\"1.8\"/>";
                    cache[point.xPixel + "X" + point.yPixel] = point;
                }
            });
            svg += "</g>";
        });
        svg += "</g>";
    });

    return svg + "</svg>";
}

mapshaper.applyCommands("-i countries.shp -filter '\"AQ\".indexOf(iso_a2) === -1' -proj robin -o format=geojson", input, function(err, output) {
    let map = createMap(output["countries.json"], 256);
    let svg = draw(map);
    process.stdout.write(svg);
});