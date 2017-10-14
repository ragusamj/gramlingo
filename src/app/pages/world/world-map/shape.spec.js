import test from "tape";
import Shape from "./shape";

test("Shape should calculate if a point is inside of a polygon", (t) => {
    t.true(Shape.inside([5,5], [[0,0],[10,0],[10,10],[0,10],[0,0]]));
    t.end();
});

test("Polygon should calculate if a point is outside of a polygon", (t) => {
    t.false(Shape.inside([11,0], [[0,0],[10,0],[10,10],[0,10],[0,0]]));
    t.end();
});

test("Shape should find the largest polygon in an array", (t) => {
    let polygons = [
        [[1,1],[2,2],[3,3]],
        [[1,1],[2,2]],
        [[1,1],[2,2],[3,3],[4,4]]
    ];
    t.equal(Shape.max(polygons), polygons[2]);
    t.end();
});