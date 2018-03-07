/*
const vertexShaderSource = `
attribute vec4 a_position;
uniform mat4 u_matrix;
void main() {
    gl_Position = u_matrix * a_position;
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_color;
void main() {
    gl_FragColor = u_color;
}
`;

const pointSize = 2;
*/
class WebglContext {

    /*
    initialize(id, data) {

        this.gl = document
            .getElementById(id)
            .getContext("webgl");

        const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = this.createProgram(this.gl, vertexShader, fragmentShader);

        const positionLocation = this.gl.getAttribLocation(program, "a_position");
        this.colorLocation = this.gl.getUniformLocation(program, "u_color");
        this.matrixLocation = this.gl.getUniformLocation(program, "u_matrix");

        this.gl.useProgram(program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, pointSize, this.gl.FLOAT, false, 0, 0);

        return this.gl; 
    }

    createShader(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            gl.deleteShader(shader);
            throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.getProgramParameter(program, gl.LINK_STATUS);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            gl.deleteProgram(program);
            throw new Error(gl.getProgramInfoLog(program));
        }
        return program;
    }*/
}

export default WebglContext;