document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = urlParams.get("id");
  const action = urlParams.get("action");
  const form = document.querySelector("form.form");
  const messageDiv = document.getElementById("message");
  // Boutons
  const deleteBtn = document.getElementById("delete-btn");
  const cancelBtn = document.getElementById("cancel-btn");



  if (!reservationId) {
    messageDiv.textContent = "Aucune réservation sélectionnée.";
    messageDiv.style.display = "block";
    return;
  }

  // Pré-remplir le formulaire
  try {
    const res = await fetch(`http://localhost:3000/api/reservations/${reservationId}`);
    const r = await res.json();

    document.getElementById("reservation-date-arrivee").value = r.dateArrivee?.slice(0,10);
    document.getElementById("reservation-date-depart").value = r.dateDepart?.slice(0,10);
    document.getElementById("personnes").textContent = r.nombrePersonnes;
    document.getElementById("sup-personnes").textContent = r.personnesSupplementaires || 0;
    document.getElementById("option-menage").checked = r.options?.menage || false;
    document.getElementById("message").value = r.options?.commentaires || "";
    document.getElementById("montant").textContent = r.prixTotal + "€";
    document.getElementById("nuits").textContent = r.dateArrivee && r.dateDepart
      ? (new Date(r.dateDepart) - new Date(r.dateArrivee)) / (1000*60*60*24)
      : 1;
  } catch (err) {
    messageDiv.textContent = "Erreur lors du chargement de la réservation.";
    messageDiv.style.display = "block";
  }

  // Handler modification (submit)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      dateArrivee: document.getElementById("reservation-date-arrivee").value,
      dateDepart: document.getElementById("reservation-date-depart").value,
      nombrePersonnes: parseInt(document.getElementById("personnes").textContent, 10),
      personnesSupplementaires: parseInt(document.getElementById("sup-personnes").textContent, 10),
      options: {
        menage: document.getElementById("option-menage").checked,
        commentaires: document.getElementById("message").value
      },
      prixTotal: parseInt(document.getElementById("montant").textContent, 10)
    };
    try {
      const res = await fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) {
        messageDiv.textContent = "Réservation modifiée avec succès.";
        messageDiv.style.display = "block";
      } else {
        messageDiv.textContent = result.error || "Erreur lors de la modification.";
        messageDiv.style.display = "block";
      }
    } catch (err) {
      messageDiv.textContent = "Erreur serveur.";
      messageDiv.style.display = "block";
    }
  });

  // Handler suppression
  deleteBtn.addEventListener("click", async () => {
    if (action === "supprimer") {
    try {
      const res = await fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (res.ok) {
        messageDiv.textContent = "Réservation supprimée.";
        messageDiv.style.display = "block";
        setTimeout(() => window.location.href = "reservation.html", 1500);
      } else {
        messageDiv.textContent = result.error || "Erreur lors de la suppression.";
        messageDiv.style.display = "block";
      }
    } catch (err) {
      messageDiv.textContent = "Erreur serveur.";
      messageDiv.style.display = "block";
    }
  }
  });

  // Handler validation (statut + mail)
  document.getElementById("validate-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    if (action === "valider") {
    try {
      const res = await fetch(`http://localhost:3000/api/reservations/${reservationId}/valider`, {
        method: "POST"
      });
      const result = await res.json();
      if (res.ok) {
        messageDiv.textContent = "Réservation validée et mail envoyé.";
        messageDiv.style.display = "block";
        setTimeout(() => window.location.href = `confirmation.html?id=${reservationId}`, 1500);
      } else {
        messageDiv.textContent = result.error || "Erreur lors de la validation.";
        messageDiv.style.display = "block";
      }
    } catch (err) {
      messageDiv.textContent = "Erreur serveur.";
      messageDiv.style.display = "block";
    }
  }
  });

  // Handler annulation
  cancelBtn.addEventListener("click", () => {
    window.location.href = "reservation.html";
  });
});