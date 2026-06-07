/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/games.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls the GAMES page — both public games and private family games.

   HOW TO ADD A PUBLIC GAME:
   Add an object to the 'publicGames' array.
   The 'type' field tells main.js which game engine to launch.
   Existing types: 'snake' | 'memory' | '2048' | 'reaction' | 'word'

   HOW TO ADD A PRIVATE GAME:
   Add an object to the 'privateGames' array.
   Set 'linkType' to 'github' or 'apk'.
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_GAMES = {

  sectionLabel: '13 — Games',
  heading     : 'Take a break.\nPlay something.',

  /* ── Public Games ───────────────────────────────────────────────── */
  publicGames: [
    {
      type : 'snake',
      icon : `<svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2a4 4 0 0 0-4 4v4a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-4a2 2 0 0 1 2-2h2a2 2 0 0 0 2-2V6a4 4 0 0 0-4-4z"/>
  <path d="M18 6h.01"/>
</svg>`,
      name : 'Snake',
      desc : 'Classic snake. Swipe,Arrow keys or WASD. Eat, grow, don\'t die.',
    },
    {
      type : 'memory',
      icon : `<svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 22c0-3 1.5-5 4-5 2.5 0 4-1.5 4-4s-1.5-4-4-4c0-2.5-1.5-4-4-4S8 6.5 8 9c-2.5 0-4 1.5-4 4s1.5 4 4 4c2.5 0 4 2 4 5z"/>
  <path d="M12 5v12"/>
</svg>`,
      name : 'Memory Match',
      desc : 'Flip cards and find matching pairs. How fast can you clear the board?',
    },
    {
      type : '2048',
      icon : `<svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2"/>
  <path d="M3 10h18M3 14h18M10 3v18M14 3v18"/>
</svg>`,
      name : '2048',
      desc : 'Slide tiles, combine numbers, reach 2048. Sounds easy. It\'s not.',
    },
    {
      type : 'reaction',
      icon : `<svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
</svg>`,
      name : 'Reaction Time',
      desc : 'Wait for the flash. Click as fast as you can. Test your reflexes.',
    },
    {
      type : 'word',
      icon : `<svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 10h4M4 14h6M14 6h6M14 10h4M14 18h4"/>
  <path d="m4 6 4 4-4 4"/>
</svg>`,
      name : 'Word Scramble',
      desc : 'Unscramble the letters. Vocab meets speed. Can you crack them all?',
    },
  ],

  /* ── Private / Family Games ──────────────────────────────────────── */
  privateGames: [
    {
      icon    : `<svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="6" width="20" height="12" rx="2"/>
  <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/>
</svg>`,
      name    : 'Private Game 1 — REPLACE',
      desc    : 'A personal game for family only. Replace this description.',
      linkType: 'github',        /* ← 'github' or 'apk' */
      url     : 'YOUR_GITHUB_LINK_HERE',
    },
    {
      icon    : `<svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="5" y="2" width="14" height="20" rx="2"/>
  <circle cx="12" cy="18" r="1"/>
</svg>`,
      name    : 'Private Game 2 — REPLACE',
      desc    : 'Download the APK and install to play.',
      linkType: 'apk',
      url     : 'YOUR_APK_LINK_HERE',
    },
  ],

};
