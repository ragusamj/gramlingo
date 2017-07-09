class WorldPage {

    constructor(worldMap) {
        this.worldMap = worldMap;
    }

    attach(pageTemplate, onPageChanged) {
        onPageChanged();
    }
}

export default WorldPage;
