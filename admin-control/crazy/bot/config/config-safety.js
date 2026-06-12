
/* ═══════════════════════════════════════════════════════════════
   admin-control/crazy/bot/config/config-safety.js
   ─────────────────────────────────────────────────────────────
   ADDITIONAL safety patterns and responses.

   IMPORTANT: everything in here is ADDED ON TOP OF the base
   patterns/responses already built into
   js/bot/safety/safety-engine.js — NOTHING is replaced or removed.
   (safety-engine.js concatenates BASE_PATTERNS[tier] + this file's
   patterns[tier], and BASE_RESPONSES[pool] + this file's
   responses[pool].)

   Use this file for:
     · Extra regional slang / Hindi-Hinglish abuse variants
     · More response variety so long sessions don't feel repetitive
     · Extra calming pause-texts (shown while input is disabled)

   Leave any array empty [] to add nothing for that category —
   the base engine behaviour is unaffected either way.
   ─────────────────────────────────────────────────────────────
   SAVE AS: admin-control/crazy/bot/config/config-safety.js
   LOAD ORDER: before js/bot/safety/safety-engine.js
═══════════════════════════════════════════════════════════════ */
window.RORO_SAFETY_CONFIG = {

  /* ── ADDITIONAL PATTERNS (regex, case-insensitive) ────────── */
  patterns: {

    /* Mild insults — deflected casually, no goodwill penalty beyond -5 */
    soft: [
      /\b(bekar|bakwaas|bakwas|faltu|nautanki|chutiyapa\s+hai)\b/i,
      /\b(ye\s+kya\s+bakchodi|ye\s+kya\s+bekar\s+(?:hai|cheez))\b/i,
      /\b(useless\s+bot|pathetic\s+bot|garbage\s+ai)\b/i,
    ],

    /* Stronger abuse — escalates to timed pauses on repetition */
    hard: [
      /\b(saala|saale|kameena|kamini|harami|haraami)\b/i,
      /\b(tu\s+pagal\s+hai|teri\s+to|nikal\s+yahan\s+se)\b/i,
    ],

    /* Extreme — hard stop + 10s pause, no extra patterns needed
       beyond the base file's CSAM/grooming/violence coverage.
       Add more here ONLY if a genuinely new extreme pattern emerges. */
    extreme: [],

    /* Weapon/harm instruction requests — base file already covers
       "how to make a bomb" etc. Add region-specific phrasing here. */
    limit: [
      /\b(bomb\s+banane\s+ka\s+tarika|hathiyar\s+kaise\s+banaye)\b/i,
    ],

    /* Extra "don't reveal this" triggers beyond password/unlock-code */
    locked: [
      /\b(birth\s*time|exact\s+hospital|kis\s+hospital\s+mein\s+paida)\b/i,
      /\b(real\s+address|ghar\s+ka\s+address|exact\s+location\s+of\s+his\s+house)\b/i,
    ],

    /* Extra spam regex — base file already handles short random
       strings and keyboard mashes. Add new junk patterns here. */
    spam: [],

  },

  /* ── ADDITIONAL RESPONSES (appended to the rotation pool) ─── */
  responses: {

    soft: [
      "Noted. Anyway — what can I help with?",
      "Heard. Moving on — what do you need?",
      "Ouch. Okay, what's the actual question?",
    ],

    hard: [
      "Let's reset. What did you actually want to know?",
      "Alright, that's enough of that. What's the real question?",
      "Taking a breath. Ask me something real when you're ready.",
    ],

    extreme: [],

    limit_good: [
      "Bold ask for a portfolio bot. I'll pass — but ask me about Manomay's actual work instead.",
    ],

    limit_bad: [],

    locked: [
      "That detail stays private — happy to help with something else on the site.",
      "Not something I'll share. Plenty of other things I can help with though.",
    ],

    spam: [
      "Random characters detected. Try a real word or two?",
    ],

    spam_escalated: [],

  },

  /* ── ADDITIONAL PAUSE TEXTS (shown on disabled input) ─────── */
  pauseTexts: [
    "Ek second...",
    "Thoda ruko...",
    "Almost there, hold on...",
    "Saans lo, phir baat karte hain...",
  ],

};
