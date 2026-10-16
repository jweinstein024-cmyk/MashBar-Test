// Photo slideshow next to the Music section.
// Add photos as <img> tags inside .slideshow in index.html.

const SLIDE_SECONDS = 5;

function startSlideshow(show) {
  const slides = Array.from(show.querySelectorAll("img"));
  if (slides.length === 0) return;

  show.classList.add("has-slides");
  let current = 0;
  let timer = null;

  const dots = document.createElement("div");
  dots.className = "slideshow-dots";
  slides.forEach((img, i) => {
    img.classList.add("slide");
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Show photo " + (i + 1));
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dots.appendChild(dot);
  });
  if (slides.length > 1) show.appendChild(dots);

  function goTo(i) {
    slides[current].classList.remove("is-active");
    dots.children[current].classList.remove("is-active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots.children[current].classList.add("is-active");
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    if (slides.length > 1) {
      timer = setInterval(() => goTo(current + 1), SLIDE_SECONDS * 1000);
    }
  }

  // pause while someone is looking closely
  show.addEventListener("mouseenter", stop);
  show.addEventListener("mouseleave", restart);
  show.addEventListener("focusin", stop);
  show.addEventListener("focusout", restart);

  goTo(0);
  restart();
}

document.querySelectorAll(".slideshow").forEach(startSlideshow);
