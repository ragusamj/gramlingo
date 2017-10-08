import Template from "../../../core/template/template";

class SearchResultPopup {

    constructor(browserEvent, walker) {
        this.browserEvent = browserEvent;
        this.walker = walker;
    }

    show(result) {

        this.assertTemplates();

        let template = this.template.clone();
        let ul = template.querySelector("ul");
        this.ids = [];

        if(result.matches.length > 0) {

            for(let match of result.matches) {
                let itemTemplate = this.itemTemplate.clone();
                itemTemplate.set("pre", { innerHTML: match.pre });
                itemTemplate.set("match", { innerHTML: match.match });
                itemTemplate.set("post", { innerHTML: match.post });
                itemTemplate.set("source", { innerHTML: match.source });
                let li = itemTemplate.set("search-result-item");
                li.setAttribute("data-search-result-index", match.index === undefined ? "" : match.index);
                this.ids.push(li.id);
                ul.appendChild(itemTemplate.fragment());
            }

            if(result.maxExceeded) {
                template.add(ul, "li", { innerHTML: "..." });
            }

            template.replaceContent("search-result-container");

            this.walker.link(this.ids);
        }
    }

    walk(keyCode) {
        this.walker.walk(keyCode);
    }

    selectCurrent() {
        let element = document.getElementById(this.walker.currentElementId);
        this.select(element);
    }

    click(element) {
        if(element && element.hasAttribute("data-search-result-index")) {
            this.select(element);
        }
        else {
            this.close();
        }
    }

    select(element) {
        if(element) {
            let index = element.getAttribute("data-search-result-index");
            if(index) {
                this.browserEvent.emit("search-result-selected", index);
                this.close();
            }
        }
    }

    close() {
        let container = document.getElementById("search-result-container");
        Template.clear(container);
    }

    assertTemplates() {
        if(!this.template) {
            this.template = Template.fromElementId("search-result-template");
            this.itemTemplate = Template.fromElementId("search-result-item-template");
        }
    }
}

export default SearchResultPopup;
