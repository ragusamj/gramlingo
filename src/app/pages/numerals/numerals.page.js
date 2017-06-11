class NumeralsPage {

    attach(pageTemplate, onPageAttached) {
        this.applyPageTemplate(pageTemplate, onPageAttached);
    }

    applyPageTemplate(pageTemplate, onPageAttached) {
        pageTemplate.add("xxx", "span", { innerHTML: "heyoo" });
        onPageAttached();
    }
}

export default NumeralsPage;
