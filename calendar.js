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
// small note centered at the bottom of that night's box. `hours` is
// [opens, closes] in hours after midnight (26 = 2am the next morning); it
// drives the "Tonight at Mash" card in the hero, not the calendar boxes.
const WEEKLY = {
  0: { closed: true },
  1: { closed: true },
  2: { hours: [18, 22], deal: "$20 Beer Towers", eventFirst: true, events: [{ what: "Trivia" }] },
  3: { hours: [18, 26], deal: "Half Off Everything",
       events: [{ time: "8pm–10pm", what: "Live Music", band: true },
                { time: "10pm–Close", what: "DJ" }] },
  4: { hours: [18, 26], deal: "$4 Doubles", events: [{ time: "9pm–12am", what: "Karaoke" }] },
  5: { hours: [18, 26], noDeal: true, events: [{ time: "9pm–12am", what: "Live Music", band: true }] },
  6: { hours: [18, 26], deal: "Game Day Specials TBA", events: [{ what: "DJ Time TBA" }],
       footnote: "*Schedule Subject to Change*" },
};

// Cobwebs and bats over the calendar: on automatically for an October
// calendar. Set to false to switch them off.
const SPOOKY_DECOR = MONTH === 9;

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

// The night that's "tonight": before 6am it's still last night (Mash is open
// until 2am). Shared by the phone list and the "Tonight at Mash" card.
function currentNight(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getHours() < 6 ? 1 : 0));
}

// One day's box: the same content in the desktop grid and the phone list.
// `label` replaces the weekday name (e.g. "Tonight"); `showMonth` adds "Oct"
// to the date for the phone list, which can run into the next month.
function dayCell(date, { label, showMonth } = {}) {
  const weekday = date.getDay();
  const plan = WEEKLY[weekday];
  const info = scheduleFor(date);
  const cell = el("li", "cal-day");

  const head = el("div", "cal-date");
  head.appendChild(el("span", "cal-weekday", label || WEEKDAYS[weekday]));
  const monthName = date.toLocaleString("en-US", { month: "short" });
  head.appendChild(el("span", "cal-num", showMonth ? monthName + " " + date.getDate() : String(date.getDate())));
  cell.appendChild(head);

  const isHalloween = date.getMonth() === 9 && date.getDate() === 31;
  if (isHalloween) {
    cell.classList.add("cal-halloween");
    cell.appendChild(el("p", "cal-holiday", "Halloween"));
  }

  if (plan.closed) {
    cell.classList.add("cal-closed");
    cell.appendChild(el("p", "cal-note", "Closed"));
    if (isHalloween) cell.appendChild(pumpkin());
    return cell;
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
  return cell;
}

// Desktop: the month grid
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
    const cell = dayCell(new Date(YEAR, MONTH, day));
    if (isThisMonth && day === now.getDate()) cell.classList.add("cal-today");
    if (isThisMonth && day < now.getDate()) cell.classList.add("cal-past");
    grid.appendChild(cell);
  }
}

// Phones: the next 7 nights, tonight first
const UPCOMING_NIGHTS = 7;

function renderUpcoming() {
  const list = document.getElementById("upcoming-list");
  if (!list) return;

  list.innerHTML = "";
  const tonight = currentNight();
  for (let i = 0; i < UPCOMING_NIGHTS; i++) {
    const date = new Date(tonight.getFullYear(), tonight.getMonth(), tonight.getDate() + i);
    const label = i === 0 ? "Tonight" : i === 1 ? "Tomorrow" : undefined;
    const cell = dayCell(date, { label, showMonth: true });
    if (i === 0) cell.classList.add("cal-today");
    list.appendChild(cell);
  }
}

renderCalendar();
renderUpcoming();
document.querySelector(".haunt")?.classList.toggle("is-spooky", SPOOKY_DECOR);

// ---- "Tonight at Mash" card in the hero ----
// Built from WEEKLY (and SCHEDULE for band names / one-off deals), so it
// always matches the calendar. Uses the visitor's clock.

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatHour(hour) {
  const h = hour % 24;
  return (h % 12 || 12) + (h < 12 ? "am" : "pm");
}

// SCHEDULE only covers YEAR/MONTH; other dates use the weekly plan alone
function scheduleFor(date) {
  return date.getFullYear() === YEAR && date.getMonth() === MONTH ? SCHEDULE[date.getDate()] || {} : {};
}

