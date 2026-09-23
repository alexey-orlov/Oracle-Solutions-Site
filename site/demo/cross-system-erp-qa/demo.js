/* Cross-system ERP Q&A — interactive walkthrough.
   Three product surfaces (Autonomous AI Lakehouse · Data Studio, AI Data
   Platform · Agent Hub, and a Redwood "Decisions" app) under one neutral
   workspace switcher, plus the six-step guided tour.

   The spine is a business decision, not an administration task: Dana asks what
   is at risk this week, four agents read five systems and come back with the
   money, the cause of every late line and four things to do; she checks one
   finding against its source rows, overrules the AI on an account she has
   spoken to, and the whole analysis is re-valued.

   Every number on screen comes from window.ERPQA_DATA: analyse(decisions) for
   the headline, the band, the causes, the accounts and the actions;
   evidence(account, role, decisions) for the drill-down; decide(state, d) for
   the override; dashboard(role, decisions) for the generated dashboard — so a
   decision moves all of them in one pass, as tools/erp-qa-check.js asserts. */
(function () {
  "use strict";
  var D = window.ERPQA_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var params = new URLSearchParams(location.search);

  var ICON = {
    home: '<svg viewBox="0 0 24 24"><path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/></svg>',
    load: '<svg viewBox="0 0 24 24"><path d="M12 16V5M8 9l4-4 4 4"/><path d="M4 19h16"/></svg>',
    wand: '<svg viewBox="0 0 24 24"><path d="M5 19 16 8"/><path d="M15 4v4M13 6h4M18 12v3M16.5 13.5h3"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M4 20V9M10 20V4M16 20v-7M22 20H3"/></svg>',
    bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3Z"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z"/></svg>',
    store: '<svg viewBox="0 0 24 24"><path d="M4 9h16l-1 11H5Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6" r="2.4"/><circle cx="17" cy="18" r="2.4"/><path d="M8.2 10.9 14.8 7.2M8.2 13.1l6.6 3.7"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.4a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V20.5a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3.5a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 5.15 8.7a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.08A1.7 1.7 0 0 0 10.62 2.9V2.8a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03h.1a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.56 1.03Z"/></svg>',
    /* Data Studio nav glyphs, redrawn to the Oct-2025 build */
    dsAnalysis: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="13" height="11" rx="1.5"/><path d="M3 8h13M8 8v7"/><circle cx="16.5" cy="16.5" r="3.6"/><path d="m19.2 19.2 2.3 2.3"/></svg>',
    dsInsights: '<svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 8.6-4.5"/><circle cx="16.5" cy="15.5" r="3.6"/><path d="m19.2 18.2 2.3 2.3"/></svg>',
    dsCatalog: '<svg viewBox="0 0 24 24"><path d="M6 3.5h9a2 2 0 0 1 2 2v15l-6.5-4-6.5 4v-15a2 2 0 0 1 2-2Z"/><path d="m14 9-2.5 2.5L14 14M11.5 11.5H19"/></svg>',
    dsAssist: '<svg viewBox="0 0 24 24"><path d="M3.5 6h9M3.5 11h9M3.5 16h6"/><path d="M17 4v7M20.5 7v4M17 15v5M20.5 16v4"/></svg>',
    cloud: '<svg viewBox="0 0 24 24"><path d="M7 18.5a4 4 0 0 1-.4-7.98A5.5 5.5 0 0 1 17.4 10a3.9 3.9 0 0 1 .35 7.76"/><path d="M12 12v7M9.5 16.5 12 19l2.5-2.5"/></svg>',
    stream: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v6c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6"/><path d="M5 12v5c0 1.55 3.13 2.8 7 2.8"/><path d="m16 17.5 2.5 2.5 3.5-4"/></svg>',
    dblink: '<svg viewBox="0 0 24 24"><ellipse cx="6.5" cy="5.5" rx="3.5" ry="1.8"/><path d="M3 5.5v6c0 1 1.57 1.8 3.5 1.8s3.5-.8 3.5-1.8v-6"/><ellipse cx="17.5" cy="12.5" rx="3.5" ry="1.8"/><path d="M14 12.5v6c0 1 1.57 1.8 3.5 1.8s3.5-.8 3.5-1.8v-6"/><path d="M10.5 9h3.5"/></svg>',
    extbl: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="1.8"/><path d="M3 9.5h18M9 9.5v10M15 9.5v10"/></svg>',
    /* Workbench nav glyphs */
    wspace: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9.5h18M8.5 9.5V19"/></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3.5 6.5a2 2 0 0 1 2-2h3.2l2 2.4h7.8a2 2 0 0 1 2 2v9.6a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"/></svg>',
    flow: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><rect x="9" y="15" width="6" height="5" rx="1"/><path d="M6 9v3h12V9M12 12v3"/></svg>',
    compute: '<svg viewBox="0 0 24 24"><path d="m8 8-3 4 3 4M16 8l3 4-3 4M13.5 6.5l-3 11"/></svg>',
    flask: '<svg viewBox="0 0 24 24"><path d="M10 3.5v6L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.5v-6"/><path d="M8.5 3.5h7M7.5 14.5h9"/></svg>',
    keylock: '<svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H21M18 12v3.5M15 12v2.5"/></svg>',
    dshare: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="6.5" ry="2.6"/><path d="M5.5 6v5.5c0 1.44 2.9 2.6 6.5 2.6"/><path d="M17.5 12.5v7M14.5 16l3-3 3 3"/></svg>',
    bellnav: '<svg viewBox="0 0 24 24"><path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10Z"/><path d="M10.2 18.5a2 2 0 0 0 3.6 0"/></svg>',
    people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 5.6a3.2 3.2 0 0 1 0 5.8M17 14.4a6 6 0 0 1 4 4.6"/></svg>',
    auditlog: '<svg viewBox="0 0 24 24"><rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/><path d="m14.5 16 1.5 1.5 3-3"/></svg>',
    navcol: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 4.5v15"/><path d="m7 10-2 2 2 2"/></svg>',
    board: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M12 4.5v15"/></svg>',
    undo: '<svg viewBox="0 0 24 24"><path d="M4 9h10a5 5 0 0 1 0 10h-3"/><path d="M8 5 4 9l4 4"/></svg>',
    redo: '<svg viewBox="0 0 24 24"><path d="M20 9H10a5 5 0 0 0 0 10h3"/><path d="m16 5 4 4-4 4"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4.5 6.5h15M9 6.5V4.2h6v2.3"/><path d="M6.5 6.5 7.5 20h9l1-13.5"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24"><path d="M6.5 3.5h11v17l-5.5-3.6L6.5 20.5Z"/></svg>',
    sched: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/></svg>',
    msg: '<svg viewBox="0 0 24 24"><path d="M4 5.5h16v11H9.5L5 20v-3.5H4Z"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
    tag: '<svg viewBox="0 0 24 24"><path d="M3.5 11V4.5H10l10 10-6.5 6.5Z"/><circle cx="7.2" cy="8.2" r="1.3"/><path d="M17 3.5v3M20.5 5H17.5"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 4 2.3 4.9 5.2.7-3.8 3.6 1 5.2-4.7-2.6-4.7 2.6 1-5.2L4.5 9.6l5.2-.7Z"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    chevd: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    chevl: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M9 9.5v10"/></svg>',
    view: '<svg viewBox="0 0 24 24"><path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/></svg>',
    refresh: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v5h5"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z"/></svg>',
    stack: '<svg viewBox="0 0 24 24"><path d="m12 3 8 4.5-8 4.5-8-4.5Z"/><path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5"/></svg>',
    bot: '<svg viewBox="0 0 24 24"><rect x="4" y="7.5" width="16" height="12" rx="3"/><path d="M12 3.5v4M9 13h.01M15 13h.01M9.5 16.5h5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="m9 8-5 4 5 4M15 8l5 4-5 4"/></svg>',
    route: '<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M6 8.5v5a3 3 0 0 0 3 3h6.5"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.01"/></svg>',
    speak: '<svg viewBox="0 0 24 24"><path d="M5 9.5h3l4-3.5v12l-4-3.5H5Z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    merge: '<svg viewBox="0 0 24 24"><path d="M6 4v5a4 4 0 0 0 4 4h8M18 4v5a4 4 0 0 1-4 4"/><path d="m15 10 3 3-3 3"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3.5 5 6v6c0 4.2 3 7 7 8.5 4-1.5 7-4.3 7-8.5V6Z"/><path d="m9 12 2 2 4-4"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="9.5" y="3.5" width="5" height="10" rx="2.5"/><path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21"/></svg>',
    clip: '<svg viewBox="0 0 24 24"><path d="M17 8.5 10 15.5a2.5 2.5 0 0 0 3.5 3.5l7-7a5 5 0 0 0-7-7l-7 7a7.5 7.5 0 0 0 10.5 10.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h11"/></svg>',
    ledger: '<svg viewBox="0 0 24 24"><rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
    sliders: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
    expand: '<svg viewBox="0 0 24 24"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',
    shrink: '<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
    funnel: '<svg viewBox="0 0 24 24"><path d="M4 5h16l-6 7v6l-4 2v-8Z"/></svg>',
    anchor: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2"/><path d="M12 7.2V21M5 13a7 7 0 0 0 14 0M8 10H16"/></svg>'
  };

  /* every Workbench grid header carries Oracle's sort chevrons */
  var SORTC = '<span class="srt">&#9650;&#9660;</span>';

  var SYS_ENTITY = { "NG-EU": "FUSION", "NG-NA": "JDE", "NG-SV": "NETSUITE", GROUP: "CRM" };
  var CAT_OF = {}; D.sources.forEach(function (s) { CAT_OF[s.id] = s.catalog; });
  var FIRST_VIEW = (D.views[0] || { id: "REVENUE_AT_RISK" }).id;

  /* ------------------------------------------------------------- state */
  var S = {
    app: "lakehouse",
    dsScreen: "feeds",            /* feeds (Live Feed) | catalog | analysis */
    daGenerated: true,            /* Analysis: SQL is in the editor */
    daRan: true,                  /* Analysis: Run has been pressed */
    dsCatalogs: D.sources.map(function (s) { return s.id; }),
    wbPanel: "home",              /* home | run | analysis | conversation | insights | catalog | apc | lineage | sessions */
    run: { ai: 0, si: 0 },        /* the multi-agent run card's position */
    evAccount: null,              /* the account the evidence panel is open on */
    dashBuilding: false, dashStep: 0, shared: false,
    mcEntity: "REVENUE_AT_RISK",  /* Master catalog: the open entity */
    mcMenu: false,                /* Actions menu */
    apcView: "detail",            /* Auto-populate catalog: list | detail */
    linView: "REVENUE_AT_RISK",   /* Lineage: the artifact the graph is for */
    linOpen: ["out"],             /* expanded (column-level) cards */
    linCol: null,                 /* the highlighted target column */
    linDetail: null,              /* the artifact whose Details overlay is open */
    linTab: "details",
    linHideUp: false,
    linFrom: null,
    rwTab: "recommendations",     /* recommendations | matches | xrefs | decisions */
    openRec: null,                /* the recommendation card that is open */
    role: "COMMERCIAL_OPS",
    qid: null,
    panel: null,                  /* evidence | explain | trace */
    narrate: false,
    state: D.initialState(),
    pending: [],                  /* decisions taken but not yet re-analysed */
    log: [],                      /* applied decision rows, newest first */
    matchLog: {},                 /* steward decisions on the identity queues */
    movedBand: [],                /* tiles that moved on the last re-analysis */
    busy: false
  };

  function money(n, dp) { if (n === null || n === undefined) return "—"; return Number(n).toLocaleString("en-US", { minimumFractionDigits: dp === undefined ? 2 : dp, maximumFractionDigits: dp === undefined ? 2 : dp }); }
  function analysis() { return D.analyse(decisions()); }
  function decisions() { return S.state.decisions; }
  function ans(qid) { return D.answer(qid || S.qid || "q1", S.role, decisions()); }
  function persona() { return D.personas.filter(function (p) { return p.role === S.role; })[0]; }
  function personaByRole(r) { return D.personas.filter(function (p) { return p.role === r; })[0] || D.personas[0]; }

  /* ===================================================================== */
  /* toast                                                                 */
  /* ===================================================================== */
  var toastT;
  /* Nothing stays on screen longer than six seconds, and nothing follows you
     from one application to the next: a toast is about the surface you are on. */
  var TOAST_MAX = 6000;
  function toast(html, ms) {
    var t = $("#toast");
    t.innerHTML = html;
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.hidden = true; }, Math.min(ms || 4200, TOAST_MAX));
  }
  function hideToast() { clearTimeout(toastT); var t = $("#toast"); if (t) t.hidden = true; }
  $("#toast").addEventListener("click", function (e) {
    var b = e.target.closest("[data-toast-go]");
    if (!b) return;
    $("#toast").hidden = true;
    setApp(b.dataset.toastGo);
  });

  /* ===================================================================== */
  /* app switcher                                                          */
  /* ===================================================================== */
  function setApp(app) {
    if (S.app !== app) hideToast();
    S.app = app;
    $$(".app").forEach(function (s) { s.hidden = s.dataset.app !== app; });
    $$(".ws-tab").forEach(function (b) {
      var on = b.dataset.go === app;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    if (app === "lakehouse") renderDs();
    if (app === "aidp") renderWb();
    if (app === "review") renderRw();
    tour.reposition();
  }
  $("#ws-tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]");
    if (!b) return;
    setApp(b.dataset.go);
    tour.after(b.dataset.go === "aidp" ? (tour.stepId() === "to-aidp-2" ? "to-aidp-2" : "to-aidp") : b.dataset.go === "review" ? "to-decisions" : "");
  });

  /* ===================================================================== */
  /* 1. DATA STUDIO                                                        */
  /* ===================================================================== */
  /* Left nav, verbatim from ui-anatomy §1.2 (top level) and §1.11 (the real
     Data Load child list, which is where Live Feed lives). Oracle draws the
     sub-tree COLLAPSED everywhere except inside Data Load, and the nav widens
     only while it is open. */
  var DS_NAV = [
    { id: "overview", label: "Overview", icon: "home" },
    { id: "dataload", label: "Data Load", icon: "load", kids: [
      { id: "dlhome", label: "Home", icon: "home" },
      { id: "dllocal", label: "Load Local File", icon: "load" },
      { id: "dlcloud", label: "Load Cloud Store", icon: "cloud" },
      { id: "dldb", label: "Load Database Tables", icon: "extbl" },
      { id: "lkcloud", label: "Link Cloud Store", icon: "dblink" },
      { id: "lkdb", label: "Link Database Tables", icon: "dblink" },
      { id: "feeds", label: "Live Feed", icon: "stream" },
      { id: "dljobs", label: "Data Load Jobs", icon: "list" },
      { id: "cloudloc", label: "Cloud Locations", icon: "cloud" }
    ] },
    { id: "assist", label: "Table AI Assist", icon: "dsAssist" },
    { id: "analysis", label: "Analysis", icon: "dsAnalysis" },
    { id: "insights", label: "Insights", icon: "dsInsights" },
    { id: "catalog", label: "Catalog", icon: "dsCatalog" },
    { id: "market", label: "Marketplace", icon: "store" },
    { id: "dshare", label: "Data Share", icon: "share", chev: true }
  ];
  function renderDsNav() {
    $("#ds-nav").innerHTML = DS_NAV.map(function (n) {
      var open = !!(n.kids && n.kids.some(function (k) { return k.id === S.dsScreen; }));
      var row = '<button class="ds-item' + (n.id === S.dsScreen ? " is-active" : "") + '" type="button" data-ds="' + n.id + '">' + ICON[n.icon] + "<span>" + esc(n.label) + "</span>" +
        (n.chev ? '<span class="chev">' + ICON.chev + "</span>" : "") +
        (n.kids ? '<span class="chev">' + (open ? ICON.chevd : ICON.chev) + "</span>" : "") + "</button>";
      if (n.kids && open) row += n.kids.map(function (k) {
        return '<button class="ds-item ds-item--kid' + (k.id === S.dsScreen ? " is-active" : "") + '" type="button" data-ds="' + k.id + '">' + ICON[k.icon] + "<span>" + esc(k.label) + "</span></button>";
      }).join("");
      return row;
    }).join("") + '<div class="ds-navfoot"><button class="ds-item" type="button" data-ds="settings">' + ICON.gear + "<span>Settings</span></button>" +
      '<button class="ds-item" type="button" data-ds="collapse"><span>&laquo;</span><span>Collapse</span></button></div>';
    var open = DS_NAV.some(function (n) { return n.kids && n.kids.some(function (k) { return k.id === S.dsScreen; }); });
    $(".ds-body").classList.toggle("ds-body--wide", open);
  }
  $("#ds-nav").addEventListener("click", function (e) {
    var b = e.target.closest("[data-ds]");
    if (!b) return;
    var id = b.dataset.ds;
    if (id === "catalog" || id === "feeds" || id === "analysis") { S.dsScreen = id; renderDs(); return; }
    toast("This walkthrough carries three screens: <b>Catalog</b>, <b>Live Feed</b> and <b>Analysis</b>.");
  });

  var OBJ_DESC = {
    DOO_HEADERS_ALL: "sales-order headers", DOO_FULFILL_LINES_ALL: "order fulfilment lines and their promised dates",
    INV_ONHAND_QUANTITIES_DETAIL: "on-hand quantities by item and plant", EGP_SYSTEM_ITEMS_B: "the item master",
    HZ_PARTIES: "the trading-community party behind each customer", HZ_CUST_ACCOUNTS: "customer accounts",
    PO_HEADERS_ALL: "purchase-order headers", PO_LINE_LOCATIONS_ALL: "purchase-order schedules and promised receipts",
    AR_CUSTOMER_PROFILES: "credit profiles and holds",
    OKC_K_HEADERS_ALL_B: "customer contract headers", OKC_K_LINES_B: "the products and services a contract covers",
    OKC_K_ARTICLES_B: "contract clauses, including delivery lead time and the late-penalty terms",
    F4201: "sales-order headers", F4211: "sales-order detail lines", F41021: "item location and on-hand balances",
    F4101: "the item master", F4104: "item cross-references", F0301: "the customer master", F0101: "the address-book master",
    F4311: "purchase-order detail lines", F03B11: "open accounts-receivable items",
    transaction: "transaction headers, sales orders included", transactionLine: "transaction lines",
    item: "the item record", customer: "customer records", inventoryBalance: "inventory balances by location",
    DLV_SHIPMENTS: "shipments with their carrier and ETA", DLV_SCAN_EVENTS: "carrier scan events with time, location and status",
    DLV_EXCEPTIONS: "delivery exceptions with their code and reason",
    CRM_ACCOUNT: "accounts with their tier, owner, region and annual revenue", CRM_CONTACT: "contacts at those accounts"
  };
  function entities() {
    var out = [];
    D.views.forEach(function (v, i) {
      out.push({
        kind: "View", catalog: "LAKEHOUSE", schema: "GOLD", name: v.id, owner: "GROUP_COMMERCIAL",
        desc: v.definition, rows: 0, fresh: 6, sortKey: i
      });
    });
    D.sources.forEach(function (s) {
      var n = s.objects.length;
      s.objects.forEach(function (o, i) {
        var share = (i === 0 ? 0.42 : i === 1 ? 0.24 : 0.34 / Math.max(1, n - 2));
        out.push({
          kind: "Table", catalog: s.catalog, schema: s.id === "CRM" ? "ICEBERG" : s.id === "DLV" ? "DLV" : s.short.toUpperCase().replace(/[^A-Z]/g, ""), name: o,
          owner: s.entity, desc: "The table " + o + " provides a listing of " + (OBJ_DESC[o] || "records") + " in " + s.name + " for " + entityName(s.entity) + ".",
          rows: Math.max(24, Math.round(s.rowCount * share)), fresh: s.freshnessMin + i, sortKey: 100 + i, src: s.id
        });
      });
    });
    return out;
  }
  function freshLabel(min) {
    if (min <= 0) return "Updated few moments ago";
    if (min < 60) return "Updated " + min + " min ago";
    return "Updated " + Math.floor(min / 60) + " h " + ("0" + (min % 60)).slice(-2) + " min ago";
  }
  function renderDsCatalog() {
    var all = entities().filter(function (e) { return e.kind === "View" || S.dsCatalogs.indexOf(e.src) >= 0; });
    var groups = [["View", all.filter(function (e) { return e.kind === "View"; })], ["Table", all.filter(function (e) { return e.kind === "Table"; })]];
    var chips = D.sources.map(function (s) {
      var on = S.dsCatalogs.indexOf(s.id) >= 0;
      if (!on) return "";
      return '<span class="ds-cat">' + esc(s.catalog) + ' <em>' + esc(s.id === "CRM" ? "Iceberg" : "All Schemas") + '</em><button type="button" data-drop="' + s.id + '" aria-label="Remove ' + esc(s.catalog) + ' from scope">&times;</button></span>';
    }).join("");
    var list = groups.map(function (g) { return dsGroupHtml(g[0], g[1]); }).join("");
    if (!all.length) list = '<div class="ds-empty">No catalog in scope. Add one back to see its entities.</div>';
    $("#ds-crumb").textContent = "Catalog";
    var meta = '<div class="ds-meta"><b>Showing ' + all.length + ' entities</b><span class="ds-sort">Sort By: Updated (Newest to Oldest) ' + ICON.chevd + ICON.refresh + "</span></div>";
    $("#ds-page").innerHTML =
      '<div class="ds-chiprow">' + chips + '<button class="ds-btn" type="button" data-all="1">Select Catalogs ...</button>' +
      '<span class="ds-right"><button class="ds-btn" type="button" data-manage="1">Manage Catalogs</button><span class="ds-ico">' + ICON.gear + '</span><span class="ds-ico">' + ICON.star + "</span></span></div>" +
      '<div class="ds-searchrow"><div class="ds-searchbox"><input type="search" placeholder="Search ..." aria-label="Search the catalog"><span class="ds-mag"></span></div></div>' +
      '<div class="ds-pills">' + ["Tables and Views", "Data Objects", "Files", "Connections", "All"].map(function (p, i) { return '<button class="ds-pill' + (i === 0 ? " is-on" : "") + '" type="button">' + esc(p) + "</button>"; }).join("") + "</div>" +
      '<div class="ds-cols"><aside class="ds-filters"><h3>Filters</h3>' +
      '<div class="ds-facet"><b>' + ICON.chevd + "Entity type</b><div class=\"sub\">Data</div>" +
      '<label><input type="checkbox" checked>' + ICON.view + " View (" + groups[0][1].length + ")</label>" +
      '<label><input type="checkbox" checked>' + ICON.grid + " Table (" + groups[1][1].length + ")</label></div>" +
      '<div class="ds-facet"><b>' + ICON.chevd + "Catalog</b><div class=\"sub\">Mounted</div>" +
      D.sources.map(function (s) {
        var n = all.filter(function (e) { return e.src === s.id; }).length;
        return '<label><input type="checkbox"' + (S.dsCatalogs.indexOf(s.id) >= 0 ? " checked" : "") + ' data-cat="' + s.id + '">' + esc(s.catalog) + " (" + n + ")</label>";
      }).join("") +
      "</div></aside>" +
      '<div class="ds-results">' + meta + '<div class="ds-list">' + list + "</div></div></div>";
  }
  /* The Catalog entity list, reused by the Live Feed page for its view list.
     Oracle type-codes the group header (Table green, Analytic View teal,
     Analysis slate) and gives each row TWO chips — catalog and owner. */
  var GROUP_CLASS = { Table: "", View: " ds-group--view", Analysis: " ds-group--analysis" };
  function ownerLabel(id) { return String(id || "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function dsGroupHtml(kind, rows) {
    if (!rows.length) return "";
    return '<div class="ds-group' + (GROUP_CLASS[kind] || "") + '">' + ICON.chevd + (kind === "View" ? ICON.view : ICON.grid) + esc(kind) + "</div>" + rows.map(function (e) {
      return '<div class="ds-row"><span class="ds-av">' + esc(e.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()) + "</span>" +
        '<div><div class="ds-chips"><span>' + ICON.stack + esc(e.catalog) + '</span><span>' + ICON.user + esc(String(e.owner || "").toUpperCase()) + "</span></div>" +
        '<span class="ds-ent">' + esc(e.name) + "</span>" +
        '<span class="ds-desc">' + esc(e.desc) + "</span>" +
        '<span class="ds-rows">' + (e.rows ? e.rows.toLocaleString("en-US") + " rows" : "Owner: " + esc(ownerLabel(e.owner))) + "</span></div>" +
        '<span class="ds-upd">' + ICON.clock + esc(freshLabel(e.fresh)) + "</span></div>";
    }).join("");
  }

  /* Live Feed — the opening screen. The five sources are the subject here:
     what the company runs on, what each one brings, and how far behind it is.
     The feed job below them is already built and is never run by the tour. */
  function renderDsFeeds() {
    $("#ds-crumb").textContent = "Data Load";
    var views = entities().filter(function (e) { return e.kind === "View"; });
    $("#ds-page").innerHTML =
      '<div class="ds-crumbs"><a>Data Load</a><span>&rsaquo;</span><b>Live Feed</b></div>' +
      '<div class="ds-head"><h1>Live Feed</h1><span>Ongoing feeds of new data into the autonomous database</span></div>' +
      '<section class="srcs"><div class="srcs-head"><h2>Sources feeding the lakehouse</h2>' +
      '<span>Five systems, minutes behind, in one place.</span></div>' +
      '<div class="src-cards" id="src-cards">' + D.sources.map(function (s) {
        return '<div class="src" data-src="' + esc(s.id) + '">' +
          '<span class="src-ico">' + ICON[SRC_ICON[s.id] || "cloud"] + "</span>" +
          '<h3>' + esc(s.short) + "</h3>" +
          '<div class="src-sys">' + esc(s.name) + "</div>" +
          '<div class="src-what">' + esc(srcWhat(s.id)) + "</div>" +
          '<div class="src-feed"><span class="f-long">' + esc(s.feed) + '</span><span class="f-short">' + esc(s.feedShort || s.feed) + "</span> &middot; " +
          esc(s.freshLabel) + " behind &middot; " + s.objects.length + " objects</div></div>";
      }).join("") + "</div></section>" +
      '<section class="job" id="ds-job"><div class="job-head"><span class="job-cv">' + ICON.chevd + '</span><span class="job-ico">' + ICON.grid + "</span>" +
      '<h2>GOLD.CROSS_SYSTEM_COMMERCIAL_MODEL &bull; ' + D.views.length + " views &bull; " + D.sources.length + " sources</h2>" +
      '<span class="job-act"><button class="job-tbtn" type="button" data-jobb="Query">Query</button>' +
      '<button class="job-tbtn" type="button" data-jobb="Jobs">Jobs</button><span class="job-dots">&middot;&middot;&middot;</span></span></div>' +
      '<p class="job-sub">Create Model &bull; <b>five mounted sources</b> &bull; ' + D.views.length + " views rebuilt &bull; owner Group Commercial</p>" +
      '<ol class="stages" id="ds-stages">' + STAGE_LABELS.map(function (st) {
        return '<li class="is-done"><i></i><span>' + esc(st[0]) + "</span><em>" + esc(st[1]) + "</em></li>";
      }).join("") + "</ol>" +
      '<div class="job-btns"><span class="grow">Rebuilt 09:44 &middot; rebuilt continuously as the feeds arrive</span>' +
      '<button class="job-nb" type="button" data-jobb="Report"><span class="ok">' + ICON.check + '</span>Report</button>' +
      '<button class="job-nb" type="button" data-jobb="Reload"><span class="ok">' + ICON.play + "</span>Reload</button></div>" +
      "</section>" +
      '<section class="out"><p class="out-cap"><b>' + D.views.length + ' certified views</b> &middot; schema GOLD &middot; owner Group Commercial &middot; signed-off definitions the answers cite by name</p>' +
      '<div class="ds-list">' + dsGroupHtml("View", views) + "</div></section>" +
      '<p class="ds-aside">Demo data only. Nothing is written back to any source system.</p>';
  }
  var SRC_ICON = { FUSION: "cloud", JDE: "stream", NETSUITE: "cloud", DLV: "dblink", CRM: "extbl" };
  var STAGE_LABELS = [
    ["Bring in the three order books", "1 min ago"],
    ["Resolve customers and items across systems", "1 min ago"],
    ["Join the stock, the purchase orders, the credit holds and the carrier scans", "1 min ago"],
    ["Read the lead-time and penalty clauses out of the contracts", "2 min ago"],
    ["Rebuild the certified views", "09:44"]
  ];
  function entityName(id) {
    var out = id;
    (D.world.entities || []).forEach(function (e) { if (e.id === id) out = e.name; });
    return out === id ? "Group" : out;
  }
  function srcWhat(id) {
    return {
      FUSION: "Europe's orders, stock and contracts with penalty clauses.",
      JDE: "North American orders, stock and item cross-references.",
      NETSUITE: "Sales orders, lines, items and inventory balances.",
      DLV: "Where every shipment is: carrier, ETA, scans and exceptions.",
      CRM: "Who the customer is to us: tier, owner, region and who to call."
    }[id] || "";
  }
  /* ---- Analysis: the natural-language Generate Query field (§1.9).
     Generate Query WRITES SQL INTO THE EDITOR and the user then presses Run —
     a two-step flow, never a chatbot. */
  function daQuestion() { return D.questions.filter(function (q) { return q.id === "q7"; })[0] || D.questions[0]; }
  function daAnswer() { return D.answer(daQuestion().id, "COMMERCIAL_OPS", decisions()); }
  /* ORDS colours the generated statement: keywords blue-violet bold, quoted
     identifiers and literals red-orange, everything else near-black. */
  var SQL_KW = /\b(SELECT|FROM|WHERE|AND|OR|NOT|IN|IS|NULL|GROUP|ORDER|BY|AS|ON|JOIN|LEFT|RIGHT|INNER|OUTER|CASE|WHEN|THEN|ELSE|END|DATE|ROUND|SUM|COUNT|AVG|MIN|MAX|TRUNC|COALESCE|NVL|DESC|ASC|HAVING|WITH|UNION|ALL|DISTINCT|OVER|PARTITION|FETCH|FIRST|ROWS|ONLY|BETWEEN|LIKE|EXISTS|CAST|TO_CHAR|TO_DATE)\b/g;
  function sqlHtml(line) {
    var out = "", i = 0, re = /'[^']*'|"[^"]*"/g, m;
    function kw(t) { return esc(t).replace(SQL_KW, function (w) { return '<span class="kw">' + w + "</span>"; }); }
    while ((m = re.exec(line))) { out += kw(line.slice(i, m.index)) + '<span class="st">' + esc(m[0]) + "</span>"; i = m.index + m[0].length; }
    return out + kw(line.slice(i));
  }
  function renderDsAnalysis() {
    $("#ds-crumb").textContent = "Analysis";
    var DA_Q = daQuestion(), a = daAnswer();
    var sqlLines = (S.daGenerated ? a.sql : "").split("\n");
    var rows = a.rows.slice(0, 6), cols = a.columns.slice(0, 4);
    $("#ds-page").innerHTML =
      '<div class="da-top"><button class="da-back" type="button">&larr;</button><b>OTIF_by_entity</b>' +
      '<span class="da-right"><button class="da-save" type="button">' + ICON.ledger + 'Save ' + ICON.chevd + '</button><span class="da-find">' + ICON.search + "</span></span></div>" +
      '<div class="da-cols">' +
      '<aside class="da-tree"><div class="da-sel">GOLD ' + ICON.chevd + '</div><div class="da-sel da-sel--2">Query ' + ICON.chevd + '<span class="da-ref">' + ICON.refresh + "</span></div>" +
      D.views.slice(0, 8).map(function (v) {
        return '<div class="da-tbl">' + ICON.grid + esc(v.id) + "</div>";
      }).join("") + '<span class="da-grab">&#8826;</span></aside>' +
      '<div class="da-main"><div class="da-card"><span class="da-rep">' + ICON.ledger + 'My Report_Report-0</span>' +
      '<span class="da-tog">Use Natural Query<i class="da-switch is-on"></i><span class="da-ex">&#10530;</span><span class="da-kebab">&#8942;</span></span></div>' +
      '<div class="da-nl"><textarea readonly aria-label="Natural language query">' + esc(DA_Q.text.replace(/\.$/, "").toLowerCase()) + '</textarea><span class="da-step">&#9650;<br>&#9660;</span></div>' +
      '<div class="da-acts"><button class="da-btn" type="button">Select Tables</button>' +
      '<button class="da-btn" type="button" id="da-gen"><i class="pl pl--dark"></i>Generate Query</button></div>' +
      '<div class="da-acts da-acts--run"><button class="da-btn" type="button" id="da-run"><i class="pl pl--green"></i>Run</button></div>' +
      '<div class="da-edwrap"><div class="da-editor">' + (S.daGenerated
        ? '<div class="rule"></div>' + sqlLines.map(function (l, i) { return '<div class="ln"><i>' + (i + 1) + "</i><code>" + sqlHtml(l) + "</code></div>"; }).join("")
        : '<div class="da-empty">The editor is empty. <b>Generate Query</b> writes the SQL here.</div>') + "</div>" +
      '<div class="da-split">&#9662;</div></div>' +
      '<div class="da-tabs"><button type="button" class="is-on">Query Result</button><button type="button">Explain Plan</button><button type="button">Autotrace</button>' +
      '<span class="da-right">' + ICON.info + "</span></div>" +
      '<div class="da-moderow"><span class="da-modes"><i class="is-on"></i><i></i><i></i><i></i></span></div>' +
      '<div class="da-result">' + (S.daRan
        ? '<table class="da-grid"><thead><tr>' + cols.map(function (c) { return '<th class="' + (c.align === "right" ? "r" : "") + '">' + esc(String(c.label).toUpperCase().replace(/ /g, "_")) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          rows.map(function (r) {
            return "<tr>" + cols.map(function (c) {
              var v = r[c.key];
              if (c.kind === "badges") v = (v || []).map(function (x) { return D.sourceById[x] ? D.sourceById[x].short : x; }).join(" · ");
              if (c.kind === "money") v = money(v, 0);
              return '<td class="' + (c.align === "right" ? "r" : "") + '">' + esc(v === undefined || v === null ? "—" : v) + "</td>";
            }).join("") + "</tr>";
          }).join("") + "</tbody></table>"
        : '<div class="da-empty">No data to display. Press <b>Run</b> to execute the statement in the editor.</div>') + "</div></div>" +
      '<aside class="da-facet"><div class="da-fh"><span class="rr">&raquo;</span><span>Faceted</span><i class="da-switch is-on"></i><span>Visual</span></div>' +
      cols.slice(0, 3).map(function (c, ci) {
        return '<div class="da-fc"><b><i class="tri"></i>' + esc(String(c.label).toUpperCase().replace(/ /g, "_")) + "</b>" + '<span class="da-hist">' +
          HIST[ci % HIST.length].map(function (h) { return '<i style="height:' + h + 'px"></i>'; }).join("") +
          '</span><a>Show More...</a></div>';
      }).join("") + "</aside></div>" +
      '<div class="da-status"><span>&#8855; 0</span><span>&#9888; 0</span><span>&#9881; 0</span><i>|</i><span class="lk">' + esc(D.world.nowLabel) +
      ':07 AM - REST call resolved successfully.</span><span class="da-right">' + ICON.stack + '<span class="lk">Powered by ORDS</span></span></div>';
  }
  /* 24 packed bars, not a monotonic staircase — Oracle's facet histograms are
     read off the data, so they are uneven */
  var HIST = [
    [41, 33, 45, 28, 37, 22, 30, 19, 26, 34, 17, 23, 15, 21, 12, 18, 25, 11, 14, 9, 16, 8, 10, 6],
    [28, 45, 19, 36, 24, 41, 15, 31, 22, 12, 27, 18, 33, 10, 21, 14, 25, 9, 17, 11, 20, 7, 13, 8],
    [45, 21, 38, 14, 29, 35, 11, 26, 18, 40, 9, 23, 16, 31, 12, 20, 8, 27, 13, 10, 19, 15, 7, 11]
  ];
  function renderDs() {
    renderDsNav();
    if (S.dsScreen === "feeds") renderDsFeeds();
    else if (S.dsScreen === "analysis") renderDsAnalysis();
    else renderDsCatalog();
  }
  $("#ds-page").addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("#da-gen"))) { S.daGenerated = true; S.daRan = false; renderDs(); toast("<span><b>Generate Query</b> wrote the statement into the editor. Nothing has run yet.</span>", 6000); return; }
    if ((t = e.target.closest("#da-run"))) { if (!S.daGenerated) { toast("The editor is empty. Press <b>Generate Query</b> first."); return; } S.daRan = true; renderDs(); return; }
    if ((t = e.target.closest("[data-drop]"))) { S.dsCatalogs = S.dsCatalogs.filter(function (x) { return x !== t.dataset.drop; }); renderDs(); return; }
    if ((t = e.target.closest("[data-cat]"))) {
      var id = t.dataset.cat, i = S.dsCatalogs.indexOf(id);
      if (i >= 0) S.dsCatalogs.splice(i, 1); else S.dsCatalogs.push(id);
      renderDs(); return;
    }
    if ((t = e.target.closest("[data-all]"))) { S.dsCatalogs = D.sources.map(function (s) { return s.id; }); renderDs(); toast("All five sources are back in scope."); return; }
    if ((t = e.target.closest("[data-src]"))) {
      var s = D.sourceById[t.dataset.src];
      if (s) toast("<span><b>" + esc(s.name) + "</b> &middot; " + esc(s.feed) + " &middot; " + esc(s.freshLabel) + " behind &middot; " + s.objects.length + " objects in scope: <span class=\"mono\">" + esc(s.objects.join(", ")) + "</span></span>", 9000);
      return;
    }
    if ((t = e.target.closest("[data-jobb]"))) { toast("<span><b>" + esc(t.dataset.jobb) + "</b> is read-only here. The model rebuilds as the feeds arrive.</span>"); return; }
    if ((t = e.target.closest("[data-manage]"))) { toast("<span>Mounted catalogs: <b>" + D.sources.map(function (s) { return s.catalog; }).join(" &middot; ") + "</b>. Read-only here.</span>"); }
  });

  /* ===================================================================== */
  /* 2. AI DATA PLATFORM — Agent Hub                                       */
  /* ===================================================================== */
  /* Oracle's Jun-2026 roster, in Oracle's order. Items the walkthrough has no
     content for are present and inert — Oracle's own frames never open most of
     them either. `Insights` is NOT here: it is a tab on the Agent Hub's dark
     bottom nav, which is where this build puts it. */
  var WB_NAV = [
    { id: "create", label: "Create", icon: "plus" },
    { id: "home", label: "Home", icon: "home" },
    { id: "catalog", label: "Master catalog", icon: "ledger" },
    { id: "wspaces", label: "Workspaces", icon: "wspace", inert: true },
    { id: "default", label: "default", icon: "folder", chevd: true, inert: true },
    { id: "workflow", label: "Workflow", icon: "flow", inert: true, kid: true },
    { id: "compute", label: "Compute", icon: "compute", inert: true, kid: true },
    { id: "experiments", label: "Experiments", icon: "flask", inert: true, kid: true },
    { gap: true },
    { id: "creds", label: "Credential store", icon: "keylock", inert: true },
    { id: "sharing", label: "Data sharing", icon: "dshare", inert: true },
    { id: "apc", label: "Auto-populate catalog", icon: "tag" },
    { id: "notifications", label: "Notifications", icon: "bellnav", inert: true, count: 4 },
    { id: "roles", label: "Roles", icon: "people", inert: true },
    { id: "audit", label: "Audit logs", icon: "auditlog" },
    { id: "settings", label: "Settings", icon: "gear", inert: true }
  ];
  /* the three most recent things this account touched, as rows with icons */
  var WB_RECENT = [
    { icon: "bot", label: "Commercial operations agent" },
    { icon: "chart", label: "Revenue at risk · week 41" },
    { icon: "grid", label: "lakehouse_gold.revenue_at_risk" }
  ];
  function renderWbNav() {
    $("#wb-nav").innerHTML = WB_NAV.map(function (n) {
      if (n.gap) return '<div class="wb-gap"></div>';
      var on = n.id === S.wbPanel ||
        (n.id === "home" && (S.wbPanel === "analysis" || S.wbPanel === "run" || S.wbPanel === "conversation" || S.wbPanel === "insights")) ||
        (n.id === "catalog" && S.wbPanel === "lineage");
      return '<button class="wb-item' + (on ? " is-active" : "") + (n.kid ? " wb-item--kid" : "") + '" type="button" data-wb="' + n.id + '">' + ICON[n.icon] + "<span>" + esc(n.label) + "</span>" +
        (n.count ? '<span class="cnt">' + n.count + "</span>" : "") +
        (n.chevd ? '<span class="chev">' + ICON.chevd + "</span>" : "") + "</button>";
    }).join("") +
      '<div class="wb-cap">Activity' + ICON.chevd + "</div>" +
      WB_RECENT.map(function (r, i) {
        return '<button class="wb-item' + (i === 0 && S.wbPanel === "analysis" ? " is-active" : "") + '" type="button" data-wb="recent">' + ICON[r.icon] + "<span>" + esc(r.label) + "</span></button>";
      }).join("") +
      '<button class="wb-collapse" type="button" data-wb="navcollapse">' + ICON.navcol + "<span>Collapse</span></button>";
  }
  var WB_INERT = {};
  WB_NAV.forEach(function (n) { if (n.inert) WB_INERT[n.id] = n.label; });
  $("#wb-nav").addEventListener("click", function (e) {
    var b = e.target.closest("[data-wb]");
    if (!b) return;
    var id = b.dataset.wb;
    if (id === "create") { toast("<span><b>Create</b>: agent flow &middot; job &middot; notebook &middot; SQL &middot; catalog &middot; schema. Read-only here.</span>"); return; }
    if (id === "recent") { S.wbPanel = S.state.analysed ? "analysis" : "home"; S.panel = null; renderWb(); return; }
    if (id === "navcollapse") { toast("Collapsing the navigation is read-only here."); return; }
    if (WB_INERT[id]) { toast("<span><b>" + esc(WB_INERT[id]) + "</b> is part of the Workbench, outside this walkthrough.</span>"); return; }
    S.wbPanel = id; S.panel = null; renderWb();
  });

  /* ---- user menu (View as) ---- */
  function renderWbMenu() {
    var cur = persona();
    $("#wb-user").textContent = cur.initials;
    $("#wb-menu").innerHTML = '<div class="mh">Signed in</div>' +
      '<div class="me is-on"><span class="ini">DW</span><span><b>' + esc(personaByRole("COMMERCIAL_OPS").name) + "</b><span>" + esc(personaByRole("COMMERCIAL_OPS").title) + " &middot; " + esc(personaByRole("COMMERCIAL_OPS").scope) + "</span></span></div><hr>" +
      '<div class="mh">View as</div>' +
      D.personas.filter(function (p) { return p.role !== "STEWARD"; }).map(function (p) {
        return '<button class="me' + (p.role === S.role ? " is-on" : "") + '" type="button" role="menuitem" data-role="' + p.role + '"><span class="ini' + (p.role === "ANALYST_NA" ? " ini--a" : "") + '">' + esc(p.initials) + "</span>" +
          "<span><b>" + esc(p.name) + "</b><span>" + esc(p.title) + " &middot; " + esc(p.scope) + "</span></span></button>";
      }).join("") +
      '<div class="mnote">Viewing as someone else re-runs everything under their rules, in the database.</div>';
  }
  function openMenu(open) {
    $("#wb-menu").hidden = !open;
    $("#wb-user").setAttribute("aria-expanded", String(!!open));
  }
  $("#wb-user").addEventListener("click", function () { openMenu($("#wb-menu").hidden); });
  $("#wb-menu").addEventListener("click", function (e) {
    var b = e.target.closest("[data-role]");
    if (!b) return;
    openMenu(false);
    setRole(b.dataset.role);
  });
  document.addEventListener("click", function (e) {
    if ($("#wb-menu").hidden) return;
    if (e.target.closest("#wb-menu, #wb-user")) return;
    openMenu(false);
  });
  function setRole(role) {
    S.role = role;
    var p = persona();
    renderWb();
    if (role === "ANALYST_NA") {
      toast("<span>Viewing as <b>" + esc(p.name) + "</b>. North America only, contacts and credit limits masked in the database.</span>", 8000);
    } else {
      toast("<span>Back as <b>" + esc(p.name) + "</b> &middot; " + esc(p.title) + ".</span>");
    }
    tour.after("viewas");
  }

  /* ---- shared: system badges, money, the six-tile band ------------------ */
  function sysBadge(id) { return '<span class="sysb sysb--' + esc(id) + '">' + esc(D.sourceById[id] ? D.sourceById[id].short : id) + "</span>"; }
  function usdShort(n) {
    if (n === null || n === undefined) return "—";
    if (n >= 1e6) return "USD " + D.fmtM(n);
    if (n >= 1000) return "USD " + Math.round(n / 1000) + " k";
    return "USD " + Math.round(n);
  }
  /* the analysis with no decisions applied — what the AI found before anyone
     overruled it, so a declined row can still show what it was worth */
  var BASE_AN = null;
  function baseAnalysis() { if (!BASE_AN) BASE_AN = D.analyse([]); return BASE_AN; }
  function baseAccount(id) {
    var out = null;
    baseAnalysis().accounts.forEach(function (a) { if (a.id === id) out = a; });
    return out || {};
  }
  function bandTile(t, moved) {
    var across = String(t.across === null || t.across === undefined ? "—" : t.across);
    var per = t.perSystem === null || t.perSystem === undefined ? "—" : String(t.perSystem);
    var small = across.length > 12;
    return '<div class="tile ' + esc(t.dir || "up") + (moved ? " is-moved" : "") + '" data-tile="' + esc(t.id) + '" title="' + esc(t.note || "") + '">' +
      '<span class="lab">' + esc(t.label) + "</span>" +
      '<span class="val"><span class="before">' + esc(per) + '</span><span class="arw">&rarr;</span>' +
      '<span class="after' + (small ? " after--sm" : "") + '">' + esc(across) + "</span>" +
      (t.acrossSub ? '<span class="asub">' + esc(t.acrossSub) + "</span>" : "") + "</span>" +
      '<span class="note">' + esc(t.noteShort || t.note || "") + "</span></div>";
  }
  function bandHtml(an, id, moved) {
    return '<div class="band-head"><span class="eyebrow">Per system &rarr; across systems</span>' +
      '<span class="muted">' + esc(D.world.week.label) + " &middot; " + esc(D.world.week.range) + " &middot; every figure computed from the lines the AI read</span></div>" +
      '<div class="band-tiles" id="' + id + '">' + an.band.map(function (t) { return bandTile(t, (moved || []).indexOf(t.id) >= 0); }).join("") + "</div>";
  }

  /* ---- Agent Hub home -------------------------------------------------- */
  /* the people the work is handed to, taken from the accounts themselves */
  function topOwners(n) {
    var seen = {}, out = [];
    (S.state.analysed ? analysis().accounts : []).forEach(function (a) {
      if (!a.owner || seen[a.owner]) return; seen[a.owner] = 1; out.push(a.owner);
    });
    return out.slice(0, n || 3);
  }
  function ownerList(n) {
    var o = topOwners(n);
    if (!o.length) return "your account owners";
    if (o.length === 1) return o[0];
    return o.slice(0, -1).join(", ") + " and " + o[o.length - 1];
  }
  function hubHome() {
    var done = !!S.state.analysed, an = done ? analysis() : null;
    var today = done
      ? an.actions.map(function (a) {
        return '<div class="hs"><div class="k">' + esc(a.owner) + "</div>" +
          '<div class="v">' + esc(a.title) + '</div><div class="d">' + a.lines + " lines &middot; " + usdShort(a.usd) + " at risk &middot; " + esc(a.taskLabel || (a.tasks + " tasks")) + "</div></div>";
      }).join("")
      : '<div class="hs"><div class="k">Commercial operations agent</div><div class="v">Watching the order book</div>' +
        '<div class="d">Five systems feeding. Nothing assigned yet this morning.</div></div>' +
        '<div class="hs"><div class="k">Account owners</div><div class="v">Week 41 review at 11:00</div><div class="d">They want a list to act on, not three exports.</div></div>';
    return '<div class="hub"><div class="hub-main">' +
      '<span class="hub-tile"><i></i></span>' +
      '<h1 class="hub-greet">Good morning, ' + esc(personaByRole("COMMERCIAL_OPS").name.split(" ")[0]) + "!</h1>" +
      '<div class="hub-ask"><span class="hub-mk"></span><span class="hub-ph"><b>Ask</b> Oracle</span>' +
      '<span class="ic">' + ICON.mic + '</span><span class="ic">' + ICON.clip + '</span>' +
      '<span class="hub-model">Commercial operations agent ' + ICON.chevd + "</span></div>" +
      (S.wbPanel === "run" ? runCardHtml() : "") +
      '<div class="hub-chips" id="hub-chips">' +
      D.questions.map(function (q) {
        var blocked = q.blockedFor && q.blockedFor.indexOf(S.role) >= 0;
        return '<button class="hub-chip' + (blocked ? " is-blocked" : "") + '" type="button" data-ask="' + q.id + '">' + esc(q.chip) + (blocked ? " " + ICON.lock : "") + "</button>";
      }).join("") + "</div>" +
      '<div class="hub-sec">My agents<span class="hs-n">' + AGENTS.length + " agents working &middot; " + AGENTS.filter(function (a) { return a.pill !== "ready"; }).length +
      ' agents need attention</span><span class="hs-all" data-agents="1">View All</span></div>' +
      '<div class="hub-agents">' + AGENTS.map(function (a, i) {
        var live = i === 0;
        return '<div class="hub-agent"' + (live ? ' id="hub-agent-1"' : "") + '><span class="ag-ico">' + ICON.bot + "</span>" +
          "<h3>" + esc(a.name) + "</h3><p>" + esc(a.what) + "</p>" +
          '<span class="ag-pill' + (a.pill === "att" ? " ag-pill--att" : a.pill === "warn" ? " ag-pill--warn" : "") + '">' +
          esc(live ? (done ? "Ran at 09:41" : "Ready") : a.state) + "</span>" +
          '<span class="ag-last">Last observed ' + esc(a.last) + "</span></div>";
      }).join("") + "</div></div>" +
      '<aside class="hub-side"><h3>Today&rsquo;s Tasks</h3><div class="hub-date">October 6th, 2026</div>' + today +
      '<div class="hs"><div class="k">Stalest source</div><div class="v">CRM &middot; 1 h 05 min</div><div class="d">Every answer names the source furthest behind.</div></div>' +
      '<span class="hs-more" data-agents="1">View all</span>' +
      "</aside></div>" + hubBottomNav("home");
  }
  /* Oracle's My agents band is a row of compact cards with a status pill and a
     "Last observed" date. Only the first one does anything here. */
  var AGENTS = [
    { name: "Commercial operations agent", what: "Reads the order book across five systems and prices every late line.", pill: "ready", state: "Ready", last: "6/10/2026" },
    { name: "Contract terms agent", what: "Reads delivery and penalty clauses out of the customer contracts.", pill: "ready", state: "Ready", last: "5/10/2026" },
    { name: "Supplier watch agent", what: "Watches purchase-order promise dates against the lines they cover.", pill: "warn", state: "Warning", last: "3/10/2026" },
    { name: "Carrier exception agent", what: "Picks up carrier scan exceptions and re-times the shipments.", pill: "att", state: "Needs Attention", last: "1/10/2026" }
  ];
  /* Agent Hub's own dark bottom nav: Home · Insights · Catalog · Teams */
  function hubBottomNav(on) {
    var items = [["home", "Home", "home"], ["insights", "Insights", "board"], ["catalog", "Catalog", "grid"], ["teams", "Teams", "people"]];
    return '<nav class="hub-bot" aria-label="Agent Hub">' + items.map(function (it) {
      return '<button class="' + (it[0] === on ? "is-on" : "") + '" type="button" data-hubnav="' + it[0] + '">' + ICON[it[2]] + esc(it[1]) + "</button>";
    }).join("") + "</nav>";
  }

  /* ---- the multi-agent run card (Agent Hub's own pattern) --------------- */
  /* Agents run in order; each shows "Not started" → "In progress" with its
     sub-steps on a dotted timeline → done. Cancel is present, as Oracle's is. */
  function runCardHtml() {
    var plan = RUN_PLAN;
    var max = 0;
    plan.forEach(function (a) { var t = 0; a.steps.forEach(function (x) { t += x.ms || 500; }); a.total = t; if (t > max) max = t; });
    return '<div class="runcard" id="runcard">' +
      '<div class="rc-q">' + esc(D.questions[0].text) + "</div>" +
      plan.map(function (a, i) {
        var st = i < S.run.ai ? "done" : i === S.run.ai ? "live" : "wait";
        /* Oracle's completed word in this product is "Succeeded"; a step that
           has not run carries no label at all */
        var label = st === "done" ? "Succeeded" : st === "live" ? "In progress" : "";
        return '<div class="rc-agent is-' + st + '" data-rc="' + esc(a.id) + '">' +
          '<span class="rc-ico">' + (st === "done" ? ICON.check : st === "live" ? ICON.refresh : ICON.chev) + "</span>" +
          '<div class="rc-body">' + (label ? '<span class="rc-st">' + label + "</span>" : "") + "<b>" + esc(a.agent) + "</b>" +
          (st === "wait" ? "" : '<ol class="rc-steps">' + a.steps.map(function (s, j) {
            var sd = st === "done" || j < S.run.si ? " is-done" : (st === "live" && j === S.run.si ? " is-live" : "");
            return "<li class=\"" + sd.trim() + '"><i></i><span>' + esc(s.text) + "</span></li>";
          }).join("") + "</ol>") +
          "</div>" +
          '<div class="rc-dur">' + (st === "done"
            ? '<span class="bar"><i style="width:' + Math.max(6, Math.round(a.total / max * 100)) + '%"></i></span><span class="ms">' + (a.total / 1000).toFixed(2) + "s</span>"
            : st === "live" ? '<span class="tr"><span class="spin"></span></span>' : "") + "</div>" +
          "</div>";
      }).join("") +
      '<div class="rc-foot"><span class="rc-note">' + esc(RUN_PLAN.length) + " agents working on one question &middot; reading five systems</span></div></div>";
  }
  var RUN_PLAN = [];
  function runAnalysis() {
    if (S.busy) return;
    if (S.state.analysed && S.wbPanel === "analysis") { toast("The analysis is already on screen."); return; }
    RUN_PLAN = D.runPlan();
    S.busy = true; S.run = { ai: 0, si: 0 }; S.wbPanel = "run"; S.panel = null;
    renderWb();
    var t = 0;
    RUN_PLAN.forEach(function (a, i) {
      a.steps.forEach(function (s, j) {
        setTimeout(function () { S.run = { ai: i, si: j }; if (S.wbPanel === "run") renderWb(); }, t);
        t += s.ms || 500;
      });
    });
    setTimeout(function () {
      S.run = { ai: RUN_PLAN.length, si: 0 };
      S.state = { analysed: true, decisions: S.state.decisions, dashboard: S.state.dashboard };
      S.wbPanel = "analysis"; S.busy = false;
      renderWb(); renderRw();
      var an = analysis();
      toast('<span class="tok">' + ICON.check + "</span><span><b>" + an.headline.lines + " open lines will miss their promise</b> &middot; " +
        usdShort(an.headline.revenueUsd) + " at risk &middot; " + an.headline.tierA.accounts + " tier-A accounts.</span>", 9000);
      tour.next();
    }, t + 420);
  }

  /* ---- the analysis view ------------------------------------------------ */
  function causesChart(an) {
    var max = Math.max.apply(null, an.causes.map(function (c) { return c.usd; })) || 1;
    return '<div class="causes">' + an.causes.map(function (c) {
      return '<div class="cause" data-cause="' + esc(c.id) + '" title="' + esc(c.note || "") + '">' +
        '<span class="cl">' + esc(c.label) + "</span>" +
        '<span class="cb"><i class="cb--' + esc(c.id) + '" style="width:' + Math.max(4, Math.round(c.usd / max * 100)) + '%"></i></span>' +
        '<span class="cn">' + c.lines + " lines</span><span class=\"cv\">" + usdShort(c.usd) + "</span></div>";
    }).join("") + "</div>";
  }
  function actionsHtml(an) {
    return '<div class="acts">' + an.actions.map(function (a) {
      return '<div class="act" data-act="' + esc(a.id) + '" title="' + esc(a.why || "") + '">' +
        '<div class="act-h"><span class="act-id">' + esc(a.id) + '</span><b>' + esc(a.title) + "</b>" +
        '<span class="stat stat--' + (a.status === "declined" ? "open" : "pending") + '">' + esc(a.status) + "</span></div>" +
        '<div class="act-m"><span>' + esc(a.owner) + "</span><span>" + a.lines + " lines</span><span>" + (a.accounts || (a.accountIds || []).length) + " accounts</span><span class=\"v\">" + usdShort(a.usd) + "</span></div>" +
        '<div class="act-t">' + ICON.check + "<span><b>" + esc(a.taskLabel || (a.tasks + " tasks")) + ".</b> " + esc(a.assigned || "Assigned as a task. Nothing is written back to an ERP") + "</span></div>" +
        "</div>";
    }).join("") +
      '<p class="act-note">The AI\u2019s estimate on this data, not a promise every line lands.</p></div>';
  }
  function accountsTable(an) {
    var all = an.accounts.filter(function (a) { return S.role !== "ANALYST_NA" || a.entity === "NG-NA"; });
    var live = all.filter(function (a) { return a.status === "at-risk"; }).slice(0, 12);
    var out = all.filter(function (a) { return a.status !== "at-risk"; });
    var rows = live.concat(out);
    var exposed = all.filter(function (a) { return a.status === "at-risk"; }).length;
    return '<div class="ans-grid"><table class="agrid agrid--acct" id="acct-table"><thead><tr>' +
      "<th>Account</th><th>Tier</th><th>Systems</th><th class=\"r\">Lines</th><th class=\"r\">At risk (USD)</th><th class=\"r\">Penalty</th><th>Why the AI says it is late</th><th>What the AI proposes</th><th></th></tr></thead><tbody>" +
      rows.map(function (a) {
        var gone = a.status !== "at-risk";
        var lines = gone ? (a.wasLines || a.lines) : a.lines;
        var usd = gone ? (a.wasUsd || a.usd) : a.usd;
        var pen = gone ? (a.wasPenaltyUsd || a.penaltyUsd) : a.penaltyUsd;
        return '<tr data-acct="' + esc(a.id) + '"' + (gone ? ' class="is-review"' : "") + ">" +
          "<td><b>" + esc(a.name) + '</b><span class="sub">' + esc(a.owner) + "</span></td>" +
          '<td><span class="tierb tierb--' + esc(a.tier) + '">' + esc(a.tier) + "</span></td>" +
          '<td class="sysc">' + (a.riskSystems && a.riskSystems.length ? a.riskSystems : a.systems || []).map(sysBadge).join("") + "</td>" +
          '<td class="r">' + (gone ? "<s>" + lines + "</s>" : lines) + "</td>" +
          '<td class="r">' + (gone ? "<s>" + money(usd, 0) + "</s>" : money(usd, 0)) + "</td>" +
          '<td class="r">' + (gone ? "<s>" + money(pen, 0) + "</s>" : money(pen, 0)) + "</td>" +
          "<td>" + esc(a.causeLabel || "—") + "</td>" +
          "<td>" + (gone
            ? '<span class="stat stat--open">' + esc(a.statusLabel || "decided") + "</span> " + esc(a.decision ? "\u201c" + a.decision.reason + "\u201d" : "you overruled this")
            : esc(a.recommendation ? a.recommendation.text : "—")) + "</td>" +
          '<td><button class="btn btn--xs" type="button" data-ev="' + esc(a.id) + '">Explore</button></td></tr>';
      }).join("") + "</tbody></table></div>" +
      '<p class="an-sub">Top ' + live.length + " of " + exposed + " accounts at risk" +
      (out.length ? ", plus the " + out.length + " you decided on" : "") + ".</p>";
  }
  function viewChips(views) {
    views = views || [];
    var head = views.slice(0, 5), rest = views.slice(5);
    return head.map(function (v) { return '<button class="viewchip" type="button" data-viewlin="' + esc(v) + '" title="Where ' + esc(v) + ' comes from">' + esc(v) + "</button>"; }).join(" ") +
      (rest.length ? ' <button class="viewchip viewchip--more" type="button" data-morev="' + esc(rest.join("|")) + '">+' + rest.length + " more</button>" : "");
  }
  function analysisHtml() {
    var an = analysis();
    var h = an.headline;
    var roleTag = S.role === "ANALYST_NA" ? '<span class="stat stat--review">Viewing as Marcus Bell &middot; North America</span>' : "";
    return '<div class="q-bubble">' + esc(D.questions[0].text) + "</div>" +
      '<div class="ans" id="ans">' +
      '<div class="an-head"><div class="an-hl"><b>' + h.lines + " open lines</b> will miss the date you promised, worth <b>" + esc(h.revenueText || usdShort(h.revenueUsd)) +
      "</b>. <b>" + h.tierA.accounts + " tier-A accounts</b> carry " + esc(h.tierA.text ? String(h.tierA.text).split("·").pop().trim() : usdShort(h.tierA.usd)) +
      " of it, and the contracts price <b>" + esc(h.penaltiesText || usdShort(h.penaltiesUsd)) + "</b> of late penalties if nothing changes.</div>" +
      '<div class="ans-meta">' + esc(an.freshness.text) + (roleTag ? '<span class="sep">&middot;</span>' + roleTag : "") + '<span class="sep">&middot;</span>' +
      viewChips(an.views) + "</div>" +
      '<div class="ans-rows">Total Rows: ' + an.accounts.length + " | Displayed: " + an.accounts.length + "</div></div>" +
      '<section class="band an-band" aria-label="Per system, then across systems">' + bandHtml(an, "band-tiles", S.movedBand) + "</section>" +
      (S.narrate ? '<div class="ans-narr"><span class="sp">' + ICON.speak + "</span><span>" + esc(an.narrative) + "</span></div>" : "") +
      '<div class="an-cols"><section class="an-box"><h4>' + ICON.chart + "Why the lines are late</h4>" + causesChart(an) +
      '<p class="an-sub">One cause per line, and they add back to the totals.</p></section>' +
      '<section class="an-box"><h4>' + ICON.bulb + "What the AI proposes</h4>" + actionsHtml(an) + "</section></div>" +
      '<section class="an-box an-box--wide"><h4>' + ICON.list + "Accounts, ranked by what is at stake</h4>" + accountsTable(an) + "</section>" +
      (an.caveat ? '<div class="ans-caveat">' + ICON.info + " " + esc(an.caveat) + "</div>" : "") +
      '<div class="ans-acts">' + chipRow(true) + "</div>" +
      (S.panel ? '<div class="ans-panel" id="ans-panel">' + anPanelHtml(an) + "</div>" : "") +
      "</div>" + composerHtml();
  }
  /* Ask Oracle's own chip row — Explore and Explain are Oracle's pair, Code
     View is Oracle's SQL panel; Trace, Narrate and Create dashboard are ours. */
  function chipRow(withDash) {
    function chip(id, icon, label) {
      return '<button class="achip' + (S.panel === id ? " is-on" : "") + '" type="button" data-panel="' + id + '">' + icon + label + "</button>";
    }
    return chip("evidence", ICON.search, "Explore") + chip("explain", ICON.bulb, "Explain") +
      chip("code", ICON.code, "Code View") + chip("trace", ICON.route, "Trace") +
      '<button class="achip' + (S.narrate ? " is-on" : "") + '" type="button" data-narr="1">' + ICON.speak + "Narrate</button>" +
      (withDash
        ? '<span class="right"><button class="achip" type="button" id="create-dash">' + ICON.chart + "Create dashboard</button></span>"
        : '<span class="right"><button class="achip" type="button" data-askback="1">' + ICON.chevl + "Back to what is at risk</button></span>");
  }
  function composerHtml() {
    return '<div class="conv-comp"><span class="hub-mk"></span><span>Ask a Question...</span><span class="mic">' + ICON.mic + "</span></div>" +
      '<p class="conv-dis"><i>!</i>AI models can make mistakes. Verify responses.</p>';
  }
  function anPanelHtml(an) {
    if (S.panel === "trace") return traceHtml(an);
    if (S.panel === "explain") return explainHtml(an);
    if (S.panel === "code") return codeHtml(ans("q1"));
    return evidenceHtml(an);
  }
  /* Code View: the statement the agent ran, in Oracle's dark SQL panel */
  function codeHtml(a) {
    var sql = (a && a.sql) || daAnswer().sql || "";
    return panelHead("Code View", "the statement the agent ran") +
      '<div class="sqlbox">' + sqlHtml(sql).replace(/\n/g, "<br>") + "</div>" +
      '<p class="honest">Read-only against GOLD, inside the allow-list, with row policy and masking applied.</p>';
  }
  function panelHead(title, note) {
    return '<div class="panel-head"><b>' + esc(title) + "</b>" + (note ? '<span class="panel-note">' + note + "</span>" : "") +
      '<button class="btn btn--ghost btn--xs x" type="button" data-panel="">' + ICON.x + "Close</button></div>";
  }
  /* Oracle's trace is a TREE of spans with per-node glyphs, a trackless
     dark-teal duration bar, and a metadata pane of key/value lines beside it.
     The seconds sit under `Tokens`, as the Nov-2025 frame renders them. */
  var TRACE_GLYPH = { "SQL Firewall check": "shield", "Row policy applied": "lock", "Column masking applied": "lock", "Answer composed": "msg" };
  function traceHtml(an) {
    var max = Math.max.apply(null, an.trace.map(function (s) { return s.ms; })) || 1;
    var total = an.trace.reduce(function (t, s) { return t + s.ms; }, 0);
    function row(sp, kid, glyph, sel) {
      return '<div class="tr' + (kid ? " tr--kid" : "") + (sel ? " is-sel" : "") + (sp.status === "blocked" ? " is-blocked" : "") + '">' +
        '<span class="n"><span class="di' + (kid ? "" : " open") + '"></span>' + ICON[glyph] +
        "<b>" + esc(sp.span) + "</b>" + (sp.detail ? "<span>" + esc(sp.detail) + "</span>" : "") + "</span>" +
        '<span class="bar"><i style="width:' + Math.max(3, Math.round(sp.ms / max * 100)) + '%"></i></span>' +
        '<span class="ms">' + (sp.ms / 1000).toFixed(2) + "s</span></div>";
    }
    var rows = an.trace.map(function (sp, i) {
      var out = row(sp, false, sp.agent ? "bot" : (TRACE_GLYPH[sp.span] || "sched"), i === 0);
      (sp.tools || []).forEach(function (tool) {
        out += '<div class="tr tr--kid"><span class="n"><span class="di"></span>' + ICON.grid + "<b>" + esc(tool) + "</b></span>" +
          '<span class="bar"></span><span class="ms"></span></div>';
      });
      return out;
    }).join("");
    return panelHead("Trace", "what each agent read, and the rules that applied") +
      '<div class="trace-2"><div>' +
      '<div class="tr h"><span class="n">Agent flow task</span><span class="du">Duration</span><span class="ms">Tokens</span></div>' + rows +
      "</div>" +
      '<aside class="tr-meta"><div class="mt">' + esc(an.trace[0] ? an.trace[0].span : "") + "</div>" +
      '<div class="fwline"><span class="k">SQL Firewall</span> <span class="' + (an.firewall.status === "blocked" ? "fw-no" : "fw-ok") + '">' + esc(an.firewall.status) + "</span> &middot; allow-list " + esc(an.firewall.allowList) + "</div>" +
      '<div class="fwline"><span class="k">Rows you may see</span> ' + esc(an.firewall.rowPolicy) + "</div>" +
      '<div class="fwline"><span class="k">Columns masked</span> ' + esc(an.firewall.masking) + "</div>" +
      '<div class="fwline"><span class="k">Duration</span> ' + (total / 1000).toFixed(2) + "s</div>" +
      '<div class="fwline"><span class="k">Lines read</span> ' + an.headline.lines + "</div>" +
      '<div class="fwline"><span class="k">Certified views</span> ' + an.views.length + "</div>" +
      '<div class="fwline"><span class="k">Systems</span> ' + D.sources.length + "</div>" +
      '<div class="tr-json"><b>Input</b><br>The agents read certified views only. The database applies the rules.</div>' +
      "</aside></div>";
  }
  function explainHtml(an) {
    return panelHead("How the AI read the question", "the words it had to pin down first") +
      (D.glossary || []).slice(0, 5).map(function (g) {
        if (!g) return "";
        return '<div class="gl"><b>' + esc(g.term) + '</b><div class="syn">also written: ' + esc((g.synonyms || []).join(", ")) + '</div><div class="def">' + esc(g.definition) + '</div><div class="own">annotated by ' + esc(g.owner) + " &middot; last reviewed " + esc(g.changed) + "</div></div>";
      }).join("") +
      '<div class="panel-note">The catalog descriptions and column annotations that give your words a meaning.</div>';
  }
  function evidenceHtml(an) {
    var list = an.accounts.filter(function (a) { return S.role !== "ANALYST_NA" || a.entity === "NG-NA"; });
    if (!list.length) return panelHead("Explore") + '<div class="panel-note">No accounts inside your region.</div>';
    var key = S.evAccount, has = list.some(function (a) { return a.id === key; });
    if (!has) key = list[0].id;
    var e = D.evidence(key, S.role, decisions());
    var acc = e.account || {};
    var gone = acc.status && acc.status !== "at-risk";
    var picker = '<div class="ev" style="margin:0 0 10px">' + list.slice(0, 12).map(function (a) {
      return '<button class="evc evc--o" type="button" data-ev="' + esc(a.id) + '" style="cursor:pointer' + (a.id === key ? ";background:#e4eef3;border-color:#9dc0cf;color:#1d5f73" : "") + '">' + esc(a.name) + "</button>";
    }).join("") + "</div>";
    var body =
      '<div class="recon"><b>' + esc(acc.name) + "</b> &middot; tier " + esc(acc.tier) + " &middot; " + esc(acc.owner || "") + " &middot; " +
      esc(gone ? (acc.wasLines || acc.lines) : acc.lines) + " lines &middot; " +
      esc(usdShort(gone ? acc.wasUsd : acc.usd)) + (gone ? " (" + esc(acc.statusLabel || "decided") + ")" : " at risk") +
      " &middot; penalty " + esc(usdShort(gone ? acc.wasPenaltyUsd : acc.penaltyUsd)) +
      '<span class="mono">' + esc(acc.causeLabel || "") + (acc.recommendation && acc.recommendation.text ? " &middot; " + acc.recommendation.text : "") + "</span></div>";
    if (e.identity) {
      var nsys = (acc.systems || []).length;
      body += '<div class="idline">' + ICON.shield + "<span>" +
        (nsys > 1
          ? "The AI matched this customer across " + nsys + " systems at a score of " + esc(Number(e.identity.score).toFixed(2))
          : "The AI found this customer in one system only") +
        " &middot; " + esc(e.identity.reason) +
        ' <span class="stat stat--' + esc(String(e.identity.status || "").replace(/[^a-z]/g, "")) + '">' + esc(e.identity.status) + "</span></span></div>";
    }
    body += "<h4>The lines, in the systems they live in</h4>" +
      '<table class="dgrid"><thead><tr><th>System</th><th>Key in that system</th><th>Item</th><th class="r">Qty</th><th>Promised</th><th>Predicted</th><th class="r">Late</th><th>Status</th><th class="r">USD</th></tr></thead><tbody>' +
      (e.lines || []).map(function (l) {
        return "<tr><td>" + sysBadge(l.sys) + "</td><td><code>" + esc(l.keyLabel || (l.object + " " + l.key)) + "</code></td>" +
          "<td><code>" + esc(l.item) + '</code><span class="sub">' + esc(l.itemDescription || "") + "</span></td>" +
          '<td class="r">' + esc(l.qty) + " " + esc(l.uom || "") + "</td><td>" + esc(l.promisedLabel || l.promised) + "</td><td>" + esc(l.predictedLabel || l.predicted) + "</td>" +
          '<td class="r">' + esc(l.daysLate === undefined ? "—" : l.daysLate + " d") + "</td><td>" + esc(l.status) + '</td><td class="r">' + money(l.usd, 0) + "</td></tr>";
      }).join("") + "</tbody></table>" +
      (e.linesHidden ? '<p class="honest">' + e.linesHidden + " further line" + (e.linesHidden === 1 ? " is" : "s are") + " outside your region and never left the database.</p>" : "");
    if (e.stockElsewhere && e.stockElsewhere.length) {
      body += "<h4>The same part, on hand somewhere else</h4>" +
        '<table class="dgrid"><thead><tr><th>System</th><th>Plant</th><th>Item there</th><th class="r">On hand</th><th class="r">Needed</th><th>What the AI would move</th></tr></thead><tbody>' +
        e.stockElsewhere.map(function (x) {
          return "<tr><td>" + sysBadge(x.sys) + "</td><td><code>" + esc(x.plant) + '</code><span class="sub">' + esc(x.plantName || "") + "</span></td>" +
            "<td><code>" + esc(x.itemKey || x.item) + '</code><span class="sub">' + esc(x.description || x.item) + "</span></td>" +
            '<td class="r">' + esc(x.onHand) + " " + esc(x.uom || "") + '</td><td class="r">' + esc(x.needed === undefined ? "—" : x.needed) + "</td>" +
            "<td>" + esc(x.note || ("transfer " + (x.transferId || ""))) + "</td></tr>";
        }).join("") + "</tbody></table>" +
        '<div class="recon">The order is in one system and the stock in another, under a different item number.</div>';
    }
    if (e.supplierDelay) {
      var sd = e.supplierDelay;
      body += "<h4>The supplier that is late</h4><table class=\"dgrid\"><tbody>" +
        "<tr><td>Supplier</td><td>" + esc(sd.supplier) + "</td></tr>" +
        "<tr><td>Purchase order</td><td>" + sysBadge(sd.sys) + " <code>" + esc(sd.keyLabel || sd.key) + "</code></td></tr>" +
        "<tr><td>Promised receipt</td><td>" + esc(sd.promisedLabel || sd.promisedDate) + " &middot; " + esc(sd.daysLate) + " days late</td></tr>" +
        (sd.reason ? "<tr><td>What the AI found</td><td>" + esc(sd.reason) + "</td></tr>" : "") + "</tbody></table>";
    }
    if (e.creditHold) {
      var ch = e.creditHold;
      body += "<h4>The credit hold</h4><table class=\"dgrid\"><tbody>" +
        "<tr><td>Where it sits</td><td>" + sysBadge(ch.sys) + " <code>" + esc(ch.object) + "</code></td></tr>" +
        "<tr><td>Placed</td><td>" + esc(ch.placedLabel || ch.placedOn) + "</td></tr>" +
        "<tr><td>Reason</td><td>" + esc(ch.reason) + "</td></tr>" +
        "<tr><td>Credit limit</td><td>" + esc(S.role === "ANALYST_NA" ? "masked for this role" : (ch.creditLimitText || usdShort(ch.creditLimitUsd))) + "</td></tr>" +
        "<tr><td>Owner</td><td>" + esc(ch.owner) + "</td></tr></tbody></table>";
    }
    if (e.transit) {
      var tr = e.transit, ex = tr.exception || {};
      body += "<h4>Where the shipment actually is</h4><table class=\"dgrid\"><tbody>" +
        "<tr><td>Shipment</td><td>" + sysBadge("DLV") + " <code>" + esc(tr.shipmentId) + "</code> &middot; " + esc(tr.object || "DLV_SHIPMENTS") + "</td></tr>" +
        "<tr><td>Carrier</td><td>" + esc(tr.carrier) + " &middot; " + esc(tr.origin) + " &rarr; " + esc(tr.destination) + "</td></tr>" +
        "<tr><td>ETA</td><td>" + esc(tr.etaLabel || tr.eta) + " &middot; " + esc(tr.daysLate) + " days later than promised</td></tr>" +
        (ex.code ? "<tr><td>Exception</td><td><code>" + esc(ex.code) + "</code> &middot; " + esc(ex.reason || ex.note || "") + "</td></tr>" : "") +
        "</tbody></table>" +
        ((tr.scans && tr.scans.length) ? '<div class="scans">' + tr.scans.slice(0, 6).map(function (sc) {
          return '<div class="scan"><i></i><span class="t">' + esc(sc.atLabel || sc.at || "") + "</span><span>" + esc(sc.location || "") + " &middot; " + esc(sc.status || "") + "</span></div>";
        }).join("") + "</div>" : "");
    }
    if (e.crm) {
      var contacts = (D.crmContacts || []).filter(function (c) { return c.customerId === key; }).slice(0, 2);
      body += "<h4>Who this customer is to us</h4><table class=\"dgrid\"><tbody>" +
        "<tr><td>CRM record</td><td>" + sysBadge("CRM") + " <code>" + esc(e.crm.object || "CRM_ACCOUNT") + " " + esc(e.crm.key || "") + "</code> &middot; " + esc(e.crm.freshness || "") + "</td></tr>" +
        "<tr><td>Tier</td><td>" + esc(e.crm.tier) + "</td></tr>" +
        "<tr><td>Account owner</td><td>" + esc(e.crm.owner) + " &middot; " + esc(e.crm.region || "") + "</td></tr>" +
        "<tr><td>Annual revenue</td><td>" + esc(e.crm.revenueText || usdShort(e.crm.revenue)) + "</td></tr>" +
        "<tr><td>Credit limit</td><td>" + esc(S.role === "ANALYST_NA" ? maskv(e.crm.creditLimitText, "amount") : (e.crm.creditLimitText || "—")) + "</td></tr>" +
        contacts.map(function (c) {
          return "<tr><td>" + esc(c.title || "Contact") + "</td><td>" + esc(c.name) + " &middot; <code>" + esc(maskv(c.email, "email")) + "</code> &middot; <code>" + esc(maskv(c.phone, "phone")) + "</code></td></tr>";
        }).join("") + "</tbody></table>" +
        (S.role === "ANALYST_NA" ? '<p class="honest">The database masks contacts and credit limits for this role.</p>' : "");
    }
    if (e.contract) {
      var k = e.contract;
      body += "<h4>The clause the penalty was read from</h4>" +
        '<div class="clause"><span class="cl-src">' + esc(k.object || "OKC_K_HEADERS_ALL_B") + " &middot; " + esc(k.number || "") + " &middot; " + esc(k.clauseRef || "") + "</span>" +
        (S.role === "ANALYST_NA" || k.masked
          ? "<p>Penalty terms are hidden for this role.</p>"
          : "<p>&ldquo;" + esc(k.deliveryText || "") + "&rdquo;</p><p>&ldquo;" + esc(k.penaltyText || "") + "&rdquo;</p>" +
            (k.acceptanceText ? "<p>&ldquo;" + esc(k.acceptanceText) + "&rdquo;</p>" : "")) +
        '<span class="cl-calc">' + (S.role === "ANALYST_NA" || k.masked
          ? "Exposure hidden for this role"
          : esc(k.read || ("lead time " + k.leadTimeDays + " business days")) + " &middot; exposure on these lines " + esc(k.exposedText || usdShort(k.exposedUsd))) + "</span></div>";
    }
    body = body.split('<table class="dgrid"').join('<div class="tw"><table class="dgrid"').split("</table>").join("</table></div>");
    return panelHead("Explore", "everything behind this account, in its own system") + picker + body;
  }
  function maskv(v, kind) {
    if (S.role !== "ANALYST_NA") return v;
    if (D.maskText) { try { return D.maskText(v, kind); } catch (e) { /* older signature */ } }
    return "•••••";
  }

  /* ---- Insights: the generated dashboard plus two standing ones --------- */
  function truncWord(str, n) {
    str = String(str);
    if (str.length <= n) return str;
    var cut = str.slice(0, n), sp = cut.lastIndexOf(" ");
    return (sp > n * 0.5 ? cut.slice(0, sp) : cut).replace(/[\s,·]+$/, "") + "…";
  }
  var CAUSE_COLOUR = { stock: "#4d7a2c", transit: "#1d5f73", supplier: "#8a4a12", credit: "#7d4064" };
  function barChart(items, colour) {
    var max = Math.max.apply(null, items.map(function (i) { return i.v; })) || 1;
    var h = 148, w = 360, lab = 148, top = 8, rowH = Math.min(24, (h - top) / Math.max(1, items.length)), maxBar = 136;
    return '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bar chart">' +
      items.map(function (it, i) {
        var y = top + i * rowH, bw = Math.max(2, (it.v / max) * maxBar), lbl = truncWord(it.k, 26);
        return '<text class="lb" x="0" y="' + (y + 9) + '">' + esc(lbl) + (lbl === it.k ? "" : "<title>" + esc(it.k) + "</title>") + "</text>" +
          '<rect x="' + (lab + 2) + '" y="' + y + '" width="' + bw + '" height="' + (rowH - 7) + '" rx="2" fill="' + (it.c || colour || "#4d7a2c") + '"><title>' + esc(it.k) + " · " + esc(it.l || it.v) + "</title></rect>" +
          '<text class="vl" x="' + (lab + bw + 7) + '" y="' + (y + 9) + '">' + esc(it.l || it.v) + "</text>";
      }).join("") +
      '<line class="ax" x1="' + (lab + 1) + '" y1="' + (top - 4) + '" x2="' + (lab + 1) + '" y2="' + (top + items.length * rowH - 4) + '"/></svg>';
  }
  function statusList(items) {
    return '<div class="statlist">' + items.map(function (it) {
      return '<div class="sl"><span class="k">' + esc(it.k) + '</span><span class="v v--' + esc(it.s) + '">' + esc(it.l) + "</span></div>";
    }).join("") + "</div>";
  }
  function genDashHtml() {
    var d = D.dashboard(S.role, decisions());
    var CAUSE_C = { "Stock elsewhere": "#4d7a2c", "Late in transit": "#1d5f73", "Supplier late": "#8a4a12", "Credit hold": "#7d4064" };
    var charts = (d.charts || []).map(function (c) {
      var items = (c.series || []).map(function (x) {
        return { k: x.label, v: x.value, l: (c.unit === "USD" ? "USD " + D.fmtM(x.value) : String(x.value)), c: CAUSE_C[x.label] };
      });
      return '<div class="gd-chart"><h4>' + esc(c.title) + "</h4>" +
        barChart(items, c.id === "by-tier" || c.id === "by-entity" ? "#265c61" : "#4d7a2c") + "</div>";
    }).join("");
    var t = d.table || { columns: [], rows: [] };
    return '<div class="gd" id="gen-dash">' +
      '<div class="gd-head"><div><span class="gd-tag">' + ICON.bot + "Built by the AI &middot; " + esc(d.generatedAt || "") + "</span><h3>" + esc(d.title) + "</h3>" +
      '<div class="sub">' + esc(d.subtitle || "") + "</div>" +
      '<div class="sub">' + esc(d.scope || "") + " &middot; " + esc(d.roleName || "") + " &middot; " + esc(d.rowCount) + " lines</div></div>" +
      '<div class="gd-act"><button class="btn btn--dark" type="button" id="share-dash">' + ICON.share + "Share with the commercial team</button></div></div>" +
      '<div class="gd-tiles">' + (d.tiles || []).map(function (x) {
        return '<div class="gd-tile' + (x.masked ? " is-masked" : "") + '"><span class="l">' + esc(x.label) + '</span><span class="v">' + esc(x.value) + '</span><span class="n">' + esc(x.sub || "") + "</span></div>";
      }).join("") + "</div>" +
      '<div class="gd-charts">' + charts + "</div>" +
      (t.title ? '<div class="gd-tbl-h"><b>' + esc(t.title) + "</b><span>" + esc(t.note || "") + "</span></div>" : "") +
      '<div class="tw"><table class="wb-tbl"><thead><tr>' + (t.columns || []).map(function (c) {
        return '<th' + (c.align === "right" ? ' class="r"' : "") + ">" + esc(c.label) + "</th>";
      }).join("") + "</tr></thead><tbody>" +
      (t.rows || []).map(function (r) {
        return "<tr>" + (t.columns || []).map(function (c) {
          var v = r[c.key];
          if (c.kind === "money") v = money(v, 0);
          if (c.kind === "badge") return '<td><span class="stat stat--' + esc(String(v).replace(/[^a-z]/g, "")) + '">' + esc(v) + "</span></td>";
          return '<td' + (c.align === "right" ? ' class="r"' : "") + ">" + esc(v === undefined || v === null ? "—" : v) + "</td>";
        }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>" +
      (d.caveat ? '<div class="ans-caveat">' + ICON.info + " " + esc(d.caveat) + "</div>" : "") +
      '<p class="honest">Built from ' + esc((d.builtFrom || []).join(", ")) + ', the same definitions the analysis used.' +
      (S.shared ? " " + esc(d.shareNote || "Shared with the commercial team.") : "") + "</p></div>";
  }
  function an_causeId(label) {
    var an = analysis(), out = "";
    an.causes.forEach(function (c) { if (c.label === label) out = c.id; });
    return out;
  }
  function insightsHtml() {
    var an = S.state.analysed ? analysis() : null;
    var build = S.dashBuilding
      ? '<div class="gd gd--building"><div class="gd-head"><div><span class="gd-tag">' + ICON.bot + 'Building</span><h3>Revenue at risk across systems</h3><div class="sub">Assembling a dashboard from what it just found</div></div></div>' +
        '<ol class="rc-steps rc-steps--dash">' + DASH_PLAN.map(function (x, i) {
          return '<li class="' + (i < S.dashStep ? "is-done" : i === S.dashStep ? "is-live" : "") + '"><i></i><span>' + esc(x.text) + "</span></li>";
        }).join("") + "</ol></div>"
      : (S.state.dashboard ? genDashHtml() : "");
    var standing = [];
    if (an) {
      standing.push({ name: "Order book health", sub: "Open lines, promises and what is slipping", svg: statusList([
        { k: "Open lines this week", l: String((D.orderLines || []).length), s: "ok" },
        { k: "Lines that will miss the promise", l: String(an.headline.lines), s: "bad" },
        { k: "Lines with a cause attributed", l: String(an.headline.lines), s: "ok" },
        { k: "Customer matches waiting for a person", l: String((an.pending && an.pending.customers) || (D.matches || []).length), s: "warn" },
        { k: "Item cross-references waiting", l: String((an.pending && an.pending.items) || (D.itemXrefs || []).length), s: "warn" }
      ]), views: ["OPEN_ORDER_LINES_X", "PROMISE_STATUS", "LATE_CAUSES"] });
      standing.push({ name: "Service levels by account", sub: "What each contract promises, and what a miss costs", svg: barChart(an.accounts.filter(function (a) { return a.status === "at-risk"; }).slice(0, 6).map(function (a) {
        return { k: a.name, v: a.penaltyUsd || 1, l: usdShort(a.penaltyUsd) };
      }), "#265c61"), views: ["SLA_EXPOSURE", "ACCOUNT_EXPOSURE"] });
    }
    return '<div class="wb-pg wb-pg--hub"><h1>' + ICON.board + 'Insights</h1><div class="sub">Dashboards on the same certified views the answers read</div>' +
      build +
      (standing.length ? '<div class="hub-sec" style="margin-top:' + (build ? "22px" : "0") + '">Standing dashboards</div><div class="dash">' + standing.map(function (c) {
        return '<button class="dash-card" type="button" data-dash="' + esc(c.name) + '" style="text-align:left;cursor:pointer"><h3>' + esc(c.name) + '</h3><div class="sub">' + esc(c.sub) + "</div>" + c.svg +
          '<div class="vs">' + c.views.map(function (v) { return "GOLD." + v; }).join(" · ") + "</div></button>";
      }).join("") + "</div>" : "") +
      (!build && !standing.length ? '<div class="empty">Ask the agent what is at risk this week.</div>' : "") +
      '<p class="honest">The standing dashboards are static here. The generated one obeys its reader.</p>' +
      "</div>" + hubBottomNav("insights");
  }
  var DASH_PLAN = [];
  function createDashboard() {
    if (S.busy) return;
    if (!S.state.analysed) { toast("Ask what is at risk first. There is nothing to put on a dashboard."); return; }
    DASH_PLAN = D.dashboardPlan();
    S.busy = true; S.dashBuilding = true; S.dashStep = 0; S.wbPanel = "insights"; S.panel = null;
    renderWb();
    var t = 0;
    DASH_PLAN.forEach(function (s, i) {
      setTimeout(function () { S.dashStep = i; if (S.wbPanel === "insights") renderWb(); }, t);
      t += s.ms || 500;
    });
    setTimeout(function () {
      S.dashBuilding = false; S.busy = false;
      S.state = { analysed: true, decisions: S.state.decisions, dashboard: true };
      renderWb();
      toast('<span class="tok">' + ICON.check + "</span><span><b>Dashboard built</b> &middot; " + esc(D.dashboard(S.role, decisions()).title) +
        " &middot; four tiles, four charts and the actions.</span>", 8000);
      tour.next();
    }, t + 320);
  }
  function share() {
    if (!S.state.dashboard) { toast("Build the dashboard first."); return; }
    S.shared = true;
    renderWb();
    toast('<span class="tok">' + ICON.check + "</span><span><b>Shared with the commercial team</b> &middot; " + esc(ownerList(3)) + " and the rest &middot; each sees their own rows.</span>", 9000);
    tour.after("share");
  }

  /* ---- render + events -------------------------------------------------- */
  /* A conversation is not a Workbench page: Oracle swaps the charcoal bar for a
     plum one carrying the agent's name and its own control set. Three bar
     colours across one product is what Oracle ships — don't unify them. */
  var CONV_PANELS = { analysis: 1, conversation: 1 };
  function renderPlum() {
    var on = !!CONV_PANELS[S.wbPanel];
    $("#wb-bar").hidden = on;
    $("#wb-plum").hidden = !on;
    if (!on) return;
    $("#plum-agent").innerHTML = ICON.bot + "Commercial operations agent";
    $("#plum-right").innerHTML = ICON.undo + ICON.redo + ICON.trash +
      "<i>" + ICON.ledger + ICON.chevd + "</i>" + ICON.bookmark +
      '<span class="plum-av">' + esc(persona().initials) + "</span>";
  }
  function renderWb() {
    renderWbNav(); renderWbMenu(); renderPlum();
    var page = $("#wb-page");
    page.classList.toggle("is-hub", S.wbPanel === "home" || S.wbPanel === "run" || S.wbPanel === "insights");
    if (S.wbPanel === "analysis") { page.innerHTML = '<div class="conv-wrap"><div class="conv conv--an">' + analysisHtml() + "</div></div>"; return; }
    if (S.wbPanel === "conversation") { page.innerHTML = '<div class="conv-wrap"><div class="conv">' + answerHtml(ans()) + "</div></div>"; return; }
    if (S.wbPanel === "insights") { page.innerHTML = insightsHtml(); return; }
    if (S.wbPanel === "catalog") { page.innerHTML = mcatalogHtml(); return; }
    if (S.wbPanel === "apc") { page.innerHTML = apcHtml(); return; }
    if (S.wbPanel === "lineage") {
      page.innerHTML = lineageHtml();
      requestAnimationFrame(function () { drawLineage(); });
      return;
    }
    if (S.wbPanel === "audit") { page.innerHTML = auditHtml(); return; }
    page.innerHTML = hubHome();
  }

  /* ---- the saved questions other than 1: the round-1 answer surface ----- */
  function cell(row, c) {
    var v = row[c.key];
    if (c.kind === "badges") return (v || []).map(sysBadge).join("");
    if (c.kind === "badge") return D.sourceById[v] ? sysBadge(v) : '<span class="stat stat--auto">' + esc(v) + "</span>";
    if (c.kind === "money") return v === null || v === undefined ? "—" : money(v, 0);
    if (c.kind === "num") return v === null || v === undefined ? "—" : esc(String(v));
    if (c.kind === "score") return v === null || v === undefined ? "—" : Number(v).toFixed(2);
    if (c.kind === "status") return '<span class="stat stat--' + esc(String(v).toLowerCase().replace(/[^a-z]/g, "")) + '">' + esc(v) + "</span>";
    if (c.kind === "mask") return '<span class="mono">' + esc(v) + "</span>";
    return esc(v);
  }
  function answerHtml(a) {
    var head = a.columns.map(function (c) { return '<th class="' + (c.align === "right" ? "r" : "") + '">' + esc(c.label) + "</th>"; }).join("");
    var body = a.rows.map(function (row, i) {
      return "<tr>" + a.columns.map(function (c) {
        return '<td class="' + (c.align === "right" ? "r " : "") + (c.kind === "badges" || c.kind === "badge" ? "sysc" : "") + '">' + cell(row, c) + "</td>";
      }).join("") + "</tr>";
    }).join("");
    var grid = a.blocked
      ? '<div class="blocked"><span class="bi">' + ICON.lock + "</span><div><b>Refused by SQL Firewall</b>" +
        "<p>" + esc(a.firewall.reason) + "</p>" +
        '<span class="mono">allow-list ' + esc(a.firewall.allowList) + " &middot; status blocked &middot; audit row written</span></div></div>"
      : '<div class="ans-grid"><table class="agrid"><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>";
    var meta = a.blocked
      ? "Total Rows: 0 | Refused before it ran"
      : "Total Rows: " + a.rowCount + " | Displayed: " + a.displayed;
    var roleTag = S.role === "ANALYST_NA" ? '<span class="stat stat--review">Viewing as Marcus Bell &middot; North America</span>' : "";
    return '<div class="q-bubble">' + esc(a.text) + "</div>" +
      '<div class="ans" id="ans">' +
      '<div class="ans-meta">' + esc(a.freshness.text) + (roleTag ? '<span class="sep">&middot;</span>' + roleTag : "") + '<span class="sep">&middot;</span>' +
      viewChips(a.views) + "</div>" +
      '<div class="ans-rows">' + meta + "</div>" +
      grid +
      (a.caveat ? '<div class="ans-caveat">' + ICON.info + " " + esc(a.caveat) + "</div>" : "") +
      '<div class="ans-acts">' + chipRow(false) + "</div>" +
      (S.narrate ? '<div class="ans-narr"><span class="sp">' + ICON.speak + "</span><span>" + esc(a.narrate) + "</span></div>" : "") +
      (S.panel ? '<div class="ans-panel" id="ans-panel">' + (S.panel === "explain" ? explainHtml(analysis()) : S.panel === "code" ? codeHtml(a) : S.panel === "evidence" ? evidenceHtml(analysis()) : traceHtml(analysis())) + "</div>" : "") +
      "</div>" + composerHtml();
  }

  $("#wb-page").addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-hubnav]"))) {
      var hn = t.dataset.hubnav;
      if (hn === "teams") { toast("<span><b>Teams</b> is the Agent Hub's fourth tab, outside this walkthrough.</span>"); return; }
      S.wbPanel = hn === "catalog" ? "catalog" : hn; S.panel = null; renderWb(); return;
    }
    if ((t = e.target.closest("[data-agents]"))) { toast("<span>Four agents are registered here. Only the <b>commercial operations agent</b> runs.</span>"); return; }
    if ((t = e.target.closest("[data-narr]"))) { S.narrate = !S.narrate; renderWb(); return; }
    if ((t = e.target.closest("[data-ask]"))) { ask(t.dataset.ask); return; }
    if ((t = e.target.closest("[data-askback]"))) { S.wbPanel = S.state.analysed ? "analysis" : "home"; S.panel = null; renderWb(); return; }
    if ((t = e.target.closest("[data-back]"))) { S.wbPanel = "home"; S.panel = null; renderWb(); return; }
    if ((t = e.target.closest("[data-ev]"))) {
      openEvidence(t.dataset.ev);
      tour.after("evidence"); return;
    }
    if ((t = e.target.closest("#create-dash"))) { createDashboard(); tour.after("create-dash"); return; }
    if ((t = e.target.closest("#share-dash"))) { share(); return; }
    if ((t = e.target.closest("[data-panel]"))) {
      var p2 = t.dataset.panel;
      S.panel = (p2 && S.panel === p2) ? null : (p2 || null);
      renderWb();
      var el = $("#ans-panel"); if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      tour.after(p2 === "trace" ? "trace" : "");
      return;
    }
    if ((t = e.target.closest("[data-dash]"))) { toast("<span>Dashboard <b>" + esc(t.dataset.dash) + "</b> is static here. It reads the same certified views as the answers.</span>"); return; }
    /* ---- Master catalog / lineage ---- */
    if ((t = e.target.closest("[data-morev]"))) { toast("<span>Also read: <b>" + esc(t.dataset.morev.split("|").join(" · ")) + "</b>. Click a chip to see where it comes from.</span>", 9000); return; }
    if ((t = e.target.closest("[data-viewlin]"))) { openLineage(t.dataset.viewlin); return; }
    if ((t = e.target.closest("[data-mcent]"))) { S.mcEntity = t.dataset.mcent; S.mcMenu = false; renderWb(); return; }
    if ((t = e.target.closest("#mc-actions"))) { S.mcMenu = !S.mcMenu; renderWb(); return; }
    if ((t = e.target.closest("[data-mclin]"))) { S.mcMenu = false; openLineage(t.dataset.mclin); return; }
    if ((t = e.target.closest("[data-mcdet]"))) { S.mcMenu = false; renderWb(); toast("<span><b>View Details</b> and <b>Set as Anchor</b> are the other right-click actions. Only <b>Lineage</b> opens here.</span>", 6000); return; }
    if ((t = e.target.closest("[data-mcanch]"))) { S.mcMenu = false; renderWb(); toast("<span>Setting an anchor re-centres the lineage diagram on that artifact. GOLD." + esc(S.mcEntity) + " is already the anchor.</span>", 6000); return; }
    if ((t = e.target.closest("[data-apccreate]"))) { toast("<span><b>Create Metadata Extractor</b> is read-only here.</span>"); return; }
    if ((t = e.target.closest("[data-apcopen]"))) { S.apcView = "detail"; renderWb(); return; }
    if ((t = e.target.closest("[data-apclist]"))) { S.apcView = "list"; renderWb(); return; }
    if ((t = e.target.closest("#lin-close"))) { S.wbPanel = S.linFrom || "catalog"; S.linFrom = null; renderWb(); return; }
    if ((t = e.target.closest("[data-linopen]"))) {
      var oid = t.dataset.linopen, oi = S.linOpen.indexOf(oid);
      if (oi >= 0) S.linOpen.splice(oi, 1); else S.linOpen.push(oid);
      renderWb(); return;
    }
    if ((t = e.target.closest("[data-linclear]"))) { S.linCol = null; renderWb(); return; }
    if ((t = e.target.closest("[data-lincol]"))) {
      var parts = t.dataset.lincol.split("|");
      if (parts[0] !== "out") { toast("Column lineage runs from the target column. Pick one on <b>" + esc(S.linView) + "</b>."); return; }
      S.linCol = S.linCol === parts[1] ? null : parts[1];
      if (S.linCol) openContributors();
      renderWb(); return;
    }
    if ((t = e.target.closest("[data-lindet]"))) { S.linDetail = t.dataset.lindet || null; S.linTab = "details"; renderWb(); return; }
    if ((t = e.target.closest("[data-lintab]"))) { S.linTab = t.dataset.lintab; renderWb(); return; }
    if ((t = e.target.closest("[data-linside]"))) {
      if (t.dataset.linside === "up") { S.linHideUp = !S.linHideUp; renderWb(); }
      else toast("Nothing downstream of a certified view here. The answers read it live.");
      return;
    }
  });
  $("#plum-back").addEventListener("click", function () { S.wbPanel = "home"; S.panel = null; renderWb(); });
  function openEvidence(id) {
    S.evAccount = id; S.panel = "evidence";
    if (S.wbPanel !== "analysis") S.wbPanel = "analysis";
    renderWb();
    var p = $("#ans-panel"); if (p) p.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  function ask(qid) {
    if (qid === "q1") {
      if (S.state.analysed) { S.wbPanel = "analysis"; S.panel = null; renderWb(); tour.after("ask-q1"); return; }
      runAnalysis();
      tour.after("ask-q1");
      return;
    }
    S.qid = qid; S.wbPanel = "conversation"; S.panel = null; S.narrate = false;
    renderWb();
  }

  /* ===================================================================== */
  /* Master catalog — the real AIDP surfaces (ui-anatomy §3.3b and §3.9).  */
  /* Oracle ships no business glossary, ontology or synonym editor: what   */
  /* it ships is auto-populated catalog metadata with a per-column         */
  /* Description a person accepts or rejects, and a column-level Lineage   */
  /* graph. Both are built here; the glossary panel that used to sit on    */
  /* this nav item is gone.                                                */
  /* ===================================================================== */
  var CAT_LC = { FUSION: "fusion_erp", JDE: "jde_e1", NETSUITE: "netsuite", DLV: "dlv_inhouse", CRM: "crm_iceberg" };
  var GOLD_CAT = "lakehouse_gold";

  /* per-view column metadata: name, type, the auto-populated Description
     (blank ones render Oracle's literal "-"), and the data type */
  var CAT_COLS = {
    REVENUE_AT_RISK: [
      ["line_id", "The stable key of one open order line, whichever system it came from.", "string"],
      ["source_system", "Which of the five mounted sources the line came from.", "string"],
      ["source_key", "The line's own key in that system: F4211.DOCO/LNID, DOO_FULFILL_LINES_ALL.FULFILL_LINE_ID or the NetSuite transactionLine id.", "string"],
      ["account_id", "The customer this line belongs to, resolved across systems by CUSTOMER_360.", "string"],
      ["item_id", "The part, resolved across the three item masters by ITEM_XREF.", "string"],
      ["promised_date", "The date the customer was promised, as it stands in the order.", "date"],
      ["predicted_date", "When the line is now expected to ship, from PROMISE_STATUS.", "date"],
      ["line_value_usd", "", "double"],
      ["penalty_usd", "Late penalty for this line, priced from the clause in the customer's contract.", "double"],
      ["cause", "Why the line is late: stock elsewhere, supplier late, credit hold or late in transit.", "string"],
      ["risk_week", "", "string"]
    ],
    STOCK_POSITION: [
      ["item_id", "The part, on the cross-referenced identifier rather than any one system's number.", "string"],
      ["source_system", "The system the balance was read from.", "string"],
      ["plant", "Plant or location holding the stock.", "string"],
      ["on_hand_qty", "Quantity on hand at that plant, net of what is already allocated.", "double"],
      ["allocated_qty", "", "double"],
      ["as_of", "Time the balance was last refreshed from its source.", "timestamp"]
    ]
  };
  function catColsFor(id) {
    if (CAT_COLS[id]) return CAT_COLS[id];
    var v = null; D.views.forEach(function (x) { if (x.id === id) v = x; });
    var cols = [];
    try { cols = D.answer("q1", "COMMERCIAL_OPS", decisions()).columns || []; } catch (e) { cols = []; }
    if (!cols.length) return [["id", (v ? v.definition : ""), "string"]];
    return cols.map(function (c, i) {
      return [String(c.key).replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase(),
        i % 4 === 3 ? "" : c.label + " as the certified view publishes it.",
        c.kind === "money" || c.kind === "score" ? "double" : c.kind === "num" ? "int" : "string"];
    });
  }

  /* ---------------- lineage graphs -------------------------------------- */
  var SRC_OBJ = { FUSION: "DOO_FULFILL_LINES_ALL", JDE: "F4211", NETSUITE: "transactionLine", DLV: "DLV_SCAN_EVENTS", CRM: "CRM_ACCOUNT" };
  var LINEAGE = {
    REVENUE_AT_RISK: {
      task: "value_and_attribute_open_lines",
      stages: [
        [
          { id: "ool", name: "OPEN_ORDER_LINES_X", type: "TABLE", cat: "lakehouse_gold", tone: "silver", cols: ["line_id", "source_system", "source_key", "account_id", "item_id", "qty"] },
          { id: "prm", name: "PROMISE_STATUS", type: "TABLE", cat: "lakehouse_gold", tone: "silver", cols: ["line_id", "promised_date", "predicted_date", "days_late"] },
          { id: "c36", name: "CUSTOMER_360", type: "TABLE", cat: "lakehouse_gold", tone: "silver", cols: ["account_id", "account_name", "match_score", "match_reason"] },
          { id: "crm", name: "CRM_ACCOUNT", type: "TABLE", cat: "crm_iceberg", tone: "bronze", cols: ["account_id", "tier", "owner", "region"] },
          { id: "sla", name: "SLA_EXPOSURE", type: "TABLE", cat: "lakehouse_gold", tone: "silver", cols: ["contract_id", "account_id", "lead_time_days", "penalty_pct_per_day", "cap_pct"] }
        ],
        [{ id: "tsk", name: "value_and_attribute_open_lines", type: "TASK", cat: "Commercial_Model", tone: "task", kind: "task" }],
        [{ id: "out", name: "REVENUE_AT_RISK", type: "TABLE", cat: "lakehouse_gold", tone: "gold", anchor: true,
          cols: ["line_id", "source_key", "account_id", "predicted_date", "line_value_usd", "penalty_usd", "cause"] }]
      ],
      edges: [["ool", "tsk"], ["prm", "tsk"], ["c36", "tsk"], ["crm", "tsk"], ["sla", "tsk"], ["tsk", "out"]],
      map: {
        line_id: [["IDENTITY", "line_id ← OPEN_ORDER_LINES_X.line_id", ["ool.line_id"]]],
        source_key: [["IDENTITY", "source_key ← F4211.DOCO/LNID, DOO_FULFILL_LINES_ALL.FULFILL_LINE_ID or transactionLine id", ["ool.source_key", "ool.source_system"]]],
        account_id: [["IDENTITY", "account_id ← CUSTOMER_360.account_id", ["c36.account_id", "crm.account_id"]]],
        predicted_date: [["IDENTITY", "predicted_date ← PROMISE_STATUS.predicted_date", ["prm.predicted_date", "prm.promised_date"]]],
        line_value_usd: [["TRANSFORMATION", "line_value_usd = qty * unit_price, translated to USD", ["ool.qty"]]],
        penalty_usd: [["TRANSFORMATION", "penalty_usd = LEAST(line_value_usd * penalty_pct_per_day * days_late, line_value_usd * cap_pct)", ["sla.penalty_pct_per_day", "sla.cap_pct", "prm.days_late"]]],
        cause: [["TRANSFORMATION", "cause = the first of stock elsewhere, supplier late, credit hold, late in transit that holds", ["prm.days_late", "ool.item_id"]]]
      }
    },
    STOCK_POSITION: {
      task: "consolidate_on_hand_across_systems",
      stages: [
        [
          { id: "inv", name: "INV_ONHAND_QUANTITIES_DETAIL", type: "TABLE", cat: "fusion_erp", tone: "bronze", cols: ["INVENTORY_ITEM_ID", "ORGANIZATION_ID", "PRIMARY_TRANSACTION_QUANTITY"] },
          { id: "f41", name: "F41021", type: "TABLE", cat: "jde_e1", tone: "bronze", cols: ["LIITM", "LIMCU", "LIPQOH"] },
          { id: "nsb", name: "inventoryBalance", type: "TABLE", cat: "netsuite", tone: "bronze", cols: ["item", "location", "quantityOnHand"] },
          { id: "xrf", name: "ITEM_XREF", type: "TABLE", cat: "lakehouse_gold", tone: "silver", cols: ["item_id", "source_system", "source_item", "score"] }
        ],
        [{ id: "tsk", name: "consolidate_on_hand_across_systems", type: "TASK", cat: "Commercial_Model", tone: "task", kind: "task" }],
        [{ id: "out", name: "STOCK_POSITION", type: "TABLE", cat: "lakehouse_gold", tone: "gold", anchor: true,
          cols: ["item_id", "source_system", "plant", "on_hand_qty", "allocated_qty", "as_of"] }]
      ],
      edges: [["inv", "tsk"], ["f41", "tsk"], ["nsb", "tsk"], ["xrf", "tsk"], ["tsk", "out"]],
      map: {
        item_id: [["IDENTITY", "item_id ← ITEM_XREF.item_id, so the same part is one part", ["xrf.item_id", "xrf.source_item"]]],
        plant: [["IDENTITY", "plant ← ORGANIZATION_ID / LIMCU / location", ["inv.ORGANIZATION_ID", "f41.LIMCU", "nsb.location"]]],
        on_hand_qty: [["AGGREGATION", "on_hand_qty = SUM(quantity on hand) per item and plant", ["inv.PRIMARY_TRANSACTION_QUANTITY", "f41.LIPQOH", "nsb.quantityOnHand"]]],
        source_system: [["IDENTITY", "source_system ← the catalog the balance was read from", ["xrf.source_system"]]]
      }
    }
  };
  function lineageFor(id) {
    if (LINEAGE[id]) return LINEAGE[id];
    var v = null; D.views.forEach(function (x) { if (x.id === id) v = x; });
    if (!v) return null;
    var srcs = (v.sources || []).map(function (sy, i) {
      var isSys = !!D.sourceById[sy];
      return { id: "s" + i, name: isSys ? (SRC_OBJ[sy] || sy) : sy, type: "TABLE",
        cat: isSys ? (CAT_LC[sy] || String(sy).toLowerCase()) : GOLD_CAT, tone: isSys ? "bronze" : "silver",
        cols: (isSys && D.sourceById[sy] ? D.sourceById[sy].objects : []).slice(0, 4) };
    });
    if (!srcs.length) srcs = [{ id: "s0", name: "GOLD", type: "TABLE", cat: GOLD_CAT, tone: "silver", cols: [] }];
    var g = {
      task: "build_" + id.toLowerCase(),
      stages: [srcs, [{ id: "tsk", name: "build_" + id.toLowerCase(), type: "TASK", cat: "Commercial_Model", tone: "task", kind: "task" }],
        [{ id: "out", name: id, type: "TABLE", cat: GOLD_CAT, tone: "gold", anchor: true, cols: catColsFor(id).slice(0, 6).map(function (c) { return c[0]; }) }]],
      edges: srcs.map(function (x) { return [x.id, "tsk"]; }).concat([["tsk", "out"]]),
      map: {}
    };
    LINEAGE[id] = g;
    return g;
  }
  function linNode(gid) {
    var g = lineageFor(S.linView), out = null;
    if (!g) return null;
    g.stages.forEach(function (st) { st.forEach(function (c) { if (c.id === gid) out = c; }); });
    return out;
  }
  function toneChip(c) {
    return '<span class="lin-cat lin-cat--' + esc(c.tone) + '">' + (c.kind === "task" ? ICON.route : ICON.stack) + esc(c.cat) + "</span>";
  }
  function linCardHtml(c, stageIdx, lastStage) {
    var g = lineageFor(S.linView);
    var open = S.linOpen.indexOf(c.id) >= 0;
    var sel = S.linCol, hits = [];
    if (sel && g.map[sel]) g.map[sel].forEach(function (m) { m[2].forEach(function (k) { hits.push(k); }); });
    var chips = (c.cols || []).map(function (col) {
      var on = c.id === "out" ? col === sel : (!sel || hits.indexOf(c.id + "." + col) >= 0);
      return '<button class="lin-chip' + (on && sel ? " is-on" : sel ? " is-off" : "") + '" type="button" data-lincol="' + esc(c.id) + '|' + esc(col) + '">' + esc(col) + "</button>";
    }).join("");
    return '<div class="lin-card' + (open ? " is-open" : "") + (c.anchor ? " is-anchor" : "") + '" data-lin="' + esc(c.id) + '">' +
      (stageIdx > 0 ? '<button class="lin-edge lin-edge--l" type="button" data-linside="up" aria-label="Collapse upstream">&minus;</button>' : '<button class="lin-edge lin-edge--l lin-edge--plus" type="button" data-linside="up" aria-label="Expand upstream">+</button>') +
      (lastStage ? '<button class="lin-edge lin-edge--r lin-edge--plus" type="button" data-linside="down" aria-label="Expand downstream">+</button>' : '<button class="lin-edge lin-edge--r" type="button" data-linside="down" aria-label="Collapse downstream">&minus;</button>') +
      (c.anchor ? '<span class="lin-anchor" title="Anchor">' + ICON.anchor + "</span>" : "") +
      '<button class="lin-head" type="button" data-lindet="' + esc(c.id) + '"><span class="lin-ico lin-ico--' + esc(c.tone) + '">' + (c.kind === "task" ? ICON.route : ICON.grid) + "</span>" +
      '<span class="lin-nm">' + esc(lc(c.name)) + "</span></button>" +
      '<div class="lin-meta"><span class="lin-type">' + esc(c.type) + '</span><i>|</i>' + toneChip(c) + "</div>" +
      (open && c.cols ? '<div class="lin-cols"><label class="lin-filter"><span class="wb-mag"></span><input type="search" placeholder="Filter" aria-label="Filter columns"></label>' +
        chips + '<a class="lin-clear' + (sel ? "" : " is-off") + '" data-linclear="1">Clear</a></div>' : "") +
      '<button class="lin-chev" type="button" data-linopen="' + esc(c.id) + '" aria-label="' + (open ? "Collapse" : "Expand") + ' columns">' + (open ? "⌃" : "⌄") + "</button></div>";
  }
  function lineageHtml() {
    var g = lineageFor(S.linView);
    if (!g) return "";
    var stages = g.stages.slice();
    if (S.linHideUp) stages = stages.slice(1);
    var sel = S.linCol, maps = (sel && g.map[sel]) || [];
    return '<div class="lin" id="lin">' +
      '<div class="lin-bar"><span class="lin-title">Lineage for <span class="lin-ico lin-ico--gold sm">' + ICON.grid + "</span><b>" + esc(GOLD_CAT + "." + lc(S.linView)) + "</b></span>" +
      '<label class="lin-find"><span class="wb-mag"></span><input type="search" placeholder="Find" aria-label="Find an artifact"></label>' +
      '<span class="lin-icons"><i>' + ICON.sliders + '</i><i class="dots">&middot;&middot;&middot;</i><i>' + ICON.shrink + "</i><i>" + ICON.expand + "</i>" +
      '<button class="lin-x" type="button" id="lin-close" aria-label="Close lineage">&times;</button></span></div>' +
      '<div class="lin-filters"><button class="lin-funnel" type="button" aria-label="Hide filters">' + ICON.funnel + "</button>" +
      ["All Catalogs", "All Schemas", "All Volumes", "All Workspaces"].map(function (f) { return '<span class="lin-sel">' + esc(f) + ICON.chevd + "</span>"; }).join("") +
      '<span class="lin-sel is-dis">All Columns' + ICON.chevd + "</span><span class=\"lin-clearx\">&times;</span>" +
      '<span class="lin-right"><span class="lin-modes"><i>&#8644;</i><i class="is-on">&#10021;</i><i>&#8646;</i></span><span class="lin-anch">&#9875;</span><span class="lin-sel">70′' + ICON.chevd + "</span></span></div>" +
      '<div class="lin-canvas" id="lin-canvas"><svg class="lin-edges" id="lin-edges" aria-hidden="true"><defs><marker id="linarr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L7 4 L0 7 z" fill="#3f7f96"/></marker></defs></svg>' +
      stages.map(function (st, i) {
        return '<div class="lin-stage">' + st.map(function (c) { return linCardHtml(c, S.linHideUp ? i + 1 : i, i === stages.length - 1); }).join("") + "</div>";
      }).join("") + "</div>" +
      (sel ? '<div class="lin-maps"><b>Column lineage &middot; ' + esc(sel) + "</b>" + maps.map(function (m) {
        return '<div class="lin-map"><span class="lin-kind lin-kind--' + m[0].toLowerCase() + '">' + esc(m[0]) + '</span><code>' + esc(m[1]) + "</code></div>";
      }).join("") + (maps.length ? "" : '<div class="lin-map"><span class="lin-kind lin-kind--identity">IDENTITY</span><code>' + esc(sel) + " ← the source column of the same name</code></div>") + "</div>" : "") +
      (S.linDetail ? linDetailHtml() : "") + "</div>";
  }
  function linUpDown(gid) {
    var g = lineageFor(S.linView), up = 0, down = 0, seen = {};
    function walk(id, dir, depth) {
      g.edges.forEach(function (e) {
        var nxt = dir < 0 ? (e[1] === id ? e[0] : null) : (e[0] === id ? e[1] : null);
        if (!nxt || seen[dir + nxt]) return;
        seen[dir + nxt] = depth;
        if (dir < 0) up++; else down++;
        walk(nxt, dir, depth + 1);
      });
    }
    walk(gid, -1, 1); walk(gid, 1, 1);
    return { up: up, down: down, depths: seen };
  }
  function linDetailHtml() {
    var c = linNode(S.linDetail);
    if (!c) return "";
    var g = lineageFor(S.linView), ud = linUpDown(c.id);
    var cols = c.id === "out" ? catColsFor(S.linView) : (c.cols || []).map(function (x) { return [x, "", "string"]; });
    var rows = [];
    Object.keys(ud.depths).forEach(function (k) {
      var dir = k.charAt(0) === "-" ? "up" : "down", gid = k.replace(/^-?1/, "");
      var n = linNode(gid); if (!n) return;
      rows.push({ name: n.name, type: n.kind === "task" ? "Task" : "Table", dir: dir, depth: ud.depths[k] });
    });
    rows.sort(function (a, b) { return a.dir === b.dir ? a.depth - b.depth : (a.dir === "up" ? -1 : 1); });
    return '<div class="lin-det" id="lin-det"><div class="lin-det-h"><span class="lin-ico lin-ico--' + esc(c.tone) + ' sm">' + (c.kind === "task" ? ICON.route : ICON.grid) + "</span>" +
      "<b>" + esc(lc(c.name)) + '</b><span class="lin-type">' + esc(c.type) + "</span><i>|</i>" + toneChip(c) +
      '<span class="lin-ud">&uarr; ' + ud.up + " &darr; " + ud.down + "</span>" +
      '<span class="lin-right"><span>' + ICON.expand + '</span><button class="lin-x" type="button" data-lindet="" aria-label="Close details">&times;</button></span></div>' +
      '<div class="lin-det-tabs"><button type="button" class="' + (S.linTab === "details" ? "is-on" : "") + '" data-lintab="details">Details</button>' +
      '<button type="button" class="' + (S.linTab === "impact" ? "is-on" : "") + '" data-lintab="impact">Impact analysis</button></div>' +
      (S.linTab === "impact"
        ? '<div class="lin-det-b"><p class="lin-help">Use the controls below to determine the upstream and downstream impact of the current artifact.</p>' +
          '<div class="lin-ctrl"><label class="lin-filter"><span class="wb-mag"></span><input type="search" placeholder="Filter" aria-label="Filter artifacts"></label>' +
          '<span class="lin-sel">All artifact types<i class="tri"></i></span><span class="lin-seg"><b>Upstream</b><b>Downstream</b></span><span class="lin-exp">&#8599;</span></div>' +
          '<div class="lin-sec">All upstream &amp; downstream lineage</div>' +
          '<table class="wb-tbl lin-imp"><thead><tr><th>Artifact name' + SORTC + "</th><th>Type" + SORTC + "</th><th>Direction" + SORTC + "</th><th>Depth" + SORTC + "</th></tr></thead><tbody>" +
          rows.map(function (r) {
            return "<tr><td>" + esc(lc(r.name)) + "</td><td>" + esc(r.type) + '</td><td><span class="lin-dir">' + (r.dir === "up" ? "&uarr; upstream" : "&darr; downstream") + "</span></td><td>" + r.depth + "</td></tr>";
          }).join("") + "</tbody></table></div>"
        : '<div class="lin-det-b lin-det-b--2"><div><div class="lin-lab">Description</div>' +
          '<p class="lin-desc">' + esc(c.id === "out" ? (D.views.filter(function (v) { return v.id === S.linView; })[0] || {}).definition || "" : c.kind === "task" ? "Resolves, maps and translates the mounted sources into the certified view." : "Source object mounted from " + c.cat + ".") + "</p>" +
          '<div class="lin-lab">Table Details</div><dl class="lin-kv">' +
          "<dt>Last updated</dt><dd>Tue, Oct 6, 2026 at 09:44:12 EET</dd>" +
          "<dt>Column count</dt><dd>" + cols.length + "</dd>" +
          "<dt>Format</dt><dd>" + (c.tone === "gold" ? "Delta" : c.kind === "task" ? "Notebook job" : "Parquet") + "</dd>" +
          "<dt>Catalog</dt><dd>" + esc(c.cat) + "</dd>" +
          '<dt>Asset link</dt><dd><a class="lin-link">Open &#8599;</a></dd></dl></div>' +
          '<div><div class="lin-ctrl"><label class="lin-filter"><span class="wb-mag"></span><input type="search" placeholder="Filter" aria-label="Filter columns"></label>' +
          '<span class="lin-sel">All data types' + ICON.chevd + "</span></div>" +
          '<table class="wb-tbl"><thead><tr><th>Column name' + SORTC + '</th><th style="width:120px">Type' + SORTC + "</th></tr></thead><tbody>" +
          cols.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + esc(x[2] || "string") + "</td></tr>"; }).join("") +
          "</tbody></table></div></div>") + "</div>";
  }
  /* steel-blue curved connectors, drawn after layout */
  function drawLineage() {
    var cv = $("#lin-canvas"), svg = $("#lin-edges");
    if (!cv || !svg) return;
    var g = lineageFor(S.linView), base = cv.getBoundingClientRect();
    svg.setAttribute("viewBox", "0 0 " + cv.scrollWidth + " " + cv.scrollHeight);
    svg.setAttribute("width", cv.scrollWidth); svg.setAttribute("height", cv.scrollHeight);
    /* the global `svg { width:16px }` rule would shrink this to an icon */
    svg.style.width = cv.scrollWidth + "px"; svg.style.height = cv.scrollHeight + "px";
    var defs = svg.querySelector("defs"), paths = "";
    function box(id) { var el = cv.querySelector('.lin-card[data-lin="' + id + '"]'); if (!el) return null; var r = el.getBoundingClientRect(); return { x: r.left - base.left + cv.scrollLeft, y: r.top - base.top + cv.scrollTop, w: r.width, h: r.height }; }
    function chip(id, col) {
      var el = cv.querySelector('.lin-chip[data-lincol="' + id + "|" + col + '"]');
      if (!el) return null; var r = el.getBoundingClientRect();
      return { x: r.left - base.left + cv.scrollLeft, y: r.top - base.top + cv.scrollTop, w: r.width, h: r.height };
    }
    function curve(x1, y1, x2, y2, cls) {
      var dx = Math.max(24, (x2 - x1) * 0.5);
      paths += '<path class="' + cls + '" d="M' + x1 + " " + y1 + " C" + (x1 + dx) + " " + y1 + " " + (x2 - dx) + " " + y2 + " " + x2 + " " + y2 + '" marker-end="url(#linarr)"/>';
    }
    g.edges.forEach(function (e) {
      var a = box(e[0]), b = box(e[1]);
      if (!a || !b) return;
      curve(a.x + a.w, a.y + Math.min(34, a.h / 2), b.x - 1, b.y + Math.min(34, b.h / 2), "lin-e");
    });
    var sel = S.linCol;
    if (sel && g.map[sel]) {
      var tb = box("tsk"), tgt = chip("out", sel);
      g.map[sel].forEach(function (m) {
        m[2].forEach(function (k) {
          var parts = k.split("."), c = chip(parts[0], parts[1]);
          if (c && tb) curve(c.x + c.w, c.y + c.h / 2, tb.x - 1, tb.y + Math.min(34, tb.h / 2), "lin-e lin-e--col");
        });
      });
      if (tb && tgt) curve(tb.x + tb.w, tb.y + Math.min(34, tb.h / 2), tgt.x - 1, tgt.y + tgt.h / 2, "lin-e lin-e--col");
    }
    svg.innerHTML = (defs ? defs.outerHTML : "") + paths;
  }
  /* expand exactly the upstream cards that feed the highlighted column, so the
     graph stays inside the canvas instead of scrolling the anchor off-screen */
  function openContributors() {
    var g = lineageFor(S.linView), m = g.map[S.linCol];
    S.linOpen = ["out"];
    if (!m) return;
    m.forEach(function (x) {
      x[2].forEach(function (k) {
        var cid = k.split(".")[0];
        if (S.linOpen.indexOf(cid) < 0) S.linOpen.push(cid);
      });
    });
  }
  function openLineage(viewId) {
    if (S.wbPanel !== "lineage") S.linFrom = S.wbPanel;
    S.linView = String(viewId).replace(/^GOLD\./, "");
    S.linOpen = ["out"]; S.linCol = null; S.linDetail = null; S.linTab = "details"; S.linHideUp = false;
    setApp("aidp");
    S.wbPanel = "lineage";
    renderWb();
  }

  /* ---------------- Master catalog: the entity page ---------------------- */
  /* Oracle names every catalog object in lowercase_snake_case */
  function lc(id) { return String(id).toLowerCase(); }
  function mcatalogHtml() {
    var id = S.mcEntity, cols = catColsFor(id);
    var v = D.views.filter(function (x) { return x.id === id; })[0] || D.views[0];
    var heads = [["", 26, 0, 1], ["Column name", 0, 1], ["Type", 96, 1], ["Description", "44%", 1], ["Data type", 100], ["", 34]];
    return '<div class="mc">' +
      '<div class="mc-crumb"><a>Master catalog</a> <i>&rsaquo;</i> <a>' + GOLD_CAT + "</a> <i>&rsaquo;</i> <a>GOLD</a> <i>&rsaquo;</i> <a>Tables</a> <i>&rsaquo;</i> <b>" + esc(lc(id)) + "</b></div>" +
      '<div class="mc-cols"><aside class="mc-tree"><div class="mc-treetop"><label class="lin-filter"><span class="wb-mag"></span><input type="search" placeholder="Filter" aria-label="Filter catalogs"></label>' +
      '<span class="mc-rf">' + ICON.refresh + "</span></div>" +
      '<div class="mc-root">' + ICON.ledger + 'Master catalog<span class="mc-live">Default Cluster (Active)</span></div>' +
      '<div class="mc-cat is-open"><span class="mc-tri mc-tri--open"></span>' + ICON.book + GOLD_CAT + "</div>" +
      D.views.map(function (x) { return '<button class="mc-ent' + (x.id === id ? " is-on" : "") + '" type="button" data-mcent="' + esc(x.id) + '">' + ICON.grid + esc(lc(x.id)) + "</button>"; }).join("") +
      D.sources.map(function (sc) { return '<div class="mc-cat"><span class="mc-tri"></span>' + ICON.book + esc(CAT_LC[sc.id] || lc(sc.id)) + "</div>"; }).join("") +
      "</aside>" +
      '<div class="mc-main"><div class="mc-head"><span class="lin-ico lin-ico--gold sm">' + ICON.grid + "</span><h1>" + esc(lc(id)) + "</h1>" +
      '<div class="mc-act"><button class="wb-btn" type="button" id="mc-actions">Actions ' + ICON.chevd + "</button>" +
      (S.mcMenu ? '<div class="mc-menu"><button type="button" data-mclin="' + esc(id) + '">' + ICON.route + "Lineage</button>" +
        '<button type="button" data-mcdet="1">' + ICON.info + "View Details</button>" +
        '<button type="button" data-mcanch="1">' + ICON.star + "Set as Anchor</button></div>" : "") + "</div></div>" +
      '<div class="mc-sub">Table created by Metadata Extractor</div>' +
      '<div class="mc-tabs"><button type="button" class="is-on">Columns</button><button type="button">Details</button><button type="button">Permissions</button></div>' +
      '<div class="mc-tools"><label class="lin-filter"><span class="wb-mag"></span><input type="search" placeholder="Filter" aria-label="Filter columns"></label><span class="mc-plus">+</span></div>' +
      '<table class="wb-tbl mc-grid"><thead><tr>' + heads.map(function (h) {
        return '<th' + (h[1] ? ' style="width:' + (typeof h[1] === "number" ? h[1] + "px" : h[1]) + '"' : "") + ">" +
          (h[0] ? esc(h[0]) + (h[2] ? SORTC : "") : (h[3] ? '<span class="mc-box"></span>' : "")) + "</th>";
      }).join("") + "</tr></thead><tbody>" +
      cols.map(function (c) {
        return '<tr><td><span class="mc-box"></span></td><td>' + esc(c[0]) + "</td><td>Column</td><td>" +
          (c[1] ? '<span class="mc-desc">' + esc(c[1]) + "</span>" : '<span class="mc-dash">-</span>') + "</td><td>" + esc(c[2]) + '</td><td><span class="mc-dots">&middot;&middot;&middot;</span></td></tr>';
      }).join("") + "</tbody></table>" +
      '<p class="honest">' + esc(v.definition) + " The agent reads this column metadata to match your words to columns.</p>" +
      "</div></div></div>";
  }
  /* ---------------- Auto-populate catalog: the accept/reject queue ------- */
  /* Oracle ships the extractor LIST and the extractor PAGE as two destinations.
     The breadcrumb's first crumb goes back to the list; the name opens the page. */
  function apcHtml() {
    return S.apcView === "list" ? apcListHtml() : apcDetailHtml();
  }
  function apcListHtml() {
    var heads = ["Name", "Catalog", "Status", "Entity Lifecycle", "Compute", "Start time", "Created By"];
    var w = [0, 150, 110, 130, 130, 200, 130];
    return '<div class="mc"><div class="mc-crumb"><b>Auto-populate catalog</b></div>' +
      '<div class="wb-pg"><h1>' + ICON.tag + 'Auto-populate catalog</h1><div class="sub">Create a metadata to auto populate catalog with content.</div>' +
      '<div class="mc-tools"><label class="lin-filter"><span class="wb-mag"></span><input type="search" placeholder="Filter" aria-label="Filter extractors"></label>' +
      '<span class="mc-plus">+</span><span class="mc-trash">' + ICON.trash + "</span>" +
      '<span class="lin-sel">Catalog: All' + ICON.chevd + '</span><span class="lin-sel">Status: All' + ICON.chevd + '</span><span class="lin-sel">Entity Lifecycle: All' + ICON.chevd + "</span>" +
      '<span class="lin-right"><button class="btn btn--dark btn--sm" type="button" data-apccreate="1">Create</button></span></div>' +
      '<div class="tw"><table class="wb-tbl"><thead><tr><th style="width:26px"><span class="mc-box"></span></th>' + heads.map(function (h, i) {
        return '<th' + (w[i] ? ' style="width:' + w[i] + 'px"' : "") + ">" + h + (i < 6 ? SORTC : "") + "</th>";
      }).join("") + "</tr></thead><tbody>" +
      '<tr><td><span class="mc-box"></span></td><td><a class="mc-link" data-apcopen="1">Commercial model extractor</a></td><td>' + GOLD_CAT + '</td><td><span class="apc-dot"></span>Succeeded</td><td>Auto</td><td>Norwell_Cluster</td><td>Tue, Oct 6, 2026 at 09:44</td><td>Priya Natarajan</td></tr>' +
      "</tbody></table></div>" +
      '<p class="honest">Open it to see which entities a person accepted or rejected.</p></div></div>';
  }
  var APC_ROWS = [
    ["doo_fulfill_lines_all", "Success", "Accepted", "/fusion-erp/doo-fulfill-lines-all", "fusion_erp"],
    ["inv_onhand_quantities_detail", "Success", "Accepted", "/fusion-erp/inv-onhand-quantities-detail", "fusion_erp"],
    ["okc_k_articles_b", "Success", "Accepted", "/fusion-erp/okc-k-articles-b", "fusion_erp"],
    ["f4211", "Success", "Accepted", "/jde-e1/f4211", "jde_e1"],
    ["f41021", "Success", "Accepted", "/jde-e1/f41021", "jde_e1"],
    ["f4104", "Success", "Accepted", "/jde-e1/f4104", "jde_e1"],
    ["transaction_line", "Success", "Accepted", "/netsuite/transaction-line", "netsuite"],
    ["inventory_balance", "Success", "Accepted", "/netsuite/inventory-balance", "netsuite"],
    ["dlv_scan_events", "Success", "Accepted", "/dlv-inhouse/dlv-scan-events", "dlv_inhouse"],
    ["crm_account", "Success", "Accepted", "/crm-iceberg/crm-account", "crm_iceberg"],
    ["crm_lead", "Success", "Rejected", "/crm-iceberg/crm-lead", "crm_iceberg"],
    ["ns_employee", "Success", "Rejected", "/netsuite/employee", "netsuite"]
  ];
  function apcDetailHtml() {
    return '<div class="mc">' +
      '<div class="mc-crumb"><a data-apclist="1">Auto-populate catalog</a> <i>&rsaquo;</i> <b>Commercial model extractor</b></div>' +
      '<div class="wb-pg"><div class="mc-head"><span class="apc-tag">' + ICON.tag + '</span><h1>Commercial model extractor</h1></div><div class="mc-sub mc-sub--i">No description</div>' +
      '<div class="mc-tabs"><button type="button">Details</button><button type="button" class="is-on">Reviewed entities</button></div>' +
      '<div class="mc-tools mc-tools--wide"><label class="lin-filter"><span class="wb-mag"></span><input type="search" placeholder="Filter" aria-label="Filter entities"></label></div>' +
      '<p class="lin-help lin-help--dark">The following entities have been accepted or rejected.</p>' +
      '<div class="tw"><table class="wb-tbl"><thead><tr><th>Table (select to view table columns and details)</th><th style="width:120px">Status</th><th style="width:120px">Acceptance</th><th style="width:250px">Path</th><th style="width:130px">Schema</th><th style="width:34px"></th></tr></thead><tbody>' +
      APC_ROWS.map(function (r) {
        return '<tr><td><a class="mc-link">' + esc(r[0]) + '</a></td><td><span class="apc-dot"></span>' + esc(r[1]) + '</td><td><span class="apc-plain">' + esc(r[2]) + "</span></td><td>" + esc(r[3]) + "</td><td>" + esc(r[4]) + '</td><td><span class="mc-dots">&middot;&middot;&middot;</span></td></tr>';
      }).join("") + "</tbody></table></div>" +
      '<p class="honest">Twelve proposed, ten accepted. The rejected two never reach a certified view.</p></div></div>';
  }

  function auditHtml() {
    var mine = (D.audit || []).map(function (a) {
      return { time: a.time || a.at || "—", user: a.user || "—", role: a.role || "—",
        text: a.text || a.what || a.question || "—", sqlHash: a.sqlHash || "—",
        rows: a.rows === undefined || a.rows === null ? "—" : a.rows, status: a.status || "allowed" };
    });
    var h = [["Time", 110], ["User", 140], ["Role", 120], ["Question", 0], ["Statement", 150], ["Rows", 70], ["Result", 90]];
    return '<div class="mc"><div class="mc-crumb"><b>Audit logs</b></div>' +
      '<div class="wb-pg"><h1>' + ICON.auditlog + 'Audit logs</h1><div class="sub">Every question anyone asked, and what the database did with it</div>' +
      '<div class="tw"><table class="wb-tbl"><thead><tr>' + h.map(function (c) {
        return '<th' + (c[1] ? ' style="width:' + c[1] + 'px"' : "") + (c[0] === "Rows" ? ' class="r"' : "") + ">" + c[0] + SORTC + "</th>";
      }).join("") + "</tr></thead><tbody>" +
      mine.map(function (a) {
        return "<tr><td>" + esc(a.time) + "</td><td>" + esc(a.user) + "</td><td>" + esc(a.role) + "</td><td>" + esc(a.text) + '</td><td><span class="mono">' + esc(a.sqlHash) + '</span></td><td style="text-align:right">' + esc(a.rows) + '</td><td><span class="stat stat--' + (a.status === "blocked" ? "open" : "auto") + '">' + esc(a.status) + "</span></td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<p class="honest">SQL Firewall refused the statement before it reached any data.</p></div></div>';
  }

  /* ===================================================================== */
  /* 3. DECISIONS — review & act (Redwood app)                             */
  /* ===================================================================== */
  var DECIDED_AT = (D.haldenDecision && D.haldenDecision.at) || "Tue 6 Oct 2026 · 09:52";
  function keyAccountId() { return (D.haldenDecision && D.haldenDecision.accountId) || (analysis().accounts[0] || {}).id; }
  function keyActionId() {
    var id = keyAccountId(), out = "A1";
    analysis().accounts.forEach(function (a) { if (a.id === id && a.recommendation && a.recommendation.actionId) out = a.recommendation.actionId; });
    if (D.haldenDecision && D.haldenDecision.actionId) out = D.haldenDecision.actionId;
    return out;
  }
  function renderBand() {
    if (!S.state.analysed) {
      $("#rw-band").innerHTML = '<div class="band-head"><span class="eyebrow">Per system &rarr; across systems</span></div>' +
        '<div class="empty">Nothing yet. The agent has not run this morning.</div>';
      return;
    }
    $("#rw-band").innerHTML = bandHtml(analysis(), "rw-band-tiles", S.movedBand);
  }
  function renderRwState() {
    var el = $("#rw-state");
    if (!S.state.analysed) { el.className = "rw-state is-stale"; el.innerHTML = '<span class="dot"></span>Waiting on the agent'; return; }
    if (S.pending.length) { el.className = "rw-state is-stale"; el.innerHTML = '<span class="dot"></span>' + S.pending.length + " decision" + (S.pending.length === 1 ? "" : "s") + " not yet in the numbers"; return; }
    var an = analysis();
    el.className = "rw-state"; el.innerHTML = '<span class="dot"></span>' + an.headline.lines + " lines at risk &middot; " + usdShort(an.headline.revenueUsd);
  }
  var RW_TITLES = {
    recommendations: ["Recommendations", "What the AI proposes, what you decide."],
    matches: ["Customer matches", "Pairs the AI could not settle, waiting for the steward."],
    xrefs: ["Item cross-references", "The same part under three numbers, waiting for the steward."],
    decisions: ["Decisions log", "Who decided, when, why, and the rule it left behind."]
  };
  function renderRwTitle() {
    var t = RW_TITLES[S.rwTab] || RW_TITLES.recommendations;
    $("#rw-crumb-leaf").textContent = t[0];
    $("#rw-h2").textContent = t[0];
    $("#rw-sub").textContent = t[1];
  }
  function renderRwTabs() {
    var an = S.state.analysed ? analysis() : null;
    var tabs = [
      ["recommendations", "Recommendations", an ? an.actions.length + " proposed" : "none yet"],
      ["matches", "Customer matches", (D.matches || []).length + " to review"],
      ["xrefs", "Item cross-references", (D.itemXrefs || []).length + " to review"],
      ["decisions", "Decisions log", ((D.decisions || []).length + S.log.length + S.pending.length) + " decisions"]
    ];
    $("#rw-tabs").innerHTML = tabs.map(function (t) {
      return '<button class="rw-tab' + (S.rwTab === t[0] ? " is-on" : "") + '" type="button" role="tab" aria-selected="' + (S.rwTab === t[0]) + '" data-tab="' + t[0] + '">' + esc(t[1]) + "<i>" + esc(t[2]) + "</i></button>";
    }).join("");
  }
  function pendingFor(accId) { return S.pending.filter(function (p) { return p.decision.accountId === accId; })[0]; }
  /* How many of this account's lines the AI valued — not how many lines it has.
     After a decline and a re-analysis every line's live `atRisk` is false, so
     count `wasAtRisk` instead; the account keeps its own four lines rather than
     picking up the on-track ones that only prove it lives in two systems. */
  function atRiskCount(e) {
    if (!e) return 0;
    if (typeof e.atRiskCount === "number") return e.atRiskCount;
    return (e.lines || []).filter(function (l) { return l.wasAtRisk === undefined ? l.atRisk !== false : !!l.wasAtRisk; }).length;
  }
  function accRowHtml(acc, an) {
    var pend = pendingFor(acc.id);
    var gone = acc.status && acc.status !== "at-risk";
    var done = gone || !!pend;
    var e = D.evidence(acc.id, S.role, decisions());
    var showLines = gone ? (acc.wasLines || acc.lines) : acc.lines;
    var showUsd = gone ? (acc.wasUsd || acc.usd) : acc.usd;
    var showPen = gone ? (acc.wasPenaltyUsd || acc.penaltyUsd) : acc.penaltyUsd;
    var suggested = acc.id === keyAccountId() ? ((D.haldenDecision && D.haldenDecision.reason) || "") : "";
    return '<div class="reca' + (done ? " is-decided" : "") + '" data-acct="' + esc(acc.id) + '">' +
      '<div class="reca-h"><b>' + esc(acc.name) + '</b><span class="tierb tierb--' + esc(acc.tier) + '">tier ' + esc(acc.tier) + "</span>" +
      '<span class="reca-sys">' + ((acc.riskSystems && acc.riskSystems.length ? acc.riskSystems : acc.systems) || []).map(sysBadge).join("") + "</span>" +
      '<span class="reca-n">' + showLines + " lines</span><span class=\"reca-v\">" + (gone ? "<s>" + esc(usdShort(showUsd)) + "</s>" : esc(usdShort(showUsd))) + "</span>" +
      '<span class="reca-p">penalty ' + esc(usdShort(showPen)) + "</span></div>" +
      '<div class="reca-b"><span class="reca-why">' + esc(acc.causeLabel || "") +
      (acc.recommendation && acc.recommendation.text ? " &middot; " + esc(acc.recommendation.text) : "") + "</span></div>" +
      '<div class="reca-ev">' + ICON.info + '<span><span class="ev-t">What the AI has to go on</span>' +
      esc(atRiskCount(e)) + " line" + (atRiskCount(e) === 1 ? "" : "s") + " at risk in " +
      esc((((acc.riskSystems && acc.riskSystems.length ? acc.riskSystems : acc.systems) || []).map(function (x) { return D.sourceById[x] ? D.sourceById[x].short : x; }).join(" and ")) || "the order book") + ". " +
      ((e.stockElsewhere && e.stockElsewhere.length) ? "The same part is on hand in " + esc(e.stockElsewhere[0].plant) + ". " : "") +
      (e.supplierDelay ? "Purchase order " + esc(e.supplierDelay.key) + " is " + esc(e.supplierDelay.daysLate) + " days late. " : "") +
      (e.creditHold ? "Held for credit since " + esc(e.creditHold.placedLabel || e.creditHold.placedOn) + ". " : "") +
      (e.transit ? "Carrier ETA " + esc(e.transit.etaLabel || e.transit.eta) + ". " : "") +
      '<button class="lnk" type="button" data-evgo="' + esc(acc.id) + '">Open the full evidence</button></span></div>' +
      (done
        ? '<div class="rule-line">' + ICON.check + "<span>" + (pend
          ? "Declined by " + esc(pend.decision.by) + ", &ldquo;" + esc(pend.decision.reason) + "&rdquo;. Re-analyse to put it into the numbers."
          : esc(acc.statusLabel || "Decided") + ", " + (acc.decision ? "&ldquo;" + esc(acc.decision.reason) + "&rdquo;, " : "") + "already out of the numbers.") + "</span></div>"
        : '<div class="prop-acts"><input type="text" id="rreason-' + esc(acc.id) + '" placeholder="Why? (kept with the decision)" value="' + esc(suggested) + '" aria-label="Reason for the decision">' +
          '<button class="btn" type="button" data-rec="accept" data-acct="' + esc(acc.id) + '">' + ICON.check + "Accept</button>" +
          '<button class="btn" type="button" data-rec="decline" data-acct="' + esc(acc.id) + '">' + ICON.x + "Decline</button></div>") +
      "</div>";
  }
  function recHtml(a, an) {
    var open = S.openRec === a.id;
    var mine = an.accounts.filter(function (x) { return (a.accountIds || []).indexOf(x.id) >= 0 && x.causeId === a.causeId; });
    var decided = (an.decided || []).filter(function (x) { return x.recommendation && x.recommendation.actionId === a.id; })
      .concat((an.decided || []).filter(function (x) { return x.causeId === a.causeId && (!x.recommendation || !x.recommendation.actionId); }));
    var seen = {}, accs = decided.concat(mine).filter(function (x) { if (seen[x.id]) return false; seen[x.id] = 1; return true; });
    return '<div class="prop' + (open ? " is-open" : "") + '" data-rec-card="' + esc(a.id) + '">' +
      '<button class="rec-head" type="button" data-openrec="' + esc(a.id) + '" aria-expanded="' + open + '">' +
      '<span class="act-id">' + esc(a.id) + "</span>" +
      '<span class="rec-t"><span class="nm">' + esc(a.title) + '</span><span class="meta">' + esc(a.owner) + " &middot; " + (a.accounts || accs.length) + " accounts &middot; " + a.lines + " lines &middot; " + esc(a.taskLabel || (a.tasks + " tasks")) + "</span></span>" +
      '<span class="rec-v">' + esc(usdShort(a.usd)) + '<span>at risk</span></span>' +
      '<span class="stat stat--pending">' + esc(a.status) + "</span>" +
      '<span class="prop-chev">' + ICON.chev + "</span></button>" +
      '<div class="prop-body">' + (accs.length ? accs.slice(0, 6).map(function (x) { return accRowHtml(x, an); }).join("") : '<div class="empty">Nothing left under this one.</div>') +
      '<p class="honest">' + Math.min(6, accs.length) + " of the " + (a.accounts || accs.length) +
      " accounts under this recommendation, ranked by exposure.</p></div></div>";
  }
  function matchHtml(m) {
    var a = m.records[0], b = m.records[1], dec = S.matchLog[m.id];
    return '<div class="prop' + (dec ? " is-decided" : "") + '" data-prop="' + esc(m.id) + '">' +
      '<div class="prop-head" style="cursor:default">' +
      '<span class="rec"><span class="nm">' + esc(a.name) + '</span><span class="meta">' + sysBadge(a.sys) + "<code>" + esc(a.object) + " " + esc(a.key) + "</code>" + (a.city ? " &middot; " + esc(a.city) : "") + "</span></span>" +
      '<span class="prop-vs">vs</span>' +
      '<span class="rec"><span class="nm">' + esc(b.name) + '</span><span class="meta">' + sysBadge(b.sys) + "<code>" + esc(b.object) + " " + esc(b.key) + "</code>" + (b.city ? " &middot; " + esc(b.city) : "") + "</span></span>" +
      '<span class="prop-score"><b>' + Number(m.score).toFixed(2) + "</b><span>score</span></span>" +
      '<span class="prop-spend">' + esc(m.basis || "") + "</span><span></span></div>" +
      '<div class="prop-body" style="display:block;border-top:1px solid var(--rw-line)">' +
      '<div class="ev">' + (m.evidence || []).map(function (c) {
        return '<span class="evc ' + (c.ok === true ? "evc--y" : c.ok === false ? "evc--n" : "evc--o") + '">' + esc(c.k) + " " + esc(c.v) + "</span>";
      }).join("") + '<span class="evc evc--o">score ' + Number(m.score).toFixed(2) + "</span></div>" +
      '<div class="prop-note"><b>' + esc(m.proposal || "") + ".</b>" + (m.note ? " " + esc(m.note) : "") + "</div>" +
      (dec
        ? '<div class="rule-line">' + ICON.check + "<span>" + esc(dec.action === "reject" ? "Kept apart" : "Confirmed as one customer") + " by " + esc(dec.by) + ", &ldquo;" + esc(dec.reason) + "&rdquo;." + (dec.rule ? " Rule kept: &ldquo;" + esc(dec.rule) + "&rdquo;." : "") + "</span></div>"
        : '<div class="prop-acts"><input type="text" id="mreason-' + esc(m.id) + '" placeholder="Why? (kept with the decision)" aria-label="Reason for the decision">' +
          '<button class="btn" type="button" data-mdec="confirm" data-mid="' + esc(m.id) + '">' + ICON.check + "Same customer</button>" +
          '<button class="btn" type="button" data-mdec="reject" data-mid="' + esc(m.id) + '">' + ICON.x + "Not the same</button></div>") +
      "</div></div>";
  }
  function xrefHtml(x) {
    var dec = S.matchLog[x.id], c = x.candidate || {}, g = x.against || {};
    return '<div class="prop' + (dec ? " is-decided" : "") + '" data-prop="' + esc(x.id) + '">' +
      '<div class="prop-head" style="cursor:default">' +
      '<span class="rec"><span class="nm">' + esc(c.key || "") + '</span><span class="meta">' + sysBadge(c.sys) + "<code>" + esc(c.object || "") + "</code> &middot; " + esc(c.uom || "") + "</span></span>" +
      '<span class="prop-vs">=?</span>' +
      '<span class="rec"><span class="nm">' + esc(g.key || "") + '</span><span class="meta">' + sysBadge(g.sys) + "<code>" + esc(g.object || "") + "</code> &middot; " + esc(g.uom || "") + "</span></span>" +
      '<span class="prop-score"><b>' + Number(x.score).toFixed(2) + "</b><span>score</span></span>" +
      '<span class="prop-spend">' + esc(x.itemId || "") + "<br>" + esc(x.description || "") + "</span><span></span></div>" +
      '<div class="prop-body" style="display:block;border-top:1px solid var(--rw-line)">' +
      '<div class="ev">' + (x.evidence || []).map(function (c2) {
        return '<span class="evc ' + (c2.ok === true ? "evc--y" : c2.ok === false ? "evc--n" : "evc--o") + '">' + esc(c2.k) + " " + esc(c2.v) + "</span>";
      }).join("") + "</div>" +
      '<div class="prop-note">' + esc(x.note || "") + "</div>" +
      (dec
        ? '<div class="rule-line">' + ICON.check + "<span>" + esc(dec.action === "reject" ? "Kept apart" : "Confirmed as one part") + " by " + esc(dec.by) + ".</span></div>"
        : '<div class="prop-acts"><input type="text" id="mreason-' + esc(x.id) + '" placeholder="Why? (kept with the decision)" aria-label="Reason for the decision">' +
          '<button class="btn" type="button" data-mdec="confirm" data-mid="' + esc(x.id) + '">' + ICON.check + "Same part</button>" +
          '<button class="btn" type="button" data-mdec="reject" data-mid="' + esc(x.id) + '">' + ICON.x + "Not the same</button></div>") +
      "</div></div>";
  }
  var RW_FILTER = '<label class="rw-filter"><span class="wb-mag"></span><input type="text" placeholder="Filter" aria-label="Filter this list"></label>';
  function renderRwPanel() {
    var el = $("#rw-panel");
    if (S.rwTab === "recommendations") {
      if (!S.state.analysed) { el.innerHTML = '<div class="empty">The agent has not run this morning.<br>Open <b>Agent Hub</b> and ask what is at risk.</div>'; return; }
      var an = analysis();
      el.innerHTML = '<div class="rw-tools"><span>The AI proposes <b>' + an.actions.length + "</b> actions over " + an.headline.lines + " lines. Each one becomes a task.</span>" +
        '<span class="grow"></span><span>' + (S.pending.length ? "Re-analyse to put " + S.pending.length + " decision" + (S.pending.length === 1 ? "" : "s") + " into the numbers" : "Nothing waiting") + "</span></div>" +
        RW_FILTER + an.actions.map(function (a) { return recHtml(a, an); }).join("");
      return;
    }
    if (S.rwTab === "matches") {
      el.innerHTML = '<div class="rw-tools"><span>The AI matched customers across the CRM, Fusion, JD Edwards and NetSuite. These pairs scored too low to stand on their own, so <b>' + esc(personaByRole("STEWARD").name) + "</b> decides them.</span></div>" +
        RW_FILTER + (D.matches || []).map(matchHtml).join("") +
        '<p class="honest">A decision here decides whether two records count as one customer.</p>';
      return;
    }
    if (S.rwTab === "xrefs") {
      el.innerHTML = '<div class="rw-tools"><span>The same part is numbered differently in each system. These cross-references are the ones the AI could not settle on its own.</span></div>' +
        RW_FILTER + (D.itemXrefs || []).map(xrefHtml).join("") +
        '<p class="honest">Until a part is one part, stock elsewhere is invisible here.</p>';
      return;
    }
    var rows = S.pending.map(function (d) { return { row: d.row, pending: true }; })
      .concat(S.log.map(function (d) { return { row: d, pending: false }; }))
      .concat((D.decisions || []).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; }).map(function (d) { return { row: d, pending: false }; }));
    el.innerHTML = RW_FILTER + '<div class="tw"><table class="rtbl"><thead><tr><th style="width:150px">When</th><th style="width:160px">Who</th><th>Decision</th><th style="width:100px">Action</th><th>Why</th><th>Rule left behind</th></tr></thead><tbody>' +
      rows.map(function (x) {
        var d = x.row;
        return "<tr><td>" + esc(d.at) + (x.pending ? ' <span class="stat stat--review">not in the numbers yet</span>' : "") + "</td><td>" + esc(d.by) + "<br><span style=\"color:#837d75;font-size:11px\">" + esc(d.role) + "</span></td><td>" + esc(d.title) + '</td><td><span class="stat stat--' + (d.action === "decline" || d.action === "reject" ? "open" : "auto") + '">' + esc(d.action) + "</span></td><td>" + esc(d.reason) + "</td><td>" + (d.rule ? esc(d.rule) : "—") + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<p class="honest">Every decision keeps who, when, why, and the rule it left behind.</p>';
  }
  function renderRw() { renderRwState(); renderRwTitle(); renderBand(); renderRwTabs(); renderRwPanel(); }
  $("#rw-tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]");
    if (!b) return;
    S.rwTab = b.dataset.tab; renderRwTitle(); renderRwTabs(); renderRwPanel(); $("#rw-panel").scrollTop = 0; tour.reposition();
  });
  $("#rw-panel").addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-openrec]"))) {
      var id = t.dataset.openrec;
      S.openRec = S.openRec === id ? null : id;
      renderRwPanel();
      var el = $('[data-rec-card="' + id + '"]'); if (el) el.scrollIntoView({ block: "start", behavior: "smooth" });
      tour.after("open-rec");
      return;
    }
    if ((t = e.target.closest("[data-evgo]"))) { setApp("aidp"); openEvidence(t.dataset.evgo); return; }
    if ((t = e.target.closest("[data-rec]"))) { decideRec(t.dataset.acct, t.dataset.rec); return; }
    if ((t = e.target.closest("[data-mdec]"))) { decideMatchUi(t.dataset.mid, t.dataset.mdec); return; }
  });
  function decideRec(accId, action) {
    if (pendingFor(accId)) { toast("Already decided. <b>Re-analyse</b> to put it into the numbers."); return; }
    var an = analysis(), acc = an.accounts.filter(function (x) { return x.id === accId; })[0];
    if (!acc || acc.status !== "at-risk") { toast("That account has already been decided."); return; }
    var input = $("#rreason-" + accId);
    var reason = (input && input.value.trim()) || (action === "decline" ? "Not at risk, handled with the customer." : "Agreed, go ahead.");
    var d = { kind: "recommendation", accountId: accId, actionId: acc.recommendation ? acc.recommendation.actionId : null,
      action: action, reason: reason, by: personaByRole("COMMERCIAL_OPS").name, at: DECIDED_AT };
    if (action === "accept") {
      var res = D.decide(S.state, d);
      S.state = res.state;
      S.log.unshift({ at: res.decision.at, by: res.decision.by, role: res.decision.role || "COMMERCIAL_OPS",
        title: acc.name + " · " + (acc.recommendation ? acc.recommendation.text : "action") + " accepted",
        action: "accept", reason: reason, rule: "" });
      renderRw();
      toast("<span><b>Accepted.</b> " + esc(acc.name) + " stays on the list with " + esc(acc.recommendation ? (an.actions.filter(function (x) { return x.id === acc.recommendation.actionId; })[0] || {}).owner || "its owner" : "its owner") + ". The numbers move only when it runs.</span>", 8000);
      return;
    }
    S.pending.push({ decision: d, row: { at: d.at, by: d.by, role: "COMMERCIAL_OPS",
      title: acc.name + " · " + (acc.recommendation ? acc.recommendation.text : "action") + " declined",
      action: "decline", reason: reason, rule: "" } });
    renderRwState(); renderRwTabs(); renderRwPanel();
    toast("<span><b>Declined.</b> " + esc(acc.name) + ", &ldquo;" + esc(reason) + "&rdquo;. <b>Re-analyse</b> to make it count.</span>", 9000);
    tour.after("decline");
  }
  function decideMatchUi(id, action) {
    var m = (D.matches || []).concat(D.itemXrefs || []).filter(function (x) { return x.id === id; })[0];
    if (!m) return;
    var input = $("#mreason-" + id);
    var reason = (input && input.value.trim()) || (action === "reject" ? "Not the same, the identifiers disagree." : "Same party, confirmed.");
    var d = { kind: m.kind || (m.itemId ? "item" : "customer"), id: id, target: id, action: action, reason: reason,
      by: personaByRole("STEWARD").name, at: "Tue 6 Oct 2026 · 09:55" };
    var res = D.decideMatch(S.state, d);
    S.state = res.state;
    var rule = (res.learned && res.learned.rule) || res.decision.rule || "";
    S.matchLog[id] = { action: action, by: res.decision.by, reason: reason, rule: rule };
    S.log.unshift({ at: res.decision.at, by: res.decision.by, role: res.decision.role || "STEWARD",
      title: res.decision.title || id, action: action, reason: reason, rule: rule });
    renderRw();
    toast("<span><b>" + (action === "reject" ? "Kept apart." : "Confirmed.") + "</b> " + esc(res.decision.title || id) + ". " + (rule ? "Rule kept: &ldquo;" + esc(rule) + "&rdquo;." : "") + "</span>", 8000);
  }
  $("#rw-rerun").addEventListener("click", function () { reanalyse(); tour.after("reanalyse"); });
  function reanalyse() {
    if (S.busy) return;
    if (!S.state.analysed) { toast("Ask what is at risk first."); return; }
    if (!S.pending.length) { toast("Nothing waiting. Accept or decline something first, then re-analyse."); return; }
    S.busy = true;
    $("#rw-rerun").disabled = true;
    $("#rw-state").className = "rw-state is-stale";
    $("#rw-state").innerHTML = '<span class="dot"></span>Re-analysing with your decision…';
    setTimeout(function () {
      var moved = { band: [], actions: [] }, learned = "", head = null;
      S.pending.forEach(function (pn) {
        var res = D.decide(S.state, pn.decision);
        S.state = res.state;
        S.log.unshift({ at: res.decision.at, by: res.decision.by, role: res.decision.role || "COMMERCIAL_OPS",
          title: (res.decision.account ? res.decision.account + " · " : "") + (res.decision.action === "decline" ? "recommendation " + (res.decision.actionId || "") + " declined" : "recommendation accepted"),
          action: res.decision.action, reason: res.decision.reason, rule: (res.learned && res.learned.rule) || res.decision.rule || "" });
        (res.changed.band || []).forEach(function (x) { if (moved.band.indexOf(x.id) < 0) moved.band.push(x.id); });
        (res.changed.actions || []).forEach(function (x) { if (moved.actions.indexOf(x.id) < 0) moved.actions.push(x.id); });
        if (res.changed.headline) head = res.changed.headline;
        if (res.learned && res.learned.rule) learned = res.learned.rule;
      });
      S.pending = [];
      S.busy = false;
      S.movedBand = moved.band;
      $("#rw-rerun").disabled = false;
      renderRw(); renderWb();
      setTimeout(function () { S.movedBand = []; renderBand(); if (S.app === "aidp" && S.wbPanel === "analysis") renderWb(); }, 7000);
      var msg = head
        ? "Revenue at risk " + esc(usdShort(head.revenueUsd.from)) + " &rarr; <b>" + esc(usdShort(head.revenueUsd.to)) + "</b> &middot; lines " +
          head.lines.from + " &rarr; " + head.lines.to + " &middot; tier-A accounts " + head.tierA.from + " &rarr; " + head.tierA.to +
          " &middot; penalties " + esc(usdShort(head.penaltiesUsd.from)) + " &rarr; " + esc(usdShort(head.penaltiesUsd.to))
        : "The numbers did not move.";
      toast('<span class="tok">' + ICON.check + "</span><span><b>Re-analysed.</b> " + msg +
        (moved.actions.length ? " &middot; " + moved.actions.length + " action" + (moved.actions.length === 1 ? "" : "s") + " resized" : "") +
        (learned ? " &middot; rule kept: &ldquo;" + esc(learned) + "&rdquo;" : "") + "</span>", 14000);
      tour.next();
    }, 1500);
  }

  /* ===================================================================== */
  /* TOUR                                                                  */
  /* ===================================================================== */
  /* Six business steps in Dana's words. Every hint says why she is clicking
     and what the AI is doing at that moment; none of them names a refresh, a
     model, a mapping, a view or SQL. */
  var STEPS = [
    { id: "sources", major: 1, side: "bottom", passive: true,
      title: "Everything you run on",
      body: "Three systems hold the order book. The contracts and the carrier scans say what a promise is worth. The CRM says which customers matter. All five feed one place.",
      target: function () { return $("#src-cards"); }, anchor: function () { return $("#src-cards .src:last-child"); },
      avoid: function () { return $("#src-cards"); },
      auto: function () { tour.next(); } },
    { id: "to-aidp", major: 1, side: "bottom",
      title: "Take the question to the AI",
      body: "Your account owners want to know what will go wrong this week. Open the Agent Hub and ask.",
      target: function () { return $('.ws-tab[data-go="aidp"]'); },
      auto: function () { setApp("aidp"); tour.after("to-aidp"); } },
    { id: "ask-q1", major: 2, side: "bottom", waits: true,
      title: "Ask what is at risk",
      body: "Ask the first saved question. Four agents go at once. They read the three order books, resolve customers and parts, find every cause and price every line.",
      target: function () { return $('[data-ask="q1"]'); }, anchor: function () { return $("#hub-chips"); },
      avoid: function () { return $("#hub-chips"); },
      auto: function () { ask("q1"); } },
    { id: "findings", major: 3, side: "right", dock: "right", passive: true,
      title: "Read what the AI found",
      body: "Each system saw its own late lines and nothing more. The AI put them on one list, gave every line a cause, ranked the accounts and proposed four actions.",
      target: function () { return $("#band-tiles"); }, anchor: function () { return $("#band-tiles"); },
      avoid: function () { return $(".an-cols"); },
      auto: function () { tour.next(); } },
    { id: "evidence", major: 4, side: "right", dock: "right", scroll: "center",
      title: "Check one finding yourself",
      body: "Halden Tooling is your biggest exposure, and the AI says the parts sit in another plant. Open the evidence and check it yourself.",
      target: function () { return $('[data-ev="' + keyAccountId() + '"]'); }, anchor: function () { return $('tr[data-acct="' + keyAccountId() + '"]'); },
      avoid: function () { return $('tr[data-acct="' + keyAccountId() + '"]'); },
      auto: function () { openEvidence(keyAccountId()); tour.after("evidence"); } },
    { id: "trace", major: 4, side: "right", dock: "right",
      title: "See how it got there",
      body: "The other direction now. Which agent read what, in what order, and under which rules, including the rows you may see and the columns your role masks.",
      target: function () { return $('[data-panel="trace"]'); }, anchor: function () { return $(".ans-acts"); },
      avoid: function () { return $("#ans-panel") || $(".ans-acts"); },
      auto: function () { S.panel = "trace"; renderWb(); tour.after("trace"); } },
    { id: "to-decisions", major: 5, side: "bottom",
      title: "You know something it does not",
      body: "Halden called last week and agreed to take delivery on the 20th. Those four lines are not at risk, whatever the dates say. Go to Decisions.",
      target: function () { return $('.ws-tab[data-go="review"]'); },
      avoid: function () { return $(".an-cols"); },
      auto: function () { setApp("review"); tour.after("to-decisions"); } },
    { id: "open-rec", major: 5, side: "bottom",
      title: "Open the one you disagree with",
      body: "Four proposals, each with the accounts and lines behind it. Open the expedite. Halden Tooling is the first account under it.",
      target: function () { return $('[data-openrec="' + keyActionId() + '"]'); }, anchor: function () { return $('[data-rec-card="' + keyActionId() + '"]'); },
      auto: function () { S.openRec = keyActionId(); renderRwPanel(); tour.after("open-rec"); } },
    { id: "decline", major: 5, side: "bottom", scroll: "center",
      title: "Overrule it, and say why",
      body: "The reason is drafted for you. Decline the expedite. The AI keeps your reason and the rule underneath it: a date the customer accepted is not a date at risk.",
      target: function () { return $('[data-rec="decline"][data-acct="' + keyAccountId() + '"]'); }, anchor: function () { return $('.reca[data-acct="' + keyAccountId() + '"] .prop-acts'); },
      avoid: function () { return $('.reca[data-acct="' + keyAccountId() + '"]'); },
      auto: function () { decideRec(keyAccountId(), "decline"); } },
    { id: "reanalyse", major: 5, side: "left", waits: true,
      title: "Make it do the sums again",
      body: "Your decision does not vanish into a log. Re-analyse, and the AI re-values everything with Halden out.",
      target: function () { return $("#rw-rerun"); }, avoid: function () { return $("#rw-band"); },
      auto: reanalyse },
    { id: "to-aidp-2", major: 6, side: "bottom",
      title: "Back to the finding",
      body: "Your account owners still need something they can open on Thursday. Go back to the Agent Hub.",
      target: function () { return $('.ws-tab[data-go="aidp"]'); },
      avoid: function () { return $("#rw-band"); },
      auto: function () { setApp("aidp"); tour.after("to-aidp-2"); } },
    { id: "create-dash", major: 6, side: "right", dock: "right", waits: true,
      title: "Give the team a dashboard",
      body: "Rather than export a spreadsheet, have the AI build the dashboard from what it just found. Same numbers, same definitions, no private copy that drifts.",
      target: function () { return $("#create-dash"); }, anchor: function () { return $(".ans-acts"); },
      avoid: function () { return $(".an-cols"); },
      auto: function () { createDashboard(); } },
    { id: "viewas", major: 6, side: "left",
      title: "See it as your analyst does",
      body: "Before you send it, look at it as Marcus Bell does. Pick him. The dashboard rebuilds for North America only, and the masking is decided in the database.",
      target: function () { return $('#wb-menu [data-role="ANALYST_NA"]'); }, anchor: function () { return $("#wb-menu"); },
      avoid: function () { return $(".gd-tiles"); },
      before: function () { if (S.wbPanel !== "insights") { S.wbPanel = "insights"; renderWb(); } openMenu(true); },
      auto: function () { openMenu(false); setRole("ANALYST_NA"); } },
    { id: "share", major: 6, side: "bottom",
      title: "Hand it to the commercial team",
      body: "Share it. Everyone opens the same dashboard and each sees their own rows.",
      target: function () { return $("#share-dash"); }, anchor: function () { return $("#share-dash"); },
      avoid: function () { return $(".gd-head"); },
      auto: share }
  ];
  var MAJORS = 6;
  /* R10 — the card shows the major step and the position inside it, and the six
     segments fill fractionally, so every click moves something. */
  var MAJOR_N = {}, MAJOR_I = [];
  STEPS.forEach(function (st) { MAJOR_N[st.major] = (MAJOR_N[st.major] || 0) + 1; MAJOR_I.push(MAJOR_N[st.major]); });

  var tour = {
    active: false, i: 0, el: $("#tour"), target: null, tries: 0,
    stepId: function () { return STEPS[this.i] ? STEPS[this.i].id : ""; },
    start: function () {
      this.active = true; this.i = 0;
      document.body.classList.add("tour-on");
      $("#tour-pill").hidden = false; $("#tour-toggle").textContent = "Exit guide";
      S.app = "lakehouse"; S.dsScreen = "feeds"; setApp("lakehouse");
      this.show();
    },
    show: function () {
      var st = STEPS[this.i], self = this;
      if (!st) return;
      if (st.before && !st._did) { st._did = 1; st.before(); }
      var t = st.target();
      if (!t) { if (this.tries++ < 90) return void requestAnimationFrame(function () { self.show(); }); return; }
      this.tries = 0;
      if (this.target) this.target.classList.remove("tour-target");
      this.target = t; t.classList.add("tour-target");
      var sub = MAJOR_I[this.i], subN = MAJOR_N[st.major];
      $("#tour-step").textContent = "Step " + st.major + " of " + MAJORS + " \u00b7 " + sub + " of " + subN;
      $("#tour-title").textContent = st.title; $("#tour-body").textContent = st.body;
      var bars = "";
      for (var k = 1; k <= MAJORS; k++) {
        var pct = k < st.major ? 100 : k > st.major ? 0 : Math.round(sub / subN * 100);
        bars += '<i><b style="width:' + pct + '%"></b></i>';
      }
      $("#tour-progress").innerHTML = bars;
      $("#tour-next").hidden = !st.passive; $("#tour-skip").hidden = !!st.passive;
      this.el.hidden = false; this.el.dataset.side = st.side;
      document.body.classList.toggle("tour-gutter", !!st.dock);
      try { t.scrollIntoView({ block: st.scroll || "nearest", behavior: "smooth", inline: "nearest" }); } catch (e) {}
      this.reposition();
      setTimeout(function () { self.reposition(); }, 320);
      setTimeout(function () { self.reposition(); }, 720);
    },
    after: function (id) { if (!this.active || !id) return; if (STEPS[this.i] && STEPS[this.i].id === id) this.next(); },
    next: function () {
      if (!this.active) return;
      if (STEPS[this.i] && STEPS[this.i].waits && S.busy) {
        this.el.hidden = true;
        if (this.target) { this.target.classList.remove("tour-target"); this.target = null; }
        return;
      }
      this.i++;
      if (this.i >= STEPS.length) return this.finish();
      var self = this;
      setTimeout(function () { self.show(); }, 280);
    },
    skip: function () { var st = STEPS[this.i]; if (st && st.auto) st.auto(); },
    exit: function () {
      this.active = false; this.el.hidden = true;
      if (this.target) this.target.classList.remove("tour-target");
      this.target = null;
      document.body.classList.remove("tour-on");
      document.body.classList.remove("tour-gutter");
      $("#tour-pill").hidden = true; $("#tour-toggle").textContent = "Restart walkthrough";
    },
    finish: function () {
      this.exit();
      /* R9 — what a user needs next, not a report on the build session. */
      var g = $("#gate");
      $("#tour-step").textContent = "Step " + MAJORS + " of " + MAJORS + " · done";
      $("#gate-title").textContent = "What you can act on now";
      $("#gate-body").textContent =
        "Five systems answered one question. Every figure carried its cause and its rows, you overruled the AI once, and your team has a dashboard. " +
        "Nothing was written to any system.";
      if ($("#gate-steps")) $("#gate-steps").hidden = true;
      var doors = [
        ["ask", "Ask another question", "the saved questions"],
        ["decisions", "Open the Decisions queue", "customer matches waiting for a person"],
        ["dash", "See the dashboard", "Insights, on the Agent Hub"]
      ];
      $("#gate-try").innerHTML = doors.map(function (d) {
        return '<button type="button" data-door="' + d[0] + '"><b>' + d[1] + "</b><span>" + d[2] + "</span></button>";
      }).join("");
      $("#gate-try").hidden = false;
      $("#gate-start").textContent = "Replay the walkthrough"; $("#gate-free").textContent = "Keep exploring";
      $(".gate-note").textContent = "Demo data only. Nothing leaves this page.";
      $("#gate-start").onclick = function () { location.href = location.pathname; };
      $("#gate-free").onclick = function () { g.hidden = true; };
      $("#gate-try").onclick = function (e) {
        var b = e.target.closest("[data-door]");
        if (!b) return;
        g.hidden = true;
        if (b.dataset.door === "ask") { setApp("aidp"); S.wbPanel = "home"; S.panel = null; renderWb(); }
        else if (b.dataset.door === "decisions") { setApp("review"); S.rwTab = "matches"; renderRw(); }
        else { setApp("aidp"); S.wbPanel = "insights"; S.panel = null; renderWb(); }
      };
      g.hidden = false;
    },
    reposition: function () {
      if (!this.active || !this.target || this.el.hidden) return;
      var st = STEPS[this.i];
      if (!document.body.contains(this.target)) {
        var t = st.target();
        if (t) { this.target.classList.remove("tour-target"); this.target = t; t.classList.add("tour-target"); } else return;
      }
      var anchor = (st.anchor && st.anchor()) || this.target;
      var r = anchor.getBoundingClientRect(), w = 306, h = this.el.offsetHeight || 160, gap = 14, s = st.side, top, left;

      /* docked steps live in the gutter the page reserves while the tour runs,
         so the card never lands on the analysis it is describing */
      if (st.dock === "right") {
        left = innerWidth - w - 12;
        top = Math.max(56, Math.min(innerHeight - h - 8, r.top - 8));
        this.el.style.top = top + "px"; this.el.style.left = left + "px"; this.el.dataset.side = "left";
        return;
      }

      var fits = { right: r.right + gap + w < innerWidth, left: r.left - gap - w > 0, bottom: r.bottom + gap + h < innerHeight, top: r.top - gap - h > 0 };
      if (!fits[s]) s = ["bottom", "top", "right", "left"].filter(function (k) { return fits[k]; })[0] || "bottom";
      if (s === "right") { left = r.right + gap; top = r.top - 8; }
      if (s === "left") { left = r.left - gap - w; top = r.top - 8; }
      if (s === "bottom") { left = r.left; top = r.bottom + gap; }
      if (s === "top") { left = r.left; top = r.top - gap - h; }
      top = Math.max(8, Math.min(innerHeight - h - 8, top));
      left = Math.max(8, Math.min(innerWidth - w - 8, left));

      /* Never cover the element the step's copy is talking about. */
      var keep = st.avoid && st.avoid();
      if (keep && document.body.contains(keep)) {
        var kr = keep.getBoundingClientRect();
        var hit = !(left + w <= kr.left || left >= kr.right || top + h <= kr.top || top >= kr.bottom);
        if (hit && kr.width && kr.height) {
          var cand = [
            { t: kr.bottom + gap, l: left, s: "bottom" },
            { t: kr.top - gap - h, l: left, s: "top" },
            { t: top, l: kr.right + gap, s: "right" },
            { t: top, l: kr.left - gap - w, s: "left" }
          ].filter(function (c) { return c.t >= 8 && c.t + h <= innerHeight - 8 && c.l >= 8 && c.l + w <= innerWidth - 8; })[0];
          if (cand) { top = cand.t; left = cand.l; s = cand.s; }
          else { top = Math.max(8, Math.min(innerHeight - h - 8, kr.bottom + gap)); s = "bottom"; }
        }
      }
      this.el.style.top = top + "px"; this.el.style.left = left + "px"; this.el.dataset.side = s;
    },
    /* QA hook: does the callout currently cover the element this step names? */
    avoidHit: function () {
      var st = STEPS[this.i];
      if (!this.active || this.el.hidden || !st || !st.avoid) return false;
      var keep = st.avoid();
      if (!keep || !document.body.contains(keep)) return false;
      var a = this.el.getBoundingClientRect(), b = keep.getBoundingClientRect();
      if (!b.width || !b.height) return false;
      return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    },
    nudge: function () {
      var self = this;
      this.el.classList.remove("is-nudge"); void this.el.offsetWidth; this.el.classList.add("is-nudge");
      setTimeout(function () { self.el.classList.remove("is-nudge"); }, 400);
    }
  };

  /* the click guard: only the designated control acts while the tour runs */
  document.addEventListener("click", function (e) {
    if (!tour.active || !tour.target) return;
    if (e.target.closest("#tour, #tour-toggle, #gate")) return;
    var el = e.target.closest("button, a, input, select, textarea, label, [role=menuitem], .prop-head, .rec-head, .hub-chip, .ds-row, .tile, .src");
    if (STEPS[tour.i] && STEPS[tour.i].passive) { e.preventDefault(); e.stopPropagation(); if (el) tour.nudge(); return; }
    if (!el) return;
    if (tour.target.contains(el) || el.contains(tour.target)) return;
    e.preventDefault(); e.stopPropagation(); tour.nudge();
  }, true);
  window.addEventListener("resize", function () { tour.reposition(); if (S.app === "aidp" && S.wbPanel === "lineage") drawLineage(); });
  document.addEventListener("scroll", function () { tour.reposition(); }, true);
  $("#tour-skip").addEventListener("click", function () { tour.skip(); });
  $("#tour-next").addEventListener("click", function () { tour.next(); });
  $("#tour-toggle").addEventListener("click", function () { if (tour.active) tour.exit(); else location.href = location.pathname; });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!$("#wb-menu").hidden) { openMenu(false); return; }
    if (!$("#gate").hidden && !tour.active) { $("#gate").hidden = true; }
  });

  /* ===================================================================== */
  /* boot                                                                  */
  /* ===================================================================== */
  function prime(name) {
    if (!name || name === "start") { S.state = D.initialState(); S.log = []; S.pending = []; return; }
    S.state = D.stateFor(name);
    if (name === "decided" || name === "final") {
      var d = D.haldenDecision;
      S.log = [{ at: d.at, by: d.by, role: "COMMERCIAL_OPS",
        title: (d.account || "Halden Tooling Group") + " · recommendation " + (d.actionId || "") + " declined",
        action: "decline", reason: d.reason,
        rule: (D.learnedRule && D.learnedRule.rule) || "Accepted re-promise dates are not at risk" }];
    }
    if (name === "final") S.shared = false;
  }
  $("#ws-ctx").textContent = D.world.week.range + " · " + D.world.todayLabel + " " + D.world.nowLabel;

  var wantState = params.get("state");
  var wantApp = params.get("app");
  var wantPanel = params.get("panel");
  var wantQ = params.get("q");

  if (params.get("ui") === "clean") { $("#tour-toggle").hidden = true; $("#tour-pill").hidden = true; document.body.classList.add("ui-clean"); }
  if (params.get("role") === "analyst") S.role = "ANALYST_NA";

  if (params.get("tour") === "off") {
    $("#gate").hidden = true;
    prime(wantState || "analysed");
    tour.exit();
    $("#tour-toggle").textContent = "Restart walkthrough";
  } else {
    if (wantState) prime(wantState);
    $("#gate").hidden = false;
    $("#gate-start").addEventListener("click", function () { $("#gate").hidden = true; tour.start(); });
    $("#gate-free").addEventListener("click", function () {
      $("#gate").hidden = true; tour.exit();
      if (!S.state.analysed) prime("analysed");
      renderDs(); renderWb(); renderRw();
    });
  }

  if (wantQ) {
    S.qid = "q" + wantQ;
    S.app = "aidp";
    if (wantQ === "1") { if (!S.state.analysed) prime("analysed"); S.wbPanel = "analysis"; }
    else S.wbPanel = "conversation";
  }
  if (wantPanel) {
    if (["evidence", "trace", "explain", "code"].indexOf(wantPanel) >= 0) {
      S.panel = wantPanel;
      if (S.wbPanel !== "conversation") { if (!S.state.analysed) prime("analysed"); S.wbPanel = "analysis"; }
      S.app = wantApp || "aidp";
    } else if (wantPanel === "analysis") { if (!S.state.analysed) prime("analysed"); S.wbPanel = "analysis"; S.app = wantApp || "aidp"; }
    else if (wantPanel === "dashboard") {
      if (!S.state.analysed) prime("analysed");
      S.state = { analysed: true, decisions: S.state.decisions, dashboard: true };
      S.wbPanel = "insights"; S.app = wantApp || "aidp";
    } else if (["catalog", "feeds"].indexOf(wantPanel) >= 0) { S.dsScreen = wantPanel; S.app = wantApp || "lakehouse"; }
    else if (wantPanel === "analysis-ds") { S.dsScreen = "analysis"; S.app = wantApp || "lakehouse"; }
    else if (["home", "insights", "audit", "apc", "lineage"].indexOf(wantPanel) >= 0) { S.wbPanel = wantPanel; S.app = wantApp || "aidp"; }
    else if (wantPanel === "sessions") { S.wbPanel = "audit"; S.app = wantApp || "aidp"; }
    else if (wantPanel === "mcatalog") { S.wbPanel = "catalog"; S.app = wantApp || "aidp"; }
    else if (["recommendations", "matches", "xrefs", "decisions"].indexOf(wantPanel) >= 0) { S.rwTab = wantPanel; S.app = wantApp || "review"; }
  }
  if (wantApp) S.app = wantApp;

  renderDs(); renderWb(); renderRw();
  setApp(S.app);

  window.DEMO = {
    state: S, data: D, tour: tour,
    setApp: setApp, setRole: setRole, ask: ask, share: share,
    runAnalysis: runAnalysis, createDashboard: createDashboard,
    openEvidence: function (id) { setApp("aidp"); openEvidence(id); },
    openPanel: function (p) { S.panel = p || null; if (S.wbPanel !== "conversation") S.wbPanel = "analysis"; renderWb(); },
    setDsScreen: function (s) { S.dsScreen = s; renderDs(); },
    setApcView: function (v) { S.apcView = v; renderWb(); },
    setWbPanel: function (p) { S.wbPanel = p; S.panel = null; renderWb(); },
    setRwTab: function (t) { S.rwTab = t; renderRwTitle(); renderRwTabs(); renderRwPanel(); },
    openRec: function (id) { S.openRec = id; renderRwPanel(); },
    decide: decideRec, reanalyse: reanalyse, decideMatch: decideMatchUi,
    openLineage: openLineage,
    lineageColumn: function (c) { S.linCol = c; openContributors(); renderWb(); },
    lineageDetail: function (id, tab) { S.linDetail = id; S.linTab = tab || "details"; renderWb(); },
    setCatalogEntity: function (id) { S.mcEntity = id; S.wbPanel = "catalog"; renderWb(); },
    prime: function (n) { prime(n); S.movedBand = []; renderDs(); renderWb(); renderRw(); },
    analysis: analysis, evidence: function (id) { return D.evidence(id, S.role, decisions()); },
    dashboard: function () { return D.dashboard(S.role, decisions()); },
    answer: ans, toast: toast
  };
})();
