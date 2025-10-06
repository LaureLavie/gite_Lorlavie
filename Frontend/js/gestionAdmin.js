import { API_URL } from "./config.js";

const adminForm = document.getElementById("admin-form");
const adminsListDiv = document.getElementById("admins-list");
const cancelBtn = document.getElementById("cancel-btn");
const adminAddBtn = document.getElementById("add-Admin-Btn");
const errorDiv = adminForm.querySelector(".errorDiv");
const successDiv = adminForm.querySelector(".successDiv");
const submitBtn = document.getElementById("submit-btn");

let editingAdminId = null;

// Afficher le formulaire d'ajout quand on clique sur "Ajouter"
adminAddBtn.addEventListener("click", (e) => {
  e.preventDefault();
  adminForm.style.display = "block";
  resetForm();
});

// Masquer le formulaire quand on clique sur "Annuler"
cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  adminForm.style.display = "none";
  resetForm();
});

// Récupérer la liste des admins
async function fetchAdmins() {
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`${API_URL}/api/auth/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const admins = await res.json();
    listingAdmins(admins);
  } catch (error) {
    errorDiv.textContent = "Erreur lors du chargement des administrateurs";
    errorDiv.style.display = "block";
  }
}

// Affichage dynamique des admins
function listingAdmins(admins) {
  adminsListDiv.innerHTML = admins
    .map(
      (admin) => `
    <div class="card card--white">
      <div class="card__badge">${admin.surname.toUpperCase()}</div>
      <div class="card__icons">
        <button class="icon-modif" title="Modifier" data-id="${admin._id}">
          <i class="fa fa-pen"></i>
        </button>
        <button class="icon-delete" title="Supprimer" data-id="${admin._id}">
          <i class="fa fa-trash"></i>
        </button>
      </div>
      <div class="card__content">
        <div class="card__row"><span>Nom :</span> <strong>${
          admin.name
        }</strong></div>
        <div class="card__row"><span>Prénom :</span> <strong>${
          admin.surname
        }</strong></div>
        <div class="card__row"><span>Email :</span> <strong>${
          admin.email
        }</strong></div>
      </div>
    </div>
  `
    )
    .join("");

  // Ajoute les listeners pour modifier et supprimer
  adminsListDiv.querySelectorAll(".icon-modif").forEach((btn) => {
    btn.addEventListener("click", () => editAdminForm(btn.dataset.id));
  });
  adminsListDiv.querySelectorAll(".icon-delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteAdmin(btn.dataset.id));
  });
}

// Réinitialiser le formulaire (mode ajout)
function resetForm() {
  editingAdminId = null;
  adminForm.reset();
  submitBtn.textContent = "Valider";
  successDiv.style.display = "none";
  errorDiv.style.display = "none";
}

// Pré-remplir le formulaire pour modification
async function editAdminForm(id) {
  editingAdminId = id;
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`${API_URL}/api/auth/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const admin = await res.json();
    adminForm.name.value = admin.name;
    adminForm.surname.value = admin.surname;
    adminForm.email.value = admin.email;
    adminForm.password.value = ""; // Ne jamais pré-remplir le mot de passe
    adminForm.style.display = "block";
    submitBtn.textContent = "Valider";
    successDiv.style.display = "none";
    errorDiv.style.display = "none";
  } catch (err) {
    errorDiv.textContent =
      "Erreur lors de la récupération de l'administrateur.";
    errorDiv.style.display = "block";
  }
}

// Ajouter ou modifier un admin
adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("adminToken");
  const data = {
    name: adminForm.name.value,
    surname: adminForm.surname.value,
    email: adminForm.email.value,
  };
  // On ajoute le mot de passe uniquement à la création ou si modifié
  if (!editingAdminId && adminForm.password.value) {
    data.password = adminForm.password.value;
  }

  try {
    let res, result;
    if (!editingAdminId) {
      // Ajout
      res = await fetch(`${API_URL}/api/auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    } else {
      // Modification
      res = await fetch(`${API_URL}/api/auth/${editingAdminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    }
    result = await res.json();
    if (res.ok) {
      successDiv.textContent = editingAdminId
        ? "Administrateur modifié"
        : "Administrateur ajouté";
      successDiv.style.display = "block";
      errorDiv.style.display = "none";
      adminForm.style.display = "none";
      resetForm();
      fetchAdmins();
    } else {
      errorDiv.textContent =
        result.error || result.message || "Erreur lors de l'opération";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  } catch (err) {
    errorDiv.textContent = "Erreur de connexion au serveur.";
    errorDiv.style.display = "block";
    successDiv.style.display = "none";
  }
});

// Supprimer un admin
async function deleteAdmin(id) {
  if (!confirm("Supprimer cet administrateur ?")) return;
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`${API_URL}/api/auth/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (res.ok) {
      successDiv.textContent = "Administrateur supprimé";
      successDiv.style.display = "block";
      errorDiv.style.display = "none";
      fetchAdmins();
      resetForm();
    } else {
      errorDiv.textContent =
        result.error || result.message || "Erreur lors de la suppression";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  } catch (err) {
    errorDiv.textContent = "Erreur de connexion au serveur.";
    errorDiv.style.display = "block";
    successDiv.style.display = "none";
  }
}

// Initialisation au chargement
fetchAdmins();
resetForm();
