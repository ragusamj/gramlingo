import easings from "../../../../core/animation/easings";

const fps = 60;

class CanvasAnimator {

    constructor(canvas) {
        this.canvas = canvas;
    }

    zoom(delta) {
        let direction = delta < 0 ? 1 : 0;
        delta = delta < 0 ? delta * -1 : delta;

        if(this.needsNewAnimation(delta, direction)) {
            this.direction = direction;
            cancelAnimationFrame(this.animationId);
            this.animateZoom(delta, direction);
        }
    }

    needsNewAnimation(delta, direction) {
        return delta > 1 && (this.scrollTimeDelta() > fps || this.direction !== direction);
    }

    scrollTimeDelta() {
        let now = Date.now();
        let delta = now - this.lastScrollEvent || now;
        this.lastScrollEvent = now;
        return delta;
    }

    animateZoom(delta, direction) {
        let frames = delta * 10;
        let tweens = this.tween(frames, delta, "easeInOutSine");
        let animate = () => {
            frames--;
            if(frames >= 0) {
                this.canvas.move(0, 0, (direction ? tweens[frames] : -tweens[frames]) * this.canvas.z);
                this.animationId = requestAnimationFrame(animate);
            }
        };
        this.animationId = requestAnimationFrame(animate);
    }

    tween(frames, duration, easing) {
        let tweens = [];
        for(let frame = 0; frame < frames; frame++) {
            let t = (frame / fps) / duration;
            let factor = easings[easing](t);
            tweens.push(factor);
        }
        return tweens;
    }
}

export default CanvasAnimator;