# Start here — Oracle AI & Data Solutions mini-site

Read this page first in every new session. It holds what the site is for, the brief and the rules it is built to, how a round of work runs, and what earlier rounds learned the hard way. Detail lives in the docs mapped in §10. Keep this page current: when a requirement, rule or procedure changes, rewrite the line — never append a dated update.

Current as of 2026-09-24, after round 16: the home page was re-voiced. The hero lead is the promise; S2 is *What we offer*; S3's tiles sit on photographic stages; S4 is five stages, Workshop to Managed services, stated as floors with no caveat, with the Why list below the track (PROVENANCE §36). Round 15 made `links.json` the only file that stores a link. The local server and a publish build the site's `data/links.js` from it, the email reads it from GitHub, and the checker fails a stored copy or a link repeated anywhere else (PROVENANCE §35). Round 14 made the footer softserveinc.com's, cut down, with no Oracle or NVIDIA marks (§34). Round 13 named each product's own lead beside Karsten on its Contacts card and cut two labels (§33). Round 12 made the forms send real email: the sales kit goes out automatically, every request reaches the practice inbox, and every kit link lives in one file, `links.json` (§32). Round 11, the home page, is §30. On 2026-09-23 the site moved out of AO-Personal-OS into its own repository (§31). **Rounds 12 to 16 are not on the shared link yet** (§9).

## 1. What it is

- **The site:** one small site for SoftServe's Oracle AI & Data practice, named **Oracle AI & Data Solutions**. It offers *products* — AI agents and human-AI workflows on Oracle platforms, grouped into **six product groups**, one per kind of job (§4) — and *services* (the practice that delivers them, from a proof of value **from 30 days** through integration to scaling).
- **How it is used:** Oracle and SoftServe sellers open it live on a call, and customers receive it as a link.
- **People:** Alex owns the site and every decision on it. The first person on every contact card is Karsten Tramborg, **Oracle Partnership Director, SoftServe** (Alex, 2026-09-23; the pack one-pagers print *Alliances & Partnerships Director* and are unchanged — `ASSETS.md` §3.1). Since round 13 a product's Contacts card also names that product's lead (Alex, 2026-09-23):
  - **Vlad Butenko, AI Product Manager, SoftServe:** Account insights, Large docs processing and review, Workforce optimization.
  - **Dmytro Dudchenko, AI Product Manager, SoftServe:** Plan vs actual investigation.
  - **Oleksii Orlov, Distinguished Product Advisor, SoftServe** (Alex himself): Cross-system ERP Q&A, Business metrics Q&A, Case evidence collection.
  - Home and Services name Karsten alone. The practice mailbox, oracle@softserveinc.com, is the one address printed for everyone.
- **Code:** a static, hash-routed SPA in `site/` with no build step and no framework.
  - **The site is on SoftServe's current brand** (`site/index.html` + `assets/site.css`):
    white ground, Azurio serif over Replica LL, Lviv blue with Austin orange, octagonal
    corner cuts. Read `docs/SS26-THEME.md` before touching it. The previous near-black
    theme is kept, runnable, as `site/index-legacy.html` + `assets/site-legacy.css` —
    an archive, not a second version to maintain. Images, renderers and copy are shared:
    logo paths go through `assets/brand.js`. **`content.js` is the live site's own
    copy** — new strings are stored in sentence case directly, and
    `data/content-case.js` only re-cases what is left from before the rebrand
    (41 rows, shrinking every round; never add one).
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
  - A proof of value is stated **three ways, on purpose**:
    - **4–8 weeks** in the scope copy of the seven product Jumpstart tabs and Services (round 9);
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

**Where the site does not match the brief today** (flagged in the panel and left unchanged until Alex decides):
- **Test mode** (`mail/settings.json`): every request reaches the test inbox of whoever runs the sender, not oracle@softserveinc.com, and the emails go out from a temporary sender outside SoftServe's domain until a SoftServe integration replaces it (§9).
- Two products print an **Integration price** on their Jumpstart tab: *Large docs processing and review* and *Workforce optimization* (€300–500K services plus infrastructure).
- **No product is marked as planned**, so all seven read as available now.
- **Partners** are priority 1, but they cannot receive the sales kit, which goes only to @oracle.com and @softserveinc.com. The brief contradicts itself here.

