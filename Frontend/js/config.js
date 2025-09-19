// Helper pour afficher les messages
export function showMessage(div, msg, type = "error") {
  div.textContent = msg;
  div.style.display = "block";
  div.style.color = type === "error" ? "red" : "green";
}