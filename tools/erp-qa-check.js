#!/usr/bin/env node
/**
 * erp-qa-check.js — reconciliation test for the Cross-system ERP Q&A demo,
 * round 2 ("revenue at risk across systems").
 *
 * Loads site/demo/cross-system-erp-qa/data.js into a bare `window` and asserts
 * every figure in HANDOFF-erp-qa-demo.md §R3, before and after Dana's override:
 * the 138 at-risk lines and their split across the three order books, the
 * USD 4.18 M at risk and the USD 3.77 M that is left, the nine tier-A accounts
 * and the eight that remain, the USD 186 k / 155 k of contract penalty, the
 * four causes and their money, the four actions and their tasks, the six band
 * tiles, the twelve internal transfers that become eleven, the steward queues,
 * the fourteen certified views, the ten saved questions, the block on question
 * ten for the analyst, the dashboard row-limited and masked for the analyst,
 * and the evidence behind Halden Tooling Group — including that a decided
 * account keeps its own four lines and never picks up the on-track ones. It
 * also greps data.js for names and symbols that must never appear, and demo.js
 * for the two rules that defect turned into: the card reads the count out of
 * the data, and no toast outlives six seconds or crosses an application.
 *
 *   /Applications/Codex.app/Contents/Resources/cua_node/bin/node tools/erp-qa-check.js
 *
 * One line per assertion; exit 1 if anything failed.
 */

"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.resolve(__dirname, "..");
var rel = "site/demo/cross-system-erp-qa/data.js";
var src = fs.readFileSync(path.join(root, rel), "utf8");
var sandbox = { window: {}, console: console };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: rel });
var D = sandbox.window.ERPQA_DATA;

var pass = 0, fail = 0;
function ok(label, cond, got) {
  if (cond) { pass++; console.log("PASS  " + label); }
  else { fail++; console.log("FAIL  " + label + (got === undefined ? "" : "   got: " + got)); }
}
function eq(label, actual, expected) { ok(label + " = " + expected, actual === expected, JSON.stringify(actual)); }
function m2(n) { return Math.round(n / 1e4) / 100; }      /* USD -> millions, 2 dp */
function k0(n) { return Math.round(n / 1000); }           /* USD -> thousands      */
function find(a, f) { return a.filter(f)[0]; }

if (!D) { console.log("FAIL  window.ERPQA_DATA is not defined"); process.exit(1); }

/* ------------------------------------------------------------- 0. states */
var S0 = D.stateFor("start"), S1 = D.stateFor("analysed"), S2 = D.stateFor("decided"), S3 = D.stateFor("final");
var A = D.analyse(S1.decisions);          /* before the override */
var B = D.analyse(S2.decisions);          /* after  the override */

console.log("\n-- state shape -----------------------------------------------");
eq("initialState().analysed", D.initialState().analysed, false);
eq("initialState().dashboard", D.initialState().dashboard, false);
eq("initialState().decisions", D.initialState().decisions.length, 0);
eq("stateFor('analysed') has no decision", S1.decisions.length, 0);
eq("stateFor('decided') carries one decision", S2.decisions.length, 1);
ok("stateFor('final') has the dashboard built", S3.dashboard === true && S3.decisions.length === 1);
eq("the ready-made decision is Halden's", S2.decisions[0].account, "Halden Tooling Group");
eq("its reason is the drafted one", S2.decisions[0].reason, "Customer accepted delivery on 20 Oct, no expedite");
eq("its action is a decline", S2.decisions[0].action, "decline");

console.log("\n-- 138 open lines = 61 + 49 + 28 -----------------------------");
eq("lines at risk", A.headline.lines, 138);
eq("at-risk lines in the array", D.atRiskLines.length, 138);
var sysA = {}; A.headline.systems.forEach(function (s) { sysA[s.id] = s; });
eq("JD Edwards lines", sysA.JDE.lines, 61);
eq("Fusion lines", sysA.FUSION.lines, 49);
eq("NetSuite lines", sysA.NETSUITE.lines, 28);
eq("61 + 49 + 28", sysA.JDE.lines + sysA.FUSION.lines + sysA.NETSUITE.lines, 138);
ok("every at-risk line carries a cause", D.atRiskLines.every(function (l) { return !!l.causeId; }));
ok("every at-risk line carries a golden customer", D.atRiskLines.every(function (l) { return !!D.customerById[l.customerId]; }));
ok("every at-risk line carries a real source key", D.atRiskLines.every(function (l) { return !!l.key && !!l.object; }));
ok("every line id is unique", (function () {
  var s = {}; D.orderLines.forEach(function (l) { s[l.id] = 1; }); return Object.keys(s).length === D.orderLines.length;
})());
eq("lines after the override", B.headline.lines, 134);
eq("JD Edwards lines after the override", find(B.headline.systems, function (s) { return s.id === "JDE"; }).lines, 57);

