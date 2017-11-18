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

        const canvas = document.getElementById(this.id);
        const gl = canvas.getContext("webgl");
        this.gl = gl;

        //this.resize();

        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        let program = this.createProgram(gl, vertexShader, fragmentShader);
        
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        let colorLocation = gl.getUniformLocation(program, "u_color");
        let matrixLocation = gl.getUniformLocation(program, "u_matrix");

        let positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        let data = [];

        for(let geometry of geometries) {
            for(let polygon of geometry.polygons) {

                let positions = [];

                for(let point of polygon) {
                    positions.push(point[0], point[1]);
                }

                let triangles = earcut(positions);
            
                for(let t of triangles) {
                    let i = t * 2;
                    data.push(positions[i], positions[i + 1]);
                }
            }
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        let translation = [0, 0];
        let angleInRadians = 0;
        let scale = [0.5, 0.5];

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttributeLocation);

        let matrix = M3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = M3.translate(matrix, translation[0], translation[1]);
        matrix = M3.rotate(matrix, angleInRadians);
        matrix = M3.scale(matrix, scale[0], scale[1]);

        gl.uniformMatrix3fv(matrixLocation, false, matrix);
        
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2;          // 2 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        for(let i = 0; i < data.length / size; i += 3) {
            gl.uniform4fv(colorLocation, [Math.random(), Math.random(), Math.random(), 1]);
            gl.drawArrays(gl.TRIANGLES, i, 3);
        }
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
        let parentClientRect = this.gl.canvas.parentElement.getBoundingClientRect();
        this.gl.canvas.width = parentClientRect.width * 2;
        this.gl.canvas.height = (parentClientRect.width * aspectRatio) * 2;
        this.gl.canvas.style.width = parentClientRect.width + "px";
        this.gl.canvas.style.height = (parentClientRect.width * aspectRatio) + "px";
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    setMarker(point) {
        this.markerPoint = point;
    }
}
    
export default Canvas;
    