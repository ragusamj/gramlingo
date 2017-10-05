class Polygon {

    static centroid(polygon){
        let xmin, xmax, ymin, ymax;
        for(let point of polygon){
            xmin = (point[0] < xmin || xmin === undefined) ? point[0] : xmin;
            xmax = (point[0] > xmax || xmax === undefined) ? point[0] : xmax;
            ymin = (point[1] < ymin || ymin === undefined) ? point[1] : ymin;
            ymax = (point[1] > ymax || ymax === undefined) ? point[1] : ymax;
        }
        return [(xmin + xmax) / 2, (ymin + ymax) / 2];
    }

    static inside(point, polygon) {
        // Ray casting, http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i][0];
            let yi = polygon[i][1];
            let xj = polygon[j][0];
            let yj = polygon[j][1];
            if (((yi > point[1]) !== (yj > point[1])) && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        return inside;
    }
}

export default Polygon;
