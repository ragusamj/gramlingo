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
                    polygon.push({ xoriginal: point[0], yorignal: point[1] });
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

function calculateBounds(countries) {

    var bounds = { ymin: 0, xmin: 0, ymax: 0, xmax: 0 };

    Object.keys(countries).forEach(function(iso) {
        countries[iso].polygons.forEach(function(polygon) {
            polygon.forEach(function(point) {
                bounds.xmin = Math.min(bounds.xmin, point.xoriginal);
                bounds.ymin = Math.min(bounds.ymin, point.yorignal);
                bounds.xmax = Math.max(bounds.xmax, point.xoriginal);
                bounds.ymax = Math.max(bounds.ymax, point.yorignal);
            });
        });
    });

    bounds.width = (bounds.xmin * -1) + bounds.xmax;
    bounds.height = (bounds.ymin * -1) + bounds.ymax;
    bounds.ratio = bounds.width / bounds.height;

    return bounds;
}

function areEqual(pointA, pointB) {
    return pointA && pointB &&
           pointA.x === pointB.x &&
           pointA.y === pointB.y;
}

function dedupe(polygon) {
    var deduped = [];
    polygon.forEach(function(point) {
        var lastPoint = deduped[deduped.length - 1];
        if(!areEqual(lastPoint, point)) {
            deduped.push(point);
        }
    });
    return deduped;
}

function removeEmptyPixels(polygon) {
    var filledPixels = [];
    polygon.forEach(function(point, index) {
        var lastPoint = polygon[index - 1];
        var nextPoint = polygon[index + 1];
        if(!areEqual(lastPoint, nextPoint)) {
            filledPixels.push(point);
        }
    });
    return filledPixels;
}

function clean(polygon) {
    var deduped = dedupe(polygon);
    var filledPixels = removeEmptyPixels(deduped);
    return dedupe(filledPixels);
}

function isInside(point, polygon) {
    // Ray casting, http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i].x;
        var yi = polygon[i].y;
        var xj = polygon[j].x;
        var yj = polygon[j].y;
        if (((yi > point.y) !== (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    return inside;
}

function interpolate(polygon) {
    var interpolated = [];
    clean(polygon).forEach(function(point) {
        var lastPoint = interpolated[interpolated.length - 1];
        if(lastPoint && lastPoint.x !== point.x && lastPoint.y !== point.y) {
            var interpolatedY = {
                x: point.x,
                y: point.y + (lastPoint.y > point.y ? 1 : -1)
            };
            var interpolatedX = {
                x: point.x + (lastPoint.x > point.x ? 1 : -1),
                y: point.y
            };
            if(!isInside(interpolatedY, polygon)) {
                interpolated.push(interpolatedY);
            }
            else if(!isInside(interpolatedX, polygon)) {
                interpolated.push(interpolatedX);
            }
        }
        interpolated.push(point);
    });
    return clean(interpolated);
}

function offsetToGrid(point, bounds, scale) {
    return {
        x: Math.floor((((bounds.xmin) - point.xoriginal) / scale) * -1),
        y: Math.floor((bounds.ymax - point.yorignal) / scale)
    };
}

function createHVPath(polygon) {
    var hvPath = [];
    polygon.forEach(function(point, index) {
        var last = hvPath[index - 1];
        if(last) {
            if(last.x === point.x) {
                point.direction = "V";
            }
            if(last.y === point.y) {
                point.direction = "H";
            }
        }
        hvPath.push(point);
    });

    var shortenedPath = [];
    hvPath.forEach(function(point, index) {
        var nextPoint = hvPath[index + 1];
        if(nextPoint && nextPoint.direction !== point.direction) {
            shortenedPath.push(point);
        }
    });

    return shortenedPath;
}

function deleteEmptyPolygons(grid) {
    Object.keys(grid).forEach(function(iso) {
        var polygons = [];
        grid[iso].polygons.forEach(function(polygon) {
            if(polygon.length > 0) {
                polygons.push(polygon);
            }
        });
        grid[iso].polygons = polygons;
    });
}

function createGrid(countries, bounds, scale) {

    var grid = {};

    Object.keys(countries).forEach(function(iso) {
        grid[iso] = { polygons: [] };
        countries[iso].polygons.forEach(function(polygon) {
            var gridPolygon = [];
            polygon.forEach(function(point) {
                var gridPoint = offsetToGrid(point, bounds, scale);
                gridPolygon.push(gridPoint);
            });
            var interpolated = interpolate(gridPolygon);
            var path = createHVPath(interpolated);
            grid[iso].polygons.push(path);
        });
    });

    deleteEmptyPolygons(grid);

    return grid;
}

function createMap(data, width) {

    var countries = getCountries(data);
    var bounds = calculateBounds(countries);
    var scale = bounds.width / width;

    return {
        bounds: bounds,
        countries: countries,
        grid: createGrid(countries, bounds, scale),
        image: {
            width: width,
            height: Math.floor(width / bounds.ratio)
        },
        scale: scale
    };
}

function setIsEmpty(map) {
    Object.keys(map.countries).forEach(function(iso) {
        var count = 0;
        map.grid[iso].polygons.forEach(function(polygon) {
            if(polygon.length > 0) {
                count++;
            }
        });
        if(count === 0) {
            map.grid[iso].empty = true;
        }
    });
}

function drawPolygon(polygon, iso) {
    var markup = iso ?
        "    <path data-iso=\"" + iso + "\" d=\"M" :
        "        <path d=\"M";
    
    polygon.forEach(function(point, index) {
        if(index === 0) {
            markup += " " + point.x + " " + point.y;
        }
        else {
            if(point.direction === "V") {
                markup += "V" + point.y;
            }
            if(point.direction === "H") {
                markup += "H" + point.x;
            }
        }
    });
    markup += "Z\" />\n";
    return markup;
}

function draw(map) {

    setIsEmpty(map);

    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 " + map.image.width + " " + map.image.height + "\" id=\"worldmap\" fill=\"#444\" stroke=\"#f7f7f7\" stroke-width=\"0.1\">\n";

    Object.keys(map.countries).forEach(function(iso) {
        if(!map.grid[iso].empty) {
            var polygons = map.grid[iso].polygons;
            if(polygons.length > 1) {
                svg += "    <g data-iso=\"" + iso + "\">\n";
            }
            polygons.forEach(function(polygon) {
                if(polygon.length > 0) {
                    svg += drawPolygon(polygon, polygons.length === 1 ? iso : undefined);
                }
            });
            if(polygons.length > 1) {
                svg += "    </g>\n";
            }
        }
    });

    return svg + "</svg>";
}

mapshaper.applyCommands("-i countries.shp -filter '\"AQ\".indexOf(iso_a2) === -1' -filter-islands min-vertices=70 -proj robin -o format=geojson", input, function(error, output) {
    if(error) {
        throw new Error(error);
    }
    var map = createMap(output["countries.json"], 448);
    var svg = draw(map);
    process.stdout.write(svg);
});