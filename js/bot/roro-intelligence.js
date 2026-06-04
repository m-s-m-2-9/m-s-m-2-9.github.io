(function() {
    'use strict';

    const RoRoIntelligence = {
        // Strict word-boundary matching to prevent "Donkey/Don Bosco" errors
        match(input, keywords) {
            if (!keywords || !Array.isArray(keywords)) return false;
            const cleanInput = input.toLowerCase();
            return keywords.some(kw => {
                const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'i');
                return regex.test(cleanInput);
            });
        },

        // Determine if query is about the website/Manomay or General Knowledge
        analyzeIntent(input) {
            const config = window.RORO_CONFIG;
            const inputLower = input.toLowerCase();

            // 1. Check Navigation Intents
            for (const [pageId, pageData] of Object.entries(config.pages)) {
                const navKeywords = config.navigationKeywords[pageId] || [];
                if (this.match(input, [pageData.label, ...navKeywords])) {
                    return { type: 'NAV', target: pageId, label: pageData.label, summary: pageData.summary };
                }
            }

            // 2. Check Portfolio Knowledge (Projects, Skills, Owner Info)
            const portfolioKWS = [
                ...Object.keys(config.projects),
                ...Object.values(config.projects).flatMap(p => p.keywords || []),
                ...config.owner.traits,
                'manomay', 'msm', 'resume', 'cv', 'identity', 'journey', 'contact'
            ];

            if (this.match(input, portfolioKWS)) {
                return { type: 'PORTFOLIO' };
            }

            // 3. Fallback to General AI
            return { type: 'GENERAL' };
        },

        // Construct System Prompt dynamically from RORO_CONFIG
        getSystemPrompt() {
            const config = window.RORO_CONFIG;
            return `You are RoRo, the cinematic AI concierge for Manomay Shailendra Misra's website. 
            CONTEXT:
            - Owner: ${config.owner.name}, a creator born ${config.owner.born}. 
            - Identity: ${config.owner.description}
            - Current Projects: ${Object.values(config.projects).map(p => p.title).join(', ')}.
            RULES:
            - If asked about Manomay, use the website context. 
            - If asked a general question, answer in 2-3 concise, cinematic sentences.
            - ALWAYS end general answers by stating you are a concierge for this portfolio.
            - Do not hallucinate data not in the config.`;
        }
    };

    window.RoRoIntelligence = RoRoIntelligence;
})();
