class WorldMapListener {

    constructor(browserEvent, worldMap) {
        this.browserEvent = browserEvent;
        this.worldMap = worldMap;
    }

    attach(selectedIso) {
        this.removeListeners = [
            this.browserEvent.on("click", this.onClick.bind(this)),
            this.browserEvent.on("mousedown", this.worldMap.onMousedown.bind(this.worldMap)),
            this.browserEvent.on("mousemove", this.worldMap.onMousemove.bind(this.worldMap)),
            this.browserEvent.on("mouseup", this.worldMap.onMouseup.bind(this.worldMap)),
            this.browserEvent.on("wheel", this.worldMap.onWheel.bind(this.worldMap))
        ];
        this.worldMap.initialize(selectedIso);
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }

    onClick(e) {
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