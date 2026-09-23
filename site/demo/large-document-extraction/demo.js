/* Large docs processing and review — interactive walkthrough.
   Plain JS, no dependencies. State → render; the tour engine sits on top and
   only ever lets the designated control through while it is active. Two
   prepared documents of different types share one flow and one UI; each
   group renders the columns its own schema needs. */
(function () {
  "use strict";
  var D = window.DEMO_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var params = new URLSearchParams(location.search);
  var USER = "Jordan Mercer";
  var FLAG = {
    fix: { label: "Validator", cls: "" },
    range: { label: "Validator", cls: "" },
    consistency: { label: "Validator", cls: "" },
    missing: { label: "Not found", cls: "bad" },
    lowconf: { label: "Low confidence", cls: "info" }
  };

  /* ---------------- state ---------------- */
  var S = { screen: "upload", uploaded: false, cur: "msa", d: {}, typeFilter: "all", format: "xlsx" };
  Object.keys(D.docs).forEach(function (k) {
    var d = D.docs[k];
    var st = { status: d.initialStatus, rows: {}, history: (d.initialHistory || []).slice(), open: {}, selected: null, page: 1, hiRow: null, tab: "review" };
    d.groups.forEach(function (g) {
      g.doc = k;
      g.rows.forEach(function (r, i) {
        r.key = k + ":" + g.id + ":" + i; r.page = r.page || g.page; r.doc = k; r.gid = g.id;
        st.rows[r.key] = { status: "pending", edited: false, cells: Object.assign({}, r.cells), flag: !!r.flag };
      });
    });
    S.d[k] = st;
  });
  function doc() { return D.docs[S.cur]; }
  function ds() { return S.d[S.cur]; }
  function groupOf(dk, gid) { return D.docs[dk].groups.filter(function (g) { return g.id === gid; })[0]; }
  function findRow(key) { var p = key.split(":"); return groupOf(p[0], p[1]).rows[+p[2]]; }
  function rowsOf(dk) { var out = []; D.docs[dk].groups.forEach(function (g) { g.rows.forEach(function (r) { out.push({ g: g, r: r }); }); }); return out; }
  function rstate(key) { return S.d[key.split(":")[0]].rows[key]; }
  function pendingIn(g) { return g.rows.filter(function (r) { return rstate(r.key).status === "pending"; }).length; }
  function flaggedIn(g) { return g.rows.filter(function (r) { return rstate(r.key).flag; }).length; }
  function pendingOf(dk) { return rowsOf(dk).filter(function (x) { return rstate(x.r.key).status === "pending"; }).length; }
  function flaggedOf(dk) { return rowsOf(dk).filter(function (x) { return rstate(x.r.key).flag; }).length; }
  function approvedOf(dk) { return rowsOf(dk).filter(function (x) { return rstate(x.r.key).status === "approved"; }).length; }
  function approvableOf(dk) { return rowsOf(dk).filter(function (x) { var rs = rstate(x.r.key); return rs.status === "pending" && !rs.flag; }).length; }
  function confLabel(c) { return c >= 90 ? "High" : c >= 75 ? "Medium" : "Low"; }
  function unitOf(g, v) { return !g.unit || /%$/.test(v) || v === "" ? "" : " " + g.unit; }
  function rowLabel(g, cells) { return g.label ? g.label(cells) : cells.service; }
  function typeOf(id) { return D.types.filter(function (t) { return t.id === id; })[0] || { name: id, schema: "" }; }
  function now() { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  function log(dk, text, sub, kind) { S.d[dk].history.unshift({ time: now(), text: text, sub: sub || "", kind: kind || "" }); }

  /* ---------------- navigation ---------------- */
  function go(screen) {
    S.screen = screen;
    $$(".screen").forEach(function (el) { el.hidden = el.dataset.screen !== screen; });
    $$(".nav-item").forEach(function (b) { b.classList.toggle("is-active", b.dataset.nav === (screen === "review" ? "documents" : screen)); });
    var crumbs = { upload: "<b>Upload</b>", documents: "<b>Documents</b>", history: "<b>History</b>", review: "Documents<i>›</i><b>" + esc(doc().id) + "</b><i>·</i>" + esc(doc().name) };
    $("#crumbs").innerHTML = crumbs[screen];
    $("#saved").hidden = screen !== "review";
    if (screen === "documents") renderDocuments();
    if (screen === "upload") renderRecent();
    if (screen === "history") renderGlobalHistory();
    if (screen === "review") renderReview();
    tour.reposition();
  }
  $$(".nav-item").forEach(function (b) { b.addEventListener("click", function () { go(b.dataset.nav); }); });

  /* ---------------- upload + picker ---------------- */
  var picker = $("#picker"), pickerList = $("#picker-list"), pickerOpen = $("#picker-open");
  var pickedFile = null;
  function openPicker() {
    pickedFile = null; pickerOpen.disabled = true;
    pickerList.innerHTML = D.pickerFiles.map(function (f, i) {
      return '<li data-file="' + i + '"' + (f.main ? ' class="is-main"' : "") + '><span class="file-ico"><svg viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/></svg></span><div class="doc-name"><strong>' + esc(f.name) + "</strong><span>" + esc(f.kind) + '</span></div><span class="size">' + esc(f.size) + "</span></li>";
    }).join("");
    picker.hidden = false;
    tour.after("drop");
  }
  function selectFile(i) {
    pickedFile = D.pickerFiles[i];
    $$("li", pickerList).forEach(function (li) { li.classList.toggle("is-selected", +li.dataset.file === i); });
    pickerOpen.disabled = false;
    if (pickedFile.main) tour.after("pick");
  }
  function openFile() {
    if (!pickedFile) return;
    if (!pickedFile.main) { toast("This walkthrough follows one prepared upload — pick the Meridian agreement."); return; }
    picker.hidden = true;
    if (S.uploaded) { toast("The prepared upload has already run — open MSA-2026-014 from Documents."); return; }
    tour.after("open");
    startProcessing();
  }
  pickerList.addEventListener("click", function (e) { var li = e.target.closest("li[data-file]"); if (li) selectFile(+li.dataset.file); });
  $("#picker-cancel").addEventListener("click", function () { picker.hidden = true; });
  pickerOpen.addEventListener("click", openFile);
  $("#dropzone").addEventListener("click", openPicker);

  function startProcessing() {
    var m = D.docs.msa, proc = $("#processing"), bar = $("#proc-bar"), stages = $$("#stages li"), total = rowsOf("msa").length;
    $("#dropzone").hidden = true; proc.hidden = false;
    $("#proc-file").textContent = m.file; $("#proc-sub").textContent = m.pages + " pages · " + m.size;
    $("#proc-chip").textContent = "Processing"; $("#proc-chip").className = "chip chip--live";
    stages.forEach(function (li) { li.className = ""; $("em", li).textContent = ""; });
    var plan = [
      { ms: 700, done: "Supplier services agreement · native PDF, no OCR · schema: Supplier agreement v3" },
      { ms: 1500, done: m.pages + " pages: 12 rate schedule · 28 clauses · 8 other", tick: true },
      { ms: 1200, done: total + " values in " + m.groups.length + " groups" },
      { ms: 900, done: total + " cited · lowest confidence 71%" },
      { ms: 700, done: "1 flag: tier continuity" }
    ];
    var t = 0, sum = plan.reduce(function (a, p) { return a + p.ms; }, 0), acc = 0;
    plan.forEach(function (p, i) {
      setTimeout(function () { stages[i].classList.add("is-running"); if (p.tick) tickPages(stages[i], p.ms); }, t);
      acc += p.ms; t += p.ms;
      (function (i, pct, done) { setTimeout(function () { stages[i].classList.remove("is-running"); stages[i].classList.add("is-done"); $("em", stages[i]).textContent = done; bar.style.width = pct + "%"; }, t); })(i, Math.round(acc / sum * 100), p.done);
    });
    setTimeout(function () { $("#proc-chip").textContent = "Extracted"; $("#proc-chip").className = "chip chip--ok"; }, t);
    setTimeout(function () {
      S.uploaded = true; S.d.msa.status = "Extracted";
      log("msa", "Extracted " + total + " values from " + m.pages + " pages", "1 value flagged by validators · " + m.id, "");
      log("msa", "Uploaded " + m.file, "Classified as supplier services agreement · schema Supplier agreement v3 · " + m.id, "");
      $("#nav-doc-count").textContent = String(D.existingDocs.length + 1);
      go("documents");
      proc.hidden = true; $("#dropzone").hidden = false;
      tour.next();
    }, t + 700);
  }
  function tickPages(li, ms) {
    var em = $("em", li), n = 0, steps = 12, pages = D.docs.msa.pages, iv = setInterval(function () { n++; em.textContent = "Page " + Math.min(pages, Math.round(n / steps * pages)) + " / " + pages; if (n >= steps) clearInterval(iv); }, ms / steps);
  }

  function docRows() {
    var rows = D.existingDocs.map(function (d) { return Object.assign({}, d); });
    if (S.uploaded) { var m = D.docs.msa; rows.push({ key: "msa", id: m.id, name: m.name, type: m.type, typeId: m.typeId, counterparty: m.counterparty, pages: m.pages, uploaded: "Today · upload", isNew: true }); }
    rows.forEach(function (d) { if (d.key) { d.status = S.d[d.key].status; d.pending = pendingOf(d.key); d.flagged = flaggedOf(d.key); d.values = rowsOf(d.key).length; d.openable = true; } });
    return rows;
  }
  function statusChip(s) {
    var k = { Extracted: "chip", Approved: "chip chip--ok", Exported: "chip chip--ok", "In review": "chip chip--warn" }[s] || "chip";
    return '<span class="' + k + '">' + esc(s) + "</span>";
  }
  function renderRecent() {
    $("#recent-list").innerHTML = docRows().slice().reverse().map(function (d) {
      return '<li><span class="file-ico"><svg viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/></svg></span><div class="doc-name"><strong>' + esc(d.name) + "</strong><span>" + esc(d.id) + " · " + esc(d.type) + " · " + d.pages + " pages · " + esc(d.uploaded) + "</span></div>" + statusChip(d.status) + "</li>";
    }).join("");
  }

  /* ---------------- documents ---------------- */
  function renderDocuments() {
    var all = docRows(), rows = all.filter(function (d) { return S.typeFilter === "all" || d.typeId === S.typeFilter; });
    var waiting = all.filter(function (d) { return d.status === "Extracted"; }).length;
    $("#doc-count-line").textContent = all.length + " documents" + (waiting ? " · " + waiting + " awaiting review" : "");
    $("#kpis").innerHTML = D.kpis.map(function (k) { return '<div class="kpi"><b>' + esc(k.v) + "</b><span>" + esc(k.l) + "</span><em>" + esc(k.s) + "</em></div>"; }).join("");
    var counts = {}; all.forEach(function (d) { counts[d.typeId] = (counts[d.typeId] || 0) + 1; });
    $("#type-chips").innerHTML = '<button type="button" data-type="all" class="' + (S.typeFilter === "all" ? "is-active" : "") + '">All types<i>' + all.length + "</i></button>" + D.types.map(function (t) {
      return '<button type="button" data-type="' + t.id + '" class="' + (S.typeFilter === t.id ? "is-active" : "") + '">' + esc(t.name) + "<i>" + (counts[t.id] || 0) + "</i></button>";
    }).join("");
    $("#doc-table tbody").innerHTML = rows.map(function (d) {
      var t = typeOf(d.typeId);
      var extra = d.openable && d.pending ? ' <span class="chip chip--warn">' + d.pending + " pending" + (d.flagged ? " · " + d.flagged + " flagged" : "") + "</span>" : "";
      return '<tr class="clickable' + (d.isNew ? " is-new" : "") + '" data-doc="' + esc(d.id) + '"' + (d.key ? ' data-key="' + d.key + '"' : "") + '><td><div class="doc-name"><strong>' + esc(d.name) + "</strong><span>" + esc(d.id) + '</span></div></td><td><div class="doc-type"><strong>' + esc(d.type) + "</strong><span>" + esc(t.schema) + "</span></div></td><td>" + esc(d.counterparty) + "</td><td>" + d.pages + "</td><td>" + esc(d.uploaded) + "</td><td>" + statusChip(d.status) + extra + '</td><td class="num">' + d.values + "</td></tr>";
    }).join("") || '<tr><td colspan="7" class="muted">No documents of this type yet.</td></tr>';
  }
  $("#type-chips").addEventListener("click", function (e) { var b = e.target.closest("[data-type]"); if (!b) return; S.typeFilter = b.dataset.type; renderDocuments(); });
  $("#doc-table").addEventListener("click", function (e) {
    var tr = e.target.closest("tr[data-doc]"); if (!tr) return;
    if (!tr.dataset.key) { toast("Only the two prepared documents open in this walkthrough — the other rows are scenery."); return; }
    openDoc(tr.dataset.key);
  });
  function openDoc(key) { S.cur = key; go("review"); if (key === "msa") tour.after("open-doc"); }

  /* ---------------- review ---------------- */
  function renderReview() {
    var d = doc(), s = ds();
    $("#meta-title").textContent = d.name;
    $("#viewer-file").textContent = d.file;
    $("#pg-total").textContent = d.pages;
    var st = $("#meta-status"); st.textContent = s.status; st.className = s.status === "Extracted" ? "chip" : "chip chip--ok";
    $("#approve-all").disabled = approvableOf(S.cur) === 0;
    $("#meta-grid").innerHTML = d.meta.map(function (p) { return "<div><dt>" + esc(p[0]) + "</dt><dd title=\"" + esc(p[1]) + "\">" + esc(p[1]) + "</dd></div>"; }).join("");
    $("#template-chip").textContent = "Template: " + d.template;
    renderGroups(); renderPage(s.page); renderDetails(); renderRatecard(); renderJson(); renderDocHistory();
    setTab(s.tab, true);
  }
  function renderGroups() {
    var s = ds();
    $("#groups").innerHTML = doc().groups.map(function (g) {
      var pend = pendingIn(g), flagged = flaggedIn(g);
      var confs = g.rows.map(function (r) { return r.conf; }).filter(function (c) { return c > 0; });
      var lbl = confLabel(Math.min.apply(null, confs));
      var badge = pend ? '<span class="status status--pending">' + pend + " pending</span>" : '<span class="status status--approved">Approved</span>';
      var head = '<div class="group-head" data-toggle="' + g.id + '"><span class="chev"><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></span><span class="g-name">' + esc(g.name) + '</span><span class="g-badges"><span class="chip chip--muted">' + g.rows.length + (g.rows.length === 1 ? " value" : " values") + '</span><span class="chip ' + (lbl === "High" ? "chip--ok" : lbl === "Medium" ? "chip--warn" : "chip--bad") + '">' + lbl + "</span>" + (flagged ? '<span class="chip chip--warn">' + flagged + " flagged</span>" : "") + badge + '</span><span class="g-actions"><button class="btn btn--ghost btn--xs" data-gapprove="' + g.id + '" type="button"' + (pend - flagged > 0 ? "" : " disabled") + '>Approve</button><button class="btn btn--ghost btn--xs" data-greject="' + g.id + '" type="button"' + (pend - flagged > 0 ? "" : " disabled") + ">Reject</button></span></div>";
      var thead = "<tr><th>Src</th>" + g.cols.map(function (c) { return "<th" + (c.num ? ' class="num"' : "") + ">" + esc(c.l) + "</th>"; }).join("") + "<th>Confidence</th><th>Status</th></tr>";
      var body = g.rows.map(function (r, i) {
        var rs = rstate(r.key), sel = s.selected === r.key, kind = rs.flag && r.flag ? r.flag.kind : "";
        var stat = { pending: '<span class="status status--pending">Pending</span>', approved: '<span class="status status--approved">Approved' + (rs.edited ? " · edited" : "") + "</span>", rejected: '<span class="status status--rejected">Rejected</span>', na: '<span class="status status--na">N/A</span>' }[rs.status];
        var conf = r.conf > 0 ? '<span class="conf conf--' + confLabel(r.conf).toLowerCase() + '"><i><b style="width:' + r.conf + '%"></b></i>' + r.conf + "%</span>" : '<span class="muted">—</span>';
        var cells = g.cols.map(function (c, ci) {
          var v = rs.cells[c.k] === undefined ? "" : rs.cells[c.k];
          var html;
          if (c.k === "value") html = v === "" ? '<span class="muted">— not found</span>' : "<b>" + esc(v) + esc(unitOf(g, v)) + "</b>";
          else if (c.k === "section") html = "§" + esc(v);
          else html = esc(v);
          if (ci === 0 && kind) html += ' <span class="row-flag' + (FLAG[kind].cls ? " row-flag--" + FLAG[kind].cls : "") + '"><svg viewBox="0 0 24 24"><path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 8.5v5M12 16.6v.4"/></svg>' + FLAG[kind].label + "</span>";
          return "<td" + (c.num ? ' class="num"' : "") + ">" + html + "</td>";
        }).join("");
        return '<tr class="clickable' + (sel ? " is-selected" : "") + (kind ? " has-flag flag-" + kind : "") + '" data-row="' + r.key + '"><td><button class="cite" data-cite="' + r.key + '" type="button" title="Show on page ' + r.page + '"><svg viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/></svg>p.' + r.page + "</button></td>" + cells + "<td>" + conf + "</td><td>" + stat + "</td></tr>";
      }).join("");
      return '<div class="group' + (s.open[g.id] ? " is-open" : "") + '" data-group="' + g.id + '">' + head + '<div class="group-body"><table class="table"><thead>' + thead + "</thead><tbody>" + body + "</tbody></table></div></div>";
    }).join("");
    tour.reposition();
  }
  $("#groups").addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-cite]"))) { e.stopPropagation(); cite(t.dataset.cite); return; }
    if ((t = e.target.closest("[data-gapprove]"))) { e.stopPropagation(); decideGroup(t.dataset.gapprove, "approved"); return; }
    if ((t = e.target.closest("[data-greject]"))) { e.stopPropagation(); decideGroup(t.dataset.greject, "rejected"); return; }
    if ((t = e.target.closest("tr[data-row]"))) { selectRow(t.dataset.row); return; }
    if ((t = e.target.closest("[data-toggle]"))) { toggleGroup(t.dataset.toggle); }
  });
  function toggleGroup(id, force) {
    var s = ds();
    s.open[id] = force === undefined ? !s.open[id] : force;
    renderGroups();
    if (s.open[id] && S.cur === "msa") tour.after(id === "cleaning" ? "expand" : id === "discount" ? "expand-discount" : "");
  }
  function selectRow(key) {
    var r = findRow(key), s = ds(); s.selected = key; s.hiRow = key;
    gotoPage(r.page); renderGroups(); renderDetails();
    if (rstate(key).flag) tour.after("flag-row");
  }
  function cite(key) {
    var r = findRow(key), s = ds(); s.selected = key; s.hiRow = key;
    gotoPage(r.page); renderGroups(); renderDetails();
    tour.after("cite");
  }

  function decideRow(key, status) {
    var rs = rstate(key), r = findRow(key), g = groupOf(r.doc, r.gid);
    rs.status = status; rs.flag = false;
    log(r.doc, { approved: "Approved", rejected: "Rejected", na: "Marked N/A" }[status] + ": " + rowLabel(g, rs.cells), "§" + rs.cells.section + " · p." + r.page + " · " + USER, status === "approved" ? "ok" : status === "rejected" ? "warn" : "");
    afterDecision();
    tour.after("approve-row");
  }
  function applyFix(key) {
    var rs = rstate(key), r = findRow(key), g = groupOf(r.doc, r.gid), was = rowLabel(g, rs.cells);
    rs.cells[r.flag.field] = r.flag.suggested; rs.edited = true; rs.flag = false; rs.status = "approved";
    log(r.doc, "Corrected and approved: " + rowLabel(g, rs.cells), "Was “" + was + "” · rule: " + r.flag.rule + " · " + USER, "ok");
    afterDecision();
    tour.after("fix");
  }
  function enterValue(key, val) {
    var rs = rstate(key), r = findRow(key), g = groupOf(r.doc, r.gid);
    rs.cells.value = val; rs.edited = true; rs.flag = false; rs.status = "approved";
    log(r.doc, "Entered and approved: " + rowLabel(g, rs.cells) + " — " + val + unitOf(g, val), "Field not found by extraction · entered by " + USER, "ok");
    afterDecision();
  }
  function decideGroup(id, status) {
    var g = groupOf(S.cur, id), n = 0;
    g.rows.forEach(function (r) { var rs = rstate(r.key); if (rs.status === "pending" && !rs.flag) { rs.status = status; n++; } });
    log(S.cur, (status === "approved" ? "Approved " : "Rejected ") + n + " values in " + g.name, "Group action · " + USER, status === "approved" ? "ok" : "warn");
    if (flaggedIn(g)) toast(flaggedIn(g) + " flagged value" + (flaggedIn(g) > 1 ? "s" : "") + " in " + g.name + " still need" + (flaggedIn(g) > 1 ? "" : "s") + " a decision.");
    afterDecision();
  }
  function approveAll() {
    var n = 0;
    rowsOf(S.cur).forEach(function (x) { var rs = rstate(x.r.key); if (rs.status === "pending" && !rs.flag) { rs.status = "approved"; n++; } });
    log(S.cur, "Approved " + n + " remaining values", "Approve all · " + USER, "ok");
    var f = flaggedOf(S.cur);
    if (f) toast("Approved " + n + " values. " + f + " flagged value" + (f > 1 ? "s" : "") + " still need" + (f > 1 ? "" : "s") + " a decision — Approve all never touches a flag.");
    else toast("Approved " + n + " values — the document is ready to export.");
    afterDecision();
    tour.after("approve-all");
  }
  $("#approve-all").addEventListener("click", approveAll);
  function afterDecision() {
    var s = ds();
    if (pendingOf(S.cur) === 0 && s.status === "Extracted") { s.status = "Approved"; log(S.cur, "Document approved", "All " + rowsOf(S.cur).length + " values decided", "ok"); }
    renderReview();
  }

  function renderDetails() {
    var box = $("#details"), s = ds();
    if (!s.selected) { box.hidden = true; return; }
    var r = findRow(s.selected), g = groupOf(r.doc, r.gid), rs = rstate(s.selected), kind = rs.flag && r.flag ? r.flag.kind : "";
    var val = rs.cells.value === "" ? '<span class="muted">— not found</span>' : esc(rs.cells.value) + esc(unitOf(g, rs.cells.value));
    var confText = r.conf > 0 ? r.conf + "% · " + confLabel(r.conf) : "No candidate";
    var reason = kind === "fix" ? "Read cleanly from the tier text, but a business-rule validator disputes the boundary — see the flag."
      : kind === "range" ? "Read cleanly; the value sits outside the band set by the prior document, so a reviewer confirms it."
      : kind === "consistency" ? "Both figures read cleanly; they do not reconcile with each other, so a reviewer decides which is right."
      : kind === "missing" ? "No candidate on the cited pages; fallback logic routed the field to a reviewer instead of guessing."
      : kind === "lowconf" ? "Below the 85% threshold for this document type, so routed to a reviewer instead of auto-approved."
      : rs.edited ? "Corrected or entered by the reviewer against the cited page."
      : r.conf >= 90 ? "Value sits in a schedule table under a labelled column; unit and currency matched the column header."
      : r.conf >= 75 ? "Value found in running text rather than a table; unit inferred from the surrounding clause." : "Value partially legible.";
    var flagBox = "";
    if (kind) {
      var fl = r.flag, extra = "";
      if (kind === "fix") extra = '<div class="sugg"><span>Suggested:</span><code>' + esc(fl.suggested) + '</code><button class="btn btn--ok btn--xs act-fix" type="button" data-fix="' + r.key + '">Apply correction</button></div>';
      if (kind === "missing") extra = '<div class="d-enter"><input type="text" placeholder="Value from END-22, e.g. 5,000,000" aria-label="Enter the value" data-enter-input><button class="btn btn--ok btn--xs" type="button" data-save="' + r.key + '">Save and approve</button></div>';
      flagBox = '<div class="d-flag' + (FLAG[kind].cls ? " d-flag--" + FLAG[kind].cls : "") + '"><strong>' + FLAG[kind].label + ": " + esc(fl.rule) + "</strong>" + esc(fl.detail) + (fl.compare ? '<div class="d-compare">' + esc(fl.compare) + "</div>" : "") + extra + "</div>";
    }
    var src = Object.assign({}, r.cells, r.source || {});
    var quote = kind === "missing" ? "Not present on the cited pages — the schedule refers to endorsement END-22, issued separately." : "“" + rowLabel(g, src) + " — " + src.value + unitOf(g, src.value) + (src.basis ? ", " + src.basis.toLowerCase() : "") + ".”";
    var approveLabel = kind === "range" || kind === "consistency" ? "Approve as read" : "Approve";
    var approveDisabled = kind === "fix" ? ' disabled title="Apply the suggested correction, or reject"' : kind === "missing" ? ' disabled title="Enter the value, or mark it not applicable"' : "";
    var actions = rs.status === "pending"
      ? '<button class="btn btn--ok btn--sm act-approve" type="button" data-decide="approved"' + approveDisabled + ">" + approveLabel + '</button><button class="btn btn--danger btn--sm" type="button" data-decide="rejected">Reject</button><button class="btn btn--ghost btn--sm" type="button" data-decide="na">Mark N/A</button>'
      : '<span class="status status--' + rs.status + '">' + { approved: "Approved" + (rs.edited ? " · edited" : ""), rejected: "Rejected", na: "N/A" }[rs.status] + '</span><button class="btn btn--ghost btn--xs" type="button" data-decide="pending">Reopen</button>';
    box.innerHTML = '<div class="details-head"><strong>Row details · ' + esc(g.name) + '</strong><button class="details-close" type="button" aria-label="Close" data-close-details><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="details-grid"><div class="d-col"><span class="eyebrow">Extracted value</span><div class="d-val">' + val + '</div><div class="d-sub">' + esc(rowLabel(g, rs.cells)) + "</div><div class=\"d-sub\">" + esc([rs.cells.basis, rs.cells.scope].filter(Boolean).join(" · ")) + "</div>" + flagBox + "</div>" +
      '<div class="d-col"><span class="eyebrow">Evidence &amp; traceability</span><div class="d-line"><span>Source</span><button class="cite" type="button" data-cite="' + r.key + '">p.' + r.page + "</button> · §" + esc(rs.cells.section) + '</div><div class="d-line"><span>Scenario</span>' + esc(r.scenario || "—") + '</div><div class="d-quote">' + esc(quote) + "</div></div>" +
      '<div class="d-col"><span class="eyebrow">Confidence</span><div class="d-val">' + esc(confText) + '</div><div class="d-sub">' + esc(reason) + '</div><span class="eyebrow" style="margin-top:10px">Actions</span><div class="d-actions">' + actions + "</div></div></div>";
    box.hidden = false;
    tour.reposition();
  }
  $("#details").addEventListener("click", function (e) {
    var t, s = ds();
    if ((t = e.target.closest("[data-close-details]"))) { s.selected = null; renderGroups(); renderDetails(); return; }
    if ((t = e.target.closest("[data-cite]"))) { cite(t.dataset.cite); return; }
    if ((t = e.target.closest("[data-fix]"))) { applyFix(t.dataset.fix); return; }
    if ((t = e.target.closest("[data-save]"))) { var inp = $("[data-enter-input]", $("#details")); var v = inp && inp.value.trim(); if (!v) { toast("Enter the value first, or mark the field not applicable."); return; } enterValue(t.dataset.save, v); return; }
    if ((t = e.target.closest("[data-decide]"))) {
      if (t.dataset.decide === "pending") { var rs = rstate(s.selected); rs.status = "pending"; rs.edited = false; renderReview(); return; }
      decideRow(s.selected, t.dataset.decide);
    }
  });

  /* ---------------- page viewer ---------------- */
  function gotoPage(n) { var s = ds(); s.page = Math.max(1, Math.min(doc().pages, n)); renderPage(s.page); }
  $("#pg-prev").addEventListener("click", function () { gotoPage(ds().page - 1); });
  $("#pg-next").addEventListener("click", function () { gotoPage(ds().page + 1); });
  $("#pg-input").addEventListener("change", function (e) { gotoPage(+e.target.value || 1); });
  function renderPage(n) {
    var d = doc(), s = ds();
    $("#pg-input").value = n;
    var hi = s.hiRow ? findRow(s.hiRow) : null;
    $("#paper").innerHTML = '<div class="p-head"><span>' + esc(d.headLeft) + "</span><span>" + esc(d.headRight) + "</span></div>" + d.pageContent(n, hi) + '<div class="p-foot"><span>Confidential — for the parties only</span><span>Page ' + n + " of " + d.pages + "</span></div>";
    var h = $("#paper .is-hi"); if (h) h.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  /* ---------------- tabs, export, history ---------------- */
  function setTab(id, silent) {
    ds().tab = id;
    $$(".tab").forEach(function (t) { t.classList.toggle("is-active", t.dataset.tab === id); });
    $$(".tabpane").forEach(function (p) { p.classList.toggle("is-active", p.dataset.pane === id); });
    $("#details").hidden = id !== "review" || !ds().selected;
    if (!silent) tour.after(id === "ratecard" ? "tab-ratecard" : "");
    tour.reposition();
  }
  $("#tabs").addEventListener("click", function (e) { var t = e.target.closest(".tab"); if (t) setTab(t.dataset.tab); });
  function statusWord(rs) { return { pending: "Pending", approved: "Approved", rejected: "Rejected", na: "N/A" }[rs.status]; }
  function renderRatecard() {
    var d = doc();
    $("#ratecard-table tbody").innerHTML = rowsOf(S.cur).map(function (x) {
      var rs = rstate(x.r.key), c = rs.cells, cur = unitOf(x.g, c.value).trim();
      return "<tr><td>" + esc(d.id) + "</td><td>" + esc(d.type) + "</td><td>" + esc(x.g.name) + "</td><td>" + esc(rowLabel(x.g, c)) + "</td><td>" + esc(c.scope || "—") + "</td><td>" + esc(c.basis || "—") + '</td><td class="num">' + (c.value === "" ? "—" : esc(c.value)) + "</td><td>" + esc(cur || "—") + "</td><td>§" + esc(c.section) + "</td><td>p." + x.r.page + "</td><td>" + statusWord(rs) + "</td></tr>";
    }).join("");
  }
  function renderJson() {
    var d = doc();
    var out = { document: { id: d.id, type: d.type, schema: d.schema, counterparty: d.counterparty, currency: d.currency, template: d.template }, values: rowsOf(S.cur).filter(function (x) { return rstate(x.r.key).status === "approved"; }).map(function (x) {
      var rs = rstate(x.r.key), c = rs.cells;
      return { group: x.g.name, field: rowLabel(x.g, c), scope: c.scope || null, basis: c.basis || null, value: c.value, currency: unitOf(x.g, c.value).trim() || null, section: c.section, source_page: x.r.page, confidence: x.r.conf / 100, status: rs.edited ? "approved_edited" : "approved" };
    }) };
    $("#json-out").textContent = JSON.stringify(out, null, 2);
  }
  function renderDocHistory() { $("#history-list").innerHTML = timeline(ds().history); }
  function renderGlobalHistory() { $("#history-global").innerHTML = timeline(S.d.msa.history.concat(S.d.pol.history, D.globalHistory)); }
  function timeline(items) {
    if (!items.length) return '<li><time>—</time><i></i><div><strong>Nothing yet</strong><span>Actions on this document will appear here.</span></div></li>';
    return items.map(function (h) { return "<li" + (h.kind ? ' class="' + h.kind + '"' : "") + "><time>" + esc(h.time) + "</time><i></i><div><strong>" + esc(h.text) + "</strong><span>" + esc(h.sub) + "</span></div></li>"; }).join("");
  }
  $("#format-seg").addEventListener("click", function (e) {
    var b = e.target.closest("[data-format]"); if (!b) return;
    S.format = b.dataset.format;
    $$("#format-seg button").forEach(function (x) { x.classList.toggle("is-active", x === b); });
    $("#download-xlsx").lastChild.textContent = "Download ." + S.format;
  });
  $("#download-xlsx").addEventListener("click", function () {
    var n = approvedOf(S.cur), d = doc();
    if (!n) { toast("Nothing approved yet — approve values first."); return; }
    ds().status = "Exported";
    var file = d.template.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "_" + d.id + "." + S.format;
    log(S.cur, "Exported " + n + " approved values", file + " · template " + d.template + " · " + USER, "ok");
    toast('<svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg><span><b>' + esc(file) + "</b> downloaded · " + n + " approved values against " + esc(d.template) + "</span>", 4200);
    renderReview();
    tour.after("download");
  });
  $("#push-target").addEventListener("click", function () {
    var n = approvedOf(S.cur), d = doc();
    if (!n) { toast("Nothing approved yet — approve values first."); return; }
    ds().status = "Exported";
    log(S.cur, "Sent " + n + " approved values to the target system", "Connector: cost / ERP system · template " + d.template + " · " + USER, "ok");
    toast('<svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg><span>Queued for the cost / ERP system · <b>' + n + " approved values</b> · flagged and rejected rows stay behind</span>", 4200);
    renderReview();
  });

  /* ---------------- toast ---------------- */
  var toastT;
  function toast(html, ms) {
    var t = $("#toast"); t.innerHTML = /^</.test(html) ? html : "<span>" + html + "</span>"; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, ms || 3200);
  }

  /* ---------------- tour ---------------- */
  var STEPS = [
    { id: "drop", major: 1, side: "right", title: "Upload the agreement", body: "Click the drop zone and choose the sample file. Nothing is really uploaded — the walkthrough uses a prepared 48-page supplier agreement.", target: function () { return $("#dropzone"); }, auto: openPicker },
    { id: "pick", major: 1, side: "right", title: "Choose the Meridian agreement", body: "Pick the highlighted file.", target: function () { return $("#picker-list li.is-main"); }, auto: function () { selectFile(0); } },
    { id: "open", major: 1, side: "top", title: "Open it", body: "The document is classified by type, its pages routed, the fields extracted against that type's schema, scored, cited and validated — watch the stages.", target: function () { return $("#picker-open"); }, auto: openFile },
    { id: "open-doc", major: 2, side: "bottom", title: "Open the extracted document", body: "Extraction finished: 34 values in 10 groups from 48 pages, one of them flagged for a human. Click the row to review it.", target: function () { return $("#doc-table tr.is-new"); }, auto: function () { openDoc("msa"); } },
    { id: "expand", major: 3, side: "left", title: "Expand a group", body: "Each group holds the values extracted from one part of the document, in the columns its schema needs, with a confidence badge and a pending count. Open Routine cleaning.", target: function () { return $('.group[data-group="cleaning"] .group-head'); }, auto: function () { toggleGroup("cleaning", true); } },
    { id: "cite", major: 4, side: "left", title: "Follow the citation", body: "Every value cites its source page. Click p.7 — the viewer jumps to the page and highlights the row the value came from.", target: function () { return $('.group[data-group="cleaning"] [data-cite="msa:cleaning:0"]'); }, auto: function () { cite("msa:cleaning:0"); } },
    { id: "approve-row", major: 4, side: "top", title: "Approve the value", body: "Row details show the extracted value, its evidence and why the confidence is what it is. Approve it.", target: function () { return $("#details .act-approve"); }, anchor: function () { return $("#details .details-head"); }, auto: function () { decideRow("msa:cleaning:0", "approved"); } },
    { id: "expand-discount", major: 5, side: "left", title: "Resolve the flagged value", body: "A business-rule validator caught a gap between two discount tiers. Open Volume discounts.", target: function () { return $('.group[data-group="discount"] .group-head'); }, auto: function () { toggleGroup("discount", true); } },
    { id: "flag-row", major: 5, side: "left", title: "Open the flagged row", body: "Click the row carrying the validator warning.", target: function () { return $('.group[data-group="discount"] tr.has-flag'); }, auto: function () { selectRow("msa:discount:3"); } },
    { id: "fix", major: 5, side: "top", title: "Apply the suggested correction", body: "The validator names the rule and proposes the fix. One click corrects the value and records who changed what.", target: function () { return $("#details .act-fix"); }, anchor: function () { return $("#details .details-head"); }, auto: function () { applyFix("msa:discount:3"); } },
    { id: "approve-all", major: 6, side: "left", title: "Approve everything else", body: "The remaining values are high-confidence. Approve all takes every pending, unflagged value — a flag always waits for a person.", target: function () { return $("#approve-all"); }, auto: approveAll },
    { id: "tab-ratecard", major: 6, side: "bottom", title: "Open the export", body: "A flat table against the reference template — XLSX, CSV or JSON — and only approved values leave.", target: function () { return $('.tab[data-tab="ratecard"]'); }, auto: function () { setTab("ratecard"); } },
    { id: "download", major: 6, side: "left", title: "Download the file", body: "Each approved value carries its section and source page. A connected cost or ERP system takes the same rows directly.", target: function () { return $("#download-xlsx"); }, auto: function () { $("#download-xlsx").click(); } }
  ];
  var MAJORS = 6;
  var tour = {
    active: false, i: 0, el: $("#tour"), target: null, tries: 0,
    start: function () { this.active = true; this.i = 0; document.body.classList.add("tour-on"); $("#tour-pill").hidden = false; $("#tour-toggle").textContent = "Exit guide"; this.show(); },
    show: function () {
      var st = STEPS[this.i], self = this, t = st.target();
      if (!t) { if (this.tries++ < 40) return void requestAnimationFrame(function () { self.show(); }); return; }
      this.tries = 0;
      if (this.target) this.target.classList.remove("tour-target");
      this.target = t; t.classList.add("tour-target");
      $("#tour-step").textContent = "Step " + st.major + " of " + MAJORS;
      $("#tour-title").textContent = st.title; $("#tour-body").textContent = st.body;
      var bars = ""; for (var k = 1; k <= MAJORS; k++) bars += '<i class="' + (k <= st.major ? "is-done" : "") + '"></i>';
      $("#tour-progress").innerHTML = bars;
      this.el.hidden = false; this.el.dataset.side = st.side;
      try { t.scrollIntoView({ block: "center", behavior: "smooth", inline: "nearest" }); } catch (e) {}
      this.reposition(); setTimeout(function () { self.reposition(); }, 350); setTimeout(function () { self.reposition(); }, 700);
    },
    after: function (id) { if (!this.active || !id) return; if (STEPS[this.i].id === id) this.next(); },
    next: function () {
      if (!this.active) return;
      if (STEPS[this.i].id === "open" && !S.uploaded) { /* processing runs; the documents screen calls next() */
        this.el.hidden = true; if (this.target) { this.target.classList.remove("tour-target"); this.target = null; }
        return;
      }
      this.i++;
      if (this.i >= STEPS.length) return this.finish();
      var self = this; setTimeout(function () { self.show(); }, 260);
    },
    skip: function () { var st = STEPS[this.i]; if (st && st.auto) st.auto(); },
    exit: function () { this.active = false; this.el.hidden = true; if (this.target) this.target.classList.remove("tour-target"); this.target = null; document.body.classList.remove("tour-on"); $("#tour-pill").hidden = true; $("#tour-toggle").textContent = "Restart walkthrough"; },
    finish: function () {
      this.exit();
      var g = $("#gate");
      $("#gate-title").textContent = "That is the whole loop";
      $("#gate-body").innerHTML = "One document went from upload to an exported table, and a human decided every value that left. Now try a second document type: the insurance policy schedule that arrived from the repository has its own schema and three validator kinds the agreement did not need — a value outside its expected band, a required field the schedule does not carry, and two figures that fail a cross-field check.<ol><li>Upload and classify</li><li>Extract against the type's schema and rules</li><li>Score, cite and validate</li><li>Review beside the source page</li><li>Resolve what the validators flagged</li><li>Export only what was approved</li></ol>";
      $("#gate-start").textContent = "Replay the walkthrough"; $("#gate-free").textContent = "Keep exploring";
      $("#gate-alt").hidden = false;
      $("#gate-start").onclick = function () { location.href = location.pathname; };
      $("#gate-free").onclick = function () { g.hidden = true; };
      $("#gate-alt").onclick = function () { g.hidden = true; openDoc("pol"); };
      g.hidden = false;
    },
    reposition: function () {
      if (!this.active || !this.target || this.el.hidden) return;
      if (!document.body.contains(this.target)) { var t = STEPS[this.i].target(); if (t) { this.target.classList.remove("tour-target"); this.target = t; t.classList.add("tour-target"); } else return; }
      var anchor = (STEPS[this.i].anchor && STEPS[this.i].anchor()) || this.target;
      var r = anchor.getBoundingClientRect(), w = 300, h = this.el.offsetHeight || 150, gap = 16, s = STEPS[this.i].side, top, left;
      var fits = { right: r.right + gap + w < innerWidth, left: r.left - gap - w > 0, bottom: r.bottom + gap + h < innerHeight, top: r.top - gap - h > 0 };
      if (!fits[s]) s = ["right", "left", "bottom", "top"].filter(function (k) { return fits[k]; })[0] || "bottom";
      if (s === "right") { left = r.right + gap; top = r.top - 10; }
      if (s === "left") { left = r.left - gap - w; top = r.top - 10; }
      if (s === "bottom") { left = r.left; top = r.bottom + gap; }
      if (s === "top") { left = r.left; top = r.top - gap - h; }
      top = Math.max(8, Math.min(innerHeight - h - 8, top)); left = Math.max(8, Math.min(innerWidth - w - 8, left));
      this.el.style.top = top + "px"; this.el.style.left = left + "px"; this.el.dataset.side = s;
    },
    nudge: function () { var self = this; this.el.classList.remove("is-nudge"); void this.el.offsetWidth; this.el.classList.add("is-nudge"); setTimeout(function () { self.el.classList.remove("is-nudge"); }, 400); }
  };
  document.addEventListener("click", function (e) {
    if (!tour.active || !tour.target) return;
    if (e.target.closest("#tour, #tour-toggle, #gate")) return;
    var el = e.target.closest("button, a, tr.clickable, .group-head, li[data-file], .tab, .cite, input, label");
    if (!el) return;
    if (tour.target.contains(el) || el.contains(tour.target)) return;
    e.preventDefault(); e.stopPropagation(); tour.nudge();
  }, true);
  window.addEventListener("resize", function () { tour.reposition(); });
  document.addEventListener("scroll", function () { tour.reposition(); }, true);
  $("#tour-skip").addEventListener("click", function () { tour.skip(); });
  $("#tour-toggle").addEventListener("click", function () { if (tour.active) tour.exit(); else location.href = location.pathname; });

  /* ---------------- keyboard ---------------- */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || tour.active) return;
    if (!picker.hidden) { picker.hidden = true; return; }
    if (!$("#gate").hidden) { $("#gate").hidden = true; return; }
    if (S.screen === "review" && ds().selected) { ds().selected = null; renderGroups(); renderDetails(); }
  });

  /* ---------------- boot ---------------- */
  go("upload");
  if (params.get("ui") === "clean") { $("#tour-toggle").hidden = true; } /* screenshot mode: product UI only */
  if (params.get("tour") === "off") { tour.exit(); $("#gate").hidden = true; }
  else {
    $("#gate").hidden = false;
    $("#gate-start").addEventListener("click", function () { $("#gate").hidden = true; tour.start(); });
    $("#gate-free").addEventListener("click", function () { $("#gate").hidden = true; tour.exit(); });
  }
  if (params.get("doc") === "pol") { $("#gate").hidden = true; tour.exit(); openDoc("pol"); }
  window.DEMO = { state: S, tour: tour, go: go, openDoc: openDoc };
})();
