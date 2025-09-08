// Connexion admin
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    const errorDiv = loginForm.querySelector(".error-message");

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
      console.log("Response:", res.status, data); // Debug

      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        alert("Connexion réussie !");
        window.location.href = "../../pages/administrateur/dashboard.html";
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

// Inscription admin
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
        alert(
          "Inscription réussie ! Un email de confirmation vous a été envoyé. Vous pouvez maintenant vous connecter."
        );
        window.location.href = "../../pages/administrateur/login.html";
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
