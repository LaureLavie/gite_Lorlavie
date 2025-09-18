import {Logout} from "./logout.js";

export function Navbar() {
  const placeholder = document.getElementById("navbar");
  if (placeholder) {
    fetch("../../composants/navbar.html")
      .then((response) => response.text())
      .then((html) => {
        placeholder.innerHTML = html;
        const burgerBtn = document.getElementById("navbar-burger");
        const navbarMenu = document.getElementById("navbar-menu");
        if (burgerBtn && navbarMenu) {
          burgerBtn.addEventListener("click", () => {
            burgerBtn.classList.toggle("open");
            navbarMenu.classList.toggle("open");
          });
        }
        //Intégration de la déconnexion
        Logout()
      });
  }
}