console.log("\n-- USD 4.18 M -> 3.77 M --------------------------------------");
eq("revenue at risk, USD", A.headline.revenueUsd, 4180000);
eq("revenue at risk in millions", m2(A.headline.revenueUsd), 4.18);
eq("revenue at risk after the override", m2(B.headline.revenueUsd), 3.77);
eq("the override removes exactly Halden's value", A.headline.revenueUsd - B.headline.revenueUsd, 412000);
ok("revenue at risk is the sum of the lines",
  A.headline.revenueUsd === D.atRiskLines.reduce(function (t, l) { return t + l.usd; }, 0));
ok("the three systems reconcile to the total",
  A.headline.systems.reduce(function (t, s) { return t + s.usd; }, 0) === A.headline.revenueUsd);

console.log("\n-- tier A: 9 accounts / USD 2.36 M -> 8 ----------------------");
eq("tier-A accounts exposed", A.headline.tierA.accounts, 9);
eq("tier-A exposure in millions", m2(A.headline.tierA.usd), 2.36);
eq("tier-A exposure, USD", A.headline.tierA.usd, 2360000);
eq("tier-A accounts after the override", B.headline.tierA.accounts, 8);
eq("tier-A exposure after the override, USD", B.headline.tierA.usd, 1948000);
ok("tier comes from the CRM account, not from an order book",
  D.crmAccounts.filter(function (a) { return a.tier === "A"; }).length >= 9);

console.log("\n-- SLA penalties USD 186 k -> 155 k --------------------------");
eq("penalties exposed, k", k0(A.headline.penaltiesUsd), 186);
eq("penalties after the override, k", k0(B.headline.penaltiesUsd), 155);
eq("the override removes exactly Halden's penalty", A.headline.penaltiesUsd - B.headline.penaltiesUsd, 31000);
ok("every penalty is the clause rate applied to the line value, capped",
  D.atRiskLines.filter(function (l) { return l.contractId; }).every(function (l) {
    var k = find(D.contracts, function (c) { return c.id === l.contractId; });
    return l.penaltyUsd === Math.round(Math.min(k.penaltyPerDay * l.daysLate, k.cap) * l.usd);
  }));
ok("lines with no contract carry no penalty",
  D.atRiskLines.filter(function (l) { return !l.contractId; }).every(function (l) { return l.penaltyUsd === 0; }));

console.log("\n-- causes 44 / 31 / 18 / 45 ----------------------------------");
var cA = {}; A.causes.forEach(function (c) { cA[c.id] = c; });
eq("stock elsewhere, lines", cA.stock.lines, 44);
eq("supplier late, lines", cA.supplier.lines, 31);
eq("credit hold, lines", cA.credit.lines, 18);
eq("late in transit, lines", cA.transit.lines, 45);
eq("44 + 31 + 18 + 45", cA.stock.lines + cA.supplier.lines + cA.credit.lines + cA.transit.lines, 138);
eq("stock elsewhere, USD M", m2(cA.stock.usd), 1.52);
eq("supplier late, USD M", m2(cA.supplier.usd), 0.94);
eq("credit hold, USD M", m2(cA.credit.usd), 0.61);
eq("late in transit, USD M", m2(cA.transit.usd), 1.11);
eq("the four causes reconcile to the total",
  cA.stock.usd + cA.supplier.usd + cA.credit.usd + cA.transit.usd, A.headline.revenueUsd);
ok("cause shares are computed from raw money, not rounded means",
  A.causes.every(function (c) { return c.share === Math.round(c.usd / A.headline.revenueUsd * 1000) / 10; }));
eq("lines fixable from stock elsewhere after the override",
  find(B.causes, function (c) { return c.id === "stock"; }).lines, 40);

console.log("\n-- the four actions ------------------------------------------");
var aA = {}; A.actions.forEach(function (a) { aA[a.id] = a; });
eq("four actions proposed", A.actions.length, 4);
eq("A1 lines", aA.A1.lines, 44);
eq("A1 value, USD M", m2(aA.A1.usd), 1.52);
eq("A1 transfers", aA.A1.transfers, 12);
eq("A1 owner", aA.A1.owner, "Supply planning");
eq("A2 lines", aA.A2.lines, 45);
eq("A2 value, USD M", m2(aA.A2.usd), 1.11);
ok("A2 attaches the carrier exceptions", aA.A2.exceptions > 0, aA.A2.exceptions);
eq("A3 lines", aA.A3.lines, 18);
eq("A3 value, USD M", m2(aA.A3.usd), 0.61);
eq("A3 owner", aA.A3.owner, "Credit control");
eq("A4 lines", aA.A4.lines, 31);
eq("A4 value, USD M", m2(aA.A4.usd), 0.94);
eq("A4 escalates six suppliers", aA.A4.tasks, 6);
eq("A4 title names the count", aA.A4.title, "Escalate six late suppliers");
ok("every action is a proposal, never a write-back",
  A.actions.every(function (a) { return a.status === "proposed" && /task/i.test(a.assigned) && !/write|post|update/i.test(a.title); }));
