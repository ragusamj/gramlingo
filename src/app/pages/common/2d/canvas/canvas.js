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

        this.projection = M4.projection(this.gl.canvas.width, this.gl.canvas.height, this.gl.canvas.width);

        this.onResize();
    }

    select(e) {
        if(!this.dragging && this.isCanvasEvent(e)) {
            let vector = this.toCanvasVector(e.clientX, e.clientY);

            let t = M4.inverse(M4.translation(this.translation[0], this.translation[1], this.translation[2]));
            let rz = M4.inverse(M4.zRotation(this.rotation[2]));
            let s = M4.inverse(M4.scaling(this.scale, this.scale, this.scale));
            let tc = M4.inverse(M4.translation(this.centerTranslation[0], this.centerTranslation[1], this.centerTranslation[2]));

            vector = M4.transformVector(t, vector);
            vector = M4.transformVector(rz, vector);
            vector = M4.transformVector(s, vector);
            vector = M4.transformVector(tc, vector);

            for(let geometry of this.geometries) {
                if(geometry.type === "Polygon") {
                    if(Shape.inside(vector, geometry.polygons[0])) {
                        this.browserEvent.emit("canvas-geometry-clicked", { canvas: this.id, id: geometry.id });
                        return;
                    }
                }
                if(geometry.type === "MultiPolygon") {
                    for(let polygons of geometry.polygons) {
                        if(Shape.inside(vector, polygons[0])) {
                            this.browserEvent.emit("canvas-geometry-clicked", { canvas: this.id, id: geometry.id }); 
                            return;
                        }
                    }
                }
            }
        }
    }

    toCanvasVector(x, y) {
        let rect = this.gl.canvas.getBoundingClientRect();
        let scaleX = (this.gl.canvas.width / rect.width);
        let scaleY = (this.gl.canvas.height / rect.height);
        return [
            ((x - rect.left) * scaleX),
            ((y - rect.top) * scaleY),
            0,
            1
        ];
    }

    onResize() {
        let aspectRatio = this.gl.canvas.height / this.gl.canvas.width;
        let width = this.gl.canvas.parentElement.clientWidth;
        let height = (width * aspectRatio);
        this.gl.canvas.style.width = width + "px";
        this.gl.canvas.style.height = height + "px";
        this.gl.canvas.parentElement.style.height = height + "px";

        this.scale = 1;
        this.rotation = [this.degreesToRadians(35), this.degreesToRadians(25), this.degreesToRadians(325)];
        this.translation = [this.gl.canvas.width / 2, this.gl.canvas.height / 2, 0];
        this.centerTranslation = [this.gl.canvas.width / -2, this.gl.canvas.height / -2, 0];

        this.draw();
    }

    onMousedown(e) {
        if(this.isCanvasEvent(e) && e.button === mouseButtons.main) {
            this.dragStartVector = this.toCanvasVector(e.clientX, e.clientY);
        }
    }

    onMousemove(e) {
        if(this.dragStartVector && this.isCanvasEvent(e)) {
            this.dragging = true;
            requestAnimationFrame(() => {
                let mouseVector = this.toCanvasVector(e.clientX, e.clientY);
                if(this.dragStartVector) {
                    this.translation[0] -= (this.dragStartVector[0] - mouseVector[0]);
                    this.translation[1] -= (this.dragStartVector[1] - mouseVector[1]);
                    this.dragStartVector = mouseVector;
                    this.draw();
                }
            });
        }
    }

    onMouseup(e) {
        this.select(e);
        this.dragStartVector = undefined;
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
    