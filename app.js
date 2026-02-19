/* ============================================================
   World Clock v2 — app.js
   Analog + digital clocks, animated digits, search, quick-add
   ============================================================ */

// ── City database ──────────────────────────────────────────
const CITIES = [
    { name: "Ciudad de México", country: "México", tz: "America/Mexico_City", flag: "🇲🇽" },
    { name: "Nueva York", country: "Estados Unidos", tz: "America/New_York", flag: "🇺🇸" },
    { name: "Los Ángeles", country: "Estados Unidos", tz: "America/Los_Angeles", flag: "🇺🇸" },
    { name: "Chicago", country: "Estados Unidos", tz: "America/Chicago", flag: "🇺🇸" },
    { name: "Bogotá", country: "Colombia", tz: "America/Bogota", flag: "🇨🇴" },
    { name: "Lima", country: "Perú", tz: "America/Lima", flag: "🇵🇪" },
    { name: "Buenos Aires", country: "Argentina", tz: "America/Argentina/Buenos_Aires", flag: "🇦🇷" },
    { name: "São Paulo", country: "Brasil", tz: "America/Sao_Paulo", flag: "🇧🇷" },
    { name: "Santiago", country: "Chile", tz: "America/Santiago", flag: "🇨🇱" },
    { name: "Londres", country: "Reino Unido", tz: "Europe/London", flag: "🇬🇧" },
    { name: "París", country: "Francia", tz: "Europe/Paris", flag: "🇫🇷" },
    { name: "Madrid", country: "España", tz: "Europe/Madrid", flag: "🇪🇸" },
    { name: "Berlín", country: "Alemania", tz: "Europe/Berlin", flag: "🇩🇪" },
    { name: "Roma", country: "Italia", tz: "Europe/Rome", flag: "🇮🇹" },
    { name: "Moscú", country: "Rusia", tz: "Europe/Moscow", flag: "🇷🇺" },
    { name: "Estambul", country: "Turquía", tz: "Europe/Istanbul", flag: "🇹🇷" },
    { name: "Dubái", country: "Emiratos Árabes", tz: "Asia/Dubai", flag: "🇦🇪" },
    { name: "Mumbai", country: "India", tz: "Asia/Kolkata", flag: "🇮🇳" },
    { name: "Bangkok", country: "Tailandia", tz: "Asia/Bangkok", flag: "🇹🇭" },
    { name: "Shanghái", country: "China", tz: "Asia/Shanghai", flag: "🇨🇳" },
    { name: "Hong Kong", country: "China", tz: "Asia/Hong_Kong", flag: "🇭🇰" },
    { name: "Tokio", country: "Japón", tz: "Asia/Tokyo", flag: "🇯🇵" },
    { name: "Seúl", country: "Corea del Sur", tz: "Asia/Seoul", flag: "🇰🇷" },
    { name: "Sídney", country: "Australia", tz: "Australia/Sydney", flag: "🇦🇺" },
    { name: "Auckland", country: "Nueva Zelanda", tz: "Pacific/Auckland", flag: "🇳🇿" },
    { name: "El Cairo", country: "Egipto", tz: "Africa/Cairo", flag: "🇪🇬" },
    { name: "Lagos", country: "Nigeria", tz: "Africa/Lagos", flag: "🇳🇬" },
    { name: "Nairobi", country: "Kenia", tz: "Africa/Nairobi", flag: "🇰🇪" },
    { name: "Johannesburgo", country: "Sudáfrica", tz: "Africa/Johannesburg", flag: "🇿🇦" },
    { name: "Toronto", country: "Canadá", tz: "America/Toronto", flag: "🇨🇦" },
    { name: "Vancouver", country: "Canadá", tz: "America/Vancouver", flag: "🇨🇦" },
    { name: "Honolulú", country: "Estados Unidos", tz: "Pacific/Honolulu", flag: "🇺🇸" },
    { name: "Anchorage", country: "Estados Unidos", tz: "America/Anchorage", flag: "🇺🇸" },
];

const QUICK_ADD_TZS = [
    "America/New_York",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Asia/Dubai",
    "America/Argentina/Buenos_Aires",
];

const DEFAULT_CITIES_TZ = [
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
    "America/Argentina/Buenos_Aires",
];

// ── State ──────────────────────────────────────────────────
let selectedCities = [];
let prevDigits = { hours: "", minutes: "", seconds: "" };

// ── DOM ────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const localClockEl = $("#localClock");
const localDateEl = $("#localDate");
const localTzEl = $("#localTimezone");
const localHandH = $("#localHandHour");
const localHandM = $("#localHandMin");
const localHandS = $("#localHandSec");
const searchInput = $("#citySearch");
const dropdown = $("#searchDropdown");
const citiesGrid = $("#citiesGrid");
const compSection = $("#comparisonSection");
const compBody = $("#comparisonBody");
const quickChips = $("#quickChips");
const cityCountEl = $("#cityCount");

