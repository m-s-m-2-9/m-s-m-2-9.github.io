/* ═══════════════════════════════════════════════════════════════
   js/bot/ai/ai-gemini.js  —  Gemini Tier (AI Cascade Tier 1)
   ─────────────────────────────────────────────────────────────
   Calls Google Gemini via the v1beta REST API using the
   x-goog-api-key header (the format that works with the key
   you provided — no "AIza" key needed).

   Tries multiple model names in sequence (gemini-2.0-flash first,
   falling back to 1.5-flash, then flash-latest) — if one model
   name is deprecated/unavailable, the next is tried automatically
   with NO extra delay (these are the SAME network round trip
   pattern, so total added latency is negligible on failure).

   Timeout: RORO_CONST.AI.TIMEOUT_MS (default 8000ms) for the
   ENTIRE call (all model attempts share one AbortController).

   Returns: string (AI reply text) | null (failed → next tier)
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/ai/ai-gemini.js
   EXPORTS: window.RoRoAIGemini.call(userText, systemPrompt, messages, apiKey)
   DEPENDS ON: js/bot/utils/constants.js
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  async function call(userText, systemPrompt, messages, apiKey) {
    if (!apiKey) return null;

    const AI = (window.RORO_CONST && window.RORO_CONST.AI) || {};
    const timeout = AI.TIMEOUT_MS || 8000;
    const AC = window.RORO_AI_CONFIG || {};
    const models  = (AC.models && AC.models.gemini) || AI.GEMINI_MODELS || ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);

    try {
      /* Build Gemini-format request body */
      const body = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [],
        generationConfig: {
          maxOutputTokens: AI.MAX_OUTPUT_TOKENS || 250,
          temperature:     AI.TEMPERATURE || 0.72,
        },
      };

      /* Conversation history (everything except the current message) */
      (messages || []).slice(0, -1).forEach(m => {
        body.contents.push({
          role:  m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      });

      /* Current user message */
      body.contents.push({ role: 'user', parts: [{ text: userText }] });

      /* Try each model name until one succeeds */
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
          const r = await fetch(url, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body:    JSON.stringify(body),
            signal:  ctrl.signal,
          });

          if (!r.ok) continue; /* try next model name */

          const d    = await r.json();
          const text = d?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text && text.trim().length > 5) {
            clearTimeout(timer);
            return text.trim();
          }
        } catch (e) {
          if (e.name === 'AbortError') throw e; /* whole-call timeout — bail completely */
          continue; /* this model failed, try next */
        }
      }

      clearTimeout(timer);
      return null;
    } catch {
      clearTimeout(timer);
      return null;
    }
  }

  window.RoRoAIGemini = { call, name: 'gemini' };
})();