eq("A1 transfers after the override", find(B.actions, function (a) { return a.id === "A1"; }).transfers, 11);
eq("A1 lines after the override", find(B.actions, function (a) { return a.id === "A1"; }).lines, 40);
ok("the twelve transfers cover the 44 stock lines",
  D.transfers.reduce(function (t, x) { return t + x.lines.length; }, 0) === 44 && D.transfers.length === 12);
ok("Halden's four lines are one transfer of their own",
  (function () { var t = find(D.transfers, function (x) { return x.id === "T-4801"; });
    return t.lines.length === 4 && t.from === "EU-2" &&
      t.lines.every(function (id) { return D.lineById[id].customer === "Halden Tooling Group"; }); })());

console.log("\n-- the band: per system -> across systems ---------------------");
eq("six tiles", A.band.length, 6);
var bA = {}; A.band.forEach(function (t) { bA[t.id] = t; });
eq("late lines known, per system", bA.lines.perSystem, "61 + 49 + 28");
eq("late lines known, across", bA.lines.across, "138");
eq("lines with an account tier, per system", bA.tier.perSystem, "0");
eq("lines with an account tier, across", bA.tier.across, "138");
eq("lines with a cause attributed, per system", bA.cause.perSystem, "0");
eq("lines with a cause attributed, across", bA.cause.across, "138");
eq("lines fixable from stock elsewhere, per system", bA.stock.perSystem, "0");
eq("lines fixable from stock elsewhere, across", bA.stock.across, "44");
eq("revenue at risk, per system", bA.revenue.perSystem, "—");
eq("revenue at risk, across", bA.revenue.across, "USD 4.18 M");
eq("tier-A exposure, per system", bA.tierA.perSystem, "—");
eq("tier-A exposure, across", bA.tierA.across, "9 accounts · USD 2.36 M");
ok("every tile carries a note and a short note",
  A.band.every(function (t) { return t.note && t.noteShort && t.dir; }));
var bB = {}; B.band.forEach(function (t) { bB[t.id] = t; });
eq("after the override, late lines known", bB.lines.across, "134");
eq("after the override, per system", bB.lines.perSystem, "57 + 49 + 28");
eq("after the override, stock elsewhere", bB.stock.across, "40");
eq("after the override, revenue at risk", bB.revenue.across, "USD 3.77 M");
eq("after the override, tier-A exposure", bB.tierA.across, "8 accounts · USD 1.95 M");

console.log("\n-- the ranked accounts ---------------------------------------");
var TOP12 = ["Halden Tooling Group", "Kestrel Components", "Bramley Logistics", "Tamsin Packaging",
  "Ravenscourt Electrical", "Wexford Industrial Supplies", "Aldwych Chemicals", "Marlowe Freight Services",
  "Pentland Bearings", "Calderwood Castings", "Stanhope Instrumentation", "Fenwick Industries"];
eq("the top twelve are the twelve named accounts, in order",
  A.accounts.slice(0, 12).map(function (a) { return a.name; }).join(" | "), TOP12.join(" | "));
var H = A.accounts[0];
eq("Halden is first", H.name, "Halden Tooling Group");
eq("Halden tier", H.tier, "A");
eq("Halden lines", H.lines, 4);
eq("Halden value, USD", H.usd, 412000);
eq("Halden penalty, USD", H.penaltyUsd, 31000);
eq("Halden cause", H.causeId, "stock");
eq("Halden trades in JD Edwards and Fusion", H.systems.join("+"), "JDE+FUSION");
eq("Halden's recommendation is A1", H.recommendation.actionId, "A1");
ok("Halden's recommendation names the plant that has the stock", /EU-2/.test(H.recommendation.text), H.recommendation.text);
ok("every ranked account carries tier, owner, region and a cause",
  A.accounts.every(function (a) { return a.tier && a.owner && a.region && (a.causeId || a.status !== "at-risk"); }));
var HB = find(B.accounts, function (a) { return a.name === "Halden Tooling Group"; });
eq("after the override Halden is re-promised and accepted", HB.statusLabel, "Re-promised, accepted");
eq("after the override Halden carries no value", HB.usd, 0);
eq("accounts still at risk after the override",
  B.accounts.filter(function (a) { return a.status === "at-risk"; }).length, A.accounts.length - 1);

