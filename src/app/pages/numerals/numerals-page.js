import get from "lodash.get";
import ordinalFilter from "./ordinal-filter";

const placeholders = {
    centuries: "1700",
    fractions: "5/6",
    integers: "123",
    ordinals: "3",
    time: "23:58"
};

class NumeralsPage {

    constructor(browserEvent, i18n, fieldGenerator, numeralsGenerator, searchListener) {
        this.browserEvent = browserEvent;
        this.i18n = i18n;
        this.fieldGenerator = fieldGenerator;
        this.numeralsGenerator = numeralsGenerator;
        this.searchListener = searchListener;
    }

    attach(pageTemplate, onPageChanged, parameters) {
        this.type = parameters.type.toLowerCase() || "integers";
        this.removeClickListener = this.browserEvent.on("click", this.onClick.bind(this));
        this.searchListener.attach();
        this.applyPageTemplate(pageTemplate, onPageChanged, parameters);
    }

    detach() {
        this.removeClickListener();
        this.searchListener.detach();
    }

    applyPageTemplate(pageTemplate, onPageChanged) {
        this.createContext();
        if(!this.fields) {
            this.fields = this.fieldGenerator.build(pageTemplate, this.context);
        }
        this.addFieldFilters();
        onPageChanged();
        this.onPageDataChanged();
    }

    addFieldFilters() {
        if(this.type === "ordinals") {
            for(let key of Object.keys(this.fields)) {
                this.fields[key].filter = ordinalFilter;
            }
        }
    }

    onClick(e) {
        if(e.target.hasAttribute("data-numeral-button")) {
            this.type = e.target.getAttribute("data-numeral-button");
            this.createContext();
            this.onPageDataChanged();
            this.browserEvent.emit("url-change", "/numerals/" + this.type);
        }
        if(e.target.hasAttribute("data-randomize-fields")) {
            this.context.numerals = this.numeralsGenerator.randomize(this.type);
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

    createContext() {
        this.context = {
            numerals: this.numeralsGenerator.randomize(this.type),
            toggler: "toggle-numerals-data"
        };
    }
    
    switch() {
        for(let field of this.context.numerals) {
            let tmp = field.q;
            field.q = field.a;
            field.a = tmp;
        }
    }

    onPageDataChanged() {
        this.setQuestionHeaders();
        this.translateHeader();
        this.translateAskTheMachine();

        this.browserEvent.emit("page-searchable-data-updated", this.type);
        this.browserEvent.emit("page-field-list-updated", this.fields);
        this.browserEvent.emit("page-data-updated", this.context);
    }

    setQuestionHeaders() {
        let headerContainers = document.querySelectorAll("[data-field-header-path]");
        for(let headerContainer of headerContainers) {
            let headerPath = headerContainer.getAttribute("data-field-header-path");
            let header = get(this.context, headerPath);
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
