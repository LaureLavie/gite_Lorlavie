// Helper pour afficher les messages
export function showMessage(div, msg, type = "error") {
  div.textContent = msg;
  div.style.display = "block";
  div.style.color = type === "error" ? "red" : "green";
}

export const API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "http://127.0.0.1:5500/"
    ? "http://localhost:3000"
    : "https://backend-lorlavie.onrender.com";
