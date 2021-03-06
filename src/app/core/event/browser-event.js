class BrowserEvent {

    constructor() {
        this.listeners = {};
    }

    on(name, callback) {
        if(!this.listeners[name]) {
            this.listeners[name] = [];
            window.addEventListener(name, (e) => {
                for(let callback of this.listeners[name]) {
                    callback(e);
                }
            }, true);
        }  
        this.listeners[name].push(callback);
        let removeListener = () => {
            let index = this.listeners[name].indexOf(callback);
            this.listeners[name].splice(index, 1);
        };
        return removeListener;
    }

    emit(eventName, data) {
        window.dispatchEvent(new CustomEvent(eventName, {
            detail: data
        }));
    }
}

export default BrowserEvent;
