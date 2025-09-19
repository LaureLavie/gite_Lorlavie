// Génère le calendrier
let currentMonth = 0; // Janvier (0 = janvier, 11 = décembre)
let currentYear = 2026;
let selectedStatus = "dispo"; // Statut sélectionné par défaut
let dateStatus = {}; // Stocke le statut de chaque date (ex: "2026-01-15": "reserve")

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
  const res = await fetch(`http://localhost:3000/api/calendrier/${currentYear}/${currentMonth + 1}`);
  return await res.json();
}


export async function CalendrierAdmin() {

  const calendarMonth = document.getElementById("calendar-month");
  const calendarDates = document.getElementById("calendar-dates");
  if (!calendarMonth || !calendarDates) return; // Stop si la page n'a pas le calendrier

  calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Fetch statuts
  const calendrier = await fetchCalendrier();
  dateStatus = {};
  Object.entries(calendrier).forEach(([date, info]) => {
    dateStatus[date] = info.statut;
  });

  // Génère le calendrier
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=dimanche
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
    // Si le statut n'est pas défini, on met "dispo" par défaut
    if (typeof dateStatus[dateKey] === "undefined") {
      dateStatus[dateKey] = "dispo";
    }
    const status = dateStatus[dateKey];
    calendarDates.innerHTML += `
      <div class="calendar-date ${status}" data-date="${dateKey}">${d}</div>
    `;
  }

  // Listeners
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
  document.querySelectorAll(".status-btn").forEach((btn) => {
    btn.onclick = () => {
      selectedStatus = btn.dataset.status;
      document
        .querySelectorAll(".status-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };
  });
   // Modification des dates
   calendarDates.onclick = (e) => {
    if (e.target.classList.contains("calendar-date")) {
      const dateKey = e.target.dataset.date;
      dateStatus[dateKey] = selectedStatus;
      CalendrierAdmin();
    }
  };
  };
  // Envoi des modifications
  document.querySelector(".button-green").onclick = async () => {
    const updates = Object.entries(dateStatus).map(([date, statut]) => ({ date, statut }));
    await fetch("http://localhost:3000/api/calendrier/dates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates: updates })
    });
    alert("Calendrier mis à jour !");
    CalendrierAdmin();
  };


// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  CalendrierAdmin();
});