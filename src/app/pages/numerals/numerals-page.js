class NumeralsPage {

    attach(pageTemplate, onPageChanged) {
        this.applyPageTemplate(pageTemplate, onPageChanged);
    }

    applyPageTemplate(pageTemplate, onPageChanged) {
        pageTemplate.clone();
        onPageChanged();
    }
}

export default NumeralsPage;
