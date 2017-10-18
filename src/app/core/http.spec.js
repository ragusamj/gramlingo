import sinon from "sinon";
import test from "tape";
import Http from "./http";

const http = new Http();
const mockProgressEvent = { loaded: 256 };

class MockXMLHttpRequest {
    constructor() {
        this.addEventListener = sinon.stub();
        this.getResponseHeader = sinon.stub().returns(5678);
        this.open = sinon.stub();
        this.overrideMimeType = sinon.stub();
        this.send = sinon.stub();
    }
}

test("Http should get HTML and listen to progress events", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;
    let xhr = http.getHTML("http://snapgram.net", () => {/**/}, () => {/**/});
    t.true(xhr.addEventListener.calledWith("progress"));
    t.end();
});

test("Http should get HTML and open url with GET", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;
    let xhr = http.getHTML("http://snapgram.net", () => {/**/}, () => {/**/});
    t.true(xhr.open.calledWith("GET", "http://snapgram.net"));
    t.end();
});

test("Http should get HTML and send request", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;
    let xhr = http.getHTML("http://snapgram.net", () => {/**/}, () => {/**/});
    t.true(xhr.send.called);
    t.end();
});

test("Http should get HTML and callback with data", (t) => {
    t.plan(1);
    global.XMLHttpRequest = MockXMLHttpRequest;

    let xhr = http.getHTML("http://snapgram.net", (data) => {
        t.equal(data, "data");
    }, () => {/**/});

    xhr.readyState = http.ReadyState.DONE;
    xhr.status = http.State.OK;
    xhr.responseText = "data";
    xhr.onreadystatechange();
});

test("Http should get HTML and callback with data only if status is ok", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;

    let xhr = http.getHTML("http://snapgram.net", () => {
        t.fail();
    }, () => {/**/});

    xhr.readyState = http.ReadyState.DONE;
    xhr.status = http.State.NOT_FOUND;
    xhr.onreadystatechange();

    t.end();
});

test("Http should get JSON and listen to progress events", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;
    let xhr = http.getJSON("http://snapgram.net", () => {/**/}, () => {/**/});
    t.true(xhr.addEventListener.calledWith("progress"));
    t.end();
});

test("Http should get JSON and set mime type", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;
    let xhr = http.getJSON("http://snapgram.net", () => {/**/}, () => {/**/});
    t.true(xhr.overrideMimeType.calledWith("application/json"));
    t.end();
});

test("Http should get JSON and open url with GET", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;
    let xhr = http.getJSON("http://snapgram.net", () => {/**/}, () => {/**/});
    t.true(xhr.open.calledWith("GET", "http://snapgram.net"));
    t.end();
});

test("Http should get JSON and send request", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;
    let xhr = http.getJSON("http://snapgram.net", () => {/**/}, () => {/**/});
    t.true(xhr.send.called);
    t.end();
});

test("Http should get JSON and callback with parsed object", (t) => {
    t.plan(1);
    global.XMLHttpRequest = MockXMLHttpRequest;

    let xhr = http.getJSON("http://snapgram.net", (data) => {
        t.deepEqual(data, ["data"]);
    }, () => {/**/});

    xhr.readyState = http.ReadyState.DONE;
    xhr.status = http.State.OK;
    xhr.responseText = "[\"data\"]";
    xhr.onreadystatechange();
});

test("Http should get JSON and callback with data only if status is ok", (t) => {
    global.XMLHttpRequest = MockXMLHttpRequest;

    let xhr = http.getJSON("http://snapgram.net", () => {
        t.fail();
    }, () => {/**/});

    xhr.readyState = http.ReadyState.DONE;
    xhr.status = http.State.NOT_FOUND;
    xhr.onreadystatechange();

    t.end();
});

test("Http should get JSON and call the progress callback with the number of loaded bytes and the total file size", (t) => {
    t.plan(2);
    global.XMLHttpRequest = MockXMLHttpRequest;

    let xhr = http.getJSON("http://snapgram.net", () => {/**/},
        (loaded, total) => {
            t.equal(loaded, mockProgressEvent.loaded);
            t.equal(total, 5678);
        });

    xhr.readyState = http.ReadyState.HEADERS_RECEIVED;
    xhr.status = http.State.OK;
    xhr.responseText = "[\"data\"]";
    xhr.onreadystatechange();
    xhr.addEventListener.yield(mockProgressEvent);
});

test("Http should get JSON and call the progress callback using the event.total as the total if set", (t) => {
    t.plan(2);
    global.XMLHttpRequest = MockXMLHttpRequest;

    let xhr = http.getJSON("http://snapgram.net", () => {/**/},
        (loaded, total) => {
            t.equal(loaded, mockProgressEvent.loaded);
            t.equal(total, mockProgressEvent.total);
        });

    mockProgressEvent.total = 4321;
    xhr.readyState = http.ReadyState.HEADERS_RECEIVED;
    xhr.status = http.State.OK;
    xhr.responseText = "[\"data\"]";
    xhr.onreadystatechange();
    xhr.addEventListener.yield(mockProgressEvent);
});
