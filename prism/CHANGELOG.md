# Changelog

All notable changes to the Prism template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this template follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2026-10-26

### Fixed

- Placeholder email addresses in forms now use the reserved `.example` domain instead of a real-looking `.com` one.

## [1.0.1] - 2026-10-23

### Fixed

- The sales form's confirmation no longer says it is a demo form that didn't send anything. It now confirms the
  request, says a real person will reply within one business day (as the page already promises) and shows a
  reference like PL-7K2Q. The footer release-notes sign-up asks subscribers to look out for a confirmation email
  instead of saying nothing was sent. `DOCS.md` describes the reference.

## [1.0.0] - 2026-10-12

### Added

- Initial release with 8 pages: Home, Product, Developers, Pricing, Changelog, Company & careers,
  Talk to sales, 404.
- Interactive AI playground that streams cited answers token by token, with stop, model switch and example prompts
- Benchmark bar chart drawn as inline SVG from a data array, with an accessible table view
- Pricing with a monthly / annual switch and a live cost calculator for seats and API tokens
- API quickstart with cURL, JavaScript and Python tabs that stay in sync, remember the choice and copy to the clipboard
- Changelog and open roles filterable by topic, with counts and shareable URLs
- Talk-to-sales form with inline validation, a work-email check, topic from the URL and a success state
- Dark-first design with spectral gradients, a CSS hairline grid, film grain and an SVG prism illustration
- Accessible FAQ accordion, mobile menu, skip link, scroll reveals and reduced-motion support
- SEO and Open Graph tags, SVG favicon and a 1200×630 social image on every page
- Full documentation in `DOCS.md`.
