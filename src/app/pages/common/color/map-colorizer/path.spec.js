import test from "tape";
import Path from "./path";

test("Path should plot a path for an array of neighbors", (t) => {
    const path = new Path([
        [1, 2],
        [0, 2],
        [0, 1]
    ]);
    t.deepEqual(path.values, [1, 0, 2]);
    t.end();
});

test("Path should add items without neighbors to the beginning of the path", (t) => {
    const path = new Path([
        [1, 2],
        [0, 2],
        [0, 1],
        []
    ]);
    t.deepEqual(path.values, [3, 1, 0, 2]);
    t.end();
});

test("Path should plot the path starting from the specified start index", (t) => {
    const path = new Path([
        [1, 2],
        [0, 2],
        [0, 1]
    ], 2);
    t.deepEqual(path.values, [0, 1, 2]);
    t.end();
});
