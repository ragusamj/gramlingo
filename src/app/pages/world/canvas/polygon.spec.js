import test from "tape";
import Polygon from "./polygon";

test("Polygon should calculate the centroid of a shape", (t) => {
    t.deepEqual(Polygon.centroid([[0,0],[10,0],[10,10],[0,10],[0,0]]), [5,5]);
    t.end();
});

test("Polygon should calculate if a point is inside of a shape", (t) => {
    t.true(Polygon.inside([5,5], [[0,0],[10,0],[10,10],[0,10],[0,0]]));
    t.end();
});

test("Polygon should calculate if a point is outside of a shape", (t) => {
    t.false(Polygon.inside([11,0], [[0,0],[10,0],[10,10],[0,10],[0,0]]));
    t.end();
});