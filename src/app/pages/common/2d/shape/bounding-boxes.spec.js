import test from "tape";
import BoundingBoxes from "./bounding-boxes";

//
//   0x0----5x0 7x0-------14x0   16x0------------------30x0
//    |  0  /  /            |      |                  /  |
//    |   /  /              |      |                /    |
//    | /  /                |      |      3       /      |
//   0x5 /                  |      |            /        |
//   0x7         1        14x7     |          /          |
//    |                   14x9     |        /            |
//    |                 / / |      |      /              |
//    |               / /   |      |    /        4       |
//    |             / /  2  |      |  /                  |
//   0x14------7x14 9x14--14x14  16x14-----------------30x14
//

test("BoundingBoxes should consider all shapes neighbors, GeoJSON", (t) => {
    const bboxes = new BoundingBoxes({
        features: [
            { geometry: { type: "Polygon", coordinates: [[[0,0], [5,0], [0,5], [0,0]]]} },
            { geometry: { type: "Polygon", coordinates: [[[7,0], [14,0], [14,7], [7,14], [0,14], [0,7], [7,0]]]} },
            { geometry: { type: "Polygon", coordinates: [[[14,9], [14,14], [9, 14], [14,9]]]} },
            { geometry: { type: "Polygon", coordinates: [[[16,0], [30,0], [16,14], [16,0]]]} },
            { geometry: { type: "Polygon", coordinates: [[[30,0], [30,14], [16,14], [30,0]]]} }
        ]
    });
    t.deepEqual(bboxes.neighbors, { values: [[1], [0,2], [1], [4], [3]] });
    t.end();
});

test("BoundingBoxes should consider all shapes neighbors, plain polygons", (t) => {
    const bboxes = new BoundingBoxes([
        [[0,0], [5,0], [0,5], [0,0]],
        [[7,0], [14,0], [14,7], [7,14], [0,14], [0,7], [7,0]],
        [[14,9], [14,14], [9, 14], [14,9]],
        [[16,0], [30,0], [16,14], [16,0]],
        [[30,0], [30,14], [16,14], [30,0]]
    ]);
    t.deepEqual(bboxes.neighbors, { values: [[1], [0,2], [1], [4], [3]] });
    t.end();
});
