const adminForm=document.getElementById("admin-form");
const adminTitle=document.getElementById("admin-title");
const adminName=document.getElementById("admin-name");
const adminSurname=document.getElementById("admin-surname");
const adminEmail=document.getElementById("admin-email");
const adminPassword=document.getElementById("admin-password");
const adminEdit=document.getElementById("admin-edit");
const adminDelete=document.getElementById("admin-delete");
const adminAdd=document.getElementById("admin-add");
const errorDiv = adminForm.querySelector(".errorDiv");
const successDiv= adminForm.querySelector(".successDiv");


export async function fetchAdmins() {
  if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  const token = localStorage.getItem("adminToken");
  const res = await fetch("/api/auth/", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const admins = await res.json();
fetchAdmins ();
})
}
};

export async function addAdmin(data) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  adminAdd.addEventListener("click", () => {
    if (res.ok) {
      errorDiv.style.display = "none";
        successDiv.textContent = "Administrateur ajouté";
        successDiv.style.display = "block";
      fetchAdmins();
      addAdmin();
    }else{
      errorDiv.textContent = data.error || data.message || "Erreur lors de l'ajout de l'administrateur";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  }); 
};


export async function editAdmin(id, data) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(`/api/auth/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  adminEdit.addEventListener("click", () => {
    if (res.ok) {
      errorDiv.style.display = "none";
        successDiv.textContent = "Administrateur modifié";
        successDiv.style.display = "block";
      fetchAdmins();
      editAdmin();
    }else{
      errorDiv.textContent = data.error || data.message || "Erreur lors de la modification de l'administrateur";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  }); 
};

export async function deleteAdmin(id) {
  if (!confirm("Supprimer cet administrateur ?")) return;
  const token = localStorage.getItem("adminToken");
  const res = await fetch(`/api/auth/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  adminDelete.addEventListener("click", () => {
    if (res.ok) {
      errorDiv.style.display = "none";
        successDiv.textContent = "Administrateur supprimé";
        successDiv.style.display = "block";
      fetchAdmins();
      deleteAdmin();
    }else{
      errorDiv.textContent = data.error || data.message || "Erreur lors de la suppression de l'administrateur";
      errorDiv.style.display = "block";
      successDiv.style.display = "none";
    }
  }); 
};