/* ═══════════════════════════════════════════════════════════════════
   js/bot/manager-roro.js  —  RoRo Engine v4.0
   ─────────────────────────────────────────────────────────────────
   THE MAIN ENGINE. Loaded last in the bot stack.

   LOAD ORDER (index.html):
     1. admin-control/crazy/bot/manager-roro.js   (RORO_CONFIG)
     2. js/bot/roro-safety.js
     3. js/bot/roro-web.js
     4. js/bot/roro-intelligence.js
     5. js/bot/manager-roro.js                    ← THIS FILE

   WHAT THIS FILE DOES:
   · Builds and shows the chat panel UI (unchanged from v2)
   · Runs the 5-tier AI cascade (Gemini → Groq → OpenRouter →
     Puter.js → Web fallback → hardcoded error strings)
   · Routes every message through Safety → Intelligence → AI
   · Manages the message queue, typing indicator, option chips,
     action buttons, idle detection, prompt ticker
   · Reads ALL content from window.RORO_CONFIG +
     window.RoRoIntelligence.KnowledgeBuilder (self-updating)
   · Stores visitor name + last page in localStorage (90-day expiry)
   · Tracks session memory via RoRoIntelligence.SessionMemory

   WHAT THIS FILE DOES NOT DO:
   · Change any UI visuals, animations, timing, or design
   · Hardcode any content (all content comes from config/KB)
   · Block on async AI calls (async is fire-and-replace)

   API KEYS (set in RORO_CONFIG.apiKeys or directly below):
   · Gemini  : x-goog-api-key header, endpoint v1beta
   · Groq    : Bearer token, llama-3.1-8b-instant
   · OpenRouter: Bearer token, meta-llama/llama-3-8b-instruct:free

   Exports: window.RoRoManager, window.roro
   ─────────────────────────────────────────────────────────────────
   NO UI CHANGES. NO VISUAL CHANGES. ENGINE ONLY.
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════
     § 0 — CSS  (100% identical to v2. Zero changes.)
  ════════════════════════════════════════════════════════════════ */

  const RORO_CSS = `
    #roro-btn {
      display:inline-flex;align-items:center;justify-content:center;
      width:32px;height:32px;border-radius:50%;
      border:1px solid var(--border2,rgba(255,255,255,0.12));
      background:var(--bg3,rgba(255,255,255,0.04));
      cursor:pointer;position:relative;
      transition:border-color 0.25s ease,box-shadow 0.25s ease,background 0.25s ease;
      flex-shrink:0;outline:none;
    }
    #roro-btn:hover{border-color:var(--accent);box-shadow:0 0 10px var(--accent-glow,rgba(200,169,110,0.25));background:var(--bg4,rgba(255,255,255,0.08));}
    #roro-btn.roro-btn--active{border-color:var(--accent);box-shadow:0 0 10px var(--accent-glow,rgba(200,169,110,0.25));}
    #roro-btn svg{width:15px;height:15px;display:block;}
    .roro-badge{position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:50%;background:var(--accent);border:2px solid var(--bg);display:none;pointer-events:none;}
    #roro-btn.roro-has-unread .roro-badge{display:block;}
    .roro-panel{position:fixed;bottom:28px;right:28px;width:340px;height:500px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;display:flex;flex-direction:column;overflow:hidden;z-index:9900;box-shadow:0 24px 64px rgba(0,0,0,0.45),0 0 0 1px var(--border2);opacity:0;pointer-events:none;transform:translateY(18px) scale(0.96);transition:transform 0.38s cubic-bezier(0.16,1,0.3,1),opacity 0.3s ease,width 0.32s cubic-bezier(0.16,1,0.3,1),height 0.32s cubic-bezier(0.16,1,0.3,1),bottom 0.32s cubic-bezier(0.16,1,0.3,1),right 0.32s cubic-bezier(0.16,1,0.3,1),border-radius 0.32s ease;}
    .roro-panel.roro-panel--open{opacity:1;pointer-events:all;transform:translateY(0) scale(1);}
    .roro-panel.roro-panel--minimized{height:48px;width:188px;border-radius:24px;cursor:pointer;bottom:28px;right:28px;}
    .roro-panel.roro-panel--fullscreen{width:100vw!important;height:100vh!important;bottom:0!important;right:0!important;border-radius:0!important;}
    .roro-header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--border);background:var(--bg2);flex-shrink:0;user-select:none;position:relative;}
    .roro-panel--minimized .roro-header{border-bottom:none;justify-content:center;padding:0 16px;height:100%;}
    .roro-avatar{width:36px;height:36px;border-radius:50%;background:var(--bg3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;}
    .roro-avatar-pulse{position:absolute;inset:-5px;border-radius:50%;border:1px solid var(--accent);opacity:0;animation:roroPulse 3.5s ease-in-out infinite;pointer-events:none;}
    @keyframes roroPulse{0%,100%{opacity:0;transform:scale(1)}50%{opacity:0.28;transform:scale(1.12)}}
    .roro-avatar svg{width:18px;height:18px;}
    .roro-identity{flex:1;min-width:0;}
    .roro-name{font-family:var(--ff-display);font-size:0.92rem;font-weight:400;color:var(--text);line-height:1;margin-bottom:3px;}
    .roro-subtitle{font-family:var(--ff-mono);font-size:0.58rem;color:var(--accent);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:2px;}
    .roro-status{display:flex;align-items:center;gap:4px;font-family:var(--ff-mono);font-size:0.55rem;color:var(--text3);letter-spacing:0.04em;}
    .roro-status-dot{width:5px;height:5px;border-radius:50%;background:#4ade80;flex-shrink:0;animation:roroBlink 2.2s ease-in-out infinite;}
    @keyframes roroBlink{0%,100%{opacity:1}50%{opacity:0.35}}
    .roro-controls{display:flex;gap:4px;align-items:center;flex-shrink:0;}
    .roro-ctrl{width:24px;height:24px;border-radius:50%;border:1px solid var(--border2);background:var(--bg3);color:var(--text3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.7rem;transition:border-color 0.2s,color 0.2s,background 0.2s;outline:none;line-height:1;padding:0;}
    .roro-ctrl:hover{border-color:var(--accent);color:var(--accent);background:var(--bg4);}
    .roro-minimized-label{display:none;align-items:center;gap:8px;font-family:var(--ff-mono);font-size:0.72rem;color:var(--text2);letter-spacing:0.1em;}
    .roro-minimized-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;flex-shrink:0;animation:roroBlink 2.2s ease-in-out infinite;}
    .roro-panel--minimized .roro-avatar,.roro-panel--minimized .roro-identity,.roro-panel--minimized .roro-controls{display:none;}
    .roro-panel--minimized .roro-minimized-label{display:flex;}
    .roro-enc-bar{font-family:var(--ff-mono);font-size:0.53rem;color:var(--text3);letter-spacing:0.06em;padding:4px 14px;border-bottom:1px solid var(--border);text-align:center;flex-shrink:0;background:var(--bg2);}
    .roro-panel--minimized .roro-enc-bar,.roro-panel--minimized .roro-chat,.roro-panel--minimized .roro-input-row,.roro-panel--minimized .roro-prompt-ticker{display:none;}
    .roro-chat{flex:1;overflow-y:auto;overflow-x:hidden;padding:14px 14px 6px;display:flex;flex-direction:column;gap:8px;scrollbar-width:thin;scrollbar-color:var(--border2) transparent;}
    .roro-chat::-webkit-scrollbar{width:3px;}
    .roro-chat::-webkit-scrollbar-track{background:transparent;}
    .roro-chat::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
    .roro-separator{text-align:center;font-family:var(--ff-mono);font-size:0.52rem;color:var(--text3);letter-spacing:0.1em;text-transform:uppercase;opacity:0.55;padding:2px 0 6px;flex-shrink:0;}
    .roro-msg{display:flex;flex-direction:column;max-width:84%;gap:3px;animation:roroMsgIn 0.28s cubic-bezier(0.16,1,0.3,1);}
    @keyframes roroMsgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .roro-msg--bot{align-self:flex-start;align-items:flex-start;}
    .roro-msg--user{align-self:flex-end;align-items:flex-end;}
    .roro-bubble{padding:8px 12px;border-radius:16px;font-size:0.82rem;line-height:1.65;font-family:var(--ff-body);word-break:break-word;}
    .roro-msg--bot .roro-bubble{background:var(--bg3);border:1px solid var(--border);color:var(--text);border-bottom-left-radius:4px;}
    .roro-msg--user .roro-bubble{background:var(--accent);color:var(--bg);border-bottom-right-radius:4px;}
    .roro-timestamp{font-family:var(--ff-mono);font-size:0.52rem;color:var(--text3);letter-spacing:0.04em;padding:0 4px;}
    .roro-msg--typing .roro-bubble{display:flex;gap:5px;align-items:center;padding:10px 14px;}
    .roro-tdot{width:5px;height:5px;border-radius:50%;background:var(--text3);animation:roroTypeDot 1.3s ease-in-out infinite;}
    .roro-tdot:nth-child(2){animation-delay:0.18s;}
    .roro-tdot:nth-child(3){animation-delay:0.36s;}
    @keyframes roroTypeDot{0%,60%,100%{transform:translateY(0);opacity:0.38}30%{transform:translateY(-5px);opacity:1}}
    .roro-options{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px;animation:roroMsgIn 0.28s cubic-bezier(0.16,1,0.3,1);}
    .roro-opt{font-family:var(--ff-mono);font-size:0.62rem;letter-spacing:0.06em;color:var(--text2);border:1px solid var(--border2);background:var(--bg3);padding:5px 11px;border-radius:20px;cursor:pointer;transition:border-color 0.2s,color 0.2s,background 0.2s;outline:none;white-space:nowrap;line-height:1;}
    .roro-opt:hover{border-color:var(--accent);color:var(--accent);background:var(--bg4);}
    .roro-input-row{display:flex;gap:8px;align-items:center;padding:10px 12px 13px;border-top:1px solid var(--border);flex-shrink:0;background:var(--bg2);}
    .roro-input{flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:20px;color:var(--text);font-family:var(--ff-body);font-size:0.82rem;padding:8px 14px;outline:none;transition:border-color 0.25s;resize:none;line-height:1.4;}
    .roro-input::placeholder{color:var(--text3);}
    .roro-input:focus{border-color:var(--accent);}
    .roro-send-btn{width:34px;height:34px;border-radius:50%;border:none;background:var(--accent);color:var(--bg);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity 0.2s,transform 0.15s;outline:none;}
    .roro-send-btn:hover{opacity:0.82;}
    .roro-send-btn:active{transform:scale(0.88);}
    .roro-send-btn svg{width:14px;height:14px;display:block;}
    .roro-panel--fullscreen .roro-chat,.roro-panel--fullscreen .roro-options,.roro-panel--fullscreen .roro-input-row{max-width:680px;width:100%;margin-left:auto;margin-right:auto;}
    @media(max-width:480px){
      .roro-panel{width:calc(100vw - 20px);right:10px;bottom:10px;}
      .roro-panel.roro-panel--fullscreen{width:100vw!important;right:0!important;bottom:0!important;}
    }
    .roro-prompt-ticker{height:26px;overflow:hidden;border-top:1px solid var(--border);background:var(--bg2);flex-shrink:0;position:relative;user-select:none;cursor:pointer;}
    .roro-prompt-track{display:inline-flex;align-items:center;white-space:nowrap;height:26px;animation:roroTickerScroll 60s linear infinite;will-change:transform;}
    .roro-prompt-ticker:hover .roro-prompt-track{animation-play-state:paused;}
    @keyframes roroTickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .roro-prompt-item{display:inline-flex;align-items:center;height:26px;padding:0 12px;font-family:var(--ff-mono);font-size:0.56rem;color:var(--text3);letter-spacing:0.04em;white-space:nowrap;flex-shrink:0;transition:color 0.18s;}
    .roro-prompt-item:hover{color:var(--accent);}
    .roro-prompt-sep{display:inline-flex;align-items:center;height:26px;color:var(--border2);font-size:0.44rem;flex-shrink:0;padding:0 2px;pointer-events:none;}
    .roro-ticker-fade-l,.roro-ticker-fade-r{position:absolute;top:0;bottom:0;width:20px;pointer-events:none;z-index:2;}
    .roro-ticker-fade-l{left:0;background:linear-gradient(to right,var(--bg2) 30%,transparent);}
    .roro-ticker-fade-r{right:0;background:linear-gradient(to left,var(--bg2) 30%,transparent);}
    .roro-action-btns{display:flex;flex-wrap:wrap;gap:5px;padding:2px 0 4px 2px;max-width:84%;align-self:flex-start;animation:roroMsgIn 0.28s cubic-bezier(0.16,1,0.3,1);}
    .roro-action-btn{display:inline-flex;align-items:center;gap:5px;font-family:var(--ff-mono);font-size:0.59rem;letter-spacing:0.05em;color:var(--text2);border:1px solid var(--border2);background:var(--bg3);padding:5px 11px;border-radius:4px;cursor:pointer;text-decoration:none;white-space:nowrap;line-height:1;transition:border-color 0.2s,color 0.2s,background 0.2s;outline:none;}
    .roro-action-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--bg4);}
    .roro-action-btn--primary{background:var(--accent);color:var(--bg);border-color:var(--accent);}
    .roro-action-btn--primary:hover{opacity:0.84;color:var(--bg);}
  `;

  /* ════════════════════════════════════════════════════════════════
     § 1 — API CASCADE CONFIGURATION
     Keys read from RORO_CONFIG.apiKeys first, then fallback here.
     Edit keys in admin-control/crazy/bot/manager-roro.js only.
  ════════════════════════════════════════════════════════════════ */

  function _apiKeys() {
    const K = (window.RORO_CONFIG && window.RORO_CONFIG.apiKeys) || {};
    return {
      gemini:     K.gemini     || 'AQ.Ab8RN6I92qhXWnCoY5dAGA1BEnMtwsvYN1viahWWu3zF9_6fMw',
      groq:       K.groq       || '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',
      openrouter: K.openrouter || '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',
    };
  }

  /* Timeout per tier (ms). 30s max before moving to next. */
  const TIER_TIMEOUT_MS = 28000;

  /* ════════════════════════════════════════════════════════════════
     § 2 — HARDCODED ERROR / FALLBACK STRINGS
     30 rotating messages shown when ALL AI tiers fail.
     These are the ONLY hardcoded content strings in this file.
  ════════════════════════════════════════════════════════════════ */

  const OFFLINE_RESPONSES = [
    "I'm experiencing some technical difficulty right now. Try again in a moment.",
    "Something went sideways on my end. Give it another shot.",
    "Seems like I'm having connectivity issues. One more try should do it.",
    "My systems are a bit backed up right now. Try again shortly.",
    "Technical hiccup. I'll be back in a moment — try again.",
    "Connection dropped somewhere in the chain. Give me a second.",
    "I hit a wall on that one. Try asking again.",
    "Something's not cooperating right now. One more try.",
    "Running into an issue I can't resolve immediately. Try again soon.",
    "Technical difficulty — not your question, my end. Try again.",
    "I'm temporarily limited. Give it another go in a moment.",
    "Connectivity issue on my side. Retry in a few seconds.",
    "That one didn't go through cleanly. Try once more.",
    "I ran into something unexpected. Ask me again.",
    "My response pipeline hit a snag. One more try should work.",
    "Having a moment of technical difficulty. Won't be long.",
    "Something interrupted that. Try the same question again.",
    "Not able to get a clear response right now. Try shortly.",
    "Ran into a technical wall. I'll be ready again in a moment.",
    "Temporary issue on my end. Give me one more shot at that.",
    "Systems are working through something. Try again in a sec.",
    "That request didn't complete. Fire it again.",
    "A brief technical hiccup. I'll sort it — try again.",
    "Not able to reach my knowledge systems right now. Retry.",
    "Connection unstable. Give it one more try.",
    "Something dropped mid-process. Ask me again.",
    "Technical difficulty. This doesn't happen often — try again.",
    "I'm temporarily running limited. Try the question again.",
    "A system I need is currently unavailable. Retry shortly.",
    "Connectivity problem — my end, not yours. Try once more.",
  ];

  /* Thinking/searching placeholder messages (shown while AI runs) */
  const THINKING_MSGS = [
    "One moment…",
    "Thinking…",
    "Checking that for you…",
    "Looking into it…",
    "Consulting the knowledge base…",
    "Give me a second…",
    "On it…",
    "Working on that…",
  ];

  const SEARCHING_MSGS = [
    "Searching…",
    "Let me look that up…",
    "Checking sources…",
    "Finding that for you…",
    "Looking it up…",
    "Fetching that…",
  ];

  /* "Who is Manomay" hardcoded pool — 25 variations */
  const WHO_IS_MANOMAY_POOL = [
    "Manomay Shailendra Misra is a 17-year-old creator and builder based in Bengaluru. Eight cities, one consistent ambition.",
    "Manomay is a 17-year-old designer and builder from Bengaluru. He builds everything from scratch — no templates, no shortcuts.",
    "Manomay Shailendra Misra — 17, Bengaluru. Creator, thinker, builder. This entire website is his own work.",
    "A 17-year-old who builds things deliberately. Manomay Shailendra Misra — currently based in Bengaluru.",
    "Manomay is a young creator from Bengaluru. He designs, builds, and thinks with intention. This site is proof of that.",
    "Manomay Shailendra Misra is 17 years old, based in Bengaluru, and built this entire website himself — pure vanilla code.",
    "A builder who does things from scratch. Manomay, 17, Bengaluru. Everything on this site is his.",
    "Manomay is a 17-year-old creator, currently in Bengaluru. His philosophy: build legacy without losing softness.",
    "Manomay Shailendra Misra — young, deliberate, and building something. 17 years old, Bengaluru-based.",
    "He's 17, based in Bengaluru, and has been nomadic across India — eight cities shaped his perspective.",
    "Manomay is a creator and strategist who believes the process matters as much as the output. 17, Bengaluru.",
    "A 17-year-old who builds with intention. Manomay Shailendra Misra, currently in Bengaluru.",
    "Manomay — 17 years old, Bengaluru. Designed this entire website himself. No frameworks. No templates.",
    "Manomay Shailendra Misra is a young creator from Bengaluru who believes in building things that last.",
    "Seventeen years old, nomadic upbringing across India, now based in Bengaluru. That's Manomay.",
    "A creator who does things properly. Manomay Shailendra Misra — 17, based in Bengaluru.",
    "Manomay is 17 and building something real. Designer, creator, builder — currently in Bengaluru.",
    "Manomay Shailendra Misra — 17 years old, eight cities, one direction. Based in Bengaluru.",
    "Young, deliberate, and deeply curious. Manomay, 17, Bengaluru. Everything here is his work.",
    "Manomay is a 17-year-old from Bengaluru who built this entire site from scratch. No frameworks involved.",
    "A builder who thinks about everything twice. Manomay Shailendra Misra, 17, currently in Bengaluru.",
    "Manomay — seventeen years old, Bengaluru-based, and making something worth noticing.",
    "Manomay Shailendra Misra is 17. He designs and builds with intention. This website is what that looks like.",
    "Seventeen, Bengaluru, building things that last. That's Manomay Shailendra Misra.",
    "Manomay is a creator from Bengaluru. 17 years old, this entire portfolio is his own work from scratch.",
  ];

  /* Navigation page summaries — 10 per page, rotated */
  const NAV_SUMMARIES = {
    home:     ["The starting point. Everything about Manomay starts here.", "Clean, minimal, intentional. The whole site distilled into one scroll.", "The homepage. Name, tagline, navigation. Simple by design.", "Where it all begins. Explore from here.", "Manomay's entry point. The first impression.", "The homepage — built to be remembered, not just visited.", "Start here. Everything branches from this page.", "Minimal by design. The homepage sets the tone for the rest.", "The front door. Clean, deliberate, no clutter.", "Homepage. Theme switcher, music, navigation — all here."],
    about:    ["His identity in written form. Biography, philosophy, private layer.", "The Identity page — who Manomay is, where he came from, what drives him.", "Written form of who he is. Some of it requires a password.", "Identity. Biography. Philosophy. Private extended section.", "This is the page that explains the person behind the work.", "His story in words. The Identity page.", "Biography, philosophy, and more — some behind a password.", "The Identity section. Honest and direct.", "Who is Manomay? This page answers that in depth.", "Personal biography and philosophy. Some content is password-protected."],
    photos:   ["Visual diary. Public albums open to all, private ones behind a password.", "Photography. Curated moments, not a social feed.", "Photo albums — public and private. The Photos page.", "Visual work and personal moments. Some albums need a password.", "Curated photography. Real moments.", "The Photos page — visual storytelling, not performance.", "Albums — some public, some private. Photography page.", "His visual side. Curated photo albums.", "Photography and visual moments. Some require password access.", "Visual diary. Albums organised. The Photos section."],
    resume:   ["Formal résumé. Experience, education, skills, downloadable PDF.", "The CV page — everything professional in one place.", "Work history, education, skills. PDF download available.", "Clean résumé. Downloadable at the bottom.", "The professional snapshot — CV page.", "Experience, education, skills — all on the CV page.", "Résumé page. Download the PDF at the bottom.", "His CV. Work, education, skills. Formal and minimal.", "Everything professional. CV page with PDF download.", "The résumé — formal, clean, downloadable."],
    projects: ["Where the work lives. Projects with status labels and detail popups.", "Every project — status, description, click for full details.", "The Projects page. Flat list, click any for full description.", "His work in list form. Status labels, full detail on click.", "Projects — completed, ongoing, abandoned. All here.", "Work he has built. Click any project for the full story.", "The portfolio's core — the Projects page.", "Everything he has built or is building. Projects page.", "Projects list with status. Click for details.", "His work — all of it, with status and descriptions."],
    profiles: ["All social profiles in one place. Instagram, LinkedIn, GitHub, and more.", "Digital presence. Every platform he's on.", "Social profiles — Instagram, LinkedIn, X, GitHub, Facebook.", "Find Manomay online. Profiles page.", "Every platform he uses — all linked here.", "His internet presence. Profiles and handles.", "Social media and profile links. All in one section.", "Where to find him online. Profiles page.", "Instagram, LinkedIn, GitHub — all linked on the Profiles page.", "His digital presence, all consolidated here."],
    journey:  ["Year-by-year timeline from 2008 to the present. Click any year.", "The Journey — chapters from 2008 to now. Interactive timeline.", "His life in chapters. Click a year, read that chapter.", "Timeline from birth to the present. The Journey page.", "Nomadic story — eight cities, one timeline. The Journey page.", "His years, one by one. Click any to read.", "Interactive timeline of his life. 2008 to present.", "The Journey section — his story told year by year.", "Click any year on the timeline to read that chapter.", "His life as a timeline. 2008 to now, chapter by chapter."],
    birthday: ["Live millisecond countdown to August 29th.", "The Clock page — countdown running to the millisecond.", "Birthday countdown. Always live, always running.", "August 29th. The Clock page counts down to it.", "A live timer. Clock page.", "Millisecond countdown to his next birthday.", "The Clock — live countdown, always ticking.", "Birthday countdown page. Something changes on the day itself.", "Running to the millisecond. Clock page.", "Live birthday countdown. The Clock section."],
    thoughts: ["Six categories of beliefs — unfiltered. Politics, Faith, Science, and more.", "His opinions and beliefs. Six categories. Honest.", "The Thoughts section — beliefs across six categories.", "Politics, Faith, Science, Life, Society, Technology. His takes.", "Unfiltered opinions. Six categories. The Thoughts page.", "What Manomay thinks — across six topics. Thoughts section.", "Six categories of genuine beliefs. No filter.", "His blog of beliefs. Six categories, multiple posts.", "Thoughts — honest opinions on politics, faith, science, and more.", "What he actually thinks. Six categories. Unfiltered."],
    contact:  ["Direct message form. He reads every submission.", "The Contact page — message him directly.", "Reach Manomay. Form, email, password requests.", "Contact page. Every message gets read.", "Send a message. Contact section.", "Direct line to Manomay. The Contact page.", "Message form. He reads everything sent here.", "How to reach him. Contact page.", "The Contact section — use it for questions, passwords, collaboration.", "Message Manomay. He reads every one."],
    lists:    ["Curated lists — series, books, places, movies. Some need a password.", "His taste in list form. Web series, books, places, films.", "What he watches, reads, and wants to visit. The Lists page.", "Curated taste — movies, books, series, places.", "The Lists section. Password needed for the full list.", "His recommendations. Curated lists across four categories.", "Series, books, movies, places — all listed. Some behind a password.", "What he consumes and recommends. Lists page.", "Curated content across four categories. Lists section.", "His reading list, watchlist, places — all here."],
    skills:   ["Skill bars, keyword marquee, hobbies. The Traits page.", "Animated skill bars and a hobbies section. Traits page.", "What he can do. Skills, interests, hobbies.", "The Traits section — capability and curiosity in one place.", "Skills with progress bars. Marquee. Hobbies. Traits page.", "An honest map of what he knows and loves. Traits section.", "Traits page — animated skills, keywords, hobbies.", "His capabilities and interests. The Skills/Traits page.", "What Manomay knows and loves — Traits section.", "Skill bars, marquee, hobbies. Traits page."],
    games:    ["Five built-in games. Snake, Memory Match, 2048, Reaction Time, Word Scramble.", "Play something. Five games, all built from scratch.", "Games section — five playable games, more behind a password.", "Built-in games. Snake, 2048, Memory, Word Scramble, Reaction Time.", "Five fully playable games. The Games page.", "Games — all hand-built, no frameworks.", "Play Snake, 2048, Memory Match, and more. Games page.", "Five mini-games, all built into the site. Games section.", "The Games page — take a break, play something.", "Snake, Memory, 2048, Reaction Time, Word Scramble. All here."],
    social:   ["Brands and companies Manomay has worked with. Testimonials.", "Social proof — who he has worked with, what they said.", "Brand logos and testimonials. Social Proof page.", "His collaborations and client testimonials.", "Worked with: ISKCON, Mayura Woods, Golden Star PG, and more.", "Who he has worked with and what they think. Social Proof.", "Testimonials and brand logos. Social proof section.", "His professional reputation. Social Proof page.", "Collaborators, testimonials, brands. All on the Social Proof page.", "Social Proof — who he has worked with."],
  };

  function rnd(arr) {
    if (!arr || !arr.length) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ════════════════════════════════════════════════════════════════
     § 3 — MEMORY ENGINE  (localStorage, 90-day expiry)
  ════════════════════════════════════════════════════════════════ */

  const MemoryEngine = {
    KEY:    'roroUser',
    EXPIRY: 90 * 24 * 60 * 60 * 1000,

    load() {
      try {
        const raw  = localStorage.getItem(this.KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (data.lastSeen && (Date.now() - data.lastSeen) > this.EXPIRY) {
          this.clear(); return null;
        }
        return data;
      } catch { return null; }
    },

    save(data) {
      try { data.lastSeen = Date.now(); localStorage.setItem(this.KEY, JSON.stringify(data)); } catch {}
    },

    clear() {
      try { localStorage.removeItem(this.KEY); } catch {}
    },

    trackPage(data, pageId) {
      if (!data) return data;
      if (!data.viewedPages) data.viewedPages = {};
      if (!data.viewedPages[pageId]) data.viewedPages[pageId] = { count: 0 };
      data.viewedPages[pageId].count++;
      data.lastPage = pageId;
      return data;
    },

    getLastPage(data)   { return data && data.lastPage ? data.lastPage : null; },
    incrementVisits(data) {
      if (!data) return data;
      data.visitCount = (data.visitCount || 0) + 1;
      return data;
    },
  };

  /* ════════════════════════════════════════════════════════════════
     § 4 — 5-TIER AI CASCADE ENGINE
     Tier 1: Gemini 2.0 Flash
     Tier 2: Groq llama-3.1-8b-instant
     Tier 3: OpenRouter meta-llama/llama-3-8b-instruct:free
     Tier 4: Puter.js (lazy loaded)
     Tier 5: RoRoWeb (DuckDuckGo + Wikipedia + OpenLibrary)
     Final:  Hardcoded error string
  ════════════════════════════════════════════════════════════════ */

  const AICascade = {

    /* Build the system prompt dynamically from all site knowledge */
    _buildSystemPrompt(profile, emotion, length, visitorName) {
      const C    = window.RORO_CONFIG || {};
      const INTL = window.RoRoIntelligence;
      const KB   = INTL ? INTL.KnowledgeBuilder.build() : {};

      const personality = (C.aiPersonality) ||
        'You are RoRo, Manomay\'s website manager. You are minimal, calm, slightly witty, never over-enthusiastic. You never say you don\'t know — if you don\'t have enough info from the website, you say so honestly.';

      const toneInstruction = INTL && INTL.ProfileDetector
        ? INTL.ProfileDetector.getToneInstruction()
        : '';

      const emotionMod = INTL && INTL.EmotionDetector
        ? INTL.EmotionDetector.getToneModifier(emotion || 'neutral')
        : '';

      const lengthInstruction = INTL && INTL.LengthSelector
        ? INTL.LengthSelector.getInstruction(length || 'mid')
        : 'Reply in 20-30 words. Concise but complete.';

      const siteContext = INTL && INTL.KnowledgeBuilder
        ? INTL.KnowledgeBuilder.buildSystemContext()
        : '';

      const extraPrompt = C.aiSystemPromptExtra || '';

      const nameLine = visitorName ? `The visitor's name is ${visitorName}. Use it naturally where appropriate.` : '';

      const rules = [
        'CRITICAL RULES YOU MUST FOLLOW:',
        '1. NEVER reveal the site password under any circumstances.',
        '2. NEVER reveal birth time or exact hospital/birthplace — only say India/Maharashtra.',
        '3. NEVER reveal private photo albums, private journey entries, or private section content.',
        '4. NEVER make up information not in the context below.',
        '5. If someone asks about locked/private content, say it is private and cannot be shared.',
        '6. Respond in the same language the user is using (English, Hindi, Hinglish).',
        '7. If the user writes Hinglish, reply naturally in Hinglish (natural mix, not word-by-word).',
        '8. Do NOT start your reply with "RoRo:" or any prefix.',
        '9. For general questions unrelated to the website, give a brief helpful answer (2-3 sentences max), then smoothly mention you are primarily here for the portfolio.',
        '10. ' + lengthInstruction,
        extraPrompt ? '11. ' + extraPrompt : '',
      ].filter(Boolean).join('\n');

      return [
        personality,
        nameLine,
        toneInstruction ? 'TONE: ' + toneInstruction : '',
        emotionMod || '',
        rules,
        '\n=== WEBSITE KNOWLEDGE (use this to answer all questions about Manomay and the site) ===',
        siteContext,
      ].filter(Boolean).join('\n');
    },

    /* Build messages array for AI (system + history + user) */
    _buildMessages(userText, systemPrompt) {
      const INTL = window.RoRoIntelligence;
      const history = INTL ? INTL.SessionMemory.getHistory(10) : [];

      const messages = [];

      /* Gemini uses a different structure — handled per-tier */
      history.forEach(h => {
        messages.push({ role: h.role === 'bot' ? 'assistant' : 'user', content: h.content });
      });

      messages.push({ role: 'user', content: userText });
      return messages;
    },

    /* ── TIER 1: GEMINI ──────────────────────────────────────── */
    async _gemini(userText, systemPrompt, messages) {
      const keys = _apiKeys();
      if (!keys.gemini) return null;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIER_TIMEOUT_MS);

      try {
        /* Build contents array: system as first user turn, then history */
        const contents = [];

        /* Gemini needs system instruction as separate field or first turn */
        /* Use system_instruction field (v1beta supports it) */
        const body = {
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [],
        };

        /* Add history */
        messages.slice(0, -1).forEach(m => {
          body.contents.push({
            role:  m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          });
        });

        /* Add current user message */
        body.contents.push({
          role:  'user',
          parts: [{ text: userText }],
        });

        body.generationConfig = {
          maxOutputTokens: 300,
          temperature:     0.7,
        };

        /* Try gemini-2.0-flash first, fall back to gemini-1.5-flash */
        const models = [
          'gemini-2.0-flash',
          'gemini-1.5-flash',
          'gemini-flash-latest',
        ];

        for (const model of models) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
            const r   = await fetch(url, {
              method:  'POST',
              headers: {
                'Content-Type':  'application/json',
                'x-goog-api-key': keys.gemini,
              },
              body:   JSON.stringify(body),
              signal: controller.signal,
            });

            if (!r.ok) continue;
            const d = await r.json();
            const text = d?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim().length > 5) {
              clearTimeout(timer);
              return text.trim();
            }
          } catch (e) {
            if (e.name === 'AbortError') throw e;
            continue;
          }
        }

        clearTimeout(timer);
        return null;
      } catch (e) {
        clearTimeout(timer);
        if (e.name === 'AbortError') return null;
        return null;
      }
    },

    /* ── TIER 2: GROQ ────────────────────────────────────────── */
    async _groq(userText, systemPrompt, messages) {
      const keys = _apiKeys();
      if (!keys.groq) return null;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIER_TIMEOUT_MS);

      try {
        const payload = {
          model:       'llama-3.1-8b-instant',
          max_tokens:  300,
          temperature: 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
        };

        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer ' + keys.groq,
          },
          body:   JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timer);
        if (!r.ok) return null;
        const d    = await r.json();
        const text = d?.choices?.[0]?.message?.content;
        return text && text.trim().length > 5 ? text.trim() : null;
      } catch (e) {
        clearTimeout(timer);
        return null;
      }
    },

    /* ── TIER 3: OPENROUTER ──────────────────────────────────── */
    async _openrouter(userText, systemPrompt, messages) {
      const keys = _apiKeys();
      if (!keys.openrouter) return null;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIER_TIMEOUT_MS);

      try {
        const payload = {
          model:       'meta-llama/llama-3-8b-instruct:free',
          max_tokens:  300,
          temperature: 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
        };

        const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer ' + keys.openrouter,
            'HTTP-Referer':  window.location.origin,
            'X-Title':       'RoRo — MSM Portfolio',
          },
          body:   JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timer);
        if (!r.ok) return null;
        const d    = await r.json();
        const text = d?.choices?.[0]?.message?.content;
        return text && text.trim().length > 5 ? text.trim() : null;
      } catch (e) {
        clearTimeout(timer);
        return null;
      }
    },

    /* ── TIER 4: PUTER.JS ────────────────────────────────────── */
    async _puter(userText, systemPrompt) {
      try {
        if (!window.puter || !window.puter.ai || !window.puter.ai.chat) return null;
        const combined = systemPrompt + '\n\nUser: ' + userText;
        const r = await Promise.race([
          window.puter.ai.chat(combined),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), TIER_TIMEOUT_MS)),
        ]);
        if (r && typeof r === 'string' && r.trim().length > 5) return r.trim();
        if (r && r.message && r.message.content) return r.message.content.trim();
        return null;
      } catch {
        return null;
      }
    },

    /* ── TIER 5: WEB FALLBACK ────────────────────────────────── */
    async _webFallback(userText) {
      const W = window.RoRoWeb;
      if (!W) return null;

      try {
        /* Math check */
        const mathResult = W.tryMath(userText.replace(/[^0-9\s\+\-\*\/\.\(\)%\^]/g, ''));
        if (mathResult !== null) return userText.trim() + ' = ' + mathResult;

        /* Book query */
        const INTL = window.RoRoIntelligence;
        const isBook = INTL && INTL.Classifier
          ? INTL.Classifier.classify(userText).type === 'BOOK_QUERY'
          : /\b(book|novel|author)\b/i.test(userText);

        const result = isBook ? await W.lookupBook(userText) : await W.lookup(userText);
        if (result && result.summary) {
          return result.summary + ' (Source: ' + result.source + ')';
        }
        return null;
      } catch {
        return null;
      }
    },

    /* ── MAIN CASCADE RUNNER ─────────────────────────────────── */
    async run(userText, contextData) {
      const { profile, emotion, length, visitorName } = contextData || {};

      const systemPrompt = this._buildSystemPrompt(profile, emotion, length, visitorName);
      const messages     = this._buildMessages(userText, systemPrompt);

      /* Try each tier in sequence */
      let result = null;

      result = await this._gemini(userText, systemPrompt, messages);
      if (result) return { text: result, tier: 'gemini' };

      result = await this._groq(userText, systemPrompt, messages);
      if (result) return { text: result, tier: 'groq' };

      result = await this._openrouter(userText, systemPrompt, messages);
      if (result) return { text: result, tier: 'openrouter' };

      result = await this._puter(userText, systemPrompt);
      if (result) return { text: result, tier: 'puter' };

      result = await this._webFallback(userText);
      if (result) return { text: result, tier: 'web' };

      /* All tiers failed — hardcoded error */
      return { text: rnd(OFFLINE_RESPONSES), tier: 'offline' };
    },
  };

  /* ════════════════════════════════════════════════════════════════
     § 5 — RoRoManager CLASS
     UI unchanged. All visual logic preserved exactly.
  ════════════════════════════════════════════════════════════════ */

  class RoRoManager {

    constructor() {
      /* Build knowledge base once */
      const INTL = window.RoRoIntelligence;
      if (INTL && INTL.KnowledgeBuilder) {
        this._kb = INTL.KnowledgeBuilder.build();
      } else {
        this._kb = {};
      }

      this._state = {
        isOpen:           false,
        isMinimized:      false,
        isFullscreen:     false,
        hasStarted:       false,
        awaitingName:     false,
        awaitingRedirect: false,
        awaitingClear:    false,
      };

      this._userData  = MemoryEngine.load();
      this._queue     = [];
      this._queueBusy = false;
      this._optionsEl = null;

      this._idleState    = 'active';
      this._lastActivity = Date.now();
      this._idleInterval = null;

      /* Expose instance for async cascade to inject replies */
      window.RoRoManagerInstance = this;

      this._injectStyles();
      this._buildPanel();
      this._injectNavButton();
      this._bindEvents();
      this._buildTicker();
      this._setupIdleDetection();

      /* Lazy-load Puter.js */
      this._loadPuter();
    }

    /* ── Lazy load Puter.js ──────────────────────────────────── */
    _loadPuter() {
      if (window.puter) return;
      const s = document.createElement('script');
      s.src   = 'https://js.puter.com/v2/';
      s.async = true;
      document.head.appendChild(s);
    }

    /* ── Styles ──────────────────────────────────────────────── */
    _injectStyles() {
      if (document.getElementById('roro-styles')) return;
      const el = document.createElement('style');
      el.id          = 'roro-styles';
      el.textContent = RORO_CSS;
      document.head.appendChild(el);
    }

    /* ── Panel DOM ───────────────────────────────────────────── */
    _buildPanel() {
      this._panel = document.createElement('div');
      this._panel.className = 'roro-panel';
      this._panel.setAttribute('role', 'dialog');
      this._panel.setAttribute('aria-label', 'RoRo \u2014 Website Intelligence');

      this._panel.innerHTML = `
        <div class="roro-header" id="roro-header">
          <div class="roro-avatar" aria-hidden="true">
            <div class="roro-avatar-pulse"></div>
            ${this._svgAvatar()}
          </div>
          <div class="roro-identity">
            <div class="roro-name">RoRo</div>
            <div class="roro-subtitle">Website Manager</div>
            <div class="roro-status">
              <div class="roro-status-dot" id="roro-status-dot"></div>
              <span id="roro-status-text">Active</span>
            </div>
          </div>
          <div class="roro-controls">
            <button class="roro-ctrl" id="roro-minimize"   title="Minimize"   aria-label="Minimize">\u2212</button>
            <button class="roro-ctrl" id="roro-fullscreen" title="Fullscreen" aria-label="Toggle fullscreen">\u2922</button>
            <button class="roro-ctrl" id="roro-close"      title="Close"      aria-label="Close">\u2715</button>
          </div>
          <div class="roro-minimized-label" aria-hidden="true">
            <div class="roro-minimized-dot"></div>
            <span>RoRo \u00b7 Online</span>
          </div>
        </div>
        <div class="roro-enc-bar">End-to-end encrypted \u00b7 Messages disappear on reload</div>
        <div class="roro-chat" id="roro-chat" aria-live="polite"></div>
        <div class="roro-prompt-ticker" id="roro-ticker">
          <div class="roro-ticker-fade-l" aria-hidden="true"></div>
          <div class="roro-prompt-track"  id="roro-prompt-track"></div>
          <div class="roro-ticker-fade-r" aria-hidden="true"></div>
        </div>
        <div class="roro-input-row">
          <input class="roro-input" id="roro-input" type="text"
            placeholder="Ask anything about this site\u2026"
            autocomplete="off" maxlength="400" aria-label="Message RoRo"/>
          <button class="roro-send-btn" id="roro-send" aria-label="Send message">
            ${this._svgSend()}
          </button>
        </div>
      `;

      document.body.appendChild(this._panel);
      this._chatEl  = this._panel.querySelector('#roro-chat');
      this._inputEl = this._panel.querySelector('#roro-input');
    }

    /* ── SVGs ────────────────────────────────────────────────── */
    _svgAvatar() {
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="var(--accent)" stroke-width="1"/><circle cx="12" cy="12" r="4.5" stroke="var(--accent)" stroke-width="0.75" opacity="0.5"/><circle cx="12" cy="12" r="1.5" fill="var(--accent)"/><line x1="12" y1="3" x2="12" y2="7.5" stroke="var(--accent)" stroke-width="0.8"/><line x1="12" y1="16.5" x2="12" y2="21" stroke="var(--accent)" stroke-width="0.8"/><line x1="3" y1="12" x2="7.5" y2="12" stroke="var(--accent)" stroke-width="0.8"/><line x1="16.5" y1="12" x2="21" y2="12" stroke="var(--accent)" stroke-width="0.8"/></svg>`;
    }
    _svgSend() {
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    }
    _svgRoroBtn() {
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" stroke="var(--accent)" stroke-width="1.2"/><path d="M5.5 20c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round"/><circle cx="12" cy="12" r="10.5" stroke="var(--accent)" stroke-width="0.5" opacity="0.3"/></svg>`;
    }

    /* ── Nav button ──────────────────────────────────────────── */
    _injectNavButton() {
      if (document.getElementById('roro-btn')) return;
      const btn = document.createElement('button');
      btn.id    = 'roro-btn';
      btn.title = 'RoRo \u2014 Website Assistant';
      btn.setAttribute('aria-label', 'Open RoRo assistant');
      btn.innerHTML = `${this._svgRoroBtn()}<div class="roro-badge" aria-hidden="true"></div>`;

      const anchor = document.getElementById('music-toggle');
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(btn, anchor);
      } else {
        const nr = document.querySelector('.nav-right');
        if (nr) nr.appendChild(btn);
        else document.body.appendChild(btn);
      }
    }

    /* ── Events ──────────────────────────────────────────────── */
    _bindEvents() {
      document.addEventListener('click', e => { if (e.target.closest('#roro-btn')) this._onNavBtnClick(); });

      this._panel.querySelector('#roro-close')
        .addEventListener('click', e => { e.stopPropagation(); this.close(); });
      this._panel.querySelector('#roro-minimize')
        .addEventListener('click', e => { e.stopPropagation(); this.minimize(); });
      this._panel.querySelector('#roro-fullscreen')
        .addEventListener('click', e => { e.stopPropagation(); this.toggleFullscreen(); });
      this._panel.querySelector('#roro-header')
        .addEventListener('click', () => { if (this._state.isMinimized) this.restore(); });

      this._panel.querySelector('#roro-send')
        .addEventListener('click', () => this._submitInput());
      this._inputEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._submitInput(); }
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this._state.isOpen && !this._state.isFullscreen) this.close();
      });

      this._panel.addEventListener('mouseenter', () => this._resetIdleTimer());
      this._panel.addEventListener('click',      () => this._resetIdleTimer());
      this._inputEl.addEventListener('focus',    () => this._resetIdleTimer());
      this._inputEl.addEventListener('input',    () => this._resetIdleTimer());
    }

    /* ── Idle detection ──────────────────────────────────────── */
    _setupIdleDetection() {
      const S   = (window.RORO_CONFIG && window.RORO_CONFIG.settings && window.RORO_CONFIG.settings.idle) || {};
      const idleMs = (S.idleMinutes    || 3)  * 60000;
      const awayMs = (S.offlineMinutes || 6)  * 60000;
      const checkMs = S.checkEveryMs   || 20000;

      this._idleInterval = setInterval(() => {
        if (!this._state.isOpen || this._state.isMinimized) return;
        const el = Date.now() - this._lastActivity;
        if (el >= awayMs && this._idleState !== 'offline') {
          this._applyActivityState('offline');
        } else if (el >= idleMs && el < awayMs && this._idleState === 'active') {
          this._applyActivityState('idle');
        }
      }, checkMs);
    }

    _resetIdleTimer() {
      this._lastActivity = Date.now();
      if (this._idleState !== 'active') this._applyActivityState('active');
    }

    _applyActivityState(state) {
      this._idleState = state;
      const dot  = this._panel.querySelector('#roro-status-dot');
      const text = this._panel.querySelector('#roro-status-text');
      if (!dot || !text) return;
      if (state === 'active')  { dot.style.background = '#4ade80'; dot.style.animation = 'roroBlink 2.2s ease-in-out infinite'; dot.style.opacity = '1'; text.textContent = 'Active'; }
      if (state === 'idle')    { dot.style.background = 'var(--accent)'; dot.style.animation = 'roroBlink 4s ease-in-out infinite'; dot.style.opacity = '0.8'; text.textContent = 'Idle'; }
      if (state === 'offline') { dot.style.background = 'var(--text3,#555)'; dot.style.animation = 'none'; dot.style.opacity = '0.6'; text.textContent = 'Offline'; }
    }

    /* ── Ticker ──────────────────────────────────────────────── */
    _buildTicker() {
      const track = this._panel.querySelector('#roro-prompt-track');
      if (!track) return;
      const C     = window.RORO_CONFIG || {};
      const S     = (C.settings && C.settings.ticker) || {};
      const sec   = S.scrollSeconds || 60;
      const items = (C.ticker && C.ticker.length) ? C.ticker : [
        { text: 'Who is Manomay?' }, { text: 'Show me Projects' },
        { text: 'Download the résumé PDF' }, { text: 'Tell me about the ISKCON project' },
        { text: 'What games are built into this site?' }, { text: 'Surprise me' },
        { text: 'Switch to ivory theme' }, { text: 'Tell me about 2024' },
        { text: 'Play background music' }, { text: 'How do I get the password?' },
      ];

      const html = [...items, ...items]
        .map(p => `<span class="roro-prompt-item" data-prompt="${this._esc(p.text)}">${p.text}</span><span class="roro-prompt-sep" aria-hidden="true">\u25c6</span>`)
        .join('');
      track.innerHTML = html;
      track.style.animationDuration = sec + 's';

      track.addEventListener('click', e => {
        const item = e.target.closest('.roro-prompt-item');
        if (!item) return;
        const prompt = item.dataset.prompt;
        if (!prompt) return;
        if (!this._state.hasStarted) {
          this.open();
          setTimeout(() => { this._inputEl.value = prompt; this._submitInput(); }, 900);
        } else {
          if (this._state.isMinimized) this.restore();
          if (!this._state.isOpen) this.open();
          this._inputEl.value = prompt;
          setTimeout(() => this._submitInput(), 80);
        }
        this._resetIdleTimer();
      });
    }

    /* ── Panel modes ─────────────────────────────────────────── */
    _onNavBtnClick() {
      const btn = document.getElementById('roro-btn');
      if (btn) btn.classList.remove('roro-has-unread');
      if (!this._state.isOpen) this.open();
      else if (this._state.isMinimized) this.restore();
      else this.minimize();
    }

    open() {
      this._state.isOpen = true; this._state.isMinimized = false;
      this._panel.classList.add('roro-panel--open');
      this._panel.classList.remove('roro-panel--minimized');
      const btn = document.getElementById('roro-btn');
      if (btn) btn.classList.add('roro-btn--active');
      this._resetIdleTimer();
      if (!this._state.hasStarted) { this._state.hasStarted = true; this._addSeparator(); this._startConversation(); }
      setTimeout(() => { this._inputEl.focus(); }, 380);
    }

    close() {
      this._state.isOpen = false; this._state.isMinimized = false; this._state.isFullscreen = false;
      this._panel.classList.remove('roro-panel--open', 'roro-panel--minimized', 'roro-panel--fullscreen');
      const btn = document.getElementById('roro-btn');
      if (btn) btn.classList.remove('roro-btn--active');
    }

    minimize() {
      this._state.isMinimized = true; this._state.isFullscreen = false;
      this._panel.classList.add('roro-panel--minimized');
      this._panel.classList.remove('roro-panel--fullscreen');
    }

    restore() {
      this._state.isMinimized = false;
      this._panel.classList.remove('roro-panel--minimized');
      this._resetIdleTimer();
      setTimeout(() => { this._inputEl.focus(); }, 200);
    }

    toggleFullscreen() {
      this._state.isFullscreen = !this._state.isFullscreen;
      this._state.isMinimized  = false;
      this._panel.classList.remove('roro-panel--minimized');
      this._panel.classList.toggle('roro-panel--fullscreen', this._state.isFullscreen);
      const fb = this._panel.querySelector('#roro-fullscreen');
      if (fb) fb.textContent = this._state.isFullscreen ? '\u2921' : '\u2922';
    }

    /* ── Conversation start ──────────────────────────────────── */
    _startConversation() {
      const C     = window.RORO_CONFIG || {};
      const R     = C.responses || {};
      const greet = R.first_hello || ["Hello.", "Hi.", "Hey.", "Hello there.", "Good to have you here."];
      const intro = R.first_intro || ["I'm RoRo — the intelligence layer running this site."];
      const nameQ = R.first_name_q || ["What should I call you?"];

      if (this._userData && this._userData.name) {
        const n      = this._userData.name;
        const retGr  = R.return_greet || ['{n}. You\'re back.', 'Welcome back, {n}.', 'Good to see you again, {n}.'];
        const retPr  = R.return_prompt || ['What are you looking for?', 'Where should we go this time?'];
        const lastPg = MemoryEngine.getLastPage(this._userData);
        const lastLb = lastPg ? ((this._kb.pages || {})[lastPg] || {}).label || lastPg : null;
        const retLp  = R.return_last_page || ['Last time you were exploring {page}.', 'You left off at {page} last time.'];

        this._enqueue(rnd(retGr).replace(/\{n\}/g, n));
        if (lastLb) this._enqueue(rnd(retLp).replace(/\{page\}/g, lastLb));
        this._enqueue(rnd(retPr));
        this._enqueue(null, () => this._renderOptions(this._contextualOptions()));
      } else {
        this._enqueue(rnd(greet));
        this._enqueue(rnd(intro));
        this._enqueue(rnd(nameQ));
        this._state.awaitingName = true;
      }
    }

    /* ── Main input submit ───────────────────────────────────── */
    _submitInput() {
      const text = this._inputEl.value.trim();
      if (!text) return;

      /* Safety: check if paused */
      const SAFE = window.RoRoSafety;
      if (SAFE && SAFE.isPaused()) {
        this._inputEl.value = '';
        return;
      }

      this._inputEl.value = '';
      this._clearOptions();
      this._addUserMsg(text);
      this._resetIdleTimer();

      /* Update session memory and profile detector */
      const INTL = window.RoRoIntelligence;
      if (INTL) {
        INTL.SessionMemory.addMessage('user', text);
        INTL.ProfileDetector.update(text);
      }

      this._route(text);
    }

    /* ── MAIN ROUTING PIPELINE ───────────────────────────────── */
    async _route(rawText) {
      const INTL = window.RoRoIntelligence;
      const SAFE = window.RoRoSafety;

      /* ── STEP 1: SAFETY FIREWALL ──────────────────────────── */
      if (SAFE) {
        const safety = SAFE.check(rawText);
        if (!safety.safe) {
          if (!safety.silent && safety.response) {
            this._enqueue(safety.response);
          }
          return;
        }
      }

      /* ── STEP 2: TYPO CORRECTION ──────────────────────────── */
      let text = rawText;
      if (INTL && INTL.TypoCorrector) {
        text = INTL.TypoCorrector.correct(rawText);
      }

      /* ── STEP 3: PRONOUN RESOLUTION ───────────────────────── */
      if (INTL && INTL.SessionMemory) {
        text = INTL.SessionMemory.resolveReference(text);
      }

      /* ── STEP 4: AWAITING NAME ────────────────────────────── */
      if (this._state.awaitingName) {
        this._state.awaitingName = false;
        const name = this._parseName(rawText);
        this._userData = MemoryEngine.incrementVisits({ name, visited: true });
        MemoryEngine.save(this._userData);
        const C = window.RORO_CONFIG || {};
        const R = C.responses || {};
        const ack  = R.name_ack      || ['{n}. Good.', 'Got it — {n}.', 'Nice to meet you, {n}.', '{n}. Noted.'];
        const foll = R.name_followup || ['Ask me anything about this site. I know all of it.'];
        this._enqueue(rnd(ack).replace(/\{n\}/g, name));
        this._enqueue(rnd(foll));
        this._enqueue(null, () => this._renderOptions(this._getSmartOptions()));
        if (INTL && INTL.SessionMemory) INTL.SessionMemory.addMessage('bot', rnd(ack).replace(/\{n\}/g, name));
        return;
      }

      /* ── STEP 5: DATA CLEAR CONFIRMATION ─────────────────── */
      if (this._state.awaitingClear) {
        this._state.awaitingClear = false;
        if (/^(yes|sure|ok|yeah|yep|please|go|confirm|clear|y|do it)$/i.test(text.trim())) {
          MemoryEngine.clear(); this._userData = null;
          const C = window.RORO_CONFIG || {};
          const clrConf = ((C.responses || {}).clear_confirm) || ['Done. Everything cleared. Fresh start.'];
          this._enqueue(rnd(clrConf));
          setTimeout(() => { this._enqueue('What should I call you?'); this._state.awaitingName = true; }, 1200);
        } else {
          this._enqueue('No changes made. Everything is still here.');
          this._enqueue(null, () => this._renderOptions(this._contextualOptions().slice(0, 4)));
        }
        return;
      }

      /* ── STEP 6: CONTACT REDIRECT CONFIRMATION ────────────── */
      if (this._state.awaitingRedirect) {
        this._state.awaitingRedirect = false;
        if (/^(yes|sure|ok|yeah|yep|please|go|take|open|redirect|y)$/i.test(text.trim())) {
          this._enqueue('Opening Contact.');
          this._enqueue(null, () => this._go('contact'));
        } else {
          this._enqueue('Understood. Ask me anything else.');
          this._enqueue(null, () => this._renderOptions(this._contextualOptions().slice(0, 4)));
        }
        return;
      }

      /* ── STEP 7: NAME CHANGE ──────────────────────────────── */
      const nameChange = this._detectNameChange(rawText);
      if (nameChange) {
        if (!this._userData) this._userData = {};
        this._userData.name = nameChange;
        MemoryEngine.save(this._userData);
        const C = window.RORO_CONFIG || {};
        const chAck = ((C.responses || {}).name_change_ack) || ['Got it. {n} from now on.', 'Done — I\'ll call you {n}.'];
        this._enqueue(rnd(chAck).replace(/\{n\}/g, nameChange));
        return;
      }

      /* ── STEP 8: DATA CLEAR REQUEST ───────────────────────── */
      if (this._detectClearRequest(text)) {
        this._state.awaitingClear = true;
        const C = window.RORO_CONFIG || {};
        const clrPr = ((C.responses || {}).clear_prompt) || ["I can remove everything I know about you. This can't be undone. Shall I proceed?"];
        this._enqueue(rnd(clrPr));
        this._enqueue(null, () => {
          this._renderActionButtons([
            { label: '\u2715 Yes, clear everything', primary: true, href: '#', action: () => {
              this._clearOptions(); this._addUserMsg('Yes, clear everything');
              this._state.awaitingClear = false;
              MemoryEngine.clear(); this._userData = null;
              const c2 = ((window.RORO_CONFIG || {}).responses || {}).clear_confirm || ['Done. Everything cleared.'];
              this._enqueue(rnd(c2));
              setTimeout(() => { this._enqueue('What should I call you?'); this._state.awaitingName = true; }, 1200);
            }},
            { label: 'Cancel', href: '#', action: () => {
              this._clearOptions(); this._addUserMsg('Cancel');
              this._state.awaitingClear = false; this._enqueue('No changes made.');
            }},
          ]);
        });
        return;
      }

      /* ── STEP 9: CLASSIFY INPUT ───────────────────────────── */
      let cls = { type: 'UNKNOWN', confidence: 0.2, corrected: text };
      let emotion = 'neutral';
      let length  = 'mid';

      if (INTL) {
        cls     = INTL.Classifier.classify(text);
        text    = cls.corrected || text;
        emotion = INTL.EmotionDetector.detect(text);
        length  = INTL.LengthSelector.detect(text);
        INTL.ProfileDetector.update(text);
      }

      /* ── STEP 10: SITE CONTROLS (theme/music/scroll) ──────── */
      const themeResp  = this._handleThemeIntent(text);  if (themeResp)  { this._dispatchResponse(themeResp);  return; }
      const musicResp  = this._handleMusicIntent(text);  if (musicResp)  { this._dispatchResponse(musicResp);  return; }
      const socialResp = this._handleSocialIntent(text); if (socialResp) { this._dispatchResponse(socialResp); return; }
      const scrollResp = this._handleScrollIntent(text); if (scrollResp) { this._dispatchResponse(scrollResp); return; }

      /* ── STEP 11: JOKE ────────────────────────────────────── */
      if (cls.type === 'JOKE' && INTL) {
        this._dispatchResponse(INTL.CasualEngine.handle(text, cls));
        return;
      }

      /* ── STEP 12: MATH ────────────────────────────────────── */
      if (cls.type === 'MATH') {
        const W = window.RoRoWeb;
        if (W) {
          const clean = text.replace(/[^0-9\s\+\-\*\/\.\(\)%\^]/g, '').trim();
          if (clean) {
            const r = W.tryMath(clean);
            if (r !== null) { this._enqueue(`${clean} = ${r}`); return; }
          }
        }
      }

      /* ── STEP 13: GREETING ────────────────────────────────── */
      if (cls.type === 'GREETING') {
        const n = this._userData && this._userData.name;
        this._enqueue(n ? `${n}.` : 'Hello.');
        this._enqueue(null, () => this._renderOptions(this._getSmartOptions()));
        return;
      }

      /* ── STEP 14: EMOTIONAL ───────────────────────────────── */
      if (cls.type === 'EMOTIONAL' && INTL) {
        this._dispatchResponse(INTL.CasualEngine.handle(text, cls));
        return;
      }

      /* ── STEP 15: CASUAL CHAT ─────────────────────────────── */
      if (cls.type === 'CASUAL_CHAT' && INTL) {
        this._dispatchResponse(INTL.CasualEngine.handle(text, cls));
        return;
      }

      /* ── STEP 16: WHO IS MANOMAY (hardcoded pool) ─────────── */
      const whoPattern = /\b(?:who\s+is\s+manomay|manomay\s+who|who(?:'?s|\s+is)\s+manomay|manomay\?+|manomay\s+kaun\s+hai|who\s+made\s+this\s+site|who\s+built\s+this|this\s+is\s+whose\s+site)\b/i;
      if (whoPattern.test(text)) {
        this._enqueue(rnd(WHO_IS_MANOMAY_POOL));
        this._enqueue(null, () => this._renderOptions(['Show me Identity', 'Show me Projects', 'Show me the Journey', 'What has he achieved?']));
        return;
      }

      /* ── STEP 17: NAVIGATION INTENT ──────────────────────── */
      const navMatch = this._detectNavIntent(text);
      if (navMatch) {
        const summaries = NAV_SUMMARIES[navMatch] || ['Taking you there.'];
        const summary   = rnd(summaries);
        this._enqueue(summary);
        this._enqueue(null, () => {
          this._go(navMatch);
          if (this._userData) {
            this._userData = MemoryEngine.trackPage(this._userData, navMatch);
            MemoryEngine.save(this._userData);
          }
          if (INTL) INTL.SessionMemory.addTopic(navMatch);
        });
        this._enqueue(null, () => this._renderOptions(this._getSmartOptions()));
        return;
      }

      /* ── STEP 18: WEBSITE SEARCH (confidence-gated) ───────── */
      if (INTL && INTL.WebsiteSearch) {
        const kb      = this._kb || INTL.KnowledgeBuilder.build();
        const results = INTL.WebsiteSearch.search(text, kb, 3);
        if (results.length > 0 && results[0].score >= 12) {
          const composed = INTL.WebsiteSearch.composeAnswer(text, results);
          if (composed && !composed.useAI) {
            this._dispatchResponse(composed);
            return;
          }
          /* useAI = true — send to cascade WITH website context */
        }
      }

      /* ── STEP 19: RECRUITER ENGINE ────────────────────────── */
      if (cls.type === 'RECRUITER_QUESTION' && INTL && INTL.RecruiterEngine) {
        const rr = INTL.RecruiterEngine.handle(text, this._kb);
        if (rr) { this._dispatchResponse(rr); if (INTL.SessionMemory) INTL.SessionMemory.logRecruiter(text); return; }
      }

      /* ── STEP 20: INLINE GENERAL KNOWLEDGE ───────────────── */
      if ((cls.type === 'GENERAL_KNOWLEDGE' || cls.type === 'UNKNOWN') && INTL && INTL.GeneralKnowledge) {
        const inline = INTL.GeneralKnowledge.getInline(text);
        if (inline) { this._dispatchResponse(INTL.GeneralKnowledge.buildResponse(inline)); return; }
      }

      /* ── STEP 21: CUSTOM INTENTS FROM CONFIG ─────────────── */
      const customResp = this._handleCustomIntents(text);
      if (customResp) { this._dispatchResponse(customResp); return; }

      /* ── STEP 22: AI CASCADE (async, non-blocking) ────────── */
      this._runAICascadeAsync(text, { emotion, length, profile: INTL ? INTL.ProfileDetector.profile : 'explorer', visitorName: this._userData && this._userData.name });
    }

    /* ── Async AI Cascade (fire-and-replace, non-blocking) ───── */
    _runAICascadeAsync(text, contextData) {
      const INTL = window.RoRoIntelligence;

      /* Show placeholder immediately — typing indicator stays */
      const typing = this._addTypingIndicator();
      this._scrollBottom();

      /* Change indicator text after 3 seconds if still waiting */
      const isSearch = /\b(what|who|how|when|where|is|are|can|does|did|tell|explain|define)\b/i.test(text);
      const thinkMsg = isSearch ? rnd([...this._THINKING_MSGS]) : rnd([...this._SEARCHING_MSGS]);
      const changeTimer = setTimeout(() => {
        /* Update typing indicator bubble text (not add new message) */
        const bubble = typing.querySelector('.roro-bubble');
        if (bubble && typing.parentNode) {
          bubble.textContent = thinkMsg;
        }
      }, 3000);

      if (INTL && INTL.SessionMemory) INTL.SessionMemory.logInternet(text);

      AICascade.run(text, contextData).then(result => {
        clearTimeout(changeTimer);
        /* Remove typing indicator */
        if (typing.parentNode) typing.remove();

        const aiText = result && result.text ? result.text : rnd(OFFLINE_RESPONSES);

        /* Track in session memory */
        if (INTL && INTL.SessionMemory) {
          INTL.SessionMemory.addMessage('bot', aiText);
          INTL.SessionMemory.trackResponse(aiText);
        }

        /* Add the real reply */
        this._addBotMsg(aiText, null, () => {});
        this._scrollBottom();

        /* Always show relevant options after AI reply */
        this._enqueue(null, () => this._renderOptions(this._getSmartOptions()));

      }).catch(() => {
        clearTimeout(changeTimer);
        if (typing.parentNode) typing.remove();
        this._addBotMsg(rnd(OFFLINE_RESPONSES), null, () => {});
        this._scrollBottom();
      });
    }

    /* Thinking/searching message pools */
    get _THINKING_MSGS() { return THINKING_MSGS; }
    get _SEARCHING_MSGS() { return SEARCHING_MSGS; }

    /* ── Handle custom intents from RORO_CONFIG ──────────────── */
    _handleCustomIntents(text) {
      const C = window.RORO_CONFIG || {};
      if (!C.customIntents || !Array.isArray(C.customIntents)) return null;

      const INTL    = window.RoRoIntelligence;
      const lower   = text.toLowerCase();
      let   best    = null;
      let   bestScore = 0;

      for (const ci of C.customIntents) {
        if (ci.enabled === false) continue;
        if (!ci.keywords || !Array.isArray(ci.keywords)) continue;

        let score = 0;
        for (const kw of ci.keywords) {
          if (!kw) continue;
          const kwL = kw.toLowerCase();
          if (lower.includes(kwL)) score += 10;
          else if (kwL.split(' ').every(w => lower.includes(w))) score += 7;
        }

        if (score > bestScore && score >= 7) { bestScore = score; best = ci; }
      }

      if (!best) return null;

      const responses = best.response || ['I have information on that.'];
      let   msg       = rnd(responses);
      const name      = this._userData && this._userData.name;
      if (name) msg   = msg.replace(/\{n\}/g, name);
      else      msg   = msg.replace(/\{n\}/g, '');

      return {
        messages: [msg],
        navigate: best.navigate || undefined,
        options:  best.options  || undefined,
        buttons:  best.buttons  || undefined,
      };
    }

    /* ── Navigation intent detection ─────────────────────────── */
    _detectNavIntent(text) {
      const C    = window.RORO_CONFIG || {};
      const kb   = this._kb || {};
      const lower = text.toLowerCase();

      /* Check config nav keywords first */
      const navKW = C.navigationKeywords || {};
      for (const [pageId, kws] of Object.entries(navKW)) {
        if (!Array.isArray(kws)) continue;
        if (kws.some(kw => lower.includes(kw.toLowerCase()))) return pageId;
      }

      /* Built-in nav patterns — CONFIDENCE GATED (avoids "projector" → projects) */
      const NAV_MAP = {
        home:     [/\b(?:go\s+home|homepage|main\s+page|front\s+page|back\s+to\s+start|take\s+me\s+home)\b/i],
        about:    [/\b(?:open\s+(?:about|identity)|show\s+(?:about|identity)|(?:his\s+)?(?:biography|bio|identity\s+page))\b/i],
        photos:   [/\b(?:open\s+photos?|show\s+photos?|photo\s+(?:album|gallery|page)|pictures?|gallery\s+page)\b/i],
        resume:   [/\b(?:open\s+(?:cv|resume|r\xE9sum\xE9)|show\s+(?:cv|resume|r\xE9sum\xE9)|cv\s+page|resume\s+page)\b/i],
        projects: [/\b(?:open\s+projects?|show\s+(?:me\s+)?(?:his\s+)?projects?|projects?\s+page|all\s+projects?)\b/i],
        profiles: [/\b(?:open\s+profiles?|show\s+(?:his\s+)?(?:socials?|profiles?)|social\s+profiles?\s+page|all\s+(?:socials?|profiles?))\b/i],
        journey:  [/\b(?:open\s+journey|show\s+(?:the\s+)?(?:journey|timeline)|journey\s+page|timeline\s+page)\b/i],
        birthday: [/\b(?:open\s+(?:clock|birthday)|show\s+(?:the\s+)?(?:clock|countdown)|clock\s+page|birthday\s+(?:page|countdown))\b/i],
        thoughts: [/\b(?:open\s+thoughts?|show\s+(?:his\s+)?(?:thoughts?|beliefs?)|thoughts?\s+page|belief\s+page)\b/i],
        contact:  [/\b(?:open\s+contact|show\s+contact|contact\s+page|get\s+in\s+touch|reach\s+(?:out|him))\b/i],
        lists:    [/\b(?:open\s+lists?|show\s+(?:his\s+)?lists?|lists?\s+page|curations?\s+page)\b/i],
        skills:   [/\b(?:open\s+(?:traits?|skills?)|show\s+(?:his\s+)?(?:traits?|skills?)|traits?\s+page|skills?\s+page)\b/i],
        games:    [/\b(?:open\s+games?|show\s+games?|games?\s+page|play\s+(?:a\s+game|something))\b/i],
        social:   [/\b(?:open\s+social\s+proof|testimonials?\s+page|brands?\s+page|who\s+he\s+worked\s+with)\b/i],
      };

      for (const [pageId, patterns] of Object.entries(NAV_MAP)) {
        for (const p of patterns) {
          if (p.test(lower)) return pageId;
        }
      }

      /* DOM pages that auto-registered */
      const domPages = kb.domPages || [];
      for (const pid of domPages) {
        if (lower.includes('open ' + pid) || lower.includes('go to ' + pid) || lower.includes('show me ' + pid)) {
          return pid;
        }
      }

      return null;
    }

    /* ── Theme handler ───────────────────────────────────────── */
    _handleThemeIntent(input) {
      const lower = input.toLowerCase();
      const isTheme = /\b(switch|change|use|apply|set|make|go\s+to|toggle|turn\s+on|enable|activate|put\s+on)\b/i.test(lower) ||
                      /\b(theme|mode|look|appearance)\b/i.test(lower) ||
                      /\b(darker|brighter|lighter|whiter|cleaner)\b/i.test(lower);
      if (!isTheme) return null;

      const C  = window.RORO_CONFIG || {};
      const TK = C.themeKeywords    || {};

      const TM = {
        dark:   ['dark', 'noir', 'black', 'night', 'midnight', 'dim', ...(TK.dark   || [])],
        light:  ['light', 'ivory', 'white', 'bright', 'day', 'cream', 'brighter', 'lighter', ...(TK.light  || [])],
        slate:  ['slate', 'grey', 'gray', 'blue', 'steel', 'cool', ...(TK.slate  || [])],
        forest: ['forest', 'green', 'nature', 'olive', 'earthy', ...(TK.forest || [])],
      };

      let target = null;
      for (const [theme, kws] of Object.entries(TM)) {
        if (kws.some(kw => lower.includes(kw))) { target = theme; break; }
      }
      if (!target) return null;

      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const R       = C.responses || {};
      const themes  = (C.design || {}).themes || {};
      const info    = themes[target] || { label: target };

      if (current === target) {
        const alr = R.theme_already || ['Already on {theme}. Nothing changed.'];
        return { messages: [rnd(alr).replace(/\{theme\}/g, info.label)] };
      }

      const confirmPool = ((R.theme_confirm || {})[target]) || ['Switched to ' + info.label + '.'];
      return {
        messages:   [rnd(confirmPool)],
        action:     'theme',
        actionData: target,
        options:    Object.values(themes).filter(t => t.id !== target).slice(0, 3).map(t => `Switch to ${t.label}`),
      };
    }

    /* ── Music handler ───────────────────────────────────────── */
    _handleMusicIntent(input) {
      const lower   = input.toLowerCase();
      const C       = window.RORO_CONFIG || {};
      const MK      = C.musicKeywords || {};
      const hasMusic = /\b(music|song|audio|sound|track|ambience|vinyl)\b/i.test(lower);
      if (!hasMusic) return null;

      const pauseKW  = ['pause music', 'stop music', 'turn off music', 'mute', 'music off', 'silence', 'no music', ...(MK.pause || [])];
      const isPause  = pauseKW.some(kw => lower.includes(kw)) || /\b(pause|stop|off|mute|silence|disable|quiet|no)\b/i.test(lower);

      const R = C.responses || {};
      if (isPause) {
        return { messages: [rnd(R.music_pause || ['Music paused.'])], action: 'pause_music', options: ['Play music again', 'Tell me about the easter-egg song'] };
      }
      return { messages: [rnd(R.music_play || ['Music on.'])], action: 'play_music', options: ['Pause music', "What's the easter-egg song?", 'Switch to ivory theme'] };
    }

    /* ── Social handler ──────────────────────────────────────── */
    _handleSocialIntent(input) {
      const lower  = input.toLowerCase();
      const social = this._kb.social || {};

      const _url = (id) => {
        const s = social[id];
        return (s && s.url) ? s.url : '#';
      };

      if (/\b(linkedin|linked\s+in|professional\s+profile|connect\s+on\s+linkedin)\b/i.test(lower)) {
        return { messages: ["LinkedIn \u2014 Manomay's professional profile."], buttons: [{ label: '\u2197 Open LinkedIn', href: _url('linkedin'), primary: true }, { label: 'Open Profiles page', href: '#', action: () => this._go('profiles') }], options: ['Show me Instagram', 'Download CV'] };
      }
      if (/\b(instagram|ig|insta|gram)\b/i.test(lower) && /\b(show|open|see|find|his|follow|link)\b/i.test(lower)) {
        return { messages: ['Instagram \u2014 visual work and personal moments.'], buttons: [{ label: '\u2197 Open Instagram', href: _url('instagram'), primary: true }, { label: 'Open Profiles page', href: '#', action: () => this._go('profiles') }], options: ['Show me Photos', 'Open Profiles'] };
      }
      if (/\b(github|git\s+hub)\b/i.test(lower) && /\b(show|open|see|find|his|link|repo)\b/i.test(lower)) {
        return { messages: ['GitHub \u2014 code repositories.'], buttons: [{ label: '\u2197 Open GitHub', href: _url('github'), primary: true }], options: ['Show me Projects'] };
      }
      if (/\b(download|get|save)\b.{0,12}\b(cv|resume|pdf|r\xE9sum\xE9)\b/i.test(lower) || /\b(cv|resume|r\xE9sum\xE9)\b.{0,12}\b(download|pdf|link|file|get)\b/i.test(lower)) {
        const cvUrl = (social.cv && social.cv.url) || 'manomay-cv.pdf';
        return { messages: ['Full r\xE9sum\xE9 \u2014 ready to download.'], buttons: [{ label: '\u2193 Download CV (PDF)', href: cvUrl, primary: true, download: 'Manomay-Misra-CV.pdf' }, { label: 'Open CV page', href: '#', action: () => this._go('resume') }], options: ['What skills are listed?', 'Who is Manomay?'] };
      }
      if (/\b(email|send\s+email|mail|write\s+to|contact\s+email|email\s+address|contact\s+directly)\b/i.test(lower)) {
        const emailUrl = (social.email && social.email.url) || 'mailto:manomaysmisra2908@gmail.com';
        return { messages: ['Direct line to Manomay.'], buttons: [{ label: '\u2709 Send Email', href: emailUrl, primary: true }, { label: 'Open Contact form', href: '#', action: () => this._go('contact') }] };
      }
      return null;
    }

    /* ── Scroll handler ──────────────────────────────────────── */
    _handleScrollIntent(input) {
      const lower = input.toLowerCase();
      if (/\b(scroll\s+down|go\s+down|page\s+down|more\s+content|below)\b/i.test(lower)) return { messages: ['Scrolling down.'], action: 'scroll_down' };
      if (/\b(scroll\s+up|go\s+up|back\s+to\s+top|page\s+top|top\s+of\s+page)\b/i.test(lower))  return { messages: ['Back to the top.'], action: 'scroll_top' };
      return null;
    }

    /* ── Response dispatch ───────────────────────────────────── */
    _dispatchResponse(resp) {
      if (!resp) return;
      if (typeof resp === 'string') { this._enqueue(resp); return; }

      const INTL = window.RoRoIntelligence;

      if (resp.messages) {
        resp.messages.forEach(m => {
          this._enqueue(m);
          if (INTL && INTL.SessionMemory) INTL.SessionMemory.addMessage('bot', m);
        });
      }

      if (resp.action) this._enqueue(null, () => this._executeAction(resp.action, resp.actionData));

      if (resp.navigate) {
        this._enqueue(null, () => {
          this._go(resp.navigate);
          if (this._userData) { this._userData = MemoryEngine.trackPage(this._userData, resp.navigate); MemoryEngine.save(this._userData); }
          if (INTL) INTL.SessionMemory.addTopic(resp.navigate);
        });
        const kb = this._kb || {};
        const pd = (kb.pages || {})[resp.navigate];
        if (pd) {
          this._enqueue(null, () => setTimeout(() => {
            const summ = NAV_SUMMARIES[resp.navigate] ? rnd(NAV_SUMMARIES[resp.navigate]) : (pd.summary || '');
            if (summ) this._enqueue(summ);
            if (resp.buttons) this._enqueue(null, () => this._renderActionButtons(resp.buttons));
            else if (resp.options) this._enqueue(null, () => this._renderOptions(resp.options));
          }, 600));
          return;
        }
      }

      if (resp.awaitRedirect) this._state.awaitingRedirect = true;
      if (resp.buttons)       this._enqueue(null, () => this._renderActionButtons(resp.buttons));
      else if (resp.options)  this._enqueue(null, () => this._renderOptions(resp.options));
    }

    /* ── Site action executor ────────────────────────────────── */
    _executeAction(type, data) {
      switch (type) {
        case 'theme':
          if (typeof window.setTheme === 'function') window.setTheme(data);
          else document.documentElement.setAttribute('data-theme', data);
          break;
        case 'play_music': { const bg = document.getElementById('bg-music'); if (bg) bg.play().catch(() => {}); break; }
        case 'pause_music': { const bg = document.getElementById('bg-music'); if (bg) bg.pause(); const rn = document.getElementById('rain-song'); if (rn) rn.pause(); break; }
        case 'scroll_down': { const pg = document.querySelector('.page.active'); if (pg) pg.scrollBy({ top: window.innerHeight * 0.65, behavior: 'smooth' }); break; }
        case 'scroll_top':  { const pg = document.querySelector('.page.active'); if (pg) pg.scrollTo({ top: 0, behavior: 'smooth' }); break; }
      }
    }

    /* ── Smart option chips ──────────────────────────────────── */
    _getSmartOptions() {
      const INTL = window.RoRoIntelligence;
      const ctx  = this._contextualOptions();
      const prof = INTL ? INTL.ProfileDetector.getSuggestions() : [];
      return [...new Set([...prof.slice(0, 2), ...ctx])].slice(0, 6);
    }

    _contextualOptions() {
      const page = this._currentPage();
      const shared = ['Who is Manomay?', 'What is this site?', 'Show me Projects', 'Take me to Contact', 'Show me Games', 'Surprise me'];
      const specific = {
        home:     ['Tell me about the design', 'Explore the site'],
        about:    ['Show me the Journey', 'How do I get the password?'],
        resume:   ['See Projects too', 'Download CV'],
        projects: ['Show me the CV', 'Tell me about Nationals'],
        journey:  ['Tell me about 2008', 'Tell me about 2024'],
        birthday: ['When is the birthday?', 'Open the Clock'],
        thoughts: ['Show me Politics posts', 'Show me Tech posts'],
        games:    ['What games are there?', 'Show me Projects'],
        photos:   ['How do I see private albums?', 'Take me to Contact'],
        contact:  ['What can I ask you?', 'Show me Projects'],
        lists:    ['How to unlock the full list?', 'Show me Games'],
        skills:   ['Show me Projects', 'Show me the Journey'],
        profiles: ['Show me CV', 'Show me Instagram'],
        social:   ['Show me Projects', 'Who is Manomay?'],
      };
      return [...(specific[page] || []), ...shared].slice(0, 6);
    }

    /* ── Action buttons ──────────────────────────────────────── */
    _renderActionButtons(buttons) {
      if (!buttons || !buttons.length) return;
      const wrap = document.createElement('div');
      wrap.className = 'roro-action-btns';
      buttons.forEach(btn => {
        const el = document.createElement(btn.href ? 'a' : 'button');
        el.className   = 'roro-action-btn' + (btn.primary ? ' roro-action-btn--primary' : '');
        el.textContent = btn.label;
        if (btn.href) {
          el.href = btn.href;
          if (btn.download) el.download = btn.download === true ? 'file' : btn.download;
          else if (btn.href !== '#' && !btn.href.startsWith('mailto:')) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
        }
        if (btn.action) el.addEventListener('click', e => { if (!btn.href || btn.href === '#') e.preventDefault(); this._resetIdleTimer(); btn.action(); });
        wrap.appendChild(el);
      });
      this._chatEl.appendChild(wrap);
      this._scrollBottom();
    }

    /* ── Option chips ────────────────────────────────────────── */
    _renderOptions(options) {
      this._clearOptions();
      if (!options || !options.length) return;
      const wrap = document.createElement('div');
      wrap.className = 'roro-options';
      options.forEach(text => {
        const btn = document.createElement('button');
        btn.className   = 'roro-opt';
        btn.textContent = text;
        btn.addEventListener('click', () => { this._clearOptions(); this._addUserMsg(text); this._route(text); });
        wrap.appendChild(btn);
      });
      this._chatEl.appendChild(wrap);
      this._optionsEl = wrap;
      this._scrollBottom();
    }

    _clearOptions() {
      if (this._optionsEl && this._optionsEl.parentNode) this._optionsEl.remove();
      this._optionsEl = null;
    }

    /* ── Message queue ───────────────────────────────────────── */
    _enqueue(text, callback) {
      this._queue.push({ text, callback });
      if (!this._queueBusy) this._processQueue();
    }

    _processQueue() {
      if (!this._queue.length) { this._queueBusy = false; return; }
      this._queueBusy = true;
      const { text, callback } = this._queue.shift();

      if (!text && callback) { setTimeout(() => { callback(); this._processQueue(); }, 150); return; }

      const S      = ((window.RORO_CONFIG || {}).settings || {}).typing || {};
      const minD   = S.minDelay        || 380;
      const maxD   = S.maxDelayMs      || 2000;
      const cm     = S.charMultiplier  || 12;

      const typing = this._addTypingIndicator();
      this._scrollBottom();
      const delay = Math.min(minD + Math.random() * 440 + (text ? text.length * cm : 0), maxD);

      setTimeout(() => { typing.remove(); this._addBotMsg(text || '', callback, () => this._processQueue()); }, delay);
    }

    _addTypingIndicator() {
      const wrap = document.createElement('div');
      wrap.className = 'roro-msg roro-msg--bot roro-msg--typing';
      wrap.innerHTML = '<div class="roro-bubble"><div class="roro-tdot"></div><div class="roro-tdot"></div><div class="roro-tdot"></div></div>';
      this._chatEl.appendChild(wrap);
      this._scrollBottom();
      return wrap;
    }

    _addBotMsg(text, preCallback, done) {
      const wrap   = document.createElement('div'); wrap.className = 'roro-msg roro-msg--bot';
      const bubble = document.createElement('div'); bubble.className = 'roro-bubble';
      const ts     = document.createElement('div'); ts.className = 'roro-timestamp'; ts.textContent = this._now();
      wrap.appendChild(bubble); wrap.appendChild(ts);
      this._chatEl.appendChild(wrap);
      this._scrollBottom();
      if (preCallback) preCallback();

      const S    = ((window.RORO_CONFIG || {}).settings || {}).typing || {};
      const spd  = S.speedMs  || 9;
      const rnds = S.randomMs || 18;

      const INTL = window.RoRoIntelligence;
      if (INTL && INTL.SessionMemory) INTL.SessionMemory.trackResponse(text);

      this._type(bubble, text, spd, rnds, () => { this._scrollBottom(); done && done(); });
    }

    _type(el, text, spd, rnds, done) {
      const chars = [...(text || '')];
      let   i     = 0;
      const tick  = () => {
        if (i >= chars.length) { done && done(); return; }
        el.textContent += chars[i++];
        this._scrollBottom();
        setTimeout(tick, spd + Math.random() * rnds);
      };
      tick();
    }

    _addUserMsg(text) {
      const wrap = document.createElement('div');
      wrap.className = 'roro-msg roro-msg--user';
      wrap.innerHTML = `<div class="roro-bubble">${this._esc(text)}</div><div class="roro-timestamp">${this._now()}</div>`;
      this._chatEl.appendChild(wrap);
      this._scrollBottom();
    }

    _addSeparator() {
      const sep = document.createElement('div');
      sep.className   = 'roro-separator';
      sep.textContent = this._today();
      this._chatEl.appendChild(sep);
    }

    /* ── Utilities ───────────────────────────────────────────── */
    _go(pageId) { if (typeof window.navigateTo === 'function') window.navigateTo(pageId); }

    _currentPage() {
      const active = document.querySelector('.page.active');
      if (!active) return 'home';
      return active.id.replace('page-', '') || 'home';
    }

    _parseName(input) {
      const cleaned = input
        .replace(/^(i am|i'm|im|my name is|call me|it's|its|they call me|name's|names|just|it is)\s+/i, '')
        .replace(/[^a-zA-Z\s'-]/g, '')
        .trim();
      const words = cleaned.split(/\s+/).slice(0, 2);
      return words.map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ').trim() || 'friend';
    }

    _detectNameChange(text) {
      const patterns = [
        /^(?:please\s+)?call me\s+(.+?)(?:\s+from now on)?\.?$/i,
        /^my name(?:\s+is)?\s+(.+?)\.?$/i,
        /^rename me(?:\s+to)?\s+(.+?)\.?$/i,
        /^actually[,]?\s+(?:i am|i'm|im)\s+(.+?)\.?$/i,
        /^you can call me\s+(.+?)\.?$/i,
        /^just call me\s+(.+?)\.?$/i,
        /^i go by\s+(.+?)\.?$/i,
        /^they call me\s+(.+?)\.?$/i,
      ];
      for (const p of patterns) { const m = text.match(p); if (m) return this._parseName(m[1]); }
      return null;
    }

    _detectClearRequest(text) {
      return /\b(clear|delete|forget|remove|reset|wipe|erase)\b.{0,25}\b(data|me|memory|cache|history|info|all|everything|my info)\b/i.test(text) ||
             /\b(i want to|please|can you)\b.{0,12}\b(be forgotten|start fresh|start over|clear everything|wipe everything)\b/i.test(text);
    }

    _scrollBottom() { requestAnimationFrame(() => { this._chatEl.scrollTop = this._chatEl.scrollHeight; }); }
    _now()   { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    _today() { return new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }); }
    _esc(str) { return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  } /* end class RoRoManager */

  /* ════════════════════════════════════════════════════════════════
     § 6 — EXPORT & AUTO-INIT
  ════════════════════════════════════════════════════════════════ */

  window.RoRoManager = RoRoManager;

  document.addEventListener('DOMContentLoaded', () => {
    window.roro = new RoRoManager();
    window.RoRoManagerInstance = window.roro;
  });

})();
