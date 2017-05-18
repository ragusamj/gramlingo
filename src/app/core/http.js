class Http {

    static getHTML(url, onComplete, onProgress) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("progress", onProgress);
        xhr.open("GET", url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                onComplete(xhr.responseText);
            }
        };
        xhr.send();
    }

    static getJSON(url, onComplete, onProgress) {
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
    }
}

export default Http;
