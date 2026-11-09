# Slatework documentation

## Overview

Slatework is a multi-page marketing website for a recruiting software company: an applicant tracking system (ATS)
for companies with 50 to 1,000 employees. The fictional Slatework, Inc. is based in Lexington, Kentucky, and works
in Eastern time. The site is plain HTML5 with Tailwind CSS v4 and vanilla JavaScript, with no dependencies and no
build step needed to view it. This guide covers version 1.0.0. The template page, with a link to the live demo,
is at [freeframe.dev/templates/slatework](https://freeframe.dev/templates/slatework).

The look is corporate and structured: white paper with hairline grids, a deep indigo brand color, a marigold
highlight, Hubot Sans headings and Fira Sans body text, with a full dark theme.

## Quick start

1. Unzip the download.
2. Open `index.html` in a browser, or serve the folder (any static server works):

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
| `index.html` | Home | Live pipeline board with funnel and projected time to hire, customer logos, six feature pillars, interactive scorecard, results, testimonials, call to action |
| `product.html` | Product tour | Job board picker and posting preview, stage rules, weighted scorecard, panel scheduler, offer pay band check, SVG report charts |
| `pricing.html` | Pricing | Monthly / yearly switch, three plans, cost and cost-per-hire calculator, comparison table, billing FAQ |
| `customers.html` | Customer stories | Industry and company size filters, eight stories with logo marks, before-and-after charts and quotes |
| `integrations.html` | Integrations | Search, category filters with counts, 22 integrations with drawn marks, detail dialog, API example |
| `security.html` | Security and compliance | Controls, data retention example, voluntary self-ID reporting, subprocessors table |
| `resources.html` | Resources | Most-read list, rolling monthly webinars with registration, six dated articles with a topic filter |
| `demo.html` | Book a demo | Validated request form, plan preselected from pricing, success panel with a reference and proposed meeting time |
| `404.html` | Not found | Links to the main pages and a drawn board illustration |

## Project structure

```text
slatework/
  index.html, product.html, pricing.html, customers.html,
  integrations.html, security.html, resources.html, demo.html, 404.html
  assets/
    css/style.css      compiled Tailwind CSS (generated; do not edit by hand)
    js/data.js         content and settings: candidates, plans, customers, integrations, posts...
    js/main.js         all interactions, in numbered sections
    img/favicon.svg    the logo mark
    img/og-image.svg   social image source (1200×630)
    img/og-image.png   social image used by og:image
  src/input.css        Tailwind source: color tokens, theme, small component layer
  package.json         npm scripts to rebuild the CSS
  README.md            short introduction
  DOCS.md              this guide
  CHANGELOG.md         version history
```

## Customizing

### Brand and colors

Colors are CSS variables at the top of `src/input.css`: `:root` holds the light theme and `.dark` the dark theme.
`@theme inline` maps them to Tailwind names, so `bg-brand`, `text-ink-soft` or `border-line` follow the theme.

| Token | Light | Used for |
|-------|-------|----------|
| `--paper` | `#ffffff` | Page and card background |
| `--canvas` | `#f4f4f1` | Alternate bands, board columns |
| `--line` / `--line-strong` | `#dddfd7` / `#878b7f` | Hairlines / inputs and chart axes |
| `--ink`, `--ink-soft`, `--ink-faint` | `#15171e`, `#454955`, `#595d69` | Text |
| `--brand` / `--brand-strong` | `#3a3fd0` / `#2b2fa8` | Buttons, links, focus |
| `--applied`, `--screen`, `--interview`, `--offer`, `--hired` | stage colors | Board dots, chips, funnel bars |

Fixed colors that don't change with the theme (the night band, `marigold`) are in the `@theme` block.

To change the brand color, edit both themes and rebuild:

```css
:root { --brand: #0f6b5c; --brand-strong: #0b5649; --brand-soft: #e3f3ef; --brand-line: #b9e0d6; }
.dark { --brand: #7fd6c3; --brand-strong: #a6e5d7; --brand-soft: #12302a; --brand-line: #24584d; }
```

The logo mark in each page header and footer, `favicon.svg` and `og-image.svg` use `#3a3fd0` directly; change
them too.

### Typography

Headings use **Hubot Sans** (variable width, set wider with `font-stretch: 112%`) and body text **Fira Sans**.
Both load from Google Fonts with a `<link>` in each page's `<head>`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,500;0,600;1,400&amp;family=Hubot+Sans:wdth,wght@100..125,500..800&amp;display=swap" />
```

The families are set as `--font-display` and `--font-sans` in `src/input.css`. To swap fonts, change the link on
every page and those two variables, then rebuild the CSS. Hubot Sans draws its zero with a bar; that is the
font's design.

### Content

Page text is in the HTML files. Everything interactive reads from `assets/js/data.js`, which returns one object,
`window.SLATEWORK`. The main structures:

| Constant | What it holds |
|----------|---------------|
| `STAGES` | The five pipeline stages, in order: `applied`, `screen`, `interview`, `offer`, `hired` |
| `REQ` | The requisition shown on the board (title, `openings: 2`) |
| `STAGE_BASE` | Candidates in each stage not shown as cards: `applied: 38, screen: 9, interview: 3, offer: 0, hired: 0` |
| `CANDIDATES` | Board cards: `id`, `name`, `source`, `age` (days since applying), starting `stage`, avatar `hue`, optional `score` |
| `STAGE_REMAINING`, `TIME_TO_HIRE_TARGET` | Time-to-hire projection (`offer: 4`, `hired: 0`; target 30 days) |
| `COMPETENCIES`, `RATING_LABELS`, `RECOMMENDATIONS` | Scorecard competencies, weights and default ratings; score thresholds |
| `BOARDS`, `POSTING_LOCATIONS` | Job boards with 30-day price and typical applicants; posting locations |
| `INTERVIEWERS`, `WORK_HOURS`, `SCHEDULE_*`, `DISPLAY_ZONES` | Scheduler panel, working hours, busy blocks and time zones |
| `OFFER_BAND` | Pay band, slider range and approval rules for the offer check |
| `PLANS`, `ANNUAL_DISCOUNT`, `MIN_EMPLOYEES`, `MAX_EMPLOYEES`, `ENTERPRISE_HINT`, `DEFAULT_PRICING` | Pricing |
| `INDUSTRIES`, `SIZES`, `CASES` | Customer story filters and stories |
| `INT_CATEGORIES`, `INTEGRATIONS` | Integration categories and directory entries |
| `RETENTION`, `DEFAULT_RETENTION` | Data retention choices on the security page |
| `TOPICS`, `POSTS` | Article topics and articles (fixed past dates) |
| `WEBINAR_*` | Webinar rule, time and topics |
| `PERSONAL_DOMAINS`, `COMPANY_SIZES`, `DEMO_LEAD_DAYS`, `DEMO_TIMES` | Demo form checks and proposed meeting time |

Example: add an integration. Give it a unique `id`, an existing `category`, a tile color and a small mark drawn
in white inside a 40×40 box:

```js
{ id: 'shiftnote', name: 'Shiftnote', category: 'messaging', bg: '#0f766e', setup: '2 minutes', direction: 'One-way',
  blurb: 'Post interview reminders to the hiring team channel.',
  syncs: ['Interview reminders', 'Scorecard due alerts'],
  mark: '<circle cx="20" cy="20" r="9" fill="#fff"/>' }
```

Category counts, search and the detail dialog pick it up automatically. Update the count in the page's meta
description and the static "22 integrations" line if you want them exact before JavaScript runs.

Example: add a customer story to `CASES` with `industry` set to a key of `INDUSTRIES` and `size` to `s`, `m` or
`l`. `metrics[0]` draws the before-and-after chart. The home page logo row and testimonials were written into
`index.html` from the same data; edit them there by hand if you change customers.

### Images and artwork

All artwork is inline SVG drawn for this template: feature pillar icons, report charts, the security and 404
illustrations, and the integration and customer marks (in `data.js`, as `mark` strings). There are no photos.
If you add photos, keep the existing aspect ratios: avatars are square, case study marks 40×40.

The social image is `assets/img/og-image.png` (1200×630), rendered from `og-image.svg`. After editing the SVG,
regenerate the PNG with any SVG renderer, or with the Freeframe repository's `scripts/og-png.mjs`. The favicon is
`assets/img/favicon.svg`.

### Navigation, header and footer

The header and footer are repeated in every HTML page. To add a page, copy an existing one, change its `<title>`,
description, `data-page` on `<body>` and `<main>` content, and add a link to the desktop menu
(`nav[aria-label="Main"]`), the mobile menu (`#mobile-menu`) and the footer in every page. Mark the current page
with `aria-current="page"` on its menu links.

### Dark mode

The theme button in the header toggles the `dark` class on `<html>` and saves the choice as `slatework:theme`. A
short script in each page's `<head>` applies the saved choice, or the visitor's system setting, before the page
paints. To make light the default regardless of the system setting, remove the `matchMedia(...)` check from that
script on every page. To remove dark mode, delete the button and the head script; the `.dark` variables can stay.

## Features

### Hero pipeline board

`index.html`, section 5 of `main.js` (`initPipeline`). The board shows the requisition `REQ` with five columns from
`STAGES`. Each column's count is `STAGE_BASE[stage]` plus the cards in it.

- **Drag and drop:** with a mouse or pen, drag a card anywhere; on touch screens, drag by the card's initials
  (`data-grip`), so swiping the board still scrolls it. The board scrolls sideways when you drag near its edge.
  Escape cancels a drag.
- **Keyboard and screen readers:** each card has a "Move" button (`data-move`) that opens a menu of stages
  (`role="menu"`; arrow keys, Home, End, Escape). Choosing a stage moves the card, returns focus to it and
  announces the new count and time to hire.
- **Funnel:** "reached" counts each stage plus every later stage. With the starting data: Applied 61, Screen 19,
  Interview 7, Offer 2, Hired 1, so Applied to Hired is 1.6%.
- **Projected time to hire:** the average of `age + STAGE_REMAINING[stage]` over cards in Offer and Hired,
  rounded. Start: Keziah W. (27 + 0) and Esmeralda P. (19 + 4) give **25 days**, "5 days under the 30-day target".
  Moving Ramona D. (age 16) to Offer makes Offer **2** and time to hire **23 days**. Then dragging Esmeralda P. to
  Hired makes Hired **2**, "2 of 2 openings filled" and time to hire **22 days**.
- Moves are saved (`slatework:pipeline`); "Reset board" restores the starting data. Moved cards go to the top of
  their new column.

### Interview scorecard

`index.html` and `product.html`, `initScorecards`. Every `[data-scorecard]` panel lists `COMPETENCIES` with 1–4
rating buttons (`role="radio"`, arrow keys change the rating). The weighted score is
`sum(weight × rating) / 100`. The defaults (4, 3, 3, 2, 4 with weights 30, 25, 20, 15, 10) give **3.25, Hire**.
Rating Product knowledge 4 gives **3.55, Strong hire**. Thresholds in `RECOMMENDATIONS`: 3.5 Strong hire, 2.75 Hire,
2.0 No hire, below that Strong no hire. The home page version (`data-compact`) hides the interview prompts.

### Job boards and posting preview

`product.html#sourcing`, `initBoards`. Checking boards updates the board count, the 30-day cost and typical
applicants. Default: careers page, Hirewire and Openroles, **3 boards, $0, 60 applicants**; adding Talentcast makes
**$179, 76**. The posting preview follows the title, location and pay range fields, and flags a maximum below the
minimum.

### Panel scheduler

`product.html#scheduling`, `initScheduler`. For each of the next `SCHEDULE_DAYS` (5) weekdays after today in
Eastern time, it intersects every chosen interviewer's working hours (`WORK_HOURS`, 9:00 a.m. to 5:00 p.m. in
their own zone) minus their `busy` blocks, then proposes up to `SCHEDULE_PROPOSALS` (3) non-overlapping slots on
30-minute steps, at most two per day. Busy blocks are tied to business day numbers (0 = the first weekday after
today), so the demo never runs out of dates. Times are shown in the visitor's zone by default; "Show times in"
switches between US zones, and each slot lists every interviewer's local time.

