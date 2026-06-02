/* ═══════════════════════════════════════════════════════════════════════════
   admin-control/crazy/manager-roro.js
   ─────────────────────────────────────────────────────────────────────────
   MSM Portfolio · RoRo Configuration File
   ─────────────────────────────────────────────────────────────────────────

   THIS IS THE ONLY FILE YOU EVER NEED TO EDIT.
   The engine (js/manager-roro.js) reads this file and does everything else.

   ─────────────────────────────────────────────────────────────────────────
   SECTIONS IN THIS FILE:
   ─────────────────────────────────────────────────────────────────────────

   SECTION  1 — OWNER INFO            · Who Manomay is
   SECTION  2 — PAGES                 · Every page, its label and description
   SECTION  3 — PROJECTS              · Every project with keywords
   SECTION  4 — YEARS                 · Journey timeline entries 2008–2026
   SECTION  5 — DESIGN INFO           · Stack, themes, philosophy
   SECTION  6 — PASSWORD INFO         · What's locked, how to get access
   SECTION  7 — FEATURES              · Site features RoRo can describe
   SECTION  8 — SOCIAL LINKS          · LinkedIn, Instagram, Email, CV
   SECTION  9 — FAQ ANSWERS           · Quick one-liner Q&A pairs
   SECTION 10 — NAVIGATION KEYWORDS   · NEW · Extra phrases that nav to pages
   SECTION 11 — THEME KEYWORDS        · NEW · Extra phrases that switch themes
   SECTION 12 — MUSIC KEYWORDS        · NEW · Extra phrases for music control
   SECTION 13 — SYNONYM TABLE         · NEW · Custom word synonyms/aliases
   SECTION 14 — CUSTOM INTENTS        · NEW · Add any new response class here
   SECTION 15 — VISITOR PROFILES      · NEW · Suggestions per visitor type
   SECTION 16 — SMALL TALK            · NEW · Casual conversation responses
   SECTION 17 — RESPONSE POOLS        · Every sentence RoRo says
   SECTION 18 — PROMPT TICKER         · Scrolling banner prompts
   SECTION 19 — SETTINGS              · Timing, idle, memory settings

   ─────────────────────────────────────────────────────────────────────────
   RULES:
   · Never delete a section entirely — the engine needs them all.
   · Arrays: commas between items. Last item may have a trailing comma.
   · Strings: use single quotes ' or backticks ` — never "smart" quotes.
   · {n}    = replaced with the visitor's name in any response string.
   · {page} = replaced with a page label in navigation responses.
   · To temporarily disable a customIntent: set enabled: false
   · To add a page: match the key to the page ID in index.html exactly.
   ─────────────────────────────────────────────────────────────────────────
═══════════════════════════════════════════════════════════════════════════ */

