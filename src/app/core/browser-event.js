class BrowserEvent {

    constructor() {
        this.listeners = {};
    }

    on(name, callback) {
        if(!this.listeners[name]) {
            this.listeners[name] = [];
            document.addEventListener(name, (e) => {
                this.listeners[name].forEach((callback) => {
                    callback(e);
                });
            }, true);
        }  
        let listenerIndex = this.listeners[name].push(callback) -1;
        let removeListener = () => {
            this.listeners[name].splice(listenerIndex, 1);
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
