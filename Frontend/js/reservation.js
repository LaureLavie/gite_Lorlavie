import { calculPrixReservation } from "./calculPrix.js";
import { API_URL } from "./config.js";

export function Reservation() {
  const arriveeInput = document.getElementById("reservation-date-arrivee");
  const departInput = document.getElementById("reservation-date-depart");
  const personnesSpan = document.getElementById("personnes");
  const nuitsSpan = document.getElementById("nuits");
  const montantSpan = document.getElementById("montant");
  const moinsBtn = document.getElementById("personnes-moins");
  const plusBtn = document.getElementById("personnes-plus");
  const menageCheckbox = document.getElementById("option-menage");
  const supMoinsBtn = document.getElementById("sup-moins");
  const supPlusBtn = document.getElementById("sup-plus");
  const supPersonnesSpan = document.getElementById("sup-personnes");

  if (
    !arriveeInput ||
    !departInput ||
    !personnesSpan ||
    !nuitsSpan ||
    !montantSpan ||
    !moinsBtn ||
    !plusBtn ||
    !menageCheckbox ||
    !supMoinsBtn ||
    !supPlusBtn ||
    !supPersonnesSpan
  ) {
    return;
  }

  // Initialisation des dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];
  arriveeInput.min = todayStr;
  departInput.min = todayStr;

  // Vérification de la disponibilité des dates
  async function verifierDisponibilite(dateArrivee, dateDepart) {
    try {
      const res = await fetch(`${API_URL}/api/calendrier/verifier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateArrivee, dateDepart }),
      });
      const data = await res.json();
      return data.disponible;
    } catch (error) {
      console.error("Erreur vérification:", error);
      return false;
    }
  }

  // Mise à jour date de départ minimum
  arriveeInput.addEventListener("change", async () => {
    const arrivee = new Date(arriveeInput.value);
    arrivee.setDate(arrivee.getDate() + 1);
    departInput.min = arrivee.toISOString().split("T")[0];

    if (departInput.value && departInput.value <= arriveeInput.value) {
      departInput.value = "";
    }

    updateNuits();
    updateMontant();
  });

  departInput.addEventListener("change", async () => {
    if (arriveeInput.value && departInput.value) {
      const errorDiv = document.querySelector(".errorDiv");
      const disponible = await verifierDisponibilite(
        arriveeInput.value,
        departInput.value
      );

      if (!disponible) {
        errorDiv.textContent =
          "Les dates sélectionnées ne sont pas disponibles. Veuillez en choisir d'autres.";
        errorDiv.style.display = "block";
        departInput.value = "";
        return;
      } else {
        errorDiv.style.display = "none";
      }
    }
    updateNuits();
    updateMontant();
  });

  // Gestion du nombre de personnes
  let personnes = 1;
  moinsBtn.addEventListener("click", () => {
    if (personnes > 1) {
      personnes--;
      personnesSpan.textContent = personnes;
      updateMontant();
    }
  });

  plusBtn.addEventListener("click", () => {
    if (personnes < 6) {
      personnes++;
      personnesSpan.textContent = personnes;
      updateMontant();
    }
  });

  // Gestion des personnes supplémentaires
  let supPersonnes = 0;
  supMoinsBtn.addEventListener("click", () => {
    if (supPersonnes > 0) {
      supPersonnes--;
      supPersonnesSpan.textContent = supPersonnes;
      updateMontant();
    }
  });

  supPlusBtn.addEventListener("click", () => {
    if (supPersonnes < 2 && personnes + supPersonnes < 8) {
      supPersonnes++;
      supPersonnesSpan.textContent = supPersonnes;
      updateMontant();
    }
  });

  // Gestion des options
  menageCheckbox.addEventListener("change", updateMontant);

  // Calcul du nombre de nuits
  function updateNuits() {
    const arrivee = arriveeInput.value;
    const depart = departInput.value;
    let nuits = 1;
    if (arrivee && depart) {
      const dateA = new Date(arrivee);
      const dateD = new Date(depart);
      const diff = (dateD - dateA) / (1000 * 60 * 60 * 24);
      nuits = diff > 0 ? diff : 1;
    }
    nuitsSpan.textContent = nuits;
    return nuits;
  }

  // Calcul du montant
  function updateMontant() {
    const nuits = updateNuits();
    const montant = calculPrixReservation(personnes, nuits, supPersonnes, {
      menage: menageCheckbox.checked,
    });
    montantSpan.textContent = montant + "€";
  }

  // Initialisation
  updateNuits();
  updateMontant();

  // Handler du submit du formulaire
  const form = document.querySelector("form.form");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const errorDiv = document.querySelector(".errorDiv");
      const successDiv = document.querySelector(".successDiv");

      // Validation des dates
      if (!arriveeInput.value || !departInput.value) {
        errorDiv.textContent =
          "Veuillez sélectionner vos dates d'arrivée et de départ.";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      // Vérification finale de la disponibilité
      const disponible = await verifierDisponibilite(
        arriveeInput.value,
        departInput.value
      );
      if (!disponible) {
        errorDiv.textContent =
          "Les dates sélectionnées ne sont plus disponibles. Veuillez en choisir d'autres.";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      // Création de l'objet réservation
      const reservation = {
        dateArrivee: arriveeInput.value,
        dateDepart: departInput.value,
        nombrePersonnes: parseInt(personnesSpan.textContent, 10),
        personnesSupplementaires: parseInt(supPersonnesSpan.textContent, 10),
        options: {
          menage: menageCheckbox.checked,
          commentaires: document.getElementById("message")?.value || "",
        },
        prixTotal: parseInt(montantSpan.textContent, 10),
      };

      // Stockage dans localStorage
      localStorage.setItem("reservationEnCours", JSON.stringify(reservation));

      // Redirection vers la page de paiement
      window.location.href = "modePaiement.html";
    });
  }
}
