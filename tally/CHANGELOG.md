# Changelog

All notable changes to the Tally template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this template follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.7] - 2026-11-15

### Fixed

- Large and small buttons are really large and small. The `btn-lg` and `btn-sm` classes had no effect, because the
  button looks were declared after them; the header buttons are now more compact and the main calls to action larger.
- The footer sign-up shows its error message under the field, in a color you can read on the dark footer, instead of
  squeezed between the field and the Subscribe button.
- The calculators keep their figures in step while a field is being corrected: with an amount, rate or hourly rate out
  of range, the results follow the sliders using the field's last valid value, instead of freezing or mixing old and
  new numbers.
- The calculator's shareable link always carries the amount and days the figures show, also after a field was left
  with a value out of range.
- A link to the features page with a malformed `#` address no longer stops the page's scripts.
- On the contact page, "Book a demo" is marked as the current page in the phone menu too, as it is in the header.
- The demo request confirmation keeps the heading its section is labeled by, and the team size error has its own id
  (`d-size-error`).
- The last security test on the security page is a rolling month (`LAST_TEST = null`: the most recent August that is
  over), so the yearly test never looks overdue. Set `LAST_TEST` to a real month to show a fixed one.
- The profit chart on the features page no longer names a year.
- After going Back to a page, its controls and what it shows agree again. Browsers put form controls back the way
  you left them, so the reminder writer could show "7 days late" selected above the "Before due" email, the demo
  request form a restored message with its counter at 0, a calculator field a value left out of range with nothing
  marked and, where the browser blocks saved data (as in a sandboxed preview), a checked sales tax box over prices
  without tax and calculator fields that didn't match their figures. These controls now return to what the page
  shows, and the counter counts the restored message.

## [1.0.6] - 2026-11-05

### Changed

- Set in Grand Rapids, Michigan, with American spelling, US dollars and local details.
- Sales tax (a sample 6%) replaces VAT on the hero invoice and the pricing toggle, and times use a 12-hour clock in Eastern time.
- The late-payment calculator now works from the interest rate and flat late fee in your own terms, since the US has no single statutory rate for late business invoices.

## [1.0.5] - 2026-11-05

### Changed

- The guide, README and changelog use American spelling. The template itself is unchanged.

## [1.0.4] - 2026-11-04

### Fixed

- A change you make is kept for the visit when the browser can't save it, for example when its storage is full, instead of going back to the old value.

## [1.0.3] - 2026-10-26

### Fixed

- Example email addresses use the reserved `.example` domain (`you@studio.example`,
  `accounts@bearaoutdoor.example`).

## [1.0.2] - 2026-10-23

### Fixed

- The demo request and newsletter confirmations no longer say the form is a demo or that nothing was sent. The
  demo request now confirms the request, says Niamh will email times for a call within two working hours (as the
  office-hours note already promises) and shows a reference like TA-7K2Q; the newsletter asks the visitor to look
  out for a confirmation email. `DOCS.md` describes the reference.

## [1.0.1] - 2026-10-17

### Fixed

- The hero invoice's due date and the reminder writer's "due on Friday …" are now a rolling demo date (the Friday 7 to
  13 days from today, `INVOICE_DUE = null`), so the demo invoice is never overdue; the old date, 31 October, wasn't a
  Friday either. Set `INVOICE_DUE` to a real date to show a fixed one.

## [1.0.0] - 2026-10-17

### Added

- Initial release with 10 pages: Home, Features, Pricing, Late-payment calculator, Integrations, Customers,
  Security & trust, Changelog, Book a demo, 404.
- Live hero invoice: change quantities and the subtotal, 23% VAT and total update, then simulate the payment through Draft, Sent, Viewed and Paid
- Pricing with a monthly / annual switch, savings worked out per plan, a show-prices-with-VAT toggle and a sticky-header comparison table, remembered between visits
- Late-payment calculator: statutory interest, fixed compensation and an SVG chart of the claim over time, with shareable amount and days in the URL
- Time-saved estimate that turns invoices, chasing and your hourly rate into hours and euro a month
- Features tour with accessible tabs that open from links, plus a reminder email writer with three tones and three stages
- Integrations directory with category filters, search, result counts and shareable ?category= links
- Filterable customer stories and changelog, a security and trust page with a sub-processor table
- Demo request form with inline validation, plan preselected from the pricing page, a character counter and live office hours in Irish time
- Calm fintech design: off-white paper with ledger lines, deep ink, one mint accent, Mona Sans with tabular numerals and HTML product mock-ups
- SEO and Open Graph tags, SVG favicon, 1200×630 social image, skip link and reduced-motion support
- Full documentation in `DOCS.md`.
