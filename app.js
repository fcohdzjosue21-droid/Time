/**
 * World Day & Night Map
 * Interactive visualization of day/night zones on Earth
 */

(function () {
    'use strict';

    // =============================================
    // CONFIGURATION
    // =============================================
    const CITIES = [
        { name: 'Ciudad de México', lat: 19.43, lon: -99.13, tz: 'America/Mexico_City' },
        { name: 'Nueva York', lat: 40.71, lon: -74.01, tz: 'America/New_York' },
        { name: 'Los Ángeles', lat: 34.05, lon: -118.24, tz: 'America/Los_Angeles' },
        { name: 'Londres', lat: 51.51, lon: -0.13, tz: 'Europe/London' },
        { name: 'París', lat: 48.86, lon: 2.35, tz: 'Europe/Paris' },
        { name: 'Madrid', lat: 40.42, lon: -3.70, tz: 'Europe/Madrid' },
        { name: 'Berlín', lat: 52.52, lon: 13.41, tz: 'Europe/Berlin' },
        { name: 'Moscú', lat: 55.76, lon: 37.62, tz: 'Europe/Moscow' },
        { name: 'Dubái', lat: 25.20, lon: 55.27, tz: 'Asia/Dubai' },
        { name: 'Mumbai', lat: 19.08, lon: 72.88, tz: 'Asia/Kolkata' },
        { name: 'Pekín', lat: 39.90, lon: 116.40, tz: 'Asia/Shanghai' },
        { name: 'Tokio', lat: 35.68, lon: 139.69, tz: 'Asia/Tokyo' },
        { name: 'Sídney', lat: -33.87, lon: 151.21, tz: 'Australia/Sydney' },
        { name: 'São Paulo', lat: -23.55, lon: -46.63, tz: 'America/Sao_Paulo' },
        { name: 'Buenos Aires', lat: -34.60, lon: -58.38, tz: 'America/Argentina/Buenos_Aires' },
        { name: 'El Cairo', lat: 30.04, lon: 31.24, tz: 'Africa/Cairo' },
        { name: 'Lagos', lat: 6.52, lon: 3.38, tz: 'Africa/Lagos' },
        { name: 'Nairobi', lat: -1.29, lon: 36.82, tz: 'Africa/Nairobi' },
        { name: 'Seúl', lat: 37.57, lon: 126.98, tz: 'Asia/Seoul' },
        { name: 'Singapur', lat: 1.35, lon: 103.82, tz: 'Asia/Singapore' },
        { name: 'Bangkok', lat: 13.76, lon: 100.50, tz: 'Asia/Bangkok' },
        { name: 'Johannesburgo', lat: -26.20, lon: 28.04, tz: 'Africa/Johannesburg' },
        { name: 'Lima', lat: -12.05, lon: -77.04, tz: 'America/Lima' },
        { name: 'Bogotá', lat: 4.71, lon: -74.07, tz: 'America/Bogota' },
        { name: 'Santiago', lat: -33.45, lon: -70.67, tz: 'America/Santiago' },
        { name: 'Estambul', lat: 41.01, lon: 28.98, tz: 'Europe/Istanbul' },
        { name: 'Auckland', lat: -36.85, lon: 174.76, tz: 'Pacific/Auckland' },
        { name: 'Honolulu', lat: 21.31, lon: -157.86, tz: 'Pacific/Honolulu' },
        { name: 'Anchorage', lat: 61.22, lon: -149.90, tz: 'America/Anchorage' },
    ];

    const MAP_IMAGE_URL = 'https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74218/world.200411.3x5400x2700.jpg';
    const MAP_FALLBACK_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Equirectangular-projection.jpg/1280px-Equirectangular-projection.jpg';

    const DEG2RAD = Math.PI / 180;
    const RAD2DEG = 180 / Math.PI;
    const TWILIGHT_DEGREES = 6; // civil twilight

    // =============================================
    // STATE
    // =============================================
    let canvas, ctx;
    let mapImage = null;
    let mapLoaded = false;
    let speed = 1;
    let simTime = Date.now();
    let lastFrameTime = 0;
    let hoveredCity = null;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let mapOffsetX = 0;
    let mapOffsetY = 0;
    let mapDrawWidth = 0;
    let mapDrawHeight = 0;
    let dpr = 1;

    // =============================================
    // DOM REFERENCES
    // =============================================
    const utcTimeEl = document.getElementById('utcTime');
    const dateDisplayEl = document.getElementById('dateDisplay');
    const localTimeEl = document.getElementById('localTime');
    const sunInfoEl = document.getElementById('sunInfo');
    const tooltipEl = document.getElementById('tooltip');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const resetBtn = document.getElementById('resetBtn');

    // =============================================
    // SOLAR CALCULATIONS
    // =============================================

    /**
     * Compute the sun's declination and equation-of-time
     * for a given JavaScript Date object.
     */
    function getSolarPosition(date) {
        const jd = getJulianDate(date);
        const n = jd - 2451545.0; // days since J2000.0

        // Mean longitude (degrees)
        const L = (280.460 + 0.9856474 * n) % 360;
        // Mean anomaly (degrees)
        const g = ((357.528 + 0.9856003 * n) % 360) * DEG2RAD;

        // Ecliptic longitude (degrees)
        const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * DEG2RAD;

        // Obliquity of the ecliptic
        const epsilon = 23.439 * DEG2RAD;

        // Sun's declination
        const declination = Math.asin(Math.sin(epsilon) * Math.sin(lambda));

        // Equation of time (approximate, in minutes)
        const B = (360 / 365) * (n - 81) * DEG2RAD;
        const eqTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

        // Sub-solar point
        const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
        const subSolarLon = -((utcHours - 12) * 15 + eqTime * 0.25);
        const subSolarLat = declination * RAD2DEG;

        return { declination, eqTime, subSolarLon, subSolarLat };
    }

    function getJulianDate(date) {
        return date.getTime() / 86400000 + 2440587.5;
    }

    /**
     * Compute solar elevation angle in degrees for a given lat/lon.
     */
    function getSolarElevation(lat, lon, declination, subSolarLon) {
        const latRad = lat * DEG2RAD;
        const hourAngle = (lon - subSolarLon) * DEG2RAD;

        const sinAlt = Math.sin(latRad) * Math.sin(declination) +
            Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle);

        return Math.asin(Math.max(-1, Math.min(1, sinAlt))) * RAD2DEG;
    }

    // =============================================
    // COORDINATE CONVERSIONS
    // =============================================

    function latLonToCanvas(lat, lon) {
        const x = mapOffsetX + ((lon + 180) / 360) * mapDrawWidth;
        const y = mapOffsetY + ((90 - lat) / 180) * mapDrawHeight;
        return { x, y };
    }

    function canvasToLatLon(cx, cy) {
        const lon = ((cx - mapOffsetX) / mapDrawWidth) * 360 - 180;
        const lat = 90 - ((cy - mapOffsetY) / mapDrawHeight) * 180;
        return { lat, lon };
    }

    // =============================================
    // RENDERING
    // =============================================

    function render(timestamp) {
        requestAnimationFrame(render);

        if (!mapLoaded) return;

        // Update simulation time
        const dt = lastFrameTime ? (timestamp - lastFrameTime) : 16;
        lastFrameTime = timestamp;
        simTime += dt * speed;

        const simDate = new Date(simTime);
        const solar = getSolarPosition(simDate);

        // Clear
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw background
        ctx.fillStyle = '#0b0d17';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw map image
        ctx.drawImage(mapImage, mapOffsetX, mapOffsetY, mapDrawWidth, mapDrawHeight);

        // Draw night overlay
        drawNightOverlay(solar);

        // Draw terminator glow
        drawTerminatorGlow(solar);

        // Draw grid lines
        drawGridLines();

        // Draw sub-solar point
        drawSubSolarPoint(solar);

        // Draw cities
        drawCities(simDate, solar);

        // Update UI
        updateTimeDisplay(simDate, solar);
    }

    function drawNightOverlay(solar) {
        const stepX = 3;
        const stepY = 3;

        ctx.save();

        for (let px = mapOffsetX; px < mapOffsetX + mapDrawWidth; px += stepX) {
            for (let py = mapOffsetY; py < mapOffsetY + mapDrawHeight; py += stepY) {
                const { lat, lon } = canvasToLatLon(px, py);
                const elevation = getSolarElevation(lat, lon, solar.declination, solar.subSolarLon);

                let alpha = 0;
                if (elevation < -TWILIGHT_DEGREES) {
                    // Full night
                    alpha = 0.65;
                } else if (elevation < 0) {
                    // Twilight zone
                    alpha = 0.65 * (1 - (elevation + TWILIGHT_DEGREES) / TWILIGHT_DEGREES);
                } else {
                    alpha = 0;
                }

                if (alpha > 0.01) {
                    ctx.fillStyle = `rgba(5, 5, 30, ${alpha})`;
                    ctx.fillRect(px, py, stepX, stepY);
                }
            }
        }

        ctx.restore();
    }

    function drawTerminatorGlow(solar) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        for (let px = mapOffsetX; px < mapOffsetX + mapDrawWidth; px += 4) {
            for (let py = mapOffsetY; py < mapOffsetY + mapDrawHeight; py += 4) {
                const { lat, lon } = canvasToLatLon(px, py);
                const elevation = getSolarElevation(lat, lon, solar.declination, solar.subSolarLon);

                if (Math.abs(elevation) < 3) {
                    const intensity = 1 - Math.abs(elevation) / 3;
                    ctx.fillStyle = `rgba(255, 160, 60, ${intensity * 0.12})`;
                    ctx.fillRect(px, py, 4, 4);
                }
            }
        }

        ctx.restore();
    }

    function drawGridLines() {
        ctx.save();
        ctx.strokeStyle = 'rgba(100, 120, 180, 0.12)';
        ctx.lineWidth = 0.5;

        // Longitude lines every 30°
        for (let lon = -180; lon <= 180; lon += 30) {
            const { x } = latLonToCanvas(0, lon);
            ctx.beginPath();
            ctx.moveTo(x, mapOffsetY);
            ctx.lineTo(x, mapOffsetY + mapDrawHeight);
            ctx.stroke();
        }

        // Latitude lines every 30°
        for (let lat = -90; lat <= 90; lat += 30) {
            const { y } = latLonToCanvas(lat, 0);
            ctx.beginPath();
            ctx.moveTo(mapOffsetX, y);
            ctx.lineTo(mapOffsetX + mapDrawWidth, y);
            ctx.stroke();
        }

        // Equator highlight
        ctx.strokeStyle = 'rgba(100, 120, 180, 0.25)';
        ctx.lineWidth = 1;
        const eqY = latLonToCanvas(0, 0).y;
        ctx.beginPath();
        ctx.moveTo(mapOffsetX, eqY);
        ctx.lineTo(mapOffsetX + mapDrawWidth, eqY);
        ctx.stroke();

        ctx.restore();
    }

    function drawSubSolarPoint(solar) {
        const { x, y } = latLonToCanvas(solar.subSolarLat, solar.subSolarLon);

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        gradient.addColorStop(0, 'rgba(255, 213, 79, 0.5)');
        gradient.addColorStop(0.5, 'rgba(255, 160, 40, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 160, 40, 0)');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Inner sun
        ctx.fillStyle = '#ffd54f';
        ctx.shadowColor = '#ffa726';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Animated sun rays
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0;
        const rayLen = 12;
        const rayStart = 9;
        const now = Date.now() / 2000;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + now;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * rayStart, y + Math.sin(angle) * rayStart);
            ctx.lineTo(x + Math.cos(angle) * (rayStart + rayLen), y + Math.sin(angle) * (rayStart + rayLen));
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawCities(simDate, solar) {
        const cityRadius = 4;

        CITIES.forEach(city => {
            const { x, y } = latLonToCanvas(city.lat, city.lon);
            const elevation = getSolarElevation(city.lat, city.lon, solar.declination, solar.subSolarLon);
            const isDay = elevation > 0;

            // Glow + dot
            ctx.save();
            const glowColor = isDay ? 'rgba(255, 213, 79, 0.6)' : 'rgba(38, 198, 218, 0.6)';
            const dotColor = isDay ? '#ffd54f' : '#26c6da';

            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 800 + city.lat);

            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 6 + pulse * 4;
            ctx.fillStyle = dotColor;
            ctx.beginPath();
            ctx.arc(x, y, cityRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // City label
            ctx.save();
            ctx.fillStyle = 'rgba(232, 234, 246, 0.7)';
            ctx.font = `500 9px 'Inter', sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(city.name, x, y - 9);
            ctx.restore();

            // Store for hit testing
            city._sx = x;
            city._sy = y;
            city._isDay = isDay;
            city._elevation = elevation;
        });
    }

    function updateTimeDisplay(simDate, solar) {
        utcTimeEl.textContent = simDate.toISOString().substring(11, 19);

        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        dateDisplayEl.textContent = `${simDate.getUTCDate()} ${months[simDate.getUTCMonth()]} ${simDate.getUTCFullYear()}`;

        const now = new Date();
        localTimeEl.textContent = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        sunInfoEl.textContent = `Declinación solar: ${solar.subSolarLat.toFixed(2)}°  |  Lon sub-solar: ${solar.subSolarLon.toFixed(2)}°`;
    }

    // =============================================
    // TOOLTIP
    // =============================================

    function showTooltip(city, mx, my) {
        const simDate = new Date(simTime);
        const formatter = new Intl.DateTimeFormat('es-MX', {
            timeZone: city.tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        const dateFormatter = new Intl.DateTimeFormat('es-MX', {
            timeZone: city.tz,
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });

        const statusClass = city._isDay ? 'day' : 'night';
        const statusText = city._isDay ? '☀️ Día' : '🌙 Noche';

        tooltipEl.innerHTML = `
            <div class="city-name">${city.name}</div>
            <div class="city-time">${formatter.format(simDate)}</div>
            <div class="city-date">${dateFormatter.format(simDate)}</div>
            <div class="city-status ${statusClass}">${statusText}</div>
        `;
        tooltipEl.classList.remove('hidden');

        const rect = canvas.getBoundingClientRect();
        let tx = mx + 16;
        let ty = my - 10;

        if (tx + 180 > rect.width) tx = mx - 180;
        if (ty + 100 > rect.height) ty = my - 100;
        if (ty < 0) ty = 10;

        tooltipEl.style.left = tx + 'px';
        tooltipEl.style.top = ty + 'px';
    }

    function hideTooltip() {
        tooltipEl.classList.add('hidden');
    }

    // =============================================
    // CANVAS SIZING
    // =============================================

    function resizeCanvas() {
        dpr = window.devicePixelRatio || 1;
        const container = document.getElementById('mapContainer');
        const w = container.clientWidth;
        const h = container.clientHeight;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        canvasWidth = w;
        canvasHeight = h;

        // Maintain 2:1 aspect ratio for equirectangular projection
        const mapAspect = 2;
        const containerAspect = w / h;

        if (containerAspect > mapAspect) {
            mapDrawHeight = h;
            mapDrawWidth = h * mapAspect;
            mapOffsetX = (w - mapDrawWidth) / 2;
            mapOffsetY = 0;
        } else {
            mapDrawWidth = w;
            mapDrawHeight = w / mapAspect;
            mapOffsetX = 0;
            mapOffsetY = (h - mapDrawHeight) / 2;
        }
    }

    // =============================================
    // INITIALIZATION
    // =============================================

    function init() {
        canvas = document.getElementById('mapCanvas');
        ctx = canvas.getContext('2d');

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Load map image
        mapImage = new Image();
        mapImage.crossOrigin = 'anonymous';

        mapImage.onload = function () {
            mapLoaded = true;
            loadingOverlay.classList.add('hidden');
        };

        mapImage.onerror = function () {
            console.warn('Primary map failed, trying fallback...');
            const fallback = new Image();
            fallback.crossOrigin = 'anonymous';
            fallback.onload = function () {
                mapImage = fallback;
                mapLoaded = true;
                loadingOverlay.classList.add('hidden');
            };
            fallback.onerror = function () {
                generateFallbackMap();
                mapLoaded = true;
                loadingOverlay.classList.add('hidden');
            };
            fallback.src = MAP_FALLBACK_URL;
        };

        mapImage.src = MAP_IMAGE_URL;

        // Mouse events
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', () => {
            hoveredCity = null;
            hideTooltip();
            canvas.style.cursor = 'default';
        });

        // Speed controls
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                speed = parseInt(btn.dataset.speed, 10);
            });
        });

        // Reset button
        resetBtn.addEventListener('click', () => {
            simTime = Date.now();
            speed = 1;
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.speed-btn[data-speed="1"]').classList.add('active');
        });

        // Start render loop
        requestAnimationFrame(render);
    }

    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        let found = null;
        const hitRadius = 18;

        for (const city of CITIES) {
            if (city._sx === undefined) continue;
            const dx = mx - city._sx;
            const dy = my - city._sy;
            if (dx * dx + dy * dy < hitRadius * hitRadius) {
                found = city;
                break;
            }
        }

        if (found) {
            canvas.style.cursor = 'pointer';
            hoveredCity = found;
            showTooltip(found, mx, my);
        } else {
            canvas.style.cursor = 'default';
            hoveredCity = null;
            hideTooltip();
        }
    }

    function generateFallbackMap() {
        const offscreen = document.createElement('canvas');
        offscreen.width = 1200;
        offscreen.height = 600;
        const offCtx = offscreen.getContext('2d');

        // Ocean
        const oceanGrad = offCtx.createLinearGradient(0, 0, 0, 600);
        oceanGrad.addColorStop(0, '#1a3a5c');
        oceanGrad.addColorStop(0.3, '#1e4d7a');
        oceanGrad.addColorStop(0.5, '#1e5a8a');
        oceanGrad.addColorStop(0.7, '#1e4d7a');
        oceanGrad.addColorStop(1, '#1a3a5c');
        offCtx.fillStyle = oceanGrad;
        offCtx.fillRect(0, 0, 1200, 600);

        // Simple continents
        offCtx.fillStyle = '#2d5a1e';
        offCtx.beginPath(); offCtx.ellipse(250, 180, 120, 80, -0.2, 0, Math.PI * 2); offCtx.fill();
        offCtx.beginPath(); offCtx.ellipse(330, 380, 60, 100, 0.1, 0, Math.PI * 2); offCtx.fill();
        offCtx.beginPath(); offCtx.ellipse(580, 150, 60, 50, 0, 0, Math.PI * 2); offCtx.fill();
        offCtx.beginPath(); offCtx.ellipse(580, 320, 70, 100, 0, 0, Math.PI * 2); offCtx.fill();
        offCtx.beginPath(); offCtx.ellipse(780, 180, 150, 80, 0, 0, Math.PI * 2); offCtx.fill();
        offCtx.beginPath(); offCtx.ellipse(900, 400, 60, 40, 0, 0, Math.PI * 2); offCtx.fill();

        mapImage = offscreen;
    }

    // Start
    document.addEventListener('DOMContentLoaded', init);
})();
