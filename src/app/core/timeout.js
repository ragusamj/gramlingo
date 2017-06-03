export default (handler, timeout) => {
    let id = setTimeout(handler, timeout);
    return () => {
        clearTimeout(id);
    };
};
