import { API_BACK } from "../js/config.js";
const adminForm = document.getElementById("admin-form");
const adminsListDiv = document.getElementById("admins-list");
const cancelBtn = document.getElementById("cancel-btn");
const adminAddBtn = document.getElementById("add-Admin-Btn");
const errorDiv = adminForm.querySelector(".errorDiv");
const successDiv = adminForm.querySelector(".successDiv");

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
    const res = await fetch(`${API_BACK}/api/auth/`, {
      headers: { Authorization: `Bearer ${token}` }
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
  adminsListDiv.innerHTML = admins.map(admin => `
    <div class="card card--white">
      <div class="card__badge">${admin.name.toUpperCase()}</div>
      <div class="card__icons">
        <a href="#" class="icon-modif" title="Modifier" onclick="window.editAdminForm('${admin._id}')">
          <i class="fa fa-pen"></i>
        </a>
        <a href="#" class="icon-delete" title="Supprimer" onclick="window.deleteAdmin('${admin._id}')">
          <i class="fa fa-trash"></i>
        </a>
      </div>
      <div class="card__content">
        <div class="card__row"><span>Nom :</span> <strong>${admin.surname}</strong></div>
        <div class="card__row"><span>Prénom :</span> <strong>${admin.name}</strong></div>
        <div class="card__row"><span>Email :</span> <strong>${admin.email}</strong></div>
      </div>
    </div>
  `).join('');
}

// Réinitialiser le formulaire (mode ajout)
function resetForm() {
  editingAdminId = null;
  adminForm.reset();
  adminForm.querySelector("#submit-btn").textContent = "Ajouter";
  successDiv.style.display = "none";
  errorDiv.style.display = "none";
}

// Pré-remplir le formulaire pour modification
window.editAdminForm = async function(id) {
  editingAdminId = id;
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`${API_BACK}/api/auth/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const admin = await res.json();
    adminForm.name.value = admin.name;
    adminForm.surname.value = admin.surname;
    adminForm.email.value = admin.email;
    adminForm.password.value = ""; // Ne jamais pré-remplir le mot de passe
    adminForm.style.display = "block";
    adminForm.querySelector("#submit-btn").textContent = "Modifier";
    successDiv.style.display = "none";
    errorDiv.style.display = "none";
  } catch (err) {
    errorDiv.textContent = "Erreur lors de la récupération de l'administrateur.";
    errorDiv.style.display = "block";
  }
};

// Ajouter ou modifier un admin
adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("adminToken");
  const data = {
    name: adminForm.name.value,
    surname: adminForm.surname.value,
    email: adminForm.email.value
  };
  // On ajoute le mot de passe uniquement à la création ou si modifié
  if (!editingAdminId && adminForm.password.value) {
    data.password = adminForm.password.value;
  }

  try {
    let res, result;
    if (!editingAdminId) {
      // Ajout
      res = await fetch(`${API_BACK}/api/auth/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    } else {
      // Modification
      res = await fetch(`${API_BACK}/api/auth/${editingAdminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    }
    result = await res.json();
    if (res.ok) {
      successDiv.textContent = editingAdminId ? "Administrateur modifié" : "Administrateur ajouté";
      successDiv.style.display = "block";
      errorDiv.style.display = "none";
      adminForm.style.display = "none";
      resetForm();
      fetchAdmins();
    } else {
      errorDiv.textContent = result.error || result.message || "Erreur lors de l'opération";
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
window.deleteAdmin = async function(id) {
  if (!confirm("Supprimer cet administrateur ?")) return;
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`${API_BACK}/api/auth/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    if (res.ok) {
      successDiv.textContent = "Administrateur supprimé";
      successDiv.style.display = "block";
      errorDiv.style.display = "none";
      fetchAdmins();
      resetForm();
    } else {
      errorDiv.textContent = result.error || result.message || "Erreur lors de la suppression";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  } catch (err) {
    errorDiv.textContent = "Erreur de connexion au serveur.";
    errorDiv.style.display = "block";
    successDiv.style.display = "none";
  }
};

// Initialisation au chargement
fetchAdmins();
resetForm();