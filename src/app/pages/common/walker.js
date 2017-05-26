
const keyCode = {
    enter: 13,
    upArrow: 38,
    downArrow: 40
};

class Walker {

    link(fields) {
        this.linkedList = {};
        this.previous = undefined;
        Object.keys(fields).forEach((id) => {
            let element = document.getElementById(id);
            if(!element.disabled) {
                this.linkedList[id] = {
                    previous: this.previous
                };
                if(this.previous) {
                    this.linkedList[this.previous].next = id;
                }
                this.previous = id;
            }
        });
    }

    walk(key, id) {
        let item = this.linkedList[id];
        if (key === keyCode.upArrow && item.previous) {
            let previous = document.getElementById(item.previous);
            previous.select();
        }
        else if ((key === keyCode.downArrow || key === keyCode.enter) && item.next) {
            let next = document.getElementById(item.next);
            next.select();
        }
    }
}

Walker.prototype.KeyCode = keyCode;

export default Walker;