console.log("\n-- the recompute (decide is pure) ----------------------------");
var before = JSON.stringify(S1);
var d = D.decide(S1, D.haldenDecision);
ok("decide does not mutate the state it is given", JSON.stringify(S1) === before);
eq("decide returns a state with one decision", d.state.decisions.length, 1);
eq("decide logs who decided", d.decision.by, "Dana Whitfield");
ok("decide logs when and why", !!d.decision.at && /accepted delivery on 20 Oct/.test(d.decision.reason));
eq("all six tiles move", d.changed.band.length, 6);
eq("only A1 changes", d.changed.actions.map(function (x) { return x.id; }).join(","), "A1");
eq("A1 loses one transfer", d.changed.actions[0].tasks.from - d.changed.actions[0].tasks.to, 1);
eq("one account changes", d.changed.accounts.length, 1);
eq("it is Halden", d.changed.accounts[0].name, "Halden Tooling Group");
eq("the headline revenue moves 4.18 -> 3.77", m2(d.changed.headline.revenueUsd.to), 3.77);
eq("a rule is learned", d.learned.rule, "Accepted re-promise dates are not at risk");
ok("running decide twice gives the same answer",
  JSON.stringify(D.decide(S1, D.haldenDecision).changed) === JSON.stringify(d.changed));

console.log("\n-- the steward queues: 25 and 7 ------------------------------");
eq("customer matches waiting", D.matches.length, 25);
eq("item cross-references waiting", D.itemXrefs.length, 7);
eq("pending customers reported", D.pendingCounts([]).customers, 25);
eq("pending items reported", D.pendingCounts([]).items, 7);
ok("every proposal scores between 0.75 and 0.89",
  D.matches.every(function (m) { return m.score >= 0.75 && m.score <= 0.89; }));
ok("every proposal carries evidence and a note",
  D.matches.every(function (m) { return m.evidence.length >= 3 && m.note; }));
eq("one proposal is the one to reject", D.matches.filter(function (m) { return m.wrong; }).length, 1);
ok("the wrong one has no shared registration number and two countries",
  (function () { var m = find(D.matches, function (x) { return x.wrong; });
    return m.records[0].taxId !== m.records[1].taxId && m.records[0].country !== m.records[1].country; })());
var dm = D.decideMatch(D.stateFor("start"), { kind: "customer", id: find(D.matches, function (m) { return m.wrong; }).id, action: "reject", reason: "Two companies, two countries." });
eq("rejecting one leaves 24", dm.changed.pending.customers.to, 24);
eq("confirming an item leaves 6",
  D.decideMatch(D.stateFor("start"), { kind: "item", id: D.itemXrefs[0].id, action: "confirm" }).changed.pending.items.to, 6);
eq("the caveat says what is still provisional", A.caveat,
  "25 customer matches and 7 item cross-references still wait for a person. Their lines count provisionally.");

console.log("\n-- sources, views and the run card ---------------------------");
eq("five sources", D.sources.length, 5);
eq("fourteen certified views", D.views.length, 14);
["CUSTOMER_360", "ITEM_XREF", "OPEN_ORDER_LINES_X", "PROMISE_STATUS", "STOCK_POSITION", "LATE_CAUSES",
  "SUPPLIER_DELAYS", "CREDIT_HOLDS", "TRANSIT_STATUS", "SLA_EXPOSURE", "REVENUE_AT_RISK", "ACCOUNT_EXPOSURE",
  "RECOMMENDED_ACTIONS", "DECISIONS"].forEach(function (v) {
    ok("GOLD." + v + " is in the catalog", !!D.viewById[v]);
  });
ok("REVENUE_AT_RISK draws on the order lines, the promise, the customer and the contract",
  (function () { var u = D.viewById.REVENUE_AT_RISK.upstream.map(function (x) { return x.id; });
    return ["OPEN_ORDER_LINES_X", "PROMISE_STATUS", "CUSTOMER_360", "CRM_ACCOUNT", "SLA_EXPOSURE"]
      .every(function (n) { return u.indexOf(n) >= 0; }); })());
ok("STOCK_POSITION draws on the three inventory objects and the item cross-reference",
  (function () { var u = D.viewById.STOCK_POSITION.upstream.map(function (x) { return x.id; });
    return ["INV_ONHAND_QUANTITIES_DETAIL", "F41021", "inventoryBalance", "ITEM_XREF"]
      .every(function (n) { return u.indexOf(n) >= 0; }); })());
ok("SLA_EXPOSURE reads the three Enterprise Contracts objects",
  (function () { var u = D.viewById.SLA_EXPOSURE.upstream.map(function (x) { return x.id; });
    return ["OKC_K_HEADERS_ALL_B", "OKC_K_LINES_B", "OKC_K_ARTICLES_B"].every(function (n) { return u.indexOf(n) >= 0; }); })());
eq("the run card has four agents", D.runPlan().length, 4);
eq("the four agents in order",
  D.runPlan().map(function (a) { return a.agent; }).join(" -> "),
  "Order agent -> Identity agent -> Cause agent -> Impact agent");
ok("every agent has sub-steps with a duration",
  D.runPlan().every(function (a) { return a.steps.length >= 3 && a.steps.every(function (s) { return s.text && s.ms > 0; }); }));
