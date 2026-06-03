/* ═══════════════════════════════════════════════════════════════════
   js/bot/roro-intelligence.js  —  RoRo Intelligence Layer v2.0

   Systems inside this file:
   ─────────────────────────────────────────────────────────────────
   TypoCorrector   Fixes misspellings + translates Hinglish
   EntityExtractor Identifies what the message is about
   Classifier      Categorises input before any engine runs
   WebsiteSearch   Full-text retrieval across ALL KB data
   RecruiterEngine Handles professional/hiring/skill questions
   CasualEngine    Small talk, jokes, food, personal questions
   GeneralKnowledge Inline facts + dispatches to internet
   SessionMemory   Anti-loop, pronoun resolution, analytics
   KnowledgeGraph  Entity relationships for context
   ─────────────────────────────────────────────────────────────────
   Search priority enforced by manager-roro.js:
   1 Website KB  2 Recruiter KB  3 Session  4 Context
   5 Inline GK   6 Internet      7 Unknown
   ─────────────────────────────────────────────────────────────────
   Exports: window.RoRoIntelligence
   Load order: roro-safety.js → roro-web.js → roro-intelligence.js → manager-roro.js
═══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ══════════════════════════════════════════════════════════════
   TYPO CORRECTOR + HINGLISH TRANSLATOR
   Runs on every input before classification.
   Fixes misspellings. Maps Hinglish phrases to English equivalents.
   Does NOT change the displayed user message — only used internally.
══════════════════════════════════════════════════════════════ */
const TypoCorrector = {
  TYPOS: {
    'manomya':'manomay','manomai':'manomay','manomaay':'manomay','manomayy':'manomay',
    'maomay':'manomay','mnaomay':'manomay','monmay':'manomay','manoamay':'manomay',
    'portfolia':'portfolio','portfollio':'portfolio','portfoio':'portfolio','portfoilio':'portfolio',
    'projcts':'projects','projecrt':'projects','pojects':'projects','projets':'projects','proects':'projects',
    'websit':'website','webiste':'website','websitee':'website','webite':'website','webisite':'website',
    'phoot':'photo','photoo':'photo','phooto':'photo','potho':'photo','phto':'photo',
    'qualificatsation':'qualification','qualifcation':'qualification','qualifiation':'qualification',
    'achievemnts':'achievements','achievments':'achievements','achivements':'achievements',
    'expereince':'experience','experince':'experience','experiece':'experience','exprience':'experience',
    'educaton':'education','eductaion':'education','educaiton':'education','eduation':'education',
    'skillss':'skills','skils':'skills','skiils':'skills','sklls':'skills',
    'intrenship':'internship','intenship':'internship','internhsip':'internship','internsihp':'internship',
    'linekdin':'linkedin','linkdin':'linkedin','linkedni':'linkedin','lnkedin':'linkedin',
    'insatgram':'instagram','isntagram':'instagram','instagarm':'instagram','isntgram':'instagram',
    'gihub':'github','githb':'github','gituhb':'github','gthub':'github',
    'pyhton':'python','pytohn':'python','phyton':'python','pyton':'python','pthon':'python',
    'javascrpit':'javascript','javasript':'javascript','javscript':'javascript',
    'formuls':'formula','formulsa':'formula','naem':'name','nmae':'name',
    'contcat':'contact','cnotact':'contact','conatct':'contact',
    'proejct':'project','prject':'project','rpojest':'project',
    'thinsk':'thinks','thigns':'things','hsi':'his','knwos':'knows','konws':'knows',
    'waht':'what','whta':'what','waht':'what','hwo':'how','woh':'who',
  },
  HINGLISH: {
    'manomay kaun hai':           'who is manomay',
    'ye website kisne banayi':    'who built this website',
    'ye website kya hai':         'what is this website',
    'kya vo python janta hai':    'does he know python',
    'kya he knows python':        'does he know python',
    'kya internship karega':      'will he intern',
    'kya vo hire hoga':           'is he available for hire',
    'uski age kya hai':           'what is his age',
    'uska kaam kya hai':          'what is his work',
    'projects dikhao':            'show me projects',
    'cv dikhao':                  'show me cv',
    'kya kaam kiya':              'what work has he done',
    'kahan rehta hai':            'where does he live',
    'kahan se hai':               'where is he from',
    'kitne saal ka hai':          'how old is he',
    'can he relocate ya nahi':    'can he relocate',
    'who is manomay bhai':        'who is manomay',
    'bhai kaun hai':              'who is this person',
    'kya kaata':                  'what does he do',
    'website kisne banaya':       'who made this website',
    'iska kya kaam hai':          'what does he do',
    'wo kya karta hai':           'what does he do',
    'kya sikha hai':              'what has he learned',
    'koi kaam kiya':              'what work has he done',
    'koi project hai':            'does he have projects',
    'python aata hai':            'does he know python',
    'javascript aata hai':        'does he know javascript',
    'html aata hai':              'does he know html',
    'coding aata hai':            'does he know coding',
  },
  correct(text){
    if(!text) return text;
    let lower = text.toLowerCase().trim();
    for(const [phrase, rep] of Object.entries(this.HINGLISH)){
      if(lower.includes(phrase)) lower = lower.replace(phrase, rep);
    }
    const words = lower.split(/\s+/);
    return words.map(w => this.TYPOS[w] || w).join(' ');
  },
};

