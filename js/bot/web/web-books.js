/* ═══════════════════════════════════════════════════════════════
   js/bot/web/web-books.js  —  OpenLibrary Source (BOOKS ONLY)
   ─────────────────────────────────────────────────────────────
   ONLY used for book/author/novel queries — NEVER as a general
   knowledge fallback (OpenLibrary doesn't know companies, tech,
   sports, or current events — using it for those gives garbage).
   Confidence: 0.88 (very reliable for what it actually covers).
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/web/web-books.js
   EXPORTS: window.RoRoWebSources.books(query)
   Returns: {summary, source, confidence} | null
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.RoRoWebSources = window.RoRoWebSources || {};

  window.RoRoWebSources.books = async function (query) {
    const T = window.RoRoText;
    const C = (window.RORO_CONST && window.RORO_CONST.WEB) || {};
    const timeout = C.TIMEOUT_MS || 4000;

    try {
      /* Strip common book-question framing to improve search match */
      const cleanQuery = query
        .replace(/\b(who\s+(?:wrote|is\s+the\s+author\s+of)|tell\s+me\s+about|what\s+is|book|novel)\b/gi, '')
        .trim() || query;

      const url = 'https://openlibrary.org/search.json?q=' + encodeURIComponent(cleanQuery)
        + '&limit=1&fields=title,author_name,first_publish_year,subject';

      const r = await fetch(url, { signal: AbortSignal.timeout(timeout) });
      const d = await r.json();
      if (!d.docs || !d.docs[0] || !d.docs[0].title) return null;

      const b = d.docs[0];
      const author = b.author_name ? b.author_name[0] : 'Unknown author';
      const year   = b.first_publish_year ? ` (${b.first_publish_year})` : '';
      const subj   = b.subject ? `. Genre: ${b.subject.slice(0,2).join(', ')}` : '';

      const summary = `"${b.title}" by ${author}${year}${subj}.`;
      return { summary: T.cap(summary, 50), source: 'OpenLibrary', confidence: 0.88 };
    } catch { return null; }
  };
})();
