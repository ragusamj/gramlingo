class Rectangle {
    static draw(context, point, width, height, radius) {
        context.beginPath();
        context.moveTo(point[0] + radius, point[1]);
        context.lineTo(point[0] + width - radius, point[1]);
        context.quadraticCurveTo(point[0] + width, point[1], point[0] + width, point[1] + radius);
        context.lineTo(point[0] + width, point[1] + height - radius);
        context.quadraticCurveTo(point[0] + width, point[1] + height, point[0] + width - radius, point[1] + height);
        context.lineTo(point[0] + radius, point[1] + height);
        context.quadraticCurveTo(point[0], point[1] + height, point[0], point[1] + height - radius);
        context.lineTo(point[0], point[1] + radius);
        context.quadraticCurveTo(point[0], point[1], point[0] + radius, point[1]);
        context.closePath();
    }
}

export default Rectangle;