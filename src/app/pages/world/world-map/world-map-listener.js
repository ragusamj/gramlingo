import debounce from "lodash.debounce";

const resizeDelay = 25;

class WorldMapListener {

    constructor(browserEvent, worldMap) {
        this.browserEvent = browserEvent;
        this.worldMap = worldMap;
        this.debouncedResize = debounce(this.worldMap.onResize.bind(this.worldMap), resizeDelay);
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("click", this.worldMap.onClick.bind(this.worldMap)),
            this.browserEvent.on("mousedown", this.worldMap.onMousedown.bind(this.worldMap)),
            this.browserEvent.on("mousemove", this.worldMap.onMousemove.bind(this.worldMap)),
            this.browserEvent.on("mouseup", this.worldMap.onMouseup.bind(this.worldMap)),
            this.browserEvent.on("resize", this.debouncedResize),
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