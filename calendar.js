// October calendar for Mash Bar.
//
// To update the calendar, edit SCHEDULE below: put the band name and/or
// the deal next to any date. Leave a field as "" to show "TBA".
// Example:  10: { band: "The Example Band", deal: "$5 Old Fashioneds" },

const YEAR = 2026;
const MONTH = 9; // 0 = January, so 9 = October

const SCHEDULE = {
  1:  { band: "", deal: "" },
  2:  { band: "", deal: "" },
  3:  { band: "", deal: "" },
  4:  { band: "", deal: "" },
  5:  { band: "", deal: "" },
  6:  { band: "", deal: "" },
  7:  { band: "", deal: "" },
  8:  { band: "", deal: "" },
  9:  { band: "", deal: "" },
  10: { band: "", deal: "" },
  11: { band: "", deal: "" },
  12: { band: "", deal: "" },
  13: { band: "", deal: "" },
  14: { band: "", deal: "" },
  15: { band: "", deal: "" },
  16: { band: "", deal: "" },
  17: { band: "", deal: "" },
  18: { band: "", deal: "" },
  19: { band: "", deal: "" },
  20: { band: "", deal: "" },
  21: { band: "", deal: "" },
  22: { band: "", deal: "" },
  23: { band: "", deal: "" },
  24: { band: "", deal: "" },
  25: { band: "", deal: "" },
  26: { band: "", deal: "" },
  27: { band: "", deal: "" },
  28: { band: "", deal: "" },
  29: { band: "", deal: "" },
  30: { band: "", deal: "" },
  31: { band: "", deal: "" },
};

// The regular weekly lineup (0 = Sunday). A night with `band: true`
// shows the band name from SCHEDULE. `deal` is that weekday's standing
// deal; a deal typed into SCHEDULE for a date replaces it. `eventFirst`
// lists that night's event above the deal and makes the event the orange line.
// `noDeal` leaves the deal line off that night entirely. `footnote` is a
// small note centered at the bottom of that night's box.
const WEEKLY = {
  0: { closed: true },
  1: { closed: true },
  2: { deal: "$20 Beer Towers", eventFirst: true, events: [{ what: "Trivia" }] },
  3: { deal: "Half Off Everything",
       events: [{ time: "8pm–10pm", what: "Live Music", band: true },
                { time: "10pm–Close", what: "DJ" }] },
  4: { deal: "$4 Doubles", events: [{ time: "9pm–12am", what: "Karaoke" }] },
  5: { noDeal: true, events: [{ time: "9pm–12am", what: "Live Music", band: true }] },
  6: { deal: "Game Day Specials TBA", events: [{ what: "DJ Time TBA" }],
       footnote: "*Schedule Subject to Change*" },
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// Jack-o'-lantern drawn from the #pumpkin symbol in index.html
function pumpkin() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("class", "cal-pumpkin");
  icon.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#pumpkin");
  icon.appendChild(use);
  return icon;
}

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  const firstWeekday = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const now = new Date();
  const isThisMonth = now.getFullYear() === YEAR && now.getMonth() === MONTH;

  for (let i = 0; i < firstWeekday; i++) {
    grid.appendChild(el("li", "cal-day cal-empty"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const weekday = new Date(YEAR, MONTH, day).getDay();
    const plan = WEEKLY[weekday];
    const info = SCHEDULE[day] || {};
    const cell = el("li", "cal-day");

    if (isThisMonth && day === now.getDate()) cell.classList.add("cal-today");
    if (isThisMonth && day < now.getDate()) cell.classList.add("cal-past");

    const head = el("div", "cal-date");
    head.appendChild(el("span", "cal-weekday", WEEKDAYS[weekday]));
    head.appendChild(el("span", "cal-num", String(day)));
    cell.appendChild(head);

    const isHalloween = MONTH === 9 && day === 31;
    if (isHalloween) {
      cell.classList.add("cal-halloween");
      cell.appendChild(el("p", "cal-holiday", "Halloween"));
    }

    if (plan.closed) {
      cell.classList.add("cal-closed");
      cell.appendChild(el("p", "cal-note", "Closed"));
      if (isHalloween) cell.appendChild(pumpkin());
      grid.appendChild(cell);
      continue;
    }

    const deal = info.deal || plan.deal;
    const dealLine = el("p", deal ? "cal-deal" : "cal-deal cal-tba", deal || "Deal TBA");
    const showDeal = !plan.noDeal || Boolean(info.deal);
    if (plan.eventFirst) cell.classList.add("cal-event-first");
    else if (showDeal) cell.appendChild(dealLine);

    for (const event of plan.events) {
      const line = el("p", "cal-event");
      if (event.time) {
        line.appendChild(el("span", "cal-time", event.time));
        line.appendChild(document.createTextNode(" "));
      }
      line.appendChild(document.createTextNode(event.what));
      cell.appendChild(line);
      if (event.band) {
        cell.appendChild(el("p", info.band ? "cal-band" : "cal-band cal-tba", info.band || "Band TBA"));
      }
    }

    if (plan.eventFirst && showDeal) cell.appendChild(dealLine);

    if (isHalloween) cell.appendChild(pumpkin());
    if (plan.footnote) {
      cell.classList.add("cal-has-footnote");
      cell.appendChild(el("p", "cal-footnote", plan.footnote));
    }
    grid.appendChild(cell);
  }
}

renderCalendar();
