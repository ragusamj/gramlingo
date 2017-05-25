
const keyCode = {
    enter: 13,
    upArrow: 38,
    downArrow: 40
};

class Walker {

    link(fields) {
        this._linkedList = {};
        this._previous = undefined;
        Object.keys(fields).forEach((id) => {
            let element = document.getElementById(id);
            if(!element.disabled) {
                this._linkedList[id] = {
                    previous: this._previous
                };
                if(this._previous) {
                    this._linkedList[this._previous].next = id;
                }
                this._previous = id;
            }
        });
    }

    walk(key, id) {
        let item = this._linkedList[id];
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

export default Walker;
