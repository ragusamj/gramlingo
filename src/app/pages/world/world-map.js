//import throttle from "lodash.throttle";

const easeIn = p => t => Math.pow(t, p);
const easeOut = p => t => 1 - easeIn(p)(1 - t);
const easeInOut = p => t => t < 0.5 ? easeIn(p)(t * 2) / 2 : easeOut(p)(t * 2 - 1) / 2 + 0.5;

const easeInSine = (t) => 1 - Math.cos(t * Math.PI / 2);
const easeOutSine = (t) => 1 - easeInSine(1 - t);
const easeInOutSine = (t) => t < 0.5 ? easeInSine(t * 2) / 2 : easeOutSine(t * 2 - 1) / 2 + 0.5;

const easeInCircular = (t) => 1 - Math.sqrt(1 - Math.pow(t, 3));
const easeOutCircular = (t) => 1 - easeInCircular(1 - t);
const easeInOutCircular = (t) => t < 0.5 ? easeInCircular(t * 2) / 2 : easeOutCircular(t * 2 - 1) / 2 + 0.5;

const easeInElastic = (t) => - Math.pow(2, 10 * (t -= 1)) * Math.sin((t - 0.4 / 4) * (2 * Math.PI) / 0.4);
const easeOutElastic = (t) => 1 - easeInElastic(1 - t);
const easeInOutElastic = (t) => t < 0.5 ? easeInElastic(t * 2) / 2 : easeOutElastic(t * 2 - 1) / 2 + 0.5;

const easeInBack = (t) => t * t * (2.7 * t - 1.7);
const easeOutBack = (t) => 1 - easeInBack(1 - t);
const easeInOutBack = (t) => t < 0.5 ? easeInBack(t * 2) / 2 : easeOutBack(t * 2 - 1) / 2 + 0.5;

const easings = {
    linear: t => t,
    easeInQuad: easeIn(2), easeOutQuad: easeOut(2), easeInOutQuad: easeInOut(2),
    easeInCubic: easeIn(3), easeOutCubic: easeOut(3), easeInOutCubic: easeInOut(3),
    easeInQuart: easeIn(4), easeOutQuart: easeOut(4), easeInOutQuart: easeInOut(4),
    easeInQuint: easeIn(5), easeOutQuint: easeOut(5), easeInOutQuint: easeInOut(5),
    easeInSine: easeInSine, easeOutSine: easeOutSine, easeInOutSine: easeInOutSine,
    easeInCircular: easeInCircular, easeOutCircular: easeOutCircular, easeInOutCircular: easeInOutCircular,
    easeInElastic: easeInElastic, easeOutElastic: easeOutElastic, easeInOutElastic: easeInOutElastic,
    easeInBack: easeInBack, easeOutBack: easeOutBack, easeInOutBack: easeInOutBack
};

const fps = 60;

const moves = {
    plus: (a, b) => b + a,
    minus: (a, b) => b - a,
    noop: (a, b) => b 
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
        this.clickTweens = this.createTweens("easeOutQuad", 0.5, { height: 90, width: 90, x: 90, y: 90 });

        /*
        this.deferredAnimateWheel = throttle((e) => {
            if(e.deltaY > 0) {
                this.animateWheel(this.zoomOut);
            }
            else {
                this.animateWheel(this.zoomIn);
            }
        }, 10);*/
    }

    createTweens(easing, duration, step) {

        const tweens = [];
        const ratio = this.initialWidth / this.initialHeight;
        const frames = (1000 * duration) / (1000 / fps);

        for(let frame = 0; frame < frames; frame++) {
            let t = (frame / fps) / duration;
            let factor = easings[easing](t);
            tweens.push({
                height: factor * step.height / ratio,
                width: factor * step.width,
                x: factor * (step.x / 2),
                y: factor * (step.y / (ratio * 2))
            });
        }

        return tweens;
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

            const ratio = this.initialWidth / this.initialHeight;
            const step = {
                height: (this.map.viewBox.baseVal.height - this.initialHeight) * ratio,
                width: this.map.viewBox.baseVal.width - this.initialWidth,
                x: this.map.viewBox.baseVal.x * 2,
                y: this.map.viewBox.baseVal.y * (ratio * 2)
            };

            const tweens = this.createTweens("easeInOutElastic", 1.2, step);
            this.animate(moves.minus, moves.minus, moves.minus, moves.minus, tweens);
        }
    }

    onMousedown(e) {
        if(this.isMapEvent(e)) {
            this.dragStartPoint = this.createSVGPoint(e.clientX, e.clientY);
        }
    }

    onMousemove(e) {
        if(this.isMapEvent(e) && this.dragStartPoint) {
            let mousePoint = this.createSVGPoint(e.clientX, e.clientY);
            requestAnimationFrame(() => {
                if(this.dragStartPoint) {
                    this.map.viewBox.baseVal.x += (this.dragStartPoint.x - mousePoint.x);
                    this.map.viewBox.baseVal.y += (this.dragStartPoint.y - mousePoint.y);
                }
            });
        }
    }

    onMouseup() {
        this.dragStartPoint = undefined;
    }

    onWheel(e) {
        if(this.isMapEvent(e)) {
            //this.deferredAnimateWheel(e);
            e.preventDefault();
        }
    }

    createSVGPoint(x, y) {
        let point = this.map.createSVGPoint();
        point.x = x;
        point.y = y;
        return point.matrixTransform(this.map.getScreenCTM().inverse());
    }

    isMapEvent(e) {
        return e.target.id === "worldmap" ||
            e.target.hasAttribute("data-iso") ||
            e.target.parentElement.hasAttribute("data-iso");
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

    animate(zoomH, zoomW, panX, panY, tweens) {

        const start = {
            height: this.map.viewBox.baseVal.height,
            width: this.map.viewBox.baseVal.width,
            x: this.map.viewBox.baseVal.x,
            y: this.map.viewBox.baseVal.y,
        };
    
        let frame = 0;
        let draw = () => {
            if(frame < tweens.length) {
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
}

export default WorldMap;