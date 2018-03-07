(function() {

    let featureCollection = window.topojson.feature(window.worldMapTopoJSON, window.worldMapTopoJSON.objects.world);

    let features = new window.mapcolorizer.Rings(featureCollection);
    let neighbors = features.neighbors.values;
    let palette = ["#070", "#0a0", "#0c0", "#0f0"];

    let colorizer = new window.mapcolorizer.BacktrackingColorizer(neighbors, {
        numberOfColors: 4,
        startIndexIslands: 1,
        maxAttempts: 5000,
        path: new window.mapcolorizer.Path(neighbors, 3)
    });

    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");

    function render() {
        featureCollection.features.forEach(function(feature, index) {

            context.beginPath();
    
            if(feature.geometry.type === "Polygon") {
                feature.geometry.coordinates.forEach(function(coordinates) {
                    draw(coordinates);
                });
            }
    
            if(feature.geometry.type === "MultiPolygon") {
                feature.geometry.coordinates.forEach(function(multi) {
                    multi.forEach(function(coordinates) {
                        draw(coordinates);
                    });
                });
            }
    
            context.fillStyle = palette[colorizer.colors[index]];
            context.fill();
        });
    }

    function draw(coordinates) {
        coordinates.forEach(function(coordinate, index) {
            if(index === 0) {
                context.moveTo(coordinate[0], coordinate[1]);
            }
            else {
                context.lineTo(coordinate[0], coordinate[1]);
            }
        });
    }

    render();
})();