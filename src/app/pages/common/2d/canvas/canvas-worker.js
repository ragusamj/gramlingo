import easings from "../../../../core/animation/easings";
import Shape from "../shape";

const mouseButtons = {
    main: 0
};

class CanvasWorker {

    constructor(browserEvent, canvas) {
        this.browserEvent = browserEvent;
        this.canvas = canvas;

        this.direction = 1;
        this.lastScrollEvent = Date.now();
    }

    select(e) {
        if(!this.dragging && this.isCanvasEvent(e)) {
            let point = this.canvas.offsetPointToOrigin([e.clientX, e.clientY]);
            for(let geometry of this.canvas.geometries) {
                for(let polygon of geometry.polygons) {
                    if(Shape.inside(point, polygon) && geometry.id) {
                        this.browserEvent.emit("canvas-geometry-clicked", { canvas: this.canvas.id, id: geometry.id });
                        this.canvas.setMarker(geometry.centroid);
                        this.canvas.draw();
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
            requestAnimationFrame(() => {
                let mousePoint = this.canvas.toCanvasPoint(e.clientX, e.clientY);
                if(this.dragStartPoint) {
                    this.canvas.move(
                        // delta = dragStartPoint - mousePoint // how many pixels did the mouse move
                        // delta / z                           // make the delta smaller when the scale increases (zooming in) and vice versa
                        // * this.canvas.h|v                   // keep the image centered around the zooming center
                        ((this.dragStartPoint[0] - mousePoint[0]) / this.canvas.z) * this.canvas.h,
                        ((this.dragStartPoint[1] - mousePoint[1]) / this.canvas.z) * this.canvas.v,
                        0
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
                this.zoom(-2);
            }
            if(e.target.hasAttribute("data-map-zoom-out")) {
                this.zoom(2);
            }
            if(e.target.hasAttribute("data-map-pan-up")) {
                this.canvas.move(0, -100, 0);
            }
            if(e.target.hasAttribute("data-map-pan-down")) {
                this.canvas.move(0, 100, 0);
            }
            if(e.target.hasAttribute("data-map-pan-left")) {
                this.canvas.move(-100, 0, 0);
            }
            if(e.target.hasAttribute("data-map-pan-right")) {
                this.canvas.move(100, 0, 0);
            }
            if(e.target.hasAttribute("data-map-reset")) {
                cancelAnimationFrame(this.animationId);
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
            /*
            let mousePoint = this.canvas.toCanvasPoint(e.clientX, e.clientY);
            this.canvas.center(
                this.canvas.element.width / mousePoint[0],
                this.canvas.element.height / mousePoint[1]
            );
            */
            this.zoom(e.deltaY);
        }
    }

    zoom(delta) {

        let direction = delta < 0 ? 1 : 0;
        delta = delta < 0 ? delta * -1 : delta;

        if(delta <= 1) {
            return;
        }

        if(this.scrollTimeDelta() < 60) {
            if(this.direction === direction) {
                return;
            }
            else {
                this.direction = direction;
                cancelAnimationFrame(this.animationId);
            }
        }

        this.direction = direction;
        cancelAnimationFrame(this.animationId);

        let frames = delta * 10;
        let tweens = [];

        for(let frame = 0; frame < frames; frame++) {
            let t = (frame / 60) / delta;
            let factor = easings.easeInOutSine(t);
            tweens.push(factor * this.canvas.z);
        }

        let animate = () => {
            frames--;
            if(frames >= 0) {
                this.canvas.move(0, 0, direction ? tweens[frames] : -tweens[frames]);
                this.animationId = requestAnimationFrame(animate);
            }
        };
        this.animationId = requestAnimationFrame(animate);
    }

    scrollTimeDelta() {
        let now = Date.now();
        let delta = now - this.lastScrollEvent;
        this.lastScrollEvent = now;
        return delta;
    }

    isCanvasEvent(e) {
        return e.target && e.target.id === this.canvas.id;
    }
}

export default CanvasWorker;