ok("the run takes 4 to 7 seconds", A.traceMs >= 4000 && A.traceMs <= 7000, A.traceMs);
ok("the trace names the four agents, the firewall, the row policy and the masking",
  (function () { var s = A.trace.map(function (t) { return t.span; }).join(" | ");
    return /Order agent|order books/.test(A.trace[0].span + A.trace[0].agent) && /Firewall/.test(s) &&
      /Row policy/.test(s) && /masking/i.test(s); })());
ok("every agent span lists the GOLD views it read",
  A.trace.filter(function (t) { return t.agent; }).every(function (t) { return t.tools && t.tools.length; }));
ok("the dashboard is generated in about two seconds",
  (function () { var ms = D.dashboardPlan().reduce(function (t, s) { return t + s.ms; }, 0); return ms >= 1500 && ms <= 2600; })());

console.log("\n-- the evidence behind Halden --------------------------------");
var ev = D.evidence(A.accounts[0].id, "COMMERCIAL_OPS", []);
ok("the evidence holds lines in JD Edwards and in Fusion",
  ev.lines.some(function (l) { return l.sys === "JDE"; }) && ev.lines.some(function (l) { return l.sys === "FUSION"; }),
  ev.lines.map(function (l) { return l.sys; }).join(","));
eq("four of them are the at-risk lines", ev.lines.filter(function (l) { return l.atRisk; }).length, 4);
ok("every line shows its real key", ev.lines.every(function (l) { return /F4211|DOO_FULFILL_LINES_ALL|transactionLine/.test(l.keyLabel); }));
ok("the worst line predicts 20 Oct — the date the customer accepted",
  ev.lines.some(function (l) { return l.predicted === "2026-10-20"; }));
eq("the stock is in EU-2", ev.stockElsewhere[0].plant, "EU-2");
ok("and it covers the shortfall", ev.stockElsewhere[0].onHand >= ev.stockElsewhere[0].needed);
ok("the stock row is a Fusion inventory row", ev.stockElsewhere[0].object === "INV_ONHAND_QUANTITIES_DETAIL");
eq("the CRM account is tier A", ev.crm.tier, "A");
ok("the CRM account names an owner and a revenue", !!ev.crm.owner && ev.crm.revenue > 0);
ok("there are named contacts", ev.crm.contacts.length >= 2);
ok("the contract is an Enterprise Contracts header", ev.contract.object === "OKC_K_HEADERS_ALL_B" && !!ev.contract.number);
ok("the penalty clause text is quoted", /0.5 % of the line value/.test(ev.contract.penaltyText), ev.contract.penaltyText);
ok("the clause reference is the article table", /OKC_K_ARTICLES_B/.test(ev.contract.clauseRef));
eq("the exposure read out of the clause", ev.contract.exposedUsd, 31000);
eq("the lead time read out of the clause", ev.contract.leadTimeDays, 10);
ok("the identity block shows one record per system",
  ev.identity.records.length >= 3 && ev.identity.records.some(function (r) { return r.sys === "CRM"; }));
var evNA = D.evidence(A.accounts[0].id, "ANALYST_NA", []);
eq("the analyst sees only the NG-NA lines", evNA.lines.length, 4);
eq("and is told what is hidden", evNA.linesHidden, 2);
ok("penalty terms are hidden for the analyst", evNA.contract.masked === true && evNA.contract.exposedUsd === null);
ok("contact e-mail and telephone are masked for the analyst",
  /•/.test(evNA.crm.contacts[0].email) && /•/.test(evNA.crm.contacts[0].phone));
ok("a supplier-late account shows its purchase order",
  (function () { var a = find(A.accounts, function (x) { return x.causeId === "supplier"; });
    var e = D.evidence(a.id, "COMMERCIAL_OPS", []);
    return e.supplierDelay && e.supplierDelay.daysLate > 0 && /F4311|PO_HEADERS_ALL/.test(e.supplierDelay.keyLabel); })());
ok("a credit-hold account shows the hold",
  (function () { var a = find(A.accounts, function (x) { return x.causeId === "credit"; });
    var e = D.evidence(a.id, "COMMERCIAL_OPS", []);
    return e.creditHold && !!e.creditHold.placedOn && /CREDIT_HOLD|F03B11|credithold/.test(e.creditHold.column); })());
ok("an in-transit account shows the carrier scans",
  (function () { var a = find(A.accounts, function (x) { return x.causeId === "transit"; });
    var e = D.evidence(a.id, "COMMERCIAL_OPS", []);
    return e.transit && e.transit.scans.length >= 3 && !!e.transit.eta; })());
ok("the delivery-tracking rows come from the DLV schema",
  D.shipments.every(function (s) { return s.object === "DLV_SHIPMENTS"; }) &&
  D.scanEvents.every(function (s) { return s.object === "DLV_SCAN_EVENTS"; }) &&
  D.deliveryExceptions.every(function (s) { return s.object === "DLV_EXCEPTIONS"; }));