With the default panel (Estelle, Renzo, Vittorio), 60 minutes, on Monday, November 9, 2026, the slots in Eastern
time are Tue, Nov 10, 12:30–1:30 PM; Wed, Nov 11, 3:00–4:00 PM; and Wed, Nov 11, 4:00–5:00 PM. Adding Ursula gives
Wed 3:00 PM, Wed 4:00 PM and Thu, Nov 12, 1:00 PM.

### Offer pay band check

`product.html#offers`, `initOffer`. The slider runs from `OFFER_BAND.sliderMin` to `sliderMax`. Inside the band
($68,000–$84,000) only the hiring manager approves; below it the people team is added; above it the VP and
Finance are added (`OFFER_BAND.rules`).

### Pricing and calculator

`pricing.html`, `initPricing`. Monthly prices per employee are in `PLANS` (Essentials $5, Growth $8); yearly
billing takes `ANNUAL_DISCOUNT` (20%) off: $4 and $6.40. Companies under `MIN_EMPLOYEES` (50) are billed as 50.
The calculator shows the monthly cost, the yearly cost and the cost per hire.

| Inputs | Result |
|--------|--------|
| 200 employees, Growth, yearly, 40 hires (default) | $1,280 a month, $15,360 a year, $384 per hire, saves $3,840 |
| Same, monthly | $1,600 a month, $19,200 a year, $480 per hire |
| 30 employees, Growth, monthly | $400 a month (billed as 50) |
| 800 employees, Essentials, yearly, 100 hires | $3,200 a month, $38,400 a year, $384 per hire, Enterprise hint shown |

