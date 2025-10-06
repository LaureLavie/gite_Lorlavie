import { API_URL } from "./config.js";

const urlParams = new URLSearchParams(window.location.search);
const reservationId = urlParams.get("id");

fetch(`${API_URL}/api/reservations/${reservationId}`)
  .then((res) => res.json())
  .then((reservation) => {
    document.querySelector(".card__badge").textContent =
      reservation.client.name + " " + reservation.client.surname;
    document.querySelector("strong[data-field='dateArrivee']").textContent =
      reservation.dateArrivee;
  });
