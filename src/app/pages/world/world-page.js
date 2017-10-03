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
        if(this.map) {
            callback();
        }
        else {
            this.http.getJSON("/data/world-map.json", (data) => {
                this.map = data;
                callback();
            }, (event) => {
                // console.log("loading verbs, recieved", event.loaded, "bytes of", event.total);
                return event;
            });
        }
    }

    loadPage(pageTemplate, onPageChanged) {
        onPageChanged();
        
        this.colors = {
            cyan: ["#117b8c", "#17a2b8", "#86cfda", "#d1ecf1"],
            gray: ["#666c72", "#868e96", "#c0c4c8", "#e7e8ea"]
        };

        for(let geometry of this.map.objects.world.geometries) {
            geometry.polygons = [];
            for(let arcs of geometry.arcs) {
                let coordinates = [];
                this.resolve(arcs, coordinates);
                geometry.polygons.push(coordinates);
            }
        }

        /*
        this.shapes = [
            [[416,288],[480,288],[480,352],[416,352]],
            [[544,288],[608,288],[608,352],[544,352]],
            [[480,352],[544,352],[544,416],[480,416]],
            [[416,416],[480,416],[480,480],[416,480]],
            [[544,416],[608,416],[608,480],[544,480]],
            [[678,678],[690,599],[706,643],[544,502]],
        ];
        */

        this.canvas = document.getElementById("world-map");
        if (this.canvas.getContext) {
            this.scale = 1;
            this.context = this.canvas.getContext("2d");
        }
        
        this.draw(0);
        
        this.removeListener = this.browserEvent.on("map-country-changed", this.onMapCountrySelected.bind(this));
        this.browserEvent.on("click", this.onClick.bind(this));
        this.browserEvent.on("wheel", this.onWheel.bind(this));
        this.worldMapListener.attach(defaultSelectedCountry);
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
    }
    
    onWheel(e) {
        if(e.target && e.target.id === "world-map") {
            e.preventDefault();
            requestAnimationFrame(() => {
                this.draw(e.deltaY / 100 * -1);
            });
        }
    }

    resolve(arcs, coordinates) {
        for(let item of arcs) {
            if(Array.isArray(item)) {
                this.resolve(item, coordinates);
            }
            else {
                let buffer;
                if(item < 0) {
                    buffer = this.arcToCoordinates(this.map, this.map.arcs[~item]);
                    buffer.reverse();
                }
                else {
                    buffer = this.arcToCoordinates(this.map, this.map.arcs[item]);
                }
                coordinates.push(...buffer);
            }
        }
    }
    
    draw(step) {
        if(this.context) {
    
            this.scale += step;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            let offsetX = ((this.canvas.width * this.scale) - this.canvas.width) / 2;
            let offsetY = ((this.canvas.height * this.scale) - this.canvas.height) / 2;

            for(let geometry of this.map.objects.world.geometries) {
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
                    this.context.fillStyle = this.colors.cyan[geometry.c];
                    this.context.fill();
                //this.context.strokeStyle = "#000";
                //this.context.stroke();
                }
            }

            /*

            this.context.beginPath();
            this.context.moveTo(this.canvas.width / 2, 0);
            this.context.lineTo(this.canvas.width / 2, this.canvas.height);
            this.context.strokeStyle = "red";
            this.context.stroke();

            this.context.beginPath();
            this.context.moveTo(0, this.canvas.height / 2);
            this.context.lineTo(this.canvas.width, this.canvas.height / 2);
            this.context.strokeStyle = "red";
            this.context.stroke();

            let offsetX = ((this.canvas.width * this.scale) - this.canvas.width) / 2;
            let offsetY = ((this.canvas.height * this.scale) - this.canvas.height) / 2;
                
            for(let shape of this.shapes) {
                this.context.beginPath();
                for(let i = 0; i < shape.length; i++) {
                    let x = (shape[i][0] * this.scale) - offsetX;
                    let y = (shape[i][1] * this.scale) - offsetY;
                    if(i === 0) {
                        this.context.moveTo(x, y);
                    }
                    else {
                        this.context.lineTo(x, y);
                    }
                }
                this.context.closePath();
                this.context.fillStyle = "#17a2b8";
                this.context.strokeStyle = "black";
                this.context.stroke();
                this.context.fill();
            }*/
        }
    }

    arcToCoordinates(topology, arc) {
        let x = 0, y = 0;
        return arc.map(function(point) {
            return [
                (x += point[0]) * topology.transform.scale[0] + topology.transform.translate[0],
                (y += point[1]) * topology.transform.scale[1] + topology.transform.translate[1]
            ];
        });
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