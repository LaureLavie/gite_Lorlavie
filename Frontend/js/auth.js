import { showMessage } from "../js/config.js";

// Connexion admin
const loginForm = document.getElementById("login-form");
if (loginForm) {
  const errorDiv = loginForm.querySelector(".error-message");
  const successDiv = loginForm.querySelector(".successDiv");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    if (!email || !password) {
      showMessage(errorDiv, "Veuillez remplir tous les champs.");
      successDiv.style.display = "none";
      return;
    }
    try {
      const res = await fetch(`${process.env.API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        errorDiv.style.display = "none";
        showMessage(successDiv, "Connexion réussie", "success");
        setTimeout(() => (window.location.href = "dashboard.html"), 1000);
      } else {
        showMessage(
          errorDiv,
          data.error || data.message || "Email ou mot de passe incorrect."
        );
        successDiv.style.display = "none";
      }
    } catch (err) {
      showMessage(errorDiv, "Erreur de connexion au serveur.");
      successDiv.style.display = "none";
    }
  });
}

// Inscription admin
const registerForm = document.getElementById("register-form");
if (registerForm) {
  const errorDiv = registerForm.querySelector(".error-message");
  const successDiv = registerForm.querySelector(".successDiv");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = registerForm.name.value;
    const surname = registerForm.surname.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    if (!name || !surname || !email || !password) {
      showMessage(errorDiv, "Veuillez remplir tous les champs.");
      return;
    }
    try {
      const res = await fetch(`${process.env.API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.admin) {
        errorDiv.style.display = "none";
        showMessage(
          successDiv,
          "Inscription réussie. Vérifiez votre mail, un lien d'activation vous a été envoyé.",
          "success"
        );
        setTimeout(() => (window.location.href = "login.html"), 3000);
      } else {
        showMessage(
          errorDiv,
          data.message || data.error || "Erreur lors de l'inscription."
        );
      }
    } catch (err) {
      showMessage(errorDiv, "Erreur de connexion au serveur.");
    }
  });
}

// Initialisation au chargement
window.addEventListener("DOMContentLoaded", () => {
  if (loginForm) loginForm.reset();
  if (registerForm) registerForm.reset();
});
