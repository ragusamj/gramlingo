export default (callback, delay) => {
    let last,
        timeout;
    return (...args) => {
        let now = new Date().getTime();
        if (last && now < last + delay) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                last = now;
                callback.apply(this, args);
            }, delay + last - now);
        }
        else {
            last = now;
            callback.apply(this, args);
        }
    };
};