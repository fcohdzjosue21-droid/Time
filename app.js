/* ============================================================
   World Clock — app.js
   Live world-clock comparison with search, cards, and table.
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

// ── State ──────────────────────────────────────────────────
let selectedCities = [];
const DEFAULT_CITIES = [
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
    "America/Argentina/Buenos_Aires",
];

// ── DOM refs ───────────────────────────────────────────────
const localClockEl = document.getElementById("localClock");
const localDateEl = document.getElementById("localDate");
const localTzEl = document.getElementById("localTimezone");
const searchInput = document.getElementById("citySearch");
const dropdown = document.getElementById("searchDropdown");
const citiesGrid = document.getElementById("citiesGrid");
const compSection = document.getElementById("comparisonSection");
const compBody = document.getElementById("comparisonBody");

// ── Helpers ────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, "0"); }

function timeInTz(tz) {
    return new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
}

function formatTime(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatDate(date) {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function isDaytime(date) {
    const h = date.getHours();
    return h >= 6 && h < 20;
}

function getUtcOffset(tz) {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "shortOffset",
    }).formatToParts(now);
    const offsetPart = parts.find(p => p.type === "timeZoneName");
    return offsetPart ? offsetPart.value : "";
}

function diffHoursFromLocal(tz) {
    const now = new Date();
    const local = new Date(now.toLocaleString("en-US"));
    const remote = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const diffMs = remote - local;
    const diffH = diffMs / 3_600_000;
    return diffH;
}

function diffLabel(h) {
    if (h === 0) return "Misma hora";
    const sign = h > 0 ? "+" : "";
    const abs = Math.abs(h);
    const hours = Math.floor(abs);
    const mins = Math.round((abs - hours) * 60);
    if (mins === 0) return `${sign}${h}h`;
    return `${sign}${h > 0 ? "" : "-"}${hours}h ${mins}m`;
}

// ── Local clock ────────────────────────────────────────────
function updateLocalClock() {
    const now = new Date();
    localClockEl.textContent = formatTime(now);
    localDateEl.textContent = formatDate(now);
    localTzEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// ── Search / Dropdown ──────────────────────────────────────
searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { dropdown.classList.remove("show"); return; }

    const results = CITIES.filter(c => {
        const alreadyAdded = selectedCities.some(s => s.tz === c.tz);
        if (alreadyAdded) return false;
        return (
            c.name.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q) ||
            c.tz.toLowerCase().includes(q)
        );
    }).slice(0, 8);

    if (!results.length) { dropdown.classList.remove("show"); return; }

    dropdown.innerHTML = results
        .map(
            (c, i) => `
    <div class="dropdown-item" data-idx="${i}" data-tz="${c.tz}">
      <span class="flag">${c.flag}</span>
      <span class="city-name">${c.name}</span>
      <span class="tz-name">${c.country} · ${c.tz}</span>
    </div>`
        )
        .join("");

    dropdown.classList.add("show");

    dropdown.querySelectorAll(".dropdown-item").forEach((el) => {
        el.addEventListener("click", () => {
            const city = results[+el.dataset.idx];
            addCity(city);
            searchInput.value = "";
            dropdown.classList.remove("show");
        });
    });
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) dropdown.classList.remove("show");
});

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
    localStorage.setItem(
        "wc_cities",
        JSON.stringify(selectedCities.map((c) => c.tz))
    );
}

function loadCities() {
    const raw = localStorage.getItem("wc_cities");
    let tzList = raw ? JSON.parse(raw) : DEFAULT_CITIES;
    selectedCities = tzList
        .map((tz) => CITIES.find((c) => c.tz === tz))
        .filter(Boolean);
}

// ── Render ─────────────────────────────────────────────────
function renderCards() {
    citiesGrid.innerHTML = selectedCities
        .map((c) => {
            const t = timeInTz(c.tz);
            const day = isDaytime(t);
            const diff = diffHoursFromLocal(c.tz);
            return `
      <div class="city-card" id="card-${c.tz.replace(/\//g, '-')}">
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
        <div class="card-time" data-tz="${c.tz}">${formatTime(t)}</div>
        <div class="card-date" data-tz-date="${c.tz}">${formatDate(t)}</div>
        <div class="card-meta">
          <span class="badge ${day ? "badge-day" : "badge-night"}">${day ? "☀️ Día" : "🌙 Noche"}</span>
          <span class="badge badge-diff">${diffLabel(diff)}</span>
          <span class="badge" style="background:rgba(255,255,255,0.05);color:var(--text-dim)">${getUtcOffset(c.tz)}</span>
        </div>
      </div>`;
        })
        .join("");

    // Bind remove buttons
    citiesGrid.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", () => removeCity(btn.dataset.tz));
    });
}

function renderTable() {
    if (!selectedCities.length) {
        compSection.style.display = "none";
        return;
    }
    compSection.style.display = "block";

    compBody.innerHTML = selectedCities
        .map((c) => {
            const t = timeInTz(c.tz);
            const day = isDaytime(t);
            const diff = diffHoursFromLocal(c.tz);
            return `
      <tr>
        <td>${c.flag} ${c.name}</td>
        <td style="font-weight:700;font-variant-numeric:tabular-nums" data-tz-table="${c.tz}">${formatTime(t)}</td>
        <td data-tz-table-date="${c.tz}">${formatDate(t)}</td>
        <td>${diffLabel(diff)}</td>
        <td>${day ? "☀️ Día" : "🌙 Noche"}</td>
      </tr>`;
        })
        .join("");
}

function renderAll() {
    renderCards();
    renderTable();
}

// ── Live tick ──────────────────────────────────────────────
function tick() {
    updateLocalClock();

    // Update card times without full re-render
    selectedCities.forEach((c) => {
        const t = timeInTz(c.tz);
        const timeEl = document.querySelector(`[data-tz="${c.tz}"]`);
        if (timeEl) timeEl.textContent = formatTime(t);
        const dateEl = document.querySelector(`[data-tz-date="${c.tz}"]`);
        if (dateEl) dateEl.textContent = formatDate(t);
        const tableTime = document.querySelector(`[data-tz-table="${c.tz}"]`);
        if (tableTime) tableTime.textContent = formatTime(t);
        const tableDate = document.querySelector(`[data-tz-table-date="${c.tz}"]`);
        if (tableDate) tableDate.textContent = formatDate(t);
    });
}

// ── Init ───────────────────────────────────────────────────
loadCities();
renderAll();
updateLocalClock();
setInterval(tick, 1000);
