# Start here — Oracle AI & Data Solutions mini-site

Read this page first in every new session. It holds what the site is for, the brief and the rules it is built to, how a round of work runs, and what earlier rounds learned the hard way. Detail lives in the docs mapped in §10. Keep this page current: when a requirement, rule or procedure changes, rewrite the line — never append a dated update.

Current as of 2026-09-29, after round 21: **a product's Overview is two columns from 1240 px** (Alex's option b). The problem and what changes, then How it works, fill a main column of two thirds, and the numbers stand in a widget beside it, pinned while all of it fits the window. Every number's chart is named Today and After bars with their values printed, the big figure on the bar it names. How it works is a row of step tabs over one screenshot with nothing drawn over it; where the eye needs leading, the screen itself shows the element selected, and the frame opens full size (PROVENANCE §56). Round 20, earlier the same day, rebuilt the product pages' Overview, Use cases and Contacts tabs against grey, one grey step and one contrast plate per screen, and took More detail off (§41). Between the two rounds, a sent form's confirmation takes its place with no panel of its own, and the copy names the practice *SoftServe’s Oracle dedicated practice* (§50); the home case studies lost their reference-call link (§51); the catalog's lead says what the buyer gets instead of the terms and how to filter (§52); and the home About tile opens on SoftServe's logo, on `#/` and `#/alt` alike (§53). Earlier the same day: the home page's contact became the ask alone, and a seller asks for one product's kit (§48); the two Q&A products run on two platforms (§46); the six group names set on two lines (§45); the *Internal* panel went (§44); hyphenated product names stay whole on phones (§43); and other sessions listed an eighth and a ninth product, *Fleet route optimization* (§39) and *Repair-or-replace decisions* (§42). Round 19 made every one-liner and home case card sell the business value (§40). Round 18 moved the Services page onto the home page (*Packaged services*, and a dark *Bespoke services* band after softserveinc.com's *Confidence earned*), made the home contact the product Contacts switch, added the footer's Oracle row and softserveinc.com's favicon, rendered no link-shaped control without its link, and ended the catalog on a *Looking for another solution?* tile (§38). Round 17 made the group tiles flat brand fills with one line drawing each (§37), round 16 re-voiced the home page (§36), round 15 made `links.json` the only file that stores a link (§35), round 14 cut the footer down to softserveinc.com's (§34), round 13 named each product's lead (§33), round 12 made the forms send real email (§32), and on 2026-09-23 the site moved into its own repository (§31). **The shared link shows round 20 with its contact band fix, §50's confirmation and practice name, §51's case-study rail, §52's catalog lead and §53's About logo** (artifact version 20, 1790695649-2c4e, published 2026-09-29 by §53's session; version 19, 1790694190-6dc7, carried §51's NDA line; version 18, 1790691408-6fa8, §52's lead; version 17, 1790690733-2aa5, carried §50 and §51; version 16, 1790687383-c586, carried the contact band fix: the heading inside the plate, the whole ask on one screen, no portrait tile, PROVENANCE 41.12) and Account insights' walkthrough (version 15, §49); the alternative `#/alt` home is on it only as its rejected first draft, while its version 2 is local and unpublished (§47), and the forms say the preview cannot send (§9).

## 1. What it is

- **The site:** one small site for SoftServe's Oracle AI & Data practice, named **Oracle AI & Data Solutions**. It offers *products* — AI agents and human-AI workflows on Oracle platforms, grouped into **six product groups**, one per kind of job (§4) — and *services*, both on the home page since round 18: **Packaged services** (the practice's five-stage track, from a proof of value **from 30 days** through integration to scaling) and **Bespoke services** (a standing team, the *AI factory*, for programs bigger than one product).
- **How it is used:** Oracle and SoftServe sellers open it live on a call, and customers receive it as a link.
- **People:** Alex owns the site and every decision on it. The first person on every contact card is Karsten Tramborg, **Oracle Partnership Director, SoftServe** (Alex, 2026-09-23; the pack one-pagers print *Alliances & Partnerships Director* and are unchanged — `ASSETS.md` §3.1). Since round 13 a product's Contacts card also names that product's lead (Alex, 2026-09-23):
  - **Vlad Butenko, AI Product Manager, SoftServe:** Account insights, Large docs processing and review, Workforce optimization.
  - **Dmytro Dudchenko, AI Product Manager, SoftServe:** Plan vs actual investigation.
  - **Oleksii Orlov, Distinguished Product Advisor, SoftServe** (Alex himself): Cross-system ERP Q&A, Business metrics Q&A, Case evidence collection.
  - Home names Karsten alone. The practice mailbox, oracle@softserveinc.com, is the one address printed for everyone.
- **Code:** a static, hash-routed SPA in `site/` with no build step and no framework.
  - **The site is on SoftServe's current brand** (`site/index.html` + `assets/site.css`):
    white ground, Azurio serif over Replica LL, Lviv blue with Austin orange, octagonal
    corner cuts. Read `docs/SS26-THEME.md` before touching it. The previous near-black
    theme is kept, runnable, as `site/index-legacy.html` + `assets/site-legacy.css` —
    an archive, not a second version to maintain. Images, renderers and copy are shared:
    logo paths go through `assets/brand.js`. **`content.js` is the live site's own
    copy** — new strings are stored in sentence case directly, and
    `data/content-case.js` only re-cases what is left from before the rebrand
    (20 rows since round 20, shrinking every round; never add one).
  - Copy: `site/data/content.js`.
  - Switches: `site/data/config.js`.
  - Page renderers: `site/pages/`, one per page.
  - Shared UI and the router: `site/assets/app.js`.
  - Forms: `site/assets/forms.js`. The emails they send: `mail/` — the words, the layout, the pictures, test or live — run by an n8n workflow; `mail/README.md` is its manual.
  - Links: `links.json` at the repo root holds every link a product uses and is the only file that stores one; it never ships. Each product is keyed by its slug, which is also the listing's slug, the pack's `slug:` in Oracle-Packaging-Skills and its walkthrough's folder `site/demo/<slug>/`. The site's `data/links.js` is never a file: `tools/site_links.py` builds it from `links.json` when asked, on every request in `tools/serve.py` and once per publish.
- **Preview:** two artifacts, one per theme, both **shared with anyone who has the link**, so every publish is live at once. Both URLs are also in `site.manifest.json`, which the packaging plugin reads; change them in both places.
  - **The site:** https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri. This is the one to publish to.
  - **The archive** (previous near-black theme, frozen): https://claude.ai/artifact/98wafGUphFSyGSr6ctJiiN (the same artifact as https://claude.ai/code/artifact/41e4f3b6-47d9-4ef2-af99-99c40c02b89b). Do not republish it.
  - **Open:** the archive's URL is the one that has been in circulation. If it needs to show the current site, the two have to be swapped — Alex's call.
- **Stage:** prototype, with the brief's assumptions still to be confirmed (§2). The *Internal* checklist that showed them on every page came off on 2026-09-29 (§8).

## 2. The brief

These are Alex's working assumptions as of 2026-09-17, and **each one is still to be confirmed**. This page is their only record, since the *Internal* panel came off the site (§8): a confirmation counts when Alex tells a session, and that session rewrites the line here.

- **Audience, in priority order:**
  1. Oracle sellers and partners.
  2. SoftServe sellers.
  3. End customers.
- **Positioning:**
  - Experts in AI and in Oracle's platforms, with a multi-year, top-class enterprise track record.
  - Ready-made solutions, fast proofs of value and a dedicated practice.
  - We offer products *and* services.
- **Commitments and disclosures:**
  - A proof of value is stated **three ways, on purpose**:
    - **4–8 weeks** in the scope copy of every product's Jumpstart tab (round 9; the Services page that also said it left in round 18);
    - **"from 30 days"** as the hero's one figure, the *from* set small beside it (round 9);
    - **floors on the home track** since round 16 (Alex): *From 4 weeks* for the Jumpstart, *From 3 months* for Integration and for Scaling, with no caveat row.

    All of them are still to be agreed with delivery. `tools/check-grammar.js` fails any other proof-of-value duration, a range on the home track, and a hero tile that is anything but `{ prefix: "from", value: "30 days" }`.
  - The proof-of-value price is the only price on the site. Every other package price goes in the sales materials.
  - No customer names, because no customer has confirmed we may use theirs.
  - The catalog holds both existing and planned products.
