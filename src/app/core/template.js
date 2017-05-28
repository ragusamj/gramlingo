
const wrappers = {
    col: { selector: "colgroup", before: "<table><colgroup>", after: "</colgroup></table>" },
    td: { selector: "tr", before: "<table><tr>", after: "</tr></table>" },
    thead: { selector: "table", before: "<table>", after: "</table>" },
    tr: { selector: "tbody", before: "<table><tbody>", after: "</tbody></table>" }
};

class Template {

    constructor(content) {
        if(content.getElementById) {
            this.documentFragment = content;
        }
        else if(content.querySelectorAll) {
            this.documentFragment = document.createDocumentFragment();
            this.documentFragment.appendChild(content);
        }
        else if(typeof content === "string"){
            this.documentFragment = this.parse(content);
        }
        else {
            throw new Error("Invalid template content: " + typeof content);
        }
    }

    static fromElementId(elementId) {
        let element = document.getElementById(elementId);
        return new Template(element.innerHTML || element.cloneNode(true));
    }

    add(parent, tagName, properties) {
        let element = document.createElement(tagName);
        this.setProperties(element, properties);
        if(typeof parent === "string") {
            parent = this.documentFragment.getElementById(parent);
        }
        parent.appendChild(element);
        return element;
    }

    clone() {
        return new Template(this.fragment());
    }

    fragment() {
        return this.documentFragment.cloneNode(true);
    }

    getElementById(elementId) {
        return this.documentFragment.getElementById(elementId);
    }

    getElementsByTagName(tagname) {
        return this.documentFragment.firstChild.getElementsByTagName(tagname);
    }

    querySelectorAll(selectors) {
        return this.documentFragment.querySelectorAll(selectors);
    }

    replaceContent(elementId) {
        let element = document.getElementById(elementId);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element.appendChild(this.fragment());
    }

    parse(html) {

        let fragment;
        let template = document.createElement("template");

        if("content" in template) {
            template.innerHTML = html;
            fragment = template.content;
        }
        else {

            let firstTagName = html.match(/^[\s]*<([a-z][^\/\s>]+)/i)[1];
            let wrapper = wrappers[firstTagName];

            if(wrapper) {
                let parser = document.createElement("div");
                parser.insertAdjacentHTML("afterbegin", wrapper.before + html + wrapper.after);
                let query = parser.querySelector(wrapper.selector);
                fragment = document.createDocumentFragment();
                while (query.firstChild) {
                    fragment.appendChild(query.firstChild);
                }
            }
            else {
                fragment = document.createRange().createContextualFragment(html);
            }
        }

        return fragment;
    }

    set(elementId, properties) {
        let element = this.documentFragment.getElementById(elementId);
        element.id = elementId + "_" + Math.random().toString(36).substr(2, 10);
        this.setProperties(element, properties);
        return element; 
    }

    setProperties(element, properties) {
        if(properties) {
            Object.keys(properties).forEach((key) => {
                element[key] = properties[key];
            });
        }
    }
}

export default Template;
