class Template {

    static load(id) {

        let template = document.createDocumentFragment();
        let parser = document.createElement("div");
        template.appendChild(parser);
        parser.innerHTML = document.getElementById(id).innerHTML;
        template.removeChild(template.firstChild);
        template.appendChild(parser.firstChild);

        return template;
    }
}

export default Template;
