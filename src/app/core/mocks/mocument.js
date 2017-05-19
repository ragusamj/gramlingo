const listeners = {};

class Mocument {

    constructor() {
        this._elements = {};
        global.document = this;
    }

    mockElement(id, element) {
        this._elements[id] = element;
        return this;
    }

    mockElements(elements) {
        this._elements = elements;
        return this;
    }

    createElement() {
        //
    }

    getElementById(id) {
        return this._elements[id];
    }
}

Mocument.prototype.body = {
    addEventListener: (eventName, callback) => {
        listeners[eventName] = listeners[eventName] || [];
        listeners[eventName].push(callback);
    },
    fireEvent: (eventName) => {
        let callbacks = listeners[eventName];
        if(callbacks) {
            callbacks.forEach((callback) => {
                callback();
            });
        }
    }
};

export default Mocument;
