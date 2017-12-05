import Buffer from "./buffer";
import M4 from "./m4";

const mouseButtons = {
    main: 0
};

class Canvas {

    constructor(id, selector, webglContext) {
        this.id = id;
        this.context = webglContext;
        this.selector = selector;
    }

    initialize(geometries) {
        this.geometries = geometries;

        const buffer = Buffer.create(geometries);
        this.bufferByColor = buffer.byColor;
        this.gl = this.context.initialize(this.id, buffer.data);

        this.matrices = [
            M4.orthographic(0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1),
            new Float32Array(16), // Translate
            new Float32Array(16), // X rotation
            new Float32Array(16), // Y rotation
            new Float32Array(16), // Z rotation
            new Float32Array(16), // Scale
            new Float32Array(16), // Centering translate
        ];

        this.onResize();
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
        this.rotation = [this.degreesToRadians(0), this.degreesToRadians(0), this.degreesToRadians(0)];
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
        if(!this.dragging && this.isCanvasEvent(e)) {
            const clickedLocation = this.toCanvasVector(e.clientX, e.clientY);
            this.selector.select(clickedLocation, this.gl.canvas, this.geometries, this.matrices);
        }
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

        M4.translate(this.matrices[0], this.translation[0], this.translation[1], this.translation[2], this.matrices[1]);
        M4.xRotate(this.matrices[1], this.rotation[0], this.matrices[2]);
        M4.yRotate(this.matrices[2], this.rotation[1], this.matrices[3]);
        M4.zRotate(this.matrices[3], this.rotation[2], this.matrices[4]);
        M4.scale(this.matrices[4], this.scale, this.scale, this.scale, this.matrices[5]);
        M4.translate(this.matrices[5], this.centerTranslation[0], this.centerTranslation[1], this.centerTranslation[2], this.matrices[6]);

        this.gl.uniformMatrix4fv(this.context.matrixLocation, false, this.matrices[this.matrices.length - 1]);
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
    