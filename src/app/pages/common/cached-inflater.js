class CachedInflater {

    constructor(http, popup) {
        this.http = http;
        this.popup = popup;
        this.cache = {};
    }

    get(url, inflater, translationKey, callback) {
        if(this.cache[url]) {
            return callback(this.cache[url]);
        }
        this.popup.show(translationKey);
        this.popup.progress(0);
        this.http.getJSON(url,
            (data) => {
                this.cache[url] = inflater.inflate(data);
                this.popup.hide();
                callback(this.cache[url]);
            }, 
            (loaded, total) => {
                this.popup.progress(Math.round(loaded / total * 100));
            });
    }
}

export default CachedInflater;