import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const successDiv = form.querySelector(".successDiv");
  const errorDiv = form.querySelector(".errorDiv");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = form.nom.value.trim();
    const prenom = form.prenom.value.trim();
    const message = form.message.value.trim();

    if (!nom || !prenom || !message) {
      errorDiv.textContent = "Tous les champs sont obligatoires.";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
      return;
    }

    try {
      // Exemple d'envoi vers le backend (à adapter selon ta route)
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, message }),
      });
      const result = await res.json();

      if (res.ok) {
        successDiv.textContent = "Message envoyé avec succès !";
        successDiv.style.display = "block";
        errorDiv.style.display = "none";
        form.reset();
      } else {
        errorDiv.textContent =
          result.error || "Erreur lors de l'envoi du message.";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
      }
    } catch (err) {
      errorDiv.textContent = "Erreur de connexion au serveur.";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  });
});