The choice is saved (`slatework:pricing`). URL parameters override it: `?billing=monthly|annual`,
`?plan=essentials|growth`, `?employees=1–1000`, `?hires=1–2000`. The "Book a demo with this estimate" link
passes `plan` and `employees` to `demo.html`.

### Customer stories

`customers.html`, `initCustomers`. Industry buttons and a company size select filter `CASES`; the URL keeps them as
`?industry=` (a key of `INDUSTRIES`) and `?size=s|m|l`. Financial services shows 2 of 8; with 201–500 employees,
1 (Pellworth); 501–1,000 employees alone shows 4.

### Integrations directory

`integrations.html`, `initIntegrations`. Search matches name, description and category; category buttons show
counts (HRIS and payroll 4, Calendars and video 4, Job boards 6, Background checks 2, Assessments 2,
E-signature 2, Messaging 2). The URL keeps `?category=` and `?q=`. Each card opens a `<dialog>` with what syncs;
Escape or Close returns focus to the card.

### Data retention example

`security.html#retention`, `initRetention`. Choosing 12, 24 or 36 months (`RETENTION`) shows the date a
candidate rejected today would be anonymized, and the reminder date a month earlier, worked out from today in
Eastern time.

### Webinars and articles

`resources.html`, `initResources`. Webinars follow a rule: the second Thursday of each month at 1:00 p.m. Eastern
(`WEBINAR_TIME`), the next `WEBINAR_COUNT` (3) at least `WEBINAR_MIN_DAYS` (3) days away. The topic cycles through
`WEBINAR_TOPICS` by month. Times also show in the visitor's zone. Articles in `POSTS` keep their real dates and
can be filtered by topic (`?topic=`); each expands in place.