/* ══════════════════════════════════════════════════════════════
   ENTITY EXTRACTOR
   Identifies what entities the message refers to.
   Guides the search focus before KB lookup begins.
══════════════════════════════════════════════════════════════ */
const EntityExtractor = {
  ENTITIES: {
    'manomay':    {type:'person',  id:'owner'},
    'msm':        {type:'person',  id:'owner'},
    'nationals':  {type:'project', id:'nationals'},
    'iskcon':     {type:'project', id:'iskcon'},
    'iskon':      {type:'project', id:'iskcon'},
    'ecommerce':  {type:'project', id:'ecommerce'},
    'bullet':     {type:'project', id:'writing'},
    'snake':      {type:'game',    id:'games'},
    '2048':       {type:'game',    id:'games'},
    'memory match':{type:'game',   id:'games'},
    'word scramble':{type:'game',  id:'games'},
    'journey':    {type:'page',    id:'journey'},
    'timeline':   {type:'page',    id:'journey'},
    'photography':{type:'skill',   id:'photography'},
    'html':       {type:'skill',   id:'html'},
    'css':        {type:'skill',   id:'css'},
    'javascript': {type:'skill',   id:'javascript'},
    'python':     {type:'skill',   id:'python'},
    'sql':        {type:'skill',   id:'sql'},
    'react':      {type:'skill',   id:'react'},
    'ferrari':    {type:'external',id:'ferrari'},
    'bmw':        {type:'external',id:'bmw'},
    'mercedes':   {type:'external',id:'mercedes'},
    'tesla':      {type:'external',id:'tesla'},
    'apple':      {type:'external',id:'apple'},
    'google':     {type:'external',id:'google'},
    'microsoft':  {type:'external',id:'microsoft'},
    'amazon':     {type:'external',id:'amazon'},
    'nasa':       {type:'external',id:'nasa'},
    'chatgpt':    {type:'external',id:'chatgpt'},
    'openai':     {type:'external',id:'openai'},
    'elon musk':  {type:'external',id:'elonmusk'},
    'india':      {type:'external',id:'india'},
    'bengaluru':  {type:'place',   id:'bengaluru'},
    'mumbai':     {type:'place',   id:'mumbai'},
    'jaipur':     {type:'place',   id:'jaipur'},
  },
  extract(text){
    const lower = text.toLowerCase();
    const found = [];
    for(const [kw,entity] of Object.entries(this.ENTITIES)){
      if(lower.includes(kw)) found.push({kw,...entity});
    }
    return found;
  },
  hasExternalOnly(entities){
    return entities.length > 0 && entities.every(e => e.type === 'external');
  },
  hasWebsiteEntity(entities){
    return entities.some(e => e.type !== 'external');
  },
};

