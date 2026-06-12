/* ═══════════════════════════════════════════════════════════════
   js/bot/ai/ai-openrouter.js  —  OpenRouter Tier (AI Cascade Tier 3)
   ─────────────────────────────────────────────────────────────
   Called ONLY if Gemini AND Groq both fail or time out.
   OpenRouter's free-tier Llama model — the last AI tier before
   falling back to web search and hardcoded responses.

   Model: RORO_CONST.AI.OPENROUTER_MODEL
          (default: meta-llama/llama-3-8b-instruct:free)
   Timeout: RORO_CONST.AI.TIMEOUT_MS (default 8000ms)

   HTTP-Referer and X-Title headers are required by OpenRouter's
   free tier for attribution — set automatically from the page URL.

   Returns: string (AI reply text) | null (failed → web fallback)
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/ai/ai-openrouter.js
   EXPORTS: window.RoRoAIOpenRouter.call(userText, systemPrompt, messages, apiKey)
   DEPENDS ON: js/bot/utils/constants.js
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  async function call(userText, systemPrompt, messages, apiKey) {
    if (!apiKey) return null;

    const AI = (window.RORO_CONST && window.RORO_CONST.AI) || {};
    const timeout = AI.TIMEOUT_MS || 8000;
    const AC = window.RORO_AI_CONFIG || {};
    const model   = (AC.models && AC.models.openrouter) || AI.OPENROUTER_MODEL || 'meta-llama/llama-3-8b-instruct:free';

    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);

    try {
      let referer = 'https://manomay-portfolio.local';
      try { referer = window.location.origin || referer; } catch {}

      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + apiKey,
          'HTTP-Referer':  referer,
          'X-Title':       'RoRo \u2014 MSM Portfolio',
        },
        body: JSON.stringify({
          model,
          max_tokens:  AI.MAX_OUTPUT_TOKENS || 250,
          temperature: AI.TEMPERATURE || 0.72,
          messages: [
            { role: 'system', content: systemPrompt },
            ...(messages || []),
          ],
        }),
        signal: ctrl.signal,
      });

      clearTimeout(timer);
      if (!r.ok) return null;

      const d    = await r.json();
      const text = d?.choices?.[0]?.message?.content;
      return (text && text.trim().length > 5) ? text.trim() : null;
    } catch {
      clearTimeout(timer);
      return null;
    }
  }

  window.RoRoAIOpenRouter = { call, name: 'openrouter' };
})();
