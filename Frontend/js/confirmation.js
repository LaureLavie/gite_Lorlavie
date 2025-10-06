import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const reservation = JSON.parse(
    localStorage.getItem("reservationConfirmee") || "{}"
  );

  // Remplir les champs dynamiquement
  document.querySelector(".card__badge").textContent = `${
    reservation.client?.name || ""
  } ${reservation.client?.surname || ""}`;
  document.querySelector(".card__row strong:nth-child(2)").textContent =
    reservation.dateArrivee || "";
  document.querySelector(".card__row strong:nth-child(4)").textContent =
    reservation.dateDepart || "";
});
