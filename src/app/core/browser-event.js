const listeners = {};

class BrowserEvent {

    on(name, callback) {
        if(!listeners[name]) {
            listeners[name] = [];
            document.addEventListener(name, (e) => {
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

    emit(eventName, data) {
        let event;
        if(window.CustomEvent) {
            event = new CustomEvent(eventName, {
                detail: data
            });
        }
        else {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventName, true, true, data);
        }
        document.dispatchEvent(event);
    }
}

export default BrowserEvent;
