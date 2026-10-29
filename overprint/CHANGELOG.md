# Changelog

All notable changes to the Overprint template (HTML + Tailwind CSS) are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the template uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-10-27

### Added

- Eight pages and a 404 for Pomelo Press, the fictional Louisville studio of illustrator Pipa Valdespino:
  home, work, case study, shop, checkout, commissions, about and contact.
- Risograph artwork drawn in SVG by `assets/js/main.js`: every picture is three spot-ink plates (fluorescent
  pink, federal blue and yellow) that overprint with multiply on cream paper and screen on dark paper,
  slightly off register, with halftone screens and ink speckle.
- Twelve projects in `assets/js/data.js`, each with its own motif, filterable by type on the work page
  (`work.html?type=`).
- Case study for every project (`project.html?project=`): brief, deliverables, Sketch, Plates and Final
  print tabs, ink toggles, process notes, result, client quote and previous/next links.
- Shop of twelve prints, zines, stickers and postcards with sizes, numbered editions and stock
  (`shop.html?filter=`), and a cart saved in localStorage (in memory when storage is blocked) with a drawer
  and quantity steppers.
- Checkout with delivery options, free shipping over $75, Kentucky sales tax, address and test-card
  validation, ending in an order confirmation with the next mail day.
- Four-step commission enquiry (`commissions.html?type=`) with a live fee range, budget check, rush and
  too-soon warnings and a dated timeline in working days, ending in an "enquiry received" state.
- Studio dates in America/Kentucky/Louisville time with US holidays and the winter break: booking month,
  earliest start, reply date, open studio and mail days, plus a `?now=` preview parameter.
- Fairs and events that roll forward with `KEEP_DEMO_CURRENT`, a newsletter sticker sign-up and a contact
  form with an order-number field.
- Light and dark paper themes, Rammetto One, Quicksand and Courier Prime from Google Fonts, a PNG social
  image, SVG favicon, accessible mobile menu, skip link and scroll reveals that respect reduced motion.
