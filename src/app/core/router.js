import Template from "./template";

class Router {

    constructor(browserEvent, http, i18n, routes, placeholderElementId, timeout) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.i18n = i18n;
        this.routes = routes;
        this.placeholderElementId = placeholderElementId;
        this.timeout = timeout;
        window.onhashchange = () => {
            let newRouteKey = this.getRouteKeyFromAddressBar();
            Object.keys(routes).forEach((key) => {
                if (newRouteKey === key && newRouteKey !== this.currentRouteKey) {
                    this.setRoute(key, this.routes[key]);
                }
            });
        };
        document.addEventListener("DOMContentLoaded", () => {
            this.initialize();
        });
    }

    initialize() {
        let route = this.getRouteFromAddressBar() || this.getDefaultRoute();
        if (route) {
            this.setRoute(route.key, route.data);
        }
    }

    getRouteFromAddressBar() {
        let routeKey = this.getRouteKeyFromAddressBar();
        return this.routes[routeKey] ?
            { key: routeKey, data: this.routes[routeKey] } :
            undefined;
    }

    getDefaultRoute() {
        let route;
        Object.keys(this.routes).forEach((key) => {
            if(this.routes[key].isDefault) {
                route = { key: key, data: this.routes[key] };
            }
        });
        return route;
    }

    getRouteKeyFromAddressBar() {
        return window.location.hash.substring(1);
    }

    setRoute(routeKey, routeData) {
        this.browserEvent.emit("route-change-start", routeKey);
        this.http.getHTML(routeData.template, (html) => {
            let pageTemplate = new Template(html);
            let onDOMChanged = () => {
                pageTemplate.replaceContent(this.placeholderElementId);
                this.i18n.translateApplication();
                this.browserEvent.emit("route-change-success", routeKey);
                window.location.hash = routeKey;
                this.currentRouteKey = routeKey;
            };
            this.timeout(() => {
                routeData.page.load(pageTemplate, onDOMChanged);
            });
        });
    }
}

export default Router;
