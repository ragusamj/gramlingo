import Rectangle from "./rectangle";

const headRadius = 24;
const legWidth = 8;
const legHeight = 64;

class Marker {

    constructor(context, style) {
        this.context = context;
        this.style = style;
    }

    draw(point) {
        this.drawLeg(point);
        this.drawHead(point);
    }

    drawLeg(point) {
        let legPosition = [
            point[0] - legWidth / 2,
            point[1] - legHeight
        ];

        Rectangle.draw(this.context, legPosition, legWidth, legHeight, 4);
        this.paint();
    }

    drawHead(point) {
        let headPositionX = point[0];
        let headPositionY = point[1] - (headRadius / 2) - legHeight;

        this.context.beginPath();
        this.context.arc(headPositionX, headPositionY, headRadius, 0, 2 * Math.PI);
        this.paint();
    }

    paint() {
        this.context.fillStyle = this.style.background;
        this.context.fill();
        this.context.strokeStyle = this.style.border.color;
        this.context.lineWidth = this.style.border.width;
        this.context.stroke();
    }
}

export default Marker;