import earcut from "earcut";
import M3 from "./m3";

const vertexShaderSource = `
attribute vec2 a_position;
uniform mat3 u_matrix;
void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_color;
void main() {
   gl_FragColor = u_color;
}
`;

class Canvas {

    constructor(id) {
        this.id = id;
    }

    initialize(geometries) {
        this.geometries = geometries;
        this.gl = document
            .getElementById(this.id)
            .getContext("webgl");

        const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = this.createProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(program);
        
        const positionAttributeLocation = this.gl.getAttribLocation(program, "a_position");
        this.colorLocation = this.gl.getUniformLocation(program, "u_color");
        this.matrixLocation = this.gl.getUniformLocation(program, "u_matrix");

        let positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        
        let data = [];

        for(let geometry of geometries) {
            for(let polygon of geometry.polygons) {

                let points = [];

                for(let point of polygon) {
                    points.push(point[0], point[1]);
                }

                let triangles = earcut(points);
            
                for(let t of triangles) {
                    let i = t * 2;
                    data.push(points[i], points[i + 1]);
                }
            }
        }

        this.data = data;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2;          // 2 components per iteration
        let type = this.gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

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

    resize() {
        let aspectRatio = this.gl.canvas.height / this.gl.canvas.width;
        let width = this.gl.canvas.parentElement.clientWidth;
        let height = (width * aspectRatio);
        this.gl.canvas.style.width = width + "px";
        this.gl.canvas.style.height = height + "px";
        this.gl.canvas.parentElement.style.height = height + "px";
        this.draw();
    }

    draw() {

        let zoomPercentage = this.gl.canvas.clientWidth / (this.gl.canvas.width);
        let translation = [0, 0];
        let scale = [zoomPercentage, zoomPercentage];

        let matrix = M3.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        matrix = M3.translate(matrix, translation[0], translation[1]);
        matrix = M3.scale(matrix, scale[0], scale[1]);
        this.gl.uniformMatrix3fv(this.matrixLocation, false, matrix);

        this.gl.uniform4fv(this.colorLocation, [0, 0.7, 0, 1]);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.data.length / 2);
    }

    setMarker(point) {
        this.markerPoint = point;
    }
}
    
export default Canvas;
    