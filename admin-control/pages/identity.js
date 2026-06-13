/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/identity.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls all text on the IDENTITY / ABOUT page.
   ───────────────────────────────────────────────────────────────────
   SECTIONS YOU CAN EDIT:
   · sectionLabel   — the small "01 — Identity" label
   · introQuote     — the large italic quote at the top
   · bodyText       — the main paragraph (150–200 words recommended)
   · photoCaption   — the label on your photo
   · secretText     — the private text (visible after password unlock)
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_IDENTITY = {

  /* ── Section label ─────────────────────────────────────────────── */
  sectionLabel: '01 — Identity',

  /* ── Photo caption ─────────────────────────────────────────────── */
  photoCaption: 'Republic Day — 2026',

  /* ── Intro quote (large italic, above body text) ──────────────── */
  introQuote: '"Building legacy without losing softness."',

  /* ── Main body text ───────────────────────────────────────────── */
  /*
    Write in plain text. Paragraphs separated by \n\n (double newline).
    Keep to 150–200 words total for best readability.
    ─────────────────────────────────────────────────────────────────
    Currently placeholder — replace with your real story.
  */
  bodyText: `Manomay Shailendra Misra is a Business Administration student, creative strategist, and digital storyteller driven by the idea that identity should feel timeless, not temporary. Raised across different cities and cultures of India, his perspective was shaped by movement, observation, and adaptation — blending old-world values with modern creative ambition.

His work exists at the intersection of aesthetics, leadership, media, and technology. From directing visual concepts and cinematic web experiences to managing creative teams, educational programs, and storytelling-driven projects, he focuses on creating things that feel emotionally human yet professionally refined.

Deeply inspired by vintage culture, 90s atmosphere, classic music, meaningful conversations, and quiet details often ignored by fast modern life, he believes creativity should carry emotion, memory, and presence — not just attention.

Beyond academics, he has worked in media coordination, photography, videography, branding concepts, event management, and creative leadership roles. Whether building digital experiences, crafting narratives, or shaping future startup ideas, his approach remains the same: calm execution, strong identity, and thoughtful detail.

This website is not just a portfolio.
It is an archive of thought, growth, experiments, memories, aesthetics, and the quiet construction of a future still unfolding.`,

  /* ── Secret / private text (unlocked by password) ─────────────── */
  /*
    This is only visible after entering the correct password
    from admin-control/other/passwords.js → about.
    Write whatever you want here — it's private.
  */
  secretText: '',

};
