/* Mosaic: the programme, rooms and settings. Edit this file to make the site yours (see DOCS.md, Content).
 *
 * Every date on the site is worked out in the browser from the rules below, in UK time (Europe/London),
 * so the programme never goes out of date. There are no fixed event dates to update.
 */
window.MOSAIC_DATA = (function () {
  'use strict';

  var CENTRE = {
    name: 'Mosaic',
    longName: 'Mosaic Community Arts Centre',
    address: 'The Old Dyeworks, Market Street, Ulverston, Cumbria LA12',
    phone: '01632 960731',
    email: 'hello@mosaic.example',
    uidDomain: 'mosaic.example' // used in the UID of downloaded .ics files
  };

  // Welcome desk hours, by weekday (0 = Sunday). null = closed (sessions may still run).
  var HOURS = {
    0: { open: '11:00', close: '16:00' },
    1: null,
    2: { open: '10:00', close: '17:00' },
    3: { open: '10:00', close: '17:00' },
    4: { open: '10:00', close: '21:00' },
    5: { open: '10:00', close: '17:00' },
    6: { open: '10:00', close: '17:00' }
  };

  // Every year the building closes from 24 December to 1 January (inclusive). Nothing is listed then.
  var WINTER_BREAK = { from: { month: 12, day: 24 }, to: { month: 1, day: 1 } };

  // Programme categories. `tone` picks the colours of tags and artwork (see CATEGORY_TONES in main.js).
  var CATEGORIES = {
    print: { label: 'Print & drawing', tone: 'vermilion' },
    clay: { label: 'Ceramics', tone: 'ochre' },
    textile: { label: 'Textiles', tone: 'rose' },
    music: { label: 'Music & words', tone: 'violet' },
    family: { label: 'Family', tone: 'sky' },
    exhibition: { label: 'Exhibitions', tone: 'teal' },
    film: { label: 'Film', tone: 'ink' },
    studio: { label: 'Open studios & socials', tone: 'leaf' }
  };

  // Who a listing is for. Shown on cards and used by the age filter.
  var AGES = {
    all: 'All ages',
    under5: 'Under 5s with a grown-up',
    kids: 'Ages 5–11 with a grown-up',
    teens: 'Ages 14 and over',
    adults: 'Adults (16+)'
  };
  // The age filter on whats-on.html (?age=). Each option lists the AGES keys it shows.
  var AGE_FILTERS = {
    any: { label: 'Any age', match: null },
    children: { label: 'Children', match: ['all', 'under5', 'kids'] },
    teens: { label: 'Teenagers', match: ['all', 'teens'] },
    adults: { label: 'Adults', match: ['all', 'teens', 'adults'] }
  };
  // The price filter (?price=).
  var PRICE_FILTERS = {
    any: 'Any price',
    free: 'Free',
    under10: '£10 or less',
    pwyc: 'Pay what you can'
  };

  // Rooms in the building. Rooms with `hire` appear on hire.html (rates per hour, before any discount).
  var ROOMS = {
    'print-room': { name: 'The Print Room', hire: { rate: 26, seated: 14, standing: 20, size: '48 m²' } },
    'clay-studio': { name: 'The Clay Studio' },
    'yard-room': { name: 'The Yard Room', hire: { rate: 38, seated: 60, standing: 90, size: '96 m²' } },
    snug: { name: 'The Snug', hire: { rate: 18, seated: 10, standing: 12, size: '22 m²' } },
    foyer: { name: 'The Foyer Gallery' },
    ground: { name: 'The whole ground floor', hire: { rate: 72, seated: 90, standing: 140, size: '210 m²' } }
  };
  // Hire extras (flat fee per booking) and the discount for community groups and charities.
  var HIRE_EXTRAS = {
    projector: { label: 'Projector and screen', price: 15 },
    pa: { label: 'PA system and two microphones', price: 25 },
    kitchen: { label: 'Kitchen use (tea, coffee and urns)', price: 12 },
    clear: { label: 'We set up and clear away for you', price: 30 }
  };
  var HIRE = { minHours: 2, maxHours: 10, firstStart: 8, lastEnd: 22, communityDiscount: 0.3, eveningSurcharge: 0.15, eveningFrom: 18 };

  /* The programme. Each listing repeats by a rule:
       { every: 'week', day: 2 }                     every Tuesday (0 = Sunday ... 6 = Saturday)
       { every: 'month', nth: [1], day: 0 }          first Sunday of the month
       { every: 'month', nth: [2, 4], day: 0 }       second and fourth Sunday
       { every: 'month', nth: [-1], day: 5 }         last Friday of the month
     Exhibitions have no rule: they take turns in the gallery (see GALLERY below).
     price is in pounds (0 = free); `per` says what it is per; `pwyc` = pay what you can. */
  var LISTINGS = [
    {
      id: 'lino-tuesdays', title: 'Lino printing: Tuesday class', cat: 'print', workshop: true,
      rule: { every: 'week', day: 2 }, start: '19:00', end: '21:00', room: 'print-room', host: 'Dorcas Satterthwaite',
      price: 16, per: 'session', ages: 'adults', level: 'Beginners welcome', places: 10, booking: 'book',
      summary: 'Cut, ink and pull your own relief prints on our 1950s proofing press. Each week builds on the last, but you can join any Tuesday.',
      body: [
        'Dorcas starts each class with a short demonstration, then you work on your own block with help on hand. First-timers make a single-colour print of a leaf, a house or a favourite mug; returners move on to reduction prints and registration.',
        'Lino, tools, inks and paper are included, and so is the tea. You take your block and prints home at the end of the night.'
      ],
      bring: ['Clothes you don’t mind getting inky', 'An idea or a photo to work from (optional)'],
      included: ['Lino, cutting tools and a bench hook', 'Water-based inks and printing paper', 'Use of the proofing press']
    },
    {
      id: 'zine-day', title: 'Zines and risograph day', cat: 'print', workshop: true,
      rule: { every: 'month', nth: [1], day: 0 }, start: '10:30', end: '15:30', room: 'print-room', host: 'Dorcas Satterthwaite',
      price: 35, per: 'person', ages: 'teens', level: 'No experience needed', places: 12, booking: 'book',
      summary: 'Write, draw and collage an eight-page zine in the morning, then print a run of twenty on the risograph after lunch.',
      body: [
        'A long, sociable day for anyone with something to say: a recipe, a walk, a rant, a family story. We fold, cut and paste in the morning, and after lunch you print your zine in two colours on our riso.',
        'You leave with twenty copies to swap, sell or post through letterboxes. Lunch is not included; Market Street has plenty of cafés, or bring your own and eat in the yard.'
      ],
      bring: ['Pictures, words or old magazines to cut up', 'A packed lunch if you like'],
      included: ['Paper, glue, scissors and pens', 'Two-colour risograph printing', 'Twenty finished copies']
    },
    {
      id: 'life-drawing', title: 'Wednesday life drawing', cat: 'print', workshop: true,
      rule: { every: 'week', day: 3 }, start: '19:00', end: '21:00', room: 'yard-room', host: 'Dorcas Satterthwaite',
      price: 9, per: 'session', ages: 'adults', level: 'Untutored, all levels', places: 24, booking: 'drop-in',
      summary: 'Two hours of drawing from a professional model, from one-minute warm-ups to a long final pose. Easels, boards and charcoal provided.',
      body: [
        'An untutored session with a friendly host who keeps time and changes the music. Beginners sit next to people who have drawn here for years, and nobody looks at your sketchbook unless you ask.',
        'Bring your own materials or use ours: newsprint, charcoal, pencils and a few tubes of ink are on the side table.'
      ],
      bring: ['A sketchbook or your own materials (optional)'],
      included: ['Easels and drawing boards', 'Newsprint, charcoal and pencils', 'Tea at the break']
    },
    {
      id: 'clay-thursdays', title: 'Hand-building with clay', cat: 'clay', workshop: true,
      rule: { every: 'week', day: 4 }, start: '18:30', end: '20:30', room: 'clay-studio', host: 'Fintan Holme',
      price: 22, per: 'session', ages: 'adults', level: 'Beginners welcome', places: 10, booking: 'book',
      summary: 'Pinch, coil and slab-build mugs, bowls and planters at the big shared table. No wheel, no pressure.',
      body: [
        'Fintan shows a new technique each week and helps you adapt it to whatever you have in mind. Your pieces dry on the studio shelves, then go through a biscuit firing and a glaze firing in our kiln.',
        'Fired work is ready to collect about four weeks later. We send a message when it comes out of the kiln.'
      ],
      bring: ['Short nails help', 'An apron or an old shirt'],
      included: ['1 kg of stoneware clay a session', 'Tools, glazes and two firings']
    },
    {
      id: 'wheel-taster', title: 'Potter’s wheel taster', cat: 'clay', workshop: true,
      rule: { every: 'month', nth: [2, 4], day: 0 }, start: '14:00', end: '16:30', room: 'clay-studio', host: 'Fintan Holme',
      price: 32, per: 'person', ages: 'teens', level: 'Complete beginners', places: 6, booking: 'book',
      summary: 'Two and a half hours on the wheel with six people and one patient potter. Centre, open and throw your first pots.',
      body: [
        'Everyone has a wheel to themselves. Fintan breaks throwing down into small steps, and nobody minds how many pots collapse on the way to the one you keep.',
        'Choose your best two pieces to be trimmed, glazed and fired. They are ready to collect about four weeks later.'
      ],
      bring: ['Clothes that can get splashed', 'A towel'],
      included: ['Clay, aprons and tools', 'Glazing and firing of two pots']
    },
    {
      id: 'stitch-mend', title: 'Stitch and mend social', cat: 'textile', workshop: true,
      rule: { every: 'week', day: 3 }, start: '13:00', end: '15:00', room: 'snug', host: 'Mags Dalzell',
      price: 0, per: 'session', pwyc: true, ages: 'all', level: 'All levels', places: 14, booking: 'drop-in',
      summary: 'Bring a hole, a hem or a half-finished quilt. Visible mending, darning and tea at the long table in the Snug.',
      body: [
        'Mags and a few regulars share threads, patches and tips for the repairs that make clothes last. Bring something of your own or practise on our scrap basket.',
        'It is a drop-in, so come for twenty minutes or the whole two hours. Children are welcome with a grown-up.'
      ],
      bring: ['Something to mend (optional)'],
      included: ['Threads, needles and darning mushrooms', 'Fabric scraps for patches', 'Tea and biscuits']
    },
    {
      id: 'natural-dye', title: 'Natural dyeing with plants', cat: 'textile', workshop: true,
      rule: { every: 'month', nth: [3], day: 6 }, start: '10:00', end: '13:00', room: 'clay-studio', host: 'Mags Dalzell',
      price: 28, per: 'person', ages: 'adults', level: 'Beginners welcome', places: 12, booking: 'book',
      summary: 'Simmer onion skins, avocado stones and dyer’s chamomile, and leave with a sampler of wool and cotton in a dozen colours.',
      body: [
        'Natural dyeing is part kitchen, part chemistry set. Mags explains mordants and modifiers without the jargon, and you dye a skein of wool and a cotton scarf to take home.',
        'Everything is plant-based and we work with the doors open to the yard.'
      ],
      bring: ['Rubber gloves if you have a favourite pair', 'Onion skins saved from your kitchen (optional)'],
      included: ['Wool, a cotton scarf and all dye materials', 'Printed notes to try it at home']
    },
    {
      id: 'singers', title: 'Market Street Singers', cat: 'music', workshop: true,
      rule: { every: 'week', day: 1 }, start: '19:30', end: '21:00', room: 'yard-room', host: 'Iolo Moorby',
      price: 5, per: 'session', pwyc: true, ages: 'all', level: 'No auditions, no reading music', places: 60, booking: 'drop-in',
      summary: 'Our community choir learns songs by ear: folk, soul, a bit of pop and the odd round. Everyone sings, nobody auditions.',
      body: [
        'Iolo teaches every part line by line, so you don’t need to read music or know whether you are an alto. Most weeks end with a run-through that sounds far better than anyone expected.',
        'We sing at the Christmas lights and in the yard in summer, but performing is always optional.'
      ],
      bring: ['A bottle of water'],
      included: ['Lyric sheets and practice recordings']
    },
    {
      id: 'folk-session', title: 'Back-room folk session', cat: 'music',
      rule: { every: 'month', nth: [-1], day: 5 }, start: '19:30', end: '22:00', room: 'snug', host: 'Iolo Moorby',
      price: 0, per: 'person', ages: 'all', level: 'Players and listeners', places: 30, booking: 'drop-in',
      summary: 'Fiddles, whistles, a squeezebox or two and plenty of tunes. Bring an instrument or just pull up a chair.',
      body: [
        'An informal session in the Snug, led by whoever starts the next tune. Slow tunes come first in the evening so newer players can join in.',
        'Free, with tea and soft drinks at the welcome desk.'
      ],
      bring: ['An instrument, if you play one'],
      included: ['Tea, squash and a warm room']
    },
    {
      id: 'acoustic-night', title: 'Songs from the Yard: acoustic night', cat: 'music',
      rule: { every: 'month', nth: [2], day: 5 }, start: '19:30', end: '22:00', room: 'yard-room', host: 'Iolo Moorby',
      price: 8, per: 'ticket', ages: 'all', level: 'Seated gig', places: 70, booking: 'book',
      summary: 'Three acoustic sets from songwriters across Cumbria and the north-west, with a long interval for tea and talk.',
      body: [
        'A seated, unamplified evening in the Yard Room. Each month brings one headliner and two newer writers, chosen from the open call we run every spring.',
        'Doors open at 19:00. Under-16s come free with a paying adult.'
      ],
      bring: [],
      included: ['Reserved seating (first come, first served)', 'Tea, coffee and cake at the interval']
    },
    {
      id: 'open-mic', title: 'Spoken word and open mic', cat: 'music',
      rule: { every: 'month', nth: [1], day: 3 }, start: '19:30', end: '21:30', room: 'snug', host: 'Cass Birkett',
      price: 3, per: 'ticket', ages: 'teens', level: 'Five minutes each', places: 35, booking: 'drop-in',
      summary: 'Poems, short stories, one song or a story about your nan. Sign up on the night for a five-minute slot.',
      body: [
        'Cass keeps the list and the time, and makes sure first-timers go on early, before nerves set in. The room is small and generous.',
        'Sign-ups open at 19:00 at the welcome desk.'
      ],
      bring: ['Something to read or perform (optional)'],
      included: ['A friendly audience']
    },
    {
      id: 'saturday-makers', title: 'Saturday Makers', cat: 'family', workshop: true,
      rule: { every: 'week', day: 6 }, start: '10:30', end: '12:00', room: 'print-room', host: 'Anwen Tyson',
      price: 4, per: 'child', ages: 'kids', level: 'Ages 5–11', places: 16, booking: 'book',
      summary: 'A different making challenge every week: cardboard cities, printed monsters, paper lanterns and impossible machines.',
      body: [
        'Anwen sets the challenge, the children take it somewhere nobody planned. Grown-ups stay and help, or quietly make their own.',
        'Everything is washable, but old clothes are still a good idea. Accompanying adults come free.'
      ],
      bring: ['Old clothes or an apron'],
      included: ['All materials', 'Squash and fruit at half time']
    },
    {
      id: 'squish', title: 'Squish and Splodge', cat: 'family',
      rule: { every: 'week', day: 5 }, start: '10:00', end: '11:00', room: 'yard-room', host: 'Anwen Tyson',
      price: 3, per: 'child', ages: 'under5', level: 'Ages 1–4', places: 14, booking: 'drop-in',
      summary: 'Messy play for under-fives: paint, dough, water trays and a lot of giant paper. We do the clearing up.',
      body: [
        'A relaxed hour of sensory play with lots of floor space and a sing-song to finish. Babies in arms come free.',
        'Pushchairs fit through the yard gate and there is a changing table in the accessible toilet.'
      ],
      bring: ['A change of clothes for your child'],
      included: ['Aprons, paints and play dough', 'Tea for grown-ups']
    },
    {
      id: 'film-club', title: 'Third Thursday film club', cat: 'film',
      rule: { every: 'month', nth: [3], day: 4 }, start: '19:00', end: '21:30', room: 'yard-room', host: 'Bram Huddleston',
      price: 6, per: 'ticket', ages: 'adults', level: 'Big screen, comfy seats', places: 60, booking: 'book',
      summary: 'A world cinema or classic film on the big screen, with an introduction from Bram and a chat afterwards for anyone who wants to stay.',
      body: [
        'Members vote on the next season’s films each spring, so the programme is a mix of new releases from around the world and old favourites seen properly for the first time.',
        'This month’s title is announced in the newsletter and on the noticeboard. Films are subtitled where needed; we also run one captioned screening each season.'
      ],
      bring: [],
      included: ['Tea, coffee and popcorn at the welcome desk']
    },
    {
      id: 'family-film', title: 'Sunday family matinee', cat: 'film',
      rule: { every: 'month', nth: [1], day: 0 }, start: '14:00', end: '15:45', room: 'yard-room', host: 'Bram Huddleston',
      price: 3, per: 'ticket', ages: 'all', level: 'Rated U or PG', places: 60, booking: 'book',
      summary: 'A family film on the big screen, with the lights half up, the sound a little down and nobody minding a wriggle.',
      body: [
        'A relaxed screening: you can come and go, chat and bring your own snacks. Babies under two come free.',
        'There is a colouring table at the back for anyone who would rather draw.'
      ],
      bring: ['Snacks and a cushion, if you like'],
      included: ['Squash for children']
    },
    {
      id: 'open-studios', title: 'Open studios Saturday', cat: 'studio',
      rule: { every: 'month', nth: [-1], day: 6 }, start: '12:30', end: '16:30', room: 'ground', host: 'Ottoline Rigg',
      price: 0, per: 'person', ages: 'all', level: 'Drop in any time', places: 200, booking: 'drop-in',
      summary: 'Every studio door open: watch the presses roll, try the wheel, meet the makers and buy work straight from the people who made it.',
      body: [
        'On the last Saturday of the month our resident artists and class members open up their spaces. There are free five-minute tasters all day and a small makers’ table in the foyer.',
        'It is the easiest way to find out what happens here before booking a class.'
      ],
      bring: [],
      included: ['Free tasters on the wheel and the press', 'Cake in the yard (donations welcome)']
    },
    {
      id: 'repair-cafe', title: 'Repair café', cat: 'studio',
      rule: { every: 'month', nth: [2], day: 6 }, start: '10:00', end: '13:00', room: 'yard-room', host: 'Wilf Askew',
      price: 0, per: 'person', pwyc: true, ages: 'all', level: 'Bring it, we’ll look at it', places: 40, booking: 'drop-in',
      summary: 'Volunteer fixers look at lamps, bikes, jumpers, toasters and toys, and show you how to mend them yourself.',
      body: [
        'Wilf’s team of volunteer fixers works through the queue in order of arrival. You stay with your item and learn as it is mended. Small electrical items are safety-tested before they go home.',
        'We can’t take microwaves, anything gas-powered or anything you can’t carry in.'
      ],
      bring: ['One item per person, please', 'Any spare parts you already have'],
      included: ['Tools, solder, thread and patches', 'Tea while you wait']
    },
    { id: 'tide-lines', title: 'Tide Lines: prints of the Bay', cat: 'exhibition', host: 'Maud Croasdale', room: 'foyer', price: 0, per: 'person', ages: 'all', level: 'Free entry', booking: 'drop-in',
      summary: 'Maud Croasdale’s large linocuts follow the tide across Morecambe Bay, from the Leven estuary to the sands at low water.',
      body: [
        'Forty prints made over three winters walking the edges of the Bay. Some are a metre and a half wide, cut from a single block.',
        'Maud’s blocks, tools and sketchbooks are shown alongside the prints, so you can see how each one was made.'
      ],
      bring: [], included: ['Free entry', 'A large-print gallery guide at the desk']
    },
    { id: 'kept', title: 'Kept: objects from Ulverston kitchens', cat: 'exhibition', host: 'Mosaic community archive', room: 'foyer', price: 0, per: 'person', ages: 'all', level: 'Free entry', booking: 'drop-in',
      summary: 'A teapot that survived three house moves, a recipe card in four different hands: sixty objects lent by neighbours, with the stories that keep them in the family.',
      body: [
        'Over a year, people brought their most treasured kitchen things to our welcome desk and told us why they keep them. This exhibition puts them all on one long dresser.',
        'Add your own story to the comments wall by the door.'
      ],
      bring: [], included: ['Free entry', 'Audio stories on the listening bench']
    },
    { id: 'mosaic-open', title: 'The Mosaic Open', cat: 'exhibition', host: 'Selected by our members', room: 'foyer', price: 0, per: 'person', ages: 'all', level: 'Free entry', booking: 'drop-in',
      summary: 'Our open exhibition: paintings, prints, pots, quilts and photographs by anyone who entered, hung salon-style from floor to ceiling.',
      body: [
        'Anyone living or working in South Cumbria can enter one piece. Members choose a Visitors’ Prize, and most work is for sale with no commission taken.',
        'Entry forms for the next Open are at the welcome desk.'
      ],
      bring: [], included: ['Free entry', 'Vote for the Visitors’ Prize']
    }
  ];

  /* The Foyer Gallery runs these exhibitions one after another, on repeat, starting on GALLERY.anchor
     (a Saturday). Each one opens on a Saturday, runs for `weeks` weeks and closes on a Sunday; the
     Friday before it opens there is a free preview evening (GALLERY.preview). */
  var GALLERY = {
    anchor: '2026-09-26',
    preview: { start: '18:00', end: '20:00' },
    hours: 'Tuesday to Sunday, during welcome desk hours',
    runs: [
      { id: 'tide-lines', weeks: 6 },
      { id: 'kept', weeks: 5 },
      { id: 'mosaic-open', weeks: 6 }
    ]
  };

  return {
    CENTRE: CENTRE, HOURS: HOURS, WINTER_BREAK: WINTER_BREAK, CATEGORIES: CATEGORIES, AGES: AGES,
    AGE_FILTERS: AGE_FILTERS, PRICE_FILTERS: PRICE_FILTERS, ROOMS: ROOMS, HIRE_EXTRAS: HIRE_EXTRAS, HIRE: HIRE,
    LISTINGS: LISTINGS, GALLERY: GALLERY
  };
})();
