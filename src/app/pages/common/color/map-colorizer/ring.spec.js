import test from "tape";
import Ring from "./ring";

test("Ring should quantize a GeoJson polygon", (t) => {
    const ring = new Ring([[[0.1, 0.002], [1.352, 0.11], [0.7214, 2], [0.1, 0.002]]]);
    t.deepEqual(ring.points, [[0, 0], [1, 0], [0, 2], [0, 0]]);
    t.end();
});

test("Ring should quantize a plain polygon", (t) => {
    const ring = new Ring([[0.1, 0.002], [1.352, 0.11], [0.7214, 2], [0.1, 0.002]]);
    t.deepEqual(ring.points, [[0, 0], [1, 0], [0, 2], [0, 0]]);
    t.end();
});

test("Ring should do nothing with an array without points", (t) => {
    const ring = new Ring([1, 2, 3, 4]);
    t.deepEqual(ring.points, []);
    t.end();
});

test("Ring should do nothing with unknown objects", (t) => {
    const ring = new Ring("not a polygon");
    t.deepEqual(ring.points, []);
    t.end();
});

test("Ring should intersect and return true for two polygons that touch at any point", (t) => {
    const ring1 = new Ring([[0,0], [1,0], [0,2], [0,0]]);
    const ring2 = new Ring([[1,0], [2,0], [2,2], [1,0]]);
    t.true(ring1.intersects(ring2));
    t.end();
});

test("Ring should intersect and return false for two polygons that don't touch at all", (t) => {
    const ring1 = new Ring([[0,0], [1,0], [0,2], [0,0]]);
    const ring2 = new Ring([[3,3], [4,3], [4,4], [3,3]]);
    t.false(ring1.intersects(ring2));
    t.end();
});
