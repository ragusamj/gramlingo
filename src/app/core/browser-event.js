class BrowserEvent {

    constructor() {
        this._listeners = {};
    }

    on(name, callback) {
        if(!this._listeners[name]) {
            this._listeners[name] = [];
            document.addEventListener(name, (e) => {
                this._listeners[name].forEach((callback) => {
                    callback(e);
                });
            }, true);
        }  
        let listenerIndex = this._listeners[name].push(callback) -1;
        let removeListener = () => {
            this._listeners[name].splice(listenerIndex, 1);
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
