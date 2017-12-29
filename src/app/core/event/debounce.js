export default (callback, delay) => {
    let timeout;
    return (...args) => {
        let later = () => {
            timeout = undefined;
            callback.apply(undefined, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
    };
};