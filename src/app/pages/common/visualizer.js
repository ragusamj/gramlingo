
class Visualizer {

    constructor() {
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
        if(result) {

            let icon = document.getElementById(field.iconId);
            if(result.isCorrect) {
                icon.classList.add("fa-circle-o");
                icon.classList.add("text-success");
            }
            else {
                icon.classList.add("fa-pencil");
                icon.classList.add("text-danger"); 
            }
            this.showIcon(field.iconId);

            let popup = document.getElementById(field.popupId);
            popup.innerHTML = "";
            result.diffs.forEach((d) => {
                popup.innerHTML += d + "</br>";
            });

            this.showPopup(field.popupId);
            setTimeout(() => {
                this.hidePopup(field.popupId);
            }, 3000);
        }
        else {
            this.hideIcon(field.iconId);
            this.hidePopup(field.popupId);
        }
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

export default Visualizer;
