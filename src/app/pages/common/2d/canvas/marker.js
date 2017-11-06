import Rectangle from "./rectangle";

const headRadius = 24;
const legWidth = 8;
const legHeight = 64;

class Marker {

    constructor(style) {
        this.style = style;

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.width = (headRadius * 2) + (this.style.border.width * 2);
        this.height = this.width + legHeight - this.style.border.width;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.drawLeg();
        this.drawHead();
    }

    drawLeg() {
        let point = [
            (this.width / 2) - (legWidth / 2),
            (legHeight - headRadius) + (this.style.border.width * 2)
        ];
        Rectangle.draw(this.context, point, legWidth, legHeight, 4);
        this.paint();
    }

    drawHead() {
        let center = this.width / 2;
        this.context.beginPath();
        this.context.arc(center, center, headRadius, 0, 2 * Math.PI);
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