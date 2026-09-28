/* data.js — Repair-or-replace decisions walkthrough.
 *
 * ALL DATA IN THIS FILE IS SYNTHETIC. Every case id, asset id, site, market,
 * lessor contract, rule set and rule text is invented for the demo; the rules
 * are EXAMPLE RULES, not any standard's or operator's wording. No customer,
 * geography or customer figure appears here.
 *
 * The KPIs are the pack spec's MODELLED rates (industry assumptions, not a
 * customer result): needless replacements 3.0% -> 2.4%, repeat visits
 * 1.5% -> 1.2% (each a 20% relative reduction), and unnecessary follow-on work
 * computed as the needless-replacement rate x the modelled 42% share of assets
 * whose replacement triggers dependent work.
 *
 * Data model (references/demo-data-model.md): current state (the calls booked
 * at first contact) + named changes with additive KPI effects in rate points +
 * flagsFor(applied) computed in demo.js. kpis([]) is the baseline exactly.
 */
window.RRD = {
  period: "Modelled week",
  followOnShare: 0.42,

  kpis: {
    needless: {
      label: "Needless replacements",
      base: 3.0,
      def: "Replacements where a repair would have met the limit",
      whose: "Payer funds it · operator is measured on it",
      per: "decisions",
      dp: 1
    },
    repeat: {
      label: "Repeat visits",
      base: 1.5,
      def: "Repairs that come back for the same damage",
      whose: "Operator absorbs the return visit",
      per: "repairs",
      dp: 1
    },
    followon: {
      label: "Unnecessary follow-on work",
      def: "Work such as recalibration, triggered only by a needless replacement",
      whose: "Operator loses the slot · payer pays the line",
      per: "decisions",
      dp: 2
    }
  },

  sources: [
    { id: "capture", name: "Capture channel", line: "Photos with a scale tag, 31 in today", icon: "camera" },
    { id: "assets", name: "Asset records", line: "Identifier to geometry and damage history", icon: "record" },
    { id: "rules", name: "Rule sets", line: "Four sets: two markets, a lessor, an operator", icon: "rules" },
    { id: "booking", name: "Booking and claims system", line: "Confirmed jobs are handed on here", icon: "out" }
  ],

  stages: [
    { label: "Reading each asset's own markings", detail: "7 assets: 4 windscreens, 2 containers, 1 airframe panel" },
    { label: "Locating each damage", detail: "7 damages found across 31 photos" },
    { label: "Measuring against the scale tag", detail: "Smallest margin to a limit: 1.4 mm, on RR-24826" },
    { label: "Mapping each damage to its zone", detail: "3 inside a driver's sight-line, 1 near a fastener row" },
    { label: "Matching each market's rules", detail: "4 rule sets applied; 1 case no rule covers" },
    { label: "Making the call", detail: "5 bookings change, 1 confirmed, 1 referred to an engineer" }
  ],

  ruleSets: [
    { id: "AG", name: "Aldmere glazing guide", version: "v3", scope: "Vehicle glazing · Aldmere", rules: [
      { id: "AG-3.1", text: "A chip up to 25 mm may be repaired, zone A included." },
      { id: "AG-3.4", text: "A crack longer than 75 mm: replace." },
      { id: "AG-5.2", text: "No repair within 100 mm of an earlier repair." }
    ] },
    { id: "BG", name: "Brisca glazing guide", version: "v2", scope: "Vehicle glazing · Brisca", rules: [
      { id: "BG-2.4", text: "No repair inside zone A, whatever the size." },
      { id: "BG-2.6", text: "Outside zone A, a chip up to 20 mm may be repaired." },
      { id: "BG-3.1", text: "A crack of any length: replace." }
    ] },
    { id: "CT", name: "Container repair matrix", version: "v5", scope: "Shipping containers · lessor contract L-2", rules: [
      { id: "CT-07", text: "A dent up to 35 mm deep, with no crack or hole: straighten." },
      { id: "CT-12", text: "A hole: patch or replace. Never straighten." },
      { id: "CT-15", text: "A crack in a corner post: replace the post." }
    ] },
    { id: "AS", name: "Airframe damage limits", version: "v1", scope: "Aircraft skin · operator manual", rules: [
      { id: "AS-5.3", text: "A dent up to 1.5 mm deep, at least 10 mm clear of fasteners: accept and record." }
    ] }
  ],

  routing: [
    "A call below 0.75 confidence goes to a reviewer",
    "A case no rule covers is referred to a person, never guessed",
    "Every overrule keeps its reason; the rate is reported in aggregate only"
  ],

  /* What the walkthrough shows, by the spec's status (● available · ◐ partial · ○ roadmap). */
  status: [
    { what: "Capture with a scale tag, usability check", area: "Capture & intake", status: "roadmap" },
    { what: "Asset identified from its own markings", area: "Damage assessment", status: "available" },
    { what: "Damage located and classified", area: "Damage assessment", status: "available" },
    { what: "Size measured, position mapped to its zone", area: "Damage assessment", status: "roadmap" },
    { what: "Repair, replace or refer, with confidence", area: "Decision & estimate", status: "available" },
    { what: "Rule and measurement cited on each call", area: "Decision & estimate", status: "partial" },
    { what: "Follow-on work flagged at decision", area: "Decision & estimate", status: "roadmap" },
    { what: "Review, overrule with a reason, decision record", area: "Assurance & audit", status: "partial" },
    { what: "Rules versioned per market", area: "Operations & administration", status: "roadmap" },
    { what: "Handoff with scope resolved", area: "Operations & administration", status: "partial" }
  ],

  cases: [
    {
      id: "RR-24811", cls: "glazing", clsLabel: "Vehicle glazing", market: "Aldmere", site: "Harbour Row",
      asset: "Vehicle V-40219 · windscreen", photos: 5, frame: 3, anchor: "Scale tag, 50 mm",
      damage: "Chip", size: 14.2, tol: 0.8, unit: "mm", zone: "A · driver's sight-line", zoneA: true,
      described: "\"a big chip\"", booked: "Replace", bookedOnDescription: true,
      call: "Repair", conf: 0.93, rule: "AG-3.1", ruleSet: "AG",
      overruleTo: "Replace", reasons: ["Customer reports the chip is spreading", "Earlier repair nearby", "Photo does not show the full damage"],
      scope: { Repair: ["Chip repair kit", "Repair technician", 30], Replace: ["Windscreen", "Glazing technician", 120] },
      followOnOnReplace: "",
      draw: { x: 132, y: 92 },
      change: {
        id: "chg-24811", caseId: "RR-24811", kind: "improves", area: "Decision & estimate",
        what: "Replace → Repair",
        why: "Measured at 14.2 mm; Aldmere's example rule allows a repair up to 25 mm.",
        effects: { needless: -0.20, repeat: 0 },
        effect: "Needless replacements −0.20 pts; follow-on work falls with it"
      }
    },
    {
      id: "RR-24814", cls: "glazing", clsLabel: "Vehicle glazing", market: "Brisca", site: "Mill Cross",
      asset: "Vehicle V-73105 · windscreen", photos: 4, frame: 2, anchor: "Scale tag, 50 mm",
      damage: "Chip", size: 11.0, tol: 0.7, unit: "mm", zone: "A · driver's sight-line", zoneA: true,
      described: "\"just a small chip\"", booked: "Repair", bookedOnDescription: true,
      call: "Replace", conf: 0.96, rule: "BG-2.4", ruleSet: "BG",
      overruleTo: "Repair", reasons: ["Customer declines the replacement", "Photo does not show the full damage"],
      scope: { Repair: ["Chip repair kit", "Repair technician", 30], Replace: ["Windscreen, camera bracket", "Glazing technician, calibration", 150] },
      followOnOnReplace: "Camera recalibration",
      draw: { x: 118, y: 104 },
      change: {
        id: "chg-24814", caseId: "RR-24814", kind: "improves", area: "Decision & estimate",
        what: "Repair → Replace",
        why: "Brisca's example rule allows no repair inside zone A, whatever the size.",
        effects: { needless: 0, repeat: -0.15 },
        effect: "Repeat visits −0.15 pts; the recalibration is booked with the job"
      }
    },
    {
      id: "RR-24820", cls: "container", clsLabel: "Shipping container", market: "Lessor contract L-2", site: "Eastgate Depot",
      asset: "Unit CNT-104522 · side panel", photos: 4, frame: 1, anchor: "Scale tag, 100 mm",
      damage: "Dent, no crack or hole", size: 28, tol: 2, unit: "mm deep", zone: "Side panel, between posts", zoneA: false,
      described: "surveyor's line: replace panel", booked: "Replace", bookedOnDescription: true,
      call: "Repair", callDetail: "straighten", conf: 0.90, rule: "CT-07", ruleSet: "CT",
      overruleTo: "Replace", reasons: ["Lessor requires a new panel on this unit", "Photo does not show the full damage"],
      scope: { Repair: ["Straighten side panel", "Depot welder", 60], Replace: ["Side panel", "Depot welder", 180] },
      followOnOnReplace: "",
      draw: { x: 170, y: 100 },
      change: {
        id: "chg-24820", caseId: "RR-24820", kind: "improves", area: "Damage assessment",
        what: "Replace panel → Straighten",
        why: "Measured 28 mm deep with no crack or hole; the example matrix says straighten up to 35 mm.",
        effects: { needless: -0.20, repeat: 0 },
        effect: "Needless replacements −0.20 pts; follow-on work falls with it"
      }
    },
    {
      id: "RR-24823", cls: "container", clsLabel: "Shipping container", market: "Lessor contract L-2", site: "Eastgate Depot",
      asset: "Unit CNT-207731 · roof panel", photos: 5, frame: 4, anchor: "Scale tag, 100 mm",
      damage: "Hole", size: 45, tol: 2, unit: "mm", zone: "Roof panel", zoneA: false, hole: true,
      described: "surveyor's line: straighten", booked: "Repair", bookedDetail: "straighten", bookedOnDescription: true,
      call: "Repair", callDetail: "patch", conf: 0.95, rule: "CT-12", ruleSet: "CT",
      overruleTo: "Replace", reasons: ["Lessor requires a new panel on this unit", "Corrosion around the hole"],
      scope: { Repair: ["Patch roof panel", "Depot welder", 90], Replace: ["Roof panel", "Depot welder", 240] },
      followOnOnReplace: "",
      draw: { x: 150, y: 90 },
      change: {
        id: "chg-24823", caseId: "RR-24823", kind: "improves", area: "Decision & estimate",
        what: "Straighten → Patch",
        why: "A hole cannot be straightened; the example matrix allows only a patch or a new panel.",
        effects: { needless: 0, repeat: -0.15 },
        effect: "Repeat visits −0.15 pts: a straightened hole fails and comes back"
      }
    },
    {
      id: "RR-24826", cls: "glazing", clsLabel: "Vehicle glazing", market: "Aldmere", site: "Harbour Row",
      asset: "Vehicle V-58342 · windscreen", photos: 5, frame: 2, anchor: "Scale tag, 50 mm",
      damage: "Chip", size: 23.6, tol: 1.4, unit: "mm", zone: "A · driver's sight-line", zoneA: true,
      described: "\"a large chip\"", booked: "Replace", bookedOnDescription: true,
      call: "Repair", conf: 0.61, rule: "AG-3.1", ruleSet: "AG", review: true,
      overruleTo: "Replace", reasons: ["Margin is inside the measurement's tolerance", "Customer reports the chip is spreading", "Earlier repair nearby"],
      scope: { Repair: ["Chip repair kit", "Repair technician", 30], Replace: ["Windscreen, camera bracket", "Glazing technician, calibration", 150] },
      followOnOnReplace: "Camera recalibration",
      draw: { x: 140, y: 84 },
      change: {
        id: "chg-24826", caseId: "RR-24826", kind: "tradeoff", area: "Assurance & audit",
        what: "Replace → Repair",
        why: "Measured 23.6 mm against the 25 mm limit, so the rule allows a repair — by 1.4 mm.",
        cost: "Margin of 1.4 mm is inside the ±1.4 mm tolerance: repeat-visit risk",
        effects: { needless: -0.20, repeat: 0 },
        effect: "Needless replacements −0.20 pts, at a flagged repeat-visit risk"
      }
    },
    {
      id: "RR-24829", cls: "aircraft", clsLabel: "Aircraft skin", market: "Operator manual", site: "Hangar 3",
      asset: "Airframe AF-0217 · lower fuselage panel", photos: 4, frame: 3, anchor: "Scale tag, 50 mm",
      damage: "Dent", size: 1.1, tol: 0.2, unit: "mm deep", zone: "6 mm from a fastener row", zoneA: false,
      described: "line check: dent, repair", booked: "Repair", bookedOnDescription: true,
      call: "Refer", conf: null, rule: "", ruleSet: "AS", refer: true,
      referReason: "No rule covers a dent this close to fasteners: an engineer decides",
      scope: {},
      followOnOnReplace: "",
      draw: { x: 176, y: 96 }
    },
    {
      id: "RR-24835", cls: "glazing", clsLabel: "Vehicle glazing", market: "Brisca", site: "Mill Cross",
      asset: "Vehicle V-26671 · windscreen", photos: 4, frame: 1, anchor: "Scale tag, 50 mm",
      damage: "Crack", size: 180, tol: 3, unit: "mm long", zone: "B · outside the sight-line", zoneA: false, crack: true,
      described: "\"a long crack\"", booked: "Replace", bookedOnDescription: false,
      call: "Replace", conf: 0.98, rule: "BG-3.1", ruleSet: "BG",
      overruleTo: "Repair", reasons: ["Photo does not show the full damage"],
      scope: { Replace: ["Windscreen, camera bracket", "Glazing technician, calibration", 150], Repair: ["Crack repair", "Repair technician", 45] },
      followOnOnReplace: "Camera recalibration",
      draw: { x: 198, y: 152 }
    }
  ]
};
