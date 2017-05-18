import ApplicationEvent from "./application-event";
import Http from "./http";
import I18n from "./i18n";
import Template from "./template";

class Router {

    constructor(routes, placeholderElementId) {
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
        this._placeholderElement = document.getElementById(this._placeholderElementId);
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
        ApplicationEvent.emit("route-change-start", routeData.routeKey);
        Http.getHTML(routeData.template, (html) => {
            let pageTemplate = new Template(html);
            let onDOMChanged = () => {
                pageTemplate.replaceContent("page-placeholder");
                I18n.translateApplication();
                ApplicationEvent.emit("route-change-success", routeData.routeKey);
                window.location.hash = routeKey;
                this._currentRouteKey = routeKey;
            };
            routeData.page.load(pageTemplate, onDOMChanged);
        });
    }
}

export default Router;
