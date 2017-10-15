class CachedInflater {

    constructor(http) {
        this.http = http;
        this.cache = {};
    }

    get(url, inflater, callback) {
        if(this.cache[url]) {
            return callback(this.cache[url]);
        }
        this.http.getJSON(url, (data) => {
            this.cache[url] = inflater.inflate(data);
            callback(this.cache[url]);
        }, (event) => {
            //console.log("loading " + url + ", recieved", event.loaded, "bytes of", event.total);
            return event;
        });
    }
}

export default CachedInflater;