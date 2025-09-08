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
      });
  }
}
// Déconnexion admin
const logoutBtn = document.getElementById("logout-admin");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // Supprime le token JWT
    localStorage.removeItem("adminToken");
    // Redirige vers la page visiteur ou login
    window.location.href = "/index.html"; // ou la page d'accueil visiteur
  });
}
