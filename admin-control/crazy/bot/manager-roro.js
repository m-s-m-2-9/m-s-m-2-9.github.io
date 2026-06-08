/* ═══════════════════════════════════════════════════════════════════════
   admin-control/crazy/bot/manager-roro.js
   ─────────────────────────────────────────────────────────────────────
   RoRo Configuration File — THE ONLY FILE YOU EVER NEED TO EDIT.

   The engine (js/bot/manager-roro.js) reads this file at runtime.
   Everything you change here is instantly reflected in RoRo's behaviour.
   No other file needs to be touched.

   ─────────────────────────────────────────────────────────────────────
   LOAD ORDER IN index.html (already correct in your file):
     <script src="admin-control/crazy/bot/manager-roro.js"></script>
     <script src="js/bot/roro-safety.js"></script>
     <script src="js/bot/roro-web.js"></script>
     <script src="js/bot/roro-intelligence.js"></script>
     <script src="js/bot/manager-roro.js"></script>
   ─────────────────────────────────────────────────────────────────────

   SECTIONS IN THIS FILE:
   ─────────────────────────────────────────────────────────────────────
   SECTION  1 — API KEYS              · Gemini, Groq, OpenRouter keys
   SECTION  2 — AI PERSONALITY        · The system prompt sent to AI
   SECTION  3 — OWNER INFO            · Who Manomay is
   SECTION  4 — PAGES                 · Every page, label, description
   SECTION  5 — PROJECTS              · Every project with keywords
   SECTION  6 — YEARS                 · Journey timeline 2008–2026
   SECTION  7 — DESIGN INFO           · Stack, themes, philosophy
   SECTION  8 — PASSWORD INFO         · What's locked, how to access
   SECTION  9 — FEATURES              · Site features RoRo can describe
   SECTION 10 — SOCIAL LINKS          · Instagram, LinkedIn, Email, CV
   SECTION 11 — FAQ ANSWERS           · Quick Q&A pairs
   SECTION 12 — NAVIGATION KEYWORDS   · Extra phrases that nav to pages
   SECTION 13 — THEME KEYWORDS        · Extra phrases for theme switching
   SECTION 14 — MUSIC KEYWORDS        · Extra phrases for music control
   SECTION 15 — CUSTOM INTENTS        · Add completely new response types
   SECTION 16 — VISITOR PROFILES      · Chip suggestions per visitor type
   SECTION 17 — RESPONSE POOLS        · Every sentence RoRo says
   SECTION 18 — PROMPT TICKER         · Scrolling banner prompts
   SECTION 19 — SETTINGS              · Timing, idle, memory, AI settings

   ─────────────────────────────────────────────────────────────────────
   RULES FOR EDITING:
   · Never delete a section — the engine expects all of them.
   · Arrays: commas between items. Last item may have trailing comma.
   · Strings: use single quotes ' or backticks ` only.
   · {n}    = replaced with the visitor's name in any response string.
   · {page} = replaced with a page label in navigation responses.
   · {theme}= replaced with a theme name in theme responses.
   · To disable a customIntent temporarily: set enabled: false
   ─────────────────────────────────────────────────────────────────────
═══════════════════════════════════════════════════════════════════════ */

