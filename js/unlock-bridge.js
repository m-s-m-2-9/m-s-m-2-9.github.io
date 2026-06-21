/* ═══════════════════════════════════════════════════════════════════
   js/unlock-bridge.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS DOES:
   Replaces the old local password check with a secure Cloudflare
   Worker call. Loaded AFTER js/data.js in index.html.

   ADD THIS TO index.html (after the js/data.js script tag):
     <script src="js/unlock-bridge.js"></script>
  
   ZERO visible changes — same input boxes, same buttons, same
   unlock animations. Content just comes from Cloudflare now.
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Your Cloudflare Worker URL — don't change unless you rename the Worker */
  var WORKER = 'https://msm-secrets.manomaysmisra2908.workers.dev';

  /* Cache unlocked sections for this browser tab session.
     User doesn't need to re-enter password if they navigate away and back. */
  var _cache = {};

  /* ════════════════════════════════════════════════════════════════
     Override window.unlockSection  (originally in data.js)
     Same call signature used by every unlock button in index.html:
       unlockSection(inputId, sectionId, pwKey)
  ════════════════════════════════════════════════════════════════ */
  window.unlockSection = function (inputId, sectionId, pwKey) {
    var inputEl = document.getElementById(inputId);
    if (!inputEl) return;
    var password = (inputEl.value || '').trim();
    if (!password) { shake(inputEl); return; }

    /* Already unlocked this session — just show it again */
    if (_cache[pwKey]) {
      inject(pwKey, sectionId, _cache[pwKey]);
      reveal(sectionId);
      return;
    }

    /* Find the unlock button to show loading state */
    var btn = nearbyButton(inputEl);
    if (btn) { btn.textContent = '...'; btn.disabled = true; }

    fetch(WORKER + '/unlock', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ section: pwKey, password: password }),
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (btn) { btn.textContent = 'Unlock'; btn.disabled = false; }
      if (data.success && data.content) {
        _cache[pwKey] = data.content;
        inject(pwKey, sectionId, data.content);
        reveal(sectionId);
        /* Remove the password form so it doesn't show again */
        var form = inputEl.closest('.inline-password-form');
        if (form) form.remove();
        inputEl.value = '';
      } else {
        wrongPassword(inputEl);
      }
    })
    .catch(function () {
      if (btn) { btn.textContent = 'Unlock'; btn.disabled = false; }
      wrongPassword(inputEl, 'Connection error — try again.');
    });
  };

  /* ── Birthday special case ──────────────────────────────────────
     index.html uses unlockBirthday() instead of unlockSection() for
     the Clock page because it also called renderBirthdayDetails().
     We override it here so it uses the Worker too.               */
  window.unlockBirthday = function () {
    window.unlockSection('bday-pw', 'bday-secret-info', 'birthday');
  };

  /* ════════════════════════════════════════════════════════════════
     CONTENT INJECTORS — one for each section type
  ════════════════════════════════════════════════════════════════ */
  function inject(section, sectionId, content) {
    switch (section) {
      case 'about':    injectAbout(sectionId, content);    break;
      case 'photos':   injectPhotos(sectionId, content);   break;
      case 'journey':  injectJourney(sectionId, content);  break;
      case 'birthday': injectBirthday(sectionId, content); break;
      case 'lists':    injectLists(sectionId, content);    break;
      case 'games':    injectGames(sectionId, content);    break;
      default:         injectHTML(sectionId, content.html || ''); break;
    }
  }

  /* ── About / Identity private section ─────────────────────────── */
  function injectAbout(sectionId, content) {
    injectHTML(sectionId, content.html || '');
  }

  /* ── Photos — album grid + populate D.privateAlbums ─────────── */
  function injectPhotos(sectionId, content) {
    var albums = content.albums || [];

    /* Populate D.privateAlbums so openAlbum() works for the viewer */
    if (window.D) window.D.privateAlbums = albums;

    var container = document.getElementById(sectionId);
    if (!container) return;

    if (!albums.length) {
      container.innerHTML = '<p style="opacity:0.5;padding:2rem;">No private albums added yet.</p>';
      return;
    }

    /* Mirrors the renderAlbumGrid() function in data.js */
    container.innerHTML = albums.map(function (album) {
      var thumb = album.cover
        ? '<img src="' + esc(album.cover) + '" class="album-thumb" alt="' + esc(album.title) + '">'
        : '<div class="album-thumb-placeholder"><span style="font-size:2rem;color:var(--text3);">'
          + (album.icon || '\uD83D\uDDBC') + '</span></div>';
      var count = album.count || (album.photos && album.photos.length) || 0;
      return [
        '<div class="album-card" onclick="openAlbum(\'' + esc(album.id) + '\')">',
          thumb,
          '<div class="album-count">' + count + ' photos</div>',
          '<div class="album-overlay">',
            '<div class="album-title">' + esc(album.title || '') + '</div>',
            '<div class="album-desc">'  + esc(album.desc  || '') + '</div>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  /* ── Journey — private entries appended to the section ─────────── */
  function injectJourney(sectionId, content) {
    var entries = content.entries || [];
    var container = document.getElementById(sectionId);
    if (!container) return;

    if (!entries.length) {
      container.innerHTML = '<p style="opacity:0.5;padding:2rem;">No private entries added yet.</p>';
      return;
    }

    container.innerHTML = entries.map(function (e) {
      /* Convert \n\n to paragraph breaks */
      var body = esc(e.body || '').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
      return [
        '<div class="journey-entry" style="margin-bottom:3rem;">',
          '<div class="entry-year" style="font-size:0.8rem;opacity:0.5;letter-spacing:0.1em;margin-bottom:0.5rem;">'
            + esc(String(e.year || '')) + '</div>',
          e.title
            ? '<div class="entry-title" style="font-size:1.1rem;font-weight:600;margin-bottom:1rem;">'
              + esc(e.title) + '</div>'
            : '',
          '<div class="entry-body" style="line-height:1.8;color:var(--text2);"><p>' + body + '</p></div>',
        '</div>'
      ].join('');
    }).join('');
  }

  /* ── Birthday / Clock — fill in the birth-detail spans ─────────── */
  function injectBirthday(sectionId, content) {
    /* The birthday section has specific span IDs the site uses.
       We fill those spans + also show the container div.          */
    var dobEl   = document.getElementById('lbl-dob');
    var timeEl  = document.getElementById('lbl-time');
    var placeEl = document.getElementById('lbl-place');
    var ageEl   = document.getElementById('current-age');

    var monthDay  = content.birthdayDate || 'August 29';
    var birthYear = content.birthYear    || 2008;

    if (dobEl)   dobEl.textContent   = monthDay + ' ' + birthYear;
    if (timeEl)  timeEl.textContent  = content.birthTime  || '—';
    if (placeEl) placeEl.textContent = content.birthPlace || '—';

    if (ageEl) {
      var today = new Date();
      var age   = today.getFullYear() - birthYear;
      var bdayThisYear = new Date(today.getFullYear() + ' ' + monthDay);
      if (today < bdayThisYear) age--;
      ageEl.textContent = age;
    }
  }

  /* ── Lists — populate each tab panel ─────────────────────────── */
  function injectLists(sectionId, content) {
    /* Each tab panel already exists in the HTML.
       We fill in the list items for each one.  */
    var panels = {
      'list-series': content.series || [],
      'list-books':  content.books  || [],
      'list-places': content.places || [],
      'list-movies': content.movies || [],
    };

    Object.keys(panels).forEach(function (panelId) {
      var panelEl = document.getElementById(panelId);
      if (!panelEl) return;
      var items = panels[panelId];
      if (!items.length) {
        panelEl.innerHTML = '<p style="opacity:0.5;padding:1rem;">No items added yet.</p>';
        return;
      }
      panelEl.innerHTML = items.map(function (item, i) {
        return [
          '<div class="list-item">',
            '<div class="list-item-num">' + String(i + 1).padStart(2, '0') + '</div>',
            '<div class="list-item-title">' + esc(item) + '</div>',
          '</div>'
        ].join('');
      }).join('');
    });
  }

  /* ── Games — inject HTML directly ─────────────────────────────── */
  function injectGames(sectionId, content) {
    injectHTML(sectionId, content.html || '');
  }

  /* ── Generic HTML injection ─────────────────────────────────────── */
  function injectHTML(sectionId, html) {
    var el = document.getElementById(sectionId);
    if (el) el.innerHTML = html;
  }

  /* ── Reveal the section (same effect as before) ─────────────── */
  function reveal(sectionId) {
    var el = document.getElementById(sectionId);
    if (!el) return;
    el.style.display = 'block';
    el.classList.add('unlocked');
    el.classList.remove('locked');
  }

  /* ── UI helpers ──────────────────────────────────────────────── */
  function wrongPassword(inputEl, msg) {
    shake(inputEl);
    inputEl.value = '';
    var orig = inputEl.placeholder;
    inputEl.placeholder = msg || 'Incorrect — try again.';
    inputEl.style.borderColor = '#f87171';
    setTimeout(function () {
      inputEl.style.borderColor = '';
      inputEl.placeholder = orig;
    }, 2000);
  }

  function shake(el) {
    el.classList.remove('shake-error');
    void el.offsetWidth; /* force reflow */
    el.classList.add('shake-error');
    setTimeout(function () { el.classList.remove('shake-error'); }, 500);
  }

  function nearbyButton(inputEl) {
    var form = inputEl.closest('form, .inline-password-form, .gate-form, .gate-row, div');
    return form ? form.querySelector('button, [type="submit"]') : null;
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

})();