## 3. The site, page by page

| Route | What it does | Record |
|---|---|---|
| `#/` Home | Seven screens: <br>• hero — a three-line H1, the lead that states **the promise** (SoftServe's practice and method with Oracle's platforms → your time to value), the **three-layer stack** (Oracle platforms → SoftServe product groups → SoftServe services, read bottom-up) <br>• the three-figure proof strip, led by **from 30 days** <br>• *What we offer* (products · services) — **two photographic panels**, the copy in white on each photograph under a scrim <br>• **six group tiles**, each **a flat brand fill** (blue 75, orange 75, blue 50, neutral 400, blue 75, orange 75) carrying the group's own **line drawing** at its top left, then its name, a one-liner and an arrow; the tile is the link into the filtered catalog <br>• how we deliver — **five stages** across the width (Workshop · Jumpstart proof of value · Integration · Scaling · Managed services, the last optional) stated as floors, then *Why SoftServe on Oracle* as a hairline list, then one button <br>• anonymized case studies (Proven / Forecast / Estimated) — each card **a photo band** (the industry's picture, carrying the descriptor and area) **over a white body**, its figure carrying the noun it measures (*+4.5% productivity*) <br>• About SoftServe (the page's one dark band) <br>• contact | PROVENANCE §18, §28, §30, §36, §37 |
| `#/products` | Catalog with a facet rail (Oracle platform · what it does · Artifacts) and tiles. **Both radio rails are fixed lists** in canonical order — three platforms and all six groups, always — with a zero-count option disabled and printing no number; the one a deep link arrived on renders selected above its own empty state. *Oracle AI for Fusion Applications* is not offered (`catalog: false`): no product runs on it. No total, no denominator. `?cat=<id>` and `?tech=<id>` are both honored. | §17, §18.9, §28 |
| `#/products/<slug>[/<tab>]` | Seven product pages. <br>• Tabs: **Overview · Use cases · Technology · Jumpstart · Contacts** (round 10). Overview is Problem → Solution · How it works · More detail, with Outcomes & ROI in the rail; **Use cases** opens on the industry tabs, with no heading over them (round 13), then the case study; **Contacts** is one row — the contact card (Karsten, then the product's lead, over the one address; round 13) beside a two-tab switch, *Talk to us* (open by default) and *Get the sales kit* (for sellers), so only one form is ever open and neither is below the fold; `…/contacts#kit` opens on the kit tab. <br>• Retired segments redirect in place: `pov` → Jumpstart, `demo` and `sellers` → Contacts. <br>• Three products have an interactive walkthrough under `site/demo/`. | §15–§19, §22, §24, §29 |
| `#/services` | Three screens, one message each, then contact: <br>• *Frontier AI on Oracle* (the practice, with the four platform cards under their full Oracle names) <br>• *Every step has a number* — the home track's five stages under the same names (Workshop → Jumpstart proof of value → Integration → **Scaling** → Managed services), five across at 1440 and vertical from 1280 down <br>• *Not a project. A proof.* (4–8 weeks) | §21, §23, §28, §36 |
| `#/sellers` | *Get the sales kit*, for all offers or one product (work email at softserveinc.com or oracle.com), **emailed automatically** since round 12. Below it, the demo form for a seller who already has an account in mind. | §24, §32 |

- **Header:** Products · Services, plus *Talk to us*. *For sellers* is not in the header (Alex, 2026-09-17).
- **Footer:** softserveinc.com's footer, cut down (Alex, 2026-09-24). A link row — *For sellers*, then the brand's *Privacy Notice* and *Terms and Conditions*, then *SoftServe website* — with SoftServe's eight social glyphs on the right, over a copyright row: *© Copyright {year} SoftServe Inc.* and the SoftServe spark. No Oracle or NVIDIA marks, no hot links, no office address, no contact block, no frame around the links; the checker holds all of it. *For sellers* stays first because it is the only permanent way to `#/sellers`; the other is *Get the full kit* in the confirmation after a product kit request.

## 4. Standing rules

These hold unless Alex changes them, and `tools/check-grammar.js` enforces most of them. The full wording is in HANDOFF §3 and in AO-Personal-OS's `.claude/references/client-documents.md`.

**Content**
- Every word lives in `content.js`, and renderers only read data. No invented facts, numbers, customers or URLs. Log every new line of copy in PROVENANCE.
- **No customer names or logos** in anything shipped. Describe customers by industry and scale. The checker and the deny-list grep both enforce this.
- **No Oracle partner-standing claim**: no tier, no award. What may be said is joint delivery with Oracle's AI & Data organization.
- **Naming:**
  - **The six product groups**, in this order and these exact words, on the hero stack, the home tiles, the rail and every product chip (`chip` equals `full`, so a group has one name): **Enterprise knowledge & analytics · Deep research & investigation · Document processing · Transaction & process execution · Forecasting & optimization · Video & image intelligence.**
  - **Oracle platforms, two forms of each name** (round 9): the **short label** on the rail, the product chips, the tile image band, `tags[1]` and the hero stack — *AI Lakehouse · AI Data Platform · AI for Fusion Applications · OCI + NVIDIA NeMo* — and the **full Oracle product name** on the Services platform cards and in prose: *Oracle Autonomous AI Lakehouse · Oracle AI Data Platform* (never "AIDP") *· Oracle AI for Fusion Applications · Oracle Cloud Infrastructure + NVIDIA NeMo*. One canonical order, that one, everywhere. "OCI" alone is still fine in running text.
  - **The delivery tiers are Jumpstart proof of value · Integration · Scaling** — never "Scale" as a tier title (the hero stack says *Scaling*, and one page may not carry both words for one thing). "Scale" as a verb in prose is untouched.
  - **The delivery method is five stages** (Alex, round 16), on the home track and the Services track alike and in this order: **Workshop · Jumpstart proof of value · Integration · Scaling · Managed services.** *Discovery* is retired. The managed service is the customer's choice: its copy says they may take it, never that they should.
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
- **Forms send in the background, as on any website** (Alex, 2026-09-24). A form posts, shows *Sending…*, then confirms the outcome: *Thanks, your request is in* or *Check your inbox*. **No form ever opens the visitor's mail app.** A copy that cannot send (the claude.ai preview, a local run without `site/data/endpoint.local.json`) says so under each form before anyone types. A failed send is a red line under the form, which keeps what was typed. Never say "we've emailed" unless the sender answered that the email went out. The checker fails a mail-app fallback in `forms.js` or in the copy.
- **Every kit link lives in `links.json`**, outside `site/`, because anything under `site/` is readable in view-source and the kit documents carry prices. `config.js` holds no link to a kit artifact, and a committed `formEndpoint` fails the checker: a live trigger URL never enters git.
- **A link is stored in `links.json` and nowhere else** (Alex, 2026-09-24). The site and the email both read that file, and no other file keeps a copy: not `site/` (the checker fails `site/data/links.js`), not a doc, not a pack spec. A doc names the key (`links.json` › `<slug>.<key>`) instead of repeating the URL, and the checker fails a link from `links.json` found in any other file (`docs/PROVENANCE.md`, the round log, excepted). A walkthrough is stored as its path, `demo/<slug>/index.html`, never as a localhost or preview address.
- **Nothing internal ships in site copy.** The *Internal* panel is the only exception, and it is temporary (§8).

**Messaging** (from Alex's reviews)
- **A message read outside the product stands alone** (Alex, 2026-09-23, on the kit email's opener *"Thanks for requesting it."*). An email is read cold, in an inbox, by someone who may not remember the form: its first sentence says who is writing and what it is, and nothing leans on "it", "the site" or "the team" before naming them. Review email copy in `.work/mail-preview/as-read.txt` (the email as received), never field by field (`mail/README.md`).
- **Persona first.** Every headline speaks to its reader (a rep on a live call, a buyer on Oracle) in that reader's words. Never counts, taxonomy or packaging terms ("packaged", "workflow pattern", "ready-to-run", "pods").
- **The hero lead is the promise, not the procedure** (Alex, round 16, replacing a lead that walked through *a fixed-scope Jumpstart … in your tenancy*). It says what SoftServe and Oracle bring and what the reader gets: the time to value. The stages, the scope and where it runs belong to S4. **The promise is said once, big:** when Alex's drafts repeat it in several headings, it stays in the hero, and each other heading carries its own facet of it. The checker fails a procedure word in the lead and *time to value* more than twice on the page.
- **A label earns its words** (Alex, 2026-09-23, round 13, on *By industry* and *See all products, with filters*). Don't put a heading over controls that already name what they hold: a tab bar that says *Use cases* and a row of industry tabs need no *By industry* between them. Don't let a link describe the page it opens (*with filters*); it names where it goes. The checker enforces both instances.
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
  - Peers side by side never open on the same words; the checker asserts it for the case cards.

**Design** — the rules below hold for BOTH themes except where the SS26 column differs.

| Rule | The archive (`index-legacy.html`) | **The site** (`docs/SS26-THEME.md`) |
|---|---|---|
| Ground | near-black, at most **one light band** per page | white, at most **one dark band** per page (`#about`, `.services-page-proof`); `#edf0f2` for cards |
| Accent | one teal `#35CCBA` per screen | **two roles**: `#1485c4` = act on / selected, `#f46a4a` = one hero accent line per page. Facts are neutral |
| Display type | Montserrat 900 **uppercase** | **Azurio serif, 400, sentence case**; H2-H4 in Replica 400; uppercase only as 12-16 px micro-type at +.06em |
| Shape | radii, `9999px` pills | **octagonal `clip-path` cuts** 4/8/12 px; `border-radius: 0` but inputs (2 px) and dots |
| Elevation | glows | **surface steps**; no shadow, no lift, no press-scale |
| Fact vs filter pill | filled navy is a fact, outlined is a filter | filled grey is a fact, outlined is a filter, blue tint is **selected** |
| Heading budget | H1 2-4 words, ≤ ~24 chars a line | H1 ≤ 15 chars a line × 2 (the home H1 is the exception: three short sentences, each on its own line — four lines at 375, five at 320); product name ≤ 22 × 2; **H2 ≤ 30, now enforced** — the S2, S3, S4 and S5 home H2s fail over it, the rest warn |

Holding for both: 1.5 px line icons and no emoji · peers are equal height · an address is
a link, never a filled button, and a filled button is the screen's one ask · copy sits on
a photograph only where the component is a photograph by design — a product or Services
hero, the home page's two ways in, the home case card's band (descriptor and area only) —
and always under a veil or scrim; a tile keeps its copy off its image, and the home hero
carries no photograph · clean at 375, and the H1 still holds at 320.

**No grey on grey on the home page** (Alex, rounds 11 and 16: *"not to be grey"*, *"not so boring/grayish"*). A home card rests white with a 1 px hairline and takes its colour from a photograph; a list of reasons is rows between hairlines, never grey cards. `#edf0f2` is a hover step, never a resting fill. The references are softserveinc.com's photograph-topped Solutions cards and its "Our Expertise" list (PROVENANCE §36.2).

**A group tile is a flat brand fill carrying its group's own drawing** (Alex, round 17: tiles *"colored / styled like Our offers tiles"* on softserveinc.com's AI page, and round 16's *"mix of screenshots with backgrounds"* rejected). No border, hairline, shadow or photograph. The six fills run blue 75 · orange 75 · blue 50 · neutral 400 · blue 75 · orange 75, the one order in which no two touching tiles share a fill in any of the three grids; the one neutral tile is the set's rest on a white ground, not grey on grey. Every word and line on a fill is `#1a1a1a`. **A tile's picture carries its tile's idea at a glance: one picture, one idea**, drawn in the brand's own illustration language (one 1.75 px line, cropped by the tile's top and left edges, gathering into one filled spark at the moment of value). A decorative background under a shrunken screenshot is two pictures and no idea: at tile size the UI cannot be read, and the photograph says nothing about the job. The checker holds `.gtile`, the fill order, the adjacency and each drawing file to it, and the Why rows to theirs.

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
  - A component moved to a new page takes its wrapper, modifier classes and breakpoints with it.
- **Gates.** All three must pass:
  - the checker prints OK;
  - the console is clean on every route;
  - `grep -ri "bosch\|riyadh\|dhl\|sbg\|logos/" site --include='*.js' --include='*.css' --include='*.html'` returns nothing. In zsh, quote the globs. If ugrep hits its complexity limit, use `/usr/bin/grep`.
- **Publish** — each theme to its own artifact (§1); never cross them.
  - Strip the nine skeleton lines (listed in `site.manifest.json`, `publish.wrapper`) from `site/index.html` into `.work/publish/index.html` (exact-line `grep -v -x -F`, HANDOFF §4). A session opened in another folder publishes from a copy staged in its scratchpad.
  - The publish must carry `assets/fonts/*` with an explicit `contentType`, and only what the page references — nine legacy files and `assets/site-legacy.css` are deliberately absent from the artifact.
  - Call the Artifact tool with `file_path` = that wrapper, `root` = `site`, and a `files` map of every changed or new file — **images included**: `assets/img/groups/*` since round 9, `data/links.js` since round 12 (without it every *Interactive demo* button disappears from the artifact; since round 15 it is built for each publish with `python3 tools/site_links.py --out .work/publish/data/links.js` and mapped from that file, because `site/` holds no copy), and `assets/img/softserve-star-white.svg` since round 14 (the footer's spark). Files left out of the map are kept, so a new file that is not in it never reaches the artifact.
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
- **Truthful states beat optimistic ones, and a fallback must not hand the visitor a mechanism.** The kit form confirms only what happened: *request received*, or *kit emailed* when the sender says it went out. Until 2026-09-24 a copy with no endpoint opened the visitor's mail app under a success mark. Alex read that as broken, so a copy that cannot send now says so plainly instead.
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
  - whether the mailbox is watched, and whether two working days is the right promise;
  - whether *all offers* is one bundle (round 12 sends it as one email with every product's pieces);
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
  - the same ask still has three other phrasings **outside the product pages** — Home
    S7 *Send a request* / *Send the request*, Services *Let's talk* / *Request a
    scoping call*, the delivery screen *Request a scoping call* (the footer's went with
    its contact block in round 14).
    Recommended: unify on *Talk to us* next round;
  - the product *For sellers* tab is gone, its kit now the second tab of the Contacts
    switch, and `…/sellers` redirects — reversible, since the tab is data;
  - `large-document-extraction`'s `metricsNote` now points across tabs, to the case
    study on Use cases — the first cross-tab pointer on a product page;
  - **from Alex's same-day review (§29.7):** the stepper's frame is pinned by keeping
    the closed step bodies' cell, which costs up to ~64 px of air under a short
    description; a later round could close it by levelling the descriptions instead.
    768 and 320 were not looked at on that pass.
- **Round 11 (§30.6):**
  - Account insights says one thing two ways: its Overview rail tile still reads
    *"Hours, rather than the next quarterly review"* while its case study now says
    *Same day*;
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
  - **publishing:** the shared link still shows the site before round 12. Rounds 12–16 go out together from HEAD when Alex says so, with `data/links.js` built by `tools/site_links.py` (§6) and never `data/endpoint.local.json` or the whole folder;
  - **the three new faces** are matched by the directory's own name key (`ASSETS.md` §3.2), not by eye; a wrong one is fixed by blanking its `photo`;
  - **Vlad or Vladyslav:** the directory's name is *Vladyslav Butenko*, and the site prints *Vlad*, Alex's word;
  - **Home S7 and Services** still name Karsten alone.
- **Round 14 (§34.4):**
  - **publishing:** the footer goes out with rounds 12 and 13, and that publish has to add `assets/img/softserve-star-white.svg`, which the artifact does not carry yet;
  - **trademark attribution:** the Oracle and NVIDIA trademark sentence left the footer with the marks; if the launch trademark check wants one, it comes back as one fine-print line above the copyright row;
  - **For sellers** stayed first in the link row although Alex's list named only SoftServe's items, because it is the only permanent way to `#/sellers`.
- **Round 15 (§35.4):**
  - **opened from `file://` or a plain static server**, the site runs without its *Interactive demo* and video buttons, because `site/` stores no copy of the links; `tools/serve.py` and a publish are the two ways it gets them.
- **Round 16 (§36.6):**
  - **products or apps:** Alex's drafts said *apps* and *applications*; the site kept *products* everywhere, and a rename is site-wide;
  - **one floor, two ways on the home page:** *from 30 days* (the hero tile, the S2 bullet) beside *From 4 weeks* (the Jumpstart stage);
  - **ranges elsewhere:** the seven Jumpstart tabs and Services still state 4–8 weeks, 3–5 months and 3–12 months. They agree with the floors, and the floor wording can go site-wide on Alex's word;
  - **the hero stack** shows four service tiles while the track has five stages: add a Workshop tile, or leave the stack to the paid tiers;
  - **S2's H2** is *A head start that scales.* rather than Alex's noun list (the literal polish: *Agents, apps and services*);
  - **two figure words:**
    - *Same-day insight*, where *Same-day opportunity* is more precise but likely two lines;
    - *Variances traced*, where the bolder time shape is *Hours, not weeks*;
  - **the floors are commitments:** *From 4 weeks* and *From 3 months* want delivery's sign-off;
  - **the Oracle-power claim** sits three times on the page (the hero lead, the S2 left body and its third bullet), as before the round;
  - **publishing** carries the three redrawn `assets/img/groups/*.svg`; check with `list_files` that the four stage photographs are on the artifact.
- **Inputs Alex supplies (HANDOFF §7):** demo videos and posters, Marketplace URLs, success stories, kit document links (in `links.json`), hosting subdomain, customer-name approvals, image rights.
- **At launch:**
  - the site name checked against Oracle's trademark guidelines;
  - the Internal panel removed;
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
| `docs/PROVENANCE.md` | You need a fact's source or a round's decisions (§18 home, §20 name, §21 and §23 Services, §24 sales kit, §25 START-HERE, Internal panel and logos, §27 the SS26 theme, §28 the home page re-argued — three layers, six groups, Artifacts — §29 the product pages — one contact ask, the Use cases tab, the stepper — §30 the home page's photographs and the two "Hours" figures — §31 the move to this repository — §32 the forms' email and `links.json` — §33 the product leads on the Contacts card — §34 the footer — §35 one links file, nothing copied — §36 the home page re-voiced: the promise in the hero, tiles on a stage, five stages). At 6,000 lines, search it; don't read it top to bottom. |
| `docs/SS26-THEME.md` | You touch either theme: what the current SoftServe brand is, the token map, the shape and colour rules, the fonts, and what is open |
| `docs/ASSETS.md` | You work on images, step frames or posters, and how they were made |
| `docs/HANDOFF-workforce-demo.md`, `docs/HANDOFF-erp-qa-demo.md` | You work on a walkthrough; each is owned by its own session |
| `site.manifest.json` | You change a path, the checker command, the preview entry, a publish target or a never-ship path, or finish a round that moved the contract. The packaging plugin reads it |
| `CLAUDE.md` | You need the rules carried over from AO-Personal-OS, or where the neighbouring repositories are |
| AO-Personal-OS `.claude/references/client-documents.md` | You write marketing copy |
