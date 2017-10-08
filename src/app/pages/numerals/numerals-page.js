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

    constructor(browserEvent, i18n, exerciseArea, exerciseAreaListener, numeralsGenerator, searchEngine, searchListener) {
        this.browserEvent = browserEvent;
        this.i18n = i18n;
        this.exerciseArea = exerciseArea;
        this.exerciseAreaListener = exerciseAreaListener;
        this.numeralsGenerator = numeralsGenerator;
        this.searchEngine = searchEngine;
        this.searchListener = searchListener;
    }

    attach(pageTemplate, onPageChanged, parameters) {
        this.removeListeners = [
            this.browserEvent.on("click", this.onClick.bind(this))
        ];
        this.exerciseAreaListener.attach();
        this.searchListener.attach();
        this.loadPage(pageTemplate, onPageChanged, parameters);
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
        this.exerciseAreaListener.detach();
        this.searchListener.detach();
    }

    loadPage(pageTemplate, onPageChanged, parameters) {
        this.type = parameters.type.toLowerCase() || "integers";
        this.createContext();
        this.exerciseArea.build(pageTemplate, this.context);
        onPageChanged();
        this.onPageDataChanged();
    }

    createContext() {
        this.context = {
            numerals: this.numeralsGenerator.randomize(this.type),
            toggler: "toggle-numerals-data"
        };
    }

    onClick(e) {
        if(e.target.hasAttribute("data-numeral-button")) {
            let type = e.target.getAttribute("data-numeral-button");
            if(type !== this.type) {
                this.type = type;
                this.createContext();
                this.onPageDataChanged();
                this.browserEvent.emit("url-change", "/numerals/" + this.type);
            } 
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
        this.addOrdinalFieldFilter();
        this.searchEngine.initialize(this.type);
        this.exerciseArea.updateContext(this.context);
    }

    addOrdinalFieldFilter() {
        for(let key of Object.keys(this.exerciseArea.fields)) {
            this.exerciseArea.fields[key].filter = this.type === "ordinals" ? ordinalFilter : undefined;
        }
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
