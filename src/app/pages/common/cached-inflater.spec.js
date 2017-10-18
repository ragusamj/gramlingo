import sinon from "sinon";
import test from "tape";
import CachedInflater from "./cached-inflater";

const mockJSON = ["a","b"];
const mockInflatedData = { a: "b" };

const http = {
    getJSON: sinon.stub().yields(mockJSON)
};

const popup = {
    show: sinon.stub(),
    progress: sinon.stub(),
    hide: sinon.stub()
};

const inflater = {
    inflate: sinon.stub().returns(mockInflatedData)
};

test("CachedInflater should inflate the data", (t) => {
    t.plan(1);
    let cachedInflater = new CachedInflater(http, popup);

    cachedInflater.get("/data/file.json", inflater, "key", (data) => {
        t.equal(data, mockInflatedData);
    });

    t.end();
});

test("CachedInflater should cache the inflated data", (t) => {
    t.plan(3);
    let cachedInflater = new CachedInflater(http, popup);

    cachedInflater.get("/data/file.json", inflater, "key", (data) => {
        t.equal(data, mockInflatedData);
    });

    http.getJSON.resetHistory();
    cachedInflater.get("/data/file.json", inflater, "key", (data) => {
        t.equal(data, mockInflatedData);
        t.false(http.getJSON.called);
    });

    t.end();
});

test("CachedInflater should show the loader popup", (t) => {
    t.plan(1);
    let cachedInflater = new CachedInflater(http, popup);
    popup.show.resetHistory();

    cachedInflater.get("/data/file.json", inflater, "key", (/*data*/) => {
        t.true(popup.show.calledWith("key"));
    });

    t.end();
});

test("CachedInflater should hide the loader popup", (t) => {
    t.plan(1);
    let cachedInflater = new CachedInflater(http, popup);
    popup.hide.resetHistory();

    cachedInflater.get("/data/file.json", inflater, "key", (/*data*/) => {
        t.true(popup.hide.called);
    });

    t.end();
});

test("CachedInflater should start progress at 0%", (t) => {
    t.plan(1);
    let cachedInflater = new CachedInflater(http, popup);
    popup.progress.resetHistory();

    cachedInflater.get("/data/file.json", inflater, "key", (/*data*/) => {
        t.true(popup.progress.calledWith(0));
    });

    t.end();
});

test("CachedInflater should show incremental progress", (t) => {
    
    let cachedInflater = new CachedInflater(http, popup);
    popup.progress.resetHistory();
    
    cachedInflater.get("/data/file.json", inflater, "key", (/*data*/) => {
        http.getJSON.callArgWith(2, 123, 456);
        t.true(popup.progress.calledWith(0));
    });
    
    t.end();
});
