/* Slatework — site content and settings.
 * Everything the interactive parts of the site read lives here, so you can change prices, candidates,
 * customers or integrations without touching main.js. main.js reads it from window.SLATEWORK.
 * Plain data only: strings, numbers, arrays and objects. See DOCS.md, "Content".
 */
window.SLATEWORK = (function () {
  'use strict';

  /* ------------------------------------------------------------------
   * Company and time
   * ------------------------------------------------------------------ */
  var COMPANY = {
    name: 'Slatework',
    phone: '(859) 555-0147',
    email: 'hello@slatework.example',
    timeZone: 'America/New_York', // Lexington, Kentucky: Eastern time
    timeZoneLabel: 'Eastern'
  };

  /* ------------------------------------------------------------------
   * Hero pipeline board (index.html)
   * ------------------------------------------------------------------ */
  // The five stages, in order. `tone` picks the colored dot and column accent (see src/input.css).
  var STAGES = [
    { id: 'applied', name: 'Applied', tone: 'applied' },
    { id: 'screen', name: 'Screen', tone: 'screen' },
    { id: 'interview', name: 'Interview', tone: 'interview' },
    { id: 'offer', name: 'Offer', tone: 'offer' },
    { id: 'hired', name: 'Hired', tone: 'hired' }
  ];

  // The requisition shown on the board.
  var REQ = { title: 'Customer Success Manager', id: 'REQ-2207', openings: 2, team: 'Brightkiln Software · Customer team' };

  // Candidates that are in each stage but not shown as cards (the board shows the newest few).
  var STAGE_BASE = { applied: 38, screen: 9, interview: 3, offer: 0, hired: 0 };

  // Cards on the board. `age` is days since the candidate applied; `stage` is where the card starts.
  var CANDIDATES = [
    { id: 'ezekiel', name: 'Ezekiel R.', source: 'Hirewire', age: 2, stage: 'applied', hue: 210 },
    { id: 'florian', name: 'Florian M.', source: 'Referral', age: 3, stage: 'applied', hue: 25 },
    { id: 'ottoline', name: 'Ottoline B.', source: 'Careers page', age: 5, stage: 'applied', hue: 330 },
    { id: 'aurelio', name: 'Aurelio S.', source: 'Openroles', age: 6, stage: 'applied', hue: 160 },
    { id: 'octavia', name: 'Octavia L.', source: 'Campusline', age: 8, stage: 'screen', hue: 270 },
    { id: 'jovan', name: 'Jovan T.', source: 'Referral', age: 9, stage: 'screen', hue: 45 },
    { id: 'kaori', name: 'Kaori N.', source: 'Hirewire', age: 11, stage: 'screen', hue: 190 },
    { id: 'ramona', name: 'Ramona D.', source: 'Referral', age: 16, stage: 'interview', hue: 5, score: 3.4 },
    { id: 'tanvir', name: 'Tanvir H.', source: 'Openroles', age: 18, stage: 'interview', hue: 120, score: 3.1 },
    { id: 'esmeralda', name: 'Esmeralda P.', source: 'Careers page', age: 19, stage: 'offer', hue: 300, score: 3.7 },
    { id: 'keziah', name: 'Keziah W.', source: 'Referral', age: 27, stage: 'hired', hue: 80, score: 3.6 }
  ];

  // Projected time to hire: for every card in Offer or Hired, its age plus the days its stage usually still
  // takes, averaged and rounded. Offer adds 4 days (offer out, signed, start date agreed).
  var STAGE_REMAINING = { offer: 4, hired: 0 };
  var TIME_TO_HIRE_TARGET = 30; // days

  /* ------------------------------------------------------------------
   * Structured interview scorecard (index.html preview, product.html)
   * ------------------------------------------------------------------ */
  // Weights add up to 100. Ratings run 1–4.
  var COMPETENCIES = [
    { id: 'empathy', name: 'Customer empathy', weight: 30, prompt: 'Tell me about a customer you turned around.', rating: 4 },
    { id: 'problem', name: 'Problem solving', weight: 25, prompt: 'Walk me through how you diagnosed a renewal at risk.', rating: 3 },
    { id: 'communication', name: 'Communication', weight: 20, prompt: 'Explain a product limit to a frustrated admin.', rating: 3 },
    { id: 'craft', name: 'Product knowledge', weight: 15, prompt: 'Demo one workflow you know well, in five minutes.', rating: 2 },
    { id: 'collaboration', name: 'Collaboration', weight: 10, prompt: 'When did you hand a problem to engineering well?', rating: 4 }
  ];
  var RATING_LABELS = { 1: 'Strong no', 2: 'No', 3: 'Yes', 4: 'Strong yes' };
  // Weighted score (1.00–4.00) to recommendation, highest first.
  var RECOMMENDATIONS = [
    { min: 3.5, label: 'Strong hire', tone: 'hired' },
    { min: 2.75, label: 'Hire', tone: 'screen' },
    { min: 2, label: 'No hire', tone: 'offer' },
    { min: 0, label: 'Strong no hire', tone: 'danger' }
  ];

  /* ------------------------------------------------------------------
   * Job boards (product.html)
   * ------------------------------------------------------------------ */
  // `price` is for a 30-day posting in US dollars; `applicants` is the typical number per posting.
  var BOARDS = [
    { id: 'careers', name: 'Your careers page', price: 0, applicants: 12, note: 'Always on', locked: true, on: true },
    { id: 'hirewire', name: 'Hirewire', price: 0, applicants: 30, note: 'General', on: true },
    { id: 'openroles', name: 'Openroles', price: 0, applicants: 18, note: 'General', on: true },
    { id: 'campusline', name: 'Campusline', price: 0, applicants: 9, note: 'Early career' },
    { id: 'vetbridge', name: 'Vetbridge', price: 0, applicants: 5, note: 'Veterans' },
    { id: 'gigspring', name: 'Gigspring', price: 89, applicants: 22, note: 'Hourly and shift roles' },
    { id: 'talentcast', name: 'Talentcast', price: 179, applicants: 16, note: 'Tech and product' },
    { id: 'hirewire-plus', name: 'Hirewire Sponsored', price: 249, applicants: 40, note: 'Top of search for 30 days' }
  ];
  var POSTING_LOCATIONS = {
    lexington: 'Lexington, KY · On-site',
    hybrid: 'Lexington, KY · Hybrid (3 days in office)',
    remote: 'Remote · United States'
  };

  /* ------------------------------------------------------------------
   * Interview scheduling (product.html)
   * ------------------------------------------------------------------ */
  // Working hours are local to each interviewer. `busy` blocks are [business day, 'HH:MM', 'HH:MM'] in the
  // interviewer's own time, where business day 0 is the first weekday after today (Eastern time).
  var WORK_HOURS = ['09:00', '17:00'];
  var INTERVIEWERS = [
    { id: 'estelle', name: 'Estelle Fairbanks', role: 'Hiring manager', zone: 'America/New_York', city: 'Lexington', on: true,
      busy: [[0, '09:00', '12:00'], [1, '13:00', '15:00']] },
    { id: 'renzo', name: 'Renzo Albrecht', role: 'Senior CSM', zone: 'America/Chicago', city: 'Peoria', on: true,
      busy: [[0, '13:00', '17:00'], [2, '09:00', '12:00']] },
    { id: 'vittorio', name: 'Vittorio Eckhardt', role: 'Support lead', zone: 'America/Denver', city: 'Provo', on: true,
      busy: [[0, '09:00', '10:30'], [1, '09:00', '11:00']] },
    { id: 'ursula', name: 'Ursula Zeller', role: 'Recruiter', zone: 'America/Los_Angeles', city: 'Fresno', on: false,
      busy: [[0, '09:00', '11:00'], [1, '14:00', '17:00']] }
  ];
  var SCHEDULE_DAYS = 5;       // business days searched
  var SCHEDULE_STEP = 30;      // minutes between candidate start times
  var SCHEDULE_PROPOSALS = 3;  // slots proposed
  var DISPLAY_ZONES = {
    'America/New_York': 'Eastern',
    'America/Chicago': 'Central',
    'America/Denver': 'Mountain',
    'America/Phoenix': 'Arizona',
    'America/Los_Angeles': 'Pacific',
    'America/Anchorage': 'Alaska',
    'Pacific/Honolulu': 'Hawaii'
  };

  /* ------------------------------------------------------------------
   * Offer pay band check (product.html)
   * ------------------------------------------------------------------ */
  // The pay band for the sample offer (US dollars a year) and who approves an offer below, inside or above it.
  var OFFER_BAND = {
    min: 68000, max: 84000, sliderMin: 60000, sliderMax: 96000, step: 1000, start: 76000,
    rules: [
      { test: 'below', label: 'Below band', tone: 'offer', approvers: [
        { who: 'Estelle Fairbanks, hiring manager', when: 'approves the offer' },
        { who: 'People team', when: 'confirms the lower offer is intentional and consistent' }] },
      { test: 'inside', label: 'Inside band', tone: 'hired', approvers: [
        { who: 'Estelle Fairbanks, hiring manager', when: 'approves the offer' }] },
      { test: 'above', label: 'Above band', tone: 'danger', approvers: [
        { who: 'Estelle Fairbanks, hiring manager', when: 'approves the offer' },
        { who: 'VP of Customer Success', when: 'approves the exception' },
        { who: 'Finance', when: 'confirms the budget' }] }
    ]
  };

  /* ------------------------------------------------------------------
   * Pricing (pricing.html)
   * ------------------------------------------------------------------ */
  // Prices are per employee per month in US dollars. Annual billing takes ANNUAL_DISCOUNT off.
  var PLANS = {
    essentials: { name: 'Essentials', perEmployee: 5, blurb: 'Post jobs, run one shared pipeline and keep every candidate in one place.' },
    growth: { name: 'Growth', perEmployee: 8, blurb: 'Structured interviews, scheduling and offers for teams hiring every month.' }
  };
  var ANNUAL_DISCOUNT = 0.2;
  var MIN_EMPLOYEES = 50;     // smallest size billed (companies under 50 pay for 50)
  var MAX_EMPLOYEES = 1000;   // calculator range; Enterprise above that
  var ENTERPRISE_HINT = 750;  // from this size the calculator suggests talking to sales
  var DEFAULT_PRICING = { billing: 'annual', employees: 200, plan: 'growth', hires: 40 };

  /* ------------------------------------------------------------------
   * Customers (customers.html, home testimonials)
   * ------------------------------------------------------------------ */
  var INDUSTRIES = {
    technology: 'Technology',
    healthcare: 'Healthcare',
    financial: 'Financial services',
    logistics: 'Logistics',
    manufacturing: 'Manufacturing',
    retail: 'Retail and food',
    hospitality: 'Hospitality'
  };
  var SIZES = { s: '51–200 employees', m: '201–500 employees', l: '501–1,000 employees' };

  // `mark` is the inner SVG of a 40×40 logo mark (drawn in currentColor); `color` is its brand color.
  var CASES = [
    {
      id: 'quillmont', company: 'Quillmont Insurance', industry: 'financial', size: 'l', employees: 640, city: 'Akron, Ohio',
      color: '#2f4fb5',
      mark: '<path d="M20 6a14 14 0 1 0 9.9 23.9l4.6 4.6 3-3-4.6-4.6A14 14 0 0 0 20 6Zm0 5a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z"/>',
      headline: 'Cut time to hire from 41 to 24 days across 14 offices',
      summary: 'Quillmont moved claims and underwriting hiring off shared inboxes and onto one pipeline with weekly hiring reviews.',
      metrics: [{ before: 41, after: 24, unit: 'days', label: 'Time to hire' }, { before: 9, after: 5, unit: '', label: 'Interviews per hire' }],
      quote: 'Our branch managers stopped asking where a candidate was. They can see it, and so can the candidate.',
      person: 'Rhiannon Tolliver', role: 'VP of Talent'
    },
    {
      id: 'fernreach', company: 'Fernreach Health', industry: 'healthcare', size: 'l', employees: 910, city: 'Asheboro, North Carolina',
      color: '#127a5a',
      mark: '<path d="M20 34V14M20 22c-6 0-10-4-11-10 6 0 10 4 11 10Zm0-4c5 0 9-3 10-9-5 0-9 3-10 9Zm0 10c-5 0-8-3-9-7 5 0 8 3 9 7Z"/>',
      headline: 'Filled 212 clinic roles in a year with half the agency spend',
      summary: 'Fernreach posts nurse and front-desk roles to five boards at once and screens with short, structured phone scorecards.',
      metrics: [{ before: 46, after: 22, unit: '%', label: 'Roles filled by agencies' }, { before: 33, after: 19, unit: 'days', label: 'Time to fill' }],
      quote: 'Scorecards made our phone screens fair and fast. Every clinic manager asks the same five questions now.',
      person: 'Jarrah Fontenot', role: 'Head of Recruiting'
    },
    {
      id: 'kettleby', company: 'Kettleby Freight', industry: 'logistics', size: 'm', employees: 420, city: 'Memphis, Tennessee',
      color: '#b45309',
      mark: '<path d="M6 13h18v14H6zM24 18h6l4 5v4H24z"/><circle cx="12" cy="29" r="3"/><circle cx="29" cy="29" r="3"/>',
      headline: 'Hired 60 drivers before peak season, two weeks early',
      summary: 'Kettleby schedules road tests and yard interviews in one step, so candidates book while they are still interested.',
      metrics: [{ before: 12, after: 3, unit: 'days', label: 'Apply to first interview' }, { before: 38, after: 61, unit: '%', label: 'Offer acceptance' }],
      quote: 'Drivers book their own road test from their phone. We lost people in the gaps before.',
      person: 'Cecily Northcutt', role: 'Recruiting Manager'
    },
    {
      id: 'corvane', company: 'Corvane Robotics', industry: 'manufacturing', size: 's', employees: 180, city: 'Greenville, South Carolina',
      color: '#7c3aed',
      mark: '<path d="M20 5l13 7.5v15L20 35 7 27.5v-15z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="20" cy="20" r="5"/>',
      headline: 'Doubled engineering headcount without a second recruiter',
      summary: 'Corvane’s two-person people team runs 25 open roles with shared pipelines and interview kits for every panel.',
      metrics: [{ before: 11, after: 25, unit: '', label: 'Open roles per recruiter' }, { before: 52, after: 34, unit: 'days', label: 'Time to hire' }],
      quote: 'Interview kits mean an engineer can run a good interview on day one. That is how we scaled.',
      person: 'Odette Arrington', role: 'COO'
    },
    {
      id: 'pellworth', company: 'Pellworth Credit Union', industry: 'financial', size: 'm', employees: 310, city: 'Wichita, Kansas',
      color: '#0e7490',
      mark: '<path d="M8 16 20 8l12 8v2H8zM10 20h4v10h-4zM18 20h4v10h-4zM26 20h4v10h-4zM8 31h24v3H8z"/>',
      headline: 'Produced its first affirmative action report in a day, not a month',
      summary: 'Pellworth collects voluntary self-identification at apply and keeps it apart from hiring decisions.',
      metrics: [{ before: 22, after: 1, unit: 'days', label: 'Annual report prep' }, { before: 61, after: 88, unit: '%', label: 'Self-ID response rate' }],
      quote: 'Compliance used to be a spreadsheet hunt every spring. Now it is a filter and an export.',
      person: 'Mattias Delgadillo', role: 'Director of People Operations'
    },
    {
      id: 'hollowell', company: 'Hollowell Foods', industry: 'retail', size: 'l', employees: 750, city: 'Fort Wayne, Indiana',
      color: '#be123c',
      mark: '<path d="M20 7c7 0 12 5 12 12 0 8-7 14-12 14S8 27 8 19c0-7 5-12 12-12Z"/><path d="M20 7c0-2 2-4 5-4" fill="none" stroke="currentColor" stroke-width="2.5"/>',
      headline: 'Staffed 9 new stores with one hiring event template',
      summary: 'Hollowell runs open-house hiring days from a reusable plan: one posting, one schedule, one offer letter.',
      metrics: [{ before: 4, after: 1, unit: 'weeks', label: 'Store staffing lead time' }, { before: 27, after: 12, unit: '%', label: '90-day turnover' }],
      quote: 'A store manager can run a hiring day without calling HQ. The plan is already in Slatework.',
      person: 'Lourdes Jaramillo', role: 'HR Director'
    },
    {
      id: 'brightkiln', company: 'Brightkiln Software', industry: 'technology', size: 's', employees: 95, city: 'Lexington, Kentucky',
      color: '#c2410c',
      mark: '<path d="M8 32V18l12-10 12 10v14z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M16 32v-7a4 4 0 0 1 8 0v7z"/>',
      headline: 'Went from founder-led hiring to a real process in a week',
      summary: 'Brightkiln set up scorecards, a careers page and offer approvals before its Series B hiring push.',
      metrics: [{ before: 0, after: 100, unit: '%', label: 'Interviews with a scorecard' }, { before: 7, after: 2, unit: 'days', label: 'Offer turnaround' }],
      quote: 'We wanted a grown-up process without a grown-up implementation project. It took a week.',
      person: 'Hiroshi Lockridge', role: 'Talent Lead'
    },
    {
      id: 'sablewood', company: 'Sablewood Hotels', industry: 'hospitality', size: 'l', employees: 520, city: 'Lubbock, Texas',
      color: '#4d7c0f',
      mark: '<path d="M6 30h28M10 30V14l10-6 10 6v16"/><path d="M15 30v-6h10v6M15 17h3v3h-3zM22 17h3v3h-3z" fill="#fff"/>',
      headline: 'Answered every applicant within 48 hours, across six hotels',
      summary: 'Sablewood uses stage reminders and bulk replies so no front-desk or kitchen applicant goes unanswered.',
      metrics: [{ before: 9, after: 2, unit: 'days', label: 'First reply to applicants' }, { before: 3.1, after: 4.6, unit: '/5', label: 'Candidate rating' }],
      quote: 'Candidates are guests too. Now every one of them hears back from us within two days.',
      person: 'Orlando Vandermeer', role: 'VP of People'
    }
  ];

  /* ------------------------------------------------------------------
   * Integrations (integrations.html)
   * ------------------------------------------------------------------ */
  var INT_CATEGORIES = {
    hris: 'HRIS and payroll',
    calendar: 'Calendars and video',
    boards: 'Job boards',
    background: 'Background checks',
    assessments: 'Assessments',
    esign: 'E-signature',
    messaging: 'Messaging'
  };
  // `mark` is the inner SVG of a 40×40 tile drawn in white on `bg`. `syncs` lists what moves between the tools.
  var INTEGRATIONS = [
    { id: 'payroster', name: 'Payroster', category: 'hris', bg: '#1e6b52', setup: '10 minutes', direction: 'Two-way',
      blurb: 'Send hired candidates to payroll with their start date, pay and manager filled in.',
      syncs: ['New hire record on offer signed', 'Departments and locations', 'Manager list for approvals'],
      mark: '<path d="M11 13h18M11 20h18M11 27h10" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="28" cy="27" r="3" fill="#fff"/>' },
    { id: 'peoplegrid', name: 'Peoplegrid', category: 'hris', bg: '#3a3fd0', setup: '15 minutes', direction: 'Two-way',
      blurb: 'Keep your org chart, departments and open headcount in step with your requisitions.',
      syncs: ['Approved headcount opens a req', 'Employee directory for referrals', 'Hire creates a worker profile'],
      mark: '<circle cx="14" cy="14" r="4" fill="#fff"/><circle cx="26" cy="14" r="4" fill="#fff"/><circle cx="14" cy="26" r="4" fill="#fff"/><circle cx="26" cy="26" r="4" fill="none" stroke="#fff" stroke-width="2.5"/>' },
    { id: 'benefold', name: 'Benefold', category: 'hris', bg: '#b0476b', setup: '20 minutes', direction: 'One-way',
      blurb: 'Start benefits enrollment for new hires the day their offer is signed.',
      syncs: ['New hire and start date', 'Employment type and hours'],
      mark: '<path d="M12 11h16v18l-8-5-8 5z" fill="#fff"/>' },
    { id: 'paystave', name: 'Paystave', category: 'hris', bg: '#0f5f78', setup: '10 minutes', direction: 'One-way',
      blurb: 'Pull pay bands into offers so every number is inside its range before approval.',
      syncs: ['Pay bands by level and location', 'Offer amount checked against band'],
      mark: '<path d="M10 14h20M10 20h20M10 26h20" stroke="#fff" stroke-width="1.6" opacity=".6"/><path d="M24 11c-2-2-8-2-8 2 0 5 9 3 9 8 0 4-7 4-9 2M20 9v24" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>' },
    { id: 'dayplane', name: 'Dayplane Calendar', category: 'calendar', bg: '#c2410c', setup: '2 minutes', direction: 'Two-way',
      blurb: 'Read interviewer free and busy times and put confirmed interviews on everyone’s calendar.',
      syncs: ['Free and busy times', 'Interview invites with the kit link', 'Reschedules and cancellations'],
      mark: '<rect x="9" y="12" width="22" height="19" rx="3" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M9 18h22M15 9v6M25 9v6" stroke="#fff" stroke-width="2.6"/><path d="M15 27l10-5-4 7-1-3z" fill="#fff"/>' },
    { id: 'meetloom', name: 'Meetloom', category: 'calendar', bg: '#6b3fa0', setup: '2 minutes', direction: 'One-way',
      blurb: 'Add a video room to every remote interview, with the candidate’s name in the title.',
      syncs: ['A unique room per interview', 'Room link in the invite and reminder'],
      mark: '<circle cx="16" cy="20" r="7" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="20" r="7" fill="none" stroke="#fff" stroke-width="3"/>' },
    { id: 'timelace', name: 'Timelace', category: 'calendar', bg: '#2c7a8c', setup: '5 minutes', direction: 'Two-way',
      blurb: 'Shared team calendars for panel interviews and hiring days, with room booking.',
      syncs: ['Team and room calendars', 'Panel holds while scheduling'],
      mark: '<circle cx="20" cy="20" r="11" fill="none" stroke="#fff" stroke-width="2.8"/><path d="M20 13v7l5 3" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round"/>' },
    { id: 'facetable', name: 'Facetable', category: 'calendar', bg: '#374151', setup: '3 minutes', direction: 'One-way',
      blurb: 'One-way video answers for high-volume screens, scored on the same scorecard.',
      syncs: ['Video answers attached to the candidate', 'Ratings on the screen scorecard'],
      mark: '<rect x="8" y="10" width="24" height="17" rx="2.5" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="20" cy="17" r="3" fill="#fff"/><path d="M15 24c1-3 9-3 10 0M15 31h10" stroke="#fff" stroke-width="2.4" fill="none"/>' },
    { id: 'hirewire', name: 'Hirewire', category: 'boards', bg: '#b91c1c', setup: 'Built in', direction: 'Two-way',
      blurb: 'Post to the biggest general job board for free, with applications straight into your pipeline.',
      syncs: ['Job posts and closing dates', 'Applications with résumés', 'Sponsored posts billed through Slatework'],
      mark: '<path d="M22 8 12 22h8l-2 10 10-14h-8z" fill="#fff"/>' },
    { id: 'openroles', name: 'Openroles', category: 'boards', bg: '#0e7490', setup: 'Built in', direction: 'Two-way',
      blurb: 'A free board with strong reach for professional and office roles.',
      syncs: ['Job posts', 'Applications with screening answers'],
      mark: '<path d="M12 32V9h16v23" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M12 9l9 4v21l-9-2z" fill="#fff"/>' },
    { id: 'campusline', name: 'Campusline', category: 'boards', bg: '#7c2d12', setup: 'Built in', direction: 'Two-way',
      blurb: 'Reach students and recent graduates through career centers.',
      syncs: ['Internship and new-grad posts', 'Applications with graduation dates'],
      mark: '<path d="M20 10 6 17l14 7 14-7z" fill="#fff"/><path d="M12 21v6c4 3 12 3 16 0v-6M32 18v8" stroke="#fff" stroke-width="2.4" fill="none"/>' },
    { id: 'vetbridge', name: 'Vetbridge', category: 'boards', bg: '#1f3a8a', setup: 'Built in', direction: 'Two-way',
      blurb: 'Post to a board for veterans and military spouses, free for every plan.',
      syncs: ['Job posts', 'Applications with service details the candidate shares'],
      mark: '<path d="M6 28c4-12 24-12 28 0" fill="none" stroke="#fff" stroke-width="3"/><path d="M6 28h28M12 28v-6M20 28v-9M28 28v-6" stroke="#fff" stroke-width="2.4"/>' },
    { id: 'gigspring', name: 'Gigspring', category: 'boards', bg: '#4d7c0f', setup: 'Built in', direction: 'Two-way',
      blurb: 'Paid board for hourly, shift and seasonal roles with one-tap apply.',
      syncs: ['Shift details and pay', 'Mobile applications', 'Availability answers'],
      mark: '<path d="M13 30c0-3 14-2 14-5s-14-2-14-5 14-2 14-5-14-2-14-5" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>' },
    { id: 'talentcast', name: 'Talentcast', category: 'boards', bg: '#9d174d', setup: 'Built in', direction: 'Two-way',
      blurb: 'Paid board for software, product and design roles.',
      syncs: ['Job posts with stack tags', 'Applications with portfolio links'],
      mark: '<circle cx="20" cy="22" r="3.5" fill="#fff"/><path d="M13 15a10 10 0 0 0 0 14M27 15a10 10 0 0 1 0 14M9 11a15 15 0 0 0 0 22M31 11a15 15 0 0 1 0 22" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' },
    { id: 'verilane', name: 'Verilane', category: 'background', bg: '#0f766e', setup: '1 day', direction: 'Two-way',
      blurb: 'Order background checks with the candidate’s consent, and see results on their profile.',
      syncs: ['Check ordered when an offer is accepted', 'Status and completed report', 'Adverse action steps'],
      mark: '<path d="M20 7l11 4v8c0 7-5 12-11 14-6-2-11-7-11-14v-8z" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M15 20l4 4 7-8" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round"/>' },
    { id: 'veritrace', name: 'Veritrace', category: 'background', bg: '#475569', setup: '1 day', direction: 'Two-way',
      blurb: 'Employment and education verification, plus driving records for road roles.',
      syncs: ['Verification requests', 'Results attached to the candidate'],
      mark: '<circle cx="18" cy="18" r="8" fill="none" stroke="#fff" stroke-width="2.8"/><path d="M24 24l8 8" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M14 18h8M18 14v8" stroke="#fff" stroke-width="2"/>' },
    { id: 'codetrial', name: 'Codetrial', category: 'assessments', bg: '#1f2937', setup: '10 minutes', direction: 'Two-way',
      blurb: 'Send a take-home or live coding exercise from the pipeline and see the result on the scorecard.',
      syncs: ['Exercise invites', 'Scores and reviewer notes'],
      mark: '<path d="M15 13l-7 7 7 7M25 13l7 7-7 7M22 10l-4 20" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>' },
    { id: 'skillwright', name: 'Skillwright', category: 'assessments', bg: '#a16207', setup: '10 minutes', direction: 'Two-way',
      blurb: 'Short job-related skills tests for support, sales and operations roles.',
      syncs: ['Test invites by stage', 'Scores against your pass mark'],
      mark: '<path d="M10 30h20M13 30V20M20 30V13M27 30v-6" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>' },
    { id: 'inksign', name: 'Inksign', category: 'esign', bg: '#1d4ed8', setup: '5 minutes', direction: 'Two-way',
      blurb: 'Send offer letters for e-signature and move the candidate to Hired when they sign.',
      syncs: ['Offer letter from your template', 'Signed copy saved to the profile'],
      mark: '<path d="M20 8l7 10-7 12-7-12z" fill="#fff"/><circle cx="20" cy="19" r="2" fill="#1d4ed8"/><path d="M9 33h22" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' },
    { id: 'docuquill', name: 'Docuquill', category: 'esign', bg: '#854d0e', setup: '5 minutes', direction: 'One-way',
      blurb: 'Collect signed policies and new-hire forms alongside the offer.',
      syncs: ['Document packets on offer accepted', 'Completion status'],
      mark: '<path d="M30 8C18 10 12 20 11 31l3-1c2-7 6-12 12-15-5 1-9 4-11 8 2-8 8-12 15-15z" fill="#fff"/>' },
    { id: 'pingwell', name: 'Pingwell', category: 'messaging', bg: '#047857', setup: '2 minutes', direction: 'Two-way',
      blurb: 'Get pinged when a scorecard is due, and approve offers without leaving chat.',
      syncs: ['Scorecard reminders', 'Offer approvals', 'New referral alerts'],
      mark: '<path d="M9 12a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H17l-6 5v-5h0a3 3 0 0 1-2-3z" fill="#fff"/><circle cx="20" cy="17.5" r="2.4" fill="#047857"/>' },
    { id: 'huddlepost', name: 'Huddlepost', category: 'messaging', bg: '#a21caf', setup: '2 minutes', direction: 'One-way',
      blurb: 'Post new hires and open referrals to a team channel automatically.',
      syncs: ['Welcome posts on start date', 'Open roles to share'],
      mark: '<circle cx="14" cy="16" r="5" fill="#fff"/><circle cx="26" cy="16" r="5" fill="#fff" opacity=".7"/><path d="M7 31c1-5 5-8 9-8M33 31c-1-5-5-8-9-8M14 31c1-4 3-6 6-6s5 2 6 6" stroke="#fff" stroke-width="2.4" fill="none"/>' }
  ];

  /* ------------------------------------------------------------------
   * Security (security.html): candidate data retention
   * ------------------------------------------------------------------ */
  // Months after a candidate's last activity before their profile is anonymized. Choices shown in the
  // retention example; `note` explains when you might pick each.
  var RETENTION = {
    '12': { months: 12, note: 'A common choice when you rarely reopen old candidates.' },
    '24': { months: 24, note: 'Our default. Covers most federal record-keeping periods for applicants.' },
    '36': { months: 36, note: 'For teams that rehire seasonally and keep a talent pool.' }
  };
  var DEFAULT_RETENTION = '24';

  /* ------------------------------------------------------------------
   * Resources (resources.html)
   * ------------------------------------------------------------------ */
  var TOPICS = { interviews: 'Structured interviews', operations: 'Hiring operations', compliance: 'Compliance', reporting: 'Reporting' };
  // Past posts keep their real dates.
  var POSTS = [
    { id: 'scorecards-that-get-used', topic: 'interviews', date: '2026-10-28', minutes: 7, author: 'Graciela Ochoa', role: 'Head of People Science',
      title: 'Scorecards Interviewers Actually Fill In',
      excerpt: 'Five competencies, four ratings and one question each. Why shorter scorecards produce better hiring decisions.',
      body: ['Most scorecards fail because they ask too much. When an interviewer faces twelve competencies and a free-text box for each, they write “good culture fit” and move on.', 'We looked at 40,000 scorecards submitted in Slatework last quarter. Scorecards with five or fewer competencies were submitted a median of 3 hours after the interview. Scorecards with ten or more took 26 hours, and a third were never submitted at all.', 'Start with the four or five things the role cannot succeed without, weight them honestly, and give each interviewer one question to own. Then let the weighted total make the first recommendation, and let the debrief argue with it.'] },
    { id: 'pay-ranges-in-postings', topic: 'compliance', date: '2026-10-14', minutes: 6, author: 'Bronwyn Yarbrough', role: 'Customer Education',
      title: 'Pay Ranges in Job Postings: A Practical Checklist',
      excerpt: 'More states and cities now expect a pay range in postings. A short checklist for multi-state employers.',
      body: ['A growing number of states and cities expect employers to include a good-faith pay range in job postings, and some apply the rule to remote roles that could be filled by someone living there.', 'If you hire in more than one state, the simplest approach is to include a range on every posting. Keep the range honest: the band you would actually pay for the role and level, not the widest number you can defend.', 'This post is general information, not legal advice. Rules change and differ by location, so check the current requirements for every place you hire with your own counsel.'] },
    { id: 'hiring-review-meeting', topic: 'operations', date: '2026-09-30', minutes: 5, author: 'Demetrius Kincannon', role: 'Co-founder and CTO',
      title: 'Run a 20-Minute Weekly Hiring Review',
      excerpt: 'One meeting, one board, three questions. How our customers keep 30 open roles moving without status emails.',
      body: ['The best-run hiring teams we work with have one thing in common: a short weekly review where the board is the agenda.', 'Sort by days in stage. For every candidate stuck more than five days, ask three questions: what is the next step, who owns it, and when will it happen. Then close the meeting.', 'Twenty minutes a week replaces dozens of “any update?” messages, and candidates notice the difference.'] },
    { id: 'time-to-hire-honestly', topic: 'reporting', date: '2026-09-16', minutes: 8, author: 'Graciela Ochoa', role: 'Head of People Science',
      title: 'Measuring Time to Hire Without Fooling Yourself',
      excerpt: 'Time to hire, time to fill and time in stage answer different questions. Which one to show your leadership team.',
      body: ['Time to fill starts when a role is approved. Time to hire starts when a candidate applies. Mixing them up is the most common reason hiring reports disagree.', 'Report time to hire for the candidate experience and time to fill for workforce planning. Then add time in stage, because it tells you where to act.', 'Medians beat averages here: one executive search that took 140 days should not hide the fact that most roles close in under a month.'] },
    { id: 'interview-kits', topic: 'interviews', date: '2026-08-26', minutes: 6, author: 'Bronwyn Yarbrough', role: 'Customer Education',
      title: 'Interview Kits for First-Time Interviewers',
      excerpt: 'A one-page kit that turns a nervous engineer into a consistent interviewer before their first panel.',
      body: ['New interviewers are not bad at interviewing. They are unprepared. A kit fixes that: the role summary, the one competency they own, two questions, what a strong answer sounds like, and the rating scale.', 'Kits also protect candidates. When every interviewer asks job-related questions from the same kit, you avoid the improvised questions that cause legal and fairness problems.', 'Build the kit once per role, attach it to the interview, and Slatework puts it in the calendar invite.'] },
    { id: 'eeo-data-basics', topic: 'compliance', date: '2026-08-12', minutes: 7, author: 'Graciela Ochoa', role: 'Head of People Science',
      title: 'Voluntary Self-ID Data: Collect It, Separate It, Report It',
      excerpt: 'How to collect voluntary demographic data at apply without it touching a hiring decision.',
      body: ['Federal contractors and larger employers may need applicant demographic data for their reports. The data has to be voluntary and kept apart from the people making hiring decisions.', 'In Slatework, self-identification answers are stored separately from the profile and are visible only to roles with reporting access. Interviewers and hiring managers never see them.', 'This is general information, not legal advice. Your obligations depend on your size, contracts and locations, so confirm them with your counsel.'] }
  ];

  // Live webinars: the second Thursday of each month at 1:00 PM Eastern. The next WEBINAR_COUNT sessions
  // at least WEBINAR_MIN_DAYS away are shown, with these topics in turn (by month number).
  // Set WEBINAR_DATES to fixed 'YYYY-MM-DD' strings to show fixed dates instead of the rolling rule.
  var WEBINAR_DATES = null;
  var WEBINAR_TIME = '13:00';
  var WEBINAR_COUNT = 3;
  var WEBINAR_MIN_DAYS = 3;
  var WEBINAR_TOPICS = [
    { title: 'Structured interviews in 30 minutes', host: 'Graciela Ochoa' },
    { title: 'Building a hiring report your CFO trusts', host: 'Demetrius Kincannon' },
    { title: 'Moving off spreadsheets: a migration walkthrough', host: 'Bronwyn Yarbrough' },
    { title: 'Offers, approvals and pay bands', host: 'Bronwyn Yarbrough' }
  ];

  /* ------------------------------------------------------------------
   * Demo request (demo.html)
   * ------------------------------------------------------------------ */
  // Personal email domains the form asks people to swap for a work address.
  var PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'proton.me', 'live.com'];
  var COMPANY_SIZES = { s1: '50–200', s2: '201–500', s3: '501–1,000', s4: 'More than 1,000' };
  // The meeting time proposed after a request: the first weekday at least DEMO_LEAD_DAYS ahead, at the
  // preferred Eastern time.
  var DEMO_LEAD_DAYS = 1;
  var DEMO_TIMES = { morning: '10:00', afternoon: '14:00' };

  return {
    COMPANY: COMPANY, STAGES: STAGES, REQ: REQ, STAGE_BASE: STAGE_BASE, CANDIDATES: CANDIDATES,
    STAGE_REMAINING: STAGE_REMAINING, TIME_TO_HIRE_TARGET: TIME_TO_HIRE_TARGET,
    COMPETENCIES: COMPETENCIES, RATING_LABELS: RATING_LABELS, RECOMMENDATIONS: RECOMMENDATIONS,
    BOARDS: BOARDS, POSTING_LOCATIONS: POSTING_LOCATIONS,
    WORK_HOURS: WORK_HOURS, INTERVIEWERS: INTERVIEWERS, SCHEDULE_DAYS: SCHEDULE_DAYS, SCHEDULE_STEP: SCHEDULE_STEP,
    SCHEDULE_PROPOSALS: SCHEDULE_PROPOSALS, DISPLAY_ZONES: DISPLAY_ZONES, OFFER_BAND: OFFER_BAND,
    PLANS: PLANS, ANNUAL_DISCOUNT: ANNUAL_DISCOUNT, MIN_EMPLOYEES: MIN_EMPLOYEES, MAX_EMPLOYEES: MAX_EMPLOYEES,
    ENTERPRISE_HINT: ENTERPRISE_HINT, DEFAULT_PRICING: DEFAULT_PRICING,
    INDUSTRIES: INDUSTRIES, SIZES: SIZES, CASES: CASES,
    INT_CATEGORIES: INT_CATEGORIES, INTEGRATIONS: INTEGRATIONS,
    RETENTION: RETENTION, DEFAULT_RETENTION: DEFAULT_RETENTION,
    TOPICS: TOPICS, POSTS: POSTS, WEBINAR_DATES: WEBINAR_DATES, WEBINAR_TIME: WEBINAR_TIME, WEBINAR_COUNT: WEBINAR_COUNT,
    WEBINAR_MIN_DAYS: WEBINAR_MIN_DAYS, WEBINAR_TOPICS: WEBINAR_TOPICS,
    PERSONAL_DOMAINS: PERSONAL_DOMAINS, COMPANY_SIZES: COMPANY_SIZES, DEMO_LEAD_DAYS: DEMO_LEAD_DAYS, DEMO_TIMES: DEMO_TIMES
  };
})();