- **Communication flow:**
  - One mailbox, oracle@softserveinc.com, receives every request.
  - Karsten is the contact for communications.
  - Sales materials go only to corporate addresses at softserveinc.com or oracle.com.

**Where the site does not match the brief today** (left unchanged until Alex decides):
- **Test mode** (`mail/settings.json`): every request reaches the test inbox of whoever runs the sender, not oracle@softserveinc.com, and the emails go out from a temporary sender outside SoftServe's domain until a SoftServe integration replaces it (§9).
- Two products print an **Integration price** on their Jumpstart tab: *Large docs processing and review* and *Workforce optimization* (€300–500K services plus infrastructure).
- **No product is marked as planned**, so all eight read as available now.
- **Partners** are priority 1, but they cannot receive the sales kit, which goes only to @oracle.com and @softserveinc.com. The brief contradicts itself here.

## 3. The site, page by page

| Route | What it does | Record |
|---|---|---|
| `#/` Home | Nine screens: <br>• hero — a three-line H1, the lead that states **the promise** (SoftServe's practice and method with Oracle's platforms → your time to value), the **three-layer stack** (Oracle platforms → SoftServe product groups → SoftServe services, read bottom-up) <br>• the three-figure proof strip, led by **from 30 days** <br>• *What we offer* (products · services) — **two photographic panels**, the copy in white on each photograph under a scrim <br>• **six group tiles**, each **a flat brand fill** (blue 75, orange 75, blue 50, neutral 400, blue 75, orange 75) carrying the group's own **line drawing** at its top left, then its name, a one-liner and an arrow; the tile is the link into the filtered catalog <br>• **Packaged services** (the eyebrow since round 18; the header's *Services* lands here) — **five stages** across the width (Workshop · Jumpstart proof of value · Integration · Scaling · Managed services, the last optional) stated as floors; the track closes the screen <br>• **Bespoke services** (round 18) — the AI factory on a **full-bleed dark photograph** (softserveinc.com's *Confidence earned*), **directly under the track, its top in view when a reader lands on Packaged services**: head and lead and a filled *Talk to us* on the dark half, four points along the foot; on a phone copy, photograph and points stack <br>• *Why SoftServe on Oracle* — round 17's hairline list, on a screen of its own since round 18 <br>• anonymized case studies (Proven / Forecast / Estimated) — each card **a photo band** (the industry's picture, carrying the descriptor and area) **over a white body**, its figure carrying the noun it measures (*+4.5% productivity*) <br>• About SoftServe (the page's other dark screen, no partner marks since round 18), its tile **opening on SoftServe's logo**, the brand's lockup of spark and wordmark in the eyebrow's place, its one mark (§53) <br>• contact — **the product Contacts component, the ask alone** (round 18; its kit tab left on 2026-09-29): Karsten's card beside the *Talk to us* form, with no switch; a saved `#/#kit` lands on `#/sellers` | PROVENANCE §18, §28, §30, §36, §37, §38, §48, §53 |
| `#/alt` (and `/alt`) | **The alternative home page** (Alex, 2026-09-29), beside `#/` until he picks: the live page with three changes. <br>• S1, one dark screen: a photograph carrying only the H1, a white ask and an arrow link, with one line and the spark, dissolving into a solid ground of its own darkest tone (`#040d16`), where the promise and the three figures sit; S2's heading in view at the laptop sizes <br>• S2: the live page's two ways in, under *Everything to go live with AI.*, as dark tiles after softserveinc.com's Solutions tile. The picture runs across the top at 2 : 1 and dissolves into black, with the words on the black. The products tile has a new picture so the hero's oval is not repeated. <br>• *Why SoftServe on Oracle*: the portfolio diagram on the left, in Alex's wireframe: Packaged services over Products, Bespoke services beside both, Oracle's platforms under all three with AI Data Platform first. Each block is a name, a line of two to four words and a picture, under one SoftServe mark. The three reasons sit on the right. <br>• everything else rendered by `overview.js`, so the two versions cannot drift; links into a home screen stay on `#/alt` | §47 |
| `#/products` | Catalog with a facet rail (Oracle platform · what it does · Artifacts) and tiles. **Both radio rails are fixed lists** in canonical order — three platforms and all six groups, always — with a zero-count option disabled and printing no number; the one a deep link arrived on renders selected above its own empty state. *Oracle AI for Fusion Applications* is not offered (`catalog: false`): no product runs on it. No total, no denominator. `?cat=<id>` and `?tech=<id>` are both honored. **Every result ends on the ask tile** (round 18), *Looking for another solution?* into the home contact, with a product tile's anatomy; product tiles meet their photograph on a clean edge. | §17, §18.9, §28, §38 |
| `#/products/<slug>[/<tab>]` | Nine product pages (Fleet route optimization, §39, and Repair-or-replace decisions both joined on 2026-09-29). <br>• Tabs: **Overview · Use cases · Technology · Jumpstart · Contacts** (round 10). <br>• **Overview** (round 21) is, from 1240 px, a main column of two thirds and the numbers beside it: **Problem → What changes**, two plates one over the other, the problem on the grey step and what changes on the tab's one dark plate, each a headline over ≤ 30 words, then **How it works**, a row of step tabs, the open step's text and one frame showing the product's whole screen with nothing drawn over it (it opens full size), on one screen at 1440 × 900 and 1280 × 800; and at the right **What changes in your numbers**, a white widget of two or three tiles, each a business metric with its owner, a Proven, Forecast or Estimated chip, one figure and its Today and After bars, the figure printed on the bar it names, pinned under the tab bar while it fits. Below 1240 px the three stack in the order plates, numbers, screens. No rail, no More detail. <br>• **Use cases** opens on the industry tabs (underline tabs with no heading over them, round 13), the selected industry one split plate, then the case study, the tab's one dark plate. <br>• **Contacts** is the contact band: one white plate on a full-bleed grey band — the card (Karsten, then the product's lead, each a round portrait on the plate, over the one address; round 13) beside a two-tab switch, *Talk to us* (open by default) and *Get the sales kit* (for sellers), so only one form is ever open, and the whole plate, submit included, fits under the sticky tab bar on a 1512 × 850 screen (PROVENANCE 41.12); `…/contacts#kit` opens on the kit tab. The band runs into the footer. <br>• Retired segments redirect in place: `pov` → Jumpstart, `demo` and `sellers` → Contacts. <br>• The hero's video frame renders only with a recording in `links.json` (round 18: no placeholder frame); none has one yet. <br>• Six products have an interactive walkthrough under `site/demo/` (Account insights', §49, the sixth); the other three's How it works frames come from HTML mocks in `tools/step-mocks/`. | §15–§19, §22, §24, §29, §38, §41, §49, §56 |
| `#/services` | **Removed in round 18.** A saved link lands on the home screen that took over its section (`#/#how-we-deliver`, or `#/#request-a-demo` for `#contact`). | §21, §23, §38 |
| `#/sellers` | *Get the sales kit* for one product (work email at softserveinc.com or oracle.com), **emailed automatically** since round 12. Its *Kit for* select opens on *Choose a product*, which cannot be sent, and offers no kit for all offers (Alex, 2026-09-29). Below it, the demo form for a seller who already has an account in mind. | §24, §32, §48 |

- **Header:** Products · Services, plus *Talk to us*. Since round 18 *Services* lands on the home page's Packaged services screen and *Talk to us* on its contact. *For sellers* is not in the header (Alex, 2026-09-17).
- **Footer:** softserveinc.com's footer, cut down (Alex, 2026-09-24). A link row — *For sellers*, then the brand's *Privacy Notice* and *Terms and Conditions*, then *SoftServe website* — and, since round 18, a second row of text links to Oracle's pages: *Oracle Autonomous AI Lakehouse* · *Oracle AI Data Platform* · *Oracle Cloud Infrastructure* · *Oracle website* (Alex). SoftServe's eight social glyphs sit on the right, over a copyright row: *© Copyright {year} SoftServe Inc.* and the SoftServe spark. No Oracle or NVIDIA marks, no hot links, no office address, no contact block, no frame around the links; the checker holds all of it.
- **Site icon:** softserveinc.com's own, the white spark on black (round 18). *For sellers* stays first because it is the only permanent way to `#/sellers` (a product kit confirmation's *Get the full kit* left with the all-offers kit, §48).

## 4. Standing rules

These hold unless Alex changes them, and `tools/check-grammar.js` enforces most of them. The full wording is in HANDOFF §3 and in AO-Personal-OS's `.claude/references/client-documents.md`.

**Content**
- Every word lives in `content.js`, and renderers only read data. No invented facts, numbers, customers or URLs. Log every new line of copy in PROVENANCE.
- **No customer names or logos** in anything shipped. Describe customers by industry and scale. The checker and the deny-list grep both enforce this.
- **No Oracle partner-standing claim**: no tier, no award. What may be said is joint delivery with Oracle's AI & Data organization.
- **Naming:**
  - **The six product groups**, in this order and these exact words, on the hero stack, the home tiles, the rail and every product chip (`chip` equals `full`, so a group has one name): **Enterprise knowledge & analytics · Deep research & investigation · Document processing · Transaction & process execution · Forecasting & optimization · Video & image intelligence.**
  - **Oracle platforms, two forms of each name** (round 9): the **short label** on the rail, the product chips, the tile image band, `tags[1…]` and the hero stack — *AI Lakehouse · AI Data Platform · AI for Fusion Applications · OCI + NVIDIA NeMo* — and the **full Oracle product name** in prose and in the footer's Oracle row: *Oracle Autonomous AI Lakehouse · Oracle AI Data Platform* (never "AIDP") *· Oracle AI for Fusion Applications · Oracle Cloud Infrastructure + NVIDIA NeMo*. One canonical order, that one, everywhere. "OCI" alone is still fine in running text.
  - **A product runs on one platform, or on two where its own engine is part of both** (Alex, 2026-09-29, PROVENANCE §46): *Cross-system ERP Q&A* and *Business metrics Q&A* carry *AI Lakehouse* and *AI Data Platform* — a chip, a tile plate and a rail count each — because Select AI over Autonomous AI Database runs on its own or inside AI Data Platform, which includes that database. A platform a product merely sits beside stays a Technology-tab item. The checker makes a second platform name itself in the Technology tab's narrative and Data & platform layer.
  - **The delivery tiers are Jumpstart proof of value · Integration · Scaling** — never "Scale" as a tier title (the hero stack says *Scaling*, and one page may not carry both words for one thing). "Scale" as a verb in prose is untouched.
  - **The delivery method is five stages** (Alex, round 16), on the home track and the Services track alike and in this order: **Workshop · Jumpstart proof of value · Integration · Scaling · Managed services.** *Discovery* is retired. The managed service is the customer's choice: its copy says they may take it, never that they should.
  - **The walkthrough is an "Interactive demo"** — the badge, the rail checkbox, the tooltip and, since round 10, **the button in the product hero and in the pending-video panel** all say it, under the *Artifacts* group; the checker asserts the button's label equals the badge's. "Demo" alone is retired as a label, and *"Try the interactive demo"* went with it. The button carries the badge's own `cursor-click` glyph **leading** the label and no trailing `external` glyph — one icon per button.
  - **One contact ask, and it is *Talk to us*** (round 10). The header button, the product hero's primary button, the Contacts switch's first segment (on a product page and, since round 18, on the home page), the form's submit under it, the Bespoke band's button and the route out of the sales kit all read `site.primaryCta.label`, and the checker asserts each one. *Request a demo* is retired as a label — the raw text of `content.js` fails on it — while the `request-a-demo` **anchor id** stays, because every product page and the header deep-link to it. Since round 18 no other phrasing is left: the home contact took the product switch's *Talk to us*, the Services page's *Let's talk* and *Request a scoping call* left with it, S4's button is gone, and the catalog's ask tile says *Talk to us* (Alex's *Let's talk* for it is open, §9).
  - NVIDIA products: "NVIDIA" (never "Nvidia"), "AI-Q", "cuOpt", "NeMo".
  - GigaCloud never appears.
  - **The practice is *SoftServe’s Oracle dedicated practice*** (Alex, 2026-09-29: *"to disambiguate"*), wherever copy names it. Never *the Oracle practice*, which on a site named after Oracle reads as Oracle's own team, and never *the practice* alone. Uses that already carry their owner stay (*SoftServe’s leading AI practice*; *a large, dedicated practice of experts* under *we*). The checker fails both short forms in `content.js`.
- **Prices:**
  - A price never ships without its disclaimer.
  - Beyond that, the brief in §2 applies (still to be confirmed).
- **No totals and no gaps.** Never print the size of the catalog ("seven products"). Never name what is missing ("yet", "so far").
- **A case study states its status once**, in one word: the chip. **And a home case card speaks business value, with no footnote** (Alex, round 19: *"no justifications for reviewer and unnecessary disclaimers"*). The figure's small line says what it measures and against what; the one line gives the customer's old way and what changes, or, on an `Estimated` card, the problem as it stands. No engine, no engagement mechanics, no legal hedge. A forecast's two load-bearing facts (simulated, on the customer's own history; PROVENANCE §4) ride in its small line. The checker holds all of it.
- **A product's numbers are business metrics, honest in their own framing** (Alex, round 20: *"should focus on clear use-case specific ROI"*; *"they should not lie but should [not] apologize and disclaim their value"*; *"No justification for reviewer notes pls"*). Each KPI tile on a product's Overview is a metric a named buyer-side owner already tracks and the product moves directly, with that owner printed and a **Proven**, **Forecast** or **Estimated** chip. Its figure is a measured before → after, a range, or a *from X* baseline — never a bare unit word — and **its chart is the plainest comparison, with the figure printed on it** (Alex, round 21: the charts *"hard to understand from graphics … it should not puzzle the reader"*; *"matching between number and the visual is absolutely unclear"*): rows named Today and After, each bar printing its value at its end, the value the figure names in bold. No legend, axis or scale to decode (`VISUAL-GRAMMAR.md` §2.4). **Never a footnote, a method note, an ROI paragraph or a pointer to another tab**, and never an accept rate, a coverage figure, a delivery duration or a feature. Where a figure comes from is recorded in PROVENANCE §41.4, never in `content.js`, which ships in view-source: the checker fails a `sources` key (`VISUAL-GRAMMAR.md` §2.4).
- **Forms send in the background, as on any website** (Alex, 2026-09-24). A form posts, shows *Sending…*, then confirms the outcome: *Thanks, your request is in* or *Check your inbox*. **No form ever opens the visitor's mail app.** A copy that cannot send (the claude.ai preview, a local run without `site/data/endpoint.local.json`) says so under each form before anyone types. A failed send is a red line under the form, which keeps what was typed. Never say "we've emailed" unless the sender answered that the email went out. The checker fails a mail-app fallback in `forms.js` or in the copy.
- **No link-shaped control without its link** (Alex, round 18: *"No fake and placeholder links no longer allowed"*). The hero's video frame renders only when `links.json` holds the recording; the Marketplace badge only with its listing's URL; the demo badge and button open what `links.json` names. The checker fails the retired `video` switch, a Marketplace flag with no URL and the old *being prepared* panel.
- **Every kit link lives in `links.json`**, outside `site/`, because anything under `site/` is readable in view-source and the kit documents carry prices. `config.js` holds no link to a kit artifact, and a committed `formEndpoint` fails the checker: a live trigger URL never enters git.
- **A link is stored in `links.json` and nowhere else** (Alex, 2026-09-24). The site and the email both read that file, and no other file keeps a copy: not `site/` (the checker fails `site/data/links.js`), not a doc, not a pack spec. A doc names the key (`links.json` › `<slug>.<key>`) instead of repeating the URL, and the checker fails a link from `links.json` found in any other file (`docs/PROVENANCE.md`, the round log, excepted). A walkthrough is stored as its path, `demo/<slug>/index.html`, never as a localhost or preview address.
- **Nothing internal ships in site copy**, with no exception since the *Internal* panel came off (§8).

**Messaging** (from Alex's reviews)
- **A message read outside the product stands alone** (Alex, 2026-09-23, on the kit email's opener *"Thanks for requesting it."*). An email is read cold, in an inbox, by someone who may not remember the form: its first sentence says who is writing and what it is, and nothing leans on "it", "the site" or "the team" before naming them. Review email copy in `.work/mail-preview/as-read.txt` (the email as received), never field by field (`mail/README.md`).
- **Persona first.** Every headline speaks to its reader (a rep on a live call, a buyer on Oracle) in that reader's words. Never counts, taxonomy or packaging terms ("workflow pattern", "ready-to-run"). **Alex's own labels are the exception** (round 18): *Packaged services* and *Bespoke services* name the two ways to buy the practice, and *pod-based delivery* is his element of the AI factory; they are positioning, not scaffolding.
- **A one-liner sells the business value, never the implementation** (Alex, round 19: *"focus not on the aspects of the tech implementation, but on the very specific business value"*). A product's `oneLiner` (its hero lead, its catalog tile and the kit email's opening line), its hero line and a group's tile line lead with what the buyer's business gets (time, money, risk or capacity) for a named role and object of work. Any *how* is what changes in that person's work, in plain words. The platform, engine and data architecture belong on the chips and the Technology tab, and the checker fails their names in those fields. Only a Proven figure goes in a one-liner, and it never repeats its tile's bullets or its hero line word for word.
- **The hero lead is the promise, not the procedure** (Alex, round 16, replacing a lead that walked through *a fixed-scope Jumpstart … in your tenancy*). It says what SoftServe and Oracle bring and what the reader gets: the time to value. The stages, the scope and where it runs belong to S4. **Alex's headings may restate it** (round 17: his S4 heading, *Service delivery that accelerates time to value.*, replaced round 16's facet *The method behind the speed.*): the promise sits in the hero lead, the S2 bullet and that heading, and body copy never adds a fourth. The checker fails a procedure word in the lead, *time to value* more than three times on the page, and an S4 heading without it.
- **No line answers a reviewer** (Alex, three times on 2026-09-29: the home case cards, the KPI tiles, and the catalog's lead, which stated where it runs, how it starts, the price's terms and how to filter: *"looks like a justification to reviewer, not a marketing copy"*). A lead, a card's line or the words under a figure say what the reader gets. A condition (a price's terms, the hosting, how a stage starts), a method or how to use the page goes to the tab or control that owns it, or nowhere. A flagged phrase is fixed by rewriting its sentence from the reader's seat, never by a more defensible restatement of the same disclosure: that is how the catalog's lead became three disclosures and a user manual, one patch at a time (PROVENANCE §52). The checker holds each surface where Alex has said it: the case cards (§40), the KPI tiles (§41) and the catalog's lead (§52).
- **A section's H2 names what it offers and what the reader gets, in plain words** (Alex, round 17, twice in one day: restoring *…with accelerator apps* after round 16 had polished his *Applications to kick-off your AI adoption* down to *Kick off your AI adoption.*, and *Service delivery that accelerates time to value* over round 16's *The method behind the speed.*). A clever facet loses the concrete message. The noun the owner chose for the offer is positioning, not a duplicate label: the eyebrow over it is 12 px micro-type and does not carry the message. Polishing an owner's draft keeps its meaning, its key verbs and that noun; it cuts only a heading that merely lists what the elements under it already name.
- **A label earns its words** (Alex, 2026-09-23, round 13, on *By industry* and *See all products, with filters*). Don't put a heading over controls that already name what they hold: a tab bar that says *Use cases* and a row of industry tabs need no *By industry* between them. Don't let a link describe the page it opens (*with filters*); it names where it goes. The checker enforces both instances.
- **Structure before copy.** Work out the audience, then the positioning, then three or four messages, then one screen per message, and set the length target first. A page is an argument, not an inventory.
- **Headings are display lines**, so the argument moves into the lead:
  - H1: two to four words, ≤ ~24 characters a line, two lines at most.
  - H2: five words or fewer, ≤ ~30 characters.
  - Light-band title: ≤ ~28 characters.
  - Check where the line breaks on a phone: no lone short word on a line, and no product name split at its hyphen (the renderer keeps a compound whole; PROVENANCE §43).
  - Check the titles of peers side by side at every width their grid changes at: they take the same number of lines. Set the break and fit the size to the tile; never leave the count to the viewport, and never rename to fit (PROVENANCE §45).
