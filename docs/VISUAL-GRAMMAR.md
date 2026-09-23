# VISUAL-GRAMMAR.md — one component grammar for all seven product pages

This file is the contract between `site/data/content.js` and the product renderer (`site/pages/product.js`). It answers one question: **what component renders each fact, and does it look the same on all seven products?**

The rule that produced it: a reader who has seen one product page must be able to read the next six without re-learning the layout. Same eyebrow treatment, same icon style, same card geometry, same order. Only the words change.

Five hard rules:

1. **Every product fills every slot.** No product is allowed to render a shorter Overview than another. Where a product has no published number, the slot is filled with a **qualitative** instance of the same component — never a blank, never a missing section, never a sentence apologising for the absence.
2. **A number never renders without the disclaimer beside it.** `metricsNote` renders as a footnote line directly under the metric row, in the same block; `jumpstart.investment.footnote` under the price card, in its block; and the case-study callout, which has no footnote row, carries its caveat in the last sentence of `story`.
3. **Icons are 1.5px line icons, teal, from the one registry in `assets/app.js`.** No emoji anywhere. No filled icons except the existing `play` and `dot`.
4. **Peer figures share their baselines.** Wherever a value/label pair sits beside another — the case-study callout's figures where it carries two, the Jumpstart investment figures, the side-rail metric tiles — the row is one grid with two rows, so every value occupies the first and every caption the second. Laid out as independent cards, one wrapped value drops its caption half a line below its neighbour's, and two captions on different baselines is the geometry inconsistency this file exists to prevent. On mobile the pairs stack and the rule is moot.
5. **No customer mark is rendered at all** (Alex, 2026-09-16). A logo is the one element of a case study that cannot be anonymized, so the industry medallion — a circle carrying the `industry-<key>` line icon — stands where a mark used to, at the same optical weight, on the callout and on the compact card alike. The files under `assets/img/logos/` stay on disk, unreferenced; `check-grammar.js` fails the build if a path under them returns to `content.js`.

---

## 1. Hero (top block) — every page but one

The hero is the only block on a page that carries a background image — and the same file has one other job, described at the end of this section: it is the tile on the Products page.

**The home page is the exception** (round 5, §9): it carries no hero photograph at all. `overview.hero.image` is retired, the right column holds the built-on stack visual instead, and everything below about images, focal points, veils and posters applies to the seven product heroes and the Services hero only. The rest of the hero grammar — eyebrow, H1 with a teal part, lead, a CTA row that is always last — it keeps.

| Part | Source | Notes |
|---|---|---|
| Background image | `products[].hero.image` · `services.hero.image` — `{ file, alt, focal }`; **no home-page entry since round 5** | `file` is a path relative to `site/index.html`. `focal` is a CSS `object-position` value. `alt` is the accessible description; because the image is decorative background, carry it as the container's `aria-label` only if no other label exists, otherwise `aria-hidden`. The authority on `alt` and `focal` is `site/assets/img/heroes/heroes.json`; `content.js` carries a copy so nothing has to fetch JSON at runtime — **keep them in sync**. |
| Treatment | — | Image right/top, dark gradient left-to-right plus a bottom fade into the page ground `#131313`, so headline and CTAs sit on near-black. A subtle teal tint over the image is allowed. |
| Height | — | 60–70vh maximum on desktop. **Not** full-screen. Auto height on mobile, with the image faded harder. |
| Content | `headline`, `heroLine?`, `badges?`, the chip row (§1.2), `oneLiner`, `statusNote?`, `subLine?`, CTAs | The chip row replaced the flat chip list in round 4. CTAs are the primary **Talk to us** — `site.primaryCta.label`, routed to that product's Contacts tab — and, when `demoUrl` is set, a secondary **Interactive demo** that opens the walkthrough in a new tab (CONFIG §3). |

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

- **Single column** (default) — text over the background image. Used when `SITE_CONFIG.products[slug].video` is `false` and `videoUrl` is empty.
- **Two column** — text left, a 16:9 media frame right, when `video` is `true` **or** `videoUrl` is non-empty. The frame has a thin border and a slight lift, shows a poster image with a teal circular play button overlay and the caption **"Watch the demo"**. With a URL it opens the video modal; without one it opens the pending panel — product name, `shared.videoPending.body`, and a primary button reading `shared.videoPending.cta` (*Request a live demo*, the right ask while the recording does not exist) to that product's **Contacts** tab, plus the same secondary **Interactive demo** button when `SITE_CONFIG.products[slug].demoUrl` is set. Same frame either way, so a product does not change layout the day its recording lands.

Poster resolution order, first non-empty wins:

1. `SITE_CONFIG.products[slug].videoPoster`
2. `https://img.youtube.com/vi/<id>/maxresdefault.jpg` — only when `videoUrl` is a YouTube link

There is no third step. **The hero image is never the poster.** Rendering the
hero photograph inside a frame that sits on top of that same photograph makes
the frame read as a brighter cut-out of the wallpaper rather than as a video
still, and it is the first thing on the page a seller demos.

A frame with no poster renders without its `<img>` and carries the
`video-card--plate` modifier: a navy-to-inset gradient ground with the accent
glow, a lighter veil, the teal play button and the caption. That is the
documented pending state, and it is the same rule every other missing asset on
this site follows. The frame's veil stays light enough to keep a real poster a
picture rather than a grey field — only the caption's corner is shaded.

To give a pending frame a still before the recordings land, set `videoPoster` to
a **distinct** treated frame — a step screenshot, a desaturated crop at another
focal point. Never the hero file.

A product with neither flag nor URL never renders an empty frame, a greyed play button, or a "video coming soon" line.

### 1.1 The same image, as a Products-page tile

Round 3, D: text never sits on the photograph. Every tile is **an image band over a solid body**, and both halves are the same size on every tile — two per row, equal height.

| Part | Content |
|---|---|
| **Image band** (~16:7, top) | That product's own `hero.image`, same file and `focal`, with a dark gradient at its lower edge. Overlaid: the **facet short label** top-left (e.g. "OCI + NVIDIA NeMo") and the **Artifacts badges** top-right. Nothing else. |
| **Body** (solid dark surface) | The **category chip**, the product **name** as an H3, the `oneLiner`, the three `tile.outcomes` as check-icon bullets, and **one** CTA — `Learn more →`. |

The second CTA — the contact ask — is gone from the tile: a tile with two actions makes the reader choose before they know what the product is, and the product page's hero carries that ask anyway. Hover lifts the tile slightly and scales the image 1.05, which `prefers-reduced-motion` disables. An odd count ends with the last tile alone in the left column.