/* ══════════════════════════════════════════════════════════════
   CLASSIFIER
   Runs after TypoCorrector. Determines what category the message
   belongs to. This drives which engine handles the response.
   Category determines search priority.
══════════════════════════════════════════════════════════════ */
const Classifier = {
  P: {
    JOKE:[
      /\b(tell\s+(me\s+)?a?\s*joke|got\s+any\s+jokes|make\s+me\s+laugh|joke\s+please|funny\s+joke|crack\s+a\s+joke|be\s+funny)\b/i,
    ],
    GREETING:[
      /^(hi+|hello+|hey+|sup|yo+|howdy|hola|greetings|good\s+(morning|afternoon|evening|night|day)|what'?s\s+up|wassup|namaste|namaskar|kem\s+cho|sat\s+sri\s+akal|vanakkam|salam|kaise\s+ho|jai\s+hind|assalamu|salaam)[!\s?.,]*$/i,
    ],
    MATH:[
      /^[\d\s\+\-\*\/\.\(\)%\^]+[\=\?]?\s*$/,
      /\b(what\s+is|calculate|compute|how\s+much\s+is|solve)\s+[\d\s\+\-\*\/\.\(\)^]+/i,
    ],
    CASUAL_CHAT:[
      /\b(how\s+are\s+you|how\s+is\s+roro|are\s+you\s+ok|what\s+are\s+you|who\s+are\s+you|tell\s+me\s+about\s+yourself)\b/i,
      /\b(do\s+you\s+(like|eat|enjoy|have|watch|play|drink|prefer)|have\s+you\s+(eaten|tried|watched|played))\b/i,
      /\b(pizza|burger|sushi|pasta|biryani|curry|coffee|tea|ramen|sandwich|dosa|chai|naan|food|dinner|lunch|breakfast)\b/i,
      /\b(are\s+you\s+busy|what\s+are\s+you\s+doing|do\s+you\s+sleep|do\s+you\s+dream|favourite|favorite)\b/i,
      /\b(i\s+(love|hate|enjoy|prefer|like)\s+(?!manomay|this\s+site|the\s+site|your\s+site))\b/i,
    ],
    RECRUITER_QUESTION:[
      /\b(does\s+he\s+know|can\s+he\s+(use|do|code|write|build|handle|work\s+with)|is\s+he\s+(good\s+at|experienced|familiar\s+with))\b/i,
      /\b(hire|hiring|recruit|internship|intern|full.?time|part.?time|job|position|role|salary|package|available\s+for|looking\s+to\s+hire)\b/i,
      /\b(remote\s*(work)?|relocat|wfh|work\s+from\s+home)\b/i,
      /\b(what\s+(technologies|skills|languages|tools|frameworks)\s+(does\s+he|can\s+he|he\s+know))\b/i,
      /\b(graduation|graduate|when\s+does\s+he\s+finish|expected\s+completion|qualification|degree)\b/i,
      /\b(leadership|led\s+(a\s+)?team|managed|project\s+lead|what\s+makes\s+him\s+(different|stand\s+out|unique|special))\b/i,
      /\b(python|sql|react|node\.?js|django|flask|mongodb|postgresql|aws|docker|kubernetes|java\b|php\b|ruby\b|golang|swift\b|kotlin\b|typescript)\b/i,
    ],
    WEBSITE_QUESTION:[
      /\b(manomay|this\s+(website|site|page|portfolio)|the\s+website|this\s+portfolio|your\s+site)\b/i,
      /\b(project|journey|skills?|traits|games?|photos?|albums?|thoughts?|beliefs?|contact|lists?|profiles?|cv|resume)\b/i,
      /\b(password|locked|private|access|unlock|how\s+(do\s+i|to)\s+(get|find|access|open|view))\b/i,
      /\b(theme|dark|ivory|noir|slate|forest|music|easter\s+egg|vinyl|cursor|sidebar|roro|animation|parallax|reel)\b/i,
      /\b(born|birthday|age|nationality|city|lived|nomadic|college|education|school|studying)\b/i,
      /\b(built|made|stack|technology|framework|vanilla\s+js|html|css|javascript|how\s+was\s+this)\b/i,
      /\b(what\s+is\s+(the\s+)?(website|site|this|portfolio))\b/i,
      /\b(snake\s+game|memory\s+game|word\s+scramble|reaction\s+time|2048)\b/i,
    ],
    GENERAL_KNOWLEDGE:[
      /\b(ferrari|bmw|mercedes|tesla|apple|google|microsoft|amazon|meta|netflix|nasa|openai|chatgpt)\b/i,
      /\b(elon\s+musk|steve\s+jobs|mark\s+zuckerberg|bill\s+gates|jeff\s+bezos)\b/i,
      /\b(india|pakistan|china|usa|america|england|britain|france|germany|japan|australia|russia)\b/i,
      /\b(history\s+of|geography|explain\s+\w{4}|what\s+is\s+(a\s+)?(blockchain|ai|machine\s+learning|crypto|nft))\b/i,
    ],
  },
  classify(text){
    const corrected = TypoCorrector.correct(text);
    const entities  = EntityExtractor.extract(corrected);
    if(EntityExtractor.hasExternalOnly(entities)){
      return {type:'GENERAL_KNOWLEDGE', confidence:0.9, corrected, entities};
    }
    const order = ['JOKE','GREETING','MATH','CASUAL_CHAT','RECRUITER_QUESTION','WEBSITE_QUESTION','GENERAL_KNOWLEDGE'];
    for(const cat of order){
      for(const p of (this.P[cat]||[])){
        if(p.test(corrected)) return {type:cat, confidence:0.82, corrected, entities};
      }
    }
    if(EntityExtractor.hasWebsiteEntity(entities)){
      return {type:'WEBSITE_QUESTION', confidence:0.65, corrected, entities};
    }
    if(corrected.trim().split(/\s+/).length <= 2){
      return {type:'SHORT_UNKNOWN', confidence:0.3, corrected, entities};
    }
    return {type:'UNKNOWN', confidence:0.2, corrected, entities};
  },
};

/* ══════════════════════════════════════════════════════════════
   WEBSITE SEARCH ENGINE
   Builds a flat scored index from ALL KB data on first call.
   Index is cached and rebuilt only when KB structure changes.
   Returns ranked {score, doc} array.
══════════════════════════════════════════════════════════════ */
const WebsiteSearch = {
  _index: null,
  _hash:  '',

  _build(KB){
    const docs = [];
    const o = KB.owner || {};
    docs.push({type:'owner',id:'identity',w:2.5,
      text:[o.name,o.shortName,o.born,o.birthplace,o.city,o.tagline,o.description,o.philosophy,
            o.workStyle,o.goals,o.contact,(o.traits||[]).join(' '),(o.inspirations||[]).join(' ')].join(' '),
      data:o});
    for(const [id,pg] of Object.entries(KB.pages||{})){
      docs.push({type:'page',id,w:1.2,
        text:`${pg.label} ${pg.summary} ${(pg.features||[]).join(' ')}`,data:pg});
    }
    for(const [id,pr] of Object.entries(KB.projects||{})){
      docs.push({type:'project',id,w:2,
        text:`${pr.title} ${pr.description} ${pr.status} ${pr.type} ${(pr.keywords||[]).join(' ')}`,data:pr});
    }
    for(const [yr,txt] of Object.entries(KB.years||{})){
      docs.push({type:'year',id:String(yr),w:1,
        text:`${yr} ${txt} year journey timeline chapter`,data:{year:yr,text:txt}});
    }
    for(const [key,ans] of Object.entries(KB.faq||{})){
      docs.push({type:'faq',id:key,w:1.6,
        text:`${key.replace(/_/g,' ')} ${ans}`,data:{question:key,answer:ans}});
    }
    for(const [key,desc] of Object.entries(KB.features||{})){
      docs.push({type:'feature',id:key,w:1.2,
        text:`${key} feature ${desc}`,data:{feature:key,description:desc}});
    }
    const d = KB.design||{};
    docs.push({type:'design',id:'design',w:1.2,
      text:`design built stack technology html css javascript vanilla ${d.summary||''} ${d.philosophy||''} ${(d.stack||[]).join(' ')}`,data:d});
    const pw = KB.password||{};
    docs.push({type:'password',id:'password',w:1,
      text:`password locked private access ${pw.hint||''} ${(pw.lockedSections||[]).join(' ')}`,data:pw});
    return docs;
  },

  _tok(str){
    return (str||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>1);
  },

  _scoreDoc(doc, qt){
    const dt = this._tok(doc.text);
    let s = 0;
    for(const q of qt){
      for(const d of dt){
        if(d===q){s+=10;continue;}
        if(d.startsWith(q)||q.startsWith(d)){
          if(Math.min(d.length,q.length)>=3) s+=5;
          continue;
        }
        if(q.length>3&&d.length>3&&(d.includes(q)||q.includes(d))){s+=3;}
      }
    }
    return s * (doc.w||1);
  },

  search(query, KB, topN){
    topN = topN||3;
    if(!KB) return [];
    const hash = Object.keys(KB.pages||{}).sort().join(',').slice(0,60);
    if(!this._index || this._hash!==hash){
      this._index = this._build(KB);
      this._hash  = hash;
    }
    const qt = this._tok(query);
    if(!qt.length) return [];
    return this._index
      .map(doc=>({score:this._scoreDoc(doc,qt),doc}))
      .filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score)
      .slice(0,topN);
  },

  composeAnswer(query, results){
    if(!results||!results.length) return null;
    const top = results[0];
    if(top.score < 8) return null;
    const doc = top.doc;
    const conf = Math.min(top.score/65, 1);
    switch(doc.type){
      case 'owner':{
        const o = doc.data;
        return {messages:[`${o.name} — born ${o.born} in ${o.birthplace}.`,o.description,`"${o.philosophy}"`],
          options:['Show me Identity','Show me Projects','Show me the Journey'],confidence:conf};
      }
      case 'page':{
        const pg = doc.data;
        return {messages:[`${pg.label}: ${pg.summary}`],navigate:doc.id,
          options:[`Explore ${pg.label}`,'Show me something else'],confidence:conf};
      }
      case 'project':{
        const pr = doc.data;
        return {messages:[`${pr.title} — ${pr.type}.`,pr.description,`Status: ${pr.status}`],
          options:['Show me all Projects','Tell me about another project'],confidence:conf};
      }
      case 'year':{
        const yr = doc.data;
        return {messages:[`${yr.year} — ${yr.text}`,'See the full timeline on the Journey page.'],
          options:['Show me the Journey','Tell me about another year'],confidence:conf};
      }
      case 'faq':
        return {messages:[doc.data.answer],confidence:conf};
      case 'feature':
        return {messages:[doc.data.description],
          options:['Tell me about another feature','Show me the site'],confidence:conf};
      case 'design':{
        const dd = doc.data;
        return {messages:[dd.summary,`Stack: ${(dd.stack||[]).slice(0,3).join(', ')}.`],
          options:['Switch to ivory theme','Show me Projects'],confidence:conf};
      }
      case 'password':
        return {messages:['Several sections carry a password lock.',doc.data.hint,
          `Locked: ${(doc.data.lockedSections||[]).slice(0,3).join(', ')}, and more.`],
          options:['Take me to Contact','Who is Manomay?'],confidence:conf};
      default: return null;
    }
  },
};

