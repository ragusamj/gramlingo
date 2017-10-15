import CountryInflater from "./country-inflater";
import Topology from "../common/2d/topology";

class WorldPage {
    
    constructor(browserEvent, http, worldMap, worldMapListener) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.worldMap = worldMap;
        this.worldMapListener = worldMapListener;
    }
    
    attach(pageTemplate, onPageChanged, parameters) {
        this.loadTopology(() => {
            this.loadCountries(() => {
                this.loadPage(pageTemplate, onPageChanged, parameters);
            });
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
                this.geometries = Topology.inflate(data);
                callback();
            }, (event) => {
                // console.log("loading world map topology, recieved", event.loaded, "bytes of", event.total);
                return event;
            });
        }
    }

    loadCountries(callback) {
        // TODO: create a generic data loader for verbs, topologies, countries etc
        if(this.countries) {
            callback();
        }
        else {
            this.http.getJSON("/data/countries.json", (data) => {
                this.countries = new CountryInflater().inflate(data);
                callback();
            }, (event) => {
                // console.log("loading countries, recieved", event.loaded, "bytes of", event.total);
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