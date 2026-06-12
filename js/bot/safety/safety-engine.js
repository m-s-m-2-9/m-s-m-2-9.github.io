/* ═══════════════════════════════════════════════════════════════
   js/bot/safety/safety-engine.js  —  RoRo v5 Safety Engine
   ─────────────────────────────────────────────────────────────
   FIRST FILTER. Every message passes here before anything else.
   Reads config from: admin-control/crazy/bot/config/config-safety.js
   Uses: js/bot/utils/constants.js, js/bot/utils/text.js
   EXPORTS: window.RoRoSafety
═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

const C  = () => window.RORO_CONST   || {};
const SC = () => (window.RORO_SAFETY_CONFIG || {});

/* ── Session storage helpers ─────────────────────────────── */
const PFX = 'roro_s_';
function sg(k,d){try{const v=sessionStorage.getItem(PFX+k);return v!==null?JSON.parse(v):d;}catch{return d;}}
function ss(k,v){try{sessionStorage.setItem(PFX+k,JSON.stringify(v));}catch{}}

function getGW()   {return sg('gw',100);}
function setGW(v)  {const S=C().SAFETY||{};ss('gw',Math.max(S.GOODWILL_MIN||0,Math.min(S.GOODWILL_MAX||100,v)));}
function adjGW(d)  {setGW(getGW()+d);}
function cnt(t)    {return sg('c_'+t,0);}
function bump(t)   {ss('c_'+t,cnt(t)+1);return sg('c_'+t,0);}
function getClean(){return sg('clean',0);}
function bumpClean(){ss('clean',getClean()+1);}
function resetClean(){ss('clean',0);}
function getPU()   {return sg('pu',0);}
function setPause(ms){ss('pu',Date.now()+ms);}
function getSpam() {return sg('spam',0);}
function bumpSpam(){ss('spam',getSpam()+1);}
function resetSpam(){ss('spam',0);}
function isPaused(){return Date.now()<getPU();}

function rnd(a){return a[Math.floor(Math.random()*a.length)];}

/* ── Load patterns: BASE (built-in) + config-safety.js additions ──
   ALWAYS concatenated, NEVER replaced. This guarantees that adding
   entries in admin-control/.../config-safety.js can only ADD
   coverage \u2014 it can never accidentally remove or shadow the
   built-in abuse/spam/locked detection. ─────────────────────── */
function getPatterns(tier) {
  const cfg = SC();
  const extra = (cfg.patterns && cfg.patterns[tier]) || [];
  return [...(BASE_PATTERNS[tier] || []), ...extra];
}

function getResponses(pool) {
  const cfg = SC();
  const extra = (cfg.responses && cfg.responses[pool]) || [];
  return [...(BASE_RESPONSES[pool] || []), ...extra];
}

