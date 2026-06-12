/* ═══════════════════════════════════════════════════════════════
   js/bot/web/web-weather.js  —  Open-Meteo Weather Source
   ─────────────────────────────────────────────────────────────
   Free, no API key, no limits. Geocode city → current weather.
   Triggers ONLY on weather-related queries (checked by web-engine
   before calling this, but this file double-checks too).
   Confidence: 0.95 (live data, very specific match).
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/web/web-weather.js
   EXPORTS: window.RoRoWebSources.weather(query)
   Returns: {summary, source, confidence} | null
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.RoRoWebSources = window.RoRoWebSources || {};

  window.RoRoWebSources.weather = async function (query) {
    const C = (window.RORO_CONST && window.RORO_CONST.WEB) || {};
    const timeout = C.TIMEOUT_MS || 4000;
    const lower = query.toLowerCase();

    if (!/\b(weather|temperature|forecast|rain|climate|how\s+hot|how\s+cold|degrees)\b/i.test(lower)) return null;

    try {
      /* Extract city name from common phrasings */
      let city = null;
      let m;
      if ((m = lower.match(/weather\s+(?:in|at|for|of)\s+([a-z\s]+?)(?:\s*\?|$|\s+today|\s+now|\s+right\s+now)/i))) city = m[1];
      else if ((m = lower.match(/(?:in|at)\s+([a-z\s]+?)\s+(?:weather|temperature)/i))) city = m[1];
      else if ((m = lower.match(/([a-z\s]+?)\s+(?:ka\s+mausam|mein\s+mausam)/i))) city = m[1];
      else if ((m = lower.match(/how\s+(?:hot|cold)\s+is\s+it\s+in\s+([a-z\s]+?)(?:\s*\?|$)/i))) city = m[1];

      if (!city) {
        /* Fallback: use Bengaluru (the site owner's location) if no city specified */
        city = 'Bengaluru';
      }
      city = city.trim();
      if (!city || city.length < 2) return null;

      /* Geocode */
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&format=json`;
      const geo = await fetch(geoUrl, { signal: AbortSignal.timeout(timeout) });
      const gd  = await geo.json();
      if (!gd.results || !gd.results[0]) return null;

      const { latitude, longitude, name, country } = gd.results[0];

      /* Current weather */
      const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
      const wr = await fetch(wUrl, { signal: AbortSignal.timeout(timeout) });
      const wd = await wr.json();
      if (!wd.current_weather) return null;

      const temp = wd.current_weather.temperature;
      const wind = wd.current_weather.windspeed;

      /* WMO weather code → description (simplified) */
      const code = wd.current_weather.weathercode;
      const desc = _wmoDesc(code);

      const summary = `Current weather in ${name}${country ? ', ' + country : ''}: ${temp}\u00b0C, ${desc}, wind ${wind} km/h.`;
      return { summary, source: 'Open-Meteo', confidence: 0.95 };
    } catch { return null; }
  };

  /* WMO Weather interpretation codes — simplified mapping */
  function _wmoDesc(code) {
    const map = {
      0: 'clear sky', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast',
      45: 'fog', 48: 'fog', 51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle',
      61: 'light rain', 63: 'rain', 65: 'heavy rain',
      71: 'light snow', 73: 'snow', 75: 'heavy snow',
      80: 'rain showers', 81: 'rain showers', 82: 'violent rain showers',
      95: 'thunderstorm', 96: 'thunderstorm with hail', 99: 'severe thunderstorm',
    };
    return map[code] || 'mixed conditions';
  }
})();
