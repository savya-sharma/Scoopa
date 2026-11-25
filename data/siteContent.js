// ============================================================================
// Scoopa — website copy
// ============================================================================
// Every word shown on the homepage lives here, grouped by section, so client
// copy can replace it without touching components, styles or animations.
//
// Conventions
//   • Arrays of strings (e.g. `heading: [...]`) are lines: each item starts on a
//     new line where the design wants a deliberate break. Use one item for
//     no forced break.
//   • `srLabel` / `title` fields are read by screen readers and search engines
//     when the visible text is decorative (e.g. text set on a curve).
//   • ⚠️ marks copy that states a product fact. Confirm these with the client;
//     they come from the supplied design, not from verified product details.
//
// Lengths the layout is drawn for (rough guides, not hard limits):
//   headings 3–8 words · intro paragraphs 10–25 words · bubble copy ≤ 30 words
//   · Our Story statement ≤ 40 words · labels and buttons 1–4 words
//
// Related data: navigation and social links → data/navigation.js,
// flavours and product images → data/products.js
// ============================================================================

export const brand = {
  name: "Scoopa",
  tagline: "Scoop. Smile. Repeat.",
};

// Page title and description (search results, link previews)
export const meta = {
  title: "Scoopa | Playful Ice Cream — Scoop. Smile. Repeat.",
  description:
    "Meet Scoopa: bright, playful ice cream made for sharing, smiling and coming back for more. Browse the flavours and find your favourite.",
};

