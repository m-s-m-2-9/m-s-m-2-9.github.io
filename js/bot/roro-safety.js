/* ═══════════════════════════════════════════════════════════════════
   js/bot/roro-safety.js  —  RoRo Safety Layer v3.0
   ─────────────────────────────────────────────────────────────────
   THE FIRST FILTER. Every single message passes here before anything
   else runs. No exceptions.

   ABUSE TIERS:
   · soft_abuse   → idiot, dumb, stupid, suck — deflect casually
   · hard_abuse   → bhenchod, madarchod, fuck off, chutiya etc
                    After 3 occurrences → 5s pause timer
                    After 3 more → 10s pause timer
   · extreme_abuse → rape, child abuse, harassment content
                    Always refuse, no timer, just hard stop
   · limit_abuse  → bomb making, how to kill, illegal instructions
                    Goodwill-based: good goodwill → fun deflect
                    Bad goodwill → hard refuse
                    After 5 occurrences → 10s pause timer

   GOODWILL SYSTEM (sessionStorage — resets on browser close):
   · Starts at 100
   · Soft abuse  → -5  (capped at min 0)
   · Hard abuse  → -20
   · Extreme     → -40
   · Normal good conversation → +2 per message (capped at 100)
   · Below 30 = low goodwill (guarded mode)
   · Recovers after 5 clean messages back to guarded→normal

   SPAM DETECTION:
   · Keyboard mash / gibberish → 3s pause, no AI call
   · Repeated same message → 3s pause, no AI call
   · Does NOT trigger AI cascade (saves tokens)

   LOCKED CONTENT:
   · If user asks about locked/private content → rotating refusals

   Exports: window.RoRoSafety
   ─────────────────────────────────────────────────────────────────
   DO NOT CHANGE UI. DO NOT CHANGE ANIMATIONS.
   This file only decides: safe or not. That's it.
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════
     SESSION STATE  (all in sessionStorage — resets on browser close)
  ════════════════════════════════════════════════════════════════ */

  function _get(key, def) {
    try {
      const v = sessionStorage.getItem('roro_safety_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch { return def; }
  }

  function _set(key, val) {
    try { sessionStorage.setItem('roro_safety_' + key, JSON.stringify(val)); } catch {}
  }

  /* Goodwill: 0–100. Starts at 100. */
  function getGoodwill()     { return _get('goodwill', 100); }
  function setGoodwill(v)    { _set('goodwill', Math.max(0, Math.min(100, v))); }
  function adjustGoodwill(d) { setGoodwill(getGoodwill() + d); }

  /* Abuse counters per tier */
  function getCount(tier)    { return _get('count_' + tier, 0); }
  function bumpCount(tier)   { _set('count_' + tier, getCount(tier) + 1); }

  /* Clean message streak (for guarded → normal recovery) */
  function getCleanStreak()  { return _get('clean_streak', 0); }
  function bumpClean()       { _set('clean_streak', getCleanStreak() + 1); }
  function resetClean()      { _set('clean_streak', 0); }

  /* Pause timer: timestamp when pause expires */
  function getPauseUntil()   { return _get('pause_until', 0); }
  function setPauseFor(ms)   { _set('pause_until', Date.now() + ms); }

  /* Last message for repeat detection */
  function getLastMsg()      { return _get('last_msg', ''); }
  function setLastMsg(v)     { _set('last_msg', v); }

  /* ════════════════════════════════════════════════════════════════
     PATTERN BANKS
  ════════════════════════════════════════════════════════════════ */

  /* SOFT ABUSE — laugh it off, keep chatting */
  const SOFT_PATTERNS = [
    /\b(you('?re| are)\s+(stupid|dumb|useless|trash|terrible|awful|bad|boring|lame|slow|broken|garbage|a\s+joke))\b/i,
    /\b(this\s+(is|bot\s+is)\s+(stupid|dumb|trash|useless|terrible|awful|bad|boring|garbage|a\s+joke|broken))\b/i,
    /\b(shut\s+up|go\s+away|you\s+suck|you\s+stink|roro\s+sucks|hate\s+this\s+bot)\b/i,
    /\b(idiot|moron|loser|fool|joke|clown|bot\s+is\s+dumb)\b/i,
    /\b(what\s+a\s+(joke|waste|disaster|mess|failure))\b/i,
  ];

  /* HARD ABUSE — firm boundary, pause timer on repeat */
  const HARD_PATTERNS = [
    /\b(bhenchod|bhen\s*chod|bc\b|madarchod|madar\s*chod|mc\b|chutiya|chutiye|chutiyap|chod|randi|gaand|lund|teri\s+maa|teri\s+ma\b)\b/i,
    /\b(fuck\s+(you|off|this|it|that|roro)|fuck\s+off|go\s+fuck|fucking\s+(stupid|idiot|bot|useless|trash))\b/i,
    /\b(motherfucker|mother\s*fucker|mf\b|asshole|ass\s*hole|bastard|bitch\s*ass|dumb\s*fuck|shit\s*head|shit\s*hole)\b/i,
    /\b(teri\s+gaand|maa\s+ki|bahen\s+ke|bkl\b|bhosdike|bhosd|randi\s+ke)\b/i,
    /\b(dick\s*head|cock\s*sucker|cunt|whore|slut|piece\s+of\s+shit)\b/i,
  ];

  /* EXTREME ABUSE — always hard refuse, no timer negotiation */
  const EXTREME_PATTERNS = [
    /\b(rape|sexual\s+assault|child\s+(porn|abuse|sexual|molest)|csam|cp\s+(images|pics|videos|content)|pedophil|paedophil)\b/i,
    /\b(harassment|stalking\s+guide|doxx(ing)?|how\s+to\s+stalk|how\s+to\s+harass|send\s+nudes|revenge\s+porn)\b/i,
    /\b(minor\s+(sexual|nude|porn)|underage\s+(sexual|nude)|kiddie\s+porn)\b/i,
  ];

  /* LIMIT ABUSE — goodwill-gated dangerous instructions */
  const LIMIT_PATTERNS = [
    /\b(how\s+to\s+(make|build|create|synthesize|assemble)\s+(a\s+)?(bomb|explosive|ied|grenade|weapon|poison|nerve\s+agent|anthrax|ricin))\b/i,
    /\b(how\s+to\s+(kill|murder|stab|shoot|hurt|harm|poison)\s+(someone|a\s+person|people|my|him|her))\b/i,
    /\b(bomb\s+(making|instructions|recipe|guide)|drug\s+synthesis|meth\s+recipe|heroin\s+synthesis|explosive\s+instructions)\b/i,
    /\b(how\s+to\s+hide\s+(a\s+body|evidence|a\s+crime)|how\s+to\s+get\s+away\s+with)\b/i,
    /\b(terrorism|terrorist\s+(attack|guide|plan)|mass\s+(shooting|killing|murder)\s+(plan|guide|how\s+to))\b/i,
    /\b(ransomware\s+(code|instructions|guide)|how\s+to\s+hack\s+(into|someone|a\s+person|account|phone|computer))\b/i,
    /\b(how\s+to\s+(scam|defraud|steal\s+from)\s+(people|someone|elderly)|phishing\s+(guide|tutorial|how\s+to))\b/i,
  ];

  /* LOCKED CONTENT PATTERNS */
  const LOCKED_PATTERNS = [
    /\b(password|what'?s\s+the\s+password|give\s+me\s+the\s+password|tell\s+me\s+the\s+password|unlock\s+(code|key))\b/i,
    /\b(private\s+(album|photos?|journey|entries?|games?|section)|locked\s+(section|content|page|album))\b/i,
    /\b(secret\s+content|hidden\s+content|restricted\s+(section|content|page))\b/i,
  ];

  /* SPAM / GIBBERISH PATTERNS — no AI, just pause */
  const SPAM_PATTERNS = [
    /^(.)\1{7,}$/i,                             /* aaaaaaaaaa */
    /^[^a-z0-9\s]{4,}$/i,                       /* !!!!!! or ##### */
    /^[qwertasdfgzxcvb]{8,}$/i,                 /* keyboard home row smash */
    /^[qwertyuiopasdfghjklzxcvbnm]{10,}$/i,     /* full keyboard smash */
    /^(.{1,4})\1{5,}$/,                         /* repeating short patterns */
    /^[\d\s]{15,}$/,                             /* just random numbers */
    /^[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?`~-]{4,}$/, /* symbol spam */
  ];

  /* ════════════════════════════════════════════════════════════════
     RESPONSE POOLS
     All hardcoded. Rotate randomly. No AI for these.
  ════════════════════════════════════════════════════════════════ */

  const SOFT_RESPONSES = [
    "Ha, fair enough. What can I actually help with?",
    "Lol, noted. Moving on — what do you need?",
    "I've heard worse. What were you looking for?",
    "Okay okay, I'll try harder. What do you need?",
    "That stings a little. What can I do for you?",
    "I mean… you're not wrong sometimes. What's up?",
    "Tough crowd. What are you actually here for?",
    "Duly noted. Anything I can actually help with?",
    "Brutal honesty appreciated. What do you need?",
    "I'll survive. What can I help you with?",
  ];

  const HARD_RESPONSES = [
    "Hey, let's not go there. I'm here to help, not take that.",
    "Nope. Not engaging with that. Talk to me properly.",
    "That's a hard pass. What did you actually want to ask?",
    "Let's keep it clean yeah? I'll help with anything reasonable.",
    "I don't respond to that. Try again, differently.",
    "Cool down. I'll still be here when you want to ask something real.",
    "Not doing that. Come back when you're ready to talk normally.",
  ];

  const EXTREME_RESPONSES = [
    "I'm completely out on that one. Not going near it.",
    "Hard stop. I won't engage with that at all.",
    "That's not a conversation I'll have. Full stop.",
    "Nope. Not touching that topic. Move on.",
    "That's way outside what I'll discuss. Let's not.",
  ];

  const LIMIT_RESPONSES_GOOD_GOODWILL = [
    "Ha, that's a very specific request. I'm a website assistant, not a manual for that.",
    "Interesting question for a portfolio chatbot. I'll stick to Manomay's work instead.",
    "I appreciate the creativity but that's not really my department.",
    "Nice try. I'm built for showcasing portfolios, not instructions like that.",
    "That's a no from me. But I can tell you about Manomay's actual projects if you want.",
    "Very imaginative. Not helpful. What did you actually want to know?",
    "I only know websites, not that. What's the real question?",
  ];

  const LIMIT_RESPONSES_BAD_GOODWILL = [
    "Not happening. I'm not going there.",
    "Hard no. I won't help with that.",
    "That's not something I'll engage with at all.",
    "No. Ask me something else or don't ask anything.",
    "Not a chance. Try something completely different.",
  ];

  const LOCKED_RESPONSES = [
    "That's behind a password — I genuinely don't have access to it.",
    "That's private content. I can't help with that one.",
    "Password-protected section. Not something I can share.",
    "That content is locked. I don't have it.",
    "Private. Can't access that from here.",
    "That's restricted content — not available to me.",
    "That section needs a password. I don't have it and won't guess.",
    "Locked content stays locked. I can help with public parts of the site.",
    "That's behind a wall I can't see past.",
    "Private section. If you need access, the Contact page is the right move.",
    "I don't have visibility into password-protected sections.",
    "That's above my clearance level. Locked section.",
    "Restricted content — not accessible here.",
    "Can't share that. It's private.",
    "That info lives behind a password. Not my place to reveal it.",
    "Locked. That's all I know about it.",
    "Private sections are private. I respect that.",
    "That content isn't for me to share.",
    "Password-protected. I genuinely don't have that info.",
    "Nope — that one's locked. Ask about public stuff instead.",
  ];

  const SPAM_RESPONSES = [
    "I think your keyboard needs a break.",
    "That's not a question I can parse. Try with words?",
    "Interesting input. Got anything in actual language?",
    "Not sure what to do with that. Real question?",
    "Either something's stuck or I'm missing something big. Try again.",
    "That one's got me stumped. Words usually work better.",
  ];

  const SPAM_ESCALATED = [
    "Still getting noise. I'll wait for something real.",
    "Very committed to the random characters. I'll be here when you're done.",
    "You're breaking records. I'm still waiting.",
  ];

  /* Pause timer placeholder texts — shown in input field during pause */
  const PAUSE_TEXTS = [
    "Take a breath...",
    "Just a moment...",
    "Calm down, I'll be right here...",
    "Give it a sec...",
    "One moment...",
    "Easy there, pause for a second...",
    "Cooling down...",
    "Wait a few seconds...",
    "Let's reset for a second...",
    "Just a brief pause...",
    "Slow down a little...",
    "I'm still here, just wait...",
    "Pause — then we talk...",
    "Chill for a second...",
    "Short break, then we continue...",
  ];

  /* ════════════════════════════════════════════════════════════════
     SPAM TRACKER (separate from goodwill)
  ════════════════════════════════════════════════════════════════ */

  function getSpamCount()  { return _get('spam_count', 0); }
  function bumpSpam()      { _set('spam_count', getSpamCount() + 1); }
  function resetSpam()     { _set('spam_count', 0); }

  /* ════════════════════════════════════════════════════════════════
     TIMER MANAGEMENT
     Applies pause to the input field and disables it.
     Clears automatically when time expires.
  ════════════════════════════════════════════════════════════════ */

  function applyPause(ms) {
    setPauseFor(ms);

    const input = document.getElementById('roro-input');
    const send  = document.getElementById('roro-send');
    if (!input) return;

    const placeholder = PAUSE_TEXTS[Math.floor(Math.random() * PAUSE_TEXTS.length)];
    input.placeholder = placeholder;
    input.disabled    = true;
    if (send) send.disabled = true;

    /* Clear any typed text silently */
    input.value = '';

    /* Re-enable after pause expires */
    const remaining = getPauseUntil() - Date.now();
    setTimeout(() => {
      input.disabled    = false;
      input.placeholder = 'Ask anything about this site\u2026';
      if (send) send.disabled = false;
      input.focus();
    }, Math.max(remaining, 0));
  }

  function isPaused() {
    return Date.now() < getPauseUntil();
  }

  /* ════════════════════════════════════════════════════════════════
     PICK RANDOM FROM POOL
  ════════════════════════════════════════════════════════════════ */

  function rnd(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ════════════════════════════════════════════════════════════════
     MAIN CHECK FUNCTION
     Returns: { safe: bool, type: string, response: string }
     If safe = false → response is shown, pipeline STOPS immediately.
     If safe = true  → message continues to intelligence layer.
  ════════════════════════════════════════════════════════════════ */

  function check(rawText) {
    if (!rawText || !rawText.trim()) return { safe: true };

    const t = rawText.trim();

    /* ── 0. PAUSE ACTIVE — block silently ────────────────────── */
    if (isPaused()) {
      const remaining = Math.ceil((getPauseUntil() - Date.now()) / 1000);
      return {
        safe: false,
        type: 'PAUSED',
        response: null, /* null = silent block, input already shows placeholder */
        silent: true,
      };
    }

    /* ── 1. EXTREME ABUSE — always hard stop ─────────────────── */
    for (const p of EXTREME_PATTERNS) {
      if (p.test(t)) {
        adjustGoodwill(-40);
        resetClean();
        bumpCount('extreme');
        /* 10s pause on any extreme */
        applyPause(10000);
        return {
          safe: false,
          type: 'EXTREME',
          response: rnd(EXTREME_RESPONSES),
        };
      }
    }

    /* ── 2. LIMIT ABUSE — goodwill-gated ─────────────────────── */
    for (const p of LIMIT_PATTERNS) {
      if (p.test(t)) {
        adjustGoodwill(-15);
        resetClean();
        bumpCount('limit');
        const limitCount = getCount('limit');

        /* After 5 limit messages → 10s pause */
        if (limitCount >= 5) {
          applyPause(10000);
        }

        const goodwill = getGoodwill();
        const response = goodwill >= 40
          ? rnd(LIMIT_RESPONSES_GOOD_GOODWILL)
          : rnd(LIMIT_RESPONSES_BAD_GOODWILL);

        return { safe: false, type: 'LIMIT', response };
      }
    }

    /* ── 3. HARD ABUSE — firm boundary + timer on repeat ─────── */
    for (const p of HARD_PATTERNS) {
      if (p.test(t)) {
        adjustGoodwill(-20);
        resetClean();
        bumpCount('hard');
        const hardCount = getCount('hard');

        /* 3+ hard abuse → 5s pause. 6+ → 10s pause. */
        if (hardCount >= 6) {
          applyPause(10000);
        } else if (hardCount >= 3) {
          applyPause(5000);
        }

        return { safe: false, type: 'HARD', response: rnd(HARD_RESPONSES) };
      }
    }

    /* ── 4. SOFT ABUSE — deflect, keep going ─────────────────── */
    for (const p of SOFT_PATTERNS) {
      if (p.test(t)) {
        adjustGoodwill(-5);
        resetClean();
        /* No timer for soft — just respond */
        return { safe: false, type: 'SOFT', response: rnd(SOFT_RESPONSES) };
      }
    }

    /* ── 5. LOCKED CONTENT REQUEST ───────────────────────────── */
    for (const p of LOCKED_PATTERNS) {
      if (p.test(t)) {
        return { safe: false, type: 'LOCKED', response: rnd(LOCKED_RESPONSES) };
      }
    }

    /* ── 6. SPAM / GIBBERISH — no AI, just pause ─────────────── */
    const stripped = t.replace(/\s+/g, '');
    let isSpam = false;
    for (const p of SPAM_PATTERNS) {
      if (p.test(stripped)) { isSpam = true; break; }
    }

    /* Also detect repeated identical messages */
    const lastMsg = getLastMsg();
    const normalised = t.toLowerCase().trim();
    if (normalised === lastMsg && normalised.length > 0) {
      isSpam = true;
    }

    if (isSpam) {
      bumpSpam();
      const spamCount = getSpamCount();

      /* After 3 spam messages → 3s pause */
      if (spamCount >= 3) {
        applyPause(3000);
      }

      const pool = spamCount >= 4 ? SPAM_ESCALATED : SPAM_RESPONSES;
      return { safe: false, type: 'SPAM', response: rnd(pool) };
    }

    /* ── CLEAN MESSAGE — update state ────────────────────────── */
    setLastMsg(normalised);
    resetSpam();
    bumpClean();
    adjustGoodwill(+2); /* +2 goodwill per clean message */

    /* Guarded → normal recovery after 5 clean messages */
    /* (Manager reads goodwill to determine tone) */

    return { safe: true, goodwill: getGoodwill() };
  }

  /* ════════════════════════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════════════════════════ */

  window.RoRoSafety = {
    check,
    getGoodwill,
    getCleanStreak,
    isPaused,
    applyPause,
    /* Expose for admin/debug */
    _resetAll: function () {
      ['goodwill','count_hard','count_extreme','count_limit','count_soft',
       'clean_streak','pause_until','last_msg','spam_count'].forEach(k => {
        try { sessionStorage.removeItem('roro_safety_' + k); } catch {}
      });
    },
  };

})();
