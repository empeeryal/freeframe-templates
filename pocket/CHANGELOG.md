# Changelog

All notable changes to the Pocket template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this template follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.5] - 2026-10-23

### Fixed

- The contact form's success message no longer says it is a demo template and nothing was sent. It now promises a
  reply within one working day (as the help centre already says) and shows a reference like PO-7K2Q.
- The footer newsletter no longer says "This is a demo, so nothing was sent"; it asks the visitor to look out for a
  confirmation email.
- The home page's download block no longer says the store links are placeholders. `DOCS.md` describes the new
  wording and the reference.

## [1.0.4] - 2026-10-19

### Fixed

- The press kit's copy-colour buttons and the screenshot buttons' accessible names no longer leave out their visible text (WCAG 2.5.3).

## [1.0.3] - 2026-10-09

### Changed

- The CSS build no longer reads the documentation and metadata files (`*.md`, `*.json`), so words in
  the guides can no longer add unused rules to `assets/css/style.css`. No visible change.

## [1.0.2] - 2026-10-07

### Fixed

- "Send another message" on `support.html` works again. Its `data-form-reset` pointed at the success message
  instead of the form, so clicking it threw a TypeError; the form now has `id="contact-form"` and the button
  points at it.

## [1.0.1] - 2026-10-07

### Added

- Full documentation in `DOCS.md`.

## [1.0.0] - 2026-10-06

### Added

- Nine pages: home, features, screenshots, pricing, release notes, help centre, press kit, privacy policy and 404.
- Phone mockups and seven app screens (home, budgets, pockets, bills, insights, shared budget, lock screen) built in HTML and SVG.
- Sticky feature tour on the home page that swaps the phone screen as you scroll, with a static layout for reduced motion.
- Screenshot carousel with arrow buttons, swipe and keyboard support, and a lightbox dialog with focus handling.
- Monthly / yearly pricing toggle, plan comparison table and FAQ accordion.
- Release notes timeline with type and platform filters and a live result count.
- Searchable help centre and a validated contact form; newsletter sign-up in the footer.
- Press kit with copy-to-clipboard boilerplate, key facts and colour swatches, plus downloadable SVG logos.
- Privacy policy with a table of contents that highlights the section in view.
- Dark mode that remembers the visitor's choice, scroll reveals, count-up stats and a back-to-top button.
