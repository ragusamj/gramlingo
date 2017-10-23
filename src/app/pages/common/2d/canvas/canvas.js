import Label from "./label";

const nameVisibleThreshold = 20;

class Canvas {

    constructor(id) {
        this.id = id;
    }

    initialize(geometries) {
        this.geometries = geometries;
        this.element = document.getElementById(this.id);
        this.context = this.element.getContext("2d");
        this.originalWidth = this.element.width;
        this.originalHeight = this.element.height;
        this.countryLabel = new Label(this.context, "'Montserrat', sans-serif", 75, "#fff", "rgba(0, 0, 0, 0.5");
        this.resize();
    }

    resize() {
        let aspectRatio = this.element.height / this.element.width;
        let parentClientRect = this.element.parentElement.getBoundingClientRect();
        this.element.width = parentClientRect.width * 2;
        this.element.height = (parentClientRect.width * aspectRatio) * 2;
        this.element.style.width = parentClientRect.width + "px";
        this.element.style.height = (parentClientRect.width * aspectRatio) + "px";
        this.reset();
    }
    
    toCanvasPoint(x, y) {
        let rect = this.element.getBoundingClientRect();
        let scaleX = (this.element.width / rect.width);
        let scaleY = (this.element.height / rect.height);
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
            (((this.element.width + this.x) * this.z) - this.element.width) / this.h,
            (((this.element.height + this.y) * this.z) - this.element.height) / this.v
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
        this.x = this.originalWidth - this.element.width;
        this.y = this.originalHeight - this.element.height;
        this.z = this.element.width / this.originalWidth;
        this.h = 2;
        this.v = 2;
        this.draw();
    }
    
    draw() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.calculateOffset();

        let visibleGeometries = this.filterVisibleGeometries();

        for(let geometry of visibleGeometries) {
            this.context.beginPath();
            for(let polygon of geometry.polygons) {
                for(let i = 0; i < polygon.length; i++) {
                    let point = this.offsetPointToCanvas(polygon[i]);
                    if(i === 0) {
                        this.context.moveTo(point[0], point[1]);
                    }
                    else {
                        this.context.lineTo(point[0], point[1]);
                    }
                }
            }
            this.context.fillStyle = geometry.color;
            this.context.fill();
        }
        this.label(visibleGeometries);
    }

    label(geometries) {
        if(this.z > 1) {
            for(let geometry of geometries) {
                if(geometry.label && (geometry.max.length * this.z) / geometry.label.length > nameVisibleThreshold) {
                    let point = this.offsetPointToCanvas(geometry.centroid);
                    this.countryLabel.draw(point, geometry.label);
                }
            }
        }
    }

    filterVisibleGeometries() {
        let visibleGeometries = [];
        for(let geometry of this.geometries) {
            let visible = false;
            for(let polygon of geometry.polygons) {
                for(let i = 0; i < polygon.length; i++) {
                    let point = this.offsetPointToCanvas(polygon[i]);
                    if(this.isVisible(point)) {
                        visible = true;
                    }
                }
            }
            if(visible) {
                visibleGeometries.push(geometry);
            }
        }
        return visibleGeometries; 
    }

    isVisible(point) {
        return point[0] >= 0 && point[1] >= 0 && point[0] <= this.element.width && point[1] <= this.element.height;
    }
}
    
export default Canvas;
    