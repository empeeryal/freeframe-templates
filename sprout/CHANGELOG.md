# Changelog

All notable changes to the Sprout HTML template are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.2] - 2026-10-23

### Fixed

- The enrolment and enquiry confirmations no longer tell visitors the website is a demonstration and nothing was
  sent. The enrolment confirmation now says how to change a request by phone, quoting its reference, and the enquiry
  confirmation says the message reached the office and shows a reference too (like LS-7K2Q).
  `DOCS.md` describes the references and covers this version.

## [1.0.1] - 2026-10-19

### Fixed

- The logo link's accessible name now includes its visible text (WCAG 2.5.3).

## [1.0.0] - 2026-10-19

### Added

- Ten pages for Loamstead field school, a fictional practical gardening school in Pershore: home, courses, course
  page, timetable, enrolment, bed planner, shortlist, about, visit and a 404 page.
- Ten courses across beginner, improver and experienced levels and every season, with three tutors, learner quotes
  and a drawing for each course.
- Course list filters by level, topic and season, kept in the URL.
- Course pages at `course.html?course=…` with their own title, next four dates, places left, tutor and related
  courses, and a clear message for unknown links.
- Upcoming-sessions timetable for the next twelve weeks, filterable by course and level.
- Three-step enrolment request (date, people, details) with inline validation, a running total and a confirmation
  with a reference; requests are kept on the device and reduce the places shown.
- Rolling session dates worked out from each course's rule (weekday, frequency, months, Christmas closure), at
  least seven days ahead in UK time, with a `?now=` preview parameter.
- Bed planner that counts plants for a bed and crop, draws them to scale, explains when a bed is too small or the
  drawing shows only a corner, remembers the last plan and suggests a course.
- Saved shortlist and enrolment requests with an in-memory fallback when browser storage is blocked.
- Enquiry form with inline validation and a course or topic preselected from the URL.
- Access statement, booking and cancellation terms, safeguarding note and FAQ.
- Commissioner and Vollkorn type, field-notebook artwork, an Open Graph image and full documentation.
