import Canvas from "./canvas";

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
            geometry.color = colorsSchemes.cyan[geometry.colorIndex];
            geometry.label = countries[geometry.iso] ? countries[geometry.iso].name[0] : geometry.iso;
        }

        this.canvas = new Canvas(document.getElementById("world-map"), this.geometries);
        this.canvas.resize();
        this.onCountrychanged(defaultSelectedCountry);
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

        if(e.target) {
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
        }
    }

    onResize(e) {
        this.canvas.resize(e);
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