- **Repetition:**
  - No content word three times on one screen.
  - One word for one thing across the whole site.
  - No claim repeated in more than two places.
  - Peers side by side never open on the same words; the checker asserts it for the case cards.

**Design** — the rules below hold for BOTH themes except where the SS26 column differs.

| Rule | The archive (`index-legacy.html`) | **The site** (`docs/SS26-THEME.md`) |
|---|---|---|
| Ground | near-black, at most **one light band** per page | white; **dark screens are rare and never adjacent** — two on the home page since round 18 (the Bespoke photograph and `#about`, the case studies between them), none elsewhere; `#edf0f2` for cards; a product page carries **one `#1a1a1a` plate per tab view** (round 20), a plate with its own cut, not a screen |
| Accent | one teal `#35CCBA` per screen | **two roles**: `#1485c4` = act on / selected, `#f46a4a` = one hero accent line per page; orange 75 `#fe8d6b` marks a fact, the dash over a figure (round 20). Facts are neutral: no status colour on a metric |
| Display type | Montserrat 900 **uppercase** | **Azurio serif, 400, sentence case**; H2-H4 in Replica 400; uppercase only as 12-16 px micro-type at +.06em; a product page's KPI and case figures in Replica Light, never Azurio (round 20) |
| Shape | radii, `9999px` pills | **octagonal `clip-path` cuts** 4/8/12 px; `border-radius: 0` but inputs (2 px) and dots |
| Elevation | glows | **surface steps**; no shadow, no lift, no press-scale |
| Fact vs filter pill | filled navy is a fact, outlined is a filter | filled grey is a fact, outlined is a filter, blue tint is **selected** |
| Heading budget | H1 2-4 words, ≤ ~24 chars a line | H1 ≤ 15 chars a line × 2 (the home H1 is the exception: three short sentences, each on its own line — four lines at 375, five at 320); product name ≤ 22 × 2; **H2 ≤ 30, now enforced** — the S2, S4 and S5 home H2s fail over it, the rest warn; S3's (52, round 18) and S4's (48, round 17) are Alex's own lines and fail over their own length |

