import Label from "./label";
import Marker from "./marker";

const nameVisibleThreshold = 1.5;

const m3 = {
    projection: function(width, height) {
        // Note: This matrix flips the Y axis so that 0 is at the top.
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ];
    },
  
    identity: function() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    },
  
    translation: function(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },
  
    rotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },
  
    scaling: function(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    },
  
    multiply: function(a, b) {
        let a00 = a[0 * 3 + 0];
        let a01 = a[0 * 3 + 1];
        let a02 = a[0 * 3 + 2];
        let a10 = a[1 * 3 + 0];
        let a11 = a[1 * 3 + 1];
        let a12 = a[1 * 3 + 2];
        let a20 = a[2 * 3 + 0];
        let a21 = a[2 * 3 + 1];
        let a22 = a[2 * 3 + 2];
        let b00 = b[0 * 3 + 0];
        let b01 = b[0 * 3 + 1];
        let b02 = b[0 * 3 + 2];
        let b10 = b[1 * 3 + 0];
        let b11 = b[1 * 3 + 1];
        let b12 = b[1 * 3 + 2];
        let b20 = b[2 * 3 + 0];
        let b21 = b[2 * 3 + 1];
        let b22 = b[2 * 3 + 2];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
};

const vertexShaderSource = 
"attribute vec2 a_position;\n" +
"uniform mat3 u_matrix;\n" +
"void main() {\n" +
"    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);\n" +
"}";

const fragmentShaderSource = 
"precision mediump float;\n" +
"uniform vec4 u_color;" +
"void main() {\n" +
"    gl_FragColor = u_color;\n" +
"}";

class Canvas {

    constructor(id) {
        this.id = id;
    }

    initialize(geometries, styles) {
        this.geometries = geometries;
        this.randomGeometries = this.randomizeRectangles();

        this.element = document.getElementById(this.id);
        this.gl = this.element.getContext("webgl");

        const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.createProgram(this.gl, vertexShader, fragmentShader);

        // look up where the vertex data needs to go.
        this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
  
        // lookup uniforms
        this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
        this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");

        this.positionBuffer = this.gl.createBuffer();
        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        
        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2;               // 2 components per iteration
        let type = this.gl.FLOAT;   // the data is 32bit floats
        let normalize = true;      // don't normalize the data
        let stride = 0;             // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;             // start at the beginning of the buffer
        this.gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);

        this.originalWidth = this.element.width;
        this.originalHeight = this.element.height;
        this.marker = new Marker(styles.marker);
        this.renderLabels(styles.label);
        this.resize();
    }

    createShader(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        return shader;
        /*
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        */
    }

    createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.getProgramParameter(program, gl.LINK_STATUS);
        return program;
        /*
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        */
    }

    renderLabels(style) {
        this.labels = {};
        for(let geometry of this.geometries) {
            if(geometry.label) {
                let label = new Label(geometry.label, style);
                this.labels[geometry.id] = label;
            }
        }
    }

    resize() {
        let aspectRatio = this.element.height / this.element.width;
        let parentClientRect = this.element.parentElement.getBoundingClientRect();
        this.element.width = parentClientRect.width * 2;
        this.element.height = (parentClientRect.width * aspectRatio) * 2;
        this.element.style.width = parentClientRect.width + "px";
        this.element.style.height = (parentClientRect.width * aspectRatio) + "px";
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.reset();
    }

    setMarker(point) {
        this.markerPoint = point;
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
    center(h, v) {
        this.h = h;
        this.v = v;
    }

    move(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        this.draw();
    }

    reset() {
        let bounds = this.getInitialBounds();
        this.x = bounds.x;
        this.y = bounds.y;
        this.z = bounds.z;
        this.scale = [1, 1];
        this.center(2, 2);
        this.draw();
    }

    getInitialBounds() {
        return {
            x: this.originalWidth - this.element.width,
            y: this.originalHeight - this.element.height,
            z: this.element.width / this.originalWidth
        };
    }

    randomInt(range) {
        return Math.floor(Math.random() * range);
    }

    randomizeRectangles() {
        let rectangles = [];

        for (let i = 0; i < 200; ++i) {
            rectangles.push({
                x: this.randomInt(300),
                y: this.randomInt(300),
                width: this.randomInt(300),
                height: this.randomInt(300),
                color: {
                    r: 0,
                    g: Math.random(),
                    b: Math.random(),
                    a: 0.75
                }
            });
        }

        return rectangles;
    }

    setRectangle(gl, x, y, width, height) {
        let x1 = x;
        let x2 = x + width;
        let y1 = y;
        let y2 = y + height;
       
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2]), gl.STATIC_DRAW);
    }

    zoom(x, y) {
        this.scale[0] += x;
        this.scale[1] += y;
        this.draw();
    }
    
    draw() {

        let translation = [0, 0];

        // Compute the matrices
        let projectionMatrix = m3.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        let translationMatrix = m3.translation(translation[0], translation[1]);
        let scaleMatrix = m3.scaling(this.scale[0], this.scale[1]);

        // Multiply the matrices.
        let matrix = m3.multiply(translationMatrix, scaleMatrix);
        matrix = m3.multiply(matrix, projectionMatrix);

        // Set the matrix.
        this.gl.uniformMatrix3fv(this.matrixLocation, false, matrix);

        for(let geometry of this.randomGeometries) {
            this.setRectangle(
                this.gl,
                geometry.x,
                geometry.y,
                geometry.width,
                geometry.height
            );

            this.gl.uniform4f(this.colorLocation, geometry.color.r, geometry.color.g, geometry.color.b, geometry.color.a);
            
            // Draw the rectangle.
            let primitiveType = this.gl.TRIANGLES;
            let offset = 0;
            let count = 6;
            this.gl.drawArrays(primitiveType, offset, count);
        }
    }

    label(geometries) {
        if(this.z > 1) {
            for(let geometry of geometries) {
                let label = this.labels[geometry.id];
                if(label && (geometry.max.length * this.z) / label.width > nameVisibleThreshold) {
                    let point = this.offsetPointToCanvas(geometry.centroid);
                    point[0] -= label.width / 2;
                    point[1] += 8;
                    this.gl.drawImage(label.canvas, point[0], point[1]);
                }
            }
        }
    }

    mark() {
        let point = this.offsetPointToCanvas(this.markerPoint);
        point[0] -= this.marker.width / 2;
        point[1] -= this.marker.height + this.z - (this.marker.style.border.width * 2);
        this.gl.drawImage(this.marker.canvas, point[0], point[1]);
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
    