import Rectangle from "./rectangle";

class Label {

    constructor(context, fontFamily, fontSizePercent, textColor, backgroundColor) {
        this.context = context;

        this.fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2 * fontSizePercent / 100;
        this.font = this.fontSize + "px " + fontFamily;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.padding = this.fontSize / 2;
    }

    draw(point, text) {
        let metrics = this.context.measureText(text);
        let width = metrics.width + this.padding;
        let height = this.fontSize + this.padding;
        point[0] -= (metrics.width / 2);

        Rectangle.draw(this.context, point, width, height, 5);
        this.context.fillStyle = this.backgroundColor;
        this.context.fill();

        this.context.fillStyle = this.textColor;
        this.context.font = this.font;
        this.context.textBaseline = "middle";
        this.context.fillText(text, point[0] + (this.padding / 2), point[1] + (this.padding / 2) + (this.fontSize / 2));
    }
}

export default Label;