A product with no hero file on disk renders the same tile with the band on the flat ground, because the image guard drops an `<img>` that will not load. **The home page carries no product tiles since round 9** — its S3 is six group tiles (§9), which share this tile's grammar (an image band over a solid body, text never on the image, one action) at a different scale and with a group's name and line instead of a product's.

### 1.2 The chip row — three tag families, visibly different (round 4, T1)

Before round 4 the hero and the tiles carried a run of chips that all looked the same: a category, an Oracle platform, a technology name and a sales state, in one undifferentiated navy row. A reader had to know the taxonomy to tell which was which. There are now **three families**, each with its own shape, and each naming itself in a `title` tooltip read from `shared.tagFamilies`.

| Family | Shape | Content | Tooltip |
|---|---|---|---|
| **What it does** | **Outlined** chip — transparent ground, 1px border | The product's `categoryChip`, which since round 9 is the **group's full name** — *Enterprise knowledge & analytics* · *Deep research & investigation* · *Document processing* · *Transaction & process execution* · *Forecasting & optimization* · *Video & image intelligence* — with the icon from `shared.tagFamilies.pattern.icons[product.category]`, one glyph per group | `What it does` |
| **Technology** | The existing **solid navy** pill | **Exactly one pill: the facet's short `label`** — *AI Lakehouse*, *AI Data Platform*, *OCI + NVIDIA NeMo* — carrying its `fullLabel` as the `title`, with the platform glyph from `shared.tagFamilies.tech.icons[product.facet]`: a cloud-and-GPU glyph for OCI + NVIDIA NeMo, a data cylinder for AI Data Platform, a layers glyph for AI Lakehouse, an application grid for AI for Fusion Applications | `Runs on` |
| **Artifacts** | Compact **tinted icon pill** — a badge, not a chip | *Interactive demo* (`cursor-click` glyph) where `SITE_CONFIG.products[slug].demoUrl` is non-empty; *Oracle Marketplace* (storefront icon) where `.marketplace === true`. **Maximum two, and both are optional.** | `Interactive demo — a guided walkthrough you can click through` / `Available on Oracle Marketplace` |

