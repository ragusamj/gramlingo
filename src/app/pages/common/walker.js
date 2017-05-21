
const keyCode = {
    enter: 13,
    upArrow: 38,
    downArrow: 40
};

class Walker {

    constructor(browserEvent) {
        browserEvent.on("page-field-list-updated", this.link.bind(this));
        browserEvent.on("keydown", this.walk.bind(this));
    }

    link(e) {
        this._linkedList = {};
        this._previous = undefined;
        Object.keys(e.detail).forEach((id) => {
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

    walk(e) {
        if(e.target && e.target.hasAttribute("data-walkable-field")) {
            let item = this._linkedList[e.target.id];
            if (e.keyCode === keyCode.upArrow && item.previous) {
                let previous = document.getElementById(item.previous);
                previous.select();
            }
            else if ((e.keyCode === keyCode.downArrow || e.keyCode === keyCode.enter) && item.next) {
                let next = document.getElementById(item.next);
                next.select();
            }
        }
    }
}

export default Walker;
