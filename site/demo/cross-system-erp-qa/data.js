/* Demo data — Norwell Group, a fictional multi-entity group whose order book
   lives in three systems (Oracle Fusion Cloud SCM/ERP and Enterprise
   Contracts, JD Edwards EnterpriseOne, NetSuite), with an in-house delivery-
   tracking application on Oracle Database 23ai and a non-Oracle CRM landed as
   Iceberg tables. Everything here is synthetic: invented customers, items,
   plants, orders, contracts and money. Oracle object and column names are real
   (F4211.SDDOCO, DOO_FULFILL_LINES_ALL.FULFILL_LINE_ID, OKC_K_ARTICLES_B,
   transactionLine, ...) because the demo runs on those products; no customer
   of any kind appears, and nothing here is anyone's real data.

   Round 2 domain: revenue at risk across systems. Nothing on screen is typed
   in. The page calls analyse(decisions), evidence(accountId, role, decisions),
   dashboard(role, decisions) and answer(qid, role, decisions); every one of
   them derives its figures from the arrays below, so Dana's override in step 5
   recomputes the headline, the band, the causes, the ranked accounts, the
   actions, the dashboard and the saved answers at once.
   tools/erp-qa-check.js asserts the lot.

   Public API on window.ERPQA_DATA
   -------------------------------------------------------------------------
   world, personas, roles, sources[], views[], glossary[], records[],
   customers[], items[], orderLines[], stock[], contracts[], clauses[],
   shipments[], scanEvents[], deliveryExceptions[], crmAccounts[],
   crmContacts[], purchaseOrders[], creditHolds[], transfers[], suppliers[],
   matches[], itemXrefs[], questions[], audit[], decisions[], otif[]

   initialState()                  -> {analysed:false, decisions:[], dashboard:false}
   stateFor("start"|"analysed"|"decided"|"final")
   runPlan()                       -> [{id, agent, label, steps:[{text, ms}]}]
   analyse(decisions, role?)       -> {headline, band[], causes[], accounts[],
                                       actions[], narrative, caveat, trace[],
                                       freshness, views[], firewall}
   evidence(accountId, role, dec)  -> {account, lines[], stockElsewhere[], crm,
                                       contract, supplierDelay, creditHold, transit}
   decide(state, decision)         -> {state, decision, changed, learned}
   decideMatch(state, decision)    -> {state, decision, changed, learned}
   dashboard(role, decisions)      -> {title, builtFrom[], tiles[], charts[], table}
   dashboardPlan()                 -> [{text, ms}]
   answer(qid, role, decisions)    -> {rows[], columns[], sql, trace[], ...}
   fmtUsd / fmtM / fmtMusd / fmtK / fmtMoney / pct1 / maskText
   ------------------------------------------------------------------------- */
