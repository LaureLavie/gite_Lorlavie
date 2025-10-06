import dotenv from "dotenv";
dotenv.config();

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

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
      `${process.env.API_URL}/api/calendrier/${currentYear}/${currentMonth + 1}`
    );
    const data = await res.json();
    return data.calendrier || [];
  } catch (error) {
    console.error("Erreur lors de la récupération du calendrier:", error);
    return [];
  }
}

export async function CalendrierClient() {
  const calendarMonth = document.getElementById("calendar-month");
  const calendarDates = document.getElementById("calendar-dates");
  if (!calendarMonth || !calendarDates) return;

  calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Récupération des statuts depuis le serveur
  const calendrier = await fetchCalendrier();

  // Génération du calendrier
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  calendarDates.innerHTML = "";

  let start = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < start; i++) {
    calendarDates.innerHTML += `<div></div>`;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    const currentDate = new Date(currentYear, currentMonth, d);

    // Trouver le statut de cette date
    const dayInfo = calendrier.find(
      (day) => day.date.split("T")[0] === dateKey
    );
    const status = dayInfo?.statut || "disponible";

    let cssClass = "disponible";
    let title = "Disponible";

    // Gestion des dates passées
    if (currentDate < today) {
      cssClass = "passe";
      title = "Date passée";
    } else {
      // Application du statut
      if (status === "reserve") {
        cssClass = "reserve";
        title = "Réservé";
      } else if (status === "bloque") {
        cssClass = "ferme";
        title = "Fermé";
      } else {
        cssClass = "disponible";
        title = "Disponible";
      }
    }

    calendarDates.innerHTML += `
      <div class="calendar-date ${cssClass}" data-date="${dateKey}" title="${title}">${d}</div>
    `;
  }

  // Navigation
  document.getElementById("prev-month").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    CalendrierClient();
  };

  document.getElementById("next-month").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    CalendrierClient();
  };
}

// Actualisation automatique toutes les 30 secondes
setInterval(() => {
  if (document.getElementById("calendar-dates")) {
    CalendrierClient();
  }
}, 30000);

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  CalendrierClient();
});
