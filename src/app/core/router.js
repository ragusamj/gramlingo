import I18n from "./i18n";
import Template from "./template";

class Router {

    constructor(applicationEvent, http, routes, placeholderElementId) {
        this._applicationEvent = applicationEvent;
        this._http = http;
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
        this._applicationEvent.emit("route-change-start", routeData.routeKey);
        this._http.getHTML(routeData.template, (html) => {
            let pageTemplate = new Template(html);
            let onDOMChanged = () => {
                pageTemplate.replaceContent(this._placeholderElementId);
                I18n.translateApplication();
                this._applicationEvent.emit("route-change-success", routeData.routeKey);
                window.location.hash = routeKey;
                this._currentRouteKey = routeKey;
            };
            routeData.page.load(pageTemplate, onDOMChanged);
        });
    }
}

export default Router;