console.log("\n-- a decided account keeps its own lines ---------------------");
/* Regression, 2026-09-17: after the decline and the re-analysis the Decisions
   card read "6 order lines at risk" for an account whose every other surface
   said four. The account's on-track lines — the ones that only prove it lives
   in two order books — were being counted once the live at-risk flag went
   false on all of them. `atRiskCount` and `wasAtRisk` are what the pages read. */
var evAfter = D.evidence(A.accounts[0].id, "COMMERCIAL_OPS", S2.decisions);
eq("before the decision the evidence counts four at-risk lines", ev.atRiskCount, 4);
eq("after it, it still counts four", evAfter.atRiskCount, 4);
eq("six lines are returned either way", evAfter.lines.length, 6);
eq("two of them were never at risk", evAfter.lines.filter(function (l) { return !l.wasAtRisk; }).length, 2);
ok("the four the AI valued read re-promised, accepted",
  evAfter.lines.filter(function (l) { return l.wasAtRisk; }).every(function (l) { return l.status === "Re-promised, accepted"; }),
  evAfter.lines.map(function (l) { return l.status; }).join(" | "));
ok("the two on-track lines still read on track",
  evAfter.lines.filter(function (l) { return !l.wasAtRisk; }).every(function (l) { return l.status === "On track"; }));
ok("no line is live at risk once the account is decided",
  evAfter.lines.every(function (l) { return l.atRisk === false; }));
eq("the analyst counts the same four under the row policy",
  D.evidence(A.accounts[0].id, "ANALYST_NA", S2.decisions).atRiskCount, 4);
ok("every account's evidence counts exactly the lines its row shows, before and after",
  [[A, S1.decisions], [B, S2.decisions]].every(function (pair) {
    return pair[0].accounts.concat(pair[0].decided || []).every(function (a) {
      var e = D.evidence(a.id, "COMMERCIAL_OPS", pair[1]);
      var shown = a.status === "at-risk" ? a.lines : (a.wasLines || a.lines);
      return e.atRiskCount === shown;
    });
  }));

console.log("\n-- the ten saved questions -----------------------------------");
eq("ten saved questions", D.questions.length, 10);
eq("question 1 is the tour's ask", D.questions[0].text,
  "Which open orders are at risk this week, and which of our best accounts are exposed?");
var q1 = D.answer("q1", "COMMERCIAL_OPS", []);
eq("question 1 rows for the VP", q1.rowCount, 38);
eq("question 1 rows for the analyst", D.answer("q1", "ANALYST_NA", []).rowCount, 17);
eq("question 1 rows after the override", D.answer("q1", "COMMERCIAL_OPS", S2.decisions).rowCount, 37);
ok("question 1 reconciles to the headline",
  q1.rows.reduce(function (t, r) { return t + r.usd; }, 0) === A.headline.revenueUsd &&
  q1.rows.reduce(function (t, r) { return t + r.lines; }, 0) === 138);
eq("question 2 returns the 44 lines with stock elsewhere", D.answer("q2", "COMMERCIAL_OPS", []).rowCount, 44);
eq("question 3 returns one row per tier", D.answer("q3", "COMMERCIAL_OPS", []).rowCount, 3);
eq("question 4 returns the six late suppliers", D.answer("q4", "COMMERCIAL_OPS", []).rowCount, 6);
eq("question 7 returns four weeks for three entities", D.answer("q7", "COMMERCIAL_OPS", []).rowCount, 12);
ok("question 9 masks the contacts for the analyst",
  D.answer("q9", "ANALYST_NA", []).rows.every(function (r) { return /•/.test(r.email) && /•/.test(r.phone); }));
ok("question 9 does not mask them for the VP",
  D.answer("q9", "COMMERCIAL_OPS", []).rows.every(function (r) { return !/•/.test(r.email); }));
var q10a = D.answer("q10", "ANALYST_NA", []), q10d = D.answer("q10", "COMMERCIAL_OPS", []);
ok("question 10 is blocked for the analyst", q10a.blocked === true && q10a.rowCount === 0);
eq("the firewall says which allow-list refused it", q10a.firewall.allowList, "OPS_QA_V2");
ok("the refusal names the column", /CREDIT_LIMIT/.test(q10a.firewall.reason), q10a.firewall.reason);
ok("question 10 runs for the VP but masks the limit",
  q10d.blocked === false && q10d.rows.every(function (r) { return /•/.test(r.limit); }));
ok("no other question is blocked",
  D.questions.filter(function (q) { return q.blockedFor && q.blockedFor.length; }).length === 1);
