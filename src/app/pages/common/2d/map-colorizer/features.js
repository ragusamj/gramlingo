class Features {

    constructor(object, strategy) {
        this.values = this.map(object.features || object, strategy);
    }

    map(object, strategy) {
        return object.map((item, i) => {
            const feature = {
                index: i,
                shapes: []
            };
            if(item.geometry) {
                if(item.geometry.type === "Polygon") {
                    feature.shapes.push(new strategy(item.geometry.coordinates));
                }
                if(item.geometry.type === "MultiPolygon") {
                    for(const coordinates of item.geometry.coordinates) {
                        feature.shapes.push(new strategy(coordinates));
                    }
                }
            }
            else {
                feature.shapes.push(new strategy(item));
            }
            return feature;
        });
    }
}

export default Features;
