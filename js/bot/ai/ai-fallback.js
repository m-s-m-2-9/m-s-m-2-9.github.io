/* ═══════════════════════════════════════════════════════════════
   js/bot/ai/ai-fallback.js  —  Hardcoded Fallbacks (Last Resort)
   ─────────────────────────────────────────────────────────────
   Reached ONLY when Gemini + Groq + OpenRouter + Web search ALL
   fail (e.g. no internet, all APIs down simultaneously).

   TWO layers of fallback:

   1. basicAnswer(query) — ZERO-AI, ZERO-NETWORK site navigator.
      Matches the query against RORO_KNOWLEDGE.projects and
      RORO_CONFIG.pages/social using simple keyword matching.
      This means even if EVERY API is down, RoRo can still:
        · Tell you about a project
        · Navigate to a page
        · Give you a social link
      This directly solves "bot completely dies when AI is down."

   2. getOffline() — 30 rotating "technical difficulty" strings.
      Used only when basicAnswer() also finds nothing.

   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/ai/ai-fallback.js
   EXPORTS: window.RoRoAIFallback = { OFFLINE_RESPONSES, getOffline,
            basicAnswer }
   DEPENDS ON: window.RORO_CONFIG (admin config),
               window.RORO_KNOWLEDGE (admin knowledge — optional)
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 30 rotating "something went wrong" strings ──────────── */
  const OFFLINE_RESPONSES = [
    "I'm experiencing some technical difficulty right now. Try again in a moment.",
    "Something went sideways on my end. Give it another shot.",
    "Seems like I'm having connectivity issues. One more try should do it.",
    "My systems are a bit backed up right now. Try again shortly.",
    "Technical hiccup. I'll be back in a moment \u2014 try again.",
    "Connection dropped somewhere in the chain. Give me a second.",
    "I hit a wall on that one. Try asking again.",
    "Something's not cooperating right now. One more try.",
    "Running into an issue I can't resolve immediately. Try again soon.",
    "Technical difficulty \u2014 not your question, my end. Try again.",
    "I'm temporarily limited. Give it another go in a moment.",
    "Connectivity issue on my side. Retry in a few seconds.",
    "That one didn't go through cleanly. Try once more.",
    "I ran into something unexpected. Ask me again.",
    "My response pipeline hit a snag. One more try should work.",
    "Having a moment of technical difficulty. Won't be long.",
    "Something interrupted that. Try the same question again.",
    "Not able to get a clear response right now. Try shortly.",
    "Ran into a technical wall. I'll be ready again in a moment.",
    "Temporary issue on my end. Give me one more shot at that.",
    "Systems are working through something. Try again in a sec.",
    "That request didn't complete. Fire it again.",
    "A brief technical hiccup. I'll sort it \u2014 try again.",
    "Not able to reach my knowledge systems right now. Retry.",
    "Connection unstable. Give it one more try.",
    "Something dropped mid-process. Ask me again.",
    "Technical difficulty. This doesn't happen often \u2014 try again.",
    "I'm temporarily running limited. Try the question again.",
    "A system I need is currently unavailable. Retry shortly.",
    "Connectivity problem \u2014 my end, not yours. Try once more.",
  ];

  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function getOffline() {
    const AC = window.RORO_AI_CONFIG || {};
    const pool = (AC.offlineResponses && AC.offlineResponses.length) ? AC.offlineResponses : OFFLINE_RESPONSES;
    return rnd(pool);
  }

  /* ── ZERO-AI SITE NAVIGATOR ───────────────────────────────── */
  /* Used when AI + web both fail. Keeps RoRo functional as a
     basic site guide using only local config — no network at all. */
  function basicAnswer(query) {
    const C = window.RORO_CONFIG    || {};
    const K = window.RORO_KNOWLEDGE || {};
    const lower = query.toLowerCase();

    /* 1. Pages — match by id or label */
    for (const [id, pg] of Object.entries(C.pages || {})) {
      const label = (pg.label || id).toLowerCase();
      if (lower.includes(id) || (label.length > 2 && lower.includes(label))) {
        return {
          messages: [pg.summary || `${pg.label}: a section of this site.`],
          navigate: id,
        };
      }
    }

    /* 2. Projects — prefer new RORO_KNOWLEDGE.projects, fall back to old config */
    const projects = (K.projects && K.projects.length)
      ? K.projects
      : Object.values(C.projects || {});

    for (const p of projects) {
      const kws   = p.keywords || [];
      const title = (p.title || '').toLowerCase();
      const matchKw = kws.some(k => lower.includes(String(k).toLowerCase()));
      const matchTitle = title.length > 2 && lower.includes(title);
      if (matchKw || matchTitle) {
        const highlights = (p.highlights || []).slice(0, 3).join('. ');
        const desc = p.description || highlights || '';
        const status = p.status || p.year || '';
        return { messages: [`${p.title} \u2014 ${p.type || 'Project'}${status ? ' (' + status + ')' : ''}. ${desc}`.trim()] };
      }
    }

    /* 3. Social links */
    const social = (K.social && Object.keys(K.social).length) ? K.social : (C.social || {});
    for (const [id, s] of Object.entries(social)) {
      if (lower.includes(id) && s && (s.url || s.active !== false)) {
        const url = s.url;
        if (url && url !== '#') return { messages: [`${id.charAt(0).toUpperCase() + id.slice(1)}: ${s.handle || ''} \u2014 ${url}`.trim()] };
      }
    }

    /* 4. Owner identity fallback (last resort site-only answer) */
    if (/\b(who|manomay|about)\b/i.test(lower)) {
      const id = K.identity || (C.owner || {});
      if (id.fullName || id.name) {
        return { messages: [`${id.fullName || id.name} \u2014 ${id.tagline || ''}`.trim()] };
      }
    }

    return null;
  }

  window.RoRoAIFallback = { OFFLINE_RESPONSES, getOffline, basicAnswer };
})();
