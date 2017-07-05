var fs = require("fs");
var mapshaper = require("mapshaper");

var root = "naturalearth/ne_50m_admin_0_countries/ne_50m_admin_0_countries";

var input = {
    "countries.dbf": fs.readFileSync(root + ".dbf"),
    "countries.prj": fs.readFileSync(root + ".prj"),
    "countries.shp": fs.readFileSync(root + ".shp")
};

function getCountries(data) {

    var countries = {};
    var geojson = JSON.parse(data);

    geojson.features.forEach(function(feature) {

        var iso = feature.properties.iso_a2;
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
                var polygon = [];
                geometryData.forEach(function(point) {
                    polygon.push({ x: point[0], y: point[1] });
                });
                countries[iso].polygons.push(polygon);
            }
        }
        if(feature.geometry) {
            recurse(feature.geometry.coordinates);
        }
    });

    return countries;
}

function getBounds(countries) {

    var bounds = { ymin: 0, xmin: 0, ymax: 0, xmax: 0 };

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

function cleanup(polygon) {

    var cleaned = [polygon[0]];

    polygon.forEach(function(point) {
        var lastPoint = cleaned[cleaned.length -1];
        var lastLastPoint = cleaned[cleaned.length -2];
        if(lastPoint && (lastPoint.xPixel !== point.xPixel || lastPoint.yPixel !== point.yPixel)) {
            cleaned.push(point);
        }
        if(lastLastPoint && lastLastPoint.xPixel === point.xPixel && lastLastPoint.yPixel === point.yPixel) {
            cleaned.length = cleaned.length - 2;
        }
    });

    return cleaned;
}

function interpolate(polygon) {
    var interpolated = [];
    cleanup(polygon).forEach(function(point) {
        var lastPoint = interpolated[interpolated.length -1];
        if(lastPoint && lastPoint.xPixel !== point.xPixel && lastPoint.yPixel !== point.yPixel) {
            var x = point.xPixel + (lastPoint.xPixel > point.xPixel ? 1 : -1);
            interpolated.push({xPixel: x, yPixel: point.yPixel});
        }
        interpolated.push(point);
    });
    return cleanup(interpolated);
}

function createMap(data, width) {

    var countries = getCountries(data);
    var bounds = getBounds(countries);
    var scale = bounds.width / width;

    Object.keys(countries).forEach(function(iso) {
        countries[iso].polygons.forEach(function(polygon) {
            polygon.forEach(function(point) {
                point.xPixel = Math.floor((((bounds.xmin) - point.x) / scale) * -1);
                point.yPixel = Math.floor((bounds.ymax - point.y) / scale);
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

function draw(map) {

    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 " + map.image.width + " " + map.image.height + "\">\n";
    svg += "    <g fill=\"#444\" stroke=\"#f7f7f7\" stroke-width=\"0.1\">\n";

    Object.keys(map.countries).forEach(function(iso) {
        svg += "        <g id=\"" + iso + "\">\n";
        map.countries[iso].polygons.forEach(function(polygon) {
            svg += "           <path d=\"M";
            var interpolated = interpolate(polygon);
            interpolated.forEach(function(point, index) {
                if(index + 1 === interpolated.length) {
                    svg += "Z\" />\n";
                }
                else {
                    var last = interpolated[index - 1];
                    if(last) {
                        if(last.xPixel === point.xPixel) {
                            svg += " V " + point.yPixel;
                        }
                        if(last.yPixel === point.yPixel) {
                            svg += " H " + point.xPixel;
                        }
                    }
                    else {
                        svg += " " + point.xPixel + " " + point.yPixel;
                    }
                }
            });
            
        });
        svg += "        </g>\n";
    });
    svg += "    </g>\n";

    return svg + "</svg>";
}

mapshaper.applyCommands("-i countries.shp -filter '\"AQ\".indexOf(iso_a2) === -1' -filter-islands min-vertices=70 -proj robin -o format=geojson", input, function(err, output) {
    var map = createMap(output["countries.json"], 256);
    var svg = draw(map);
    process.stdout.write(svg);
});