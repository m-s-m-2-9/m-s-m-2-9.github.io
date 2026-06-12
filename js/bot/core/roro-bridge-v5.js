/* ═══════════════════════════════════════════════════════════════
   js/bot/core/roro-bridge-v5.js  —  v5 Integration Bridge
   ─────────────────────────────────────────────────────────────
   WITHOUT THIS FILE, every new v5 file (utils/, safety/, web/,
   ai/, admin knowledge/config) is correctly written but INERT —
   the existing manager-roro.js still calls its own internal
   AICascade and the existing roro-intelligence.js still uses its
   own hardcoded RecruiterEngine.SKILLS map.

   This file makes everything LIVE with ZERO edits to existing
   files, by patching two things AFTER they're defined but BEFORE
   the bot is instantiated:

   1. RoRoManager.prototype._runCascadeAsync
      → now calls window.RoRoAIEngine.run() (the new 6-tier
        cascade: Gemini → Groq → OpenRouter → Web → Site-only →
        Offline) instead of the old internal AICascade.
      → adds `currentPage` to contextData so ai-prompts.js can
        tell the AI what the visitor is looking at.
      → handles `result.navigate` (Tier 5 / offline_site can ask
        the bot to navigate even with zero AI/network).
      → UI behaviour (typing dots → "Thinking.../Searching..." at
        3s, then real message) is preserved EXACTLY.

   2. RoRoIntelligence.RecruiterEngine.SKILLS
      → merged (Object.assign) with RORO_KNOWLEDGE
        .getRecruiterSkillsMap() from knowledge/skills.js.
      → removes the need for ANY hardcoded {has:false} entries —
        from now on, knowledge/skills.js is the only file anyone
        ever edits for skills, and BOTH the instant recruiter
        shortcut AND the full AI path read from it.

   Runs synchronously at script-load time (prototype patches don't
   need DOMContentLoaded — they just need to happen before
   `new RoRoManager()` runs, which itself happens on
   DOMContentLoaded inside manager-roro.js).
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/core/roro-bridge-v5.js
   LOAD ORDER: VERY LAST — after manager-roro.js and
               roro-intelligence.js and ALL new v5 files.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. Patch RecruiterEngine.SKILLS from knowledge/skills.js ── */
  try {
    const INTL = window.RoRoIntelligence;
    const K    = window.RORO_KNOWLEDGE;
    if (INTL && INTL.RecruiterEngine && INTL.RecruiterEngine.SKILLS
        && K && typeof K.getRecruiterSkillsMap === 'function') {
      Object.assign(INTL.RecruiterEngine.SKILLS, K.getRecruiterSkillsMap());
    }
  } catch (e) { /* non-fatal — old hardcoded SKILLS map remains as fallback */ }

  /* ── 2. Patch _runCascadeAsync to use the new AI engine ──────── */
  if (typeof window.RoRoManager === 'function' && window.RoRoManager.prototype && window.RoRoAIEngine) {

    window.RoRoManager.prototype._runCascadeAsync = function (text, contextData) {
      const INTL = window.RoRoIntelligence;
      const FB   = window.RoRoAIFallback;
      const UI   = (window.RORO_CONST && window.RORO_CONST.UI) || {};

      /* Enrich context with the page the visitor is currently viewing */
      contextData = Object.assign({}, contextData, { currentPage: this._currentPage() });

      /* Same 3-dot typing indicator as before */
      const typing = this._addTypingIndicator();
      this._scrollBottom();

      /* After ~3s, swap dots for "Searching..." / "Thinking..." text
         INSIDE the same bubble — never a separate chat message */
      const isDeepSearch = /\b(is|are|does|do|will|can|has|have|bmtc|rcb|ipl|government|policy|news|latest)\b/i.test(text);
      const switchMs = UI.THINKING_SWITCH_MS || 3000;
      const changeTimer = setTimeout(() => {
        const bubble = typing.querySelector('.roro-bubble');
        if (bubble && typing.parentNode) {
          bubble.innerHTML = `<span style="font-size:0.78rem;opacity:0.7">${isDeepSearch ? 'Searching...' : 'Thinking...'}</span>`;
        }
      }, switchMs);

      if (INTL && INTL.SessionMemory) INTL.SessionMemory.logInternet(text);

      window.RoRoAIEngine.run(text, contextData).then(result => {
        clearTimeout(changeTimer);
        if (typing.parentNode) typing.remove();

        const aiText = (result && result.text) ? result.text : (FB ? FB.getOffline() : "I'm having technical difficulty. Try again.");

        if (INTL && INTL.SessionMemory) {
          INTL.SessionMemory.addMessage('bot', aiText);
          INTL.SessionMemory.trackResponse(aiText);
        }

        this._addBotMsg(aiText, null, () => {});
        this._scrollBottom();

        /* Tier 5 (offline_site) may include a navigation target even
           with zero AI/network \u2014 honour it after the message types out */
        if (result && result.navigate) {
          this._enqueue(null, () => {
            this._go(result.navigate);
            if (this._userData && window.MemoryEngine) {
              this._userData = window.MemoryEngine.trackPage(this._userData, result.navigate);
              window.MemoryEngine.save(this._userData);
            }
            if (INTL) INTL.SessionMemory.addTopic(result.navigate);
          });
        }

        this._enqueue(null, () => this._renderOptions(this._getSmartOptions()));
      }).catch(() => {
        clearTimeout(changeTimer);
        if (typing.parentNode) typing.remove();
        this._addBotMsg(FB ? FB.getOffline() : "I'm having technical difficulty. Try again.", null, () => {});
        this._scrollBottom();
      });
    };
  }

})();
