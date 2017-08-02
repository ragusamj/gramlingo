import easings from "../../core/animation/easings";

const fps = 60;

const moves = {
    plus: (tween, start) => start + tween,
    minus: (tween, start) => start - tween,
    noop: (tween, start) => start
};

class WorldMap {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
        browserEvent.on("click", this.onClick.bind(this));
        browserEvent.on("mousedown", this.onMousedown.bind(this));
        browserEvent.on("mousemove", this.onMousemove.bind(this));
        browserEvent.on("mouseup", this.onMouseup.bind(this));
        browserEvent.on("wheel", this.onWheel.bind(this));
    }

    initialize() {
        this.map = document.getElementById("worldmap");
        this.initialWidth = this.map.viewBox.baseVal.width;
        this.initialHeight = this.map.viewBox.baseVal.height;
        this.ratio = this.initialWidth / this.initialHeight;
        this.clickTweens = this.createTweens("easeOutSine", 0.5, { height: 90, width: 90, x: 90, y: 90 });
        this.currentAnimationId = 0;
    }

    onClick(e) {
        if(e.target.hasAttribute("data-iso")) {
            this.selectCountry(e.target);
        }
        if(e.target.parentElement.hasAttribute("data-iso")) {
            this.selectCountry(e.target.parentElement);
        }
        if(e.target.hasAttribute("data-map-zoom-in")) {
            this.animateClick(moves.minus, moves.minus, moves.plus, moves.plus);
        }
        if(e.target.hasAttribute("data-map-zoom-out")) {
            this.animateClick(moves.plus, moves.plus, moves.minus, moves.minus);
        }
        if(e.target.hasAttribute("data-map-pan-up")) {
            this.animateClick(moves.noop, moves.noop, moves.noop, moves.minus);
        }
        if(e.target.hasAttribute("data-map-pan-down")) {
            this.animateClick(moves.noop, moves.noop, moves.noop, moves.plus);
        }
        if(e.target.hasAttribute("data-map-pan-left")) {
            this.animateClick(moves.noop, moves.noop, moves.minus, moves.noop);
        }
        if(e.target.hasAttribute("data-map-pan-right")) {
            this.animateClick(moves.noop, moves.noop, moves.plus, moves.noop);
        }
        if(e.target.hasAttribute("data-map-reset")) {
            this.animateReset();
        }
    }

    onMousedown(e) {
        if(this.isMapEvent(e)) {
            this.startDrag(e);
        }
    }

    onMousemove(e) {
        if(this.isMapEvent(e) && this.dragStartPoint) {
            this.drag(e);
        }
    }

    onMouseup() {
        this.endDrag();
    }

    onWheel(e) {
        if(this.isMapEvent(e)) {
            this.animateWheel(e);
        }
    }

    isMapEvent(e) {
        return e.target.id === "worldmap" ||
            e.target.hasAttribute("data-iso") ||
            e.target.parentElement.hasAttribute("data-iso");
    }

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

    selectCountry(element) {
        if(this.selected) {
            this.selected.classList.remove("selected");
        }
        element.classList.add("selected");
        this.selected = element;
        this.browserEvent.emit("map-country-changed", element.getAttribute("data-iso"));
    }

    animateClick(zoomH, zoomW, panX, panY) {
        this.animate(zoomH, zoomW, panX, panY, this.clickTweens);
    }

    animateReset() {
        const step = {
            height: (this.map.viewBox.baseVal.height - this.initialHeight) * this.ratio,
            width: this.map.viewBox.baseVal.width - this.initialWidth,
            x: this.map.viewBox.baseVal.x * 2,
            y: this.map.viewBox.baseVal.y * (this.ratio * 2)
        };
        const tweens = this.createTweens("easeOutElastic", 1, step);
        this.animate(moves.minus, moves.minus, moves.minus, moves.minus, tweens);
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
        let draw = () => {
            if(frame < tweens.length && id === this.currentAnimationId) {
                let tween = tweens[frame];
                this.map.viewBox.baseVal.height = zoomH(tween.height, start.height);
                this.map.viewBox.baseVal.width = zoomW(tween.width, start.width);
                this.map.viewBox.baseVal.x = panX(tween.x, start.x);
                this.map.viewBox.baseVal.y = panY(tween.y, start.y);
                frame++;
                requestAnimationFrame(draw);
            }
        };
        requestAnimationFrame(draw);
    }

    startDrag(e) {
        this.dragStartPoint = this.createSVGPoint(e.clientX, e.clientY);
    }

    drag(e) {
        this.currentAnimationId++;
        let mousePoint = this.createSVGPoint(e.clientX, e.clientY);
        requestAnimationFrame(() => {
            if(this.dragStartPoint) {
                this.map.viewBox.baseVal.x += (this.dragStartPoint.x - mousePoint.x);
                this.map.viewBox.baseVal.y += (this.dragStartPoint.y - mousePoint.y);
            }
        });
    }

    endDrag() {
        this.dragStartPoint = undefined;
    }

    createSVGPoint(x, y) {
        let point = this.map.createSVGPoint();
        point.x = x;
        point.y = y;
        return point.matrixTransform(this.map.getScreenCTM().inverse());
    }

    animateWheel(e) {
        e.preventDefault();
        this.currentAnimationId++;
        requestAnimationFrame(() => {
            this.map.viewBox.baseVal.height += e.deltaY / this.ratio;
            this.map.viewBox.baseVal.width += e.deltaY;
            this.map.viewBox.baseVal.x -= e.deltaY / 2;
            this.map.viewBox.baseVal.y -= e.deltaY / (this.ratio * 4);
        });
    }
}

export default WorldMap;