Holding for both: 1.5 px line icons (except the home Why rows since round 17: the brand's feature icons, 64 px at a 3 px stroke on no well, as softserveinc.com's icons grid draws them) and no emoji · peers are equal height · an address is
a link, never a filled button, and a filled button is the screen's one ask · copy sits on
a photograph only where the component is a photograph by design — a product hero, the
home page's two ways in, the Bespoke band's dark half, the home case card's band
(descriptor and area only) — and always under a veil or scrim; a tile keeps its copy off its image, and the home hero
carries no photograph · clean at 375, and the H1 still holds at 320.

**No grey on grey on the home page** (Alex, rounds 11 and 16: *"not to be grey"*, *"not so boring/grayish"*). A home card rests white with a 1 px hairline and takes its colour from a photograph; a list of reasons is rows between hairlines, never grey cards. `#edf0f2` is a hover step, never a resting fill. The references are softserveinc.com's photograph-topped Solutions cards and its "Our Expertise" list (PROVENANCE §36.2).

**Schematics and photographic heroes** (Alex, 2026-09-29, reviewing the first `#/alt`; PROVENANCE §47):
- **A schematic sits on light grounds.** Black panels behind white or colour are too much contrast (*"black background is not so good"*). The colour belongs to the tiles; a card is white with a hairline, or a brand tint.
- **One mark per company in one graphic** (*"make sure we don't have SoftServe logo twice"*).
- **A diagram sits beside the blocks it explains, compact**, never split under them (*"not best practice"*).
- **A schematic names its blocks and draws the rest** (Alex, on the third `#/alt`: *"diagram is overloaded with text"*). Each block gets a name, one line of two to four words and a picture. The items the page lists elsewhere (group names, step names) stay there. A caption that restates its picture goes. The diagram carries the structure, not the inventory.
- **A photographic hero carries the claim and the ask, nothing else** (*"left side looks overloaded"*):
  - The promise and the figures go on a band beneath, at display size (*"metrics look too tiny"*).
  - On a dark photograph the ask is the brand's white button and a second route an arrow link (*"the buttons … look weird on this background"*).
  - A drawn line may split the photograph in two, never into cells (*"divide content into … 4 cells"*).
