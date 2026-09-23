# SS26-THEME.md — the site's brand

Built 2026-09-18: the site re-skinned onto the brand system **softserveinc.com
runs today**. Since 2026-09-18 this is **the site**; the previous near-black
theme is kept, runnable, as an archive. Both live in one tree.

| | **The site** | The archive |
|---|---|---|
| Entry | `site/index.html` | `site/index-legacy.html` |
| Stylesheet | `site/assets/site.css` | `site/assets/site-legacy.css` |
| Copy | `site/data/content.js` + `site/data/content-case.js` (re-casing overlay) | `site/data/content.js` alone |
| Brand marks | `site/assets/img/brand/*.svg` (ink), resolved by `assets/brand.js` | `site/assets/img/*.svg` (white) |
| Artifact | https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri | https://claude.ai/artifact/98wafGUphFSyGSr6ctJiiN (frozen) |

The archive is a frozen snapshot: it is published from before this pass, so its
copy of the shared renderers predates `brand.js`. Leave it that way — it is
internally consistent and re-publishing it would only add drift.

Sources: a forensic measurement of softserveinc.com (200 KB of its CSS, its 96
`:root` tokens, its `--typo-*` scale, computed styles at 1440 and 375) and a
design-translation pass over it. Everything below is measured from the brand or
decided deliberately; nothing is guessed.

## 1. What the brand changed

SoftServe has been redesigned. None of the four things the old theme was built
on survive.

| Aspect | Old SoftServe | Current |
|---|---|---|
| Display face | Montserrat, 900, **UPPERCASE** | **Azurio** — a transitional **serif**, weight **400**, **sentence case** |
| Text face | Open Sans | **Replica LL** (Lineto); its Light cut for body |
| Accent | teal `#35CCBA`, used for accent *and* action | **`#1485c4`** "Lviv blue" = action; **`#f46a4a`** "Austin orange" = accent. Two separate roles |
| Ground | near-black | **white** `#ffffff`, `#edf0f2` for cards, **pure black** as a band and the footer |
| Corners | radii, and `9999px` pills | **octagonal 45° corner cuts** via `clip-path` at 4 / 8 / 12 px; `border-radius: 0` |
| Elevation | glows and shadows | **surface steps** (`#fff → #edf0f2 → #e1e7eb → #d1dae2`); no shadow anywhere |
| Heading weight | 700–900 | **400**; only H4-class titles are 700 |
| Header | 76 px translucent dark bar + strip | **50 px solid white**, no blur, no strip |
| Footer | dark, 900-uppercase heading | `#edf0f2` spacer band over a **pure-black** block, heading in the display serif at 32 px |
| Body leading | 1.6 | **1.2**, with **+0.5 px** tracking |
| Measure | 107 rem capped at 1600 px | **1400 px** content, gutters 96 / 40 / 16 |
| Band rhythm | symmetric | **asymmetric 96 / 128** (bottom = 1.333 × top) |

`#35CCBA` does not appear anywhere in SoftServe's current token set or in 200 KB
of its CSS. The teal is gone, not merely de-emphasised.

## 2. Type

The five licensed faces are self-hosted in `site/assets/fonts/` (740 KB) and
ship with the artifact. Alex confirmed on 2026-09-18 that a SoftServe employee
building a SoftServe property may use them; do not copy them into a non-SoftServe
project.

```
Azurio-Regular.woff       400   display
Azurio-Semibold.woff      700   declared, unused (display is 400 everywhere)
ReplicaLLWeb-Light.woff2  300   body and lead
ReplicaLL-Regular.ttf     400   H2-H4, buttons, tags, nav, small
ReplicaLL-Bold.ttf        700   H4-class titles
```

**One `Replica` family with Light at weight 300**, not SoftServe's two-family
split (`Replica` 400/700 + `Replica-light` 400) — that split is a Tailwind
artefact on their site, where `--font-sans` names a family no `@font-face`
declares. With one family, `font-weight` is the only switch and `<strong>` in
Light body text resolves to the real Bold instead of a synthesised one. `body`
carries `font-synthesis: none`.

