let slideIndex = 0;

export function Carroussel(n = 0) {
  const slides = document.querySelectorAll(".slide");

  // Met à jour l'index
  slideIndex = n;
  if (slideIndex >= slides.length) slideIndex = 0;
  if (slideIndex < 0) slideIndex = slides.length - 1;

  slides.forEach((slide) => slide.classList.remove("active"));
  if (slides[slideIndex]) {
    slides[slideIndex].classList.add("active");
  }
}

// Initialisation des boutons et du carrousel auto
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
prevBtn?.addEventListener("click", () => Carroussel(slideIndex - 1));
nextBtn?.addEventListener("click", () => Carroussel(slideIndex + 1));

setInterval(() => {
  Carroussel(slideIndex + 1);
}, 3000);

Carroussel(0);
