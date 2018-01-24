import Color from "../../common/color";

const disputed = "-99";

const style = {
    country: {
        background: "#868e96"
    },
    label: {
        background: "#343a40",
        color: "#ffffff",
        font: {
            family: "'Montserrat', sans-serif",
            size: 75
        }
    },
    marker: {
        background: Color.scheme().orange,
        border: {
            color: "#ffffff",
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

    initialize(features, countries, selected) {

        this.features = features;
        for(let feature of this.features) {
            if(feature.properties.id === disputed) {
                feature.properties.color = "#333333";
                feature.properties.label = "";
            }
            else {
                let shade;
                switch(feature.properties.color) {
                    case 0: shade = Color.shade(style.country.background, -0.4); break;
                    case 1: shade = Color.shade(style.country.background, -0.1); break;
                    case 2: shade = Color.shade(style.country.background, 0.2); break;
                    default: shade = Color.shade(style.country.background, 0.6);
                }
                feature.properties.color = shade;
                feature.properties.label = countries[feature.properties.id].name[0];
            }
        }
        this.canvas.initialize(this.features, style, selected);
    }

    attach() {
        this.canvasListener.attach();
    }

    detach() {
        this.canvasListener.detach();
    }
}
    
export default WorldMap;