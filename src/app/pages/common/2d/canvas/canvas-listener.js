import debounce from "../../../../core/event/debounce";

const resizeDelay = 100;

class CanvasListener {

    constructor(browserEvent, canvas) {
        this.browserEvent = browserEvent;
        this.canvas = canvas;
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("mousedown", this.canvas.onMousedown.bind(this.canvas)),
            this.browserEvent.on("mousemove", this.canvas.onMousemove.bind(this.canvas)),
            this.browserEvent.on("mouseup", this.canvas.onMouseup.bind(this.canvas)),
            this.browserEvent.on("resize", debounce(this.canvas.onResize.bind(this.canvas), resizeDelay)),
            this.browserEvent.on("wheel", this.canvas.onWheel.bind(this.canvas))
        ];
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }
}

export default CanvasListener;