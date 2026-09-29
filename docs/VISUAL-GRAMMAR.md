# VISUAL-GRAMMAR.md — one component grammar for all seven product pages

This file is the contract between `site/data/content.js` and the product renderer (`site/pages/product.js`). It answers one question: **what component renders each fact, and does it look the same on all seven products?**

The rule that produced it: a reader who has seen one product page must be able to read the next six without re-learning the layout. Same eyebrow treatment, same icon style, same card geometry, same order. Only the words change.

Five hard rules:

1. **Every product fills every slot.** No product is allowed to render a shorter Overview than another. Where a product has no published number, the slot is filled with a **qualitative** instance of the same component — never a blank, never a missing section, never a sentence apologising for the absence.
2. **A number never renders without its honest frame, and never with an apology.** On the Overview's KPI band (round 20, Alex: no footnotes, no method notes) the frame is inside the tile: the kind chip (*Proven* or *Estimated*) and the figure's own shape, a range or a "from X", drawn on a chart whose every mark carries a printed label (§2.4). A price keeps its footnote, `jumpstart.investment.footnote`, under the price card in its block; and the case-study callout, which has no footnote row, carries its caveat in the last sentence of `story`. The home case card has had no footnote row since round 19 either: its figure's small line (`metric.label`) carries the baseline (*down from 3–5 days of keying by hand*), and on a Forecast card the two load-bearing facts, *simulated on the customer's own history*.
3. **Icons are 1.5px line icons, teal, from the one registry in `assets/app.js`.** No emoji anywhere. No filled icons except the existing `play` and `dot`.
4. **Peer figures share their baselines.** Wherever a value/label pair sits beside another — the case-study callout's figures where it carries two, the Jumpstart investment figures, the KPI band's tiles — the row is one grid with two rows, so every value occupies the first and every caption the second. Laid out as independent cards, one wrapped value drops its caption half a line below its neighbour's, and two captions on different baselines is the geometry inconsistency this file exists to prevent. On mobile the pairs stack and the rule is moot.
5. **No customer mark is rendered at all** (Alex, 2026-09-16). A logo is the one element of a case study that cannot be anonymized, so the **industry** stands where a mark used to: on the product page's callout as the medallion — a circle carrying the `industry-<key>` line icon, at the same optical weight — and on the home page's card as that industry's own photograph (round 11, §9 S5). The files under `assets/img/logos/` stay on disk, unreferenced; `check-grammar.js` fails the build if a path under them returns to `content.js`.

---

## 1. Hero (top block) — every page but one

On a product page, the hero is the only block that carries a background image — and the same file has one other job, described at the end of this section: it is the tile on the Products page.

**The home page is built the other way round** (round 5, §9; round 11): its hero carries no photograph at all, and its photographs sit lower down. `overview.hero.image` is retired, the right column holds the built-on stack visual instead, and everything below about images, focal points, veils and posters applies to the seven product heroes only (the Services hero left with its page in round 18). Two of the hero files are reused below the home hero, each under its own focal point: `heroes/overview.jpg` behind the products panel of S2 and `heroes/services.jpg` behind the practice panel (§9). The rest of the hero grammar — eyebrow, H1 with a teal part, lead, a CTA row that is always last — the home hero keeps.

| Part | Source | Notes |
|---|---|---|
| Background image | `products[].hero.image` — `{ file, alt, focal }`; **no home-page entry since round 5** | `file` is a path relative to `site/index.html`. `focal` is a CSS `object-position` value. `alt` is the accessible description; because the image is decorative background, carry it as the container's `aria-label` only if no other label exists, otherwise `aria-hidden`. The authority on `alt` and `focal` is `site/assets/img/heroes/heroes.json`; `content.js` carries a copy so nothing has to fetch JSON at runtime — **keep them in sync**. |
| Treatment | — | Image right/top, dark gradient left-to-right plus a bottom fade into the page ground `#131313`, so headline and CTAs sit on near-black. A subtle teal tint over the image is allowed. |
| Height | — | 60–70vh maximum on desktop. **Not** full-screen. Auto height on mobile, with the image faded harder. |
| Content | `headline`, `heroLine?`, `badges?`, the chip row (§1.2), `oneLiner`, `statusNote?`, `subLine?`, CTAs | The chip row replaced the flat chip list in round 4. CTAs are the primary **Talk to us** — `site.primaryCta.label`, routed to that product's Contacts tab — and, when the `interactiveDemo` link is set (`links.json`), a secondary **Interactive demo** that opens the walkthrough in a new tab (CONFIG §3a). |

**The CTA row is one ask, and one glyph per button** (round 10). The primary button
reads `site.primaryCta.label`, the **same key the header button reads** — one
contact ask site-wide, so the hero, the header and the Contacts form cannot drift
into three different asks. It ships as *Talk to us*; *Request a demo* is retired as
a label and `check-grammar.js` fails the raw text of `content.js` on the string
(the `request-a-demo` anchor id is deliberately not matched — seven pages deep-link
to it). The walkthrough button carries **the badge's own words** (`shared.demoCta`,
asserted equal to the *Interactive demo* badge's label) and **the badge's own
`cursor-click` glyph, leading the label, with no trailing `external` glyph**: the
pointer is what says "a walkthrough you click", and a second glyph beside it only
dilutes it.

**Two hero layouts, chosen by data — nothing else changes.**

- **Single column** (default) — text over the background image. Used whenever the product has no `video` link in `links.json`.
- **Two column** — text left, a 16:9 media frame right, **only when the product has a `video` link** (round 18, Alex: *"No fake and placeholder links no longer allowed"*). The frame has a thin border and a slight lift, shows a poster image with a circular play button overlay and the caption **"Watch the demo"**, and opens the video modal. Until round 18 a `video: true` switch put the frame up before a recording existed and answered the click with a *"The demo recording is being prepared"* panel; the switch and the panel are retired, and the checker fails both.

Poster resolution order, first non-empty wins:

1. `SITE_CONFIG.products[slug].videoPoster`
2. `https://img.youtube.com/vi/<id>/maxresdefault.jpg` — only when the `video` link is a YouTube link

There is no third step. **The hero image is never the poster.** Rendering the
hero photograph inside a frame that sits on top of that same photograph makes
the frame read as a brighter cut-out of the wallpaper rather than as a video
still, and it is the first thing on the page a seller demos.

A recording with no poster renders without its `<img>` and carries the
`video-card--plate` modifier: a navy-to-inset gradient ground, a lighter veil,
the play button and the caption. The frame's veil stays light enough to keep a
real poster a picture rather than a grey field — only the caption's corner is
shaded. A `videoPoster` is a **distinct** treated frame — a step screenshot, a
desaturated crop at another focal point — never the hero file.

A product without a recording never renders a frame, an empty frame, a greyed play button, or a "video coming soon" line.

### 1.1 The same image, as a Products-page tile

**Copy sits on a photograph only where the component is a photograph by design, and always under a veil or scrim that carries its legibility**: the product heroes (a veil from the copy side), the home page's two ways in (a scrim, §9 S2), the home page's Bespoke band (a scrim heaviest at the left and the foot, §9 S4b), and the home case card's band, which carries the descriptor and the area and nothing else (a bottom-up veil, §9 S5). **A tile is never one of them** (round 3, D): every tile is **an image band over a solid body**, its copy on the body, and both halves are the same size on every tile — two per row, equal height.

| Part | Content |
|---|---|
| **Image band** (~16:7, top) | That product's own `hero.image`, same file and `focal`, **ending on a clean edge where the body begins** (round 18, Alex: *"boundary between image and block underneath should not be blured"*; the veil that faded the photograph into the body is gone, as on softserveinc.com's cards). Overlaid: the **facet short label** top-left on its own plate — the brand's card chip on a photograph, `#4d4d4d` at 30% under white 12 px micro-type, a 4 px cut — and the **Artifacts badges** top-right on their white plates. Nothing else. A product on two platforms carries **one plate per platform** in a `.ptile-facets` wrapper that keeps the lone plate's corner and 60% width, so the plates sit side by side on a wide tile and wrap to a second line on a phone, clear of the badges (2026-09-29). |
| **Body** (solid dark surface) | The **category chip**, the product **name** as an H3, the `oneLiner`, the three `tile.outcomes` as check-icon bullets, and **one** CTA — `Learn more →`. |

The second CTA — the contact ask — is gone from the tile: a tile with two actions makes the reader choose before they know what the product is, and the product page's hero carries that ask anyway. Hover steps the tile's surface and scales the image, which `prefers-reduced-motion` disables.