Fallbacks are **metric-matched system faces**, not a webfont service: `Azurio
Fallback` = `local("Georgia")` at `size-adjust: 104%` (Georgia sets 3.8 % narrower
than Azurio on a 41-character probe at 110 px), `Replica Fallback` =
`local("Helvetica Neue"), local("Arial")` at `99%`. No `fonts.googleapis.com`
request; the tier only shows during a first paint or if a file fails. Of the free
faces compared against the real ones, **Literata** (778 px vs Azurio's 784 px on
a 100 px canvas probe, identical x/cap ratio 0.70) and **Archivo** (765 px vs
Replica's 750 px) were the metric matches, and are the choice if a hosted
fallback is ever wanted.

The brand's measured scale applies literally — no size or tracking corrections,
because the real faces render:

| Role | Desktop | Mobile 375 | Face / weight / leading / tracking |
|---|---|---|---|
| H1 (`.products-head .h1`, `.services-title`) | 96 px | 48 px | Azurio 400 / 1.1 / 0 |
| Product name (`.product-title`) | 64 px | 32 px | Azurio 400 / 1.05 / 0 |
| Home H1 (`.home-title`) | **64 px** | 32 px | Azurio 400 — held at the 64 px step, see §7 |
| H2 | 48 px | 32 px | Replica 400 / 1.2 / 0 |
| H3 | 40 px | 28 px | Replica 400 / 1.2 / 0 |
| H4 and H4-class titles | 24 px | 20 px | Replica **700** / 1.2 / 0 |
| Lead | 24 px | 18 px | Replica 300 / 1.2 / +0.5 px |
| Body | 20 px | 18 px | Replica 300 / 1.2 / +0.5 px |
| Small | 16 px | 14 px | Replica 400 / 1.2 / 0 |
| Tag, button-sm, eyebrow | 12 px | 12 px | Replica 400 / 1.2 / **+.06em, UPPERCASE** |
| Button | 16 px | 16 px | Replica 400 / 1.2 / **+.06em, UPPERCASE** |
| Arrow link | 18 px | 18 px | Replica 400 / 1.2 / 0, sentence case |
| Footer heading | 32 px | 32 px | Azurio 400 / 1.1 / 0 |

**Uppercase is now a micro-type device only** — 12–16 px at +.06em on tags,
buttons and kickers. It never appears in display type.

`.product-title`'s clamp slope is fitted to the hero's **copy column**, not the
viewport: `clamp(2rem, -0.55rem + 5.05vw, 4rem)`. At 1024 that column is 435 px,
where the longest name ("Large docs processing and review") needs 43 px to break
in two lines rather than three. All seven names hold 1–2 lines at 1024, 1280 and
1440.

Running prose keeps the brand's 1.2 leading but a shorter measure
(`.body-text { max-width: 40rem }`): SoftServe measures 20/24 on two- and
three-line strings, and this site carries 5–8-line paragraphs.

## 3. Colour

```
ground        #ffffff   card/band #edf0f2   well #e1e7eb   fact chip #bdcbd7
dark band     #000000   panel on it #1a1a1a
ink           #000000 strong · #26292b body · #4c5156 secondary and labels
lines         #bdcbd7 control · #e1e7eb hairline · #d1dae2 panel rule
action        #1485c4 · hover #459fdd · pressed #0e5e8b · tint #c1dff4
accent        #f46a4a · tint #ffcec0
secondary btn #d1dae2 · hover #e1e7eb · pressed #bdcbd7
footer ink    #e8e8e8 · footer footnote #97a2ac
```

**The rule, in three lines.**

1. **Blue is what you act on or what is selected**: buttons, links, the active
   tab and nav item, the selected filter, focus rings, the active step. Its tint
   `#c1dff4` is the selected surface and the only decorative tint (icon wells,
   medallions, badges).
2. **Orange is the accent line of a hero H1, once per page.** Its tint is the
   one fill it may make (`.chip--accent`). Never on a control, never as text
   below 24 px. A product name gets none (`.product-title .accent { color: inherit }`).
3. **Facts are neutral.** Figures, status chips, fact chips, rules and dots are
   black and the cool greys.

`var(--accent)` appears in exactly **two** rules in `site.css`; the checker
fails if it spreads past three.

`--text-dim` is `#4c5156` (neutral-700), not the brand's neutral-600 `#717a81`:
measured, `#717a81` is 4.37:1 on white and 3.50:1 on the `#e1e7eb` well, so it
fails AA at the 12 px label sizes this theme uses it for. This is the one place
the theme deliberately leaves the brand token.

## 4. Shape

`border-radius: 0` everywhere but inputs (2 px) and true dots (50 %). The
octagonal cut is the container language: **4 px** on anything pressable or
tag-like, **8 px** on cards and panels, **12 px** on the big plates.

`var()` inside a custom property is substituted once on `:root`, so the polygon
cannot be a token. It is one grouped declaration with `--cut` set per component.
Static containers carry the clip directly. Anything **pressable**, or that opens
a tooltip, puts the shape and fill on `::before` and the focus ring on `::after`
— a `clip-path` on the element itself would cut off its own outline and its
`.tip::after` tooltip. Those components need `isolation: isolate`, or the
`z-index: -1` pseudo drops behind the parent and the control paints transparent.

Every pill is gone: buttons and chips are cut rectangles, the icon circle is a
48 px cut square well, social links are bare 16 px glyphs, the menu toggle is a
bare 50 × 50 button.

## 5. Ground plan — one dark band per page

The old rule was *at most one light band per page*. It inverts: **at most one
dark band**, and the footer's black block does not count.

| Page | The dark band |
|---|---|
| `#/` | **`#about`** (S6, "who builds it") — the screen that used to be the one light band |
| `#/services` | **`.services-page-proof`** (the proof-of-value screen) |
| `#/products`, product pages, `#/sellers` | none — the photo heroes carry the weight |

Everything else is `#ffffff`, with `#edf0f2` for cards and the pre-footer band.
**A photograph is not a dark band.** The home page's two photographic panels (S2, round
11) and its case cards' photo bands (S5) sit on black and `#1a1a1a` grounds, but those
grounds only show if a photograph fails to load; what the reader sees is a photograph
under a scrim or a veil, inside a panel or a card with its own cut — not a full-width
inverted screen. They do not count, and `#about` stays the home page's one dark band.
`.light-band` / `-media` / `-copy` now paint the dark band, which makes the class
name a lie; it is kept rather than renamed so the renderers stay shared between
the two themes, with a comment on the rule.

