import KeyCode from "./key-code";

class InputWalker {

    link(ids) {
        this.ids = [];
        ids.forEach((id) => {
            let element = document.getElementById(id);
            if(!element.disabled) {
                this.ids.push(id);
            }
        });
    }

    walk(key, id) {
        let index = this.ids.indexOf(id);
        if (key === KeyCode.upArrow) {
            this.select(this.ids[index - 1]);
            return true;
        }
        else if (key === KeyCode.downArrow || key === KeyCode.enter) {
            this.select(this.ids[index + 1]);
            return true;
        }
        return false;
    }

    select(id) {
        if(id) {
            let element = document.getElementById(id);
            element.select();
        }
    }
}

export default InputWalker;
