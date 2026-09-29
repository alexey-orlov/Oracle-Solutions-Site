/**
 * content-case.js — sentence-case overlay for the live theme.
 *
 * A handful of strings are still stored in capitals in data/content.js,
 * from when that file was shared with the near-black theme (whose CSS
 * re-uppercased them anyway). SoftServe's current brand is sentence case,
 * and CSS cannot get there on its own — text-transform: lowercase would
 * wreck AI, ERP, Q&A, OCI — so this file patches those strings at load time.
 *
 * Since round 9 the archive is frozen and content.js is the live site's own
 * copy: NEW copy is stored in sentence case directly, and a row is deleted
 * here whenever its string is rewritten in content.js. This overlay shrinks
 * with every round; it is not where new strings go.
 *
 * Loaded by index.html directly AFTER data/content.js and BEFORE the page
 * renderers, which only ever read window.SITE_CONTENT. The default theme
 * (index.html) does not load it, so nothing there moves.
 *
 * Each RECASE row is [path, expectedOldValue, newValue]. The override is
 * applied only when the current value matches expectedOldValue exactly; a
 * mismatch or an unresolvable path logs one warning naming the path and is
 * skipped, so an edit to content.js surfaces here instead of leaving a
 * silently stale patch behind.
 *
 * Scope: visible copy only. All-caps values that are purely an acronym or a
 * proper noun are deliberately NOT listed — "ERP Q&A" (the Cross-system
 * headline's rest), "OCI + NVIDIA", "NVIDIA", "ROI" — they are already
 * correct. The badges arrays are stored sentence case here because the SS26
 * CSS uppercases that micro-type itself.
 */
(function () {
  "use strict";

  var RECASE = [
    /* Products index */
    ["productsPage.title", "PRODUCTS", "Products"],

    /* Round 20 retired the problem/solution titles (the plates' eyebrows are
       shared.sectionLabels) and More detail, so their re-casings went too. */

    /* Product 0 — Account insights */
    ["products[0].headline.accent", "ACCOUNT", "Account"],
    ["products[0].headline.rest", "INSIGHTS", "insights"],

    /* Product 1 — Case evidence collection */
    ["products[1].headline.accent", "CASE", "Case"],
    ["products[1].headline.rest", "EVIDENCE COLLECTION", "evidence collection"],

    /* Product 2 — Plan vs actual investigation */
    ["products[2].headline.accent", "PLAN", "Plan"],
    ["products[2].headline.rest", "VS ACTUAL INVESTIGATION", "vs actual investigation"],

    /* Product 3 — Large docs processing and review */
    ["products[3].headline.accent", "LARGE", "Large"],
    ["products[3].headline.rest", "DOCS PROCESSING AND REVIEW", "docs processing and review"],

    /* Product 4 — Workforce optimization */
    ["products[4].headline.accent", "WORKFORCE", "Workforce"],
    ["products[4].headline.rest", "OPTIMIZATION", "optimization"],

    /* Product 5 — Cross-system ERP Q&A (headline.rest "ERP Q&A" stays as stored) */
    ["products[5].headline.accent", "CROSS-SYSTEM", "Cross-system"],
    ["products[5].badges[0]", "ERP + CRM + THE SYSTEMS AROUND THEM", "ERP + CRM + the systems around them"],
    ["products[5].badges[1]", "PREBUILT PIPELINES", "Prebuilt pipelines"],
    ["products[5].badges[2]", "ANSWERS IN MINUTES", "Answers in minutes"],

    /* Product 6 — Business metrics Q&A */
    ["products[6].headline.accent", "BUSINESS", "Business"],
    ["products[6].headline.rest", "METRICS Q&A", "metrics Q&A"],
    ["products[6].badges[0]", "MULTI-CLOUD", "Multi-cloud"],
    ["products[6].badges[1]", "ON-PREM TOO", "On-prem too"],
    ["products[6].badges[2]", "NO MIGRATION", "No migration"]
  ];

  var C = window.SITE_CONTENT;
  if (!C) { return; }

  /* "products[6].overview.moreDetail[4].title" -> ["products","6","overview",...] */
  function tokenize(path) {
    var parts = String(path).split(".");
    var out = [];
    var i, j, seg, head, brackets;
    for (i = 0; i < parts.length; i += 1) {
      seg = parts[i];
      head = seg.replace(/\[.*$/, "");
      if (head) { out.push(head); }
      brackets = seg.match(/\[[^\]]*\]/g) || [];
      for (j = 0; j < brackets.length; j += 1) {
        out.push(brackets[j].slice(1, -1));
      }
    }
    return out;
  }

  function warn(message, path) {
    if (window.console && window.console.warn) {
      window.console.warn("content-case: " + message + ": " + path);
    }
  }

  function applyOne(row) {
    var path = row[0];
    var expected = row[1];
    var next = row[2];
    var keys = tokenize(path);
    var node = C;
    var i;

    for (i = 0; i < keys.length - 1; i += 1) {
      if (node === null || typeof node !== "object" || !(keys[i] in node)) {
        warn("path does not resolve", path);
        return false;
      }
      node = node[keys[i]];
    }

    var leaf = keys[keys.length - 1];
    if (node === null || typeof node !== "object" || !(leaf in node)) {
      warn("path does not resolve", path);
      return false;
    }
    if (node[leaf] !== expected) {
      warn("value changed in content.js, override skipped", path);
      return false;
    }
    node[leaf] = next;
    return true;
  }

  var applied = 0;
  var k;
  for (k = 0; k < RECASE.length; k += 1) {
    if (applyOne(RECASE[k])) { applied += 1; }
  }

  /* Exposed for tooling and the internal review panel; harmless in the page. */
  window.SITE_CONTENT_V2 = { total: RECASE.length, applied: applied, overrides: RECASE };
}());
