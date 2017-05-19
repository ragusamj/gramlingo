import get from "lodash.get";

class Checker {

    constructor(applicationEvent, browserEvent) {
        applicationEvent.on("page-data-updated", this.setPageData.bind(this));
        applicationEvent.on("page-field-list-updated", this.setFields.bind(this));
        applicationEvent.on("page-field-reset", this.reset.bind(this));
        browserEvent.on("blur", this.onBlur.bind(this));
        browserEvent.on("mouseover", this.onMouseover.bind(this));
        browserEvent.on("mouseout", this.onMouseout.bind(this));
    }

    setPageData(pageData) {
        this._pageData = pageData;
        this.reset();
    }

    setFields(fields) {
        this._fields = fields;
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
            icon.className = this._x ?
                "icon fa fa-pencil text-danger visible" :
                "icon fa fa-circle-o text-success visible";

            let popup = document.getElementById(field.popupId);
            popup.innerHTML = variants;
            this.showPopup(popup);
            setTimeout(() => {
                this.hidePopup(popup);
            }, 3000);
        }
    }

    isKnownEvent(e, name, fields) {
        return e.target && e.target.nodeName === name && e.target.id && fields[e.target.id];
    }

    hideIcon(icon) {
        icon.className = "icon hidden";
    }

    hidePopup(popup) {
        popup.className = "popup hidden";
    }

    showPopup(popup) {
        if(this._lastPopup) {
            this.hidePopup(this._lastPopup);
        }
        this._lastPopup = popup;
        popup.className = "popup visible";
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
}

export default Checker;
