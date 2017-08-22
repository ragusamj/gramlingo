import get from "lodash.get";
import Page from "../common/page";

class NumeralsPage {

    constructor(browserEvent, generator) {
        this.browserEvent = browserEvent;
        this.generator = generator;
    }

    attach(pageTemplate, onPageChanged) {
        this.applyPageTemplate(pageTemplate, onPageChanged);
        this.removeClickListener = this.browserEvent.on("click", this.onClick.bind(this));
    }

    detach() {
        this.removeClickListener();
    }

    applyPageTemplate(pageTemplate, onPageChanged) {
        this.pageData = this.generator.all();
        if(!this.fields) {
            this.fields = new Page().apply(pageTemplate, this.pageData);
        }
        onPageChanged();
        this.onPageDataChanged();
    }

    applyHeaders() {
        let headerContainer = document.querySelectorAll("[data-field-header-path]");
        headerContainer.forEach((headerContainer) => {
            let headerPath = headerContainer.getAttribute("data-field-header-path");
            let header = get(this.pageData, headerPath);
            headerContainer.innerHTML = header[0][0];
        });
    }

    onClick(e) {
        if(e.target.hasAttribute("data-randomize-fields")) {
            let key = e.target.getAttribute("data-randomize-fields");
            this.pageData[key] = this.generator.get(key);
            this.onPageDataChanged();
        }
        if(e.target.hasAttribute("data-switch-fields")) {
            let key = e.target.getAttribute("data-switch-fields");
            this.pageData[key].forEach((field) => {
                let tmp = field.q;
                field.q = field.a;
                field.a = tmp;
            });
            this.onPageDataChanged();
        }
    }

    onPageDataChanged() {
        this.applyHeaders();
        this.browserEvent.emit("page-field-list-updated", this.fields);
        this.browserEvent.emit("page-data-updated", this.pageData);
    }
}

export default NumeralsPage;
