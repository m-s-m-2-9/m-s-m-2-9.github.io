/* ═══════════════════════════════════════════════════════════════════
   js/bot/roro-intelligence.js  —  RoRo Intelligence Layer v4.0
   ─────────────────────────────────────────────────────────────────
   Loaded AFTER: roro-safety.js, roro-web.js
   Loaded BEFORE: manager-roro.js

   Systems inside this file:
   ────────────────────────────────────────────────────────────────
   KnowledgeBuilder   Reads ALL window.ADMIN_* + DOM + visible text
                      Auto-rebuilds when new pages/content added.
                      This is the self-updating engine.

   TypoCorrector      Fixes misspellings + translates Hinglish

   EntityExtractor    Identifies what the message is about

   Classifier         Confidence-scored intent detection.
                      Kills false matches like "what" → WhatsApp.

   ProfileDetector    Detects: recruiter/student/friend/parent/
                      explorer/tester/casual. Adapts tone + length.

   EmotionDetector    Detects emotional state from text context.
                      Adapts response warmth accordingly.

   LengthSelector     Picks short/mid/high/para based on question
                      and explicit user requests.

   WebsiteSearch      Full-text scored retrieval across all KB data.
                      Confidence threshold prevents false triggers.

   RecruiterEngine    Handles professional/hiring/skill questions.

   CasualEngine       Small talk, food, AI-nature questions, jokes.

   GeneralKnowledge   Inline facts — zero network for known topics.

   SessionMemory      Last 10 messages, pronoun resolution,
                      anti-loop tracking, analytics.

   Exports: window.RoRoIntelligence
   ─────────────────────────────────────────────────────────────────
   NO UI CHANGES. NO VISUAL CHANGES. PURE ENGINE.
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════
     KNOWLEDGE BUILDER
     The self-updating engine. Runs once per session.
     Reads from:
       1. window.RORO_CONFIG (admin bot config)
       2. window.ADMIN_* objects (all admin-control files)
       3. DOM scan — all [id^="page-"] sections
       4. Visible text content from each page section
       5. Rendered list/grid content (movies, books, series etc.)
     Returns a unified KB object the rest of the system uses.
  ════════════════════════════════════════════════════════════════ */

  const KnowledgeBuilder = {
    _kb:    null,
    _built: false,

    build() {
      if (this._built && this._kb) return this._kb;

      const kb = {
        owner:    {},
        pages:    {},
        projects: {},
        years:    {},
        design:   {},
        password: {},
        features: {},
        social:   {},
        faq:      {},
        lists:    { series: [], books: [], movies: [], places: [] },
        cv:       {},
        journey:  [],
        thoughts: [],
        games:    { public: [], private: [] },
        domPages: [],   /* pages found via DOM scan */
        rawText:  {},   /* page-id → visible text */
      };

      /* ── 1. Read RORO_CONFIG ───────────────────────────────── */
      const C = window.RORO_CONFIG || {};
      if (C.owner)    Object.assign(kb.owner,    C.owner);
      if (C.pages)    Object.assign(kb.pages,    C.pages);
      if (C.projects) Object.assign(kb.projects, C.projects);
      if (C.years)    Object.assign(kb.years,    C.years);
      if (C.design)   Object.assign(kb.design,   C.design);
      if (C.password) Object.assign(kb.password, C.password);
      if (C.features) Object.assign(kb.features, C.features);
      if (C.social)   Object.assign(kb.social,   C.social);
      if (C.faq)      Object.assign(kb.faq,      C.faq);

      /* ── 2. Read ADMIN_* objects ──────────────────────────── */

      /* ADMIN_CV */
      const ACV = window.ADMIN_CV || {};
      if (ACV.name)       kb.cv.name       = ACV.name;
      if (ACV.title)      kb.cv.title      = ACV.title;
      if (ACV.summary)    kb.cv.summary    = ACV.summary;
      if (ACV.experience) kb.cv.experience = ACV.experience;
      if (ACV.education)  kb.cv.education  = ACV.education;
      if (ACV.skills)     kb.cv.skills     = ACV.skills;
      if (ACV.pdfPath)    kb.cv.pdfPath    = ACV.pdfPath;
      if (ACV.contact)    kb.cv.contact    = ACV.contact;

      /* ADMIN_IDENTITY */
      const AID = window.ADMIN_IDENTITY || {};
      if (AID.introQuote) kb.owner.philosophy  = AID.introQuote.replace(/['"]/g, '');
      if (AID.bodyText)   kb.owner.fullBio     = AID.bodyText;
      if (AID.photoCaption) kb.owner.photoCaption = AID.photoCaption;

      /* ADMIN_HOME */
      const AH = window.ADMIN_HOME || {};
      if (AH.tagline)  kb.owner.tagline  = AH.tagline;
      if (AH.heroName) {
        const n = AH.heroName;
        kb.owner.name = [n.word1, n.word2, n.word3].filter(Boolean).join(' ');
      }

      /* ADMIN_CLOCK */
      const ACL = window.ADMIN_CLOCK || {};
      if (ACL.birthdayDate) kb.owner.birthdayDate = ACL.birthdayDate;
      if (ACL.birthYear)    kb.owner.birthYear    = ACL.birthYear;
      if (ACL.birthTime)    kb.owner._lockedTime  = true; /* flag — never reveal */
      if (ACL.birthPlace)   kb.owner._lockedPlace = true; /* flag — never reveal exact */

      /* Compute current age from birth year */
      if (ACL.birthYear && ACL.birthdayDate) {
        try {
          const parts   = ACL.birthdayDate.split(' ');
          const month   = new Date(parts[0] + ' 1').getMonth();
          const day     = parseInt(parts[1]);
          const now     = new Date();
          let   age     = now.getFullYear() - ACL.birthYear;
          if (now < new Date(now.getFullYear(), month, day)) age--;
          kb.owner.age = age;
        } catch {}
      }

      /* ADMIN_PROFILES */
      const APR = window.ADMIN_PROFILES || {};
      if (APR.links && Array.isArray(APR.links)) {
        APR.links.forEach(link => {
          if (link.id && link.url) {
            kb.social[link.id] = {
              label:  link.label  || link.id,
              handle: link.handle || '',
              url:    link.url,
            };
          }
        });
      }

      /* ADMIN_PROJECTS */
      const APRJ = window.ADMIN_PROJECTS || {};
      if (APRJ.projects && Array.isArray(APRJ.projects)) {
        APRJ.projects.forEach((p, i) => {
          const key = (p.title || 'project_' + i)
            .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
          kb.projects[key] = {
            title:       p.title       || '',
            description: p.description || p.desc || '',
            status:      p.label       || p.status || '',
            type:        p.meta        || p.type   || '',
            keywords:    (p.keywords   || [p.title || '']).map(k => k.toLowerCase()),
          };
        });
      }

      /* ADMIN_LISTS */
      const ALI = window.ADMIN_LISTS || {};
      if (ALI.series)  kb.lists.series  = ALI.series  || [];
      if (ALI.books)   kb.lists.books   = ALI.books   || [];
      if (ALI.movies)  kb.lists.movies  = ALI.movies  || [];
      if (ALI.places)  kb.lists.places  = ALI.places  || [];

      /* ADMIN_JOURNEY */
      const AJR = window.ADMIN_JOURNEY || {};
      if (AJR.years && Array.isArray(AJR.years)) {
        AJR.years.forEach(y => {
          if (y.year && y.body) {
            kb.years[y.year] = (y.title ? y.title + ' — ' : '') + y.body;
          } else if (y.year && y.title) {
            kb.years[y.year] = y.title;
          }
        });
      }

      /* ADMIN_THOUGHTS */
      const ATH = window.ADMIN_THOUGHTS || {};
      if (ATH.categories && Array.isArray(ATH.categories)) {
        kb.thoughts = ATH.categories;
      }

      /* ADMIN_GAMES */
      const AG = window.ADMIN_GAMES || {};
      if (AG.publicGames)  kb.games.public  = AG.publicGames  || [];
      if (AG.privateGames) kb.games.private = AG.privateGames || [];

      /* ADMIN_SOCIAL */
      const ASO = window.ADMIN_SOCIAL || {};
      if (ASO.logos)        kb.socialProof = { logos: ASO.logos || [], testimonials: ASO.testimonials || [] };
      if (ASO.testimonials) kb.testimonials = ASO.testimonials;

      /* ADMIN_IMAGES */
      const AIM = window.ADMIN_IMAGES || {};
      if (AIM.publicAlbums)  kb.photos = { public: AIM.publicAlbums || [], private: AIM.privateAlbums || [] };

      /* ADMIN_CONTACT */
      const ACO = window.ADMIN_CONTACT || {};
      if (ACO.introText)  kb.contact = { intro: ACO.introText };

      /* ADMIN_TRAITS */
      const ATR = window.ADMIN_TRAITS || {};
      if (ATR.skills)       kb.skills  = ATR.skills       || [];
      if (ATR.hobbies)      kb.hobbies = ATR.hobbies       || [];
      if (ATR.marqueeItems) kb.marquee = ATR.marqueeItems  || [];

      /* ── 3. DOM SCAN — discover all pages ────────────────── */
      const pageSections = document.querySelectorAll('[id^="page-"]');
      pageSections.forEach(section => {
        const pageId = section.id.replace('page-', '');
        if (!kb.domPages.includes(pageId)) {
          kb.domPages.push(pageId);
        }
        /* Auto-register in pages if not already there */
        if (!kb.pages[pageId]) {
          /* Try to infer label from section heading */
          const heading = section.querySelector('h1, h2, .section-title, .section-label');
          kb.pages[pageId] = {
            label:    heading ? heading.textContent.trim() : pageId,
            summary:  '',
            features: [],
            autoDetected: true,
          };
        }
      });

      /* ── 4. READ VISIBLE TEXT from each page section ─────── */
      pageSections.forEach(section => {
        const pageId = section.id.replace('page-', '');
        /* Collect all visible text, skip script/style/locked */
        const walker = document.createTreeWalker(
          section,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName.toLowerCase();
              if (['script', 'style', 'noscript'].includes(tag))
                return NodeFilter.FILTER_REJECT;
              /* Skip password gate content */
              if (parent.closest('.password-gate') || parent.closest('.gate-input-wrap'))
                return NodeFilter.FILTER_REJECT;
              const text = node.textContent.trim();
              if (text.length < 2) return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_ACCEPT;
            },
          }
        );

        const texts = [];
        let node;
        while ((node = walker.nextNode())) {
          const t = node.textContent.trim();
          if (t) texts.push(t);
        }

        kb.rawText[pageId] = texts.join(' ').replace(/\s+/g, ' ').trim();
      });

      /* ── 5. MERGE social from ADMIN_IMAGES hero photo ─────── */
      if (AIM.hero) kb.owner.heroPic = AIM.hero;

      this._kb    = kb;
      this._built = true;

      return kb;
    },

    /* Force rebuild (call if dynamic content was added) */
    rebuild() {
      this._built = false;
      return this.build();
    },

    /* Get readable summary for AI system prompt */
    buildSystemContext() {
      const kb = this.build();
      const C  = window.RORO_CONFIG || {};
      const lines = [];

      lines.push('=== OWNER ===');
      const o = kb.owner;
      lines.push(`Name: ${o.name || 'Manomay Shailendra Misra'}`);
      if (o.age)          lines.push(`Age: ${o.age} years old`);
      if (o.birthdayDate) lines.push(`Birthday: ${o.birthdayDate}`);
      if (o.city)         lines.push(`City: ${o.city}`);
      if (o.tagline)      lines.push(`Tagline: ${o.tagline}`);
      if (o.philosophy)   lines.push(`Philosophy: ${o.philosophy}`);
      if (o.description)  lines.push(`Bio: ${o.description}`);
      if (o.fullBio)      lines.push(`Full bio: ${o.fullBio.slice(0, 400)}`);
      if (o.contact)      lines.push(`Email: ${o.contact}`);

      /* CV info */
      if (kb.cv.summary)    lines.push(`CV Summary: ${kb.cv.summary}`);
      if (kb.cv.skills && kb.cv.skills.length)
        lines.push(`Skills: ${kb.cv.skills.join(', ')}`);
      if (kb.cv.experience && kb.cv.experience.length) {
        lines.push('Experience:');
        kb.cv.experience.forEach(e => {
          lines.push(`  - ${e.title} at ${e.org} (${e.date})`);
        });
      }
      if (kb.cv.education && kb.cv.education.length) {
        lines.push('Education:');
        kb.cv.education.forEach(e => {
          lines.push(`  - ${e.title}, ${e.org} (${e.date})`);
        });
      }

      /* Traits */
      if (kb.skills && kb.skills.length) {
        const skillNames = kb.skills.map(s => `${s.name} (${s.percent}%)`).join(', ');
        lines.push(`Skill bars: ${skillNames}`);
      }
      if (kb.hobbies && kb.hobbies.length) {
        const cleaned = kb.hobbies.map(h => h.replace(/&nbsp;|<[^>]+>/g, '').trim());
        lines.push(`Hobbies: ${cleaned.join(', ')}`);
      }

      /* Projects */
      lines.push('\n=== PROJECTS ===');
      Object.values(kb.projects).forEach(p => {
        if (p.title) {
          lines.push(`Project: ${p.title} (${p.type || ''}) — Status: ${p.status || ''}`);
          if (p.description) lines.push(`  ${p.description.slice(0, 200)}`);
        }
      });

      /* Pages */
      lines.push('\n=== WEBSITE PAGES ===');
      Object.entries(kb.pages).forEach(([id, pg]) => {
        lines.push(`Page "${id}" — ${pg.label}: ${pg.summary || '(no summary)'}`);
      });

      /* Social profiles */
      lines.push('\n=== SOCIAL PROFILES ===');
      Object.entries(kb.social).forEach(([id, s]) => {
        if (s.url && s.url !== '#') {
          lines.push(`${s.label || id}: ${s.url}${s.handle ? ' (' + s.handle + ')' : ''}`);
        }
      });

      /* Lists */
      if (kb.lists.books && kb.lists.books.length) {
        const read = kb.lists.books.filter(b => b.status === 'seen').map(b => b.title);
        const want = kb.lists.books.filter(b => b.status === 'want').map(b => b.title);
        if (read.length) lines.push(`Books read: ${read.slice(0, 10).join(', ')}`);
        if (want.length) lines.push(`Books want to read: ${want.slice(0, 5).join(', ')}`);
      }
      if (kb.lists.movies && kb.lists.movies.length) {
        const watched = kb.lists.movies.filter(m => m.status === 'seen').map(m => m.title);
        lines.push(`Movies watched: ${watched.slice(0, 10).join(', ')}`);
      }
      if (kb.lists.series && kb.lists.series.length) {
        const watched = kb.lists.series.filter(s => s.status === 'seen').map(s => s.title);
        lines.push(`Series watched: ${watched.slice(0, 8).join(', ')}`);
      }
      if (kb.lists.places && kb.lists.places.length) {
        const visited = kb.lists.places.filter(p => p.status === 'seen').map(p => p.title);
        const bucket  = kb.lists.places.filter(p => p.status === 'want').map(p => p.title);
        if (visited.length) lines.push(`Places visited: ${visited.join(', ')}`);
        if (bucket.length)  lines.push(`Bucket list: ${bucket.join(', ')}`);
      }

      /* Years */
      lines.push('\n=== JOURNEY TIMELINE ===');
      const sortedYears = Object.entries(kb.years).sort((a, b) => a[0] - b[0]);
      sortedYears.forEach(([yr, txt]) => {
        if (txt && !txt.includes('being written')) {
          lines.push(`${yr}: ${txt.slice(0, 120)}`);
        }
      });

      /* Games */
      if (kb.games.public && kb.games.public.length) {
        lines.push(`\nPublic games: ${kb.games.public.map(g => g.name).join(', ')}`);
      }

      /* Thoughts categories */
      if (kb.thoughts && kb.thoughts.length) {
        lines.push(`\nThoughts categories: ${kb.thoughts.map(t => t.title).join(', ')}`);
      }

      /* Raw page text (abbreviated) */
      lines.push('\n=== PAGE CONTENT SNIPPETS ===');
      Object.entries(kb.rawText).forEach(([pageId, text]) => {
        if (text && text.length > 50) {
          lines.push(`${pageId}: ${text.slice(0, 200)}`);
        }
      });

      /* Design info */
      const d = kb.design || {};
      if (d.stack && d.stack.length) lines.push(`\nTech stack: ${d.stack.join(', ')}`);
      if (d.themes) {
        const themeNames = Object.values(d.themes).map(t => t.label).join(', ');
        lines.push(`Themes: ${themeNames}`);
      }

      /* Password/locked info */
      lines.push('\n=== LOCKED CONTENT (do NOT reveal) ===');
      lines.push('Birth time: LOCKED — never reveal to users');
      lines.push('Exact birthplace: LOCKED — say only India/Maharashtra');
      lines.push('Private photos, journey entries, full lists: LOCKED');
      lines.push('Site password: LOCKED — never reveal under any circumstances');

      /* Custom AI prompt from admin */
      if (C.aiSystemPromptExtra) {
        lines.push('\n=== ADDITIONAL CONTEXT FROM ADMIN ===');
        lines.push(C.aiSystemPromptExtra);
      }

      return lines.join('\n');
    },
  };

  /* ════════════════════════════════════════════════════════════════
     TYPO CORRECTOR + HINGLISH TRANSLATOR
  ════════════════════════════════════════════════════════════════ */

  const TypoCorrector = {
    TYPOS: {
      'manomya':'manomay','manomai':'manomay','manomaay':'manomay','manomayy':'manomay',
      'maomay':'manomay','mnaomay':'manomay','monmay':'manomay','manoamay':'manomay',
      'portfolia':'portfolio','portfollio':'portfolio','portfoio':'portfolio',
      'projcts':'projects','projecrt':'projects','pojects':'projects','projets':'projects',
      'websit':'website','webiste':'website','websitee':'website','webite':'website',
      'phoot':'photo','photoo':'photo','phooto':'photo','potho':'photo',
      'achievemnts':'achievements','achievments':'achievements','achivements':'achievements',
      'expereince':'experience','experince':'experience','experiece':'experience',
      'educaton':'education','eductaion':'education',
      'skillss':'skills','skils':'skills','skiils':'skills',
      'intrenship':'internship','intenship':'internship','internhsip':'internship',
      'linekdin':'linkedin','linkdin':'linkedin','linkedni':'linkedin',
      'insatgram':'instagram','isntagram':'instagram','instagarm':'instagram',
      'gihub':'github','githb':'github',
      'pyhton':'python','pytohn':'python','phyton':'python',
      'javascrpit':'javascript','javasript':'javascript','javscript':'javascript',
      'naem':'name','nmae':'name','contcat':'contact','cnotact':'contact',
      'proejct':'project','prject':'project',
      'waht':'what','whta':'what','hwo':'how','woh':'who',
      'teh':'the','adn':'and','hav':'have','wnat':'want','jsut':'just',
      'thier':'their','taht':'that','realy':'really','defently':'definitely',
      'becuase':'because','untill':'until','alot':'a lot',
    },

    HINGLISH: {
      'manomay kaun hai':            'who is manomay',
      'manomay kya karta hai':       'what does manomay do',
      'ye website kya hai':          'what is this website',
      'ye website kisne banayi':     'who built this website',
      'kya vo python janta hai':     'does he know python',
      'uski age kya hai':            'what is his age',
      'uska kaam kya hai':           'what is his work',
      'projects dikhao':             'show me projects',
      'cv dikhao':                   'show me cv',
      'kahan rehta hai':             'where does he live',
      'kahan se hai':                'where is he from',
      'kitne saal ka hai':           'how old is he',
      'kya kaam kiya':               'what work has he done',
      'wo kya karta hai':            'what does he do',
      'kya sikha hai':               'what has he learned',
      'koi project hai':             'does he have projects',
      'python aata hai':             'does he know python',
      'javascript aata hai':         'does he know javascript',
      'coding aata hai':             'does he know coding',
      'college kahan hai':           'where does he study',
      'kaun se college mein hai':    'which college does he attend',
      'kya padh raha hai':           'what is he studying',
      'kya internship karega':       'will he intern',
      'hire kar sakte hain':         'can we hire him',
      'social media links dikhao':   'show social media',
      'instagram kya hai uska':      'what is his instagram',
      'linkedin dikhao':             'show linkedin',
      'contact kaise karein':        'how to contact',
      'password kaise milega':       'how to get password',
      'games khelo':                 'open games',
      'music chalao':                'play music',
      'dark mode karo':              'switch to dark mode',
      'light mode karo':             'switch to light mode',
    },

    correct(text) {
      if (!text) return text;
      let lower = text.toLowerCase().trim();

      /* Hinglish full-phrase match */
      for (const [phrase, rep] of Object.entries(this.HINGLISH)) {
        if (lower.includes(phrase)) lower = lower.replace(phrase, rep);
      }

      /* Word-by-word typo fix */
      const words = lower.split(/\s+/);
      return words.map(w => this.TYPOS[w] || w).join(' ');
    },
  };

  /* ════════════════════════════════════════════════════════════════
     ENTITY EXTRACTOR
  ════════════════════════════════════════════════════════════════ */

  const EntityExtractor = {
    WEBSITE_ENTITIES: new Set([
      'manomay','msm','portfolio','iskcon','iskon','nationals','ecommerce',
      'roro','website','site','projects','skills','traits','journey','timeline',
      'birthday','clock','countdown','thoughts','beliefs','contact','lists',
      'games','snake','2048','memory match','word scramble','photos','albums',
      'cv','resume','profiles','instagram','linkedin','github','facebook',
      'twitter','identity','about','themes','noir','ivory','slate','forest',
      'easter egg','vinyl','music','sidebar','cursor','password','locked',
      'private','bengaluru','mumbai','don bosco','bba','college',
    ]),

    EXTERNAL_ENTITIES: new Set([
      'ferrari','bmw','mercedes','tesla','apple','google','microsoft','amazon',
      'meta','netflix','nasa','openai','chatgpt','elon musk','steve jobs',
      'bill gates','jeff bezos','mark zuckerberg','india','pakistan','china',
      'usa','america','england','britain','france','germany','japan','australia',
      'blockchain','nft','crypto','bitcoin','ethereum','machine learning',
      'artificial intelligence','quantum','physics','chemistry','biology',
    ]),

    extract(text) {
      const lower = text.toLowerCase();
      const found = { website: [], external: [] };

      for (const e of this.WEBSITE_ENTITIES) {
        if (lower.includes(e)) found.website.push(e);
      }
      for (const e of this.EXTERNAL_ENTITIES) {
        if (lower.includes(e)) found.external.push(e);
      }

      return found;
    },

    isWebsiteQuestion(entities) {
      return entities.website.length > 0;
    },

    isExternalOnly(entities) {
      return entities.external.length > 0 && entities.website.length === 0;
    },
  };

  /* ════════════════════════════════════════════════════════════════
     CLASSIFIER
     Confidence-based. Prevents false positives.
     "what" alone does NOT trigger anything specific.
  ════════════════════════════════════════════════════════════════ */

  const Classifier = {

    /* Minimum confidence to count as a valid classified result */
    MIN_CONFIDENCE: 0.55,

    PATTERNS: {
      JOKE: [
        { p: /\b(tell\s+(?:me\s+)?a?\s*joke|got\s+(?:any\s+)?jokes?|make\s+me\s+laugh|funny\s+(?:joke|story)|crack\s+a\s+joke|be\s+funny)\b/i, w: 0.95 },
        { p: /\bjoke\s*(?:please|bro|yaar|dude)?$/i, w: 0.9 },
      ],
      GREETING: [
        { p: /^(?:hi+|hello+|hey+|sup|yo+|howdy|hola|greetings|good\s+(?:morning|afternoon|evening|night|day)|what'?s\s+up|wassup|namaste|namaskar|kem\s+cho|sat\s+sri\s+akal|vanakkam|salam|kaise\s+ho|jai\s+hind|assalamu|kasa\s+kay)[!\s?.,]*$/i, w: 0.95 },
      ],
      MATH: [
        { p: /^[\d\s\+\-\*\/\.\(\)%\^]+[\=\?]?\s*$/, w: 0.98 },
        { p: /\b(?:what\s+is|calculate|compute|how\s+much\s+is|solve)\s+[\d\s\+\-\*\/\.\(\)^%]+/i, w: 0.9 },
      ],
      CASUAL_CHAT: [
        { p: /\b(?:how\s+are\s+you|how\s+is\s+roro|are\s+you\s+ok|what\s+are\s+you\s+doing|tell\s+me\s+about\s+yourself)\b/i, w: 0.9 },
        { p: /\b(?:do\s+you\s+(?:like|eat|enjoy|have|watch|play|drink|prefer)|have\s+you\s+(?:eaten|tried|watched|played))\b/i, w: 0.88 },
        { p: /\b(?:pizza|burger|sushi|pasta|biryani|curry|coffee|tea|ramen|sandwich|dosa|chai|naan|food|dinner|lunch|breakfast)\b/i, w: 0.85 },
        { p: /\b(?:favourite|favorite|what(?:'?s|\s+is)\s+your\s+(?:favourite|favorite|opinion|take))\b/i, w: 0.8 },
        { p: /\b(?:i\s+(?:love|hate|miss|feel|think|want|need|am\s+(?:bored|tired|happy|sad|angry|excited)))\b/i, w: 0.75 },
        { p: /\b(?:are\s+you\s+(?:busy|free|an\s+ai|a\s+bot|real)|do\s+you\s+sleep|do\s+you\s+dream|can\s+you\s+feel)\b/i, w: 0.88 },
      ],
      BOOK_QUERY: [
        { p: /\b(?:book(?:s)?|novel|author|wrote|written\s+by|published|reading|bestseller|fiction|non.?fiction)\b/i, w: 0.82 },
      ],
      EMOTIONAL: [
        { p: /\b(?:i(?:'m|\s+am)\s+(?:so\s+)?(?:sad|depressed|upset|crying|heartbroken|lonely|hopeless|devastated|miserable|empty|anxious|stressed|worried|overwhelmed|exhausted|lost|broken))\b/i, w: 0.92 },
        { p: /\b(?:i\s+(?:feel|felt)\s+(?:so\s+)?(?:bad|terrible|awful|worthless|useless|numb|hopeless|empty|broken|meaningless))\b/i, w: 0.9 },
        { p: /\b(?:i\s+had\s+a\s+(?:really\s+)?(?:bad|terrible|awful|horrible|rough)\s+(?:day|week|time|night))\b/i, w: 0.88 },
        { p: /\b(?:no\s+one\s+(?:cares|understands|loves\s+me)|everyone\s+(?:hates|ignores)\s+me)\b/i, w: 0.9 },
      ],
      RECRUITER_QUESTION: [
        { p: /\b(?:does\s+he\s+know|can\s+he\s+(?:use|do|code|write|build|handle|work\s+with)|is\s+he\s+(?:good\s+at|experienced|familiar\s+with))\b/i, w: 0.92 },
        { p: /\b(?:hire|hiring|recruit|internship|intern|full.?time|part.?time|job\s+opportunity|position|role|salary|package|available\s+for|looking\s+to\s+hire)\b/i, w: 0.9 },
        { p: /\b(?:remote\s*(?:work)?|relocat|wfh|work\s+from\s+home)\b/i, w: 0.85 },
        { p: /\b(?:what\s+(?:technologies|skills|languages|tools|frameworks)\s+(?:does\s+he|can\s+he|he\s+know))\b/i, w: 0.93 },
        { p: /\b(?:leadership|led\s+(?:a\s+)?team|managed|project\s+lead|what\s+makes\s+him\s+(?:different|stand\s+out|unique|special))\b/i, w: 0.88 },
        { p: /\b(?:python|sql|react|node\.?js|django|flask|mongodb|postgresql|aws|docker|kubernetes|java\b|php\b|ruby\b|golang|swift\b|kotlin\b|typescript|angular|vue)\b/i, w: 0.87 },
      ],
      WEBSITE_QUESTION: [
        { p: /\b(?:manomay|this\s+(?:website|site|page|portfolio)|the\s+website|this\s+portfolio|your\s+(?:site|website))\b/i, w: 0.93 },
        { p: /\b(?:project|journey|skills?|traits|games?|photos?|albums?|thoughts?|beliefs?|contact|lists?|profiles?|cv|resume)\b/i, w: 0.87 },
        { p: /\b(?:theme|dark\s+mode|ivory|noir|slate|forest|music|easter\s+egg|vinyl|cursor|sidebar|roro|parallax|reel)\b/i, w: 0.9 },
        { p: /\b(?:born|birthday|age|nationality|bengaluru|mumbai|nomadic|college|education|school|studying|don\s+bosco|bba)\b/i, w: 0.88 },
        { p: /\b(?:built|made|stack|technology|vanilla\s+js|html|css|javascript|gsap|emailjs)\b/i, w: 0.85 },
        { p: /\b(?:snake\s+game|memory\s+game|word\s+scramble|reaction\s+time|2048)\b/i, w: 0.92 },
        { p: /\b(?:iskcon|nationals|ecommerce|until\s+the\s+bullet|writing\s+project)\b/i, w: 0.95 },
        { p: /\b(?:password|locked|private|access|unlock|how\s+(?:do\s+i|to)\s+(?:get|find|access|open|view))\b/i, w: 0.88 },
        { p: /\b(?:instagram|linkedin|github|facebook|twitter)\s*(?:of|page|profile|link|handle)?\s*(?:manomay|his|him)?\b/i, w: 0.9 },
      ],
      GENERAL_KNOWLEDGE: [
        { p: /\b(?:ferrari|bmw|mercedes|tesla|lamborghini|porsche|audi)\b/i, w: 0.95 },
        { p: /\b(?:elon\s+musk|steve\s+jobs|mark\s+zuckerberg|bill\s+gates|jeff\s+bezos|sundar\s+pichai)\b/i, w: 0.95 },
        { p: /\b(?:history\s+of|what\s+is\s+(?:a\s+)?(?:blockchain|ai|machine\s+learning|crypto|nft|quantum))\b/i, w: 0.88 },
        { p: /\b(?:capital\s+of|country|nation|population\s+of|how\s+many\s+people)\b/i, w: 0.82 },
        { p: /\b(?:what\s+is\s+(?:a\s+)?(?:donkey|horse|cat|dog|lion|elephant|tree|cloud|rain|sun|moon|planet|star))\b/i, w: 0.9 },
        { p: /\b(?:explain|define|definition\s+of|meaning\s+of|what\s+does\s+\w+\s+mean)\b/i, w: 0.72 },
      ],
    },

    classify(rawText) {
      const corrected = TypoCorrector.correct(rawText);
      const entities  = EntityExtractor.extract(corrected);

      /* External-only → always GENERAL_KNOWLEDGE */
      if (EntityExtractor.isExternalOnly(entities)) {
        return { type: 'GENERAL_KNOWLEDGE', confidence: 0.92, corrected, entities };
      }

      /* Score each category */
      let best = { type: 'UNKNOWN', confidence: 0.2 };

      for (const [cat, patterns] of Object.entries(this.PATTERNS)) {
        for (const { p, w } of patterns) {
          if (p.test(corrected)) {
            if (w > best.confidence) {
              best = { type: cat, confidence: w, corrected, entities };
            }
          }
        }
      }

      /* Website entity present → boost WEBSITE_QUESTION */
      if (EntityExtractor.isWebsiteQuestion(entities) && best.type === 'UNKNOWN') {
        best = { type: 'WEBSITE_QUESTION', confidence: 0.72, corrected, entities };
      }

      /* Short unknown → might be website */
      if (best.type === 'UNKNOWN' && corrected.trim().split(/\s+/).length <= 3) {
        best.type = 'SHORT_QUERY';
        best.confidence = 0.4;
      }

      best.corrected = corrected;
      best.entities  = entities;
      return best;
    },
  };

  /* ════════════════════════════════════════════════════════════════
     PROFILE DETECTOR
     Detects visitor type from conversation patterns.
     Affects tone, response length defaults, chip suggestions.
  ════════════════════════════════════════════════════════════════ */

  const ProfileDetector = {
    _profile:    'explorer',
    _confidence: 0,
    _scores:     {},

    SIGNALS: {
      recruiter: {
        w: 3,
        patterns: [
          /\b(?:hire|hiring|recruit|internship|intern|job|position|role|opportunity|talent|candidate|team|hr|agency|portfolio\s+review)\b/i,
          /\b(?:salary|package|ctc|lpa|stipend|remote|relocate|wfh|notice\s+period)\b/i,
          /\b(?:does\s+he\s+know|can\s+he|is\s+he\s+experienced|his\s+skills|tech\s+stack)\b/i,
        ],
      },
      student: {
        w: 2.5,
        patterns: [
          /\b(?:student|school|college|university|class|assignment|project|grade|subject|course|semester|exam|study)\b/i,
          /\b(?:i\s+am\s+(?:a\s+)?student|i\s+study|my\s+college|my\s+school|my\s+project)\b/i,
        ],
      },
      friend: {
        w: 2,
        patterns: [
          /\b(?:hey|bro|dude|yaar|bhai|man|buddy|lol|lmao|haha|omg|bruh|fam)\b/i,
          /\b(?:what'?s\s+up|wassup|how'?s\s+it|sup\b|yo\b)\b/i,
        ],
      },
      parent: {
        w: 3,
        patterns: [
          /\b(?:my\s+(?:son|daughter|child|kid)|parent|mom|dad|mother|father|family)\b/i,
          /\b(?:proud|achievement|his\s+future|career\s+path|growing\s+up)\b/i,
        ],
      },
      explorer: {
        w: 1.5,
        patterns: [
          /\b(?:show\s+me|explore|discover|what'?s\s+on|take\s+me\s+to|navigate|open)\b/i,
          /\b(?:surprise\s+me|random|interesting|what\s+else|anything)\b/i,
        ],
      },
      tester: {
        w: 2,
        patterns: [
          /\b(?:test(?:ing)?|debug|checking|does\s+this\s+work|error|bug|broken|fix|issue)\b/i,
          /\b(?:console|inspect|devtools|source\s+code|how\s+is\s+this\s+built)\b/i,
        ],
      },
      creative: {
        w: 2,
        patterns: [
          /\b(?:aesthetic|design|art|creative|visual|brand|concept|direction|mood|vibe|craft)\b/i,
          /\b(?:photography|portfolio\s+design|color|colour|theme|look|feel)\b/i,
        ],
      },
      casual: {
        w: 1,
        patterns: [
          /\b(?:just\s+(?:browsing|looking|checking|curious)|nothing\s+specific|no\s+reason)\b/i,
        ],
      },
    },

    update(text) {
      for (const [profile, cfg] of Object.entries(this.SIGNALS)) {
        let hit = false;
        for (const p of cfg.patterns) {
          if (p.test(text)) { hit = true; break; }
        }
        if (hit) {
          this._scores[profile] = (this._scores[profile] || 0) + cfg.w;
        }
      }

      let max = 0, best = 'explorer';
      for (const [p, s] of Object.entries(this._scores)) {
        if (s > max) { max = s; best = p; }
      }
      this._profile    = best;
      this._confidence = max;
    },

    get profile()    { return this._profile; },
    get confidence() { return this._confidence; },

    /* Tone descriptor for AI system prompt */
    getToneInstruction() {
      const tones = {
        recruiter: 'Respond professionally and concisely. Highlight achievements, skills, and measurable outcomes. Be factual.',
        student:   'Respond in a friendly, encouraging tone. Be clear and accessible. Use relatable language.',
        friend:    'Respond casually, like a friend. Keep it short, relaxed, maybe a bit witty. Match their energy.',
        parent:    'Respond warmly and respectfully. Emphasise achievements and character. Be reassuring.',
        explorer:  'Respond with some personality. Guide them through the site. Make exploration feel rewarding.',
        tester:    'Respond factually. Be precise. Technical details are welcome.',
        creative:  'Respond with aesthetic sensibility. Focus on design, craft, and visual storytelling.',
        casual:    'Respond lightly. Short answers. Keep it easy and breezy.',
      };
      return tones[this._profile] || tones.explorer;
    },

    /* Suggested chips based on profile */
    getSuggestions() {
      const C = window.RORO_CONFIG || {};
      if (C.visitorProfiles && C.visitorProfiles[this._profile]) {
        return C.visitorProfiles[this._profile];
      }
      const defaults = {
        recruiter:  ['Open the CV', 'Download résumé PDF', 'See all projects', 'What achievements stand out?'],
        student:    ['Who is Manomay?', 'Show the Journey', 'What projects are completed?', 'Tell me about ISKCON'],
        friend:     ['Surprise me', 'Show me the games', 'What easter eggs are there?', 'Play some music'],
        parent:     ['Who is Manomay?', 'What has he achieved?', 'Show me his education', 'Open CV'],
        explorer:   ['Show me Projects', 'Surprise me', 'Show me the Journey', 'Open Games'],
        tester:     ['How was this built?', 'What tech stack?', 'Tell me about easter eggs', 'Show me Projects'],
        creative:   ['Show me the photography', 'What themes are available?', 'Tell me about design', 'Open Traits'],
        casual:     ['Who is Manomay?', 'Surprise me', 'Show me Games', 'Open Projects'],
      };
      return defaults[this._profile] || defaults.explorer;
    },
  };

  /* ════════════════════════════════════════════════════════════════
     EMOTION DETECTOR
  ════════════════════════════════════════════════════════════════ */

  const EmotionDetector = {
    detect(text) {
      const lower = text.toLowerCase();

      if (/\b(?:sad|depressed|cry|crying|heartbroken|lonely|hopeless|devastated|miserable|empty|empty\s+inside|lost|broken|grieving)\b/i.test(lower))
        return 'sad';
      if (/\b(?:anxious|anxiety|stressed|stress|worried|worry|overwhelmed|panic|scared|nervous|fear|terrified)\b/i.test(lower))
        return 'anxious';
      if (/\b(?:angry|anger|furious|rage|pissed|frustrated|irritated|mad\s+at|so\s+mad)\b/i.test(lower))
        return 'angry';
      if (/\b(?:happy|excited|thrilled|great|amazing|wonderful|fantastic|love\s+it|awesome|brilliant)\b/i.test(lower))
        return 'happy';
      if (/\b(?:confused|lost|dont\s+understand|don't\s+understand|idk|not\s+sure|what\s+do\s+i\s+do)\b/i.test(lower))
        return 'confused';
      if (/\b(?:bored|boring|nothing\s+to\s+do|kill\s+time|entertain\s+me|amuse\s+me)\b/i.test(lower))
        return 'bored';

      return 'neutral';
    },

    /* Response tone modifier for AI */
    getToneModifier(emotion) {
      const mods = {
        sad:      'The user seems sad or down. Respond with warmth and empathy first, then gently redirect.',
        anxious:  'The user seems anxious or stressed. Be calm, reassuring, and supportive.',
        angry:    'The user seems frustrated. Acknowledge their frustration briefly, then redirect helpfully.',
        happy:    'The user is in a great mood. Match that positive energy.',
        confused:  'The user seems confused. Be extra clear and patient. Guide step by step.',
        bored:    'The user is bored. Be a bit playful and suggest something interesting.',
        neutral:  '',
      };
      return mods[emotion] || '';
    },
  };

  /* ════════════════════════════════════════════════════════════════
     LENGTH SELECTOR
     Determines how long the AI response should be.
  ════════════════════════════════════════════════════════════════ */

  const LengthSelector = {
    /* Word count targets */
    LENGTHS: {
      short: { min: 10, max: 20,  instruction: 'Reply in 10-20 words maximum. Ultra brief.' },
      mid:   { min: 20, max: 30,  instruction: 'Reply in 20-30 words. Concise but complete.' },
      high:  { min: 30, max: 40,  instruction: 'Reply in 30-40 words. Detailed but focused.' },
      para:  { min: 40, max: 60,  instruction: 'Reply in 40-60 words. Full paragraph response.' },
    },

    detect(text) {
      const lower = text.toLowerCase();

      /* Explicit user requests */
      if (/\b(?:in\s+short|briefly|quick(?:ly)?|just\s+one\s+(?:line|sentence)|tldr|tl;dr|summarise\s+in\s+one)\b/i.test(lower))
        return 'short';
      if (/\b(?:in\s+detail|detailed|explain\s+fully|tell\s+me\s+more|elaborate|give\s+me\s+(?:more|a\s+full|the\s+full)|comprehensive)\b/i.test(lower))
        return 'para';
      if (/\b(?:definition|define|what\s+does\s+\w+\s+mean|meaning\s+of)\b/i.test(lower))
        return 'mid';

      /* Question type inference */
      if (/\b(?:what\s+is\s+(?:his|the|your)\s+(?:email|number|phone|instagram|linkedin|url|link|address))\b/i.test(lower))
        return 'short';
      if (/^(?:hi|hello|hey|yo|sup|howdy)[!\s?.,]*$/i.test(lower.trim()))
        return 'short';

      return 'mid'; /* Default */
    },

    getInstruction(length) {
      return (this.LENGTHS[length] || this.LENGTHS.mid).instruction;
    },
  };

  /* ════════════════════════════════════════════════════════════════
     WEBSITE SEARCH ENGINE
     Confidence-scored retrieval. High threshold prevents false hits.
     "projector" will NOT match "projects". Confidence kills it.
  ════════════════════════════════════════════════════════════════ */

  const WebsiteSearch = {
    _index: null,
    _built: false,

    _buildIndex(kb) {
      const docs = [];
      const push = (type, id, text, weight, data) => {
        docs.push({ type, id, text: (text || '').toLowerCase(), weight: weight || 1, data });
      };

      /* Owner */
      const o = kb.owner || {};
      push('owner', 'identity', [
        o.name, o.tagline, o.description, o.fullBio,
        o.philosophy, o.workStyle, o.goals, o.contact,
        o.city, o.birthdayDate, 'manomay', 'msm', 'who is',
      ].join(' '), 2.5, o);

      /* Pages */
      for (const [id, pg] of Object.entries(kb.pages || {})) {
        push('page', id, [
          pg.label, pg.summary, (pg.features || []).join(' '),
          id, kb.rawText[id] || '',
        ].join(' '), 1.2, pg);
      }

      /* Projects */
      for (const [id, pr] of Object.entries(kb.projects || {})) {
        push('project', id, [
          pr.title, pr.description, pr.status, pr.type,
          (pr.keywords || []).join(' '), id,
        ].join(' '), 2.0, pr);
      }

      /* Years */
      for (const [yr, txt] of Object.entries(kb.years || {})) {
        push('year', yr, `${yr} ${txt} year journey timeline`, 1.0, { year: yr, text: txt });
      }

      /* FAQ */
      for (const [key, ans] of Object.entries(kb.faq || {})) {
        push('faq', key, `${key.replace(/_/g, ' ')} ${ans}`, 1.6, { question: key, answer: ans });
      }

      /* Features */
      for (const [key, desc] of Object.entries(kb.features || {})) {
        push('feature', key, `${key} ${desc}`, 1.2, { key, desc });
      }

      /* Design */
      const d = kb.design || {};
      push('design', 'design', [
        'design built stack technology html css javascript vanilla',
        d.summary, d.philosophy, (d.stack || []).join(' '),
        Object.values(d.themes || {}).map(t => `${t.label} ${t.id} ${t.desc}`).join(' '),
      ].join(' '), 1.2, d);

      /* Password/locked */
      push('password', 'password', [
        'password locked private access restricted unlock key',
        (kb.password || {}).hint, ((kb.password || {}).lockedSections || []).join(' '),
      ].join(' '), 1.0, kb.password);

      /* Lists */
      const L = kb.lists || {};
      if (L.books && L.books.length) {
        const bTxt = L.books.map(b => b.title + ' ' + (b.meta || '')).join(' ');
        push('list_books', 'books', 'books reading list what he reads recommendations ' + bTxt, 1.5, L.books);
      }
      if (L.movies && L.movies.length) {
        const mTxt = L.movies.map(m => m.title + ' ' + (m.meta || '')).join(' ');
        push('list_movies', 'movies', 'movies films what he watches recommendations ' + mTxt, 1.5, L.movies);
      }
      if (L.series && L.series.length) {
        const sTxt = L.series.map(s => s.title + ' ' + (s.meta || '')).join(' ');
        push('list_series', 'series', 'series shows web series what he watches ' + sTxt, 1.5, L.series);
      }
      if (L.places && L.places.length) {
        const pTxt = L.places.map(p => p.title).join(' ');
        push('list_places', 'places', 'places travel visited bucket list ' + pTxt, 1.5, L.places);
      }

      /* CV */
      const cv = kb.cv || {};
      push('cv', 'cv', [
        'cv resume curriculum vitae download experience education skills work',
        cv.summary, (cv.skills || []).join(' '),
        (cv.experience || []).map(e => e.title + ' ' + e.org).join(' '),
        (cv.education  || []).map(e => e.title + ' ' + e.org).join(' '),
      ].join(' '), 1.8, cv);

      /* Skills/Traits */
      if (kb.skills && kb.skills.length) {
        const sTxt = kb.skills.map(s => s.name).join(' ');
        const hTxt = (kb.hobbies || []).join(' ');
        push('skills', 'skills', 'skills traits abilities hobbies interests ' + sTxt + ' ' + hTxt, 1.4, kb.skills);
      }

      /* Social */
      for (const [id, s] of Object.entries(kb.social || {})) {
        if (s.url) {
          push('social', id, `${id} ${s.label || ''} ${s.handle || ''} social profile link`, 1.3, s);
        }
      }

      /* Games */
      const g = kb.games || {};
      const gTxt = [...(g.public || []), ...(g.private || [])].map(gm => gm.name + ' ' + (gm.desc || '')).join(' ');
      push('games', 'games', 'games play snake 2048 memory word scramble reaction ' + gTxt, 1.2, kb.games);

      this._index = docs;
      this._built = true;
    },

    _tokenise(str) {
      return (str || '').toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1);
    },

    _score(doc, queryTokens) {
      const docTokens = this._tokenise(doc.text);
      let   score     = 0;

      for (const qt of queryTokens) {
        for (const dt of docTokens) {
          if (dt === qt)                              { score += 10;  continue; }
          if (dt.startsWith(qt) && qt.length >= 4)   { score += 5;   continue; }
          if (qt.startsWith(dt) && dt.length >= 4)   { score += 4;   continue; }
          if (qt.length > 5 && dt.length > 5 && (dt.includes(qt) || qt.includes(dt))) { score += 3; }
        }
      }

      return score * (doc.weight || 1);
    },

    search(query, kb, topN) {
      topN = topN || 3;

      if (!this._built || !this._index) {
        this._buildIndex(kb || KnowledgeBuilder.build());
      }

      const qt = this._tokenise(query);
      if (!qt.length) return [];

      return this._index
        .map(doc => ({ score: this._score(doc, qt), doc }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
    },

    /* Compose a structured response from search results */
    composeAnswer(query, results) {
      if (!results || !results.length) return null;

      const top  = results[0];
      if (top.score < 8) return null; /* Too low confidence — let AI handle */

      const doc  = top.doc;
      const conf = Math.min(top.score / 70, 1);

      switch (doc.type) {
        case 'year': {
          const yr = doc.data;
          return {
            messages: [`${yr.year} — ${yr.text}`],
            options:  ['Show me the Journey', 'Tell me about another year'],
            confidence: conf,
          };
        }
        case 'password': {
          const C  = window.RORO_CONFIG || {};
          const pw = C.password || {};
          return {
            messages: ['Several sections require a password.', pw.hint || 'Best route: Contact page.'],
            options:  ['Take me to Contact', 'What exactly is locked?'],
            confidence: conf,
          };
        }
        default:
          /* All other types → send to AI cascade with KB context */
          return { useAI: true, doc, confidence: conf };
      }
    },
  };

  /* ════════════════════════════════════════════════════════════════
     RECRUITER ENGINE
     Handles professional/hiring/technical skill questions.
  ════════════════════════════════════════════════════════════════ */

  const RecruiterEngine = {
    SKILLS: {
      'html':        { has: true,  level: 'advanced',  note: 'The entire site is hand-coded vanilla HTML.' },
      'css':         { has: true,  level: 'advanced',  note: 'All animations, themes, and layouts — hand-written.' },
      'javascript':  { has: true,  level: 'advanced',  note: 'Pure vanilla JS throughout. No frameworks.' },
      'js':          { has: true,  level: 'advanced',  note: 'Pure vanilla JavaScript. Zero frameworks.' },
      'vanilla':     { has: true,  level: 'advanced',  note: 'Entire site is vanilla HTML, CSS, JavaScript.' },
      'git':         { has: true,  level: 'working',   note: 'Uses Git for version control.' },
      'github':      { has: true,  level: 'working',   note: 'Active GitHub: github.com/m-s-m-2-9' },
      'design':      { has: true,  level: 'strong',    note: 'This portfolio is direct evidence of his design sensibility.' },
      'photography': { has: true,  level: 'practiced', note: 'Led photography and videography at ISKCON Summer Camp 2024.' },
      'video':       { has: true,  level: 'practiced', note: 'Vlog production at ISKCON Camp 2024.' },
      'emailjs':     { has: true,  level: 'used',      note: 'Contact form powered by EmailJS.' },
      'gsap':        { has: true,  level: 'used',      note: 'Splash animation built with GSAP.' },
      'public speaking': { has: true, level: 'practiced', note: 'Led workshops and presentations at ISKCON Camp.' },
      'leadership':  { has: true,  level: 'practiced', note: 'Led a team of 40+ at ISKCON Camp. Project lead for Nationals.' },
      'python':      { has: false, level: 'not listed', note: null },
      'sql':         { has: false, level: 'not listed', note: null },
      'react':       { has: false, level: 'not used',  note: 'He deliberately avoids frameworks to build from first principles.' },
      'vue':         { has: false, level: 'not used',  note: null },
      'angular':     { has: false, level: 'not used',  note: null },
      'java':        { has: false, level: 'not listed', note: null },
      'php':         { has: false, level: 'not listed', note: null },
      'typescript':  { has: false, level: 'not listed', note: null },
      'nodejs':      { has: false, level: 'not listed', note: null },
      'node':        { has: false, level: 'not listed', note: null },
      'django':      { has: false, level: 'not listed', note: null },
      'aws':         { has: false, level: 'not listed', note: null },
      'docker':      { has: false, level: 'not listed', note: null },
    },

    P_EDUCATION: /\b(?:college|university|bba|don\s+bosco|studying|degree|enrolled|bachelor|business\s+analytics|graduation|when\s+does\s+he\s+finish|current\s+education)\b/i,
    P_HIRE:      /\b(?:hire|recruit|job|internship|available|opportunity|position|role|work\s+with|contract|freelance|commission)\b/i,
    P_REMOTE:    /\b(?:remote|work\s+from\s+home|relocation|relocate|wfh)\b/i,
    P_ACHIEVE:   /\b(?:achievements?|accomplishments?|what\s+has\s+he\s+done|stand\s+out|impressive|highlights|wins?|biggest\s+achievement|notable)\b/i,

    handle(text, kb) {
      const lower = text.toLowerCase();

      /* Skill check */
      for (const [skill, info] of Object.entries(this.SKILLS)) {
        if (!lower.includes(skill)) continue;
        if (info.has) {
          return {
            messages: [`Yes — ${skill.toUpperCase()} is at ${info.level} level.${info.note ? ' ' + info.note : ''}`],
            options:  ['See all Projects', 'Download CV', 'What other skills does he have?'],
          };
        } else {
          return {
            messages: [
              `${skill.toUpperCase()} isn't in the current skill set.${info.note ? ' ' + info.note : ''}`,
              'The Traits and CV pages have the full picture.',
            ],
            options: ['Open Traits', 'Download CV'],
          };
        }
      }

      /* Education */
      if (this.P_EDUCATION.test(lower)) {
        const faq = (kb && kb.faq && kb.faq.college)
          || 'Currently pursuing BBA with Business Analytics at Don Bosco College, Bengaluru. Started 2026.';
        return {
          messages: [faq],
          options:  ['Download CV', 'Show me Projects', 'What skills does he have?'],
        };
      }

      /* Hire/internship */
      if (this.P_HIRE.test(lower)) {
        return {
          messages: [
            'Manomay is open to creative, technical, or collaborative opportunities.',
            'The Contact page is the right channel — he reads every message.',
          ],
          buttons: [
            { label: '→ Open Contact', href: '#', primary: true },
            { label: '↓ Download CV', href: (kb && kb.cv && kb.cv.pdfPath) || 'manomay-cv.pdf', download: 'Manomay-Misra-CV.pdf' },
          ],
          options: ['Show me Projects', 'Show me the CV page'],
        };
      }

      /* Remote */
      if (this.P_REMOTE.test(lower)) {
        return {
          messages: ['No location restriction is specified. Best to ask directly via the Contact page.'],
          options:  ['Open Contact', 'Download CV'],
        };
      }

      /* Achievements */
      if (this.P_ACHIEVE.test(lower)) {
        return {
          messages: [
            'Two notable highlights: Creative Educator and Media Lead at the ISKCON Summer Camp (40+ students, 2024) and leading a project team to KVS Nationals.',
            'Full details in the Projects section.',
          ],
          options: ['Show me Projects', 'Tell me about ISKCON', 'Tell me about Nationals', 'Download CV'],
        };
      }

      return null;
    },
  };

  /* ════════════════════════════════════════════════════════════════
     CASUAL ENGINE
     Small talk, food, AI-nature questions, jokes.
     Never navigates. Never triggers site actions.
  ════════════════════════════════════════════════════════════════ */

  const CasualEngine = {
    JOKES: [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "I told my computer I needed a break. Now it keeps sending me Kit-Kat ads.",
      "Why don't scientists trust atoms? Because they make up everything.",
      "What do you call a fake noodle? An impasta.",
      "Why did the scarecrow win an award? He was outstanding in his field.",
      "I'm reading a book about anti-gravity. It's impossible to put down.",
      "Why did the bicycle fall over? Because it was two-tired.",
      "What do you get when you cross a snowman and a vampire? Frostbite.",
      "I asked the librarian about paranoia books. She whispered: 'They're right behind you.'",
      "Parallel lines have so much in common. It's a shame they'll never meet.",
      "I only know 25 letters of the alphabet. I don't know y.",
      "What do you call a parade of rabbits hopping backwards? A receding hare-line.",
      "Why can't a bicycle stand on its own? Because it's two-tired.",
      "My password is 'incorrect' — so whenever I forget it, the site says 'Your password is incorrect.'",
      "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
    ],

    HOW_ARE_YOU: [
      "Running smoothly. What can I help you with?",
      "All systems up. What do you need?",
      "Operational and attentive. Ask away.",
      "Good — ready to help. What are you looking for?",
      "Functioning as intended. What's on your mind?",
    ],

    EMOTIONAL_SUPPORT: [
      "That sounds genuinely tough. I hope things get easier soon. I'm here if you want to chat or explore the site for a distraction.",
      "Sorry to hear that. Take your time — even just browsing around might help a little. I'm here.",
      "That's a lot to carry. Sometimes a small distraction helps. Feel free to ask me anything.",
      "I hear you. I hope it gets better. If you want to talk about something else or explore the site, I'm right here.",
      "That sounds really hard. You don't have to be okay right now. I'm here whenever you're ready.",
    ],

    FOOD: [
      f => `No digestive system — so ${f} is out for me. Happy to help with anything about the site though.`,
      f => `I run on code, not calories. But Manomay has opinions on food — his Lists page has his recommendations. ${f} might be in there.`,
      f => `${f} sounds great but I'll pass — I'm a website assistant, not a food critic. What else can I help with?`,
      f => `Can't eat ${f}, unfortunately. But if you want to know what Manomay watches, reads, or wants to visit — the Lists page has all that.`,
    ],

    GENERAL: [
      "I'm mostly wired for questions about Manomay and this portfolio. Happy to help with those.",
      "That's a bit outside my lane — I'm website-specific. What would you like to know about the site?",
      "I can try, but my best use is for questions about Manomay's work and website. What would you like to know?",
    ],

    handle(text, cls) {
      const lower = text.toLowerCase();

      /* Joke */
      if (cls && cls.type === 'JOKE') {
        const j = this.JOKES[Math.floor(Math.random() * this.JOKES.length)];
        return { messages: [j], options: ['Tell me another one', 'Who is Manomay?', 'Show me Projects'] };
      }

      /* Emotional */
      if (cls && cls.type === 'EMOTIONAL') {
        const r = this.EMOTIONAL_SUPPORT[Math.floor(Math.random() * this.EMOTIONAL_SUPPORT.length)];
        return { messages: [r], options: ['Show me Games', 'Surprise me', 'Who is Manomay?'] };
      }

      /* How are you */
      if (/\b(?:how\s+are\s+you|how\s+is\s+roro|are\s+you\s+ok|how'?s\s+it\s+going|you\s+doing\s+(?:well|ok|good|alright))\b/i.test(lower)) {
        return {
          messages: [this.HOW_ARE_YOU[Math.floor(Math.random() * this.HOW_ARE_YOU.length)]],
          options:  ['Who is Manomay?', 'Show me Projects'],
        };
      }

      /* Food */
      const fm = lower.match(/\b(pizza|burger|sushi|pasta|biryani|curry|chocolate|ice\s*cream|coffee|tea|ramen|sandwich|dosa|chai|naan|pav\s+bhaji|samosa|momos|rice|dal|paneer)\b/i);
      if (fm) {
        const fn = this.FOOD[Math.floor(Math.random() * this.FOOD.length)];
        return { messages: [fn(fm[1])], options: ['Open Lists', 'Tell me about Manomay'] };
      }

      /* Bored */
      if (/\b(?:i(?:'m|\s+am)\s+bored|bored|nothing\s+to\s+do|entertain\s+me|kill\s+time|amuse\s+me)\b/i.test(lower)) {
        return {
          messages: ['The Games page has five fully playable games. Snake, Memory Match, 2048, Reaction Time, Word Scramble.'],
          navigate: 'games',
          options:  ['Open Games', 'Surprise me', 'Tell me about easter eggs'],
        };
      }

      /* Busy/sleep/dream */
      if (/\b(?:are\s+you\s+(?:busy|free)|do\s+you\s+(?:sleep|dream|eat|feel)|can\s+you\s+feel)\b/i.test(lower)) {
        return {
          messages: ["Busy helping visitors explore the site. What can I help you with?"],
          options:  ['Who is Manomay?', 'Show me Projects'],
        };
      }

      /* Favourite/preference */
      if (/\b(?:favourite|favorite|do\s+you\s+(?:like|enjoy|watch|read|play|listen))\b/i.test(lower)) {
        return {
          messages: ["I don't have personal preferences — I'm a website assistant. But Manomay does. The Lists and Traits pages have his curated tastes."],
          options:  ['Open Lists', 'Open Traits'],
        };
      }

      return { messages: [this.GENERAL[Math.floor(Math.random() * this.GENERAL.length)]], options: ['Who is Manomay?', 'Show me Projects', 'Surprise me'] };
    },
  };

  /* ════════════════════════════════════════════════════════════════
     GENERAL KNOWLEDGE  (inline — zero network)
  ════════════════════════════════════════════════════════════════ */

  const GeneralKnowledge = {
    INLINE: {
      'ferrari':    'Ferrari is an Italian luxury sports car manufacturer founded by Enzo Ferrari in 1939. Known for high-performance vehicles and Formula 1 racing.',
      'bmw':        'BMW (Bayerische Motoren Werke) is a German luxury automobile and motorcycle company founded in 1916.',
      'mercedes':   'Mercedes-Benz is a German luxury automobile brand. One of the oldest recognised car manufacturers in the world.',
      'tesla':      'Tesla is an American electric vehicle company founded in 2003. Known for the Model S, Model 3, and Autopilot self-driving technology.',
      'apple':      'Apple Inc. is an American technology company known for the iPhone, Mac, and iOS ecosystem. Founded 1976 by Steve Jobs and Steve Wozniak.',
      'google':     'Google is an American technology company specialising in internet services, search, and advertising. Part of Alphabet Inc. since 2015.',
      'microsoft':  'Microsoft is an American technology company founded 1975 by Bill Gates. Known for Windows, Office, Azure, and Xbox.',
      'amazon':     'Amazon is a US multinational focused on e-commerce, cloud computing (AWS), and digital streaming. Founded by Jeff Bezos in 1994.',
      'nasa':       'NASA is the US government space agency, founded 1958. Responsible for Apollo missions, the ISS, Mars rovers, and the Artemis programme.',
      'python':     'Python is a high-level programming language known for its readability. Widely used in data science, AI, web development, and scripting.',
      'javascript': 'JavaScript is the primary programming language of the web browser. Enables interactive websites. Also runs on servers via Node.js.',
      'html':       'HTML (HyperText Markup Language) is the standard markup language for web pages. Defines structure and content.',
      'css':        'CSS (Cascading Style Sheets) describes how HTML elements are visually displayed. Controls layout, colours, fonts, and animations.',
      'chatgpt':    'ChatGPT is an AI chatbot developed by OpenAI, launched in 2022. Based on GPT large language models.',
      'openai':     'OpenAI is an AI research company founded in 2015. Known for GPT models, ChatGPT, and DALL-E.',
      'elon musk':  'Elon Musk is a South African-born entrepreneur. CEO of Tesla and SpaceX, owner of X (formerly Twitter).',
      'india':      "India is a South Asian country with 1.4+ billion people — the world's most populous nation. 7th largest by area.",
      'mumbai':     "Mumbai is India's financial capital and most populous city, on the western coast in Maharashtra state.",
      'bengaluru':  "Bengaluru (Bangalore) is the capital of Karnataka, India. Known as the Silicon Valley of India for its tech industry.",
      'blockchain': 'Blockchain is a distributed ledger technology recording transactions across multiple computers. Foundation of Bitcoin and other cryptocurrencies.',
      'machine learning': 'Machine learning is a subset of AI where systems learn from data to improve without explicit programming.',
      'artificial intelligence': 'AI is the simulation of human intelligence in machines — enabling learning, reasoning, vision, and language understanding.',
    },

    cap(text, n) {
      n = n || 60;
      if (!text) return '';
      const w = text.trim().split(/\s+/);
      return w.length <= n ? text.trim() : w.slice(0, n).join(' ') + '\u2026';
    },

    getInline(query) {
      const lower = query.toLowerCase();
      for (const [key, val] of Object.entries(this.INLINE)) {
        if (lower.includes(key)) return val;
      }
      return null;
    },

    buildResponse(fact) {
      return {
        messages: [this.cap(fact, 50), "By the way — I'm primarily here to help you explore Manomay's portfolio."],
        options:  ['Who is Manomay?', 'Show me Projects', 'Surprise me'],
        confidence: 0.9,
      };
    },
  };

  /* ════════════════════════════════════════════════════════════════
     SESSION MEMORY
     Tracks conversation context. Pronoun resolution.
     Anti-loop. Analytics.
  ════════════════════════════════════════════════════════════════ */

  const SessionMemory = {
    history:         [], /* Last 10 messages { role, content } */
    topics:          [],
    entities:        [],
    lastTopic:       null,
    messageCount:    0,

    /* Anti-loop */
    _recentResponses: [],
    MAX_RECENT:       20,

    /* Analytics */
    unknownLog:   [],
    internetLog:  [],
    recruiterLog: [],

    addMessage(role, content) {
      this.history.push({ role, content });
      if (this.history.length > 10) this.history.shift();
      this.messageCount++;
    },

    addTopic(t) {
      if (!t) return;
      this.lastTopic = t;
      if (!this.topics.includes(t)) this.topics.unshift(t);
      if (this.topics.length > 15) this.topics.pop();
    },

    addEntity(e) {
      if (!e) return;
      this.entities.unshift(e);
      if (this.entities.length > 5) this.entities.pop();
    },

    /* Resolve "it", "that", "the project" → actual entity */
    resolveReference(text) {
      const PRNS = /\b(?:it|that\s+one|the\s+same|that\s+thing|this\s+one|this\s+thing|the\s+project|the\s+page|those|them|that\s+project|that\s+page|that\s+game|that\s+feature)\b/i;
      if (!PRNS.test(text)) return text;
      const ctx = this.entities[0] || this.lastTopic;
      if (ctx) return text + ` [context: ${ctx}]`;
      return text;
    },

    /* Get last N messages for AI context */
    getHistory(n) {
      n = n || 10;
      return this.history.slice(-n);
    },

    /* Anti-loop check */
    isRepetitive(msg) {
      if (!msg) return false;
      const key = msg.slice(0, 60).toLowerCase();
      return this._recentResponses.includes(key);
    },

    trackResponse(msg) {
      if (!msg) return;
      const key = msg.slice(0, 60).toLowerCase();
      this._recentResponses.unshift(key);
      if (this._recentResponses.length > this.MAX_RECENT) this._recentResponses.pop();
    },

    logUnknown(q)   { this.unknownLog.push({ q, ts: Date.now() }); },
    logInternet(q)  { this.internetLog.push({ q, ts: Date.now() }); },
    logRecruiter(q) { this.recruiterLog.push({ q, ts: Date.now() }); },

    getAnalytics() {
      return {
        totalMessages: this.messageCount,
        unknownLog:    this.unknownLog,
        internetLog:   this.internetLog,
        recruiterLog:  this.recruiterLog,
        topics:        this.topics,
      };
    },
  };

  /* ════════════════════════════════════════════════════════════════
     EXPORT
  ════════════════════════════════════════════════════════════════ */

  window.RoRoIntelligence = {
    KnowledgeBuilder,
    TypoCorrector,
    EntityExtractor,
    Classifier,
    ProfileDetector,
    EmotionDetector,
    LengthSelector,
    WebsiteSearch,
    RecruiterEngine,
    CasualEngine,
    GeneralKnowledge,
    SessionMemory,
  };

})();
