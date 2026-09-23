# HANDOFF — Cross-system ERP Q&A walkthrough (third demo)

_Build spec written 2026-09-16 by the design session (Fable) after three Opus research legs (`.work/erp-qa/brief-A-pack.md` — the pack as pitched; `brief-B-ui.md` — what Autonomous AI Lakehouse and AI Data Platform actually are, UI inventory, measured style tokens; `brief-C-workflows.md` — where cross-system questions arise, the seven mappings, candidate workflows) and Alex's confirmation of the scenario. Opus builds from this file; Fable red-teams the first cut and reviews the final. Read `.claude/references/interactive-demo-playbook.md` first — the standing requirements and the pitfalls apply unchanged._

## 0. Decisions taken with Alex (2026-09-16)

- **Architecture: Autonomous AI Lakehouse + AI Data Platform (AIDP) + one thin Redwood-styled app, "Mapping review".** The Lakehouse alone covers the data layer (federation, Select AI, governance) but ships no business-user Q&A surface and cannot show cross-system lineage inside an answer; AIDP adds the Master catalog (glossary, synonyms — the reconciliation mechanism), Agent flows (text-to-SQL agent with a trace tree) and Agent Hub (the conversational surface). Neither product has a human review queue for entity resolution, so the steward's confirm/reject lives in a small APEX-style app — Oracle's own answer for a custom UI on the lakehouse.
- **The three surfaces are demoed as three apps, and switching between them is part of the demo** (Alex, on Q6). Each keeps its own product look; the tour crosses all three.
- **Oracle product names and interfaces are allowed and expected** ("Autonomous AI Lakehouse · Data Studio", "AI Data Platform · Agent Hub", "Select AI"); no Oracle logo files (we have none cleared), no customer mark anywhere, data files included (playbook rule 2 as corrected).
- **Estate:** Oracle Fusion Cloud ERP, JD Edwards EnterpriseOne, NetSuite, one in-house Oracle Database application (contracts and rebates), one non-Oracle CRM linked as an external table. Oracle apps plus one non-Oracle source, as the pack pitches.
- **Workflows:** supplier consolidation across systems (primary; carries the manual fix), consolidated close across charts of accounts (drill-down and reconciliation), the two-role governance proof (step 6). Intercompany matching and order-to-cash exceptions are saved questions for free exploration.
- **Figures:** no cleared outcome figure exists for this pack (site metrics ship `null`). The band shows synthetic coverage and counts only — no time-to-answer, no savings, no price, no delivery-time claim. Every synthetic figure is listed in §9.
- **No write-back, no gate on answers** (site scope: "the system retrieves, it does not act"; "no human gate"). The only human decision is the steward's, on the lakehouse mapping tables; the closing action is "Publish as certified view", never a posting to an ERP.
- **Site copy** (`site/data/content.js`, product `cross-system-erp-qa`) stays untouched unless the red-team finds a contradiction; step images and the poster are replaced with captures.

## 1. World

- **Company:** Norwell Group — a fictional multi-entity group (plants, distribution, services; no industry named). Group currency USD. Three operating entities on three ERPs after two acquisitions, one in-house Oracle application, one CRM.
- **Period:** Q3 FY2026 (1 Jul – 30 Sep 2026), close in progress; "today" is Tue 6 Oct 2026, 09:40.
- **Personas:** Dana Whitfield, Group Controller (the tour's user; role `CONTROLLER`, all entities, unmasked). Priya Natarajan, finance data steward (owns Mapping review; the fix in step 5 is recorded under her name). Marcus Bell, Regional analyst North America (role `ANALYST_NA`; rows limited to the North America entity, bank and tax fields masked) — the second role in step 6.
- **Entities and systems:**

| Entity | System | Currency | Objects in play | Feed into the lakehouse | Freshness (as of 09:40) |
|---|---|---|---|---|---|
| Norwell Europe (`NG-EU`) | Oracle Fusion Cloud ERP | USD, GBP | `AP_INVOICES_ALL`, `AP_INVOICE_LINES_ALL`, `POZ_SUPPLIERS`, `POZ_SUPPLIER_SITES_ALL_M`, `HZ_PARTIES`, `GL_BALANCES`, `GL_CODE_COMBINATIONS`, `GL_LEDGERS`, `GL_PERIODS`, `GL_DAILY_RATES` | Prebuilt Fusion pipeline (BICC extracts → OCI Object Storage → lakehouse), hourly | 12 min |
| Norwell North America (`NG-NA`, JDE company `00100`) | JD Edwards EnterpriseOne 9.2 | CAD | `F0411`, `F0101`, `F0911`, `F0901`, `F0006`, `F0010`, `F0008` | GoldenGate CDC | 4 min |
| Arden Services (`NG-SV`) | NetSuite | USD | `vendor`, `transaction`, `transactionLine`, `account`, `subsidiary`, `customer` | NetSuite pipeline (SuiteAnalytics Connect), every 30 min | 38 min |
| Contracts & rebates (in-house) | Oracle Database 23ai, schema `CRB` | USD | `CRB_CONTRACTS`, `CRB_REBATE_TERMS`, `CRB_SUPPLIER_XREF` | Database link | 2 min |
| CRM (non-Oracle) | Iceberg tables in object storage | — | `CRM_ACCOUNT`, `CRM_OPPORTUNITY` | External table, refreshed hourly | 1 h 05 min |

- **Certified views (schema `GOLD`)**, on signed-off definitions: `SUPPLIER_360`, `AP_INVOICE_X`, `SUPPLIER_SPEND_Q`, `DUP_INVOICE_PAIRS`, `COA_MAP`, `ENTITY_MAP`, `PERIOD_MAP`, `DOC_MAP`, `GROUP_TRIAL_BALANCE`, `CONSOLIDATED_PL`, `IC_MATCHES`, `O2C_EXCEPTIONS`, `MAPPING_DECISIONS` (13). Each carries an owner ("Group Finance"), a definition line and a "last changed" date — the semantic layer the answers cite.
- **The seven mappings** (brief C) are the model's content: chart of accounts → group account (`COA_MAP`); legal entity / business unit / JDE company (`ENTITY_MAP`); party identity across `POZ_SUPPLIERS` / `F0101` / `vendor` (`SUPPLIER_360`, with `MATCH_SCORE` and `MATCH_REASON`); item cross-reference (listed in the catalog, out of scope for the tour); currency and rates (`GL_DAILY_RATES`, Q3 average for the P&L); calendar and period (`PERIOD_MAP` — JDE's fiscal year starts in July, so JDE period 3 = calendar September); document types and status codes (`DOC_MAP`: JDE `RPDCT` PV/PR/PM ↔ Fusion `INVOICE_TYPE_LOOKUP_CODE` STANDARD/CREDIT/PREPAYMENT ↔ NetSuite VendBill/VendCred).

## 2. The value story and the KPI band

The improvement is what the lakehouse model makes visible that the systems cannot show one at a time. The band (Mapping review, top; shown before → after the refresh):

| Tile | Before (exact match, system by system) | After the refresh | Note |
|---|---|---|---|
| Sources in one governed model | 5 sources, 0 joined | 5 sources · 1 model · 13 certified views | count |
| Supplier records resolved to one golden record | 61.2 % | 93.2 % | 412 records: Fusion 188, JDE 131, NetSuite 93; "resolved" = in a cluster confirmed by tax id, a score ≥ 0.90, or a steward decision, or a verified singleton; 25 proposals (28 records) pending review |
| Unmapped local accounts in the consolidated P&L | 37 | 0 | 497 local accounts (Fusion 214, JDE 186, NetSuite 97) → 120 group accounts; 35 mapped by rule, 2 provisional and queued for review |
| Ledgers that tie to their trial balance | 1 / 3 | 3 / 3 | residual 0.00 after mapping and translation; before, JDE and NetSuite had unmapped residuals |
| Duplicate-payment pairs found across systems | — (not visible) | 14 | same golden supplier, same normalised invoice number, same amount ± 0.5 % after FX, different systems |
| Stalest source | 1 h 05 min (CRM) | 1 h 05 min (CRM) | freshness per source is a platform fact (CDC / pipelines), not a claim |

After the manual fix in step 5 (the steward rejects one false supplier match), the band recomputes: resolved 93.2 % → 93.7 % (two records become two verified singletons), pending 25 → 24, duplicate pairs 14 → 13, the consolidated "Orion" spend row splits in two. The direction does not matter; the recomputation does.

All KPIs are computed in the page from the arrays in `data.js` (playbook §4) — nothing typed in — with a small reconciliation test (`tools/erp-qa-check.js`, run with the Codex Node) asserting the values above.

## 3. Data model (`data.js`)

