# VISUAL-GRAMMAR.md — one component grammar for all seven product pages

This file is the contract between `site/data/content.js` and the product renderer (`site/pages/product.js`). It answers one question: **what component renders each fact, and does it look the same on all seven products?**

The rule that produced it: a reader who has seen one product page must be able to read the next six without re-learning the layout. Same eyebrow treatment, same icon style, same card geometry, same order. Only the words change.

Five hard rules:

1. **Every product fills every slot.** No product is allowed to render a shorter Overview than another. Where a product has no published number, the slot is filled with a **qualitative** instance of the same component — never a blank, never a missing section, never a sentence apologising for the absence.
2. **A number never renders without its honest frame, and never with an apology.** In the Overview's numbers widget (round 20, Alex: no footnotes, no method notes; round 21: a chart that matches its number at a glance) the frame is inside the tile: the kind chip (*Proven* or *Estimated*) and the figure's own shape, a range or a "from X", drawn as named Today and After bars whose every value is printed, the figure on the mark it names (§2.4). A price keeps its footnote, `jumpstart.investment.footnote`, under the price card in its block; and the case-study callout, which has no footnote row, carries its caveat in the last sentence of `story`. The home case card has had no footnote row since round 19 either: its figure's small line (`metric.label`) carries the baseline (*down from 3–5 days of keying by hand*), and on a Forecast card the two load-bearing facts, *simulated on the customer's own history*.
3. **Icons are 1.5px line icons, teal, from the one registry in `assets/app.js`.** No emoji anywhere. No filled icons except the existing `play` and `dot`.
4. **Peer figures share their baselines.** Wherever a value/label pair sits beside another — the case-study callout's figures where it carries two, the Jumpstart investment figures, the numbers widget's tiles where they stand side by side — the row is one grid with two rows, so every value occupies the first and every caption the second. Laid out as independent cards, one wrapped value drops its caption half a line below its neighbour's, and two captions on different baselines is the geometry inconsistency this file exists to prevent. On mobile the pairs stack and the rule is moot.
5. **No customer mark is rendered at all** (Alex, 2026-09-16). A logo is the one element of a case study that cannot be anonymized, so the **industry** stands where a mark used to: on the product page's callout as the medallion — a circle carrying the `industry-<key>` line icon, at the same optical weight — and on the home page's card as that industry's own photograph (round 11, §9 S5). The files under `assets/img/logos/` stay on disk, unreferenced; `check-grammar.js` fails the build if a path under them returns to `content.js`.

---

## 1. Hero (top block) — every page but one

On a product page, the hero sits on softserveinc.com's blue detail-hero gradient with no photograph behind its copy (§55), and its one picture is the product's own screen in the frame. The product's `hero.image` has one job, described at the end of this section: it is the tile on the Products page.

**The home page is built the other way round** (round 5, §9; round 11): its hero carries no photograph at all, and its photographs sit lower down. `overview.hero.image` is retired, the right column holds the built-on stack visual instead, and everything below about frames and posters applies to the product heroes only (the Services hero left with its page in round 18). Since §55 a product hero carries no photograph either: `products[].hero.image` is its catalog tile's picture (§1.1). Two of the hero files are reused below the home hero, each under its own focal point: `heroes/overview.jpg` behind the products panel of S2 and `heroes/services.jpg` behind the practice panel (§9). The rest of the hero grammar — eyebrow, H1 with a teal part, lead, a CTA row that is always last — the home hero keeps.

| Part | Source | Notes |
|---|---|---|
| Ground | — (`site.css`, `.product-hero.has-hero-bg`) | **softserveinc.com's detail-page hero** (§55, measured 2026-09-29): `linear-gradient(0deg, #ffffff -24.5%, #c1dff4 39.38%, #458fdd 99.67%)`, Lviv blue at the top thinning to white at the foot, and **no photograph behind the copy**. On the blue the breadcrumb takes full ink, the outlined chip a 42 % black hairline and the *Interactive demo* badge a white fill. The archive theme draws the same markup on its dark ground. |
| The one picture | the frame (below) | the product's own screen, where softserveinc.com puts its one sharp cut-out object. `products[].hero.image` (`{ file, alt, focal }`, authority `site/assets/img/heroes/heroes.json`, a copy in `content.js`, **kept in sync**) is the catalog tile's photograph only. |
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

**Two hero layouts, chosen by data — nothing else changes.** Alex, 2026-09-29 (§55): *"video preview on the right … It should link to the video … If no video, but product has a walkthrough, it should be opening instead of the video. Only if neither walkthrough, nor video is available, slot should be empty."*

- **Two column** — text left, a 16:9 frame right, when `links.json` holds a recording or a walkthrough for the product. The frame is the product's own screen (`videoPoster`) under one round blue button: a plate with the 8 px cut on the gradient, no border, no shadow. What it opens decides its glyph:
  - **the recording**, where `video` is set (Large docs, Workforce): ▶ (`play`, solid) and the caption **Watch the demo** over a veil on the bottom 40 % only. A YouTube or Vimeo link, or a plain video file, plays in the modal; a SharePoint or Stream link opens in its own tab, because its page refuses to be framed on another site and opens only for a signed-in viewer (`playsInPage()`);
  - **the walkthrough**, where there is no recording (Account insights, Cross-system ERP Q&A, Fleet, Repair-or-replace): the badge's `cursor-click` glyph and **no caption**, since the badge and the CTA button beside it already say *Interactive demo*; it opens in its own tab through `UI.demoHref`, so frame, button and badge open one thing.
- **Single column** — neither exists: no frame, the copy alone on the gradient. Never an empty frame, a greyed play button or a "video coming soon" line (round 18, Alex: *"No fake and placeholder links no longer allowed"*; the retired `video: true` switch and its *being prepared* panel fail the checker).

The CTA row does not change with the frame: *Talk to us*, then *Interactive demo* wherever a walkthrough exists, even beside a frame that opens it too. A recording gets no button, because it always has its frame.

Poster resolution order, first non-empty wins:

1. `SITE_CONFIG.products[slug].videoPoster`
2. `https://img.youtube.com/vi/<id>/maxresdefault.jpg` — only when the `video` link is a YouTube link

There is no third step, and the checker requires the first wherever the frame renders. **A poster is a distinct capture of the product's own screen**, leading with its before → after band where the product has one (ASSETS §1.6): never the tile's photograph, and never a still from a recording that runs on a customer's data. A frame with no poster falls back to the `video-card--plate` modifier: a light plate, the button and, for a recording, the caption over a veil.

### 1.1 The same image, as a Products-page tile

