class Toggler {

    constructor(browserEvent) {
        browserEvent.on("click", this.onClick.bind(this));
        browserEvent.on("dom-content-changed", this.onDomContentChanged.bind(this));
    }

    onClick(e) {
        if(e.target.hasAttribute("data-toggler")) {
            let id = e.target.getAttribute("data-toggler");
            this.toggle(this.togglers[id]);
        }
    }

    onDomContentChanged() {
        this.togglers = {};
        let elements = document.querySelectorAll("[data-toggler]");
        elements.forEach((element) => {
            let item = this.create(element);
            this.update(item);
        });
    }

    toggle(item) {
        item.state = item.state === "on" ? "off" : "on";
        this.update(item);
    }

    update(item) {
        if(item.on && item.off) {
            item.on.style.display = item.state === "on" ? "" : "none";
            item.off.style.display = item.state === "off" ? "" : "none";
        }
        if(item.expandArea) {
            if(item.state === "on") {
                item.expandArea.style.height = item.expandArea.scrollHeight + "px";
            }
            if (item.state === "off") {
                item.expandArea.style.height = "";
            }
        }
    }

    create(element) {
        let id = element.getAttribute("data-toggler");
        let on = element.getAttribute("data-toggler-on");
        let off = element.getAttribute("data-toggler-off");
        let expandArea = element.getAttribute("data-toggler-expand-area");
        let item = {
            state: element.getAttribute("data-toggler-state") || "on",
            on: document.getElementById(on),
            off: document.getElementById(off),
            expandArea: document.getElementById(expandArea)
        };
        this.togglers[id] = item;
        return item;
    }
}

export default Toggler;
