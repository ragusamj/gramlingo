import test from "tape";
import Shape from "./shape";

test("Shape should calculate the centroid of a polygon", (t) => {
    t.deepEqual(Shape.centroid([[0,0],[10,0],[10,10],[0,10],[0,0]]), [5,5]);
    t.end();
});

test("Shape should calculate if a point is inside of a polygon", (t) => {
    t.true(Shape.inside([5,5], [[0,0],[10,0],[10,10],[0,10],[0,0]]));
    t.end();
});

test("Polygon should calculate if a point is outside of a polygon", (t) => {
    t.false(Shape.inside([11,0], [[0,0],[10,0],[10,10],[0,10],[0,0]]));
    t.end();
});