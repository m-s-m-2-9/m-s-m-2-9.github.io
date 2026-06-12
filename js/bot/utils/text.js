/* ═══════════════════════════════════════════════════════════════
   js/bot/utils/text.js  —  RoRo v5 Text Utilities
   ─────────────────────────────────────────────────────────────
   All text manipulation utilities used across the bot.
   · Tokeniser — words to array
   · Typo corrector — fixes misspellings
   · Hinglish translator — maps Hindi phrases to English
   · Math solver — handles English sentence math
   · String utilities — cap, clean, escape, distance
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/utils/text.js
   EXPORTS: window.RoRoText
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── TYPO TABLE ────────────────────────────────────────────
     Common misspellings → correct form.
     Extended from admin training/aliases.js at runtime.
  ────────────────────────────────────────────────────────── */
  const BASE_TYPOS = {
    'manomya':'manomay','manomai':'manomay','manomaay':'manomay','manomayy':'manomay',
    'maomay':'manomay','mnaomay':'manomay','monmay':'manomay','manoamay':'manomay',
    'manoma':'manomay','manoamy':'manomay','manamoy':'manomay',
    'portfolia':'portfolio','portfollio':'portfolio','portfoio':'portfolio',
    'projcts':'projects','projecrt':'projects','pojects':'projects','projets':'projects',
    'websit':'website','webiste':'website','websitee':'website','webite':'website',
    'phoot':'photo','photoo':'photo','phooto':'photo','potho':'photo',
    'achievemnts':'achievements','achievments':'achievements','achivements':'achievements',
    'expereince':'experience','experince':'experience','experiece':'experience',
    'educaton':'education','eductaion':'education','educaiton':'education',
    'skillss':'skills','skils':'skills','skiils':'skills',
    'intrenship':'internship','intenship':'internship','internhsip':'internship',
    'linekdin':'linkedin','linkdin':'linkedin','linkedni':'linkedin','lnkedin':'linkedin',
    'insatgram':'instagram','isntagram':'instagram','instagarm':'instagram',
    'isntgram':'instagram',
    'gihub':'github','githb':'github','gituhb':'github',
    'pyhton':'python','pytohn':'python','phyton':'python','pyton':'python',
    'javascrpit':'javascript','javasript':'javascript','javscript':'javascript',
    'naem':'name','nmae':'name','contcat':'contact','cnotact':'contact',
    'proejct':'project','prject':'project','rpojest':'project',
    'waht':'what','whta':'what','hwo':'how','woh':'who',
    'teh':'the','adn':'and','hav':'have','wnat':'want','jsut':'just',
    'thier':'their','taht':'that','realy':'really','becuase':'because',
    'alot':'a lot','untill':'until',
    'whatsaop':'whatsapp','watsapp':'whatsapp','watssap':'whatsapp',
    'whatsaap':'whatsapp','whastsapp':'whatsapp',
    'instgram':'instagram','instgarm':'instagram',
    'recruter':'recruiter','recuiter':'recruiter','recriuter':'recruiter',
    'achivements':'achievements','acheivements':'achievements',
    'studing':'studying','stuying':'studying','sttudying':'studying',
  };

  /* ── HINGLISH PHRASE TABLE ─────────────────────────────── */
  const BASE_HINGLISH = {
    'manomay kaun hai':           'who is manomay',
    'ye website kya hai':         'what is this website',
    'ye website kisne banayi':    'who built this website',
    'kya vo python janta hai':    'does he know python',
    'kya he knows python':        'does he know python',
    'uski age kya hai':           'what is his age',
    'uska kaam kya hai':          'what is his work',
    'projects dikhao':            'show me projects',
    'cv dikhao':                  'show me cv',
    'kahan rehta hai':            'where does he live',
    'kahan se hai':               'where is he from',
    'kitne saal ka hai':          'how old is he',
    'kya kaam kiya':              'what work has he done',
    'wo kya karta hai':           'what does he do',
    'kya sikha hai':              'what has he learned',
    'koi project hai':            'does he have projects',
    'python aata hai':            'does he know python',
    'javascript aata hai':        'does he know javascript',
    'coding aata hai':            'does he know coding',
    'college kahan hai':          'where does he study',
    'kaun se college mein hai':   'which college does he attend',
    'kya padh raha hai':          'what is he studying',
    'kya internship karega':      'will he intern',
    'hire kar sakte hain':        'can we hire him',
    'social media links dikhao':  'show social media',
    'instagram kya hai uska':     'what is his instagram',
    'linkedin dikhao':            'show linkedin',
    'contact kaise karein':       'how to contact',
    'games khelo':                'open games',
    'music chalao':               'play music',
    'dark mode karo':             'switch to dark mode',
    'light mode karo':            'switch to light mode',
    'kya hua':                    'what happened',
    'sab theek hai':              'is everything okay',
    'theek hai':                  'okay',
    'kuch bhi':                   'anything',
    'koi bhi':                    'anyone',
  };

  /* ── MATH WORD TABLE ───────────────────────────────────── */
  const MATH_WORDS = {
    'plus':          '+',
    'added to':      '+',
    'added with':    '+',
    'and':           '+',
    'minus':         '-',
    'subtract':      '-',
    'subtracted from': '-',
    'times':         '*',
    'multiplied by': '*',
    'x':             '*',
    'divided by':    '/',
    'over':          '/',
    'mod':           '%',
    'modulo':        '%',
    'power':         '**',
    'to the power of':'**',
    'squared':       '**2',
    'cubed':         '**3',
  };

  /* ── TEXT UTILITIES ─────────────────────────────────────── */
  const Text = {

    /* Normalise query to lowercase array of meaningful tokens */
    tokenise(str) {
      return (str || '').toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1);
    },

    /* Cap text to N words */
    cap(text, n) {
      n = n || 55;
      if (!text) return '';
      const words = text.trim().split(/\s+/);
      return words.length <= n ? text.trim() : words.slice(0, n).join(' ') + '\u2026';
    },

    /* Clean Wikipedia/DDG artifacts */
    clean(text) {
      if (!text) return '';
      return text
        .replace(/\s*\(listen\)/gi, '')
        .replace(/\[\d+\]/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    },

    /* HTML escape */
    escape(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    /* Simple Levenshtein distance */
    levenshtein(a, b) {
      const m = a.length, n = b.length;
      if (!m) return n; if (!n) return m;
      const dp = [];
      for (let i = 0; i <= m; i++) dp[i] = [i];
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] = a[i-1] === b[j-1]
            ? dp[i-1][j-1]
            : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
      }
      return dp[m][n];
    },

    /* Bigram similarity (0–1) */
    bigramSim(a, b) {
      if (a.length < 2 || b.length < 2) return 0;
      const bg = s => { const r = new Set(); for (let i = 0; i < s.length-1; i++) r.add(s.slice(i, i+2)); return r; };
      const bA = bg(a), bB = bg(b);
      let inter = 0; for (const x of bA) { if (bB.has(x)) inter++; }
      return (2 * inter) / (bA.size + bB.size);
    },

    /* ── TYPO CORRECTOR ───────────────────────────────────── */
    _typos: { ...BASE_TYPOS },
    _hinglish: { ...BASE_HINGLISH },

    /* Merge custom aliases from admin training file */
    mergeAliases(aliases) {
      if (aliases && typeof aliases === 'object') {
        Object.assign(this._typos, aliases);
      }
    },

    correct(text) {
      if (!text) return text;
      let lower = text.toLowerCase().trim();

      /* Hinglish phrase match */
      for (const [phrase, rep] of Object.entries(this._hinglish)) {
        if (lower.includes(phrase)) lower = lower.replace(phrase, rep);
      }

      /* Word-by-word typo fix */
      const words = lower.split(/\s+/);
      return words.map(w => this._typos[w] || w).join(' ');
    },

    /* ── MATH SOLVER ──────────────────────────────────────── */
    solveMath(text) {
      try {
        let expr = text.toLowerCase();

        /* Strip question framing */
        expr = expr
          .replace(/\bwhat\s+(?:is|will\s+be|would\s+be|are)\b/gi, '')
          .replace(/\b(?:the\s+)?(?:answer|result|sum|product|difference|quotient)\s+(?:of|when|if)\b/gi, '')
          .replace(/\bwhen\s+you\s+(?:add|subtract|multiply|divide)\b/gi, '')
          .replace(/\bplease\b/gi, '')
          .replace(/\?+/g, '');

        /* English word → operator */
        expr = expr
          .replace(/\b(\d+(?:\.\d+)?)\s+plus\s+(\d+(?:\.\d+)?)/gi, '$1+$2')
          .replace(/\b(\d+(?:\.\d+)?)\s+added\s+(?:to|with)\s+(\d+(?:\.\d+)?)/gi, '$1+$2')
          .replace(/\b(\d+(?:\.\d+)?)\s+minus\s+(\d+(?:\.\d+)?)/gi, '$1-$2')
          .replace(/\b(\d+(?:\.\d+)?)\s+subtracted\s+from\s+(\d+(?:\.\d+)?)/gi, '$2-$1')
          .replace(/\b(\d+(?:\.\d+)?)\s+times\s+(\d+(?:\.\d+)?)/gi, '$1*$2')
          .replace(/\b(\d+(?:\.\d+)?)\s+multiplied\s+by\s+(\d+(?:\.\d+)?)/gi, '$1*$2')
          .replace(/\b(\d+(?:\.\d+)?)\s+divided\s+by\s+(\d+(?:\.\d+)?)/gi, '$1/$2')
          .replace(/\b(\d+(?:\.\d+)?)\s*percent\s+of\s+(\d+(?:\.\d+)?)/gi, '($1/100*$2)')
          .replace(/\^/g, '**');

        /* Strip non-math characters */
        const clean = expr.replace(/[^0-9\s\+\-\*\/\.\(\)%]/g, '').trim();
        if (!clean || clean.length < 3 || clean.length > 80) return null;

        /* eslint-disable no-new-func */
        const result = Function('"use strict"; return (' + clean + ')')();
        /* eslint-enable no-new-func */

        if (typeof result === 'number' && isFinite(result)) {
          return Number.isInteger(result)
            ? String(result)
            : result.toFixed(8).replace(/\.?0+$/, '');
        }
        return null;
      } catch { return null; }
    },

    /* ── ACKNOWLEDGEMENT WORDS ───────────────────────────── */
    ACK_WORDS: new Set([
      'okay','ok','k','fine','sure','alright','right','gotcha','got it',
      'understood','noted','i see','i know','makes sense','fair','fair enough',
      'huh','bruh','lol','lmao','omg','damn','wow','nice','cool','great',
      'awesome','super','yep','yup','yeah','nope','nah','no','yes','maybe',
      'interesting','oh','ah','hmm','hm','ugh','oof','oops','ouch','whoa',
      'woah','bro','dude','man','bhai','yaar','achha','sahi','badiya',
      'good','bad','okay sure','okay fine','alright then','sounds good',
      'got it thanks','ok thanks','okay okay','ok ok','haha','hehe',
      'thanks','thank you','ty','thx','cheers','no worries','no problem',
      'np','nw','anytime','of course','sure thing','totally','absolutely',
      'definitely','exactly','precisely','correct','right on','roger',
      'copy that','10-4','noted','duly noted','acknowledged',
    ]),

    isAck(text) {
      if (!text) return false;
      const clean = text.toLowerCase().replace(/[!?.]/g, '').trim();
      return this.ACK_WORDS.has(clean);
    },

    /* Pick random from array */
    rnd(arr) {
      if (!arr || !arr.length) return '';
      const item = arr[Math.floor(Math.random() * arr.length)];
      return typeof item === 'function' ? item() : item;
    },

  };

  /* Merge admin aliases on load */
  const adminAliases = window.RORO_ADMIN_TRAINING && window.RORO_ADMIN_TRAINING.aliases;
  if (adminAliases) Text.mergeAliases(adminAliases);

  window.RoRoText = Text;

})();
