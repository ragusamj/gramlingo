import easings from "../../../../core/animation/easings";

const fps = 60;

class CanvasAnimator {

    constructor(canvas) {
        this.canvas = canvas;
        this.initializeReset();
    }

    initializeReset() {
        const duration = 0.5;
        const frames = (1000 * duration) / (1000 / fps);
        this.resetTweens = this.tween(frames, duration, easings.easeInOutSine);
    }

    reset() {        
        const target = this.canvas.getInitialBounds();
        const x = this.canvas.x;
        const y = this.canvas.y;
        const z = this.canvas.z;
        let frame = 0; 
        const animate = () => {
            if(frame < this.resetTweens.length) {
                this.canvas.x = x + (target.x - x) * this.resetTweens[frame];
                this.canvas.y = y + (target.y - y) * this.resetTweens[frame];
                this.canvas.z = z + (target.z - z) * this.resetTweens[frame];
                this.canvas.draw();
                frame++;
                this.animationId = requestAnimationFrame(animate);
            }
            else {
                this.canvas.reset();
            }
        };
        this.animationId = requestAnimationFrame(animate);
    }

    zoom(delta) {
        let direction = 0;
        if(delta < 0) {
            direction = 1;
            delta *= -1;
        }
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
        const now = Date.now();
        const delta = now - this.lastScrollEvent || now;
        this.lastScrollEvent = now;
        return delta;
    }

    animateZoom(delta, direction) {
        let frames = delta * 10;
        const tweens = this.tween(frames, delta, easings.easeInOutSine);
        const animate = () => {
            frames--;
            if(frames >= 0) {
                this.canvas.move(0, 0, (direction ? tweens[frames] : -tweens[frames]) * this.canvas.z);
                this.animationId = requestAnimationFrame(animate);
            }
        };
        this.animationId = requestAnimationFrame(animate);
    }

    tween(frames, duration, easing) {
        const tweens = [];
        for(let frame = 0; frame < frames; frame++) {
            const t = (frame / fps) / duration;
            const factor = easing(t);
            tweens.push(factor);
        }
        return tweens;
    }
}

export default CanvasAnimator;