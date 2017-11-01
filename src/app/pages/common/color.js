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

    constructor() {
        this.foo = "";
    }

    static scheme() {
        return scheme;
    }

    static shade(color, percent) {   
        let f = parseInt(color.slice(1), 16);
        let t = percent < 0 ? 0 : 255;
        let p = percent < 0 ? percent * -1 : percent;
        let R = f >> 16;
        let G = f >> 8 & 0x00FF;
        let B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000+ (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }
}

export default Color;