import easings from "../../../../core/animation/easings";

const fps = 60;

class CanvasAnimator {

    constructor(canvas) {
        this.canvas = canvas;
    }

    reset() {
        cancelAnimationFrame(this.animationId);
        this.canvas.center(2, 2);

        let duration = 0.5;
        let tweens = [];
        let frames = (1000 * duration) / (1000 / fps);

        for(let frame = 0; frame < frames; frame++) {
            let t = (frame / fps) / duration;
            let factor = easings.easeInOutSine(t);
            tweens.push(factor);
        }  
        
        let target = this.canvas.getInitialBounds();
        let x = this.canvas.x;
        let y = this.canvas.y;
        let z = this.canvas.z;
        let frame = 0; 

        let animate = () => {
            if(frame < tweens.length) {
                this.canvas.x = x + (target.x - x) * tweens[frame];
                this.canvas.y = y + (target.y - y) * tweens[frame];
                this.canvas.z = z + (target.z - z) * tweens[frame];
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
        let now = Date.now();
        let delta = now - this.lastScrollEvent || now;
        this.lastScrollEvent = now;
        return delta;
    }

    animateZoom(delta, direction) {
        let frames = delta * 10;
        let tweens = this.tween(frames, delta, easings.easeInOutSine);
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
            let factor = easing(t);
            tweens.push(factor);
        }
        return tweens;
    }
}

export default CanvasAnimator;