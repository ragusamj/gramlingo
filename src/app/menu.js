class Menu {
    constructor(browserEvent) {
        browserEvent.on("page-change-success", (e) => {
            let navlinks = document.getElementById("navbar-nav").getElementsByClassName("nav-link");
            for(let navlink of navlinks) {
                if(e.detail.split("/")[1] === navlink.getAttribute("href").split("/")[1]) {
                    navlink.classList.add("active");
                }
                else {
                    navlink.classList.remove("active");
                }
            }
        });
    }
}

export default Menu;
