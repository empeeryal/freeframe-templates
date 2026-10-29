# Garage documentation

## Overview

Garage is a complete website for an independent car repair garage, MOT test centre or mechanic, shown as
**Bellcrank Motor Works**, a fictional family-run garage in Spinners Yard, Kidderminster (UK). It has an open-now
status in UK time, filterable services with guide prices, a fixed-price service checker, a booking request with UK
number plate formatting, a drop-off calendar that skips Sundays and bank holidays and a courtesy car option, an MOT
due-date calculator with saved reminders, reviews, a team page, a searchable FAQ and directions. The look is bold
and mechanical: number-plate yellow on charcoal, condensed industrial type, chamfered "cut metal" corners, chequered
strips and technical SVG line drawings of cars and parts. This is the **HTML + Tailwind CSS v4** version (1.0.2):
plain HTML files, one stylesheet and one vanilla JavaScript file, with no build step needed to run it.

Nothing on the site goes out of date: opening status, drop-off days, bank holidays, review dates and MOT examples are
all worked out from today's date in UK time.

Live demo: [freeframe.dev/templates/garage](https://freeframe.dev/templates/garage)

## Quick start

1. Unzip the download.
2. Open `index.html` in a browser. Every page and feature works straight from the file system.

To preview it the way a host serves it, run any static server in the folder:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

You only need Node.js 24 (for `npm`) if you change `src/input.css` or add Tailwind classes that aren't used yet
(see [Building and deploying](#building-and-deploying)).

## Pages

| File | Purpose | Notable sections and features |
|------|---------|-------------------------------|
| `index.html` | Home | Hero with "Book an MOT", a registration quick form and an MOT inspection drawing; workshop status strip (open now, today's hours, workshop-day gauge, next free MOT drop-off); trust badges as text; headline prices; six service areas; how a job runs; MOT reminder teaser; reviews; booking call to action |
| `services.html` | Services | 22 jobs in six categories with guide prices, times and what's included; category filter (`?cat=`); price promise |
| `prices.html` | Price checker | Service type, fuel and engine size give a fixed guide price, an optional MOT add-on, what's included and time in the workshop; full price table |
| `book.html` | Booking request | Registration plate with live formatting, jobs with a running total, drop-off calendar and time slots, leave / wait / courtesy car, contact details, confirmation |
| `mot.html` | MOT reminder | Due date from the last test or first registration, earliest keep-your-date test day, countdown, timeline, saved reminders, the three MOT date rules |
| `reviews.html` | Reviews | Rating gauge, breakdown of the latest 12 reviews, job filter, sort, garage replies |
| `about.html` | About and team | Workshop elevation drawing, workshop rules, seven team members, history timeline, numbers |
| `faq.html` | FAQ | 16 questions in five groups with live search and highlighted matches (`?q=`) |
| `contact.html` | Contact and directions | Call / email / status cards, street map, directions, opening hours with today highlighted, upcoming closures, contact form (`?topic=`) |
| `404.html` | Not found | "This page has broken down" with links back |

## Project structure

```text
garage/
  index.html … contact.html, 404.html   the ten pages (header and footer repeated in each)
  assets/
    css/style.css        compiled Tailwind CSS (generated: don't edit by hand)
    js/main.js           all JavaScript: data, open status, price checker, booking, MOT reminder, filters
    img/favicon.svg      the bellcrank logo mark
    img/og-image.svg     source of the social image
    img/og-image.png     1200×630 social image used by og:image
    img/team/*.svg       seven team portraits
  src/input.css          Tailwind source: brand tokens (@theme), utilities and components
  package.json           npm scripts to rebuild the CSS
  README.md              short introduction
  DOCS.md                this guide
  CHANGELOG.md           version history
  LICENSE.txt            MIT license (in the download)
```

## Customising

### Brand and colours

All colours are tokens in the `@theme` block of `src/input.css`:

| Token | Default | Used for |
|-------|---------|----------|
| `--color-plate` | `#ffd21f` | Number-plate yellow: page heroes, buttons, accents on dark |
| `--color-plate-deep` | `#f0bf00` | Hover state of yellow buttons, link underlines |
| `--color-plate-soft` | `#fff1b0` | Selected tiles, today's row, hover fills |
| `--color-ink` | `#121316` | Text, borders, header, footer and dark panels |
| `--color-asphalt` / `--color-gunmetal` | `#1c1e22` / `#2c2f35` | Raised panels and rules on dark |
| `--color-steel` | `#545961` | Secondary text on paper and white (AA) |
| `--color-chrome` | `#b9bcc2` | Secondary text on dark (AA) |
| `--color-paper` / `--color-card` | `#f3f2ee` / `#ffffff` | Page background / cards and inputs |
| `--color-go`, `--color-stop`, `--color-ev` | green, red, plate green | Open and in-date, overdue and errors, EV badges |

Yellow is always a fill behind black text or an accent on black; never use it as text on white. To re-skin, change
the tokens and rebuild:

```css
@theme {
  --color-plate: #ff8a1f;      /* a racing orange instead of plate yellow */
  --color-plate-deep: #e57100;
  --color-plate-soft: #ffe3c7;
}
```

Some SVG drawings use the same colours as literal hex values (`#ffd21f`, `#121316`); search and replace them if you
change the palette.

### Typography

Three Google Fonts are loaded in the `<head>` of every page:

- **Saira Extra Condensed** (600–900) for headings, buttons and prices (`font-display`, `.display`)
- **Saira** (400–700) for body text (`font-sans`)
- **Chakra Petch** (500–600) for gauge readouts, labels and badges (`font-gauge`)

The families are set in `@theme` (`--font-display`, `--font-sans`, `--font-gauge`). To swap one, change the Google
Fonts link in each page and the token, then rebuild the CSS.

### Content

Text lives in the HTML pages. Data the scripts use lives at the top of `assets/js/main.js` (section 1):

| Constant | What it holds |
|----------|---------------|
| `TIME_ZONE` | `'Europe/London'`: every "today" and "now" uses this zone |
| `GARAGE` | Name and phone number used in messages |
| `HOURS` | Opening hours per weekday (`0` = Sunday … `6` = Saturday), `null` when closed |
| `WEEKDAY_SLOTS`, `DROP_OFF_SLOTS` | Drop-off times per weekday (`07:30`, `08:00`, `08:30`, `09:00`, `12:30` Monday–Friday; `08:00`–`09:00` Saturday) |
| `BOOK_AHEAD_DAYS` | Booking window: from tomorrow up to 28 days ahead |
| `COURTESY_CARS` | Size of the courtesy car fleet (2) |
| `MAX_WAIT_MINUTES` | Longest job list a customer can wait in the lounge for (90) |
| `EXTRA_CLOSED` | Days closed every year besides Sundays and bank holidays, as `{ md: 'MM-DD', label }` (Christmas Eve) |
| `CLOSE_ON_BANK_HOLIDAYS` | `true`: closed on bank holidays in England and Wales |
| `DEMO_SLOTS_TAKEN` | Share of drop-off slots the demo shows as taken (35%) |
| `JOBS` | Jobs on the booking form: `name`, `price`, `from`, `mins`, `level` (a service level), `needsNotes` |
| `MOT_WITH_SERVICE` | MOT price when booked with a service (£35) |
| `CATEGORIES` | Service filter ids and labels (must match `data-cat` and `data-filter` in `services.html`) |
| `ENGINE_BANDS`, `FUELS`, `SERVICE_TYPES` | The price checker's options and prices |
| `INCLUDED` | What each service includes, per service (`levels`) and fuel (`fuels`) |
| `REMINDER_LEADS`, `REMINDER_VIA`, `MAX_REMINDERS`, `DUE_SOON_DAYS` | MOT reminder options |

Service prices for the checker are `[small, mid, large]` engine bands per fuel; electric cars have one number:

```js
full: {
  name: 'Full service',
  price: { petrol: [219, 249, 289], diesel: [249, 279, 319], hybrid: [244, 274, 314], electric: 169 },
  mins: { engine: 180, electric: 120 }
},
```

If you change a price, update it in three places: `SERVICE_TYPES` (checker), the price table at the bottom of
`prices.html`, and any "from" prices in `services.html`, `index.html` and `JOBS`.

To add a job to the booking form, add it to `JOBS` and copy one of the `<label class="tile">` blocks in `book.html`
with the new `value`:

```js
const JOBS = {
  // …
  battery: { name: 'Battery replacement', price: 119, from: true, mins: 30 }
};
```

To add a service card, copy an `<li data-cat="…">` in `services.html`; the filter counts update themselves. Reviews
are `<li data-review data-rating="5" data-service="mot">` items in `reviews.html`; their dates are relative
(`<time data-days-ago="16">`), so they never look old. FAQ entries are `<details class="faq" data-faq>` blocks in
`faq.html`.

### Images and artwork

Every picture is SVG drawn for this template: the MOT inspection car on the home page, the brake assembly
(`services.html`), the tyre tread section (`prices.html`), the calendar and certificate (`mot.html`), the rating gauge
(`reviews.html`), the workshop elevation (`about.html`), the map (`contact.html`) and the broken-down car (`404.html`)
are inline in the pages; the team portraits are `assets/img/team/*.svg` (square, 200×200). To use photos instead, keep
a square crop for portraits and replace the inline drawings with `<img>` elements of a similar aspect ratio (roughly
2:1 for the car, 3:2 for the others).

The social image is `assets/img/og-image.png` (1200×630), generated from `og-image.svg`. The favicon is
`assets/img/favicon.svg` (the bellcrank mark, also inline in the header and footer).

### Navigation, header and footer

The header (top bar with status, address and phone; logo; menu; "Book an MOT"; mobile menu) and the footer are
repeated in every page. To add a page, copy an existing one, then add a link in the `<nav aria-label="Main">` list
and the `<nav aria-label="Mobile">` list of every page, and mark the current page's links with
`aria-current="page"`. The desktop menu shows from 1280px (`xl:`); below that the menu button opens the full-screen
mobile menu.

## Features

### Open status, today's hours and closures

`paintStatus()` runs on load and every minute. It reads the time in `TIME_ZONE` (`nowLondon()`) and `hoursOn(date)`
(the weekday's `HOURS`, or `null` on Sundays, bank holidays and `EXTRA_CLOSED` days), then fills:

- `[data-status]`: `data-state="open"` with "Open now · until 6pm" ("Closing soon · 6pm" in the last 30 minutes), or
  `data-state="resting"` with "Opens tomorrow at 7:30am", "Opens Monday at 7:30am" or "Christmas Day · Opens Monday
  at 7:30am". The site never shows a bare "Closed". Elements with `data-status-short` get a shorter text.
- `[data-today-hours]`: "Monday 7:30am–6pm", or "Sunday: day off" / "Monday: Summer bank holiday".
- `[data-hours-day="0…6"]` rows on `contact.html`: today's row gets `data-today` and `aria-current="date"`.
- `[data-rev]` (home page): a bar with one segment per half hour of today's opening, the current half hour lit, and
  a label ("3 hr 25 min of workshop time left today", "Doors open at 7:30am", "Day off today · back Monday 7:30am").
- `[data-next-mot]`: the first free drop-off from tomorrow ("Mon 19 Oct · 7:30am").
- `[data-closures="4"]` (contact page): the next four bank holidays and extra closed days that fall on opening days.

Times are written the British way: "7:30am", "6pm", "12:30pm".

### Bank holidays

`bankHolidays(year)` works out England and Wales bank holidays for any year: New Year's Day, Good Friday and Easter
Monday (from the Gregorian Easter date), the early May, spring and summer bank holidays, Christmas Day and Boxing Day,
with substitute weekdays when they fall at a weekend (for example 2026: Boxing Day is Saturday, so Monday 28 December
is the substitute). Set `CLOSE_ON_BANK_HOLIDAYS = false` to open on them, or add one-off days to `EXTRA_CLOSED`. For
Scotland or Northern Ireland, edit `bankHolidays()`.

### Number plates

`parsePlate(text)` accepts UK registrations in the current format (`AB12 CDE`), prefix (`A123 BCD`), suffix
(`ABC 123D`) and dateless (`1 ABC`, `ABC 1234`) formats, case and spaces optional, and returns
`{ ok, text, compact, kind, year }`. Every input with `data-plate-input` is reformatted as you type ("bc17kmr" becomes
"BC17 KMR"). For current-format plates `plateAge()` reads the age identifier: `02`–`50` is March of 2000 + n, `51`–`99`
is September of 2000 + n − 50 (`17` = March 2017, `67` = September 2017). The booking form uses it to say when the
first MOT is due. The check is about format only; it doesn't look the car up.

### Price checker

`[data-price-checker]` on `prices.html`. Choose the service (`mot`, `interim`, `full`, `major`), fuel (`petrol`,
`diesel`, `hybrid`, `electric`) and engine band (`small`, `mid`, `large`). The price comes from `SERVICE_TYPES`;
engine size is disabled for electric cars and the MOT. "Add an MOT for £35" adds `MOT_WITH_SERVICE`. The panel shows
the total ("£279" for a full service on a 1.4 to 2.0 litre diesel, "£314" with the MOT), the lines, the time in the
workshop, the "N items included" list from `INCLUDED`, and "Book this", which links to `book.html?service=full,mot`.
The wording always says "guide price, including VAT" and explains what it covers.

URL parameters: `?service=`, `?fuel=`, `?engine=` (each checked with an own-key test against the data) and `?mot=1`.
They override the saved choice (see [Saved data](#saved-data-localstorage)). The total is a polite live region.

### Booking request

`[data-booking]` on `book.html`:

- **Registration**: required, must pass `parsePlate()`. The note under it explains the plate's age.
- **Jobs**: at least one; only one service level (interim, full or major) at a time. "A fault or a noise" needs notes
  of 10+ characters. The summary shows each job's price and the guide total ("from £204" for a full service and MOT:
  £169 + £35 + "from").
- **Calendar**: from the Monday of this week to the Sunday after the last bookable day. Days before tomorrow, after
  `BOOK_AHEAD_DAYS`, Sundays, bank holidays, `EXTRA_CLOSED` days and fully booked days are disabled with the reason in
  their label. Arrow keys move by day and week, Home/End to the week's ends. Only one day is in the tab order.
- **Slots**: `DROP_OFF_SLOTS` for the weekday; `slotTaken(date, time)` marks the demo's taken slots with a stable hash
  of the date and time (about `DEMO_SLOTS_TAKEN`% of them). Replace `slotTaken()` with your real diary.
- **While we work**: "Wait in the lounge" is only enabled when the jobs add up to `MAX_WAIT_MINUTES` or less;
  "Courtesy car" shows how many of `COURTESY_CARS` are left on the chosen day (`courtesyLeft()`, also a demo hash) and
  is disabled when none are ("1 courtesy car left on Tue 20 Oct").
- **Details**: name, UK phone (`07…`, `01…` or `+44…`) and email.

On success it shows a reference (`BC-MMDD-` plus the plate's last three characters), the date and slot, and says
Lorna will call within one working day to confirm the time and the fixed price (as the page already promises; change
both if yours differs). `?service=mot,full` (job ids from `JOBS`, own-key checked) and `?reg=` prefill the form.

### MOT reminder

`[data-mot-form]` on `mot.html` works out:

- **Due date**: from the last test, a year less a day (`motDueFromTest()`: tested 3 November 2025, due 2 November
  2026; tested 29 February 2024, due 28 February 2025); for a newer car, the third anniversary of registration
  (`motDueFromRegistration()`: registered 29 February 2024, due 28 February 2027).
- **Earliest keep-your-date test**: a month minus a day before the due date (`earliestKeepDate()`: due 15 May, earliest
  16 April).
- **Countdown and state**: "16 days to go", "1 day to go", "Due today", "Overdue by 3 days"; `In date`, `Due soon`
  (`DUE_SOON_DAYS` = 30 days or fewer) or `MOT expired`, with a warning when expired.
- **Reminder date**: the due date minus the chosen lead (`REMINDER_LEADS`: 7, 14 or 28 days).

The date must be a real date, not in the future and not more than three years back (for a newer car, the car must not
be past its first MOT). "Save reminder" also needs a valid plate and an email or a UK mobile, then adds the reminder to
"Your reminders" (newest first, one per plate, at most `MAX_REMINDERS`). Remove buttons delete them. `?reg=` prefills
the plate. The status line then says when the reminder will be sent ("We’ll remind you by email on …"), or to book now
if that date has passed. This is general guidance on the usual rules; the page says so.

### Services filter

Buttons with `data-filter` filter the `[data-cat]` cards in `[data-services]`, update the counts, set
`aria-pressed`, and keep the choice in the URL (`?cat=brakes-tyres`) with `history.replaceState`. Unknown `?cat=`
values are ignored (own-key check against `CATEGORIES`).

### Reviews

Relative dates come from `data-days-ago`. The breakdown and average are counted from the reviews on the page. The job
filter and sort (newest, highest, lowest) reorder the list; the count reads "Showing 1 review" / "Showing 3 reviews".

### FAQ search

`[data-faq-search]` filters `[data-faq]` items as you type (every word must match), hides empty groups, opens matching
answers, highlights matches with `<mark>` in text only, and shows "1 question matches …" / "3 questions match …" or a
"Nothing matches" box. `?q=` prefills the search.

### Header, mobile menu, scroll reveals and back to top

The mobile menu button has `aria-expanded`/`aria-controls`, Esc closes it and returns focus. Elements with `.reveal`
fade up once as they scroll into view (instantly with reduced motion). The back-to-top button is the separate block
at the end of `main.js`; sticky panels marked `data-back-to-top-hide` hide it while it would cover them.

## Forms

| Form | Where | Validates |
|------|-------|-----------|
| Quick MOT | `index.html` `[data-quick-mot]` | UK registration; goes to `book.html?service=mot&reg=…` |
| Booking request | `book.html` `[data-booking]` | Plate, jobs, notes for faults, day and slot, transport, name, UK phone, email |
| MOT reminder | `mot.html` `[data-mot-form]` | Plate, date, email or UK mobile |
| Contact | `contact.html` `[data-contact-form]` | Name, email, optional plate, message (10+ characters); `?topic=` preselects the subject |

Errors appear under each field (`[data-error="name"]`) with `aria-invalid` and focus moves to the first problem. The
confirmations read as if the form had been sent: the contact one promises a reply from Lorna within one working day
and shows a short reference (`BC-` and four characters, made in the browser; use your form service's own reference
instead if it returns one). **The forms don't send anything until you connect them.** To connect one, post it where the comment in `main.js` says, for example with
Formspree:

```js
// in the booking submit handler, before showing the confirmation
fetch('https://formspree.io/f/your-id', {
  method: 'POST',
  body: new FormData(form),
  headers: { Accept: 'application/json' }
}).then((res) => {
  if (!res.ok) throw new Error('Send failed');
  // show the confirmation here
});
```

The booking form's day and slot aren't inputs, so add them before sending:
`const data = new FormData(form); data.append('date', state.date); data.append('slot', state.slot);`. MOT reminders
need a service that sends scheduled emails or texts (your CRM, or a form service that forwards to one).

## Saved data (localStorage)

| Key | Shape | Validated on read |
|-----|-------|-------------------|
| `garage:quote` | `{ "service": "full", "fuel": "diesel", "engine": "mid", "mot": true }` | Each value must be an own key of `SERVICE_TYPES`, `FUELS` or `ENGINE_BANDS`; `mot` must be a boolean. Anything else falls back to the defaults (full, petrol, 1.4 to 2.0 litres, no MOT). |
| `garage:reminders` | `[{ "reg": "BC17KMR", "due": "2026-11-02", "lead": 14, "via": "email" }]` | Must be an array; each `reg` must pass `parsePlate()`, `due` must be a real `YYYY-MM-DD` date, `lead` an own key of `REMINDER_LEADS`, `via` of `REMINDER_VIA`; duplicates by plate are dropped and the list is cut to `MAX_REMINDERS`. The cleaned list is written back. |

Contact details are not stored. All storage goes through one `safeStorage` object: `localStorage`, or an in-memory
stand-in when the browser blocks storage (a sandboxed iframe, strict privacy settings), so the checker and reminders
keep working for the page view. To reset, remove the reminders on `mot.html` or run
`localStorage.removeItem('garage:reminders')` in the browser console.

### URL parameters

| Parameter | Page | Values |
|-----------|------|--------|
| `?at=2026-10-19T10:30` | every page | Preview the site at a UK date and time (status, slots, MOT countdowns) |
| `?cat=` | `services.html` | A `CATEGORIES` id |
| `?service=`, `?fuel=`, `?engine=`, `?mot=1` | `prices.html` | Price checker choices |
| `?service=mot,full`, `?reg=AB12CDE` | `book.html` | Jobs to tick and the plate |
| `?reg=` | `mot.html` | The plate |
| `?q=` | `faq.html` | Search words (first 80 characters) |
| `?topic=` | `contact.html` | `booking`, `quote`, `mot`, `collection` or `other` |

Ids are always checked with `Object.prototype.hasOwnProperty.call(...)`, so `?service=constructor` or
`?cat=__proto__` are ignored.

## SEO and sharing

Each page has its own `<title>`, meta description, Open Graph tags and `theme-color` in its `<head>`, with
`lang="en-GB"`. After deploying, change `og:image` to an absolute URL (for example
`https://www.yourgarage.co.uk/assets/img/og-image.png`), since social sites don't read relative image paths. Add a
`sitemap.xml` and `robots.txt` at the site root if your host doesn't generate them. For local search, consider adding
`AutoRepair` structured data (JSON-LD) with your address, phone and opening hours to `index.html` and `contact.html`.

## Accessibility

- Skip link, landmarks, one `<h1>` per page and a logical heading order.
- Visible focus outlines everywhere; chamfered buttons drop their clipped corners while focused so the outline shows.
- Filter chips and calendar days use `aria-pressed`; disabled days explain why in their label; the calendar uses a
  roving tabindex with arrow keys, Home and End.
- Results, counts and confirmations are live regions (`role="status"` / `aria-live="polite"`); form errors use
  `aria-invalid` and `aria-describedby`.
- Drawings have `role="img"` with a `<title>`; decorative portraits have empty `alt`.
- Colour contrast meets WCAG AA; yellow is only used behind black text or on black.
- Scroll reveals, the menu underline and smooth scrolling respect `prefers-reduced-motion`.

When editing, keep one `<h1>` per page, give every new input a `<label>`, and keep `aria-describedby` ids in step
with the error elements.

## Building and deploying

### Rebuilding the CSS

The compiled `assets/css/style.css` is included. If you add Tailwind classes or change `src/input.css`:

```sh
npm install
npm run build    # or: npm run watch
```

Tailwind finds classes in the HTML and in `assets/js/main.js`; write class names in full (not built from pieces).

### Deploying

Upload the folder to any static host: Netlify Drop, Cloudflare Pages, GitHub Pages, Vercel or your own server. No
server code is needed. Leave out `src/`, `package.json` and `node_modules/` if you like; the site only needs the HTML
files and `assets/`.

## Troubleshooting

- **The status says "Open now" when you're shut.** Check `HOURS`, `EXTRA_CLOSED` and `CLOSE_ON_BANK_HOLIDAYS` in
  `assets/js/main.js`. Times are in UK time (`TIME_ZONE`), whatever the visitor's own time zone.
- **A bank holiday is missing or wrong.** `bankHolidays()` follows the usual England and Wales rules; one-off extra
  holidays (a coronation, a jubilee) need adding to `EXTRA_CLOSED` or the function.
- **Prices don't match between pages.** Prices live in `SERVICE_TYPES` and `JOBS` (JavaScript) and in the HTML of
  `prices.html`, `services.html` and `index.html`; update them together.
- **Every slot is free or every day is full.** The demo availability is `slotTaken()` and `courtesyLeft()`; set
  `DEMO_SLOTS_TAKEN` to `0` or connect your booking diary there.
- **A plate is rejected.** `parsePlate()` accepts the standard UK formats only; Northern Ireland and personalised
  formats outside them need another pattern added.
- **Reminders disappear after closing the tab.** The browser is blocking storage (private mode, a sandboxed iframe);
  the site falls back to memory for that page view.
- **A form shows its confirmation but nothing arrives.** It sends nothing until you connect it; see [Forms](#forms).
  Saved MOT reminders are only kept in the browser until you connect a service that sends them.
- **New Tailwind classes have no effect.** Rebuild the CSS (`npm run build`).
- **The social preview has no image.** Make `og:image` an absolute URL after deploying.

## License

MIT. The code and all included artwork are free for personal and commercial use; the full text is in `LICENSE.txt`,
included in the download. Saira, Saira Extra Condensed and Chakra Petch are licensed under the SIL Open Font License.
Bellcrank Motor Works, its staff, customers and reviews are fictional.
