import get from "lodash.get";

class ExerciseAreaListener {

    constructor(browserEvent, checker, exerciseArea, walker) {
        this.checker = checker;
        this.exerciseArea = exerciseArea;
        this.walker = walker;
        browserEvent.on("blur", this.onBlur.bind(this));
        browserEvent.on("click", this.onClick.bind(this));
        browserEvent.on("keydown", this.onKeydown.bind(this));
        browserEvent.on("mouseout", this.onMouseout.bind(this));
        browserEvent.on("mouseover", this.onMouseover.bind(this));
        browserEvent.on("page-field-list-updated", this.onPageFieldListUpdated.bind(this));
        browserEvent.on("page-data-updated", this.onPageDataUpdated.bind(this));
    }

    onBlur(e) {
        if(this.isKnownEvent(e, "INPUT", this.fields)) {
            let field = this.fields[e.target.id];
            let alternatives = get(this.pageData, field.dataPath);
            let result = this.checker.check(alternatives, e.target.value);
            this.exerciseArea.showAnswer(field, result);
        }
    }

    onClick(e) {
        if(e.target.hasAttribute("data-hide-button")) {
            this.exerciseArea.hidden = true;
            this.updateFields();

        }
        if(e.target.hasAttribute("data-show-button")) {
            this.exerciseArea.hidden = false;
            this.updateFields();
        }
    }

    onKeydown(e) {
        if(e.target.hasAttribute("data-walkable-field")) {
            this.walker.walk(e.keyCode, e.target.id);
        }
    }

    onMouseover(e) {
        if(this.isKnownEvent(e, "DIV", this.fieldsByIconId)) {
            let field = this.fieldsByIconId[e.target.id];
            this.exerciseArea.showPopup(field.popupId);
        }
    }

    onMouseout(e) {
        if(this.isKnownEvent(e, "DIV", this.fieldsByIconId)) {
            let field = this.fieldsByIconId[e.target.id];
            this.exerciseArea.hidePopup(field.popupId);
        }
    }

    onPageFieldListUpdated(e) {
        this.fields = e.detail;
        this.fieldsByIconId = {};
        Object.keys(this.fields).forEach((id) => {
            let field = this.fields[id];
            this.fieldsByIconId[field.iconId] = field;
        });
        this.walker.link(this.fields);
    }

    onPageDataUpdated(e) {
        this.pageData = e.detail;
        this.updateFields();
    }

    updateFields() {
        Object.keys(this.fields).forEach((id) => {
            let field = this.fields[id];
            let alternatives = get(this.pageData, field.dataPath);
            this.exerciseArea.updateField(field, alternatives);
        });
    }

    isKnownEvent(e, name, fields) {
        return e.target.nodeName === name && e.target.id && fields[e.target.id];
    }
}

export default ExerciseAreaListener;