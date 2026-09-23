window.SITE_DIAGRAMS = {
  "account-insights": {
    layout: "flow",
    sources: [
      { title: ["Signal feeds"], sub: ["News, filings,", "disclosures"] },
      { title: ["Client context"], sub: ["CRM, service-line", "catalog"] }
    ],
    group: {
      label: ["Oracle Cloud Infrastructure", "dedicated AI cluster"],
      nodes: [
        { title: ["Account insights"], sub: ["Filter, fan out, reason,", "score and cite"] },
        { title: ["NVIDIA AI-Q"], sub: ["Vector search", "and reranking"] }
      ]
    },
    target: { title: ["Reviewer", "approves"], sub: ["One JSON per account", "into the CRM"], accent: true },
    note: "Nothing reaches the sales system unreviewed"
  },

  "case-evidence-collection": {
    layout: "flow",
    sources: [
      { title: ["Source", "exports"], sub: ["Case records,", "correspondence"] }
    ],
    group: {
      label: ["Oracle Cloud Infrastructure", "dedicated AI cluster"],
      nodes: [
        { title: ["Evidence assembly"], sub: ["Timeline and", "citation binding"] },
        { title: ["NVIDIA AI-Q"], sub: ["Multi-document", "reasoning"] }
      ]
    },
    target: { title: ["Investigator UI"], sub: ["Amend, approve,", "full audit log"], accent: true },
    note: "Every statement bound to the source sentence or field"
  },

  "plan-vs-actual-investigation": {
    layout: "flow",
    sources: [
      { title: ["Approved", "exports"], sub: ["Schedule, cost,", "progress, contracts"] }
    ],
    group: {
      label: ["Oracle Cloud Infrastructure", "dedicated AI cluster"],
      nodes: [
        { title: ["Conformed model"], sub: ["Mapped to the lowest", "reliable unit level"] },
        { title: ["Hybrid retrieval"], sub: ["AI Vector Search", "and OpenSearch"] }
      ]
    },
    target: { title: ["Review app"], sub: ["Variance, drivers,", "citations"], accent: true },
    note: "Records that cannot be resolved are reported as coverage gaps"
  },

  "large-document-extraction": {
    layout: "flow",
    sources: [
      { title: ["Contract", "repository"], sub: ["Source PDFs,", "field rules"] }
    ],
    group: {
      label: ["Oracle Cloud Infrastructure", "dedicated AI cluster"],
      nodes: [
        { title: ["Extraction pipeline"], sub: ["Validators, confidence,", "page citations"] },
        { title: ["NVIDIA AI-Q"], sub: ["Vision-language models", "plus retrieval"] }
      ]
    },
    target: { title: ["Split-view", "review"], sub: ["Approved rows export", "to cost or ERP"], accent: true },
    note: "Human in the loop by design — unattended extraction is out of scope"
  },

  "workforce-optimization": {
    layout: "flow",
    sources: [
      { title: ["Oracle Field", "Service"], sub: ["Staff, availability,", "bookings"] }
    ],
    group: {
      label: ["Oracle Cloud Infrastructure", "dedicated AI cluster"],
      nodes: [
        { title: ["Workforce app"], sub: ["Dispatcher map,", "re-solve, approve"] },
        { title: ["NVIDIA cuOpt"], sub: ["GPU-accelerated solver"] }
      ]
    },
    target: { title: ["Dispatcher", "approves"], sub: ["No allocation reaches", "the field unreviewed"], accent: true },
    loop: "Approved plan written back to Oracle Field Service"
  },

  "cross-system-erp-qa": {
    layout: "hub",
    sources: [
      { title: ["Oracle", "applications"], sub: ["Prebuilt pipelines,", "no extract work"] },
      { title: ["One or two", "other sources"], sub: ["Linked or landed"] }
    ],
    hub: {
      title: ["Oracle Autonomous", "AI Lakehouse"],
      items: ["Governed data model", "Masking and row rules", "SQL firewall on every query", "Select AI answers questions"]
    },
    target: { title: ["Plain-language", "answers"], sub: ["Certified views,", "dashboards"], accent: true },
    note: "Governance sits in the data layer, not in the prompt"
  },

  "business-metrics-qa": {
    layout: "hub",
    sources: [
      { title: ["Existing", "catalogs"], sub: ["Iceberg, mounted"] },
      { title: ["Linked", "databases"], sub: ["Queried in place"] },
      { title: ["Existing", "platforms"], sub: ["Stay where they are"] }
    ],
    hub: {
      title: ["Oracle Autonomous", "AI Lakehouse"],
      items: ["The governed gold layer", "Business definitions", "Masking and row rules", "Select AI answers questions"]
    },
    target: { title: ["Answers across", "every source"], sub: ["No data movement"], accent: true },
    note: "Coexistence, not migration — the join happens at the catalog"
  }
};

