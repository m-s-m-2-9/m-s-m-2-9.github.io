/* ═══════════════════════════════════════════════════════════════
   js/bot/ai/ai-engine.js  —  3-Tier AI Cascade Orchestrator
   ─────────────────────────────────────────────────────────────
   THE SINGLE ENTRY POINT for AI-generated responses.

   Cascade order (each ~8s timeout via constants.js):
     Tier 1: Gemini      (ai-gemini.js)
     Tier 2: Groq        (ai-groq.js)        \u2014 only if Tier 1 fails
     Tier 3: OpenRouter  (ai-openrouter.js)  \u2014 only if Tiers 1-2 fail
     Tier 4: Web search  (web-engine.js)     \u2014 only if confidence \u2265 0.65
     Tier 5: Site-only   (ai-fallback.basicAnswer) \u2014 zero AI/network
     Tier 6: Offline str (ai-fallback.getOffline)  \u2014 absolute last resort

   NO PUTER.JS \u2014 removed entirely. No auth popups, ever.

   Returns: { text: string, tier: string, navigate?: string, source?: string }

   The "tier" field lets the diagnostics panel (future session)
   show exactly which system answered \u2014 critical for debugging
   "why did it answer THIS way" per the user's request for a
   developer diagnostics view.
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/ai/ai-engine.js
   EXPORTS: window.RoRoAIEngine = { run, getKeys }
   DEPENDS ON: ai-prompts.js, ai-fallback.js, ai-gemini.js,
               ai-groq.js, ai-openrouter.js, web-engine.js,
               RORO_AI_CONFIG, RORO_CONST
   LOAD ORDER: must load AFTER all ai-* and web-* files above
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function getKeys() {
    const AC = window.RORO_AI_CONFIG || {};
    const k  = AC.apiKeys || {};
    return {
      gemini:     k.gemini     || '',
      groq:       k.groq       || '',
      openrouter: k.openrouter || '',
    };
  }

  async function run(userText, contextData) {
    const P  = window.RoRoAIPrompts;
    const FB = window.RoRoAIFallback;

    if (!P) {
      return { text: FB ? FB.getOffline() : "I'm having technical difficulty. Try again.", tier: 'offline' };
    }

    const systemPrompt = P.buildSystemPrompt(contextData);
    const messages     = P.buildMessages(userText);
    const keys         = getKeys();

    /* ── TIER 1: GEMINI ──────────────────────────────────────── */
    if (window.RoRoAIGemini && keys.gemini) {
      const r = await window.RoRoAIGemini.call(userText, systemPrompt, messages, keys.gemini);
      if (r) return { text: r, tier: 'gemini' };
    }

    /* ── TIER 2: GROQ ────────────────────────────────────────── */
    if (window.RoRoAIGroq && keys.groq) {
      const r = await window.RoRoAIGroq.call(userText, systemPrompt, messages, keys.groq);
      if (r) return { text: r, tier: 'groq' };
    }

    /* ── TIER 3: OPENROUTER ──────────────────────────────────── */
    if (window.RoRoAIOpenRouter && keys.openrouter) {
      const r = await window.RoRoAIOpenRouter.call(userText, systemPrompt, messages, keys.openrouter);
      if (r) return { text: r, tier: 'openrouter' };
    }

    /* ── TIER 4: WEB SEARCH (only if confident) ─────────────── */
    if (window.RoRoWebEngine) {
      try {
        const wr = await window.RoRoWebEngine.lookup(userText);
        const minConf = (window.RORO_CONST && window.RORO_CONST.WEB && window.RORO_CONST.WEB.MIN_CONFIDENCE) || 0.65;
        if (wr && wr.summary && wr.confidence >= minConf) {
          return { text: wr.summary, tier: 'web', source: wr.source };
        }
      } catch { /* ignore, fall through */ }
    }

    /* ── TIER 5: SITE-ONLY (zero AI, zero network) ──────────── */
    if (FB && typeof FB.basicAnswer === 'function') {
      const basic = FB.basicAnswer(userText);
      if (basic && basic.messages && basic.messages[0]) {
        return { text: basic.messages[0], tier: 'offline_site', navigate: basic.navigate };
      }
    }

    /* ── TIER 6: ABSOLUTE LAST RESORT ────────────────────────── */
    return { text: FB ? FB.getOffline() : "I'm having technical difficulty. Try again.", tier: 'offline' };
  }

  window.RoRoAIEngine = { run, getKeys };
})();
