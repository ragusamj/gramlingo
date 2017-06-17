import test from "tape";
import PathFinder from "./path-finder";

const routes = [
    {
        paths: ["/"],
        page: {},
        template: "/home-page.html"
    },
    {
        paths: ["/page", "/page/:id", "/page/:id/sub", "/page/:id/sub/:type"],
        page: {},
        template: "/page.html"
    },
    {
        paths: ["*"],
        page: {},
        template: "/error-404-page.html"
    }
];

test("PathFinder should get route for path", (t) => {
    let finder = new PathFinder(routes);
    t.deepEqual(finder.getRoute("/"), {page: {}, parameters: {}, path: "/", template: "/home-page.html"});
    t.end();
});

test("PathFinder should get error route (*) for unknown paths ", (t) => {
    let finder = new PathFinder(routes);
    t.deepEqual(finder.getRoute("/does-not-exist"), { page: {}, parameters: {}, path: "*", template: "/error-404-page.html" });
    t.end();
});

test("PathFinder should ignore undefined paths", (t) => {
    let finder = new PathFinder(routes);
    t.equal(finder.getRoute(undefined), undefined);
    t.end();
});

test("PathFinder should find path ending with parameter", (t) => {
    let finder = new PathFinder(routes);
    t.deepEqual(finder.getRoute("/page/123"), { page: {}, parameters: { id: "123" }, path: "/page/123", template: "/page.html" });
    t.end();
});

test("PathFinder should find path with parameter inside", (t) => {
    let finder = new PathFinder(routes);
    t.deepEqual(finder.getRoute("/page/123/sub"), { page: {}, parameters: { id: "123" }, path: "/page/123/sub", template: "/page.html" });
    t.end();
});

test("PathFinder should uri decode parameters", (t) => {
    let finder = new PathFinder(routes);
    t.deepEqual(finder.getRoute("/page/123/sub/white%20space"),
        { page: {}, parameters: { id: "123", type: "white space" }, path: "/page/123/sub/white%20space", template: "/page.html" });
    t.end();
});
