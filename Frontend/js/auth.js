// Connexion admin
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    const errorDiv = loginForm.querySelector(".error-message");

    //Validation côté client
    if (!email || !password) {
      errorDiv.textContent = "Veuillez remplir tous les champs.";
      errorDiv.style.display = "block";
      return;
    }

    // Debug : vérifier que les valeurs sont bien récupérées
    console.log("Email:", email, "Password:", password);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Response:", res.status, data);

      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminData", JSON.stringify(data.admin));

        //masquer l'erreur et afficher succès
        errorDiv.style.display = "none";

        //Aficher message de succès temporaire
        const successDiv = document.createElement("div");
        successDiv.style.color = "green";
        successDiv.style.textAlign = "center";
        successDiv.style.margin = "1rem";
        successDiv.textContent = "Connexion réussie !";
        loginForm.appendChild(successDiv);
      } else {
        errorDiv.textContent =
          data.error || data.message || "Email ou mot de passe incorrect.";
        errorDiv.style.display = "block";
      }
    } catch (err) {
      console.error("Erreur:", err);
      errorDiv.textContent = "Erreur de connexion au serveur.";
      errorDiv.style.display = "block";
    }
  });
}

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      // Appel à l'API de déconnexion
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      // Même si l'API échoue, on nettoie le localStorage
      // (car la déconnexion est cruciale pour la sécurité)

      // Supprimer les données d'authentification du localStorage
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");

      // Message de confirmation (optionnel)
      if (res && res.ok) {
        console.log("Déconnexion réussie");
      }

      // Redirection vers la page d'accueil
      window.location.href = "../../index.html";
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);

      // Même en cas d'erreur, on déconnecte côté client
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");

      // Redirection vers la page d'accueil
      window.location.href = "../../index.html";
    }
  });
}

// Inscription administrateur
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('input[name="name"]').value;
    const surname = registerForm.querySelector('input[name="surname"]').value;
    const email = registerForm.querySelector('input[name="email"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;
    const errorDiv = registerForm.querySelector(".error-message");

    if (!name || !surname || !email || !password) {
      errorDiv.textContent = "Veuillez remplir tous les champs.";
      errorDiv.style.display = "block";
      return;
    }

    // Debug : vérifier que les valeurs sont bien récupérées
    console.log("Registration data:", { name, surname, email, password });

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, email, password }),
      });

      const data = await res.json();
      console.log("Response:", res.status, data); // Debug

      if (res.ok && data.admin) {
        //masquer les erreurs
        errorDiv.style.display = "none";

        //Afficher message de succès
        const successDiv = document.createElement("div");
        successDiv.innerHTML = `div style="background:#d4edda; border:1px solid #c3e6cb; color:#155724; padding:10px; margin:10px 0; text-align:center;">
        <strong>Inscription réussie !<strong><br>
        <small>Un email de confirmation vous a été envoyé. ${email}<small><br>
        <small>Redirection vers la page de connexion dans <span id="countdown">5</span> secondes...</small></div>`;
        registerForm.appendChild(successDiv);

        //désactiver le formulaire
        const inputs = registerForm.querySelectorAll("input,button");
        inputs.forEach((input) => (input.disabled = true));
        registerForm.style.opacity = 0.7;
      } else {
        errorDiv.textContent =
          data.message || data.error || "Erreur lors de l'inscription.";
        errorDiv.style.display = "block";
      }
    } catch (err) {
      console.error("Erreur:", err);
      errorDiv.textContent = "Erreur de connexion au serveur.";
      errorDiv.style.display = "block";
    }
  });
}
