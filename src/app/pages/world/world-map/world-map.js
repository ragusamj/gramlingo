import Color from "../../common/color/color";
import BacktrackingColorizer from "../../common/color/map-colorizer/backtracking-colorizer";
import Path from "../../common/color/map-colorizer/path";

const disputed = "-99";

const style = {
    country: {
        background: "#868e96"
        //background: Color.scheme().green
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

    initialize(world, countries, selected) {

        this.features = world.features;

        const colorizer = new BacktrackingColorizer(world.neighbors, {
            numberOfColors: 4,
            startIndexIslands: 3,
            maxAttempts: 5000,
            path: new Path(world.neighbors, 3)
        });

        let palette = [];

        let color = style.country.background;
        let shade = -0.4;
        for(let i = 0; i < colorizer.colorCount; i++) {
            palette.push(Color.shade(color, shade));
            shade += 0.35;
        }

        let index = 0;
        for(let feature of this.features) {
            if(feature.properties.id === disputed) {
                feature.properties.color = "#333333";
                feature.properties.label = "";
            }
            else {
                feature.properties.color = palette[colorizer.colors[index]];
                feature.properties.label = countries[feature.properties.id].name[0];
            }
            index++;
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