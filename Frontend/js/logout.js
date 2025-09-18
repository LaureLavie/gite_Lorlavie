import {showMessage} from "../js/config.js";
// Déconnexion admin
export function Logout(){
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const logoutMsg = document.getElementById("logout-message");
    try {
      await fetch(`http://localhost:3000/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
    } catch { }
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    if (logoutMsg) showMessage(logoutMsg, "Déconnexion réussie.", "success");
    window.location.href = "../../index.html";
  });
}}