// ── Helpers ────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");
const tzId = (tz) => tz.replace(/\//g, "-");

function timeInTz(tz) {
    return new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
}

function formatTime(d) {
    return { h: pad(d.getHours()), m: pad(d.getMinutes()), s: pad(d.getSeconds()) };
}

function formatTimeStr(d) {
    const { h, m, s } = formatTime(d);
    return `${h}:${m}:${s}`;
}

function formatDate(d) {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function isDaytime(d) {
    const h = d.getHours();
    return h >= 6 && h < 20;
}

function getUtcOffset(tz) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    const p = parts.find((x) => x.type === "timeZoneName");
    return p ? p.value : "";
}

function diffHoursFromLocal(tz) {
    const now = new Date();
    const local = new Date(now.toLocaleString("en-US"));
    const remote = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    return (remote - local) / 3_600_000;
}

function diffLabel(h) {
    if (h === 0) return "Misma hora";
    const sign = h > 0 ? "+" : "";
    const abs = Math.abs(h);
    const hrs = Math.floor(abs);
    const mins = Math.round((abs - hrs) * 60);
    if (mins === 0) return `${sign}${h}h`;
    return `${sign}${h > 0 ? "" : "-"}${hrs}h ${mins}m`;
}

// ── Analog clock hands ─────────────────────────────────────
function setHands(hourEl, minEl, secEl, date) {
    const h = date.getHours() % 12;
    const m = date.getMinutes();
    const s = date.getSeconds();
    const ms = date.getMilliseconds();

    const secDeg = (s + ms / 1000) * 6;
    const minDeg = m * 6 + s * 0.1;
    const hourDeg = h * 30 + m * 0.5;

    hourEl.style.transform = `rotate(${hourDeg}deg)`;
    minEl.style.transform = `rotate(${minDeg}deg)`;
    secEl.style.transform = `rotate(${secDeg}deg)`;
}

// ── Update local clock ─────────────────────────────────────
function updateLocalClock() {
    const now = new Date();
    const { h, m, s } = formatTime(now);

    // Update digit groups with pop animation
    const groups = localClockEl.querySelectorAll(".digit-group");
    const vals = [h, m, s];
    const keys = ["hours", "minutes", "seconds"];
    groups.forEach((el, i) => {
        if (el.textContent !== vals[i]) {
            el.textContent = vals[i];
            el.classList.remove("changed");
            // Force reflow
            void el.offsetWidth;
            el.classList.add("changed");
        }
    });

    localDateEl.textContent = formatDate(now);
    localTzEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Analog
    setHands(localHandH, localHandM, localHandS, now);
}

// ── Search ─────────────────────────────────────────────────
searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { dropdown.classList.remove("show"); return; }

    const results = CITIES.filter((c) => {
        if (selectedCities.some((s) => s.tz === c.tz)) return false;
        return (
            c.name.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q) ||
            c.tz.toLowerCase().includes(q)
        );
    }).slice(0, 8);

    if (!results.length) {
        dropdown.innerHTML = `<div class="dropdown-item" style="color:var(--text-dim);pointer-events:none">Sin resultados</div>`;
        dropdown.classList.add("show");
        return;
    }

    dropdown.innerHTML = results.map((c, i) => {
        const t = timeInTz(c.tz);
        return `
    <div class="dropdown-item" data-idx="${i}">
      <span class="flag">${c.flag}</span>
      <div class="city-info">
        <span class="city-name">${c.name}</span>
        <span class="tz-name">${c.country} · ${c.tz}</span>
      </div>
      <span class="preview-time">${formatTimeStr(t)}</span>
    </div>`;
    }).join("");

    dropdown.classList.add("show");

    dropdown.querySelectorAll(".dropdown-item").forEach((el) => {
        el.addEventListener("click", () => {
            const idx = +el.dataset.idx;
            if (idx >= 0 && results[idx]) {
                addCity(results[idx]);
                searchInput.value = "";
                dropdown.classList.remove("show");
            }
        });
    });
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        searchInput.value = "";
        dropdown.classList.remove("show");
        searchInput.blur();
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) dropdown.classList.remove("show");
});

// ── Quick-add chips ────────────────────────────────────────
function renderQuickChips() {
    quickChips.innerHTML = QUICK_ADD_TZS.map((tz) => {
        const c = CITIES.find((x) => x.tz === tz);
        if (!c) return "";
        const added = selectedCities.some((s) => s.tz === tz);
        return `<button class="chip ${added ? "added" : ""}" data-tz="${tz}">
      <span class="chip-flag">${c.flag}</span> ${c.name}
    </button>`;
    }).join("");

    quickChips.querySelectorAll(".chip:not(.added)").forEach((btn) => {
        btn.addEventListener("click", () => {
            const c = CITIES.find((x) => x.tz === btn.dataset.tz);
            if (c) addCity(c);
        });
    });
}

// ── City management ────────────────────────────────────────
function addCity(city) {
    if (selectedCities.some((c) => c.tz === city.tz)) return;
    selectedCities.push(city);
    saveCities();
    renderAll();
}

function removeCity(tz) {
    selectedCities = selectedCities.filter((c) => c.tz !== tz);
    saveCities();
    renderAll();
}

function saveCities() {
    localStorage.setItem("wc_cities_v2", JSON.stringify(selectedCities.map((c) => c.tz)));
}

