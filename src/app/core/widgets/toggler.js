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
        item.on.style.display = item.state === "on" ? "" : "none";
        item.off.style.display = item.state === "off" ? "" : "none";
    }

    create(element) {
        let id = element.getAttribute("data-toggler");
        let on = element.getAttribute("data-toggler-on");
        let off = element.getAttribute("data-toggler-off");
        let state = element.getAttribute("data-toggler-state") || "on";
        let item = {
            state: state,
            on: document.getElementById(on),
            off: document.getElementById(off)
        };
        this.togglers[id] = item;
        return item;
    }
}

export default Toggler;
