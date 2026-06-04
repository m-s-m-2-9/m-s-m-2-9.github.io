/* ═══════════════════════════════════════════════════════════════════
   js/bot/roro-intelligence.js — RoRo Hybrid Routing & LLM Cascade Engine v4.5
   
   FIXED STATUS: Resolves asynchronous message freezes by directly 
   intercepting the Manager's message processing pipeline.
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
    has(text, keyword) {
      if (!keyword) return false;
      const pattern = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${pattern}\\b`, 'i').test(text);
    },
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
      const C = window.RORO_CONFIG || {};
      const clean = TypoCorrector.correct(input);
      
      // A. NAVIGATION MATCH?
      for (const [pageId, keywords] of Object.entries(C.navigationKeywords || {})) {
        if (keywords.some(kw => TokenUtil.has(clean, kw))) {
          return { type: 'NAV', id: pageId, corrected: clean };
        }
      }

      // B. PORTFOLIO QUERY?
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
      const traitsList = window.RORO_CONFIG?.owner?.traits ? window.RORO_CONFIG.owner.traits.join(', ') : 'creativity, development';
      const systemPrompt = `You are RoRo, the AI assistant for MSM (Manomay Shailendra Misra). 
      Portfolio Data: ${ContextCompiler.compile()}.
      Rules: Be elegant, concise, and cinematic. Max 2-3 sentences. 
      If info is missing from the Portfolio Data, state: "According to Manomay's verified portfolio configuration, that specific capability is not listed. However, he is proficient in ${traitsList}."
      Closing: You must append this exactly: ${this.getPivot(profile)}`;

      // TIER 1: GEMINI
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AQ.Ab8RN6Ly3eE5tDq6gPeBZE-xR5Eu5B2lo8iHZ0v1I2HwBRoR6w`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] }] })
        });
        const d = await res.json();
        if (d.candidates?.[0]?.content?.parts?.[0]?.text) {
          return d.candidates[0].content.parts[0].text;
        }
      } catch (e) { console.warn("Tier 1 Failed"); }

      // TIER 2: GROQ
      try {
        const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }] })
        });
        const d = await res.json();
        if (d.choices?.[0]?.message?.content) return d.choices[0].message.content;
      } catch (e) { console.warn("Tier 2 Failed"); }

      // TIER 3: OPENROUTER
      try {
        const res = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: "meta-llama/llama-3-8b-instruct:free", messages: [{ role: "user", content: `${systemPrompt}\n\n${prompt}` }] })
        });
        const d = await res.json();
        if (d.choices?.[0]?.message?.content) return d.choices[0].message.content;
      } catch (e) { console.warn("Tier 3 Failed"); }

      // TIER 4: PUTER
      try {
        if (window.puter) {
          const puterRes = await window.puter.ai.chat(`${systemPrompt}\n\n${prompt}`);
          if (puterRes) return puterRes;
        }
      } catch (e) { console.warn("Tier 4 Failed"); }

      // TIER 5: WEB SCRAPER FALLBACK
      if (_originalWebLookup) {
        const webRes = await _originalWebLookup(prompt);
        if (webRes && webRes.summary) return webRes.summary;
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
      STEP 4: HYBRID ROUTER INTEGRATION & MANAGER PIPELINE INJECTION
     ════════════════════════════════════════════════════════════ */

  window.RoRoIntelligence = {
    Classifier: {
      classify: (input) => Classifier.classify(input)
    },

    WebsiteSearch: {
      search: (input, KB) => {
        const cls = Classifier.classify(input);
        return [{ score: 99, doc: { type: 'hybrid', id: cls.id, cls: cls } }];
      },

      composeAnswer: (input, results) => {
        if (!results || !results.length) return null;
        const res = results[0].doc;
        const cls = res.cls;
        const manager = window.RoRoManagerInstance;

        // A. HANDLE NAVIGATION IMMEDIATELY
        if (cls.type === 'NAV') {
          const page = window.RORO_CONFIG?.pages?.[cls.id];
          if (typeof window.navigateTo === 'function') window.navigateTo(cls.id);
          
          if (page) {
            LLMCascade.fetchAI(`Give a 1-sentence analytical summary of the ${page.label} section based on: ${page.summary}`, 'CASUAL')
              .then(summary => {
                if (manager && typeof manager._enqueue === 'function') {
                  manager._enqueue(summary);
                }
              });
            return { messages: [`Navigating to ${page.label}...`] };
          }
        }

        // B. ROUTE PORTFOLIO & GENERAL QUESTIONS VIA BACKGROUND PIPELINE INJECTION
        const profile = (manager && manager._profile) || 'CASUAL';
        
        // Trigger the asynchronous cascade model
        LLMCascade.fetchAI(input, profile).then(reply => {
          if (manager) {
            // Remove the bot's temporary typing state element if it exists
            const typingIndicator = document.querySelector('.roro-typing, .typing-indicator');
            if (typingIndicator) typingIndicator.remove();
            
            // Explicitly inject the reply into the live chat UI frame
            if (typeof manager._enqueue === 'function') {
              manager._enqueue(reply);
            } else if (typeof manager.respond === 'function') {
              manager.respond(reply);
            }
          }
        });

        // Return an instant structural layout context back to the manager frame 
        // to prevent it from failing out or breaking the input field loop
        return { 
          messages: [], 
          options: ['Show me Projects', 'Download CV', 'Surprise Me'] 
        };
      }
    },

    // Session Memory structural definitions for error resistance
    SessionMemory: {
      incrementMessage: () => {},
      addTopic: () => {},
      addEntity: () => {},
      resolveReference: (t) => t,
      trackResponse: () => {},
      logUnknown: () => {},
      logInternet: () => {},
      logRecruiter: () => {},
      getAnalytics: () => ({
        totalMessages: 1, unknownQueries: [], lowConfidence: [],
        recruiterQueries: [], internetSearches: [], visitedPages: [], discussedTopics: []
      }),
      visitorType: 'CASUAL'
    },

    KnowledgeGraph: {
      getRelated: () => []
    }
  };

  // Re-map the global web framework layer to execute safely via our cascade
  window.RoRoWeb = {
    lookup: async (query) => {
      const manager = window.RoRoManagerInstance;
      const profile = (manager && manager._profile) || 'CASUAL';
      const response = await LLMCascade.fetchAI(query, profile);
      return { messages: [response], source: 'RoRo Intelligence Matrix' };
    },
    tryMath: (expr) => {
      try { return eval(expr.replace(/[^-()\d/*+.]/g, '')); } catch (e) { return null; }
    },
    clearCache: () => {}
  };

  window.RoRoIntelligence.TypoCorrector = TypoCorrector;

})();
