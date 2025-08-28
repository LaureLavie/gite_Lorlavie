document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar");
  if (placeholder) {
    fetch("../composants/navbar.html")
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
});

// Valeurs par défaut
let personnes = 1,
  nuits = 1;

function changer(type, delta) {
  if (type === "personnes") {
    personnes = Math.max(1, Math.min(6, personnes + delta)); // min 1, max 6
    document.getElementById("personnes").textContent = personnes;
  }
  if (type === "nuits") {
    nuits = Math.max(1, nuits + delta); // min 1
    document.getElementById("nuits").textContent = nuits;
  }
  recalculerMontant();
}

function recalculerMontant() {
  // Tarifs par nuit selon le nombre de personnes
  const tarifs = [65, 75, 85, 95, 105, 115];
  // personnes est toujours entre 1 et 6
  let montant = tarifs[personnes - 1] * nuits;
  document.getElementById("montant").textContent = montant + "€";
}

// Initialisation des valeurs affichées
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("personnes").textContent = personnes;
  document.getElementById("nuits").textContent = nuits;
  recalculerMontant();
});
