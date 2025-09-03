export function HoteNavbar() {
  const placeholder = document.getElementById("hoteNavbar");
  if (placeholder) {
    fetch("../../composants/hoteNavbar.html")
      .then((response) => response.text())
      .then((html) => {
        placeholder.innerHTML = html;
        const hoteBurgerBtn = document.getElementById("hoteNavbar-burger");
        const hoteNavbarMenu = document.getElementById("hoteNavbar-menu");
        if (hoteBurgerBtn && hoteNavbarMenu) {
          hoteBurgerBtn.addEventListener("click", () => {
            hoteBurgerBtn.classList.toggle("open");
            hoteNavbarMenu.classList.toggle("open");
          });
        }
      });
  }
}
