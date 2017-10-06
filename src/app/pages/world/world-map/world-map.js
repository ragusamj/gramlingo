import Canvas from "./canvas";
import Shape from "./shape";

const defaultSelectedCountry = "SE";

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
        this.scale = 1;
    }

    initialize(geometries, countries) {

        this.geometries = geometries;
        
        for(let geometry of this.geometries) {
            geometry.color = colorsSchemes.cyan[geometry.colorIndex];
            geometry.name = countries[geometry.iso] ? countries[geometry.iso].name : geometry.iso;
            geometry.centroids = [];
            for(let polygon of geometry.polygons) {
                let centroid = Shape.centroid(polygon);
                geometry.centroids.push(centroid);
            }
        }

        this.canvas = new Canvas(document.getElementById("world-map"), this.geometries);
        this.canvas.draw(this.scale);
        this.onCountrychanged(defaultSelectedCountry);
    }

    onClick(e) {
        if(e.target) {
            requestAnimationFrame(() => {
                if(e.target.hasAttribute("data-map-zoom-in")) {
                    this.zoom(0.5);
                }
                if(e.target.hasAttribute("data-map-zoom-out")) {
                    this.zoom(-0.5);
                }
            });
        }

        if(e.target && e.target.id === "world-map") {
            let mousePoint = this.canvas.toCanvasPoint(e.clientX, e.clientY);
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
    
    onWheel(e) {
        if(e.target && e.target.id === "world-map") {
            e.preventDefault();
            requestAnimationFrame(() => {
                this.zoom(e.deltaY / 100 * -1);
            });
        }
    }

    onCountrychanged(iso) {
        // TODO: position marker
        this.browserEvent.emit("map-country-changed", iso);
    }

    zoom(step) {
        this.scale += step;
        this.canvas.draw(this.scale);
    }

    pan(step) {
        this.pan += step;
        this.canvas.draw(this.scale);
    }
}
    
export default WorldMap;