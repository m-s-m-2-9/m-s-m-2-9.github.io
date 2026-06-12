/* ═══════════════════════════════════════════════════════════════
   js/bot/web/web-engine.js  —  Parallel Search Coordinator
   ─────────────────────────────────────────────────────────────
   THE BRAIN OF THE WEB LAYER.

   Old approach (v4): DDG → Wikipedia → OpenLibrary, sequential,
   first-non-null wins. Slow (up to 3 sequential round trips) and
   DDG (weakest source) got first say.

   New approach (v5):
   1. Math check first — instant, zero network (RoRoText.solveMath)
   2. Detect query type (book / weather / country / general)
   3. Fire ALL relevant sources in PARALLEL via Promise.allSettled
   4. Pick the result with the HIGHEST confidence score
   5. Cache for 24 hours (factual data doesn't change hourly)
   6. Max 500 cache entries (LRU eviction via RoRoCache)
   7. Concurrent identical queries deduplicated automatically

   Source confidence ranking (highest wins when multiple answer):
     Math        1.00  (exact, instant)
     Open-Meteo  0.95  (live weather — very specific)
     RestCountries 0.90 (structured country facts)
     Wikidata    0.88  (structured facts — people/places/dates)
     OpenLibrary 0.88  (books only)
     Wikipedia   0.85  (broad encyclopedic — most general queries)
     DuckDuckGo  0.65–0.72 (backup only — weakest)

   Depends on: utils/cache.js, utils/text.js, utils/constants.js,
   web-wikipedia.js, web-wikidata.js, web-ddg.js, web-weather.js,
   web-countries.js, web-books.js (all must load BEFORE this file)
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/web/web-engine.js
   EXPORTS: window.RoRoWebEngine = { lookup, lookupBook, tryMath,
            clearCache, getCacheStats }
   BACKWARD COMPAT: window.RoRoWeb = window.RoRoWebEngine
   (so the existing manager-roro.js keeps working unchanged)
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function _cache() { return window.RoRoCache; }
  function _text()  { return window.RoRoText; }

  /* ── Detect query type to select relevant sources ────────── */
  function _detectType(query) {
    const l = query.toLowerCase();
    return {
      isBook:    /\b(book|novel|author|wrote|written\s+by|published|reading|bestseller|fiction)\b/i.test(l),
      isWeather: /\b(weather|temperature|forecast|rain|climate|how\s+hot|how\s+cold|degrees)\b/i.test(l),
      isCountry: /\b(country|nation|capital|population|currency|language|continent)\b/i.test(l)
                 || ['india','pakistan','china','usa','america','england','britain','france','germany','japan','australia','russia','canada','brazil'].some(c=>l.includes(c)),
    };
  }

  /* ── MAIN LOOKUP — parallel, confidence-ranked ───────────── */
  async function lookup(query) {
    const T = _text();
    const cache = _cache();

    /* 1. Math check — instant, zero network */
    if (T) {
      const math = T.solveMath(query);
      if (math !== null) {
        return { summary: `The answer is ${math}.`, source: 'Math', confidence: 1.0 };
      }
    }

    if (!cache) return null;
    const key = cache.key(query);

    /* 2. Cache check */
    const cached = cache.web.get(key);
    if (cached) return cached;

    /* 3. Deduplicated parallel search */
    return cache.dedup.dedupe(key, async () => {
      const type = _detectType(query);
      const S = window.RoRoWebSources || {};
      const tasks = [];

      /* Type-specific sources first (run alongside general sources) */
      if (type.isBook    && S.books)     tasks.push(S.books(query));
      if (type.isWeather && S.weather)   tasks.push(S.weather(query));
      if (type.isCountry && S.countries) tasks.push(S.countries(query));

      /* General-purpose sources — always run unless pure book query */
      if (S.wikidata)  tasks.push(S.wikidata(query));
      if (S.wikipedia) tasks.push(S.wikipedia(query));

      /* DDG only as backup — skip for book queries (OpenLibrary is better) */
      if (!type.isBook && S.ddg) tasks.push(S.ddg(query));

      if (!tasks.length) return null;

      const settled = await Promise.allSettled(tasks);
      let best = null;
      for (const r of settled) {
        if (r.status === 'fulfilled' && r.value && r.value.summary) {
          if (!best || r.value.confidence > best.confidence) best = r.value;
        }
      }

      if (best) cache.web.set(key, best);
      return best;
    });
  }

  /* ── BOOK-SPECIFIC LOOKUP (used when classifier says BOOK_QUERY) */
  async function lookupBook(query) {
    const cache = _cache();
    const key = cache ? 'book_' + cache.key(query) : null;

    if (cache && key) {
      const cached = cache.web.get(key);
      if (cached) return cached;
    }

    const S = window.RoRoWebSources || {};
    let result = S.books ? await S.books(query) : null;
    if (!result && S.wikipedia) result = await S.wikipedia(query);
    if (!result && S.ddg)       result = await S.ddg(query);

    if (result && cache && key) cache.web.set(key, result);
    return result;
  }

  /* ── MATH passthrough ─────────────────────────────────────── */
  function tryMath(expr) {
    const T = _text();
    return T ? T.solveMath(expr) : null;
  }

  /* ── CACHE UTILITIES ──────────────────────────────────────── */
  function clearCache() {
    const cache = _cache();
    if (cache) cache.web.clear();
  }

  function getCacheStats() {
    const cache = _cache();
    return cache ? cache.web.stats : { size: 0, maxSize: 0, ttlHours: 0 };
  }

  /* ── EXPORT ───────────────────────────────────────────────── */
  window.RoRoWebEngine = { lookup, lookupBook, tryMath, clearCache, getCacheStats };

  /* Backward compatibility — old manager-roro.js calls window.RoRoWeb.* */
  window.RoRoWeb = window.RoRoWebEngine;

})();
