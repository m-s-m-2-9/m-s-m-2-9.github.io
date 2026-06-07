/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/cv.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls all content on the CV / RÉSUMÉ page.
   ───────────────────────────────────────────────────────────────────
   HOW TO ADD AN ENTRY:
   Copy any object in the 'experience' or 'education' array,
   paste it below the last one, and fill in your details.
   Make sure there's a comma between objects.

   HOW TO ADD A SKILL:
   Add the skill name (as a string) to the 'skills' array.
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_CV = {

  /* ── Page header ───────────────────────────────────────────────── */
  name     : 'Manomay\nShailendra Misra', /* \n = line break in the heading */
  title    : 'Student',   /* ← shown below name in accent color */

  /* ── Contact block (top right of CV) ──────────────────────────── */
  contact: [
    'manomaysmisra2908@gmail.com',
    '+91 8369139301',
    'Bengaluru, Karnataka',
    'https://m-s-m-2-9.github.io',     /* ← your portfolio URL */
  ],

  /* ── Summary paragraph ─────────────────────────────────────────── */
  summary: 'Manomay Shailendra Misra is a BBA with Business Analytics student with a strong creative and strategic mindset, blending modern branding, content creation, and visual storytelling with leadership and management skills. Passionate about startups, media, and digital experiences, he focuses on building ideas that feel both professional and creatively distinctive.',

  /* ── Work experience entries ───────────────────────────────────── */
  /*
    Each entry:
    {
      title : 'Role Title',
      org   : 'Company / Organisation',
      date  : '2024',
      desc  : 'What you did. Be specific. Use past tense.',
    }
    Ordered newest first.
  */
  experience: [
    {
      title: 'Creative Educator & Media Coordinator',
      org  : 'ISKCON Summer Camp',
      date : '2024',
      desc : `Mentored 40+ students (ages 5–15) in an ISKCON cultural and creative arts program. Designed and facilitated hands-on workshops in origami, paper engineering, and cardboard sculpting.Served as Media Lead executing professional photography, videography, and end-to-end vlog production. Coordinated educational temple excursions.`
      },



     {
      title: 'Visual Designer',
      org  : 'Golden Star PG',
      date : '2022',
      desc : `Designed and launched the official brand logo for a single-outlet premium paying guest (PG) accommodation. Developed clean, modern visual assets to establish a distinct local identity, enhance regional visibility, and attract prospective residents.`,
    },

     

     {
      title: 'Solutions Architect',
      org  : 'Mayura Woods',
      date : '2024',
      desc : `Designed and deployed a 24/7 automated chatbot for a furniture business. Architected the core conversation flows to handle customer inquiries continuously, streamlining digital engagement and improving response efficiency for the brand.`,
    },


     
    /* ── Add more entries here ──
    {
      title: 'Replace',
      org  : 'Company Name',
      date : '2024 – 2025',
      desc : 'Replace',
    },
    ─────────────────────────── */
  ],

  /* ── Education entries ─────────────────────────────────────────── */
  education: [
    {
      title: 'Don Bosco College',
      org  : 'Bachelors of Business Administration with Business Analytics',
      date : '2026 – Present',
    },


     {
      title: 'PM SHRI Kendriya Vidyalaya MEG and Centre',
      org  : 'Class XI-XII',
      date : '2024 – 2026',
    },
    /* ── Add more entries here ── */
  ],

  /* ── Skills (shown as tags) ────────────────────────────────────── */
  /*
    Add any skill as a string. Keep them short (1–3 words each).
  */
  skills: [
    'Leadership',
    'Strategic Thinking',
    'Social Media Sense',
    'Public Speaking',
    'Media & Brand Awareness',
    'Team Coordination',
    'Visual Storytelling',
    'Management',
    'AI Prompting'
    /* Add more: 'Your Skill', */
  ],

  /* ── CV PDF download link ──────────────────────────────────────── */
  pdfPath: 'manomay-cv.pdf',  /* ← file must be in root of your site replace*/

};
