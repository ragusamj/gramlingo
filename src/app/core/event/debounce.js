export default (callback, delay) => {
    let timeout;
    return (...args) => {
        let later = () => {
            timeout = undefined;
            callback.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
    };
};