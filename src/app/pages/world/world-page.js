import CountryInflater from "./country-inflater";
import TopologyInflater from "../common/2d/topology-inflater";

const defaultSelectedCountry = "SE";

class WorldPage {
    
    constructor(browserEvent, cachedInflater, exerciseArea, exerciseAreaListener, worldMap) {
        this.browserEvent = browserEvent;
        this.cachedInflater = cachedInflater;
        this.exerciseArea = exerciseArea;
        this.exerciseAreaListener = exerciseAreaListener;
        this.worldMap = worldMap;
    }
    
    attach(pageTemplate, onPageChanged, parameters) {
        this.cachedInflater.get("/data/world-map.json", TopologyInflater, "world-loader-popup-loading-map", (data) => {
            this.geometries = data;
            this.cachedInflater.get("/data/countries.json", CountryInflater, "world-loader-popup-loading-countries", (data) => {
                this.countries = data;
                this.loadPage(pageTemplate, onPageChanged, parameters);
            });
        });
        this.removeListeners = [
            this.browserEvent.on("canvas-geometry-clicked", this.onMapCountrySelected.bind(this))
        ];
        this.exerciseAreaListener.attach();
        this.worldMap.attach();
    }
    
    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
        this.exerciseAreaListener.detach();
        this.worldMap.detach();
    }

    loadPage(pageTemplate, onPageChanged, parameters) {
        this.createContext(parameters.iso || defaultSelectedCountry);
        this.exerciseArea.build(pageTemplate, this.context);
        onPageChanged();
        this.setHeader();
        this.setFlagWidget();
        this.exerciseArea.updateContext(this.context);
        this.worldMap.initialize(this.geometries, this.countries, this.context.iso);
    }

    createContext(iso) {
        this.context = {
            country: this.countries[iso.toUpperCase()],
            iso: iso.toUpperCase(),
            toggler: "toggle-country-data"
        };
    }
    
    onMapCountrySelected(e) {
        this.createContext(e.detail.geometryId);
        this.setHeader();
        this.setFlagWidget();
        this.exerciseArea.updateContext(this.context);
        this.browserEvent.emit("url-change", "/world/" + e.detail.geometryId.toLowerCase());
    }

    setHeader() {
        let header = document.getElementById("world-info-header");
        header.innerHTML = this.countries[this.context.iso].name;
    }

    setFlagWidget() {
        let flag = document.getElementById("flag-widget-flag");
        flag.src = "/images/flags/" + this.context.iso + ".svg";
    
        let iso = document.getElementById("flag-widget-iso");
        iso.innerHTML = this.context.iso;
    }
}
    
export default WorldPage;