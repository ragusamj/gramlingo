import Template from "../../core/template";

const type = 0;
const data = 1;
const deleted = -1;
const equal = 0;
const insert = 1;

class ExerciseInputField {

    constructor() {
        this.popupTemplate = Template.fromElementId("popup-template");
        this.trafficLightTemplate = Template.fromElementId("popup-traffic-light-template");
        this.alternativesTemplate = Template.fromElementId("popup-alternatives-template");
        this.hidden = false;
    }

    updateField(field, variants) {
        let input = document.getElementById(field.inputId);
        input.disabled = !variants[0];
        if(input.disabled) {
            input.value = "-";
        }
        else {
            input.value = this.hidden ? "" : variants[0];
        }
        this.hideIcon(field.iconId);
        this.hidePopup(field.popupId);
    }

    showAnswer(field, result) {
        if(result.accepted && result.alternatives.length === 0) {
            this.hideIcon(field.iconId);
            this.hidePopup(field.popupId);
        }
        else {
            this.createIcon(field, result);
            this.createMessage(field, result);
            this.showPopup(field.popupId);
            setTimeout(() => {
                this.hidePopup(field.popupId);
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
        this.showIcon(field.iconId);
    }

    createMessage(field, result) {
        let template = this.popupTemplate.clone();
        let tbody = template.getElementsByTagName("tbody")[0];
        this.createTrafficLight(result, tbody);
        this.addAlternatives(result, tbody);
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
        result.diff.forEach((diff) => {
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
        });
    }

    addAlternatives(result, tbody) {
        result.alternatives.forEach((alternative) => {
            if(alternative !== result.solution) {
                let altTemplate = this.alternativesTemplate.clone();
                altTemplate.set("alternative", { innerHTML: alternative });
                tbody.appendChild(altTemplate.fragment());
            }
        });
    }

    hideIcon(id) {
        let icon = document.getElementById(id);
        icon.classList.remove("show");
    }

    showIcon(id) {
        let icon = document.getElementById(id);
        icon.classList.add("show");
    }

    showPopup(id) {
        if(this._lastPopup) {
            this.hidePopup(this._lastPopup);
        }
        this._lastPopup = id;
        let popup = document.getElementById(id);
        popup.classList.add("show");
    }

    hidePopup(id) {
        let popup = document.getElementById(id);
        popup.classList.remove("show");
    }
}

export default ExerciseInputField;
