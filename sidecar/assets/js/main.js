/* Sidecar — site script
 * Vanilla JavaScript, no dependencies. Content and settings live in assets/js/data.js (window.SIDECAR).
 * Sections:
 *  1. Settings that aren't content (storage keys, demo-date switch)
 *  2. Helpers (formatting, safe storage, URL parameters, announcements)
 *  3. Time: Central "today", day numbers, next open start dates
 *  4. Menu, header, scroll reveal, copyright year
 *  5. Start dates on the page (home, work, pricing, contact)
 *  6. Work: filters by service and stage, grid/list layout (work.html)
 *  7. Sketch-to-shipped compare slider (case-study.html)
 *  8. Engagement model helper (services.html)
 *  9. Engagement estimator (pricing.html)
 * 10. The 12-week plan: week tabs and founder hours (process.html)
 * 11. Team and studio clock (about.html)
 * 12. Open roles: filters and role details (careers.html)
 * 13. Project brief: multi-step form (contact.html)
 * 14. Boot
 */
(function () {
  'use strict';

  var D = window.SIDECAR;
  if (!D) return;

  /* ------------------------------------------------------------------
   * 1. Settings
   * ------------------------------------------------------------------ */
  // localStorage keys. Values are validated when read (see DOCS.md, "Saved data").
  var KEYS = {
    estimate: 'sidecar:estimate', // { v: 1, services: ['design', ...], team: 3, weeks: 12, model: 'sprint' | 'retainer' }
    workView: 'sidecar:work-view' // 'grid' | 'list'
  };

  // Demo dates: start dates, the estimator's timeline and the studio clock are worked out from today in
  // Central time (D.STUDIO.timeZone). A preview parameter ?now=YYYY-MM-DDTHH:MM (Central) pretends it is
  // another moment, for reviews and screenshots. Set to false on a live site if you don't want it.
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

  function groupThousands(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function plural(n, one, many) { return groupThousands(String(n)) + ' ' + (n === 1 ? one : (many || one + 's')); }
  // Whole dollars: 154000 -> "$154,000".
  function money(n) { return '$' + groupThousands(String(Math.round(n))); }
  function roundTo(n, step) { return Math.round(n / step) * step; }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function listJoin(items) {
    if (items.length < 2) return items.join('');
    return items.slice(0, -1).join(', ') + (items.length > 2 ? ',' : '') + ' and ' + items[items.length - 1];
  }
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

  var params = new URLSearchParams(window.location.search);
  function intParam(name, lo, hi) {
    var raw = params.get(name);
    if (raw === null || !/^\d{1,4}$/.test(raw)) return null;
    var n = parseInt(raw, 10);
    return n >= lo && n <= hi ? n : null;
  }
  function setParams(values) {
    var url = new URL(window.location.href);
    Object.keys(values).forEach(function (k) {
      if (values[k] === null || values[k] === '') url.searchParams.delete(k);
      else url.searchParams.set(k, values[k]);
    });
    var search = url.searchParams.toString().replace(/%2C/g, ',');
    try { window.history.replaceState(null, '', url.pathname + (search ? '?' + search : '') + url.hash); } catch (e) { /* file:// in some browsers */ }
  }

  /* ------------------------------------------------------------------
   * 3. Time
   * Calendar dates are day numbers (days since 1970-01-01) so daylight saving never shifts them.
   * ------------------------------------------------------------------ */
  var ZONE = D.STUDIO.timeZone;
  var zoneFmt = null;
  try {
    zoneFmt = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  } catch (e) { zoneFmt = null; }
  function zoneParts(date) {
    if (!zoneFmt) return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate(), hh: date.getHours(), mm: date.getMinutes() };
    var out = {};
    zoneFmt.formatToParts(date).forEach(function (p) { out[p.type] = p.value; });
    return { y: +out.year, m: +out.month, d: +out.day, hh: +out.hour % 24, mm: +out.minute };
  }
  // A Central wall-clock time to a Date.
  function zonedToDate(y, m, d, hh, mm) {
    var guess = Date.UTC(y, m - 1, d, hh, mm);
    for (var i = 0; i < 2; i++) {
      var p = zoneParts(new Date(guess));
      guess += Date.UTC(y, m - 1, d, hh, mm) - Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm);
    }
    return new Date(guess);
  }
  function dayNumber(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 864e5); }
  function ymdOf(day) { var t = new Date(day * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; }
  function weekdayOf(day) { return ((day + 4) % 7 + 7) % 7; } // 1970-01-01 was a Thursday
  function isoOf(day) { var p = ymdOf(day); return p.y + '-' + (p.m < 10 ? '0' : '') + p.m + '-' + (p.d < 10 ? '0' : '') + p.d; }
  // "Monday, Dec 7"
  function dayMonth(day) { var p = ymdOf(day); return WEEKDAYS[weekdayOf(day)] + ', ' + MONTHS[p.m - 1].slice(0, 3) + ' ' + p.d; }
  // "Mon, Dec 7, 2026"
  function shortDate(day) { var p = ymdOf(day); return WEEKDAYS[weekdayOf(day)].slice(0, 3) + ', ' + MONTHS[p.m - 1].slice(0, 3) + ' ' + p.d + ', ' + p.y; }
  // "Dec 7"
  function monthDay(day) { var p = ymdOf(day); return MONTHS[p.m - 1].slice(0, 3) + ' ' + p.d; }
  function hm(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }

  // "Now": the real time, or ?now=YYYY-MM-DDTHH:MM read as Central time.
  var NOW = (function () {
    var raw = ALLOW_NOW_PARAM ? params.get('now') : null;
    var m = raw && /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(raw);
    if (m) return zonedToDate(+m[1], +m[2], +m[3], +m[4], +m[5]);
    return new Date();
  })();
  var NOW_OFFSET = NOW.getTime() - Date.now(); // keeps a ?now= preview ticking
  function now() { return new Date(Date.now() + NOW_OFFSET); }
  var TODAY = (function () { var p = zoneParts(NOW); return dayNumber(p.y, p.m, p.d); })();

  // Next open start dates (D.START_RULE): the first Monday at least `leadDays` after today, then every
  // `everyWeeks` weeks; a start inside the winter break moves to the first Monday after it.
  function inClosed(day) {
    var c = D.START_RULE.closed, p = ymdOf(day);
    var md = p.m * 100 + p.d, from = c.from[0] * 100 + c.from[1], to = c.to[0] * 100 + c.to[1];
    return from <= to ? md >= from && md <= to : md >= from || md <= to;
  }
  function skipClosed(day) { while (inClosed(day)) day += 7; return day; }
  function startDates(count) {
    var R = D.START_RULE;
    var day = TODAY + R.leadDays;
    while (weekdayOf(day) !== 1) day += 1;
    day = skipClosed(day);
    var out = [];
    while (out.length < count) {
      var open = R.openings[out.length % R.openings.length];
      out.push({ day: day, open: open });
      day = skipClosed(day + 7 * R.everyWeeks);
    }
    return out;
  }
  var STARTS = startDates(D.START_RULE.count);
  function podsText(open) { return open + ' of 2 pods'; }

  /* ------------------------------------------------------------------
   * 4. Menu, header, reveal, year
   * ------------------------------------------------------------------ */
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
    var onScroll = function () { header.classList.toggle('shadow-[0_6px_0_-3px_rgb(29_27_22/.12)]', window.scrollY > 8); };
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
    var y = zoneParts(NOW).y;
    $$('[data-year]').forEach(function (el) { el.textContent = String(y); });
  }

  /* ------------------------------------------------------------------
   * 5. Start dates on the page
   * ------------------------------------------------------------------ */
  function initStartDates() {
    $$('[data-start-date]').forEach(function (el) {
      var s = STARTS[+el.getAttribute('data-start-date')];
      if (s) el.textContent = dayMonth(s.day);
    });
    $$('[data-start-open]').forEach(function (el) {
      var s = STARTS[+el.getAttribute('data-start-open')];
      if (s) el.textContent = podsText(s.open) + ' open';
    });
    var list = $('[data-start-list]');
    if (list) {
      list.innerHTML = STARTS.map(function (s) {
        return '<li class="flex items-baseline justify-between gap-3 border-b border-night-line pb-3"><span class="text-lg font-extrabold text-tape">' +
          shortDate(s.day) + '</span><span class="mono text-sm text-mist">' + podsText(s.open) + '</span></li>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------------
   * 6. Work: filters and layout
   * ------------------------------------------------------------------ */
  function serviceChips(ids) {
    return ids.map(function (id) { return '<span class="chip">' + escapeHtml(D.SERVICES[id].short) + '</span>'; }).join('');
  }
  function workCard(c, view) {
    var stage = '<span class="chip chip-stage">' + escapeHtml(D.STAGES[c.stage]) + '</span>';
    var link = c.page ? '<a href="' + c.page + '" class="mt-4 inline-flex items-center gap-2 font-semibold text-pine hover:underline">Read the case study<span class="sr-only">: ' + escapeHtml(c.name) + '</span> →</a>' : '';
    var shipped = '<ul class="mt-3 grid gap-1 text-sm text-ink-soft">' + c.shipped.map(function (s) { return '<li class="flex gap-2"><span class="text-pine" aria-hidden="true">✓</span>' + escapeHtml(s) + '</li>'; }).join('') + '</ul>';
    var meta = '<p class="mono mt-1 text-xs text-ink-faint">' + escapeHtml(c.city) + ' · ' + c.weeks + ' weeks · team of ' + c.team + ' · ' + c.year + '</p>';
    var metric = '<p class="text-2xl font-extrabold text-pine">' + escapeHtml(c.metric.value) + '</p><p class="text-sm text-ink-soft">' + escapeHtml(c.metric.label) + '</p>';
    if (view === 'list') {
      return '<li class="sheet grid overflow-hidden sm:grid-cols-[12rem_1fr] lg:grid-cols-[12rem_1fr_13rem]" data-case="' + c.id + '">' +
        '<img src="assets/img/work/' + c.id + '.svg" alt="" width="640" height="420" class="block h-full max-h-56 w-full border-b-2 border-ink bg-paper object-cover sm:max-h-none sm:border-r-2 sm:border-b-0" loading="lazy" />' +
        '<div class="min-w-0 p-5"><div class="flex flex-wrap gap-2">' + stage + serviceChips(c.services) + '</div>' +
        '<h3 class="mt-2 text-xl font-extrabold">' + escapeHtml(c.name) + '</h3>' + meta +
        '<p class="mt-2 text-ink-soft">' + escapeHtml(c.summary) + '</p>' + shipped + link + '</div>' +
        '<div class="border-t-2 border-dashed border-ink/25 p-5 sm:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l-2">' + metric + '</div></li>';
    }
    return '<li class="sheet flex flex-col overflow-hidden" data-case="' + c.id + '">' +
      '<img src="assets/img/work/' + c.id + '.svg" alt="" width="640" height="420" class="block aspect-[64/42] w-full border-b-2 border-ink bg-paper" loading="lazy" />' +
      '<div class="flex flex-1 flex-col p-5"><div class="flex flex-wrap gap-2">' + stage + serviceChips(c.services) + '</div>' +
      '<h3 class="mt-3 text-xl font-extrabold">' + escapeHtml(c.name) + '</h3>' +
      '<p class="mt-1 text-ink-soft">' + escapeHtml(c.what) + '</p>' + meta +
      '<div class="mt-auto pt-4"><div class="border-t-2 border-dashed border-ink/25 pt-3">' + metric + '</div>' + link + '</div></div></li>';
  }
  function initWork() {
    var list = $('[data-work-list]');
    if (!list) return;
    var count = $('[data-work-count]'), empty = $('[data-work-empty]');
    var saved = safeStorage.getItem(KEYS.workView);
    var state = {
      service: has(D.SERVICES, params.get('service')) ? params.get('service') : 'all',
      stage: has(D.STAGES, params.get('stage')) ? params.get('stage') : 'all',
      view: params.get('view') === 'list' || params.get('view') === 'grid' ? params.get('view') : (saved === 'list' ? 'list' : 'grid')
    };
    function render(fromUser) {
      var shown = D.CASES.filter(function (c) {
        return (state.service === 'all' || c.services.indexOf(state.service) !== -1) && (state.stage === 'all' || c.stage === state.stage);
      });
      list.className = state.view === 'list' ? 'mt-8 grid gap-6' : 'mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3';
      list.innerHTML = shown.map(function (c) { return workCard(c, state.view); }).join('');
      empty.hidden = shown.length > 0;
      count.textContent = 'Showing ' + shown.length + ' of ' + plural(D.CASES.length, 'project');
      $$('[data-filter-service]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter-service') === state.service ? 'true' : 'false'); });
      $$('[data-filter-stage]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter-stage') === state.stage ? 'true' : 'false'); });
      $$('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === state.view ? 'true' : 'false'); });
      if (fromUser) {
        setParams({ service: state.service === 'all' ? null : state.service, stage: state.stage === 'all' ? null : state.stage, view: state.view === 'list' ? 'list' : null });
      }
    }
    $$('[data-filter-service]').forEach(function (b) {
      b.addEventListener('click', function () { state.service = b.getAttribute('data-filter-service'); render(true); });
    });
    $$('[data-filter-stage]').forEach(function (b) {
      b.addEventListener('click', function () { state.stage = b.getAttribute('data-filter-stage'); render(true); });
    });
    $$('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.view = b.getAttribute('data-view');
        safeStorage.setItem(KEYS.workView, state.view);
        render(true);
        announce(state.view === 'list' ? 'List layout' : 'Grid layout');
      });
    });
    $('[data-work-reset]').addEventListener('click', function () { state.service = 'all'; state.stage = 'all'; render(true); });
    render(false);
  }

  /* ------------------------------------------------------------------
   * 7. Compare slider
   * ------------------------------------------------------------------ */
  function initCompare() {
    var box = $('[data-compare]');
    if (!box) return;
    var range = $('[data-compare-range]', box), top = $('[data-compare-top]', box), line = $('[data-compare-line]', box);
    function set() {
      var v = +range.value;
      top.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      line.style.left = v + '%';
      range.setAttribute('aria-valuetext', v + '% sketch');
    }
    range.addEventListener('input', set);
    set();
  }

  /* ------------------------------------------------------------------
   * 8. Engagement model helper
   * ------------------------------------------------------------------ */
  var MODEL_PICKED = 'shadow-[5px_5px_0_var(--color-pine)]';
  function initModelQuiz() {
    var form = $('[data-model-quiz]');
    if (!form) return;
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.addEventListener('change', function () {
      var scope = form.elements.scope.value, eng = form.elements.engineers.value, team = form.elements.team.value;
      if (!scope || !eng || !team) return;
      var pick = team === 'yes' && eng === 'no' ? 'hire' : scope === 'yes' ? 'sprint' : 'retainer';
      var m = D.MODELS[pick];
      $('[data-model-name]').textContent = m.name;
      $('[data-model-why]').textContent = m.why;
      var link = $('[data-model-link]');
      link.href = m.link;
      link.textContent = 'Estimate a ' + m.name.toLowerCase();
      $$('[data-model-card]').forEach(function (c) { c.classList.toggle(MODEL_PICKED, c.getAttribute('data-model-card') === pick); });
    });
  }

  /* ------------------------------------------------------------------
   * 9. Engagement estimator
   * ------------------------------------------------------------------ */
  var E = D.ESTIMATE;
  function validServices(list) {
    var out = [];
    D.SERVICE_ORDER.forEach(function (id) { if (list.indexOf(id) !== -1) out.push(id); });
    return out;
  }
  function validWeeks(n) { return typeof n === 'number' && n >= E.weeks.min && n <= E.weeks.max && (n - E.weeks.min) % E.weeks.step === 0; }
  function validTeam(n) { return E.teamSizes.indexOf(n) !== -1; }
  // Estimator settings from the URL (?services=design,engineering&team=3&weeks=12&model=sprint), or null.
  function estimateFromParams() {
    var raw = params.get('services');
    var services = raw ? validServices(raw.split(',')) : [];
    var team = intParam('team', 1, 99), weeks = intParam('weeks', 1, 99), model = params.get('model');
    var found = false, st = { services: E.defaults.services.slice(), team: E.defaults.team, weeks: E.defaults.weeks, model: E.defaults.model };
    if (services.length) { st.services = services; found = true; }
    if (team !== null && validTeam(team)) { st.team = team; found = true; }
    if (weeks !== null && validWeeks(weeks)) { st.weeks = weeks; found = true; }
    if (model === 'sprint' || model === 'retainer') { st.model = model; found = true; }
    return found ? st : null;
  }
  function estimateFromStorage() {
    var s = readJSON(KEYS.estimate);
    if (!s || s.v !== 1 || !Array.isArray(s.services)) return null;
    var services = validServices(s.services.filter(function (x) { return typeof x === 'string'; }));
    if (!services.length || !validTeam(s.team) || !validWeeks(s.weeks) || (s.model !== 'sprint' && s.model !== 'retainer')) return null;
    return { services: services, team: s.team, weeks: s.weeks, model: s.model };
  }
  // The price math. Returns everything the result panel and the brief note show.
  function computeEstimate(st) {
    var rate = st.services.reduce(function (sum, id) { return sum + D.SERVICES[id].rate; }, 0) / st.services.length;
    var out = { rate: rate };
    if (st.model === 'retainer') {
      var R = E.retainer;
      var monthly = rate * st.team * R.weeksPerMonth * (1 - R.discount);
      out.months = Math.max(R.minMonths, Math.ceil(st.weeks / R.weeksPerMonth));
      out.low = roundTo(monthly * R.low, R.roundTo);
      out.high = roundTo(monthly * R.high, R.roundTo);
      out.totalLow = out.low * out.months;
      out.totalHigh = out.high * out.months;
      out.mid = monthly * out.months;
    } else {
      var S = E.sprint;
      out.mid = rate * st.team * st.weeks;
      out.low = roundTo(out.mid * S.low, S.roundTo);
      out.high = roundTo(out.mid * S.high, S.roundTo);
      out.totalLow = out.low;
      out.totalHigh = out.high;
    }
    return out;
  }
  // Share `weeks` among the phases that apply, by weight (largest remainder, at least one week each).
  function planPhases(services, weeks) {
    var active = D.PHASES.filter(function (p) { return !p.service || services.indexOf(p.service) !== -1; });
    ['handoff', 'frame'].forEach(function (drop) {
      if (active.length > weeks) active = active.filter(function (p) { return p.id !== drop; });
    });
    var total = active.reduce(function (s, p) { return s + p.weight; }, 0);
    var parts = active.map(function (p, i) {
      var raw = weeks * p.weight / total;
      return { phase: p, i: i, len: Math.max(1, Math.floor(raw)), frac: raw - Math.floor(raw) };
    });
    var sum = parts.reduce(function (s, p) { return s + p.len; }, 0);
    var byFrac = parts.slice().sort(function (a, b) { return b.frac - a.frac || a.i - b.i; });
    for (var k = 0; sum < weeks; k++) { byFrac[k % byFrac.length].len += 1; sum += 1; }
    while (sum > weeks) {
      var big = parts.slice().sort(function (a, b) { return b.len - a.len || a.i - b.i; })[0];
      big.len -= 1; sum -= 1;
    }
    var at = 1;
    return parts.map(function (p) {
      var r = { id: p.phase.id, name: p.phase.name, start: at, end: at + p.len - 1, len: p.len };
      at += p.len;
      return r;
    });
  }
  function serviceNames(ids) { return listJoin(ids.map(function (id) { return D.SERVICES[id].short; })); }
  function estimateQuery(st) {
    return 'services=' + st.services.join(',') + '&team=' + st.team + '&weeks=' + st.weeks + '&model=' + st.model;
  }
  function rangeText(est, model) {
    return money(est.low) + ' to ' + money(est.high) + (model === 'retainer' ? ' a month' : '');
  }

  function initEstimator() {
    var form = $('[data-estimator]');
    if (!form) return;
    var st = estimateFromParams() || estimateFromStorage() || { services: E.defaults.services.slice(), team: E.defaults.team, weeks: E.defaults.weeks, model: E.defaults.model };
    var weeksInput = form.elements.weeks;
    var svcError = $('[data-est-svc-error]');

    function sync() {
      $$('input[name="svc"]', form).forEach(function (b) { b.checked = st.services.indexOf(b.value) !== -1; });
      $$('input[name="team"]', form).forEach(function (r) { r.checked = +r.value === st.team; });
      weeksInput.value = String(st.weeks);
      $$('[data-model]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-model') === st.model ? 'true' : 'false'); });
    }
    function render(fromUser) {
      var est = computeEstimate(st);
      var weeksText = plural(st.weeks, 'week');
      $('[data-est-weeks-out]').textContent = weeksText;
      weeksInput.setAttribute('aria-valuetext', weeksText);
      $('[data-est-team-hint]').textContent = E.teamHints[st.team];
      $('[data-est-model-hint]').textContent = E.modelHints[st.model];
      $('[data-est-label]').textContent = st.model === 'retainer' ? 'Estimated monthly retainer' : 'Estimated fixed price';
      $('[data-est-range]').textContent = rangeText(est, st.model);
      $('[data-est-sub]').textContent = st.model === 'retainer'
        ? 'Every 4 weeks for ' + plural(est.months, 'month') + ': ' + money(est.totalLow) + ' to ' + money(est.totalHigh) + ' in total'
        : plural(st.team, 'person', 'people') + ' for ' + weeksText + ' at ' + money(est.rate) + ' per person-week';

      var phases = planPhases(st.services, st.weeks);
      $('[data-est-timeline]').innerHTML = phases.map(function (p) {
        var left = (p.start - 1) / st.weeks * 100, width = p.len / st.weeks * 100;
        var when = p.len === 1 ? 'Week ' + p.start : 'Weeks ' + p.start + '–' + p.end;
        return '<li><div class="flex items-baseline justify-between gap-3 text-sm"><span class="font-semibold">' + escapeHtml(p.name) + '</span><span class="mono text-xs text-ink-faint">' + when + '</span></div>' +
          '<div class="relative mt-1 h-3 rounded-full bg-paper-2" aria-hidden="true"><span class="absolute inset-y-0 rounded-full border-2 border-ink bg-sprout" style="left:' + left.toFixed(2) + '%;width:' + width.toFixed(2) + '%"></span></div></li>';
      }).join('');
      var start = STARTS[0].day, end = start + st.weeks * 7 - 3;
      $('[data-est-start]').textContent = dayMonth(start);
      $('[data-est-end]').textContent = dayMonth(end);
      $('[data-est-dates]').textContent = monthDay(start) + ' to ' + monthDay(end);
      $('[data-est-brief]').href = 'contact.html?' + estimateQuery(st);

      if (fromUser) {
        safeStorage.setItem(KEYS.estimate, JSON.stringify({ v: 1, services: st.services, team: st.team, weeks: st.weeks, model: st.model }));
        setParams({ services: st.services.join(','), team: String(st.team), weeks: String(st.weeks), model: st.model });
      }
    }

    $$('input[name="svc"]', form).forEach(function (b) {
      b.addEventListener('change', function () {
        var picked = validServices($$('input[name="svc"]:checked', form).map(function (x) { return x.value; }));
        if (!picked.length) {
          b.checked = true;
          svcError.hidden = false;
          announce(svcError.textContent);
          return;
        }
        svcError.hidden = true;
        st.services = picked;
        render(true);
      });
    });
    $$('input[name="team"]', form).forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked) { st.team = +r.value; render(true); } });
    });
    weeksInput.addEventListener('input', function () {
      var n = +weeksInput.value;
      if (validWeeks(n)) { st.weeks = n; render(true); }
    });
    $$('[data-model]').forEach(function (b) {
      b.addEventListener('click', function () {
        st.model = b.getAttribute('data-model');
        $$('[data-model]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render(true);
      });
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    $('[data-est-reset]').addEventListener('click', function () {
      st = { services: E.defaults.services.slice(), team: E.defaults.team, weeks: E.defaults.weeks, model: E.defaults.model };
      safeStorage.removeItem(KEYS.estimate);
      setParams({ services: null, team: null, weeks: null, model: null });
      svcError.hidden = true;
      sync();
      render(false);
      announce('Estimator reset');
    });
    sync();
    render(false);
  }

  /* ------------------------------------------------------------------
   * 10. The 12-week plan
   * ------------------------------------------------------------------ */
  function initWeeks() {
    var root = $('[data-weeks]');
    if (!root) return;
    var tabsBox = $('[data-week-tabs]', root), panel = $('[data-week-panel]', root);
    var W = D.WEEKS, maxHours = Math.max.apply(null, W.map(function (w) { return w.founder; }));
    tabsBox.innerHTML = W.map(function (w) {
      return '<button type="button" role="tab" class="wk-tab" id="week-tab-' + w.week + '" aria-controls="week-panel" aria-selected="false" tabindex="-1">' +
        '<span><span class="sr-only">Week </span>' + w.week + '</span></button>';
    }).join('');
    var tabs = $$('[role="tab"]', tabsBox);
    var chart = $('[data-hours-chart]');
    chart.innerHTML = '<div class="flex h-32 items-end gap-1 border-b-2 border-ink">' + W.map(function (w) {
      return '<button type="button" class="group flex h-full flex-1 items-end rounded-t-sm focus-visible:outline-offset-0" data-hours-week="' + w.week + '" aria-label="Week ' + w.week + ': ' + plural(w.founder, 'hour') + '">' +
        '<span class="block w-full rounded-t-sm border-2 border-b-0 border-ink bg-paper-2 transition group-hover:bg-tape" style="height:' + Math.round(w.founder / maxHours * 100) + '%"></span></button>';
    }).join('') + '</div><div class="mono mt-1 flex gap-1 text-center text-[11px] text-ink-faint" aria-hidden="true">' +
      W.map(function (w) { return '<span class="flex-1">' + w.week + '</span>'; }).join('') + '</div>';
    var total = W.reduce(function (s, w) { return s + w.founder; }, 0);
    $('[data-hours-total]').textContent = plural(total, 'hour') + ' in total, about ' + (Math.round(total / W.length * 10) / 10) + ' a week';

    var current = 0;
    function select(i, focus, fromUser) {
      current = Math.max(0, Math.min(W.length - 1, i));
      var w = W[current];
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === current ? 'true' : 'false');
        t.tabIndex = k === current ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', 'week-tab-' + w.week);
      $('[data-wk-phase]', panel).textContent = w.phase;
      $('[data-wk-count]', panel).textContent = 'Week ' + w.week + ' of ' + W.length;
      $('[data-wk-title]', panel).textContent = w.title;
      $('[data-wk-text]', panel).textContent = w.text;
      $('[data-wk-artifact]', panel).textContent = w.artifact;
      $('[data-wk-hours]', panel).textContent = plural(w.founder, 'hour');
      $('[data-wk-bar]', panel).style.width = Math.round(w.founder / maxHours * 100) + '%';
      $('[data-wk-studio]', panel).innerHTML = w.studio.map(function (s) { return '<li class="chip">' + escapeHtml(s) + '</li>'; }).join('');
      $('[data-wk-prev]', panel).disabled = current === 0;
      $('[data-wk-next]', panel).disabled = current === W.length - 1;
      $$('[data-hours-week]', chart).forEach(function (b, k) {
        $('span', b).classList.toggle('bg-pine', k === current);
        $('span', b).classList.toggle('bg-paper-2', k !== current);
        b.setAttribute('aria-pressed', k === current ? 'true' : 'false');
      });
      if (focus) tabs[current].focus();
      if (fromUser) {
        try { window.history.replaceState(null, '', window.location.pathname + window.location.search + '#week-' + w.week); } catch (e) { /* file:// */ }
      }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false, true); });
      t.addEventListener('keydown', function (e) {
        var to = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % W.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i - 1 + W.length) % W.length;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = W.length - 1;
        if (to === null) return;
        e.preventDefault();
        select(to, true, true);
      });
    });
    $$('[data-hours-week]', chart).forEach(function (b, i) { b.addEventListener('click', function () { select(i, false, true); }); });
    $('[data-wk-prev]', panel).addEventListener('click', function () { select(current - 1, false, true); });
    $('[data-wk-next]', panel).addEventListener('click', function () { select(current + 1, false, true); });
    var m = /^#week-(\d{1,2})$/.exec(window.location.hash);
    var start = m ? +m[1] - 1 : 0;
    select(start >= 0 && start < W.length ? start : 0, false, false);
  }

  /* ------------------------------------------------------------------
   * 11. Team and studio clock
   * ------------------------------------------------------------------ */
  var SKINS = ['#f2d3b8', '#e2b48c', '#c68e63', '#9a6440', '#6e452b'];
  var HAIRS = ['#1d1b16', '#6b4426', '#c99a52', '#8a3b1d', '#a39d92'];
  var BGS = ['#dcecd8', '#f7ebb4', '#ece5d4', '#86d6a0'];
  var SHIRTS = ['#17663f', '#1d1b16', '#f1d867', '#fcfaf4', '#8b8271'];
  // A drawn portrait from a few settings (see TEAM in data.js).
  function drawAvatar(p, i) {
    var skin = SKINS[p.skin % SKINS.length], hair = HAIRS[p.hairColor % HAIRS.length];
    var ink = 'stroke="#1d1b16" stroke-width="2.5" stroke-linejoin="round"';
    var back = '', front = '';
    switch (p.hair % 6) {
      case 0: front = '<path d="M40 50c-1-14 9-22 20-22s21 8 20 22c-4-7-11-10-20-10s-16 3-20 10z" fill="' + hair + '" ' + ink + '/>'; break;
      case 1: front = '<path d="M39 54c-3-18 8-27 22-27 12 0 21 8 20 24-6-6-10-12-12-16-8 8-18 12-30 19z" fill="' + hair + '" ' + ink + '/>'; break;
      case 2: back = '<path d="M36 76c-6-28 4-48 24-48s30 20 24 48z" fill="' + hair + '" ' + ink + '/>';
        front = '<path d="M40 52c2-12 10-18 20-18s18 6 20 18c-8-3-14-8-20-12-6 4-12 9-20 12z" fill="' + hair + '"/>'; break;
      case 3: back = '<path d="M34 98c-4-40 2-70 26-70s30 30 26 70z" fill="' + hair + '" ' + ink + '/>';
        front = '<path d="M40 54c0-14 8-20 20-20s20 6 20 20c-10-2-16-8-20-14-4 6-10 12-20 14z" fill="' + hair + '"/>'; break;
      case 4: front = '<g fill="' + hair + '" ' + ink + '><circle cx="44" cy="40" r="10"/><circle cx="60" cy="32" r="12"/><circle cx="76" cy="40" r="10"/><circle cx="40" cy="54" r="7"/><circle cx="80" cy="54" r="7"/></g>'; break;
      default: front = '<circle cx="60" cy="24" r="9" fill="' + hair + '" ' + ink + '/><path d="M40 52c-1-14 9-21 20-21s21 7 20 21c-5-6-12-9-20-9s-15 3-20 9z" fill="' + hair + '" ' + ink + '/>';
    }
    var glasses = p.glasses ? '<g fill="none" stroke="#1d1b16" stroke-width="2.2"><circle cx="51" cy="58" r="6.5"/><circle cx="69" cy="58" r="6.5"/><path d="M57.5 58h5"/></g>' : '';
    return '<svg viewBox="0 0 120 120" class="block h-auto w-full" aria-hidden="true">' +
      '<rect width="120" height="120" fill="' + BGS[p.bg % BGS.length] + '"/>' + back +
      '<path d="M24 120c2-20 16-30 36-30s34 10 36 30z" fill="' + SHIRTS[i % SHIRTS.length] + '" ' + ink + '/>' +
      '<path d="M53 80h14v12c-4 3-10 3-14 0z" fill="' + skin + '" ' + ink + '/>' +
      '<ellipse cx="60" cy="58" rx="20" ry="23" fill="' + skin + '" ' + ink + '/>' + front +
      '<circle cx="52" cy="58" r="2.2" fill="#1d1b16"/><circle cx="68" cy="58" r="2.2" fill="#1d1b16"/>' +
      '<path d="M53 70c4 3 10 3 14 0" fill="none" stroke="#1d1b16" stroke-width="2.2" stroke-linecap="round"/>' + glasses + '</svg>';
  }
  function initTeam() {
    var list = $('[data-team-list]');
    if (!list) return;
    var count = $('[data-team-count]');
    function render(group) {
      var shown = D.TEAM.filter(function (p) { return group === 'all' || p.group === group; });
      list.innerHTML = shown.map(function (p) {
        var i = D.TEAM.indexOf(p);
        return '<li><div class="overflow-hidden rounded-md border-2 border-ink shadow-[3px_3px_0_var(--color-ink)]">' + drawAvatar(p, i) + '</div>' +
          '<h3 class="mt-3 font-extrabold leading-tight">' + escapeHtml(p.name) + '</h3>' +
          '<p class="mono mt-0.5 text-xs text-pine">' + escapeHtml(p.role) + '</p>' +
          '<p class="mt-1.5 text-sm text-ink-soft">' + escapeHtml(p.note) + '</p></li>';
      }).join('');
      count.textContent = group === 'all' ? plural(shown.length, 'person', 'people') : plural(shown.length, 'person', 'people') + ' in ' + D.TEAM_GROUPS[group].toLowerCase();
      $$('[data-team-group]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-team-group') === group ? 'true' : 'false'); });
    }
    $$('[data-team-group]').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.getAttribute('data-team-group');
        render(g === 'all' || has(D.TEAM_GROUPS, g) ? g : 'all');
      });
    });
    render('all');
  }

  // "It is 10:42 a.m. in Little Rock. The studio is open."
  function clockText(date) {
    var p = zoneParts(date), H = D.STUDIO.hours;
    var mins = p.hh * 60 + p.mm, wd = weekdayOf(dayNumber(p.y, p.m, p.d));
    var h12 = p.hh % 12 === 0 ? 12 : p.hh % 12;
    var time = h12 + ':' + (p.mm < 10 ? '0' : '') + p.mm + (p.hh < 12 ? ' a.m.' : ' p.m.');
    var open = hm(H.open), close = hm(H.close);
    var openH = Math.floor(open / 60), openM = open % 60;
    var openText = (openH % 12 === 0 ? 12 : openH % 12) + ':' + (openM < 10 ? '0' : '') + openM + (openH < 12 ? ' a.m.' : ' p.m.');
    var workday = H.days.indexOf(wd) !== -1;
    var state;
    if (workday && mins >= open && mins < close) state = 'The studio is open.';
    else if (workday && mins < open) state = 'The studio opens at ' + openText;
    else if (wd === 5 || wd === 6 || (wd === 0)) state = 'We are out for the weekend, back Monday at ' + openText;
    else state = 'We are done for the day, back tomorrow at ' + openText;
    if (state.slice(-1) !== '.') state += '.';
    return 'It is ' + time + ' in ' + D.STUDIO.city + '. ' + state;
  }
  function initClock() {
    var el = $('[data-studio-clock]');
    if (!el) return;
    var tick = function () { el.textContent = clockText(now()); };
    tick();
    setInterval(tick, 30000);
  }

  /* ------------------------------------------------------------------
   * 12. Open roles
   * ------------------------------------------------------------------ */
  function roleItem(r) {
    var list = function (items) { return '<ul class="mt-2 grid gap-1.5 text-ink-soft">' + items.map(function (x) { return '<li class="flex gap-2"><span class="text-pine" aria-hidden="true">–</span>' + escapeHtml(x) + '</li>'; }).join('') + '</ul>'; };
    var subject = encodeURIComponent(r.title);
    return '<li class="sheet" id="role-' + r.id + '" data-role="' + r.id + '">' +
      '<div class="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">' +
      '<div class="min-w-0"><h3 class="text-xl font-extrabold">' + escapeHtml(r.title) + '</h3>' +
      '<div class="mt-2 flex flex-wrap gap-2"><span class="chip chip-stage">' + escapeHtml(D.DISCIPLINES[r.discipline]) + '</span><span class="chip">' + escapeHtml(D.MODES[r.mode]) + '</span><span class="chip">' + escapeHtml(r.pay) + '</span></div>' +
      '<p class="mt-2 text-ink-soft">' + escapeHtml(r.summary) + '</p></div>' +
      '<button type="button" class="btn-outline btn-sm" aria-expanded="false" aria-controls="role-' + r.id + '-detail" data-role-toggle>Read the role <span class="sr-only">' + escapeHtml(r.title) + '</span></button></div>' +
      '<div id="role-' + r.id + '-detail" class="border-t-2 border-dashed border-ink/30 px-5 pt-5 pb-6" hidden>' +
      '<div class="grid gap-6 md:grid-cols-3"><div><h4 class="label text-ink">What you will do</h4>' + list(r.doing) + '</div>' +
      '<div><h4 class="label text-ink">What you bring</h4>' + list(r.need) + '</div>' +
      '<div><h4 class="label text-ink">Nice to have</h4>' + list(r.nice) + '</div></div>' +
      '<p class="mt-6 rounded-md bg-paper-2 p-4 text-sm">To apply, email <a class="link" href="mailto:' + D.STUDIO.jobsEmail + '?subject=' + subject + '">' + D.STUDIO.jobsEmail + '</a> with “' + escapeHtml(r.title) + '” in the subject, a few lines about you and a link to your work. Thatcher replies to every application within a week.</p>' +
      '</div></li>';
  }
  function initRoles() {
    var list = $('[data-role-list]');
    if (!list) return;
    var count = $('[data-role-count]'), empty = $('[data-role-empty]');
    var state = {
      discipline: has(D.DISCIPLINES, params.get('discipline')) ? params.get('discipline') : 'all',
      mode: has(D.MODES, params.get('mode')) ? params.get('mode') : 'all'
    };
    var openId = null;
    var hm2 = /^#role-([a-z0-9-]+)$/.exec(window.location.hash);
    if (hm2 && D.ROLES.some(function (r) { return r.id === hm2[1]; })) openId = hm2[1];

    function setOpen(item, open) {
      var btn = $('[data-role-toggle]', item), detail = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.firstChild.textContent = open ? 'Close ' : 'Read the role ';
      detail.hidden = !open;
    }
    function render(fromUser) {
      var shown = D.ROLES.filter(function (r) {
        return (state.discipline === 'all' || r.discipline === state.discipline) && (state.mode === 'all' || r.mode === state.mode);
      });
      list.innerHTML = shown.map(roleItem).join('');
      empty.hidden = shown.length > 0;
      count.textContent = plural(shown.length, 'open role');
      $$('[data-role-discipline]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-role-discipline') === state.discipline ? 'true' : 'false'); });
      $$('[data-role-mode]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-role-mode') === state.mode ? 'true' : 'false'); });
      $$('[data-role]', list).forEach(function (item) {
        var btn = $('[data-role-toggle]', item);
        if (item.getAttribute('data-role') === openId) setOpen(item, true);
        btn.addEventListener('click', function () {
          var open = btn.getAttribute('aria-expanded') !== 'true';
          setOpen(item, open);
          openId = open ? item.getAttribute('data-role') : null;
          try { window.history.replaceState(null, '', window.location.pathname + window.location.search + (open ? '#' + item.id : '')); } catch (e) { /* file:// */ }
        });
      });
      if (fromUser) setParams({ discipline: state.discipline === 'all' ? null : state.discipline, mode: state.mode === 'all' ? null : state.mode });
    }
    $$('[data-role-discipline]').forEach(function (b) {
      b.addEventListener('click', function () { state.discipline = b.getAttribute('data-role-discipline'); render(true); });
    });
    $$('[data-role-mode]').forEach(function (b) {
      b.addEventListener('click', function () { state.mode = b.getAttribute('data-role-mode'); render(true); });
    });
    $('[data-role-reset]').addEventListener('click', function () { state.discipline = 'all'; state.mode = 'all'; render(true); });
    render(false);
    if (openId) {
      var target = document.getElementById('role-' + openId);
      if (target) target.scrollIntoView();
    }
  }

  /* ------------------------------------------------------------------
   * 13. Project brief
   * To connect a real endpoint (Formspree, your CRM, a serverless function), replace the call to
   * `showDone(data)` in the submit handler with a fetch, and show the success panel only when it answers OK:
   *
   *   fetch('https://formspree.io/f/your-id', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
   *     .then(function (r) { if (r.ok) showDone(data); else showSummary('Something went wrong. Please try again.'); });
   * ------------------------------------------------------------------ */
  var STEP_NAMES = ['Stage', 'Need', 'Budget', 'Timing', 'You'];
  function initBrief() {
    var form = $('[data-brief]');
    if (!form) return;
    var steps = $$('fieldset[data-step]', form), total = steps.length, current = 1;
    var back = $('[data-brief-back]', form), next = $('[data-brief-next]', form), submit = $('[data-brief-submit]', form);
    var summary = $('[data-brief-summary]', form), progress = $('[data-brief-progress]', form);
    var B = D.BRIEF;

    // Start dates in the select.
    var select = form.elements.start, flexible = select.querySelector('option[value="flexible"]');
    STARTS.forEach(function (s) {
      var o = document.createElement('option');
      o.value = isoOf(s.day);
      o.textContent = shortDate(s.day) + ' · ' + podsText(s.open) + ' open';
      select.insertBefore(o, flexible); // "I'm flexible" stays last
    });
    select.value = isoOf(STARTS[0].day);

    // Prefill from the estimator (?services=...&team=...&weeks=...&model=...).
    var est = estimateFromParams();
    // Only when the link names at least one real service (?services=nope prefills nothing).
    if (est && validServices((params.get('services') || '').split(',')).length) {
      est.services.forEach(function (id) { var b = $('input[name="need"][value="' + id + '"]', form); if (b) b.checked = true; });
      var e = computeEstimate(est);
      var mid = e.mid;
      for (var k = 0; k < B.budgetCaps.length; k++) {
        if (mid <= B.budgetCaps[k][1]) { $('input[name="budget"][value="' + B.budgetCaps[k][0] + '"]', form).checked = true; break; }
      }
      var note = $('[data-brief-estimate]');
      note.hidden = false;
      note.textContent = 'From the estimator: ' + serviceNames(est.services) + ', ' + plural(est.team, 'person', 'people') + ' for ' + plural(est.weeks, 'week') + ', ' +
        (est.model === 'retainer' ? 'monthly retainer, ' : 'fixed sprint, ') + rangeText(e, est.model) + '. We filled in what we could.';
    }

    var about = form.elements.about, aboutCount = $('[data-about-count]');
    var aboutMax = +about.getAttribute('maxlength');
    function updCount() { aboutCount.textContent = plural(aboutMax - about.value.length, 'character') + ' left'; }
    about.addEventListener('input', function () { updCount(); if (about.getAttribute('aria-invalid') === 'true') check(2); });
    updCount();

    var pick = $('[data-start-pick]', form);
    function syncTimeline() { pick.hidden = form.elements.timeline.value === 'exploring'; }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'timeline') syncTimeline();
      var fs = e.target.closest('fieldset[data-step]');
      if (fs && fs.getAttribute('data-invalid') === 'true') check(+fs.getAttribute('data-step'));
    });

    function setError(id, msg, field) {
      var el = document.getElementById(id);
      if (el) { el.textContent = msg; el.hidden = !msg; }
      if (field) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }
    // Validate one step; returns the first field to focus, or null when the step is fine.
    function check(n) {
      var first = null;
      var fail = function (el) { if (!first) first = el; };
      var fs = steps[n - 1];
      if (n === 1) {
        var ok1 = !!form.elements.stage.value;
        setError('stage-error', ok1 ? '' : 'Pick the stage that fits best.');
        if (!ok1) fail($('input[name="stage"]', form));
      } else if (n === 2) {
        var needs = $$('input[name="need"]:checked', form).length;
        setError('need-error', needs ? '' : 'Pick at least one: design, engineering or launch.');
        if (!needs) fail($('input[name="need"]', form));
        var len = about.value.trim().length;
        var msg = len === 0 ? 'Tell us what you are building.' : len < 20 ? 'Tell us a little more: at least 20 characters.' : '';
        setError('brief-about-error', msg, about);
        if (msg) fail(about);
      } else if (n === 3) {
        var ok3 = !!form.elements.budget.value;
        setError('budget-error', ok3 ? '' : 'Pick a range, or “Not sure yet”.');
        if (!ok3) fail($('input[name="budget"]', form));
      } else if (n === 4) {
        var ok4 = !!form.elements.timeline.value;
        setError('timeline-error', ok4 ? '' : 'Pick when you would like to start.');
        if (!ok4) fail($('input[name="timeline"]', form));
      } else if (n === 5) {
        var name = form.elements.name, email = form.elements.email, company = form.elements.company;
        var nm = name.value.trim() ? '' : 'Tell us your name.';
        setError('brief-name-error', nm, name);
        if (nm) fail(name);
        var em = !email.value.trim() ? 'We need an email to reply to.' : email.validity.typeMismatch ? 'Enter an email like name@company.example.' : '';
        setError('brief-email-error', em, email);
        if (em) fail(email);
        var co = company.value.trim() ? '' : 'Which company is this for?';
        setError('brief-company-error', co, company);
        if (co) fail(company);
      }
      fs.setAttribute('data-invalid', first ? 'true' : 'false');
      return first;
    }
    $$('input[type="text"], input[type="email"]', form).forEach(function (f) {
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') check(5); });
    });

    function show(n, focus) {
      current = n;
      steps.forEach(function (fs, i) { fs.hidden = i !== n - 1; });
      $$('[data-step-marker]', form).forEach(function (m, i) {
        var done = i < n - 1, on = i === n - 1;
        m.classList.toggle('border-ink', done || on);
        m.classList.toggle('border-line', !done && !on);
        m.classList.toggle('text-ink-faint', !done && !on);
        m.classList.toggle('border-pine', done);
        if (on) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
      });
      back.hidden = n === 1;
      next.hidden = n === total;
      submit.hidden = n !== total;
      progress.textContent = 'Step ' + n + ' of ' + total;
      summary.hidden = true;
      if (focus) {
        var target = $('input:not([type="hidden"]), textarea, select', steps[n - 1]);
        if (target) target.focus();
        announce('Step ' + n + ' of ' + total + ': ' + STEP_NAMES[n - 1]);
      }
    }
    function showSummary(msg) { summary.textContent = msg; summary.hidden = false; }
    next.addEventListener('click', function () {
      var bad = check(current);
      if (bad) { showSummary('Please answer the highlighted question to continue.'); bad.focus(); return; }
      show(current + 1, true);
    });
    back.addEventListener('click', function () { show(current - 1, true); });

    function showDone(data) {
      var done = $('[data-brief-done]');
      var first = String(data.get('name')).trim().split(/\s+/)[0];
      $('[data-bd-name]', done).textContent = first;
      $('[data-bd-ref]', done).textContent = refCode(B.refPrefix, 5);
      $('[data-bd-email]', done).textContent = String(data.get('email')).trim();
      var stage = String(data.get('stage'));
      $('[data-bd-stage]', done).textContent = has(B.stages, stage) ? B.stages[stage] : '';
      $('[data-bd-needs]', done).textContent = serviceNames(validServices(data.getAll('need').map(String)));
      var budget = String(data.get('budget'));
      $('[data-bd-budget]', done).textContent = has(B.budgets, budget) ? B.budgets[budget] : '';
      var timeline = String(data.get('timeline')), start = String(data.get('start'));
      var startText = has(B.timelines, timeline) ? B.timelines[timeline] : '';
      if (timeline !== 'exploring') {
        STARTS.forEach(function (s) { if (isoOf(s.day) === start) startText = shortDate(s.day) + ' (preferred)'; });
      }
      $('[data-bd-start]', done).textContent = startText;
      form.hidden = true;
      done.hidden = false;
      var heading = $('h2', done);
      heading.tabIndex = -1;
      heading.focus();
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      for (var n = 1; n <= total; n++) {
        var bad = check(n);
        if (bad) {
          if (n !== current) show(n, false);
          showSummary('Please answer the highlighted question to send your brief.');
          bad.focus();
          return;
        }
      }
      showDone(new FormData(form));
    });
    // Enter in a text field moves on instead of submitting early.
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && current < total) { e.preventDefault(); next.click(); }
    });
    syncTimeline();
    show(1, false);
  }

  /* ------------------------------------------------------------------
   * 14. Boot
   * ------------------------------------------------------------------ */
  function boot() {
    initMenu();
    initHeader();
    initYear();
    initStartDates();
    initWork();
    initCompare();
    initModelQuiz();
    initEstimator();
    initWeeks();
    initTeam();
    initClock();
    initRoles();
    initBrief();
    initReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
