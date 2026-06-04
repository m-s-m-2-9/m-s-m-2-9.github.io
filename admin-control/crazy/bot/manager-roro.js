/*
████████████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████████████

  PART B — SEPARATE FILE STARTS HERE
  ════════════════════════════════════════════════════════════════════════════
  SAVE AS:  admin-control/crazy/bot/manager-roro.js
  ════════════════════════════════════════════════════════════════════════════

████████████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████████████
*/

/* ═══════════════════════════════════════════════════════════════════════════
   admin-control/crazy/bot/manager-roro.js
   MSM Portfolio · RoRo Configuration File v4.0

   THIS IS THE ONLY FILE YOU EVER NEED TO EDIT.
   ─────────────────────────────────────────────────────────────────────────
   SECTION  1 — OWNER INFO
   SECTION  2 — PAGES
   SECTION  3 — PROJECTS
   SECTION  4 — YEARS (Journey Timeline)
   SECTION  5 — DESIGN INFO
   SECTION  6 — PASSWORD INFO
   SECTION  7 — FEATURES
   SECTION  8 — SOCIAL LINKS
   SECTION  9 — FAQ ANSWERS
   SECTION 10 — NAVIGATION KEYWORDS
   SECTION 11 — THEME KEYWORDS
   SECTION 12 — MUSIC KEYWORDS
   SECTION 13 — SYNONYM TABLE
   SECTION 14 — CUSTOM INTENTS
   SECTION 15 — VISITOR PROFILES
   SECTION 16 — SMALL TALK
   SECTION 17 — RESPONSE POOLS
   SECTION 18 — PROMPT TICKER
   SECTION 19 — SETTINGS
   SECTION 20 — ANALYTICS CONFIG (NEW v4.0)
═══════════════════════════════════════════════════════════════════════════ */

