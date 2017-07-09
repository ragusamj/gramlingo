class WorldMap {

    constructor(browserEvent) {
        browserEvent.on("click", this.onClick.bind(this));
        this.defaultBounds = {
            height: 221,
            width: 448 
        };
        this.steps = this.getSteps();
    }

    getSteps() {
        let scale = this.defaultBounds.width / this.defaultBounds.height;
        let width = 32;
        let height = width / scale;
        return {
            width: width,
            height: height,
            x: height,
            y: height / 2
        };
    }

    onClick(e) {
        if(e.target.hasAttribute("data-map-zoom-in")) {
            this.zoomIn();
        }
        if(e.target.hasAttribute("data-map-zoom-out")) {
            this.zoomOut();
        }
        if(e.target.hasAttribute("data-map-pan-up")) {
            this.panUp();
        }
        if(e.target.hasAttribute("data-map-pan-down")) {
            this.panDown();
        }
        if(e.target.hasAttribute("data-map-pan-left")) {
            this.panLeft();
        }
        if(e.target.hasAttribute("data-map-pan-right")) {
            this.panRight();
        }
        if(e.target.hasAttribute("data-map-reset")) {
            this.reset();
        }
    }

    zoomIn() {
        var map = document.getElementById("worldmap");
        map.viewBox.baseVal.width -= this.steps.width;
        map.viewBox.baseVal.height -= this.steps.height;
        map.viewBox.baseVal.x += this.steps.x;
        map.viewBox.baseVal.y += this.steps.y;
    }

    zoomOut() {
        var map = document.getElementById("worldmap");
        map.viewBox.baseVal.width += this.steps.width;
        map.viewBox.baseVal.height += this.steps.height;
        map.viewBox.baseVal.x -= this.steps.x;
        map.viewBox.baseVal.y -= this.steps.y;
    }

    panUp() {
        var map = document.getElementById("worldmap");
        map.viewBox.baseVal.y -= this.steps.y;
    }

    panDown() {
        var map = document.getElementById("worldmap");
        map.viewBox.baseVal.y += this.steps.y;
    }

    panLeft() {
        var map = document.getElementById("worldmap");
        map.viewBox.baseVal.x -= this.steps.x;
    }

    panRight() {
        var map = document.getElementById("worldmap");
        map.viewBox.baseVal.x += this.steps.x;
    }

    reset() {
        var map = document.getElementById("worldmap");
        map.viewBox.baseVal.width = this.defaultBounds.width;
        map.viewBox.baseVal.height = this.defaultBounds.height;
        map.viewBox.baseVal.x = 0;
        map.viewBox.baseVal.y = 0;
    }
}

export default WorldMap;