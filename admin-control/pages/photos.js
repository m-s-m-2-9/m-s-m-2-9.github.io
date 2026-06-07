/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/photos.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Re-exports photo/album data from images.js for the Photos page.
   Album content is edited in: admin-control/other/images.js

   THIS FILE IS A PASS-THROUGH — you do not normally need to edit it.
   Edit your albums in: admin-control/other/images.js
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_PHOTOS = {

  sectionLabel: '07 — Photos',
  heading     : 'Captured moments.',
  subheading  : 'Click any album to browse. Some collections are private.',

  /* Albums come from window.ADMIN_IMAGES — edited in other/images.js */

};
