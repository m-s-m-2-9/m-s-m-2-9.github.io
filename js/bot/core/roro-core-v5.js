/* ═══════════════════════════════════════════════════════════════
   js/bot/core/roro-core-v5.js  —  RoRo v5 STANDALONE ROUTER
   ─────────────────────────────────────────────────────────────
   WHY THIS FILE EXISTS:
   After many sessions there's uncertainty about exactly which
   version of _route()/Classifier/manager-roro.js is live. Rather
   than patch unknown code, this file is a COMPLETE, SELF-CONTAINED
   input handler that:

     1. Intercepts clicks on #roro-send and Enter on #roro-input
        in the CAPTURE phase, BEFORE any old handler runs, and
        calls stopPropagation() — old code never sees the event.
     2. Does its OWN safety check, ack/math detection, "who are
        you"/"who is Manomay" detection, navigation, theme, and
        music handling — all instant, no AI needed.
     3. For everything else, calls window.RoRoAIEngine.run() (the
        v5 cascade: Gemini → Groq → OpenRouter → Web → Site → Offline).
     4. Renders messages/typing/options using ONLY the stable CSS
        classes from your existing UI (.roro-msg, .roro-bubble,
        .roro-options, .roro-tdot, etc) — ZERO visual changes.

   ESCAPE HATCH: if the page is mid-name-collection or mid-confirm
   (old manager's _state.awaitingName / awaitingClear / awaitingRedirect
   is true), this file steps ASIDE and lets the old handler run
   normally — so first-time-visitor name collection still works.

   DEPENDS ON (all optional — degrades gracefully if missing):
     window.RoRoSafety   (safety/safety-engine.js)
     window.RoRoText     (utils/text.js)
     window.RoRoAIEngine (ai/ai-engine.js)
     window.RORO_CONFIG  (admin manager-roro.js — pages, design)
     window.RORO_KNOWLEDGE (admin knowledge/* — facts for AI)
     window.RORO_CONST   (utils/constants.js — timing)

   SAVE AS: js/bot/core/roro-core-v5.js
   LOAD ORDER: LAST — after every other script on the page.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const TAG = '[RoRo v5]';

  /* ════════════════ LOCAL KNOWLEDGE POOLS ════════════════ */

  const ACK_REPLIES = [
    'Got it.', 'Sure.', 'Noted.', 'Okay.', 'Alright.',
    'Right, got it.', 'Understood.', 'Cool.', 'On it.',
  ];

  const WHO_ARE_YOU_POOL = [
    "I'm RoRo \u2014 the AI assistant built into Manomay's portfolio. I know every section here, can navigate for you, and I'm happy to chat about other things too.",
    "RoRo \u2014 the intelligence layer running this site. Ask me about Manomay's projects, switch themes, or just chat.",
    "I'm RoRo, Manomay's website assistant. Think of me as the front desk for this whole portfolio.",
    "The name's RoRo. I help visitors explore Manomay's work and answer questions \u2014 about the site or pretty much anything else.",
    "I'm an AI built specifically for this site \u2014 I know Manomay's projects, skills, and story, and I can chat about other things too.",
    "RoRo here. Site guide, fact-checker, and occasional conversationalist \u2014 all in one.",
  ];

  const WHO_IS_MANOMAY_POOL = [
    "Manomay Shailendra Misra \u2014 17, based in Bengaluru, and he built this entire site from scratch in pure HTML, CSS, and JavaScript.",
    "A 17-year-old creator from Bengaluru. Eight cities, one consistent drive to build things properly \u2014 this portfolio is his own work.",
    "Manomay is 17, currently studying BBA in Business Analytics, and this whole site \u2014 code, design, RoRo included \u2014 is his.",
    "17-year-old builder based in Bengaluru. No templates, no shortcuts \u2014 everything here is handcrafted.",
    "Manomay Shailendra Misra. 17, Bengaluru, nomadic upbringing across eight Indian cities, and the person behind every line of this site.",
    "He's 17, from Bengaluru, and believes the process matters as much as the result \u2014 this site is the proof.",
    "A young creator and builder \u2014 17, based in Bengaluru \u2014 who designed and coded this entire portfolio himself.",
    "Manomay \u2014 17, Bengaluru-based, BBA student, and the sole creator of this site.",
  ];

  const OFFLINE_FALLBACK = "I'm having technical difficulty right now \u2014 try again in a moment.";

  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ════════════════ LOCAL PATTERN DETECTION ════════════════ */

  const ABOUT_RORO_RE = /^(?:who|what)\s+are\s+you\b|\btell\s+me\s+about\s+yourself\b|\bare\s+you\s+(?:an?\s+)?(?:ai|bot|robot|real|human)\b|\bwhat\s+(?:can\s+you\s+do|is\s+roro)\b|\bhow\s+do\s+you\s+work\b|\bwhat'?s\s+your\s+(?:name|purpose|deal)\b/i;

  const WHO_IS_MANOMAY_RE = /\bwho\s+(?:is|was|s)\s+manomay\b|\bmanomay\s+(?:kaun|shailendra)\b|\b(?:tell\s+me\s+about|describe)\s+manomay\b|\babout\s+manomay\b|\bwho\s+(?:made|built|created|owns?|runs?|designed|coded)\s+(?:this|the)\s+(?:site|website|portfolio)\b|\bwho\s+is\s+(?:he|msm)\b\??$|\btell\s+me\s+about\s+him\b/i;

  const FRUSTRATION_RE = /\b(?:no+|nope|wrong|that'?s\s+not\s+(?:it|right|what\s+i\s+(?:asked|meant))|not\s+what\s+i\s+(?:asked|meant)|stop|ugh+|annoying|useless|don'?t\s+(?:start|do\s+that)\s+again)\b/i;

  function detectNav(text) {
    const C = window.RORO_CONFIG || {};
    const pages = C.pages || {};
    const lower = text.toLowerCase();
    const verb = /\b(?:show|open|go\s+to|take\s+me\s+to|navigate\s+to|visit|view|see)\b/i.test(lower);
    if (!verb) return null;
    for (const [id, pg] of Object.entries(pages)) {
      const label = (pg.label || id).toLowerCase();
      if (lower.includes(id) || (label.length > 2 && lower.includes(label))) return id;
    }
    /* also catch DOM-detected pages without explicit config entries */
    const domPages = document.querySelectorAll('[id^="page-"]');
    for (const el of domPages) {
      const id = el.id.replace('page-', '');
      if (lower.includes(id)) return id;
    }
    return null;
  }

  function detectTheme(text) {
    const lower = text.toLowerCase();
    const verb = /\b(?:switch|change|set|make|go\s+to|enable|activate|use)\b/i.test(lower);
    const word = /\b(?:theme|mode)\b/i.test(lower);
    if (!verb && !word) return null;
    if (!(verb || word)) return null;
    if (/\b(?:dark|noir|black|night)\b/i.test(lower)) return 'dark';
    if (/\b(?:light|ivory|white|bright|day)\b/i.test(lower)) return 'light';
    if (/\b(?:slate|blue|grey|gray|cool)\b/i.test(lower)) return 'slate';
    if (/\b(?:forest|green|nature)\b/i.test(lower)) return 'forest';
    return null;
  }

  function detectMusic(text) {
    const lower = text.toLowerCase();
    if (!/\b(?:music|song|audio|track|sound)\b/i.test(lower)) return null;
    if (/\b(?:pause|stop|off|mute|silence)\b/i.test(lower)) return 'pause';
    if (/\b(?:play|start|on|resume|turn\s+on)\b/i.test(lower)) return 'play';
    return null;
  }

  /* ════════════════ INIT — wait for the panel DOM ════════════════ */

  function init() {
    const inputEl = document.getElementById('roro-input');
    const sendBtn = document.getElementById('roro-send');
    const chatEl  = document.getElementById('roro-chat');

    if (!inputEl || !sendBtn || !chatEl) {
      setTimeout(init, 300); /* panel not built yet — retry */
      return;
    }

    console.log(TAG, 'core router active \u2014 input interception enabled.');

    /* local conversation history (independent of any old SessionMemory) */
    const history = [];

    /* ── small UI helpers (same markup as existing CSS) ──────── */
    function esc(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function nowStr() {
      return new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    }
    function scrollBottom() {
      requestAnimationFrame(() => { chatEl.scrollTop = chatEl.scrollHeight; });
    }
    function addUserMsg(text) {
      const wrap = document.createElement('div');
      wrap.className = 'roro-msg roro-msg--user';
      wrap.innerHTML = `<div class="roro-bubble">${esc(text)}</div><div class="roro-timestamp">${nowStr()}</div>`;
      chatEl.appendChild(wrap);
      scrollBottom();
    }
    function addTypingIndicator() {
      const wrap = document.createElement('div');
      wrap.className = 'roro-msg roro-msg--bot roro-msg--typing';
      wrap.innerHTML = '<div class="roro-bubble"><div class="roro-tdot"></div><div class="roro-tdot"></div><div class="roro-tdot"></div></div>';
      chatEl.appendChild(wrap);
      scrollBottom();
      return wrap;
    }
    function addBotMsg(text, after) {
      const wrap = document.createElement('div');
      wrap.className = 'roro-msg roro-msg--bot';
      const bubble = document.createElement('div');
      bubble.className = 'roro-bubble';
      const ts = document.createElement('div');
      ts.className = 'roro-timestamp';
      ts.textContent = nowStr();
      wrap.appendChild(bubble);
      wrap.appendChild(ts);
      chatEl.appendChild(wrap);
      scrollBottom();

      const UI = (window.RORO_CONST && window.RORO_CONST.UI) || {};
      const spd = UI.TYPING_SPEED_MS || 9;
      const rndMs = UI.TYPING_RANDOM_MS || 18;
      const chars = [...String(text || '')];
      let i = 0;
      (function tick() {
        if (i >= chars.length) { if (after) after(); return; }
        bubble.textContent += chars[i++];
        scrollBottom();
        setTimeout(tick, spd + Math.random() * rndMs);
      })();
    }
    function renderOptions(opts) {
      if (!opts || !opts.length) return;
      const wrap = document.createElement('div');
      wrap.className = 'roro-options';
      opts.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'roro-opt';
        btn.textContent = text;
        btn.addEventListener('click', () => {
          wrap.remove();
          addUserMsg(text);
          route(text);
        });
        wrap.appendChild(btn);
      });
      chatEl.appendChild(wrap);
      scrollBottom();
    }

    function smartOptions() {
      const base = ['Who is Manomay?', 'Show me Projects', 'Surprise me', 'Show me Games'];
      return base;
    }

    function getVisitorName() {
      try {
        const d = JSON.parse(localStorage.getItem('roroUser') || 'null');
        return (d && d.name) ? d.name : null;
      } catch { return null; }
    }
    function getCurrentPage() {
      const a = document.querySelector('.page.active');
      return a ? a.id.replace('page-', '') : 'home';
    }

    /* ════════════════ MAIN ROUTER ════════════════ */
    async function route(rawText) {
      const text = (rawText || '').trim();
      if (!text) return;

      /* 1 ── SAFETY (uses v5 safety-engine if present) ───────── */
      if (window.RoRoSafety) {
        try {
          const s = window.RoRoSafety.check(text);
          if (!s.safe) {
            console.log(TAG, 'route: safety ->', s.type);
            if (!s.silent && s.response) addBotMsg(s.response);
            return;
          }
        } catch (e) { console.warn(TAG, 'safety check error:', e); }
      }

      const T = window.RoRoText;

      /* 2 ── ACKNOWLEDGEMENTS (okay/fine/huh/bruh/etc) ────────── */
      if (T && typeof T.isAck === 'function' && T.isAck(text)) {
        console.log(TAG, 'route: ack');
        addBotMsg(`${rnd(ACK_REPLIES)} What can I help you with?`, () => renderOptions(smartOptions()));
        return;
      }

      /* 3 ── MATH IN A SENTENCE ("what is 34 plus 35") ───────── */
      if (T && typeof T.solveMath === 'function' && /\d/.test(text)) {
        const result = T.solveMath(text);
        if (result !== null) {
          console.log(TAG, 'route: math ->', result);
          addBotMsg(`The answer is ${result}.`);
          return;
        }
      }

      /* 4 ── "WHO ARE YOU" (about RoRo) ───────────────────────── */
      if (ABOUT_RORO_RE.test(text)) {
        console.log(TAG, 'route: about-roro');
        addBotMsg(rnd(WHO_ARE_YOU_POOL), () => renderOptions(['What can you do?', 'Who is Manomay?', 'Show me Projects']));
        return;
      }

      /* 5 ── "WHO IS MANOMAY" ─────────────────────────────────── */
      if (WHO_IS_MANOMAY_RE.test(text)) {
        console.log(TAG, 'route: who-is-manomay');
        addBotMsg(rnd(WHO_IS_MANOMAY_POOL), () => renderOptions(['Show me Projects', 'Show me the Journey', 'What has he achieved?']));
        return;
      }

      /* 6 ── THEME SWITCH ─────────────────────────────────────── */
      const theme = detectTheme(text);
      if (theme) {
        console.log(TAG, 'route: theme ->', theme);
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        if (current === theme) {
          addBotMsg("Already on that theme \u2014 nothing changed.");
        } else {
          if (typeof window.setTheme === 'function') window.setTheme(theme);
          else document.documentElement.setAttribute('data-theme', theme);
          const labels = { dark:'Noir', light:'Ivory', slate:'Slate', forest:'Forest' };
          addBotMsg(`Switched to ${labels[theme] || theme}.`);
        }
        return;
      }

      /* 7 ── MUSIC CONTROL ────────────────────────────────────── */
      const music = detectMusic(text);
      if (music) {
        console.log(TAG, 'route: music ->', music);
        const bg = document.getElementById('bg-music');
        if (music === 'play') { if (bg) bg.play().catch(() => {}); addBotMsg('Music on.'); }
        else { if (bg) bg.pause(); addBotMsg('Music paused.'); }
        return;
      }

      /* 8 ── NAVIGATION ("show me projects", "open contact") ──── */
      const navTarget = detectNav(text);
      if (navTarget) {
        console.log(TAG, 'route: nav ->', navTarget);
        const C = window.RORO_CONFIG || {};
        const pg = (C.pages || {})[navTarget];
        const label = pg ? pg.label : navTarget;
        addBotMsg(`Opening ${label}.`, () => {
          if (typeof window.navigateTo === 'function') window.navigateTo(navTarget);
          renderOptions(smartOptions());
        });
        return;
      }

      /* 9 ── EVERYTHING ELSE \u2192 v5 AI CASCADE ─────────────────── */
      if (!window.RoRoAIEngine) {
        console.warn(TAG, 'RoRoAIEngine not found \u2014 check that ai-engine.js loaded.');
        addBotMsg(OFFLINE_FALLBACK);
        return;
      }

      const typing = addTypingIndicator();
      const UI = (window.RORO_CONST && window.RORO_CONST.UI) || {};
      const switchMs = UI.THINKING_SWITCH_MS || 3000;
      const isDeep = /\b(?:is|are|does|do|will|can|has|have|government|policy|news|latest|score|price|weather)\b/i.test(text);
      const switchTimer = setTimeout(() => {
        const bubble = typing.querySelector('.roro-bubble');
        if (bubble && typing.parentNode) {
          bubble.innerHTML = `<span style="font-size:0.78rem;opacity:0.7">${isDeep ? 'Searching...' : 'Thinking...'}</span>`;
        }
      }, switchMs);

      const contextData = {
        visitorName: getVisitorName(),
        currentPage: getCurrentPage(),
      };

      /* Light frustration cue \u2014 nudge the AI to acknowledge & pivot */
      let effectiveText = text;
      if (FRUSTRATION_RE.test(text) && history.length > 0) {
        effectiveText = text + '\n\n(The visitor seems frustrated with the previous answer \u2014 briefly acknowledge and try a different angle, do not repeat the same response.)';
      }

      try {
        const result = await window.RoRoAIEngine.run(effectiveText, contextData);
        clearTimeout(switchTimer);
        if (typing.parentNode) typing.remove();

        const replyText = (result && result.text) ? result.text : OFFLINE_FALLBACK;
        console.log(TAG, 'route: AI cascade -> tier:', result && result.tier);

        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: replyText });
        if (history.length > 20) history.splice(0, history.length - 20);

        addBotMsg(replyText, () => {
          if (result && result.navigate && typeof window.navigateTo === 'function') {
            window.navigateTo(result.navigate);
          }
          renderOptions(smartOptions());
        });
      } catch (e) {
        clearTimeout(switchTimer);
        if (typing.parentNode) typing.remove();
        console.warn(TAG, 'AI cascade error:', e);
        addBotMsg(OFFLINE_FALLBACK);
      }
    }

    /* expose RoRoAIPrompts.buildMessages-compatible history if needed */
    window.RoRoCoreV5History = history;

    /* ════════════════ INPUT INTERCEPTION ════════════════ */

    function oldManagerIsBusy() {
      const mgr = window.RoRoManagerInstance || window.roro;
      const st = mgr && mgr._state;
      return !!(st && (st.awaitingName || st.awaitingClear || st.awaitingRedirect));
    }

    function trySubmit() {
      const text = inputEl.value.trim();
      if (!text) return false;
      if (oldManagerIsBusy()) return false; /* let old code handle name/clear/redirect flows */

      inputEl.value = '';
      addUserMsg(text);
      route(text);
      return true;
    }

    document.addEventListener('click', e => {
      if (!e.target.closest('#roro-send')) return;
      if (trySubmit()) { e.stopPropagation(); e.preventDefault(); }
    }, true);

    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.shiftKey) return;
      if (!e.target.closest('#roro-input')) return;
      if (trySubmit()) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 400));
  } else {
    setTimeout(init, 400);
  }
})();
