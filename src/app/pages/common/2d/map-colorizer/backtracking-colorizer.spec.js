import test from "tape";
import BacktrackingColorizer from "./backtracking-colorizer";
import Path from "./path";

test("BacktrackingColorizer should default to 10 without options.numberOfColors", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors);
    t.deepEqual(colorizer.numberOfColors, 10);
    t.end();
});

test("BacktrackingColorizer should use options.numberOfColors", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors, { numberOfColors: 3 });
    t.deepEqual(colorizer.numberOfColors, 3);
    t.end();
});

test("BacktrackingColorizer should default to 0 without options.startIndexIslands", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors);
    t.deepEqual(colorizer.startIndexIslands, 0);
    t.end();
});

test("BacktrackingColorizer should use options.startIndexIslands", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors, { startIndexIslands: 1 });
    t.deepEqual(colorizer.startIndexIslands, 1);
    t.end();
});

test("BacktrackingColorizer should default to the length of the neighbor matrix * 100 without options.maxAttempts", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors);
    t.deepEqual(colorizer.maxAttempts, 500);
    t.end();
});

test("BacktrackingColorizer should use options.maxAttempts", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors, { maxAttempts: 1000 });
    t.deepEqual(colorizer.maxAttempts, 1000);
    t.end();
});

test("BacktrackingColorizer should use options.path", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors, { path: new Path(neighbors, 1) });
    t.deepEqual(colorizer.colors, [0, 1, 0, 1, 0]);
    t.end();
});

test("BacktrackingColorizer should report the number of attempts", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors);
    t.equal(colorizer.attempts, 5);
    t.end();
});

test("BacktrackingColorizer should report the number of unique colors used", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors);
    t.equal(colorizer.colorCount, 2);
    t.end();
});

test("BacktrackingColorizer should stop if the max attempts limit is exceeded", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors, { maxAttempts: 3 });
    t.equal(colorizer.attempts, 3);
    t.end();
});

test("BacktrackingColorizer should colorize islands using a carousel with the available colors", (t) => {
    const neighbors = [[], [], [], [], [], [], [], []];
    const colorizer = new BacktrackingColorizer(neighbors, { numberOfColors: 4 });
    t.deepEqual(colorizer.colors, [3, 2, 1, 0, 3, 2, 1, 0]);
    t.end();
});

test("BacktrackingColorizer should colorize", (t) => {
    const neighbors = [[1], [0,2], [1], [4], [3]];
    const colorizer = new BacktrackingColorizer(neighbors);
    t.deepEqual(colorizer.colors, [1, 0, 1, 1, 0]);
    t.end();
});

