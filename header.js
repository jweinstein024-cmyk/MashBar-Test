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
}
