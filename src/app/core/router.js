import ApplicationEvent from "./application-event";
import Http from "./http";
import I18n from "./i18n";
import Template from "./template";

class Router {

    constructor(routes, placeholderElementId) {
        this._routes = routes;
        this._placeholderElementId = placeholderElementId;
        window.onhashchange = () => {
            let href = this._getCurrentHref();
            Object.keys(routes).forEach((key) => {
                if (href === key && href !== this._currentRoute) {
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
            this._setRoute(route.href, route.route);
        }
    }

    _getRouteFromAddressBar() {
        let href = this._getCurrentHref();
        return this._routes[href] ? { href: href, route: this._routes[href] } : undefined;
    }

    _getDefaultRoute() {
        let route;
        Object.keys(this._routes).forEach((key) => {
            if(this._routes[key].isDefault) {
                route = { href: key, route: this._routes[key] };
            }
        });
        return route;
    }

    _getCurrentHref() {
        return window.location.hash.substring(1);
    }

    _setRoute(href, route) {
        ApplicationEvent.emit("route-change-start", route.page);
        Http.getHTML(route.template, (html) => {
            let pageTemplate = new Template(html);
            let onDOMChanged = () => {
                pageTemplate.replaceContent("page-placeholder");
                I18n.translateApplication();
                ApplicationEvent.emit("route-change-success", route.page);
                window.location.hash = href;
                this._currentRoute = href;
            };
            route.page.load(pageTemplate, onDOMChanged);
        });
    }
}

export default Router;
