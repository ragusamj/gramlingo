class WorldPage {

    constructor(browserEvent, worldMap) {
        browserEvent.on("map-country-changed", this.onMapCountrySelected.bind(this));
        this.worldMap = worldMap;
    }

    attach(pageTemplate, onPageChanged) {
        onPageChanged();
        this.worldMap.initialize();
    }

    onMapCountrySelected(e) {
        //console.log("onMapCountrySelected", e.detail);
        return e;
    }
}

export default WorldPage;
