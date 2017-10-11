class Canvas {

    constructor(canvas, geometries) {
        this.canvas = canvas;
        this.geometries = geometries;
        this.context = this.canvas.getContext("2d");
    }
    
    toCanvasPoint(x, y) {
        // TODO: cache getBoundingClientRect, window resize
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = (this.canvas.width / rect.width);
        let scaleY = (this.canvas.height / rect.height);
        return [
            ((x - rect.left) * scaleX),
            ((y - rect.top) * scaleY)
        ];
    }
    
    draw(x, y, z) {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // (((w + x) * z) - w) / 2
        this.offsetX = (((this.canvas.width + x) * z) - this.canvas.width) / 2;  // 1=right,  2=middle, 1600=left
        this.offsetY = (((this.canvas.height + y) * z) - this.canvas.height) / 2; // 1=bottom, 2=middle, 810=top

        for(let geometry of this.geometries) {
            for(let polygon of geometry.polygons) {
                this.context.beginPath();
                for(let i = 0; i < polygon.length; i++) {
                    let x = (polygon[i][0] * z) - this.offsetX;
                    let y = (polygon[i][1] * z) - this.offsetY;
                    if(i === 0) {
                        this.context.moveTo(x, y);
                    }
                    else {
                        this.context.lineTo(x, y);
                    }
                }
                this.context.fillStyle = geometry.color;
                this.context.fill();
            }
        }

        if(z >= 4) {
            for(let geometry of this.geometries) {
                this.context.fillStyle = "#000";
                this.context.font = "28px 'Montserrat', sans-serif";
                this.context.textAlign = "center";
                for(let centroid of geometry.centroids) {
                    if(centroid[0] && centroid[1]) {
                        this.context.fillText(geometry.name, (centroid[0] * z) - this.offsetX, (centroid[1] * z) - this.offsetY);
                    }
                }
            }
        }
    }
}
    
export default Canvas;
    