import test from "tape";
import BoundingBox from "./bounding-box";
import Neighbors from "./neighbors";

//
//   0x0----5x0 7x0-------14x0   16x0-------23x0-------30x0
//    |  0  /  /            |      |          |          |
//    |   /  /              |      |          |          |
//    | /  /                |      |          |          |
//   0x5 /                  |      |          |          |
//   0x7         1        14x7     |     3    |     4    |
//    |                   14x9     |          |          |
//    |                 / / |      |          |          |
//    |               / /   |      |          |          |
//    |             / /  2  |      |          |          |
//   0x14------7x14 9x14--14x14  16x14------23x14------30x14
//

test("Neighbors should list neighbors from features", (t) => {
    
    const features = [
        {
            index: 0,
            shapes: [new BoundingBox([[0,0], [5,0], [0,5], [0,0]])]
        },
        {
            index: 1,
            shapes: [new BoundingBox([[7,0], [14,0], [14,7], [7,14], [0,14], [0,7], [7,0]])]
        },
        {
            index: 2,
            shapes: [new BoundingBox([[14,9], [14,14], [9, 14], [14,9]])]
        },
        {
            index: 3,
            shapes: [new BoundingBox([[16,0], [23,0], [23,14], [16,14], [16,0]])]
        },
        {
            index: 4,
            shapes: [new BoundingBox([[23,0], [30,0], [30,14], [23,14], [23,0]])]
        }
    ];

    features[0].possibleNeighbors = features;
    features[1].possibleNeighbors = features;
    features[2].possibleNeighbors = features;
    features[3].possibleNeighbors = features;
    features[4].possibleNeighbors = features;

    const neighbors = new Neighbors(features);

    t.deepEqual(neighbors.values, [[1], [0, 2], [1], [], []]);
    t.end();
});