### Menu, header and motion

The mobile menu button toggles `#mobile-menu` (`aria-expanded`, Escape closes). Sections with `reveal` fade in
once as they scroll into view; with reduced motion they show immediately, and drag animations are turned off.

### Keeping the demo current

Nothing dated goes stale. All "upcoming" dates are computed from today in Eastern time (`COMPANY.timeZone`):

| Content | Rule | Switch |
|---------|------|--------|
| Interview slots | Next 5 weekdays after today | Busy blocks use business day numbers |
| Webinars | Second Thursday of the month, at least 3 days away | `WEBINAR_DATES = null`; set an array of `'YYYY-MM-DD'` strings for fixed dates |
| Proposed demo time | First weekday at least `DEMO_LEAD_DAYS` (1) after today, at 10:00 a.m. or 2:00 p.m. Eastern | `DEMO_TIMES` |
| Retention example | Today plus 12, 24 or 36 months | |
| Copyright year | Current year | `[data-year]` |

Articles keep their fixed past dates. For reviews and screenshots, `?now=YYYY-MM-DDTHH:MM` (read as Eastern
time) pretends it is another moment; turn it off with `ALLOW_NOW_PARAM = false` at the top of `main.js`.

## Forms

All forms validate in the browser with inline messages linked by `aria-describedby`, focus the first problem and
then show a success panel. No form sends anything until you connect it.

