const ReadyState = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
};

const State = {
    OK: 200,
    NOT_FOUND: 404
};

class Http {

    getHTML(url, onComplete, onProgress) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("progress", onProgress);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === ReadyState.DONE && xhr.status === State.OK) {
                onComplete(xhr.responseText);
            }
        };
        xhr.open("GET", url);
        xhr.send();
        return xhr;
    }

    getJSON(url, onComplete, onProgress) {
        let xhr = new XMLHttpRequest();
        let uncompressedSize;
        xhr.addEventListener("progress", (e) => {
            onProgress(e, uncompressedSize);
        });
        xhr.onreadystatechange = () => {
            if(xhr.status === State.OK) {
                if (xhr.readyState === ReadyState.HEADERS_RECEIVED) {
                    uncompressedSize = xhr.getResponseHeader("X-Content-Length");
                }
                if (xhr.readyState === ReadyState.DONE) {
                    onComplete(JSON.parse(xhr.responseText));
                }
            }
        };
        xhr.overrideMimeType("application/json");
        xhr.open("GET", url, true);
        xhr.send();
        return xhr;
    }
}

Http.prototype.ReadyState = ReadyState;
Http.prototype.State = State;

export default Http;
