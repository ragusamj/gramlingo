import Buffer from "./buffer";
import M3 from "./m3";

const mouseButtons = {
    main: 0
};

class Canvas {

    constructor(id, context) {
        this.id = id;
        this.context = context;
    }

    initialize(geometries) {
        this.geometries = geometries;

        const buffer = Buffer.create(geometries);
        this.bufferByColor = buffer.byColor;
        this.context.initialize(this.id, buffer.data);
        this.gl = this.context.gl;
        
        this.onResize();
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
        this.scale = this.gl.canvas.clientWidth / (this.gl.canvas.width);
        this.viewportScale = this.scale;
        this.translation = [0, 0];
        this.h = 2;
        this.v = 2;
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
                    this.translation[0] -= (this.dragStartPoint[0] - mousePoint[0]) * this.viewportScale;
                    this.translation[1] -= (this.dragStartPoint[1] - mousePoint[1]) * this.viewportScale;
                    this.dragStartPoint = mousePoint;
                    this.draw();
                }
            });
        }
    }

    onMouseup() {
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
        this.translation[0] -= z * (this.gl.canvas.width / this.h);
        this.translation[1] -= z * (this.gl.canvas.height / this.v);
        this.draw();
    }

    draw() {
        let matrix = M3.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        matrix = M3.translate(matrix, this.translation[0], this.translation[1]);
        matrix = M3.scale(matrix, this.scale, this.scale);
        this.gl.uniformMatrix3fv(this.context.matrixLocation, false, matrix);
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

    isCanvasEvent(e) {
        return e.target && e.target.id === this.id;
    }
}
    
export default Canvas;
    