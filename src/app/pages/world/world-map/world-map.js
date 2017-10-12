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
    }

    initialize(geometries, countries) {

        this.geometries = geometries;
        
        for(let geometry of this.geometries) {
            geometry.color = colorsSchemes.green[geometry.colorIndex];
            geometry.name = countries[geometry.iso] ? countries[geometry.iso].name : geometry.iso;
            geometry.centroids = [];
            for(let polygon of geometry.polygons) {
                let centroid = Shape.centroid(polygon);
                geometry.centroids.push(centroid);
            }
        }

        this.canvas = new Canvas(document.getElementById("world-map"), this.geometries);
        this.canvas.reset();
        this.onCountrychanged(defaultSelectedCountry);
    }

    onClick(e) {
        if(e.target) {
            requestAnimationFrame(() => {
                if(e.target.hasAttribute("data-map-zoom-in")) {
                    this.canvas.zoom(-50);
                }
                if(e.target.hasAttribute("data-map-zoom-out")) {
                    this.canvas.zoom(50);
                }
                if(e.target.hasAttribute("data-map-pan-up")) {
                    this.canvas.move(0, -100, 0, 2, 2);
                }
                if(e.target.hasAttribute("data-map-pan-down")) {
                    this.canvas.move(0, 100, 0, 2, 2);
                }
                if(e.target.hasAttribute("data-map-pan-left")) {
                    this.canvas.move(-100, 0, 0, 2, 2);
                }
                if(e.target.hasAttribute("data-map-pan-right")) {
                    this.canvas.move(100, 0, 0, 2, 2);
                }
                if(e.target.hasAttribute("data-map-reset")) {
                    this.canvas.reset();
                }
            });
        }
    }

    onMousedown(e) {
        if(this.isMapEvent(e)) {
            this.canvas.beginDrag(e);
        }
    }

    onMousemove(e) {
        if(this.isMapEvent(e)) {
            this.canvas.drag(e);
        }
    }

    onMouseup(e) {
        this.selectCountry(e);
        this.canvas.endDrag();
    }
    
    onWheel(e) {
        if(this.isMapEvent(e)) {
            e.preventDefault();
            this.canvas.zoom(e.deltaY);
        }
    }

    selectCountry(e) {
        if(this.isMapEvent(e)) {
            let geometry = this.canvas.select(e);
            if(geometry) {
                this.onCountrychanged(geometry.iso);
            }
        }
    }

    onCountrychanged(iso) {
        // TODO: position marker
        this.browserEvent.emit("map-country-changed", iso);
    }

    isMapEvent(e) {
        return e.target && e.target.id === "world-map";
    }
}
    
export default WorldMap;