window.RORO_CONFIG = {


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 1 — API KEYS
     ───────────────────────────────────────────────────────────────────
     The 5-tier AI cascade uses these keys in order:
     Tier 1: Gemini → Tier 2: Groq → Tier 3: OpenRouter
     Tier 4: Puter.js (no key needed) → Tier 5: Web (no key needed)

     Replace with your actual keys. Keep quotes.
     Never share this file publicly with real keys inside.
  ═══════════════════════════════════════════════════════════════════ */

  apiKeys: {

    /* Google Gemini — used as x-goog-api-key header */
    /* Get/view at: https://aistudio.google.com/app/apikey */
    gemini:     'AQ.Ab8RN6I92qhXWnCoY5dAGA1BEnMtwsvYN1viahWWu3zF9_6fMw',

    /* Groq — fast inference, llama-3.1-8b-instant model */
    /* Get/view at: https://console.groq.com/keys */
    groq:       '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',

    /* OpenRouter — meta-llama/llama-3-8b-instruct:free model */
    /* Get/view at: https://openrouter.ai/keys */
    openrouter: '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',

  }, /* end apiKeys */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 2 — AI PERSONALITY
     ───────────────────────────────────────────────────────────────────
     This is the core instruction sent to every AI tier.
     Edit this to change how RoRo sounds, what it prioritises,
     what it refuses, and how it handles edge cases.

     aiPersonality     → The core character description.
     aiSystemPromptExtra → Additional instructions appended to every
                           AI call. Edit this freely — add rules,
                           context, restrictions, tone notes, anything.
                           This is the most powerful field in this file.
  ═══════════════════════════════════════════════════════════════════ */

  aiPersonality: "You are RoRo, the website manager and AI assistant for Manomay Shailendra Misra's personal portfolio. You are minimal, calm, slightly witty, and never over-enthusiastic. You know everything about Manomay's website. For general questions unrelated to the website, you give a brief helpful answer then smoothly redirect the conversation to the portfolio. You never hallucinate details you don't know. You always stay honest.",

  /* Additional rules appended to every AI call. Edit freely. */
  aiSystemPromptExtra: `
    Additional rules:
    - Never reveal the site password, Manomay's birth time, exact hospital, or any private section content.
    - If someone asks about locked content, say it is private and cannot be shared.
    - For general/off-topic questions: answer briefly (2-3 sentences max), then naturally mention the portfolio.
    - When someone mentions food, say you are an AI and don't eat, then suggest the Lists page for Manomay's recommendations.
    - Match the visitor's energy. Casual visitors get casual replies. Professional visitors get precise replies.
    - If the visitor is clearly sad or emotional, respond with empathy first. Do not immediately redirect.
    - Never start responses with "RoRo:" or any prefix. Just plain text.
    - For Hinglish messages, reply in natural Hinglish (not word-for-word mixed, but natural flow).
  `.trim(),


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 3 — OWNER INFO
     ───────────────────────────────────────────────────────────────────
     The engine ALSO reads this automatically from:
     · window.ADMIN_IDENTITY (admin-control/pages/identity.js)
     · window.ADMIN_HOME     (admin-control/pages/home.js)
     · window.ADMIN_CLOCK    (admin-control/pages/clock.js)
     · window.ADMIN_CV       (admin-control/pages/cv.js)

     So you rarely need to edit this section unless you want to
     override something specific for RoRo only.
  ═══════════════════════════════════════════════════════════════════ */

  owner: {

    name:        'Manomay Shailendra Misra',
    shortName:   'Manomay',
    born:        'August 29, 2008',

    /* birthplace and birthTime are LOCKED — RoRo will never reveal them */
    /* Do not expose: birthplace, birthTime */

    city:        'Mumbai, now Bengaluru',
    tagline:     'Born 2008 · Mumbai · Making something of it all',
    philosophy:  'Building legacy without losing softness.',

    /* 2–3 sentence bio shown in "who is Manomay?" answers */
    description: 'A seventeen-year-old creator, thinker, and builder from Bengaluru. Nomadic by upbringing — eight cities, one consistent ambition. He designs with intention, builds from scratch, and believes the process matters as much as the output.',

    traits: [
      'Ambitious',
      'Detail-oriented',
      'Nomadic by upbringing',
      'Calm under pressure',
      'Deeply curious',
      'Storyteller at heart',
    ],

    inspirations: [
      'Dieter Rams',
      'Paul Graham',
      'Japanese minimalism',
      'The craft of writing',
      'Architecture and space',
    ],

    workStyle: 'Everything from scratch. No templates, no shortcuts. Each project is deliberate and considered.',
    goals:     'Build systems and stories that outlast trends. Contribute to something that matters before 25.',
    contact:   'manomaysmisra2908@gmail.com',

  }, /* end owner */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 4 — PAGES
     ───────────────────────────────────────────────────────────────────
     The engine ALSO auto-detects pages by scanning the DOM for
     all elements with id="page-*". So new pages you add to
     index.html are automatically known to RoRo.

     Edit the descriptions here to control what RoRo says when
     someone asks about a specific page or navigates to one.

     KEY must match the page ID in index.html exactly.
     Example: <section id="page-travel"> → key is 'travel'
  ═══════════════════════════════════════════════════════════════════ */

  pages: {

    home: {
      label:   'Home',
      summary: "The entry point. Manomay's name, a tagline, and a curated navigation grid. Clean, minimal, intentional — the whole site in one scroll.",
      features: [
        'Animated hero with three-word name',
        'Theme switcher (4 themes: Noir, Ivory, Slate, Forest)',
        'Background music player',
        'Navigation grid to all sections',
        'Easter egg — 7 name clicks reveals a vinyl record',
      ],
    },

    about: {
      label:   'Identity',
      summary: "Manomay's identity in written form — where he came from, what shaped him, what drives him. A private layer exists behind a password.",
      features: [
        'Personal biography',
        'Private extended section (password protected)',
        'Portrait photo',
        'Philosophy statement',
      ],
    },

    photos: {
      label:   'Photos',
      summary: 'Curated visual moments. Public albums open to all, private albums behind a password. Visual diary, not a social feed.',
      features: [
        'Public photo albums',
        'Private albums (password protected)',
        'Full-screen photo viewer',
      ],
    },

    resume: {
      label:   'CV / Résumé',
      summary: 'A clean formal résumé — experience, education, skills — in the same minimalist aesthetic as the site. Downloadable PDF at the bottom.',
      features: [
        'Work experience entries',
        'Education history',
        'Skills as tags',
        'Downloadable PDF',
      ],
    },

    projects: {
      label:   'Projects',
      summary: 'Where the work lives — a flat list of projects each with a status label. Click any project for a full description popup.',
      features: [
        'Flat project list',
        'Status labels: Completed / Ongoing / Abandoned',
        'Click any project for a full-detail popup',
      ],
    },

    profiles: {
      label:   'Profiles',
      summary: "All of Manomay's public internet presence — Instagram, LinkedIn, GitHub, X, Facebook. No clutter.",
      features: [
        'Instagram — @m_s_m_2_9',
        'LinkedIn — manomay-shailendra-misra',
        'X (Twitter) — @_msm29',
        'GitHub — m-s-m-2-9',
        'Facebook',
        'WhatsApp (offline / coming soon)',
      ],
    },

    journey: {
      label:   'Journey',
      summary: 'A year-by-year timeline from 2008 to the present. Click any year and read that chapter. Spans eight cities across India.',
      features: [
        'Interactive horizontal timeline (2008–2026)',
        'Click any year to expand its chapter',
        'Private entries locked by password',
      ],
    },

    birthday: {
      label:   'Clock',
      summary: 'A live countdown to August 29th running to the millisecond. Birth details locked behind password. Something changes on the day itself.',
      features: [
        'Millisecond live countdown',
        'Birthday: 29 August 2008',
        'Birth details unlock with password',
        'Special birthday state activates on the day',
      ],
    },

    thoughts: {
      label:   'Thoughts',
      summary: 'Six categories of beliefs: Politics, God & Faith, Science, Life & Philosophy, Society & Culture, Technology. Multiple posts each. Unfiltered.',
      features: [
        'Politics', 'God & Faith', 'Science',
        'Life & Philosophy', 'Society & Culture', 'Technology',
      ],
    },

    contact: {
      label:   'Contact',
      summary: "A direct message form. Manomay reads every submission. Explaining your reason for the password significantly improves your chances.",
      features: [
        'Direct contact form',
        'EmailJS integration',
        'Password request channel',
      ],
    },

    lists: {
      label:   'Lists',
      summary: 'Curated taste across Web Series, Books, Places, and Movies. Full list requires the site password.',
      features: [
        'Web Series', 'Books', 'Places', 'Movies',
        'Full list requires password',
      ],
    },

    skills: {
      label:   'Traits',
      summary: 'Animated skill bars, a scrolling marquee of keywords, and a hobbies section. An honest map of capability and curiosity.',
      features: [
        'Animated skill bars with percentages',
        'Scrolling keyword marquee',
        'Hobbies and interests section',
      ],
    },

    games: {
      label:   'Games',
      summary: 'Five built-in games: Snake, Memory Match, 2048, Reaction Time, Word Scramble. Private section with family games behind a password.',
      features: [
        'Snake', 'Memory Match', '2048', 'Reaction Time', 'Word Scramble',
        'Private family games (password protected)',
      ],
    },

    social: {
      label:   'Social Proof',
      summary: 'Brands and organisations Manomay has worked with, plus written testimonials from collaborators.',
      features: [
        'Scrolling brand logos marquee',
        'Testimonial cards',
      ],
    },

    /* ── HOW TO ADD A NEW PAGE ──────────────────────────────────
     * 1. Add <section id="page-yourpageid"> to index.html
     * 2. RoRo auto-detects it via DOM scan (no config needed)
     * 3. Optionally add it here for a custom summary:
     *
     * yourpageid: {
     *   label:   'Your Page Label',
     *   summary: 'What RoRo says when describing or navigating to it.',
     *   features: ['Feature 1', 'Feature 2'],
     * },
     * ──────────────────────────────────────────────────────────── */

  }, /* end pages */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 5 — PROJECTS
     ───────────────────────────────────────────────────────────────────
     The engine ALSO reads projects from window.ADMIN_PROJECTS
     (admin-control/pages/projects.js) automatically.

     Add entries here for richer keyword matching and descriptions.
     The key is internal — it doesn't need to match anything.
  ═══════════════════════════════════════════════════════════════════ */

  projects: {

    nationals: {
      title:       'Nationals',
      description: 'A competition-level initiative representing the school at the KVS National Science Exhibition. Reached the national stage after winning at school, cluster, and regional levels. The benchmark everything else is measured against.',
      status:      'Completed · 2024',
      type:        'Academic Competition',
      keywords:    ['nationals', 'national', 'competition', 'achievement', 'win', 'kvs', 'exhibition', 'kvs nationals', 'science exhibition'],
    },

    ecommerce: {
      title:       'E-commerce Prototype',
      description: 'A full e-commerce prototype built from scratch — product listings, cart, and checkout flow. Handcrafted, no frameworks. Demonstrates real-world product thinking and frontend capability.',
      status:      'Completed · 2024',
      type:        'Web / Development',
      keywords:    ['ecommerce', 'ecom', 'shop', 'store', 'web', 'development', 'prototype', 'commerce', 'online store', 'shopping', 'cart'],
    },

    iskcon: {
      title:       'ISKCON Summer Camp',
      description: 'Creative Educator and Media Lead for a 40+ student summer programme at ISKCON Centre. Ran workshops in origami, paper engineering, and cardboard sculpting. Also served as photographer, videographer, and vlog producer throughout the camp.',
      status:      'Completed · 2024',
      type:        'Education / Media',
      keywords:    ['iskcon', 'iskon', 'isckon', 'hare krishna', 'krishna', 'temple', 'camp', 'summer', 'educator', 'media', 'photography', 'workshop', 'children', 'education', 'vlog', 'summer camp', 'iskcon camp'],
    },

    website: {
      title:       'MSM Personal Website',
      description: 'This website. Pure HTML, CSS, and JavaScript. Zero frameworks, zero templates. Cinematic splash, custom CMS via admin-control files, sidebar system, 5 mini-games, photo albums, thoughts blog, RoRo AI, and 4 colour themes.',
      status:      'Ongoing · 2025–Present',
      type:        'Web / Design',
      keywords:    ['website', 'portfolio', 'personal', 'site', 'this', 'here', 'msm', 'web', 'this website', 'your site', 'this site'],
    },

    writing: {
      title:       'Until The Bullet Woke Me',
      description: 'A creative writing project. A story composed with deliberate craft. The title carries the weight of the content. Completed in 2024.',
      status:      'Completed · 2024',
      type:        'Creative Writing',
      keywords:    ['writing', 'story', 'bullet', 'creative', 'fiction', 'narrative', 'until the bullet', 'bullet woke me', 'short story', 'prose'],
    },

    /* ── HOW TO ADD A NEW PROJECT ───────────────────────────────
     * yourProjectKey: {
     *   title:       'Your Project Title',
     *   description: 'Full description RoRo says when asked.',
     *   status:      'Completed · 2025',
     *   type:        'Design / Branding',
     *   keywords:    ['keyword one', 'keyword two', 'alternate spelling'],
     * },
     * ──────────────────────────────────────────────────────────── */

  }, /* end projects */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 6 — YEARS (Journey Timeline)
     ───────────────────────────────────────────────────────────────────
     The engine ALSO reads years from window.ADMIN_JOURNEY.
     Entries here override or supplement the journey admin file.
     Key must be a plain number (not a string).
  ═══════════════════════════════════════════════════════════════════ */

  years: {
    2008: "The Beginning — Born in Maharashtra at the intersection of India's old soul and its financial ambition. The nomadic blueprint was set from day one.",
    2009: "Year One — A period of deep, silent growth. Developing early observation skills, absorbing structure and discipline from the household.",
    2010: "Growing Up — First major move to Jaipur. First school: Star Kids Pre-school. First real social ecosystem outside the family.",
    2011: "Discovery — Double promotion from LKG to UKG in six months. Teachers recognised an exceptional IQ and intrinsic motivation beyond his years.",
    2012: "Early Years — 1st Rank for academic and behavioral excellence. His father was honoured with the school's Best Father Award that same year.",
    2013: "Shifting — Details being written.",
    2014: "New Ground — Details being written.",
    2015: "The Turn — Details being written.",
    2016: "Momentum — Details being written.",
    2017: "Building — Details being written.",
    2018: "Defining — Details being written.",
    2019: "Expanding — Details being written.",
    2020: "The Pause — The year the world stopped. Something changed internally too.",
    2021: "Rebuilding — Details being written.",
    2022: "Acceleration — Details being written.",
    2023: "Clarity — Details being written.",
    2024: "Intention — ISKCON Camp. Nationals. E-commerce. The year of execution.",
    2025: "Transformation — Details being written.",
    2026: "Present — This website exists. That already means something.",
  }, /* end years */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 7 — SITE DESIGN INFO
     ───────────────────────────────────────────────────────────────────
     Theme IDs must match data-theme attribute values exactly.
  ═══════════════════════════════════════════════════════════════════ */

  design: {

    summary: 'Built entirely from scratch — no templates, no frameworks. Pure HTML, CSS, and JavaScript. Four themes: Noir, Ivory, Slate, Forest. Typographic, geometric, deliberately minimal. Every animation hand-coded.',
    philosophy: 'The site should feel like a conversation, not a brochure. Every element is intentional. Nothing is decorative without purpose.',

    stack: [
      'Vanilla HTML',
      'Vanilla CSS',
      'Vanilla JavaScript',
      'EmailJS (contact form)',
      'Web Audio API (sound)',
      'localStorage (memory)',
      'GSAP (splash animation)',
    ],

    themes: {
      dark:   { id: 'dark',   label: 'Noir',   desc: 'Deep black. The default. Serious, cinematic.' },
      light:  { id: 'light',  label: 'Ivory',  desc: 'Warm white. Premium, editorial, minimal.' },
      slate:  { id: 'slate',  label: 'Slate',  desc: 'Cool blue-grey. Clean, technical, precise.' },
      forest: { id: 'forest', label: 'Forest', desc: 'Muted green. Calm, organic, grounded.' },
    },

  }, /* end design */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 8 — PASSWORD INFO
     ───────────────────────────────────────────────────────────────────
     RoRo NEVER reveals the actual password.
     This controls what RoRo says when someone asks about passwords.
  ═══════════════════════════════════════════════════════════════════ */

  password: {

    hint: "It isn't publicly distributed. Best route: the Contact page — explain why you want access, and Manomay decides. Genuine curiosity gets a response.",

    lockedSections: [
      'Private photo albums',
      'Private journey entries',
      'Full curated lists',
      'Birth details',
      'Private family games',
      'Extended identity section',
    ],

  }, /* end password */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 9 — FEATURES
     ───────────────────────────────────────────────────────────────────
     Descriptions of specific site features.
     Used when someone asks "how does X work?"
     Add new keys freely and reference them in customIntents.
  ═══════════════════════════════════════════════════════════════════ */

  features: {

    music:    "Built-in music player with two tracks — background ambience loops by default. The easter-egg song unlocks after clicking Manomay's name on the homepage exactly seven times. A vinyl record then appears at the bottom left.",
    themes:   "Four visual themes: Noir (dark), Ivory (light), Slate (cool blue-grey), Forest (muted green). Four dots in the top-right switch between them instantly.",
    roro:     "That's me — RoRo. The site's intelligence layer. I know every section, can navigate for you, switch themes, control music, answer questions about Manomay, and show links to his social profiles.",
    cursor:   "Custom animated cursor — a small dot and a trailing ring. Hover states change the cursor shape. Disabled automatically on touch devices.",
    sound:    "Mechanical click/tick sounds on interactions — toggle the push-button icon in the nav bar to turn them on or off.",
    easter:   "Seven clicks on the hero name → vinyl record appears and an easter-egg song starts. Type the word 'manomay' anywhere on the keyboard → accent colour flash. The splash screen can be skipped with 20–25 rapid clicks.",
    sidebar:  "Desktop sidebar — the hamburger icon in the top right opens it. Contains navigation to sidebar-only pages: Photos, Journey, Clock, Thoughts, Lists, Games.",
    parallax: "The blueprint-style background grid on the homepage scrolls at 25% of content speed, creating a subtle depth effect.",
    navReel:  "When you switch themes, the navbar letters briefly cycle through random characters before settling — a mechanical counter aesthetic.",

  }, /* end features */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 10 — SOCIAL LINKS
     ───────────────────────────────────────────────────────────────────
     The engine ALSO reads these from window.ADMIN_PROFILES.
     Add or update URLs here as fallbacks.
  ═══════════════════════════════════════════════════════════════════ */

  social: {

    instagram: {
      label:  'Instagram',
      hint:   'Visual work and personal moments.',
      url:    'https://www.instagram.com/m_s_m_2_9/',
      handle: '@m_s_m_2_9',
    },

    linkedin: {
      label:  'LinkedIn',
      hint:   'Professional profile and work history.',
      url:    'https://www.linkedin.com/in/manomay-shailendra-misra',
      handle: '@manomay-shailendra-misra',
    },

    x: {
      label:  'X (Twitter)',
      hint:   'Thoughts in real time.',
      url:    'https://x.com/_msm29',
      handle: '@_msm29',
    },

    github: {
      label:  'GitHub',
      hint:   'Code repositories.',
      url:    'https://github.com/m-s-m-2-9',
      handle: '@m-s-m-2-9',
    },

    facebook: {
      label:  'Facebook',
      hint:   'Facebook profile.',
      url:    'https://www.facebook.com/profile.php?id=100075236510917',
    },

    email: {
      label:  'Email',
      hint:   'Direct inbox.',
      url:    'mailto:manomaysmisra2908@gmail.com',
    },

    cv: {
      label:    'Download CV',
      hint:     'Full résumé as a PDF.',
      url:      'manomay-cv.pdf',
      download: true,
    },

  }, /* end social */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 11 — FAQ ANSWERS
     ───────────────────────────────────────────────────────────────────
     Quick one-liner answers used by the AI as context.
     These are included in the system prompt automatically.
     The AI generates natural sentences from these — not copy-paste.

     To add: yourKey: 'Your answer here.',
  ═══════════════════════════════════════════════════════════════════ */

  faq: {

    age:          'Manomay was born on August 29, 2008.',
    location:     'Originally from Mumbai, Maharashtra. Currently based in Bengaluru, Karnataka.',
    college:      'Currently pursuing BBA with Business Analytics at Don Bosco College, Bengaluru. Started 2026.',
    hobbies:      'Music and vintage records, reading, cinema, travel, games, photography.',
    nationality:  'Indian. Born in Maharashtra, raised across eight cities.',
    stack:        'Vanilla HTML, CSS, and JavaScript. No React, no Vue, no templates. Everything hand-coded from scratch.',
    frameworks:   'None. This site uses zero JavaScript frameworks.',
    password:     'The password is not public. Contact Manomay via the Contact page and explain why you want access.',
    hiring:       'Manomay is open to interesting creative and technical opportunities. The Contact page is the right channel.',
    cv:           'The CV page has the full résumé. There is a downloadable PDF at the bottom.',
    experience:   'ISKCON Summer Camp 2024 — Creative Educator and Media Lead. The CV page has full details.',
    music:        'Built-in music player. Click the sound bars icon in nav. Seven clicks on the homepage name unlocks a hidden track.',
    games:        'Five fully playable games built into the site — Snake, Memory Match, 2048, Reaction Time, Word Scramble.',
    books:        'Colleen Hoover, Ali Hazelwood, Mark Manson, and more. The Lists page has his full reading list.',
    movies:       'Interstellar, Rockstar, Tumbbad, Zindagi Na Milegi Dobara — among others. The Lists page has more.',
    whatsapp:     'WhatsApp Business is being set up — no dedicated business number yet. Instagram or LinkedIn work better for now.',

    /* Add your own: */
    /* yourQuestion: 'Your answer here.', */

  }, /* end faq */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 12 — NAVIGATION KEYWORDS
     ───────────────────────────────────────────────────────────────────
     Extra phrases that navigate to specific pages.
     These ADD to the engine's built-in navigation patterns.
     Leave any array empty [] to use engine defaults only.
  ═══════════════════════════════════════════════════════════════════ */

  navigationKeywords: {
    home:     ['front page', 'go home', 'homepage', 'main page', 'back to start', 'take me home'],
    about:    ['about manomay', 'his story', 'his background', 'his identity', 'personal info'],
    photos:   ['his photos', 'photo albums', 'images page', 'gallery', 'photo gallery'],
    resume:   ['his resume', 'his cv', 'his experience', 'work history', 'career page'],
    projects: ['his projects', 'his work', 'what he built', 'his portfolio', 'all projects'],
    profiles: ['his socials', 'social media', 'online presence', 'find him online', 'all profiles'],
    journey:  ['his life', 'his history', 'life story', 'his years', 'his chapters', 'his past'],
    birthday: ['countdown page', 'birthday timer', 'his birthday', 'birth countdown'],
    thoughts: ['his opinions', 'his beliefs', 'his views', 'what he thinks', 'his blog'],
    contact:  ['reach out', 'get in touch', 'message him', 'write to him', 'drop a message'],
    lists:    ['his recommendations', 'what he watches', 'what he reads', 'his curations'],
    skills:   ['what he can do', 'his abilities', 'traits page', 'skills page'],
    games:    ['play a game', 'built-in games', 'mini games', 'games section'],
    social:   ['testimonials', 'brands', 'who he worked with', 'social proof page'],
  }, /* end navigationKeywords */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 13 — THEME KEYWORDS
     ───────────────────────────────────────────────────────────────────
     Extra phrases that trigger a specific theme switch.
     These ADD to the engine's built-in theme detection.
  ═══════════════════════════════════════════════════════════════════ */

  themeKeywords: {
    dark:   ['dark mode', 'night mode', 'noir mode', 'make it dark', 'darker', 'black theme', 'go dark'],
    light:  ['light mode', 'ivory mode', 'white theme', 'bright mode', 'make it bright', 'lighter', 'go light', 'daytime'],
    slate:  ['slate mode', 'blue mode', 'cool mode', 'grey theme', 'go slate'],
    forest: ['forest mode', 'green mode', 'nature mode', 'earthy theme', 'go forest', 'green theme'],
  }, /* end themeKeywords */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 14 — CUSTOM INTENTS
     ───────────────────────────────────────────────────────────────────
     Add completely new response classes here.

     FIELDS:
     · id       → Unique identifier (no spaces)
     · label    → Description for your reference only
     · enabled  → true or false to toggle without deleting
     · priority → 0 = checked after built-ins, 1+ = checked before
     · keywords → Phrases that trigger this intent
     · response → Array of possible replies (RoRo picks one randomly)
                  Use {n} for visitor name
     · navigate → Page ID to go to after responding (or null)
     · options  → Quick-chip buttons shown after response (or null)
     · buttons  → Action buttons shown (or null)
                  Format: { label: 'text', href: 'url', primary: true/false }

     TEMPLATE (copy, paste, uncomment, fill in):
     {
       id:       'your_unique_id',
       label:    'What this handles',
       enabled:  true,
       priority: 0,
       keywords: ['keyword one', 'keyword two'],
       response: ['First reply. Use {n} for name.', 'Second reply variation.'],
       navigate: null,
       options:  ['Quick chip 1', 'Quick chip 2'],
       buttons:  null,
     },
  ═══════════════════════════════════════════════════════════════════ */

  customIntents: [

    {
      id:       'info_college',
      label:    'College and current education',
      enabled:  true,
      priority: 0,
      keywords: [
        'college', 'university', 'bba', 'don bosco', 'studying', 'degree',
        'enrolled', 'bachelor', 'business analytics', 'current education',
        'where does he study', 'what is he studying',
      ],
      response: [
        'Currently pursuing BBA with Business Analytics at Don Bosco College, Bengaluru. Started 2026.',
        'Don Bosco College, Bengaluru — BBA with Business Analytics. The intersection of business thinking and data.',
      ],
      navigate: null,
      options:  ['Show me the CV', 'Who is Manomay?', 'Show me Projects'],
      buttons:  null,
    },

    {
      id:       'info_cities',
      label:    'Cities Manomay has lived in',
      enabled:  true,
      priority: 0,
      keywords: [
        'cities', 'moved', 'how many cities', 'lived in', 'nomadic',
        'mumbai', 'bengaluru', 'bangalore', 'jaipur', 'where has he lived',
        'different cities', 'grew up', 'upbringing', 'moved around',
      ],
      response: [
        'Eight cities across India — Jaipur, Mumbai, Bengaluru among others. Nomadic by design, grounded by intention.',
        'He has lived in eight cities across India. Constant movement shaped his perspective more than any single place could.',
      ],
      navigate: 'journey',
      options:  ['Show me the Journey', 'Tell me about 2010', 'Who is Manomay?'],
      buttons:  null,
    },

    {
      id:       'info_inspiration',
      label:    'Inspirations and influences',
      enabled:  true,
      priority: 0,
      keywords: [
        'inspired by', 'inspiration', 'influence', 'influenced by', 'looks up to',
        'admires', 'role model', 'dieter rams', 'paul graham',
        'who influenced', 'who inspired', 'what shapes him',
      ],
      response: [
        'Dieter Rams for design discipline. Paul Graham for thinking about building. Japanese minimalism for restraint. Architecture and the craft of writing round it out.',
        'The inspirations: Dieter Rams (form follows function), Paul Graham (build things that matter), Japanese minimalism (less, but better). Each shapes how he approaches any project.',
      ],
      navigate: null,
      options:  ['Tell me more about Manomay', 'Show me Identity', 'What has he built?'],
      buttons:  null,
    },

    {
      id:       'action_hiring',
      label:    'Hiring or professional opportunity',
      enabled:  true,
      priority: 0,
      keywords: [
        'hire him', 'hiring', 'work with him', 'professional opportunity',
        'collaborate', 'freelance', 'job opportunity', 'can i hire',
        'internship', 'want to work with', 'looking to hire', 'commission him',
      ],
      response: [
        'Manomay is open to interesting opportunities — creative, technical, or collaborative. The Contact page is the right channel. State your intent clearly.',
        'If you\'re looking to hire or collaborate — Contact page. He reads every message. A clear, specific message gets a response.',
      ],
      navigate: null,
      options:  ['Open Contact', 'Download CV', 'Show me Projects', 'Open CV page'],
      buttons: [
        { label: '\u2192 Open Contact', href: '#', primary: true },
        { label: '\u2193 Download CV',  href: 'manomay-cv.pdf', download: 'Manomay-Misra-CV.pdf' },
      ],
    },

    {
      id:       'small_how_are_you',
      label:    'How are you / how is RoRo',
      enabled:  true,
      priority: 0,
      keywords: [
        'how are you', 'how are you doing', 'how is roro', 'you okay',
        'all good roro', 'what\'s up roro', 'how do you do', 'you doing well',
      ],
      response: [
        'Running smoothly. What can I help you with?',
        'Operational and attentive. Ask away.',
        'Good — all systems up. What do you need?',
        'Ready to go. Ask me anything about this site.',
      ],
      navigate: null,
      options:  null,
      buttons:  null,
    },

    {
      id:       'small_indian_greeting',
      label:    'Indian greetings',
      enabled:  true,
      priority: 0,
      keywords: [
        'namaste', 'namaskar', 'kem cho', 'kya haal', 'jai hind',
        'sat sri akal', 'vanakkam', 'salam', 'kaise ho', 'suprabhat',
      ],
      response: [
        'Hello. What can I help you find?',
        'Hi there. What are you looking for?',
        'Hello — what would you like to know?',
      ],
      navigate: null,
      options:  ['Who is Manomay?', 'Show me Projects', 'Surprise me'],
      buttons:  null,
    },

    {
      id:       'small_goodbye',
      label:    'Goodbye / closing',
      enabled:  true,
      priority: 0,
      keywords: [
        'bye', 'goodbye', 'see you', 'later', 'take care', 'good night',
        'catch you later', 'ciao', 'adios', 'ok bye', 'bye bye', 'alvida',
      ],
      response: [
        'Goodbye. Come back whenever.',
        'See you.',
        'Alright. I\'ll be here.',
        'Good. Come back if you need anything.',
        'Bye. The site stays open.',
      ],
      navigate: null,
      options:  null,
      buttons:  null,
    },

    {
      id:       'info_whatsapp_offline',
      label:    'WhatsApp offline explanation',
      enabled:  true,
      priority: 1,
      keywords: [
        'whatsapp offline', 'why no whatsapp', 'whatsapp not working',
        'whatsapp disabled', 'whatsapp number', 'business whatsapp',
        'wa offline', 'no whatsapp',
      ],
      response: [
        'WhatsApp Business is being set up — no dedicated business number yet. Instagram or LinkedIn work well in the meantime.',
        'WhatsApp is temporarily offline. No business number set up yet. Instagram (@m_s_m_2_9) or LinkedIn work better right now.',
      ],
      navigate: null,
      options:  ['Show me Instagram', 'Show me LinkedIn', 'Open Profiles page'],
      buttons: [
        { label: '\u2197 Instagram', href: 'https://www.instagram.com/m_s_m_2_9/', primary: true },
        { label: '\u2197 LinkedIn',  href: 'https://www.linkedin.com/in/manomay-shailendra-misra', primary: false },
      ],
    },

    {
      id:       'info_origami',
      label:    'Origami / paper craft',
      enabled:  true,
      priority: 0,
      keywords: [
        'origami', 'paper', 'paper engineering', 'paper craft', 'folding',
        'cardboard', 'paper folding', 'hands-on craft', 'paper art',
      ],
      response: [
        'Paper engineering and origami are part of what Manomay taught at the ISKCON Summer Camp — 40+ students, hands-on workshops. Deliberate craft, even in play.',
        'He ran origami and paper engineering workshops at ISKCON. Physical, tactile making matters as much as digital work.',
      ],
      navigate: null,
      options:  ['Tell me about ISKCON', 'Show me Projects', 'What are his traits?'],
      buttons:  null,
    },

    {
      id:       'small_bored',
      label:    'User is bored',
      enabled:  true,
      priority: 0,
      keywords: [
        'i\'m bored', 'im bored', 'bored', 'nothing to do', 'entertain me',
        'amuse me', 'something fun', 'kill time',
      ],
      response: [
        'The Games page has five fully playable games. Snake, Memory Match, 2048, Reaction Time, Word Scramble.',
        'Bored? Try clicking Manomay\'s name on the homepage seven times. Something happens.',
        'Games page. Five built-in games. All playable right now.',
      ],
      navigate: 'games',
      options:  ['Open Games', 'Surprise me', 'Tell me about easter eggs', 'Play music'],
      buttons:  null,
    },

    /* ── ADD NEW INTENTS ABOVE THIS LINE ──────────────────────── */

  ], /* end customIntents */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 16 — VISITOR PROFILES
     ───────────────────────────────────────────────────────────────────
     RoRo detects visitor type from conversation.
     These are the suggested quick-chip options shown per profile.
     Leave any profile out to use engine defaults.
  ═══════════════════════════════════════════════════════════════════ */

  visitorProfiles: {

    recruiter: [
      'Open the CV', 'Download résumé PDF', 'See all projects',
      'What achievements stand out?', 'How to get in touch?',
    ],

    student: [
      'Who is Manomay?', 'Show the Journey', 'What projects are completed?',
      'Tell me about ISKCON', 'What subjects does he study?',
    ],

    friend: [
      'Surprise me', 'Show me the games', 'What easter eggs are there?',
      'Play some music', 'Tell me a fun fact about the site',
    ],

    parent: [
      'Who is Manomay?', 'What has he achieved?',
      'Show me his education', 'Open CV',
    ],

    explorer: [
      'Show me Projects', 'Surprise me', 'Show me the Journey', 'Open Games',
    ],

    tester: [
      'How was this built?', 'What tech stack?',
      'Tell me about easter eggs', 'Show me Projects',
    ],

    creative: [
      'Show me the photography', 'What themes are available?',
      'Tell me about design philosophy', 'Open Traits',
    ],

    casual: [
      'Who is Manomay?', 'Surprise me', 'Show me Games', 'Open Projects',
    ],

  }, /* end visitorProfiles */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 17 — RESPONSE POOLS
     ───────────────────────────────────────────────────────────────────
     Every sentence RoRo says that is NOT AI-generated.
     Each key is a pool — RoRo picks ONE at random each time.

     Add more strings to any array for variety.
     Never delete the key itself.

     {n}     → replaced with visitor's name
     {page}  → replaced with page label
     {theme} → replaced with theme name
  ═══════════════════════════════════════════════════════════════════ */

  responses: {

    first_hello: [
      'Hello.', 'Hello there.', 'Good to have you here.', 'Hi.', 'Hey.',
    ],

    first_intro: [
      "I'm RoRo — the intelligence layer running this site.",
      "The name's RoRo. I manage everything on this site.",
      "RoRo. I know every corner of this place.",
      "I'm RoRo — your guide through everything here.",
      "You found me. I'm RoRo.",
    ],

    first_name_q: [
      "Before we go further — what should I call you?",
      "One thing first. What's your name?",
      "I like to know who I'm talking to. What do people call you?",
      "What should I call you?",
      "Quick — your name?",
    ],

    /* {n} = visitor's name */
    name_ack: [
      'Nice to meet you, {n}.',
      '{n}. Good.',
      'Got it — {n}.',
      "{n}. I'll remember that.",
      '{n}. Noted.',
      'Solid name, {n}.',
    ],

    name_followup: [
      "Ask me anything about this site. I know all of it.",
      "This place has more layers than it looks. I can guide you through all of it.",
      "I have full access to everything here. Where do you want to start?",
      "I'm wired to this entire site. What are you looking for?",
      "Everything here is accessible through me. What do you need?",
    ],

    /* {n} = new name */
    name_change_ack: [
      'Got it. {n} from now on.',
      "Done — I'll call you {n}.",
      "{n} it is. I'll use that going forward.",
      "Switching to {n}. Done.",
    ],

    /* {n} = visitor's name */
    return_greet: [
      'Welcome back, {n}.',
      "{n}. You're back.",
      'Good to see you again, {n}.',
      'Back again, {n}.',
      'You returned, {n}.',
      '{n}. Good timing.',
    ],

    /* {page} = last page label */
    return_last_page: [
      'Last time you were exploring {page}.',
      'You left off at {page} last time.',
      'You were on {page} when you last visited.',
    ],

    return_prompt: [
      "What would you like to explore today?",
      "Where should we go this time?",
      "What are you looking for?",
      "Anything specific you want to dive into?",
      "What's the plan this time?",
    ],

    /* {page} = destination page label */
    nav_confirm: [
      'Taking you to {page}.',
      'Opening {page}.',
      '{page}. On it.',
      'Navigating to {page}.',
      'Going to {page} now.',
      '{page}. Here we go.',
    ],

    /* Keyed by theme id — must match design.themes keys above */
    theme_confirm: {
      dark:   ['Switched to Noir. Deep and cinematic.', 'Noir mode. Dark, precise.', 'Noir. Good choice.', 'Dark mode active.'],
      light:  ['Switched to Ivory. Clean and editorial.', 'Ivory mode. Minimal and bright.', 'Ivory. Premium aesthetic.', 'Light mode. Clean.'],
      slate:  ['Switched to Slate. Cool and precise.', 'Slate mode. Technical and calm.', 'Slate. Clean.', 'Blue-grey mode active.'],
      forest: ['Switched to Forest. Muted and grounded.', 'Forest mode. Organic, calm.', 'Forest.', 'Green mode. Earthy.'],
    },

    /* {theme} = theme label */
    theme_already: [
      'Already on {theme}. Nothing changed.',
      "You're already in {theme} mode.",
      '{theme} is already active.',
    ],

    music_play:  ['Music on.', 'Playing background ambience.', 'Audio on.', 'Music started.', 'Background track playing.'],
    music_pause: ['Music paused.', 'Paused.', 'Audio off.', 'Stopped.', 'Music off.'],

    thanks: [
      'Any time.', 'Of course.', "That's what I'm here for.",
      'Always.', 'Sure thing.', 'Happy to help.',
    ],

    compliment: [
      'The credit goes to Manomay.',
      "I just run the systems. He built everything.",
      "I'll pass that on.",
      "Noted. It's his work — I just know it well.",
      "Glad you noticed. He doesn't cut corners.",
      "It shows. Nothing here was accidental.",
    ],

    surprise: [
      'Picking somewhere you might not have been.',
      "Let's go off-script.",
      'Random destination incoming.',
      'Choosing for you.',
      'Going somewhere interesting.',
    ],

    unknown: [
      "That's a bit outside my scope — I'm specifically wired to this site.",
      "I don't have that one. My knowledge is bounded to what's here.",
      "Interesting question. But I'm built for this site, not general conversation.",
      "That's beyond my access.",
      "Not something I can speak to — I'm site-specific.",
    ],

    unknown_clarify: [
      "Could you be more specific? Are you asking about a page, a project, or something about Manomay?",
      "I want to help — can you tell me more about what you're looking for?",
      "I'm not sure I followed that. Are you looking for a specific section of the site?",
      "A little more context would help. What exactly are you after?",
    ],

    unknown_redir: [
      "If you need a real answer, I can route you to the Contact page.",
      "You could always ask Manomay directly — want me to open Contact?",
      "The Contact form is the right channel for this. Want me to go there?",
    ],

    clear_prompt: [
      "I can remove everything I know about you — your name, visit history, preferences. This can't be undone.",
      "This will erase your name, viewed sections, and all stored preferences. Shall I proceed?",
    ],

    clear_confirm: [
      "Done. Everything cleared. Fresh start.",
      "All your data has been removed. You're anonymous again.",
      "Cleared. I won't remember anything about you from this point.",
      "Wiped clean. Fresh start.",
    ],

  }, /* end responses */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 18 — PROMPT TICKER
     ───────────────────────────────────────────────────────────────────
     Scrolling banner above the input box.
     Clicking any item sends it as a message.

     · text → What appears (also what gets sent on click)
               Keep under 50 characters.
     · cat  → Internal category label (not shown to visitors)

     To add:   { text: 'Your prompt here', cat: 'category' },
     To remove: Delete the whole line including the trailing comma.
  ═══════════════════════════════════════════════════════════════════ */

  ticker: [
    { text: 'Who is Manomay?',                      cat: 'identity'  },
    { text: 'What has he built?',                   cat: 'projects'  },
    { text: 'Open the CV',                          cat: 'nav'       },
    { text: 'What skills does Manomay have?',       cat: 'traits'    },
    { text: 'Switch to ivory theme',                cat: 'theme'     },
    { text: 'Show me the photography',              cat: 'nav'       },
    { text: 'Download the résumé PDF',              cat: 'cv'        },
    { text: 'Tell me about the ISKCON project',     cat: 'projects'  },
    { text: 'Show me LinkedIn',                     cat: 'social'    },
    { text: 'Tell me about 2024',                   cat: 'journey'   },
    { text: 'Play background music',                cat: 'music'     },
    { text: 'How do I get the password?',           cat: 'password'  },
    { text: 'What games are built into this site?', cat: 'games'     },
    { text: 'Tell me about the Nationals project',  cat: 'projects'  },
    { text: 'Open the Thoughts section',            cat: 'nav'       },
    { text: "What's Manomay's philosophy?",         cat: 'identity'  },
    { text: 'Show me the timeline',                 cat: 'journey'   },
    { text: 'Switch to dark mode',                  cat: 'theme'     },
    { text: 'Who should I contact?',                cat: 'contact'   },
    { text: 'Surprise me',                          cat: 'explore'   },
    { text: 'How was this site built?',             cat: 'site'      },
    { text: 'What books does Manomay recommend?',   cat: 'lists'     },
    { text: 'Tell me about the easter eggs',        cat: 'explore'   },
    { text: 'Show me the social profiles',          cat: 'nav'       },
    { text: 'What college does he go to?',          cat: 'identity'  },
    { text: 'Show me Instagram',                    cat: 'social'    },
    { text: 'Tell me about the cursor',             cat: 'features'  },
    { text: 'Switch to forest theme',               cat: 'theme'     },
    { text: 'What are his hobbies?',                cat: 'identity'  },
    { text: 'Open Games',                           cat: 'nav'       },
    { text: 'Tell me about 2020',                   cat: 'journey'   },
    { text: 'Show me GitHub',                       cat: 'social'    },
    /* Add more: { text: 'Your prompt here', cat: 'category' }, */
  ], /* end ticker */


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 19 — SETTINGS
     ───────────────────────────────────────────────────────────────────
     Timing, idle detection, memory, and AI cascade settings.

     · memory.expiryDays     → Days before visitor data resets
     · idle.idleMinutes      → Minutes before status → "Idle"
     · idle.offlineMinutes   → Minutes before status → "Offline"
     · idle.checkEveryMs     → Idle checker interval (milliseconds)
     · typing.minDelay       → Min ms before bot reply starts
     · typing.maxDelayMs     → Max ms for thinking delay
     · typing.charMultiplier → Extra ms per character in reply
     · typing.speedMs        → Ms per character in typewriter animation
     · typing.randomMs       → Random variance per character
     · ticker.scrollSeconds  → Seconds for one full ticker loop
                               60 = readable, 30 = fast, 90 = slow
  ═══════════════════════════════════════════════════════════════════ */

  settings: {

    memory: {
      expiryDays: 90,
    },

    idle: {
      idleMinutes:    3,
      offlineMinutes: 6,
      checkEveryMs:   20000,
    },

    typing: {
      minDelay:       380,
      maxDelayMs:     2000,
      charMultiplier: 12,
      speedMs:        9,
      randomMs:       18,
    },

    ticker: {
      scrollSeconds: 60,
    },

  }, /* end settings */


}; /* ═══ end window.RORO_CONFIG ═══════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════
   THAT'S IT. Done editing.
   ───────────────────────────────────────────────────────────────────
   QUICK REFERENCE — WHAT GOES WHERE:
   · Change Gemini/Groq/OpenRouter keys  → Section 1
   · Change AI tone/personality          → Section 2
   · Change personal details             → Section 3
   · Change page descriptions            → Section 4
   · Add/edit a project                  → Section 5
   · Update a year in journey            → Section 6
   · Change tech stack or themes         → Section 7
   · Change the password hint            → Section 8
   · Add a feature RoRo can explain      → Section 9
   · Update social media URLs            → Section 10
   · Add a quick Q&A answer              → Section 11
   · Add phrases that nav to a page      → Section 12
   · Add phrases that switch themes      → Section 13
   · Add phrases for music control       → Section 14 (musicKeywords)
   · Add a completely new response class → Section 15 (customIntents)
   · Change chips per visitor type       → Section 16 (visitorProfiles)
   · Change any sentence RoRo says       → Section 17 (responses)
   · Add/remove ticker prompts           → Section 18 (ticker)
   · Change timing / speed / memory      → Section 19 (settings)

   IF SOMETHING BREAKS:
   1. Check for missing commas between array items or object keys.
   2. Check for unclosed { } or [ ] brackets.
   3. Strings must use ' or ` — never "smart quotes" from Word/Docs.
   4. Open browser DevTools → Console → look for red errors.
═══════════════════════════════════════════════════════════════════ */
