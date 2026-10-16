// "Interested in Playing at Mash?" form.
// The site has no server, so submitting opens the visitor's email app
// with their answers filled in, addressed to BOOKING_EMAIL.

// PLACEHOLDER: replace with Mash's booking email address
const BOOKING_EMAIL = "REPLACE-WITH-EMAIL@example.com";

const FIELDS = [
  ["band", "Artist/Band Name"],
  ["genre", "Genre"],
  ["links", "Website & social links"],
  ["video", "Link to video of us playing"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["info", "Additional information"],
];

const form = document.getElementById("booking-form");

if (form) {
  const error = form.querySelector(".form-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      error.hidden = false;
      form.classList.add("was-submitted");
      form.querySelector("input:invalid, textarea:invalid").focus();
      return;
    }
    error.hidden = true;

    const data = new FormData(form);
    const body = FIELDS
      .map(([name, label]) => {
        const values = data.getAll(name).map((v) => v.trim()).filter(Boolean);
        // several links each go on their own line
        return label + ": " + (values.length > 1 ? "\n  " + values.join("\n  ") : values[0] || "");
      })
      .join("\n");
    const subject = "Booking Inquiry - " + data.get("band").trim();

    window.location.href = "mailto:" + BOOKING_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
}

// open/close the pop-up window
const dialog = document.getElementById("booking-dialog");
const openButton = document.getElementById("open-booking");
const closeButton = document.getElementById("close-booking");

if (dialog && openButton) {
  openButton.addEventListener("click", () => dialog.showModal());
  closeButton.addEventListener("click", () => dialog.close());

  // clicking the dark area outside the window closes it
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

// "+ Add another link" adds one more link box under Website
const linkList = document.getElementById("link-list");
const addLink = document.getElementById("add-link");

// up to 4 extra boxes on top of the first one
const MAX_EXTRA_LINKS = 4;

if (linkList && addLink) {
  const extraCount = () => linkList.querySelectorAll(".remove-link").length;
  // hide the + button once the limit is reached
  const updateAddButton = () => {
    addLink.hidden = extraCount() >= MAX_EXTRA_LINKS;
  };

  addLink.addEventListener("click", () => {
    if (extraCount() >= MAX_EXTRA_LINKS) return;

    const row = document.createElement("div");
    row.className = "link-row";

    const input = document.createElement("input");
    input.type = "text";
    input.name = "links";
    input.inputMode = "url";
    input.placeholder = "Paste another link";
    input.setAttribute("aria-labelledby", "links-label");

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-link";
    remove.setAttribute("aria-label", "Remove this link");
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      row.remove();
      updateAddButton();
      addLink.focus();
    });

    row.append(input, remove);
    linkList.appendChild(row);
    updateAddButton();
    input.focus();
  });
}
