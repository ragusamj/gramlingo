import polylabel from "polylabel";
import Label from "./label";
import Shape from "../shape";

const nameVisibleThreshold = 20;

const mouseButtons = {
    main: 0
};

class Canvas {

    constructor(canvas, geometries) {
        this.canvas = canvas;
        this.geometries = geometries;
        this.context = this.canvas.getContext("2d");
        this.originalWidth = this.canvas.width;
        this.originalHeight = this.canvas.height;
        this.countryLabel = new Label(this.context, "'Montserrat', sans-serif", 75, "#fff", "rgba(0, 0, 0, 0.5");
    
        for(let geometry of this.geometries) {
            geometry.max = Shape.max(geometry.polygons);
            geometry.centroid = polylabel([geometry.max], 0.5);
        }
    }

    resize() {
        let aspectRatio = this.canvas.height / this.canvas.width;
        let parentClientRect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = parentClientRect.width * 2;
        this.canvas.height = (parentClientRect.width * aspectRatio) * 2;
        this.canvas.style.width = parentClientRect.width + "px";
        this.canvas.style.height = (parentClientRect.width * aspectRatio) + "px";
        this.reset();
    }

    select(e) {
        if(!this.dragging) {
            let point = this.offsetPointToOrigin([e.clientX, e.clientY]);
            let i = this.geometries.length;
            // Loop backwards to try smaller polygons drawn on top of larger ones first
            while(i--) {
                for(let polygon of this.geometries[i].polygons) {
                    if(Shape.inside(point, polygon)) {
                        return this.geometries[i];
                    }
                }
            }
        }
        return undefined;
    }

    beginDrag(e) {
        if(e.button === mouseButtons.main) {
            this.dragStartPoint = this.toCanvasPoint(e.clientX, e.clientY);
        }
    }

    drag(e) {
        if(this.dragStartPoint) {
            this.dragging = true;
            let mousePoint = this.toCanvasPoint(e.clientX, e.clientY);
            requestAnimationFrame(() => {
                if(this.dragStartPoint) {
                    this.move(
                        // delta = dragStartPoint - mousePoint // how many pixels did the mouse move
                        // delta / z                           // make the delta smaller when the scale increases (zooming in) and vice versa
                        // * 2                                 // keep the image centered around the mouse pointer
                        ((this.dragStartPoint[0] - mousePoint[0]) / this.z) * 2,
                        ((this.dragStartPoint[1] - mousePoint[1]) / this.z) * 2,
                        0, 2, 2
                    );
                    this.dragStartPoint = mousePoint;
                }
            });
        }
    }

    endDrag() {
        this.dragStartPoint = undefined;
        this.dragging = false;
    }

    zoom(delta) {
        requestAnimationFrame(() => {
            // (speed / scale) // set the zooming speed and maintain the same speed regardless of scale
            // * -1            // reverse the zoom gesture
            // TODO, use dynamic values for h,v
            this.move(0, 0, delta / (100 / this.z) * -1, 2, 2);
        });
    }
    
    toCanvasPoint(x, y) {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = (this.canvas.width / rect.width);
        let scaleY = (this.canvas.height / rect.height);
        return [
            ((x - rect.left) * scaleX),
            ((y - rect.top) * scaleY)
        ];
    }

    offsetPointToCanvas(point) {
        return [
            (point[0] * this.z) - this.offset[0],
            (point[1] * this.z) - this.offset[1]
        ];
    }

    offsetPointToOrigin(point) {
        let canvasPoint = this.toCanvasPoint(point[0], point[1]);
        return [
            (canvasPoint[0] + this.offset[0]) / this.z,
            (canvasPoint[1] + this.offset[1]) / this.z
        ];
    }

    calculateOffset() {
        this.offset = [
            (((this.canvas.width + this.x) * this.z) - this.canvas.width) / this.h,
            (((this.canvas.height + this.y) * this.z) - this.canvas.height) / this.v
        ];
    }

    // h and v, where is the center point when zooming:
    // h: 1=right,  2=middle, canvas.width=left
    // v: 1=bottom, 2=middle, canvas.height=top
    move(x, y, z, h, v) {
        this.x += x;
        this.y += y;
        this.z += z;
        this.h = h;
        this.v = v;
        this.draw();
    }

    reset() {
        this.x = this.originalWidth - this.canvas.width;
        this.y = this.originalHeight - this.canvas.height;
        this.z = this.canvas.width / this.originalWidth;
        this.h = 2;
        this.v = 2;
        this.draw();
    }
    
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.calculateOffset();
        for(let geometry of this.geometries) {
            for(let polygon of geometry.polygons) {
                this.context.beginPath();
                for(let i = 0; i < polygon.length; i++) {
                    let point = this.offsetPointToCanvas(polygon[i]);
                    if(i === 0) {
                        this.context.moveTo(point[0], point[1]);
                    }
                    else {
                        this.context.lineTo(point[0], point[1]);
                    }
                }
                this.context.fillStyle = geometry.color;
                this.context.fill();
            }
        }
        this.label();
    }

    label() {
        if(this.z > 1) {
            for(let geometry of this.geometries) {
                if(geometry.label && (geometry.max.length * this.z) / geometry.label.length > nameVisibleThreshold) {
                    let point = this.offsetPointToCanvas(geometry.centroid);
                    this.countryLabel.draw(point, geometry.label);
                }
            }
        }
    }
}
    
export default Canvas;
    