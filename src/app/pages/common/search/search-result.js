import Template from "../../../core/template";

class SearchResult {

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

            result.matches.forEach((match) => {
                let itemTemplate = this.itemTemplate.clone();
                itemTemplate.set("pre", { innerHTML: match.pre });
                itemTemplate.set("match", { innerHTML: match.match });
                itemTemplate.set("post", { innerHTML: match.post });
                itemTemplate.set("source", { innerHTML: match.source });
                let li = itemTemplate.set("search-result-item");
                li.setAttribute("data-search-result-index", match.index);
                this.ids.push(li.id);
                ul.appendChild(itemTemplate.fragment());
            });

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

    select(element) {
        if(element && element.hasAttribute("data-search-result-index")) {
            let index = element.getAttribute("data-search-result-index");
            this.browserEvent.emit("search-result-index-updated", index);
        }
    }

    close() {
        let ul = document.getElementById("search-result-list");
        if(ul) {
            ul.classList.add("hide");
        } 
    }

    assertTemplates() {
        if(!this.template) {
            this.template = Template.fromElementId("search-result-template");
            this.itemTemplate = Template.fromElementId("search-result-item-template");
        }
    }
}

export default SearchResult;
