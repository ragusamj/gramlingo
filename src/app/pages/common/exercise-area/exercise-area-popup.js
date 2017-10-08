import Template from "../../../core/template/template";

const type = 0;
const data = 1;
const deleted = -1;
const equal = 0;
const insert = 1;

class ExerciseAreaPopup {

    constructor() {
        this.popupTemplate = Template.fromElementId("popup-template");
        this.trafficLightTemplate = Template.fromElementId("popup-traffic-light-template");
        this.alternativesTemplate = Template.fromElementId("popup-alternatives-template");
    }

    showAnswer(field, result) {
        if(result.accepted && result.alternatives.length === 0) {
            this.hideElement(field.iconId);
            this.hideElement(field.popupId);
        }
        else {
            this.createIcon(field, result);
            this.createMessage(field, result);
            this.show(field.popupId);
            setTimeout(() => {
                this.hideElement(field.popupId);
            }, 3000);
        }
    }

    createIcon(field, result) {
        let icon = document.getElementById(field.iconId);
        if(result.accepted) {
            icon.classList.remove("fa-exclamation-circle");
            icon.classList.remove("text-danger"); 
            icon.classList.add("fa-plus-circle");
            icon.classList.add("text-info");
        }
        else {
            icon.classList.remove("fa-plus-circle");
            icon.classList.remove("text-info");
            icon.classList.add("fa-exclamation-circle");
            icon.classList.add("text-danger");
        }
        this.showElement(field.iconId);
    }

    createMessage(field, result) {
        let template = this.popupTemplate.clone();
        let tbody = template.querySelector("tbody");
        this.createTrafficLight(result, tbody);
        this.addSolutions(result, tbody);
        template.replaceContent(field.popupId);
    }

    createTrafficLight(result, tbody) {
        if(!result.accepted) {
            let trafficLightTemplate = this.trafficLightTemplate.clone();
            trafficLightTemplate.set("answer", { innerHTML: result.answer });
            this.visualizeDiff(trafficLightTemplate, result);
            trafficLightTemplate.set("solution", { innerHTML: result.solution });
            tbody.appendChild(trafficLightTemplate.fragment());
        }
    }

    visualizeDiff(errorTemplate, result) {
        let td = errorTemplate.set("diff");
        for(let diff of result.diff) {
            switch(diff[type]) {
                case deleted:
                    errorTemplate.add(td, "span", { innerHTML: diff[data], className: "missing-letter" });
                    break;
                case equal:
                    errorTemplate.add(td, "span", { innerHTML: diff[data] });
                    break;
                case insert:
                    errorTemplate.add(td, "span", { innerHTML: diff[data], className: "text-danger alien-letter" });
                    break;
            }
        }
    }

    addSolutions(result, tbody) {
        for(let alternative of result.alternatives) {
            if(alternative !== result.solution) {
                let altTemplate = this.alternativesTemplate.clone();
                altTemplate.set("alternative", { innerHTML: alternative });
                tbody.appendChild(altTemplate.fragment());
            }
        }
    }

    show(id) {
        if(this.lastPopup) {
            this.hideElement(this.lastPopup);
        }
        this.lastPopup = id;
        this.showElement(id);
    }

    hideElement(id) {
        let element = document.getElementById(id);
        if(element) {
            element.classList.remove("show");
        }
    }

    showElement(id) {
        let element = document.getElementById(id);
        element.classList.add("show");
    }
}

export default ExerciseAreaPopup;