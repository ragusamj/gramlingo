import get from "lodash.get";

class ExerciseArea {

    constructor(checker, exerciseAreaPopup, fieldGenerator, walker) {
        this.checker = checker;
        this.exerciseAreaPopup = exerciseAreaPopup;
        this.fieldGenerator = fieldGenerator;
        this.walker = walker;
    }

    build(pageTemplate, context) {
        // TODO: cache page template and fields per context.id?
        this.fields = this.fieldGenerator.build(pageTemplate, context);
        this.fieldsByIconId = {};
        for(let id of Object.keys(this.fields)) {
            let field = this.fields[id];
            this.fieldsByIconId[field.iconId] = field;
        }
    }

    updateContext(context) {
        this.context = context;
        this.context.toggleState = localStorage.getItem(this.context.toggler); 
        this.updateFields();
        this.walker.link(Object.keys(this.fields));
    }

    updateFields() {
        for(let id of Object.keys(this.fields)) {
            let field = this.fields[id];
            let solutions = get(this.context, field.dataPath);
            this.updateField(field, solutions, this.context.toggleState);
        }
    }

    updateField(field, solutions, toggleState) {
        let input = document.getElementById(field.inputId);
        input.disabled = !solutions[0];
        input.type = this.isNumeric(solutions[0]) ? "number" : "text";
        if(input.disabled) {
            input.value = "-";
        }
        else {
            input.value = (!toggleState || toggleState === "on") ? solutions[0] : "";
        }
        this.exerciseAreaPopup.hideElement(field.iconId);
        this.exerciseAreaPopup.hideElement(field.popupId);
    }

    onBlur(e) {
        if(this.isKnownEvent(e, "INPUT", this.fields)) {
            let field = this.fields[e.target.id];
            let solutions = get(this.context, field.dataPath);
            if(typeof field.filter === "function") {
                field.filter(e.target, solutions);
            }
            let result = this.checker.check(solutions, e.target.value);
            this.exerciseAreaPopup.showAnswer(field, result);
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
            this.exerciseAreaPopup.show(field.popupId);
        }
    }

    onMouseout(e) {
        if(this.isKnownEvent(e, "DIV", this.fieldsByIconId)) {
            let field = this.fieldsByIconId[e.target.id];
            this.exerciseAreaPopup.hideElement(field.popupId);
        }
    }

    onToggleSuccess(e) {
        if(e.detail.id === this.context.toggler) {
            this.context.toggleState = e.detail.state;
            this.updateFields();
        }
    }

    isKnownEvent(e, name, fields) {
        return e.target.nodeName === name && e.target.id && fields && fields[e.target.id];
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

export default ExerciseArea;
