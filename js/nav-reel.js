/* ═══════════════════════════════════════════════════════════
   js/nav-reel.js
   MSM — Navbar Letter-Reel Animation
   ─────────────────────────────────────────────────────────
   Triggers ONLY on theme change. Never on load, hover, scroll,
   or navigation. Navbar letters cycle through random uppercase
   chars and settle one-at-a-time from left to right.
   ─────────────────────────────────────────────────────────
   Add to index.html before </body>:
   <script src="js/nav-reel.js"></script>
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Character pool — uppercase letters + digits only. No symbols. */
  var POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function randChar() {
    return POOL[Math.floor(Math.random() * POOL.length)];
  }

  /* ── Animate one element's text ─────────────────────────── */
  function reelElement(el) {
    if (!el || el._reeling) return;
    el._reeling = true;

    var original = (el.dataset.reelText || el.textContent).trim();

    /* Cache original text so re-triggers always use the real text */
    if (!el.dataset.reelText) el.dataset.reelText = original;

    /* Lock width so layout doesn't shift during animation */
    var lockedW = el.getBoundingClientRect().width;
    el.style.display   = 'inline-block';
    el.style.minWidth  = lockedW + 'px';

    var startTime    = performance.now();
    var totalMs      = 750;   /* total animation duration in ms     */
    var chars        = original.split('');
    var realChars    = chars.filter(function(c){ return c !== ' '; }).length;

    function tick(now) {
      var elapsed  = Math.min(now - startTime, totalMs);
      var progress = elapsed / totalMs;
      var result   = '';
      var realIdx  = 0;

      for (var i = 0; i < chars.length; i++) {
        var c = chars[i];

        if (c === ' ') {
          result += '\u00a0'; /* non-breaking space preserves spacing */
          continue;
        }

        /*
         * Each character settles left-to-right.
         * First char settles at 40% of duration.
         * Last char settles at 100% of duration.
         * Formula: settleAt = 0.40 + (charIndex/totalChars) * 0.60
         */
        var settleAt = 0.40 + (realIdx / Math.max(realChars - 1, 1)) * 0.60;

        if (progress >= settleAt) {
          result += c;           /* settled: show correct letter */
        } else {
          result += randChar();  /* unsettled: show random char  */
        }

        realIdx++;
      }

      el.textContent = result;

      if (elapsed < totalMs) {
        requestAnimationFrame(tick);
      } else {
        /* Restore exactly */
        el.textContent = original;
        el.style.minWidth = '';
        el._reeling = false;
      }
    }

    requestAnimationFrame(tick);
  }

  /* ── Animate hamburger lines ─────────────────────────────── */
  function reelHamburger(btn) {
    if (!btn || btn._reeling) return;
    btn._reeling = true;
    btn.classList.add('reel-hamburger-active');
    setTimeout(function () {
      btn.classList.remove('reel-hamburger-active');
      btn._reeling = false;
    }, 520);
  }

  /* ── Trigger all nav items simultaneously ─────────────────── */
  function triggerReel() {
    /* Desktop nav links: HOME, IDENTITY, SOCIAL, etc. */
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
      reelElement(link);
    });

    /* Desktop sidebar hamburger */
    var sbHamburger = document.querySelector('.sb-hamburger');
    if (sbHamburger) reelHamburger(sbHamburger);

    /* Mobile hamburger */
    var mobileHamburger = document.querySelector('.hamburger');
    if (mobileHamburger) reelHamburger(mobileHamburger);

    /* Any page title temporarily shown in the navbar
       (sidebar-controller injects these on sidebar page open) */
    var navTitle = document.querySelector('.sb-nav-title, .nav-page-title, [data-nav-title]');
    if (navTitle) reelElement(navTitle);
  }

  /* ── Watch for data-theme attribute changes ──────────────── */
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.type === 'attributes' && m.attributeName === 'data-theme') {
        triggerReel();
      }
    });
  });

  /* Start observing once DOM is ready */
  function init() {
    observer.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ['data-theme'],
    });

    /*
     * Also observe the navbar for dynamically injected title elements
     * (e.g. when sidebar opens a page and inserts a title into the nav).
     * When such an element appears, reel it in.
     */
    var nav = document.getElementById('nav');
    if (nav) {
      var navObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType === 1 && node.textContent.trim().length > 0) {
              /* Only if it looks like a page title element */
              if (node.classList.contains('sb-nav-title') ||
                  node.classList.contains('nav-page-title') ||
                  node.dataset.navTitle !== undefined) {
                reelElement(node);
              }
            }
          });
        });
      });
      navObserver.observe(nav, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
