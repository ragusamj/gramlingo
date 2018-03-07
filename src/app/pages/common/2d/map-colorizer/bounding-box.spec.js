import test from "tape";
import BoundingBox from "./bounding-box";

test("BoundingBox should find the bounding box for a GeoJson polygon", (t) => {
    const bbox = new BoundingBox([[[0,0], [1,0], [0,2], [0,0]]]);
    t.equal(bbox.x1, 0);
    t.equal(bbox.x2, 1);
    t.equal(bbox.y1, 0);
    t.equal(bbox.y2, 2);
    t.end();
});

test("BoundingBox should find the bounding box for a plain polygon", (t) => {
    const bbox = new BoundingBox([[0,0], [1,0], [0,2], [0,0]]);
    t.equal(bbox.x1, 0);
    t.equal(bbox.x2, 1);
    t.equal(bbox.y1, 0);
    t.equal(bbox.y2, 2);
    t.end();
});

test("BoundingBox should do nothing with an array without points", (t) => {
    const bbox = new BoundingBox([1, 2, 3, 4]);
    t.equal(bbox.x1, Infinity);
    t.equal(bbox.x2, -Infinity);
    t.equal(bbox.y1, Infinity);
    t.equal(bbox.y2, -Infinity);
    t.end();
});

test("BoundingBox should do nothing with unknown objects", (t) => {
    const bbox = new BoundingBox("not a polygon");
    t.equal(bbox.x1, Infinity);
    t.equal(bbox.x2, -Infinity);
    t.equal(bbox.y1, Infinity);
    t.equal(bbox.y2, -Infinity);
    t.end();
});

//
// 0x0---------4x0
//  |          /
//  | 1 & 2  /
//  |      /
//  |    /
//  |  /
//  |/
// 0x4
//
test("BoundingBox should intersect and return true for two boxes with the exact same edges", (t) => {
    const bbox1 = new BoundingBox([[0,0], [4,0], [0,4], [0,0]]);
    const bbox2 = new BoundingBox([[0,0], [4,0], [0,4], [0,0]]);
    t.true(bbox1.intersects(bbox2));
    t.end();
});

//
// 0x0---------4x0
//  |    1     /
//  |        /
//  |  2x2-/-------6x0
//  |   |/         /
//  |  /|    2   /
//  |/  |      /
// 0x4  |    /
//      |  /
//      |/
//     2x6
//
test("BoundingBox should intersect and return true for two boxes that overlap", (t) => {
    const bbox1 = new BoundingBox([[0,0], [4,0], [0,4], [0,0]]);
    const bbox2 = new BoundingBox([[2,2], [6,0], [2,6], [2,2]]);
    t.true(bbox1.intersects(bbox2));
    t.end();
});

//
// 0x0---------4x0---------8x0
//   \          |          /
//     \    1   |   2    /
//       \      |      /
//         \    |    /
//           \  |  /
//             \|/
//             4x4
//
test("BoundingBox should intersect and return false for two boxes that share an edge", (t) => {
    const bbox1 = new BoundingBox([[0,0], [4,0], [4,4], [0,0]]);
    const bbox2 = new BoundingBox([[4,0], [8,0], [4,4], [4,0]]);
    t.false(bbox1.intersects(bbox2));
    t.end();
});


//
// 0x0---------4x0
//  |          /
//  |   1    /
//  |      /         6x2--------10x2
//  |    /            |          /
//  |  /              |   2    /
//  |/                |      /
// 0x4                |    /
//                    |  /
//                    |/
//                   6x6
//
test("BoundingBox should intersect and return false for two boxes that don't overlap or touch at all", (t) => {
    const bbox1 = new BoundingBox([[0,0], [4,0], [0,4], [0,0]]);
    const bbox2 = new BoundingBox([[6,2], [10,2], [6,6], [6,2]]);
    t.false(bbox1.intersects(bbox2));
    t.end();
});
