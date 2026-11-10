/* Sidecar — site content and settings.
 * Everything the pages render from JavaScript lives here as plain data (window.SIDECAR).
 * Edit these to change projects, prices, the 12-week plan, roles, the team and the brief form.
 * assets/js/main.js reads them; DOCS.md describes every field.
 */
window.SIDECAR = {
  STUDIO: {
    name: 'Sidecar',
    city: 'Little Rock',
    timeZone: 'America/Chicago',
    phone: '(501) 555-0138',
    email: 'hello@sidecar.example',
    jobsEmail: 'jobs@sidecar.example',
    // Studio hours, Central time, Monday (1) to Friday (5).
    hours: { days: [1, 2, 3, 4, 5], open: '09:00', close: '17:30' }
  },

  // The three services. `rate` is the price of one person for one week, in dollars (used by the estimator).
  SERVICES: {
    design: { name: 'Product design', short: 'Design', rate: 4500 },
    engineering: { name: 'Engineering', short: 'Engineering', rate: 5000 },
    launch: { name: 'Launch', short: 'Launch', rate: 4000 }
  },
  SERVICE_ORDER: ['design', 'engineering', 'launch'],

  // Funding stages used by the work filter.
  STAGES: { 'pre-seed': 'Pre-seed', seed: 'Seed', 'series-a': 'Series A' },
  STAGE_ORDER: ['pre-seed', 'seed', 'series-a'],

  // Projects on work.html. `art` is the drawing in assets/img/work/. `page` links a full case study.
  CASES: [
    {
      id: 'brineworks', name: 'Brineworks', what: 'Pond sensors and an oxygen alarm app for catfish farms',
      city: 'Stuttgart, AR', stage: 'seed', services: ['design', 'engineering', 'launch'], weeks: 14, team: 4, year: 2026,
      summary: 'Two founders with a working sensor and a spiral notebook of farmer complaints. We designed the app, built the alarm pipeline and launched it county by county.',
      shipped: ['iOS and Android app with night alarms', 'Sensor ingest and alerting service', 'Dealer launch kit for feed stores'],
      metric: { value: '140 farms', label: 'on the app in its first season' },
      page: 'case-study.html'
    },
    {
      id: 'tinpan', name: 'Tinpan', what: 'Shelf counts and reorders for independent restaurants',
      city: 'Shreveport, LA', stage: 'pre-seed', services: ['design', 'engineering'], weeks: 8, team: 3, year: 2026,
      summary: 'A chef-founder counting walk-ins on a clipboard every Sunday night. We shipped a phone-first count that follows the way a kitchen is laid out.',
      shipped: ['Walk-in count by shelf, offline first', 'Par levels and a one-tap reorder list', 'Invite flow for line cooks'],
      metric: { value: '11 min', label: 'weekly count, down from 70' }
    },
    {
      id: 'mulecart', name: 'Mulecart', what: 'Wholesale ordering for rural grocers',
      city: 'Joplin, MO', stage: 'seed', services: ['engineering', 'launch'], weeks: 16, team: 4, year: 2025,
      summary: 'Their design was done; the prototype could not take real orders. We rebuilt the ordering core, connected three distributors and ran the launch with their sales team.',
      shipped: ['Catalog sync from three distributors', 'Order, substitute and invoice flow', 'Sales playbook and onboarding emails'],
      metric: { value: '$2.4M', label: 'in orders in the first six months' }
    },
    {
      id: 'pawpaw', name: 'Pawpaw Health', what: 'After-hours nurse line scheduling for pediatric clinics',
      city: 'Conway, AR', stage: 'seed', services: ['design', 'engineering'], weeks: 12, team: 4, year: 2025,
      summary: 'A nurse practitioner and an engineer replacing a pager rotation. We designed the parent and nurse sides and built the scheduling engine behind them.',
      shipped: ['Parent callback request in under a minute', 'Nurse queue with clinic routing rules', 'Admin roster and coverage view'],
      metric: { value: '38 clinics', label: 'live within a year' }
    },
    {
      id: 'voltyard', name: 'Voltyard', what: 'Charger site planning for delivery fleets',
      city: 'Amarillo, TX', stage: 'series-a', services: ['design'], weeks: 10, team: 3, year: 2026,
      summary: 'A strong engineering team with a product that only its engineers could drive. We redesigned the planning workspace around how fleet managers actually decide.',
      shipped: ['Site review map and scoring panel', 'Design system with 60 components', 'Usability study with nine fleet managers'],
      metric: { value: '3.1×', label: 'faster site reviews' }
    },
    {
      id: 'quillstead', name: 'Quillstead', what: 'Leases, rent and repairs for small landlords',
      city: 'Fort Smith, AR', stage: 'pre-seed', services: ['design', 'engineering', 'launch'], weeks: 12, team: 3, year: 2025,
      summary: 'A landlord with 22 units and a spreadsheet for each. We took the idea from interviews to a paid beta with a waitlist ready on day one.',
      shipped: ['Lease builder with state clauses', 'Rent reminders and repair tickets', 'Waitlist site and launch emails'],
      metric: { value: '1,900', label: 'units on the waitlist at launch' }
    },
    {
      id: 'thimbleset', name: 'Thimbleset', what: 'A marketplace for indie sewing patterns',
      city: 'Baton Rouge, LA', stage: 'pre-seed', services: ['design', 'launch'], weeks: 6, team: 2, year: 2024,
      summary: 'A pattern designer with a loyal newsletter and no store of her own. We designed the shop and planned a launch around her community.',
      shipped: ['Storefront and pattern pages', 'Seller onboarding for 40 designers', 'Launch week plan and assets'],
      metric: { value: '4,300', label: 'pattern sales in launch month' }
    },
    {
      id: 'haulbook', name: 'Haulbook', what: 'Load board and settlements for small trucking carriers',
      city: 'Texarkana, TX', stage: 'series-a', services: ['engineering'], weeks: 20, team: 5, year: 2024,
      summary: 'After their Series A, Haulbook needed settlements rebuilt before they could grow. We embedded with their team and hired our replacements.',
      shipped: ['Settlement engine with factoring', 'Driver pay statements', 'Two engineers hired and onboarded'],
      metric: { value: '9 days', label: 'faster to get paid, on average' }
    }
  ],

  // Engagement estimator (pricing.html). Prices are per person-week from SERVICES[...].rate,
  // averaged over the services picked.
  ESTIMATE: {
    teamSizes: [2, 3, 4, 5, 6],
    weeks: { min: 4, max: 24, step: 2 },
    defaults: { services: ['design', 'engineering'], team: 3, weeks: 12, model: 'sprint' },
    teamHints: {
      2: 'Two people: a senior designer and a senior engineer, with a partner on call.',
      3: 'Three people: usually a designer and two engineers, with a partner on call.',
      4: 'Four people: two engineers, a designer and a strategist or a third engineer.',
      5: 'Five people: a full pod, for products with web, mobile and integrations.',
      6: 'Six people: both pods’ leads plus a full pod. For big rebuilds on a deadline.'
    },
    modelHints: {
      sprint: 'One price for the whole scope, paid in three parts.',
      retainer: 'Billed every four weeks at 10% below the sprint rate, for three months or more.'
    },
    sprint: { low: 0.9, high: 1.15, roundTo: 1000 },            // fixed sprint: total price range
    retainer: { discount: 0.1, low: 0.95, high: 1.05, roundTo: 500, weeksPerMonth: 4, minMonths: 3 }
  },

  // Phases of the sample timeline. `service` phases only appear when that service is picked.
  // Weeks are shared out by weight (largest remainder), at least one week each.
  PHASES: [
    { id: 'frame', name: 'Discovery and framing', weight: 1 },
    { id: 'design', name: 'Design sprints', weight: 2, service: 'design' },
    { id: 'build', name: 'Build and integrate', weight: 4, service: 'engineering' },
    { id: 'launch', name: 'Launch prep and go-live', weight: 2, service: 'launch' },
    { id: 'handoff', name: 'Handoff', weight: 1 }
  ],

  // Engagement model helper (services.html). The rule in main.js (initModelQuiz):
  // wants a team within a year AND no engineers -> hire; otherwise a scoped release -> sprint; otherwise retainer.
  MODELS: {
    sprint: { name: 'Fixed sprint', why: 'Your first release is clear, so a fixed price and a fixed date will serve you best.', link: 'pricing.html?model=sprint' },
    retainer: { name: 'Monthly retainer', why: 'You are still working out what to build. A steady team you can steer every Friday fits better than a fixed scope.', link: 'pricing.html?model=retainer' },
    hire: { name: 'Build to hire', why: 'You want your own team soon and have no engineers yet. We build the first version and hire the people who take it over.', link: 'pricing.html?model=sprint&services=design,engineering' }
  },

  // Start dates (contact.html, home, pricing). A new engagement starts on a Monday at least
  // `leadDays` after today (Central time), then every `everyWeeks` weeks. Starts never fall in the
  // winter break (closed from month/day `closed.from` to `closed.to`, inclusive): they move to the
  // Monday after it. `openings` is how many of the two pods are free, by position.
  START_RULE: { leadDays: 21, everyWeeks: 4, count: 3, closed: { from: [12, 19], to: [1, 3] }, openings: [1, 2, 2] },

  // The 12-week plan on process.html.
  WEEKS: [
    { week: 1, phase: 'Frame', title: 'Kickoff and the problem on one page', founder: 6,
      text: 'Two days in Little Rock or at your office. We interview you, read everything you have and talk to five of your users or would-be users.',
      studio: ['Partner', 'Designer', 'Engineer'], artifact: 'A one-page problem statement both sides sign' },
    { week: 2, phase: 'Frame', title: 'Scope, risks and the first map', founder: 4,
      text: 'We map the product end to end, mark the riskiest assumptions and cut the first release to what can ship in ten weeks.',
      studio: ['Partner', 'Designer', 'Engineer'], artifact: 'Release map with a cut line, and a risk list' },
    { week: 3, phase: 'Shape', title: 'Sketches on paper, then on screens', founder: 3,
      text: 'Fast, ugly sketches of the core flow. We test them with users on Thursday and throw half away on Friday.',
      studio: ['Designer', 'Designer'], artifact: 'Tested sketches of the core flow' },
    { week: 4, phase: 'Shape', title: 'Clickable prototype', founder: 3,
      text: 'The core flow as a clickable prototype. Engineering spikes the hardest integration in parallel so nothing surprises us in week eight.',
      studio: ['Designer', 'Engineer'], artifact: 'Prototype and an integration spike' },
    { week: 5, phase: 'Shape', title: 'Design system and architecture', founder: 2,
      text: 'The look settles into a small design system. The architecture is written down, reviewed with you and agreed.',
      studio: ['Designer', 'Engineer', 'Engineer'], artifact: 'Design system v1 and architecture notes' },
    { week: 6, phase: 'Build', title: 'First working build', founder: 2,
      text: 'Real code, real data, deployed on day one to a staging app you can open on your phone. Demos every Friday from here on.',
      studio: ['Engineer', 'Engineer', 'Designer'], artifact: 'Staging app with sign-in and the core flow' },
    { week: 7, phase: 'Build', title: 'The core flow, end to end', founder: 2,
      text: 'The main job your product does works from the first screen to the last, with the edge cases written down.',
      studio: ['Engineer', 'Engineer', 'Designer'], artifact: 'Core flow working end to end' },
    { week: 8, phase: 'Build', title: 'Integrations and data', founder: 2,
      text: 'Payments, messages, sensors or partner APIs: whatever your product talks to gets connected and tested with real accounts.',
      studio: ['Engineer', 'Engineer'], artifact: 'Integrations live on staging' },
    { week: 9, phase: 'Build', title: 'Beta with ten real users', founder: 4,
      text: 'Ten people use it for their real work. We watch, fix and log what they hit. You make the calls on what changes.',
      studio: ['Designer', 'Engineer', 'Engineer'], artifact: 'Private beta and a fix list' },
    { week: 10, phase: 'Harden', title: 'Fix, polish, measure', founder: 2,
      text: 'The beta list gets worked down. Analytics, error tracking and the admin tools your team needs on launch day go in.',
      studio: ['Engineer', 'Engineer', 'Designer'], artifact: 'Release candidate with analytics' },
    { week: 11, phase: 'Launch', title: 'Store review and launch plan', founder: 4,
      text: 'App store submissions, the launch page, onboarding emails and a day-by-day plan for launch week.',
      studio: ['Launch strategist', 'Engineer', 'Designer'], artifact: 'Approved builds and a launch week plan' },
    { week: 12, phase: 'Launch', title: 'Go live and hand off', founder: 5,
      text: 'Launch on Tuesday, watch the numbers together, fix what comes up. Then a full handoff: code, docs, access and a recorded walkthrough.',
      studio: ['Partner', 'Engineer', 'Launch strategist'], artifact: 'Live product, handoff docs and 30 days of support' }
  ],

  // Open roles (careers.html).
  DISCIPLINES: { design: 'Design', engineering: 'Engineering', launch: 'Launch and operations' },
  MODES: { hybrid: 'Hybrid, Little Rock', remote: 'Remote, US' },
  ROLES: [
    { id: 'senior-product-designer', title: 'Senior Product Designer', discipline: 'design', mode: 'hybrid', pay: '$118,000 to $138,000',
      summary: 'Lead design on one engagement at a time, from the first founder interview to the handoff.',
      doing: ['Run discovery interviews and usability tests with founders and their users', 'Turn messy problems into flows, prototypes and a small design system', 'Pair with engineers every day, in Figma and in the code review'],
      need: ['Five or more years designing shipped software products', 'A portfolio that shows how you decided, not only what it looked like', 'Comfort presenting to founders who disagree with you'],
      nice: ['Experience at an early-stage startup', 'Mobile design for iOS and Android'] },
    { id: 'product-designer-research', title: 'Product Designer, Research', discipline: 'design', mode: 'remote', pay: '$96,000 to $112,000',
      summary: 'Plan and run the research that decides what we build in weeks 1 to 5.',
      doing: ['Recruit and interview users, often in rural and small-town businesses', 'Run weekly prototype tests and write up what changed', 'Teach founders to keep talking to users after we leave'],
      need: ['Three or more years in UX research or product design', 'Clear writing: your notes are what the team acts on', 'Available for calls 9 a.m. to 3 p.m. Central'],
      nice: ['Spanish', 'Field research in agriculture, health care or logistics'] },
    { id: 'senior-full-stack-engineer', title: 'Senior Full-Stack Engineer', discipline: 'engineering', mode: 'remote', pay: '$142,000 to $165,000',
      summary: 'Build first versions that a founder can grow a company on, then hand them over cleanly.',
      doing: ['Design and build web apps and APIs with TypeScript and Postgres', 'Set up deploys, monitoring and the boring parts that keep a product up', 'Interview and onboard the founders’ first engineering hires'],
      need: ['Six or more years building and running production software', 'Judgment about what to build now and what to leave for later', 'Experience owning a system end to end'],
      nice: ['React Native', 'Payments, health care or logistics integrations'] },
    { id: 'mobile-engineer', title: 'Mobile Engineer', discipline: 'engineering', mode: 'hybrid', pay: '$128,000 to $148,000',
      summary: 'Ship the iOS and Android apps for most of our engagements, with React Native.',
      doing: ['Build apps that work offline, in barns, kitchens and truck cabs', 'Own app store submissions and release builds', 'Work closely with design on motion and accessibility'],
      need: ['Four or more years building mobile apps people use every day', 'React Native or native iOS and Android', 'Care for performance on older phones'],
      nice: ['Bluetooth or sensor work', 'Experience with push notification systems at scale'] },
    { id: 'launch-strategist', title: 'Launch Strategist', discipline: 'launch', mode: 'hybrid', pay: '$92,000 to $108,000',
      summary: 'Plan and run launches: positioning, the launch page, onboarding and the first 30 days of numbers.',
      doing: ['Write positioning and launch copy with founders', 'Plan launch weeks with partners, press and communities', 'Set up the onboarding emails and dashboards the founders keep'],
      need: ['Four or more years in product marketing or growth at a startup', 'A launch you ran and can tell us about, numbers included', 'Plain, clear writing'],
      nice: ['B2B sales experience', 'Experience with app store optimization'] },
    { id: 'engineering-apprentice', title: 'Engineering Apprentice', discipline: 'engineering', mode: 'hybrid', pay: '$27 an hour, six months',
      summary: 'A paid six-month apprenticeship for career changers, with a mentor and real client work.',
      doing: ['Pair with a senior engineer on a live engagement', 'Own small features from ticket to release', 'Take part in code review, demos and retros'],
      need: ['You have built a few projects on your own or in a bootcamp', 'You can be in the studio in Little Rock three days a week', 'Curiosity and the habit of asking questions'],
      nice: ['A previous career in a trade, health care or retail'] }
  ],

  // The studio (about.html). Avatars are drawn from these settings in main.js (drawAvatar):
  // skin 0-4, hair 0-5 (style), hairColor 0-4, glasses, bg 0-3.
  TEAM: [
    { name: 'Ottavia Varner', role: 'Cofounder, product', group: 'lead', skin: 1, hair: 2, hairColor: 0, glasses: false, bg: 0, note: 'Ran product at a freight startup for six years. Says “show me” a lot.' },
    { name: 'Delmar Haskins', role: 'Cofounder, engineering', group: 'lead', skin: 3, hair: 0, hairColor: 0, glasses: true, bg: 1, note: 'Has shipped apps for crop dusters and county clerks.' },
    { name: 'Itzel Arreola', role: 'Design director', group: 'design', skin: 2, hair: 3, hairColor: 0, glasses: false, bg: 2, note: 'Sketches every flow on paper first. Every one.' },
    { name: 'Ayanna Ledbetter', role: 'Senior product designer', group: 'design', skin: 4, hair: 4, hairColor: 0, glasses: false, bg: 0, note: 'Former ER nurse; now designs for nurses.' },
    { name: 'Sunniva Hargrove', role: 'Product designer, research', group: 'design', skin: 0, hair: 1, hairColor: 2, glasses: true, bg: 3, note: 'Has interviewed farmers in four states this year.' },
    { name: 'Daria Vickery', role: 'Brand and content designer', group: 'design', skin: 0, hair: 5, hairColor: 3, glasses: false, bg: 1, note: 'Writes the words before drawing the boxes.' },
    { name: 'Haruki Ueda', role: 'Staff engineer, mobile', group: 'engineering', skin: 1, hair: 0, hairColor: 0, glasses: false, bg: 2, note: 'Tests every app on a 2019 phone in airplane mode.' },
    { name: 'Keoni Satterfield', role: 'Senior engineer, backend', group: 'engineering', skin: 2, hair: 1, hairColor: 0, glasses: false, bg: 0, note: 'Makes payments and sensors talk to each other.' },
    { name: 'Varun Banerjee', role: 'Senior engineer, web', group: 'engineering', skin: 2, hair: 0, hairColor: 0, glasses: true, bg: 3, note: 'Has opinions about forms. Good ones.' },
    { name: 'Lorne Rountree', role: 'Engineer, infrastructure', group: 'engineering', skin: 0, hair: 2, hairColor: 1, glasses: false, bg: 1, note: 'Keeps launch days boring, on purpose.' },
    { name: 'Elio Hinojosa', role: 'Engineer, full stack', group: 'engineering', skin: 1, hair: 4, hairColor: 0, glasses: false, bg: 2, note: 'Joined as our first apprentice in 2024.' },
    { name: 'Rowena Prather', role: 'Head of launch', group: 'launch', skin: 3, hair: 3, hairColor: 0, glasses: false, bg: 3, note: 'Has run 30 launches and still writes a plan for each.' },
    { name: 'Thatcher Dupree', role: 'Delivery lead', group: 'launch', skin: 0, hair: 1, hairColor: 4, glasses: false, bg: 0, note: 'Owns the calendar, the Friday demo and the budget.' },
    { name: 'Zora Easterling', role: 'Operations and finance', group: 'launch', skin: 4, hair: 2, hairColor: 0, glasses: true, bg: 1, note: 'Sends the invoices nobody is surprised by.' }
  ],
  TEAM_GROUPS: { lead: 'Partners', design: 'Design', engineering: 'Engineering', launch: 'Launch and operations' },

  // Project brief (contact.html).
  BRIEF: {
    stages: { idea: 'Idea, not raised yet', 'pre-seed': 'Pre-seed', seed: 'Seed', 'series-a': 'Series A', later: 'Series B or later' },
    budgets: { 'under-75': 'Under $75,000', '75-150': '$75,000 to $150,000', '150-300': '$150,000 to $300,000', '300-plus': '$300,000 or more', unsure: 'Not sure yet' },
    // Upper limits in dollars used to match an estimate to a budget range.
    budgetCaps: [['under-75', 75000], ['75-150', 150000], ['150-300', 300000], ['300-plus', Infinity]],
    timelines: { next: 'At the next open start', quarter: 'In the next three months', later: 'Three to six months out', exploring: 'Just exploring' },
    refPrefix: 'SC'
  }
};
