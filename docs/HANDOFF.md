# Handoff — Oracle AI mini-site (repo-only session)

Written 2026-09-16 by the build session on Alex's Mac. Everything a new session needs is in this repository; nothing below requires the laptop. **Read `docs/START-HERE.md` first**: the overview, the brief, the rules, how a round runs, and the learnings. This file holds the exact procedures (§4) and the standing rules in full (§3). Then read `README.md`, `docs/CONFIG.md`, `docs/SCHEMA.md`, `docs/VISUAL-GRAMMAR.md` and `docs/PROVENANCE.md` as the task needs them.

## 1. State of the site

- Served root: `site/` — static, no build step, hash-routed SPA (`index.html`, `assets/site.css`, `assets/app.js`, `assets/forms.js`, `pages/*.js`, `data/content.js`, `data/config.js`, `data/diagrams.js`, `assets/img/**`).
- Live preview: https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri, **shared with anyone who has the link**, so a publish is seen at once (`START-HERE.md` §1). It shows round 17 since 2026-09-28; round 18 (2026-09-29) runs locally until Alex says to publish. The previous theme's artifact is a frozen archive and is never republished. A publish from a new session must `read` the artifact first, and a publish refused as "not built on the newer version" means another session published in between: re-read, then publish the current tree again — the shared working tree is the merge.
- Pages: the current map is `START-HERE.md` §3 — Home (nine screens since round 18: the Packaged services track, the Bespoke services band directly under it, then the Why list), Products (facet rail and tiles, ending on the *Looking for another solution?* tile), seven product pages (Overview · Use cases · Technology · Jumpstart · Contacts), and For sellers (`#/sellers`). **The Services page was removed in round 18**; the header's *Services* lands on the home page's Packaged services screen, and a saved `#/services` link lands on the home screen that took over its section. The history of every round is `PROVENANCE.md`.
- Checker: `node tools/check-grammar.js` (run from the repo root) asserts the content contract; it must print `OK` before any publish.

## 2. What lives where (and what does not exist on other machines)