/* ══════════════════════════════════════════════════════════════
   RECRUITER ENGINE
   Handles professional / hiring / technical skill questions.
   Skill knowledge map is standalone — doesn't need KB skills data.
══════════════════════════════════════════════════════════════ */
const RecruiterEngine = {
  SKILLS:{
    'html':       {has:true, level:'advanced', note:'The entire site is hand-coded vanilla HTML.'},
    'css':        {has:true, level:'advanced', note:'All animations, themes, and layouts — hand-written from scratch.'},
    'javascript': {has:true, level:'advanced', note:'Pure vanilla JS throughout. No frameworks, no libraries.'},
    'js':         {has:true, level:'advanced', note:'Pure vanilla JavaScript. Zero frameworks.'},
    'vanilla js': {has:true, level:'advanced', note:'The deliberate choice. Strong fundamentals over shortcuts.'},
    'vanilla':    {has:true, level:'advanced', note:'Entire site is vanilla HTML, CSS, and JavaScript.'},
    'git':        {has:true, level:'working',  note:'Uses Git for version control.'},
    'github':     {has:true, level:'working',  note:'Active GitHub: github.com/m-s-m-2-9'},
    'design':     {has:true, level:'strong',   note:'The portfolio itself is the evidence of his design sensibility.'},
    'photography':{has:true, level:'practiced',note:'Led photography and videography at the ISKCON Summer Camp (2024).'},
    'video':      {has:true, level:'some',     note:'Vlog production at ISKCON Camp 2024.'},
    'emailjs':    {has:true, level:'used',     note:'Contact form powered by EmailJS.'},
    'web audio':  {has:true, level:'used',     note:'Background music via Web Audio API.'},
    'localstorage':{has:true,level:'used',     note:'Session memory and visitor data via localStorage.'},
    'python':     {has:false,level:'not listed',note:null},
    'sql':        {has:false,level:'not listed',note:null},
    'react':      {has:false,level:'not used', note:'He deliberately avoids frameworks to build from first principles.'},
    'vue':        {has:false,level:'not used', note:null},
    'angular':    {has:false,level:'not used', note:null},
    'java':       {has:false,level:'not listed',note:null},
    'php':        {has:false,level:'not listed',note:null},
    'typescript': {has:false,level:'not listed',note:null},
    'nodejs':     {has:false,level:'not listed',note:null},
    'node':       {has:false,level:'not listed',note:null},
    'django':     {has:false,level:'not listed',note:null},
    'flask':      {has:false,level:'not listed',note:null},
    'mongodb':    {has:false,level:'not listed',note:null},
    'postgresql': {has:false,level:'not listed',note:null},
    'aws':        {has:false,level:'not listed',note:null},
    'docker':     {has:false,level:'not listed',note:null},
    'kubernetes': {has:false,level:'not listed',note:null},
    'kotlin':     {has:false,level:'not listed',note:null},
    'swift':      {has:false,level:'not listed',note:null},
    'golang':     {has:false,level:'not listed',note:null},
  },
  P:{
    education: /\b(college|university|bba|don\s+bosco|studying|degree|enrolled|bachelor|business\s+analytics|graduation|graduate|when\s+does\s+he\s+finish)\b/i,
    hire:      /\b(hire|recruit|job|internship|available|opportunity|position|role|work\s+with|contract|freelance|commission)\b/i,
    remote:    /\b(remote|work\s+from\s+home|relocation|relocate|wfh)\b/i,
    leadership:/\b(leadership|led|managed|team\s+lead|mentor|project\s+management|what\s+makes\s+him\s+(different|stand\s+out|unique|special))\b/i,
    achieve:   /\b(achievements?|accomplishments?|what\s+has\s+he\s+done|stand\s+out|impressive|highlights|wins?|best\s+project|biggest\s+achievement)\b/i,
    internship:/\b(intern|internship|can\s+he\s+intern|will\s+he\s+intern|available\s+for\s+internship)\b/i,
  },
  handle(text, KB){
    const lower = text.toLowerCase();
    for(const [skill,info] of Object.entries(this.SKILLS)){
      if(!lower.includes(skill)) continue;
      if(info.has){
        return {
          messages:[`Yes — ${skill.toUpperCase()} is at ${info.level} level.${info.note?' '+info.note:''}`],
          options:['See all Projects','Download CV','What other skills does he have?'],
        };
      } else {
        return {
          messages:[`${skill.toUpperCase()} isn't in the current skill set.${info.note?' '+info.note:''}`,
            'The Traits and CV pages have the full picture.'],
          options:['Open Traits','Download CV'],
        };
      }
    }
    if(this.P.education.test(lower)){
      const col = (KB.faq&&KB.faq.college)||'Currently pursuing BBA with Business Analytics at Don Bosco College, Bengaluru. Started 2026.';
      return {messages:[col],options:['Download CV','Show me Projects','What skills does he have?']};
    }
    if(this.P.hire.test(lower)||this.P.internship.test(lower)){
      return {
        messages:['Manomay is open to creative, technical, or collaborative opportunities.','Contact page is the right channel — he reads every message.'],
        buttons:[{label:'→ Open Contact',href:'#',primary:true},{label:'↓ Download CV',href:(KB.social&&KB.social.cv&&KB.social.cv.url)||'manomay-cv.pdf',download:'Manomay-Misra-CV.pdf'}],
        options:['Show me Projects','Show me the CV page'],
      };
    }
    if(this.P.remote.test(lower)){
      return {messages:['No location restriction is specified. Best to ask directly via the Contact page.'],options:['Open Contact','Download CV']};
    }
    if(this.P.leadership.test(lower)||this.P.achieve.test(lower)){
      return {
        messages:['Two notable leadership roles: Creative Educator and Media Lead at the ISKCON Summer Camp (40+ students, 2024) and leading a project team to KVS Nationals.','Full details in the Projects section.'],
        options:['Show me Projects','Tell me about ISKCON','Tell me about Nationals','Download CV'],
      };
    }
    return null;
  },
};

