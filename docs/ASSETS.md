# ASSETS.md — step frames, industry images, group tiles, headshot, customer logos

What the E2 stepper, the E2 industry tabs, the home page's product-group tiles,
the E5 contact card and the named success stories render, where each file came
from, what was done to it, and what the licensing position is.

This file is **not served** — the site root is `site/`. It is the operator record
that `site/assets/img/manifest-edits.json` deliberately does not carry, under the
same ship gate as `heroes.json` (PROVENANCE §8 / §11.1): nothing served from the
public root may name an internal deck, a customer, or an internal path.

Manifest: `site/assets/img/manifest-edits.json`
Build scripts (scratch, rerunnable): `steps_shots.py`, `steps_illus.py`,
`industries.py`, `manifest.py`, `grade.py` in the assets working folder.

---

## 1. Step frames — `assets/img/steps/`

Every product ships **four** steps: intake → processing → review/decision →
delivery. Frames are 16:10. Screenshots are 1600 × 1000 JPEG (q86, ≤ 300 KB);
illustrations are SVG at a 1600 × 1000 viewBox (≈ 3 KB each).

**The legibility rule, for both kinds.** The frame renders about **454 CSS px
wide** on the Overview tab. A frame whose type does not survive that reduction is
not a picture of the product doing the step — it is a decorative placeholder, and
it reads as one.

- Illustrations: `rendered = font-size × (454 / viewBox width)` must be **≥ 12**.
  At a 1600 viewBox that means 44 px type or larger, which is why the scenes
  carry few, large labels rather than many small ones.
- Screenshots: `rendered = source px × (454 / crop width in source px)`, same
  floor. A full application capture cannot clear it — crop to the one region the
  step is about, and keep every heading whole inside the crop.

### Product frames from the interactive walkthroughs (12 frames + 3 posters, 3 products)

