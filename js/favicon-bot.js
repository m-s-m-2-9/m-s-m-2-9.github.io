/* ═══════════════════════════════════════════════════════════
   js/favicon-bot.js  v3.0 — MSM Living Favicon
   ─────────────────────────────────────────────────────────
   · Transparent background — just eyes, nothing else
   · Follows cursor with natural eased motion
   · 15 distinct emotions, clearly visible at 32px
   · Full absence-phase story when tab is hidden
   · Browser theme by default, switchable to site theme
   · Terminal integration for theme toggle
   ─────────────────────────────────────────────────────────
   ADD TO index.html before </body>:
   <script src="admin-control/crazy/favicon-config.js"></script>
   <script src="js/favicon-bot.js"></script>
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     § 0  CONFIG
  ═══════════════════════════════════════════════════════ */
  const CFG = window.MSM_FAVICON_CONFIG || {};
  if (CFG.enabled === false) return;

  /* ═══════════════════════════════════════════════════════
     § 1  CANVAS SETUP
  ═══════════════════════════════════════════════════════ */
  const C = 32;
  const testEl = document.createElement('canvas');
  if (!testEl.getContext) { _fallback(); return; }
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = C;
  const ctx = canvas.getContext('2d');
  if (!ctx) { _fallback(); return; }

  /* ═══════════════════════════════════════════════════════
     § 2  CONSTANTS
     Eyes are sized to fill as much of 32x32 as possible.
     Transparent background means only the eye shapes show.
  ═══════════════════════════════════════════════════════ */
  const EL  = { cx: 10, cy: 17 };   // left eye centre
  const ER  = { cx: 22, cy: 17 };   // right eye centre
  const ERX = 5.2;                   // eye horizontal radius
  const ERY = 6.5;                   // eye vertical radius (full open)
  const PR  = 2.0;                   // pupil radius
  const MPO = 2.2;                   // max pupil offset from cursor
  const BHW = 5.0;                   // brow half-width
  const BBY = 8.5;                   // brow base Y (pixels from top)

  /* ═══════════════════════════════════════════════════════
     § 3  EMOTION DEFINITIONS
     ─────────────────────────────────────────────────────
     lid       : upper-lid openness  0=closed  1=normal  1.3=wide
     ps        : pupil scale        0.6=small  1.0=normal  1.25=large
     pyO       : pupil Y offset     negative=look up  positive=look down
     lowerRise : how much lower lid rises (happy squint)  0–0.55
     brow      : [leftOuter_dy, leftInner_dy, rightInner_dy, rightOuter_dy]
                  negative = brow moves UP   positive = brow moves DOWN
     tears     : whether tear drops spawn
     ─────────────────────────────────────────────────────
     All values are intentionally DRAMATIC so they are
     clearly visible at 32 × 32 pixels.
  ═══════════════════════════════════════════════════════ */
  const EMOTIONS = {

    idle: {
      lid: 1.00, ps: 1.00, pyO: 0,    lowerRise: 0,    tears: false,
      brow: [ 0,    0,    0,    0   ]
    },

    curious: {
      lid: 1.08, ps: 1.10, pyO: -1,   lowerRise: 0,    tears: false,
      brow: [-1,   -3.5, -3.5, -1   ]
    },

    happy: {
      lid: 0.78, ps: 1.00, pyO: 0,    lowerRise: 0.45, tears: false,
      brow: [-2,   -3.5, -3.5, -2   ]
    },

    excited: {
      lid: 1.22, ps: 1.15, pyO: -0.5, lowerRise: 0,    tears: false,
      brow: [-3,   -4.5, -4.5, -3   ]
    },

    surprised: {
      lid: 1.32, ps: 1.18, pyO: -0.5, lowerRise: 0,    tears: false,
      brow: [-4.5, -5.5, -5.5, -4.5 ]
    },

    sleepy: {
      lid: 0.38, ps: 0.88, pyO: 1.5,  lowerRise: 0,    tears: false,
      brow: [ 2.5,  2.5,  2.5,  2.5 ]
    },

    sleeping: {
      lid: 0.00, ps: 0.00, pyO: 0,    lowerRise: 0,    tears: false,
      brow: [ 2.5,  2.5,  2.5,  2.5 ]
    },

    searching: {
      lid: 1.05, ps: 1.00, pyO: 0,    lowerRise: 0,    tears: false,
      brow: [-1,   -3,   -3,   -1   ]
    },

    bored: {
      lid: 0.60, ps: 0.92, pyO: 1.5,  lowerRise: 0,    tears: false,
      brow: [ 2.5,  2.5,  2.5,  2.5 ]
    },

    sad: {
      lid: 0.88, ps: 0.93, pyO: 2,    lowerRise: 0,    tears: false,
      brow: [ 0.5, -4,   -4,    0.5  ]   // outer raised, inner drops = sad arch
    },

    crying: {
      lid: 0.75, ps: 0.90, pyO: 2,    lowerRise: 0,    tears: true,
      brow: [ 0.5, -4.5, -4.5,  0.5  ]
    },

    relieved: {
      lid: 0.92, ps: 1.00, pyO: 0,    lowerRise: 0.15, tears: false,
      brow: [-1,   -2,   -2,   -1   ]
    },

    suspicious: {
      lid: 0.68, ps: 0.85, pyO: 0,    lowerRise: 0,    tears: false,
      brow: [ 2.5,  1,   -2.5, -2   ]   // asymmetric
    },

    focused: {
      lid: 0.92, ps: 0.78, pyO: 0,    lowerRise: 0,    tears: false,
      brow: [ 1.5,  0,    0,    1.5  ]
    },

    waking: {
      lid: 0.28, ps: 0.82, pyO: 1,    lowerRise: 0,    tears: false,
      brow: [ 2,    1.5,  1.5,  2   ]
    },
  };

  /* ═══════════════════════════════════════════════════════
     § 4  STATE
  ═══════════════════════════════════════════════════════ */
  const S = {
    /* emotion */
    emotion:      'idle',
    prevEmotion:  'idle',
    emoT:         1.0,
    emoTimer:     0,
    emoDur:       6000,

    /* cursor */
    curX:         C / 2,
    curY:         C / 2,
    tPX:          0,       // target pupil X offset
    tPY:          0,       // target pupil Y offset
    cPX:          0,       // current (smoothed) pupil X
    cPY:          0,       // current (smoothed) pupil Y

    /* micro jitter */
    jX: 0, jY: 0,
    jTimer: 0, jNext: 800,

    /* blink */
    blinkProg:    0,
    blinkPhase:   'open',
    blinkTimer:   0,
    nextBlink:    3200,
    bCloseMs:     80,
    bOpenMs:      110,
    isDouble:     false,
    doubleDone:   false,

    /* tears */
    tearL: { on: false, y: 0, a: 0 },
    tearR: { on: false, y: 0, a: 0 },
    tearTimer: 0, tearNext: 900,

    /* tab */
    visible:      true,
    absPhase:     0,
    phaseTimer:   0,

    /* search (tab away) */
    sAngle:       0,
    sTarget:      0,
    sSpeed:       0.0008,
    sWaitTimer:   0,
    sNextWait:    0,
    sWaiting:     false,

    /* render */
    dirty:        true,
    lastDraw:     0,
    drawEvery:    42,      // ~24fps throttle

    /* RAF / interval IDs */
    rafId:        null,
    intId:        null,
    lastTs:       0,

    /* theme mode:
       'browser' = OS prefers-color-scheme
       'site'    = data-theme on <html>
       'dark'    = forced dark
       'light'   = forced light */
    themeMode:    'browser',
    isDark:       true,
  };

  /* ═══════════════════════════════════════════════════════
     § 5  THEME DETECTION
  ═══════════════════════════════════════════════════════ */
  function detectTheme() {
    const mode = S.themeMode;

    if (mode === 'dark')  { S.isDark = true;  return; }
    if (mode === 'light') { S.isDark = false; return; }

    if (mode === 'site') {
      const t = document.documentElement.getAttribute('data-theme') || 'dark';
      S.isDark = (t !== 'light');
      return;
    }

    // 'browser' mode — use OS preference
    S.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /* ═══════════════════════════════════════════════════════
     § 6  MATH UTILS
  ═══════════════════════════════════════════════════════ */
  function lerp(a, b, t)  { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rand(a, b)     { return a + Math.random() * (b - a); }

  /* Frame-rate-independent lerp factor */
  function lerpFactor(ease, dt) {
    return 1 - Math.pow(1 - ease, dt / 16.67);
  }

  /* Interpolate a numeric emotion param */
  function ep(key) {
    const f = EMOTIONS[S.prevEmotion] || EMOTIONS.idle;
    const t = EMOTIONS[S.emotion]     || EMOTIONS.idle;
    const v = f[key];
    if (typeof v !== 'number') return t[key];
    return lerp(v, t[key], clamp(S.emoT, 0, 1));
  }

  /* Interpolate brow array */
  function eb() {
    const f = (EMOTIONS[S.prevEmotion] || EMOTIONS.idle).brow;
    const t = (EMOTIONS[S.emotion]     || EMOTIONS.idle).brow;
    const x = clamp(S.emoT, 0, 1);
    return f.map((v, i) => lerp(v, t[i], x));
  }

  /* ═══════════════════════════════════════════════════════
     § 7  COLOUR PALETTE
  ═══════════════════════════════════════════════════════ */
  function palette() {
    return S.isDark
      ? { eye: '#ddd8d0', pupil: '#0a0a0a', brow: '#c8c4bc',
          tear: '#88c4f0', light: 'rgba(255,255,255,0.88)' }
      : { eye: '#1a1a1a', pupil: '#f5f2ed', brow: '#1a1a1a',
          tear: '#5599cc', light: 'rgba(255,255,255,0.0)' };
  }

  /* ═══════════════════════════════════════════════════════
     § 8  DRAWING
  ═══════════════════════════════════════════════════════ */

  /* Draw one eye with upper-lid clipping */
  function drawEye(cx, cy, lid, lowerRise, pDX, pDY, ps, col) {

    // Fully closed → draw a gentle arc
    if (lid <= 0.06) {
      ctx.beginPath();
      ctx.moveTo(cx - ERX, cy);
      ctx.quadraticCurveTo(cx, cy + 2, cx + ERX, cy);
      ctx.strokeStyle = col.eye;
      ctx.lineWidth   = 1.5;
      ctx.lineCap     = 'round';
      ctx.stroke();
      return;
    }

    // Upper lid clips the top of the oval
    // lid=1 → apertureTop = cy - ERY  (full open)
    // lid=0.5 → apertureTop = cy - ERY*0.5  (half open)
    const apertureTop = cy - ERY * clamp(lid, 0, 1.35);

    // Lower lid rises for squint (happy)
    // lowerRise=0 → stays at cy+ERY (natural bottom)
    // lowerRise=0.5 → rises to cy+ERY*0.5
    const apertureBot = cy + ERY * (1 - lowerRise * 0.55);

    if (apertureBot <= apertureTop) return;

    ctx.save();

    // Clip to the visible aperture between lids
    ctx.beginPath();
    ctx.rect(
      cx - ERX - 1,
      apertureTop,
      ERX * 2 + 2,
      apertureBot - apertureTop + 1
    );
    ctx.clip();

    // Eye white
    ctx.beginPath();
    ctx.ellipse(cx, cy, ERX, ERY, 0, 0, Math.PI * 2);
    ctx.fillStyle = col.eye;
    ctx.fill();

    // Pupil — constrained inside the eye
    const pr    = PR * clamp(ps, 0.55, 1.4);
    const maxX  = ERX - pr - 0.5;
    const maxY  = ERY - pr - 0.5;
    const px    = cx + clamp(pDX, -maxX, maxX);
    const py    = cy + clamp(pDY, -maxY, maxY);

    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = col.pupil;
    ctx.fill();

    // Catch light (only looks good in dark mode)
    if (S.isDark && pr > 1.2) {
      ctx.beginPath();
      ctx.arc(px + pr * 0.42, py - pr * 0.42, pr * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = col.light;
      ctx.fill();
    }

    ctx.restore();

    // Upper eyelid edge line (visible when partially closed)
    if (lid < 0.96 && apertureTop < cy + ERY - 2) {
      ctx.beginPath();
      ctx.moveTo(cx - ERX, apertureTop);
      ctx.quadraticCurveTo(cx, apertureTop - 0.8, cx + ERX, apertureTop);
      ctx.strokeStyle = col.eye;
      ctx.lineWidth   = 1.2;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }
  }

  /* Draw both eyebrows */
  function drawBrows(brow, col) {
    // brow = [leftOuter_dy, leftInner_dy, rightInner_dy, rightOuter_dy]
    // Left brow: outer point is to the left, inner point is toward nose
    // Right brow: inner point is toward nose, outer point is to the right

    ctx.lineWidth   = 1.5;
    ctx.lineCap     = 'round';
    ctx.strokeStyle = col.brow;

    // Left brow
    ctx.beginPath();
    ctx.moveTo(EL.cx - BHW, BBY + brow[0]);
    ctx.lineTo(EL.cx + BHW, BBY + brow[1]);
    ctx.stroke();

    // Right brow
    ctx.beginPath();
    ctx.moveTo(ER.cx - BHW, BBY + brow[2]);
    ctx.lineTo(ER.cx + BHW, BBY + brow[3]);
    ctx.stroke();
  }

  /* Draw tear drops */
  function drawTears(col) {
    if (S.tearL.on && S.tearL.a > 0) {
      ctx.save();
      ctx.globalAlpha = S.tearL.a;
      ctx.beginPath();
      ctx.arc(EL.cx, S.tearL.y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = col.tear;
      ctx.fill();
      ctx.restore();
    }
    if (S.tearR.on && S.tearR.a > 0) {
      ctx.save();
      ctx.globalAlpha = S.tearR.a;
      ctx.beginPath();
      ctx.arc(ER.cx, S.tearR.y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = col.tear;
      ctx.fill();
      ctx.restore();
    }
  }

  /* Master draw — transparent background, then brows, then eyes, then tears */
  function draw() {
    detectTheme();
    const col = palette();
    const lid  = ep('lid');
    const ps   = ep('ps');
    const pyO  = ep('pyO');
    const lr   = ep('lowerRise');
    const brow = eb();

    // Transparent clear — NO background rect
    ctx.clearRect(0, 0, C, C);

    // Apply blink on top of emotion lid
    const blinkMod = 1 - S.blinkProg;
    const finalLid = lid * blinkMod;

    // Pupil offset = cursor tracking + jitter + emotion Y offset
    const pDX = S.cPX + S.jX;
    const pDY = S.cPY + S.jY + pyO;

    drawBrows(brow, col);
    drawEye(EL.cx, EL.cy, finalLid, lr, pDX, pDY, ps, col);
    drawEye(ER.cx, ER.cy, finalLid, lr, pDX, pDY, ps, col);

    if (EMOTIONS[S.emotion] && EMOTIONS[S.emotion].tears) {
      drawTears(col);
    }

    _applyFavicon();
  }

  /* ═══════════════════════════════════════════════════════
     § 9  FAVICON APPLICATION
  ═══════════════════════════════════════════════════════ */
  let _faviconLink = null;

  function _ensureLink() {
    if (_faviconLink && _faviconLink.parentNode) return;
    document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
    _faviconLink = document.createElement('link');
    _faviconLink.rel  = 'icon';
    _faviconLink.type = 'image/png';
    document.head.appendChild(_faviconLink);
  }

  function _applyFavicon() {
    try {
      _ensureLink();
      _faviconLink.href = canvas.toDataURL('image/png');
    } catch (e) {
      _fallback();
    }
  }

  function _fallback() {
    try {
      const fb    = CFG.fallback || {};
      detectTheme();
      const src   = S.isDark ? (fb.dark || '') : (fb.light || '');
      if (!src) return;
      document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
      const lnk = document.createElement('link');
      lnk.rel   = 'icon';
      lnk.type  = 'image/png';
      lnk.href  = src;
      document.head.appendChild(lnk);
    } catch {}
  }

  /* ═══════════════════════════════════════════════════════
     § 10  BLINK SYSTEM
  ═══════════════════════════════════════════════════════ */
  function scheduleBlink() {
    const bc = CFG.blink || {};
    const min = bc.minInterval  || 2200;
    const max = bc.maxInterval  || 7500;
    S.nextBlink = rand(min, max);

    const isSlow = Math.random() < (bc.slowBlinkChance || 0.08);
    S.bCloseMs   = isSlow ? (bc.slowCloseDuration || 210) : (bc.closeDuration || 80);
    S.bOpenMs    = isSlow ? (bc.slowOpenDuration  || 270) : (bc.openDuration  || 110);
    S.isDouble   = !isSlow && Math.random() < (bc.doubleBlinkChance || 0.14);
    S.doubleDone = false;
  }

  function updateBlink(dt) {
    // Sleeping = keep closed
    if (S.emotion === 'sleeping') {
      S.blinkProg  = 1;
      S.blinkPhase = 'closed';
      return;
    }

    S.blinkTimer += dt;

    if (S.blinkPhase === 'open') {
      if (S.blinkTimer >= S.nextBlink) {
        S.blinkTimer = 0;
        S.blinkPhase = 'closing';
        S.dirty      = true;
      }
    } else if (S.blinkPhase === 'closing') {
      S.blinkProg  = clamp(S.blinkTimer / S.bCloseMs, 0, 1);
      S.dirty      = true;
      if (S.blinkTimer >= S.bCloseMs) {
        S.blinkProg  = 1;
        S.blinkPhase = 'closed';
        S.blinkTimer = 0;
      }
    } else if (S.blinkPhase === 'closed') {
      const hold = (S.isDouble && !S.doubleDone) ? 38 : 22;
      if (S.blinkTimer >= hold) {
        S.blinkPhase = 'opening';
        S.blinkTimer = 0;
      }
    } else if (S.blinkPhase === 'opening') {
      S.blinkProg  = 1 - clamp(S.blinkTimer / S.bOpenMs, 0, 1);
      S.dirty      = true;
      if (S.blinkTimer >= S.bOpenMs) {
        S.blinkProg = 0;
        if (S.isDouble && !S.doubleDone) {
          S.doubleDone = true;
          S.blinkPhase = 'closing';
          S.bCloseMs   = S.bCloseMs * 0.75;
          S.bOpenMs    = S.bOpenMs  * 0.75;
          S.blinkTimer = 0;
        } else {
          S.blinkPhase = 'open';
          S.blinkTimer = 0;
          scheduleBlink();
        }
      }
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 11  CURSOR TRACKING
  ═══════════════════════════════════════════════════════ */
  function updateCursorTracking(dt) {
    if (!S.visible) return;

    // Normalise mouse position to -1..+1
    const nX = (S.curX / Math.max(1, window.innerWidth))  * 2 - 1;
    const nY = (S.curY / Math.max(1, window.innerHeight)) * 2 - 1;

    // Target pupil offset
    S.tPX = nX * MPO;
    S.tPY = nY * MPO * 0.65;  // slightly less vertical travel

    // Frame-rate-independent easing (0.11 = snappy but smooth)
    const f = lerpFactor(0.11, dt);
    const prevX = S.cPX, prevY = S.cPY;
    S.cPX = lerp(S.cPX, S.tPX, f);
    S.cPY = lerp(S.cPY, S.tPY, f);

    if (Math.abs(S.cPX - prevX) + Math.abs(S.cPY - prevY) > 0.015) {
      S.dirty = true;
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 12  MICRO JITTER
     Tiny random movement to make the eyes feel alive
  ═══════════════════════════════════════════════════════ */
  function updateJitter(dt) {
    S.jTimer += dt;
    if (S.jTimer >= S.jNext) {
      S.jTimer = 0;
      S.jX     = rand(-0.4, 0.4);
      S.jY     = rand(-0.3, 0.3);
      S.jNext  = rand(350, 1100);
      S.dirty  = true;
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 13  SEARCH ANIMATION (when tab hidden)
  ═══════════════════════════════════════════════════════ */
  function pickSearchTarget() {
    // Choose a natural look direction
    const dirs = [0, 0.52, 1.05, 1.57, 2.09, 2.62, 3.14, 3.67, 4.19, 4.71, 5.24, 5.76];
    S.sTarget  = dirs[Math.floor(Math.random() * dirs.length)] + rand(-0.3, 0.3);
    S.sSpeed   = rand(0.00045, 0.0013);
    S.sWaiting = false;
  }

  function updateSearch(dt) {
    if (S.sWaiting) {
      S.sWaitTimer += dt;
      if (S.sWaitTimer >= S.sNextWait) pickSearchTarget();
      return;
    }

    let diff = S.sTarget - S.sAngle;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    const step = S.sSpeed * dt;
    if (Math.abs(diff) <= step) {
      S.sAngle   = S.sTarget;
      S.sWaiting = true;
      S.sWaitTimer = 0;
      S.sNextWait  = rand(500, 2500);
    } else {
      S.sAngle  += Math.sign(diff) * step;
    }

    S.cPX  = Math.cos(S.sAngle) * MPO * 0.9;
    S.cPY  = Math.sin(S.sAngle) * MPO * 0.6;
    S.dirty = true;
  }

  /* ═══════════════════════════════════════════════════════
     § 14  EMOTION STATE MACHINE
  ═══════════════════════════════════════════════════════ */
  function setEmotion(name, durationOverride) {
    if (!EMOTIONS[name] || name === S.emotion) return;
    S.prevEmotion = S.emotion;
    S.emotion     = name;
    S.emoT        = 0;
    S.emoTimer    = 0;
    S.emoDur      = durationOverride || rand(
      (CFG.emotion && CFG.emotion.idleMinDuration) || 4000,
      (CFG.emotion && CFG.emotion.idleMaxDuration) || 12000
    );
    S.dirty       = true;
    if (CFG.debug) console.log('[FaviconBot]', name);
  }

  function updateEmoTransition(dt) {
    if (S.emoT < 1) {
      // Faster transition = emotions visibly change quickly
      S.emoT  = clamp(S.emoT + 0.08, 0, 1);
      S.dirty = true;
    }
  }

  // Weighted random emotion pool for when user is on the tab
  const IDLE_POOL = [
    { e: 'idle',       w: 28 },
    { e: 'curious',    w: 16 },
    { e: 'happy',      w: 14 },
    { e: 'bored',      w: 9  },
    { e: 'focused',    w: 11 },
    { e: 'suspicious', w: 6  },
    { e: 'surprised',  w: 5  },
    { e: 'relieved',   w: 7  },
    { e: 'excited',    w: 4  },
  ];

  function pickIdleEmotion() {
    const total = IDLE_POOL.reduce((s, e) => s + e.w, 0);
    let r = Math.random() * total;
    for (const entry of IDLE_POOL) {
      r -= entry.w;
      if (r <= 0) return entry.e;
    }
    return 'idle';
  }

  function updateEmotionLogic(dt) {
    if (!S.visible) return;
    S.emoTimer += dt;
    if (S.emoTimer >= S.emoDur) {
      setEmotion(pickIdleEmotion());
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 15  TEARS SYSTEM
  ═══════════════════════════════════════════════════════ */
  function updateTears(dt) {
    const crying = EMOTIONS[S.emotion] && EMOTIONS[S.emotion].tears;
    const wasCrying = EMOTIONS[S.prevEmotion] && EMOTIONS[S.prevEmotion].tears && S.emoT < 0.55;

    if (crying || wasCrying) {
      S.tearTimer += dt;
      if (S.tearTimer >= S.tearNext) {
        S.tearTimer = 0;
        S.tearNext  = rand(700, 1300);
        if (!S.tearL.on) S.tearL = { on: true, y: EL.cy + ERY + 1.5, a: 0.95 };
        if (Math.random() > 0.42 && !S.tearR.on)
          S.tearR = { on: true, y: ER.cy + ERY + 1.5, a: 0.88 };
      }
    }

    const spd = 0.009, fade = 0.0014;

    function animTear(t) {
      if (!t.on) return;
      t.y += spd * dt;
      t.a -= fade * dt;
      if (t.a <= 0 || t.y > C - 1) { t.on = false; t.y = 0; t.a = 0; }
    }
    animTear(S.tearL);
    animTear(S.tearR);

    if ((S.tearL.on || S.tearR.on)) S.dirty = true;
    if (!crying && !wasCrying) S.tearTimer = 0;
  }

  /* ═══════════════════════════════════════════════════════
     § 16  ABSENCE PHASE SYSTEM
     Triggered when tab is hidden.
     Follows the 10-phase emotional story.
  ═══════════════════════════════════════════════════════ */
  const PHASE_DUR = [
    0,                                              // 0 not absent
    (CFG.absence && CFG.absence.searchDuration)  || 20000,  // 1 searching
    (CFG.absence && CFG.absence.curiousDuration) || 25000,  // 2 curious wait
    (CFG.absence && CFG.absence.boredDuration)   || 28000,  // 3 bored
    (CFG.absence && CFG.absence.sadDuration)     || 18000,  // 4 sad
    (CFG.absence && CFG.absence.cryingDuration)  || 32000,  // 5 crying
    (CFG.absence && CFG.absence.dryingDuration)  || 16000,  // 6 drying eyes
    (CFG.absence && CFG.absence.tiredDuration)   || 20000,  // 7 tired
    (CFG.absence && CFG.absence.fallingDuration) || 10000,  // 8 falling asleep
    (CFG.absence && CFG.absence.sleepingDuration)|| 65000,  // 9 sleeping
    (CFG.absence && CFG.absence.wakingDuration)  || 9000,   // 10 waking
  ];

  const PHASE_EMO = [
    null, 'searching', 'curious', 'bored', 'sad',
    'crying', 'relieved', 'sleepy', 'sleepy', 'sleeping', 'waking'
  ];

  function startPhase(p) {
    const emo = PHASE_EMO[p];
    if (emo) setEmotion(emo, 99999); // force long duration while absent

    if (p === 1 || p === 10) pickSearchTarget();
    if (p === 9) { S.cPX = 0; S.cPY = 0; } // center pupils when sleeping

    if (CFG.debug) console.log('[FaviconBot] phase', p, emo);
  }

  function updateAbsence(dt) {
    if (S.visible) return;
    S.phaseTimer += dt;

    if (S.absPhase === 0) {
      S.absPhase = 1;
      S.phaseTimer = 0;
      startPhase(1);
      return;
    }

    if (S.phaseTimer >= (PHASE_DUR[S.absPhase] || 20000)) {
      S.phaseTimer = 0;
      const next   = (S.absPhase >= 10) ? 1 : S.absPhase + 1;
      S.absPhase   = next;
      startPhase(next);
    }
  }

  function updateAbsenceSearch(dt) {
    if (S.visible) return;
    const searching = S.absPhase === 1 || S.absPhase === 10 || S.emotion === 'searching';
    if (searching) updateSearch(dt);
  }

  /* ═══════════════════════════════════════════════════════
     § 17  RETURN TO TAB
  ═══════════════════════════════════════════════════════ */
  function onReturn() {
    const wasEmo  = S.emotion;
    S.absPhase    = 0;
    S.phaseTimer  = 0;
    S.sWaiting    = true; // stop search

    // Snap pupils to rough center immediately
    S.cPX = 0;
    S.cPY = 0;

    if (wasEmo === 'sleeping' || wasEmo === 'waking') {
      setEmotion('waking', 1500);
      setTimeout(() => {
        setEmotion('surprised', 1200);
        setTimeout(() => {
          setEmotion('happy', 2500);
          setTimeout(() => setEmotion(pickIdleEmotion()), 2600);
        }, 1300);
      }, 1600);
    } else if (wasEmo === 'crying' || wasEmo === 'sad') {
      setEmotion('surprised', 800);
      setTimeout(() => {
        setEmotion('relieved', 2000);
        setTimeout(() => {
          setEmotion('happy', 2200);
          setTimeout(() => setEmotion(pickIdleEmotion()), 2300);
        }, 2100);
      }, 900);
    } else {
      setEmotion('surprised', 900);
      setTimeout(() => {
        setEmotion('happy', 2000);
        setTimeout(() => {
          setEmotion('curious', 2800);
          setTimeout(() => setEmotion(pickIdleEmotion()), 2900);
        }, 2100);
      }, 1000);
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 18  EVENT TRIGGERS
     React to user interactions with emotion changes
  ═══════════════════════════════════════════════════════ */
  let _lastScrollT  = 0;
  let _lastClickT   = 0;
  let _idleTimer    = 0;  // ms since last cursor movement
  let _wasCursorIdle = false;

  function bindInteractionEvents() {

    // Cursor movement — wake up, be curious
    document.addEventListener('mousemove', function(e) {
      S.curX = e.clientX;
      S.curY = e.clientY;
      _idleTimer = 0;

      if (_wasCursorIdle) {
        _wasCursorIdle = false;
        if (S.emotion === 'bored' || S.emotion === 'idle') {
          setEmotion('curious', 2500);
          setTimeout(() => { if (S.emotion === 'curious') setEmotion('idle'); }, 2600);
        }
      }
    }, { passive: true });

    // Click — brief excited/happy
    document.addEventListener('click', function() {
      const now = Date.now();
      if (now - _lastClickT < 1200) return;
      _lastClickT = now;
      if (S.emotion !== 'sleeping') {
        setEmotion('excited', 1000);
        setTimeout(() => { if (S.emotion === 'excited') setEmotion('happy', 2000); }, 1100);
        setTimeout(() => { if (S.emotion === 'happy')   setEmotion(pickIdleEmotion()); }, 3200);
      }
    });

    // Scroll — curious
    document.addEventListener('scroll', function() {
      const now = Date.now();
      if (now - _lastScrollT < 2000) return;
      _lastScrollT = now;
      if (S.visible && S.emotion !== 'sleeping') {
        setEmotion('curious', 1800);
        setTimeout(() => { if (S.emotion === 'curious') setEmotion(pickIdleEmotion()); }, 1900);
      }
    }, { passive: true, capture: true });
  }

  // Track cursor idle time — if no movement for 12s, become bored
  function updateIdleDetection(dt) {
    if (!S.visible) return;
    _idleTimer += dt;
    if (_idleTimer > 12000 && !_wasCursorIdle) {
      _wasCursorIdle = true;
      if (S.emotion === 'idle' || S.emotion === 'curious') {
        setEmotion('bored', 8000);
      }
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 19  MASTER UPDATE
  ═══════════════════════════════════════════════════════ */
  function update(dt) {
    const safe = clamp(dt, 1, 120); // prevent dt explosion

    updateBlink(safe);
    updateEmoTransition(safe);

    if (S.visible) {
      updateEmotionLogic(safe);
      updateCursorTracking(safe);
      updateJitter(safe);
      updateIdleDetection(safe);
    } else {
      updateAbsence(safe);
      updateAbsenceSearch(safe);
    }

    updateTears(safe);
  }

  /* ═══════════════════════════════════════════════════════
     § 20  RAF LOOP  (when tab is visible)
  ═══════════════════════════════════════════════════════ */
  function rafLoop(ts) {
    S.rafId = requestAnimationFrame(rafLoop);

    const dt  = ts - (S.lastTs || ts);
    S.lastTs  = ts;

    update(dt);

    if (S.dirty && (ts - S.lastDraw) >= S.drawEvery) {
      draw();
      S.lastDraw = ts;
      S.dirty    = false;
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 21  INTERVAL LOOP  (when tab is hidden)
     rAF throttles/stops when tab hidden — use setInterval
     so the searching/sleeping animations keep running.
  ═══════════════════════════════════════════════════════ */
  let _intLast = 0;

  function startHiddenLoop() {
    if (S.intId) return;
    _intLast = Date.now();
    S.intId  = setInterval(function () {
      const now = Date.now();
      const dt  = now - _intLast;
      _intLast  = now;
      update(dt);
      draw(); // always draw every interval tick
    }, 125); // 8fps — enough for searching/sleeping
  }

  function stopHiddenLoop() {
    if (S.intId) { clearInterval(S.intId); S.intId = null; }
  }

  /* ═══════════════════════════════════════════════════════
     § 22  TAB VISIBILITY EVENTS
  ═══════════════════════════════════════════════════════ */
  function bindVisibilityEvent() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        S.visible = false;
        if (S.rafId) { cancelAnimationFrame(S.rafId); S.rafId = null; }
        startHiddenLoop();
      } else {
        S.visible = true;
        stopHiddenLoop();
        S.lastTs  = 0;
        S.rafId   = requestAnimationFrame(rafLoop);
        onReturn();
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     § 23  THEME CHANGE OBSERVERS
  ═══════════════════════════════════════════════════════ */
  function bindThemeObservers() {
    // Watch for site theme changes (data-theme attribute)
    new MutationObserver(function () {
      detectTheme();
      S.dirty = true;
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Watch for OS preference changes
    try {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', function () {
          detectTheme();
          S.dirty = true;
        });
    } catch {}
  }

  /* ═══════════════════════════════════════════════════════
     § 24  TERMINAL INTEGRATION
     When MSM://SYS_CORE terminal opens/closes,
     the favicon creature reacts appropriately.
     Also: the terminal can call
       window.MSMFaviconBot.setThemeMode('site') or
       window.MSMFaviconBot.setThemeMode('browser')
     to switch theme source.
  ═══════════════════════════════════════════════════════ */
  function patchTerminal() {
    if (!window.MSMSysCore) return;
    const orig = window.MSMSysCore;

    const _open  = orig.open;
    const _close = orig.close;
    const _min   = orig.minimize;

    orig.open = function () {
      _open && _open.call(orig);
      setEmotion('focused', 3500);
      setTimeout(() => { if (S.emotion === 'focused') setEmotion('curious', 4000); }, 3600);
    };
    orig.close = function () {
      _close && _close.call(orig);
      setEmotion('relieved', 2000);
      setTimeout(() => { if (S.emotion === 'relieved') setEmotion(pickIdleEmotion()); }, 2100);
    };
    orig.minimize = function () {
      _min && _min.call(orig);
      setEmotion('curious', 3000);
      setTimeout(() => { if (S.emotion === 'curious') setEmotion(pickIdleEmotion()); }, 3100);
    };
  }

  (function waitForTerminal() {
    if (!CFG.terminal || CFG.terminal.enabled === false) return;
    const chk = setInterval(function () {
      if (window.MSMSysCore) { patchTerminal(); clearInterval(chk); }
    }, 600);
  })();

  /* ═══════════════════════════════════════════════════════
     § 25  PUBLIC API
  ═══════════════════════════════════════════════════════ */
  window.MSMFaviconBot = {

    // Force a specific emotion
    setEmotion: function (name, ms) { setEmotion(name, ms); },

    // Get current state
    getState: function () {
      return {
        emotion:     S.emotion,
        visible:     S.visible,
        absPhase:    S.absPhase,
        isDark:      S.isDark,
        themeMode:   S.themeMode,
      };
    },

    // Switch theme source
    // mode = 'browser' | 'site' | 'dark' | 'light'
    setThemeMode: function (mode) {
      const valid = ['browser', 'site', 'dark', 'light'];
      if (!valid.includes(mode)) return;
      S.themeMode = mode;
      detectTheme();
      S.dirty = true;
      if (CFG.debug) console.log('[FaviconBot] themeMode →', mode);
    },

    // Force redraw
    redraw: function () { S.dirty = true; },

    // Debug: run through all emotions sequentially
    demo: function () {
      const names = Object.keys(EMOTIONS);
      let i = 0;
      const next = function () {
        if (i >= names.length) return;
        setEmotion(names[i++], 1800);
        setTimeout(next, 2000);
      };
      next();
    },
  };

  /* ═══════════════════════════════════════════════════════
     § 26  INITIALISE
  ═══════════════════════════════════════════════════════ */
  function init() {
    detectTheme();
    _ensureLink();
    scheduleBlink();
    pickSearchTarget();

    setEmotion('idle');
    S.emoDur = rand(3500, 7000);

    bindInteractionEvents();
    bindVisibilityEvent();
    bindThemeObservers();

    // Initial draw
    draw();

    // Start animation loop
    S.rafId = requestAnimationFrame(rafLoop);

    if (CFG.debug) {
      console.log('[FaviconBot] init. theme:', S.isDark ? 'dark' : 'light');
      console.log('[FaviconBot] call MSMFaviconBot.demo() to see all emotions');
      console.log('[FaviconBot] call MSMFaviconBot.setThemeMode("site") to use site theme');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