window.RORO_CONFIG = {


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 1 — OWNER INFO
     ───────────────────────────────────────────────────────────────────────
     The person whose portfolio this is.
     RoRo reads this whenever someone asks "who is he?" or "tell me about
     Manomay" or anything identity-related.

     · name          → Full name used in formal responses
     · shortName     → First name used in casual references
     · born          → Full birth date string shown when asked
     · birthplace    → City / country of birth
     · city          → Current city shown in "where is he?" responses
     · tagline       → One-liner shown in identity responses
     · philosophy    → The quote most associated with him
     · description   → 2–3 sentence bio for "who is he?" answers
     · traits        → Personality traits (shown as a list)
     · inspirations  → People / things that shaped him
     · workStyle     → One sentence on how he works
     · goals         → Long-term ambitions
     · contact       → Email address used in direct-contact responses
  ═══════════════════════════════════════════════════════════════════════ */

  owner: {

    name:        'Manomay Shailendra Misra',
    shortName:   'Manomay',
    born:        'August 29, 2008',
    birthplace:  'Andheri, Maharashtra, India',
    city:        'Mumbai · now Bengaluru',
    tagline:     'Born 2008 · Mumbai · Making something of it all',
    philosophy:  'Building legacy without losing softness.',

    /* 2–3 sentences. Used for "who is Manomay?" answers. */
    description: 'A seventeen-year-old creator, thinker, and builder from Bengaluru. Nomadic by upbringing — eight cities, one consistent ambition. He designs with intention, builds from scratch, and believes the process matters as much as the output.',

    /* Shown in list form when someone digs deeper. */
    traits: [
      'Ambitious',
      'Detail-oriented',
      'Nomadic by upbringing',
      'Calm under pressure',
      'Deeply curious',
      'Storyteller at heart',
    ],

    /* People and things that shaped his taste and thinking. */
    inspirations: [
      'Dieter Rams',
      'Paul Graham',
      'Japanese minimalism',
      'The craft of writing',
      'Architecture and space',
    ],

    /* One sentence on how he approaches work. */
    workStyle: 'Everything from scratch. No templates, no shortcuts. Each project is deliberate and considered.',

    /* What he is working toward. */
    goals: 'Build systems and stories that outlast trends. Contribute to something that matters before 25.',

    /* Direct email address. */
    contact: 'manomaysmisra2908@gmail.com',

  }, /* end owner */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 2 — PAGES
     ───────────────────────────────────────────────────────────────────────
     Every navigable section of the site.

     The KEY (e.g. 'home', 'about') MUST match the page ID in index.html.
     The page ID is whatever comes after 'page-' in the section's id attr.
     Example: <section id="page-about"> → key is 'about'

     · label    → Display name shown to the visitor
     · summary  → What RoRo says when navigating TO or ABOUT this page
     · features → Bullet list shown in detailed info responses

     To add a new page:
       1. Copy any entry below
       2. Change the key to match your page's id attribute
       3. Fill in label, summary, features
  ═══════════════════════════════════════════════════════════════════════ */

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
      summary: 'Where the work lives — a flat list of projects each with a status label. Click any project for a full description popup. Nationals is always last.',
      features: [
        'Flat project list',
        'Status labels: Completed / Ongoing / Abandoned',
        'Click any project for a full-detail popup',
      ],
    },

    profiles: {
      label:   'Profiles',
      summary: "All of Manomay's public internet presence — Instagram, LinkedIn, X, GitHub, Facebook. No clutter.",
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
        'Politics',
        'God & Faith',
        'Science',
        'Life & Philosophy',
        'Society & Culture',
        'Technology',
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
        'Web Series',
        'Books',
        'Places',
        'Movies',
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
        'Snake',
        'Memory Match',
        '2048',
        'Reaction Time',
        'Word Scramble',
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

  }, /* end pages */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 3 — PROJECTS
     ───────────────────────────────────────────────────────────────────────
     Each project RoRo can describe in detail.

     The KEY (e.g. 'nationals') is internal — it does not need to match
     anything in the HTML.

     · title       → Project display name used in responses
     · description → What RoRo says when asked about this project
     · status      → Status label (free text — write whatever you want)
     · type        → Category label, e.g. "Web / Development"
     · keywords    → Words that TRIGGER this project in user messages.
                     Add typos, abbreviations, alternate spellings.

     To add a new project:
       Copy any block, paste below the last one, fill in all fields.
       Make sure there's a comma between objects.
  ═══════════════════════════════════════════════════════════════════════ */

  projects: {

    nationals: {
      title:       'Nationals',
      description: 'A competition-level initiative representing the school at the KVS National Science Exhibition. The benchmark everything else is measured against — reached the national stage after winning at school, cluster, and regional levels.',
      status:      'Completed · 2024',
      type:        'Academic Competition',
      keywords:    ['nationals', 'national', 'competition', 'achievement', 'win', 'kvs', 'exhibition', 'kvs nationals', 'science exhibition'],
    },

    ecommerce: {
      title:       'E-commerce Prototype',
      description: 'A full e-commerce prototype built from scratch — product listings, cart, and checkout flow. Handcrafted, no frameworks. Built to demonstrate real-world product thinking and frontend development capability.',
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
      description: 'This website. Pure HTML, CSS, and JavaScript. Zero frameworks, zero templates. Cinematic splash screen, custom CMS through admin-control files, desktop sidebar system, 5 mini-games, photo albums, thoughts blog, RoRo AI layer, and 4 colour themes.',
      status:      'Ongoing · 2025–Present',
      type:        'Web / Design',
      keywords:    ['website', 'portfolio', 'personal', 'site', 'this', 'here', 'msm', 'web', 'this website', 'your site', 'this site'],
    },

    writing: {
      title:       'Until The Bullet Woke Me',
      description: 'A creative writing project. A story, composed with deliberate craft. The title carries the weight of the content. Completed in 2024.',
      status:      'Completed · 2024',
      type:        'Creative Writing',
      keywords:    ['writing', 'story', 'bullet', 'creative', 'fiction', 'narrative', 'until the bullet', 'bullet woke me', 'short story', 'prose'],
    },

    /* ── HOW TO ADD A NEW PROJECT ──────────────────────────────────────
     *
     * Copy the template below, uncomment it, and fill in your details:
     *
     * yourProjectKey: {
     *   title:       'Your Project Title',
     *   description: 'Full description RoRo says when asked. Be specific.',
     *   status:      'Completed · 2025',
     *   type:        'Design / Branding',
     *   keywords:    ['keyword one', 'keyword two', 'alternate spelling'],
     * },
     * ──────────────────────────────────────────────────────────────── */

  }, /* end projects */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 4 — YEARS (Journey Timeline)
     ───────────────────────────────────────────────────────────────────────
     RoRo reads this when someone asks "tell me about 2024" etc.
     The key MUST be the year as a plain number (not a string).

     Keep entries short — 1 to 3 sentences max.
     "Details being written." is fine as a placeholder.

     To add a year:  Add a new line: 2027: 'Your entry text.',
     To update:      Change the string value after the colon.
  ═══════════════════════════════════════════════════════════════════════ */

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

    /* Add future years here: */
    /* 2027: 'What happened in 2027.', */

  }, /* end years */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 5 — SITE DESIGN INFO
     ───────────────────────────────────────────────────────────────────────
     What RoRo says when someone asks about how the site was built,
     what themes are available, or about the design philosophy.

     · summary    → Paragraph for "how was this built?" questions
     · philosophy → The design principle quote
     · stack      → Tech used (shown as a list)
     · themes     → The 4 visual themes available.
                    The 'id' MUST match the data-theme attribute values exactly.
  ═══════════════════════════════════════════════════════════════════════ */

  design: {

    /* Shown when someone asks "how was this site built?" */
    summary: 'Built entirely from scratch — no templates, no frameworks. Pure HTML, CSS, and JavaScript. Four themes: Noir, Ivory, Slate, Forest. Typographic, geometric, deliberately minimal. Every animation hand-coded.',

    /* The design philosophy quote. */
    philosophy: 'The site should feel like a conversation, not a brochure. Every element is intentional. Nothing is decorative without purpose.',

    /* Tech stack list. Edit freely. */
    stack: [
      'Vanilla HTML',
      'Vanilla CSS',
      'Vanilla JavaScript',
      'EmailJS (contact form)',
      'Web Audio API (sound)',
      'localStorage (memory)',
      'GSAP (splash animation)',
    ],

    /* The 4 visual themes. id MUST match data-theme attribute exactly. */
    themes: {
      dark: {
        id:    'dark',
        label: 'Noir',
        desc:  'Deep black. The default. Serious, cinematic.',
      },
      light: {
        id:    'light',
        label: 'Ivory',
        desc:  'Warm white. Premium, editorial, minimal.',
      },
      slate: {
        id:    'slate',
        label: 'Slate',
        desc:  'Cool blue-grey. Clean, technical, precise.',
      },
      forest: {
        id:    'forest',
        label: 'Forest',
        desc:  'Muted green. Calm, organic, grounded.',
      },
    },

  }, /* end design */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 6 — PASSWORD INFO
     ───────────────────────────────────────────────────────────────────────
     RoRo NEVER reveals the actual password. This section controls what
     RoRo says when someone asks HOW to get the password.

     · hint           → Full response when someone asks "how do I get in?"
     · lockedSections → List of things that are locked (shown as context)
  ═══════════════════════════════════════════════════════════════════════ */

  password: {

    /* What RoRo says when someone asks about the password. */
    hint: "It isn't publicly distributed. Best route: the Contact page — explain why you want access, and Manomay decides. Genuine curiosity gets a response.",

    /* These are shown as context when someone asks what's locked. */
    lockedSections: [
      'Private photo albums',
      'Private journey entries',
      'Full curated lists',
      'Birth details',
      'Private family games',
      'Extended identity section',
    ],

  }, /* end password */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 7 — FEATURES
     ───────────────────────────────────────────────────────────────────────
     Descriptions of specific site features RoRo can explain.
     RoRo uses these when someone asks "how does X work?" or
     "tell me about the music / cursor / easter eggs" etc.

     · music   → music player explanation
     · themes  → theme switcher explanation
     · roro    → about RoRo itself
     · cursor  → custom cursor explanation
     · sound   → click sound toggle explanation
     · easter  → easter eggs / hidden features
     · sidebar → desktop sidebar explanation

     You can add new keys here and reference them in customIntents responses.
  ═══════════════════════════════════════════════════════════════════════ */

  features: {

    music: "Built-in music player with two tracks — background ambience loops by default. The easter-egg song unlocks after clicking Manomay's name on the homepage exactly seven times. A vinyl record then appears at the bottom left.",

    themes: "Four visual themes: Noir (dark), Ivory (light), Slate (cool blue-grey), Forest (muted green). Four dots in the top-right switch between them instantly.",

    roro: "That's me — RoRo. The site's intelligence layer. I know every section, can navigate for you, switch themes, control music, answer questions about Manomay, and show links to his social profiles.",

    cursor: "Custom animated cursor — a small dot and a trailing ring. Hover states change the cursor shape. Disabled automatically on touch devices.",

    sound: "Mechanical click/tick sounds on interactions — toggle the push-button icon in the nav bar to turn them on or off.",

    easter: "Seven clicks on the hero name → vinyl record appears and an easter-egg song starts. Type the word 'manomay' anywhere on the keyboard → accent colour flash. The splash screen can be skipped with 20–25 rapid clicks.",

    sidebar: "Desktop sidebar — the hamburger icon in the top right opens it. Contains navigation to sidebar-only pages: Photos, Journey, Clock, Thoughts, Lists, Games.",

    parallax: "The blueprint-style background grid on the homepage scrolls at 25% of content speed, creating a subtle depth effect.",

    navReel: "When you switch themes, the navbar letters briefly cycle through random uppercase characters before settling — a mechanical counter aesthetic.",

  }, /* end features */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 8 — SOCIAL LINKS
     ───────────────────────────────────────────────────────────────────────
     These power the action buttons RoRo shows when someone asks for
     a specific social profile, the CV, or email.

     · label    → Button text shown in RoRo's chat
     · hint     → Short description line in chat
     · url      → The actual link. Use '#' if not set up yet.
     · download → Set to true if it should trigger a file download

     These URLs are also used as fallbacks if the profiles page doesn't
     have them set in admin-control/pages/profiles.js.
  ═══════════════════════════════════════════════════════════════════════ */

  social: {

    instagram: {
      label: 'Instagram',
      hint:  'Visual work and personal moments.',
      url:   'https://www.instagram.com/m_s_m_2_9/',
    },

    linkedin: {
      label: 'LinkedIn',
      hint:  'Professional profile and work history.',
      url:   'https://www.linkedin.com/in/manomay-shailendra-misra',
    },

    x: {
      label: 'X (Twitter)',
      hint:  'Thoughts in real time.',
      url:   'https://x.com/_msm29',
    },

    github: {
      label: 'GitHub',
      hint:  'Code repositories.',
      url:   'https://github.com/m-s-m-2-9',
    },

    facebook: {
      label: 'Facebook',
      hint:  'Facebook profile.',
      url:   'https://www.facebook.com/profile.php?id=100075236510917',
    },

    email: {
      label: 'Email',
      hint:  'Direct inbox.',
      url:   'mailto:manomaysmisra2908@gmail.com',
    },

    cv: {
      label:    'Download CV',
      hint:     'Full résumé as a PDF.',
      url:      'manomay-cv.pdf', /* ← path relative to index.html */
      download: true,
    },

  }, /* end social */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 9 — FAQ ANSWERS
     ───────────────────────────────────────────────────────────────────────
     Quick one-liner answers for common questions.
     The key is an internal label — it doesn't need to match anything.
     The value is what RoRo says when the matching question is detected.

     The engine uses fuzzy matching on the KEY to find the best FAQ answer.
     So name your keys after what someone would ask about.

     To add a new FAQ: add a new line below.
     Format:  yourKey: 'Your answer text here.',

     IMPORTANT: For richer answers with navigation, use Section 14
     (Custom Intents) instead — FAQ is for quick one-liners only.
  ═══════════════════════════════════════════════════════════════════════ */

  faq: {

    /* ── About Manomay ─────────────────────────────────────────── */
    age:          'Manomay was born on August 29, 2008. Use the Clock page for a live millisecond countdown and exact age.',
    location:     'Originally from Mumbai, Maharashtra. Currently based in Bengaluru, Karnataka.',
    college:      'Currently pursuing BBA with Business Analytics at Don Bosco College, Bengaluru. Started 2026.',
    hobbies:      'Music and vintage records, reading, cinema, travel, games, photography. The Traits page has the full picture.',
    nationality:  'Indian. Born in Maharashtra, raised across eight cities.',

    /* ── About the site ────────────────────────────────────────── */
    stack:        'Vanilla HTML, CSS, and JavaScript. No React, no Vue, no templates. Everything hand-coded from scratch.',
    frameworks:   'None. This site uses zero JavaScript frameworks. Every animation, every interaction — pure vanilla JS.',
    howBuilt:     'Built from scratch over several months. HTML, CSS, JavaScript only. No template, no CMS, no framework.',
    howLong:      'Several months of development. Ongoing — features are still being added.',

    /* ── Access and password ───────────────────────────────────── */
    password:     'The password is not public. Contact Manomay via the Contact page and explain why you want access.',
    contactReason:'If you are reaching out for the site password — explain your reason clearly. Genuine curiosity gets a response.',

    /* ── Professional ──────────────────────────────────────────── */
    hiring:       'Manomay is open to interesting creative and technical opportunities. The Contact page is the right channel.',
    cv:           'The CV page has the full résumé. There is a downloadable PDF at the bottom of that page.',
    experience:   'ISKCON Summer Camp (2024) as Creative Educator and Media Lead. The CV page has the full picture.',

    /* ── Fun / personal ────────────────────────────────────────── */
    music:        'Built-in music player with two tracks. Click the sound bars icon in the nav. Seven clicks on the homepage name unlocks a hidden track.',
    games:        'Five fully playable games built into the site — Snake, Memory Match, 2048, Reaction Time, Word Scramble. Games page has them all.',
    books:        'Colleen Hoover, Ali Hazelwood, Mark Manson, Colleen Hoover, and more. The Lists page has his full reading list.',
    movies:       'Interstellar, Rockstar, Tumbbad, Zindagi Na Milegi Dobara — among others. The Lists page has his full movie list.',

    /* ── ADD YOUR OWN FAQ ENTRIES BELOW ───────────────────────── */
    /* Format:  yourKey: 'Your answer.', */

  }, /* end faq */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 10 — NAVIGATION KEYWORDS  (NEW)
     ───────────────────────────────────────────────────────────────────────
     Extra phrases that navigate to a specific page.
     These ADD to the engine's built-in navigation keywords — they do not
     replace them.

     Format:
       pageId: ['extra phrase 1', 'extra phrase 2'],

     The pageId must match a key in SECTION 2 (pages) exactly.
     Leave an array empty [] if you don't want to add extras for that page.

     Example use case: if users keep typing "skills" when you want them to
     go to the "traits" page, add 'skills' to the traits array here.
  ═══════════════════════════════════════════════════════════════════════ */

  navigationKeywords: {

    home:     ['front page', 'go home', 'homepage', 'main page', 'back to start'],
    about:    ['about manomay', 'his story', 'background', 'personal info', 'his identity'],
    photos:   ['his photos', 'pictures', 'photo albums', 'images', 'gallery', 'photo gallery'],
    resume:   ['résumé', 'his resume', 'his cv', 'his experience', 'work history', 'career'],
    projects: ['his projects', 'his work', 'what he built', 'his portfolio', 'his builds'],
    profiles: ['his socials', 'social media', 'online presence', 'find him online', 'his handles'],
    journey:  ['his life', 'his history', 'life story', 'his years', 'his chapters', 'his past'],
    birthday: ['countdown', 'birthday timer', 'his birthday', 'birth countdown', 'clock page'],
    thoughts: ['his opinions', 'his beliefs', 'his views', 'what he thinks', 'his blog', 'belief posts'],
    contact:  ['reach out', 'get in touch', 'message him', 'write to him', 'send message', 'drop a message'],
    lists:    ['his recommendations', 'what he watches', 'what he reads', 'curations', 'his lists'],
    skills:   ['what he can do', 'his abilities', 'skills page', 'traits page', 'his skills'],
    games:    ['play a game', 'built-in games', 'mini games', 'games section'],
    social:   ['testimonials', 'brands', 'who he worked with', 'social proof page', 'companies'],

  }, /* end navigationKeywords */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 11 — THEME KEYWORDS  (NEW)
     ───────────────────────────────────────────────────────────────────────
     Extra phrases that trigger a theme switch.
     These ADD to the engine's built-in theme switching logic.

     Format:
       themeId: ['extra phrase 1', 'extra phrase 2'],

     The themeId must match a key in SECTION 5 design.themes exactly.
  ═══════════════════════════════════════════════════════════════════════ */

  themeKeywords: {

    dark:   ['dark mode', 'night mode', 'noir mode', 'make it dark', 'darker', 'black theme', 'go dark', 'dark theme'],
    light:  ['light mode', 'ivory mode', 'white theme', 'bright mode', 'make it bright', 'lighter', 'go light', 'daytime', 'clean theme'],
    slate:  ['slate mode', 'blue mode', 'cool mode', 'grey theme', 'blue grey', 'go slate', 'technical theme'],
    forest: ['forest mode', 'green mode', 'nature mode', 'earthy theme', 'go forest', 'green theme', 'olive'],

  }, /* end themeKeywords */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 12 — MUSIC KEYWORDS  (NEW)
     ───────────────────────────────────────────────────────────────────────
     Extra phrases that trigger music play / pause.
     These ADD to the engine's built-in music keyword logic.

     · play  → phrases that START the music
     · pause → phrases that STOP the music
  ═══════════════════════════════════════════════════════════════════════ */

  musicKeywords: {

    play:  [
      'play the music', 'start the music', 'put some music on', 'turn on music',
      'play ambient', 'play background', 'play something', 'music please', 'turn music on',
    ],

    pause: [
      'stop the music', 'pause the music', 'turn off music', 'silence', 'mute',
      'music off', 'stop it', 'no music', 'quiet please', 'turn it off',
    ],

  }, /* end musicKeywords */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 13 — SYNONYM TABLE  (NEW)
     ───────────────────────────────────────────────────────────────────────
     Custom word aliases and synonym groups.
     These MERGE with the engine's built-in synonyms.

     The engine uses synonyms to expand what it understands. If someone
     types "vitae" you want it to also look up "cv". If someone types
     "bba" you want it to find "college" related content. Add those here.

     Format:
       'canonical': ['synonym1', 'synonym2'],

     The canonical form is what the engine uses internally.
     The synonyms are what users might type instead.

     TIP: Add Indian English phrases, slang, or alternate spellings
     that your users are likely to type.
  ═══════════════════════════════════════════════════════════════════════ */

  synonyms: {

    /* Platform names */
    'instagram': ['insta', 'ig', 'instagram page', 'msm insta'],
    'linkedin':  ['li', 'linked in', 'linked-in', 'professional'],
    'github':    ['git', 'gh', 'github page', 'repos', 'repositories'],
    'x':         ['twitter', 'tweet', 'tweets', 'x account'],
    'facebook':  ['fb', 'facebook page'],
    'whatsapp':  ['wa', 'whats app', 'watsapp', 'ws'],

    /* Project names */
    'nationals':  ['national', 'kvs nationals', 'exhibition', 'kvs'],
    'iskcon':     ['iskon', 'isckon', 'krishna camp', 'temple camp', 'hare krishna camp'],
    'ecommerce':  ['ecom', 'shop', 'store', 'shopping site', 'e-commerce', 'e commerce'],

    /* General site terms */
    'cv':         ['resume', 'résumé', 'curriculum vitae', 'vitae', 'biodata'],
    'music':      ['song', 'audio', 'ambience', 'background music', 'track', 'vinyl'],
    'photo':      ['photograph', 'pic', 'picture', 'snap', 'image'],
    'thought':    ['opinion', 'view', 'belief', 'stance', 'take'],
    'password':   ['pw', 'pass', 'passkey', 'access code', 'unlock code'],

    /* Indian English / casual phrases */
    'contact':    ['reach', 'ping', 'dm', 'message', 'hmu', 'hit up'],
    'good':       ['achha', 'nice', 'sahi', 'badiya', 'cool'],
    'surprise':   ['kuch bhi', 'anything', 'random karo', 'choose karo'],

    /* ADD YOUR OWN SYNONYMS BELOW: */
    /* 'yourWord': ['alias1', 'alias2'], */

  }, /* end synonyms */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 14 — CUSTOM INTENTS  (NEW — THE MOST POWERFUL SECTION)
     ───────────────────────────────────────────────────────────────────────
     This is where you add COMPLETELY NEW response classes.
     Think of each entry as: "when someone says THIS → RoRo says THAT".

     Each object defines one intent. Fields:
     ───────────────────────────────────────────────────────────────────────

     id          REQUIRED · Unique identifier string. No spaces.
                           Use underscores: 'info_college', 'about_food', etc.

     label       REQUIRED · Human-readable description. For your reference only.

     enabled     OPTIONAL · true (default) or false to temporarily disable.
                           Set to false instead of deleting if you want to
                           pause an intent without losing it.

     priority    OPTIONAL · 0 (default) to 10.
                           Priority 1+ = checked BEFORE built-in intents.
                           Priority 0  = checked AFTER built-in intents.
                           Use 5-10 if this should always take precedence.

     keywords    REQUIRED · Array of phrases that trigger this intent.
                           The engine uses fuzzy matching — typos are ok.
                           Add as many variants, synonyms, and alternate
                           phrasings as you want.

     response    REQUIRED · Array of response strings.
                           RoRo picks ONE at random each time.
                           Add multiple strings for variety.
                           Use {n} anywhere to insert the visitor's name.

     navigate    OPTIONAL · Page ID to navigate to AFTER responding.
                           Must match a key in SECTION 2 (pages).
                           Set to null or omit to not navigate.

     options     OPTIONAL · Array of quick-chip buttons shown after response.
                           These are clickable chips that send a new message.
                           Keep each chip text short (under 40 characters).
                           Set to null or omit to show no chips.

     buttons     OPTIONAL · Array of action button objects shown after response.
                           Format: { label: 'text', href: 'url', primary: true/false }
                           primary: true = accent background button.
                           Set to null or omit to show no buttons.

     ───────────────────────────────────────────────────────────────────────
     HOW TO ADD A NEW INTENT:
     ───────────────────────────────────────────────────────────────────────

     1. Copy the template at the bottom of this section.
     2. Give it a unique id (no spaces).
     3. Add keywords that users might type.
     4. Add at least 2 response variations.
     5. Optionally add navigate, options, or buttons.
     6. Make sure there's a comma after the closing } before the next intent.

     ───────────────────────────────────────────────────────────────────────
     EXAMPLES OF WHAT YOU CAN DO:
     ───────────────────────────────────────────────────────────────────────

     · Answer "what college does he go to?" → info_college
     · Answer "what cities has he lived in?" → info_cities
     · Handle "how do I hire him?" → action_hiring
     · Respond to "I'm a recruiter" → recruiter_intro
     · Handle Indian-language greetings → indian_greeting
     · Explain origami workshops → info_origami
     · Answer "what music does he like?" → info_music_taste
     · Handle "I know Manomay personally" → personal_connection

  ═══════════════════════════════════════════════════════════════════════ */

  customIntents: [

    /* ── PERSONAL / BACKGROUND ─────────────────────────────────── */

    {
      id:       'info_college',
      label:    'College and current education',
      enabled:  true,
      priority: 0,
      keywords: [
        'college', 'university', 'bba', 'don bosco', 'studying', 'degree',
        'course', 'enrolled', 'bachelor', 'business analytics', 'bengaluru college',
        'where does he study', 'what is he studying', 'current education',
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
      label:    'Cities and places lived',
      enabled:  true,
      priority: 0,
      keywords: [
        'cities', 'moved', 'how many cities', 'lived', 'nomadic', 'india',
        'mumbai', 'bengaluru', 'bangalore', 'jaipur', 'where has he lived',
        'different cities', 'grew up', 'upbringing', 'moved around',
      ],
      response: [
        'Eight cities across India — Jaipur, Mumbai, Bengaluru among others. Nomadic by design, grounded by intention.',
        'He has lived in eight cities across India. The constant movement shaped his perspective more than any single place could.',
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
        'admires', 'role model', 'dieter rams', 'paul graham', 'minimalism',
        'who influenced', 'who inspired', 'what shapes him',
      ],
      response: [
        'Dieter Rams for design discipline. Paul Graham for thinking about building. Japanese minimalism for restraint. The craft of writing and architecture round it out.',
        'The inspirations: Dieter Rams (form follows function), Paul Graham (build things that matter), Japanese minimalism (less, but better). Each shapes how he approaches any project.',
      ],
      navigate: null,
      options:  ['Tell me more about Manomay', 'Show me Identity', 'What has he built?'],
      buttons:  null,
    },

    {
      id:       'info_origami',
      label:    'Origami and paper craft hobby',
      enabled:  true,
      priority: 0,
      keywords: [
        'origami', 'paper', 'paper engineering', 'paper craft', 'folding',
        'craft', 'paper folding', 'cardboard', 'hands-on', 'paper art',
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
      id:       'info_philosophy_deep',
      label:    'Deep philosophy or worldview question',
      enabled:  true,
      priority: 0,
      keywords: [
        'philosophy', 'worldview', 'values', 'principles', 'what does he believe',
        'what does manomay think', 'his mindset', 'way of thinking', 'core values',
        'deep beliefs', 'what he stands for', 'his take on life',
      ],
      response: [
        '"Building legacy without losing softness." That\'s the core of it. Calm execution, intentional detail, work that outlasts the moment.',
        'The Thoughts section has his unfiltered beliefs across six categories — Politics, Faith, Science, Life, Society, Technology. Worth reading.',
      ],
      navigate: 'thoughts',
      options:  ['Open Thoughts', 'Tell me more about Manomay', 'Show me Identity'],
      buttons:  null,
    },

    {
      id:       'info_writing_project',
      label:    'The writing project',
      enabled:  true,
      priority: 0,
      keywords: [
        'until the bullet', 'bullet woke me', 'writing project', 'story he wrote',
        'creative writing project', 'his book', 'did he write', 'wrote a story',
        'fiction project', 'his fiction',
      ],
      response: [
        '"Until The Bullet Woke Me" — a creative writing project. Deliberate craft. The title carries the weight of the content. Completed 2024.',
        'He wrote a story in 2024. "Until The Bullet Woke Me." Not much is shared about it publicly — which is intentional.',
      ],
      navigate: 'projects',
      options:  ['Show me all projects', 'Tell me about ISKCON', 'Who is Manomay?'],
      buttons:  null,
    },

    /* ── SITE FEATURES ─────────────────────────────────────────── */

    {
      id:       'info_cursor_feature',
      label:    'Custom cursor explanation',
      enabled:  true,
      priority: 0,
      keywords: [
        'cursor', 'custom cursor', 'dot cursor', 'that dot', 'the cursor',
        'cursor effect', 'mouse cursor', 'cursor ring', 'cursor dot',
      ],
      response: [
        'Custom cursor — a small dot and a trailing ring. On the light theme it stays clean gold. On dark themes it uses a blend mode for an inverted glow effect. Auto-disabled on touch devices.',
        'The cursor is fully custom — dot and outer ring. It changes shape on hover states and adapts to each theme.',
      ],
      navigate: null,
      options:  ['What other features does the site have?', 'Tell me about easter eggs', 'How was this site built?'],
      buttons:  null,
    },

    {
      id:       'info_reel_animation',
      label:    'Nav reel animation',
      enabled:  true,
      priority: 0,
      keywords: [
        'reel animation', 'letter animation', 'navbar animation', 'nav animation',
        'letters scramble', 'scramble effect', 'mechanical letters', 'letter reel',
        'letters change', 'nav letters', 'that animation in nav',
      ],
      response: [
        'When you switch themes, the navbar letters briefly cycle through random uppercase characters and numbers before settling — a mechanical counter aesthetic. It only fires on theme change.',
        'That\'s the letter-reel animation. Each nav item\'s letters scramble and settle when you change themes. Think airport departure boards, slot machines. Premium, not chaotic.',
      ],
      navigate: null,
      options:  ['Switch to ivory theme', 'Switch to forest theme', 'Tell me about other features'],
      buttons:  null,
    },

    {
      id:       'info_parallax',
      label:    'Grid parallax on homepage',
      enabled:  true,
      priority: 0,
      keywords: [
        'parallax', 'background moves', 'grid scrolling', 'grid moves', 'background grid',
        'blueprint grid', 'depth effect', 'background scroll', 'grid depth',
      ],
      response: [
        'The blueprint-style background grid on the homepage scrolls at 25% of content speed. The foreground moves at 1x, the grid at 0.25x — creating a subtle sense of depth.',
        'Subtle parallax on the homepage. The grid moves more slowly than the content, making the foreground feel heavier and closer. You feel the depth rather than notice it.',
      ],
      navigate: null,
      options:  ['Show me Home', 'Tell me about the design', 'How was this site built?'],
      buttons:  null,
    },

    /* ── PROFESSIONAL / HIRING ─────────────────────────────────── */

    {
      id:       'action_hiring',
      label:    'Hiring or professional opportunity',
      enabled:  true,
      priority: 0,
      keywords: [
        'hire him', 'hiring', 'opportunity', 'work with him', 'professional opportunity',
        'collaborate', 'freelance', 'job opportunity', 'recruiter', 'can i hire',
        'internship', 'want to work', 'looking to hire', 'commission',
      ],
      response: [
        'Manomay is open to interesting opportunities — creative, technical, or collaborative. The Contact page is the right channel. State your intent clearly.',
        'If you\'re looking to hire or collaborate — Contact page. He reads every message. A clear, specific message gets a response.',
      ],
      navigate: null,
      options:  ['Open Contact', 'Download CV', 'Show me Projects', 'Show me the CV page'],
      buttons: [
        { label: '→ Open Contact', href: '#', primary: true },
        { label: '↓ Download CV',  href: 'manomay-cv.pdf', download: 'Manomay-Misra-CV.pdf' },
      ],
    },

    {
      id:       'info_achievements',
      label:    'Achievements and accomplishments',
      enabled:  true,
      priority: 0,
      keywords: [
        'achievements', 'accomplishments', 'what has he done', 'proud of', 'highlights',
        'best work', 'biggest achievement', 'stand out', 'notable', 'impressive',
        'most impressive', 'his wins',
      ],
      response: [
        'Nationals: KVS national-level science exhibition. ISKCON: Creative Educator and Media Lead for 40+ students. This website: built entirely from scratch. And there\'s more in the pipeline.',
        'The benchmarks: reaching KVS Nationals (2024), leading the ISKCON Camp\'s media and education (2024), and building this site from zero. The CV has the full picture.',
      ],
      navigate: 'projects',
      options:  ['Show me all Projects', 'Tell me about Nationals', 'Download the CV'],
      buttons:  null,
    },

    /* ── CASUAL / SMALL TALK ───────────────────────────────────── */

    {
      id:       'small_how_are_you',
      label:    'How are you / how is roro doing',
      enabled:  true,
      priority: 0,
      keywords: [
        'how are you', 'how are you doing', 'how is roro', 'you okay', 'all good',
        'what\'s up roro', 'how do you do', 'you doing well', 'you alright',
      ],
      response: [
        'Running smoothly. What can I help you with?',
        'Operational and attentive. What are you looking for?',
        'Good — all systems are up. What do you need?',
        'Ready to go. Ask me anything about this site.',
      ],
      navigate: null,
      options:  null,
      buttons:  null,
    },

    {
      id:       'small_indian_greeting',
      label:    'Indian greetings (namaste, kem cho, etc.)',
      enabled:  true,
      priority: 0,
      keywords: [
        'namaste', 'namaskar', 'kem cho', 'kya haal', 'jai hind', 'sat sri akal',
        'vanakkam', 'salam', 'namasté', 'kaise ho', 'kasa kay', 'suprabhat',
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
      label:    'Goodbye / closing the chat',
      enabled:  true,
      priority: 0,
      keywords: [
        'bye', 'goodbye', 'see you', 'later', 'take care', 'good night', 'good bye',
        'catch you later', 'ciao', 'adios', 'ta ta', 'tata', 'ok bye', 'bye bye',
      ],
      response: [
        'Goodbye. Come back whenever.',
        'See you.',
        'Alright. I\'ll be here.',
        'Good. Come back if you need anything.',
      ],
      navigate: null,
      options:  null,
      buttons:  null,
    },

    {
      id:       'small_bored',
      label:    'User is bored or has nothing to say',
      enabled:  true,
      priority: 0,
      keywords: [
        'i\'m bored', 'im bored', 'bored', 'nothing to do', 'entertaining',
        'entertain me', 'amuse me', 'something fun', 'kill time', 'boring',
      ],
      response: [
        'The Games page has five fully playable games. That should help.',
        'Snake, Memory Match, 2048, Reaction Time, Word Scramble — all built into this site. Games page.',
        'Bored? Try clicking Manomay\'s name on the homepage seven times. Something will happen.',
      ],
      navigate: 'games',
      options:  ['Open Games', 'Surprise me', 'Tell me about easter eggs', 'Play music'],
      buttons:  null,
    },

    {
      id:       'small_nice_to_meet',
      label:    'Nice to meet you / pleasure',
      enabled:  true,
      priority: 0,
      keywords: [
        'nice to meet you', 'pleasure', 'good to meet', 'glad to meet', 'pleased to meet',
        'happy to meet', 'good to be here', 'glad to be here',
      ],
      response: [
        'Likewise. What are you looking for?',
        'Good to have you here. Ask me anything.',
        'Appreciated. What can I help you with?',
      ],
      navigate: null,
      options:  ['Who is Manomay?', 'Show me Projects', 'Surprise me'],
      buttons:  null,
    },

    {
      id:       'info_whatsapp_offline',
      label:    'WhatsApp offline / why no WhatsApp',
      enabled:  true,
      priority: 1, /* priority 1 — checked before built-in nav_profiles */
      keywords: [
        'whatsapp', 'wa', 'whats app', 'watsapp', 'why no whatsapp',
        'whatsapp offline', 'whatsapp not working', 'whatsapp disabled',
        'business number', 'whatsapp number', 'whatsapp business',
      ],
      response: [
        'WhatsApp Business is being set up — no dedicated business number yet. In the meantime, Instagram or LinkedIn are the best channels.',
        'WhatsApp is temporarily offline. No business number set up yet. Instagram (@m_s_m_2_9) or LinkedIn work well instead.',
      ],
      navigate: null,
      options:  ['Show me Instagram', 'Show me LinkedIn', 'Open Profiles page'],
      buttons: [
        { label: '↗ Instagram',       href: 'https://www.instagram.com/m_s_m_2_9/', primary: true },
        { label: '↗ LinkedIn',        href: 'https://www.linkedin.com/in/manomay-shailendra-misra', primary: false },
      ],
    },

    /* ──────────────────────────────────────────────────────────────────
     * TEMPLATE — Copy this block, paste above the closing ], fill in.
     *
     * {
     *   id:       'your_unique_id',
     *   label:    'What this intent handles (for your reference)',
     *   enabled:  true,
     *   priority: 0,
     *   keywords: [
     *     'keyword one',
     *     'keyword two',
     *     'keyword three',
     *   ],
     *   response: [
     *     'First possible response. RoRo picks randomly. Use {n} for name.',
     *     'Second possible response. Have at least 2 for variety.',
     *   ],
     *   navigate: null,
     *   options: [
     *     'Quick chip suggestion 1',
     *     'Quick chip suggestion 2',
     *   ],
     *   buttons: null,
     * },
     * ────────────────────────────────────────────────────────────────── */

  ], /* end customIntents */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 15 — VISITOR PROFILES  (NEW)
     ───────────────────────────────────────────────────────────────────────
     RoRo detects what TYPE of visitor someone is (recruiter, developer,
     creative, friend, etc.) based on what they type.

     You can override the suggested chips per visitor type here.
     These replace the engine defaults for each profile type.

     Profile types: recruiter · founder · creative · developer ·
                    teacher · friend · collaborator · newcomer

     Leave a profile type out (or set to null) to use engine defaults.
  ═══════════════════════════════════════════════════════════════════════ */

  visitorProfiles: {

    recruiter: [
      'Open the CV',
      'Download résumé PDF',
      'See all projects',
      'What achievements stand out?',
      'How to get in touch?',
    ],

    founder: [
      'What has been built here?',
      'How was this site made?',
      'Show me the most ambitious project',
      'What skills does Manomay have?',
      'How to collaborate?',
    ],

    creative: [
      'Show me the photography',
      'What themes are available?',
      'Tell me about the design philosophy',
      'Show me the Traits section',
      'How was this built?',
    ],

    developer: [
      'How was this site built?',
      'What tech stack is used?',
      'Show me the projects',
      'Is there any open source work?',
      'Tell me about the easter eggs',
    ],

    teacher: [
      'Who is Manomay?',
      'Show the Journey timeline',
      'What projects are completed?',
      'Tell me about the ISKCON camp',
      'What subjects does he study?',
    ],

    friend: [
      'Surprise me',
      'Show me the games',
      'What easter eggs are there?',
      'Play some music',
      'Tell me a fun fact about the site',
    ],

    collaborator: [
      'Show me the projects',
      'How to get in touch?',
      'Download the CV',
      'What skills does Manomay have?',
      'Tell me about ISKCON',
    ],

    newcomer: [
      'Who is Manomay?',
      'What is this site?',
      'Show me the best work',
      'Take me somewhere interesting',
      'What can RoRo do?',
    ],

  }, /* end visitorProfiles */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 16 — SMALL TALK  (NEW)
     ───────────────────────────────────────────────────────────────────────
     Extra casual responses for when RoRo needs a variety of filler
     responses. These are used in greeting and thanks contexts.

     You can add more pools here and reference them in custom intents.
     Currently available:

     · morning  → used when someone opens the panel in the morning
     · evening  → used when someone opens the panel in the evening
     · night    → used for late-night visits
     · general  → general small talk catch-all
  ═══════════════════════════════════════════════════════════════════════ */

  smallTalk: {

    morning: [
      'Morning already in motion.',
      'Good time to explore. Or build.',
      'The day hasn\'t decided what it is yet.',
      'Morning light is honest.',
    ],

    evening: [
      'Evening feels quieter here.',
      'The day is softening at its edges.',
      'End-of-day clarity.',
      'Evenings are for noticing things you missed.',
    ],

    night: [
      'Late enough to mean something.',
      'The city dims. You stay lit.',
      'After-hours. This is when real things happen.',
      'Night has a particular kind of focus.',
      'Most of the city is asleep right now.',
    ],

    general: [
      'Go ahead.',
      'Ask away.',
      'What do you need?',
      'I\'m listening.',
    ],

  }, /* end smallTalk */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 17 — RESPONSE POOLS
     ───────────────────────────────────────────────────────────────────────
     Every sentence RoRo says lives here. Each key is a "pool" — an array
     of possible responses. RoRo picks ONE at random each time.

     Add more strings to any array for more variety.
     Remove strings to simplify. Never delete the key itself.

     SPECIAL TOKENS (work in any response string):
     · {n}     → replaced with the visitor's name
     · {page}  → replaced with a page label (for navigation confirmations)
     · {theme} → replaced with a theme name (for theme responses)

     ─────────────────────────────────────────────────────────────────────
     POOL REFERENCE:
     · first_hello        → Very first line when panel opens (new visitor)
     · first_intro        → RoRo introducing itself
     · first_name_q       → Asking for the visitor's name
     · name_ack           → Confirming we heard their name. Uses {n}.
     · name_followup      → What to say right after getting their name
     · name_change_ack    → When visitor says "call me X". Uses {n}.
     · return_greet       → Returning visitor opening. Uses {n}.
     · return_last_page   → Recalling where they left off. Uses {page}.
     · return_prompt      → Asking what they want to do this visit
     · nav_confirm        → Confirming navigation. Uses {page}.
     · theme_confirm      → Confirming theme switch (nested per theme id)
     · theme_already      → Already on that theme. Uses {theme}.
     · music_play         → Music started confirmation
     · music_pause        → Music paused confirmation
     · thanks             → Response to "thanks"
     · compliment         → Response to "nice site!" type messages
     · surprise           → Before sending to a random page
     · unknown            → When RoRo does not understand
     · unknown_clarify    → Asking user to clarify a vague message
     · unknown_redir      → Offering to go to Contact as fallback
     · clear_confirm      → After user data is deleted
     · clear_prompt       → Before deleting — asking to confirm
  ═══════════════════════════════════════════════════════════════════════ */

  responses: {

    /* ── NEW VISITOR ────────────────────────────────────────────── */

    first_hello: [
      'Hello.',
      'Hello there.',
      'Good to have you here.',
      'Hi.',
      'Hey.',
      /* Add more: 'Welcome.', */
    ],

    first_intro: [
      "I'm RoRo — the intelligence layer running this site.",
      "The name's RoRo. I manage everything on this site.",
      "RoRo. I know every corner of this place.",
      "I'm RoRo — your guide through everything here.",
      "You found me. I'm RoRo.",
      /* Add more greetings here. */
    ],

    first_name_q: [
      "Before we go further — what should I call you?",
      "One thing first. What's your name?",
      "I like to know who I'm talking to. What do people call you?",
      "What should I call you?",
      "Quick — your name?",
    ],

    /* ── NAME HANDLING ──────────────────────────────────────────── */

    /* {n} = replaced with the visitor's name automatically */
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

    /* {n} = the new name */
    name_change_ack: [
      'Got it. {n} from now on.',
      "Done — I'll call you {n}.",
      "{n} it is. I'll use that going forward.",
      "Switching to {n}. Done.",
    ],

    /* ── RETURNING VISITOR ──────────────────────────────────────── */

    /* {n} = visitor's name */
    return_greet: [
      'Welcome back, {n}.',
      "{n}. You're back.",
      'Good to see you again, {n}.',
      'Back again, {n}.',
      'You returned, {n}.',
      '{n}. Good timing.',
    ],

    /* {page} = the page label they were on last visit */
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

    /* ── NAVIGATION ─────────────────────────────────────────────── */

    /* {page} = the destination page label */
    nav_confirm: [
      'Taking you to {page}.',
      'Opening {page}.',
      '{page}. On it.',
      'Navigating to {page}.',
      'Going to {page} now.',
      '{page}. Here we go.',
    ],

    /* ── THEME SWITCHING ────────────────────────────────────────── */
    /* Each key MUST match a theme id in SECTION 5 design.themes */

    theme_confirm: {

      dark: [
        'Switched to Noir. Deep and cinematic.',
        'Noir mode. Dark, precise.',
        'Noir. Good choice.',
        'Dark mode active.',
        'Noir. This is the default for a reason.',
      ],

      light: [
        'Switched to Ivory. Clean and editorial.',
        'Ivory mode. Minimal and bright.',
        'Ivory. Premium aesthetic.',
        'Light mode. Clean.',
        'Ivory — editorial and refined.',
      ],

      slate: [
        'Switched to Slate. Cool and precise.',
        'Slate mode. Technical and calm.',
        'Slate. Clean.',
        'Blue-grey mode active.',
        'Slate — calm and focused.',
      ],

      forest: [
        'Switched to Forest. Muted and grounded.',
        'Forest mode. Organic, calm.',
        'Forest.',
        'Green mode. Earthy.',
        'Forest — calm and grounded.',
      ],

    },

    /* {theme} = the theme label (e.g. "Noir") */
    theme_already: [
      'Already on {theme}. Nothing changed.',
      "You're already in {theme} mode.",
      '{theme} is already active.',
    ],

    /* ── MUSIC ──────────────────────────────────────────────────── */

    music_play: [
      'Music on.',
      'Playing background ambience.',
      'Audio on.',
      'Music started.',
      'Background track playing.',
    ],

    music_pause: [
      'Music paused.',
      'Paused.',
      'Audio off.',
      'Stopped.',
      'Music off.',
    ],

    /* ── REACTIONS ──────────────────────────────────────────────── */

    thanks: [
      'Any time.',
      'Of course.',
      "That's what I'm here for.",
      'Always.',
      'Sure thing.',
      'Happy to help.',
    ],

    compliment: [
      'The credit goes to Manomay.',
      "I just run the systems. He built everything.",
      "I'll pass that on.",
      "Noted. It's his work — I just know it well.",
      "Glad you noticed. He doesn't cut corners.",
      "It shows, doesn't it. Nothing here was accidental.",
    ],

    surprise: [
      'Picking somewhere you might not have been.',
      "Let's go off-script.",
      'Random destination incoming.',
      'Choosing for you.',
      'Going somewhere interesting.',
    ],

    /* ── FALLBACKS ──────────────────────────────────────────────── */

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
      "I'd point you to the Contact page for that.",
    ],

    /* ── DATA CLEAR ─────────────────────────────────────────────── */

    clear_prompt: [
      "I can remove everything I know about you — your name, visit history, preferences. This can't be undone.",
      "This will erase your name, viewed sections, and all stored preferences. Shall I proceed?",
    ],

    clear_confirm: [
      "Done. Everything cleared. Fresh start.",
      "All your data has been removed. You're anonymous again.",
      "Cleared. I won't remember anything about you from this point.",
      "Wiped clean. You're starting fresh.",
    ],

  }, /* end responses */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 18 — PROMPT TICKER
     ───────────────────────────────────────────────────────────────────────
     The scrolling banner of example prompts shown above the input box.

     · text → What appears in the banner. Also sent as a message if clicked.
               Keep under 50 characters for clean display.
     · cat  → Category label (internal only, not shown to visitors).
               Useful for your own organisation.

     Tips:
     · Click any item in the live site → sends it as a message automatically.
     · Add as many as you want — they loop infinitely.
     · Remove ones that feel irrelevant.

     To add:   { text: 'Your prompt here', cat: 'category' },
     To remove: Delete the whole line including the trailing comma.
  ═══════════════════════════════════════════════════════════════════════ */

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

    /* ── ADD NEW PROMPTS BELOW ─────────────────────────────────── */
    /* { text: 'Your prompt here', cat: 'category' }, */

  ], /* end ticker */


  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 19 — SETTINGS
     ───────────────────────────────────────────────────────────────────────
     Behavioural settings. Edit these if RoRo feels too fast, too slow,
     times out too early, or the typing animation feels off.

     · memory.expiryDays     → Days before saved visitor data expires and resets.
                                90 = visitor is remembered for 90 days.

     · idle.idleMinutes      → Minutes of inactivity before status → "Idle".
     · idle.offlineMinutes   → Minutes of inactivity before status → "Offline".
     · idle.checkEveryMs     → How often the idle checker runs (in milliseconds).
                                20000 = every 20 seconds.

     · typing.minDelay       → Minimum ms before a bot reply starts appearing.
                                Simulates thinking time.
     · typing.maxDelayMs     → Maximum ms for the thinking delay.
     · typing.charMultiplier → Extra ms added per character in the reply.
                                Longer replies → slightly longer wait.
     · typing.speedMs        → Ms per character in the typewriter animation.
                                Lower = faster typing animation.
     · typing.randomMs       → Random extra ms per character (adds variation).

     · ticker.scrollSeconds  → How long one full ticker loop takes.
                                60 = slow and readable.
                                30 = fast scrolling.
                                90 = very slow.
  ═══════════════════════════════════════════════════════════════════════ */

  settings: {

    memory: {
      expiryDays: 90,   /* ← Visitor remembered for this many days */
    },

    idle: {
      idleMinutes:    3,      /* ← Status dot → "Idle" after this many minutes */
      offlineMinutes: 6,      /* ← Status dot → "Offline" after this many minutes */
      checkEveryMs:   20000,  /* ← Idle checker interval in milliseconds */
    },

    typing: {
      minDelay:        380,   /* ← Minimum thinking delay (ms) */
      maxDelayMs:      2000,  /* ← Maximum thinking delay (ms) */
      charMultiplier:  12,    /* ← Extra ms per character of reply */
      speedMs:         9,     /* ← Ms per character in typewriter */
      randomMs:        18,    /* ← Random variance per character */
    },

    ticker: {
      scrollSeconds: 60,  /* ← Seconds for one full ticker loop */
    },

  }, /* end settings */


}; /* ═══ end window.RORO_CONFIG ═══════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   THAT'S IT. You are done editing.
   ───────────────────────────────────────────────────────────────────────
   The engine in js/manager-roro.js reads everything above and handles
   all the logic: fuzzy matching, routing, memory, tone adaptation, etc.

   IF SOMETHING BREAKS AFTER EDITING:
   1. Check for missing commas between array items or object keys.
   2. Check for unclosed { } or [ ] brackets.
   3. Make sure strings use ' or ` — never "smart quotes" from Word/Docs.
   4. Open browser DevTools (F12) → Console tab → look for red errors.
   5. Common mistake: trailing comma after last item in faq or customIntents.

   QUICK REFERENCE — WHAT GOES WHERE:
   · Change what RoRo knows about Manomay   → Section 1 (owner)
   · Change page descriptions               → Section 2 (pages)
   · Add/edit a project                     → Section 3 (projects)
   · Update a year in the journey           → Section 4 (years)
   · Change tech stack or theme descriptions → Section 5 (design)
   · Change the password hint               → Section 6 (password)
   · Add a new site feature RoRo can explain → Section 7 (features)
   · Update social media URLs               → Section 8 (social)
   · Add a quick Q&A answer                 → Section 9 (faq)
   · Add phrases that nav to a page         → Section 10 (navigationKeywords)
   · Add phrases that switch themes         → Section 11 (themeKeywords)
   · Add phrases for music control          → Section 12 (musicKeywords)
   · Add word aliases/synonyms              → Section 13 (synonyms)
   · Add a completely new response class    → Section 14 (customIntents) ← MAIN
   · Change suggested chips per visitor type → Section 15 (visitorProfiles)
   · Change small talk responses            → Section 16 (smallTalk)
   · Change any sentence RoRo says          → Section 17 (responses)
   · Add/remove ticker banner prompts       → Section 18 (ticker)
   · Change timing/speed/memory settings   → Section 19 (settings)
═══════════════════════════════════════════════════════════════════════ */
