import test from "tape";
import Polygon from "./polygon";

test("Polygon should return true for a plain polygon", (t) => {
    t.true(Polygon.isPlain([[0,0],[1,1]]));
    t.end();
});

test("Polygon should return true for a isGeoJSON polygon", (t) => {
    t.true(Polygon.isGeoJSON([[[0,0],[1,1]]]));
    t.end();
});

test("Polygon should return false for arrays not containg any points", (t) => {
    t.false(Polygon.isPlain([]));
    t.end();
});