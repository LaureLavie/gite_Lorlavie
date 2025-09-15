const API_BACK= "https://backend-lorlavie.onrender.com";
const errorDiv = adminForm.querySelector(".errorDiv");
const successDiv = adminForm.querySelector(".successDiv");


document.querySelector("form.form").addEventListener("submit", async function(e) {
  e.preventDefault();

  // Récupère la réservation stockée
  const reservation = JSON.parse(localStorage.getItem("reservationEnCours") || "{}");

  // Récupère les infos du formulaire de paiement
  reservation.client = {
    name: document.getElementById("nom").value,
    surname: document.getElementById("prenom").value,
    adresse: document.getElementById("adresse").value,
    codePostal: document.getElementById("codePostal").value,
    ville: document.getElementById("ville").value,
    pays: document.getElementById("pays").value,
    telephone: document.getElementById("telephone").value,
    email: document.getElementById("email").value
  };
  reservation.modePaiement = "en ligne"; // ou récupère le choix réel

  // Envoie la réservation au backend
  try {
    const res = await fetch(`${API_BACK}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation)
    });
    const result = await res.json();
    if (res.ok) {
      // Nettoie le localStorage
      localStorage.removeItem("reservationEnCours");
      // Redirige       
      window.location.href = "confirmation.html";
    } else {
      errorDiv.textContent = result.error || result.message || "Erreur lors de la récupération de la réservation";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  } catch (err) {
    errorDiv.textContent = "Erreur de connexion au serveur.";
    errorDiv.style.display = "block";
    successDiv.style.display = "none";
  }
});