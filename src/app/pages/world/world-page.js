const defaultSelectedCountry = "SE";

class WorldPage {

    constructor(browserEvent, worldMapListener) {
        this.browserEvent = browserEvent;
        this.worldMapListener = worldMapListener;
    }

    attach(pageTemplate, onPageChanged) {
        onPageChanged();
        this.removeListener = this.browserEvent.on("map-country-changed", this.onMapCountrySelected.bind(this));
        this.worldMapListener.attach(defaultSelectedCountry);
    }

    detach() {
        this.removeListener();
        this.worldMapListener.detach();
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
