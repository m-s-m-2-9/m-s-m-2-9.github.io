// ... (Keep existing CSS and UI logic)

// NEW: The LLM Cascade Logic
const AICascade = {
    async fetch(query) {
        const system = window.RoRoIntelligence.getSystemPrompt();
        
        // Tier 1: Gemini
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AQ.Ab8RN6Ly3eE5tDq6gPeBZE-xR5Eu5B2lo8iHZ0v1I2HwBRoR6w`, {
                method: 'POST',
                body: JSON.stringify({ contents: [{ parts: [{ text: `${system}\n\nUser Question: ${query}` }] }] })
            });
            const data = await res.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) { console.warn("Tier 1 Failed"); }

        // Tier 2: Groq
        try {
            const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{role: "system", content: system}, {role: "user", content: query}] })
            });
            const data = await res.json();
            return data.choices[0].message.content;
        } catch (e) { console.warn("Tier 2 Failed"); }

        // Tier 3: OpenRouter
        try {
            const res = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ model: "meta-llama/llama-3-8b-instruct:free", messages: [{role: "user", content: query}] })
            });
            const data = await res.json();
            return data.choices[0].message.content;
        } catch (e) { console.warn("Tier 3 Failed"); }

        // Tier 4: Puter
        try {
            if (window.puter) return await window.puter.ai.chat(query);
        } catch (e) { console.warn("Tier 4 Failed"); }

        // Tier 5: Web Scraper
        return await window.RoRoWeb.lookup(query);
    }
};

// Inside RoRoManager class definition:
_route(text) {
    const safe = window.RoRoSafety.check(text);
    if (!safe.safe) {
        this._enqueue(safe.response);
        return;
    }

    const intent = window.RoRoIntelligence.analyzeIntent(text);

    if (intent.type === 'NAV') {
        this._enqueue(`Opening ${intent.label}. ${intent.summary}`);
        if (typeof window.navigateTo === 'function') window.navigateTo(intent.target);
        return;
    }

    if (intent.type === 'PORTFOLIO') {
        // Revert to existing local dictionary logic from your original files
        const localResp = this.getBotResponse(text); 
        this._dispatchResponse(localResp);
    } else {
        // GENERAL: TRIGGER AI CASCADE
        this._enqueue("Consulting the core cognitive matrix...");
        
        AICascade.fetch(text).then(result => {
            // Locate the "Consulting..." bubble and replace or simply add new
            // We use the established _enqueue to maintain typing cinematic
            this._enqueue(result || "I'm having trouble connecting to my auxiliary processors. Let's talk about Manomay instead.");
        });
    }
}

// At the end of Constructor
window.RoRoManagerInstance = this;