- **Size a hero's H1 as a block, not to the space** (Alex, the same day: *"I don't like the amount of spaces taken by texts"*). Four lines of the claim take about half the photograph's height, so the picture keeps its room.
- **Figures in a row get room to spare** (*"how metrics fall on each other"*). A figure is sized with a margin in its column, never fitted to fill it: a fitted *from 30 days* ran into *1,000+* with 21 px between them. Measure the closest pair at the narrowest width the row holds.
- **On a photo tile the words sit on a flat dark field, and the picture is never drawn past its pixels** (Alex, on S2's tiles: *"text is hard to read, images are bad resolution"*). This follows softserveinc.com's Solutions tile:
  - The picture keeps close to the file's own proportions. On a 2× screen it gets at least one file pixel per screen pixel, so no full-bleed stretch over a squarer box and no hover zoom.
  - The picture dissolves into the tile's ground where the words start. A scrim over a busy photograph is not a fix.
  - Measure `naturalHeight` against the drawn height before calling a picture sharp. A file that is itself an upscale stays soft at any size.

**On a product page: one grey step and one contrast plate per screen** (Alex, round 20: *"all blocks are too greyish"*; softserveinc.com's own rule, as measured in PROVENANCE §41.1). The grey step is one `#edf0f2` plate a viewport — the problem plate, the industry plate's copy half, the contact band — and never a grey tile in a grey card or a grey input on a grey surface. The contrast plate is one `#1a1a1a` plate with its own cut a tab view: *What changes* on the Overview, the case study on Use cases. The numbers widget is white on a hairline, its figures in Replica Light under an orange-75 dash. The contact band is a page's last grey, and the footer's grey spacer is not drawn after it (`SS26-THEME.md` §3, §5; `VISUAL-GRAMMAR.md` §8).

**A product's Overview is a main column and the numbers beside it** (Alex, round 21: *"Problem solution and the How it works taking the central space (left; 4/7 to 2/3 of width); and ROI metrics look like widget on the right … problem solution should be central"*). From 1240 px the main column is two thirds (the checker holds it inside his 4/7 to 2/3), holding the plates one over the other and then How it works; the widget stands in the other third, pinned under the tab bar while all of it fits the window and scrolling with the page when it does not. The markup keeps the argument's order, plates, numbers, screens, which is the one-column order below 1240 px and a screen reader's (`VISUAL-GRAMMAR.md` §2).

**How it works fits one screen, and its frames are the product's whole screen with nothing drawn over it** (Alex, round 20: *"Can't fit the entire block to a single screen, which is bad"*; *"ideally, screenshots be fullscreen; they should not look like skeletons"*; round 21: *"I don't like these blue highlights and callouts. Just have screenshots without those callouts … make sure the layout element is selected or highlighted natively (only if needed, not all screens need that)"*). A row of step tabs, the open step's text, then one 16:10 frame: 721 px at 1440 × 900 against 791 under the header and the tab bar, 638 at 1280 × 800 against 691; from 1100 to 1239 px the steps stand as a list beside the frame. Two type sizes, 18 and 16. Each frame is the product's whole screen, from its walkthrough or its HTML mock, on synthetic data: no ring, no inset, no arrow. Where the reader's eye needs leading, the screen itself shows the element selected, open or in view, as the product would; most screens need nothing. The frame opens full size, and on a phone the reader pans across it (`VISUAL-GRAMMAR.md` §2.2, `ASSETS.md` §1).

**A group tile is a flat brand fill carrying its group's own drawing** (Alex, round 17: tiles *"colored / styled like Our offers tiles"* on softserveinc.com's AI page, and round 16's *"mix of screenshots with backgrounds"* rejected). No border, hairline, shadow or photograph. The six fills run blue 75 · orange 75 · blue 50 · neutral 400 · blue 75 · orange 75, the one order in which no two touching tiles share a fill in any of the three grids; the one neutral tile is the set's rest on a white ground, not grey on grey. Every word and line on a fill is `#1a1a1a`. **A tile's picture carries its tile's idea at a glance: one picture, one idea**, drawn in the brand's own illustration language (one 1.75 px line, cropped by the tile's top and left edges, gathering into one filled spark at the moment of value). A decorative background under a shrunken screenshot is two pictures and no idea: at tile size the UI cannot be read, and the photograph says nothing about the job. The six drawings are one program, `tools/draw-groups.js`: change a composition there and re-run it, never hand-edit one SVG. The checker holds `.gtile`, the fill order, the adjacency and each drawing file to it, and the Why rows to theirs.

**A peer tile carries its peers' anatomy, never a stretched sparse box** (Alex, round 18, on the catalog's first *Looking for another solution?* tile: *"looks too empty"*). A tile in an equal-height grid takes its tallest peer's height, so a title and two lines on a flat fill stood ~70% empty beside a product tile. The fix is structural: the same slots — a picture where they carry one, a list where they list, the action at the foot — each filled with the tile's own content; never shrink it, never pad it with air. The checker holds the ask tile's anatomy; the general rule is also AO-Personal-OS `slide-design.md` rule 14. **A product tile's photograph meets its body on a clean edge** (round 18, as softserveinc.com's cards do): no veil between them, and the platform label sits on the brand's translucent chip plate.

**Peer names in a row take the same number of lines** (Alex, after round 19, on the six group tiles; PROVENANCE §45: *"some headings now are 2 lines, some 1 line, so content looks not so clean; fix line breaks (not allowed to do tile renaming)"*). Left to the viewport, names of different lengths wrapped to different counts in some row at every width from 320 to 1920, and everything under the shorter ones started higher. So the break is set, not left to the width: every group name is two lines, broken before its last word, and the name's size fits its tile so the first line never wraps (`VISUAL-GRAMMAR.md` §9). The names stay as written; renaming to fit is not the fix. The checker holds the break, the fit, the one-column step at 720 and each name's first line to 22 characters. The site's other titles were audited in the same pass: the catalog's product names hold one line in every row, and the product step strip, the hero stack's tiles and the case cards' bottom-anchored descriptors wrap inside boxes where a ragged line moves nothing below it.

**A second way to buy shows under the first** (Alex, round 18: landing on Packaged services, the Bespoke band must be *"slightly but sufficiently visible"*, or the packaged track reads as the whole offer). So nothing stands between the track and the band (the Why list moved after it), home anchors land with the screen's top edge under the header rather than 96 px down, and short desktop windows (≤ 800 px tall) tighten every home screen's padding. Measured after the header's *Services*: the band's eyebrow and heading show at 1366 × 650 and up, its eyebrow at 1280 × 620. On a phone the vertical track is taller than the screen, so the band follows it.

**The home contact is the product Contacts switch** (Alex, round 18: *"equivalent (texts, CTAs, etc., flow)… though logical difference to be preserved"*): one component, `UI.contactSwitch`, and only data differs (`VISUAL-GRAMMAR.md` §8). The checker fails either surface rendering a form of its own.

**The home page carries no sales kit, and a kit is one product's** (Alex, 2026-09-29: the *Get the sales kit* tab *"should not appear on the main page"*, and *"no 'all kits' option in dropdown"*). The home page passes the component no kit, so it renders the ask alone, with no switch; a seller finds the kit on each product's Contacts tab and on `#/sellers`, and a saved `#/#kit` lands there. The `#/sellers` select lists the products only and opens on *Choose a product*, which cannot be sent, and no confirmation offers a full kit. The checker holds all of it.

**A confirmation takes its form's place, with no surface of its own** (Alex, 2026-09-29, on the home one's blue panel: *"now a bit ugly"*). No fill and the column's full width, because the plate is the surface; the check in the theme's icon well, a 28 px title a step under the H2, the body at body size. On the Contacts switch it takes the whole pane, including the lead that asked for the input (`VISUAL-GRAMMAR.md` §8, PROVENANCE §50). The checker holds it.

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
   - Run `git pull` and `git log` in this repo, and read every file you will edit fresh from disk.
   - Another session publishes this same tree: Alexs-MacBook-Air, which owns the walkthroughs under `site/demo/`.
   - git-autosync commits this repo every ~30 s on Alex's Mac (its agent lives in AO-Personal-OS, `automations/git-autosync/`).