**One canonical technology set, in two forms** (round 4, T3; re-cut in round 9 on Alex's instruction). The **short `facets.technology[].label`** — *AI Lakehouse*, *AI Data Platform*, *AI for Fusion Applications*, *OCI + NVIDIA NeMo* — is what every compact surface renders verbatim and alone: the Products rail, the hero technology chip, the tile image-band label, `products[].tags[1]` and the bottom band of the home hero's stack (which reads `facets.technology` directly, so it cannot drift). The **full `fullLabel`** — each opening on "Oracle" — is what the Services platform cards carry and what prose uses, because a card has the room for the product name. A platform gets two forms and no more: a third (`stackLabel`, tried mid-round) would put a different name on the stack from the rail, which is the drift this rule exists to prevent. Round 5 retired the home page's own platform-card list with the services teaser it sat in, leaving `services.hero.platforms` as the one list whose four names the checker has to assert. Until round 4 a product could append its engine to the pill — the three deep-research products and the extraction pack put `AI-Q` beside `OCI + NVIDIA`, the workforce pack put `cuOpt` and `Oracle Field Service` there, the two Q&A packs put `Select AI` beside the Lakehouse. Two chips of the same family and colour with no separator read as one name, so the hero advertised *OCI + NVIDIA AI-Q*, a platform nobody ships, while the rail one click away said *OCI + NVIDIA*. **A second technology pill is now a build failure**; the engines are not lost, they are where a technical reader looks for them — the Technology tab's narrative, solution stack and integrations, each of which already named all four.

**Every pill on the site belongs to one of these families, and says which on hover.** The solid navy pill means *technology*; anything else set in it dilutes that the moment a visitor leaves a product page. The Services page's application-family chips are therefore **outlined**, like the workflow-pattern family they are closest to, and carry an `Application family` tooltip.

**Badges are actions, not labels.** *Interactive demo* scrolls to the hero's demo frame and opens it where the page has one, opens the walkthrough itself where it does not, and goes to the product page from a tile. *Oracle Marketplace* opens `marketplaceUrl` when one is set and is inert otherwise — the badge says a listing exists.

**A badge names the thing it opens, and reads the same field the filter reads** (round 9, Alex: *"ERP Q&A has an interactive demo but no Demo tag"*). Both the badge and the *Interactive demo* checkbox key off a non-empty **`demoUrl`** — the walkthrough itself — where they used to key off `video`, which only decides whether the product page carries a 16:9 video frame. Reading the frame flag had let the two drift in both directions: *Account insights* carried a badge with no walkthrough behind it, and *Cross-system ERP Q&A* had a walkthrough and no way in from the chip row. The glyph changed with the meaning — `cursor-click`, a pointer with its click strokes; `play` is now reserved for a recording. `pages/product.js` delegates to the shared `UI.demoHref`, so the hero button and the badge can never open different things.

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
  staying on the hero stack and the Services cards, where it is a platform the
  practice delivers on. The checker allows that flag on that id alone.
- **A zero-count option is disabled and prints no number.** That is what answers
  §18.9's objection to a `0` beside an Oracle product name on a page an account
  executive opens live: the option keeps the rail's shape, and the score is simply
  not printed. Today the disabled options are *AI Data Platform*, *Transaction &
  process execution* and *Video & image intelligence*.
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

## 2. Overview tab — two columns, a fixed order in each

**Target: the MAIN column reads in ~1.5 desktop screens at 1440×900 without feeling cramped.** If a product exceeds that, prose moves into §2.7 — it does not stay on the page. (The site footer sits below the tab body and adds about half a screen of its own; the target is about the tab, not about the scroll height of the document. The Previous/Next pager was removed in round 3 — the tab bar and the Products grid are the navigation.)

The tab is a **two-column layout on desktop**: a MAIN column at roughly two thirds, and a SIDE rail at roughly one third, on the right. The rail cell stretches to the height of MAIN and holds **one card, §2.4 Outcomes & ROI**, which scrolls with the page. **Nothing pins any more** — the card that used to be sticky was §2.5 At a glance, and it went with round 3, H. Below 1100 px the layout collapses to one column and the rail follows the main column.

| Column | Order |
|---|---|
| **MAIN** | §2.1 Problem ↔ Solution → §2.2 How it works (the stepper) → §2.7 More detail (one disclosure) |
| **SIDE rail** | §2.4 Outcomes & ROI — and nothing else |

**Round 10 moved two blocks off this tab.** The industry tabs and the case study are
now the **Use cases** tab (§2a): they answer a different question from the Overview's
— *where does this apply, and has it worked?* — and in the MAIN column they were
pushing How it works, the tab's own argument, out of the first screen. The rail is
unchanged. The one cost is a pointer across tabs:
`large-document-extraction`'s `metricsNote` sends the reader to the Use cases tab for
the figure the rail does not repeat (§2.4, last rule).

**The rail is never taller than MAIN.** That is the constraint that decides what goes in it: a rail that out-runs its column leaves dead gutter at the foot of the page, and a pinned card that is taller than the viewport hides its own bottom for the whole scroll. Nothing else is a top-level block. The old standalone key-features checklist, in-scope/out-of-scope pair and long-form feature list are all still in the data and all render **inside** §2.7 — the compactness target is met by moving prose, never by dropping a fact.

### 2.1 Problem → Solution — paired two-panel strip

`overview.problemSolution` → `{ problem: { title, text, icon }, solution: { title, text, icon } }`

Two panels of identical height side by side, an arrow glyph (`icon("arrow")`) between them. Each panel: icon, eyebrow (`title`, uppercase), 1–2 sentences (`text`). Panels stack vertically on mobile with the arrow rotated 90°.

Icon convention today: `problem.icon = "alert"`, `solution.icon = "spark"` on all seven. It is data so it can diverge — but only for a reason.

### 2.2 How it works — the workflow stepper (MAIN)

`overview.steps[]` — **3–5 steps**, `{ n, title, text, image, features }`. Heading from `sectionLabels.howItWorks`.

This block **replaces the flat key-features checklist**. The same bullets are still on the page; they now sit under the step of the workflow they belong to, so a reader learns the shape of the work rather than a list of nouns.

| Field | Rule |
|---|---|
| `n` | 1-based, in order. The circle beside the title. |
| `title` | The step, as a verb phrase. One line. |
| `text` | ≤ 2 lines (≤ 30 words). What happens at this step. |
| `image` | `assets/img/steps/<slug>-<n>.jpg` — a real product screenshot where one exists, otherwise a designed step illustration built to the same frame. Either way it renders in **one 16:10 frame with a thin border**, so the two kinds are visually interchangeable and a screenshot can replace an illustration later with no layout change. |
| `features` | The exact `overview.features` strings that belong to this step. Rendered as check-icon bullets under the step text. |

**The coverage invariant.** Across a product's steps, the union of `features` must equal `overview.features` exactly — every bullet in one step, no bullet in two. That is what makes it safe for the stepper to be the only surface those bullets have. `tools/check-grammar.js` asserts it in both directions.

**The anatomy, since round 10: the frame is the block.** The screenshots are the best
thing on the page (Alex), and the old two-column layout gave them the narrower half
of an already narrow column — **404 × 253 at 1440, shorter than the 380 px step list
beside them**. On a desktop (≥ 901 px) the block now reads top to bottom:

```
H2  How it works
[1 Upload and classify][2 Extract against the rules][3 Score, cite, validate][4 Review and export]   ← one cell per step
[ active step: description at body size, then its features ]
[ frame 16:10, the full width of MAIN ]
```

**The order is head → description → picture** (round 10b, Alex: *"the description text
is below the image and too far from heading, so context is lost; also that description
doesn't look like description, more like a footnote."*). A description belongs between
the control that selects it and the picture it explains, and it is set at body weight
because it is the step's description, not a caption of the image.

| Part | Rule |
|---|---|
| The grid | `.stepper` is `grid-template-columns: repeat(var(--steps), minmax(0, 1fr))`, `column-gap: 0`, `row-gap: 1rem`; the renderer emits `style="--steps: N"` (3–5). `.stepper-list` and `.stepper-step` are `display: contents`, so the heads, the body and `.step-frames` are all children of that one grid. Explicit rows: heads in row 1, the body at `grid-column: 1 / -1` in row 2, the frame at `1 / -1` in row 3. |
| Head cell | The number chip and the title, `align-items: flex-start`, `align-self: stretch` so every cell is as tall as the strip's tallest, and a **continuous 2 px rail** under the row (`box-shadow: inset 0 -2px 0 var(--border-subtle)`, `var(--action)` under the active one) — the site's own tab language. The title may wrap to two lines: dim at rest, `--text` active, `--action` on hover. |
| Body | **One column at body weight**, a flex column with `gap: .75rem` and `padding: .25rem 0 0`: `.stepper-text` at `var(--fs-body)` in `--text`, 1.35 leading, `max-width: 44rem`, then the feature tick-list at `var(--fs-sm)` in `--text-body` with 1 rem glyphs. A step with **no** features renders **no `<ul>` at all**. It starts 16 px under the heads row at 1440. |
| **The row is pinned** | Every body is placed in the **same** grid cell and a closed one keeps it — `.stepper-body[hidden] { display: flex !important; visibility: hidden; }` — so the row is as tall as the tallest step and **the picture never moves when the reader switches steps** (frame top 1538.8 px on every step at 1440). `min-height: 5.5rem` is the floor for a product whose steps are all short. `visibility: hidden` is what keeps the closed bodies out of the tab order and the accessibility tree, the job the `hidden` attribute did before; the `!important` beats the global `[hidden] { display: none !important }` and is scoped to this one component at this one breakpoint. **The cost is up to ~64 px of air** under a short description (the bodies run 94, 126 and 158 px on the four-step product), which is the price of a picture that holds still. |
| Frame | `.step-frame` keeps its 16:10, its thin border and its `contain`-for-SVG / `cover`-for-JPG rule, now at `width: 100%` of the row with `align-self: start`, and `margin-top: .25rem` on top of the row gap — 1.25 rem between a description and the picture it describes. **Measured on the large-document-extraction Overview: 803 × 503 at 1440, 700 × 438 at 1280, 832 × 521 at 1024** — the rail collapses at ≤ 1100 px, so MAIN becomes the whole column and the frame is wider there than at 1280. |
| Keyboard | The strip is horizontal on a desktop and a vertical accordion below 901 px, and one component may not answer to different keys at two widths, so the stepper's roving `tabindex` takes **both axes**: ←/→ **and** ↑/↓, plus Home and End. Enter/Space activate; each head carries `aria-expanded` over its own body. `roving()` takes an `axis` of `"horizontal"` / `"vertical"` / `"both"` — the industry tabs stay horizontal. |
| ≤ 900 px | **Today's accordion, unchanged**, including its own type sizes: `.stepper` a single-column flex, `.stepper-list` a vertical hairline-ruled list, each body under its own head, the frame after the list, and no box-shadow rail. The archive theme never sees the desktop rules at all. |

Step 1 is selected on load on both layouts, the other steps collapse to number and
title, and the frame's image `alt` is the step title.

### 2.3 Industry use cases — **moved to the Use cases tab** (round 10)

The block is unchanged; only its home is. Its anatomy, its data contract and its
rules are **§2a.1**. Nothing on the Overview renders `overview.industryCases[]` any
more.

### 2.4 Outcomes & ROI (SIDE rail)

`overview.metrics[]` + `overview.metricsNote` + `overview.roi`, stacked as one compact block. Heading from `sectionLabels.outcomes`.

Tile shape:

```js
{ value: "~30 min" | null, label: "…", qualifier: "…", icon: "clock" }
```

| Field | Rule |
|---|---|
| `value` | The figure, short enough to set large (≤ 14 characters). **`null` means a qualitative tile** — the value slot renders the `icon` at display size instead of a number, and the tile keeps its full height so the stack stays even. |
| `label` | What the figure measures. One line, ≤ 8 words. |
| `qualifier` | The honest caveat or baseline: "Down from ~2 days", "Targeted reduction at proof of value". ≤ 12 words. |
| `icon` | An icon-registry key (§4). Always present, on numeric and qualitative tiles alike. |

In the rail the tiles **stack vertically** rather than sitting in a row — up to four tiles in their compact form, then the `roi` callout in its compact single-column form, then `metricsNote` as the footnote line closing the block. All three stay in the same visual block: rule 2 of this file is that a number never renders away from its disclaimer, and a rail that scrolled the figure past its footnote would break it as surely as a missing footnote would.

**The heading follows the data.** When at least one tile carries a `value`, the block is headed `sectionLabels.metrics` ("Metrics improved"). When every tile is qualitative it is headed `sectionLabels.metricsPlanned` ("What the proof of value measures") instead — a heading asserting improvement over four tiles with no number, closed by a footnote saying no metrics are published, contradicts itself two lines later.

**A rail tile never repeats a case-study figure.** The case study owns the two numbers it sets large; the rail holds outcomes and ROI. Where a product's proof produced figures that the story already carries, the rail keeps the qualitative tiles and `metricsNote` points at the story — **which since round 10 means pointing at the Use cases tab**, by name (*"…in the case study, on the Use cases tab."*), because a note saying "on this page" stopped being true when the callout moved. The reader still meets each number once, and the two named products are built the same way.

### 2.5 At a glance — **removed** (round 3, H)

`overview.sideFacts` and the card it fed are gone. Every row on it — category, platform, availability, proof-of-value duration and price — was a denormalised copy of something printed on the same page: the chips in the hero, the Jumpstart investment card, the stack. It was therefore a second place to keep in sync, and the first to go stale; `check-grammar.js` fails if the key returns. The rail is §2.4 alone, which is also what keeps it shorter than MAIN without pinning anything.

### 2.6 Case study — **moved to the Use cases tab** (round 10)

The callout, its contract and its seven pieces are **§2a.2**, where round 10 also gave
it a wide two-column variant for the full content width. §2.6a below stays here: it is
about the *other two* surfaces that render the same engagements.

### 2.6a The same engagements on the other two surfaces

The home page renders **one compact card per case study** — medallion, descriptor, status chip, one headline metric, one line, the link to the product; **the status word is in the chip and nowhere else**, as on the callout — from the same objects the product pages read, so the two cannot drift apart. Since round 5 the four cards sit in a **2×2 grid beside the method rail** (§9, S5) rather than in a full-width three-up row: two columns from 720 px, one below it, `grid-auto-rows: 1fr` so no card is shorter than its neighbour, and the rail to their left carries the intro, the NDA line and the one link out. **The method is not in the rail** — it was until §18.8, and it now ships only on Services, where the rail's link points.

**Services does not repeat that grid.** It carries the **method**: the measurement discipline at body size as the section's lead, the one accuracy figure as a labelled stat beside it, then one line per engagement saying what that engagement measures and against what, and a link back to the Overview cards that carry the numbers. A customer moving Overview → Services met the identical four cards twice, which flattened the Services page and made the evidence feel padded rather than deep; the split is outcomes there, method here. **No figure appears in a Services engagement line** — a number away from its caveat is rule 2, and the caveats live on the cards.

### 2.7 More detail — one collapsible disclosure (MAIN)

Collapsed by default, one control at the end of the MAIN column. Inside, in order:

1. `overview.moreDetail[]` — `[{ title, body }]`: the today/tomorrow pairs, the pattern definitions, the pull quotes, the per-persona "where it applies" paragraphs, the scope boundaries, the roadmap notes, the evaluation disclaimer.
2. `overview.scope` → in / out, the two compact lists, under `sectionLabels.scope`.
3. `overview.featuresDetail[]` — the long-form feature list, under `sectionLabels.moreDetailFeatures`.
4. `overview.featuresNote?` — the asterisked caveat, where the product carries one. Only `workforce-optimization` does.

Nothing that reads as a wall of text sits above the fold. Equally, **nothing is dropped**: every one of those five is a shipped fact that used to have a top-level block, and the disclosure is where it went.

---

## 2a. Use cases tab — where it applies, and whether it has worked (round 10)

`#/products/<slug>/use-cases`, the **second** tab, between Overview and Technology.
Two blocks, in this order and nothing else:

| Order | Component | Source |
|---|---|---|
| 1 | **The industry tabs** (§2a.1) | `overview.industryCases[]` + `overview.industriesNote` |
| 2 | **The case study**, in its wide variant (§2a.2) | `overview.caseStudy` — `null` on four of the seven |

- **One column at the full content width, and no rail** (`tab-body`, not
  `tab-body--compact`): 1,248 px at 1440 against the Overview MAIN column's 803 px.
  That extra width is what the wide case callout is for.
- **Where `caseStudy` is `null` the tab is the industries block alone** — no empty
  state, no placeholder, no line saying a case study is coming. The same rule as
  everywhere else on the site (rule 1, and `SCHEMA.md` rule 2).
- **The block title inside is `sectionLabels.industryCases` = *By industry***, not
  *Industry use cases*: the tab already says *Use cases*, and the block names the cut.
  The checker fails that label if it contains *use case*.
- Both blocks moved off the Overview because they answer a different question from it
  and were pushing How it works out of the first screen (§2).

### 2a.1 The industry tabs

`overview.industryCases[]` — **3–6 cases**, `{ industry, label, image, problem, solution }`. Heading from `sectionLabels.industryCases`.

A row of tabs, each an industry icon (§5) plus its label. The selected tab shows: a treated industry photograph (`assets/img/industries/<key>.jpg`), the industry name, then **The problem** and **The solution** — 2–3 sentences each, headed from `sectionLabels.caseProblem` / `caseSolution`.

- The images are keyed by **industry, not product**, so one file serves every product that uses that tab.
- First tab open by default. Tabs are a proper `role="tablist"` with roving `tabindex`: ←/→, Home and End move and select, Enter/Space activate, and each panel is `aria-labelledby` its tab and hidden with the `hidden` attribute.
- The two Lakehouse products lead with the `cross-industry` tab, because "the same two pains in every industry, regardless of stack" is their honest answer; the vertical tabs beside it are illustrations of it, not a claim of vertical focus.
- The failure mode to watch: a `problem`/`solution` pair that would read identically under any other tab. If it would, it is not an industry case.

This block **is** the product page's industry telling. The old `overview.industries[]` chip row is gone from the data: every key it held was already a tab here, so the disclosure was saying the same verticals a second time. `industriesNote` survives and renders as the footnote line closing this block — one telling per vertical, per product. A `moreDetail` entry that repeats a vertical already covered by a tab is the same defect and is removed on sight.

### 2a.2 The case study — a dark callout, wide

`overview.caseStudy`, under the industry tabs, keeping the **3px teal left rule** the success-story block had. **`null` on four of the seven products, and then nothing renders** — there is no empty state. A case renders only where the engagement has actually started: an engagement still pre-contract gets no card, because the softest true reading of a status chip is still a claim a customer's own account team can contradict in the room.

**No customer is named and no logo is rendered.** A logo is the one element of a case study that cannot be anonymized, so the round-4 callout is built around what can: the industry.

The block is a **surface-level dark panel with a 3px teal left rule, and that rule is its only decoration**. Since round 10 its children sit in **two containers** — `.case-main`, the narrative, and `.case-side`, the evidence — and `.case-callout--wide` splits them:

| Width | Layout |
|---|---|
| ≥ 901 px | `.case-body` is `minmax(0, 1.4fr) minmax(0, 1fr)` with a `clamp(1.5rem, 2.4vw, 2rem)` column gap; `.case-side` is top-aligned behind a 1 px `--border-subtle` **left rule** with the same clamp as its padding. Inside that ~480 px column `.case-figures` and `.case-scope` are each **one column**: two 40 px figures side by side, or a three-up scope grid, are unreadable there. |
| ≤ 900 px | One column — main, then side — and the rule becomes a **top rule**. On a phone the story is therefore read before the figures. |

**Narrative left, evidence right**, and the chip stays **directly above the figures it qualifies** — that pairing is why the chip moved into the side column rather than staying above the whole body.

`.case-main`, in order:

1. **The `Case study` eyebrow**, then the **industry medallion** — a circle carrying the `industry-<key>` line icon, sitting where the logo used to, at the same optical weight. There is **no header photograph**: the industry tabs directly above render the same `assets/img/industries/<key>.jpg`, so a band here showed the same picture twice within one viewport at two crops and read as a template filling itself in. Beside the medallion, the `descriptor` as the title (*"A global home-appliance manufacturer"*) and the `area` on a second line (*"Field-service operations across three countries"*). Below 768px the medallion top-aligns, so a descriptor that wraps to three lines keeps the icon-then-title reading.
2. **The story** — two to three sentences: what was done, on what data, with which stack. The last sentence carries the caveat that qualifies the figures; the panel has no footnote row, so that is how rule 2 of this file is satisfied here. **The caveat is written in the chip's plain words** — *measured*, *forecast from simulations against the customer's own historical baseline*, *an estimate set against <what it is compared with>* — and never as a negation (*not results*, *no results yet*): the chip has said it, positively, in the column beside it (§18.9). The modeled case is the one where the wording is constrained rather than free: `PROVENANCE.md` §4 makes the simulations-and-historical-baseline pair load-bearing.
3. **The NDA line** — *"Customer under NDA · reference call available on request"* on a measured or modeled case; on one in preparation it says results follow at the end of the proof of value instead, because offering a reference call about an engagement with no results yet is a promise nobody can keep.
4. **`downloadLabel`** as the one link out, rendered **only** when `SITE_CONFIG.products[slug].successStoryUrl` is non-empty. No URL, no control.

`.case-side`, in order:

5. **Status chip** — **`Proven`**, **`Forecast`** or **`Estimated`**, one plain word, read from `shared.caseStudyStatus` by the `status` key (its tooltip carries the long form). It is the element that tells a reader, at a glance, what the numbers below are, and **it is the only place on the card the status word appears** (§18.9). It used to read *"Measured in the proof of value"* / *"Modeled in the proof of value"* / *"Proof of value in preparation"*, with the same word repeated in an eyebrow over the figure — the status said twice, in a sentence about the sales stage, which made a result read as a disclaimer. **The chip and the caveat sentence in the story must still agree** — a card that says *Proven* at the top and *forecast from simulations* four lines down retracts its own headline, and it is the first thing a sceptical customer pulls on.
6. **One or two big metrics, with no eyebrow over them** — the chip above has already said what they are, and the `.case-metrics` block carries the breathing room the eyebrow used to (`margin-top: .75rem`; on the home card, `.case-card-metric { margin-top: .25rem }`). Two is the default, and a third would make the panel a metric row in its own right, competing with the Overview rail's tiles (§2.4); **one** is correct where only one real outcome exists, and the row then renders as a single column. A case with no published figure sets a **qualitative outcome statement** of the *"Hours, not quarters"* shape — a turnaround or a coverage claim — never an invented number, and never a restatement of the mechanic: *"One signal"* and *"Evidence-backed"* were the product's own description set at 40px in a numbers slot, which is what a slot filled because it was there looks like.
7. **The scope row** — exactly three compact facts (`scope[]`), label above value: duration, data footprint, constraint count, the human gate. Each must be a fact the rest of the card does not already carry — a slot spent restating the `area` line is a slot wasted. External-safe only: no contract value, no contract duration, no headcount, no € figure.

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
| `overview.problemSolution.problem` | `{ title, text, icon }`, all non-empty |
| `overview.problemSolution.solution` | `{ title, text, icon }`, all non-empty |
| `overview.metrics` | 1–4 tiles; each has `label`, `qualifier`, `icon`; `value` is a non-empty string **or** `null`. Four is the shape the rail is designed at; fewer is legitimate when a figure has been withdrawn (see `PROVENANCE.md` §14.1) and never a reason to keep an uncleared number on the page |
| `overview.metricsNote` | non-empty string |
| `overview.roi` | `{ icon, text }`, both non-empty |
| `overview.features` | 6–8 strings, each ≤ 12 words |
| `overview.steps` | 3–5 `{ n, title, text, image, features }`; `n === index + 1`; `text` ≤ 30 words; `image` is `assets/img/steps/<slug>-<n>.<ext>`; the union of `features` equals `overview.features`, no bullet twice, none missing |
| `overview.industryCases` | 3–6 `{ industry, label, image, problem, solution }`; `industry` in the set of 16 and unique; `label` matches `shared.industryLabels[industry]`; `image` is `assets/img/industries/<key>.<ext>`; `problem` and `solution` are 2–3 sentences each |
| `overview.sideFacts` | **absent** — the At-a-glance card was removed; the checker fails if it returns |
| `overview.featuresDetail` | ≥ 6 `{ title, body }` |
| `overview.industries` | **absent** — superseded by `industryCases` |
| `overview.industriesNote` | non-empty string |
| `overview.scope.in` / `.out` | ≥ 4 items each |
| `overview.moreDetail` | ≥ 3 `{ title, body }` |
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
| `forms.demo` | `secondaryHeading` non-empty (the heading Home S7 and Services give the form under the contact card); `sub` names both *workshop* and *proof of value*; **`secondarySub` absent** — retired in round 10, the Contacts tab reads `sub` |
| `shared.sectionLabels.industryCases` | contains no *use case* — the Use cases tab already says it |

A slot that cannot be filled with a fact is filled with a **qualitative** instance — a `null`-valued metric tile, a `cross-industry` chip, a `Scoped per engagement` price. It is never left out, and it never renders an apology.

A **missing image file is a warning, not a failure.** Copy and imagery ship on separate tracks; the checker names each file that is not on disk yet so nothing is forgotten, and still exits 0.

---

## 8. Contacts tab and the contact card

`shared.contact` → `{ name, title, email, photo, blurb, linkedin? }`.

The tab formerly labelled **Request a demo** is now **Contacts**, at `#/products/<slug>/contacts`, and it is the **last** tab. Two retired segments redirect to it in place — `…/demo`, and since round 10 `…/sellers` (`legacyIds: ["demo", "sellers"]`) — and every contact control on a product page points at this tab rather than at a form anchor. The header button and the home-page CTAs are unchanged: they still open the standalone request form at `#/#request-a-demo`.

**The tab is one row of two columns** (`UI.contactSplit`), collapsing to a single column below 1100 px — the card, then the switch and its open pane. The two columns **start level and each end where its own content ends**:

1. **LEFT — the contact panel**, a bounded surface (not a bare row of text): circular `photo` at the top, then `name`, `title`, the `email` as a **mailto link** — an underlined anchor at body size with the mail glyph, never a filled button (§9, the address rule) — and the one-line `blurb`. `title` renders only when non-empty; an empty one leaves name + email, never a placeholder. `linkedin` renders only when the key exists. **On this tab the card takes no heading**: `cardHeading` is omitted, because the tab is already called Contacts and the switch opposite is the row's heading — which is also what levels the two columns (card top and switch top both at 818.2 px at 1440). The option stays on the component, so Home S7 and Services keep theirs. **The card is not stretched to the form's height** (`align-items: start` on `.contact-split`, `flex: 0 0 auto` on `.contact-card--panel`): stretching left a person's name floating above a field of empty inset, and a card is not a container to fill.
2. **RIGHT — a two-tab switch, and never two open forms** (round 10b, Alex: *"Get the sales kit block should be visible without scroll down + having two active input forms on one screen is a bad practice. Maybe user can switch between talk to us and Get the sales kit (for sellers)."*). The column is `.contact-tabs`, carrying `id="talk"` and a `scroll-margin-top` of `--nav-h + 5rem`:
   - **The switch** is the theme's own segmented control (`.segmented` / `.segment`) as a `role="tablist"`, capped at `max-width: 30rem` so two uppercase labels stay a switch rather than a band across the column. Two tabs: **Talk to us**, open by default, reading `site.primaryCta.label`, and **Get the sales kit**, reading `salesKit.tab.title`. Each segment is a `role="tab"` with `aria-selected` and `aria-controls`; each pane a `role="tabpanel"` whose inactive state is the `hidden` attribute; ←/→, Home and End come from `roving(…, "horizontal")`. `.segment[aria-selected="true"]` paints exactly like `[aria-pressed="true"]` — one appearance for a control that is a toggle in one place and a tablist in another.
   - **The Talk pane** is `forms.demo.sub` then the demo form, its submit reading `site.primaryCta.label`, so the hero, the header and this form are one ask (§1). **The kit pane** (`id="kit"`, §11) is the *For sellers* eyebrow, `salesKit.tab.body` with the product name, and the kit form. **Neither pane carries a heading** — the selected segment is it.
   - **Both forms are mounted at render**, open or hidden, and the switch is bound after them, so switching never lands on an unbound field.
   - **The anchor picks the tab**, in `mount`, before the router scrolls: `#kit` opens the kit pane and everything else — `#talk` included — the ask.
   - On Home S7 and on Services the right column is the plain form, with `forms.demo.secondaryHeading` / `forms.contact.sub` and `labels.submitRequest` / `labels.submitContact`. There is no switch there: the kit is a product-page thing.

**The *Bring to the call* list is retired** (round 10) from the data, the renderer and the CSS, on all three surfaces that render the card. It said the same thing three times over — the form's own message placeholder and the Jumpstart tab's *What we need from you* already ask for the workflow, the systems and the timeline. The card is a person, an address and one line, and `blurb` carries the ask.

**The left column is the card, and nothing else.** `forms.engagementSteps` — the three-step "what happens next" block this file used to place under the panel — is **gone from `content.js` and read by no renderer**; the copy that answered *"what happens if I write?"* now lives in `forms.demo.sub` beside the form.

No stray empty panel anywhere: the one row is the whole section. The **same card and split component** render the Services page contact section and Home S7, from the same object. One person, one address, one place to edit.

**The address is the practice mailbox, never a personal one.** `oracle@softserveinc.com` is what ships; the checker bans the string `ktram@` site-wide. A personal mailbox on a public page is a scraping target and an availability risk, and the person named here is a partnerships role rather than an inbox.

---

## 9. The home page — seven screens

This file is about the product pages; the home page differs from them **by composition, not by tokens**. One section each, content-sized (no `100vh`, no `min-height`), roughly 80–90 vh at 1440×900, with a hairline rule between consecutive screens and the shared `.home-head` (eyebrow · H2 · optional lead · optional right-aligned link) at the top of each.

| # | Screen | Component, in one line |
|---|---|---|
| S1 | **Hero** — `overview.hero` | Full-bleed, two **even** columns (`minmax(0, 6fr)` twice since round 9, up from 7/5, because at 5 columns' width the stack's tiles could not hold a group name): eyebrow, the **three-sentence H1**, a ≤ 45-word lead and two buttons on the left; the **three-layer stack** on the right (anatomy below). Single column below 1100 px, the stack under the copy and left-aligned. The **three-tile** `stat-band` sits directly under it (see *The proof strip* below). |
| S2 | **Two ways in** — `overview.twoWays` | An inset two-panel block sharing one hairline: each panel a bordered mark, H3, body, three ticked bullets and one down-arrow link pinned to the bottom, so the two CTAs land on one baseline. Unchanged in round 9 except its copy — the left panel repeats the H1's *Enterprise AI agents and workflows*, the right one is about the services, not the people who build them. |
| S3 | **Products** — `overview.catalog` + `facets.categories` | The `home-head` (eyebrow · H2 · lead · the right-aligned *See all products, with filters*), then **six group tiles** in a 3 × 2 grid — `.gtiles` / `.gtile`, anatomy below. No product names on this screen at all (Alex, round 9). |
| S4 | **How we deliver** — `overview.delivery` | A 60/40 split: a horizontal three-step ladder on a hairline track at left, each step carrying one labelled fact and the block carrying the figures' footnote; three inset pillar cards at right; **one button** under the ladder (the row takes 1–2 CTAs; the quiet second one was removed in §18.8). |
| S5 | **Case studies** — `overview.caseStudiesIntro` + `overview.caseStudies` | A sticky left rail — **head (eyebrow · H2 · one-sentence lead) → NDA line → one link out**, and nothing else — beside a **2×2 grid** of the four compact case cards, all four the same height. Round 9 rewrote all four strings as reader copy: the title states the result (*Results on customers' own data*), the lead says what a card is, the NDA line carries the constraint and the offer together, and the link asks for a reference call rather than pointing at the method. The measurement method is **not** in the rail: it lives on the Services page (`services.proof`), reached from the hero's second CTA and from S4. |
| S6 | **About SoftServe** — `overview.about` | The page's one dark band: copy and the external link at left; a 2×2 grid of stat tiles at right, with the partner wordmarks in a strip beneath them inside the same column, inverted to white on the band. |
| S7 | **Contact** — `overview.contact` | The existing `.closing` contact split — card plus form — the same component the Contacts tab and the Services page render. |

The rules that carry over, unchanged:

- **No photograph on the home hero.** The three-layer stack is the page's only illustration, and the only place a photograph would otherwise have gone (§1).
- **One accent per screen.** The orange `#f46a4a` lands once — the H1's middle line is the page's one accent line; the eyebrow and the first ladder dot take the blue `#1485c4`, which means *act on this* or *selected*.
- **Equal-height peers everywhere** (rule 4): the tiles inside a stack band, the two panels, the six group tiles, the three ladder steps, the three pillars, the four case cards, the three stat tiles. `grid-auto-rows: 1fr` or a stretched grid, never independently sized cards. **The three stack bands are the exception since round 9** — their heights are `auto`, because the middle band carries six tiles in two rows and forcing `1fr` on all three would pad the outer two with air.
- **Absence is an empty container, never a sentence.** A group with no product today still gets its tile, and the tile lands on that group's own `emptyState` in the catalog.
- **The dark band is S6 and appears exactly once** — the one inversion on the page, as on every other page.
- **Motion is three things:** the stack's connector lines draw in over ~1.2 s on load, sections reveal on scroll through the existing `.reveal` mechanism, and free-standing cards answer hover with a surface step and a 1.071 image scale (joined panels change surface colour instead, since a lift would break the shared hairline). No lift and no shadow anywhere — SS26 (`docs/SS26-THEME.md` §6). Everything collapses to instant under `prefers-reduced-motion`, with the drawn state as the resting state.
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

**S3's group tiles — the anatomy** (`.gtiles` / `.gtile`):

| Part | What it is |
|---|---|
| Grid | `.gtiles`: `repeat(3, minmax(0, 1fr))` with `grid-auto-rows: 1fr` and `gap: var(--gap)` — 3 × 2 above 900 px, two across from 560 to 900, one column below. |
| The tile | `.gtile` is itself the link (`<a href="#/products?cat=<id>">`) — one action per tile, and the tile *is* the action, so nothing else inside it may be clickable. Flex column on `--bg-raised`, an 8 px cut, `overflow: hidden`. |
| Image band | `.gtile-band`, `aspect-ratio: 16 / 10` over `--bg-inset`, holding `.gtile-img` (`object-fit: cover`, lazy, from `facets.categories[].image`). **Text never sits on the image** (§1.1). A file that fails to load is dropped by the shared image guard, which now also watches `.gtile-img`. |
| Body | `.gtile-body`: the group's `full` name as an H4-class line (Replica 700, 20 px desktop / 18 from 900 px down), its `line` in `small` / `--text-muted`, and `.gtile-foot` pinned with `margin-top: auto` carrying the arrow alone — no label, because the tile is the ask. |
| Hover / focus | Inside `@media (hover: hover)` the image scales 1.071; the body steps `--bg-raised` → `--bg-inset`, the name turns `--action` and the arrow nudges 2 px and turns `--action`. No lift, no shadow. `:focus-visible` draws the 2 px action outline, and `prefers-reduced-motion` drops every transform. |

**The proof strip is three tiles**, led since round 9 by the proof-of-value tile — *from* **30 days** — so the two "30"s in the row are not adjacent. **The optional `prefix`** renders as `.stat-prefix` inside `.stat-value`, before the figure: Replica 400 at `.45em` of the figure, `line-height: 1`, `--text-muted`, `.35em` to its right, so it sits on the figure's own baseline and the tile reads as one fact on one line rather than a figure with a caption over it. It renders as the shared `stat-band`, with two home-only modifiers — `stat-band--home` on the section and `stat-row--home` on the row — so the home strip and the Services strip can differ without either touching the other. Three rules carry the difference, and they are the geometry the strip depends on:

- **Three equal columns**, `repeat(3, minmax(0, 1fr))`, rather than the base row's four-column track: three tiles in a four-column row leave a column standing empty and the band ends where nothing is.
- **Symmetric cell padding** — the base `.stat` has `padding: 1.5rem 1.5rem 0`, and the home cell adds the matching bottom. The dividers between tiles are `border-left` on the cell, so with no bottom padding they stop under the last line of the tallest label instead of running the cell.
- **A band bottom padding that matches its top** (`clamp(2.5rem, 5vw, 4rem)`), so the next section's hairline reads as a divider and not as an underline beneath the labels.

Below 900 px the row goes two-up with the third tile spanning both columns — a cell is a column of the band, not a tile in a grid — and single-file at 480. **The Services band shares all of this** since round 6 — its own selectors (`.services-stats`, `.services-stat-band`) sit beside the `--home` ones in every rule — so the two three-figure strips cannot drift apart, and a change to the base `.stat-row` reaches both.

**An address is a link, never a filled button.** An email address or a website URL renders as an anchor at body size with its glyph and a hairline rule under it — accent on hover and focus-visible on dark, the light band's own ink on light — and takes `padding-block` at ≤ 560 px so it clears the tap-target minimum. This is a **site-wide** rule, not a home-page one: `UI.contactCard` renders the address on all three of its surfaces (the home contact screen, the Services contact section, every product's Contacts tab), and the About band's `softserveinc.com` link follows it too. The reasoning is that a filled button is the site's one *ask* — it says *do this now* — and an address is a destination the reader may or may not want; dressing it as a primary button puts two competing asks on a screen that has exactly one (§18.8, item 1). The filled buttons on the home page stay where a reader is being asked for something: the hero's primary CTA and the contact form's submit.

## 10. The Services page — three screens and contact (rounds 6–7)

Services is built from the home page's components rather than its own; the reasoning is in `PROVENANCE.md` §21 and §23. Since round 7 each screen carries one message.

| Screen | Component | Rule |
|---|---|---|
| S1 — AI depth with Oracle expertise | product hero over `services.jpg` + `stat-band` | Copy in the product hero's own `.product-hero-copy` column (1.25rem rhythm, one 44rem measure for lead and subline). The H1 is a display line — two to four words, the teal accent on its own line — at the home H1's scale (`clamp(2.25rem, 3.9vw, 3.75rem)`), and `min(2rem, 8.6vw)` below 480 px so each half keeps its line down to 320. The lead carries the practice's structure; the platforms render as the product hero's "Runs on" chips; one filled button. The stat band shares the home strip's three-figure geometry (§9). |
| S2 — it's all about ROI | `home-head` + `ladder3 ladder3--four` + footnote | Discovery leads the home page's three steps under the home names. Each step's labelled fact is *Ends with* — the measured result it closes on — not a duration. Steps read at body size (title 1.25rem, body `--fs-body`) in four equal columns above 1100 px and turn vertical below, before a column gets narrower than ~290 px. Teal lands on the eyebrow and the first step's dot. |
| S3 — a fast proof of value, no hassle | `light-band` + `ways` (two panels, no CTAs) | The page's only light band: the promise left; **4–8 weeks** as the band's figure (`clamp(2.75rem, 4.4vw, 4rem)`, one line down to 375) with its note and the link to the case studies — an internal route with the arrow glyph, set inline in a paragraph with a text underline so a wrapped label keeps its arrow after the last word. Under it the two panels, *what you bring* and *what you leave with*, as equal-height peers. |
| Contact | `closing` + `contactSplit` | The head carries the sub; the form column renders no sub of its own, because `forms.contact.sub` is the same sentence. |

**Heading budgets** (measured, uppercase display type): H1 ≤ ~24 characters a line, two lines; H2 ≤ ~30 characters and five words, one line at 1440 and two at most on a phone; the light-band title ≤ ~28 characters. The sentence goes in the lead. Running text on the page takes `text-wrap: pretty`, so no paragraph ends on one word.

Anchors other pages land on — `#how-we-engage` (every product's Jumpstart tab, and the home case-studies rail's *How we measure it*) and `#contact` (header button, footer, Products page) — plus the page's own `#proof-of-value` are asserted by `tools/check-grammar.js`.

## 11. For sellers — the sales-kit request (round 8)

One request, two placements, one component (`FORMS.renderKit` / `mountKit`); the reasoning is in `PROVENANCE.md` §24.

| Placement | Component | Rule |
|---|---|---|
| Product page, **the second tab of the Contacts switch** (round 10b; row 2 of that tab as round 10 first shipped it, and its own *For sellers* tab in rounds 8–9) | `.contact-pane` with `id="kit"`: eyebrow *For sellers* · the body naming the product · the kit form, filling the pane at the same width as the ask form in the other tab | The product is fixed, so there is no select. **The *For sellers* tab is retired** — its only content was this form, and a page that repeats one form under two names is a structure bug — and so is the second row: **two open forms on one screen are the same bug in another shape**, and the second one was below the fold. `#/products/<slug>/sellers` redirects in place to `…/contacts`. Nothing is locked, on the tab bar or here — the kit is requested. |
| `#/sellers` (footer link row + *Get the full kit* in a product kit confirmation; out of the header since 2026-09-17) | the same panel with an eyebrow, the title as the page's H1, and the *Kit for* select (*All offers* first) · then a `panel--cta` — *See the fit in an account?* with a text link that opens the demo modal, nothing preselected | **Unchanged by round 10.** One screen. The URL is the thing a seller pastes into a thread, which is why the all-offers kit is a page and not a modal. |

**The form, in order:** *Kit for* (page only) · *Work email* · consent · **Send me the kit** — the one filled button, after consent as on every other form here — then the eligibility line (small print) and the customer/partner route: **on a product page *Talk to us*, pointing at `…/contacts#talk`** — the other tab of the same switch, reached by an in-page anchor because a same-route `ROUTER.go` would re-render the page and wipe whatever has been typed — and *Request a scoping call* on `#/sellers`.

**States.** A wrong domain keeps the form and puts the route link inside the error (*"Customer or partner? Talk to us instead."*). A confirmation replaces the form inside the same pane — `form-confirm` with its check mark, a title, a body in which the practice address is a link — and closes on the next step: on a product page *Talk to us* (the same `…/contacts#talk` anchor, which opens the ask tab) and *Get the full kit*; on `#/sellers` a quiet *Request another kit* that brings the form back with the email kept. Which confirmation shows depends on what actually happened (`SCHEMA.md` §`salesKit`): the page only says the kit was emailed when an auto-sender is configured.
