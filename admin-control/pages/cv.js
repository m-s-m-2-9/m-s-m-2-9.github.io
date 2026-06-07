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
    'https://m-s-m-2-9.github.io/',     /* ← your portfolio URL */
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
      desc : `Led and mentored a diverse group of 40+ students (ages 5–15) through an immersive summer program blending cultural education with hands-on creative arts. Designed and facilitated workshops in origami, paper engineering, and cardboard sculpting.

Beyond the classroom, served as Media Lead — capturing the camp's energy through professional photography and videography, managing end-to-end vlog production, and coordinating educational excursions to the ISKCON temple.`,
    },
    /* ── Add more entries here ──
    {
      title: 'Your Role Title',
      org  : 'Company Name',
      date : '2024 – 2025',
      desc : 'What you did here.',
    },
    ─────────────────────────── */
  ],

  /* ── Education entries ─────────────────────────────────────────── */
  education: [
    {
      title: 'Don Bosco College',
      org  : 'Bachelors of Business Administration with Business Analytics ',
      date : '2026 – Present',
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