2. **Brief.**
   - Opus gathers the facts from the decks, the site and the wiki in AO-Personal-OS, `context/areas/softserve/oracle*.md`.
   - It labels each fact: [site] already on the site · [pub] from a deck, publishable · [clr] needs clearance.
   - It writes a short brief to the scratchpad.
3. **Decide.**
   - One Fable pass, working from the brief, makes the messaging, UX and design decisions and writes the copy.
   - Opus does the rest: research, build, checker, QA, publish, docs.
   - The report says which steps used Fable. Token efficiency matters: one compact Fable pass, not a fan-out.
4. **Build.**
   - Run `node --check` on changed JS, then `node tools/check-grammar.js`, which must print OK. After a `links.json` change run `node tools/sync-links.js` first (it validates the file); after an email change, `node tools/mail-preview.js --sample` and a cold read of `.work/mail-preview/as-read.txt`.
   - Turn every new owner rule into a checker assertion, so it survives the next rewrite.
5. **Look, then publish** (§6).
6. **Record.**
   - Add a new PROVENANCE section: the asks, the split, the decisions, a before/after table, the checks and *Open for Alex*.
   - Update SCHEMA, CONFIG, VISUAL-GRAMMAR and README wherever the contract moved.
   - Rewrite this page wherever the brief, a rule or a procedure changed.
   - Bump `contract.round` in `site.manifest.json` when the round moved a content key, a switch, a tab, a checker rule or a publish rule; the packaging plugin compares it with its own.
7. **Report** to Alex: what changed, what was decided differently and why, and what is still open.

## 6. Run, QA, publish (short version)

Exact commands are in HANDOFF §4.

- **Run.**
  - Start the server with `preview_start {name: "oracle-site"}`: `tools/serve.py` on 8765, answering this Mac only and never cached, so a reload always shows the saved files. It also answers `data/links.js` from `links.json`; a plain `python3 -m http.server` does not, and the *Interactive demo* buttons disappear under it. With `site/data/endpoint.local.json` present, the forms really send, in the sender's test mode (`mail/README.md`, "Testing").
  - Browse `http://127.0.0.1:8765`, not `localhost`.
  - A QA subagent can kill the shared server; restart it before blaming the page.
- **Fresh assets.** The preview caches hard. Call `fetch('<file>', {cache: 'reload'})` for every changed file, or re-point the stylesheet link with `?v=`, then navigate.
- **Layout QA.**
  - Check every changed screen at 1440, 1280, 1024, 768 and 375, and the H1 at 320.
  - Hide the other `#app` sections and add `is-in` to the `.reveal` blocks, so each screenshot is taken at scroll 0 (screenshots taken after scrolling come back black).
  - Check horizontal overflow at every width.
  - **A component's states are screens too** (2026-09-29: round 20 rebuilt the contact band and checked the resting form, and the confirmation kept a panel drawn for the old ground until Alex found it *"a bit ugly"*, §50). After restyling a form, look at its confirmation, its error line and its cannot-send line on the new ground, not only the resting fields. Reach the confirmation through a stub inside the page that answers the POST (`window.fetch` wrapped for POST, `SITE_CONFIG.formEndpoint` set to an `.invalid` host), so nothing is sent.
  - A component moved to a new page takes its wrapper, modifier classes and breakpoints with it.
- **Gates.** All three must pass:
  - the checker prints OK;
  - the console is clean on every route;
  - `grep -ri "bosch\|riyadh\|dhl\|sbg\|logos/" site --include='*.js' --include='*.css' --include='*.html'` returns nothing. In zsh, quote the globs. If ugrep hits its complexity limit, use `/usr/bin/grep`.
- **Publish** — each theme to its own artifact (§1); never cross them.
  - Strip the nine skeleton lines (listed in `site.manifest.json`, `publish.wrapper`) from `site/index.html` into `.work/publish/index.html` (exact-line `grep -v -x -F`, HANDOFF §4). A session opened in another folder publishes from a copy staged in its scratchpad.
  - The publish must carry `assets/fonts/*` with an explicit `contentType`, and only what the page references — nine legacy files and `assets/site-legacy.css` are deliberately absent from the artifact.
  - **Diff every file you map against its live copy first** (`action: read` with `paths`). Sessions share one working tree, so a file you changed can also hold another session's unfinished work. When the diff shows more than your change, publish the live file plus your hunks, never the tree's copy: §52 did it for `content.js`, and §53 for `site.css`, whose tree copy held a product-page rebuild the live `product.js` could not render.
  - Call the Artifact tool with `file_path` = that wrapper, `root` = `site`, and a `files` map of every changed or new file — **images included**: `assets/img/groups/*` since round 9 (since round 17 the six `<id>.svg` drawings; the retired JPGs left the artifact on 2026-09-28), `data/links.js` since round 12 (without it every *Interactive demo* button disappears from the artifact; since round 15 it is built for each publish with `python3 tools/site_links.py --out .work/publish/data/links.js` and mapped from that file, because `site/` holds no copy), `assets/img/softserve-star-white.svg` since round 14 (the footer's spark), and since round 18 `assets/img/bands/*` (the Bespoke band's photographs) and `assets/img/groups/ask.svg` (the catalog's last tile), and since §53 `assets/img/brand/softserve-logo-white.svg` (the About tile's logo). Files left out of the map are kept, so a new file that is not in it never reaches the artifact, and **a deleted file must be mapped to `null`**: round 18's publish carries `"pages/services.js": null`, and the 2026-09-29 publish that took the *Internal* panel off carried `"data/review.js": null` and `"assets/review.js": null` (§8). A walkthrough folder under `site/demo/` that `links.json` does not name yet is work in progress and stays out of the map.
  - Then run `action: list_files` to confirm that the new files are live and that nothing is published that should not be.
- **Refused publish** ("not built on the newer version") means another session published in between:
  1. `read_file` the live copies of the files you changed.
  2. Diff them against local; the working tree is the merge, less any other session's unfinished work (above).
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
- **Truthful states beat optimistic ones, and a fallback must not hand the visitor a mechanism.** The kit form confirms only what happened: *request received*, or *kit emailed* when the sender says it went out. Until 2026-09-24 a copy with no endpoint opened the visitor's mail app under a success mark. Alex read that as broken, so a copy that cannot send now says so plainly instead.
- **A name built on "Oracle" needs a trademark check** against Oracle's third-party guidelines before launch.
- **A checklist is for ticking, not reading.** The first Internal panel gave every item a status chip, a flag and an "On the site" paragraph; Alex: "much less verbose (1–2 line items)". One line to tick; the analysis goes in the docs and the report.
- **Use the lightest storage that does the job.** "Saved" meant saved in Alex's browser, not a database. Check what a capability costs before reaching for it: `db` would have made the artifact organization-internal.
- **Unreferenced is not unshipped.** The customer logos had sat, unreferenced, under `site/assets/img/logos/`. Whole-tree publishes carried them onto the link-shared artifact, downloadable by path, until version 36 removed them. Anything that must never ship lives outside `site/`: the logos are now in `docs/asset-candidates/logos/`, and the checker fails if that folder reappears under `site/`.

## 8. The Internal review panel (removed 2026-09-29)

- **What it was:** an *Internal · N to confirm* pill at the bottom right of every page, opening a checklist of the brief's assumptions (§2), one line and a checkbox each, with the ticks kept only in the viewer's browser. It went up on 2026-09-17 (PROVENANCE §25) and came off on Alex's word on 2026-09-29 (§44).
- **What holds its place:** §2 is the brief's only record and §9 the open items. The list's two *Before launch* lines, the site name's trademark check and backing for the *Frontier AI* claim, were already in §9.
- **Kept out:** the checker fails if `site/data/review.js` or `site/assets/review.js` exists again, or if either index file loads a `review.js`.
- **Off the shared link** since version 1790678606-4e27 (2026-09-29), whose publish mapped both files to `null` (§6).

