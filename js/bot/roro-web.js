(function() {
    'use strict';

    const RoRoWeb = {
        async lookup(query) {
            try {
                // Tier 5: DuckDuckGo / Wikipedia Fallback
                const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
                const data = await response.json();
                if (data.AbstractText) return data.AbstractText;
                
                return "I've searched the local data streams, but I cannot provide a definitive answer for that right now.";
            } catch (e) {
                return null;
            }
        }
    };

    window.RoRoWeb = RoRoWeb;
})();
