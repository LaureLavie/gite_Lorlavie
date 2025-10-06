import { API_URL } from "./config.js";

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedStatus = "disponible";
let dateStatus = {};

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

async function fetchCalendrier() {
  try {
    const res = await fetch(
      `${API_URL}/api/calendrier/${currentYear}/${currentMonth + 1}`
    );
    const data = await res.json();
    return data.calendrier || [];
  } catch (error) {
    console.error("Erreur lors de la récupération du calendrier:", error);
    return [];
  }
}

export async function CalendrierAdmin() {
  const calendarMonth = document.getElementById("calendar-month");
  const calendarDates = document.getElementById("calendar-dates");
  if (!calendarMonth || !calendarDates) return;

  calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Récupération des statuts
  const calendrier = await fetchCalendrier();
  dateStatus = {};

  calendrier.forEach((day) => {
    const dateKey = day.date.split("T")[0];
    dateStatus[dateKey] = day.statut;
  });

  // Génération du calendrier
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
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
    const status = dateStatus[dateKey] || "disponible";

    let cssClass = "disponible";
    if (status === "reserve") cssClass = "reserve";
    else if (status === "bloque") cssClass = "ferme";

    calendarDates.innerHTML += `
      <div class="calendar-date ${cssClass}" data-date="${dateKey}">${d}</div>
    `;
  }

  // Navigation mois
  document.getElementById("prev-month").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    CalendrierAdmin();
  };

  document.getElementById("next-month").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    CalendrierAdmin();
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

  // Modification des dates au clic
  calendarDates.onclick = (e) => {
    if (e.target.classList.contains("calendar-date")) {
      const dateKey = e.target.dataset.date;

      // Conversion des statuts pour l'API
      let apiStatus = selectedStatus;
      if (selectedStatus === "ferme") apiStatus = "bloque";

      dateStatus[dateKey] = apiStatus;

      // Mise à jour visuelle immédiate
      e.target.className = "calendar-date";
      if (apiStatus === "disponible") e.target.classList.add("disponible");
      else if (apiStatus === "reserve") e.target.classList.add("reserve");
      else if (apiStatus === "bloque") e.target.classList.add("ferme");
    }
  };
}

// Validation et envoi des modifications
document.addEventListener("DOMContentLoaded", () => {
  CalendrierAdmin();

  const validateBtn = document.querySelector(".button-green");
  if (validateBtn) {
    validateBtn.onclick = async () => {
      try {
        // Construit le tableau attendu par l'API
        const datesPayload = Object.entries(dateStatus).map(
          ([date, statut]) => ({
            date,
            statut,
          })
        );
        const token = localStorage.getItem("adminToken");

        // Envoi des modifications au serveur
        const res = await fetch(`${API_URL}/api/calendrier/dates`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dates: datesPayload,
          }),
        });

        if (res.ok) {
          alert("Calendrier mis à jour avec succès !");
          // Affiche les dates fermées
          const datesFermees = datesPayload
            .filter((d) => d.statut === "bloque")
            .map((d) => d.date);
          if (datesFermees.length > 0) {
            alert("Dates fermées par l'admin :\n" + datesFermees.join("\n"));
          }
          await CalendrierAdmin();
        } else {
          const error = await res.json();
          alert(
            "Erreur lors de la mise à jour : " +
              (error.error || "Erreur inconnue")
          );
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur de connexion au serveur");
      }
    };
  }

  const cancelBtn = document.querySelector(".button-brown");
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      CalendrierAdmin();
    };
  }
});
