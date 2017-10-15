import CountryInflater from "./country-inflater";
import TopologyInflater from "../common/2d/topology-inflater";

class WorldPage {
    
    constructor(browserEvent, http, cachedInflater, worldMap, worldMapListener) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.cachedInflater = cachedInflater;
        this.worldMap = worldMap;
        this.worldMapListener = worldMapListener;
    }
    
    attach(pageTemplate, onPageChanged, parameters) {
        this.cachedInflater.get("/data/world-map.json", TopologyInflater, (data) => {
            this.geometries = data;
            this.cachedInflater.get("/data/countries.json", CountryInflater, (data) => {
                this.countries = data;
                this.loadPage(pageTemplate, onPageChanged, parameters);
            });
        });
    }
    
    detach() {
        this.removeListener();
        this.worldMapListener.detach();
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