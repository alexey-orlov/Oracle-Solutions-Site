/* data.js — Account insights walkthrough.
 *
 * DEMO DATA ONLY. Every company, person, story, id, date and figure below is
 * invented. "We" are an unnamed logistics and supply-chain services company;
 * the book is 24 accounts owned by two account managers.
 *
 * The model (the same invariant as every walkthrough on the site):
 *   - current state: the book, the sources, this morning's stories, the
 *     service lines. It never mutates.
 *   - named changes: the moves the run proposes, each with the reasoning path
 *     that produced it, its sources, and its per-move effects
 *     (research minutes by hand, review minutes, days to the account's next
 *     review, minutes since the story broke).
 *   - demo.js computes every number from which moves are in front of the
 *     sellers (kpis(applied)) and every flag from the same set (flagsFor).
 */
window.AIX = {
  now: { label: "09:40", min: 9 * 60 + 40 },
  lastCheck: { before: "06:00", after: "09:40", next: "10:10" },
  threshold: 5,

  people: {
    RH: { name: "Robin Hale", role: "Account manager" },
    NB: { name: "Nadia Brandt", role: "Account manager" }
  },

  /* ---- sources: three licensed feeds, stories submitted by hand, and the
     organisation's own records the reasoning is grounded in ---- */
  sources: [
    { id: "wire", icon: "wire", name: "Newswire", line: "Licensed news feed", count: 132, status: "ok" },
    { id: "filings", icon: "filing", name: "Company filings", line: "Results, reports, investor news", count: 41, status: "ok" },
    { id: "market", icon: "market", name: "Market news", line: "Trade and business press", count: 38, status: "warn",
      note: "Chemicals trade journal unreachable since 05:10, logged" },
    { id: "hand", icon: "hand", name: "Submitted by hand", line: "Stories your team adds", count: 3, status: "ok" },
    { id: "crm", icon: "crm", name: "Your CRM", line: "24 accounts, owners, links", first: true, status: "ok" },
    { id: "catalog", icon: "catalog", name: "Your service lines", line: "12 moves you can offer", first: true, status: "ok" }
  ],

  /* ---- the run: what the viewer watches happen ---- */
  stages: [
    { label: "Read every source", detail: "214 stories since 18:00 · 1 feed unreachable, logged" },
    { label: "Drop the noise", detail: "176 not about your accounts, or not news" },
    { label: "Merge repeats", detail: "33 repeats merged into 5 signals" },
    { label: "Match to your accounts", detail: "15 account reads · 9 reached through your records" },
    { label: "Work out each move", detail: "13 next moves: 9 to sell, 4 to protect" },
    { label: "Score and check", detail: "2 below the confidence line, filtered and counted" }
  ],
  /* One line per decision, shown as it is made. `at` = the stage it belongs to. */
  feed: [
    { at: 2, icon: "merge", text: "6 reports of the Alder Foods plant story merged into one signal" },
    { at: 3, icon: "book", text: "Alder Foods: in your book, Robin Hale's account" },
    { at: 3, icon: "link", text: "Supplier map: Baltic Packaging supplies Alder Foods" },
    { at: 3, icon: "link", text: "CRM links: Meridian Grocers buys from Alder Foods" },
    { at: 3, icon: "link", text: "Market map: Torvik Foods competes with Alder Foods" },
    { at: 3, icon: "link", text: "Varden → Halden Plastics → Artesa Home: two steps, followed" },
    { at: 3, icon: "hold", text: "“Keswick” matches two of your accounts: held for you" },
    { at: 4, icon: "thin", text: "Coastline Markets has no relationship notes: flagged, not dropped" },
    { at: 4, icon: "map", text: "Each move mapped to one of your 12 service lines" },
    { at: 5, icon: "filter", text: "Pellham Glass, Carrow Paper: below the line, filtered" },
    { at: 5, icon: "done", text: "13 next moves ready for review" }
  ],

  /* ---- the organisation's own catalog of moves ---- */
  lines: [
    { id: "wh", name: "Contract logistics · warehousing" },
    { id: "peak", name: "Contract logistics · peak season" },
    { id: "inbound", name: "Road freight · inbound lanes" },
    { id: "lanes", name: "Road freight · contracted lanes" },
    { id: "dc", name: "Retail distribution · DC inbound" },
    { id: "network", name: "Distribution · network integration" },
    { id: "chilled", name: "Temperature-controlled · chilled" },
    { id: "adr", name: "Chemicals logistics · ADR storage" },
    { id: "air", name: "Air freight · time-critical" },
    { id: "parts", name: "Spare-parts logistics · service hubs" },
    { id: "design", name: "Supply-chain design · network study" },
    { id: "returns", name: "Returns and repair logistics" }
  ],

  rules: [
    "One story, one signal: repeats across outlets are merged.",
    "Only your 24 accounts get a move; anyone else is context.",
    "Knock-on effects are followed up to two steps, through your own records.",
    "Every move names one of your 12 service lines.",
    "Confidence line at 5 of 10: below it, moves are filtered and counted.",
    "Checked every 30 minutes; your team can submit a story by hand.",
    "Nothing reaches the CRM without a reviewer's approval."
  ],

  /* Where each capability arrives, in the pack's own delivery tiers. */
  tiers: [
    { what: "Checks on a schedule, or a story submitted by hand", tier: "Jumpstart" },
    { what: "One signal per story, matched to your accounts", tier: "Jumpstart" },
    { what: "Opportunities and risks mapped to your service lines", tier: "Jumpstart" },
    { what: "Knock-on effects, up to two steps", tier: "Jumpstart" },
    { what: "Scores, cited sources, approve or reject", tier: "Jumpstart" },
    { what: "Approved moves exported as a file for your CRM", tier: "Jumpstart" },
    { what: "Your own licensed feeds; moves straight into the CRM", tier: "Integration" },
    { what: "Each move routed to its account owner", tier: "Integration" },
    { what: "What became of each move, fed back into the scores", tier: "Scaling" }
  ],

  /* ---- the book: 24 accounts from the CRM extract ---- */
  accounts: [
    { id: "ACC-012", name: "Alder Foods", sector: "Food and beverage", tier: "A", owner: "RH", today: "Warehousing and outbound for its first plant", review: 38, renewal: "Warehousing renews 2027", unread: 17 },
    { id: "ACC-027", name: "Baltic Packaging", sector: "Packaging", tier: "B", owner: "NB", today: "Two inbound lanes from its mills", review: 21, unread: 6 },
    { id: "ACC-003", name: "Meridian Grocers", sector: "Retail", tier: "A", owner: "RH", today: "Inbound into three regional DCs", review: 9, renewal: "Inbound contract ends Dec 2026", unread: 11 },
    { id: "ACC-031", name: "Torvik Foods", sector: "Food and beverage", tier: "B", owner: "NB", today: "Frozen warehousing, one site", review: 44, renewal: "Renews spring 2027", unread: 8 },
    { id: "ACC-008", name: "Norhaven Retail", sector: "Retail", tier: "A", owner: "RH", today: "National distribution from two DCs", review: 12, unread: 19 },
    { id: "ACC-040", name: "Coastline Markets", sector: "Retail", tier: "C", owner: "NB", today: "Spot road freight", review: 63, thin: true, unread: 9 },
    { id: "ACC-022", name: "Hollin Dairy", sector: "Food and beverage", tier: "B", owner: "RH", today: "Chilled deliveries to retailers", review: 27, unread: 4 },
    { id: "ACC-015", name: "Varden Chemicals", sector: "Chemicals", tier: "A", owner: "NB", today: "ADR storage and freight from its main plant", review: 17, unread: 14 },
    { id: "ACC-019", name: "Halden Plastics", sector: "Chemicals and plastics", tier: "B", owner: "NB", today: "Inbound resin by road", review: 33, unread: 5 },
    { id: "ACC-036", name: "Artesa Home", sector: "Home goods", tier: "B", owner: "RH", today: "Peak-season warehousing", review: 52, renewal: "Peak contract renews January", unread: 7 },
    { id: "ACC-024", name: "Orla Beverages", sector: "Food and beverage", tier: "B", owner: "RH", today: "Seasonal overflow storage", review: 29, unread: 10 },
    { id: "ACC-005", name: "Brenmoor Motors", sector: "Automotive", tier: "A", owner: "NB", today: "Spare parts from its central hub", review: 24, renewal: "Renews in 7 months", unread: 13 },
    { id: "ACC-029", name: "Keswick Components", sector: "Automotive supply", tier: "B", owner: "NB", today: "Inbound to Brenmoor's assembly plant", review: 41, unread: 3 },
    { id: "ACC-044", name: "Keswick Glass", sector: "Building materials", tier: "C", owner: "RH", today: "Spot road freight", review: 58, unread: 2 },
    { id: "ACC-017", name: "Pellham Glass", sector: "Building materials", tier: "B", owner: "RH", today: "Road freight to builders' merchants", review: 35, unread: 6 },
    { id: "ACC-038", name: "Carrow Paper", sector: "Paper and packaging", tier: "C", owner: "NB", today: "Inbound pulp by road", review: 47, unread: 3 },
    { id: "ACC-010", name: "Rivergate Electronics", sector: "Electronics", tier: "A", owner: "RH", today: "Time-critical air freight for components", review: 15, unread: 12 },
    { id: "ACC-013", name: "Fjordvik Seafood", sector: "Food and beverage", tier: "B", owner: "RH", today: "Chilled distribution", review: 20, unread: 5 },
    { id: "ACC-021", name: "Tamsin Apparel", sector: "Fashion", tier: "B", owner: "RH", today: "E-commerce fulfilment and returns", review: 31, unread: 9 },
    { id: "ACC-026", name: "Veldmark Agritech", sector: "Farm machinery", tier: "B", owner: "NB", today: "Seasonal spare parts", review: 36, unread: 4 },
    { id: "ACC-033", name: "Solvik Pharma", sector: "Life sciences", tier: "A", owner: "NB", today: "Temperature-controlled distribution", review: 11, unread: 15 },
    { id: "ACC-035", name: "Marbury Medical", sector: "Medical devices", tier: "B", owner: "NB", today: "Returns and repair logistics", review: 26, unread: 6 },
    { id: "ACC-042", name: "Greywell Tools", sector: "Industrial tools", tier: "C", owner: "NB", today: "Road freight to distributors", review: 53, unread: 2 },
    { id: "ACC-046", name: "Quillon Tyres", sector: "Automotive aftermarket", tier: "C", owner: "RH", today: "Seasonal storage for winter tyres", review: 40, unread: 4 }
  ],

  /* ---- this morning's five signals (214 stories in, 5 kept) ---- */
  signals: [
    { id: "SIG-0929-014", day: 0, time: "08:12", min: 8 * 60 + 12, source: "Newswire", icon: "wire", merged: 6, type: "Plant opening",
      title: "Alder Foods to open a second plant in Poland",
      summary: "Construction starts early 2027; the plant will supply retailers across Central Europe." },
    { id: "SIG-0929-011", day: 0, time: "07:41", min: 7 * 60 + 41, source: "Company filing", icon: "filing", merged: 4, type: "Acquisition",
      title: "Norhaven Retail agrees to buy Coastline Markets",
      summary: "The deal adds 140 stores and two distribution centres; closing needs approval." },
    { id: "SIG-0929-009", day: 0, time: "06:58", min: 6 * 60 + 58, source: "Market news", icon: "market", merged: 11, type: "Disruption",
      title: "Varden Chemicals pauses its Antwerp line",
      summary: "Six weeks of maintenance from mid-October, brought forward after an audit." },
    { id: "SIG-0928-032", day: -1, time: "17:20", min: 17 * 60 + 20, source: "Press release", icon: "filing", merged: 2, type: "New leadership",
      title: "Orla Beverages names a new supply-chain head",
      summary: "Appointed after a review of its European distribution." },
    { id: "SIG-0928-027", day: -1, time: "16:05", min: 16 * 60 + 5, source: "Submitted by hand", icon: "hand", merged: 1, by: "NB", type: "Site move",
      title: "Brenmoor Motors moves its parts hub to Rotterdam",
      summary: "Added by Nadia Brandt from a trade-press article." }
  ],

  /* Reasons a reviewer can give for turning a move down. */
  reasons: ["Already in our pipeline", "Timing too far out", "Not a service we sell there", "Wrong account", "Other"],

  /* ---- the named changes: every move the run proposes ----
     rel: named · supplier · customer · competitor · twostep
     research: minutes to reach this move by hand (40 when the account is named
     in the story, 60 when it is only reached through your records, 75 at two
     steps); review: minutes to read and decide it. */
  moves: [
    { id: "MV-01", signal: "SIG-0929-014", account: "ACC-012", rel: "named", kind: "sell", line: "wh", m: 8, c: 7, research: 40, review: 3,
      relNote: "Named in the story",
      what: "Alder Foods is building a second plant in Poland, first lines in 2028 [1]. It plans to grow Central European volumes by half by 2030 [2] and has not said who will store the new output. Our warehousing contract covers the first plant only [3].",
      offer: ["Outbound warehousing within reach of the new plant, from 2028", "One contract for both plants at the 2027 renewal"],
      next: "Ask the head of supply chain for a site-planning meeting before the tender opens.",
      sources: [
        { kind: "Article", meta: "Newswire, today 08:12", quote: "…will build a second production plant in Poland." },
        { kind: "Annual report 2025", meta: "p. 14", quote: "Central European volumes to grow by half by 2030." },
        { kind: "CRM note", meta: "Robin Hale, 12 Aug", quote: "Warehousing for the first plant renews in 2027." }
      ],
      trace: ["Story matched by name: Alder Foods, in your book", "Read its annual report: the volume plan for Central Europe", "Read your CRM: what we do for them today, renewal 2027", "Reasoned: new output needs storage near the plant; none named", "Mapped to your line: Contract logistics · warehousing", "Scored: a second site (8); two sources agree on timing (7)"] },

    { id: "MV-02", signal: "SIG-0929-014", account: "ACC-027", rel: "supplier", kind: "sell", line: "inbound", m: 6, c: 7, research: 60, review: 3,
      relNote: "Supplies Alder Foods · your supplier map",
      what: "Baltic Packaging makes Alder Foods' cartons at two mills [2]. A second Alder plant [1] needs a new inbound lane from those mills once the lines are fitted, and we already run two of Baltic's lanes [3].",
      offer: ["A dedicated lane from both mills into the new plant", "Timed to the plant's first deliveries in 2028"],
      next: "Send Baltic a lane proposal timed to the new plant's first deliveries.",
      sources: [
        { kind: "Article", meta: "Newswire, today 08:12", quote: "…will build a second production plant in Poland." },
        { kind: "Supplier map", meta: "Alder Foods", quote: "Primary packaging: Baltic Packaging, two mills." },
        { kind: "CRM", meta: "What we do today", quote: "Two inbound lanes from its mills." }
      ],
      trace: ["Story about Alder Foods, one of your accounts", "Your supplier map: Baltic Packaging supplies Alder Foods", "Reasoned: a new plant means a new inbound lane", "Mapped to your line: Road freight · inbound lanes", "Scored: one new lane (6); the link is in your own records (7)"] },

    { id: "MV-03", signal: "SIG-0929-014", account: "ACC-003", rel: "customer", kind: "sell", line: "dc", m: 6, c: 6, research: 60, review: 3,
      relNote: "Buys from Alder Foods · your CRM links",
      what: "From 2028, Meridian's Central European stores can be supplied from Alder's new plant rather than by long haul [1]. Deliveries into its distribution centres change shape, and its inbound contract with us ends in 2026 [2].",
      offer: ["Re-plan DC inbound for the shorter supply route", "Price the change into the 2026 renewal"],
      next: "Raise the new supply route at next week's account review with Meridian.",
      sources: [
        { kind: "Article", meta: "Newswire, today 08:12", quote: "…to supply retailers across Central Europe." },
        { kind: "CRM note", meta: "Nadia Brandt, 3 Sep", quote: "Inbound contract ends December 2026." },
        { kind: "CRM links", meta: "Meridian Grocers", quote: "Buys from Alder Foods: chilled and ambient." }
      ],
      trace: ["Story about Alder Foods, one of your accounts", "Your CRM links: Meridian Grocers buys from Alder Foods", "Reasoned: a nearer plant changes Meridian's DC deliveries", "Read your CRM: Meridian's inbound contract ends 2026", "Mapped to your line: Retail distribution · DC inbound", "Scored: one route change (6); timing rests on Alder's plant (6)"] },

    { id: "MV-04", signal: "SIG-0929-014", account: "ACC-031", rel: "competitor", kind: "protect", line: "wh", m: 5, c: 6, research: 60, review: 3,
      relNote: "Competes with Alder Foods · your market map",
      what: "Torvik Foods competes with Alder Foods in frozen foods [3]. A rival's expansion often prompts a response, and Torvik's warehousing contract with us renews in spring 2027 [2]: the moment to secure it early.",
      offer: ["Open the renewal early, with room for growth"],
      next: "Propose an early renewal with growth capacity before Torvik re-tenders.",
      sources: [
        { kind: "Article", meta: "Newswire, today 08:12", quote: "…will build a second production plant in Poland." },
        { kind: "CRM", meta: "Contract", quote: "Frozen warehousing, renews spring 2027." },
        { kind: "Market map", meta: "Frozen foods", quote: "Alder Foods and Torvik Foods: direct competitors." }
      ],
      trace: ["Story about Alder Foods, one of your accounts", "Your market map: Torvik Foods competes with Alder Foods", "Read your CRM: Torvik's contract renews spring 2027", "Reasoned: a rival's expansion puts the renewal in play", "Mapped to your line: Contract logistics · warehousing", "Scored: one renewal at risk (5); Torvik's response is reasoned, not reported (6)"],
      flags: [{ kind: "warn", text: "Torvik's response is reasoned, not reported" }] },

    { id: "MV-05", signal: "SIG-0929-011", account: "ACC-008", rel: "named", kind: "sell", line: "network", m: 7, c: 5, research: 40, review: 3,
      relNote: "Named in the story",
      what: "Norhaven Retail is buying Coastline Markets: 140 stores and two distribution centres [1]. Folding two networks into one is a design and transition job, and Norhaven's national distribution already runs with us [2].",
      offer: ["A transition plan for Coastline's two DCs", "One network, designed before the deal closes"],
      next: "Offer Norhaven a joint network study before the deal closes.",
      sources: [
        { kind: "Filing", meta: "Norhaven Retail, today 07:41", quote: "The acquisition adds 140 stores and two distribution centres." },
        { kind: "CRM", meta: "What we do today", quote: "National distribution from two DCs." }
      ],
      trace: ["Story matched by name: Norhaven Retail, in your book", "Read the filing: 140 stores and two DCs change hands", "Read your CRM: we run Norhaven's national distribution", "Reasoned: two networks become one", "Mapped to your line: Distribution · network integration", "Scored: a network merger (7); closing still needs approval (5)"],
      flags: [{ kind: "warn", text: "The deal still needs approval" }] },

    { id: "MV-06", signal: "SIG-0929-011", account: "ACC-040", rel: "named", kind: "protect", line: "lanes", m: 4, c: 6, research: 40, review: 3,
      relNote: "Named in the story",
      what: "Once Coastline sits inside Norhaven, its freight is likely to move onto Norhaven's contracts [1]. Our spot freight with Coastline is at risk. Your CRM holds no relationship notes for Coastline [2].",
      offer: ["Carry Coastline's lanes into the Norhaven contract"],
      next: "Bring Coastline's volumes into the Norhaven conversation Robin is opening.",
      sources: [
        { kind: "Filing", meta: "Norhaven Retail, today 07:41", quote: "Coastline will be integrated into Norhaven's network." },
        { kind: "CRM", meta: "What we do today", quote: "Spot road freight; no relationship notes." }
      ],
      trace: ["Story matched by name: Coastline Markets, in your book", "Read your CRM: spot freight only, no relationship notes", "Reasoned: an acquired retailer's freight follows the buyer's contracts", "Mapped to your line: Road freight · contracted lanes", "Scored: spot volume at risk (4); thin CRM record (6)"],
      flags: [{ kind: "warn", text: "Thin CRM record: no relationship notes" }] },

    { id: "MV-07", signal: "SIG-0929-011", account: "ACC-022", rel: "supplier", kind: "sell", line: "chilled", m: 5, c: 5, research: 60, review: 3,
      relNote: "Supplies Coastline Markets · your supplier map",
      what: "Hollin Dairy supplies Coastline's stores [2]. After the deal, its deliveries are likely to consolidate into Norhaven's distribution centres [1]: fewer drops, larger chilled loads.",
      offer: ["A consolidated chilled route into Norhaven's DCs"],
      next: "Show Hollin a consolidated chilled route into Norhaven's DCs.",
      sources: [
        { kind: "Filing", meta: "Norhaven Retail, today 07:41", quote: "Coastline will be integrated into Norhaven's network." },
        { kind: "Supplier map", meta: "Coastline Markets", quote: "Dairy: Hollin Dairy." }
      ],
      trace: ["Story names Coastline Markets, one of your accounts", "Your supplier map: Hollin Dairy supplies Coastline", "Reasoned: store deliveries move into Norhaven's DCs", "Mapped to your line: Temperature-controlled · chilled", "Scored: a route change (5); depends on the deal closing (5)"] },

    { id: "MV-08", signal: "SIG-0929-009", account: "ACC-015", rel: "named", kind: "sell", line: "adr", m: 5, c: 6, research: 40, review: 3,
      relNote: "Named in the story",
      what: "Varden pauses its Antwerp line for six weeks from mid-October [1]. Customers will be served from stock and from its second plant [2], and that stock needs certified storage near them.",
      offer: ["Six weeks of certified buffer storage near its customers"],
      next: "Offer Varden short-term ADR storage before the pause starts.",
      sources: [
        { kind: "Market news", meta: "Merged from 11 reports, 06:58", quote: "The line will stop for six weeks from mid-October." },
        { kind: "Annual report 2025", meta: "p. 9", quote: "The second plant runs at 70% of capacity." }
      ],
      trace: ["Story matched by name: Varden Chemicals, in your book", "Read its annual report: spare capacity at the second plant", "Reasoned: six weeks of stock to hold near customers", "Mapped to your line: Chemicals logistics · ADR storage", "Scored: a six-week job (5); dates reported by 11 outlets (6)"] },

    { id: "MV-09", signal: "SIG-0929-009", account: "ACC-019", rel: "customer", kind: "sell", line: "air", m: 6, c: 6, research: 60, review: 3,
      relNote: "Buys resin from Varden · your supplier map",
      what: "Halden Plastics buys its resin from Varden [2]. A six-week pause [1] leaves a gap Halden will bridge from another supplier, at short notice and from further away.",
      offer: ["Time-critical inbound for the bridge supply"],
      next: "Call Halden's buyer today with time-critical inbound for the bridge supply.",
      sources: [
        { kind: "Market news", meta: "Merged from 11 reports, 06:58", quote: "The line will stop for six weeks from mid-October." },
        { kind: "Supplier map", meta: "Halden Plastics", quote: "Resin: Varden Chemicals." }
      ],
      trace: ["Story about Varden Chemicals, one of your accounts", "Your supplier map: Halden Plastics buys Varden's resin", "Reasoned: a six-week gap to bridge from elsewhere", "Mapped to your line: Air freight · time-critical", "Scored: urgent, short (6); the supplier link is in your records (6)"] },

    { id: "MV-10", signal: "SIG-0929-009", account: "ACC-036", rel: "twostep", kind: "protect", line: "peak", m: 4, c: 5, research: 75, review: 3,
      relNote: "Buys from Halden Plastics · two steps from the story",
      what: "Artesa Home buys plastic housings from Halden [2], which buys its resin from Varden [1]. If Halden runs short, Artesa's autumn range may arrive late, and its peak-season contract with us renews in January [3].",
      offer: ["Re-plan Artesa's peak slots before the renewal"],
      next: "Check Artesa's autumn inbound plan and offer flexible peak capacity.",
      sources: [
        { kind: "Market news", meta: "Merged from 11 reports, 06:58", quote: "The line will stop for six weeks from mid-October." },
        { kind: "Supplier map", meta: "Artesa Home", quote: "Housings: Halden Plastics." },
        { kind: "CRM", meta: "Contract", quote: "Peak-season warehousing, renews January." }
      ],
      trace: ["Story about Varden Chemicals, one of your accounts", "Your supplier map: Halden Plastics buys Varden's resin", "Your supplier map: Artesa Home buys Halden's housings", "Reasoned: a late autumn range puts the peak renewal in play", "Mapped to your line: Contract logistics · peak season", "Scored: one renewal (4); two steps, one link source (5)"],
      flags: [{ kind: "info", text: "Two steps from the story" }, { kind: "warn", text: "One source for the Halden to Artesa link" }] },

    { id: "MV-11", signal: "SIG-0928-032", account: "ACC-024", rel: "named", kind: "sell", line: "design", m: 4, c: 6, research: 40, review: 3,
      relNote: "Named in the story",
      what: "Orla has named a new head of supply chain after a review of its European distribution [1]. We only store Orla's seasonal overflow today [2]; a new head reviewing the network is the window to offer more.",
      offer: ["A network study in the new head's first 90 days"],
      next: "Send the new head an introduction and offer a network study.",
      sources: [
        { kind: "Press release", meta: "Orla Beverages, yesterday 17:20", quote: "…following a review of our European distribution." },
        { kind: "CRM", meta: "What we do today", quote: "Seasonal overflow storage." }
      ],
      trace: ["Story matched by name: Orla Beverages, in your book", "Read your CRM: seasonal overflow storage only", "Reasoned: a new head reviewing distribution opens a window", "Mapped to your line: Supply-chain design · network study", "Scored: a first conversation (4); one press release (6)"],
      flags: [{ kind: "warn", text: "Single source: one press release" }] },

    { id: "MV-12", signal: "SIG-0928-027", account: "ACC-005", rel: "named", kind: "protect", line: "parts", m: 8, c: 7, research: 40, review: 3,
      relNote: "Named in the story",
      what: "Brenmoor is moving its parts hub to Rotterdam [1]. Our spare-parts contract runs from the current hub and renews in seven months [2]; the move reopens where, and by whom, its parts are handled.",
      offer: ["A proposal for the new hub before the renewal"],
      next: "Ask for the hub move timetable and bid for the new hub this month.",
      sources: [
        { kind: "Trade press", meta: "Submitted by Nadia Brandt, yesterday", quote: "Brenmoor will consolidate parts distribution in Rotterdam." },
        { kind: "CRM", meta: "Contract", quote: "Spare-parts logistics, renews in 7 months." },
        { kind: "Annual report 2025", meta: "p. 22", quote: "Parts and service sales up 12%." }
      ],
      trace: ["Story submitted by hand, matched by name: Brenmoor Motors", "Read your CRM: our contract is tied to the current hub", "Read its annual report: parts sales growing", "Reasoned: the hub move reopens the contract", "Mapped to your line: Spare-parts logistics · service hubs", "Scored: our largest parts contract (8); two sources (7)"] },

    { id: "MV-13", signal: "SIG-0928-027", account: "ACC-029", rel: "supplier", kind: "sell", line: "inbound", m: 5, c: 6, research: 60, review: 3,
      relNote: "Supplies Brenmoor Motors · your supplier map",
      what: "Keswick Components ships brake parts into Brenmoor's parts hub [2]. The hub move [1] re-routes those deliveries, and a new inbound lane has to be set up.",
      offer: ["The new inbound lane into the Rotterdam hub"],
      next: "Offer Keswick the new inbound lane into the Rotterdam hub.",
      sources: [
        { kind: "Trade press", meta: "Submitted by Nadia Brandt, yesterday", quote: "Brenmoor will consolidate parts distribution in Rotterdam." },
        { kind: "Supplier map", meta: "Brenmoor Motors", quote: "Brake parts: Keswick Components." }
      ],
      trace: ["Story about Brenmoor Motors, one of your accounts", "Your supplier map names “Keswick”: two of your accounts match", "Held for a person to confirm which one", "Mapped to your line: Road freight · inbound lanes", "Scored: one new lane (5); once the account is confirmed (6)"],
      held: { question: "Which Keswick does the story mean?", options: ["ACC-029", "ACC-044"], answer: "ACC-029" } },

    /* ---- filtered: below the confidence line, counted, not hidden ---- */
    { id: "MV-14", signal: "SIG-0929-009", account: "ACC-017", rel: "customer", kind: "sell", line: "air", m: 4, c: 4, research: 60, review: 3, filtered: true,
      relNote: "May buy coatings from Varden · one mention",
      what: "Pellham Glass may buy coatings from Varden [2]. If so, the pause [1] could delay its supply, but the link rests on one mention from 2023.",
      offer: ["Time-critical inbound if its coatings supply is hit"],
      next: "Ask Pellham whether Varden's pause touches its coatings supply.",
      sources: [
        { kind: "Market news", meta: "Merged from 11 reports, 06:58", quote: "The line will stop for six weeks from mid-October." },
        { kind: "Trade press", meta: "2023", quote: "…coatings sourced from Varden and others." }
      ],
      trace: ["Story about Varden Chemicals, one of your accounts", "One mention links Pellham Glass to Varden", "Reasoned: a possible supply gap", "Mapped to your line: Air freight · time-critical", "Scored: small (4); one old mention (4): below the line"] },

    { id: "MV-15", signal: "SIG-0929-009", account: "ACC-038", rel: "competitor", kind: "sell", line: "lanes", m: 3, c: 3, research: 60, review: 3, filtered: true,
      relNote: "Competes with a Varden customer · reasoned",
      what: "Carrow Paper competes with one of Varden's customers. If that rival is short of supply, Carrow could win orders and need more freight [1], but nothing links Carrow to Varden directly.",
      offer: ["Extra contracted lanes if its orders rise"],
      next: "No action unless Carrow's orders rise.",
      sources: [
        { kind: "Market news", meta: "Merged from 11 reports, 06:58", quote: "The line will stop for six weeks from mid-October." }
      ],
      trace: ["Story about Varden Chemicals, one of your accounts", "Reasoned: a competitor of a Varden customer might gain", "Mapped to your line: Road freight · contracted lanes", "Scored: speculative (3); no direct link (3): below the line"] }
  ],

  /* The CRM import file, one record per account. */
  exportFile: "crm-import.csv",
  exportColumns: ["Account", "Account id", "Owner", "Signal", "Reached as", "Move", "Service line", "Next step", "Magnitude", "Confidence", "Sources", "Decided by"]
};
