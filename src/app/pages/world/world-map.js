import easings from "../../core/animation/easings";

const fps = 60;
const clickstep = { height: 90, width: 90, x: 90, y: 90 };

const moves = {
    plus: (tween, start) => start + tween,
    minus: (tween, start) => start - tween,
    noop: (tween, start) => start
};

const mouseButtons = {
    main: 0
};

class WorldMap {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
    }

    initialize(selectedIso) {
        this.map = document.getElementById("worldmap");
        this.container = document.querySelector("[class='fluid-svg-container']");
        this.marker = document.getElementById("map-marker");
        this.svgPoint = this.map.createSVGPoint();
        this.initialWidth = this.map.viewBox.baseVal.width;
        this.initialHeight = this.map.viewBox.baseVal.height;
        this.ratio = this.initialWidth / this.initialHeight;
        this.clickTweens = this.createTweens("easeOutQuad", 0.2, clickstep);
        this.currentAnimationId = 0;
        //this.scrollingEnabled = true;
        this.selectCountry(document.querySelector("[data-iso='" + selectedIso + "']"));
    }

    selectCountry(element) {
        let iso = element.getAttribute("data-iso");
        if(iso !== "-99") {
            this.setMarker(element);
            this.positionMarker();
            this.browserEvent.emit("map-country-changed", element.getAttribute("data-iso"));
        }
    }

    setMarker(element) {
        const marker = element.getAttribute("data-marker");
        const point = marker.split("x");
        this.markerPoint = { x: point[0], y: point[1] };
    }

    positionMarker() {
        const containerRect = this.container.getBoundingClientRect();
        const domPoint = this.toDOMPoint(this.markerPoint.x, this.markerPoint.y);
        const left = ((domPoint.x - containerRect.left - (this.marker.offsetWidth / 2)));
        const top = (domPoint.y - containerRect.top - this.marker.offsetHeight);
        this.marker.style.left = Math.round(left) + "px";
        this.marker.style.top = Math.round(top) + "px";
    }

    zoomIn() {
        this.animate(moves.minus, moves.minus, moves.plus, moves.plus, this.clickTweens);
    }

    zoomOut() {
        if(this.map.viewBox.baseVal.height + clickstep.height / 2 > this.initialHeight) {
            this.reset();
            return;
        }
        this.animate(moves.plus, moves.plus, moves.minus, moves.minus, this.clickTweens);
    }

    panUp() {
        this.animate(moves.noop, moves.noop, moves.noop, moves.minus, this.clickTweens);
    }

    panDown() {
        this.animate(moves.noop, moves.noop, moves.noop, moves.plus, this.clickTweens);
    }

    panLeft() {
        this.animate(moves.noop, moves.noop, moves.minus, moves.noop, this.clickTweens);
    }

    panRight() {
        this.animate(moves.noop, moves.noop, moves.plus, moves.noop, this.clickTweens);
    }

    reset() {
        const step = {
            height: (this.map.viewBox.baseVal.height - this.initialHeight) * this.ratio,
            width: this.map.viewBox.baseVal.width - this.initialWidth,
            x: this.map.viewBox.baseVal.x * 2,
            y: this.map.viewBox.baseVal.y * (this.ratio * 2)
        };
        const tweens = this.createTweens("easeInOutSine", 0.5, step);
        this.animate(moves.minus, moves.minus, moves.minus, moves.minus, tweens);
    }

    onMousedown(e) {
        if(this.isMapEvent(e) && e.button === mouseButtons.main) {
            this.dragStartPoint = this.toSVGPoint(e.clientX, e.clientY);
        }
    }

    onMousemove(e) {
        if(this.isMapEvent(e) && this.dragStartPoint) {
            this.currentAnimationId++;
            this.dragging = true;
            let mousePoint = this.toSVGPoint(e.clientX, e.clientY);
            requestAnimationFrame(() => {
                this.map.viewBox.baseVal.x += (this.dragStartPoint.x - mousePoint.x);
                this.map.viewBox.baseVal.y += (this.dragStartPoint.y - mousePoint.y);
                this.positionMarker();
            });
        }
    }

    onMouseup(e) {
        if(!this.dragging && e.target.hasAttribute("data-iso")) {
            this.selectCountry(e.target);
        }
        this.dragStartPoint = undefined;
        this.dragging = false;
    }

    onWheel(e) {
        if(this.isMapEvent(e)) {
            e.preventDefault();

            /*
            this.assertScrolling(e);

            if(!this.scrollingEnabled) {
                return;
            }

            if(!this.assertZoomingBounds(e)){
                return;
            }*/

            this.currentAnimationId++;
            //const mousePoint = this.toSVGPoint(e.clientX, e.clientY);
            requestAnimationFrame(() => {
                this.map.viewBox.baseVal.height += e.deltaY / this.ratio;
                this.map.viewBox.baseVal.width += e.deltaY;
                this.map.viewBox.baseVal.x -= e.deltaY / 2;
                this.map.viewBox.baseVal.y -= e.deltaY / (this.ratio * 4);
                //this.map.viewBox.baseVal.x -= e.deltaY * (mousePoint.x / this.initialWidth);
                //this.map.viewBox.baseVal.y -= e.deltaY * ((mousePoint.y / this.initialHeight) / this.ratio);
                this.positionMarker();
            });
        }
    }

    /*
    assertScrolling(e) {

        if(this.lastDeltaY !== undefined && this.lastDeltaY * e.deltaY <= 0) {
            this.scrollingEnabled = true;
        }
        this.lastDeltaY = e.deltaY;

        if(this.scrollEnd) {
            clearTimeout(this.scrollEnd);
        }

        this.scrollEnd = setTimeout(() => {
            this.scrollingEnabled = true;
        }, 250);
    }

    assertZoomingBounds(e) {

        if(e.deltaY > 0 && this.map.viewBox.baseVal.height > this.initialHeight) {
            this.scrollingEnabled = false;
            this.reset();
            return false;
        }

        if(e.deltaY <= 0 && this.map.viewBox.baseVal.height + e.deltaY / this.ratio < this.initialHeight / 10) {
            this.scrollingEnabled = false;
            return false;
        }

        return true;
    }*/

    createTweens(easing, duration, step) {
        const tweens = [];
        const frames = (1000 * duration) / (1000 / fps);
        for(let frame = 0; frame < frames; frame++) {
            let t = (frame / fps) / duration;
            let factor = easings[easing](t);
            tweens.push({
                height: factor * step.height / this.ratio,
                width: factor * step.width,
                x: factor * step.x / 2,
                y: factor * step.y / (this.ratio * 2)
            });
        }
        return tweens;
    }

    toSVGPoint(x, y) {
        return this.transformPoint(x, y, false);
    }

    toDOMPoint(x, y) {
        return this.transformPoint(x, y, true);
    }

    transformPoint(x, y, toDOM) {
        this.svgPoint.x = x;
        this.svgPoint.y = y;
        const ctm = this.map.getScreenCTM();
        return this.svgPoint.matrixTransform(toDOM ? ctm : ctm.inverse());
    }

    animate(zoomH, zoomW, panX, panY, tweens) {

        const id = ++this.currentAnimationId;
        const start = {
            height: this.map.viewBox.baseVal.height,
            width: this.map.viewBox.baseVal.width,
            x: this.map.viewBox.baseVal.x,
            y: this.map.viewBox.baseVal.y,
        };
    
        let frame = 0;
        const draw = () => {
            if(frame < tweens.length && id === this.currentAnimationId) {
                const tween = tweens[frame];
                if(zoomH(tween.height, start.height) > this.initialHeight / 10) {
                    this.map.viewBox.baseVal.height = zoomH(tween.height, start.height);
                    this.map.viewBox.baseVal.width = zoomW(tween.width, start.width);
                    this.map.viewBox.baseVal.x = panX(tween.x, start.x);
                    this.map.viewBox.baseVal.y = panY(tween.y, start.y);
                }
                frame++;
                this.positionMarker();
                requestAnimationFrame(draw);
            }
        };
        requestAnimationFrame(draw);
    }

    isMapEvent(e) {
        if(e.target && e.target.hasAttribute) {
            return e.target.id === "worldmap" || e.target.hasAttribute("data-iso");
        }
        return false;
    }
}

export default WorldMap;