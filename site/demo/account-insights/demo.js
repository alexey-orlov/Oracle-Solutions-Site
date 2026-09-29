/* demo.js — Account insights walkthrough.
 * Built on tour-engine.js. Every number on screen comes out of
 * kpis(appliedIds()); every flag out of flagsFor(appliedIds()). The data in
 * data.js never mutates: the viewer's decisions live in S only.
 */
(function () {
  "use strict";

  var D = window.AIX;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch];
    });
  }
  var FAST = new URLSearchParams(location.search).get("fast") === "1";

  var MOVES = D.moves;
  var MAIN = MOVES.filter(function (m) { return !m.filtered; });
  var FILTERED = MOVES.filter(function (m) { return m.filtered; });
  function move(id) { return MOVES.filter(function (m) { return m.id === id; })[0]; }
  function acc(id) { return D.accounts.filter(function (a) { return a.id === id; })[0]; }
  function sig(id) { return D.signals.filter(function (s) { return s.id === id; })[0]; }
  function lineName(id) { var l = D.lines.filter(function (x) { return x.id === id; })[0]; return l ? l.name : ""; }
  function person(k) { return D.people[k]; }

  var REL = { named: "Named", supplier: "Supplier", customer: "Customer", competitor: "Competitor", twostep: "Two steps" };

  /* ---- state: the run and the reviewer's decisions ---- */
  var S = {
    ran: false, busy: false, stage: -1, feedN: 0,
    kpi: null, open: null, view: "today",
    decided: {},    // move id -> { state: "approved" | "rejected", reason }
    admitted: {},   // filtered move id -> true
    confirmed: {},  // held move id -> account id
    sent: false, mode: "table", showFiltered: false, runOpen: false
  };

  /* A move is in front of the sellers once the check has run, unless a
     reviewer rejected it or the confidence line filtered it out. */
  function inFront(m) {
    if (!S.ran) return false;
    if (S.decided[m.id] && S.decided[m.id].state === "rejected") return false;
    if (m.filtered && !S.admitted[m.id]) return false;
    return true;
  }
  function appliedIds() { return MOVES.filter(inFront).map(function (m) { return m.id; }); }
  function isHeld(m) { return !!(m.held && !S.confirmed[m.id]); }
  function status(m) {
    if (!S.ran) return "none";
    if (m.filtered && !S.admitted[m.id]) return "filtered";
    var d = S.decided[m.id];
    if (d) return d.state;
    if (isHeld(m)) return "held";
    return m.filtered ? "admitted" : "open";
  }

  /* Minutes from publication to this morning's review. */
  function ageMin(m) {
    var s = sig(m.signal);
    return s.day === 0 ? D.now.min - s.min : (24 * 60 - s.min) + D.now.min;
  }
  function median(xs) {
    if (!xs.length) return 0;
    var a = xs.slice().sort(function (x, y) { return x - y; }), h = Math.floor(a.length / 2);
    return a.length % 2 ? a[h] : (a[h - 1] + a[h]) / 2;
  }

  /* kpis(applied): a pure function of which moves are in front of the sellers.
     "By hand" is the same list reached the way the team works today: only the
     companies named in the news, found at each account's next review, after
     researching each one. Deltas come from these raw values, never from the
     rounded displays. */
  function kpis(applied) {
    var list = applied.map(move);
    return {
      before: {
        moves: list.filter(function (m) { return m.rel === "named"; }).length,
        days: median(list.map(function (m) { return acc(m.account).review; })),
        research: list.reduce(function (t, m) { return t + m.research; }, 0)
      },
      after: {
        moves: list.length,
        missed: list.filter(function (m) { return m.rel !== "named"; }).length,
        protect: list.filter(function (m) { return m.kind === "protect"; }).length,
        minutes: median(list.map(ageMin)),
        research: list.reduce(function (t, m) { return t + m.review; }, 0)
      }
    };
  }

  /* flagsFor(applied): computed from state, never stored. `decision: true`
     is the human gate: such a move cannot be approved or sent in bulk. */
  function flagsFor(applied) {
    var out = {};
    MOVES.forEach(function (m) {
      var f = (m.flags || []).slice();
      if (isHeld(m)) f.unshift({ kind: "decision", decision: true, text: "“Keswick” matches two of your accounts: confirm which" });
      if (m.filtered && !S.admitted[m.id]) f.unshift({ kind: "warn", text: "Below the confidence line of " + D.threshold + ": filtered, not deleted" });
      if (m.filtered && S.admitted[m.id]) f.unshift({ kind: "info", text: "Admitted below the confidence line by the reviewer" });
      var d = S.decided[m.id];
      if (d && d.state === "rejected") f.unshift({ kind: "info", text: "Rejected: " + d.reason + ". The reason is kept" });
      out[m.id] = { flags: f, inFront: applied.indexOf(m.id) !== -1 };
    });
    return out;
  }

  /* ---- formatting ---- */
  function fmtDuration(min) {
    var r = Math.round(min / 10) * 10;
    if (r < 60) return Math.max(1, Math.round(min)) + " min";
    var h = Math.floor(r / 60), mm = r % 60;
    return mm ? h + " h " + mm + " min" : h + " h";
  }
  function fmtResearch(min) {
    if (min < 60) return Math.round(min) + " min";
    var h = Math.floor(min / 60), mm = Math.round(min % 60);
    return mm ? h + " h " + mm + " min" : h + " h";
  }
  function fmtDays(d) { var r = Math.round(d); return r + (r === 1 ? " day" : " days"); }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  var ICONS = {
    wire: '<path d="M4 6h16M4 10h16M4 14h10M4 18h7"/>',
    filing: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    market: '<path d="M4 17l5-5 4 3 7-7"/><path d="M15 8h5v5"/>',
    hand: '<path d="M4 20l4-1 10-10-3-3L5 16z"/><path d="M13 7l3 3"/>',
    crm: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 11h5M16 15h5M16 7h5"/>',
    catalog: '<path d="M4 5h16v4H4zM4 11h16v4H4zM4 17h10v3H4z"/>',
    merge: '<path d="M6 4v5a4 4 0 0 0 4 4h8M14 9l4 4-4 4M6 20v-3"/>',
    book: '<path d="M3 21h18M5 21V8l7-4 7 4v13"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    hold: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    thin: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
    map: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
    done: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  function icon(k) { return '<svg class="i" viewBox="0 0 24 24">' + (ICONS[k] || "") + "</svg>"; }
  function avatar(k) { return '<span class="avatar avatar--' + k.toLowerCase() + '" title="' + esc(person(k).name) + '">' + k + "</span>"; }
  function relChip(m) { return '<span class="rel rel--' + m.rel + '">' + REL[m.rel] + "</span>"; }
  function kindChip(m) { return '<span class="kind kind--' + m.kind + '">' + (m.kind === "sell" ? "Sell" : "Protect") + "</span>"; }
  function statusChip(m) {
    var st = status(m);
    if (st === "approved") return '<span class="st st--approved">Approved</span>';
    if (st === "rejected") return '<span class="st st--rejected">Rejected</span>';
    if (st === "held") return '<span class="st st--held">Confirm account</span>';
    if (st === "admitted") return '<span class="st st--admitted">Admitted</span>';
    if (st === "filtered") return '<span class="st st--open">Below the line</span>';
    return '<span class="st st--open">To review</span>';
  }
  function withCites(text) {
    return esc(text).replace(/\[(\d)\]/g, '<span class="cite">$1</span>');
  }

  /* ---- renderers ---- */
  function renderTopbar() {
    var names = { today: "Today", accounts: "Accounts", setup: "Setup", export: "Export" };
    var c = '<span>Account insights</span><span class="sep">›</span><b>' + names[S.view] + "</b>";
    if (S.view === "today" && S.open) c += '<span class="sep">›</span><b>' + esc(acc(move(S.open).account).name) + "</b>";
    $("#crumbs").innerHTML = c;
    $("#check-note").innerHTML = icon("clock") + (S.ran ? "Checked " + D.lastCheck.after + " · next " + D.lastCheck.next
      : "Last check " + D.lastCheck.before + " · next " + D.lastCheck.beforeNext);
  }

  function renderNav() {
    $$(".nav [role=tab]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.view === S.view)); });
    ["today", "accounts", "setup", "export"].forEach(function (v) { $("#view-" + v).hidden = S.view !== v; });
    var open = MOVES.filter(function (m) { var st = status(m); return st === "open" || st === "held" || st === "admitted"; }).length;
    var ct = $("#count-today");
    ct.hidden = !S.ran || !open;
    ct.textContent = open;
    var approved = MOVES.filter(function (m) { return status(m) === "approved"; }).length;
    var ce = $("#count-export");
    ce.hidden = !approved;
    ce.textContent = approved;
  }

  /* The strip shows the four outside sources and one card for the team's own
     records (the CRM and the service lines), which ground every move. */
  function renderSources() {
    var cards = D.sources.filter(function (s) { return !s.first; }).map(function (s) {
      var state;
      if (s.status === "warn") state = '<span class="src-state is-warn">' + (S.ran ? "Read · 1 feed down" : s.count + " new · 1 feed down") + "</span>";
      else state = '<span class="src-state">' + (S.ran ? "Read " + D.lastCheck.after : s.count + " new since 18:00") + "</span>";
      return '<div class="src"><div class="src-top"><span class="src-ico">' + icon(s.icon) +
        "</span><b>" + esc(s.name) + '</b></div><span class="src-line">' + esc(s.line) + "</span>" + state + "</div>";
    });
    cards.push('<div class="src is-first"><div class="src-top"><span class="src-ico">' + icon("crm") + '</span><b>Your records</b></div>' +
      '<span class="src-line">CRM: 24 accounts · 12 service lines</span><span class="src-state is-first">Grounds every move</span></div>');
    $("#sources").innerHTML = cards.join("");
  }

  function renderHead() {
    var k = kpis(appliedIds());
    var helper;
    if (!S.ran && !S.busy) helper = "214 stories on your 24 accounts since 18:00, unread.";
    else if (S.busy) helper = "Reading 214 stories against your 24 accounts…";
    else if (S.sent) helper = "Sent: " + plural(MOVES.filter(function (m) { return status(m) === "approved"; }).length, "record", "records") + " for the CRM, one per account.";
    else helper = plural(k.after.moves, "next move", "next moves") + " from 5 signals, waiting for your call.";
    $("#today-helper").textContent = helper;
    var run = $("#btn-run");
    run.hidden = S.ran;
    run.disabled = S.busy;
    run.textContent = S.busy ? "Checking…" : "Check the news now";
    var rest = $("#btn-approve-rest");
    var n = MOVES.filter(function (m) { var st = status(m); return st === "open" || st === "admitted"; }).length;
    rest.hidden = !S.ran;
    rest.disabled = !n;
    rest.textContent = n ? "Approve the rest (" + n + ") and send" : (S.sent ? "Sent to the CRM file" : "Nothing left to approve");
  }

  function renderBook() {
    var box = $("#book");
    box.hidden = S.ran || S.busy;
    if (box.hidden) return;
    var rows = D.accounts.slice().sort(function (a, b) { return b.unread - a.unread; }).slice(0, 10);
    box.innerHTML = '<div class="book-lead"><span class="big">214</span><span>stories since 18:00 on your book, unread. Most accounts are next reviewed weeks from now.</span></div>' +
      '<div class="book-grid">' + rows.map(function (a) {
        return '<div class="book-row"><span class="acc">' + avatar(a.owner) + "<b>" + esc(a.name) + '</b></span><span class="unread">' +
          plural(a.unread, "story", "stories") + '</span><span class="due">next review in ' + a.review + " days</span></div>";
      }).join("") + '</div><p class="book-foot">Showing the 10 busiest of 24 accounts.</p>';
  }

  function renderRun() {
    var box = $("#run"), sum = $("#run-sum");
    var showFull = S.busy || (S.ran && S.runOpen) || S.stage >= 0 && !S.ran;
    box.hidden = !showFull;
    sum.hidden = !S.ran || S.runOpen;
    if (!box.hidden) {
      $("#stages").innerHTML = D.stages.map(function (st, i) {
        var cls = S.ran || i < S.stage ? "is-done" : i === S.stage ? "is-live" : "";
        return '<li class="' + cls + '"><b>' + esc(st.label) + "</b><span>" + (cls ? esc(st.detail) : "Waiting") + "</span></li>";
      }).join("");
      $("#feed").innerHTML = D.feed.slice(0, S.ran ? D.feed.length : S.feedN).map(function (f) {
        return '<li class="k-' + f.icon + '"><i>' + icon(f.icon) + "</i><span>" + esc(f.text) + "</span></li>";
      }).join("");
      $("#run-state").textContent = S.ran ? "Done at " + D.lastCheck.after : "Running";
    }
    if (!sum.hidden) {
      sum.innerHTML = '<span class="ok"></span><span>Checked at ' + D.lastCheck.after + ": <b>214 stories</b>, 5 signals, 15 account reads, 2 filtered.</span>" +
        '<span class="more">Show the steps</span>';
    }
  }

  var KPI_DEF = {
    moves: { label: "Next moves in front of your sellers", owner: "Chief commercial officer" },
    time: { label: "From an account's news to a next move", owner: "Head of sales" },
    research: { label: "Time spent researching, not selling", owner: "Head of key-account management" }
  };
  function renderBand() {
    var band = $("#band");
    band.hidden = !S.ran;
    if (band.hidden) return;
    var k = kpis(appliedIds()), b = k.before, a = k.after;
    var tiles = {
      moves: { before: String(b.moves), after: String(a.moves), delta: (a.moves - b.moves >= 0 ? "+" : "−") + Math.abs(a.moves - b.moves),
        line: plural(a.missed, "move", "moves") + " on accounts the news never named · " + plural(a.protect, "renewal", "renewals") + " to protect" },
      time: { before: fmtDays(b.days), after: fmtDuration(a.minutes), delta: a.minutes < 24 * 60 ? "same day" : "",
        line: "By hand: the account's next review. Here: this morning." },
      research: { before: fmtResearch(b.research), after: fmtResearch(a.research),
        delta: b.research ? "−" + Math.round((1 - a.research / b.research) * 100) + "%" : "",
        line: "Reaching the same list by hand, against reviewing it." }
    };
    ["moves", "time", "research"].forEach(function (id) {
      var t = tiles[id], el = $("#kpi-" + id);
      el.innerHTML = '<span class="k-label">' + esc(KPI_DEF[id].label) + '</span><span class="k-vals"><s>' + esc(t.before) +
        '</s><span class="k-arrow">→</span><b class="k-after">' + esc(t.after) + "</b>" + (t.delta ? '<em class="k-delta">' + esc(t.delta) + "</em>" : "") +
        '</span><span class="k-line">' + esc(t.line) + '</span><span class="k-owner">Owner · ' + esc(KPI_DEF[id].owner) + "</span>";
      el.classList.toggle("is-selected", S.kpi === id);
    });
  }

  /* The context column of a row follows the number the viewer opened: that
     move's own share of it, by hand against with the product. */
  function rowContext(m) {
    if (S.kpi === "time") return '<span class="r-ctx"><s>' + fmtDays(acc(m.account).review) + "</s> → <b>" + fmtDuration(ageMin(m)) + "</b></span>";
    if (S.kpi === "research") return '<span class="r-ctx"><s>' + m.research + " min</s> → <b>" + m.review + " min</b></span>";
    return '<span class="r-scores"><span class="sc" title="Magnitude">M ' + m.m + '</span><span class="sc" title="Confidence">C ' + m.c + "</span></span>";
  }
  function readRow(m) {
    var a = acc(m.account), st = status(m);
    var cls = ["read"];
    if (S.open === m.id) cls.push("is-open");
    if (st === "rejected") cls.push("is-rejected");
    if (S.kpi === "moves") cls.push(m.rel === "named" ? "is-dim" : "is-hit");
    var note = "";
    if (st === "rejected") note = '<span class="r-note">Rejected: ' + esc(S.decided[m.id].reason) + "</span>";
    /* The status sits beside the name, so the row's left part (what a zoomed
       product-page frame shows) carries the whole decision. An open move
       needs no chip: the list is the review queue. */
    var chip = st === "open" ? "" : statusChip(m);
    return '<li class="' + cls.join(" ") + '" data-move="' + m.id + '"><span class="r-main"><span class="r-name"><b>' + esc(a.name) + "</b>" + relChip(m) + kindChip(m) + chip +
      '</span><span class="r-sub">' + esc(lineName(m.line)) + " · " + esc(m.relNote.split(" · ")[0]) + '</span></span><span class="r-side">' + rowContext(m) + "</span>" + note + "</li>";
  }
  function renderGroups() {
    var work = $("#work");
    work.hidden = !S.ran;
    if (work.hidden) return;
    var titles = { moves: "Where the moves came from", time: "How soon each move reached a seller", research: "Research each move saved" };
    var helpers = {
      moves: "Highlighted: accounts the news never named, reached through your records.",
      time: "Each account's next review, against this morning.",
      research: "Minutes to reach each move by hand, against reviewing it."
    };
    $("#moves-title").textContent = S.kpi ? titles[S.kpi] : "Next moves, by story";
    $("#moves-helper").textContent = S.kpi ? helpers[S.kpi] : "Open a move to see its evidence.";
    $("#groups").innerHTML = D.signals.map(function (s) {
      var ms = MAIN.filter(function (m) { return m.signal === s.id; });
      var reads = MOVES.filter(function (m) { return m.signal === s.id; }).length;
      var srcLine = s.source + (s.by ? " by " + person(s.by).name : "") + " · " + (s.day === 0 ? "today " : "yesterday ") + s.time +
        (s.merged > 1 ? " · merged from " + s.merged + " reports" : "");
      return '<section class="grp" data-signal="' + s.id + '"><header class="grp-head"><span class="src-ico">' + icon(s.icon) +
        '</span><div class="grp-meta"><span>' + esc(srcLine) + "</span><b>" + esc(s.title) + '</b></div><span class="chip chip--grey">' +
        plural(reads, "account", "accounts") + '</span></header><ol class="reads">' + ms.map(readRow).join("") + "</ol></section>";
    }).join("");
    var fl = $("#filtered");
    var hidden = FILTERED.filter(function (m) { return !S.admitted[m.id]; }).length;
    fl.innerHTML = '<div class="filtered-head"><span>' + (hidden ? plural(hidden, "move", "moves") + " below the confidence line: filtered and counted, not deleted."
      : "Every filtered move was admitted by a reviewer.") + '</span><button type="button" class="linkbtn" data-act="toggle-filtered">' +
      (S.showFiltered ? "Hide" : "Show") + "</button></div>" +
      (S.showFiltered ? '<ol class="reads">' + FILTERED.map(readRow).join("") + "</ol>" : "");
  }

  function meter(v) {
    var s = '<span class="meter" aria-hidden="true">';
    for (var i = 1; i <= 10; i++) s += '<i class="' + (i <= v ? "on" : "") + '"></i>';
    return s + "</span>";
  }
  function renderBrief() {
    var box = $("#brief");
    if (!S.ran) { box.innerHTML = ""; return; }
    var m = S.open && move(S.open);
    if (!m) {
      box.innerHTML = '<div class="empty">Open a move to see what changes, what to offer, both scores and every source behind it.</div>';
      return;
    }
    var a = acc(m.account), s = sig(m.signal), st = status(m);
    var fl = flagsFor(appliedIds())[m.id].flags;
    var h = [];
    h.push('<div class="b-sec b-head"><div class="row"><span class="eyebrow">Next move · ' + m.id + "</span>" + avatar(a.owner) + "</div><h3>" + esc(a.name) +
      '</h3><div class="chips">' + relChip(m) + kindChip(m) + statusChip(m) + '</div><p class="b-rel">' + esc(m.relNote) +
      '</p><p class="b-from">From: ' + esc(s.title) + "</p></div>");
    h.push('<div class="b-sec"><div class="b-scores"><div class="score"><span>Magnitude</span><b>' + m.m + "<small>/10</small></b>" + meter(m.m) +
      '</div><div class="score"><span>Confidence</span><b>' + m.c + "<small>/10</small></b>" + meter(m.c) + "</div></div></div>");
    h.push('<div class="b-sec"><h4>What changes</h4><p>' + withCites(m.what) + "</p></div>");
    h.push('<div class="b-sec b-offer"><h4>' + (m.kind === "sell" ? "What you could sell" : "What to protect") + '</h4><span class="line-chip">' +
      esc(lineName(m.line)) + "</span><ul>" + m.offer.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul></div>");
    h.push('<div class="b-sec b-next"><h4>Suggested next move</h4><p>' + esc(m.next) + '</p><p class="meta">Owner ' + avatar(a.owner) + esc(person(a.owner).name) + "</p></div>");
    h.push('<div class="b-sec blk-sources"><h4>Sources · ' + m.sources.length + ' cited</h4><ol class="cites">' + m.sources.map(function (c, i) {
      return '<li><span class="cite">' + (i + 1) + "</span><b>" + esc(c.kind) + " <span>· " + esc(c.meta) + "</span></b><q>" + esc(c.quote) + "</q></li>";
    }).join("") + "</ol></div>");
    h.push('<div class="b-sec"><h4>How it got here</h4><ol class="trace">' + m.trace.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol></div>");
    if (fl.length) h.push('<div class="b-sec"><ul class="b-flags">' + fl.map(function (f) { return '<li class="' + f.kind + '">' + esc(f.text) + "</li>"; }).join("") + "</ul></div>");
    h.push('<div class="b-sec review" id="review">' + reviewControls(m, st) + "</div>");
    box.innerHTML = h.join("");
  }
  function reviewControls(m, st) {
    if (st === "filtered") {
      return '<p class="state">Below the confidence line, so it was kept off the list. Admit it if you know better.</p>' +
        '<div class="row"><button type="button" class="btn" data-act="admit">Admit it to the list</button></div>';
    }
    if (st === "held") {
      return '<p class="q">' + esc(m.held.question) + '</p><div class="row">' + m.held.options.map(function (id) {
        return '<button type="button" class="btn" data-act="confirm" data-acc="' + id + '">' + esc(acc(id).name) + "</button>";
      }).join("") + "</div>";
    }
    if (st === "approved") {
      return '<p class="state">Approved. It goes to the CRM file with its sources.</p><div class="row"><button type="button" class="btn" data-act="undo">Undo</button></div>';
    }
    if (st === "rejected") {
      return '<p class="state">Rejected: ' + esc(S.decided[m.id].reason) + '. The reason is kept with the decision.</p><div class="row"><button type="button" class="btn" data-act="undo">Restore it</button></div>';
    }
    return '<label>Reason, if you reject<select id="reason">' + D.reasons.map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("") +
      '</select></label><div class="row"><button type="button" class="btn btn--danger" id="btn-reject">Reject</button>' +
      '<button type="button" class="btn btn--ok is-filled" id="btn-approve">' + icon("check") + "Approve</button></div>";
  }

  function renderAccounts() {
    var rows = D.accounts.map(function (a) {
      var ms = MOVES.filter(function (m) { return m.account === a.id && S.ran && (!m.filtered || S.admitted[m.id]); });
      var mv = ms.length ? ms.map(function (m) { return kindChip(m) + " " + esc(lineName(m.line)); }).join("<br>") : '<span class="sub">—</span>';
      return "<tr><td><span class=\"acc-name\">" + esc(a.name) + '</span><span class="sub">' + a.id + " · tier " + a.tier + "</span></td><td>" + esc(a.sector) +
        "</td><td class=\"nowrap\">" + avatar(a.owner) + "</td><td>" + esc(a.today) + (a.thin ? '<span class="sub">No relationship notes</span>' : "") +
        (a.renewal ? '<span class="sub">' + esc(a.renewal) + "</span>" : "") + '</td><td class="nowrap">in ' + a.review + " days</td><td>" + mv + "</td></tr>";
    }).join("");
    $("#accounts-table").innerHTML = "<thead><tr><th>Account</th><th>Sector</th><th>Owner</th><th>What we do today</th><th>Next review</th><th>This morning</th></tr></thead><tbody>" + rows + "</tbody>";
  }

  function renderSetup() {
    $("#setup-sources").innerHTML = D.sources.map(function (s) {
      var st = s.first ? '<span class="chip chip--grey">Your records</span>' : s.status === "warn" ? '<span class="chip chip--amber">1 feed down</span>' : '<span class="chip chip--green">Connected</span>';
      return '<li><span class="src-ico">' + icon(s.icon) + "</span><span><b>" + esc(s.name) + '</b><span class="sub">' + esc(s.note || s.line) + "</span></span>" + st + "</li>";
    }).join("");
    var used = MOVES.map(function (m) { return m.line; });
    $("#setup-lines").innerHTML = D.lines.map(function (l) { return '<li class="' + (used.indexOf(l.id) !== -1 && S.ran ? "is-used" : "") + '">' + esc(l.name) + "</li>"; }).join("");
    $("#lines-helper").textContent = S.ran ? "Every move names one; blue: named this morning" : "Every move names one of these";
    $("#setup-rules").innerHTML = D.rules.map(function (r) { return "<li><span>" + esc(r) + "</span></li>"; }).join("");
    $("#setup-tiers").innerHTML = D.tiers.map(function (t) { return "<li><span>" + esc(t.what) + '</span><span class="t t--' + t.cls + '">' + t.tier + "</span></li>"; }).join("");
  }

  function exportRows() {
    return MOVES.filter(function (m) { return status(m) === "approved"; });
  }
  function recordOf(m) {
    var a = acc(m.account), s = sig(m.signal);
    return {
      account: { name: a.name, account_id: a.id, owner: person(a.owner).name, sector: a.sector },
      trigger: { signal_id: s.id, title: s.title, source: s.source, merged_reports: s.merged },
      reached_as: REL[m.rel].toLowerCase(),
      move: { kind: m.kind, service_line: lineName(m.line), next_step: m.next, magnitude: m.m, confidence: m.c },
      impact_reasoning: m.what.replace(/\s?\[\d\]/g, ""),
      sources: m.sources.map(function (c) { return c.kind + " · " + c.meta; }),
      review: { decision: "approved", by: "Robin Hale" }
    };
  }
  function renderExport() {
    var rows = exportRows();
    $("#export-file").textContent = D.exportFile;
    $("#export-helper").textContent = rows.length ? plural(rows.length, "record", "records") + ", one per account" : "Approved moves appear here";
    $$(".seg-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.mode === S.mode)); });
    $("#export-table-wrap").hidden = S.mode !== "table";
    $("#export-json").hidden = S.mode !== "json";
    $("#export-table").innerHTML = "<thead><tr>" + D.exportColumns.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      (rows.length ? rows.map(function (m) {
        var a = acc(m.account), s = sig(m.signal);
        return '<tr><td><b>' + esc(a.name) + "</b></td><td>" + esc(person(a.owner).name) + "</td><td>" + kindChip(m) + "</td><td>" + esc(lineName(m.line)) +
          '</td><td><span class="sc">' + m.m + '/10</span></td><td><span class="sc">' + m.c + "/10</span></td><td>" + m.sources.length + " cited</td><td>" + s.id +
          "</td><td>" + REL[m.rel] + '</td><td class="wrap">' + esc(m.next) + "</td><td>" + a.id + "</td><td>Robin Hale</td></tr>";
      }).join("") : '<tr><td colspan="' + D.exportColumns.length + '"><span class="sub">Approve moves on the Today screen; they appear here.</span></td></tr>') + "</tbody>";
    $("#export-json").textContent = rows.length ? JSON.stringify(recordOf(rows[0]), null, 2) : "{}";
    var kept = MOVES.filter(function (m) { var st = status(m); return st === "rejected" || st === "held" || st === "open" || st === "admitted"; });
    $("#kept").innerHTML = '<div class="card-h"><b>Kept out of the file</b><span class="helper">Only approved moves are exported</span></div><ul>' +
      (kept.length ? kept.map(function (m) {
        var st = status(m), why = st === "rejected" ? "Rejected: " + S.decided[m.id].reason : st === "held" ? "Waiting: confirm which Keswick" : "Waiting for a decision";
        return "<li><b>" + esc(acc(m.account).name) + "</b><span>" + esc(why) + "</span></li>";
      }).join("") : "<li><span>Nothing: every move in front of the team was approved.</span></li>") + "</ul>";
  }

  function render() {
    renderTopbar();
    renderNav();
    renderHead();
    renderSources();
    renderRun();
    renderBand();
    renderBook();
    renderGroups();
    renderBrief();
    renderAccounts();
    renderSetup();
    renderExport();
    if (tour) tour.reposition();
  }

  /* ---- actions ---- */
  var toastTimer = null;
  function toast(text) {
    var t = $("#toast");
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2800);
  }

  function run() {
    if (S.ran || S.busy) return;
    S.busy = true; S.stage = 0; S.feedN = 0;
    render();
    var feedAt = function (i) { return D.feed.filter(function (f) { return f.at <= i; }).length; };
    (function step() {
      if (S.stage >= D.stages.length) return finishRun();
      var target = feedAt(S.stage);
      (function drip() {
        if (S.feedN < target) { S.feedN++; renderRun(); return void setTimeout(drip, FAST ? 10 : 260); }
        renderRun();
        setTimeout(function () { S.stage++; renderRun(); step(); }, FAST ? 30 : 520);
      })();
    })();
  }
  function finishRun() {
    S.ran = true; S.busy = false; S.stage = D.stages.length; S.feedN = D.feed.length;
    render();
    toast("13 next moves ready: 7 on accounts the news never named.");
    if (tour.active && tour.stepId() === "run") tour.next();
  }

  function showView(v) { S.view = v; render(); window.scrollTo(0, 0); }
  function selectKpi(id) {
    S.kpi = S.kpi === id && !tour.active ? null : id;
    S.view = "today";
    render();
  }
  function openMove(id) {
    S.open = id;
    S.view = "today";
    render();
    if (window.innerWidth <= 1100) {
      try { $("#brief").scrollIntoView({ block: "start", behavior: "smooth" }); } catch (e) {}
    } else {
      $("#brief").scrollTop = 0;
    }
  }
  function decide(id, state, reason) {
    var m = move(id);
    if (!m || isHeld(m)) return;
    S.decided[id] = { state: state, reason: reason || "" };
    render();
    toast(state === "approved" ? "Approved: it goes to the CRM file with its sources." : "Rejected, reason kept. The numbers are updated.");
  }
  function reject(id) {
    var sel = $("#reason");
    decide(id, "rejected", sel ? sel.value : D.reasons[0]);
  }
  function undo(id) {
    var was = S.decided[id];
    delete S.decided[id];
    render();
    toast(was && was.state === "rejected" ? "Restored to the list. The numbers are updated." : "Approval undone.");
  }
  function confirmAccount(id, accId) {
    var m = move(id);
    if (!m || !m.held) return;
    if (accId !== m.held.answer) { toast("Keswick Glass has no link to Brenmoor. Try the other one."); return; }
    S.confirmed[id] = accId;
    render();
    toast("Matched to Keswick Components. The move can now be approved.");
  }
  function admit(id) {
    S.admitted[id] = true;
    render();
    toast("Admitted below the confidence line. The numbers are updated.");
  }
  function approveRest() {
    var n = 0;
    MOVES.forEach(function (m) {
      var st = status(m);
      if (st === "open" || st === "admitted") { S.decided[m.id] = { state: "approved", reason: "" }; n++; }
    });
    S.sent = true;
    S.view = "export";
    render();
    window.scrollTo(0, 0);
    var held = MOVES.filter(function (m) { return status(m) === "held"; }).length;
    toast(n + " approved and sent" + (held ? "; the Keswick move waits for you." : "."));
  }

  /* ---- the tour ---- */
  var STEPS = [
    { id: "sources", major: 1, passive: true, side: "bottom",
      title: "Every account, every source",
      body: "Your 24 accounts, their owners and your 12 service lines, against newswires, filings and market news. 214 stories landed since last night; nobody has read them.",
      target: function () { return $("#sources"); },
      auto: function () { tour.next(); } },
    { id: "run", major: 1, waits: true, side: "bottom",
      title: "Read this morning's news",
      body: "Watch the stories become signals: noise dropped, repeats merged, each matched to the accounts it reaches and worked through to a next move.",
      target: function () { return $("#btn-run"); },
      auto: run },
    { id: "value", major: 2, passive: true, side: "bottom", scroll: "center",
      title: "Moves your team would have missed",
      body: "Thirteen next moves instead of six: seven sit on accounts the news never named. They reach a seller the morning the news breaks, not at the next account review.",
      target: function () { return $("#band"); },
      anchor: function () { return $("#kpi-moves"); },
      auto: function () { tour.next(); } },
    { id: "drill", major: 3, side: "bottom",
      title: "See where the moves came from",
      body: "Open the number. Each story fans out to the accounts it reaches: the company named, its suppliers, its customers, its competitors.",
      target: function () { return $("#kpi-moves"); },
      auto: function () { selectKpi("moves"); tour.next(); } },
    { id: "open", major: 4, side: "bottom", scroll: "center",
      title: "Open a move nobody asked for",
      body: "Meridian Grocers is not in the story. It buys from Alder Foods, and its inbound contract with you ends next year.",
      target: function () { return $('li[data-move="MV-03"]'); },
      auto: function () { openMove("MV-03"); tour.next(); } },
    { id: "brief", major: 4, passive: true, side: "left",
      title: "The reasoning, with its sources",
      body: "What changes, what you could sell, how big and how sure. Every claim is cited to the article, the filing or your own CRM note.",
      target: function () { return $("#brief"); },
      anchor: function () { return $("#brief .b-scores"); },
      avoid: function () { return $("#brief"); },
      auto: function () { tour.next(); } },
    { id: "flagged", major: 5, side: "bottom", scroll: "center",
      title: "Open the move already in hand",
      body: "Baltic Packaging's new lane is already in the Lindmark team's plan. The system cannot see your pipeline; you can.",
      target: function () { return $('li[data-move="MV-02"]'); },
      auto: function () { openMove("MV-02"); tour.next(); } },
    { id: "reject", major: 5, side: "left",
      title: "Reject it, with your reason",
      body: "Pick the reason and reject. It stays with the decision, so the next reviewer sees why this move was turned down.",
      target: function () { return $("#review"); },
      avoid: function () { return $("#review"); },
      auto: function () { reject("MV-02"); tour.next(); } },
    { id: "follow", major: 5, passive: true, side: "bottom", scroll: "center",
      title: "The numbers follow your call",
      body: "Twelve moves now, six never named, and the time and research totals move with them. Restore the move and they return.",
      target: function () { return $("#band"); },
      anchor: function () { return $("#kpi-moves"); },
      auto: function () { tour.next(); } },
    { id: "send", major: 6, side: "bottom",
      title: "Approve the rest and send",
      body: "Only approved moves reach your CRM, one record per account. The Keswick move waits: the story's name matches two of your accounts.",
      target: function () { return $("#btn-approve-rest"); },
      auto: function () { approveRest(); tour.next(); } },
    { id: "file", major: 6, passive: true, side: "top",
      dock: window.innerWidth >= 1100 ? "right" : null,
      title: "Each record carries its evidence",
      body: "Account, owner, story, the move, both scores and the sources, ready to import. Rejected moves stay out, with their reasons kept.",
      target: function () { return $("#export-panel"); },
      anchor: function () { return $("#export-file"); },
      auto: function () { tour.next(); } }
  ];

  var tour = null;
  tour = TourEngine.create({
    steps: STEPS,
    busy: function () { return S.busy; },
    clickableSelector: TourEngine.DEFAULT_CLICKABLE + ", .kpi, li[data-move], .run-sum",
    labels: { exit: "Exit guide", restart: "Restart walkthrough" },
    end: {
      title: "What you can act on now",
      body: "Bring your account list, your service lines and a month of news. We will run it on your book and show the moves your team would have missed.",
      doors: [
        { id: "held", label: "Settle the move waiting for you", hint: "one story, two accounts called Keswick", go: function () { openMove("MV-13"); } },
        { id: "book", label: "Look through your book", hint: "every account, with what we do today", go: function () { showView("accounts"); } },
        { id: "setup", label: "See what it watches", hint: "sources, service lines, rules", go: function () { showView("setup"); } }
      ],
      replayLabel: "Replay the walkthrough",
      exploreLabel: "Keep exploring",
      note: "Demo data only: every company, story and figure is invented."
    }
  });

  /* ---- page handlers: state first, then after() ---- */
  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("#btn-run"))) { run(); tour.after("run"); return; }
    if ((t = e.target.closest(".kpi[data-kpi]"))) { selectKpi(t.dataset.kpi); tour.after("drill"); return; }
    if ((t = e.target.closest("li[data-move]"))) {
      openMove(t.dataset.move);
      if (t.dataset.move === "MV-03") tour.after("open");
      if (t.dataset.move === "MV-02") tour.after("flagged");
      return;
    }
    if ((t = e.target.closest("#btn-reject"))) { var id = S.open; reject(id); if (id === "MV-02") tour.after("reject"); return; }
    if ((t = e.target.closest("#btn-approve"))) { decide(S.open, "approved"); return; }
    if ((t = e.target.closest("[data-act=undo]"))) { undo(S.open); return; }
    if ((t = e.target.closest("[data-act=confirm]"))) { confirmAccount(S.open, t.dataset.acc); return; }
    if ((t = e.target.closest("[data-act=admit]"))) { admit(S.open); return; }
    if ((t = e.target.closest("[data-act=toggle-filtered]"))) { S.showFiltered = !S.showFiltered; render(); return; }
    if ((t = e.target.closest("#btn-approve-rest"))) { approveRest(); tour.after("send"); return; }
    if ((t = e.target.closest(".run-sum"))) { S.runOpen = true; render(); return; }
    if ((t = e.target.closest(".nav [role=tab]"))) { showView(t.dataset.view); return; }
    if ((t = e.target.closest(".seg-btn"))) { S.mode = t.dataset.mode; render(); return; }
    if ((t = e.target.closest("#btn-download"))) { toast(exportRows().length ? D.exportFile + " saved: a demo file, nothing leaves this page." : "Approve a move first."); return; }
    if ((t = e.target.closest("#btn-submit"))) { openSubmit(); return; }
    if ((t = e.target.closest("#submit-cancel"))) { $("#submit").hidden = true; return; }
    if ((t = e.target.closest("#submit-send"))) { $("#submit").hidden = true; toast("Story queued: it goes through the next check at " + D.lastCheck.next + "."); return; }
  });
  function openSubmit() {
    $("#submit-acc").innerHTML = "<option>Any of your accounts</option>" + D.accounts.map(function (a) { return "<option>" + esc(a.name) + "</option>"; }).join("");
    $("#submit").hidden = false;
  }

  /* ---- primed states for ?tour=off&state=… (captures, deep links) ---- */
  function prime(state) {
    S.ran = false; S.busy = false; S.stage = -1; S.feedN = 0; S.kpi = null; S.open = null; S.view = "today";
    S.decided = {}; S.admitted = {}; S.confirmed = {}; S.sent = false; S.mode = "table"; S.showFiltered = false; S.runOpen = false;
    if (state === "running") { S.busy = true; S.stage = 3; S.feedN = D.feed.filter(function (f) { return f.at <= 3; }).length; }
    if (state && state !== "start" && state !== "running") { S.ran = true; S.stage = D.stages.length; S.feedN = D.feed.length; }
    if (state === "drill" || state === "reviewed") S.kpi = "moves";
    if (state === "reviewed" || state === "brief") S.open = "MV-03";
    if (state === "fanout") S.open = null;
    if (state === "rejected" || state === "decided" || state === "sent") {
      S.decided["MV-02"] = { state: "rejected", reason: D.reasons[0] };
      S.open = "MV-02";
    }
    if (state === "decided") {
      ["MV-01", "MV-03", "MV-04", "MV-05", "MV-08", "MV-12"].forEach(function (id) { S.decided[id] = { state: "approved", reason: "" }; });
      S.open = "MV-01";
    }
    if (state === "sent") {
      MAIN.forEach(function (m) { if (!S.decided[m.id] && !m.held) S.decided[m.id] = { state: "approved", reason: "" }; });
      S.sent = true; S.view = "export";
    }
    if (state === "accounts") S.view = "accounts";
    if (state === "setup") S.view = "setup";
    render();
  }

  render();

  TourEngine.boot({
    tour: tour,
    prime: prime,
    clean: function () { document.body.classList.add("ui-clean"); },
    defaultState: "reviewed",
    freeState: "start"
  });

  window.DEMO = { state: S, tour: tour, kpis: kpis, flagsFor: flagsFor, appliedIds: appliedIds, run: run, prime: prime, render: render };
})();
