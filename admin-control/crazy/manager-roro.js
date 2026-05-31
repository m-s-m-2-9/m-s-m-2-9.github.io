/* ═══════════════════════════════════════════════════════════════════════
   admin-control/crazy/manager-roro.js
   ─────────────────────────────────────────────────────────────────────
   RoRo Configuration — The ONLY file you need to edit to change
   anything about how RoRo talks, what it knows, and what it shows.

   This file is loaded by js/manager-roro.js (the engine).
   The engine reads window.RORO_CONFIG and uses it for everything.

   HOW THIS FILE IS STRUCTURED:
   ─────────────────────────────────────────────────────────────────────
   SECTION 1 — OWNER INFO
     Who Manomay is. Used when someone asks "who is this guy?"

   SECTION 2 — PAGES
     Every page on the site. Summary, label, features list.
     RoRo reads this when navigating or describing a page.

   SECTION 3 — PROJECTS
     Each project with description, status, keywords.
     Keywords are what RoRo uses to figure out which project you mean.

   SECTION 4 — YEARS (Journey Timeline)
     One entry per year from 2008 to now.
     RoRo reads these when someone asks "tell me about 2024" etc.

   SECTION 5 — SITE DESIGN INFO
     Tech stack, themes, design philosophy.
     Used when someone asks how the site was built.

   SECTION 6 — PASSWORD INFO
     What's locked, how to get access.
     RoRo never reveals the actual password — just gives the hint.

   SECTION 7 — FEATURES
     Music, themes, easter eggs, cursor, sound etc.
     Used when someone asks "how does X work?"

   SECTION 8 — SOCIAL LINKS
     LinkedIn, Instagram, Email, CV download.
     These power the action buttons RoRo shows.

   SECTION 9 — FAQ ANSWERS
     Quick one-liner answers for common questions.
     Add as many as you want here.

   SECTION 10 — RESPONSE POOLS
     All the actual sentences RoRo says.
     Each pool is an array — RoRo picks one randomly each time.
     Edit these to change RoRo's personality and tone.
     {n} = gets replaced with the user's name automatically.

   SECTION 11 — PROMPT TICKER
     The scrolling banner of example prompts above the input box.
     Add/remove prompts here. Keep them short (under 50 chars ideally).

   SECTION 12 — SETTINGS
     Timing, behaviour, idle detection.
     Change these if RoRo feels too fast/slow or times out weirdly.

   ─────────────────────────────────────────────────────────────────────
   RULES FOR EDITING:
   · Never delete a section entirely — the engine expects all of them.
   · Arrays need commas between items. Last item can have a trailing comma.
   · Strings use single quotes ' or backticks ` — not curly "smart" quotes.
   · {n} in any response string = replaced with the user's name.
   · {page} in any response string = replaced with page label.
   · Don't touch the window.RORO_CONFIG = { ... } wrapper.
   ─────────────────────────────────────────────────────────────────────
   LOADED BY: js/manager-roro.js
   Last edited: 2026
═══════════════════════════════════════════════════════════════════════ */

