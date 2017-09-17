import get from "lodash.get";

class ExerciseAreaListener {

    constructor(browserEvent, checker, exerciseArea, walker) {
        this.checker = checker;
        this.exerciseArea = exerciseArea;
        this.walker = walker;
        browserEvent.on("blur", this.onBlur.bind(this));
        browserEvent.on("keydown", this.onKeydown.bind(this));
        browserEvent.on("mouseout", this.onMouseout.bind(this));
        browserEvent.on("mouseover", this.onMouseover.bind(this));
        browserEvent.on("page-field-list-updated", this.onPageFieldListUpdated.bind(this));
        browserEvent.on("page-data-updated", this.onPageDataUpdated.bind(this));
        browserEvent.on("toggle-success", this.onToggleSuccess.bind(this));
    }

    onBlur(e) {
        if(this.isKnownEvent(e, "INPUT", this.fields)) {
            let field = this.fields[e.target.id];
            let solutions = get(this.pageData, field.dataPath);
            if(typeof field.filter === "function") {
                field.filter(e.target, solutions);
            }
            let result = this.checker.check(solutions, e.target.value);
            this.exerciseArea.showAnswer(field, result);
        }
    }

    onKeydown(e) {
        if(e.target.hasAttribute("data-walkable-field")) {
            if(this.walker.walk(e.keyCode, e.target.id)) {
                e.preventDefault();
            }
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
            this.exerciseArea.hide(field.popupId);
        }
    }

    onPageFieldListUpdated(e) {
        this.fields = e.detail;
        this.fieldsByIconId = {};
        for(let id of Object.keys(this.fields)) {
            let field = this.fields[id];
            this.fieldsByIconId[field.iconId] = field;
        }
    }

    onPageDataUpdated(e) {
        this.pageData = e.detail;
        this.pageData.toggleState = localStorage.getItem(this.pageData.toggler); 
        this.updateFields();
        this.walker.link(Object.keys(this.fields));
    }

    onToggleSuccess(e) {
        if(e.detail.id === this.pageData.toggler) {
            this.pageData.toggleState = e.detail.state;
            this.updateFields();
        }
    }

    updateFields() {
        for(let id of Object.keys(this.fields)) {
            let field = this.fields[id];
            let solutions = get(this.pageData, field.dataPath);
            this.exerciseArea.updateField(field, solutions, this.pageData.toggleState);
        }
    }

    isKnownEvent(e, name, fields) {
        return e.target.nodeName === name && e.target.id && fields && fields[e.target.id];
    }
}

export default ExerciseAreaListener;
