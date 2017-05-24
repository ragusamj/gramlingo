import get from "lodash.get";

class ExerciseArea {

    constructor(browserEvent) {
        browserEvent.on("page-data-updated", this.setPageData.bind(this));
        browserEvent.on("page-field-list-updated", this.setFields.bind(this));
        browserEvent.on("page-field-reset", this.reset.bind(this));
        browserEvent.on("blur", this.onBlur.bind(this));
        browserEvent.on("mouseover", this.onMouseover.bind(this));
        browserEvent.on("mouseout", this.onMouseout.bind(this));
    }

    setPageData(e) {
        this._pageData = e.detail;
        this.reset();
    }

    setFields(e) {
        this._fields = e.detail;
        this._fieldsByIconId = {};
        Object.keys(this._fields).forEach((id) => {
            let field = this._fields[id];
            this._fieldsByIconId[field.iconId] = field;
        });
    }

    reset() {
        Object.keys(this._fields).forEach((id) => {
            let field = this._fields[id];
            let icon = document.getElementById(field.iconId);
            this.hideIcon(icon);
            let popup = document.getElementById(field.popupId);
            this.hidePopup(popup);
        });
    }

    onBlur(e) {
        if(this.isKnownEvent(e, "INPUT", this._fields)) {
            let field = this._fields[e.target.id];
            let variants = get(this._pageData, field.dataPath);

            let icon = document.getElementById(field.iconId);
            this._x = !this._x;
            if(this._x) {
                icon.classList.add("fa-pencil");
                icon.classList.add("text-danger");
            }
            else {
                icon.classList.add("fa-circle-o");
                icon.classList.add("text-success");
            }
            this.showIcon(icon);

            let popup = document.getElementById(field.popupId);
            popup.innerHTML = variants;
            this.showPopup(popup);
            setTimeout(() => {
                this.hidePopup(popup);
            }, 3000);
        }
    }

    onMouseover(e) {
        if(this.isKnownEvent(e, "DIV", this._fieldsByIconId)) {
            let field = this._fieldsByIconId[e.target.id];
            let popup = document.getElementById(field.popupId);
            this.showPopup(popup);
        }
    }

    onMouseout(e) {
        if(this.isKnownEvent(e, "DIV", this._fieldsByIconId)) {
            let field = this._fieldsByIconId[e.target.id];
            let popup = document.getElementById(field.popupId);
            this.hidePopup(popup);
        }
    }

    isKnownEvent(e, name, fields) {
        return e.target && e.target.nodeName === name && e.target.id && fields[e.target.id];
    }

    hideIcon(icon) {
        icon.classList.remove("show");
    }

    hidePopup(popup) {
        popup.classList.remove("show");
    }

    showIcon(icon) {
        icon.classList.add("show");
    }

    showPopup(popup) {
        if(this._lastPopup) {
            this.hidePopup(this._lastPopup);
        }
        this._lastPopup = popup;
        popup.classList.add("show");
    }
}

export default ExerciseArea;
