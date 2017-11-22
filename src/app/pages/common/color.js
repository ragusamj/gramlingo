const scheme = {
    blue:    "#007bff",
    indigo:  "#6610f2",
    purple:  "#6f42c1",
    pink:    "#e83e8c",
    red:     "#dc3545",
    orange:  "#fd7e14",
    yellow:  "#ffc107",
    green:   "#28a745",
    teal:    "#20c997",
    cyan:    "#17a2b8"
};

class Color {

    static scheme() {
        return scheme;
    }

    static shade(color, percent) {   
        let t = percent < 0 ? 0 : 255;
        let p = percent < 0 ? percent * -1 : percent;
        let rgb = this.rgb(color);
        return "#" + (0x1000000 +
            (Math.round((t - rgb.r) * p) + rgb.r) * 0x10000 +
            (Math.round((t - rgb.g) * p) + rgb.g) * 0x100 +
            (Math.round((t - rgb.b) * p) + rgb.b)
        ).toString(16).slice(1);
    }

    static rgb(color) {
        let i = parseInt(color.slice(1), 16);
        return {
            r: i >> 16,
            g: i >> 8 & 0x00FF,
            b: i & 0x0000FF
        };
    }

    static vec4(color, a) {
        let rgb = this.rgb(color);
        return [
            rgb.r / 255,
            rgb.g / 255,
            rgb.b / 255,
            a || 1
        ];
    }
}

export default Color;