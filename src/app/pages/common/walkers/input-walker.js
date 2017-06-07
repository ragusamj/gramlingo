
const keyCode = {
    enter: 13,
    upArrow: 38,
    downArrow: 40
};

class Walker {

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
        if (key === keyCode.upArrow) {
            this.select(this.ids[index - 1]);
        }
        else if (key === keyCode.downArrow || key === keyCode.enter) {
            this.select(this.ids[index + 1]);
        }
    }

    select(id) {
        if(id) {
            let element = document.getElementById(id);
            element.select();
        }
    }
}

Walker.prototype.KeyCode = keyCode;

export default Walker;
