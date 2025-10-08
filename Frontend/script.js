// Importation des composants JS

import { Navbar } from "./js/navbar.js";
import { Footer } from "./js/footer.js";
import { HoteNavbar } from "./js/hoteNavbar.js";
import { Carroussel } from "./js/carroussel.js";
import { CalendrierClient } from "./js/calendrierHote.js";
import { Reservation } from "./js/reservation.js";

// Initialisation des composants au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  // Navbar visiteur
  HoteNavbar();
  // Carroussel
  Carroussel();
  // Calendrier
  CalendrierClient();
  // Réservation
  Reservation();
  // Navbar admin
  Navbar();
  // Footer admin/visiteur
  Footer();
});
