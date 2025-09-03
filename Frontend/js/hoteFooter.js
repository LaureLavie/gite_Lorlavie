export function HoteFooter() {
  const hoteFooter = document.getElementById("hoteFooter");
  if (hoteFooter) {
    fetch("../../composants/hoteFooter.html")
      .then((res) => res.text())
      .then((html) => {
        hoteFooter.innerHTML = html;
      });
  }
}
