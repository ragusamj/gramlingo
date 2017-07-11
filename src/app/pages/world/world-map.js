import throttle from "lodash.throttle";

class WorldMap {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
        browserEvent.on("click", this.onClick.bind(this));
        browserEvent.on("wheel", this.onWheel.bind(this));
    }

    initialize() {
        this.map = document.getElementById("worldmap");
        this.initialWidth = this.map.viewBox.baseVal.width;
        this.initialHeight = this.map.viewBox.baseVal.height;
        this.clickStep = this.createStep(10);
        this.wheelStep = this.createStep(1);

        this.deferredAnimateWheel = throttle((e) => {
            if(e.deltaY > 0) {
                this.animateWheel(this.zoomOut);
            }
            else {
                this.animateWheel(this.zoomIn);
            }
        }, 10);
    }

    createStep(frames) {
        let ratio = this.initialWidth / this.initialHeight;
        let width = this.initialWidth / 75;
        let height = width / ratio;
        return {
            frames: frames,
            width: width,
            height: height,
            x: height,
            y: height / ratio
        };
    }

    onClick(e) {
        if(e.target.hasAttribute("data-iso")) {
            this.selectCountry(e.target);
        }
        if(e.target.parentElement.hasAttribute("data-iso")) {
            this.selectCountry(e.target.parentElement);
        }
        if(e.target.hasAttribute("data-map-zoom-in")) {
            this.animateClick(this.zoomIn);
        }
        if(e.target.hasAttribute("data-map-zoom-out")) {
            this.animateClick(this.zoomOut);
        }
        if(e.target.hasAttribute("data-map-pan-up")) {
            this.animateClick(this.panUp);
        }
        if(e.target.hasAttribute("data-map-pan-down")) {
            this.animateClick(this.panDown);
        }
        if(e.target.hasAttribute("data-map-pan-left")) {
            this.animateClick(this.panLeft);
        }
        if(e.target.hasAttribute("data-map-pan-right")) {
            this.animateClick(this.panRight);
        }
        if(e.target.hasAttribute("data-map-reset")) {
            this.animateReset();
        }
    }

    onWheel(e) {
        if(e.target.id === "worldmap" || e.target.hasAttribute("data-iso")) {
            this.deferredAnimateWheel(e);
            e.preventDefault();
        }
    }

    selectCountry(element) {
        if(this.selected) {
            this.selected.classList.remove("selected");
        }
        element.classList.add("selected");
        this.selected = element;
        this.browserEvent.emit("map-country-changed", element.getAttribute("data-iso"));
    }

    animateClick(fn) {
        this.animate(this.clickStep, fn);
    }

    animateWheel(fn) {
        this.animate(this.wheelStep, fn);
    }

    animateReset() {
        let frames = 10;
        let step = {
            frames: frames,
            width: (this.map.viewBox.baseVal.width - this.initialWidth) / frames,
            height: (this.map.viewBox.baseVal.height - this.initialHeight) / frames,
            x: this.map.viewBox.baseVal.x / frames,
            y: this.map.viewBox.baseVal.y / frames
        };
        this.animate(step, this.reset);
    }

    animate(step, fn) {
        let drawnFrames = 0;
        let draw = () => {
            if(drawnFrames < step.frames) {
                fn.call(this, step);
                drawnFrames++;
                requestAnimationFrame(draw);
            }
        };
        requestAnimationFrame(draw);
    }

    zoomIn(step) {
        if(this.map.viewBox.baseVal.width >= this.initialWidth / 10) {
            this.map.viewBox.baseVal.width -= step.width;
            this.map.viewBox.baseVal.height -= step.height;
            this.map.viewBox.baseVal.x += step.x;
            this.map.viewBox.baseVal.y += step.y;
        }
    }

    zoomOut(step) {
        this.map.viewBox.baseVal.width += step.width;
        this.map.viewBox.baseVal.height += step.height;
        this.map.viewBox.baseVal.x -= step.x;
        this.map.viewBox.baseVal.y -= step.y;
    }

    panUp(step) {
        if(this.map.viewBox.baseVal.y  * -1 < this.map.viewBox.baseVal.height) {
            this.map.viewBox.baseVal.y -= step.y;
        }
    }

    panDown(step) {
        if(this.map.viewBox.baseVal.y < this.initialHeight) {
            this.map.viewBox.baseVal.y += step.y;
        }
    }

    panLeft(step) {
        if(this.map.viewBox.baseVal.x  * -1 < this.map.viewBox.baseVal.width) {
            this.map.viewBox.baseVal.x -= step.x;
        }
    }

    panRight(step) {
        if(this.map.viewBox.baseVal.x < this.initialWidth) {
            this.map.viewBox.baseVal.x += step.x;
        }
    }

    reset(step) {
        this.map.viewBox.baseVal.width -= step.width;
        this.map.viewBox.baseVal.height -= step.height;
        this.map.viewBox.baseVal.x -= step.x;
        this.map.viewBox.baseVal.y -= step.y;
    }
}

export default WorldMap;