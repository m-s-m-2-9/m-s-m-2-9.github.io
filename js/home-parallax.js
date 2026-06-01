/* ═══════════════════════════════════════════════════════════
   js/home-parallax.js
   MSM — Homepage Grid Parallax
   ─────────────────────────────────────────────────────────
   The blueprint grid on the homepage scrolls at 25% of the
   content scroll speed, creating a subtle depth illusion.
   ─────────────────────────────────────────────────────────
   APPLIES: homepage (#page-home .hero-grid) only.
   NO effect on any other page. Does not touch the navbar.
   ─────────────────────────────────────────────────────────
   Add to index.html before </body>:
   <script src="js/home-parallax.js"></script>
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var grid     = null;
  var page     = null;
  var rafPending = false;

  function applyParallax() {
    if (!grid || !page) return;
    /*
     * Foreground scrolls at 1x (normal).
     * We counter-scroll the grid by +75% of scrollTop,
     * so the grid only appears to move 25% as far.
     *
     *   net grid movement = scrollTop - (scrollTop * 0.75)
     *                     = scrollTop * 0.25   ✓
     */
    var offset = page.scrollTop * 0.75;
    grid.style.transform = 'translateY(' + offset + 'px)';
    rafPending = false;
  }

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(applyParallax);
  }

  function init() {
    page = document.getElementById('page-home');
    grid = page ? page.querySelector('.hero-grid') : null;

    if (!page || !grid) return;

    /* Passive listener for maximum scroll performance */
    page.addEventListener('scroll', onScroll, { passive: true });

    /* Reset on page hide (navigating away) so it's clean if user returns */
    var resetOnHide = function () {
      if (document.querySelector('#page-home.active')) return;
      grid.style.transform = '';
    };

    /*
     * Watch for #page-home losing its .active class
     * (when user navigates to another section).
     */
    var pageObs = new MutationObserver(resetOnHide);
    pageObs.observe(page, { attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
