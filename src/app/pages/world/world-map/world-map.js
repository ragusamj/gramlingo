import { default as earcut } from "earcut";
import * as mat4 from "gl-matrix/src/gl-matrix/mat4";
import * as vec2 from "gl-matrix/src/gl-matrix/vec2";
import * as vec3 from "gl-matrix/src/gl-matrix/vec3";
import * as vec4 from "gl-matrix/src/gl-matrix/vec4";
import Color from "../../common/2d/color/color";
import BacktrackingColorizer from "../../common/2d/color/backtracking-colorizer";
import Path from "../../common/2d/shape/path";

const pointSize = 2;

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

class WorldMap {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
    }

    //initialize(world, countries, selected) {
    initialize(world) {

        // The good ol' pythagoras theorem, replace with Math.hypot(x2-x1, y2-y1) + polyfill?
        function hypotenuse(a, b) {
            let x = a[0] - b[0];
            let y = a[1] - b[1];
            return Math.sqrt(x * x + y * y);
        }

        const buffer = this.createBuffer(world.features);
        const canvas = document.querySelector("canvas");
        const gl = canvas.getContext("webgl");
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = this.createProgram(gl, vertexShader, fragmentShader);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const matrixLocation = gl.getUniformLocation(program, "u_matrix");
        const colorLocation = gl.getUniformLocation(program, "u_color");
        
        let projectionMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let previousMatrix = mat4.create();
        let scaleMatrix = mat4.create();
        let dragMatrix = mat4.create();
        let viewScaleMatrix = mat4.create();

        let translation = vec3.create();
        let negativeTranslation = vec3.create();

        let scale = vec3.fromValues(1, 1, 1);
        let drag = vec3.create();
        let viewScale = vec3.fromValues(1, 1, 1);

        let gesture;

        const minScale = 0.5;
        const maxScale = 100;

        const colorizer = new BacktrackingColorizer(world.neighbors, {
            numberOfColors: 4,
            startIndexIslands: 1,
            maxAttempts: 5000,
            path: new Path(world.neighbors, 3)
        });

        const palette = [];

        //const color = Color.scheme().blue;
        const color = "#868e96";
        let shade = -0.4;
        for(let i = 0; i < colorizer.colorCount; i++) {
            palette.push(Color.shade(color, shade));
            shade += 0.3;
        }

        let colors = colorizer.colors.map((color) => {
            return Color.vec4(palette[color] || "#ff11aa");
        });

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer.data), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, pointSize, gl.FLOAT, false, 0, 0);

        function mousePoint(event, mouse) {
            let rect = gl.canvas.getBoundingClientRect();
            mouse[0] = (event.clientX - rect.left) * (gl.canvas.width / rect.width);
            mouse[1] = (event.clientY - rect.top) * (gl.canvas.height / rect.height);
            return mouse;
        }

        function noevent(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        canvas.addEventListener("mousedown", function(e) {
            if(e.button !== 0) {
                return;
            }
            canvas.addEventListener("mousemove", mousemove);
            canvas.addEventListener("mouseup", mouseup);
            canvas.addEventListener("dragstart", noevent);
            noevent(e);

            let mouse = mousePoint(e, vec2.create());
            mouse[0] -= drag[0];
            mouse[1] -= drag[1];

            function mousemove(e) {
                noevent(e);
                requestAnimationFrame(function() {
                    let delta = mousePoint(e, vec2.create());
                    drag[0] = delta[0] - mouse[0];
                    drag[1] = delta[1] - mouse[1];
                    render();
                });
            }

            function mouseup(e) {
                canvas.removeEventListener("mousemove", mousemove);
                canvas.removeEventListener("mouseup", mouseup);
                canvas.removeEventListener("dragstart", noevent);
                noevent(e);
            }
        });

        /*
        let logDisplay = document.querySelector("#log");

        var logItems = [];
        function log(obj) {

            logItems.unshift( { obj: obj, date: new Date() });

            if(logItems.length > 10) {
                logItems.length = 10;
            }

            var out = "";
            for (var i = logItems.length - 1; i >= 0; --i) {
                var item = logItems[i];
                out += item.date.getHours().toString().padStart(2, "0") + ":"
                + item.date.getMinutes() .toString().padStart(2, "0")+ ":"
                + item.date.getSeconds().toString().padStart(2, "0") + ":"
                + item.date.getMilliseconds().toString().padStart(3, "00")
                    + " " + JSON.stringify(item.obj, null, 2) + "\n";
            }

            logDisplay.innerHTML = out;
        }
        */

        canvas.addEventListener("touchstart", function(e) {

            noevent(e);

            gesture = {};
            
            for(let t of e.touches) {
                if(!gesture.finger1) {
                    gesture.finger1 = {
                        origin: mousePoint(t, vec2.create()),
                        id: t.identifier
                    };
                }
                else if(!gesture.finger2) {
                    gesture.finger2 = {
                        origin: mousePoint(t, vec2.create()),
                        id: t.identifier
                    };
                    gesture.distance = hypotenuse(gesture.finger1.origin, gesture.finger2.origin);
                }
            }

            if(gesture.finger1 && !gesture.finger2) {
                gesture.finger1.origin[0] -= drag[0];
                gesture.finger1.origin[1] -= drag[1];
            }
        });

        canvas.addEventListener("touchmove", function(e) {

            noevent(e);

            for(let t of e.touches) {
                if(gesture.finger1.id === t.identifier) {
                    gesture.finger1.current = mousePoint(t, vec2.create());
                }
                else if(gesture.finger2.id === t.identifier) {
                    gesture.finger2.current = mousePoint(t, vec2.create());
                }
            }

            if(gesture.finger2) {
                const distance = hypotenuse(gesture.finger1.current, gesture.finger2.current);
                const delta = distance - gesture.distance;
                gesture.distance = distance;

                translation[0] = (gesture.finger1.origin[0] + gesture.finger2.origin[0]) / 2;
                translation[1] = (gesture.finger1.origin[1] + gesture.finger2.origin[1]) / 2;

                zoom(delta / 500);
            }
            else if(gesture.finger1) {
                drag[0] = gesture.finger1.current[0] - gesture.finger1.origin[0];
                drag[1] = gesture.finger1.current[1] - gesture.finger1.origin[1];
                render();
            }
        });

        canvas.addEventListener("touchend", function(e) {
            gesture = {};
            noevent(e);
        });

        canvas.addEventListener("click", function(e) {
            let mouse = vec4.fromValues(0, 0, 0, 1);
            mousePoint(e, mouse);
            vec4.transformMat4(mouse, mouse, mat4.invert([], viewMatrix));
            //console.log(mouse);
        });

        canvas.addEventListener("wheel", function(e) {
            noevent(e);
            requestAnimationFrame(function() {
                mousePoint(e, translation);
                zoom(-e.deltaY * (e.deltaMode ? 120 : 1) / 500);
            });
        });

        window.addEventListener("resize", resize);

        resize();

        function zoom(delta) {
            scale[0] = scale[1] = Math.max(minScale, Math.min(maxScale, scale[0] * Math.pow(2, delta)));
            render();
        }

        function resize() {
            let aspectRatio = world.bbox[3] / world.bbox[2];
            let width = gl.canvas.parentElement.clientWidth * window.devicePixelRatio;
            let height = (width * aspectRatio);
            gl.canvas.width = width;
            gl.canvas.height = height;
            gl.viewport(0, 0, width, height);

            gl.canvas.parentElement.style.height = gl.canvas.clientHeight + "px";

            viewScale[0] = viewScale[1] = gl.canvas.width / world.bbox[2];
            translation = vec3.fromValues(gl.canvas.width / 2, gl.canvas.height / 2, 0);

            render();
        }

        function calculateMatrix() {
            mat4.copy(previousMatrix, viewMatrix);
            mat4.identity(viewMatrix);
            
            mat4.translate(viewMatrix, viewMatrix, translation);

            mat4.multiply(viewMatrix, viewMatrix, mat4.invert(scaleMatrix, scaleMatrix));
            mat4.multiply(viewMatrix, viewMatrix, mat4.fromScaling(scaleMatrix, scale));

            mat4.multiply(viewMatrix, viewMatrix, mat4.invert(dragMatrix, dragMatrix));
            mat4.multiply(viewMatrix, viewMatrix, mat4.fromTranslation(dragMatrix, drag));

            mat4.translate(viewMatrix, viewMatrix, vec3.negate(negativeTranslation, translation));

            mat4.multiply(viewMatrix, viewMatrix, mat4.invert(viewScaleMatrix, viewScaleMatrix));
            mat4.multiply(viewMatrix, viewMatrix, mat4.fromScaling(viewScaleMatrix, viewScale));

            mat4.multiply(viewMatrix, viewMatrix, previousMatrix);
        }

        function project() {
            mat4.ortho(projectionMatrix, 0, gl.canvas.width, gl.canvas.height, 0, gl.canvas.height * -2, gl.canvas.height * 2);
            mat4.multiply(projectionMatrix, projectionMatrix, viewMatrix);
        }

        function render() {
    
            calculateMatrix();
            project();

            gl.uniformMatrix4fv(matrixLocation, false, projectionMatrix);
            gl.clear(gl.COLOR_BUFFER_BIT);

            let offset = 0;
            for(let i = 0; i < buffer.offsets.length; i++) {
                gl.uniform4fv(colorLocation, colors[i]);
                gl.drawArrays(gl.TRIANGLES, offset, buffer.offsets[i] / pointSize);
                offset += buffer.offsets[i] / pointSize;
            }
        }
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
    }

    createBuffer(features) {

        let buffer = { data: [], offsets: [] };
        let offset = 0;

        for(let feature of features) {
            if(feature.geometry.type === "Polygon") {                    
                this.triangulate(feature.geometry.coordinates, buffer.data);
            }
            if(feature.geometry.type === "MultiPolygon") {
                for(let coordinates of feature.geometry.coordinates) {
                    this.triangulate(coordinates, buffer.data);
                }
            }
            buffer.offsets.push(buffer.data.length - offset);
            offset = buffer.data.length;
        }

        return buffer;
    }

    triangulate(polygons, data) {
        let points = earcut.flatten(polygons);
        let triangles = earcut(points.vertices, points.holes, points.dimensions);
        for(let t of triangles) {
            let i = t * pointSize;
            data.push(points.vertices[i], points.vertices[i + 1]);
        }
    }

    attach() {
        //
    }

    detach() {
        //
    }
}
    
export default WorldMap;