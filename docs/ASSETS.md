# ASSETS.md — step frames, industry images, group tiles, headshot, customer logos

What the E2 stepper, the E2 industry tabs and the home page's case cards, the home
page's product-group tiles and its two photographic panels, the E5 contact card and
the named success stories render, where each file came from, what was done to it, and
what the licensing position is.

This file is **not served** — the site root is `site/`. It is the operator record
that `site/assets/img/manifest-edits.json` deliberately does not carry, under the
same ship gate as `heroes.json` (PROVENANCE §8 / §11.1): nothing served from the
public root may name an internal deck, a customer, or an internal path.

Manifest: `site/assets/img/manifest-edits.json`
Build scripts (scratch, rerunnable): `industries.py`, `manifest.py`, `grade.py`
in the assets working folder. The step frames are no longer made by
`steps_shots.py` / `steps_illus.py` (the SVG illustrations were retired in
round 20): their recipe is §1 below, and the mock sources and the capture tool
are committed in `tools/step-mocks/`.

---

## 1. Step frames — `assets/img/steps/`

**Round 20** (Alex: *"screenshots are too small cuts as for their current size (ideally, screenshots be fullscreen; they should not look like skeletons and should not be overloaded with details / too hard to read … stay close to the interactive walkthrough as much as possible"*). Every product ships **four** steps, and every step **two files**:

| File | What it is | Where it shows |
|---|---|---|
| `<slug>-<n>.jpg` | **The whole screen**, 1744 × 1090 (16:10), JPEG q82 | the How it works frame, 872 × 545 at 1440 |
| `<slug>-<n>-zoom.jpg` | **The step's region** at its capture scale, 802 px wide (or its own width if narrower), JPEG q85 | the inset over the frame, 401 px wide at 1440; on a phone, the step's only picture |

