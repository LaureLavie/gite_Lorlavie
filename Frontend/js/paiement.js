const form = document.querySelector("form.form");
const errorDiv = document.querySelector(".errorDiv");
const successDiv = document.querySelector(".successDiv");

let selectedMode = "en ligne";

// Gestion des boutons de mode de paiement
document.addEventListener("DOMContentLoaded", () => {
  const switchBtns = document.querySelectorAll(".switch-btn");

  if (switchBtns.length > 0) {
    // Active le premier par défaut
    switchBtns[0].classList.add("active");
    selectedMode = switchBtns[0].textContent.trim().toLowerCase();

    switchBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        switchBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        selectedMode = this.textContent.trim().toLowerCase();
      });
    });
  }

  // Récupération et affichage de la réservation en cours
  const reservation = JSON.parse(
    localStorage.getItem("reservationEnCours") || "{}"
  );
  if (reservation.prixTotal) {
    const montantDisplay = document.getElementById("montant-total");
    if (montantDisplay) {
      montantDisplay.textContent = reservation.prixTotal + "€";
    }
  }
});

// Soumission du formulaire
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Récupération des champs
    const nom = document.getElementById("nom")?.value;
    const prenom = document.getElementById("prenom")?.value;
    const email = document.getElementById("email")?.value;
    const telephone = document.getElementById("telephone")?.value;
    const adresse = document.getElementById("adresse")?.value;
    const ville = document.getElementById("ville")?.value;
    const codePostal = document.getElementById("codePostal")?.value;
    const pays = document.getElementById("pays")?.value;
    const rgpdCheckbox = document.getElementById("rgpd");

    // Validation RGPD OBLIGATOIRE
    if (!rgpdCheckbox || !rgpdCheckbox.checked) {
      errorDiv.textContent =
        "Vous devez accepter les conditions RGPD pour continuer.";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
      rgpdCheckbox?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Validation des champs obligatoires
    if (
      !nom ||
      !prenom ||
      !email ||
      !telephone ||
      !adresse ||
      !ville ||
      !codePostal ||
      !pays
    ) {
      errorDiv.textContent =
        "Tous les champs marqués d'un * sont obligatoires.";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorDiv.textContent = "Veuillez entrer une adresse email valide.";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
      return;
    }

    // Récupération de la réservation
    const reservation = JSON.parse(
      localStorage.getItem("reservationEnCours") || "{}"
    );

    if (!reservation.dateArrivee || !reservation.dateDepart) {
      errorDiv.textContent =
        "Erreur: données de réservation manquantes. Veuillez recommencer.";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
      return;
    }

    // Ajout des informations client
    reservation.client = {
      name: nom,
      surname: prenom,
      email: email,
      telephone: telephone,
      adresseComplete: {
        adresse: adresse,
        ville: ville,
        codePostal: codePostal,
        pays: pays,
      },
    };

    // Ajout du mode de paiement
    reservation.modePaiement = selectedMode;

    // Affichage du chargement
    successDiv.textContent = "Envoi de votre réservation en cours...";
    successDiv.style.display = "block";
    errorDiv.style.display = "none";

    // Envoi au serveur
    try {
      const res = await fetch("http://localhost:3000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation),
      });

      const result = await res.json();

      if (res.ok) {
        // Succès
        localStorage.removeItem("reservationEnCours");
        successDiv.textContent =
          "Réservation envoyée avec succès ! Redirection...";
        successDiv.style.display = "block";
        errorDiv.style.display = "none";

        // Redirection vers la page de confirmation
        setTimeout(() => {
          window.location.href = "confirmation.html";
        }, 1500);
      } else {
        errorDiv.textContent =
          result.error ||
          result.message ||
          "Erreur lors de l'envoi de la réservation.";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
      }
    } catch (err) {
      console.error("Erreur:", err);
      errorDiv.textContent =
        "Erreur de connexion au serveur. Veuillez réessayer.";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  });
}
