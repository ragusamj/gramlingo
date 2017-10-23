import debounce from "../../../../core/event/debounce";

const resizeDelay = 100;

class CanvasListener {

    constructor(browserEvent, worker) {
        this.browserEvent = browserEvent;
        this.worker = worker;
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("mousedown", this.worker.onMousedown.bind(this.worker)),
            this.browserEvent.on("mousemove", this.worker.onMousemove.bind(this.worker)),
            this.browserEvent.on("mouseup", this.worker.onMouseup.bind(this.worker)),
            this.browserEvent.on("resize", debounce(this.worker.onResize.bind(this.worker), resizeDelay)),
            this.browserEvent.on("wheel", this.worker.onWheel.bind(this.worker))
        ];
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }
}

export default CanvasListener;