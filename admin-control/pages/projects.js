/* ═══════════════════════════════════════════════════════════
   admin-control/pages/projects.js
   ───────────────────────────────────────────────────────────
   Controls the PROJECTS page (page 11).

   NEW DESIGN: Single flat list (no tabs).
   Each project has a status label on the right.
   Clicking any project opens a popup with the full description.

   STATUS OPTIONS (copy-paste exactly):
     'completed' → green badge
     'ongoing'   → gold badge
     'abandoned' → red badge

═══════════════════════════════════════════════════════════ */

window.ADMIN_PROJECTS = {

  sectionLabel: '11 — Projects',
  heading     : 'Things I\'ve built.\nThings I\'m building.',

  /* ── Flat projects list ───────────────────────────────── */
  projects: [

        {
      title      : 'Full-Stack E-Commerce Ecosystem',
      meta       : 'Web, Android & Automation · 2026',
      status     : 'completed',
      label      : 'Completed',
      /* This text appears in the popup when user clicks the project. */
      description: `Built an end-to-end e-commerce infrastructure containing a context-aware Web application, a standalone Android APK, and an automated WhatsApp conversational engine—all powered by a single-file core architectural system. The front-end layout was fully engineered within a single index.html using vanilla HTML5, CSS3 variables, and custom asynchronous JavaScript modules. It features seamless light/dark theme switching, animated carousels across 20 distinct categories, 600+ unique inventory item entries, interactive shopping carts, and dynamic persistent wishlists.

To bypass heavy Android compiler configurations, the single-file web layout was compiled into a standalone, production-ready Android APK using WebIntoApp wrappers, tailored with a custom-designed app logo and fully responsive touch viewports. The front-end leverages advanced context-aware UI engineering to programmatically detect local device metrics and greet users with context-specific messaging dynamically determined by their time of visit. A custom recommendation script acts as a localized data pipeline: it scans the user's explicit preferences, down-ranks to historical purchase records if unselected, and falls back to a sequence tracking previously viewed items.

The backend infrastructure utilizes Firebase for secure authentication and user management, deploying automated OTP-based logic to verify identity, manage multi-address profiles, and instantly remember sessions for zero-friction future logins. Database operations are completely mapped into Airtable's relational web APIs, serving as a unified system-of-record. The schema actively processes live product inventory fields alongside separate data tracking layers for user profile properties, pending orders, upcoming deliveries, and historically completed delivery logs. 

Designed explicitly to build user retention, the system supports versatile delivery windows ranging from early morning to late night, dynamic path-routing for Cash on Delivery (COD) or immediate digital checkouts, and a unified workspace that delivers clean functionality without bloating dependencies.`,
    },


    {
      title      : 'Until The Bullet Woke Me',
      meta       : 'Novel Writing · 2025',
      status     : 'completed',
      label      : 'Completed',
      description: 'Replace this with a description of "Until The Bullet Woke Me".\n\nWhat is it? A story, a script, a poem? What was the theme? What inspired it? Where was it published or shared?',
    },

    {
      title      : 'MSM Personal Website',
      meta       : 'Web · 2025 – Present',
      status     : 'ongoing',
      label      : 'Currently Working On',
      description: 'This website you\'re currently on.\n\nBuilt from scratch with vanilla HTML, CSS, and JavaScript. No frameworks, no templates. Features a cinematic intro, a custom content management system, a sidebar navigation system, 5 built-in games, photo albums, and a full thoughts section.\n\nEvery pixel was placed deliberately.',
    },


  ],

};
