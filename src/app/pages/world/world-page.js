import Polygon from "./canvas/polygon";
import Topojson from "./canvas/topojson";

const defaultSelectedCountry = "SE";

class WorldPage {
    
    constructor(browserEvent, http, worldMapListener) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.worldMapListener = worldMapListener;
    }
    
    attach(pageTemplate, onPageChanged, parameters) {
        this.loadMap(() => {
            this.loadPage(pageTemplate, onPageChanged, parameters);
        });
    }
    
    detach() {
        this.removeListener();
        this.worldMapListener.detach();
    }

    loadMap(callback) {
        if(this.topology) {
            callback();
        }
        else {
            this.http.getJSON("/data/world-map.json", (data) => {
                this.topology = data;
                callback();
            }, (event) => {
                // console.log("loading world map, recieved", event.loaded, "bytes of", event.total);
                return event;
            });
        }
    }

    loadPage(pageTemplate, onPageChanged) {
        onPageChanged();
        
        this.colors = {
            blue: ["#004085", "#005dc2", "#007bff", "#7abaff", "#cce5ff"],
            cyan: ["#117b8c", "#17a2b8", "#86cfda", "#d1ecf1"],
            gray: ["#666c72", "#868e96", "#c0c4c8", "#e7e8ea"],
            green: ["#155724", "#1e7f34", "#28a745", "#8fd19e", "#d4edda}"],
            red: ["#721c24", "#a72834", "#dc3545", "#ed969e", "#f8d7da"]
        };

        this.selectedColor = this.colors.cyan;

        for(let geometry of this.topology.objects.world.geometries) {
            geometry.polygons = [];
            for(let arcs of geometry.arcs) {
                let coordinates = [];
                Topojson.transform(this.topology, arcs, coordinates);
                geometry.polygons.push(coordinates);
            }

            geometry.centroids = [];
            for(let polygon of geometry.polygons) {
                let centroid = Polygon.centroid(polygon);
                geometry.centroids.push(centroid);
            }
        }

        this.canvas = document.getElementById("world-map");
        if (this.canvas.getContext) {
            this.scale = 1;
            this.context = this.canvas.getContext("2d");
        }
        
        this.draw(0);
        this.onMapCountrySelected({detail: defaultSelectedCountry});
        
        this.removeListener = this.browserEvent.on("map-country-changed", this.onMapCountrySelected.bind(this));
        this.browserEvent.on("click", this.onClick.bind(this));
        this.browserEvent.on("wheel", this.onWheel.bind(this));
        //this.worldMapListener.attach(defaultSelectedCountry);
    }

    onClick(e) {
        if(e.target) {
            requestAnimationFrame(() => {
                if(e.target.hasAttribute("data-map-zoom-in")) {
                    this.draw(.5);
                }
                if(e.target.hasAttribute("data-map-zoom-out")) {
                    this.draw(-.5);
                }
            });
        }

        if(e.target && e.target.id === "world-map") {
            let mousePoint = this.toCanvasPoint(e);
            for(let geometry of this.topology.objects.world.geometries) {
                for(let polygon of geometry.polygons) {
                    if(Polygon.inside(mousePoint, polygon)) {
                        this.browserEvent.emit("map-country-changed", geometry.i);
                        return;
                    }
                }
            }
        }
    }
    
    onWheel(e) {
        if(e.target && e.target.id === "world-map") {
            e.preventDefault();
            requestAnimationFrame(() => {
                this.draw(e.deltaY / 100 * -1);
            });
        }
    }

    toCanvasPoint(e) {
        // TODO: adjust to zoom level
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        let scaleY = this.canvas.height / rect.height;
        return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
    }
    
    draw(step) {
        if(this.context) {
    
            this.scale += step;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            let offsetX = ((this.canvas.width * this.scale) - this.canvas.width) / 2;
            let offsetY = ((this.canvas.height * this.scale) - this.canvas.height) / 2;

            for(let geometry of this.topology.objects.world.geometries) {
                for(let polygon of geometry.polygons) {
                    this.context.beginPath();
                    for(let i = 0; i < polygon.length; i++) {
                        let x = (polygon[i][0] * this.scale) - offsetX;
                        let y = (polygon[i][1] * this.scale) - offsetY;
                        if(i === 0) {
                            this.context.moveTo(x, y);
                        }
                        else {
                            this.context.lineTo(x, y);
                        }
                    }
                    this.context.fillStyle = this.selectedColor[geometry.c];
                    this.context.fill();
                }
            }

            if(this.scale >= 4) {
                for(let geometry of this.topology.objects.world.geometries) {
                    this.context.fillStyle = "#000";
                    this.context.font = "28px 'Montserrat', sans-serif";
                    this.context.textAlign = "center";
                    for(let centroid of geometry.centroids) {
                        if(centroid[0] && centroid[1]) {
                            let name = this.getCountryNameTemp(geometry.i);
                            this.context.fillText(name, (centroid[0] * this.scale) - offsetX, (centroid[1] * this.scale) - offsetY);
                        }
                    }
                }
            }
        }
    }
    
    onMapCountrySelected(e) {
        let header = document.getElementById("world-info-header");
        header.innerHTML = this.getCountryNameTemp(e.detail);
    
        let flag = document.getElementById("flag-widget-flag");
        flag.src = "/images/flags/" + e.detail + ".png";
    
        let iso = document.getElementById("flag-widget-iso");
        iso.innerHTML = e.detail;
    }
    
    getCountryNameTemp(iso) {
        // TODO: fetch real country data
        switch(iso) {
            case "BR": return "Brasil";
            case "CD": return "República Democrática del Congo";
            case "ES": return "España";
            case "GB": return "Reino Unido";
            case "NO": return "Noruega";
            case "PG": return "Papúa Nueva Guinea";
            case "SE": return "Suecia";
            case "US": return "Estados Unidos";
        }
        return iso;
    }
}
    
export default WorldPage;