- `sources[]` — the table in §1 (id, name, system, kind, objects, rowCounts, feed, freshnessMin, currency).
- `views[]` — the 13 certified views (id, name, owner, definition, changed, sources[]).
- `glossary[]` — Master-catalog terms with synonyms: supplier = vendor = address book (`F0101` search type V); last quarter = Q3 FY2026 (1 Jul – 30 Sep); group spend = invoiced amount translated at Q3 average rate; paid = `AP_INVOICES_ALL.PAYMENT_STATUS_FLAG = 'Y'` / `F0411.RPPST = 'P'` / NetSuite `status = 'paidInFull'`; best accounts = CRM tier A; delayed order = promised date passed, not shipped.
- `suppliers[]` — ~60 golden parties with their system records (`{sys, id, name, taxId, bankLast4, city, country, spendLocal, currency}`); the rest of the 412 records are generated deterministically (seeded) into singletons and clusters so the counts in §2 hold. Names synthetic and neutral (Kestrel Components, Bramley Logistics, Tamsin Packaging, Halden Tooling, …). The false match: **Orion Fasteners Ltd** (Fusion `S-10422`, tax id ending 7741, Manchester) vs **Orion Fastening Systems Inc** (JDE address `AB 118207`, tax id ending 2210, Mississauga) — proposal score 0.86, reasons "normalised name 0.91 · city mismatch · tax id mismatch", status "review".
- `matches[]` — 212 proposals: 187 auto-confirmed (score ≥ 0.90), 25 pending (0.75–0.89); each with `records[]`, `score`, `evidence[]` ({kind: name|taxId|bank|address|contract, value, hit}), `spend` per system.
- `accounts[]` — the 37 formerly unmapped local accounts with proposed group accounts (`{sys, local, description, proposed, groupName, score, status: 'auto'|'review'}`); the 2 in review: JDE `8210` "Freight recoveries" → group `4190 Other operating income` vs `5120 Freight out` (0.71); NetSuite `6155` "Software subscriptions" → `6310 IT services` vs `6320 Software licences` (0.78).
- `ledgers[]` — per ledger: TB total local, rate, translated, mapped total, residual before/after, status.
- `pl[]` — consolidated Q3 P&L lines with per-source amounts (USD): Revenue 48.6 M (Fusion 27.9 · JDE 13.2 · NetSuite 7.5), COGS 31.1 M, Gross margin 17.5 M, Sales & distribution 5.2 M, G&A 3.9 M, R&D 1.8 M, Other opex 0.6 M, EBITDA 6.0 M; each line drills to source rows (`GL_BALANCES` / `F0911` / `transactionLine`) with the local account, the group account, the rate and the system on every row.
- `dupPairs[]` — 14 pairs (invoice numbers, amounts, systems, dates, status), one of them the Orion pair; `exposureUsd` sum for exploration (a data value, not a benefit claim).
- `questions[]` — the saved set (§4), each with `text`, `sql`, `columns`, `rows` (per role), `narrate`, `trace[]`, `freshness`, `glossaryHits[]`, `firewall`.
- `roles` — `CONTROLLER` and `ANALYST_NA`: row policy (`ENTITY IN ('NG-NA')`), masked columns (`BANK_ACCOUNT` → `••••`, `TAX_ID` → `**-***7741`), allow-list name `FIN_QA_V3`.
- `audit[]` — log rows (time, user, role, question, sqlHash, rows, allowed|blocked).
- `refreshStages[]` — five stages (§5 step 1). `decisions[]` — the log; `user` — Dana; `steward` — Priya.

## 4. The question set (Agent Hub, saved questions)

