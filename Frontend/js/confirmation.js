document.addEventListener("DOMContentLoaded", () => {
  // Récupération de la réservation confirmée
  const reservation = JSON.parse(
    localStorage.getItem("reservationConfirmee") || "{}"
  );

  if (reservation && reservation.client) {
    // Affichage des informations
    document.getElementById("client-name").textContent =
      `${reservation.client.surname} ${reservation.client.name}` || "Client";

    document.getElementById("date-arrivee").textContent =
      new Date(reservation.dateArrivee).toLocaleDateString("fr-FR") || "-";

    document.getElementById("date-depart").textContent =
      new Date(reservation.dateDepart).toLocaleDateString("fr-FR") || "-";

    document.getElementById("nombre-personnes").textContent =
      reservation.nombrePersonnes || "-";

    document.getElementById("personnes-supp").textContent =
      reservation.personnesSupplementaires || "0";

    document.getElementById("montant-total").textContent = reservation.prixTotal
      ? `${reservation.prixTotal} €`
      : "-";

    document.getElementById("mode-paiement").textContent =
      reservation.modePaiement || "-";
  }
});

// Redirection
window.location.href = "confirmation.html";
