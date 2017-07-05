class WorldMap {

    constructor(browserEvent) {
        browserEvent.on("click", this.onClick.bind(this));
        browserEvent.on("mouseover", this.onMouseOver.bind(this));
        browserEvent.on("mouseout", this.onMouseOut.bind(this));
    }

    draw(pageTemplate) {
        return pageTemplate;
    }

    onClick(e) {
        if(e.target.hasAttribute("data-map-country")) {
            //
        }
    }
    
    onMouseOver(e) {
        if(e.target.hasAttribute("data-map-country")) {
            e.target.setAttribute("transform", "translate(10, 10), scale(1.01, 1.01)");
        }
    }
    
    onMouseOut(e) {
        if(e.target.hasAttribute("data-map-country")) {
            e.target.setAttribute("transform", "scale(1,1)");
        }
    }
}

export default WorldMap;