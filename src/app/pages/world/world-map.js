import easings from "../../core/animation/easings";

const fps = 60;
const clickstep = { height: 90, width: 90, x: 90, y: 90 };

const moves = {
    plus: (tween, start) => start + tween,
    minus: (tween, start) => start - tween,
    noop: (tween, start) => start
};

class WorldMap {

    constructor(browserEvent) {
        this.browserEvent = browserEvent;
    }

    initialize(selectedIso) {
        this.map = document.getElementById("worldmap");
        this.initialWidth = this.map.viewBox.baseVal.width;
        this.initialHeight = this.map.viewBox.baseVal.height;
        this.ratio = this.initialWidth / this.initialHeight;
        this.clickTweens = this.createTweens("easeOutQuad", 0.2, clickstep);
        this.currentAnimationId = 0;
        this.scrollingEnabled = true;
        this.selectCountry(document.querySelector("[data-iso='" + selectedIso + "']"));
    }

    selectCountry(element) {
        if(this.selected) {
            this.selected.classList.remove("selected");
        }
        element.classList.add("selected");
        this.selected = element;
        this.browserEvent.emit("map-country-changed", element.getAttribute("data-iso"));
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
        const tweens = this.createTweens("easeOutElastic", 1, step);
        this.animate(moves.minus, moves.minus, moves.minus, moves.minus, tweens);
    }

    startDrag(e) {
        if(this.isMapEvent(e)) {
            this.dragStartPoint = this.createSVGPoint(e.clientX, e.clientY);
        }
    }

    drag(e) {
        if(this.isMapEvent(e)) {
            if(this.dragStartPoint) {
                this.currentAnimationId++;
                let mousePoint = this.createSVGPoint(e.clientX, e.clientY);
                requestAnimationFrame(() => {
                    if(this.dragStartPoint) {
                        this.map.viewBox.baseVal.x += (this.dragStartPoint.x - mousePoint.x);
                        this.map.viewBox.baseVal.y += (this.dragStartPoint.y - mousePoint.y);
                    }
                });
            }
            else {
                let iso = e.target.getAttribute("data-iso") || e.target.parentElement.getAttribute("data-iso");
                if(iso) {
                    if(!this.isopop) {
                        this.isopop = {
                            elements: {
                                container: document.getElementById("isopop"),
                                flag: document.getElementById("popup-country-flag"),
                                iso: document.getElementById("popup-iso")
                            }
                        };
                    }
                    if(this.isopop.iso !== iso) {
                        this.isopop.iso = iso;
                        this.isopop.elements.flag.src = "/images/flags/" + iso + ".png";
                        this.isopop.elements.iso.innerHTML = iso;
                        this.isopop.elements.container.style.opacity = 1;
                    }
                    this.isopop.elements.container.style.top = (e.clientY + 20) + "px";
                    this.isopop.elements.container.style.left = (e.clientX + 20) + "px";
                }
                else {
                    if(this.isopop && this.isopop.iso) {
                        this.isopop.iso = undefined;
                        this.isopop.elements.container.style.opacity = 0;
                    }
                }
            }
        }
    }

    endDrag() {
        this.dragStartPoint = undefined;
    }

    scroll(e) {
        if(this.isMapEvent(e)) {
            e.preventDefault();

            this.assertScrolling(e);

            if(!this.scrollingEnabled) {
                return;
            }

            if(!this.assertZoomingBounds(e)){
                return;
            }

            this.currentAnimationId++;
            const mousePoint = this.createSVGPoint(e.clientX, e.clientY);
            requestAnimationFrame(() => {
                this.map.viewBox.baseVal.height += e.deltaY / this.ratio;
                this.map.viewBox.baseVal.width += e.deltaY;
                this.map.viewBox.baseVal.x -= e.deltaY * (mousePoint.x / this.initialWidth);
                this.map.viewBox.baseVal.y -= e.deltaY * ((mousePoint.y / this.initialHeight) / this.ratio);
            });
        }
    }

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

    createSVGPoint(x, y) {
        let point = this.map.createSVGPoint();
        point.x = x;
        point.y = y;
        return point.matrixTransform(this.map.getScreenCTM().inverse());
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
                requestAnimationFrame(draw);
            }
        };
        requestAnimationFrame(draw);
    }

    isMapEvent(e) {
        if(e.target && e.target.hasAttribute) {
            return e.target.id === "worldmap" ||
                   e.target.hasAttribute("data-iso") ||
                   e.target.parentElement.hasAttribute("data-iso");
        }
        return false;
    }
}

export default WorldMap;