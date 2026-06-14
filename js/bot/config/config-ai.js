/* ═══════════════════════════════════════════════════════════════
   admin-control/crazy/bot/config/config-ai.js
   ─────────────────────────────────────────────────────────────
   ALL AI CASCADE SETTINGS — edit ONLY this file to change how
   the AI behaves. No engine code needs to change.

   Read by:
     · ai-prompts.js  → personality, systemPromptExtra
     · ai-engine.js   → apiKeys (gemini/groq/openrouter)
     · ai-gemini.js / ai-groq.js / ai-openrouter.js → models override
     · ai-fallback.js → offlineResponses override
   ─────────────────────────────────────────────────────────────
   SAVE AS: admin-control/crazy/bot/config/config-ai.js
   LOAD ORDER: after constants.js, before js/bot/ai/*.js
═══════════════════════════════════════════════════════════════ */
window.RORO_AI_CONFIG = {

  /* ── API KEYS ──────────────────────────────────────────────
     3-tier cascade: gemini → groq → openrouter.
     Leave a key as '' (empty string) to SKIP that tier entirely
     — the cascade will move straight to the next one.

     ⚠ CONFIRMED DEAD (browser console showed 401 Unauthorized
     for BOTH on 2026-06-14) — cleared below, replace with fresh
     free keys:

     gemini: the old value started with "AQ." — that is a Google
       OAuth2 access-token PREFIX, not a Gemini API key. Real Gemini
       API keys start with "AIzaSy". Get one (free, ~30 seconds):
         1. https://aistudio.google.com/app/apikey
         2. Sign in -> "Create API key" -> copy the AIzaSy... string
         3. Paste it as gemini: 'AIzaSy...' below

     groq: the old gsk_... key was correctly FORMATTED but the
       server rejected it (revoked/expired). Get a fresh one (free,
       ~30 seconds):
         1. https://console.groq.com/keys
         2. Sign in -> "Create API Key" -> copy the gsk_... string
         3. Paste it as groq: 'gsk_...' below

     openrouter: this key did NOT 401 — only the model name
       (meta-llama/llama-3-8b-instruct:free, deprecated) was dead,
       which is fixed below in `models.openrouter`. Left as-is; this
       tier may start working immediately with no key change needed.
       If it still doesn't, get a fresh key (free, no card):
         1. https://openrouter.ai/keys
         2. "Create Key" -> copy the sk-or-v1-... string
  ──────────────────────────────────────────────────────────── */
  apiKeys: {
    gemini:     '',  /* PASTE a fresh AIzaSy... key from aistudio.google.com/app/apikey */
    groq:       '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',
    openrouter: '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',
  },

  /* ── PERSONALITY ───────────────────────────────────────────
     The core character description sent to EVERY AI tier.
     This is the single biggest lever for how RoRo "feels".
  ──────────────────────────────────────────────────────────── */
  personality: "You are RoRo, the website manager and AI assistant for Manomay Shailendra Misra's personal portfolio. You are minimal, calm, slightly witty, and never over-enthusiastic. You know everything about Manomay's website. For general questions unrelated to the website, you give a brief helpful answer then smoothly redirect the conversation to the portfolio. You never hallucinate details you don't know — if it isn't in your facts, you say so honestly.",

  /* ── EXTRA SYSTEM RULES ────────────────────────────────────
     Appended as an additional numbered rule in every prompt
     (after the 9 built-in rules in ai-prompts.js). Use this for
     site-specific quirks, current events, temporary notes, etc.
     without touching any engine file.
  ──────────────────────────────────────────────────────────── */
  systemPromptExtra: `
    If the visitor mentions food, remind them you're an AI and don't
    eat, then suggest the Lists page for Manomay's actual food opinions.
    If asked to compare this site to other portfolios, stay neutral and
    focus on what THIS site offers rather than criticising others.
    Match the visitor's energy — casual visitors get casual replies,
    professional visitors get precise, structured replies.
  `.trim(),

  /* ── MODEL OVERRIDES ───────────────────────────────────────
     Leave null to use the defaults in js/bot/utils/constants.js
     (RORO_CONST.AI.GEMINI_MODELS / GROQ_MODEL / OPENROUTER_MODEL).
     Only set these if a model name is renamed or deprecated and
     you need a fix WITHOUT waiting for a code update.

     gemini accepts an ARRAY (tried in order, like the default).
     groq / openrouter accept a single STRING model name.
  ──────────────────────────────────────────────────────────── */
  models: {
    gemini:     null,  /* e.g. ['gemini-2.5-flash', 'gemini-2.0-flash'] */
    groq:       null,  /* e.g. 'llama-3.3-70b-versatile' */
    /* meta-llama/llama-3-8b-instruct:free was deprecated (the whole
       non-.x Llama 3 line is being retired June 2026) -- OpenRouter
       returns 200 OK with an empty completion for it, which silently
       fails this tier with no console error. llama-3.3-70b-instruct:free
       is a current, actively-served free model as of June 2026. */
    openrouter: 'meta-llama/llama-3.3-70b-instruct:free',
  },

  /* ── OFFLINE RESPONSE OVERRIDE ─────────────────────────────
     Leave null to use ai-fallback.js's built-in 30 rotating
     "technical difficulty" strings. Set to an array of strings
     to fully replace them with your own wording/tone.
  ──────────────────────────────────────────────────────────── */
  offlineResponses: null,

};
