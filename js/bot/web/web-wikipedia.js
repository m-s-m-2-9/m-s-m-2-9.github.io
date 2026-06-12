/* ═══════════════════════════════════════════════════════════════
   js/bot/web/web-wikipedia.js  —  Wikipedia Source
   ─────────────────────────────────────────────────────────────
   2-step lookup: search for best title → fetch summary.
   Reliable for people, places, concepts, history.
   Confidence: 0.85 (high — encyclopedic, stable).
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/web/web-wikipedia.js
   EXPORTS: window.RoRoWebSources.wikipedia(query)
   Returns: {summary, source, title, url, confidence} | null
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.RoRoWebSources = window.RoRoWebSources || {};

  window.RoRoWebSources.wikipedia = async function (query) {
    const T = window.RoRoText;
    const C = (window.RORO_CONST && window.RORO_CONST.WEB) || {};
    const timeout = C.TIMEOUT_MS || 4000;

    try {
      /* Step 1: search for the best matching title */
      const searchUrl = 'https://en.wikipedia.org/w/api.php'
        + '?action=query&list=search&srsearch=' + encodeURIComponent(query)
        + '&srlimit=1&format=json&origin=*';

      const sr = await fetch(searchUrl, { signal: AbortSignal.timeout(timeout) });
      const sd = await sr.json();
      const title = sd?.query?.search?.[0]?.title;
      if (!title) return null;

      /* Step 2: fetch the page summary for that title */
      const summaryUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
        + encodeURIComponent(title);

      const pr = await fetch(summaryUrl, { signal: AbortSignal.timeout(timeout) });
      const pd = await pr.json();

      if (pd.extract && pd.extract.length > 30) {
        return {
          summary:    T.cap(T.clean(pd.extract), 55),
          source:     'Wikipedia',
          title:      pd.title || title,
          url:        pd.content_urls?.desktop?.page || null,
          confidence: 0.85,
        };
      }
      return null;
    } catch { return null; }
  };
})();
