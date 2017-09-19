import KeyCode from "./key-code";

class ElementWalker {

    link(ids) {
        this.ids = ids;
        this.currentElementId = undefined;
    }

    walk(key) {
        if (key === KeyCode.upArrow) {
            let index = this.currentElementId ? this.ids.indexOf(this.currentElementId) : this.ids.length;
            this.select(this.ids[index - 1]);
        }
        else if (key === KeyCode.downArrow) {
            let index = this.currentElementId ? this.ids.indexOf(this.currentElementId) : -1;
            this.select(this.ids[index + 1]);
        }
    }

    select(id) {
        if(id) {
            let element = document.getElementById(id);
            element.classList.add("selected");
            if(this.currentElementId) {
                let currentElement = document.getElementById(this.currentElementId);
                if(currentElement) {
                    currentElement.classList.remove("selected");
                }
            }
            this.currentElementId = element.id;
        }
    }
}

export default ElementWalker;
