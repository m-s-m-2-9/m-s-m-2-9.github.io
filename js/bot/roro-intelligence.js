/* ═══════════════════════════════════════════════════════════════════
   js/bot/roro-intelligence.js — RoRo Hybrid Routing & LLM Cascade Engine v4.0
   
   ENGINEERING BLUEPRINT COMPLIANCE:
   · Token-based boundary verification (replaces loose .includes matching)
   · 5-Tier Asynchronous LLM Cascade (Gemini -> Groq -> OpenRouter -> Puter -> Web)
   · Dynamic RORO_CONFIG Evaluation (Single source of truth)
   · Visitor Profile Dynamic Closures (Recruiter/Student/Friend/Tester)
   · Hybrid/Missed Knowledge Resolution (Anti-hallucination layer)
   · Navigation Analytical Summaries
   
   NO VISUAL CHANGES PERMITTED. VANILLA JS ONLY.
═══════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // Save reference to original web scraper for Tier 5 fallback
  const _originalWebLookup = window.RoRoWeb ? window.RoRoWeb.lookup : null;

  /* ════════════════════════════════════════════════════════════
     STEP 1: CLEANING & UTILITIES
  ════════════════════════════════════════════════════════════ */

  const TypoCorrector = {
    TYPOS: {
      'manomya': 'manomay', 'manomai': 'manomay', 'maomay': 'manomay',
      'projcts': 'projects', 'webiste': 'website', 'skils': 'skills'
    },
    HINGLISH: {
      'kaun hai': 'who is', 'kaun h': 'who is', 'kisne banayi': 'who built',
      'dikhao': 'show', 'karta hai': 'does', 'kahan': 'where'
    },
    correct(text) {
      if (!text) return '';
      let str = text.toLowerCase().trim();
      for (const [key, val] of Object.entries(this.HINGLISH)) {
        if (str.includes(key)) str = str.replace(new RegExp(key, 'g'), val);
      }
      return str.split(/\s+/).map(w => this.TYPOS[w] || w).join(' ');
    }
  };

  const TokenUtil = {
    // Strict boundary check to prevent "donkey" matching "Don"
    has(text, keyword) {
      if (!keyword) return false;
      const pattern = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${pattern}\\b`, 'i').test(text);
    },
    // Multi-token match score
    score(text, keywords) {
      if (!keywords || !Array.isArray(keywords)) return 0;
      return keywords.reduce((acc, kw) => acc + (this.has(text, kw) ? 10 : 0), 0);
    }
  };

  /* ════════════════════════════════════════════════════════════
     STEP 2: CLASSIFICATION & CONTEXT
  ════════════════════════════════════════════════════════════ */

  const Classifier = {
    classify(input) {
      const C = window.RORO_CONFIG;
      const clean = TypoCorrector.correct(input);
      
      // A. NAVIGATION MATCH?
      for (const [pageId, keywords] of Object.entries(C.navigationKeywords || {})) {
        if (keywords.some(kw => TokenUtil.has(clean, kw))) {
          return { type: 'NAV', id: pageId, corrected: clean };
        }
      }

      // B. PORTFOLIO QUERY? (Check against keys in CONFIG)
      const portfolioKeys = ['nationals', 'iskcon', 'ecommerce', 'writing', 'website', 'manomay', 'msm', 'cv', 'resume', 'skills', 'traits'];
      const isPortfolio = portfolioKeys.some(k => TokenUtil.has(clean, k)) || 
                         clean.includes('manomay') || clean.includes('msm');

      if (isPortfolio) return { type: 'PORTFOLIO', corrected: clean };

      // C. GENERAL OUTSIDE QUERY
      return { type: 'GENERAL', corrected: clean };
    }
  };

  const ContextCompiler = {
    compile() {
      const C = window.RORO_CONFIG || {};
      return JSON.stringify({
        owner: C.owner,
        capabilities: C.pages,
        projects: C.projects,
        faq: C.faq,
        available_themes: C.design?.themes,
        stack: C.design?.stack
      });
    }
  };

  /* ════════════════════════════════════════════════════════════
     STEP 3: LLM CASCADE ENGINE
  ════════════════════════════════════════════════════════════ */

  const LLMCascade = {
    async fetchAI(prompt, profile) {
      const systemPrompt = `You are RoRo, the AI assistant for MSM (Manomay Shailendra Misra). 
      Portfolio Data: ${ContextCompiler.compile()}.
      Rules: Be elegant, concise, and cinematic. Max 2-3 sentences. 
      If info is missing from the Portfolio Data, state: "According to Manomay's verified portfolio configuration, that specific capability is not listed. However, he is proficient in ${window.RORO_CONFIG.owner.traits.join(', ')}."
      Closing: You must append this exactly: ${this.getPivot(profile)}`;

      // TIER 1: GEMINI
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AQ.Ab8RN6Ly3eE5tDq6gPeBZE-xR5Eu5B2lo8iHZ0v1I2HwBRoR6w`, {
          method: 'POST',
          body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] }] })
        });
        const d = await res.json();
        return d.candidates[0].content.parts[0].text;
      } catch (e) { console.warn("Tier 1 Failed"); }

      // TIER 2: GROQ
      try {
        const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }] })
        });
        const d = await res.json();
        return d.choices[0].message.content;
      } catch (e) { console.warn("Tier 2 Failed"); }

      // TIER 3: OPENROUTER
      try {
        const res = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: "meta-llama/llama-3-8b-instruct:free", messages: [{ role: "user", content: `${systemPrompt}\n\n${prompt}` }] })
        });
        const d = await res.json();
        return d.choices[0].message.content;
      } catch (e) { console.warn("Tier 3 Failed"); }

      // TIER 4: PUTER
      try {
        if (window.puter) return await window.puter.ai.chat(`${systemPrompt}\n\n${prompt}`);
      } catch (e) { console.warn("Tier 4 Failed"); }

      // TIER 5: WEB SCRAPER FALLBACK
      if (_originalWebLookup) {
        const webRes = await _originalWebLookup(prompt);
        return webRes ? webRes.summary : this.finalFallback();
      }

      return this.finalFallback();
    },

    getPivot(profile) {
      if (profile === 'RECRUITER') return " Btw, I'm primarily here to showcase Manomay's technical expertise. Check out his resume or projects tab next!";
      if (['STUDENT', 'FRIEND', 'TESTER'].includes(profile)) return " Btw, I'm actually here to show off Manomay's work. Ask me about his cinematic timeline or play a built-in game!";
      return " Btw, I'm actually here to show off Manomay's work. Ask me about his projects next!";
    },

    finalFallback() {
      return "I am experiencing brief network congestion trying to reach my core cognitive matrix. Let's try that query one more time or write to Manomay directly on the Contact page!";
    }
  };

  /* ════════════════════════════════════════════════════════════
     STEP 4: HYBRID ROUTER INTEGRATION
  ════════════════════════════════════════════════════════════ */

  window.RoRoIntelligence = {
    // Primary Entry Point called by manager-roro.js
    Classifier: {
      classify: (input) => Classifier.classify(input)
    },

    WebsiteSearch: {
      search: (input, KB) => {
        const cls = Classifier.classify(input);
        // We return a high-score dummy to ensure manager-roro chooses the async path
        return [{ score: 99, doc: { type: 'hybrid', id: cls.id, cls: cls } }];
      },

      composeAnswer: (input, results) => {
        const res = results[0].doc;
        const cls = res.cls;

        // Handle Navigation immediately
        if (cls.type === 'NAV') {
          const page = window.RORO_CONFIG.pages[cls.id];
          if (window.navigateTo) window.navigateTo(cls.id);
          
          // Trigger async summary generation
          LLMCascade.fetchAI(`Give a 1-sentence analytical summary of the ${page.label} section based on: ${page.summary}`, 'CASUAL')
            .then(summary => {
              if (window.roro) window.roro._enqueue(`Opened ${page.label}. ${summary}`);
            });

          return { messages: [`Navigating to ${page.label}...`] };
        }

        // Return placeholder for Portfolio/General to trigger manager's _handleAsyncLookup
        return null; 
      }
    },

    // Hijack RoRoWeb.lookup to be the LLM Cascade entry
    SessionMemory: {
      incrementMessage: () => { /* Compatibility */ },
      addTopic: () => { /* Compatibility */ },
      addEntity: () => { /* Compatibility */ },
      resolveReference: (t) => t,
      trackResponse: () => {},
      logUnknown: () => {},
      logInternet: () => {},
      logRecruiter: () => {},
      getAnalytics: () => ({}),
      visitorType: 'CASUAL'
    }
  };

  // Replace RoRoWeb.lookup to funnel all async questions through the LLM Cascade
  window.RoRoWeb = {
    lookup: async (query) => {
      const profile = window.roro?._profile || 'CASUAL';
      const response = await LLMCascade.fetchAI(query, profile);
      return { summary: response, source: 'RoRo Intelligence Matrix' };
    },
    tryMath: (expr) => {
      try { return eval(expr.replace(/[^-()\d/*+.]/g, '')); } catch (e) { return null; }
    }
  };

  // Re-export TypoCorrector for safety
  window.RoRoIntelligence.TypoCorrector = TypoCorrector;

})();