test("BacktrackingColorizer should colorize countries of the world", (t) => {
    const neighbors = [[30,75,122,157,158,169],[33,112,175,34],[64,88,103,106,147],[121,138],[29,21,22,131,167],[10,58,75,162],[],[],[],[28,40,41,71,79,150],[5,75,162,58,135],[33,136,164],[55,97,117],[14,114,115,155],[13,31,59,104,114,155],[73,105],[64,103,134,147,162],[],[69,106,147],[96,98,127,135,166],[66,102],[4,22,29,124,131],[4,21,35,55,67,124,131,148,167,170],[111],[30,73],[112,174,175,176],[32,33,34,139,140,154],[168],[9,41,55,79],[4,21,124],[171,0,24,73,83,85,90,105,107,119,122,129,135,157],[14,59,60,92,104],[26,34,56,63,114,115,154],[1,11,26,34,136,140,164,165,175],[1,26,32,33,56],[22,46,123,124,170],[116,123],[],[39],[38],[9,41,127,149],[9,28,40,43,55,97,117,127],[48,51,145],[41],[70],[93,99,104,109,114,161],[35,124],[78,81,93],[42,51,139],[55,130],[98,135],[42,48,84,139,140,145,146],[118,135,151],[],[],[22,148,79,12,28,41,49,97],[32,34,63],[74],[5,10,135,162],[14,31,155],[31,62,92,104,141,143],[141],[60,141],[32,56],[2,16,103,162],[],[20,68,102,144],[22,148,170],[66,116,144],[18,71,79,106,147,150],[44],[9,69,134,147,149,150,166],[126,111],[15,24,30,105,119,122],[57],[0,5,10,76,122,158,162],[75,81,89,138,153,162],[],[47,81,91,132,153],[55,9,28,69,150],[],[47,76,78,132,138,153],[],[30,85,135,158,169],[51,140,146,164,165],[30,83,157,169],[90,156,171],[129],[2,103,147],[76,138],[30,86,105,156,171],[78,153],[31,60,143],[45,47,114,139,154,161],[],[174],[19,98,127,135],[12,41,55],[19,50,96,135],[45,109,137],[134,166],[],[20,66,168],[2,16,64,88],[14,31,45,60,109,114,141],[15,30,73,90,156],[2,18,69,147],[30,135],[110,152,164,174,175,176],[45,99,104,137,141],[108,164,175],[156,72,23],[1,25,174,175],[],[13,14,32,45,93,104,115,154],[13,32,114],[36,68],[12,41],[52,135,151],[30,73],[],[3,138,173],[0,30,73,75,157],[35,36],[21,22,29,35,46],[],[72],[19,40,41,96,135,149,166],[],[30,87,135],[49],[4,21,22],[78,81],[138],[16,71,100,147,166],[96,127,10,19,30,50,52,58,83,98,107,118,129,166],[11,33,164,165],[99,109],[3,76,81,89,121,133,173],[26,48,51,93,140,154],[26,33,51,84,139,165],[60,61,62,104,109],[],[60,92],[66,68],[42,51,146],[51,84,145],[2,16,18,69,71,88,106,134],[22,55,67],[40,71,127,166],[9,69,71,79],[52,118],[108,174],[76,78,81,91,162],[26,32,93,114,139],[13,14,59],[86,90,105,111],[0,30,85,122,169],[0,75,83,169],[],[170],[45,93],[5,10,58,75,76,153,16,64],[],[11,33,84,108,110,136,165,175],[33,84,136,140,164],[19,71,100,127,134,135,149],[4,22],[27,102],[0,83,85,157,158],[22,35,67,160],[30,86,90],[],[121,138],[25,95,108,112,152,176],[1,25,33,108,110,112,164,176],[25,108,174,175]];
    const colorizer = new BacktrackingColorizer(neighbors, {
        numberOfColors: 4,
        startIndexIslands: 0,
        maxAttempts: 5000,
        path: new Path(neighbors, 3)
    });
    t.deepEqual(colorizer.colors, [0, 1, 0, 1, 1, 0, 0, 3, 2, 1, 3, 1, 0, 0, 1, 1, 0, 1, 0, 2, 1, 2, 0, 1, 0, 1, 1, 1, 0, 0, 1, 2, 0, 0, 2, 2, 1, 0, 1, 0, 0, 2, 0, 0, 1, 1, 0, 1, 3, 0, 1, 1, 1, 3, 2, 1, 1, 1, 1, 0, 1, 0, 0, 2, 1, 1, 0, 2, 1, 1, 0, 0, 1, 2, 0, 1, 0, 0, 0, 2, 3, 3, 2, 2, 0, 0, 1, 0, 1, 1, 2, 2, 0, 0, 1, 0, 1, 3, 3, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 2, 1, 0, 0, 3, 2, 1, 0, 1, 2, 0, 2, 0, 3, 0, 1, 1, 0, 3, 0, 2, 1, 3, 1, 0, 2, 0, 2, 1, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3, 2, 3, 0, 1, 1, 3, 2, 3, 2, 3, 2, 0, 2, 2, 1, 3, 1, 1, 2, 0, 1, 1, 0, 0, 1, 2, 2, 3]);
    t.end();
});

test("BacktrackingColorizer should colorize swedish counties", (t) => {
    const neighbors = [[7,6],[3,6,7,18],[3,17,18],[1,2,7,8,17,18],[12,16,18,19],[11,13,14],[0,1,7,16,18],[0,1,3,6,8],[3,7,10,13,17],[],[8,11,13,15,17],[5,10,13,14,15],[4,16,19],[5,8,10,11],[5,11,15],[10,11,14,17],[4,6,12,18],[2,3,8,10,15],[1,2,3,4,6,16],[4,12,20],[19]];
    const colorizer = new BacktrackingColorizer(neighbors, {
        numberOfColors: 4,
        startIndexIslands: 0,
        maxAttempts: 5000,
        path: new Path(neighbors, 3)
    });
    t.deepEqual(colorizer.colors, [0, 0, 0, 1, 1, 1, 1, 2, 0, 0, 1, 0, 2, 2, 2, 3, 0, 2, 2, 0, 1]);
    t.end();
});
