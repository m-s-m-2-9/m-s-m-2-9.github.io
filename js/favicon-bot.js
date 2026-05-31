/* ═══════════════════════════════════════════════════════════
   js/favicon-bot.js
   MSM Living Favicon System
   ─────────────────────────────────────────────────────────
   A tiny creature lives in the browser tab.
   It watches. It reacts. It gets lonely. It sleeps.
   ─────────────────────────────────────────────────────────
   ADD TO index.html before </body>:
   <script src="admin-control/crazy/favicon-config.js"></script>
   <script src="js/favicon-bot.js"></script>
   ─────────────────────────────────────────────────────────
   Vanilla JS · No dependencies · Canvas 2D only
   requestAnimationFrame managed · No memory leaks
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     § 0 — CONFIG LOAD
  ═══════════════════════════════════════════════════════ */

  const CFG = window.MSM_FAVICON_CONFIG || {};
  if (CFG.enabled === false) return;

  const C = (CFG.canvas && CFG.canvas.size) || 32;

  /* ═══════════════════════════════════════════════════════
     § 1 — CANVAS CAPABILITY CHECK
  ═══════════════════════════════════════════════════════ */

  const testC = document.createElement('canvas');
  if (!testC.getContext) { useFallback(); return; }
  const testCtx = testC.getContext('2d');
  if (!testCtx) { useFallback(); return; }
  if (typeof testC.toDataURL !== 'function') { useFallback(); return; }

  /* ═══════════════════════════════════════════════════════
     § 2 — CANVAS SETUP
  ═══════════════════════════════════════════════════════ */

  const canvas = document.createElement('canvas');
  canvas.width  = C;
  canvas.height = C;
  const ctx = canvas.getContext('2d');

  /* ═══════════════════════════════════════════════════════
     § 3 — CONSTANTS
  ═══════════════════════════════════════════════════════ */

  const cc  = CFG.canvas || {};
  const EL  = cc.leftEye       || { cx: 10, cy: 14 };
  const ER  = cc.rightEye      || { cx: 22, cy: 14 };
  const ERX = cc.eyeRX         || 4.5;
  const ERY = cc.eyeRY         || 6.0;
  const PR  = cc.pupilRadius   || 2.2;
  const MPO = cc.maxPupilOffset|| 2.6;
  const BHW = cc.browHalfW     || 4.5;
  const BBY = cc.browBaseY     || 6.5;

  const blinkCfg = CFG.blink   || {};
  const curCfg   = CFG.cursor  || {};
  const emoCfg   = CFG.emotion || {};
  const absCfg   = CFG.absence || {};

  /* ═══════════════════════════════════════════════════════
     § 4 — EMOTION DEFINITIONS
     Each entry defines the visual parameters for that state.
     browShape = [leftOuter_dy, leftInner_dy, rightInner_dy, rightOuter_dy]
     Negative = brow moves UP (toward top of canvas)
     Positive = brow moves DOWN (toward bottom of canvas)
  ═══════════════════════════════════════════════════════ */

  const EMOTIONS = {
    idle:       { open:1.00, ps:1.00, pyO:0,     brow:[ 0,    0,    0,    0   ], tears:false },
    curious:    { open:1.05, ps:1.10, pyO:-0.5,  brow:[-0.5, -1.5, -1.5, -0.5], tears:false },
    happy:      { open:0.82, ps:1.00, pyO:0,     brow:[-1,   -1.5, -1.5, -1  ], tears:false },
    excited:    { open:1.18, ps:1.10, pyO:-0.5,  brow:[-1.5, -2.5, -2.5, -1.5], tears:false },
    surprised:  { open:1.28, ps:1.15, pyO:-0.5,  brow:[-2,   -3,   -3,   -2  ], tears:false },
    sleepy:     { open:0.38, ps:0.90, pyO:1,     brow:[ 1,    1,    1,    1  ],  tears:false },
    sleeping:   { open:0.00, ps:0.00, pyO:0,     brow:[ 1,    1,    1,    1  ],  tears:false },
    searching:  { open:1.00, ps:1.00, pyO:0,     brow:[-0.5, -1.5, -1.5, -0.5], tears:false },
    bored:      { open:0.62, ps:0.90, pyO:1,     brow:[ 1,    1,    1,    1  ],  tears:false },
    sad:        { open:0.88, ps:0.95, pyO:1.5,   brow:[ 0.5, -2,   -2,    0.5], tears:false },
    crying:     { open:0.78, ps:0.90, pyO:1.5,   brow:[ 0.5, -2.5, -2.5,  0.5], tears:true  },
    relieved:   { open:0.90, ps:1.00, pyO:0,     brow:[-0.5, -0.5, -0.5, -0.5], tears:false },
    suspicious: { open:0.72, ps:0.85, pyO:0,     brow:[ 1,    0,   -1,   -0.5], tears:false },
    focused:    { open:0.96, ps:0.80, pyO:0,     brow:[ 0.5,  0,    0,    0.5], tears:false },
    waking:     { open:0.30, ps:0.80, pyO:0.5,   brow:[ 0.5,  0.5,  0.5,  0.5], tears:false },
  };

  /* ═══════════════════════════════════════════════════════
     § 5 — STATE
  ═══════════════════════════════════════════════════════ */

  const S = {
    /* Emotion */
    emotion:     'idle',
    prevEmotion: 'idle',
    emoT:        1.0,          /* transition 0→1 */
    emoDur:      0,            /* ms in current emotion */
    emoTimer:    0,

    /* Cursor tracking */
    cursorX:      C / 2,
    cursorY:      C / 2,
    targetPX:     0,           /* target pupil offset X */
    targetPY:     0,
    currentPX:    0,           /* smooth pupil offset X */
    currentPY:    0,

    /* Micro-jitter */
    jitterX:      0,
    jitterY:      0,
    jitterTimer:  0,
    nextJitter:   600,

    /* Blink */
    blinkProgress: 0,          /* 0=open, 1=closed */
    blinkPhase:   'open',      /* 'open' | 'closing' | 'closed' | 'opening' */
    blinkTimer:   0,
    nextBlink:    3500,
    blinkClose:   80,
    blinkOpen:    100,
    isDoubleBlink: false,
    doubleBlinkDone: false,

    /* Tears */
    tearL:        { active:false, y:0, opacity:0 },
    tearR:        { active:false, y:0, opacity:0 },
    tearSpawnTimer: 0,
    nextTearSpawn:  800,

    /* Tab visibility */
    isVisible:    true,
    absencePhase: 0,
    phaseTimer:   0,

    /* Search animation (phases 1 & 11) */
    searchAngle:      0,
    searchTargetAngle:0,
    searchSpeed:      0.0008,
    searchWaitTimer:  0,
    searchNextWait:   0,
    searchWaiting:    false,

    /* Return to tab reaction */
    returnTimer:   0,
    returnPhase:   0,

    /* Terminal */
    terminalOpen:  false,

    /* Draw throttle */
    needsRedraw:    true,
    lastDrawTime:   0,
    drawInterval:   40,        /* ~24fps */

    /* RAF */
    rafId:         null,
    absenceIntId:  null,
    lastTimestamp: 0,

    /* Dark/light */
    isDark:         true,
  };

  /* ═══════════════════════════════════════════════════════
     § 6 — THEME DETECTION
  ═══════════════════════════════════════════════════════ */

  function detectTheme() {
    const pref = (CFG.theme || 'auto').toLowerCase();
    if (pref === 'dark')  { S.isDark = true;  return; }
    if (pref === 'light') { S.isDark = false; return; }
    /* Auto: detect from site theme first, then OS preference */
    const siteTheme = document.documentElement.getAttribute('data-theme') || '';
    if (siteTheme === 'light') { S.isDark = false; return; }
    if (siteTheme === 'dark' || siteTheme === 'slate' || siteTheme === 'forest') { S.isDark = true; return; }
    /* Fallback to OS */
    S.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /* ═══════════════════════════════════════════════════════
     § 7 — LERP UTILITY
  ═══════════════════════════════════════════════════════ */

  function lerp(a, b, t)  { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* Interpolate between two emotion states */
  function getEmoParam(key) {
    const fromE = EMOTIONS[S.prevEmotion] || EMOTIONS.idle;
    const toE   = EMOTIONS[S.emotion]     || EMOTIONS.idle;
    const t     = clamp(S.emoT, 0, 1);
    const fv    = fromE[key];
    const tv    = toE[key];
    if (typeof fv === 'number') return lerp(fv, tv, t);
    return t >= 0.5 ? tv : fv; /* non-numeric: snap at midpoint */
  }

  function getBrow() {
    const fromB = EMOTIONS[S.prevEmotion]?.brow || [0,0,0,0];
    const toB   = EMOTIONS[S.emotion]?.brow     || [0,0,0,0];
    const t     = clamp(S.emoT, 0, 1);
    return fromB.map((v, i) => lerp(v, toB[i], t));
  }

  /* ═══════════════════════════════════════════════════════
     § 8 — DRAW FUNCTIONS
  ═══════════════════════════════════════════════════════ */

  function getColors() {
    if (S.isDark) {
      return {
        bg:        '#0a0a0a',
        eye:       '#ddd8d0',
        pupil:     '#0d0d0d',
        brow:      '#c8c4bc',
        tearColor: '#88c4f0',
        catchLight:'rgba(255,255,255,0.9)',
      };
    } else {
      return {
        bg:        '#ffffff',
        eye:       '#1a1a1a',
        pupil:     '#f0ede8',
        brow:      '#1a1a1a',
        tearColor: '#5599cc',
        catchLight:'rgba(0,0,0,0.0)',
      };
    }
  }

  function drawBackground(col) {
    ctx.fillStyle = col.bg;
    /* Rounded rect background */
    const r = 5;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(C - r, 0);
    ctx.quadraticCurveTo(C, 0, C, r);
    ctx.lineTo(C, C - r);
    ctx.quadraticCurveTo(C, C, C - r, C);
    ctx.lineTo(r, C);
    ctx.quadraticCurveTo(0, C, 0, r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
  }

  function drawEye(cx, cy, eyeOpen, pupilDX, pupilDY, pupilScale, col) {
    const ryActual = ERY * clamp(eyeOpen, 0, 1.4);

    if (ryActual < 1.0) {
      /* Closed eye: draw a curved line */
      ctx.beginPath();
      ctx.moveTo(cx - ERX, cy);
      ctx.quadraticCurveTo(cx, cy + Math.max(1.5, ryActual * 0.5 + 1), cx + ERX, cy);
      ctx.strokeStyle = col.eye;
      ctx.lineWidth   = 1.3;
      ctx.lineCap     = 'round';
      ctx.stroke();
      return;
    }

    /* Eye oval */
    ctx.beginPath();
    ctx.ellipse(cx, cy, ERX, ryActual, 0, 0, Math.PI * 2);
    ctx.fillStyle = col.eye;
    ctx.fill();

    /* Pupil (clipped to eye) */
    const pr = PR * clamp(pupilScale, 0.5, 1.4);
    const maxOff = ERX - pr - 0.4;
    const px = cx + clamp(pupilDX, -maxOff, maxOff);
    const py = cy + clamp(pupilDY, -(ryActual - pr - 0.2), ryActual - pr - 0.2);

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, ERX, ryActual, 0, 0, Math.PI * 2);
    ctx.clip();

    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = col.pupil;
    ctx.fill();

    /* Catch light (makes eye feel alive) */
    if (S.isDark && pr > 1.2) {
      ctx.beginPath();
      ctx.arc(px + 0.9, py - 0.9, 0.65, 0, Math.PI * 2);
      ctx.fillStyle = col.catchLight;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawBrows(brow, col) {
    /* brow = [leftOuter_dy, leftInner_dy, rightInner_dy, rightOuter_dy] */
    ctx.strokeStyle = col.brow;
    ctx.lineWidth   = 1.25;
    ctx.lineCap     = 'round';

    /* Left brow: left point = outer, right point = inner */
    ctx.beginPath();
    ctx.moveTo(EL.cx - BHW, BBY + brow[0]);
    ctx.lineTo(EL.cx + BHW, BBY + brow[1]);
    ctx.stroke();

    /* Right brow: left point = inner, right point = outer */
    ctx.beginPath();
    ctx.moveTo(ER.cx - BHW, BBY + brow[2]);
    ctx.lineTo(ER.cx + BHW, BBY + brow[3]);
    ctx.stroke();
  }

  function drawTears(col) {
    const emo = EMOTIONS[S.emotion];
    if (!emo || !emo.tears) return;

    /* Left tear */
    if (S.tearL.active && S.tearL.opacity > 0) {
      ctx.globalAlpha = S.tearL.opacity;
      ctx.beginPath();
      ctx.arc(EL.cx, S.tearL.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = col.tearColor;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* Right tear */
    if (S.tearR.active && S.tearR.opacity > 0) {
      ctx.globalAlpha = S.tearR.opacity;
      ctx.beginPath();
      ctx.arc(ER.cx, S.tearR.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = col.tearColor;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function draw() {
    detectTheme();
    const col = getColors();

    ctx.clearRect(0, 0, C, C);
    drawBackground(col);

    const eyeOpen   = getEmoParam('open');
    const ps        = getEmoParam('ps');
    const pyO       = getEmoParam('pyO');
    const brow      = getBrow();

    /* Apply blink on top of emotion eye openness */
    const blinkMod  = 1 - S.blinkProgress;
    const finalOpen = eyeOpen * blinkMod;

    /* Pupil position: cursor tracking + micro-jitter + emotion y-offset */
    const pupilDX = S.currentPX + S.jitterX;
    const pupilDY = S.currentPY + S.jitterY + pyO;

    drawBrows(brow, col);
    drawEye(EL.cx, EL.cy, finalOpen, pupilDX, pupilDY, ps, col);
    drawEye(ER.cx, ER.cy, finalOpen, pupilDX, pupilDY, ps, col);
    drawTears(col);

    /* Apply canvas to favicon */
    applyFavicon();
  }

  /* ═══════════════════════════════════════════════════════
     § 9 — FAVICON APPLICATION
  ═══════════════════════════════════════════════════════ */

  let faviconEl = null;

  function ensureFaviconEl() {
    if (faviconEl && faviconEl.parentNode) return;
    /* Remove any existing favicon links */
    document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
    faviconEl = document.createElement('link');
    faviconEl.rel  = 'icon';
    faviconEl.type = 'image/png';
    document.head.appendChild(faviconEl);
  }

  function applyFavicon() {
    try {
      ensureFaviconEl();
      const dataUrl = canvas.toDataURL('image/png');
      faviconEl.href = dataUrl;
      /* Safari workaround: briefly remove and re-add */
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        faviconEl.remove();
        document.head.appendChild(faviconEl);
      }
    } catch (e) {
      useFallback();
    }
  }

  function useFallback() {
    try {
      detectTheme();
      const fb    = (CFG.fallback || {});
      const asset = S.isDark ? (fb.dark || '') : (fb.light || '');
      if (!asset) return;
      const existing = document.querySelectorAll('link[rel*="icon"]');
      existing.forEach(el => el.remove());
      const link  = document.createElement('link');
      link.rel    = 'icon';
      link.type   = 'image/png';
      link.href   = asset;
      document.head.appendChild(link);
    } catch {}
  }

  /* ═══════════════════════════════════════════════════════
     § 10 — BLINK SYSTEM
  ═══════════════════════════════════════════════════════ */

  function scheduleBlink() {
    const min = blinkCfg.minInterval || 2000;
    const max = blinkCfg.maxInterval || 7000;
    S.nextBlink = min + Math.random() * (max - min);

    const doubleChance = blinkCfg.doubleBlinkChance || 0.15;
    const slowChance   = blinkCfg.slowBlinkChance   || 0.08;
    const isSlow = Math.random() < slowChance;

    if (isSlow) {
      S.blinkClose    = blinkCfg.slowCloseDuration || 200;
      S.blinkOpen     = blinkCfg.slowOpenDuration  || 260;
      S.isDoubleBlink = false;
    } else {
      S.blinkClose    = blinkCfg.closeDuration || 80;
      S.blinkOpen     = blinkCfg.openDuration  || 100;
      S.isDoubleBlink = Math.random() < doubleChance;
    }
    S.doubleBlinkDone = false;
  }

  function updateBlink(dt) {
    /* During sleep: eyes are just closed — no blink animation */
    if (S.emotion === 'sleeping') {
      S.blinkProgress = 1;
      S.blinkPhase    = 'closed';
      return;
    }

    S.blinkTimer += dt;

    if (S.blinkPhase === 'open') {
      if (S.blinkTimer >= S.nextBlink) {
        S.blinkTimer = 0;
        S.blinkPhase = 'closing';
        S.needsRedraw = true;
      }
    } else if (S.blinkPhase === 'closing') {
      S.blinkProgress = clamp(S.blinkTimer / S.blinkClose, 0, 1);
      S.needsRedraw   = true;
      if (S.blinkTimer >= S.blinkClose) {
        S.blinkProgress = 1;
        S.blinkPhase    = 'closed';
        S.blinkTimer    = 0;
      }
    } else if (S.blinkPhase === 'closed') {
      const holdTime = S.isDoubleBlink && !S.doubleBlinkDone ? 40 : 25;
      if (S.blinkTimer >= holdTime) {
        S.blinkTimer = 0;
        S.blinkPhase = 'opening';
      }
    } else if (S.blinkPhase === 'opening') {
      S.blinkProgress = 1 - clamp(S.blinkTimer / S.blinkOpen, 0, 1);
      S.needsRedraw   = true;
      if (S.blinkTimer >= S.blinkOpen) {
        S.blinkProgress = 0;
        if (S.isDoubleBlink && !S.doubleBlinkDone) {
          /* Second blink */
          S.doubleBlinkDone = true;
          S.blinkPhase      = 'closing';
          S.blinkClose      = (blinkCfg.closeDuration || 80) * 0.8;
          S.blinkOpen       = (blinkCfg.openDuration  || 100) * 0.8;
          S.blinkTimer      = 0;
        } else {
          S.blinkPhase = 'open';
          S.blinkTimer = 0;
          scheduleBlink();
        }
      }
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 11 — CURSOR TRACKING
  ═══════════════════════════════════════════════════════ */

  function updateCursorTracking(dt) {
    if (!curCfg.enabled && curCfg.enabled !== undefined) return;
    if (!S.isVisible) return;

    /* Convert cursor screen position to pupil offset */
    const rect    = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const normX   = (S.cursorX / rect.width)  * 2 - 1;  /* -1 to 1 */
    const normY   = (S.cursorY / rect.height) * 2 - 1;
    S.targetPX    = normX * MPO;
    S.targetPY    = normY * MPO * 0.6;

    const ease    = curCfg.ease || 0.07;
    S.currentPX   = lerp(S.currentPX, S.targetPX, ease);
    S.currentPY   = lerp(S.currentPY, S.targetPY, ease);

    const moved   = Math.abs(S.currentPX - S.targetPX) + Math.abs(S.currentPY - S.targetPY);
    if (moved > 0.02) S.needsRedraw = true;
  }

  function updateMicroJitter(dt) {
    S.jitterTimer += dt;
    if (S.jitterTimer >= S.nextJitter) {
      S.jitterTimer = 0;
      const maxJ   = curCfg.microJitter !== undefined ? curCfg.microJitter : 0.35;
      S.jitterX    = (Math.random() * 2 - 1) * maxJ;
      S.jitterY    = (Math.random() * 2 - 1) * maxJ;
      S.nextJitter = 400 + Math.random() * 800;
      S.needsRedraw = true;
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 12 — SEARCH ANIMATION (tab away)
  ═══════════════════════════════════════════════════════ */

  function pickNewSearchTarget() {
    /* Pick a random angle from a set of natural look-directions */
    const directions = [
      0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4,
      Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4,
    ];
    const shuffled = directions.sort(() => Math.random() - 0.5);
    S.searchTargetAngle = shuffled[0] + (Math.random() - 0.5) * 0.4;
    S.searchSpeed       = 0.0005 + Math.random() * 0.001;
    S.searchWaiting     = false;
  }

  function updateSearchAnimation(dt) {
    if (S.searchWaiting) {
      S.searchWaitTimer += dt;
      if (S.searchWaitTimer >= S.searchNextWait) {
        pickNewSearchTarget();
      }
      return;
    }

    /* Move toward target angle */
    let diff = S.searchTargetAngle - S.searchAngle;
    /* Normalize to -PI..PI */
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    const step = S.searchSpeed * dt;
    if (Math.abs(diff) < step) {
      S.searchAngle   = S.searchTargetAngle;
      S.searchWaiting = true;
      S.searchWaitTimer = 0;
      S.searchNextWait  = 600 + Math.random() * 2200;
    } else {
      S.searchAngle += Math.sign(diff) * step;
    }

    S.currentPX  = Math.cos(S.searchAngle) * MPO * 0.85;
    S.currentPY  = Math.sin(S.searchAngle) * MPO * 0.55;
    S.needsRedraw = true;
  }

  /* ═══════════════════════════════════════════════════════
     § 13 — EMOTION STATE MACHINE
  ═══════════════════════════════════════════════════════ */

  function setEmotion(name) {
    if (name === S.emotion) return;
    if (!EMOTIONS[name]) return;
    S.prevEmotion = S.emotion;
    S.emotion     = name;
    S.emoT        = 0;
    S.emoTimer    = 0;
    S.emoDur      = randomBetween(
      emoCfg.idleMinDuration || 5000,
      emoCfg.idleMaxDuration || 14000
    );
    S.needsRedraw = true;
    if (CFG.debug) console.log('[FaviconBot] emotion →', name);
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  /* Advance emotion transition */
  function updateEmotionTransition(dt) {
    if (S.emoT < 1) {
      const speed = emoCfg.transitionSpeed || 0.06;
      S.emoT = clamp(S.emoT + speed, 0, 1);
      S.needsRedraw = true;
    }
  }

  /* Organic emotion flow when tab is visible */
  const IDLE_FLOW = [
    { emotion: 'idle',       weight: 30 },
    { emotion: 'curious',    weight: 15 },
    { emotion: 'happy',      weight: 12 },
    { emotion: 'bored',      weight: 8  },
    { emotion: 'focused',    weight: 10 },
    { emotion: 'suspicious', weight: 5  },
    { emotion: 'surprised',  weight: 4  },
    { emotion: 'relieved',   weight: 6  },
  ];

  function pickRandomIdleEmotion() {
    const total = IDLE_FLOW.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * total;
    for (const entry of IDLE_FLOW) {
      r -= entry.weight;
      if (r <= 0) return entry.emotion;
    }
    return 'idle';
  }

  function updateEmotionLogic(dt) {
    S.emoTimer += dt;
    if (S.emoTimer >= S.emoDur && S.isVisible) {
      const next = pickRandomIdleEmotion();
      setEmotion(next);
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 14 — TEARS SYSTEM
  ═══════════════════════════════════════════════════════ */

  function updateTears(dt) {
    const shouldHaveTears = (EMOTIONS[S.emotion] && EMOTIONS[S.emotion].tears) ||
                             (EMOTIONS[S.prevEmotion] && EMOTIONS[S.prevEmotion].tears && S.emoT < 0.5);

    if (shouldHaveTears) {
      /* Spawn new tears periodically */
      S.tearSpawnTimer += dt;
      if (S.tearSpawnTimer >= S.nextTearSpawn) {
        S.tearSpawnTimer = 0;
        S.nextTearSpawn  = 700 + Math.random() * 1200;
        /* Spawn left tear */
        if (!S.tearL.active) {
          S.tearL = { active: true, y: EL.cy + ERY + 1, opacity: 0.9 };
        }
        /* Sometimes spawn right tear too */
        if (Math.random() > 0.4 && !S.tearR.active) {
          S.tearR = { active: true, y: ER.cy + ERY + 1, opacity: 0.9 };
        }
      }
    }

    /* Animate tears falling */
    const tearSpeed = 0.008;
    const tearFade  = 0.0012;

    if (S.tearL.active) {
      S.tearL.y       += tearSpeed * dt;
      S.tearL.opacity -= tearFade * dt;
      if (S.tearL.opacity <= 0 || S.tearL.y > C - 2) {
        S.tearL = { active: false, y: 0, opacity: 0 };
      }
      S.needsRedraw = true;
    }
    if (S.tearR.active) {
      S.tearR.y       += tearSpeed * dt;
      S.tearR.opacity -= tearFade * dt;
      if (S.tearR.opacity <= 0 || S.tearR.y > C - 2) {
        S.tearR = { active: false, y: 0, opacity: 0 };
      }
      S.needsRedraw = true;
    }

    /* If no longer crying: clear tears */
    if (!shouldHaveTears && !S.tearL.active && !S.tearR.active) {
      S.tearSpawnTimer = 0;
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 15 — ABSENCE PHASE SYSTEM
  ═══════════════════════════════════════════════════════ */

  const PHASE_DURATIONS = [
    0,                                                    /* 0: not absent */
    absCfg.searchDuration  || 22000,                     /* 1: searching */
    absCfg.curiousDuration || 28000,                     /* 2: curious waiting */
    absCfg.boredDuration   || 30000,                     /* 3: bored */
    absCfg.sadDuration     || 20000,                     /* 4: sad */
    absCfg.cryingDuration  || 35000,                     /* 5: crying */
    absCfg.dryingDuration  || 18000,                     /* 6: drying eyes */
    absCfg.tiredDuration   || 22000,                     /* 7: tired */
    absCfg.fallingDuration || 12000,                     /* 8: falling asleep */
    absCfg.sleepingDuration|| 70000,                     /* 9: sleeping */
    absCfg.wakingDuration  || 10000,                     /* 10: waking up */
  ];

  const PHASE_EMOTIONS = [
    null,         /* 0 */
    'searching',  /* 1 */
    'curious',    /* 2 */
    'bored',      /* 3 */
    'sad',        /* 4 */
    'crying',     /* 5 */
    'relieved',   /* 6 – trying to stop crying */
    'sleepy',     /* 7 */
    'sleepy',     /* 8 – falling asleep */
    'sleeping',   /* 9 */
    'waking',     /* 10 */
  ];

  function updateAbsencePhases(dt) {
    if (S.isVisible) return;
    S.phaseTimer += dt;

    if (S.absencePhase === 0) {
      S.absencePhase = 1;
      S.phaseTimer   = 0;
      startPhase(1);
      return;
    }

    const phaseDur = PHASE_DURATIONS[S.absencePhase] || 20000;
    if (S.phaseTimer >= phaseDur) {
      S.phaseTimer = 0;
      let next = S.absencePhase + 1;
      if (next > 10) next = 1;  /* Loop: after waking, start searching again */
      S.absencePhase = next;
      startPhase(next);
    }
  }

  function startPhase(phase) {
    const emo = PHASE_EMOTIONS[phase];
    if (emo) setEmotion(emo);

    /* Special phase behaviors */
    if (phase === 1 || phase === 11) {
      pickNewSearchTarget();
    }
    if (phase === 9) {
      /* Sleeping — clear pupils to center */
      S.currentPX = 0;
      S.currentPY = 0;
      S.targetPX  = 0;
      S.targetPY  = 0;
    }
    if (CFG.debug) console.log('[FaviconBot] absence phase →', phase, emo);
  }

  function updateAbsenceSearch(dt) {
    if (S.isVisible) return;
    const isSearchPhase = (S.absencePhase === 1 || S.absencePhase === 10 || S.absencePhase === 11);
    if (isSearchPhase || S.emotion === 'searching') {
      updateSearchAnimation(dt);
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 16 — RETURN TO TAB
  ═══════════════════════════════════════════════════════ */

  function onReturnToTab() {
    S.returnTimer = 0;
    S.returnPhase = 0;
    S.absencePhase = 0;

    /* Stop any ongoing search */
    S.searchWaiting = true;

    /* Phase 0: immediate notice — eyes dart toward center */
    S.currentPX = 0;
    S.currentPY = 0;

    if (S.emotion === 'sleeping' || S.emotion === 'waking') {
      /* Wake up sequence */
      setEmotion('waking');
      setTimeout(() => {
        setEmotion('surprised');
        setTimeout(() => {
          setEmotion('happy');
          setTimeout(() => { setEmotion('idle'); S.emoTimer = 0; }, 3000);
        }, 1800);
      }, 1400);
    } else if (S.emotion === 'crying' || S.emotion === 'sad') {
      /* Was sad — becomes relieved then happy */
      setEmotion('surprised');
      setTimeout(() => {
        setEmotion('relieved');
        setTimeout(() => {
          setEmotion('happy');
          setTimeout(() => { setEmotion('idle'); S.emoTimer = 0; }, 2800);
        }, 2000);
      }, 800);
    } else {
      /* Normal return */
      setEmotion('surprised');
      setTimeout(() => {
        setEmotion('happy');
        setTimeout(() => {
          setEmotion('curious');
          setTimeout(() => { setEmotion('idle'); S.emoTimer = 0; }, 3000);
        }, 2000);
      }, 1200);
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 17 — MAIN UPDATE LOOP
  ═══════════════════════════════════════════════════════ */

  function update(dt) {
    /* Clamp dt to prevent huge jumps after tab switch */
    const safeDt = Math.min(dt, 100);

    updateBlink(safeDt);
    updateEmotionTransition(safeDt);
    if (S.isVisible) {
      updateEmotionLogic(safeDt);
      updateCursorTracking(safeDt);
      updateMicroJitter(safeDt);
    } else {
      updateAbsencePhases(safeDt);
      updateAbsenceSearch(safeDt);
    }
    updateTears(safeDt);
  }

  /* ═══════════════════════════════════════════════════════
     § 18 — RAF RENDER LOOP (tab visible)
  ═══════════════════════════════════════════════════════ */

  function rafLoop(timestamp) {
    S.rafId = requestAnimationFrame(rafLoop);

    const dt = timestamp - (S.lastTimestamp || timestamp);
    S.lastTimestamp = timestamp;

    update(dt);

    /* Throttle favicon updates */
    if (S.needsRedraw && (timestamp - S.lastDrawTime) >= S.drawInterval) {
      draw();
      S.lastDrawTime = timestamp;
      S.needsRedraw  = false;
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 19 — INTERVAL LOOP (tab hidden)
     requestAnimationFrame freezes/slows when tab is hidden,
     so we switch to setInterval for absence animations.
  ═══════════════════════════════════════════════════════ */

  let _absenceLastTime = 0;

  function startAbsenceLoop() {
    if (S.absenceIntId) return;
    _absenceLastTime = Date.now();
    S.absenceIntId = setInterval(() => {
      const now = Date.now();
      const dt  = now - _absenceLastTime;
      _absenceLastTime = now;
      update(dt);
      draw();
    }, 120); /* ~8fps for hidden tab — smooth enough for searching */
  }

  function stopAbsenceLoop() {
    if (S.absenceIntId) {
      clearInterval(S.absenceIntId);
      S.absenceIntId = null;
    }
  }

  /* ═══════════════════════════════════════════════════════
     § 20 — EVENT HANDLERS
  ═══════════════════════════════════════════════════════ */

  /* Cursor position */
  document.addEventListener('mousemove', function faviconMouseMove(e) {
    S.cursorX = e.clientX;
    S.cursorY = e.clientY;
  }, { passive: true });

  /* Tab visibility */
  document.addEventListener('visibilitychange', function faviconVis() {
    if (document.hidden) {
      S.isVisible = false;
      /* Cancel rAF, start interval */
      if (S.rafId) {
        cancelAnimationFrame(S.rafId);
        S.rafId = null;
      }
      startAbsenceLoop();
    } else {
      S.isVisible = true;
      /* Stop interval, restart rAF */
      stopAbsenceLoop();
      S.lastTimestamp = 0;
      S.rafId = requestAnimationFrame(rafLoop);
      onReturnToTab();
    }
  });

  /* Theme change (site theme switcher) */
  const themeObs = new MutationObserver(function() {
    detectTheme();
    S.needsRedraw = true;
  });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* OS color scheme change */
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      detectTheme();
      S.needsRedraw = true;
    });
  } catch {}

  /* ═══════════════════════════════════════════════════════
     § 21 — TERMINAL INTEGRATION
  ═══════════════════════════════════════════════════════ */

  if (!CFG.terminal || CFG.terminal.enabled !== false) {
    /* Watch for MSMSysCore terminal state changes */
    const terminalCheck = setInterval(function() {
      if (!window.MSMSysCore) return;
      const status = window.MSMSysCore.status ? window.MSMSysCore.status() : null;
      /* The terminal doesn't expose open state directly so we patch it */
    }, 2000);

    /* Patch terminal open/close to trigger emotion changes */
    const patchTerminal = function() {
      if (!window.MSMSysCore) return;
      const orig = window.MSMSysCore;
      const origOpen  = orig.open;
      const origClose = orig.close;
      const origMin   = orig.minimize;

      orig.open = function() {
        origOpen && origOpen.call(orig);
        S.terminalOpen = true;
        setEmotion('focused');
        setTimeout(() => { if (S.terminalOpen) setEmotion('curious'); }, 3000);
      };
      orig.close = function() {
        origClose && origClose.call(orig);
        S.terminalOpen = false;
        setEmotion('relieved');
        setTimeout(() => { setEmotion('idle'); S.emoTimer = 0; }, 2500);
      };
      orig.minimize = function() {
        origMin && origMin.call(orig);
        /* Stays attentive */
        setEmotion('curious');
        setTimeout(() => { setEmotion('idle'); S.emoTimer = 0; }, 4000);
      };

      clearInterval(terminalCheck);
    };

    /* Wait for terminal to be ready */
    const termReadyCheck = setInterval(function() {
      if (window.MSMSysCore) {
        patchTerminal();
        clearInterval(termReadyCheck);
      }
    }, 500);
  }

  /* ═══════════════════════════════════════════════════════
     § 22 — PUBLIC API
  ═══════════════════════════════════════════════════════ */

  window.MSMFaviconBot = {
    setEmotion:    function(name) { setEmotion(name); },
    getState:      function()     { return { emotion: S.emotion, isVisible: S.isVisible, absencePhase: S.absencePhase }; },
    forceRedraw:   function()     { S.needsRedraw = true; },
    isDark:        function()     { return S.isDark; },
  };

  /* ═══════════════════════════════════════════════════════
     § 23 — INITIALISATION
  ═══════════════════════════════════════════════════════ */

  function init() {
    detectTheme();
    ensureFaviconEl();
    scheduleBlink();
    pickNewSearchTarget();

    setEmotion('idle');
    S.emoDur = randomBetween(4000, 8000);

    /* Initial draw */
    draw();

    /* Start RAF loop */
    S.rafId = requestAnimationFrame(rafLoop);

    if (CFG.debug) console.log('[FaviconBot] initialized. theme:', S.isDark ? 'dark' : 'light');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(); /* end IIFE */
