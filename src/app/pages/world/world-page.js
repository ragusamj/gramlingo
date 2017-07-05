class WorldPage {

    constructor(worldMap) {
        this.worldMap = worldMap;
    }

    attach(pageTemplate, onPageChanged) {
        this.worldMap.draw(pageTemplate);
        onPageChanged();
    }
}

export default WorldPage;
