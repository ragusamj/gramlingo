import get from "lodash.get";

const placeholders = {
    centuries: "1700",
    fractions: "5/6",
    integers: "123",
    ordinals: "3",
    time: "23:58"
};

class NumeralsPage {

    constructor(browserEvent, i18n, fieldGenerator, numeralGenerator, askTheMachineListener) {
        this.browserEvent = browserEvent;
        this.i18n = i18n;
        this.fieldGenerator = fieldGenerator;
        this.numeralGenerator = numeralGenerator;
        this.askTheMachineListener = askTheMachineListener;
    }

    attach(pageTemplate, onPageChanged, parameters) {
        this.type = parameters.type.toLowerCase() || "integers";
        this.applyPageTemplate(pageTemplate, onPageChanged, parameters);
        this.removeClickListener = this.browserEvent.on("click", this.onClick.bind(this));
        this.askTheMachineListener.attach();
    }

    detach() {
        this.removeClickListener();
        this.askTheMachineListener.detach();
    }

    applyPageTemplate(pageTemplate, onPageChanged) {
        this.pageData = {
            numerals: this.numeralGenerator.randomize(this.type)
        };
        if(!this.fields) {
            this.fields = this.fieldGenerator.build(pageTemplate, this.pageData);
        }
        this.addFieldFilters();
        onPageChanged();
        this.onPageDataChanged();
    }

    addFieldFilters() {
        if(this.type === "ordinals") {
            for(let key of Object.keys(this.fields)) {
                this.fields[key].filter = this.filter;
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

    onClick(e) {
        if(e.target.hasAttribute("data-numeral-button")) {
            this.type = e.target.getAttribute("data-numeral-button");
            this.pageData.numerals = this.numeralGenerator.randomize(this.type);
            this.onPageDataChanged();
            this.browserEvent.emit("url-change", "/numerals/" + this.type);
        }
        if(e.target.hasAttribute("data-randomize-fields")) {
            this.pageData.numerals = this.numeralGenerator.randomize(this.type);
            if(this.switchToggled) {
                this.switch();
            }
            this.onPageDataChanged();
        }
        if(e.target.hasAttribute("data-switch-fields")) {
            this.switch();
            this.switchToggled = !this.switchToggled;
            this.onPageDataChanged();
        }
    }
    
    switch() {
        for(let field of this.pageData.numerals) {
            let tmp = field.q;
            field.q = field.a;
            field.a = tmp;
        }
    }

    onPageDataChanged() {
        this.setQuestionHeaders();
        this.translateHeader();
        this.translateAskTheMachine();

        this.askTheMachineListener.setType(this.type);

        this.browserEvent.emit("page-field-list-updated", this.fields);
        this.browserEvent.emit("page-data-updated", this.pageData);
    }

    setQuestionHeaders() {
        let headerContainers = document.querySelectorAll("[data-field-header-path]");
        for(let headerContainer of headerContainers) {
            let headerPath = headerContainer.getAttribute("data-field-header-path");
            let header = get(this.pageData, headerPath);
            headerContainer.innerHTML = header[0][0];
        }
    }

    translateHeader() {
        let header = document.getElementById("numerals-type-header");
        header.setAttribute("data-translate", "numerals-" + this.type + "-header");
        this.i18n.translate(header);
    }

    translateAskTheMachine() {
        let body = document.getElementById("ask-the-machine-body");
        body.setAttribute("data-translate", "numerals-ask-the-machine-" + this.type + "-body");
        this.i18n.translate(body);

        let input = document.getElementById("ask-the-machine-input");
        input.value = "";
        input.placeholder = placeholders[this.type];
    }
}

export default NumeralsPage;