(function () {
  "use strict";

  var W = 960;
  var TITLE_SIZE = 27;
  var TITLE_STEP = 30;
  var SUB_SIZE = 21;
  var SUB_STEP = 26;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  function line(cls, x, y, text, anchor) {
    return '<text class="' + cls + '" x="' + x + '" y="' + y + '"' +
      (anchor ? ' text-anchor="' + anchor + '"' : "") + ">" + esc(text) + "</text>";
  }

  function box(node, x, y, w, h) {
    var title = node.title || [];
    var sub = node.sub || [];
    var blockH = title.length * TITLE_STEP + (sub.length ? 10 + sub.length * SUB_STEP : 0);
    var top = y + (h - blockH) / 2;
    var out = '<rect class="dg-card' + (node.accent ? " dg-card--accent" : "") +
      '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10"></rect>';
    title.forEach(function (text, i) {
      out += line("dg-title", x + 20, top + 22 + i * TITLE_STEP, text);
    });
    sub.forEach(function (text, i) {
      out += line("dg-sub", x + 20, top + title.length * TITLE_STEP + 28 + i * SUB_STEP, text);
    });
    return out;
  }

  function arrowRight(x1, x2, y) {
    return '<path class="dg-flow" d="M' + x1 + " " + y + "H" + (x2 - 9) + '"></path>' +
      '<path class="dg-head" d="M' + x2 + " " + y + "l-10 -6v12z" + '"></path>';
  }

  function flow(d) {
    var leftX = 30, leftW = 236;
    var groupX = 302, groupW = 344, groupY = 90, groupH = 360;
    var rightX = 682, rightW = 248;
    var innerX = 318, innerW = 312, innerH = 120;
    var sources = d.sources || [];
    var height = d.loop ? 560 : 500;
    var out = "";

    out += '<rect class="dg-group" x="' + groupX + '" y="' + groupY + '" width="' + groupW +
      '" height="' + groupH + '" rx="14"></rect>';
    (d.group.label || []).forEach(function (text, i) {
      out += line("dg-label", groupX + 20, groupY + 32 + i * 24, text);
    });
    out += box(d.group.nodes[0], innerX, 180, innerW, innerH);
    out += box(d.group.nodes[1], innerX, 312, innerW, innerH);

    if (sources.length > 1) {
      out += box(sources[0], leftX, 150, leftW, 130);
      out += box(sources[1], leftX, 300, leftW, 130);
      out += arrowRight(leftX + leftW, groupX, 215);
      out += arrowRight(leftX + leftW, groupX, 365);
    } else {
      out += box(sources[0], leftX, 210, leftW, 140);
      out += arrowRight(leftX + leftW, groupX, 280);
    }

    out += box(d.target, rightX, 210, rightW, 140);
    out += arrowRight(groupX + groupW, rightX, 280);

    if (d.loop) {
      out += '<path class="dg-loop" d="M806 350V500H148V359"></path>' +
        '<path class="dg-head dg-head--dim" d="M148 350l-6 10h12z"></path>' +
        line("dg-note", W / 2, 488, d.loop, "middle");
    } else if (d.note) {
      out += line("dg-note", W / 2, 468, d.note, "middle");
    }

    return { height: height, body: out };
  }

  function hub(d) {
    var leftX = 30, leftW = 236;
    var hubX = 302, hubW = 344, hubY = 80;
    var rightX = 682, rightW = 248;
    var sources = d.sources || [];
    var slots = sources.length > 2
      ? [{ y: 96, h: 128 }, { y: 228, h: 128 }, { y: 360, h: 128 }]
      : [{ y: 148, h: 140 }, { y: 308, h: 140 }];
    var hubH = 420;
    var out = "";

    sources.forEach(function (source, i) {
      var slot = slots[i];
      out += box(source, leftX, slot.y, leftW, slot.h);
      out += arrowRight(leftX + leftW, hubX, slot.y + slot.h / 2);
    });

    out += '<rect class="dg-card dg-card--hub" x="' + hubX + '" y="' + hubY + '" width="' + hubW +
      '" height="' + hubH + '" rx="12"></rect>';
    (d.hub.title || []).forEach(function (text, i) {
      out += line("dg-title dg-title--hub", hubX + 24, hubY + 52 + i * 34, text);
    });
    out += '<path class="dg-rule" d="M' + (hubX + 24) + " " + (hubY + 126) + "H" + (hubX + hubW - 24) + '"></path>';
    (d.hub.items || []).forEach(function (text, i) {
      var y = hubY + 172 + i * 54;
      out += '<circle class="dg-dot" cx="' + (hubX + 32) + '" cy="' + (y - 7) + '" r="4"></circle>';
      out += line("dg-sub", hubX + 50, y, text);
    });

    out += box(d.target, rightX, 230, rightW, 140);
    out += arrowRight(hubX + hubW, rightX, 300);

    if (d.note) out += line("dg-note", W / 2, 550, d.note, "middle");

    return { height: 580, body: out };
  }

  window.SITE_DIAGRAMS.render = function (slug) {
    var d = window.SITE_DIAGRAMS[slug];
    if (!d || !d.layout) return "";
    var built = d.layout === "hub" ? hub(d) : flow(d);
    return '<svg class="diagram" viewBox="0 0 ' + W + " " + built.height +
      '" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' +
      built.body + "</svg>";
  };
})();
