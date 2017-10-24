export default (callback, timeout) => {
    let wait = false;
    return (...args) => {
        let context = this;
        if (!wait) {
            wait = true;
            setTimeout(() => {
                wait = false;
                callback.apply(context, args);
            }, timeout);
        }
    };
};