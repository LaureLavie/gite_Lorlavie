export function Footer() {
  const footer = document.getElementById("footer");
  if (footer) {
    fetch("../../composants/footer.html")
      .then((res) => res.text())
      .then((html) => {
        footer.innerHTML = html;
      });
  }
}
