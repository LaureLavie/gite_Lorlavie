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

export function Calendrier() {
  // Vérification du token admin
  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href = "/pages/administrateur/login.html";
    return;
  }

  // Exemple : récupérer les réservations pour bloquer les dates
  fetch("http://localhost:3000/api/reservations", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      // Utilise les données pour bloquer les dates dans le calendrier
      // Par exemple : data.forEach(reservation => { ... });
    });

  const calendarMonth = document.getElementById("calendar-month");
  const calendarDates = document.getElementById("calendar-dates");
  if (!calendarMonth || !calendarDates) return; // Stop si la page n'a pas le calendrier

  calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;

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
    Calendrier();
  };
  document.getElementById("next-month").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    Calendrier();
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
  document.getElementById("calendar-dates").onclick = (e) => {
    if (e.target.classList.contains("calendar-date")) {
      const dateKey = e.target.dataset.date;
      dateStatus[dateKey] = selectedStatus;
      Calendrier();
    }
  };
}
