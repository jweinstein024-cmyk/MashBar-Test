// Photo slideshow next to the Music section.
// Add photos as <img> tags inside .slideshow in index.html.

const SLIDE_SECONDS = 7;

function startSlideshow(show) {
  const slides = Array.from(show.querySelectorAll("img"));
  if (slides.length === 0) return;

  show.classList.add("has-slides");
  let current = 0;
  let timer = null;

  slides.forEach((img) => img.classList.add("slide"));

  // left/right arrows (the slideshow is paused while hovered or focused,
  // so clicking an arrow just changes the photo)
  function arrow(direction, label, symbol) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slideshow-arrow slideshow-" + direction;
    button.setAttribute("aria-label", label);
    button.innerHTML = '<span aria-hidden="true">' + symbol + "</span>";
    button.addEventListener("click", () => goTo(current + (direction === "next" ? 1 : -1)));
    return button;
  }
  if (slides.length > 1) {
    show.append(arrow("prev", "Previous photo", "&#8249;"), arrow("next", "Next photo", "&#8250;"));
  }

  // keyboard: left/right arrow keys while an arrow button has focus
  show.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(current - 1);
    if (event.key === "ArrowRight") goTo(current + 1);
  });

  function goTo(i) {
    slides[current].classList.remove("is-active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("is-active");
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
