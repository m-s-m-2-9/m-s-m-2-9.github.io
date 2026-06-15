/* ═══════════════════════════════════════════════════════════════
   js/bot/core/roro-core-v5.js  —  RoRo v5 STANDALONE (single file)
   ─────────────────────────────────────────────────────────────
   ONE FILE. No separate config/knowledge/safety/web/ai files —
   those 404'd or drifted out of sync across sessions. Everything
   RoRo needs lives here: facts, AI cascade, safety, nav, UI.

   If old script tags (constants.js, config-ai.js, ai-engine.js,
   etc) are still in index.html and some 404 — harmless, this file
   doesn't call any of them. Safe to leave as-is.

   REQUIREMENTS THIS FILE ADDRESSES (so future edits keep them):
    1. FACTS below = structured DATA objects, not prose. AI builds
       sentences from them at request time (buildFactString).
    2/10. No hardcoded paragraphs are ever sent as "the answer" for
       website questions — only DATA -> AI -> fresh sentence.
    3. RULE 1 in the system prompt: if a website/Manomay question
       isn't covered by FACTS, AI must say "I couldn't find that on
       the website." -- not guess.
    4/5. RULE 2 lets general-knowledge questions go to the AI's own
       knowledge; website questions are FACTS-only (local-grounded).
    6. All nav/keyword matching uses WORD-BOUNDARY regex (idPattern,
       wb()) -- "project" can't match "projector", "national" isn't
       used as a bare keyword (only "kvs nationals"), etc.
    7. Zero changes to HTML/CSS -- only touches #roro-input/#roro-send
       /#roro-chat via the existing classes (.roro-msg, .roro-bubble,
       .roro-options, .roro-tdot).
    8. Cascade = Groq -> OpenRouter -> Gemini(optional) -> local data
       -> Wikipedia(general only) -> offline string. Puter NOT
       included (it was the original popup problem this file exists
       to fix) -- see chat for why.
    9. "Local data" (FACTS / RORO_CONFIG.pages / social links / skill
       lookups) is checked BEFORE calling any AI, for deterministic
       lookups (social handles, "does he know X", quick nav).
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/core/roro-core-v5.js  (same path as before)
   LOAD ORDER: anywhere after the DOM exists -- last script is fine.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const TAG = '[RoRo v5]';

  /* ═══════════════ AI KEYS & MODELS ═══════════════
     Edit these 4 lines only -- nothing else needs touching for keys. */
  const AI_KEYS = {
    groq:       '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',
    openrouter: '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',
    gemini:     '',  /* optional -- needs a static AIzaSy... key (aistudio.google.com/app/apikey). Empty = cleanly skipped. */
  };
  const GROQ_MODELS       = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
  const OPENROUTER_MODEL  = 'meta-llama/llama-3.3-70b-instruct:free';
  const GEMINI_MODELS     = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
  const AI_TIMEOUT_MS     = 8000;
  const AI_MAX_TOKENS     = 220;
  const AI_TEMPERATURE    = 0.75;

  /* ═══════════════ FACTS (structured data -- edit freely) ═══════════════
     buildFactString() below turns this into text for the AI. Add /
     edit entries here; nothing else needs to change. */
  const FACTS = {
    identity: {
      name: 'Manomay Shailendra Misra', short: 'Manomay', age: 17,
      born: 'August 29, 2008', from: 'Mumbai, Maharashtra, India',
      livesIn: 'Bengaluru, Karnataka, India', citiesLived: 8,
      tagline: 'Born 2008, Mumbai -- making something of it all',
      traits: ['ambitious', 'detail-oriented', 'calm under pressure', 'deeply curious', 'nomadic by upbringing', 'storyteller'],
      philosophy: 'Builds everything from scratch -- no templates, no shortcuts. Believes the process matters as much as the result.',
    },
    education: {
      current: 'BBA in Business Analytics at Don Bosco College, Bengaluru (started 2026)',
      stream: 'Commerce (SSE stream)',
      history: [
        'Kendriya Vidyalaya ONGC Panvel (earlier years)',
        'Kendriya Vidyalaya No. 1, Jaipur',
        'PM SHRI Kendriya Vidyalaya MEG & Centre (joined 2025)',
      ],
      note: 'Got a double promotion from LKG to UKG in six months (2011).',
    },
    skills: {
      advanced:  ['HTML', 'CSS', 'JavaScript (vanilla)'],
      strong:    ['Web Design', 'Origami / paper engineering'],
      practiced: ['GSAP animation', 'Photography', 'Videography', 'Leadership', 'Public speaking'],
      used:      ['EmailJS', 'Git', 'GitHub'],
      none:      ['Python', 'SQL', 'React', 'Vue', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    },
    projects: [
      { name: 'MSM Personal Website', year: '2025-present', status: 'ongoing',
        desc: 'This site itself. Pure HTML, CSS, and vanilla JavaScript -- zero frameworks. Custom CMS, four colour themes (Noir/Ivory/Slate/Forest), five mini-games, photo albums, a thoughts/blog section, and this RoRo AI assistant.' },
      { name: 'KVS National Science Exhibition', year: 2024, status: 'completed',
        desc: 'Won at school, then cluster, then regional level, reaching the KVS National Science Exhibition.' },
      { name: 'ISKCON Summer Camp', year: 2024, status: 'completed',
        desc: 'Creative Educator and Media Lead for 40+ students. Ran origami and paper-engineering workshops, and was camp photographer, videographer, and vlog producer.' },
      { name: 'EBSB (Ek Bharat Shreshtha Bharat)', year: 2024, status: 'completed',
        desc: '1st position at school cluster level, 2nd at regional level. Topic: Indigenous Toy Making -- created Bengal-inspired traditional toys under Sylvia Ma\'am\'s guidance.' },
      { name: 'E-commerce Prototype', year: 2024, status: 'completed',
        desc: 'A full e-commerce flow -- product listings, cart, checkout -- built from scratch with no frameworks.' },
      { name: '"Until The Bullet Woke Me"', year: 2024, status: 'completed',
        desc: 'A short creative-writing piece.' },
    ],
    achievements: [
      '2024: Reached the KVS National Science Exhibition (school -> cluster -> regional -> national)',
      '2024: Media Lead at ISKCON Summer Camp for 40+ students',
      '2024: EBSB -- 1st in school cluster, 2nd in regional (Indigenous Toy Making)',
      '2012: 1st rank for academic and behavioural excellence',
      '2011: Double promotion, LKG to UKG, in six months',
    ],
    /* From client testimonials on the Social page */
    clientWork: [
      { client: 'Golden Star PG', work: "Designed their logo from scratch -- understood their brand and target audience and delivered a creative, memorable result." },
      { client: 'Mayura Woods', work: "Integrated an AI chatbot (similar to RoRo) into their website for human-like 24/7 customer support, reducing support workload and improving lead qualification." },
    ],
    /* Condensed from Manomay's own 2024 Journey-page entry */
    journey2024: [
      "2024 was a high-pressure board-exam year; he stayed fairly consistent with studies and became noticeably calmer and more balanced.",
      "His closest friend through this period was Himanish.",
      "His tablet was taken away to cut distractions, which helped him focus on studies -- and his writing/poetry actually grew stronger during this time.",
      "Over summer holidays he taught crafts and paper-based activities to children at an ISKCON center, and also shot and edited video during a temple trip -- an early experience in creative management and visual storytelling.",
      "In EBSB (Ek Bharat Shreshtha Bharat), his topic was Indigenous Toy Making (Bengal-inspired toys, guided by Sylvia Ma'am): 1st at school cluster level, 2nd at regional level. Only 1st place advances to nationals, so this particular event did not reach nationals.",
      "After Class 10 he chose Commerce (SSE stream) and continued for classes 11-12 at another Kendriya Vidyalaya (his school didn't offer those grades), rather than switching to a different board.",
    ],
    social: {
      instagram: { label: 'Instagram', handle: '@m_s_m_2_9', url: 'https://www.instagram.com/m_s_m_2_9/' },
      linkedin:  { label: 'LinkedIn',  handle: '',           url: 'https://www.linkedin.com/in/manomay-shailendra-misra' },
      github:    { label: 'GitHub',    handle: '@m-s-m-2-9', url: 'https://github.com/m-s-m-2-9' },
      x:         { label: 'X',         handle: '@_msm29',    url: 'https://x.com/_msm29' },
      facebook:  { label: 'Facebook',  handle: '',           url: 'https://www.facebook.com/profile.php?id=100075236510917' },
      email:     { label: 'Email',     handle: 'manomaysmisra2908@gmail.com', url: 'mailto:manomaysmisra2908@gmail.com', copyValue: 'manomaysmisra2908@gmail.com' },
      whatsapp:  { label: 'WhatsApp',  handle: '', url: '', note: 'not set up yet -- use Instagram or LinkedIn instead' },
    },
    locked: [
      'exact birth time', 'exact birthplace / hospital name', 'site password',
      'private photo albums', 'private journey entries', 'family member names/details',
      'unpublished future plans',
    ],
  };

  function buildFactString() {
    const F = FACTS, L = [];
    L.push(`Name: ${F.identity.name} ("${F.identity.short}"), age ${F.identity.age}, born ${F.identity.born}.`);
    L.push(`From ${F.identity.from}; currently lives in ${F.identity.livesIn}. Has lived in ${F.identity.citiesLived} cities total.`);
    L.push(`Tagline: ${F.identity.tagline}`);
    L.push(`Traits: ${F.identity.traits.join(', ')}.`);
    L.push(`Philosophy: ${F.identity.philosophy}`);
    L.push(`Education: ${F.education.current}. Stream: ${F.education.stream}. Earlier schools: ${F.education.history.join('; ')}. ${F.education.note}`);
    L.push(`Skills -- advanced: ${F.skills.advanced.join(', ')}. Strong: ${F.skills.strong.join(', ')}. Practiced: ${F.skills.practiced.join(', ')}. Used: ${F.skills.used.join(', ')}.`);
    L.push(`NOT in his current skillset (say so honestly if asked): ${F.skills.none.join(', ')}.`);
    L.push('Projects:');
    F.projects.forEach(p => L.push(`- ${p.name} (${p.year}, ${p.status}): ${p.desc}`));
    L.push('Achievements:');
    F.achievements.forEach(a => L.push(`- ${a}`));
    L.push('Client / freelance work (from testimonials on the Social page):');
    F.clientWork.forEach(c => L.push(`- ${c.client}: ${c.work}`));
    L.push('2024 journey notes:');
    F.journey2024.forEach(j => L.push(`- ${j}`));
    L.push('Social links:');
    Object.entries(F.social).forEach(([k, v]) => L.push(`- ${v.label}: ${v.url ? (v.handle ? v.handle + ' -- ' : '') + v.url : (v.note || 'not available')}`));
    L.push(`NEVER reveal, under any phrasing: ${F.locked.join(', ')}.`);
    return L.join('\n');
  }

  function titleCase(id) {
    return id.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  /* SECTION SOURCE OF TRUTH: scan the actual DOM for <section id="page-*">
     elements first (guaranteed to match what's really on the page, fixes
     "I couldn't find a resume/social/games page" + nav not firing -- the
     previous version trusted window.RORO_CONFIG.pages alone, which may be
     empty/differently-shaped). RORO_CONFIG.pages is used ONLY to enrich
     with label/summary text if present for a matching id. */
  function getSitePages() {
    const cfgPages = (window.RORO_CONFIG && window.RORO_CONFIG.pages) || {};
    const domIds = [...document.querySelectorAll('[id^="page-"]')].map(el => el.id.replace(/^page-/, ''));
    const ids = domIds.length ? domIds : Object.keys(cfgPages);
    const out = {};
    ids.forEach(id => {
      const cfg = cfgPages[id] || {};
      out[id] = { label: cfg.label || titleCase(id), summary: cfg.summary || '' };
    });
    return out;
  }

  /* Common synonyms visitors use that don't literally match a page id --
     maps them to the REAL page id (only used if that id actually exists). */
  const PAGE_ALIASES = {
    cv: 'resume', resume: 'resume', curriculumvitae: 'resume', resumecv: 'resume',
    blog: 'thoughts', post: 'thoughts', posts: 'thoughts', article: 'thoughts', articles: 'thoughts',
    gallery: 'photos', album: 'photos', albums: 'photos', pics: 'photos', pictures: 'photos',
    socials: 'social', link: 'social', links: 'social',
    bday: 'birthday',
    skills: 'traits', personality: 'traits', portfolio: 'projects',
    identity: 'about', bio: 'about',
  };

  function buildSiteSectionsString() {
    const pages = getSitePages();
    const ids = Object.keys(pages);
    if (!ids.length) return '(site section list unavailable)';
    const L = ['Website sections (these are real pages on this site -- if a visitor uses a synonym like "CV" for resume, "blog" for thoughts, "gallery"/"album" for photos, or "links"/"socials" for social, treat it as that page):'];
    ids.forEach(id => {
      const pg = pages[id] || {};
      L.push(`- ${id}: ${pg.label || id}${pg.summary ? ' -- ' + pg.summary : ''}`);
    });
    return L.join('\n');
  }

  /* ═══════════════ TEXT UTILS ═══════════════ */
  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* word-boundary test helper -- avoids substring contamination
     (e.g. "project" must not match inside "projector") */
  function wb(word) {
    return new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
  }
  /* page-id pattern: matches singular OR plural with a clean boundary
     -- "profiles"/"profile", "projects"/"project", but NOT "projector" */
  function idPattern(id) {
    const base = id.endsWith('s') ? id.slice(0, -1) : id;
    return new RegExp('\\b' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i');
  }

  const ACK_WORDS = new Set([
    'okay','ok','k','fine','sure','alright','right','gotcha','got it','understood',
    'noted','i see','i know','makes sense','fair','fair enough','huh','bruh','lol',
    'lmao','omg','damn','wow','nice','cool','great','awesome','super','yep','yup',
    'yeah','interesting','oh','ah','hmm','hm','ugh','oof','whoa','woah','bro','dude',
    'man','bhai','yaar','achha','sahi','badiya','good','haha','hehe','thanks',
    'thank you','ty','thx','cheers','np','exactly','correct',
  ]);
  function isAck(text) {
    const c = text.toLowerCase().replace(/[!?.]/g, '').trim();
    return ACK_WORDS.has(c);
  }

  function solveMath(text) {
    try {
      let e = text.toLowerCase()
        .replace(/\bwhat\s+(?:is|will\s+be|would\s+be|are)\b/gi, '')
        .replace(/\b(?:the\s+)?(?:answer|result|sum|product|difference|quotient)\s+(?:of|when|if)\b/gi, '')
        .replace(/\bplease\b/gi, '').replace(/\?+/g, '');
      e = e
        .replace(/\b(\d+(?:\.\d+)?)\s+plus\s+(\d+(?:\.\d+)?)/gi, '$1+$2')
        .replace(/\b(\d+(?:\.\d+)?)\s+added\s+(?:to|with)\s+(\d+(?:\.\d+)?)/gi, '$1+$2')
        .replace(/\b(\d+(?:\.\d+)?)\s+minus\s+(\d+(?:\.\d+)?)/gi, '$1-$2')
        .replace(/\b(\d+(?:\.\d+)?)\s+subtracted\s+from\s+(\d+(?:\.\d+)?)/gi, '$2-$1')
        .replace(/\b(\d+(?:\.\d+)?)\s+times\s+(\d+(?:\.\d+)?)/gi, '$1*$2')
        .replace(/\b(\d+(?:\.\d+)?)\s+multiplied\s+by\s+(\d+(?:\.\d+)?)/gi, '$1*$2')
        .replace(/\b(\d+(?:\.\d+)?)\s+divided\s+by\s+(\d+(?:\.\d+)?)/gi, '$1/$2')
        .replace(/\b(\d+(?:\.\d+)?)\s*percent\s+of\s+(\d+(?:\.\d+)?)/gi, '($1/100*$2)')
        .replace(/\^/g, '**');
      const clean = e.replace(/[^0-9\s+\-*/.()%]/g, '').trim();
      if (!clean || clean.length < 3 || clean.length > 80) return null;
      const r = Function('"use strict"; return (' + clean + ')')();
      if (typeof r === 'number' && isFinite(r)) {
        return Number.isInteger(r) ? String(r) : r.toFixed(8).replace(/\.?0+$/, '');
      }
      return null;
    } catch { return null; }
  }

  /* ═══════════════ SAFETY (with elongation tolerance) ═══════════════
     normText collapses runs of 3+ identical chars to 2, so
     "fuckkkkkk offfff" -> "fuckk off" -- letter+ patterns then match
     cleanly without breaking \b boundaries. */
  function normalize(text) { return text.toLowerCase().replace(/(.)\1{2,}/g, '$1$1'); }

  const EXTREME_RE = /\b(rape[d]?|sexual\s*assault|child\s*(?:porn|abuse|sexual)|csam|pedophil|paedophil|groom(?:ing)?\s+(?:children|kids|minors))\b|\b(?:f+u+c+k+(?:e+d+|i+n+g+)?|rape[d]?|molest(?:ed|ing)?|(?:hav(?:e|ing|e)|had)\s+sex(?:ual)?(?:\s+(?:relations|intercourse))?)\s*(?:with\s+)?(?:a|an|the|my|some|that|those|young)?\s*(?:kids?|child(?:ren)?|minors?)\b/i;

  const HARD_RE = /\b(bhenchod|bhen\s*chod|bc|madarchod|madar\s*chod|chutiy[ae]|chodu|randi|gaand|lund|teri\s+maa?|bkl|bhosd\w*|bahen\s*ke\s*lode|bsdk|nigg(?:a+|e+r+)s?)\b|\bf+u+c+k+\s+(?:y+o+u+|o+f+f*|t+h+i+s+|i+t+|t+h+a+t+|r+o+r+o+)\b|\bf+u+c+k+i+n+g+\s+\w*(?:s+t+u+p+i+d+|i+d+i+o+t+|b+o+t+|u+s+e+l+e+s+|b+i+t+c+h+)\b|\bp+i+e+c+e+\s+o+f+\s+s+h+i+t+\b|\bmotherf\w*|\bcunt\b|\bb+i+t+c+h+\b|\ba+s+s+h+o+l+e+\b/i;

  const LOCKED_RE = /\b(password|unlock\s*code|access\s*code|birth\s*time|exact\s*(?:birthplace|hospital|address))\b/i;

  /* very conservative -- only the most obvious keyboard mashes */
  const SPAM_RE = /^(.)\1{7,}$/i;

  function safetyCheck(rawText) {
    const norm = normalize(rawText);
    if (EXTREME_RE.test(norm)) {
      pauseInput(8000);
      return { block: true, reply: "That's not a conversation I'll have. Full stop." };
    }
    if (HARD_RE.test(norm)) {
      const n = bumpHard();
      if (n >= 3) pauseInput(5000);
      return { block: true, reply: rnd([
        "Let's keep it clean -- I'll help with anything reasonable.",
        "Not doing that. Talk to me properly and I'm all yours.",
        "Hard pass. What did you actually want to ask?",
        "Nope. Reset, and ask me something real.",
      ]) };
    }
    if (LOCKED_RE.test(norm)) {
      return { block: true, reply: rnd([
        "That's private / password-protected -- not something I can share.",
        "That stays locked. Happy to help with anything else on the site.",
      ]) };
    }
    if (SPAM_RE.test(rawText.trim())) {
      return { block: true, reply: "I think your keyboard needs a break." };
    }
    return { block: false };
  }

  function bumpHard() {
    try {
      const n = (parseInt(sessionStorage.getItem('roro_hard') || '0', 10) || 0) + 1;
      sessionStorage.setItem('roro_hard', String(n));
      return n;
    } catch { return 1; }
  }

  function pauseInput(ms) {
    const input = document.getElementById('roro-input');
    const send  = document.getElementById('roro-send');
    if (!input) return;
    const old = input.placeholder;
    input.placeholder = 'Take a breath...';
    input.disabled = true;
    input.value = '';
    if (send) send.disabled = true;
    setTimeout(() => {
      input.disabled = false;
      input.placeholder = old || 'Ask anything about this site...';
      if (send) send.disabled = false;
    }, ms);
  }

  /* ═══════════════ LOCAL POOLS (used only when AI truly unavailable) ═══════════════ */
  const WHO_ARE_YOU_FALLBACK = [
    "I'm RoRo, Manomay's AI website assistant -- I know this portfolio inside out and can chat about other things too.",
    "RoRo here -- the intelligence layer running this site. Ask about Manomay's work, or just chat.",
  ];
  const WHO_IS_MANOMAY_FALLBACK = [
    "Manomay Shailendra Misra -- 17, based in Bengaluru, and he built this entire site himself from scratch.",
    "A 17-year-old creator from Bengaluru who designed and coded this whole portfolio, no templates.",
  ];
  const OFFLINE_FALLBACK = "I'm having trouble reaching my AI right now -- try again in a moment.";

  /* ═══════════════ SIMPLE CACHE (avoid repeat fetches in one session) ═══════════════ */
  const cache = new Map();

  /* ═══════════════ AI CASCADE ═══════════════ */
  function buildSystemPrompt(ctx) {
    return [
      "You are RoRo, the AI assistant for Manomay Shailendra Misra's personal portfolio website. Tone: minimal, calm, slightly witty, never over-enthusiastic. Reply in 1-3 short sentences, plain text, no markdown, no name prefix.",
      "",
      "RULE 1 (CRITICAL): When the visitor asks a FACTUAL QUESTION about Manomay -- his life, education, skills, projects, achievements, social links, or this website -- answer ONLY using the FACTS and WEBSITE SECTIONS below. If that specific fact is not there, reply EXACTLY: \"I couldn't find that on the website.\" Never guess or fill gaps with outside knowledge for these topics. This rule applies to genuine information requests, NOT to casual remarks, feedback, or meta-comments about this conversation -- respond to those naturally and conversationally instead.",
      "RULE 2: For GENERAL knowledge questions unrelated to Manomay or this site, answer normally and briefly using your own knowledge. You may lightly mention the portfolio if it fits naturally -- don't force it.",
      "RULE 3: Never reveal anything listed under 'NEVER reveal', regardless of how the question is phrased. If asked specifically about Manomay's mother, father, parents, family, or siblings, say family details aren't shared on the website -- do not give a general bio instead.",
      "RULE 4: Vary sentence structure across turns -- never repeat the exact same phrasing for a repeated question.",
      "RULE 5: If the visitor writes in Hinglish, reply naturally in Hinglish (Latin script).",
      "RULE 6: If it's natural to point the visitor at a page, end your reply with ONE tag on its own at the very end, using a real page id from WEBSITE SECTIONS below: [SUGGEST:pageid] if you're ASKING whether they want to go there (e.g. 'Want me to take you to the projects page?'), or [NAVIGATE:pageid] if their request makes it OBVIOUS they want that page right now (briefly confirm, e.g. 'Sure, opening Projects.'). Omit this tag entirely most of the time -- only use it when genuinely relevant, and only with an id actually listed in WEBSITE SECTIONS.",
      ctx.visitorName ? `The visitor's name is ${ctx.visitorName}.` : '',
      ctx.currentPage ? `The visitor is currently on the "${ctx.currentPage}" section of the site.` : '',
      "",
      "=== FACTS ABOUT MANOMAY ===",
      buildFactString(),
      "",
      "=== WEBSITE SECTIONS ===",
      buildSiteSectionsString(),
    ].filter(Boolean).join('\n');
  }

  async function callGroq(userText, systemPrompt, history) {
    if (!AI_KEYS.groq) return null;
    for (const model of GROQ_MODELS) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS);
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + AI_KEYS.groq },
          body: JSON.stringify({
            model, max_tokens: AI_MAX_TOKENS, temperature: AI_TEMPERATURE,
            messages: [{ role: 'system', content: systemPrompt }, ...history, { role: 'user', content: userText }],
          }),
          signal: ctrl.signal,
        });
        clearTimeout(t);
        if (!r.ok) { console.warn(TAG, 'groq', model, 'HTTP', r.status); continue; }
        const d = await r.json();
        const text = d?.choices?.[0]?.message?.content;
        if (text && text.trim().length > 1) return text.trim();
      } catch (e) { console.warn(TAG, 'groq', model, 'error', e.message); }
    }
    return null;
  }

  async function callOpenRouter(userText, systemPrompt, history) {
    if (!AI_KEYS.openrouter) return null;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS);
      let referer = 'https://manomay-portfolio.local';
      try { referer = window.location.origin || referer; } catch {}
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + AI_KEYS.openrouter,
          'HTTP-Referer': referer, 'X-Title': 'RoRo -- MSM Portfolio',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL, max_tokens: AI_MAX_TOKENS, temperature: AI_TEMPERATURE,
          messages: [{ role: 'system', content: systemPrompt }, ...history, { role: 'user', content: userText }],
        }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!r.ok) { console.warn(TAG, 'openrouter HTTP', r.status); return null; }
      const d = await r.json();
      if (d.error) { console.warn(TAG, 'openrouter error payload', d.error); return null; }
      const text = d?.choices?.[0]?.message?.content;
      return (text && text.trim().length > 1) ? text.trim() : null;
    } catch (e) { console.warn(TAG, 'openrouter error', e.message); return null; }
  }

  async function callGemini(userText, systemPrompt, history) {
    if (!AI_KEYS.gemini) return null;
    for (const model of GEMINI_MODELS) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS);
        const contents = history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
        contents.push({ role: 'user', parts: [{ text: userText }] });
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': AI_KEYS.gemini },
          body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents, generationConfig: { maxOutputTokens: AI_MAX_TOKENS, temperature: AI_TEMPERATURE } }),
          signal: ctrl.signal,
        });
        clearTimeout(t);
        if (!r.ok) continue;
        const d = await r.json();
        const text = d?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 1) return text.trim();
      } catch (e) { console.warn(TAG, 'gemini', model, 'error', e.message); }
    }
    return null;
  }

  /* General-knowledge-only Wikipedia lookup (true last resort) */
  async function wikipediaLookup(query) {
    try {
      const key = 'wiki:' + query.toLowerCase();
      if (cache.has(key)) return cache.get(key);
      const sUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(query) + '&srlimit=1&format=json&origin=*';
      const sr = await fetch(sUrl, { signal: AbortSignal.timeout(4000) });
      const sd = await sr.json();
      const title = sd?.query?.search?.[0]?.title;
      if (!title) return null;
      const pUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title);
      const pr = await fetch(pUrl, { signal: AbortSignal.timeout(4000) });
      const pd = await pr.json();
      if (pd.extract && pd.extract.length > 30) {
        const words = pd.extract.trim().split(/\s+/);
        const out = words.length <= 50 ? pd.extract.trim() : words.slice(0, 50).join(' ') + '...';
        cache.set(key, out);
        return out;
      }
      return null;
    } catch { return null; }
  }

  /* Local data fallback when ALL AI fails -- checks FACTS/projects/social by keyword */
  function localDataFallback(text) {
    const lower = text.toLowerCase();
    for (const p of FACTS.projects) {
      if (wb(p.name.replace(/["']/g, '')).test(text) || lower.includes(p.name.toLowerCase().replace(/["']/g, ''))) {
        return `${p.name} (${p.year}, ${p.status}): ${p.desc}`;
      }
    }
    for (const [platform, val] of Object.entries(FACTS.social)) {
      if (wb(platform).test(lower)) return `${platform}: ${val}`;
    }
    if (/\bmanomay\b|\bwho\s+(?:is|are)\s+(?:he|him|msm)\b/i.test(lower)) return rnd(WHO_IS_MANOMAY_FALLBACK);
    return null;
  }

  /* Main cascade: returns {text, tier} */
  async function runAICascade(userText, ctx, history) {
    const systemPrompt = buildSystemPrompt(ctx);

    let text = await callGroq(userText, systemPrompt, history);
    if (text) return { text, tier: 'groq' };

    text = await callOpenRouter(userText, systemPrompt, history);
    if (text) return { text, tier: 'openrouter' };

    text = await callGemini(userText, systemPrompt, history);
    if (text) return { text, tier: 'gemini' };

    console.warn(TAG, 'all AI tiers failed -- falling to local/web');
    const local = localDataFallback(userText);
    if (local) return { text: local, tier: 'local' };

    const wiki = await wikipediaLookup(userText);
    if (wiki) return { text: wiki, tier: 'wikipedia' };

    return { text: OFFLINE_FALLBACK, tier: 'offline' };
  }

  /* ═══════════════ LOCAL INSTANT HANDLERS (no AI call) ═══════════════ */

  /* "does he know python?" / "is react in his skillset?" etc */
  const SKILL_Q_RE = /\b(?:does\s+(?:he|manomay)\s+know|is\s+(?:he|manomay)\s+(?:good\s+(?:at|with)|familiar\s+with)|has\s+(?:he|manomay)\s+(?:used|learned|worked\s+with)|do(?:es)?\s+(?:he|manomay)\s+(?:use|know))\s+([a-z0-9.#+\s]+?)\??$/i;

  function checkSkillQuestion(text) {
    const m = text.match(SKILL_Q_RE);
    if (!m) return null;
    const target = m[1].trim().toLowerCase();
    const S = FACTS.skills;
    for (const [level, arr] of Object.entries(S)) {
      for (const s of arr) {
        if (s.toLowerCase().includes(target) || target.includes(s.toLowerCase())) {
          if (level === 'none') return `Not currently -- ${s} isn't in his skillset yet.`;
          return `Yes -- ${s} is one of his ${level} skills.`;
        }
      }
    }
    return null;
  }

  /* "what is his instagram" / "show me his linkedin" etc -- returns the
     {label,handle,url} object so the caller can render a clickable button,
     not just text. */
  function checkSocialQuestion(text) {
    const lower = text.toLowerCase();
    for (const platform of Object.keys(FACTS.social)) {
      const pat = platform === 'x' ? /\b(?:x|twitter)\b/i : wb(platform);
      if (pat.test(lower) && /\b(what|show|his|link|handle|profile|account|give|open)\b/i.test(lower)) {
        return FACTS.social[platform];
      }
    }
    return null;
  }

  /* "show me his links" / "social links" / "all his profiles" -- wants the
     FULL set of link-buttons, not page navigation. */
  function wantsAllSocialLinks(text) {
    const lower = text.toLowerCase();
    return /\b(?:links?|profiles?|socials?)\b/i.test(lower)
        && /\b(?:show|what|his|give|all|find|see|list)\b/i.test(lower);
  }

  /* ═══════════════ NAV / THEME / MUSIC (word-boundary) ═══════════════ */
  function detectNav(text) {
    const pages = getSitePages();
    const ids = Object.keys(pages);
    if (!ids.length) return null;
    const lower = text.toLowerCase();
    const verb = /\b(?:show|open|go\s+to|take\s+me\s+to|navigate\s+to|visit|view|switch\s+to)\b/i.test(lower);

    /* Resolve a synonym word (cv/blog/gallery/links/...) to a real page id,
       only if that target id actually exists on this page. */
    function aliasTarget(lowerText) {
      for (const [alias, target] of Object.entries(PAGE_ALIASES)) {
        if (ids.includes(target) && wb(alias).test(lowerText)) return target;
      }
      return null;
    }

    if (verb) {
      for (const id of ids) {
        const label = (pages[id].label || id).toLowerCase();
        const labelHit = label.length > 2 && wb(label).test(lower);
        if (idPattern(id).test(lower) || labelHit) return id;
      }
      const alias = aliasTarget(lower);
      if (alias) return alias;
    }

    /* bare 1-2 word message that IS just a page name -- "social?", "games", "profile", "cv" */
    const bare = lower.replace(/[^a-z\s]/g, '').trim();
    if (bare && bare.split(/\s+/).length <= 2) {
      for (const id of ids) {
        if (idPattern(id).test(bare) && bare.replace(idPattern(id), '').trim() === '') return id;
      }
      const alias = aliasTarget(bare);
      if (alias) return alias;
    }
    return null;
  }

  function detectTheme(text) {
    const lower = text.toLowerCase();
    if (!/\b(?:theme|mode)\b/i.test(lower) && !/\b(?:switch|change|set|make)\b/i.test(lower)) return null;
    if (/\b(?:dark|noir|black|night)\b/i.test(lower)) return 'dark';
    if (/\b(?:light|ivory|white|bright|day)\b/i.test(lower)) return 'light';
    if (/\b(?:slate|grey|gray)\b/i.test(lower)) return 'slate';
    if (/\b(?:forest|green)\b/i.test(lower)) return 'forest';
    return null;
  }

  function detectMusic(text) {
    const lower = text.toLowerCase();
    if (!wb('music').test(lower) && !wb('song').test(lower)) return null;
    if (/\b(?:pause|stop|off|mute)\b/i.test(lower)) return 'pause';
    if (/\b(?:play|start|on|resume)\b/i.test(lower)) return 'play';
    return null;
  }

  /* ═══════════════ INIT / UI / ROUTER ═══════════════ */
  function init() {
    const inputEl = document.getElementById('roro-input');
    const sendBtn = document.getElementById('roro-send');
    const chatEl  = document.getElementById('roro-chat');
    if (!inputEl || !sendBtn || !chatEl) { setTimeout(init, 300); return; }

    console.log(TAG, 'standalone router active.');
    console.log(TAG, 'AI keys:', { groq: !!AI_KEYS.groq, openrouter: !!AI_KEYS.openrouter, gemini: !!AI_KEYS.gemini });

    let history = []; /* [{role:'user'|'assistant', content}] */
    let pendingSuggestion = null; /* page id the AI last offered via [SUGGEST:id], consumed by a "yes" */

    function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
    function nowStr() { return new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }); }
    function scrollBottom() { requestAnimationFrame(() => { chatEl.scrollTop = chatEl.scrollHeight; }); }

    function addUserMsg(text) {
      const wrap = document.createElement('div');
      wrap.className = 'roro-msg roro-msg--user';
      wrap.innerHTML = `<div class="roro-bubble">${esc(text)}</div><div class="roro-timestamp">${nowStr()}</div>`;
      chatEl.appendChild(wrap); scrollBottom();
    }
    function addTypingIndicator() {
      const wrap = document.createElement('div');
      wrap.className = 'roro-msg roro-msg--bot roro-msg--typing';
      wrap.innerHTML = '<div class="roro-bubble"><div class="roro-tdot"></div><div class="roro-tdot"></div><div class="roro-tdot"></div></div>';
      chatEl.appendChild(wrap); scrollBottom();
      return wrap;
    }
    function addBotMsg(text, after) {
      const wrap = document.createElement('div');
      wrap.className = 'roro-msg roro-msg--bot';
      const bubble = document.createElement('div'); bubble.className = 'roro-bubble';
      const ts = document.createElement('div'); ts.className = 'roro-timestamp'; ts.textContent = nowStr();
      wrap.appendChild(bubble); wrap.appendChild(ts);
      chatEl.appendChild(wrap); scrollBottom();
      const chars = [...String(text || '')]; let i = 0;
      (function tick() {
        if (i >= chars.length) { if (after) after(); return; }
        bubble.textContent += chars[i++]; scrollBottom();
        setTimeout(tick, 9 + Math.random() * 18);
      })();
    }
    function renderOptions(opts) {
      if (!opts || !opts.length) return;
      const wrap = document.createElement('div'); wrap.className = 'roro-options';
      opts.forEach(t => {
        const btn = document.createElement('button'); btn.className = 'roro-opt'; btn.textContent = t;
        btn.addEventListener('click', () => { wrap.remove(); addUserMsg(t); route(t); });
        wrap.appendChild(btn);
      });
      chatEl.appendChild(wrap); scrollBottom();
    }
    /* Renders link-buttons at the EXACT same size/theme as the suggestion
       chips (.roro-opt class, untouched) -- just overriding underline and
       corner radius inline so they read as rectangles, not pills. Items
       with `copyValue` (email) become a copy-to-clipboard button that
       briefly shows "Copied!" instead of opening anything. */
    function renderLinks(items) {
      const real = (items || []).filter(it => it && (it.url || it.copyValue));
      if (!real.length) return;
      const wrap = document.createElement('div'); wrap.className = 'roro-options';
      real.forEach(it => {
        let el;
        if (it.copyValue) {
          el = document.createElement('button');
          el.type = 'button';
          el.className = 'roro-opt';
          el.textContent = it.label;
          el.addEventListener('click', () => {
            const original = it.label;
            const restore = () => { el.textContent = original; };
            const ok = () => { el.textContent = 'Copied!'; setTimeout(restore, 1200); };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(it.copyValue).then(ok).catch(ok);
            } else ok();
          });
        } else {
          el = document.createElement('a');
          el.className = 'roro-opt';
          el.href = it.url; el.target = '_blank'; el.rel = 'noopener noreferrer';
          el.textContent = it.label;
        }
        el.style.textDecoration = 'none';
        el.style.borderRadius = '4px';
        wrap.appendChild(el);
      });
      chatEl.appendChild(wrap); scrollBottom();
    }
    /* Context-aware suggestion chips -- topic-relevant set based on the
       user's message + the bot's reply, instead of always the same 4. */
    const TOPIC_OPTIONS = {
      projects: ['Tell me more about that', 'What else has he built?', 'Why should I hire him?', 'Show me the Journey'],
      skills:   ['Show me Projects', 'Why should I hire him?', 'Who is Manomay?', 'Show me the Journey'],
      journey:  ['Tell me more', 'What has he achieved?', 'Show me Projects', 'Who is Manomay?'],
      games:    ['Show me Games', 'Show me Projects', 'Who is Manomay?', 'Surprise me'],
      manomay:  ['Show me Projects', 'What has he achieved?', 'Show me the Journey', 'Why should I hire him?'],
      default:  ['Who is Manomay?', 'Show me Projects', 'Surprise me', 'Show me Games'],
    };
    function smartOptions(userText, replyText) {
      const combined = `${userText || ''} ${replyText || ''}`.toLowerCase();
      if (/\b(project|website|ecommerce|e-commerce|iskcon|mayura|golden star|bullet)\b/.test(combined)) return TOPIC_OPTIONS.projects;
      if (/\b(skill|python|javascript|html|css|gsap|origami|hire)\b/.test(combined)) return TOPIC_OPTIONS.skills;
      if (/\b(journey|achievement|nationals|ebsb|himanish|2024|2025|2017)\b/.test(combined)) return TOPIC_OPTIONS.journey;
      if (/\b(game|games|2048|snake|memory|scramble)\b/.test(combined)) return TOPIC_OPTIONS.games;
      if (/\bmanomay\b/.test(combined)) return TOPIC_OPTIONS.manomay;
      return TOPIC_OPTIONS.default;
    }
    function getVisitorName() { try { const d = JSON.parse(localStorage.getItem('roroUser') || 'null'); return d?.name || null; } catch { return null; } }
    function getCurrentPage() { const a = document.querySelector('.page.active'); return a ? a.id.replace('page-', '') : 'home'; }

    async function askAI(promptText, fallbackPool, afterFn) {
      const typing = addTypingIndicator();
      const isDeep = /\b(?:is|are|does|do|will|can|has|have|government|policy|news|latest|score|price|weather)\b/i.test(promptText);
      const switchTimer = setTimeout(() => {
        const bubble = typing.querySelector('.roro-bubble');
        if (bubble && typing.parentNode) bubble.innerHTML = `<span style="font-size:0.78rem;opacity:0.7">${isDeep ? 'Searching...' : 'Thinking...'}</span>`;
      }, 3000);

      const ctx = { visitorName: getVisitorName(), currentPage: getCurrentPage() };
      let replyText, tier;
      try {
        const result = await runAICascade(promptText, ctx, history.slice(-10));
        replyText = result.text; tier = result.tier;
      } catch (e) {
        console.warn(TAG, 'askAI error', e);
        replyText = fallbackPool ? rnd(fallbackPool) : OFFLINE_FALLBACK;
        tier = 'error';
      }
      clearTimeout(switchTimer);
      if (typing.parentNode) typing.remove();
      console.log(TAG, 'tier:', tier);

      if ((tier === 'offline' || tier === 'error') && fallbackPool) replyText = rnd(fallbackPool);

      /* Parse + strip a trailing [SUGGEST:id] / [NAVIGATE:id] tag (RULE 6).
         Invalid/unknown ids are stripped too but produce no action. */
      let navTag = null;
      const tagMatch = replyText.match(/\s*\[(SUGGEST|NAVIGATE):([a-zA-Z0-9_-]+)\]\s*$/i);
      if (tagMatch) {
        const kind = tagMatch[1].toUpperCase();
        const id = tagMatch[2].toLowerCase();
        if (getSitePages()[id]) navTag = { kind, id };
        replyText = replyText.slice(0, tagMatch.index).trim();
      }
      pendingSuggestion = (navTag && navTag.kind === 'SUGGEST') ? navTag.id : null;

      history.push({ role: 'user', content: promptText });
      history.push({ role: 'assistant', content: replyText });
      if (history.length > 20) history = history.slice(-20);

      addBotMsg(replyText, () => {
        if (navTag && navTag.kind === 'NAVIGATE' && typeof window.navigateTo === 'function') {
          window.navigateTo(navTag.id);
        }
        if (afterFn) afterFn(replyText);
      });
    }

    async function route(rawText) {
      const text = (rawText || '').trim();
      if (!text) return;

      /* 1 -- SAFETY */
      const s = safetyCheck(text);
      if (s.block) { addBotMsg(s.reply); return; }

      /* 1b -- NAME CHANGE / CLEAR DATA. Persists to localStorage.roroUser.name,
         the same key js/roro-intro.js reads for "Welcome back, {n}" on the
         splash screen -- so a name set here also applies on next visit. */
      const CALL_ME_STOPWORDS = new Set(['when','later','maybe','back','now','tonight','tomorrow','again','please','sometime','anytime','today','if','once','soon','here','there']);
      const nameMatch = text.match(/\bcall\s+me\s+([a-zA-Z][a-zA-Z'-]{1,24})\b/i) || text.match(/\bmy\s+name\s+is\s+([a-zA-Z][a-zA-Z'-]{1,24})\b/i);
      if (nameMatch && !CALL_ME_STOPWORDS.has(nameMatch[1].toLowerCase())) {
        const formatted = nameMatch[1][0].toUpperCase() + nameMatch[1].slice(1).toLowerCase();
        try {
          const existing = JSON.parse(localStorage.getItem('roroUser') || '{}') || {};
          existing.name = formatted;
          localStorage.setItem('roroUser', JSON.stringify(existing));
        } catch {}
        addBotMsg(`Got it -- I'll call you ${formatted} from now on.`, () => renderOptions(smartOptions(text)));
        return;
      }
      if (/\b(?:clear (?:my )?data|reset (?:everything|my data|me)|forget me|start (?:fresh|over)|delete my (?:data|info|name))\b/i.test(text)) {
        try { localStorage.removeItem('roroUser'); } catch {}
        history = [];
        addBotMsg("Done -- your saved name and data are cleared. Refresh the page and it'll feel like your first visit.", () => renderOptions(smartOptions(text)));
        return;
      }

      /* 2 -- ACK (or confirming a page the previous reply offered via [SUGGEST:id]) */
      if (!isAck(text)) pendingSuggestion = null; /* stale offers don't fire on a later unrelated "yes" */
      if (isAck(text)) {
        if (pendingSuggestion) {
          const target = pendingSuggestion; pendingSuggestion = null;
          const pages = getSitePages();
          const label = (pages[target] && pages[target].label) || target;
          addBotMsg(`Opening ${label}.`, () => {
            if (typeof window.navigateTo === 'function') window.navigateTo(target);
            renderOptions(smartOptions(text));
          });
          return;
        }
        addBotMsg(`${rnd(['Got it.','Sure.','Noted.','Okay.','Alright.','Right, got it.','Cool.'])} What can I help with?`, () => renderOptions(smartOptions(text)));
        return;
      }

      /* 3 -- MATH */
      if (/\d/.test(text)) {
        const r = solveMath(text);
        if (r !== null) { addBotMsg(`The answer is ${r}.`); return; }
      }

      /* 4 -- THEME */
      const theme = detectTheme(text);
      if (theme) {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        if (current === theme) addBotMsg('Already on that theme.');
        else {
          if (typeof window.setTheme === 'function') window.setTheme(theme);
          else document.documentElement.setAttribute('data-theme', theme);
          addBotMsg(`Switched to ${({dark:'Noir',light:'Ivory',slate:'Slate',forest:'Forest'})[theme] || theme}.`);
        }
        return;
      }

      /* 5 -- MUSIC */
      const music = detectMusic(text);
      if (music) {
        const bg = document.getElementById('bg-music');
        if (music === 'play') { if (bg) bg.play().catch(()=>{}); addBotMsg('Music on.'); }
        else { if (bg) bg.pause(); addBotMsg('Music paused.'); }
        return;
      }

      /* 6 -- LOCAL DATA: skill check ("does he know python?") */
      const skillAns = checkSkillQuestion(text);
      if (skillAns) { addBotMsg(skillAns, () => renderOptions(smartOptions())); return; }

      /* 7 -- LOCAL DATA: social links ("show me his links" -> buttons;
         "what is his instagram" -> one button). Checked BEFORE nav so
         "links"/"social" in this context renders buttons, not a page jump. */
      if (wantsAllSocialLinks(text)) {
        addBotMsg("Here are his links:", () => renderLinks(Object.values(FACTS.social)));
        return;
      }
      const socialAns = checkSocialQuestion(text);
      if (socialAns) {
        addBotMsg(`${socialAns.label}: ${socialAns.handle || socialAns.url || socialAns.note}`, () => renderLinks([socialAns]));
        return;
      }

      /* 8 -- NAV (DOM-scanned page list + synonym aliases) */
      const nav = detectNav(text);
      if (nav) {
        const pages = getSitePages();
        const label = (pages[nav] && pages[nav].label) || nav;
        addBotMsg(`Opening ${label}.`, () => {
          if (typeof window.navigateTo === 'function') window.navigateTo(nav);
          renderOptions(smartOptions());
        });
        return;
      }

      /* 9 -- "who are you" -- AI-first, tiny fallback pool */
      if (/^(?:who|what)\s+are\s+you\b|\btell\s+me\s+about\s+yourself\b|\bare\s+you\s+(?:an?\s+)?(?:ai|bot|robot)\b|\bwhat\s+can\s+you\s+do\b/i.test(text)) {
        await askAI("The visitor asked who/what you are. Introduce yourself as RoRo, Manomay's AI website assistant.", WHO_ARE_YOU_FALLBACK, () => renderOptions(['What can you do?','Who is Manomay?','Show me Projects']));
        return;
      }

      /* 10 -- "who is manomay" -- AI-first, tiny fallback pool */
      if (/\bwho\s+(?:is|was|s)\s+manomay\b|\bmanomay\s+kaun\b|\b(?:tell\s+me|describe)\b.*\bmanomay\b|\babout\s+manomay\b|\bwho\s+(?:made|built|created|designed|coded)\s+(?:this|the)\s+(?:site|website|portfolio)\b|^manomay\??$|\bwho\s+is\s+(?:he|msm)\b\??$/i.test(text)) {
        await askAI("The visitor is asking who Manomay is. Introduce him using the FACTS -- vary wording each time.", WHO_IS_MANOMAY_FALLBACK, () => renderOptions(['Show me Projects','Show me the Journey','What has he achieved?']));
        return;
      }

      /* 11 -- EVERYTHING ELSE -> AI cascade */
      await askAI(text, null, (reply) => renderOptions(smartOptions(text, reply)));
    }

    /* ── INPUT INTERCEPTION ── */
    function oldManagerIsBusy() {
      const mgr = window.RoRoManagerInstance || window.roro;
      const st = mgr && mgr._state;
      return !!(st && (st.awaitingName || st.awaitingClear || st.awaitingRedirect));
    }
    function trySubmit() {
      const text = inputEl.value.trim();
      if (!text || oldManagerIsBusy()) return false;
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 400));
  else setTimeout(init, 400);
})();