| Need | Location | Available off the laptop? |
|---|---|---|
| Site code, data, images, docs, checker | this folder | yes (repo) |
| Practice facts (external-safe) | `site/data/content.js` → `overview.*` (the home page's Packaged and Bespoke services, About), `shared.*`; AO-Personal-OS wiki pages `context/areas/softserve/oracle.md`, `oracle-ai-offerings.md`, `oracle-packs.md`, `oracle-team.md` | yes (repo) |
| Case-study figures and their sources | `docs/PROVENANCE.md` (§4, §17) | yes (repo) |
| Brand tokens | `site/assets/site.css` `:root`; AO-Personal-OS `.claude/references/softserve-deck-kit.md` | yes (repo) |
| Hero / step / industry images, headshot | `site/assets/img/**` | yes (repo) |
| Customer logos (never shipped; moved out of `site/` on 2026-09-17) | `docs/asset-candidates/logos/` | yes (repo) |
| Raw deck media (OneDrive `Projects/Oracle/…`), BSH business case PDF | Alex's Mac / SoftServe OneDrive (`ms365` MCP when authenticated) | no — only needed for NEW imagery; reuse existing assets instead |
| Research scratchpad (`research/*.md`, `spec/*.md`) | deleted with the session scratchpad | no — do not look for it; PROVENANCE.md holds what was kept |
| About-SoftServe corporate facts | **now in the repo:** `docs/PROVENANCE.md` §18.2 records every figure the About block uses, verbatim, with its URL and the 2026-09-16 fetch date. Re-fetch only to refresh a figure — and note that `/en-us/about`, `/en-us/partners`, `/en-us/partners/oracle` and `/en-us/partners/nvidia` all 404; the working paths are `/en-us/about-us` and `/en-us/our-partners[/oracle\|/nvidia]` | yes (repo; web to refresh) |

Git: git-autosync runs only on the Mac. On another machine: `git pull` first, commit with conventional messages (`feat(site): …`), `git push` when done.

## 3. Standing rules (do not relax)

- Copy lives in `data/content.js`; renderers read data. No invented facts, numbers, customers, URLs. New copy for thin spots is written in the same register and logged in `docs/PROVENANCE.md`.
- No customer names or logos anywhere in shipped files (Bosch, BSH, Riyadh Air, DHL, SBG are banned; the checker enforces a deny-list). Anonymized descriptors only. No € figures, headcounts, baselines or contract values.
- Naming, **two forms per Oracle platform since round 9** (Alex): the short `label` on the Products rail, the hero chip, the tile image band, `products[].tags[1…]` and the hero stack — *AI Lakehouse · AI Data Platform · AI for Fusion Applications · OCI + NVIDIA NeMo*; the full `fullLabel` on the Services platform cards and in prose — *Oracle Autonomous AI Lakehouse · Oracle AI Data Platform* (never "AIDP") *· Oracle AI for Fusion Applications · Oracle Cloud Infrastructure + NVIDIA NeMo*. One canonical order, that one, on every surface; ids `oracle-ai-lakehouse`, `oracle-ai-data-platform`, `oracle-ai-fusion` (`catalog: false` — on the stack and Services, never a filter), `oci-nvidia`. A third form of a name is a build failure. Also "AI-Q", "cuOpt", "NeMo", "OCI", "NVIDIA" (never "Nvidia"). Never mention GigaCloud.
- **The six product groups, in this order and these exact words** (`chip` equals `full`, so a group has one name on the tile, the rail and the product chip): **Enterprise knowledge & analytics · Deep research & investigation · Document processing · Transaction & process execution · Forecasting & optimization · Video & image intelligence.** Ids: `knowledge-analytics`, `deep-research`, `documents`, `transactions`, `forecasting-optimization`, `video-image` — the same ids the home tiles deep-link on (`#/products?cat=<id>`).
- **Delivery tiers are Jumpstart proof of value · Integration · Scaling.** Never "Scale" as a tier title (the hero stack says *Scaling*, and one page may not carry both words for one thing); "scale" as a verb in prose is untouched. **The walkthrough is an "Interactive demo"**, under the rail's *Artifacts* group — "Demo" alone is retired as a label.
- Nothing internal ships: no source/assumption comments, TODOs, "(assumed)", wiki jargon, internal codes.
- **No total, and no gap.** The catalog is what is packaged today, not a ceiling, so no surface prints the size of it (*seven products*, a `5 of 7` denominator, a count in a headline or a stat tile) and no surface names what is missing (*so far*, *yet*, *not seeing your workflow*, *no packaged offering*). A zero-count rail option is the settled exception: it renders, disabled and **without a number**, so the rail keeps one shape and no score stands beside a vendor's product name (round 9). Breadth is stated **positively and only where it is already cleared** — today in `productsPage.bottomBlock.body` (*"…or what it would take to build one on your data"*); round 9's rewrite of `overview.twoWays.panels[1].body` took the older wording, *"or build the one your workflow needs"*, off the home page. The six `facets.categories[].emptyState` strings follow the same rule, and the checker sweeps them for it. Commercial shape is stated without counting it: *"at a fixed price where one is published, otherwise scoped per engagement"*. `check-grammar.js` enforces both halves over `productsPage.intro`, `productsPage.bottomBlock.heading` / `.body`, `overview.twoWays.panels[0].body`, `overview.catalog.lead` and `overview.catalog.title`, and fails `productsPage.count` and `facets.footnote` outright (`PROVENANCE.md` §18.9).
- **A case study states its status once, in one plain word.** The chip — `Proven` / `Forecast` / `Estimated`, from `shared.caseStudyStatus` — is the only place it appears; the metric eyebrow that repeated it is retired on both the home card and the product callout, and both keys are build failures. The footnote spends its line on **evidence** (on whose data, against what baseline, what an estimate is measured against, who validates it), never on the chip's word or its negation. The modeled card is the one with a fixed substance: `PROVENANCE.md` §4 requires that its caveat keep saying the figures are simulations against the customer's own historical baseline rather than production, whatever words carry it — the §4 / §10.8 clearance gates are unchanged.
- Design system (rewritten 2026-09-18 for the current SoftServe brand; full record in `docs/SS26-THEME.md`): white ground with at most one black band per page, `#1485c4` for action and `#f46a4a` as the one accent, Azurio (serif, 400, sentence case) for H1 over Replica LL, uppercase only as 12–16 px micro-type at `.06em`, octagonal corner cuts instead of radii, surface steps instead of shadows, 1.5px line icons, equal-height peers, no emoji, reduced-motion respected, mobile clean at 375.
- **An address renders as a link, never as a filled button** — an email or a website URL is an underlined anchor at body size with its glyph, on every surface (contact card on all three of its pages, the About band's `softserveinc.com`). A filled button is the screen's one ask; an address is a destination (`VISUAL-GRAMMAR.md` §9, `PROVENANCE.md` §18.8).
- **No Oracle partner-standing claim, ever** — no tier, no "partner of the year", no implied equivalence with the public NVIDIA Elite relationship (which does not ship either). softserveinc.com states no Oracle tier and its public Oracle page is a NetSuite services and staffing page. What may be claimed is joint **delivery** with Oracle's AI & Data organization (§18.8 d).
- Config-driven states: `video`, `videoPoster`, `marketplace`, `marketplaceUrl`, `successStoryUrl`, `productOrder` in `config.js`, and every kit link — `interactiveDemo`, `interactiveDemoArtifact`, `video`, the one-pager, deck and feature list — in `links.json` at the repo root (round 12) — see `docs/CONFIG.md`. Elements whose URL is empty are not rendered, except the demo frame (pending state). **A claim reads the thing it claims** (round 9): the *Interactive demo* badge and its filter both read the `interactiveDemo` link, the walkthrough they open; `video` decides only whether the product page carries a video frame.
- **The publish `files` map carries every changed and new file, images included, and removes a deleted one with `null`** — `assets/img/groups/*` since round 9, `assets/img/bands/*` and `assets/img/groups/ask.svg` since round 18 (with `"pages/services.js": null`, because the page's renderer was deleted and a file left out of the map stays on the artifact), on top of the usual `assets/site.css`, `assets/app.js`, `data/*.js`, `pages/*.js`, and `data/links.js`, which since round 15 is built for the publish from `links.json` and is never a file under `site/` (§4). Files not passed are kept, so a new image folder that is not in the map simply never reaches the artifact (§4, and the `list_files` check after every publish).
- Model split Alex asked for: creative, messaging and layout decisions by the main (Fable) session; mechanical implementation, verification and QA by Opus subagents.

## 4. How to run, verify, publish

Run: `.claude/launch.json` has entry `oracle-site` (`python3 tools/serve.py 8765 site`, relative to the repo root: this Mac only, never cached, since 2026-09-24). `preview_start {name:"oracle-site"}` started it normally in the rename session (2026-09-16, evening); the round-5 session earlier that day saw the spawned python die in `http.server`'s argument parser with `PermissionError: [Errno 1] Operation not permitted` from `os.getcwd()` (cause not established). If that recurs, start the same server from the Bash tool at the repo root (`python3 tools/serve.py 8765 site`, run in the background), then open the pane with `preview_start {url:"http://127.0.0.1:8765/"}`. Not `python3 -m http.server`: only `tools/serve.py` answers `data/links.js` from `links.json` (round 15), so under a plain server every *Interactive demo* button disappears. Browse `http://127.0.0.1:8765` — not `localhost`, whose cache goes stale. Even there a reload can keep the old `site.css`: before measuring a CSS change, confirm the new rule is in `document.styleSheets`, or re-point the stylesheet link with a `?v=` query from the console. In the in-app browser, screenshots taken after scrolling can come back black: screenshot at scroll 0 or resize the viewport tall (e.g. 1440×2400) to see a whole page.

Verify before publishing: `node --check` on changed JS, `node tools/check-grammar.js` → OK, console clean on every route, `grep -ri "bosch\|riyadh\|dhl\|sbg\|logos/" site --include='*.js' --include='*.css' --include='*.html'` returns nothing (quote the globs: unquoted, zsh aborts with `no matches found` before grep runs). **For any layout change, look before you publish** — every changed screen at 1440, 1024, 768 and 375 (and the H1 at 320): hide the other sections from the console so each screenshot is taken at scroll 0, add `is-in` to the `.reveal` elements, and re-point the stylesheet link with a `?v=` query so the new CSS is the one on screen. When a component moves to a new page, carry its context with it — its wrapper (`.product-hero-copy`), its modifier classes (`--home`), the container width it was sized for and its breakpoints (`PROVENANCE.md` §21.7: version 28 shipped without that check and Alex found the gaps).

Publish (updates the same URL): create a wrapper copy of `site/index.html` with ONLY the document skeleton stripped — `<!DOCTYPE html>`, `<html …>`, `</html>`, `<head>`, `</head>`, `<body>`, `</body>`, and the `<meta charset>` and `<meta name="viewport">` lines, which the Artifact tool's own skeleton already carries (version 26 kept them and shipped duplicates inside `<body>`; 27 removed them) — and the site's own `<title>` kept (`Oracle AI & Data Solutions — SoftServe`). Strip by exact line, never by a `<head` prefix: version 16 was published with `<header class="masthead">` and `</header>` stripped as well, so the live masthead had no sticky bar behind the nav until version 17. From the repo root: `grep -v -x -F -e '<!DOCTYPE html>' -e '<html lang="en" data-theme="light" data-brand="ss26">' -e '<head>' -e '</head>' -e '<body>' -e '</body>' -e '</html>' -e '<meta charset="utf-8">' -e '<meta name="viewport" content="width=device-width, initial-scale=1">' site/index.html > .work/publish/index.html`, then `diff` the two files: exactly those nine lines should differ. Write the wrapper to `.work/publish/index.html`, which is git-ignored and under the working directory. Build the site's links beside it with `python3 tools/site_links.py --out .work/publish/data/links.js`: since round 15 `data/links.js` is not a file under `site/`, and a publish without it loses every *Interactive demo* button. Map it in the `files` map as `"data/links.js"` → the absolute path of that file. The Artifact tool reads sources from the session's working folder or its scratchpad, so a session opened in another folder publishes from a copy of the wrapper and the files staged in its scratchpad. Then call the Artifact tool with `url: https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri` (the site; the old dark theme's artifact, 98wafGUphFSyGSr6ctJiiN, is a frozen archive and is not republished), `root: site`, and a `files` map of every changed/added file (published path → source path). Read the artifact (`action: read`) once before the first publish from a new session, or the publish is refused. Files not passed are kept, so **new images must be passed explicitly and a deleted file must be mapped to `null`** (round 18: `"pages/services.js": null`) — round 9's publish was 14 entries, the eight changed source files plus the six new `assets/img/groups/*` tile images. After publishing, run `action: list_files` to confirm two things: the new files are live, and nothing is published that should not be. That check is how version 36 found three customer logo files on the link-shared artifact.

## 5. Task 0 — canonical technology facet (DONE 2026-09-16, re-cut 2026-09-22)

Done 2026-09-16 and re-cut in round 9: `facets.technology` is the canonical four, in the order `oracle-ai-lakehouse`, `oracle-ai-data-platform`, `oracle-ai-fusion`, `oci-nvidia`, each carrying **both** a short `label` and a full Oracle `fullLabel` (the list is in §3; the `Other` catch-all stayed retired). The Products rail, the hero chip, the tile image-band and the hero stack render the short label verbatim; the Services platform cards render the full name; engine detail (AI-Q, cuOpt, Select AI) stays in `technology.stack`; each facet has a glyph in `shared.tagFamilies.tech.icons` under the tooltip "Runs on"; and `tools/check-grammar.js` fails on any drift, including a third form of a name — contract and naming rationale in `docs/SCHEMA.md`, `docs/VISUAL-GRAMMAR.md`, `docs/CONFIG.md` and `docs/PROVENANCE.md` §17.7 and §28.

**Amended 2026-09-16 (§18.9): the rail no longer lists a platform with no products.** Round 4 rendered all four options with their counts and disabled the zeroes — *All 7 · 5 · 0 · 2 · 0*. It now offers **All · OCI + NVIDIA (5) · Oracle Autonomous AI Lakehouse (2)**: the two zero-count platforms are simply absent, the **All** option carries no count, and a zero renders no number. The four canonical ids, labels and `emptyState`s are untouched, and **`?tech=<id>` still resolves for all four** — the active facet renders its own option, selected, above its `emptyState` in the normal grid container. The reason for the reversal is in §18.9 (c): a `0` printed beside two of Oracle's own AI platforms, on a page an Oracle account executive opens live on a call, is a scoreboard rather than a filter. `facets.footnote` and the `.rail-note` line under the group went with it.

## 6. Task 1 — Home page rebuild (creative decisions, made by Fable) — (DONE 2026-09-16 — see PROVENANCE §18)

**The plan below is kept as written**, because it is the reasoning the build was judged against, not a to-do list. Where the build deviated from it — *ready-to-run*, the duration stat, four S2 bullets, the method line and the NDA line, the partner strip, the H1 scale, the two ladder vocabularies — `PROVENANCE.md` §18.0 records each deviation and the reason for it. The data model that shipped is in `SCHEMA.md` §`overview`; §6.4's execution split is history now.

**None of the copy below is live any more,** and neither are two of its layouts. The §18.7 messaging pass rewrote the home page against an Oracle rep and an enterprise buyer, and retired this brief's *best-of-breed*, *ready-to-run*, *packaged*, *workflow pattern* and its counted headlines (*Seven products, three workflow patterns.*). **Round 9 then replaced the hero stack and the whole of S3** — three layers read bottom-up, and six group tiles instead of three product-row columns (`PROVENANCE.md` §28, `VISUAL-GRAMMAR.md` §9). Read §6 for the reasoning; read `content.js` and the two PROVENANCE sections for what is on the page.

### 6.1 Positioning and naming

Value proposition (the practice's, expressed through products + services): **best-of-breed enterprise AI agents and workflows on Oracle platforms.** SoftServe builds AI agents and workflows on Oracle's leading platforms — OCI (with NVIDIA), Fusion Applications, AI Data Platform, Autonomous AI Lakehouse — compounding Oracle's AI databases and platforms with hands-on experience delivering enterprise agentic AI. The answer has two sides: ready-to-run products (grouped by workflow pattern) and a dedicated Oracle AI & Data practice (packaged delivery model + expert teams).

- Site name (lockup and `<title>`): **AI Agents on Oracle** — lockup `softserve | AI Agents on Oracle`; `<title>` "AI Agents on Oracle — SoftServe"; product titles "<Product> — AI Agents on Oracle — SoftServe". Not "practice" in the name; the practice is the engine, the agents are the promise.
  - *Amended 2026-09-16 (`PROVENANCE.md` §20): Alex renamed the site **Oracle AI & Data Solutions** — lockup `softserve | Oracle AI & Data Solutions`, `<title>` "Oracle AI & Data Solutions — SoftServe", product titles to match.*
- Meta description: "Best-of-breed enterprise AI agents and workflows on Oracle platforms — ready-to-run products and a dedicated Oracle AI & Data practice from SoftServe."
- Nav: `Products · Services · Case studies` (anchor to the home proof screen) + header button **Talk to us** (→ Services contact). The logo is the home link; drop "Overview". Product pages keep "Request a demo" CTAs.
- Words to use: "AI agents and workflows", "Oracle platforms", "ready-to-run", "Jumpstart proof of value", "in your Oracle tenancy", "measured". Words to avoid: "practice" in headlines, "cutting-edge", "seamlessly", "unlock", "empower", "revolutionary".

### 6.2 Structure — seven screens, each content-sized (no 100vh heroes), ~80–90vh at 1440×900

**S1 Hero — the thesis.**
- Eyebrow: `SOFTSERVE × ORACLE · AI AGENTS AND WORKFLOWS`
- H1 (two lines, second line teal): `Enterprise AI agents and workflows.` / `Built on Oracle.`
- Lead (≤ 45 words): "Oracle's AI platforms, compounded by SoftServe's enterprise agentic-AI experience: ready-to-run agents and workflows for the jobs enterprises repeat most, and a dedicated practice that takes them from a fixed-scope proof of value to production."
- CTAs: primary `Explore the products` (→ S3), secondary `How we deliver` (→ S4).
- Visual, right column (HTML/CSS or inline SVG, no photo): the **"built on" stack** — three bands. Bottom band: four Oracle platform tiles (OCI + NVIDIA · Oracle AI for Fusion Applications · Oracle AI Data Platform · Oracle Autonomous AI Lakehouse) with the Oracle wordmark at the band's edge. Middle band: SoftServe layer — "Agentic-AI patterns · Evaluation frameworks · Packaged delivery". Top band: three workflow-pattern tiles (Deep research · Processing pipelines · Data analysis & optimization) with the seven product names as small chips under them. Thin connector lines; on load the lines draw in over ~1.2 s (static under reduced motion). Bands are peers: same height, same padding.
- Proof strip under the hero, hairline-divided, 4 stats: `7` ready-to-run products · `4` Oracle AI platforms · `30–45 days` to a proof of value (the Lakehouse Jumpstart figure in content.js; if another product's Jumpstart is shorter/longer, phrase as "weeks, not quarters") · `500+` data and AI experts (cleared SoftServe data-practice figure already in content.js `overview.hero.stats`; keep only numbers that exist there).

**S2 Two ways in — products and services.**
- Eyebrow `TWO WAYS IN`; H2 `Products you can run now. A practice that makes them yours.`
- Two equal panels, thin divider, each: icon, title, 3-line text, three proof bullets with check icons, one CTA.
  - Left — `Ready-to-run AI agents and workflows`: "Seven packaged products for the workflows enterprises repeat most: deep research, document processing, data analysis and optimization. Each runs on Oracle, in your tenancy, and starts with a fixed-scope Jumpstart." Bullets: "Grouped by workflow pattern, so you find the job first" · "Built on OCI + NVIDIA or Oracle Autonomous AI Lakehouse" · "Demo, Jumpstart scope and pricing on every product page". CTA `See the products ↓` (scrolls one screen).
  - Right — `A dedicated Oracle AI & Data practice`: "One packaged delivery model — Jumpstart proof of value, integration, scale — run by teams who build on Oracle's AI platforms every day. The people who built the products build yours." Bullets: "Fixed scope, fixed price, weeks not quarters" · "Evaluation-first: results are measured before you commit" · "Expert pods: AI engineers, data engineers, Oracle architects". CTA `How we deliver ↓` (scrolls two screens).
  - Verify every bullet against `content.js` `services.*` and the wiki; drop, don't replace, anything unsupported.

**S3 Products — one screen.**
- Eyebrow `PRODUCTS`; H2 `Seven products, three workflow patterns.`; one-line lead.
- Layout: three columns = the three patterns, each with pattern icon, name, one-line definition, then compact product rows (name, ≤ 12-word one-liner, tiny Demo/Marketplace badges) linking to product pages. Order inside columns follows `SITE_CONFIG.productOrder`. Peer rows identical; columns equal height (the single-product column carries a longer pattern definition, not an empty card).
- Footer link: `Browse all products with filters →` (Products page).

**S4 Services — one screen, "How we deliver".**
- Eyebrow `SERVICES`; H2 `From proof of value to production, in one packaged model.`
- Left 60%: horizontal three-step ladder — `1 Jumpstart Proof-of-Value` (fixed scope and price, on your data, decision-ready result; duration only where content supports it) → `2 Integration` (connect to your systems, harden, hand over) → `3 Scale` (roll out across units and regions, managed evolution). Each step: title, two lines, one fact.
- Right 40%: `Why SoftServe on Oracle` — three pillars: Platform depth (OCI + NVIDIA, AI Data Platform, Autonomous AI Lakehouse, Fusion Applications) · Agentic-AI experience (pattern library, evaluation frameworks, human-in-the-loop design) · Packaged delivery (fixed scope, measurable outcomes, weeks not quarters). CTAs `Explore the services →` (Services page) and `Talk to us`.

**S5 Social proof — "Proven on customer data".**
- Eyebrow `CASE STUDIES`; H2 `Measured on customer data, under NDA.`; the existing four case-study cards (component from round 4, 2×2, equal height) + the method line (`services.proof.methodNote`, the 81% evaluation story) + "Reference calls available on request." Anchor `#case-studies` for the nav.

**S6 About SoftServe — credibility.**
- Eyebrow `ABOUT SOFTSERVE`; H2 `A global digital engineering company, building on Oracle and NVIDIA.`
- One paragraph + four stat tiles with corporate facts fetched from https://www.softserveinc.com (About/company pages) — founding year, headquarters, headcount, offices/countries, or whatever the public page states. Do not invent; if a figure is not on the public site, leave the tile out. Partner line `Built with Oracle and NVIDIA` with the two wordmarks (no partner-tier claims). Link `softserveinc.com`.

**S7 Contact.** Reuse the contact split (card + form) with heading `Talk to the Oracle AI & Data team`.

### 6.3 Layout and motion decisions

- Keep the design system; the home page differs from product pages by composition, not tokens. Alternate full-bleed sections and inset panels; hairline rules between screens; one accent per screen.
- Hero type: H1 at the existing display scale; the stack visual is the only "illustration" — no stock photo on the home hero (the photo stays on product/services heroes).
- Motion: line-draw in the stack visual, scroll-reveal on section entry (visible resting state, never parked at opacity 0), hover lift on panels/rows. Nothing else.
- Every screen ends with one CTA at most. Peers equal height. Mobile: stacks in the same order; the stack visual collapses to a vertical three-band list.

### 6.4 Execution split

- Fable (main session): confirm the copy above against `content.js`/wiki facts, adjust wording, decide any deviation; review screenshots once; publish.
- Opus subagents: (1) fetch the public SoftServe corporate facts and write S6 data; (2) rewrite `overview.*` in `content.js` to the S1–S7 model + update `docs/SCHEMA.md`, `docs/VISUAL-GRAMMAR.md`, `docs/PROVENANCE.md`, `tools/check-grammar.js`; (3) implement `pages/overview.js` + CSS (stack visual, two-panel screen, catalog columns, ladder + pillars, case grid, about block, contact) and the nav/title/lockup changes in `index.html`, `app.js`, `content.js`; (4) QA: design critic + copy/leak critic, one fix pass; then Fable publishes.

## 7. Open inputs (unchanged, Alex to supply)

Demo video URLs and posters (Workforce optimization, Large Docs, Account Insights); Oracle Marketplace listing URLs (Workforce optimization, Large Docs); success-story files; share links for the kit documents (one-pager, sales deck, feature list per product, pasted into `links.json`); a verified public contact alias (`oracle@softserveinc.com` is the printed one); a public host for the site, so the forms can send (the emails themselves are built, `mail/README.md`); hosting subdomain; written approval to name customers (none today); rights confirmation for deck imagery and product screenshots.

## 8. Paste-ready prompt for the new session

```
You are continuing the SoftServe "Oracle AI & Data Solutions" mini-site (the Oracle-Solutions-Site repository, ~/Documents/GitHub/Oracle-Solutions-Site, with the site in site/). Read docs/START-HERE.md first and work the way it describes: the brief (§2), the standing rules (§4), how a round runs (§5), run/QA/publish (§6), the learnings (§7). Exact commands are in docs/HANDOFF.md §4. Everything needed is in the repo or on the public web; do not search for an old scratchpad.

Task: <what Alex asked for>.

Before editing, check git log and read every file you will change fresh from disk — another session publishes the same tree. Finish with the checker OK, layout QA at the widths in START-HERE §6, a publish per HANDOFF §4 (merge if refused), a PROVENANCE section for the round, START-HERE rewritten where the brief, a rule or a procedure changed, and a report: what changed, what you decided differently and why, and what is still open.
```

The Task 1 prompt that stood here (the round-5 home page rebuild) is done; §6 keeps its reasoning.

---

## 9. Runtime note — Node is not on PATH on this Mac

`node` is not installed on the PATH here, so `node tools/check-grammar.js` and
`node --check` fail with *command not found* until you point at a bundled
binary. Two work:

- **Codex's bundled Node (v24), the simple one:**
  `/Applications/Codex.app/Contents/Resources/cua_node/bin/node`. Symlink it
  into a scratch `bin/` and prepend that to `PATH` for the session, and every
  command in this file works verbatim.
- **VS Code's Electron**, run as Node: `ELECTRON_RUN_AS_NODE=1` before the
  Electron binary. Fine for the checker, which is plain CommonJS with no
  dependencies.

**Do not use the Claude desktop app's bundled binary for this.** It ignores
`ELECTRON_RUN_AS_NODE` and launches a second GUI instance of the app instead of
executing the script — a visible, confusing failure rather than an error
message.

Nothing needs to be installed: the site has no build step, and the checker has
no dependencies. If a real Node lands on this machine later, delete this note
rather than keeping two procedures.

**The shared local preview server is not yours alone.** Each Opus critic spawned
in the §18.7 messaging round stopped the shared `python3 -m http.server` preview
when it finished its read, so the next tool call hit a dead port. A session that
runs a critic must expect to restart the server afterwards — check it before
blaming a page for not loading.
