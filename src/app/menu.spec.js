import test from "tape";
import BrowserEvent from "./core/browser-event";
import Dom from "./core/mock/dom";
import Menu from "./menu";

test("Menu should set inactive item", (t) => {
    Dom.sandbox("<ul id='navbar-nav'><li href='/path' class='nav-link' id='test'></li></ul>", {}, () => {
        let browserEvent = new BrowserEvent();
        new Menu(browserEvent);
        browserEvent.emit("page-change-success", "/another-path");
        t.equal(document.getElementById("test").className, "nav-link");
        t.end();
    });
});

test("Menu should set active item", (t) => {
    Dom.sandbox("<ul id='navbar-nav'><li href='/path' class='nav-link' id='test'></li></ul>", {}, () => {
        let browserEvent = new BrowserEvent();
        new Menu(browserEvent);
        browserEvent.emit("page-change-success", "/path");
        t.equal(document.getElementById("test").className, "nav-link active");
        t.end();
    });
});
