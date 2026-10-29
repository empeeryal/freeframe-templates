# Changelog

All notable changes to the Kinetic HTML template are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions use
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2026-10-26

### Fixed

- The email address uses the reserved `.example` domain (`hello@fenlineperformance.example`).

## [1.0.2] - 2026-10-23

### Fixed

- The contact and booking confirmations no longer say the form is a demo and nothing was sent or booked. They now
  confirm the message, booking or call-back request, show a reference (like FP-7K2Q) and say what happens next,
  using the reply times the pages already promise. The `.ics` file carries the reference, and the pricing
  calculator's note no longer calls the prices "illustrative prices for this demo". `DOCS.md` describes the
  reference.

## [1.0.1] - 2026-10-19

### Fixed

- The logo link's accessible name now includes its visible text (WCAG 2.5.3).

## [1.0.0] - 2026-10-15

### Added

- Eight pages for Fenline Performance, a fictional two-coach personal training studio in Cambridge: home,
  programmes, pricing, client results, training tools, about, contact and online booking, plus a 404 page.
- Home page goal picker with a recommended programme, coach, price and first six weeks for each of five goals,
  remembered in `localStorage`, and a live "next free consult" badge.
- Programmes and client stories filterable by goal, with `?goal=` links that can be shared.
- Booking flow with six session types, a coach step with each coach's next opening, a week view built from coach
  shifts, small-group classes, session length and notice periods, PAR-Q style health questions with a
  "please talk to us first" outcome, and a confirmation with a `.ics` download (demo only, nothing is booked).
- Pricing page with a Kickstart intro offer, session packs, memberships, a sessions-per-week calculator comparing
  pay per session, packs and membership, a comparison table and an FAQ.
- Training tools: a weekly plan builder (saved in `localStorage`, printable), a one-rep max estimator and a running
  pace calculator.
- Client progress charts drawn as inline SVG, live open-now status in UK time, a validated contact form, SVG athlete
  pictograms, coach portraits, studio illustration, map, favicon and a PNG social image (SVG source included),
  scroll reveals, an accessible mobile menu and a back-to-top button. Full documentation in `DOCS.md`.
