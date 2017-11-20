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
                    [0],
                    [-1]
                ],
                "properties": {
                    id: "XX"
                },
                "type": "Polygon"
            },
            {
                "arcs": [
                    [1, 2]
                ],
                "properties": {
                    id: "YY"
                },
                "type": "Polygon"
            },
            {
                "arcs": [
                    [
                        [
                            [0]
                        ]
                    ],
                    [
                        [
                            [1]
                        ]
                    ]
                ],
                "properties": {
                    id: "ZZ"
                },
                "type": "MultiPolygon"
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
            id: "XX",
            polygons: [[[3, 3], [7, 7], [13, 3]], [[13, 3], [7, 7], [3, 3]]],
            type: "Polygon"
        },
        {
            id: "YY",
            polygons: [[[9, 9], [19, 19], [31, 31], [45, 45], [17, 17], [35, 35]]],
            type: "Polygon"
        },
        { 
            id: "ZZ",
            polygons: [[[[3, 3], [7, 7], [13, 3]]], [[[9, 9], [19, 19], [31, 31], [45, 45]]]],
            type: "MultiPolygon"
        }
    ]);
    t.end();
});

test("Topology should stitch the coordinates of an arc", (t) => {
    let coordinates = TopologyInflater.stitch(topojson, topojson.objects.world.geometries[0].arcs[0]);
    t.deepEqual(coordinates, [[3, 3], [7, 7], [13, 3]]);
    t.end();
});

test("Topology should stitch the coordinates of a reversed arc (negative index, ones' complement)", (t) => {
    let coordinates = TopologyInflater.stitch(topojson, topojson.objects.world.geometries[0].arcs[1]);
    t.deepEqual(coordinates, [[13, 3], [7, 7], [3, 3]]);
    t.end();
});