window.ERPQA_DATA = (function () {
  "use strict";

  /* ------------------------------------------------------------ helpers */
  function r2(n) { return Math.round(n * 100) / 100; }
  function pct1(a, b) { return b ? Math.round((a / b) * 1000) / 10 : 0; }
  function sum(a, f) { var t = 0, i; for (i = 0; i < a.length; i++) t += f ? f(a[i], i) : a[i]; return t; }
  function fmtUsd(n) { return "USD " + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtMoney(n, ccy) { return ccy + " " + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtM(n) { return (n / 1e6).toFixed(2) + " M"; }
  function fmtMusd(n) { return "USD " + fmtM(n); }
  function fmtK(n) { return Math.round(n / 1000).toLocaleString("en-US") + " k"; }
  function fmtQty(n) { return Number(n).toLocaleString("en-US"); }
  function big(n) { return n >= 1e6 ? fmtMusd(n) : "USD " + Math.round(n).toLocaleString("en-US"); }
  /* One masker for every policy-masked column, so the same value is masked the
     same way in a grid, in a drill-down and in a dashboard tile. */
  function maskText(v, kind) {
    if (kind === "terms") return "••••• hidden by policy";
    if (kind === "hidden") return "•••••";
    if (v === null || v === undefined || v === "") return "—";
    if (kind === "email") { var p = String(v).split("@"); return p[0].charAt(0) + "••••@" + (p[1] || ""); }
    if (kind === "phone") return String(v).replace(/\d(?=[\s\S]*\d\d)/g, "•");
    if (kind === "amount") return "USD •••,•" + ("00" + Math.round(Number(v))).slice(-2);
    return "•••••";
  }
  /* one seeded generator for the whole file, so every run of the page and of
     tools/erp-qa-check.js produces byte-identical data */
  var _seed = 20261006;
  function rnd() { _seed = (_seed * 1103515245 + 12345) % 2147483648; return _seed / 2147483648; }
  function ri(lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }

  /* ----------------------------------------------------------- calendars */
  var TODAY = "2026-10-06", NOW_MIN = 9 * 60 + 40;     /* Tue 6 Oct 2026, 09:40 */
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function parseD(s) { return new Date(s + "T00:00:00Z"); }
  function isoD(d) { return d.toISOString().slice(0, 10); }
  function addDays(s, n) { var d = parseD(s); d.setUTCDate(d.getUTCDate() + n); return isoD(d); }
  function addBiz(s, n) { var d = parseD(s), i = 0, w; while (i < n) { d.setUTCDate(d.getUTCDate() + 1); w = d.getUTCDay(); if (w !== 0 && w !== 6) i++; } return isoD(d); }
  function bizBetween(a, b) { var d = parseD(a), e = parseD(b), n = 0, w; while (d < e) { d.setUTCDate(d.getUTCDate() + 1); w = d.getUTCDay(); if (w !== 0 && w !== 6) n++; } return n; }
  function dLabel(s) { var d = parseD(s); return d.getUTCDate() + " " + MON[d.getUTCMonth()] + " " + d.getUTCFullYear(); }
  function dShort(s) { var d = parseD(s); return d.getUTCDate() + " " + MON[d.getUTCMonth()]; }
  /* JDE keeps dates as a Julian CYYDDD number; the demo shows both. */
  function julian(s) {
    var d = parseD(s), y = d.getUTCFullYear();
    var day = Math.round((d - parseD(y + "-01-01")) / 86400000) + 1;
    return String(y - 1900) + ("00" + day).slice(-3);
  }
  function clock(minAgo) {
    var m = NOW_MIN - minAgo, h = Math.floor(m / 60);
    return ("0" + h).slice(-2) + ":" + ("0" + (m % 60)).slice(-2);
  }
  function dur(min) { return min < 60 ? min + " min" : Math.floor(min / 60) + " h " + ("0" + (min % 60)).slice(-2) + " min"; }

  var world = {
    company: "Norwell Group",
    subtitle: "Multi-entity group · plants, distribution and services",
    currency: "USD",
    today: TODAY,
    todayLabel: "Tue 6 Oct 2026",
    nowLabel: "09:40",
    week: { id: "2026-W41", label: "This week", range: "Mon 5 – Fri 9 Oct 2026", start: "2026-10-05", end: "2026-10-09" },
    horizon: { start: "2026-09-07", end: "2026-10-30" },
    state: "Order book open · 138 lines past promise or predicted late",
    entities: [
      { id: "NG-EU", name: "Norwell Europe", system: "FUSION", currency: "GBP", note: "Plants EU-1 to EU-3 · central procurement and contracts" },
      { id: "NG-NA", name: "Norwell North America", system: "JDE", currency: "CAD", note: "JDE company 00100 · branch plants NA-1 and NA-2" },
      { id: "NG-SV", name: "Arden Services", system: "NETSUITE", currency: "USD", note: "Field and project services · location SV-1" }
    ]
  };

  var personas = [
    { id: "dana", name: "Dana Whitfield", title: "VP Commercial Operations", initials: "DW", role: "COMMERCIAL_OPS", scope: "All entities · unmasked" },
    { id: "marcus", name: "Marcus Bell", title: "Regional operations analyst, North America", initials: "MB", role: "ANALYST_NA", scope: "NG-NA only · contacts, credit limits and penalty terms masked" },
    { id: "priya", name: "Priya Natarajan", title: "Data steward", initials: "PN", role: "STEWARD", scope: "Owns the identity queues in Decisions" }
  ];

  var roles = {
    COMMERCIAL_OPS: {
      id: "COMMERCIAL_OPS", name: "VP Commercial Operations", persona: "dana",
      rowPolicy: null, rowPolicyText: "No row restriction · all three entities",
      masked: [], maskedText: "No column masking",
      allowList: "OPS_QA_V2", entities: ["NG-EU", "NG-NA", "NG-SV"]
    },
    ANALYST_NA: {
      id: "ANALYST_NA", name: "Regional operations analyst NA", persona: "marcus",
      rowPolicy: "ENTITY IN ('NG-NA')",
      rowPolicyText: "Row policy GOLD_RLS_ENTITY applied · ENTITY IN ('NG-NA')",
      masked: ["CONTACT_EMAIL", "CONTACT_PHONE", "CREDIT_LIMIT", "PENALTY_TERMS"],
      maskedText: "CRM contact email and phone masked · credit limits and contract penalty terms hidden",
      allowList: "OPS_QA_V2", entities: ["NG-NA"]
    },
    STEWARD: {
      id: "STEWARD", name: "Data steward", persona: "priya",
      rowPolicy: null, rowPolicyText: "No row restriction · all three entities",
      masked: ["CREDIT_LIMIT"], maskedText: "Credit limits hidden",
      allowList: "OPS_QA_V2", entities: ["NG-EU", "NG-NA", "NG-SV"]
    }
  };

  /* ------------------------------------------------------------- sources */
  var sources = [
    { id: "FUSION", name: "Norwell Europe · Oracle Fusion Cloud", short: "Fusion", entity: "NG-EU",
      kind: "Oracle applications · SCM, ERP and Enterprise Contracts", catalog: "FUSION_SCM", currency: "GBP", rate: 1.2740,
      objects: ["DOO_HEADERS_ALL", "DOO_FULFILL_LINES_ALL", "INV_ONHAND_QUANTITIES_DETAIL", "EGP_SYSTEM_ITEMS_B", "HZ_PARTIES", "HZ_CUST_ACCOUNTS", "AR_CUSTOMER_PROFILES", "PO_HEADERS_ALL", "PO_LINE_LOCATIONS_ALL", "OKC_K_HEADERS_ALL_B", "OKC_K_LINES_B", "OKC_K_ARTICLES_B"],
      rowCount: 5184300, feed: "Prebuilt Fusion pipeline · BICC extracts, hourly", feedShort: "Fusion pipeline · hourly", freshnessMin: 12 },
    { id: "JDE", name: "Norwell North America · JD Edwards EnterpriseOne", short: "JD Edwards", entity: "NG-NA",
      kind: "Oracle application", catalog: "JDE_E1", currency: "CAD", rate: 0.7315,
      objects: ["F4201", "F4211", "F41021", "F4101", "F4104", "F0301", "F0101", "F4311", "F03B11"],
      rowCount: 3417820, feed: "Oracle GoldenGate change data capture", feedShort: "GoldenGate CDC", freshnessMin: 4 },
    { id: "NETSUITE", name: "Arden Services · NetSuite", short: "NetSuite", entity: "NG-SV",
      kind: "Oracle application", catalog: "NETSUITE", currency: "USD", rate: 1.0,
      objects: ["transaction", "transactionLine", "item", "customer", "inventoryBalance"],
      rowCount: 1146500, feed: "NetSuite pipeline · SuiteAnalytics Connect, every 30 min", feedShort: "SuiteAnalytics Connect · 30 min", freshnessMin: 38 },
    { id: "DLV", name: "Delivery tracking · in-house application", short: "Delivery tracking", entity: null,
      kind: "Oracle Database 23ai · schema DLV", catalog: "DLV_INHOUSE", currency: "USD", rate: 1.0,
      objects: ["DLV_SHIPMENTS", "DLV_SCAN_EVENTS", "DLV_EXCEPTIONS"],
      rowCount: 742160, feed: "Database link", feedShort: "Database link", freshnessMin: 2 },
    { id: "CRM", name: "CRM · accounts, owners and contacts", short: "CRM", entity: null,
      kind: "Iceberg tables in object storage", catalog: "CRM_ICEBERG", currency: "USD", rate: 1.0,
      objects: ["CRM_ACCOUNT", "CRM_CONTACT"],
      rowCount: 268410, feed: "External table over Iceberg, refreshed hourly", feedShort: "External table · hourly", freshnessMin: 65 }
  ];
  var SRC = {}; sources.forEach(function (s) { s.freshLabel = dur(s.freshnessMin); s.asOf = clock(s.freshnessMin); SRC[s.id] = s; });
  var stalest = sources.slice().sort(function (a, b) { return b.freshnessMin - a.freshnessMin; })[0];
  var ORDER_SYS = ["JDE", "FUSION", "NETSUITE"];
  var ENTITY_OF = { FUSION: "NG-EU", JDE: "NG-NA", NETSUITE: "NG-SV" };
  var SYS_OF_ENTITY = { "NG-EU": "FUSION", "NG-NA": "JDE", "NG-SV": "NETSUITE" };

  /* ------------------------------------------------- certified views (14) */
  /* `sources` are the source systems behind the view (the badges); `upstream`
     is the lineage graph the catalog draws — views and real source objects. */
  function up(kind, id, sys) { return { kind: kind, id: id, sys: sys || null }; }
  var views = [
    ["CUSTOMER_360", "One row per golden customer, with MATCH_SCORE and MATCH_REASON over CRM_ACCOUNT, HZ_PARTIES, F0301 and NetSuite customer.", "2026-10-02",
      ["CRM", "FUSION", "JDE", "NETSUITE"],
      [up("object", "CRM_ACCOUNT", "CRM"), up("object", "HZ_PARTIES", "FUSION"), up("object", "HZ_CUST_ACCOUNTS", "FUSION"), up("object", "F0301", "JDE"), up("object", "customer", "NETSUITE")]],
    ["ITEM_XREF", "Item identity across EGP_SYSTEM_ITEMS_B, F4101 with F4104, and the NetSuite item, unit of measure normalised.", "2026-09-29",
      ["FUSION", "JDE", "NETSUITE"],
      [up("object", "EGP_SYSTEM_ITEMS_B", "FUSION"), up("object", "F4101", "JDE"), up("object", "F4104", "JDE"), up("object", "item", "NETSUITE")]],
    ["OPEN_ORDER_LINES_X", "Three order books on one grain: F4211, DOO_FULFILL_LINES_ALL and transactionLine, statuses harmonised through DOC_MAP.", "2026-10-05",
      ["FUSION", "JDE", "NETSUITE"],
      [up("object", "F4211", "JDE"), up("object", "F4201", "JDE"), up("object", "DOO_FULFILL_LINES_ALL", "FUSION"), up("object", "DOO_HEADERS_ALL", "FUSION"), up("object", "transactionLine", "NETSUITE"), up("object", "transaction", "NETSUITE"), up("view", "CUSTOMER_360"), up("view", "ITEM_XREF")]],
    ["PROMISE_STATUS", "Promised date against predicted ship date per open line, from F4211.SDPDDJ, SCHEDULE_SHIP_DATE and expectedshipdate.", "2026-10-06",
      ["FUSION", "JDE", "NETSUITE", "DLV"],
      [up("view", "OPEN_ORDER_LINES_X"), up("view", "TRANSIT_STATUS")]],
    ["STOCK_POSITION", "On hand by item and plant across all three systems, in the group unit of measure.", "2026-10-06",
      ["FUSION", "JDE", "NETSUITE"],
      [up("object", "INV_ONHAND_QUANTITIES_DETAIL", "FUSION"), up("object", "F41021", "JDE"), up("object", "inventoryBalance", "NETSUITE"), up("view", "ITEM_XREF")]],
    ["LATE_CAUSES", "One cause per late line: stock elsewhere, supplier late, credit hold or late in transit.", "2026-10-06",
      ["FUSION", "JDE", "NETSUITE", "DLV"],
      [up("view", "PROMISE_STATUS"), up("view", "STOCK_POSITION"), up("view", "SUPPLIER_DELAYS"), up("view", "CREDIT_HOLDS"), up("view", "TRANSIT_STATUS")]],
    ["SUPPLIER_DELAYS", "Purchase orders past their promised date covering an open sales line: PO_LINE_LOCATIONS_ALL.PROMISED_DATE and F4311.", "2026-10-06",
      ["FUSION", "JDE"],
      [up("object", "PO_HEADERS_ALL", "FUSION"), up("object", "PO_LINE_LOCATIONS_ALL", "FUSION"), up("object", "F4311", "JDE")]],
    ["CREDIT_HOLDS", "Customers on credit hold with limit, open balance and hold date: AR_CUSTOMER_PROFILES.CREDIT_HOLD and F03B11.", "2026-10-06",
      ["FUSION", "JDE", "NETSUITE"],
      [up("object", "AR_CUSTOMER_PROFILES", "FUSION"), up("object", "F03B11", "JDE"), up("view", "CUSTOMER_360")]],
    ["TRANSIT_STATUS", "Shipments joined to the lines they carry: carrier, last scan, exception code and current ETA.", "2026-10-06",
      ["DLV", "FUSION", "JDE", "NETSUITE"],
      [up("object", "DLV_SHIPMENTS", "DLV"), up("object", "DLV_SCAN_EVENTS", "DLV"), up("object", "DLV_EXCEPTIONS", "DLV"), up("view", "OPEN_ORDER_LINES_X")]],
    ["SLA_EXPOSURE", "Lead time and late-penalty exposure per line, read from the OKC_K_ARTICLES_B clause bodies.", "2026-10-03",
      ["FUSION"],
      [up("object", "OKC_K_HEADERS_ALL_B", "FUSION"), up("object", "OKC_K_LINES_B", "FUSION"), up("object", "OKC_K_ARTICLES_B", "FUSION"), up("view", "CUSTOMER_360")]],
    ["REVENUE_AT_RISK", "Line value at risk in USD, with the account, tier, cause and penalty on every row.", "2026-10-06",
      ["FUSION", "JDE", "NETSUITE", "CRM", "DLV"],
      [up("view", "OPEN_ORDER_LINES_X"), up("view", "PROMISE_STATUS"), up("view", "CUSTOMER_360"), up("object", "CRM_ACCOUNT", "CRM"), up("view", "SLA_EXPOSURE"), up("view", "LATE_CAUSES")]],
    ["ACCOUNT_EXPOSURE", "Revenue at risk rolled up to the golden customer, with tier, owner, region, systems and penalty.", "2026-10-06",
      ["FUSION", "JDE", "NETSUITE", "CRM"],
      [up("view", "REVENUE_AT_RISK"), up("object", "CRM_ACCOUNT", "CRM")]],
    ["RECOMMENDED_ACTIONS", "What the agent proposes, with the lines, accounts, owner and task behind each one.", "2026-10-06",
      ["FUSION", "JDE", "NETSUITE", "DLV"],
      [up("view", "REVENUE_AT_RISK"), up("view", "LATE_CAUSES"), up("view", "STOCK_POSITION"), up("view", "ACCOUNT_EXPOSURE")]],
    ["DECISIONS", "Every decision a person takes on a recommendation or a match: who, when, why, the rule.", "2026-10-06",
      ["FUSION", "JDE", "NETSUITE"],
      [up("view", "RECOMMENDED_ACTIONS"), up("view", "CUSTOMER_360"), up("view", "ITEM_XREF")]]
  ].map(function (v) {
    return { id: v[0], name: "GOLD." + v[0], owner: v[0] === "SLA_EXPOSURE" ? "Group Legal" : (v[0] === "CUSTOMER_360" || v[0] === "ACCOUNT_EXPOSURE" ? "Commercial operations" : "Group Operations"), definition: v[1], changed: v[2], sources: v[3], upstream: v[4] };
  });
  var VIEW = {}; views.forEach(function (v) { VIEW[v.id] = v; });

  /* ---------------------------------------------------------------------- */
  /* Catalog descriptions the text-to-SQL agent reads before it writes SQL.   */
  /* Oracle ships no business glossary or synonym editor: what it ships is    */
  /* auto-populated catalog metadata with a per-column Description field a    */
  /* person reviews. The array keeps the historical `glossary` key name.      */
  var glossary = [
    { term: "at risk", column: "GOLD.REVENUE_AT_RISK.AT_RISK",
      definition: "An open order line whose promised delivery date has already passed, or whose predicted ship date falls after it. Lines already delivered, cancelled or accepted on a new date are out.",
      owner: "Commercial operations", changed: "2026-10-02" },
    { term: "this week", column: "GOLD.PROMISE_STATUS.PROMISE_WEEK",
      definition: "The current business week, Mon 5 to Fri 9 October 2026. Lines promised earlier and still open count as at risk this week.",
      owner: "Commercial operations", changed: "2026-09-28" },
    { term: "best accounts", column: "GOLD.ACCOUNT_EXPOSURE.TIER",
      definition: "Accounts with tier A in CRM_ACCOUNT. Tier is set by the commercial team on the CRM account, not by revenue in any ERP.",
      owner: "Commercial operations", changed: "2026-09-22" },
    { term: "revenue at risk",
      column: "GOLD.REVENUE_AT_RISK.VALUE_USD",
      definition: "Open line value on at-risk lines, translated to USD at the current daily rate: Fusion lines in GBP, JD Edwards lines in CAD, NetSuite lines already in USD. It is exposure, not a loss — it is protected if the line is actioned.",
      owner: "Commercial operations", changed: "2026-10-01" },
    { term: "promised date", column: "GOLD.PROMISE_STATUS.PROMISED_DATE",
      definition: "F4211.SDPDDJ in JD Edwards, DOO_FULFILL_LINES_ALL.SCHEDULE_SHIP_DATE in Fusion, transactionLine.expectedshipdate in NetSuite, all converted from the local calendar.",
      owner: "Group Operations", changed: "2026-09-29" },
    { term: "predicted ship date", column: "GOLD.PROMISE_STATUS.PREDICTED_DATE",
      definition: "When the line is now expected to ship or arrive, from stock cover, the covering purchase order, the credit hold release or the carrier ETA in the delivery-tracking database — whichever drives the line.",
      owner: "Group Operations", changed: "2026-10-06" },
    { term: "stock elsewhere", column: "GOLD.LATE_CAUSES.CAUSE_ID",
      definition: "The item is short in the plant that owes the line but on hand in another plant, in any of the three systems, in enough quantity to cover it. Matched through ITEM_XREF because the item numbers differ.",
      owner: "Group Operations", changed: "2026-10-02" },
    { term: "late supplier", column: "GOLD.SUPPLIER_DELAYS.DAYS_LATE",
      definition: "A purchase order covering the line whose PO_LINE_LOCATIONS_ALL.PROMISED_DATE (or JDE F4311 promise) has passed with no receipt.",
      owner: "Group Procurement", changed: "2026-09-26" },
    { term: "credit hold", column: "GOLD.CREDIT_HOLDS.ON_HOLD",
      definition: "AR_CUSTOMER_PROFILES.CREDIT_HOLD = 'Y' on the customer account, or open receivables in F03B11 past the terms by more than 30 days.",
      owner: "Credit control", changed: "2026-09-18" },
    { term: "SLA penalty", column: "GOLD.SLA_EXPOSURE.PENALTY_USD",
      definition: "The late-delivery penalty the customer contract allows, read from the clause text in OKC_K_ARTICLES_B and applied to the line value for the business days late, up to the cap in the clause.",
      owner: "Group Legal", changed: "2026-10-03" },
    { term: "on time in full", column: "GOLD.PROMISE_STATUS.OTIF",
      definition: "A line delivered complete on or before its promised date. Partial deliveries count as not on time in full even when the balance follows the same week.",
      owner: "Group Operations", changed: "2026-09-14" },
    { term: "open order line", column: "GOLD.OPEN_ORDER_LINES_X.LINE_ID",
      definition: "A sales order line not yet invoiced or cancelled in its source system: JDE next status below 580, Fusion status not CLOSED or CANCELED, NetSuite status Pending Fulfillment or Partially Fulfilled.",
      owner: "Group Operations", changed: "2026-10-05" }
  ];
  var GLOSS = {}; glossary.forEach(function (g) { GLOSS[g.term] = g; });

  /* ==================================================================== */
  /* CUSTOMER MASTER — 60 golden customers across CRM, Fusion, JDE and     */
  /* NetSuite, plus the 25 matches still waiting for a person.             */
  /* ==================================================================== */
  var OWNERS = ["Nadia Okonkwo", "Tom Fairbairn", "Elise Moreau", "Ravi Shanmugam",
    "Greta Lindqvist", "Owen Brady", "Hannah Vogel", "Sam Adeyemi"];
  var CITY = {
    FUSION: ["Manchester", "Leeds", "Bristol", "Sheffield", "Coventry", "Derby", "Swindon", "Reading", "Glasgow", "Cardiff", "Norwich", "Preston"],
    JDE: ["Mississauga", "Brampton", "Hamilton", "Windsor", "Kitchener", "Laval", "Calgary", "Edmonton", "Winnipeg", "Burnaby", "Oshawa", "Guelph"],
    NETSUITE: ["Columbus", "Akron", "Dayton", "Toledo", "Fort Wayne", "Peoria", "Rockford", "Springfield", "Wichita", "Tulsa", "Omaha", "Boise"]
  };
  var COUNTRY = { FUSION: "GB", JDE: "CA", NETSUITE: "US" };
  var REGION_OF = { FUSION: "UK & Ireland", JDE: "Canada", NETSUITE: "US Midwest" };
  var CUSTMETA = {
    CRM: { object: "CRM_ACCOUNT", keyCol: "ACCOUNT_ID", nameCol: "ACCOUNT_NAME" },
    FUSION: { object: "HZ_CUST_ACCOUNTS", keyCol: "ACCOUNT_NUMBER", nameCol: "HZ_PARTIES.PARTY_NAME" },
    JDE: { object: "F0301", keyCol: "AIAN8", nameCol: "F0101.ABALPH" },
    NETSUITE: { object: "customer", keyCol: "entityid", nameCol: "companyname" }
  };
  var SUFFIX = { FUSION: ["Ltd", "Ltd", "PLC", "Group Ltd"], JDE: ["Ltd", "Inc", "Corp"], NETSUITE: ["Inc", "LLC", "Corp"] };

  /* -------- the exposed accounts, hand-written so every count holds -----
     [name, tier, region-system, owner index, annual revenue USD k,
      groups: [source system, cause, lines, at-risk value USD k], extra systems]
     The 20 head accounts carry 98 of the 138 at-risk lines and USD 3.843 M of
     the USD 4.18 M; the 18 tail accounts carry the remaining 40 lines and
     USD 337 k. The nine tier-A accounts are all in the head and total exactly
     USD 2.36 M. Halden Tooling Group is first by value and is the one Dana
     overrules in step 5. */
  var ACC = [
    ["Halden Tooling Group", "A", "JDE", 0, 41800, [["JDE", "stock", 4, 412]], ["FUSION"]],
    ["Kestrel Components", "A", "FUSION", 1, 36200, [["JDE", "stock", 3, 220], ["FUSION", "transit", 4, 166]], []],
    ["Bramley Logistics", "A", "JDE", 2, 29400, [["JDE", "transit", 5, 151], ["NETSUITE", "supplier", 3, 190]], []],
    ["Tamsin Packaging", "B", "FUSION", 3, 18600, [["FUSION", "supplier", 4, 178], ["FUSION", "stock", 3, 120]], []],
    ["Ravenscourt Electrical", "A", "JDE", 0, 26100, [["JDE", "credit", 4, 204], ["JDE", "transit", 3, 70]], []],
    ["Wexford Industrial Supplies", "A", "FUSION", 4, 24800, [["FUSION", "stock", 3, 168], ["NETSUITE", "transit", 3, 84]], []],
    ["Aldwych Chemicals", "B", "FUSION", 5, 15300, [["FUSION", "credit", 2, 128], ["FUSION", "transit", 4, 103]], []],
    ["Marlowe Freight Services", "A", "JDE", 2, 21700, [["JDE", "supplier", 3, 132], ["JDE", "stock", 2, 82]], []],
    ["Pentland Bearings", "A", "JDE", 6, 19900, [["JDE", "stock", 3, 117], ["NETSUITE", "credit", 2, 79]], []],
    ["Calderwood Castings", "B", "FUSION", 7, 12400, [["FUSION", "supplier", 2, 108], ["FUSION", "transit", 3, 70]], []],
    ["Stanhope Instrumentation", "A", "NETSUITE", 1, 17600, [["NETSUITE", "stock", 2, 104], ["NETSUITE", "transit", 2, 58]], ["FUSION"]],
    ["Fenwick Industries", "B", "JDE", 3, 11800, [["JDE", "transit", 3, 70], ["JDE", "credit", 2, 77]], []],
    ["Larkfield Hydraulics", "A", "FUSION", 4, 16400, [["FUSION", "credit", 2, 82], ["FUSION", "transit", 2, 41]], []],
    ["Northline Cartage", "B", "JDE", 6, 9200, [["JDE", "supplier", 4, 118]], []],
    ["Garrick Facilities", "C", "NETSUITE", 5, 4800, [["NETSUITE", "supplier", 3, 104]], []],
    ["Merrion Seals", "B", "FUSION", 7, 8600, [["FUSION", "stock", 4, 96]], []],
    ["Oakfield Fasteners", "B", "JDE", 0, 7900, [["JDE", "transit", 4, 88]], []],
    ["Thornby Coatings", "C", "FUSION", 1, 5200, [["FUSION", "transit", 3, 81]], []],
    ["Brindle Valves", "B", "JDE", 2, 6700, [["JDE", "stock", 4, 74]], []],
    ["Selwyn Automation", "B", "NETSUITE", 3, 6100, [["NETSUITE", "transit", 3, 68]], []],
    ["Alderney Abrasives", "C", "JDE", 4, 2400, [["JDE", "stock", 3, 26]], []],
    ["Bexley Motors", "B", "JDE", 5, 5400, [["JDE", "stock", 3, 24]], []],
    ["Carrick Controls", "C", "FUSION", 6, 2100, [["FUSION", "stock", 2, 18]], []],
    ["Denholm Timber", "C", "FUSION", 7, 1800, [["FUSION", "stock", 2, 14]], []],
    ["Elmsworth Filtration", "B", "NETSUITE", 0, 4900, [["NETSUITE", "stock", 3, 25]], []],
    ["Fairholme Adhesives", "C", "NETSUITE", 1, 1600, [["NETSUITE", "stock", 3, 20]], []],
    ["Glenmoor Pumps", "B", "JDE", 2, 5800, [["JDE", "supplier", 3, 28]], []],
    ["Harbury Conveyors", "C", "JDE", 3, 2200, [["JDE", "supplier", 2, 16]], []],
    ["Inverleith Safety Equipment", "C", "FUSION", 4, 1900, [["FUSION", "supplier", 3, 26]], []],
    ["Kingsmere Machining", "B", "FUSION", 5, 6300, [["FUSION", "supplier", 3, 30]], []],
    ["Langmere Lubricants", "C", "NETSUITE", 6, 1400, [["NETSUITE", "supplier", 1, 10]], []],
    ["Marchwood Plastics", "B", "JDE", 7, 4700, [["JDE", "credit", 1, 9]], []],
    ["Norbury Gaskets", "C", "FUSION", 0, 1700, [["FUSION", "credit", 2, 13]], []],
    ["Pembury Welding Supplies", "C", "NETSUITE", 1, 1500, [["NETSUITE", "credit", 2, 12]], []],
    ["Redgrave Calibration", "B", "NETSUITE", 2, 3900, [["NETSUITE", "credit", 1, 6]], []],
    ["Sedgemoor Metals", "B", "JDE", 3, 5100, [["JDE", "transit", 3, 30]], []],
    ["Ulverton Cable Assemblies", "C", "JDE", 4, 2600, [["JDE", "transit", 2, 18]], []],
    ["Westbourne Print Services", "C", "FUSION", 5, 1300, [["FUSION", "transit", 1, 12]], []]
  ];
  /* customers with no line at risk this week — they still sit in the master,
     so CUSTOMER_360 and the tier counts are not built only from exceptions */
  var QUIET = [
    ["Ashcombe Laboratory Supplies", "B", "FUSION", 6, 7400], ["Barnwell Hydraulics", "C", "JDE", 7, 2800],
    ["Braeburn Catering Services", "C", "NETSUITE", 0, 1200], ["Corbridge Fabrication", "B", "FUSION", 1, 8100],
    ["Cranbourne Uniforms", "C", "NETSUITE", 2, 1100], ["Dunmore Bearings", "B", "JDE", 3, 6600],
    ["Ebbsworth Instrumentation", "C", "FUSION", 4, 2300], ["Fernlea Packaging", "B", "FUSION", 5, 7700],
    ["Grantley Coatings", "C", "JDE", 6, 2000], ["Hartwell Electrical", "B", "JDE", 7, 9300],
    ["Havenbrook Logistics", "B", "NETSUITE", 0, 8800], ["Jessamine Chemicals", "C", "FUSION", 1, 2500],
    ["Kirkland Castings", "B", "JDE", 2, 5900], ["Quainton Automation", "C", "NETSUITE", 3, 1800],
    ["Rookwood Seals", "C", "FUSION", 4, 1600], ["Vantry Freight Services", "B", "JDE", 5, 7200],
    ["Welbeck Components", "A", "FUSION", 6, 22400], ["Whitmore Valves", "B", "NETSUITE", 7, 6800],
    ["Yardley Fasteners", "C", "JDE", 0, 1900], ["Camberley Tooling", "B", "FUSION", 1, 8400],
    ["Draycott Filtration", "C", "NETSUITE", 2, 1500], ["Eastbury Motors", "C", "JDE", 3, 2700]
  ];

  var customers = [], records = [], crmAccounts = [], crmContacts = [];
  var CUST = {}, _cid = 0, _crn = 0, _fus = 0, _jde = 0, _nsu = 0;
  function nextKey(sys) {
    if (sys === "CRM") return "CRM-" + (40200 + (++_crn) * 7);
    if (sys === "FUSION") return "" + (10400 + (++_fus) * 3);
    if (sys === "JDE") return "" + (4210400 + (++_jde) * 11);
    return "C-" + (2040 + (++_nsu) * 5);
  }
  function taxFor(sys, seed) {
    if (sys === "FUSION") return "GB" + (300 + (seed % 600)) + " " + (1000 + (seed * 7) % 8999) + " " + (10 + seed % 89);
    if (sys === "JDE") return (100000000 + (seed * 137) % 899999999) + "RT0001";
    return String(20 + seed % 79) + "-" + (1000000 + (seed * 91) % 8999999);
  }
  function slugOf(name) {
    return name.toLowerCase().replace(/ (group|services|supplies|industries|ltd|plc|inc|llc|corp)$/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 2).join("-");
  }
  function mkCustomer(def, exposed) {
    var name = def[0], tier = def[1], home = def[2], ownerIx = def[3], revK = def[4];
    var groups = exposed ? def[5] : [], extra = (exposed ? def[6] : []) || [];
    var id = "GC-" + (7100 + (++_cid));
    var sys = [], recs = [];
    groups.forEach(function (g) { if (sys.indexOf(g[0]) < 0) sys.push(g[0]); });
    if (sys.indexOf(home) < 0) sys.push(home);
    extra.forEach(function (s) { if (sys.indexOf(s) < 0) sys.push(s); });
    sys = ORDER_SYS.filter(function (s) { return sys.indexOf(s) >= 0; });
    var homeCity = CITY[home][_cid % CITY[home].length];
    var tax = _cid * 13 + 7;
    var c = {
      id: id, name: name, tier: tier, region: REGION_OF[home], owner: OWNERS[ownerIx],
      homeSystem: home, entity: ENTITY_OF[home], city: homeCity, country: COUNTRY[home],
      annualRevenueUsd: revK * 1000, systems: sys, records: [], exposed: !!exposed,
      creditLimitUsd: Math.round(revK * 1000 * (tier === "A" ? 0.08 : tier === "B" ? 0.11 : 0.15) / 5000) * 5000
    };
    /* the CRM account is the commercial master: tier, owner, region, revenue */
    var crmKey = nextKey("CRM");
    crmAccounts.push({ id: crmKey, object: "CRM_ACCOUNT", customerId: id, name: name, tier: tier,
      owner: c.owner, region: c.region, annualRevenueUsd: c.annualRevenueUsd, city: homeCity, country: c.country });
    recs.push({ id: id + ":CRM", sys: "CRM", object: "CRM_ACCOUNT", keyCol: "ACCOUNT_ID", key: crmKey,
      name: name, city: homeCity, country: c.country, taxId: null, customerId: id, entity: null });
    sys.forEach(function (s) {
      var suffix = SUFFIX[s][(_cid + s.length) % SUFFIX[s].length];
      var stem = name.replace(/ (Group|Services|Supplies|Industries)$/, "");
      var local = s === home ? name : (stem + " " + suffix);
      var city = s === home ? homeCity : CITY[s][(_cid * 3 + s.length) % CITY[s].length];
      recs.push({ id: id + ":" + s, sys: s, object: CUSTMETA[s].object, keyCol: CUSTMETA[s].keyCol,
        key: nextKey(s), name: local, city: city, country: COUNTRY[s], taxId: taxFor(s, tax + s.length),
        customerId: id, entity: ENTITY_OF[s] });
    });
    c.records = recs.map(function (r) { return r.id; });
    c.matchScore = sys.length + 1 > 2 ? r2(0.93 + (tax % 6) / 100) : 1;
    c.matchReason = sys.length + 1 > 2
      ? (tax % 3 === 0 ? "Tax registration number identical in every system" : "Name and address matched, tax registration number identical in two of three")
      : "Single source record, nothing to resolve";
    c.matchStatus = "confirmed";
    recs.forEach(function (r) { records.push(r); });
    customers.push(c); CUST[id] = c;
    /* two contacts per exposed account, one per quiet account */
    var slug = slugOf(name), fn = ["Priya", "Daniel", "Aoife", "Mateo", "Ingrid", "Noah", "Selma", "Tobias", "Rhea", "Callum"];
    var ln = ["Iyer", "Whitcombe", "Nolan", "Reyes", "Sandberg", "Achterberg", "Baptiste", "Kruger", "Malhotra", "Doyle"];
    var n = exposed ? 2 : 1, i;
    for (i = 0; i < n; i++) {
      var first = fn[(_cid * 2 + i) % fn.length], last = ln[(_cid * 3 + i * 5) % ln.length];
      crmContacts.push({
        id: "CT-" + (8200 + _cid * 2 + i), object: "CRM_CONTACT", customerId: id, name: first + " " + last,
        title: i === 0 ? "Head of procurement" : "Supply chain manager",
        email: first.toLowerCase() + "." + last.toLowerCase() + "@" + slug + ".example",
        phone: c.country === "GB" ? "+44 20 7946 " + (1000 + _cid * 7 + i) : (c.country === "CA" ? "+1 905 555 0" + (100 + _cid + i) : "+1 614 555 0" + (100 + _cid + i))
      });
    }
    return c;
  }
  ACC.forEach(function (d) { mkCustomer(d, true); });
  QUIET.forEach(function (d) { mkCustomer(d, false); });
  var CRM_BY_CUST = {}; crmAccounts.forEach(function (a) { CRM_BY_CUST[a.customerId] = a; });
  var CONTACTS_BY_CUST = {}; crmContacts.forEach(function (c) { (CONTACTS_BY_CUST[c.customerId] = CONTACTS_BY_CUST[c.customerId] || []).push(c); });
  var CUST_BY_NAME = {}; customers.forEach(function (c) { CUST_BY_NAME[c.name] = c; });
  var RECBY = {}; records.forEach(function (r) { RECBY[r.id] = r; });

  /* ---- the 25 customer matches still waiting for a person --------------
     [stem, trade, system A, system B, score, city A, city B, tax flag,
      duns flag, note]. Scores sit between 0.75 and 0.89 — above them the
      model resolves on its own, below them it does not propose at all.
      Row 7 is the one a steward should reject: two different companies that
      share a name stem, in two countries, with different tax numbers. */
  var PENDING_DEFS = [
    ["Harbury", "Conveyors", "JDE", "NETSUITE", 0.86, "Kitchener", "Toledo", 0, 1, "Same parent group in the CRM, no shared registration number."],
    ["Merrion", "Seals", "FUSION", "NETSUITE", 0.84, "Leeds", "Akron", 0, 1, "European entity and its US distributor; the CRM holds one account."],
    ["Bexley", "Motors", "JDE", "FUSION", 0.83, "Brampton", "Derby", 0, 0, "Addresses differ; the buying contact e-mail domain is the same."],
    ["Kingsmere", "Machining", "FUSION", "NETSUITE", 0.88, "Sheffield", "Dayton", 1, 1, "Registration numbers agree, trading names differ by one word."],
    ["Glenmoor", "Pumps", "JDE", "NETSUITE", 0.81, "Hamilton", "Peoria", 0, 0, "Name and phone match; the postal codes are unrelated."],
    ["Sedgemoor", "Metals", "JDE", "FUSION", 0.79, "Windsor", "Bristol", 0, 1, "Group hierarchy in the CRM suggests one account, the ledgers disagree."],
    ["Thornby", "Coatings", "FUSION", "NETSUITE", 0.78, "Cardiff", "Akron", 0, 0, "Only the name stem matches: two companies, two countries, two registration numbers, no shared contact. Reject."],
    ["Elmsworth", "Filtration", "NETSUITE", "FUSION", 0.85, "Fort Wayne", "Preston", 1, 0, "Registration numbers agree; the NetSuite record carries an old trading name."],
    ["Carrick", "Controls", "FUSION", "JDE", 0.80, "Coventry", "Laval", 0, 1, "Shared ultimate parent, separate buying entities."],
    ["Alderney", "Abrasives", "JDE", "NETSUITE", 0.77, "Guelph", "Rockford", 0, 0, "Name and city type match, nothing else does."],
    ["Fairholme", "Adhesives", "NETSUITE", "FUSION", 0.82, "Springfield", "Norwich", 0, 1, "Same bill-to contact, different registration numbers."],
    ["Langmere", "Lubricants", "NETSUITE", "JDE", 0.76, "Wichita", "Burnaby", 0, 0, "Weak: name only, and the trading names differ by two words."],
    ["Norbury", "Gaskets", "FUSION", "JDE", 0.87, "Reading", "Oshawa", 1, 1, "Registration numbers agree; addresses are a head office and a plant."],
    ["Pembury", "Welding Supplies", "NETSUITE", "FUSION", 0.79, "Tulsa", "Swindon", 0, 0, "Name match with a shared contact surname, nothing stronger."],
    ["Redgrave", "Calibration", "NETSUITE", "JDE", 0.83, "Omaha", "Edmonton", 0, 1, "CRM parent matches, the ledgers hold two registration numbers."],
    ["Ulverton", "Cable Assemblies", "JDE", "FUSION", 0.81, "Winnipeg", "Glasgow", 0, 1, "Same group, separate legal entities buying separately."],
    ["Westbourne", "Print Services", "FUSION", "NETSUITE", 0.75, "Preston", "Boise", 0, 0, "Lowest proposal in the queue; name and trade only."],
    ["Inverleith", "Safety Equipment", "FUSION", "JDE", 0.86, "Glasgow", "Calgary", 1, 0, "Registration numbers agree, the JDE name is abbreviated."],
    ["Marchwood", "Plastics", "JDE", "NETSUITE", 0.84, "Brampton", "Columbus", 0, 1, "Shared parent in the CRM and one shared contact."],
    ["Denholm", "Timber", "FUSION", "NETSUITE", 0.78, "Bristol", "Peoria", 0, 0, "Name and trade match; the addresses are four thousand miles apart."],
    ["Selwyn", "Automation", "NETSUITE", "FUSION", 0.88, "Springfield", "Manchester", 1, 1, "Registration numbers agree and the CRM holds one account."],
    ["Oakfield", "Fasteners", "JDE", "FUSION", 0.82, "Mississauga", "Coventry", 0, 1, "Group hierarchy matches; separate purchase ledgers."],
    ["Brindle", "Valves", "JDE", "NETSUITE", 0.80, "Hamilton", "Dayton", 0, 0, "Name and buying contact match, addresses do not."],
    ["Garrick", "Facilities", "NETSUITE", "JDE", 0.85, "Akron", "Laval", 0, 1, "Shared parent, two service contracts, two ledgers."],
    ["Camberley", "Tooling", "FUSION", "NETSUITE", 0.89, "Derby", "Fort Wayne", 1, 1, "Strongest proposal in the queue: registration numbers and contacts agree."]
  ];
  var matches = PENDING_DEFS.map(function (p, i) {
    var a = p[2], b = p[3], stem = p[0] + " " + p[1];
    function side(sys, city, n) {
      var suf = SUFFIX[sys][(i + n) % SUFFIX[sys].length];
      return { sys: sys, object: CUSTMETA[sys].object, keyCol: CUSTMETA[sys].keyCol,
        key: nextKey(sys), name: stem + (n ? " " + suf : ""), city: city, country: COUNTRY[sys],
        taxId: taxFor(sys, i * 17 + n + 3), entity: ENTITY_OF[sys] };
    }
    var ra = side(a, p[5], 0), rb = side(b, p[6], 1);
    if (p[7]) rb.taxId = ra.taxId.replace(/^GB|RT0001$/, function (m) { return m; });
    var ev = [
      { k: "name", v: r2(0.80 + (p[4] - 0.75) * 1.2).toFixed(2), ok: true },
      { k: "registration number", v: p[7] ? "identical" : "different", ok: !!p[7] },
      { k: "address", v: p[5] === p[6] ? "same city" : "different country", ok: p[5] === p[6] },
      { k: "CRM parent", v: p[8] ? "same account" : "no link", ok: !!p[8] }
    ];
    var target = CUST_BY_NAME[stem] || null;
    return {
      id: "M-" + (3100 + i), kind: "customer", score: p[4], basis: p[7] ? "registration number + name" : "name + address",
      records: [ra, rb], systems: [a, b], evidence: ev, status: "review", note: p[9],
      targetCustomerId: target ? target.id : null, name: stem,
      wrong: i === 6, proposal: "Attach the " + SRC[b].short + " record to the " + SRC[a].short + " customer"
    };
  });

  /* ---- item master and the 7 item cross-references still pending ------- */
  var ITEM_DEFS = [
    ["TL-4420", "Carbide insert set, 12 mm", "EA", "Tooling"], ["TL-4436", "Tool holder, HSK-63", "EA", "Tooling"],
    ["BR-2180", "Bearing housing, split, 90 mm", "EA", "Bearings"], ["BR-2194", "Taper roller bearing, 120 mm", "EA", "Bearings"],
    ["VL-3312", "Control valve, DN50, stainless", "EA", "Valves"], ["VL-3328", "Butterfly valve, DN80", "EA", "Valves"],
    ["SL-8830", "Seal kit, hydraulic cylinder", "SET", "Seals"], ["SL-8846", "Rotary shaft seal, 75 mm", "EA", "Seals"],
    ["FS-1170", "Fastener kit, M12 stainless", "BOX", "Fasteners"], ["FS-1188", "Anchor bolt set, M20", "BOX", "Fasteners"],
    ["CB-3340", "Cable assembly, 12-core shielded", "EA", "Cable assemblies"], ["CB-3356", "Power cable drum, 4 core, 100 m", "DRM", "Cable assemblies"],
    ["PM-5510", "Centrifugal pump, 30 kW", "EA", "Pumps"], ["PM-5524", "Diaphragm pump, chemical duty", "EA", "Pumps"],
    ["CN-6680", "Control panel, 24 channel", "EA", "Controls"], ["CN-6694", "PLC module, 16 in / 16 out", "EA", "Controls"],
    ["FT-1220", "Filter cartridge, 10 micron", "BOX", "Filtration"], ["FT-1234", "Filter housing, 5 stage", "EA", "Filtration"],
    ["CT-9940", "Epoxy coating, 20 l drum", "DRM", "Coatings"], ["CT-9958", "Primer, zinc rich, 20 l", "DRM", "Coatings"],
    ["PK-7710", "Packaging film, 500 mm", "ROL", "Packaging"], ["PK-7726", "Corrugated case, 600 x 400", "PAL", "Packaging"],
    ["MT-2260", "Steel plate, 10 mm, S355", "PC", "Metals"], ["MT-2278", "Aluminium extrusion, 6 m", "PC", "Metals"],
    ["HY-5540", "Hydraulic cylinder, 100 / 56 / 500", "EA", "Hydraulics"], ["HY-5562", "Hydraulic hose assembly, 2 m", "EA", "Hydraulics"],
    ["EL-4410", "Motor starter, 22 kW", "EA", "Electrical"], ["EL-4428", "Distribution board, 12 way", "EA", "Electrical"],
    ["CH-3380", "Solvent cleaner, 25 l", "DRM", "Chemicals"], ["CH-3398", "Lubricant, synthetic, 20 l", "DRM", "Chemicals"],
    ["IN-4450", "Instrument module, 4-20 mA", "EA", "Instrumentation"], ["IN-4468", "Pressure transmitter, 0-16 bar", "EA", "Instrumentation"],
    ["AB-7740", "Abrasive disc, 180 mm", "BOX", "Abrasives"], ["AB-7758", "Grinding wheel, 300 mm", "EA", "Abrasives"],
    ["GS-8810", "Gasket set, flange DN100", "SET", "Gaskets"], ["GS-8824", "Sheet gasket material, 2 mm", "SHT", "Gaskets"],
    ["MO-6620", "Motor assembly, 15 kW, IE3", "EA", "Motors"], ["MO-6638", "Gear motor, 2.2 kW", "EA", "Motors"],
    ["CV-9910", "Conveyor belt, 800 mm, 10 m", "ROL", "Conveyors"], ["CV-9928", "Roller set, 50 mm, 20 pc", "SET", "Conveyors"]
  ];
  var items = ITEM_DEFS.map(function (d, i) {
    var refs = [
      { sys: "FUSION", object: "EGP_SYSTEM_ITEMS_B", keyCol: "INVENTORY_ITEM_ID", key: "" + (149200 + i * 17), alt: "EU-" + d[0] },
      { sys: "JDE", object: "F4101", keyCol: "IMITM", key: "" + (218000 + i * 23), alt: d[0].replace("-", "") },
      { sys: "NETSUITE", object: "item", keyCol: "itemid", key: d[0], alt: d[0] }
    ];
    return { id: d[0], sku: d[0], description: d[1], uom: d[2], group: d[3], refs: refs,
      xref: "F4104 cross-reference type CR · " + d[0] + " = " + d[0].replace("-", ""), status: "confirmed" };
  });
  var ITEM = {}; items.forEach(function (it) { ITEM[it.id] = it; });
  var ITEM_BY_GROUP = {}; items.forEach(function (it) { (ITEM_BY_GROUP[it.group] = ITEM_BY_GROUP[it.group] || []).push(it); });

  var XREF_DEFS = [
    ["PM-5510", "Centrifugal pump, 30 kW", "NETSUITE", "PUMP-30KW-C", "JDE", 0.86, "EA", "EA", "Description matches, the NetSuite code carries the rating, not the part number."],
    ["MT-2278", "Aluminium extrusion, 6 m", "JDE", "ALEX6000", "FUSION", 0.82, "PC", "M", "Same product, different unit of measure: pieces against metres. A person confirms the factor."],
    ["CN-6694", "PLC module, 16 in / 16 out", "FUSION", "PLC-1616-B", "NETSUITE", 0.88, "EA", "EA", "Manufacturer part number agrees; the internal numbers were issued separately."],
    ["AB-7758", "Grinding wheel, 300 mm", "NETSUITE", "GW300", "JDE", 0.79, "EA", "EA", "Short description only; three candidate items in JD Edwards."],
    ["GS-8824", "Sheet gasket material, 2 mm", "FUSION", "GSKT-SHT-2", "JDE", 0.84, "SHT", "SQM", "Sheets against square metres; the conversion is on the Fusion item, not the JDE one."],
    ["CV-9928", "Roller set, 50 mm, 20 pc", "JDE", "ROLLSET50", "NETSUITE", 0.77, "SET", "EA", "Set of twenty against each; the pack size differs between catalogues."],
    ["CH-3398", "Lubricant, synthetic, 20 l", "NETSUITE", "LUB-SYN-20", "FUSION", 0.81, "DRM", "DRM", "Same supplier part number, two internal numbers, one drum size."]
  ];
  var itemXrefs = XREF_DEFS.map(function (d, i) {
    return {
      id: "X-" + (4100 + i), kind: "item", itemId: d[0], description: d[1],
      candidate: { sys: d[2], key: d[3], object: CUSTMETA[d[2]] ? "" : "", uom: d[6] },
      against: { sys: d[4], key: ITEM[d[0]] ? ITEM[d[0]].refs.filter(function (r) { return r.sys === d[4]; })[0].key : "", uom: d[7] },
      score: d[5], status: "review", note: d[8],
      evidence: [
        { k: "description", v: r2(0.74 + (d[5] - 0.75) * 1.1).toFixed(2), ok: true },
        { k: "unit of measure", v: d[6] === d[7] ? "same" : d[6] + " against " + d[7], ok: d[6] === d[7] },
        { k: "manufacturer part", v: d[5] >= 0.84 ? "identical" : "not held", ok: d[5] >= 0.84 }
      ]
    };
  });
  itemXrefs.forEach(function (x) { x.candidate.object = x.candidate.sys === "NETSUITE" ? "item" : (x.candidate.sys === "JDE" ? "F4101" : "EGP_SYSTEM_ITEMS_B"); });

  /* ==================================================================== */
  /* PLANTS, STOCK, TRANSFERS, SUPPLIERS, CREDIT HOLDS, CONTRACTS          */
  /* ==================================================================== */
  var PLANTS = [
    { id: "EU-1", name: "Manchester plant", sys: "FUSION", entity: "NG-EU", object: "INV_ONHAND_QUANTITIES_DETAIL", org: "ORGANIZATION_ID 204", sub: "FG-MAIN" },
    { id: "EU-2", name: "Coventry plant", sys: "FUSION", entity: "NG-EU", object: "INV_ONHAND_QUANTITIES_DETAIL", org: "ORGANIZATION_ID 207", sub: "FG-MAIN" },
    { id: "EU-3", name: "Bristol plant", sys: "FUSION", entity: "NG-EU", object: "INV_ONHAND_QUANTITIES_DETAIL", org: "ORGANIZATION_ID 211", sub: "FG-BULK" },
    { id: "NA-1", name: "Mississauga branch", sys: "JDE", entity: "NG-NA", object: "F41021", org: "MCU 00100 · NA-1", sub: "" },
    { id: "NA-2", name: "Calgary branch", sys: "JDE", entity: "NG-NA", object: "F41021", org: "MCU 00100 · NA-2", sub: "" },
    { id: "SV-1", name: "Columbus location", sys: "NETSUITE", entity: "NG-SV", object: "inventoryBalance", org: "location SV-1", sub: "" }
  ];
  var PLANT = {}; PLANTS.forEach(function (p) { PLANT[p.id] = p; });
  var PLANT_OF_SYS = { FUSION: ["EU-1", "EU-2", "EU-3"], JDE: ["NA-1", "NA-2"], NETSUITE: ["SV-1"] };

  /* ---- the twelve internal transfers action A1 proposes ---------------
     [transfer id, item, from plant, to plant, lines it covers]. The first one
     is Halden's: four lines of the same tooling item, all from Coventry into
     Mississauga. Declining Halden's recommendation removes that transfer
     whole, which is why A1 falls from twelve transfers to eleven. */
  var TRANSFER_DEFS = [
    ["T-4801", "TL-4420", "EU-2", "NA-1", 4], ["T-4802", "BR-2180", "EU-1", "NA-1", 4],
    ["T-4803", "VL-3312", "SV-1", "NA-1", 4], ["T-4804", "FS-1170", "EU-3", "NA-2", 4],
    ["T-4805", "HY-5540", "EU-2", "NA-2", 3], ["T-4806", "MO-6620", "SV-1", "NA-1", 3],
    ["T-4807", "PK-7710", "NA-1", "EU-1", 4], ["T-4808", "SL-8830", "SV-1", "EU-2", 4],
    ["T-4809", "CT-9940", "NA-2", "EU-3", 3], ["T-4810", "FT-1220", "SV-1", "EU-1", 3],
    ["T-4811", "CB-3340", "EU-1", "SV-1", 4], ["T-4812", "IN-4450", "NA-2", "SV-1", 4]
  ];
  var transfers = TRANSFER_DEFS.map(function (t) {
    return { id: t[0], itemId: t[1], item: ITEM[t[1]], from: t[2], to: t[3], capacity: t[4],
      fromSys: PLANT[t[2]].sys, toSys: PLANT[t[3]].sys, lines: [], qty: 0, usd: 0,
      leadDays: PLANT[t[2]].sys === PLANT[t[3]].sys ? 2 : 4, owner: "Supply planning" };
  });
  var TRF = {}; transfers.forEach(function (t) { TRF[t.id] = t; });

  /* ---- the six late suppliers action A4 escalates --------------------- */
  var SUPPLIER_DEFS = [
    ["SUP-2140", "Pentworth Alloys", "FUSION", "PO-EU-40218", 6, 11, "Foundry capacity; the second melt slipped a week."],
    ["SUP-2168", "Rothbury Extrusions", "JDE", "5480216", 6, 9, "Extrusion die failure, repair quoted at eight working days."],
    ["SUP-2194", "Linstead Polymers", "FUSION", "PO-EU-40331", 5, 14, "Raw resin allocation cut by the producer."],
    ["SUP-2207", "Kelsale Castings", "FUSION", "PO-EU-40407", 5, 7, "Late pattern change agreed with engineering, not re-promised."],
    ["SUP-2233", "Duxbury Electronics", "FUSION", "PO-EU-40462", 5, 12, "Component lead time moved from ten to twenty-two weeks."],
    ["SUP-2251", "Ormskirk Forgings", "JDE", "5480477", 4, 8, "Heat-treatment subcontractor queue."]
  ];
  var suppliers = SUPPLIER_DEFS.map(function (s) {
    return { id: s[0], name: s[1], sys: s[2], poKey: s[3], capacity: s[4], daysLate: s[5], reason: s[6],
      object: s[2] === "JDE" ? "F4311" : "PO_HEADERS_ALL", lines: [], usd: 0 };
  });
  var SUP = {}; suppliers.forEach(function (s) { SUP[s.id] = s; });

  /* ---- Enterprise Contracts: headers, lines and the clause bodies ------
     Tier A and tier B accounts trade under a framework agreement; tier C
     accounts buy on the standard terms with no penalty clause. The AI reads
     the penalty from the clause text, it is not a column anywhere. */
  var CLAUSE_VARIANTS = [
    { id: "V1", leadTimeDays: 10, perDay: 0.005, cap: 0.10,
      delivery: "Seller shall deliver each ordered line within 10 business days of order acknowledgement.",
      penalty: "Where a line is delivered after the acknowledged date, a penalty of 0.5 % of the line value shall accrue for each business day of delay, capped at 10 % of the line value." },
    { id: "V2", leadTimeDays: 15, perDay: 0.0025, cap: 0.05,
      delivery: "Seller shall deliver each ordered line within 15 business days of order acknowledgement.",
      penalty: "Where a line is delivered after the acknowledged date, a penalty of 0.25 % of the line value shall accrue for each business day of delay, capped at 5 % of the line value." },
    { id: "V3", leadTimeDays: 8, perDay: 0.0075, cap: 0.12,
      delivery: "Seller shall deliver each ordered line within 8 business days of order acknowledgement.",
      penalty: "Where a line is delivered after the acknowledged date, a penalty of 0.75 % of the line value shall accrue for each business day of delay, capped at 12 % of the line value." }
  ];
  var CV = {}; CLAUSE_VARIANTS.forEach(function (v) { CV[v.id] = v; });
  var contracts = [], clauses = [], CONTRACT_BY_CUST = {}, _kn = 0;
  customers.forEach(function (c) {
    if (c.tier === "C") return;
    /* three tier-B accounts sit on the softer clause, one tier-A on the harder
       one; the rest are on the group standard */
    var vid = "V1";
    if (c.tier === "B" && (_kn % 6 === 2)) vid = "V2";
    if (c.name === "Ravenscourt Electrical") vid = "V3";
    var v = CV[vid];
    var num = "NG-EC-" + (10400 + (++_kn) * 3);
    var fus = c.records.map(function (rid) { return RECBY[rid]; }).filter(function (r) { return r.sys === "FUSION"; })[0];
    var k = {
      id: num, object: "OKC_K_HEADERS_ALL_B", keyCol: "CONTRACT_NUMBER", key: num,
      customerId: c.id, customer: c.name, partyId: fus ? fus.key : null,
      partyIdCol: "PARTY_ID", type: "Framework agreement · goods and services",
      startDate: "2026-01-01", endDate: "2027-12-31", currency: c.homeSystem === "FUSION" ? "GBP" : "USD",
      variant: vid, leadTimeDays: v.leadTimeDays, penaltyPerDay: v.perDay, cap: v.cap,
      penaltyText: v.penalty, deliveryText: v.delivery,
      lineCount: 3 + (_kn % 4), status: "Active"
    };
    contracts.push(k); CONTRACT_BY_CUST[c.id] = k;
    clauses.push({ id: num + "-A1", contractId: num, object: "OKC_K_ARTICLES_B", article: "Delivery lead time",
      section: "4.1", text: v.delivery, variables: "LEAD_TIME_DAYS = " + v.leadTimeDays });
    clauses.push({ id: num + "-A2", contractId: num, object: "OKC_K_ARTICLES_B", article: "Late delivery penalty",
      section: "4.2", text: v.penalty, variables: "PENALTY_PCT_PER_DAY = " + (v.perDay * 100).toFixed(2) + " · PENALTY_CAP_PCT = " + (v.cap * 100).toFixed(0) });
    clauses.push({ id: num + "-A3", contractId: num, object: "OKC_K_ARTICLES_B", article: "Order acceptance",
      section: "3.2", text: "Buyer may accept a revised delivery date in writing; a line delivered on an accepted revised date carries no penalty under clause 4.2.",
      variables: "ACCEPTED_REPROMISE = Y" });
  });

  /* ---- credit holds ---------------------------------------------------- */
  var HOLD_ACCOUNTS = ["Ravenscourt Electrical", "Aldwych Chemicals", "Pentland Bearings", "Fenwick Industries",
    "Larkfield Hydraulics", "Marchwood Plastics", "Norbury Gaskets", "Pembury Welding Supplies", "Redgrave Calibration"];
  var creditHolds = [], HOLD_BY_CUST = {};
  HOLD_ACCOUNTS.forEach(function (nm, i) {
    var c = CUST_BY_NAME[nm]; if (!c) return;
    var sysOfHold = null;
    /* the hold sits in the system that carries the held lines */
    ACC.forEach(function (a) { if (a[0] === nm) a[5].forEach(function (g) { if (g[1] === "credit") sysOfHold = g[0]; }); });
    var rec = c.records.map(function (rid) { return RECBY[rid]; }).filter(function (r) { return r.sys === sysOfHold; })[0];
    var h = {
      id: "CH-" + (6100 + i), customerId: c.id, customer: nm, sys: sysOfHold,
      object: sysOfHold === "FUSION" ? "AR_CUSTOMER_PROFILES" : (sysOfHold === "JDE" ? "F03B11" : "customer"),
      column: sysOfHold === "FUSION" ? "AR_CUSTOMER_PROFILES.CREDIT_HOLD = 'Y'"
        : (sysOfHold === "JDE" ? "F03B11 open items past terms by more than 30 days" : "customer.creditholdoverride = 'ON'"),
      key: rec ? rec.key : "", creditLimitUsd: c.creditLimitUsd,
      openBalanceUsd: Math.round(c.creditLimitUsd * (1.05 + (i % 5) * 0.07) / 100) * 100,
      pastDueUsd: Math.round(c.creditLimitUsd * (0.12 + (i % 4) * 0.05) / 100) * 100,
      placedOn: addDays("2026-09-01", i * 3 + 2), owner: "Credit control",
      reason: ["Open items 45 days past terms", "Limit exceeded after the September orders", "Disputed invoice held by the customer",
        "Limit not reviewed since the annual accounts", "Payment plan agreed, first instalment outstanding"][i % 5]
    };
    creditHolds.push(h); HOLD_BY_CUST[c.id] = h;
  });

  /* ==================================================================== */
  /* THE 138 OPEN ORDER LINES AT RISK                                      */
  /* ==================================================================== */
  var CAUSES = [
    { id: "stock", label: "Stock available in another plant or system", short: "Stock elsewhere", actionId: "A1",
      note: "The symptom is in one system, the stock is in another." },
    { id: "supplier", label: "Supplier late", short: "Supplier late", actionId: "A4",
      note: "A purchase order covering the line is past its promised date." },
    { id: "credit", label: "Credit hold", short: "Credit hold", actionId: "A3",
      note: "The order is held by credit control, not by supply." },
    { id: "transit", label: "Late in transit", short: "Late in transit", actionId: "A2",
      note: "Shipped, but the carrier scans put arrival after the promise." }
  ];
  var CAUSE = {}; CAUSES.forEach(function (c) { CAUSE[c.id] = c; });
  /* days late by cause: the value-weighted mean across contracted lines is
     what drives the USD 186 k of penalty exposure */
  var DAYS = { stock: [9, 15], supplier: [8, 13], credit: [5, 10], transit: [3, 10] };
  var HARMONISED = { stock: "Backordered", supplier: "Awaiting supply", credit: "On credit hold", transit: "In transit" };
  var SRC_STATUS = {
    JDE: { stock: "540", supplier: "540", credit: "520", transit: "560" },
    FUSION: { stock: "BACKORDERED", supplier: "AWAIT_SHIPPING", credit: "ON_HOLD", transit: "SHIPPED" },
    NETSUITE: { stock: "Pending Fulfillment", supplier: "Pending Fulfillment", credit: "Pending Approval", transit: "Partially Fulfilled" }
  };
  var PRICE = {};
  items.forEach(function (it, i) { PRICE[it.id] = [140, 320, 760, 1450, 2800, 5200][i % 6] + (i % 7) * 35; });

  function splitValue(total, n) {
    if (n === 1) return [total];
    var w = [], i, s = 0, out = [], acc = 0, v;
    for (i = 0; i < n; i++) { v = 0.74 + rnd() * 0.52; w.push(v); s += v; }
    for (i = 0; i < n - 1; i++) { v = Math.round(total * w[i] / s / 50) * 50; out.push(v); acc += v; }
    out.push(total - acc);
    return out;
  }
  /* promise dates run back from the current week so the population reads as
     "past promise or predicted late", not as one bad day */
  var PROMISE_DAYS = ["2026-09-07", "2026-09-09", "2026-09-11", "2026-09-15", "2026-09-17", "2026-09-21",
    "2026-09-23", "2026-09-25", "2026-09-28", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08"];

  var orderLines = [], _lid = 0, _doco = 6421000, _fid = 300000048210000, _so = 20400;
  var _orderOf = {};
  function orderKeyFor(sys, custId) {
    var k = sys + custId;
    if (!_orderOf[k]) {
      if (sys === "JDE") _orderOf[k] = "" + (_doco += 7);
      else if (sys === "FUSION") _orderOf[k] = "NG-" + (1004800 + (_doco % 900) + Object.keys(_orderOf).length * 3);
      else _orderOf[k] = "SO-" + (_so += 3);
    }
    return _orderOf[k];
  }
  /* Halden's four lines are written out: their values and their days late are
     what make USD 412 k of exposure and USD 31 k of penalty, and the worst of
     them predicts 20 Oct — the date the customer accepts in step 5. */
  var HALDEN_LINES = [
    { usd: 118000, days: 16, promised: "2026-09-28", qty: 24 },
    { usd: 104000, days: 15, promised: "2026-09-30", qty: 20 },
    { usd: 98000, days: 14, promised: "2026-10-01", qty: 18 },
    { usd: 92000, days: 15, promised: "2026-10-02", qty: 18 }
  ];

  function mkLine(cust, sys, cause, usd, ix, forced) {
    var id = "L-" + (5100 + (++_lid));
    var src = SRC[sys], entity = ENTITY_OF[sys];
    var promised = forced ? forced.promised : PROMISE_DAYS[(_lid * 5 + ix) % PROMISE_DAYS.length];
    var lo = DAYS[cause][0], hi = DAYS[cause][1];
    var days = forced ? forced.days : lo + ((_lid * 3 + ix * 7) % (hi - lo + 1));
    var predicted = addBiz(promised, days);
    var order = orderKeyFor(sys, cust.id), lineNo = ((ix % 9) + 1);
    var custRec = cust.records.map(function (rid) { return RECBY[rid]; }).filter(function (r) { return r.sys === sys; })[0];
    var line = {
      id: id, sys: sys, entity: entity, customerId: cust.id, customer: cust.name, tier: cust.tier,
      causeId: cause, status: HARMONISED[cause], sourceStatus: SRC_STATUS[sys][cause],
      orderNo: order, lineNo: lineNo, promised: promised, predicted: predicted, daysLate: days,
      usd: usd, currency: src.currency, amountLocal: r2(usd / src.rate), rate: src.rate,
      atRisk: true, resolvedBy: null, itemId: null, qty: forced ? forced.qty : 0,
      transferId: null, supplierId: null, holdId: null, shipmentId: null, poKey: null,
      penaltyUsd: 0, contractId: null
    };
    if (sys === "JDE") {
      line.object = "F4211"; line.keyCol = "SDDOCO / SDLNID";
      line.key = order + " / " + (lineNo * 1000);
      line.keyLabel = "F4211 · SDDOCO " + order + " · SDLNID " + (lineNo * 1000);
      line.customerKey = "SDAN8 " + (custRec ? custRec.key : "");
      line.dateCols = "SDDRQJ " + julian(addBiz(promised, -8)) + " · SDPDDJ " + julian(promised);
      line.statusCol = "SDNXTR " + line.sourceStatus;
    } else if (sys === "FUSION") {
      line.object = "DOO_FULFILL_LINES_ALL"; line.keyCol = "FULFILL_LINE_ID";
      line.key = "" + (_fid += 13);
      line.keyLabel = "DOO_FULFILL_LINES_ALL · FULFILL_LINE_ID " + line.key;
      line.customerKey = "DOO_HEADERS_ALL.ORDER_NUMBER " + order;
      line.dateCols = "REQUEST_SHIP_DATE " + addBiz(promised, -6) + " · SCHEDULE_SHIP_DATE " + promised;
      line.statusCol = "STATUS_CODE " + line.sourceStatus;
    } else {
      line.object = "transactionLine"; line.keyCol = "transaction.tranid / line";
      line.key = order + " / " + lineNo;
      line.keyLabel = "transactionLine · " + order + " line " + lineNo;
      line.customerKey = "customer " + (custRec ? custRec.key : "");
      line.dateCols = "expectedshipdate " + promised;
      line.statusCol = "transaction.status " + line.sourceStatus;
    }
    orderLines.push(line);
    return line;
  }

  /* build every line, account by account, group by group */
  var accountsRaw = [];
  ACC.forEach(function (def) {
    var cust = CUST_BY_NAME[def[0]];
    var rec = { customerId: cust.id, name: def[0], groups: [], lines: [] };
    def[5].forEach(function (g) {
      var vals = def[0] === "Halden Tooling Group"
        ? HALDEN_LINES.map(function (h) { return h.usd; })
        : splitValue(g[3] * 1000, g[2]);
      var i;
      for (i = 0; i < g[2]; i++) {
        var forced = def[0] === "Halden Tooling Group" ? HALDEN_LINES[i] : null;
        var ln = mkLine(cust, g[0], g[1], vals[i], i, forced);
        rec.lines.push(ln.id);
      }
      rec.groups.push({ sys: g[0], cause: g[1], lines: g[2], usd: g[3] * 1000 });
    });
    accountsRaw.push(rec);
  });
  var LINE = {}; orderLines.forEach(function (l) { LINE[l.id] = l; });
  var LINES_BY_CUST = {}; orderLines.forEach(function (l) { (LINES_BY_CUST[l.customerId] = LINES_BY_CUST[l.customerId] || []).push(l); });

  /* ---- attach each line to the evidence that explains it ---------------- */
  /* stock elsewhere: fill the twelve transfers in account order, so Halden's
     four lines fill the first transfer exactly */
  var stockLines = orderLines.filter(function (l) { return l.causeId === "stock"; });
  ORDER_SYS.forEach(function (sys) {
    var pool = transfers.filter(function (t) { return t.toSys === sys; });
    var ls = stockLines.filter(function (l) { return l.sys === sys; }), pi = 0;
    ls.forEach(function (l) {
      while (pi < pool.length && pool[pi].lines.length >= pool[pi].capacity) pi++;
      var t = pool[pi];
      t.lines.push(l.id); l.transferId = t.id; l.itemId = t.itemId; l.toPlant = t.to; l.fromPlant = t.from;
    });
  });
  /* supplier late: six suppliers, filled the same way */
  var supLines = orderLines.filter(function (l) { return l.causeId === "supplier"; }), si = 0;
  supLines.forEach(function (l) {
    while (si < suppliers.length && suppliers[si].lines.length >= suppliers[si].capacity) si++;
    var s = suppliers[si];
    s.lines.push(l.id); l.supplierId = s.id; l.poKey = s.poKey;
  });
  /* credit hold and in transit */
  orderLines.forEach(function (l) {
    if (l.causeId === "credit") { var h = HOLD_BY_CUST[l.customerId]; if (h) l.holdId = h.id; }
  });
  /* items for every line that a transfer did not already name */
  var GROUP_OF_TRADE = ["Tooling", "Bearings", "Valves", "Seals", "Fasteners", "Cable assemblies", "Pumps", "Controls",
    "Filtration", "Coatings", "Packaging", "Metals", "Hydraulics", "Electrical", "Chemicals", "Instrumentation",
    "Abrasives", "Gaskets", "Motors", "Conveyors"];
  orderLines.forEach(function (l, i) {
    if (!l.itemId) {
      var g = GROUP_OF_TRADE[(i * 3 + l.lineNo) % GROUP_OF_TRADE.length];
      var pool = ITEM_BY_GROUP[g];
      l.itemId = pool[(i + l.lineNo) % pool.length].id;
    }
    var it = ITEM[l.itemId];
    l.item = it.sku; l.itemDescription = it.description; l.uom = it.uom;
    l.itemKey = it.refs.filter(function (r) { return r.sys === l.sys; })[0].key;
    l.itemKeyCol = it.refs.filter(function (r) { return r.sys === l.sys; })[0].keyCol;
    if (!l.qty) l.qty = Math.max(1, Math.min(960, Math.round(l.usd / PRICE[l.itemId])));
    l.unitPriceUsd = r2(l.usd / l.qty);
    l.unitPriceLocal = r2(l.amountLocal / l.qty);
  });
  /* purchase orders behind the supplier-late lines */
  var purchaseOrders = suppliers.map(function (s, i) {
    var ls = s.lines.map(function (id) { return LINE[id]; });
    var promised = addBiz("2026-09-21", -s.daysLate);
    s.usd = sum(ls, function (l) { return l.usd; });
    return {
      id: "PO-" + (7100 + i), supplierId: s.id, supplier: s.name, sys: s.sys, object: s.object,
      key: s.poKey, keyLabel: s.sys === "JDE" ? "F4311 · PDDOCO " + s.poKey : "PO_HEADERS_ALL · SEGMENT1 " + s.poKey,
      promisedCol: s.sys === "JDE" ? "F4311.PDPDDJ" : "PO_LINE_LOCATIONS_ALL.PROMISED_DATE",
      promisedDate: promised, orderedOn: addBiz(promised, -20), daysLate: s.daysLate,
      itemIds: ls.map(function (l) { return l.itemId; }).filter(function (v, ix, a) { return a.indexOf(v) === ix; }).slice(0, 3),
      qty: sum(ls, function (l) { return l.qty; }), lineIds: s.lines, usd: s.usd, reason: s.reason,
      receipt: "None · no receipt against the order", status: "Open, past promise"
    };
  });
  var PO_BY_SUP = {}; purchaseOrders.forEach(function (p) { PO_BY_SUP[p.supplierId] = p; });

  /* shipments, scans and exceptions behind the lines late in transit */
  var CARRIERS = ["Northbridge Freight", "Caledon Express", "Merrow Haulage", "Trenton Lines", "Ardent Logistics"];
  var EXC = [["CUSTOMS_HOLD", "Held at the border pending a commercial invoice correction"],
    ["WEATHER_DELAY", "Route closed for eighteen hours by storm damage"],
    ["MECHANICAL", "Vehicle exchanged at the depot after a breakdown"],
    ["MISSED_CONNECTION", "Missed the trunk departure, rebooked to the next service"],
    ["ADDRESS_QUERY", "Delivery address queried at the destination depot"]];
  var shipments = [], scanEvents = [], deliveryExceptions = [], _sh = 0, _sc = 0, _ex = 0;
  orderLines.filter(function (l) { return l.causeId === "transit"; }).forEach(function (l, i) {
    var carrier = CARRIERS[i % CARRIERS.length];
    var sid = "SHP-" + (91000 + (++_sh) * 3);
    var shipped = addBiz(l.promised, -2);
    var hasExc = (i % 3) === 0;
    var ex = EXC[i % EXC.length];
    var s = {
      id: sid, object: "DLV_SHIPMENTS", orderRef: l.orderNo, lineId: l.id, sys: l.sys, entity: l.entity,
      carrier: carrier, origin: PLANT_OF_SYS[l.sys][0], destination: CUST[l.customerId].city,
      shippedOn: shipped, originalEta: l.promised, eta: l.predicted, daysLate: l.daysLate,
      status: hasExc ? "In transit · exception" : "In transit", exceptionCode: hasExc ? ex[0] : null
    };
    shipments.push(s); l.shipmentId = sid;
    var stops = [
      ["Collected", PLANT[PLANT_OF_SYS[l.sys][0]].name, shipped, "08:14"],
      ["Departed origin depot", PLANT[PLANT_OF_SYS[l.sys][0]].name + " depot", addBiz(shipped, 1), "19:42"],
      ["Arrived transit hub", ["Rotterdam hub", "Toronto hub", "Chicago hub"][i % 3], addBiz(shipped, 2), "05:27"],
      ["Held", ["Rotterdam hub", "Toronto hub", "Chicago hub"][i % 3], addBiz(shipped, 3), "11:05"],
      ["Departed transit hub", ["Rotterdam hub", "Toronto hub", "Chicago hub"][i % 3], addBiz(shipped, 4), "16:38"]
    ];
    stops.forEach(function (st, k) {
      if (k === 3 && !hasExc) return;
      scanEvents.push({ id: "SC-" + (20000 + (++_sc)), object: "DLV_SCAN_EVENTS", shipmentId: sid,
        scanTime: st[2] + " " + st[3], location: st[1], status: st[0], lineId: l.id });
    });
    if (hasExc) {
      deliveryExceptions.push({ id: "EX-" + (30000 + (++_ex)), object: "DLV_EXCEPTIONS", shipmentId: sid,
        code: ex[0], reason: ex[1], raisedAt: addBiz(shipped, 3) + " 11:05", lineId: l.id, daysAdded: 2 + (i % 4) });
    }
  });
  var SHIP = {}; shipments.forEach(function (s) { SHIP[s.id] = s; });
  var SCANS_BY_SHIP = {}; scanEvents.forEach(function (s) { (SCANS_BY_SHIP[s.shipmentId] = SCANS_BY_SHIP[s.shipmentId] || []).push(s); });
  var EXC_BY_SHIP = {}; deliveryExceptions.forEach(function (e) { EXC_BY_SHIP[e.shipmentId] = e; });

  /* ---- stock rows: every transfer's source plant, plus the plant that owes
     the line (short), plus decoys so STOCK_POSITION is a position, not a
     list of answers */
  var stock = [], _st = 0;
  function mkStock(plantId, itemId, onHand, note) {
    var p = PLANT[plantId], it = ITEM[itemId];
    stock.push({
      id: "ST-" + (50000 + (++_st)), sys: p.sys, object: p.object, plant: plantId, plantName: p.name,
      org: p.org, entity: p.entity, itemId: itemId, item: it.sku, description: it.description, uom: it.uom,
      itemKey: it.refs.filter(function (r) { return r.sys === p.sys; })[0].key,
      onHand: onHand, asOf: TODAY, note: note || ""
    });
  }
  transfers.forEach(function (t) {
    var need = sum(t.lines.map(function (id) { return LINE[id]; }), function (l) { return l.qty; });
    t.qty = need; t.usd = sum(t.lines.map(function (id) { return LINE[id]; }), function (l) { return l.usd; });
    mkStock(t.from, t.itemId, need + 20 + (_st % 7) * 15, "Covers the shortfall in " + t.to + " in full");
    mkStock(t.to, t.itemId, Math.max(0, Math.floor(need * 0.1)), "Short against the open lines");
  });
  /* decoy positions: other items in every plant, so the join has work to do */
  items.forEach(function (it, i) {
    PLANTS.forEach(function (p, k) {
      if ((i * 3 + k) % 5 !== 0) return;
      if (stock.some(function (s) { return s.plant === p.id && s.itemId === it.id; })) return;
      mkStock(p.id, it.id, 10 + ((i * 7 + k * 13) % 400), "");
    });
  });
  var STOCK_BY_ITEM = {}; stock.forEach(function (s) { (STOCK_BY_ITEM[s.itemId] = STOCK_BY_ITEM[s.itemId] || []).push(s); });

  /* ---- SLA exposure, read from the clause on the line's contract -------- */
  orderLines.forEach(function (l) {
    var k = CONTRACT_BY_CUST[l.customerId];
    if (!k) return;
    l.contractId = k.id;
    l.penaltyUsd = Math.round(Math.min(k.penaltyPerDay * l.daysLate, k.cap) * l.usd);
    l.penaltyPct = Math.min(k.penaltyPerDay * l.daysLate, k.cap);
    l.penaltyCapped = k.penaltyPerDay * l.daysLate >= k.cap;
  });

  /* ---- on time in full, four weeks, for the trend question -------------- */
  var otif = [];
  ["2026-09-14", "2026-09-21", "2026-09-28", "2026-10-05"].forEach(function (wk, w) {
    world.entities.forEach(function (e, i) {
      var due = [420, 386, 268][i] + w * [12, 9, 7][i];
      var pctOtif = [0.948, 0.921, 0.936][i] - w * [0.011, 0.016, 0.008][i];
      otif.push({ entity: e.id, entityName: e.name, system: e.system, week: wk,
        weekLabel: "w/c " + dShort(wk), linesDue: due, otifLines: Math.round(due * pctOtif) });
    });
  });
  otif.forEach(function (o) { o.otifPct = pct1(o.otifLines, o.linesDue); });

  /* ---- the four on-track lines that prove an account trades in more than
     one system: they are open, they are not at risk, and they are what the
     evidence panel shows next to the at-risk lines */
  [["Halden Tooling Group", "FUSION", 64000, "TL-4436", "2026-10-23"],
   ["Halden Tooling Group", "FUSION", 48000, "TL-4436", "2026-10-28"],
   ["Stanhope Instrumentation", "FUSION", 37000, "IN-4468", "2026-10-26"],
   ["Bramley Logistics", "FUSION", 29000, "PK-7726", "2026-10-21"]].forEach(function (d, i) {
    var cust = CUST_BY_NAME[d[0]], it = ITEM[d[3]];
    var l = mkLine(cust, d[1], "transit", d[2], i, { promised: d[4], days: 0, qty: Math.max(1, Math.round(d[2] / PRICE[d[3]])) });
    l.atRisk = false; l.causeId = null; l.status = "On track"; l.sourceStatus = "AWAIT_SHIPPING";
    l.statusCol = "STATUS_CODE AWAIT_SHIPPING"; l.predicted = d[4]; l.daysLate = 0; l.shipmentId = null;
    l.itemId = d[3]; l.item = it.sku; l.itemDescription = it.description; l.uom = it.uom;
    l.itemKey = it.refs.filter(function (r) { return r.sys === "FUSION"; })[0].key;
    l.itemKeyCol = "INVENTORY_ITEM_ID"; l.unitPriceUsd = r2(l.usd / l.qty); l.unitPriceLocal = r2(l.amountLocal / l.qty);
    l.penaltyUsd = 0; l.penaltyPct = 0; l.penaltyCapped = false;
  });
  var atRiskLines = orderLines.filter(function (l) { return l.atRisk; });

  /* ==================================================================== */
  /* THE ANALYSIS — every figure below is derived, none of it is typed in  */
  /* ==================================================================== */
  var WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  function words(n) { return WORDS[n] !== undefined ? WORDS[n] : Number(n).toLocaleString("en-US"); }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function uniq(a) { var o = [], i; for (i = 0; i < a.length; i++) if (a.indexOf(a[i]) === i) o.push(a[i]); return o; }

  function initialState() { return { analysed: false, decisions: [], dashboard: false }; }
  function decisionsOf(x) {
    if (!x) return [];
    if (Object.prototype.toString.call(x) === "[object Array]") return x;
    return x.decisions || [];
  }
  /* an account whose recommendation a person has decided leaves the at-risk
     population: the customer has accepted a date, or the action is owned */
  function resolvedMap(dec) {
    var o = {};
    dec.forEach(function (d) {
      if (d.kind !== "recommendation" || !d.accountId) return;
      if (d.action === "decline") o[d.accountId] = { status: "accepted", label: "Re-promised, accepted", decision: d };
    });
    return o;
  }
  function matchDecisionMap(dec) {
    var o = {}; dec.forEach(function (d) { if (d.kind === "customer" || d.kind === "item") o[d.id] = d; });
    return o;
  }
  function liveLines(dec) {
    var res = resolvedMap(dec);
    return atRiskLines.filter(function (l) { return !res[l.customerId]; });
  }
  function scopeLines(lines, R) {
    if (!R || !R.rowPolicy) return lines;
    return lines.filter(function (l) { return R.entities.indexOf(l.entity) >= 0; });
  }
  function pendingCounts(dec) {
    var md = matchDecisionMap(dec);
    return {
      customers: matches.filter(function (m) { return !md[m.id]; }).length,
      items: itemXrefs.filter(function (x) { return !md[x.id]; }).length
    };
  }
  function caveatFor(dec) {
    var p = pendingCounts(dec);
    if (!p.customers && !p.items) return "Every customer match and item cross-reference here has been confirmed by a person.";
    return p.customers + " customer matches and " + p.items + " item cross-references still wait for a person. Their lines count provisionally.";
  }

  function byCause(lines) {
    return CAUSES.map(function (c) {
      var ls = lines.filter(function (l) { return l.causeId === c.id; });
      return { id: c.id, label: c.label, short: c.short, note: c.note, actionId: c.actionId,
        lines: ls.length, usd: sum(ls, function (l) { return l.usd; }) };
    }).filter(function (c) { return c.lines > 0; });
  }
  function bySystem(lines) {
    return ORDER_SYS.map(function (s) {
      var ls = lines.filter(function (l) { return l.sys === s; });
      return { id: s, name: SRC[s].short, entity: ENTITY_OF[s], lines: ls.length, usd: sum(ls, function (l) { return l.usd; }) };
    });
  }
  function liveTransfers(lines) {
    var ids = uniq(lines.filter(function (l) { return l.causeId === "stock" && l.transferId; }).map(function (l) { return l.transferId; }));
    return ids.map(function (id) { return TRF[id]; });
  }
  function recommendationFor(cust, cause, lines) {
    if (cause === "stock") {
      var t = TRF[lines[0].transferId];
      return { actionId: "A1", text: "Expedite from " + t.from + ", " + fmtQty(sum(lines, function (l) { return l.qty; })) + " " + ITEM[t.itemId].uom + " of " + t.itemId + " on hand there", detail: t.id };
    }
    if (cause === "supplier") {
      var s = SUP[lines[0].supplierId];
      return { actionId: "A4", text: "Escalate " + s.name + ", " + s.poKey + " is " + s.daysLate + " business days past promise", detail: s.id };
    }
    if (cause === "credit") {
      var h = HOLD_BY_CUST[cust.id];
      return { actionId: "A3", text: "Review the credit hold placed on " + dLabel(h.placedOn) + ", " + fmtUsd(h.pastDueUsd) + " past terms", detail: h.id };
    }
    var worst = lines.slice().sort(function (a, b) { return b.daysLate - a.daysLate; })[0];
    return { actionId: "A2", text: "Re-promise to " + dLabel(worst.predicted) + " and alert " + cust.owner, detail: worst.shipmentId };
  }

  function accountRows(dec) {
    var res = resolvedMap(dec), live = liveLines(dec), out = [], byCust = {};
    live.forEach(function (l) { (byCust[l.customerId] = byCust[l.customerId] || []).push(l); });
    Object.keys(byCust).forEach(function (cid) {
      var ls = byCust[cid], c = CUST[cid];
      var causes = byCause(ls).sort(function (a, b) { return b.usd - a.usd; });
      var top = causes[0];
      var topLines = ls.filter(function (l) { return l.causeId === top.id; });
      out.push({
        id: cid, name: c.name, tier: c.tier, owner: c.owner, region: c.region,
        entity: c.entity, entities: uniq(ls.map(function (l) { return l.entity; })),
        systems: c.systems, riskSystems: uniq(ls.map(function (l) { return l.sys; })),
        annualRevenueUsd: c.annualRevenueUsd, creditLimitUsd: c.creditLimitUsd,
        lines: ls.length, usd: sum(ls, function (l) { return l.usd; }),
        penaltyUsd: sum(ls, function (l) { return l.penaltyUsd; }),
        causeId: top.id, causeLabel: top.short, causes: causes,
        recommendation: recommendationFor(c, top.id, topLines),
        status: "at-risk", statusLabel: "At risk", lineIds: ls.map(function (l) { return l.id; })
      });
    });
    out.sort(function (a, b) { return b.usd - a.usd || (a.name < b.name ? -1 : 1); });
    out.forEach(function (a, i) { a.rank = i + 1; });
    /* accounts a person has already decided keep their row, with the decision
       on it, so the table shows what moved rather than hiding it */
    Object.keys(res).forEach(function (cid) {
      var c = CUST[cid], d = res[cid].decision;
      var was = atRiskLines.filter(function (l) { return l.customerId === cid; });
      out.push({
        id: cid, name: c.name, tier: c.tier, owner: c.owner, region: c.region, entity: c.entity,
        entities: uniq(was.map(function (l) { return l.entity; })), systems: c.systems,
        riskSystems: uniq(was.map(function (l) { return l.sys; })),
        annualRevenueUsd: c.annualRevenueUsd, creditLimitUsd: c.creditLimitUsd,
        lines: 0, usd: 0, penaltyUsd: 0, wasLines: was.length, wasUsd: sum(was, function (l) { return l.usd; }),
        wasPenaltyUsd: sum(was, function (l) { return l.penaltyUsd; }),
        causeId: was[0] ? was[0].causeId : null, causeLabel: was[0] ? CAUSE[was[0].causeId].short : "",
        causes: [], recommendation: { actionId: null, text: d.reason || "Decided by a person" },
        status: res[cid].status, statusLabel: res[cid].label, rank: null,
        decision: { by: d.by, at: d.at, reason: d.reason, action: d.action }, lineIds: []
      });
    });
    return out;
  }

  var ACTION_DEFS = [
    { id: "A1", causeId: "stock", owner: "Supply planning", taskNoun: "internal transfer",
      title: function (n) { return "Expedite from the plant that has stock"; },
      why: "The item is on hand in another plant. A transfer beats waiting for supply." },
    { id: "A2", causeId: "transit", owner: "Account owners", taskNoun: "owner alert",
      title: function () { return "Re-promise the lines late in transit and alert the account owners"; },
      why: "These have shipped. The carrier scans put arrival after the promise." },
    { id: "A3", causeId: "credit", owner: "Credit control", taskNoun: "hold review",
      title: function () { return "Review and release credit holds"; },
      why: "Supply is ready. The block is commercial, and a release ships the same day." },
    { id: "A4", causeId: "supplier", owner: "Procurement", taskNoun: "supplier escalation",
      title: function (n) { return "Escalate " + words(n) + " late suppliers"; },
      why: "One purchase order behind each group of lines is past its date." }
  ];
  function actionRows(dec) {
    var live = liveLines(dec);
    return ACTION_DEFS.map(function (a) {
      var ls = live.filter(function (l) { return l.causeId === a.causeId; });
      var accountIds = uniq(ls.map(function (l) { return l.customerId; }));
      var tasks, taskLabel, extra = {};
      if (a.id === "A1") {
        var ts = liveTransfers(ls); tasks = ts.length;
        taskLabel = tasks + " " + a.taskNoun + (tasks === 1 ? "" : "s") + " proposed";
        extra = { transfers: tasks, transferIds: ts.map(function (t) { return t.id; }), qty: sum(ts, function (t) { return t.qty; }) };
      } else if (a.id === "A2") {
        var owners = uniq(accountIds.map(function (id) { return CUST[id].owner; }));
        var excs = ls.filter(function (l) { return l.shipmentId && EXC_BY_SHIP[l.shipmentId]; }).length;
        tasks = owners.length;
        taskLabel = tasks + " " + a.taskNoun + (tasks === 1 ? "" : "s") + " · " + excs + " carrier exception" + (excs === 1 ? "" : "s") + " attached";
        extra = { owners: owners, exceptions: excs };
      } else if (a.id === "A3") {
        var holds = uniq(ls.map(function (l) { return l.holdId; }).filter(Boolean)); tasks = holds.length;
        taskLabel = tasks + " " + a.taskNoun + (tasks === 1 ? "" : "s") + " for credit control";
        extra = { holdIds: holds };
      } else {
        var sups = uniq(ls.map(function (l) { return l.supplierId; }).filter(Boolean)); tasks = sups.length;
        taskLabel = tasks + " " + a.taskNoun + (tasks === 1 ? "" : "s");
        extra = { supplierIds: sups, suppliers: sups.map(function (s) { return SUP[s].name; }) };
      }
      var tierA = accountIds.filter(function (id) { return CUST[id].tier === "A"; });
      var row = {
        id: a.id, title: a.title(tasks), owner: a.owner, why: a.why, causeId: a.causeId,
        lines: ls.length, usd: sum(ls, function (l) { return l.usd; }),
        accountIds: accountIds, accounts: accountIds.length, tierAAccounts: tierA.length,
        penaltyUsd: sum(ls, function (l) { return l.penaltyUsd; }),
        status: "proposed", tasks: tasks, taskLabel: taskLabel,
        assigned: "Assigned as a task. Nothing is written back to an ERP."
      };
      Object.keys(extra).forEach(function (k) { row[k] = extra[k]; });
      return row;
    }).filter(function (a) { return a.lines > 0; });
  }

  /* the band: what each system can see on its own, against what the join
     shows. The "per system" side is a fact about the source books, so it
     moves when the population moves. */
  function bandRows(dec) {
    var live = liveLines(dec), sys = bySystem(live);
    var causes = byCause(live), stockC = causes.filter(function (c) { return c.id === "stock"; })[0];
    var tierA = live.filter(function (l) { return CUST[l.customerId].tier === "A"; });
    var tierAacc = uniq(tierA.map(function (l) { return l.customerId; }));
    var total = live.length, usd = sum(live, function (l) { return l.usd; });
    var split = sys.map(function (s) { return s.lines; }).join(" + ");
    return [
      { id: "lines", label: "Late lines known", perSystem: split, across: "" + total, acrossSub: "in one ranked list",
        perSystemValue: null, acrossValue: total, dir: "join",
        note: "Each book knows its own late lines and nothing else: " + sys.map(function (s) { return s.name + " " + s.lines; }).join(", ") + ". One ranked list needs all three on one grain.",
        noteShort: sys.map(function (s) { return s.name + " " + s.lines; }).join(" · ") },
      { id: "tier", label: "Lines with an account tier", perSystem: "0", across: "" + total,
        perSystemValue: 0, acrossValue: total, dir: "up",
        note: "Tier lives in the CRM, not in any ERP. Without the customer join no order line knows whether it belongs to a best account.",
        noteShort: "tier comes from CRM_ACCOUNT, not from an ERP" },
      { id: "cause", label: "Lines with a cause attributed", perSystem: "0", across: "" + total,
        perSystemValue: 0, acrossValue: total, dir: "up",
        note: "A cause needs stock in every plant, the purchase orders, the credit holds and the carrier scans at once — four places, three of them outside the system that shows the late line.",
        noteShort: "stock, purchase orders, credit holds and carrier scans, joined" },
      { id: "stock", label: "Lines fixable from stock elsewhere", perSystem: "0", across: "" + (stockC ? stockC.lines : 0),
        perSystemValue: 0, acrossValue: stockC ? stockC.lines : 0, dir: "up",
        note: "The symptom sits in one system and the stock in another, under a different item number. Nothing inside a single ERP can see it.",
        noteShort: "matched through GOLD.ITEM_XREF across three item masters" },
      { id: "revenue", label: "Revenue at risk, valued", perSystem: "—", across: fmtMusd(usd),
        perSystemValue: null, acrossValue: usd, dir: "new",
        note: "Three currencies on three books: Fusion in GBP, JD Edwards in CAD, NetSuite in USD. One number needs one rate table and one grain.",
        noteShort: "GBP, CAD and USD translated on one rate table" },
      { id: "tierA", label: "Tier-A exposure", perSystem: "—", across: tierAacc.length + " accounts · " + fmtMusd(sum(tierA, function (l) { return l.usd; })),
        perSystemValue: null, acrossValue: sum(tierA, function (l) { return l.usd; }), acrossCount: tierAacc.length, dir: "new",
        note: "Which of the late lines belong to the accounts the business cannot afford to disappoint — the question the order book cannot answer at all.",
        noteShort: tierAacc.length + " tier-A accounts exposed" }
    ];
  }

  function freshnessFor(ids) {
    var list = (ids || ["FUSION", "JDE", "NETSUITE", "DLV", "CRM"]).map(function (s) { return SRC[s]; });
    var st = list.slice().sort(function (a, b) { return b.freshnessMin - a.freshnessMin; })[0];
    return {
      asOf: st.asOf, stalest: { id: st.id, name: st.short, min: st.freshnessMin, label: st.freshLabel },
      perSource: list.map(function (s) { return { id: s.id, name: s.short, asOf: s.asOf, label: s.freshLabel, feed: s.feedShort }; }),
      text: "as of " + st.asOf + " (stalest: " + st.short + ", " + st.freshLabel + " behind)"
    };
  }

  var ANALYSIS_VIEWS = ["REVENUE_AT_RISK", "OPEN_ORDER_LINES_X", "PROMISE_STATUS", "CUSTOMER_360", "ITEM_XREF",
    "STOCK_POSITION", "LATE_CAUSES", "SUPPLIER_DELAYS", "CREDIT_HOLDS", "TRANSIT_STATUS", "SLA_EXPOSURE",
    "ACCOUNT_EXPOSURE", "RECOMMENDED_ACTIONS"];

  function analysisTrace(dec, R) {
    var live = liveLines(dec), sys = bySystem(live), causes = byCause(live);
    var accIds = uniq(live.map(function (l) { return l.customerId; }));
    var p = pendingCounts(dec);
    var usd = sum(live, function (l) { return l.usd; });
    var kcount = uniq(live.map(function (l) { return l.contractId; }).filter(Boolean)).length;
    return [
      { agent: "Order agent", span: "Read the three order books",
        tools: ["GOLD.OPEN_ORDER_LINES_X", "F4211", "DOO_FULFILL_LINES_ALL", "transactionLine"],
        detail: live.length + " open lines past promise or predicted late · " + sys.map(function (s) { return s.name + " " + s.lines; }).join(", ") + " · statuses harmonised through DOC_MAP",
        ms: 1180, status: "done" },
      { agent: "Identity agent", span: "Resolve customers and items across systems",
        tools: ["GOLD.CUSTOMER_360", "GOLD.ITEM_XREF"],
        detail: live.length + " lines matched to " + accIds.length + " golden accounts and " + uniq(live.map(function (l) { return l.itemId; })).length + " items · " + p.customers + " customer matches and " + p.items + " item cross-references left for a person",
        ms: 960, status: "done" },
      { agent: "Cause agent", span: "Check stock, purchase orders, credit and the carrier scans",
        tools: ["GOLD.STOCK_POSITION", "GOLD.SUPPLIER_DELAYS", "GOLD.CREDIT_HOLDS", "GOLD.TRANSIT_STATUS"],
        detail: causes.map(function (c) { return c.lines + " " + c.short.toLowerCase(); }).join(" · ") + " · every line carries the rule that fired and the row behind it",
        ms: 1740, status: "done" },
      { agent: "Impact agent", span: "Value the exposure, weigh it and propose the actions",
        tools: ["GOLD.REVENUE_AT_RISK", "GOLD.SLA_EXPOSURE", "GOLD.ACCOUNT_EXPOSURE", "GOLD.RECOMMENDED_ACTIONS"],
        detail: fmtMusd(usd) + " valued in three currencies · penalty clauses read from " + kcount + " customer contracts · " + actionRows(dec).length + " actions proposed, none of them a write-back",
        ms: 1420, status: "done" },
      { span: "SQL Firewall check", detail: "allow-list " + R.allowList + " · SELECT only · " + ANALYSIS_VIEWS.length + " objects in scope · allowed", ms: 140, status: "allowed" },
      { span: "Row policy applied", detail: R.rowPolicyText, ms: 80, status: R.rowPolicy ? "applied" : "none" },
      { span: "Column masking applied", detail: R.maskedText, ms: 90, status: R.masked.length ? "applied" : "none" },
      { span: "Answer composed", detail: "headline, six comparison tiles, four causes, " + accountRows(dec).length + " ranked accounts, " + actionRows(dec).length + " recommended actions", ms: 260, status: "done" }
    ];
  }

  function analyse(decisions, role) {
    var dec = decisionsOf(decisions), R = roles[role] || roles.COMMERCIAL_OPS;
    var live = liveLines(dec);
    var accounts = accountRows(dec), actions = actionRows(dec);
    var causes = byCause(live), systems = bySystem(live);
    var usd = sum(live, function (l) { return l.usd; });
    var tierALines = live.filter(function (l) { return CUST[l.customerId].tier === "A"; });
    var tierAusd = sum(tierALines, function (l) { return l.usd; });
    var tierAacc = uniq(tierALines.map(function (l) { return l.customerId; }));
    var penalties = sum(live, function (l) { return l.penaltyUsd; });
    var stockC = causes.filter(function (c) { return c.id === "stock"; })[0];
    var trace = analysisTrace(dec, R);
    causes.forEach(function (c) { c.share = pct1(c.usd, usd); c.lineShare = pct1(c.lines, live.length); });
    var s1 = big(usd) + " is at risk this week, and " + words(tierAacc.length)
      + " tier-A accounts carry " + big(tierAusd) + ".";
    var s2 = stockC
      ? "Stock in another plant covers " + stockC.lines + " of those lines, worth " + big(stockC.usd) + "."
      : "Every remaining line sits with a supplier, credit control or a carrier.";
    return {
      asOf: world.todayLabel + " · " + world.nowLabel, today: TODAY, week: world.week,
      role: R.id, roleName: R.name,
      headline: {
        lines: live.length, revenueUsd: usd, revenueText: fmtMusd(usd),
        tierA: { accounts: tierAacc.length, usd: tierAusd, text: tierAacc.length + " accounts · " + fmtMusd(tierAusd) },
        penaltiesUsd: penalties, penaltiesText: "USD " + fmtK(penalties),
        systems: systems, accounts: accounts.filter(function (a) { return a.status === "at-risk"; }).length
      },
      band: bandRows(dec), causes: causes, accounts: accounts, actions: actions, systems: systems,
      narrative: s1 + " " + s2,
      caveat: caveatFor(dec),
      trace: trace, traceMs: sum(trace, function (t) { return t.ms; }),
      freshness: freshnessFor(), views: ANALYSIS_VIEWS.map(function (v) { return "GOLD." + v; }),
      firewall: {
        allowList: R.allowList, status: "allowed",
        reason: "Every statement matches the allow-list: SELECT only, objects in GOLD, no DDL and no DML. Nothing in this analysis writes to a source system.",
        rowPolicy: R.rowPolicyText, masking: R.maskedText
      },
      decided: accounts.filter(function (a) { return a.status !== "at-risk"; }),
      pending: pendingCounts(dec)
    };
  }

  /* ---- the run card ---------------------------------------------------- */
  function runPlan() {
    return [
      { id: "order", agent: "Order agent", label: "Read the three order books", ms: 1180, steps: [
        { text: "Open F4211 sales detail in JD Edwards · next status below 580", ms: 320 },
        { text: "Open DOO_FULFILL_LINES_ALL in Fusion · status not closed or cancelled", ms: 290 },
        { text: "Open NetSuite transactionLine · sales orders pending fulfilment", ms: 270 },
        { text: "Harmonise three status vocabularies onto one lifecycle", ms: 300 }
      ] },
      { id: "identity", agent: "Identity agent", label: "Resolve customers and items across systems", ms: 960, steps: [
        { text: "Match order customers to the CRM through GOLD.CUSTOMER_360", ms: 340 },
        { text: "Match item numbers across three item masters through GOLD.ITEM_XREF", ms: 330 },
        { text: "Set aside what a person should confirm", ms: 290 }
      ] },
      { id: "cause", agent: "Cause agent", label: "Find out why each line is late", ms: 1740, steps: [
        { text: "Check on hand in every plant, in all three systems", ms: 430 },
        { text: "Check the purchase orders covering each line", ms: 420 },
        { text: "Check credit holds on the customer accounts", ms: 380 },
        { text: "Read the carrier scans in the delivery-tracking database", ms: 510 }
      ] },
      { id: "impact", agent: "Impact agent", label: "Value the exposure and rank it", ms: 1420, steps: [
        { text: "Translate three currencies onto one rate table", ms: 300 },
        { text: "Weigh each line by account tier from the CRM", ms: 330 },
        { text: "Read the late-delivery clause on each customer contract", ms: 420 },
        { text: "Rank the accounts and propose the actions", ms: 370 }
      ] }
    ];
  }
  function dashboardPlan() {
    return [
      { text: "Reading GOLD.REVENUE_AT_RISK and GOLD.ACCOUNT_EXPOSURE", ms: 520 },
      { text: "Choosing the four figures a commercial team acts on", ms: 380 },
      { text: "Building four charts: cause, entity, account tier, top accounts", ms: 640 },
      { text: "Attaching the actions table and the row policy", ms: 460 }
    ];
  }

  /* ---- evidence behind one account -------------------------------------
     An account's line list is everything it has open, at risk or not: the
     on-track lines are what let a customer be seen in two order books at once.
     Two fields survive a decision so that a decided account keeps its own
     figures rather than borrowing the on-track ones — `wasAtRisk` on each line
     (what the AI actually valued) and `atRiskCount` on the object (how many,
     after the role's row policy). `atRisk` is the live flag and goes false for
     every line once the account is re-promised and accepted. */
  function maskedContacts(cid, R) {
    return (CONTACTS_BY_CUST[cid] || []).map(function (c) {
      var em = R.masked.indexOf("CONTACT_EMAIL") >= 0, ph = R.masked.indexOf("CONTACT_PHONE") >= 0;
      return { id: c.id, name: c.name, title: c.title,
        email: em ? maskText(c.email, "email") : c.email,
        phone: ph ? maskText(c.phone, "phone") : c.phone,
        masked: em || ph };
    });
  }
  function evidence(accountId, role, decisions) {
    var R = roles[role] || roles.COMMERCIAL_OPS, dec = decisionsOf(decisions);
    var cid = accountId, c = CUST[cid];
    if (!c) { customers.forEach(function (x) { if (x.name === accountId) { c = x; cid = x.id; } }); }
    if (!c) return null;
    var res = resolvedMap(dec)[cid] || null;
    var rows = accountRows(dec).filter(function (a) { return a.id === cid; });
    var account = rows[0] || null;
    var all = orderLines.filter(function (l) { return l.customerId === cid; });
    var visible = scopeLines(all, R);
    var hidden = all.length - visible.length;
    var lines = visible.map(function (l) {
      return {
        id: l.id, sys: l.sys, sysName: SRC[l.sys].short, entity: l.entity, object: l.object,
        key: l.key, keyCol: l.keyCol, keyLabel: l.keyLabel, orderNo: l.orderNo, lineNo: l.lineNo,
        item: l.item, itemKey: l.itemKey, itemKeyCol: l.itemKeyCol, itemDescription: l.itemDescription,
        qty: l.qty, uom: l.uom, promised: l.promised, promisedLabel: dLabel(l.promised),
        predicted: l.predicted, predictedLabel: dLabel(l.predicted), daysLate: l.daysLate,
        status: res && l.atRisk ? "Re-promised, accepted" : l.status, sourceStatus: l.sourceStatus, statusCol: l.statusCol,
        dateCols: l.dateCols, customerKey: l.customerKey, atRisk: l.atRisk && !res, wasAtRisk: !!l.atRisk,
        usd: l.usd, currency: l.currency, amountLocal: l.amountLocal, unitPriceLocal: l.unitPriceLocal,
        causeId: l.causeId, cause: l.causeId ? CAUSE[l.causeId].short : "On track",
        penaltyUsd: R.masked.indexOf("PENALTY_TERMS") >= 0 ? null : l.penaltyUsd
      };
    });
    var atRisk = visible.filter(function (l) { return l.atRisk; });
    var stockIds = uniq(atRisk.filter(function (l) { return l.transferId; }).map(function (l) { return l.transferId; }));
    var stockElsewhere = stockIds.map(function (tid) {
      var t = TRF[tid], row = STOCK_BY_ITEM[t.itemId].filter(function (s) { return s.plant === t.from; })[0];
      var short = STOCK_BY_ITEM[t.itemId].filter(function (s) { return s.plant === t.to; })[0];
      var need = sum(t.lines.map(function (id) { return LINE[id]; }).filter(function (l) { return l.customerId === cid; }), function (l) { return l.qty; });
      return { transferId: tid, sys: row.sys, sysName: SRC[row.sys].short, plant: row.plant, plantName: row.plantName,
        org: row.org, object: row.object, item: row.item, itemKey: row.itemKey, description: row.description,
        onHand: row.onHand, uom: row.uom, needed: need, shortAt: t.to, shortOnHand: short ? short.onHand : 0,
        note: "On hand in " + row.plant + " under item " + row.itemKey + "; the line is short in " + t.to + " under " + ITEM[t.itemId].refs.filter(function (r) { return r.sys === PLANT[t.to].sys; })[0].key + ". Matched through GOLD.ITEM_XREF.",
        leadDays: t.leadDays };
    });
    var k = CONTRACT_BY_CUST[cid], hideTerms = R.masked.indexOf("PENALTY_TERMS") >= 0;
    var exposed = sum(atRisk, function (l) { return l.penaltyUsd; });
    var contract = k ? {
      number: k.id, object: k.object, keyCol: k.keyCol, partyId: k.partyId, type: k.type,
      startDate: k.startDate, endDate: k.endDate, currency: k.currency,
      leadTimeDays: hideTerms ? null : k.leadTimeDays,
      penaltyPerDay: hideTerms ? null : k.penaltyPerDay,
      cap: hideTerms ? null : k.cap,
      exposedUsd: hideTerms ? null : exposed,
      exposedText: hideTerms ? maskText(null, "terms") : fmtUsd(exposed),
      clauseRef: "OKC_K_ARTICLES_B · section 4.2",
      deliveryText: hideTerms ? maskText(null, "terms") : k.deliveryText,
      penaltyText: hideTerms ? maskText(null, "terms") : k.penaltyText,
      acceptanceText: hideTerms ? maskText(null, "terms") : clauses.filter(function (cl) { return cl.contractId === k.id && cl.section === "3.2"; })[0].text,
      masked: hideTerms,
      read: hideTerms ? "Penalty terms are hidden for this role." :
        "The AI read " + (k.penaltyPerDay * 100).toFixed(2) + " % of line value per business day and a cap at " + (k.cap * 100).toFixed(0) + " % out of the clause text — neither is a column anywhere."
    } : null;
    var sup = atRisk.filter(function (l) { return l.supplierId; })[0];
    var supplierDelay = sup ? (function () {
      var s = SUP[sup.supplierId], po = PO_BY_SUP[s.id];
      return { supplier: s.name, sys: s.sys, sysName: SRC[s.sys].short, object: po.object, key: po.key,
        keyLabel: po.keyLabel, promisedCol: po.promisedCol, promisedDate: po.promisedDate,
        promisedLabel: dLabel(po.promisedDate), daysLate: po.daysLate, reason: po.reason,
        receipt: po.receipt, lines: atRisk.filter(function (l) { return l.supplierId === s.id; }).length };
    })() : null;
    var hold = HOLD_BY_CUST[cid] && atRisk.some(function (l) { return l.causeId === "credit"; }) ? (function () {
      var h = HOLD_BY_CUST[cid], hideLimit = R.masked.indexOf("CREDIT_LIMIT") >= 0;
      return { sys: h.sys, sysName: SRC[h.sys].short, object: h.object, column: h.column, key: h.key,
        placedOn: h.placedOn, placedLabel: dLabel(h.placedOn), reason: h.reason, owner: h.owner,
        creditLimitUsd: hideLimit ? null : h.creditLimitUsd,
        creditLimitText: hideLimit ? maskText(h.creditLimitUsd, "amount") : fmtUsd(h.creditLimitUsd),
        openBalanceUsd: h.openBalanceUsd, pastDueUsd: h.pastDueUsd,
        lines: atRisk.filter(function (l) { return l.causeId === "credit"; }).length, masked: hideLimit };
    })() : null;
    var tr = atRisk.filter(function (l) { return l.shipmentId; })[0];
    var transit = tr ? (function () {
      var s = SHIP[tr.shipmentId];
      return { shipmentId: s.id, object: s.object, carrier: s.carrier, origin: s.origin, destination: s.destination,
        shippedOn: s.shippedOn, originalEta: s.originalEta, originalEtaLabel: dLabel(s.originalEta),
        eta: s.eta, etaLabel: dLabel(s.eta), daysLate: s.daysLate, status: s.status,
        exception: EXC_BY_SHIP[s.id] || null,
        scans: (SCANS_BY_SHIP[s.id] || []).map(function (x) { return { at: x.scanTime, location: x.location, status: x.status }; }),
        lines: atRisk.filter(function (l) { return l.causeId === "transit"; }).length };
    })() : null;
    var crmRow = CRM_BY_CUST[cid], hideLimit = R.masked.indexOf("CREDIT_LIMIT") >= 0;
    return {
      accountId: cid,
      account: account || { id: cid, name: c.name, tier: c.tier, owner: c.owner, region: c.region,
        entity: c.entity, systems: c.systems, lines: 0, usd: 0, penaltyUsd: 0, status: "at-risk", statusLabel: "At risk" },
      decided: res ? res.decision : null,
      lines: lines, linesHidden: hidden, atRiskCount: atRisk.length,
      policyNote: hidden ? hidden + " line" + (hidden === 1 ? "" : "s") + " outside " + R.entities.join(", ") + " are not returned to this role." : "",
      stockElsewhere: stockElsewhere,
      crm: {
        object: "CRM_ACCOUNT", key: crmRow.id, tier: c.tier, owner: c.owner, region: c.region,
        revenue: c.annualRevenueUsd, revenueText: fmtUsd(c.annualRevenueUsd),
        creditLimitUsd: hideLimit ? null : c.creditLimitUsd,
        creditLimitText: hideLimit ? maskText(c.creditLimitUsd, "amount") : fmtUsd(c.creditLimitUsd),
        contacts: maskedContacts(cid, R), freshness: SRC.CRM.freshLabel + " behind"
      },
      contract: contract, supplierDelay: supplierDelay, creditHold: hold, transit: transit,
      identity: {
        score: c.matchScore, reason: c.matchReason, status: c.matchStatus,
        records: c.records.map(function (rid) {
          var r = RECBY[rid];
          return { sys: r.sys, sysName: r.sys === "CRM" ? "CRM" : SRC[r.sys].short, object: r.object,
            keyCol: r.keyCol, key: r.key, name: r.name, city: r.city, country: r.country, taxId: r.taxId };
        })
      },
      views: ["GOLD.REVENUE_AT_RISK", "GOLD.OPEN_ORDER_LINES_X", "GOLD.STOCK_POSITION", "GOLD.CUSTOMER_360",
        "GOLD.SLA_EXPOSURE", "GOLD.LATE_CAUSES"],
      firewall: { allowList: R.allowList, status: "allowed", rowPolicy: R.rowPolicyText, masking: R.maskedText },
      freshness: freshnessFor()
    };
  }

  /* ---- decisions ------------------------------------------------------- */
  var priorDecisions = [
    { id: "D-0001", kind: "customer", target: "M-3112", title: "Norbury Gaskets · Fusion and JD Edwards",
      action: "confirm", reason: "Registration numbers agree; the second address is the plant, not a separate company.",
      by: "Priya Natarajan", role: "STEWARD", at: "Mon 5 Oct 2026 · 16:12", rule: "" },
    { id: "D-0002", kind: "item", target: "X-4102", title: "PLC module, 16 in / 16 out · Fusion and NetSuite",
      action: "confirm", reason: "Manufacturer part number is identical on both records.",
      by: "Priya Natarajan", role: "STEWARD", at: "Mon 5 Oct 2026 · 16:31", rule: "Identical manufacturer part numbers resolve without review." },
    { id: "D-0003", kind: "recommendation", target: "Wexford Industrial Supplies", title: "Expedite from EU-1",
      action: "accept", reason: "Transfer agreed with supply planning on the Monday call.",
      by: "Dana Whitfield", role: "COMMERCIAL_OPS", at: "Mon 5 Oct 2026 · 17:04", rule: "" }
  ];
  var HALDEN = CUST_BY_NAME["Halden Tooling Group"];
  var haldenDecision = {
    kind: "recommendation", accountId: HALDEN.id, account: HALDEN.name, actionId: "A1",
    action: "decline", reason: "Customer accepted delivery on 20 Oct, no expedite",
    by: "Dana Whitfield", role: "COMMERCIAL_OPS", at: "Tue 6 Oct 2026 · 09:52"
  };
  var LEARNED_RULE = {
    id: "R-0007", rule: "Accepted re-promise dates are not at risk",
    detail: "When a person records that the customer accepted a new delivery date, the line leaves the at-risk population and its penalty exposure goes to zero under the acceptance clause. The rule is kept and applied on the next run.",
    scope: "GOLD.REVENUE_AT_RISK · GOLD.SLA_EXPOSURE", kept: true
  };

  function stateFor(name) {
    if (name === "analysed") return { analysed: true, decisions: [], dashboard: false };
    if (name === "decided") return { analysed: true, decisions: [haldenDecision], dashboard: false };
    if (name === "final") return { analysed: true, decisions: [haldenDecision], dashboard: true };
    return initialState();
  }

  function diffBand(a, b) {
    var out = [], byId = {};
    a.forEach(function (t) { byId[t.id] = t; });
    b.forEach(function (t) {
      var was = byId[t.id];
      if (!was || (was.across === t.across && was.perSystem === t.perSystem)) return;
      out.push({ id: t.id, label: t.label, from: was.across, to: t.across,
        fromValue: was.acrossValue, toValue: t.acrossValue,
        fromPerSystem: was.perSystem, toPerSystem: t.perSystem });
    });
    return out;
  }
  function diffActions(a, b) {
    var out = [], byId = {};
    a.forEach(function (x) { byId[x.id] = x; });
    b.forEach(function (x) {
      var was = byId[x.id];
      if (!was || (was.lines === x.lines && was.usd === x.usd && was.tasks === x.tasks)) return;
      out.push({ id: x.id, title: x.title, lines: { from: was.lines, to: x.lines },
        usd: { from: was.usd, to: x.usd }, tasks: { from: was.tasks, to: x.tasks },
        accounts: { from: was.accounts, to: x.accounts } });
    });
    return out;
  }
  function decide(state, d) {
    var prior = decisionsOf(state);
    var st = (state && state.decisions) ? state : { analysed: true, decisions: prior, dashboard: false };
    var before = analyse(prior), nextDec = prior.concat([d]), after = analyse(nextDec);
    var row = {
      id: "D-" + ("000" + (priorDecisions.length + nextDec.length)).slice(-4),
      kind: d.kind || "recommendation", target: d.accountId || d.id, account: d.account || (CUST[d.accountId] ? CUST[d.accountId].name : ""),
      actionId: d.actionId || null, title: d.actionId ? "Recommendation " + d.actionId : "Recommendation",
      action: d.action, reason: d.reason || "", by: d.by || "Dana Whitfield", role: d.role || "COMMERCIAL_OPS",
      at: d.at || (world.todayLabel + " · " + world.nowLabel),
      rule: d.action === "decline" ? LEARNED_RULE.rule : ""
    };
    var accountsChanged = [];
    if (d.accountId) {
      var wasRow = before.accounts.filter(function (a) { return a.id === d.accountId; })[0];
      var nowRow = after.accounts.filter(function (a) { return a.id === d.accountId; })[0];
      if (wasRow && nowRow) accountsChanged.push({
        id: d.accountId, name: wasRow.name, tier: wasRow.tier,
        from: wasRow.statusLabel, to: nowRow.statusLabel,
        lines: { from: wasRow.lines, to: nowRow.lines },
        usd: { from: wasRow.usd, to: nowRow.usd },
        penaltyUsd: { from: wasRow.penaltyUsd, to: nowRow.penaltyUsd }
      });
    }
    return {
      state: { analysed: true, decisions: nextDec, dashboard: !!st.dashboard },
      decision: row,
      changed: {
        band: diffBand(before.band, after.band),
        actions: diffActions(before.actions, after.actions),
        accounts: accountsChanged,
        headline: {
          revenueUsd: { from: before.headline.revenueUsd, to: after.headline.revenueUsd },
          lines: { from: before.headline.lines, to: after.headline.lines },
          tierA: { from: before.headline.tierA.accounts, to: after.headline.tierA.accounts },
          tierAUsd: { from: before.headline.tierA.usd, to: after.headline.tierA.usd },
          penaltiesUsd: { from: before.headline.penaltiesUsd, to: after.headline.penaltiesUsd }
        }
      },
      learned: d.action === "decline" ? LEARNED_RULE : null,
      before: before, after: after
    };
  }
  function decideMatch(state, d) {
    var prior = decisionsOf(state);
    var st = (state && state.decisions) ? state : { analysed: false, decisions: prior, dashboard: false };
    var before = pendingCounts(prior), nextDec = prior.concat([d]), after = pendingCounts(nextDec);
    var m = d.kind === "item"
      ? itemXrefs.filter(function (x) { return x.id === d.id; })[0]
      : matches.filter(function (x) { return x.id === d.id; })[0];
    var row = {
      id: "D-" + ("000" + (priorDecisions.length + nextDec.length)).slice(-4),
      kind: d.kind, target: d.id, title: m ? (m.name || m.description) + " · " + (m.systems ? m.systems.map(function (s) { return SRC[s].short; }).join(" and ") : "") : "",
      action: d.action, reason: d.reason || "", by: d.by || "Priya Natarajan", role: "STEWARD",
      at: d.at || (world.todayLabel + " · " + world.nowLabel),
      rule: d.action === "reject" && m && m.wrong ? "A shared name stem with no shared registration number is not a match." : ""
    };
    return {
      state: { analysed: !!st.analysed, decisions: nextDec, dashboard: !!st.dashboard },
      decision: row,
      changed: { pending: { customers: { from: before.customers, to: after.customers }, items: { from: before.items, to: after.items } } },
      learned: row.rule ? { id: "R-0008", rule: row.rule, detail: "Kept as a rule; proposals of that shape stop being raised.", kept: true } : null
    };
  }

  /* ---- the generated dashboard ----------------------------------------- */
  function dashboard(role, decisions) {
    var R = roles[role] || roles.COMMERCIAL_OPS, dec = decisionsOf(decisions);
    var all = liveLines(dec), live = scopeLines(all, R);
    var hideTerms = R.masked.indexOf("PENALTY_TERMS") >= 0;
    var usd = sum(live, function (l) { return l.usd; });
    var causes = byCause(live), stockC = causes.filter(function (c) { return c.id === "stock"; })[0];
    var tierALines = live.filter(function (l) { return CUST[l.customerId].tier === "A"; });
    var tierAacc = uniq(tierALines.map(function (l) { return l.customerId; }));
    var penalties = sum(live, function (l) { return l.penaltyUsd; });
    var accs = accountRows(dec).filter(function (a) { return a.status === "at-risk"; });
    if (R.rowPolicy) {
      accs = accs.map(function (a) {
        var ls = live.filter(function (l) { return l.customerId === a.id; });
        if (!ls.length) return null;
        var copy = {}; Object.keys(a).forEach(function (k) { copy[k] = a[k]; });
        copy.lines = ls.length; copy.usd = sum(ls, function (l) { return l.usd; });
        copy.penaltyUsd = sum(ls, function (l) { return l.penaltyUsd; });
        return copy;
      }).filter(Boolean).sort(function (x, y) { return y.usd - x.usd; });
      accs.forEach(function (a, i) { a.rank = i + 1; });
    }
    var actions = actionRows(dec).map(function (a) {
      var ls = live.filter(function (l) { return l.causeId === a.causeId; });
      return { id: a.id, title: a.title, owner: a.owner, lines: ls.length,
        usd: sum(ls, function (l) { return l.usd; }), accounts: uniq(ls.map(function (l) { return l.customerId; })).length,
        penaltyUsd: hideTerms ? null : sum(ls, function (l) { return l.penaltyUsd; }),
        penaltyText: hideTerms ? maskText(null, "hidden") : fmtUsd(sum(ls, function (l) { return l.penaltyUsd; })),
        tasks: a.tasks, taskLabel: a.taskLabel, status: a.status };
    }).filter(function (a) { return a.lines > 0; });
    var TIERS = ["A", "B", "C"];
    return {
      title: "Revenue at risk across systems",
      subtitle: "Open lines past promise or predicted late · " + world.week.range,
      generatedAt: world.todayLabel + " · 09:58", role: R.id, roleName: R.name,
      scope: R.rowPolicy ? R.entities.join(", ") + " only" : "All three entities",
      lines: live.length, rowCount: live.length, accounts: accs.length,
      builtFrom: ["GOLD.REVENUE_AT_RISK", "GOLD.ACCOUNT_EXPOSURE", "GOLD.LATE_CAUSES", "GOLD.SLA_EXPOSURE", "GOLD.RECOMMENDED_ACTIONS"],
      tiles: [
        { id: "revenue", label: "Revenue at risk", value: fmtMusd(usd), raw: usd, masked: false,
          sub: live.length + " open lines · " + (R.rowPolicy ? R.entities.join(", ") : "three entities") },
        { id: "tierA", label: "Tier-A exposure", value: fmtMusd(sum(tierALines, function (l) { return l.usd; })),
          raw: sum(tierALines, function (l) { return l.usd; }), masked: false,
          sub: tierAacc.length + " account" + (tierAacc.length === 1 ? "" : "s") + " · tier from the CRM" },
        { id: "stock", label: "Lines fixable from stock elsewhere", value: "" + (stockC ? stockC.lines : 0),
          raw: stockC ? stockC.lines : 0, masked: false,
          sub: stockC ? fmtMusd(stockC.usd) + " · on hand in another plant" : "none in scope" },
        { id: "penalties", label: "SLA penalties exposed", value: hideTerms ? maskText(null, "hidden") : "USD " + fmtK(penalties),
          raw: hideTerms ? null : penalties, masked: hideTerms,
          sub: hideTerms ? "Penalty terms hidden for this role" : "read from the contract clauses" }
      ],
      charts: [
        { id: "by-cause", type: "bar", title: "Revenue at risk by cause", unit: "USD",
          series: causes.map(function (c) { return { label: c.short, value: c.usd, lines: c.lines, share: pct1(c.usd, usd) }; }) },
        { id: "by-entity", type: "bar", title: "Revenue at risk by entity", unit: "USD",
          series: bySystem(live).filter(function (s) { return s.lines > 0; }).map(function (s) {
            return { label: s.entity + " · " + s.name, value: s.usd, lines: s.lines, share: pct1(s.usd, usd) }; }) },
        { id: "by-tier", type: "donut", title: "Revenue at risk by account tier", unit: "USD",
          series: TIERS.map(function (t) {
            var ls = live.filter(function (l) { return CUST[l.customerId].tier === t; });
            return { label: "Tier " + t, value: sum(ls, function (l) { return l.usd; }), lines: ls.length,
              accounts: uniq(ls.map(function (l) { return l.customerId; })).length, share: pct1(sum(ls, function (l) { return l.usd; }), usd) };
          }).filter(function (s) { return s.lines > 0; }) },
        { id: "top-accounts", type: "bar", title: "Top accounts by revenue at risk", unit: "USD",
          series: accs.slice(0, 8).map(function (a) { return { label: a.name, value: a.usd, lines: a.lines, tier: a.tier }; }) }
      ],
      table: {
        title: "Recommended actions",
        note: "Recommendations and tasks. Nothing on this dashboard writes to an ERP.",
        columns: [
          { key: "id", label: "Action" }, { key: "title", label: "What the AI proposes" },
          { key: "owner", label: "Owner" }, { key: "lines", label: "Lines", kind: "num", align: "right" },
          { key: "usd", label: "Value at risk (USD)", kind: "money", align: "right" },
          { key: "penaltyText", label: "Penalty exposure", kind: "mask", align: "right" },
          { key: "taskLabel", label: "Task" }, { key: "status", label: "Status", kind: "badge" }
        ],
        rows: actions
      },
      accountsTable: accs,
      caveat: caveatFor(dec),
      firewall: { allowList: R.allowList, status: "allowed", rowPolicy: R.rowPolicyText, masking: R.maskedText },
      freshness: freshnessFor(),
      shareNote: "Shared with the commercial team. Each viewer sees their own rows."
    };
  }

  /* ==================================================================== */
  /* THE TEN SAVED QUESTIONS                                               */
  /* ==================================================================== */
  function col(k, l, o) {
    o = o || {};
    return { key: k, label: l, kind: o.kind || "text",
      align: o.align || (o.kind === "money" || o.kind === "num" ? "right" : "left"), sub: o.sub || "" };
  }
  function accountsForRole(dec, R) {
    var live = scopeLines(liveLines(dec), R), byCust = {}, out = [];
    live.forEach(function (l) { (byCust[l.customerId] = byCust[l.customerId] || []).push(l); });
    Object.keys(byCust).forEach(function (cid) {
      var ls = byCust[cid], c = CUST[cid], cs = byCause(ls).sort(function (a, b) { return b.usd - a.usd; });
      out.push({ customerId: cid, account: c.name, tier: c.tier, owner: c.owner, region: c.region,
        entity: uniq(ls.map(function (l) { return l.entity; })).join(", "),
        systems: uniq(ls.map(function (l) { return l.sys; })), lines: ls.length,
        usd: sum(ls, function (l) { return l.usd; }), penaltyUsd: sum(ls, function (l) { return l.penaltyUsd; }),
        cause: cs[0].short, _lines: ls });
    });
    out.sort(function (a, b) { return b.usd - a.usd || (a.account < b.account ? -1 : 1); });
    return out;
  }
  function pen(R, v) { return R.masked.indexOf("PENALTY_TERMS") >= 0 ? maskText(null, "hidden") : fmtUsd(v); }

  var questions = [
    { id: "q1", n: 1, text: "Which open orders are at risk this week, and which of our best accounts are exposed?",
      chip: "Open orders at risk this week", primary: true,
      sources: ["FUSION", "JDE", "NETSUITE", "CRM", "DLV"],
      views: ["REVENUE_AT_RISK", "ACCOUNT_EXPOSURE", "LATE_CAUSES"],
      terms: ["at risk", "this week", "best accounts"], joins: 3,
      parse: "Aggregate over accounts · 2 metrics · 1 week filter · ranked",
      t: [240, 380, 1040, 110, 720, 410],
      columns: [col("account", "Account"), col("tier", "Tier", { kind: "badge" }), col("owner", "Owner"),
        col("entity", "Entity"), col("lines", "Lines", { kind: "num" }),
        col("usd", "Revenue at risk (USD)", { kind: "money" }),
        col("penalty", "Penalty exposure", { kind: "mask", align: "right" }), col("cause", "Main cause")],
      build: function (R, dec) {
        return accountsForRole(dec, R).map(function (a) {
          return { account: a.account, tier: a.tier, owner: a.owner, entity: a.entity, lines: a.lines,
            usd: a.usd, penalty: pen(R, a.penaltyUsd), cause: a.cause, _accountId: a.customerId };
        });
      },
      narrate: function (rows, R) {
        var tot = sum(rows, function (r) { return r.usd; }), ln = sum(rows, function (r) { return r.lines; });
        var ta = rows.filter(function (r) { return r.tier === "A"; });
        return big(tot) + " is at risk on " + ln + " open lines across " + rows.length + " accounts"
          + (R.rowPolicy ? " inside " + R.entities.join(", ") : " in all three entities") + ". "
          + cap(words(ta.length)) + " of them are tier A and carry " + big(sum(ta, function (r) { return r.usd; }))
          + "; the top account alone is " + big(rows[0] ? rows[0].usd : 0) + ".";
      },
      sql: ["SELECT a.account_name, a.tier, a.owner_name, a.entity,",
        "       COUNT(*)                        AS lines_at_risk,",
        "       ROUND(SUM(r.value_usd), 2)      AS revenue_at_risk_usd,",
        "       ROUND(SUM(r.penalty_usd), 2)    AS penalty_usd,",
        "       MAX(c.cause_label) KEEP (DENSE_RANK FIRST",
        "            ORDER BY r.value_usd DESC) AS main_cause",
        "FROM   gold.revenue_at_risk  r",
        "JOIN   gold.account_exposure a ON a.customer_id = r.customer_id",
        "JOIN   gold.late_causes      c ON c.line_id     = r.line_id",
        "WHERE  r.at_risk = 'Y'",
        "  AND  r.promised_date <= DATE '2026-10-09'",
        "GROUP  BY a.account_name, a.tier, a.owner_name, a.entity",
        "ORDER  BY 6 DESC;"].join("\n") },

    { id: "q2", n: 2, text: "Which late lines have stock in another plant?",
      chip: "Late lines with stock elsewhere",
      sources: ["FUSION", "JDE", "NETSUITE"], views: ["REVENUE_AT_RISK", "LATE_CAUSES", "STOCK_POSITION", "ITEM_XREF"],
      terms: ["stock elsewhere", "at risk"], joins: 4,
      parse: "Line-level list · 4 joins · 1 week filter · quantity test",
      t: [220, 410, 1180, 120, 860, 380],
      columns: [col("sys", "System", { kind: "badge" }), col("order", "Order"), col("item", "Item"),
        col("qty", "Qty", { kind: "num" }), col("owing", "Owed from"), col("plant", "On hand in"),
        col("onHand", "On hand", { kind: "num" }), col("promised", "Promised"), col("usd", "Value (USD)", { kind: "money" })],
      build: function (R, dec) {
        return scopeLines(liveLines(dec), R).filter(function (l) { return l.causeId === "stock"; })
          .sort(function (a, b) { return b.usd - a.usd; }).map(function (l) {
            var t = TRF[l.transferId], row = STOCK_BY_ITEM[t.itemId].filter(function (s) { return s.plant === t.from; })[0];
            return { sys: SRC[l.sys].short, order: l.orderNo + " / " + l.lineNo, item: l.item, qty: l.qty,
              owing: t.to, plant: t.from, onHand: row.onHand, promised: dShort(l.promised), usd: l.usd,
              _line: l.id, _transfer: t.id };
          });
      },
      narrate: function (rows) {
        var tot = sum(rows, function (r) { return r.usd; });
        var ts = uniq(rows.map(function (r) { return r._transfer; })).length;
        return cap(words(rows.length)) + " late lines worth " + big(tot) + " are short in the plant that owes them and on hand somewhere else. "
          + "They consolidate into " + words(ts) + " internal transfer" + (ts === 1 ? "" : "s") + "; the item numbers differ in every system, so the match runs through GOLD.ITEM_XREF.";
      },
      sql: ["SELECT r.source_system, r.order_number, r.line_number, r.item_number,",
        "       r.quantity, r.owing_plant, s.plant AS stock_plant,",
        "       s.on_hand, r.promised_date, ROUND(r.value_usd, 2) AS value_usd",
        "FROM   gold.revenue_at_risk r",
        "JOIN   gold.late_causes     c ON c.line_id = r.line_id",
        "JOIN   gold.item_xref       x ON x.item_id = r.item_id",
        "JOIN   gold.stock_position  s ON s.item_id = x.item_id",
        "                             AND s.plant  <> r.owing_plant",
        "WHERE  c.cause_id = 'STOCK_ELSEWHERE'",
        "  AND  r.at_risk  = 'Y'",
        "  AND  r.promised_date <= DATE '2026-10-09'",
        "  AND  s.on_hand >= r.quantity",
        "ORDER  BY r.value_usd DESC;"].join("\n") },

    { id: "q3", n: 3, text: "Revenue at risk by account tier",
      chip: "Revenue at risk by account tier",
      sources: ["FUSION", "JDE", "NETSUITE", "CRM"], views: ["REVENUE_AT_RISK", "ACCOUNT_EXPOSURE"],
      terms: ["revenue at risk", "best accounts"], joins: 2,
      parse: "Aggregate over one dimension · 3 metrics · 1 week filter",
      t: [190, 320, 820, 90, 540, 330],
      columns: [col("tier", "Tier", { kind: "badge" }), col("accounts", "Accounts", { kind: "num" }),
        col("lines", "Lines", { kind: "num" }), col("usd", "Revenue at risk (USD)", { kind: "money" }),
        col("share", "Share of total", { kind: "num" }), col("penalty", "Penalty exposure", { kind: "mask", align: "right" })],
      build: function (R, dec) {
        var live = scopeLines(liveLines(dec), R), tot = sum(live, function (l) { return l.usd; });
        return ["A", "B", "C"].map(function (t) {
          var ls = live.filter(function (l) { return CUST[l.customerId].tier === t; });
          return { tier: t, accounts: uniq(ls.map(function (l) { return l.customerId; })).length, lines: ls.length,
            usd: sum(ls, function (l) { return l.usd; }), share: pct1(sum(ls, function (l) { return l.usd; }), tot),
            penalty: pen(R, sum(ls, function (l) { return l.penaltyUsd; })) };
        }).filter(function (r) { return r.lines > 0; });
      },
      narrate: function (rows) {
        var a = rows.filter(function (r) { return r.tier === "A"; })[0];
        var tot = sum(rows, function (r) { return r.usd; });
        return a ? "Tier A carries " + big(a.usd) + " of the " + big(tot) + " at risk — " + a.share
          + " % of the exposure on " + pct1(a.lines, sum(rows, function (r) { return r.lines; }))
          + " % of the lines, across " + words(a.accounts) + " accounts. Tier is a CRM attribute; no order book holds it."
          : "No tier-A account is exposed in this scope.";
      },
      sql: ["SELECT a.tier,",
        "       COUNT(DISTINCT a.customer_id) AS accounts,",
        "       COUNT(*)                      AS lines_at_risk,",
        "       ROUND(SUM(r.value_usd), 2)    AS revenue_at_risk_usd,",
        "       ROUND(100 * RATIO_TO_REPORT(SUM(r.value_usd)) OVER (), 1) AS share_pct,",
        "       ROUND(SUM(r.penalty_usd), 2)  AS penalty_usd",
        "FROM   gold.revenue_at_risk  r",
        "JOIN   gold.account_exposure a ON a.customer_id = r.customer_id",
        "WHERE  r.at_risk = 'Y'",
        "  AND  r.promised_date <= DATE '2026-10-09'",
        "GROUP  BY a.tier",
        "ORDER  BY a.tier;"].join("\n") },

    { id: "q4", n: 4, text: "Late lines caused by late suppliers",
      chip: "Lines behind a late supplier",
      sources: ["FUSION", "JDE"], views: ["REVENUE_AT_RISK", "LATE_CAUSES", "SUPPLIER_DELAYS"],
      terms: ["late supplier", "at risk"], joins: 3,
      parse: "Aggregate over suppliers · 2 metrics · purchase-order join",
      t: [210, 350, 940, 100, 620, 360],
      columns: [col("supplier", "Supplier"), col("sys", "Purchase order in", { kind: "badge" }), col("po", "Purchase order"),
        col("promised", "PO promised"), col("daysLate", "Days late", { kind: "num" }),
        col("lines", "Sales lines held", { kind: "num" }), col("accounts", "Accounts", { kind: "num" }),
        col("usd", "Revenue at risk (USD)", { kind: "money" })],
      build: function (R, dec) {
        var live = scopeLines(liveLines(dec), R).filter(function (l) { return l.causeId === "supplier"; });
        var bySup = {}; live.forEach(function (l) { (bySup[l.supplierId] = bySup[l.supplierId] || []).push(l); });
        return Object.keys(bySup).map(function (sid) {
          var s = SUP[sid], po = PO_BY_SUP[sid], ls = bySup[sid];
          return { supplier: s.name, sys: SRC[s.sys].short, po: po.key, promised: dShort(po.promisedDate),
            daysLate: po.daysLate, lines: ls.length, accounts: uniq(ls.map(function (l) { return l.customerId; })).length,
            usd: sum(ls, function (l) { return l.usd; }), _supplier: sid };
        }).sort(function (a, b) { return b.usd - a.usd; });
      },
      narrate: function (rows) {
        var tot = sum(rows, function (r) { return r.usd; }), ln = sum(rows, function (r) { return r.lines; });
        var worst = rows.slice().sort(function (a, b) { return b.daysLate - a.daysLate; })[0];
        return cap(words(rows.length)) + " suppliers are behind " + ln + " late sales lines worth " + big(tot) + ". "
          + (worst ? worst.supplier + " is the worst at " + worst.daysLate + " business days past promise on " + worst.po
            + ", and the sales lines it holds sit in a different system from the purchase order." : "");
      },
      sql: ["SELECT d.supplier_name, d.source_system, d.po_number,",
        "       d.promised_date, d.days_late,",
        "       COUNT(*)                      AS sales_lines_held,",
        "       COUNT(DISTINCT r.customer_id) AS accounts,",
        "       ROUND(SUM(r.value_usd), 2)    AS revenue_at_risk_usd",
        "FROM   gold.revenue_at_risk  r",
        "JOIN   gold.late_causes      c ON c.line_id     = r.line_id",
        "JOIN   gold.supplier_delays  d ON d.po_id       = c.evidence_id",
        "WHERE  c.cause_id = 'SUPPLIER_LATE'",
        "  AND  r.at_risk  = 'Y'",
        "  AND  r.promised_date <= DATE '2026-10-09'",
        "GROUP  BY d.supplier_name, d.source_system, d.po_number,",
        "          d.promised_date, d.days_late",
        "ORDER  BY 8 DESC;"].join("\n") },

    { id: "q5", n: 5, text: "Tier-A orders on credit hold",
      chip: "Tier-A orders on credit hold",
      sources: ["FUSION", "JDE", "NETSUITE", "CRM"], views: ["REVENUE_AT_RISK", "CREDIT_HOLDS", "ACCOUNT_EXPOSURE"],
      terms: ["credit hold", "best accounts"], joins: 3,
      parse: "Line-level list · tier filter · credit-hold join",
      t: [200, 330, 880, 100, 560, 340],
      columns: [col("account", "Account"), col("sys", "System", { kind: "badge" }), col("order", "Order"),
        col("promised", "Promised"), col("held", "Hold placed"), col("limit", "Credit limit", { kind: "mask", align: "right" }),
        col("usd", "Value (USD)", { kind: "money" })],
      build: function (R, dec) {
        return scopeLines(liveLines(dec), R)
          .filter(function (l) { return l.causeId === "credit" && CUST[l.customerId].tier === "A"; })
          .sort(function (a, b) { return b.usd - a.usd; }).map(function (l) {
            var h = HOLD_BY_CUST[l.customerId];
            return { account: l.customer, sys: SRC[l.sys].short, order: l.orderNo + " / " + l.lineNo,
              promised: dShort(l.promised), held: h ? dShort(h.placedOn) : "—",
              limit: R.masked.indexOf("CREDIT_LIMIT") >= 0 ? maskText(CUST[l.customerId].creditLimitUsd, "amount") : fmtUsd(CUST[l.customerId].creditLimitUsd),
              usd: l.usd, _line: l.id };
          });
      },
      narrate: function (rows) {
        var tot = sum(rows, function (r) { return r.usd; });
        var accs = uniq(rows.map(function (r) { return r.account; }));
        return rows.length
          ? cap(words(rows.length)) + " tier-A lines worth " + big(tot) + " are held by credit control, not by supply, across "
            + words(accs.length) + " account" + (accs.length === 1 ? "" : "s") + ". Supply is ready on every one of them: a release ships the same day."
          : "No tier-A line is on credit hold inside this scope.";
      },
      sql: ["SELECT a.account_name, r.source_system, r.order_number, r.line_number,",
        "       r.promised_date, h.hold_placed_on, h.credit_limit_usd,",
        "       ROUND(r.value_usd, 2) AS value_usd",
        "FROM   gold.revenue_at_risk  r",
        "JOIN   gold.account_exposure a ON a.customer_id = r.customer_id",
        "JOIN   gold.credit_holds     h ON h.customer_id = r.customer_id",
        "JOIN   gold.late_causes      c ON c.line_id     = r.line_id",
        "WHERE  c.cause_id = 'CREDIT_HOLD'",
        "  AND  a.tier     = 'A'",
        "  AND  r.at_risk  = 'Y'",
        "  AND  r.promised_date <= DATE '2026-10-09'",
        "ORDER  BY r.value_usd DESC;"].join("\n") },

    { id: "q6", n: 6, text: "Accounts whose SLA penalties exceed USD 10 k",
      chip: "Accounts over USD 10 k of penalty",
      sources: ["FUSION", "JDE", "NETSUITE"], views: ["ACCOUNT_EXPOSURE", "SLA_EXPOSURE", "REVENUE_AT_RISK"],
      terms: ["SLA penalty", "at risk"], joins: 3,
      parse: "Aggregate over accounts · having clause on a contract-derived metric",
      t: [230, 420, 1020, 110, 640, 370],
      policyNote: "Penalty terms are a masked column for the regional analyst: the predicate runs in the database, the values come back hidden.",
      columns: [col("account", "Account"), col("tier", "Tier", { kind: "badge" }), col("contract", "Contract"),
        col("clause", "Clause"), col("days", "Worst line, days late", { kind: "num" }),
        col("penalty", "Penalty exposure", { kind: "mask", align: "right" }), col("usd", "Revenue at risk (USD)", { kind: "money" })],
      build: function (R, dec) {
        return accountsForRole(dec, R).filter(function (a) { return a.penaltyUsd > 10000; }).map(function (a) {
          var k = CONTRACT_BY_CUST[a.customerId];
          var worst = a._lines.slice().sort(function (x, y) { return y.daysLate - x.daysLate; })[0];
          return { account: a.account, tier: a.tier, contract: k ? k.number || k.id : "—",
            clause: R.masked.indexOf("PENALTY_TERMS") >= 0 ? maskText(null, "terms")
              : (k.penaltyPerDay * 100).toFixed(2) + " % per business day, cap " + (k.cap * 100).toFixed(0) + " %",
            days: worst.daysLate, penalty: pen(R, a.penaltyUsd), usd: a.usd, _accountId: a.customerId,
            _penaltyUsd: a.penaltyUsd };
        }).sort(function (x, y) { return y._penaltyUsd - x._penaltyUsd; });
      },
      narrate: function (rows, R) {
        var tot = sum(rows, function (r) { return r._penaltyUsd; });
        return cap(words(rows.length)) + " accounts are over the USD 10 k line, "
          + (R.masked.indexOf("PENALTY_TERMS") >= 0 ? "and the amounts are masked for this role"
            : "USD " + fmtK(tot) + " between them") + ". "
          + "Every figure is read out of the clause text in the customer contract, not out of a penalty column — there is no penalty column.";
      },
      sql: ["SELECT a.account_name, a.tier, k.contract_number,",
        "       k.penalty_pct_per_day, k.penalty_cap_pct,",
        "       MAX(r.days_late)             AS worst_line_days_late,",
        "       ROUND(SUM(r.penalty_usd), 2) AS penalty_usd,",
        "       ROUND(SUM(r.value_usd), 2)   AS revenue_at_risk_usd",
        "FROM   gold.revenue_at_risk  r",
        "JOIN   gold.account_exposure a ON a.customer_id = r.customer_id",
        "JOIN   gold.sla_exposure     k ON k.customer_id = r.customer_id",
        "WHERE  r.at_risk = 'Y'",
        "  AND  r.promised_date <= DATE '2026-10-09'",
        "GROUP  BY a.account_name, a.tier, k.contract_number,",
        "          k.penalty_pct_per_day, k.penalty_cap_pct",
        "HAVING SUM(r.penalty_usd) > 10000",
        "ORDER  BY 7 DESC;"].join("\n") },

    { id: "q7", n: 7, text: "On-time-in-full by entity, last four weeks",
      chip: "On time in full by entity",
      sources: ["FUSION", "JDE", "NETSUITE"], views: ["PROMISE_STATUS", "OPEN_ORDER_LINES_X"],
      terms: ["on time in full", "promised date"], joins: 2,
      parse: "Aggregate over entity and week · 4-week window · one ratio",
      t: [180, 300, 780, 90, 700, 320],
      columns: [col("entity", "Entity"), col("system", "System", { kind: "badge" }), col("week", "Week"),
        col("linesDue", "Lines due", { kind: "num" }), col("otifLines", "On time in full", { kind: "num" }),
        col("otifPct", "OTIF %", { kind: "num" })],
      build: function (R) {
        return otif.filter(function (o) { return R.entities.indexOf(o.entity) >= 0; })
          .map(function (o) {
            return { entity: o.entity + " · " + o.entityName, system: SRC[o.system].short, week: o.weekLabel,
              linesDue: o.linesDue, otifLines: o.otifLines, otifPct: o.otifPct };
          });
      },
      narrate: function (rows) {
        var last = {}, first = {};
        rows.forEach(function (r) { if (!first[r.entity]) first[r.entity] = r; last[r.entity] = r; });
        var ks = Object.keys(last);
        var worst = ks.map(function (k) { return { k: k, d: r2(last[k].otifPct - first[k].otifPct) }; })
          .sort(function (a, b) { return a.d - b.d; })[0];
        return "On-time-in-full is falling in every entity over the four weeks. "
          + (worst ? worst.k.split(" · ")[1] + " has moved the most, " + first[worst.k].otifPct + " % to " + last[worst.k].otifPct
            + " %, and the lines behind that fall are the ones in this week's list." : "");
      },
      sql: ["SELECT p.entity, p.source_system,",
        "       TRUNC(p.promised_date, 'IW')   AS week_start,",
        "       COUNT(*)                       AS lines_due,",
        "       SUM(CASE WHEN p.otif = 'Y' THEN 1 ELSE 0 END) AS otif_lines,",
        "       ROUND(100 * SUM(CASE WHEN p.otif = 'Y' THEN 1 ELSE 0 END)",
        "             / COUNT(*), 1)           AS otif_pct",
        "FROM   gold.promise_status p",
        "WHERE  p.promised_date >= DATE '2026-09-14'",
        "  AND  p.promised_date <  DATE '2026-10-12'",
        "GROUP  BY p.entity, p.source_system, TRUNC(p.promised_date, 'IW')",
        "ORDER  BY p.entity, week_start;"].join("\n") },

    { id: "q8", n: 8, text: "Customers that exist in more than one system under different names",
      chip: "Customers in more than one system",
      sources: ["CRM", "FUSION", "JDE", "NETSUITE"], views: ["CUSTOMER_360"],
      terms: ["best accounts"], joins: 1,
      parse: "Projection over master data · having clause on the record count",
      t: [200, 290, 740, 90, 480, 300],
      columns: [col("account", "Golden customer"), col("systems", "Systems"), col("names", "Names it trades under"),
        col("score", "Match score", { kind: "num" }), col("reason", "Why they matched"), col("status", "Status", { kind: "badge" })],
      build: function (R, dec) {
        var md = matchDecisionMap(dec);
        var rows = customers.filter(function (c) { return c.systems.length > 1; }).map(function (c) {
          var recs = c.records.map(function (rid) { return RECBY[rid]; }).filter(function (r) { return r.sys !== "CRM"; });
          if (R.rowPolicy && !recs.some(function (r) { return R.entities.indexOf(r.entity) >= 0; })) return null;
          return { account: c.name, systems: c.systems.map(function (s) { return SRC[s].short; }).join(" + "),
            names: uniq(recs.map(function (r) { return r.name; })).join(" · "), score: c.matchScore,
            reason: c.matchReason, status: "confirmed", _customerId: c.id };
        }).filter(Boolean);
        matches.filter(function (m) { return !md[m.id]; }).forEach(function (m) {
          if (R.rowPolicy && !m.records.some(function (r) { return R.entities.indexOf(r.entity) >= 0; })) return;
          rows.push({ account: m.name, systems: m.systems.map(function (s) { return SRC[s].short; }).join(" + "),
            names: m.records.map(function (r) { return r.name; }).join(" · "), score: m.score,
            reason: m.basis === "registration number + name" ? "Registration number and name agree" : "Name and address only",
            status: "review", _matchId: m.id });
        });
        rows.sort(function (a, b) { return b.score - a.score || (a.account < b.account ? -1 : 1); });
        return rows;
      },
      narrate: function (rows) {
        var rev = rows.filter(function (r) { return r.status === "review"; }).length;
        return cap(words(rows.length)) + " customers trade in more than one system, most of them under a different legal name in each. "
          + cap(words(rev)) + " of those are proposals the model applied provisionally and no steward has confirmed; their lines are in this week's numbers, marked as provisional.";
      },
      sql: ["SELECT c.golden_name,",
        "       LISTAGG(c.source_system, ' + ')",
        "         WITHIN GROUP (ORDER BY c.source_system) AS systems,",
        "       LISTAGG(c.source_name, ' · ')",
        "         WITHIN GROUP (ORDER BY c.source_system) AS names,",
        "       MAX(c.match_score)  AS match_score,",
        "       MAX(c.match_reason) AS match_reason,",
        "       MAX(c.match_status) AS status",
        "FROM   gold.customer_360 c",
        "WHERE  c.as_of_date     = DATE '2026-10-06'",
        "  AND  c.source_system <> 'CRM'",
        "GROUP  BY c.golden_id, c.golden_name",
        "HAVING COUNT(DISTINCT c.source_system) > 1",
        "ORDER  BY 4 DESC;"].join("\n") },

    { id: "q9", n: 9, text: "Contacts for the affected accounts",
      chip: "Contacts for the affected accounts",
      sources: ["CRM", "FUSION", "JDE", "NETSUITE"], views: ["ACCOUNT_EXPOSURE", "CUSTOMER_360"],
      terms: ["best accounts", "at risk"], joins: 2,
      parse: "Projection over the CRM contact table · joined to the exposed accounts",
      t: [190, 310, 820, 110, 520, 330],
      policyNote: "CRM contact e-mail and telephone are masked columns for the regional analyst.",
      columns: [col("account", "Account"), col("tier", "Tier", { kind: "badge" }), col("owner", "Our owner"),
        col("contact", "Contact"), col("title", "Title"), col("email", "E-mail", { kind: "mask" }),
        col("phone", "Telephone", { kind: "mask" })],
      build: function (R, dec) {
        var accs = accountsForRole(dec, R).slice(0, 12), out = [];
        accs.forEach(function (a) {
          maskedContacts(a.customerId, R).forEach(function (c) {
            out.push({ account: a.account, tier: a.tier, owner: a.owner, contact: c.name, title: c.title,
              email: c.email, phone: c.phone, _accountId: a.customerId });
          });
        });
        return out;
      },
      narrate: function (rows, R) {
        return cap(words(uniq(rows.map(function (r) { return r.account; })).length))
          + " exposed accounts have " + rows.length + " named contacts in the CRM, and the AI attaches the right one to each owner alert. "
          + (R.masked.indexOf("CONTACT_EMAIL") >= 0
            ? "For this role the e-mail and telephone columns come back masked: the policy is on the column in the database, not on the screen."
            : "E-mail and telephone are returned in full for this role; the regional analyst sees them masked.");
      },
      sql: ["SELECT a.account_name, a.tier, a.owner_name,",
        "       t.contact_name, t.contact_title,",
        "       t.contact_email, t.contact_phone",
        "FROM   gold.account_exposure a",
        "JOIN   gold.customer_360     c ON c.customer_id = a.customer_id",
        "JOIN   crm_iceberg.crm_contact t ON t.account_id = c.crm_account_id",
        "WHERE  a.revenue_at_risk_usd > 0",
        "  AND  a.as_of_week = DATE '2026-10-05'",
        "ORDER  BY a.revenue_at_risk_usd DESC, t.contact_name;"].join("\n") },

    { id: "q10", n: 10, text: "Credit limits for all accounts",
      chip: "Credit limits for all accounts",
      sources: ["FUSION", "JDE", "NETSUITE", "CRM"], views: ["CREDIT_HOLDS", "ACCOUNT_EXPOSURE"],
      terms: ["credit hold"], joins: 2,
      parse: "Projection over master data · 1 sensitive column requested",
      t: [260, 400, 900, 160, 600, 400],
      blockedFor: ["ANALYST_NA"],
      blockReason: "Object GOLD.CREDIT_HOLDS column CREDIT_LIMIT_USD is not on allow-list OPS_QA_V2 for this database user. The statement was refused before execution and the attempt was written to the audit trail.",
      columns: [col("account", "Account"), col("tier", "Tier", { kind: "badge" }), col("sys", "System", { kind: "badge" }),
        col("limit", "Credit limit", { kind: "mask", align: "right" }), col("balance", "Open balance (USD)", { kind: "money" }),
        col("hold", "On hold", { kind: "badge" })],
      narrateBlocked: "SQL Firewall refused the statement against allow-list OPS_QA_V2 before it reached the data, and the attempt is in the audit trail. The policy lives in the database, so the same question is refused however it is phrased — through the agent, through a report, or through SQL.",
      build: function (R, dec) {
        return accountsForRole(dec, R).slice(0, 14).map(function (a) {
          var c = CUST[a.customerId], h = HOLD_BY_CUST[a.customerId];
          return { account: a.account, tier: a.tier, sys: SRC[c.homeSystem].short,
            limit: maskText(c.creditLimitUsd, "amount"), balance: h ? h.openBalanceUsd : Math.round(c.creditLimitUsd * 0.42),
            hold: h ? "Yes" : "No", _accountId: a.customerId };
        });
      },
      narrate: "Even for this role the credit limit comes back as its last two digits: the masking policy on CREDIT_LIMIT_USD applies to every user of the database. For the regional analyst the statement never runs at all — SQL Firewall refuses it against the allow-list and logs the attempt.",
      sql: ["SELECT a.account_name, a.tier, h.source_system,",
        "       h.credit_limit_usd, h.open_balance_usd, h.on_hold",
        "FROM   gold.credit_holds     h",
        "JOIN   gold.account_exposure a ON a.customer_id = h.customer_id",
        "WHERE  h.as_of_week = DATE '2026-10-05'",
        "ORDER  BY h.credit_limit_usd DESC;"].join("\n") }
  ];
  var QBY = {}; questions.forEach(function (q) { QBY[q.id] = q; });

  /* ---- trace, freshness and the answer envelope ------------------------ */
  function traceFor(qid, role, rowCount) {
    var q = QBY[qid], R = roles[role] || roles.COMMERCIAL_OPS, t = q.t, spans = [];
    var blocked = !!(q.blockedFor && q.blockedFor.indexOf(R.id) >= 0);
    function span(n, d, ms, st) { return { n: n, span: n, d: d, detail: d, ms: ms, status: st || "done" }; }
    spans.push(span("Parse the question", q.parse, t[0]));
    spans.push(span("Catalog terms resolved", q.terms.map(function (k) {
      return k + " → " + (GLOSS[k] ? GLOSS[k].definition.split(".")[0] : "");
    }).join(" · "), t[1]));
    spans.push(span("SQL generated", "Select AI over GOLD · " + q.views.length + " certified "
      + (q.views.length === 1 ? "view" : "views") + " · " + q.joins + " joins · " + q.sql.split("\n").length + " lines", t[2]));
    spans.push(span("SQL Firewall check", blocked
      ? "allow-list " + R.allowList + " · refused: " + q.blockReason.split(".")[0]
      : "allow-list " + R.allowList + " · SELECT only · " + q.views.length + " objects in scope · allowed",
      t[3], blocked ? "blocked" : "allowed"));
    if (blocked) {
      spans.push(span("Audit row written", "No rows were read; the attempt is in the session log as blocked", 120));
      spans.push(span("Refusal composed", "The same question is answered for the VP with the masked column only", t[5]));
      return spans;
    }
    if (R.rowPolicy) spans.push(span("Row policy applied", R.rowPolicyText + (q.policyNote ? " · " + q.policyNote : ""), 70, "applied"));
    if (R.masked.length) spans.push(span("Column masking applied", R.maskedText, 90, "applied"));
    spans.push(span("Executed", (rowCount === undefined ? "?" : rowCount) + " rows · " + t[4] + " ms · "
      + q.sources.map(function (s) { return SRC[s].short; }).join(" + "), t[4]));
    spans.push(span("Answer composed", "grid + system badge per row + freshness line", t[5]));
    return spans;
  }
  function sqlFor(qid) { return QBY[qid].sql; }
  function answer(qid, role, decisions) {
    var q = QBY[qid], R = roles[role] || roles.COMMERCIAL_OPS, dec = decisionsOf(decisions);
    var blocked = !!(q.blockedFor && q.blockedFor.indexOf(R.id) >= 0);
    var rows = blocked ? [] : q.build(R, dec);
    var caveats = [];
    if (!blocked) {
      var p = pendingCounts(dec);
      if (q.id === "q1" || q.id === "q8") caveats.push(caveatFor(dec));
      else if (p.customers) caveats.push(p.customers + " customer matches still wait for a person. Their lines count provisionally.");
      if (R.rowPolicy) caveats.push("Rows are limited to " + R.entities.join(", ") + " by the row policy. " + R.maskedText + ".");
      if (!rows.length) caveats.push("No rows inside your scope.");
    }
    var trace = traceFor(qid, R.id, rows.length);
    return {
      id: q.id, n: q.n, text: q.text, chip: q.chip, role: R.id, roleName: R.name,
      blocked: blocked, columns: q.columns, rows: rows, rowCount: rows.length, displayed: rows.length,
      sql: q.sql, sqlLines: q.sql.split("\n").length,
      narrate: blocked ? q.narrateBlocked : (typeof q.narrate === "function" ? q.narrate(rows, R, dec) : q.narrate),
      trace: trace, traceMs: sum(trace, function (s) { return s.ms; }),
      freshness: freshnessFor(q.sources),
      glossaryHits: q.terms.map(function (k) { return GLOSS[k]; }),
      views: q.views.map(function (v) { return "GOLD." + v; }),
      sources: q.sources.map(function (s) { return { id: s, name: SRC[s].short, asOf: SRC[s].asOf }; }),
      firewall: {
        allowList: R.allowList, status: blocked ? "blocked" : "allowed",
        reason: blocked ? q.blockReason : "Statement matches the allow-list: SELECT only, objects in GOLD, no DDL and no DML.",
        rowPolicy: R.rowPolicyText, masking: R.maskedText
      },
      caveat: caveats.join(" "),
      publishAs: "GOLD." + (q.id === "q1" ? "REVENUE_AT_RISK_WEEK" : q.id.toUpperCase() + "_WEEK")
    };
  }

  /* ------------------------------------------------------------ audit log */
  var audit = [
    ["09:39", "Marcus Bell", "ANALYST_NA", "q10", "Credit limits for all accounts", "f4a1c9", 0, "blocked"],
    ["09:36", "Marcus Bell", "ANALYST_NA", "q1", "Which open orders are at risk this week", "8b2e77", 17, "allowed"],
    ["09:31", "Dana Whitfield", "COMMERCIAL_OPS", "q2", "Which late lines have stock in another plant", "2c9014", 44, "allowed"],
    ["09:28", "Dana Whitfield", "COMMERCIAL_OPS", "q1", "Which open orders are at risk this week", "8b2e77", 38, "allowed"],
    ["09:22", "Dana Whitfield", "COMMERCIAL_OPS", "q3", "Revenue at risk by account tier", "5d7a31", 3, "allowed"],
    ["09:14", "Priya Natarajan", "STEWARD", "q8", "Customers that exist in more than one system", "a10f52", 31, "allowed"],
    ["08:57", "Dana Whitfield", "COMMERCIAL_OPS", "q6", "Accounts whose SLA penalties exceed USD 10 k", "77be40", 8, "allowed"],
    ["08:41", "Marcus Bell", "ANALYST_NA", "q9", "Contacts for the affected accounts", "0e63ba", 24, "allowed"],
    ["08:30", "Dana Whitfield", "COMMERCIAL_OPS", "q7", "On-time-in-full by entity, last four weeks", "39c805", 12, "allowed"],
    ["08:12", "Priya Natarajan", "STEWARD", "q4", "Late lines caused by late suppliers", "b4207e", 6, "allowed"],
    ["Yesterday 17:48", "Marcus Bell", "ANALYST_NA", "q5", "Tier-A orders on credit hold", "c81d96", 4, "allowed"],
    ["Yesterday 16:20", "Dana Whitfield", "COMMERCIAL_OPS", "q5", "Tier-A orders on credit hold", "c81d96", 8, "allowed"],
    ["Yesterday 15:03", "Dana Whitfield", "COMMERCIAL_OPS", "q1", "Which open orders are at risk this week", "8b2e77", 38, "allowed"],
    ["Yesterday 11:37", "Marcus Bell", "ANALYST_NA", "q10", "Credit limits for all accounts", "f4a1c9", 0, "blocked"]
  ].map(function (a, i) {
    return { id: "A-" + (500 + i), time: a[0], user: a[1], role: a[2], question: a[3], text: a[4],
      sqlHash: "sha256:" + a[5], rows: a[6], status: a[7] };
  });

  var dashboards = [
    { id: "revenue-at-risk", name: "Revenue at risk across systems", sub: "Generated from this analysis · cause, entity, tier, top accounts", views: ["REVENUE_AT_RISK", "ACCOUNT_EXPOSURE", "LATE_CAUSES", "SLA_EXPOSURE", "RECOMMENDED_ACTIONS"], generated: true },
    { id: "order-book", name: "Order book health", sub: "On-time-in-full, open lines and promise performance by entity", views: ["PROMISE_STATUS", "OPEN_ORDER_LINES_X"], generated: false },
    { id: "account-exposure", name: "Account exposure", sub: "Revenue at risk by account, tier and owner", views: ["ACCOUNT_EXPOSURE", "CUSTOMER_360"], generated: false }
  ];

  return {
    world: world, personas: personas, roles: roles, sources: sources, sourceById: SRC, stalest: stalest,
    views: views, viewById: VIEW, glossary: glossary, plants: PLANTS, causes: CAUSES, entities: world.entities,
    records: records, customers: customers, customerById: CUST, crmAccounts: crmAccounts, crmContacts: crmContacts,
    items: items, itemById: ITEM, orderLines: orderLines, atRiskLines: atRiskLines, lineById: LINE,
    stock: stock, transfers: transfers, suppliers: suppliers, purchaseOrders: purchaseOrders,
    creditHolds: creditHolds, contracts: contracts, clauses: clauses,
    shipments: shipments, scanEvents: scanEvents, deliveryExceptions: deliveryExceptions,
    matches: matches, itemXrefs: itemXrefs, questions: questions, questionById: QBY,
    audit: audit, dashboards: dashboards, decisions: priorDecisions, otif: otif,
    haldenDecision: haldenDecision, learnedRule: LEARNED_RULE,
    initialState: initialState, stateFor: stateFor, runPlan: runPlan, dashboardPlan: dashboardPlan,
    analyse: analyse, evidence: evidence, decide: decide, decideMatch: decideMatch, dashboard: dashboard,
    answer: answer, traceFor: traceFor, freshnessFor: freshnessFor, sqlFor: sqlFor,
    pendingCounts: pendingCounts, liveLines: liveLines, byCause: byCause, bySystem: bySystem,
    fmtUsd: fmtUsd, fmtMoney: fmtMoney, fmtM: fmtM, fmtMusd: fmtMusd, fmtK: fmtK, fmtQty: fmtQty,
    maskText: maskText, pct1: pct1, dLabel: dLabel, dShort: dShort
  };
})();
