// Au chargement de la page, on importe la navbar et active le menu burger
document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar");
  if (placeholder) {
    // On récupère le HTML de la navbar
    fetch("../../composants/navbar.html")
      .then((response) => response.text())
      .then((html) => {
        placeholder.innerHTML = html;

        // On active l'ouverture/fermeture du menu burger
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

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("footer");
  if (footer) {
    fetch("../../composants/footer.html")
      .then((res) => res.text())
      .then((html) => {
        footer.innerHTML = html;
      });
  }
});

// Au chargement de la page, on importe la hoteNavbar et active le menu burger
document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("hoteNavbar");
  if (placeholder) {
    // On récupère le HTML de la navbar
    fetch("../../composants/hoteNavbar.html")
      .then((response) => response.text())
      .then((html) => {
        placeholder.innerHTML = html;

        // On active l'ouverture/fermeture du menu burger Hote
        const hoteBurgerBtn = document.getElementById("hoteNavbar-burger");
        const hoteNavbarMenu = document.getElementById("hoteNavbar-menu");
        if (hoteBurgerBtn && hoteNavbarMenu) {
          hoteBurgerBtn.addEventListener("click", () => {
            hoteBurgerBtn.classList.toggle("open");
            hoteNavbarMenu.classList.toggle("open");
          });
        }
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hoteFooter = document.getElementById("hoteFooter");
  if (hoteFooter) {
    fetch("../../composants/hoteFooter.html")
      .then((res) => res.text())
      .then((html) => {
        hoteFooter.innerHTML = html;
      });
  }
});

// Variables globales pour le nombre de personnes et de nuits (valeurs par défaut)
let personnes = 1,
  nuits = 1;

// Fonction pour changer le nombre de personnes ou de nuits
function changer(type, delta) {
  if (type === "personnes") {
    // On limite entre 1 et 6 personnes
    personnes = Math.max(1, Math.min(6, personnes + delta));
    document.getElementById("personnes").textContent = personnes;
  }
  if (type === "nuits") {
    // On limite à minimum 1 nuit
    nuits = Math.max(1, nuits + delta);
    document.getElementById("nuits").textContent = nuits;
  }
  // On recalcule le montant à chaque changement
  recalculerMontant();
}

// Fonction pour calculer le montant total selon le nombre de personnes et de nuits
function recalculerMontant() {
  // Tableau des tarifs par nuit selon le nombre de personnes (index 0 = 1 personne, etc.)
  const tarifs = [65, 75, 85, 95, 105, 115];
  // On calcule le montant total
  let montant = tarifs[personnes - 1] * nuits;
  // On affiche le montant dans la page
  document.getElementById("montant").textContent = montant + "€";
}

// Initialisation des valeurs affichées au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("personnes").textContent = personnes;
  document.getElementById("nuits").textContent = nuits;
  recalculerMontant();
});

// Génération du calendrier et gestion des statuts
document.addEventListener("DOMContentLoaded", () => {
  // Paramètres initiaux
  let currentMonth = 0; // janvier
  let currentYear = 2026;
  let selectedStatus = "reserve"; // statut par défaut
  // Stockage des statuts des dates (clé: 'YYYY-MM-DD', valeur: statut)
  let dateStatus = {};

  // Génère le calendrier
  function renderCalendar() {
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    document.getElementById(
      "calendar-month"
    ).textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=dimanche
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDates = document.getElementById("calendar-dates");
    calendarDates.innerHTML = "";

    let start = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < start; i++) {
      calendarDates.innerHTML += `<div></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(d).padStart(2, "0")}`;
      // Si le statut n'est pas défini, on met "dispo" par défaut
      if (typeof dateStatus[dateKey] === "undefined") {
        dateStatus[dateKey] = "dispo";
      }
      const status = dateStatus[dateKey];
      calendarDates.innerHTML += `
        <div class="calendar-date ${status}" data-date="${dateKey}">${d}</div>
      `;
    }
  }

  // Changement de mois
  document.getElementById("prev-month").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  };
  document.getElementById("next-month").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  };

  // Sélection du statut
  document.querySelectorAll(".status-btn").forEach((btn) => {
    btn.onclick = () => {
      selectedStatus = btn.dataset.status;
      document
        .querySelectorAll(".status-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };
  });

  // Modification du statut d'une date
  document.getElementById("calendar-dates").onclick = (e) => {
    if (e.target.classList.contains("calendar-date")) {
      const dateKey = e.target.dataset.date;
      dateStatus[dateKey] = selectedStatus;
      renderCalendar();
    }
  };

  // Initialisation
  renderCalendar();
});

