import KeyCode from "./key-code";

class ElementWalker {

    link(ids) {
        this.ids = ids;
    }

    walk(key) {
        let index = this.currentElementId ? this.ids.indexOf(this.currentElementId) : -1;
        if (key === KeyCode.upArrow) {
            this.select(this.ids[index - 1]);
        }
        else if (key === KeyCode.downArrow) {
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

    isWalkable(key) {
        return key === KeyCode.downArrow || key === KeyCode.upArrow;
    }
}

export default ElementWalker;
