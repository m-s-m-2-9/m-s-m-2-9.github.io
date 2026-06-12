/* ═══════════════════════════════════════════════════════════════
   js/bot/web/web-ddg.js  —  DuckDuckGo Instant Answer (BACKUP ONLY)
   ─────────────────────────────────────────────────────────────
   DDG Instant Answers are weak for modern/current topics.
   Used ONLY as a last-resort backup, never primary.
   Good for: direct numeric answers, simple disambiguation.
   Confidence: 0.7 (lower than Wikipedia/Wikidata on purpose —
   web-engine picks the highest-confidence result, so DDG only
   wins when nothing better responds).
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/web/web-ddg.js
   EXPORTS: window.RoRoWebSources.ddg(query)
   Returns: {summary, source, confidence} | null
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.RoRoWebSources = window.RoRoWebSources || {};

  window.RoRoWebSources.ddg = async function (query) {
    const T = window.RoRoText;
    const C = (window.RORO_CONST && window.RORO_CONST.WEB) || {};
    const timeout = C.TIMEOUT_MS || 4000;

    try {
      const url = 'https://api.duckduckgo.com/?q=' + encodeURIComponent(query)
        + '&format=json&no_html=1&skip_disambig=1&no_redirect=1';

      const r = await fetch(url, { signal: AbortSignal.timeout(timeout) });
      const d = await r.json();

      /* Direct answer (e.g. "2+2", unit conversions) */
      if (d.Answer && String(d.Answer).length > 2) {
        return { summary: T.cap(T.clean(String(d.Answer)), 45), source: 'DuckDuckGo', confidence: 0.72 };
      }

      /* Abstract — but only if it's reasonably topical, not a tangential match */
      if (d.AbstractText && d.AbstractText.length > 30) {
        return { summary: T.cap(T.clean(d.AbstractText), 55), source: 'DuckDuckGo', confidence: 0.65 };
      }

      return null;
    } catch { return null; }
  };
})();
