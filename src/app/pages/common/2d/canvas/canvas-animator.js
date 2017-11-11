import easings from "../../../../core/animation/easings";

const fps = 60;

class CanvasAnimator {

    constructor(canvas) {
        this.canvas = canvas;
        this.initializeReset();
    }

    initializeReset() {
        this.resetTweens = this.tween(fps * 0.5, easings.easeInOutSine);
    }

    pan(x, y) {
        cancelAnimationFrame(this.animationId);
        this.canvas.move(x, y, 0);
    }

    zoom(delta) {
        let direction = -1;
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
        const tweens = this.tween(frames, easings.easeInOutSine);
        const z = this.canvas.z;
        const target = z + delta;
        let frame = 0;
        const animate = () => {
            if(frame < tweens.length) {
                this.canvas.z = z + (target - z) * tweens[frame] * direction;
                this.canvas.draw();
                frame++;
                this.animationId = requestAnimationFrame(animate);
            }
        };
        this.animationId = requestAnimationFrame(animate);
    }

    reset() {
        cancelAnimationFrame(this.animationId); 
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

    tween(frames, easing) {
        const tweens = [];
        for(let frame = 0; frame < frames; frame++) {
            const t = frame / frames;
            const factor = easing(t);
            tweens.push(factor);
        }
        return tweens;
    }
}

export default CanvasAnimator;