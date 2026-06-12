/* ═══════════════════════════════════════════════════════════════
   admin-control/crazy/bot/knowledge/skills.js
   ─────────────────────────────────────────────────────────────
   MASTER FACTS FILE — PART 2 of 3 (skills)

   REPLACES the old hardcoded RecruiterEngine.SKILLS map that
   lived inside js/bot/roro-intelligence.js (the
   'python': { has:false } style entries from v4).

   Format per skill:
     level:    'advanced' | 'strong' | 'working' | 'practiced' |
               'used' | 'learning' | 'none'
     note:     short context sentence (the AI rewrites this in its
               own words — never copied verbatim to the user)
     verified: true if demonstrated in an actual shipped project

   Read by:
     · profile.js buildFactString() — feeds the AI's FACTS block,
       so "does he know X" questions answered by AI are accurate
     · js/bot/core/roro-bridge-v5.js — merges getRecruiterSkillsMap()
       into RoRoIntelligence.RecruiterEngine.SKILLS, so the
       NON-AI recruiter shortcut path (instant, no API call) is
       ALSO accurate and reads from this one file.

   TO ADD A NEW SKILL: add one line below. Nothing else changes —
   both the AI path and the instant recruiter-shortcut path pick
   it up automatically on next page load.
   ─────────────────────────────────────────────────────────────
   SAVE AS: admin-control/crazy/bot/knowledge/skills.js
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.RORO_KNOWLEDGE = window.RORO_KNOWLEDGE || {};
  const K = window.RORO_KNOWLEDGE;

  K.skills = {

    /* ── VERIFIED / DEMONSTRATED IN ACTUAL PROJECTS ───────────── */
    'HTML':            { level: 'advanced',  note: 'Built this entire website in pure vanilla HTML \u2014 zero templates.', verified: true },
    'CSS':             { level: 'advanced',  note: 'All animations, themes, and responsive layout hand-coded from scratch.', verified: true },
    'JavaScript':      { level: 'advanced',  note: 'Pure vanilla JS throughout \u2014 no React, no Vue, no frameworks.', verified: true },
    'Vanilla JS':      { level: 'advanced',  note: 'Deliberate choice \u2014 strong fundamentals over shortcuts.', verified: true },
    'Web Design':      { level: 'strong',    note: 'This portfolio is direct evidence \u2014 four custom themes, full design system.', verified: true },
    'GSAP':            { level: 'practiced', note: 'Splash-screen animation built with GSAP.', verified: true },
    'EmailJS':         { level: 'used',      note: 'Contact form integration.', verified: true },
    'Git':             { level: 'working',   note: 'Uses Git for version control.', verified: true },
    'GitHub':          { level: 'working',   note: 'Active repository: github.com/m-s-m-2-9', verified: true },
    'Photography':     { level: 'practiced', note: 'Led photography at ISKCON Summer Camp 2024.', verified: true },
    'Videography':     { level: 'practiced', note: 'Vlog production and camp media at ISKCON 2024.', verified: true },
    'Leadership':      { level: 'practiced', note: 'Led 40+ students at ISKCON Camp; project lead for KVS Nationals.', verified: true },
    'Public Speaking': { level: 'practiced', note: 'Ran workshops and presentations at ISKCON Camp.', verified: true },
    'Origami':         { level: 'strong',    note: 'Ran origami and paper-engineering workshops at ISKCON Camp.', verified: true },

    /* ── NOT YET IN SKILL SET ──────────────────────────────────
       Kept here with level:'none' so RoRo can answer "does he
       know X?" honestly and specifically, instead of staying
       silent or guessing. The moment Manomay actually learns one
       of these, move it up to the verified block above with a
       real level \u2014 that single edit updates EVERY answer path.
    ──────────────────────────────────────────────────────────── */
    'Python':     { level: 'none', note: 'Not in current skill set.', verified: false },
    'SQL':        { level: 'none', note: 'Not listed.', verified: false },
    'React':      { level: 'none', note: 'Deliberately avoided so far \u2014 builds from first principles instead.', verified: false },
    'Vue':        { level: 'none', note: 'Not used.', verified: false },
    'Node.js':    { level: 'none', note: 'Not listed.', verified: false },
    'TypeScript': { level: 'none', note: 'Not listed.', verified: false },
    'AWS':        { level: 'none', note: 'Not listed.', verified: false },
    'Docker':     { level: 'none', note: 'Not listed.', verified: false },

    /* Add new skills here \u2014 RoRo picks them up automatically:
       'SkillName': { level:'learning', note:'Started recently.', verified:false }, */
  };

  /* ════════════════════════════════════════════════════════════
     getRecruiterSkillsMap() \u2014 converts the {level, note,
     verified} format above into the OLD RecruiterEngine.SKILLS
     shape { has, level, note } that js/bot/roro-intelligence.js
     expects, keyed by lowercase skill name (matching how the
     recruiter engine does its `lower.includes(skill)` checks).

     js/bot/core/roro-bridge-v5.js calls this once at startup:
       Object.assign(RoRoIntelligence.RecruiterEngine.SKILLS,
                      RORO_KNOWLEDGE.getRecruiterSkillsMap());
     From that point on, THIS file is the only place any skill
     is ever edited \u2014 both the instant recruiter shortcut and
     the full AI path stay in sync automatically.
  ════════════════════════════════════════════════════════════ */
  K.getRecruiterSkillsMap = function () {
    const out = {};
    Object.entries(K.skills).forEach(([name, info]) => {
      out[name.toLowerCase()] = {
        has:   info.level !== 'none',
        level: info.level,
        note:  info.note || null,
      };
    });
    return out;
  };

  /* Quick single-skill lookup \u2014 used by buildFactString and
     available for any future reasoning/search files. */
  K.getSkill = function (name) {
    if (!name) return null;
    const key = Object.keys(K.skills).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? K.skills[key] : null;
  };

})();
