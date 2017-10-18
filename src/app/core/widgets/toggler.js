import debounce from "lodash.debounce";

const resizeDelay = 100;

class Toggler {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
        this.debouncedResize = debounce(this.onResize.bind(this), resizeDelay);

        this.browserEvent.on("click", this.onClick.bind(this));
        this.browserEvent.on("resize", this.debouncedResize);
        this.browserEvent.on("transitionend", this.onTransitionend.bind(this));
        this.browserEvent.on("dom-content-changed", this.onDomContentChanged.bind(this));
    }

    onClick(e) {
        if(e.target.hasAttribute("data-toggler")) {
            let id = e.target.getAttribute("data-toggler");
            this.toggle(this.togglers[id]);
        }
    }

    onResize() {
        for(let key of Object.keys(this.togglers)) {
            let item = this.togglers[key];
            if(item.expandArea) {
                this.update(item);
            }
        }
    }

    onTransitionend(e) {
        if(!this.togglers) {
            return;
        }
        for(let key of Object.keys(this.togglers)) {
            let item = this.togglers[key];
            if(item.expandArea && item.expandArea.id === e.target.id) {
                if(item.state === "on") {
                    item.expandArea.style.overflow = "initial";
                }
                if (item.state === "off") {
                    item.expandArea.style.overflow = "";
                }
                this.update(item); // one last update to make sure expanding areas get the correct height, can't test scrollHeight with jsdom
            }
        }
    }

    onDomContentChanged() {
        this.togglers = {};
        let elements = document.querySelectorAll("[data-toggler]");
        for(let element of elements) {
            let item = this.create(element);
            this.update(item);
        }
    }

    toggle(item) {
        item.state = item.state === "on" ? "off" : "on";
        if(item.saveState) {
            localStorage.setItem(item.id, item.state);
        }
        this.update(item);
        this.browserEvent.emit("toggle-success", { id: item.id, state: item.state });
    }

    update(item) {
        if(item.on && item.off) {
            item.on.style.display = item.state === "on" ? "" : "none";
            item.off.style.display = item.state === "off" ? "" : "none";
        }
        if(item.expandArea) {
            if(item.state === "on") {
                item.expandArea.style.height = this.getHeight(item.expandArea) + "px";
            }
            if (item.state === "off") {
                item.expandArea.style.height = "";
                item.expandArea.style.overflow = "";
            }
        }
    }

    create(element) {
        let id = element.getAttribute("data-toggler");
        let on = element.getAttribute("data-toggler-on");
        let off = element.getAttribute("data-toggler-off");
        let saveState = element.getAttribute("data-toggler-save-state") || true;
        let expandArea = element.getAttribute("data-toggler-expand-area");
        let item = {
            id: id,
            state: localStorage.getItem(id) || element.getAttribute("data-toggler-state") || "on",
            saveState: saveState === "false" ? false : saveState,
            on: document.getElementById(on),
            off: document.getElementById(off),
            expandArea: document.getElementById(expandArea)
        };
        this.togglers[id] = item;
        return item;
    }

    getHeight(element) {
        let range = document.createRange();
        range.selectNodeContents(element);
        let clientRect = range.getBoundingClientRect();
        return clientRect.bottom - clientRect.top;
    }
}

export default Toggler;
