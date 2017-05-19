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
    getElementById(id) {
        return this._elements[id];
    }
}

Mocument.prototype.body = {
    addEventListener: () => {
        //
    }
};

export default Mocument;
