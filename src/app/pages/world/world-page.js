class WorldPage {

    constructor(browserEvent, worldMapListener) {
        this.browserEvent = browserEvent;
        this.worldMapListener = worldMapListener;
    }

    attach(pageTemplate, onPageChanged) {
        onPageChanged();
        this.worldMapListener.initialize();
        this.removeListener = this.browserEvent.on("map-country-changed", this.onMapCountrySelected.bind(this));
    }

    detach() {
        this.removeListener();
        this.worldMapListener.destroy();
    }

    onMapCountrySelected(e) {
        //console.log("onMapCountrySelected", e.detail);
        return e;
    }
}

export default WorldPage;
