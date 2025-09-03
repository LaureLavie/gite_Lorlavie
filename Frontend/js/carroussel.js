export function Carroussel() {
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  function showSlide(n) {
    let currentSlide = n;
    if (n >= slides.length) currentSlide = 0;
    else if (n < 0) currentSlide = slides.length - 1;
    slides.forEach((slide) => slide.classList.remove("active"));
    if (slides[currentSlide]) {
      slides[currentSlide].classList.add("active");
    }
    slideIndex = currentSlide;
  }

  document
    .querySelector(".prev")
    ?.addEventListener("click", () => showSlide(slideIndex - 1));
  document
    .querySelector(".next")
    ?.addEventListener("click", () => showSlide(slideIndex + 1));

  showSlide(slideIndex);
  setInterval(() => showSlide(slideIndex + 1), 3000);
}