**Heroes.** The home hero carries no photograph and no glow: a cool wash from the
brand's own gradient family (`radial-gradient(70% 90% at 88% 12%, #c1dff4 …)`
over `#f5f7f9 → #ffffff`), with the built-on stack as its graphic. The product
and services heroes keep their photograph and **invert the veil to white** from
the copy side; type goes black. The teal radial third layer is deleted, not
recoloured — this system has no glow.

## 6. Motion

`--t-fast .15s` for colour and border, `--t-base .2s` for buttons, chips, tabs
and links, `--t-slow .3s` for the arrow nudge and card surfaces, all on
`cubic-bezier(.4,0,.2,1)`. Hover is a **2 px arrow nudge** or a **surface step**,
never a lift: cards move `#edf0f2 → #e1e7eb` instead of translating, and a
photograph scales to 1.071 inside `@media (hover: hover)` — the tile image, and since
round 11 the home page's S2 panel photographs (with a 2 px arrow nudge) and its case
cards' band photographs (whose white body steps to `#edf0f2`), on focus-within as well
as hover; `prefers-reduced-motion` drops the scale. Every
`:active { transform: scale(.97) }` is gone — pressed is a colour. `--glow-card`,
`--glow-frame`, `.hero-glow` and the `.stat-row::before` scrim are all retired.

## 7. Known and open

- **The home H1 does not fit the brand's 96 px step.** "Enterprise AI agents and
  workflows. Built on Oracle." is eight words and runs to four lines at 96 px, so
  `.home-title` is held at the 64 px step, where it runs three. A 2–4-word re-cut
  (the brand's own hero is "Technology Elevated") would let it take the full size.
  **Alex's call.**
- **The primary button's label is 4.05:1**, white on `#1485c4` at 16 px — AA-large
  passes, AA-normal wants 4.5. This is SoftServe's own token pairing and is kept
  for fidelity. The one-line fix, if Alex wants AA: `--action: #0e5e8b`. Small
  white-on-blue type already takes that darker step (the skip link, the active
  stepper number), and inline links inside panels take it too.
- **The three `site/demo/*` walkthroughs are still dark-themed.** They are out of
  scope for this pass and have their own CSS and their own sessions. A near-black
  demo now opens from a white page. Next round's item.
- **The Internal review panel** styles itself (`assets/review.js`) and is
  off-brand amber. It comes off before launch anyway (START-HERE §8).
- **No Cyrillic.** Azurio and Replica have none; SoftServe forces Roboto under
  `body.uk-ua`. This site is English-only, so no fallback is declared. If a
  UA/RU variant is ever added, copy their rule and self-host Roboto — do not let
  Georgia or Arial catch Cyrillic by accident.

## 8. Working on it

- **Run:** `preview_start {name: "oracle-site"}`, then
  `http://127.0.0.1:8765/`. The archive is `/index-legacy.html` on the same
  server.
- **Check:** `node tools/check-grammar.js`. Its SS26 block asserts the rules
  above — no teal, no weight 600/800/900, no `--r-pill`/`--r-lg`/`--r-md`, orange
  spent at most three times, the five font files present and declared, the
  overlay loaded after `content.js`, `data-theme="light"`, a white `theme-color`,
  no webfont service, and every re-casing still matching `content.js`.
- **Copy:** `content.js` is shared and must not change. Strings stored in
  capitals are re-cased by `data/content-case.js`, which patches 45 paths and warns
  (rather than silently overwriting) if a value has moved. The problem/solution
  titles land in `.eyebrow`, which uppercases them by design — their stored
  values are sentence case and that is correct.
- **Publish:** strip the nine skeleton lines from `index.html` into
  `.work/publish/index.html` (its `<html>` line is
  `<html lang="en" data-theme="light" data-brand="ss26">`), then the Artifact tool with
  `url: https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri`, `root: site`, and a
  `files` map. The fonts need an explicit `contentType` (`font/woff`,
  `font/woff2`, `font/ttf`). Publish only what the SS26 page references — nine
  legacy files and `assets/site.css` are deliberately not on this artifact
  (`action: list_files` should show 101 entries).
- **QA:** the pane's screenshots are unreliable when the Browser pane is hidden;
  a JS probe that walks every text leaf for contrast, checks horizontal overflow,
  resolved font families and broken images is faster and stricter. It must treat
  `::before` as the background for the shaped components, or every clipped button
  reads as a false positive. Swept clean at 1440, 1280, 1024, 768, 375 and 320.
