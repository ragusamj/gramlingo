import Canvas from "./canvas";
import Shape from "./shape";

const defaultSelectedCountry = "SE";

const mouseButtons = {
    main: 0
};

const colorsSchemes = {
    blue:  ["#004085", "#005dc2", "#007bff", "#7abaff"],
    cyan:  ["#117b8c", "#17a2b8", "#86cfda", "#d1ecf1"],
    gray:  ["#666c72", "#868e96", "#c0c4c8", "#e7e8ea"],
    green: ["#155724", "#1e7f34", "#28a745", "#8fd19e"],
    red:   ["#721c24", "#a72834", "#dc3545", "#ed969e"]
};

class WorldMap {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
    }

    initialize(geometries, countries) {

        this.geometries = geometries;
        
        for(let geometry of this.geometries) {
            geometry.color = colorsSchemes.gray[geometry.colorIndex];
            geometry.name = countries[geometry.iso] ? countries[geometry.iso].name : geometry.iso;
            geometry.centroids = [];
            for(let polygon of geometry.polygons) {
                let centroid = Shape.centroid(polygon);
                geometry.centroids.push(centroid);
            }
        }

        this.canvas = new Canvas(document.getElementById("world-map"), this.geometries);
        this.reset();
        this.onCountrychanged(defaultSelectedCountry);
    }

    onClick(e) {
        if(e.target) {
            requestAnimationFrame(() => {
                if(e.target.hasAttribute("data-map-zoom-in")) {
                    this.move(0, 0, this.z / 2);
                }
                if(e.target.hasAttribute("data-map-zoom-out")) {
                    this.move(0, 0, -0.5);
                }
                if(e.target.hasAttribute("data-map-pan-up")) {
                    this.move(0, -100, 0);
                }
                if(e.target.hasAttribute("data-map-pan-down")) {
                    this.move(0, 100, 0);
                }
                if(e.target.hasAttribute("data-map-pan-left")) {
                    this.move(-100, 0, 0);
                }
                if(e.target.hasAttribute("data-map-pan-right")) {
                    this.move(100, 0, 0);
                }
                if(e.target.hasAttribute("data-map-reset")) {
                    this.reset();
                }
            });
        }
    }

    onMousedown(e) {
        this.beginDrag(e);
    }

    onMousemove(e) {
        this.drag(e);
    }

    onMouseup(e) {
        this.selectCountry(e);
        this.endDrag();
    }
    
    onWheel(e) {
        if(this.isMapEvent(e)) {
            e.preventDefault();
            requestAnimationFrame(() => {
                // step = e.deltaY / 100 // set the zooming speed, 100 seems reasonable
                // step / z              // maintain the same speed regardless of scale (otherwise it would go slower and slower when zooming in and vice versa)
                // * -1                  // reverse the zoom gesture
                this.move(0, 0, e.deltaY / (100 / this.z) * -1);
            });
        }
    }

    beginDrag(e) {
        if(this.isMapEvent(e) && e.button === mouseButtons.main) {
            this.dragStartPoint = this.canvas.toCanvasPoint(e.clientX, e.clientY);
        }
    }

    drag(e) {
        if(this.isMapEvent(e) && this.dragStartPoint) {
            this.dragging = true;
            let mousePoint = this.canvas.toCanvasPoint(e.clientX, e.clientY);
            requestAnimationFrame(() => {
                if(this.dragStartPoint) {
                    this.move(
                        // step = dragStartPoint - mousePoint // delta, how many pixels did the mouse move
                        // step / z                           // make the step smaller when the scale increases (zoomed in) and vice versa
                        // * 4.65                             // keep the image centered around the mouse pointer
                        ((this.dragStartPoint[0] - mousePoint[0]) / this.z) * 2,
                        ((this.dragStartPoint[1] - mousePoint[1]) / this.z) * 2,
                        0
                    );
                    this.dragStartPoint = mousePoint;
                }
            });
        }
    }

    endDrag() {
        this.dragStartPoint = undefined;
        this.dragging = false;
    }

    selectCountry(e) {
        if(!this.dragging && this.isMapEvent(e)) {
            let mousePoint = this.canvas.toCanvasPoint(e.clientX, e.clientY);
            mousePoint[0] = (mousePoint[0] + this.canvas.offsetX) / this.z;
            mousePoint[1] = (mousePoint[1] + this.canvas.offsetY) / this.z;
            for(let geometry of this.geometries) {
                for(let polygon of geometry.polygons) {
                    if(Shape.inside(mousePoint, polygon)) {
                        this.onCountrychanged(geometry.iso);
                        return;
                    }
                }
            }
        }
    }

    onCountrychanged(iso) {
        // TODO: position marker
        this.browserEvent.emit("map-country-changed", iso);
    }

    move(xstep, ystep, zstep) {
        this.x += xstep;
        this.y += ystep;
        this.z += zstep;
        this.canvas.draw(this.x, this.y, this.z);
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 1;
        this.canvas.draw(this.x, this.y, this.z);
    }

    isMapEvent(e) {
        return e.target && e.target.id === "world-map";
    }
}
    
export default WorldMap;