| Form | Page | Checks | Success |
|------|------|--------|---------|
| Demo request (`data-demo-form`) | `demo.html` | Names, work email (format, and not a personal domain from `PERSONAL_DOMAINS`), company, role, size | "Thanks, {name}. Your demo request is in.", reference `SW-XXXXXX`, proposed time in the visitor's zone and in Eastern, next steps |
| Webinar registration (`data-webinar-form`) | `resources.html` | Name, email | Registration reference `WB-XXXXX` and the session time |

`demo.html` also reads `?plan=essentials|growth|enterprise&employees=` to preselect the plan and company size, and
`?topic=security` to tick "Security and reporting".

To connect a form service such as Formspree, add the request inside `setupForm` in `main.js` (section "Form
helper"), where it calls `onSuccess`, and show the success panel only when the service answers OK:

```js
fetch('https://formspree.io/f/your-id', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
  .then(function (r) { if (r.ok) { /* run the existing success code */ } else { /* show an error */ } });
```

## Saved data (localStorage)

All storage goes through `safeStorage` in `main.js`, which falls back to memory when the browser blocks
localStorage, so the page keeps working for the visit.

| Key | Shape | Validation |
|-----|-------|------------|
| `slatework:theme` | `"light"` or `"dark"` | Anything else is ignored |
| `slatework:pipeline` | `{ "v": 1, "stages": { "ramona": "offer", ... }, "order": ["ramona", ...] }` | Unknown candidates or stages are dropped; missing cards keep their starting stage |
| `slatework:pricing` | `{ "billing": "annual", "employees": 200, "plan": "growth", "hires": 40 }` | Each field checked against its allowed values and range |

Clear them with "Reset board", or from the browser's developer tools (Application → Local Storage).

## SEO and sharing

Each page has its own `<title>`, meta description and Open Graph tags in its `<head>`. `og:image` points at
`assets/img/og-image.png` with a relative URL; set it to an absolute URL on your domain when you deploy
(`https://www.example.com/assets/img/og-image.png`), since most social sites require that. Add a `sitemap.xml`
and `robots.txt` at your site root if your host doesn't create them.

## Accessibility

- Skip link, landmarks, one `<h1>` per page and `aria-current="page"` in the menus.
- Visible focus outlines, AA contrast in both themes, and reduced motion respected.
- The pipeline board has a full keyboard path (Move menu) and announces changes in a live region.
- Scorecard ratings are radio groups; filters use `aria-pressed`; the integration dialog is a native `<dialog>`.
- Keep one `h1` per page, label new inputs, and keep the Move menu if you change the board.

## Building and deploying

The compiled CSS is included. After adding Tailwind classes, rebuild it (Node 24):

```sh
npm install
npm run build    # or: npm run watch
```

Classes used only inside JavaScript strings must appear in a file Tailwind scans (the HTML pages and
`assets/js/*.js` are scanned automatically).

To deploy, upload the folder to any static host: Netlify Drop, GitHub Pages, Cloudflare Pages or your own server.
There is no server code.

## Troubleshooting

- **New classes have no effect:** rebuild the CSS with `npm run build`.
- **The board keeps an old arrangement:** it's saved in `slatework:pipeline`; click "Reset board".
- **Scheduler shows no slots:** the panel has no shared time in the next five weekdays. Check `busy` blocks and
  `WORK_HOURS` in `data.js`, or pick a shorter interview.
- **Dates look a day off:** dates are computed in Eastern time. Change `COMPANY.timeZone` in `data.js` for another
  home zone.
- **Fonts look different offline:** Hubot Sans and Fira Sans come from Google Fonts and need a connection.
- **Saved choices don't persist in a preview frame:** some sandboxed frames block storage; the site then keeps
  state in memory for the visit only.

## License

MIT. The code and all included artwork are free for personal and commercial use; see `LICENSE.txt` in the
download.

Hubot Sans and Fira Sans are provided by Google Fonts under the SIL Open Font License.

Slatework, its customers, integrations, interviewers and people are fictional; the integration and customer marks
are original drawings, not real logos.
