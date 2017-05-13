import EventBroker from "../core/event-broker";

class FieldChecker {

    constructor() {
        this._fieldsByIconId = {};
        this._fieldsByInputId = {};
        this._removeOnBlur = EventBroker.add("blur", this._onBlur.bind(this));
        this._removeOnMouseover = EventBroker.add("mouseover", this._onMouseover.bind(this));
        this._removeOnMouseout = EventBroker.add("mouseout", this._onMouseout.bind(this));
        this.reset();
    }

    destroy() {
        this._removeOnBlur();
        this._removeOnMouseover();
        this._removeOnMouseout();
    }

    reset() {

        this._lastPopup = undefined;

        Object.keys(this._fieldsByInputId).forEach((key) => {
            let field = this._fieldsByInputId[key];
            this._hideIcon(field.icon);
            this._hidePopup(field.popup);
        });
    }

    add(field) {
        this._fieldsByIconId[field.icon.id] = field;
        this._fieldsByInputId[field.input.id] = field;
    }

    _onBlur(e) {
        if(this._isKnownEvent(e, "INPUT", this._fieldsByInputId)) {

            let field = this._fieldsByInputId[e.target.id];
            field.popup.innerHTML = field.variants;
            this._showPopup(field.popup);
            
            this._x = !this._x;
            field.icon.className = this._x ?
                "icon fa fa-pencil text-danger visible" :
                "icon fa fa-circle-o text-success visible";

            setTimeout(() => {
                this._hidePopup(field.popup);
            }, 3000);
        }
    }

    _isKnownEvent(e, name, fields) {
        return e.target && e.target.nodeName === name && e.target.id && fields[e.target.id];
    }

    _onMouseover(e) {
        if(this._isKnownEvent(e, "DIV", this._fieldsByIconId)) {
            let field = this._fieldsByIconId[e.target.id];
            this._showPopup(field.popup);
        }
    }

    _onMouseout(e) {
        if(this._isKnownEvent(e, "DIV", this._fieldsByIconId)) {
            let field = this._fieldsByIconId[e.target.id];
            this._hidePopup(field.popup);
        }
    }

    _hideIcon(icon) {
        icon.className = "icon hidden";
    }

    _hidePopup(popup) {
        popup.className = "popup hidden";
    }

    _showPopup(popup) {
        if(this._lastPopup) {
            this._hidePopup(this._lastPopup);
        }
        this._lastPopup = popup;
        popup.className = "popup visible";
    }
}

export default FieldChecker;
