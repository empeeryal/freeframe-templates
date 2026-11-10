# Sidecar documentation

## Overview

Sidecar is a multi-page website for a product and engineering studio, an agency that startups hire to design,
build and launch their first product. The fictional Sidecar is a 14-person studio on South Main Street in Little
Rock, Arkansas, working in Central time (`America/Chicago`) with seed-stage founders across the US. The site is
plain HTML5 with Tailwind CSS v4 and vanilla JavaScript, with no dependencies and no build step needed to view it.
This guide covers version 1.0.0. The template page, with a link to the live demo, is at
[freeframe.dev/templates/sidecar](https://freeframe.dev/templates/sidecar).

The look is a workshop build log: warm paper with a faint engineering grid, ink outlines with hard offset
shadows, one green accent ("Sidecar green"), masking tape, stamped labels and handwritten margin notes. Type is
Recursive (sans for text, its monospaced setting for labels) with Architects Daughter for the notes. It is a
light-only design.

## Quick start

1. Unzip the download.
2. Open `index.html` in a browser, or serve the folder with any static server:

   ```sh
   python3 -m http.server 8080
   ```

   Then visit `http://localhost:8080`.
3. Edit the HTML pages and `assets/js/data.js`, then reload.

Requirements: a modern browser. Google Fonts load from the internet. Node 24 is needed only to rebuild the CSS
after adding Tailwind classes (see [Building and deploying](#building-and-deploying)).

## Pages

| File | Purpose | Notable sections and features |
|------|---------|-------------------------------|
| `index.html` | Home | Hero with a sketch-to-shipped drawing, drawn client logos, three services, featured work, 12-week ruler, founder quotes, next open start dates |
| `work.html` | Work | Eight projects from `CASES`, filters by service and stage, grid or list layout, all kept in the URL |
| `case-study.html` | Case study (Brineworks) | Project facts, the problem, a sketch-versus-shipped compare slider, what shipped, a 14-week timeline, results and a quote |
| `services.html` | Services | Product design, engineering and launch in detail, three engagement models, a three-question model helper, FAQ |
| `pricing.html` | Pricing and estimator | Engagement estimator (services, team size, weeks, sprint or retainer) with a price range and sample timeline, what is included, payment terms |
| `process.html` | Process | The 12-week plan as week tabs, founder hours chart, weekly rhythm, handoff list |
| `about.html` | About | Studio numbers, four values, the team of 14 with drawn portraits and a group filter, the studio with a live Little Rock clock |
| `careers.html` | Careers | Benefits, six open roles with discipline and location filters and expanding details, hiring steps |
| `contact.html` | Start a project | Five-step project brief with validation and a success panel, next open start dates |
| `404.html` | Not found | Links back and a drawn "cut from v1" sketch |

## Project structure

```text
sidecar/
  index.html, work.html, case-study.html, services.html, pricing.html,
  process.html, about.html, careers.html, contact.html, 404.html
  assets/
    css/style.css        compiled Tailwind CSS (generated; do not edit by hand)
    js/data.js           content and settings (window.SIDECAR): projects, prices, weeks, roles, team, brief options
    js/main.js           all interactions, in numbered sections
    img/favicon.svg      the logo mark
    img/og-image.svg     social image source (1200×630)
    img/og-image.png     social image used by og:image
    img/work/*.svg       one drawing per project (640×420), used on the home, work and case study pages
  src/input.css          Tailwind source: theme tokens and a small component layer
  package.json           npm scripts to rebuild the CSS
  README.md              short introduction
  DOCS.md                this guide
  CHANGELOG.md           version history
```

## Customizing

### Brand and colors

All colors are tokens in the `@theme` block of `src/input.css`, so Tailwind generates `bg-paper`, `text-pine`,
`border-ink` and so on from them.

| Token | Value | Used for |
|-------|-------|----------|
| `--color-paper` / `--color-paper-2` | `#f5f0e4` / `#ece5d4` | Page background / alternate bands |
| `--color-card` | `#fcfaf4` | Sheets and cards |
| `--color-ink`, `--color-ink-soft`, `--color-ink-faint` | `#1d1b16`, `#4b463b`, `#625c4e` | Text, outlines and hard shadows |
| `--color-line` / `--color-line-strong` | `#d6ccb6` / `#8b8271` | Hairlines / inputs |
| `--color-pine` / `--color-pine-deep` | `#17663f` / `#0f4a2d` | The accent: buttons, links, notes, focus / hover |
| `--color-sprout` / `--color-sprout-soft` | `#86d6a0` / `#dcecd8` | Light green fills with ink text, selected choices |
| `--color-tape` / `--color-tape-soft` | `#f1d867` / `#f7ebb4` | Masking tape, highlighter, the price on dark |
| `--color-night`, `--color-mist` | `#1d1b16`, `#cfc6b1` | Footer and dark bands, text on them |
| `--color-danger` | `#a3361a` | Form errors |

To change the accent, edit `--color-pine` and `--color-pine-deep`, then rebuild the CSS. A few drawings use the hex
values directly (`#17663f`, `#86d6a0`, `#f1d867`); search the HTML and `assets/img/` for them if you change the
palette completely.

```css
@theme {
  --color-pine: #1f5f8b;
  --color-pine-deep: #174766;
}
```

The repeated pieces live in `@layer components`: `.sheet` and `.sheet-lift` (ink-outlined cards with an offset
shadow), `.tape`, `.stamp`, `.marker`, `.grid-paper` (the engineering grid), buttons (`.btn-primary`,
`.btn-outline`, `.btn-night`), `.chip`, `.filter-btn`, `.seg`, `.choice`, `.wk-tab` and the form fields.

### Typography

Two Google Fonts families are loaded with one `<link>` in every page's `<head>`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Architects+Daughter&amp;family=Recursive:wght,CASL,MONO@400..800,0..1,0..1&amp;display=swap" />
```

- **Recursive** (`--font-sans`) is a variable font. Headings use a little of its casual axis (`CASL`); the `mono`
  utility in `src/input.css` switches on its monospaced axis (`MONO 1`) for labels, chips and numbers; `casual`
  sets `CASL 0.5` (the wordmark).
- **Architects Daughter** (`--font-hand`, class `font-hand` or `.hand`) is for margin notes and quotes in pen.

To swap fonts, change the `<link>` on every page and the two `--font-*` tokens, then rebuild the CSS. If the new
sans has no `MONO` axis, point the `mono` utility at a monospaced family instead.

### Content

Text that is the same on every visit is in the HTML. Everything the scripts render is in `assets/js/data.js`:

| Constant | What it holds |
|----------|---------------|
| `STUDIO` | Name, city, `timeZone` (`America/Chicago`), phone, emails and studio `hours` (Mon–Fri, 09:00–17:30) |
| `SERVICES`, `SERVICE_ORDER` | `design`, `engineering`, `launch`: names and the `rate` per person-week ($4,500, $5,000, $4,000) |
| `STAGES`, `STAGE_ORDER` | `pre-seed`, `seed`, `series-a` |
| `CASES` | The eight projects on `work.html` |
| `ESTIMATE` | Estimator settings: team sizes, weeks range, defaults, sprint and retainer multipliers, hints |
| `PHASES` | Phases of the estimator's sample timeline, with weights |
| `MODELS` | The three engagement models suggested by the helper on `services.html` |
| `START_RULE` | How the next open start dates are worked out |
| `WEEKS` | The 12 weeks on `process.html` |
| `DISCIPLINES`, `MODES`, `ROLES` | Open roles on `careers.html` |
| `TEAM`, `TEAM_GROUPS` | The 14 people on `about.html` and their drawn portraits |
| `BRIEF` | Labels for the brief form and the budget ranges used to match an estimate |

To add a project, add an object to `CASES` and a 640×420 drawing (or image) at `assets/img/work/<id>.svg`:

```js
{
  id: 'ferrylog', name: 'Ferrylog', what: 'Crew scheduling for river ferries',
  city: 'Helena, AR', stage: 'seed', services: ['design', 'engineering'], weeks: 10, team: 3, year: 2026,
  summary: 'One or two sentences about the problem and what we did.',
  shipped: ['First thing shipped', 'Second thing', 'Third thing'],
  metric: { value: '3×', label: 'faster crew changes' }
}
```

Add `page: 'your-case.html'` to link a full case study. To add a role, copy an entry in `ROLES` (`discipline` must
be a key of `DISCIPLINES`, `mode` a key of `MODES`). To add a team member, copy an entry in `TEAM`; the portrait
settings are `skin` 0–4, `hair` 0–5 (crop, side part, bob, long, curls, bun), `hairColor` 0–4, `glasses` and
`bg` 0–3.

### Images and artwork

All artwork is SVG drawn for this template: the hero sketch and phone, client wordmarks and service drawings on the
home page, the workbench on `services.html`, the studio front on `about.html`, the compare slider screens on
`case-study.html` and the 404 sketch are inline SVG in the pages. The eight project drawings are files in
`assets/img/work/` (640×420, shown at a 64:42 ratio); they load as `<img>`, so their text uses the system sans
rather than the web fonts. To use screenshots instead, keep the same ratio or change `aspect-[64/42]` in
`main.js` (`workCard`) and on the pages.

Team portraits are drawn by `drawAvatar()` in `main.js` from the `TEAM` settings. To use photos, replace the
`drawAvatar(p, i)` call in `initTeam()` with an `<img>`.

The social image is `assets/img/og-image.png`, generated from `og-image.svg`. After editing the SVG, regenerate it
(the Freeframe repository has `scripts/og-png.mjs`; any SVG-to-PNG tool at 1200×630 works). The favicon is
`assets/img/favicon.svg`.

### Navigation, header and footer

The header, mobile menu and footer are repeated in every HTML file. To add a page, copy an existing one, change its
`<title>`, description, `data-page` on `<body>` and `aria-current="page"` on its own link, and add a link to
the `<ul>` in the header (`.nav-link`), the mobile menu (`.m-link`) and the footer on every page.

## Features

### Next open start dates

Shown on the home page, `work.html` (`data-start-date`, `data-start-open`), `pricing.html` and `contact.html`
(`data-start-list`, the start date select). `startDates()` in `main.js` reads `START_RULE`:

- the first Monday at least `leadDays` (21) days after today in Central time,
- then every `everyWeeks` (4) weeks, `count` (3) dates in all,
- a start between `closed.from` and `closed.to` (Dec 19 to Jan 3, inclusive) moves to the first Monday after it,
- `openings` `[1, 2, 2]` gives "1 of 2 pods open", "2 of 2 pods open"... by position.

On Nov 10, 2026 this gives Monday, Dec 7, 2026; Monday, Jan 4, 2027; Monday, Feb 1, 2027. On Nov 10, 2027:
Dec 6, 2027; Jan 10, 2028 (Jan 3 is in the break); Feb 7, 2028. See [Keeping the demo current](#keeping-the-demo-current).

### Work filters and layout

`initWork()` renders `CASES` into `[data-work-list]`. The service buttons (`data-filter-service`) and stage buttons
(`data-filter-stage`) combine (a project must match both); the count reads "Showing 2 of 8 projects". The Grid and
List buttons (`data-view`) switch the layout; the choice is saved in `sidecar:work-view`. Filters and layout live in
the URL so a filtered view can be linked:

| Parameter | Values | Default |
|-----------|--------|---------|
| `service` | `design`, `engineering`, `launch` | all |
| `stage` | `pre-seed`, `seed`, `series-a` | all |
| `view` | `grid`, `list` | saved choice, else `grid` |

For example `work.html?service=launch&stage=seed` shows Brineworks and Mulecart. Unknown values are ignored. When
nothing matches, a message with "Show all projects" appears. Filter buttons use `aria-pressed`, and the count is a
live region.

### Compare slider

On `case-study.html` a range input (`[data-compare-range]`, 0–100, starting at 50) clips the sketch layer
(`[data-compare-top]`, `clip-path: inset(0 <100-v>% 0 0)`) and moves the divider. It works with arrow keys and
announces "50% sketch".

### Engagement model helper

On `services.html`, three yes/no questions (`scope`, `engineers`, `team`) suggest a model from `MODELS` once all
three are answered: wanting a team within a year with no engineers on staff suggests **Build to hire**; otherwise a
clearly scoped release suggests **Fixed sprint**; otherwise **Monthly retainer**. The matching model card gets a
green shadow, and the link opens the estimator with that model.

### Engagement estimator

`initEstimator()` on `pricing.html`. Inputs: services (checkboxes, at least one; unchecking the last one keeps it
and shows "Pick at least one service"), team size (2 to 6), weeks (range 4 to 24, step 2) and the payment model
(Fixed sprint or Monthly retainer, `aria-pressed` buttons). The math, in `computeEstimate()`:

- rate = the average `SERVICES[...].rate` of the services picked,
- **fixed sprint**: total = rate × people × weeks; shown as total × 0.9 to total × 1.15, each rounded to $1,000,
- **retainer**: monthly = rate × people × 4 × 0.9 (10% off); shown as monthly × 0.95 to × 1.05, rounded to $500,
  for max(3, ceil(weeks ÷ 4)) months, with the total for those months.

| Settings | Shows |
|----------|-------|
| Design + Engineering, 3 people, 12 weeks, sprint (the default) | $154,000 to $197,000; 3 people for 12 weeks at $4,750 per person-week |
| Same, retainer | $48,500 to $54,000 a month; every 4 weeks for 3 months: $145,500 to $162,000 in total |
| All three services, 4 people, 16 weeks, sprint | $259,000 to $331,000 at $4,500 per person-week |
| Launch only, 4 people, 4 weeks, sprint | $58,000 to $74,000 |

The sample timeline (`planPhases()`) shares the weeks among `PHASES` that apply (Discovery and Handoff always,
Design, Build and Launch when that service is picked) by weight, largest remainder first, at least one week each;
if there are more phases than weeks, Handoff and then Discovery are dropped. The default reads Discovery weeks
1–2, Design 3–5, Build 6–11, Handoff week 12. Dates start on the next open start date and end on the Friday of the
last week (start + weeks × 7 − 3 days): Dec 7 to Feb 26 for the default on Nov 10, 2026.

Settings are saved in `sidecar:estimate` and written to the URL (`?services=design,engineering&team=3&weeks=12&model=sprint`),
so an estimate can be shared. The URL wins over the saved settings. "Send this with a project brief" opens
`contact.html` with the same parameters; "Reset the estimator" clears both. The yellow note says it is an estimate,
not a quote; keep it.

### The 12-week plan

`initWeeks()` on `process.html` builds 12 tabs (`role="tab"`, arrow keys, Home and End) from `WEEKS` and fills one
panel: phase, title, text, who is on it, what you get and the founder hours with a bar. The founder hours chart has
one button per week; selecting a bar opens that week. The total reads "39 hours in total, about 3.3 a week".
`#week-5` in the URL opens week 5, and the hash follows the selected week.

### Team and studio clock

`initTeam()` draws the 14 portraits and filters them by `group` (`lead`, `design`, `engineering`, `launch`), with
a count such as "5 people in engineering". `initClock()` writes "It is 10:42 a.m. in Little Rock. The studio is
open." from `STUDIO.hours`, every 30 seconds, with "opens at 9:00 a.m.", "done for the day" or "out for the
weekend" outside hours.

### Open roles

`initRoles()` on `careers.html` renders `ROLES` with filters by discipline (`data-role-discipline`) and location
(`data-role-mode`), kept in the URL as `?discipline=engineering&mode=hybrid` (2 open roles). "Read the role"
expands the details (`aria-expanded`, `aria-controls`); the open role goes into the hash (`#role-mobile-engineer`),
so a link opens that role.

### Menu, header and motion

The menu button (`#menu-toggle`) opens the mobile menu with `aria-expanded`; Escape closes it. Elements with
`.reveal` fade in once as they scroll into view, and everything above them is revealed too. With
`prefers-reduced-motion: reduce` there is no reveal, underline drawing or smooth scrolling.

### Keeping the demo current

Nothing dated goes stale:

- **Start dates** follow `START_RULE` from today in Central time (above). Change `leadDays`, `everyWeeks`,
  `closed` or `openings` in `data.js` to match your real calendar. For fixed dates on a real site, replace the
  body of `startDates()` with a list, for example
  `return [{ day: dayNumber(2027, 3, 1), open: 1 }, { day: dayNumber(2027, 4, 5), open: 2 }];`.
- **Estimator dates** start on the first open start date.
- **The copyright year** (`data-year`) is filled in the browser.
- **The studio clock** uses the current Central time.
- Past content keeps its real dates: project years in `CASES` and "Since 2019".

The HTML contains the text for Nov 10, 2026, so the page reads correctly before the script runs. A preview
parameter pretends it is another moment in Central time, for reviews: `contact.html?now=2027-11-10T09:00`. It is
controlled by `ALLOW_NOW_PARAM` at the top of `main.js`; set it to `false` on a live site if you prefer.

## Forms

The project brief on `contact.html` (`[data-brief]`) has five steps: Stage, Need, Budget, Timing and You. "Next"
validates the current step and shows inline errors:

| Step | Rules | Message |
|------|-------|---------|
| Stage | one of `stage` | "Pick the stage that fits best." |
| Need | at least one `need`; `about` 20 characters or more (1,200 max, with a counter) | "Pick at least one: design, engineering or launch." / "Tell us what you are building." / "Tell us a little more: at least 20 characters." |
| Budget | one of `budget` | "Pick a range, or “Not sure yet”." |
| Timing | one of `timeline`; `start` (the next open start dates or "I’m flexible", hidden for "Just exploring") | "Pick when you would like to start." |
| You | `name`, `email` (valid), `company`; `role` optional | "Tell us your name." / "We need an email to reply to." / "Enter an email like name@company.example." / "Which company is this for?" |

Opened from the estimator (`?services=…&team=…&weeks=…&model=…`), it ticks the services, picks the budget range
the estimate's middle falls in (`BRIEF.budgetCaps`: up to $75,000, $150,000, $300,000, then more) and shows a note:
"From the estimator: Design and Engineering, 3 people for 12 weeks, fixed sprint, $154,000 to $197,000."

On success the form is replaced by "Thanks, Leilani. Your brief is in." with a reference (`SC-` and five
characters), a summary and what happens next. The demo does not send anything until you connect it. To use a form
service such as Formspree, change the submit handler in section 13 of `main.js`:

```js
fetch('https://formspree.io/f/your-id', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
  .then(function (r) {
    if (r.ok) showDone(new FormData(form));
    else showSummary('Something went wrong. Please try again.');
  });
```

Show the success panel only when the service answers OK. The model helper on `services.html` and the estimator
are calculators and send nothing.

## Saved data (localStorage)

All storage goes through `safeStorage` in `main.js`, which falls back to memory when localStorage is blocked
(private modes, sandboxed frames), so the features keep working for the visit.

| Key | Shape | Validation |
|-----|-------|------------|
| `sidecar:estimate` | `{ v: 1, services: ['design', 'engineering'], team: 3, weeks: 12, model: 'sprint' }` | `v` must be 1; services must be keys of `SERVICES` (at least one), `team` in `teamSizes`, `weeks` in range and on the step, `model` `sprint` or `retainer`; otherwise the defaults are used |
| `sidecar:work-view` | `'grid'` or `'list'` | anything else means grid |

"Reset the estimator" removes `sidecar:estimate`. To clear everything, remove both keys in the browser's developer
tools (Application > Local Storage). All values read from the URL are checked with own-key lookups, so
`?service=toString` is ignored.

## SEO and sharing

Each page has its own `<title>`, meta description, Open Graph tags and `theme-color` in its `<head>`. `og:image`
points at `assets/img/og-image.png`; on a live site make it absolute
(`https://your-domain.example/assets/img/og-image.png`). Add a `sitemap.xml` and `robots.txt` at the root when you
deploy, and consider `Organization` or `ProfessionalService` structured data with the studio's address.

## Accessibility

- Skip link, landmarks, one `<h1>` per page and a logical heading order.
- Visible focus outlines in Sidecar green; choice cards show focus from their input.
- Filters and toggles use `aria-pressed`; the week tabs follow the tabs pattern with arrow keys; role details use
  `aria-expanded` and `aria-controls`; counts and results are live regions.
- Form errors are linked with `aria-describedby` and fields get `aria-invalid`; the success heading receives focus.
- Drawings are `role="img"` with a description, or hidden when decorative.
- Text colors meet WCAG AA on paper, cards and the dark bands; `prefers-reduced-motion` turns animation off.

When editing, keep one `<h1>` per page, label every new input and keep data in `data.js` so the scripts and the
markup agree.

## Building and deploying

The compiled CSS is committed. After adding Tailwind classes to the HTML or `main.js`, rebuild it (Node 24):

```sh
npm install
npm run build    # or: npm run watch
```

Upload the folder to any static host: Netlify Drop, GitHub Pages, Cloudflare Pages or your own server. All links
are relative, so it also works from a subfolder.

## Troubleshooting

- **Fonts look plain.** Google Fonts need an internet connection; check the `<link>` in the page `<head>`.
- **New classes have no effect.** Rebuild the CSS (`npm run build`). Classes built from pieces in JavaScript are
  not detected; write class names out in full.
- **The estimator opens with old settings.** The URL or `sidecar:estimate` wins over the defaults. Use "Reset the
  estimator", or open `pricing.html` without parameters after clearing storage.
- **Start dates look wrong for my calendar.** Edit `START_RULE` in `data.js`, or hard-code dates in `startDates()`.
- **The brief says "received" but nothing arrives.** The demo form is not connected; see [Forms](#forms).
- **Project drawings show a different font.** They load as `<img>`, which cannot use web fonts; inline the SVG if
  you need the page fonts.

## License

MIT. The code and all included artwork are free for personal and commercial use; see `LICENSE.txt` in the
download.

Recursive and Architects Daughter are provided by Google Fonts under the SIL Open Font License.

Sidecar, its clients, founders and team are fictional; the client marks are original drawings, not real logos.