## 9. Open items

- **The brief (§2):** every item stays open until Alex confirms it in a session.
- **Round 7 (PROVENANCE §23.4):**
  - delivery sign-off on *Plan vs actual investigation* in 4–8 weeks;
  - clearance for the stronger *Frontier AI* proof points.
- **Round 8 (§24.4):**
  - whether the mailbox is watched, and whether two working days is the right promise;
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
  - one home H2 still over the 30-character budget (about) — warned, not failed. The delivery H2 came inside it in round 16.
- **Round 10 (§29.6):**
  - the product *For sellers* tab is gone, its kit now the second tab of the Contacts
    switch, and `…/sellers` redirects — reversible, since the tab is data.
- **Round 11 (§30.6):**
  - the Plan vs actual story still calls *Every variance* "the figure above";
  - the S5 card treatment was not measured against softserveinc.com's resource cards
    (the research did not reach them); it follows the Solutions cards and Alex's words;
  - 320 px, reduced motion, print and non-Chromium browsers were not looked at;
  - joint delivery with Oracle's AI & Data organization and *"Scope, timeline and
    price on every product page"* left the home page with S2's old bullets.
- **Round 12 (§32.6):**
  - **the sender:** SoftServe's Azure AD requires admin approval for n8n, so the pilot sends from a temporary address outside SoftServe's domain. **It blocks going live:** of round 12's six test emails, Zoho accepted all six and Alex's SoftServe inbox got one, 49 minutes late, with neither kit among them (§32.9). The real integration is a SoftServe app registration for Microsoft Graph, which needs an IT request (`mail/README.md`, "Replacing the sender");
  - **test to live:** `mail/settings.json` `mode`, once Alex has seen the emails in his inbox;
  - **the kit documents:** the final files live in SoftServe OneDrive, `Oracle AI & Data Solutions/<pack>/`, one folder per pack and nothing but finals (Alex, 2026-09-24). Account insights and Workforce optimization carry their one-pager, sales deck and feature list in `links.json` since 2026-09-24. All six are *People in SoftServe* links, the only kind that OneDrive allows (no *Anyone* link, tenant policy, checked through its sharing API), so they do not open for an Oracle seller. Account insights' `salesDeck` opens the pack's folder, not the deck: the deck had not reached the cloud, and the folder also shows the internal executive summary. Workforce optimization's deck still names Bosch on its proof slide, with the logo, and the name is not cleared. The other five products carry the product page and, for two of them, the interactive demo; the practice copy names what was left out. Recorded demo videos for Workforce optimization and Large docs sit in the same folders with no link yet;
  - **a public host:** the forms send only from a local run until the site has a real address; on the claude.ai link they say under each form that the preview cannot send, and an emailed product link opens the home page there (the artifact drops the route);
  - **the follow-up:** the kit email promises *"Someone from SoftServe will contact you shortly"*: who does it, and how fast;
  - **the manifest's extra rows** (Account insights' accelerator-pack one-pager, the two AI Lakehouse decks, the Marketplace package) have no slot in the standard kit.
- **Round 13 (§33.4):**
  - **the three new faces** are matched by the directory's own name key (`ASSETS.md` §3.2), not by eye; a wrong one is fixed by blanking its `photo`;
  - **Vlad or Vladyslav:** the directory's name is *Vladyslav Butenko*, and the site prints *Vlad*, Alex's word;
  - **Home S7** names Karsten alone.
- **Round 14 (§34.4):**
  - **trademark attribution:** the Oracle and NVIDIA trademark sentence left the footer with the marks; if the launch trademark check wants one, it comes back as one fine-print line above the copyright row;
  - **For sellers** stayed first in the link row although Alex's list named only SoftServe's items, because it is the only permanent way to `#/sellers`.
- **Round 15 (§35.4):**
  - **opened from `file://` or a plain static server**, the site runs without its *Interactive demo* and video buttons, because `site/` stores no copy of the links; `tools/serve.py` and a publish are the two ways it gets them.
- **Round 16 (§36.6):**
  - **products or solutions:** since round 18 the S3 H2 says *Ready-to-use solutions* in Alex's words, while its eyebrow (*Products*), its link (*See all products*), the nav and the catalog still say *products*; a rename is site-wide;
  - **one floor, two ways on the home page:** *from 30 days* (the hero tile, the S2 bullet) beside *From 4 weeks* (the Jumpstart stage);
  - **ranges elsewhere:** every product's Jumpstart tab still states 4–8 weeks, 3–5 months and 3–12 months. They agree with the floors, and the floor wording can go site-wide on Alex's word;
  - **the hero stack** shows four service tiles while the track has five stages: add a Workshop tile, or leave the stack to the paid tiers;
  - **S2's H2** is *A head start that scales.* rather than Alex's noun list (the literal polish: *Agents, apps and services*);
  - **two figure words:**
    - *Same-day insight*, where *Same-day opportunity* is more precise but likely two lines;
    - *Variances traced*, where the bolder time shape is *Hours, not weeks*;
  - **the floors are commitments:** *From 4 weeks* and *From 3 months* want delivery's sign-off;
  - **the Oracle-power claim** sits three times on the page (the hero lead, the S2 left body and its third bullet), as before the round;
- **Round 17 (§37.6):**
  - **the neutral tile:** *Transaction & process execution* is the one neutral-400 fill; the no-grey drop-in is Austin orange 50 `#ffcec0` on that tile;
  - **the drawings are abstract by design**, the least literal being *Enterprise knowledge & analytics* (two rings); any one is redrawn in `tools/draw-groups.js` without touching the others;
  - **same-day follow-ups (§37.7, §37.8):** *time to value* sits three times on the home page (the hero lead, the S2 bullet, the S4 heading), where the two-place rule would take it off the S2 bullet; *service(s)* is on S4 three times, and round 18 set its eyebrow to Alex's *Packaged services*, so the three are his words (the eyebrow, the heading, *Managed services*).
- **Round 18 (§38.6):**
  - **the ask tile's link** says *Talk to us* (his one-ask rule); his *Let's talk* is one key away;
  - **two dark screens** on the home page (S4b and About); About goes light in one CSS block if he prefers the theme's one;
  - **the Bespoke photograph** is softserveinc.com's own *Confidence earned* banner;
  - **the Bespoke copy's claims** are new to the site (pods sized and re-sized per project, senior leads setting standards, AI assistants across the lifecycle, a standing team) and want his OK as external;
  - **the Oracle Marketplace filter** reads 0, disabled, on every visit while no listing exists;
  - **what left with the Services page:** the 81% accuracy stat, the *Ends with* results, *Not a project. A proof.*, the full-name platform cards;
  - **the packaging plugin** still writes `video` and `marketplace: true` with no URL, both now checker failures, and its insert tool needs `assets/brand.js` loaded first (§39);
  - **`marketplaceUrl`** is the last link stored outside `links.json`.
