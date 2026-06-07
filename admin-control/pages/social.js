/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/social.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls the SOCIAL PROOF page — logos marquee + testimonials.
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_SOCIAL = {

  sectionLabel: '03 — Social Proof',
  heading     : 'People Who\nShaped My Work.',

  /* ── Scrolling logos / company names ────────────────────────────── */
  /*
    These appear in the infinite scrolling strip.
    Add your real company/org names here.
  */
  logos: [
    'Iskcon',
    'Mayura Woods',
    'Golden Star PG',
    'Work In Progress',
    /* Add more: 'Company Name', */
  ],

  /* ── Testimonials ───────────────────────────────────────────────── */
  testimonials: [
    {
      stars : 4,
      text  : '"Manomay did a fantastic job designing the logo for our PG. He took the time to truly understand the vibe and target audience of our accommodation. The entire process was incredibly smooth, and he translated our vision into a creative, memorable logo that perfectly represents our brand. Highly recommend his design services!"',
      author: '— Radha Madankar, Owner @ Golden Star PG',
    },
    {
      stars : 5,
      text  : '"Manomay successfully integrated our website’s chatbot automation, delivering human-like, 24/7 customer support. Their technical expertise and smart workflows reduced our support workload and streamlined lead qualification. Highly recommended for anyone wanting to elevate their digital presence!"',
      author: '— Ramaiah SK, Manager @ Mayura Woods',
    },
    {
      stars : 5,
      text  : '"Pending Testimonial."',
      author: '— Name, Role @ Company',
    },
  ],

};