D.questions.forEach(function (q) {
  var n = q.sql.split("\n").length;
  ok("q" + q.n + " SQL is " + n + " lines (at most 25)", n <= 25, n);
  ok("q" + q.n + " SQL filters a period or this week",
    /DATE '2026-|as_of_week|TRUNC\(/.test(q.sql), q.sql.split("\n").slice(-4).join(" "));
  ok("q" + q.n + " SQL reads the certified views", /gold\./.test(q.sql));
  ok("q" + q.n + " SQL is a SELECT and nothing else", /^SELECT/.test(q.sql) && !/\b(INSERT|UPDATE|DELETE|MERGE|DROP)\b/i.test(q.sql));
});
["COMMERCIAL_OPS", "ANALYST_NA"].forEach(function (role) {
  D.questions.forEach(function (q) {
    var a = D.answer(q.id, role, []);
    ok("q" + q.n + " / " + role + ": narrate, trace and freshness are present",
      !!a.narrate && a.trace.length >= 5 && !!a.freshness.text);
    ok("q" + q.n + " / " + role + ": trace runs 2 to 6 s", a.traceMs >= 2000 && a.traceMs <= 6000, a.traceMs);
  });
});

console.log("\n-- the generated dashboard -----------------------------------");
var dashD = D.dashboard("COMMERCIAL_OPS", []), dashM = D.dashboard("ANALYST_NA", []);
eq("the dashboard is named", dashD.title, "Revenue at risk across systems");
eq("it says which views it was built from", dashD.builtFrom.length, 5);
eq("four tiles", dashD.tiles.length, 4);
eq("four charts", dashD.charts.length, 4);
eq("the charts are cause, entity, tier and top accounts",
  dashD.charts.map(function (c) { return c.id; }).join(","), "by-cause,by-entity,by-tier,top-accounts");
ok("every chart carries a series", dashD.charts.every(function (c) { return c.series.length > 0; }));
eq("the actions table has the four actions", dashD.table.rows.length, 4);
eq("the VP's revenue tile", find(dashD.tiles, function (t) { return t.id === "revenue"; }).value, "USD 4.18 M");
eq("the VP's penalty tile", find(dashD.tiles, function (t) { return t.id === "penalties"; }).value, "USD 186 k");
eq("the analyst sees 61 lines", dashM.lines, 61);
eq("the analyst sees 57 lines after the override", D.dashboard("ANALYST_NA", S2.decisions).lines, 57);
eq("the analyst's rows are NG-NA only", dashM.scope, "NG-NA only");
ok("the analyst's revenue tile is the NG-NA total, not the group total",
  find(dashM.tiles, function (t) { return t.id === "revenue"; }).raw === sysA.JDE.usd);
ok("the analyst's penalty tile is masked",
  find(dashM.tiles, function (t) { return t.id === "penalties"; }).masked === true &&
  /•/.test(find(dashM.tiles, function (t) { return t.id === "penalties"; }).value));
ok("the analyst's actions table hides the penalty column",
  dashM.table.rows.every(function (r) { return r.penaltyUsd === null; }));
ok("the analyst's charts hold only the one entity",
  find(dashM.charts, function (c) { return c.id === "by-entity"; }).series.length === 1);
ok("the dashboard carries the row policy and the masking it was built under",
  /NG-NA/.test(dashM.firewall.rowPolicy) && /masked|hidden/.test(dashM.firewall.masking));

console.log("\n-- content rules ---------------------------------------------");
var FORBIDDEN_SUB = ["Bosch", "Riyadh Air", "Belron", "Vertiv", "NVIDIA", "SoftServe", "€"];
var FORBIDDEN_WORD = ["BSH", "DHL", "NHS", "SBG", "KPN", "NATO", "Meta", "HPE"];
FORBIDDEN_SUB.forEach(function (w) {
  ok("data.js does not contain \"" + (w === "€" ? "the euro sign" : w) + "\"", src.indexOf(w) < 0);
});
FORBIDDEN_WORD.forEach(function (w) {
  ok("data.js does not contain the word \"" + w + "\"", !(new RegExp("\\b" + w + "\\b")).test(src));
});
ok("currencies are USD, GBP and CAD only",
  D.sources.every(function (s) { return ["USD", "GBP", "CAD"].indexOf(s.currency) >= 0; }) &&
  D.orderLines.every(function (l) { return ["USD", "GBP", "CAD"].indexOf(l.currency) >= 0; }));
ok("Fusion lines are in GBP, JD Edwards in CAD, NetSuite in USD",
  D.orderLines.every(function (l) {
    return (l.sys === "FUSION" && l.currency === "GBP") || (l.sys === "JDE" && l.currency === "CAD") ||
      (l.sys === "NETSUITE" && l.currency === "USD");
  }));
ok("every promised and predicted date is in Sep to Nov 2026",
  D.orderLines.every(function (l) {
    return l.promised >= "2026-09-01" && l.promised <= "2026-10-31" &&
      l.predicted >= "2026-09-01" && l.predicted <= "2026-11-30";
  }));
ok("today is 6 Oct 2026", D.world.today === "2026-10-06" && D.world.todayLabel === "Tue 6 Oct 2026");
ok("no date in the file falls outside the contract years",
  (src.match(/20\d\d-\d\d-\d\d/g) || []).every(function (x) { return x >= "2026-01-01" && x <= "2027-12-31"; }),
  (src.match(/20\d\d-\d\d-\d\d/g) || []).filter(function (x) { return x < "2026-01-01" || x > "2027-12-31"; }).join(","));
ok("60 golden customers", D.customers.length === 60, D.customers.length);
ok("no customer name repeats", (function () {
  var s = {}; D.customers.forEach(function (c) { s[c.name] = 1; }); return Object.keys(s).length === 60;
})());
ok("about 40 items, every one with a cross-reference in three systems",
  D.items.length >= 38 && D.items.every(function (i) { return i.refs.length === 3; }), D.items.length);
ok("data.js is at most 200 KB", src.length <= 200 * 1024, (src.length / 1024).toFixed(1) + " KB");
ok("no ES modules and no fetch", !/\bimport\s|\bexport\s|fetch\s*\(/.test(src));

console.log("\n-- what the page does with it --------------------------------");
var page = fs.readFileSync(path.join(root, "site/demo/cross-system-erp-qa/demo.js"), "utf8");
ok("the Decisions card reads the account's own at-risk count from the data",
  /typeof e\.atRiskCount === "number"/.test(page));
ok("and never falls back to counting every line the account has",
  !/return n \|\| \(e\.lines \|\| \[\]\)\.length/.test(page));
ok("no toast outlives six seconds", /TOAST_MAX = 6000/.test(page) && /Math\.min\(ms \|\| 4200, TOAST_MAX\)/.test(page));
ok("and none of them follows you into the next application",
  /if \(S\.app !== app\) hideToast\(\);/.test(page));
ok("one global only", /window\.ERPQA_DATA = \(function \(\) \{/.test(src));

/* round 3 — the interface-fidelity renames, so a later edit cannot quietly undo them */
var css = fs.readFileSync(path.join(root, "site/demo/cross-system-erp-qa/demo.css"), "utf8");
var html = fs.readFileSync(path.join(root, "site/demo/cross-system-erp-qa/index.html"), "utf8");
ok("the Workbench nav carries Oracle's real roster, not an invented one",
  /"Master catalog"/.test(page) && /"Workspaces"/.test(page) && /"Credential store"/.test(page) &&
  /"Data sharing"/.test(page) && /"Notifications"/.test(page) && /"Roles"/.test(page) && /"Audit logs"/.test(page));
ok("Sessions is gone — the page is Oracle's Audit logs", !/wbPanel === "sessions"/.test(page) && /function auditHtml/.test(page));
ok("Insights left the Workbench nav for the Agent Hub's bottom nav",
  !/label: "Insights", icon: "chart"/.test(page) && /data-hubnav/.test(page) && /hub-bot/.test(css));
ok("the conversation wears Agent Hub's plum bar", /#614d70/.test(css) && /wb-plum/.test(html));
ok("Oracle's marks are text and an outlined ellipse, never a red diamond tile",
  />ORACLE<sup>/.test(html) && !/\.ds-mark::after/.test(css) && !/\.wb-mark::after/.test(css));
ok("the answer's chip row is Explore / Explain / Code View / Trace / Narrate",
  /"Explore"\)/.test(page) && /"Explain"\)/.test(page) && /"Code View"\)/.test(page) && /sqlbox/.test(page));
ok("the run card says Succeeded and has no Cancel",
  /"Succeeded"/.test(page) && !/rc-cancel/.test(page));
ok("the trace is Oracle's Agent flow task table",
  /Agent flow task/.test(page) && /Tokens/.test(page) && /tr-meta/.test(css));
ok("the amber rule fires nowhere but Workbench Home", /\.wb-rule \{ display: none/.test(css));
ok("AIDP object names are lowercase_snake_case", /function lc\(id\)/.test(page) && /esc\(lc\(c\.name\)\)/.test(page));
ok("the Redwood app has a breadcrumb and a 900-weight page title",
  /rw-crumb/.test(html) && /font-weight: 900/.test(css));
ok("no uppercase micro-labels are left in the Redwood app",
  !/\.tile \.lab \{[^}]*text-transform: uppercase/.test(css) &&
  !/\.band-head \.eyebrow \{[^}]*text-transform: uppercase/.test(css) &&
  !/\.hub-sec \{[^}]*text-transform: uppercase/.test(css));
ok("the step counter names the sub-step and the segments fill fractionally",
  /" of " \+ MAJORS \+ " \\u00b7 " \+ sub/.test(page) && /bars \+= '<i><b style="width:'/.test(page));
ok("the end card is the three-sentence one, with three doors and no recap",
  /What you can act on now/.test(page) && /data-door/.test(page) && !/What the AI did:/.test(page));

console.log("\n==============================================================");
console.log((fail ? "FAILED" : "OK") + " — " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
