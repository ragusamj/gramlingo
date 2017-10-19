import test from "tape";
import TopologyInflater from "./topology-inflater";

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
                ],
                "properties": {
                    iso: "XX"
                }
            },
            {
                "arcs": [
                    [[2]]
                ],
                "properties": {
                    iso: "YY"
                }
            },
            {
                "arcs": [
                    [[0]],
                    [[1]]
                ],
                "properties": {
                    iso: "ZZ"
                }
            }]
        }
    },
    "arcs": [
        [[1, 1], [2, 2], [3, -2]],
        [[4, 4], [5, 5], [6, 6], [7, 7]],
        [[8, 8], [9, 9]]
    ]
};

test("Topology should inflate a topology into an array of geometries", (t) => {
    t.deepEqual(TopologyInflater.inflate(topojson), [
        {
            polygons: [[[3, 3], [7, 7], [13, 3]], [[13, 3], [7, 7], [3, 3]]],
            iso: "XX",
            max: [[3, 3], [7, 7], [13, 3]],
            centroid: [7.25, 4.75]
        },
        {
            polygons: [[[17, 17], [35, 35]]],
            iso: "YY",
            max: [[17, 17], [35, 35]],
            centroid: [17, 17]
        },
        { 
            polygons: [[[3, 3], [7, 7], [13, 3]], [[9, 9], [19, 19], [31, 31], [45, 45]]],
            iso: "ZZ",
            max: [[9, 9], [19, 19], [31, 31], [45, 45]],
            centroid: [9, 9]
        }
    ]);
    t.end();
});

test("Topology should stitch the coordinates of an arc", (t) => {
    let coordinates = [];
    TopologyInflater.stitch(topojson, topojson.objects.world.geometries[0].arcs[0], coordinates);
    t.deepEqual(coordinates, [[3, 3], [7, 7], [13, 3]]);
    t.end();
});

test("Topology should stitch the coordinates of a reversed arc (negative index, ones' complement)", (t) => {
    let coordinates = [];
    TopologyInflater.stitch(topojson, topojson.objects.world.geometries[0].arcs[1], coordinates);
    t.deepEqual(coordinates, [[13, 3], [7, 7], [3, 3]]);
    t.end();
});