**Copy sits on a photograph only where the component is a photograph by design, and always under a veil or scrim that carries its legibility**: the catalog's hero (a scrim from the copy side, §1.4), the home page's two ways in (a scrim, §9 S2), and the home case card's band, which carries the descriptor and the area and nothing else (a bottom-up veil, §9 S5). **A tile is never one of them** (round 3, D): every tile is **an image band over a solid body**, its copy on the body, and both halves are the same size on every tile — two per row, equal height.

| Part | Content |
|---|---|
| **Image band** (~16:7, top) | That product's own `hero.image`, same file and `focal`, **ending on a clean edge where the body begins** (round 18, Alex: *"boundary between image and block underneath should not be blured"*; the veil that faded the photograph into the body is gone, as on softserveinc.com's cards). Overlaid: the **facet short label** top-left on its own plate — the brand's card chip on a photograph, `#4d4d4d` at 30% under white 12 px micro-type, a 4 px cut — and the **Artifacts badges** top-right on their white plates. Nothing else. A product on two platforms carries **one plate per platform** in a `.ptile-facets` wrapper that keeps the lone plate's corner and 60% width, so the plates sit side by side on a wide tile and wrap to a second line on a phone, clear of the badges (2026-09-29). |
| **Body** (solid dark surface) | The **category chip**, the product **name** as an H3, the `oneLiner`, the three `tile.outcomes` as check-icon bullets, and **one** CTA — `Learn more →`. |

**The whole tile is its link** (§63, Alex, 2026-09-29: *"make images on the tiles (or entire tiles? what's intuitive?) clickable, not just the heading and learn more links"*). The title's link stretches over the tile (`.ptile-title a::after`, `inset: 0`, over the positioned `.ptile`), so a click on the picture, a label, the words or the empty space opens the product. It stays a real link (a modifier-click opens a tab, the address shows on hover) with one accessible name. The *Interactive demo* badge, the tile's one other action, stands above it (`.ptile-badges`, `z-index: 2`). *Learn more* lies under the stretch, at the same address, and takes its hover from the tile's. The ask tile works the same way, into the contact. The checker holds all three rules.

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