// Initialisation
let infoGite = {
  maxPersonnes: 6,
  tarifs: [65, 75, 85, 95, 105, 115, 125, 135], // 8 valeurs max
  options: [
    { nom: "Forfait ménage", tarif: 30, conditions: "" },
    { nom: "1 personne supplémentaire", tarif: 30, conditions: "" },
    { nom: "Heure d'arrivée", tarif: 0, conditions: "17h" },
    { nom: "Heure de départ", tarif: 0, conditions: "14h" },
    { nom: "Animaux de compagnie", tarif: 0, conditions: "Faire la demande" },
  ],
};

// Affiche les tarifs selon le nombre de personnes
function renderTarifs() {
  const tarifsList = document.getElementById("tarifs-list");
  tarifsList.innerHTML = "";
  for (let i = 1; i <= infoGite.maxPersonnes; i++) {
    tarifsList.innerHTML += `
      <div class="tarif-row">
        <label>${i} personne${i > 1 ? "s" : ""} :</label>
        <input type="number" min="0" value="${
          infoGite.tarifs[i - 1] || 0
        }" data-index="${i - 1}" class="tarif-input" /> €
      </div>
    `;
  }
}

// Boutons +/− pour le nombre de personnes
document.getElementById("increase-personnes").onclick = () => {
  let val = parseInt(document.getElementById("max-personnes-input").value, 10);
  if (val < 8) {
    val++;
    document.getElementById("max-personnes-input").value = val;
    document.getElementById("max-personnes").textContent = val;
    infoGite.maxPersonnes = val;
    renderTarifs();
  }
};

document.getElementById("decrease-personnes").onclick = () => {
  let val = parseInt(document.getElementById("max-personnes-input").value, 10);
  if (val > 1) {
    val--;
    document.getElementById("max-personnes-input").value = val;
    document.getElementById("max-personnes").textContent = val;
    infoGite.maxPersonnes = val;
    renderTarifs();
  }
};

// Récupère les tarifs modifiés à la validation
document.querySelector(".modification-form").onsubmit = (e) => {
  e.preventDefault();
  document.querySelectorAll(".tarif-input").forEach((input) => {
    infoGite.tarifs[parseInt(input.dataset.index, 10)] = parseInt(
      input.value,
      10
    );
  });
  // ...traitement/sauvegarde
  alert("Modifications enregistrées !");
};

// Génère les options
function renderOptions() {
  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";
  infoGite.options.forEach((opt, idx) => {
    optionsList.innerHTML += `
      <div class="option-row">
        <input type="text" value="${opt.nom}" placeholder="Nom de l'option" class="option-nom" data-index="${idx}" />
        <input type="number" min="0" value="${opt.tarif}" class="option-tarif" data-index="${idx}" /> €
        <input type="text" value="${opt.conditions}" placeholder="Conditions" class="option-cond" data-index="${idx}" />
        <button type="button" class="button-red" onclick="removeOption(${idx})">Supprimer</button>
      </div>
    `;
  });
}

// Ajoute une nouvelle option
document.getElementById("add-option").onclick = () => {
  infoGite.options.push({ nom: "", tarif: 0, conditions: "" });
  renderOptions();
};

// Supprime une option
window.removeOption = function (idx) {
  infoGite.options.splice(idx, 1);
  renderOptions();
};

// Met à jour le nombre de personnes et les tarifs
document.getElementById("max-personnes").onchange = (e) => {
  infoGite.maxPersonnes = parseInt(e.target.value, 10);
  // Ajuste la taille du tableau des tarifs
  while (infoGite.tarifs.length < infoGite.maxPersonnes)
    infoGite.tarifs.push(0);
  while (infoGite.tarifs.length > infoGite.maxPersonnes) infoGite.tarifs.pop();
  renderTarifs();
};

// Sauvegarde les modifications
document.getElementById("info-form").onsubmit = (e) => {
  e.preventDefault();
  // Récupère les tarifs
  document.querySelectorAll(".tarif-input").forEach((input) => {
    infoGite.tarifs[parseInt(input.dataset.index, 10)] = parseInt(
      input.value,
      10
    );
  });
  // Récupère les options
  document.querySelectorAll(".option-row").forEach((row, idx) => {
    infoGite.options[idx].nom = row.querySelector(".option-nom").value;
    infoGite.options[idx].tarif = parseInt(
      row.querySelector(".option-tarif").value,
      10
    );
    infoGite.options[idx].conditions = row.querySelector(".option-cond").value;
  });
  // Ici tu peux envoyer infoGite à ton backend via fetch/PUT
  alert("Informations du gîte modifiées !");
  // Redirection ou mise à jour de la page infoGite.html possible
};

// Annuler
document.getElementById("cancel-btn").onclick = () => {
  window.location.href = "infoGite.html";
};

// Initialisation à l'ouverture
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("max-personnes").textContent = infoGite.maxPersonnes;
  document.getElementById("max-personnes-input").value = infoGite.maxPersonnes;
  renderTarifs();
  renderOptions();
});
