const disputed = "-99";

const colorsSchemes = {
    blue:  ["#004085", "#005dc2", "#007bff", "#7abaff"],
    cyan:  ["#117b8c", "#17a2b8", "#86cfda", "#d1ecf1"],
    gray:  ["#666c72", "#868e96", "#c0c4c8", "#e7e8ea"],
    green: ["#155724", "#1e7f34", "#28a745", "#8fd19e"],
    red:   ["#721c24", "#a72834", "#dc3545", "#ed969e"]
};

class WorldMap {

    constructor(browserEvent, canvas, canvasListener) {
        this.browserEvent = browserEvent;
        this.canvas = canvas;
        this.canvasListener = canvasListener;
    }

    initialize(geometries, countries) {
        this.geometries = geometries;
        for(let geometry of this.geometries) {
            if(geometry.iso === disputed) {
                geometry.color = "#333";
                geometry.label = "";
            }
            else {
                geometry.id = geometry.iso;
                geometry.color = colorsSchemes.cyan[geometry.colorIndex];
                geometry.label = countries[geometry.iso].name[0];
            }
        }
        this.canvas.initialize(this.geometries);
    }

    attach() {
        this.canvasListener.attach();
    }

    detach() {
        this.canvasListener.detach();
    }
}
    
export default WorldMap;