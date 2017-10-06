import Topology from "./world-map/topology";

class WorldPage {
    
    constructor(browserEvent, http, worldMap, worldMapListener) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.worldMap = worldMap;
        this.worldMapListener = worldMapListener;

        // TODO: fetch real country data
        this.countries = {
            BR: { name: "Brasil" },
            CD: { name: "República Democrática del Congo" },
            ES: { name: "España" },
            GB: { name: "Reino Unido" },
            NO: { name: "Noruega" },
            PG: { name: "Papúa Nueva Guinea" },
            SE: { name: "Suecia" },
            US: { name: "Estados Unidos" }
        };
    }
    
    attach(pageTemplate, onPageChanged, parameters) {
        this.loadTopology(() => {
            this.loadPage(pageTemplate, onPageChanged, parameters);
        });
    }
    
    detach() {
        this.removeListener();
        this.worldMapListener.detach();
    }

    loadTopology(callback) {
        if(this.geometries) {
            callback();
        }
        else {
            this.http.getJSON("/data/world-map.json", (data) => {
                this.geometries = Topology.transform(data);
                callback();
            }, (event) => {
                // console.log("loading world map topology, recieved", event.loaded, "bytes of", event.total);
                return event;
            });
        }
    }

    loadPage(pageTemplate, onPageChanged) {
        onPageChanged();        
        this.removeListener = this.browserEvent.on("map-country-changed", this.onMapCountrySelected.bind(this));
        this.worldMap.initialize(this.geometries, this.countries);
        this.worldMapListener.attach();
    }
    
    onMapCountrySelected(e) {
        let header = document.getElementById("world-info-header");
        header.innerHTML = this.countries[e.detail] ? this.countries[e.detail].name : e.detail;
    
        let flag = document.getElementById("flag-widget-flag");
        flag.src = "/images/flags/" + e.detail + ".png";
    
        let iso = document.getElementById("flag-widget-iso");
        iso.innerHTML = e.detail;
    }
}
    
export default WorldPage;