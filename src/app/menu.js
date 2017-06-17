class Menu {
    constructor(browserEvent) {

        browserEvent.on("page-change-success", (e) => {
            let navlinks = document.getElementById("navbar-nav").getElementsByClassName("nav-link");
            Array.prototype.forEach.call(navlinks, function(navlink) {
                if(e.detail.split("/")[1] === navlink.getAttribute("href").split("/")[1]) {
                    navlink.classList.add("active");
                }
                else {
                    navlink.classList.remove("active");
                }
            });
        });

        browserEvent.on("click", (e) => {
            if(e.target.hasAttribute("data-navbar-toggler")) {
                let id = e.target.getAttribute("data-navbar-toggler");
                let popup = document.getElementById(id);
                popup.classList.toggle("hide");
            }
        });
    }
}

export default Menu;
