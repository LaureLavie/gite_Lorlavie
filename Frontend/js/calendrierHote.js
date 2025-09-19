let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

async function fetchCalendrier() {
  const res = await fetch(`http://localhost:3000/api/calendrier/${currentYear}/${currentMonth + 1}`);
  return await res.json();
}

export async function CalendrierClient() {
  const calendarMonth = document.getElementById("calendar-month");
  const calendarDates = document.getElementById("calendar-dates");
  if (!calendarMonth || !calendarDates) return;

  calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Fetch statuts
  const calendrier = await fetchCalendrier();

  // Génère le calendrier
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  calendarDates.innerHTML = "";

  let start = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < start; i++) {
    calendarDates.innerHTML += `<div></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const status = calendrier[dateKey]?.statut || "dispo";
    calendarDates.innerHTML += `
      <div class="calendar-date ${status}" data-date="${dateKey}">${d}</div>
    `;
  }

  // Navigation
  document.getElementById("prev-month").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    CalendrierClient();
  };
  document.getElementById("next-month").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    CalendrierClient();
  };
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  CalendrierClient();
});