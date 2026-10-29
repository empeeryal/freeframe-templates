# Sonata documentation

## Overview

Sonata 1.0.0 is a standalone HTML + Tailwind CSS v4 website for Sonata Music Rooms, a fictional independent music school in Tiverton, Devon. It includes twelve courses, six tutors, twenty-four weekly sessions, a tuition calculator, a guided enrolment enquiry and a saved practice planner. See the [template page](https://freeframe.dev/templates/sonata) for the live preview and available downloads.

## Quick start

Open `index.html` in a modern browser. The compiled CSS, JavaScript and artwork are included (fonts load from Google Fonts); there is no installation step for viewing the site.

For a local HTTP preview, run this command in the downloaded folder:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. A server is useful for testing storage and form integrations. The site's relative links also work when opened directly from the filesystem.

Editing existing copy needs only a text editor. Rebuilding Tailwind after adding utilities requires Node 24 and npm:

```sh
npm install
npm run build
```

Use `npm run watch` during development. Do not upload `node_modules` to your static host.

## Pages

| File | Purpose | Features |
| --- | --- | --- |
| `index.html` | School introduction | Featured courses, teaching approach, introduction price and the term new starters join |
| `courses.html` | Course catalogue | Instrument, age, level and text filters; saved shortlist |
| `course.html` | Course detail | Outcomes, term outline, tutor, prices and matching weekly sessions |
| `tutors.html` | Teaching team | Six biographies, instrument filter and expandable teaching notes |
| `timetable.html` | Weekly planning | This or the next teaching week with term dates; day, instrument, age, level and tutor filters (collapsed behind a Filter button on small screens); session enquiry links |
| `fees.html` | Tuition information | Group, individual and flexible-pass calculator; bursaries and policies |
| `enrol.html` | Enrolment enquiry | Four steps, age matching, first lesson and pro-rata tuition, then a confirmation with a reference |
| `approach.html` | School philosophy | School history, learning guidance and saved weekly practice planner |
| `contact.html` | Visits and enquiries | Location illustration, access, opening hours and a message form with a confirmation |
| `404.html` | Missing page | Useful links back to the home page and course catalogue |

The default course on `course.html` is Piano, from the Beginning. Use `course.html?id=little-keys` to link directly to a different course.

## Project structure

```text
sonata/
  index.html                 Home page
  courses.html               Course filters and shortlist
  course.html                Data-driven course detail
  tutors.html                Data-driven teaching team
  timetable.html             Weekly session filters
  fees.html                  Lesson calculator
  enrol.html                 Enrolment wizard
  approach.html              Teaching approach and practice planner
  contact.html               Access, hours and message form
  404.html                   Recovery page
  assets/
    css/style.css            Compiled Tailwind CSS; committed output
    js/main.js               Data, date rules and all interactions
    img/                     Course art, page illustrations, tutor portraits and social image
  src/input.css              Tailwind import, theme tokens and shared components
  package.json               CSS build and watch commands
  template.json              Catalogue metadata
  README.md                  Quick introduction
  DOCS.md                    This guide
  CHANGELOG.md               Template release history
```

`template.json` is catalogue metadata and may be omitted from a production upload. The download process supplies `LICENSE.txt` separately.

## Customising

### Brand and colours

The brand palette lives in the `@theme` block of `src/input.css`:

| Token | Purpose |
| --- | --- |
| `--color-paper` | Warm page background |
| `--color-ink` | Main text and solid buttons |
| `--color-muted` | Secondary text |
| `--color-vermillion` | Warm accent and validation errors |
| `--color-celadon` | Green teaching and information panels |
| `--color-lilac` | Purple panels and tutor backgrounds |
| `--color-butter` | Yellow timetable and calculator panels |
| `--color-line` | Quiet borders |

For example, change the accent and rebuild:

```css
--color-vermillion: #a93430;
```

Focus outlines and illustration colours also use literal colours in `src/input.css` and `assets/img/*.svg`. Update those when changing the palette. Preserve sufficient text contrast, especially on tinted backgrounds.

### Typography

Headings use Lora (regular and italic, weights 400–700); body copy and controls use Asap (weights 400–700). Both load from Google Fonts through the `<link>` tags in the `<head>` of every page, with `preconnect` hints and `display=swap`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Asap:wght@400..700&amp;family=Lora:ital,wght@0,400..700;1,400..700&amp;display=swap" />
```

`--font-display` and `--font-sans` in `src/input.css` select the families. Keep their generic fallbacks. To change fonts, update the link in every page and the two tokens, rebuild the CSS and regenerate the social PNG in the new fonts. To self-host instead (for example for privacy), download the files, add `@font-face` rules to `src/input.css` and remove the links.

### Content

General copy is in the HTML pages. Catalogue and interaction data is in `assets/js/main.js`.

| Constant | Contents |
| --- | --- |
| `TUTORS` | Six keyed tutor biographies, subjects, interests and access notes |
| `COURSES` | Twelve keyed courses with prices, levels, outcomes, term outlines and practice tasks |
| `SESSIONS` | Twenty-four recurring sessions with course, weekday, time, room and places |
| `SESSION_MAP` | Derived lookup of sessions by stable ID |
| `FAMILY_LABELS` | Instrument identifiers and display labels |
| `AGE_LABELS` | Child, teen and adult labels |
| `LEVEL_LABELS` | Beginner, developing and confident labels |
| `EXPERIENCE` | Starting-point choices in the enrolment review |
| `CONTACT_TOPICS` | Contact form topic labels |
| `LESSON_FORMATS` | Group, 30-minute and 45-minute individual tuition |
| `MINUTE_OPTIONS` | Allowed daily practice lengths |
| `DAY_OPTIONS` | Valid weekday numbers |

A session entry looks like this:

```js
{ id: 'lk-mon', course: 'little-keys', day: 1, time: '16:00', room: 'Piano Room', places: 2 }
```

Weekdays are `1` for Monday through `6` for Saturday. Sunday is `0` in practice plans. Keep session IDs unique, course IDs valid, and sessions inside the school's opening hours.

To add a course, duplicate a complete object in `COURSES`, change its key, and fill every field. The required fields are `title`, `family`, `keywords`, `tutor`, `age`, `ageText`, `level`, `minutes`, `price`, `subtitle`, `description`, `outcomes`, `weeks`, `bring` and `practice`. `featured: true` includes it on the home page.

Add matching entries to `SESSIONS`. A course without sessions cannot produce a useful enrolment preference. `tutor` must match an existing `TUTORS` key; `family`, `age` and `level` must match the label maps.

Age labels are broad filters. A course's more specific range, such as ages 4–7, lives in `ageText`. Review individual suitability with the family before confirming a place.

### Images and artwork

Each course has its own SVG in `assets/img`, named after its course key: `little-keys.svg`, `piano-first.svg`, `piano-next.svg`, and so on. Course cards and details use that key to choose the illustration. Cards use a 4:3 frame; keep a similar aspect ratio when replacing them.

Three page illustrations are used once each: `hero.svg` (the teaching room on the home page, 760 × 420), `courtyard.svg` (the building on `approach.html`) and `off-beat.svg` (the toppled metronome on `404.html`).

Tutor portraits use each tutor's key as the filename, such as `rhoswen.svg`. Keep those paths aligned with `TUTORS` and course references. The portraits are original illustrations, not photographs.

The location guide is an inline SVG in `contact.html`. Update its accessible title when changing the drawing. It is deliberately a simple location guide rather than a navigation map.

`og-image.svg` is the editable 1200 × 630 social-image source. `og-image.png` is the file social networks need. Render it in a browser that has loaded Lora and Asap (for example by opening the SVG inside a page with the Google Fonts link and taking a 1200 × 630 screenshot) and check the result visually. `favicon.svg` is the small musical-note mark.

### Navigation, header and footer

Header and footer markup is repeated in every HTML file. Update every copy when adding a page, changing hours or replacing contact information. Keep links relative, including `.html` extensions.

Use `aria-current="page"` on the active primary and mobile navigation links. The course detail page intentionally does not claim to be the course catalogue page.

The mobile menu uses `#menu-toggle` and `#mobile-menu`. Do not change one without updating the JavaScript selector and `aria-controls` reference.

The footer's copyright year is filled using the current Europe/London calendar date. Replace the fictional business notice with your own appropriate business information before launching.

## Features

### Course discovery

`courses()` reads `COURSES` and populates `#course-grid`. Filters combine instrument, age, level and a case-insensitive text search over each course's title, subtitle, description, instrument label, tutor name and `keywords` (for example `violin`, `viola`, `fiddle`, `kit`). Add the words people search for to `keywords`.

`#course-count` announces the number of matching courses. A designed empty state appears when no course matches. The Clear filters button restores the complete catalogue.

| URL parameter | Allowed values |
| --- | --- |
| `instrument` | A key from `FAMILY_LABELS` |
| `age` | `child`, `teen`, `adult` |
| `level` | `beginner`, `developing`, `confident` |
| `q` | Text search, limited to 100 characters |
| `id` | A course key on the detail page |

Invalid lookup values are ignored using own-property checks, so values such as `constructor` cannot select an inherited property. Search text is inserted through escaped rendering or input values.

### Shortlist

`readSaved()`, `toggleSaved()` and `updateSaved()` manage course bookmarks. Bookmark controls expose `aria-pressed`; the catalogue shortlist provides a separate Remove action and term-price comparison.

Removing a shortlist entry moves focus to the next available Remove control or a remaining course bookmark. All saves pass through `safeStorage`; the feature remains usable within the page if storage is blocked.

### Tutor matching

`tutors()` filters `TUTORS` using `?instrument=` and the instrument select. Biographies explain teaching style, interests and possible adaptations. Native disclosure controls reveal more detail and are keyboard accessible.

The course catalogue and enrolment flow use the same tutor keys. Changing a tutor requires updating the relevant course references and portrait filename.

### Weekly timetable

`timetable()` combines the five select filters, groups matching sessions by weekday, and sorts each day by start time. A session card links to the enrolment flow with both `?course=` and `?session=`.

The `places` field is editorial availability information, shown as "N places left". It is not connected to an inventory service; places are confirmed by the school and enquiries do not decrement availability.

Each weekday heading shows its date in the displayed teaching week. When a date is a bank holiday (Good Friday, Easter Monday, the early May and spring bank holidays can fall in term), the heading says so and that there are no lessons that day.

The filter parameters are `day` (`1` Monday to `6` Saturday, from `DAY_OPTIONS`), `instrument`, `age`, `level` and `tutor`. Values must match their own maps; anything else, including `day=0`, falls back to all. Below the `lg` breakpoint the filters are collapsed behind `#filters-toggle` (`aria-expanded`/`aria-controls`), which also shows how many filters are on. Counts are announced through `#schedule-count`. An empty result includes a direct way to ask for an individual lesson.

### Dates and teaching terms

All business dates use `TIMEZONE = 'Europe/London'`. Date labels use British English. Calendar arithmetic uses UTC at noon after determining the school's local date, avoiding daylight-saving drift.

| Setting | Default | Behaviour |
| --- | --- | --- |
| `TERM_DATES` | `null` | `null` works out terms from `TERM_RULES` for any year; or a list of your real terms |
| `TERM_RULES` | Spring, Summer, Autumn | Half-term Monday for each term: on or after 12 February, last Monday in May, last Monday in October |
| `TERM_WEEKS` | `10` | Teaching weeks (lessons) per term |
| `INTRO_PRICE` | `12` | Introduction cost and tuition credit |

Each term is eleven calendar weeks: five teaching weeks, a half-term week with no lessons, then five more, so a term starts five weeks before its half-term Monday and ends on the Saturday of week eleven. On 19 October 2026 that gives an autumn term of 21 September – 5 December 2026 with half-term 26–30 October, a spring term from 11 January 2027 and a summer term from 26 April 2027. `bankHolidays(year)` computes Good Friday and Easter Monday (from `easterSunday()`) and the two May bank holidays; the school is closed on them.

Derived values, all worked out from today's date in Europe/London:

| Value | Meaning |
| --- | --- |
| `CURRENT_TERM` | The term running today, or `null` between terms |
| `NEXT_TERM` | The next term to start (used by the fee calculator) |
| `WEEK_START` | The Monday of this week while lessons run (Monday to Saturday), otherwise the next teaching week after half-term or a holiday |
| `JOIN_DATE` | When new starters join: the next teaching Monday, or the next term's first Monday when fewer than three teaching weeks are left |
| `lessonsFrom(day)` | A new starter's lesson dates on that weekday from `JOIN_DATE` to the end of the term, skipping half-term and bank holidays |

The timetable header shows "This teaching week", "Lessons resume after half-term" or "Next teaching week", the term's dates and half-term, and "New starters join from …". The home page pill shows the joining term and date. Course pages show each session's first lesson for a new starter. A new starter pays only for the lessons left in the term.

For a real school, set `TERM_DATES` to your terms (each `start` and `halfTerm` is a Monday):

```js
const TERM_DATES = [
  { name: "Spring", start: "2027-01-11", halfTerm: "2027-02-15" },
  { name: "Summer", start: "2027-04-26", halfTerm: "2027-05-31" },
];
```

Keep the list running into the future; once every listed term has ended the site has no next term to show. One-off closures other than the bank holidays above are not computed; list them in your confirmation emails or add them to `bankHolidays()`.

To preview another date, run the template check with a fixed clock, for example `pnpm templates:check --clock 2027-10-19T10:00Z sonata`.

### Tuition calculator

`calculateFee()` drives `fees()`, which prices a full ten-week term or pass (the enrolment flow prices the lessons left in the joining term instead). Group tuition uses the selected course's `price`; individual lessons use `LESSON_FORMATS`. For a group the result is headed with the course title; for individual lessons it reads "Individual <instrument> lessons" with the course's tutor and the lesson length. The introduction-credit line only appears when the credit applies. Term results name the next term's start and note that new starters part-way through a term pay only for the lessons left.

A term is ten lessons. A flexible pass is six individual lessons, valid for twelve weeks. Group tuition cannot be purchased as a flexible pass; the option is disabled and the calculator returns to a term when Group is selected.

Examples:

| Choice | Calculation | Total |
| --- | --- | --- |
| Adult beginner piano group | 10 × £22 | £220 |
| Same group with introduction credit | £220 − £12 | £208 |
| Individual 30-minute flexible pass | 6 × £30 | £180 |
| Individual 45-minute term with credit | 10 × £43 − £12 | £418 |

URL parameters are `course`, `format`, `plan` and `credit`. Formats must be a key from `LESSON_FORMATS`, plans are `term` or `pass`, and credit is applied only for `credit=yes`. Totals update in the polite live region `#fee-result`.

The calculator's individual formats are comparisons. For group tuition, the action carries the course into the group enrolment enquiry. For individual tuition, it changes to Ask about individual lessons and opens the contact page, because individual slots are arranged with the school.

### Guided enrolment

`enrolment()` owns four steps: course and starting point, weekly session, contact and learner details, then review. Each course has one tutor, shown as text in step two (`#enrol-tutor`); the session list only offers that course's sessions, with places left.

The optional `?session=` is accepted only when its stable ID exists and belongs to the selected course. Changing course resets tutor and session choices. The chosen age group must match the course's broad age category.

Continue validates the current step. The details step validates name, email, learner's first name and age group, with inline errors and focus on the first invalid field. Back retains in-page values. Each successful step change focuses its heading and announces the current step.

Step two works out the first lesson (`lessonsFrom(session.day)`) and the tuition for the lessons left in the joining term: lessons × the course price, less `INTRO_PRICE` when the learner books an introduction first (it is credited) or has already paid for one. "I have paid for an introduction" is only offered when "Discuss a full ten-week term" is chosen, so the credit can't be applied twice. `#wizard-status` announces the step in a neutral style; errors appear next to their fields.

Send your enquiry (`#enrol-submit`, step four) checks every step again, then hides the form and shows `#enrol-done`: "Request received · ref SM-1234", the learner, course, session, first lesson and tuition, and that the school will reply to the given email. The reference comes from `reference()`; replace it with the one your form service or database returns. Nothing claims an email has been sent.

Personal contact and learner details are not saved in localStorage; they exist only in the current page.

### Practice planner

`practice()` lets a learner choose a course, daily minutes and at least one practice day. Its suggested tasks come from that course's `practice` array.

The plan shows the weekly minutes and a button for each selected day. Completion controls use `aria-pressed`, preserve focus after toggling, and announce the number completed through `#practice-progress`. Clear plan removes the saved entry and returns focus to the course control.

`PRACTICE_WEEK_START` is the Monday of the current local calendar week, independent of the school term. Completion resets when that week changes. The underlying selected days, course and minutes remain available. Re-saving a plan intentionally starts its completion count again.

### Shared navigation and motion

`shared()` handles menu state, Escape, dates, bookmark event delegation and scroll reveals. Escape closes the mobile menu and returns focus to its toggle. Moving to the desktop breakpoint also closes it.

The IntersectionObserver reveals visible content and everything above it. Reduced-motion users see content without the transition. If observers are unavailable, content is visible by default.

## Forms

As shipped, no form sends data, reserves a place or processes payment: the enrolment enquiry and the contact form validate, then show a confirmation with a reference number on the page. Both handlers have a comment marking where to send the data. Connect a form service (below) before going live, and show the confirmation only after it accepts the submission.

### Contact form validation

`contact()` handles `#contact-form`. It requires a name with at least two characters, a plausible email address and a message of at least fifteen characters. Inputs have length limits. The topic is selected from `CONTACT_TOPICS`.

Errors are linked with `aria-describedby` and fields expose `aria-invalid`. On success the form is hidden and `#contact-done` shows "Message received · ref SM-1234" with the sender's first name, topic and email; Send another message (`#contact-again`) resets the form.

### Connecting a form service

Create an endpoint with your form provider, and add its real URL to the contact form:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="post" novalidate>
```

In `contact()`, at the comment after successful validation and before the confirmation is shown, send the form to your endpoint. Make the submit event listener `async`:

```js
const form = event.currentTarget;
const response = await fetch(form.action, {
  method: 'POST',
  body: new FormData(form),
  headers: { Accept: 'application/json' }
});
if (!response.ok) throw new Error('The enquiry could not be sent.');
```

Wrap that request in `try`/`catch`, disable the submit button while pending, and restore it in `finally`. Show the confirmation only after a successful response, using the reference your service returns if it gives one. On failure retain all input and provide an email or telephone alternative. Add provider-specific spam protection and server-side validation.

For enrolment, integrate in the `#enrol-form` submit handler at step four (marked with a comment), not at Continue. Give the form an `action` the same way. Build a payload from the reviewed fields, including stable course and session IDs. Validate the IDs, age suitability, availability and pricing again on the server. Do not trust a client-side fee total or a places counter.

The course filters, timetable filters, calculator and practice planner are local interaction forms, not external submissions. Their event handlers prevent default navigation.

## Saved data (localStorage)

All storage access passes through `safeStorage`. It keeps a memory copy first and attempts browser storage second. If reads, writes or quota checks fail, the current page continues to work with that memory copy. The shortlist and the practice plan stay in the visitor's browser between visits when storage is available; with storage blocked (some privacy settings, sandboxed previews) they work for the current page view only. The pages don't mention this; add a line if your visitors need it.

| Key | Shape | Read validation |
| --- | --- | --- |
| `sonata-saved-v1` | Array of course ID strings | Own course keys only, deduplicated, maximum twelve |
| `sonata-practice-v1` | Course, minutes, days, complete, week | Known course and minute choice; valid unique weekday integers; valid completion subset |

A practice entry has this shape:

```json
{
  "course": "piano-first",
  "minutes": 10,
  "days": [1, 3, 5],
  "complete": [1],
  "week": "2026-10-19"
}
```

Malformed JSON is treated as missing data. A malformed practice object is ignored. Completion entries must belong to the saved practice days and are cleared when the week no longer matches.

Use the shortlist Remove controls or the planner Clear plan control to reset from the interface. To reset everything in browser developer tools:

```js
localStorage.removeItem('sonata-saved-v1');
localStorage.removeItem('sonata-practice-v1');
```

With storage blocked, memory lasts only for that page view. Navigating to another page or reloading clears it. No learner contact details or payment details are stored.

## SEO and sharing

Each page has its own title, description, Open Graph title and description, locale, theme colour and social image. `courseDetail()` updates the title and Open Graph description for the selected course after JavaScript loads.

Replace the relative `og:image` value in every page with your deployed absolute URL, such as `https://YOUR_SITE/assets/img/og-image.png`. Replace the school name, address, fictional domain and phone number consistently across all pages and JavaScript.

Create a `robots.txt` and sitemap on your host. If individual courses need search-engine-specific pages and canonical URLs, generate static course pages from the data or move to a server-rendered implementation; query-driven client-side detail has limited crawler visibility.

There is no preconfigured analytics, tracking pixel or structured-data block. Add accurate LocalBusiness or EducationalOrganization data only after replacing the fictional business details.

## Accessibility

The site includes a skip link, semantic landmarks, one main heading on each page, visible focus outlines, labelled controls and linked inline validation errors. Decorative SVG icons are hidden from assistive technology; meaningful illustrations have alternatives.

Counts and changing calculator outputs use live regions. Enrolment steps move focus deliberately. Bookmark and practice controls expose pressed state. Native FAQ and tutor disclosures support standard keyboard interaction.

Keep buttons at comfortable touch sizes, preserve heading order, and retest contrast after changing colours. If replacing portraits with photos, write useful alternative text. Do not put essential instructions only inside illustrations.

The site honours `prefers-reduced-motion`. Static content remains visible without JavaScript, except data-driven catalogues, timetable, course details and interactive tools; those require JavaScript.

## Building and deploying

After editing utility classes or tokens:

```sh
npm install
npm run build
```

The output is `assets/css/style.css`. Upload the HTML files and the complete `assets` directory to any static host, including GitHub Pages, Cloudflare Pages or Netlify. Deploy the compiled output; a runtime Tailwind CDN is not used.

The build scans HTML and JavaScript, while documentation and JSON are explicitly excluded in `src/input.css`. Keep generated class names literal in the scanned source so Tailwind can find them.

Configure your host to use `404.html` for missing pages. Test navigation from a subdirectory, course links with parameters, the fonts and every form after deployment.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| A new utility has no visible effect | Rebuild CSS and clear the browser cache; keep utility names literal in scanned files |
| Font fallback appears | Check the Google Fonts `<link>` in the page head and that your Content Security Policy allows `fonts.googleapis.com` and `fonts.gstatic.com` |
| A course has no sessions | Add matching `SESSIONS` entries with an existing course key and unique session IDs |
| Enrolment rejects an age group | Pick the category matching the course; update the course data if its target audience has changed |
| Saved choices vanish on navigation | Storage may be blocked; the fallback is intentionally limited to the current page view |
| A group pass becomes a term | Flexible passes are supported for individual tuition only |
| The timetable dates differ next year | Terms are worked out from `TERM_RULES`; set `TERM_DATES` to your real term calendar |
| Enquiries never arrive | No form service is connected yet; follow Forms above |

## License

MIT. See `LICENSE.txt` in the download for the code and included artwork terms.

Lora and Asap are served by Google Fonts under the SIL Open Font License.

The course and page illustrations, tutor portraits, location guide and icons are original artwork included with the template.

Sonata Music Rooms, its staff, address details and course availability are fictional. Replace them with accurate business information before publication.