**One canonical technology set, in two forms** (round 4, T3; re-cut in round 9 on Alex's instruction). The **short `facets.technology[].label`** — *AI Lakehouse*, *AI Data Platform*, *AI for Fusion Applications*, *OCI + NVIDIA NeMo* — is what every compact surface renders verbatim and alone: the Products rail, the hero technology chip, the tile image-band label, `products[].tags[1…]` and the bottom band of the home hero's stack (which reads `facets.technology` directly, so it cannot drift). The **full `fullLabel`** — each opening on "Oracle" — is what prose and the footer's Oracle row use (round 18; the Services platform cards that carried it left with their page). A platform gets two forms and no more: a third (`stackLabel`, tried mid-round) would put a different name on the stack from the rail, which is the drift this rule exists to prevent. Until round 4 a product could append its engine to the pill — the three deep-research products and the extraction pack put `AI-Q` beside `OCI + NVIDIA`, the workforce pack put `cuOpt` and `Oracle Field Service` there, the two Q&A packs put `Select AI` beside the Lakehouse. Two chips of the same family and colour with no separator read as one name, so the hero advertised *OCI + NVIDIA AI-Q*, a platform nobody ships, while the rail one click away said *OCI + NVIDIA*. **A technology pill that is not a platform is now a build failure**; the engines are not lost, they are where a technical reader looks for them — the Technology tab's strip, whose engine box names each one (round 22). A second *platform* is different (2026-09-29): it is a canonical facet with its own pill, allowed only where the product's own engine is part of that platform too, and only with its Technology tab's Oracle products widget listing it (round 22).

**Every pill on the site belongs to one of these families, and says which on hover.** The solid navy pill means *technology*; anything else set in it dilutes that the moment a visitor leaves a product page.

**Badges are actions, not labels.** *Interactive demo* opens the walkthrough on its product page, from any tab, and never clicks the hero frame, which plays the recording where there is one (§55); from a tile it goes to the product page. *Oracle Marketplace* opens the listing; since round 18 it renders only with its `marketplaceUrl`, never inert.

**A badge names the thing it opens, and reads the same field the filter reads** (round 9, Alex: *"ERP Q&A has an interactive demo but no Demo tag"*). Both the badge and the *Interactive demo* checkbox key off a non-empty **`interactiveDemo`** link — the walkthrough itself — where they used to key off `video`, which only decides what the product hero's frame opens. Reading the frame flag had let the two drift in both directions: *Account insights* carried a badge with no walkthrough behind it, and *Cross-system ERP Q&A* had a walkthrough and no way in from the chip row. The glyph changed with the meaning — `cursor-click`, a pointer with its click strokes; `play` is now reserved for a recording. `pages/product.js` delegates to the shared `UI.demoHref`, so the hero button and the badge can never open different things.

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

**The search box opens the results bar** (§54): it sits over the grid it filters,
with the results line at the bar's right. Up to 720 px, where the rail stacks over
the grid, the bar is lifted above the rail, so the search box still comes first.

### 1.4 The Products page's head — softserveinc.com's About Us hero (§54)

Alex, 2026-09-29: *"think about styling it as https://www.softserveinc.com/en-us/about-us
hero screen"*, then *"Full About us crossing"*. The head is one dark photograph
(`productsPage.image`, softserveinc.com's About Us photograph, shared with no other
page) carrying the page's
name as the H1 and `productsPage.intro` as the lead, both white, over a scrim from
the copy side, and nothing else: no eyebrow, no search box, no button.

| Part | 1440 (About Us's own) | Up to 720 px |
|---|---|---|
| H1 | Azurio `--fs-hero`, .95 leading, 128 px under the header | the same size (48 px on a phone), 72 px under the header |
| Lead | Replica Light 24/1.2, 56 px under the H1, measure min(684 px, 58vw − gutter), so it stops short of the man in the cap | 18 px, full measure (36rem at most), a scrim darkening its rows |
| The crossing | a 1 px white hairline 25 px under the H1 from the left edge into the spark's left tip and out of its right tip to the edge; one line on the spark's long axis, 25°, from the top edge into its top tip and out of its bottom tip to the foot | the hairline and the upper half of the axis line; the lower half would cross the lead |
| Spark | 104 px wide, 40 px from the right edge, on the lit wall past the man in the cap (12 px from the edge at 769–1024) | 56 px wide, 20 px from the edge |
| Photograph | a frame a quarter wider and 50 px taller than the hero, from its left edge (`focal` `0 30%`): the dark side, the man in the cap, the lit wall, the laptop; never the man in white or the woman at the window. 769–1024 px shift it to 67 % and lift it 50 px more | its dark side, the man's lit back at the right edge, his face past it (25 %, 0 from 601 to 720, 50 % to 440) |
| Faces | no line and no spark on a face at any width (checked by script at 20 widths) | the same |

Every position follows from three numbers, the top padding, the H1's size and the
spark's width, so **the H1 is one word** (the checker holds it). The glyph's four
tips are fractions of its width, written once in `site.css`.

---

## 2. Overview tab — a main column and the numbers beside it

**Round 21** (Alex, 2026-09-29, choosing between two layouts: *"b) Problem solution and the How it works taking the central space (left; 4/7 to 2/3 of width); and ROI metrics look like widget on the right. I am more about b since problem solution should be central."*). **From 1240 px the tab is two columns**: a main column of two thirds (`minmax(0, 2fr)`, 800 px at 1440) holding the problem and what changes, then How it works; and **the numbers widget** in the other third (`minmax(0, 1fr)`, 400 px), 48 px apart, top-aligned with the problem plate. The grid is `"ps kpi" "hiw kpi"` on `.tab-body--overview:has(> .kpi-widget)`, 64 px between the rows.

| Order in the markup | Block | Where from 1240 px | Source | Section |
|---|---|---|---|---|
| 1 | **Problem → What changes**: two plates | main column, one over the other | `overview.problemSolution` | §2.1 |
| 2 | **What changes in your numbers**: the widget | the right third, pinned | `overview.metrics` | §2.4 |
| 3 | **How it works**: a row of step tabs, the open step's text, one frame | main column, under the plates | `overview.steps` | §2.2 |

- **The markup keeps round 20's order of the argument** (the problem, the numbers, the screens): it is the order below 1240 px and the order a screen reader reads, and the checker holds it (`problemSolution()` → `outcomesBlock()` → `howItWorks()` in `overviewTab()`).
- **The widget is pinned** under the header and the tab bar (`top: calc(var(--nav-h) + var(--tabbar-h) + 1rem)`, 125 px), so the numbers stay in view beside How it works, and it leaves with the section's end. **Only while all of it fits the window**: `measureKpiWidget()` (product.js) adds `.is-tall` when its top plus its height plus 16 px passes the window's height, on mount, on resize and when the fonts arrive, and a tall widget scrolls with the page, so its foot is never cut off. Measured: two tiles are about 600–640 px tall, pinned at 1440 × 900 and 1280 × 800, while at 1366 × 768 the taller ones scroll; three tiles, about 960 px, scroll.
- **One hierarchy across the two columns** (the fresh-eyes review of round 21): the plates lead, so beside the widget their headlines are 32 px while the widget's figures and How it works' H2 are 40 px; the widget's text starts 40 px down, level with the plates' eyebrows.
- **Spacing.** 64 px between the blocks (40 on a phone). No band is full-bleed any more.
- **One grey step and one contrast plate per screen** (`SS26-THEME.md` §3, §5): the problem plate is the tab's one `#edf0f2` surface, the What changes plate its one dark plate, and the widget is white on a hairline. Nothing on the tab is grey on grey.
- **The screen budget.** How it works fits one screen under the header and the tab bar: at 1440 × 900 the H2 (48) + 24 + the tab row + 16 + two lines of text + 16 + the 800 × 500 frame is **721 px, within 791**; at 1280 × 800 the frame is 693 × 433 and the block **638 px, within 691**. On a window 820 px tall or less the block gives up 16 px more (tighter tabs and gaps), which leaves 1366 × 768 at 674 px against 659. From 1100 to 1239 px the steps stand as a list beside the frame (§2.2) and the block is 595 px.
- **Nothing else renders here.** More detail is removed (§2.7). `scope`, `features` and each step's `features` stay in the data, unrendered (`SCHEMA.md`). The industry tabs and the case study are the Use cases tab's (§2a), because they answer a different question: *where does this apply, and has it worked?*
- **Breakpoints.** Below 1240 px the blocks stack in the markup's order: the plates side by side (padding 32 and a 24 px headline below 1100), the widget at the column's width with its tiles side by side (a third full width under a rule below 1100), then How it works. Below 768 px everything is one column, and How it works becomes cards (§2.2).
- The Previous/Next pager was removed in round 3: the tab bar and the Products grid are the navigation.

### 2.1 Problem → What changes — two plates

`overview.problemSolution` → `{ problem: { headline, text }, solution: { headline, text } }`

Round 20 (Alex: *"too much text, heading indistinguishable from text, not sexy - have no motivation to read"*). Two plates at one height, the problem first and what changes second: side by side below 1240 px, **one over the other in the main column** from 1240 px (round 21), where each plate is 800 px wide and the pair about 430 px tall at 1440:

| Part | Rule |
|---|---|
| Grid | `.ps-pair`: two equal columns, gap 24, the plates stretched to one height; from 1240 px one column, gap 16; one column below 768 px (gap 16). |
| Plate | `.ps-plate`, a 12 px cut, padding 40 (32 from 768 to 1099 px, 24 on a phone). **The problem** sits on `#edf0f2` in ink: the tab's one grey step. **What changes** sits on the `#1a1a1a` plate in white: the tab's one dark plate. |
| Eyebrow | 12 px uppercase at +.06em, read from `sectionLabels.problemEyebrow` and `solutionEyebrow`, the same on every product: `#4c5156` on grey, `#bdcbd7` on dark. |
| Headline | the plate's heading (an `h2`), Replica 400 at 28 px (32 in the main column from 1240 px, where the plates lead the screen; 24 below 1100), ink or white: the claim itself, **at most 60 characters and two lines**, balanced so the two lines come out even (`text-wrap: balance`). |
| Text | one paragraph, 18 px Light, **at most 30 words**: `#26292b` on grey, white at 82% on dark, wrapped to avoid a lone last word (`text-wrap: pretty`). |

**No icon and no arrow.** The pair reads on its own, left to right or top to bottom, and the contrast between the two plates carries the before → after. The text keeps a 736 px measure (`max-width: 46rem`).

**The copy** (Alex: *"preserve sharpness and focus around ROI, business value and clarity for the audience outside the specific industry"*). The problem headline names the role and what the situation costs them, in the nouns on their desk; the headline opposite says what changes in that person's work, and how much faster. Neither names a platform or an engine (round 19's rule: the checker fails `IMPLEMENTATION_TERMS` in both fields), and neither repeats the product's one-liner. The checker also holds the two budgets, and fails a plate's `title` or `icon` by name.

### 2.2 How it works — a row of step tabs, the open step's text, one frame

`overview.steps[]` — **3–5 steps** (four on every product today), `{ n, title, text, shot: { full, alt }, features }`. Heading `sectionLabels.howItWorks`, an H2 at 48 px (40 in the main column from 1240 px, a step under the plates' 32 px headlines' weight on the screen).

Round 20 (Alex: *"Can't fit the entire block to a single screen, which is bad + step headings are poorly lined up + too many fonts in a single place; screenshots are too small cuts … ideally, screenshots be fullscreen"*) gave the block one frame and a list of steps beside it. **Round 21** moved it into the main column (§2), where a list beside the frame left the frame too small to read, so **the steps are a row of tabs over the frame**, and (Alex, 2026-09-29: *"I don't like these blue highlights and callouts. Just have screenshots without those callouts"*) **the frame is the screen and nothing drawn over it**:

```
H2  How it works
1 Drop the document in | 2 The rates come out as rows | 3 Doubts are flagged | 4 Approve and export
═══════════════════════
The open step's text, 16 px, one or two lines
[ the frame, 800 × 500 at 1440: the whole screen, nothing over it ]
```

| Part | Rule |
|---|---|
| Tab row | `.hiw-tabs`, a `role="tablist"` named by the H2: one column per step, 24 px apart, over one 1 px `#d1dae2` hairline. Each step is a `role="tab"` button with `aria-selected` and `aria-controls` its panel: the number and the title **both 18 px Replica 400**, the title wrapping under itself clear of its number in balanced lines (`text-wrap: balance`, so no lone word), **the label sitting on its underline** whether it takes one line or two. The site's tab language: an unselected step in `#4c5156`, turning ink on hover; the selected one ink, its number `#1485c4`, **on a 2 px blue underline**. A `title` is at most 26 characters, so it takes one or two lines. |
| Text | the open step's `text` in its `role="tabpanel"`, **between the tab row and the frame**, at **16 px Light** in `#26292b`, at most 30 words, a 736 px measure, wrapped to avoid a lone last word. **Two sizes, 18 and 16.** |
| Frame | `.hiw-shot`, 16:10: **800 × 500 at 1440** (the main column), 693 × 433 at 1280, 901 × 563 at 1920. `shot.full`, the whole screen, in a 12 px cut with a 1 px `#bdcbd7` hairline, and **no ring, no inset and no mark over it**. Its `alt` is `shot.alt`, what the screen shows. |
| Full size | The frame is a button (`zoom-in` cursor, aria-label `sectionLabels.shotOpen` and the step's title) that opens the screen in the site's modal at up to 1,440 px wide, the step's number and title over it; on a phone the screen keeps its 1,280 px and the reader pans across it, told so under the title (`sectionLabels.shotPan`, *Drag to move around the screen.*). The one mark on the frame, an expand glyph in a white 36 px square at its top right, shows on hover or focus only; a phone, which has no hover, prints *Open the screen full size* under each screen instead, in the link style, inside the same button. |
| Switching | A click on a step, or ←/→/↑/↓, Home and End: one step selected at a time; its text shows at once and its frame crossfades in over 200 ms with no dip (instant under reduced motion). Every step's text and frame share the panels' two row tracks (subgrid), so the frame sits at one height whatever a text wraps to. Step 1 is selected on load. |
| 1100–1239 px | One column is wide enough for the steps to stand as a list beside the frame: the tabs 288 px wide, one per row on a hairline, the selected one on a 2 px blue left rule; the text and the frame to their right. The block stays on one screen (595 px at 1239 × 800), where a frame at the column's full 1,047 px would not. |
| 768–1099 px | The tab row over the text and a frame at the column's width. |
| Below 768 px | No tabs. Static cards, each the number and the title (20 px), the text (16 px), then **the whole screen** at the column's width, which opens full size to pan. |

**A frame is a real screen, never a crop or a skeleton** (Alex: *"they should not look like skeletons and should not be overloaded with details"*): the whole screen of the product's walkthrough, or of its HTML mock where it has none, on synthetic data. **Where the reader's eye needs leading, the screen itself does it**, as the product would: the row the step is about selected, its panel open, its tab active, its card in the product's own focus style, or the part scrolled into view (Alex: *"make sure the layout element is selected or highlighted natively (only if needed, not all screens need that)"*). Most screens need nothing: a modal in the foreground, or a screen that is wholly about the step. How each frame was chosen is `ASSETS.md` §1.

**A description sits between the control that selects it and the thing it explains** (round 10b, START-HERE §4): the open step's text sits under the tab row and over its frame, at body weight.

**The feature-coverage invariant is retired** with the tick-lists: no surface prints `steps[].features`, so nothing keeps them in step with `overview.features`. Both lists stay in the data, unrendered.

The checker holds 3–5 steps numbered from 1, the title and text budgets, `shot.full` = `assets/img/steps/<slug>-<n>.jpg` (a missing file is a warning) and a non-empty `alt`; it fails the retired `image`, `zoom`, `region` and `anchor` by name, a renderer that draws a ring or an inset, and a `howItWorks()` whose text does not sit between the tab row and the frame.

### 2.3 Industry use cases — **moved to the Use cases tab** (round 10)

The block is unchanged; only its home is. Its anatomy, its data contract and its
rules are **§2a.1**. Nothing on the Overview renders `overview.industryCases[]` any
more.

### 2.4 What changes in your numbers — the widget

`overview.metrics[]`, **two or three tiles** (two on eight products, three on Repair-or-replace decisions), under `sectionLabels.outcomes`, *What changes in your numbers*, the widget's heading at 20 px.

Round 20 (Alex: the ROI block *"too wordy, and too boring"*; show the metric *"from X"* or *"the potential improvement range"*; *"not add footnotes and explanations of how you built metrics"*) set the tile. **Round 21** (Alex, 2026-09-29: *"ROI metrics look like widget on the right"*; the charts *"hard to understand from graphics … it should not puzzle the reader"*; *"matching between number and the visual is absolutely unclear"*) set the tiles in one widget and redrew every chart as named bars with their values printed. The tile:

```js
{ key, title, kind: "proven" | "forecast" | "estimated", owner,
  figure: { prefix?, text },
  visual: { form: "compression" | "range" | "dumbbell" | "baseline", unit, direction: "up" | "down",
            scale: { min, max }, before: { value, label }, after?: { value, label },
            range?: { lo, hi, label }, gap? },
  line }
```

| Part | Rule |
|---|---|
| Widget | `.kpi-widget`: one white card on a 1 px `#d1dae2` ring with a 12 px cut, the heading then the tiles 20 px under it; padding 40 / 32 / 32 from 1240 px (its text level with the plates' eyebrows), 28 / 28 / 32 below, 24 / 20 / 28 on a phone. From 1240 px it is the right third, pinned while it fits (§2); below, it sits at the column's width between the plates and How it works. |
| Tiles | From 1240 px the tiles stack, each after the first under a 1 px `#d1dae2` rule with 20 px either side. Below 1240 px they stand side by side, 48 px apart, each after the first behind a 1 px rule, and share row tracks (subgrid), so every figure and every chart sits on one line whatever a title wraps to; a third tile goes full width under a rule below 1100 px; below 768 px they stack. |
| Dash | 32 × 4 px in orange 75, `#fe8d6b`, over every tile: the fact marker (`SS26-THEME.md` §3). |
| Title row | `title` at 16 px Replica 400 (at most 40 characters), and at its right the **kind chip**: 12 px uppercase in ink on a 1 px `#bdcbd7` ring with a 4 px cut. Its word is `shared.metricKinds[kind].chip` (*Proven* · *Forecast* · *Estimated*), and its `tooltip` is the chip's title. |
| Figure | `figure.prefix` (at most 6 characters, 20 px Light `#4c5156`: *from*), then `figure.text` in **Replica Light: at most 40 px in the widget beside the column, 56 px where the tiles stand side by side, 44 on a phone**, never Azurio. At most 14 characters with three tiles and 20 with two. **Every figure in one widget takes one size**, the size that fits its longest (`--fig-em-max`, product.js `outcomesBlock`), so peers never stand at two sizes. |
| Chart | **Named rows** (below). |
| Line | `line`, 16 px Light `#26292b`, at most 14 words: what the figure counts, in the buyer's words. |
| Owner | *Owner ·* (`sectionLabels.metricOwner`) and `owner`, 14 px `#4c5156`: the buyer-side role who tracks the number, at most 40 characters. |

**The chart is the plainest comparison a dashboard has, and the figure is printed on it** (round 21). One row per state, named in a column of its own at 14 px `#4c5156`: **Today** (`sectionLabels.metricToday`) and **After** (`metricAfter`). Each row is a 10 px bar from the one zero line and its **value printed at the bar's end**, 14 px, in the room kept for it (92 px): no legend, no axis, no scale to decode. Today's bars are grey `#9aa8b4`, After's blue `#1485c4`, and a range's or a gap's span the lighter blue `#8ec3e6`, all validated against each other (normal-vision ΔE 17.3 and 21.1, CVD 13.6 and 19.7) and all under 3:1 on white, which is why every bar prints its value. **The value the figure names is bold**, so the big number and its bar are matched by the same words:

| Form | Rows | Where the figure is printed |
|---|---|---|
| `compression` | Today at full length, After at its share of it (at least 3 px for any value above 0, however small its share; only a real 0 draws nothing) | a result (*5–15 min*, Proven) is the After label; a starting point (*from weeks*) is Today's label, with After's beside it (*hours*); a difference (*about $250* between *$350* and *$99*) gets a third row, named by `visual.gap` (*Saving*), whose light span runs from After's end to Today's |
| `dumbbell` | Today and After on one zero line | the pair (*3.0 → 2.4%*): its two numbers are the two labels, both bold |
| `range` | Today indexed to 100, printing what it stands for (`before.label`: *current rate*, *current cost*; an unlabeled bar read as a bug); After solid to 100 + lo and light on to 100 + hi when the number improves up (*+4 to +10%*), solid to 100 − hi and light on to 100 − lo when it improves down (*−5 to −10%*) | the After bar's span; `range.label` equals `figure.text` |
| `baseline` | one Today row: **a meter** (a white track on a 1 px `#bdcbd7` hairline for the whole, today's share filled in the Today grey) when the scale is 0–100; **ten dots**, today's count filled, when it is 0–10 in whole units; otherwise **the Today row alone, its value and no bar** (*up to 1 h a day*, *~1 month*), so the figure reads as today's number and never as the saving | Today's value; `before.label` equals `figure.text` |

A **label is the value alone**, at most 12 characters, never with *before*, *after* or *today* in it (the row says which). The bars are `aria-hidden`; the rows are text, so a screen reader hears *Today ~2 days, After ~30 min*. An empty chart still takes its row, so where tiles stand side by side their lines stay level.

**A figure is never a bare unit word** (QA, round 20: *Hours* or *Minutes* is neither a *from X* nor a range). A Proven compression prints its measured after (*5–15 min*, *~30 min*); an Estimated one prints its baseline, `prefix` *from* and the before in words (*from weeks*, *from a quarter*), and its chart shows where it goes; a range prints its span, a dumbbell its before → after, and a baseline its *from X*.

**The honesty lives in the framing, never in a note** (Alex: metrics *"should not lie but should [not] apologize and disclaim their value"*; *"No justification for reviewer notes pls"*). A figure is a measured before → after, a range or a *from X* baseline, and its chip says which kind: **Proven** is measured end to end in a completed proof of value on the customer's own data; **Forecast** is modeled on the customer's own history; **Estimated** is set against published industry rates or the way the work is done today. **No footnote, no method note, no ROI paragraph and no pointer to another tab.** Where each figure comes from is recorded in `PROVENANCE.md` §41.4, never on the page: the checker fails a `sources` key in `content.js`, which ships in view-source. No status colour decorates a metric; blue is the After bar.

**A metric is a business metric** (START-HERE §4): the money, time, volume, risk or quality a named buyer-side owner already tracks and the product moves directly. Never an accept rate, a coverage figure, a calibration, a delivery duration or a feature. Two tiles in one widget never share a claim shape.

**The widget may carry its product's case-study figure.** Large docs prints *5–15 min* on its Proven tile and in its case study: the case study is on the Use cases tab (§2a.2), so each tab states the number once.

The checker holds two or three tiles; a unique `key`; the title, owner, line, figure and prefix budgets; one of the three kinds and the four forms; a unit, a direction and a numeric scale; every value on its scale; every bar's label present, at most 12 characters and free of the row's name; `after` only on the compression and dumbbell forms, `range` only on the range form and `gap` only on the compression form; **the figure printed on its chart** (the After label, Today's label with *from*, a gap row, or a pair whose numbers are the two labels; a range's label and a baseline's Today label equal to it); and the renderer's Today and After row names and its figure-on-the-span rule. It fails the retired rail-tile keys (`value`, `label`, `qualifier`, `icon`), `sources`, `sectionLabels.metricToward` and an SVG chart by name.

### 2.5 At a glance — **removed** (round 3, H)

`overview.sideFacts` and the card it fed are gone. Every row on it — category, platform, availability, proof-of-value duration and price — was a denormalised copy of something printed on the same page: the chips in the hero, the Jumpstart investment card, the stack. It was therefore a second place to keep in sync, and the first to go stale; `check-grammar.js` fails if the key returns. The rail is §2.4 alone, which is also what keeps it shorter than MAIN without pinning anything.

### 2.6 Case study — **moved to the Use cases tab** (round 10)

The callout, its contract and its seven pieces are **§2a.2**, where round 10 also gave
it a wide two-column variant for the full content width. §2.6a below stays here: it is
about the *other two* surfaces that render the same engagements.

### 2.6a The same engagements on the other two surfaces

The home page renders **one compact card per case study** — a 16:9 photo band carrying the descriptor and the area, then one headline metric, one line and the link to the product; **no status chip since §62** (Alex, 2026-09-29: *"remove 'Forecast', 'Proven' etc labels on the main page in case studies"*), while the product page's callout keeps its chip — from the same objects the product pages read, so the two cannot drift apart. **Since round 11 the card carries no medallion**: the band's photograph is the industry's own file, `assets/img/industries/<industry>.jpg`, derived from the card's `industry` — the picture the Use cases tab shows — so the photograph names the industry, and the medallion stays on the product page's callout (§2a.2). The card's headline metric **is** the callout's first figure: the checker fails a card whose `metric.value` differs from its product's `caseStudy.metrics[0].value`, and fails two cards whose figures open on the same word (§9 S5). Since round 5 the four cards sit in a **2×2 grid beside the method rail** (§9, S5) rather than in a full-width three-up row: two columns from 720 px, one below it, `grid-auto-rows: 1fr` so no card is shorter than its neighbour, and the rail to their left carries the intro alone (its NDA line and its one link out, *Ask for a reference call*, left on 2026-09-29, PROVENANCE §51). **The method is not in the rail** — it was until §18.8, and it left the site with the Services page in round 18.

**Nothing else repeats that grid.** The Services page once carried the measurement method beside it rather than the same four cards (a repeat had made the evidence feel padded rather than deep); that page left the site in round 18, and the cards are the evidence's one home.

### 2.7 More detail — **removed** (round 20)

Alex: *"More detail block - on Overview page - to be removed."* The disclosure is gone, and `moreDetail`, `featuresDetail` and `featuresNote` with it (the checker fails each by name); `scope` and `features` stay in the data, unrendered.

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
6. **One or two big metrics, with no eyebrow over them** — the chip above has already said what they are. **Each figure sits under its own orange-75 dash** (32 × 4 px, `#fe8d6b`) and is set in **Replica Light, white, 64 px at 1440** (it scales down to 40, and 36 at ≤ 360 px), **never Azurio** (round 20; the checker holds both), with its label under it at 16 px Light, white at 85%. Two figures stack, 32 px apart. Two is the default, and a third would make the panel a metric row in its own right, competing with the Overview's numbers widget (§2.4); **one** is correct where only one real outcome exists. A case with no published figure sets a **qualitative outcome statement** — a turnaround claim like *Same day* or a coverage claim like *Every variance* — never an invented number, and never a restatement of the mechanic: *"One signal"* and *"Evidence-backed"* were the product's own description set at 40px in a numbers slot, which is what a slot filled because it was there looks like.
7. **The scope row** — exactly three compact facts (`scope[]`) in one column under a white 20% rule, label above value (the label 12 px uppercase `#bdcbd7`, the value 16 px white): duration, data footprint, constraint count, the human gate. Each must be a fact the rest of the card does not already carry — a slot spent restating the `area` line is a slot wasted. External-safe only: no contract value, no contract duration, no headcount, no € figure.

## 3. Technology tab — the strip and the Oracle products widget

**Round 22 (Alex, 2026-09-29):** *"I don't like current Technology tabs. Remove Architecture subheading. We have beautiful diagrams in one-pagers … use or follow them for visualization; they are well organized, sized, etc. You can have some one-liner explainers etc added, but no more than that."* His wireframe is two blocks side by side, **Diagram** (wider, left) and **Oracle products** (right). That is the whole tab: no heading, no narrative, no layer stack, no capability list.

| Width | Composition |
|---|---|
| ≥ 1240 px | `.tech-grid`: the strip in `8fr`, the widget in `5fr`, both from the top (the Overview's two-column width) |
| 720–1239 px | stacked: the strip at full width, the widget under it with its items in two columns |
| < 720 px | stacked, and the strip runs top to bottom (§3.1) |

### 3.1 The data-flow strip

`technology.diagram`, drawn as HTML by `flowStrip()` in `pages/product.js`: **the pack one-pager's composition at web scale** (Oracle-Packaging-Skills, one-pager `_flow_from_architecture`), the picture Alex called *"well organized, sized"*.

- **Three columns at the one-pager's proportions, 22 : 27 : 51.** Left, the systems: grey `#edf0f2` boxes with an 8 px cut, the source on top and a destination-only system under it; where the source is also the destination (a write-back) the column holds one box and both pipes touch it. Middle, **two labelled pipes**: → into the cloud with `toPlatform` over it, ← back out with `fromPlatform`, 2 px `#4a8fbc` lines with drawn heads. Right, **the cloud box**: `#f4fafe` with a 1.5 px Lviv-blue ring cut at 12 px, its platform name and services line in 12 px uppercase blue micro-type, holding the **app** and the **engine** as white boxes with a 1 px `#a9d3f1` ring, joined by a drawn double arrow.
- **Type:** a box's name is Replica Bold 16 px, its note 14 px muted; pipe labels 13 px muted. The boxes' words are `{ name, note }`, and they wrap and balance, so no box is sized by hand.
- **Below 720 px it runs top to bottom:** the systems side by side, then the two pipes side by side (in going down, back coming up, each label beside its line), then the cloud; below 480 px the app and the engine stack, the arrow turned upright.
- **One line under it** (`technology.line`, a `figcaption`, 16 px body): what the picture cannot show, one sentence, never a restatement of the boxes.
- Colours are the one-pager's; the ring technique is `.kpi-widget`'s (an `evenodd` polygon on `::before`), so the corners carry the outline.

### 3.2 The Oracle products widget

`technology.oracle[]` over the registry `shared.oracleProducts`, drawn by `oracleWidget()`: a white card on the Overview widget's 1 px `#d1dae2` hairline, cut at 12 px.

- **Title** *Oracle products* (Replica 20 px), then **two groups**: *Platform* first, then *Sources & destinations*, each under a 12 px uppercase label, a hairline between them. A group with no entry does not render.
- **A row is a glyph, a name and a role:** the glyph in the theme's icon well (44 px, `--surface-select` with the `--action-pressed` line icon, a 4 px cut, as `.gate-mark` draws it), the name in Replica Bold 16 px, the role under it in 14 px muted, **two to four words**.
- **One name and one glyph per system on every product**, because both come from the registry; only the role is the product's. The three catalog platforms reuse their facet glyphs (`platform-oci-nvidia`, `platform-oracle-ai-data-platform`, `platform-oracle-ai-lakehouse`), and `oracle-database`, `oracle-field-service` and `oracle-cx` were drawn in the same 1.5 px line.

Retired with round 22: the Architecture block (narrative and the SVG figure from `data/diagrams.js`), the five-layer solution-stack accordion with its vendor wordmarks, Required / Optional tags and Inbound / Outbound lines, and the four-stage Capabilities grid. The checker fails their data keys, their labels, a heading in `technologyTab()` and `data/diagrams.js` on disk.

---

## 4. Delivery tab — the packages table

**Round 22 (Alex, 2026-09-29):** *"Rename it to delivery. Content — should be same structure and content as we have in packaging table in our one-pager. Add approx. duration of phases (with very short footnote that it's confirmed at scoping); don't add prices. Everything else should be gone from this tab."* Tab label **Delivery**, route `#/products/<slug>/delivery`; `…/jumpstart` and `…/pov` redirect to it. The tab is one table, its legend and one footnote, drawn by `deliveryTab()`.

- **Columns:** the area names (22 %), then the three tiers (26 % each), **Jumpstart proof of value · Integration · Scaling**, each head its name in Replica 20 px with its size tag (**S**, **M**, **L**, a 1.5 px outlined box) and its scope line under it. The heads step up in blue as the scope grows, as the one-pager's do: `#e3f0f9`, `#c1dff4`, then Lviv blue with white type.
- **Rows:** first **Duration**, marked with an asterisk, the standing *4–8 weeks · 3–5 months · 3–12 months* at 18 px, closed by a 1 px ink rule; then one row per capability area, the area in Replica Bold, each cell **a mark and a phrase** (15 px body). The marks are drawn, the one-pager's four: ◐ partial (a half-filled ring), ● included, ●● advanced, — not included, in Lviv blue with the dash in muted grey. Hairlines between rows, none around the table.
- **Under it:** the legend at the left, only the marks the table uses, with the product's own words for ●● (`delivery.advanced`); the footnote at the right, *\* Durations are approximate and confirmed at scoping.*
- **Below 900 px** four columns do not fit: one block per tier, its head in the tier's fill with a cut, its duration, then each area with its mark and phrase. Both forms are rendered and CSS shows one; print takes the table.
- **No price.** The one-pager's two price rows are not drawn, and the checker fails a price in the data.

Retired with round 22: the promise line, the three pillars (whose `.pillar` classes the home page's Why rows still use), *What you get*, *How it runs*, *What we need from you*, the investment card with the proof-of-value price and its footnote, *After the Jumpstart*, the CTA and the engage link.

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
| `overview.steps` | 3–5 `{ n, title ≤ 26 chars, text ≤ 30 words, shot { full, alt }, features }`; `n === index + 1`; `shot.full` is `assets/img/steps/<slug>-<n>.jpg`, present; `image`, and since round 21 `shot.zoom`, `shot.region` and `shot.anchor`, are retired and fail by name |
| `overview.industryCases` | 3–6 `{ industry, label, image, problem, solution }`; `industry` in the set of 16 and unique; `label` matches `shared.industryLabels[industry]`; `image` is `assets/img/industries/<key>.<ext>`; `problem` and `solution` are 2–3 sentences each |
| `overview.sideFacts` | **absent** — the At-a-glance card was removed; the checker fails if it returns |
| `overview.featuresDetail`, `overview.featuresNote`, `overview.moreDetail` | **absent** — the More detail block was removed in round 20; the checker fails each if it returns |
| `overview.industries` | **absent** — superseded by `industryCases` |
| `overview.industriesNote` | non-empty string |
| `overview.scope.in` / `.out` | ≥ 4 items each; kept in the data, not rendered since round 20 |
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
   - **A sent request's confirmation takes its whole pane** (Alex, 2026-09-29, on the home one: *"make sure this looks good from UI standpoint (now a bit ugly)"*). `settle()` in `forms.js` hides the lead that asked for the input (the Talk pane's `forms.demo.sub`, the kit pane's eyebrow and body) and the confirmation opens the pane: level with the card's eyebrow on the home page, under the switch on a product page, so the tabs never move. **`.form-confirm` has no surface of its own** — no fill, no padding, the column's full width; the plate is the surface. In it: the check in the theme's **icon well** (48 px, `--surface-select`, 4 px cut, a 24 px glyph in blue 125, as `.gate-mark` and `.step-index` draw it), the title at **28 px** (24 on a phone), a step under the section's H2, and the body at body size. It replaced a 640 px slab of the selected tint, round a white square that read as a ticked checkbox, under a 40 px H3. The plate shrinks to the card's height after a send. The checker holds the no-surface rule, the width, the title's size, the well and both `settle()` calls.
   - **Home S7 renders the same component** (round 18, Alex: the home form *"equivalent (texts, CTAs, etc., flow) to what we have on per-product page (though logical difference to be preserved)"*). What differs is data only: the card names Karsten alone and the ask's product select starts on *Not sure yet*. **It carries no sales kit** (Alex, 2026-09-29: the *Get the sales kit* tab *"should not appear on the main page"*): passed no kit, the component renders **the Talk pane alone — no segmented control, no tab roles, no kit pane** — and the pane, now the column's first child, drops its top margin so it starts level with the card. With no segment to head it, the form column opens on `forms.demo.sub`, and a third *talk* is not added. **The section's eyebrow and H2 open the card's column, inside the plate** (2026-09-29): `closing()` hands them to the component as `intro`, and `contactSplit` sets them above the card, as softserveinc.com sets *Let's talk* inside its plate. Set above the band on white, the H2 read as a caption to the screen and the form as *"unattached from the heading"* (Alex). `#/#talk` opens the ask; a saved `#/#kit` lands on `#/sellers`. The checker fails `closing()` or `contactsTab()` if either renders a form of its own, `overview.js` if it hands the component a kit, and `closing()` if it renders its heading outside the component.

**The band is the page's last grey** (round 20). The footer opens on a 152 px `#edf0f2` spacer, and a grey band directly above it would merge with it into one grey mass. So the section that hosts the band gives up its paddings — on a product tab the band meets the tab bar, and on the home page the band is the whole screen, with no hairline above it — the band runs straight into the black footer, and **the footer's spacer is not drawn after a page that ends on the band** (`#app:has(> :last-child .contact-band) + .site-footer::before { display: none }`). The band's own 48 px is the breathing room the spacer gave. It holds on a product's Contacts tab and on the home page, and the checker fails the rule's absence.

**The *Bring to the call* list is retired** (round 10) from the data, the renderer and the CSS, on all three surfaces that render the card. It said the same thing three times over — the form's own message placeholder and the Jumpstart tab's *What we need from you* (retired with that tab in round 22) already asked for the workflow, the systems and the timeline. The card is a person, an address and one line, and `blurb` carries the ask.

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
| S4b | **Bespoke services** — `overview.bespoke` | **Round 18** (Alex: *"one more block called Bespoke Services … on the image dark background to make page not so monotonous"*), **re-cut on 2026-09-29** (Alex: *"content should be centered on the right to balance the page"*, a picture of *"parallelism and infinity"*, and the button after the points; PROVENANCE §57). A **dark band** (`.home-bespoke`, the section itself: a flex column, equal padding at the top and the foot, 48–64 px, a step under the other screens' so its top shows under S4) on the render's own dark (`#131516` → `#23272a`). **From 1025 px, two columns on the wrap's grid at 5 : 7:** on the left half, softserveinc.com's chrome-ribbons render (`bands/bespoke-wide.jpg`, mirrored, `object-position: 55% 50%`) in a full-height box whose mask fades it out before the copy; on the right, **one column** — the eyebrow *Bespoke services*, the H2 *Your AI factory on Oracle.*, a two-sentence lead, then **the four points two by two** (`.bespoke-points`: title in Replica 400 at 18 px, one line in 80 % white, 1 px rules over each), then one filled button, *Talk to us*, the services' one ask. It reads claim, reasons, ask: a standing team is a considered buy, so the button follows the reasons. **No word sits on the picture, and the band has no scrim.** **Up to 1024 px the band stacks**: the head; the tall crop (`bands/bespoke-tall.jpg`) on a row of its own, 12 : 5 (16 : 10 from 768 down), showing the wave along its foot, its top faded into the ground; then the points (two by two from 541 px, one column below) and the button. Only the points and the button reveal: never the band, because a transform on an ancestor would pin the picture to it mid-animation, and never the head, which has to show at once when the band peeks under S4. |
| S4c | **Why SoftServe on Oracle** — `overview.delivery.why` | Since §62 the screen opens as its peers do, the shared `.home-head`: the eyebrow *Why SoftServe on Oracle* over the H2 *AI experts who know Oracle.*, the diagram and the list under it at their shared height. Round 17's hairline list, unchanged — the brand's feature icons at 64 px, titles in Replica 28/400, bodies at `--fs-body` 300, rows between 1 px rules — on a screen of its own since round 18, after both ways to buy, where each reason reads for either. Its label opens the screen, so it is the screen's `h2`, set as the accent eyebrow. |
| S5 | **Case studies** — `overview.caseStudiesIntro` + `overview.caseStudies` | A sticky left rail — **head (eyebrow · H2 · one-sentence lead)**, and nothing else — beside a **2×2 grid** of the four case cards, all four the same height, each **a photo band over a white body** (round 11, Alex: *"image with heading + white background for content"*; anatomy below). Round 9 rewrote all four strings as reader copy: the title states the result (*Results on customers' own data*), the lead says what a card is. The rail's NDA line and its link, *Ask for a reference call*, left on 2026-09-29 (Alex; PROVENANCE §51): the rail is the head alone. The measurement method is **not** in the rail; it lived on the Services page, which left the site in round 18. |
| S6 | **About SoftServe** — `overview.about` | A full-bleed black band, one of the page's two dark screens: copy and the external link at left, a 2×2 grid of stat tiles at right. **The tile opens on SoftServe's logo** (2026-09-29, PROVENANCE §53): the brand's lockup of spark and wordmark, white, 32 px tall, in the eyebrow's place, because beside *About SoftServe* it would print the name twice; the eyebrow's words stay for screen readers. It is the tile's one mark. **No partner marks since round 18** (Alex removed the Oracle and NVIDIA logos); the checker fails any other mark in `about()`. |
| S7 | **Contact** — `overview.contact` | Since round 18 **the product Contacts tab's own switch** (`UI.contactSwitch`, §8). Its eyebrow *Contact* and H2 *Start with one conversation.* open the plate's left column (since 2026-09-29; there is no `home-head` above the band), with no lead, because the Talk pane opens with its own. The section is a `home-screen` with no padding and no top hairline: the grey band is the screen, and the whole ask fits it. |

The rules the screens share:

- **No photograph on the home hero; the page's photographs sit lower.** The three-layer stack is the hero's only illustration (§1). Below it, S2's two panels are photographs with their copy on them under a scrim, S4b is a full-bleed photograph with its copy on the dark half, S5's cards open on a photo band that carries only the descriptor and the area under a veil, and S3's tiles are flat fills whose line drawings sit above their copy (§1.1).
- **One accent per screen.** The orange `#f46a4a` lands once — the H1's middle line is the page's one accent line; the eyebrow and the first ladder dot take the blue `#1485c4`, which means *act on this* or *selected*.
- **Equal-height peers everywhere** (rule 4): the tiles inside a stack band, the two panels, the six group tiles, the five stages, the four case cards, the three stat tiles. (The three Why rows are a list, not peers side by side, since round 16.) `grid-auto-rows: 1fr` or a stretched grid, never independently sized cards. **The three stack bands are the exception since round 9** — their heights are `auto`, because the middle band carries six tiles in two rows and forcing `1fr` on all three would pad the outer two with air.
- **Absence is an empty container, never a sentence.** A group with no product today still gets its tile, and the tile lands on that group's own `emptyState` in the catalog.
- **The Bespoke band shows under Packaged services** (Alex, round 18: *"slightly but sufficiently visible"* when he scrolls there). Three things hold it: nothing stands between the track and the band; a `#/#…` anchor on a home screen lands with the screen's top edge under the sticky header, not 96 px down (`assets/app.js`, which also looks the target up afresh on every call, because one hash navigation renders the page twice and a stale element landed the page a header short); and at desktop widths with ≤ 800 px of height every home screen's padding drops to 40 px, its head's margin to 24 px, the band's top padding to 32 px. Measured after the header's *Services*: 344 px of the band at 1920 × 950, 254 at 1512 × 860, 198 at 1440 × 820, 251 at 1536 × 740, 122 at 1366 × 650 (eyebrow and heading) and 74 at 1280 × 620 (the eyebrow); the last two re-measured after §57 moved the band's head to its right-hand column.
- **Two dark screens, never adjacent** (round 18): S4b's dark band and S6's black band, with S5's white screen between them — the one inversion the theme allowed became two on Alex's ask for a darker, less monotonous Bespoke band (`docs/SS26-THEME.md` §5). S2's panels and S5's card bands are photographs inside cut containers, not bands, and do not count.
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
| Body | `.case-card-body`, white, a flex column with `gap: .875rem`: the figure (`.case-figure-value` + `.case-figure-label`, first since §62 took the status chip off) · the `line` · the link to the product, pinned to the foot so the four links land level per row. |
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

**States.** A wrong domain keeps the form and puts the route link inside the error (*"Customer or partner? Talk to us instead."*). A confirmation replaces the form inside the same pane, and on a product page the pane's eyebrow and body with it (§8) — `form-confirm`, with no surface of its own: the check in the icon well, a 28 px title, a body in which the practice address is a link — and closes on the next step: on a product page *Talk to us* (the same `…/contacts#talk` anchor, which opens the ask tab), and no longer *Get the full kit*, which left with the all-offers kit (2026-09-29); on `#/sellers` a quiet *Request another kit* that brings the form back with the email kept. Which confirmation shows depends on what actually happened (`SCHEMA.md` §`salesKit`): the page only says the kit was emailed when an auto-sender is configured.