`overview.steps[n-1].shot` in `content.js` names both files and carries the `region` (`[x, y, w, h]` in percent of the frame), the `anchor` (the inset's corner) and the `alt` (what the screen shows, about 12 words). How the page draws them is `VISUAL-GRAMMAR.md` §2.2. Nine products, 36 frames and 36 zooms; the crops and the 16 SVG illustrations of rounds 1–19 are gone (1.7).

### 1.1 The legibility rule — the region

The inset shows the region at the scale **s = 401 ÷ region width in CSS px of the capture, and s ≥ 0.92**, so the UI text in the inset reads at about its real size. At a 1280 × 800 capture that bounds a region at **436 CSS px wide and 296 tall** (272, half the frame's height, ÷ 0.92). If the element the step is about is bigger, take its most telling part — the first two KPI tiles, not five; the flagged row and its chip, not the table — and never shrink the scale to fit more. The widest regions shipped are 435.5 px.

**The anchor** is the frame corner — `br` first, then `bl`, `tr`, `tl` — whose inset (2.75% of the frame's width from the side and 4.4% of its height from the top or bottom, 24 px each at 1440; 401 px wide; the region's height × s tall; inside the 872 × 545 frame) does not overlap the region mapped into the frame. The inset never covers its own ring, and because its offset scales with the frame, that holds at 1280 too.

### 1.2 The capture recipe

1. **Open the screen** at **1280 × 800 CSS px, DPR 2**, headless: a walkthrough at `site/demo/<slug>/index.html?tour=off&ui=clean&state=<state>` (1.3), or a mock page (1.4). **Where a walkthrough clips or overlaps at 1280, capture it at 1440 × 900, DPR 2**: Large docs, whose review PDF overlaps the page footer at 1280. No toast, no tour bubble, no cursor, no scrollbar, and nothing half-loaded — unless the step *is* a processing state, and then it shows its stages clearly mid-way, some ticked and one running.
2. **In one capture run per step:** reach the state; hide the overlays; read the chosen element's `getBoundingClientRect()` in CSS px; shoot the **full viewport**; then shoot **the region's rectangle** directly at DPR 2 (a `rectshot` step), rather than cropping afterwards.
3. **Write the files.** The full PNG resampled to 1744 px wide, then JPEG q82 → `assets/img/steps/<slug>-<n>.jpg`. The region PNG resampled to 802 px wide (kept at its own width if narrower), then JPEG q85 → `<slug>-<n>-zoom.jpg`. On this Mac: `sips --resampleWidth`, then `sips -s format jpeg -s formatOptions <q>`, one call each. A region narrower than 401 CSS px gives a zoom under 802 px, which is soft on a 2× screen: keep regions at least 401 px wide where the element allows (Fleet's zooms 1 and 4, 664 and 644 px, are open).
4. **Record the step** in `content.js`: `shot.region` as `[x/W·100, y/H·100, w/W·100, h/H·100]` of the capture viewport, one decimal; `shot.anchor` by the rule in 1.1; `shot.alt`.
5. **Check before shipping**, reading every final JPG at display size: the zoom is crisp and its UI text reads at normal size; the frame is one complete, settled screen that looks like a real product, not a wireframe; the region is the one thing the step is about; the inset leaves the ring clear (the mocks' `frames-preview.html` shows each frame at 872 × 545 with its ring and inset); **no uncleared figure and no real name** (1.5).

The round's capture tool was a copy of `tools/capture-demo-frames.mjs` (`MODE=script`) with a `rectshot` step and a configurable port, run from the round's scratchpad; it is not in the repository. The step files in `tools/step-mocks/` use its step types (`eval`, `shot`, `rectshot`).

### 1.3 The walkthrough products — which state each step shows

Six products have a walkthrough, and their frames are its own screens on its synthetic data (1.6), captured by the recipe above (in round 20; Account insights' on the same day, from its new walkthrough, §49). The state is the screen the walkthrough is in (its `state=` name where it has one); the region is what the ring and the inset hold.

| Product | Step | State | The region |
|---|---|---|---|
| Large docs processing and review (**1440 × 900**) | 1 | upload, frozen mid-extract: two stages ticked, one running, two pending | the processing stages and the sources |
| | 2 | `review`, *Routine cleaning* open | the group's rows with their cited source pages |
| | 3 | `review`, *Volume discounts*, the flagged row | the extracted value, the validator and its suggested fix, the page-9 evidence |
| | 4 | `review` after *Approve all*, details closed | the rate groups, each *Approved* |
| Workforce optimization | 1 | the Run modal, the planning file chosen | the file card and *Optimize* |
| | 2 | the solver, frozen as the GPU-solve stage starts | stages 3–5 |
| | 3 | `final` (plan v2) | *What the solver changed*: a vacation covered, a sick day split |
| | 4 | `final` (plan v2) | the band's head and its first two KPI tiles |
| Cross-system ERP Q&A | 1 | Ask Oracle, 0.9 s into the run | the order agent's block |
| | 2 | `analysed`, Data Studio's Live Feed | the heading and the first two source cards |
| | 3 | `analysed`, Decisions › Recommendations | the two right tiles: revenue at risk, tier-A exposure |
| | 4 | `final`, the answer after the manager's override | the causes and the first proposed action |
| Fleet route optimization | 1 | `replayed` | the replay checks: visits matched, journey times against telematics |
| | 2 | `changes` | the change cards, each with its rule and its effect |
| | 3 | `solved`, the map | the first two KPI tiles: cost per completed visit, visits per engineer |
| | 4 | `final`, the Field Service export | the export head: approved changes, visits, charging stops |
| Repair-or-replace decisions | 1 | `reviewed`, scrolled to the case panel | case RR-24811's photograph with its measured chip |
| | 2 | `ran`, one case opened | the reading, the market's rule and the call |
| | 3 | `ran` | the before → after tile for repeat visits (not the needless-replacements tile beside it, which prints a £ unit cost) |
| | 4 | `handoff` | the booking import: sent and held, rule, measurement, who authorised it |
| Account insights | 1 | `running`: the morning check frozen with three stages ticked and *Match to your accounts* running | the first four stages: stories read, noise dropped, repeats merged, accounts being matched |
| | 2 | `ran`, scrolled to the first story | the story and its four reads: the company named, a supplier, a customer, a competitor |
| | 3 | `brief`, Meridian Grocers' move open | both scores and *What changes*, with its citation markers |
| | 4 | `decided`, scrolled to the first story | three reads decided: two approved, one rejected with its reason |

- **Account insights' regions are shaped by the anchor rule.** A region in the middle of the frame leaves no corner free, so step 1's stops at the inset's edge (396 px wide, zoom 792 px) and steps 2 and 4 are scrolled to sit just under the top bar; steps 1, 2 and 4 anchor `br`, step 3 `bl`.
- **Workforce's settings screen is not a step.** Its only frame shows plan v1's uncleared *+4.8%* behind the drawer, so *Set the rules* is folded into step 1's text.
- **Repair-or-replace's two-market rules screen is not a step.** It is 1,210 px wide, and no part of it fits the inset, so step 2 shows one case judged against its market's rule.

### 1.4 The HTML mocks — the three products with no walkthrough

Case evidence collection, Plan vs actual investigation and Business metrics Q&A have no walkthrough under `site/demo/`, so their frames are captured from **one static HTML page per step**, 1280 × 800, self-contained, system fonts, no external request. The sources are committed at **`tools/step-mocks/`**, outside `site/`, so nothing there ships; its `README.md` says how to regenerate a frame. Two shells, in the walkthroughs' own two visual languages:

- **Shell A** (`shell-a.css`, the Large docs and Workforce look): a dark sidebar with the product's mark, three nav rows and a user at its foot, a white top bar with a breadcrumb and a *Synthetic data* chip, a light ground, white cards with a hairline, pill chips in blue, green, amber, red and grey, a blue primary button. **Case evidence collection and Plan vs actual investigation**; the Account insights walkthrough is built in the same shell.
- **Shell B** (`shell-b.css`, the Cross-system ERP Q&A look): a dark workspace bar with the workspace name and platform tabs, an *Ask* bar card, results on a light grey ground, Shell A's cards and chips; its red is an identity mark only, never a button. **Business metrics Q&A.**

**Synthetic names only.** Two invented users per shell — Robin Hale and Nadia Brandt in Shell A (named in its header comment), Elena Marsh and Tomas Reyes in Shell B, so the two can never be confused — and invented companies; no customer, real company or person, ever. Each step's screen:

| Product | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Case evidence collection | the case list: a complaint on day 3 of its 56-day clock, four sources connected | the timeline being assembled: twelve dated events from four systems | the case file: a cited summary, one citation opened to its billing row, the draft response | the review: amend, approve or flag, and a five-entry audit log |
| Plan vs actual investigation | the imports: four sources loaded, 96% of records resolved and 4% listed as gaps | the packages table: plan against actual, the façade package 38% over cost and nine weeks late | that package's causes: a change order cited to page 31 of the contract, weather days, rework | the expert review: confirm or reject per cause, a pattern recurring in 7 of 32 packages |
| Business metrics Q&A | the Ask bar with a revenue question and three connected sources, no data moved | the net revenue definition, version 3, signed off by group FP&A | the answer as a table and a chart, two columns masked for this role | the audit entry: who asked, the sources read, the query, 4 s |

The figures in a mock are the mock's own synthetic records, never an Overview metric. **When a product gets its own walkthrough, its frames are re-captured from the walkthrough and its folder in `tools/step-mocks/` is deleted**, as Account insights' was on 2026-09-29 (§49).

### 1.5 Never in a frame

- An uncleared figure: Large docs' Documents screen (*96.4% benchmark accuracy*); Workforce's settings drawer and its `v1-dashboard` (*+4.8%*); a £ unit cost beside a glazing example, which narrows the anonymized label to one company (PROVENANCE §41.2). Repair-or-replace's step-3 frame still shows its walkthrough's £ and $ unit costs and its *Modelled on industry figures* line around the zoom, which holds the repeat-visits tile; that frame is open for Alex (PROVENANCE §41.11).
- A screen that is not settled or cannot be read at the frame's size: Fleet mid-solve, which looks half-loaded; Workforce's compare view, whose map labels come out at about 6 px.
- Large docs' export table, clipped in its pane at any capture width.
- A real customer, company or person name, in a walkthrough or a mock.

### 1.6 The walkthroughs' synthetic data, and their posters (unchanged by round 20)

A walkthrough frame shows the whole screen, so everything on it must be synthetic.

**Large docs processing and review.** The walkthrough (`site/demo/large-document-extraction/`, 2026-09-15, generalised on 2026-09-16 to two document types, schema-specific columns per group and four validator kinds, PROVENANCE §16.4) keeps the product's layout and data model — upload → documents → split-view review with a citation on every value, confidence and business-rule validators → rate-card export — on a **synthetic** supplier agreement (`MSA-2026-014`, "Meridian Facility Services Ltd", invented sites NGC / RDC, invented rates and clauses), so its frames carry no customer, no real counterparty and no real figure. That is the standard any future product screenshot has to meet before it ships.

**Poster.** `assets/img/posters/large-document-extraction.jpg`, 1600 × 900, captured with `tools/capture-demo-frames.mjs` (`MODE=frames DPR=2`, `?tour=off&ui=clean`): the full review screen with the first group open and no details panel, set as `videoPoster`. It is a distinct capture from every step frame, as VISUAL-GRAMMAR §1 requires, and it renders only once the product has a recording in `links.json`.

**Workforce optimization.** The walkthrough (`site/demo/workforce-optimization/`, 2026-09-16, PROVENANCE §19) keeps the product's flow and information model — run optimization (region · period · XLSX) → schematic map with zone and technician details → current-vs-optimized compare → weekly schedule in zone and technician view with before/after KPIs → accept / reject / comment → re-optimize with feedback → export in the field-service import format — on a **fictional metro** ("Harborview": twelve invented districts HV-01…HV-12 with invented postcodes, eighteen synthetic technician ids T-1041…T-1058, no names), so its frames carry no customer geography, no real zone-naming convention, no real resource id and no figure outside the band the site already carries (4.54 → 4.75 jobs per technician per day, *+4.5%*, on plan v2). That closes the rejection recorded below. `tools/capture-wfo-tour.json` drives its whole guided tour by real clicks and is the tour's regression test (it reports console exceptions).

**Poster.** `assets/img/posters/workforce-optimization.jpg`: a 1600 × 900 crop of the 1600 × 1000 `state=final` dashboard (`tools/capture-demo-frames.mjs` in `MODE=script` with `tools/capture-wfo-frames.json`, `DPR=2`), taken from y = 66 rather than from the very top: dropping the topbar buys the whole schedule header, so the poster carries the KPI band, the map with every zone, the "What the solver changed" list and the Weekly schedule header, with no details panel and the toast hidden. JPEG q82 (q86 put it at 314 KB, over the 300 KB ceiling).

**What was rejected.**

- **The four workforce-optimization PoC captures.** They were shipped once and
  have been withdrawn. Between them they printed the engagement's real
  geography (ten Dutch municipalities and an airport, on a labelled service-zone
  map), the customer's zone-naming convention (`NL_north_west_…`), the zone
  count, and ten ten-digit technician resource ids — while the page beside them
  calls the engagement "a global home-appliance manufacturer" and `PROVENANCE`
  §4 records the deliberate decision to withhold the country names because the
  geography narrows that label to roughly one company. Two of them additionally
  printed per-technician uplift ("77% → 87% capacity", "4.98 → 6.47 jobs/day",
  "60% → 100%", "4.2 → 7.6") six to eighteen times the median figure the product
  is cleared to claim, under a disclaimer calling the results modeled
  simulations. Blurring is not enough: the map, the ids and the figures are the
  content. The product shipped four designed illustrations instead until the
  captures could be regenerated against synthetic data — a fictional metro,
  invented zone names, synthetic ids, and deltas inside the cleared band.
  **Done 2026-09-16:** the four frames are captures of the walkthrough on
  exactly that data (block above); the illustrations are gone from disk.
- **The Account Insights reviewer console.** Every frame of it fans real
  published news to named real companies — the account, the news source, the
  cross-account effects and the opportunity chips are all real company names,
  several of them SoftServe customers. Blurring them leaves an empty page.
- **The Intelligent Document Extraction service-packages deck** contains no
  product UI — its 40 images are slide exports, and those carry a customer name
  in the case study.

**Cross-system ERP Q&A.** The walkthrough (`site/demo/cross-system-erp-qa/`, 2026-09-16, rebuilt twice on 2026-09-17, PROVENANCE §22) has no delivered product behind it, so the "real product" its screens are faithful to is the **platform** — Oracle Autonomous AI Lakehouse (Data Studio) and Oracle AI Data Platform (Agent Hub), replicated from Oracle's own product videos and doc figures, plus a small Redwood app for the decisions. The world is synthetic throughout: a fictional multi-entity group, invented customer names (Halden Tooling Group, Kestrel Components, Bramley Logistics …), invented ids on each system's real key shapes (JDE `F4211 · SDDOCO 6421007`, Fusion `DOO_FULFILL_LINES_ALL · FULFILL_LINE_ID 300000048210650`, NetSuite `transactionLine`), invented values, and a band that carries **no** time-to-answer, cost, saving or delivery-time figure — every money figure on screen is the AI's own estimate on invented order lines, labelled as such. No customer mark, no Oracle logo file, no currency symbol beyond the USD prefix the product itself prints. `tools/capture-erpqa-tour.json` drives its whole guided tour by real clicks and is the tour's regression test (`LOGS: none` is the gate); the walkthrough's own capture history is PROVENANCE §22.

**Poster.** `assets/img/posters/cross-system-erp-qa.jpg`, 1600 × 900: a 1180 × 664 CSS-px crop at `DPR=2` (offset (233, 341), resampled from 2360 × 1328, q86, 244 KB) of the analysis view at `state=final` in Dana's own role, from a 1440 × 1100 run of `tools/capture-demo-frames.mjs` with `tools/capture-erpqa-frames.json` — the six tiles after her override (134 lines, USD 3.77 M, eight tier-A accounts), the "Why the lines are late" chart with its four causes, and the four recommended actions with their owners, values and the line that says each one is a task and nothing is written back to an ERP. The window is chosen so both boxes of `.an-cols` are whole. It is wired as `videoPoster` and renders only once the product has a recording in `links.json`.

**Fleet route optimization** and **Repair-or-replace decisions.** Their walkthroughs (`site/demo/fleet-route-optimization/`, PROVENANCE §39; `site/demo/repair-or-replace-decisions/`) were built by their own sessions on synthetic data: Fleet's replayed days, vans and engineers; Repair-or-replace's cases (RR-24811 …) and example rule sets. Fleet's poster, `assets/img/posters/fleet-route-optimization.jpg`, was captured from its walkthrough at 2.5× and cropped to 1600 × 900 (§39).

**Account insights.** The walkthrough (`site/demo/account-insights/`, 2026-09-29, §49) keeps the delivered prototype's flow and information model — the account list, the stories kept after noise and duplicates, the agent run, a review screen per move with scores, cited sources and approve / reject — and replaces its content wholesale. The world is an unnamed logistics and supply-chain services provider with a book of 24 invented accounts (Alder Foods, Baltic Packaging, Meridian Grocers …, ids `ACC-003`…`ACC-046`), two invented account managers (Robin Hale, Nadia Brandt), 12 generic service lines, five invented stories (`SIG-0929-014` …) and invented places (Lindmark, North Quay, Port Selden), so its frames carry none of the prototype's real account names, real news items, the customer's service lines or its data sources (the rejected reviewer console, below). Every figure on screen is computed from those records. No poster: it would render only with a recording in `links.json`.

### 1.7 Superseded in round 20

- **Every step frame of rounds 1–19.** Large docs and Workforce optimization shipped 640 × 400 CSS-px crops of 1600 × 1000 captures (Workforce's step 4 from a 1184 px window), Cross-system ERP Q&A five crops each sized to its own viewport (896, 676, 868 and 880 px), and Fleet 1600 × 1000 crops at 2.5×. The round-20 captures replace every one at the same file names, and each gains its zoom.
- **The 16 designed SVG illustrations** of Account insights, Case evidence collection, Plan vs actual investigation and Business metrics Q&A (drawn to a 1600 viewBox, 44–56 px labels, one blue eyebrow a frame) are deleted from disk; the HTML mocks (1.4) replace them. They were wireframes with placeholder words (*OPPORTUNITY*), the kind of frame Alex's *"they should not look like skeletons"* retired.
- **Cropping with `sips`.** Round 20 captures the region's rectangle directly instead. For a poster re-crop, the corrected note stands: `--cropOffset` takes **Y then X** and is the crop's **top-left origin** (verified 2026-09-17: `sips -c 800 1280 --cropOffset 300 472 frame-1.png` yields the window whose top-left is (472, 300)).

---

## 2. Industry images — `assets/img/industries/`

One file per key in the fixed set of sixteen (VISUAL-GRAMMAR §5), 1200 × 750
JPEG, q86, ≤ 180 KB. Each renders on the product pages' Use cases tab and, since
round 11, as the 16:9 photo band of the home page's case cards: the card derives the
file from its `industry` — `manufacturing`, `travel-transport`, `logistics` and
`construction` today — under a bottom-up veil that carries the descriptor and area in
white, and the checker checks each of those four files on disk.

| Key | Source | Register |
|---|---|---|
| `manufacturing` | IP Customer Stories deck, `image83.jpeg` (tight crop, different framing from the `plan-vs-actual-investigation` hero) | photo |
| `logistics` | IP Customer Stories, `image91.jpeg` | photo |
| `utilities` | IP Customer Stories, `image89.jpeg` | photo |
| `healthcare` | IP Customer Stories, `image96.png` (cropped below the head) | photo |
| `travel-transport` | IP Customer Stories, `image90.jpeg` | photo |
| `public-sector` | IP Customer Stories, `image87.jpeg` | photo |
| `professional-services` | IP Customer Stories, `image84.jpeg` | photo |
| `retail` | AIDP Factory V2, `image83.png` | photo |
| `life-sciences` | AIDP Factory V2, `image88.png` | photo |
| `financial-services` | IP Customer Stories, `image25.png` | abstract render |
| `insurance` | IP Customer Stories, `image56.png` | abstract render |
| `telecom` | IP Customer Stories, `image37.png` | abstract render |
| `energy` | IP Customer Stories, `image46.png` | abstract render |
| `automotive` | IP Customer Stories, `image65.png` | abstract render |
| `construction` | IP Customer Stories, `image63.png` | abstract render |
| `cross-industry` | AIDP Factory V2, `image2.png` | abstract render |

**Treatment.** The hero recipe (`heroes-work/process3.py`), unchanged in
substance: focal crop to 8:5 → Lanczos with unsharp when upscaling > 1.2× →
shadow-targeted denoise on the photographs → a solved levels curve landing the
median in the 45–63 band with p99 ≥ 204 → off-teal chroma collapsed onto luma →
teal cast → desaturate → fine grain. Per-image `teal`, `sat` and chroma-pull
knobs trim the spread; the values are in `industries.py`.

**Why six keys are abstract.** The harvest holds no photograph of an insurance,
banking, telecom, energy, automotive or construction scene — the only genuinely
photographic pool in the whole corpus is eleven frames in one deck. Rather than
mix photographs with synthetic line art, the six fall back to metallic renders
from the same decks, graded identically, so the strip reads as one system.

**People.** No face is identifiable in any shipped industry image: every person
is a silhouette, seen from behind, blurred, or cropped below the head. No logo,
no shopfront name and no legible screen text survives in any crop.

### Two hero photographs behind the home page's two ways in (round 11)

No new file: S2's two panels reuse two graded hero photographs from
`assets/img/heroes/` (SoftServe deck imagery; grade and sources in PROVENANCE §11.1),
each under its own focal point in `overview.twoWays.panels[].image` — the hero entry
in `heroes.json` keeps its own.

| Panel | File | Focal on the panel | Focal in `heroes.json` |
|---|---|---|---|
| Products | `heroes/overview.jpg` — the home hero's photograph until round 5, unreferenced from then until this round | **`35% 45%`** — keeps the bright oval at the panel's right edge, out from under the body copy at every two-column width (lowest body contrast 4.88:1) | `50% 45%` |
| Practice | `heroes/services.jpg` — the Services hero until that page left the site in round 18; this panel is its one use now | `50% 50%` | `50% 50%` |

Both render decoratively (`alt=""`); `image.alt` carries the `heroes.json` wording
for the record.

---

## 2b. Product-group tiles — `assets/img/groups/` (round 17, 2026-09-25)

One line drawing per product group, for the six tiles on the home page's S3
(`facets.categories[].image`; `VISUAL-GRAMMAR.md` §9). Each shows **the group's own
job as its typical flow**, on the tile's flat brand fill, in the style of
softserveinc.com's Our Offers tiles: one thin black line, oversized and cropped by the
tile's top and left edges, that gathers into one filled spark at the moment of value.
They replace round 9's screenshots and placeholders, which round 16 had set as a
window on a chrome photograph (Alex, round 17: *"I don't like current mix of
screenshots with backgrounds"*; PROVENANCE §37).

| File | Fill | What it draws | Bytes |
|---|---|---|---|
| `knowledge-analytics.svg` | blue 75 | two rings, the governed estate; the question runs in along the outer one, the answer sparks, and its trace lands on the inner one (the source) | 587 |
| `deep-research.svg` | orange 75 | three systems as verticals; one reading line threads them, goes past the last to the outside, turns, and brings the answer back to spark between the first two | 948 |
| `documents.svg` | blue 50 | a long page read pass by pass (a serpentine inside its edges); the values leave through the page's edge, where the line sparks | 623 |
| `transactions.svg` | neutral 400 | a step carried up through the system in three stages to the system's edge, where it sparks and leaves: the approval gate | 719 |
| `forecasting-optimization.svg` | blue 75 | three constraints come in at once from the left and resolve at the spark into one plan line, which rises off the top | 799 |
| `video-image.svg` | orange 75 | a camera's field of view from the top-left corner; the spark on its upper edge flags the one object in view | 727 |

Rows are in `facets.categories` order.

**The family, which the checker enforces** (`checkGroupDrawing`): `viewBox="0 0 400
220"` (the tile's drawing box, 55 % of the tile's width), no width or height, one ink
`#1a1a1a`, every line `stroke-width="1.75"` with `vector-effect="non-scaling-stroke"`
(so the line is 1.75 px at every tile width, 288 to 404 px), round caps and joins,
exactly one `data-spark` path, filled and never stroked, and no text, picture, gradient,
filter, opacity, dash or marker; under 8 KB. By the design spec, not the checker: at
most five elements, strokes at least 14 units apart except at the spark, nothing past
x 376 or y 200 (the right and bottom edges are air), mass in the left three quarters.

**The spark** is Fable's construction (round 17 design answer, D3): a hub and three
tips — the back and forward tips 60 units from the hub, and the thorn, 60 to 90 — with
each side a cubic from tip to tip whose controls sit **0.68** of the way from their tips
to the hub. Fable's canonical weight was 0.82; measured beside the reference at tile
scale, its thorn read lighter than the brand's, and 0.68 matches it. A tip that lies on
the line sits on a straight run (or on the circle itself, at chord 60), so the arms never
peel off the line; in deep research the forward tip is free, because the line ends at the
hub. Five drawings use the Y form, the arms 120° apart; the video drawing uses the T, a
straight run through the hub with its back-side controls pushed 4 units off the line.

**How they were made.** The reference graphic is `offer-card-placeholder.svg`, the
same placeholder on every Offers tile across 16 softserveinc.com service pages checked
on 2026-09-25: the brand has no per-offer drawings, so these six are its line and spark
applied to a subject. Fable wrote the six compositions in canvas coordinates; three
Opus drawers produced first versions of four of them and then stalled, and the session
finished all six as one program, so the family shares one spark construction, one
weight and one crop. **That program is `tools/draw-groups.js`**, and it is the way to
change a drawing: edit its composition there and run `node tools/draw-groups.js`, which
rewrites all six (`--sheet` also writes the 3 × 2 grid on the real fills at 400, 343 and
300 px to `.work/group-sheets/`, square, for `qlmanage -t -s <side>`). Hand-editing one
SVG drifts it from the family. Each was checked on its fill at those three widths.

**A seventh drawing, `ask.svg` (round 18), is not a group's.** It sits in the band of
the catalog's last tile, *Looking for another solution?* (`productsPage.askTile.image`),
where a product tile carries its photograph, on the same Lviv blue 75 as the first group
tile. It was added after Alex found the tile's first cut, a title and two lines on a flat
fill, *"too empty"* beside a product tile. Three lanes, the products, run in from the edge
and stop short; a fourth line, the reader's own workflow, runs under them, rises past
their ends on its own route and sparks. The same program draws it (`D["ask"]`), the
checker holds it to the family's rules, and since the tile shows the box cropped to a
product band's 16:7, everything sits above y 170.

## 2c. The Bespoke band's photographs — `assets/img/bands/` (round 18)

Two crops of one photograph for the home page's *Bespoke services* band
(`overview.bespoke.image`): three people in silhouette around a laptop by tall
windows, dark on its left half, where the copy sits. **They are softserveinc.com's own
*Confidence earned* banner**, the block Alex named as the reference, downloaded on
2026-09-29 from SoftServe's CDN and recompressed for this site with `sips` (JPEG
quality 72):

| File | Source | Size |
|---|---|---|
| `bespoke-wide.jpg` | `assets.softserveinc.com/website/assets/banner-confidence-earned.jpg` (2880 × 932) | 2400 × 776, 137 KB — the band from 769 px up, `object-position: 72% 50%` |
| `bespoke-tall.jpg` | the same banner's tablet crop (1536 × 1518) | 1100 × 1087, 99 KB — the phone layout, its own row between the copy and the points, `50% 100%` |

SoftServe's photograph on a SoftServe property, like the fonts and the footer
glyphs; it has not been through the heroes' grade. Swap both files together if Alex
would rather the band not repeat the corporate site's image. The picture element
switches them at 769 px, and the image guard drops either one to the band's black
ground if it fails to load.

---

## 3. Headshots — `assets/img/people/`

Four ship: Karsten's since 2026-09-14 (§3.1), and since round 13 the three product
leads named on the product Contacts cards (§3.2).

### 3.1 `karsten-tramborg.jpg`

Ships. 480 × 480 JPEG, progressive, q85, 33 KB. `shared.contact.photo` points at
`assets/img/people/karsten-tramborg.jpg` and the contact card renders the
portrait instead of the "KT" initials avatar.

**Source.** **SoftServe AIDP Factory V2** (presentation templates),
`ppt/media/image76.jpeg`, 460 × 460. It was located by **position, not by face**:
on the "Oracle AI DP Team at a Glance" slide each person's picture sits at a
fixed offset to the left of their name box (pic `x` = name `x` − ≈ 567 000 EMU,
one row down), and the picture carrying that offset from the text run "Karsten
Tramborg" is `rId7` → `image76.jpeg`. That heuristic alone was **not** enough to
ship — the site prints the name, the title and a working mailto beside the
picture on every Contacts tab, so a neighbouring tile would publish a colleague's
face under Karsten's name. **Alex confirmed the identity on 2026-09-14**; that
confirmation, not the offset, is what clears it.

**Treatment.** `-auto-orient` → Lanczos to 480 × 480 with a centre `^`/extent
square crop → light unsharp (`0x0.8+0.6+0.02`) → +4 contrast → strip → progressive
JPEG q85. Deliberately **not** teal-graded: a portrait in a contact card should
read as a portrait, not as part of the hero system.

**Title.** The pack one-pagers print his contact block as

> Karsten Tramborg · Alliances & Partnerships Director, SoftServe

in both the Workforce Optimization sales one-pager and the Intelligent Document
Extraction sales one-pager, and the AIDP Factory deck labels the same person
"NVIDIA Partner Director". **The site prints neither: since 2026-09-23 it prints
"Oracle Partnership Director, SoftServe"** (Alex, round 10), which is the title
`shared.contact.title` carries. The one-pagers keep *Alliances & Partnerships
Director* — they are the pack's own contact block and are not reissued for this —
so the two surfaces differ on purpose; the site still must not print two titles for
one person. Neither one-pager contains a picture element, so the headshot had to
come from the team slide.

The email on the site is the shared alias `oracle@softserveinc.com` as
instructed. The one-pagers print his personal address; it must not ship.

### 3.2 `vlad-butenko.jpg`, `dmytro-dudchenko.jpg`, `oleksii-orlov.jpg` (round 13)

Ship. 240 × 240 JPEG, progressive, q85, 9–12 KB each: the card draws them in a
72 px circle, so 240 covers 3× density, and the sources are only 300 px.

**Source.** Alex, 2026-09-23: *"You can find photos for all of us in my Outlook
locally."* Outlook for Mac keeps the company-directory photos it has shown in
`~/Library/Group Containers/UBF8T346G9.Office/Outlook/Outlook 15 Profiles/Main
Profile/Files/S0/3/Photos/`, about 400 PNGs, mostly 300 × 300. The files are named
by an internal object id, and nothing on disk maps an id to a person. **Identity
came from Teams' web cache**, which stores the same directory photos under URLs
carrying the person's display name
(`…/profilepicturev2/8:orgid:<id>?displayname=Vladyslav%20Butenko&size=HR196x196`).
Each Teams copy (196 px) was then matched to its larger Outlook copy by normalized
cross-correlation on a 24 px grey thumbnail: **0.9997–0.9998 for all three**, with
the runner-up ≤ 0.84. Every "Oleksii Orlov" match was checked against the signed-in
account's own id, because the directory holds namesakes. Outlook files, by person:
`{…242C-0F0000000000}…` (Vlad), `{…1E2C-0F0000000000}…` (Dmytro),
`{…2C2C-0F0000000000}…` (Alex). The Teams display name for Vlad is *Vladyslav
Butenko*; the site prints *Vlad Butenko*, Alex's words.

**Treatment.** Karsten's (§3.1) apart from size: `-auto-orient` → crop → Lanczos to
240 × 240 → unsharp `0x0.8+0.6+0.02` → `-brightness-contrast 0x4` → strip →
progressive JPEG q85. The crops bring each head to about the size of Karsten's in
the circle: Dmytro's full frame; Vlad's 260 px from `+20+8`; Alex's 200 px from
`+50+13`, because his source is a head-and-shoulders shot at a third of the frame
and would otherwise sit at half the size of the others.

**Identity.** Matched by the directory's own name key, not by position or by face,
which is a stronger footing than §3.1's team-slide offset. Alex still sees all three
faces on the Contacts tabs; if one is wrong, blank that person's `photo` and the
card falls back to initials.

---

## 4. Customer logos — `docs/asset-candidates/logos/`

> ⛔ **2026-09-17: the folder moved out of the deployable root.** Until then it sat
> at `site/assets/img/logos/`. Nothing referenced it, but whole-tree publishes had
> carried the three files onto the link-shared preview artifact, where anyone could
> download them by path. Version 36 removed them from the artifact (`PROVENANCE.md`
> §25). Outside `site/`, neither a publish nor a deploy can carry them. They stay
> in the repo for the reasons below. `check-grammar.js` fails if
> `site/assets/img/logos/` exists again.
>
> ⛔ **Round 4, 2026-09-16 — nothing in this folder is referenced any more, and
> no customer is named anywhere on the site.** Alex withdrew the 2026-09-14
> clearance that named two customers: there are now no customer names, no logos,
> no names in alt text, captions, data files or shipped docs. Every case study
> identifies its customer by an **anonymized descriptor** (industry and scale)
> and an **industry medallion** — a circle carrying the industry line icon —
> where the logo used to sit (`VISUAL-GRAMMAR.md` §2a.2).
>
> **The files stay on disk, unreferenced, pending customer approval.** They are
> not deleted, because the approval that would bring them back is a conversation
> with two account teams, not a re-derivation: the recolouring recipes below are
> the part that would be expensive to redo. `check-grammar.js` fails the build
> if any path under `assets/img/logos/` reappears in `data/content.js`, and it
> fails on each customer name as a string, so the files cannot come back by
> accident — only by removing that guard deliberately, which is the record that
> a permission arrived.

The section below describes the two files as they were prepared on 2026-09-14,
and the licensing position that applied while they shipped. It is history, not
current state.

| File | Size | What it is | Source |
|---|---|---|---|
| `bosch.png` | 720 × 161, 21 KB | Bosch supergraphic + wordmark, **all-white**, transparent | `WF_draft.pptx` (Monthly AI product overviews / AI Solutions review – Sep), `ppt/media/image7.png` — 960 × 216 transparent PNG of the official brand lockup |
| `riyadh-air.svg` | 14.8 KB | Riyadh Air roundel + Latin/Arabic wordmark, **all-white**, vector | `NEW_09.06 Riyadh Air – Oracle – SoftServe PoC Demo.pptx` (Projects/Oracle/Customers/RiyahdAir), `ppt/media/image15.svg` — the deck's own vector logo, single-fill `#250852` |
| `riyadh-air.png` | 720 × 247, 25 KB | raster fallback of the same, transparent | rendered from `riyadh-air.svg` |

**Treatment.** Both are reduced to a **single white ink** so they sit on the dark
surface the same way the shipped `softserve-logo-white.svg` and
`oracle-wordmark-white.svg` do, and so no brand colour competes with the site's
teal accent.

- Bosch: `-trim` → alpha preserved, RGB set to 100 % (white) → Lanczos to 720 px
  wide → PNG32. The source's red wordmark and black supergraphic both become
  white; the anchor symbol's interior counters stay transparent, so the mark reads
  correctly. Black-on-dark would have been invisible, which is why the original
  full-colour file is not what ships.
- Riyadh Air: the single fill class `#250852` (and the stray `#1A1A1A` presentation
  attributes under it) rewritten to `#FFFFFF`, the Office-specific class name and
  `id="AW"` dropped. Geometry untouched — this is the airline's own vector
  artwork, not a trace.

**No Wikimedia fallback was needed.** Both marks came out of SoftServe's own
customer decks, so nothing was fetched from the open web and there is no external
source URL to record.

**Licensing position.** These are third-party registered trademarks reproduced to
identify the customer in a reference story. They ship on Alex's statement that
both customers are referenceable; the permission lives with the account teams, not
in this repo. Recolouring to a single white ink is the standard reversed-logo
treatment both brands publish for dark grounds, but it is still a modification —
if either account team supplies an official reversed asset, replace the file
rather than re-deriving it.

**This is what happened on 2026-09-16**, in the other direction: the names came
out of `data/content.js` in the same change that unreferenced the logos, because
the logo was never the only place the customer was identified — the descriptor,
the industry string and the story all named them too. Bringing either back is a
three-part change (the file reference, the descriptor, the deny-list entry in
`check-grammar.js`) and it needs the account team's written permission recorded
here, with a date.

---

## 5. Licensing and provenance caveats

- Every raster used is from **SoftServe's own decks**; nothing carries a
  watermark or a third-party stock mark.
- The photographic picks are **AI-generated art commissioned inside a SoftServe
  deck**, not licensed stock — garbled micro-glyphs survive on a couple of them.
  Worth one line of confirmation with whoever owns that deck before the site goes
  public. There is no visible external origin to flag.
- The two step screenshots are **SoftServe product UI** — the document-extraction
  reviewer, built by SoftServe on OCI. Both run on a synthetic contract with
  invented station names, not on a customer's records. This was **not** true of
  the four workforce captures that shipped alongside them: those printed the
  engagement's real geography, its zone-naming convention, technician resource
  ids and uncleared uplift figures, and they have been withdrawn (see §1). Check
  a capture frame by frame before trusting a sentence like this one about it.
- **The headshot ships on a human confirmation, not on the offset heuristic that
  found it** (see §3). If that confirmation is ever retracted, pull the file and
  blank `shared.contact.photo` in the same change — the card falls back to its
  initials avatar on its own.
- **The two customer logos are third-party trademarks** (see §4). They were the
  only assets on the site whose right to ship rested on a customer's permission
  rather than on SoftServe owning the file — which is exactly why they are the
  two that came off the site on 2026-09-16. They remain on disk and
  **unreferenced**; nothing renders them, and the build fails if anything starts
  to. Everything else in `assets/img/` is SoftServe's own material.
- Nothing on OneDrive was modified; every extraction was a read-only
  `unzip`/`unzip -p` or `pdftotext`/`pdfimages` against a copy.

## The SS26 brand marks and fonts (2026-09-18)

`site/assets/img/brand/` holds the marks for the current SoftServe brand. All
were derived, not drawn.

| File | How it was made |
|---|---|
| `softserve-wordmark-ink.svg`, `-white.svg` | the wordmark served on softserveinc.com (`assets.softserveinc.com/logos/softserve-logo.svg`, `viewBox 0 0 1010 173`, nine glyph paths, no `fill` attributes so it inherits `currentColor`), re-emitted twice with an explicit `#1A1A1A` and `#FFFFFF` fill because an `<img>` cannot inherit colour. 3,196 bytes each |
| `oracle-wordmark-ink.svg` | `assets/img/oracle-wordmark-white.svg` with its single `#FFFFFF` fill (in the file's own `<style>` block) recoloured to `#1A1A1A` |
| `nvidia-wordmark-ink.svg` | `assets/img/nvidia-wordmark.svg` with the `#D9D9D9` masked rect recoloured to `#1A1A1A`; the mark is a masked raster pattern, so only that one fill exists to change |
| `header-divider-ink.svg` | the white divider's path with the stroke set to the brand separator `#BDCBD7` |
| `favicon.svg` | **softserveinc.com's own site icon** since round 18 (Alex: *"same site icon as softserveinc.com"*): its `favicon-web-32x32.svg` from `assets.softserveinc.com/favicon/`, the white SoftServe spark on a black square, read 2026-09-29 and stripped of a no-op clip path. Inlined as a data URI in `index.html`, and the checker holds the two equal. It replaced the white S on a Lviv-blue octagon |

The Oracle and NVIDIA ink marks now appear only in the home hero's stack and on the
product pages' Technology tab. The `#about` band carried them until round 18 (Alex
removed them), and the footer carries none since round 14; its Oracle row, since
round 18, is text links.

**The footer's spark (round 14).** `assets/img/softserve-star-white.svg` (135×154,
from SoftServe's brand kit, `BRAND/logos/`, PROVENANCE §5) is drawn 24 px wide at
the right of the copyright row, where softserveinc.com's own footer puts the same
mark: its `hero-icon.svg` (`viewBox 0 0 104 119`) is the same path at 0.77×,
compared point by point on 2026-09-24. It is a white file on the black block, and
print inverts it. The eight social glyphs are not files: their paths are inlined in
`assets/app.js` (`SOCIAL_GLYPHS`), read from `assets.softserveinc.com/icons/*.svg`.

`site/assets/fonts/` holds the five licensed faces, taken from SoftServe's own
`/_next/static/media/` and renamed: `Azurio-Regular.woff`,
`Azurio-Semibold.woff`, `ReplicaLLWeb-Light.woff2`, `ReplicaLL-Regular.ttf`,
`ReplicaLL-Bold.ttf` (740 KB total). They send no CORS headers at source, so they
cannot be hotlinked — self-hosting is the only route. Alex confirmed on
2026-09-18 that a SoftServe employee building a SoftServe property may use them;
do not copy them into a non-SoftServe project.
