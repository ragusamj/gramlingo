import debounce from "lodash.debounce";

const resizeDelay = 25;

class WorldMapListener {

    constructor(browserEvent, worldMap) {
        this.browserEvent = browserEvent;
        this.worldMap = worldMap;
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("mousedown", this.worldMap.onMousedown.bind(this.worldMap)),
            this.browserEvent.on("mousemove", this.worldMap.onMousemove.bind(this.worldMap)),
            this.browserEvent.on("mouseup", this.worldMap.onMouseup.bind(this.worldMap)),
            this.browserEvent.on("resize", debounce(this.worldMap.onResize.bind(this.worldMap), resizeDelay)),
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