/* ══════════════════════════════════════════════════════════════
   CASUAL ENGINE
   Small talk, jokes, food, personal questions about RoRo.
   Never navigates. Never triggers site actions.
══════════════════════════════════════════════════════════════ */
const CasualEngine = {
  JOKES:[
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "I told my computer I needed a break. Now it keeps sending me Kit-Kat ads.",
    "Why don't scientists trust atoms? Because they make up everything.",
    "What do you call a fake noodle? An impasta.",
    "Why did the scarecrow win an award? He was outstanding in his field.",
    "I'm reading a book about anti-gravity. It's impossible to put down.",
    "Why did the bicycle fall over? Because it was two-tired.",
    "What do you get when you cross a snowman and a vampire? Frostbite.",
    "I asked the librarian if the library had books about paranoia. She whispered: 'They're right behind you.'",
    "Parallel lines have so much in common. It's a shame they'll never meet.",
    "Why can't a bicycle stand on its own? Because it's two-tired.",
    "I only know 25 letters of the alphabet. I don't know y.",
    "What do you call a parade of rabbits hopping backwards? A receding hare-line.",
  ],
  HOW_ARE_YOU:[
    "Running smoothly. What can I help you with?",
    "All systems up. What do you need?",
    "Operational and attentive. Ask away.",
    "Good — ready to help. What are you looking for?",
  ],
  WHO_ARE_YOU:[
    "I'm RoRo — the intelligence layer built into this site. I help visitors explore Manomay's portfolio, projects, and story.",
    "RoRo. I run the intelligence layer for this site — navigation, knowledge retrieval, and general questions all go through me.",
    "I'm RoRo, the website assistant for Manomay's portfolio. Think of me as the front desk for everything here.",
  ],
  FOOD:[
    (f)=>`I don't actually eat ${f}. I'm RoRo, the website assistant. I mainly help visitors explore Manomay's projects and story.`,
    (f)=>`No digestive system — so ${f} is out. Happy to help with anything about the site though.`,
    (f)=>`${f} sounds good but I'll pass — I'm a website assistant, not a food critic. What else can I help with?`,
  ],
  GENERAL:[
    "I'm mostly wired for questions about Manomay and this portfolio. Happy to help with those.",
    "That's a bit outside my lane — I'm website-specific. What would you like to know about the site?",
    "I can try, but my best use is for questions about Manomay's work and website.",
  ],
  handle(text, cls){
    const lower = text.toLowerCase();
    if(cls.type==='JOKE'){
      const j = this.JOKES[Math.floor(Math.random()*this.JOKES.length)];
      return {messages:[j],options:['Tell me another one','Who is Manomay?','Show me Projects']};
    }
    if(/\b(how\s+are\s+you|how\s+is\s+roro|are\s+you\s+ok|you\s+alright|how'?s\s+it\s+going)\b/i.test(lower)){
      return {messages:[this.HOW_ARE_YOU[Math.floor(Math.random()*this.HOW_ARE_YOU.length)]],options:['Who is Manomay?','Show me Projects']};
    }
    if(/\b(who\s+are\s+you|what\s+are\s+you|tell\s+me\s+about\s+yourself|about\s+roro|what\s+is\s+roro|are\s+you\s+an\s+ai)\b/i.test(lower)){
      return {messages:[this.WHO_ARE_YOU[Math.floor(Math.random()*this.WHO_ARE_YOU.length)]],options:['What can you do?','Who is Manomay?']};
    }
    const fm = lower.match(/\b(pizza|burger|sushi|pasta|biryani|curry|chocolate|ice\s*cream|coffee|tea|ramen|sandwich|dosa|chai|naan|pav\s+bhaji|samosa|momos)\b/i);
    if(fm){
      const fn = this.FOOD[Math.floor(Math.random()*this.FOOD.length)];
      return {messages:[fn(fm[1])],options:['Tell me about Manomay','Show me Projects']};
    }
    if(/\b(what\s+are\s+you\s+doing|are\s+you\s+busy|are\s+you\s+free|do\s+you\s+sleep|do\s+you\s+dream|can\s+you\s+feel)\b/i.test(lower)){
      return {messages:["Busy helping visitors explore the site. What can I help you with?"],options:['Who is Manomay?','Show me Projects']};
    }
    if(/\b(favourite|favorite|do\s+you\s+(like|enjoy|watch|read|play|listen))\b/i.test(lower)){
      return {messages:["I don't have personal preferences — I'm a website assistant. But Manomay does. The Lists and Traits pages have his curated tastes."],options:['Open Lists','Open Traits']};
    }
    return {messages:[this.GENERAL[Math.floor(Math.random()*this.GENERAL.length)]],options:['Who is Manomay?','Show me Projects','Surprise me']};
  },
};

/* ══════════════════════════════════════════════════════════════
   GENERAL KNOWLEDGE ENGINE
   Inline facts for instant answers (no internet).
   Returns null if not found → manager dispatches to RoRoWeb.
══════════════════════════════════════════════════════════════ */
const GeneralKnowledge = {
  INLINE:{
    'ferrari':              'Ferrari is an Italian luxury sports car manufacturer founded by Enzo Ferrari in 1939. Known for high-performance vehicles and Formula 1 racing.',
    'bmw':                  'BMW (Bayerische Motoren Werke) is a German luxury automobile and motorcycle company founded in 1916.',
    'mercedes':             'Mercedes-Benz is a German luxury automobile brand under Daimler AG. One of the oldest and most recognised car manufacturers in the world.',
    'tesla':                'Tesla is an American electric vehicle and clean energy company founded in 2003. Known for the Model S, Model 3, and Autopilot technology.',
    'apple':                'Apple Inc. is an American technology company known for the iPhone, Mac, and iOS ecosystem. Founded 1976 by Steve Jobs and Steve Wozniak.',
    'google':               'Google is an American technology company specialising in internet services, search, and advertising. Part of Alphabet Inc. since 2015.',
    'microsoft':            'Microsoft is an American technology company founded 1975 by Bill Gates and Paul Allen. Known for Windows, Office, Azure, and Xbox.',
    'amazon':               'Amazon is a US multinational focused on e-commerce, cloud computing (AWS), and digital streaming. Founded by Jeff Bezos in 1994.',
    'nasa':                 'NASA is the US government space agency, founded 1958. Responsible for the Apollo missions, the ISS, Mars rovers, and the Artemis programme.',
    'python':               'Python is a high-level, general-purpose programming language known for its readability. Widely used in data science, AI, web development, and scripting.',
    'javascript':           'JavaScript is the primary programming language of the web browser. Enables interactive websites. Also runs on servers via Node.js.',
    'html':                 'HTML (HyperText Markup Language) is the standard markup language for web pages. Defines structure and content.',
    'css':                  'CSS (Cascading Style Sheets) describes how HTML elements are visually displayed. Controls layout, colours, fonts, and animations.',
    'artificial intelligence': 'AI is the simulation of human intelligence in machines — enabling learning, reasoning, vision, and language understanding.',
    'machine learning':     'Machine learning is a subset of AI where systems learn from data to improve performance without explicit programming.',
    'blockchain':           'Blockchain is a distributed ledger technology recording transactions across multiple computers. Foundation of Bitcoin and other cryptocurrencies.',
    'chatgpt':              'ChatGPT is an AI chatbot developed by OpenAI, launched in 2022. Based on GPT large language models.',
    'openai':               'OpenAI is an AI research company founded in 2015. Known for GPT models, ChatGPT, and DALL-E. Backed by Microsoft.',
    'elon musk':            'Elon Musk is a South African-born entrepreneur. CEO of Tesla and SpaceX, owner of X (formerly Twitter).',
    'steve jobs':           'Steve Jobs (1955–2011) co-founded Apple Inc. Known for the iPhone, Mac, and iPod. Regarded as a visionary in consumer technology.',
    'india':                'India is a South Asian country with 1.4+ billion people — the world\'s most populous nation. 7th largest by area.',
    'mumbai':               'Mumbai is India\'s financial capital and most populous city, on the western coast in Maharashtra state.',
    'bengaluru':            'Bengaluru (Bangalore) is the capital of Karnataka, India. Known as the Silicon Valley of India for its thriving tech industry.',
    'jaipur':               'Jaipur is the capital of Rajasthan, India. Known as the Pink City for its rose-coloured heritage buildings.',
    'maharashtra':          'Maharashtra is a state in western India. Home to Mumbai. One of India\'s most economically significant states.',
    'karnataka':            'Karnataka is a state in southwestern India. Capital is Bengaluru. Known for its software industry, temples, and coffee.',
    'instagram':            'Instagram is a photo and video sharing social network owned by Meta. Founded 2010, acquired by Facebook in 2012.',
    'linkedin':             'LinkedIn is a professional networking platform owned by Microsoft. Used for job searching, recruiting, and business networking.',
    'github':               'GitHub is a code hosting platform owned by Microsoft. Enables version control and collaboration for software projects.',
    'twitter':              'X (formerly Twitter) is a social media platform founded in 2006. Known for short posts called tweets.',
  },
  cap(text, n){
    n = n||50;
    if(!text) return '';
    const w = text.trim().split(/\s+/);
    return w.length<=n ? text.trim() : w.slice(0,n).join(' ')+'\u2026';
  },
  getInline(query){
    const lower = query.toLowerCase();
    for(const [key,val] of Object.entries(this.INLINE)){
      if(lower.includes(key)) return val;
    }
    return null;
  },
  buildResponse(fact, isInternet){
    return {
      messages:[this.cap(fact,50), "I'm mainly here to help with Manomay and the website."],
      options:['Who is Manomay?','Show me Projects','Surprise me'],
      confidence: isInternet ? 0.7 : 0.9,
    };
  },
};

/* ══════════════════════════════════════════════════════════════
   SESSION MEMORY
   Tracks conversation context during the visit.
   Improves pronoun resolution and topic continuity.
   Anti-loop prevents repeating the same response.
   Analytics logging for admin panel.
══════════════════════════════════════════════════════════════ */
const SessionMemory = {
  visitedPages:    [],
  discussedTopics: [],
  lastEntities:    [],
  lastTopic:       null,
  visitorType:     'newcomer',
  messageCount:    0,
  recruiterSignals:0,

  /* Anti-loop: track last 30 response keys */
  _recent:     [],
  MAX_RECENT:  30,

  /* Admin analytics logs */
  unknownQueries:   [],
  lowConfidence:    [],
  recruiterQueries: [],
  internetSearches: [],

  addTopic(topic){
    if(!topic) return;
    this.lastTopic = topic;
    if(!this.discussedTopics.includes(topic)){
      this.discussedTopics.unshift(topic);
      if(this.discussedTopics.length>20) this.discussedTopics.pop();
    }
  },

  addEntity(entity){
    if(!entity) return;
    this.lastEntities.unshift(entity);
    if(this.lastEntities.length>5) this.lastEntities.pop();
  },

  resolveReference(text){
    const PRNS = /\b(it|that one|the same|that thing|this one|this thing|the project|the page|those|them|that project|that page|that game|that feature)\b/i;
    if(!PRNS.test(text)) return text;
    const ctx = this.lastEntities[0] || this.lastTopic;
    if(ctx) return text + ` [context: ${ctx}]`;
    return text;
  },

  isRepetitive(msg){
    if(!msg) return false;
    return this._recent.includes(msg.slice(0,60));
  },

  trackResponse(msg){
    if(!msg) return;
    this._recent.unshift(msg.slice(0,60));
    if(this._recent.length>this.MAX_RECENT) this._recent.pop();
  },

  incrementMessage(){ this.messageCount++; },

  setVisitorType(type){ this.visitorType = type; },

  logUnknown(q){
    this.unknownQueries.push({q,ts:Date.now()});
    const C = window.RORO_CONFIG;
    if(C&&C.analytics){
      if(!C.analytics.unknownLog) C.analytics.unknownLog = [];
      C.analytics.unknownLog.push({q,ts:Date.now()});
    }
  },

  logLowConfidence(q, score){
    this.lowConfidence.push({q,score,ts:Date.now()});
  },

  logInternet(q){
    this.internetSearches.push({q,ts:Date.now()});
    const C = window.RORO_CONFIG;
    if(C&&C.analytics){
      if(!C.analytics.internetLog) C.analytics.internetLog = [];
      C.analytics.internetLog.push({q,ts:Date.now()});
    }
  },

  logRecruiter(q){
    this.recruiterQueries.push({q,ts:Date.now()});
    const C = window.RORO_CONFIG;
    if(C&&C.analytics){
      if(!C.analytics.recruiterLog) C.analytics.recruiterLog = [];
      C.analytics.recruiterLog.push({q,ts:Date.now()});
    }
  },

  /* Export all analytics for admin panel */
  getAnalytics(){
    return {
      totalMessages:   this.messageCount,
      unknownQueries:  this.unknownQueries,
      lowConfidence:   this.lowConfidence,
      recruiterQueries:this.recruiterQueries,
      internetSearches:this.internetSearches,
      visitedPages:    this.visitedPages,
      discussedTopics: this.discussedTopics,
      visitorType:     this.visitorType,
    };
  },
};

/* ══════════════════════════════════════════════════════════════
   KNOWLEDGE GRAPH
   Simple entity-relationship map for better context awareness.
   Used to suggest related topics intelligently.
══════════════════════════════════════════════════════════════ */
const KnowledgeGraph = {
  RELATIONS:{
    'photography':   ['photos','iskcon','media','ISKCON Summer Camp','Albums','videography'],
    'iskcon':        ['photography','media','origami','education','summer camp','2024'],
    'nationals':     ['competition','achievements','kvs','2024','exhibition'],
    'ecommerce':     ['web','javascript','html','css','development','shopping'],
    'website':       ['javascript','html','css','design','roro','themes','games'],
    'identity':      ['journey','philosophy','about','biography'],
    'journey':       ['timeline','2008','cities','nomadic','identity'],
    'games':         ['snake','2048','memory match','word scramble','reaction time'],
    'thoughts':      ['beliefs','philosophy','politics','science','faith','society'],
    'projects':      ['nationals','iskcon','ecommerce','writing','website'],
    'skills':        ['javascript','html','css','photography','design','traits'],
    'lists':         ['movies','books','series','places','recommendations'],
  },
  getRelated(entity){
    if(!entity) return [];
    const key = entity.toLowerCase();
    for(const [k,v] of Object.entries(this.RELATIONS)){
      if(key.includes(k)||k.includes(key)) return v.slice(0,4);
    }
    return [];
  },
};

/* ══════════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════════ */
window.RoRoIntelligence = {
  TypoCorrector,
  EntityExtractor,
  Classifier,
  WebsiteSearch,
  RecruiterEngine,
  CasualEngine,
  GeneralKnowledge,
  SessionMemory,
  KnowledgeGraph,
};
})();
