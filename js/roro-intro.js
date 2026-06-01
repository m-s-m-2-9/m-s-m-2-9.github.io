/* ═══════════════════════════════════════════════════════════════════════
   js/roro-intro.js  ·  MSM Cinematic Experience  ·  v6.0
   ────────────────────────────────────────────────────────────────────
   PHASE 1 — Procedural Cinematic Intro (matches MSM.mp4 exactly)
     · Background: 16 concentric rounded rectangles, slow CW rotation
     · MSM — Abril Fatface, #edd0a1, blur-in from centre
     · Divider line — grows from centre, stays fixed throughout
     · MANOMAY SHAILENDRA MISRA — Cinzel, M/S/M in #edd0a1
     · Transition: name pans up → portfolio blurs in → MMXXVI + coords reveal
   PHASE 2 — Loading Screen (100% UNCHANGED)
     · Ghost clock · Welcome · Facts · Progress bar
     · Terminal log (click to expand/collapse) · Continue button
   Fonts: Abril Fatface · Cinzel · Space Grotesk (Codec Pro substitute)
   GSAP 3.12.5 from cdnjs (built-in mini-tween fallback if CDN unreachable)
═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.body.style.visibility = 'visible';
  document.body.style.overflow   = 'hidden';

  window._roroActive = true;
  var _origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (window._roroActive && (this.id === 'bg-music' || this.id === 'rain-song'))
      return Promise.resolve();
    return _origPlay.apply(this, arguments);
  };

  (function injectFonts() {
    if (document.getElementById('rs-font-link')) return;
    var pc = document.createElement('link');
    pc.rel = 'preconnect'; pc.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc);
    var pg = document.createElement('link');
    pg.rel = 'preconnect'; pg.href = 'https://fonts.gstatic.com';
    pg.crossOrigin = 'anonymous';
    document.head.appendChild(pg);
    var fl = document.createElement('link');
    fl.id = 'rs-font-link'; fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Cinzel:wght@400;600&family=Space+Grotesk:wght@300;400;500&display=swap';
    document.head.appendChild(fl);
  })();

  var _gsapReady = false, _gsapQueue = [];
  function whenGsap(fn) { if (_gsapReady) { fn(); return; } _gsapQueue.push(fn); }

  (function loadGsap() {
    if (window.gsap) { _gsapReady = true; return; }
    var sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    function activate() {
      if (!window.gsap) window.gsap = _miniGsap();
      _gsapReady = true;
      _gsapQueue.forEach(function (f) { f(); });
      _gsapQueue = [];
    }
    sc.onload = activate; sc.onerror = activate;
    document.head.appendChild(sc);
  })();

  function _miniGsap() {
    var tweens = [], raf = null;
    function ease(t, e) {
      if (e === 'power2.out')   return 1 - Math.pow(1 - t, 2);
      if (e === 'power2.in')    return t * t;
      if (e === 'power3.out')   return 1 - Math.pow(1 - t, 3);
      if (e === 'power3.in')    return t * t * t;
      if (e === 'power2.inOut') return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
      if (e === 'sine.inOut')   return -(Math.cos(Math.PI*t)-1)/2;
      return t;
    }
    function apply(el, k, v) {
      if (!el || !el.style) return;
      if (k === 'opacity') { el.style.opacity = v; }
      else if (k === 'y')  { el._ry = v; sync(el); }
      else if (k === 'x')  { el._rx = v; sync(el); }
      else if (k === 'scale') { el._rs = v; sync(el); }
    }
    function sync(el) {
  var t = 'translateX(-50%) ';

  if (el._rx != null)
    t += 'translateX(' + el._rx + 'px) ';

  if (el._ry != null)
    t += 'translateY(' + el._ry + 'px) ';

  if (el._rs != null)
    t += 'scale(' + el._rs + ') ';

  if (el._rsx != null)
    t += 'scaleX(' + el._rsx + ')';

  el.style.transform = t.trim();
}
    function getv(el, k) {
      if (k === 'opacity') return parseFloat(el.style.opacity) || 0;
      if (k === 'y') return el._ry || 0;
      if (k === 'x') return el._rx || 0;
      if (k === 'scale') return el._rs || 1;
      return 0;
    }
    function tick() {
      var now = performance.now(), alive = [];
      tweens.forEach(function (tw) {
        var t = Math.min((now - tw.s) / tw.d, 1);
        var e = ease(t, tw.e);
        Object.keys(tw.to).forEach(function (k) {
          apply(tw.el, k, tw.fr[k] + (tw.to[k] - tw.fr[k]) * e);
        });
        if (t < 1) { alive.push(tw); }
        else { if (tw.cb) tw.cb(); }
      });
      tweens = alive;
      raf = tweens.length ? requestAnimationFrame(tick) : null;
    }
    function add(el, to, opts) {
      var fr = {};
      Object.keys(to).forEach(function (k) { fr[k] = getv(el, k); });
      setTimeout(function () {
        tweens.push({ el: el, fr: fr, to: to, d: (opts.duration||0.5)*1000,
          s: performance.now(), e: opts.ease||'linear', cb: opts.onComplete });
        if (!raf) raf = requestAnimationFrame(tick);
      }, (opts.delay||0)*1000);
    }
    var api = {
      set: function (el, p) {
        if (Array.isArray(el)) { el.forEach(function(e) { api.set(e, p); }); return; }
        ['opacity','y','x','scale','scaleX'].forEach(function (k) { if (p[k] != null) apply(el, k, p[k]); });
        if (p.filter && el.style) el.style.filter = p.filter;
        if (p.scaleX != null && el.style)
  el.style.transform = 'translateX(-50%) scaleX('+p.scaleX+')';
      },
      to: function (el, props) {
        if (Array.isArray(el)) { el.forEach(function(e) { api.to(e, props); }); return; }
        var to = {}, opts = {};
        ['opacity','y','x','scale','scaleX'].forEach(function (k) { if (props[k] != null) to[k] = props[k]; });
        ['duration','delay','ease','onComplete'].forEach(function (k) { if (props[k] != null) opts[k] = props[k]; });
        if (props.onStart) setTimeout(props.onStart, (opts.delay||0)*1000);
        add(el, to, opts);
      },
      fromTo: function (el, fr, to, opts) {
        api.set(el, fr);
        setTimeout(function () { api.to(el, Object.assign({}, to, opts||{})); }, 0);
      },
      timeline: function () {
        var cur = 0, tl = {
          to: function (el, props, pos) {
            var t = pos != null ? (typeof pos==='string'&&pos.startsWith('+=')?cur+parseFloat(pos.slice(2)):parseFloat(pos)) : cur;
            cur = t + (props.duration||0.5);
            api.to(el, Object.assign({}, props, { delay: t })); return tl;
          },
          set: function (el, p) { api.set(el, p); return tl; },
          call: function (fn, args, pos) {
            var t = pos != null ? (typeof pos==='string'&&pos.startsWith('+=')?cur+parseFloat(pos.slice(2)):parseFloat(pos)) : cur;
            setTimeout(function () { fn.apply(null, args||[]); }, t * 1000); return tl;
          },
          fromTo: function (el, fr, to, pos) {
            var dur = to.duration||0.5;
            var t = pos != null ? parseFloat(pos) : cur;
            cur = t + dur;
            api.fromTo(el, fr, Object.assign({}, to, { delay: t })); return tl;
          },
          add: function (fn, pos) {
            var t = pos != null ? parseFloat(pos) : cur;
            setTimeout(fn, t * 1000); return tl;
          }
        };
        return tl;
      }
    };
    return api;
  }

  var CSS = `
    #cursor-dot, #cursor-ring { z-index: 9999999 !important; }
    #roro-splash {
      position: fixed; inset: 0; z-index: 999998;
      background: #000; overflow: hidden;
      opacity: 0; transition: opacity 0.4s ease;
    }
    #roro-splash.rs-show { opacity: 1; }
    #rs-intro { position: absolute; inset: 0; z-index: 2; overflow: hidden; }
    #rs-bg-svg {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
      will-change: transform; transform-origin: center center;
    }
    .rs-abs {
      position: absolute; left: 50%;
      white-space: nowrap; will-change: transform, opacity, filter;
    }
    #rs-mmxxvi {
      font-family: 'Space Grotesk', 'Helvetica Neue', sans-serif;
      font-size: clamp(11px, 1.1vw, 18px); font-weight: 400;
      letter-spacing: 0.38em; text-transform: uppercase; color: #fff;
      transform: translateX(-50%);
    }
    #rs-mmxxvi .rs-acc { color: #edd0a1; }
    #rs-msm {
      font-family: 'Abril Fatface', Georgia, serif;
      font-size: clamp(72px, 10.5vw, 169px); font-weight: 400;
      color: #edd0a1; line-height: 1; letter-spacing: 0.02em;
      transform: translateX(-50%);
    }
    #rs-divider {
      height: 1px;
      background: linear-gradient(90deg,
        transparent 0%, rgba(255,255,255,0.55) 15%,
        rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.55) 85%, transparent 100%);
      transform-origin: center;
      left: 50%;
transform: translateX(-50%);
    }
    #rs-name {
      font-family: 'Cinzel', Georgia, serif;
      font-size: clamp(14px, 3.5vw, 53.2px); font-weight: 400;
      letter-spacing: clamp(0.1em, 0.2em, 0.28em); color: #fff;
      display: flex; align-items: baseline;
      gap: clamp(0.18em, 0.28em, 0.35em);
      transform: translateX(-50%);
    }
    #rs-name .rs-word { display: inline-flex; align-items: baseline; }
    #rs-name .rs-ini  { color: #edd0a1; }
    #rs-portfolio {
      font-family: 'Cinzel', Georgia, serif;
      font-size: clamp(12px, 1.75vw, 28px); font-weight: 400;
      letter-spacing: clamp(0.18em, 0.28em, 0.38em); color: #fff;
      transform: translateX(-50%);
    }
    #rs-portfolio .rs-acc { color: #edd0a1; }
    #rs-coords {
      font-family: 'Space Grotesk', 'Helvetica Neue', sans-serif;
      font-size: clamp(10px, 0.9vw, 15px); font-weight: 300;
      letter-spacing: 0.2em; color: #fff; transform: translateX(-50%);
    }
    #rs-coords .rs-acc { color: #edd0a1; }
    #rs-loader {
      position: absolute; inset: 0; display: none;
      flex-direction: column; align-items: center; justify-content: center;
      z-index: 3; opacity: 0; transition: opacity 0.65s ease;
    }
    #rs-loader.rs-show { opacity: 1; }
    .rs-ld-grid {
      position: absolute; inset: 0; pointer-events: none; z-index: 0;
      background-image:
        linear-gradient(var(--border, #1a1a1a) 1px, transparent 1px),
        linear-gradient(90deg, var(--border, #1a1a1a) 1px, transparent 1px);
      background-size: 60px 60px;
      -webkit-mask-image: radial-gradient(ellipse 80% 65% at 50% 50%, black 5%, transparent 100%);
      mask-image: radial-gradient(ellipse 80% 65% at 50% 50%, black 5%, transparent 100%);
    }
    .rs-grain {
      position: absolute; inset: 0; pointer-events: none; z-index: 1;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E");
      opacity: 0.55; animation: rsGrainShift 0.12s steps(1) infinite;
    }
    @keyframes rsGrainShift {
      0%{background-position:0 0}20%{background-position:-42px 18px}
      40%{background-position:24px -35px}60%{background-position:-14px 45px}
      80%{background-position:36px -12px}100%{background-position:0 0}
    }
    .rs-scan {
      position: absolute; left: 0; right: 0; height: 120px;
      pointer-events: none; z-index: 1; top: -120px;
      background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.011) 50%, transparent 100%);
      animation: rsScanMove 9s linear infinite;
    }
    @keyframes rsScanMove { 0%{top:-120px}100%{top:100%} }
    .rs-film {
      position: absolute; top: -30px; bottom: -30px; width: 28px;
      overflow: hidden; pointer-events: none; z-index: 1;
      opacity: 0; animation: rsFilmIn 1.5s ease 0.4s forwards;
    }
    @keyframes rsFilmIn { to{opacity:1} }
    .rs-film--l { left: clamp(8px,3vw,40px); }
    .rs-film--r { right: clamp(8px,3vw,40px); }
    .rs-belt { display: flex; flex-direction: column; gap: 6px; padding: 6px 0; }
    .rs-film--l .rs-belt { animation: rsUp 28s linear infinite; }
    .rs-film--r .rs-belt {
    animation: rsDown 28s linear infinite; }
    @keyframes rsUp   { from{transform:translateY(0)}to{transform:translateY(-50%)} }
    @keyframes rsDown { from{transform:translateY(-50%)}to{transform:translateY(0)} }
    .rs-frame {
      width:28px;height:18px;border:1px solid var(--border2,#222);
      border-radius:2px;flex-shrink:0;opacity:.22;position:relative;
    }
    .rs-frame::before,.rs-frame::after {
      content:'';position:absolute;width:4px;height:4px;border-radius:1px;
      background:var(--bg,#080808);border:1px solid var(--border2,#222);
      top:50%;transform:translateY(-50%);
    }
    .rs-frame::before{left:2px} .rs-frame::after{right:2px}
    .rs-frame.rs-f-accent{opacity:.5;border-color:var(--accent,#c8a96e)}
    .rs-ghost {
      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      display:flex;flex-direction:column;align-items:center;gap:2.4rem;
      opacity:0;user-select:none;pointer-events:none;z-index:0;transition:opacity 2.5s ease;
    }
    .rs-ghost.rs-on{opacity:.036}
    .rs-ghost-time-row{display:flex;align-items:flex-start;line-height:1}
    .rs-ghost-time {
      font-family:var(--ff-display,'Playfair Display',serif);
      font-size:clamp(14vw,20vw,26vw);font-weight:300;color:var(--text,#f0ebe0);
      letter-spacing:-.04em;line-height:1;white-space:nowrap;
    }
    .rs-ghost-ampm {
      font-family:var(--ff-mono,monospace);font-size:clamp(7vw,10vw,13vw);
      font-weight:300;color:var(--text,#f0ebe0);line-height:1.08;
      padding-top:.07em;margin-left:.08em;white-space:nowrap;
    }
    .rs-ghost-meta {
      font-family:var(--ff-mono,monospace);font-size:clamp(1.4vw,2.2vw,3vw);
      color:var(--text,#f0ebe0);letter-spacing:.38em;text-transform:uppercase;
      white-space:nowrap;line-height:1;
    }
    .rs-inner {
      position:relative;z-index:2;width:100%;max-width:520px;padding:0 3rem;
      display:flex;flex-direction:column;align-items:center;
    }
    .rs-welcome-shell {
      width:100%;min-height:5rem;display:flex;align-items:center;
      justify-content:center;text-align:center;margin-bottom:1rem;
    }
    .rs-welcome {
      font-family:var(--ff-display,'Playfair Display',serif);
      font-size:clamp(1.8rem,5vw,3rem);font-weight:400;font-style:italic;
      color:var(--text,#f0ebe0);line-height:1.2;opacity:0;transform:translateY(16px);
      transition:opacity 1.1s cubic-bezier(.16,1,.3,1),transform 1.1s cubic-bezier(.16,1,.3,1);
    }
    .rs-welcome.rs-on{opacity:1;transform:translateY(0)}
    .rs-facts-shell {
      width:100%;height:20px;overflow:hidden;margin-bottom:1.8rem;
      opacity:0;transition:opacity .8s ease;
    }
    .rs-facts-shell.rs-on{opacity:1}
    .rs-fact-txt {
      font-family:var(--ff-mono,monospace);font-size:.57rem;
      color:var(--text3,#555);letter-spacing:.07em;line-height:20px;text-align:center;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
      opacity:1;transition:opacity .09s ease;
    }
    .rs-fact-txt.rs-fade{opacity:0}
    .rs-fact-txt::before{content:'·  ';color:var(--accent,#c8a96e);opacity:.6}
    .rs-bar-shell { width:100%;margin-bottom:.8rem;opacity:0;animation:rsFadeIn .5s ease .2s forwards; }
    @keyframes rsFadeIn{from{opacity:0}to{opacity:1}}
    .rs-bar-row{display:flex;align-items:center;gap:10px}
    .rs-track { flex:1;height:1px;background:var(--border2,#222);position:relative;overflow:hidden; }
    .rs-fill {
      position:absolute;top:0;left:0;bottom:0;width:0%;
      background:var(--accent,#c8a96e);transition:width .38s cubic-bezier(.4,0,.2,1);
    }
    .rs-fill::after {
      content:'';position:absolute;top:0;bottom:0;right:-60px;width:60px;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.38),transparent);
      animation:rsShimmer 2s ease-in-out infinite;
    }
    @keyframes rsShimmer{0%,100%{opacity:0}50%{opacity:1}}
    .rs-pct {
      font-family:var(--ff-mono,monospace);font-size:.54rem;
      color:var(--text3,#555);letter-spacing:.06em;min-width:3.5ch;text-align:right;flex-shrink:0;
    }
    .rs-terminal-wrap{width:100%;margin-bottom:1.6rem;opacity:0;transition:opacity .4s ease}
    .rs-terminal-wrap.rs-on{opacity:1}
    .rs-log-panel {
      width:100%;max-height:0;overflow:hidden;
      transition:max-height .45s cubic-bezier(.16,1,.3,1);
      border:1px solid transparent;border-bottom:none;
      border-radius:4px 4px 0 0;background:rgba(200,169,110,.018);
    }
    .rs-log-panel.rs-open{max-height:240px;overflow-y:auto;border-color:var(--border2,#222)}
    .rs-log-panel::-webkit-scrollbar{width:3px}
    .rs-log-panel::-webkit-scrollbar-track{background:transparent}
    .rs-log-panel::-webkit-scrollbar-thumb{background:var(--border2,#222);border-radius:2px}
    .rs-log-header {
      display:flex;align-items:center;justify-content:space-between;
      padding:.55rem .85rem .4rem;border-bottom:1px solid var(--border2,#222);
    }
    .rs-log-title {
      font-family:var(--ff-mono,monospace);font-size:.52rem;
      color:var(--accent,#c8a96e);letter-spacing:.14em;text-transform:uppercase;
    }
    .rs-log-close{font-family:var(--ff-mono,monospace);font-size:.5rem;color:var(--text3,#555);letter-spacing:.08em}
    .rs-log-entries{padding:.55rem .85rem .7rem;display:flex;flex-direction:column;gap:.38rem}
    .rs-log-entry {
      font-family:var(--ff-mono,monospace);font-size:.545rem;
      color:var(--text3,#555);letter-spacing:.05em;line-height:1.5;
      opacity:0;transform:translateY(4px);transition:opacity .18s ease,transform .18s ease;
    }
    .rs-log-entry.rs-on{opacity:1;transform:translateY(0)}
    .rs-log-entry::before{content:'  › ';color:var(--accent,#c8a96e);opacity:.45}
    .rs-log-entry.rs-log-done{color:var(--text,#f0ebe0);opacity:0}
    .rs-log-entry.rs-log-done.rs-on{opacity:1}
    .rs-log-entry.rs-log-done::before{content:'  ✓ ';color:var(--accent,#c8a96e);opacity:.85}
    .rs-terminal {
      display:flex;align-items:center;gap:.65rem;padding:.52rem .8rem;
      border-left:2px solid var(--accent,#c8a96e);background:rgba(200,169,110,.026);
      cursor:pointer;user-select:none;transition:background .25s ease;
    }
    .rs-terminal:hover{background:rgba(200,169,110,.052)}
    .rs-terminal-wrap.rs-log-open .rs-terminal{border-top:1px solid var(--border2,#222)}
    .rs-term-prefix{font-family:var(--ff-mono,monospace);font-size:.65rem;color:var(--accent,#c8a96e);flex-shrink:0;line-height:1}
    .rs-term-msg {
      font-family:var(--ff-mono,monospace);font-size:.57rem;color:var(--text3,#555);
      letter-spacing:.055em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;
      opacity:1;transition:opacity .09s ease;
    }
    .rs-term-msg.rs-fade{opacity:0}
    .rs-term-cursor{font-family:var(--ff-mono,monospace);font-size:.57rem;color:var(--accent,#c8a96e);flex-shrink:0;animation:rsBlink 1.1s step-end infinite}
    @keyframes rsBlink{0%,100%{opacity:0}50%{opacity:1}}
    .rs-term-chevron {
      font-size:.48rem;color:var(--text3,#555);flex-shrink:0;
      transition:transform .35s cubic-bezier(.16,1,.3,1),color .2s ease;
      opacity:.55;margin-left:2px;
    }
    .rs-terminal-wrap.rs-log-open .rs-term-chevron{transform:rotate(180deg);color:var(--accent,#c8a96e);opacity:1}
    .rs-continue {
      width:100%;background:none;border:none;color:var(--text3,#555);
      font-family:var(--ff-mono,monospace);font-size:.63rem;letter-spacing:.32em;
      text-transform:uppercase;padding:13px 0;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      opacity:0;pointer-events:none;outline:none;transform:translateY(8px);
      transition:opacity .75s ease,transform .75s cubic-bezier(.16,1,.3,1),color .3s ease;
    }
    .rs-continue.rs-show{opacity:1;pointer-events:all;transform:translateY(0)}
    .rs-continue:hover{color:var(--text,#f0ebe0)}
    .rs-continue:hover .rs-dash{background:var(--accent,#c8a96e);opacity:.4}
    .rs-dash{flex:1;height:1px;background:var(--border2,#222);max-width:80px;transition:background .3s,opacity .3s}
    .rs-cword{padding:0 16px;flex-shrink:0}
    @media(max-width:540px){
      .rs-inner{padding:0 1.4rem}
      .rs-film--l,.rs-film--r{display:none}
    }
  `;

  var MSGS = [
    "Convincing AI not to turn evil...","Marinating website...",
    "Debugging the debugger...","Aligning satellite dishes...",
    "Checking to see if anyone is still reading this...",
    "Compiling pixels into a masterpiece...","Brewing coffee for the server...",
    "Recalibrating the flux capacitor...",
    "Deleting 'Untitled_Final_v2_REAL_FINAL.js'...",
    "Feeding the hamsters that power the engine..."
  ];
  var FIRST_LINES = [
    "Welcome.","You've arrived.","Something worth seeing awaits.",
    "An intentional space.","Not many find their way here.",
    "Presence acknowledged.","Built for people who notice things."
  ];
  var RETURN_LINES = [
    "Welcome back, {n}.","Still curious, {n}?","You returned, {n}.",
    "{n}. Good to have you back.","Again, {n}. That means something.",
    "Back already, {n}.","The site remembers you, {n}."
  ];
  var CTX = {
    night:["The world is quiet. You're still here.","Building at midnight. That's a certain kind of ambition.","Late nights have a clarity daylight rarely offers.","The rare hour. Use it.","Most of the city is asleep right now."],
    dawn:["Before dawn. The rarest window.","You're up before most cities are.","Pre-dawn. A strange calm settles here.","The world resets in a few hours.","Early enough to see things clearly."],
    morning:["Morning already in motion.","First thoughts of the day carry weight.","The day hasn't decided what it is yet.","Good time to build. Or explore.","Morning light is honest."],
    midday:["Midday. Half the day already spent.","The machine is running. You found a pause.","Somewhere between intention and momentum.","Post-morning clarity. Good timing.","Noon. A strange pivot."],
    afternoon:["The afternoon carries a certain weight.","The day has settled into itself now.","That quiet hour before the light shifts.","Golden hour is not far.","Afternoons here feel slightly different."],
    evening:["Evening feels quieter here.","The day is softening at its edges.","Evenings are for noticing things you missed.","Dusk settles differently when you're paying attention.","End-of-day clarity."],
    latenight:["Night has a particular kind of focus.","Late enough to mean something.","The city dims. You stay lit.","Burning the midnight oil. Noted.","After-hours. This is when real things happen."]
  };
  var FACTS = [
    "A teaspoon of neutron star material weighs around 6 billion tons",
    "Venus rotates clockwise — opposite to most planets",
    "There are more stars in the universe than grains of sand on all Earth's beaches",
    "The Moon drifts ~1.5 inches further from Earth every year",
    "A human sneeze can reach 100 miles per hour",
    "Bananas grow upward against gravity — called negative geotropism",
    "The bumblebee bat weighs 0.05 oz — the world's smallest mammal",
    "All clownfish are born male — the dominant one can change sex",
    "Hippos can't swim. They gallop along riverbeds instead",
    "The oldest cat ever recorded lived 38 years and 3 days",
    "Humans blink up to 28,800 times per day",
    "Your stomach gets a new lining every 3–4 days",
    "Identical twins do not share fingerprints",
    "About 10% of all people are left-handed",
    "The human brain burns ~400–500 calories per day just to function",
    "The Anglo-Zanzibar War of 1896 lasted exactly 38 minutes",
    "Egypt is considered the world's oldest country — dating to 3100 BCE",
    "The Eiffel Tower grows up to 6 inches taller in summer",
    "The letter J was the last letter added to the English alphabet",
    "The # symbol is officially called an octothorpe",
    "HINT: Click the name on the homepage 7 times. Something will appear",
    "HINT: Type the word 'manomay' on your keyboard anywhere on the site",
    "Some sections require a password — the Contact page is how you ask",
    "The Clock page activates a hidden state on August 29th",
    "There are 14 sections on this site. Most visitors find 6 or 7",
    "The background music has two tracks. Only one is immediately visible",
    "Every pixel of this site was written by hand. No templates. No frameworks",
    "The Journey timeline covers 19 chapters — from 2008 to the present",
    "RoRo is the site's intelligence layer. Try asking it something",
    "Some photo albums require trust. There's a reason they're locked",
    "The mechanical click sound in the nav can be toggled off",
    "There are four visual themes. Switching changes more than colours",
    "Five fully playable games are built into this site. No shortcuts",
    "The hero name cycles its highlighted word on every reload",
    "The vinyl record in the bottom-left corner doesn't always appear",
    "Nothing here was accidental. Every element was placed deliberately",
    "The Thoughts section has 16 posts across 6 categories — all personal",
    "RoRo stands for nothing specific. It just felt right when named",
    "Some of the best content here sits behind a password — knock politely",
    "The footer says it plainly: built with intention, not a template"
  ];
  var MILESTONES = [
    [0,0],[320,7],[640,16],[1030,29],[1480,43],
    [2000,57],[2500,68],[3020,78],[3470,87],[3860,93],[4240,97],[4500,100]
  ];

  function buildBgSvg() {
    var W = window.innerWidth, H = window.innerHeight;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.id = 'rs-bg-svg';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('aria-hidden', 'true');
    var defs = document.createElementNS(svgNS, 'defs');
    var cp = document.createElementNS(svgNS, 'clipPath');
    cp.id = 'rs-vp';
    var cr = document.createElementNS(svgNS, 'rect');
    cr.setAttribute('x', -W); cr.setAttribute('y', -H);
    cr.setAttribute('width', W * 3); cr.setAttribute('height', H * 3);
    cp.appendChild(cr); defs.appendChild(cp); svg.appendChild(defs);
    var g = document.createElementNS(svgNS, 'g');
    g.setAttribute('clip-path', 'url(#rs-vp)');
    var cx = W / 2, cy = H / 2, N = 16;
    var minS = Math.min(W, H) * 0.05;
    var maxS = Math.max(W, H) * 2.7;
    var lines = [];
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1);
      var tE = Math.pow(t, 0.6);
      var rw = minS + tE * (maxS - minS);
      var rh = rw * (H / W);
      var rx = Math.min(rw, rh) * 0.28;
      var x = cx - rw / 2, y = cy - rh / 2;
      var op = 0.025 + t * 0.50;
      var rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', x.toFixed(1)); rect.setAttribute('y', y.toFixed(1));
      rect.setAttribute('width', rw.toFixed(1)); rect.setAttribute('height', rh.toFixed(1));
      rect.setAttribute('rx', rx.toFixed(1)); rect.setAttribute('ry', rx.toFixed(1));
      rect.setAttribute('fill', 'none');
      rect.setAttribute('stroke', 'rgba(255,255,255,' + op.toFixed(3) + ')');
      rect.setAttribute('stroke-width', i < 4 ? '1' : i < 10 ? '1.2' : '1.5');
      rect.style.opacity = '0';
      lines.push(rect); g.appendChild(rect);
    }
    svg.appendChild(g); svg._lines = lines;
    return svg;
  }

  function RoroSplash() {
    this._user = this._readUser();
    this._msgIdx = 0; this._factIdx = Math.floor(Math.random() * FACTS.length);
    this._factTimer = null; this._msgTimer = null; this._clockInt = null;
    this._isDone = false; this._logOpen = false; this._logData = [];
    this._rotateRaf = null; this._svgAngle = 0;
    this._injectCSS(); this._dom(); this._revealSplash();
    var self = this;
    whenGsap(function () {
      requestAnimationFrame(function () { requestAnimationFrame(function () { self._runIntro(); }); });
    });
  }

  RoroSplash.prototype._readUser = function () {
    try { return JSON.parse(localStorage.getItem('roroUser') || 'null'); } catch (e) { return null; }
  };

  RoroSplash.prototype._injectCSS = function () {
    if (document.getElementById('rs-css')) return;
    var s = document.createElement('style');
    s.id = 'rs-css'; s.textContent = CSS; document.head.appendChild(s);
  };

  RoroSplash.prototype._strip = function (side) {
    var w = document.createElement('div'); w.className = 'rs-film rs-film--' + side;
    var b = document.createElement('div'); b.className = 'rs-belt';
    var h = '';
    for (var i = 0; i < 60; i++) h += '<div class="rs-frame' + (i%5===0?' rs-f-accent':'') + '"></div>';
    b.innerHTML = h + h; w.appendChild(b); return w;
  };

  RoroSplash.prototype._dom = function () {
    var root = document.createElement('div'); root.id = 'roro-splash';
    var intro = document.createElement('div'); intro.id = 'rs-intro';
    var bgSvg = buildBgSvg();
    this._bgSvg = bgSvg; this._lines = bgSvg._lines;
    intro.appendChild(bgSvg);
    function mkEl(tag, id, html) {
      var el = document.createElement(tag);
      el.id = id; el.className = 'rs-abs';
      if (html) el.innerHTML = html; return el;
    }
    var mmxxvi = mkEl('div','rs-mmxxvi','<span class="rs-acc">MM</span><span>XXVI</span>');
    var msm    = mkEl('div','rs-msm','MSM');
    var divEl  = mkEl('div','rs-divider','');
    var name   = mkEl('div','rs-name',
      '<span class="rs-word"><span class="rs-ini">M</span>anomay</span>' +
      '<span class="rs-word"><span class="rs-ini">S</span>hailendra</span>' +
      '<span class="rs-word"><span class="rs-ini">M</span>isra</span>');
    var port   = mkEl('div','rs-portfolio','<span class="rs-acc">P</span>ortfolio <span class="rs-acc">W</span>ebsite');
    var coords = mkEl('div','rs-coords','12\u00b059\'39.7"<span class="rs-acc">N</span>&nbsp;&nbsp;77\u00b042\'59.2"<span class="rs-acc">E</span>');
    [mmxxvi,msm,divEl,name,port,coords].forEach(function(el){intro.appendChild(el);});
    root.appendChild(intro);
    var loader = document.createElement('div'); loader.id = 'rs-loader';
    var ghost = document.createElement('div'); ghost.className = 'rs-ghost'; ghost.id = 'rs-ghost'; ghost.setAttribute('aria-hidden','true');
    var tr = document.createElement('div'); tr.className = 'rs-ghost-time-row';
    var gt = document.createElement('span'); gt.className = 'rs-ghost-time'; gt.id = 'rs-ghost-time';
    var ga = document.createElement('span'); ga.className = 'rs-ghost-ampm'; ga.id = 'rs-ghost-ampm';
    tr.appendChild(gt); tr.appendChild(ga); ghost.appendChild(tr);
    var gm = document.createElement('span'); gm.className = 'rs-ghost-meta'; gm.id = 'rs-ghost-meta';
    ghost.appendChild(gm); loader.appendChild(ghost);
    var lg = document.createElement('div'); lg.className = 'rs-ld-grid'; loader.appendChild(lg);
    var gr = document.createElement('div'); gr.className = 'rs-grain'; gr.setAttribute('aria-hidden','true'); loader.appendChild(gr);
    var sc = document.createElement('div'); sc.className = 'rs-scan'; sc.setAttribute('aria-hidden','true'); loader.appendChild(sc);
    loader.appendChild(this._strip('l')); loader.appendChild(this._strip('r'));
    var inner = document.createElement('div'); inner.className = 'rs-inner';
    inner.innerHTML =
      '<div class="rs-welcome-shell" id="rs-ws"><div class="rs-welcome" id="rs-welcome"></div></div>' +
      '<div class="rs-facts-shell" id="rs-facts-shell"><div class="rs-fact-txt" id="rs-fact-txt"></div></div>' +
      '<div class="rs-bar-shell"><div class="rs-bar-row">' +
        '<div class="rs-track" id="rs-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
          '<div class="rs-fill" id="rs-fill"></div></div>' +
        '<div class="rs-pct" id="rs-pct">0%</div></div></div>' +
      '<div class="rs-terminal-wrap" id="rs-terminal-wrap">' +
        '<div class="rs-log-panel" id="rs-log-panel">' +
          '<div class="rs-log-header"><span class="rs-log-title">TERMINAL LOG</span><span class="rs-log-close">▲ COLLAPSE</span></div>' +
          '<div class="rs-log-entries" id="rs-log-entries"></div></div>' +
        '<div class="rs-terminal" id="rs-terminal" role="button" tabindex="0" aria-label="Toggle terminal log">' +
          '<span class="rs-term-prefix">›</span><span class="rs-term-msg" id="rs-term-msg"></span>' +
          '<span class="rs-term-cursor" aria-hidden="true">_</span>' +
          '<span class="rs-term-chevron" id="rs-term-chevron" aria-hidden="true">▾</span></div></div>' +
      '<button class="rs-continue" id="rs-continue" type="button" aria-label="Enter site">' +
        '<span class="rs-dash" aria-hidden="true"></span><span class="rs-cword">CONTINUE</span>' +
        '<span class="rs-dash" aria-hidden="true"></span></button>';
    loader.appendChild(inner); root.appendChild(loader);
    document.body.appendChild(root);
    this._root=root; this._intro=intro; this._elMSM=msm; this._elDiv=divEl;
    this._elName=name; this._elPort=port; this._elCoords=coords; this._elMM=mmxxvi;
    this._ghost=document.getElementById('rs-ghost');
    this._ghostTime=document.getElementById('rs-ghost-time');
    this._ghostAmpm=document.getElementById('rs-ghost-ampm');
    this._ghostMeta=document.getElementById('rs-ghost-meta');
    this._welcome=document.getElementById('rs-welcome');
    this._factsS=document.getElementById('rs-facts-shell');
    this._factsT=document.getElementById('rs-fact-txt');
    this._fill=document.getElementById('rs-fill');
    this._track=document.getElementById('rs-track');
    this._pct=document.getElementById('rs-pct');
    this._termWrap=document.getElementById('rs-terminal-wrap');
    this._terminal=document.getElementById('rs-terminal');
    this._termMsg=document.getElementById('rs-term-msg');
    this._logPanel=document.getElementById('rs-log-panel');
    this._logEntries=document.getElementById('rs-log-entries');
    this._cont=document.getElementById('rs-continue');
  };

  RoroSplash.prototype._revealSplash = function () {
  var self = this;
  var oldLS = document.getElementById('loading-screen');
  if (oldLS) oldLS.style.cssText = 'display:none!important';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      self._root.classList.add('rs-show');
      var cover = document.getElementById('roro-cover');
      if (cover) setTimeout(function () { if (cover.parentNode) cover.remove(); }, 460);
    });
  });

  /* ── Skip splash on rapid clicking ─────────────────────────
     Click anywhere on the splash 20–25 times rapidly to skip
     the whole intro and go straight to the homepage.
     Hidden feature — no UI hint. Useful when you need to test.
  ───────────────────────────────────────────────────────── */
  var _skipCount = 0;
  var _skipAt    = 20 + Math.floor(Math.random() * 6); /* random 20–25 */

     self._root.addEventListener('click', function (e) {
    /* Ignore clicks on the Continue button — that's the normal exit */
    if (e.target.id === 'rs-continue' || e.target.closest('#rs-continue')) return;
    _skipCount++;
    if (_skipCount >= _skipAt && !self._finishing) { /* ← guard added */
      self._finish();
    }
  });
};

  RoroSplash.prototype._runIntro = function () {
    var self=this, gsap=window.gsap;
    var W=window.innerWidth, H=window.innerHeight;
    var lines=this._lines, svg=this._bgSvg;
    var msm=this._elMSM, divEl=this._elDiv, name=this._elName;
    var port=this._elPort, coords=this._elCoords, mmxxvi=this._elMM;

    var msmH=msm.offsetHeight||140, nameH=name.offsetHeight||45;
    var divH=Math.max(1,divEl.offsetHeight), portH=port.offsetHeight||35;
    var mmH=mmxxvi.offsetHeight||22;
    var G1=Math.round(H*0.022), G2=Math.round(H*0.026);
    var totalS1=msmH+G1+divH+G1+nameH;
    var s1Top=Math.round((H-totalS1)/2);
    var msmTop=s1Top, divTop=s1Top+msmH+G1, nameTop=divTop+divH+G1;
    var nameFinalTop=msmTop+Math.round((msmH-nameH)/2);
    var portFinalTop=nameTop;
    var mmFinalTop = nameFinalTop - G2 - mmH + 9;
    var coordsFinalTop=portFinalTop+portH+G2;
    var divW=Math.min(Math.round(W*0.55),900);

    function pos(el,top){ el.style.top=top+'px'; el.style.left='50%'; el.style.position='absolute'; }
    pos(msm,msmTop); pos(divEl,divTop); pos(name,nameTop);
    pos(port,portFinalTop); pos(coords,coordsFinalTop); pos(mmxxvi,mmFinalTop);
    divEl.style.width=divW+'px';

    lines.forEach(function(l){l.style.opacity='0';});
    gsap.set(msm,{opacity:0,scale:1.08,filter:'blur(22px)'});
    gsap.set(divEl,{scaleX:0,opacity:0,transformOrigin:'center center'});
    gsap.set(name,{opacity:0,y:20}); gsap.set(port,{opacity:0,filter:'blur(16px)',y:14});
    gsap.set(coords,{opacity:0,y:22}); gsap.set(mmxxvi,{opacity:0,y:18});

    var lastTs=null;
    function rotateTick(ts){
      if(!self._rotateRaf) return;
      if(lastTs===null) lastTs=ts;
      self._svgAngle+=1.6*(ts-lastTs)/1000; lastTs=ts;
      svg.style.transform='rotate('+self._svgAngle.toFixed(3)+'deg)';
      self._rotateRaf=requestAnimationFrame(rotateTick);
    }
    self._rotateRaf=requestAnimationFrame(rotateTick);

    var tl=gsap.timeline({onComplete:function(){self._showLoader();}});
    lines.forEach(function(line,i){ tl.to(line,{opacity:1,duration:0.55,ease:'power1.inOut'},i*0.038); });
    tl.to(msm,{opacity:1,scale:1,filter:'blur(0px)',duration:1.55,ease:'power2.out'},0.15);
    tl.to(divEl,{scaleX:1,opacity:1,duration:0.7,ease:'power3.out'},1.55);
    tl.to(name,{opacity:1,y:0,duration:0.85,ease:'power2.out'},1.85);
    tl.to(msm,{opacity:0,scale:0.96,filter:'blur(18px)',duration:0.72,ease:'power2.in'},3.2);
    var panUp = (nameTop - nameFinalTop) * 0.75;
    tl.to(name,{y:-panUp,duration:0.88,ease:'power2.inOut'},3.2);
    tl.to(mmxxvi,{opacity:1,y:0,duration:0.65,ease:'power2.out'},3.28);
    tl.to(port,{opacity:1,filter:'blur(0px)',y:0,duration:0.85,ease:'power2.out'},3.48);
    tl.to(coords,{opacity:1,y:0,duration:0.72,ease:'power2.out'},3.6);
    tl.to({},{duration:1.3},4.5);
  };

  RoroSplash.prototype._showLoader = function () {
    var self=this, loader=document.getElementById('rs-loader');
    this._intro.style.transition='opacity 0.8s ease';
    this._intro.style.opacity='0';
    setTimeout(function(){
      if(self._intro) self._intro.style.display='none';
      if(self._rotateRaf){cancelAnimationFrame(self._rotateRaf);self._rotateRaf=null;}
      loader.style.display='flex';
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        loader.classList.add('rs-show'); self._runLoader();
      });});
    },620);
  };

  RoroSplash.prototype._runLoader = function () {
    var self=this;
    this._tick(); this._clockInt=setInterval(function(){self._tick();},1000);
    setTimeout(function(){self._ghost.classList.add('rs-on');},200);
    var firstMsg=MSGS[this._msgIdx%MSGS.length]; this._msgIdx++;
    this._termMsg.textContent=firstMsg; this._logData.push({text:firstMsg,done:false});
    this._termWrap.classList.add('rs-on');
    this._msgTimer=setInterval(function(){self._nextMsg();},700);
    this._progress();
    this._factsT.textContent=FACTS[this._factIdx];
    this._factTimer=setInterval(function(){self._nextFact();},2400);
    setTimeout(function(){self._welcome.textContent=self._getWelcome();self._welcome.classList.add('rs-on');},250);
    setTimeout(function(){self._factsS.classList.add('rs-on');},550);
    this._terminal.addEventListener('click',function(){self._toggleLogPanel();});
    this._terminal.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();self._toggleLogPanel();}});
    this._cont.addEventListener('click',function(){self._finish();});
  };

  RoroSplash.prototype._progress = function () {
    var self=this;
    MILESTONES.forEach(function(m){
      setTimeout(function(){
        self._fill.style.width=m[1]+'%'; self._pct.textContent=m[1]+'%';
        self._track.setAttribute('aria-valuenow',m[1]);
        if(m[1]===100) setTimeout(function(){self._done();},300);
      },m[0]);
    });
  };

  RoroSplash.prototype._done = function () {
    var self=this; this._isDone=true; clearInterval(this._msgTimer);
    this._termMsg.classList.add('rs-fade');
    setTimeout(function(){
      self._termMsg.textContent='READY.'; self._termMsg.classList.remove('rs-fade');
      self._logData.push({text:'READY.',done:true});
      if(self._logOpen) self._renderLogPanel();
    },95);
    setTimeout(function(){self._cont.classList.add('rs-show');},500);
  };

  RoroSplash.prototype._nextMsg = function () {
    if(this._isDone) return;
    var self=this, text=MSGS[this._msgIdx%MSGS.length]; this._msgIdx++;
    this._termMsg.classList.add('rs-fade');
    setTimeout(function(){
      if(self._isDone) return;
      self._termMsg.textContent=text; self._termMsg.classList.remove('rs-fade');
      self._logData.push({text:text,done:false});
      if(self._logOpen) self._renderLogPanel();
    },95);
  };

  RoroSplash.prototype._nextFact = function () {
    var self=this; this._factsT.classList.add('rs-fade');
    setTimeout(function(){
      self._factIdx=(self._factIdx+1)%FACTS.length;
      self._factsT.textContent=FACTS[self._factIdx];
      self._factsT.classList.remove('rs-fade');
    },100);
  };

  RoroSplash.prototype._toggleLogPanel = function () {
    this._logOpen=!this._logOpen;
    if(this._logOpen){
      this._renderLogPanel();
      this._logPanel.classList.add('rs-open');
      this._termWrap.classList.add('rs-log-open');
    } else {
      this._logPanel.classList.remove('rs-open');
      this._termWrap.classList.remove('rs-log-open');
    }
  };

  RoroSplash.prototype._renderLogPanel = function () {
    var entries=this._logData.slice();
    for(var i=entries.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1)),t=entries[i];entries[i]=entries[j];entries[j]=t;
    }
    var c=this._logEntries; c.innerHTML='';
    entries.forEach(function(e,idx){
      var d=document.createElement('div');
      d.className='rs-log-entry'+(e.done?' rs-log-done':'');
      d.textContent=e.text; c.appendChild(d);
      setTimeout(function(){d.classList.add('rs-on');},idx*28+20);
    });
  };

  RoroSplash.prototype._tick = function () {
    var now=new Date(), h=now.getHours(), m=String(now.getMinutes()).padStart(2,'0');
    var ap=h>=12?'PM':'AM'; h=h%12||12;
    var DAYS=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    var MON=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    this._ghostTime.textContent=h+':'+m; this._ghostAmpm.textContent=ap;
    this._ghostMeta.textContent=DAYS[now.getDay()]+'\u00a0\u00b7\u00a0'+MON[now.getMonth()]+'\u00a0'+now.getDate();
  };

  RoroSplash.prototype._getWelcome = function () {
    if(this._user&&this._user.name)
      return RETURN_LINES[Math.floor(Math.random()*RETURN_LINES.length)].replace('{n}',this._user.name);
    if(Math.random()>0.5) return FIRST_LINES[Math.floor(Math.random()*FIRST_LINES.length)];
    var h=new Date().getHours();
    var pool=h<4?CTX.night:h<7?CTX.dawn:h<12?CTX.morning:h<14?CTX.midday:h<18?CTX.afternoon:h<21?CTX.evening:CTX.latenight;
    return pool[Math.floor(Math.random()*pool.length)];
  };

  RoroSplash.prototype._finish = function () {
    if (this._finishing) return;   /* ← guard: prevent double-call on rapid click */
    this._finishing = true;
    var self=this, overlay=document.getElementById('transition-overlay');
    window._roroActive=false; document.body.style.overflow='';
     
    if(overlay){
      overlay.style.transition='transform 0.4s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transformOrigin='bottom'; overlay.style.transform='scaleY(1)';
      setTimeout(function(){
        self._cleanup();
        var bgm=document.getElementById('bg-music');
        if(bgm) bgm.play().catch(function(){});
        if(typeof window._roroRunHero==='function') window._roroRunHero();
        setTimeout(function(){
          overlay.style.transition='transform 0.5s cubic-bezier(0.76,0,0.24,1)';
          overlay.style.transformOrigin='top'; overlay.style.transform='scaleY(0)';
        },60);
      },420);
    } else {
      self._root.style.transition='opacity 0.6s ease'; self._root.style.opacity='0';
      setTimeout(function(){
        self._cleanup();
        var bgm=document.getElementById('bg-music');
        if(bgm) bgm.play().catch(function(){});
        if(typeof window._roroRunHero==='function') window._roroRunHero();
      },650);
    }
    setTimeout(function(){HTMLMediaElement.prototype.play=_origPlay;},500);
  };

  RoroSplash.prototype._cleanup = function () {
    clearInterval(this._clockInt); clearInterval(this._factTimer); clearInterval(this._msgTimer);
    if(this._rotateRaf){cancelAnimationFrame(this._rotateRaf);this._rotateRaf=null;}
    if(this._root&&this._root.parentNode) this._root.remove();
    var css=document.getElementById('rs-css'); if(css) css.remove();
    document.body.style.overflow='';
  };

  document.addEventListener('DOMContentLoaded', function () {
    var _oh         = window.startHeroAnimations;
    var _heroRan    = false;   /* ← guard: hero animations run exactly once */

    window.startHeroAnimations = function(){};

    window._roroRunHero = function(){
      if (_heroRan) return;                  /* ← prevents duplicate intervals */
      _heroRan = true;
      window.startHeroAnimations = _oh;
      if (typeof _oh === 'function') _oh();
    };

    window._roroSplashInstance = new RoroSplash();
  });

  window.initRoroSplash=function(){
    window._roroSplashInstance=new RoroSplash();
  };

})();