All four `large-document-extraction-*.jpg` frames are captures of the site's own
interactive walkthrough (`site/demo/large-document-extraction/`, 2026-09-15),
not of the delivered product. The walkthrough keeps the product's layout and
data model — upload → documents → split-view review with a citation on every
value, confidence and business-rule validators → rate-card export — on a
**synthetic** supplier agreement (`MSA-2026-014`, "Meridian Facility Services
Ltd", invented sites NGC / RDC, invented rates and clauses), so the frames carry
no customer, no real counterparty and no real figure. That is the standard any
future product screenshot has to meet before it ships.

| File | Shows | Capture state |
|---|---|---|
| `large-document-extraction-1.jpg` | Upload: the pipeline stages — classify, route pages, extract, score and cite, validate | Upload screen mid-processing |
| `large-document-extraction-2.jpg` | Extract: a group expanded in the columns its schema needs — rows, rate basis, section, confidence, status | Review tab, Routine cleaning open |
| `large-document-extraction-3.jpg` | Score, cite, validate: the flagged row's details — evidence, confidence, the validator's rule and its suggested fix | Review tab, Volume discounts open, flagged row selected |
| `large-document-extraction-4.jpg` | Review and export: the flat table against the reference template, XLSX / CSV, and the send to the target system | Export tab after approval |

**Capture.** `tools/capture-demo-frames.mjs` drives the walkthrough in headless
Chrome over the DevTools protocol (`MODE=frames DPR=2`, the page opened with
`?tour=off&ui=clean` — no welcome card, no guide, no guide toggle) through the
same clicks a viewer makes, at 1600 × 1000 CSS px and device scale 2. Each frame
is then a **640 × 400 CSS-px crop of the region the step is about** (1280 × 800
device px), Lanczos to 1600 × 1000, light unsharp, progressive JPEG q≈86 — the
crop, not the full screen, is what keeps 13–14 px UI text near 10 px at the
frame's 454 px render width, the same band the earlier video-derived frames sat
in. The crop offsets used: `-1` (260, 150) · `-2` (880, 350, 700 × 438) · `-3`
(880, 560, 700 × 438) · `-4` (880, 130, 700 × 438). `.step-frame` adds a 1 px
inset rim in CSS so every frame, raster or vector, is bounded the same way.

**Poster.** `assets/img/posters/large-document-extraction.jpg`, 1600 × 900: the
full review screen with the first group open and no details panel, set as
`videoPoster` so the pending video frame shows a still of the product instead of
the plate. It is a distinct capture from every step frame, as VISUAL-GRAMMAR §1
requires.

**Re-captured 2026-09-16** after the generalisation round — two document types, schema-specific columns per group, four validator kinds (PROVENANCE §16.4) — with the same crops and the same capture states.

**Workforce optimization (2026-09-16).** All four `workforce-optimization-*.jpg`
frames and `posters/workforce-optimization.jpg` are captures of the second
walkthrough (`site/demo/workforce-optimization/`, PROVENANCE §19), not of the
delivered product. The walkthrough keeps the product's flow and information
model — run optimization (region · period · XLSX) → schematic map with zone and
technician details → current-vs-optimized compare → weekly schedule in zone and
technician view with before/after KPIs → accept / reject / comment →
re-optimize with feedback → export in the field-service import format — on a
**fictional metro** ("Harborview": twelve invented districts HV-01…HV-12 with
invented postcodes, eighteen synthetic technician ids T-1041…T-1058, no names),
so the frames carry no customer geography, no real zone-naming convention, no
real resource id and no figure outside the cleared band (fleet productivity
4.54 → 4.75 jobs per technician per day, +4.5%). That closes the rejection
recorded below.

| File | Shows | Capture state |
|---|---|---|
| `workforce-optimization-1.jpg` | Load the period's data: the Run optimization modal — sources (manual XLSX · field-service system connected · booking, inventory, HR/WFM, forecast, BI configured), region, period, the attached file and its seven sheets | Run modal, file chosen, before Optimize |
| `workforce-optimization-2.jpg` | Set the rules: the Optimization settings drawer — planning mode and capacity, objectives and weights (productivity 40 · waiting time 35 · workload balance 25) and the first hard rule | Settings drawer over the optimized plan |
| `workforce-optimization-3.jpg` | Solve the plan: the solver stages — validate the input (with its warning), travel matrix, rules, GPU solve, KPIs | Run modal 2.3 s into the run |
| `workforce-optimization-4.jpg` | Review, approve, measure: the value readout under the toolbar — the first three KPI tiles, each a big coloured delta over its before → after line (jobs per technician per day +4.5%, capacity used +3 pts, avg wait −0.6 d) | Final plan (v2, decisions accepted), KPI band, narrow viewport |

**Capture.** The same tool in `MODE=script` with `tools/capture-wfo-frames.json`,
`DPR=2` (`tools/capture-wfo-tour.json` drives the whole guided tour by real
clicks and is the tour's regression test — it reports console exceptions).
`-1`, `-2` and `-3` are taken with the page opened at `?tour=off&ui=clean&state=start`
(the scenario runs the optimization itself); `-4` and the poster with
`&state=final` — plan v2 with the decisions accepted, so the band reads the
cleared +4.5% rather than plan v1's +4.8% — and only the two last shots of the
scenario are kept from those runs. Two viewports:

    MODE=script STEPS=tools/capture-wfo-frames.json DPR=2 W=1600 H=1000 \
      node tools/capture-demo-frames.mjs \
      "file://<repo>/site/demo/workforce-optimization/index.html?tour=off&ui=clean&state=start" /tmp/wfo1600
    MODE=script STEPS=tools/capture-wfo-frames.json DPR=2 W=1184 H=1000 \
      node tools/capture-demo-frames.mjs "<same URL>" /tmp/wfo1184

`-1`, `-2`, `-3` and the poster come from 1600 × 1000 runs; `-4` comes from
the 1184 × 1000 run, because three of the band's five tiles fit a 640 px crop
only in the narrow window between 1181 px (below it the band reflows to three
columns 349 px wide) and ~1185 px (above it five 1/5-width tiles are again too
wide). At 1184 px the three span 639 px and fill the crop edge to edge.

Crops follow the rule above and were converted with `sips` (crop → resample →
JPEG) on a Mac without ffmpeg; no unsharp pass — e.g. for `-1`

    sips -c 800 1280 --cropOffset 522 960 frame-1.png --out c.png   # device px, Y then X
    sips -z 1000 1600 c.png --out b.png
    sips -s format jpeg -s formatOptions 86 b.png --out workforce-optimization-1.jpg

Offsets in CSS px (device px are twice these, at `DPR=2`): `-1` (480, 261,
640 × 400) · `-2` (960, 176, 640 × 400) · `-3` (480, 298, 640 × 400) · `-4`
(87.5, 130, 640 × 400, at the 1184 px viewport). The poster is a 1600 × 900
crop of the 1600 × 1000 dashboard taken from y = 66 rather than from the very
top: dropping the topbar buys the whole schedule header, so the poster carries
the KPI band, the map with every zone, the "What the solver changed" list and
the Weekly schedule header, with no details panel and the toast hidden. It is
JPEG q82 (q86 puts it at 314 KB, over the 300 KB ceiling); the four step
frames are q86. **`sips` gotcha:** `--cropOffset 0 0` means *centred*, not
top-left — any other value is an absolute top-left origin, so a true top crop
needs a non-zero offset on one axis.

**Superseded.** The two earlier real-UI frames (`-2`, `-3`, crops of the
customer-demo recording on the synthetic `SYN-GHA-RL-001` ground-handling
contract, with the per-channel darkening curve) and the two illustrations at
`-1` and `-4` are gone from disk; the walkthrough frames replace all four so the
product's stepper reads as one system.

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

**Cross-system ERP Q&A (2026-09-16, re-shot for round 2 and again for round 3, both 2026-09-17).** All four
`cross-system-erp-qa-*.jpg` frames and `posters/cross-system-erp-qa.jpg` are
captures of the third walkthrough (`site/demo/cross-system-erp-qa/`,
PROVENANCE §22). There is no delivered product behind this pack, so the "real
product" the frames have to be faithful to is the **platform** — Oracle
Autonomous AI Lakehouse (Data Studio) and Oracle AI Data Platform (Agent Hub),
replicated from Oracle's own product videos and doc figures, plus a small
Redwood app for the decisions. The world is synthetic throughout: a fictional
multi-entity group, invented customer names (Halden Tooling Group, Kestrel
Components, Bramley Logistics …), invented ids on each system's real key shapes
(JDE `F4211 · SDDOCO 6421007`, Fusion `DOO_FULFILL_LINES_ALL · FULFILL_LINE_ID
300000048210650`, NetSuite `transactionLine`), invented values, and a band that
carries **no** time-to-answer, cost, saving or delivery-time figure — the pack
has no cleared outcome number, and every money figure on screen is the AI's own
estimate on invented order lines, labelled as such. No customer mark, no Oracle
logo file, no currency symbol beyond the USD prefix the product itself prints.

The five images were re-shot on 2026-09-17 for round 2 — the walkthrough's
domain changed from a finance close to revenue at risk across systems — and
**again the same day for round 3**, because the interface-fidelity pass
(PROVENANCE §22.21–22.23) changed every screen they show: the Data Studio nav,
top bar and Live Feed page, the Agent Hub home and its bar, the generated
dashboard's chrome and the Decisions app's whole page-title region. Same file
names, same mapping to the **step copy**, not to the tour order:

| File | Shows | Capture state |
|---|---|---|
| `cross-system-erp-qa-1.jpg` | Connect the applications: Data Studio › Data Load › Live Feed, "Sources feeding the lakehouse" — all five source cards in Oracle's Data Load four-card idiom (outline icon, plain title, the system behind it, what it holds, then the feed, the freshness and the object count on one muted line), over the dark-teal header of the load job that rebuilds `GOLD.CROSS_SYSTEM_COMMERCIAL_MODEL` | `state=analysed`, Live Feed, **896 px** viewport |
| `cross-system-erp-qa-2.jpg` | Shape one decision domain: the six-tile band "per system → across systems" — late lines known 61 + 49 + 28 → 138, lines with an account tier 0 → 138, lines with a cause attributed 0 → 138, lines fixable from stock elsewhere 0 → 44, revenue at risk — → USD 4.18 M, tier-A exposure — → 9 accounts · USD 2.36 M — under the Decisions page's own subtitle, "What the AI proposes, and what you decide about each account." | `state=analysed`, Decisions, 676 px viewport |
| `cross-system-erp-qa-3.jpg` | Guard it in the data layer: the **dashboard the AI generated**, seen by the regional analyst — "Built by the AI · Tue 6 Oct 2026 · 09:58", "NG-NA only · Regional operations analyst NA · 57 lines", and the SLA-penalties tile masked to dots with "Contract penalty terms are hidden for this role" | `state=final`, `role=analyst`, `panel=dashboard`, Agent Hub › Insights, 868 px viewport |
| `cross-system-erp-qa-4.jpg` | Ask in plain language: the Agent Hub with the Ask Oracle box (Oracle's white outlined ellipse, mic, paperclip, agent picker), the typed question "Which open orders are at risk this week, and which of our best accounts are exposed?" and the run card mid-run — the order agent **In progress** on a grey row wash with a spinner in the Duration lane and its four sub-steps on the dotted rail, the identity, cause and impact agents waiting below with no status label, as Oracle renders a step that has not run | `state=start`, **0.9 s** into the run, Agent Hub, **880 px** viewport |

**Capture.** `tools/capture-demo-frames.mjs` in `MODE=script` with
`tools/capture-erpqa-frames.json`, `DPR=2`, the page opened at
`?tour=off&ui=clean&state=start`
(`tools/capture-erpqa-tour.json` drives the whole guided tour by real clicks and
is the tour's regression test — `LOGS: none` is the gate). The scenario walks
every state through `window.DEMO` — `prime('analysed'|'final'|'start')`,
`setApp`, `setDsScreen`, `setRwTab`, `setWbPanel`, `setRole`, `ask` — and ends
by clicking the saved question so the run card is caught live, so one scenario
file produces all five shots and each **viewport** run keeps only the shot it
was sized for:

    MODE=script STEPS=tools/capture-erpqa-frames.json DPR=2 W=896 H=1000 \
      node tools/capture-demo-frames.mjs \
      "file://<repo>/site/demo/cross-system-erp-qa/index.html?tour=off&ui=clean&state=start" /tmp/erp896
    # …the same command with W=676 H=1000, W=868 H=1000, W=880 H=1000 and W=1440 H=1100

Five viewports, because each surface is exactly 640 CSS px wide at a different
one, and **round 3 moved three of them** (the Data Studio nav is 216 px while
the Data Load sub-tree is open, the Workbench nav is 180 px under 1120, and the
Ask Oracle box is capped at Oracle's measured 729 px rather than 760):
`-1` from the **896** run (the Data Studio page is `W − 216` and the cards sit
inside a 20 px gutter, so `.src-cards` is `W − 256` = 640 and reflows to 3 + 2
under 1120 px); `-2` from the 676 run (the Decisions app has no left nav, so
its band is `W − 36`, and under 1120 px it reflows to 3 × 2 — all six tiles at
the size three of six would have at 1240 px); `-3` from the 868 run (the
generated-dashboard card is `W − 228` = 640); `-4` from the **880** run
(the Hub's main column is `W − 240`, so the Ask Oracle box and the run card —
capped at 640 — are both exactly 640 and sit one above the other); the poster
from the 1440 run at **H = 1100**, where `.an-cols` is two columns, the causes
chart sits beside the four actions, and the taller viewport leaves the 664 px
window room inside the shot.

Crop offsets in CSS px (device px are twice these, at `DPR=2`): `-1`
(236, 150, 640 × 400) · `-2` (18, 177) · `-3` (204, 139) · `-4` (210, 260) ·
poster (233, 341, 1180 × 664). Every edge is placed on a real boundary —
`-1` starts in the white under the *Live Feed* page title and ends in the white
padding under the job accordion's dark-teal header; `-2` starts on the
*Recommendations* title's bottom edge and ends exactly on the tab strip's top;
`-3` starts 3 px under the *Insights* subtitle and ends inside the first chart
card's top padding, under the four tiles; `-4` starts in the white between the
greeting and the Ask Oracle box and ends exactly on the boundary below the
fourth agent's row, so nothing in that frame is half a line; the poster starts
in the gap between the band head and the tiles and ends 4 px under the actions
box. Converted with `sips` (crop → resample → progressive JPEG q86) on a Mac
without ffmpeg; 157–244 KB each, inside the 300 KB ceiling. **`sips` gotcha,
corrected 2026-09-17:** `--cropOffset` takes **Y then X** and is the crop's
**top-left origin**, not an offset from a centred crop — the round-2 note that
`0 0` means *centred* is wrong and cost a wasted pass. Verified empirically:
`sips -c 800 1280 --cropOffset 300 472 frame-1.png` yields exactly the window
whose top-left is (472, 300).

**Why the five source cards needed a CSS fix first.** Under 1120 px the cards
were pinned to a fixed 128 px height so the step-1 hint always had room under
them, but the content does not fit that height: the flex children were squeezed
and the second line of each card's description was cut *through* its glyphs —
visible at the 1024 px QA viewport too, not only in the crop. **Round 3 re-cut
the same trade-off**, because the cards were re-skinned into Oracle's Data Load
four-card idiom and the QA viewport dropped to 1024 × **768**: the page subtitle
is hidden under 1120 px, the feed line switches to each pipeline's short name
(`GoldenGate CDC`, `SuiteAnalytics Connect · 30 min`) so the freshness and the
object count still fit on two lines, and the cards are **134 px** — measured, not
guessed: `#src-cards` then ends at y 482 and the step-1 callout (252 px tall)
sits at 496–748 inside a 768 px viewport, which is what the tour's own
"no callout covers the element its copy names" assertion checks. The card's own
parts keep their size (`flex: none`) and the description
is capped at two whole lines with a fade into the card colour where there is
more to read. Nothing is sliced at any viewport; the fade is invisible on a line
that ends early (2026-09-17, leg E3).

**Poster.** `assets/img/posters/cross-system-erp-qa.jpg`, 1600 × 900: a
1180 × 664 CSS-px crop at `DPR=2` (offset (233, 341), resampled from 2360 × 1328,
q86, 244 KB) of the analysis view at `state=final` in Dana's own role — the six
tiles after her override (134 lines, USD 3.77 M, eight tier-A accounts), the
"Why the lines are late" chart with its four causes, and the four recommended
actions with their owners, values and the line that says each one is a task and
nothing is written back to an ERP. The window is chosen so both boxes of
`.an-cols` are whole: it starts on the band's tiles and ends four pixels under
the actions box. It is wired as `videoPoster` but **nothing renders it yet**:
the product has `video: false`, so the hero has no media frame (`docs/CONFIG.md`
§3). It is captured now so that turning the frame on later is a one-word change.

**Superseded.** Round 1's four frames — the Data Studio catalog with five
mounted catalogs, the Mapping review health band, and the same answer under two
roles — and its 800 × 450 poster are gone from disk; so are round 2's. The
**round-3** captures replace all five at the same file names, so `content.js`
and `config.js` needed no change in either round. Working shots:
`.work/erpqa-qa/r4-f{896,676,868,880,1440}/`.

### Designed step illustrations (16 frames, 4 products)

`account-insights-1..4`, `case-evidence-collection-1..4`,
`plan-vs-actual-investigation-1..4`, `business-metrics-qa-1..4`. Large docs,
Workforce optimization and Cross-system ERP Q&A are the three products whose
frames are captures (above); the four `cross-system-erp-qa-*.svg` illustrations
were deleted from disk on 2026-09-16 when the captures replaced them.

Drawn, not sourced. One grammar across all of them: a white ground with a
`#C1DFF4` radial lift, 2–3 px strokes (≈ 1.5 px on screen at the rendered size),
**`#1485C4` for the active path** and `#BDCBD7` for structure, labels in
`#4C5156`, one blue eyebrow of **at most three words** per frame and short
uppercase labels underneath at `.06em`. (The sixteen SVG frames were drawn for
the near-black theme and recoloured into this grammar on 2026-09-18; the
checker now fails any SVG under `site/assets/img/` that carries the retired
teal or the old near-black palette.) No emoji, no filled icons, no sentences inside the artwork — the step
title and caption live in the page, not in the picture.

Scene vocabulary, so the same step reads the same way on every product:
fan-in (intake), graph / dossier / semantic layers / bars / weighted rules /
constraint solve (processing), three decision rows (review), fan-out and answer
card (delivery). The three answer cards carry a different inner glyph — bars,
merge, trend — so a reader moving between products can tell them apart.

Labels are 44–56 px in the 1600 viewBox (12.5–15.9 CSS px in the frame) and the
eyebrow is 50 px. The scenes are laid out around that type: three or four
labelled nodes, wide cards, generous gaps. Where a label has to cross artwork —
the account-map frame — it sits on a soft `#10161A` plate rather than shrinking.

---

## 2. Industry images — `assets/img/industries/`

One file per key in the fixed set of sixteen (VISUAL-GRAMMAR §5), 1200 × 750
JPEG, q86, ≤ 180 KB.

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

---

## 2b. Product-group tiles — `assets/img/groups/` (round 9, 2026-09-22)

One image per product group, for the six tiles on the home page's S3
(`facets.categories[].image`; `VISUAL-GRAMMAR.md` §9). All six are **960 × 600
(16:10)**; the JPGs are quality 80 (`sips -s formatOptions 80`), the SVGs are
hand-written and self-contained. **The legibility rule of §1 applies here too, at a
harder size:** a group tile renders about 240 CSS px wide in the 3 × 2 grid, so the
frame has to read as *a piece of software* at that width — a clear split view or a
map beats a dialog, and a single-pane screen of running text reads as nothing at
all.

| File | Source | Crop from the source (x, y, w × h) | Bytes |
|---|---|---|---|
| `knowledge-analytics.jpg` | `steps/cross-system-erp-qa-1.jpg` (1600 × 1000) | none — already 16:10; resampled to 960 | 98,594 |
| `deep-research.svg` | drawn | — | 2,707 |
| `documents.jpg` | `posters/large-document-extraction.jpg` (1600 × 900) | 470, 275, 1000 × 625 → 960 | 114,514 |
| `transactions.svg` | drawn | — | 3,077 |
| `forecasting-optimization.jpg` | `posters/workforce-optimization.jpg` (1600 × 900) | 0, 140, 1120 × 700 → 960 | 111,267 |
| `video-image.svg` | drawn | — | 2,122 |

Rows are in `facets.categories` order. Every JPG is ≤ 160 KB and every SVG ≤ 12 KB.

**Why these three frames.** `documents.jpg` is the only true split view in the set —
the contract page with its rate table and one amber-flagged row beside the review
panel with its dark table header and confidence bars — and both panes survive the
reduction. `forecasting-optimization.jpg` is a map, which beats everything else at
tile size, cropped from x = 0 so the dark app rail is in and the right-hand changes
rail is out (an earlier variant clipped it and left an orphaned "10" in the
corner). `knowledge-analytics.jpg` is the "sources feeding the lakehouse" screen: a
3 + 2 card grid over a dark teal object bar, the crispest structure in the ERP set
at 240 px, carrying no figures at all.

**Both crops are also clearance decisions.** The document crop starts at y = 275
because at y = 250 the metadata row still showed the walkthrough's synthetic
counterparty name. Rejected outright: modal dialogs over a blurred map, a frame
carrying the Oracle mark, and two frames whose USD figures sat exactly where the eye
lands. No customer name, no real geography and no uncleared figure is in any
shipped file — the two JPGs that do show numbers show demo data already published
on their product pages, illegible at tile size.

**The three placeholders are one design**, so a group with no walkthrough does not
advertise its absence: an app-window wireframe in theme colours (`#edf0f2` ground,
a white window with 4 px corner cuts and a 1.5 px `#bdcbd7` chrome, one `#c1dff4`
block for "selected" per SS26 §3, content blocks in `#e1e7eb` / `#d1dae2`), no text
and no logo, with the group's own line icon drawn large at 25 % group opacity in
`#4c5156` right of centre. Only the content area differs — a media block with a
scrubber and thumbnails (video), a query field over result rows (research), a
record card over a three-step flow with a check on the last (transactions) — which
is enough that three adjacent tiles do not read as duplicates.

**Tool note — `sips --cropOffset`.** On this Mac (sips-316) `sips -c <h> <w>
--cropOffset <y> <x>` takes the crop's **top-left origin in pixels from the image's
top-left**, not a shift from the centre — except that exactly `0 0` is read as
"unset" and falls back to a centred crop (proven by hash), and negative offsets
render black. So use an origin with at least one non-zero component, then
`sips --resampleWidth 960 -s format jpeg -s formatOptions 80`.

---

## 3. Headshot — `assets/img/people/karsten-tramborg.jpg`

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
| `favicon.svg` | the wordmark's first glyph (the S, path index 0) in white, centred on a Lviv-blue `#1485C4` octagon with 26-unit corner cuts. Inlined as a data URI in `index.html`. The old teal spark is retired with the teal |

On the one black ground in this theme — the footer and the `#about` band — the ink
marks invert back with `filter: invert(1)` rather than carrying a second file
(`.built-with img`, `.about-partner-mark`).

`site/assets/fonts/` holds the five licensed faces, taken from SoftServe's own
`/_next/static/media/` and renamed: `Azurio-Regular.woff`,
`Azurio-Semibold.woff`, `ReplicaLLWeb-Light.woff2`, `ReplicaLL-Regular.ttf`,
`ReplicaLL-Bold.ttf` (740 KB total). They send no CORS headers at source, so they
cannot be hotlinked — self-hosting is the only route. Alex confirmed on
2026-09-18 that a SoftServe employee building a SoftServe property may use them;
do not copy them into a non-SoftServe project.