1. **Which suppliers do we pay from more than one system, and what did we pay them last quarter?** — the tour's question. 12 rows: golden supplier, systems (badges), records, Q3 spend USD, match score, status; Orion row flagged "review".
2. Show the consolidated Q3 P&L by group account with source attribution.
3. Which local accounts are still unmapped, and what did the model propose?
4. Same invoice number and amount paid in two systems this quarter.
5. Intercompany balances that do not match at quarter end (`IC_MATCHES`: matched / unmatched / timing difference).
6. Which delayed orders are hurting our best accounts? (`O2C_EXCEPTIONS` × CRM tier A — the site's own example.)
7. Top 20 suppliers by group spend in Q3.
8. Rebate terms we have not claimed this quarter (in-house `CRB`).
9. Suppliers whose bank account changed in the last 90 days, with payments since (masked for `ANALYST_NA`).
10. Show full bank account numbers for all suppliers — **blocked by SQL Firewall** for `ANALYST_NA` (allow-list `FIN_QA_V3`; logged), answered for `CONTROLLER` with the last-four column only.

Every answer: the generated SQL over `GOLD` views (realistic, readable, ≤ 25 lines), a trace (parse → glossary terms resolved → SQL generated → SQL Firewall check → executed, rows and ms → answer composed), the stalest source's "as of", source badges per row, Narrate text (two sentences), and an honest caveat line where one applies ("1 proposal in this set is pending steward review").

## 5. The three surfaces

**App switcher** (ours, not a product): a slim neutral strip above the product chrome — "Norwell Group workspace" left, three tabs with a product glyph and name: *Autonomous AI Lakehouse · Data Studio*, *AI Data Platform · Agent Hub*, *Mapping review*; the active tab underlined in Oracle red. It must read as a workspace launcher, not as part of any product.

**Surface 1 — Data Studio (Lakehouse).** Replicate from `ui-anatomy.md` (video leg) and `ui/manifest.md`: continuous dark L-shell (`#312d2a`), left nav (Launchpad, Data Load, Catalog, Data Analysis, Data Insights, Data Transforms, Data Share), page background `#eeedeb`. Screens: **Catalog** — mounted-catalog chips `FUSION_ERP` `JDE_E1` `NETSUITE` `CRB_INHOUSE` `CRM_ICEBERG`, search, entity-type pills, Filters facets, "Showing N entities", grouped results with initials avatars, row-count pills and "Updated N min ago"; the `GOLD` certified views listed with their definitions. **Data Load → Feeds**: the job card *Cross-system finance model (GOLD)* — last run, sources, a **Run now** button (step 1), a stage list with progress, and on completion a toast "Model rebuilt · 13 certified views · Open Mapping review". Optional, static: Data Analysis with the natural-language "Generate Query" field showing question 7 as SQL.

**Surface 2 — AIDP Agent Hub.** Replicate from the anatomy doc: cooler dark top bar (`#2c2d31`) over a light left nav (`#f8f6f5`), warm canvas (`#f1eeeb`), serif greeting ("Good morning, Dana"), a large prompt box, saved questions as chips, an agent card *Finance Q&A agent* (text-to-SQL over `GOLD`, connection `LAKEHOUSE_GOLD`). Answer anatomy borrowed from the Select AI chatbot: right-aligned question bubble → "Total rows: 12 | Displayed: 12 · as of 09:28 (stalest: CRM)" → result grid with a per-row **source badge** column → action chips **Explore / Explain / Code View / Trace** → Narrate toggle. *Explain* shows the glossary resolution; *Code View* the SQL; *Trace* the span tree in the Agent Studio Sessions style (durations, allow-list line); *Explore* opens the drill panel: source rows per system with the system on every row, the match evidence for a supplier, the reconciliation line for a P&L figure. Top right: user menu with **View as** (Dana → Marcus Bell, Regional analyst NA) — step 6. On every answer: **Publish as certified view**. Left nav: Home, Insights (three static dashboards: Supplier spend, Close status, O2C exceptions — the pack promises "two to three operational dashboards"), Catalog (a glossary glimpse), Sessions (the audit log).

**Surface 3 — Mapping review (Redwood app, APEX Redwood Light look).** White header with the app name and Priya's avatar, light page (`#f5f4f2`), Redwood buttons (dark filled primary), dense white tables. Content: the **health band** (§2, before → after tiles with ▲▼ deltas), then tabs **Supplier matches (25 to review)** · **Account mappings (2 to review)** · **Decisions log** · a **Re-run resolution** button. A proposal row: the records side by side with system badges, evidence chips (name 0.91 · tax id ✗ · bank ✗ · city ✗), score, spend per system, **Confirm / Reject / Merge into…** and a note field; rejecting with a reason adds a learned rule line ("Different tax ids never match") and a decision row (who, when, why). Re-run recomputes the band and the affected answers.

The reusable parts: the tour engine, click guard, passive steps, end card and URL switches from `site/demo/workforce-optimization/demo.js`; the KPI band and changes-list CSS from `demo.css`. Copy the engine, not the app.

## 6. The tour (six steps, value first)

1. **Refresh the model** (Data Studio · Feeds). 1a click **Run now** → five stages, ~1 s each: Sync sources (CDC · pipelines · links) → Resolve supplier identities (412 records) → Map accounts to the group chart (497 → 120) → Translate and reconcile ledgers (3) → Rebuild certified views (13) · SQL Firewall allow-list refreshed. 1b (auto) wait. 1c click **Open Mapping review** in the toast → the switcher moves to Mapping review. Call the state change before `tour.after()` (playbook pitfall).
2. **Review the improved metrics** (Mapping review · band) — passive, Next. Copy: what got better and why: identities resolved, accounts mapped, ledgers tie, duplicates surfaced.
3. **Ask across systems** (Agent Hub). 3a click the switcher tab *AI Data Platform · Agent Hub*; 3b click the saved question 1 → the answer renders with badges and the freshness line.
4. **See where each figure comes from.** 4a click **Trace** → SQL, glossary hits, firewall line, rows and ms; 4b click **Explore** on the Orion row → source rows in Fusion and JDE, the evidence, the "review" flag.
5. **Fix a mapping by hand** (Mapping review). 5a switcher tab; 5b open the Orion proposal; 5c **Reject** with the reason "Different tax ids — two companies"; 5d **Re-run resolution** → the band and the decisions log update; a toast says which answers changed.
6. **Prove the governance and hand off** (Agent Hub). 6a switcher tab; the answer to question 1 is now 11 rows (Orion split out); 6b **View as → Marcus Bell** → the same question re-runs: 4 rows, bank and tax columns masked, the trace shows the row policy and the masking; 6c **Publish as certified view** → toast "GOLD.SUPPLIER_MULTI_SYSTEM_Q3 added to the certified set". End card: what was shown, and the free-exploration hints (saved questions, the blocked question 10, dashboards, decisions log).

Skip = auto-perform, as before. Hints allow only the designated control; every other click is guarded.

## 7. Files, switches, tooling

- `site/demo/cross-system-erp-qa/index.html`, `demo.css`, `demo.js`, `data.js`; three `<section data-app="lakehouse|aidp|review">` panels, one visible; the switcher above them; Google Fonts blocked in captures, so the stack is `"Oracle Sans", -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` with Georgia for the Agent Hub greeting.
- URL switches: `?tour=off&ui=clean&state=start|refreshed|fixed|final&app=lakehouse|aidp|review&role=controller|analyst&q=1..10&panel=trace|explore|code`.
- `window.DEMO` API for the capture tool (`tools/capture-demo-frames.mjs`, `MODE=script`); scenario files `tools/capture-erpqa-tour.json` (tour regression, every sub-step, `LOGS: none` is the gate) and `tools/capture-erpqa-frames.json` (frames + poster).
- Node: `/Applications/Codex.app/Contents/Resources/cua_node/bin/node`. `node --check` on every JS file; `node tools/check-grammar.js` on the site.

## 8. Captures and wiring

- Four step stills + poster: 640 × 400 CSS-px crops at DPR 2 → 1600 × 1000 JPEG q86 ≤ 300 KB (`docs/ASSETS.md` §1). Each still matches its own step copy, not the tour order: (1) Data Studio Catalog with the five mounted catalogs and the job card; (2) the band after the refresh; (3) the same answer under the analyst's role — the "Viewing as Marcus Bell" chip, four NG-NA rows and the row-policy / masking banner; (4) the controller's answer at `state=final` — the freshness line, the three `GOLD` views and the rows with their source badges. Poster: the same answer with the question bubble, at 800 × 450.
- `site/assets/img/steps/cross-system-erp-qa-1..4.jpg`, `site/assets/img/posters/cross-system-erp-qa.jpg`; delete the four SVG illustrations; `content.js` step `image` fields → `.jpg`.
- `config.js` → `demoUrl: "demo/cross-system-erp-qa/index.html"`, `videoPoster`, and `demoPreviewUrl` once the standalone artifact exists (main session publishes; subagents never publish and never run git).

## 9. Synthetic figures (all invented; list for Alex)

412 supplier records (188 / 131 / 93) · 61.2 % → 93.2 % → 93.7 % resolved · 212 proposals (187 auto, 25 → 24 pending) · 497 local accounts → 120 group accounts · 37 → 0 unmapped (35 rule, 2 review) · ledgers 1/3 → 3/3 · 14 → 13 duplicate pairs · Q3 P&L: revenue 48.6 M USD (27.9 / 13.2 / 7.5), COGS 31.1 M, gross margin 17.5 M, opex 11.5 M, EBITDA 6.0 M · freshness 12 / 4 / 38 / 2 / 65 min · answer rows 12 → 11 (controller) / 4 (analyst) · 13 certified views · 10 saved questions · audit event numbers. No time-to-answer, price, savings or delivery-time figure anywhere.

## 10. Red-team checklist (Fable, on the first cut)

- Site copy, product `cross-system-erp-qa`: all seven `features` visible in the demo (prebuilt pipelines; one non-Oracle source; certified views on signed-off definitions; plain-English Q&A over the governed schema; two to three dashboards; masking by role in the data layer; a foundation that persists). Scope `out`: no live integration, no write-back, no production SLA claims. `moreDetail`: "no human gate" — the demo gates mappings, never answers; say so in the end card and the docs.
- Deck (`brief-A-pack.md`): GA features only — no "prebuilt agents", no invented native AIDP ↔ Lakehouse catalog sync (the Agent Hub agent reads `GOLD` through a catalog connection, which is real); never state "AIDP is Delta-only"; no price; no NVIDIA.
- Playbook rules 1–8: real product flow and screens (from the video frames), customer-agnostic, mocked I/O, six steps, one control per hint, value first, a dedicated metrics step, figures listed, Opus-by-default.
- Recognisability: a viewer who knows Data Studio or AIDP must recognise each surface; the three surfaces must not share chrome; the Mapping review app must look like a Redwood app, not like the two previous demos' Inter-based shells.
- Numbers: the band, the queues, the answers and the P&L reconcile before and after the fix (`tools/erp-qa-check.js` passes).

## 11. Work split and order

| Leg | Model | Input | Output |
|---|---|---|---|
| A. Video and UI reference | Opus | briefs, `ui/` | `.work/erp-qa/video/`, `.work/erp-qa/ui-anatomy.md` |
| B. Data model and reconciliation | Opus | this file §1–4, §9 | `data.js`, `tools/erp-qa-check.js` |
| C. Build (three surfaces, switcher, tour) | Opus | A, B, §5–7, the WfO engine | the four demo files, tour scenario, `LOGS: none` |
| Red-team | Fable | C's screenshots, §10 | gap list |
| D. Fixes, captures, wiring, docs | Opus | red-team list, §8 | stills, poster, `config.js`, `content.js`, README / CONFIG §3 / ASSETS §1 / PROVENANCE §22 (§20 and §21 were taken by two other sessions while this build ran) |
| Publish, review, wiki fold | Fable | D | standalone artifact, site artifact, `demoPreviewUrl`, wiki |

## Done — built, captured, wired and documented 2026-09-16

**Copy hygiene (leg D2, before capture).** Four on-screen notes that talked
about evidence, sources or design provenance were trimmed in
`site/demo/cross-system-erp-qa/demo.js` — the Live Feed job-card aside (kept
"Mocked run — no job is submitted and nothing is written back to any source
system"), the Explain panel's semantic-layer note, the catalog entity-page
footnote and the Reviewed-entities note. Only source-code comments still
mention what Oracle does or does not ship. The tour scenario was replayed at
1440 × 900 afterwards: `LOGS: none`.

**Files shipped.**

| File | Size | What it is |
|---|---|---|
| `site/assets/img/steps/cross-system-erp-qa-1.jpg` | 1600 × 1000, 203 KB | Data Studio › Catalog, five mounted catalogs (`state=start`) |
| `site/assets/img/steps/cross-system-erp-qa-2.jpg` | 1600 × 1000, 231 KB | The health band in full after the rebuild (`state=refreshed`) |
| `site/assets/img/steps/cross-system-erp-qa-3.jpg` | 1600 × 1000, 244 KB | "Guard it in the data layer": the answer seen as the regional analyst — role chip, four NG-NA rows, row-policy / masking banner (`state=final`, `role=analyst`, `q=1`) |
| `site/assets/img/steps/cross-system-erp-qa-4.jpg` | 1600 × 1000, 249 KB | "Ask in plain language": the controller's answer — freshness line, three `GOLD` views, seven of the eleven rows with source badges (`state=final`, `q=1`) |
| `site/assets/img/posters/cross-system-erp-qa.jpg` | 1600 × 900, 247 KB | The Agent Hub answer at `state=final`, 11 rows, controller |
| `tools/capture-erpqa-frames.json` | — | The frames-and-poster scenario (run at four viewports) |

The four `cross-system-erp-qa-*.svg` illustrations are deleted;
`site/assets/img/manifest-edits.json` was updated to the `.jpg` files. Capture
recipe, crop offsets and the reason for the four viewports: `docs/ASSETS.md` §1.

**Wiring.** `config.js` → `demoUrl: "demo/cross-system-erp-qa/index.html"`,
`videoPoster: "assets/img/posters/cross-system-erp-qa.jpg"`, `demoPreviewUrl`
left empty, `video` left `false`. `content.js` → the four step `image` fields
point at the `.jpg` captures; **the step copy is untouched**, per §0.

**QA.** `node --check` clean on `demo.js`, `data.js`, `config.js`,
`content.js`; `node tools/check-grammar.js` OK; `node tools/erp-qa-check.js`
267 assertions passing; the tour replay clean. The product page was verified
headlessly on `file://` at 1440 × 1000 — all four stills render on their steps,
the poster file loads, the demo button points at the local demo and opens a new
tab, no horizontal overflow, console clean. Screenshot:
`.work/erpqa-qa/product-page.png`.

**The step/still mismatch, closed 2026-09-17.** The first cut assigned the
stills in *tour* order, so step 4 — *"Ask in plain language"* — carried Mapping
review's recomputed band. `-3` and `-4` were re-shot against the copy at a new
868 px viewport (the answer card is exactly 640 px wide there): `-3` is now the
same question answered under the analyst's role — the "Viewing as Marcus Bell ·
Regional analyst NA" chip, "Total rows: 4", four NG-NA rows and the banner
"Rows are limited to NG-NA by the row policy; BANK_ACCOUNT redacted · TAX_ID
partially redacted" — and `-4` is the controller's answer at `state=final`.
`-1` and `-2` already fitted their copy and were not touched; the steward's
recomputed band is no longer a step still — the tour still walks it. Two things
do not fit 640 × 400 without cutting text and were dropped
deliberately — the Trace panel in `-3` and the question bubble in `-4`;
`docs/ASSETS.md` §1 records the measurements.

**Done by the main session, 2026-09-17:** the walkthrough is published as its own artifact (https://claude.ai/code/artifact/6c822cc7-1c05-4504-ad61-7b64c86e9ceb — filled into `demoPreviewUrl` in `config.js`, the README preview table and `docs/CONFIG.md` §3), the site artifact (https://claude.ai/code/artifact/41e4f3b6-47d9-4ef2-af99-99c40c02b89b) was read and republished as a full tree of 95 files with the four SVG illustrations removed, the demo artifact was checked in the viewer, and the wiki was folded. The list below is the plan that was executed.

1. Publish the walkthrough as its **own** artifact (wrapper-free copy under
   `.work/`, `demo.css` / `demo.js` / `data.js` as supporting files).
2. Paste that URL into `products["cross-system-erp-qa"].demoPreviewUrl` in
   `site/data/config.js`, and into the preview-links table in `README.md`
   (the cell currently reads "pending").
3. Read, then republish the **site** artifact with the new demo folder, the
   four frames, the poster, `data/config.js`, `data/content.js`,
   `assets/img/manifest-edits.json`, and `null` for the four removed `.svg`
   frames. Publish the full tree if another session may have touched the
   renderer files.
4. Fold the round into the context wiki with `context-update`.

## 12. Build notes (running record)

- **Leg A (video and UI reference), done 2026-09-16.** The yt-dlp standalone macOS binary (official GitHub release 2026.08.19, kept in the session scratchpad) fetched seven official Oracle videos without a sign-in wall; a Swift/AVFoundation tool cut 100 native key frames, 566 index frames and 31 contact sheets into `.work/erp-qa/video/` (268 MB, git-ignored). Videos: *Access Data from Anywhere with Oracle Autonomous AI Database Catalog: Demo* (Oracle, 2025-10-14, `XubFc-QHgsc`); *Short demo Ask Oracle App powered by Select AI* (Autonomous Database PM Team, 2025-11-14, `p595Io2cxyw`); *Build AI Agents with Oracle AI Data Platform: Demo* (Oracle, 2025-11-25, `hpjnIXpOd0E`); *How to Use Master Catalog, Workspace, and Compute in Oracle AI Data Platform* (Oracle, 2026-06-17, `3f-7RdriJ3Y`); *Oracle AI Data Platform: Lakehouse, Analytics, and Agentic AI Demo* (Oracle Developers, 2026-07-22, `ObsHJhduwwE`); *Autonomous Database Speaks "Human" using Select AI* (ADB PM Team, 2023-09-26, `htVeX8loT6c`); *Autonomous Database Data Studio Demo* (Oracle, 2023-11-06, `y1khmdbmze4`). Output: `.work/erp-qa/ui-anatomy.md` (704 lines), `video/index.md`, `video/log.md`. Not on any video: Data Analysis's natural-language field (only the 2023 build), Data Insights, Data Load/Connections, and — most important — the AIDP business glossary, ontology terms, synonyms, data products and lineage; those screens, the human review queue and per-row source badges are free design in the Workbench idiom. Three facts for the builder: the chrome is inverted between the products (Data Studio a continuous dark L with a right-aligned search; AIDP a dark bar over a light nav with a centred search); Oracle red is never a button; two builds exist for most surfaces and their colour systems do not mix (Jun-2026 Workbench shell for chrome, Nov-2025 footage for Agent flows and Agent Hub, one Ask Oracle theme per screen).
- **Leg B (data model), done 2026-09-16.** `data.js` 115 KB, `tools/erp-qa-check.js` 267 assertions passing. Deviations from §2–5, all accepted: the freshness stamp is computed per question from its own sources (question 1 → 09:02, NetSuite; question 6 → 08:35, CRM), superseding the "09:28" line in §5; the analyst's answer to question 1 is 5 rows before the fix and 4 after (the Orion JDE record is in North America until it is split); the 25 pending proposals cover 28 records; a documented provisional threshold of 0.85 rolls a proposal up provisionally and flags it, which is what makes "12 rows, one flagged review" true (two other pending scores lowered to 0.84 and 0.83); only 12 of 67 confirmed cross-system clusters answer question 1, because the `HAVING` is on Q3 invoices, not master data; `tbLocal` is the absolute Q3 movement across P&L accounts so mapped + residual = translated; account decisions are logged but do not move the P&L (only the Orion match decision recomputes the band). Additional synthetic figures, all derived in the file (add to §9): duplicate exposure USD 216,410 → 195,320; residual before the refresh USD 1,705,680.62; question 1 spend USD 8.6 M → 7.9 M; rebate entitlement USD 13,539.92 on 5 terms; O2C open value USD 588,250; paid-since USD 315,700; intercompany unmatched gap USD 46,800; top-20 share 30.6 %; 216 golden parties.
- **Leg A2 (gap search, after Alex's "search better + find decks with screens"), done 2026-09-16.** Sources: the 469-page *Using Oracle AI Data Platform Workbench* guide PDF (rev. G50054-32, 10 Sep 2026; `.work/erp-qa/decks/`), whose chapter 28 "Lineage (Preview)" has an HTML page with 14 unannotated product figures (`ui/aidp-lineage_*.png`); Oracle's *How Auto Populate Catalog Simplifies Metadata Management in AI Data Platform Workbench* (`lzxNqDYzd3o`) — the auto-populated catalog metadata with a Reviewed-entities accept/reject queue and column descriptions; Oracle's Data Analysis natural-language "Generate Query" doc figures (`ui/adb-dataanalysis-nl-*`); *Integrate, Load and Analyze all your data with ADB Data Studio* (51 min, `6fPVgyAvBqY`) for Data Insights, Data Load with the Live Feed sub-nav, Connections, Data Transforms job runs and the Catalog lineage overlay; an APEX 24.2 video (`kjeQ2AC3TFo`) for real Redwood Light app chrome; the Redwood tokens read out of `static.oracle.com/cdn/apex/26.1.0/themes/theme_42/24.2/css/Redwood.css` and cross-checked against Oracle JET (`.work/erp-qa/redwood-kit.md`, 678 lines). Findings that changed the build: **AIDP lineage is a real, documented screen** (column-level lineage, impact analysis, `AGGREGATION / IDENTITY / TRANSFORMATION`), so it is built to the letter; **the business glossary, ontology, taxonomy, AI-generated synonyms and data products do not exist in the shipped product** (zero hits in the whole guide; marketing copy only), so the demo presents the real mechanism instead — catalog descriptions and column annotations, auto-populated and reviewed, which the text-to-SQL agent reads; Select AI Agent is PL/SQL only (no designer in Database Actions); Live Feeds has entry points on video but is never opened, so the job card stays free design in that idiom; Agent Hub conversation detail and generated-SQL-in-an-answer stay unevidenced. Method note: Oracle's OCI doc sites have JavaScript tables of contents, so link crawling misses chapters — download the book PDF, grep its text, then fetch the HTML page of the chapter that matters.
- **Red-team of the first cut (Fable, 14 frames + copy scan), 2026-09-16.** Passed: three distinct, recognisable surfaces; the band and the passive metrics step; per-row source badges, trace with firewall and policy lines, drill to real object keys; the rejection recomputes band, duplicates and answer; the analyst view is row-limited and masked; no banned name, no € sign, no time-to-answer or savings copy; all seven site-copy features visible. To fix (leg D1): tile notes truncated mid-word; the step-6 callout hid the duplicate-pairs tile it described; wide answers showed seven of 26 rows; dashboard labels clipped; callouts covering the element the copy named; plus the leg A2 corrections (real catalog entity page and lineage instead of the invented glossary panel; honest semantic-layer wording; real Data Load labels and a Data Analysis screen; Mapping review restyled to the measured Redwood kit).

---

# Round 2 (2026-09-17) — revenue at risk across systems

_Alex's feedback on the shipped walkthrough: the AI was felt in one step only (the question), everything else read as ETL and admin; the opening should focus on the list of integrated sources; the steps were technical clicks, not a business task; and "reconcile the close for an accountant" is not AI-native and carries no high-ROI promise. Decisions taken with him in the widget: spine = **revenue at risk across systems** (the site's own decision-domain example, order-to-cash exceptions); the human override = **Dana declines one AI recommendation** (the steward's match rejection stays in free exploration); the fifth source: **customer contracts and service levels come from Oracle Enterprise Contracts in the Fusion tenancy, and the in-house Oracle database becomes a delivery-tracking application** (Alex, after the spec was first written: "could contracts be one of the Fusion apps?" — yes, Enterprise Contracts); the closing step = **an AI-generated dashboard**, viewed as the regional analyst before it is shared. Round 1's build (three surfaces, engine, switcher, lineage, catalog, Redwood app, governance) is kept; the content, the data domain, the AI framing and every hint change._

## R1. The root cause, and the design rule

The AI did its hardest work behind a progress bar ("model refresh") and showed reasoning only where the work was cheapest (a question → a table). The rule for this round: **the AI must be seen reasoning at every step** — scanning all systems, ranking by business impact, attributing a cause that sits in a different system from the symptom, recommending actions, recomputing when a person overrules it, and leaving artefacts (tasks, a dashboard) people use. The promise is an outcome (revenue protected), never hours saved. Every hint title is a business sentence in Dana's words; no hint says refresh, model, mapping, view or SQL.

## R2. World

- **Norwell Group** (unchanged), Tue 6 Oct 2026, 09:40. **Dana Whitfield, VP Commercial Operations** (role `COMMERCIAL_OPS`, all regions, unmasked). **Marcus Bell, Regional operations analyst, North America** (`ANALYST_NA`: rows limited to `NG-NA`; masked: CRM contact email and phone, credit limits, contract penalty terms). **Priya Natarajan**, data steward (owns the identity queues in the Decisions app; free exploration only).
- **Sources (five, freshness as before):** Norwell Europe on **Fusion Cloud** — SCM and ERP (`DOO_HEADERS_ALL`, `DOO_FULFILL_LINES_ALL`, `INV_ONHAND_QUANTITIES_DETAIL`, `EGP_SYSTEM_ITEMS_B`, `HZ_PARTIES`, `HZ_CUST_ACCOUNTS`, `PO_HEADERS_ALL`, `PO_LINE_LOCATIONS_ALL`, `AR_CUSTOMER_PROFILES` credit holds) **and Enterprise Contracts** (`OKC_K_HEADERS_ALL_B` customer contracts, `OKC_K_LINES_B` covered products and services, `OKC_K_ARTICLES_B` clauses — the delivery lead time and the late-penalty clause live here as clause text with variables, which the AI reads: "Delivery within 10 business days of order; late penalty 0.5 % of line value per business day, capped at 10 %"), 12 min; Norwell North America on **JD Edwards** (`F4201`, `F4211`, `F41021`, `F4101`, `F4104` cross-reference, `F0301`, `F0101`, `F4311`, `F03B11` open AR), 4 min; Arden Services on **NetSuite** (`transaction` type `SalesOrd`, `transactionLine`, `item`, `customer`, `inventoryBalance`), 38 min; **Delivery tracking** — an in-house logistics application on Oracle Database 23ai, schema `DLV` (`DLV_SHIPMENTS`: shipment, order reference, carrier, ETA; `DLV_SCAN_EVENTS`: scan time, location, status; `DLV_EXCEPTIONS`: exception code, reason), linked by database link, 2 min; **CRM** (non-Oracle, Iceberg external tables `CRM_ACCOUNT` with tier A/B/C, owner, region, annual revenue; `CRM_CONTACT`), 1 h 05 min.
- **Certified views (`GOLD`, 14):** `CUSTOMER_360` (identity across CRM / `HZ_PARTIES` / `F0301` / `customer`, `MATCH_SCORE`, `MATCH_REASON`), `ITEM_XREF`, `OPEN_ORDER_LINES_X` (three order books on one grain, statuses harmonised through `DOC_MAP`), `PROMISE_STATUS` (promised date vs predicted ship date), `STOCK_POSITION` (on hand by item × plant across systems), `LATE_CAUSES`, `SUPPLIER_DELAYS`, `CREDIT_HOLDS`, `TRANSIT_STATUS` (shipment scans and ETAs joined to order lines), `SLA_EXPOSURE` (from the Enterprise Contracts clauses), `REVENUE_AT_RISK`, `ACCOUNT_EXPOSURE`, `RECOMMENDED_ACTIONS`, `DECISIONS` — 14 views. Lineage graphs: `REVENUE_AT_RISK` ← `OPEN_ORDER_LINES_X`, `PROMISE_STATUS`, `CUSTOMER_360`, `CRM_ACCOUNT`, `SLA_EXPOSURE` (← `OKC_K_HEADERS_ALL_B`, `OKC_K_LINES_B`, `OKC_K_ARTICLES_B`); `STOCK_POSITION` ← `INV_ONHAND_QUANTITIES_DETAIL`, `F41021`, `inventoryBalance`, `ITEM_XREF`.

## R3. The AI analysis (the core object) and its figures — all synthetic

- **The ask (saved question 1, the tour's trigger):** "Which open orders are at risk this week, and which of our best accounts are exposed?"
- **Run card (Agent Hub, multi-agent, ~6 s):** Order agent — reads three order books (138 open lines past promise or predicted late; JDE 61, Fusion 49, NetSuite 28); Identity agent — resolves customers and items across systems (`CUSTOMER_360`, `ITEM_XREF`; 25 customer matches and 7 item cross-references left for a person); Cause agent — checks stock in every plant, late purchase orders, credit holds and the carrier scans in the delivery-tracking database; Impact agent — values each line and weighs it by account tier and contract penalty.
- **Findings:** revenue at risk **USD 4.18 M** on 138 lines; **tier-A accounts exposed: 9, USD 2.36 M**; SLA penalties exposed **USD 186 k** if nothing changes. **Causes** (reconcile to 138 / 4.18 M): stock available in another plant or system 44 lines / USD 1.52 M (the cross-system insight — the symptom is in JDE or NetSuite, the stock in Fusion); supplier late 31 / 0.94 M; credit hold 18 / 0.61 M; late in transit 45 / 1.11 M (shipped, but the carrier scans show the ETA past the promise date).
- **Recommended actions (4), each with owner, lines, value, affected accounts, status `proposed`, and "assigned as a task" — never an ERP write:** A1 Expedite from the plant that has stock (44 lines, USD 1.52 M, Supply planning, 12 transfers); A2 Re-promise the lines late in transit and alert the account owners (45 lines, USD 1.11 M, account owners from the CRM, 9 tier-A accounts; the carrier exceptions attached); A3 Review and release credit holds (18 lines, USD 0.61 M, Credit control); A4 Escalate six late suppliers (31 lines, USD 0.94 M, Procurement).
- **The band ("per system → across systems", six tiles; the AI's value is what only the join shows):** late lines known 61 + 49 + 28 → 138 in one ranked list; lines with an account tier 0 → 138; lines with a cause attributed 0 → 138; lines fixable from stock elsewhere 0 → 44; revenue at risk valued — → USD 4.18 M; tier-A exposure — → 9 accounts, USD 2.36 M. Stalest source CRM 1 h 05 min stays in the freshness line, not a tile.
- **Ranked accounts (top 12 shown):** Halden Tooling Group (tier A, JDE + Fusion, 4 lines, USD 412 k, penalty USD 31 k, cause: stock elsewhere, recommendation A1 expedite from EU-2) is the one Dana overrules; the others: Kestrel Components, Bramley Logistics, Tamsin Packaging, Ravenscourt Electrical, Wexford Industrial Supplies, Aldwych Chemicals, Marlowe Freight Services, Pentland Bearings, Calderwood Castings, Stanhope Instrumentation, Fenwick Industries (names reused, now customers; tiers and owners synthetic).
- **The override (step 5):** Dana declines Halden's recommendation with the reason "Customer accepted delivery on 20 Oct — no expedite". Re-analysis: those 4 lines become "re-promised, accepted" → revenue at risk USD 4.18 M → **3.77 M**, tier-A accounts 9 → **8**, lines fixable from stock elsewhere 44 → **40**, A1 12 → 11 transfers, penalties USD 186 k → 155 k; a learned rule "Accepted re-promise dates are not at risk" is kept; the decision is logged (who, when, why). Direction does not matter; the recompute does.
- **The generated dashboard (step 6): "Revenue at risk across systems"** — tiles (revenue at risk, tier-A exposure, lines fixable from stock elsewhere, SLA penalties exposed), charts (by cause, by entity, by account tier, top accounts), the actions table with status; built from the certified views listed under it; as Marcus: `NG-NA` rows only (JDE lines: 61 → after the override 57), contacts and credit limits masked, penalty terms hidden.
- **Saved questions (10):** 1 the ask above; 2 Which late lines have stock in another plant?; 3 Revenue at risk by account tier; 4 Late lines caused by late suppliers; 5 Tier-A orders on credit hold; 6 Accounts whose SLA penalties exceed USD 10 k; 7 On-time-in-full by entity, last four weeks; 8 Customers that exist in more than one system under different names; 9 Contacts for the affected accounts (masked for the analyst); 10 Credit limits for all accounts (**blocked by SQL Firewall** for the analyst, last-two-digits only for Dana).
- **Steward queues (free exploration, Decisions app):** 25 customer matches pending (one clearly wrong pair to reject), 7 item cross-references pending; decisions log.

## R4. Surfaces (what changes)

- **App switcher:** tabs *Autonomous AI Lakehouse · Data Studio* · *AI Data Platform · Agent Hub* · **Decisions · review & act** (the Redwood app, renamed; subtitle "what the AI proposes, what people decide"; no mapping-table vocabulary on the page).
- **Data Studio:** unchanged screens; the tour's step 1 is the **Live Feed page's five source cards** (name, system, feed, freshness) as "the list of integrated sources" — passive; the job card stays but the tour never runs it; the catalog lists the new `GOLD` views; lineage for `REVENUE_AT_RISK` and `STOCK_POSITION`; Data Analysis shows question 7.
- **Agent Hub:** home (greeting, Ask Oracle box, the 10 saved questions, the *Commercial operations agent* card, Today column with the tasks the AI assigned); the **run card** in Oracle's own pattern (agents with dotted sub-step timelines, in progress → done); the **analysis view** — headline line, the band, the narrative (Narrate), the causes chart, the ranked accounts table with per-account system badges and an Evidence button, the recommended actions list with owner and value, chips **Evidence / Explain / Trace / Create dashboard**; the **evidence panel** for one account: its order lines per system with real keys (`F4211.DOCO/LNID`, `DOO_FULFILL_LINES_ALL.FULFILL_LINE_ID`, NetSuite `transactionLine`), the stock found elsewhere with plant and quantity, the CRM tier and owner, the contract from Enterprise Contracts with the clause text the penalty was read from, and the late PO, the credit hold or the carrier scans where that is the cause; Trace = the four agents' spans with tools, the firewall line, the row policy and masking lines; **Insights** with the generated dashboard (generation progress ~2 s, "built from GOLD.REVENUE_AT_RISK, …") plus the two existing static dashboards renamed to the domain; **View as → Marcus**; **Share with the commercial team** (mock publish).
- **Decisions app:** header, the band (same six tiles), tabs **Recommendations (4)** · **Customer matches (25)** · **Item cross-references (7)** · **Decisions log**; a recommendation row: the action, the accounts and lines, the value, Accept / Decline with a reason field; Halden's row opens to its lines and evidence; **Re-analyse** recomputes through `decide()` and toasts what moved.

## R5. The tour (six steps, business titles)

1. **Everything you run on, in one place** (Data Studio · Live Feed): passive stop on the five source cards; copy names the five and says this is what lets an AI see across them. 1b click the switcher tab *AI Data Platform · Agent Hub*.
2. **Ask the AI what is at risk this week** (Agent Hub): click saved question 1 → the run card plays (four agents, sub-steps) → the analysis renders.
3. **Read what the AI found** (passive, Next): the band, the causes, the ranked accounts, the four actions.
4. **Check one finding before you trust it**: 4a click Evidence on Halden Tooling Group → the lines in JDE and Fusion, the stock sitting in EU-2, the tier and owner from the CRM, the contract clause and its penalty; 4b click Trace → why the AI ranked it there.
5. **Overrule the AI where you know better** (Decisions): 5a switcher tab; 5b open Halden's recommendation; 5c Decline with the drafted reason; 5d Re-analyse → the band and the actions move, the log records it.
6. **Give the team a dashboard, safely** (Agent Hub): 6a switcher tab; 6b click **Create dashboard** on the analysis → Insights shows the generated dashboard; 6c **View as → Marcus** → North America only, masked; 6d **Share with the commercial team** → end card: what the AI did (scanned five systems, valued 138 lines, attributed every cause, proposed four actions, built a dashboard) versus what Dana decided (one recommendation overruled), and the free-exploration hints (the steward queues, the blocked question, lineage).

## R6. API contract (leg E1 implements exactly; leg E2 builds against it before E1 lands)

All on `window.ERPQA_DATA`: `initialState()` → `{analysed:false, decisions:[], dashboard:false}`; `stateFor("start"|"analysed"|"decided"|"final")`; `runPlan()` → `[{id, agent, label, steps:[{text, ms}]}]` (4 agents); `analyse(decisions)` → `{asOf, headline:{lines, revenueUsd, tierA:{accounts, usd}, penaltiesUsd}, band:[6 × {id, label, perSystem, across, note, noteShort, dir}], causes:[{id, label, lines, usd, share}], accounts:[{id, name, tier, owner, region, entity, systems[], lines, usd, penaltyUsd, causeId, recommendation:{actionId, text}, status}], actions:[{id, title, owner, lines, usd, accountIds[], status, tasks}], narrative, caveat, trace:[{span, detail, ms}], freshness:{asOf, stalest, perSource, text}, views[], firewall:{allowList, status, rowPolicy, masking}}`; `evidence(accountId, role, decisions)` → `{account, lines:[{sys, object, key, item, qty, promised, predicted, status, usd}], stockElsewhere:[{sys, plant, item, onHand}], crm:{tier, owner, revenue, contacts(masked by role)}, contract:{leadTimeDays, penaltyPerDay, cap, exposedUsd}, supplierDelay|creditHold|null}`; `decide(state, {kind:"recommendation", accountId, action:"decline"|"accept", reason, by, at})` → `{state, decision, changed:{band[], actions[], accounts[]}, learned}` (pure; `ERPQA_DATA.haldenDecision` ready to pass); `decideMatch(state, {...})` for the steward queues; `matches[]`, `itemXrefs[]`; `answer(qid, role, decisions)` (shape as round 1); `dashboard(role, decisions)` → `{title, builtFrom[], tiles[], charts:[{id, type, title, series}], table}`; `dashboardPlan()` → steps for the generation progress; arrays `world, personas, roles, sources, views, glossary, records, customers, items, orderLines, stock, contracts, clauses, shipments, scanEvents, crmAccounts, purchaseOrders, creditHolds, questions, audit, decisions`; `fmtUsd/fmtM/pct1/maskText`. Every number in R3 is computed from the arrays and asserted by `tools/erp-qa-check.js` (rewritten). Deviations go to `.work/erp-qa/round2-api-notes.md`; E1 touches `.work/erp-qa/round2-data-done` when finished.

## R7. Red-team checklist (Fable, first cut)

The AI is seen reasoning at every step (run card, findings, causes, evidence, recompute, dashboard); no hint or label says refresh / model / mapping / view / SQL outside the Explain, Trace and Code panels; the opening focuses on the five sources; every step is a business task in Dana's words; the site's seven features still visible, the scope-out respected (no ERP write, actions are recommendations and tasks); GA only; figures reconcile before and after the override; no customer mark, no € sign, no time-to-answer, price or savings claim ("revenue protected if actioned" is the AI's estimate on synthetic data, labelled as such); the three surfaces still distinct and recognisable.

## R8. Build notes, round 2 (running record)

- **Leg E1 (data model), done 2026-09-17.** `data.js` 149 KB, `tools/erp-qa-check.js` 316 assertions passing. Accepted deviations from R6 (details in `.work/erp-qa/round2-api-notes.md`): `analyse(decisions, role?)` takes an optional role that only changes the firewall and policy lines; `fmtM` returns two decimals; `maskText(value, kind)`; trace rows carry `agent` and `tools[]`; action A2 reports 6 tier-A accounts, not 9 (the ninth is Halden, whose cause is stock elsewhere and whose action is A1); a decided account keeps its row with `status: "accepted"` and its previous figures; `orderLines[]` holds 142 rows (138 at risk plus 4 on-track lines that let an account be seen in two systems), `atRiskLines[]` is the filtered set; only a decline recomputes (accept logs the task); lineage lives in `views[].upstream`; roles `COMMERCIAL_OPS` / `ANALYST_NA` / `STEWARD`, allow-list `OPS_QA_V2`; `world.week` replaces `world.period`. Penalties are computed from the clause rate × business days late, so they land at USD 185,984 → 154,984 rather than the round 186 k → 155 k. Derived synthetic figures (add to the figures list): revenue at risk by entity NG-NA USD 1.966 M (47.0 %, 61 lines), NG-EU 1.454 M (34.8 %, 49), NG-SV 0.760 M (18.2 %, 28); 38 of 60 golden customers exposed (9 A / 16 B / 13 C); top-12 share 73.9 %, top-20 share 91.9 %; average line USD 30,290; average lateness 9.2 business days; penalties 4.4 % of exposure; 109 of 138 lines under a penalty clause; A1 moves 1,819 units, A2 raises 7 owner alerts with 15 carrier exceptions, A3 9 hold reviews, A4 6 supplier escalations; on-time-in-full latest week NG-EU 91.4 %, NG-NA 87.4 %, NG-SV 91.3 %; 126 customer records, 60 CRM accounts, 98 contacts, 40 items, 67 stock positions, 36 contracts and 108 clauses, 45 shipments, 195 scans, 15 exceptions, 6 purchase orders, 9 credit holds.
- **Leg E2 (UI build), done 2026-09-17.** The three surfaces rebuilt on the round-1 shell: Data Studio (Live Feed with the five source cards as the opening stop, the catalog and lineage on the new `GOLD` views), Agent Hub (home with the ten saved questions and the Today column, the multi-agent run card, the analysis view with band, causes chart, ranked accounts and the four actions, the evidence panel, Trace, the generated dashboard in Insights, View as, Share) and the renamed **Decisions · review & act** app (the same six tiles, Recommendations with Accept / Decline, the steward's customer-match and item-cross-reference queues, the decisions log, Re-analyse). Tour ids, fourteen steps under six majors: `sources` · `to-aidp` | `ask-q1` | `findings` | `evidence` · `trace` | `to-decisions` · `open-rec` · `decline` · `reanalyse` | `to-aidp-2` · `create-dash` · `viewas` · `share`. Regression: `tools/capture-erpqa-tour.json`, 57 shots per run, replayed at 1440 × 900, 1280 × 860 and 1024 × 800, `LOGS: none` at all three. Accepted deviations from R4–R5: the Live Feed **Run now** button is dropped (no refresh in this story); callouts that would cover the element their copy names are docked with `dock: "right"`; a recommendation card lists the accounts whose **dominant** cause that action answers, not every account it touches; the **Code View** chip is gone from the analysis view (the SQL lives in Trace); `panel=mcatalog` is the Master catalog switch, because `panel=catalog` is the Data Studio screen.
- **Leg E3 (fix, captures, docs), done 2026-09-17.** The red-team's one defect fixed at its root: `evidence()` now publishes `atRiskCount` and a per-line `wasAtRisk`, and relabels only the lines the AI valued, so a decided account keeps its own four lines everywhere (the card, the evidence summary, the evidence panel's status column, the struck-through analysis row, the dashboard's exclusion) instead of picking up the two on-track lines; the Decisions card reads the published count with no fallback. Toasts are capped at six seconds and cleared on an application switch. `tools/erp-qa-check.js` is at **329 assertions** (nine for the count invariant, four greps over `demo.js` for the count and toast rules). One CSS fix fell out of the capture: under 1120 px the five source cards were pinned to a height their content did not fit, so the second line of every description was cut through its glyphs — at the 1024 px QA viewport too; the cards are 160 px there now with the description capped at two whole lines and faded where there is more. All five images re-shot from a rewritten `tools/capture-erpqa-frames.json` at five viewports (852 / 676 / 868 / 1212 / 1440), each matched to its step copy; `manifest-edits.json`, `README.md`, `docs/ASSETS.md` §1, `docs/CONFIG.md` §3 and `docs/PROVENANCE.md` §22 (round-2 subsections 22.11–22.20) updated.

## Done — round 2 built, captured and documented 2026-09-17

The walkthrough, the data layer, the checks, the five images and the docs are
current on disk. `node tools/erp-qa-check.js` 329 assertions passing,
`node tools/check-grammar.js` OK, the tour clean at three viewports, the product
page verified headlessly (`.work/erpqa-qa/product-page-r2.png`).

**Done by the main session, 2026-09-17, round 2:** the standalone artifact (https://claude.ai/code/artifact/6c822cc7-1c05-4504-ad61-7b64c86e9ceb) and the site artifact (https://claude.ai/code/artifact/41e4f3b6-47d9-4ef2-af99-99c40c02b89b) were republished in place with the round-2 demo, the five re-cut images and the manifest, the demo was checked in the viewer, the "What the AI has to go on" copy nit was applied, and the wiki was folded. The list below was the plan:

1. **Republish the standalone walkthrough artifact in place** —
   https://claude.ai/code/artifact/6c822cc7-1c05-4504-ad61-7b64c86e9ceb still
   serves round 1's build. Read it first, then publish the wrapper-free copy
   with `demo.css` / `demo.js` / `data.js` as supporting files to the **same**
   URL, so `demoPreviewUrl` in `config.js`, the README preview table and
   `docs/CONFIG.md` §3 stay correct without an edit.
2. **Read, then republish the site artifact**
   (https://claude.ai/artifact/98wafGUphFSyGSr6ctJiiN) with the rebuilt demo
   folder, the four step frames, the poster and
   `assets/img/manifest-edits.json`. `config.js` and `content.js` are unchanged
   this round — the images kept their file names.
3. **Fold the round into the context wiki** with `context-update`.

---

# Round 3 (2026-09-17) — end card, step counter, interface fidelity

_Alex's feedback on round 2: (1) the end card reads as a justification of the build session, not what a user needs to see; (2) the counter says "Step n of 6" while many clicks happen inside one step, so several clicks pass with no visible progress; (3) the Oracle interfaces must match the real products exactly — "if something is still made up (sections, titles, layouts, etc.) tell me and explain why; I expect a full match"._

## R9. End card (replace the whole card)

- **Eyebrow:** Interactive walkthrough. **Title:** What you can act on now.
- **Body (three sentences, nothing else):** Five systems answered one question: which orders are at risk this week, and which accounts they put at stake. Every figure came with its cause and its source rows, you overruled the one thing the AI could not know, and your team has a dashboard that respects who is looking. Nothing was written to any system: the AI proposes, people decide.
- **Try next (three buttons, each opens the place):** Ask another question (Agent Hub home, the saved questions) · Open the Decisions queue (the customer matches waiting for a person) · See the dashboard (Insights). Then **Replay the walkthrough** (dark) and **Keep exploring** (ghost).
- **Footer (one line):** Demo data only: a fictional group with synthetic orders, contracts and shipments; nothing leaves this page.
- Delete the "What the AI did / What you decided" recap, the six-step list and the "Still open for you" paragraph. No figures on the card.

## R10. Step counter

- The card shows the major step and the position inside it: **"Step 4 of 6 · 2 of 3"** (majors keep the six business titles; the second number counts every sub-step of the major, passive ones included). The six progress segments fill fractionally as sub-steps complete, so every click moves something. The end card counts as complete.
- Same engine change offered for the Workforce optimization and Large docs walkthroughs (same pattern) — not applied unless Alex asks.

## R11. Interface fidelity (the audit and the fix)

Three read-only Opus auditors compare every Oracle surface element by element against the reference frames (`.work/erp-qa/fidelity/*-audit.md`, side-by-side sheets under `fidelity/sheets/`), classifying each difference as A (deviation with a reference → exact fix), B (invention without a reference → nearest real idiom and why), C (match). One Opus fixer applies every A item plus R9 and R10, re-runs QA at three viewports, re-cuts any still whose screen changed, and updates PROVENANCE §22 with the fidelity table. Fable reviews the sheets and the residual B list and reports them to Alex with reasons.

### R11 — what was applied (round 3, Opus fixer, 2026-09-17)

**A-items.** 123 of the 132 the three auditors listed are in the build: **35 of 35** on Data Studio, **64 of 66**
on the AI Data Platform, **24 of 31** on the Ask Oracle answer anatomy / the Agent-flow Trace / the Redwood
"Decisions" app. Every item any auditor marked "a user would notice" is applied. The nine that are not, and why,
are in `docs/PROVENANCE.md` §22.23 — the short version: `View as chart` would misdescribe what `Create
dashboard` does; an Insights breadcrumb would contradict the same audit's finding that Insights is an Agent Hub
tab; the `NL2SQL|GENAI` caption, the `Switch NL2SQL Profile` control and the `☑ Database ☐ Narrate` pair are
Select AI composer furniture and this shell's canonical frame is the Agent Hub conversation (so `Narrate` is a
chip instead); the Narrate audio player would play nothing; a full-page `Explain` and a docked Trace panel would
break the tour's one-control-per-step guard (the Trace's *contents* are the real trace); and the `Show Charts`
strip would duplicate the dashboard step.

**Decisions applied as given.** Oracle marks are in (the `ORACLE` wordmark as text in the Data Studio bar,
Oracle's white outlined ellipse in the Workbench bar, the Ask box and the composer; the red diamond tiles are
gone, no logo files). The Workbench nav carries Oracle's real sixteen-item roster in Oracle's order, `Sessions`
became `Audit logs`, `Insights` moved to the Agent Hub's dark bottom nav (`Home · Insights · Catalog · Teams`),
the conversation wears the plum bar, the run card kept its form but took every A-item, the Trace is the real
`Agent flow task | Duration | Tokens` shape with the metadata pane, `Evidence` became `Explore`, `Code View`
came back on the existing `.sqlbox`, the Redwood app lost every uppercase micro-label and gained its breadcrumb,
its 900-weight title, its alert style and its pale status pill, and the Data Studio A-list went in whole.

**B re-skins.** The Live Feed page's three inventions were re-drawn in the idioms the auditor named: the five
source cards in the Data Load home's four-card form, the model job as the dark-teal load-job accordion, the
certified-view grid as a Catalog entity list. The step-1 focus — five sources with their system, feed and
freshness — survives all three.

**Residual inventions (the list for Alex)** are in `docs/PROVENANCE.md` §22.23 with the idiom each is drawn in
and why it has to be invented: the Live Feed page itself (Oracle has never published a screenshot of it), the
multi-agent run card, the analysis card, the Explore panel, the Trace summary and firewall lines, the
sentence-shaped span names, the glossary cards under Explain, ten saved questions instead of two, the generated
dashboard, the View-as menu, the Decisions app's per-row Accept/Decline with a reason, the before→after band,
the Audit logs columns, the `Tokens` column that shows seconds (verbatim from the reference), and three inert
agent cards on the Hub. Two density deviations are stated rather than hidden: the nine-column ranked-accounts
grid runs denser than Oracle's four-to-six-column answer grids, and at 1024 px the five source cards are capped
at 134 px with the short pipeline names so the step-1 callout still fits under them in a 768 px viewport.

**R9 / R10.** The end card is R9 verbatim — three sentences, three doors that open the place, replay and keep
exploring, one footer line, no figures, no recap. The counter reads `Step 4 of 6 · 2 of 3` and the six segments
fill fractionally, so every click moves something.

**QA.** `node --check` clean, `tools/erp-qa-check.js` **343** assertions passing (fourteen new ones lock the
round-3 renames), `tools/check-grammar.js` OK,
`tools/capture-erpqa-tour.json` extended (the renamed panel, the APC list, the Hub bottom nav both ways, Code
View, Narrate — 62 shots) and replayed at 1440 × 900, 1280 × 800 and 1024 × 768 with `LOGS: none` at all three.

## Done — round 3 applied, captured and documented 2026-09-17

The interface fixes, the end card, the step counter, the five re-cut images and the docs are current on disk.
Before/after sheets for the ten screens that changed most: `.work/erp-qa/fidelity/sheets/` (before) and
`.work/erp-qa/fidelity/sheets-after/` (after).

**Done by the main session, 2026-09-17, round 3:** the standalone artifact (https://claude.ai/code/artifact/6c822cc7-1c05-4504-ad61-7b64c86e9ceb) and the site artifact (https://claude.ai/code/artifact/41e4f3b6-47d9-4ef2-af99-99c40c02b89b, merged on top of another session's newer version that had added `pages/sellers.js`) were republished with the round-3 demo and the five re-cut images, the demo was checked in the viewer, and the wiki was folded. The list below was the plan:

1. **Republish the standalone walkthrough artifact in place** —
   https://claude.ai/code/artifact/6c822cc7-1c05-4504-ad61-7b64c86e9ceb — read it first, then publish the
   wrapper-free copy with `demo.css` / `demo.js` / `data.js` as supporting files to the **same** URL, so
   `demoPreviewUrl`, the README preview table and `docs/CONFIG.md` §3 stay correct without an edit.
2. **Read, then republish the site artifact** (https://claude.ai/artifact/98wafGUphFSyGSr6ctJiiN) with the
   rebuilt demo folder, the four step frames, the poster and `assets/img/manifest-edits.json`. `config.js` and
   `content.js` are unchanged this round — the images kept their file names.
3. **Fold the round into the context wiki** with `context-update`.

---

# Round 4 (2026-09-17) — copy

_Alex's feedback on round 3: "the first screen + everything should not be so verbose." Every piece of
on-screen prose was counted against the playbook's rule 11 and cut to its budget, with no figure, object
name, Oracle label or disclaimer lost._

## R12. Word budgets, applied everywhere

**About 145 user-visible strings**, rewritten across `index.html`, `demo.js` and `data.js`.

| Where | Budget | Before → after |
|---|---|---|
| Gate body | ≤ 40 words | **123 → 39** ("You are Dana Whitfield, VP Commercial Operations. Three companies sell out of three ERPs, and it is Tuesday morning. Ask the AI what will go wrong this week, check one finding, overrule one, and hand your team a dashboard.") plus a separate line, "Six steps · about three minutes · only the highlighted control is active" (11) |
| Gate footer | ≤ 12 | **48 → 7** ("Demo data only. Nothing leaves this page.") |
| Hint titles | ≤ 6 | seven were over (max 9); all fourteen are now 4–6 |
| Hint bodies | ≤ 35, aim 25 | longest **99 → 30**; the fourteen average **47 → 24** (652 → 330 words in total) |
| End card body | ≤ 30 | **61 → 30**; the three doors ≤ 4 words each; footer **16 → 7** |
| Toasts | ≤ 15 | 24 rewritten; the longest (View as) **35 → 15** |
| Analysis narrative | 2 × ≤ 18 | **27 + 25 → 16 + 13** |
| Caveat | ≤ 16 | **19 → 16** |
| Action-card text | ≤ 12 + figures | the note **24 → 12**; "Assigned as a task. Nothing is written back to an ERP." (11) |
| "What the AI has to go on" | ≤ 20 | **28 → 17** |
| Source-card descriptions | ≤ 14 | 23 / 15 / 11 / 20 / 17 → **8 / 7 / 7 / 9 / 13**; the Fusion feed line 10 → **7** |
| Live Feed job paragraph | deleted | the five-stage list above it already says it |
| Catalog view descriptions | ≤ 16 | all fourteen rewritten, now 13–16 words each |
| Dashboard subtitle | ≤ 12 | 9 → **8** |
| Agent blurbs · Today's Tasks · helper, footer and empty-state lines | ≤ 12 · ≤ 10 · ≤ 12 | about forty lines cut, none now over its budget |

**Style.** Plain business sentences in Dana's words, one idea per sentence; no em-dashes, semicolons or
parentheses left in our own prose (Oracle's own product text, the real object names, the contract clause
bodies and the figures are untouched). Everything the screen already states was cut from the copy beside
it: the findings hint no longer recites the band's numbers, the evidence hint no longer lists the panel's
sections, and the "this is what lets one question cross all of them" style of explanation is gone
throughout. The AI framing now lives only in the verbs — read, resolved, attributed, proposes, re-values,
built.

**Layout.** `index.html` gained one element, `<p class="gate-steps" id="gate-steps">`, so the step-and-time
line reads apart from the body; `demo.css` gained the one rule that styles it; `tour.finish()` hides it on
the end card. `.job-note`'s CSS rule is now unused and harmless.

**One pinned string moved.** `tools/erp-qa-check.js` asserted the old caveat and the old drafted decline
reason verbatim; both assertions now pin the new strings. 343 assertions, all passing.

**Images.** `-1`, `-2`, `-3` and the poster were re-cut — `-4` shows only the Ask Oracle box and the run
card, whose copy did not change, so it is untouched. Same file names, same viewports and same offsets as
`docs/ASSETS.md` §1, with one boundary that moved: the poster's actions note is a line shorter, so the
1180 × 664 window at (233, 341) now ends just under the whole *Accounts, ranked by what is at stake*
heading instead of 4 px under the actions box — nothing is half a line either way. The five source cards
now fit their two-line clamp **with no fade at any viewport**, including the 896 px frame and the 1024 px
QA viewport; that is why three of the five descriptions were cut to ≤ 60 characters rather than only to
their 14-word budget.

**Deliberately left long.** The Explain panel's ten glossary definitions, the Enterprise Contracts clause
bodies and the Narrate lines of saved questions 2–10 keep their length: they are reference and product
text behind a deliberate click, off the tour path, and precision matters more there than brevity. The band
tiles' long `note` strings are `title` tooltips, never rendered on screen — the tiles show `noteShort`.

**QA.** `node --check` clean on `demo.js` and `data.js`; `node tools/erp-qa-check.js` **343 assertions
passing**; `node tools/check-grammar.js` OK (its one standing warning is the internal review panel, not this
demo). `tools/capture-erpqa-tour.json` replayed at **1440 × 900, 1280 × 800 and 1024 × 768** — 62 shots each,
`LOGS: none` at all three, including the "no callout covers the element its copy names" guard, which matters
this round because shorter cards move the callout geometry. Every step of the six was looked at by eye at
more than one viewport, the source cards and the poster crop measured rather than eyeballed. The product page was
verified headlessly on `file://` at 1440 × 1000: no horizontal overflow, the five assets load at
1600 × 1000 / 1600 × 900, the re-cut step-1 frame renders on *Connect the applications*, console clean
(`.work/`-free; the shots are in the session scratchpad). `site/assets/img/manifest-edits.json` was left as
it is — the four captions and alt texts describe the same screens and the same elements, which did not
change.

## Done — round 4 applied, captured and documented 2026-09-17

The copy, the four re-cut images and this note are current on disk. Still to do by the main session:

1. **Republish the standalone walkthrough artifact in place** —
   https://claude.ai/code/artifact/6c822cc7-1c05-4504-ad61-7b64c86e9ceb — read it first, then publish the
   wrapper-free copy with `demo.css` / `demo.js` / `data.js` as supporting files to the **same** URL.
2. **Read, then republish the site artifact** with the rebuilt demo folder, the three re-cut step frames and
   the poster. `config.js` and `content.js` are unchanged — the images kept their file names.
3. **Fold the round into the context wiki** with `context-update`.
