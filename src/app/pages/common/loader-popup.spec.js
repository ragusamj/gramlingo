import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import LoaderPopup from "./loader-popup";

const i18n = {
    translate: sinon.stub()
};

const html =
    "<div id='loader-popup'>" +
        "<div id='loader-popup-message'></div>" +
        "<div id='loader-popup-percentage'></div>" +
    "</div>";

test("LoaderPopup should translate message", (t) => {
    dom.sandbox(html, {}, () => {
        let loaderPopup = new LoaderPopup(i18n);
        let message = document.getElementById("loader-popup-message");

        loaderPopup.show("some-translation-key");
        
        t.equal(message.getAttribute("data-translate"), "some-translation-key");
        t.end();
    });
});

test("LoaderPopup should show popup", (t) => {
    dom.sandbox(html, {}, () => {
        let loaderPopup = new LoaderPopup(i18n);
        let popup = document.getElementById("loader-popup");
        t.equal(popup.className, "");

        loaderPopup.show("some-translation-key");

        t.equal(popup.className, "show");
        t.end();
    });
});

test("LoaderPopup should show progress", (t) => {
    dom.sandbox(html, {}, () => {
        let loaderPopup = new LoaderPopup(i18n);
        let percentage = document.getElementById("loader-popup-percentage");
        t.equal(percentage.innerHTML, "");

        loaderPopup.progress(10);

        t.equal(percentage.innerHTML, "10%");
        t.end();
    });
});

test("LoaderPopup should hide popup", (t) => {
    dom.sandbox(html, {}, () => {
        let loaderPopup = new LoaderPopup(i18n);
        let popup = document.getElementById("loader-popup");

        loaderPopup.show();
        t.equal(popup.className, "show");

        loaderPopup.hide();
        t.equal(popup.className, "");

        t.end();
    });
});
