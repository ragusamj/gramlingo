class WorldMapListener {

    constructor(browserEvent, worldMap) {
        this.browserEvent = browserEvent;
        this.worldMap = worldMap;
    }

    initialize() {
        this.removeClickListener = this.browserEvent.on("click", this.onClick.bind(this));
        this.removeMousedownListener = this.browserEvent.on("mousedown", this.onMousedown.bind(this));
        this.removeMousemoveListener = this.browserEvent.on("mousemove", this.onMousemove.bind(this));
        this.removeMousemupListener = this.browserEvent.on("mouseup", this.onMouseup.bind(this));
        this.removeWheelListener = this.browserEvent.on("wheel", this.onWheel.bind(this));
        this.worldMap.initialize();
    }

    destroy() {
        this.removeClickListener();
        this.removeMousedownListener();
        this.removeMousemoveListener();
        this.removeMousemupListener();
        this.removeWheelListener();
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

    onMousedown(e) {
        this.worldMap.startDrag(e);
    }

    onMousemove(e) {
        this.worldMap.drag(e);
    }

    onMouseup() {
        this.worldMap.endDrag();
    }

    onWheel(e) {
        this.worldMap.scroll(e);
    }
}

export default WorldMapListener;