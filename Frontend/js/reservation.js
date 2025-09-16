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

  // Tarifs par nombre de personnes
  const tarifs = [65, 75, 85, 95, 105, 115];

  // Initialisation des dates
  const today = new Date().toISOString().split("T")[0];
  arriveeInput.min = today;
  departInput.min = today;

  // Met à jour la date de départ minimum quand la date d'arrivée change
  arriveeInput.addEventListener("change", () => {
    departInput.min = arriveeInput.value;
    // Si la date de départ est avant la date d'arrivée, on la corrige
    if (departInput.value < arriveeInput.value) {
      departInput.value = arriveeInput.value;
    }
    updateNuits();
    updateMontant();
  });

  departInput.addEventListener("change", () => {
    updateNuits();
    updateMontant();
  });

  // Gestion du nombre de personnes
  let personnes = 1;
  moinsBtn.addEventListener("click", () => {
    if (personnes > 1) {
      // minimum 1
      personnes--;
      personnesSpan.textContent = personnes;
      updateMontant();
    }
  });
  plusBtn.addEventListener("click", () => {
    if (personnes < 6) {
      // maximum 6
      personnes++;
      personnesSpan.textContent = personnes;
      updateMontant();
    }
  });

  // Gestion des personnes supplémentaires
  let supPersonnes = 0; // personnes supplémentaires (max 2)

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
    let baseTarif = tarifs[personnes - 1] || tarifs[0];
    let montant = baseTarif * nuits;

    if (menageCheckbox.checked) montant += 30;
    montant += supPersonnes * 30;

    montantSpan.textContent = montant + "€";
  }

  // Initialisation
  updateNuits();
  updateMontant();

  // Handler du submit du formulaire
  const form = document.querySelector("form.form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Récupère les valeurs au moment du submit
      const reservation = {
        dateArrivee: arriveeInput.value,
        dateDepart: departInput.value,
        nombrePersonnes: parseInt(personnesSpan.textContent, 10),
        personnesSupplementaires: parseInt(supPersonnesSpan.textContent, 10),
        options: {
          menage: menageCheckbox.checked,
          commentaires: document.getElementById("message").value ||""
        },
        prixTotal: parseInt(montantSpan.textContent,10) 
      };

      // Stocke la réservation dans le localStorage
      localStorage.setItem("reservationEnCours", JSON.stringify(reservation));

      // Redirige vers la page de paiement
      window.location.href = "modePaiement.html";
      });
    }
}