window.RORO_CONFIG = {

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 1 — OWNER INFO
  ═══════════════════════════════════════════════════════════════════════ */
  owner: {
    name:        'Manomay Shailendra Misra',
    shortName:   'Manomay',
    born:        'August 29, 2008',
    birthplace:  'Andheri, Maharashtra, India',
    city:        'Mumbai · now Bengaluru',
    tagline:     'Born 2008 · Mumbai · Making something of it all',
    philosophy:  'Building legacy without losing softness.',
    description: 'A seventeen-year-old creator, thinker, and builder from Bengaluru. Nomadic by upbringing — eight cities, one consistent ambition. He designs with intention, builds from scratch, and believes the process matters as much as the output.',
    traits:      ['Ambitious','Detail-oriented','Nomadic by upbringing','Calm under pressure','Deeply curious','Storyteller at heart'],
    inspirations:['Dieter Rams','Paul Graham','Japanese minimalism','The craft of writing','Architecture and space'],
    workStyle:   'Everything from scratch. No templates, no shortcuts. Each project is deliberate and considered.',
    goals:       'Build systems and stories that outlast trends. Contribute to something that matters before 25.',
    contact:     'manomaysmisra2908@gmail.com',
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 2 — PAGES
  ═══════════════════════════════════════════════════════════════════════ */
  pages: {
    home:    {label:'Home',     summary:"The entry point. Manomay's name, a tagline, and a curated navigation grid. Clean, minimal, intentional — the whole site in one scroll.",features:['Animated hero with three-word name','Theme switcher (4 themes: Noir, Ivory, Slate, Forest)','Background music player','Navigation grid to all sections','Easter egg — 7 name clicks reveals a vinyl record']},
    about:   {label:'Identity', summary:"Manomay's identity in written form — where he came from, what shaped him, what drives him. A private layer exists behind a password.",features:['Personal biography','Private extended section (password protected)','Portrait photo','Philosophy statement']},
    photos:  {label:'Photos',   summary:'Curated visual moments. Public albums open to all, private albums behind a password. Visual diary, not a social feed.',features:['Public photo albums','Private albums (password protected)','Full-screen photo viewer']},
    resume:  {label:'CV / Résumé',summary:'A clean formal résumé — experience, education, skills — in the same minimalist aesthetic as the site. Downloadable PDF at the bottom.',features:['Work experience entries','Education history','Skills as tags','Downloadable PDF']},
    projects:{label:'Projects', summary:'Where the work lives — a flat list of projects each with a status label. Click any project for a full description popup.',features:['Flat project list','Status labels: Completed / Ongoing / Abandoned','Click any project for a full-detail popup']},
    profiles:{label:'Profiles', summary:"All of Manomay's public internet presence — Instagram, LinkedIn, X, GitHub, Facebook.",features:['Instagram — @m_s_m_2_9','LinkedIn — manomay-shailendra-misra','X (Twitter) — @_msm29','GitHub — m-s-m-2-9','Facebook','WhatsApp (coming soon)']},
    journey: {label:'Journey',  summary:'A year-by-year timeline from 2008 to the present. Click any year and read that chapter. Spans eight cities across India.',features:['Interactive horizontal timeline (2008–2026)','Click any year to expand its chapter','Private entries locked by password']},
    birthday:{label:'Clock',    summary:'A live countdown to August 29th running to the millisecond. Something changes on the day itself.',features:['Millisecond live countdown','Birthday: 29 August 2008','Special birthday state activates on the day']},
    thoughts:{label:'Thoughts', summary:'Six categories of beliefs: Politics, God & Faith, Science, Life & Philosophy, Society & Culture, Technology. Multiple posts each. Unfiltered.',features:['Politics','God & Faith','Science','Life & Philosophy','Society & Culture','Technology']},
    contact: {label:'Contact',  summary:"A direct message form. Manomay reads every submission. Explaining your reason for the password significantly improves your chances.",features:['Direct contact form','EmailJS integration','Password request channel']},
    lists:   {label:'Lists',    summary:'Curated taste across Web Series, Books, Places, and Movies. Full list requires the site password.',features:['Web Series','Books','Places','Movies','Full list requires password']},
    skills:  {label:'Traits',   summary:'Animated skill bars, a scrolling marquee of keywords, and a hobbies section. An honest map of capability and curiosity.',features:['Animated skill bars with percentages','Scrolling keyword marquee','Hobbies and interests section']},
    games:   {label:'Games',    summary:'Five built-in games: Snake, Memory Match, 2048, Reaction Time, Word Scramble. Private section with family games behind a password.',features:['Snake','Memory Match','2048','Reaction Time','Word Scramble','Private family games (password protected)']},
    social:  {label:'Social Proof',summary:'Brands and organisations Manomay has worked with, plus written testimonials from collaborators.',features:['Scrolling brand logos marquee','Testimonial cards']},
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 3 — PROJECTS
  ═══════════════════════════════════════════════════════════════════════ */
  projects: {
    nationals:{title:'Nationals',description:'A competition-level initiative representing the school at the KVS National Science Exhibition. Reached the national stage after winning at school, cluster, and regional levels.',status:'Completed · 2024',type:'Academic Competition',keywords:['nationals','national','competition','achievement','win','kvs','exhibition','kvs nationals','science exhibition']},
    ecommerce:{title:'E-commerce Prototype',description:'A full e-commerce prototype built from scratch — product listings, cart, and checkout flow. Handcrafted, no frameworks. Built to demonstrate real-world product thinking and frontend development capability.',status:'Completed · 2024',type:'Web / Development',keywords:['ecommerce','ecom','shop','store','web','development','prototype','commerce','online store','shopping','cart']},
    iskcon:   {title:'ISKCON Summer Camp',description:'Creative Educator and Media Lead for a 40+ student summer programme at ISKCON Centre. Ran workshops in origami, paper engineering, and cardboard sculpting. Also served as photographer, videographer, and vlog producer throughout the camp.',status:'Completed · 2024',type:'Education / Media',keywords:['iskcon','iskon','isckon','hare krishna','krishna','temple','camp','summer','educator','media','photography','workshop','children','education','vlog','summer camp','iskcon camp']},
    website:  {title:'MSM Personal Website',description:'This website. Pure HTML, CSS, and JavaScript. Zero frameworks, zero templates. Cinematic splash screen, custom CMS, desktop sidebar, 5 mini-games, photo albums, thoughts blog, RoRo AI layer, and 4 colour themes.',status:'Ongoing · 2025–Present',type:'Web / Design',keywords:['website','portfolio','personal','site','this','here','msm','web','this website','your site','this site']},
    writing:  {title:'Until The Bullet Woke Me',description:'A creative writing project. A story, composed with deliberate craft. The title carries the weight of the content. Completed in 2024.',status:'Completed · 2024',type:'Creative Writing',keywords:['writing','story','bullet','creative','fiction','narrative','until the bullet','bullet woke me','short story','prose']},
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 4 — YEARS
  ═══════════════════════════════════════════════════════════════════════ */
  years: {
    2008:"The Beginning — Born in Maharashtra at the intersection of India's old soul and its financial ambition. The nomadic blueprint was set from day one.",
    2009:"Year One — A period of deep, silent growth. Developing early observation skills, absorbing structure and discipline from the household.",
    2010:"Growing Up — First major move to Jaipur. First school: Star Kids Pre-school. First real social ecosystem outside the family.",
    2011:"Discovery — Double promotion from LKG to UKG in six months. Teachers recognised an exceptional IQ and intrinsic motivation beyond his years.",
    2012:"Early Years — 1st Rank for academic and behavioral excellence. His father was honoured with the school's Best Father Award that same year.",
    2013:"Shifting — Details being written.",
    2014:"New Ground — Details being written.",
    2015:"The Turn — Details being written.",
    2016:"Momentum — Details being written.",
    2017:"Building — Details being written.",
    2018:"Defining — Details being written.",
    2019:"Expanding — Details being written.",
    2020:"The Pause — The year the world stopped. Something changed internally too.",
    2021:"Rebuilding — Details being written.",
    2022:"Acceleration — Details being written.",
    2023:"Clarity — Details being written.",
    2024:"Intention — ISKCON Camp. Nationals. E-commerce. The year of execution.",
    2025:"Transformation — Details being written.",
    2026:"Present — This website exists. That already means something.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 5 — DESIGN INFO
  ═══════════════════════════════════════════════════════════════════════ */
  design: {
    summary:   'Built entirely from scratch — no templates, no frameworks. Pure HTML, CSS, and JavaScript. Four themes: Noir, Ivory, Slate, Forest. Every animation hand-coded.',
    philosophy:'The site should feel like a conversation, not a brochure. Every element is intentional. Nothing is decorative without purpose.',
    stack:     ['Vanilla HTML','Vanilla CSS','Vanilla JavaScript','EmailJS (contact form)','Web Audio API (sound)','localStorage (memory)','GSAP (splash animation)'],
    themes: {
      dark:  {id:'dark',  label:'Noir',  desc:'Deep black. The default. Serious, cinematic.'},
      light: {id:'light', label:'Ivory', desc:'Warm white. Premium, editorial, minimal.'},
      slate: {id:'slate', label:'Slate', desc:'Cool blue-grey. Clean, technical, precise.'},
      forest:{id:'forest',label:'Forest',desc:'Muted green. Calm, organic, grounded.'},
    },
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 6 — PASSWORD INFO
  ═══════════════════════════════════════════════════════════════════════ */
  password: {
    hint:          "It isn't publicly distributed. Best route: the Contact page — explain why you want access, and Manomay decides. Genuine curiosity gets a response.",
    lockedSections:['Private photo albums','Private journey entries','Full curated lists','Birth details','Private family games','Extended identity section'],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 7 — FEATURES
  ═══════════════════════════════════════════════════════════════════════ */
  features: {
    music:    "Built-in music player with two tracks — background ambience loops by default. The easter-egg song unlocks after clicking Manomay's name on the homepage exactly seven times.",
    themes:   "Four visual themes: Noir (dark), Ivory (light), Slate (cool blue-grey), Forest (muted green). Four dots in the top-right switch between them instantly.",
    roro:     "That's me — RoRo. The site's intelligence layer. I know every section, can navigate for you, switch themes, control music, answer questions about Manomay, and show links to his social profiles.",
    cursor:   "Custom animated cursor — a small dot and a trailing ring. Hover states change the cursor shape. Disabled automatically on touch devices.",
    sound:    "Mechanical click/tick sounds on interactions — toggle the push-button icon in the nav bar to turn them on or off.",
    easter:   "Seven clicks on the hero name → vinyl record appears and an easter-egg song starts. Type the word 'manomay' anywhere on the keyboard → accent colour flash. The splash screen can be skipped with 20–25 rapid clicks.",
    sidebar:  "Desktop sidebar — the hamburger icon in the top right opens it. Contains navigation to sidebar-only pages.",
    parallax: "The blueprint-style background grid on the homepage scrolls at 25% of content speed, creating a subtle depth effect.",
    navReel:  "When you switch themes, the navbar letters briefly cycle through random uppercase characters before settling — a mechanical counter aesthetic.",
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 8 — SOCIAL LINKS
  ═══════════════════════════════════════════════════════════════════════ */
  social: {
    instagram:{label:'Instagram',  hint:'Visual work and personal moments.',   url:'https://www.instagram.com/m_s_m_2_9/'},
    linkedin: {label:'LinkedIn',   hint:'Professional profile and work history.',url:'https://www.linkedin.com/in/manomay-shailendra-misra'},
    x:        {label:'X (Twitter)',hint:'Thoughts in real time.',               url:'https://x.com/_msm29'},
    github:   {label:'GitHub',     hint:'Code repositories.',                   url:'https://github.com/m-s-m-2-9'},
    facebook: {label:'Facebook',   hint:'Facebook profile.',                    url:'https://www.facebook.com/profile.php?id=100075236510917'},
    email:    {label:'Email',      hint:'Direct inbox.',                        url:'mailto:manomaysmisra2908@gmail.com'},
    cv:       {label:'Download CV',hint:'Full résumé as a PDF.',               url:'manomay-cv.pdf',download:true},
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 9 — FAQ ANSWERS
  ═══════════════════════════════════════════════════════════════════════ */
  faq: {
    age:          'Manomay was born on August 29, 2008. Use the Clock page for a live millisecond countdown and exact age.',
    location:     'Originally from Mumbai, Maharashtra. Currently based in Bengaluru, Karnataka.',
    college:      'Currently pursuing BBA with Business Analytics at Don Bosco College, Bengaluru. Started 2026.',
    hobbies:      'Music and vintage records, reading, cinema, travel, games, photography. The Traits page has the full picture.',
    nationality:  'Indian. Born in Maharashtra, raised across eight cities.',
    stack:        'Vanilla HTML, CSS, and JavaScript. No React, no Vue, no templates. Everything hand-coded from scratch.',
    frameworks:   'None. This site uses zero JavaScript frameworks. Every animation, every interaction — pure vanilla JS.',
    howBuilt:     'Built from scratch over several months. HTML, CSS, JavaScript only. No template, no CMS, no framework.',
    password:     'The password is not public. Contact Manomay via the Contact page and explain why you want access.',
    hiring:       'Manomay is open to interesting creative and technical opportunities. The Contact page is the right channel.',
    cv:           'The CV page has the full résumé. There is a downloadable PDF at the bottom of that page.',
    experience:   'ISKCON Summer Camp (2024) as Creative Educator and Media Lead. The CV page has the full picture.',
    music:        'Built-in music player with two tracks. Click the sound bars icon in the nav. Seven clicks on the homepage name unlocks a hidden track.',
    games:        'Five fully playable games built into the site — Snake, Memory Match, 2048, Reaction Time, Word Scramble.',
    books:        'Colleen Hoover, Ali Hazelwood, Mark Manson, and more. The Lists page has his full reading list.',
    movies:       'Interstellar, Rockstar, Tumbbad, Zindagi Na Milegi Dobara — among others. The Lists page has his full movie list.',
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 10 — NAVIGATION KEYWORDS
  ═══════════════════════════════════════════════════════════════════════ */
  navigationKeywords: {
    home:     ['front page','go home','homepage','main page','back to start'],
    about:    ['about manomay','his story','background','personal info','his identity'],
    photos:   ['his photos','pictures','photo albums','images','gallery','photo gallery'],
    resume:   ['résumé','his resume','his cv','his experience','work history','career'],
    projects: ['his projects','his work','what he built','his portfolio','his builds'],
    profiles: ['his socials','social media','online presence','find him online','his handles'],
    journey:  ['his life','his history','life story','his years','his chapters','his past'],
    birthday: ['countdown','birthday timer','his birthday','birth countdown','clock page'],
    thoughts: ['his opinions','his beliefs','his views','what he thinks','his blog'],
    contact:  ['reach out','get in touch','message him','write to him','drop a message'],
    lists:    ['his recommendations','what he watches','what he reads','curations','his lists'],
    skills:   ['what he can do','his abilities','skills page','traits page','his skills'],
    games:    ['play a game','built-in games','mini games','games section'],
    social:   ['testimonials','brands','who he worked with','social proof page','companies'],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 11 — THEME KEYWORDS
  ═══════════════════════════════════════════════════════════════════════ */
  themeKeywords: {
    dark:  ['dark mode','night mode','noir mode','make it dark','darker','black theme','go dark'],
    light: ['light mode','ivory mode','white theme','bright mode','make it bright','lighter','go light'],
    slate: ['slate mode','blue mode','cool mode','grey theme','go slate','technical theme'],
    forest:['forest mode','green mode','nature mode','earthy theme','go forest','green theme'],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 12 — MUSIC KEYWORDS
  ═══════════════════════════════════════════════════════════════════════ */
  musicKeywords: {
    play: ['play the music','start the music','put some music on','turn on music','play ambient','music please'],
    pause:['stop the music','pause the music','turn off music','silence','mute','music off','quiet please'],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 13 — SYNONYM TABLE
  ═══════════════════════════════════════════════════════════════════════ */
  synonyms: {
    'instagram':  ['insta','ig','instagram page','msm insta'],
    'linkedin':   ['li','linked in','linked-in','professional'],
    'github':     ['git','gh','github page','repos','repositories'],
    'x':          ['twitter','tweet','tweets','x account'],
    'facebook':   ['fb','facebook page'],
    'whatsapp':   ['wa','whats app','watsapp','ws'],
    'nationals':  ['national','kvs nationals','exhibition','kvs'],
    'iskcon':     ['iskon','isckon','krishna camp','temple camp','hare krishna camp'],
    'ecommerce':  ['ecom','shop','store','shopping site','e-commerce','e commerce'],
    'cv':         ['resume','résumé','curriculum vitae','vitae','biodata'],
    'music':      ['song','audio','ambience','background music','track','vinyl'],
    'photo':      ['photograph','pic','picture','snap','image'],
    'thought':    ['opinion','view','belief','stance','take'],
    'password':   ['pw','pass','passkey','access code','unlock code'],
    'contact':    ['reach','ping','dm','message','hmu','hit up'],
    'surprise':   ['kuch bhi','anything','random karo','choose karo'],
    'good':       ['achha','nice','sahi','badiya','cool'],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 14 — CUSTOM INTENTS
  ═══════════════════════════════════════════════════════════════════════ */
  customIntents: [
    {
      id:'info_college',label:'College and current education',enabled:true,priority:0,
      keywords:['college','university','bba','don bosco','studying','degree','course','enrolled','bachelor','business analytics','bengaluru college','where does he study','what is he studying','current education'],
      response:['Currently pursuing BBA with Business Analytics at Don Bosco College, Bengaluru. Started 2026.','Don Bosco College, Bengaluru — BBA with Business Analytics. The intersection of business thinking and data.'],
      navigate:null,options:['Show me the CV','Who is Manomay?','Show me Projects'],buttons:null,
    },
    {
      id:'info_cities',label:'Cities and places lived',enabled:true,priority:0,
      keywords:['cities','moved','how many cities','lived','nomadic','india','mumbai','bengaluru','bangalore','jaipur','where has he lived','different cities','grew up','upbringing','moved around'],
      response:['Eight cities across India — Jaipur, Mumbai, Bengaluru among others. Nomadic by design, grounded by intention.','He has lived in eight cities across India. The constant movement shaped his perspective more than any single place could.'],
      navigate:'journey',options:['Show me the Journey','Tell me about 2010','Who is Manomay?'],buttons:null,
    },
    {
      id:'info_inspiration',label:'Inspirations and influences',enabled:true,priority:0,
      keywords:['inspired by','inspiration','influence','influenced by','looks up to','admires','role model','dieter rams','paul graham','minimalism','who influenced','who inspired','what shapes him'],
      response:['Dieter Rams for design discipline. Paul Graham for thinking about building. Japanese minimalism for restraint. The craft of writing and architecture round it out.','The inspirations: Dieter Rams (form follows function), Paul Graham (build things that matter), Japanese minimalism (less, but better).'],
      navigate:null,options:['Tell me more about Manomay','Show me Identity','What has he built?'],buttons:null,
    },
    {
      id:'info_origami',label:'Origami and paper craft',enabled:true,priority:0,
      keywords:['origami','paper','paper engineering','paper craft','folding','craft','paper folding','cardboard','hands-on'],
      response:['Paper engineering and origami are part of what Manomay taught at the ISKCON Summer Camp — 40+ students, hands-on workshops. Deliberate craft, even in play.','He ran origami and paper engineering workshops at ISKCON. Physical, tactile making matters as much as digital work.'],
      navigate:null,options:['Tell me about ISKCON','Show me Projects','What are his traits?'],buttons:null,
    },
    {
      id:'info_philosophy_deep',label:'Deep philosophy or worldview',enabled:true,priority:0,
      keywords:['philosophy','worldview','values','principles','what does he believe','what does manomay think','his mindset','way of thinking','core values','deep beliefs','what he stands for'],
      response:['"Building legacy without losing softness." That\'s the core of it. Calm execution, intentional detail, work that outlasts the moment.','The Thoughts section has his unfiltered beliefs across six categories — Politics, Faith, Science, Life, Society, Technology. Worth reading.'],
      navigate:'thoughts',options:['Open Thoughts','Tell me more about Manomay','Show me Identity'],buttons:null,
    },
    {
      id:'info_writing_project',label:'The writing project',enabled:true,priority:0,
      keywords:['until the bullet','bullet woke me','writing project','story he wrote','creative writing project','his book','did he write','wrote a story','fiction project','his fiction'],
      response:['"Until The Bullet Woke Me" — a creative writing project. Deliberate craft. The title carries the weight of the content. Completed 2024.','He wrote a story in 2024. "Until The Bullet Woke Me." Not much is shared about it publicly — which is intentional.'],
      navigate:'projects',options:['Show me all projects','Tell me about ISKCON','Who is Manomay?'],buttons:null,
    },
    {
      id:'info_cursor_feature',label:'Custom cursor explanation',enabled:true,priority:0,
      keywords:['cursor','custom cursor','dot cursor','that dot','the cursor','cursor effect','mouse cursor','cursor ring'],
      response:['Custom cursor — a small dot and a trailing ring. On the light theme it stays clean gold. On dark themes it uses a blend mode for a glow effect. Auto-disabled on touch devices.','The cursor is fully custom — dot and outer ring. It changes shape on hover states and adapts to each theme.'],
      navigate:null,options:['What other features does the site have?','Tell me about easter eggs','How was this site built?'],buttons:null,
    },
    {
      id:'info_reel_animation',label:'Nav reel animation',enabled:true,priority:0,
      keywords:['reel animation','letter animation','navbar animation','nav animation','letters scramble','scramble effect','mechanical letters','letter reel','letters change','nav letters'],
      response:["When you switch themes, the navbar letters briefly cycle through random uppercase characters and numbers before settling — a mechanical counter aesthetic. It only fires on theme change.","That's the letter-reel animation. Each nav item's letters scramble and settle when you change themes. Think airport departure boards."],
      navigate:null,options:['Switch to ivory theme','Switch to forest theme','Tell me about other features'],buttons:null,
    },
    {
      id:'info_parallax',label:'Grid parallax on homepage',enabled:true,priority:0,
      keywords:['parallax','background moves','grid scrolling','grid moves','background grid','blueprint grid','depth effect','background scroll'],
      response:['The blueprint-style background grid on the homepage scrolls at 25% of content speed. The foreground moves at 1x, the grid at 0.25x — creating a subtle sense of depth.','Subtle parallax on the homepage. The grid moves more slowly than the content, making the foreground feel closer. You feel the depth rather than notice it.'],
      navigate:null,options:['Show me Home','Tell me about the design','How was this site built?'],buttons:null,
    },
    {
      id:'action_hiring',label:'Hiring or professional opportunity',enabled:true,priority:0,
      keywords:['hire him','hiring','opportunity','work with him','professional opportunity','collaborate','freelance','job opportunity','recruiter','can i hire','internship','want to work','looking to hire','commission'],
      response:["Manomay is open to interesting opportunities — creative, technical, or collaborative. The Contact page is the right channel. State your intent clearly.","If you're looking to hire or collaborate — Contact page. He reads every message. A clear, specific message gets a response."],
      navigate:null,options:['Open Contact','Download CV','Show me Projects','Show me the CV page'],
      buttons:[{label:'→ Open Contact',href:'#',primary:true},{label:'↓ Download CV',href:'manomay-cv.pdf',download:'Manomay-Misra-CV.pdf'}],
    },
    {
      id:'info_achievements',label:'Achievements and accomplishments',enabled:true,priority:0,
      keywords:['achievements','accomplishments','what has he done','proud of','highlights','best work','biggest achievement','stand out','notable','impressive','most impressive','his wins'],
      response:["Nationals: KVS national-level science exhibition. ISKCON: Creative Educator and Media Lead for 40+ students. This website: built entirely from scratch. And there's more in the pipeline.","The benchmarks: reaching KVS Nationals (2024), leading the ISKCON Camp's media and education (2024), and building this site from zero. The CV has the full picture."],
      navigate:'projects',options:['Show me all Projects','Tell me about Nationals','Download the CV'],buttons:null,
    },
    {
      id:'small_how_are_you',label:'How are you / how is roro',enabled:true,priority:0,
      keywords:["how are you","how are you doing","how is roro","you okay","all good","what's up roro","how do you do","you doing well"],
      response:['Running smoothly. What can I help you with?','Operational and attentive. What are you looking for?','Good — all systems are up. What do you need?','Ready to go. Ask me anything about this site.'],
      navigate:null,options:null,buttons:null,
    },
    {
      id:'small_indian_greeting',label:'Indian greetings',enabled:true,priority:0,
      keywords:['namaste','namaskar','kem cho','kya haal','jai hind','sat sri akal','vanakkam','salam','kaise ho','suprabhat'],
      response:['Hello. What can I help you find?','Hi there. What are you looking for?','Hello — what would you like to know?'],
      navigate:null,options:['Who is Manomay?','Show me Projects','Surprise me'],buttons:null,
    },
    {
      id:'small_goodbye',label:'Goodbye / closing the chat',enabled:true,priority:0,
      keywords:['bye','goodbye','see you','later','take care','good night','good bye','catch you later','ciao','adios','ok bye','bye bye'],
      response:['Goodbye. Come back whenever.','See you.',"I'll be here.",'Good. Come back if you need anything.'],
      navigate:null,options:null,buttons:null,
    },
    {
      id:'small_bored',label:'User is bored',enabled:true,priority:0,
      keywords:["i'm bored","im bored","bored","nothing to do","entertain me","something fun","kill time","boring"],
      response:['The Games page has five fully playable games. That should help.','Snake, Memory Match, 2048, Reaction Time, Word Scramble — all built into this site. Games page.',"Bored? Try clicking Manomay's name on the homepage seven times. Something will happen."],
      navigate:'games',options:['Open Games','Surprise me','Tell me about easter eggs','Play music'],buttons:null,
    },
    {
      id:'small_nice_to_meet',label:'Nice to meet you',enabled:true,priority:0,
      keywords:['nice to meet you','pleasure','good to meet','glad to meet','pleased to meet','happy to meet','good to be here'],
      response:['Likewise. What are you looking for?','Good to have you here. Ask me anything.','Appreciated. What can I help you with?'],
      navigate:null,options:['Who is Manomay?','Show me Projects','Surprise me'],buttons:null,
    },
    {
      id:'info_whatsapp_offline',label:'WhatsApp offline / why no WhatsApp',enabled:true,
      priority:1, /* priority 1 — checked before built-in intents BUT classifier prevents false triggers */
      keywords:['whatsapp','wa','whats app','watsapp','why no whatsapp','whatsapp offline','whatsapp not working','whatsapp disabled','business number','whatsapp number','whatsapp business'],
      response:['WhatsApp Business is being set up — no dedicated business number yet. In the meantime, Instagram or LinkedIn are the best channels.','WhatsApp is temporarily offline. No business number set up yet. Instagram (@m_s_m_2_9) or LinkedIn work well instead.'],
      navigate:null,options:['Show me Instagram','Show me LinkedIn','Open Profiles page'],
      buttons:[{label:'↗ Instagram',href:'https://www.instagram.com/m_s_m_2_9/',primary:true},{label:'↗ LinkedIn',href:'https://www.linkedin.com/in/manomay-shailendra-misra',primary:false}],
    },
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 15 — VISITOR PROFILES
  ═══════════════════════════════════════════════════════════════════════ */
  visitorProfiles: {
    recruiter:   ['Open the CV','Download résumé PDF','See all projects','What achievements stand out?','How to get in touch?'],
    founder:     ["What's been built here?",'How was this site made?','Show me the most ambitious project','What skills does Manomay have?'],
    creative:    ['Show me the photography','What themes are available?','Tell me about the design philosophy','Show me the Traits section'],
    developer:   ['How was this site built?','What tech stack is used?','Show me the projects','Tell me about the easter eggs'],
    teacher:     ['Who is Manomay?','Show the Journey timeline','What projects are completed?','Tell me about the ISKCON camp'],
    friend:      ['Surprise me','Show me the games','What easter eggs are there?','Play some music','Tell me a joke'],
    collaborator:['Show me the projects','How to get in touch?','Download the CV','What skills does Manomay have?'],
    newcomer:    ['Who is Manomay?','What is this site?','Show me the best work','Take me somewhere interesting','What can RoRo do?'],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 16 — SMALL TALK
  ═══════════════════════════════════════════════════════════════════════ */
  smallTalk: {
    morning:['Morning already in motion.','Good time to explore. Or build.','The day hasn\'t decided what it is yet.'],
    evening:['Evening feels quieter here.','The day is softening at its edges.','End-of-day clarity.'],
    night:  ['Late enough to mean something.','The city dims. You stay lit.','After-hours. This is when real things happen.','Most of the city is asleep right now.'],
    general:['Go ahead.','Ask away.','What do you need?',"I'm listening."],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 17 — RESPONSE POOLS
  ═══════════════════════════════════════════════════════════════════════ */
  responses: {
    first_hello:   ['Hello.','Hello there.','Good to have you here.','Hi.','Hey.'],
    first_intro:   ["I'm RoRo — the intelligence layer running this site.","The name's RoRo. I manage everything on this site.","RoRo. I know every corner of this place.","I'm RoRo — your guide through everything here."],
    first_name_q:  ["Before we go further — what should I call you?","One thing first. What's your name?","I like to know who I'm talking to. What do people call you?","What should I call you?"],
    name_ack:      ['Nice to meet you, {n}.', '{n}. Good.', 'Got it — {n}.', "{n}. I'll remember that.", '{n}. Noted.', 'Solid name, {n}.'],
    name_followup: ["Ask me anything about this site. I know all of it.","This place has more layers than it looks. I can guide you through all of it.","I have full access to everything here. Where do you want to start?","Everything here is accessible through me. What do you need?"],
    name_change_ack:['Got it. {n} from now on.',"Done — I'll call you {n}.","{n} it is. I'll use that going forward.",'Switching to {n}. Done.'],
    return_greet:   ['Welcome back, {n}.', "{n}. You're back.", 'Good to see you again, {n}.', 'Back again, {n}.', 'You returned, {n}.', '{n}. Good timing.'],
    return_last_page:['Last time you were exploring {page}.','You left off at {page} last time.','You were on {page} when you last visited.'],
    return_prompt:  ['What would you like to explore today?','Where should we go this time?','What are you looking for?',"What's the plan this time?"],
    nav_confirm:    ['Taking you to {page}.','Opening {page}.', '{page}. On it.', 'Navigating to {page}.', 'Going to {page} now.', '{page}. Here we go.'],
    theme_confirm: {
      dark:  ['Switched to Noir. Deep and cinematic.','Noir mode. Dark, precise.','Noir. Good choice.','Dark mode active.'],
      light: ['Switched to Ivory. Clean and editorial.','Ivory mode. Minimal and bright.','Ivory. Premium aesthetic.','Light mode. Clean.'],
      slate: ['Switched to Slate. Cool and precise.','Slate mode. Technical and calm.','Slate. Clean.','Blue-grey mode active.'],
      forest:['Switched to Forest. Muted and grounded.','Forest mode. Organic, calm.','Forest.','Green mode. Earthy.'],
    },
    theme_already:  ['Already on {theme}. Nothing changed.',"You're already in {theme} mode.",'{theme} is already active.'],
    music_play:     ['Music on.','Playing background ambience.','Audio on.','Music started.','Background track playing.'],
    music_pause:    ['Music paused.','Paused.','Audio off.','Stopped.','Music off.'],
    thanks:         ['Any time.','Of course.',"That's what I'm here for.",'Always.','Sure thing.','Happy to help.'],
    compliment:     ['The credit goes to Manomay.',"I just run the systems. He built everything.","I'll pass that on.","Noted. It's his work — I just know it well.","Glad you noticed. He doesn't cut corners."],
    surprise:       ['Picking somewhere you might not have been.',"Let's go off-script.",'Random destination incoming.','Choosing for you.','Going somewhere interesting.'],
    unknown:        ["That's a bit outside my scope — I'm specifically wired to this site.","I don't have that one. My knowledge is bounded to what's here.","Interesting question. But I'm built for this site, not general conversation.","That's beyond my access."],
    unknown_clarify:["Could you be more specific? Are you asking about a page, a project, or something about Manomay?","I want to help — can you tell me more about what you're looking for?","I'm not sure I followed that. Are you looking for a specific section of the site?"],
    unknown_redir:  ['If you need a real answer, I can route you to the Contact page.',"You could always ask Manomay directly — want me to open Contact?","The Contact form is the right channel for this. Want me to go there?"],
    clear_prompt:   ["I can remove everything I know about you — your name, visit history, preferences. This can't be undone.","This will erase your name, viewed sections, and all stored preferences. Shall I proceed?"],
    clear_confirm:  ['Done. Everything cleared. Fresh start.',"All your data has been removed. You're anonymous again.","Cleared. I won't remember anything about you from this point.",'Wiped clean. You\'re starting fresh.'],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 18 — PROMPT TICKER
  ═══════════════════════════════════════════════════════════════════════ */
  ticker: [
    {text:'Who is Manomay?',cat:'identity'},{text:'What has he built?',cat:'projects'},
    {text:'Open the CV',cat:'nav'},{text:'What skills does Manomay have?',cat:'traits'},
    {text:'Switch to ivory theme',cat:'theme'},{text:'Show me the photography',cat:'nav'},
    {text:'Download the résumé PDF',cat:'cv'},{text:'Tell me about the ISKCON project',cat:'projects'},
    {text:'Show me LinkedIn',cat:'social'},{text:'Tell me about 2024',cat:'journey'},
    {text:'Play background music',cat:'music'},{text:'How do I get the password?',cat:'password'},
    {text:'What games are built into this site?',cat:'games'},{text:'Tell me about the Nationals project',cat:'projects'},
    {text:'Open the Thoughts section',cat:'nav'},{text:"What's Manomay's philosophy?",cat:'identity'},
    {text:'Show me the timeline',cat:'journey'},{text:'Switch to dark mode',cat:'theme'},
    {text:'Who should I contact?',cat:'contact'},{text:'Surprise me',cat:'explore'},
    {text:'How was this site built?',cat:'site'},{text:'What books does Manomay recommend?',cat:'lists'},
    {text:'Tell me about the easter eggs',cat:'explore'},{text:'Show me the social profiles',cat:'nav'},
    {text:'What college does he go to?',cat:'identity'},{text:'Show me Instagram',cat:'social'},
    {text:'Tell me about the cursor',cat:'features'},{text:'Switch to forest theme',cat:'theme'},
    {text:'What are his hobbies?',cat:'identity'},{text:'Open Games',cat:'nav'},
    {text:'Does he know Python?',cat:'recruiter'},{text:'Tell me a joke',cat:'casual'},
    {text:'What is Ferrari?',cat:'general'},{text:'Tell me about 2008',cat:'journey'},
    {text:'Can he intern?',cat:'recruiter'},{text:'What is this website?',cat:'site'},
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 19 — SETTINGS
  ═══════════════════════════════════════════════════════════════════════ */
  settings: {
    memory:{expiryDays:90},
    idle:{idleMinutes:3,offlineMinutes:6,checkEveryMs:20000},
    typing:{minDelay:380,maxDelayMs:2000,charMultiplier:12,speedMs:9,randomMs:18},
    ticker:{scrollSeconds:60},
  },

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION 20 — ANALYTICS CONFIG  (NEW in v4.0)
     Stores unknown queries, internet searches, recruiter queries.
     Viewable from admin panel. Written to by roro-intelligence.js.
  ═══════════════════════════════════════════════════════════════════════ */
  analytics: {
    unknownLog:   [],  /* auto-populated by SessionMemory.logUnknown()   */
    internetLog:  [],  /* auto-populated by SessionMemory.logInternet()  */
    recruiterLog: [],  /* auto-populated by SessionMemory.logRecruiter() */
    /* To view analytics in browser console: */
    /* window.RoRoIntelligence.SessionMemory.getAnalytics() */
  },

}; /* ═══ end window.RORO_CONFIG ════════════════════════════════════════ */
