const listeners = {};

class BrowserEvent {

    static on(name, callback) {
        if(!listeners[name]) {
            listeners[name] = [];
            document.body.addEventListener(name, (e) => {
                listeners[name].forEach((callback) => {
                    callback(e);
                });
            }, true);
        }  
        let listenerIndex = listeners[name].push(callback) -1;
        let removeListener = () => {
            listeners[name].splice(listenerIndex, 1);
        };
        return removeListener;
    }
}

export default BrowserEvent;
