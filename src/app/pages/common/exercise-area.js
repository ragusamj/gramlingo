import get from "lodash.get";

class ExerciseArea {

    constructor(browserEvent, checker, visualizer, walker) {
        this._checker = checker;
        this._visualizer = visualizer;
        this._walker = walker;
        browserEvent.on("blur", this.onBlur.bind(this));
        browserEvent.on("click", this.onClick.bind(this));
        browserEvent.on("keydown", this.onKeydown.bind(this));
        browserEvent.on("mouseout", this.onMouseout.bind(this));
        browserEvent.on("mouseover", this.onMouseover.bind(this));
        browserEvent.on("page-field-list-updated", this.onFieldListUpdated.bind(this));
        browserEvent.on("page-data-updated", this.onPageDataUpdated.bind(this));
    }

    onBlur(e) {
        if(this.isKnownEvent(e, "INPUT", this._fields)) {
            let field = this._fields[e.target.id];
            let variants = get(this._pageData, field.dataPath);
            let result = this._checker.check(variants, e.target.value);
            this._visualizer.showAnswer(field, result);
        }
    }

    onClick(e) {
        if(e.target) {
            if(e.target.hasAttribute("data-hide-button")) {
                this._visualizer.hidden = true;
                this.updateFields();

            }
            if(e.target.hasAttribute("data-show-button")) {
                this._visualizer.hidden = false;
                this.updateFields();
            }
        }
    }

    onKeydown(e) {
        if(e.target && e.target.hasAttribute("data-walkable-field")) {
            this._walker.walk(e.keyCode, e.target.id);
        }
    }

    onMouseover(e) {
        if(this.isKnownEvent(e, "DIV", this._fieldsByIconId)) {
            let field = this._fieldsByIconId[e.target.id];
            this._visualizer.showPopup(field.popupId);
        }
    }

    onMouseout(e) {
        if(this.isKnownEvent(e, "DIV", this._fieldsByIconId)) {
            let field = this._fieldsByIconId[e.target.id];
            this._visualizer.hidePopup(field.popupId);
        }
    }

    onFieldListUpdated(e) {
        this._fields = e.detail;
        this._fieldsByIconId = {};
        Object.keys(this._fields).forEach((id) => {
            let field = this._fields[id];
            this._fieldsByIconId[field.iconId] = field;
        });
        this._walker.link(this._fields);
    }

    onPageDataUpdated(e) {
        this._pageData = e.detail;
        this.updateFields();
    }

    updateFields() {
        Object.keys(this._fields).forEach((id) => {
            let field = this._fields[id];
            let variants = get(this._pageData, field.dataPath);
            this._visualizer.updateField(field, variants);
        });
    }

    isKnownEvent(e, name, fields) {
        return e.target && e.target.nodeName === name && e.target.id && fields[e.target.id];
    }
}

export default ExerciseArea;
