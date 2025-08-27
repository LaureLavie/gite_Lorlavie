document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar");
  if (placeholder) {
    fetch("../composants/navbar.html")
      .then((response) => response.text())
      .then((html) => {
        placeholder.innerHTML = html;

        // Ajout du JS pour le burger après l'import
        const burgerBtn = document.getElementById("navbar-burger");
        const navbarMenu = document.getElementById("navbar-menu");
        if (burgerBtn && navbarMenu) {
          burgerBtn.addEventListener("click", () => {
            burgerBtn.classList.toggle("open");
            navbarMenu.classList.toggle("open");
          });
        }
      });
  }
});
