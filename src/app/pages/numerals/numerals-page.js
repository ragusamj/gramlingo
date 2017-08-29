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
        this.pageData = this.generator.randomize();
        if(!this.fields) {
            this.fields = new Page().apply(pageTemplate, this.pageData);
            this.addFieldFilters();
        }
        onPageChanged();
        this.onPageDataChanged();
    }

    addFieldFilters() {
        for(let key of Object.keys(this.fields)) {
            let field = this.fields[key];
            if(field.dataPath.indexOf("ordinals") === 0) {
                field.filter = this.filter;
            }
        }
    }

    filter(element, solutions) {
        if(element.value) {
            if(solutions[0].indexOf("ª") === (solutions[0].length) -1 && element.value.indexOf("ª") === -1) {
                element.value += "ª";
            }
            if(solutions[0].indexOf("º") === (solutions[0].length) -1 && element.value.indexOf("º") === -1) {
                element.value += "º";
            }
        }
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
            this.pageData[key] = this.generator.randomize(key);
            if(this.switchToggled) {
                this.switch(key);
            }
            this.onPageDataChanged();
        }
        if(e.target.hasAttribute("data-switch-fields")) {
            this.switch(e.target.getAttribute("data-switch-fields"));
            this.switchToggled = !this.switchToggled;
            this.onPageDataChanged();
        }
    }

    switch(key) {
        this.pageData[key].forEach((field) => {
            let tmp = field.q;
            field.q = field.a;
            field.a = tmp;
        });
    }

    onPageDataChanged() {
        this.applyHeaders();
        this.browserEvent.emit("page-field-list-updated", this.fields);
        this.browserEvent.emit("page-data-updated", this.pageData);
    }
}

export default NumeralsPage;
