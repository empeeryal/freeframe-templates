# Changelog

All notable changes to the Mosaic HTML template are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.2] - 2026-10-23

### Fixed

- Form success messages no longer say the form is a demo or that nothing was sent. Booking, room-hire,
  volunteer, Friends and contact forms now confirm the request, say what happens next (using the reply times
  the pages already promise) and show a reference like MA-7K2Q; the newsletter points to a confirmation email.
  The footer line now just says the centre is fictional. `DOCS.md` describes the reference.
- The Friends confirmation heading was white text on a light panel; it is now ink, like the newsletter's.

## [1.0.1] - 2026-10-19

### Fixed

- The logo link's accessible name now includes its visible text (WCAG 2.5.3).
- The header's Saved link and the Save buttons' accessible names now include their visible text (WCAG 2.5.3).

## [1.0.0] - 2026-10-19

### Added

- Nine pages for Mosaic, a community arts centre in Ulverston: home, what's on, event, workshops, hire a space, get involved, our story, visit and 404.
- A rule-based programme of 20 listings (weekly and monthly sessions, rotating exhibitions with preview evenings, a yearly winter break), worked out in UK time so it never goes out of date.
- What's on filters by category, age, price and date range, a seven-day strip, saved events and .ics downloads.
- Room-hire estimate with live pricing and capacity checks, plus booking, volunteer, Friends and contact forms with inline validation.
- Cut-paper SVG artwork for every category, an illustrated town map, Tailwind CSS v4 styling and the Bagel Fat One and Epilogue typefaces.