- **Round 20 (§41.11):**
  - **two tiles on most products**: Fleet's visits per engineer and missed appointments, and Repair-or-replace's consistency across sites, stay off the widget for want of a defensible number;
  - **Fleet's *−5 to −10%*** on cost per visit rests on the routing literature (Toth & Vigo at second hand; UPS ORION's per-route figure not found);
  - **Workforce's *Set the rules*** is folded into step 1, because its frame shows the uncleared *+4.8%*;
  - **the chips**: seven products print Estimated tiles only, Large docs and Workforce one Proven tile each, and no tile is Forecast;
  - **the Use cases case study** still ends on its caveat sentence and names the engine and the platform; trim it for the cut the home cards got;
  - **clearance of the two Proven figures**: Large docs' *5–15 min* (§10.8 still open) and Workforce's *~30 min* (§4 clears it on its own source, §40.3 groups it with the uncleared), and the *+4 to +10%* floor just under the uncleared *+4.5%*;
  - **one claim, two figures across the tabs**: Account insights (*from a quarter* to *hours* in the widget, *Same-day insight* in its case study; round 11's item) and Workforce (*+4 to +10%* in the widget, *+4.5%* in its case study);
  - **figures in two faces**: Replica Light on the product pages, Azurio on the home page and the Jumpstart card;
  - **from QA, not fixed**: the footer's empty grey spacer under the Overview and Use cases tabs; `#/sellers`' grey kit form; two industry photographs that fit another product better (Large docs' *Travel & transport*, Repair-or-replace's *Automotive*); Repair-or-replace's missing hero photograph; the preview's "can't send" notes (intended). (Repair-or-replace's step-3 disclaimer line and £/$ costs left the frame with its round-21 recapture, and Fleet's soft zooms with the zooms, §56.)
- **§46 (the Q&A products on two platforms):**
  - **Oracle's advice of 2026-09-16** (Neil and Gero) was *not to create customer packages for AI Data Platform yet*; the chip presents two existing products to that motion rather than a new package, and it is one data line to take back;
  - **Business metrics Q&A on an AI Data Platform estate:** *no data movement* holds for the catalogs it mounts today; mounting that platform's own lakehouse tables into the gold layer waited on Oracle's native catalog integration at the 2026-08-05 enablement, so scope it at the Week 0 gate;
  - **the packaging plugin** writes `facet` as one string; a pack on two platforms needs its listing skill taught the array.
- **§48 (the home contact without the kit):**
  - **the sender** still answers a kit request for all offers made without the page (`product: "all"` in `mail/render.js`); the site no longer sends one. Refusing it is a change to the live n8n sender;
  - **the home contact's form column** opens on the ask's own line, with no heading of its own; the section's eyebrow and H2 open the card's column, inside the plate (PROVENANCE 41.12).
- **§49 (Account insights' walkthrough):**
  - **its standalone link is a OneDrive file**, Alex's choice, where the other walkthroughs use a claude.ai artifact: it opens only as far as its OneDrive sharing setting allows (SoftServe's tenant allows *People in SoftServe* links, round 12), and OneDrive may offer the HTML as a download rather than a page;
  - **the product name's case**: the pack spec's site variant is *Account Insights*, the page and the walkthrough *Account insights*;
  - **the band's first tile** is the pack's pipeline metric, which the page does not print;
  - **the page's time tile** reads *from a quarter*; the walkthrough computes each account's next quarterly review, 29 days at the median.
- **§50 (the confirmation and the practice's name):**
  - **the word order:** Alex's *SoftServe’s Oracle dedicated practice* ships as he wrote it; *SoftServe’s dedicated Oracle practice* is the more usual English order, one phrase in six strings;
  - **the confirmation is not visible on the shared link**, where the forms cannot send; a local run with the sender shows it.
- **§52 (the catalog's lead):** the six group empty states still open on the same kind of note to a reviewer, *"… are scoped per engagement. Tell us …"*. One is live: *Transaction & process execution*, the one group with no product, where its home tile lands.
- **§53 (the About tile's logo):** the About screen shows two SoftServe marks, the sticky header's wordmark and the tile's logo. softserveinc.com shows its wordmark once a page and the spark elsewhere; if two is one too many, the spark alone by the eyebrow is that pattern and a few lines away.
- **§56 (round 21, the Overview in two columns):**
  - **the widget is white on a hairline**, where round 20's band had softserveinc.com's light gradient: beside the grey problem plate a gradient card read as a second grey;
  - **the widget pins only while it fits**: the three-tile Repair-or-replace widget (about 960 px) always scrolls, and at 1366 × 768 so do the taller two-tile ones (Cross-system ERP Q&A, 639 px);
  - **How it works at 1366 × 768** is 674 px against 659 under the header and the tab bar, 15 px over, after the short-window tightening;
  - **a frame at 800 px shows the screen's layout, not its text**: the full-size view carries the detail, and a phone pans across it;
  - **two baselines draw no bar** (Large docs' *from ~1 month*, Fleet's *up to 1 h a day*): neither has a whole to fill, so each is its Today row alone;
  - **from the fresh-eyes review, left for you**: the *from X* tiles headline today's number (the pain) and show the After on the chart, by round 20's honesty rule, where the review would headline the After; *Estimated* sits on tiles whose number is a published benchmark (*5.6%* across the industry), where a *Baseline* kind is one data word away; After bars keep the chart blue of round 20, where the review suggested the Solution plate's `#1a1a1a`; bars for word values (*weeks* → *hours*) take their lengths from the data's estimates; a screenshot ends where its screen ended, mid-row at times;
  - **the packaging plugin** writes the round-20 contract (`shot.zoom`, `region`, `anchor`; labels with *before* and *after* in them); it has to learn round 21's before its next listing, and the checker fails the old shape by name.
- **Inputs Alex supplies (HANDOFF §7):** demo videos and posters, Marketplace URLs, success stories, kit document links (in `links.json`), hosting subdomain, customer-name approvals, image rights.
- **At launch:**
  - the site name checked against Oracle's trademark guidelines;
  - `og:url` set.

## 10. Map of the docs

| Doc | Read it when |
|---|---|
| `README.md` | You need the folder layout, the routes, the config keys at a glance, the three walkthroughs or deployment |
| `mail/README.md` | You touch the emails the forms send, a kit link in `links.json`, test or live, the sender or the n8n workflow |
| `docs/HANDOFF.md` | You need the exact run, verify and publish commands (§4), the standing rules in full (§3), the inputs list (§7) or the Node note (§9) |
| `docs/SCHEMA.md` | You add, rename or retire a `content.js` key |
| `docs/CONFIG.md` | You touch a switch in `config.js` |
| `docs/VISUAL-GRAMMAR.md` | You change a component or a page composition |
| `docs/PROVENANCE.md` | You need a fact's source or a round's decisions (§18 home, §20 name, §21 and §23 Services, §24 sales kit, §25 START-HERE, Internal panel and logos, §27 the SS26 theme, §28 the home page re-argued — three layers, six groups, Artifacts — §29 the product pages — one contact ask, the Use cases tab, the stepper — §30 the home page's photographs and the two "Hours" figures — §31 the move to this repository — §32 the forms' email and `links.json` — §33 the product leads on the Contacts card — §34 the footer — §35 one links file, nothing copied — §36 the home page re-voiced: the promise in the hero, tiles on a stage, five stages — §37 the group tiles as Offers tiles: flat brand fills, one line drawing per group — §38 Services onto the home page, the Bespoke band, the home contact as the product switch, no placeholder links, the catalog's ask tile — §39 the eighth product, Fleet route optimization — §40 every one-liner and home case card re-voiced to business value, the implementation and hedge checks — §41 the product pages' Overview, Use cases and Contacts rebuilt against grey: one column, the KPI band of business metrics and where each figure comes from, How it works on one screen with full-screen frames — §42 the ninth product, Repair-or-replace decisions — §43 a product name's hyphenated compound kept whole on phones — §44 the Internal review panel removed — §45 the six group names set on two lines, sized to their tile — §48 the home contact without the sales kit, and one product's kit per request — §49 Account insights' walkthrough — §50 the form confirmation without its blue panel, and the practice named *SoftServe’s Oracle dedicated practice* — §51 the case-study rail without its reference-call link — §52 the catalog's lead as the promise, not the terms, and the rule that no line answers a reviewer — §53 SoftServe's logo on the About tile, in the eyebrow's place — §56 round 21: the Overview in two columns with the numbers widget beside the main one, every chart as named Today and After bars with the figure printed on its bar, and How it works as step tabs over screenshots with nothing drawn over them). At 7,000 lines, search it; don't read it top to bottom. |
| `docs/SS26-THEME.md` | You touch either theme: what the current SoftServe brand is, the token map, the shape and colour rules, the fonts, and what is open |
| `docs/ASSETS.md` | You work on images, step frames or posters, and how they were made |
| `docs/HANDOFF-workforce-demo.md`, `docs/HANDOFF-erp-qa-demo.md` | You work on a walkthrough; each is owned by its own session |
| `site.manifest.json` | You change a path, the checker command, the preview entry, a publish target or a never-ship path, or finish a round that moved the contract. The packaging plugin reads it |
| `CLAUDE.md` | You need the rules carried over from AO-Personal-OS, or where the neighbouring repositories are |
| AO-Personal-OS `.claude/references/client-documents.md` | You write marketing copy |
