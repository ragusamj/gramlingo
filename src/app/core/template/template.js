import FragmentParser from "./fragment-parser";

class Template {

    constructor(content) {
        let type = Object.prototype.toString.call(content);
        if(type === "[object DocumentFragment]") {
            this.documentFragment = content;
        }
        else if(content.querySelectorAll) {
            this.documentFragment = document.createDocumentFragment();
            this.documentFragment.appendChild(content);
        }
        else if(typeof content === "string"){
            this.documentFragment = FragmentParser.parse(content);
        }
        else {
            throw new Error("Invalid template content: " + type);
        }
    }

    static fromElementId(elementId) {
        let element = document.getElementById(elementId);
        return new Template(element.innerHTML || element.cloneNode(true));
    }

    static clear(element) {
        if(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    }

    add(parent, tagName, properties) {
        let element = document.createElement(tagName);
        this.setProperties(element, properties);
        if(typeof parent === "string") {
            parent = this.documentFragment.querySelector("#" + parent);
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

    querySelector(selector) {
        return this.documentFragment.querySelector(selector);
    }

    querySelectorAll(selector) {
        return this.documentFragment.querySelectorAll(selector);
    }

    replaceContent(elementId) {
        let element = document.getElementById(elementId);
        Template.clear(element);
        element.appendChild(this.fragment());
    }

    set(elementId, properties) {
        let element = this.documentFragment.querySelector("#" + elementId);
        element.id = elementId + "_" + Math.random().toString(36).substr(2, 10);
        this.setProperties(element, properties);
        return element; 
    }

    setProperties(element, properties) {
        if(properties) {
            for(let key of Object.keys(properties)) {
                element[key] = properties[key];
            }
        }
    }
}

export default Template;
