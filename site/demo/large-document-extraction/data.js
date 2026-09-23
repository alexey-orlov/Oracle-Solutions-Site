/* Demo data — two prepared documents of different types, their extracted
   values, the validators that fired, and the mock pages behind every
   citation. Everything here is synthetic. */
window.DEMO_DATA = (function () {
  /* Column sets. Each group carries the columns its schema needs, as the real
     product does — a rate table and a discount-tier table do not share
     columns. `k` = cell key, `l` = header, `num` = right-aligned. */
  var COLS = {
    rate:  [{ k: "service", l: "Service" }, { k: "scope", l: "Sites" }, { k: "basis", l: "Rate basis" }, { k: "value", l: "Rate", num: true }, { k: "section", l: "Section" }],
    tier:  [{ k: "service", l: "Tier" }, { k: "from", l: "Visits from", num: true }, { k: "to", l: "Visits to", num: true }, { k: "basis", l: "Applies to" }, { k: "value", l: "Discount", num: true }, { k: "section", l: "Section" }],
    term:  [{ k: "service", l: "Term" }, { k: "scope", l: "Applies to" }, { k: "value", l: "Value" }, { k: "basis", l: "Basis" }, { k: "section", l: "Clause" }],
    cover: [{ k: "service", l: "Cover" }, { k: "scope", l: "Applies to" }, { k: "value", l: "Minimum limit", num: true }, { k: "basis", l: "Basis" }, { k: "section", l: "Section" }],
    loc:   [{ k: "service", l: "Location" }, { k: "scope", l: "Cover" }, { k: "value", l: "Sum insured", num: true }, { k: "basis", l: "Basis" }, { k: "section", l: "Section" }],
    ded:   [{ k: "service", l: "Peril" }, { k: "scope", l: "Applies to" }, { k: "value", l: "Deductible", num: true }, { k: "basis", l: "Basis" }, { k: "section", l: "Section" }],
    sub:   [{ k: "service", l: "Cover" }, { k: "scope", l: "Applies to" }, { k: "value", l: "Limit", num: true }, { k: "basis", l: "Basis" }, { k: "section", l: "Section" }],
    endo:  [{ k: "service", l: "Endorsement" }, { k: "scope", l: "Reference" }, { k: "value", l: "Effect" }, { k: "section", l: "Section" }],
    prem:  [{ k: "service", l: "Item" }, { k: "basis", l: "Basis" }, { k: "value", l: "Amount", num: true }, { k: "section", l: "Section" }]
  };
  function row(cells, conf, scenario, extra) {
    var r = { cells: cells, conf: conf, scenario: scenario || "" };
    if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; });
    return r;
  }

  /* ---------------------------------------------------------------- MSA */
  var msa = {
    key: "msa",
    id: "MSA-2026-014",
    name: "Meridian Facility Services — Master Services Agreement",
    file: "MSA-2026-014_Meridian_Facility_Services.pdf",
    size: "3.1 MB",
    pages: 48,
    type: "Supplier services agreement",
    typeId: "supplier",
    schema: "Supplier agreement v3 · 10 groups",
    counterparty: "Meridian Facility Services Ltd",
    currency: "EUR",
    template: "Cost-system rate card v2",
    headLeft: "Master Services Agreement · MSA-2026-014",
    headRight: "Meridian Facility Services Ltd",
    initialStatus: "Extracted",
    meta: [
      ["Document type", "Supplier services agreement"], ["Schema", "Supplier agreement v3 · 10 groups"], ["Counterparty", "Meridian Facility Services Ltd"],
      ["Rate schedule", "Schedule B — Rate card, rev. 3"], ["Sites", "Northgate Campus (NGC) · Riverside DC (RDC)"], ["Invoice currency", "EUR"],
      ["Applicable from", "2026-04-01"], ["Applicable to", "2029-03-31"], ["Source file", "MSA-2026-014_Meridian_Facility_Services.pdf · 48 pages"]
    ],
    groups: [
      { id: "cleaning", name: "Routine cleaning", cols: COLS.rate, unit: "EUR", page: 7, section: "B.1", rows: [
        row({ service: "Office areas — daily clean", scope: "NGC, RDC", basis: "Per m² per month", value: "1.85", section: "B.1.1" }, 97, "Open-plan and cellular office space, five visits per week"),
        row({ service: "Sanitary areas", scope: "NGC, RDC", basis: "Per visit", value: "42.00", section: "B.1.2" }, 96, "All washrooms on a floor, one visit"),
        row({ service: "Kitchens and break areas", scope: "NGC, RDC", basis: "Per visit", value: "28.50", section: "B.1.3" }, 94, "Includes appliance surfaces, excludes deep clean"),
        row({ service: "Reception and lobby", scope: "NGC", basis: "Per visit", value: "36.00", section: "B.1.4" }, 95, "Ground-floor public areas, weekday mornings")
      ]},
      { id: "deep", name: "Periodic deep clean", cols: COLS.rate, unit: "EUR", page: 8, section: "B.2", rows: [
        row({ service: "Carpet extraction clean", scope: "NGC, RDC", basis: "Per m²", value: "3.40", section: "B.2.1" }, 93, "Quarterly, outside business hours"),
        row({ service: "Hard-floor strip and seal", scope: "NGC, RDC", basis: "Per m²", value: "6.10", section: "B.2.2" }, 92, "Twice a year, on request")
      ]},
      { id: "discount", name: "Volume discounts", cols: COLS.tier, unit: "", page: 9, section: "B.3",
        label: function (c) { return c.service + " (" + c.from + "–" + c.to + " visits/week)"; }, rows: [
        row({ service: "Tier 1", from: "1", to: "7", basis: "Routine cleaning", value: "0%", section: "B.3" }, 91, "Full rate applies"),
        row({ service: "Tier 2", from: "8", to: "14", basis: "Routine cleaning", value: "5%", section: "B.3" }, 90, "Applied to the monthly invoice total"),
        row({ service: "Tier 3", from: "15", to: "21", basis: "Routine cleaning", value: "10%", section: "B.3" }, 89, "Applied to the monthly invoice total"),
        row({ service: "Tier 4", from: "23", to: "28", basis: "Routine cleaning", value: "15%", section: "B.3" }, 71, "Applied to the monthly invoice total",
          { flag: { kind: "fix", rule: "Tier ranges must be contiguous", detail: "Tier 3 ends at 21 visits; the extracted Tier 4 starts at 23, leaving 22 uncovered.", field: "from", suggested: "22" }, source: { from: "22" } })
      ]},
      { id: "waste", name: "Waste collection", cols: COLS.rate, unit: "EUR", page: 10, section: "B.4", rows: [
        row({ service: "General waste — 1100 L container", scope: "NGC, RDC", basis: "Per lift", value: "18.20", section: "B.4.1" }, 96, "Scheduled lifts, twice a week"),
        row({ service: "Recycling — mixed dry", scope: "NGC, RDC", basis: "Per lift", value: "12.40", section: "B.4.2" }, 95, "Scheduled lifts, weekly"),
        row({ service: "Confidential shredding", scope: "NGC", basis: "Per console", value: "9.80", section: "B.4.3" }, 93, "Locked consoles, monthly exchange")
      ]},
      { id: "guarding", name: "Manned guarding", cols: COLS.rate, unit: "EUR", page: 12, section: "B.5", rows: [
        row({ service: "Security officer — weekday day shift", scope: "NGC, RDC", basis: "Per hour", value: "24.50", section: "B.5.1" }, 98, "06:00–18:00 Monday to Friday"),
        row({ service: "Security officer — night shift", scope: "NGC, RDC", basis: "Per hour", value: "27.80", section: "B.5.2" }, 97, "18:00–06:00, any day"),
        row({ service: "Security officer — weekend", scope: "NGC, RDC", basis: "Per hour", value: "31.20", section: "B.5.3" }, 96, "Saturday and Sunday day shift"),
        row({ service: "Security officer — public holiday", scope: "NGC, RDC", basis: "Per hour", value: "38.90", section: "B.5.4" }, 95, "National public holidays, any shift")
      ]},
      { id: "callout", name: "Maintenance call-out", cols: COLS.rate, unit: "EUR", page: 14, section: "B.6", rows: [
        row({ service: "Standard call-out", scope: "NGC, RDC", basis: "Per call", value: "85.00", section: "B.6.1" }, 96, "Attend within 8 working hours"),
        row({ service: "Emergency call-out", scope: "NGC, RDC", basis: "Per call", value: "140.00", section: "B.6.2" }, 95, "Attend within 4 hours, any time"),
        row({ service: "Engineer labour", scope: "NGC, RDC", basis: "Per hour", value: "48.00", section: "B.6.3" }, 94, "On site, after the first hour")
      ]},
      { id: "ooh", name: "Out-of-hours surcharge", cols: COLS.rate, unit: "", page: 15, section: "B.7", rows: [
        row({ service: "Weekday evening (18:00–22:00)", scope: "All", basis: "Uplift on labour rates", value: "25%", section: "B.7.1" }, 84, "Planned work requested by the client"),
        row({ service: "Night, weekend and public holiday", scope: "All", basis: "Uplift on labour rates", value: "50%", section: "B.7.2" }, 82, "Planned work requested by the client")
      ]},
      { id: "cancel", name: "Cancellation charges", cols: COLS.rate, unit: "", page: 21, section: "B.9", rows: [
        row({ service: "Cancelled with 48 hours' notice or more", scope: "All", basis: "Share of the visit rate", value: "0%", section: "B.9.1" }, 95, "Written notice to the service desk"),
        row({ service: "Cancelled between 24 and 48 hours", scope: "All", basis: "Share of the visit rate", value: "50%", section: "B.9.2" }, 94, "Written notice to the service desk"),
        row({ service: "Cancelled with less than 24 hours' notice", scope: "All", basis: "Share of the visit rate", value: "100%", section: "B.9.3" }, 94, "Including no-access on arrival")
      ]},
      { id: "terms", name: "Commercial terms", cols: COLS.term, unit: "", page: 3, section: "Part I", rows: [
        row({ service: "Initial term", scope: "Agreement", value: "36 months", basis: "From the Commencement Date", section: "2.1" }, 96, "Then renews in 12-month periods", { page: 3, clause: 2 }),
        row({ service: "Renewal notice", scope: "Either party", value: "90 days", basis: "Written notice before period end", section: "2.1" }, 93, "Prevents automatic renewal", { page: 3, clause: 2 }),
        row({ service: "Payment terms", scope: "Undisputed invoices", value: "30 days", basis: "From receipt of invoice", section: "7.1" }, 95, "Disputed amounts may be withheld", { page: 5, clause: 7 }),
        row({ service: "Indexation", scope: "Schedule B rates", value: "Lesser of CPI or 3% per year", basis: "From the second contract year", section: "8.1" }, 88, "Once per year, 90 days' notice", { page: 5, clause: 8 }),
        row({ service: "Service credits", scope: "Service-level failures", value: "Deducted from the next invoice", basis: "Sole remedy, save persistent failure", section: "10.1" }, 90, "Per Schedule E", { page: 22, clause: 10 }),
        row({ service: "Termination for breach", scope: "Either party", value: "30-day cure period", basis: "Written notice of material breach", section: "14.1" }, 94, "Also on insolvency", { page: 24, clause: 14 })
      ]},
      { id: "insurance", name: "Insurance requirements", cols: COLS.cover, unit: "EUR", page: 46, section: "Schedule G", rows: [
        row({ service: "Public liability", scope: "Supplier", value: "10,000,000", basis: "Per occurrence", section: "G.1" }, 95, "Maintained for the Term plus two years"),
        row({ service: "Employer's liability", scope: "Supplier", value: "10,000,000", basis: "Per occurrence", section: "G.2" }, 95, "Statutory minimum or higher"),
        row({ service: "Professional indemnity", scope: "Supplier", value: "5,000,000", basis: "Per claim", section: "G.3" }, 92, "Any one claim, aggregate per year")
      ]}
    ]
  };

  /* --------------------------------------------------------------- Policy */
  var pol = {
    key: "pol",
    id: "POL-2026-118",
    name: "Corvane Mutual — Commercial property & business interruption policy",
    file: "POL-2026-118_Corvane_Mutual_property_BI.pdf",
    size: "1.4 MB",
    pages: 22,
    type: "Insurance policy schedule",
    typeId: "policy",
    schema: "Commercial property policy v2 · 5 groups",
    counterparty: "Corvane Mutual Insurance plc",
    currency: "EUR",
    template: "Risk register — cover schedule v1",
    headLeft: "Policy schedule · CM-PROP-448121",
    headRight: "Corvane Mutual Insurance plc",
    initialStatus: "Extracted",
    initialHistory: [
      { time: "08:12", text: "Extracted 20 values from 22 pages", sub: "4 values flagged by validators · POL-2026-118", kind: "" },
      { time: "08:11", text: "Arrived from the contract repository", sub: "Classified as insurance policy schedule · POL-2026-118", kind: "" }
    ],
    meta: [
      ["Document type", "Insurance policy schedule"], ["Schema", "Commercial property policy v2 · 5 groups"], ["Insurer", "Corvane Mutual Insurance plc"],
      ["Policyholder", "Northgate Holdings B.V."], ["Policy number", "CM-PROP-448121"], ["Broker", "Ashgrove Risk Partners"],
      ["Period of insurance", "2026-07-01 → 2027-06-30"], ["Currency", "EUR"], ["Source file", "POL-2026-118_Corvane_Mutual_property_BI.pdf · 22 pages"]
    ],
    groups: [
      { id: "locations", name: "Insured locations", cols: COLS.loc, unit: "EUR", page: 3, section: "S.1", rows: [
        row({ service: "Northgate Campus", scope: "Buildings", value: "42,000,000", basis: "Reinstatement", section: "S.1.1" }, 97, "Declared value, day-one uplift 15%"),
        row({ service: "Northgate Campus", scope: "Contents", value: "8,500,000", basis: "Reinstatement", section: "S.1.2" }, 95, "Including tenant improvements"),
        row({ service: "Riverside DC", scope: "Buildings", value: "27,000,000", basis: "Reinstatement", section: "S.1.3" }, 96, "Declared value, day-one uplift 15%"),
        row({ service: "Riverside DC", scope: "Contents & equipment", value: "14,200,000", basis: "Reinstatement", section: "S.1.4" }, 94, "Plant and IT equipment"),
        row({ service: "All locations", scope: "Business interruption — gross profit", value: "19,000,000", basis: "24-month indemnity period", section: "S.1.5" }, 93, "Declaration-linked")
      ]},
      { id: "deductibles", name: "Deductibles", cols: COLS.ded, unit: "EUR", page: 4, section: "S.2", rows: [
        row({ service: "Fire and standard perils", scope: "All locations", value: "25,000", basis: "Each and every loss", section: "S.2.1" }, 96, "Applies per location per event"),
        row({ service: "Flood", scope: "All locations", value: "100,000", basis: "Each and every loss", section: "S.2.2" }, 95, "Includes storm surge"),
        row({ service: "Escape of water", scope: "All locations", value: "10,000", basis: "Each and every loss", section: "S.2.3" }, 94, "Sprinkler leakage included"),
        row({ service: "Business interruption", scope: "All locations", value: "48 hours", basis: "Time excess", section: "S.2.4" }, 91, "Waiting period before cover attaches")
      ]},
      { id: "sublimits", name: "Sub-limits", cols: COLS.sub, unit: "EUR", page: 5, section: "S.3", rows: [
        row({ service: "Flood", scope: "All locations", value: "250,000", basis: "Any one loss", section: "S.3.1" }, 90, "Annual aggregate €500,000",
          { flag: { kind: "range", rule: "Value outside the expected band", detail: "The prior policy (2025/26) carried a €500,000 flood sub-limit; this reads 50% lower. Confirm the reduction is intended before it reaches the risk register.", compare: "Prior policy: 500,000 EUR · Extracted: 250,000 EUR" } }),
        row({ service: "Subsidence", scope: "All locations", value: "1,000,000", basis: "Any one loss", section: "S.3.2" }, 94, "Excluding known ground movement"),
        row({ service: "Terrorism", scope: "All locations", value: "", basis: "—", section: "S.3.3" }, 0, "",
          { flag: { kind: "missing", rule: "Required field not found", detail: "The schema requires a terrorism sub-limit; the schedule refers to endorsement END-22, which is not attached. Enter the value from the endorsement, or mark it not applicable." } }),
        row({ service: "Electronic data", scope: "All locations", value: "150,000", basis: "Any one loss", section: "S.3.4" }, 68, "Reinstatement of data only",
          { flag: { kind: "lowconf", rule: "Below the confidence threshold", detail: "Read at 68%, under the 85% threshold for this document type, so it is routed to a reviewer instead of auto-approved. The figure sits in a footnote, not in the schedule table." } })
      ]},
      { id: "endorsements", name: "Endorsements", cols: COLS.endo, unit: "", page: 6, section: "S.4", rows: [
        row({ service: "Unoccupied premises", scope: "END-04", value: "Notify within 30 days", section: "S.4.1" }, 92, "Cover restricted after 30 days unoccupied"),
        row({ service: "Contract works", scope: "END-11", value: "Limit 500,000 EUR", section: "S.4.2" }, 93, "Any one contract"),
        row({ service: "Loss of attraction", scope: "END-17", value: "3-month extension", section: "S.4.3" }, 90, "Within 1 km of an insured location")
      ]},
      { id: "premium", name: "Premium and payment", cols: COLS.prem, unit: "EUR", page: 7, section: "S.5", rows: [
        row({ service: "Annual premium", basis: "Excluding insurance premium tax", value: "49,900", section: "S.5.1" }, 96, "Adjustable on declaration"),
        row({ service: "Instalments", basis: "4 × quarterly", value: "12,400", section: "S.5.2" }, 92, "Direct debit, in advance",
          { flag: { kind: "consistency", rule: "Cross-field check failed", detail: "Four instalments of 12,400 sum to 49,600; the annual premium reads 49,900. One of the two figures is misread or the schedule carries a rounding difference.", compare: "4 × 12,400 = 49,600 · Annual premium: 49,900" } }),
        row({ service: "Payment terms", basis: "From inception", value: "30 days", section: "S.5.3" }, 94, "Per instalment"),
        row({ service: "Insurance premium tax", basis: "On the premium", value: "21%", section: "S.5.4" }, 95, "At the prevailing rate")
      ]}
    ]
  };

  /* ------------------------------------------------------ mock document pages */
  var clauses = [
    ["Interpretation", "Capitalised terms have the meanings given in Schedule A. References to a clause are to a clause of this Agreement unless stated otherwise. The singular includes the plural and the headings do not affect interpretation."],
    ["Term", "This Agreement commences on the Commencement Date and continues for an Initial Term of thirty-six (36) months. It then renews for successive twelve-month periods unless either party gives not less than ninety (90) days' written notice before the end of the current period."],
    ["Services", "The Supplier shall provide the Services described in Schedule C at the Sites listed in Schedule D, in accordance with the Service Levels in Schedule E and with reasonable skill and care."],
    ["Ordering", "The Client may order Services by issuing a Purchase Order that references this Agreement. No terms in a Purchase Order vary this Agreement unless expressly agreed in writing by both parties."],
    ["Charges", "The Client shall pay the Charges set out in Schedule B. Charges are exclusive of value added tax, which shall be added at the prevailing rate. No other charges are payable unless agreed in writing."],
    ["Invoicing", "The Supplier shall invoice monthly in arrears. Each invoice shall itemise the Services by Site, quantity and applicable rate, and shall reference the Purchase Order under which the Services were ordered."],
    ["Payment", "Undisputed invoices are payable within thirty (30) days of receipt. The Client may withhold payment of any disputed amount pending resolution under the dispute procedure, and shall notify the Supplier of the dispute within ten Business Days."],
    ["Indexation", "Rates in Schedule B are fixed for the first contract year. From the second contract year the Supplier may adjust them once per year by the lesser of the published consumer price index and three per cent (3%), on ninety days' written notice."],
    ["Personnel", "The Supplier shall ensure that all personnel deployed to a Site are suitably qualified, vetted in accordance with Schedule F, and hold a valid site pass issued by the Client."],
    ["Service credits", "Where the Supplier fails to meet a Service Level, the service credits in Schedule E apply and shall be deducted from the next invoice. Service credits are the Client's sole remedy for the failure to which they relate, save in the case of persistent failure."],
    ["Change control", "Either party may propose a change to the Services or the Charges by issuing a change request. No change takes effect until a change note is signed by both parties."],
    ["Insurance", "The Supplier shall maintain public liability, employer's liability and professional indemnity insurance at the levels set out in Schedule G for the Term and for two years after."],
    ["Confidentiality", "Each party shall keep the other's Confidential Information confidential and shall not use it except for the purposes of this Agreement. This clause survives termination."],
    ["Termination", "Either party may terminate this Agreement on written notice if the other commits a material breach that is not remedied within thirty (30) days of written notice, or becomes insolvent."],
    ["Exit", "On expiry or termination the Supplier shall co-operate with the Client and any replacement supplier to ensure an orderly transfer of the Services, and shall return all Client property and data."],
    ["Governing law", "This Agreement is governed by the laws of the jurisdiction stated in Schedule A, and the parties submit to the exclusive jurisdiction of its courts."]
  ];
  var subs = [
    "Any notice under this clause shall be given in writing to the address stated in Schedule A and takes effect on receipt.",
    "The parties shall act reasonably and in good faith in giving effect to this clause.",
    "Nothing in this clause limits any right or remedy available to either party at law.",
    "Where this clause conflicts with a Schedule, this clause prevails unless the Schedule states otherwise."
  ];
  var clausePages = { 3: [1, 2], 4: [3, 4], 5: [5, 6, 7, 8], 22: [9, 10], 23: [11, 12], 24: [13, 14], 25: [15, 16] };
  var filler = {
    b: ["Schedule B — additional notes", "Where a Service is charged per visit, a visit means one attendance of the agreed scope at one Site on one day. Where a Service is charged per hour, time is recorded in quarter-hour increments from arrival on Site.", "Rates apply to the areas recorded in Schedule D. A change to the net internal area of a Site is notified through change control and takes effect from the first day of the following month.", "The Supplier shall not charge for travel, tools, consumables or supervision unless a rate for that item appears in this Schedule."],
    c: ["Schedule C — Services", "The Supplier shall carry out the routine cleaning of all office, sanitary, kitchen and reception areas to the frequencies agreed for each Site, using materials and equipment that meet the Client's environmental standards.", "Waste collection covers general waste, mixed dry recycling and confidential shredding consoles. Collection schedules are agreed per Site and may be varied by the service desk with two working days' notice.", "Manned guarding is provided by licensed security officers holding a valid site pass, following the assignment instructions agreed for each Site."],
    d: ["Schedule D — Sites", "Northgate Campus (NGC): 14,200 m² net internal area across three buildings, occupied Monday to Friday 07:00–20:00 with a staffed reception on the ground floor of Building 1.", "Riverside DC (RDC): 6,800 m² net internal area including the data hall, plant rooms and the administration block, occupied 24 hours a day.", "Access to secure areas is by escort only and subject to the vetting requirements in Schedule F."],
    e: ["Schedule E — Service levels", "Each Service carries a service level and a measurement method. Performance is reported monthly on the Client's dashboard and reviewed at the quarterly service review.", "A service credit applies where a service level is missed in a month; the credit is a percentage of that month's charges for the Service concerned and is deducted from the next invoice.", "Persistent failure — the same service level missed in three consecutive months — is a material breach for the purposes of clause 14."],
    f: ["Schedule F — Vetting", "All personnel deployed to a Site are subject to identity, right-to-work and criminal-record checks before their first attendance, renewed every three years.", "Personnel assigned to the data hall at Riverside DC are additionally subject to the Client's enhanced screening procedure.", "The Supplier keeps a register of vetted personnel and makes it available to the Client on request."],
    g2: ["Schedule G — Insurance (continued)", "Each policy shall be maintained with an insurer of good standing and shall note the Client's interest where the policy permits.", "The Supplier shall provide certificates of insurance on the Commencement Date and on each renewal, and shall notify the Client of any cancellation or material change within ten Business Days."],
    x: ["Execution", "Signed for and on behalf of Northgate Holdings B.V. by an authorised signatory.", "Signed for and on behalf of Meridian Facility Services Ltd by an authorised signatory.", "This Agreement is executed in two originals, one for each party."]
  };
  function fillerFor(n) {
    if (n === 11 || n === 13 || (n >= 16 && n <= 20)) return filler.b;
    if (n >= 26 && n <= 33) return filler.c;
    if (n >= 34 && n <= 36) return filler.d;
    if (n >= 37 && n <= 42) return filler.e;
    if (n >= 43 && n <= 45) return filler.f;
    if (n === 47) return filler.g2;
    return filler.x;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function unitOf(g, v) { return !g.unit || /%$/.test(v) || v === "" ? "" : " " + g.unit; }

  /* A schedule table on a page: `source` overrides the cells the page really
     shows (so a misread value differs from the page, as it would in life). */
  function tableFor(g, hi) {
    var cols = g.cols;
    return "<table><thead><tr><th>Ref.</th>" + cols.filter(function (c) { return c.k !== "section"; }).map(function (c) { return "<th>" + esc(c.l) + "</th>"; }).join("") + "<th>Notes</th></tr></thead><tbody>" +
      g.rows.filter(function (r) { return !(r.flag && r.flag.kind === "missing"); }).map(function (r) {
        var src = Object.assign({}, r.cells, r.source || {});
        return '<tr data-src="' + r.key + '"' + (hi && hi.key === r.key ? ' class="is-hi"' : "") + "><td>" + esc(src.section) + "</td>" +
          cols.filter(function (c) { return c.k !== "section"; }).map(function (c) { return "<td>" + esc(src[c.k] || "") + (c.k === "value" ? esc(unitOf(g, src[c.k] || "")) : "") + "</td>"; }).join("") +
          "<td>" + esc(r.scenario) + "</td></tr>";
      }).join("") + "</tbody></table>";
  }
  function clausePage(list, hi) {
    return list.map(function (no) {
      var cl = clauses[no - 1];
      return "<h3>" + no + ". " + esc(cl[0]) + '</h3><p data-clause="' + no + '"' + (hi && hi.clause === no ? ' class="is-hi"' : "") + ">" + no + ".1 " + esc(cl[1]) + "</p><p>" + no + ".2 " + esc(subs[no % subs.length]) + "</p>";
    }).join("");
  }
  function group(doc, id) { return doc.groups.filter(function (g) { return g.id === id; })[0]; }

  msa.pageContent = function (n, hi) {
    if (n === 1) return '<div class="cover"><h3>Master Services Agreement</h3><div class="sub">for the provision of facility services</div><dl><dt>Between</dt><dd>Northgate Holdings B.V. (the Client)</dd><dt>And</dt><dd>Meridian Facility Services Ltd (the Supplier)</dd><dt>Reference</dt><dd>MSA-2026-014</dd><dt>Commencement</dt><dd>2026-04-01</dd><dt>Initial term</dt><dd>36 months, to 2029-03-31</dd><dt>Schedules</dt><dd>A Definitions · B Rate card · C Services · D Sites · E Service levels · F Vetting · G Insurance</dd></dl></div>';
    if (n === 2) {
      var toc = [["Part I — Clauses 1–8", 3], ["Schedule B — Rate card", 6]];
      msa.groups.filter(function (g) { return g.cols === COLS.rate || g.cols === COLS.tier; }).forEach(function (g) { toc.push(["    " + g.section + " " + g.name, g.page]); });
      toc.push(["Part II — Clauses 9–16", 22], ["Schedule C — Services", 26], ["Schedule D — Sites", 34], ["Schedule E — Service levels", 37], ["Schedule F — Vetting", 43], ["Schedule G — Insurance", 46], ["Execution", 48]);
      return "<h3>Contents</h3><ul class=\"toc\">" + toc.map(function (t) { return "<li><span>" + esc(t[0]).replace(/^ {4}/, "&nbsp;&nbsp;&nbsp;&nbsp;") + "</span><span>" + t[1] + "</span></li>"; }).join("") + "</ul>";
    }
    if (clausePages[n]) return clausePage(clausePages[n], hi);
    if (n === 6) return "<h3>Schedule B — Rate card</h3><p>This Schedule sets out the Charges for the Services. Rates are stated in EUR, exclusive of value added tax, and apply at the Sites listed in Schedule D unless a rate is expressly limited to one Site. Rates are fixed for the first contract year and thereafter subject to clause 8 (Indexation).</p><h4>B.0 General notes</h4><p>Where a Service is charged per visit, a visit means one attendance of the agreed scope at one Site on one day. Where a Service is charged per hour, time is recorded in quarter-hour increments from arrival on Site. Where a Service is charged per square metre, the area is the net internal area recorded in Schedule D.</p><p>Discounts in section B.3 apply to routine cleaning only and are calculated on the monthly invoice total for that Service before value added tax. Surcharges in section B.7 apply to labour rates only.</p>";
    var g = msa.groups.filter(function (x) { return x.page === n && x.cols !== COLS.term; })[0];
    if (g) return "<h3>" + esc(g.section) + " " + esc(g.name) + "</h3><p>" + (g.id === "insurance" ? "The Supplier shall maintain the following insurances for the Term and for two years after its end, with insurers of good standing." : "The following rates apply to " + esc(g.name.toLowerCase()) + " at the Sites indicated. Each rate is exclusive of value added tax.") + "</p>" + tableFor(g, hi) + '<p class="note">' + (g.id === "insurance" ? "Certificates are provided on the Commencement Date and on each renewal." : "Rates in this section are subject to the general notes in B.0 and to indexation under clause 8.") + "</p>" + (g.id === "discount" ? "<p>Tiers are assessed on the number of routine cleaning visits scheduled across all Sites in the invoice month. A change of tier takes effect from the first day of the following month.</p>" : "");
    var f = fillerFor(n);
    return "<h3>" + esc(f[0]) + "</h3>" + f.slice(1).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  };

  var wording = [
    ["Definitions", "Buildings means the structures at the insured locations including landlord's fixtures and fittings, outbuildings, walls, gates and fences. Contents means machinery, plant, trade fixtures and all other contents owned by the Insured or for which the Insured is responsible."],
    ["Basis of settlement", "Buildings and Contents are insured on a reinstatement basis: the cost of rebuilding or replacing the property with property of the same kind and condition, without deduction for wear and tear, subject to the sums insured stated in the schedule."],
    ["Business interruption", "The Insurer will pay the loss of gross profit resulting from interruption of the business at an insured location caused by damage insured under the property section, for the indemnity period stated in the schedule."],
    ["Conditions", "The Insured shall take all reasonable precautions to prevent loss, maintain the premises in a sound condition, and comply with the risk-improvement requirements notified by the Insurer within the periods stated."],
    ["Exclusions", "The policy does not cover loss caused by war, nuclear risks, wear and tear, gradual deterioration, or any loss more specifically insured elsewhere. Terrorism is excluded unless the terrorism endorsement is attached."],
    ["Claims conditions", "The Insured shall notify the Insurer of any event likely to give rise to a claim as soon as practicable and in any case within thirty days, preserve the damaged property, and provide the information the Insurer reasonably requires."],
    ["Cancellation", "The Insured may cancel the policy at any time; the Insurer may cancel by giving thirty days' written notice. A pro-rata return of premium applies unless a claim has been made in the period."]
  ];
  pol.pageContent = function (n, hi) {
    if (n === 1) return '<div class="cover"><h3>Policy schedule</h3><div class="sub">Commercial property and business interruption insurance</div><dl><dt>Insurer</dt><dd>Corvane Mutual Insurance plc</dd><dt>Policyholder</dt><dd>Northgate Holdings B.V.</dd><dt>Policy number</dt><dd>CM-PROP-448121</dd><dt>Broker</dt><dd>Ashgrove Risk Partners</dd><dt>Period</dt><dd>2026-07-01 to 2027-06-30, both days inclusive</dd><dt>Sections</dt><dd>S.1 Locations · S.2 Deductibles · S.3 Sub-limits · S.4 Endorsements · S.5 Premium · Policy wording</dd></dl></div>';
    if (n === 2) return "<h3>Contents</h3><ul class=\"toc\">" + [["S.1 Insured locations", 3], ["S.2 Deductibles", 4], ["S.3 Sub-limits", 5], ["S.4 Endorsements", 6], ["S.5 Premium and payment", 7], ["Policy wording", 8], ["Claims conditions", 18]].map(function (t) { return "<li><span>" + esc(t[0]) + "</span><span>" + t[1] + "</span></li>"; }).join("") + "</ul>";
    var g = pol.groups.filter(function (x) { return x.page === n; })[0];
    if (g) return "<h3>" + esc(g.section) + " " + esc(g.name) + "</h3><p>" + { locations: "The sums insured below apply per location and per item of cover, on the basis stated.", deductibles: "The following deductibles are borne by the Insured for each and every loss unless stated otherwise.", sublimits: "Cover for the following perils and items is limited to the amounts stated, any one loss, regardless of the sums insured in section S.1.", endorsements: "The following endorsements form part of the policy and prevail over the wording where they conflict.", premium: "Premium and payment terms for the period of insurance." }[g.id] + "</p>" + tableFor(g, hi) + '<p class="note">' + { locations: "Day-one reinstatement uplift of 15% applies to buildings.", deductibles: "Where two deductibles could apply to one event, the higher applies.", sublimits: "Terrorism cover is subject to endorsement END-22, issued separately. Electronic data is limited to 150,000 EUR any one loss — see footnote 3.", endorsements: "Endorsement wordings are attached at the end of the policy.", premium: "Premium is adjustable on the annual declaration of gross profit." }[g.id] + "</p>";
    var w = wording[(n - 8) % wording.length];
    return "<h3>" + esc(w[0]) + "</h3><p>" + esc(w[1]) + "</p><p>" + esc(subs[(n + 1) % subs.length]) + "</p>";
  };

  /* --------------------------------------------------- workspace scenery */
  var types = [
    { id: "supplier", name: "Supplier services agreements", schema: "Supplier agreement v3", fields: 33, validators: 6 },
    { id: "policy", name: "Insurance policy schedules", schema: "Commercial property policy v2", fields: 24, validators: 5 },
    { id: "lease", name: "Property leases", schema: "Lease schedule v1", fields: 18, validators: 4 },
    { id: "filing", name: "Regulatory filings", schema: "Prudential return v1", fields: 40, validators: 8 }
  ];
  var existingDocs = [
    { id: "SLA-2025-081", name: "Halcyon IT Support — Service Level Agreement", type: "Supplier services agreement", typeId: "supplier", counterparty: "Halcyon Technology Services", pages: 31, uploaded: "2026-09-08", status: "Exported", values: 17 },
    { id: "LSA-2024-207", name: "Riverside DC — Lease Schedule", type: "Property lease", typeId: "lease", counterparty: "Greyfield Estates plc", pages: 64, uploaded: "2026-09-11", status: "Approved", values: 22 },
    { id: "REG-2026-Q2", name: "Quarterly prudential return — Q2 2026", type: "Regulatory filing", typeId: "filing", counterparty: "Northgate Holdings B.V.", pages: 112, uploaded: "2026-09-14", status: "In review", values: 40 },
    { key: "pol", id: "POL-2026-118", name: pol.name, type: pol.type, typeId: "policy", counterparty: pol.counterparty, pages: pol.pages, uploaded: "Today · repository", status: "Extracted", values: 20 }
  ];
  var pickerFiles = [
    { name: msa.file, kind: "PDF · 48 pages", size: msa.size, main: true },
    { name: "FRM-2026-002_Catering_framework.docx", kind: "DOCX · 22 pages", size: "0.8 MB" },
    { name: "LSA-2024-311_Harbour_Point_lease.pdf", kind: "PDF · 58 pages", size: "4.1 MB" },
    { name: "POL-2026-121_Corvane_Mutual_liability.pdf", kind: "PDF · 19 pages", size: "1.2 MB" }
  ];
  var kpis = [
    { v: "14", l: "Documents processed", s: "last 30 days" },
    { v: "4", l: "Document types", s: "each with its own schema and validators" },
    { v: "402", l: "Values extracted", s: "all cited to a page" },
    { v: "93%", l: "Approved without edit", s: "6% edited · 1% rejected" },
    { v: "96.4%", l: "Benchmark accuracy", s: "annotated set, 40 documents" }
  ];
  var globalHistory = [
    { time: "09:41", text: "Exported rate card for SLA-2025-081", sub: "17 values · Jordan Mercer", kind: "ok" },
    { time: "09:38", text: "Document approved: SLA-2025-081", sub: "All 17 values decided", kind: "ok" },
    { time: "Sep 14", text: "Arrived from the contract repository: REG-2026-Q2", sub: "Classified as regulatory filing · 40 values · 3 flagged", kind: "" },
    { time: "Sep 11", text: "Document approved: LSA-2024-207", sub: "22 values · Priya Natarajan", kind: "ok" }
  ];

  return { docs: { msa: msa, pol: pol }, types: types, existingDocs: existingDocs, pickerFiles: pickerFiles, kpis: kpis, globalHistory: globalHistory, COLS: COLS };
})();
