class NumeralsPage {

    load(pageTemplate, onDOMChanged) {
        this.applyPageTemplate(pageTemplate, onDOMChanged);
    }

    applyPageTemplate(pageTemplate, onDOMChanged) {
        pageTemplate.add("xxx", "span", { innerHTML: "heyoo" });
        onDOMChanged();
    }
}

export default NumeralsPage;
