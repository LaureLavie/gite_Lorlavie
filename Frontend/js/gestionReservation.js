const reservationsListDiv = document.getElementById("reservations-list");
const messageDiv = document.getElementById("message");

// Récupérer la liste des réservations
async function fetchReservations() {
  try {
    const res = await fetch("http://localhost:3000/api/reservations");
    const reservations = await res.json();
    renderReservations(reservations);
  } catch (error) {
    messageDiv.textContent = "Erreur lors du chargement des réservations";
    messageDiv.style.display = "block";
  }
}

// Affichage dynamique des réservations
function renderReservations(reservations) {
  reservationsListDiv.innerHTML = reservations.map(r => `
    <div class="card card--white">
      <div class="card__badge">${r.client?.surname || ""} ${r.client?.name || ""}</div>
      <div class="card__icons">
        <button class="icon-modif" title="Modifier" data-id="${r._id}">
          <i class="fa fa-pen"></i>
        </button>
        <button class="icon-delete" title="Supprimer" data-id="${r._id}">
          <i class="fa fa-trash"></i>
        </button>
        ${r.statut === "En Attente" ? `<button class="icon-valid" title="Valider" data-id="${r._id}"><i class="fa fa-check"></i></button>` : ""}
      </div>
      <div class="card__content">
        <div class="card__row"><span>Date d'arrivée:</span> <strong>${r.dateArrivee?.slice(0,10)}</strong></div>
        <div class="card__row"><span>Date de départ:</span> <strong>${r.dateDepart?.slice(0,10)}</strong></div>
        <div class="card__row"><span>Nombre de personnes:</span> <strong>${r.nombrePersonnes}</strong></div>
        <div class="card__row"><span>Montant total:</span> <strong>${r.prixTotal} €</strong></div>
        <div class="card__row"><span>Statut:</span> <strong>${r.statut}</strong></div>
      </div>
    </div>
  `).join('');

   // Redirection sur clic de la carte
   reservationsListDiv.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Évite le clic sur les boutons d'action
      if (e.target.closest("button")) return;
      window.location.href = `modificationReservation.html?id=${card.dataset.id}`;
    });
  });


  // Listeners CRUD
  reservationsListDiv.querySelectorAll(".icon-modif").forEach(btn => {
    btn.addEventListener("click", (e) =>  window.location.href = `modificationReservation.html?id=${btn.dataset.id}`
  )});
  reservationsListDiv.querySelectorAll(".icon-delete").forEach(btn => {
    btn.addEventListener("click", (e) => window.location.href = `modificationReservation.html?id=${btn.dataset.id}&action=supprimer`);
  });
  reservationsListDiv.querySelectorAll(".icon-valid").forEach(btn => {
    btn.addEventListener("click", (e) => window.location.href = `modificationReservation.html?id=${btn.dataset.id}&action=valider`);
  });
}

// Modifier une réservation
function editReservation(id) {
  window.location.href = `modificationReservation.html?id=${id}`;
}

// Supprimer une réservation
async function deleteReservation(id) {
  window.location.href = `modificationReservation.html?id=${id}&action=supprimer`;
  if (!confirm("Supprimer cette réservation ?")) return;
  try {
    const res = await fetch(`http://localhost:3000/api/reservations/${id}`, {
      method: "DELETE"
    });
    const result = await res.json();
    messageDiv.textContent = result.message || "Réservation supprimée";
    messageDiv.style.display = "block";
    fetchReservations();
  } catch (err) {
    messageDiv.textContent = "Erreur lors de la suppression";
    messageDiv.style.display = "block";
  }
}

// Valider une réservation
async function validateReservation(id) {
  window.location.href = `modificationReservation.html?id=${id}&action=valider`;
  try {
    const res = await fetch(`http://localhost:3000/api/reservations/${id}/valider`, {
      method: "POST"
    });
    const result = await res.json();
    messageDiv.textContent = result.message || "Réservation validée";
    messageDiv.style.display = "block";
    fetchReservations();
  } catch (err) {
    messageDiv.textContent = "Erreur lors de la validation";
    messageDiv.style.display = "block";
  }
}

// Initialisation
fetchReservations();