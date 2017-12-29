export default (callback, timeout) => {
    let wait = false;
    return (...args) => {
        if (!wait) {
            wait = true;
            setTimeout(() => {
                wait = false;
                callback.apply(undefined, args);
            }, timeout);
        }
    };
};