import test from "tape";
import Topojson from "./topojson";

const topojson = {
    "transform": {
        "scale": [
            2,
            2
        ],
        "translate": [
            1,
            1
        ]
    },
    "objects": {
        "world": {
            "geometries": [{
                "arcs": [
                    [[0]],
                    [[-1]]
                ]
            }]
        }
    },
    "arcs": [
        [[1, 1], [2, 2], [3, -2]]
    ]
};

test("Topojson should transform the coordinates of an arc", (t) => {
    let coordinates = [];
    Topojson.transform(topojson, topojson.objects.world.geometries[0].arcs[0], coordinates);
    t.deepEqual(coordinates, [[3, 3], [7, 7], [13, 3]]);
    t.end();
});

test("Topojson should transform the coordinates of a reversed arc (negative index, ones' complement)", (t) => {
    let coordinates = [];
    Topojson.transform(topojson, topojson.objects.world.geometries[0].arcs[1], coordinates);
    t.deepEqual(coordinates, [[13, 3], [7, 7], [3, 3]]);
    t.end();
});