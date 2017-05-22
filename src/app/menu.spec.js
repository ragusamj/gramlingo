import test from "tape";
import BrowserEvent from "./core/browser-event";
import Dom from "./core/mock/dom";
import Menu from "./menu";

test("Menu should set inactive item", (t) => {
    Dom.sandbox("<ul id='navbar-nav'><li href='#/path' class='nav-link' id='test'></li></ul>", {}, () => {
        let browserEvent = new BrowserEvent();
        new Menu(browserEvent);
        browserEvent.emit("route-change-success", "/another-path");
        t.equal(document.getElementById("test").className, "nav-link");
        t.end();
    });
});

test("Menu should set active item", (t) => {
    Dom.sandbox("<ul id='navbar-nav'><li href='#/path' class='nav-link' id='test'></li></ul>", {}, () => {
        let browserEvent = new BrowserEvent();
        new Menu(browserEvent);
        browserEvent.emit("route-change-success", "/path");
        t.equal(document.getElementById("test").className, "nav-link active");
        t.end();
    });
});

test("Menu should toggle hamburger", (t) => {
    Dom.sandbox("<button id='toggle-button' data-navbar-toggler='nav'></button><div id='nav'></div>", {}, () => {
        new Menu(new BrowserEvent());
        let button = document.getElementById("toggle-button"); 
        button.dispatchEvent(new Event("click"));
        t.equal(document.getElementById("nav").className, "navbar-hide");
        t.end();
    });
});

test("Menu should only toggle hamburger if element has data-navbar-toggler attribute", (t) => {
    Dom.sandbox("<button id='toggle-button'></button><div id='nav'></div>", {}, () => {
        new Menu(new BrowserEvent());
        let button = document.getElementById("toggle-button"); 
        button.dispatchEvent(new Event("click"));
        t.equal(document.getElementById("nav").className, "");
        t.end();
    });
});
