class NumeralsPage {

    load(pageTemplate, onDOMChanged) {
        this._applyPageTemplate(pageTemplate, onDOMChanged);
    }

    _applyPageTemplate(pageTemplate, onDOMChanged) {
        pageTemplate.add("xxx", "span", { innerHTML: "heyoo" });
        onDOMChanged();
    }
}

export default NumeralsPage;