// e.g. ["Karaoke 9pm–12am", "$4 Doubles"]
function lineupFor(date) {
  const plan = WEEKLY[date.getDay()];
  const info = scheduleFor(date);
  const items = plan.events.map((event) => {
    let text = event.time ? event.what + " " + event.time : event.what;
    if (event.band && info.band) text += " with " + info.band;
    return text;
  });
  const deal = info.deal || (!plan.noDeal && plan.deal);
  if (deal) items.push(deal);
  return items;
}

function renderTonight() {
  const card = document.getElementById("tonight");
  if (!card) return;

  const now = new Date();
  const lateNight = now.getHours() < 6;
  const night = currentNight(now);
  const hourOfNight = now.getHours() + now.getMinutes() / 60 + (lateNight ? 24 : 0);
  const plan = WEEKLY[night.getDay()];

  let open = false;
  let status;
  let lineup;
  let nextLabel = "";

  if (!plan.closed && hourOfNight >= plan.hours[0] && hourOfNight < plan.hours[1]) {
    open = true;
    status = "Open now";
    lineup = lineupFor(night);
  } else if (!plan.closed && hourOfNight < plan.hours[0]) {
    status = "Opens tonight at " + formatHour(plan.hours[0]);
    lineup = lineupFor(night);
  } else {
    // closed tonight or already closed: find the next open night
    for (let i = 1; i <= 7; i++) {
      const next = new Date(night.getFullYear(), night.getMonth(), night.getDate() + i);
      const nextPlan = WEEKLY[next.getDay()];
      if (nextPlan.closed) continue;
      const isToday = next.toDateString() === now.toDateString();
      const when = isToday ? "tonight" : SHORT_DAYS[next.getDay()];
      status = "Opens " + when + " at " + formatHour(nextPlan.hours[0]);
      lineup = lineupFor(next);
      if (!isToday) nextLabel = SHORT_DAYS[next.getDay()] + ": ";
      break;
    }
  }

  card.classList.toggle("is-open", open);
  card.querySelector(".tonight-status-text").textContent = status;
  card.querySelector(".tonight-lineup").textContent = lineup.length ? nextLabel + lineup.join(" · ") : "";
  card.hidden = false;
}

// ---- Weekly specials tickets ----
// One ticket per night with a standing deal in WEEKLY, Tuesday (the first
// open night of the week) first.

const WEEKLY_ORDER = [2, 3, 4, 5, 6, 0, 1];

function renderSpecials() {
  const list = document.getElementById("specials-list");
  if (!list) return;

  WEEKLY_ORDER.forEach((weekday) => {
    const plan = WEEKLY[weekday];
    if (plan.closed || plan.noDeal || !plan.deal) return;
    const ticket = el("li", "ticket");
    ticket.appendChild(el("span", "ticket-day", WEEKDAYS[weekday]));
    ticket.appendChild(el("span", "ticket-deal", plan.deal));
    list.appendChild(ticket);
  });
}

// ---- Marquee under the header ----
// The next few open nights, e.g. "TONIGHT  Karaoke 9pm–12am · $4 Doubles ★"

const MARQUEE_NIGHTS = 6;

function renderMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;

  const items = [];
  const tonight = currentNight();
  for (let i = 0; i < 7 && items.length < MARQUEE_NIGHTS; i++) {
    const date = new Date(tonight.getFullYear(), tonight.getMonth(), tonight.getDate() + i);
    if (WEEKLY[date.getDay()].closed) continue;
    const item = el("span", "marquee-item");
    item.appendChild(el("span", i === 0 ? "marquee-day is-tonight" : "marquee-day",
      i === 0 ? "Tonight" : SHORT_DAYS[date.getDay()]));
    item.appendChild(document.createTextNode(lineupFor(date).join(" · ")));
    items.push(item);
  }

  // a second, hidden copy follows the first so the scroll loops without a gap
  const copy = el("span");
  copy.setAttribute("aria-hidden", "true");
  items.forEach((item) => copy.appendChild(item.cloneNode(true)));
  track.replaceChildren(...items, copy);
}

renderTonight();
renderSpecials();
renderMarquee();
setInterval(() => {
  renderTonight();
  // keep the phone list and marquee starting at tonight if the page stays open past 6am
  const first = document.querySelector("#upcoming-list .cal-num");
  const tonight = currentNight();
  if (first && !first.textContent.endsWith(" " + tonight.getDate())) {
    renderUpcoming();
    renderMarquee();
  }
}, 60 * 1000);
