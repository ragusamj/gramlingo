import Color from "../../common/color";

const disputed = "-99";

const style = {
    country: {
        background: "#868e96"
    },
    label: {
        background: "#343a40",
        color: "#fff",
        font: {
            family: "'Montserrat', sans-serif",
            size: 75
        }
    },
    marker: {
        background: Color.scheme().orange,
        border: {
            color: "#fff",
            width: 4
        }
    }
};

class WorldMap {

    constructor(browserEvent, canvas, canvasListener) {
        this.browserEvent = browserEvent;
        this.canvas = canvas;
        this.canvasListener = canvasListener;
    }

    initialize(geometries, countries, selected) {

        this.geometries = geometries;
        for(let geometry of this.geometries) {
            if(geometry.iso === disputed) {
                geometry.color = "#333";
                geometry.label = "";
            }
            else {
                let shade;
                switch(geometry.colorIndex) {
                    case 0: shade = Color.shade(style.country.background, -0.4); break;
                    case 1: shade = Color.shade(style.country.background, -0.1); break;
                    case 2: shade = Color.shade(style.country.background, 0.2); break;
                    default: shade = Color.shade(style.country.background, 0.6);
                }
                geometry.id = geometry.iso;
                geometry.color = shade;
                geometry.label = countries[geometry.iso].name[0];
                if(geometry.iso === selected) {
                    this.canvas.setMarker(geometry.centroid);
                }
            }
        }
        this.canvas.initialize(this.geometries, style);
    }

    attach() {
        this.canvasListener.attach();
    }

    detach() {
        this.canvasListener.detach();
    }
}
    
export default WorldMap;