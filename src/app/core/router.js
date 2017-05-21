import Template from "./template";

class Router {

    constructor(browserEvent, http, i18n, routes, placeholderElementId) {
        this._browserEvent = browserEvent;
        this._http = http;
        this._i18n = i18n;
        this._routes = routes;
        this._placeholderElementId = placeholderElementId;
        window.onhashchange = () => {
            let newRouteKey = this._getRouteKeyFromAddressBar();
            Object.keys(routes).forEach((key) => {
                if (newRouteKey === key && newRouteKey !== this._currentRouteKey) {
                    this._setRoute(key, this._routes[key]);
                }
            });
        };
        document.addEventListener("DOMContentLoaded", () => {
            this._initialize();
        });
    }

    _initialize() {
        let route = this._getRouteFromAddressBar() || this._getDefaultRoute();
        if (route) {
            this._setRoute(route.key, route.data);
        }
    }

    _getRouteFromAddressBar() {
        let routeKey = this._getRouteKeyFromAddressBar();
        return this._routes[routeKey] ?
            { key: routeKey, data: this._routes[routeKey] } :
            undefined;
    }

    _getDefaultRoute() {
        let route;
        Object.keys(this._routes).forEach((key) => {
            if(this._routes[key].isDefault) {
                route = { key: key, data: this._routes[key] };
            }
        });
        return route;
    }

    _getRouteKeyFromAddressBar() {
        return window.location.hash.substring(1);
    }

    _setRoute(routeKey, routeData) {
        this._browserEvent.emit("route-change-start", routeKey);
        this._http.getHTML(routeData.template, (html) => {
            let pageTemplate = new Template(html);
            let onDOMChanged = () => {
                pageTemplate.replaceContent(this._placeholderElementId);
                this._i18n.translateApplication();
                this._browserEvent.emit("route-change-success", routeKey);
                window.location.hash = routeKey;
                this._currentRouteKey = routeKey;
            };
            routeData.page.load(pageTemplate, onDOMChanged);
        });
    }
}

export default Router;
