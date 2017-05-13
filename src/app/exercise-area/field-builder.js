import EventBroker from "../core/event-broker";
import Template from "../core/template";
import FieldChecker from "./field-checker";
import Walker from "./walker";

class FieldBuilder {

    constructor() {
        this._elementCache = [];
        this._fields = {};
        this._hidden = false;
        this._checker = new FieldChecker();
        this._walker = new Walker();
        this._removeOnShowHide = EventBroker.add("click", this._onShowHide.bind(this));
        this._templateFragment = Template.load("excercise-area-template");
    }

    reset() {
        this._checker.reset();
        this._walker.reset();
    }

    destroy() {
        this._removeOnShowHide();
        this._checker.destroy();
        this._walker.destroy();
    }

    hide() {
        this._hidden = true;
        this._checker.reset();
        this._fillInputs();
    }

    show() {
        this._hidden = false;
        this._fillInputs();
    }

    add(elementId, data) {

        if(this._elementCache.indexOf(elementId) === -1) {
            this._createFieldsFromTemplate(elementId, data);
        }

        data.forEach((variants, i) => {

            let field = this._fields[elementId + i];

            field.variants = variants;
            field.input.disabled = !variants[0];

            this._fillInput(field);
            this._walker.link(field.input);
        });
    }

    _createFieldsFromTemplate(elementId, data) {

        let containerElement = document.createDocumentFragment();

        data.forEach((variants, i) => {

            let fieldElement = this._templateFragment.cloneNode(true);
            fieldElement.id = elementId + i;
            this._fields[fieldElement.id] = this._getFieldElements(fieldElement);

            containerElement.appendChild(fieldElement);
            this._checker.add(this._fields[fieldElement.id]);
        });

        document.getElementById(elementId).appendChild(containerElement);
        this._elementCache.push(elementId);
    }

    _fillInputs() {
        Object.keys(this._fields).forEach((key) => {
            let field = this._fields[key];
            this._fillInput(field);
        });
    }

    _fillInput(field) {
        if(field.input.disabled) {
            field.input.value = "-";
        }
        else {
            field.input.value = this._hidden ? "" : field.variants[0];
        }
    }

    _getFieldElements(field) {

        let elements = {
            icon: field.getElementById("icon"),
            input: field.getElementById("input"),
            popup: field.getElementById("popup")
        };

        elements.icon.id = field.id + "icon";
        elements.popup.id = field.id + "popup";
        elements.input.id = field.id + "input";

        return elements;
    }

    _onShowHide(e) {
        if(e.target) {
            if(e.target.hasAttribute("data-hide-button")) {
                this.hide();
            }
            if(e.target.hasAttribute("data-show-button")) {
                this.show();
            }
        }
    }
}

export default FieldBuilder;
