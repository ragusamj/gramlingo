import EventBroker from "../core/event-broker";

const keyCode = {
    enter: 13,
    upArrow: 38,
    downArrow: 40
};

class Walker {

    constructor() {
        this.reset();
        this._destroyOnKeydown = EventBroker.add("keydown", this._onKeydown.bind(this));
    }

    destroy() {
        this._destroyOnKeydown();
    }

    reset() {
        this._linkedInputs = {};
        this._previousInput = undefined;
    }

    link(input) {

        if(input.disabled) {
            return;
        }

        this._linkedInputs[input.id] = {
            previous: this._previousInput
        };

        if(this._previousInput) {
            this._linkedInputs[this._previousInput.id].next = input;
        }

        this._previousInput = input;
    }

    _onKeydown(e) {

        if(e.target && e.target.hasAttribute("data-walkable-field")) {

            let field = this._linkedInputs[e.target.id];

            if (e.keyCode === keyCode.upArrow && field.previous) {
                field.previous.select();
            }
            else if ((e.keyCode === keyCode.downArrow || e.keyCode === keyCode.enter) && field.next) {
                field.next.select();
            }
        }
    }
}

export default Walker;
