/* ═══════════════════════════════════════════════════════════════════
   js/bot/roro-web.js  —  RoRo Internet Lookup Module v3.0
   ─────────────────────────────────────────────────────────────────
   Free APIs only. No keys. No costs.

   Sources (in priority order):
   1. DuckDuckGo Instant Answer API
   2. Wikipedia REST API
   3. OpenLibrary (books only + general)
   4. Math evaluator (inline, no network)

   Session cache prevents repeat calls within 30 minutes.
   Concurrent deduplication prevents double-firing same query.

   Exports: window.RoRoWeb = { lookup, tryMath, clearCache, lookupBook }
   ─────────────────────────────────────────────────────────────────
   NO UI CHANGES. NO VISUAL CHANGES. ENGINE ONLY.
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════
     CACHE + DEDUP
  ════════════════════════════════════════════════════════════════ */

  const _cache  = new Map(); /* key → { summary, source, ts } */
  const _flight = new Map(); /* key → Promise (prevent double calls) */
  const TTL     = 30 * 60 * 1000; /* 30 minutes */

  function _key(q) {
    return q.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Cap to N words */
  function _cap(text, n) {
    n = n || 60;
    if (!text) return '';
    const w = text.trim().split(/\s+/);
    return w.length <= n ? text.trim() : w.slice(0, n).join(' ') + '\u2026';
  }

  /* Clean Wikipedia/DDG artifacts */
  function _clean(text) {
    if (!text) return '';
    return text
      .replace(/\s*\(listen\)/gi, '')
      .replace(/\[\d+\]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  /* ════════════════════════════════════════════════════════════════
     SOURCE 1: DUCKDUCKGO INSTANT ANSWER
     Free, no key, CORS-friendly via callback param trick.
     Returns abstract text, direct answers, or first related topic.
  ════════════════════════════════════════════════════════════════ */

  async function _ddg(query) {
    try {
      const url = 'https://api.duckduckgo.com/?q='
        + encodeURIComponent(query)
        + '&format=json&no_html=1&skip_disambig=1&no_redirect=1';

      const r = await fetch(url, {
        signal: AbortSignal.timeout(4000),
      });
      const d = await r.json();

      /* Direct answer (e.g. "What is 2+2") */
      if (d.Answer && String(d.Answer).length > 2) {
        return { summary: _cap(_clean(String(d.Answer)), 50), source: 'DuckDuckGo' };
      }

      /* Abstract text (Wikipedia-sourced) */
      if (d.AbstractText && d.AbstractText.length > 30) {
        return { summary: _cap(_clean(d.AbstractText), 60), source: 'DuckDuckGo' };
      }

      /* Infobox entries */
      if (d.Infobox && d.Infobox.content && d.Infobox.content.length > 0) {
        const first = d.Infobox.content.find(c => c.value && c.value.length > 10);
        if (first) {
          return { summary: _cap(_clean(first.value), 50), source: 'DuckDuckGo' };
        }
      }

      /* Related topics fallback */
      if (d.RelatedTopics && d.RelatedTopics.length > 0) {
        const first = d.RelatedTopics.find(t => t.Text && t.Text.length > 20);
        if (first) {
          return { summary: _cap(_clean(first.Text), 50), source: 'DuckDuckGo' };
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /* ════════════════════════════════════════════════════════════════
     SOURCE 2: WIKIPEDIA REST API
     Search → get page summary. Very reliable for factual queries.
  ════════════════════════════════════════════════════════════════ */

  async function _wiki(query) {
    try {
      /* Step 1: Search for best matching page title */
      const searchUrl = 'https://en.wikipedia.org/w/api.php?'
        + 'action=query&list=search&srsearch='
        + encodeURIComponent(query)
        + '&srlimit=1&format=json&origin=*';

      const sr = await fetch(searchUrl, { signal: AbortSignal.timeout(4000) });
      const sd = await sr.json();

      const title = sd?.query?.search?.[0]?.title;
      if (!title) return null;

      /* Step 2: Get page summary */
      const summaryUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
        + encodeURIComponent(title);

      const pr = await fetch(summaryUrl, { signal: AbortSignal.timeout(4000) });
      const pd = await pr.json();

      if (pd.extract && pd.extract.length > 30) {
        return {
          summary: _cap(_clean(pd.extract), 60),
          source: 'Wikipedia',
          title: pd.title || title,
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  /* ════════════════════════════════════════════════════════════════
     SOURCE 3: OPENLIBRARY
     Used for book queries AND as a general fallback for topics
     that have related reading material.
  ════════════════════════════════════════════════════════════════ */

  async function _openLibrary(query) {
    try {
      const url = 'https://openlibrary.org/search.json?q='
        + encodeURIComponent(query)
        + '&limit=1&fields=title,author_name,first_publish_year,subject';

      const r = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const d = await r.json();

      if (d.docs && d.docs.length > 0) {
        const book = d.docs[0];
        if (!book.title) return null;

        const author = book.author_name ? book.author_name[0] : 'Unknown author';
        const year   = book.first_publish_year || '';
        const subj   = book.subject ? book.subject.slice(0, 3).join(', ') : '';

        let summary = `"${book.title}" by ${author}`;
        if (year) summary += ` (${year})`;
        if (subj) summary += `. Topics: ${subj}.`;

        return { summary: _cap(summary, 50), source: 'OpenLibrary' };
      }

      return null;
    } catch {
      return null;
    }
  }

  /* ════════════════════════════════════════════════════════════════
     BOOK-SPECIFIC LOOKUP
     Used when classifier detects a book question.
     Tries OpenLibrary first, then falls back to DDG/Wiki.
  ════════════════════════════════════════════════════════════════ */

  async function lookupBook(query) {
    const key = 'book_' + _key(query);

    if (_cache.has(key)) {
      const c = _cache.get(key);
      if (Date.now() - c.ts < TTL) return c;
    }

    let result = await _openLibrary(query);
    if (!result) result = await _ddg(query);
    if (!result) result = await _wiki(query);

    if (result) {
      result.ts = Date.now();
      _cache.set(key, result);
    }

    return result;
  }

  /* ════════════════════════════════════════════════════════════════
     MAIN LOOKUP FUNCTION
     Tries DDG first (fastest), then Wikipedia, then OpenLibrary.
     Deduplicates concurrent calls for same query.
  ════════════════════════════════════════════════════════════════ */

  async function lookup(query) {
    const key = _key(query);

    /* Cache hit */
    if (_cache.has(key)) {
      const c = _cache.get(key);
      if (Date.now() - c.ts < TTL) return c;
    }

    /* Dedup: if same query is already in-flight, return same Promise */
    if (_flight.has(key)) return _flight.get(key);

    const p = (async () => {
      let result = null;

      /* Try all 3 sources in sequence */
      result = await _ddg(query);

      if (!result) {
        result = await _wiki(query);
      }

      if (!result) {
        /* OpenLibrary as final fallback for general queries */
        result = await _openLibrary(query);
      }

      if (result) {
        result.ts = Date.now();
        _cache.set(key, result);
      }

      _flight.delete(key);
      return result;
    })();

    _flight.set(key, p);
    return p;
  }

  /* ════════════════════════════════════════════════════════════════
     MATH EVALUATOR
     Pure inline — no network. No AI tokens.
     Handles: 2+2, 100/4, 5^3, 15% of 200, etc.
  ════════════════════════════════════════════════════════════════ */

  function tryMath(expr) {
    try {
      /* Clean to safe math characters only */
      let clean = String(expr)
        .replace(/[^0-9\s\+\-\*\/\.\(\)%\^]/g, '')
        .trim();

      if (!clean || clean.length > 60) return null;

      /* Handle percentage: "15% of 200" → "15/100*200" */
      clean = clean.replace(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/gi, '($1/100*$2)');

      /* Handle power: 5^3 → 5**3 */
      clean = clean.replace(/\^/g, '**');

      /* eslint-disable no-new-func */
      const result = Function('"use strict"; return (' + clean + ')')();
      /* eslint-enable no-new-func */

      if (typeof result === 'number' && isFinite(result)) {
        return Number.isInteger(result)
          ? String(result)
          : result.toFixed(8).replace(/\.?0+$/, '');
      }

      return null;
    } catch {
      return null;
    }
  }

  /* ════════════════════════════════════════════════════════════════
     UTILITIES
  ════════════════════════════════════════════════════════════════ */

  function clearCache() {
    _cache.clear();
  }

  /* ════════════════════════════════════════════════════════════════
     EXPORT
  ════════════════════════════════════════════════════════════════ */

  window.RoRoWeb = {
    lookup,
    lookupBook,
    tryMath,
    clearCache,
  };

})();