**The grid always ends on the ask tile** (round 18, `productsPage.askTile`): *Looking for another solution?*, into the home page's contact, after every result, the empty ones included. **It is a product tile's peer in anatomy, not only in size.** The grid's rows are equal height, so a tile takes its tallest neighbour's height, and the first cut — a title and two lines on a flat fill — stood mostly empty beside a product tile (Alex: *"looks too empty"*). So it has the same slots: a band where a product carries its photograph, on Lviv blue 75 (the first group tile's fill), carrying the family's line drawing (`groups/ask.svg`) cropped by the band's top and left edges; then the body every tile has, on the same surface — the title, one line, three check-mark lines, and the link at the foot where *Learn more* sits. **A peer that holds less than its row-mates gets their anatomy filled with its own content, never a stretched sparse box.**

A product with no hero file on disk renders the same tile with the band on the flat ground, because the image guard drops an `<img>` that will not load. **The home page carries no product tiles since round 9** — its S3 is six group tiles (§9), which share this tile's grammar (a picture over the copy, text never on the picture, one action) at a different scale and with a group's name and line instead of a product's. Since round 17 their picture is a line drawing on a flat brand fill, not a photograph: the fill is the tile's ground, not an image, and the drawing box sits above the copy in flow, so no word can land on a line.

### 1.2 The chip row — three tag families, visibly different (round 4, T1)

Before round 4 the hero and the tiles carried a run of chips that all looked the same: a category, an Oracle platform, a technology name and a sales state, in one undifferentiated navy row. A reader had to know the taxonomy to tell which was which. There are now **three families**, each with its own shape, and each naming itself in a `title` tooltip read from `shared.tagFamilies`.

| Family | Shape | Content | Tooltip |
|---|---|---|---|
| **What it does** | **Outlined** chip — transparent ground, 1px border | The product's `categoryChip`, which since round 9 is the **group's full name** — *Enterprise knowledge & analytics* · *Deep research & investigation* · *Document processing* · *Transaction & process execution* · *Forecasting & optimization* · *Video & image intelligence* — with the icon from `shared.tagFamilies.pattern.icons[product.category]`, one glyph per group | `What it does` |
| **Technology** | The existing **solid navy** pill | **One pill per platform the product runs on, each the facet's short `label`** — *AI Lakehouse*, *AI Data Platform*, *OCI + NVIDIA NeMo*; the two Q&A products carry *AI Lakehouse* and *AI Data Platform* since 2026-09-29 (PROVENANCE §46), every other product one pill — carrying its `fullLabel` as the `title`, with the platform glyph from `shared.tagFamilies.tech.icons[<facet id>]`: a cloud-and-GPU glyph for OCI + NVIDIA NeMo, a data cylinder for AI Data Platform, a layers glyph for AI Lakehouse, an application grid for AI for Fusion Applications | `Runs on` |
| **Artifacts** | Compact **tinted icon pill** — a badge, not a chip | *Interactive demo* (`cursor-click` glyph) where the product's `interactiveDemo` link is non-empty; *Oracle Marketplace* (storefront icon) where `.marketplace === true` with its listing's `marketplaceUrl` (round 18). **Maximum two, and both are optional.** | `Interactive demo — a guided walkthrough you can click through` / `Available on Oracle Marketplace` |

**One canonical technology set, in two forms** (round 4, T3; re-cut in round 9 on Alex's instruction). The **short `facets.technology[].label`** — *AI Lakehouse*, *AI Data Platform*, *AI for Fusion Applications*, *OCI + NVIDIA NeMo* — is what every compact surface renders verbatim and alone: the Products rail, the hero technology chip, the tile image-band label, `products[].tags[1…]` and the bottom band of the home hero's stack (which reads `facets.technology` directly, so it cannot drift). The **full `fullLabel`** — each opening on "Oracle" — is what prose and the footer's Oracle row use (round 18; the Services platform cards that carried it left with their page). A platform gets two forms and no more: a third (`stackLabel`, tried mid-round) would put a different name on the stack from the rail, which is the drift this rule exists to prevent. Until round 4 a product could append its engine to the pill — the three deep-research products and the extraction pack put `AI-Q` beside `OCI + NVIDIA`, the workforce pack put `cuOpt` and `Oracle Field Service` there, the two Q&A packs put `Select AI` beside the Lakehouse. Two chips of the same family and colour with no separator read as one name, so the hero advertised *OCI + NVIDIA AI-Q*, a platform nobody ships, while the rail one click away said *OCI + NVIDIA*. **A technology pill that is not a platform is now a build failure**; the engines are not lost, they are where a technical reader looks for them — the Technology tab's narrative, solution stack and integrations, each of which already named all four. A second *platform* is different (2026-09-29): it is a canonical facet with its own pill, allowed only where the product's own engine is part of that platform too, and only with its Technology tab saying how it runs there.

**Every pill on the site belongs to one of these families, and says which on hover.** The solid navy pill means *technology*; anything else set in it dilutes that the moment a visitor leaves a product page.

**Badges are actions, not labels.** *Interactive demo* scrolls to the hero's demo frame and opens it where the page has one, opens the walkthrough itself where it does not, and goes to the product page from a tile. *Oracle Marketplace* opens the listing; since round 18 it renders only with its `marketplaceUrl`, never inert.

**A badge names the thing it opens, and reads the same field the filter reads** (round 9, Alex: *"ERP Q&A has an interactive demo but no Demo tag"*). Both the badge and the *Interactive demo* checkbox key off a non-empty **`interactiveDemo`** link — the walkthrough itself — where they used to key off `video`, which only decides whether the product page carries a 16:9 video frame. Reading the frame flag had let the two drift in both directions: *Account insights* carried a badge with no walkthrough behind it, and *Cross-system ERP Q&A* had a walkthrough and no way in from the chip row. The glyph changed with the meaning — `cursor-click`, a pointer with its click strokes; `play` is now reserved for a recording. `pages/product.js` delegates to the shared `UI.demoHref`, so the hero button and the badge can never open different things.

**Placement.** In the hero, the row splits: group and technology chips at the left, Artifacts badges at the **right end**. Below 768px both wrappers dissolve and the badge flows as the **last chip of the run** rather than dropping to a line of its own — a lone badge on a fourth row reads as an orphan and pushes the value proposition below the fold. On a products-page tile the badges sit **top-right of the image band**; the platform label keeps the top-left. The home page carries no badge at all since round 9: S3 is six group tiles, with no product names and no per-product state on them. The tile variant swaps the tint for a black scrim so it stays legible over photography, but keeps the 1px border and the coloured label — it has to stay recognisable as the same family.

**The three-state availability chip is gone** — *Available now*, *Fixed-price offer* and *In preparation*, their data map, the per-product denormalised copies and the availability strings at the end of each `tags` array. What a customer can act on is whether a demo exists and whether a listing exists, and both are config flags. The one thing the badges cannot say is that no package exists yet, and that survives as a **muted status line** under the hero one-liner on the two unpackaged products only (`products[].statusNote`): *"In preparation — scoping conversations are open."* No chip, no badge, no legend.

### 1.3 The Products facet rail — a fixed shape, and a count that is never a score

**Both radio groups are fixed lists** (round 9, Alex: the catalog's *What it does*
must match the six groups in that exact order). The rail has one shape whatever the
catalog holds today, and the rules are the same for both groups:

- **Every option renders, always, in canonical order.** The platform group reads
  `facets.technology` and the group rail reads `facets.categories`, so the rail can
  never list a platform or a group in words, or an order, the rest of the site does
  not use. Today: **All · AI Lakehouse · AI Data Platform · OCI + NVIDIA NeMo** and
  **All ·** the six groups.
- **The one platform not offered is the one no product can run on.** *Oracle AI for
  Fusion Applications* carries `catalog: false` and is left out of the rail
  entirely — a filter that can never return anything is not a filter — while
  staying on the hero stack, where it is a platform the practice delivers on. The checker allows that flag on that id alone.
- **A zero-count option is disabled and prints no number.** That is what answers
  §18.9's objection to a `0` beside an Oracle product name on a page an account
  executive opens live: the option keeps the rail's shape, and the score is simply
  not printed. Today the disabled options are *Transaction & process execution*
  and *Video & image intelligence*; *AI Data Platform* has returned the two Q&A
  products since 2026-09-29.
- **A product on two platforms counts under both** (2026-09-29): the platform
  options are filters, not a partition, so their numbers may sum past the catalog.
- **The exception is the option a deep link arrived on.** `#/products?tech=<id>`
  and `#/products?cat=<id>` are honored for every id: the active option renders
  even at zero, selected and clickable, above that facet's or that group's own
  `emptyState` inside the normal grid container. A saved or pasted link never
  dead-ends — which matters more since the home page's six group tiles link
  straight into `?cat=`.
- **A count says what a click would return, and the All option prints none.** The
  option that clears a group would return the whole catalog, which is the one
  number the page does not state (§18.9). The results line above the grid follows
  the same rule: **nothing when nothing is filtered, nothing when a filter returns
  zero, and a bare `N products` with no denominator otherwise** — never `5 of 7`.
  The element stays in the DOM either way, because it is the `aria-live` region
  that announces the next change. **Neither rail ever prints a total.**

The third group, **Artifacts** (*Interactive demo* · *Oracle Marketplace*), keeps
its round-4 behaviour and is unchanged by this: both checkboxes always render with
their faceted counts, and a zero-count box renders disabled rather than absent.
They are two named capabilities — the group's shape is the site's answer to *"can I
see a demo today?"*, and hiding the question is not the same as answering it.

**The `.rail-note` line under the platform group is gone**, with the
`facets.footnote` string it printed: it existed to explain the platforms the
rail no longer shows.

---

## 2. Overview tab — one column: the problem, the numbers, the screens

**Round 20** (Alex, 2026-09-29: *"all blocks are too greyish"*; How it works *"Can't fit the entire block to a single screen"*; *"More detail block - on Overview page - to be removed"*; the ROI block *"too wordy, and too boring"*). The tab is **one column at the wrap's width**, 1,248 px at 1440, with **no rail**, in the order of the argument:

| Order | Block | Source | Section |
|---|---|---|---|
| 1 | **Problem → What changes**: two plates | `overview.problemSolution` | §2.1 |
| 2 | **What changes in your numbers**: the KPI band | `overview.metrics` | §2.4 |
| 3 | **How it works**: the step list beside one frame | `overview.steps` | §2.2 |

- **The number is the reason to look at the screens**, so the band comes before How it works. The checker holds the order (`problemSolution()` → `outcomesBlock()` → `howItWorks()` in `overviewTab()`); the reverse is one line there, and open for Alex (PROVENANCE §41.11).
- **Spacing.** The blocks sit 64 px apart (40 on a phone; `.tab-body--overview`). The band is full-bleed with 64 px of padding (40 on a phone); the plates and the frame keep the wrap.
- **One grey step and one contrast plate per screen** (`SS26-THEME.md` §3, §5): the problem plate is the tab's one `#edf0f2` surface, the What changes plate its one dark plate, and the band carries its own light gradient. Nothing on the tab is grey on grey.
- **The screen budget.** How it works fits one 1440 × 900 screen under the 50 px header: the H2 (58 px) + 24 + the 545 px frame is **627 px, within 830**. At 1280 × 800 the frame is 744 × 465 and the block **547 px, within 750**. The plates are about 264 px tall at 1440 and the band about 480.
- **Nothing else renders here.** More detail is removed (§2.7). `scope`, `features` and each step's `features` stay in the data, unrendered, and `scope` moves to the Jumpstart tab next round (`SCHEMA.md`). The industry tabs and the case study are the Use cases tab's (§2a), because they answer a different question: *where does this apply, and has it worked?*
- **Breakpoints.** From 768 to 1099 px the plates keep two columns (padding 32, headline 24 px), the band two columns (a third tile full width under a rule), and How it works puts the frame over the list. Below 768 px everything stacks, and How it works becomes four cards (§2.2).
- The Previous/Next pager was removed in round 3: the tab bar and the Products grid are the navigation.

### 2.1 Problem → What changes — two plates

`overview.problemSolution` → `{ problem: { headline, text }, solution: { headline, text } }`

Round 20 (Alex: *"too much text, heading indistinguishable from text, not sexy - have no motivation to read"*). Two plates side by side at one height, the problem on the left and what changes on the right:

| Part | Rule |
|---|---|
| Grid | `.ps-pair`: two equal columns, gap 24, the plates stretched to one height. One column below 768 px (gap 16). |
| Plate | `.ps-plate`, a 12 px cut, padding 40 (32 from 768 to 1099 px, 24 on a phone). **The problem** sits on `#edf0f2` in ink: the tab's one grey step. **What changes** sits on the `#1a1a1a` plate in white: the tab's one dark plate. |
| Eyebrow | 12 px uppercase at +.06em, read from `sectionLabels.problemEyebrow` and `solutionEyebrow`, the same on every product: `#4c5156` on grey, `#bdcbd7` on dark. |
| Headline | the plate's heading (an `h2`), Replica 400 at 28 px (24 below 1100), ink or white: the claim itself, **at most 60 characters and two lines**, balanced so the two lines come out even (`text-wrap: balance`). |
| Text | one paragraph, 18 px Light, **at most 30 words**: `#26292b` on grey, white at 82% on dark, wrapped to avoid a lone last word (`text-wrap: pretty`). |

**No icon and no arrow.** The pair reads left to right on its own, and the contrast between the two plates carries the before → after. The pair is about 264 px tall at 1440.

**The copy** (Alex: *"preserve sharpness and focus around ROI, business value and clarity for the audience outside the specific industry"*). The problem headline names the role and what the situation costs them, in the nouns on their desk; the headline opposite says what changes in that person's work, and how much faster. Neither names a platform or an engine (round 19's rule: the checker fails `IMPLEMENTATION_TERMS` in both fields), and neither repeats the product's one-liner. The checker also holds the two budgets, and fails a plate's `title` or `icon` by name.

### 2.2 How it works — the step list beside one frame

`overview.steps[]` — **3–5 steps** (four on every product today), `{ n, title, text, shot: { full, zoom, region, anchor, alt }, features }`. Heading `sectionLabels.howItWorks`, an H2 at 48 px.

Round 20 (Alex: *"Can't fit the entire block to a single screen, which is bad + step headings are poorly lined up + too many fonts in a single place; screenshots are too small cuts … ideally, screenshots be fullscreen"*). The steps are one vertical list, and the screen is one frame beside it:

```
H2  How it works
1  Drop the document in             [ the frame, 872 × 545 at 1440:            ]
   the open step's text, 16 px      [ the whole screen, the step's region      ]
2  The rates come out as rows       [ ringed in blue, and the zoom of that     ]
3  Doubts are flagged               [ region inset at a free corner, 401 px    ]
4  Approve and export
```

| Part | Rule |
|---|---|
| Grid | `.hiw-body`: the list at 344 px and the frame, 32 px apart, from 1400 px up; 320 px and 24 below. The frame sets the block's height; the list is shorter. |
| Step row | `ol.hiw-list`, one row per step, its head a `<button>` (`aria-expanded`; `aria-controls` names its text and its frame). The number and the title **on one line, both 20 px Replica 400**: the number `#1485c4` on the open step, `#4c5156` otherwise. Padding 16 / 0 / 16 / 20, a 1 px `#d1dae2` rule under every row. The open row carries a **2 px blue left rule** and shows its `text` under the title at **16 px Light** in `#4c5156`, wrapped to avoid a lone last word; a closed row is its title alone. **Two sizes, 20 and 16, and no tick-lists.** A `title` is at most 26 characters, so none wraps; a `text` at most 30 words. |
| Frame | `.hiw-shot`, 16:10: **872 × 545 at 1440**, 744 × 465 at 1280. `shot.full`, the whole screen, in a 12 px cut with a 1 px `#bdcbd7` hairline. Its `alt` is `shot.alt`, what the screen shows. |
| Region ring | `shot.region`, `[x, y, w, h]` in percent of the frame: the one thing the step is about, outlined 2 px `#1485c4` with a 4 px cut. |
| Zoom inset | `shot.zoom`, the region at its capture scale, in the corner `shot.anchor` names (`tl`, `tr`, `bl` or `br`), **2.75% of the frame's width from its side and 4.4% of its height from its top or bottom** (24 px each at 1440), so the offset scales with the frame and an inset clears its ring at 1280 as at 1440 (the checker holds the four offsets). **The zoom image is 46% of the frame wide (401 px at 1440)**, or narrower where its own aspect would take it past half the frame's height, with a 2 px blue outline outside it and an 8 px cut. The anchor is the corner whose inset leaves the region clear: an inset never hides its own ring. |
| Switching | A click on a row, or ←/→/↑/↓, Home and End: one step open at a time, its frame and inset crossfading in over 200 ms with no dip (instant under reduced motion). Step 1 is open on load. |
| 768–1099 px | One column: the frame at the wrap's width, then the same list under it. |
| Below 768 px | No frame. Four static cards, each the number and the title (20 px), the text (16 px), then **the zoom alone** at the column's width (about 343 px at 375), because the zoom is the part of the screen that reads at that width. |

**The legibility rule.** The inset shows its region at the scale s = inset width ÷ region width in CSS px of the capture, and **s ≥ 0.92**, so the UI text in the inset reads at about its real size. At the 401 px inset that bounds a region at **436 × 296 CSS px** of the capture (401 ÷ 0.92, and 272 ÷ 0.92 for half the frame's height): an element bigger than that gives its most telling part (two KPI tiles, not five; the flagged row, not the table). The zoom file is 802 px wide, the inset's width at DPR 2. The capture recipe is `ASSETS.md` §1.

**A frame is a real screen, never a crop or a skeleton** (Alex: *"they should not look like skeletons and should not be overloaded with details"*): the whole screen of the product's walkthrough, or of its HTML mock where it has none, on synthetic data, with the ring and the inset carrying the step.

**A description sits between the control that selects it and the thing it explains** (round 10b, START-HERE §4): the open step's text sits under its own title, beside its frame, at body weight.

**The feature-coverage invariant is retired** with the tick-lists: no surface prints `steps[].features`, so nothing keeps them in step with `overview.features`. Both lists stay in the data for the Jumpstart tab.

The checker holds 3–5 steps numbered from 1, the title and text budgets, `shot.full` = `assets/img/steps/<slug>-<n>.jpg` and `shot.zoom` = `assets/img/steps/<slug>-<n>-zoom.jpg` (a missing file is a warning), a region of four numbers inside the frame, one of the four anchors and a non-empty `alt`, and fails the retired `image` by name. The legibility rule is checked at capture, not by the checker.

### 2.3 Industry use cases — **moved to the Use cases tab** (round 10)

The block is unchanged; only its home is. Its anatomy, its data contract and its
rules are **§2a.1**. Nothing on the Overview renders `overview.industryCases[]` any
more.

### 2.4 What changes in your numbers — the KPI band

`overview.metrics[]`, **two or three tiles** (two on every product today), under `sectionLabels.outcomes`, *What changes in your numbers*, an H2 at 48 px.

Round 20 (Alex: the ROI block *"too wordy, and too boring"*; show the metric *"from X"* or *"the potential improvement range"*; *"not add footnotes and explanations of how you built metrics"*). The tile:

```js
{ key, title, kind: "proven" | "forecast" | "estimated", owner,
  figure: { prefix?, text },
  visual: { form: "compression" | "range" | "dumbbell" | "baseline", unit, direction: "up" | "down",
            scale: { min, max }, before: { value, label }, after?: { value, label }, range?: { lo, hi, label } },
  line }
```

| Part | Rule |
|---|---|
| Band | `.kpi-band`, full-bleed on softserveinc.com's KPI ground, `linear-gradient(to top, #edf1f6, #fafaf8)`, with 64 px of padding (40 on a phone); the tiles keep the wrap. One column per tile, 48 px apart; each tile after the first stands behind a 1 px `#d1dae2` rule with 48 px of padding. The tiles share row tracks (subgrid), so every figure and every chart sits on one line across the band, whatever a title wraps to. From 768 to 1099 px: two columns, a third tile full width under a top rule. Below 768 px: one column, 1 px rules between the tiles. |
| Dash | 32 × 4 px in orange 75, `#fe8d6b`, over every tile: the fact marker (`SS26-THEME.md` §3). |
| Title row | `title` at 16 px Replica 400 (at most 40 characters), and at its right the **kind chip**: 12 px uppercase in ink on a 1 px `#bdcbd7` ring with a 4 px cut. Its word is `shared.metricKinds[kind].chip`, the case study's own three words (*Proven* · *Forecast* · *Estimated*), and its `tooltip` is the chip's title. |
| Figure | `figure.prefix` (at most 6 characters, 20 px Light `#4c5156`: *from*), then `figure.text` at **56 px Replica Light**, 44 on a phone, never Azurio. At most 14 characters with three tiles and 20 with two. A long figure shrinks to its tile; a short one never does. |
| Chart | one 40 px SVG drawn from the tile's own numbers, `aria-hidden`, in one of four forms (below). |
| Labels | 14 px, real text in the DOM, each after a 10 px swatch in the shape of the mark it names (a bar, a tick, a dot), so no pairing rests on colour alone. **The chart carries nothing its labels do not print.** |
| Line | `line`, 16 px Light `#26292b`, at most 14 words (two lines): what the figure counts, in the buyer's words. |
| Owner | *Owner ·* (`sectionLabels.metricOwner`) and `owner`, 14 px `#4c5156`: the buyer-side role who tracks the number, at most 40 characters. |

**One chart convention for all four forms** (round 20, after QA found three dumbbells labelled in the reverse order of their dots): **a value axis, low on the left**, so a metric that improves by falling improves leftward, and **every label sits under, or aligned to, the mark it names**, never in a fixed left or right slot. Each form is drawn on a 40 px canvas with its track at y 17:

| Form | For | Drawn |
|---|---|---|
| `compression` | a before → after whose after is a fraction of the before (days → minutes) | two 10 px bars from the axis' origin: before in `#bdcbd7` at full width, after in `#1485c4` at its share of before and at least 8 px long. The labels (`before.label`, `after.label`) start at the bars' origin, 24 px apart, so *after* sits by the short blue bar |
| `range` | a modeled band (*+4 to +10%*) | a 6 px `#d1dae2` track for the scale, a 10 px `#1485c4` band from `range.lo` to `range.hi`, a 2 × 20 px ink tick at today (`before.value`). **A range that improves downward is mirrored** (x = (max − v) ÷ (max − min)): today's tick at the right end and the band to its left. Each label is set under its own mark, *today* (`sectionLabels.metricToday`) under the tick and `range.label` under the band, centred on it unless that would run past an end |
| `dumbbell` | a modeled before → after rate (*3.0 → 2.4%*) | the track, a 4 px `#459fdd` connector, a 14 px `#bdcbd7` dot at before and a `#1485c4` dot at after, both on the value axis, so a falling rate's after dot sits left of its before. **The labels print in the order of their dots** |
| `baseline` | a sourced *from X* with no promised end | the track filled `#bdcbd7` up to X, a tick at X, and a 10 px blue chevron beside it pointing the way the number improves (`direction`). **The scale runs past X** (1.5 × X where X had been the scale's end), so the fill stops short and the chevron has room; the checker fails a baseline drawn as a full bar. One label, `before.label`; a screen reader also hears *improves toward* (`sectionLabels.metricToward`), the scale's end and the `unit` |

**A figure is never a bare unit word** (QA, round 20: *Hours* or *Minutes* is neither a *from X* nor a range). A Proven compression prints its measured after (*5–15 min*, *~30 min*); an Estimated one prints its baseline, `prefix` *from* and the before in words (*from weeks*, *from a quarter*), and its chart shows where it goes; a range prints its band, a dumbbell its before → after, and a baseline its *from X*.

**The honesty lives in the framing, never in a note** (Alex: metrics *"should not lie but should [not] apologize and disclaim their value"*; *"No justification for reviewer notes pls"*). A figure is a measured before → after, a range or a *from X* baseline, and its chip says which kind: **Proven** is measured end to end in a completed proof of value on the customer's own data; **Forecast** is modeled on the customer's own history; **Estimated** is set against published industry rates or the way the work is done today. **No footnote, no method note, no ROI paragraph and no pointer to another tab.** Where each figure comes from is recorded in `PROVENANCE.md` §41.4, never on the page: the checker fails a `sources` key in `content.js`, which ships in view-source. No status colour decorates a metric; blue is the one coloured mark in a chart.

**A metric is a business metric** (START-HERE §4): the money, time, volume, risk or quality a named buyer-side owner already tracks and the product moves directly. Never an accept rate, a coverage figure, a calibration, a delivery duration or a feature. Two tiles on one band never share a claim shape.

**The band may carry its product's case-study figure.** Large docs prints *5–15 min* on its Proven tile and in its case study: the case study is on the Use cases tab (§2a.2), so each tab states the number once. The rail's rule that a tile never repeats a case figure left with the rail.

The checker holds two or three tiles; a unique `key`; the title, owner, line, figure and prefix budgets; one of the three kinds and the four forms; a unit, a direction and a numeric scale; every value on its scale and every mark with a printed label; `after` only on the compression and dumbbell forms and `range` only on the range form. It fails the retired rail-tile keys (`value`, `label`, `qualifier`, `icon`) and `sources` by name.

### 2.5 At a glance — **removed** (round 3, H)

`overview.sideFacts` and the card it fed are gone. Every row on it — category, platform, availability, proof-of-value duration and price — was a denormalised copy of something printed on the same page: the chips in the hero, the Jumpstart investment card, the stack. It was therefore a second place to keep in sync, and the first to go stale; `check-grammar.js` fails if the key returns. The rail is §2.4 alone, which is also what keeps it shorter than MAIN without pinning anything.

### 2.6 Case study — **moved to the Use cases tab** (round 10)

The callout, its contract and its seven pieces are **§2a.2**, where round 10 also gave
it a wide two-column variant for the full content width. §2.6a below stays here: it is
about the *other two* surfaces that render the same engagements.

### 2.6a The same engagements on the other two surfaces

The home page renders **one compact card per case study** — a 16:9 photo band carrying the descriptor and the area, then the status chip, one headline metric, one line and the link to the product; **the status word is in the chip and nowhere else**, as on the callout — from the same objects the product pages read, so the two cannot drift apart. **Since round 11 the card carries no medallion**: the band's photograph is the industry's own file, `assets/img/industries/<industry>.jpg`, derived from the card's `industry` — the picture the Use cases tab shows — so the photograph names the industry, and the medallion stays on the product page's callout (§2a.2). The card's headline metric **is** the callout's first figure: the checker fails a card whose `metric.value` differs from its product's `caseStudy.metrics[0].value`, and fails two cards whose figures open on the same word (§9 S5). Since round 5 the four cards sit in a **2×2 grid beside the method rail** (§9, S5) rather than in a full-width three-up row: two columns from 720 px, one below it, `grid-auto-rows: 1fr` so no card is shorter than its neighbour, and the rail to their left carries the intro, the NDA line and the one link out. **The method is not in the rail** — it was until §18.8, and it now ships only on Services, where the rail's link points.

**Nothing else repeats that grid.** The Services page once carried the measurement method beside it rather than the same four cards (a repeat had made the evidence feel padded rather than deep); that page left the site in round 18, and the cards are the evidence's one home.

### 2.7 More detail — **removed** (round 20)

Alex: *"More detail block - on Overview page - to be removed."* The disclosure is gone, and `moreDetail`, `featuresDetail` and `featuresNote` with it (the checker fails each by name); `scope` and `features` stay in the data, unrendered, for the Jumpstart tab next round.

---

## 2a. Use cases tab — where it applies, and whether it has worked (round 10)

`#/products/<slug>/use-cases`, the **second** tab, between Overview and Technology.
Two blocks, in this order and nothing else:

| Order | Component | Source |
|---|---|---|
| 1 | **The industry tabs** (§2a.1) | `overview.industryCases[]` + `overview.industriesNote` |
| 2 | **The case study** (§2a.2) | `overview.caseStudy` — `null` on five of the nine |

- **One column at the full content width, and no rail** (`tab-body`): 1,248 px at
  1440, the Overview's width too since round 20.
- **One grey step and one dark plate** (round 20, Alex: *"all blocks are too
  greyish"*): the industry plate's copy half is the tab's one `#edf0f2` surface and the
  case study its one `#1a1a1a` plate (`SS26-THEME.md` §3, §5). Round 20 moved only the
  look; the copy and the data are unchanged.
- **Where `caseStudy` is `null` the tab is the industries block alone** — no empty
  state, no placeholder, no line saying a case study is coming. The same rule as
  everywhere else on the site (rule 1, and `SCHEMA.md` rule 2).
- **The tab opens on the row of industry tabs, with no block title over it** (round 13,
  Alex, 2026-09-23). The tab bar above already says *Use cases*, and a row of industry
  tabs names its own cut, so round 10's *By industry* heading was a third label for one
  block. `sectionLabels.industryCases` (*By industry*) survives only as the tablist's
  accessible name. The checker fails that label if it contains *use case*, and fails
  `industryCases()` if it prints a heading again.
- Both blocks moved off the Overview in round 10 because they answer a different
  question from it and were pushing How it works out of the first screen (§2).
- **Every rule of this tab's CSS is `.ind-*` or inside `.case-callout`**, in one
  marked block (`===== Round 20 · Use cases =====`), so the home page's case cards
  keep their own look; the checker holds it.

### 2a.1 The industry tabs

`overview.industryCases[]` — **3–6 cases**, `{ industry, label, image, problem, solution }`. No heading (round 13); `sectionLabels.industryCases` is the tablist's `aria-label`.

| Part | Rule |
|---|---|
| Tabs | One row of **text tabs** over one 1 px `#d1dae2` hairline: each the industry's 16 px line icon (§5) and its label in 16 px Replica 400, `#4c5156`, ink on hover. **The selected tab is ink on a 2 px `#1485c4` underline**; no tab carries a fill or a frame (the checker fails both). A row too long for its width scrolls sideways, as the tab bar above it does, so an underline never sits on a wrapped line; it fades at its end only while it overflows (`is-scrolling`, measured without the fade's own padding). |
| Panel | **One split plate**, softserveinc.com's *Client Voice*: an 8 px cut, the grid 55 / 45. **The copy half first**, on `#edf0f2`, padding 40 (32 at ≤ 900 px, 24 at ≤ 540): *The problem* and *The solution*, each a 20 px Replica 400 heading (`sectionLabels.caseProblem` / `caseSolution`, never an eyebrow) over 2–3 sentences of 18 px Light text. **Then the photograph**, `assets/img/industries/<key>.jpg`, edge to edge (`object-fit: cover`, at least 360 px tall), filling its half at whatever height the copy takes and never setting it. The plate does not print the industry's name: the selected tab says it one line above. |
| Height | **One height on every tab.** The panels share one grid cell; an unselected panel keeps its `hidden` attribute but also its box (`visibility: hidden`, which keeps it out of the tab order and the accessibility tree), so the plate is as tall as its tallest industry and the case study below never moves when the reader changes tab (QA, round 20; the checker holds it). |
| Below 901 px | The plate is one column, the photograph on top at 16:9. |
| Note | `industriesNote`, 14 px `#4c5156`, under the plate. The copy and the note wrap to avoid a lone last word (`text-wrap: pretty`). |

- The images are keyed by **industry, not product**, so one file serves every product that uses that tab.
- First tab open by default. Tabs are a proper `role="tablist"` with roving `tabindex`: ←/→, Home and End move and select, Enter/Space activate, and each panel is `aria-labelledby` its tab and hidden with the `hidden` attribute. The plate's focus ring is drawn inside it, because its cut clips anything outside.
- The two Lakehouse products lead with the `cross-industry` tab, because "the same two pains in every industry, regardless of stack" is their honest answer; the vertical tabs beside it are illustrations of it, not a claim of vertical focus.
- The failure mode to watch: a `problem`/`solution` pair that would read identically under any other tab. If it would, it is not an industry case.

This block **is** the product page's industry telling. The old `overview.industries[]` chip row is gone from the data: every key it held was already a tab here. `industriesNote` survives and renders as the line closing this block — one telling per vertical, per product.

### 2a.2 The case study — the tab's one dark plate

`overview.caseStudy`, under the industry tabs. **`null` on five of the nine products, and then nothing renders** — there is no empty state. A case renders only where the engagement has actually started: an engagement still pre-contract gets no card, because the softest true reading of a status chip is still a claim a customer's own account team can contradict in the room.

**No customer is named and no logo is rendered.** A logo is the one element of a case study that cannot be anonymized, so the round-4 callout is built around what can: the industry.

**The block is the `#1a1a1a` plate with a 12 px cut** (round 20; a grey callout before it), padding 48, in white type. Its children sit in **two containers** — `.case-main`, the narrative, and `.case-side`, the evidence:

| Width | Layout |
|---|---|
| ≥ 901 px | `.case-body` is two equal columns; `.case-side` stands behind a 1 px **left rule** in white at 20%, 48 px from each side. Inside it the figures and the scope facts are each **one column**: the column is too narrow for two 64 px figures side by side. |
| ≤ 900 px | One column — main, then side — and the rule becomes a **top rule**; padding 32 (24 at ≤ 540). On a phone the story is therefore read before the figures. |

**Narrative left, evidence right**, and the chip stays **directly above the figures it qualifies** — that pairing is why the chip moved into the side column rather than staying above the whole body.

`.case-main`, in order:

1. **The `Case study` eyebrow** (`#bdcbd7`), then the **industry medallion** — the `industry-<key>` line icon in a 48 px square with a 4 px cut, drawn as a white 1 px ring, where the logo used to sit. There is **no header photograph**: the industry tabs directly above render the same `assets/img/industries/<key>.jpg`, so a band here showed the same picture twice within one viewport at two crops and read as a template filling itself in. Beside the medallion, the `descriptor` as the title, 28 px Replica 400 in white (24 at ≤ 540), wrapped greedily so *home-appliance* never splits at its hyphen (*"A global home-appliance manufacturer"*), and the `area` on a second line at 16 px `#bdcbd7` (*"Field-service operations across three countries"*).
2. **The story**, 16 px Light in white at 85% — two to three sentences: what was done, on what data, with which stack. The last sentence carries the caveat that qualifies the figures; the panel has no footnote row, so that is how rule 2 of this file is satisfied here. **The caveat is written in the chip's plain words** — *measured*, *forecast from simulations against the customer's own historical baseline*, *an estimate set against <what it is compared with>* — and never as a negation (*not results*, *no results yet*): the chip has said it, positively, in the column beside it (§18.9). The modeled case is the one where the wording is constrained rather than free: `PROVENANCE.md` §4 makes the simulations-and-historical-baseline pair load-bearing.
3. **The NDA line**, 14 px `#bdcbd7` — *"Customer under NDA · reference call available on request"* on a measured or modeled case; on one in preparation it says results follow at the end of the proof of value instead, because offering a reference call about an engagement with no results yet is a promise nobody can keep.
4. **`downloadLabel`** as the one link out, a white arrow link, rendered **only** when `SITE_CONFIG.products[slug].successStoryUrl` is non-empty. No URL, no control.

`.case-side`, in order:

5. **Status chip**, a white 1 px ring with its dot (full on Proven, half on Forecast, hollow on Estimated) — **`Proven`**, **`Forecast`** or **`Estimated`**, one plain word, read from `shared.caseStudyStatus` by the `status` key (its tooltip carries the long form). It is the element that tells a reader, at a glance, what the numbers below are, and **it is the only place on the card the status word appears** (§18.9). It used to read *"Measured in the proof of value"* / *"Modeled in the proof of value"* / *"Proof of value in preparation"*, with the same word repeated in an eyebrow over the figure — the status said twice, in a sentence about the sales stage, which made a result read as a disclaimer. **The chip and the caveat sentence in the story must still agree** — a card that says *Proven* at the top and *forecast from simulations* four lines down retracts its own headline, and it is the first thing a sceptical customer pulls on.
6. **One or two big metrics, with no eyebrow over them** — the chip above has already said what they are. **Each figure sits under its own orange-75 dash** (32 × 4 px, `#fe8d6b`) and is set in **Replica Light, white, 64 px at 1440** (it scales down to 40, and 36 at ≤ 360 px), **never Azurio** (round 20; the checker holds both), with its label under it at 16 px Light, white at 85%. Two figures stack, 32 px apart. Two is the default, and a third would make the panel a metric row in its own right, competing with the Overview's KPI band (§2.4); **one** is correct where only one real outcome exists. A case with no published figure sets a **qualitative outcome statement** — a turnaround claim like *Same day* or a coverage claim like *Every variance* — never an invented number, and never a restatement of the mechanic: *"One signal"* and *"Evidence-backed"* were the product's own description set at 40px in a numbers slot, which is what a slot filled because it was there looks like.
7. **The scope row** — exactly three compact facts (`scope[]`) in one column under a white 20% rule, label above value (the label 12 px uppercase `#bdcbd7`, the value 16 px white): duration, data footprint, constraint count, the human gate. Each must be a fact the rest of the card does not already carry — a slot spent restating the `area` line is a slot wasted. External-safe only: no contract value, no contract duration, no headcount, no € figure.

## 3. Technology tab — exactly two blocks

**Architecture** (§3.1 narrative + §3.3 the layer stack) and **Capabilities** (§3.2). Nothing else. The How-it-runs flow diagram and the Security-and-deployment list were both removed in round 3: the stack read top to bottom *is* the flow, drawn once and with the components attached, and the security lines were four restatements of facts the layer summaries, the scope lists and the Jumpstart `low-risk` pillar already carry.

### 3.1 Narrative

`technology.narrative` — **three sentences maximum**, enforced. One paragraph at the head of the Architecture block.

### 3.2 Capabilities — the complete feature list, by workflow stage

`technology.capabilities` — **exactly four stage groups**, `[{ stage, items: [{ name, state? }] }]`. Heading from `sectionLabels.capabilities`.

- The four `stage` names are the product's own four workflow stages — the same sequence the §2.2 stepper walks a reader through, in the product's vocabulary (`Classification & routing` · `Extraction` · `Review & export` · `Quality & integrations`). Four on every product, so two Technology tabs compare column for column.
- Each stage is a column on desktop (a row group on mobile) holding its `items` as a list. ≥ 3 items per stage; together the four groups cover every capability the product claims anywhere on the site.
- `state` renders as a small tag — **Supported** or **Roadmap**, labels from `sectionLabels.stateSupported` / `stateRoadmap`. It is **absent** unless a shipped capability matrix states it; today only `workforce-optimization` carries tags. An untagged item renders with no tag at all, never with a default one: a guessed tag is a claim.

### 3.3 Solution stack — one accordion, organised by layer

`technology.stack[]` — `{ key, label, summary, vendors, items }`. Heading from `sectionLabels.stack`.

**This one block replaces three.** The vendor-marked component columns, the four-tier solution-stack table and the integration list were three views of the same architecture, printed one under another; a technical buyer comparing two products had to reconcile them himself. They are now one thing, read top to bottom the way an architect draws it.

| Order | `key` | What sits there | Mark |
|---|---|---|---|
| 1 | `application` | The SoftServe accelerator / business app | SoftServe |
| 2 | `ai-engine` | NVIDIA AI-Q · cuOpt · NeMo · NIM-served models | NVIDIA |
| 3 | `data-platform` | Oracle Autonomous AI Lakehouse · Oracle AI Data Platform · Oracle data services · the source application where it is the system of record | Oracle |
| 4 | `infrastructure` | OCI compute, GPUs, networking, storage, tenancy | Oracle |
| 5 | `custom` | Integrations, connectors, signal sources, tenancy specifics — everything set per engagement | SoftServe |

- **A layer may be omitted, never re-ordered.** The two Lakehouse products carry no `ai-engine`: NVIDIA is not required on that route, and an empty engine row would be a worse answer than its absence. `application`, `data-platform`, `infrastructure` and `custom` are present on all seven.
- **Row, collapsed:** layer name · one-line `summary` · vendor mark(s) from `vendors` · chevron. The marks are normalised to **one cap-height and one opacity** across the five rows (`.group-mark--oracle` / `--nvidia` / `--softserve` set only the height each mark's own box needs to land on that cap-height). The layer order is what ranks the rows; whichever wordmark happens to set widest must not. **Row, expanded:** the `items`, each tagged **Required** or **Optional** from its boolean `required`, with `note` rendered as a **second chip beside that tag** (dashed, quieter — e.g. "After the Jumpstart"), never as a caption hanging under the row and never in package-ladder words: a product page's own next step is the Jumpstart's *Integration* card, so "Roll-out scope" names nothing a reader of that page has seen. Every layer carries at least one Required item — a layer where nothing is required is not a layer of this stack.
- **Integrations live in the `custom` layer** — labelled *Custom configuration & integrations*, the fifth band — as items carrying `direction: "inbound" | "outbound" | "both"`. Render them as two labelled lines — **Inbound** and **Outbound**, from `sectionLabels.directionInbound` / `directionOutbound` — inside the expanded layer, or as annotations down the side of the stack. `direction` is illegal anywhere but `custom`.
- **No "not used" footnote.** The layer summaries carry which platform each layer actually uses, which is the condition for dropping the line; a muted micro-line below the accordion, present on some products and absent on others, read as an orphan rather than as honesty. `technology.notUsed[]` is deleted from the data and `check-grammar.js` fails if it reappears.
- `technology.governance?` — the two Lakehouse products. One band, same shape as the ROI band, below the accordion.

`technology.groups[]`, `technology.layers[]`, `technology.integration[]` and `technology.notUsed[]` are the superseded shapes. They are **deleted** from `content.js`; `check-grammar.js` fails if one reappears, because a key nothing renders drifts out of sync in silence.

**The accordion opens on its first layer** (`application`) so the pattern is visible without a click; each row toggles independently, `aria-expanded` follows the visible state, and the panel is hidden with the `hidden` attribute rather than a class.

### 3.4 Security and deployment — **removed** (round 3, B)

`technology.security[]` is deleted from the data. Each product's four lines restated facts that are already on the page: the tenancy and read-only access are in the `infrastructure` and `custom` layer summaries, the human gate is in the solution panel and the `low-risk` pillar, the audit trail is a capability, and "production hardening is roll-out scope" is in `overview.scope.out` and in `jumpstart.next`. `check-grammar.js` fails if the key returns.

### 3.5 The architecture figure

`media[slug]` still supplies the figure, but it is no longer a mirrored 50/50 media row of its own: it sits **inside** the Architecture block, beside the narrative, above the stack (`.arch-head--media`). Two blocks means two blocks — a third full-width row between them would put a picture where the stack has to be. A product with no `media` entry renders the narrative full width and the stack beneath it, with no empty frame.

---

## 4. Jumpstart tab

Tab label **Jumpstart**; block title **Jumpstart Proof-of-Value** (`jumpstart.title`). Route `#/products/<slug>/jumpstart`, with `…/pov` redirecting to it. The tab sells one thing — *fast · low-risk · tangible* — and every product renders the same six pieces in the same order.

| Order | Component | Source |
|---|---|---|
| 1 | **Promise line** | `jumpstart.promise`. One sentence, set as the block's lead. |
| 2 | **Three pillars** | `jumpstart.pillars[]` — exactly three equal cards in one row, each an icon, a `title` and one short paragraph, in the fixed order `fast` → `low-risk` → `tangible`. Peers in a row are equal height. They stack on mobile. |
| 3 | **Two columns** | LEFT: `jumpstart.outcomes[]` — 3–4 outcome lines with check icons, under `sectionLabels.jumpstartOutcomes` ("What you get"). RIGHT: `jumpstart.timeline[]` — 3–4 nodes as a compact week-by-week rail, under `sectionLabels.jumpstartTimeline` ("How it runs"). Equal height on desktop; the outcomes come first on mobile. |
| 4 | **Needs beside the investment card** | LEFT: `jumpstart.needs[]` — exactly three short asks, under `sectionLabels.jumpstartNeeds`. RIGHT: the **investment card** — `price` and `duration` set large, `includes[]` beneath, and `footnote` as the single footnote line inside the same block as the figures. Where **neither** figure is published, the card prints `sectionLabels.jumpstartScoped` as one line instead, and no footnote: two tiles both reading the same placeholder are an unfilled template, and a footnote qualifying figures that are not there qualifies nothing. |
| 5 | **After the Jumpstart** | `jumpstart.next[]` — exactly two compact cards, `Integration` then `Scale`, one line each plus `duration` / `price` where they exist. Heading from `sectionLabels.jumpstartNext`. This replaced the three-tier ladder. |
| 6 | **One CTA**, then the standing blocks | `jumpstart.cta` → that product's contacts tab, then `shared.credibilityBlock` and `shared.engageLink`. |

**One footnote, not a stack.** The price card carries exactly one line. The packaging-internal disclaimers ("Framed scope, flexible add-ons", "…set by specific constraints", "…beyond the frame") are removed site-wide and banned by `check-grammar.js`: they describe how a quote is built, not what a customer gets, and four of them under one small table read as a hedge.

**No product-specific extra sections.** `facts`, `deliverables`, `pricing`, `disclaimers[]`, `ladder`, `capabilityMatrix`, `statNotes`, `howItRuns` and `prerequisites` are all gone from the product data — the facts they held live in `promise`, `pillars`, `outcomes`, `timeline`, `needs`, `investment` and `next`, or (for the per-capability detail) in `technology.capabilities`. A seller flipping between two product tabs gets the same page shape every time.

---

## 5. The fixed industry icon set

Sixteen keys. **No product may invent a seventeenth.** A new industry is added here first, with its icon, before any product references it.

| Key | Display label |
|---|---|
| `manufacturing` | Manufacturing |
| `logistics` | Logistics & supply chain |
| `utilities` | Utilities |
| `telecom` | Telecom & cable |
| `healthcare` | Healthcare |
| `financial-services` | Financial services |
| `insurance` | Insurance |
| `retail` | Retail |
| `energy` | Energy |
| `public-sector` | Public sector |
| `automotive` | Automotive |
| `life-sciences` | Pharma & life sciences |
| `professional-services` | Professional services |
| `construction` | Construction |
| `travel-transport` | Travel & transport |
| `cross-industry` | Every industry |

`cross-industry` is reserved: it means "no vertical list exists because the constraint is the system landscape, not the sector", and it always ships with an `industriesNote` that says so.

### Who uses what today

`overview.industryCases[]` drives the industry tab component on the **Use cases** tab (§2a.1) and is the only industry surface on a product page; the old `overview.industries[]` chip row is deleted. The first column below is kept only to show that the two lists agreed when the chips were removed.

| Product | former `industries[]` (chips, deleted) | `industryCases[]` (tabs) |
|---|---|---|
| `account-insights` | logistics · financial-services · manufacturing | logistics · financial-services · manufacturing |
| `case-evidence-collection` | financial-services · manufacturing · professional-services · public-sector | financial-services · manufacturing · professional-services · public-sector |
| `plan-vs-actual-investigation` | construction · manufacturing · professional-services | construction · manufacturing · professional-services |
| `large-document-extraction` | travel-transport · professional-services · insurance · financial-services | travel-transport · professional-services · insurance · financial-services |
| `workforce-optimization` | manufacturing · utilities · telecom · healthcare | manufacturing · utilities · telecom · healthcare |
| `cross-system-erp-qa` | cross-industry | cross-industry · manufacturing · logistics |
| `business-metrics-qa` | cross-industry | cross-industry · retail · manufacturing |

The two Lakehouse products are the one place the two columns differ, and deliberately. `cross-industry` stays their only chip because the honest claim is that the constraint is the system landscape, not the sector; the vertical tabs beside it illustrate that claim on concrete estates named in the source material, and each of them leads with the `cross-industry` tab so the framing is read first.

Three keys — `energy`, `automotive`, `life-sciences` — are declared and currently unused. They exist because the source decks name adjacent verticals; do not delete them to tidy up.

### Industry imagery

Each key used by any `industryCases[]` entry needs one treated photograph at `assets/img/industries/<key>.jpg`. The file is keyed by industry, **not** by product, so one image serves every product whose tabs include it. Thirteen are in use today: `logistics`, `financial-services`, `manufacturing`, `professional-services`, `public-sector`, `construction`, `travel-transport`, `insurance`, `utilities`, `telecom`, `healthcare`, `retail`, `cross-industry`.

---

## 6. The icon registry — what to add to `assets/app.js`

All 24×24, stroke-only, matching the existing `ICONS` entries (the `.icon` class supplies stroke, width and colour). Paste these into the `ICONS` object.

The footer's eight social glyphs are the one exception and are not in this registry: they are SoftServe's own filled marks, copied from softserveinc.com's footer into `SOCIAL_GLYPHS` beside `renderFooter`, each with its own viewBox (round 14). The line-drawn `globe`, `facebook` and `youtube` left `ICONS` with the old footer; `linkedin` stays for the contact card.

### Semantic icons

```js
alert: '<path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path><path d="M12 8.5v5M12 16.6v.4"></path>',
spark: '<path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.3l-1.8-5.7L4.5 10.8 10.2 9z"></path><path d="m18.6 16.4.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z"></path>',
roi: '<path d="M4 18.5 9.5 13l3.5 3.2L20 8.5"></path><path d="M15.5 8.5H20v4.3"></path><path d="M3 21h18"></path>',
clock: '<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7v5.3l3.4 2"></path>',
gauge: '<path d="M3.5 17a8.5 8.5 0 1 1 17 0"></path><path d="m12 17 4-5.5"></path><circle cx="12" cy="17" r="1"></circle>',
users: '<circle cx="9" cy="8.5" r="3.2"></circle><path d="M3 19.5a6 6 0 0 1 12 0"></path><path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19.5a5.8 5.8 0 0 0-2.2-4.3"></path>',
shield: '<path d="M12 3 4.5 6v6c0 4.2 3 7.6 7.5 9 4.5-1.4 7.5-4.8 7.5-9V6z"></path>',
trendUp: '<path d="M4 17 9.5 11.5l3.5 3.3L20 7.5"></path><path d="M15 7.5h5v5"></path>',
trendDown: '<path d="M4 7.5 9.5 13l3.5-3.3L20 17"></path><path d="M15 17h5v-5"></path>',
calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"></rect><path d="M3.5 10h17M8 3v4M16 3v4"></path>',
link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4L11 6.6"></path><path d="M14 10a4.5 4.5 0 0 0-6.4 0L5 12.6a4.5 4.5 0 0 0 6.4 6.4L13 17.4"></path>',
network: '<circle cx="12" cy="5" r="2.5"></circle><circle cx="5" cy="18" r="2.5"></circle><circle cx="19" cy="18" r="2.5"></circle><path d="M10.3 7.1 6.4 15.7M13.7 7.1l3.9 8.6M7.5 18h9"></path>',
inbound: '<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M4 20h16"></path>',
outbound: '<path d="M12 21V9"></path><path d="m7 14 5-5 5 5"></path><path d="M4 4h16"></path>',
trigger: '<path d="M20 12a8 8 0 1 1-2.4-5.7"></path><path d="M20.5 4v4.2h-4.2"></path>',
eye: '<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="2.8"></circle>',
audit: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M9 8h6M9 12h6M9 16h3"></path>',
```

### Industry icons

```js
"industry-manufacturing": '<path d="M3.5 20V11l5 3V11l5 3V7l5.5 4v9Z"></path><path d="M2.5 20h19"></path>',
"industry-logistics": '<rect x="2.5" y="7" width="10.5" height="9" rx="1.5"></rect><path d="M13 10h4l4 3.5V16h-8z"></path><circle cx="7" cy="18.3" r="1.7"></circle><circle cx="17" cy="18.3" r="1.7"></circle>',
"industry-utilities": '<path d="M13.2 2.5 5.5 13.2h5.6L10 21.5l7.8-11h-5.6z"></path>',
"industry-telecom": '<path d="M12 10.5v10"></path><circle cx="12" cy="8" r="2"></circle><path d="M7.5 3.5a7 7 0 0 0 0 9M16.5 3.5a7 7 0 0 1 0 9"></path>',
"industry-healthcare": '<rect x="3" y="3" width="18" height="18" rx="4.5"></rect><path d="M12 8v8M8 12h8"></path>',
"industry-financial-services": '<path d="M3 10h18M4 10 12 4l8 6M6.5 10v7M10 10v7M14 10v7M17.5 10v7M3 20.5h18"></path>',
"industry-insurance": '<path d="M12 3 4.5 6v6c0 4.2 3 7.6 7.5 9 4.5-1.4 7.5-4.8 7.5-9V6z"></path><path d="m9 12 2 2 4-4"></path>',
"industry-retail": '<path d="M5 8h14l-1 12H6z"></path><path d="M9 8V6a3 3 0 0 1 6 0v2"></path>',
"industry-energy": '<path d="M9 3v5M15 3v5"></path><path d="M6 8h12v3a6 6 0 0 1-12 0z"></path><path d="M12 17v4"></path>',
"industry-public-sector": '<path d="M6 21V3.5"></path><path d="M6 4h11l-2 3.6L17 11H6"></path>',
"industry-automotive": '<path d="M5 15.2 6.4 10A2 2 0 0 1 8.3 8.5h7.4A2 2 0 0 1 17.6 10L19 15.2"></path><rect x="3" y="15" width="18" height="4" rx="1.5"></rect><path d="M7 19v1.5M17 19v1.5"></path>',
"industry-life-sciences": '<path d="M10 3v6L4.6 18a2 2 0 0 0 1.8 3h11.2a2 2 0 0 0 1.8-3L14 9V3"></path><path d="M9 3h6M7.3 14h9.4"></path>',
"industry-professional-services": '<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M9 7V5.2A2.2 2.2 0 0 1 11.2 3h1.6A2.2 2.2 0 0 1 15 5.2V7M3 12.5h18"></path>',
"industry-construction": '<path d="M4 16a8 8 0 0 1 16 0"></path><path d="M9.5 16V8.5a2.5 2.5 0 0 1 5 0V16"></path><rect x="2.5" y="16" width="19" height="3.5" rx="1.5"></rect>',
"industry-travel-transport": '<path d="M21 3 3 10.5l7 2.8L12.8 21z"></path><path d="m10 13.3 11-10.3"></path>',
"industry-cross-industry": '<circle cx="12" cy="12" r="8.5"></circle><path d="M3.5 12h17M12 3.5c2.4 2.5 3.6 5.4 3.6 8.5S14.4 18 12 20.5C9.6 18 8.4 15.1 8.4 12S9.6 6 12 3.5Z"></path>',
```

Industry keys in `content.js` are bare (`"manufacturing"`); the renderer prefixes `industry-` when it calls `UI.icon()`. That keeps the data readable and the registry namespaced.

### The tag-family and stack icons

`shared.tagFamilies` names twelve registry keys, and the hero stack's top band
names four more. All of them are in `ICONS`, drawn to the same 24×24 stroke-only
spec (1.5 px, no fill):

| Key | Used by | What it reads as |
|---|---|---|
| `pattern-knowledge-analytics` | group chip, `knowledge-analytics` | A speech bubble with a small bar chart inside |
| `pattern-deep-research` | group chip, `deep-research` | A magnifier over a small node graph |
| `pattern-documents` | group chip, `documents` | A page with a folded corner and two text lines |
| `pattern-transactions` | group chip, `transactions` | Three linked steps, a check on the last |
| `pattern-forecasting-optimization` | group chip, `forecasting-optimization` | A rising line through a node, on an axis |
| `pattern-video-image` | group chip, `video-image` | A frame with a title bar and a play mark |
| `platform-oci-nvidia` | technology chip, `oci-nvidia` | A cloud above a pinned chip |
| `platform-oracle-ai-data-platform` | technology chip, `oracle-ai-data-platform` | A data cylinder with a check |
| `platform-oracle-ai-lakehouse` | technology chip, `oracle-ai-lakehouse` | Stacked layers |
| `platform-oracle-ai-fusion` | technology chip, `oracle-ai-fusion` | A 2×2 grid of application tiles |
| `cursor-click` | the Interactive demo badge | A pointer with two short click strokes at its tip |
| `storefront` | the Oracle Marketplace badge | A shop front with a scalloped awning |
| `spark` · `network` | the stack's *Jumpstart proof of value* and *Integration* tiles | already in the registry |
| `scale` | the stack's *Scaling* tile | Three bars of rising height on a baseline — the same instance, repeated |
| `managed` | the stack's *Managed services* tile | A refresh loop closing on a check |

**Round 9 retired four `pattern-*` keys with the categories that named them** —
`pattern-processing-pipelines`, `pattern-data-analysis`, and the
`pattern-optimization` / `pattern-knowledge-assistants` pair drawn for the
five-group cut that the six-group correction superseded. The checker fails if any
of the four is still in `ICONS`: **an icon no data can name is an unchecked icon**,
and it will drift out of the theme unnoticed. `play` stays in the registry, now for
video surfaces only.

Unlike the industry keys, these are written into the data **in full**:
`tagFamilies.pattern.icons["deep-research"]` holds `"pattern-deep-research"`, not
`"deep-research"`, because a renderer that had to know which prefix to add for
which family would be inventing the key.

---

## 7. The completeness rule, stated as a test

Every product object must satisfy all of the following. `tools/check-grammar.js` asserts it; run it after any edit to `content.js`.

| Slot | Requirement |
|---|---|
| `hero.image` | `{ file, alt, focal }`, all non-empty |
| `overview.problemSolution.problem` / `.solution` | `{ headline ≤ 60 chars, text ≤ 30 words }`; `title` and `icon` are retired and fail by name (round 20) |
| `overview.metrics` | 2–3 tiles (§2.4, round 20); each `{ key, title ≤ 40, kind: proven | forecast | estimated, owner, figure { prefix?, text }, visual { form, direction, scale, before, after? , range? }, line ≤ 14 words }`; `figure.text` ≤ 14 chars on a three-tile band, ≤ 20 on two; a baseline scale runs past today's value; **no `sources`** (provenance lives in `PROVENANCE.md` §41) |
| `overview.metricsNote`, `overview.roi` | **absent** — retired in round 20 (Alex: no footnotes, no method notes); the checker fails either if it returns |
| `overview.features` | 6–8 strings, each ≤ 12 words; kept in the data, not rendered since round 20 |
| `overview.steps` | 3–5 `{ n, title ≤ 26 chars, text ≤ 30 words, shot { full, zoom, region, anchor, alt }, features }`; `n === index + 1`; `shot.full` is `assets/img/steps/<slug>-<n>.jpg` and `shot.zoom` `…-<n>-zoom.jpg`, both present; `region` four percentages inside the frame; `anchor` ∈ `tl` `tr` `bl` `br`; `image` is retired and fails by name |
| `overview.industryCases` | 3–6 `{ industry, label, image, problem, solution }`; `industry` in the set of 16 and unique; `label` matches `shared.industryLabels[industry]`; `image` is `assets/img/industries/<key>.<ext>`; `problem` and `solution` are 2–3 sentences each |
| `overview.sideFacts` | **absent** — the At-a-glance card was removed; the checker fails if it returns |
| `overview.featuresDetail`, `overview.featuresNote`, `overview.moreDetail` | **absent** — the More detail block was removed in round 20; the checker fails each if it returns |
| `overview.industries` | **absent** — superseded by `industryCases` |
| `overview.industriesNote` | non-empty string |
| `overview.scope.in` / `.out` | ≥ 4 items each; kept in the data, not rendered since round 20 (it moves to the Jumpstart tab) |
| `overview.caseStudy` | present — `null`, or `{ descriptor, area, industry, status, metrics ×1–2, scope ×3, story, ndaLine, downloadLabel }` with a caveat clause inside `story`; no `customer`, no `logo`, no `image`, and **no `metricsEyebrow`** — retired in §18.9, the status word is the chip's alone, and the key is a build failure if it returns |
| `products[].statusNote` | present only on `case-evidence-collection` and `plan-vs-actual-investigation`, one sentence; no product carries `availability`, `availabilityChip`, `availabilityTooltip`, or an availability string in `tags` |
| `technology.narrative` | ≤ 3 sentences |
| `technology.capabilities` | exactly 4 `{ stage, items }`; stages unique; ≥ 3 items each; `state`, where present, is `supported` or `roadmap` |
| `technology.stack` | 4–5 layers, keys a subsequence of `application` → `ai-engine` → `data-platform` → `infrastructure` → `custom`; `application`, `data-platform`, `infrastructure` and `custom` all present; `summary` one sentence; `vendors` non-empty from `oracle` / `nvidia` / `softserve`; every layer ≥ 1 item and ≥ 1 with `required: true`; `direction` only on `custom`, and that layer names at least one inbound and one outbound |
| `technology.groups` / `.layers` / `.integration` / `.notUsed` / `.flow` / `.security` | **absent** — all folded into `stack` and `capabilities` and deleted; the checker fails if one returns |
| `pov` | **absent** — superseded by `jumpstart` |
| `jumpstart.title` | exactly `Jumpstart Proof-of-Value` |
| `jumpstart.promise` | non-empty string |
| `jumpstart.pillars` | exactly 3, keys `fast` → `low-risk` → `tangible`, each `{ title, text }` |
| `jumpstart.outcomes` | 3–4 outcome lines |
| `jumpstart.timeline` | 3–4 `{ label, text }` |
| `jumpstart.needs` | exactly 3 |
| `jumpstart.investment` | `{ price, duration, includes ≥ 3, footnote }`; `price` and `duration` are each a non-empty string **or** `null`; `footnote` is one line (≤ 2 sentences) |
| `jumpstart.next` | exactly 2, `Integration` then `Scale`, each with `text` and a `price` (`Scoped per engagement` where none is published) |
| `jumpstart.cta` | `{ label, route }`, routed at `#/products/<slug>/contacts` |

Site-level, asserted once rather than per product:

| Slot | Requirement |
|---|---|
| `shared.contact` | `{ name, title, email, photo, blurb }`; `title` is a string and **may be empty**; `email` is exactly `oracle@softserveinc.com`; `blurb` is one sentence; `photo` is `assets/img/people/<name>.<ext>`, may be empty (initials fallback) and **ships filled**; `linkedin`, if present, is a public `linkedin.com` URL. **`bring` and `bringTitle` are absent** — the *Bring to the call* list was retired in round 10 and either key fails the build |
| `shared.productTabs` | ids exactly `overview`, `use-cases`, `technology`, `jumpstart`, `contacts`, **in that order**, each with a `label`; `jumpstart.legacyIds` includes `pov` and `contacts.legacyIds` includes `demo` and `sellers`; no tab carries the singular `legacyId`, `locked`, or the retired `sellers` / `demo` / `pov` id |
| `products[].oneLiner` | carries no packaging phrase — "packaged from proof of value", "from proof of value to enterprise scale", "fixed price", "quick start" all fail the build |
| `site.primaryCta.label` | equals `site.navCta.label` — one contact ask site-wide; `forms.demo.submitLabel`, `salesKit.tab.nextDemoLink` and `salesKit.page.povLink` all equal it too, and the raw text of `content.js` matches no `/request a demo/i` |
| `shared.demoCta` | equals `shared.tagFamilies.availability.demo.label` — the walkthrough button names what the badge names |
| `forms.demo` | `sub` names both *workshop* and *proof of value*; **`secondarySub` absent** (retired in round 10, the Contacts tab reads `sub`) and **`secondaryHeading` absent** (retired in round 18, when Home S7 took the Contacts switch) |
| `shared.sectionLabels.industryCases` | contains no *use case* — the Use cases tab already says it |

A slot that cannot be filled with a fact is filled with a **qualitative** instance — a `null`-valued metric tile, a `cross-industry` chip, a `Scoped per engagement` price. It is never left out, and it never renders an apology.

A **missing image file is a warning, not a failure.** Copy and imagery ship on separate tracks; the checker names each file that is not on disk yet so nothing is forgotten, and still exits 0.

---

## 8. Contacts tab and the contact card

`shared.contact` → `{ name, title, email, photo, blurb, linkedin? }`, and on a product page
also `shared.people[product.contactPerson]` → `{ name, title, photo, linkedin? }` (round 13).

The tab formerly labelled **Request a demo** is now **Contacts**, at `#/products/<slug>/contacts`, and it is the **last** tab. Two retired segments redirect to it in place — `…/demo`, and since round 10 `…/sellers` (`legacyIds: ["demo", "sellers"]`) — and every contact control on a product page points at this tab rather than at a form anchor. The header button and the home-page CTAs open the home page's own contact at `#/#request-a-demo`, which since round 18 is this same switch (below).

**One component on both surfaces, and it brings its own ground** (round 20, Alex: *"all blocks are too greyish"*). `UI.contactSwitch` (round 18) wraps `UI.contactSplit` in a **full-bleed `#edf0f2` band holding one white plate**, as softserveinc.com sets its contact form: the band with 48 px of padding (32 on a screen 880 px tall or less, 40 at ≤ 900 px wide, 24 at ≤ 540), the plate with a 12 px cut and 40 × 48 px of padding (32 × 48 on a short screen; 32, then 24 × 20). It renders a product's Contacts tab and the home page's last screen alike, so neither page paints a ground of its own. Every rule is scoped to the component, in one marked block (`===== Round 20 · Contacts =====`), so `#/sellers` keeps its own form; the checker holds it.

**Inside the plate, one row of two columns** (`.contact-split`: the card at 384 px, so the home page's H2 sets on two lines at 48 px, then the switch and its open pane, 48 px apart, the fields at softserveinc.com's 788 px at 1512). The two **start level and each end where its own content ends**. **From 1100 px down the plate stacks**, card over form, the form under a hairline, and the people sit side by side while two fit: at 1024 a 352 px card left the form 336 px and clipped the product select.

**The whole ask fits one screen** (Alex, 2026-09-29: the form *"with the button doesn't fit a single screen"*). From the band's top edge to the plate's bottom, submit included, the component fits under the masthead on a 1512 × 850 screen, and on a product page under the sticky tab bar too. Measured at 1512 × 850: the plate ends at 634 px on the home page and at 783 px on a product page; at 1440 × 900 a product page's plate ends at 866 px; at 1280 × 800 the home page fits and a product page's submit reaches 803 px. What buys it: 48/40 px paddings, 32 on a screen 880 px tall or less (`@media (min-width: 1101px) and (max-height: 880px)`); the message box at four lines, under three on a short screen, where round 20 had it at 160 px; the field rows 16 px apart; and on the home page the H2 inside the plate rather than above the band.

1. **LEFT — the card.** It has no surface of its own: the plate is the surface. The people are **rows** (`ul.contact-people`, one `li.contact-person` each): an **80 px round portrait standing on the plate** (64 px at ≤ 540) — round 20 first set it on a 96 px square brand-fill tile, blue 75 then orange 75, after softserveinc.com's team shots, and it read as *"a weird blue frame"* (Alex, 2026-09-29): softserveinc.com's portraits are cut out onto their ground, ours are office photographs, and the checker fails a `.contact-tile` coming back — beside the `name` (20 px Replica 400) and the `title` (16 px Light `#4c5156`). A person's `linkedin`, when one exists, renders in their own row. Under the rows, once for everyone, come the `email` as a **mailto link** — blue 125 `#0e5e8b` (7:1 on white, where `#1485c4` is 4.05:1) with the mail glyph, 18 px, over a thin underline, both turning Lviv blue `#1485c4` on hover: the kit pane's own link style (`.inline-link`), so the plate carries one link style; **never a filled button** (§9, the address rule) — and the one-line `blurb` at 16 px Light. The monogram is the portrait's own ground, so a missing photograph leaves initials, not a broken frame. `title` renders only when non-empty; an empty one leaves the name alone, never a placeholder. **On a product page the card takes no heading**: the tab is already called Contacts, and the switch opposite is the row's heading; on the home page the section's own eyebrow and H2 open the column (below). **The card is not stretched to the form's height**: a card is not a container to fill.
   **Round 13 (Alex, 2026-09-23): on a product page the card names two people**: the partnership contact (`shared.contact`), then the product's own lead (`shared.people`, picked by `contactPerson`). Rows rather than two stacked portrait blocks, so the pair reads as one team and the one address under them is plainly shared rather than the second person's: the people are several, the mailbox is one. Home S7 passes no `people`, so it names Karsten alone.
2. **RIGHT — a two-tab switch, and never two open forms** (round 10b, Alex: *"Get the sales kit block should be visible without scroll down + having two active input forms on one screen is a bad practice. Maybe user can switch between talk to us and Get the sales kit (for sellers)."*). The column is `.contact-tabs`, carrying `id="talk"` and a `scroll-margin-top` of `--nav-h + 5rem`:
   - **The switch** keeps the segmented control's markup (`.segmented.contact-segmented`, a `role="tablist"` of two `.segment` tabs) and is styled as **two text tabs** over one hairline: 16 px Replica 400 in sentence case, `#4c5156`, **the selected one ink on a 2 px `#1485c4` underline**; no fill, no frame and no cut (the checker fails each). Two tabs: **Talk to us**, open by default, reading `site.primaryCta.label`, and **Get the sales kit**, reading `salesKit.tab.title`. Each is a `role="tab"` with `aria-selected` and `aria-controls`; each pane a `role="tabpanel"` whose inactive state is the `hidden` attribute; ←/→, Home and End move between the two (`UI.mountContactSwitch`).
   - **The fields**, in both panes: labels 14 px Replica 400 in ink, sentence case; inputs and selects **white**, with a 1 px `#bdcbd7` border, 48 px tall with 12 px of padding, no radius, blue on focus; the field rows 16 px apart; the message box 104 px tall, about four lines (80 px on a screen 880 px tall or less), growing by its handle; the five roles on one line down to a 730 px column. The submit is the filled blue button, the plate's one filled control.
   - **The Talk pane** is `forms.demo.sub` then the demo form, its submit reading `site.primaryCta.label`, so the hero, the header and this form are one ask (§1). **The kit pane** (`id="kit"`, §11) is the *For sellers* eyebrow, `salesKit.tab.body` with the product name, and the kit form fixed to the product, at the ask form's width. **Neither pane carries a heading** — the selected tab is it.
   - **Both forms are mounted at render**, open or hidden, and the switch is bound after them, so switching never lands on an unbound field.
   - **The anchor picks the tab**, in `mount`, before the router scrolls: `#kit` opens the kit pane and everything else — `#talk` included — the ask.
   - **Home S7 renders the same component** (round 18, Alex: the home form *"equivalent (texts, CTAs, etc., flow) to what we have on per-product page (though logical difference to be preserved)"*). What differs is data only: the card names Karsten alone and the ask's product select starts on *Not sure yet*. **It carries no sales kit** (Alex, 2026-09-29: the *Get the sales kit* tab *"should not appear on the main page"*): passed no kit, the component renders **the Talk pane alone — no segmented control, no tab roles, no kit pane** — and the pane, now the column's first child, drops its top margin so it starts level with the card. With no segment to head it, the form column opens on `forms.demo.sub`, and a third *talk* is not added. **The section's eyebrow and H2 open the card's column, inside the plate** (2026-09-29): `closing()` hands them to the component as `intro`, and `contactSplit` sets them above the card, as softserveinc.com sets *Let's talk* inside its plate. Set above the band on white, the H2 read as a caption to the screen and the form as *"unattached from the heading"* (Alex). `#/#talk` opens the ask; a saved `#/#kit` lands on `#/sellers`. The checker fails `closing()` or `contactsTab()` if either renders a form of its own, `overview.js` if it hands the component a kit, and `closing()` if it renders its heading outside the component.

**The band is the page's last grey** (round 20). The footer opens on a 152 px `#edf0f2` spacer, and a grey band directly above it would merge with it into one grey mass. So the section that hosts the band gives up its paddings — on a product tab the band meets the tab bar, and on the home page the band is the whole screen, with no hairline above it — the band runs straight into the black footer, and **the footer's spacer is not drawn after a page that ends on the band** (`#app:has(> :last-child .contact-band) + .site-footer::before { display: none }`). The band's own 48 px is the breathing room the spacer gave. It holds on a product's Contacts tab and on the home page, and the checker fails the rule's absence.

**The *Bring to the call* list is retired** (round 10) from the data, the renderer and the CSS, on all three surfaces that render the card. It said the same thing three times over — the form's own message placeholder and the Jumpstart tab's *What we need from you* already ask for the workflow, the systems and the timeline. The card is a person, an address and one line, and `blurb` carries the ask.

**The left column is the card, and nothing else.** `forms.engagementSteps` — the three-step "what happens next" block this file used to place under the panel — is **gone from `content.js` and read by no renderer**; the copy that answered *"what happens if I write?"* now lives in `forms.demo.sub` beside the form.

No stray empty panel anywhere: the one row is the whole section. The **same switch** renders Home S7, from the same objects, with Karsten alone. Each person is stored once, and there is one address and one place to edit it.

**The address is the practice mailbox, never a personal one.** `oracle@softserveinc.com` is what ships. The checker bans the string `ktram@` and, since round 13, any `@softserveinc.com` address other than the practice one. A personal mailbox on a public page is a scraping target and an availability risk, and the person named here is a partnerships role rather than an inbox.

---

## 9. The home page — nine screens

This file is about the product pages; the home page differs from them **by composition, not by tokens**. One section each, content-sized (no `100vh`, no `min-height`), roughly 80–90 vh at 1440×900, with a hairline rule between consecutive screens and the shared `.home-head` (eyebrow · H2 · optional lead · optional right-aligned link) at the top of each, except S7, whose head sits inside its plate (§8).

| # | Screen | Component, in one line |
|---|---|---|
| S1 | **Hero** — `overview.hero` | Full-bleed, two **even** columns (`minmax(0, 6fr)` twice since round 9, up from 7/5, because at 5 columns' width the stack's tiles could not hold a group name): eyebrow, the **three-sentence H1**, a ≤ 45-word lead and two buttons on the left; the **three-layer stack** on the right (anatomy below). Single column below 1100 px, the stack under the copy and left-aligned. The **three-tile** `stat-band` sits directly under it (see *The proof strip* below). |
| S2 | **Two ways in** — `overview.twoWays` | **Two photographic panels** (round 11, Alex: the half-width form of softserveinc.com's *Agents4Everything* band): each a free-standing, 12 px-cut photograph with its copy on it in white — a mark, the title, the body, three ticked bullets and one down-arrow link pinned to the bottom, so the two CTAs land on one baseline — under a scrim that carries the legibility. The left panel repeats the H1's *Enterprise AI agents and workflows*; the right one is *Expert services, from proof to scale*. Anatomy below. |
| S3 | **Products** — `overview.catalog` + `facets.categories` | The `home-head` (eyebrow · H2 · the right-aligned *See all products*; *"…, with filters"* until round 13; no lead since round 16), then **six group tiles** in a 3 × 2 grid — `.gtiles` / `.gtile`, anatomy below: since round 17 each a flat brand fill carrying its group's line drawing, the reference being softserveinc.com's Our Offers tiles. No product names on this screen at all (Alex, round 9). |
| S4 | **Packaged services** — `overview.delivery` | The eyebrow is *Packaged services* since round 18 (Alex), the header's *Services* lands here, and the screen **ends on its track**: the button that followed it opened the Services page, which is gone (the services' ask closes S4b), and the Why list moved to S4c, so the Bespoke band's top shows under the track. Stacked, full width (round 16, `.deliver--stacked`). **Five stages** on one hairline track (`.ladder3--five`: five across above 1024 px, vertical from 1024 down), each carrying one labelled fact, a floor, and no caveat row. Then *Why SoftServe on Oracle* as **a hairline list** (`.pillars--list`: rows between 1 px rules, the icon · the title in Replica 28/400 · the body at `--fs-body` 300; no fill, no cut; title and body stack from 1024 down). Since round 17 the icon is the brand's feature icon, as softserveinc.com's icons grid draws it: a bold black outline at 64 px (48 below 540) with a 3 px stroke and sharp joins, on no well, where round 16 had a 48 px blue-tint well holding a 24 px UI glyph. The list (now S4c) replaced three inset cards in a right-hand column (Alex: *"below the timeline block … not so boring/grayish"*); its form is softserveinc.com's "Our Expertise" list. |
| S4b | **Bespoke services** — `overview.bespoke` | **Round 18** (Alex: *"one more block called Bespoke Services … on the image dark background to make page not so monotonous; use softserveinc.com Confidence earned block as a reference"*). A **full-bleed dark photograph** (`.home-bespoke`, the section itself: `min-height: clamp(34rem, 44vw, 40rem)`, a flex column with the copy at the top and the points at the foot) — the eyebrow *Bespoke services*, the H2 *Your AI factory on Oracle.*, a two-sentence lead and one filled button, *Talk to us*, the services' one ask, on the photograph's dark left half (`max-width: 36rem`), then **four points in one row** (`.bespoke-points`: title in Replica 400 at 18 px, one line in 80 % white, 1 px rules over each; 2 × 2 at ≤ 1100 px). A `<picture>` switches the wide crop (`bands/bespoke-wide.jpg`, `object-position: 72% 50%`) at 769 px up; a scrim heaviest at the left and the foot carries the copy. **On a phone the band stacks**: the copy on black, the tall crop as its own square row (`bands/bespoke-tall.jpg`, dark at its top, so there is no seam), then the points as hairline rows on black — no body is read over picture detail. Only the points reveal: never the band, because a transform on an ancestor would pin the covering picture to it mid-animation, and never the copy, which is the band's head and has to show at once when the band peeks under S4. The band's top padding is a step under the other screens' (48–64 px). |
| S4c | **Why SoftServe on Oracle** — `overview.delivery.why` | Round 17's hairline list, unchanged — the brand's feature icons at 64 px, titles in Replica 28/400, bodies at `--fs-body` 300, rows between 1 px rules — on a screen of its own since round 18, after both ways to buy, where each reason reads for either. Its label opens the screen, so it is the screen's `h2`, set as the accent eyebrow. |
| S5 | **Case studies** — `overview.caseStudiesIntro` + `overview.caseStudies` | A sticky left rail — **head (eyebrow · H2 · one-sentence lead) → NDA line → one link out**, and nothing else — beside a **2×2 grid** of the four case cards, all four the same height, each **a photo band over a white body** (round 11, Alex: *"image with heading + white background for content"*; anatomy below). Round 9 rewrote all four strings as reader copy: the title states the result (*Results on customers' own data*), the lead says what a card is, the NDA line carries the constraint and the offer together, and the link asks for a reference call rather than pointing at the method. The measurement method is **not** in the rail; it lived on the Services page, which left the site in round 18. |
| S6 | **About SoftServe** — `overview.about` | A full-bleed black band, one of the page's two dark screens: copy and the external link at left, a 2×2 grid of stat tiles at right. **No partner marks since round 18** (Alex removed the Oracle and NVIDIA logos); the checker fails a mark in `about()`. |
| S7 | **Contact** — `overview.contact` | Since round 18 **the product Contacts tab's own switch** (`UI.contactSwitch`, §8). Its eyebrow *Contact* and H2 *Start with one conversation.* open the plate's left column (since 2026-09-29; there is no `home-head` above the band), with no lead, because the Talk pane opens with its own. The section is a `home-screen` with no padding and no top hairline: the grey band is the screen, and the whole ask fits it. |

The rules the screens share:

- **No photograph on the home hero; the page's photographs sit lower.** The three-layer stack is the hero's only illustration (§1). Below it, S2's two panels are photographs with their copy on them under a scrim, S4b is a full-bleed photograph with its copy on the dark half, S5's cards open on a photo band that carries only the descriptor and the area under a veil, and S3's tiles are flat fills whose line drawings sit above their copy (§1.1).
- **One accent per screen.** The orange `#f46a4a` lands once — the H1's middle line is the page's one accent line; the eyebrow and the first ladder dot take the blue `#1485c4`, which means *act on this* or *selected*.
- **Equal-height peers everywhere** (rule 4): the tiles inside a stack band, the two panels, the six group tiles, the five stages, the four case cards, the three stat tiles. (The three Why rows are a list, not peers side by side, since round 16.) `grid-auto-rows: 1fr` or a stretched grid, never independently sized cards. **The three stack bands are the exception since round 9** — their heights are `auto`, because the middle band carries six tiles in two rows and forcing `1fr` on all three would pad the outer two with air.
- **Absence is an empty container, never a sentence.** A group with no product today still gets its tile, and the tile lands on that group's own `emptyState` in the catalog.
- **The Bespoke band shows under Packaged services** (Alex, round 18: *"slightly but sufficiently visible"* when he scrolls there). Three things hold it: nothing stands between the track and the band; a `#/#…` anchor on a home screen lands with the screen's top edge under the sticky header, not 96 px down (`assets/app.js`, which also looks the target up afresh on every call, because one hash navigation renders the page twice and a stale element landed the page a header short); and at desktop widths with ≤ 800 px of height every home screen's padding drops to 40 px, its head's margin to 24 px, the band's top padding to 32 px. Measured after the header's *Services*: 344 px of the band at 1920 × 950, 254 at 1512 × 860, 198 at 1440 × 820, 251 at 1536 × 740, 122 at 1366 × 650 (eyebrow and heading), 51 at 1280 × 620 (the eyebrow).
- **Two dark screens, never adjacent** (round 18): S4b's photograph and S6's black band, with S5's white screen between them — the one inversion the theme allowed became two on Alex's ask for a darker, less monotonous Bespoke band (`docs/SS26-THEME.md` §5). S2's panels and S5's card bands are photographs inside cut containers, not bands, and do not count.
- **Motion is three things:** the stack's connector lines draw in over ~1.2 s on load, sections reveal on scroll through the existing `.reveal` mechanism, and free-standing cards and panels answer hover: the case cards with a surface step and a 1.071 image scale, the group tiles with a 1.04 drawing scale and a 2 px arrow nudge (round 17), S2's photographic panels with the 1.071 scale and a 2 px arrow nudge (hover and focus-within alike). No lift and no shadow anywhere — SS26 (`docs/SS26-THEME.md` §6). Everything collapses to instant under `prefers-reduced-motion`, with the drawn state as the resting state.
- **Accessibility:** one H1, an H2 on every screen, the stack visual `role="img"` with its `aria-label` from `hero.stack.ariaLabel` and its internals `aria-hidden`, every icon decorative, and each group tile one link whose accessible name is the group name and its line.

**S1's H1 is three sentences, each opening its own line, and one of them accented.**
`headline.lead` · `headline.accent` · `headline.proof`, each `display: block`, all
three at the same size, with only the accent line coloured. The first sentence
wraps, so the block reads as more lines than sentences: **measured at 375 it sets
32 px over four lines, and at 320 over five** (*Enterprise / AI agents / and
workflows. / Built on Oracle. / Proven in weeks.*) — every sentence still starting
its own line, and no orphaned word on any of them.

**S1's stack — the anatomy** (`.bo`, max-width 42 rem, `grid-template-rows: auto`
throughout):

| Part | What it is |
|---|---|
| Bands | `.bo-band`, a 12 px cut and a 1 px `--border-subtle` hairline. The two SoftServe bands sit on `--bg-raised` (`#edf0f2`), the Oracle band on `--bg-inset` (`#e1e7eb`) — `.bo-band--oracle`. Top to bottom: `--services` (4 tiles), `--products` (6), `--oracle` (4). |
| Owner row | `.bo-owner`: `.bo-owner-label` on the left — Replica 500 at `--fs-xs`, uppercase, `.06em`, `--text-dim` — and the mark on the right: the SoftServe wordmark through `brandAsset("ssMark")` on the two upper bands, the Oracle wordmark on the bottom one. |
| Tiles | `.bo-tile`, one anatomy in all three bands because the layers are peers: white ground, an 8 px cut, a 1 px `--border-panel` border, `.75rem / .625rem` padding, a flex column. `.bo-tiles` is `grid-auto-rows: 1fr; align-content: stretch`, so a band's tiles fill it with no dead space. |
| Icon well | `.bo-tile-mark`, 1.75 rem square on `--surface-select` with the theme's default 4 px cut — **the one decorative tint SS26 allows** — carrying a 1.125 rem glyph in `--text-body`. |
| Name | `.bo-tile-name`, 13 px / 500 / 1.25, `margin-top: auto` so every name sits at its tile's foot and the rows align across a band however long a name wraps. `overflow-wrap: anywhere` and **no `hyphens: auto`** — automatic hyphenation cut *image* to *im-age* at this size (round 9 QA). |
| Connectors | `.bo-links`, two 1.25 rem SVG strips between the bands, three lines each at 20 / 50 / 80 % — evenly spaced, deliberately **not** mapped per tile, since the bands hold 4, 6 and 4. They draw in on reveal, bottom-up (platforms, then products, then services), which is the one thing a static diagram cannot say: the foundation comes first. |
| Breakpoints | `.bo-tiles--4` is four across and `--6` is three across (6 = 3 × 2). At ≤ 560 px both go two across, so the middle band reads 2 × 3, and the outer two connector lines are hidden because they would point at nothing. |

**S2's photographic panels — the anatomy** (`.ways--photo` / `.way--photo`, round 11).
The reference is softserveinc.com's *Agents4Everything* band, measured at 1440: a
1248 × 400 dark photograph with no scrim, 10 px chamfers, a white 28 px / 400 heading
with an inline arrow, a 20 px body in white at 80 %, the copy top-left. These two
panels are its half-width form, with one deliberate difference — a scrim — because
their photographs are not dark all the way under the copy.

| Part | What it is |
|---|---|
| Grid | `.ways--photo`: two columns with `gap: var(--gap)`, **free-standing peers** — no shared hairline, no ground, no cut of its own. One column below 900 px. The modifiers are the whole change: the base `.ways` / `.way` (two joined panels) has had no other user since the Services page left in round 18. |
| Panel | `.way--photo`: a static container with its own **12 px cut**, `position: relative; isolation: isolate; overflow: hidden`, `min-height: 28rem`, padding `clamp(2.5rem, 4.4vw, 4rem)` on top and `clamp(1.75rem, 2.8vw, 2.5rem)` on the other three sides, a flex column with the link pinned to the foot. Its ground is `#000`, which is what remains if the image guard drops the photograph. Measured at 1440: **612 × 496 px each**. |
| Photograph | `<img class="way-img" alt="">` at inset 0, `object-fit: cover`, `z-index: -1`, its `object-position` from the panel's `image.focal`: **`35% 45%`** on the products panel (`heroes/overview.jpg`) — the focal that keeps the picture's bright oval an arc at the right edge and out from under the body copy at every two-column width, lowest body contrast 4.88:1 — and `50% 50%` on the practice panel (`heroes/services.jpg`). Decorative: the copy says what the panel offers, and `image.alt` describes the picture for the docs. |
| Scrim | `.way-scrim` over the photograph, also `z-index: -1`: `linear-gradient(100deg, rgba(0,0,0,.66) 0%, rgba(0,0,0,.46) 52%, rgba(0,0,0,.22) 100%)`, heaviest on the copy side. Below 900 px a flat `rgba(0,0,0,.56)`, with `min-height: 22rem` and `1.75rem` padding. |
| Copy | All white. `.way-mark` on `rgba(255,255,255,.14)` with a white glyph; the title in **Replica 400 at 1.75 rem / 1.2** — the reference's 28 px, a heading on a photograph rather than an H4-class card title; the body at `--fs-body` / 1.25 in 82 % white, `max-width: 28rem`, `text-wrap: pretty`; the bullets in 90 % white with white ticks; the link white, `--surface-select` on hover and focus-within; a white `:focus-visible` outline. |
| Hover / focus | Inside `@media (hover: hover)`, hover **and** focus-within scale the photograph 1.071 and nudge the arrow 2 px; the ground stays black. `prefers-reduced-motion` drops both transforms. Print drops the photograph and the scrim and turns the copy ink. |

**S3's group tiles — the anatomy** (`.gtiles` / `.gtile`):

| Part | What it is |
|---|---|
| Grid | `.gtiles`: `repeat(3, minmax(0, 1fr))` with `grid-auto-rows: 1fr` and `gap: var(--gap)` — 3 × 2 above 1100 px, two across from 721 to 1100, one column at 720 and below, where the rest of the home page goes to one column (round 17: at 1024 three across left 261 px tiles with three-line names; PROVENANCE §45: below 720 a half row holds the longest first line of a name only at 20 px, at 640, and 16 px, at 561). |
| The tile | `.gtile` is itself the link (`<a href="#/products?cat=<id>">`) — one action per tile, and the tile *is* the action, so nothing else inside it may be clickable. Since round 17 it is **a flat brand fill** (Alex: *"colored / styled like Our offers tiles"*): `.gtile--<tone>` sets `--tile-fill` from `facets.categories[].tone` — blue 75 `#459fdd` · orange 75 `#fe8d6b` · blue 50 `#c1dff4` · neutral 400 `#bdcbd7` · blue 75 · orange 75, the one order in which no two touching tiles share a fill in any of the three grids. No border, hairline, shadow or photograph; an 8 px cut; `overflow: hidden`; one ink, `--tile-ink: #1a1a1a`, for every word and line on it (SS26-THEME §3). |
| Drawing box | `.gtile-draw`, the full tile width at `aspect-ratio: 400 / 220`, in flow above the body, so no word can sit on a line. It holds `.gtile-art`, the `<img alt="">` of `facets.categories[].image` (`assets/img/groups/<id>.svg`), at inset 0 with `transform-origin: 0 0`. Each drawing is one 1.75 px non-scaling line that runs off the tile's top or left edge and gathers into one filled spark at the group's moment of value; nothing passes x 376 or y 200, so the right and bottom edges are air (`ASSETS.md` §2b). The image guard watches `.gtile-art`. |
| Body | `.gtile-body`, padding 16 / 32 / 32 px (16 / 24 / 24 below 1280): the group's `full` name in Replica **400** at 28 px / 1.1 (a 24 px ceiling below 1280), a step under the reference's 32 because the tile also carries the one-liner; its `line` at 16 px / 1.45 in the tile's ink, visible at rest (touch has no hover, and a rep reads it on a call); and `.gtile-foot`, pinned with `margin-top: auto`, carrying the 20 px arrow alone — no label, because the tile is the ask. |
| Name, two lines | **Every name sets on exactly two lines, broken before its last word** — the kind of work on the first line, the noun on the second: *Enterprise knowledge & / analytics*, *Deep research & / investigation*, *Document / processing*, *Transaction & process / execution*, *Forecasting & / optimization*, *Video & image / intelligence*. `groupTiles()` puts a `<br>` before the last word; the name in the data is unchanged. So the names, the one-liners and the arrows start level in every row at every width. PROVENANCE §45 (Alex, after round 19, on a wide screen where two tiles had two-line names and four had one: *"some headings now are 2 lines, some 1 line, so content looks not so clean; fix line breaks (not allowed to do tile renaming)"*); left to the viewport, the count differed in some row at every width from 320 to 1920. The first line must never wrap, so the size fits the tile: `.gtile-body` is an inline-size container and the name is `clamp(20px, (100cqi − 12px) / 10.6, 28px)` (24 px ceiling below 1280), the largest size at which the longest first line, *Enterprise knowledge &* (10.43 em plus 11 px of letter-spacing), holds one line. It is 28 px from 1366 up and 24 px in most narrower tiles, and its lowest is 21.4 px, three across at 1101. The checker holds a first line to 22 characters; a longer one needs the divisor re-measured. |
| Hover / focus | Inside `@media (hover: hover)`, hover and focus scale the drawing 1.04 from its top-left corner and nudge the arrow 2 px. The fill, the name and the line do not change (a name turning `--action` would vanish on blue 75). No lift, no shadow. `:focus-visible` draws a 2 px `--tile-ink` outline inset 6 px, because the clip cuts an outline drawn outside the box; `prefers-reduced-motion` drops both transforms. |

**S5's case cards — the anatomy** (`UI.caseCard`, round 11). Alex asked for *"image
with heading + white background for content"*; the treatment follows the three
Solutions cards under softserveinc.com's reference band (photo on top, the heading on a
light body) — the whitepaper and case-study cards he pointed at were not measured.

| Part | What it is |
|---|---|
| Grid | The 2×2 `.cases-grid` beside the rail, `grid-auto-rows: 1fr`, one column below 720 px. Measured at 1440: **384.8 × 623.3 px, all four equal**. |
| The card | `article.case-card`: a flex column, `padding: 0`, white, a 1 px `--border-subtle` border, `overflow: hidden`, `height: 100%`. |
| Band | `.case-card-band`, **16:9**, its ground `#1a1a1a` (`--surface-dark-raised`) so the white type still reads if the image guard drops the photograph. It holds `.case-card-img` — **`assets/img/industries/<industry>.jpg`, derived from the card's `industry`**, the file the Use cases tab shows; the card carries no image key and the checker fails one — then `.case-card-veil`, a bottom-up `linear-gradient(to top, rgba(0,0,0,.74) 0%, rgba(0,0,0,.30) 55%, rgba(0,0,0,0) 100%)`. |
| On the band | `.case-card-title`, pinned to the band's foot: the `descriptor` as an H3 in **Replica 400, 1.25 rem / 1.2, white**, and the `area` in 82 % white. **Nothing else sits on the photograph** — and there is no medallion: the photograph names the industry. |
| Body | `.case-card-body`, white, a flex column with `gap: .875rem`: the status chip · the figure (`.case-figure-value` + `.case-figure-label`) · the `line` · the `footnote` · the link to the product, pinned to the foot so the four links land level per row. |
| Hover / focus | Hover and focus-within step the body to `--bg-raised` and turn the arrow `--action`; inside `@media (hover: hover)` the photograph scales 1.071. `prefers-reduced-motion` drops the scale and the transitions. Print drops the photograph and the veil and sets the descriptor and area in ink, in the flow above the body. |
| Figures | The card's `metric.value` **is** its product callout's `caseStudy.metrics[0].value` (checker), and **no two cards' figures may open on the same word** — peers side by side each make their own claim. Today: *+4.5%* · *5–15 min* · *Same day* · *Every variance*. |

**The proof strip is three tiles**, led since round 9 by the proof-of-value tile — *from* **30 days** — so the two "30"s in the row are not adjacent. **The optional `prefix`** renders as `.stat-prefix` inside `.stat-value`, before the figure: Replica 400 at `.45em` of the figure, `line-height: 1`, `--text-muted`, `.35em` to its right, so it sits on the figure's own baseline and the tile reads as one fact on one line rather than a figure with a caption over it. It renders as the shared `stat-band`, with two home-only modifiers — `stat-band--home` on the section and `stat-row--home` on the row — so the home strip can differ from the base row without touching it. Three rules carry the difference, and they are the geometry the strip depends on:

- **Three equal columns**, `repeat(3, minmax(0, 1fr))`, rather than the base row's four-column track: three tiles in a four-column row leave a column standing empty and the band ends where nothing is.
- **Symmetric cell padding** — the base `.stat` has `padding: 1.5rem 1.5rem 0`, and the home cell adds the matching bottom. The dividers between tiles are `border-left` on the cell, so with no bottom padding they stop under the last line of the tallest label instead of running the cell.
- **A band bottom padding that matches its top** (`clamp(2.5rem, 5vw, 4rem)`), so the next section's hairline reads as a divider and not as an underline beneath the labels.

Below 900 px the row goes two-up with the third tile spanning both columns — a cell is a column of the band, not a tile in a grid — and single-file at 480. (The Services page's strip, which shared this geometry, left with the page in round 18.)

**An address is a link, never a filled button.** An email address or a website URL renders as an anchor at body size with its glyph and a hairline rule under it — accent on hover and focus-visible on dark, the light band's own ink on light — and takes `padding-block` at ≤ 560 px so it clears the tap-target minimum. This is a **site-wide** rule, not a home-page one: `UI.contactCard` renders the address on both of its surfaces (the home contact screen and every product's Contacts tab), and the About band's `softserveinc.com` link follows it too. The reasoning is that a filled button is the site's one *ask* — it says *do this now* — and an address is a destination the reader may or may not want; dressing it as a primary button puts two competing asks on a screen that has exactly one (§18.8, item 1). The filled buttons on the home page stay where a reader is being asked for something: the hero's primary CTA, the Bespoke band's *Talk to us* and the contact form's submit.

## 10. The Services page — retired in round 18

Alex: *"Services link at the header - to not link to a separate page, but scroll down to the Packaged services block on the main page. Services page to be fully removed."* The page's story now lives on the home page — the five-stage track and the Why list as S4, *Packaged services*, and the AI factory as S4b, *Bespoke services* (§9). `pages/services.js`, its content and its CSS are deleted; `assets/app.js` `MOVED` rewrites a saved `#/services` link, with its `#how-we-engage`, `#proof-of-value` or `#contact` anchor, to the home screen that took over its section. The reasoning behind the page as it was is in `PROVENANCE.md` §21 and §23, and its removal in §38.

**Heading budgets** (measured, display type), as they applied there and still apply site-wide: H1 ≤ ~24 characters a line, two lines; H2 ≤ ~30 characters and five words, one line at 1440 and two at most on a phone; a band title ≤ ~28 characters. The sentence goes in the lead. Running text takes `text-wrap: pretty`, so no paragraph ends on one word.

## 11. For sellers — the sales-kit request (round 8)

One request, two placements, one component (`FORMS.renderKit` / `mountKit`); the reasoning is in `PROVENANCE.md` §24.

| Placement | Component | Rule |
|---|---|---|
| Product page, **the second tab of the Contacts switch** (round 10b; row 2 of that tab as round 10 first shipped it, and its own *For sellers* tab in rounds 8–9) | `.contact-pane` with `id="kit"`: eyebrow *For sellers* · the body naming the product · the kit form, filling the pane at the same width as the ask form in the other tab | The product is fixed, so there is no select. **The *For sellers* tab is retired** — its only content was this form, and a page that repeats one form under two names is a structure bug — and so is the second row: **two open forms on one screen are the same bug in another shape**, and the second one was below the fold. `#/products/<slug>/sellers` redirects in place to `…/contacts`. Nothing is locked, on the tab bar or here — the kit is requested. |
| `#/sellers` (the footer's link row, and a saved `#/#kit`; out of the header since 2026-09-17) | the same panel with an eyebrow, the title as the page's H1, and the *Kit for* select, **opening on *Choose a product*** (a disabled option that cannot be sent) over the products in `productOrder` · then a `panel--cta` — *See the fit in an account?* with a text link that opens the demo modal, nothing preselected | One screen, and the URL is the thing a seller pastes into a thread. **One product's kit per request** (Alex, 2026-09-29: *"no 'all kits' option in dropdown"*): no *All offers* option, and a submit with no product chosen puts *Choose the product you're selling.* under the select and focuses it. |

**The form, in order:** *Kit for* (`#/sellers` only) · *Work email* · consent · **Send me the kit** — the one filled button, after consent as on every other form here — then the eligibility line (small print) and the customer/partner route: **on a product page *Talk to us*, pointing at `…/contacts#talk`** — the other tab of the same switch, reached by an in-page anchor because a same-route `ROUTER.go` would re-render the page and wipe whatever has been typed — and on `#/sellers` *Talk to us* too, pointing at the home page's `#/#talk` (round 18; `#/sellers` said *Request a scoping call*, into the Services page's form, until then).

**States.** A wrong domain keeps the form and puts the route link inside the error (*"Customer or partner? Talk to us instead."*). A confirmation replaces the form inside the same pane — `form-confirm` with its check mark, a title, a body in which the practice address is a link — and closes on the next step: on a product page *Talk to us* (the same `…/contacts#talk` anchor, which opens the ask tab), and no longer *Get the full kit*, which left with the all-offers kit (2026-09-29); on `#/sellers` a quiet *Request another kit* that brings the form back with the email kept. Which confirmation shows depends on what actually happened (`SCHEMA.md` §`salesKit`): the page only says the kit was emailed when an auto-sender is configured.
