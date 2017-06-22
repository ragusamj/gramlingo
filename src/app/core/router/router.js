class Router {

    constructor(browserEvent, finder, broker) {
        this.finder = finder;
        this.broker = broker;
        browserEvent.on("click", this.onClick.bind(this));
        browserEvent.on("DOMContentLoaded", this.onPageLoad.bind(this));
        browserEvent.on("popstate", this.onPageLoad.bind(this));
        browserEvent.on("url-change", this.onUrlChange);
    }

    onClick(e) {
        if(e.target.hasAttribute("data-route-link")) {
            let route = this.finder.getRoute(e.target.pathname);
            if(route) {
                e.preventDefault();
                this.onUrlChange(e.target.href);
                this.broker.go(route);
            }
        }
    }

    onPageLoad() {
        this.broker.go(this.finder.getRoute(window.location.pathname));
    }

    onUrlChange(e) {
        window.history.pushState({}, "", e.detail || e);
    }
}

export default Router;
