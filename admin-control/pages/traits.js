/* ═══════════════════════════════════════════════════════════
   admin-control/pages/traits.js
   ───────────────────────────────────────────────────────────
   Controls the TRAITS / SKILLS page (page 10).

   HOW TO EDIT:
   · heroQuote     — the large italic quote at the top
   · marqueeItems  — the horizontally scrolling words strip
   · skills        — skill name + level 0-100 (shown as bar)
   · hobbies       — simple text/emoji list below the bars
═══════════════════════════════════════════════════════════ */

window.ADMIN_TRAITS = {

  sectionLabel: '10 — Traits',

  /* ── Large italic opening quote ─── */
  heroQuote: '"Jack of all trades, master of none — and that\'s the point."',

  /* ── Horizontally scrolling strip of words ─── */
  /*
     Each string appears once; the track duplicates itself for seamless loop.
     Mix skills, hobbies, and interests freely.
  */
  marqueeItems: [
    'Public Speaking',
    'Leadership',
    'Media Production',
    'Creative Writing',
    'Photography',
    'Origami',
    'Business Strategy',
    'Event Management',
    'Music',
    'Storytelling',
    /* Add more strings here:  'Your Skill', */
  ],

  /* ── Skills with progress bars ─── */
  /*
     percent: 0 to 100 — controls the filled width of the bar.
     The bar fill animates on page load.
  */
  skills: [
    { name: 'Public Speaking',    percent: 85 },
    { name: 'Leadership',         percent: 80 },
    { name: 'Media Production',   percent: 70 },
    { name: 'Creative Writing',   percent: 75 },
    { name: 'Photography',        percent: 65 },
    { name: 'Event Management',   percent: 72 },
    /* Add more: { name: 'Skill Name', percent: 60 }, */
  ],

  /* ── Hobbies & interests (shown below skills) ─── */
  /*
     Start each with an emoji for the icon column effect.
     These render as plain grid items — no progress bar.
  */
  hobbies: [
    '🎵 &nbsp; Music & Vintage Records',
    '📚 &nbsp; Reading & Philosophy',
    '🎬 &nbsp; Cinema & Storytelling',
    '✈️ &nbsp; Travel & Exploration',
    '🎮 &nbsp; Games & Strategy',
    '📷 &nbsp; Photography & Visual Media',
    /* Add more: '🎨 &nbsp; Your Hobby', */
  ],

};