export const siteContent = {
  // Hero: the orange stage with the two-line headline and its text stickers,
  // the friends on the "OO", and a curving yellow band running a marquee
  hero: {
    // the page's main heading, for screen readers and search engines (the
    // visible headline below is decorative)
    title: "The Scoopa: fresh, creamy fun",
    // the big headline: each item a line
    // (the reference reads "FRESS": taken as a typo for "FRESH")
    headline: ["THE SCOOPA, FRESH", "CREAMY FUN"],
    // the small navy text stickers stuck over the headline: by "THE", above
    // the end of the first line, and under "CREAMY"
    stickers: ["FLAVOUR’S", "FLAVOUR’S", "FLAVOUR’S"],
    // one run of the words along the curving yellow band (repeated endlessly)
    band: "SCOOP.SMILE.REPEAT * ",
  },

  // Flavours: heading, intro, then the bowl slider (bowls: data/products.js)
  flavours: {
    heading: ["A Bowl for Every Mood,", "a Flavour for Every Day.", "Which One’s Yours?"],
    // (not shown at the moment: the section is just the heading and the slider)
    intro: "Swipe through the lineup and pick your next favourite. Fair warning: stopping at one is harder than it looks.",
    // the sticker on the heading's top-right corner
    sticker: { img: "/stickers/sticker2.png", size: [1371, 1147] },
    sliderLabel: "Our flavours",
    previous: "Previous flavour",
    next: "Next flavour",
  },

  // Brand Personality: between two checker borders, a photo band (the
  // heading, a short line and a button over a close-up of the ice cream,
  // with a round badge and a ticket stuck on) and a yellow band (four tilted
  // flavour cards over a giant line of type)
  brandPersonality: {
    heading: ["A Little Scoop", "of Personality."],
    // ⚠️ New copy, written for this section: confirm it with the client.
    text: "Big on flavour, bursting with personality. Scoopa brings a playful twist to every scoop, serving up colourful moments and smiles worth sharing.",
    // ⚠️ PLACEHOLDER LINK — there's no ordering page yet; Contact for now
    cta: { label: "ORDER NOW", href: "/contact" },
    // the photo behind the band (public/background-img)
    background: { img: "/background-img/web/bgimg.webp", size: [1407, 792] },
    // the round teal badge: the words running round its rim, and the flavour
    // in its middle (an index into data/products.js flavours)
    badge: { img: "/stickers/sticker1.png", size: [1254, 1254] },
    // the stickers on the heading's top-right corner: the teal zigzag, and
    // the yellow "Scoop" oval stuck over its lower-right end
    sticker: { img: "/stickers/sticker2.png", size: [1371, 1147] },
    stickerOval: { img: "/stickers/sticker3.png", size: [1536, 1024] },
    // the giant line of type behind the cards
    crave: "CRAVE THE FLAVOUR",
    // the four cards, left to right: a lifestyle photo (public/images; the
    // originals are in public/background-img) filling the card, on a tint
    // (shows only where a photo is transparent), at a tilt (degrees), and
    // optionally a frosted label stuck on, hanging off one edge.
    // label.pos: where it sits: "tl" top left · "tr" top right · "br" bottom right
    // ⚠️ New copy, written for these labels: confirm it with the client.
    cards: [
      { img: "/images/pd-img1.webp", size: [417, 539], alt: "Friends holding up cups of ice cream", tint: "var(--pink-soft)", rot: -9, label: { text: "Better shared with friends", pos: "tl" } },
      { img: "/images/pd-img2.webp", size: [401, 527], alt: "Three scoops stacked above a waffle cone", tint: "var(--peach)", rot: 4, label: { text: "Three scoops, one happy cone", pos: "br" } },
      { img: "/images/pd-img3.webp", size: [410, 533], alt: "Rows of golden pastries", tint: "var(--mint-soft)", rot: -5 },
      { img: "/images/pd-img4.webp", size: [379, 512], alt: "Tubs of ice cream in a ring, seen from above", tint: "var(--cream)", rot: 7, label: { text: "A flavour for every mood", pos: "tr" } },
    ],
  },


  // Product Details: heading and intro, then one row per ice cream, the sides
  // alternating: the bowl on a yellow disc (its name curving under the
  // disc, a day badge and a "YUM FLAVOUR" starburst on it) beside its details
  productDetails: {
    heading: "Good Things Go Into Every Scoop.",
    intro: "Every scoop has its own little story. Discover the flavours, explore the details and find out what makes your next Scoopa moment worth savouring",
    burst: ["YUM", "FLAVOUR"],
    // the scribbled sun behind the heading
    sun: { img: "/stickers/web/sticker5.webp", size: [475, 525] },
    // flavour: an index into data
    // /products.js flavours (its bowl photo)
    // day: the teal badge (dayLabel is read out instead) · curve: the name
    // under the disc · label, title, text: the details · price: as shown
    // ⚠️ New copy and PLACEHOLDER PRICES, written for this section: confirm
    // the recipes, the day each one is served and the prices with the client.
    items: [
      { 
        flavour: 1,
        day: "MON",
        dayLabel: "Monday",
        curve: "BUTTER SCOTCH CRUNCH",
        label: "The Butter Scotch",
        title: "Buttery & Crunchy",
        text: "Slow-cooked caramel ice cream folded with crunchy butterscotch praline and finished with a golden caramel drizzle.",
        price: "$4.50",
      },
      {
        flavour: 0,
        day: "TUE",
        dayLabel: "Tuesday",
        curve: "ALPHONSO MANGO",
        label: "The Alphonso Mango",
        title: "Sunny & Fruity",
        text: "Creamy ice cream churned with ripe Alphonso mango pulp, topped with juicy mango chunks and a swirl of mango sauce.",
        price: "$4.75",
      },
      {
        flavour: 2,
        day: "WED",
        dayLabel: "Wednesday",
        curve: "KESAR PISTA",
        label: "The Kesar Pista",
        title: "Nutty & Fragrant",
        text: "Saffron-scented cream churned with roasted pistachios, then scattered with slivered almonds and pistachio crumbs.",
        price: "$4.75",
      },
      {
        flavour: 3,
        day: "THU",
        dayLabel: "Thursday",
        curve: "DOUBLE CHOCOLATE",
        label: "The Double Chocolate",
        title: "Rich & Fudgy",
        text: "Dark cocoa ice cream loaded with chocolate chunks and finished with a glossy pour of hot fudge.",
        price: "$4.50",
      },
    ],
  },

  // Our Story: orange, between two checker borders: the statement (each item
  // a line) and a small button to the About page
  ourStory: {
    heading: "Our Story", // for screen readers (the statement is the visible heading)
    statement: ["Bringing colour, joy and", "a playful twist to every scoop.", "That’s the Scoopa way."],
    cta: { label: "OUR STORY", href: "/about" },
    // the stickers that pop up along the mouse's trail over the section, in
    // turn (public/; size = the image's pixel size)
    trail: [
      { img: "/illustrators/stickers/web/stick1.webp", size: [396, 400] },
      { img: "/stickers/sticker1.png", size: [1254, 1254] },
      { img: "/illustrators/stickers/web/stick2.webp", size: [291, 400] },
      { img: "/stickers/web/sticker5.webp", size: [475, 525] },
      { img: "/illustrators/stickers/web/stick3.webp", size: [380, 400] },
      { img: "/stickers/sticker2.png", size: [1371, 1147] },
    ],
  },

  // Specials: the closing statement in the teal arch
  specials: {
    // the closing statement inside the arch (each item a line)
    heading: ["A little scoop.", "A lot of happiness."],
    text: "Made for happy moments, playful cravings and smiles that last beyond the last scoop.",
  },

  // Footer: contact form, brand line, links, copyright
  footer: {
    heading: "GET IN TOUCH",
    badge: "Say hi!",
    form: {
      prompt: "GOT A QUESTION?",
      fields: {
        name: { label: "Name", placeholder: "NAME" },
        email: { label: "Email", placeholder: "EMAIL" },
        phone: { label: "Phone", placeholder: "PHONE" },
        message: { label: "Message", placeholder: "MESSAGE" },
      },
      submit: "SEND",
    },
    statement: "Playful ice cream for every happy moment.",
    // {year} is replaced with the current year
    copyright: "{year} Scoopa – All rights reserved",
  },

  // The inner pages (the menu's links, app/<page>/page.js): the navy title
  // band at the top of each (components/layout/PageHero.js).
  //   meta: the browser-tab title · label: the yellow tag above the title
  //   title: the big title, one item per line (the last line is yellow)
  //   art: the character hanging over the band's scalloped edge (public/)
  // ⚠️ New copy, written for these pages: confirm it with the client.
  pages: {
    about: {
      meta: "About",
      label: "Our Story",
      title: ["About", "Scoopa"],
      intro: "Colourful scoops, a pinch of mischief and someone to share them with. Meet the people and the packaging behind every happy bowl.",
      art: { src: "/illustrators/web/walker.webp", size: [665, 900] },
    },
    flavours: {
      meta: "Our Flavours",
      label: "The Lineup",
      title: ["Our", "Flavours"],
      intro: "Eight flavours, one very tough decision. Swipe through the whole Scoopa lineup and find the one that’s yours.",
      art: { src: "/illustrators/web/cup-kid.webp", size: [657, 900] },
    },
    personality: {
      meta: "Brand Personality",
      label: "Who We Are",
      title: ["Brand", "Personality"],
      intro: "Bright, bold and a little bit cheeky. The colours, characters and big flavour energy behind every Scoopa scoop.",
      art: { src: "/illustrators/web/scoopa-runner.webp", size: [816, 900] },
    },
    contact: {
      meta: "Contact",
      label: "Get in Touch",
      title: ["Say", "Hello"],
      intro: "Got a question, a craving or a brilliant flavour idea? Drop us a line and we’ll scoop back to you.",
      art: { src: "/illustrators/web/splash-runner.webp", size: [879, 900] },
    },
  },

  // Header and menu
  header: {
    // the menu button's two words: closed, and open
    menu: "Menu",
    close: "Close",
    menuLabel: "Main",
    homeLabel: "Scoopa home",
  },
};
