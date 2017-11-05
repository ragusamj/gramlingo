import Rectangle from "./rectangle";

class Label {

    constructor(text, style) {
        this.text = text;
        this.style = style;

        this.fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2 * style.font.size / 100;
        this.font = this.fontSize + "px " + style.font.family;
        this.padding = this.fontSize / 2;

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.context.font = this.font;

        this.measure();
        this.draw();
    }

    measure() {
        let metrics = this.context.measureText(this.text);
        this.width = metrics.width + this.padding;
        this.height = this.fontSize + this.padding;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    draw() {
        Rectangle.draw(this.context, [0, 0], this.width, this.height, 5);
        this.context.fillStyle = "#333";
        this.context.fill();

        this.context.fillStyle = this.style.color;
        this.context.font = this.font;
        this.context.textBaseline = "middle";
        this.context.fillText(this.text, (this.padding / 2), (this.padding / 2) + (this.fontSize / 2));
    }
}

export default Label;