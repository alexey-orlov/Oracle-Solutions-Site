# PROVENANCE — where every string in the data layer comes from

**⛔ INTERNAL. This file never ships and is never bundled.** It names internal source files and the customers behind the anonymised proof cards. It exists so that no `<!-- src: … -->` comment ever has to appear in shipped HTML, CSS, JS or data.

Scope: `site/data/content.js`, `site/data/config.js`, `site/assets/img/*`.

Labels: **verbatim** = the source string unchanged · **adapted** = the source string cut, generalised or de-identified · **written** = no source contains it.

---

## 0. Source roots

| Short name | Path |
|---|---|
| `SPEC` | `…/scratchpad/spec/content-spec.md` (revision 3) — the paste-ready copy the data layer is built from |
| `SPEC-ASSETS` | `…/scratchpad/spec/assets.json` |
| `SPEC-PROV` | `…/scratchpad/spec/PROVENANCE.md` — the section-keyed source map this file carries forward |
| `SPEC-ASSUM` | `…/scratchpad/spec/assumptions.md` |
| `SPEC-OQ` | `…/scratchpad/spec/open-questions.md` |
| `DESIGN` | `…/scratchpad/spec/design-brief.md` |
| `RESEARCH/01…07` | `…/scratchpad/research/01-products-wiki.md` … `07-bsh-business-case.md` |
| `BRAND` | `…/scratchpad/research/brand/` and `…/brand/logos/` |
| `MAP-PARTNER` | `…/OneDrive-SoftServe,Inc/Projects/Oracle/Packs/Use case maps/AI use case map - partner variant 2026-09-11 design pass.png` |
| `BRIEF` | Alex's locked decisions D1–D13, given with this task |

Everything cited below as `SPEC §n` traces one further step back through `SPEC-PROV` §A to the original one-pager, deck or wiki page. That second hop is not duplicated here; `SPEC-PROV` remains the authority on which shipped artefact a given sentence came out of.

---

## 1. Locked decisions that override the spec

Every row here is a place where `BRIEF` and `SPEC` disagree and the data layer follows `BRIEF`. Each is a small, reversible edit if the spec's reasoning turns out to be the one Alex wants.

| # | Where in the data | Spec default | What shipped | Why it matters |
|---|---|---|---|---|
| L1 | `facets.technology` | **Three** facets: All · OCI + NVIDIA · Oracle Autonomous AI Lakehouse (`SPEC` §2.2, `C12`) | **Four**, in `BRIEF` D2's order: `OCI + NVIDIA`, `Oracle AI Data Platform`, `Oracle Autonomous AI Lakehouse`, `Oracle AI for Fusion Applications` (the fourth shipped as `Other` until §17.7) | Two of the four match no product and render `emptyState`. `SPEC` argued dead filter segments read as an unfinished site; `BRIEF` D2 requires the four with a designed empty state. |
| L2 | `facets.technology[].emptyState` | — | `"No packaged offering on this platform yet — the practice delivers on it; see Services"` | Copy supplied verbatim by `BRIEF` D2. It read oddly on the old `Other` facet, where "the practice delivers on it" had no specific referent; naming that facet *Oracle AI for Fusion Applications* (§17.7) gave the line its referent and the copy stands unchanged on all four. |
| L3 | `facets.marketplace`, `config.products[*].marketplace` | **No Marketplace control anywhere on a customer-facing surface** (`SPEC` §2.2, `A1`) — no checkbox, no badge, no muted line | A `Available on Oracle Marketplace` checkbox facet, and `marketplace: true` on `workforce-optimization` and `large-document-extraction` | `BRIEF` D4, on Alex's own statement. `RESEARCH/06` §A.1 found no SoftServe listing on Oracle Cloud Marketplace for any pack and no owner, date or process; five public searches returned zero. **This is the single claim on the site that public evidence does not support — confirm the two listings exist before launch.** |
| L4 | `products[].sellers.materials` (the two packaged packs) | An asset row `Oracle Marketplace package — Planned` (`SPEC` §3.1, §3.2) | That row is **removed** from both | It would contradict the Marketplace badge L3 puts on the same page. If L3 is reverted, reinstate the row. |
| L5 | `shared.productTabs[2].label` | Tab label `Proof of value`; `SPEC-PROV` §C fails the build on the string `POV Jumpstart` | `POV Jumpstart` | `BRIEF` D5 spells the tab bar out. `SPEC` §3 argues "POV" reads as *point of view* outside the team. Purely a label: the tab id stays `pov`, and one string changes it back. **Worth a look before launch.** |
| L6 | `products[3].name` | `Large Document Extraction and Review` (`SPEC` §3.2, resolved at `C7`) | `Large docs extraction and review` | `BRIEF` D2's product table. `SPEC` §0.5 rule 8 says no abbreviation earns its place by being shorter, and `C7` already had three competing names for this product. The slug is unchanged. **Two separate questions here, and only one has been answered.** The *case* was settled in §13: all seven names are sentence case now, because five of the seven already were and the seven sit side by side in the "Product of interest" dropdown on every Contacts tab. The **`Docs` vs `Document`** question is untouched and still open — it is D2's override, not a drafting slip, and it remains the likeliest of the overrides to be a typo. |
| L7 | `forms.roles` | Three options: An Oracle customer · An Oracle seller or partner · Other (`SPEC` §3.0.5) | **Four**: adds `SoftServe` | `BRIEF` D7. |
| L8 | `forms` field set | Ten fields including country, Oracle products in place, preferred timing (`SPEC` §3.0.5) | **Seven**: name, work email, company, role, product of interest, message, consent | `BRIEF` D7 defines the field set. The dropped fields are recoverable from `SPEC` §3.0.5 if lead routing ever wants them. |
| L9 | `config.contactEmail` | **No address anywhere in shipped data** until a role alias is verified (`SPEC` §1.6, `F1`); `SPEC-PROV` §C fails the build on `RnDrequest` and on `@softserveinc.com` | `oracle@softserveinc.com` | `BRIEF` D7 set `RnDrequest@softserveinc.com` as the default, and that is what shipped until §13. `F1` recorded that the alias appears in no source file and is unverified, and E5 then put `oracle@softserveinc.com` on the contact card directly above the form — so the Contacts tab printed one address and composed mail to a different, unverified one. The form now uses the same practice mailbox the card prints. `RnDrequest@` can come back the moment someone confirms it resolves **and** records here why the form should route somewhere the card does not name. |
| L10 | `products[4].overview.successStory.results`, `overview.evidence[0].metrics` | Only the time metric ships; every productivity percentage is suppressed as internally disputed (`SPEC` §1.4, `C2`) | The time metric **plus** the post-proof business-case figures: 83% of 12 modelled simulations positive, median +4.5% jobs per technician per day, 15–20% dispatcher productivity (case built on 15%), ~5x modelled ROI over three years | `BRIEF` D8 authorises exactly this list from `RESEARCH/07` §7.1. Note this is **not** a reversal of `C2`: the disputed `+26%` and `€190K/month` from the sales one-pager are still absent, and so is `up to ~5%`. What ships is the business case that superseded them. See §4 below for the clearance that is still outstanding. |
| L11 | `config.products[*].videoUrl` / `successStoryUrl` / `marketplaceUrl` | Same rule | Same rule, all empty | No override. `BRIEF` D4 restates `SPEC` §3.0.1: the control renders only when the URL is non-empty, with nothing in its place otherwise. |
| L12 | Not in the data layer | Ship the customer-free use-case map in the hero frame (`SPEC` §1.1, `A3`) | **No map image is staged in `site/assets/img/`** | See §5. The only customer-free variant carries internal vocabulary that `BRIEF` D10/D11 ban outright. |

---

## 2. Source map by section of `content.js`

### `site`

| Key | Source | Label |
|---|---|---|
| `title`, `metaDescription` | `SPEC` §0.1 | verbatim (meta description is **written** at source) |
| `headerLockup` | `SPEC` §0.1 + `DESIGN` §4.1 — mirrors `genai.softserveinc.com` | adapted |
| `nav`, `primaryCta` | `SPEC` §0.2 + `BRIEF` D1 | verbatim |
| `dividerLabels` | `SPEC` §0.3 | verbatim |
| `footer.*` | `SPEC` §1.6 | verbatim |
| `footer.contactCta` | `SPEC` §1.6 — a button, not a mailto, because no address is printed on a customer-facing page (`F1`) | decision |
| `footer.trademarkLine` | — | **written; needs a legal eye** (`C15`) |

### `disclaimers`

All seven strings: `SPEC` §0.4 — each is printed on a shipped one-pager or deck. **verbatim, never paraphrase.** `modelledResults` is **written**, from the framing caution in `RESEARCH/07` §7.3 ("say modelled simulations against a historical baseline, not delivered or achieved").

### `shared`

| Key | Source | Label |
|---|---|---|
| `preFlightGate` | `SPEC` §3.0.3 (the Quick Start W0 gate, generalised — `SPEC-ASSUM` #51) | adapted |
| `credibilityBlock` | `SPEC` §3.0.4 | adapted |
| `productTabs` | `BRIEF` D5 — see L5 | decision |
| `ladderColumns` | `SPEC` §3.0.7 | verbatim |
| `materialStates` | `SPEC` §3.0.6 | adapted |

### `overview`

| Key | Source | Label |
|---|---|---|
| `hero.headline`, `hero.subhead`, `hero.ctas` | `SPEC` §1.1 | verbatim (subhead is **written** at source, `SPEC-ASSUM` #3) |
| `hero.stats` (4) | `SPEC` §1.1 — stats 1, 2 and 3 are **written**/corrected at source (`SPEC-ASSUM` #4, #5); stat 4 is verbatim from the data-practice credentials | mixed |
| `trustStrip` | `SPEC` §1.2 — no Oracle Partner badge exists and no partner-tier claim is cleared (`C15`) | verbatim + fact |
| `productsIntro` | `SPEC` §1.3 | verbatim (**written** at source, `SPEC-ASSUM` #6) |
| `evidenceIntro` | `SPEC` §1.4 band 1 intro | verbatim |
| `evidence[0]` workforce proof | `SPEC` §1.4 Card A for the narrative and the time metric; `RESEARCH/07` §7.1 for the four modelled figures and the scope line | adapted — see L10, and §4 |
| `evidence[1]` extraction proof | `SPEC` §1.4 Card B | adapted — customer name, third-party SaaS name and the customer's app name removed at source |
| `evidence[2]` first engagement | `SPEC` §1.4 Card C — only the "what it measures" half is external-safe; the deal value, data-source count, customer name and contract duration are all omitted (`C4`) | adapted |
| `evidence[3]`, `evidence[4]` method cards | `SPEC` §1.4 Card D, Card E — Card E is re-voiced; the 23% starting figure and "a partner's production AI solution" are removed (`C5`) | adapted |
| `servicesTeaser` | `SPEC` §1.5 | verbatim |

### `productsPage`

`SPEC` §2.1 and §2.4 — verbatim. The intro is **written** at source (`SPEC-ASSUM` #8). The seven-pattern taxonomy is deliberately **not** restated here; it appears once, on Services (`SPEC` §2.4 behaviour note).

### `facets`

| Key | Source | Label |
|---|---|---|
| `technology[0]`, `technology[2]` — labels and descriptions | `SPEC` §2.2 / `SPEC-ASSETS.facets` | verbatim |
| `technology[1]` `Oracle AI Data Platform` description | `SPEC` §4.1 platform card ("Governed enterprise data for AI"; "structured, unstructured and real-time enterprise data — governed, AI-ready, multi-cloud") compressed to one line | **written** |
| `technology[3]` `Oracle AI for Fusion Applications` label | Oracle's own product name, as it is written on the `SPEC` §4.1 platform card and on the Services platform list | verbatim — replaced the **written** `Other` catch-all in §17.7 |
| `technology[3]` description | `SPEC` §4.1 platform card ("AI agents inside Fusion applications"; "Embedded AI agents and AI Agent Studio across ERP, SCM, HCM and CX") compressed to one line | **written** |
| `emptyState` (all four) | `BRIEF` D2 | verbatim from the brief |
| `footnote` | `SPEC` §2.2 | verbatim (**written** at source, `SPEC-ASSUM` #10) |
| `categories` | `SPEC` §0.6 | verbatim (`C10`) |
| `marketplace` | `BRIEF` D2, D4 | decision — see L3 |
| `noResults` | — | **written** |
| `fullLabel` on every facet | `SPEC` §0.5 — "Oracle Cloud Infrastructure + NVIDIA" is a SoftServe composition, not a product brand; the short form is permitted only in the compact tag row, carrying the full label as a `title` | verbatim rule |

### `availability`

`SPEC` §0.7 / `BRIEF` D3 — three chips and their tooltips, verbatim. The underlying internal three-state legend on `MAP-PARTNER` reads "packaged offering available / WinP package / Roadmap"; **"WinP" is internal shorthand and must never appear** (`BRIEF` D11).

### `products[]` — per product

Each product's blocks come from the matching section of `SPEC`, which in turn maps back through `SPEC-PROV` §A to the pack's own one-pager, deck or capability matrix.

| Product | `SPEC` § | Open questions the copy rests on |
|---|---|---|
| `account-insights` | §3.3 | `C4` (may the site say a first engagement exists), `C19` (is "about 12 weeks" a pack duration or one contract's), `C5` (the adjacent method card) |
| `case-evidence-collection` | §3.4 | `C6` (is "Case evidence collection" the name — the string appears in no source; the internal map card reads "Complaint evidence assembly"), `C20` (no acceptance phase on this product) |
| `plan-vs-actual-investigation` | §3.5 | — (duration and phases are sourced from the engagement it is packaged from, generalised) |
| `large-document-extraction` | §3.2 | `C7` (the product's name — three competing names; see L6), `C8` (AI-Q vs NeMo Retriever on the Technology tab), **`C18` (is the accelerator-pack one-pager current or superseded — the whole `inScope` / `outOfScope` block comes from it, and its seller row ships as `superseded`)** |
| `workforce-optimization` | §3.1 | `C2` (which numbers ship — see L10), `C14` (confirm €90K / €4K / €300–500K / ~€25K), `C16` (what the commitment-rules asterisk actually restricts), `C17` (page count of the sales one-pager — deliberately not stated) |
| `cross-system-erp-qa` | §3.6 | `C9` (is this mapping the right way round — almost all of this page depends on it), `C13` (€30–50K band vs ~€50K point), `C21` (is the fee-credit term customer-facing) |
| `business-metrics-qa` | §3.7 | `C9`, `C13`, `C21` |

Blocks that are **written** rather than quoted, product by product — these are the sentences with no source behind them:

| Product | Written block | Built on |
|---|---|---|
| account-insights | `overview.roi` | No ROI framing exists for this pack anywhere (`SPEC-ASSUM` #21) |
| account-insights | `technology.layers` | The four-tier stack the sibling AI-Q products carry (`SPEC-ASSUM` #22) |
| account-insights | `pov.scope`, `pov.deliverables` | Composed from the in-scope list + the evaluation harness + the reviewer UI (`SPEC-ASSUM` #22); `pov.scope` is newly composed here, see §3 |
| account-insights | `pov.ladder` rows for Roll-out and Scaling | `SPEC` §3.0.7 fallback rows + the product's own "THEN → ROLL-OUT" line; see §3 |
| case-evidence-collection | `overview.problem`, `overview.roi`, `pov.scope`, `technology.layers` | `SPEC-ASSUM` #23, #24, #25 |
| case-evidence-collection | `pov.ladder` rows | `SPEC` §3.0.7 fallback + the product's own prerequisites; see §3 |
| plan-vs-actual-investigation | `overview.problem`, `overview.roi`, three of four `whereItApplies` bullets | `SPEC-ASSUM` #26, #27, #28, #60 |
| plan-vs-actual-investigation | `pov.ladder` rows | `SPEC` §3.0.7 fallback + the product's own phases; see §3 |
| large-document-extraction | `overview.roi`, `overview.todayTomorrow`, `technology.layers`, the two parentheticals on out-of-scope items 4 and 6 | `SPEC-ASSUM` #17, #18, #19, #20 |
| workforce-optimization | `overview.roi`, `overview.deliveredAtRollout`, the commitment-rules footnote, `pov.deliverables` | `SPEC-ASSUM` #15, #16, #62 |
| cross-system-erp-qa | The differentiating framing (prebuilt Oracle pipelines), `badges` | `SPEC-ASSUM` #29, #30 |
| business-metrics-qa | The differentiating framing (catalog federation), `badges`, `overview.roi` | `SPEC-ASSUM` #29, #30, #31 |
| all seven | `pov.team` | See §3 |
| all seven | `sellers.materials[].description` where `SPEC` printed "—" | See §3 |

### `services`

`SPEC` §4.1–§4.4, verbatim except where `SPEC-ASSUM` marks a block written: the hero lead (#32), "WHO YOU WORK WITH" (#33), "WHO DELIVERS IT" (#34), the ladder duration column naming all three clocks (#35), the unnumbered proof-of-value steps (#36), Why-SoftServe cards 2 and 4 (#37). The Databricks and Snowflake partner dates and certification counts in card 1 are the **only** publishable credential numbers in the corpus (`RESEARCH/03`); no Oracle partner tier, OPN status or Oracle certification count appears anywhere (`C15`, `SPEC` §5 rule 6).

### `forms`, `sellerGate`

The whole form is **written** — no form exists anywhere in the corpus (`SPEC-ASSUM` #13, #39), field set per `BRIEF` D7 (L7, L8). Confirmation and error copy: `SPEC` §3.0.5, with the `mailto` variant written here because `BRIEF` D7 introduces that path (§3).

`sellerGate` copy: `SPEC` §3.0.6 for the heading, locked-state body and the CTA. The gate mechanism is `BRIEF` D6 (email-domain check) rather than `SPEC`'s shared access code (`H2`) — a lateral change, not an override, since `H2` was open. The CTA's `contactLabel` is a **role alias**, never a person (`F1`).

**Deliberately absent from the seller panel, in both data files:** the named external contact, the two seller-only packaging notes ("Packages compress over time"; "Pricing assumes the accelerator pack already exists"), and the objection-handling card about Oracle Autonomous AI Lakehouse having no named public production customer. `SPEC` §3.0.6 and `SPEC-ASSUM` §4 give the reasoning: a client-side gate is not access control, so anything whose exposure matters cannot be in the bundle at all. This build has no authenticated endpoint, so those strings are simply not on the site.

---

## 3. Copy written new for this data layer

Everything in this section exists in `content.js` and in no source. It is written in the spec's register — short declaratives, concrete nouns, no number that is not already on the page.

| Where | What was written | Built on | Risk if wrong |
|---|---|---|---|
| `products[*].pov.team` (all seven) | *"One team: AI, data and OCI architects, a product manager and a project manager, and senior AI and data engineers. The team grows with the scope."* | `SPEC` §4.2 "WHO DELIVERS IT", verbatim content, re-pointed from the Services page to each product. `BRIEF` D5 requires a `team` field per product; `SPEC` deliberately keeps the delivery-team block on Services only | Low — it is the practice's own sentence, and it claims no product-specific staffing. If the seven pages should not each carry it, delete the field and let Services keep it |
| `facets.technology[1].description` | *"Governed enterprise data for AI — structured, unstructured and real-time, multi-cloud."* | `SPEC` §4.1's Oracle AI Data Platform card, compressed to one line | None |
| `facets.technology[3]` description | *"Embedded AI agents and AI Agent Studio across ERP, SCM, HCM and CX."* | `SPEC` §4.1's Oracle AI for Fusion Applications card, compressed to one line. The facet's **label** is no longer written: it is Oracle's product name (§17.7). The written `Other` / *"Other Oracle platforms"* / *"Everything outside the three above…"* that stood here until round 4 was a catch-all naming no Oracle platform | None |
| `facets.noResults` | *"No product matches these filters. Clear one and try again, or tell us the workflow you need fixed."* | The Products page's own bottom-block posture | None |
| `products[*].pov.ladder[].scope` and `includes[]` on the three per-engagement products | Roll-out and Scaling scope cells from `SPEC` §3.0.7's fallback table, verbatim; the `includes[]` bullets composed from each product's own "THEN → ROLL-OUT" line, prerequisites and phases | `SPEC` §3.0.7 requires the same three-column component on every page, scope cells filled, every price cell `Scoped per engagement` | Low — no price and no duration appears that is not already elsewhere on the same page |
| `products[*].pov.ladder[].includes[]` on the four priced products | Composed from each product's own capability matrix rows and offer phases | `SPEC` §3.1, §3.2, §3.6, §3.7 | Low — every bullet restates a matrix row that also ships as `capabilityMatrix` |
| `sellers.materials[].description` where `SPEC` printed "—" (every "Demo video" row; the Lakehouse one-pagers and feature lists; account-insights' sales deck, one-pager and feature list) | One line each, describing what the asset will contain, not what exists | `SPEC-ASSUM` #61 established this pattern for §3.4/§3.5 so the Description column survives when every state is "Coming soon" | Low |
| `sellerGate.unlockedIntro`, `emailPlaceholder`, `rejected`, `lockLabel` | The unlocked panel's chrome | `BRIEF` D6 defines the mechanism; no source has the copy | Low |
| `forms.confirmations.mailto` | *"Your mail client opened with the request."* plus a line on what to do if nothing opened | `BRIEF` D7 requires this path and forbids faking a success. `SPEC` §3.0.5 has only the POST confirmation | Low — but read it once: it is the message most visitors will actually see today |
| `forms.labels.*` (field labels, validation messages) | Field chrome for `BRIEF` D7's seven-field set | `SPEC` §3.0.5 field table | None |
| `disclaimers.modelledResults` | *"Results are modelled simulations against a historical baseline, not measured production outcomes."* | `RESEARCH/07` §7.3, which requires exactly this framing for any external use of the business-case figures | **Medium — it is load-bearing.** Without it the four figures in L10 read as delivered production outcomes, which they are not |
| `products[4].overview.successStory.scopeLine` and `evidence[0].scopeLine` | *"A three-month proof of value across three countries, with around thirty real-world constraints modelled … and dispatcher approval in the loop."* | `RESEARCH/07` §7.1 rows 1, 4 and 6, all on the candidate-external-safe tier, with the country names withheld | Low |
| `products[5].overview.problem` / `.solution` (cross-system ERP Q&A) and `products[6].overview.problem` / `.solution` | Restatements of the page's own TODAY / TOMORROW blocks, so the two Lakehouse products carry the same `problem` / `solution` shape as the other five | `SPEC` §3.6, §3.7 | None — same words, different container |

---

## 4. The workforce-optimization business-case figures — clearance still outstanding

`BRIEF` D8 authorises four figures from `RESEARCH/07` for the anonymised proof card. They are on that document's **candidate external-safe** tier, and that tier carries a condition the data layer cannot satisfy on its own:

- The source deck is **Oracle-authored and Oracle-copyright**, stamped *Confidential: Internal/Restricted/Highly Restricted* on every content page, and names SoftServe as the development partner. `RESEARCH/07` §7.0 is explicit that anonymised reuse of its figures is still reuse of Oracle's confidential material, and that **Oracle sign-off is needed as well as the customer's**.
- The section is headed "candidates to take through clearance", not "cleared".

What the data layer did to stay inside the brief:

- Only the seven facts `BRIEF` D8 lists are used. The customer name, every € figure, all headcounts, baselines, pre-proof scenarios and cost bands are absent — verified by a deny-list pass over the built data.
- The 5x ROI ratio appears with **no absolute figure anywhere near it**, per `RESEARCH/07` §7.3 (pairing them lets the customer's economics be back-solved).
- The median (+4.5%) leads; the mean (6.1%) and the maximum (21.7%) are absent.
- The country names are withheld — "three countries", not "US, UK, Netherlands" — because the geography narrows the anonymised label to roughly one company (`SPEC-ASSUM` §3).
- The work-zone count (~5,300) and the 38/75/100% phasing are absent: `RESEARCH/07` rates them **medium re-identification risk**.
- Every figure is framed as modelled, never delivered, and carries both `disclaimers.modelledResults` and the standing KPI disclaimer.

**The open item is permission, not wording.** Nothing further can be done inside the repository; someone has to ask.

**Status, fourth fix round (2026-09-14):** the three unclearable ratios were withdrawn from the shipped data — see §14.1. What remains on the proof card and in the workforce Outcomes rail is the `~30 min` time metric, which `SPEC` §1.4 clears on its own source. The scope facts (three countries, ~thirty modelled constraints, human-in-the-loop) stay on the proof card, still unresolved against the same clearance. Record the sign-off here, with a date, when it arrives; the three ratios go back only then.

---

## 5. Assets — what was staged and its licensing status

Staged into `site/assets/img/`:

| File | Source | What it is | Status |
|---|---|---|---|
| `softserve-wordmark-white.svg` | `BRAND/genai-logo-57c5dfbd.svg` | SoftServe wordmark, white, 149×26 — the header lockup mark | SoftServe's own mark, taken from SoftServe's own public product microsite. Internal use on a SoftServe property; no third-party licence involved |
| `softserve-wordmark-black.svg` | `BRAND/genai-logo-black-2dc46216.svg` | Same mark, black — for the one light inversion band | Same |
| `header-divider-white.svg` / `-black.svg` | `BRAND/genai-line-6eb1faae.svg` / `genai-line-black-a20ffa29.svg` | The 2×34 hairline between wordmark and product name | Same |
| `softserve-logo-white.svg` | `BRAND/logos/softserve-logo-white.svg` | Stacked SoftServe logo, 324×96 — footer or hero lockup | Same |
| `softserve-star-white.svg` | `BRAND/logos/softserve-star-white.svg` | The star mark, 135×154 — favicon / watermark | Same |
| `sphere.webp` | `BRAND/genai-ball-4519c583.webp` | The decorative teal sphere, 1920×1920. One instance only, rotated 180°, bleeding off the footer edge | Same. **Note it is teal-green: if the accent colour ever moves off `#35CCBA` (`H4`), the sphere stops matching** |
| `oracle-wordmark-white.svg` | `BRAND/logos/oracle-wordmark-white.svg` | Oracle wordmark, 231×30, clean vector | **Third-party mark.** Oracle Corporation's trademark, used to identify the platform the products run on. Nominative use; render monochrome grey in the partner strip and never imply a partner tier or certification. No Oracle brand-guideline review has been done |
| `oracle-wordmark-grey.svg` | `BRAND/genai-ico-Oracle.svg` | Oracle mark as shipped on SoftServe's own microsite — raster-masked, 26 KB, self-contained | Same. Kept as the fallback; prefer the clean vector above |
| `nvidia-wordmark.svg` | `BRAND/genai-ico-Nvidia.svg` | NVIDIA wordmark — raster-masked, 22 KB, self-contained (the only NVIDIA-only asset on disk) | **Third-party mark.** NVIDIA Corporation's trademark, nominative use, monochrome. No NVIDIA brand-guideline review has been done |
| `lockup-softserve-nvidia-white.svg` | `BRAND/logos/lockup-softserve-nvidia-white.svg` | SoftServe + NVIDIA lockup, 803×148 | An **existing approved SoftServe lockup** taken from SoftServe's own deck template — the safest way to show the pairing. Use it rather than composing a new lockup |

**Hero backgrounds** (`site/assets/img/heroes/`, nine 1920×900 progressive JPEGs, quality 84): a **photographic set lifted from SoftServe's own decks** and graded to one look — cool slate-teal, median luminance 55–63. Nothing in the shipped set is generated in this repository; the earlier in-repo line-art set is retired and its script is deleted. Per-file deck sources, the grade and the CSS treatment are in §11.1.

**The rights caveat, in short:** every file comes from SoftServe's own deck media, with no watermark or third-party stock mark on any of them — but the photographic picks are **AI-generated art commissioned inside those SoftServe decks**, not licensed stock. Garbled micro-glyphs survive on some of them, which is the tell. Someone has to get a one-line confirmation from whoever owns those decks before the site goes public. There is no visible external origin to flag.

`heroes.json` ships inside the served root and is publicly fetchable, so it carries only `file`, `alt`, `focal` and a **generic** `source` / `credit` pair ("SoftServe deck imagery" / "SoftServe") — no deck filename, no media path, no customer or opportunity code. That is a ship-gate check, not a style preference; see §11.1.

**Fonts:** none staged. Montserrat and Open Sans load from Google Fonts (SIL Open Font License), which is what SoftServe itself ships on its dark product microsite — `H3` records this as the deliberate answer to the licensing question. The real brand faces (Azurio, Replica LL TT) are commercial and are not used.

**Not staged, deliberately:**

- **No Oracle Partner / Oracle PartnerNetwork badge.** No such asset exists on disk or on either live SoftServe site, and no partner-tier claim is cleared (`C15`). Do not fabricate one.
- **No SoftServe + Oracle lockup.** Same — none exists anywhere.
- **No product screenshots and no footage**, for any of the seven (`A2`, `A3`). Any Account Insights screenshot that is ever made must use **synthetic accounts**: the existing ones fan a real news story out to named real companies.
- **No use-case map image.** `MAP-PARTNER` is the only customer-free variant of the map, and it is genuinely customer-free — but it carries **"WinP package"** in its legend and **"AIDP"** on every family footer, both banned outright by `BRIEF` D10 and D11, plus the internal deck framing "Oracle <> SoftServe: Partnership vision". It cannot ship as-is, and cropping does not fix it — the banned strings are in the legend *and* in six footers. The file is staged for review at `docs/asset-candidates/use-case-map-partner-variant.png`, outside `site/`. **To use it, someone has to re-export the slide with the legend relabelled and "AIDP" spelled out as "Oracle AI Data Platform".** Until then the hero frame has no honest fill and the design should not assume one.

---

## 6. The ship gate

Run against the built output — HTML, CSS, JS and every data file that reaches the browser. Fail the build on any match:

```
/bosch|bsh|riyadh\s?air|\bdhl\b|\bnhs\b|\bsbg\b|binladin|belron|\bkpn\b|channel\s?4|nesma|altradoc|king\s+fahd|winp|t-shirt|\/Users\/|OneDrive|€19[02]|192[,.]?525|198\.5|\+26%|ktram|tramborg@|no named public production|packages compress over time|first-of-kind|\bAIDP\b|\bAIQ\b|GigaCloud/i
```

Also fail on:

- any `<!--` in the output HTML, and any `//` or `/* */` comment in `content.js` or `config.js` that mentions a source, an assumption, a TODO, a customer or a named individual — the round-4 pass removed the two decision-attribution comments (`assets/app.js`, `assets/site.css`) that named the content owner in shipped files;
- any absolute filesystem path;
- the strings `In build`, `proof of concept`, `Oracle Marketplace listing in preparation`, `(assumed)`, `TODO`, `FIXME`, `src:`;
- any individual's **mailbox**, and any individual's name or title **other than `shared.contact`**. That one person is cleared by `SCHEMA.md` §"the only person named anywhere in `content.js`": he is already printed by name, title and contact route on SoftServe's own external one-pagers, and the site prints the practice alias rather than his personal mailbox. The deny pattern is therefore the mailbox form (`ktram`, `tramborg@`) and not the surname — a gate that fails on cleared content gets overridden blind, which is worse than no gate.

**Two deliberate departures from `SPEC-PROV` §C's version of this gate**, both forced by the locked decisions:

| Pattern dropped | Why |
|---|---|
| `@softserveinc\.com` | The practice mailbox `oracle@softserveinc.com` is both printed on the contact card and used as the form's `mailto:` destination (L9). It is a role alias, not an individual. The mailbox patterns `ktram` / `tramborg@` stay — those catch an actual person's mailbox, which must never appear; the bare surname was narrowed out, because the contact card ships that name by decision. `RnDrequest` is no longer in the data and the pattern could be restored, but it is left out so a future re-introduction fails the check-grammar gate rather than the ship gate. |
| `POV Jumpstart` | `BRIEF` D5 makes it the tab label (L5). If L5 is reverted, put this pattern back. |
| `packages compress over time` and `first-of-kind` | `BRIEF` D5 requires the spec's seller-only packaging notes (`content-spec.md:459-462`) inside the gated panel, and the first QA pass found them missing site-wide. They now live in `sellerGate.packagingNotes` and render on the four products that print a price. **This is a knowing trade-off:** the D6 gate is client-side, so both sentences are readable in `content.js` by anyone who fetches the bundle. They were judged safe to expose — neither names a customer, a person, a figure or an internal system; both are commercial caveats a seller would state aloud in the same conversation. If that judgement is reversed, delete `sellerGate.packagingNotes` and restore the pattern; nothing else depends on it. |

Everything else in the original gate still applies, and the current data layer passes all of it.

---

## 7. Departures from the spec introduced by the first QA fix round

Each of these changes published copy that `SPEC` prescribed verbatim. They are listed here so the content owner can accept or revert them individually.

| Where | Was | Is now | Why |
|---|---|---|---|
| `overview.hero.stats[0]` | "seven applications on the Oracle stack — three packaged today, four in preparation" (`content-spec.md:116`) | "…three packaged today, two sellable as a fixed-price offer, two in preparation" | The spec line contradicted the site's own chips one click away: `/products` shows 3 × *Available now*, 2 × *Fixed-price offer*, 2 × *In preparation*, and both Q&A products state the offer is live today. A reader who counts got 2 in preparation, not 4. **Content owner's call** — the alternative wording that also reconciles is "three packaged today, four still being packaged". |
| `pov.ladder[2].pricing` on `workforce-optimization` and `large-document-extraction` | "to be defined" (`content-spec.md:596-597`, `:761-762`) | "Scoped per engagement" | Reads as an unfinished placeholder on a customer-facing surface, and the other five ladders already use "Scoped per engagement" in the same slot — the inconsistency was visible within one page-turn. **Content owner's call** if the one-pager wording is contractually load-bearing. |
| `sellerGate.cta.body` | one shared line, "…2 months to measurable KPIs" (`content-spec.md` §3.0.6) | per-product, interpolating each product's own `pov.durationShort` | The shared line was wrong for five of the seven products and contradicted their own POV Jumpstart tabs (30–45 days / about 12 weeks / 12–15 weeks). A seller quoting the panel was misquoting the offer. |
| `case-evidence-collection` POV duration | three phrasings on one tab — "scoped per engagement — comparable investigation proofs run 12–15 weeks", "12–15 weeks", "12–15 weeks" | "12–15 weeks (indicative; scoped per engagement)" in all three slots | Same fact, three commitments, a screen apart. The hedged form is the honest one for an unstarted product. |
| Success-story empty line on both Q&A products | "Built to prove, not promise — the readout is a measurement, not a story." | "No customer engagement published yet — this is a new fixed-price offer. Proof points will be published here." | The slogan dodged the question and repeated a heading that appears verbatim on the same product's POV tab. The other four products answer plainly in this slot. "Built to prove, not promise" is unchanged as the POV section heading. |
| `cross-system-erp-qa` / `business-metrics-qa` — THE PROBLEM and THE SOLUTION | word-for-word identical to the TODAY / TOMORROW pair on the same tab | rewritten to a tighter altitude, one sentence each, stating the pattern rather than re-telling the scenario | Readers hit the same paragraph twice within a screen. Today/tomorrow keeps the narrative contrast; problem/solution now states the shape. |
| `large-document-extraction` success story | a published blurb rendered beside "No case summary is published yet." | the two spec-sanctioned metrics (`content-spec.md:238-239`) rendered as the band's proof column; the empty line removed | The two strings contradicted each other on the same screen. |
| Spelling | mixed British / American (4 × `-ise`, 40+ × `-ize`) | American throughout (`optimized`, `customization`, `Anonymization`, `organization`, `neighboring`, `modeled`) | One convention, chosen to match the Oracle / US-seller audience and the already-dominant form. |
| CTA labels | six labels for two actions | two: **Request a demo** for anything product-scoped, **Request a scoping call** for practice-scoped — including the submit buttons of the two forms | The Services form submitted under "Send" while the identical demo form submitted under "Request a demo". |

### Imagery wired in this round

Superseded by the second fix round — see §8.

---

## 8. Imagery — second fix round

The nine staged hero images and their manifest (`site/assets/img/heroes/`, including `heroes.json`) were **deleted from the served root**. Two reasons:

1. `heroes.json` shipped inside `site/` and was publicly fetchable. It carried internal source-deck filenames and media paths — exactly the "src:" note class the locked decisions forbid, including one filename keyed to a customer/opportunity code. Nothing in the page ever loaded it.
2. Every image was generic dark stock photography with no relationship to the product it illustrated — a container terminal for a dispatcher-scheduling app, a glowing-network plate for Account Insights. That is the loudest generic-page tell the design brief names, and the first question a customer asks in a live demo.

The retired manifest, recorded here so the mapping is not lost:

| Key | Source |
|---|---|
| `account-insights` | `SoftServe AI Repeatable IP-Based Customer Stories.pptx` / `ppt/media/image92.jpeg` |
| `case-evidence-collection` | same deck / `ppt/media/image84.jpeg` |
| `plan-vs-actual-investigation` | same deck / `ppt/media/image89.jpeg` |
| `workforce-optimization` | same deck / `ppt/media/image91.jpeg` |
| `business-metrics-qa` | same deck / `ppt/media/image93.jpeg` |
| `services` | same deck / `ppt/media/image85.jpeg` |
| `large-document-extraction` | `OCI AI accelerators - GTM deck.pptx` / `ppt/media/image9.png`, recomposed on a dark field |
| `overview` | `SBG - PoV approach and options.pptx` / `ppt/media/image4.png` |
| `cross-system-erp-qa` | generated |

**What replaced them.** `site/data/diagrams.js` — seven authored architecture/flow diagrams, one per product, rendered as inline SVG at the site's own design tokens (teal `#35CCBA` flows, `#0E2D4D` group field, Montserrat titles, Open Sans labels). They inherit the page's fonts and colours because they are inlined into the DOM rather than loaded as image files, so they work from `file://`, in a static host, and in a multi-file Artifact with no extra request. Every box and label traces to that product's own `technology.narrative`, `technology.layers` and `technology.integration` strings in `content.js` — no new facts are introduced by the artwork. They render in the 50/50 row beside THE SOLUTION and the mirrored row beside ARCHITECTURE.

The product-tile plates no longer carry artwork at all: they fall back to the typographic plate that was already in `UI.tilePlate` — the product headline set large, first word in teal, on the black plate with its teal glow. A designed container with the product's own name in it beats a stock photograph of something else.

**Still true:** there are no product screenshots for any of the seven. When screenshots exist, add `src` back to that product's `media` entry and `UI.figure` / `UI.tilePlate` prefer the image with no other change. The `Account Insights` rule still applies: any screenshot ever made for it must use synthetic accounts — a production instruction, recorded here and deliberately nowhere inside `site/`.

---

## 9. The visual-grammar round — what moved, what was written, and where the industries came from

Alex's feedback F1–F3 (2026-09-13) replaced the free-form product Overview with **one component grammar shared by all seven pages** (`docs/VISUAL-GRAMMAR.md`). This section records what that did to the data layer.

### 9.1 The restructure — no fact was dropped

Every prose block that used to render above the fold was either compressed into a grammar component or moved, verbatim, into `overview.moreDetail[]` (the collapsible disclosure at the end of the tab). Mapping:

| Old key | Where it went |
|---|---|
| `overview.problem` (lead + bullets + context) | Panel text of `overview.problemSolution.problem`, compressed. The bullets and the `context` sentence moved verbatim to `moreDetail` (`large-document-extraction`, `workforce-optimization`). |
| `overview.solution` (lead, expanded, items, closing, valueStrip) | Panel text of `overview.problemSolution.solution`, compressed. `expanded`, `items[]` and `closing` moved verbatim to `moreDetail`. `valueStrip` was dropped — it duplicated the metric row it sat beside. |
| `overview.metrics` (`{ title, rows, footnote, emptyState, proofLine }`) | `overview.metrics[]` tiles + `overview.metricsNote`. Every `footnote` and every `emptyState` string survives **verbatim** as the `metricsNote`. `workforce-optimization`'s four KPI-definition rows moved to `moreDetail` as "How the KPIs are defined"; its tiles now carry the four business-case figures that already shipped in its `successStory.results`. |
| `overview.roi` (`{ title, body }`) | `overview.roi` (`{ icon, text }`). `text` is the same body, trimmed to two sentences on four products; nothing was added. |
| `overview.features` (`{ title, items[{title,body}], footnote }`) | `overview.features[]` — 6–8 lines of ≤12 words each, each a compression of one `{title, body}` pair. **The original pairs are kept in full** as `overview.featuresDetail[]`. `footnote` → `overview.featuresNote`. |
| `overview.whereItApplies` (`{ title, lead, items }`) | `overview.industries[]` icon chips + `overview.industriesNote` (from `lead` where one existed). **Every `items[]` entry survives verbatim** as a `moreDetail` entry. *(Superseded in §13: the chip row is deleted — every key it held was already an `industryCases` tab — and the eleven `moreDetail` entries that repeated a tab's vertical went with it. `industriesNote` survives, moved under the tabs.)* |
| `overview.inScope` / `.outOfScope` | `overview.scope.in` / `.out`, compressed to ≤14 words per line. |
| `overview.pattern`, `.todayTomorrow`, `.pullQuote`, `.scopeParagraph`, `.evidenceDefinition`, `.useCaseBoundaries`, `.scopeBoundary`, `.exclusions`, `.deliveredAtRollout`, `.roadmap`, `.whatWeHear`, `.closingDisclaimer` | All verbatim into `moreDetail[]`. |
| `technology.components` (`[{ group, items }]`) | `technology.groups` (`[{ vendor, label, items }]`) — same items, now vendor-marked so they render as Oracle / NVIDIA / SoftServe columns. The "Not used by this product" rows became `technology.notUsed[]`, still rendered, still muted. *(Superseded in §13: `notUsed[]` is deleted — the E3 layer summaries carry which platform each layer uses, which is the condition E3 set for dropping the line.)* |
| `technology.integration` / `.security` (`[string]`) | `[{ icon, text }]` — the same strings, each given an icon key. |
| `technology.narrative` | Rewritten to three sentences on all seven. The facts are unchanged; the sentence count is the only edit. Cut again to ~40 words in the round recorded in §10. |
| `technology.layers` | Unchanged in this round (empty on the two Lakehouse products). Filled for both in the round recorded in §10 — see §10.3. |
| `pov.*` | Unchanged, plus the new `pov.facts` fact strip. `pricing`, `disclaimers` and `ladder` are byte-identical. |

`technology.flow` and `pov.facts` are **new containers for existing facts** — see 9.3.

### 9.2 Industries — source per product

The industry chips are an icon-set rendering of the verticals each pack already publishes. No new vertical was invented, and no customer name is implied by any key.

| Product | Keys | Source |
|---|---|---|
| `account-insights` | logistics · financial-services · manufacturing | `RESEARCH/02` §3.4, the accelerator one-pager's verbatim four-vertical list (Logistics & supply chain · Financial services & banking · Industrial & manufacturing · Private equity funds). Private equity is carried by `financial-services`, and the full PE paragraph survives in `moreDetail`. **Three chips, not four:** the fourth was `professional-services`, taken from a different card's vertical list, and it contradicted the product's own expanded where-it-applies entries on the same tab, which name private-equity funds as the fourth vertical. A chip a reader cannot trace to the detail below it is worse than a shorter row. |
| `case-evidence-collection` | financial-services · manufacturing | `RESEARCH/01` §5.2 — the L2 card's generic persona examples: financial-crime analyst → financial-services; quality manager → manufacturing. **No pack one-pager exists for this product.** The row previously also carried `professional-services` (from the employee-relations persona) and `public-sector` (from a defence re-skin of the map); neither appears in `spec/content-spec.md` or the research files as a vertical this pack claims, so both were dropped rather than padded to four. |
| `plan-vs-actual-investigation` | construction · manufacturing · professional-services | `RESEARCH/01` §5.3 — the generalised card text names the class as "projects, work packages, orders, engagements, campaigns", and the architecture names zone layouts, bills of quantity and contract amendments (capital-project shaped) → construction; order portfolios → manufacturing; client engagements → professional-services. **Adapted, not quoted** — the source names personas, not industries. A fourth chip, `retail`, was dropped: it was inferred from the campaign-owner persona, and no source names retail for this pack. |
| `large-document-extraction` | travel-transport · professional-services · insurance · financial-services | `RESEARCH/02` §2.5, the one-pager's verbatim list: "Aviation - ground-handling contracts (SGHA) · Legal & commercial contracts · Insurance - policies & claims · Financial & regulatory filings". Aviation → travel-transport; legal & commercial → professional-services. |
| `workforce-optimization` | manufacturing · utilities · telecom · healthcare | `RESEARCH/02` §1.5, the one-pager's verbatim list: "Appliance & white-goods repair · Utilities: water, gas, electric · Telecom & cable · Industrial, medical & IT equipment". Appliance repair and industrial/IT equipment service → manufacturing; medical-device service → healthcare, corroborated by the same section's wider GTM list ("Hospital/health system"). |
| `cross-system-erp-qa` | cross-industry | `RESEARCH/02` (Jumpstart deck, "WHAT WE HEAR FROM IT AND DATA LEADERS"): *"The same two pains, every industry, regardless of stack."* No vertical list exists for either Lakehouse product, and inventing one would be fabrication. |
| `business-metrics-qa` | cross-industry | Same source, same reasoning. |

`energy`, `automotive` and `life-sciences` are declared in the fixed set and currently unused — the source decks name them as adjacent verticals but no pack claims them.

### 9.3 Copy written new for the grammar

| Where | What was written | Built on | Risk if wrong |
|---|---|---|---|
| `overview.metrics[].label` / `.qualifier` (all seven) | The tile captions | Each is a compression of the product's own `metrics.rows`, `metrics.emptyState` or `successStory.results` string. **No figure appears that was not already in `content.js`.** Four products have no numbers at all and ship four `value: null` tiles apiece | Low — but check the four all-qualitative products read as *"this is what we will measure"*, not as claims |
| `overview.metricsNote` (all seven) | — | **Verbatim** from the old `metrics.footnote` or `metrics.emptyState`. `workforce-optimization`'s is the two existing footnotes concatenated, in order | None |
| `overview.industriesNote` (all seven) | One line under the chips | account-insights' is the one-pager's verbatim lead ("Any business that needs to turn market and customer developments into pursuable opportunities across its account base, quickly."). The Lakehouse pair adapt the Jumpstart deck's "same two pains, every industry, regardless of stack". The other four are **written** — one sentence each, restating the class of work the product already describes | Low |
| `overview.scope.in` / `.out` (all seven) | — | account-insights and large-document-extraction: compressions of their own shipped `inScope` / `outOfScope` lists. workforce-optimization: its own `pov.inScope` / `pov.notInScope` strings, split on `·`, plus its roadmap items as out-of-scope lines. case-evidence-collection, plan-vs-actual-investigation and the two Lakehouse products: composed from their own `pov.scope`, `pov.ladder[0].includes` and the exclusion blocks that now sit in `moreDetail` | Low — every line restates something already on the same page |
| `technology.flow[].step` / `.label` (all seven) | The four-step diagram labels | Composed from each product's own `technology.narrative` and `technology.integration` strings. The canonical stage vocabulary (Sources → Ingest/Extract/Mount → Reason/Optimize/Govern/Validate → Deliver) is **written**, and is the thing that makes the seven diagrams comparable | Low — no new component or vendor is named |
| `technology.groups[].label` (all seven) | Column headings | The old `components[].group` names, plus a `SoftServe application layer` / `SoftServe delivery layer` heading over what used to be filed under `Other` | None |
| `pov.facts` (all seven) | The four-tile fact strip | `duration` is `durationShort` shortened further; `price` is the headline of `pov.pricing[0]` or `Scoped per engagement`; `deliverablesCount` is `deliverables.length`, asserted by the checker; `team` is **written** as *"One SoftServe team"* — a compression of the standing `pov.team` sentence, which still ships in full on the same tab | Low |
| `products[*].hero.image.alt` (all seven, plus overview and services) | Image descriptions | Written against the shipped images and re-checked against the final set (§11.1). `site/assets/img/heroes/heroes.json` is the authority; these are copies so the page needs no runtime fetch | Low — but they must be re-checked whenever an image is swapped |

### 9.4 Hero imagery — the §8 deletion is reversed, and the set was rebuilt twice in §11

§8 of this file records that nine staged hero images and their `heroes.json` were deleted from the served root. F1 reinstated hero imagery. The first attempt at reinstating it staged eight sourced images alongside one generated one and declared `"source": "SoftServe brand imagery"` across the manifest; **that set and that claim did not survive review and no longer ship** — **§11.1 is the authority on what ships now** and why. What stands from this round:

- The images are the background of the **top block only** — the hero — on the Overview page, the Services page and each product page. They are never the background of a tab body, and never a full-screen wash.
- **`heroes.json` shipping inside `site/`** — the objection stands in full. The manifest is publicly fetchable from the served root, so **it must carry no internal source-deck filename, no customer or opportunity code, and no internal path.** The deck-and-media mapping for the shipped set lives in §11.1 and for the retired staged images in §8, neither of which is served. This is a ship-gate check, not a style preference: it is the same class of leak §8 caught.
- `content.js` carries a copy of each image's `file`, `alt` and `focal` so the page never fetches the manifest at runtime. Keep the two in sync; `docs/CONFIG.md` §3b is the operator-facing version of this rule.

### 9.5 `config.products[*].videoPoster`

New key, empty on all seven, documented in `CONFIG.md` §3. It is inert unless that product's `videoUrl` is non-empty. The renderer falls back to the YouTube thumbnail and then to the product's own hero image, so a YouTube demo needs nothing set here — which is why shipping it empty is the correct state and not an unfinished one.

---

## 10. Fix round on the visual-grammar build

This round took the F1–F3 build through QA and corrected what QA found. Nothing here introduces a new fact; every change is a restoration, a de-duplication, a removal of an unsourced claim, or a consistency repair.

### 10.1 The hero images were missing from the served root

The nine JPGs and `heroes.json` recorded in §9.4 as reinstated **were not on disk.** They had been deleted by an unrelated autosync commit, replaced briefly by nine byte-identical placeholder files, and deleted again. The result: every hero fell back to the same flat gradient, the per-product differentiation F1 asked for was invisible on all nine pages, and the console carried a 404 per hero request.

The complete original set was recovered from git and is now committed. `heroes.json` was rewritten at the same time: its `focal` values now match the CSS `object-position` actually shipping in `content.js`, its `alt` strings describe what each photograph actually shows, and its `source` field is generic on every entry (§9.4).

The nine `alt` strings in `content.js` were corrected to match. They had been written against images that were never the ones on disk — `workforce-optimization` read "service territory rendered as routes and coverage zones over a dark map" for a photograph of a container terminal. The hero image ships as `alt=""` because it is decorative, so no reader was misled; the descriptions are kept truthful as an operator record, and `CONFIG.md` §3b now says so explicitly.

### 10.2 Proof figures are no longer printed twice

`workforce-optimization` and `large-document-extraction` each printed the same figures in the METRICS IMPROVED tiles and again in the success-story card, with the same disclaimer sentences under both. The tiles keep the numbers; `successStory.results[]` and `successStory.footnotes[]` were deleted from both products, and the card is now narrative blurb + scope line + link. No figure was lost — each survives in the tile row, with the disclaimer carried once as `metricsNote`.

`large-document-extraction`'s third tile was replaced. It had read *"7–12% / Of an airline's direct operating cost"* — an aviation cost-structure fact, not a metric this product improves, sitting in the one row meant to be comparable across all seven and narrowing a horizontal pack to a single vertical. It is now a qualitative tile, *"Business-rule validators / Flag what a human must look at"*, drawn from the product's own feature list. The 7–12% fact still ships, in the "Why the error class is expensive" card inside More detail, where it is framed as context rather than as a result.

### 10.3 `technology.layers` filled for the two Lakehouse products

Both shipped `layers: []`, so five products rendered a four-section Technology tab and two rendered three sections. The rows were written from each product's own `technology.groups` and `technology.integration` entries on the same tab — the Lakehouse platform, the tenancy it runs in, the source-connectivity or existing-platform layer, and the SoftServe configuration layer. No component, vendor or capability is named that was not already published on that page. `providedBy` reads `Unchanged` for `business-metrics-qa`'s existing-platforms row, because the whole claim of that pack is that those platforms are not touched.

### 10.4 The success-story block renders only where there is a story

It previously rendered on all seven, printing an empty-state line to the customer on four of them — *"No customer engagement published yet — this is a new fixed-price offer"* and similar. That broke the standing rule that an element with no content is not rendered, and on a page sellers demo live it handed the prospect a section whose only content was the absence of customers.

The block now renders only where `overview.successStory.blurb` is non-empty: `account-insights` (a real in-flight first engagement), `large-document-extraction` and `workforce-optimization`. The five `emptyLabel` strings were deleted from `content.js` so the placeholder cannot return.

### 10.5 Unsourced industry chips removed

Three products lost chips that no source supports; see the corrected table in §9.2. The two Lakehouse products keep their single `cross-industry` chip — the honest answer for a horizontal offer — but it now renders as a full-width statement chip carrying the same line icon and the same geometry as a four-chip row, instead of one lonely pill in a row built for four.

### 10.6 Prose trimmed to the shapes the grammar promised

- `technology.narrative`, all seven: cut from 57–92 words to ~35. The detail lives in the flow-step labels and the component groups directly beneath it, which already carry it.
- `roi.text`, `workforce-optimization` (63 words) and `plan-vs-actual-investigation` (59): cut to ~30 so the callout band holds one or two lines on every product. `workforce-optimization`'s qualifying clause about what the proof measures was already published verbatim in its `moreDetail` "How the KPIs are defined" entry, so nothing left the page.
- `workforce-optimization`'s three roadmap out-of-scope lines merged into one; all three items still ship in full in the `moreDetail` roadmap entry.
- *"The model finds the most optimal schedules, maximizing KPIs"* → *"The solver returns the schedule that scores best against the weighted objectives."* The original was ungrammatical and an unsupported superlative in a section otherwise written in measured, evidence-bound voice.
- `business-metrics-qa`'s two `moreDetail` card titles lost their quotation marks. In the source deck they sat under a "WHAT WE HEAR FROM IT AND DATA LEADERS" header; stripped of that frame, quoted lines read as manufactured customer quotes on a page that otherwise never invents one. They now read as section labels, which is what they are.
- Straight apostrophes replaced with typographic apostrophes throughout `content.js` (the dashes were already correct).

### 10.7 The home page no longer repeats the Services proof block

Both pages rendered all five evidence entries. The home page now carries the two delivered proofs and a link through to Services, which keeps the full block including the method cards and the engagement still in preparation. A seller demoing home → services no longer shows the same screen twice.

### 10.8 ⚠ Ship gate — clearance still outstanding on the published proof strips

**This is the one item in this round that is not closed, and it blocks making the site public.**

The `workforce-optimization` and `large-document-extraction` proof figures — the tile rows, and the anonymised case entries in `overview.evidence[]` — are derived from `RESEARCH/07` §7.0, a deck marked *Confidential: Internal/Restricted* and under Oracle copyright, and from `RESEARCH/04`, an NDA-covered workshop transcript. §4 of this file already records the workforce clearance as outstanding. Two things are needed and neither is recorded as done:

1. **Written Oracle and customer clearance** for both anonymised proof strips. The copy is correctly anonymised and correctly hedged, but anonymisation is not the clearance — the research file says so in terms: nothing from it goes on a SoftServe website, one-pager or deck until the customer and Oracle approve in writing.
2. **Alex's explicit OK** for the `method-accuracy-journey` card (the 23%→81% accuracy story), which the research marks as needing his sign-off.

Until both are in hand and recorded here with a date, the fallback is the scope-and-method framing — constraints modeled, what the proof of value measured — with the ratios removed. **The fourth fix round took that fallback for the three workforce ratios (§14.1).** The rest of this gate is unchanged: the anonymised scope facts, the extraction proof figure and the accuracy-journey line all still need the clearances above.

**Where each gate now stands in the shipped data — check these two before the site gets a public URL:**

| Gate | Where it ships now | If withheld |
|---|---|---|
| Oracle + customer clearance on the two proof strips | `workforce-optimization` case study (`+4.5%`, `~5x`, and the 83%-of-12 and 15–20% figures inside `story`); `large-document-extraction` case study (`5–15 min`) | Drop the `metrics` array to the qualitative form and keep the scope row and the story's method sentences. The status chips and eyebrows do not change. |
| Content owner's OK on the accuracy-journey figure | `services.proof.stat` — the `81%` stat beside the measurement-method lead | The stat block drops cleanly: `lead`, `engagements`, `cta` and `footnote` stand without it, and the section still says how measurement works. |

Record the date and the answer here when each comes back.

---

## 11. Second fix round on the visual-grammar build

### 11.1 The hero set — what ships is photographic, graded to one register

**What ships:** nine photographic heroes, all of them SoftServe's own deck media, all put through one grade so the set reads as a single system. 1920 × 900, progressive JPEG 4:2:2 at quality 84, 90–280 KB each.

The set got there in two moves, both recorded here because the second undoes a claim the first made.

**Move one — the staged photographs were thrown out.** Four of the nine carried visible generative artifacts in the part of the frame the veil leaves most visible: glyph-soup handwriting and a spectacle arm passing through an ear (`case-evidence-collection`), illegible on-screen UI labels over a malformed world map (`plan-vs-actual-investigation`), gibberish "code" (`services`), garbled icon medallions (`account-insights`). That is the "AI page" tell the brief forbids, on the most prominent surface of every page, in front of Oracle sellers. The nine also sat in three incompatible registers — teal vector abstract, warm-orange abstract, dark photography — so "differ per product" read as "assembled from whatever was available", and the warm sources fought the teal accent the rest of the page is built on. Two further images mis-signalled their subject: a container terminal over a pack whose own industry chips are manufacturing, utilities, telecom and healthcare, and a lone silhouette at a dark multi-monitor desk over a stat row claiming a 500-strong practice.

**Move two — the in-repo line-art replacement was itself retired.** The first replacement generated eight synthetic teal diagrams procedurally (`tools/gen-heroes.py`, Pillow: near-black ground, one soft teal core, thin line work). It held one register, but it made every page hero a diagram on a site whose body content is already diagrams, and the owner rejected the register. **That set no longer ships and the script is deleted** — no file in this repository reproduces the shipped bytes, and nothing in the shipped set is generated here.

**The shipped set, file by file.** Media was unzipped read-only from 46 SoftServe decks and documents (presentation templates, the Oracle project folders, monthly AI product overviews); 329 rasters ≥ 800 px wide reduced to 205 unique after md5 dedupe, all contact-sheeted and reviewed. Nothing on OneDrive was modified. Deck names below are the operator record — they are deliberately **not** in the served manifest.

| Key | Deck source | Why it fits |
|---|---|---|
| `overview` | PoV approach & options deck, `image4.png` | A luminous aperture opening on a dark field |
| `account-insights` | AI Repeatable IP-Based Customer Stories, `image92.jpeg` | Signal graph over an out-of-focus night city |
| `case-evidence-collection` | AIDP Factory V2, `image21.png`, **mirrored** | A long row of upright record-plates, each separate, assembled into one run |
| `plan-vs-actual-investigation` | AI Repeatable IP-Based Customer Stories, `image83.jpeg` | A production line receding down a plant hall — planned versus actual output |
| `large-document-extraction` | OCI AI accelerators GTM, `image9.png`, **recomposed** | A deep stack of thin plates, light caught between the layers |
| `workforce-optimization` | AIDP Factory V2, `image31.png` | A tessellated field of zones with loose plates settling into the pattern — work zones and assignment |
| `cross-system-erp-qa` | OCI AI accelerators GTM, `image20.png` | Many parallel strata sweeping together into one continuous surface |
| `business-metrics-qa` | AI Repeatable IP-Based Customer Stories, `image93.jpeg` | A data-point landscape with brighter points along the ridges |
| `services` | AI Repeatable IP-Based Customer Stories, `image85.jpeg` | An engineer at code screens, seen from behind, no face |

Note the gap this table papers over: **there is no field-service, technician or dispatch photograph anywhere in the SoftServe corpus.** `workforce-optimization` therefore uses an abstract zone field rather than a literal picture of the work, which is the honest option — the two attempts at a literal one (a container terminal, a generated night route-network) both mis-signalled the pack.

**The grade — one recipe for all nine.** Focal crop to 32:15 → Lanczos resample to 1920 × 900 (unsharp when upscaling more than 1.2×) → a levels curve solved per image so the median luminance lands in the 45–65 band with p99 ≥ 200 → shadow-targeted denoise where the lift would amplify JPEG blocks → chroma collapsed onto the teal axis → teal cast → desaturate → fine grain. Shared constants: `CHROMA_PULL 1.90`, `TEAL (8, 38, 52)`, `TEAL_AMT 0.38`, `SAT 0.80`, `CONTRAST 1.03`, `GRAIN 0.075`, 350 KB cap. Two per-image knobs trim the spread — `teal` (0.72–2.30) and `sat` (0.78–1.05) — because the sources are not equally saturated; the blue data-wave needed pulling back and the grey-green plate stack needed pushing forward to land in the same family. The result is median 55–63 and p99 205–214 across all nine, every frame cool (B > G > R). No vignette and no left ramp is baked into the files: the site's CSS veil owns the text zone.

**Rights — one confirmation is outstanding.** Everything used is SoftServe's own deck media and no watermark or third-party stock mark appears on any selected image. But the photographic picks are **clearly AI-generated art commissioned inside a SoftServe deck**, not licensed stock — garbled micro-glyphs survive on some of them. **Confirm with whoever owns those decks before the site goes public.** Skipped as a class, deliberately: slide exports and product screenshots, architecture diagrams, customer logos, executive headshots, anything with legible customer names, and the bright organic pattern backgrounds from one customer deck (off-palette for a dark site). No face is identifiable in the shipped set — every person is a silhouette or seen from behind — and no customer name, logo or legible screen text survives in any crop.

**`heroes.json` hygiene — a ship-gate check.** The manifest sits in the served root and is publicly fetchable, so it carries `file`, `alt`, `focal` and a **generic** `source` ("SoftServe deck imagery") and `credit` ("SoftServe") — and **no internal source-deck filename, no media path, no customer or opportunity code**. The deck mapping lives in the table above, in this file, which is not served. This is the same class of leak §8 caught; it is a gate, not a preference. Nothing in the page ever fetches the manifest: `content.js` holds its own copy of `file`, `alt` and `focal`, so the two have to be changed together. The `alt` strings describe what each picture actually shows and name no customer; the hero `<img>` ships with `alt=""` because it is decorative, so they are an operator record rather than something a reader sees.

**The CSS treatment that goes with this set** (`assets/site.css`). The files are already dark and already teal, so the stylesheet does almost nothing to them and everything to the text zone:

- `.hero-bg-img` — `opacity: 1`, `filter: brightness(1.05) contrast(1.02) saturate(1.05)`. Near-neutral by design: the grade is in the pixels, not in the browser. A future image that needs a heavy CSS filter to fit is the wrong image.
- `.hero-bg-veil` — three stacked layers. A left-to-right ramp from solid `--bg` to transparent by 84 % (`.94` at 18 %, `.76` at 38 %, `.46` at 55 %, `.18` at 70 %), a top-and-bottom fade (`.24` at the top, `.30` at 75 %, solid `--bg` at the bottom edge), and a teal radial at `rgba(53, 204, 186, .09)` centred at 70 % 32 %.
- `.product-hero--media .hero-bg-veil` — the product hero holds a media panel on the right, so its ramp never reaches transparent: `.95` at 20 % down to `.40` at the right edge, with the teal radial at `.07`.
- Below 900 px the ramp is replaced by a top-to-bottom fade alone (`.52` → `.34` at 34 % → `.62` at 72 % → `--bg`) and the image drops to `opacity: .62`, because on a narrow screen the copy sits over the whole frame rather than in the left third.

Headline contrast is unaffected on desktop: the copy sits in the left third, where the veil is still ≥ 0.9.

### 11.2 One hero shape on all seven products

The product hero rendered in four different shapes: one product added a subline, two were bare, two appended `heroCaption` **below** the CTA row, and two added a `heroLine` above the title plus badges above the CTA. The third of those was also a hierarchy defect — the primary action was no longer the last thing in the hero. The slots now render in one fixed order, with an unset slot rendering nothing: breadcrumb → `heroLine`/`heroCaption` → `headline` → chips → `oneLiner` → `subLine` → `badges` → CTA. `heroCaption` is emitted through the same `.eyebrow.eyebrow--accent.hero-line` treatment as `heroLine`, which collapses the two variants into one; the now-unused `.hero-caption` rule was removed from the stylesheet.

### 11.3 The metrics heading follows the data

On four of seven products the heading **METRICS IMPROVED** sat over four tiles with no number in them and was closed by a footnote saying no metrics are published — the heading asserting an improvement the content withdrew two lines later. `metricTiles()` now heads the block with the new `sectionLabels.metricsPlanned` ("What the proof of value measures") when no tile carries a value, and keeps "Metrics improved" whenever at least one number is present. The component's own qualitative-tile fallback is unchanged.

### 11.4 Oracle Marketplace is off every customer surface until a listing exists

`config.js` carried `marketplace: true` on `large-document-extraction` and `workforce-optimization` with `marketplaceUrl` empty on both, so the site told customers two packs were "On Oracle Marketplace" — a hero badge, a badge on the list cards and overview tiles, and an "Available on Oracle Marketplace 2" facet — with nothing behind it, while the seller panel of the same page said "Oracle Marketplace package — Planned". No SoftServe pack is listed. `SPEC` §25/§323-325, `PROVENANCE` §83, `assumptions` §25/§112 and `open-questions` A1 all rule that no Marketplace link, badge, facet or line ships until a listing exists.

**The boolean was removed from `config.js` entirely** and every render path now keys off `marketplaceUrl` (`app.js` card chips, `product.js` hero chip and hero CTA, `products.js` facet predicate). The facet checkbox is left out of the rail while no product has a listing, and an `mp=1` in the hash is ignored in that state. Paste a real listing URL and badge, facet and CTA appear together.

### 11.5 The anonymised carrier label lost its region

`"A Gulf carrier"` + "Aviation — ground-handling contract management" + a new-entrant narrative narrows to roughly one company. `assumptions.md` §74 says these labels ship with geography and carrier-type framing removed, and the manufacturer label on the same page already carries no geography for exactly that reason. Now `"An international airline"`; the industry line under it is unchanged, so nothing a buyer needs is lost.

### 11.6 `plan-vs-actual-investigation`'s duration tile

The fact strip read `12 weeks + 2` — internal shorthand with a unit-less "+ 2", and inconsistent with the prose two blocks below on the same tab. Now `12 + 2 weeks`. The full "12 weeks, plus a two-week acceptance phase" still ships in the pricing block and the ladder, where there is room for it.

### 11.7 Seller-only commercial notes left the shipped bundle

`sellerGate.packagingNotes` ("Packages compress over time…", "Pricing assumes the accelerator pack already exists…") and two stale-collateral notes under `sellers.notes` shipped inside `data/content.js`, gated only by a localStorage flag. The first tells the buyer the price will fall if they wait; `assumptions.md` files it as seller-panel-only for that reason, and applies the same reasoning to the named contact — "a client-side gate is not access control… scrapers read JSON".

`sellers.notes` and `sellerGate.packagingNotes` are **gone from `content.js`**. The seller panel now renders an empty container and, after the gate passes, fetches `SITE_CONFIG.sellerGate.notesUrl` (`same-origin` credentials) and fills it from the response; an empty `notesUrl`, a failed fetch or an empty payload renders nothing at all — no heading, no error, no console noise. `notesUrl` ships empty, so no seller notes ship. The payload shape and the rule that the path must be one the deployment actually authenticates are documented in `CONFIG.md` §2. `sellerGate.notesHeading` is the only piece of this that stays in `content.js`, because a heading is not a commercial fact.

The two retired stale-collateral notes, recorded here so the knowledge is not lost: the `account-insights` accelerator-pack one-pager carries an earlier product name on its cover, and the `large-document-extraction` sales deck is titled "Large Document Extraction and Validation" — same product, earlier name. The retired packaging notes are quoted at the top of this section.

---

## 12. The E2 / E3 / E5 round — the compact Overview, the layered stack, and the contact card

Alex's locked edits of 2026-09-14. This section covers only the **data layer**: what was added to `content.js`, where each string came from, and what was written new. The renderer and the imagery are logged by their own rounds.

### 12.1 Source roots used in this round

| Source | What it supplied |
|---|---|
| `…/Packs/Use case maps/AI use case map - partner variant 2026-09-11 design pass.pptx` + `AI workflow patterns - AIDP-NVIDIA-OracleAI mapping.xlsx` (tab "Patterns v2") | The L2 pattern definitions and the per-persona examples that ground the industry cases for the four products with no packaged collateral |
| Workforce Optimization — sales one-pager (2026-07-13), service-packages deck, Accelerator Pack one-pager | The four verticals verbatim, the capability matrix, the four-tier solution layers, the reference-architecture node labels, the CTA block |
| Large Document Extraction and Validation — sales one-pager, Accelerator Pack one-pager, Sep playbook slides 7–8 | The four verticals verbatim, the capability matrix, the architecture node labels, the use-case boundaries, the CTA block |
| AI Signal-Impact Engine — Accelerator Pack one-pager, Sep playbook slides 9–10 | The four verticals verbatim, the capability matrix, the architecture node labels, the in/out-of-scope lists |
| NHS complaint-handling PoC doc (de-identified) | The three per-case outputs and the investigator-UI framing behind the `case-evidence-collection` stepper |
| SBG historical-package PoC doc (de-identified) | The five-verb "what it does" list behind the `plan-vs-actual-investigation` stepper, and the named technology stack (AI-Q, NIM/Nemotron, AI Vector Search, OpenSearch, AI Database 26ai, Document Understanding, Object Storage, Functions/Streaming/API Gateway/OKE, GPU compute) |
| AI Lakehouse Quick Start (2026-08-21) + AI Lakehouse Jumpstart event showcase (2026-09-03) | Everything on the two Q&A products: the TODAY/TOMORROW pairs, the TIME and TRUST pains, the CONNECT / MODEL+GUARD / AI LAYER / PROVE phases, the GA-features-only line, the governance framing |
| Oracle post-PoC business case for the field-service engagement | Read for the workforce `manufacturing` case **in anonymised form only** — three countries, ~30 modelled constraints, dispatcher approval in the loop. No customer name, no figure, no logo, nothing marked Confidential. |

### 12.2 `overview.steps[]` — the workflow stepper

Four steps on every one of the seven, mapped to the workflow the pack's own material describes: intake → processing → review/decision → delivery. Titles and step text are **new copy**, written to the register of the source; the `features` arrays hold the **existing** `overview.features` strings unchanged, redistributed across the steps.

Nothing was invented into the bullets, and nothing was lost: `tools/check-grammar.js` now asserts that the union of the steps' features equals `overview.features` exactly, so a bullet cannot be dropped or duplicated by a later edit.

| Product | Step titles | Grounding |
|---|---|---|
| `account-insights` | Bring in the signal · Filter it, then fan it out · Reason the "so what" per account · Score, cite, review | The one-pager's capability groups: Inputs & grounding → Trigger & filtering → Opportunity & risk reasoning → Review & output |
| `case-evidence-collection` | A case opens · Assemble the evidence · Build the case file · Investigate and decide | The pattern's L2 definition ("an event or a batch sweep opens a case → evidence assembled → an evidence file with a draft finding") plus the three per-case outputs |
| `plan-vs-actual-investigation` | Ingest the exports · Resolve records to the unit · Compare plan against actual · Review the evidence | The PoC doc's five-verb list: ingest and profile → normalize and map preserving lineage → compare → identify variances/patterns/drivers → present through a lightweight interface |
| `large-document-extraction` | Upload and classify · Extract against the rules · Score, cite, validate · Review and export | The Sep playbook's capability groups: Classification & routing → Extraction → Review → (export) |
| `workforce-optimization` | Load the period's data · Set the rules · Solve the plan · Review, approve, measure | The TOMORROW paragraph ("uploads the period's data, runs cuOpt on OCI, and reviews the optimized allocation… before export") plus the allocation-rules / review-and-approval / KPI areas of the capability matrix |
| `cross-system-erp-qa` | Connect the applications · Shape one decision domain · Guard it in the data layer · Ask in plain language | The Jumpstart Case 2 phases, verbatim in structure: CONNECT W1–2 → MODEL + GUARD W2–4 → AI LAYER W3–5 |
| `business-metrics-qa` | Mount what you already run · Build the gold layer · Scope it by role · Answer across every source | The Jumpstart Case 1 phases, same four |

### 12.3 `overview.industryCases[]` — the industry tabs

Twenty-four cases across the seven products. Every `industry` key was already named as a vertical in a source; **the `problem` and `solution` prose is new copy in every case**, written to the source's register, because no source carries a per-industry problem/solution pair for these packs.

| Product | Keys | Where the vertical is named |
|---|---|---|
| `account-insights` | logistics · financial-services · manufacturing | One-pager "Where it applies": Logistics & supply chain · Financial services & banking · Industrial & manufacturing · Private equity funds (the fourth folds into `financial-services`) |
| `case-evidence-collection` | financial-services · manufacturing · professional-services · public-sector | The four persona examples on the use-case map's *Case investigation* row: financial-crime analyst · quality manager · employee-relations partner · case investigator (complaint handling) |
| `plan-vs-actual-investigation` | construction · manufacturing · professional-services | The map's project-controller example plus the product's own `moreDetail` personas (operations manager on order portfolios, delivery lead on client engagements) |
| `large-document-extraction` | travel-transport · professional-services · insurance · financial-services | One-pager list verbatim: Aviation — ground-handling contracts · Legal & commercial contracts · Insurance — policies & claims · Financial & regulatory filings |
| `workforce-optimization` | manufacturing · utilities · telecom · healthcare | One-pager list verbatim: Appliance & white-goods repair · Utilities: water, gas, electric · Telecom & cable · Industrial, medical & IT equipment |
| `cross-system-erp-qa` | cross-industry · manufacturing · logistics | Jumpstart "the same two pains, every industry"; the map's procurement-lead and operations-lead examples; the Case 2 TODAY text naming carriers and e-commerce alongside ERP and CRM |
| `business-metrics-qa` | cross-industry · retail · manufacturing | Jumpstart TIME and TRUST pains; the map's merchandiser example ("sales by SKU, region, and promotion"); the business-manager example ("revenue, churn, or inventory questions") |

Two rules held throughout:

- **No customer is named, and no anonymised label is reused as a case.** The workforce `manufacturing` case draws on the delivered field-service engagement only in the terms already cleared for the evidence card — three countries, around thirty modelled constraints, dispatcher approval in the loop. No figure from the Oracle post-PoC business case appears here; that document is marked Confidential and carries no external-use clearance.
- **A case that would read the same under any other tab is not an industry case.** Each pair names something specific to that sector: ZIP-code work zones and no-shows, crew certifications and outage spikes, 60–100-page ground-handling agreements at 7–12 % of direct operating cost, cross-holding ripples, batch records and supplier history.

### 12.4 `overview.sideFacts` — the At-a-glance card

No new facts. Every value is a denormalised copy: `category` from `facets.categories[].full`, `platform` from `facets.technology[].fullLabel`, `availability` from the product's own `availabilityChip`, `povDuration` and `povPrice` from `pov.facts`. The checker asserts the availability and duration copies against their originals so they cannot drift.

One deliberate change of form: `pov.facts.price` on the two Lakehouse products reads `€30–50K fixed *`, whose asterisk points at a disclaimer that lives on the POV tab. The side rail has no footnote row, so the card carries `€30–50K fixed per use case` plus an explicit `povPriceNote` — "Indicative, confirmed per scope; Oracle partner funding programs may reduce the net cost", compressed from the standing Lakehouse disclaimer. `large-document-extraction` and `workforce-optimization` carry "Figures are illustrative and subject to confirmation", verbatim from their decks. A bare asterisk with no footnote in view is the defect this avoids.

### 12.5 `technology.stack[]` — three blocks folded into one

`technology.groups`, `technology.layers` and `technology.integration` were three views of one architecture. They are now one layered accordion: `application` → `ai-engine` → `data-platform` → `infrastructure` → `custom`, top to bottom.

- **Every item is carried over, not rewritten.** The component names come from `groups[].items`; the layer summaries compress the `layers[].body` strings; the integration lines become `custom` items tagged `direction: "inbound" | "outbound"`.
- **Required / Optional** comes from what the source material already said: an item the one-pagers describe as out-of-the-box or as the system of record is `required: true`; an item described as optional, as "only where…", or as roll-out scope is `required: false`, usually with a `note` saying which.
- **The two Lakehouse products have no `ai-engine` layer.** Their own `notUsed` line says "NVIDIA — not required; Lakehouse first, GPU optional", and an empty engine row would contradict it.
- The three superseded keys are **left in `content.js` on purpose**, so no fact is at risk while the renderer is rebuilt. They are to be removed only once the implementer confirms nothing reads them; nothing new should be written into them in the meantime.

### 12.6 `shared.contact` — the one named human on the site

```
name:  "Karsten Tramborg"
title: "Alliances & Partnerships Director, SoftServe"
email: "oracle@softserveinc.com"
```

**Title source, quoted.** The CTA block of both external sales one-pagers prints, verbatim:

> **Karsten Tramborg** — Alliances & Partnerships Director, SoftServe — ktram@softserveinc.com

— the Workforce Optimization sales one-pager (2026-07-13) and the document-pack one-pager (2026-09-10). The research pass recorded the same string independently from the wiki (`context/areas/softserve/oracle.md`: "**Alliances & Partnerships Director, SoftServe** (title confirmed on the 2026-09-10 doc-pack one-pager, where he is the named CTA)") and from `oracle-packs.md`. So the title is not inferred: it is already printed on customer-facing collateral under this exact wording.

**The address is not.** The one-pagers print a personal mailbox; the site prints the practice mailbox `oracle@softserveinc.com`, per Alex's instruction. `ktram@` is now a banned string in `tools/check-grammar.js`, so it cannot return through a later edit. `AIDP` and `AltraDOC` were added to the same ban list in this round — the first is internal shorthand for Oracle AI Data Platform, the second a third-party product named inside a customer's own estate.

**No LinkedIn URL ships.** None appears in any source read for this site, and the schema omits the key rather than guessing at a profile URL.

This is the only person named anywhere in `content.js`, and the research pass flagged him as the one safe candidate: of the eleven names on the practice slide, he is the only one already published by name, title and contact route on an external SoftServe artefact.

### 12.7 Tab rename

`shared.productTabs` — the `demo` tab became `{ id: "contacts", label: "Contacts", legacyId: "demo" }`. `legacyId` is the router's redirect instruction, not a render slot: `#/products/<slug>/demo` lands on `#/products/<slug>/contacts`.

`forms.demo` keeps `heading` / `sub` — that instance still heads the standalone request form on the home page, reached from the header pill at `#/#request-a-demo`. It gains `secondaryHeading` ("OR SEND A REQUEST") and `secondarySub` for the instance that renders **under** the contact card on a product page. One form, two jobs, two headings; the alternative was renaming the home page's primary ask, which nothing asked for.

### 12.8 Copy written new in this round

Everything below is new prose, written to the register of the shipped one-pagers. Nothing here asserts a number, a customer, a URL or a capability that is not already in a source.

- **28 step titles and 28 step texts** (four per product), §12.2. Structure grounded per the table there; the sentences are new.
- **24 industry `problem` / `solution` pairs**, §12.3. Every vertical is sourced; every pair is new prose.
- **35 stack layer `summary` lines** (five per product, four on the two Lakehouse products), §12.5. Compressed from the `layers[].body` strings and the source architecture descriptions.
- **`shared.contact.blurb`** — "Bring the account and the workflow: a fit check, a live walkthrough, or the scope of a proof of value on your own data." New; it restates the engagement shape already described in `forms.engagementSteps`.
- **`forms.demo.secondaryHeading` / `secondarySub`** — new, per Alex's instruction that the form under the contact card is headed "Or send a request".
- **17 new `shared.sectionLabels` entries** — `howItWorks`, `industryCases`, `caseProblem`, `caseSolution`, `outcomes`, `atAGlance`, `factCategory`, `factPlatform`, `factAvailability`, `factPovDuration`, `factPovPrice`, `povLink`, `layerRequired`, `layerOptional`, `directionInbound`, `directionOutbound`, `contacts`. Section headings, not claims.
- **Two `povPriceNote` strings**, §12.4 — one compressed from the standing Lakehouse disclaimer, one verbatim from the WFO / LDE decks.

### 12.9 Two industry chip rows were widened

`case-evidence-collection` carried two chips (`financial-services`, `manufacturing`) where `VISUAL-GRAMMAR.md` §5 documented four. `professional-services` and `public-sector` were added, both grounded in the persona examples on the use-case map's *Case investigation* row — the employee-relations partner and the complaint-handling case investigator. The §5 table is now generated from what the data actually holds, in both columns, so the two cannot disagree again; `account-insights` and `plan-vs-actual-investigation` had the reverse drift (the table listed a key the data did not carry) and the table was corrected to the data rather than the data to the table.

---

## 13. Third fix round on the E2 / E3 / E5 build

Twenty-two findings from a QA pass over the shipped build. Two were blockers, and both were in the same four files.

### 13.1 The two blockers — the workforce PoC screenshots

`workforce-optimization-1..4.jpg` were withdrawn and the product now ships four
designed illustrations like the other five do. Full account in `ASSETS.md` §1;
the short version is two independent failures in one asset set.

**De-identification.** The frames printed the engagement's real geography — ten
Dutch municipalities and an airport, on a labelled service-zone map — the
customer's own zone-naming convention (`NL_north_west_AlmereEast_Weesp` and
siblings), the zone count, and ten ten-digit technician resource ids. The page
beside them calls the engagement "a global home-appliance manufacturer", and §4
of this file records the deliberate decision to withhold the country names
because the geography narrows that label to roughly one company. The screenshots
put the country back at street level. `ASSETS.md` §4 had asserted these frames
"show synthetic or place-name data, not a customer's records"; that claim did not
survive looking at them, and it has been corrected rather than softened.

**Uncleared figures.** Two of the frames printed per-technician uplift in the
Weekly Schedule panel — "77% → 87% capacity", "4.98 → 6.47 jobs/day", "60% →
100%", "4.2 → 7.6" — six to eighteen times the median (+4.5%) the metric tile a
screen below is cleared to claim, under a disclaimer calling the results modeled
simulations. §4's careful suppression of the mean, the maximum and the disputed
+26% was undone by a screenshot.

The four replacements are drawn to the same grammar as the other twenty-two and
carry no figure at all: intake (`PERIOD LOADED`), weighted rules (`RULES SET`,
four rules tagged HARD / SOFT), the constraint solve (`PLAN SOLVED`), and
dispatcher review (`DISPATCHER REVIEW`). Every label restates a capability
already in `overview.features`. The captures can come back the moment they are
regenerated against synthetic data — a fictional metro, invented zone names,
synthetic ids, and deltas inside the cleared band.

### 13.2 Step frames — the legibility floor

All twenty-six illustrations were re-authored and the two surviving screenshots
re-cropped, against one rule now recorded in `ASSETS.md` §1: at the shipped frame
width of ~454 CSS px, label type must render at **≥ 12 px**. The old
illustrations set 20–26 px type in a 1600 viewBox — 5.7–7.4 px on screen, grey
smudges rather than words. Labels are now 44–56 px (12.5–15.9 px rendered) and
the scenes are laid out around that type: fewer, larger labelled nodes, wider
cards, and a soft plate behind the one label that has to cross artwork. No scene
lost a fact; three lost a label that was repeating the eyebrow.

The two document-extraction screenshots were full 1600 × 1000 application
captures whose UI text rendered at about 3 px and whose near-white panel was the
brightest element on a dark page. They are now 2.0–2.6× crops of the single
region each step is about, graded two stops further down (white to ≈ `#B0B8C0`),
with a 1 px inset rim in CSS so every frame is bounded the same way.

### 13.3 The Overview rail

E2's sticky rail had never once stuck: `fitRail()` only set `.is-sticky` when the
rail fitted the viewport, and at the demo resolution of 1440 × 900 the rail
measured 1303–1693 px on all seven products. It was also **taller than the MAIN
column it accompanies on all seven**, leaving 9–398 px of dead gutter under
"More detail".

Three changes, no measurement in JavaScript:

- The success story moved from the foot of the rail into MAIN, under the industry
  tabs. E2 puts the success-story *download* in the rail; no product has a
  `successStoryUrl`, and what actually rendered there was the narrative band.
- The rail's stat tiles and glance rows are tightened (`.rail-card` overrides).
- `.ov-layout` stretches the rail cell to MAIN's height and the **At a glance**
  card pins (`.rail-card--pin`). It is the last card in the rail, so nothing
  scrolls underneath it while it is held — the reason the taller Outcomes card
  above it cannot be the one that pins.

Measured after, at 1440 × 900: rail content 1203–1263 px against MAIN 1329–1652 —
rail shorter than MAIN on all seven — and the pinned card 338–378 px, comfortably
inside the viewport.

**One target is still missed, and the finding that named it had the cause
backwards.** E2 asks the Overview to read in ~1.5 screens. MAIN is 1.48–1.84
screens and the rail no longer drives the tab body's height. But the measure
"tabbar to end of document" includes the prev/next pager (114 px) and the site
footer (479 px) — 0.66 screens that no rail change can touch — so that figure
sits at 2.29–2.65 and shrinking the rail did not move it. Cutting it further
means cutting blocks E2 mandates. Flagged rather than forced.

### 13.4 Copy and data changes

| Change | What and why |
|---|---|
| Product names | All seven are sentence case. Five already were; `Account Insights` and `Large Docs Extraction and Review` were Title Case, and all seven sit side by side in the "Product of interest" dropdown on every Contacts tab. Prose mentions and the `diagrams.js` node title follow. The `Docs` / `Document` question is untouched — see L6. |
| US spelling | `modelled` → `modeled` (four places, one of them beside `modeled` in the same fact on the same page), `minimising` → `minimizing`, `enquiry` → `inquiry`. The corpus was already US everywhere else. `check-grammar.js` now fails on eight British forms so they cannot return. |
| `overview.industries[]` | Deleted from all seven. Every key it held was already an `industryCases` tab, so the More-detail disclosure told the same verticals a second time. `industriesNote` survives and now closes the tab block. |
| Eleven `moreDetail` entries | Deleted: the per-vertical paragraphs on `account-insights` (3), `large-document-extraction` (4) and `workforce-optimization` (4) that repeated a vertical already carried by a tab. `account-insights`' *Private equity funds* entry stays — it is the one vertical the tabs do not hold. One telling per vertical, per product. |
| `technology.notUsed[]` | Deleted from all seven, with `sectionLabels.notUsed`. E3 set the condition: the layer summaries now state which platform each layer uses. The line rendered as orphaned micro-type below the accordion it referred to, and only on some products. |
| `forms.labels.submitRequest` | New — "Send the request". The Contacts form's button read "Request a demo", a leftover from the retired `/demo` tab, directly under a heading calling the same action "send a request". `FORMS.render` gained a `submitLabel` option; the home page's instance is unchanged. |
| `shared.contact.photo` | Emptied. See 13.5. |
| `config.contactEmail` | `oracle@softserveinc.com`. See L9. |

### 13.5 The headshot is withheld

`ASSETS.md` §3 recorded that the portrait was identified "by position, not by
face" — a fixed EMU offset from a text run on a team slide — and that "no facial
comparison was made". The site prints that person's name, title and a working
mailto beside the picture on every Contacts tab and on the Services page. If the
offset heuristic picked a neighbouring tile, the site publishes a colleague's
face under Karsten's name, to customers.

`shared.contact.photo` is now empty and the card falls back to its "KT" initials
avatar, which is the site's own rule for an asset that is not there. The file is
out of `site/`. `check-grammar.js` warns while the key is empty rather than
failing, so the state is visible on every run. **Someone has to confirm the image
is him;** `ASSETS.md` §3 holds the exact steps to put it back.

His **title** is not at issue: *Alliances & Partnerships Director, SoftServe* is
verbatim from the CTA block of both the Workforce Optimization (2026-07-13) and
document-pack (2026-09-10) sales one-pagers, and independently from
`context/areas/softserve/oracle.md`.

### 13.6 Layout and interaction fixes

| Finding | Fix |
|---|---|
| Products grid | `.market-grid > .market-tile:last-child:nth-child(odd)` stretched the seventh tile to full width with its copy capped at 50 %, and re-fired on any odd filtered count — so picking a facet reshaped the last card mid-session. Both rules deleted; an odd row now ends with one tile at column width. |
| Tile veil, desktop | The vertical layer reached a fully opaque `#0C0C0C`, and the horizontal layer ran to `.12` on the right — darkest exactly where the smallest type sits, transparent where nothing needed protecting. Rebalanced to a flatter ramp: the eyebrow and one-liner gain contrast and the imagery survives. |
| Tile veil, mobile | At 375 px a one-column tile is roughly three times the image's own aspect, and a full-bleed cover crop at that height shows a slice too zoomed to read as anything — which is why the E1 treatment looked applied to some products and not others. Below 1024 px the image keeps a 17 rem band at the top of the card and fades into the card ground. |
| Contact card, product pages | Spanned the full 1440 content width with its content in the left 45 %. Capped at 48 rem, the measure of the Services instance and of the form beneath it. |
| Industry figure | The index-0 panel's image carried `loading="lazy"` although it is visible on first paint, so the block could paint an empty bordered rectangle. Panel 0 is now `eager` + `fetchpriority="high"`; hidden panels stay lazy. |
| Vendor marks | Normalised to one cap-height and one opacity across the five layer rows, via `.group-mark--oracle` / `--nvidia` / `--softserve`. The Oracle wordmark had been rendering wider and brighter than the other two, reading as a rank the layer order does not intend. |
| Header CTA | `data-demo="header"` and its click handler were dead: `initHashLinks` is a capture-phase listener that `stopPropagation`s every `a[href^="#"]`, so the bubble-phase modal handler could never run. Both removed. The header pill routes to `#/#request-a-demo`, which is what it was already doing. |
| Unknown tab segment | `#/products/<slug>/bogus` rendered the Overview and left the bogus address in the bar, while the legacy `/demo` segment corrected itself. `resolveTab` now reports the fallback as legacy too, so both `replaceState` to `/overview`. |

---

## 14. Fourth fix round — the two E2 peer blocks, the video poster, and four copy facts

### 14.1 The workforce ratios were withdrawn (§4 ship gate, taken to its fallback)

Three of the four business-case figures shipped publicly while §4 and §10.8 both
recorded their clearance as outstanding. They are out of the data layer until a
written Oracle **and** customer sign-off is recorded in §4:

| Where | Was | Now |
|---|---|---|
| `overview.evidence[0].metrics` (home page + Services `#proof`) | four tiles — `~30 min`, `83%` / median `+4.5%`, `15–20%`, `~5x` | one tile: `~30 min` to optimize and approve a region's four-week plan, down from ~2 days |
| `overview.evidence[0].footnotes` | modelled-simulations line + the KPI line | the KPI line only — no modelled figure is left for the first line to qualify |
| `products[workforce-optimization].overview.metrics` (Outcomes rail) | four tiles, same figures | the `~30 min` tile only |
| `products[workforce-optimization].overview.metricsNote` | modelled-simulations sentence + KPI sentence | the KPI sentence only |

`RESEARCH/07` §7.1 has no independently-sourced replacement ratio: the
Workforce Optimization sales one-pager carries the **same** customer's KPIs, so
it is not a second source. No figure was substituted and none was invented.

`disclaimers.modeledResults` is left in place — it is the standing phrasing for the
day the figures return.

`tools/check-grammar.js` required 3–4 `overview.metrics` tiles. The rule now
allows **1–4**: the rail stacks in one column, so a single tile is a legitimate
shape, and a grammar rule must not be the reason an uncleared figure stays on a
public page.

### 14.2 `case-evidence-collection` — the proof-of-value duration had an invented lower bound

`RESEARCH/01` §5.2 on this pack: *"No package exists. The only shape on record
is the NHS engagement: 15 weeks."* The shipped `12–15 weeks` invented the 12,
and the 15 is one engagement's SoW duration rather than a pack figure — the
defect §14.3 penalises on `account-insights`. Both bounds are gone. All six
slots (`overview.sideFacts.povDuration`, `pov.facts.duration`, `pov.duration`,
`pov.pricing` Timeline, `pov.ladder[0].duration`) now read **`Scoped per
engagement`**, which is what this product's own price field has always said.
`pov.durationShort` is deleted, so the seller-gate CTA uses
`sellerGate.cta.bodyFallback` instead of interpolating a duration the product
does not have.

The umbrella figure propagated to Services, and both occurrences are corrected
with it — see §14.4.

### 14.3 `account-insights` — open question `C19`, answered the conservative way

`RESEARCH/01` §204 records the `PoC · 12 weeks · €192,525` block as **one named
customer's contract value**, and says the deck carrying it is internal-only
partly because of them. `C19` ("is about 12 weeks a pack duration or one
contract's") is still open. Every other commercial field on this product reads
*Scoped per engagement*; the duration was the single slot where a customer's
contract terms surfaced as a product fact.

All five occurrences — `overview.sideFacts.povDuration`, `pov.facts.duration`,
`pov.duration`, `pov.pricing` Timeline, `pov.ladder[0].duration` — now read
**`Scoped per engagement`**, and `pov.durationShort` is deleted. **`C19` stays
open**: if the pack team confirms 12 weeks is the pack's own scoping default,
record the confirmation here and the figure can return as a pack fact.

### 14.4 Services contradicted itself on the Lakehouse Quick Start

`services.howWeEngage.ladder[0].duration` said *30–45 days on the Lakehouse
Quick Start*; `howWeEngage.howAPovRuns.closing`, two sections below on the same
page, said *Six weeks*. Every source says 30–45 days
(`RESEARCH/03` §172/§180/§231, `RESEARCH/04` §204, `RESEARCH/02` §855/§865) and
so do the `cross-system-erp-qa` and `business-metrics-qa` product pages. *Six
weeks* appears in no source and is gone. The deep-research clause in both
strings follows §14.2: *scoped per engagement*, not *12–15 weeks*.

### 14.5 The anonymised workforce label, and the Manufacturing tab that restated it

`RESEARCH/07` §7.0 prescribes **"a global home-appliance manufacturer"** as the
anonymised label, so the label itself is unchanged. What was added on top of it
was not prescribed and did the re-identification work §4 had already tried to
avoid by withholding the country names:

- `overview.evidence[0].industry` — *Manufacturing — residential appliance and
  white-goods field service* → **Manufacturing — consumer-durables field
  service**.
- `products[workforce-optimization].overview.industryCases` Manufacturing tab —
  restated the same engagement almost verbatim (*residential appliance and
  white-goods*, *around thirty* constraints, *three countries*), so one customer
  read twice on one page and the "industry use case" was an anecdote rather than
  a pattern. Rewritten to the pattern: in-home repair of manufactured goods,
  work zones and allocations, market-specific rules as configuration. The
  engagement's specifics stay where they belong — on the proof card, once.

### 14.6 The demo frame stopped borrowing the hero photograph

`posterFor()` fell through to `product.hero.image.file` whenever
`config.videoPoster` was empty — which it is for all seven. On the three
products with `video: true` the frame rendered the product's own hero
photograph directly on top of the same photograph used as the hero backdrop: a
brighter cut-out of the wallpaper with a play button on it, in the first screen
a seller demos. The fallback is deleted; `posterFor()` returns
`config.videoPoster`, or the YouTube thumbnail where a `videoUrl` gives one, or
nothing.

With no poster the card renders without its `<img>` — the site's own
missing-asset rule, and the pending state `CONFIG.md` §`videoPoster` already
documents. A `.video-card--plate` modifier gives that state its own ground (a
navy-to-inset gradient with the accent glow) and a lighter veil, so an empty
frame reads as a designed plate rather than a failed image. The play button and
the WATCH THE DEMO caption are unchanged.

When a still is wanted before the recordings land, `videoPoster` takes a
**distinct** frame — a step screenshot, or a desaturated crop at another focal
point. Never the hero file.

### 14.7 The two E2 blocks now hold the peers-equal-height rule

Both blocks commissioned by E2 paired a fixed-ratio image with prose of variable
length, so the image sat short of the column beside it and the notch changed
size as the reader clicked through.

| Block | Measured before | Fix |
|---|---|---|
| `.ind-panel` — industry use cases | figure 245 px against 292–338 px of copy; the image appeared to grow and shrink as the tabs changed | `.ind-figure` is `align-self: stretch`; its `img` is `height: 100%` with a `15.5rem` floor and `object-fit: cover`. The `aspect-ratio` is gone from the desktop rule |
| `.stepper` — how it works | list 370–388 px against a frame pinned at 285 px; the two columns drifted out of register on every click | `.stepper` is `align-items: stretch`; `.step-frames` is a flex row, `.step-frame` is `flex: 1 1 auto`, and its `img` is `height: 100%` with a `17rem` floor and `object-fit: cover` |

Below 900 px, where both blocks collapse to one column, the images return to
`aspect-ratio: 16 / 10` with the floor removed — the ratio the frames were
designed at, and the one E2 asked to keep on mobile.

Measured after, at 1440: stepper list and frame 370/370 then 388/388 across all
four steps; industry figure and case 315/315, 315/315, 292/292 across the three
tabs. At 375: both images 325 x 203, exactly 16:10, no horizontal scroll.

### 14.8 ⚠ `C8` — AI-Q vs NeMo Retriever on `large-document-extraction` — still open, and it is a ship gate

The site names **NVIDIA AI-Q** as the required extraction engine in five places
on this product: `oneLiner`, the tag row, `overview.steps[1].text`, the
`technology` narrative, and the `ai-engine` layer's Required component
(`content.js:1556`). All five follow the pack's own external sales one-pager,
which pitches *"NVIDIA AI-Q on Oracle OCI"* and prints an architecture line
reading *NVIDIA AI-Q (GPU-accelerated extraction, VLM + RAG)*.

`RESEARCH/01` §5.4 records the direct contradiction. The internal use-case map's
NVIDIA cell reads *"NeMo Retriever extraction (Nemotron Parse · Page Elements ·
Table Structure) — AI Document Extraction pack … **not** the AI-Q agent"*, and
the red-team downgraded that row explicitly **"because AI-Q does not extract"**.

Nothing in the repository resolves this. Both artefacts are in the wiki, the
wiki flags it for Alex, and the fourth fix round did **not** pick a side,
because either choice is a technical assertion about the product that only the
pack team can make:

- The copy was left following the **external one-pager**, per the wiki's own
  stated rule that externally-facing artefacts are the ones to trust — and
  because the alternative is to publish a component name no customer-facing
  artefact uses.
- That leaves a **Required-tagged component asserting a capability its own
  internal source says the product does not have.** It is a correctness
  problem, not a confidentiality one, so it does not block an internal review —
  but it must not go to customers unanswered.

**What has to happen before launch:** ask the pack team which engine does the
extraction.

- If it is **NeMo Retriever**, change all five places to *NVIDIA NeMo Retriever*
  (or *NVIDIA NeMo* generically) and keep AI-Q only where it genuinely applies
  — note that `account-insights` and `case-evidence-collection` use AI-Q for
  retrieval and multi-document reasoning, which is not the contested claim.
- If it is **AI-Q**, record the confirmation here with a date, and the internal
  use-case map is the entry that gets corrected.

---

## 15. Round 3 — the content rewrite (E · F · G · H · C), 2026-09-14

Alex's round-3 decisions, given with the task. The data layer follows `BRIEF-3`
wherever it and an earlier round disagree; every such reversal is named below.

### 15.0 The clearance that changed, and what it does not cover

`BRIEF-3` **names two customers**: *Bosch* on `workforce-optimization` and
*Riyadh Air* on `large-document-extraction`, with their real logos. Both are
written up by name, with their logos, on SoftServe's own external sales
one-pagers and in the September playbook (`RESEARCH/02` §1.4, §2.4, §9.5), which
is the basis for naming them here.

What the clearance does **not** cover, and what stayed out:

- **No € figure, headcount, salary, operating baseline or contract value from
  the Bosch post-POC business case.** `RESEARCH/07` §7.2 lists them; none is in
  the data. `check-grammar.js` now bans `€190K`, `€5.17` and `€11.03` as
  strings, alongside `BSH` — the internal entity abbreviation — and `DHL`.
- **The ratios are back, the money is not.** §14.1 withdrew four Bosch ratios
  pending written Oracle **and** customer sign-off. `BRIEF-3` puts them on the
  page as the success story's figures, so the withholding is lifted **on Alex's
  instruction**, not because §4's clearance was recorded: the source deck is
  still an Oracle-copyright document stamped *Confidential:
  Internal/Restricted/Highly Restricted*, and the business-side sign-off is
  Alex's to obtain. **§4 stays open.** What ships is the external-safe tier of
  `RESEARCH/07` §7.1 only: median **+4.5%** jobs per technician per day, **~5x**
  return within three years, **83%** of simulations positive, **15–20%**
  dispatcher productivity, a **three-month** proof across **three countries**,
  **~30** modeled constraints — every one a ratio, a count or a duration, and
  never paired with an absolute figure (§7.3's back-solving caution).
- The `~5x` and `+4.5%` figures render inside a panel whose `story` ends
  *"Results are modeled simulations against a historical baseline, not measured
  production outcomes"* — `RESEARCH/07` §7.3's prescribed framing, and the
  reason `check-grammar.js` fails a success story with no caveat clause.

### 15.1 E — the seven one-liners, rewritten as product statements

Each is now *what it does · for whom · the outcome*, with the packaging story
removed; `check-grammar.js` fails the build on "packaged from proof of value",
"from proof of value to enterprise scale", "fixed price" and "quick start" in a
`oneLiner`. `BRIEF-3` supplied drafts; each clause was checked against
`RESEARCH/01`/`02` and an unsupported one was **dropped, never replaced**.

| Product | Source for the claims | Adjustment made to the brief's draft |
|---|---|---|
| `large-document-extraction` | `RESEARCH/02` §2.3 ("scoring confidence and citing the source page for every value"), §2.1 ("trusted, validated structured data") | "a **link** to its source page" → "a **citation** to its source page": the shipped artefacts say citation, and the split-view UI cites a page rather than linking out |
| `account-insights` | `RESEARCH/02` §3.3 (signal = news, filing, disclosure → opportunities and risks per affected account, cited), §3.4 | "sales and **customer** teams" → "sales and **account** teams": the sources say commercial / account teams; "customer teams" appears nowhere. The old `subLine` was deleted — the new one-liner carries the whole statement |
| `workforce-optimization` | `RESEARCH/02` §1.3, §1.4 (four-week plan in ~30 min; cuOpt; export to Oracle Field Service) | kept as drafted |
| `plan-vs-actual-investigation` | `RESEARCH/01` §5.3 (the generalised class definition), `RESEARCH/02` §4.2 | "programs and systems" → "completed projects, orders and engagements" (the class as the map defines it); "**likely** drivers" → "**candidate** drivers", the source's own word — *"evidence-backed candidates, never conclusions"* |
| `case-evidence-collection` | `RESEARCH/02` §4.2 (L2 definition), §4.2 NHS-shaped structure | "the **complete** evidence trail" → "the evidence trail": completeness is a claim no source makes for this pack (and the coverage-gap guarantee belongs to the sibling product) |
| `cross-system-erp-qa` | `RESEARCH/02` §5.2.2 case 2 ("ERP, CRM and the systems around them joined in one governed layer") | "span several **ERP systems**" → "span the ERP, the CRM and the systems around them": the join is across an estate, not across several ERPs |
| `business-metrics-qa` | `RESEARCH/02` §5.2.2 case 1 (mount the catalogs you already have; no migration), §5.2.1 (governed definitions) | kept the brief's "consistent definitions", added the sourced "over the catalogs and databases you already run — no data moved", which is this product's distinguishing claim |

Two tile bullets changed with them: both Lakehouse products' third
`tile.outcomes` line was *"The Quick Start offer is live today: 30–45 days,
fixed price, in your own tenancy"* — packaging, not an outcome. Both now say
what the customer keeps (`RESEARCH/02` §5.2.1, "What the customer keeps").

### 15.2 F — the Technology tab is two blocks

`technology.flow[]` and `technology.security[]` are **deleted** from all seven
products, and `technology.capabilities[]` is new.

- **`flow` (the How-it-runs diagram).** Four steps that named the same stages
  the layered stack already reads top to bottom, minus the components. Nothing
  was lost: each `flow.label` restated the layer summary beside it.
- **`security`.** Twenty-eight lines across seven products, every one of which
  restates something else on the page — tenancy and read-only access are in the
  `infrastructure` and `custom` layer summaries, the human gate is in the
  solution panel and now in the Jumpstart `low-risk` pillar, the audit trail is
  a capability, "production hardening is roll-out scope" is in `scope.out` and
  in `jumpstart.next`. Two lines carried a fact that was **not** duplicated and
  were folded in rather than dropped: *"access rules must hold in the data
  layer, not in the prompt"* (`case-evidence-collection`, now in the Jumpstart
  `low-risk` pillar) and *"roll-out: dedicated landing zone, IAM,
  observability"* (`workforce-optimization`, now in `jumpstart.next[0].text`).
- **`capabilities`** — four stage groups per product, the complete feature list
  under the stage that owns it. Sources: `RESEARCH/02` §3.5 (Account Insights'
  four capability groups, used verbatim as the stage names), §2.7 (the LDE
  capability groups, five folded to four: *Review* and *Export* merged,
  *Quality* and *Integrations* merged), §1.8 (the Workforce accelerator-pack
  matrix, whose four Areas are the four stages), §4.2 and §5.2 for the four
  unpackaged products, whose stages follow their own `overview.steps`.
- **`state` tags.** `workforce-optimization` is the **only** product whose
  matrix legend defines a roadmap tier (`RESEARCH/02` §1.8: *"● provided OOTB …
  ○ - roadmap"*), so it is the only product carrying `supported` / `roadmap`
  tags — twenty-one supported, six roadmap. The Account-Insights and LDE
  matrices grade *Oracle baseline vs SoftServe status*, and their `○` means
  "out of current scope", not "roadmap"; tagging from them would have invented a
  commitment. Those products' items carry no `state` at all.
- The `custom` layer is relabelled **"Custom configuration & integrations"** on
  all seven — the band is where the Inbound / Outbound lines live, and the label
  now says so.

### 15.3 G — POV Jumpstart → the Jumpstart block

Tab id `pov` → `jumpstart` (label **Jumpstart**), with `legacyId: "pov"` so
`#/products/<slug>/pov` still lands. The product key `pov` → `jumpstart`, in the
shape `BRIEF-3` specifies. This retires L5 of §1: the tab is no longer labelled
*POV Jumpstart*, which settles `SPEC`'s objection that "POV" reads as *point of
view* outside the team.

**Figures available per product, and what filled the gaps** — no figure was
invented, and every "Scoped per engagement" is a real absence:

| Product | Duration | Price | Source |
|---|---|---|---|
| `large-document-extraction` | 2 months | €75K services · €0/mo infra; Integration €300–500K · ~€10K/mo | `RESEARCH/02` §2.10 |
| `workforce-optimization` | 2 months | €90K services · €4K/mo infra; Integration €300–500K · ~€25K/mo | `RESEARCH/02` §1.9 (the one-pager + Sep-playbook pair, per its own resolution of the price conflict) |
| `cross-system-erp-qa` · `business-metrics-qa` | 30–45 days | €30–50K fixed per use case | `RESEARCH/02` §5.2.1 |
| `plan-vs-actual-investigation` | 12 weeks + a two-week acceptance phase | Scoped per engagement | `RESEARCH/02` §4.2; price is `[INT]` (SoW value) |
| `account-insights` · `case-evidence-collection` | Scoped per engagement | Scoped per engagement | §14.2 / §14.3 — both durations on record are one customer's contract term, and `C19` is still open |

The two indicative-price asterisks ("depends on document volume, page counts
and pipeline complexity" · "depends on the usage and optimization rules
complexity") are folded into the `next[0].price` string itself, so no asterisk
renders without its footnote in view.

Facts that used to live in `pov` and where they went: `deliverables` →
`outcomes`, rewritten as customer outcomes · `prerequisites` → `needs`, cut to
the three that gate the start · `phases` / `howItRuns` → `timeline` ·
`pricing` + `facts` → `investment` · `ladder[1]` and `ladder[2]` → `next` ·
`team` → an `investment.includes` line · `creditNote` (100% fee credit into a
roll-out signed within 90 days) → an `investment.includes` line on both
Lakehouse products · `howMeasured` → the `tangible` pillar and the outcome line
that names the measurement. **`capabilityMatrix` (the S/M/L glyph table) is not
carried forward**: it graded the three service tiers, and the tab no longer
renders three tiers. Its per-tier content survives as `next[].text`; the
per-capability detail it duplicated is in `technology.capabilities`.

**The packaging-internal disclaimers are gone site-wide** — *"Framed scope,
flexible add-ons"*, *"Each package's price and timing are set by specific
constraints"*, *"Custom features beyond the frame are added for additional price
and time"* — from all seven products, from `disclaimers.publicPricingFootnote`
and from `services.howWeEngage.ladderFootnote`. They describe how SoftServe
builds a quote. What survives: one `footnote` per investment card, the KPI
caveats that travel with published figures, and the Lakehouse pair's *"Price
indicative, to be confirmed per scope. All features used are generally available
product."* (`RESEARCH/02` §7.1). `check-grammar.js` bans the four strings.

### 15.4 H — the Overview tab

- **`overview.sideFacts` deleted** with the At-a-glance card. Every row on it
  was a denormalised copy — category and platform from the facets, availability
  from `availabilityChip`, duration and price from `pov.facts` — and the copy is
  what drifts. Nothing unique was on it.
- **`overview.successStory` reshaped** to `{ customer, logo, headline, metrics
  ×2, story, downloadLabel }`, and set to **`null` on five products**. The
  `state` / `blurb` / `evidenceId` / `adjacentMethodId` shape is retired; the
  two `evidenceId` links are no loss, because the evidence cards still render on
  the home page and on Services from `overview.evidence[]`.
- **Bosch** (`workforce-optimization`): big figures **+4.5%** median jobs per
  technician per day and **~5x** return within three years; the story line
  carries the 83% positive simulations, the 15–20% dispatcher gain, the
  three-month/three-country scope and the modeled-simulations caveat
  (`RESEARCH/07` §4a, §4b, §4e, §7.1, §7.3).
- **Riyadh Air** (`large-document-extraction`): **5–15 min** per 60–100-page
  agreement, down from 3–5 days, and **up to −20%** targeted reduction in manual
  data-entry effort, closing with the one-pager's own *"Targets from the proof
  of value; figures are illustrative, not contractual."* (`RESEARCH/02` §2.4).
  The customer's internal app name and the third-party SaaS product name stay
  out, as before.
- **The two evidence cards are named**: `workforce-proof` → `Bosch` +
  `assets/img/logos/bosch.png`, `extraction-proof` → `Riyadh Air` +
  `assets/img/logos/riyadh-air.svg`, each with its body line re-pointed from the
  anonymised descriptor to the company. This supersedes §14.5's anonymised
  label for those two cards **only** — the industry strings stay as §14.5 set
  them, and every other evidence card is still anonymised. `SCHEMA.md`'s
  "never a company name" rule on `EvidenceCard.customer` is narrowed to "no
  third company name without the same explicit clearance".

### 15.5 C — the contact card

`shared.contact.photo` now ships: `assets/img/people/karsten-tramborg.jpg`,
confirmed by Alex on 2026-09-14. This reverses §13.5, which withheld the
headshot because the only file located had been matched by its position on a
team slide rather than by a face — the confirmation is the missing input, and it
came from the person who knows the face. `ASSETS.md` §3 is the place to record
the file's provenance.

`shared.contact.bring[3]` is **written** copy (no source): the three things a
first scoping call actually needs, which `forms.engagementSteps` already says in
prose — *"Bring the workflow, a rough volume and the current cycle time"*. It is
that sentence, split into a list the panel can render beside the form.

### 15.6 What the renderers must change with this data

The data layer moved first; `site/pages/product.js` and `site/pages/products.js`
still read four keys that no longer exist. Until they are updated:
`product.overview.sideFacts` (was read unguarded), `technology.flow` (guarded,
renders nothing), `technology.security` (renders an empty block), and
`product.pov.*` throughout the POV tab. The seller-gate CTA's `{duration}`
placeholder now reads `product.jumpstart.durationShort`, which is present on the
five products that publish a duration and absent on the two that do not — the
same contract `pov.durationShort` had. `sectionLabels` lost the keys those
blocks used, so a renderer still calling `label("flow")` or `label("ladder")`
prints `undefined` rather than failing loudly.

## 16. The interactive walkthrough round — 2026-09-15

### 16.1 What was added

- `site/demo/large-document-extraction/` — a guided, interactive walkthrough of
  the Large docs pack, to Alex's brief (chat, 2026-09-15): brand-agnostic,
  industry-neutral, no integrations and no real inputs (the upload and the
  download are mocked), the real workflow simplified to six guided steps, hints
  that allow only the designated action, and a UI rebuilt to a higher standard
  while keeping the product's layout, data model and information model.
- **Source of the narrative:** the customer-demo recording
  `Large Document Extraction and Validation Demo.mp4` (SoftServe OneDrive,
  `Projects/Oracle/Customers/RiyahdAir/`), read frame by frame. The recording has
  **no narration** — its audio track transcribes to nothing — so the narrative is
  screen-derived: upload → contracts list → split-view review with service
  groups, a per-row citation to the source page, confidence and pending/approve
  status → row details with evidence and actions → approve all → the flat
  rate-card export opened in a spreadsheet.
- **The generalisation:** the SGHA ground-handling case became a supplier Master
  Services Agreement with a rate schedule (facility services — cleaning,
  guarding, call-outs, volume discounts, cancellation charges), keeping the same
  information model: document → metadata → service groups → rate rows →
  citation + confidence + status → export. Every name, site, rate and clause is
  invented; the one validator flag (a non-contiguous discount tier) is staged.

### 16.2 What changed on the site

- The product is renamed **"Large docs processing and review"** (Alex, chat
  2026-09-15) — `name`, `headline`, the overview evidence link and the Jumpstart
  promise. The slug stays `large-document-extraction`; this settles the
  "…and Review" vs "…and Validation" question §15 left open, in favour of neither.
- `config.js` gains `demoUrl` on every product (empty except Large docs) and a
  `videoPoster` for Large docs; `content.js` gains `shared.demoCta`;
  `product.js` renders the secondary hero button and the same button inside the
  pending-video panel, both `target="_blank"`.
- **Found on the first click (Alex, 2026-09-16):** on the claude.ai preview the
  relative link died with `ERR_BLOCKED_BY_RESPONSE` — the artifact host refuses
  to serve a supporting file as a top-level page. `demoPreviewUrl` (the
  walkthrough as its own artifact) was added and `product.js` uses it only on
  that host; the relative path stays canonical for the real deployment.
- Step frames 1–4 for Large docs are captures of the walkthrough (`ASSETS.md`
  §1); the two video-derived frames and the two illustrations are gone.

### 16.3 Still open

- The walkthrough states counts only (48 pages, 25 values, 1 flag) and makes no
  time or effort claim; whether it should carry the one-pager's figures is
  Alex's call.
- The demo-video recording is still pending; the poster is a walkthrough still
  until it lands.

---

## 17. Round 4 — anonymization, tag families and case studies, 2026-09-16

Alex's round-4 decisions (T1, T2, C1, C2), given with the task. Two of them
reverse round 3.

### 17.0 The clearance that was withdrawn

**§15.0 is reversed. No customer may be named anywhere on the site** — not in
copy, not in alt text, not in a caption, not in a data file, not in a doc that
ships. No logos. The two names round 3 cleared on the strength of SoftServe's
own external one-pagers (§15.0) are out, along with the two logo references,
the `customer` / `logo` / `logoStacked` keys and the `PROOF OF VALUE · <name>`
card labels.

What replaced a name: an **anonymized descriptor** — industry and scale only —
plus an **industry medallion** where the logo sat. The descriptor is written so
that it does not narrow to one company: no country, no city, no product line, no
figure that back-solves to an identity. The four descriptors are in §17.2.

The logo files stay on disk, unreferenced (`ASSETS.md` §4). `check-grammar.js`
now fails on every customer name as a word-boundary string (`Bosch`,
`Riyadh Air`, `DHL`, `SBG`, `BSH`, `Binladin`, `Belron`, `KPN`, `NHS`, `OMV`,
`Channel 4`) **and** on any `assets/img/logos/` path in `content.js`.

**§4 is still open and is now moot in one direction.** The workforce figures
still rest on an Oracle-copyright, `Confidential: Internal/Restricted/Highly
Restricted` deck and still need Oracle **and** customer sign-off (§4, §15.0).
Anonymizing the customer removes one of the two re-identification vectors, not
the copyright question. Record the sign-off here, with a date, when it arrives.

### 17.1 T1 · the three tag families, and the end of the availability chip

| Change | What shipped |
|---|---|
| `shared.tagFamilies` (new) | `pattern` (outlined chip, tooltip *Workflow pattern*, one icon key per `facets.categories[].id`) · `tech` (solid navy pill, tooltip *Runs on*, one icon key per `facets.technology[].id`) · `availability` (two teal badges: `Demo` / *Demo available* / `play`, `Oracle Marketplace` / *Available on Oracle Marketplace* / `storefront`) |
| `availability` (top level) | **deleted** — the three-state chip map |
| `products[].availability`, `.availabilityChip`, `.availabilityTooltip` | **deleted** on all seven |
| `products[].tags` | the trailing availability string removed from all seven (*Available now* ×3, *In preparation* ×2, *Fixed-price offer* ×2) |
| `products[].statusNote` (new) | *"Packaged offering in preparation — scoping conversations are open."* — verbatim from `BRIEF-4` T1, on `case-evidence-collection` and `plan-vs-actual-investigation` only |
| `facets.footnote` | unchanged; it never referred to the availability states |

The badges are driven by `SITE_CONFIG`, not by `content.js`: `Demo` on
`products[slug].video === true` (already a real boolean on all seven,
`CONFIG.md`), `Oracle Marketplace` on `products[slug].marketplace === true` —
**a new boolean, added in this round and `false` on all seven.** L3 of §1 is
unchanged by that: no SoftServe listing on Oracle Cloud Marketplace has been
found by public search, no owner or date is on record, and `marketplaceUrl` is
still empty everywhere. The flag exists so the facet and the badge read one
switch instead of inferring it from a URL; the checker fails a `marketplaceUrl`
set while the boolean is `false`, so a listing cannot appear on the site
half-wired. **Turning either badge on for a product is a claim — confirm the
listing exists before flipping it.**

The seven icon keys `tagFamilies` names are **not in the `ICONS` registry yet**
(`VISUAL-GRAMMAR.md` §6, "Round-4 icons still to draw"); `play` is. The data
layer moved first, as it did in round 3.

### 17.2 C1 · the case studies, figure by figure

`overview.successStory` → `overview.caseStudy`, reshaped, on the same surface
with the same 3px teal rule. **`null` on three** (`case-evidence-collection`,
`cross-system-erp-qa`, `business-metrics-qa`) — down from five, because the two
in-flight engagements now render.

**Engagement → product → descriptor** (the internal column never reaches the site):

| Engagement | Product | Descriptor that ships | Status |
|---|---|---|---|
| Bosch (cuOpt) | `workforce-optimization` | A global home-appliance manufacturer | `modeled` |
| Riyadh Air (AI-Q) | `large-document-extraction` | An international airline | `measured` |
| DHL (AI-Q) | `account-insights` | A global logistics and supply-chain operator | `in-preparation` |
| SBG (AI-Q) | `plan-vs-actual-investigation` | A major construction and engineering contractor | `in-preparation` (d) |

**The status a case carries is the one its own sources support**, not the
strongest one the brief allows. Three of the four entries above moved after the
first build: a modeled result stopped calling itself measured, an engagement in
preparation stopped calling itself under way, and a pre-contract engagement
stopped rendering at all.

**A note on what this section was built from.** The `…/scratchpad/research/`
tree is not on disk in the session that wrote round 4, so `RESEARCH/01…07` could
not be re-read. Every figure below was taken from **this file's own recorded
citations** (§1 L10, §4, §15.0, §15.4, §12.1) and from the wiki pages
`context/areas/softserve/{sbg-poc,oracle-pipeline,oracle-packs}.md`, which are
current truth for the two in-flight engagements. **No figure is new**: the two
measured cases carry exactly the numbers §15.4 already shipped, and the two
in-flight cases carry no number at all. If the research tree is restored, the
worthwhile check is the two qualitative targets in (c) and (d) — that neither
understates a figure the sources actually publish.

#### a. `workforce-optimization` — *"A global home-appliance manufacturer"*

- **Descriptor** — adapted from `RESEARCH/02` §1.4 / `RESEARCH/07`: a
  residential appliance-repair field-service operation. *Home-appliance
  manufacturer* is the industry; *global* is the scale. The country names stay
  out (§4), so the descriptor does not narrow to one company on geography.
- **Area** — *"Field-service operations across three countries"*, `RESEARCH/07`
  §7.1, candidate-external-safe tier.
- **Status `modeled`, eyebrow Modeled.** The card used to say `measured` while
  its own story closed on *"Results are modeled simulations against a historical
  baseline, not measured production outcomes"*, and the ROI block lower down said
  *"KPIs measured before/after on proof-of-value data"* — three characterisations
  of one engagement's data on one page, with the strongest label chosen first and
  hedged afterwards. The defensible one is the story's, so a third status key was
  added (`shared.caseStudyStatus.modeled` → *"Modeled in the proof of value"*)
  rather than softening the caveat `RESEARCH/07` §7.3 prescribes. `metricsNote`
  was re-pointed to match: the KPI-parity sentence stands, and it now says
  *modeled against that baseline, not measured in production*.
- **Metric 1** — `+4.5%` *median gain in jobs per technician per day, optimized
  against the current plan*. `RESEARCH/07` §7.1 via §15.4. The mean (6.1%) and
  the maximum (21.7%) stay out; the median leads (§4).
- **Metric 2** — `~5x` *return within three years on the modeled rollout*.
  `RESEARCH/07` §7.1 via §15.4. Rendered with **no absolute figure anywhere near
  it**, per §7.3's back-solving caution.
- **Story** — carries **83% of the 12 modeled simulations** positive and the
  15–20% dispatcher productivity gain (same source), the stack (NVIDIA cuOpt on
  OCI), the data ("the customer's own historical operations data") and the human
  gate. Closes on `RESEARCH/07` §7.3's prescribed framing: *"Results are modeled
  simulations against a historical baseline, not measured production outcomes."*
  **The denominator is restored:** §1 L10 and `oracle-packs.md` L30 both record
  the figure as 83% of 12 simulations, and a bare 83% reads as a large-sample
  result rather than a twelve-run sweep to exactly the audience most likely to
  ask. **The geography vocabulary was corrected**: *ZIP-code work zones* /
  *ZIP-code coverage* became **postcode**-based — the underlying engagement is
  European (`oracle-packs.md` L25), the card's own area line says *across three
  countries*, and ZIP codes exist in none of them.
- **Scope row** — *Three months* · **Historical operations data** · *Around
  thirty* constraints modeled, from `RESEARCH/07` §7.1 rows 1 and 6,
  candidate-external-safe, country names withheld. The second cell used to read
  FOOTPRINT / *Three countries*, which the area line directly above already says;
  the row is three facts the card does not otherwise carry, so it now names the
  data footprint, as the other cases' rows do. **Absent:** every € figure,
  the ~5,300 work-zone count and the 38/75/100% phasing (medium
  re-identification risk, §4).
- **NDA line** — *"Customer under NDA · reference call available on request"*,
  `BRIEF-4` C1 verbatim.

#### b. `large-document-extraction` — *"An international airline"*

- **Descriptor / area** — `RESEARCH/02` §2.4: an airline's ground-handling
  contract management. Adapted; the airline's name, its internal app name and
  the third-party SaaS product name all stay out, as in every earlier round.
- **Status** `measured`, eyebrow **Measured**. **One metric, not two** — see below.
- **Metric 1** — `5–15 min` *to extract a 60–100-page agreement end to end, down
  from 3–5 days*. The pack's own external sales one-pager, `RESEARCH/02` §2.4,
  unchanged from §15.4. This is the figure the delivered proof of value produced.
- **Metric 2 — `up to −20%` was removed.** It is an explicit proof-of-value
  **target** (`oracle-packs.md` L40: *"Riyadh Air's −20% is an explicit PoC
  target"*), and its own label said *targeted*. Carried under a **MEASURED**
  eyebrow and captioned *"Targets from the proof of value"*, the card contradicted
  itself three ways in one panel. Of the two consistent readings — drop the target
  and keep the measured figure, or relabel the whole card as targets — the first
  is the smaller change and keeps a real proof point on the page. The callout now
  renders a single figure in a single column, which is why `metrics` allows one.
- **Story** — closes on *"Measured in the proof of value on the customer's own
  documents; figures are illustrative, not contractual."* — the one-pager's
  *illustrative, not contractual* hedge kept, its *targets* framing dropped with
  the target metric. Names the stack (NVIDIA AI-Q, the customer's own OCI
  tenancy) and the citation model.
- **`metricsNote` agrees with it.** The ROI block's closing line was *"The figures
  the delivered proof of value produced are in the case study on this page"* while
  the case study called the same numbers targets — one page disagreeing with
  itself about whether the headline was measured or aimed at. It now reads *"The
  figure the delivered proof of value produced is in the case study on this
  page."*
- **Scope row** — *60–100-page agreements* (§2.4) · *about one month* to onboard
  a new station before (§2.4, already shipping in this product's `moreDetail`) ·
  the reviewer approval gate (§2.3). No contract value, no contract duration.
- **NDA line** — as above.

#### c. `account-insights` — *"A global logistics and supply-chain operator"*

The first logistics engagement (internal name withheld). **Status
`in-preparation`, eyebrow Target outcomes.** The status was `in-progress` and the
story said *"A first engagement is under way on the customer's own account
base"*, naming a data footprint as if it were already connected.
`oracle-packs.md` L92 records the pack's proof state as *"Proof: none yet — PoC
in preparation, results to follow"*, and **in preparation is not under way** —
the more so on a page where `case-evidence-collection` words the equivalent
state honestly. The chip, the story's opening clause, the scope row's STAGE cell
and the ROI block's `metricsNote` all now say *in preparation*; the metrics, the
caveat and the NDA line fitted that state unchanged. Sources: `context/areas/softserve/oracle-packs.md` (the pack is
derived from this engagement; *"Proof: none yet — PoC in preparation, results to
follow"*; the signal→opportunity fan-out is the pack's stated differentiator) and
`oracle-pipeline.md`. The round-3 evidence card's own text (`SPEC` §1.4 Card C,
§14.5) is the source for what the engagement measures.

- **Descriptor** — already the shipped anonymized descriptor on the round-3
  evidence card (§14.5); unchanged, and now the callout's title.
- **Area** — *"Account planning across a global enterprise account base"*,
  adapted from the pack's own framing.
- **Metric 1** — `Hours, not quarters` *from a market signal to a qualified
  opportunity a seller can act on*. **Qualitative, because no figure exists:** the
  pack has no delivered proof (*"PoC in preparation, results to follow"*). The
  value is the product's own side-rail tile — *Time to a qualified opportunity ·
  hours, rather than the next quarterly review* — restated as an outcome. It
  replaces `One signal`, which was the product's **mechanic**, not an outcome:
  set at 40px in a numbers slot beside `+4.5%` and `5–15 min`, a capability
  restatement reads as a slot that had to be filled. The sanctioned qualitative
  form is a full turnaround or coverage statement.
- **Metric 2** — `Every account` *a signal affects, not only the one it names*.
  **Qualitative**, and a coverage claim rather than a mechanic: the fan-out is the
  pack's stated differentiator, stated as what the customer gets. The
  `Calibrated` figure it replaces said the same thing the story says in full, one
  line below.
- **Story** — opens *"A first engagement is being prepared"*; data footprint (CRM
  and account framing, the capability catalog, public filings), stack (NVIDIA
  AI-Q on OCI), what it measures. Closes on *"The figures above are target
  outcomes the proof of value is set up to measure, not results; they are
  illustrative, not contractual."*
- **Scope row** — *Proof of value in preparation* · the three data sources · the
  reviewer gate. **Absent, deliberately:** the contract value and the contract
  duration. Both are on record and both are internal (`C4`, `C19`, and
  `BRIEF-4`'s explicit instruction).
- **NDA line** — *"Customer under NDA · results follow at the end of the proof of
  value"*. This is a **deviation from `BRIEF-4` C1's single line**, which reads
  *"reference call available on request"*. Offering a reference call about an
  engagement that has produced no results is a promise nobody can keep, and
  `ndaLine` is a per-case field. One string reverts it if Alex wants the
  uniform line.

#### d. `plan-vs-actual-investigation` — *"A major construction and engineering contractor"*

The construction engagement, on the **owner's instruction** that it ships (§17.6).
A fix round had withdrawn it as pre-contract; the status key it now carries —
`in-preparation`, the same one `account-insights` carries — says exactly that,
which is what the withdrawal was protecting against. Source for every field:
`context/areas/softserve/sbg-poc.md` (read 2026-09-16) and §12.1, the historical-package
PoC doc behind this product's stepper and stack. The `…/scratchpad/research/`
tree is still not on disk, so `RESEARCH/01…07` could not be re-read here either
(§17.2's note stands); nothing below needs it.

- **Descriptor** — *"A major construction and engineering contractor"*. Industry
  and scale only. **The country is withheld** and so is every project name: the
  wiki's own anchor-project question (a named stadium, unsettled as of
  2026-09-11) is exactly the detail that would narrow the descriptor to one
  company in one market.
- **Area** — *"Plan versus actual across completed work packages"*, the SOW's own
  use-case statement generalized (reconstruct historical records into a
  package-level view of plan versus actual cost and schedule).
- **Status `in-preparation`, eyebrow Target outcomes.** Not `in-progress`: the
  SOW's delivery-cost section is still open, the Sep-1 kickoff target passed with
  no new date, and customer-side data access is unresolved — **no exports have
  been received.** The story opens *"A first engagement is being prepared"* and
  the scope row's STAGE cell says *Proof of value in preparation*, so nothing on
  the card claims work under way on the customer's data. That distinction is not
  cosmetic: this is a page Oracle and SoftServe sellers demo live, sometimes in
  front of the customer's own account team.
- **Metric 1** — `Hours, not weeks` *of expert time to produce an equivalent
  plan-versus-actual analysis*. **Qualitative, because no figure exists to
  publish:** the SOW's Operational Efficiency criterion is elapsed time and
  person-hours to produce an equivalent analysis, and its thresholds are
  explicitly **deferred to Discovery** (a Gate G1 exit criterion). The direction
  is sourced; the number is not, so none is invented.
- **Metric 2 — none.** One figure, the shape the checker allows for a case with
  one real outcome. `Evidence-backed` does **not** come back as a value: it is a
  capability restatement, not an outcome (see (c)), and a second slot padded at
  40px is the failure that rule exists to stop.
- **Story, two lines** — scoped to one use case on one completed project sample
  (the customer's own schedule, cost and contract exports); will run on Oracle
  Cloud Infrastructure with NVIDIA AI-Q over an evidence layer, reconstructing
  those records into one package-level view. Closes on the caveat the checker
  requires: *a target outcome the proof of value is set up to measure, not a
  result, and illustrative, not contractual.*
- **Scope row (3 facts, all external-safe)** — *Stage: Proof of value in
  preparation* · *Scope: one use case, one completed project sample* · *Data
  footprint: schedule, cost and contract exports*.
- **NDA line** — *"Customer under NDA · results follow at the end of the proof of
  value"*, the same per-case wording (c) uses and for the same reason: an
  engagement with no results cannot offer a reference call.
- **Deliberately absent**, and to stay absent: the customer name and country, the
  anchor project's name, the contract value, the 12+2-week term, the day-rate
  workbook, the infrastructure BoM, every SAR and EUR figure, the named SBG and
  Oracle individuals, and the internal vocabulary bans (*agent*, *single source
  of truth*) the engagement itself runs under.
- **When kickoff is confirmed**, record the date here and move the status to
  `in-progress` wording only if a status key for it exists; when results exist,
  `measured` (or `modeled`) with real figures replaces the qualitative metric.

The product keeps its `statusNote` (*"Packaged offering in preparation — scoping
conversations are open."*), which now agrees with the case rather than standing
in for it.

### 17.3 C2 · the home-page case-study screen

`overview.evidence` → `overview.caseStudies` and `overview.evidenceIntro` →
`overview.caseStudiesIntro`. `services.proof.evidenceIds` is gone entirely —
see §17.4a.

- **One card per engagement that has a case study — three today.** Each is a
  compact form of the product-page callout: medallion, descriptor, status chip,
  **one** headline metric with its eyebrow, one line, the link to the product.
  The checker asserts that each card's descriptor, area, industry and status
  equal the product's, and that its `product.name` equals the product's `name` —
  the round-3 rule that a reader clicking through must not meet a different pair
  of figures, generalized to every field the two surfaces share. The grid is
  three columns on desktop, two below 1180px, one below 900px.
- **The band 1 / band 2 split is gone**, and so are the `PROOF OF VALUE` /
  `FIRST ENGAGEMENT` / `METHOD` labels. §14 kept them deliberately non-uniform
  because the states were genuinely different; the status chip now carries that
  distinction in data, and a hand-written label that says the same thing is a
  second place to drift.
- **The two METHOD cards were folded.** `method-like-for-like` said that every
  KPI is computed identically for the current and the optimized plan and that the
  baseline is signed before the clock starts — which `workforce-optimization`'s
  `moreDetail` entry *"How the KPIs are defined"* already says in full. It is
  also, now, the **lead of the Services proof block** (§17.4a), where it reads at
  body size rather than as a footnote clause. `method-accuracy-journey`'s
  substance splits: the 81% accuracy figure is `services.proof.stat`, a labelled
  stat, and the ~80% practical threshold is that section's footnote. Its
  clearance status is unchanged — §10.8 still lists it as needing one, and moving
  it did not grant it.
- **Each card's footnote says only what the card shows.** A card whose headline
  value is words (`Hours, not quarters`) no longer carries *"figures are
  illustrative, not contractual"*: it disclaims figures it does not display, and
  `check-grammar.js` now fails that mismatch.
- `evidenceIntro` was rewritten as `caseStudiesIntro`: it used to say *"Two of
  these applications have been through a delivered proof of value"* over a
  five-card grid of mixed kinds, then *"four engagements, two measured and two
  under way"*. It now names three engagements — one measured, one modeled, one in
  preparation — and says every customer is under NDA, which is the honest reason
  the cards carry descriptors rather than names.

### 17.4 T2 · the Availability facet group

`facets.marketplace` → `facets.availability` = `{ label: "Availability",
options: [{ id: "demo", label: "Demo available" }, { id: "marketplace", label:
"On Oracle Marketplace" }] }`, with faceted counts, query params `demo=1` /
`mp=1`, and both reset by **Clear filters**. Search and the other two groups are
untouched.

`facets.marketplace.heroCta` (*"View on Oracle Marketplace"*) went with the
object: the Marketplace **badge** is the link to the listing now, so a second
hero button on the same URL was one control too many. The listing link still
renders only where `marketplaceUrl` is non-empty.

**Both options always render, with their faceted counts** — the group is part of
the rail's shape, not a function of today's config. A fix round hid an option
whose count was zero; that moved the rail under the reader between visits and hid
the one filter a seller reaches for first. `pages/products.js` carries no
hide-when-zero branch: a zero-count box renders **disabled** rather than absent,
the same way a zero-count radio option does, and `demo=1` / `mp=1` are honored
whatever the counts are. Today the counts are **demo 3, marketplace 2**.

**The two flags are the owner's statement, and the URLs are wiring that arrives
later** (§17.6). `video: true` on `workforce-optimization`,
`large-document-extraction` and `account-insights`; `marketplace: true` on
`workforce-optimization` and `large-document-extraction`. Both may be `true` with
an empty URL, and the renderers already handle that state on purpose: the hero
frame shows the *recording in preparation* panel until `videoUrl` is set, and the
Marketplace badge renders **unlinked** until `marketplaceUrl` is set. The one
cross-check `check-grammar.js` keeps is the reverse case — a URL set while its
flag is `false`, where the control would never render for a thing that exists.
L3 of §1 is unchanged and still the live risk: no SoftServe listing on Oracle
Cloud Marketplace has been found by public search, so **the Marketplace badge
rests on the owner's statement alone — confirm the two listings before launch.**

### 17.4a The Services proof block — the method, not a second copy of the cards

Services used to render the identical case-study grid the home page renders, from
the same ids, with the measurement paragraph as a footnote beneath it. A customer
or seller moving Overview → Services met the same four cards twice with nothing
new, which flattened the page and made the evidence feel padded rather than deep;
and the strongest measurement proof on the page — an engagement taken to 81%
accuracy — sat at 12px inside a three-line run-on sentence that also carried the
KPI-parity and threshold arguments.

`services.proof` is now `{ title, dividerLabel, lead, stat, engagementsTitle,
engagements[], cta, footnote }`, rendering:

- `lead` — the measurement discipline at body size: every KPI computed
  identically for the current and the optimized path, baseline and success
  metrics signed by customer, Oracle and SoftServe before the clock starts.
  Source: the former `methodNote`, unchanged in substance; the signatory list is
  `whySoftServe`'s *Value realization* item, already on the same page.
- `stat` — `81%`, the accuracy one engagement reached on a customer's existing AI
  solution after an evaluation framework and work on the data. Same source and
  same outstanding clearance as before (§10.8); it is now a labelled stat rather
  than a clause.
- `engagements[]` — one line per case study, in the same order, each naming what
  that engagement measures and against what, with a link to its product. **No
  figure may appear in one of these lines** — a number away from its caveat is
  rule 2, and the caveats live on the Overview cards. The checker enforces both
  the descriptor match and the no-figure rule.
- `cta` — back to the Overview case studies, which carry the numbers.
- `footnote` — the threshold caveat alone: around 80% is the practical point past
  which reviewing the output beats doing the work from scratch.

The section title moved from *CASE STUDIES* to **HOW WE MEASURE IT** and the
divider label from *How we prove it* to *Proof*, so the two surfaces no longer
announce themselves as the same block. The home page's link to it was retitled
to match.

### 17.5 The renderers, as they now stand

The data layer moved first again; the renderers landed in the same round and
read the round-4 keys. What changed, file by file:

- `assets/app.js` — `availabilityChip()` and `AVAILABILITY_DOT` are gone,
  replaced by `tagChip(family, id)` (the outlined pattern chip and the solid
  technology pill, each carrying its family tooltip and its glyph) and
  `availabilityBadges(slug)` / `badgeRow(slug)`, which read
  `SITE_CONFIG.products[slug].video` and `.marketplace` and nothing else. The
  eight round-4 icons are in `ICONS`. A delegated handler makes the Demo badge
  an action: on the product page it scrolls to the hero frame and opens it, and
  anywhere else it routes to the product page that carries the frame. The
  shared compact case-study card (`caseCard`, `caseMedallion`,
  `caseStatusChip`, `caseStudyById`) lives here, so every surface that shows a
  case renders one component from one array. The two comments that named the
  content owner and a decision date were removed from this file and from
  `site.css` — shipped bundles carry no internal attribution.
- `pages/product.js` — `heroChips()` builds the chip row from `category` and
  `facet` and skips `tags[0]` and `tags[1]`, which repeat them; since §17.7
  there is nothing past them to render, so the row is exactly one pattern chip
  and one platform chip. The badges sit at the right end of the same row and
  `statusNote` renders under the one-liner.
  The Marketplace and success-story hero buttons are gone — the badge is the
  link to a listing, and the case study owns its one link out. `successStory()`
  became `caseStudy()`: medallion, descriptor, area, status chip, one or two
  figures under their eyebrow (`case-figures--single` where there is one), story,
  three-fact scope row, NDA line, and the download link only where
  `successStoryUrl` is set. **The header band was dropped** — it rendered the same
  `assets/img/industries/<key>.jpg` the industry tabs render a few hundred pixels
  higher, so the page showed one photograph twice within a viewport at two crops;
  on the construction case it was additionally so dark it read as a strip rather
  than an image. `caseStudy.image` is retired and the checker fails if it
  returns. Below 768px the chip row's two wrappers dissolve so the availability
  badge flows as the last chip rather than orphaning onto a fourth row, and the
  case head top-aligns so a three-line descriptor keeps its icon-then-title
  reading.
- `pages/products.js` — the single marketplace checkbox became the Availability
  group: faceted checkboxes on the same two config booleans, `demo=1` and `mp=1`
  in the query, both reset by Clear filters. **Both options always render**
  (`availabilityOptions()` returns the data unfiltered) and both query params are
  always read; a zero-count box is disabled rather than a dead end, matching the
  radio groups. The search index reads `statusNote` instead of the retired
  `availabilityChip`.
- `pages/overview.js` — the proof rows became the case-study grid, one card per
  engagement that has one.
- `pages/services.js` — the case-study grid became the method block (§17.4a):
  lead, stat, one line per engagement, the link back and the threshold footnote.
  Its application-family chips became outlined and carry an *Application family*
  tooltip, so every solid navy pill on the site still means one thing.

Dead CSS went with them: `.story-*`, `.proof-row/-copy/-customer/-industry/
-scope/-metrics/-footnotes/-logo`, `.metric*`, `.brief*`, `.note-card/-grid/
-title/-body`, the three `.chip-dot--*` availability states and, in this fix
round, `.case-band`, `.case-band-img` and `.case-band-veil`. New: the
`.case-status--modeled` half-filled dot, `.case-figures--single`, and the
`.method-*` set behind the Services method block.

`SITE_CONFIG.products[slug].successStoryUrl` keeps its name: it is a config key,
not shipped copy, and renaming it would touch seven entries for no reader-facing
gain. It is what gates the case study's download link.

`check-grammar.js` passes with **0 failures and 0 warnings** on this data; it
asserts the new slots and cannot see the renderers, so the renderer side was
verified in the browser instead — the affected routes render with a clean
console, the case study appears on exactly the **four** products that carry one
and on no other, and the two unpackaged products are the only two with a status
note. The checker gained the round-4 fix-round rules: the three status keys and
their eyebrow map, `metrics` of length 1–2, the ban on `caseStudy.image`, the
footnote/figure agreement on home cards, and the shape of `services.proof`
including the no-figure rule on its engagement lines.

### 17.6 The owner's overrides restored (2026-09-16)

A fix round turned three of the owner's own decisions into QA findings and
reversed them. Each reversal was internally well argued and each was **wrong
about who decides**: a flag that says *this exists* and a case study that says
*this engagement exists* are the owner's statements about his own pipeline, not
data-layer inferences a checker may overrule. Restored, with the honesty
constraint kept in the place that actually carries it — the status chip, the
eyebrow and the caveat sentence, not the presence or absence of the block.

| # | What the fix round did | Restored to | Where the honesty lives now |
|---|---|---|---|
| 1 | `video: false` on `workforce-optimization` and `account-insights` (empty `videoUrl`) | `video: true` on those two and on `large-document-extraction` | The hero frame's own *recording in preparation* panel, which already existed for exactly this state |
| 2 | `marketplace: false` on all seven | `marketplace: true` on `workforce-optimization` and `large-document-extraction` | The badge renders **unlinked** until `marketplaceUrl` is set; L3's ship-gate warning stands |
| 3 | *On Oracle Marketplace* checkbox hidden while its count was zero; `mp=1` ignored | Both availability boxes always render with faceted counts; both query params honored | A zero-count box is disabled, not absent — the rail keeps its shape between visits |
| 4 | `plan-vs-actual-investigation` case study withdrawn as pre-contract; home grid cut to three cards | `caseStudy` restored at `status: "in-preparation"`; the grid is four cards (2×2) again | The `in-preparation` chip, the *Target outcomes* eyebrow, *"being prepared"* in the story, and *Proof of value in preparation* in the scope row (§17.2 d) |

Checker changes made with them, all narrowing rules rather than adding them:

- **Badge/facet flags are booleans and a URL may be empty.** The only value
  assertion left is the reverse case — `marketplaceUrl` set while `marketplace`
  is `false`. No rule asserts either flag to a particular value, because neither
  is the checker's call.
- **`overview.caseStudies` is derived, not counted.** It must hold one card per
  product carrying a non-null `overview.caseStudy` — `withCase.length`, whatever
  that is — and every such product must have a card. The old rule hard-coded
  three, so restoring a case study failed the build on an arithmetic constant.
  `services.proof.engagements` already read `cards.length` and needed no change.

The standing rule this round leaves behind: **when a QA finding and the owner's
instruction disagree about whether something exists, the finding is at most an
argument for how to phrase it.** Suppressing the item is not the fix available to
a fix round.

### 17.7 T3 · one canonical technology set (2026-09-16)

**The finding.** The platform a product runs on was named in two vocabularies at
once. The Products rail offered four facet labels; the product heroes and the
tile bands offered a per-product variant of the same platform, because `tags[]`
carried the engine as a second pill of the same family and colour with no
separator between them. A reader met *OCI + NVIDIA AI-Q* on the
`account-insights` hero and *OCI + NVIDIA* on the rail one click away, and
neither the composed string nor the rail label was wrong on its own — the
composition was. Five of the seven read this way, and the Services platform card
added a third spelling, *Oracle Cloud Infrastructure + NVIDIA NeMo Agent
Toolkit*.

**The set, as shipped.** Four platforms, this order, these ids, these labels —
`facets.technology` is now the only place a platform is named:

| id | label | products today |
|---|---|---|
| `oci-nvidia` | OCI + NVIDIA | 5 |
| `oracle-ai-data-platform` | Oracle AI Data Platform | 0 |
| `oracle-ai-lakehouse` | Oracle Autonomous AI Lakehouse | 2 |
| `oracle-ai-fusion` | Oracle AI for Fusion Applications | 0 |

`oracle-autonomous-ai-lakehouse` was shortened to `oracle-ai-lakehouse` in the
same pass, so the four ids read as one family; the label it renders is unchanged.

**Why `Other` had to go, and why *Oracle AI for Fusion Applications* is the
replacement.** A catch-all facet names no platform. It read as the gap in a set
the rest of the site presents as complete, and its own copy admitted what it
stood for — *"Everything outside the three above, including Oracle AI for Fusion
Applications"* — a platform the practice genuinely delivers on and Oracle
genuinely has a product name for. The brief's four-facet shape (L1) is
unchanged; the fourth is now named. **The name is Oracle's, spelled Oracle's
way: "Oracle AI for Fusion Applications".** *Oracle Fusion AI*, *Fusion AI Apps*
and *AI for Fusion* are not Oracle product names — writing one on a page aimed
at Oracle sellers and Oracle customers is the same class of error as *AIDP*,
which is already a banned string (§`AIDP`). The empty-state line the brief
supplied verbatim (L2) now has a referent on all four facets and is unchanged.

**What was normalised in the data.**

| Where | Was | Now |
|---|---|---|
| `products[*].tags` (all seven) | Three or four entries — the pattern chip, the platform label, then `AI-Q` (×4), `cuOpt` + `Oracle Field Service`, or `Select AI` (×2) | Exactly two: the pattern chip and the platform label |
| `overview.servicesTeaser.platforms[0].name`, `services.hero.platforms[0].name` | *Oracle Cloud Infrastructure + NVIDIA NeMo Agent Toolkit* | *OCI + NVIDIA* — the facet label, like the other three cards |
| `shared.tagFamilies.tech.icons` | keyed `oracle-autonomous-ai-lakehouse`, `other` | keyed `oracle-ai-lakehouse`, `oracle-ai-fusion` |
| `ICONS` in `assets/app.js` | `platform-other`, a two-band stack standing for nothing | `platform-oracle-ai-fusion`, a 2×2 application grid |

**No fact was lost.** Every engine removed from a chip was already in that
product's Technology tab before this round — `AI-Q` in the `ai-engine` stack
layer of all four products that carried it, `cuOpt` in `workforce-optimization`'s,
`Select AI` in both Lakehouse packs' `application` layer, `Oracle Field Service`
in `workforce-optimization`'s narrative, data layer, integrations and capability
matrix. The chips were a denormalised copy of the tab, which is the same failure
mode that retired `overview.sideFacts` in round 3 (§15.4): a second place to keep
in sync, and the first to go stale.

**The zero-count facets stay listed.** Two of the four match no product today.
Their rail options render disabled with a `0`, the way a zero-count availability
checkbox does (§17.4) — the rail's shape does not move under the reader between
visits — and `#/products?tech=oracle-ai-fusion` or `?tech=oracle-ai-data-platform`
is still honored, rendering that facet's `emptyState` inside the normal grid
container.

**Checker rules added** (`tools/check-grammar.js`), all of them narrowing:
`FACET_IDS` is the four ids and `FACET_LABELS` pairs each with its label;
`facets.technology` must hold those four in that order, each with a `fullLabel`,
a `description` and an `emptyState`, and an `other` id or label fails outright;
every product's `facet` must be one of the four; `tags` must hold exactly two
entries, `tags[0]` equal to `categoryChip` and `tags[1]` equal to the facet's
label; and both platform-card lists must carry four cards whose names are the
four labels in order. A third tag, a renamed card or a drifting label is now a
build failure rather than a QA finding.

### 16.4 Red-team round — is the demo narrower than the pack? (2026-09-16)

Alex asked whether the walkthrough was narrower than what the package docs
generalise. Checked against the sales one-pager (rates, rules and terms; four
verticals; the S/M/L feature rows), the Jul-27 accelerator one-pager (the
capability matrix and its worked examples per vertical) and the site's own
product copy. Four gaps, all closed **without touching the flow, the screens or
the information model** (upload → documents → split-view review → export; groups
→ rows → citation + confidence + status), so the demo stays a faithful preview of
the delivered reviewer:

- **Rates only.** The agreement now also carries **Commercial terms** (initial
  term, renewal notice, payment terms, indexation, service credits, termination —
  cited to clause paragraphs, not tables) and **Insurance requirements**
  (Schedule G): 34 values in 10 groups.
- **One document type, decorative classification.** Every document now shows its
  **type and schema** (list and metadata card); a **second document of another
  type opens** — an insurance policy schedule (locations, deductibles, sub-limits,
  endorsements, premium) with its own schema; the documents list gains a type
  filter and a KPI strip; a lease and a regulatory filing sit in the list as
  scenery.
- **One validator.** Now **four validator kinds plus low-confidence routing**:
  a suggested fix (tier continuity, on the agreement), a value outside its
  expected band against the prior document, a required field not found (enter
  the value or mark it N/A), a cross-field check (instalments vs premium), and a
  value under the 85% threshold routed to a reviewer. Approve all never touches a
  flag.
- **No integration or KPI surface.** A sources strip (manual upload · connected
  repository), export as XLSX / CSV / JSON against a named reference template
  with a mocked send to the cost / ERP target, and a KPI strip (documents,
  types, values, approved-without-edit share, benchmark accuracy on an annotated
  set). **The accuracy figure is synthetic** — flagged to Alex as the one number
  he may want removed.
- Also aligned with the real product: **schema-specific columns per group** —
  the discount table carries "Visits from / to", the rate table "Rate basis /
  Rate" — as the DOX reviewer does (its discount-handling table has different
  columns from its basic-handling table).

`tools/capture-demo-frames.mjs` gained a data-driven `MODE=script`;
`tools/capture-policy-scenario.json` walks the second document type through its
validator kinds. Frames and poster re-captured.

## 18. Round 5 — the home page rebuild, 2026-09-16

Alex's round-5 task, specified in `HANDOFF.md` §6 and refined by the
implementation brief the main session wrote with it. The home page was one
scrolling brochure — hero photograph, a three-wordmark trust strip, a products
intro, the case-study grid, a services teaser — and became **seven screens**,
each with its own object in `content.js` (`SCHEMA.md` §`overview`) and its own
component (`VISUAL-GRAMMAR.md` §9). The product pages, the Products page and
Services are untouched apart from one button.

### 18.0 Naming, and where this round departs from `HANDOFF` §6

*The site name in this table was replaced on 2026-09-16 by **Oracle AI & Data Solutions** (§20).*

**The naming, as shipped** (`HANDOFF` §6.1, unchanged):

| Where | What ships |
|---|---|
| `site.name`, `headerLockup.productName` | **AI Agents on Oracle** — the lockup reads `softserve │ AI Agents on Oracle`. Not "practice": the practice is the engine, the agents are the promise. |
| `site.title` | **AI Agents on Oracle — SoftServe**; a product page is *"&lt;Product&gt; — AI Agents on Oracle — SoftServe"*. |
| `site.metaDescription` | *"Enterprise AI agents and workflows on Oracle platforms: packaged products you can start now, and a dedicated Oracle AI & Data practice from SoftServe."* — §6.1's sentence with *ready-to-run* replaced, per (a) below, and with its opening *Best-of-breed* dropped in the copy round (18.5). Mirrored in `index.html`'s `description`, `og:description` and `twitter:description`. |
| `site.nav` | **Products · Services · Case studies**, the third an anchor into this page's own S5. *Overview* is gone; the lockup is the home link. |
| `site.navCta` | The header button, **Talk to us** → `#/services#contact`, replacing the *Request a demo* pill. `site.primaryCta` keeps that label for the product heroes and for `#/#request-a-demo`. |
| `site.secondaryCta` | **Browse the products** → `#/products`, for the Services hero's quiet button, which used to borrow `overview.hero.ctas[1]`. |

**Seven deviations from `HANDOFF` §6, each with its reason.** The brief wins
over §6 where they disagree; these are the places they did.

**(a) "Ready-to-run" is not used as a literal claim about all seven.** §6.1 puts
it in the words-to-use list and §6.2 headlines S2 *"Products you can run now."*
Two of the seven carry `statusNote: "Packaged offering in preparation — scoping
conversations are open."`, so a blanket *ready-to-run* contradicts the product
page one click away. What ships: the hero lead says **packaged** agents and
workflows, the S2 headline says **"Products you can start now, and a practice
that makes them yours."** (one sentence since 18.5), and the S2 body states the
split in the customer's own terms — *"Four are priced and ready to start today;
three are scoped per engagement."*

| | Products | Evidence in `content.js` |
|---|---|---|
| Priced | `large-document-extraction`, `workforce-optimization`, `cross-system-erp-qa`, `business-metrics-qa` | `jumpstart.investment` — €75K services · €0/mo infrastructure over 2 months; €90K services · €4K/mo over 2 months; €30–50K fixed per use case over 30–45 days (both Lakehouse products) |
| Scoped per engagement | `account-insights`, `case-evidence-collection`, `plan-vs-actual-investigation` | `investment.price` is `null` on the first two; `plan-vs-actual-investigation` prints *Scoped per engagement* over *12 weeks, plus a two-week acceptance phase*. The last two also carry `statusNote` |

**(b) The S1 duration stat reads "From 30 days", not "30–45 days" and not
"weeks, not quarters".** §6.2 offered both. *30–45 days* is one family's figure —
the Lakehouse Jumpstart — and printing it as the site-wide promise overstates
the two OCI + NVIDIA packs (about two months) and misstates
`plan-vs-actual-investigation` (twelve weeks plus a two-week acceptance phase).
*Weeks, not quarters* is the one phrasing that is actually false at the top of
that range: fourteen weeks is more than a quarter. **"From 30 days"** is a floor,
reads as a floor, and is true of all three clocks. The label carries the rest —
*"to a measured proof of value on your own data"*.

**(c) The S2 bullets were re-grounded against `content.js`.** §6.2 wrote six
bullets from the positioning; four of them claimed something the data does not
support, and the brief's instruction was to drop rather than replace what could
not be verified. All four were **re-pointed at a source** instead of dropped:

| §6.2 bullet | What ships | Why |
|---|---|---|
| *"Demo, Jumpstart scope and pricing on every product page"* | **"Jumpstart scope, timeline and investment on every product page"** | Only **three** products carry a demo frame (`video: true` on `account-insights`, `large-document-extraction`, `workforce-optimization`) and **two** print no price at all (`investment.price: null`). Every product page does carry the Jumpstart scope, a timeline and an investment card — that is the claim that holds on all seven |
| *"Fixed scope, fixed price, weeks not quarters"* | **"A fixed price on the packaged scope, scoped per engagement on the deep-research investigations"** | `services.howWeEngage.ladder[0].pricing` says *"A fixed price for the packaged scope; scoped per engagement on the deep-research investigations"* — the price is fixed **on the packaged scope**, not on everything. The bullet first carried the durations too; 18.5 cut them (they print in the S4 ladder `fact`) and put that row's third clock in their place |
| *"Evaluation-first: results are measured before you commit"* | **"Every KPI measured like for like against your current process"** | `services.proof.lead` (*"Every KPI is computed identically for the current path and the optimized one"*). "Evaluation-first" is an internal framing; the sentence it compresses is on the site already. The bullet also opened with the signed success metrics until 18.5 — that clause is said twice elsewhere on the page (S4 step 1, the S5 rail), so it was cut here |
| *"Expert pods: AI engineers, data engineers, Oracle architects"* | **"One team: AI, data and OCI architects with senior AI and data engineers"** | `services.whatWeDo.whoDeliversIt`, near-verbatim. **"Pods" is internal vocabulary** — it appears nowhere on the site and describes a staffing model no customer has been sold |

**(d) S5's method line is `services.proof` reused, and the NDA line is
narrower than §6.2's.** §6.2 named `services.proof.methodNote`; that key was
**retired in §17.4a**, which split it into `lead` + `stat` + `footnote`. The
home rail reuses all three verbatim, so the measurement discipline is written
once and read on two pages. §6.2's *"Reference calls available on request."* is
narrowed to **"Reference calls are available on request for the completed proofs
of value."**: the four cards are one `measured`, one `modeled` and **two
`in-preparation`**, and offering a reference call on an engagement that has not
run yet is a promise nobody can keep.

**(e) The S6 partner wordmarks sit in a navy strip inside the light band.** The
band is the page's one inversion, so a wordmark in it should be dark ink — but
`assets/img/nvidia-wordmark.svg` is a **light-grey** asset, invisible on a light
panel, and no dark NVIDIA wordmark is staged. The strip re-establishes a dark
ground inside the light column for the two marks. Navy also carries the right
meaning: on this site a solid navy surface is a **fact** (the technology pill,
the platform tiles), and *Built with Oracle and NVIDIA* is a fact.

**(f) The home H1 is set smaller than a product H1 and wraps to three lines at
1440.** *"ENTERPRISE AI AGENTS AND WORKFLOWS. BUILT ON ORACLE."* is far longer
than any product title, and the hero is two columns — the type has to fit
roughly 7/12 of the wrap rather than the full width. §6.3 asked for "the
existing display scale"; what ships is `clamp(2.25rem, 3.9vw, 3.75rem)` at
`line-height: .95`, wrapping as *ENTERPRISE AI AGENTS / AND WORKFLOWS. / BUILT
ON ORACLE.* — three lines by design, with the teal sentence always starting its
own line.

**(g) The two ladders still use two vocabularies, and that is pre-existing.**
The home S4 ladder reads **Jumpstart proof of value → Integration → Scale**,
which is the product pages' Jumpstart-tab vocabulary (`jumpstart.title`,
`jumpstart.next[].tier`). The Services page ladder still reads **Proof of value
→ Roll-out → Scaling** (`services.howWeEngage.ladder[].title`). The home page
was pointed at the product vocabulary because that is where a reader arriving
from S3 goes next. **This inconsistency was not introduced in this round** — it
has been in the data since round 3 — and it is left for a later one to resolve
in a single pass across both surfaces rather than half-fixed here.

### 18.1 Source map — every new string in `overview.*`

Labels as in §2: **verbatim** · **adapted** · **written**. "§6.2" is
`HANDOFF.md`'s copy draft; everything else is a key in `content.js` or a wiki
page named in `HANDOFF` §2. Nothing here introduces a fact that was not already
on the site.

**S1 · `overview.hero`**

| Key | Source | Label |
|---|---|---|
| `eyebrow` | §6.2 | verbatim (set in sentence case) |
| `headline.lead` / `.accent` | §6.2 | verbatim, split into the white lines and the teal one |
| `lead` | §6.2, with *ready-to-run* → *packaged* (18.0 a) and, since 18.5, *compounded by* → *with … on top*: *"Oracle's AI platforms, with SoftServe's enterprise agentic-AI experience on top: packaged agents and workflows for the jobs enterprises repeat most, and a dedicated practice that takes them from a fixed-scope proof of value to production."* | adapted |
| `ctas[0..1]` | §6.2 — *Explore the products* → `#/#products`, *How we deliver* → `#/#how-we-deliver` | verbatim |
| `stack.ariaLabel` | — the figure has no source; it describes what the three bands show | **written** |
| `stack.patternsLabel`, `stack.platformsLabel` | The two family names the site already uses: `shared.tagFamilies.pattern` tooltip *Workflow pattern*, and `facets.technologyLabel` | adapted |
| `stack.softserve.items[3]` | §6.2 names these three exactly. Each is on the site already: *Agentic-AI patterns* ← `services.whatWeDo.families` (seven application families); *Evaluation frameworks* ← `services.whatWeDo.attachesToEvery` (*"Evaluation, observability and model routing …"*); *Packaged delivery* ← `services.howWeEngage` (one accelerator pack, three packages) | adapted |
| `stats[0]` `7` | `products.length`; the label is *"products across three workflow patterns"* ← `facets.categories` (three). Its second clause, *"each starting with a scoped Jumpstart on your own data"* ← `productsPage.intro`, was cut in 18.5 | adapted |
| `stats[1]` `4` | `facets.technology` (the four canonical platforms, §17.7); the label is `services.hero.stats[3]` — *"Oracle platforms the practice focuses on"* — **verbatim** since 18.5, where *builds on* had no source | **verbatim** |
| `stats[2]` `From 30 days` | `services.howWeEngage.ladder[0].duration` — the floor of the three clocks (18.0 b) | adapted |
| `stats[3]` `500+` + label | `services.hero.stats[0]`, the cleared data-practice credential | **verbatim** |

**S2 · `overview.twoWays`**

| Key | Source | Label |
|---|---|---|
| `eyebrow`, `title` | §6.2, with *run now* → *start now* (18.0 a); 18.5 joined the title's two sentences into one — *"Products you can start now, and a practice that makes them yours."* | adapted |
| `panels[0].title`, `.body` | §6.2 for the shape; the three pattern names are `facets.categories[].chip` (18.5 replaced *document processing*, a fourth name for the same pattern, with **processing pipelines**); the four-priced / three-scoped sentence from the seven `jumpstart.investment` blocks; *"in your tenancy"* ← `productsPage.intro` | adapted |
| `panels[0].bullets[0..2]` | Bullet 1 §6.2 verbatim; bullet 2 `facets.technology` (the two platforms that actually carry products); bullet 3 re-grounded, 18.0 (c) | mixed |
| `panels[1].title` | §6.2 | verbatim |
| `panels[1].body` | `services.howWeEngage.lead` + `services.whatWeDo.whoYouWorkWith` — its last sentence, *"One contract and one accountable team, from scoping through run."*, is verbatim | adapted |
| `panels[1].bullets[0..2]` | `howWeEngage.ladder[0].pricing`, now near-verbatim — *"A fixed price on the packaged scope, scoped per engagement on the deep-research investigations"* (18.5 dropped the `.duration` half); `services.proof.lead` — *"Every KPI measured like for like against your current process"* (18.5 dropped the `howAPovRuns.steps[0]` half); `whatWeDo.whoDeliversIt` — all three re-grounded, 18.0 (c) | adapted |
| both `cta`s | §6.2 — *See the products ↓*, *How we deliver ↓*, as on-page anchors | verbatim |

**S3 · `overview.catalog`**

| Key | Source | Label |
|---|---|---|
| `eyebrow`, `title` | §6.2 | verbatim |
| `lead` | The retired `overview.productsIntro` — *"runs in the customer's own Oracle tenancy and keeps a human in the decision"* — plus `productsPage.intro` (*"in your own tenancy"*). It now reads *"Each product packages one workflow pattern, runs in your own Oracle tenancy and keeps a human in the decision."*: 18.5 cut the *Find the job first* opener (S2's first bullet already says it) and *packaged instance* (engineering jargon) | adapted |
| `patterns[].definition` ×3 | Composed from the `oneLiner` of every product in that pattern; the `processing-pipelines` definition is the long one, near-verbatim from `large-document-extraction`'s one-liner and its `overview.steps`, because that column holds one product and the definition fills the space a second row would have taken. The first two were revised in 18.5 — the current text and the reasons are in §18.3 | **written** — see §18.3 |
| `cta` | §6.2's footer link, re-pointed at the Products page | verbatim |
| the rows | **Derived**: `UI.orderedProducts()` filtered by `category`, each rendering `name`, `shortLine`, `UI.badgeRow(slug)` and `statusNote` | — |

**S4 · `overview.delivery`**

| Key | Source | Label |
|---|---|---|
| `eyebrow`, `title`, `anchor` | §6.2; the anchor is `how-we-deliver`, linked from the hero CTA and the S2 practice panel | verbatim |
| `steps[0]` title / body / fact | `services.howWeEngage.ladder[0].whatItIs` (near-verbatim; 18.5 restored its *a limited rule set*, which the first cut had dropped) + `howAPovRuns.steps[0]` for the signed-metrics sentence; `fact` = that row's `duration` and `pricing` compressed, and since 18.5 the only place on the page the two durations print | adapted |
| `steps[1]` | `howWeEngage.ladder[1].whatItIs`; `fact` *3–5 months* verbatim from its `duration` | adapted |
| `steps[2]` | `howWeEngage.ladder[2].whatItIs` + `whatWeDo.wrapAroundServices` (managed service); `fact` *3–12 months* verbatim. 18.5 re-opened the body with **Extend** — *Roll-out* is the Services ladder's name for the **Integration** tier — and marked the managed service **optional**, per `whatWeDo.attachesToEvery` (wrap-around services are priced on top of the package) | adapted |
| `footnote` | `services.howWeEngage.ladderFootnote` | **verbatim** |
| `why.title` | §6.2 | verbatim |
| `why.pillars[0]` Platform depth | `facets.technology` (all four labels) + `whatWeDo.whoYouWorkWith` (*"architects who own the Oracle reference architecture and the scoping"*) | adapted |
| `why.pillars[1]` Agentic-AI experience | `whatWeDo.families` — **without its count** since 18.5, as *"A library of agentic-AI patterns"* (the phrase the hero stack already uses, `hero.stack.softserve.items[0]`) — + `whatWeDo.attachesToEvery` (evaluation frameworks) + the human-in-the-decision line from the retired `productsIntro` | adapted |
| `why.pillars[2]` Packaged delivery | `howWeEngage.ladder[0].pricing` + `howAPovRuns.steps[0]` (signed success metrics) + `howAPovRuns.steps[3]` — *"an executive readout, and a costed expansion plan"*. Until 18.5 the second half was `services.proof.lead`'s signatory list, which the S5 rail prints one screen below | adapted |
| `ctas[0..1]` | §6.2 | verbatim |

**S5 · `overview.caseStudiesIntro`** — `body` carries over from round 4 unchanged
(§17.3); `eyebrow` is new chrome; `ndaLine` is §6.2's line narrowed to the
completed proofs of value (18.0 d); `cta` carries over. `title` carried over from
round 4 too until 18.5 replaced it with **"Four engagements on customer data,
under NDA."** — the count is `overview.caseStudies.length`, where *Measured on
customer data* was true of one of the four. The method line beside them is
`services.proof.lead` + `.stat` + `.footnote`, **reused, not copied** — one
string, two pages.

**S6 · `overview.about`** — see §18.2.

**S7 · `overview.contact`** — `anchor` unchanged (`request-a-demo`); `heading`
*"Talk to the Oracle AI & Data team"* is §6.2 verbatim. `sub` was adapted from
`site.footer.description` (*"Tell us which account or workflow you have in mind.
One scoping conversation starts it."*) with what comes back added from
`howAPovRuns`; 18.5 rewrote it to **"One scoping conversation starts it. We come
back with what a proof of value would cover, what it would cost, and what it
would measure."** — the footer's second sentence, then `services.contact.sub`'s
promise verbatim. The *tell us …* half was dropped because the footer says it
inside the same viewport, and `pages/overview.js` now passes **no form-side
`sub`** to `UI.contactSplit` — `forms.demo.secondarySub` said it a third time.
That key is untouched: the product pages still render it (`pages/product.js`).

**`products[].shortLine`** — one new string per product, each a compression of
that product's own `oneLiner`, nothing added:

| Product | `shortLine` | Compressed from |
|---|---|---|
| `large-document-extraction` | *Long documents turned into validated, structured data, every value cited.* | its `oneLiner` — the confidence score and the page citation reduced to *cited* |
| `account-insights` | *Market signals turned into cited, scored opportunities for every account.* | its `oneLiner` — news / filings / market signals reduced to *market signals* |
| `workforce-optimization` | *A region's four-week field plan, optimized in minutes and approved by dispatchers.* | its `oneLiner`; cuOpt and Oracle Field Service drop out — they are chips and Technology-tab facts |
| `plan-vs-actual-investigation` | *Every material variance, with its likely drivers and the evidence behind them.* | its `oneLiner` |
| `case-evidence-collection` | *The evidence trail for a case, assembled from every system and cited.* | its `oneLiner` |
| `cross-system-erp-qa` | *Plain-language answers spanning the ERP, CRM and the systems around them.* | its `oneLiner`; the platform name drops out — the row's badge says it |
| `business-metrics-qa` | *KPIs answered from one governed gold layer, with no data moved.* | its `oneLiner` |

The rule the checker holds: ≤ 12 words, ends in a period, and **never identical
to the `oneLiner`** — the tile and the hero keep the long form.

### 18.2 The About block — public corporate facts, fetched 2026-09-16

`overview.about` is the first block on this site built from **softserveinc.com
rather than from an internal source**. Every figure in it was read off a live
page on 2026-09-16 and recorded verbatim before it was used; nothing came from
memory, and nothing came from a search snippet.

**What the pages print, and where.** Four of the paths the fetch was pointed at
**404** — `/en-us/about`, `/en-us/partners`, `/en-us/partners/oracle`,
`/en-us/partners/nvidia`, each retried once. The working paths are
`/en-us/about-us` (which `/en-us/company/overview` serves byte-identically),
`/en-us/our-partners`, `/en-us/our-partners/oracle` and
`/en-us/our-partners/nvidia`. Write them down before the next fetch.

| Fact | As printed | Where | Fetched | Ships as |
|---|---|---|---|---|
| Founded **1993** | *"Founded in 1993, SoftServe's reputation is built upon three decades …"* | https://www.softserveinc.com/en-us/news/softserve-launches-new-brand-identity (dated Apr 8, 2026) | 2026-09-16 | `stats[0]` **1993 / founded**, and the body's *"founded in 1993"*. **The About Us page states no founding year** — this is the one tile with a newsroom-only source |
| **10K** employees | *"10K / employees"* — the site says **employees**, not "associates", and carries no "+" | https://www.softserveinc.com/en-us/about-us | 2026-09-16 | `stats[1]` **10K / employees** |
| **17** countries | *"17 / countries"* | https://www.softserveinc.com/en-us/about-us | 2026-09-16 | `stats[2]` **17 / countries** |
| **54** offices | *"54 / offices"* | https://www.softserveinc.com/en-us/about-us | 2026-09-16 | `stats[3]` **54 / offices** |
| HQ **Austin, Texas** | *"Austin HQ / GLOBAL HQ / 201 W 5th Street, Suite 1550, Austin, TX 78701"* — Austin carries the explicit `GLOBAL HQ` label; Lviv is labelled `Lviv HQ` inside the Ukraine country block | https://www.softserveinc.com/en-us/locations (and the site-wide footer) | 2026-09-16 | the body's *"headquartered in Austin, Texas"* |
| Self-description | *"SoftServe is a digital engineering company. We design and build data, cloud, AI/ML, robotics, IoT, and XR solutions."* | https://www.softserveinc.com/en-us (homepage hero) | 2026-09-16 | the body's *"a digital engineering company … that designs and builds data, cloud and AI solutions for enterprises"* — the homepage sentence trimmed to the three families this site is about |
| `link` | — | https://www.softserveinc.com/en-us/about-us | 2026-09-16 | *softserveinc.com*, the button out of the band |

**The body's second half is not from the public site.** *"500+ data experts, 150+
active projects, 30 Fortune 500 clients"* comes from `services.hero.stats`, the
data-and-analytics practice credentials that have been in `content.js` since the
first round. The block therefore mixes two sources by design: **corporate facts
from softserveinc.com, practice credentials from the existing data layer.** Keep
the halves straight when either is edited.

**Two cautions from the fetch, recorded verbatim so the next round does not
re-derive them:**

> The four facts NOT on any evergreen corporate page (founding year, the
> 1,000-experts figure, the 400+ NVIDIA figure, the Elite tier history) come
> from dated newsroom releases, which is a weaker footing for an evergreen
> "About SoftServe" block than the About Us counters.

> The About Us counters (`10K employees`, `17 countries`, `54 offices`) differ
> from figures circulating in search snippets (e.g. "10,000+ associates",
> "11,000+", "12,000+", "49 offices", "60 offices", "16 countries"). Those
> snippets are cached or from career.softserveinc.com and are **not** what the
> current corporate site prints. Only the table above reflects the live pages.

The first caution touches exactly one shipped tile — **1993**. It ships anyway,
on the judgement that a founding year does not drift the way a headcount does:
it is a historical fact repeated in the current press boilerplate (*"more than
30 years of experience"*), not a counter that will quietly be restated next
quarter. **If anyone wants every tile on an evergreen corporate page, that is
the tile to drop**, and `overview.about.stats` accepts 1–4 entries precisely so
a tile can be removed without breaking the grid.

**What was deliberately not used:**

- **A client count.** The site prints none. Its closest figure is *"20K+ /
  customer projects"* — projects, not clients — and using that as a client count
  would be a silent restatement.
- **"Fortune 500" as a corporate fact.** It appears on softserveinc.com only
  inside a case-study *title*, never as a company statistic. The practice-level
  *"30 Fortune 500 clients in SoftServe's data and analytics practice"* that
  does ship is the existing `content.js` credential and is labelled as the
  practice's, not the company's.
- **Partner tiers, on either partner.** The NVIDIA tier is on the public site
  verbatim (*"an award-winning NVIDIA Elite Partner"*), and it still does not
  ship: `HANDOFF` §6.2 rules out partner-tier claims, `C15` has never been
  cleared for Oracle, and a page that claims a tier for one partner and stays
  silent on the other invites the question. `partnerLine` was **"Built with
  Oracle and NVIDIA"** — the same sentence the footer has carried since round 1 —
  and 18.5 shortened it to **"Built with"**, because the two wordmarks beside it
  print the names and `site.footer.builtWith` and `.trademarkLine` print the
  whole sentence twice more. The tier claim is out either way.
- **The newsroom practice figures** — *"more than 1,000 experts in AI/ML …"* and
  *"400+ professionals with deep expertise in the NVIDIA stack"* (Jan 21, 2026).
  Both are newsroom-only, both are the kind of count that drifts, and the block
  already carries a cleared practice figure (500+) in the body.
- **Lviv.** The locations page labels it `Lviv HQ` within the Ukraine block while
  Austin carries `GLOBAL HQ`; the block names the global HQ only.

**No Oracle partnership page is linked.** `softserveinc.com/en-us/our-partners/oracle`
exists, but it is a **services page**, not a partnership page: H1 *"Oracle/NetSuite
Services"*, subhead about NetSuite and Oracle staff augmentation, no partner tier
stated, and Oracle is not among the site's "Our Strategic Partnerships" entries
(AWS, Google Cloud, Microsoft, NVIDIA, Anthropic) — it appears only in the A–Z
directory. Linking it from a page about Oracle AI agents would send a reader to
a staffing offer. The block links `/en-us/about-us` instead.

### 18.3 Copy written new in this round

Everything here exists in `content.js` and in no source — same bar as §3: short
declaratives, concrete nouns, and no number that is not already on the page.

| Where | What was written | Built on | Risk if wrong |
|---|---|---|---|
| `overview.catalog.patterns[0].definition` (deep research) | *"Agents that read across many sources and systems, then assemble a cited answer for a reviewer to decide on."* | The three deep-research products' `oneLiner`s — *cited* is in `account-insights`'s and `case-evidence-collection`'s (`plan-vs-actual-investigation` says *the source evidence behind them*, and cites on its own page), *for a reviewer to decide on* is `case-evidence-collection`'s. **Scoring is `account-insights`'s alone** — it is the only one of the three that scores anything — which is why 18.5 cut *scored* and the definition says **a cited answer** | Low — it generalizes three product statements and adds no capability |
| `overview.catalog.patterns[1].definition` (processing pipelines) | *"Every document or record goes through the same pipeline and comes out as validated, structured data. Each value carries a confidence score and a citation to its source page, and a reviewer checks it before export."* | `large-document-extraction`'s `oneLiner` and its `overview.steps` | Low, and deliberately the long one: this column holds one product, so the definition fills the space a second row would have taken rather than leaving filler (rule 2). 18.5 split it — it was one 38-word sentence |
| `overview.catalog.patterns[2].definition` (data analysis) | *"Plain-language answers over governed data, and plans computed against every constraint at once, approved by the people who own the decision."* | The two Lakehouse `oneLiner`s (plain-language, governed) and `workforce-optimization`'s (constraints, dispatcher approval) | Low — one sentence covering two visibly different products, which is what the column has to do |
| `products[].shortLine` ×7 | The seven rows of §18.1's last table | Each product's own `oneLiner`, compressed | Low — nothing is added; the risk is a compression that drops the qualifier that made the claim true, which is why the checker forbids the shortLine being a copy of the one-liner and the row renders the badges beside it |
| `overview.twoWays.panels[0].body`, `.panels[1].body` | The two three-line panel statements | §6.2's shapes, re-grounded on `productsPage.intro`, the seven `jumpstart.investment` blocks, `services.howWeEngage.lead` and `whatWeDo.whoYouWorkWith`; since 18.5 the three pattern names in `panels[0].body` are `facets.categories[].chip`, so the site names each pattern one way | Low — the one new *fact* is the four-priced / three-scoped split, which is arithmetic over `content.js` |
| `overview.delivery.steps[].body` ×3 | The ladder's three two-line bodies | `services.howWeEngage.ladder[].whatItIs`, near-verbatim — 18.5 restored *a limited rule set* to step 1 and re-opened step 3 with *Extend*, leaving *Roll-out* to mean the Integration tier it names on Services — with the signed-metrics sentence from `howAPovRuns.steps[0]` and the (optional) managed-service clause from `wrapAroundServices`, priced on top per `attachesToEvery` | Low — they are the Services ladder's own sentences at a shorter length |
| `overview.delivery.why.pillars[].body` ×3 | Platform depth · Agentic-AI experience · Packaged delivery | §6.3's three pillars, each re-pointed at a key: `facets.technology`; `whatWeDo.families` (without its count since 18.5) + `attachesToEvery`; `howWeEngage.ladder[0].pricing` + `howAPovRuns.steps[0]` and `.steps[3]` (18.5, replacing `services.proof.lead`) | Low — no pillar claims a capability that is not already on Services |
| `overview.about.body` | The one paragraph in the light band | Half from softserveinc.com (§18.2), half from `services.hero.stats`. 18.5 made its second sentence *"The Oracle AI & Data **team** draws on SoftServe's data and analytics **practice**"* — it had *practice … practice* eight words apart | **Medium — it is the only paragraph on the site quoting a public corporate page.** Re-read §18.2 before editing a figure in it; the two halves have different sources and different shelf lives |
| `overview.contact.sub` | *"One scoping conversation starts it. We come back with what a proof of value would cover, what it would cost, and what it would measure."* | `site.footer.description`'s second sentence + `services.contact.sub`'s promise, verbatim (18.5). It was written new in this round — *"Tell us the account or workflow you have in mind. One scoping conversation starts it: we come back with what a proof of value would cover, on your data."* — and is now half a quotation | Low |
| `overview.hero.stats[0]`, `[2]`, `overview.about.stats[].label` | Six stat captions (`stats[3]`'s is verbatim from `services.hero.stats[0]`, and since 18.5 `stats[1]`'s is verbatim from `services.hero.stats[3]`) | The keys each number is counted from; the About captions are the words the About Us page itself uses (*employees*, *countries*, *offices*) | Low — but the About captions are quotations, not paraphrases: *employees*, not *associates* |
| `overview.hero.stack.ariaLabel` | *"How the products are built: three workflow patterns and seven products on top, the SoftServe layer in the middle, the four Oracle platforms underneath"* | The figure itself — it is the accessible name of a `role="img"` whose internals are hidden | Low, and load-bearing for a screen reader: it is the **only** way the stack's content reaches assistive tech |

### 18.4 What changed in the renderers and in the checker

**Renderers.** `site/pages/overview.js` was rewritten end to end to the seven
screens, keeping its existing contract — the IIFE that assigns
`window.PAGES.overview`, the `mount` hook that calls `FORMS.mount(slot, "demo")`
after render, and `title()` returning `site.title`. Its new CSS is **one
appended block** at the end of `site/assets/site.css`, headed
`/* ——— home page (round 5): seven screens ——— */`; the stack visual takes the
`bo-` class prefix because `stack-*` already belongs to the Technology tab's
accordion. Four small changes sit outside that page: `assets/app.js` gained
`ICONS.arrowDown` and `ICONS.cube`, `linkArrow()` now accepts an `icon` option,
`renderNav()` builds the header button from `site.navCta`, and the not-found
page's button reads *Back to the home page*; `pages/services.js` reads
`site.secondaryCta` for its hero's quiet button instead of borrowing
`overview.hero.ctas[1]`; and `index.html` takes the new `<title>`, the new
description in all three meta tags, and the new lockup name. **No design token,
type scale, button, chip, badge, case card or contact split changed** — the home
page differs from the product pages by composition, not by tokens. CSS that the
rebuild orphaned was removed only where a grep proved it unreferenced
(`.logo-strip`, `.logo-strip-lg`, `.tile-grid`); `.light-band`, `.stat-band` and
`.platform-*` stay, because Services still renders all three. The implementer's
exact file list is in the git diff for this round.

**Checker.** `tools/check-grammar.js` lost two assertions and gained a block.
The two it lost were both about shapes this round retired: the `overview` hero
image (Services and all seven products keep theirs) and the
`overview.servicesTeaser.platforms` half of the canonical-platform pair, which
leaves `services.hero.platforms` as the one platform-card list whose four names
have to be asserted — the home page's four platform tiles are derived from
`facets.technology` itself and cannot drift from it. What it gained is a
**"round 5 · the home page"** block asserting the whole contract in one place:
`site.name` / `title` / `tagline` / `metaDescription`; the three nav items by
label *and* route; `navCta`, `secondaryCta` and `primaryCta` as `{ label, route }`;
every key of the seven screen objects, with `delivery.anchor` and
`contact.anchor` asserted **by value** because seven product pages link to the
second one; the five retired keys as outright failures rather than dead weight;
`shortLine` on all seven products (≤ 12 words, ends in a period, never a copy of
the `oneLiner`); an **icon check that reads the `ICONS` registry out of
`site/assets/app.js`**, so a pillar or panel naming a glyph nobody drew fails the
build; and the `HANDOFF` §6.1 word ban — *cutting-edge*, *seamless*, *unlock*,
*empower*, *revolutionary* — over the serialized `overview` object only, because
`sellerGate` unlocks a panel and that is the word used honestly. It prints
**OK with zero warnings** on the shipped data, and the new rules were checked the
other way round too: sixteen deliberate mutations of a sandbox copy of
`content.js` — a returned `hero.image`, a drifted nav label, a renamed anchor, a
missing bullet, an over-long stat value, a partner path under `logos/`, a
`shortLine` without its period, an unknown icon, a banned word — were all caught,
each with the message that names the fix.

### 18.5 The copy/leak critic round (2026-09-16)

The rebuilt home page was read twice after it shipped: once for **leaks** — a
fact on the page that is not cleared to be there — and once for **copy**. The
strings this round changed are the ones §18.1 and §18.3 now quote; the two
tables below record what moved and what deliberately did not.

**The leak sweep came back clean.** Over the serialized `overview` object, the
`products[].shortLine` and `statusNote` strings the home rows render, and
`site/index.html`: **no customer name, no logo path** (nothing under
`assets/img/logos/`), **no € figure or any other price**, **no customer
headcount, baseline or contract value**, **no GigaCloud, no AIDP, no internal
marker** (no `TODO` / `TBD` / placeholder), **no personal mailbox or other
contact address**, and **no partner-tier claim** — no *Elite*, *Premier*,
*Platinum* or partner-of-the-year, for either partner. The four case-study
descriptors on the page stay at industry-and-scale (*"A global home-appliance
manufacturer"*, *"An international airline"*, *"A global logistics and
supply-chain operator"*, *"A major construction and engineering contractor"*).
The meta tags carry the same sentence as `site.metaDescription` and nothing
else. **All copy on the page reads from `content.js`** — `pages/overview.js`
holds no user-facing string of its own, so a fix lands in the data layer and
the checker sees it.

**Accepted — what changed, and why.** Every *after* here is quoted from
`content.js` as it now stands.

| Key | Before | After | Why |
|---|---|---|---|
| `overview.hero.lead` | *"Oracle's AI platforms, **compounded by** SoftServe's enterprise agentic-AI experience: …"* | *"Oracle's AI platforms, **with** SoftServe's enterprise agentic-AI experience **on top**: …"* | *Compounded by* reads as **made worse by** in ordinary English. *With … on top* also echoes the layering the stack visual beside it draws |
| `overview.hero.stats[0].label` | *"products across three workflow patterns, each starting with a scoped Jumpstart on your own data"* | *"products across three workflow patterns"* | It ran to 95 characters against 39–55 for the other three tiles in the same row — about twice its peers — and the clause it lost repeats S2 |
| `overview.hero.stats[1].label` | *"Oracle platforms the practice builds on"* | *"Oracle platforms the practice focuses on"* | *Focuses on* is the verbatim Services stat (`services.hero.stats[3]`). *Builds on* had no source, and two of the four platforms carry no product |
| `overview.twoWays.title` | *"Products you can start now. A practice that makes them yours."* | *"Products you can start now, and a practice that makes them yours."* | Two sentences in uppercase Montserrat wrapped with an orphaned *A* and a mid-line period nobody sees at that size. One sentence |
| `overview.twoWays.panels[0].body` | *"… deep research, **document processing**, data analysis and optimization …"* | *"… deep research, **processing pipelines**, data analysis and optimization …"* | *Document processing* was a **fourth** name for the processing-pipelines pattern; `facets.categories` has a `chip` form and a `full` form and nothing else |
| `overview.twoWays.panels[1].bullets[0]` | *"A fixed price on the packaged scope; 30–45 days to about two months to a result"* | *"A fixed price on the packaged scope, scoped per engagement on the deep-research investigations"* | The durations now live in one place, the S4 ladder `fact`. The bullet names the **third clock** instead — *scoped per engagement on the deep-research investigations*, verbatim from `services.howWeEngage.ladder[0]` |
| `overview.twoWays.panels[1].bullets[1]` | *"Success metrics signed before the clock starts, every KPI measured like for like"* | *"Every KPI measured like for like against your current process"* | *Signed before the clock starts* was said **three times** on the page. It now lives in the S4 step-1 body and the S5 rail (`services.proof.lead`); the bullet carries the like-for-like measurement instead |
| `overview.catalog.lead` | *"Find the job first. Every product is a packaged instance of one workflow pattern, running in your own Oracle tenancy with a human in the decision."* | *"Each product packages one workflow pattern, runs in your own Oracle tenancy and keeps a human in the decision."* | *Find the job first* repeats S2's first bullet, and *packaged instance* is engineering jargon |
| `overview.catalog.patterns[0].definition` | *"… assemble a **cited, scored** answer for a reviewer to decide on."* | *"… assemble a **cited** answer for a reviewer to decide on."* | *Scored* is unsupported for `case-evidence-collection` and `plan-vs-actual-investigation` — `account-insights` is the only one of the three that scores anything |
| `overview.catalog.patterns[1].definition` | one 38-word sentence, hinged on a colon at *structured data:* | two sentences, split at *structured data.* | One 38-word sentence in a three-column row |
| `overview.delivery.steps[0].body` | *"Prove the gains on your own data and rules, …"* | *"Prove the gains on your own data and **a limited rule set**, …"* | Restores the qualifier from `howWeEngage.ladder[0].whatItIs`, so *your own rules* does not read as **all** of them |
| `overview.delivery.steps[2].body` | *"**Roll-out** across locations and document types … **A** managed service keeps the solution evolving."* | *"**Extend** across locations and document types … **An optional** managed service keeps it running and re-tuned."* | *Roll-out* is the Services ladder's name for the **Integration** tier, so it cannot also open step 3. And `services.whatWeDo.attachesToEvery` prices wrap-around services **on top of** the package, so the managed service is optional |
| `overview.delivery.why.pillars[1].body` | *"**Seven application families packaged so far**, evaluation frameworks …"* | *"**A library of agentic-AI patterns**, evaluation frameworks …"* | *Seven application families* collided with *Seven products* two screens earlier |
| `overview.delivery.why.pillars[2].body` | *"Fixed scope and signed success metrics, measured against a baseline the customer, Oracle and SoftServe sign before build starts."* | *"Fixed scope and signed success metrics, and every Jumpstart ends with an executive readout and a costed expansion plan."* | It restated the signatory list of `services.proof.lead` one screen below, and garden-pathed. It now carries the **executive readout and costed expansion plan** from `services.howWeEngage.howAPovRuns.steps[3]` |
| `overview.caseStudiesIntro.title` | *"Measured on customer data, under NDA."* | *"Four engagements on customer data, under NDA."* | *Measured* was true of **one** of the four cards — one measured, one modeled, two in preparation |
| `overview.about.body` | *"The Oracle AI & Data **practice** draws on SoftServe's data and analytics **practice** …"* | *"The Oracle AI & Data **team** draws on SoftServe's data and analytics **practice** …"* | *practice … practice* in eight words |
| `overview.about.partnerLine` | *"Built with Oracle and NVIDIA"* | *"Built with"* | The two wordmarks sit beside it and print the names — and *Built with Oracle and NVIDIA* already prints in the footer **twice** (`site.footer.builtWith`, `site.footer.trademarkLine`) |
| `overview.contact.sub` | *"Tell us the account or workflow you have in mind. One scoping conversation starts it: we come back with what a proof of value would cover, on your data."* | *"One scoping conversation starts it. We come back with what a proof of value would cover, what it would cost, and what it would measure."* | The S7 lead, the form-side sub and the footer said the same sentence **three times within one viewport**. The lead now carries the Services contact promise — **cover, cost, measure** (`services.contact.sub`) — and `pages/overview.js` passes **no form-side sub** at all (`forms.demo.secondarySub` is untouched; the product pages still render it) |
| `site.metaDescription` | *"**Best-of-breed** enterprise AI agents and workflows on Oracle platforms: …"* (164 characters) | *"Enterprise AI agents and workflows on Oracle platforms: …"* (150) | *Best-of-breed* was the site's **only superlative**, unsupported, and pushed the description past 160 characters. The three matching tags in `site/index.html` — `description`, `og:description`, `twitter:description` — moved with it |

**Rejected — findings that were raised and deliberately not acted on.**

| Finding | Why it stands |
|---|---|
| *"plans computed against every constraint at once"* (`catalog.patterns[2].definition`) overclaims | `workforce-optimization`'s own copy says exactly that: *"against every constraint at once, in minutes rather than days"* |
| `plan-vs-actual-investigation`'s `shortLine` — *"Every material variance, with its likely drivers and the evidence behind them."* — overclaims | It is the closing clause of that product's own `jumpstart.promise`, carried over word for word |
| *"fixed-scope proof of value"* in the hero lead is not true of all seven | The Jumpstart's **scope** is fixed once agreed, on all seven. *Fixed-scope* is not *fixed-price*, and the page says fixed price only of the packaged scope |
| Headlines are stored in caps in `content.js` | Every product headline is stored that way, and the CSS uppercases regardless. Changing it here alone would split the convention |
| The footer's `CONTACT US` block repeats the home page's S7 | Site-wide chrome from an earlier round — out of scope for a home-page copy pass |
| The two in-preparation case cards share a sentence frame, and the status word prints in both the chip and the metric eyebrow | Round-4 component and round-4 data (`shared.caseStudyStatus`, `CaseStudyCard.metricEyebrow`) — out of scope |
| Shipped JS comments cite `VISUAL-GRAMMAR` sections in `assets/app.js` and `pages/product.js`, and the not-found copy is hard-coded there | Pre-existing, on both counts. Flagged for a later round |
| The *Case studies* nav item can never be marked active | `setActiveNav` collapses the home path to `#/`, and the item's route is `#/#case-studies`, so the comparison never matches. Cosmetic; flagged |

Design-critic findings and the layout fix pass: see 18.6.

### 18.6 The design-critic round, the fix pass and the publish (2026-09-16)

**Owner's own review (Fable, one pass at 1440×900, 1440×2400 and 375):** the seven screens rendered as specified; two layout faults were called before the critic ran — the hero stack was 694px tall (S1 plus the proof strip ran 116vh) and the three stacked pillar cards in S4 (655px) towered over the ladder (377px) — plus the lockup name wrapping to two lines at 375.

**Design critic (Opus, read-only, live measurements at 375 / 768 / 1024 / 1060 / 1280 / 1440).** Accepted and fixed in one pass:

| Finding | Fix | Measured result |
|---|---|---|
| Catalog rows nested a `<button>` (Demo badge) inside the row `<a>`, and a configured `marketplaceUrl` would nest an `<a>` and split the row | Row is a `div`; the product name carries the link with a stretched `::after`; badges are siblings above it; hover/focus on the row | `a a, a button` count 3 → 0; one navigation per Demo click |
| Platform tile names painted past the tile between 1025 and 1100px (hero broke at 1024, the rest of the page at 1100) | Hero column break moved to 1100; `overflow-wrap: anywhere`; stack left-aligned under the copy at ≤1100 | 0px overflow at 1025 / 1060 / 1100 / 1150 |
| The three ladder fact rules sat at two heights (a two-line fact bottom-aligned by `margin-top:auto`) | Subgrid rows for index / title / body / fact | rule y 3253 / 3273 / 3273 → 3148 ×3 |
| The three catalog columns' first hairline staggered by 45px (2 / 4 / 3-line definitions) | Subgrid: header row, rows list row | `.catalog-rows` top 2361 / 2406 / 2383 → 2243 ×3 (also level at 1280 and 1060) |
| Arrow drifted below the name when name + badges wrapped | `align-self: start` | — |
| Contact split rendered an `h2` card heading beside an `h3` form heading | Card heading is an `h3` (shared helper; Services and the Contacts tab inherit it) | S7 heading order H2 → H3 → H3 |
| `.band-label` on the light band was 4.26:1 | `var(--text-on-light-soft)` in the light-band rule itself (site-wide contrast fix) | 6.29:1 |
| S6 read as a sub-block: 27px title, tight padding, 499px | Normal section padding; `#about .band-title` 36px at 1440 | 499 → 612px |
| Two teal roles in S4 (second accent eyebrow) and a teal 81% in the S5 rail beside four teal card figures | Column label is a dim eyebrow; the rail's stat value is white | — |
| Three H3 treatments, two side by side in S4 | Home pillars use the ladder's body-font 700 title | — |
| Pillars lifted on hover though nothing in them is clickable; case cards had no response | No hover on pillars; the case card's own link turns accent on hover / focus-within | — |
| Mobile: four hero stats stacked single-file (607px); `.link-arrow` 23.4px tall; Demo badge 18px | Home-scoped 2-up stat strip (`stat-row--home`, and the 480px stat rule narrowed to `:not(.stat-row--home)` so Services is byte-identical); `.link-arrow` padding at ≤560px (site-wide tap target); badge min-height 24px | strip 607 → 389px; link-arrow 43px; badge 24px |
| Tablet: case cards single-file from 900px | Home-scoped two-up between 721 and 900px | — |
| S5 rail hand-rolled the section head; the head link's height depended on the lead's wrap; mobile connectors pointed at nothing; case cards had no heading | Rail uses the shared head; H2 and link share one row; one centre connector ≤560px; `caseCard` descriptor is an `h3` (computed style unchanged) | — |

Owner's three items landed in the same pass: the stack is 545px at 1440, 1280 and 1060 (bands 168px ×3, icon and name on one row, tighter chips and padding); the pillars are horizontal cards on the home page (right column 655 → 443px against a 400px ladder; the column layout returns inside each card between 721 and 1100px, where a row would leave a 137px copy column); the lockup name is `.9375rem` at ≤480px, the largest size that fits on one line at 375 (the brief's 1.0625rem and 1rem both still wrapped).

Rejected or deferred: the critic's "cheaper alternative" of dropping badges from the home rows (the badges are the honest state signal); the S5 height (1126px at 1440 — content-driven by four equal case cards, accepted); platform tile names wrapping to four lines at 1280 only (no overflow); the `bo-owner` rows differing between bands (per the brief).

**Motion, after the pass (owner):** the stack's bands and connectors no longer run CSS animations parked at `opacity: 0` / undrawn until they play. The `.bo` container is a `.reveal` element: with no script the resting state is visible; with script, the observer (or `initReveal`'s 1.4s fallback) adds `is-in` and the bands fade in at 0 / .35 / .7s and the connectors draw over 1.2s as CSS transitions; under `prefers-reduced-motion` both take their resting state at once. This was prompted by the preview pane, which renders with `document.hidden === true` and never advanced the animations.

**Screen heights as shipped (1440×900):** hero 681 + proof strip 218 · two ways in 812 · products 884 · how we deliver 778 · case studies 1126 · about 612 · contact 916.

**Publish.** The artifact was republished at the same URL with the wrapper page and five files — `assets/site.css`, `assets/app.js`, `pages/overview.js`, `pages/services.js`, `data/content.js`. The first attempt was refused because the Workforce-demo session had published the whole tree (91 files: the `demo/workforce-optimization/**` walkthrough, the workforce step frames and poster, `config.js`, and this round's mid-state shell) at 13:40 local; after a re-read the same five files were published on top, which loses nothing because the shared working tree already carried both sessions' edits. `config.js`, `pages/product.js`, `pages/products.js`, the demo folders and the images were deliberately not passed: they are the other session's, and the live copies are the ones it published. The published `index.html` keeps `<header class="masthead">` — version 16 had lost it to a `<head`-prefix strip (§4 of the handoff records the rule).

**Verification before the publish:** `node --check` clean on every changed file; `node tools/check-grammar.js` OK with the home-page contract; the deny-list grep empty; console clean on `#/`, `#/products`, `#/products/large-document-extraction`, `#/products/workforce-optimization` (+ `/contacts`), `#/services`; no horizontal overflow at 375 through 1440; nested interactive elements 0; page titles `AI Agents on Oracle — SoftServe`, `Services — …`, `<Product> — …`; the header button and the four home anchors resolve; the Services hero still offers *Browse the products* and the product heroes still open on *Request a demo*.

**Follow-ups left open (not this round):** the two ladder vocabularies (home and product Jumpstart tab say Integration → Scale, the Services ladder says Roll-out → Scaling); shipped JS comments in `app.js` / `product.js` that cite VISUAL-GRAMMAR section numbers; the not-found page's hard-coded copy; the footer's CONTACT US block repeating the contact ask on every page; the "Case studies" nav item never marked active; `.claude/launch.json`'s `oracle-site` entry not starting under the preview tool on this Mac (HANDOFF §4 has the working route).


### 18.7 The messaging pass — personas over scaffolding (2026-09-16)

Round 5 shipped on the strength of its own structure: seven screens, seven
products, three patterns, four engagements. The owner read it back and said the
structure **was** the problem.

**His review, verbatim:**

> You overemphasize the counts and the scaffolding, not the essence. Think as a
> product marketer with an Oracle rep or a customer as the target persona. Don't
> overemphasize the "workflow patterns" term, that's rather internal than
> customer facing. Overall you overemphasize the scaffolding and don't always
> look at this with the customer or Oracle rep lens. Do copywrite checking — you
> use "packaged" on the same screen too much.

**Two personas, five principles.** The home copy was rewritten against an
**Oracle account executive** opening the page live on a call, and an
**enterprise buyer on Oracle** reading it alone. The principles the rewrite
held to:

1. Lead with the **job and the outcome**, in the customer's words.
2. Structure words — counts, *products*, *packaged*, *scope* — appear **only
   where they carry information the reader needs**, never as scaffolding.
3. **Name concrete jobs early**, so a rep can map them to accounts in the first
   screen.
4. Headlines a rep could **say out loud** on a call.
5. Every claim still **traceable to a string in `content.js`** — the round-5 bar
   (§18.1, §18.3) is unchanged.

The pass ran in two stages: the rewrite itself, then an **Opus persona critic**
that read the result as both personas. Its accepted findings were applied in the
same sitting; the overruled ones are listed at the end.

**Scope of the change.** `site/data/content.js` and the three description meta
tags in `site/index.html`, and nothing else. **No renderer, no CSS, no checker
rule, and no new key** — every row below is a string swapped in place, which is
why `tools/check-grammar.js` still prints OK.

**Before → after.** *Before* is the round-5 text as §18.5/§18.6 recorded it
shipped; *after* is read from `content.js` as it now stands.

**Site-wide**

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `site.metaDescription`, and `index.html`'s `description` / `og:description` / `twitter:description` | *"Enterprise AI agents and workflows on Oracle platforms: packaged products you can start now, and a dedicated Oracle AI & Data practice from SoftServe."* (150 chars) | *"AI agents that read your contracts, plan your field workforce and answer questions across your ERP. Built on Oracle by SoftServe, measured on your data first."* (158) | The old sentence described the **offer**; the new one names three of the jobs, which is what a search result has to earn a click with. The critic's first cut ended *"proven on your data in weeks"* — withdrawn, see the hero lead below. Still under 160; the three tags moved with it |

**S1 · `overview.hero`**

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `eyebrow` | *"SoftServe × Oracle · AI agents and workflows"* | *"SoftServe × Oracle · Built and delivered together"* | The old tail restated the H1 one line below it. The new one says what the two logos beside it mean — grounded in `services.whySoftServe.items[1]` (*"We deliver alongside Oracle's AI & Data organization, in joint teams"*) and in `services.whatWeDo.solutionStack`, whose accelerator row is `providedBy: "Oracle + SoftServe"` |
| `lead` | *"Oracle's AI platforms, with SoftServe's enterprise agentic-AI experience on top: packaged agents and workflows for the jobs enterprises repeat most, and a dedicated practice that takes them from a fixed-scope proof of value to production."* | *"Agents that read your contracts, plan your field workforce, answer questions across your ERP and tell your sellers what a market signal means for each account. Built on Oracle's AI platforms, run in your own tenancy, measured on your own data first."* | The old lead described the **offer**; the new one names **four concrete jobs**, one per product a rep can map to an account — `large-document-extraction`, `workforce-optimization`, `cross-system-erp-qa`, `account-insights`, each compressed from that product's own `shortLine`. The first cut closed *"proven on your data in weeks"*; **withdrawn** — `plan-vs-actual-investigation`'s Jumpstart is *"12 weeks, plus a two-week acceptance phase"*, so *in weeks* is false at the top of the range exactly as *weeks, not quarters* was (18.0 b). The close is now *measured on your own data first*, and the duration claim sits in the strip as **From 30 days** |
| `stack.ariaLabel` | *"How the products are built: three workflow patterns and seven products on top, the SoftServe layer in the middle, the four Oracle platforms underneath"* | *"How the products are built: the jobs the agents do on top, the SoftServe layer in the middle, the four Oracle platforms underneath"* | The accessible name is the **only** way the stack reaches a screen reader (§18.3), so it has to describe what the top band shows, not the taxonomy behind it. The counts went with the term |
| `stack.patternsLabel` | *"Workflow patterns"* | *"What they do"* | The band label a customer reads. *Workflow pattern* is internal vocabulary — the owner's words |
| `stack.softserve.items` | *Agentic-AI patterns · Evaluation frameworks · Packaged delivery* | *Agent engineering · Evaluation & guardrails · Pilot to production* | Three nouns a rep can say. *Agentic-AI patterns* was the third *pattern* on one screen and *Packaged delivery* the fifth *packaged*; **Pilot to production** is the middle layer's actual job and the one an AE is asked about on the call |
| `stats[0]` | **7** / *"products across three workflow patterns"* | **From 30 days** / *"to a measured result on your own data"* | The count tile was the scaffolding stated as a headline number. The strip now opens on the clock, and *proof of value* in the old `From 30 days` label became *result* — the reader does not yet know what a proof of value is |
| `stats[1]` | **4** / *"Oracle platforms the practice focuses on"* | **Fixed price** / *"on the priced Jumpstarts, agreed before work starts"* | The commercial fact is the second thing a buyer looks for. The label is narrow on purpose: four of the seven `jumpstart.investment.price` values are money (€75K · €90K · €30–50K ×2), two are `null` and one reads *Scoped per engagement*. The first cut said *"for a Jumpstart where the package is published"* — an unsayable sentence on a call, and the critic was right about it |
| `stats[2]` | **From 30 days** / *"to a measured proof of value on your own data"* | **4** / *"Oracle platforms the practice focuses on"* | Kept, moved to third. The first cut had replaced it with **Your tenancy** / *"everything runs inside your own Oracle environment"* — a **third** statement of a claim the hero lead and the S2 products panel already make. Platform breadth is what an Oracle rep actually sells on, so the tile came back verbatim from `services.hero.stats[3]` |
| `stats[3]` | **500+** / *"data experts in SoftServe's data and analytics practice"* | unchanged | The only cleared credential in the row |

The strip therefore reads **From 30 days · Fixed price · 4 Oracle platforms ·
500+** — clock, commercial, breadth, credential.

**S2 · `overview.twoWays`**

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `title` | *"Products you can start now, and a practice that makes them yours."* | *"The products get you started, and the team behind them takes you to production."* | *A practice that makes them yours* is agency language. The new line is the sentence a rep says when he explains why the page has two panels — and *team* is what the buyer is buying |
| `panels[0].title` | *"Packaged AI agents and workflows"* | *"Products you can start with"* | Two structure words in four; the panel's job is to say **you can start**. The first cut read *Solutions you can start now* — see the solution/product note below |
| `panels[0].body` | *"Seven packaged products for the workflows enterprises repeat most: deep research, processing pipelines, data analysis and optimization. Each runs on Oracle, in your tenancy, and starts with a scoped Jumpstart. Four are priced and ready to start today; three are scoped per engagement."* | *"Each one runs on Oracle inside your own tenancy and starts with a Jumpstart: a fixed-scope pilot on your own data. Four are priced and ready to start today; three are scoped per engagement."* | The count and the three category names both went: the count is the S3 rows, and the categories are the S3 column headings one screen below. What survives is the two facts a buyer needs — where it runs, and what a Jumpstart is — plus the four/three split, which is arithmetic over the seven `jumpstart.investment` blocks and the one place the site states its commercial shape |
| `panels[0].bullets[0]` | *"Grouped by workflow pattern, so you find the job first"* | *"Runs on OCI + NVIDIA or Oracle Autonomous AI Lakehouse"* | The dropped bullet described the **page's own filing system**. The platform bullet moved up from slot 2 |
| `panels[0].bullets[1]` | *"Built on OCI + NVIDIA or Oracle Autonomous AI Lakehouse"* | *"Built for review: extractions, plans and findings are approved by a person before they are used"* | The human-in-the-decision claim had fallen out of the page entirely. The first cut wrote it as *"A person approves before anything moves"* — **false for the two Lakehouse Q&A products**, whose `jumpstart.investment.includes` contain no approval step at all (`cross-system-erp-qa`, `business-metrics-qa` answer questions; nothing moves). Rewritten to name the three artefacts that **are** approved — extractions, plans, findings — which is true of every product that produces one |
| `panels[0].bullets[2]` | *"Jumpstart scope, timeline and investment on every product page"* | unchanged | Still the one claim that holds on all seven (18.0 c) |
| `panels[0].cta.label` | *"See the products"* | unchanged **net** | It passed through *"See the solutions"* in the first cut and came back with the solution → product revert |
| `panels[1].body` | *"One packaged delivery model — Jumpstart proof of value, integration, scale — run by the architects and engineers who build the accelerator packs themselves. One contract and one accountable team, from scoping through run."* | *"The architects and engineers who built these products adapt them to your systems, rules and data, and take them from pilot to production. One contract and one accountable team, from scoping through run."* | The three tier names are the S4 ladder two screens down, and *accelerator packs* is internal vocabulary. The people come first now; the second sentence is still `whatWeDo.whoYouWorkWith` verbatim |
| `panels[1].bullets[0]` | *"A fixed price on the packaged scope, scoped per engagement on the deep-research investigations"* | *"Delivered alongside Oracle's AI & Data organization, in joint teams"* | Price is now stated in the hero strip and in S4, and the panel had no line about the thing an Oracle AE most needs to point at. Near-verbatim from `services.whySoftServe.items[1]`. The first cut used *"Success metrics signed with you and Oracle before work starts"* — the fourth appearance of signed metrics on the page |
| `panels[1].bullets[1]` | *"Every KPI measured like for like against your current process"* | *"Results measured like for like against how you work today"* | Same claim (`services.proof.lead`), said the way a buyer says it: *KPI* and *current process* are both the seller's words |
| `panels[1].bullets[2]` | *"One team: AI, data and OCI architects with senior AI and data engineers"* | *"Configured to your rules, your definitions and your access model"* | The roster is a staffing answer, and *one team* is already the panel body's last sentence. The slot now carries the adaptation promise the panel title makes, from `services.howWeEngage.howAPovRuns.steps[2]` (*"the pack configured against your rules: business definitions, masking, row-level access"*) |

**S3 · `overview.catalog`**

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `title` | *"Seven products, three workflow patterns."* | *"Find the job you need done."* | The single densest line of scaffolding on the page: a count, a count, and the internal term. The new headline tells the reader what to do with the three columns below it |
| `lead` | *"Each product packages one workflow pattern, runs in your own Oracle tenancy and keeps a human in the decision."* | *"Each product page has how it works, what it needs from you, and the Jumpstart scope and investment."* | Tenancy and the human are now S2 bullets, so the lead stopped repeating them and became the one thing it can usefully say at the top of a list of links: **what is behind each link** |
| `patterns[0].definition` | *"Agents that read across many sources and systems, then assemble a cited answer for a reviewer to decide on."* | *"Agents that read across your systems and outside sources, then bring back a cited answer for a person to act on."* | *Many sources and systems* → **your systems and outside sources**, which is the actual split (internal exports plus news, filings, market signals). *Assemble … for a reviewer to decide on* → *bring back … for a person to act on* |
| `patterns[1].definition` | *"Every document or record goes through the same pipeline and comes out as validated, structured data. Each value carries a confidence score and a citation to its source page, and a reviewer checks it before export."* | *"Long documents and records turned into checked, structured data. Every value is traced to its source page and confirmed by a reviewer before it leaves."* | *Goes through the same pipeline* described the mechanism, not the result; *confidence score* is a product-page fact. 45 words → 24, which also lets the column heading sit level with its peers |
| `patterns[2].definition` | *"Plain-language answers over governed data, and plans computed against every constraint at once, approved by the people who own the decision."* | *"Plain-language answers over your governed data, and plans computed against every constraint at once, approved by the people who own the decision."* | One word: **your** governed data. It is the customer's lakehouse, and the sentence now says so |
| `cta.label` | *"Browse all products with filters"* | *"See all products, with filters"* | *Browse* is what a visitor does on a catalogue; *see* matches the two CTAs above it |

**The category rename — site-wide, not only the home page.** `facets.categories`
is read by the Products rail, every product's `categoryChip`, the first entry of
every product's `tags`, and the S3 column headings, so this row changes four
surfaces at once. The rule the new set holds: **each `full` contains its own
`chip`**, so the rail filter and the column heading are visibly the same thing.

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `facets.categoryLabel` | *"Workflow pattern"* | *"What it does"* | The rail's own group label, read by every visitor who filters |
| `shared.tagFamilies.pattern.tooltip` | *"Workflow pattern"* | *"What it does"* | The tooltip on every outlined chip, site-wide |
| `categories[0]` | chip *Deep research* · full *"Deep research & investigation"* | chip *Deep research* · full *"Deep research & investigation"* | Unchanged — it already satisfied the contains-its-chip rule. (The first cut shortened the full to *Research & investigation* and it was reverted) |
| `categories[1]` | chip *"Processing pipelines"* · full *"Per-item processing pipelines"* | chip *"Document processing"* · full *"Document processing & review"* | *Per-item processing pipelines* is an engineering description of a mechanism. The column holds one product, about documents, with a review step — so the customer-facing name is what it processes and what it does |
| `categories[2]` | chip *Data analysis & optimization* · full *"Data analysis & decision agents"* | chip *Data analysis & optimization* · full *"Data analysis, answers & optimization"* | *Decision agents* is a category no buyer searches for, and the full label did not contain its chip. The new full names the three things the column actually holds — analysis, plain-language answers, optimization |
| `large-document-extraction.categoryChip`, `.tags[0]` | *"Processing pipelines"* | *"Document processing"* | Denormalised copies of the chip; they follow or the tile and the rail disagree |

**S4 · `overview.delivery`**

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `title` | *"From proof of value to production, in one packaged model."* | *"Prove it on your data first, then take it to production."* | *One packaged model* is how the practice describes itself internally. The imperative is a sentence a rep can say out loud |
| `steps[0].body` | *"Prove the gains on your own data and a limited rule set, in a separate environment, with zero integration. Success metrics are signed before the clock starts."* | *"A fixed-scope pilot on your own data and a limited rule set, in a separate environment, with zero integration. Success metrics are signed before the clock starts."* | **Pilot** is the plain-English gloss of *Jumpstart*, placed where the tier is defined so the rest of the page can use the product name |
| `steps[0].factLabel` / `.fact` | *Duration and price* · *"30–45 days to about two months · a fixed price on the packaged scope"* | *Duration* · *"30–45 days to about two months · scoped per engagement on the research and investigation products"* | The price half moved to the hero strip (`Fixed price`), so the label is just *Duration* and the fact carries **all three clocks**: the two packaged ones, and the third one restored from `services.howWeEngage.ladder[0].duration` (*"scoped per engagement on the deep-research investigations"*), with *deep-research* spelled out as *the research and investigation products*. An intermediate draft said *"fixed price where the package is published"* — the same unsayable phrase as the stat tile, cut with it |
| `steps[1].body` | *"Full setup, data integration and go-live at one location or for one document type: embedded in the workflow, no manual work."* | *"We connect it to your systems, embed it in the workflow and take it live at one location or for one document type, with no manual work left in the loop."* | A noun stack became a sentence with a subject. Same three facts, in the order the work happens |
| `steps[2].body` | *"Extend across locations and document types, with per-region rule sets and data workflows. An optional managed service keeps it running and re-tuned."* | *"Extend across locations and document types, with per-region rules and data workflows. An optional managed service keeps it running and re-tuned."* | *Rule sets* → *rules* |
| `why.pillars[0].body` | *"OCI + NVIDIA, Oracle AI Data Platform, Oracle Autonomous AI Lakehouse and Oracle AI for Fusion Applications, with architects who own the Oracle reference architecture and the scoping."* | *"Architects who own the Oracle reference architecture across OCI + NVIDIA, Oracle AI Data Platform, Oracle Autonomous AI Lakehouse and Oracle AI for Fusion Applications."* | Same facts, inverted: the pillar is called **Platform depth**, so it opens on the people who have it rather than on a four-item list the reader must hold before reaching the claim |
| `why.pillars[1].body` | *"A library of agentic-AI patterns, evaluation frameworks that attach to every engagement, and a human kept in every decision."* | *"Agents built and tested on real enterprise data, with evaluation, guardrails and governance hardening available on every engagement."* | *A library of patterns* is the internal term again, and *attach to* is contract language. **Available on** every engagement, not included in it: `services.whatWeDo.attachesToEvery` prices evaluation, guardrails and governance hardening *"on top of whichever package you choose"*. The human-in-the-decision claim moved to the S2 bullet where a buyer meets it earlier |
| `why.pillars[2].title` | *"Packaged delivery"* | *"Fixed-scope delivery"* | The fifth *packaged* on the screen, and *fixed-scope* is the thing the pillar actually promises |
| `why.pillars[2].body` | *"Fixed scope and signed success metrics, and every Jumpstart ends with an executive readout and a costed expansion plan."* | *"Signed success metrics up front, and every Jumpstart ends with an executive readout and a costed expansion plan."* | *Fixed scope* now sits in the title one line above it |

**S5 · `overview.caseStudiesIntro`**

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `title` | *"Four engagements on customer data, under NDA."* | *"What each engagement measures."* | The count was the scaffolding again, and it flattened four visibly different cards into one number. **Two of the four are in preparation**, so the honest heading is what each card carries, not how many there are. The first cut said *"The proof so far."* — which claims proof for the two that have not run |
| `body` | *"Four engagements behind these applications. One carries figures measured in a completed proof of value, one carries figures modeled against the customer's own historical baseline, and two are in preparation and carry the outcomes they are set up to measure. Every customer is under NDA, so each one is described by industry and scale."* | *"Where a proof of value has completed, the card carries what it measured; where one is being prepared, it carries the outcomes it is set up to measure. Every customer is under NDA, so each is described by industry and scale."* | The old body enumerated the four states before the reader had seen a card; the cards say their own state in the `metricEyebrow` and the status chip. 54 words → 38, and the count is gone |

**S6 · `overview.about`**

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `body` | *"SoftServe is a digital engineering company, founded in 1993 and headquartered in Austin, Texas, that designs and builds data, cloud and AI solutions for enterprises. The Oracle AI & Data team draws on SoftServe's data and analytics practice — 500+ data experts, 150+ active projects, 30 Fortune 500 clients — and on engineering teams upskilled on the Oracle AI stack."* | *"Headquartered in Austin, Texas, SoftServe designs and builds data, cloud and AI solutions for enterprises. The Oracle AI & Data team draws on SoftServe's data and analytics practice — 150+ active projects and 30 Fortune 500 clients — and on engineering teams upskilled on the Oracle AI stack."* | Three repetitions removed, all of them **printed within the same band**: *a digital engineering company* is the first four words of `about.title` directly above it; **1993** is the first stat tile beside it; **500+** is the last tile of the hero strip at the top of the same page. Nothing was added, and the two sources stay separated as §18.2 requires — corporate facts from softserveinc.com, practice credentials from `services.hero.stats` |

**Products page**

| Key | Before (round 5) | After | Why |
|---|---|---|---|
| `productsPage.intro` | *"Seven packaged AI applications on the Oracle stack. Filter by the Oracle platform each one is built on, or search by the workflow you are trying to fix. Each one is sold as a scoped proof of value on your own data, in your own tenancy — fixed-price where the package is published."* | *"Every product runs in your own Oracle tenancy and starts with a Jumpstart on your data. Four are priced today; three are scoped per engagement. Filter by the Oracle platform it runs on, or search for the job you need done."* | The same treatment as the home page, because a rep who scrolls past S3 lands here: the count and *packaged* go, *sold as a scoped proof of value* becomes *starts with a Jumpstart*, and *fixed-price where the package is published* becomes the four-priced / three-scoped sentence. *The workflow you are trying to fix* → *the job you need done*, matching the S3 headline |
| `products[case-evidence-collection].statusNote`, `products[plan-vs-actual-investigation].statusNote` | *"Packaged offering in preparation — scoping conversations are open."* | *"In preparation — scoping conversations are open."* | The two notes carried the last two instances of *packaged*, and the reader does not need the distinction: what is in preparation is the thing the page is selling |
| `products[business-metrics-qa].shortLine` | *"KPIs answered from one governed gold layer, with no data moved."* | *"Business KPIs answered from one governed layer, with no data moved."* | **Gold layer** is a data-architecture term (it stays on the product page, where the Technology tab explains it); the home row says *business KPIs*, which is what the reader is looking for. Still 11 words, still ends in a period, still not the `oneLiner` |

**Not changed, on purpose:** `overview.hero.headline`, `hero.ctas`,
`panels[1].title`, `catalog.patterns[].id`, `delivery.steps[].title` and every
`fact`, `delivery.footnote`, `why.title`, `caseStudiesIntro.ndaLine` and `cta`,
the four case-study cards, `about.title` / `stats` / `partnerLine` / `link`,
`overview.contact` (both keys), and the six other `shortLine`s.

**One word tried and reverted: *solution*.** The first cut replaced *product*
with *solution* throughout (*"Solutions you can start now"*, *"See the
solutions"*, *"How the solutions are built"*) on the argument that an Oracle AE
says *solution*. It was reverted in full: the site's navigation noun is
**Products**, the route is `#/products`, the page is `productsPage`, and a page
that calls the same seven things by two names makes the reader check whether
they are the same seven things. One word names them.

**Critic findings overruled.**

| Finding | Why it stands |
|---|---|
| Alternative headlines proposed for S2, S3 and S4 | The shipped headlines are the owner's own from this pass. A critic may show a line is wrong; it does not get to substitute its taste for his |
| *"pilot"* is a weaker word than *Jumpstart* and should go | Kept, and only where the tier is **defined** — `delivery.steps[0].body` and `panels[0].body`. *Jumpstart* is a name the reader has not learned yet at first contact; the gloss is what makes the name land. It is not used as a synonym anywhere else |
| The eyebrow *"Built and delivered together"* claims a joint go-to-market that is not evidenced | It is evidenced twice: `services.whySoftServe.items[1]` (*"We deliver alongside Oracle's AI & Data organization, in joint teams — not as a vendor bolted on afterwards"*) and `services.whatWeDo.solutionStack`, whose accelerator-pack row reads `providedBy: "Oracle + SoftServe"`. It is a delivery claim, not a partner-tier claim, and the tier ban (§18.2) is untouched |

**Repetition, measured.** The pass ran a word-frequency script over the
home-page copy it was rewriting, and reported:

| Word or phrase | Before | After | Note |
|---|---|---|---|
| *packaged* | 10 | **0** | On the home page. The two `statusNote`s dropped *Packaged offering* as well, so it is gone from the product pages' status line too |
| *workflow pattern(s)* | 5 | **0** | Plus `facets.categoryLabel` and the chip tooltip, which are not home-page strings |
| seven / three / four **as scaffolding** | 9 | **1** | The survivor is *four-week* in `workforce-optimization`'s `shortLine`. The four-priced / three-scoped split and *4 Oracle platforms* are information, not scaffolding, and were not counted |
| *product* | 12 | **10** | Deliberately still there: it is the site's navigation noun (see the *solution* revert) |
| *proof of value* | 7 | **1** | It survives where the tier is named — `delivery.steps[0].title` |
| *scope / scoped* | 11 | **5** | |

**The exact corpus that script used was not kept**, so the figures above are the
pass's own and are not reproducible line for line. A **re-count over a stated
corpus** — every string value in `overview` except the structural fields (`id`,
`icon`, `anchor`, `route`, `kind`, `direction`, `url`, `slug`, `file`,
`industry`, `status`), plus `site.metaDescription`, the seven `shortLine`s and
the two `statusNote`s — gives:

| Word or phrase | Before | After |
|---|---|---|
| *packaged* | 12 | **0** |
| *workflow pattern(s)* | 6 | **0** |
| seven / three / four | 14 | **6** |
| *product* | 13 | **11** |
| *proof(s) of value* | 11 | **7** |
| *scope / scoped* | 8 | **7** |

The two tables disagree because the corpora do: this one **includes the four
`caseStudies` cards**, which the pass did not rewrite and which carry
*proof of value* four more times in their mandatory footnotes, plus *three
countries* and *four-week* inside descriptive copy. The direction is the same on
every row, and the two rows that matter — *packaged* and *workflow pattern* —
are **zero on both counts**. Re-run it against this definition, not against the
first table, if a later round wants to check the drift.

**What this supersedes.** §18.0 (a), §18.1 and §18.3 quote the round-5 strings
and are left as the record of that round; where they disagree with `content.js`,
this section is the current text. Three of their statements are now
specifically out of date: *packaged* is no longer the hero lead's word (18.0 a),
`stack.patternsLabel` no longer borrows the `tagFamilies.pattern` tooltip
(18.1, S1) — the two moved together to *What it does* / *What they do* — and the
About body no longer prints *founded in 1993* or *500+ data experts* (18.2's
"ships as" column, and §18.3's `about.body` row). §18.2's **source table is
unaffected**: the 1993 and 500+ figures still ship, as the stat tile and the
hero strip respectively.

### 18.8 The owner's review — links, positioning, metrics and verbosity (2026-09-16)

The messaging pass (§18.7) shipped and the owner read the live page again. Nine
items came back. They are not one theme: two are interface faults (a link
dressed as a button, a broken strip), one is a sourcing objection (the About
block), one removes a CTA, one renames a block, and four are about **wording** —
three of them verbosity, one of them vocabulary.

**Who did what.** The main session (Fable) made every copy decision. An **Opus**
subagent researched SoftServe's public positioning and returned the verbatim
sentences and URLs in (d). A second **Opus** subagent implemented the layout and
link changes in (e). A **Fable** subagent read the result as a final copy edit;
its accepted findings were applied and one proposal was overruled — (f).

**Scope.** `site/data/content.js`, `site/pages/overview.js`,
`site/assets/app.js`, `site/assets/site.css` and two assertions in
`tools/check-grammar.js`. No new key, no new component, no design token.

#### (a) The nine items, verbatim

1. > "I don't like the fact that buttons with email and website look like bold buttons - that doesn't sound like best practice?"

   The contact card's email and the About band's website link are now underlined
   anchors, not filled buttons — site-wide, on all four surfaces they render (e).

2. > "for SoftServe positioning, pick something from how they frame it on their website, in other materials, since current about softserve looks like shifted / voluntary made up positioning info"

   The About block was rebuilt out of three sentences softserveinc.com prints
   about itself, and its four tiles are now the About Us page's own counters (d).

3. > "'Contacts' block anywhere: 'Talk to the Oracle AI & Data team' should be rather (Talk to our team)"

   `overview.contact.heading` → **"Talk to our team"**. It is the only surface
   that carried the long form; Services and the product Contacts tab head their
   contact sections from their own keys.

4. > "The Services block on the main page should not have 'Talk to us' CTA"

   `overview.delivery.ctas` went from two to one: the quiet *Talk to us* was
   dropped, the primary *Explore the services* stands. The checker was relaxed
   from `=== 2` to 1–2.

5. > "Review layout of metrics (screen attached; broken layout) on the home page and their list"

   — with the list he wanted: **1000+ AI & Data experts · 30 Fortune 500
   customers · 4-8 weeks PoCs**. The strip is now three tiles carrying those
   three figures, and the layout fault behind the screenshot was a cell with no
   bottom padding (c, e).

6. > "'What each engagement measures.' - not that good of a name for a block. Not really crafted by product marketer"

   `overview.caseStudiesIntro.title` → **"What we've proven, and what we're
   proving now."** The copy editor then found the same rejected name still
   heading the Services engagements panel, and it went too (f).

7. > "Case studies block on the home page is too verbose, reduce wording"

   The rail lost the method paragraph, the 81% stat and its footnote (they ship
   on Services, where the method belongs); the intro body went 38 words → 14,
   and the NDA line, the link label, the four card footnotes and the two
   in-preparation card lines were all cut back (b).

8. > "'Find the job you need done.' - that block should speak AI and agents language"

   The S3 headline became **"Agents that read, extract, plan and answer."**, the
   lead and three `shortLine`s were re-pointed at what the agent does, and the
   S2 panels were re-titled around agents and the people who build them.

9. > "Two ways in block - is too verbose again"

   Title, both panel titles, both bodies and five of the six bullets were cut.
   The screen lost 47 words and no fact.

#### (b) Before → after, every changed string

*Before* is the text as §18.7 recorded it shipping; *after* is read from
`content.js` as it now stands.

**S1 · `overview.hero`**

| Key | Before | After | Item |
|---|---|---|---|
| `lead` (last sentence only) | *"Built on Oracle's AI platforms, run in **your own** tenancy, measured on **your own** data first."* | *"Built on Oracle's AI platforms, run in your tenancy, measured on your data first."* | copy edit (f) |
| `stats` | **four** tiles — `From 30 days` / *to a measured result on your own data* · `Fixed price` / *on the priced Jumpstarts, agreed before work starts* · `4` / *Oracle platforms the practice focuses on* · `500+` / *data experts in SoftServe's data and analytics practice* | **three** tiles — `1,000+` / *experts in AI, data and R&D across SoftServe* · `30` / *Fortune 500 clients in the data and analytics practice* · `4–8 weeks` / *to a fixed-price proof of value on your own data* | 5 |

**S2 · `overview.twoWays`**

| Key | Before | After | Item |
|---|---|---|---|
| `title` | *"The products get you started, and the team behind them takes you to production."* | *"Start with an agent, keep the team that built it."* | 9, 8 |
| `panels[0].title` | *"Products you can start with"* | *"Agents ready to run"* | 8 |
| `panels[0].body` | *"Each one runs on Oracle inside your own tenancy and starts with a Jumpstart: a fixed-scope pilot on your own data. Four are priced and ready to start today; three are scoped per engagement."* | *"Each one runs on Oracle in your own tenancy and starts with a Jumpstart on your data. Four are priced today; three are scoped per engagement."* | 9 |
| `panels[0].bullets[0]` | *"Runs on OCI + NVIDIA or Oracle Autonomous AI Lakehouse"* | unchanged | — |
| `panels[0].bullets[1]` | *"Built for review: extractions, plans and findings are approved by a person before they are used"* | *"Extractions, plans and findings are approved by a person"* | 9 |
| `panels[0].bullets[2]` | *"Jumpstart scope, timeline and investment on every product page"* | *"Scope, timeline and price on every product page"* | 9 |
| `panels[1].title` | *"A dedicated Oracle AI & Data practice"* | *"The people who build them"* | 8, 9 |
| `panels[1].body` | *"The architects and engineers who built these **products** adapt them to your systems, rules and data, and take them **from pilot to** production. One contract **and** one accountable team, **from scoping through run**."* | *"The architects and engineers who built these agents adapt them to your systems, rules and data, and take them to production. One contract, one accountable team."* | 9, 8 |
| `panels[1].bullets[0]` | *"Delivered **alongside** Oracle's AI & Data organization, in joint teams"* | *"Delivered with Oracle's AI & Data organization, in joint teams"* | 9 |
| `panels[1].bullets[1]` | *"**Results** measured like for like against how you work today"* | *"Measured like for like against how you work today"* | 9 |
| `panels[1].bullets[2]` | *"Configured to your rules, **your** definitions and **your** access model"* | *"Configured to your rules, definitions and access model"* | 9 |

**S3 · `overview.catalog`, and the three `shortLine`s it renders**

| Key | Before | After | Item |
|---|---|---|---|
| `title` | *"Find the job you need done."* | *"Agents that read, extract, plan and answer."* | 8 |
| `lead` | *"Each product page has how it works, what it needs from you, and the Jumpstart scope and investment."* | *"Each agent runs in your own Oracle tenancy. Open one for how it works, what it needs from you, and the Jumpstart scope."* | 8 |
| `patterns[1].definition` (first sentence) | *"Long documents and records **turned into** checked, structured data."* | *"Long documents and records become checked, structured data."* | 8 |
| `products[account-insights].shortLine` | *"Market signals turned into cited, scored opportunities for every account."* | *"What a market signal means for each account, scored and sourced."* | 8 |
| `products[case-evidence-collection].shortLine` | *"The evidence trail for a case, assembled from every system and cited."* | *"The evidence trail for a case, pulled from every system involved."* | 8 |
| `products[large-document-extraction].shortLine` | *"Long documents turned into validated, structured data, every value cited."* | *"Long documents read, extracted and checked against your business rules."* | 8 |

The three rewritten `shortLine`s still hold the round-5 rule: ≤ 12 words, ending
in a period, never a copy of the `oneLiner`. The other four are untouched. Note
what the first one gave up and what it bought: *scored* survives, *cited* became
**sourced** — the same claim in a word a buyer uses — and the sentence now opens
on the reader's question (*what a market signal means*) rather than on the
mechanism. `large-document-extraction` traded *validated … every value cited*
for **checked against your business rules**, which is the same guarantee named
by what it is checked against; the citation claim is one line above it in the
pattern definition and on the product page.

**S4 · `overview.delivery`**

| Key | Before | After | Item |
|---|---|---|---|
| `ctas` | **two** — *Explore the services* → `#/services` (`primary`), *Talk to us* → `#/services#contact` (`quiet`) | **one** — *Explore the services* → `#/services` (`primary`) | 4 |

Nothing else on S4 moved: the three step bodies, all three `fact`s, the
footnote and the three pillars are §18.7's text.

**S5 · `overview.caseStudiesIntro` and the four cards**

| Key | Before | After | Item |
|---|---|---|---|
| `title` | *"What each engagement measures."* | *"What we've proven, and what we're proving now."* | 6 |
| `body` | *"Where a proof of value has completed, the card carries what it measured; where one is being prepared, it carries the outcomes it is set up to measure. Every customer is under NDA, so each is described by industry and scale."* (38 words) | *"Every customer is under NDA, so each engagement is described by industry and scale."* (14) | 7 |
| `ndaLine` | *"Reference calls are available on request for the completed proofs of value."* | *"Reference calls on request."* | 7 |
| `cta.label` | *"How we measure it, engagement by engagement"* | *"How we measure it"* | 7 |
| `caseStudies[workforce-proof].footnote` | *"Modeled simulations against a historical baseline, not measured production outcomes; figures are illustrative, not contractual."* | *"Modeled against a historical baseline, not live operations; illustrative, not contractual."* | 7 |
| `caseStudies[extraction-proof].footnote` | *"Measured in the proof of value on the customer's own documents; figures are illustrative, not contractual."* | *"Measured on the customer's own documents; illustrative, not contractual."* | 7 |
| `caseStudies[account-insights-engagement].footnote` | *"Target outcomes the proof of value is set up to measure, not results."* | *"What the proof of value will measure; no results yet."* | 7 |
| `caseStudies[plan-vs-actual-engagement].footnote` | *"Target outcomes the proof of value is set up to measure, not results."* | *"What the proof of value will measure; no results yet."* | 7 |
| `caseStudies[account-insights-engagement].line` | *"A first engagement is being prepared on the customer's own account base, scoring each generated opportunity for magnitude and confidence and citing the evidence behind it."* | *"The first engagement will run on the customer's own account base: every opportunity scored for magnitude and confidence, with its evidence cited."* | 7 |
| `caseStudies[plan-vs-actual-engagement].line` | *"A first engagement is being prepared on one completed project sample, reconstructing the customer's own schedule, cost and contract exports into one package-level view."* | *"One completed project sample, with the customer's own schedule, cost and contract exports reconstructed into a single package-level view."* | 7 |

**The footnotes got shorter by dropping what the card already prints.** Each
card carries a status chip and a `metricEyebrow` — *Measured* / *Modeled* /
*Target outcomes* — so a footnote that opens by restating the status spends its
one line on a word the reader has just read. What survives in each is the part
the chip cannot say: **on whose documents**, **against what baseline**, or that
**nothing has been measured yet**. The `in-preparation` pair still carries no
*figures are illustrative* clause, because their headline values are
qualitative — the checker fails that mismatch.

**S6 · `overview.about`** — see (d).

| Key | Before | After | Item |
|---|---|---|---|
| `title` | *"A global digital engineering company, building on Oracle and NVIDIA."* | *"A digital engineering company, at the frontier of agentic AI."* | 2 |
| `body` | *"Headquartered in Austin, Texas, SoftServe designs and builds data, cloud and AI solutions for enterprises. The Oracle AI & Data team draws on SoftServe's data and analytics practice — 150+ active projects and 30 Fortune 500 clients — and on engineering teams upskilled on the Oracle AI stack."* | *"SoftServe has spent more than thirty years designing and building data, cloud and AI solutions for enterprise industries, and today operates at the frontier of industrial, physical and agentic AI. Its Oracle team draws on the company's data and analytics practice and on architects and engineers dedicated to the Oracle AI stack."* | 2 |
| `stats[0]` | `1993` / *founded* | `20K+` / *customer projects* | 2 |
| `stats[1..3]` | `10K` / *employees* · `17` / *countries* · `54` / *offices* | unchanged | — |

**S7 · `overview.contact`**

| Key | Before | After | Item |
|---|---|---|---|
| `heading` | *"Talk to the Oracle AI & Data team"* | *"Talk to our team"* | 3 |
| `sub` | *"One scoping conversation starts it. We come back with what a proof of value would cover, what it would cost, and what it would measure."* | unchanged | — |

**Site-wide**

| Key | Before | After | Item |
|---|---|---|---|
| `site.footer.description` | *"Tell us which account or workflow you have in mind. **One scoping conversation starts it.**"* | *"Tell us which account or workflow you have in mind."* | (f) side-finding |
| `services.proof.engagementsTitle` | *"What each engagement measures"* | *"Engagement by engagement"* | 6 + (f) |

#### (c) The metrics strip — what each figure rests on

The owner asked for three specific figures. Two of them are not equally
sourced, and the difference is recorded here because the next person to edit
this strip will not be able to tell by looking.

**`1,000+` — *experts in AI, data and R&D across SoftServe*.** Newsroom-only.
The sentence it comes from is on softserveinc.com, in the tier-1 NVIDIA release
of **21 January 2026**, verbatim:

> "SoftServe has 400+ professionals with deep expertise in the NVIDIA stack and
> overall has more than 1,000 experts in AI/ML, robotics, digital twins, IoT,
> data and infrastructure engineers, AR/VR, and R&D."

**§18.2 rejected this exact figure**, in the bullet headed *The newsroom
practice figures*: newsroom-only, the kind of count that drifts, and unnecessary
because the block already carried a cleared practice figure. The owner asked for
it, so it ships — with the reason it was rejected recorded here rather than
silently dropped. What the round had to get right instead was the **label**.

The first attempt read *"AI and data experts at SoftServe"*. The source
sentence counts seven disciplines — AI/ML, robotics, digital twins, IoT, data
and infrastructure engineering, AR/VR, R&D — and that label names two of them,
so it silently converts a **1,000-strong cross-discipline count into a
1,000-strong AI-and-data headcount**. That is a bigger claim than the source
makes, on the one figure in the strip with the weakest footing.

The shipped label is **"experts in AI, data and R&D across SoftServe"**. It is a
fair compression for three reasons: it names **three** of the seven disciplines
the source lists rather than two; it claims **no AI-only headcount** — the three
nouns are joined, as they are in the source; and **"across SoftServe"** scopes
it to the company, which is what the sentence says (*"overall"*), rather than to
the Oracle AI & Data practice, which would be false. The strip's second tile
carries the practice-scoped credential, so the two are not confusable.

**`30` — *Fortune 500 clients in the data and analytics practice*.**
**Not sourceable on softserveinc.com.** §18.2 checked: "Fortune 500" appears on
the corporate site only inside a **case-study title**, never as a company
statistic, which is why §18.2 refused it as a corporate fact. It ships here on a
different footing — it is an **already-cleared practice credential that has been
in `content.js` since the first round**, and it still prints on the Services page
in `services.hero.stats[2]` (*"30 Fortune 500 clients in SoftServe's data and
analytics practice"*) and inside `services.whySoftServe.items[0]`. The home
tile keeps the **"in the data and analytics practice"** qualifier, which is the
whole reason it is honest: it is the practice's credential, stated as the
practice's, not a claim that SoftServe has 30 Fortune 500 customers.

**`4–8 weeks` — *to a fixed-price proof of value on your own data*.** The seven
Jumpstarts run on three clocks (`jumpstart.investment.duration`):

| Product | Duration | Price |
|---|---|---|
| `cross-system-erp-qa`, `business-metrics-qa` | 30–45 days | €30–50K fixed per use case |
| `large-document-extraction` | 2 months | €75K services · €0/mo infrastructure |
| `workforce-optimization` | 2 months | €90K services · €4K/mo infrastructure |
| `account-insights`, `case-evidence-collection` | `null` — set at scoping | `null` |
| `plan-vs-actual-investigation` | 12 weeks, plus a two-week acceptance phase | Scoped per engagement |

So *4–8 weeks* is the span of the **four priced** Jumpstarts (30 days ≈ 4 weeks;
about two months ≈ 8), and it is false of the other three — twelve weeks plus
acceptance is not eight. **The tile carries no footnote** — the strip is a
stat band, and rule 1 means a figure that needs a caveat row cannot live there —
so the scoping had to be inside the label. That was the Fable editor's finding,
and its fix shipped: the label reads *to a **fixed-price** proof of value on
your own data*. The words **fixed-price** are what scope the range to the four,
because those four are exactly the ones with a published price. The reader who
wants the other three finds them one screen down, in
`twoWays.panels[0].body` (*"Four are priced today; three are scoped per
engagement"*) and in the S4 step-1 `fact`, which still carries all three clocks.

**What the strip dropped**, and where those figures still live:

| Retired tile | Where it survives |
|---|---|
| `From 30 days` / *to a measured result on your own data* | The duration claim is now the third tile, narrowed to the priced four; `services.howWeEngage.ladder[0].duration` and `overview.delivery.steps[0].fact` carry the full statement |
| `Fixed price` / *on the priced Jumpstarts, agreed before work starts* | Folded into the third tile's label as *fixed-price*; the commercial split is stated in full in `twoWays.panels[0].body` |
| `4` / *Oracle platforms the practice focuses on* | **Still ships**, verbatim, as `services.hero.stats[3]` — and the four platform tiles in the hero stack visual are derived from `facets.technology`, so the count is still on the home page, drawn rather than asserted |
| `500+` / *data experts in SoftServe's data and analytics practice* | **Still ships** as `services.hero.stats[0]` and inside `services.whySoftServe.items[0]`. It is now absent from the home page entirely — §18.7 had already taken it out of the About body |

#### (d) The About block, sentence by sentence

The owner's objection was that the block read as *"shifted / voluntary made up
positioning info"*. It was not invented — §18.2 records every figure with its
URL — but he was right about the register: the round-5 block described SoftServe
in the site's own words. The rewrite uses **SoftServe's own**. Three public
sentences carry it, fetched 2026-09-16:

| Public sentence | Where | What it became |
|---|---|---|
| *"SoftServe is a digital engineering company. We design and build data, cloud, AI/ML, robotics, IoT, and XR solutions."* | homepage hero, https://www.softserveinc.com/en-us | `title`'s opening — **"A digital engineering company"** — and the body's *"designing and building data, cloud and AI solutions"*, trimmed to the three families this site is about |
| *"We operate at the frontier of industrial, physical, and agentic AI — backed by deep R&D and business-led, technology enabled advisory to drive client outcomes."* | partners page, https://www.softserveinc.com/en-us/our-partners | `title`'s second half — **"at the frontier of agentic AI"** — and the body's *"today operates at the frontier of industrial, physical and agentic AI"*, which is the clause verbatim |
| *"more than 30 years of experience delivering superior digital solutions at exceptional speed by top-tier engineering talent to enterprise industries, including high tech, financial services, healthcare, life sciences, retail, energy, and manufacturing."* | press boilerplate | the body's opening — *"has spent more than thirty years … for enterprise industries"*. The industry list is not reproduced: this page sells into a subset of it, and printing all seven invites the question of which one the reader is |

The body's **second** sentence is unchanged in source — it is the internal half,
from `services.hero.lead` (*"pairs the delivery depth of a 500-strong data and
analytics practice with architects and engineers dedicated to the Oracle AI
stack"*), now carrying **no figure at all**. §18.2's rule holds: corporate facts
from softserveinc.com, practice credentials from the existing data layer, and
the two halves kept apart.

**The body no longer repeats its own headline.** Round 5's body opened
*"Headquartered in Austin, Texas, SoftServe designs and builds …"* under a title
reading *"A global digital engineering company …"*; the two said *digital
engineering company* within one band. The HQ went with that sentence and is not
missed — it prints in the site footer and on the locations page the block links
to.

**The four tiles are now the About Us page's own counters**, all four from
https://www.softserveinc.com/en-us/about-us: **20K+ customer projects · 10K
employees · 17 countries · 54 offices**. This **retires the `1993` / *founded*
tile**, which §18.2 had flagged as the single tile with a newsroom-only source
and named as the one to drop if anyone wanted every tile on an evergreen
corporate page. That is now done, and the strip is internally consistent: four
counters, one page, one fetch date. `20K+` ships as what the page calls it —
**customer projects** — and specifically **not** as a client count, which is the
misreading §18.2 refused.

**A standing finding for whoever writes about Oracle next.** The positioning
research confirmed §18.2's finding from the other direction, and it is worth
stating as a rule rather than a footnote:

- softserveinc.com states **no Oracle partner tier** anywhere.
- Oracle is **absent from the homepage partner strip** and from the "Our
  Strategic Partnerships" set (AWS, Google Cloud, Microsoft, NVIDIA, Anthropic);
  it appears only in the A–Z partner directory.
- SoftServe's public Oracle page (`/en-us/our-partners/oracle`) is an
  **Oracle/NetSuite services and staff-augmentation page**, not a partnership
  page.

**Therefore no Oracle partner-standing claim may ever ship on this site** — not
a tier, not "partner of the year", not an implied equivalence with the NVIDIA
Elite relationship (which is public, and still does not ship either). What the
site claims about the relationship is a **delivery** claim — *"Delivered with
Oracle's AI & Data organization, in joint teams"* — evidenced by
`services.whySoftServe.items[1]` and by `solutionStack`'s
`providedBy: "Oracle + SoftServe"`. Keep it that way.

#### (e) The layout and link changes

Each verified against the shipped code.

**An address is a link, not a call to action.** `UI.contactCard` used to render
`person.email` through `button({ kind: "primary", icon: "mail" })` — a filled
teal button whose label was an email address. It now renders:

```
<a class="contact-mail" href="mailto:oracle@softserveinc.com">
  [mail glyph]<span>oracle@softserveinc.com</span>
</a>
```

— body size, weight 600, a hairline rule under it, accent on hover and
focus-visible. Because `contactCard` is one component, this lands on **all three
surfaces it renders**: the home page's S7 contact screen, the Services contact
section, and every product's **Contacts** tab (`contactSplit` is called from
`pages/overview.js`, `pages/services.js` and `pages/product.js`). The
`.contact-mail-btn` rules and the ≤ 900 px full-width override went with the
button; the print stylesheet gained `.contact-mail` so the address still prints
black.

**The About band's website link** is the same move in the light band's ink:
`pages/overview.js` no longer calls `UI.button({ kind: "dark", iconAfter:
"external" })` and emits an `<a class="band-link">` with the external glyph
after the label, `target="_blank" rel="noopener"`. At rest its rule is
half-strength (`rgba(7,9,13,.5)`), full weight on hover — the only move a
near-black link has left. Both links take `padding-block` at ≤ 560 px, which is
what carries them past the tap-target minimum.

**The proof strip.** Three faults in one: the row inherited a four-column track
count with three tiles in it, `.stat` has `padding: 1.5rem 1.5rem 0` (no bottom
padding, because on the Services strip the band's own padding closes it), and
the band set `padding-top` only. So the cell dividers — `.stat + .stat {
border-left }` — stopped at the last line of the tallest label instead of
running the cell, and the labels sat directly on the next section's hairline.
The fix is three declarations, all scoped to the new modifiers:

```
.stat-row--home  { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.stat-row--home .stat { padding-bottom: 1.5rem; }
.stat-band--home { padding-bottom: clamp(2.5rem, 5vw, 4rem); }
```

Cell padding is now symmetric (1.5rem top and bottom), so a divider runs the
full height of the cell; the band closes with the same space it opens with, so
the following hairline reads as a divider and not as an underline. Below 900 px
the row goes two-up with the third tile spanning both columns — a cell is a
column of the band, not a tile in a grid — and single-file at 480.

**`stat-band--home` and `stat-row--home` are why the two pages can differ.**
`pages/overview.js` emits both modifiers; `pages/services.js` emits plain
`stat-band` / `stat-row--band services-stats`. The **Services strip was verified
pixel-identical**: every new rule is behind a `--home` selector, and the one
site-wide line this pass touched — the ≤ 480 px rule, which had been narrowed to
`.stat-row:not(.stat-row--home) .stat` in round 5 — was widened back to
`.stat-row .stat`, which is what Services already matched. The round-5
home-specific ≤ 480 block (two-up with `nth-child` borders) was deleted with it.

**The case-study rail** dropped the whole `cases-method` block: the
`services.proof.lead` paragraph, the **81%** stat and `services.proof.footnote`.
The rail is now **head (eyebrow · H2 · lead) → NDA line → one link**, and the
method ships in exactly one place, the Services proof block, which the rail's
link points at. The `.cases-method` rule and the `.cases-rail .method-stat-value`
accent override went with it.

**S4 ends on one button.** With `ctas` down to one entry the CTA row renders a
single primary button; no renderer change was needed, and the checker's
`=== 2` became 1–2.

#### (f) The Fable copy-editor round

A Fable subagent read the result once as a final copy edit. **Five proposals,
four applied.**

| # | Proposal | Outcome |
|---|---|---|
| 1 | Scope the `4–8 weeks` tile inside its label, since the tile can carry no footnote — add **fixed-price** | **Applied.** The label reads *to a fixed-price proof of value on your own data* (c) |
| 2 | Rewrite `overview.about.body`: its opening clause repeats the H2 word for word, and *"The Oracle AI & Data team"* is the name this page gives **Oracle's** own organization one screen earlier | **Applied**, with the subject shortened to *Its Oracle team* so the sentence does not open on the company name twice — *SoftServe has spent more than thirty years … Its Oracle team draws on the company's data and analytics practice and on architects and engineers dedicated to the Oracle AI stack* |
| 3 | Trim all four `overview.caseStudies[].footnote`s: every card already states its status in the chip **and** the eyebrow, so the footnote should carry only the caveat the chip does not | **Applied**, with two adjustments — *Modeled* and *Measured* were kept as the first word of their footnotes (§4 records the modeled-results caveat as load-bearing), and the two in-preparation cards read *What the proof of value will measure; no results yet.* rather than the editor's *Targets, not results.*, which would have been the seventh *"X, not Y"* on one screen |
| 4 | `overview.hero.lead` lands *your own* three times on the first screen; the proof tile is where it earns emphasis | **Applied** — *run in your tenancy, measured on your data first* |
| 5 | Replace `twoWays.panels[0].body`'s closing *"Four are priced today; three are scoped per engagement."* with *"Fixed scope, signed success metrics, and an executive readout at the end."* | **Rejected** — see below |

Two side-findings from the same pass were also applied: the block name the owner
rejected still headed the Services engagements panel (`services.proof.engagementsTitle`
→ *Engagement by engagement*), and `site.footer.description` repeated *"One scoping
conversation starts it."* from `overview.contact.sub` directly above it, inside one
viewport — the footer keeps only its first sentence. The editor also named the two
in-preparation cards' `line` strings as the page's clearest AI tell: one sentence
skeleton reused twice with a dangling participle (*"A first engagement is being
prepared on …, scoring each …"* — the engagement is not doing the scoring). Both were
rewritten on different structures (b).

**Why row 5 was rejected.** The proposal reads as a fix for the owner's
scaffolding objection, and it is not one. Two reasons:

1. **The four/three split is commercial information a buyer needs**, not
   scaffolding. It is the one place on the site that states its commercial
   shape, it is arithmetic over the seven `jumpstart.investment` blocks, and it
   is the **honest guard against implying all seven are ready to buy** — the
   same job §18.0 (a) gave it when *ready-to-run* was refused as a blanket
   claim. Two of the seven carry `statusNote: "In preparation — scoping
   conversations are open."`; a panel that says only *fixed scope, signed
   metrics* and nothing about pricing readiness contradicts the product page one
   click away.
2. **The replacement is already on the screen twice.** *Fixed scope … signed
   success metrics* is `delivery.steps[0].body`'s second sentence, and
   *executive readout* is `why.pillars[2].body` verbatim — both in S4, one
   screen down. The pass would have deleted a fact and duplicated a sentence.

What the owner objected to was counts used as headlines (*Seven products, three
workflow patterns*), not a number that tells a buyer what he can purchase today.

**Two side-findings, both applied.**

- **The Services page still carried the rejected block name.** The owner's item
  6 named `overview.caseStudiesIntro.title`; `services.proof.engagementsTitle`
  held the same string, *"What each engagement measures"*, heading the panel of
  per-engagement method lines. It became **"Engagement by engagement"** — which
  is also the phrase the S5 link label gave up in row 4, so the tail moved to
  the block it was describing.
- **The footer repeated the sentence directly above it.** On the home page
  `site.footer.description` ended *"One scoping conversation starts it."* and
  `overview.contact.sub` **opens** with that sentence, inside the same viewport.
  §18.5 had already cut the same duplication once, in the other direction, by
  rewriting `contact.sub`; the footer half survived it. The footer now reads
  *"Tell us which account or workflow you have in mind."* and the promise is
  made once, by S7.

#### (g) What this supersedes

§18.2, §18.5 and §18.7 stay as the record of their own rounds. Where they
disagree with `content.js`, **this section is the current text**. The statements
that are now specifically out of date:

**§18.2 (the About block).**
- *The newsroom practice figures* bullet — the rejection of *"more than 1,000
  experts in AI/ML …"* is **overturned**: that figure is the strip's first tile.
  The *400+ NVIDIA professionals* half of the same bullet still does not ship.
- The `1993` / *founded* row's "ships as" column: **the tile is retired.** §18.2
  itself named it as the tile to drop, and the paragraph ending *"that is the
  tile to drop"* has now been acted on.
- The HQ row's "ships as" column — the body no longer says *"headquartered in
  Austin, Texas"*, and the self-description row's sentence has been rewritten
  (d).
- *"the block already carries a cleared practice figure (500+) in the body"* —
  it does not. `500+` left the body in §18.7 and left the home page entirely in
  this round.
- The *Fortune 500 as a corporate fact* bullet still holds as written — but the
  practice-level credential it points at now prints in the **hero strip**, not
  in the About body.
- The **source table, the 404 paths and the counter warnings are unaffected**,
  and `20K+ customer projects` has moved from *deliberately not used* (as a
  client count) to shipping as what the page calls it.

**§18.5 (the copy/leak critic round).**
- Its `overview.hero.stats[0]` and `stats[1]` rows describe tiles that no longer
  exist on the home page.
- Its `overview.caseStudiesIntro.title` row is two titles out of date.
- Its reason for cutting *signed before the clock starts* from a bullet — *"It
  now lives in the S4 step-1 body and the S5 rail"* — is half wrong now: the S5
  rail no longer prints `services.proof.lead`. The S4 step-1 body still does.
- Its `panels[1].bullets[1]` row was superseded by §18.7 and again here.

**§18.7 (the messaging pass).**
- *"The strip therefore reads **From 30 days · Fixed price · 4 Oracle platforms ·
  500+** — clock, commercial, breadth, credential"* — **all four tiles are
  retired.** The reasoning in its `stats[1]` and `stats[2]` rows (the commercial
  fact second; platform breadth as what an Oracle rep sells on) is the record of
  that decision, not the current strip.
- The S3 `title` row — *"Find the job you need done."* was the owner's own line
  from that pass and his own item 8 replaced it.
- The S5 `title` row — *"What each engagement measures."* was chosen there
  deliberately, over *"The proof so far."*, and item 6 rejected the result. The
  reason it was chosen (two of four cards are in preparation) still binds the
  replacement, which is why the new title names both states.
- Its **"Not changed, on purpose"** list is now wrong on six entries:
  `panels[1].title`, `about.title`, `about.stats`, `caseStudiesIntro.ndaLine`
  and `cta`, and the four case-study cards all changed here. `overview.contact`
  is half right — `sub` stands, `heading` changed.
- Both **repetition tables** are stale: the corpus changed again. Re-count
  against the stated definition in §18.7 if a later round wants the drift, and
  do not compare against either table's *after* column.

**§18.0 (b)** is also superseded on its conclusion: *"From 30 days"* was chosen
as the one duration claim true of all three clocks. The strip now states
**4–8 weeks**, which is true of the four priced Jumpstarts only, and the label's
*fixed-price* is what carries that scoping. The reasoning in 18.0 (b) — that a
site-wide duration promise must be true at the **top** of the range — is
unchanged and is exactly why the narrowing word is in the label.

### 18.9 The catalog is a starting point, the case studies say one word, and the positioning is agents and workflows (2026-09-16)

Three instructions came back from the owner after §18.8 shipped. They are
independent — one is about how the catalog frames itself, one is about how the
case studies hedge, one is about the positioning the whole site claims — but
they were implemented in one pass because all three land in `content.js` and two
of them touch the same four case-study cards.

**Scope.** `site/data/content.js`, `site/pages/products.js`, `site/pages/product.js`,
`site/assets/app.js`, `site/assets/site.css` and `tools/check-grammar.js`. Two
data keys deleted, one CSS rule deleted, one DOM element deleted. **No new key,
no new component, no design token**, and the checker still prints `OK`.

#### (a) The three instructions, and the principle adopted for each

**1 · The catalog must not read as a ceiling.**

> "Right now it emphasizes that we only cover 3 patterns and 7 apps, while it's
> just the current (in the future there will be more, it's too few in fact). so
> no overemphasize pls. In fact, the full picture is on the roadmap here. We
> should also not bring attention to the gap etc."

A Fable subagent read every surface that counts, totals or negates, and the
principle that came back — adopted as written — is:

> **Say what is here, never how many and never what is not.** A gap exists on a
> page only where the page states a ceiling or a negation; breadth is stated
> positively, and only where it is already cleared.

The three shapes that violate it, all of which shipped: a **total** (*seven
products*, `7 products`, a `5 of 7` denominator), a **negation** (*No packaged
offering … yet*, *NOT SEEING YOUR WORKFLOW?*, *the patterns packaged so far*),
and a **scoreboard** — a facet rail listing two of Oracle's four AI platforms
with a `0` beside them. The one positive breadth clause the round added (*"or
build the one your workflow needs"*) is traceable to `services.whatWeDo.lead`
(*"SoftServe builds, integrates and runs the application layer on top"*) and to
`layering[0].body` (*"use-case discovery, agentic and data engineering"*), so it
states a capability the Services page already sells rather than a promise about
a future catalog.

**2 · The case studies must not drum on what is unproven.**

> "in the case studies, u overemphasize that something is not proven (you
> highlight that as keywords), while I would just say 'forecested',
> 'estimated', 'proven' etc. depending on the case (instead of the label
> 'Modeled in the proof of value' and sub-heading 'modeled'). + add a convincing
> small footnote for those estimated. Fix that (check if needs to be fixed on
> multiple pages)."

The principle: **the status word is said once, in one plain word, and the
footnote spends its line on evidence rather than on a restatement of the chip.**
Round 4 had built the card to say the status twice on purpose — a chip *and* an
eyebrow over the figure, with the checker asserting that the two agreed (§17.2,
§17.3). Saying it twice is what turned a result into a disclaimer: a reader met
*Modeled in the proof of value* in the chip, *Modeled* again over the number,
and *modeled simulations* in the footnote before reaching the figure itself. One
statement of the status, then evidence.

**3 · The positioning is broader than agents.**

> "The diagram on the front page (and maybe other places) focus specifically on
> Agent engineering, while our positioning is broader - AI agents & workflows."

The principle: **wherever the site states what the practice does, it says
agents *and workflows*; wherever it names a specific thing that is an agent, it
still says agent.** `site.tagline` has read *"AI agents and workflows on Oracle
platforms"* since round 1 and `site.metaDescription` and the H1 both carry both
halves — the narrowing had crept into the layer that describes the practice
(the stack's middle band, the two S2 panels, the Agentic-AI-experience pillar),
which is exactly the layer a reader uses to decide what SoftServe can build.

#### (b) Before → after

*Before* is the text as §18.8 recorded it shipping; *after* is read from the
files as they now stand.

**Instruction 1 — the catalog is a starting point**

| Key / behaviour | Before | After |
|---|---|---|
| `overview.hero.stack.patternsLabel` | *"What they do"* | *"Agents and workflows to start with"* |
| `overview.hero.stack.ariaLabel` | *"How the products are built: the jobs the agents do on top, the SoftServe layer in the middle, the four Oracle platforms underneath"* | *"How they are built: the agents and workflows you can start with on top, grouped by the job they do, the SoftServe layer in the middle, the four Oracle platforms underneath"* |
| `overview.twoWays.panels[0].body` | *"Each one runs on Oracle in your own tenancy and starts with a Jumpstart on your data. **Four are priced today; three are scoped per engagement.**"* | *"Each one runs on Oracle in your own tenancy and starts with a Jumpstart on your data — **at a fixed price where one is published, otherwise scoped per engagement.**"* |
| `productsPage.intro` | *"Every product runs in your own Oracle tenancy and starts with a Jumpstart on your data. **Four are priced today; three are scoped per engagement.** Filter by the Oracle platform it runs on, or search for the job you need done."* | *"Every product runs in your own Oracle tenancy and starts with a Jumpstart on your data — **at a fixed price where one is published, otherwise scoped per engagement.** Filter by the Oracle platform it runs on, or search for the job you need done."* |
| `productsPage.bottomBlock.heading` | *"NOT SEEING YOUR WORKFLOW?"* | *"HAVE A WORKFLOW IN MIND?"* |
| `productsPage.bottomBlock.body` | *"These seven are the patterns packaged so far. New ones are packaged after their first live customer — tell us the workflow you need fixed and we will say whether it is close to something we already run."* | *"Tell us the workflow you need fixed. We will say which of these is closest, or what it would take to build one on your data."* |
| `productsPage.count` | `7` | **deleted** |
| `facets.footnote` | *"We also deliver on Oracle AI Data Platform and on Oracle AI for Fusion Applications. Packaged applications are published here as each one completes its first engagement."* | **deleted** |
| `facets.technology[*].emptyState` (all four, one string) | *"No packaged offering on this platform yet — the practice delivers on it; see Services"* | *"The practice delivers on this platform — see Services, or tell us the workflow you have in mind."* |
| `products.js` · `countLine()` | `list.length === total ? total + " products" : list.length + " of " + total + " products"` — a total with nothing filtered, a numerator **and a denominator** with a filter on | Nothing when nothing is filtered; nothing when the filter returns zero; `"N product"` / `"N products"` with **no denominator** when it returns something. The `#results-count` element stays in the DOM either way — it is the `aria-live` region that announces the next change |
| `products.js` · `railOption()` count | Every option printed `options.count`, including `0` | `counted = typeof options.count === "number" && options.count > 0` — **a zero renders no number at all**, and an option called without a count prints none |
| `products.js` · the two **All** options | Called with `count: filtered({ tech: "" }).length` / `filtered({ cat: "" }).length` — i.e. the size of the catalog, twice | Called with **no `count`** — a count says what a click would return, and the option that clears the group returns the whole catalog, which is the number the round is removing |
| `products.js` · the platform list | All four facets rendered, the two with no product **listed and disabled** at `0` | `.filter(entry => entry.count > 0 \|\| state.tech === entry.facet.id)` — **a platform with no products is not rendered**, with one exception: the facet the reader arrived on. `#/products?tech=oracle-ai-fusion` still renders its own option, selected, above the `emptyState` that explains it, so every saved deep link still resolves |
| `products.js` · `railHtml()` | The platform group closed with `<p class="rail-note">` printing `facets.footnote` | The element is **gone** with the key |
| `site.css` | `.rail-note { … }` and its `display: none` override in the ≤ 900 px block | Both **deleted** |

The four/three sentence is the one row worth reading twice: it was **kept in
substance and lost only its arithmetic** — see (c).

**Instruction 2 — the case studies say one word**

| Key / behaviour | Before | After |
|---|---|---|
| `shared.caseStudyStatus.measured.chip` | *"Measured in the proof of value"* | **"Proven"** |
| `shared.caseStudyStatus.measured.tooltip` | *"The figures were measured during a completed proof of value on the customer's own data."* | *"Measured during a completed proof of value, on the customer's own data."* |
| `shared.caseStudyStatus.modeled.chip` | *"Modeled in the proof of value"* | **"Forecast"** |
| `shared.caseStudyStatus.modeled.tooltip` | *"The figures come from simulations run on the customer's own historical data during a completed proof of value, not from production."* | *"Forecast from simulations run on the customer's own historical data during a completed proof of value."* |
| `shared.caseStudyStatus.in-preparation.chip` | *"Proof of value in preparation"* | **"Estimated"** |
| `shared.caseStudyStatus.in-preparation.tooltip` | *"The engagement is being prepared; the figures are what it is set up to measure, not results."* | *"Estimated for an engagement now being prepared, against the way the work is done today."* |
| `overview.caseStudies[].metricEyebrow` ×4 | *Modeled* · *Measured* · *Target outcomes* · *Target outcomes* | **key deleted** from all four cards |
| `products[].overview.caseStudy.metricsEyebrow` ×4 | the same four words | **key deleted** from all four product pages |
| `app.js` · `UI.caseCard` | `'<p class="eyebrow eyebrow--accent">' + esc(item.metricEyebrow) + "</p>"` above the figure | line removed |
| `product.js` · `caseStudy()` | `'<p class="eyebrow case-metrics-eyebrow">' + UI.esc(item.metricsEyebrow) + "</p>"` above the figures | line removed |
| `site.css` | `.case-metrics-eyebrow { color: var(--text-dim); margin-bottom: .75rem; }` | **deleted**; the space it held is now on the blocks themselves — `.case-metrics { margin-top: .75rem }` and `.case-card-metric { margin-top: .25rem }`, so the chip still breathes above the figure it qualifies |
| `caseStudies[workforce-proof].footnote` | *"Modeled against a historical baseline, not live operations; illustrative, not contractual."* | *"Simulated on the customer's own historical operations data and scored against the plan dispatchers build today; illustrative, not contractual."* |
| `caseStudies[extraction-proof].footnote` | *"Measured on the customer's own documents; illustrative, not contractual."* | *"Measured end to end on the customer's own agreements during the proof of value; illustrative, not contractual."* |
| `caseStudies[account-insights-engagement].footnote` | *"What the proof of value will measure; no results yet."* | *"The comparison is the customer's own account-planning cycle today, on success metrics signed before the work starts."* |
| `caseStudies[plan-vs-actual-engagement].footnote` | *"What the proof of value will measure; no results yet."* | *"Against the expert hours the same analysis takes today, on a sample the customer's own experts validate."* |
| `workforce-optimization` · `caseStudy.story`, last sentence | *"Results are modeled simulations against a historical baseline, not measured production outcomes."* | *"Figures are forecast from those simulations against the customer's own historical baseline; illustrative, not contractual."* |
| `large-document-extraction` · `caseStudy.story`, last sentence | *"Measured **in the proof of value** on the customer's own documents; figures are illustrative, not contractual."* | *"Measured **end to end** on the customer's own agreements **during the proof of value**; figures are illustrative, not contractual."* |
| `account-insights` · `caseStudy.story`, last sentence | *"The figures above are **target outcomes the proof of value is set up to measure, not results**; they are illustrative, not contractual."* | *"The figures above are **estimates for that engagement, set against the customer's account-planning cycle today**; illustrative, not contractual."* |
| `plan-vs-actual-investigation` · `caseStudy.story`, last sentence | *"the figure above is a **target outcome the proof of value is set up to measure, not a result**, and is illustrative, not contractual."* | *"the figure above is an **estimate for that engagement, set against the expert hours the same analysis takes today**; illustrative, not contractual."* |
| `disclaimers.modeledResults` | *"Results are modeled simulations against a historical baseline, not measured production outcomes."* | *"Figures are forecast from simulations against a historical baseline, not measured in production."* |

**The two `Estimated` cards now name what the estimate is measured against, and
who validates it.** That was the owner's *"convincing small footnote"*: an
estimate with nothing behind it is a number a customer discounts on sight. The
account-insights card names the **comparison** (*the customer's own
account-planning cycle today*) and the **contract** (*success metrics signed
before the work starts*); the plan-versus-actual card names the **comparison**
(*the expert hours the same analysis takes today*) and the **validator** (*a
sample the customer's own experts validate*). Neither says *no results yet* any
more — the chip says *Estimated*, which is the same fact without the negation
(instruction 1's principle applied inside instruction 2).

**§4's modeled-results caveat is unchanged in force.** §4 of this file records
the caveat as load-bearing: every workforce figure has to be *framed as
modelled, never delivered*, and §10.8 makes both proof strips a ship gate. The
new wording keeps every element that does that work:

| What §4 requires | Where it is, after the rewrite |
|---|---|
| The figures come from **simulations**, not production | `disclaimers.modeledResults`: *"Figures are **forecast from simulations** … **not measured in production**."* The card's footnote opens *"**Simulated** on the customer's own historical operations data"*; the story closes *"Figures are **forecast from those simulations**"* |
| The baseline is the **customer's own historical** operations, not an industry benchmark | *"against a historical baseline"* (the disclaimer), *"on the customer's own historical operations data … the plan dispatchers build today"* (the footnote), *"against the customer's own historical baseline"* (the story) |
| Nothing is presented as a delivered production outcome | *not measured in production* · *illustrative, not contractual* on the card, the story and the disclaimer |

*Modeled* → *Forecast* is a change of word, not of claim: a forecast is by
definition not a measurement, and the sentence still names the simulations and
the baseline in the same breath. **The §4 and §10.8 clearance gates therefore
stand exactly as written** — what is outstanding is still Oracle's and the
customer's written permission, and nothing in this round moved a figure toward
or away from it.

**Instruction 3 — agents *and workflows***

| Key | Before | After |
|---|---|---|
| `overview.hero.stack.softserve.items[0]` | *"Agent engineering"* | *"Agentic and data engineering"* — now sourced to `services.whatWeDo.layering[0].body`, which lists *"use-case discovery, **agentic and data engineering**, integration into Fusion applications and Oracle Field Service, value realization and run"*. The band is SoftServe's own layer, so it names what that layer does in the Services page's words |
| `overview.hero.stack.patternsLabel` | *"What they do"* | *"Agents and workflows to start with"* — the top band now carries **both halves of the positioning** (and, per instruction 1, an invitation rather than a definition) |
| `overview.hero.stack.ariaLabel` | *"…the jobs the agents do on top…"* | *"…the **agents and workflows** you can start with on top, grouped by the job they do…"* — the accessible name follows the band it describes; it is still the only way the figure reaches a screen reader (§18.3) |
| `overview.twoWays.title` | *"Start with an **agent**, keep the team that built it."* | *"Start with a **product**, keep the team that built it."* — the screen's H2 covers all seven, and four of them are not a single agent |
| `overview.twoWays.panels[0].title` | *"Agents ready to run"* | *"Agents and workflows"* |
| `overview.twoWays.panels[1].body` | *"The architects and engineers who built **these agents** adapt them to your systems, rules and data, and take them to production. One contract, one accountable team."* | *"The architects and engineers who built **them** adapt them to your systems, rules and data — **or build the one your workflow needs** — and take them to production. One contract, one accountable team."* |
| `overview.delivery.why.pillars[1].body` | *"**Agents** built and tested on real enterprise data, with evaluation, guardrails and governance hardening available on every engagement."* | *"**Agents and workflows** built and tested on real enterprise data, with evaluation, guardrails and governance hardening available on every engagement."* |
| `overview.catalog.lead` | *"Each **agent** runs in your own Oracle tenancy. Open one for how it works, what it needs from you, and the Jumpstart scope."* | *"Each **one** runs in your own Oracle tenancy. Open one for how it works, what it needs from you, and the Jumpstart scope."* |
| `productsPage.bottomBlock.body` | *"…we will say whether it is close to something we already run."* | *"…We will say which of these is closest, **or what it would take to build one on your data**."* — the same positive breadth clause as `panels[1].body`, on the page where a reader who found nothing lands |

**What was deliberately left narrow, and why.** Broadening every instance would
have cost the site the one place each word is doing work:

- **`overview.catalog.title`** — *"Agents that read, extract, plan and answer."*
  — and the three `catalog.patterns[].definition`s keep agents language because
  **the owner asked for that block to speak it** (§18.8, item 8: *"that block
  should speak AI and agents language"*). One instruction does not get to undo
  the previous one; the catalog is where agents is the subject.
- **`site.name`** — *"AI Agents on Oracle"* — is the owner's chosen site name
  (§18.0), carried by `site.title` and `headerLockup.productName`. Renaming the
  site is not a copy edit. The breadth is already beside it: `site.tagline` is
  *"AI agents and workflows on Oracle platforms"* and the H1 reads *ENTERPRISE
  AI AGENTS AND WORKFLOWS. BUILT ON ORACLE.*
- **`overview.about.title`** — *"A digital engineering company, at the frontier
  of agentic AI."* — keeps *agentic AI* because those are **SoftServe's own
  public words**, quoted from `/en-us/our-partners` (§18.8 d). The About block's
  whole point is that it is not our paraphrase.
- **The Oracle platform descriptions** that mention agents —
  `facets.technology[oracle-ai-fusion].description` (*"Embedded AI agents and AI
  Agent Studio across ERP, SCM, HCM and CX"*), the `oci-nvidia` and
  `oracle-ai-lakehouse` engine lists — are **Oracle's own product facts**.
  Rewording a vendor's product description to match our positioning is the class
  of error the canonical-platform rule exists to prevent (§17.7).

#### (c) Two earlier decisions reversed

**1 · §17.7's "The zero-count facets stay listed" is reversed.**

Round 4 decided that all four platform facets render, the two with no product
**disabled with a `0`**, on the reasoning that *"the rail's shape does not move
under the reader between visits"*. That reasoning was about a returning reader.
The reader that decided this round is a different one: **an Oracle account
executive with the page open on a live call**, being shown a scoreboard that
reads `0` against two of Oracle's own four AI platforms — `Oracle AI Data
Platform` and `Oracle AI for Fusion Applications`. A rail is a navigation
control, and an option that returns nothing is not navigation; printed beside an
Oracle product name in front of an Oracle seller, it is a scorecard of what
SoftServe has not built on his platform. The stability argument loses to that.

**What survives from §17.7 unchanged:** the four canonical ids and labels, the
ban on `other`, the per-facet `emptyState`, and — importantly — the deep link.
`#/products?tech=oracle-ai-fusion` and `?tech=oracle-ai-data-platform` are still
honored: the active facet renders its own option even at zero, selected, above
the `emptyState` inside the normal grid container. A saved or pasted link never
dead-ends, and the checker's `facets.technology` contract (four entries, in
order, each with `fullLabel`, `description` and `emptyState`) is untouched —
`emptyState` still has to exist on all four, because any of them can be the
active one.

**2 · §18.8 (f) row 5 defended the four/three sentence; it is now gone as
arithmetic and kept as substance.**

§18.8 (f) rejected a proposal to replace
`twoWays.panels[0].body`'s *"Four are priced today; three are scoped per
engagement."* for two reasons, and **both still hold**:

1. *The four/three split is commercial information a buyer needs.* It still
   ships: *"at a fixed price where one is published, otherwise scoped per
   engagement"* states the same two commercial facts — that some are priced now
   and some are scoped — and keeps the honest guard against implying every
   product is ready to buy.
2. *The replacement was already on the screen twice.* Nothing was replaced with
   something already on the screen: the arithmetic was **deleted**, not
   substituted.

What changed is only the **counting**. A number that tells a buyer what he can
purchase today is information (§18.8 f's own conclusion); a number that tells
him the catalog has exactly seven members, four of which are priced, is a
census — and a census invites the subtraction the owner asked us not to invite.
The sentence therefore keeps its job and loses its digits, on both surfaces that
carried it (`twoWays.panels[0].body` and `productsPage.intro`).

#### (d) The new checker rules, by name

`tools/check-grammar.js` lost the `CASE_EYEBROW` map and its two pairing
assertions, and gained a constant and two blocks:

| Rule | What it asserts | Message when it fires |
|---|---|---|
| `CASE_STATUS_CHIPS` (constant) | `["Proven", "Forecast", "Estimated"]`, positionally paired with `CASE_STATUSES` | — |
| **the case-study status words** (new block) | `shared.caseStudyStatus.measured/.modeled/.in-preparation`'s `chip` equals its entry in `CASE_STATUS_CHIPS` | *chip is "X", expected "Y" — one plain word, not a sentence about the proof of value* |
| `overview.caseStudies[i].metricEyebrow` | the key is `undefined` on every home card | *metricEyebrow is retired — the status chip carries the word once* |
| `overview.caseStudy.metricsEyebrow` | the key is `undefined` on every product page | *overview.caseStudy.metricsEyebrow is retired — the status chip carries the word once* |
| **no surface states the size of the catalog** (new block) — `productsPage.count` | the key is `undefined` | *retired — no surface prints the size of the catalog* |
| same block — `facets.footnote` | the key is `undefined` | *retired — it existed to explain the platforms with no product, which is the gap the rail no longer shows* |
| same block — the **total** sweep | `/\b(seven\|these seven\|four are priced\|three are scoped)\b/i` matches none of `productsPage.intro`, `productsPage.bottomBlock.body`, `productsPage.bottomBlock.heading`, `overview.twoWays.panels[0].body`, `overview.catalog.lead`, `overview.catalog.title` | *states the size of the catalog — say what a reader gets, not how many there are* |
| same block — the **gap** sweep | `/\bso far\b\|\byet\b\|\bnot seeing\b/i` matches none of the same six strings | *names the gap — the page says what is here, never what is not* |

Both eyebrow keys are now **outright failures** rather than required strings:
the round-4 rule was *"the eyebrow must say the same word as the chip"*, and the
round-6 rule is *"there is no eyebrow"*. The two sweeps are deliberately scoped
to the six strings that frame the catalog, not to the whole file: *yet* and
*so far* are legitimate English elsewhere, and `overview.catalog.title` is on
the list only because a future round might put a count back in the headline it
lost one in §18.7.

#### (e) What this supersedes

§17.2, §17.3, §17.7, §18.7 and §18.8 stay as the record of their own rounds.
Where they disagree with the files, **this section is the current text.** The
statements now specifically out of date:

- **§17.7**, the paragraph headed *"The zero-count facets stay listed."* —
  reversed in full; only the deep-link half of it still describes the shipped
  rail (c).
- **§17.2 / §17.3**, every quotation of the three chip strings (*Measured in the
  proof of value*, *Modeled in the proof of value*, *Proof of value in
  preparation*) and of the three eyebrow words (*Measured* / *Modeled* /
  *Target outcomes*) — the chips are three plain words and the eyebrows do not
  exist. The `status` keys themselves (`measured` / `modeled` /
  `in-preparation`) are **unchanged**, and so is the rule that the chip and the
  story's caveat sentence agree.
- **§18.6**, the rejected-or-deferred row *"The two in-preparation case cards
  share a sentence frame, and the status word prints in both the chip and the
  metric eyebrow"* — declared out of scope as round-4 data. It is fixed here;
  the shared sentence frame was already fixed in §18.8 (f).
- **§18.7**, the `stack.patternsLabel` row (*What they do*), the
  `stack.softserve.items` row (*Agent engineering*), and the `productsPage.intro`
  row, whose *"Four are priced today; three are scoped per engagement"* is now
  the fixed-price clause.
- **§18.8 (b)**, the S2 rows for `title`, `panels[0].title`, `panels[0].body`
  and `panels[1].body`; all four `caseStudies[].footnote` rows; and the
  paragraph beginning *"The footnotes got shorter by dropping what the card
  already prints"* — its reasoning (the footnote carries what the chip cannot
  say) is **kept and extended**, but it describes a card carrying *"a status
  chip and a `metricEyebrow`"*, and there is no eyebrow now.
- **§18.8 (f)** row 3, which kept *Modeled* and *Measured* as the first words of
  their footnotes on §4 grounds — the §4 requirement is satisfied by the new
  wording instead (b), and the workforce footnote now opens on *Simulated*.
- **§18.8 (f)** row 5's *outcome* is narrowed, not overturned: the four/three
  sentence is gone as arithmetic, and both of the reasons that saved it still
  describe why the clause that replaced it is there (c).


## 19. The second walkthrough — Workforce optimization, 2026-09-16

### 19.1 Brief, machine, tooling

- Alex's brief (chat, 2026-09-16, carried by `HANDOFF-workforce-demo.md`):
  repeat the Large docs exercise for the Workforce optimization pack — an
  interactive, guided walkthrough generalised the way the pack's own documents
  generalise the product, linked from the product page, its captures replacing
  the step frames and the poster — to the same standards (brand-agnostic,
  industry-neutral, mocked inputs and outputs, a short guided flow, one
  active control per step, the real product's flow, screens and information
  model) and with a red-team pass against the pack specs before calling it done.
- Built on Alex's MacBook Air: the repo, Google Chrome and the Xcode command
  line tools, but no Homebrew, no ffmpeg and no Node on the PATH. The capture
  tool ran on the Node bundled inside `/Applications/Codex.app` (v24). Frames
  came from a 60-line Swift/AVFoundation command-line tool written for the
  session (probe, a frame every 6 s at 960 px, 4 × 5 contact sheets, key
  frames at native resolution) — kept in the session scratchpad, not in the
  repo; the recipe is in `HANDOFF-workforce-demo.md`. Everything derived from
  the recording lives in git-ignored `.work/wfo-video/`.
- **Source:** `BSH PoC Application Features Overview (9 June).mp4`, shared
  from Alex's Google Drive — 56 min, 1080p, narrated: two presenters walk a UK
  south-west dataset and a US NY/CT dataset through the delivered application
  (v1.0.0) and then through the "Constraints Validation" sheet of the PoC test
  plan. Unlike the Large docs recording it has narration; it was transcribed
  **on-device** with the macOS 26 Speech framework (`SpeechAnalyzer` +
  `SpeechTranscriber`, en-US, 644 timestamped lines in 33 s, no key, one
  0.5-second decode fault at 14:24 padded), so the narrative below is both
  screen- and voice-derived. The transcript is not in the repo.

### 19.2 The real product, reconstructed

Dashboard ("Overview of active work zones and workers"; a backend-health chip
and a version chip) → **Run Optimization** modal (Region · Period up to 4
weeks · XLSX file with seven sheets — Visits, TechLocation, Skills,
SpecialSkills, Calendars, WZ_Zip, WZ_Assignments — "Download example"; a
mismatch between region and file errors at once; upload warnings arrive as a
toast, e.g. technician ids in Calendars missing from TechLocation) → a run of
several minutes → **Service Zones map** (zone polygons, "technicians · days"
pills, technician-home markers, solid default-zone routes, dashed temporary
routes; legend) → click a zone: Details with postcodes, technicians, visits and
days, an expandable visit list from the uploaded file only (historical demand
is used but never shown) → click a technician: home location, Standard /
Expert profile, zones (dashed = temporary) → **Filters** (zone and technician
multi-select with search) → **Optimized | Compare** (Current Allocation beside
Optimized Allocation; the table always shows the optimized plan) → **Weekly
Schedule**, paged by week, in **Zone View** (per zone: period, avg wait before
→ after, postcode count; day cells with technician pills; **Accept · Reject ·
Comment** per zone for the whole period) and **Technician View** (per
technician: capacity and jobs/day before → after, default zones; day cells with
zone pills; ABSENT cells); the pill legend — default zone · day off · moved to
another zone · temporary assignment · non-working · absent — where the
narration explains the light "day off" pill as *no visits that day, spare
capacity*, and the arrow as *the technician leaves the default zone* →
**Comment** modal (300 characters) → **Download**: an XLSX "Work zone
assignment" in the field-service system's import template (Resource ID · Item
ID · Work Zone Label · Start/End Date · Ratio · Recurrence · Recur Every ·
Assignment Type · Mon…Sun flags · Decision · Comment). In the PoC the decisions
were informational — "for now we stop here" — with a second solver run that
honours accept/reject named as the next step; the export "can be uploaded to
OFS directly".

Rules, from the constraints sheet and the narration: availability (Working /
Absent / Non-working; an absence of up to 2 days splits that day's tasks among
neighbouring technicians as a partial temporary assignment, a longer one
reassigns the whole zone temporarily and the usual allocation resumes after);
capacity (`capacityinhours` per technician and date, 1 visit ≈ 1 h, at most 7
visits a day); movable vs non-movable visits (parts allocated → the visit
keeps technician and date); skill match; special skills (Experts only, and an
Expert may cover a wider geography); technician home location and
neighbouring zones (distant zones penalised, several zones on one day should
share a border); historical demand (last year's same period backfills sparse
dates, actual visits never overwritten); work-zone allocation (a zone is a set
of ZIPs; one technician per zone, several zones on selected weekdays, several
technicians per zone when demand requires). The narration's own KPI example —
"30 days to 2.2 days" of wait time — is test-data output and was not carried.

### 19.3 The generalisation

The design note written before coding, kept verbatim in spirit:

1. **World:** "Harborview", a fictional coastal metro drawn as inline SVG from a
   jittered 4 × 3 grid (coast, harbour inlet, river, ring road) — twelve work
   zones HV-01…HV-12 (Northgate, Millbrook, Hillcrest, Eastfield, Westhaven,
   Kingsbridge, Stonebridge, Ridgeway, Marsh End, Southbank, Old Harbour,
   Ferry Point), each 5–15 invented postcodes; eighteen technicians
   T-1041…T-1058, ids only, two skill groups (Standard · Specialist).
2. **Period:** Mon 5 – Fri 30 Oct 2026, four weeks, Mon–Fri, one public
   holiday (26 Oct); roster mode.
3. **Rules that visibly matter:** a vacation (T-1047, 12–16 Oct → whole-zone
   cover by two neighbours), a same-day sickness (T-1055, 6 Oct → four visits
   split to a neighbour), non-movable appointments (HV-11, 8 Oct, pinned to
   T-1057), a max-load day (T-1048 at 8 visits on 13 Oct → two moved), a
   specialist-only zone (HV-12; a Specialist assists on 20–21 Oct; Standard
   technicians ineligible), an uncovered postcode (HV2 7 on 9 Oct → a
   temporary cover), three dates allocated on last year's demand (HV-07,
   flagged for confirmation), one spare-capacity day (T-1058, 16 Oct).
4. **Three allocations:** the uploaded current plan, plan v1, and plan v2 after
   dispatcher feedback — v1 moves Marsh End's technician to Southbank on
   Wednesdays and its wait time worsens (5.1 → 6.4 d); v2 keeps him and routes
   Southbank's overflow to a neighbour with slack (wait back to 5.0 d, fleet
   productivity −0.02).
5. **Every change carries a "why"** naming its rule, and the feedback re-run
   lists the alternatives it weighed — the matrix's model-decision explanations
   and what-if options.
6. **Integration surfaces, not flows:** a Sources strip (manual XLSX ·
   field-service system connected · booking, inventory, HR/WFM, forecast, BI
   configured), a Region select with three regions (one loads), Download → the
   import-format file plus a mocked "Send to the field-service system", and an
   "execution data received" line in the run history.
7. **Settings drawer, read-only:** planning mode, horizon, capacity, minimal
   disruption, objectives with weights, nine hard/soft rules, three regions
   with their own rule sets, six connectors.
8. **The tour, six steps:** run the optimization → read the plan on the map →
   compare with today's plan → check the KPIs per technician → resolve the
   exception (reject · comment · re-optimize) → accept the rest and export.
   Then free exploration; `?tour=off`, `?ui=clean`, `?view=tech`,
   `?plan=compare`, `?state=start|v1|v2|final`, `?week=n`.
9. **Deliberately absent:** any brand or customer mark ("GPU solver",
   "field-service system"), a time-to-plan claim, any € figure, a travel KPI,
   real geography, technician names.
10. **Same engine as Large docs:** tour steps with target / anchor / side /
    auto, the click guard, Skip = auto-perform, the end card, toasts for mocked
    downloads and sends.

### 19.4 KPIs and figures

Computed in the page from the data by the pack's methodology (productivity =
jobs ÷ days with at least one job per technician, fleet = simple mean; capacity
= round(jobs ÷ (working days × 7) × 100); wait = booking → appointment in
calendar days, fleet = demand-weighted):

| | Current plan | Plan v1 | Plan v2 (final) |
|---|---|---|---|
| Jobs per technician per day | 4.54 | 4.77 (+5.0%) | **4.75 (+4.5%)** |
| Capacity used | 65% | 68% | 68% |
| Avg wait, booking → visit | 6.8 d | 6.2 d | 6.2 d |
| Visits placed (of 1,631 booked) | 1,523 | 1,595 | 1,588 |
| Jobs/day spread across technicians | 1.00 | 0.89 | 0.89 |

Per-technician deltas run +1.1% to +8.4% with a median of +4.5%. The only
cleared figure the walkthrough reproduces is that median (§4, §17); the
capacity and wait-time deltas are synthetic companions chosen to be modest.
The real recording's uplifts (40% → 73% capacity, 2.81 → 5.2 jobs/day) were not
carried, for the reason §4 records.

### 19.5 Red-team against the pack specs

Checked against the sales one-pager's S/M/L rows and the accelerator-pack
feature matrix (`context/areas/softserve/docs/2026-09-16_wfo-pack-spec-for-demo.md`)
and the site's own copy for the product, before the frames were captured:

| Spec item | In the walkthrough |
|---|---|
| Skill-based allocation · max load per day · planned-vacation reallocation · same-day sickness | In the flow: skill chips and the specialist zone, the over-capacity fix, the vacation cover, the sick-day split |
| Default zones per technician · zone-level demand · neighbouring zones · cross-zone allocation | In the flow: default pills, demand per zone, every "why" line, the Wednesday move that the dispatcher rejects |
| Forecast-based allocation · historical demand | Surface + flow: the forecast connector and the demand rule; HV-07's three backfilled dates, flagged |
| Non-movable appointments · SLA types | In the flow: the pinned appointments (visit list shows "parts allocated"); "Priority 48 h" SLA on visits |
| Multi-objective function · hard/soft weighting · minimal disruption | Settings drawer; the re-run's "minimal disruption" stage and its alternatives |
| Dispatcher UI with map and table · approve / reject · explanations · feedback loop and what-if | The whole flow; "Why this allocation"; re-optimize with feedback listing the options weighed |
| KPIs: productivity · capacity · workload balance · baseline vs optimized | Before → after on every row and in the headers; the spread line |
| Travel reduction KPI · custom KPIs per customer | **Not shown** — no cleared travel figure; custom KPIs are a scoping item |
| Oracle Field Service in/out · booking · inventory · HR/WFM · forecasting · BI (M row, up to five) | Surfaces: the Sources strip, the six connectors, the mocked send, the "execution data received" history line |
| Region-specific rule sets and workflows (L row) · deployment | Surfaces: the Region select and the three regions in Settings; the "runs in the customer's own tenancy" note |
| Distance / live-traffic rules · within-day reassignment · urgent jobs · crews · spare-parts availability | **Not shown** — roadmap (○) in the matrix; crews appear only as "crews enabled" on another region |

Gaps found by the pass and closed before capture: the alternatives-considered
list on the feedback re-run (what-if), the workload-spread KPI, the forecast
connector named in the demand rule, the regions list. Nothing that would change
the flow, the screens or the information model.

### 19.6 What changed on the site

- `site/demo/workforce-optimization/` — `index.html`, `demo.css`, `demo.js`,
  `data.js`, on the Large docs pattern; the `?state=` switch is new.
- `config.js`: `demoUrl`, `demoPreviewUrl` and `videoPoster` on
  `workforce-optimization`; `content.js`: the four step images point at the
  `.jpg` captures (copy unchanged). Frames and poster per `ASSETS.md` §1; the
  four SVG illustrations deleted.
- `tools/capture-demo-frames.mjs`: clicks now work on SVG elements (a
  dispatched click where `.click()` does not exist), `W` / `H` viewport
  overrides, two scenarios — `capture-wfo-tour.json` (the tour by real clicks,
  the regression test) and `capture-wfo-frames.json` (frames and poster).
- **Artifacts.** The walkthrough stands alone at
  https://claude.ai/code/artifact/343ab0d5-1d99-4038-a395-6f177c3f5e2e; the
  site artifact was republished with the demo folder, the frames, the poster
  and the two data files. The staged copy of `site/index.html` is now stripped
  of exact wrapper lines only: the previous publish had also dropped
  `<header class="masthead">` (a prefix match on `<head`), which this publish
  restores, and the charset / viewport metas are now stripped as the handoff
  says.
- Docs: `README.md` ("The interactive walkthroughs", layout, preview links),
  `CONFIG.md` §3 (`demoUrl`, `demoPreviewUrl`, `videoPoster`), `ASSETS.md` §1,
  `HANDOFF-workforce-demo.md` (status); the wiki folded via `context-update`.

### 19.7 Still open — Alex's decisions

- **Which figures the walkthrough may carry.** The +4.5% productivity headline
  is the cleared median; the 65% → 68% capacity and 6.8 → 6.2 d wait deltas
  are synthetic companions — say if either should go, or if the one-pager's
  "~30 min vs ~2 days" time-to-plan claim (deliberately absent) should appear.
- The preview URL is the `/code/artifact/<uuid>` form; the Large docs one is
  the short `/artifact/<id>` form. Both resolve; paste the short form into
  `demoPreviewUrl` if a shorter link is wanted.
- The demo-video recording is still pending; the poster is a walkthrough still.

### 19.8 Round 2 — the value first (2026-09-16, same day)

Alex's review of the first cut: *"it didn't focus my attention on what actually
got optimized; I expected to see that the optimization clearly shows improvement
compared to current while letting me apply manual fixes and drill down."* The
first cut was a faithful screen tour — run, map, compare, KPIs, decisions,
export — with the gain buried in row-level before → after lines. The
generalised rule is now in `CLAUDE.md` (interactive demos): lead with the value,
then the drill-down, then the manual override.

What changed, all inside the same flow and information model:

- **The plan is now the uploaded allocation plus a set of named changes**
  (`data.js` `changes[]`, `plans.v1` / `plans.v2`). Each change carries the
  assignments it adds, the rule that produced it, the explanation, and an
  **additive KPI effect** (jobs per technician, wait time per zone). The engine
  computes every KPI from the current plan plus the applied changes, so an
  undone change takes its numbers and its assignments with it, and the flags
  are a function of what is applied (`flagsFor`): undo the vacation cover and
  "No cover during an absence" comes back; undo the Marsh End move and
  "Wednesday overload" reappears on Southbank.
- **A KPI band** is the first thing after a run: jobs per technician per day,
  capacity used, average wait and visits placed, each before → after with the
  delta in colour, and a fifth tile counting changes, zones and flags with the
  **Review changes** button. The tiles jump to the technician or zone view.
- **"What the solver changed"** sits beside the map: one row per change —
  rule, title, live effect line — with **Show** (opens the zone or technician
  on the map, jumps the schedule to the week, highlights the rows), **Undo /
  Restore** (the manual fix) and **Note**. A **Changes only** toggle narrows the
  map and the schedule to what moved; changed schedule cells are tinted; the
  optimized map's pills carry the zone's wait and its delta.
- **The tour was rebuilt around the value:** run → *review the improved metrics*
  (a passive step on the KPI band, advanced with Next) → *see where the gain
  comes from* → *drill into a change* (Eastfield's vacation cover) and compare
  with today → check the numbers per technician → *fix what the solver got
  wrong* (undo the Marsh End move by hand, note why, re-optimize around the
  fix) → accept the rest and export. The re-run applies the alternative the
  solver weighed.
- **Figures**, computed from raw means: current 4.54 → plan v1 4.76 (+4.8%)
  → after the manual undo +4.4% → plan v2 4.75, **+4.5%**, the cleared median;
  capacity 65% → 68%; average wait 6.8 → 6.2 d; visits placed 1,523 → 1,587 of
  1,631 booked. Every per-zone wait and per-technician count reconciles with
  the change that produced it.
- Frames and poster re-captured for the new dashboard (`ASSETS.md` §1); the
  tour regression scenario `tools/capture-wfo-tour.json` drives the new flow.

Work split, as Alex asked it to be decided: Fable designed the value-first
model, wrote the data model and the KPI/flag engine, the UI of the band and the
change list, and the tour; an Opus subagent re-captured and converted the
frames and poster, checked their legibility and updated the capture notes.

## 20. The site name — Oracle AI & Data Solutions, 2026-09-16

**Instruction** (Alex, 2026-09-16, in session): *rename site header as "Oracle AI & Data Solutions"*. The new name replaces *AI Agents on Oracle* (`HANDOFF` §6.1, §18.0) wherever the site states its name; the tagline, the H1 and every other string are unchanged.

| Where | Before | After |
|---|---|---|
| `index.html`: lockup text and its `aria-label` | AI Agents on Oracle | Oracle AI & Data Solutions |
| `index.html`: `<title>`, `og:title`, `twitter:title` | AI Agents on Oracle — SoftServe | Oracle AI & Data Solutions — SoftServe |
| `content.js`: `site.name`, `headerLockup.productName` | AI Agents on Oracle | Oracle AI & Data Solutions |
| `content.js`: `site.title`, which every page title is built from | AI Agents on Oracle — SoftServe | Oracle AI & Data Solutions — SoftServe |

**The lockup is static markup.** No script renders `headerLockup`: the header text is in `index.html`, so a rename edits both files. The README had called the name data only; it now names both places.

**Fit, measured in the in-app browser.** The name is 26 characters to the old 19 (239 px against 179 px at 20 px). No width overflows and the masthead stays 77 px tall, but two bands broke, and `assets/site.css` now has a step for each:

- **901–1023 px**, where the desktop nav first appears: the name ended 29 px short of *Products*, closer than the nav's own 32 px gap, so it read as a nav item. `.lockup-name` is 18 px in that band: 53 px clear at 901.
- **Phones up to 430 px**: at 15 px the name wrapped to two lines, against the one-line intent in `site.css`. The lockup now scales down in proportion there (wordmark 84 px, gap 8 px, rule 20 px, name 13 px): one line at 375, 390, 414 and 430, 26–81 px clear of the menu button.
- **Narrower than 375 px** it wraps to *Oracle AI & Data / Solutions*, as the old name already did at 360 and 320.

**Open: Oracle trademark usage.** Oracle's *Third Party Usage Guidelines for Oracle Trademarks* (https://www.oracle.com/legal/trademarks/) ask third parties not to use Oracle marks as all or part of a company, product or service name, and to show the relationship with a descriptive tag line such as *for Oracle* (read through a search summary of that page; oracle.com refused a direct fetch on 2026-09-16). A SoftServe site whose name leads with *Oracle*, and echoes the Oracle AI & Data organization that `HANDOFF` §3 names, can read as an Oracle property, which §3's no-implied-standing rule exists to prevent; *AI Agents on Oracle* had the tag-line shape. Shipped as instructed and raised with Alex the same day, with *AI & Data Solutions for Oracle* as the guideline-shaped alternative.

**Verification and publish.** `node --check` clean; `node tools/check-grammar.js` OK; the deny-list grep empty; console clean; the titles of `#/`, `#/products`, a product page, `#/services` and the not-found page carry the new name. Published as preview versions 26 (`index.html`, `data/content.js`, `assets/site.css`) and 27 (the page again, without the `<meta charset>` and `<meta name="viewport">` lines the artifact skeleton already has; `HANDOFF` §4 now strips both).

## 21. Round 6 — the Services page rebuild, 2026-09-16

**Brief** (Alex, 2026-09-16, in session): the Services page is poorly structured, too long, and has no narrative that holds across its screens. Rebuild it as a product marketer would — the audience and what it wants, the positioning of services as distinct from products, key messages that answer the audience's problem and differentiate, and a couple of screens — using *Oracle SoftServe EMEA Business Alignment July 2026*, *Oracle and SoftServe for Arrow* and *SoftServe AIDP Factory V2*.

**Work split.** Opus read the decks — plus *OCI AI Accelerators — GTM with productized solutions and services*, found beside them and the one source that separates packaged apps from packaged services — wrote the digest, audited the page, implemented, checked and published. Fable, in one pass: audience, positioning, key messages, screen plan and copy. The digest lives in the session scratchpad, not the repo; what the page takes from it is recorded here. (A background research agent stalled twice on its summary; the main session distilled the text it had already extracted.)

### 21.1 Audience, positioning, messages

- **Readers, in order:** an Oracle account executive or AI & Data solution engineer opening the page live on a call (*what does SoftServe add beyond what Oracle sells, and what can I promise about the engagement?*); an enterprise buyer on Oracle — CIO, CDO, head of data & AI, or the workflow owner — who has seen a product and asks what happens, who does the work, who runs it afterwards and how they will know it worked; channel and partner managers, served by the same copy.
- **Positioning:** products are the agents you start with; services are the team and the method that take one of them — or the one your workflow needs, and the governed data under it — from a proof on your own data to production in your Oracle tenancy, and keep it there.
- **Messages:** (1) Oracle provides the platforms; SoftServe builds, integrates and runs what sits on top, and the team that shapes the scope runs it after go-live, in joint teams with Oracle's AI & Data organization (ARROW s.4; the retired `whatWeDo.lead`, `whoYouWorkWith`, `whySoftServe[1]`). (2) Every engagement is built to reach production, one small, measured step at a time (GTM s.9; the retired ladder). (3) After go-live the customer chooses: a managed service, or its own team trained to run it (GTM s.9, s.13; the retired `wrapAroundServices`). (4) The customer will know it worked: the baseline is signed before the clock starts and both paths are scored the same way (the retired `proof.lead`, `howAPovRuns.steps[0]`, `whySoftServe[3]`).

### 21.2 The page, before and after (1440×900)

| | Before | After |
|---|---|---|
| Blocks | 9 — hero, stat band, platform cards, what we do, wrap-around services, how we engage, why SoftServe, how we measure it, contact | 3 screens + contact — hero with stat band and platform chips · how we engage, then after go-live · how we measure it (light band) · contact |
| Height | 7.7 screens | 3.8 screens (2.7 above the contact block) |
| Words above contact | 1,266 | 496, labels and chips included |
| Step names | Proof of value / Roll-out / Scaling, while the home said Jumpstart proof of value / Integration / Scale | the home's names, enforced by the checker |

### 21.3 Where the new strings come from

Every claim was already on the site or is public-safe in the decks; nothing needs clearance. `hero.headline` adapts ARROW s.1 (*From Oracle AI Platform To Repeatable Outcomes*); `hero.lead` adapts the retired `whatWeDo.lead` (ARROW s.4) and `overview.twoWays.panels[1].body`; `hero.secondParagraph` adapts `whoYouWorkWith`, `whySoftServe[1]` and `overview.delivery.why.pillars[0]`; `hero.stats` keep the cleared values (FACTORY s.4). `howWeEngage.steps[].title` and `.fact` are verbatim `overview.delivery.steps[]`; the bodies adapt the retired ladder's `whatItIs` and `ladderRules[1]`; `howWeEngage.footnote` adapts `ladderRules[0]` + `ladderFootnote`. `afterGoLive` adapts `wrapAroundServices` (GTM s.9, s.13). `proof.lead` adapts the retired `proof.lead`, `howAPovRuns.steps[0]` and `whySoftServe[3]`; `proof.stat` and `.cta` are verbatim, `.footnote` tightened, `proof.eyebrow` is the home link's label. New copy: `howWeEngage.title`, `afterGoLive.title`, `proof.title`. `shared.engageLink.label` drops *packages* (internal vocabulary) and takes the step names.

**Opus edits to Fable's copy** — for the repetition rule (no content word three times on one screen) and by Fable's own trim order for a body over ~450 words:

| Key | Fable | Shipped | Why |
|---|---|---|---|
| `hero.platformsTitle` | Oracle platforms we build on | Delivered on | *platforms* and *build* each 3× on screen 1 |
| `hero.stats[1]`, `[2]` labels | active projects in that practice · Fortune 500 clients in that practice | active projects · Fortune 500 clients | *practice* 3× in the band; the first label sets the scope |
| `afterGoLive.panels[1].bullets[0]` | OCI and NVIDIA training and certification, plus training on the solution itself | OCI and NVIDIA certification, plus training on the solution itself | *training/trained* 3× in the panel |
| `afterGoLive.panels[0].body` | The production system under SLA, kept running and re-tuned by the people who built it. | Your agents in production, under SLA, kept running and re-tuned by the people who built them. | *system* 3× in the section; echoes the H1 |
| `proof.lead` | … before the clock starts, with source access approved in writing. | … before the clock starts. | trim 1 (the body measured 517 words) |
| `hero.secondParagraph` | … runs it after go-live, or trains yours to. | … runs it after go-live. | trim 2 |
| `afterGoLive.panels[].bullets[2]` | A periodic accuracy, KPI and cost review · Knowledge transfer and runbooks | — | trim 3 |

### 21.4 What left the page, and where it survives

The *4 Oracle platforms* stat (a count of scaffolding; the platforms stay as chips) · the platform cards' `short`/`long` copy (engine detail lives on each product's Technology tab) · the seven application families (the Products page's patterns) · the solution stack (product pages) · the proof-of-value team roster (a scoping-call answer) · *what attaches to every engagement* (the home pillar *Agentic-AI experience*) · the Connect and Model-and-guard steps of *how a proof of value runs* (product Jumpstart tabs) · the *engagement by engagement* method lines (the home case-study footnotes) · the hero's quiet *Browse the products* button (the nav carries Products; `site.secondaryCta` retired) · **the €300–500K roll-out band** · **the Databricks and Snowflake partner lines and the AI-driven SDLC paragraph** (both now off the site; restorable).

### 21.5 Code and checks

`pages/services.js` is rewritten on the home components (`home-head`, `ladder3`, `ways`, `light-band`); `assets/site.css` gains the two-line H1, the platform chip row, a three-column stat band above 900 px, the after-go-live spacing and the proof band's stat and note. `tools/check-grammar.js`: `services.proof` leaves the C2 block for a round-6 block that asserts the new shape, the step names against `overview.delivery`, two after-go-live panels without CTAs, the retired keys, the routes that land on `#how-we-engage`, `#proof` and `#contact`, and no *package* in `shared.engageLink.label`. `site.dividerLabels` and `shared.ladderColumns` had no other renderer and are gone.

Verification: `node --check` clean; checker OK; deny-list grep empty; console clean; no horizontal overflow at 375; the Jumpstart tab link and `#/services#how-we-engage`, `#proof` and `#contact` all land.

### 21.6 Open for Alex

1. The €300–500K roll-out band is off the page (HANDOFF §3's no-€ rule; the GTM deck marks it illustrative). Restorable as `howWeEngage.steps[1].fact`.
2. The Databricks/Snowflake partner credentials and the AI-driven SDLC paragraph are off the site. Restorable as one clause each.
3. Two product Jumpstart blocks still say *"100% of the fee credits into a roll-out signed within 90 days"* — a commercial term that names the old step; left as written.
4. Deck proof points usable once cleared: an enterprise agentic AI platform at scale (response accuracy 42% → 91%, 3M+ users) and a GenAI knowledge graph (5–10× faster research) — FACTORY s.15, s.17.
5. The decks disagree on durations (proof of value about two vs three months; integration 3–5 vs 6 months); the site keeps its published *30–45 days to about two months* and *3–5 months*.

### 21.7 Layout QA and the short headings (2026-09-16, same day)

**Asks** (Alex, in session): *"Do QA of the page layout as a UI web designer. fix it"*, then, looking at version 28's hero: *"don't u think it's too long of a heading? rethink headings pls"*. Opus ran the QA and the fixes; Fable rewrote the headings in one short pass, to length budgets measured on the page.

| Finding (version 28) | Fix (version 29) |
|---|---|
| The H1 kept the product-title scale (84 px at 1440) with its 20ch cap removed, so two sentence-long lines ran the full width | The home H1's scale, `clamp(2.25rem, 3.9vw, 3.75rem)`, and `min(2rem, 8.6vw)` below 480 px; two lines from 320 to 1440 |
| The hero copy sat outside `.product-hero-copy`: no gaps between eyebrow, H1, lead, subline, chips and button, and no measure | Wrapped like every product hero; 1.25rem rhythm; lead and subline on one 44rem measure |
| The stat band had three columns but not the strip's geometry: dividers stopping under the labels, no bottom padding | Shares the home strip's rules through `.services-stats` / `.services-stat-band` beside the `--home` selectors |
| The step track ran full width in small print, and squeezed into three 224 px columns at 768 | Body-size steps; the track turns vertical below 900 px |
| Teal four times on S2 (eyebrow, first dot, two panel marks), against one accent per screen | The after-go-live marks are neutral |
| The one proof figure was set as a 35 px tile value with a bold small label | A 44–64 px anchor with a regular-weight label |
| On a phone the wrapped band link stranded its arrow at the right edge under a full-width rule | Inline in a paragraph with a text underline |
| The contact paragraph printed twice (`services.contact.sub` is `forms.contact.sub`) | The form column renders no sub on Services |
| One-word last lines in the panels | `text-wrap: pretty` on the page's running text |

**Headings, before → after** (budgets: H1 ≤ ~24 characters a line, two lines; H2 ≤ ~30 characters, five words; light-band title ≤ ~28 characters; no word repeated across headings):

| Key | Before | After |
|---|---|---|
| `hero.headline` | FROM ORACLE’S PLATFORMS / TO AGENTS IN PRODUCTION. | FROM PLATFORM / TO PRODUCTION. |
| `howWeEngage.title` | Prove it small. Take it live. Extend it when you’re ready. | Each step earns the next. |
| `afterGoLive.title` | We run it, or your team does. | Our team, or yours. — Fable's alternate, chosen because it follows the panel order (managed service, then your own team) |
| `proof.title` | Signed before we start, scored like for like. | Signed before we start. |
| `contact.heading` | Let’s talk | unchanged |

Read together the headings are the page's spine — destination, method, who runs it, how you'll know, first move — and the leads under them are unchanged. One Opus copy edit followed: with *Each step earns the next.* on the screen, *step* and *next* each landed three times on S2, so `howWeEngage.steps[0].body` ends *"a costed expansion plan at the end"* instead of *"a costed plan for the next step at the end"* — the wording of `overview.delivery.why.pillars[2]`.

**Verification:** checker OK; deny-list grep empty; console clean; no horizontal overflow at 320, 375, 414, 768, 1024 or 1440; every heading on one line at 1440 and two at most at 375; the repetition check clean on every screen. Page height 4.0 screens at 1440 (hero 656 px). Published as preview version 29.

---

## 22. The third walkthrough — Cross-system ERP Q&A, 2026-09-16

_Numbered 22, not 20: the handoff was written when §19 was the last section, and
two other sessions took §20 (the site rename) and §21 (the Services rebuild)
while this build ran. The shared working tree makes that collision routine —
check the numbering before appending._

### 22.1 Brief, sources, machine

- Alex's brief: repeat the walkthrough exercise for the Cross-system ERP Q&A
  pack, to the standing requirements in
  `.claude/references/interactive-demo-playbook.md` — the real product's flow,
  screens and information model; customer-agnostic and industry-neutral on
  synthetic data; no integrations and no real inputs; six guided steps with one
  active control each; **value first**, with a step that pauses on the improved
  metrics; every synthetic figure listed. The build spec is
  `docs/HANDOFF-erp-qa-demo.md`; the decisions Alex took on it are its §0.
- **This is the first walkthrough with no delivered product behind it.** Large
  docs and Workforce optimization were reconstructed from recordings of real
  engagements. Here there is no engagement, so the thing that must be
  recognisable is the **platform**: Oracle Autonomous AI Lakehouse (Data Studio)
  and Oracle AI Data Platform (Agent Hub). Everything on screen had to be built
  from Oracle's own published product material.
- **Three research briefs** (Opus, session scratchpad `.work/erp-qa/`):
  `brief-A-pack.md` — the pack as pitched (scope, S/M/L rows, the feature
  matrix); `brief-B-ui.md` — what the two products actually are, a UI inventory
  and measured style tokens; `brief-C-workflows.md` — where cross-system
  questions arise in a multi-ERP group, the seven mappings, candidate workflows.
- **Seven official Oracle videos** (fetched with the yt-dlp standalone macOS
  binary from its official GitHub release, no sign-in; 100 native key frames,
  566 index frames and 31 contact sheets cut by a Swift/AVFoundation tool into
  git-ignored `.work/erp-qa/video/`, 268 MB): *Access Data from Anywhere with
  Oracle Autonomous AI Database Catalog: Demo* (Oracle, 2025-10-14, `XubFc-QHgsc`);
  *Short demo Ask Oracle App powered by Select AI* (Autonomous Database PM Team,
  2025-11-14, `p595Io2cxyw`); *Build AI Agents with Oracle AI Data Platform: Demo*
  (Oracle, 2025-11-25, `hpjnIXpOd0E`); *How to Use Master Catalog, Workspace, and
  Compute in Oracle AI Data Platform* (Oracle, 2026-06-17, `3f-7RdriJ3Y`);
  *Oracle AI Data Platform: Lakehouse, Analytics, and Agentic AI Demo* (Oracle
  Developers, 2026-07-22, `ObsHJhduwwE`); *Autonomous Database Speaks "Human"
  using Select AI* (ADB PM Team, 2023-09-26, `htVeX8loT6c`); *Autonomous Database
  Data Studio Demo* (Oracle, 2023-11-06, `y1khmdbmze4`). The reading of them is
  `.work/erp-qa/ui-anatomy.md` (704 lines).
- **A second source pass**, after Alex's "search better + find decks with
  screens, as it is essential to follow the UI of existing products": the
  469-page *Using Oracle AI Data Platform Workbench* guide (rev. G50054-32,
  10 Sep 2026) as PDF, whose chapter 28 "Lineage (Preview)" has an HTML page
  carrying 14 clean product figures; *How Auto Populate Catalog Simplifies
  Metadata Management in AI Data Platform Workbench* (`lzxNqDYzd3o`) for the
  auto-populated catalog metadata and its Reviewed-entities accept/reject queue;
  *Integrate, Load and Analyze all your data with ADB Data Studio* (51 min,
  `6fPVgyAvBqY`) for Data Insights, Data Load with the Live Feed sub-nav,
  Connections, Data Transforms job runs and the Catalog lineage overlay; the
  Data Analysis natural-language "Generate Query" doc figures; an APEX 24.2
  video (`kjeQ2AC3TFo`) for real Redwood Light app chrome; and the Redwood
  design tokens read out of Oracle's own
  `static.oracle.com/cdn/apex/26.1.0/themes/theme_42/24.2/css/Redwood.css`,
  cross-checked against Oracle JET (`.work/erp-qa/redwood-kit.md`, 678 lines).
- **Method note worth keeping:** Oracle's OCI documentation sites build their
  tables of contents in JavaScript, so link crawling misses whole chapters. The
  lineage chapter and its figures — which a three-level crawl never found — came
  from downloading the book PDF, grepping its text, and then fetching the HTML
  page of the one chapter that mattered.
- Machine: the same MacBook Air as §19 — no Homebrew, no ffmpeg, no Node on the
  PATH; Node from `/Applications/Codex.app`, crops and JPEGs from `sips`.

### 22.2 The architecture decision, and why

The pack sells plain-English answers across systems. Neither Oracle product
does that alone, so the demo shows the pair, plus one small app:

- **Autonomous AI Lakehouse (Data Studio)** covers the data layer — catalogs
  mounted over the sources, continuous feeds, certified views, Select AI, the
  SQL Firewall — but ships no business-user Q&A surface and cannot show
  cross-system lineage inside an answer.
- **AI Data Platform (Agent Hub)** adds the conversational surface, the
  text-to-SQL agent with a trace tree, the Master catalog and column-level
  lineage.
- **Neither has a human review queue for entity resolution.** The steward's
  confirm/reject therefore lives in a small Redwood-styled app, "Mapping
  review" — which is Oracle's own answer to "you need a custom UI on the
  lakehouse" (APEX), not an invented product.

Alex's call on the handoff's Q6: the three surfaces are demoed as **three
apps**, and switching between them is part of the demo. Each keeps its own
look; a slim neutral workspace switcher sits above them and must read as a
launcher, never as part of any product. Oracle product names and interfaces are
expected here (playbook rule 2 as corrected on 2026-09-16: "not no Oracle marks
— no specific customer marks"); no Oracle logo file is used, because none is
cleared.

### 22.3 The world and the data model

A fictional multi-entity group in Q3 FY2026, close in progress, "today"
Tue 6 Oct 2026 09:40. Three operating entities on three ERPs after two
acquisitions — Oracle Fusion Cloud ERP, JD Edwards EnterpriseOne 9.2,
NetSuite — plus an in-house Oracle Database application for contracts and
rebates and a non-Oracle CRM as Iceberg tables. The object names on every
screen are each system's real ones (`AP_INVOICES_ALL`, `POZ_SUPPLIERS`,
`GL_DAILY_RATES`; `F0411`, `F0101`, `F0911`; NetSuite `vendor`,
`transactionLine`), and the feeds are the real mechanisms (a prebuilt Fusion
pipeline, GoldenGate CDC, SuiteAnalytics Connect, a database link, an external
table). Three personas: a group controller (the tour's user), a finance data
steward who owns Mapping review, and a regional analyst whose role is the
governance proof in step 6.

The content of the model is the **seven mappings** a multi-ERP group actually
has to reconcile (brief C): chart of accounts → group account; legal entity /
business unit / JDE company; party identity across the three vendor masters;
item cross-reference; currency and rates; calendar and period (JDE's fiscal
year opens in July, so JDE period 3 is calendar September); document types and
status codes. Thirteen `GOLD` certified views carry them, each with an owner, a
definition line and a last-changed date.

Every number on screen is computed in the page from the arrays in `data.js`
(115 KB) — nothing is typed into the markup — and
**`tools/erp-qa-check.js` (267 assertions) reconciles them**: the health band,
the two queues, the answers and the consolidated P&L have to agree before and
after the steward's fix. Deviations the data model forced, all accepted and all
documented in the handoff §12: the freshness stamp is computed per question
from its own sources rather than being one global time; the analyst's answer to
question 1 is 5 rows before the fix and 4 after, because the disputed record
sits in the analyst's own entity until it is split; the 25 pending proposals
cover 28 records; a documented provisional threshold of 0.85 rolls a proposal
up provisionally and flags it, which is what makes "12 rows, one flagged for
review" true; only 12 of 67 confirmed cross-system clusters answer question 1,
because the `HAVING` is on the quarter's invoices, not on master data; account
decisions are logged but do not move the P&L — only the match decision
recomputes the band.

### 22.4 The three surfaces — what is a real screen and what is free design

| Surface | Replicated from | Free design, in the product's idiom |
|---|---|---|
| **Data Studio** — continuous dark L-shell, left nav, Catalog with mounted-catalog chips, entity-type pills, Filters facets, grouped results with initials avatars and "Updated N min ago"; Data Load › **Live Feed**; **Analysis** with the natural-language "Generate Query" field | The 2026 and 2023 videos plus the Data Analysis doc figures; every nav label is Oracle's own | The **Live Feed job card** for the model rebuild. Oracle shows the two entry points to continuous ingestion but never opens the feed list itself, so the card — sources, stages, "Run now" — is ours, drawn in Data Studio's idiom |
| **Agent Hub** — cooler dark top bar over a light nav, serif greeting, prompt box, saved-question chips, the agent card, the answer anatomy (row-count and freshness line → result grid → Explore / Explain / Code View / Trace chips → Narrate), Master catalog entity pages with per-column descriptions, **column-level Lineage** (impact analysis, `AGGREGATION / IDENTITY / TRANSFORMATION`), Auto-populate catalog with its Reviewed-entities queue, Insights, Sessions | The 2025–2026 AIDP videos and the Workbench guide; **lineage is built to the letter of chapter 28's figures** | The **per-row source badge** column on an answer, and the drill panel behind Explore. Oracle evidences the grid and the action chips, not a badge that names the system each row came from |
| **Mapping review** — white header, light page, Redwood buttons, dense tables, the health band, the two queues and the decisions log | The Redwood tokens read out of Oracle's own APEX theme CSS and cross-checked against Oracle JET; chrome from an APEX 24.2 video | The whole app: no Oracle product ships an entity-resolution review queue. Its shape is borrowed from the one accept-or-reject pattern Oracle does ship — the Reviewed-entities queue in Auto-populate catalog |

The three surfaces deliberately do not share chrome: the two products invert it
(Data Studio is a continuous dark L with a right-aligned search; AIDP is a dark
bar over a light nav with a centred search), and Oracle red is never used as a
button fill. Two Oracle builds exist for most of these screens and their colour
systems do not mix, so each screen follows one build.

### 22.5 The semantic-layer honesty decision

The first cut gave Agent Hub a **business glossary** panel — terms, synonyms,
ontology — because the marketing copy for AI Data Platform describes one. The
second source pass looked for it in the 469-page product guide and found
**zero** occurrences of glossary, ontology, taxonomy, AI-generated synonyms or
data products. What the product actually ships is auto-populated **catalog
metadata**: a per-column Description a person accepts or rejects, which is what
the text-to-SQL agent reads.

So the demo dropped the glossary panel and rebuilt the mechanism as it really
is — catalog entity pages with column descriptions, the Auto-populate catalog
review queue that produced them, and a trace span named *"Terms resolved from
catalog descriptions"* rather than *"Glossary terms resolved"*. The underlying
data array kept its historical `glossary` key names (the reconciliation script
asserts on them); every label a viewer reads says catalog description. Two
related corrections from the same pass: Select AI Agent is PL/SQL only, with no
designer in Database Actions, so none is shown; and the Data Analysis screen
uses the real "Generate Query" field.

### 22.6 The tour

Six steps, value first, each allowing exactly one control; Skip auto-performs;
every other click is guarded.

1. **Rebuild the model** — Data Studio › Live Feed, "Run now": five stages
   (sync sources · resolve supplier identities · map accounts to the group
   chart · translate and reconcile ledgers · rebuild certified views and
   refresh the SQL Firewall allow-list), then a toast that opens Mapping review.
2. **Review the improved metrics** — a **passive step** on the health band,
   with a Next control: what got better and why.
3. **Ask across systems** — Agent Hub, the saved question *"Which suppliers do
   we pay from more than one system, and what did we pay them last quarter?"*;
   the answer renders with a source badge on every row and a freshness line.
4. **See where each figure comes from** — open the **Trace** (parse → terms
   resolved from catalog descriptions → SQL generated → SQL Firewall check →
   executed, rows and ms → answer composed, with the allow-list, row-policy and
   masking lines), then **Explore** the flagged row down to the two source
   records behind it and the evidence the model matched them on.
5. **Fix a mapping by hand** — Mapping review: reject the wrong match with a
   reason, which leaves a learned rule and a decision row, then **Re-run
   resolution**; the band, the duplicate list and the affected answers all move
   together.
6. **Prove the governance and hand off** — back in Agent Hub the same question
   now returns one row fewer; **View as** the regional analyst re-runs it under
   a row policy and column masking enforced in the database; **Publish as
   certified view** closes it. The end card names what is still open for free
   exploration, including the saved question that the SQL Firewall refuses
   outright for the analyst.

### 22.7 Figures — every synthetic number

**No cleared outcome figure exists for this pack** (the site ships `null`
metrics for it), so the band carries coverage and counts only: no
time-to-answer, no saving, no price, no delivery-time claim. All of the
following are invented and computed in the page:

- 412 supplier records (188 Fusion · 131 JDE · 93 NetSuite) · 216 golden
  parties · 61.2 % → 93.2 % → 93.7 % resolved · 212 proposals (187
  auto-confirmed, 25 → 24 pending, covering 28 records).
- 497 local accounts (214 · 186 · 97) → 120 group accounts · 37 → 0 unmapped
  (35 by rule, 2 queued for review).
- Ledgers tying to their trial balance 1/3 → 3/3 · residual before the rebuild
  USD 1,705,680.62, 0.00 after.
- Duplicate-payment pairs 14 → 13 · exposure USD 216,410 → 195,320.
- Consolidated Q3 P&L: revenue 48.6 M USD (27.9 · 13.2 · 7.5), COGS 31.1 M,
  gross margin 17.5 M, opex 11.5 M, EBITDA 6.0 M.
- Source freshness 12 / 4 / 38 / 2 / 65 minutes · 13 certified views · 10 saved
  questions.
- Answer sizes: question 1 returns 12 → 11 rows for the controller and 5 → 4
  for the analyst; its spend total USD 8.6 M → 7.9 M.
- Other saved questions: rebate entitlement USD 13,539.92 on 5 terms; O2C open
  value USD 588,250; paid-since USD 315,700; intercompany unmatched gap
  USD 46,800; top-20 share 30.6 %.

### 22.8 Red-team, the fix round and the copy pass

The first cut was red-teamed against the pack specs, the site's own copy and
the playbook (14 frames plus a copy scan). It **passed** on: three distinct,
recognisable surfaces; the band and the passive metrics step; per-row source
badges; a trace carrying the firewall and policy lines; drill-down to real
object keys; a rejection that recomputes the band, the duplicates and the
answer; a row-limited and masked analyst view; all seven of the site's listed
features visible; no banned name, no currency symbol beyond a column header, no
time-to-answer or savings claim anywhere.

Fixed before capture: health-tile notes truncated mid-word; a step callout that
covered the very tile its copy described; wide answers showing seven of
twenty-six rows; clipped dashboard labels; plus the second-pass corrections of
§22.5 (the real catalog entity page and lineage instead of the invented
glossary panel, honest semantic-layer wording, real Data Load labels, a real
Data Analysis screen, and Mapping review restyled to the measured Redwood kit).

A final **copy-hygiene pass** removed every on-screen note that talked about
evidence, sources or design provenance — where a screen came from, what Oracle
does or does not ship, what is "our design in the product's idiom". That
material belongs in this file, not in front of a prospect. Four notes were
trimmed (the Live Feed job-card aside, the Explain panel's semantic-layer note,
the catalog entity-page footnote and the Reviewed-entities note); the notes a
viewer needs — "Demo data only", "Static in this walkthrough", "Mocked run — no
job is submitted and nothing is written back", the pending-review caveat —
stayed.

### 22.9 What changed on the site

- `site/demo/cross-system-erp-qa/` — `index.html`, `demo.css`, `demo.js`,
  `data.js`: three `<section data-app>` panels under one switcher, the tour
  engine and URL switches carried over from the Workforce optimization
  walkthrough.
- `tools/erp-qa-check.js` (the reconciliation script),
  `tools/capture-erpqa-tour.json` (the whole tour by real clicks — the
  regression test, `LOGS: none` is the gate) and `tools/capture-erpqa-frames.json`
  (the four step frames and the poster).
- `config.js`: `demoUrl` and `videoPoster` on `cross-system-erp-qa`;
  `demoPreviewUrl` stays empty until the standalone artifact exists, and
  `video` stays `false`. `content.js`: the four step images now point at the
  `.jpg` captures — **the step copy is unchanged**, by Alex's decision.
- The four `cross-system-erp-qa-*.svg` illustrations deleted; the four captures
  and the poster added, per `ASSETS.md` §1; `manifest-edits.json` updated to
  match.
- **Stills `-3` and `-4` re-cut 2026-09-17** to match the step copy rather than
  the tour order. The first cut put the steward's recomputed band under step 4,
  *"Ask in plain language"*. `-3` is now **Guard it in the data layer**: the
  same question answered as Marcus Bell, regional analyst NA — the "Viewing as"
  chip, "Total rows: 4", four JDE rows in a "Q3 spend, NG-NA (USD)" column, and
  the banner "Rows are limited to NG-NA by the row policy; BANK_ACCOUNT
  redacted · TAX_ID partially redacted". `-4` is now **Ask in plain language**:
  the controller's answer at `state=final` — "Total rows: 11 · Displayed: 11 ·
  as of 09:02 (stalest: NetSuite, 38 min behind)", the three `GOLD` views, and
  seven of the eleven rows with their Fusion / JDE / NetSuite badges. Both come
  from a new **868 px** viewport, where the answer card is exactly 640 CSS px
  wide, so the crop holds the whole card with nothing clipped left or right;
  the scenario file drives `-3` with `setRole('ANALYST_NA')` instead of the
  `decide` / `rerun` pair the old `-4` used. Two elements were tried and
  dropped because they cannot fit 640 × 400 without cutting text — the Trace
  panel in `-3` (its row-policy and masking spans sit 109 px past the frame)
  and the question bubble in `-4` (the frame then ends inside *Ravenscourt
  Electrical*); the measurements are in `ASSETS.md` §1. `-1` and `-2` were not
  re-shot.
- Docs: `README.md` (the third walkthrough, the layout, the preview-links
  table), `CONFIG.md` §3, `ASSETS.md` §1, this section, and the Done block of
  `HANDOFF-erp-qa-demo.md`.

### 22.10 Verification, its limits, and what stays unevidenced

- `node --check` clean on `demo.js`, `data.js`, `config.js` and `content.js`;
  `node tools/check-grammar.js` OK; `node tools/erp-qa-check.js` 267 assertions
  passing; the tour scenario replayed at 1440 × 900 after the copy pass with
  `LOGS: none` (no console error, no exception, and the scenario's own
  assertions — no horizontal page scroll, six band tiles unwrapped and
  unclipped, no callout covering the element its copy names — all held).
- The product page was verified headlessly on `file://` at 1440 × 1000: the
  four step images load and render on their own steps (1600 × 1000 each), the
  poster file loads (1600 × 900), the "Try the interactive demo" button points
  at the relative `demo/cross-system-erp-qa/index.html` and opens a new tab,
  and the page has no horizontal overflow. Screenshot kept at
  `.work/erpqa-qa/product-page.png`.
- **Limits.** The captures are scripted headless Chrome at four viewports, so
  they prove the layout at those widths and no others; the Chrome extension
  cannot click inside an artifact's iframe, so the published artifacts are
  verified by eye in the viewer, not by automation. `demoPreviewUrl` being
  empty means the demo button is knowingly broken **inside the site's own
  artifact preview** until the standalone demo is published.
- **What stays unevidenced, and is therefore a considered reconstruction rather
  than a replica:** the Agent Hub conversation detail (no public video opens a
  finished conversation), generated SQL shown inside an answer, and the Live
  Feed list itself. Each is drawn in the product's idiom and is named here so
  nobody later mistakes it for a screenshot of a shipping screen.

---

## 22 · round 2 — the third walkthrough rebuilt: revenue at risk across systems, 2026-09-17

_Same four files, same tour engine, same three surfaces. Everything the demo is
about changed: the domain, the AI framing, every hint, every number and all five
images. Round 1 above is kept as the record of how the surfaces were built; this
part records what replaced their content and why._

### 22.11 Alex's feedback, and the root cause

Alex watched the shipped walkthrough and named four things: the AI was felt in
**one step only** (the question), everything around it read as ETL and admin;
the opening should be about **the list of integrated sources**, not a job run;
the steps were technical clicks rather than a business task; and "reconcile the
close for an accountant" is not an AI-native job and carries no high-ROI
promise.

The root cause, stated for the next build: **the AI did its hardest work behind
a progress bar** (a model refresh) **and showed its reasoning where the work was
cheapest** (a question → a table). The rule that replaced it: the AI must be
seen reasoning at every step — scanning all systems, ranking by business impact,
attributing a cause that sits in a different system from the symptom,
recommending actions, recomputing when a person overrules it, and leaving
artefacts people use. The promise is an outcome (revenue protected), never hours
saved; every hint title is a business sentence in the user's words, and no hint
says refresh, model, mapping, view or SQL.

### 22.12 The decisions taken with Alex

In a decision widget, before the spec was rewritten:

- **The spine is revenue at risk across systems** — the site's own
  decision-domain example for this pack (order-to-cash exceptions), not the
  finance close.
- **The human override is the business user's, not the steward's.** Dana
  declines one AI recommendation and re-analyses; the steward's identity queues
  stay, but in free exploration.
- **The fifth and fourth sources changed** (Alex, after the first draft: "could
  contracts be one of the Fusion apps?"): customer contracts and service levels
  come from **Oracle Enterprise Contracts in the same Fusion tenancy**, and the
  in-house Oracle Database application becomes a **delivery-tracking**
  application (shipments, carrier scans, exceptions). The non-Oracle CRM stays.
- **The closing step is an AI-generated dashboard**, viewed under the analyst's
  role before it is shared — so the governance proof (row policy, masking,
  firewall) sits inside step 6 instead of owning a step of its own.

### 22.13 The world, the sources and the objects

Norwell Group, Tue 6 Oct 2026, 09:40, week of Mon 5 – Fri 9 Oct. **Dana
Whitfield, VP Commercial Operations** (`COMMERCIAL_OPS`, every region,
unmasked); **Marcus Bell, Regional operations analyst, North America**
(`ANALYST_NA` — rows limited to `NG-NA`; CRM contact e-mail and telephone,
credit limits and contract penalty terms masked in the database); **Priya
Natarajan**, data steward (`STEWARD`), who owns the identity queues. SQL
Firewall allow-list `OPS_QA_V2`.

The five sources keep round 1's feeds and freshness and change their objects:

| Source | System | Objects in play | Feed |
|---|---|---|---|
| Norwell Europe (`NG-EU`) | Oracle Fusion Cloud — SCM/ERP **and Enterprise Contracts** | `DOO_HEADERS_ALL`, `DOO_FULFILL_LINES_ALL`, `INV_ONHAND_QUANTITIES_DETAIL`, `EGP_SYSTEM_ITEMS_B`, `HZ_PARTIES`, `HZ_CUST_ACCOUNTS`, `PO_HEADERS_ALL`, `PO_LINE_LOCATIONS_ALL`, `AR_CUSTOMER_PROFILES`; `OKC_K_HEADERS_ALL_B`, `OKC_K_LINES_B`, `OKC_K_ARTICLES_B` | prebuilt Fusion pipeline, 12 min behind |
| Norwell North America (`NG-NA`) | JD Edwards EnterpriseOne | `F4201`, `F4211`, `F41021`, `F4101`, `F4104`, `F0301`, `F0101`, `F4311`, `F03B11` | GoldenGate CDC, 4 min |
| Arden Services (`NG-SV`) | NetSuite | `transaction` (`SalesOrd`), `transactionLine`, `item`, `customer`, `inventoryBalance` | SuiteAnalytics Connect, 38 min |
| Delivery tracking | in-house Oracle Database 23ai, schema `DLV` | `DLV_SHIPMENTS`, `DLV_SCAN_EVENTS`, `DLV_EXCEPTIONS` | database link, 2 min |
| CRM (non-Oracle) | Iceberg external tables | `CRM_ACCOUNT`, `CRM_CONTACT` | external table, 1 h 05 min |

Fourteen `GOLD` certified views carry the model: `CUSTOMER_360`, `ITEM_XREF`,
`OPEN_ORDER_LINES_X`, `PROMISE_STATUS`, `STOCK_POSITION`, `LATE_CAUSES`,
`SUPPLIER_DELAYS`, `CREDIT_HOLDS`, `TRANSIT_STATUS`, `SLA_EXPOSURE`,
`REVENUE_AT_RISK`, `ACCOUNT_EXPOSURE`, `RECOMMENDED_ACTIONS`, `DECISIONS`, each
with an owner, a definition and an upstream list that the Lineage screen draws.
**The penalty is not a column anywhere**: the AI reads "0.5 % of the line value
per business day, capped at 10 %" out of the clause text in `OKC_K_ARTICLES_B`
and applies it to the business days each line is late — which is why the
exposure lands at USD 185,984, not a round 186 k.

### 22.14 The analysis — the object the whole demo is built on

One saved question — *"Which open orders are at risk this week, and which of our
best accounts are exposed?"* — runs four agents (order, identity, cause, impact)
over about six seconds, each with its own sub-steps and tool list, and returns
one object: a headline (**138 open lines, USD 4.18 M, 9 tier-A accounts carrying
USD 2.36 M, USD 186 k of contract penalties**), a six-tile band that reads *per
system → across systems*, four causes that add back to the headline (stock
available elsewhere 44 lines / USD 1.52 M — the cross-system finding, the
symptom in one system and the stock in another; late in transit 45 / 1.11 M;
supplier late 31 / 0.94 M; credit hold 18 / 0.61 M), the accounts ranked by what
is at stake, and four recommended actions with an owner, a value and a task
count. **Nothing is ever written to an order system**: each action becomes a
task for the person who owns it, and the screen says so.

Evidence for any account opens the lines in the systems they live in (with the
real key in each: `F4211 · SDDOCO/SDLNID`, `DOO_FULFILL_LINES_ALL ·
FULFILL_LINE_ID`, NetSuite `transactionLine`), the same part on hand in another
plant under a different item number matched through `GOLD.ITEM_XREF`, the CRM
tier and owner, the contract and the clause the penalty was read from, and
whichever of the late purchase order, the credit hold or the carrier scans is
the cause.

### 22.15 The tour, round 2

Six steps, every title a business sentence: **1** everything you run on, in one
place (a passive stop on the five source cards in Live Feed — the tour no longer
runs a model refresh at all; the job card stays for free exploration) → **2** ask
the AI what is at risk this week (the saved question, the run card playing) →
**3** read what the AI found (passive: band, causes, ranked accounts, actions) →
**4** check one finding before you trust it (Evidence on Halden Tooling Group,
then Trace) → **5** overrule the AI where you know better (Decline with the
drafted reason in the Decisions app, then Re-analyse) → **6** give the team a
dashboard, safely (Create dashboard → View as Marcus Bell → Share). The end card
separates what the AI did from what Dana decided, and points at the free
exploration: the steward queues, the blocked question, the lineage.

### 22.16 The API contract, and the deviations from it

The data layer (leg E1) implements the contract in `HANDOFF-erp-qa-demo.md` §R6
on `window.ERPQA_DATA`; the full notes are `.work/erp-qa/round2-api-notes.md`.
Accepted deviations: `analyse(decisions, role?)` takes an optional role that
changes only the firewall and policy lines (its figures are always the group's);
`fmtM` returns two decimals, because every figure in the spec carries two;
`maskText(value, kind)`; trace rows carry `agent` and `tools[]`; action A2
reports **6** tier-A accounts, not 9 — the ninth is Halden, whose cause is stock
elsewhere and whose action is A1; a decided account **keeps its row** with
`status: "accepted"` and its previous figures, and is excluded from the
headline, the band, the causes and the actions; `orderLines[]` holds 142 rows —
the 138 at risk plus 4 on-track lines that let an account be seen trading in two
systems; only a decline recomputes (an accept logs the task and says the money
does not move until the transfer runs); lineage lives in `views[].upstream`;
roles are `COMMERCIAL_OPS` / `ANALYST_NA` / `STEWARD`; `world.week` replaces
`world.period`.

The UI leg (E2) deviated from §R4–R5 in five places, all kept: the Live Feed
**Run now** button was dropped (a refresh is not part of this story); callouts
that would cover what their copy names are docked with `dock: "right"`;
a recommendation card lists the accounts whose **dominant** cause the action
answers, not every account it touches; the **Code View** chip is gone from the
analysis view (the SQL lives in Trace, where a business user is not sent);
and `panel=mcatalog` is the switch for the Master catalog, because `catalog`
was already taken by the Data Studio screen.

### 22.17 Figures — every synthetic number in round 2

Still **no cleared outcome figure**: every money figure is the AI's own estimate
on invented order lines, and the screen labels it as such. No time-to-answer, no
price, no saving, no delivery-time claim.

- 138 at-risk lines (JD Edwards 61 · Fusion 49 · NetSuite 28) out of 142 open
  lines · USD 4.18 M at risk → **3.77 M** after the override · 9 → **8** tier-A
  accounts, USD 2.36 M → 1.95 M · penalties USD 185,984 → 154,984 · lines
  fixable from stock elsewhere 44 → **40**.
- Causes: stock elsewhere 44 / USD 1.52 M · late in transit 45 / 1.11 M ·
  supplier late 31 / 0.94 M · credit hold 18 / 0.61 M.
- Actions: A1 expedite 44 lines / USD 1.52 M / 12 → 11 internal transfers,
  1,819 units; A2 re-promise 45 / 1.11 M / 7 owner alerts and 15 carrier
  exceptions; A3 credit holds 18 / 0.61 M / 9 reviews; A4 suppliers 31 /
  0.94 M / 6 escalations.
- Halden Tooling Group: tier A, 4 JD Edwards lines, USD 412 k, penalty USD 31 k,
  80 EA needed and 100 EA on hand in EU-2.
- By entity: `NG-NA` USD 1.966 M (47.0 %, 61 lines) · `NG-EU` 1.454 M (34.8 %,
  49) · `NG-SV` 0.760 M (18.2 %, 28). Marcus's dashboard: 57 lines, USD 1.55 M,
  5 tier-A accounts, USD 0.98 M, 18 lines fixable elsewhere, penalties masked.
- Derived in the file: 38 of 60 golden customers exposed (9 A / 16 B / 13 C) ·
  top-12 share 73.9 %, top-20 91.9 % · average line USD 30,290 · average
  lateness 9.2 business days · penalties 4.4 % of exposure · 109 of 138 lines
  under a penalty clause · on-time-in-full last week NG-EU 91.4 %, NG-NA 87.4 %,
  NG-SV 91.3 %.
- Inventory of the world: 126 customer records, 60 CRM accounts, 98 contacts,
  40 items, 67 stock positions, 36 contracts and 108 clauses, 45 shipments, 195
  scans, 15 exceptions, 6 purchase orders, 9 credit holds, 25 customer matches
  and 7 item cross-references waiting for a person, 14 certified views, 10 saved
  questions. Freshness 12 / 4 / 38 / 2 / 65 minutes, unchanged.

### 22.18 What is a real Oracle screen, and what is free design — now

Unchanged from §22.4 for the chrome of both products, the Master catalog, the
column-level Lineage, the Auto-populate catalog queue, Sessions and the Data
Analysis "Generate Query" screen: those are replicas of published screens.
New in round 2, and **free design in the product's idiom**, named here so nobody
mistakes them for screenshots:

- **The multi-agent run card** follows Oracle's own Agent Hub pattern — agents
  in order, each with a status and a dotted sub-step timeline, and a Cancel —
  but no published video opens this exact card on a finished question.
- **The analysis card** (headline, band, causes chart, ranked accounts,
  recommended actions, the Evidence / Explain / Trace / Create dashboard chips)
  is ours. Oracle shows answers as grids; an analysis with attributed causes and
  proposed actions is not a shipping screen.
- **The evidence panel** and **the Decisions app** are ours, in the Redwood and
  Workbench idioms respectively; no Oracle product ships a human review queue
  over an AI's recommendations.
- **The generated dashboard** is ours. What is real is that AI Data Platform
  generates analyses and dashboards from a catalog connection; the tiles, the
  four charts and the "Built by the AI" stamp are a reconstruction, and the page
  says which certified views it was built from.

### 22.19 The red-team of round 2, and the one defect it found

The design session replayed 57 shots at three viewports against the round-2
checklist. It **passed** on: the AI visibly reasoning in every step; no hint or
label saying refresh, model, mapping, view or SQL outside the Explain and Trace
panels, where a reader has asked for exactly that; an opening that is the five sources; six business-language
steps; the site's seven listed features still visible and the scope-out
respected (no ERP write, actions are tasks); figures reconciling before and
after the override; three still-distinct surfaces.

It found one defect, fixed in leg E3: after the override and the re-analysis,
the Decisions card for the decided account read "**6** order lines at risk in
JD Edwards" while its own header, the evidence panel, the analysis table and the
dashboard all said **4**. Cause: the card counted lines whose live `atRisk` flag
was true, and a decided account has none — so the count fell back to "every line
this account has", which is six: its four JD Edwards lines plus the two on-track
Fusion lines that exist only to prove it trades in two systems. Two fixes:
`evidence()` now publishes `atRiskCount` (the lines the AI actually valued,
after the role's row policy) and `wasAtRisk` on every line, and relabels **only**
those lines "Re-promised, accepted" — the on-track lines keep reading "On track"
in the evidence panel, which they did not before; and the card reads the
published count with no fallback. `tools/erp-qa-check.js` grew nine assertions
for it, including an invariant over **every** account in both states: the
evidence's at-risk count always equals the number its row shows.

Two more things were capped in the same pass: **no toast outlives six seconds**
(the analysis toast was set to nine and was still on screen two steps later),
and **no toast survives an application switch** — it is about the surface you are
on. Four grep assertions in the check keep both rules and the count fix from
regressing.

### 22.20 What changed on the site, and verification

- `site/demo/cross-system-erp-qa/` — all four files rewritten for the new
  domain; three surfaces, one switcher, the same tour engine.
  `tools/erp-qa-check.js` rewritten (**329 assertions**, green);
  `tools/capture-erpqa-tour.json` rewritten (57 shots, every sub-step) and
  `tools/capture-erpqa-frames.json` rewritten for the five new images.
- The five images were re-shot at the same file names, so `config.js` and
  `content.js` needed **no change** — the step copy is still untouched, by
  Alex's decision in round 1. Each still is matched to its step copy: the five
  source cards for *Connect the applications*, the six-tile band for *Shape one
  decision domain*, the AI-built dashboard under the analyst's role for *Guard
  it in the data layer*, and the plain-language question with the run card for
  *Ask in plain language*. `manifest-edits.json` captions and alt text follow
  them; `ASSETS.md` §1 carries the viewports, crops and the reason for each.
- One CSS fix came out of the capture: under 1120 px the five source cards were
  pinned to a height their content did not fit, so a flex child was squeezed and
  the second line of each description was cut through its glyphs — at the 1024 px
  QA viewport as well as in the crop. The cards are 160 px there now, their parts
  keep their size, and the description is capped at two whole lines with a fade
  where there is more to read.
- Verification: `node --check` clean on `demo.js` and `data.js`;
  `node tools/erp-qa-check.js` 329 assertions passing;
  `node tools/check-grammar.js` OK; the tour scenario replayed at **1440 × 900,
  1280 × 860 and 1024 × 800** with `LOGS: none` at all three (its own assertions
  — no horizontal page scroll, six band tiles unwrapped and unclipped, no
  callout covering the element its copy names — held at every step). The product
  page was verified headlessly on `file://` at 1440 × 1000: the four stills
  render on their own steps, the poster loads, the console is clean. Screenshot
  at `.work/erpqa-qa/product-page-r2.png`.
- **Limits, unchanged in kind.** The captures are scripted headless Chrome at
  five viewports, so they prove the layout at those widths and no others; the
  published artifacts are checked by eye in the viewer, not by automation. The
  standalone demo artifact and the site artifact still hold round 1's build
  until the main session republishes both.

## 22 · round 3 — interface fidelity: the audit, the fixes, the residual inventions, 2026-09-17

_Alex, on round 2: **"the Oracle interfaces must match the real products exactly — if something is still made
up (sections, titles, layouts, etc.) tell me and explain why; I expect a full match."** Plus two scenario
notes: the end card read as a report on the build session rather than as something a user could act on, and the
step counter stood still through several clicks of the same major step._

### 22.21 The audit method

Three read-only Opus auditors went screen by screen through the walkthrough against the reference corpus in
`.work/erp-qa/` — twelve Oracle videos (≈100 extracted key frames), 97 lossless doc figures, the 469-page
July-2026 AI Data Platform Workbench guide and the measured Redwood kit — and classified **every element** of
every surface as **A** (a deviation with a reference behind it → the exact CSS/DOM fix), **B** (an invention
with no reference → the nearest real Oracle idiom, and whether an Oracle screen could replace it) or **C** (a
match). Demo values were read with `getComputedStyle` / `getBoundingClientRect` in headless Chrome, not
eyeballed; Oracle values are pixel probes or edges counted on a named file, normalised to 1440 CSS px using the
app window as the landmark. The three reports are `.work/erp-qa/fidelity/{datastudio,aidp,askoracle-redwood}-audit.md`
with side-by-side sheets under `fidelity/sheets/`; the after-state sheets for the ten screens that changed most
are in `fidelity/sheets-after/`.

**Counts, before → after.**

| Surface | A before | A applied | A left | B before | C before |
|---|---|---|---|---|---|
| Autonomous AI Lakehouse · Data Studio (top bar, nav, Catalog, Live Feed, Analysis) | 35 | **35** | 0 | 6 | 36 |
| AI Data Platform (Workbench bar and nav, Agent Hub, run card, conversation, Master catalog, Auto-populate catalog, Lineage, Audit logs, Insights, user menu, dashboard) | 66 | **64** | 2 | 13 | 57 |
| Ask Oracle answer anatomy · Agent-flow Trace · Redwood "Decisions" | 31 | **24** | 7 | 14 | 27 |
| **Total** | **132** | **123** | **9** | **33** | **120** |

The nine A-items not applied are listed in §22.23, each with its reason. Everything else in the three
reports — including all twelve items the Data Studio auditor called "a Data Studio user would notice" and all
of the AIDP auditor's "an AIDP user would notice immediately" list — is in the build.

### 22.22 What changed, by surface

- **Brand marks (decision taken with Alex).** Oracle marks are allowed inside the demo; only customer marks are
  banned. So the Data Studio bar now carries the **white `ORACLE` wordmark as text** (600/15 px, `.16em`
  tracking, 7 px superscript ®) where a red diamond tile used to sit, and the Workbench bar, the Ask box and
  the composer carry **Oracle's white outlined ellipse**. The red diamond tiles are gone from all three. No
  logo image files were added.
- **Data Studio.** Top bar: white filled search box with the magnifier inside, hairline segment dividers, a
  user chevron. Nav: **42 px item pitch** (was 32), the green accent bar deleted (Oracle uses none — the
  newest doc figure shows amber, the Oct-2025 video and the lossless figure show nothing), `« Collapse` as a
  **solid blue `#007EA8` button**, and the Data Load sub-tree **collapsed except inside Data Load**, with the
  nav at 156 px / 216 px to match. Catalog: **type-coded group headers** (`Table` green, `View` teal
  `#1F6177`), an **owner chip** in place of `· schema`, no row dividers, one-line descriptions, `Showing N
  entities` on the `Filters` baseline, facet cards on `#F7F7F7` with per-catalog counts, and the row pill as a
  5 px rounded rectangle on `#E4F5D3`. Analysis: **`Run` on its own line with a blue border**, **syntax-coloured
  SQL** with blue line numbers and the 80-column rule, a **solid blue `Save`**, the view-mode icons segmented on
  their own row, the result tabs with a 3 px blue underline, the faceted rail rebuilt (45 px histograms, 24
  uneven bars, filled triangles, centred grey `Show More...`), and the ORDS status bar with blue underlined
  links. Tokens retuned to the measured Redwood ramp (`#00688B`, `#00688C`, `#227E9E`, `#E4F5D3`, `#080707`).
- **AI Data Platform.** The Workbench bar is 40 px on `#26262C` with a 600 px search at 57.1 % of the width, a
  **ringing bell with a grey count badge** instead of `?`, and a **rounded-square avatar with a presence dot**.
  The left nav carries **Oracle's real sixteen-item roster in Oracle's order** — `Create · Home · Master
  catalog · Workspaces · default ⌄ · Workflow · Compute · Experiments · [gap] · Credential store · Data
  sharing · Auto-populate catalog · Notifications ④ · Roles · Audit logs · Settings` — with an **inset rounded
  pill** for the active item, `Activity ⌄` in sentence case over clickable truncated rows, and a collapse
  button bottom-left. Items the walkthrough has no content for are present and inert, which is what Oracle's
  own frames show. `Sessions` became **`Audit logs`** (a real nav item; same content, in Oracle's slot after
  `Roles`), and `Insights` left the Workbench nav for the **Agent Hub's dark bottom nav**
  (`Home · Insights · Catalog · Teams`, `#1E1C19`, 34 px), which the Hub now has. The Hub itself got its warm
  `#EFEEEA` canvas, the Redwood petal artwork bleeding off the top-right, the dot texture bottom-left, a 39 px
  serif greeting with its exclamation mark, a 55 px red tile with the white ellipse, `Today's Tasks` with its
  `View all`, and Oracle's **`My agents` band — a row of four compact cards with status pills and a
  `Last observed` date** instead of one wide card with a paragraph. The conversation view gained the **plum
  `#614D70` bar** with the back chevron, the agent name and the real `undo / redo / delete / save ▾ / bookmark
  / avatar` cluster — three bar colours across one product, which is what Oracle ships. Master catalog:
  **lowercase_snake_case object names everywhere on AIDP surfaces** (Data Studio keeps Oracle's uppercase DB
  names), no monospace in Oracle chrome, **sort chevrons on every grid**, white grid headers, a 298 px tree
  with disclosure triangles and a refresh button, a 51 px breadcrumb whose first crumb is a link, 26 px page
  titles, and the saturated `Default Cluster (Active)` pill. Auto-populate catalog: the **list and the
  extractor page are two destinations** now, `Accepted` / `Rejected` are **plain text**, the helper line sits
  below a full-width Filter in plain dark, and the status glyph is a filled green circle. Lineage: card tiles
  are **coded by artifact type** (every TABLE green, TASK rose) instead of by medallion layer, the impact grid
  is even quarters with chevrons and a white header, `↑ upstream` is dark, and the transformation type is a
  CAPS grey caption rather than an amber pill. The amber rule is gone from every page.
- **The answer.** The rows line is Oracle's bare caption (`Total Rows: N | Displayed: N`) above the grid rather
  than a 71 px bordered strip; the grid header is the light Ask Oracle build's **`#454DE6 → #0F86BF` gradient
  with white bold type**, rows are 42–48 px with rules on both axes and an outer 8 px border; the chip row is
  **`Explore · Explain · Code View · Trace · Narrate`** with `Create dashboard` at the right, all outlined
  white at 15 px with a 2 px blue outline on the active one. `Evidence` was renamed **`Explore`** (Oracle's
  half of the `Explore` / `Explain` pair; the panel content is unchanged, its heading is now plain words) and
  **Code View is back**, rendering the statement in the `.sqlbox` panel that had been written and never used.
  The composer is the Agent Hub's: 58 px, pinned to the foot of the surface, ellipse mark, `Ask a Question...`,
  a mic — and the disclaimer moved out of it onto **its own centred line below with a filled `!`**, which is
  where the Ask Oracle build puts it.
- **The Trace** is now the real Agent-flow task trace: the `Agent flow task | Duration | Tokens` header in
  sentence case with `Duration` underlined, an indented tree with a disclosure triangle and a per-node glyph on
  every span and its tools as children, **trackless `#265C61` bars**, no row rules, a selected row in pale
  blue, and a **right-hand metadata pane** carrying the SQL Firewall / row-policy / masking lines and the
  summary as bold-key value lines — the shape of the real `Test details` pane.
- **Redwood "Decisions".** No `text-transform` anywhere (Redwood declares none), one chip language for systems
  and tiers (r 12, 12 px/400, near-black on a ramp-40 tint, no border), the evidence block as a **proper alert**
  (`#F6FAFC`, inset ring, `#00688C` icon and title) instead of the badge tint it was using while the correct
  style sat unused one class away, a **breadcrumb and a 28 px/900 page title** with a muted subtitle, the state
  line as a **pale status pill**, `Re-analyse` moved out of the 56 px header bar (Redwood header buttons are
  transparent) into the page-title row, a full-width 46 px `Filter` above every list, 40 px single-line table
  rows, 16 px form fields, `--ut-shadow-sm` on cards and 600-weight on every tab.

### 22.23 Residual inventions, and the A-items not applied — the list for Alex

**A-items not applied (9), with the reason.**

| # | Item | Why not |
|---|---|---|
| 1 | Rename `Create dashboard` to Oracle's `View as chart` | It builds a four-tile, four-chart dashboard on a separate page; `View as chart` charts the current answer in place. The name would misdescribe the action. |
| 2 | A breadcrumb strip on Insights | Insights is an **Agent Hub** tab, and the Hub has no breadcrumbs anywhere. Adding one would contradict the same audit's finding that Insights belongs to the Hub, not the Workbench. |
| 3 | The italic `NL2SQL\|GENAI` provenance caption | It is a Select AI (Ask Oracle) artefact. This conversation is an Agent Hub conversation with an agent, not a Select AI profile, and the data layer has no NL2SQL profile to name. |
| 4 | `Switch NL2SQL Profile [GENAI ▾]` in the composer | Same reason as 3, and the canonical frame for this shell (the Agent Hub conversation) has no such control. |
| 5 | The `☑ Database ⓘ ☐ Narrate ⓘ` checkbox pair under the composer | Per the decision taken with Alex, those apply only where the canonical frame shows a composer of that kind. The Agent Hub composer is a mark, a placeholder and a mic. `Narrate` therefore lives in the chip row, in the same chip language as the rest. |
| 6 | The Narrate audio player (`▶ ⏪ ⏩ 🔊` + progress) and the `NARRATE \| <PROFILE>` watermark | There is no audio in the walkthrough. A transport control that plays nothing would be a larger invention than the prose block it replaces. |
| 7 | `Explain` as a full-page view | Every panel in this walkthrough opens inline under the answer, and the tour's click guard allows exactly one control per step; a full-page take-over would break both. |
| 8 | The Trace as a **docked bottom panel** under a flow canvas | Same reason as 7 — there is no flow canvas in this walkthrough. Its *contents* are now the real trace, which is the part a viewer reads. |
| 9 | The `Show Charts` inline chart strip (`Chart Type / X Axis / Y Axis`) | It would duplicate the `Create dashboard` step the tour is built around, on the same answer. |

**Residual inventions (B), what each sits inside, and why it stays.** Nothing below is a screenshot of an
Oracle product; each is free design drawn in the nearest real Oracle idiom, because Oracle ships no screen for
what the demo has to show.

| Invention | Idiom it is drawn in | Why it has to be invented |
|---|---|---|
| The **Live Feed page** — five source cards, the model job, the certified-view list | Re-skinned this round: the cards are the Data Load home's **four-card idiom** (outline icon, 17 px regular title, grey description, a muted line for the feed and the freshness); the job is the **load-job accordion** (dark-teal `#245D63` header over a white body with neutral buttons and coloured glyphs); the view list is the **Catalog entity list** | Oracle has never published a screenshot of the Live Feed surface — not in twelve videos, not in 97 doc figures |
| The **multi-agent run card** | Oracle's Agent Hub run-card pattern, now carrying the trace's own cues: `Succeeded` (Oracle's word), no label at all for a step that has not run, a `#265C61` duration bar with its `x.xxs`, a grey wash on the live agent, and no `Cancel` (no AIDP running-job surface offers one) | No Oracle footage opens a run card on a finished question |
| The **analysis card** — headline, six-tile band, causes chart, ranked accounts, four proposed actions | Agent Hub's white answer card and grouped-header table; the band and the two-column chart/proposal layout are ours | Oracle shows answers as grids; an analysis with attributed causes and proposed actions is not a shipping screen |
| The **Explore panel** — source rows per account, stock elsewhere, the contract clause, the CRM block | Redwood-styled free design; the nearest thing across the whole corpus is Ask Oracle's RAG `Show chunk details`, in a different product | Nothing in AIDP attributes an answer row to a source system |
| The **Trace summary and the three SQL-Firewall lines** | The real `Test details` metadata pane's bold-key/value shape, which is where they now render | No Oracle trace carries a summary or a security section |
| The **span names as sentences** (`Read the three order books`) | — | Oracle's spans are object identifiers (`insurance_qn_a_agent.workflow`). The sentences are the single clearest tell that this is not a real span table; they are kept because the walkthrough's job is to be read by a business audience |
| The **glossary cards under `Explain`** | The Master-catalog column-description field, which the panel note names | A business glossary is confirmed **absent** from the product (zero hits in the 469-page guide) |
| **Ten saved questions** on the Hub home | Oracle's suggestion pill (border `#D4D3CF`, radius 4) — the caps label and the numbering are gone this round | Oracle shows two bare pills; ten is the demo's question set |
| The **generated dashboard** | Redwood card chrome; the `Built by the AI` stamp uses Oracle's measured `#89C155` / `#497821` cluster pill | No AIDP dashboard builder appears in any frame or in the guide |
| The **View-as menu** | — | Oracle's avatar menu is never opened on camera anywhere in the corpus; the row-level-security story needs it |
| The **Decisions app** — per-row `Accept` / `Decline` and a free-text `Why?` | Redwood's `Reviewed entities` review queue: breadcrumb → 900-weight title → text tabs → filter → plain table | Oracle hides row actions behind a `···` overflow and has no per-row note field; the walkthrough's whole point is a person deciding in two clicks and the reason being kept with the decision |
| The **before → after band** (six tiles) | — | A demo-narrative device; nothing in Redwood or either product has a counterpart |
| The **`Audit logs` content** — statement hashes, allowed/blocked | The nav item and the page are Oracle's; only the columns are ours | The demo's governance story |
| The **`Tokens` column showing seconds** | Verbatim from the Nov-2025 agent-flow trace, which labels that lane `Tokens` and renders the seconds in it | Reproducing the reference, oddity included |
| Four **agent cards** on the Hub, three of them inert | Oracle's `My agents` band, which shows four | Only the commercial operations agent runs; the other three are named after work the data actually contains |

**Two density deviations, stated rather than hidden.** (1) The ranked-accounts grid carries **nine** columns
where Oracle's answer grids carry four to six, so its cells run at 13 px and its rows wrap past the light
build's 42–48 px. (2) At 1024 px the five source cards fall to two rows and are capped at 134 px with the feed
line switching to each pipeline's short name, so the step-1 callout still fits under them inside a 768 px
viewport — the cards keep whole lines, with a fade where a description runs on.

### 22.24 The end card and the step counter

- **End card (R9), replaced whole.** Eyebrow *Interactive walkthrough*, title **What you can act on now**, three
  sentences, then **three doors that each open the place** — *Ask another question* (the Agent Hub home),
  *Open the Decisions queue* (the customer matches waiting for a person), *See the dashboard* (Insights) —
  then *Replay the walkthrough* and *Keep exploring*, and a one-line footer. The round-2 recap ("What the AI
  did / What you decided"), the six-step list and the "Still open for you" paragraph are gone, and **no figure
  appears on the card**.
- **Step counter (R10).** The card reads **`Step 4 of 6 · 2 of 3`** — the six majors keep their business
  titles, the second number counts every sub-step of the major including the passive ones — and the six
  progress segments **fill fractionally** (`sub / subN` of the current major), so every click moves something.
  The same engine change is available to the Workforce optimization and Large docs walkthroughs; it has not
  been applied to them.

### 22.25 Verification

`node --check` clean on `demo.js` and `data.js`; `node tools/erp-qa-check.js` **343 assertions passing** —
fourteen of them new this round, so a later edit cannot quietly undo the renames (Oracle's nav roster,
`Audit logs`, Insights on the Hub's bottom nav, the plum bar, the marks, the chip row, `Succeeded` with no
`Cancel`, the `Agent flow task` trace, the amber rule, lowercase AIDP names, the Redwood breadcrumb and
900-weight title, no uppercase micro-labels, the fractional counter and the R9 end card);
`node tools/check-grammar.js` OK. `tools/capture-erpqa-tour.json` was extended for the renamed panel
(`sessions` → `audit`) and the new surfaces — the Auto-populate catalog list, the Agent Hub bottom nav in both
directions, Code View and Narrate — and replayed at **1440 × 900, 1280 × 800 and 1024 × 768** with
`LOGS: none` at all three, its own assertions holding at every step (no horizontal page scroll, six band tiles
unwrapped and unclipped, no callout covering the element its copy names, no table overflowing its container).
All five images were re-cut because every screen they show changed; the product page was verified headlessly
(`.work/erpqa-qa/product-page-r3.png`). **Limits:** the same as before — scripted headless Chrome at fixed
viewports proves those widths and no others, and the published artifacts are checked by eye in the viewer.

## 23. Round 7 — the Services page in three messages, and one proof-of-value duration, 2026-09-17

**Brief** (Alex, in session): three messages, three screens — (1) we combine deep AI research and experience with Oracle expertise, elaborated with the dedicated practice's structure or numbers; (2) it's all about ROI — measuring outcomes is in our DNA — elaborated as a method from discovery to proof of value, integration and scaling, built around measured impact; (3) a fast proof of value, no hassle — the method, on real data. Plus: *"Make sure that we always mention 4-8 weeks PoV (consistently across the site)"*, and rethink the main screen around the messages.

**Split.** Opus: the state check (a second session had published versions 30–31 with the Cross-system ERP Q&A walkthrough), a fact pack per message with publishability labels, the site-wide duration sweep and its checker rule, the build, the layout QA at 1440/1280/1024/768/375, the merge and the publish. Fable, in one pass from the fact pack: the spine, the screen plan and the copy — the first screen carries message 1.

### 23.1 The page

| Screen | Heading | What carries the message | Sources |
|---|---|---|---|
| S1 | FRONTIER AI / ON ORACLE. | The practice's structure — architects shape the scope, engineers trained on the platforms build and integrate, a product team turns what repeats into the agents on the site, each delivery feeds the next; one entry point; joint teams with Oracle's AI & Data organization, one contract. Band: **1993** founded · 10,000 people in 17 countries; **1,000+** experts in AI, data and R&D; **30** Fortune 500 clients in data and analytics | the three capabilities and operating model (EMEA s.14, ARROW s.3) [pub]; the frontier line, 1,000+, 30 Fortune 500 [site]; 1993 / 10K / 17 (§18.2) [site] |
| S2 | Every step has a number. | Discovery → Jumpstart proof of value (4–8 weeks) → Integration (3–5 months) → Scale (3–12 months), each ending with a measured result; metrics and baseline signed by the customer, Oracle and SoftServe before the clock; the 81% engagement and the ~80% threshold open the footnote; managed service or the customer's own team folded into Scale | discovery (FACTORY s.9, EMEA s.15) [pub]; gate, readout, costed plan, 81% [site]; integration to the predicted return with KPI reporting and observability, org-wide roll-up (GTM s.9, s.13) [pub] |
| S3 | Not a project. A proof. | **4–8 weeks** to a measured result in your own tenancy; one gate, a separate environment, nothing touching production, a fixed price where one is published; *You bring* — a sponsor, two or three metrics and today's baseline, read-only access, the people who judge the output — and *You leave with* — a working agent on your data, a measured readout against the signed baseline, a costed plan | owner (4–8 weeks); the product `needs` and Jumpstart lists [site] |

New copy: the three headings; *"Measuring what an innovation changes is the discipline behind everything we do"* (from Alex's "in our DNA"); *"The gate is what keeps the price fixed and the calendar short."*

**Opus edits to Fable's copy:** `&amp;` → `&` in *AI & Data* and *R&D* (the renderer escapes, so the entity would have printed); *ready-to-run* dropped from the hero lead (retired vocabulary, §18.7); the 81% sentence moved from the S2 lead to the head of its footnote — Fable's own fallback, taken because the lead ran five lines at 1440 (three now).

**Cut:** *FROM PLATFORM / TO PRODUCTION.* and its lead; the 500+ data experts and 150+ projects tiles; the after-go-live panels (their substance is in the Scale step); the 81% band figure (now in the S2 footnote); the `#proof` anchor — the home case-studies rail's *How we measure it* now lands on `#how-we-engage`, where the measurement argument opens.

### 23.2 One proof-of-value duration: 4–8 weeks

| Where | Before | After |
|---|---|---|
| `overview.delivery.steps[0].fact` | 30–45 days to about two months · scoped per engagement on the research and investigation products | 4–8 weeks |
| `overview.hero.stats[2]` | 4–8 weeks | unchanged |
| large-document-extraction, workforce-optimization — `promise`, `durationShort`, `pillars[fast]`, `investment.duration` | 2 months | 4–8 weeks (their timelines already end at week 8) |
| cross-system-erp-qa, business-metrics-qa — the same four keys and `overview.metrics[0].value` | 30–45 days; *"30 days for one clean source system; 45 for up to three sources or a stricter security setup"* | 4–8 weeks; *"Four weeks for one clean source system; up to eight for three sources or a stricter security setup"* |
| account-insights, case-evidence-collection | no duration — *"the duration is set at scoping"*, `investment.duration: null`, no `durationShort` | 4–8 weeks in the promise, the fast pillar, `durationShort` and `investment.duration` |
| plan-vs-actual-investigation | 12 weeks plus a two-week acceptance phase; timeline Weeks 1–2 Discovery · 3–4 Framework · 5–10 Analysis · 11–12 Validate, acceptance in weeks 13–14 | 4–8 weeks; Week 1 Discovery · Weeks 2–3 Framework · 3–6 Analysis · 6–8 Validate, acceptance included — **a scope change, not only a wording change** |

`tools/check-grammar.js`, round 7: every product's `durationShort`, `investment.duration` and `promise` state 4–8 weeks and its fast pillar the duration; the home step and the home hero tile carry it; the Services page states it and its band figure is it; and *30–45 days*, *about two months*, *in 2 months*, *12 weeks*, *two-week acceptance* or *set at scoping* anywhere in `content.js` fails the build — verified against a copy with one old duration planted.

### 23.3 Checks and publish

Checker OK; deny-list grep empty; console clean; the repetition check clean on every screen (the one *value* ×3 on S2 counts the step name *Jumpstart proof of value*); headings within budget — the H1 two lines from 320 to 1440, the H2s one line at 1440 and two at 375, *4–8 weeks* one line at 375; four equal steps at 1440 (330 px) and 1280 (290 px), vertical at 1024 and below; no horizontal overflow at any width; `#how-we-engage`, `#proof-of-value` and `#contact` land at the 96 px offset; the product Jumpstart tabs show the new duration and no old one. The page is 3.9 screens at 1440. The first publish was refused against versions 30–31 from the ERP Q&A session; the live `content.js` and `site.css` differed from the local files only by this round's edits and the live `config.js` matched, so the local tree was published on top as **version 32**. The preview is shared with anyone who has the link.

### 23.4 Open for Alex

1. **Plan vs actual investigation:** the 4–8-week rule compresses a 12-week build and a two-week acceptance phase — confirm with the delivery team, or restore from the table above.
2. **Frontier AI** is the hero's claim. It rests on the frontier line, the 1,000+ AI, data and R&D experts and the measurement discipline; the stronger proof points stay [clr] — the enterprise agentic AI platform at scale (42% → 91% accuracy, 3M+ users) and the GenAI knowledge graph (5–10× faster research), FACTORY s.15, s.17.
3. Two of the three band figures (1,000+, 30 Fortune 500) repeat the home hero's, within the two-places rule.

## 24. Round 8 — housekeeping: the header, and the sales-kit request, 2026-09-17

**Asks** (Alex, in session): take *Case studies* out of the header; make each product's sellers area generic — a SoftServe or Oracle email gets the sales kit, customers and partners are pointed to a request or their point of contact — and after an accepted email show a confirmation that the kit was emailed, not a materials list; and add the same kind of request for the sales materials, for all offers or one product, placed so it does not overcomplicate, overlap the existing requests or break sellers' mental models — the UX to be decided by Fable.

**Split.** Opus: the inventory of every request entry point and the brief, the nav change, the build, the tests, the publish and the docs. Fable, one pass: the UX decision and all copy. (Numbering note: the Cross-system ERP Q&A session took §22 on the same day, so the round-7 Services section was renumbered §23.)

### 24.1 The decision (Fable)

- **The kit is its own short form** — work email · *Kit for* · consent — not a variant of the demo/contact form: eligibility is the email's domain, so a role field would only invite a wrong answer, and every extra field costs a seller on a live call.
- **Per product**, the *For sellers* tab becomes the kit panel with the product fixed. **For all offers**, `#/sellers`: one screen with a URL a seller can paste into a thread (a modal has none), and no second filled button on the Products page, which already carries the customer scoping call.
- **Header** Products · Services · For sellers + *Talk to us*; **footer** *For sellers* in the link row. Home, Products and Services unchanged: the demo and scoping forms stay the route for buyers, and for sellers who already have an account in mind.
- **Roles** split: *An Oracle seller* / *An Oracle partner* (was *An Oracle seller or partner*).
- **Truthful modes**: with no endpoint the visitor's mail client carries the request (*One step left*); with an endpoint, *Your request is in* — and *Check your inbox — we've emailed the kit* only when `kitAutoSend` is true.

### 24.2 What changed

| Where | Before | After |
|---|---|---|
| `site.nav` | Products · Services · Case studies | Products · Services · For sellers |
| `site.footer` | CONTACT US block; legal links | + `sellersLink`, first in the link row |
| `shared.productTabs[sellers]` | `locked: true` (lock icon) | not locked |
| *For sellers* tab | email gate → *Unlock* → materials list with states and legend, a seller-notes fetch, *See the fit…* with a demo modal, *Lock again* | *Get the sales kit* panel → kit form → a confirmation closing on *Request a demo* and *Get the full kit* |
| `#/sellers` (new) | — | the kit panel with *Kit for* (*All offers* first), then *See the fit in an account?* opening the demo modal with nothing preselected |
| content `sellerGate` | gate copy, legend, notes heading, CTA | retired → `salesKit` { page, tab, form } |
| `forms.roles` | An Oracle seller or partner | An Oracle seller · An Oracle partner |
| config `sellerGate` | `allowedDomains`, `storageKey`, `notesUrl` | `allowedDomains`, `kitAutoSend: false`, `kitEmailKey`, `legacyStorageKey` |
| `sellers.materials`, `config.products[].materials` | rendered as the list | kept, not rendered — the kit manifest |

**Opus changes to Fable's plan:** *within one working day* → *within two working days*, the promise every other form here already makes, until the practice confirms a faster one; no eyebrow on the product tab, whose label already says *For sellers* directly above the panel; the submit button moved below consent (the first build set it inline beside the email, so a seller could press it before consenting); the practice address enters the copy as `{mailbox}` from `contactEmail`, rendered as a link, rather than being written into the strings.

### 24.3 Checks and publish

`tools/check-grammar.js` round 8 asserts the `salesKit` keys and their placeholders, fails `queued` or `mailto` copy that says the kit was emailed, a role label that lumps sellers and partners, a missing footer link, a locked sellers tab and a returning `sellerGate`; the nav check expects Products · Services · For sellers. In the browser, on `#/sellers` and on a product tab: empty submit, wrong domain (the route link inside the error), a subdomain accepted, the POST payload, *queued*, *sent*, the send error, the mail-client fallback, *Request another kit* with the email kept, the prefill on return, the legacy unlock flag cleared, the demo modal with the split roles and nothing preselected; no horizontal overflow at 1440 or 375; console clean. Published as **version 33**.

### 24.4 Open for Alex

1. What sits behind `formEndpoint` for `form: "kit"` — an auto-sender (an n8n flow composing the email from the manifest, say) or a person reading oracle@softserveinc.com? It decides `kitAutoSend` and who keeps the manifest current.
2. Is oracle@softserveinc.com watched for kit requests, and is two working days the right promise?
3. Is the kit shippable today? Most manifest links are still pending, and the confirmation promises a kit.
4. Is *all offers* one portfolio bundle, or the seven kits together?
5. Domains: `softserveinc.com` and `oracle.com` with subdomains (today's behaviour), or exact only?
6. The seller/partner split — do partner demo requests go to the same practice mailbox?

## 25. The handover page, the Internal review panel, and the customer logos off the artifact, 2026-09-17

**Asks** (Alex, in session, in Russian; the list below is the English rendering):
1. Before going further, write one overview file that keeps the requirements, the approaches and the learnings across sessions.
2. While the site is a prototype, add a temporary *internal* button that shows the checklist of what still needs confirming or approval, and that can be closed and opened again.

**Split.** Opus alone, with no Fable pass. The panel is an internal utility with no reader-facing messaging, and the checklist text is Alex's own list in translation.

### 25.1 `docs/START-HERE.md`

The existing docs did not add up to a starting point:
- README is technical.
- HANDOFF had grown into a procedures log, and its paste-ready prompt still set round 5's home-page rebuild as the task.
- PROVENANCE is a 4,500-line record.

START-HERE is the page a session reads first: what the site is and who it serves, the brief (§2 below), the site page by page, the standing rules (content, messaging, design), how a round runs, the short run/QA/publish procedure, the learnings, the Internal panel, the open items and a map of the docs. The pointers:
- HANDOFF's opening line and its §8 prompt;
- README (above the fold, and in the folder tree);
- the repo's `CLAUDE.md`, under outputs.

### 25.2 The checklist, in English

Alex's list, grouped as he wrote it, is in `site/data/review.js`. Each item is one line to tick:

| Group | Items (optional note) |
|---|---|
| Target audience | Priority 1: Oracle sellers and partners (*Partners can't get the sales kit today*) · Priority 2: SoftServe sellers · Priority 3: end customers |
| Positioning | Experts in AI and Oracle platforms, top-class enterprise record · Ready-made solutions + fast PoVs + a dedicated practice · We offer both products and services |
| Commitments and disclosures | A PoV takes 4–8 weeks (to agree with delivery) · Only the PoV price on site; others in materials (*2 products still show Integration prices*) · No customer names (no confirmation of use yet) · Catalog includes existing and planned products (*Nothing marks a product as planned*) |
| Communication flow | One shared mailbox: oracle@softserveinc.com · Karsten is the contact for communications · All requests land in the shared mailbox (*Forms open the visitor's mail app for now*) · Materials only to softserveinc.com, oracle.com (*Nothing sends the kit automatically yet*) |
| Before launch | The name Oracle AI & Data Solutions clears Oracle's trademark rules · Frontier AI is a claim we can back up |

**Editorial choices:**
- *We don't print package prices, but we do in the materials* and *we print only the proof-of-value price* are one rule seen from two sides, so they became one item.
- The bullet on materials joined the communication flow.
- *Before launch* carries two launch blockers from §20 and §23.4.

**The notes flag three places where the site does not match the brief yet.** None was changed; each waits for Alex:
- two products print an Integration price (€300–500K services plus infrastructure);
- no product is marked as planned;
- partners (priority 1) are turned away by the kit form's domain rule.

**Deliberately left out:** figures not cleared for the site, because the panel is visible to anyone with the link.

### 25.3 The panel

**Behaviour:**
- **Placement:** an *Internal · N to confirm* pill fixed at the bottom right, dashed amber (amber marks everything internal; teal stays the site's). It opens a right-hand drawer (416 px at 1440, full width at 375) with an eyebrow, the title, an *n of 16 confirmed* line, the groups, and a footer: *Ticks are saved in this browser only.*
- **Items:** each is a native checkbox inside its label, so the whole row is the target. A ticked row dims and strikes through, and the counts update at once.
- **Storage:** ticks save to `localStorage` (`oracle-ai-solutions:review-ticks`, keyed by item id). If storage throws, the list still works for the visit and the footer says the ticks will not be kept.
- **Closing:** the drawer is non-modal. The close button and Escape both close it and return focus to the pill; while a site modal is open, Escape belongs to the modal (a capture-phase listener that yields). Open or closed survives a reload in the same tab (`sessionStorage`), because a republish reloads open previews.
- **Robustness:** styles are injected from `assets/review.js`, so removing the panel means deleting two files and two script tags. Reduced motion drops the slide, and print hides the panel.

**Checker:**
- It fails if index.html loads only one of the two files.
- It fails if an item has any key but `id`, `text` and `note`, a non-kebab or duplicate id, `text` over 70 characters (47 beside a note), or `note` over 45.
- It fails if the list names a customer.
- It warns on every run while the panel is on.

**First cut and owner feedback.**
- **Version 35** gave every item a status chip (*To confirm* · *Confirmed* · *Changed*), a flag chip (*Site differs* · *Conflict*) and an *On the site:* paragraph, with statuses set in the data file.
- **Alex:** "the internal checklist page should be much less verbose (1–2 line items) + each item to have checkbox I can tick and it will be saved."
- **The storage question:** declaring the `db` capability would have saved ticks for every viewer and let a session read them back. It would also have made the artifact organization-internal, ending the public link.
- **Alex settled it:** "it could be browser only, no need for database".
- **Version 37** is the rebuild: one line per item, at most a 45-character note, the checkbox, `localStorage`.
- **The consequence:** ticks never reach the repo, so START-HERE §2 remains the record, and a session updates it when Alex reports a confirmation.

**Checks on version 37:**
- checker OK;
- console clean;
- at 1440, all 16 rows are one or two lines (41–62 px), three ticks save and survive a reload, the counts read *3 of 16 confirmed* and *13 to confirm*;
- at 375, full width, the close button in view, no horizontal overflow; the two items with a note run to three lines at that width.

The first attempt at version 35 was refused against version 34 (the ERP Q&A session, 12:52). The live `index.html` differed from the local wrapper only by the two new script tags, so the wrapper was published on top.

### 25.4 The customer logos, off the artifact and out of `site/`

**The finding.** The post-publish `list_files` showed `assets/img/logos/bosch.png`, `riyadh-air.png` and `riyadh-air.svg` among the artifact's 99 published files. None was referenced since round 4, but on a link-shared artifact each could be downloaded by path. That breaks the standing rule of no customer names or logos in shipped files.

**Version 36** removed the three paths from the artifact; no page changed. In the repo, the folder moved to `docs/asset-candidates/logos/`, outside the deployable root, so no whole-tree publish or real deploy can carry it again. Updated with the move:
- `ASSETS.md` §4 (new path and reason);
- HANDOFF's §2 table;
- the README tree.

`check-grammar.js` now fails if `site/assets/img/logos/` exists. HANDOFF §4 and START-HERE §6 add `list_files` after every publish.

### 25.5 Open for Alex

1. Every checklist item, especially the three with notes: remove or keep the two Integration prices, mark the planned products (and say which they are), and decide whether partners get the kit. Tell a session what is confirmed; the ticks stay in your browser.
2. The panel is visible to anyone with the preview link, including the lines on planned products and unconfirmed customer names. If the link goes beyond the core team, set `enabled: false`.

## 26. *For sellers* out of the header, 2026-09-17

**Ask** (Alex, in session): *"Remove 'for sellers' block from header line."*

**What changed:**
- `site.nav` is **Products · Services** again, plus the *Talk to us* button. The desktop bar and the mobile menu both render from it.
- The `#/sellers` page itself is unchanged.
- It is now reached two ways:
  - from *For sellers*, first in the footer's link row, on every page;
  - from *Get the full kit*, in the confirmation after a product kit request.
- Each product's *For sellers* tab is unchanged.

**Checker and docs:** `tools/check-grammar.js` expects the two-item nav. Updated to match: README (routes), START-HERE §3, HANDOFF §1, VISUAL-GRAMMAR §11. `SCHEMA.md` already described a two-item nav.

**Checks:**
- checker OK;
- console clean;
- the header at 1440, 1024 and 375 (the mobile menu: Products, Services, Talk to us), with no horizontal overflow;
- `#/sellers` renders, and the footer link is present.

Published as **version 38**, `data/content.js` only. Git showed no other change to that file since it last shipped.

**Open for Alex:** the footer is now the only permanent entry to the all-offers kit. If sellers should find it without scrolling, the home page or the Products page could carry a quiet link.


## 27. The current-SoftServe-brand theme, shipped beside the old one, 2026-09-18

**The ask** (Alex): migrate the site's styles to SoftServe's current styles,
using softserveinc.com and its pages as the reference, thoroughly; replace the
logo and the fonts; QA the updated layout; decide where Fable helps and use it;
**keep the current version working and create the new styles as a new version**.

Mid-task he lifted one constraint: "licensing issue is off, I'm SoftServe
employee and building for SoftServe, so we can use those fonts."

### 27.1 The finding that set the scope

SoftServe has been redesigned, and every premise the old theme rests on is gone:
the display face is now a **serif** (Azurio, weight 400, sentence case) over a
grotesque (Replica LL), the teal `#35CCBA` has been replaced by a two-role pair
(`#1485c4` action, `#f46a4a` accent), the ground is white with pure black as a
band, and corners are **octagonal `clip-path` cuts**, not radii. `35ccba` does
not occur in 200 KB of their CSS or in any of their 96 `:root` tokens.

This was measured, not inferred: an Opus research pass read their stylesheets and
`@font-face` rules, dumped the token set, and recorded computed styles at 1440
and 375 (`scratchpad/softserve-brand-spec.md`, 1,274 lines). The display face is
the finding most easily missed — `--font-display` lists *sans* fallbacks, but
`document.fonts.check` returns true for Azurio and it renders with bracketed
serifs and marked stroke contrast.

### 27.2 The split of work

| Step | Model | What |
|---|---|---|
| Brand measurement | Opus | softserveinc.com's tokens, type scale, components, layout, motion, the wordmark SVG |
| Type specimen | Opus | downloaded the five licensed faces, rendered them against Newsreader / Source Serif 4 / Literata / Spectral / Instrument Serif and Archivo / Inter / Chivo / Space Grotesk at matched sizes |
| **Design translation** | **Fable** | one pass: the token map, the ground plan, the blue/orange rule, the shape policy, the case and heading budget, the header and footer calls, the risk list (`scratchpad/ss26-design-decisions.md`, 540 lines) |
| Copy re-casing | Opus | `data/content-v2.js` — 45 stored-capitals strings to sentence case, as an overlay, leaving `content.js` byte-identical |
| Build, QA, publish, docs | Opus | the stylesheet, the entry, the marks, the checker block, the sweep, this record |

Fable made the decisions and nothing else, per the model-routing rule. Its §1
was revised in flight when the licensing constraint lifted: the free faces it
had picked on canvas metrics (Literata at 778 px against Azurio's 784 px;
Archivo at 765 px against Replica's 750 px) were demoted to a recorded
second choice, the real faces became primary, and its planned per-family metric
corrections were dropped so the brand's measured numbers apply literally.

### 27.3 How two versions coexist

One tree, two entries. Nothing was duplicated: 8 MB of images, five page
renderers and 190 KB of copy are shared.

- `site/index-v2.html` + `site/assets/site-v2.css` are the new version;
  `site/index.html` + `site/assets/site.css` are unchanged.
- `site/assets/brand.js` is a new eight-line indirection. `brandAsset(key,
  fallback)` returns the active theme's mark when the theme declares one and the
  original otherwise; `index-v2.html` sets `window.BRAND` before the data and
  page scripts load, and `index.html` sets nothing, so every fallback wins and
  the old version does not move. Five logo paths in `content.js`, `app.js`,
  `product.js` and `overview.js` now go through it. `tools/check-grammar.js`
  loads `brand.js` into its sandbox first for the same reason.
- `site/data/content-v2.js` re-cases 45 strings at load time, carrying each
  expected old value so a later edit to `content.js` surfaces as a warning
  instead of a silent stale patch. `content.js` itself is untouched — verified at
  commit level, not just in the working tree.
- The old version's uppercase strings still render as capitals there, because
  its CSS uppercases them; the overlay only changes what the new version reads.

### 27.4 What was built

Detail in `docs/SS26-THEME.md`. In brief: a new `:root` on the brand's measured
tokens; the whole heading ladder to sentence case at weight 400 with the serif on
H1 only; one grouped `clip-path` rule with `--cut` per component and the shape on
`::before` for everything pressable; the button system rebuilt (blue primary,
grey secondary, white inverse on the dark band, no outline variant, because the
brand has none); chips, badges, tabs, segments and rail options on the blue tint
for "selected"; the 50 px solid-white header; the black footer under a `#edf0f2`
spacer band with an Azurio 32 px column heading; `#about` and
`.services-page-proof` inverted to the one black band per page; both photo hero
veils flipped to white; every glow, shadow and press-scale deleted.

The 2026 wordmark was rebuilt from the SVG served on softserveinc.com (viewBox
`0 0 1010 173`, nine glyph paths, no fills) in ink and white, plus ink versions
of the Oracle and NVIDIA marks for the white page — the footer inverts them back
with `filter: invert(1)` rather than carrying a second file. The favicon is the
wordmark's S, white in a Lviv-blue octagon; the old teal spark is retired with
the teal.

**Nine new checker assertions** in `tools/check-grammar.js` keep the theme from
being quietly undone: no teal, no heading weight the brand lacks, no retired
radius token, orange spent at most three times, the five fonts present and
declared, the overlay loaded in the right order, `data-theme="light"`, a white
`theme-color`, no webfont service, and every re-casing still matching.

### 27.5 QA

The Browser pane stopped displaying partway through, so layout QA moved to a JS
probe run over nine routes at six widths: horizontal overflow, the effective
contrast of every text leaf against its real background, resolved font families,
H1 line counts and broken images. Two probe generations were needed — the first
read every clipped button as white-on-white, because the fill sits on `::before`.

Result: **no overflow and no contrast failure at 1440, 1280, 1024, 768, 375 or
320**, console clean on every route in a fresh tab, checker OK, deny-list grep
clean. Three real defects were found and fixed along the way:

1. `font-variant-numeric: tabular-nums` gave Azurio's comma a full digit advance,
   printing "1 , 000+". Display figures now take `lining-nums` only.
2. The Services proof panels put `#26292b` body text on the `#1a1a1a` panel —
   near-black on near-black. Everything inside that band now inverts.
3. `#717a81` fails AA at 12 px on white (4.37) and on `#e1e7eb` (3.50). Every
   label step moved to neutral-700 `#4c5156`.

The previous version was re-checked after the shared-file edits: dark ground,
Montserrat 900 uppercase, Open Sans body, white marks resolving, `window.BRAND`
empty, no overlay. Unchanged.

### 27.6 Published

New artifact, **https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri** — 101 files,
8.3 MB. The existing artifact (98wafGUphFSyGSr6ctJiiN) was not touched.

`action: list_files` confirms no customer logo ever reached it, and the five
fonts are live with the right media types. Verified in a signed-in browser that
Azurio renders from the artifact's own origin — single-storey `g`, open hook
descender, fine serifs — so the artifact CSP serves same-origin fonts and the
Georgia fallback is not in play.

Nine legacy files and `assets/site.css` are deliberately **not** published on
this artifact: it publishes only what the SS26 page references, which is the
version-36 lesson (§25) applied up front rather than after the fact.

### 27.7 Open for Alex

- **The home H1** is eight words and needs a 2–4-word re-cut to take the brand's
  96 px step; until then it is held at 64 px and runs three lines. Four home H2s
  were already over the owner's word count before this pass; the change of face
  makes them read calmer, not shorter.
- **The primary button's label is 4.05:1** — SoftServe's own pairing of white on
  `#1485c4` at 16 px. Kept for fidelity. `--action: #0e5e8b` is the one-line fix
  if AA matters more than the exact brand blue.
- **The three walkthroughs are still dark** and open from a white page.
- Whether the new version replaces the old one, or both stay live.

### 27.8 Made the default, 2026-09-18 (Alex)

> "ok; we keep than this new version as default, previous remains as archived old one."

The names now say which is which. `git mv` throughout, so history follows:

| Was | Is |
|---|---|
| `site/index-v2.html` | `site/index.html` |
| `site/index.html` (dark) | `site/index-legacy.html` |
| `site/assets/site-v2.css` | `site/assets/site.css` |
| `site/assets/site.css` (dark) | `site/assets/site-legacy.css` |
| `site/data/content-v2.js` | `site/data/content-case.js` |
| `site/assets/img/v2/` | `site/assets/img/brand/` |

`index-legacy.html` carries a comment at the top saying what it is. Its
`document.title` still reads without an "archived" suffix because the router
sets the title per route from `content.js`; the source comment is the marker.

The checker's brand block now asserts against the live names, and gained three
assertions that keep the archive runnable: it must load `site-legacy.css`, must
**not** load the sentence-case overlay (it is the uppercase theme), and its
stylesheet must exist.

**Artifacts.** The site's artifact (HTEJADBQF3ZevFPuSoTHri) was republished from
the renamed files, with the six `assets/img/v2/*` paths, `assets/site-v2.css` and
`data/content-v2.js` mapped to `null` so the old paths do not linger —
`list_files` shows 101 entries and no `v2` anywhere. The old artifact
(98wafGUphFSyGSr6ctJiiN) is **left frozen** as the archive: it was published
before this pass, so its copy of the shared renderers predates `brand.js` and is
internally consistent. Re-publishing it would only introduce drift.

**Open:** 98waf is the URL that has been in circulation, and it now shows the
archive. If the circulating link should show the current site, the two artifacts
have to be swapped. Alex's call; flagged, not done.

Both entries were re-verified after the rename: `index.html` white ground,
Azurio, sentence case, brand marks, 45 overrides applied; `index-legacy.html`
near-black, Montserrat 900 uppercase, Open Sans, white marks, no overlay. No 4xx
on either, no overflow on any of the eight routes at 1440.

### 27.9 Brand-impact audit, and the teal that was still shipping, 2026-09-18

> "Make sure that packaging skills are updated if that has any effect on them."

An Opus pass audited `Oracle-Packaging-Skills`, `.claude/references/` and the
rest of AO-Personal-OS against the measured rebrand and the rename
(`scratchpad/packaging-skills-impact.md`).

**The headline was good news:** the packaging kit is *already* on the 2026 brand.
`softserve-deck-base.pptx`'s theme declares `Azurio` + `Replica LL TT` with the
Lviv-blue/Austin-orange palette. No teal, no Montserrat, no Open Sans in that
repo — except one orphaned file.

**The bad news was in this repo.** The **16 step-frame SVGs** were still drawn
teal `#35CCBA` on near-black `#10161A`, and they are referenced live from
`content.js`, so they were rendering as teal-on-dark artwork inside white-ground
product pages. Round 27's QA had checked text contrast, overflow, fonts and
broken images — but never the *content* of an `<img>`. Fixed by a role-preserving
recolour of all 16:

| Was | Role | Now |
|---|---|---|
| `#10161A` | figure ground | `#FFFFFF` |
| `#0E2D4D` | the radial lift | `#C1DFF4` |
| `#496683` | structure strokes | `#BDCBD7` |
| `#9FB3C6` | labels | `#4C5156` |
| `#35CCBA` | the active path and the eyebrow | `#1485C4` |

515 colour references across 16 files, plus the one eyebrow tracked at `.1em`
brought to `.06em`. The checker now walks `site/assets/img/**` and fails any SVG
carrying the retired teal or the old near-black palette — the gate that would
have caught this. `docs/ASSETS.md`'s drawing grammar was rewritten so the next
set is not drawn teal again.

**Also corrected here:** five stale "current truth" statements that still
described the old brand as the standing rule — `README.md` (Google Fonts as the
one external resource, the deploy note about unblocking it, "One accent. Teal
`#35CCBA` on near-black", the navy strip, the `#131313` fade, 14px reveals),
`HANDOFF.md:38` (the design-system line), `SCHEMA.md:108` (a copy rule whose
stated reason was "uppercase Montserrat"). And the internal comments in
`brand.js`, `site.css` and `content-case.js` that still named the pre-rename
files.

**In Oracle-Packaging-Skills** (three breaks, all fixed):

1. `listing/references/preview-and-publish.md:122` stripped
   `-e '<html lang="en" data-theme="dark">'`; the live page opens
   `data-theme="light" data-brand="ss26"`, so the exact-line strip would have
   left the `<html>` tag inside the published body.
2. The listing skill knew nothing about sentence case. `SKILL.md` and
   `listing-schema.md` now say it plainly: **write every string in sentence
   case, and never add rows to `content-case.js`** — that overlay is a one-time
   migration for pre-rebrand strings. Verified that this is safe for both
   themes: the four affected slots (`.product-title` via `.h1`, `.eyebrow`,
   `.hero-badges li`) are uppercased in CSS by the archived theme, so
   sentence-case data renders correctly in each.
3. `listing/assets/README.md` pointed at the skill's own stale fork of
   `check-grammar.js`, which has no brand assertions at all and would pass a
   listing the site's gate rejects. It now points at the site's copy, with the
   reason.

**Deliberately not "corrected":** every SoftServe hex in the packaging kit is one
channel step from the web token set (`1485C3`/`1485C4`, `F36949`/`F46A4A`,
`26282B`/`26292B`). Those values were measured out of SoftServe's *own EMEA
template*, so overwriting them with website values would make decks diverge from
SoftServe's master. `.claude/references/softserve-deck-kit.md` now records both
sets and says which to use where; the true-grey vs blue-tinted-ramp question is
flagged there as unresolved.

**Open, and bigger than a patch** — each needs an answer or a day, not an edit:

- `Oracle-Packaging-Skills/docs/packaging-approach.html` is the complete retired
  brand (Montserrat 900 uppercase, Open Sans, teal, `#0B0F14` ground). It is
  orphaned — referenced by no doc. Re-theme or delete: Alex's call.
- The one-pager template: uppercase section headings at `.14em`/`.20em`, a
  bold-sans H1 where the brand display face is a serif at 400, ~12 `border-radius`
  rules where the brand cuts corners, and the spark monogram in the CTA block.
  Not changed blind — it is a client deliverable and needs a render check.
- `softserve-deck-base.pptx`'s only layout forces `cap="all"` on the title. The
  web system is sentence case throughout, but the PowerPoint template may
  legitimately differ; needs the current template to confirm.
- Whether the spark/comet monogram is retired for print (spec confidence: MED).
- Whether the Lineto/Azurio licence permits embedding in a distributed PDF, now
  that the files are in the repo.
- Re-porting the skill's `check-grammar.js` from the site's current copy — a
  merge, not a copy, and worth a drift check in `sync-shared.sh`.

## 28. Round 9 — the home page re-argued: three layers, six groups, proof in weeks, 2026-09-22

**The asks** (Alex, in session; written up as `scratchpad/round9-brief.md`):

1. **The hero headline.** Sentence one says what we do, sentence two ties it to
   Oracle, and one or two words carry the differentiator the Oracle team values —
   one team expert in *both* AI and Oracle's platforms, so the customer gets the
   full power of Oracle AI, with a proof fast. The business wants proven ROI and
   fast proofs, but "ROI" is spam vocabulary: say the proof another way.
2. **The stack shows three real layers**, read bottom-up: Oracle platforms →
   SoftServe product groups → SoftServe service packs. And the cards must look
   solid — *"today there is a lot of empty space and it looks too technical for a
   front page."*
3. **"4–8 weeks" becomes "from 30 days"** in the stat strip, the *from* set small
   and the figure large.
4. **Two ways in.** The left title repeats the H1's *Enterprise AI agents and
   workflows* and its body speaks to what the products are worth; *"The people who
   build them"* is the wrong subheading — the right-hand panel is about the
   services.
5. **The products screen is one tile per group**: a hover effect, a relevant image
   (a software layout from a walkthrough where one exists, a placeholder where
   not), a one-liner a reader with zero context understands, and a click that
   opens the catalog filtered to that group. No product names on it.
6. **The case-studies rail** — *"What we've proven, and what we're proving now."*
   reads as a justification addressed to the site's owner. Rewrite it as a product
   marketer would.

**Mid-round corrections** (Alex, after both agents had launched; they supersede the
brief where the two differ, and the build followed the corrections):

- **Short platform labels.** The rail, the product chips, the tile band and the
  stack carry *AI Lakehouse · AI Data Platform · AI for Fusion Applications · OCI
  + NVIDIA NeMo*; the full Oracle product names stay on the Services cards and in
  prose. One canonical order on every surface, and *"tags on product pages exactly
  match these names."* Fusion stays in the set for the stack and the Services
  cards but is **not** offered as a catalog filter — no product runs on it.
- **Six groups, not five**, in a fixed order, and `chip` equals `full`: the tag on
  a product page is the group's exact name, not a short form of it.
- **The rail's *Availability* group becomes *Artifacts***, and the demo badge keys
  off the interactive walkthrough rather than the video flag — *"ERP Q&A has an
  interactive demo but no Demo tag."*
- **Both rails are fixed lists.** The catalog's *What it does* must list the six
  groups in that exact order, a zero-count option disabled and without a number.

**Split.** Fable: the survey of the built screens, the structure, the messaging and
every line of copy, then the final review before publish. Opus: agent A (the six
tile images), agent B (data, renderers, CSS, checker, QA) and these docs. **Agent B
stalled at the API level** — a stream watchdog, ten minutes with no progress —
after the build, the checker and the screenshot pass, with the docs not started.
The main session re-ran the three gates, did the 375/320 overflow probe, reviewed
the screens, published, and handed the docs to a fresh Opus agent. The round's own
instance of the standing rule that a background agent's silence is not progress
(START-HERE §7).

### 28.1 The decisions, and why

- **The H1 gets a third line.** *Enterprise AI agents and workflows. · Built on
  Oracle. · Proven in weeks.* Three sentences, three display lines, and only the
  middle one is the page's one accent (SS26 spends orange once per page). The
  differentiator Alex asked for moved into the lead rather than the headline,
  because the H1 budget is 15 characters a line: the lead now opens on *"One team
  that knows AI and Oracle's platforms to the same depth…"* **`proof` is a new
  headline key**, capped at three words by the checker; `rest` stays forbidden on
  the home H1.
- **Three layers, read bottom-up, and only one of them is written.** The top band
  is the four service packs (the one band whose names live in `content.js`); the
  middle band derives from `facets.categories` and the bottom from
  `facets.technology`, so the illustration can never name a group or a platform in
  words the rest of the site does not use. `stack.platformOrder` and the
  `stackLabel` idea from the first brief were both dropped in the addendum: the
  platforms render in the canonical facet order, and a platform has two forms of
  its name, not three.
- **The tiles were made solid.** One anatomy in all three bands — a white tile, an
  1.75 rem blue-tint icon well (the one decorative tint SS26 allows), the name
  pinned to the tile's foot at 13 px — with `grid-auto-rows: 1fr` and stretched
  content so the bands read as one block instead of three rows of cards with air
  under them. The product chips that used to hang inside the old top band are gone.
  Band heights became `auto` when the middle band went to six tiles in two rows:
  forcing `1fr` on all three would have padded the outer bands out again, which is
  the complaint this rebuild answers.
- **"from 30 days" is a headline, not a new commitment.** The stat tile leads the
  strip (so the two "30"s are not adjacent) and renders the qualifier at .45 em of
  the figure on its baseline. Every other surface keeps **4–8 weeks** — the ladder
  step, the seven product Jumpstart tabs, Services — and the checker still fails
  any other duration there. The two are a headline and a scope, not alternatives;
  the Internal panel's `pov-duration` item now says both.
- **The two ways in were re-pointed at value.** The left panel takes the H1's own
  words and says what a product *is* (an agent, or a workflow people and agents
  share, carrying the rules, review steps and checks its industry expects, on
  Oracle's own platforms); the right panel says what the services *are* (fixed
  scope, the same shape every time, the people who ran the Jumpstart carrying it
  into production). The H2 above them came down from 49 characters to 29.
- **Six groups, one per kind of job.** *Enterprise knowledge & analytics · Deep
  research & investigation · Document processing · Transaction & process execution
  · Forecasting & optimization · Video & image intelligence.* Each carries one
  sentence written for a reader with no context, its tile image, and the answer
  the catalog gives when a filter on it returns nothing. Two groups have no product
  today (transactions, video & image); their tiles land on that group's own empty
  state, which says what the practice delivers and what to tell us — never *yet*,
  *so far* or *coming*.
- **The case rail is reader copy now.** *Results on customers' own data* (30
  characters), a body that says what a card is — the industry, the workflow and the
  number it moves, marked proven, forecast or estimated — an NDA line that states
  the constraint and the offer in one, and a CTA that asks for something a reader
  wants (*Ask for a reference call*) rather than sending them to the method.
- **Tier vocabulary: *Scaling*.** The stack's top band says *Scaling*, so one page
  may not also say *Scale*. Nine tier **titles** were renamed —
  `overview.delivery.steps[2]`, `services.howWeEngage.steps[3]` and the seven
  `jumpstart.next[1].tier` — and no prose verb was touched (*scale it*, *may never
  need to scale* still read as written). The checker's `NEXT_TIERS` is now
  `["Integration", "Scaling"]`.
- **Short platform labels, full Oracle names where there is room.** `label` is what
  the rail, the chips, the tile band, `tags[1]` and the stack render; `fullLabel`
  is what the Services cards and the home page's *Platform depth* pillar carry, and
  the checker asserts that every `fullLabel` opens on "Oracle".
- **Fusion is in the set, not in the rail.** `catalog: false` keeps *Oracle AI for
  Fusion Applications* out of the filter group — a filter that can never return
  anything is not a filter — while leaving it on the stack and the Services cards,
  where it is a platform the practice delivers on. The checker allows that flag on
  that id alone, and fails a product that names a non-catalog platform.
- **Artifacts, and the demo badge fixed at its source.** The group is what ships
  *with* a product, so it is named for the things themselves: *Interactive demo* ·
  *Oracle Marketplace*. The badge and the filter now both read `demoUrl` — the
  walkthrough they open — where they used to read `video`, which only decides
  whether the product page carries a video frame. The two had drifted in both
  directions: *Account insights* carried a badge with no walkthrough, *Cross-system
  ERP Q&A* had a walkthrough and no badge. The full label shipped (nothing broke at
  375), on a new `cursor-click` glyph; `play` stays the glyph for a recording. The
  badge's click keeps working for all three demo products — on a product page with
  no video frame it opens the walkthrough itself, and `pages/product.js` now
  delegates to the same `UI.demoHref`, so the hero button and the badge cannot open
  different things.
- **Both rails are fixed lists.** Every platform a product can run on, every group,
  always in canonical order: the rail has one shape whatever the catalog holds
  today. A zero-count option renders disabled and prints no number, unless it is
  the one a deep link arrived on, which renders selected above its own empty state.
  This retires the hide-when-zero behaviour §18.9 introduced for the platform rail
  — the reason it existed (a `0` beside an Oracle product name reads as a
  scoreboard) is answered instead by printing no number at all. Neither rail ever
  prints a total.

### 28.2 Before and after — every string this round changed

Labels: **[site]** carried, re-cased or re-ordered, not rewritten · **[new]** copy
written this round (Fable) · **[alex]** Alex's own wording or instruction.

**S1 — hero** (`overview.hero`)

| Key | Before | After | |
|---|---|---|---|
| `headline.lead` | `ENTERPRISE AI AGENTS AND WORKFLOWS.` (re-cased by `content-case.js`) | `Enterprise AI agents and workflows.` — stored in sentence case | [site] |
| `headline.accent` | `BUILT ON ORACLE.` (re-cased by the overlay) | `Built on Oracle.` — stored in sentence case | [site] |
| `headline.proof` | — | `Proven in weeks.` | [new] |
| `lead` | *"Agents that read your contracts, plan your field workforce, answer questions across your ERP and tell your sellers what a market signal means for each account. Built on Oracle's AI platforms, run in your tenancy, measured on your data first."* | *"One team that knows AI and Oracle's platforms to the same depth, so you get the full power of Oracle AI — proven on your own data in a fixed-scope Jumpstart, then taken to production in your tenancy."* | [new] |
| `ctas` | *Explore the products* · *How we deliver* | unchanged | [site] |
| `stack.ariaLabel` | *"How they are built: the agents and workflows you can start with on top, grouped by the job they do, the SoftServe layer in the middle, the four Oracle platforms underneath"* | *"How it fits together, read from the bottom up: Oracle's four AI platforms, the SoftServe product groups built on them, and the SoftServe services that prove, integrate and scale them"* | [new] |
| `stack.patternsLabel` | *"Agents and workflows to start with"* | **deleted** (the top band is services now) | [alex] |
| `stack.softserve` | `{ label: "SoftServe", items: ["Agentic and data engineering", "Evaluation & guardrails", "Pilot to production"] }` | **deleted** | [alex] |
| `stack.services` | — | label *SoftServe services*, four `{ name, icon }` tiles: *Jumpstart proof of value* (`spark`) · *Integration* (`network`) · *Scaling* (`scale`) · *Managed services* (`managed`) — the last two glyphs drawn this round | [alex] |
| `stack.productsLabel` | — | `SoftServe products` | [new] |
| `stack.platformsLabel` | `Oracle platforms` | unchanged | [site] |

**The stat strip** (`overview.hero.stats`) — reordered, and one figure replaced

| # | Before | After | |
|---|---|---|---|
| 0 | `1,000+` · *experts in AI, data and R&D across SoftServe* | `from` `30 days` · *to a fixed-price proof of value on your own data* | [alex] |
| 1 | `30` · *Fortune 500 clients in the data and analytics practice* | `1,000+` · *experts in AI, data and R&D across SoftServe* | [site] |
| 2 | `4–8 weeks` · *to a fixed-price proof of value on your own data* | `30` · *Fortune 500 clients in the data and analytics practice* | [site] |

**S2 — two ways in** (`overview.twoWays`)

| Key | Before | After | |
|---|---|---|---|
| `title` | *"Start with a product, keep the team that built it."* (49 ch) | *"Products, services, one team."* (29 ch) | [new] |
| `panels[0].title` | *"Agents and workflows"* | *"Enterprise AI agents and workflows"* | [alex] |
| `panels[0].body` | *"Each one runs on Oracle in your own tenancy and starts with a Jumpstart on your data — at a fixed price where one is published, otherwise scoped per engagement."* | *"An AI agent, or a workflow where people and agents share the work, carrying what its industry expects: the rules, the review steps, the checks. Built on Oracle's own AI platforms, so all they can do is in the product, and started in weeks rather than from a blank page."* | [new] |
| `panels[0].bullets[0]` | *"Runs on OCI + NVIDIA or Oracle Autonomous AI Lakehouse"* | *"Best practice built in, from engagements already delivered"* | [new] |
| `panels[0].bullets[1]` | *"Extractions, plans and findings are approved by a person"* | *"Runs in your own tenancy"* | [new] |
| `panels[0].bullets[2]` | *"Scope, timeline and price on every product page"* | unchanged | [site] |
| `panels[1].title` | *"The people who build them"* | *"Services, from proof to scale"* | [alex] |
| `panels[1].body` | *"The architects and engineers who built them adapt them to your systems, rules and data — or build the one your workflow needs — and take them to production. One contract, one accountable team."* | *"Fixed-scope services, run the same way every time: a Jumpstart proves the value on your own data in weeks, then the people who ran it integrate it into your systems and scale it across the business — architects who know Oracle's platforms, engineers from our AI research group, and capacity that grows with the rollout."* | [new] |
| `panels[1].bullets[0]` | *"Delivered with Oracle's AI & Data organization, in joint teams"* | unchanged | [site] |
| `panels[1].bullets[1]` | *"Measured like for like against how you work today"* | *"Experts in both AI and Oracle's platforms"* | [new] |
| `panels[1].bullets[2]` | *"Configured to your rules, definitions and access model"* | *"Thirty years of enterprise integration behind every rollout"* | [new] |

The panels' `id`, `icon` and `cta` are untouched, and the layout is the same two
joined panels. **`panels[1].body` no longer carries the positive breadth clause**
*"or build the one your workflow needs"*, which HANDOFF §3 and §18.9 name as the
site's one cleared statement of breadth; `productsPage.bottomBlock.body` still
carries the same idea (*"…or what it would take to build one on your data"*), so
the rule holds, but the home page no longer states it. Flagged, not corrected.

**S3 — the products screen** (`overview.catalog`)

| Key | Before | After | |
|---|---|---|---|
| `eyebrow` | `Products` | unchanged | [site] |
| `title` | *"Agents that read, extract, plan and answer."* | *"Start from the job to be done"* (29 ch) | [new] |
| `lead` | *"Each one runs in your own Oracle tenancy. Open one for how it works, what it needs from you, and the Jumpstart scope."* | *"Every group is a family of agents and human-AI workflows for one kind of job, distilled from engagements already delivered: the rules, review steps and checks the job needs, on Oracle's AI platforms, proven on your data in a Jumpstart. Open a group to see its products."* | [new] |
| `patterns[3]` | three `{ id, definition }` columns | **retired** — the tiles derive from `facets.categories`, so the data carries no second list | [new] |
| `cta` | *See all products, with filters* → `#/products` | unchanged | [site] |

**The six groups** (`facets.categories`) — three entries became six; every `line`
and `emptyState` is [new], the names and the order are [alex]

| id | Before | After |
|---|---|---|
| `knowledge-analytics` | — | chip = full *Enterprise knowledge & analytics* · *"Plain-language answers and analysis over your governed data, from the ERP to the systems around it, with the source behind every answer."* · `groups/knowledge-analytics.jpg` |
| `deep-research` | chip *Deep research* / full *Deep research & investigation* | chip = full *Deep research & investigation* · *"Agents that read across your systems and outside sources and bring back a cited answer: an account brief, a case file, a variance explained."* · `groups/deep-research.svg` |
| `documents` | `processing-pipelines` — chip *Document processing* / full *Document processing & review* | id `documents`, chip = full *Document processing* · *"Long contracts and records turned into checked, structured data, every value traced to its page and approved by a reviewer."* · `groups/documents.jpg` |
| `transactions` | — | chip = full *Transaction & process execution* · *"Agents that carry a process step through to completion — an order, a claim, a ticket, a posting — inside your systems, with a person approving what moves."* · `groups/transactions.svg` |
| `forecasting-optimization` | `data-analysis` — chip *Data analysis & optimization* / full *Data analysis, answers & optimization* | id `forecasting-optimization`, chip = full *Forecasting & optimization* · *"Forecasts and plans computed against every constraint at once — demand, routes, shifts, allocations — for the people who own them to approve."* · `groups/forecasting-optimization.jpg` |
| `video-image` | — | chip = full *Video & image intelligence* · *"Cameras, footage and photos read by AI: defects spotted, scenes found, events flagged, for a person to confirm."* · `groups/video-image.svg` |

Each group's `emptyState` [new], rendered on `#/products?cat=<id>` when the filter
returns nothing and no other filter is on:

| id | `emptyState` |
|---|---|
| `knowledge-analytics` | *"Knowledge and analytics assistants are scoped per engagement. Tell us the questions your teams ask, and which systems hold the answers."* |
| `deep-research` | *"Deep research agents are scoped per engagement. Tell us the question your people spend days answering."* |
| `documents` | *"Document processing is scoped per engagement. Tell us the document type and the system it feeds."* |
| `transactions` | *"Transaction and process agents are scoped per engagement. Tell us the process step your people complete by hand today."* |
| `forecasting-optimization` | *"Forecasting and optimization is scoped per engagement. Tell us the plan your planners or dispatchers build by hand today."* |
| `video-image` | *"Video and image work is delivered as an engagement today, on OCI + NVIDIA NeMo. Tell us the footage or the inspection you have in mind."* |

**The platforms** (`facets.technology`) — one canonical order, two forms of each name

| Position | Before | After | |
|---|---|---|---|
| 1 | `oci-nvidia` *OCI + NVIDIA* | `oracle-ai-lakehouse` — label *AI Lakehouse*, fullLabel *Oracle Autonomous AI Lakehouse* | [alex] |
| 2 | `oracle-ai-data-platform` *Oracle AI Data Platform* | `oracle-ai-data-platform` — label *AI Data Platform*, fullLabel *Oracle AI Data Platform* | [alex] |
| 3 | `oracle-ai-lakehouse` *Oracle Autonomous AI Lakehouse* | `oracle-ai-fusion` — label *AI for Fusion Applications*, fullLabel *Oracle AI for Fusion Applications*, **`catalog: false`** | [alex] |
| 4 | `oracle-ai-fusion` *Oracle AI for Fusion Applications* | `oci-nvidia` — label *OCI + NVIDIA NeMo*, fullLabel *Oracle Cloud Infrastructure + NVIDIA NeMo* | [alex] |

Each facet's `description` and `emptyState` are unchanged [site]. The *OCI +
NVIDIA* → *OCI + NVIDIA NeMo* rename and the *Oracle Cloud Infrastructure +
NVIDIA* → *… + NVIDIA NeMo* full form are Alex's; casing stays **NVIDIA**.

**Artifacts** (`facets.availability`, `shared.tagFamilies.availability`)

| Key | Before | After | |
|---|---|---|---|
| `facets.availability.label` | `Availability` | `Artifacts` | [alex] |
| `options[0].label` | `Demo available` | `Interactive demo` | [alex] |
| `options[1].label` | `On Oracle Marketplace` | `Oracle Marketplace` | [alex] |
| `tagFamilies.availability.demo` | `{ label: "Demo", tooltip: "Demo available", icon: "play" }` | `{ label: "Interactive demo", tooltip: "Interactive demo — a guided walkthrough you can click through", icon: "cursor-click" }` | [alex] |
| `tagFamilies.availability.marketplace` | *Oracle Marketplace* / storefront | unchanged | [site] |
| `tagFamilies.pattern.icons` | 3 keys — `pattern-deep-research`, `pattern-processing-pipelines`, `pattern-data-analysis` | 6 keys — `pattern-knowledge-analytics`, `pattern-deep-research`, `pattern-documents`, `pattern-transactions`, `pattern-forecasting-optimization`, `pattern-video-image` | [new] |

**S4 — how we deliver** (`overview.delivery`)

| Key | Before | After | |
|---|---|---|---|
| `steps[2].title` | `Scale` | `Scaling` | [alex] |
| `why.pillars[0].body` (*Platform depth*) | *"…across OCI + NVIDIA, Oracle AI Data Platform, Oracle Autonomous AI Lakehouse and Oracle AI for Fusion Applications."* | *"…across Oracle Autonomous AI Lakehouse, Oracle AI Data Platform, Oracle AI for Fusion Applications and OCI + NVIDIA NeMo."* | [alex] |

`steps[0].fact` stays **4–8 weeks**, with the rest of the delivery copy untouched.

**S5 — case studies** (`overview.caseStudiesIntro`)

| Key | Before | After | |
|---|---|---|---|
| `title` | *"What we've proven, and what we're proving now."* | *"Results on customers' own data"* (30 ch) | [new] |
| `body` | *"Every customer is under NDA, so each engagement is described by industry and scale."* | *"Each card is one engagement: the industry, the workflow and the number it moves, marked as proven, forecast or estimated."* | [new] |
| `ndaLine` | *"Reference calls on request."* | *"Customers stay unnamed under NDA. Reference calls on request."* | [new] |
| `cta` | *How we measure it* → `#/services#how-we-engage` | *Ask for a reference call* → `#/#request-a-demo` | [new] |

The four cards are unchanged. **The rail's link out of the page is gone**: since
§18.8 the measurement method ships only on Services and this rail was the way to
it. The Services page is still reached from the hero's second CTA and from S4.

**The seven products** (`products[]`)

| Key | Before | After | |
|---|---|---|---|
| `shortLine` × 7 | one ≤ 12-word line per product, for the old catalog rows | **deleted** — no renderer reads it after this round | [new] |
| `category` | `processing-pipelines` → `documents` (large-document-extraction); `data-analysis` → `forecasting-optimization` (workforce-optimization); `data-analysis` → `knowledge-analytics` (cross-system-erp-qa, business-metrics-qa); `deep-research` unchanged on the other three | | [alex] |
| `categoryChip`, `tags[0]` | *Deep research* · *Document processing* · *Data analysis & optimization* | the group's full name: *Deep research & investigation* · *Document processing* · *Forecasting & optimization* · *Enterprise knowledge & analytics* | [alex] |
| `tags[1]` | *OCI + NVIDIA* (5 products) · *Oracle Autonomous AI Lakehouse* (2) | *OCI + NVIDIA NeMo* (5) · *AI Lakehouse* (2) | [alex] |
| `jumpstart.next[1].tier` × 7 | `Scale` | `Scaling` | [alex] |

**Services** (`services`)

| Key | Before | After | |
|---|---|---|---|
| `hero.platforms` | *OCI + NVIDIA* · *Oracle AI Data Platform* · *Oracle Autonomous AI Lakehouse* · *Oracle AI for Fusion Applications* | *Oracle Autonomous AI Lakehouse* · *Oracle AI Data Platform* · *Oracle AI for Fusion Applications* · *Oracle Cloud Infrastructure + NVIDIA NeMo* — the full names, canonical order | [alex] |
| `howWeEngage.steps[3].title` | `Scale` | `Scaling` | [alex] |

**The other two data files**

| File | Before | After | |
|---|---|---|---|
| `data/review.js` — item `pov-duration` | *"A PoV takes 4–8 weeks (to agree with delivery)"* | *"A PoV runs from 30 days (4–8 weeks, to agree with delivery)"* (59 ch, id unchanged) | [alex] |
| `data/content-case.js` | 45 RECASE rows, including `overview.hero.headline.lead` and `.accent` | 43 rows — the two hero rows deleted with the strings they patched; the header comment rewritten to say the overlay only shrinks from here, and that new copy is stored in sentence case in `content.js` | [new] |

### 28.3 The checker

New and rewritten assertions in `tools/check-grammar.js`, each commented with the
round that owns it:

- `PATTERN_IDS` → the six group ids, in site order; `facets.categories` must hold
  exactly those six in that order, each with `chip`, `full`, `line`, `image`,
  `emptyState`; `chip` must equal `full`; `line` must end in a period and run to
  **26 words or fewer** (em-dash parentheticals excluded from the count); `image`
  must match `assets/img/groups/<name>.<jpg|jpeg|png|webp|svg>` and warns, like any
  other asset, when the file is not on disk; `emptyState` fails on *yet*, *so far*,
  *coming*, *not seeing*.
- `FACET_IDS` → the canonical order Lakehouse → AI Data Platform → Fusion → OCI +
  NVIDIA NeMo; `FACET_LABELS` → the short labels; a new `FACET_FULL` → the full
  Oracle names, asserted on each facet's `fullLabel` and on
  `services.hero.platforms[].name`; a `fullLabel` that does not open on "Oracle"
  fails; `catalog` may only be `false` and only on `oracle-ai-fusion`; no product
  may carry a `facet` whose platform has `catalog: false`; `stackLabel` is retired
  and fails if it returns.
- `overview.hero.headline` needs `{ lead, accent, proof }`, `proof` ≤ 3 words,
  `rest` still a failure.
- `overview.hero.stack` needs `{ ariaLabel, productsLabel, platformsLabel }` plus
  `services` with exactly four `{ name, icon }` items; `patternsLabel`, `softserve`
  and `platformOrder` all fail if present.
- `stats[].prefix` is optional, must be a non-empty string ≤ 6 characters, and
  `stats[0]` must be exactly `{ prefix: "from", value: "30 days" }`; the round-7
  rule is inverted for this one tile — a hero stat stating *4–8 weeks* now fails,
  while every other surface must still state it.
- `overview.catalog.patterns` and `products[].shortLine` are retired and fail if
  they return.
- `facets.availability.label` must be *Artifacts*, its two options exactly
  `demo`/*Interactive demo* and `marketplace`/*Oracle Marketplace*, and the two
  badge definitions must carry those labels with the `cursor-click` and
  `storefront` glyphs.
- `config.products[<slug>].demoUrl` must be set for exactly the three products
  whose walkthrough ships under `site/demo/` (`DEMO_SLUGS`), and warns if the path
  is not on disk.
- Icon coverage extended: the stack's four service glyphs, the six `pattern-*`
  glyphs and the two badge glyphs must all be in the `ICONS` registry, and the four
  retired keys (`pattern-processing-pipelines`, `pattern-data-analysis`,
  `pattern-optimization`, `pattern-knowledge-assistants`) must be **out** of it — an
  icon no data can name is an unchecked icon.
- `NEXT_TIERS` → `["Integration", "Scaling"]`.
- **An H2 budget, enforced for the first time:** the three headings this round
  rewrote (`overview.twoWays.title`, `overview.catalog.title`,
  `overview.caseStudiesIntro.title`) fail over 30 characters; `overview.delivery.title`,
  `overview.about.title` and `overview.contact.heading` only warn, so old copy is
  visible as debt without failing the build.

`node --check` passes on all eight changed JS files. `node tools/check-grammar.js`
prints **OK** with three warnings, all expected: the two home H2s this round did
not touch (delivery 56 characters, about 61) and the Internal panel, which warns on
every run by design.

**Housekeeping closed the same session:** the addendum took the groups from five to
six, and four code comments still said *five* — the `PATTERN_IDS` and
`facets.categories` blocks in `tools/check-grammar.js`, `groupTiles()` in
`site/pages/overview.js`, and two rules in `site/assets/site.css` (`.home-hero-inner`,
`.gtile-foot`). The main session reworded all of them after the docs pass (comments only;
the checker still prints OK) and republished `site.css` and `overview.js` so the artifact
matches the tree.
### 28.4 QA and publish

Agent B's pass: screenshots of S1, the stat band, S2, S3 and S5 at 1440, 1280,
1024, 768 and 375, plus the H1 at 320, all taken at scroll 0 with the other
sections hidden and `is-in` forced on the reveals (`.work/qa/round9/`). One defect
found and fixed there: `hyphens: auto` on the stack tile name broke *image* to
*im-age* at 13 px, so the tile name now takes `overflow-wrap: anywhere` alone.

The main session's review, after agent B stalled:

- All three gates re-run — `node --check` on the eight changed files, the checker
  (OK, the three expected warnings), and the deny-list grep over `site/*.js`,
  `*.css`, `*.html`, which returned nothing.
- **The rail at 1440:** *Oracle platform* — All · AI Lakehouse 2 · AI Data Platform
  (disabled, no number) · OCI + NVIDIA NeMo 5. *What it does* — All · Enterprise
  knowledge & analytics 2 · Deep research & investigation 3 · Document processing 1
  · Transaction & process execution (disabled) · Forecasting & optimization 1 ·
  Video & image intelligence (disabled). *Artifacts* — Interactive demo 3 · Oracle
  Marketplace 2.
- **The badge derivation:** Large docs and Workforce optimization carry both
  badges, Cross-system ERP Q&A carries *Interactive demo*, and the other four carry
  none — the drift in both directions is closed. `#/products/cross-system-erp-qa`
  shows the chip row *Enterprise knowledge & analytics · AI Lakehouse · Interactive
  demo* with the `cursor-click` glyph and both hero buttons;
  `#/products/account-insights` shows no badge and one button.
- **The deep links:** `#/products?cat=video-image` renders zero tiles, that group's
  own empty state, the group selected in the rail and no count line;
  `#/products?cat=knowledge-analytics` renders *2 products*.
- `#/services` step titles read Discovery · Jumpstart proof of value · Integration ·
  **Scaling**. Console clean on every route visited.
- **The 375/320 probe:** at 375, `scrollWidth` equals `innerWidth` (375), the widest
  element is the masthead, the H1 sets 32 px over four lines, and the stat strip and
  the group tiles are both single-column. At 320, `scrollWidth` is 320 and the H1
  runs five lines — *Enterprise / AI agents / and workflows. / Built on Oracle. /
  Proven in weeks.* `#/products` is 320 wide too. The earlier `hero-375.png` that
  looked wider than its viewport was a capture artifact, not overflow.

Published from the main session to
**https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri** — the wrapper built with
exactly the nine skeleton lines stripped, and a `files` map of 14 entries: the
eight changed files plus the six new images under `assets/img/groups/`.

### 28.5 The six tile images (agent A)

960 × 600 (16:10) in `site/assets/img/groups/`; the full record, with the rejected
candidates and the clearance check, is in `docs/ASSETS.md`.

| File | Source | Crop | Bytes |
|---|---|---|---|
| `knowledge-analytics.jpg` | `steps/cross-system-erp-qa-1.jpg` (1600 × 1000) | none — already 16:10, resampled to 960 | 98,594 |
| `documents.jpg` | `posters/large-document-extraction.jpg` (1600 × 900) | 470, 275, 1000 × 625 | 114,514 |
| `forecasting-optimization.jpg` | `posters/workforce-optimization.jpg` (1600 × 900) | 0, 140, 1120 × 700 | 111,267 |
| `deep-research.svg` · `transactions.svg` · `video-image.svg` | drawn | — | 2,707 · 3,077 · 2,122 |

Both JPG crops are deliberate: the document crop starts at y = 275 because at
y = 250 the metadata row still exposed the walkthrough's synthetic counterparty
name, and the workforce crop starts at x = 0 to keep the app rail and exclude a
changes rail that would have left an orphaned figure in the corner. Frames
carrying the Oracle mark, a USD figure at the focal point or a modal dialog were
rejected; the brief's own first picks for two of the three lost to the posters.

The three placeholders are one design — an app-window wireframe in theme colours
with the group's line icon drawn large at 25 % opacity — differing only in the
content area, so three adjacent tiles do not read as duplicates.

**A tool note worth keeping:** `sips --cropOffset <y> <x>` on this Mac (sips-316)
is the crop's top-left origin in pixels from the image's top-left, *not* a shift
from the centre — except that exactly `0 0` is read as "unset" and falls back to a
centred crop, and negative offsets render black.

### 28.6 Open for Alex

1. **The H1's third line** ships as *"Proven in weeks."* (three words). Two-word
   alternatives, if the line should be shorter: *"Proven fast."* / *"Proof first."*
2. **"Document processing"** stays singular on the site, against Alex's
   *"Documents processing"*.
3. **The clock is stated two ways on purpose:** the hero tile says *from 30 days*,
   while the ladder step, the seven product Jumpstart tabs and Services all keep
   *4–8 weeks*. Both are still pending delivery's agreement (START-HERE §2).
4. **Platform short labels drop the "Oracle" prefix** on the rail, the chips, the
   tile band and the stack (*AI Lakehouse*, *AI Data Platform*, *OCI + NVIDIA
   NeMo*); the full product names stay on the Services cards and in prose. Oracle's
   own naming would want the prefix everywhere.
5. **Oracle AI for Fusion Applications is on the stack and the Services cards but
   is not a catalog filter** — a platform no product runs on.
6. **The Services platform cards are re-ordered** to the same canonical order the
   rail and the stack use (Lakehouse first; OCI + NVIDIA NeMo last).
7. **Two groups have no product today** — *Transaction & process execution* and
   *Video & image intelligence*. Their tiles land on the catalog's empty state for
   that group.
8. **Two other home H2s are over the 30-character budget** — delivery (56) and
   about (61). Untouched this round; the checker warns on both.
9. **"Oracle Marketplace" still renders for the two products flagged
   `marketplace: true`** while no listing URL exists (unchanged since round 4).

## 29. Round 10 — the product pages: one contact ask, a Use cases tab, and the frame as the block, 2026-09-23

**The asks** (Alex, in session; written up as `scratchpad/round10-brief.md`):

1. **The walkthrough button** takes the pointer glyph the *Interactive demo* badge
   already uses, and a shorter label that still says "interactive walkthrough, not a
   product, not a video".
2. **"Request a demo" is an open ask** — a call, a contact. Give it whatever CTA
   best practice says for an enterprise product sold by enterprise sales executives.
3. **Contacts.** Karsten's title becomes *Oracle Partnership Director, SoftServe*
   everywhere; the *Bring to the call* block comes off; the form's submit is the
   same CTA as the hero, because the flow is streamlined; the form's sub says that
   flow — a workshop first, then the scope of the proof of value; and the tab has
   two blocks: Karsten plus the request form as the main one, the sales kit for
   sellers as the secondary one.
4. **Overview.** The industry use cases and the case study move to a new **Use
   cases** tab. The How-it-works block is too small and its screenshot is shorter
   than the step list — *"the screenshots are the best thing on the page; make them
   look right."*

**Split.** Fable: the survey of the built screens, every decision below, every line
of copy, the code review of the shipped diff, the final visual review and the
publish. Opus: the build, the checker and the browser QA (agent 1), and these docs
(agent 2). **Agent 1's progress file went quiet for two hours during the QA stage**
while its transcript kept growing: it logged one line per stage rather than one per
screen, so the stall watch could not tell a long QA from a hang. The rule that came
out of it is in START-HERE §7 — a QA stage logs per screen.

### 29.1 The decisions, and why

- **One contact ask site-wide: *Talk to us*.** The header button already said it
  (`site.navCta`), so the product hero's primary button now reads the same words,
  and the Contacts tab's form heading and its submit button read the **same key**
  (`site.primaryCta.label`) rather than copies of it — three surfaces that cannot
  drift into three different asks. *Request a demo* is retired from `content.js`
  entirely and the checker fails the raw file on the string. The **route is
  unchanged**: the hero button still lands on that product's Contacts tab, and
  `overview.contact.anchor` is still `request-a-demo`, so no deep link moved.
- **The walkthrough button says *Interactive demo*** — the badge's exact words,
  under the standing rule that the walkthrough is an *Interactive demo* everywhere
  — with the `cursor-click` glyph **leading** the label and **no trailing
  `external` glyph**. One icon per button: the pointer is what says "a walkthrough
  you click", and a second glyph beside it only dilutes that. It still opens in a
  new tab, and the same button renders inside the pending-video modal.
  `shared.videoPending.cta` stays *Request a live demo* — a live demo is the right
  ask while the recording does not exist.
- **Contacts is two rows on one grid.** Row 1 is the main ask: the contact card
  left, and right the *Talk to us* heading, the new `forms.demo.sub` and the demo
  form. Row 2 is the secondary one: the product's sales kit, for a seller rather
  than a customer, in a full-width inset panel (`panel--kit-wide`, background
  `--bg-inset`) whose two columns carry **row 1's ratio and gap** (`.85fr /
  1.15fr`), so the tab reads as one grid instead of two panels that happen to sit
  above each other. Below 1100 px both rows stack — card, form, kit copy, kit form.
- **The *For sellers* tab is retired.** Its only content was the kit request, and a
  page that repeats one form under two names is a structure bug. `#/products/<slug>/sellers`
  now **redirects in place** to `…/contacts`, joining `/demo` and `/pov`. The
  `#/sellers` page, the footer link and *Get the full kit* are untouched. The tab
  was data, so the decision is reversible.
- **The kit's links point at the form, not at the route.** A same-route `ROUTER.go`
  re-renders the page and wipes whatever the reader has typed, so `routeLink` and
  `nextDemo` both carry `#/products/<slug>/contacts#talk`; the right column takes
  `id="talk"` and a `scroll-margin-top` of `--nav-h + 5rem` so the anchor lands
  clear of the masthead. `nextAll` still goes to `#/sellers`.
- **The card is no longer stretched to the form's height** (`align-items: start` on
  `.contact-split`, `flex: 0 0 auto` on `.contact-card--panel`). Stretching left a
  person's name floating above a field of empty inset — a card is not a container
  to fill. At 1440 the card now measures **390 px beside a 697 px form**.
- **The *Bring to the call* list is retired** from the data, the renderer and the
  CSS, on all three surfaces that render the card (the Contacts tab, Home S7,
  Services). It said the same thing three times over: the form's own message
  placeholder and the Jumpstart tab's *What we need from you* already ask for the
  workflow, the systems and the timeline. The card is a person, an address and one
  line; `blurb` was rewritten to carry the ask instead.
- **The Use cases tab** is the industry tabs block — its title now
  `sectionLabels.industryCases` = *By industry*, since the tab already says *Use
  cases* — then the case study, in a single column at the full content width with
  no rail. Four products carry `caseStudy: null` and render the industries block
  alone: **no empty state**, as everywhere else on the site. The two blocks moved
  because they answer a different question from the Overview's ("where does this
  apply, and has it worked?") and were pushing How it works out of the first screen.
- **The case-study callout got a wide variant.** In a 1,248 px column the round-4
  single-column anatomy fell apart, so the renderer now wraps its children in two
  containers — `.case-main` (eyebrow · medallion, descriptor and area · story · NDA
  line · link) and `.case-side` (status chip · figures · scope facts) — and
  `.case-callout--wide` makes `.case-body` a `minmax(0, 1.4fr) minmax(0, 1fr)` grid
  at ≥ 901 px, the evidence column top-aligned behind a 1 px `--border-subtle` left
  rule. Narrative left, evidence right, and the chip stays directly above the
  figures it qualifies. Below 901 px the two stack, main then side, and the rule
  becomes a top rule.
- **How it works — the frame becomes the block.** On a desktop the step heads are
  now a strip across the top, one grid cell each; the frame spans the whole row
  beneath them at the MAIN column's full width; and the open step's body sits under
  the frame, text at 3fr beside its feature list at 2fr. One markup, two layouts:
  `.stepper-list` and `.stepper-step` are `display: contents` at ≥ 901 px, which
  promotes the heads, the open body and `.step-frames` to children of the one grid,
  and the renderer emits `style="--steps: N"` to cut it into a column per step. A
  hidden body carries the `hidden` attribute and takes no cell. The head cells share
  a **continuous 2 px rail** (`box-shadow: inset 0 -2px 0`), `--action` under the
  active one — the site's own tab language — and every cell stretches to the
  tallest, so a two-line title does not drop its rule below its neighbours'.
  **Measured `.step-frame` on the large-document-extraction Overview: 803 × 503 at
  1440, 700 × 438 at 1280, 832 × 521 at 1024** (the rail collapses at ≤ 1100 px, so
  MAIN is the full column and the frame is *wider* at 1024 than at 1280). Before
  the round it was **404 × 253 at 1440 — shorter than the 380 px step list beside
  it**, which is the defect Alex named.
- **A step with no features renders no list.** The renderer emits no `<ul>` at all,
  and `.stepper-text:only-child` then spans both body columns — an empty list
  element left a 2fr column of air beside the text.
- **The stepper's keyboard handling takes both axes.** `roving()` grew from a
  boolean to an `axis` of `"horizontal"` / `"vertical"` / `"both"`, and the stepper
  passes `"both"`: its heads are a horizontal strip on a desktop and a vertical
  accordion below 901 px, and one component may not answer to different keys at two
  widths. Home and End are unchanged; the industry tabs stay horizontal.
- **Below 901 px nothing changed.** The same markup falls back to the accordion it
  has always been — a hairline-ruled list, each body under its own head, the frame
  after the list, no box-shadow rail.
- **The tab bar lost its lock branch.** `tab.locked` had been dead since round 8;
  the renderer's `lock` icon branch is gone and the checker now fails any tab
  carrying the key, so it cannot come back as data nobody renders.

### 29.2 Decided differently from the brief

The build agent's four departures, and one fix the main session made after the
build. The brief's decisions were otherwise built as written.

1. **`.case-callout--wide` got a `column-gap` and a single-column evidence
   column.** The brief specified only the two-column body. Inside the 480 px
   evidence column, two 40 px figures side by side — or the three-up scope grid —
   was unreadable, so `.case-figures` and `.case-scope` are each one column there,
   with the figures keeping their own row rhythm.
2. **The kit row's columns match row 1's ratio, not its pixels.** The inset panel's
   padding shifts the column boundary by about 7 px against the section above it.
   Removing the padding would align them exactly and lose the inset, which is what
   makes row 2 read as the secondary block.
3. **The dead `tab.locked` branch was removed** from `tabbar`, and `locked` is
   banned in data. The brief asked only for the old `sellersTab.locked` assertion
   to be replaced.
4. **The brief mis-named one QA product.** It called `business-metrics-qa` "no
   video, demo"; that product has neither. The video-less product with a
   walkthrough is `cross-system-erp-qa`, and that is the one QA covered in its
   place.
5. **`metricsNote` on `large-document-extraction`** said the figure was *"in the
   case study on this page"* — true until the case study left the Overview. It now
   reads *"…in the case study, on the Use cases tab."* A pointer across tabs is the
   cost of the split, and this was the only copy defect the move created; the main
   session found it in the final review and fixed it after the build.

### 29.3 Before and after, surface by surface

Labels: **[site]** carried unchanged · **[new]** copy written this round (Fable) ·
**[alex]** Alex's own wording or instruction.

**The hero CTA row** (`heroCtas`, and the same pair in the pending-video modal)

| Part | Before | After | |
|---|---|---|---|
| Primary button | `Request a demo` → that product's Contacts tab | `Talk to us`, same route | [alex] |
| Walkthrough button | `Try the interactive demo`, `iconAfter: "external"` | `Interactive demo`, leading `cursor-click`, no trailing glyph | [alex] |
| Pending-video modal | `Request a live demo` + the walkthrough button | `Request a live demo` unchanged, beside the new walkthrough button | [site] |

**The Overview tab**

| Column | Before | After |
|---|---|---|
| MAIN | Problem → Solution · How it works · Industry use cases · Case study · More detail | Problem → Solution · **How it works** · More detail |
| SIDE rail | Outcomes & ROI | unchanged |

And inside How it works:

| Part | Before | After |
|---|---|---|
| Layout | two columns — the step list at `1fr`, the frame at `1.1fr` beside it | one grid: heads in row 1, the frame across row 2, the open body across row 3 |
| Frame at 1440 / 1280 / 1024 | 404 × 253 / — / — | **803 × 503 · 700 × 438 · 832 × 521** |
| Active step's body | under its own head, in the left column | under the frame, text 3fr beside features 2fr; a text-only body spans both |
| Step head | a list row with a hairline | a strip cell with the number chip, `align-self: stretch`, on a continuous 2 px rail |
| Keyboard | ↑/↓ only | ←/→ **and** ↑/↓, Home, End |
| ≤ 900 px | the accordion | the accordion, unchanged |

**Use cases — the new tab** (`#/products/<slug>/use-cases`)

| Part | Before | After |
|---|---|---|
| Where it lived | both blocks in the Overview's MAIN column (803 px) | its own tab, single column at the full content width (1,248 px at 1440) |
| Block title | *Industry use cases* | *By industry* — the tab says *Use cases* |
| Case callout | one column, chip between the head and the figures | `.case-main` left · `.case-side` right behind a hairline, at `1.4fr / 1fr`; stacked below 901 px |
| Four products with `caseStudy: null` | the industries block alone in the Overview | the industries block alone on the tab — no empty state |

**The Contacts tab**

| Part | Before | After |
|---|---|---|
| Row 1 left | the card, stretched to the form's height, ending in the three-line *Bring to the call* list | the card at its own height — photo · name · title · mailto · blurb. **390 px at 1440** |
| Row 1 right | heading `forms.demo.secondaryHeading` (*SEND A REQUEST*), sub `forms.demo.secondarySub`, submit `labels.submitRequest` | heading and submit both `site.primaryCta.label` (*Talk to us*), sub the new `forms.demo.sub`, the column carrying `id="talk"`. **697 px at 1440** |
| Row 2 | — (the kit lived on the *For sellers* tab) | a full-width inset panel: eyebrow *For sellers* · H3 *Get the sales kit* · the body naming the product · the kit form, on row 1's ratio |
| Kit links out | *Request a demo* → the same route (a re-render that wiped the form) | *Use the form above* / *Talk to us* → `…/contacts#talk` |

**The tab bar**

| Before | After |
|---|---|
| Overview · Technology · Jumpstart · Contacts · For sellers | Overview · **Use cases** · Technology · Jumpstart · Contacts |
| `legacyId: "pov"` on jumpstart, `legacyId: "demo"` on contacts | `legacyIds: ["pov"]` and `legacyIds: ["demo", "sellers"]` — the singular key fails the build |
| a `lock` icon branch in the renderer for `tab.locked` | no branch, and `locked` in data fails the build |

**The contact card on Home S7 and on Services** — the same component, so both moved
with it: the *Bring to the call* list is gone, the card is no longer stretched, and
the title is the new one. Measured at 1440 on both: **card 390 px beside a 598 px
form**. Their form headings and subs are out of scope this round and unchanged —
Home S7 and Services still render `forms.demo.secondaryHeading` and
`labels.submitRequest` / `labels.submitContact`.

**The strings** (`site/data/content.js`, and one deletion in `content-case.js`)

| Key | Before | After | |
|---|---|---|---|
| `site.primaryCta.label` | *Request a demo* | *Talk to us* (route unchanged) | [alex] |
| `shared.productTabs` | five tabs ending in `sellers`, `legacyId` singular | five tabs with `use-cases` second and no `sellers`; `legacyIds` arrays | [alex] |
| `shared.contact.title` | *Alliances & Partnerships Director, SoftServe* | *Oracle Partnership Director, SoftServe* | [alex] |
| `shared.contact.blurb` | *"Bring the account and the workflow: a fit check, a live walkthrough, or the scope of a proof of value on your own data."* | *"Your first call for a fit check, a workshop with your team or the scope of a proof of value."* | [new] |
| `shared.contact.bringTitle`, `.bring[3]` | *Bring to the call* + three lines | **deleted** | [alex] |
| `shared.demoCta` | *Try the interactive demo* | *Interactive demo* | [alex] |
| `shared.sectionLabels.industryCases` | *Industry use cases* | *By industry* | [new] |
| `large-document-extraction` `overview.metricsNote` | *"…is in the case study on this page."* | *"…is in the case study, on the Use cases tab."* | [new] |
| `forms.demo.heading` | `REQUEST A DEMO` (re-cased by the overlay) | *Talk to us*, stored in sentence case | [alex] |
| `forms.demo.sub` | *"…One scoping conversation starts it — we come back with what a proof of value would cover, on your data."* | *"Tell us the account or workflow you have in mind. We start with a workshop with your team, then scope a Jumpstart proof of value on your own data."* | [new] |
| `forms.demo.submitLabel` | *Request a demo* | *Talk to us* | [alex] |
| `forms.demo.secondarySub` | the same sentence again, for the Contacts tab | **deleted** — the tab reads `sub` | [new] |
| `forms.demo.secondaryHeading` | `SEND A REQUEST` | unchanged — Home S7 and Services still render it | [site] |
| `forms.labels.submitDemo` | *Request a demo* | *Talk to us* (the `#/sellers` modal's submit) | [alex] |
| `forms.labels.submitRequest` | *Send the request* | unchanged (Home S7) | [site] |
| `salesKit.page.povLink` | *Request a demo* | *Talk to us* | [alex] |
| `salesKit.tab.routeLabel` | *Request a demo* | *Use the form above* | [new] |
| `salesKit.tab.nextDemo` | *"…a Proof of Value on the customer's own data runs 4–8 weeks and ends in measurable KPIs."* | *"…after a workshop, a Jumpstart proof of value on the customer's own data runs 4–8 weeks and ends in measurable KPIs."* | [new] |
| `salesKit.tab.nextDemoLink` | *Request a demo* | *Talk to us* | [alex] |
| `content-case.js` | 43 RECASE rows, including `["forms.demo.heading", "REQUEST A DEMO", …]` | **42 rows** — that one deleted with the string it patched | [new] |

No new duration reached the data: *4–8 weeks* is still the only one in scope copy,
and *from 30 days* still the hero's one figure.

### 29.4 The checker

Every rule above is an assertion in `tools/check-grammar.js`, each commented with
the round that owns it:

- `shared.contact.bring` and `.bringTitle` **fail if present**, naming why they were
  retired. This replaces the round-3 assertions that required exactly three lines.
- `shared.productTabs` ids must be exactly `overview, use-cases, technology,
  jumpstart, contacts` **in that order**; every tab needs a `label`; a tab carrying
  the singular `legacyId` fails, and so does one carrying `locked`;
  `jumpstart.legacyIds` must include `pov`, and `contacts.legacyIds` both `demo` and
  `sellers`. That replaced the old per-id presence checks and the
  `sellersTab.locked` rule.
- `site.primaryCta.label === site.navCta.label` — one contact ask site-wide.
- `forms.demo.submitLabel === site.primaryCta.label`; `forms.demo.secondarySub`
  fails if present; `forms.demo.secondaryHeading` must still be non-empty.
- `forms.demo.sub` must name both **workshop** and **proof of value** — the flow,
  stated once and in order (Alex, 2026-09-23).
- `shared.demoCta === shared.tagFamilies.availability.demo.label` — the button names
  what the badge names.
- `shared.sectionLabels.industryCases` fails on *use case* — the tab already says it.
- `salesKit.tab.routeLabel` must be non-empty, and `salesKit.tab.nextDemoLink` and
  `salesKit.page.povLink` must both equal `site.primaryCta.label`.
- The **raw text** of `content.js` fails on `/request a demo/i`. The
  `request-a-demo` anchor id keeps its hyphens and is deliberately not matched —
  keep it that way, because seven pages deep-link to it.

`node --check` passes on the five changed JS files. `node tools/check-grammar.js`
prints **OK** with three warnings, all pre-existing: the two home H2s over the
30-character budget (delivery, about) and the Internal panel, which warns on every
run by design.

### 29.5 QA and publish

**Agent 1's pass**, at 1440, 1280, 1024, 768 and 375, with the 1440 screenshots of
Overview, Use cases and Contacts saved to the scratchpad:

- the frame measurements in §29.1; the accordion verified at 768 and 375 (body under
  head, no rail, frame last); the tab bar scrolls at 375 (606 px of tabs in a 375 px
  viewport);
- the Use cases tab at the full content width, the wide callout splitting 672 / 480
  with its side rule;
- Contacts rows 1 and 2, the card at 390 px against a 697 px form with no stretch,
  and the kit's wrong-domain error routing through *Use the form above* to `#talk`
  at y = 96;
- routes: `…/sellers`, `…/demo`, `…/pov` and a nonsense segment all redirect in
  place; `#/sellers` opens the form modal headed *Talk to us*; the pending-video
  modal shows the walkthrough button only where `demoUrl` is set;
- console clean on `#/`, `#/products`, `#/services` and every product tab; the
  deny-list grep over `site/*.js`, `*.css`, `*.html` returns nothing;
- Home S7 and Services unregressed — card 390 px beside a 598 px form on both, no
  bring list, the new title.

**Its browser pane went hidden mid-run**, so its QA of Use cases and Contacts below
1440, and of the three other Overviews, was DOM geometry rather than pixels. The
main session then looked at Overview, Use cases and Contacts at 1440 and 375, the
stepper close-up at 1440, and the Home S7 and Services contact splits at 1440 — and
found the one copy defect the move created (§29.2, item 5).

Published from the main session to
**https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri** as **version 6**, with a
`files` map of the five changed site files; `list_files` afterwards showed the same
107 entries as before the round, every changed file at its new local byte size, and
nothing published that should not be.

**Repo housekeeping, same session:** `node --check` and `node tools/check-grammar.js`
were added as prefix rules to `.claude/settings.json`, so a subagent can run the two
gates without a permission prompt for each file.

### 29.6 Open for Alex

1. **Outside the product pages the same ask still has three other phrasings** —
   Home S7 *Send a request* / *Send the request*, Services *Let's talk* / *Request a
   scoping call*, and the footer and delivery screen *Request a scoping call*.
   Recommend unifying on *Talk to us* next round; this round's rule only binds the
   header, the product hero and the Contacts tab.
2. **The product *For sellers* tab is gone** — its kit is on the Contacts tab (row 2
   as this round shipped it, the second tab of a switch after Alex's review, §29.7)
   and the old route redirects in place. Reversible: the tab is data.
3. **The Overview rail is unchanged**, and its MAIN column is now Problem → Solution
   · How it works · More detail.
4. **The mailto subject for a product request now reads `Talk to us — <product>`**
   (no `formEndpoint` is configured, so a request still opens the visitor's mail
   client).
5. **A pointer now crosses tabs:** `large-document-extraction`'s `metricsNote` sends
   the reader from the Overview rail to the Use cases tab for the figure. It is the
   honest fix after the move, but it is the first cross-tab reference on a product
   page.

### 29.7 Alex's review the same day — the Contacts switch and the stepper's description (round 10b)

Alex reviewed version 6 within the hour. **Two corrections, in his words:**

1. *"Get the sales kit block should be visible without scroll down + having two
   active input forms on one screen is a bad practice. Maybe user can switch between
   talk to us and Get the sales kit (for sellers)."*
2. *"In How it works block, the description text is below the image and too far from
   heading, so context is lost; also that description doesn't look like description,
   more like a footnote."*

**Split.** Fable made both decisions and wrote `scratchpad/round10b-brief.md`; an
Opus agent built them. **The first build agent hung for twenty minutes on a
permission prompt** — a `cd … && grep …` shell call — and was stopped having changed
nothing; the relaunch was told to read with Read and Grep and to edit with Edit only,
and finished in 21 minutes. The main session wrote that lesson into the repo's
`CLAUDE.md` and allow-listed `grep` in `.claude/settings.json`.

#### The Contacts tab: one row, one form on the screen

- **Row 2 is deleted**, with `.panel--kit-wide`, `.kit-split` and `.kit-copy`. Two
  live input forms on one screen make the reader choose between two asks before
  reading either, and the second one was below the fold — the two halves of Alex's
  first correction, which one change answers.
- **The right column is a two-tab switch** on the theme's own segmented control
  (`.segmented` / `.segment`, capped at `max-width: 30rem` so two uppercase labels
  stay a switch rather than a band across the column): **Talk to us** (default,
  reading `site.primaryCta.label`) · **Get the sales kit** (reading
  `salesKit.tab.title`). `role="tablist"` on the control, `role="tab"` with
  `aria-selected` and `aria-controls` on each segment, `role="tabpanel"` on each pane
  with the inactive one carrying the `hidden` attribute, and ←/→ · Home · End through
  the existing `roving(…, "horizontal")`. **`.segment[aria-selected="true"]` now
  paints exactly like `[aria-pressed="true"]`**: the control is a toggle in one place
  and a tablist in another, and the two states are one appearance.
- **The Talk pane** carries `forms.demo.sub` and the demo form (submit
  `site.primaryCta.label`). **The kit pane**, `id="kit"`, carries the *For sellers*
  eyebrow, `salesKit.tab.body` with the product name, and the kit form.
- **Neither pane repeats a heading, and the card lost its *Contacts* H3.** The
  selected segment is the column's heading, and the tab is already called Contacts.
  That is also what levels the row: **card top and switch top both at 818.2 px at
  1440**. `contactSplit` keeps `cardHeading` optional, so Home S7 and Services are
  untouched.
- **Both forms are mounted at render**, open or hidden, and the switch is bound after
  them, so a switch never lands on an unbound field.
- **The anchor picks the tab**, in `mount`, before the router scrolls: `#kit` opens
  the kit pane, and everything else — `#talk` included — the ask. So
  **`salesKit.tab.routeLabel` became *Talk to us***, where round 10 had made it *Use
  the form above*: the kit's customer/partner line and its confirmation link both
  point at `…/contacts#talk`, which is now the other tab of the same switch, not a
  form one row up. The checker asserts `routeLabel === site.primaryCta.label`, which
  replaces round 10's weaker "non-empty" rule.
- Below 1100 px the row collapses as before: the card, then the switch and its open
  pane.

#### How it works: heads → description → picture

- **The rows were re-ordered** to heads (row 1) → the open body (row 2) → the frame
  (row 3). The description now sits directly under the step head it belongs to, and
  the picture closes the block. It had been under the picture, which is the distance
  Alex's second correction names.
- **The body is one column at body weight, not a footnote**: `.stepper-text` at
  `var(--fs-body)` — 20 px, `--text`, 27 px leading, `max-width: 44rem` — with the
  features list at `var(--fs-sm)` in `--text-body` and 1 rem glyphs; `gap: .75rem`,
  `padding: .25rem 0 0`. The 3fr/2fr split and the `:only-child` rule are gone. The
  frame takes `margin-top: .25rem` on top of the grid's 1 rem row gap, so there is
  1.25 rem between a description and the picture it describes. Measured at 1440: the
  body starts **16 px** under the heads row.
- **Decided differently from the brief: the frame is pinned by keeping the closed
  bodies' cell.** The brief's `min-height: 5.5rem` alone did not hold it — the three
  bodies run 94, 126 and 158 px, and the frame moved **64 px** between steps 1 and 3.
  At ≥ 901 px a closed body therefore keeps its grid cell —
  `.stepper-body[hidden] { display: flex !important; visibility: hidden; }` — so the
  row is as tall as the tallest step; `visibility: hidden` keeps those bodies out of
  the tab order and the accessibility tree, which the `hidden` attribute did before,
  and the `!important` is there to beat the global `[hidden] { display: none
  !important }`, scoped to one component at one breakpoint. **The frame top is now
  1538.8 px on every step.** The floor of `5.5rem` stays, for the product whose steps
  are all short.
- **Below 901 px nothing changed**: the accordion keeps its own order and sizes, and
  the archive theme never sees any of these rules.

#### Gates and publish

`node --check` on the three changed JS files; the checker prints **OK** with the same
three known warnings; the console is clean on every route; the deny-list grep returns
nothing. Looked at: both Contacts tabs at 1440, 1024 and 375 (switching, the keyboard,
the kit domain error and the kit confirmation both landing on the Talk tab,
`…/contacts#kit` opening on the kit tab) and the stepper at 1440 on a jpg product and
an svg one, plus 1280. **768 and 320 were not looked at this pass.**

Published from the main session to the same artifact
as version 7.

**Still open from this pass:** the pinned row buys a frame that never moves at the
price of **up to ~64 px of air** between a short description and the picture, on the
steps that are shorter than the tallest one. It is the trade Alex's correction
implies — the description reads as a description and the picture holds still — but it
is the one thing a later round could improve, by equalising the step descriptions
rather than the cells.
