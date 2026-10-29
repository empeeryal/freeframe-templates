# Changelog

All notable changes to the Brief HTML template are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions use
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2026-10-26

### Fixed

- The phone number is now 01632 960 491, from Ofcom's range reserved for drama, so it can't reach a real line.

## [1.0.2] - 2026-10-23

### Fixed

- The booking confirmation and the message form's thank-you no longer say this is a demo and nothing was sent.
  They now give a reference (like PE-7K2Q) and say what happens next, using the one-working-day reply the page
  already promises, and the booking confirmation says how to change the time. The calendar hold no longer
  calls itself a demo. `DOCS.md` describes the reference.

## [1.0.1] - 2026-10-19

### Fixed

- The logo link's accessible name now includes its visible text (WCAG 2.5.3).

## [1.0.0] - 2026-10-15

### Added

- Nine pages for Pennington Employment Law, a fictional solo employment solicitor in Southampton: home,
  services, fees, check your options, guides, a sample article, about, book a call and a 404 page.
- Fee estimator with matter and complexity choices, fixed fees or ranges, a VAT toggle, an employer
  contribution, an interest-free payment plan and shareable `?matter=` and `?level=` URLs, plus a full fee
  table and staged tribunal fees.
- Branching "what are my options?" check with plain-English results, a recommended service, a recap of the
  answers and a saved result in `localStorage` (validated on read) with a start-again button.
- Employment tribunal deadline calculator (three months less one day, or six months for statutory
  redundancy pay) with days remaining and urgent and late warnings.
- Four-step booking flow with call types, an accessible month calendar, UK-time slots with the visitor's
  local time, conflict-check fields, inline validation, a confirmation and a `.ics` download (demo only,
  nothing is booked), and a message form.
- Services filtered by area with live counts and `?area=` URLs; guides with topic filters, search and
  `?tag=`/`?q=` URLs; a long-form article with reading progress and a table of contents.
- Not-legal-advice notices, regulation and complaints placeholders and review disclaimers.
- SVG portrait, office and document illustrations, SVG favicon and a PNG social image (SVG source
  included), scroll reveals, FAQ accordion, accessible mobile menu and a back-to-top button. Full
  documentation in `DOCS.md`.
