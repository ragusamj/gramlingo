import get from "lodash.get";

class NumeralsPage {

    constructor(browserEvent, fieldGenerator, numeralGenerator) {
        this.browserEvent = browserEvent;
        this.fieldGenerator = fieldGenerator;
        this.numeralGenerator = numeralGenerator;
    }

    attach(pageTemplate, onPageChanged) {
        this.applyPageTemplate(pageTemplate, onPageChanged);
        this.removeClickListener = this.browserEvent.on("click", this.onClick.bind(this));
    }

    detach() {
        this.removeClickListener();
    }

    applyPageTemplate(pageTemplate, onPageChanged) {
        this.pageData = this.numeralGenerator.randomize();
        if(!this.fields) {
            this.fields = this.fieldGenerator.build(pageTemplate, this.pageData);
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
            for(let sign of ["ª", "º"]) {
                if(solutions[0].indexOf(sign) === (solutions[0].length) -1 && element.value.indexOf(sign) === -1) {
                    element.value += sign;
                }
            }
        }
    }

    applyHeaders() {
        let headerContainers = document.querySelectorAll("[data-field-header-path]");
        for(let headerContainer of headerContainers) {
            let headerPath = headerContainer.getAttribute("data-field-header-path");
            let header = get(this.pageData, headerPath);
            headerContainer.innerHTML = header[0][0];
        }
    }

    onClick(e) {
        if(e.target.hasAttribute("data-randomize-fields")) {
            let key = e.target.getAttribute("data-randomize-fields");
            this.pageData[key] = this.numeralGenerator.randomize(key);
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
        for(let field of this.pageData[key]) {
            let tmp = field.q;
            field.q = field.a;
            field.a = tmp;
        }
    }

    onPageDataChanged() {
        this.applyHeaders();
        this.browserEvent.emit("page-field-list-updated", this.fields);
        this.browserEvent.emit("page-data-updated", this.pageData);
    }
}

export default NumeralsPage;