window.RORO_CONFIG = {


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 1 — OWNER INFO
     ───────────────────────────────────────────────────────────────────
     Change anything here if personal details update.
     · name         = full name shown in responses
     · shortName    = first name only, used in casual references
     · born         = date of birth (full string)
     · birthplace   = city of birth
     · city         = current city
     · tagline      = short one-liner shown in identity responses
     · philosophy   = the quote attributed to Manomay
     · description  = 2-3 sentence bio, used in "who is he?" answers
     · traits       = personality traits shown in list form
     · inspirations = things/people that inspire him
     · workStyle    = how he approaches his work
     · goals        = long-term ambitions
     · contact      = email address
  ═══════════════════════════════════════════════════════════════════ */

  owner: {
    name:        'Manomay Shailendra Misra',
    shortName:   'Manomay',
    born:        'August 29, 2008',
    birthplace:  'India',
    city:        'Mumbai, now Bengaluru',
    tagline:     'Born 2008 · Mumbai · Making something of it all',
    philosophy:  'Building legacy without losing softness.',

    // 2-3 sentences. Used when someone asks "who is Manomay?"
    description: 'A seventeen-year-old creator, thinker, and builder from Bangluru. Nomadic by upbringing — eight cities, one consistent ambition. He designs with intention, builds from scratch, and believes the process matters as much as the output.',

    // These show up in list form when someone digs into who he is
    traits: [
      'Ambitious',
      'Detail-oriented',
      'Nomadic by upbringing',
      'Calm under pressure',
      'Deeply curious',
      'Storyteller at heart',
    ],

    // People or things that shaped his taste and thinking
    inspirations: [
      'Dieter Rams',
      'Paul Graham',
      'Japanese minimalism',
      'The craft of writing',
      'Architecture and space',
    ],

    // One sentence about how he works
    workStyle: 'Everything from scratch. No templates, no shortcuts. Each project is deliberate and considered.',

    // What he's aiming for
    goals: 'Build systems and stories that outlast trends. Contribute to something that matters before 25.',

    // Direct email
    contact: 'manomaysmisra2908@gmail.com',
  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 2 — PAGES
     ───────────────────────────────────────────────────────────────────
     Every page on the site. The key (e.g. 'home') must match the
     page ID used in navigateTo() in main.js exactly.

     · label    = display name shown to the user
     · summary  = what RoRo says when describing or navigating to this page
     · features = bullet list of things on the page (shown in info responses)

     To add a new page: copy any entry, paste it below, change the key
     and all the values. Make sure the key matches your page ID.
  ═══════════════════════════════════════════════════════════════════ */

  pages: {

    home: {
      label:   'Home',
      summary: "The entry point. Manomay's name, a tagline, and a curated navigation grid. Clean, minimal, intentional — the whole site in one scroll.",
      features: [
        'Animated hero',
        'Theme switcher (4 themes)',
        'Music player',
        'Navigation grid',
        'Easter egg (7 name clicks → vinyl record)',
      ],
    },

    about: {
      label:   'Identity',
      summary: "Manomay's identity in written form — where he came from, what shaped him, what drives him. A private layer exists behind a password.",
      features: [
        'Personal biography',
        'Private extended section',
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
        'Full-screen viewer',
      ],
    },

    resume: {
      label:   'CV / Résumé',
      summary: 'A clean formal résumé — experience, education, skills — in the same minimalist aesthetic as the site. Downloadable PDF at the bottom.',
      features: [
        'Work experience',
        'Education history',
        'Skills',
        'Downloadable PDF',
      ],
    },

    projects: {
      label:   'Projects',
      summary: 'Where the work lives — a flat list of projects each with a status label. Click any project for a full description popup. Nationals is always last.',
      features: [
        'Flat project list',
        'Status labels (Completed / Ongoing / Abandoned)',
        'Click-to-popup descriptions',
      ],
    },

    profiles: {
      label:   'Profiles',
      summary: "All of Manomay's public internet presence — LinkedIn, Instagram, and a résumé link. No clutter.",
      features: [
        'LinkedIn',
        'Instagram',
        'Résumé link',
      ],
    },

    journey: {
      label:   'Journey',
      summary: 'A year-by-year timeline from 2008 to the present. Click any year and read that chapter. Spans eight cities across India.',
      features: [
        'Interactive timeline (2008–2026)',
        'Chapter detail per year',
        'Private entries',
      ],
    },

    birthday: {
      label:   'Clock',
      summary: 'A live countdown to August 29th running to the millisecond. Birth details locked behind password. Something changes on the day itself.',
      features: [
        'Millisecond countdown',
        'Birthday: 29 August 2008',
        'Birth details (password protected)',
        'Special birthday state',
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
        'Contact form',
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
        'Password protected full list',
      ],
    },

    skills: {
      label:   'Traits',
      summary: 'Animated skill bars, a scrolling marquee of keywords, and a hobbies section. An honest map of capability and curiosity.',
      features: [
        'Animated skill bars',
        'Hobbies & interests',
        'Keyword marquee',
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
        'Brand logos marquee',
        'Testimonials',
      ],
    },

  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 3 — PROJECTS
     ───────────────────────────────────────────────────────────────────
     Each project RoRo knows about in detail.
     The key (e.g. 'nationals') is internal — doesn't need to match anything.

     · title       = project display name
     · description = what RoRo says when asked about this project
     · status      = shown as a label (free text, write whatever)
     · type        = category label e.g. "Web / Development"
     · keywords    = words that trigger this project in user messages
                     Add typos and alternate spellings here too!

     To add a new project: copy any block, paste below, edit all fields.
  ═══════════════════════════════════════════════════════════════════ */

  projects: {

    nationals: {
      title:       'Nationals',
      description: 'A competition-level initiative. Always the final entry in the projects list — the benchmark everything else is measured against.',
      status:      'Completed · 2024',
      type:        'Competition',
      // Add every word someone might type when asking about this project
      keywords:    ['nationals', 'national', 'competition', 'achievement', 'win', 'kvs', 'exhibition'],
    },

    ecommerce: {
      title:       'E-commerce Prototype',
      description: 'A full e-commerce prototype built from scratch — product listings, cart, and checkout flow. Handcrafted, no frameworks.',
      status:      'Completed · 2024',
      type:        'Web / Development',
      keywords:    ['ecommerce', 'ecom', 'shop', 'store', 'web', 'development', 'prototype', 'commerce'],
    },

    iskcon: {
      title:       'ISKCON Summer Camp',
      description: 'Creative Educator and Media Lead for a 40+ student summer programme at ISKCON Centre. Ran workshops in origami and paper engineering, produced vlogs and photography, coordinated temple excursions.',
      status:      'Completed · 2024',
      type:        'Education / Media',
      // Include alternate spellings — people type these wrong all the time
      keywords:    ['iskcon', 'iskon', 'isckon', 'hare krishna', 'krishna', 'temple', 'camp', 'summer', 'educator', 'media', 'photography', 'workshop', 'children', 'education', 'vlog'],
    },

    website: {
      title:       'MSM Personal Website',
      description: 'This website. Pure HTML, CSS, and JavaScript. Zero frameworks, zero templates. Cinematic intro, custom CMS, sidebar system, 5 mini-games, photo albums, thoughts blog, and a full AI assistant layer.',
      status:      'Ongoing · 2025–Present',
      type:        'Web / Design',
      keywords:    ['website', 'portfolio', 'personal', 'site', 'this', 'here', 'msm', 'web'],
    },

    writing: {
      title:       'Until The Bullet Woke Me',
      description: 'A creative writing project. A story, composed with deliberate craft. The title carries the weight of the content.',
      status:      'Completed · 2024',
      type:        'Creative Writing',
      keywords:    ['writing', 'story', 'bullet', 'creative', 'fiction', 'narrative', 'until the bullet'],
    },

    // ─── HOW TO ADD A NEW PROJECT ───────────────────────────────
    // Uncomment the block below and fill in your details:
    //
    // newProject: {
    //   title:       'Your Project Name',
    //   description: 'What RoRo says when someone asks about this project.',
    //   status:      'Completed · 2025',
    //   type:        'Design / Branding',
    //   keywords:    ['project name', 'keyword two', 'keyword three'],
    // },
    // ─────────────────────────────────────────────────────────────

  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 4 — YEARS (Journey Timeline)
     ───────────────────────────────────────────────────────────────────
     RoRo reads from this when someone asks "tell me about 2024" etc.
     The key must be the year as a number.

     Keep entries short — 1 to 3 sentences max.
     "Details being written." is fine as a placeholder.

     To add a year: add a new line following the same pattern.
     To update a year: just change the string value.
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
  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 5 — SITE DESIGN INFO
     ───────────────────────────────────────────────────────────────────
     What RoRo says when someone asks about the tech or design.

     · summary    = paragraph shown in "how was this built?" answers
     · philosophy = the design principle quote
     · stack      = array of tech used (shown as a list)
     · themes     = the 4 visual themes

     For themes: id must match the data-theme attribute on <html>.
     desc is what RoRo says about each theme when switching.
  ═══════════════════════════════════════════════════════════════════ */

  design: {

    // Shown when someone asks "how was this site built?" or "what's the stack?"
    summary: 'Built entirely from scratch — no templates, no frameworks. Pure HTML, CSS, and JavaScript. Four themes: Noir, Ivory, Slate, Forest. Typographic, geometric, deliberately minimal. Every animation hand-coded.',

    // The design philosophy quote
    philosophy: 'The site should feel like a conversation, not a brochure. Every element is intentional. Nothing is decorative without purpose.',

    // Tech stack list — edit freely
    stack: [
      'Vanilla HTML',
      'Vanilla CSS',
      'Vanilla JavaScript',
      'EmailJS (contact form)',
      'Web Audio API (sound)',
      'localStorage (memory)',
    ],

    // The 4 visual themes
    // id must match data-theme attribute values exactly
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

  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 6 — PASSWORD INFO
     ───────────────────────────────────────────────────────────────────
     RoRo never gives out the actual password.
     hint = what it says when someone asks about passwords.
     lockedSections = list of things that are password-protected.

     Edit this if you add or remove locked sections.
  ═══════════════════════════════════════════════════════════════════ */

  password: {

    // This is the full response when someone asks "how do I get the password?"
    hint: "It isn't publicly distributed. Best route: the Contact page — explain why you want access, and Manomay decides.",

    // List of locked areas — shown as context when someone asks what's locked
    lockedSections: [
      'Private photo albums',
      'Private journey entries',
      'Full curated lists',
      'Birth details',
      'Private games',
      'Extended identity section',
    ],

  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 7 — FEATURES
     ───────────────────────────────────────────────────────────────────
     Descriptions of specific site features.
     RoRo uses these when someone asks "how does X work?"

     Keys:
     · music   = music player
     · themes  = theme switcher
     · roro    = about RoRo itself
     · cursor  = custom cursor
     · sound   = click sound toggle
     · easter  = easter eggs
     · sidebar = desktop sidebar
  ═══════════════════════════════════════════════════════════════════ */

  features: {

    // Shown when someone asks about music or the vinyl
    music: "Built-in music player with two tracks — background ambience loops by default. The easter-egg song unlocks after clicking Manomay's name on the homepage exactly seven times. A vinyl record then appears.",

    // Shown when someone asks about themes or appearance
    themes: "Four visual themes: Noir (dark), Ivory (light), Slate (cool grey), Forest (muted green). Four dots top-right switch between them.",

    // Shown when someone asks "what is RoRo?" or "who are you?"
    roro: "That's me — RoRo. The site's intelligence layer. I know every section, can navigate for you, switch themes, control music, and answer anything about this site.",

    // Shown when someone asks about the cursor
    cursor: "Custom animated cursor — dot and ring. Hover states change the cursor. Disabled on touch devices.",

    // Shown when someone asks about the sound/click
    sound: "Mechanical click/tick sounds on interactions — toggle the push-button icon in the nav bar.",

    // Shown when someone asks about hidden stuff / easter eggs
    easter: "Seven clicks on the hero name → vinyl record appears. Hidden keyboard code: type 'manomay' anywhere → accent colour flash. Splash can be skipped with rapid clicks.",

    // Shown when someone asks about the sidebar or hamburger
    sidebar: "Desktop sidebar accessed via the hamburger icon (desktop only). Contains navigation to sidebar-only pages: Photos, Journey, Clock, Thoughts, Lists, Games.",

  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 8 — SOCIAL LINKS
     ───────────────────────────────────────────────────────────────────
     These power the action buttons RoRo shows when someone asks for
     LinkedIn, Instagram, CV download, or direct email.

     · label    = button text
     · hint     = short description shown in chat
     · url      = the actual link (use '#' if not set up yet)
     · download = true if it should trigger a file download

     LinkedIn and Instagram URLs are also read from MSM_DATA if
     available (set in admin-control/pages/profiles.js). This is
     the fallback if that system doesn't expose them.
  ═══════════════════════════════════════════════════════════════════ */

  social: {

    linkedin: {
      label: 'LinkedIn',
      hint:  'Professional profile and work history.',
      // Replace with real URL — or leave '#' and set it in profiles.js
      url:   'https://linkedin.com/in/manomay-shailendra-misra',
    },

    instagram: {
      label: 'Instagram',
      hint:  'Visual work and personal moments.',
      // Replace with real URL
      url:   'https://www.instagram.com/m_s_m_2_9/',
    },

    email: {
      label: 'Email',
      hint:  'Direct inbox.',
      url:   'mailto:manomaysmisra2908@gmail.com',
    },

    cv: {
      label:    'Download CV',
      hint:     'Full résumé as a PDF.',
      // Path relative to index.html
      url:      'manomay-cv.pdf',
      download: true,
    },

  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 9 — FAQ ANSWERS
     ───────────────────────────────────────────────────────────────────
     Quick answers for common questions.
     RoRo picks from here when it detects a matching question.

     Keys are internal labels — they don't need to match anything.
     Values are the actual response text RoRo says.

     To add a new FAQ: add a new key: 'answer text' line.
     To edit an answer: just change the string.
  ═══════════════════════════════════════════════════════════════════ */

  faq: {

    age:          'Manomay was born on August 29, 2008. Use the Clock page for a live countdown and exact age.',

    location:     'Originally from Mumbai, Maharashtra. Currently based in Bengaluru, Karnataka.',

    stack:        'Vanilla HTML, CSS, and JavaScript. No React, no Vue, no templates. Everything hand-coded.',

    contactReason:'If you\'re reaching out for the site password — explain your reason. Genuine curiosity gets a response.',

    password:     'The password isn\'t public. Contact Manomay via the Contact page and explain why you want access.',

    frameworks:   'None. This site uses zero JavaScript frameworks. Every animation, every interaction — pure vanilla JS.',

    hiring:       'Manomay is open to interesting creative and technical opportunities. The Contact page is the right channel.',

    cv:           'The CV page has the full résumé. There\'s a downloadable PDF at the bottom of that page.',

    // ─── ADD YOUR OWN FAQ ANSWERS BELOW ─────────────────────────
    // Example:
    // college:   'Currently pursuing BBA with Business Analytics at Don Bosco College, Bengaluru.',
    // ──────────────────────────────────────────────────────────────

  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 10 — RESPONSE POOLS
     ───────────────────────────────────────────────────────────────────
     These are all the actual sentences RoRo says.
     Each pool is an array. RoRo picks one at random each time.

     This is where personality lives. Edit freely.

     SPECIAL TOKENS:
     · {n}    = replaced with the user's name
     · {page} = replaced with a page label

     POOLS EXPLAINED:
     · first_hello    = very first message when panel opens
     · first_intro    = RoRo introducing itself
     · first_name_q   = asking the user their name
     · name_ack       = confirming we heard their name
     · name_followup  = what to say right after getting their name
     · name_change_ack= when user says "call me X" mid-conversation
     · return_greet   = returning user, first message
     · return_last_page= reminding them where they left off
     · return_prompt  = asking what they want to do
     · nav_confirm    = confirming we're navigating somewhere
     · theme_confirm  = confirming a theme switch (keyed by theme id)
     · theme_already  = when user tries to switch to current theme
     · music_play     = confirming music started
     · music_pause    = confirming music paused
     · thanks         = response to "thanks"
     · compliment     = response to "nice site!" etc
     · surprise       = response before sending to a random page
     · unknown        = when RoRo doesn't understand
     · unknown_clarify= asking for clarification
     · unknown_redir  = offering to go to Contact instead
     · clear_confirm  = after user confirms data deletion
     · clear_prompt   = asking user to confirm before deleting data
  ═══════════════════════════════════════════════════════════════════ */

  responses: {

    // ─── FIRST-TIME VISITOR ───────────────────────────────────────

    // Very first line when the panel opens for a new visitor
    first_hello: [
      'Hello.',
      'Hello there.',
      'Good to have you here.',
      'Hi.',
      // Add more greetings here:
      // 'Hey.',
      // 'Welcome.',
    ],

    // RoRo introducing itself
    first_intro: [
      "I'm RoRo — the intelligence layer running this site.",
      "The name's RoRo. I manage everything on this site.",
      "RoRo. I know every corner of this place.",
      "I'm RoRo — your guide through everything here.",
      // Add more:
      // "You found me. I'm RoRo.",
    ],

    // Asking the user's name before starting
    first_name_q: [
      "Before we go further — what should I call you?",
      "One thing first. What's your name?",
      "I like to know who I'm talking to. What do people call you?",
      "What should I call you?",
      // Add more:
      // "Quick — your name?",
    ],

    // ─── NAME HANDLING ────────────────────────────────────────────

    // Acknowledging the user's name. {n} = their name.
    name_ack: [
      'Nice to meet you, {n}.',
      '{n}. Good.',
      'Got it — {n}.',
      '{n}. I\'ll remember that.',
      '{n}. Noted.',
      // Add more:
      // 'Solid name, {n}.',
    ],

    // What to say right after getting their name
    name_followup: [
      "Ask me anything about this site. I know all of it.",
      "This place has more layers than it looks. I can guide you through all of it.",
      "I have full access to everything here. Where do you want to start?",
      "I'm wired to this entire site. What are you looking for?",
    ],

    // When user changes their name mid-conversation. {n} = new name.
    name_change_ack: [
      'Got it. {n} from now on.',
      'Done — I\'ll call you {n}.',
      '{n} it is. I\'ll use that going forward.',
      // oldName is passed too but optional — if you want "switching from X to Y" style:
      // Note: engine sends (oldName, newName) — {n} = newName only
    ],

    // ─── RETURNING VISITOR ────────────────────────────────────────

    // First message when someone who visited before opens the panel. {n} = name.
    return_greet: [
      'Welcome back, {n}.',
      '{n}. You\'re back.',
      'Good to see you again, {n}.',
      'Back again, {n}.',
      // Add more:
      // 'You returned, {n}.',
    ],

    // Recalling where they left off. {page} = last page label.
    return_last_page: [
      'Last time you were exploring {page}.',
      'You left off at {page} last time.',
      'You were on {page} when you last visited.',
    ],

    // Prompt after greeting returning user
    return_prompt: [
      "What would you like to explore today?",
      "Where should we go this time?",
      "What are you looking for?",
      "Anything specific you want to dive into?",
    ],

    // ─── NAVIGATION ───────────────────────────────────────────────

    // Confirming page navigation. {page} = page label.
    nav_confirm: [
      'Taking you to {page}.',
      'Opening {page}.',
      '{page}. On it.',
      'Navigating to {page}.',
      // Add more:
      // 'Going to {page} now.',
    ],

    // ─── THEME SWITCHING ──────────────────────────────────────────
    // Each key must match a theme id in SECTION 5 design.themes

    theme_confirm: {
      dark:   [
        'Switched to Noir. Deep and cinematic.',
        'Noir mode. Dark, precise.',
        'Noir. Good choice.',
      ],
      light:  [
        'Switched to Ivory. Clean and editorial.',
        'Ivory mode. Minimal and bright.',
        'Ivory. Premium aesthetic.',
      ],
      slate:  [
        'Switched to Slate. Cool and precise.',
        'Slate mode. Technical and calm.',
        'Slate. Clean.',
      ],
      forest: [
        'Switched to Forest. Muted and grounded.',
        'Forest mode. Organic, calm.',
        'Forest.',
      ],
    },

    // When they're already on the theme they asked for. {theme} = theme label.
    theme_already: [
      'Already on {theme}. Nothing changed.',
      'You\'re already in {theme} mode.',
    ],

    // ─── MUSIC ───────────────────────────────────────────────────

    music_play: [
      'Music on.',
      'Playing background ambience.',
      'Audio on.',
      'Music started.',
    ],

    music_pause: [
      'Music paused.',
      'Paused.',
      'Audio off.',
      'Stopped.',
    ],

    // ─── REACTIONS ───────────────────────────────────────────────

    // When user says thanks
    thanks: [
      'Any time.',
      'Of course.',
      "That's what I'm here for.",
      'Always.',
      'Sure thing.',
    ],

    // When user compliments the site
    compliment: [
      'The credit goes to Manomay.',
      "I just run the systems. He built everything.",
      "I'll pass that on.",
      "Noted. It's his work — I just know it well.",
      // Add more:
      // "Glad you noticed. He doesn't cut corners.",
    ],

    // Before navigating to a random surprise page
    surprise: [
      'Picking somewhere you might not have been.',
      "Let's go off-script.",
      'Random destination incoming.',
      'Choosing for you.',
    ],

    // ─── FALLBACKS (when RoRo doesn't understand) ────────────────

    // Main "I don't know this" response
    unknown: [
      "That's a bit outside my scope — I'm specifically wired to this site.",
      "I don't have that one. My knowledge is bounded to what's here.",
      "Interesting question. But I'm built for this site, not general conversation.",
      "That's beyond my access.",
    ],

    // Asking user to clarify when message is too vague
    unknown_clarify: [
      "Could you be more specific? Are you asking about a page, a project, or something about Manomay?",
      "I want to help — can you tell me more about what you're looking for?",
      "I'm not sure I followed that. Are you looking for a specific section of the site?",
    ],

    // Offering to redirect to Contact as a fallback
    unknown_redir: [
      "If you need a real answer, I can route you to the Contact page.",
      "You could always ask Manomay directly — want me to open Contact?",
      "The Contact form is the right channel for this. Want me to go there?",
    ],

    // ─── DATA CLEAR ───────────────────────────────────────────────

    // Asking user to confirm before deleting their data
    clear_prompt: [
      "I can remove everything I know about you — your name, visit history, preferences. This can't be undone.",
      "This will erase your name, viewed sections, and all stored preferences. Shall I proceed?",
    ],

    // After data is successfully cleared
    clear_confirm: [
      "Done. Everything cleared. Fresh start.",
      "All your data has been removed. You're anonymous again.",
      "Cleared. I won't remember anything about you from this point.",
    ],

  },


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 11 — PROMPT TICKER
     ───────────────────────────────────────────────────────────────────
     The scrolling banner of example prompts shown above the input box.
     Each item has:
     · text = what appears in the banner (also sent as message if clicked)
     · cat  = category label (internal only, doesn't appear anywhere)

     Tips:
     · Keep text under 50 characters for clean display
     · Click on any item in the live site → it sends that message automatically
     · Add as many as you want — they loop infinitely
     · Remove ones that feel irrelevant

     To add: paste a new { text: '...', cat: '...' }, line
     To remove: delete the whole line including the comma
  ═══════════════════════════════════════════════════════════════════ */

  ticker: [
    { text: "Who is Manomay?",                      cat: "identity"  },
    { text: "What has he built?",                   cat: "projects"  },
    { text: "Open the CV",                          cat: "nav"       },
    { text: "What skills does Manomay have?",       cat: "traits"    },
    { text: "Switch to ivory theme",                cat: "theme"     },
    { text: "Show me the photography",              cat: "nav"       },
    { text: "Download the résumé PDF",              cat: "cv"        },
    { text: "Tell me about the ISKCON project",     cat: "projects"  },
    { text: "Show me LinkedIn",                     cat: "social"    },
    { text: "Tell me about 2024",                   cat: "journey"   },
    { text: "Play background music",                cat: "music"     },
    { text: "How do I get the password?",           cat: "password"  },
    { text: "What games are built into this site?", cat: "games"     },
    { text: "Tell me about the Nationals project",  cat: "projects"  },
    { text: "Open the Thoughts section",            cat: "nav"       },
    { text: "What's Manomay's philosophy?",         cat: "identity"  },
    { text: "Show me the timeline",                 cat: "journey"   },
    { text: "Switch to dark mode",                  cat: "theme"     },
    { text: "Who should I contact?",                cat: "contact"   },
    { text: "Surprise me",                          cat: "explore"   },
    { text: "How was this site built?",             cat: "site"      },
    { text: "What books does Manomay recommend?",   cat: "lists"     },
    { text: "Tell me about the easter eggs",        cat: "explore"   },
    { text: "Show me the social profiles",          cat: "nav"       },
    // ─── ADD NEW TICKER PROMPTS BELOW ───────────────────────────
    // { text: "Your prompt here",                  cat: "category"  },
    // ────────────────────────────────────────────────────────────
  ],


  /* ═══════════════════════════════════════════════════════════════════
     SECTION 12 — SETTINGS
     ───────────────────────────────────────────────────────────────────
     Behavioural settings. Edit if RoRo feels too fast, too slow,
     times out too early, or the typing animation feels off.

     · memory.expiryDays    = how many days before saved user data expires
     · idle.idleMinutes     = minutes before status changes to "Idle"
     · idle.offlineMinutes  = minutes before status changes to "Offline"
     · idle.checkEveryMs    = how often to check idle state (in ms)
     · typing.minDelay      = minimum delay before a reply appears (ms)
     · typing.maxDelay      = maximum delay before a reply appears (ms)
     · typing.charMultiplier= adds extra ms per character in message
     · typing.speedMs       = ms per character in the typewriter effect
     · typing.randomMs      = random extra ms added per character (variation)
     · ticker.scrollSeconds = how long one full ticker loop takes (seconds)
                              Higher = scrolls slower. Lower = scrolls faster.
  ═══════════════════════════════════════════════════════════════════ */

  settings: {

    memory: {
      // Days before localStorage user data expires and gets reset
      expiryDays: 90,
    },

    idle: {
      // Minutes of no activity before status dot changes to "Idle"
      idleMinutes:    3,
      // Minutes of no activity before status dot changes to "Offline"
      offlineMinutes: 6,
      // How often the idle checker runs (every N milliseconds)
      checkEveryMs:   20000,
    },

    typing: {
      // Min ms before bot reply starts appearing (simulates thinking)
      minDelay:        380,
      // Max ms for short messages (cap so it never feels too slow)
      maxDelayMs:      2000,
      // Extra ms added per character in the message (longer msg = longer wait)
      charMultiplier:  12,
      // Ms per character in the typewriter animation
      speedMs:         9,
      // Random extra ms per character (makes typing feel more natural)
      randomMs:        18,
    },

    ticker: {
      // Seconds for one full loop of the prompt ticker
      // 60 = slow and readable, 30 = fast, 90 = very slow
      scrollSeconds: 60,
    },

  },


}; /* end window.RORO_CONFIG */


/* ═══════════════════════════════════════════════════════════════════
   THAT'S IT. You're done editing.
   ───────────────────────────────────────────────────────────────────
   The engine in js/manager-roro.js reads everything above and
   handles all the logic, UI, fuzzy matching, memory, etc.

   If something breaks after editing:
   1. Check for missing commas between array items
   2. Check for unclosed { } brackets
   3. Make sure strings use ' or ` not curly "smart quotes"
   4. Open browser DevTools → Console and look for red errors
═══════════════════════════════════════════════════════════════════ */
