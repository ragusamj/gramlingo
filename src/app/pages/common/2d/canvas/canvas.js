import Buffer from "./buffer";
import M4 from "./m4";
import Shape from "../shape";

const mouseButtons = {
    main: 0
};

class Canvas {

    constructor(browserEvent, id, context) {
        this.browserEvent = browserEvent;
        this.id = id;
        this.context = context;
    }

    initialize(geometries) {
        this.geometries = geometries;

        const buffer = Buffer.create(geometries);
        this.bufferByColor = buffer.byColor;
        this.gl = this.context.initialize(this.id, buffer.data);

        this.onResize();
    }

    select(e) {
        if(!this.dragging && this.isCanvasEvent(e)) {
            const point = this.toCanvasPoint(e.clientX, e.clientY);
            const matrix = M4.multiply(this.inverseProjection, this.matrix);

            point[0] = (point[0] - matrix[12]) / this.scale;
            point[1] = (point[1] - matrix[13]) / this.scale;

            for(let geometry of this.geometries) {
                if(geometry.type === "Polygon") {
                    if(Shape.inside(point, geometry.polygons[0])) {
                        this.browserEvent.emit("canvas-geometry-clicked", { canvas: this.id, id: geometry.id });
                        return;
                    }
                }
                if(geometry.type === "MultiPolygon") {
                    for(let polygons of geometry.polygons) {
                        if(Shape.inside(point, polygons[0])) {
                            this.browserEvent.emit("canvas-geometry-clicked", { canvas: this.id, id: geometry.id }); 
                            return;
                        }
                    }
                }
            }
        }
    }

    toCanvasPoint(x, y) {
        let rect = this.gl.canvas.getBoundingClientRect();
        let scaleX = (this.gl.canvas.width / rect.width);
        let scaleY = (this.gl.canvas.height / rect.height);
        return [
            ((x - rect.left) * scaleX),
            ((y - rect.top) * scaleY)
        ];
    }

    onResize() {
        let aspectRatio = this.gl.canvas.height / this.gl.canvas.width;
        let width = this.gl.canvas.parentElement.clientWidth;
        let height = (width * aspectRatio);
        this.gl.canvas.style.width = width + "px";
        this.gl.canvas.style.height = height + "px";
        this.gl.canvas.parentElement.style.height = height + "px";

        this.projection = M4.projection(this.gl.canvas.width, this.gl.canvas.height, this.gl.canvas.width);
        this.inverseProjection = M4.inverse(this.projection);
        this.scale = 1;
        this.rotation = [this.degreesToRadians(0), this.degreesToRadians(0), this.degreesToRadians(0)];
        this.translation = [this.gl.canvas.width / 2, this.gl.canvas.height / 2, 0];
        this.centerTranslation = [this.gl.canvas.width / -2, this.gl.canvas.height / -2, 0];

        this.draw();
    }

    onMousedown(e) {
        if(this.isCanvasEvent(e) && e.button === mouseButtons.main) {
            this.dragStartPoint = this.toCanvasPoint(e.clientX, e.clientY);
        }
    }

    onMousemove(e) {
        if(this.dragStartPoint && this.isCanvasEvent(e)) {
            this.dragging = true;
            requestAnimationFrame(() => {
                let mousePoint = this.toCanvasPoint(e.clientX, e.clientY);
                if(this.dragStartPoint) {
                    this.translation[0] -= (this.dragStartPoint[0] - mousePoint[0]);
                    this.translation[1] -= (this.dragStartPoint[1] - mousePoint[1]);
                    this.dragStartPoint = mousePoint;
                    this.draw();
                }
            });
        }
    }

    onMouseup(e) {
        this.select(e);
        this.dragStartPoint = undefined;
        this.dragging = false;
    }

    onWheel(e) {
        if(this.isCanvasEvent(e)) {
            e.preventDefault();
            requestAnimationFrame(() => {
                this.zoom(e.deltaY / (100 / this.scale) * -1);
            });
        }
    }

    zoom(z) {
        this.scale += z;
        this.draw();
    }

    draw() {

        this.matrix = M4.translate(this.projection, this.translation[0], this.translation[1], this.translation[2]);
        this.matrix = M4.xRotate(this.matrix, this.rotation[0]);
        this.matrix = M4.yRotate(this.matrix, this.rotation[1]);
        this.matrix = M4.zRotate(this.matrix, this.rotation[2]);
        this.matrix = M4.scale(this.matrix, this.scale, this.scale, this.scale);
        this.matrix = M4.translate(this.matrix, this.centerTranslation[0], this.centerTranslation[1], this.centerTranslation[2]);

        this.gl.uniformMatrix4fv(this.context.matrixLocation, false, this.matrix);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        for(let key of Object.keys(this.bufferByColor)) {
            let color = this.bufferByColor[key];
            this.gl.uniform4fv(this.context.colorLocation, color.vec4);
            this.gl.drawArrays(this.gl.TRIANGLES, color.offset, color.length);
        }
    }

    setMarker(point) {
        this.markerPoint = point;
    }

    degreesToRadians(d) {
        return d * Math.PI / 180;
    }

    isCanvasEvent(e) {
        return e.target && e.target.id === this.id;
    }
}
    
export default Canvas;
    