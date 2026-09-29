/* demo.js — Repair-or-replace decisions walkthrough.
 * Built on tour-engine.js. Every KPI on screen comes out of kpis(applied);
 * every flag out of flagsFor(applied). The baseline never mutates.
 */
(function () {
  "use strict";

  var D = window.RRD;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch];
    });
  }
  var FAST = new URLSearchParams(location.search).get("fast") === "1";
  var KPI_IDS = ["needless", "repeat", "followon"];

  var CASES = D.cases;
  var CHANGES = CASES.filter(function (c) { return c.change; }).map(function (c) { return c.change; });
  function caseById(id) { return CASES.filter(function (c) { return c.id === id; })[0]; }
  function ruleSet(id) { return D.ruleSets.filter(function (r) { return r.id === id; })[0]; }
  function ruleText(c) {
    var rs = ruleSet(c.ruleSet);
    var r = rs && rs.rules.filter(function (x) { return x.id === c.rule; })[0];
    return r ? r.text : "";
  }

  /* ---- state: the run, the reviewer's overrules and confirmations ---- */
  var S = { ran: false, busy: false, overruled: {}, confirmed: {}, kpi: null, open: null, handed: false, tab: "queue" };

  function appliedIds() {
    if (!S.ran) return [];
    return CHANGES.filter(function (ch) { return !S.overruled[ch.caseId]; }).map(function (ch) { return ch.id; });
  }

  /* kpis(applied): a pure function of the applied change ids. kpis([]) is the
     baseline exactly; deltas are taken from these raw values, never from the
     rounded displays. Avoidable recalibrations are the needless-replacement
     rate times the modelled share of assets whose replacement triggers one. */
  function kpis(applied) {
    var k = { needless: D.kpis.needless.base, repeat: D.kpis.repeat.base };
    CHANGES.forEach(function (ch) {
      if (applied.indexOf(ch.id) === -1) return;
      k.needless += ch.effects.needless || 0;
      k.repeat += ch.effects.repeat || 0;
    });
    k.followon = k.needless * D.followOnShare;
    return k;
  }
  function effectOn(ch, kpi) {
    if (kpi === "followon") return (ch.effects.needless || 0) * D.followOnShare;
    return ch.effects[kpi] || 0;
  }

  function currentCall(c) {
    if (!S.ran) return null;
    if (S.overruled[c.id]) return c.overruleTo;
    return c.call;
  }
  function callLabel(c) {
    var call = currentCall(c);
    if (!call) return "—";
    if (!S.overruled[c.id] && c.callDetail) return call + " · " + c.callDetail;
    return call;
  }
  function bookedLabel(c) { return c.booked + (c.bookedDetail ? " · " + c.bookedDetail : ""); }
  function followOnFor(c) {
    return currentCall(c) === "Replace" && c.followOnOnReplace ? c.followOnOnReplace : "";
  }
  function needsReview(c) { return !!(S.ran && c.review && !S.overruled[c.id] && !S.confirmed[c.id]); }

  /* flagsFor(applied): exceptions computed from what is applied, never stored.
     decision:true is the human gate — such a case is never handed on. */
  function flagsFor(applied) {
    var f = [];
    CASES.forEach(function (c) {
      if (!S.ran) {
        f.push({ caseId: c.id, kind: "problem", text: "Booked on the customer's description; nothing measured" });
        return;
      }
      var ch = c.change;
      if (ch && ch.kind === "tradeoff" && applied.indexOf(ch.id) !== -1) f.push({ caseId: c.id, kind: "cost", text: ch.cost });
      if (needsReview(c)) f.push({ caseId: c.id, kind: "cost", text: "Below the 0.75 confidence threshold: sent to a reviewer" });
      if (S.overruled[c.id]) f.push({ caseId: c.id, kind: "info", text: "Overruled by the reviewer: " + S.overruled[c.id] });
      if (c.refer) f.push({ caseId: c.id, kind: "decision", decision: true, text: c.referReason });
      var fo = followOnFor(c);
      if (fo) f.push({ caseId: c.id, kind: "info", text: fo + " added to the booking" });
    });
    return f;
  }

  /* ---- formatting ---- */
  function pct(v, dp) { return v.toFixed(dp) + "%"; }
  function pts(v) {
    var r = Math.round(v * 100) / 100;
    if (r === 0) return "0.00 pts";
    return (r < 0 ? "−" : "+") + Math.abs(r).toFixed(2) + " pts";
  }
  function countText(x, per, each) {
    var n = Math.abs(x - Math.round(x)) < 0.05 ? String(Math.round(x)) : x.toFixed(1);
    if (Number(n) === 0) return "No change per 1,000 " + per;
    return n + " fewer per 1,000 " + per + (each ? " · " + each : "");
  }

  /* ---- illustrations (drawn, not photographed) ----
     `read` is false until the damage has been read: the photo then shows the
     asset, the damage and the scale tag only. The zone overlay and the
     measurement are the reading's output, so they appear with it. */
  function svgFor(c, read) {
    var d = c.draw, s = [];
    s.push('<svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Illustration of ' + esc(c.damage.toLowerCase()) + ' on ' + esc(c.asset) + '">');
    s.push('<rect width="320" height="190" fill="#1B2436"/>');
    var tag = c.anchor.indexOf("100") !== -1 ? "100 mm" : "50 mm";
    var label = c.size + " " + c.unit.replace(" deep", "").replace(" long", "");
    if (c.cls === "glazing") {
      s.push('<path d="M40 172 L280 172 L252 24 L68 24 Z" fill="#9CC3E0" fill-opacity=".5" stroke="#CBD5E1" stroke-width="2"/>');
      if (read) {
        s.push('<rect x="90" y="54" width="100" height="90" fill="#FDB022" fill-opacity=".10" stroke="#FDB022" stroke-dasharray="5 4"/>');
        s.push('<text x="95" y="67" font-size="9" fill="#FEC84B" font-family="system-ui, sans-serif">Zone A · sight-line</text>');
      }
      if (c.crack) {
        s.push('<path d="M' + d.x + ' ' + d.y + ' l12 -5 l8 7 l14 -8 l10 3 l14 -7 l12 5" fill="none" stroke="#F8FAFC" stroke-width="1.8"/>');
        if (read) s.push(measure(d.x, d.y - 26, d.x + 70, label));
      } else {
        var r = Math.max(3, Math.min(14, c.size / 25 * 11));
        s.push('<circle cx="' + d.x + '" cy="' + d.y + '" r="' + r.toFixed(1) + '" fill="#F8FAFC" fill-opacity=".75"/>');
        for (var a = 0; a < 6; a++) {
          var ang = a * Math.PI / 3 + 0.3, x2 = d.x + Math.cos(ang) * (r + 5), y2 = d.y + Math.sin(ang) * (r + 5);
          s.push('<line x1="' + d.x + '" y1="' + d.y + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#F8FAFC" stroke-width="1"/>');
        }
        if (read) s.push(measure(d.x - r, d.y + r + 12, d.x + r, label + " ± " + c.tol));
      }
    } else if (c.cls === "container") {
      s.push('<rect x="18" y="18" width="284" height="154" fill="#8A9BB0"/>');
      for (var x = 30; x < 300; x += 18) s.push('<line x1="' + x + '" y1="18" x2="' + x + '" y2="172" stroke="#6E7F94" stroke-width="3"/>');
      if (c.hole) {
        s.push('<circle cx="' + d.x + '" cy="' + d.y + '" r="13" fill="#0B0F17" stroke="#3B4656" stroke-width="3"/>');
        if (read) s.push(measure(d.x - 13, d.y + 26, d.x + 13, label));
      } else {
        s.push('<ellipse cx="' + d.x + '" cy="' + d.y + '" rx="38" ry="24" fill="#4E5D71" fill-opacity=".75"/>');
        s.push('<ellipse cx="' + (d.x - 8) + '" cy="' + (d.y - 6) + '" rx="16" ry="9" fill="#B8C4D2" fill-opacity=".35"/>');
        if (read) s.push(measure(d.x - 38, d.y + 36, d.x + 38, label + " deep"));
      }
    } else {
      s.push('<rect x="18" y="18" width="284" height="154" rx="6" fill="#C9D1DB"/>');
      for (var fx = 30; fx < 300; fx += 16) {
        s.push('<circle cx="' + fx + '" cy="44" r="2" fill="#6B7785"/><circle cx="' + fx + '" cy="150" r="2" fill="#6B7785"/>');
      }
      for (var fy = 56; fy < 146; fy += 14) s.push('<circle cx="196" cy="' + fy + '" r="2" fill="#6B7785"/>');
      s.push('<ellipse cx="' + d.x + '" cy="' + d.y + '" rx="20" ry="13" fill="#8C98A6" fill-opacity=".8"/>');
      if (read) {
        s.push(measure(d.x - 20, d.y + 24, d.x + 20, label + " deep"));
        s.push('<text x="202" y="' + (d.y - 16) + '" font-size="9" fill="#344054" font-family="system-ui, sans-serif">fastener row</text>');
      }
    }
    var tagW = tag === "100 mm" ? 60 : 54;
    s.push('<rect x="26" y="150" width="' + tagW + '" height="16" rx="2" fill="#FFFFFF"/><text x="' + (26 + tagW / 2) + '" y="161" text-anchor="middle" font-size="8.5" fill="#101828" font-family="system-ui, sans-serif">' + tag + ' tag</text>');
    s.push("</svg>");
    return s.join("");
  }
  function measure(x1, y, x2, text) {
    return '<g stroke="#53B1FD" stroke-width="1.4"><line x1="' + x1.toFixed(1) + '" y1="' + y + '" x2="' + x2.toFixed(1) + '" y2="' + y + '"/>' +
      '<line x1="' + x1.toFixed(1) + '" y1="' + (y - 4) + '" x2="' + x1.toFixed(1) + '" y2="' + (y + 4) + '"/>' +
      '<line x1="' + x2.toFixed(1) + '" y1="' + (y - 4) + '" x2="' + x2.toFixed(1) + '" y2="' + (y + 4) + '"/></g>' +
      '<text x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + (y + 14) + '" text-anchor="middle" font-size="10" font-weight="600" fill="#B2DDFF" font-family="system-ui, sans-serif">' + esc(text) + "</text>";
  }

  var ICONS = {
    camera: '<path d="M3 7h3l2-2h8l2 2h3v11H3z"/><circle cx="12" cy="12.5" r="3.5"/>',
    record: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    rules: '<path d="M5 4h14v16H5z"/><path d="M8 9l2 2 4-4M8 15h8"/>',
    out: '<path d="M4 12h12M12 6l6 6-6 6"/><path d="M20 4v16"/>'
  };

  /* ---- renderers ---- */
  function renderSources() {
    $("#sources").innerHTML = D.sources.map(function (s) {
      return '<div class="src"><i><svg viewBox="0 0 24 24">' + ICONS[s.icon] + '</svg></i><div><b>' + esc(s.name) +
        '</b><span>' + esc(s.line) + '</span><em>Connected</em></div></div>';
    }).join("");
  }

  function statusChip(c) {
    if (!S.ran) return '<span class="chip problem">Not measured</span>';
    if (c.refer) return '<span class="chip refer">Referred</span>';
    if (S.overruled[c.id]) return '<span class="chip over">Overruled</span>';
    if (needsReview(c)) return '<span class="chip review">Needs review</span>';
    if (S.confirmed[c.id]) return '<span class="chip ok">Confirmed</span>';
    if (c.change) return '<span class="chip changed">Booking changed</span>';
    return '<span class="chip ok">Booking stands</span>';
  }

  function renderQueue() {
    $("#queue tbody").innerHTML = CASES.map(function (c) {
      var dmg = S.ran ? esc(c.damage) + " · " + esc(c.size + " " + c.unit) + '<span class="sub">' + esc(c.zone) + "</span>"
        : '<span class="sub">As described: ' + esc(c.described) + "</span>";
      return '<tr class="clickable' + (S.open === c.id ? " is-open" : "") + '" data-case="' + c.id + '">' +
        '<td><span class="cid">' + c.id + '</span><span class="sub">' + esc(c.market) + " · " + esc(c.site) + "</span></td>" +
        '<td><span class="cls">' + esc(c.clsLabel) + '</span><span class="sub">' + esc(c.asset) + "</span></td>" +
        "<td>" + dmg + "</td>" +
        "<td>" + esc(bookedLabel(c)) + "</td>" +
        '<td class="call">' + esc(callLabel(c)) + "</td>" +
        "<td>" + statusChip(c) + "</td></tr>";
    }).join("");
    var fl = flagsFor(appliedIds());
    if (!S.ran) {
      $("#flag-summary").textContent = fl.length + " of " + CASES.length + " booked on a description, none measured";
    } else {
      var changed = CASES.filter(function (c) { return c.change && !S.overruled[c.id]; }).length;
      var review = CASES.filter(needsReview).length;
      var referred = fl.filter(function (x) { return x.decision; }).length;
      $("#flag-summary").textContent = changed + " bookings changed · " + review + " to review · " + referred + " referred";
    }
    $("#queue-helper").textContent = S.ran ? "Every call now carries its measurement and its rule."
      : "Seven cases, each booked on the customer's description.";
  }

  function renderBand() {
    $("#band").hidden = !S.ran;
    if (!S.ran) return;
    var b = kpis([]), a = kpis(appliedIds());
    KPI_IDS.forEach(function (id) {
      var el = $("#kpi-" + id), def = D.kpis[id], dp = def.dp;
      var rel = (a[id] - b[id]) / b[id] * 100;
      el.querySelector(".k-label").textContent = def.label;
      el.querySelector(".k-before").textContent = pct(b[id], dp);
      el.querySelector(".k-after").textContent = pct(a[id], dp);
      el.querySelector(".k-delta").textContent = (rel < 0 ? "−" : "+") + Math.abs(rel).toFixed(0) + "%";
      el.querySelector(".k-count").textContent = countText((b[id] - a[id]) * 10, def.per, def.each);
      el.querySelector(".k-whose").textContent = def.whose;
      el.classList.toggle("is-selected", S.kpi === id);
    });
  }

  function renderChanges() {
    var panel = $("#changes-panel");
    panel.hidden = !S.ran;
    if (!S.ran) return;
    var applied = appliedIds();
    var list = CHANGES.filter(function (ch) { return !S.kpi || effectOn(ch, S.kpi) !== 0; });
    $("#changes-title").textContent = S.kpi ? "Calls behind " + D.kpis[S.kpi].label.toLowerCase() : "Calls that changed a booking";
    $("#changes-helper").textContent = S.kpi ? "Each call's modelled effect on the rate, in points" : "Open a number above to see the calls behind it";
    $("#changes").innerHTML = list.map(function (ch) {
      var c = caseById(ch.caseId), over = !!S.overruled[c.id];
      var eff = S.kpi ? effectOn(ch, S.kpi) : (ch.effects.needless || ch.effects.repeat || 0);
      var flag = ch.kind === "tradeoff" && applied.indexOf(ch.id) !== -1 ? '<span class="c-flag">Flag: ' + esc(ch.cost) + "</span>" : "";
      return '<li data-change="' + ch.id + '" data-case="' + c.id + '" class="' + (S.open === c.id ? "is-open " : "") + (over ? "is-over" : "") + '">' +
        '<span class="c-id"><b>' + c.id + '</b><span class="sub">' + esc(c.clsLabel) + "</span></span>" +
        '<span><span class="c-what">' + esc(ch.what) + (over ? " · overruled" : "") + '</span><span class="c-rule">Example rule ' + esc(c.rule) + " · measured " + esc(c.size + " " + c.unit) + "</span></span>" +
        '<span class="c-eff">' + pts(eff) + "</span>" + flag + "</li>";
    }).join("");
  }

  function renderCase() {
    var box = $("#case");
    var c = S.open && caseById(S.open);
    if (!c) {
      box.innerHTML = '<div class="empty">Open a case to see its photo, the measurement, the rule it met and the call.</div>';
      return;
    }
    var h = [];
    h.push('<div class="case-head"><span class="cls">' + esc(c.clsLabel) + '</span><h3>' + c.id + '</h3><span class="sub">' +
      esc(c.market) + " · " + esc(c.site) + " · " + esc(c.asset) + "</span></div>");
    h.push('<figure class="shot">' + svgFor(c, S.ran) + "<figcaption>Illustration of photo " + c.frame + " of " + c.photos + " · " + esc(c.anchor.toLowerCase()) + " in view</figcaption></figure>");
    if (!S.ran) {
      h.push('<p class="empty-note">Booked at first contact: ' + esc(bookedLabel(c)) + ", on " + esc(c.described) + ". Read the damage to measure it against the rules.</p>");
      box.innerHTML = h.join("");
      return;
    }
    var rs = ruleSet(c.ruleSet);
    h.push('<dl class="reading">' +
      "<dt>Damage</dt><dd>" + esc(c.damage) + "</dd>" +
      "<dt>Measured</dt><dd>" + esc(c.size + " " + c.unit) + " ± " + esc(c.tol) + ' mm<em class="road">roadmap capability</em></dd>' +
      "<dt>Position</dt><dd>" + esc(c.zone) + "</dd>" +
      "<dt>Booked</dt><dd>" + esc(bookedLabel(c)) + " · on " + esc(c.described) + "</dd>" +
      "<dt>Follow-on work</dt><dd>" + esc(followOnFor(c) || "None") + "</dd></dl>");
    if (c.refer) {
      h.push('<div class="rulebox none"><span>No rule covers this case · ' + esc(rs.name) + " " + esc(rs.version) + " (example)</span><p>" + esc(c.referReason) + ".</p></div>");
    } else {
      h.push('<div class="rulebox"><span>Example rule ' + esc(c.rule) + " · " + esc(rs.name) + " " + esc(rs.version) + "</span><p>" + esc(ruleText(c)) + "</p></div>");
    }
    h.push('<div class="verdict"><span class="sub">The call</span><b>' + esc(callLabel(c)) + "</b>" +
      (c.conf ? '<span class="conf">confidence ' + c.conf.toFixed(2) + "</span>" : '<span class="conf">never guessed</span>') + "</div>");
    var trace = [
      "Asset read from its own markings: " + c.asset,
      "Damage located in photo " + c.frame + " of " + c.photos,
      "Measured against the " + c.anchor.toLowerCase() + ": " + c.size + " " + c.unit + " ± " + c.tol,
      "Position mapped: " + c.zone,
      c.refer ? "No rule in " + rs.name + " covers this position" : "Rule matched: " + c.rule + ", " + rs.name,
      c.refer ? "Referred to a person" : (c.conf < 0.75 ? "Below the 0.75 threshold: sent to a reviewer" : "Above the 0.75 threshold: goes straight through")
    ];
    h.push('<ol class="trace">' + trace.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>");
    var fl = flagsFor(appliedIds()).filter(function (f) { return f.caseId === c.id; });
    if (fl.length) h.push('<ul class="flags">' + fl.map(function (f) { return '<li class="' + f.kind + '">' + esc(f.text) + "</li>"; }).join("") + "</ul>");
    if (c.change) {
      var eff = S.overruled[c.id] ? "Overruled: this call's effect is removed from the numbers." : c.change.effect + ".";
      h.push('<p class="empty-note">' + esc(eff) + "</p>");
    }
    h.push('<div class="review">' + reviewControls(c) + "</div>");
    box.innerHTML = h.join("");
  }

  function reviewControls(c) {
    if (c.refer) return '<p class="state">Waiting for the licensed engineer. Nothing is handed on until they decide.</p>';
    if (S.overruled[c.id]) {
      return '<p class="state">Overruled to <b>' + esc(c.overruleTo) + "</b>. Reason kept: " + esc(S.overruled[c.id]) + '.</p>' +
        '<div class="row"><button type="button" data-act="restore">Restore the call</button></div>';
    }
    if (!c.change) {
      return '<p class="state">The booking already matches the rule.</p>' +
        (S.confirmed[c.id] ? "" : '<div class="row"><button type="button" data-act="confirm">Confirm the call</button></div>');
    }
    var opts = c.reasons.map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("");
    return (S.confirmed[c.id] ? '<p class="state">Confirmed by the reviewer.</p>' : "") +
      '<label>Reason, kept with the decision<select id="reason">' + opts + "</select></label>" +
      '<div class="row"><button type="button" class="primary" id="btn-overrule">Overrule: ' + esc(c.overruleTo.toLowerCase()) + "</button>" +
      (S.confirmed[c.id] ? "" : '<button type="button" data-act="confirm">Confirm the call</button>') + "</div>";
  }

  function renderRules() {
    $("#compare").innerHTML = '<div class="panel-head"><h2>The same chip, two markets</h2><span class="helper">A 12 mm chip inside zone A, the driver\'s sight-line</span></div>' +
      '<div class="compare-grid"><div><span class="sub">Aldmere · example rule AG-3.1</span><b>Repair</b><span class="sub">' + esc(ruleSet("AG").rules[0].text) + "</span></div>" +
      '<div><span class="sub">Brisca · example rule BG-2.4</span><b>Replace</b><span class="sub">' + esc(ruleSet("BG").rules[0].text) + "</span></div></div>";
    $("#rulesets").innerHTML = D.ruleSets.map(function (rs) {
      return '<div class="panel"><div class="panel-head"><h2>' + esc(rs.name) + " · " + esc(rs.version) + '</h2><span class="helper">Example · ' + esc(rs.scope) + "</span></div><ul>" +
        rs.rules.map(function (r) { return "<li><code>" + esc(r.id) + "</code>" + esc(r.text) + "</li>"; }).join("") + "</ul></div>";
    }).join("");
    $("#routing").innerHTML = D.routing.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("");
    var mark = { available: "● available", partial: "◐ partial", roadmap: "○ roadmap" };
    $("#status").innerHTML = D.status.map(function (s) {
      return '<li><span>' + esc(s.what) + '</span><span class="st ' + s.status + '">' + mark[s.status] + "</span></li>";
    }).join("");
  }

  var EXPORT_COLS = ["Case", "Asset", "Call", "Scope", "Skill", "Slot", "Dependent work", "Rule", "Measured", "Authorised by"];
  function heldReason(c) {
    if (c.refer) return "Referred: waiting for the licensed engineer";
    if (needsReview(c)) return "Waiting for a reviewer: below the confidence threshold";
    return "";
  }
  function renderHandoff() {
    $("#export-table thead").innerHTML = "<tr>" + EXPORT_COLS.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>";
    if (!S.ran) {
      $("#export-table tbody").innerHTML = "";
      $("#export-helper").textContent = "Read the damage first; confirmed jobs appear here";
      $("#held").innerHTML = "";
      return;
    }
    var rows = CASES.filter(function (c) { return !heldReason(c); });
    var held = CASES.filter(function (c) { return heldReason(c); });
    $("#export-table tbody").innerHTML = rows.map(function (c) {
      var call = currentCall(c), sc = c.scope[call === "Replace" ? "Replace" : "Repair"] || ["", "", 0];
      var by = S.overruled[c.id] ? "Reviewer overrule: " + S.overruled[c.id] : S.confirmed[c.id] ? "Reviewer confirmation" : "Policy: above the threshold";
      return "<tr><td>" + c.id + "</td><td>" + esc(c.asset) + "</td><td><b>" + esc(callLabel(c)) + "</b></td><td>" + esc(sc[0]) +
        "</td><td>" + esc(sc[1]) + "</td><td>" + sc[2] + " min</td><td>" + esc(followOnFor(c) || "None") + "</td><td>" + esc(c.rule) +
        "</td><td>" + esc(c.size + " " + c.unit) + "</td><td>" + esc(by) + "</td></tr>";
    }).join("");
    $("#export-helper").textContent = S.handed ? rows.length + " jobs sent · " + held.length + " held" : "Preview of the booking file";
    $("#held").innerHTML = held.map(function (c) { return "<div><b>" + c.id + "</b> · " + esc(heldReason(c)) + "</div>"; }).join("");
  }

  function renderTabs() {
    ["queue", "rules", "handoff"].forEach(function (t) {
      $("#view-" + t).hidden = S.tab !== t;
    });
    $$(".tabs [role=tab]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.tab === S.tab)); });
  }

  function render() {
    renderQueue();
    renderBand();
    renderChanges();
    renderCase();
    renderHandoff();
    renderTabs();
    $("#btn-run").disabled = S.ran || S.busy;
    $("#btn-run").textContent = S.ran ? "Damage read" : S.busy ? "Reading…" : "Read the damage";
    $("#btn-handoff").hidden = !S.ran;
    $("#btn-handoff").disabled = S.handed;
    if (tour) tour.reposition();
  }

  /* ---- actions ---- */
  var toastTimer = null;
  function toast(text) {
    var t = $("#toast");
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  function run() {
    if (S.ran || S.busy) return;
    S.busy = true;
    render();
    var box = $("#stages");
    box.hidden = false;
    box.innerHTML = "";
    var i = 0;
    (function step() {
      var prev = box.children[i - 1];
      if (prev) { prev.classList.remove("is-live"); prev.classList.add("is-done"); }
      if (i >= D.stages.length) return finishRun();
      var st = D.stages[i++];
      var li = document.createElement("li");
      li.className = "is-live";
      li.innerHTML = "<b>" + esc(st.label) + "</b><span>" + esc(st.detail) + "</span>";
      box.appendChild(li);
      setTimeout(step, FAST ? 40 : 480);
    })();
  }
  function finishRun() {
    S.ran = true;
    S.busy = false;
    render();
    if (tour.active && tour.stepId() === "run") tour.next();
  }

  function selectKpi(id) {
    S.kpi = S.kpi === id && !tour.active ? null : id;
    showTab("queue");
  }
  function openCase(id) {
    S.open = id;
    showTab("queue");
    if (window.innerWidth <= 1100) {
      var box = $("#case");
      try { box.scrollIntoView({ block: "start", behavior: "smooth" }); } catch (e) {}
    }
  }
  function overrule(id) {
    var c = caseById(id);
    if (!c || !c.change || S.overruled[id]) return;
    var sel = $("#reason");
    S.overruled[id] = sel ? sel.value : c.reasons[0];
    delete S.confirmed[id];
    render();
    toast(id + " overruled to " + c.overruleTo.toLowerCase() + ". Reason kept; numbers updated.");
  }
  function restore(id) {
    if (!S.overruled[id]) return;
    delete S.overruled[id];
    render();
    toast(id + " restored to the system's call.");
  }
  function confirmCall(id) {
    S.confirmed[id] = true;
    render();
    toast(id + " confirmed by the reviewer.");
  }
  function handoff() {
    if (!S.ran || S.handed) return;
    S.handed = true;
    S.tab = "handoff";
    render();
    var held = CASES.filter(function (c) { return heldReason(c); }).length;
    toast((CASES.length - held) + " jobs sent to booking; " + held + " held for a person.");
  }
  function showTab(t) {
    S.tab = t;
    render();
  }

  /* ---- the tour ---- */
  var STEPS = [
    { id: "sources", major: 1, passive: true, side: "bottom",
      title: "Everything the call needs",
      body: "Photos with a scale tag, the asset's record and each market's repair rules arrive in one place, before anyone visits the asset.",
      target: function () { return $("#sources"); },
      auto: function () { tour.next(); } },
    { id: "run", major: 1, waits: true, side: "bottom",
      title: "Read this week's damage",
      body: "Seven cases were booked on the customer's own description. Read the photos against each market's rules and see which bookings change.",
      target: function () { return $("#btn-run"); },
      auto: run },
    { id: "value", major: 2, passive: true, side: "bottom", scroll: "center",
      title: "Fewer needless replacements, fewer returns",
      body: "Before and after on the same cases, modelled on industry figures. Each needless replacement caught keeps about $250 with the payer, and each recalibration avoided saves $300–400 and 4 days.",
      target: function () { return $("#band"); },
      anchor: function () { return $("#kpi-needless"); },
      auto: function () { tour.next(); } },
    { id: "drill", major: 3, side: "bottom",
      title: "See which calls moved it",
      body: "Open the needless-replacement number. It lists the calls behind it, each with the rule it met and its effect.",
      target: function () { return $("#kpi-needless"); },
      auto: function () { selectKpi("needless"); tour.next(); } },
    { id: "open", major: 4, side: "right",
      title: "Check the measurement and rule",
      body: "Open the Aldmere chip. The customer asked for a new windscreen; the photo measures 14.2 mm, and that market's rule allows a repair.",
      target: function () { return $('li[data-change="chg-24811"]'); },
      auto: function () { openCase("RR-24811"); tour.next(); } },
    { id: "case", major: 4, passive: true, side: "left",
      title: "The evidence behind one call",
      body: "The drawing marks the scale tag and the measured chip. The example rule is cited word for word, and the trace shows each step the system took.",
      target: function () { return $("#case"); },
      anchor: function () { return $("#case .rulebox"); },
      auto: function () { tour.next(); } },
    { id: "flagged", major: 5, side: "right",
      title: "Open the call flagged for review",
      body: "This chip sits 1.4 mm under the limit, inside the measurement's own margin. The system flags it rather than deciding alone.",
      target: function () { return $('tr[data-case="RR-24826"]'); },
      auto: function () { openCase("RR-24826"); tour.next(); } },
    { id: "overrule", major: 5, side: "left",
      title: "Overrule it, with a reason",
      body: "Book the replacement instead. Your reason is kept with the decision, so a dispute is answered from the record.",
      target: function () { return $("#btn-overrule"); },
      avoid: function () { return $("#case .verdict"); },
      auto: function () { overrule("RR-24826"); tour.next(); } },
    { id: "follow", major: 5, passive: true, side: "bottom", scroll: "center",
      title: "The numbers follow your call",
      body: "Needless replacements rise by that call's modelled share, and the avoidable recalibrations with it. Restore the call and they return.",
      target: function () { return $("#band"); },
      anchor: function () { return $("#kpi-needless"); },
      auto: function () { tour.next(); } },
    { id: "handoff", major: 6, side: "bottom",
      title: "Send the confirmed jobs",
      body: "Hand the confirmed calls to the booking system with the part, the skill, the slot and any recalibration already resolved.",
      target: function () { return $("#btn-handoff"); },
      auto: function () { handoff(); tour.next(); } },
    { id: "file", major: 6, passive: true, side: "top",
      title: "Each job carries its reason",
      body: "The booking file keeps the rule, the measurement and any overrule reason. The referred airframe case waits for its engineer.",
      target: function () { return $("#export"); },
      anchor: function () { return $("#export-file"); },
      auto: function () { tour.next(); } }
  ];

  var tour = null;
  tour = TourEngine.create({
    steps: STEPS,
    busy: function () { return S.busy; },
    clickableSelector: TourEngine.DEFAULT_CLICKABLE + ", .kpi, li[data-change]",
    labels: { exit: "Exit guide", restart: "Restart walkthrough" },
    end: {
      title: "What you can act on now",
      body: "Pick your own asset class and market. Bring a week of photos with their booked outcomes. We will run the calls against your rules and show the difference.",
      doors: [
        { id: "rules", label: "Compare two markets' rules", hint: "the same chip, two answers", go: function () { showTab("rules"); } },
        { id: "queue", label: "Overrule another call", hint: "open any case in the queue", go: function () { showTab("queue"); } },
        { id: "file", label: "Open the booking file", hint: "what the booking system receives", go: function () { showTab("handoff"); } }
      ],
      replayLabel: "Replay the walkthrough",
      exploreLabel: "Keep exploring",
      note: "Demo data only: every case, id, site, market and rule is invented."
    }
  });

  /* ---- page handlers: state first, then after() ---- */
  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("#btn-run"))) { run(); tour.after("run"); return; }
    if ((t = e.target.closest(".kpi[data-kpi]"))) { selectKpi(t.dataset.kpi); tour.after("drill"); return; }
    if ((t = e.target.closest("li[data-change]"))) { openCase(t.dataset.case); tour.after("open"); return; }
    if ((t = e.target.closest("tr[data-case]"))) { openCase(t.dataset.case); tour.after("flagged"); return; }
    if ((t = e.target.closest("#btn-overrule"))) { overrule(S.open); tour.after("overrule"); return; }
    if ((t = e.target.closest("[data-act=restore]"))) { restore(S.open); return; }
    if ((t = e.target.closest("[data-act=confirm]"))) { confirmCall(S.open); return; }
    if ((t = e.target.closest("#btn-handoff"))) { handoff(); tour.after("handoff"); return; }
    if ((t = e.target.closest(".tabs [role=tab]"))) { showTab(t.dataset.tab); return; }
  });

  /* ---- primed states for ?tour=off&state=… (captures, deep links) ---- */
  function prime(state) {
    S.ran = false; S.busy = false; S.overruled = {}; S.confirmed = {}; S.kpi = null; S.open = null; S.handed = false; S.tab = "queue";
    $("#stages").hidden = true;
    if (state && state !== "start") {
      S.ran = true;
      $("#stages").hidden = false;
      $("#stages").innerHTML = D.stages.map(function (st) { return '<li class="is-done"><b>' + esc(st.label) + "</b><span>" + esc(st.detail) + "</span></li>"; }).join("");
    }
    if (state === "reviewed") { S.kpi = "needless"; S.open = "RR-24811"; }
    if (state === "flagged") { S.kpi = "needless"; S.open = "RR-24826"; }
    if (state === "overruled" || state === "handoff") {
      S.kpi = "needless"; S.open = "RR-24826";
      S.overruled["RR-24826"] = caseById("RR-24826").reasons[0];
    }
    if (state === "handoff") { S.handed = true; S.tab = "handoff"; }
    if (state === "rules") S.tab = "rules";
    render();
  }

  renderSources();
  renderRules();
  render();

  TourEngine.boot({
    tour: tour,
    prime: prime,
    clean: function () { document.body.classList.add("ui-clean"); },
    defaultState: "reviewed",
    freeState: "start"
  });

  window.DEMO = { state: S, tour: tour, kpis: kpis, flagsFor: flagsFor, appliedIds: appliedIds, run: run, prime: prime };
})();
