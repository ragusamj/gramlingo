class Template {

    constructor(content) {
        if(content.getElementById) {
            this._documentFragment = content;
        }
        else if(content.querySelectorAll) {
            this._documentFragment = document.createDocumentFragment();
            this._documentFragment.appendChild(content);
        }
        else if(typeof content === "string"){
            this._documentFragment = this._parse(content);
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
        if(properties) {
            Object.keys(properties).forEach((key) => {
                element[key] = properties[key];
            });
        }
        if(typeof parent === "string") {
            parent = this._documentFragment.getElementById(parent);
        }
        parent.appendChild(element);
        return element;
    }

    clone() {
        return new Template(this.fragment());
    }

    fragment() {
        return this._documentFragment.cloneNode(true);
    }

    getElementById(elementId) {
        return this._documentFragment.getElementById(elementId);
    }

    querySelectorAll(selectors) {
        return this._documentFragment.querySelectorAll(selectors);
    }

    replaceContent(elementId) {
        let element = document.getElementById(elementId);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element.appendChild(this.fragment());
    }

    _parse(html) {
        let fragment = document.createDocumentFragment();
        let parser = document.createElement("div");
        parser.innerHTML = html;
        parser.childNodes.forEach((node) => {
            fragment.appendChild(node.cloneNode(true));    
        });        
        return fragment;
    }
}

export default Template;
