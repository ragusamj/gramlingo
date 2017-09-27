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
        return e;
    }
}

export default WorldPage;
