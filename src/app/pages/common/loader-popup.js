class LoaderPopup {

    constructor(i18n) {
        this.i18n = i18n;
        this.loader = document.getElementById("loader-popup");
        this.message = this.loader.querySelector("#loader-popup-message");
        this.percentage = this.loader.querySelector("#loader-popup-percentage");
    }

    show(translationKey) {
        this.message.setAttribute("data-translate", translationKey);
        this.i18n.translate(this.message);
        this.loader.classList.add("show");
    }

    progress(percentage) {
        this.percentage.innerHTML = percentage + "%";
    }

    hide() {
        this.loader.classList.remove("show");
    }
}

export default LoaderPopup;