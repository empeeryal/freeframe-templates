/* Slatework — site script
 * Vanilla JavaScript, no dependencies. Content and settings live in assets/js/data.js (window.SLATEWORK).
 * Sections:
 *  1. Settings that aren't content (storage keys, demo-date switches)
 *  2. Helpers (formatting, safe storage, URL parameters, announcements)
 *  3. Time: Eastern "today", time zone math, business days
 *  4. Theme, mobile menu, header, scroll reveal, copyright year
 *  5. Hero pipeline board (index.html)
 *  6. Structured interview scorecard (index.html, product.html)
 *  7. Job boards and posting preview (product.html)
 *  8. Interview scheduling (product.html)
 *  9. Offer pay band check (product.html)
 * 10. Pricing: billing switch and cost calculator (pricing.html)
 * 11. Customer stories filter (customers.html)
 * 12. Integrations directory (integrations.html)
 * 13. Data retention example (security.html)
 * 14. Resources: webinars, article filter, registration (resources.html)
 * 15. Demo request form (demo.html)
 * 16. Boot
 */
(function () {
  'use strict';

  var D = window.SLATEWORK;
  if (!D) return;

  /* ------------------------------------------------------------------
   * 1. Settings
   * ------------------------------------------------------------------ */
  // localStorage keys. Values are validated when read (see DOCS.md, "Saved data").
  var KEYS = {
    theme: 'slatework:theme',       // 'light' | 'dark'
    pipeline: 'slatework:pipeline', // { v: 1, stages: { candidateId: stageId }, order: [candidateId, ...] }
    pricing: 'slatework:pricing'    // { billing, employees, plan, hires }
  };

  // Demo dates. Everything dated that a visitor reads as "upcoming" is worked out from today in Eastern time:
  // interview slots, webinars, the proposed demo meeting and the retention example. A preview parameter
  // ?now=YYYY-MM-DDTHH:MM (Eastern) pretends it is another moment, for reviews and screenshots.
  var ALLOW_NOW_PARAM = true;

  var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* ------------------------------------------------------------------
   * 2. Helpers
   * ------------------------------------------------------------------ */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var has = function (obj, key) { return typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function plural(n, one, many) { return groupThousands(String(n)) + ' ' + (n === 1 ? one : (many || one + 's')); }
  function groupThousands(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  // Whole dollars: 15360 -> "$15,360".
  function money(n) { return '$' + groupThousands(String(Math.round(n))); }
  // Dollars with cents only when needed: 6.4 -> "$6.40", 8 -> "$8".
  function price(n) {
    var cents = Math.round(n * 100);
    return cents % 100 === 0 ? '$' + groupThousands(String(cents / 100)) : '$' + groupThousands(String(Math.floor(cents / 100))) + '.' + pad(cents % 100);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function initials(name) { return name.replace(/\./g, '').split(/\s+/).map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase(); }
  function announce(msg) {
    var r = $('#live-region');
    if (!r) return;
    r.textContent = '';
    setTimeout(function () { r.textContent = msg; }, 40);
  }
  function refCode(prefix, length) {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
    for (var i = 0; i < length; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return prefix + '-' + s;
  }
  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

  // localStorage, or an in-memory stand-in when storage is blocked (sandboxed iframes, strict privacy).
  var safeStorage = (function () {
    var local = null;
    try { local = window.localStorage; local.getItem('_'); } catch (e) { local = null; }
    var memory = Object.create(null);
    return {
      getItem: function (key) {
        if (key in memory) return memory[key];
        try { return local ? local.getItem(key) : null; } catch (e) { return null; }
      },
      setItem: function (key, value) {
        if (local) {
          try { local.setItem(key, String(value)); delete memory[key]; return; } catch (e) { /* full or blocked */ }
        }
        memory[key] = String(value);
      },
      removeItem: function (key) {
        delete memory[key];
        if (local) { try { local.removeItem(key); } catch (e) { /* blocked */ } }
      }
    };
  })();
  function readJSON(key) {
    try {
      var v = JSON.parse(safeStorage.getItem(key));
      return v && typeof v === 'object' ? v : null;
    } catch (e) { return null; }
  }
  function writeJSON(key, value) {
    if (value === null) safeStorage.removeItem(key);
    else safeStorage.setItem(key, JSON.stringify(value));
  }

  var params = new URLSearchParams(window.location.search);
  function intParam(name, lo, hi) {
    var raw = params.get(name);
    if (raw === null || !/^\d{1,6}$/.test(raw)) return null;
    var n = parseInt(raw, 10);
    return n >= lo && n <= hi ? n : null;
  }
  function setParams(values) {
    var url = new URL(window.location.href);
    Object.keys(values).forEach(function (k) {
      if (values[k] === null || values[k] === '') url.searchParams.delete(k);
      else url.searchParams.set(k, values[k]);
    });
    try { window.history.replaceState(null, '', url.pathname + url.search + url.hash); } catch (e) { /* file:// in some browsers */ }
  }

  /* ------------------------------------------------------------------
   * 3. Time
   * Calendar dates are day numbers (days since 1970-01-01) so daylight saving never shifts them.
   * ------------------------------------------------------------------ */
  var COMPANY_ZONE = D.COMPANY.timeZone;
  var partsCache = {};
  function zoneParts(date, zone) {
    var fmt = partsCache[zone];
    if (!fmt) {
      try {
        fmt = new Intl.DateTimeFormat('en-US', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
      } catch (e) { fmt = null; }
      partsCache[zone] = fmt;
    }
    if (!fmt) return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate(), hh: date.getHours(), mm: date.getMinutes() };
    var out = {};
    fmt.formatToParts(date).forEach(function (p) { out[p.type] = p.value; });
    return { y: +out.year, m: +out.month, d: +out.day, hh: +out.hour % 24, mm: +out.minute };
  }
  // A wall-clock time in a zone to a Date: zonedToDate(2026, 11, 10, 12, 30, 'America/New_York').
  function zonedToDate(y, m, d, hh, mm, zone) {
    var guess = Date.UTC(y, m - 1, d, hh, mm);
    for (var i = 0; i < 2; i++) {
      var p = zoneParts(new Date(guess), zone);
      var shown = Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm);
      var want = Date.UTC(y, m - 1, d, hh, mm);
      guess += want - shown;
    }
    return new Date(guess);
  }
  function dayNumber(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 864e5); }
  function ymdOf(day) { var t = new Date(day * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; }
  function weekdayOf(day) { return (day + 4) % 7; } // 1970-01-01 was a Thursday
  function longDate(day) { var p = ymdOf(day); return WEEKDAYS[weekdayOf(day)] + ', ' + MONTHS[p.m - 1] + ' ' + p.d + ', ' + p.y; }
  function shortDate(day) { var p = ymdOf(day); return MONTHS[p.m - 1].slice(0, 3) + ' ' + p.d + ', ' + p.y; }
  function hm(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }

  // "Now": the real time, or ?now=YYYY-MM-DDTHH:MM read as Eastern time.
  var NOW = (function () {
    var raw = ALLOW_NOW_PARAM ? params.get('now') : null;
    var m = raw && /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(raw);
    if (m) return zonedToDate(+m[1], +m[2], +m[3], +m[4], +m[5], COMPANY_ZONE);
    return new Date();
  })();
  var TODAY = (function () { var p = zoneParts(NOW, COMPANY_ZONE); return dayNumber(p.y, p.m, p.d); })();
  // Weekdays strictly after `from`, `count` of them.
  function businessDaysAfter(from, count) {
    var out = [], day = from;
    while (out.length < count) {
      day += 1;
      var wd = weekdayOf(day);
      if (wd !== 0 && wd !== 6) out.push(day);
    }
    return out;
  }
  function addMonths(day, months) {
    var p = ymdOf(day);
    var total = p.m - 1 + months;
    var y = p.y + Math.floor(total / 12), m = total % 12 + 1;
    var last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return dayNumber(y, m, Math.min(p.d, last));
  }
  var VISITOR_ZONE = (function () {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || COMPANY_ZONE; } catch (e) { return COMPANY_ZONE; }
  })();
  // "Tue, Nov 10 · 12:30 PM EST" in a zone.
  function formatIn(date, zone, opts) {
    try {
      return new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: zone }, opts)).format(date);
    } catch (e) {
      return date.toString();
    }
  }
  function timeIn(date, zone) { return formatIn(date, zone, { hour: 'numeric', minute: '2-digit' }); }
  function zoneAbbr(date, zone) {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' }).formatToParts(date);
      for (var i = 0; i < p.length; i++) if (p[i].type === 'timeZoneName') return p[i].value;
    } catch (e) { /* fall through */ }
    return '';
  }
  function zoneName(zone) { return has(D.DISPLAY_ZONES, zone) ? D.DISPLAY_ZONES[zone] + ' time' : zone.replace(/_/g, ' '); }

  /* ------------------------------------------------------------------
   * 4. Theme, menu, header, reveal, year
   * ------------------------------------------------------------------ */
  function initTheme() {
    var root = document.documentElement;
    function sync() {
      var dark = root.classList.contains('dark');
      $$('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', dark ? 'true' : 'false'); });
    }
    $$('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dark = !root.classList.contains('dark');
        root.classList.toggle('dark', dark);
        safeStorage.setItem(KEYS.theme, dark ? 'dark' : 'light');
        sync();
        announce(dark ? 'Dark theme on' : 'Light theme on');
      });
    });
    // When storage is blocked, the head script couldn't read a saved choice: use the in-memory one.
    var saved = safeStorage.getItem(KEYS.theme);
    if (saved === 'dark' || saved === 'light') root.classList.toggle('dark', saved === 'dark');
    sync();
  }

  function initMenu() {
    var btn = $('#menu-toggle'), menu = $('#mobile-menu');
    if (!btn || !menu) return;
    function set(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      $('[data-icon-open]', btn).classList.toggle('hidden', open);
      $('[data-icon-close]', btn).classList.toggle('hidden', !open);
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024) set(false); });
  }

  function initHeader() {
    var header = $('#site-header');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('shadow-[0_8px_24px_-20px_rgb(21_23_30/.5)]', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Reveal this element and everything above it, so fast jumps never leave hidden content behind.
        var top = entry.target.getBoundingClientRect().top;
        items.forEach(function (el) {
          if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top <= top + 1) { el.classList.add('is-visible'); io.unobserve(el); }
        });
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  function initYear() {
    var y = zoneParts(NOW, COMPANY_ZONE).y;
    $$('[data-year]').forEach(function (el) { el.textContent = String(y); });
  }

  /* ------------------------------------------------------------------
   * 5. Hero pipeline board
   * ------------------------------------------------------------------ */
  var STAGE_IDS = D.STAGES.map(function (s) { return s.id; });
  var STAGE_BY_ID = {};
  D.STAGES.forEach(function (s) { STAGE_BY_ID[s.id] = s; });
  var CAND_BY_ID = {};
  D.CANDIDATES.forEach(function (c) { CAND_BY_ID[c.id] = c; });

  function initialPipeline() {
    var stages = {};
    D.CANDIDATES.forEach(function (c) { stages[c.id] = c.stage; });
    return { stages: stages, order: D.CANDIDATES.map(function (c) { return c.id; }) };
  }
  function loadPipeline() {
    var state = initialPipeline();
    var saved = readJSON(KEYS.pipeline);
    if (!saved || saved.v !== 1 || !saved.stages || typeof saved.stages !== 'object') return state;
    Object.keys(saved.stages).forEach(function (id) {
      if (has(CAND_BY_ID, id) && has(STAGE_BY_ID, saved.stages[id])) state.stages[id] = saved.stages[id];
    });
    if (Array.isArray(saved.order)) {
      var seen = {}, order = [];
      saved.order.forEach(function (id) { if (has(CAND_BY_ID, id) && !has(seen, id)) { seen[id] = true; order.push(id); } });
      state.order.forEach(function (id) { if (!has(seen, id)) order.push(id); });
      state.order = order;
    }
    return state;
  }

  // Totals per stage (hidden candidates plus cards), the funnel and the projected time to hire.
  function pipelineStats(state) {
    var counts = {};
    STAGE_IDS.forEach(function (s) { counts[s] = has(D.STAGE_BASE, s) ? D.STAGE_BASE[s] : 0; });
    Object.keys(state.stages).forEach(function (id) { counts[state.stages[id]] += 1; });
    // Reached: candidates in this stage or any later one.
    var reached = {}, running = 0;
    for (var i = STAGE_IDS.length - 1; i >= 0; i--) { running += counts[STAGE_IDS[i]]; reached[STAGE_IDS[i]] = running; }
    var total = reached[STAGE_IDS[0]];
    var sum = 0, n = 0;
    Object.keys(state.stages).forEach(function (id) {
      var st = state.stages[id];
      if (has(D.STAGE_REMAINING, st)) { sum += CAND_BY_ID[id].age + D.STAGE_REMAINING[st]; n += 1; }
    });
    return { counts: counts, reached: reached, total: total, tth: n ? Math.round(sum / n) : null };
  }

  function initPipeline() {
    var root = $('[data-pipeline]');
    if (!root) return;
    var state = loadPipeline();
    var openMenu = null;
    var drag = null;

    function save() {
      writeJSON(KEYS.pipeline, { v: 1, stages: state.stages, order: state.order });
    }

    function cardHtml(c, stage) {
      var score = c.score && (stage === 'interview' || stage === 'offer' || stage === 'hired')
        ? '<span class="chip tone-interview" title="Weighted scorecard average">' + c.score.toFixed(1) + '</span>' : '';
      return '<li class="cand" data-cand="' + c.id + '">' +
        '<span class="flex items-center gap-2">' +
          '<span class="grid size-7 shrink-0 touch-none place-items-center rounded-full text-[11px] font-bold" style="background:hsl(' + c.hue + ' 60% 88%);color:hsl(' + c.hue + ' 50% 24%)" data-grip aria-hidden="true">' + initials(c.name) + '</span>' +
          '<span class="min-w-0 flex-1 truncate text-sm font-semibold text-ink">' + escapeHtml(c.name) + '</span>' +
          '<button type="button" class="-mr-1 grid size-7 shrink-0 place-items-center rounded text-ink-faint hover:bg-canvas hover:text-ink" data-move="' + c.id + '" aria-haspopup="menu" aria-expanded="false" aria-label="Move ' + escapeHtml(c.name) + ', now in ' + STAGE_BY_ID[stage].name + '">' +
            '<svg viewBox="0 0 20 20" class="size-4" fill="currentColor" aria-hidden="true"><circle cx="4.5" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="15.5" cy="10" r="1.6"/></svg></button>' +
        '</span>' +
        '<span class="mt-1.5 flex items-center gap-1.5 text-xs whitespace-nowrap text-ink-faint"><span class="min-w-0 truncate">' + escapeHtml(c.source) + '</span><span aria-hidden="true">·</span><span>' + c.age + 'd<span class="sr-only"> since applying</span></span>' +
          (score ? '<span class="ml-auto">' + score + '</span>' : '') + '</span></li>';
    }

    function render(focusId, newId) {
      closeMenu(false);
      STAGE_IDS.forEach(function (stage) {
        var list = $('[data-col-list="' + stage + '"]', root);
        if (!list) return;
        list.innerHTML = state.order.filter(function (id) { return state.stages[id] === stage; })
          .map(function (id) { return cardHtml(CAND_BY_ID[id], stage); }).join('');
      });
      var stats = pipelineStats(state);
      STAGE_IDS.forEach(function (stage) {
        $$('[data-count="' + stage + '"]', root).forEach(function (el) { el.textContent = String(stats.counts[stage]); });
      });
      // Time to hire
      var tth = $('[data-tth]', root), note = $('[data-tth-note]', root);
      if (tth) tth.textContent = stats.tth === null ? '—' : String(stats.tth);
      if (note) {
        var target = D.TIME_TO_HIRE_TARGET;
        if (stats.tth === null) note.textContent = 'Move a candidate to Offer to project it';
        else if (stats.tth < target) note.textContent = plural(target - stats.tth, 'day') + ' under the ' + target + '-day target';
        else if (stats.tth === target) note.textContent = 'Right on the ' + target + '-day target';
        else note.textContent = plural(stats.tth - target, 'day') + ' over the ' + target + '-day target';
        note.classList.toggle('text-hired', stats.tth !== null && stats.tth <= target);
        note.classList.toggle('text-danger', stats.tth !== null && stats.tth > target);
      }
      // Openings
      var hired = stats.counts.hired, openings = D.REQ.openings;
      var filled = $('[data-filled]', root);
      if (filled) {
        filled.textContent = hired > openings ? hired + ' hired for ' + plural(openings, 'opening')
          : hired + ' of ' + plural(openings, 'opening') + ' filled';
      }
      var filledBar = $('[data-filled-bar]', root);
      if (filledBar) filledBar.style.width = Math.min(100, Math.round(hired / openings * 100)) + '%';
      // Funnel
      STAGE_IDS.forEach(function (stage) {
        var row = $('[data-funnel="' + stage + '"]', root);
        if (!row) return;
        var pct = stats.total ? stats.reached[stage] / stats.total * 100 : 0;
        $('[data-funnel-bar]', row).style.width = Math.max(2, pct) + '%';
        $('[data-funnel-n]', row).textContent = String(stats.reached[stage]);
      });
      var conv = $('[data-conversion]', root);
      if (conv) conv.textContent = (stats.total ? (Math.round(stats.reached.hired / stats.total * 1000) / 10).toFixed(1) : '0.0') + '%';
      if (newId) {
        var fresh = $('[data-cand="' + newId + '"]', root);
        if (fresh && !reduceMotion) fresh.classList.add('is-new');
      }
      if (focusId) {
        var b = $('[data-move="' + focusId + '"]', root);
        if (b) b.focus();
      }
      return stats;
    }

    function move(id, stage, viaKeyboard) {
      if (!has(CAND_BY_ID, id) || !has(STAGE_BY_ID, stage) || state.stages[id] === stage) return;
      state.stages[id] = stage;
      state.order = [id].concat(state.order.filter(function (x) { return x !== id; }));
      save();
      var stats = render(viaKeyboard ? id : null, id);
      announce(CAND_BY_ID[id].name + ' moved to ' + STAGE_BY_ID[stage].name + '. ' + STAGE_BY_ID[stage].name + ' now has ' +
        plural(stats.counts[stage], 'candidate') + '. Projected time to hire ' + (stats.tth === null ? 'not available' : plural(stats.tth, 'day')) + '.');
    }

    // Keyboard alternative: a menu of stages on each card's Move button.
    function closeMenu(restoreFocus) {
      if (!openMenu) return;
      var btn = openMenu.button;
      openMenu.el.remove();
      btn.setAttribute('aria-expanded', 'false');
      openMenu = null;
      if (restoreFocus) btn.focus();
    }
    function openMoveMenu(btn) {
      var id = btn.getAttribute('data-move');
      var c = CAND_BY_ID[id];
      closeMenu(false);
      var menu = document.createElement('div');
      menu.className = 'move-menu';
      menu.setAttribute('role', 'menu');
      menu.setAttribute('aria-label', 'Move ' + c.name + ' to');
      menu.innerHTML = D.STAGES.map(function (s) {
        var current = state.stages[id] === s.id;
        return '<button type="button" role="menuitem" tabindex="-1" data-to="' + s.id + '"' + (current ? ' aria-disabled="true"' : '') + '>' +
          '<span class="size-2 rounded-full dot-' + s.tone + '" aria-hidden="true"></span>' + s.name + (current ? ' <span class="ml-auto text-xs">Current</span>' : '') + '</button>';
      }).join('');
      btn.parentNode.appendChild(menu);
      btn.setAttribute('aria-expanded', 'true');
      openMenu = { el: menu, button: btn, id: id };
      var items = $$('[role="menuitem"]', menu);
      var first = items.filter(function (b) { return !b.hasAttribute('aria-disabled'); })[0] || items[0];
      first.focus();
      menu.addEventListener('keydown', function (e) {
        var i = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
        else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
        else if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
        else if (e.key === 'Tab') { closeMenu(false); }
      });
      menu.addEventListener('click', function (e) {
        var item = e.target.closest('[data-to]');
        if (!item) return;
        if (item.hasAttribute('aria-disabled')) { closeMenu(true); return; }
        move(id, item.getAttribute('data-to'), true);
      });
    }
    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-move]');
      if (btn) {
        if (openMenu && openMenu.button === btn) closeMenu(true);
        else openMoveMenu(btn);
      }
    });
    document.addEventListener('click', function (e) {
      if (openMenu && !openMenu.el.contains(e.target) && e.target !== openMenu.button && !openMenu.button.contains(e.target)) closeMenu(false);
    });

    // Drag and drop with pointer events: mouse and pen from anywhere on a card, touch from the avatar (data-grip).
    var scroller = $('[data-board-scroll]', root);
    function columnAt(x, y) {
      var el = document.elementFromPoint(x, y);
      return el ? el.closest('[data-col]') : null;
    }
    function endDrag(commit) {
      if (!drag) return;
      if (drag.ghost) drag.ghost.remove();
      if (drag.card) drag.card.classList.remove('is-dragging');
      if (drag.target) drag.target.classList.remove('is-target');
      if (drag.raf) cancelAnimationFrame(drag.raf);
      var d = drag;
      drag = null;
      if (commit && d.started && d.target) move(d.id, d.target.getAttribute('data-col'), false);
    }
    root.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var card = e.target.closest('.cand');
      if (!card || e.target.closest('[data-move]') || e.target.closest('.move-menu')) return;
      if (e.pointerType === 'touch' && !e.target.closest('[data-grip]')) return;
      closeMenu(false);
      drag = { id: card.getAttribute('data-cand'), card: card, x: e.clientX, y: e.clientY, started: false, target: null, ghost: null, pointerId: e.pointerId };
      try { card.setPointerCapture(e.pointerId); } catch (err) { /* older browsers */ }
    });
    root.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pointerId) return;
      if (!drag.started) {
        if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 6) return;
        drag.started = true;
        var rect = drag.card.getBoundingClientRect();
        drag.dx = e.clientX - rect.left;
        drag.dy = e.clientY - rect.top;
        var ghost = drag.card.cloneNode(true);
        ghost.classList.add('cand-ghost');
        ghost.removeAttribute('data-cand');
        $$('[data-move]', ghost).forEach(function (b) { b.removeAttribute('data-move'); b.setAttribute('tabindex', '-1'); });
        ghost.setAttribute('aria-hidden', 'true');
        ghost.style.width = rect.width + 'px';
        document.body.appendChild(ghost);
        drag.ghost = ghost;
        drag.card.classList.add('is-dragging');
      }
      e.preventDefault();
      drag.ghost.style.left = (e.clientX - drag.dx) + 'px';
      drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
      var col = columnAt(e.clientX, e.clientY);
      if (col !== drag.target) {
        if (drag.target) drag.target.classList.remove('is-target');
        drag.target = col;
        if (col) col.classList.add('is-target');
      }
      // Scroll the board sideways near its edges (narrow screens).
      if (scroller && scroller.scrollWidth > scroller.clientWidth) {
        var sr = scroller.getBoundingClientRect();
        var speed = e.clientX < sr.left + 40 ? -10 : e.clientX > sr.right - 40 ? 10 : 0;
        if (drag.raf) cancelAnimationFrame(drag.raf);
        if (speed) {
          var step = function () { if (!drag) return; scroller.scrollLeft += speed; drag.raf = requestAnimationFrame(step); };
          drag.raf = requestAnimationFrame(step);
        }
      }
    });
    root.addEventListener('pointerup', function (e) { if (drag && e.pointerId === drag.pointerId) endDrag(true); });
    root.addEventListener('pointercancel', function () { endDrag(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drag) endDrag(false); });

    var reset = $('[data-pipeline-reset]', root);
    if (reset) reset.addEventListener('click', function () {
      state = initialPipeline();
      writeJSON(KEYS.pipeline, null);
      render();
      announce('Board reset to the starting pipeline.');
    });

    render();
  }

  /* ------------------------------------------------------------------
   * 6. Structured interview scorecard
   * ------------------------------------------------------------------ */
  function weightedScore(ratings) {
    var total = 0;
    D.COMPETENCIES.forEach(function (c) { total += c.weight * ratings[c.id]; });
    return total / 100;
  }
  function recommendationFor(score) {
    for (var i = 0; i < D.RECOMMENDATIONS.length; i++) if (score >= D.RECOMMENDATIONS[i].min) return D.RECOMMENDATIONS[i];
    return D.RECOMMENDATIONS[D.RECOMMENDATIONS.length - 1];
  }

  function initScorecards() {
    $$('[data-scorecard]').forEach(function (root, n) {
      var ratings = {};
      D.COMPETENCIES.forEach(function (c) { ratings[c.id] = c.rating; });
      var list = $('[data-sc-list]', root);
      var compact = root.hasAttribute('data-compact');
      list.innerHTML = D.COMPETENCIES.map(function (c) {
        var labelId = 'sc' + n + '-' + c.id;
        var buttons = [1, 2, 3, 4].map(function (r) {
          return '<button type="button" class="rate" role="radio" data-rate="' + r + '" aria-checked="false" aria-label="' + r + ', ' + D.RATING_LABELS[r] + '">' + r + '</button>';
        }).join('');
        return '<li class="grid gap-2 border-b border-line py-3 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center" data-comp="' + c.id + '">' +
          '<div class="min-w-0"><p class="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-ink"><span id="' + labelId + '">' + escapeHtml(c.name) + '</span>' +
          '<span class="text-xs font-medium text-ink-faint">' + c.weight + '% weight</span></p>' +
          (compact ? '' : '<p class="mt-0.5 text-sm text-ink-faint">“' + escapeHtml(c.prompt) + '”</p>') + '</div>' +
          '<div class="flex items-center gap-1.5" role="radiogroup" aria-labelledby="' + labelId + '">' + buttons + '</div></li>';
      }).join('');

      function update() {
        D.COMPETENCIES.forEach(function (c) {
          var row = $('[data-comp="' + c.id + '"]', list);
          $$('[data-rate]', row).forEach(function (b) {
            var on = +b.getAttribute('data-rate') === ratings[c.id];
            b.setAttribute('aria-checked', on ? 'true' : 'false');
            b.tabIndex = on ? 0 : -1;
          });
        });
        var score = weightedScore(ratings);
        var rec = recommendationFor(score);
        $('[data-sc-score]', root).textContent = score.toFixed(2);
        var recEl = $('[data-sc-rec]', root);
        recEl.textContent = rec.label;
        recEl.className = 'chip text-sm tone-' + rec.tone;
        var bar = $('[data-sc-bar]', root);
        if (bar) bar.style.width = ((score - 1) / 3 * 100) + '%';
        return rec;
      }
      list.addEventListener('click', function (e) {
        var b = e.target.closest('[data-rate]');
        if (!b) return;
        var id = b.closest('[data-comp]').getAttribute('data-comp');
        ratings[id] = +b.getAttribute('data-rate');
        var rec = update();
        announce('Weighted score ' + weightedScore(ratings).toFixed(2) + ': ' + rec.label + '.');
      });
      // Radio-group arrow keys.
      list.addEventListener('keydown', function (e) {
        var b = e.target.closest('[data-rate]');
        if (!b) return;
        var delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!delta) return;
        e.preventDefault();
        var id = b.closest('[data-comp]').getAttribute('data-comp');
        ratings[id] = clamp(ratings[id] + delta, 1, 4);
        var rec = update();
        $('[data-comp="' + id + '"] [data-rate="' + ratings[id] + '"]', list).focus();
        announce('Weighted score ' + weightedScore(ratings).toFixed(2) + ': ' + rec.label + '.');
      });
      var resetBtn = $('[data-sc-reset]', root);
      if (resetBtn) resetBtn.addEventListener('click', function () {
        D.COMPETENCIES.forEach(function (c) { ratings[c.id] = c.rating; });
        update();
        announce('Scorecard reset.');
      });
      update();
    });
  }

  /* ------------------------------------------------------------------
   * 7. Job boards and posting preview
   * ------------------------------------------------------------------ */
  function initBoards() {
    var root = $('[data-boards]');
    if (!root) return;
    var list = $('[data-board-list]', root);
    list.innerHTML = D.BOARDS.map(function (b) {
      return '<li><label class="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line bg-paper px-3 py-2 has-[:checked]:border-brand has-[:checked]:bg-brand-soft' + (b.locked ? ' cursor-default' : '') + '">' +
        '<input type="checkbox" class="size-4 accent-[var(--brand)]" name="board" value="' + b.id + '"' + (b.on ? ' checked' : '') + (b.locked ? ' disabled' : '') + ' />' +
        '<span class="min-w-0 flex-1"><span class="block text-sm font-semibold text-ink">' + escapeHtml(b.name) + '</span><span class="block text-xs text-ink-faint">' + escapeHtml(b.note) + ' · about ' + b.applicants + ' applicants</span></span>' +
        '<span class="text-sm font-semibold ' + (b.price ? 'text-ink' : 'text-hired') + '">' + (b.price ? money(b.price) : 'Free') + '</span></label></li>';
    }).join('');

    var form = $('[data-posting-form]', root);
    function selected() {
      return D.BOARDS.filter(function (b) { var i = $('input[value="' + b.id + '"]', list); return i && i.checked; });
    }
    function update() {
      var chosen = selected();
      var cost = chosen.reduce(function (s, b) { return s + b.price; }, 0);
      var reach = chosen.reduce(function (s, b) { return s + b.applicants; }, 0);
      $('[data-board-count]', root).textContent = plural(chosen.length, 'board');
      $('[data-board-cost]', root).textContent = money(cost);
      $('[data-board-reach]', root).textContent = String(reach);
      // Preview
      var title = form.elements.title.value.trim() || 'Untitled role';
      var loc = form.elements.location.value;
      var min = parseInt(form.elements.paymin.value, 10), max = parseInt(form.elements.paymax.value, 10);
      $('[data-pv-title]', root).textContent = title;
      $('[data-pv-location]', root).textContent = has(D.POSTING_LOCATIONS, loc) ? D.POSTING_LOCATIONS[loc] : '';
      var payEl = $('[data-pv-pay]', root), err = $('[data-pay-error]', root);
      var payOk = !isNaN(min) && !isNaN(max) && min > 0 && max >= min;
      payEl.textContent = payOk ? money(min) + ' – ' + money(max) + ' a year' : 'Add a pay range';
      err.hidden = payOk || (isNaN(min) && isNaN(max));
      form.elements.paymax.setAttribute('aria-invalid', payOk || err.hidden ? 'false' : 'true');
      $('[data-pv-boards]', root).textContent = chosen.map(function (b) { return b.name; }).join(', ');
    }
    list.addEventListener('change', update);
    form.addEventListener('input', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    update();
  }

  /* ------------------------------------------------------------------
   * 8. Interview scheduling
   * ------------------------------------------------------------------ */
  // Free windows (in ms since epoch) for one interviewer on one business day.
  function freeWindows(person, dayIndex, day) {
    var p = ymdOf(day);
    var start = zonedToDate(p.y, p.m, p.d, Math.floor(hm(D.WORK_HOURS[0]) / 60), hm(D.WORK_HOURS[0]) % 60, person.zone).getTime();
    var end = zonedToDate(p.y, p.m, p.d, Math.floor(hm(D.WORK_HOURS[1]) / 60), hm(D.WORK_HOURS[1]) % 60, person.zone).getTime();
    var windows = [[start, end]];
    person.busy.forEach(function (b) {
      if (b[0] !== dayIndex) return;
      var bs = zonedToDate(p.y, p.m, p.d, Math.floor(hm(b[1]) / 60), hm(b[1]) % 60, person.zone).getTime();
      var be = zonedToDate(p.y, p.m, p.d, Math.floor(hm(b[2]) / 60), hm(b[2]) % 60, person.zone).getTime();
      var next = [];
      windows.forEach(function (w) {
        if (be <= w[0] || bs >= w[1]) { next.push(w); return; }
        if (bs > w[0]) next.push([w[0], bs]);
        if (be < w[1]) next.push([be, w[1]]);
      });
      windows = next;
    });
    return windows;
  }
  function intersect(a, b) {
    var out = [];
    a.forEach(function (x) {
      b.forEach(function (y) {
        var s = Math.max(x[0], y[0]), e = Math.min(x[1], y[1]);
        if (e > s) out.push([s, e]);
      });
    });
    return out.sort(function (p, q) { return p[0] - q[0]; });
  }
  // Up to `count` non-overlapping slots, at most two per day, where every chosen interviewer is free.
  function proposeSlots(people, minutes, count) {
    var days = businessDaysAfter(TODAY, D.SCHEDULE_DAYS);
    var step = D.SCHEDULE_STEP * 60000, len = minutes * 60000, out = [];
    for (var i = 0; i < days.length && out.length < count; i++) {
      var windows = null;
      people.forEach(function (person) {
        var w = freeWindows(person, i, days[i]);
        windows = windows === null ? w : intersect(windows, w);
      });
      var perDay = 0, after = 0;
      (windows || []).forEach(function (w) {
        var t = Math.ceil(Math.max(w[0], after) / step) * step;
        while (t + len <= w[1] && perDay < 2 && out.length < count) {
          out.push({ start: new Date(t), end: new Date(t + len), day: days[i] });
          perDay += 1;
          after = t + len;
          t = Math.ceil(after / step) * step;
        }
      });
    }
    return out;
  }

  function initScheduler() {
    var root = $('[data-scheduler]');
    if (!root) return;
    var people = $('[data-sched-people]', root);
    people.innerHTML = D.INTERVIEWERS.map(function (p) {
      return '<li><label class="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line bg-paper px-3 py-2 has-[:checked]:border-brand has-[:checked]:bg-brand-soft">' +
        '<input type="checkbox" class="size-4 accent-[var(--brand)]" name="interviewer" value="' + p.id + '"' + (p.on ? ' checked' : '') + ' />' +
        '<span class="min-w-0 flex-1"><span class="block text-sm font-semibold text-ink">' + escapeHtml(p.name) + '</span>' +
        '<span class="block text-xs text-ink-faint">' + escapeHtml(p.role) + ' · ' + escapeHtml(p.city) + ' · ' + zoneName(p.zone) + '</span></span></label></li>';
    }).join('');
    var zoneSel = $('[data-sched-zone]', root);
    var zones = Object.keys(D.DISPLAY_ZONES);
    var opts = zones.map(function (z) { return '<option value="' + z + '">' + D.DISPLAY_ZONES[z] + ' time</option>'; });
    if (zones.indexOf(VISITOR_ZONE) === -1) opts.unshift('<option value="' + escapeHtml(VISITOR_ZONE) + '">Your time (' + escapeHtml(VISITOR_ZONE.replace(/_/g, ' ')) + ')</option>');
    zoneSel.innerHTML = opts.join('');
    zoneSel.value = VISITOR_ZONE;
    var lengthSel = $('[data-sched-length]', root);
    var out = $('[data-sched-slots]', root);
    var status = $('[data-sched-status]', root);

    function update() {
      var chosen = D.INTERVIEWERS.filter(function (p) { var i = $('input[value="' + p.id + '"]', people); return i && i.checked; });
      var zone = zoneSel.value;
      var minutes = parseInt(lengthSel.value, 10) || 60;
      if (!chosen.length) {
        out.innerHTML = '';
        status.textContent = 'Pick at least one interviewer.';
        return;
      }
      var slots = proposeSlots(chosen, minutes, D.SCHEDULE_PROPOSALS);
      status.textContent = slots.length
        ? plural(slots.length, 'slot') + ' where all ' + plural(chosen.length, 'interviewer') + ' are free, shown in ' + zoneName(zone) + '.'
        : 'No shared time in the next ' + D.SCHEDULE_DAYS + ' business days. Try a shorter interview or a smaller panel.';
      out.innerHTML = slots.map(function (s, i) {
        var local = chosen.map(function (p) {
          return '<li class="flex justify-between gap-3"><span>' + escapeHtml(p.name.split(' ')[0]) + '</span><span class="text-ink-soft">' + timeIn(s.start, p.zone) + ' ' + zoneAbbr(s.start, p.zone) + '</span></li>';
        }).join('');
        return '<li class="rounded-md border border-line bg-paper p-4' + (i === 0 ? ' ring-2 ring-brand' : '') + '">' +
          '<p class="text-xs font-semibold tracking-wide text-brand uppercase">' + (i === 0 ? 'Earliest' : 'Option ' + (i + 1)) + '</p>' +
          '<p class="mt-1 font-display text-lg font-bold" data-slot-time>' + formatIn(s.start, zone, { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' +
            timeIn(s.start, zone) + '–' + timeIn(s.end, zone) + ' ' + zoneAbbr(s.start, zone) + '</p>' +
          '<ul class="mt-3 grid gap-1 text-sm">' + local + '</ul></li>';
      }).join('');
    }
    root.addEventListener('change', update);
    update();
  }

  /* ------------------------------------------------------------------
   * 9. Offer pay band check
   * ------------------------------------------------------------------ */
  function initOffer() {
    var root = $('[data-offer]');
    if (!root) return;
    var band = D.OFFER_BAND;
    var input = $('[data-offer-amount]', root);
    input.min = band.sliderMin; input.max = band.sliderMax; input.step = band.step; input.value = band.start;
    $('[data-offer-band]', root).textContent = money(band.min) + ' – ' + money(band.max);
    function update() {
      var v = parseInt(input.value, 10);
      var rule = band.rules.filter(function (r) { return r.test === 'below' ? v < band.min : r.test === 'above' ? v > band.max : v >= band.min && v <= band.max; })[0];
      $('[data-offer-value]', root).textContent = money(v);
      input.setAttribute('aria-valuetext', money(v) + ' a year, ' + rule.label);
      var st = $('[data-offer-status]', root);
      st.textContent = rule.label;
      st.className = 'chip text-sm tone-' + rule.tone;
      $('[data-offer-chain]', root).innerHTML = rule.approvers.map(function (a, i) {
        return '<li class="flex items-center gap-3"><span class="grid size-7 place-items-center rounded-full bg-canvas text-xs font-bold text-ink-soft">' + (i + 1) + '</span>' +
          '<span class="text-sm"><span class="font-semibold text-ink">' + escapeHtml(a.who) + '</span> <span class="text-ink-faint">· ' + escapeHtml(a.when) + '</span></span></li>';
      }).join('');
      var pos = (v - band.sliderMin) / (band.sliderMax - band.sliderMin) * 100;
      $('[data-offer-marker]', root).style.left = pos + '%';
    }
    var bandEl = $('[data-offer-band-fill]', root);
    bandEl.style.left = ((band.min - band.sliderMin) / (band.sliderMax - band.sliderMin) * 100) + '%';
    bandEl.style.width = ((band.max - band.min) / (band.sliderMax - band.sliderMin) * 100) + '%';
    input.addEventListener('input', update);
    update();
  }

  /* ------------------------------------------------------------------
   * 10. Pricing
   * ------------------------------------------------------------------ */
  function perEmployee(planId, billing) {
    var base = D.PLANS[planId].perEmployee;
    return billing === 'annual' ? Math.round(base * (1 - D.ANNUAL_DISCOUNT) * 100) / 100 : base;
  }
  function estimate(s) {
    var billed = Math.max(s.employees, D.MIN_EMPLOYEES);
    var monthly = Math.round(billed * perEmployee(s.plan, s.billing) * 100) / 100;
    var yearly = monthly * 12;
    var full = billed * perEmployee(s.plan, 'monthly') * 12;
    return { billed: billed, monthly: monthly, yearly: yearly, perHire: yearly / s.hires, saving: full - yearly };
  }

  function loadPricing() {
    var s = Object.assign({}, D.DEFAULT_PRICING);
    var saved = readJSON(KEYS.pricing);
    if (saved) {
      if (saved.billing === 'monthly' || saved.billing === 'annual') s.billing = saved.billing;
      if (typeof saved.plan === 'string' && has(D.PLANS, saved.plan)) s.plan = saved.plan;
      if (typeof saved.employees === 'number' && saved.employees >= 1 && saved.employees <= D.MAX_EMPLOYEES) s.employees = Math.round(saved.employees);
      if (typeof saved.hires === 'number' && saved.hires >= 1 && saved.hires <= 2000) s.hires = Math.round(saved.hires);
    }
    var b = params.get('billing');
    if (b === 'monthly' || b === 'annual') s.billing = b;
    var p = params.get('plan');
    if (p && has(D.PLANS, p)) s.plan = p;
    var e = intParam('employees', 1, D.MAX_EMPLOYEES);
    if (e !== null) s.employees = e;
    var h = intParam('hires', 1, 2000);
    if (h !== null) s.hires = h;
    return s;
  }

  function initPricing() {
    var page = $('[data-pricing]');
    if (!page) return;
    var s = loadPricing();
    var form = $('[data-calc]', page);

    function save() { writeJSON(KEYS.pricing, s); }

    function paint() {
      $$('[data-billing]', page).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-billing') === s.billing ? 'true' : 'false'); });
      Object.keys(D.PLANS).forEach(function (id) {
        $$('[data-plan-price="' + id + '"]', page).forEach(function (el) { el.textContent = price(perEmployee(id, s.billing)); });
        $$('[data-plan-note="' + id + '"]', page).forEach(function (el) {
          el.textContent = s.billing === 'annual'
            ? 'per employee a month, billed yearly (' + price(perEmployee(id, 'monthly')) + ' monthly)'
            : 'per employee a month, billed monthly';
        });
      });
      $$('[data-billing-note]', page).forEach(function (el) {
        el.textContent = s.billing === 'annual' ? 'Yearly billing saves ' + Math.round(D.ANNUAL_DISCOUNT * 100) + '%' : 'Switch to yearly billing to save ' + Math.round(D.ANNUAL_DISCOUNT * 100) + '%';
      });
      if (!form) return;
      var est = estimate(s);
      form.elements.employees.value = String(s.employees);
      form.elements.employeesRange.value = String(Math.max(D.MIN_EMPLOYEES, s.employees));
      form.elements.hires.value = String(s.hires);
      $$('input[name="plan"]', form).forEach(function (r) { r.checked = r.value === s.plan; });
      $('[data-calc-monthly]', page).textContent = money(est.monthly);
      $('[data-calc-yearly]', page).textContent = money(est.yearly);
      $('[data-calc-perhire]', page).textContent = money(est.perHire);
      $('[data-calc-plan]', page).textContent = D.PLANS[s.plan].name + ', ' + (s.billing === 'annual' ? 'billed yearly' : 'billed monthly');
      $('[data-calc-rate]', page).textContent = plural(est.billed, 'employee') + ' × ' + price(perEmployee(s.plan, s.billing)) + ' a month';
      var saving = $('[data-calc-saving]', page);
      saving.textContent = s.billing === 'annual'
        ? 'You save ' + money(est.saving) + ' a year compared with monthly billing.'
        : 'Yearly billing would save ' + money(estimate(Object.assign({}, s, { billing: 'annual' })).saving) + ' a year.';
      var floor = $('[data-calc-floor]', page);
      floor.hidden = s.employees >= D.MIN_EMPLOYEES;
      floor.textContent = 'Plans start at ' + D.MIN_EMPLOYEES + ' employees, so ' + plural(s.employees, 'employee') + ' are billed as ' + D.MIN_EMPLOYEES + '.';
      $('[data-calc-enterprise]', page).hidden = s.employees < D.ENTERPRISE_HINT;
      var link = $('[data-calc-demo]', page);
      link.href = 'demo.html?plan=' + s.plan + '&employees=' + s.employees;
    }

    $$('[data-billing]', page).forEach(function (b) {
      b.addEventListener('click', function () {
        s.billing = b.getAttribute('data-billing');
        save();
        paint();
        setParams({ billing: s.billing === D.DEFAULT_PRICING.billing ? null : s.billing });
        announce(s.billing === 'annual' ? 'Showing yearly billing prices.' : 'Showing monthly billing prices.');
      });
    });
    if (form) {
      var err = $('[data-calc-error]', form);
      form.addEventListener('input', function (e) {
        var t = e.target;
        if (t.name === 'employeesRange') {
          s.employees = parseInt(t.value, 10);
        } else if (t.name === 'employees') {
          var v = parseInt(t.value, 10);
          var ok = /^\d+$/.test(t.value) && v >= 1 && v <= D.MAX_EMPLOYEES;
          t.setAttribute('aria-invalid', ok ? 'false' : 'true');
          err.hidden = ok;
          if (!ok) return;
          s.employees = v;
        } else if (t.name === 'hires') {
          var h = parseInt(t.value, 10);
          if (!(h >= 1 && h <= 2000)) return;
          s.hires = h;
        } else if (t.name === 'plan') {
          if (has(D.PLANS, t.value)) s.plan = t.value;
        } else return;
        save();
        var active = document.activeElement;
        paint();
        if (active && active.name === 'employees') active.focus();
      });
      form.addEventListener('submit', function (e) { e.preventDefault(); });
    }
    paint();
  }

  /* ------------------------------------------------------------------
   * 11. Customer stories
   * ------------------------------------------------------------------ */
  function caseChart(c) {
    // Before and after bars for the first metric, scaled to the larger value.
    var m = c.metrics[0];
    function withUnit(n) { return m.unit ? n + ' ' + m.unit : String(n); }
    var top = Math.max(m.before, m.after) || 1;
    var w1 = Math.max(4, Math.round(m.before / top * 270)), w2 = Math.max(4, Math.round(m.after / top * 270));
    return '<svg viewBox="0 0 380 74" class="h-auto w-full" role="img" aria-label="' + escapeHtml(m.label + ': ' + withUnit(m.before) + ' before, ' + withUnit(m.after) + ' with Slatework') + '">' +
      '<text x="0" y="14" class="fill-ink-faint" font-size="11">Before</text>' +
      '<rect x="56" y="4" width="' + w1 + '" height="14" rx="2" class="fill-canvas-2"/>' +
      '<text x="' + (62 + w1) + '" y="15" class="fill-ink-soft" font-size="11" font-weight="600">' + m.before + '</text>' +
      '<text x="0" y="44" class="fill-ink-faint" font-size="11">After</text>' +
      '<rect x="56" y="34" width="' + w2 + '" height="14" rx="2" fill="' + c.color + '"/>' +
      '<text x="' + (62 + w2) + '" y="45" class="fill-ink" font-size="11" font-weight="700">' + m.after + '</text>' +
      '<text x="0" y="70" class="fill-ink-faint" font-size="10.5">' + escapeHtml(m.label) + (m.unit ? ' (' + escapeHtml(m.unit.replace('/', 'out of ')) + ')' : '') + '</text></svg>';
  }
  function caseCard(c) {
    var metrics = c.metrics.map(function (m) {
      return '<div><dt class="text-xs text-ink-faint">' + escapeHtml(m.label) + '</dt><dd class="mt-0.5 font-display text-xl font-bold">' +
        m.before + '<span class="mx-1 text-ink-faint" aria-label="to">→</span>' + m.after + (m.unit && m.unit !== '%' && m.unit !== '/5' ? ' <span class="text-sm font-semibold text-ink-soft">' + m.unit + '</span>' : m.unit) + '</dd></div>';
    }).join('');
    return '<li class="panel flex flex-col p-6" data-case="' + c.id + '">' +
      '<div class="flex items-center gap-3"><svg viewBox="0 0 40 40" class="size-10 shrink-0" fill="' + c.color + '" style="color:' + c.color + '" aria-hidden="true">' + c.mark + '</svg>' +
      '<div><h3 class="text-lg font-bold">' + escapeHtml(c.company) + '</h3><p class="text-sm text-ink-faint">' + escapeHtml(D.INDUSTRIES[c.industry]) + ' · ' + groupThousands(String(c.employees)) + ' employees · ' + escapeHtml(c.city) + '</p></div></div>' +
      '<p class="mt-5 font-display text-xl leading-snug font-bold">' + escapeHtml(c.headline) + '</p>' +
      '<p class="mt-2 text-ink-soft">' + escapeHtml(c.summary) + '</p>' +
      '<div class="mt-5 rounded-md border border-line bg-canvas p-4">' + caseChart(c) + '</div>' +
      '<dl class="mt-5 grid grid-cols-2 gap-4">' + metrics + '</dl>' +
      '<blockquote class="mt-6 border-l-2 pl-4" style="border-color:' + c.color + '"><p class="text-ink">“' + escapeHtml(c.quote) + '”</p>' +
      '<footer class="mt-2 text-sm text-ink-faint">' + escapeHtml(c.person) + ', ' + escapeHtml(c.role) + '</footer></blockquote></li>';
  }

  function initCustomers() {
    var root = $('[data-cases]');
    if (!root) return;
    var list = $('[data-case-list]', root);
    var sizeSel = $('[data-case-size]', root);
    var count = $('[data-case-count]', root);
    var empty = $('[data-case-empty]', root);
    var industry = params.get('industry');
    if (!industry || !has(D.INDUSTRIES, industry)) industry = 'all';
    var size = params.get('size');
    if (!size || !has(D.SIZES, size)) size = 'all';
    var filters = $('[data-case-filters]', root);
    filters.innerHTML = '<button type="button" class="filter-btn" data-industry="all" aria-pressed="false">All industries</button>' +
      Object.keys(D.INDUSTRIES).map(function (k) { return '<button type="button" class="filter-btn" data-industry="' + k + '" aria-pressed="false">' + D.INDUSTRIES[k] + '</button>'; }).join('');
    sizeSel.innerHTML = '<option value="all">Any company size</option>' + Object.keys(D.SIZES).map(function (k) { return '<option value="' + k + '">' + D.SIZES[k] + '</option>'; }).join('');

    function update(fromUser) {
      $$('[data-industry]', filters).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-industry') === industry ? 'true' : 'false'); });
      sizeSel.value = size;
      var shown = D.CASES.filter(function (c) { return (industry === 'all' || c.industry === industry) && (size === 'all' || c.size === size); });
      list.innerHTML = shown.map(caseCard).join('');
      count.textContent = 'Showing ' + shown.length + ' of ' + plural(D.CASES.length, 'customer story', 'customer stories');
      empty.hidden = shown.length > 0;
      if (fromUser) {
        setParams({ industry: industry === 'all' ? null : industry, size: size === 'all' ? null : size });
        announce(count.textContent);
      }
    }
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('[data-industry]');
      if (!b) return;
      industry = b.getAttribute('data-industry');
      update(true);
    });
    sizeSel.addEventListener('change', function () { size = has(D.SIZES, sizeSel.value) ? sizeSel.value : 'all'; update(true); });
    var clear = $('[data-case-clear]', root);
    if (clear) clear.addEventListener('click', function () { industry = 'all'; size = 'all'; update(true); });
    update(false);
  }

  /* ------------------------------------------------------------------
   * 12. Integrations directory
   * ------------------------------------------------------------------ */
  function intMark(item, size) {
    return '<svg viewBox="0 0 40 40" class="' + size + ' shrink-0" aria-hidden="true"><rect width="40" height="40" rx="9" fill="' + item.bg + '"/>' + item.mark + '</svg>';
  }
  function initIntegrations() {
    var root = $('[data-integrations]');
    if (!root) return;
    var list = $('[data-int-list]', root);
    var search = $('[data-int-search]', root);
    var count = $('[data-int-count]', root);
    var empty = $('[data-int-empty]', root);
    var cats = $('[data-int-cats]', root);
    var dialog = $('[data-int-dialog]');
    var category = params.get('category');
    if (!category || !has(D.INT_CATEGORIES, category)) category = 'all';
    var q = (params.get('q') || '').slice(0, 40);
    search.value = q;

    var counts = {};
    D.INTEGRATIONS.forEach(function (i) { counts[i.category] = (counts[i.category] || 0) + 1; });
    cats.innerHTML = '<button type="button" class="filter-btn" data-cat="all" aria-pressed="false">All <span class="font-normal opacity-80">' + D.INTEGRATIONS.length + '</span></button>' +
      Object.keys(D.INT_CATEGORIES).map(function (k) {
        return '<button type="button" class="filter-btn" data-cat="' + k + '" aria-pressed="false">' + D.INT_CATEGORIES[k] + ' <span class="font-normal opacity-80">' + (counts[k] || 0) + '</span></button>';
      }).join('');

    function matches(item, text) {
      if (!text) return true;
      var hay = (item.name + ' ' + item.blurb + ' ' + D.INT_CATEGORIES[item.category]).toLowerCase();
      return text.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    }
    function update(fromUser) {
      $$('[data-cat]', cats).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === category ? 'true' : 'false'); });
      var text = search.value.trim();
      var shown = D.INTEGRATIONS.filter(function (i) { return (category === 'all' || i.category === category) && matches(i, text); });
      list.innerHTML = shown.map(function (i) {
        return '<li><button type="button" class="panel flex h-full w-full flex-col items-start p-5 text-left transition hover:border-line-strong hover:shadow-[0_12px_28px_-20px_rgb(21_23_30/.45)]" data-int="' + i.id + '" aria-haspopup="dialog">' +
          '<span class="flex w-full items-center gap-3">' + intMark(i, 'size-10') +
          '<span class="min-w-0"><span class="block font-display text-base font-bold text-ink">' + escapeHtml(i.name) + '</span><span class="block text-xs text-ink-faint">' + escapeHtml(D.INT_CATEGORIES[i.category]) + '</span></span></span>' +
          '<span class="mt-3 block text-sm text-ink-soft">' + escapeHtml(i.blurb) + '</span>' +
          '<span class="mt-auto flex w-full items-center justify-between pt-4 text-xs font-semibold text-ink-faint"><span>' + escapeHtml(i.direction) + ' sync</span><span class="text-brand">Details</span></span></button></li>';
      }).join('');
      count.textContent = plural(shown.length, 'integration') + (category === 'all' ? '' : ' in ' + D.INT_CATEGORIES[category]) + (text ? ' matching “' + text + '”' : '');
      empty.hidden = shown.length > 0;
      if (fromUser) {
        setParams({ category: category === 'all' ? null : category, q: text || null });
      }
    }
    cats.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      category = b.getAttribute('data-cat');
      update(true);
      announce(count.textContent);
    });
    var timer;
    search.addEventListener('input', function () {
      clearTimeout(timer);
      update(true);
      timer = setTimeout(function () { announce(count.textContent); }, 600);
    });
    var clear = $('[data-int-clear]', root);
    if (clear) clear.addEventListener('click', function () { category = 'all'; search.value = ''; update(true); search.focus(); });

    // Detail dialog
    var opener = null;
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-int]');
      if (!b || !dialog) return;
      var item = D.INTEGRATIONS.filter(function (i) { return i.id === b.getAttribute('data-int'); })[0];
      if (!item) return;
      opener = b;
      $('[data-dlg-mark]', dialog).innerHTML = intMark(item, 'size-12');
      $('[data-dlg-title]', dialog).textContent = item.name;
      $('[data-dlg-cat]', dialog).textContent = D.INT_CATEGORIES[item.category];
      $('[data-dlg-blurb]', dialog).textContent = item.blurb;
      $('[data-dlg-setup]', dialog).textContent = item.setup;
      $('[data-dlg-direction]', dialog).textContent = item.direction;
      $('[data-dlg-syncs]', dialog).innerHTML = item.syncs.map(function (s) {
        return '<li class="flex gap-2"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 text-hired" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>' + escapeHtml(s) + '</li>';
      }).join('');
      if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    });
    if (dialog) {
      $$('[data-dlg-close]', dialog).forEach(function (b) { b.addEventListener('click', function () { dialog.close(); }); });
      dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('close', function () { if (opener) opener.focus(); });
    }
    update(false);
  }

  /* ------------------------------------------------------------------
   * 13. Data retention example
   * ------------------------------------------------------------------ */
  function initRetention() {
    var root = $('[data-retention]');
    if (!root) return;
    function update() {
      var checked = $('input[name="retention"]:checked', root);
      var key = checked && has(D.RETENTION, checked.value) ? checked.value : D.DEFAULT_RETENTION;
      var r = D.RETENTION[key];
      var end = addMonths(TODAY, r.months);
      $('[data-ret-today]', root).textContent = longDate(TODAY);
      $('[data-ret-date]', root).textContent = longDate(end);
      $('[data-ret-months]', root).textContent = plural(r.months, 'month');
      $('[data-ret-note]', root).textContent = r.note;
      var warn = addMonths(end, -1);
      $('[data-ret-warn]', root).textContent = shortDate(warn);
    }
    root.addEventListener('change', update);
    var def = $('input[name="retention"][value="' + D.DEFAULT_RETENTION + '"]', root);
    if (def) def.checked = true;
    update();
  }

  /* ------------------------------------------------------------------
   * 14. Resources: webinars, article filter, registration
   * ------------------------------------------------------------------ */
  // The second Thursday of a month, as a day number.
  function secondThursday(y, m) {
    var first = dayNumber(y, m, 1);
    var offset = (4 - weekdayOf(first) + 7) % 7;
    return first + offset + 7;
  }
  function upcomingWebinars() {
    var t = hm(D.WEBINAR_TIME);
    var days = [];
    if (Array.isArray(D.WEBINAR_DATES)) {
      D.WEBINAR_DATES.forEach(function (iso) {
        var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso);
        if (m) days.push(dayNumber(+m[1], +m[2], +m[3]));
      });
    } else {
      var p = ymdOf(TODAY), y = p.y, mo = p.m;
      while (days.length < D.WEBINAR_COUNT) {
        var day = secondThursday(y, mo);
        if (day - TODAY >= D.WEBINAR_MIN_DAYS) days.push(day);
        mo += 1;
        if (mo > 12) { mo = 1; y += 1; }
      }
    }
    return days.slice(0, D.WEBINAR_COUNT).map(function (day) {
      var p = ymdOf(day);
      var topic = D.WEBINAR_TOPICS[(p.m - 1) % D.WEBINAR_TOPICS.length];
      return { day: day, start: zonedToDate(p.y, p.m, p.d, Math.floor(t / 60), t % 60, COMPANY_ZONE), title: topic.title, host: topic.host };
    });
  }

  function initResources() {
    var web = $('[data-webinars]');
    var sessions = upcomingWebinars();
    if (web) {
      web.innerHTML = sessions.map(function (s, i) {
        var p = ymdOf(s.day);
        return '<li class="panel flex gap-4 p-5">' +
          '<div class="grid w-16 shrink-0 place-items-center rounded-md border border-line bg-canvas py-2 text-center"><span class="text-xs font-semibold tracking-wide text-brand uppercase">' + MONTHS[p.m - 1].slice(0, 3) + '</span><span class="font-display text-2xl font-bold">' + p.d + '</span></div>' +
          '<div class="min-w-0"><h3 class="font-display text-lg leading-snug font-bold" data-webinar-title>' + escapeHtml(s.title) + '</h3>' +
          '<p class="mt-1 text-sm text-ink-soft" data-webinar-when>' + WEEKDAYS[weekdayOf(s.day)] + ', ' + MONTHS[p.m - 1] + ' ' + p.d + ' · ' + timeIn(s.start, COMPANY_ZONE) + ' ' + zoneAbbr(s.start, COMPANY_ZONE) +
          (VISITOR_ZONE !== COMPANY_ZONE ? ' (' + timeIn(s.start, VISITOR_ZONE) + ' ' + zoneAbbr(s.start, VISITOR_ZONE) + ' for you)' : '') + '</p>' +
          '<p class="mt-1 text-sm text-ink-faint">With ' + escapeHtml(s.host) + (i === 0 ? ' · Next session' : '') + '</p></div></li>';
      }).join('');
    }
    var sel = $('[data-webinar-select]');
    if (sel) sel.innerHTML = sessions.map(function (s, i) { return '<option value="' + i + '">' + shortDate(s.day) + ': ' + escapeHtml(s.title) + '</option>'; }).join('');

    var posts = $('[data-posts]');
    if (posts) {
      var list = $('[data-post-list]', posts);
      var filters = $('[data-post-filters]', posts);
      var topic = params.get('topic');
      if (!topic || !has(D.TOPICS, topic)) topic = 'all';
      filters.innerHTML = '<button type="button" class="filter-btn" data-topic="all" aria-pressed="false">All topics</button>' +
        Object.keys(D.TOPICS).map(function (k) { return '<button type="button" class="filter-btn" data-topic="' + k + '" aria-pressed="false">' + D.TOPICS[k] + '</button>'; }).join('');
      var render = function (fromUser) {
        $$('[data-topic]', filters).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-topic') === topic ? 'true' : 'false'); });
        var shown = D.POSTS.filter(function (p) { return topic === 'all' || p.topic === topic; });
        list.innerHTML = shown.map(function (p) {
          var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(p.date);
          var day = dayNumber(+m[1], +m[2], +m[3]);
          return '<li class="panel p-6" id="' + p.id + '"><article>' +
            '<p class="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-faint"><span class="font-semibold text-brand">' + D.TOPICS[p.topic] + '</span><time datetime="' + p.date + '">' + shortDate(day) + '</time><span>' + p.minutes + ' min read</span></p>' +
            '<h3 class="mt-2 font-display text-xl leading-snug font-bold">' + escapeHtml(p.title) + '</h3>' +
            '<p class="mt-2 text-ink-soft">' + escapeHtml(p.excerpt) + '</p>' +
            '<details class="group mt-4"><summary class="inline-flex min-h-10 items-center gap-1.5 rounded font-semibold text-brand">Read the article<svg viewBox="0 0 20 20" class="size-4 transition group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg></summary>' +
            '<div class="mt-3 grid gap-3 text-ink-soft">' + p.body.map(function (para) { return '<p>' + escapeHtml(para) + '</p>'; }).join('') + '</div></details>' +
            '<p class="mt-4 text-sm text-ink-faint">By <span class="font-semibold text-ink">' + escapeHtml(p.author) + '</span>, ' + escapeHtml(p.role) + '</p></article></li>';
        }).join('');
        $('[data-post-count]', posts).textContent = plural(shown.length, 'article');
        if (fromUser) { setParams({ topic: topic === 'all' ? null : topic }); announce(plural(shown.length, 'article') + ' shown.'); }
      };
      filters.addEventListener('click', function (e) {
        var b = e.target.closest('[data-topic]');
        if (!b) return;
        topic = b.getAttribute('data-topic');
        render(true);
      });
      render(false);
    }

    var form = $('[data-webinar-form]');
    if (form) {
      setupForm(form, function (data) {
        var s = sessions[+data.get('session')] || sessions[0];
        var done = $('[data-webinar-done]');
        $('[data-wd-name]', done).textContent = String(data.get('name')).trim().split(/\s+/)[0];
        $('[data-wd-title]', done).textContent = s.title;
        $('[data-wd-when]', done).textContent = longDate(s.day) + ' at ' + timeIn(s.start, VISITOR_ZONE) + ' ' + zoneAbbr(s.start, VISITOR_ZONE);
        $('[data-wd-ref]', done).textContent = refCode('WB', 5);
        return done;
      });
    }
  }

  /* ------------------------------------------------------------------
   * Form helper: inline validation, then a success panel.
   * To connect a real endpoint (Formspree, your CRM, a serverless function), replace the call to
   * `onSuccess` below with a fetch, and show the success panel only when it answers OK:
   *
   *   fetch('https://formspree.io/f/your-id', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
   *     .then(function (r) { if (r.ok) showDone(); else showError(); });
   * ------------------------------------------------------------------ */
  var MESSAGES = {
    valueMissing: 'This field is required.',
    typeMismatch: 'Enter a valid email address, like name@company.example.',
    tooShort: 'This is a little short.',
    patternMismatch: 'Check the format of this field.'
  };
  function fieldError(field) {
    if (field.type === 'checkbox' && field.required && !field.checked) return field.getAttribute('data-msg-required') || MESSAGES.valueMissing;
    var v = field.validity;
    if (v.valueMissing) return field.getAttribute('data-msg-required') || MESSAGES.valueMissing;
    if (v.typeMismatch) return MESSAGES.typeMismatch;
    if (v.tooShort) return MESSAGES.tooShort;
    if (v.patternMismatch) return field.getAttribute('data-msg-pattern') || MESSAGES.patternMismatch;
    if (field.hasAttribute('data-work-email') && field.value) {
      var domain = field.value.split('@').pop().toLowerCase();
      if (D.PERSONAL_DOMAINS.indexOf(domain) !== -1) return 'Please use your work email so we can match you with the right team.';
    }
    return '';
  }
  function showError(field, msg) {
    var id = field.getAttribute('data-error-id') || (field.id + '-error');
    var el = document.getElementById(id);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (el) { el.textContent = msg; el.hidden = !msg; }
  }
  function setupForm(form, onSuccess) {
    form.setAttribute('novalidate', '');
    var fields = $$('input, select, textarea', form).filter(function (f) { return f.name && f.type !== 'hidden' && !f.hasAttribute('data-no-validate'); });
    fields.forEach(function (f) {
      var check = function () { if (f.getAttribute('aria-invalid') === 'true' || f.type === 'checkbox') showError(f, fieldError(f)); };
      f.addEventListener('input', check);
      f.addEventListener('change', check);
      f.addEventListener('blur', function () { if (f.value) showError(f, fieldError(f)); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      fields.forEach(function (f) {
        var msg = fieldError(f);
        showError(f, msg);
        if (msg && !first) first = f;
      });
      var summary = $('[data-form-summary]', form);
      if (first) {
        if (summary) { summary.hidden = false; summary.textContent = 'Please fix the highlighted fields and send again.'; }
        first.focus();
        return;
      }
      if (summary) summary.hidden = true;
      var done = onSuccess(new FormData(form));
      form.hidden = true;
      if (done) {
        done.hidden = false;
        var heading = $('h2, h3', done);
        if (heading) { heading.tabIndex = -1; heading.focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------
   * 15. Demo request
   * ------------------------------------------------------------------ */
  // The first weekday at least DEMO_LEAD_DAYS after today, at the preferred Eastern time.
  function proposedDemo(pref) {
    var t = hm(has(D.DEMO_TIMES, pref) ? D.DEMO_TIMES[pref] : D.DEMO_TIMES.morning);
    var day = TODAY + D.DEMO_LEAD_DAYS - 1;
    day = businessDaysAfter(day, 1)[0];
    var p = ymdOf(day);
    return { day: day, start: zonedToDate(p.y, p.m, p.d, Math.floor(t / 60), t % 60, COMPANY_ZONE) };
  }
  function initDemo() {
    var form = $('[data-demo-form]');
    if (!form) return;
    // Preselect from pricing.html: ?plan=growth&employees=200, and ?topic=security from the security page.
    var plan = params.get('plan');
    var note = $('[data-demo-plan-note]');
    var employees = intParam('employees', 1, 100000);
    var planNames = { essentials: D.PLANS.essentials.name, growth: D.PLANS.growth.name, enterprise: 'Enterprise' };
    if (plan && has(planNames, plan) && note) {
      note.hidden = false;
      note.textContent = 'You were looking at ' + planNames[plan] + (employees ? ' for ' + plural(employees, 'employee') : '') +
        (plan === 'enterprise' ? '. We’ll bring volume pricing for your size to the call.' : '. We’ll bring that estimate to the call.');
      form.elements.plan.value = plan;
    }
    if (employees) {
      form.elements.size.value = employees <= 200 ? 's1' : employees <= 500 ? 's2' : employees <= 1000 ? 's3' : 's4';
    }
    if (params.get('topic') === 'security') {
      var box = $('input[name="interest"][value="security"]', form);
      if (box) box.checked = true;
    }
    var msg = form.elements.message, counter = $('[data-count-chars]');
    if (msg && counter) {
      var max = +msg.getAttribute('maxlength');
      var upd = function () { counter.textContent = (max - msg.value.length) + ' characters left'; };
      msg.addEventListener('input', upd);
      upd();
    }
    setupForm(form, function (data) {
      var done = $('[data-demo-done]');
      var meet = proposedDemo(String(data.get('time')));
      $('[data-dd-name]', done).textContent = String(data.get('first')).trim();
      $('[data-dd-ref]', done).textContent = refCode('SW', 6);
      $('[data-dd-email]', done).textContent = String(data.get('email')).trim();
      $('[data-dd-when]', done).textContent = formatIn(meet.start, VISITOR_ZONE, { weekday: 'long', month: 'long', day: 'numeric' }) + ' at ' +
        timeIn(meet.start, VISITOR_ZONE) + ' ' + zoneAbbr(meet.start, VISITOR_ZONE);
      $('[data-dd-eastern]', done).textContent = VISITOR_ZONE === COMPANY_ZONE ? 'That’s our time too, in Lexington.'
        : 'That’s ' + timeIn(meet.start, COMPANY_ZONE) + ' ' + zoneAbbr(meet.start, COMPANY_ZONE) + ' at our office in Lexington.';
      var size = String(data.get('size'));
      $('[data-dd-size]', done).textContent = has(D.COMPANY_SIZES, size) ? D.COMPANY_SIZES[size] + ' employees' : '';
      return done;
    });
  }

  /* ------------------------------------------------------------------
   * 16. Boot
   * ------------------------------------------------------------------ */
  function boot() {
    initTheme();
    initMenu();
    initHeader();
    initYear();
    initPipeline();
    initScorecards();
    initBoards();
    initScheduler();
    initOffer();
    initPricing();
    initCustomers();
    initIntegrations();
    initRetention();
    initResources();
    initDemo();
    initReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
