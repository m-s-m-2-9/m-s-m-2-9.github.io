/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/social.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls the SOCIAL PROOF page — logos marquee + testimonials.
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_SOCIAL = {

  sectionLabel: '03 — Social Proof', 
  sectionNum  : '03',              // 👈 Add this line if it exists!
  number      : '03',              // 👈 Add this line if it exists!
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
      text  : '"I am pleased to recommend Manomay Shailendra Misra, a commerce stream student of PM SHRI KV MEG & Centre, Bengaluru, who successfully completed Class XII in 2026. Having taught him for two years, I have witnessed his growth into a sincere, hardworking, and soft‑spoken young man with commendable qualities. Manomay is confident, disciplined, and possesses a natural inclination towards technology, which he explores with curiosity and dedication. His kind and helpful nature, coupled with strong communication skills and a pleasing personality, make him well‑liked among peers and teachers alike. He demonstrates remarkable leadership abilities, with a commanding presence and an articulate style that enables him to persuade and inspire others effectively. His sincerity, perseverance, and balanced outlook reflect his readiness to take on challenges and excel in diverse fields. I am confident that Manomay will prove to be an asset wherever he chooses to pursue his future endeavors."',
      author: '— Ranjana Pandey, Teacher @ K.V MEG and Centre',
    },
  ],

};
