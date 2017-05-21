import get from "lodash.get";

class Visualizer {

    constructor(browserEvent) {
        this._browserEvent = browserEvent;
        browserEvent.on("page-data-updated", this.setPageData.bind(this));
        browserEvent.on("page-field-list-updated", this.setFields.bind(this));
        browserEvent.on("click", this.onClick.bind(this));
    }

    setPageData(e) {
        this._pageData = e.detail;
        this.update();
    }

    setFields(e) {
        this._fields = e.detail;
    }

    update() {
        Object.keys(this._fields).forEach((id) => {
            let input = document.getElementById(id);
            let field = this._fields[id];
            let variants = get(this._pageData, field.dataPath);
            input.disabled = !variants[0];
            if(input.disabled) {
                input.value = "-";
            }
            else {
                input.value = this._hidden ? "" : variants[0];
            }
        });
    }

    onClick(e) {
        if(e.target) {
            if(e.target.hasAttribute("data-hide-button")) {
                this._hidden = true;
                this._browserEvent.emit("page-field-reset");
                this.update();

            }
            if(e.target.hasAttribute("data-show-button")) {
                this._hidden = false;
                this.update();
            }
        }
    }
}

export default Visualizer;
