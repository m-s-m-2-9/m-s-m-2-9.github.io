/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/clock.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls the BIRTHDAY CLOCK page.
   ───────────────────────────────────────────────────────────────────
   ⚠️  IMPORTANT: The birthday date drives the whole countdown timer.
   Format: 'MONTH DD' — must be exactly this. Examples:
     'August 29'    'January 1'    'December 31'
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_CLOCK = {

  /* ── Birthday Configuration ─────────────────────────────────────── */
  birthdayDate  : 'August 29',   /* ← month + day of birth (no year)    */
  birthYear     : 2008,          /* ← year of birth (for age calculation)*/
  birthTime     : 'Ap' + 'pr' + 'ox' + 'im' + 'at' + 'el' + 'y 1:00 – 1:30 PM IST', 
  birthPlace    : 'An' + 'dh' + 'er' + 'i, Ma' + 'ha' + 'ra' + 'sh' + 'tr' + 'a, In' + 'di' + 'a',        

  /* ── Countdown Label ─────────────────────────────────────────────── */
  countdownLabel: 'Next birthday in...',

  /* ── Birthday Wish (the clickable text on your birthday) ──────────
     Visible only on your actual birthday.
  */
  wishText      : '✦  Happy Birthday, Manomay  ✦',

};
