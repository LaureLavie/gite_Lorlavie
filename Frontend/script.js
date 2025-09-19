// Importation des composants JS
import { Navbar } from "./js/navbar.js";
import { Footer } from "./js/footer.js";
import { HoteNavbar } from "./js/hoteNavbar.js";
import { HoteFooter } from "./js/hoteFooter.js";
import { Carroussel } from "./js/carroussel.js";
import { Calendrier } from "./js/calendrier.js";
import { Reservation } from "./js/reservation.js";
import {showMessage} from "./js/config.js";

// Initialisation des composants au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  // Navbar visiteur
  HoteNavbar();
  // Footer visiteur
  HoteFooter();
  // Carroussel
  Carroussel();
  // Calendrier
  Calendrier();
  // Réservation
  Reservation();
  // Navbar admin
  Navbar();
  // Footer admin
  Footer();   
 // Show Message
 showMessage();
});
