# Changelog

All notable changes to the Garage template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this template follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2026-10-23

### Fixed

- The booking request, contact form and MOT reminder no longer say the site is a demo and nothing was sent. The
  booking confirmation says Lorna will call within one working day to confirm the time and the fixed price; the
  contact confirmation promises a reply within one working day and shows a reference like BC-7K2Q; a saved MOT
  reminder says when it will be sent (by email or text). `DOCS.md` describes the new wording.

## [1.0.1] - 2026-10-19

### Fixed

- The logo link's accessible name now includes its visible text (WCAG 2.5.3).
- The booking calendar's day buttons' accessible names now start with the date and slots they show (WCAG 2.5.3).

## [1.0.0] - 2026-10-18

### Added

- Initial release: a ten-page site for Bellcrank Motor Works, a fictional independent MOT, servicing and repair garage in Kidderminster: Home, Services, Price checker, Book, MOT reminder, Reviews, About & team, FAQ, Contact & directions and a 404 page.
- Service price checker: MOT, interim, full or major service, petrol, diesel, hybrid or electric, and engine size give a fixed guide price including VAT, an optional £35 MOT add-on, the list of what's included and the time in the workshop. Choices are saved in localStorage (validated on read) and can be set by `?service=`, `?fuel=`, `?engine=` and `?mot=1`.
- Booking request: UK registration plate formatted as you type and validated (current, prefix, suffix and dateless formats, with the age identifier explained), jobs with a running guide total, a drop-off calendar and time slots from tomorrow up to four weeks ahead that skip Sundays, bank holidays and full days, and a choice of leaving the car, waiting in the lounge (short jobs only) or a courtesy car (when one is free that day). `?service=` and `?reg=` prefill it. Demo only: nothing is sent.
- Bank holidays for England and Wales worked out for any year, including substitute days, with an extra closed-days list.
- MOT reminder: the next MOT due date from the last test date (a year less a day) or a new car's registration date (third anniversary), the earliest test that keeps the renewal date, a countdown, a timeline and the reminder date; reminders are saved in localStorage and work in memory when storage is blocked.
- Open-now status in UK time on every page (never a bare "Closed": it says when the workshop opens next), today's hours, a workshop-day gauge, the next free MOT drop-off and upcoming closures. `?at=` previews any UK date and time.
- Filterable services (`?cat=`), reviews with relative dates, rating breakdown, filter and sort, a searchable FAQ with highlighted matches (`?q=`) and a validated contact form.
- SVG artwork: car inspection drawing, brake assembly, tyre tread section, MOT calendar, workshop elevation, rating gauge, street map, seven team portraits, favicon and social image.
- Accessible mobile menu, skip link, keyboard-friendly calendar, back-to-top button and scroll reveals that respect reduced motion.
