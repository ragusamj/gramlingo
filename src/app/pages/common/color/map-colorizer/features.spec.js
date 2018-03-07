import test from "tape";
import BoundingBox from "./bounding-box";
import Features from "./features";

test("Features should map GeoJson", (t) => {
    const features = new Features({
        features: [
            { geometry: { type: "Polygon", coordinates: [[[0,0], [5,0], [0,5], [0,0]]]} },
            { geometry: { type: "MultiPolygon", coordinates: [[[[14,9], [14,14], [9, 14], [14,9]]]]} }
        ]
    }, BoundingBox);

    t.deepEqual(features.values, [
        {
            index: 0,
            shapes: [{ y1: 0, x1: 0, y2: 5, x2: 5 }]
        },
        { 
            index: 1, 
            shapes: [{ y1: 9, x1: 9, y2: 14, x2: 14 }]
        }
    ]);

    t.end();
});

test("Features should map plain polygons", (t) => {
    const features = new Features([[[0,0], [5,0], [0,5], [0,0]]], BoundingBox);

    t.deepEqual(features.values, [
        {
            index: 0,
            shapes: [{ y1: 0, x1: 0, y2: 5, x2: 5 }]
        }
    ]);

    t.end();
});
