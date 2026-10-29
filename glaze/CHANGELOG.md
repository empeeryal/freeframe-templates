# Changelog

All notable changes to the Glaze template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this template follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-10-19

### Fixed

- The logo link's accessible name now includes its visible text (WCAG 2.5.3).

## [1.0.0] - 2026-10-19

### Added

- Initial release with 10 pages: Home, Shop, Product, Workshops, Basket, Checkout, The studio, Care & delivery,
  Visit & contact, 404.
- Twelve pieces in five categories, each drawn in SVG from one product array: the drawing changes with the glaze and size you pick
- Shop filters for shape, glaze and “ready to send”, with sorting and shareable ?category=, ?glaze=, ?ready= and ?sort= links
- Product pages with glaze and size choices that change the price, stock per glaze, a quantity limit that says so, and related pieces worked out from the data
- Delivery and collection dates worked out on London time, with working days, Christmas closures and a three-week lead time for made-to-order pieces
- Workshop booking: Sunday wheel tasters, fortnightly hand-building evenings and a six-week course, with dates that roll forward and places left per session
- Basket saved in localStorage with pottery and workshop places together, delivery or free collection and a free-delivery progress bar
- Checkout with contact and address validation, UK postcode rules for the Highlands and islands, and an order confirmation
- Live open or closed status, the next seven days’ opening hours and the monthly kiln-opening Saturday, all computed from rules
- Contact form with topic-dependent fields, inline errors and a character counter
- Full documentation in `DOCS.md`.
