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
        xhr.open("GET", url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === ReadyState.DONE && xhr.status === State.OK) {
                onComplete(xhr.responseText);
            }
        };
        xhr.send();
        return xhr;
    }

    getJSON(url, onComplete, onProgress) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("progress", onProgress);
        xhr.overrideMimeType("application/json");
        xhr.open("GET", url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                onComplete(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
        return xhr;
    }
}

Http.prototype.ReadyState = ReadyState;
Http.prototype.State = State;

export default Http;
