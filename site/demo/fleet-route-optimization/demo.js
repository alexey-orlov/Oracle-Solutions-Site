/* Fleet route optimization — the walkthrough. Every number on screen comes out of
   FRO.kpis(applied); an undo or a re-plan recomputes everything.            */
(function () {
  "use strict";
  var D = window.FRO;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var S = { stage: "start", applied: [], undone: {}, accepted: {}, notes: {}, plan: "v1",
            tab: "map", mapPlan: "actual", sel: null, busy: false, sent: false };

  var COLORS = ["#C74634", "#2F5BEA", "#0E8A7E", "#8A4FD8", "#D9480F", "#1C7ED6",
                "#5C940D", "#AE3EC9", "#E8590C", "#1971C2", "#2B8A3E", "#C2255C"];
  var FLAGGED = "c-e103-dunmere";

  /* Charging stops. As it ran: recorded mid-route charges. Re-planned: from the applied change. */
  var ACT_CHG = { "E-102": { charger: "CH-BRK", after: 1, time: "10:40", mins: 35 },
                  "E-103": { charger: "CH-DEP", after: 2, time: "11:20", mins: 45 },
                  "E-105": { charger: "CH-DEP", after: 1, time: "09:00", mins: 30 } };
  var NEW_CHG = { "c-e102-lunch":   { eng: "E-102", charger: "CH-BRK", after: 3, time: "12:30", mins: 22 },
                  "c-e103-dunmere": { eng: "E-103", charger: "CH-DUN", after: 3, time: "12:10", mins: 25 },
                  "c-e109-depot":   { eng: "E-109", charger: "CH-DEP", after: 0, time: "07:40", mins: 20 },
                  "c-e103-depot":   { eng: "E-103", charger: "CH-DEP", after: 0, time: "07:40", mins: 30 } };
  var REMOVES_CHG = { "c-e105-home": "E-105" };

  function engIndex(id) { for (var i = 0; i < D.engineers.length; i++) if (D.engineers[i].id === id) return i; return 0; }
  function engColor(id) { return COLORS[engIndex(id) % COLORS.length]; }
  function home(e) {                                  /* engineers start and finish at home */
    var z = D.zones.filter(function (q) { return q.id === e.home; })[0], i = engIndex(e.id);
    return { x: z.x + (i % 2 ? 46 : -46), y: z.y + 34 };
  }
  function charger(id) { return D.chargers.filter(function (c) { return c.id === id; })[0]; }
  function zoneName(id) { return D.zones.filter(function (z) { return z.id === id; })[0].name; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function view() { return S.mapPlan === "new" ? S.applied : []; }

  /* ---- plans ---------------------------------------------------------------- */
  function jobsOf(engId, applied) {
    return D.jobs.filter(function (j) { return D.assignee(j, applied) === engId; });
  }
  function recordedOrder(list) {                       /* the zig-zag the day actually ran */
    var idx = [0, 3, 1, 4, 2, 5, 6, 7], out = [];
    idx.forEach(function (i) { if (list[i]) out.push(list[i]); });
    list.forEach(function (j) { if (out.indexOf(j) === -1) out.push(j); });
    return out;
  }
  function tidyOrder(list, start) {                    /* nearest neighbour from the engineer's home */
    var left = list.slice(), out = [], x = start.x, y = start.y;
    while (left.length) {
      var bi = 0, bd = 1e9;
      left.forEach(function (j, i) { var d = (j.x - x) * (j.x - x) + (j.y - y) * (j.y - y); if (d < bd) { bd = d; bi = i; } });
      var n = left.splice(bi, 1)[0]; out.push(n); x = n.x; y = n.y;
    }
    return out;
  }
  function touched(engId, applied) {
    return applied.some(function (id) { return D.byId(id).eng.indexOf(engId) !== -1; });
  }
  function route(engId, applied) {
    var list = jobsOf(engId, applied);
    return (applied.length && touched(engId, applied)) ? tidyOrder(list, home(D.engineers[engIndex(engId)])) : recordedOrder(list);
  }
  function chargeStop(engId, applied) {
    for (var i = 0; i < applied.length; i++) {
      var s = NEW_CHG[applied[i]];
      if (s && s.eng === engId) return s;
    }
    for (var k = 0; k < applied.length; k++) if (REMOVES_CHG[applied[k]] === engId) return null;
    return ACT_CHG[engId] || null;
  }
  function status(job, applied) {
    var fixed = D.fixedBy(applied);
    if (D.missed[job.id] && !fixed[job.id]) return applied.length ? (job.id === "J47" ? "unassigned" : "missed") : "missed";
    if (D.late[job.id] && !fixed[job.id]) return "late";
    if ((D.missed[job.id] || D.late[job.id]) && fixed[job.id]) return "fixed";
    return "ok";
  }

  /* ---- formatting ------------------------------------------------------------- */
  function fmtMin(v) { return Math.round(v) + " min"; }
  function deltaChip(before, after, goodWhenUp, unit, pct) {
    var d = after - before;
    var cls = Math.abs(d) < 1e-9 ? "flat" : ((d > 0) === goodWhenUp ? "up" : "down");
    var txt;
    if (pct) txt = (d >= 0 ? "+" : "−") + Math.abs(d / before * 100).toFixed(1) + "%";
    else txt = (d >= 0 ? "+" : "−") + Math.abs(Math.round(d)) + (unit ? " " + unit : "");
    if (Math.abs(d) < 1e-9) txt = "no change";
    return '<span class="delta ' + cls + '">' + txt + "</span>";
  }

  /* ---- renderers -------------------------------------------------------------- */
  function renderProblems() {
    var k = D.kpis([]);
    $("#problems").innerHTML =
      '<span class="chip bad">' + k.missed + " visits missed</span>" +
      '<span class="chip warn">' + k.late + " late arrivals</span>" +
      '<span class="chip warn">4 charging problems</span>' +
      '<span class="chip warn">1 skill mismatch</span>';
  }

  function renderBand() {
    var b = D.kpis([]), a = D.kpis(S.applied);
    var tiles = [
      { lab: "Cost per completed visit", from: "€" + b.costPerVisit.toFixed(2), to: "€" + a.costPerVisit.toFixed(2),
        d: deltaChip(b.costPerVisit, a.costPerVisit, false, "", true), note: "driving and paid charging time, illustrative unit costs" },
      { lab: "Visits per engineer per day", from: b.jobsPerEng.toFixed(2), to: a.jobsPerEng.toFixed(2),
        d: deltaChip(b.jobsPerEng, a.jobsPerEng, true, "", true), note: "the same fleet, no new hires · " + a.completed + " of 72 done" },
      { lab: "Missed and late appointments", from: b.missedLate, to: a.missedLate,
        d: deltaChip(b.missedLate, a.missedLate, false, ""), note: "each one a second visit · " + a.missed + " missed, " + a.late + " late" },
      { lab: "Charging downtime per electric van", from: fmtMin(b.chargePerEv), to: fmtMin(a.chargePerEv),
        d: deltaChip(b.chargePerEv, a.chargePerEv, false, "min"), note: "paid engineer time spent charging" }
    ];
    $("#band").innerHTML = tiles.map(function (t) {
      return '<div class="kpi"><div class="lab">' + t.lab + '</div><div class="vals"><span class="from">' + t.from +
        '</span><span class="arrow">→</span><span class="to">' + t.to + "</span></div>" + t.d +
        '<div class="note">' + t.note + "</div></div>";
    }).join("");
  }

  function renderResult() {
    var a = D.kpis(S.applied);
    $("#res-tag").textContent = S.plan === "v2" ? "Feasible · plan v2" : "Feasible";
    $("#res-grid").innerHTML =
      '<div class="fact"><b>12</b><span>engineers used</span></div>' +
      '<div class="fact"><b class="green">' + a.completed + '</b><span>visits routed, of 72</span></div>' +
      '<div class="fact"><b>' + a.missed + '</b><span>unassigned, with reason</span></div>' +
      '<div class="fact"><b class="green">8 of 8</b><span>electric routes battery-checked</span></div>';
  }

  function stopLine(n, cls, title, sub, when) {
    return '<li><span class="n ' + cls + '">' + n + "</span><span>" + title + '</span><span class="when">' + (when || "") +
      '</span><span class="sub">' + sub + "</span></li>";
  }
  function statusChip(st) {
    return { missed: '<span class="chip bad">missed</span>', unassigned: '<span class="chip bad">unassigned</span>',
             late: '<span class="chip warn">late</span>', fixed: '<span class="chip good">on time</span>', ok: "" }[st];
  }
  function renderRoutes() {
    var ap = view();
    $("#routes-plan").textContent = S.mapPlan === "new" ? (S.plan === "v2" ? "re-planned · v2" : "re-planned") : "as it ran";
    $("#routes").innerHTML = D.engineers.map(function (e) {
      var jobs = route(e.id, ap), chg = chargeStop(e.id, ap), sel = S.sel === e.id;
      var bad = jobs.filter(function (j) { var s = status(j, ap); return s === "missed" || s === "late" || s === "unassigned"; }).length;
      var head = '<div class="eng-head" data-eng="' + e.id + '"><span class="dot" style="background:' + engColor(e.id) + '"></span><b>' + e.id +
        "</b><span class=\"muted\">" + (e.ev ? "electric" : "diesel") + '</span><span class="meta">' + jobs.length + " visits" +
        (bad ? ' · <span style="color:var(--bad)">' + bad + " issue" + (bad > 1 ? "s" : "") + "</span>" : "") + "</span></div>";
      if (!sel) return '<div class="eng">' + head + "</div>";
      var items = [stopLine("", "dep", "Home · " + zoneName(e.home), "start of shift" + (e.ev && e.homeCharger ? " · home charger" : e.ev ? " · no home charger" : ""), "")];
      if (chg && chg.after === 0) items.push(stopLine("⚡", "chg", "Charging · " + charger(chg.charger).name, chg.mins + " min", chg.time));
      jobs.forEach(function (j, i) {
        items.push(stopLine(i + 1, "", esc(j.type) + (j.high ? ' <span class="chip bad">high</span>' : "") + " " + statusChip(status(j, ap)),
          "Account " + j.account + " · " + zoneName(j.zone), "slot " + j.slot));
        if (chg && chg.after === i + 1) items.push(stopLine("⚡", "chg", "Charging · " + charger(chg.charger).name, chg.mins + " min", chg.time));
      });
      items.push(stopLine("", "dep", "Home · " + zoneName(e.home), "end of shift", ""));
      return '<div class="eng sel">' + head + '<ul class="stops">' + items.join("") + "</ul></div>";
    }).join("");
  }

  function renderMap() {
    var ap = view(), svg = [];
    var roads = ["M170,140 C300,120 330,110 420,110", "M420,110 C540,120 600,120 690,130", "M690,130 C780,170 820,200 860,250",
                 "M160,390 C260,430 330,470 420,470", "M420,470 C540,480 600,470 690,460", "M690,460 C780,480 820,500 870,500",
                 "M170,140 C160,250 160,300 160,390", "M860,250 C870,350 880,420 870,500", "M420,110 C470,200 500,250 520,300",
                 "M520,300 C480,380 450,420 420,470", "M520,300 C600,280 760,260 860,250", "M520,300 C600,360 650,420 690,460",
                 "M520,300 C400,320 250,360 160,390"];
    roads.forEach(function (d) { svg.push('<path class="road" d="' + d + '"/>'); });
    D.zones.forEach(function (z) {
      svg.push('<g class="zone"><rect x="' + (z.x - 120) + '" y="' + (z.y - 78) + '" width="240" height="156" rx="18"/>' +
        '<text x="' + (z.x - 108) + '" y="' + (z.y - 58) + '">' + z.name + "</text></g>");
    });
    var sel = S.sel;
    D.engineers.forEach(function (e) {
      var h = home(e), jobs = route(e.id, ap), chg = chargeStop(e.id, ap), pts = [[h.x, h.y]];
      if (chg && chg.after === 0) { var c0 = charger(chg.charger); pts.push([c0.x, c0.y]); }
      jobs.forEach(function (j, i) { pts.push([j.x, j.y]); if (chg && chg.after === i + 1) { var c = charger(chg.charger); pts.push([c.x, c.y]); } });
      pts.push([h.x, h.y]);
      var cls = "rt" + (S.mapPlan === "actual" ? " act" : "") + (sel === e.id ? " sel" : "") + (sel && sel !== e.id ? " dim" : "");
      svg.push('<polyline class="' + cls + '" style="stroke:' + engColor(e.id) + '" points="' + pts.map(function (p) { return p.join(","); }).join(" ") + '"/>');
    });
    D.jobs.forEach(function (j) {
      var st = status(j, ap), cls = "job" + (st === "missed" || st === "unassigned" ? " bad" : st === "late" ? " late" : "");
      var owner = D.assignee(j, ap);
      svg.push('<circle class="' + cls + (sel && sel !== owner ? " dim" : "") + '" cx="' + j.x + '" cy="' + j.y + '" r="5"/>');
    });
    if (sel) {
      var hs = home(D.engineers[engIndex(sel)]);
      svg.push('<g class="dep"><rect x="' + (hs.x - 7) + '" y="' + (hs.y - 7) + '" width="14" height="14" rx="3" style="fill:' + engColor(sel) + '"/><text text-anchor="middle" x="' + hs.x + '" y="' + (hs.y + 24) + '">' + sel + " home</text></g>");
      route(sel, ap).forEach(function (j, i) {
        svg.push('<g class="num"><circle cx="' + j.x + '" cy="' + j.y + '" r="9"/><text x="' + j.x + '" y="' + (j.y + 3.5) + '" text-anchor="middle">' + (i + 1) + "</text></g>");
      });
    }
    var warnDun = S.applied.indexOf(FLAGGED) !== -1 && !S.accepted[FLAGGED] && S.mapPlan === "new";
    D.chargers.forEach(function (c) {
      svg.push('<g class="chg' + (c.id === "CH-DUN" && warnDun ? " warn" : "") + '"><circle cx="' + c.x + '" cy="' + c.y + '" r="10"/>' +
        '<path d="M' + (c.x - 2) + "," + (c.y - 6) + " l5,0 l-3,5 l4,0 l-7,8 l2,-6 l-3,0 z\" fill=\"#fff\"/>" +
        (c.x > 780 ? '<text text-anchor="middle" x="' + c.x + '" y="' + (c.y - 16) + '">' : '<text x="' + (c.x + 14) + '" y="' + (c.y + 4) + '">') + c.name + "</text></g>");
    });
    svg.push('<g class="dep"><rect x="' + (D.depot.x - 9) + '" y="' + (D.depot.y - 9) + '" width="18" height="18" rx="3"/>' +
      '<text x="' + (D.depot.x - 60) + '" y="' + (D.depot.y - 16) + '">' + D.depot.name + "</text></g>");
    $("#map").innerHTML = svg.join("");
    $("#seg-actual").classList.toggle("on", S.mapPlan === "actual");
    $("#seg-new").classList.toggle("on", S.mapPlan === "new");
  }

  function effectChips(c) {
    var out = [], m = 0, l = 0;
    (c.fixes || []).forEach(function (j) { if (D.missed[j]) m++; if (D.late[j]) l++; });
    if (m) out.push('<span class="chip good">+' + m + " visit" + (m > 1 ? "s" : "") + " served</span>");
    if (l) out.push('<span class="chip good">−' + l + " late</span>");
    if (c.effects.charge) out.push('<span class="chip good">−' + Math.abs(c.effects.charge) + " min charging</span>");
    if (c.effects.travel) out.push('<span class="chip ' + (c.effects.travel < 0 ? "good" : "warn") + '">' + (c.effects.travel < 0 ? "−" : "+") + Math.abs(c.effects.travel) + " min driving</span>");
    return out.join("");
  }
  function visibleChanges() {
    return D.changes.filter(function (c) { return c.plan === "v1" || (c.plan === "v2" && S.plan === "v2"); });
  }
  function renderChanges() {
    var list = visibleChanges();
    var applied = list.filter(function (c) { return S.applied.indexOf(c.id) !== -1; }).length;
    var acc = Object.keys(S.accepted).length;
    $("#ch-count").textContent = applied + " changes in the plan" + (acc ? " · " + acc + " approved" : "") + (Object.keys(S.undone).length ? " · " + Object.keys(S.undone).length + " overruled" : "");
    $("#changes").innerHTML = list.map(function (c) {
      var on = S.applied.indexOf(c.id) !== -1, und = !!S.undone[c.id], ok = !!S.accepted[c.id];
      var cls = "ch" + (c.kind === "tradeoff" && on && !ok ? " tradeoff" : "") + (und ? " undone" : "") + (ok ? " accepted" : "");
      var btns = und ? '<button type="button" data-redo="' + c.id + '">Redo</button>'
        : ok ? '<span class="chip good">Approved</span>'
        : '<button type="button" data-show="' + c.id + '">Show</button><button type="button" data-undo="' + c.id + '">Undo</button><button type="button" data-ok="' + c.id + '">Accept</button>';
      var html = '<div class="' + cls + '" id="ch-' + c.id + '"><div><div class="rule">' + esc(c.rule) + '</div><div class="title">' + esc(c.title) +
        '</div></div><div class="btns">' + btns + '</div><div class="body"><p>' + esc(c.what) + " " + esc(c.why) + '</p><div class="eff">' + effectChips(c) + "</div></div>";
      if (c.cost && on) html += '<div class="flag" style="background:var(--bg);color:var(--ink2)">' + esc(c.cost) + "</div>";
      if (c.decision && on && !ok) html += '<div class="flag">Needs your call: ' + esc(c.decision) + "</div>";
      if (und) html += '<div class="note"><input type="text" id="note-' + c.id + '" value="' + esc(S.notes[c.id] || "") + '" aria-label="Note for the next plan"></div>';
      return html + "</div>";
    }).join("");
    var flags = D.flagsFor(S.applied).filter(function (f) { return f.job; });
    $("#open-flags").innerHTML = '<div><b>Still open after the re-plan</b></div>' + flags.map(function (f) {
      var j = D.jobs.filter(function (x) { return x.id === f.job; })[0];
      return "<div>" + (f.kind === "missed" ? '<span class="chip bad">unassigned</span> ' : '<span class="chip warn">late</span> ') +
        esc(j.type) + " · account " + j.account + " — " + esc(f.text) + (f.decision ? ". Book it for the next day or approve overtime." : "") + "</div>";
    }).join("");
    $("#btn-replan").disabled = !S.undone[FLAGGED] || S.plan === "v2";
    $("#btn-accept").disabled = S.sent || list.every(function (c) { return S.applied.indexOf(c.id) === -1 || S.accepted[c.id]; });
  }

  function exportRows() {
    var rows = [], ap = S.applied;
    D.engineers.forEach(function (e) {
      var chg = chargeStop(e.id, ap), jobs = route(e.id, ap), order = 0;
      if (chg && chg.after === 0) rows.push({ chg: true, res: e.id, order: ++order, act: "CHG-" + e.id.slice(2), type: "Charging stop · " + charger(chg.charger).name, slot: chg.time + " · " + chg.mins + " min" });
      jobs.forEach(function (j, i) {
        if (status(j, ap) === "unassigned") return;
        rows.push({ res: e.id, order: ++order, act: j.account, type: j.type, slot: j.slot });
        if (chg && chg.after === i + 1) rows.push({ chg: true, res: e.id, order: ++order, act: "CHG-" + e.id.slice(2), type: "Charging stop · " + charger(chg.charger).name, slot: chg.time + " · " + chg.mins + " min" });
      });
    });
    return rows;
  }
  function renderExport() {
    var rows = exportRows(), acc = Object.keys(S.accepted).length;
    var chg = rows.filter(function (r) { return r.chg; }).length, vis = rows.length - chg;
    $("#exp-note").textContent = acc + " approved changes · " + vis + " visits · " + chg + " charging stops · Field Service activity import";
    var shown = rows.slice(0, 16);
    $("#exp").innerHTML = "<tr><th>Resource</th><th>Order</th><th>Activity</th><th>Type</th><th>Slot or time</th></tr>" +
      shown.map(function (r) {
        return '<tr class="' + (r.chg ? "chg" : "") + '"><td class="code">' + r.res + "</td><td>" + r.order + '</td><td class="code">' + r.act + "</td><td>" + esc(r.type) + "</td><td>" + r.slot + "</td></tr>";
      }).join("") + '<tr><td colspan="5" class="muted">… and ' + (rows.length - shown.length) + " more rows in the file</td></tr>";
    $("#btn-send").disabled = S.sent || !acc;
  }

  function renderAll() {
    if (S.stage === "solved") { renderBand(); renderResult(); renderChanges(); renderExport(); }
    renderRoutes(); renderMap();
    if (window.__tour) window.__tour.reposition();
  }

  /* ---- actions ---------------------------------------------------------------- */
  function toast(t) {
    var el = $("#toast"); el.textContent = t; el.hidden = false;
    clearTimeout(toast.h); toast.h = setTimeout(function () { el.hidden = true; }, 2600);
  }
  function runLog(title, lines, done, instant) {
    var box = $("#log"), host = $("#log-lines");
    $("#log-title").textContent = title; box.hidden = false;
    host.innerHTML = lines.map(function (l) { return '<p class="' + l[0] + '">' + esc(l[1]) + "</p>"; }).join("");
    var ps = $$("#log-lines p");
    if (instant) { ps.forEach(function (p) { p.classList.add("on"); }); done(); return; }
    ps.forEach(function (p, i) { setTimeout(function () { p.classList.add("on"); }, 380 * (i + 1)); });
    setTimeout(done, 380 * (ps.length + 1) + 250);
  }
  function landed(stepId) { if (tour.active && tour.stepId() === stepId) tour.next(); }

  function replay(instant) {
    if (S.stage !== "start" || S.busy) return;
    S.busy = true; $("#btn-replay").disabled = true;
    runLog("Replaying Tuesday 9 September", [
      ["run", "Reading Oracle Fusion Field Service: 72 visits, 12 engineers, skills, booked slots"],
      ["run", "Reading telematics: trips and GPS traces for 12 vans"],
      ["run", "Reading charging history for 8 electric vans"],
      ["run", "Lining up each trip with its visit, engineer by engineer"],
      ["ok", "Rebuilt 12 engineer-days as they ran"],
      ["ok", "Checked against actuals: visits 72 of 72, journey times within 6%"],
      ["warn", "Found on the day: 6 visits missed, 7 late, 4 charging problems"]
    ], function () {
      S.busy = false; S.stage = "replayed";
      $("#calib").hidden = false;
      $("#calib-row").innerHTML = D.calibration.map(function (c) { return '<div class="fact"><b>' + c.value + "</b><span>" + c.label + "</span></div>"; }).join("") +
        '<span class="chip good verdict">Replay within the agreed tolerance</span>';
      $("#btn-opt").disabled = false;
      renderAll();
      landed("replay");
    }, instant);
  }

  function optimize(instant) {
    if (S.stage !== "replayed" || S.busy) return;
    S.busy = true; $("#btn-opt").disabled = true;
    runLog("Re-planning on GPU", [
      ["run", "Building one request: 72 visits, 12 vans, booked slots and priorities"],
      ["run", "Adding skills: 2 gas-certified engineers, 2 charger installers"],
      ["run", "Adding battery state for 8 electric vans and 4 chargers in range"],
      ["run", "Solving all 12 routes at once on GPU with NVIDIA cuOpt"],
      ["ok", "Charging stops placed where they cost no visit"],
      ["ok", "Every electric route checked leg by leg against a 15% reserve"],
      ["warn", "1 visit can't be served: no charger installer free before 17:00"]
    ], function () {
      S.busy = false; S.stage = "solved"; S.applied = D.v1.slice(); S.mapPlan = "new";
      $("#result").hidden = false; $("#band-wrap").hidden = false; $("#log").hidden = true;
      $("#tab-changes").disabled = false; $("#seg-new").disabled = false;
      $("#hdr-sub").textContent = "Northgate region · Tuesday 9 September, re-planned";
      renderAll();
      landed("optimize");
    }, instant);
  }

  function openTab(t) {
    S.tab = t;
    $$(".tabs button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === t); });
    $("#view-map").hidden = t !== "map"; $("#view-changes").hidden = t !== "changes"; $("#view-export").hidden = t !== "export";
    if (t === "export") renderExport();
    if (t === "changes") renderChanges();
    if (window.__tour) window.__tour.reposition();
  }

  function selectEng(id) { S.sel = S.sel === id ? null : id; renderRoutes(); renderMap(); }

  function undo(id) {
    var i = S.applied.indexOf(id); if (i === -1) return;
    S.applied.splice(i, 1); S.undone[id] = true;
    if (id === FLAGGED && !S.notes[id]) S.notes[id] = "Avoid Dunmere rapid charger 11:30–13:30: it queues at midday.";
    renderAll(); toast("Overruled. Every number above has been recomputed.");
  }
  function redo(id) {
    delete S.undone[id]; if (S.applied.indexOf(id) === -1) S.applied.push(id);
    if (id === FLAGGED && S.plan === "v2") { var k = S.applied.indexOf("c-e103-depot"); if (k !== -1) S.applied.splice(k, 1); S.plan = "v1"; }
    renderAll(); toast("Change restored.");
  }
  function accept(id) {
    var c = D.byId(id);
    if (c.decision) { toast("This one needs your call: undo it or keep it."); }
    S.accepted[id] = true; renderAll();
  }
  function acceptRemaining() {
    var n = 0, held = 0;
    visibleChanges().forEach(function (c) {
      if (S.applied.indexOf(c.id) === -1 || S.accepted[c.id]) return;
      if (c.decision) { held++; return; }
      S.accepted[c.id] = true; n++;
    });
    $("#tab-export").disabled = false;
    renderAll();
    toast(held ? n + " approved. One change still needs your call." : n + " changes approved. Ready to send.");
  }
  function replan(instant) {
    if (!S.undone[FLAGGED] || S.plan === "v2" || S.busy) return;
    var note = $("#note-" + FLAGGED); if (note) S.notes[FLAGGED] = note.value;
    S.busy = true; $("#btn-replan").disabled = true;
    runLog("Re-planning with your note", [
      ["run", "Adding your rule: avoid Dunmere rapid charger 11:30–13:30"],
      ["run", "Solving again on GPU with NVIDIA cuOpt"],
      ["ok", "E-103 now charges at the depot at 07:40"],
      ["ok", "Every electric route checked against the reserve"]
    ], function () {
      S.busy = false; S.plan = "v2"; S.applied.push("c-e103-depot"); $("#log").hidden = true;
      renderAll(); if (!instant) toast("Plan v2 is ready. The band shows the new numbers.");
      landed("replan");
    }, instant);
  }
  function send() {
    if (S.sent) return;
    S.sent = true; renderExport(); renderChanges();
    toast("Proof of value: saved as a file. Integration: written back after approval.");
  }
  function openArch() { $("#arch").hidden = false; }

  /* ---- wiring ------------------------------------------------------------------ */
  $("#btn-replay").addEventListener("click", function () { replay(false); });
  $("#btn-opt").addEventListener("click", function () { optimize(false); });
  $("#btn-replan").addEventListener("click", function () { replan(false); });
  $("#btn-accept").addEventListener("click", function () { acceptRemaining(); tour.after("accept"); });
  $("#btn-send").addEventListener("click", function () { send(); tour.after("send"); });
  $("#btn-arch").addEventListener("click", openArch);
  $("#arch-close").addEventListener("click", function () { $("#arch").hidden = true; });
  $("#tabs").addEventListener("click", function (ev) {
    var b = ev.target.closest("button[data-tab]"); if (!b || b.disabled) return;
    openTab(b.getAttribute("data-tab")); tour.after(b.getAttribute("data-tab") === "changes" ? "changes" : b.getAttribute("data-tab") === "export" ? "export" : "map");
  });
  $("#seg-plan").addEventListener("click", function (ev) {
    var b = ev.target.closest("button[data-plan]"); if (!b || b.disabled) return;
    S.mapPlan = b.getAttribute("data-plan"); renderRoutes(); renderMap();
  });
  $("#routes").addEventListener("click", function (ev) {
    var h = ev.target.closest("[data-eng]"); if (h) selectEng(h.getAttribute("data-eng"));
  });
  $("#changes").addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    var id;
    if ((id = b.getAttribute("data-undo"))) { undo(id); tour.after("undo"); }
    else if ((id = b.getAttribute("data-redo"))) redo(id);
    else if ((id = b.getAttribute("data-ok"))) accept(id);
    else if ((id = b.getAttribute("data-show"))) { var c = D.byId(id); S.sel = c.eng[0]; S.mapPlan = "new"; openTab("map"); renderAll(); }
  });
  $("#changes").addEventListener("input", function (ev) {
    if (ev.target.id && ev.target.id.indexOf("note-") === 0) S.notes[ev.target.id.slice(5)] = ev.target.value;
  });
  window.addEventListener("resize", function () { if (window.__tour) window.__tour.reposition(); });

  /* ---- the tour ----------------------------------------------------------------- */
  var tour = TourEngine.create({
    busy: function () { return S.busy; },
    clickableSelector: TourEngine.DEFAULT_CLICKABLE + ", [data-eng], [data-tab], [data-plan]",
    labels: { exit: "Exit guide", restart: "Restart walkthrough" },
    steps: [
      { id: "sources", major: 1, side: "right", passive: true,
        title: "Three sources, one real day",
        body: "Last Tuesday as it really ran: bookings and skills from Field Service, the vans' telematics and charging history, and traffic and charger data.",
        target: function () { return $("#sources"); },
        auto: function () { tour.next(); } },
      { id: "replay", major: 1, side: "right", waits: true,
        title: "Replay the day first",
        body: "The day is rebuilt engineer by engineer and checked against what really happened. Nothing is re-planned until the replay matches.",
        target: function () { return $("#btn-replay"); },
        auto: function () { replay(false); } },
      { id: "optimize", major: 2, side: "right", waits: true,
        title: "Re-plan the same day",
        body: "cuOpt re-plans all twelve vans in one GPU solve: booked slots, skills, priorities and charging stops together.",
        target: function () { return $("#btn-opt"); },
        auto: function () { optimize(false); } },
      { id: "kpis", major: 3, side: "bottom", passive: true, scroll: "center",
        title: "See what it is worth",
        body: "Same day, same bookings: cost per visit, visits per engineer and missed appointments, as it ran against the re-plan. Illustrative unit costs on a synthetic day.",
        target: function () { return $("#band-wrap"); },
        anchor: function () { return $("#band"); },
        auto: function () { tour.next(); } },
      { id: "changes", major: 4, side: "bottom",
        title: "See where it came from",
        body: "Ten changes produced those numbers. Each one names the rule behind it and what it did.",
        target: function () { return $("#tab-changes"); },
        avoid: function () { return $("#band"); },
        auto: function () { openTab("changes"); } },
      { id: "flagged", major: 4, side: "left", passive: true, scroll: "center",
        title: "One change needs your call",
        body: "The solver sent E-103 to a shared rapid charger at noon. It cannot see that this charger queues at midday.",
        target: function () { return $("#ch-" + FLAGGED); },
        auto: function () { tour.next(); } },
      { id: "undo", major: 5, side: "left",
        title: "Overrule the charging stop",
        body: "Undo it. Every number above recomputes at once, and your note goes into the next plan.",
        target: function () { return document.querySelector('[data-undo="' + FLAGGED + '"]'); },
        auto: function () { undo(FLAGGED); } },
      { id: "replan", major: 5, side: "bottom", waits: true,
        title: "Re-plan with your note",
        body: "cuOpt solves again with Dunmere ruled out at midday and puts the charge somewhere else.",
        target: function () { return $("#btn-replan"); },
        auto: function () { replan(false); } },
      { id: "accept", major: 6, side: "bottom",
        title: "Approve what you agree with",
        body: "Accept every change with no open question. The unassigned visit stays flagged for a person.",
        target: function () { return $("#btn-accept"); },
        auto: function () { acceptRemaining(); } },
      { id: "export", major: 6, side: "bottom",
        title: "Send it to dispatch",
        body: "The approved routes and charging stops, in Field Service's own import format.",
        target: function () { return $("#tab-export"); },
        auto: function () { openTab("export"); } },
      { id: "send", major: 6, side: "left",
        title: "Hand it to Field Service",
        body: "In the proof of value this is a file. With the Integration package it writes back after your approval.",
        target: function () { return $("#btn-send"); },
        auto: function () { send(); } }
    ],
    end: {
      title: "Try it on your own days",
      body: "Pick a region and a few past days. We replay them, re-plan them and show what changes before any live schedule moves.",
      doors: [
        { id: "arch", label: "See how it works", hint: "from Field Service to GPU and back", go: openArch },
        { id: "eng", label: "Follow one engineer's day", hint: "E-103, as it ran and re-planned", go: function () { openTab("map"); S.sel = "E-103"; renderAll(); } },
        { id: "undo", label: "Overrule another change", hint: "undo any change and watch the numbers follow", go: function () { openTab("changes"); } }
      ],
      note: "Synthetic data. Nothing leaves this page."
    }
  });
  window.__tour = tour;

  /* ---- primed states (?tour=off&state=…) --------------------------------------------- */
  function prime(state) {
    if (!state || state === "start") return;
    replay(true);
    if (state === "replayed") { $("#log").hidden = false; return; }
    optimize(true);
    if (state === "solved") return;
    openTab("changes");
    if (state === "changes") return;
    undo(FLAGGED); replan(true); acceptRemaining(); openTab("export");
    $("#toast").hidden = true;
  }

  renderProblems(); renderAll();
  TourEngine.boot({
    tour: tour, prime: prime,
    clean: function () { document.body.classList.add("clean"); },
    defaultState: "solved", freeState: "start"
  });

  window.DEMO = { state: S, tour: tour, kpis: D.kpis, replay: replay, optimize: optimize, undo: undo, replan: replan, acceptRemaining: acceptRemaining };
})();
