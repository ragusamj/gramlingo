class WorldMapListener {

    constructor(browserEvent, worldMap) {
        this.browserEvent = browserEvent;
        this.worldMap = worldMap;
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("click", this.worldMap.onClick.bind(this.worldMap)),
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