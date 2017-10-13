class WorldMapListener {

    constructor(browserEvent, worldMap) {
        this.browserEvent = browserEvent;
        this.worldMap = worldMap;
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("click", this.worldMap.onClick.bind(this.worldMap)),
            this.browserEvent.on("mousedown", this.worldMap.onMousedown.bind(this.worldMap)),
            this.browserEvent.on("mousemove", this.worldMap.onMousemove.bind(this.worldMap)),
            this.browserEvent.on("mouseup", this.worldMap.onMouseup.bind(this.worldMap)),
            this.browserEvent.on("resize", this.worldMap.onResize.bind(this.worldMap)),
            this.browserEvent.on("wheel", this.worldMap.onWheel.bind(this.worldMap))
        ];
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }
}

export default WorldMapListener;