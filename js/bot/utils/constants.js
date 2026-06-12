/* ═══════════════════════════════════════════════════════════════
   js/bot/utils/constants.js  —  RoRo v5 Shared Constants
   ─────────────────────────────────────────────────────────────
   Single source for all magic numbers and string constants.
   Every other file imports from here via window.RORO_CONST.
   Edit numbers here — they update everywhere automatically.
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/utils/constants.js
   LOAD ORDER: First script in the bot stack.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  window.RORO_CONST = {

    /* ── VERSION ───────────────────────────────────────────── */
    VERSION: '5.0.0',

    /* ── AI CASCADE ────────────────────────────────────────── */
    AI: {
      TIMEOUT_MS:       8000,    /* Max ms per AI tier before moving to next */
      MAX_OUTPUT_TOKENS: 250,    /* Max tokens in AI reply */
      TEMPERATURE:      0.72,   /* Randomness — 0.7–0.8 is conversational */
      MAX_HISTORY:      10,     /* Last N messages sent to AI as context */
      GEMINI_MODELS: [          /* Try in order — first success wins */
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-flash-latest',
      ],
      GROQ_MODEL:       'llama-3.1-8b-instant',
      OPENROUTER_MODEL: 'meta-llama/llama-3-8b-instruct:free',
    },

    /* ── WEB SEARCH ────────────────────────────────────────── */
    WEB: {
      TIMEOUT_MS:        4000,  /* Per-source timeout */
      CACHE_TTL_MS:      24 * 60 * 60 * 1000,  /* 24 hours */
      CACHE_MAX_ENTRIES: 500,   /* Evict oldest when exceeded */
      MIN_CONFIDENCE:    0.65,  /* Below this → don't show web result */
    },

    /* ── SAFETY ────────────────────────────────────────────── */
    SAFETY: {
      GOODWILL_START:       100,
      GOODWILL_MIN:         0,
      GOODWILL_MAX:         100,
      GOODWILL_PER_CLEAN:   2,    /* +2 per clean message */
      GOODWILL_SOFT:       -5,
      GOODWILL_HARD:       -20,
      GOODWILL_EXTREME:    -40,
      GOODWILL_LIMIT:      -15,
      HARD_PAUSE_THRESHOLD: 3,    /* Hard abuses before 5s pause */
      HARD_PAUSE_ESCALATE:  6,    /* Hard abuses before 10s pause */
      LIMIT_PAUSE_THRESHOLD:5,    /* Limit abuses before 10s pause */
      SPAM_PAUSE_THRESHOLD: 3,    /* Spam hits before 3s pause */
      GUARDED_THRESHOLD:    30,   /* Goodwill below this = guarded mode */
      RECOVERY_STREAK:      5,    /* Clean messages to recover from guarded */
    },

    /* ── SEARCH / RETRIEVAL ────────────────────────────────── */
    SEARCH: {
      MIN_SCORE_STRONG:   12,   /* Score >= this = strong website match */
      MIN_SCORE_WEAK:     5,    /* Score >= this = weak match (use AI) */
      MAX_RESULTS:        3,    /* Top N results to consider */
      YEAR_TEXT_CAP:      150,  /* Max chars from journey year entries */
      PAGE_TEXT_CAP:      500,  /* Max chars from page raw text */
      CONTEXT_MAX_CHARS:  3000, /* Max chars in AI system prompt context */
    },

    /* ── MEMORY ────────────────────────────────────────────── */
    MEMORY: {
      EXPIRY_DAYS:    90,
      EXPIRY_MS:      90 * 24 * 60 * 60 * 1000,
      ANTI_LOOP_SIZE: 20,       /* Track last N responses for anti-loop */
      TOPIC_MAX:      15,       /* Track last N topics in session */
      ENTITY_MAX:     5,        /* Track last N entities in session */
    },

    /* ── ANALYTICS ─────────────────────────────────────────── */
    ANALYTICS: {
      MAX_LOG_ENTRIES: 500,    /* Per log type */
    },

    /* ── UI / TIMING ───────────────────────────────────────── */
    UI: {
      TYPING_MIN_DELAY_MS:   380,
      TYPING_MAX_DELAY_MS:   2000,
      TYPING_CHAR_MULT:      12,
      TYPING_SPEED_MS:       9,
      TYPING_RANDOM_MS:      18,
      THINKING_SWITCH_MS:    3000,  /* When to change 3-dot text to "Thinking..." */
      IDLE_MINUTES:          3,
      OFFLINE_MINUTES:       6,
      IDLE_CHECK_MS:         20000,
      TICKER_SECONDS:        60,
    },

    /* ── INTENT SCORING ────────────────────────────────────── */
    INTENT: {
      MIN_CONFIDENCE:       0.55,  /* Below this = UNKNOWN */
      WEBSITE_BOOST:        0.15,  /* Added if website entity detected */
      WEIGHTED_THRESHOLD:   0.7,   /* Minimum for high-confidence routing */
    },

    /* ── STORAGE KEYS ──────────────────────────────────────── */
    STORAGE: {
      USER_KEY:     'roroUser',      /* localStorage */
      SAFETY_PREFIX:'roro_s_',       /* sessionStorage */
      ANALYTICS_KEY:'roro_analytics',/* localStorage */
    },

  };

  /* Freeze to prevent accidental mutation */
  Object.freeze(window.RORO_CONST);
  Object.freeze(window.RORO_CONST.AI);
  Object.freeze(window.RORO_CONST.WEB);
  Object.freeze(window.RORO_CONST.SAFETY);

})();
