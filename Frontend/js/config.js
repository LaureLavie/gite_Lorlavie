// export const API_BACK =
//   window.location.hostname === "localhost"
//     ? "http://localhost:3000"
//     : "https://backend-lorlavie.onrender.com";

// Helper pour afficher les messages
export function showMessage(div, msg, type = "error") {
  div.textContent = msg;
  div.style.display = "block";
  div.style.color = type === "error" ? "red" : "green";
}