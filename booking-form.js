// "Interested in Playing at Mash?" form.
// The site has no server, so submitting opens the visitor's email app
// with their answers filled in, addressed to BOOKING_EMAIL.

// PLACEHOLDER: replace with Mash's booking email address
const BOOKING_EMAIL = "REPLACE-WITH-EMAIL@example.com";

const FIELDS = [
  ["band", "Artist/Band Name"],
  ["genre", "Genre"],
  ["website", "Website"],
  ["video", "Link to video of us playing"],
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["tiktok", "TikTok"],
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
      .map(([name, label]) => label + ": " + (data.get(name) || "").trim())
      .join("\n");
    const subject = "Booking Inquiry - " + data.get("band").trim();

    window.location.href = "mailto:" + BOOKING_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
}
