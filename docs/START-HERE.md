# Start here — Oracle AI & Data Solutions mini-site

Read this page first in every new session. It holds what the site is for, the brief and the rules it is built to, how a round of work runs, and what earlier rounds learned the hard way. Detail lives in the docs mapped in §10. Keep this page current: when a requirement, rule or procedure changes, rewrite the line — never append a dated update.

Current as of 2026-09-23 (after round 10 — the product pages: one contact ask, a Use cases tab, and the frame as the block — and Alex's same-day review of it: the Contacts switch and the stepper's description, PROVENANCE §29.7).

## 1. What it is

- **The site:** one small site for SoftServe's Oracle AI & Data practice, named **Oracle AI & Data Solutions**. It offers *products* — AI agents and human-AI workflows on Oracle platforms, grouped into **six product groups**, one per kind of job (§4) — and *services* (the practice that delivers them, from a proof of value **from 30 days** through integration to scaling).
- **How it is used:** Oracle and SoftServe sellers open it live on a call, and customers receive it as a link.
- **People:** Alex owns the site and every decision on it. The person on the contact card is Karsten Tramborg, **Oracle Partnership Director, SoftServe** (Alex, 2026-09-23; the pack one-pagers print *Alliances & Partnerships Director* and are unchanged — `ASSETS.md` §3). The practice mailbox is oracle@softserveinc.com.
- **Code:** a static, hash-routed SPA in `site/` with no build step and no framework.
  - **The site is on SoftServe's current brand** (`site/index.html` + `assets/site.css`):
    white ground, Azurio serif over Replica LL, Lviv blue with Austin orange, octagonal
    corner cuts. Read `docs/SS26-THEME.md` before touching it. The previous near-black
    theme is kept, runnable, as `site/index-legacy.html` + `assets/site-legacy.css` —
    an archive, not a second version to maintain. Images, renderers and copy are shared:
    logo paths go through `assets/brand.js`. **`content.js` is the live site's own
    copy** — new strings are stored in sentence case directly, and
    `data/content-case.js` only re-cases what is left from before the rebrand
    (43 rows, shrinking every round; never add one).
  - Copy: `site/data/content.js`.
  - Switches: `site/data/config.js`.
  - Page renderers: `site/pages/`, one per page.
  - Shared UI and the router: `site/assets/app.js`.
  - Forms: `site/assets/forms.js`.
- **Preview:** two artifacts, one per theme, both **shared with anyone who has the link**, so every publish is live at once.
  - **The site:** https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri. This is the one to publish to.
  - **The archive** (previous near-black theme, frozen): https://claude.ai/artifact/98wafGUphFSyGSr6ctJiiN (the same artifact as https://claude.ai/code/artifact/41e4f3b6-47d9-4ef2-af99-99c40c02b89b). Do not republish it.
  - **Open:** the archive's URL is the one that has been in circulation. If it needs to show the current site, the two have to be swapped — Alex's call.
- **Stage:** prototype. The *Internal* button (bottom right) opens a checklist of the assumptions still to be confirmed, and it comes off before launch (§8).

## 2. The brief

These are Alex's working assumptions as of 2026-09-17, and **each one is still to be confirmed**. The *Internal* panel shows them as a checklist (`site/data/review.js`). Alex's ticks are saved only in his own browser and never reach the repo, so a confirmation counts when Alex tells a session. That session then rewrites the line here and removes or rewords the item in `review.js`.

- **Audience, in priority order:**
  1. Oracle sellers and partners.
  2. SoftServe sellers.
  3. End customers.
- **Positioning:**
  - Experts in AI and in Oracle's platforms, with a multi-year, top-class enterprise track record.
  - Ready-made solutions, fast proofs of value and a dedicated practice.
  - We offer products *and* services.
- **Commitments and disclosures:**
  - A proof of value is stated **two ways, on purpose** (round 9): **4–8 weeks** in every piece of scope copy — the delivery ladder, the seven product Jumpstart tabs, Services — and **"from 30 days"** as the hero's one figure, the *from* set small beside it. Both are still to be agreed with delivery. `tools/check-grammar.js` fails any other duration in scope copy, and fails the hero tile if it is anything but `{ prefix: "from", value: "30 days" }`.
  - The proof-of-value price is the only price on the site. Every other package price goes in the sales materials.
  - No customer names, because no customer has confirmed we may use theirs.
  - The catalog holds both existing and planned products.
