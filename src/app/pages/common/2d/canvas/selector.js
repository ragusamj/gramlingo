import M4 from "./m4";
import Shape from "../shape";

class Selector {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
    }

    select(clickedLocation, canvas, geometries, matrices) {

        const projectionMatrix = matrices[0];
        const matrix = matrices[matrices.length - 1];
        const unprojectedMatrix = M4.multiply(M4.inverse(projectionMatrix), matrix);
        const originLocation = M4.transformVector(M4.inverse(unprojectedMatrix), clickedLocation);

        for(let geometry of geometries) {
            if(geometry.type === "Polygon" && this.inside(canvas, geometry, originLocation, geometry.polygons[0])) {
                return;
            }
            if(geometry.type === "MultiPolygon") {
                for(let polygons of geometry.polygons) {
                    if(this.inside(canvas, geometry, originLocation, polygons[0])) {
                        return;
                    }
                }
            }
        }
    }

    inside(canvas, geometry, point, polygons) {
        if(Shape.inside(point, polygons)) {
            this.browserEvent.emit("canvas-geometry-clicked", { canvasId: canvas.id, geometryId: geometry.id }); 
            return true;
        }
        return false;
    }
}

export default Selector;