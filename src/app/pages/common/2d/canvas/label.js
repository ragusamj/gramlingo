import Rectangle from "./rectangle";

const offsetY = 8;

class Label {

    constructor(context, style) {
        this.context = context;
        this.style = style;

        this.fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2 * style.font.size / 100;
        this.font = this.fontSize + "px " + style.font.family;
        this.padding = this.fontSize / 2;
    }

    draw(point, text) {
        let metrics = this.context.measureText(text);
        let width = metrics.width + this.padding;
        let height = this.fontSize + this.padding;
        point[0] -= width / 2;
        point[1] += offsetY;

        Rectangle.draw(this.context, point, width, height, 5);
        this.context.fillStyle = this.style.background;
        this.context.fill();

        this.context.fillStyle = this.style.color;
        this.context.font = this.font;
        this.context.textBaseline = "middle";
        this.context.fillText(text, point[0] + (this.padding / 2), point[1] + (this.padding / 2) + (this.fontSize / 2));
    }
}

export default Label;