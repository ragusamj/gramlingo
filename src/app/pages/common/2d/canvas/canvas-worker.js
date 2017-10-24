import throttle from "../../../../core/event/throttle";
import Shape from "../shape";

const zoomDelay = 1000 / 60 / 2;
const mouseButtons = {
    main: 0
};

class CanvasWorker {

    constructor(browserEvent, canvas) {
        this.browserEvent = browserEvent;
        this.canvas = canvas;
        this.throttledZoom = throttle(this.zoom.bind(this), zoomDelay);
    }

    select(e) {
        if(!this.dragging && this.isCanvasEvent(e)) {
            let point = this.canvas.offsetPointToOrigin([e.clientX, e.clientY]);
            for(let geometry of this.canvas.geometries) {
                for(let polygon of geometry.polygons) {
                    if(Shape.inside(point, polygon) && geometry.id) {
                        this.browserEvent.emit("canvas-geometry-clicked", { canvas: this.canvas.id, id: geometry.id });
                    }
                }
            }
        }
    }

    onMousedown(e) {
        if(this.isCanvasEvent(e)) {
            if(e.button === mouseButtons.main) {
                this.dragStartPoint = this.canvas.toCanvasPoint(e.clientX, e.clientY);
            }
        }
    }

    onMousemove(e) {
        if(this.dragStartPoint && this.isCanvasEvent(e)) {
            this.dragging = true;
            let mousePoint = this.canvas.toCanvasPoint(e.clientX, e.clientY);
            requestAnimationFrame(() => {
                if(this.dragStartPoint) {
                    this.canvas.move(
                        // delta = dragStartPoint - mousePoint // how many pixels did the mouse move
                        // delta / z                           // make the delta smaller when the scale increases (zooming in) and vice versa
                        // * 2                                 // keep the image centered around the mouse pointer
                        ((this.dragStartPoint[0] - mousePoint[0]) / this.canvas.z) * 2,
                        ((this.dragStartPoint[1] - mousePoint[1]) / this.canvas.z) * 2,
                        0, 2, 2
                    );
                    this.dragStartPoint = mousePoint;
                }
            });
        }
    }

    onMouseup(e) {
        this.select(e);
        
        this.dragStartPoint = undefined;
        this.dragging = false;
        
        if(e.target) {
            if(e.target.hasAttribute("data-map-zoom-in")) {
                this.zoom(-50);
            }
            if(e.target.hasAttribute("data-map-zoom-out")) {
                this.zoom(50);
            }
            if(e.target.hasAttribute("data-map-pan-up")) {
                this.canvas.move(0, -100, 0, 2, 2);
            }
            if(e.target.hasAttribute("data-map-pan-down")) {
                this.canvas.move(0, 100, 0, 2, 2);
            }
            if(e.target.hasAttribute("data-map-pan-left")) {
                this.canvas.move(-100, 0, 0, 2, 2);
            }
            if(e.target.hasAttribute("data-map-pan-right")) {
                this.canvas.move(100, 0, 0, 2, 2);
            }
            if(e.target.hasAttribute("data-map-reset")) {
                this.canvas.reset();
            }
        }
    }

    onResize() {
        this.canvas.resize();
    }

    onWheel(e) {
        if(this.isCanvasEvent(e)) {
            e.preventDefault();
            this.throttledZoom(e.deltaY);
        }
    }

    zoom(delta) {
        requestAnimationFrame(() => {
            // (speed / scale) // set the zooming speed and maintain the same speed regardless of scale
            // * -1            // reverse the zoom gesture
            // TODO, use dynamic values for h,v
            this.canvas.move(0, 0, delta / (100 / this.canvas.z) * -1, 2, 2);
        });
    }

    isCanvasEvent(e) {
        return e.target && e.target.id === this.canvas.id;
    }
}

export default CanvasWorker;