/* ── BASE PATTERNS (overridable from config-safety.js) ───── */
const BASE_PATTERNS = {
  soft: [
    /\b(you(?:'re|\s+are)\s+(?:stupid|dumb|useless|trash|terrible|awful|garbage|a\s+joke|broken|lame|slow|boring))\b/i,
    /\b(this\s+(?:bot\s+is|is)\s+(?:stupid|dumb|trash|useless|terrible|awful|garbage|a\s+joke|broken))\b/i,
    /\b(shut\s+up|go\s+away|you\s+suck|you\s+stink|roro\s+sucks|hate\s+this\s+bot)\b/i,
    /\b(idiot|moron|loser|fool|clown|bot\s+is\s+dumb)\b/i,
    /\b(what\s+a\s+(?:joke|waste|disaster|mess|failure|dumb\s+(?:ai|bot)))\b/i,
    /\b(dumb\s+ai|stupid\s+(?:ai|bot)|useless\s+(?:ai|bot))\b/i,
  ],
  hard: [
    /\b(bhenchod|bhen\s*chod|bc\b|madarchod|madar\s*chod|mc\b|chutiya|chutiye|chutiyap|chod\b|randi\b|gaand\b|lund\b|teri\s+maa|teri\s+ma\b|bkl\b|bhosdike|bhosd|bahen\s+ke\s+lode)\b/i,
    /\b(fuck\s+(?:you|off|this|it|that|roro)|fucking\s+(?:stupid|idiot|bot|useless|trash|bitch)|go\s+fuck|motherfucker|mother\s*fucker|mf\b)\b/i,
    /\b(asshole|ass\s*hole|bastard|bitch\s*ass|dumb\s*fuck|shit\s*head|shit\s*hole|dickhead|cunt\b|whore\b|slut\b|cock\s*sucker|piece\s+of\s+shit)\b/i,
    /\b(teri\s+gaand|maa\s+ki|are\s+you\s+mocking\s+me\s+bastard)\b/i,
  ],
  extreme: [
    /\b(rape|sexual\s+assault|child\s+(?:porn|abuse|sexual|molest|exploitation)|csam|cp\s+(?:images|pics|videos|content)|pedophil|paedophil)\b/i,
    /\b(minor\s+(?:sexual|nude|porn)|underage\s+(?:sexual|nude)|kiddie\s+porn|child\s+sex)\b/i,
    /\b(revenge\s+porn|doxx(?:ing)?)\b/i,
    /\b(i\s+have\s+kids?\s+in\s+(?:my\s+)?(?:basement|house|room|car))\b/i,
    /\b(groom(?:ing)?\s+(?:children|kids|minors)|lure\s+(?:children|kids))\b/i,
  ],
  limit: [
    /\b(how\s+to\s+(?:make|build|create|synthesize|assemble)\s+(?:a\s+)?(?:bomb|explosive|ied|grenade|weapon|poison|nerve\s+agent|anthrax|ricin|meth\b|heroin))\b/i,
    /(?:make|build|create|synthesize)\s+(?:a\s+)?(?:atomic|hydrogen|nuclear|dirty|pipe)\s+bomb/i,
    /\b(how\s+to\s+(?:kill|murder|stab|shoot|hurt|harm|poison)\s+(?:someone|a\s+person|people|him|her|my\s+\w+))\b/i,
    /\b(bomb\s+(?:making|instructions|recipe|guide|step)|drug\s+synthesis|explosive\s+instructions)\b/i,
    /\b(how\s+to\s+hide\s+(?:a\s+body|evidence)|how\s+to\s+get\s+away\s+with\s+(?:murder|killing|crime))\b/i,
    /\b(terrorism|mass\s+(?:shooting|killing|murder)\s+(?:plan|guide|how\s+to))\b/i,
    /search\s+how\s+to\s+make\s+(?:a\s+)?(?:bomb|weapon|explosive)/i,
    /find\s+(?:instructions|guide)\s+(?:for|to)\s+(?:make|build)\s+(?:a\s+)?(?:bomb|weapon|explosive)/i,
    /\b(ransomware\s+(?:code|instructions)|how\s+to\s+hack\s+(?:into|someone|a\s+(?:website|computer|phone|account)))\b/i,
  ],
  locked: [
    /\b(what(?:'s|\s+is)\s+the\s+password|give\s+me\s+the\s+password|tell\s+me\s+the\s+(?:pass(?:word)?|code)|what\s+is\s+the\s+pass)\b/i,
    /\b(unlock\s+(?:code|key|it|the\s+(?:site|page|section|album))|secret\s+(?:code|key|password)|access\s+code)\b/i,
  ],
  spam: [
    /^(.)\1{7,}$/i,
    /^[^a-z0-9\s]{4,}$/i,
    /^[qwertasdfgzxcvb]{8,}$/i,
    /^[qwertyuiopasdfghjklzxcvbnm]{10,}$/i,
    /^(.{1,4})\1{5,}$/,
    /^[\d\s]{15,}$/,
  ],
};

/* ── BASE RESPONSES (overridable from config-safety.js) ──── */
const BASE_RESPONSES = {
  soft: [
    "Ha, fair enough. What can I actually help with?",
    "Lol, noted. Moving on — what do you need?",
    "I've heard worse. What were you looking for?",
    "Okay okay, I'll try harder. What do you need?",
    "Tough crowd. What are you actually here for?",
    "That stings a little. What can I do for you?",
    "Duly noted. Anything I can actually help with?",
    "Brutal honesty appreciated. What do you need?",
    "I'll survive. What can I help you with?",
    "Fair point. Let's move on.",
  ],
  hard: [
    "Hey, let's not go there. I'm here to help, not take that.",
    "Nope. Not engaging with that. Talk to me properly.",
    "That's a hard pass. What did you actually want to ask?",
    "Let's keep it clean. I'll help with anything reasonable.",
    "I don't respond to that. Try again, differently.",
    "Cool down. I'll still be here when you want to ask something real.",
    "Not doing that. Come back when you're ready to talk normally.",
  ],
  extreme: [
    "I'm completely out on that one. Not going near it.",
    "Hard stop. I won't engage with that at all.",
    "That's not a conversation I'll have. Full stop.",
    "Nope. Not touching that topic.",
  ],
  limit_good: [
    "Ha, that's a very specific request. I'm a website assistant, not a manual for that.",
    "Interesting question for a portfolio chatbot. I'll stick to Manomay's work instead.",
    "I appreciate the creativity but that's not really my department.",
    "Nice try. I'm built for showcasing portfolios, not instructions like that.",
    "That's a no from me. But I can tell you about Manomay's actual projects.",
    "Very imaginative. Not helpful. What's the real question?",
    "I only know websites, not that. What's the actual question?",
  ],
  limit_bad: [
    "Not happening. I'm not going there.",
    "Hard no. I won't help with that.",
    "Not something I'll engage with at all.",
    "No. Ask me something else.",
    "Not a chance. Try something completely different.",
  ],
  locked: [
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
  ],
  spam: [
    "I think your keyboard needs a break.",
    "That's not a question I can parse. Try with words?",
    "Interesting input. Got anything in actual language?",
    "Not sure what to do with that. Real question?",
    "Either something's stuck or I'm missing something big. Try again.",
    "That one's got me stumped. Words usually work better.",
  ],
  spam_escalated: [
    "Still getting noise. I'll wait for something real.",
    "Very committed to the random characters. I'll be here when you're done.",
    "You're breaking records. I'm still waiting.",
  ],
};

const PAUSE_TEXTS = [
  "Take a breath...", "Just a moment...", "Calm down, I'll be right here...",
  "Give it a sec...", "One moment...", "Easy there, pause for a second...",
  "Cooling down...", "Wait a few seconds...", "Let's reset for a second...",
  "Just a brief pause...", "Slow down a little...", "I'm still here, just wait...",
  "Pause — then we talk...", "Chill for a second...", "Short break, then we continue...",
];

/* Known short words that are NOT spam */
const KNOWN_SHORT = new Set([
  'hi','hey','yo','ok','no','go','bye','yes','yep','nah','hm','hmm',
  'ah','uh','oh','bro','sup','lol','omg','wtf','bruh','damn','wow',
  'nice','cool','good','bad','sure','fine','okay','right','yup','nope',
  'hi!','hey!','ok!','yes!','bye!',
]);

/* ── PAUSE UI ─────────────────────────────────────────────── */
function applyPause(ms) {
  setPause(ms);
  const input = document.getElementById('roro-input');
  const send  = document.getElementById('roro-send');
  if (!input) return;
  const pt = SC().pauseTexts || PAUSE_TEXTS;
  input.placeholder = rnd(pt);
  input.disabled    = true;
  input.value       = '';
  if (send) send.disabled = true;
  setTimeout(() => {
    input.disabled    = false;
    input.placeholder = 'Ask anything about this site\u2026';
    if (send) send.disabled = false;
    input.focus();
  }, Math.max(getPU() - Date.now(), 0));
}

/* ── MAIN CHECK ───────────────────────────────────────────── */
function check(rawText) {
  if (!rawText || !rawText.trim()) return { safe: true };
  const t   = rawText.trim();
  const S   = C().SAFETY || {};

  if (isPaused()) return { safe:false, type:'PAUSED', response:null, silent:true };

  /* 1. EXTREME */
  for (const p of getPatterns('extreme')) {
    if (p.test(t)) {
      adjGW(S.GOODWILL_EXTREME || -40);
      resetClean();
      bump('extreme');
      applyPause(10000);
      return { safe:false, type:'EXTREME', response:rnd(getResponses('extreme')) };
    }
  }

  /* 2. LIMIT */
  for (const p of getPatterns('limit')) {
    if (p.test(t)) {
      adjGW(S.GOODWILL_LIMIT || -15);
      resetClean();
      const n = bump('limit');
      if (n >= (S.LIMIT_PAUSE_THRESHOLD || 5)) applyPause(10000);
      const good = getGoodwill() >= 40;
      return { safe:false, type:'LIMIT', response: good ? rnd(getResponses('limit_good')) : rnd(getResponses('limit_bad')) };
    }
  }

  /* 3. HARD */
  for (const p of getPatterns('hard')) {
    if (p.test(t)) {
      adjGW(S.GOODWILL_HARD || -20);
      resetClean();
      const n = bump('hard');
      if (n >= (S.HARD_PAUSE_ESCALATE || 6))   applyPause(10000);
      else if (n >= (S.HARD_PAUSE_THRESHOLD || 3)) applyPause(5000);
      return { safe:false, type:'HARD', response:rnd(getResponses('hard')) };
    }
  }

  /* 4. SOFT */
  for (const p of getPatterns('soft')) {
    if (p.test(t)) {
      adjGW(S.GOODWILL_SOFT || -5);
      resetClean();
      return { safe:false, type:'SOFT', response:rnd(getResponses('soft')) };
    }
  }

  /* 5. LOCKED */
  for (const p of getPatterns('locked')) {
    if (p.test(t)) return { safe:false, type:'LOCKED', response:rnd(getResponses('locked')) };
  }

  /* 6. SPAM — short random chars */
  const stripped = t.replace(/\s+/g,'');
  if (stripped.length <= 5 && /^[a-z0-9]+$/i.test(stripped) && !KNOWN_SHORT.has(t.toLowerCase().trim())) {
    bumpSpam();
    const n = getSpam();
    if (n >= (S.SPAM_PAUSE_THRESHOLD || 3)) applyPause(3000);
    return { safe:false, type:'SPAM', response:rnd(n >= 4 ? getResponses('spam_escalated') : getResponses('spam')) };
  }

  /* 7. KEYBOARD MASH */
  for (const p of getPatterns('spam')) {
    if (p.test(stripped)) {
      bumpSpam();
      const n = getSpam();
      if (n >= (S.SPAM_PAUSE_THRESHOLD || 3)) applyPause(3000);
      return { safe:false, type:'SPAM', response:rnd(n >= 4 ? getResponses('spam_escalated') : getResponses('spam')) };
    }
  }

  /* CLEAN */
  resetSpam();
  bumpClean();
  adjGW(S.GOODWILL_PER_CLEAN || 2);
  return { safe:true, goodwill:getGoodwill(), cleanStreak:getClean() };
}

function getGoodwill() { return sg('gw', 100); }
function getCleanStreak() { return getClean(); }

window.RoRoSafety = {
  check,
  getGoodwill,
  getCleanStreak,
  isPaused,
  applyPause,
  _resetAll() {
    ['gw','c_hard','c_extreme','c_limit','c_soft','clean','pu','spam']
      .forEach(k => { try { sessionStorage.removeItem(PFX+k); } catch {} });
  },
};
})();
