import Template from "../template/template";

class PageBroker {

    constructor(browserEvent, http, placeholderElementId) {
        this.browserEvent = browserEvent;
        this.http = http;
        this.placeholderElementId = placeholderElementId;
        this.pageTemplateCache = {};
    }

    go(route) {
        this.browserEvent.emit("page-change-start", route.path);
        this.getPageTemplate(route, (pageTemplate) => {
            let onPageAttached = () => {
                pageTemplate.replaceContent(this.placeholderElementId);
                this.browserEvent.emit("page-change-success", route.path);
                this.browserEvent.emit("dom-content-changed");
                this.currentRoute = route;
            };
            setTimeout(() => {
                this.detach();
                route.page.attach(pageTemplate, onPageAttached, route.parameters);
            });
        });
    }

    detach() {
        if(this.currentRoute && this.currentRoute.page.detach) {
            this.currentRoute.page.detach();
        }
    }

    getPageTemplate(route, callback) {
        if(this.pageTemplateCache[route.template]) {
            return callback(this.pageTemplateCache[route.template]);
        }
        else {
            this.http.getHTML(route.template, (html) => {
                this.pageTemplateCache[route.template] = new Template(html);
                callback(this.pageTemplateCache[route.template]);
            });
        }
    }
}

export default PageBroker;
