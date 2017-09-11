class WorldMapListener {

    constructor(browserEvent, worldMap) {
        this.browserEvent = browserEvent;
        this.worldMap = worldMap;
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("click", this.onClick.bind(this)),
            this.browserEvent.on("mousedown", this.worldMap.startDrag.bind(this.worldMap)),
            this.browserEvent.on("mousemove", this.worldMap.drag.bind(this.worldMap)),
            this.browserEvent.on("mouseup", this.worldMap.endDrag.bind(this.worldMap)),
            this.browserEvent.on("wheel", this.worldMap.scroll.bind(this.worldMap))
        ];
        this.worldMap.initialize();
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }

    onClick(e) {
        if(e.target.hasAttribute("data-iso")) {
            this.worldMap.selectCountry(e.target);
        }
        if(e.target.parentElement.hasAttribute("data-iso")) {
            this.worldMap.selectCountry(e.target.parentElement);
        }
        if(e.target.hasAttribute("data-map-zoom-in")) {
            this.worldMap.zoomIn();
        }
        if(e.target.hasAttribute("data-map-zoom-out")) {
            this.worldMap.zoomOut();
        }
        if(e.target.hasAttribute("data-map-pan-up")) {
            this.worldMap.panUp();
        }
        if(e.target.hasAttribute("data-map-pan-down")) {
            this.worldMap.panDown();
        }
        if(e.target.hasAttribute("data-map-pan-left")) {
            this.worldMap.panLeft();
        }
        if(e.target.hasAttribute("data-map-pan-right")) {
            this.worldMap.panRight();
        }
        if(e.target.hasAttribute("data-map-reset")) {
            this.worldMap.reset();
        }
    }
}

export default WorldMapListener;