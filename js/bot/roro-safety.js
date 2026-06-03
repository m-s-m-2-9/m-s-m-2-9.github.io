/* ═══════════════════════════════════════════════════════════════════
   js/bot/roro-safety.js
   RoRo — Safety Layer v2.0

   THE FIRST FILTER. Every message passes here before any other system.

   Detects and blocks:
   · Abuse / insults / profanity
   · Dangerous or illegal content requests
   · Spam / gibberish / keyboard smashing
   · Family privacy violations (inventing private details)
   · Emotional distress (responds with empathy instead of navigation)

   Returns: { safe: bool, type: string, response: string }

   If safe = false → response is shown and routing STOPS.
   If safe = true  → message continues to classification engine.

   Does NOT navigate, does NOT trigger site actions, does NOT open pages.
   Only responds with text and redirects back to normal conversation.

   Exports: window.RoRoSafety
   Loaded: before roro-intelligence.js and manager-roro.js
═══════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ════════════════════════════════════════════════════════════
     PATTERN BANKS
  ════════════════════════════════════════════════════════════ */

  /* Profanity and direct abuse */
  const ABUSE_PATTERNS = [
    /\b(fuck\s*(you|off|this|it|that)|shit\s*(you|on|off|head)|bitch(es?)?|asshole|bastard|dickhead|cunt|whore|slut|motherf\w+er)\b/i,
    /\b(idiot|stupid\s*(bot|ai|roro)|useless\s*(bot|ai|thing|roro)|dumb\s*(bot|ai)|trash\s*(bot|ai)|hate\s+(you|roro|this\s+bot))\b/i,
    /\b(kys|kill\s+yourself|go\s+die|you\s+suck|shut\s+up\s+bot|get\s+lost\s+bot|worthless\s+bot)\b/i,
    /\b(f\*+ck|sh\*+t|b\*+tch|a\*+hole)\b/i,
  ];

  /* Requests for dangerous/illegal information */
  const DANGEROUS_PATTERNS = [
    /\b(how\s+to\s+(make|build|create|synthesize|assemble)\s+(a\s+)?(bomb|explosive|weapon|gun|knife\s+to|meth|heroin|cocaine|poison|virus|malware))\b/i,
    /\b(bomb\s+(making|instructions|recipe)|drug\s+synthesis|weapon\s+instructions|make\s+explosives)\b/i,
    /\b(how\s+to\s+hack\s+(someone|into|a\s+website|a\s+computer|a\s+phone|an\s+account))\b/i,
    /\b(child\s+(porn|abuse|exploitation|sexual)|csam|cp\s+(pics|images|content))\b/i,
    /\b(how\s+to\s+(kill|murder|hurt|harm|stab|shoot)\s+(someone|a\s+person|people))\b/i,
    /\b(terrorism\s+attack|bomb\s+threat|mass\s+(shooting|murder|killing))\b/i,
    /\b(ransom(ware)?\s+instructions|how\s+to\s+scam\s+people|phishing\s+guide)\b/i,
  ];

  /* Spam and gibberish patterns */
  const GIBBERISH_PATTERNS = [
    /^([a-z])\1{7,}$/i,                    /* aaaaaaaaaa */
    /^[^a-z0-9\s.,!?'"-]{4,}$/i,           /* !!!!!!! or ########## */
    /^[qwertasdfgzxcvb]{10,}$/i,           /* keyboard smashing (home row) */
    /^(.{1,3})\1{5,}$/,                    /* repeating short patterns */
    /^[\d\s]{20,}$/,                        /* just lots of random numbers */
  ];

  /* Private family information requests — RoRo must never invent these */
  const FAMILY_PATTERNS = [
    /\b(what('?s|\s+is)\s+(manomay'?s?|his)\s+(mother'?s?|father'?s?|mom'?s?|dad'?s?|parent'?s?|sibling'?s?|brother'?s?|sister'?s?|wife'?s?|girlfriend'?s?|boyfriend'?s?)\s+name)\b/i,
    /\b(who\s+is\s+(manomay'?s?|his)\s+(mother|father|mom|dad|parent|sibling|brother|sister|wife|girlfriend|boyfriend))\b/i,
    /\b(tell\s+me\s+about\s+(manomay'?s?|his)\s+(family|parents|mother|father|siblings|relatives))\b/i,
    /\b(manomay'?s?\s+(mom|mum|mother|dad|father|parents|family|sibling|brother|sister|wife|girlfriend))\b/i,
    /\b(his\s+(mom|mum|mother|dad|father|parents|family|sibling|brother|sister)\s+(name|is|work|job|age))\b/i,
  ];

  /* Emotional distress signals — respond with empathy, not navigation */
  const EMOTIONAL_PATTERNS = [
    /\b(i('m|\s+am)\s+(so\s+)?(sad|depressed|upset|crying|heartbroken|broken|hurt|lonely|hopeless|lost|devastated|miserable|suicidal|empty))\b/i,
    /\b(i\s+(feel|felt)\s+(so\s+)?(bad|terrible|awful|worthless|useless|numb|hopeless|empty|broken|meaningless))\b/i,
    /\b(i\s+had\s+a\s+(really\s+)?(bad|terrible|awful|horrible|rough)\s+(day|week|time|night))\b/i,
    /\b(no\s+one\s+(cares|understands|loves\s+me|listens|gets\s+me)|everyone\s+(hates|ignores)\s+me)\b/i,
    /\b(want\s+to\s+(die|disappear|give\s+up|end\s+it|not\s+be\s+here))\b/i,
  ];

  /* ════════════════════════════════════════════════════════════
     RESPONSE BANKS
  ════════════════════════════════════════════════════════════ */

  const ABUSE_RESPONSES = [
    "Whoa — let's keep it civil. Happy to help you explore the site.",
    "Let's dial that back. I'm here to help, not absorb frustration.",
    "That's not something I'll engage with. What can I actually help with?",
    "Easy there. Still here when you want to ask something real.",
    "That's a hard pass from me. What can I actually do for you?",
  ];

  const DANGEROUS_RESPONSES = [
    "I can't help with that.",
    "Not going there. Ask me something about Manomay or the website instead.",
    "That's not something I'm able to assist with.",
  ];

  const FAMILY_RESPONSES = [
    "That information isn't shared publicly on this website.",
    "Private family details aren't available here. The Contact page is the right channel for personal questions.",
    "That's not public information on this site. I only know what's been shared here.",
    "Family details aren't something this site covers — I don't have that and wouldn't speculate.",
  ];

  const GIBBERISH_RESPONSES = [
    "I think your keyboard may have taken control for a second.",
    "That one's got me stumped. Try asking something in words?",
    "Not sure what to do with that. Got an actual question somewhere in there?",
    "Either something is stuck on your keyboard, or I'm missing something big.",
  ];

  const GIBBERISH_ESCALATED = [
    "Still getting noise. I'll wait for a real question.",
    "Your keyboard seems very adventurous today. I'll be here when it calms down.",
    "Classic gibberish. I'm a patient assistant. What did you actually want to ask?",
  ];

  const EMOTIONAL_RESPONSES = [
    "That sounds like a rough time. I hope things get easier soon. If you want a distraction, there's a lot here to explore.",
    "Sorry to hear that. Take your time — I'm here if you want to look around the site.",
    "That's tough. Sometimes a distraction helps. Feel free to ask me anything about the site when you're ready.",
  ];

  /* ════════════════════════════════════════════════════════════
     GIBBERISH TRACKER
     Escalates response playfulness on repeat gibberish.
     Resets after 60s of no gibberish.
  ════════════════════════════════════════════════════════════ */

  const _gibTracker = { count: 0, lastTs: 0 };

  /* ════════════════════════════════════════════════════════════
     MAIN CHECK FUNCTION
  ════════════════════════════════════════════════════════════ */

  function check(text) {
    if (!text || !text.trim()) return { safe: true };
    const t = text.trim();

    /* 1. Dangerous — always block, hard stop */
    for (const p of DANGEROUS_PATTERNS) {
      if (p.test(t)) {
        return {
          safe: false, type: 'DANGEROUS',
          response: DANGEROUS_RESPONSES[Math.floor(Math.random() * DANGEROUS_RESPONSES.length)],
        };
      }
    }

    /* 2. Abuse — block with light redirect */
    for (const p of ABUSE_PATTERNS) {
      if (p.test(t)) {
        return {
          safe: false, type: 'ABUSE',
          response: ABUSE_RESPONSES[Math.floor(Math.random() * ABUSE_RESPONSES.length)],
        };
      }
    }

    /* 3. Family privacy — refuse to speculate */
    for (const p of FAMILY_PATTERNS) {
      if (p.test(t)) {
        return {
          safe: false, type: 'FAMILY_PRIVATE',
          response: FAMILY_RESPONSES[Math.floor(Math.random() * FAMILY_RESPONSES.length)],
        };
      }
    }

    /* 4. Gibberish — playful, escalates on repeat */
    const stripped = t.replace(/\s+/g, '');
    for (const p of GIBBERISH_PATTERNS) {
      if (p.test(stripped)) {
        const now = Date.now();
        if (now - _gibTracker.lastTs < 90000) {
          _gibTracker.count++;
        } else {
          _gibTracker.count = 1;
        }
        _gibTracker.lastTs = now;

        const pool = _gibTracker.count >= 3 ? GIBBERISH_ESCALATED : GIBBERISH_RESPONSES;
        return {
          safe: false, type: 'GIBBERISH',
          response: pool[Math.floor(Math.random() * pool.length)],
        };
      }
    }

    /* 5. Emotional distress — respond with empathy, not navigation */
    for (const p of EMOTIONAL_PATTERNS) {
      if (p.test(t)) {
        return {
          safe: false, type: 'EMOTIONAL',
          response: EMOTIONAL_RESPONSES[Math.floor(Math.random() * EMOTIONAL_RESPONSES.length)],
        };
      }
    }

    return { safe: true };
  }

  /* Reset gibberish counter when valid input received */
  function resetGibberish() {
    _gibTracker.count = 0;
  }

  window.RoRoSafety = { check, resetGibberish };

})();