- **Communication flow:**
  - One mailbox, oracle@softserveinc.com, receives every request.
  - Karsten is the contact for communications.
  - Sales materials go only to corporate addresses at softserveinc.com or oracle.com.

**Where the site does not match the brief today** (flagged in the panel and left unchanged until Alex decides):
- Two products print an **Integration price** on their Jumpstart tab: *Large docs processing and review* and *Workforce optimization* (€300–500K services plus infrastructure).
- **No product is marked as planned**, so all seven read as available now.
- **Partners** are priority 1, but they cannot receive the sales kit, which goes only to @oracle.com and @softserveinc.com. The brief contradicts itself here.

## 3. The site, page by page

| Route | What it does | Record |
|---|---|---|
| `#/` Home | Seven screens: <br>• hero — a three-line H1, the **three-layer stack** (Oracle platforms → SoftServe product groups → SoftServe services, read bottom-up) <br>• the three-figure proof strip, led by **from 30 days** <br>• two ways in (products · services) <br>• **six group tiles**, each an image, a one-liner and a link into the filtered catalog <br>• how we deliver <br>• anonymized case studies (Proven / Forecast / Estimated) <br>• About SoftServe (the page's one dark band) <br>• contact | PROVENANCE §18, §28 |
| `#/products` | Catalog with a facet rail (Oracle platform · what it does · Artifacts) and tiles. **Both radio rails are fixed lists** in canonical order — three platforms and all six groups, always — with a zero-count option disabled and printing no number; the one a deep link arrived on renders selected above its own empty state. *Oracle AI for Fusion Applications* is not offered (`catalog: false`): no product runs on it. No total, no denominator. `?cat=<id>` and `?tech=<id>` are both honored. | §17, §18.9, §28 |
| `#/products/<slug>[/<tab>]` | Seven product pages. <br>• Tabs: **Overview · Use cases · Technology · Jumpstart · Contacts** (round 10). Overview is Problem → Solution · How it works · More detail, with Outcomes & ROI in the rail; **Use cases** holds the industry tabs and the case study; **Contacts** is one row — the contact card beside a two-tab switch, *Talk to us* (open by default) and *Get the sales kit* (for sellers), so only one form is ever open and neither is below the fold; `…/contacts#kit` opens on the kit tab. <br>• Retired segments redirect in place: `pov` → Jumpstart, `demo` and `sellers` → Contacts. <br>• Three products have an interactive walkthrough under `site/demo/`. | §15–§19, §22, §24, §29 |
| `#/services` | Three screens, one message each, then contact: <br>• *Frontier AI on Oracle* (the practice, with the four platform cards under their full Oracle names) <br>• *Every step has a number* (Discovery → Jumpstart proof of value → Integration → **Scaling**) <br>• *Not a project. A proof.* (4–8 weeks) | §21, §23, §28 |
| `#/sellers` | *Get the sales kit*, for all offers or one product (work email at softserveinc.com or oracle.com). Below it, the demo form for a seller who already has an account in mind. | §24 |

- **Header:** Products · Services, plus *Talk to us*. *For sellers* is not in the header (Alex, 2026-09-17).
- **Footer:** *For sellers* comes first in the link row. It is the only permanent way to `#/sellers`; the other is *Get the full kit* in the confirmation after a product kit request.

## 4. Standing rules

These hold unless Alex changes them, and `tools/check-grammar.js` enforces most of them. The full wording is in HANDOFF §3 and `.claude/references/client-documents.md`.

**Content**
- Every word lives in `content.js`, and renderers only read data. No invented facts, numbers, customers or URLs. Log every new line of copy in PROVENANCE.
- **No customer names or logos** in anything shipped. Describe customers by industry and scale. The checker and the deny-list grep both enforce this.
- **No Oracle partner-standing claim**: no tier, no award. What may be said is joint delivery with Oracle's AI & Data organization.
- **Naming:**
  - **The six product groups**, in this order and these exact words, on the hero stack, the home tiles, the rail and every product chip (`chip` equals `full`, so a group has one name): **Enterprise knowledge & analytics · Deep research & investigation · Document processing · Transaction & process execution · Forecasting & optimization · Video & image intelligence.**
  - **Oracle platforms, two forms of each name** (round 9): the **short label** on the rail, the product chips, the tile image band, `tags[1]` and the hero stack — *AI Lakehouse · AI Data Platform · AI for Fusion Applications · OCI + NVIDIA NeMo* — and the **full Oracle product name** on the Services platform cards and in prose: *Oracle Autonomous AI Lakehouse · Oracle AI Data Platform* (never "AIDP") *· Oracle AI for Fusion Applications · Oracle Cloud Infrastructure + NVIDIA NeMo*. One canonical order, that one, everywhere. "OCI" alone is still fine in running text.
  - **The delivery tiers are Jumpstart proof of value · Integration · Scaling** — never "Scale" as a tier title (the hero stack says *Scaling*, and one page may not carry both words for one thing). "Scale" as a verb in prose is untouched.
  - **The walkthrough is an "Interactive demo"** — the badge, the rail checkbox, the tooltip and, since round 10, **the button in the product hero and in the pending-video panel** all say it, under the *Artifacts* group; the checker asserts the button's label equals the badge's. "Demo" alone is retired as a label, and *"Try the interactive demo"* went with it. The button carries the badge's own `cursor-click` glyph **leading** the label and no trailing `external` glyph — one icon per button.
  - **One contact ask, and it is *Talk to us*** (round 10). The header button, the product hero's primary button, the Contacts switch's first segment, the form's submit under it and the route out of the sales kit all read `site.primaryCta.label`, and the checker asserts each one. *Request a demo* is retired as a label — the raw text of `content.js` fails on it — while the `request-a-demo` **anchor id** stays, because seven pages deep-link to it. The exception is `shared.videoPending.cta`, *Request a live demo*, which is the right ask while a recording does not exist. Outside the product pages three other phrasings survive and are still open (§9).
  - NVIDIA products: "NVIDIA" (never "Nvidia"), "AI-Q", "cuOpt", "NeMo".
  - GigaCloud never appears.
- **Prices:**
  - No € figures on Services.
  - A price never ships without its disclaimer.
  - Beyond that, the brief in §2 applies (still to be confirmed).
- **No totals and no gaps.** Never print the size of the catalog ("seven products"). Never name what is missing ("yet", "so far").
- **A case study states its status once**, in one word: the chip.
- **Truthful confirmations.** Never say "we've emailed" unless something actually sent the email. With no `formEndpoint`, a form opens the visitor's mail client, and the page says so.
- **Nothing internal ships in site copy.** The *Internal* panel is the only exception, and it is temporary (§8).

**Messaging** (from Alex's reviews)
- **Persona first.** Every headline speaks to its reader (a rep on a live call, a buyer on Oracle) in that reader's words. Never counts, taxonomy or packaging terms ("packaged", "workflow pattern", "ready-to-run", "pods").
- **Structure before copy.** Work out the audience, then the positioning, then three or four messages, then one screen per message, and set the length target first. A page is an argument, not an inventory.
- **Headings are display lines**, so the argument moves into the lead:
  - H1: two to four words, ≤ ~24 characters a line, two lines at most.
  - H2: five words or fewer, ≤ ~30 characters.
  - Light-band title: ≤ ~28 characters.
  - Check where the line breaks on a phone: no lone short word on a line.
- **Repetition:**
  - No content word three times on one screen.
  - One word for one thing across the whole site.
  - No claim repeated in more than two places.

**Design** — the rules below hold for BOTH themes except where the SS26 column differs.

| Rule | The archive (`index-legacy.html`) | **The site** (`docs/SS26-THEME.md`) |
|---|---|---|
| Ground | near-black, at most **one light band** per page | white, at most **one dark band** per page (`#about`, `.services-page-proof`); `#edf0f2` for cards |
| Accent | one teal `#35CCBA` per screen | **two roles**: `#1485c4` = act on / selected, `#f46a4a` = one hero accent line per page. Facts are neutral |
| Display type | Montserrat 900 **uppercase** | **Azurio serif, 400, sentence case**; H2-H4 in Replica 400; uppercase only as 12-16 px micro-type at +.06em |
| Shape | radii, `9999px` pills | **octagonal `clip-path` cuts** 4/8/12 px; `border-radius: 0` but inputs (2 px) and dots |
| Elevation | glows | **surface steps**; no shadow, no lift, no press-scale |
| Fact vs filter pill | filled navy is a fact, outlined is a filter | filled grey is a fact, outlined is a filter, blue tint is **selected** |
| Heading budget | H1 2-4 words, ≤ ~24 chars a line | H1 ≤ 15 chars a line × 2 (the home H1 is the exception: three short sentences, each on its own line — four lines at 375, five at 320); product name ≤ 22 × 2; **H2 ≤ 30, now enforced** — the three home H2s round 9 rewrote fail over it, the rest warn |

Holding for both: 1.5 px line icons and no emoji · peers are equal height · an address is
a link, never a filled button, and a filled button is the screen's one ask · only the top
block carries a photo, and the home hero carries none · clean at 375, and the H1 still
holds at 320.

Two more, from Alex's review of round 10 (2026-09-23), and they hold everywhere:

- **One form on a screen.** A second ask is a **switch** — two tabs of one segmented
  control, one pane open — never a second live input form, and never a block a reader
  has to scroll to find. Two open forms make the reader choose between two asks before
  reading either. The selected segment is then the column's heading, so no pane repeats
  it (`VISUAL-GRAMMAR.md` §8).
- **A description sits between the control that selects it and the thing it explains**,
  at body weight. Under the picture it is too far from its own heading for a reader to
  connect the two, and at footnote size it reads as a caption of the image rather than
  as the step's description (`VISUAL-GRAMMAR.md` §2.2).

## 5. How a round runs

1. **Check the state.**
   - Run `git log` on the folder, and read every file you will edit fresh from disk.
   - Another session publishes this same tree: Alexs-MacBook-Air, which owns the walkthroughs under `site/demo/`.
   - git-autosync commits every ~30 s.
2. **Brief.**
   - Opus gathers the facts from the decks, the site and the wiki `context/areas/softserve/oracle*.md`.
   - It labels each fact: [site] already on the site · [pub] from a deck, publishable · [clr] needs clearance.
   - It writes a short brief to the scratchpad.
3. **Decide.**
   - One Fable pass, working from the brief, makes the messaging, UX and design decisions and writes the copy.
   - Opus does the rest: research, build, checker, QA, publish, docs.
   - The report says which steps used Fable. Token efficiency matters: one compact Fable pass, not a fan-out.
4. **Build.**
   - Run `node --check` on changed JS, then `node tools/check-grammar.js`, which must print OK.
   - Turn every new owner rule into a checker assertion, so it survives the next rewrite.
5. **Look, then publish** (§6).
6. **Record.**
   - Add a new PROVENANCE section: the asks, the split, the decisions, a before/after table, the checks and *Open for Alex*.
   - Update SCHEMA, CONFIG, VISUAL-GRAMMAR and README wherever the contract moved.
   - Rewrite this page wherever the brief, a rule or a procedure changed.
7. **Report** to Alex: what changed, what was decided differently and why, and what is still open.

## 6. Run, QA, publish (short version)

Exact commands are in HANDOFF §4.

- **Run.**
  - Start the server with `preview_start {name: "oracle-site"}` (python `http.server` on 8765).
  - Browse `http://127.0.0.1:8765`, not `localhost`.
  - A QA subagent can kill the shared server; restart it before blaming the page.
- **Fresh assets.** The preview caches hard. Call `fetch('<file>', {cache: 'reload'})` for every changed file, or re-point the stylesheet link with `?v=`, then navigate.
- **Layout QA.**
  - Check every changed screen at 1440, 1280, 1024, 768 and 375, and the H1 at 320.
  - Hide the other `#app` sections and add `is-in` to the `.reveal` blocks, so each screenshot is taken at scroll 0 (screenshots taken after scrolling come back black).
  - Check horizontal overflow at every width.
  - A component moved to a new page takes its wrapper, modifier classes and breakpoints with it.
- **Gates.** All three must pass:
  - the checker prints OK;
  - the console is clean on every route;
  - `grep -ri "bosch\|riyadh\|dhl\|sbg\|logos/" site --include='*.js' --include='*.css' --include='*.html'` returns nothing. In zsh, quote the globs. If ugrep hits its complexity limit, use `/usr/bin/grep`.
- **Publish** — each theme to its own artifact (§1); never cross them.
  - Strip the nine skeleton lines from `site/index.html` into `.work/publish/index.html` (exact-line `grep -v -x -F`, HANDOFF §4).
  - The publish must carry `assets/fonts/*` with an explicit `contentType`, and only what the page references — nine legacy files and `assets/site-legacy.css` are deliberately absent from the artifact.
  - Call the Artifact tool with `file_path` = that wrapper, `root` = `site`, and a `files` map of every changed or new file — **images included**: `assets/img/groups/*` since round 9. Files left out of the map are kept, so a new image folder that is not in it never reaches the artifact.
  - Then run `action: list_files` to confirm that the new files are live and that nothing is published that should not be.
- **Refused publish** ("not built on the newer version") means another session published in between:
  1. `read_file` the live copies of the files you changed.
  2. Diff them against local; the working tree is the merge.
  3. Run `action: read`, then publish again.
- **Node:** `/opt/homebrew/bin/node` on this Mac (KN7X2Y65NX). On a machine without Node, see HANDOFF §9.

## 7. Learnings: mistakes not to repeat

- **A background agent's silence is not progress.**
  - Have it write intermediate output early, and check that file's mtime when the stage should be done.
  - If nothing has moved, stop the agent and take the work over. A research agent stalled for over an hour in round 6 (rule in `CLAUDE.md`).
  - **The progress file has to log at the granularity the watcher checks.** Round 10's build agent logged one line per stage, and its QA stage — every changed screen at five widths — went two hours without a line while its transcript kept growing, so a long QA and a hang looked identical from outside. **A QA stage logs per screen**, and any stage that can run longer than ~15 minutes logs per item inside it.
- **Fable's copy gets an Opus pass before it ships:**
  - The renderer escapes HTML, so `&amp;` prints literally; write `&`.
  - Retired vocabulary creeps back (*ready-to-run*).
  - Leads run long. Count lines in the browser, not characters in the file.
- **Headings over budget** drew the owner's sharpest correction ("too long of a heading", round 6). Budget before writing, and check at 375.
- **Moving a component breaks it quietly.** Version 28 shipped the Services hero without its wrapper and with an 84 px H1 (PROVENANCE §21.7).
- **The publish wrapper strips by exact line.**
  - Stripping by prefix once removed the `<header>` (version 16).
  - Keeping the meta lines once shipped them twice (version 26).
- **Parallel sessions share PROVENANCE numbering.** Read the last heading before numbering a round; round 7 had to move from §22 to §23.
- **Checker regexes need word boundaries.** "2 months" matched "3–12 months".
- **A duration, a price or a promise is a commitment, not copy.**
  - The 4–8-week sweep compressed *Plan vs actual investigation* from 12 + 2 weeks. It was flagged for delivery, not shipped as settled.
  - The same goes for the kit's "two working days".
- **Truthful states beat optimistic ones.** The kit form has three confirmations (mail client opened · request received · kit emailed), and only a real auto-sender may use the third.
- **A name built on "Oracle" needs a trademark check** against Oracle's third-party guidelines before launch.
- **A checklist is for ticking, not reading.** The first Internal panel gave every item a status chip, a flag and an "On the site" paragraph; Alex: "much less verbose (1–2 line items)". One line to tick; the analysis goes in the docs and the report.
- **Use the lightest storage that does the job.** "Saved" meant saved in Alex's browser, not a database. Check what a capability costs before reaching for it: `db` would have made the artifact organization-internal.
- **Unreferenced is not unshipped.** The customer logos had sat, unreferenced, under `site/assets/img/logos/`. Whole-tree publishes carried them onto the link-shared artifact, downloadable by path, until version 36 removed them. Anything that must never ship lives outside `site/`: the logos are now in `docs/asset-candidates/logos/`, and the checker fails if that folder reappears under `site/`.

## 8. The Internal review panel (temporary)

- **What it is:** an *Internal · N to confirm* pill at the bottom right of every page. It opens a checklist drawer with one line per assumption, grouped as in §2, and each item has a checkbox.
- **Where ticks are saved:** in the viewer's browser only (`localStorage` key `oracle-ai-solutions:review-ticks`), by item id. Alex chose this over a shared database: declaring the artifact `db` capability would make the artifact organization-internal and break the public preview link. Ticks never reach the repo; §2 is the record.
- **Files:**
  - `site/data/review.js` holds the list: groups of items, each with `id`, `text` and an optional `note`, where the note names what the site does not match yet.
  - `site/assets/review.js` renders the button and the drawer, styles included, with no other dependency.
  - Two `<script>` tags at the end of `site/index.html` load them.
- **Keep it short** (Alex: "1–2 line items"): `text` ≤ 70 characters, ≤ 47 when there is a note, `note` ≤ 45. No other keys: detail belongs in the docs. The checker enforces all of this.
- **Changing the list:**
  - Never rename an item's id; the ticks are keyed by it.
  - Remove an item once §2 records its outcome.
  - Run the checker and republish.
- **Visibility:** anyone with the preview link sees the panel. Set `enabled: false` to hide it without deleting anything.
- **Before launch:** delete both files and both script tags. Until then the checker warns on every run.

## 9. Open items

- **The brief (§2):** every item stays open until Alex confirms it in a session. The panel ticks are only his own progress marks.
- **Round 7 (PROVENANCE §23.4):**
  - delivery sign-off on *Plan vs actual investigation* in 4–8 weeks;
  - clearance for the stronger *Frontier AI* proof points.
- **Round 8 (§24.4):**
  - what sits behind `formEndpoint` for kit requests;
  - whether the mailbox is watched, and whether two working days is the right promise;
  - whether the kit is ready (most manifest links are still pending);
  - whether *all offers* is one bundle;
  - whether subdomains qualify;
  - where partner demo requests go.
- **Round 9 (§28.6):**
  - the H1's third line — *"Proven in weeks."*, against the two-word *"Proven fast."* / *"Proof first."*;
  - *"Document processing"* singular, against Alex's *"Documents processing"*;
  - the clock said two ways — *from 30 days* in the hero, *4–8 weeks* in every scope surface;
  - the platform short labels dropping the "Oracle" prefix on the rail, the chips and the stack;
  - *Oracle AI for Fusion Applications* on the stack and Services but not as a catalog filter;
  - the Services platform cards re-ordered to the canonical order;
  - two groups with no product today (Transaction & process execution · Video & image intelligence), whose tiles land on the catalog's empty state;
  - two home H2s still over the 30-character budget (delivery, about) — warned, not failed.
- **Round 10 (§29.6):**
  - the same ask still has three other phrasings **outside the product pages** — Home
    S7 *Send a request* / *Send the request*, Services *Let's talk* / *Request a
    scoping call*, the footer and delivery screen *Request a scoping call*.
    Recommended: unify on *Talk to us* next round;
  - the product *For sellers* tab is gone, its kit now the second tab of the Contacts
    switch, and `…/sellers` redirects — reversible, since the tab is data;
  - the mailto subject for a product request now reads `Talk to us — <product>`;
  - `large-document-extraction`'s `metricsNote` now points across tabs, to the case
    study on Use cases — the first cross-tab pointer on a product page;
  - **from Alex's same-day review (§29.7):** the stepper's frame is pinned by keeping
    the closed step bodies' cell, which costs up to ~64 px of air under a short
    description; a later round could close it by levelling the descriptions instead.
    768 and 320 were not looked at on that pass.
- **Inputs Alex supplies (HANDOFF §7):** demo videos and posters, Marketplace URLs, success stories, kit links, form endpoint, hosting subdomain, customer-name approvals, image rights.
- **At launch:**
  - the site name checked against Oracle's trademark guidelines;
  - the Internal panel removed;
  - `og:url` set.

## 10. Map of the docs

| Doc | Read it when |
|---|---|
| `README.md` | You need the folder layout, the routes, the config keys at a glance, the three walkthroughs or deployment |
| `docs/HANDOFF.md` | You need the exact run, verify and publish commands (§4), the standing rules in full (§3), the inputs list (§7) or the Node note (§9) |
| `docs/SCHEMA.md` | You add, rename or retire a `content.js` key |
| `docs/CONFIG.md` | You touch a switch in `config.js` |
| `docs/VISUAL-GRAMMAR.md` | You change a component or a page composition |
| `docs/PROVENANCE.md` | You need a fact's source or a round's decisions (§18 home, §20 name, §21 and §23 Services, §24 sales kit, §25 START-HERE, Internal panel and logos, §27 the SS26 theme, §28 the home page re-argued — three layers, six groups, Artifacts — §29 the product pages — one contact ask, the Use cases tab, the stepper). At 5,600 lines, search it; don't read it top to bottom. |
| `docs/SS26-THEME.md` | You touch either theme: what the current SoftServe brand is, the token map, the shape and colour rules, the fonts, and what is open |
| `docs/ASSETS.md` | You work on images, step frames or posters, and how they were made |
| `docs/HANDOFF-workforce-demo.md`, `docs/HANDOFF-erp-qa-demo.md` | You work on a walkthrough; each is owned by its own session |
| `.claude/references/client-documents.md` | You write marketing copy |
