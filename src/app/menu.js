class Menu {
    constructor(browserEvent) {
        browserEvent.on("route-change-success", (e) => {
            let navlinks = document.getElementById("navbar-nav").getElementsByClassName("nav-link");
            Array.prototype.forEach.call(navlinks, function(navlink) {
                navlink.className = ("#" + e.detail === navlink.getAttribute("href")) ?
                    "nav-link active" : "nav-link";
            });
        });
        browserEvent.on("click", (e) => {
            if(e.target.hasAttribute("data-navbar-toggler")) {
                let id = e.target.getAttribute("data-navbar-toggler");
                let popup = document.getElementById(id);
                popup.classList.toggle("navbar-hide");
            }
        });
    }
}

export default Menu;
