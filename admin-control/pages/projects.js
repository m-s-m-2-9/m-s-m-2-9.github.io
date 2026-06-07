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
      meta       : 'Novel Writing · In Progress',
      status     : 'wip',
      label      : 'In Progress',
      /* This text appears in the popup when user clicks the project. */
      description: `Authoring a high-stakes, speculative survival thriller novel born from an intensely vivid, hyper-realistic dream that blurred the lines between nightmare and reality. The story explores a terrifying, unprecedented premise: the complete and sudden collapse of India's formidable tri-services defense grid, leaving the nation entirely vulnerable as a foreign power launches a ruthless blitzkrieg targeting civilian populations with jet airstrikes and missile barrages. 

Stripped of the traditional safety nets of military protection, the narrative pivots away from geopolitical strategies to focus entirely on a localized, boots-on-the-ground human perspective. It follows a young protagonist thrust into sudden adulthood, forced to navigate the chaos of an active war zone alongside a close-knit group of friends. It is a raw, fast-paced survival story that dissects the psychological toll of urban warfare, the instinct to protect one's own, and the resilience of youth when forced to survive amidst the ruins of their world. Currently in active drafting, the novel aims to capture the exact cinematic intensity and haunting realism that inspired its inception.`,
    },


        {
      title      : 'MSM Personal Portfolio Ecosystem',
      meta       : 'Web Architecture · 2025 – Present',
      status     : 'ongoing',
      label      : 'Active Development',
      /* This text appears in the popup when user clicks the project. */
      description: `The highly optimized, minimalist personal portfolio ecosystem currently being viewed. Engineered entirely from the ground up utilizing strict semantic HTML5 structural tags, raw CSS3 layouts, and vanilla asynchronous JavaScript modules—deliberately bypassing heavy framework dependencies to achieve near-zero latency rendering performance. The front-end visual architecture features a crisp, geometric line-art aesthetic customized with uniform layout borders, synchronized accent-glow states, and fully justified text formatting blocks. 

The system implements a complex array of interactive engineering scripts: a fluid horizontal timeline mapping life narratives, custom modal views, and an absolute asynchronous clipboard execution model that lets users natively copy site links inline without triggering disruptive target-tabs or browser alerts. It includes a multi-device gaming deck containing five built-in public engines—including custom-drawn outline vector SVGs for Snake, 2048, and Memory Match—coupled with a private GitHub/APK family access directory. Backed by an isolated text-based content management architecture that runs on flat data files, every pixel and interaction script across this platform was written entirely by hand to maintain absolute structural integrity.`,
    },



  ],

};
