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
            "type": "GeometryCollection",
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

    t.deepEqual(TopologyInflater.inflate(topojson, { key: "world" }), {
        neighbors: [[0, 2], [2], [0, 1]],
        features: [
            {
                "type": "Feature",
                "properties": { "id": "XX" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ [[3,3],[7,7],[13,3],[3,3]], [[13,3],[7,7],[3,3],[13,3]] ]
                }
            },
            {
                "type": "Feature",
                "properties": { "id": "YY" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ [[9,9],[19,19],[31,31],[17,17],[35,35]] ]
                }
            },
            {
                "type": "Feature",
                "properties": { "id": "ZZ" },
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": [ [ [[3,3],[7,7],[13,3],[3,3]] ], [ [[9,9],[19,19],[31,31],[45,45]] ] ]
                }
            }
        ]
    });

    t.end();
});
