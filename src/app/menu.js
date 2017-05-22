class Menu {
    constructor(browserEvent) {
        browserEvent.on("route-change-success", (e) => {
            let navlinks = document.getElementById("navbar-nav").getElementsByClassName("nav-link");
            Array.prototype.forEach.call(navlinks, function(navlink) {
                navlink.className = ("#" + e.detail === navlink.getAttribute("href")) ?
                    "nav-link active" : "nav-link";
            });
        });
    }
}

export default Menu;
