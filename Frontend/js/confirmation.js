const API_BACK = "https://backend-lorlavie.onrender.com"; 
const urlParams = new URLSearchParams(window.location.search);
const reservationId = urlParams.get("id");

fetch(`${API_BACK}/api/reservations/${reservationId}`)
  .then(res => res.json())
  .then(reservation => {
    document.querySelector(".card__badge").textContent = reservation.client.name + " " + reservation.client.surname;
    document.querySelector("strong[data-field='dateArrivee']").textContent = reservation.dateArrivee;
  });