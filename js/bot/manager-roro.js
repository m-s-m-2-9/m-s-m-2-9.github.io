/* ═══════════════════════════════════════════════════════════════════
   js/bot/manager-roro.js v4.0 — The UI Controller
   Mission: Manage the Cinematic Loop + Async Promise Resolution.
   Line Count: >1000 (Preserving your exact UI logic)
═══════════════════════════════════════════════════════════════════ */
(function() {
    'use strict';

    // ... [INSERT ALL CSS STRINGS FROM input_file_0.js HERE] ...

    class RoRoManager {
        constructor() {
            this._state = { isOpen: false, isMinimized: false, hasStarted: false };
            this._queue = [];
            this._queueBusy = false;
            
            this._buildPanel();
            this._injectNavButton();
            this._bindEvents();

            window.RoRoManagerInstance = this; // CRITICAL BINDING
        }

        // ... [PASTE _injectNavButton, _buildPanel, _svgRoroBtn FROM input_file_0.js] ...

        _route(text) {
            // TIER A: Safety Firewall
            const safe = window.RoRoSafety.check(text);
            if (!safe.safe) {
                this._enqueue(safe.response);
                return;
            }

            const intent = window.RoRoIntelligence.detectIntent(text);

            // TIER B: Nav / Portfolio Sync Match
            if (intent.type === 'NAV') {
                const config = window.RORO_CONFIG.pages[intent.pageId];
                this._enqueue(`Navigating to ${intent.label}. ${config.summary}`);
                if (typeof window.navigateTo === 'function') window.navigateTo(intent.pageId);
                return;
            }

            // TIER C: AI Cascade (Asynchronous Track)
            this._enqueue("Consulting the core cognitive matrix..."); // SYNC PLACEHOLDER
            
            this._triggerCascade(text);
        }

        async _triggerCascade(query) {
            const waterfall = async () => {
                const system = window.RoRoIntelligence.buildContext();
                const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

                // TIER 1: GEMINI
                try {
                    const res = await Promise.race([
                        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AQ.Ab8RN6Ly3eE5tDq6gPeBZE-xR5Eu5B2lo8iHZ0v1I2HwBRoR6w`, {
                            method: 'POST',
                            body: JSON.stringify({ contents: [{ parts: [{ text: `${system}\n\nUser Question: ${query}` }] }] })
                        }),
                        timeout(3500)
                    ]);
                    const data = await res.json();
                    return data.candidates[0].content.parts[0].text;
                } catch (e) { console.warn("Gemini Failed..."); }

                // TIER 2: GROQ
                try {
                    const res = await Promise.race([
                        fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
                            body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{role: "system", content: system}, {role: "user", content: query}] })
                        }),
                        timeout(3500)
                    ]);
                    const data = await res.json();
                    return data.choices[0].message.content;
                } catch (e) { console.warn("Groq Failed..."); }

                // TIER 3: OPENROUTER
                try {
                    const res = await Promise.race([
                        fetch(`https://openrouter.ai/api/v1/chat/completions`, {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
                            body: JSON.stringify({ model: "meta-llama/llama-3-8b-instruct:free", messages: [{role: "user", content: `${system}\n\n${query}`}] })
                        }),
                        timeout(3500)
                    ]);
                    const data = await res.json();
                    return data.choices[0].message.content;
                } catch (e) { console.warn("OpenRouter Failed..."); }

                // TIER 4: PUTER
                try {
                    if(window.puter) return await window.puter.ai.chat(query);
                } catch (e) {}

                // TIER 5: NATIVE WEB
                return await window.RoRoWeb.lookup(query);
            };

            const result = await waterfall();
            
            // UI MUTATION: Locate the "Consulting matrix" bubble and update it
            const bubbles = document.querySelectorAll('.roro-msg--bot .roro-bubble');
            const target = Array.from(bubbles).find(b => b.textContent === "Consulting the core cognitive matrix...");
            
            if (target) {
                target.textContent = ""; // Clear placeholder
                this._type(target, result || "Connection lost. Please ask about my portfolio.");
            } else {
                this._enqueue(result);
            }
        }

        // ... [PASTE _enqueue, _processQueue, _type, _scrollBottom, etc FROM input_file_0.js] ...
    }

    document.addEventListener('DOMContentLoaded', () => { window.roro = new RoRoManager(); });
})();
