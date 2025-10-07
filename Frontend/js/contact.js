import { API_URL, showMessage } from "./config.js";

const contactForm = document.getElementById("contact-form");
const errorDiv = contactForm.querySelector(".errorDiv");
const successDiv = contactForm.querySelector(".successDiv");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Récupération des valeurs
  const nom = document.getElementById("nom").value.trim();
  const mail = document.getElementById("mail").value.trim();
  const message = document.getElementById("message").value.trim();

  // Réinitialiser les messages
  successDiv.style.display = "none";
  errorDiv.style.display = "none";
  successDiv.textContent = "";
  errorDiv.textContent = "";

  // Validation côté client
  if (!nom || !mail || !message) {
    errorDiv.textContent = "Tous les champs sont obligatoires.";
    errorDiv.style.display = "block";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nom, mail, message }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(successDiv, "envoi du message réussi", "success");
      setTimeout(() => (window.location.href = "accueil.html"), 1000);
      successDiv.style.display = "block";
      contactForm.reset();
    } else {
      showMessage(
        errorDiv,
        data.error || "Erreur lors de l'envoi du message.",
        "error"
      );
    }
  } catch (error) {
    console.error("Erreur:", error);
    showMessage(errorDiv, "Erreur de connexion au serveur.", "error");
  }
});
