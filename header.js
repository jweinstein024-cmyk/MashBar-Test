// Keep --header-height equal to the sticky header's real height, so menu
// links scroll each section to just below the header instead of behind it.
// The header gets taller when the menu links wrap on narrow screens.

const siteHeader = document.querySelector("header");

if (siteHeader) {
  const setHeaderHeight = () => {
    document.documentElement.style.setProperty("--header-height", siteHeader.offsetHeight + "px");
  };

  setHeaderHeight();
  new ResizeObserver(setHeaderHeight).observe(siteHeader);

  // Slim header once the visitor scrolls down (the CSS only applies it on
  // wider screens). Two different cut-offs stop it flickering at the edge.
  const updateSlimHeader = () => {
    if (window.scrollY > 150) siteHeader.classList.add("is-scrolled");
    else if (window.scrollY < 20) siteHeader.classList.remove("is-scrolled");
  };
  updateSlimHeader();
  window.addEventListener("scroll", updateSlimHeader, { passive: true });
}

// Phones: the menu links fold away behind a ☰ button to keep the header short.
const menuToggle = document.querySelector(".menu-toggle");

if (siteHeader && menuToggle) {
  const setMenuOpen = (open) => {
    siteHeader.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!siteHeader.classList.contains("menu-open"));
  });

  // picking a section closes the menu; re-measure right away so the jump
  // lands below the now-shorter header
  document.querySelectorAll("#site-nav a").forEach((link) =>
    link.addEventListener("click", () => {
      setMenuOpen(false);
      document.documentElement.style.setProperty("--header-height", siteHeader.offsetHeight + "px");
    })
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteHeader.classList.contains("menu-open")) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
}
