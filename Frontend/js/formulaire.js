export function Formulaire(placeholderId) {
  const placeholder = document.getElementById(placeholderId);
  if (placeholder) {
    fetch("../../composants/formulaire.html")
      .then((res) => res.text())
      .then((html) => {
        placeholder.innerHTML = html;
      });
  }
}