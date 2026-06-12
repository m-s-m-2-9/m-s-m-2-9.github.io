/* ═══════════════════════════════════════════════════════════════
   js/bot/web/web-countries.js  —  REST Countries Source
   ─────────────────────────────────────────────────────────────
   Free, no key. Structured country data: capital, population,
   currency, languages, region. Triggers on country-fact queries.
   Confidence: 0.9 (structured, authoritative for country data).
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/web/web-countries.js
   EXPORTS: window.RoRoWebSources.countries(query)
   Returns: {summary, source, confidence} | null
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.RoRoWebSources = window.RoRoWebSources || {};

  /* Common country names to detect even without "country" keyword */
  const COUNTRY_HINTS = [
    'india','pakistan','china','usa','america','united states','england','britain',
    'uk','france','germany','japan','australia','russia','canada','brazil','italy',
    'spain','mexico','indonesia','nigeria','egypt','south africa','saudi arabia',
    'uae','dubai','singapore','nepal','bangladesh','sri lanka',
  ];

  window.RoRoWebSources.countries = async function (query) {
    const T = window.RoRoText;
    const C = (window.RORO_CONST && window.RORO_CONST.WEB) || {};
    const timeout = C.TIMEOUT_MS || 4000;
    const lower = query.toLowerCase();

    const hasFactWord = /\b(country|nation|capital|population|currency|language|region|continent)\b/i.test(lower);
    const hasCountryName = COUNTRY_HINTS.some(c => lower.includes(c));
    if (!hasFactWord && !hasCountryName) return null;

    try {
      /* Extract likely country name */
      let term = null;
      for (const c of COUNTRY_HINTS) { if (lower.includes(c)) { term = c; break; } }
      if (!term) {
        /* Strip fact words to find the remaining term */
        term = lower.replace(/\b(country|nation|capital|population|currency|language|region|continent|of|the|what|is|are|a|an|tell|me|about)\b/gi, '').trim();
      }
      if (!term || term.length < 3) return null;
      if (term === 'usa' || term === 'america') term = 'united states';
      if (term === 'uk' || term === 'britain') term = 'united kingdom';

      const url = 'https://restcountries.com/v3.1/name/' + encodeURIComponent(term)
        + '?fields=name,capital,population,currencies,languages,region,subregion';

      const r = await fetch(url, { signal: AbortSignal.timeout(timeout) });
      if (!r.ok) return null;
      const d = await r.json();
      if (!Array.isArray(d) || !d[0]) return null;

      const c = d[0];
      const parts = [];
      if (c.name?.common) parts.push(c.name.common);
      if (c.capital?.[0]) parts.push(`Capital: ${c.capital[0]}`);
      if (c.region) parts.push(c.subregion ? `${c.subregion}, ${c.region}` : c.region);
      if (c.population) parts.push(`Population: ${c.population.toLocaleString()}`);
      if (c.currencies) {
        const cur = Object.values(c.currencies)[0];
        if (cur?.name) parts.push(`Currency: ${cur.name}`);
      }
      if (c.languages) {
        const langs = Object.values(c.languages).slice(0, 3).join(', ');
        if (langs) parts.push(`Languages: ${langs}`);
      }

      const summary = parts.join('. ') + '.';
      return { summary: T.cap(summary, 50), source: 'RestCountries', confidence: 0.9 };
    } catch { return null; }
  };
})();
