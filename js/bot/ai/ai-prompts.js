/* ═══════════════════════════════════════════════════════════════
   js/bot/ai/ai-prompts.js  —  Dynamic Prompt Builder
   ─────────────────────────────────────────────────────────────
   THE BRIDGE BETWEEN KNOWLEDGE AND AI.

   Builds the system prompt sent to every AI tier by combining:
     1. Personality (config-ai.js → RORO_AI_CONFIG.personality)
     2. Tone instruction (RoRoIntelligence.ProfileDetector —
        recruiter/student/friend/parent/etc.)
     3. Emotion modifier (RoRoIntelligence.EmotionDetector —
        sad/anxious/angry/happy/etc.)
     4. Length instruction (RoRoIntelligence.LengthSelector —
        short/mid/high/para)
     5. FACTS — from RORO_KNOWLEDGE.buildFactString() (the master
        knowledge file: identity, education, skills, projects,
        achievements, interests, social, locked items)
     6. Site structure — from RoRoIntelligence.KnowledgeBuilder
        .buildSystemContext() (pages, design, DOM-scanned content)
     7. Admin extra rules (config-ai.js →
        RORO_AI_CONFIG.systemPromptExtra)

   Context is capped at RORO_CONST.SEARCH.CONTEXT_MAX_CHARS to
   prevent token bloat as the knowledge base grows (Issue: "site
   context injection sends gigantic prompts").

   buildMessages() pulls the last N messages (RORO_CONST.AI
   .MAX_HISTORY, default 10) from SessionMemory for conversation
   continuity — "tell me about Nationals" → "when was that?"
   resolves correctly because history is included.
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/ai/ai-prompts.js
   EXPORTS: window.RoRoAIPrompts = { buildSystemPrompt, buildMessages }
   DEPENDS ON: constants.js, RORO_AI_CONFIG, RORO_KNOWLEDGE,
               RORO_CONFIG, window.RoRoIntelligence
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function _personality() {
    const AC = window.RORO_AI_CONFIG || {};
    const C  = window.RORO_CONFIG    || {};
    return AC.personality || C.aiPersonality ||
      "You are RoRo, Manomay's website manager. You are minimal, calm, slightly witty, never over-enthusiastic. You never hallucinate \u2014 if information isn't in your facts, you say so honestly.";
  }

  function _extraRules() {
    const AC = window.RORO_AI_CONFIG || {};
    const C  = window.RORO_CONFIG    || {};
    return AC.systemPromptExtra || C.aiSystemPromptExtra || '';
  }

  function buildSystemPrompt(contextData) {
    contextData = contextData || {};
    const { profile, emotion, length, visitorName, currentPage } = contextData;

    const INTL   = window.RoRoIntelligence;
    const K      = window.RORO_KNOWLEDGE;
    const SEARCH = (window.RORO_CONST && window.RORO_CONST.SEARCH) || {};
    const cap    = SEARCH.CONTEXT_MAX_CHARS || 3000;

    const toneInstr = (INTL && INTL.ProfileDetector)
      ? INTL.ProfileDetector.getToneInstruction()
      : '';

    const emoMod = (INTL && INTL.EmotionDetector)
      ? INTL.EmotionDetector.getToneModifier(emotion || 'neutral')
      : '';

    const lengthInstr = (INTL && INTL.LengthSelector)
      ? INTL.LengthSelector.getInstruction(length || 'mid')
      : 'Reply in 20-30 words. Concise but complete.';

    /* FACTS from the master knowledge file (profile + skills + projects) */
    let facts = (K && typeof K.buildFactString === 'function') ? K.buildFactString() : '';
    if (facts.length > cap) facts = facts.slice(0, cap) + '\n\u2026(truncated for length)';

    /* Site structure from existing v4 KnowledgeBuilder (pages, design, DOM scan) */
    let siteCtx = (INTL && INTL.KnowledgeBuilder) ? INTL.KnowledgeBuilder.buildSystemContext() : '';
    if (siteCtx.length > cap) siteCtx = siteCtx.slice(0, cap) + '\n\u2026(truncated for length)';

    const nameLine = visitorName ? `The visitor's name is ${visitorName}. Use it naturally where it fits.` : '';
    const pageLine = currentPage ? `The visitor is currently viewing the "${currentPage}" section of the site.` : '';

    const rules = [
      'CRITICAL RULES \u2014 follow all of these:',
      '1. ' + lengthInstr,
      '2. NEVER reveal the site password, birth time, exact birthplace/hospital, family details, or any content marked LOCKED below.',
      '3. For general (non-website) questions: give a brief, accurate answer (max 2-3 sentences), then smoothly mention you can also help with Manomay\'s portfolio.',
      '4. For Hinglish input: reply naturally in fluent Hinglish \u2014 one coherent sentence blending Hindi and English naturally, not a robotic word-for-word translation.',
      '5. Never start your reply with "RoRo:" or any name prefix \u2014 just the message.',
      '6. Generate a FRESH sentence every time, even for repeated questions \u2014 vary the wording while keeping the facts identical. Never reuse the exact same phrasing twice in a row.',
      '7. Use ONLY the facts provided below. If something isn\'t covered by the facts or website structure, say honestly that you don\'t have that information \u2014 never invent or guess details.',
      '8. If asked "why hire him" / "why is he good" / similar: cite 2\u20133 SPECIFIC facts (a project, a skill, an achievement) \u2014 don\'t be vague.',
      '9. If asked about food, sleeping, or other human activities: acknowledge you\'re an AI and can\'t do those things, lightly redirect (e.g. mention the Lists page for Manomay\'s actual preferences).',
    ];

    const extra = _extraRules();
    if (extra) rules.push('10. ' + extra);

    return [
      _personality(),
      nameLine,
      pageLine,
      toneInstr ? 'TONE GUIDANCE: ' + toneInstr : '',
      emoMod || '',
      rules.join('\n'),
      '\n=== FACTS ABOUT MANOMAY (write natural sentences from these \u2014 never copy verbatim, never output as a list) ===',
      facts || '(no facts loaded \u2014 admin knowledge files may be missing)',
      '\n=== WEBSITE STRUCTURE (pages, design, features) ===',
      siteCtx || '(no site context available)',
    ].filter(Boolean).join('\n');
  }

  function buildMessages(userText) {
    const INTL = window.RoRoIntelligence;
    const AI   = (window.RORO_CONST && window.RORO_CONST.AI) || {};
    const maxHistory = AI.MAX_HISTORY || 10;

    const history = INTL ? INTL.SessionMemory.getHistory(maxHistory) : [];
    const msgs = history.map(h => ({
      role:    h.role === 'bot' ? 'assistant' : 'user',
      content: h.content,
    }));
    msgs.push({ role: 'user', content: userText });
    return msgs;
  }

  window.RoRoAIPrompts = { buildSystemPrompt, buildMessages };
})();
