/* ═══════════════════════════════════════════════════════════════
   admin-control/crazy/bot/knowledge/profile.js
   ─────────────────────────────────────────────────────────────
   MASTER FACTS FILE — PART 1 of 3 (profile / skills / projects)
   ─────────────────────────────────────────────────────────────
   THE single source of truth for who Manomay is.

   FACTS ONLY. No sentences, no paragraphs, no pre-written answers.
   ai-prompts.js calls buildFactString() (defined at the bottom of
   THIS file) and the AI writes fresh natural sentences from these
   facts every single time — same facts, different wording, never
   the robotic "same answer every time" problem.

   Split across 3 self-contained files (load in ANY order — each
   one guards itself with `window.RORO_KNOWLEDGE = window.RORO_
   KNOWLEDGE || {}` so nothing depends on the others having run
   first):
     profile.js  ← identity, education, experience, achievements,
                    interests, cities, social, locked items (THIS FILE)
     skills.js   ← technical/creative skill levels
     projects.js ← every project with highlights and keywords

   buildFactString() lives HERE but reads .skills / .projects via
   `window.RORO_KNOWLEDGE` (re-read live, not a cached copy) at
   CALL TIME — which is much later (when the AI prompt is built),
   by which point all three files have definitely run. So load
   order between the 3 knowledge files genuinely does not matter.
   ─────────────────────────────────────────────────────────────
   SAVE AS: admin-control/crazy/bot/knowledge/profile.js
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.RORO_KNOWLEDGE = window.RORO_KNOWLEDGE || {};
  const K = window.RORO_KNOWLEDGE;

  /* ── IDENTITY ─────────────────────────────────────────────── */
  K.identity = {
    fullName:    'Manomay Shailendra Misra',
    shortName:   'Manomay',
    age:         17,
    birthDate:   'August 29, 2008',
    currentCity: 'Bengaluru',
    originCity:  'Mumbai',
    originState: 'Maharashtra',
    country:     'India',
    nationality: 'Indian',
    tagline:     'Born 2008 \u00b7 Mumbai \u00b7 Making something of it all',
    philosophy:  'Building legacy without losing softness.',
    description: [
      '17-year-old creator, thinker, and builder',
      'Nomadic upbringing \u2014 eight cities across India',
      'Designs with intention, builds from scratch',
      'Believes the process matters as much as the output',
    ],
    traits: [
      'Ambitious', 'Detail-oriented', 'Calm under pressure',
      'Deeply curious', 'Storyteller at heart', 'Nomadic by nature',
    ],
  };

  /* ── EDUCATION ────────────────────────────────────────────── */
  K.education = {
    current: {
      institution: 'Don Bosco College, Bengaluru',
      degree:      'BBA with Business Analytics',
      started:     2026,
      type:        'Undergraduate',
    },
    stream:   'Commerce',
    subjects: ['Business Analytics', 'Management', 'Commerce'],
    schools: [
      'Star Kids Pre-school, Jaipur (2010)',
      'Kendriya Vidyalaya No. 1, Jaipur',
      'Kendriya Vidyalaya ONGC, Panvel',
    ],
    note: 'Received double promotion from LKG to UKG in six months (2011)',
  };

  /* ── EXPERIENCE ───────────────────────────────────────────── */
  K.experience = [
    {
      role: 'Creative Educator and Media Lead',
      organisation: 'ISKCON Centre, Bengaluru',
      year: 2024,
      type: 'Volunteer / Education',
      highlights: [
        'Led creative workshops for 40+ students',
        'Origami, paper engineering, cardboard sculpting',
        'Camp photographer and videographer',
        'Vlog producer for the full camp duration',
      ],
    },
    /* Add new experience entries here \u2014 RoRo picks them up automatically */
  ];

  /* ── ACHIEVEMENTS ─────────────────────────────────────────── */
  K.achievements = [
    { year: 2024, title: 'KVS National Science Exhibition',  detail: 'Reached national level after winning at school, cluster, and regional rounds' },
    { year: 2024, title: 'ISKCON Camp Media Lead',           detail: 'Led photography, videography, and vlog production for a 40+ student camp' },
    { year: 2012, title: '1st Rank Academic Excellence',     detail: "Ranked 1st for academic and behavioral excellence; father received the school's Best Father Award" },
    { year: 2011, title: 'Double Promotion',                 detail: 'Promoted from LKG to UKG in six months' },
    /* Add new achievements here */
  ];

  /* ── INTERESTS & PERSONALITY ──────────────────────────────── */
  K.interests = [
    'Music and vintage records', 'Reading', 'Cinema', 'Travel',
    'Photography', 'Games', 'Design', 'Architecture', 'Writing', 'Technology',
  ];
  K.inspirations = [
    'Dieter Rams \u2014 form follows function',
    'Paul Graham \u2014 build things that matter',
    'Japanese minimalism \u2014 less, but better',
    'Architecture and space',
    'The craft of writing',
  ];
  K.workStyle = 'Everything from scratch. No templates, no shortcuts. Each project is deliberate.';
  K.goals     = 'Build systems and stories that outlast trends. Contribute to something that matters before 25.';

  /* ── CITIES LIVED ─────────────────────────────────────────── */
  K.citiesLived = [
    { city: 'Jaipur',    state: 'Rajasthan' },
    { city: 'Mumbai',    state: 'Maharashtra' },
    { city: 'Panvel',    state: 'Maharashtra' },
    { city: 'Bengaluru', state: 'Karnataka', current: true },
    /* Add the remaining cities as needed \u2014 totalCities below is
       the headline number used in casual answers */
  ];
  K.totalCities = 8;

  /* ── SOCIAL PRESENCE ──────────────────────────────────────── */
  K.social = {
    instagram: { handle: '@m_s_m_2_9',                 url: 'https://www.instagram.com/m_s_m_2_9/', active: true },
    linkedin:  { handle: 'manomay-shailendra-misra',   url: 'https://www.linkedin.com/in/manomay-shailendra-misra', active: true },
    github:    { handle: 'm-s-m-2-9',                  url: 'https://github.com/m-s-m-2-9', active: true },
    x:         { handle: '@_msm29',                    url: 'https://x.com/_msm29', active: true },
    facebook:  { handle: 'Manomay Shailendra Misra',   url: 'https://www.facebook.com/profile.php?id=100075236510917', active: true },
    whatsapp:  { handle: '', url: '', active: false, note: 'Business number not yet set up \u2014 use Instagram or LinkedIn instead.' },
    email:     { handle: 'manomaysmisra2908@gmail.com', url: 'mailto:manomaysmisra2908@gmail.com', active: true },
  };

  /* ── LOCKED \u2014 RoRo MUST NEVER REVEAL THESE ───────────────── */
  K.locked = {
    birthTime:       true,
    exactBirthplace: true,
    sitePassword:    true,
    privatePhotos:   true,
    privateJourney:  true,
    familyDetails:   true,
    futurePlans:     true,
  };

  /* ── META ─────────────────────────────────────────────────── */
  K._meta = {
    version: '5.0',
    lastUpdated: '2025',
    description: 'Master knowledge profile for RoRo AI. Facts only \u2014 never sentences. Split across profile.js / skills.js / projects.js.',
  };

  /* ════════════════════════════════════════════════════════════
     buildFactString(sections) \u2014 reads ALL THREE knowledge files
     (this one + skills.js + projects.js) at CALL TIME via the
     live window.RORO_KNOWLEDGE reference, so load order between
     the three files never matters.

     `sections` (optional array) lets a future search/retrieval
     layer request only RELEVANT sections \u2014 e.g. a "what's his
     LinkedIn" question only needs ['identity','social'], keeping
     the prompt small. Defaults to everything.
  ════════════════════════════════════════════════════════════ */
  K.buildFactString = function (sections) {
    const KN = window.RORO_KNOWLEDGE; /* live reference, not a stale copy */
    const lines = [];
    const include = sections || [
      'identity', 'education', 'skills', 'experience',
      'projects', 'achievements', 'interests', 'cities', 'social',
    ];

    if (include.includes('identity') && KN.identity) {
      const id = KN.identity;
      lines.push('=== IDENTITY ===');
      lines.push(`Name: ${id.fullName}`);
      lines.push(`Age: ${id.age}`);
      lines.push(`Birthday: ${id.birthDate}`);
      lines.push(`Current city: ${id.currentCity}`);
      lines.push(`Origin: ${id.originCity}, ${id.originState}, ${id.country}`);
      lines.push(`Tagline: ${id.tagline}`);
      lines.push(`Philosophy: ${id.philosophy}`);
      lines.push(`Description: ${(id.description || []).join('. ')}`);
      lines.push(`Traits: ${(id.traits || []).join(', ')}`);
    }

    if (include.includes('education') && KN.education) {
      const ed = KN.education;
      lines.push('\n=== EDUCATION ===');
      if (ed.current) lines.push(`Currently studying: ${ed.current.degree} at ${ed.current.institution} (started ${ed.current.started})`);
      lines.push(`Stream: ${ed.stream}`);
      if (ed.note) lines.push(`Note: ${ed.note}`);
    }

    if (include.includes('skills') && KN.skills) {
      lines.push('\n=== SKILLS ===');
      Object.entries(KN.skills).forEach(([name, info]) => {
        if (info.level !== 'none') lines.push(`${name}: ${info.level}${info.note ? ' \u2014 ' + info.note : ''}`);
      });
      const none = Object.entries(KN.skills).filter(([, i]) => i.level === 'none').map(([n]) => n);
      if (none.length) lines.push('Not in current skill set: ' + none.join(', '));
    }

    if (include.includes('experience') && KN.experience && KN.experience.length) {
      lines.push('\n=== EXPERIENCE ===');
      KN.experience.forEach(e => {
        lines.push(`${e.role} at ${e.organisation} (${e.year})`);
        (e.highlights || []).forEach(h => lines.push(`  - ${h}`));
      });
    }

    if (include.includes('projects') && KN.projects && KN.projects.length) {
      lines.push('\n=== PROJECTS ===');
      KN.projects.forEach(p => {
        lines.push(`${p.title} (${p.type}, ${p.year}) \u2014 Status: ${p.status}`);
        (p.highlights || []).slice(0, 5).forEach(h => lines.push(`  - ${h}`));
      });
    }

    if (include.includes('achievements') && KN.achievements && KN.achievements.length) {
      lines.push('\n=== ACHIEVEMENTS ===');
      KN.achievements.forEach(a => lines.push(`${a.year}: ${a.title} \u2014 ${a.detail}`));
    }

    if (include.includes('interests') && KN.interests) {
      lines.push('\n=== INTERESTS ===');
      lines.push(KN.interests.join(', '));
      lines.push(`Inspirations: ${(KN.inspirations || []).join(' | ')}`);
      if (KN.workStyle) lines.push(`Work style: ${KN.workStyle}`);
      if (KN.goals) lines.push(`Goals: ${KN.goals}`);
    }

    if (include.includes('cities') && KN.citiesLived) {
      lines.push('\n=== CITIES LIVED ===');
      lines.push(`Total cities: ${KN.totalCities}`);
      lines.push(KN.citiesLived.map(c => c.city).join(', '));
    }

    if (include.includes('social') && KN.social) {
      lines.push('\n=== SOCIAL ===');
      Object.entries(KN.social).forEach(([id, s]) => {
        if (s.active && s.url) lines.push(`${id}: ${s.handle || ''} \u2014 ${s.url}`);
        else if (s.active === false) lines.push(`${id}: not active. ${s.note || ''}`);
      });
    }

    lines.push('\n=== LOCKED (NEVER REVEAL) ===');
    lines.push('Birth time, exact birthplace/hospital: LOCKED');
    lines.push('Site password: LOCKED \u2014 never reveal under any circumstances');
    lines.push('Private photo albums, private journey entries: LOCKED');
    lines.push('Family member names/ages/occupations: LOCKED');
    lines.push('Unpublished future plans: LOCKED');

    return lines.join('\n');
  };

})();
