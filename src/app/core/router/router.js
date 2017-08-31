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
            e.preventDefault();
            let route = this.finder.getRoute(e.target.pathname);
            if(this.assert(route)) {
                this.onUrlChange(e.target.href);
                this.broker.go(route);
            }
        }
    }

    onPageLoad() {
        let route = this.finder.getRoute(window.location.pathname);
        if(this.assert(route)) {
            this.broker.go(route);
        }
    }

    onUrlChange(e) {
        window.history.pushState({}, "", e.detail || e);
    }

    assert(route) {
        if(route && route.path !== this.currentPath) {
            this.currentPath = route.path;
            return true;
        }
        return false;
    }
}

export default Router;
