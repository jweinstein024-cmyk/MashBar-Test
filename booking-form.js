// "Interested in Playing at Mash?" form.
// The site has no server, so submitting opens the visitor's email app
// with their answers filled in, addressed to BOOKING_EMAIL.

// PLACEHOLDER: replace with Mash's booking email address
const BOOKING_EMAIL = "REPLACE-WITH-EMAIL@example.com";

const FIELDS = [
  ["band", "Artist/Band Name"],
  ["genre", "Genre"],
  ["links", "Social media pages"],
  ["sample", "Sample of us playing"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["info", "Additional information"],
];

// Links added to the "Sample of your band playing" box. Email links can't
// carry files, so the form asks for links to recordings instead of uploads.
const samples = { links: [] };

const form = document.getElementById("booking-form");

if (form) {
  const error = form.querySelector(".form-error");
  const sampleError = document.getElementById("sample-error");
  const sampleDrop = document.getElementById("sample-drop");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addPendingSampleLink();

    const hasSample = samples.links.length > 0;
    sampleError.hidden = hasSample;
    sampleDrop.classList.toggle("is-invalid", !hasSample);

    if (!form.checkValidity() || !hasSample) {
      error.hidden = false;
      form.classList.add("was-submitted");
      const firstInvalid = form.querySelector("input:invalid, textarea:invalid") ||
        document.getElementById("sample-link");
      firstInvalid.focus();
      return;
    }
    error.hidden = true;

    const data = new FormData(form);
    const body = FIELDS
      .map(([name, label]) => {
        const values = name === "sample"
          ? samples.links
          : data.getAll(name).map((v) => v.trim()).filter(Boolean);
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

// ---- Sample box: paste links to recordings ----

const sampleLink = document.getElementById("sample-link");
const sampleAdd = document.getElementById("sample-add");
const sampleList = document.getElementById("sample-list");
const dropzone = document.getElementById("sample-drop");

function renderSamples() {
  sampleList.innerHTML = "";
  const items = samples.links.map((link, i) => ({ text: link, kind: "Link", remove: () => samples.links.splice(i, 1) }));
  for (const item of items) {
    const li = document.createElement("li");
    const kind = document.createElement("span");
    kind.className = "sample-kind";
    kind.textContent = item.kind;
    const text = document.createElement("span");
    text.className = "sample-name";
    text.textContent = item.text;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-link";
    remove.setAttribute("aria-label", "Remove " + item.text);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      item.remove();
      renderSamples();
      sampleLink.focus();
    });
    li.append(kind, text, remove);
    sampleList.appendChild(li);
  }
  if (items.length) {
    document.getElementById("sample-error").hidden = true;
    dropzone.classList.remove("is-invalid");
  }
}

function addSampleLink(text) {
  const link = text.trim();
  if (link && !samples.links.includes(link)) samples.links.push(link);
  renderSamples();
}

// a link typed in the box but not yet added still counts on submit
function addPendingSampleLink() {
  if (sampleLink && sampleLink.value.trim()) {
    addSampleLink(sampleLink.value);
    sampleLink.value = "";
  }
}

if (dropzone) {
  sampleAdd.addEventListener("click", addPendingSampleLink);
  sampleLink.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addPendingSampleLink();
    }
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

// "+ Add another link" adds one more link box under Social Media Pages
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
