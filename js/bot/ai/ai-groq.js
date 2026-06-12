/* ═══════════════════════════════════════════════════════════════
   js/bot/ai/ai-groq.js  —  Groq Tier (AI Cascade Tier 2)
   ─────────────────────────────────────────────────────────────
   Called ONLY if Gemini (Tier 1) fails or times out.
   Groq's OpenAI-compatible chat completions endpoint — extremely
   fast inference (often <1s), generous free tier.

   Model: RORO_CONST.AI.GROQ_MODEL (default: llama-3.1-8b-instant)
   Timeout: RORO_CONST.AI.TIMEOUT_MS (default 8000ms)

   Returns: string (AI reply text) | null (failed → next tier)
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/ai/ai-groq.js
   EXPORTS: window.RoRoAIGroq.call(userText, systemPrompt, messages, apiKey)
   DEPENDS ON: js/bot/utils/constants.js
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  async function call(userText, systemPrompt, messages, apiKey) {
    if (!apiKey) return null;

    const AI = (window.RORO_CONST && window.RORO_CONST.AI) || {};
    const timeout = AI.TIMEOUT_MS || 8000;
    const AC = window.RORO_AI_CONFIG || {};
    const model   = (AC.models && AC.models.groq) || AI.GROQ_MODEL || 'llama-3.1-8b-instant';

    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);

    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + apiKey,
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

  window.RoRoAIGroq = { call, name: 'groq' };
})();