function loadCities() {
    const raw = localStorage.getItem("wc_cities_v2");
    const list = raw ? JSON.parse(raw) : DEFAULT_CITIES_TZ;
    selectedCities = list.map((tz) => CITIES.find((c) => c.tz === tz)).filter(Boolean);
}

// ── Render cards ───────────────────────────────────────────
function renderCards() {
    citiesGrid.innerHTML = selectedCities.map((c, i) => {
        const t = timeInTz(c.tz);
        const tf = formatTime(t);
        const day = isDaytime(t);
        const diff = diffHoursFromLocal(c.tz);
        const id = tzId(c.tz);

        return `
    <div class="city-card" style="animation-delay:${i * 0.07}s">
      <div class="daynight-indicator ${day ? "daynight-day" : "daynight-night"}"></div>
      <div class="card-header">
        <div class="card-city">
          <span class="card-flag">${c.flag}</span>
          <div>
            <div class="card-name">${c.name}</div>
            <div class="card-country">${c.country}</div>
          </div>
        </div>
        <button class="remove-btn" data-tz="${c.tz}" title="Quitar">✕</button>
      </div>

      <div class="card-time-row">
        <div class="mini-analog" id="mini-${id}">
          <div class="clock-face">
            <div class="hand hand-hour"   id="mh-${id}"></div>
            <div class="hand hand-minute" id="mm-${id}"></div>
            <div class="hand hand-second" id="ms-${id}"></div>
            <div class="clock-center"></div>
          </div>
        </div>
        <div class="card-time" data-tz="${c.tz}">
          ${tf.h}:${tf.m}<span class="card-seconds">:${tf.s}</span>
        </div>
      </div>

      <div class="card-date" data-tz-date="${c.tz}">${formatDate(t)}</div>
      <div class="card-badges">
        <span class="badge ${day ? "badge-day" : "badge-night"}">${day ? "☀️ Día" : "🌙 Noche"}</span>
        <span class="badge badge-diff">${diffLabel(diff)}</span>
        <span class="badge badge-utc">${getUtcOffset(c.tz)}</span>
      </div>
    </div>`;
    }).join("");

    // Bind remove
    citiesGrid.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", () => removeCity(btn.dataset.tz));
    });
}

// ── Render table ───────────────────────────────────────────
function renderTable() {
    if (!selectedCities.length) {
        compSection.style.display = "none";
        return;
    }
    compSection.style.display = "block";
    cityCountEl.textContent = `${selectedCities.length} ciudad${selectedCities.length > 1 ? "es" : ""}`;

    compBody.innerHTML = selectedCities.map((c) => {
        const t = timeInTz(c.tz);
        const day = isDaytime(t);
        const diff = diffHoursFromLocal(c.tz);
        return `
    <tr>
      <td>${c.flag} ${c.name}</td>
      <td class="time-cell" data-tz-table="${c.tz}">${formatTimeStr(t)}</td>
      <td data-tz-table-date="${c.tz}">${formatDate(t)}</td>
      <td>${diffLabel(diff)}</td>
      <td>${day ? "☀️ Día" : "🌙 Noche"}</td>
    </tr>`;
    }).join("");
}

// ── Render all ─────────────────────────────────────────────
function renderAll() {
    renderCards();
    renderTable();
    renderQuickChips();
}

// ── Live tick ──────────────────────────────────────────────
function tick() {
    updateLocalClock();

    selectedCities.forEach((c) => {
        const t = timeInTz(c.tz);
        const tf = formatTime(t);
        const id = tzId(c.tz);

        // Update digital time
        const timeEl = document.querySelector(`.card-time[data-tz="${c.tz}"]`);
        if (timeEl) {
            timeEl.innerHTML = `${tf.h}:${tf.m}<span class="card-seconds">:${tf.s}</span>`;
        }

        // Update date
        const dateEl = document.querySelector(`[data-tz-date="${c.tz}"]`);
        if (dateEl) dateEl.textContent = formatDate(t);

        // Update mini analog clock
        const hEl = document.getElementById(`mh-${id}`);
        const mEl = document.getElementById(`mm-${id}`);
        const sEl = document.getElementById(`ms-${id}`);
        if (hEl && mEl && sEl) setHands(hEl, mEl, sEl, t);

        // Update table
        const tblTime = document.querySelector(`[data-tz-table="${c.tz}"]`);
        if (tblTime) tblTime.textContent = formatTimeStr(t);
        const tblDate = document.querySelector(`[data-tz-table-date="${c.tz}"]`);
        if (tblDate) tblDate.textContent = formatDate(t);
    });
}

// ── Init ───────────────────────────────────────────────────
loadCities();
renderAll();
updateLocalClock();

// Initial analog hands (instant set before animation starts)
selectedCities.forEach((c) => {
    const t = timeInTz(c.tz);
    const id = tzId(c.tz);
    const hEl = document.getElementById(`mh-${id}`);
    const mEl = document.getElementById(`mm-${id}`);
    const sEl = document.getElementById(`ms-${id}`);
    if (hEl && mEl && sEl) setHands(hEl, mEl, sEl, t);
});

setInterval(tick, 1000);
