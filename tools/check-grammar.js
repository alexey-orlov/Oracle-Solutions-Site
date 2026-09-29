#!/usr/bin/env node
/**
 * check-grammar.js — asserts that every product in site/data/content.js fills
 * every slot of the visual grammar documented in docs/VISUAL-GRAMMAR.md.
 *
 *   node tools/check-grammar.js
 *
 * Exits 0 and prints "OK" when all seven products pass; exits 1 and lists
 * every failure otherwise. No dependencies.
 */

"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.resolve(__dirname, "..");
var sandbox = { window: {} };
vm.createContext(sandbox);
/* brand.js first: it defines brandAsset(), which content.js calls to resolve
   every logo path through the active theme (site/assets/brand.js). */
["site/assets/brand.js", "site/data/content.js", "site/data/config.js"].forEach(function (rel) {
  vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), sandbox, { filename: rel });
});
/* Round 15: the site's view of links.json is never a file. tools/site_links.py
   builds it when asked (tools/serve.py on every request, a publish once), so the
   checks below evaluate exactly what the site loads as data/links.js. */
var SITE_LINKS_ERROR = "";
try {
  vm.runInContext(require("child_process").execFileSync("python3", [path.join(root, "tools/site_links.py")],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }), sandbox, { filename: "data/links.js (tools/site_links.py)" });
} catch (error) {
  SITE_LINKS_ERROR = String((error.stderr && String(error.stderr).trim()) || error.message || error).split("\n")[0];
}

var C = sandbox.window.SITE_CONTENT;
var CFG = sandbox.window.SITE_CONFIG;
/* The site's view of links.json: the walkthrough, its artifact copy, the video. */
var LINKS = sandbox.window.SITE_LINKS || {};

var INDUSTRIES = [
  "manufacturing", "logistics", "utilities", "telecom", "healthcare",
  "financial-services", "insurance", "retail", "energy", "public-sector",
  "automotive", "life-sciences", "professional-services", "construction",
  "travel-transport", "cross-industry"
];
/* Round 22 (Alex, 2026-09-29): the Delivery tab is the pack one-pager's
   service-packages table. Its tiers are the site's three, in this order and
   under these names (the 2026-09-18 decision: PoV Jumpstart / Integration /
   Scaling, never "Roll-out" or "Scale"), sized S / M / L as the one-pager
   tags them, each cell one of the one-pager's four marks. */
var DELIVERY_TIERS = ["Jumpstart proof of value", "Integration", "Scaling"];
var DELIVERY_SIZES = ["S", "M", "L"];
var DELIVERY_MARKS = ["partial", "included", "advanced", "none"];
/* The Oracle products widget's two groups, platforms first. */
var ORACLE_GROUPS = ["platform", "connected"];
/* Round 16 (Alex): the delivery method is five stages, on the home track and
   on the Services track alike, under these names. "Managed services" matches
   the hero stack's fourth service tile. */
var DELIVERY_STAGES = ["Workshop", "Jumpstart proof of value", "Integration", "Scaling", "Managed services"];
/* Round 4, C1: a case study is measured, modeled against a historical baseline,
   or in preparation. The status drives the chip and the metric eyebrow — both
   have to say the same word as the story, which is what the eyebrow map below
   enforces — so a fourth value would render an empty chip. */
var CASE_STATUSES = ["measured", "modeled", "in-preparation"];
/* The status word renders ONCE per card, in the chip, read from
   shared.caseStudyStatus — Proven / Forecast / Estimated. The eyebrow over the
   figure used to repeat it, which put the same word on a card twice and made a
   forecast read as a disclaimer rather than a result. Both eyebrow keys are
   retired and the checker fails them if they come back. */
var CASE_STATUS_CHIPS = ["Proven", "Forecast", "Estimated"];
/* Round 20: the Overview's KPI band. A tile names its kind in one of the case
   study's own three words (shared.metricKinds reuses the vocabulary), and its
   chart is one of four forms, each drawn from the metric's own numbers
   (D-design §2.2): a measured before → after, a modelled band, a modelled
   before → after on a scale, or a sourced "from X". */
var METRIC_KINDS = ["proven", "forecast", "estimated"];
var METRIC_KIND_CHIPS = ["Proven", "Forecast", "Estimated"];
var METRIC_FORMS = ["compression", "range", "dumbbell", "baseline"];
/* What round 20 took off the Overview. Nothing renders these keys, and one
   that comes back fails by name. */
var RETIRED_OVERVIEW_KEYS = [
  ["metricsNote", "the KPI band prints no footnote and no method (Alex: metrics \"should not lie but should not apologize\")"],
  ["roi", "the ROI paragraph left with the rail; the KPI band says it in numbers"],
  ["moreDetail", "the More detail disclosure is removed (Alex)"],
  ["featuresDetail", "the long-form feature list rendered only inside More detail"],
  ["featuresNote", "its footnote rendered only inside More detail"]
];
/* The rail tile's shape: a value or an icon, a label and a qualifier. */
var RETIRED_METRIC_KEYS = ["value", "label", "qualifier", "icon"];
/* Round 4, T1: the three tag families and the two availability badges.
   Round 9: the catalog is grouped by the job to be done — six product groups,
   in the order the home page's tiles and the rail list them. The two retired
   ids (processing-pipelines, data-analysis) may not return, here or in the icon
   registry, and the home tiles derive from this set rather than a second list. */
var PATTERN_IDS = ["knowledge-analytics", "deep-research", "documents", "transactions", "forecasting-optimization", "video-image"];
/* Round 17 (Alex: the home tiles "colored / styled like Our offers tiles" on
   softserveinc.com): each group tile is one of four brand fills, and the six
   run in this order, A B C D A B, the one four-fill order in which no two
   touching tiles share a fill in the 3 x 2, 2 x 3 or one-column grid. Each
   tone is a class in site.css holding its hex; the ink on every fill is
   #1a1a1a, at least 4.5:1 on all four. */
var GROUP_TONES = ["blue", "orange", "blue-light", "neutral"];
var GROUP_TONE_HEX = { "blue": "#459fdd", "orange": "#fe8d6b", "blue-light": "#c1dff4", "neutral": "#bdcbd7" };
var GROUP_TONE_ORDER = ["blue", "orange", "blue-light", "neutral", "blue", "orange"];
var GROUP_INK = "#1a1a1a";
/* Round 4, T3, rewritten in round 9 (Alex): ONE canonical technology set, in
   ONE order, with TWO forms of each name. The SHORT `label` is what the rail,
   the product chips, the tile band, `tags[1…]` and the hero stack render; the
   FULL Oracle product name is `fullLabel`, which the Services cards and the
   page's prose carry. Pairing both here is what stops a product, a glyph or a
   card drifting into a variant of a platform name. */
var FACET_IDS = ["oracle-ai-lakehouse", "oracle-ai-data-platform", "oracle-ai-fusion", "oci-nvidia"];
var FACET_LABELS = {
  "oracle-ai-lakehouse": "AI Lakehouse",
  "oracle-ai-data-platform": "AI Data Platform",
  "oracle-ai-fusion": "AI for Fusion Applications",
  "oci-nvidia": "OCI + NVIDIA NeMo"
};
var FACET_FULL = {
  "oracle-ai-lakehouse": "Oracle Autonomous AI Lakehouse",
  "oracle-ai-data-platform": "Oracle AI Data Platform",
  "oracle-ai-fusion": "Oracle AI for Fusion Applications",
  "oci-nvidia": "Oracle Cloud Infrastructure + NVIDIA NeMo"
};
/* The one platform no product runs on: it stays in the set for the hero stack
   and the Services cards, and is not offered as a catalog filter. */
var NON_CATALOG_FACETS = ["oracle-ai-fusion"];
/* A product's platforms, as the renderers read them (UI.productFacets): `facet`
   is one id, or an array of ids when the product's own engine is part of more
   than one Oracle platform (2026-09-29, PROVENANCE §46). */
function productFacets(p) {
  return Array.isArray(p.facet) ? p.facet : (p.facet === undefined ? [] : [p.facet]);
}
/* The products with an interactive walkthrough under site/demo/. The
   Demo badge and the Artifacts filter read the walkthrough link (links.json
   `interactiveDemo` since round 12), not the video flag. */
var DEMO_SLUGS = ["large-document-extraction", "workforce-optimization", "cross-system-erp-qa", "fleet-route-optimization", "repair-or-replace-decisions", "account-insights"];
/* Round 4, T1: only these two carry the muted "in preparation" status line;
   every other product's state is told by its availability badges. */
var UNPACKAGED = ["case-evidence-collection", "plan-vs-actual-investigation"];
var RETIRED_TAGS = ["Available now", "Fixed-price offer", "In preparation"];
var CUSTOMER_NAMES = ["Bosch", "Riyadh Air", "RiyadhAir", "Riyahd", "DHL", "SBG", "BSH", "Binladin", "Belron", "Channel 4", "KPN", "NHS", "OMV"];
/* E: a one-liner says what the buyer's business gets, for whom. It is not the
   place for the packaging story — that is what the Jumpstart tab is. */
var PACKAGING_PHRASES = [
  "packaged from proof of value",
  "from proof of value to enterprise scale",
  "fixed-price",
  "fixed price",
  "quick start",
  "proof of value to enterprise"
];
/* Round 19 (Alex, 2026-09-29: "focus not on the aspects of the tech
   implementation, but on the very specific business value"). A product's
   oneLiner, its hero line and a group's tile line sell what the buyer's business
   gets; the platform, the engine and the data architecture live on the chips and
   the Technology tab. Matched on word boundaries, plural allowed. */
var IMPLEMENTATION_TERMS = [
  "oracle", "oci", "nvidia", "cuopt", "nemo", "ai-q", "lakehouse", "autonomous",
  "gpu", "llm", "language model", "machine learning", "neural", "rag", "vector", "embedding",
  "gold layer", "governed layer", "semantic layer", "data layer", "answer layer", "data platform",
  "api", "sql", "database", "schema", "confidence score", "structured data", "ocr"
];
/* Round 19: phrases that turn a home case card into a note to its reviewer —
   legal hedges, the measurement protocol, the engagement's own mechanics. */
var CASE_HEDGES = [
  "illustrative", "not contractual", "success metrics", "signed before",
  "first engagement", "will run", "proof of value", "scored against"
];
function implementationTerms(s) {
  var low = s.toLowerCase();
  return IMPLEMENTATION_TERMS.filter(function (term) {
    return new RegExp("(^|[^a-z0-9])" + term + "s?(?![a-z0-9])").test(low);
  });
}

var failures = [];
var warnings = [];
function fail(where, message) { failures.push(where + " — " + message); }
function warn(where, message) { warnings.push(where + " — " + message); }

function str(v) { return typeof v === "string" && v.trim().length > 0; }
function arr(v) { return Array.isArray(v); }
function words(s) { return s.trim().split(/\s+/).length; }
function sentences(s) {
  return s.split(/(?<=[.!?])\s+/).filter(function (x) { return x.trim().length; }).length;
}
/* Assets and copy ship on separate tracks, so a missing file is a warning. */
function checkAsset(where, what, rel) {
  if (!fs.existsSync(path.join(root, "site", rel))) {
    warn(where, what + " not on disk yet: site/" + rel);
  }
}

/* Round 17: a group tile's drawing is one ink on the tile's fill, in the
   family's form — the tile draws the frame, so the file carries no size and
   no ground, and every line is the same 1.75 px at every tile width. Exactly
   one spark (the filled thorn the line gathers into), and nothing that is not
   line work: no text, no picture, no second colour, no effect. */
function checkGroupDrawing(where, rel) {
  var file = path.join(root, "site", rel);
  if (!fs.existsSync(file)) return warn(where, "group drawing not on disk yet: site/" + rel);
  var svg = fs.readFileSync(file, "utf8");
  var rootTag = (svg.match(/<svg\b[^>]*>/) || [""])[0];
  if (!/viewBox="0 0 400 220"/.test(rootTag)) fail(rel, 'the root <svg> must carry viewBox="0 0 400 220" — the tile\'s drawing box');
  if (/\s(width|height)=/.test(rootTag)) fail(rel, "the root <svg> carries a width or height — the tile sizes the drawing");
  /* one line per rule, with a count and the first offender, not one per element */
  function each(list, test, message) {
    var bad = list.filter(test);
    if (bad.length) fail(rel, message + " (" + bad.length + "×, first: " + bad[0].slice(0, 70) + ")");
  }
  each(svg.match(/\b(stroke|fill)="[^"]*"/g) || [], function (attr) {
    var value = attr.replace(/^[a-z]+="|"$/g, "").toLowerCase();
    return value !== "none" && value !== GROUP_INK;
  }, "a colour other than the one ink, " + GROUP_INK);
  if (/<(text|image|foreignObject|linearGradient|radialGradient|filter|mask|pattern|style)\b/i.test(svg)) {
    fail(rel, "carries text, a picture, a gradient, a filter, a mask or a style block — the drawing is line work only");
  }
  if (/\b(opacity|fill-opacity|stroke-opacity|stroke-dasharray|marker-(start|mid|end)|style)=/.test(svg)) {
    fail(rel, "carries opacity, dashes, markers or inline styles — one solid ink, one weight");
  }
  var sparks = (svg.match(/\bdata-spark\b/g) || []).length;
  if (sparks !== 1) fail(rel, "has " + sparks + " spark(s) — every drawing gathers into exactly one");
  var shapes = svg.match(/<(path|line|polyline|polygon|circle|ellipse|rect)\b[^>]*>/g) || [];
  var sparkEls = shapes.filter(function (el) { return /\bdata-spark\b/.test(el); });
  var lineEls = shapes.filter(function (el) { return !/\bdata-spark\b/.test(el); });
  each(sparkEls, function (el) { return /\bstroke="(?!none)/.test(el); }, "the spark is stroked — it is a filled shape");
  each(lineEls, function (el) {
    return !/\bstroke="/.test(el) || !/\bstroke-width="1\.75"/.test(el) || !/\bvector-effect="non-scaling-stroke"/.test(el);
  }, 'a line is not stroked at stroke-width="1.75" with vector-effect="non-scaling-stroke"');
  if (Buffer.byteLength(svg, "utf8") > 8 * 1024) fail(rel, "is " + Buffer.byteLength(svg, "utf8") + " bytes — a line drawing stays under 8 KB");
}

function checkHeroImage(where, image) {
  if (!image || typeof image !== "object") return fail(where, "hero.image missing");
  ["file", "alt", "focal"].forEach(function (k) {
    if (!str(image[k])) fail(where, "hero.image." + k + " missing or empty");
  });
  if (!/^assets\/img\/heroes\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(image.file)) {
    fail(where, 'hero.image.file "' + image.file + '" is not assets/img/heroes/<name>.<ext>');
  }
  /* Not a failure: the data layer and the imagery ship on separate tracks. */
  if (!fs.existsSync(path.join(root, "site", image.file))) {
    warn(where, "hero image not on disk yet: site/" + image.file);
  }
}

/* ---- shared heroes ----
   Round 5: the home page carries no hero photograph — the built-on stack visual
   is its only illustration — so `overview.hero.image` is retired, and the
   home-page block below fails if it returns. Since 2026-09-29 no product hero
   carries one either (§55, checked below): every product keeps `hero.image`,
   because it is its catalog tile's photograph (the Services page, which had
   one, left in round 18). */

/* ---- products ---- */
if (!arr(C.products) || C.products.length !== 9) {
  fail("products", "expected exactly 9 products, got " + (arr(C.products) ? C.products.length : "none"));
}

(C.products || []).forEach(function (p) {
  var w = "products[" + p.slug + "]";
  var o = p.overview || {};
  var t = p.technology || {};

  /* identity + hero */
  ["slug", "name", "oneLiner"].forEach(function (k) {
    if (!str(p[k])) fail(w, k + " missing");
  });
  if (str(p.oneLiner)) {
    var lowOne = p.oneLiner.toLowerCase();
    PACKAGING_PHRASES.forEach(function (phrase) {
      if (lowOne.indexOf(phrase) !== -1) {
        fail(w, 'oneLiner carries the packaging phrase "' + phrase + '" — the one-liner says what the product does, not how it is sold');
      }
    });
  }
  ["oneLiner", "heroLine", "heroCaption"].forEach(function (k) {
    if (!str(p[k])) return;
    implementationTerms(p[k]).forEach(function (term) {
      fail(w, k + ' names the implementation ("' + term + '") — it sells the business value; the platform, engine and data architecture belong on the chips and the Technology tab');
    });
  });
  if (p.pov !== undefined) fail(w, "pov is superseded by delivery — nothing renders it");
  /* Round 4, T1: the three availability states became two badges driven by
     config flags. Nothing renders the chip model any more. */
  ["availability", "availabilityChip", "availabilityTooltip"].forEach(function (k) {
    if (p[k] !== undefined) fail(w, k + " is superseded by the availability badges — nothing renders it");
  });
  if (p.statusNote !== undefined) {
    if (!str(p.statusNote)) fail(w, "statusNote must be a non-empty string where present");
    else if (UNPACKAGED.indexOf(p.slug) === -1) {
      fail(w, "statusNote belongs only to the two unpackaged products (" + UNPACKAGED.join(", ") + ")");
    } else if (sentences(p.statusNote) > 1) {
      fail(w, "statusNote is " + sentences(p.statusNote) + " sentences — it is one muted line under the hero one-liner");
    }
  }
  if (UNPACKAGED.indexOf(p.slug) !== -1 && !str(p.statusNote)) {
    fail(w, "statusNote missing — an unpackaged product says so in one line, since it carries no availability badge");
  }
  (p.tags || []).forEach(function (tag) {
    if (RETIRED_TAGS.indexOf(tag) !== -1) {
      fail(w, 'tags carries the retired availability chip "' + tag + '" — availability is a badge now, not a tag');
    }
  });
  if (!arr(p.tags) || !p.tags.length) fail(w, "tags missing");
  /* T3: every platform a product runs on is one of the four canonical facets,
     and the chip that names it carries that facet's label verbatim. One
     platform is written as a string; two or more as an array (2026-09-29), in
     canonical order with no repeats, so there is one way to write each case. */
  var pFacets = productFacets(p);
  if (arr(p.facet) && p.facet.length < 2) {
    fail(w, "facet is an array of " + p.facet.length + " — one platform is written as a string");
  }
  if (!pFacets.length) fail(w, "facet missing");
  pFacets.forEach(function (id, i) {
    if (FACET_IDS.indexOf(id) === -1) {
      fail(w, 'facet "' + id + '" is not one of ' + FACET_IDS.join(" / "));
    } else if (i > 0 && FACET_IDS.indexOf(id) <= FACET_IDS.indexOf(pFacets[i - 1])) {
      fail(w, "facet lists its platforms out of canonical order or twice — " + FACET_IDS.join(" → "));
    }
  });
  /* A platform chip is a claim a seller will repeat, so the Technology tab's
     Oracle products widget names every platform the product runs on (round
     22; before it, the narrative and the Data & platform layer did). The Q&A
     pair's AI Data Platform chip came with exactly that (2026-09-29). */
  var FACET_TO_ORACLE = { "oci-nvidia": "oci", "oracle-ai-data-platform": "ai-data-platform", "oracle-ai-lakehouse": "ai-lakehouse" };
  pFacets.forEach(function (id) {
    var want = FACET_TO_ORACLE[id];
    if (!want) return;
    var listed = ((p.technology || {}).oracle || []).some(function (pick) { return pick.id === want; });
    if (!listed) fail(w, 'runs on "' + (FACET_FULL[id] || id) + '" but technology.oracle does not list "' + want + '"');
  });
  /* The hero chip row is built from `category` and `facet` and skips tags[0]
     and one tag per platform, so those have to say what the renderer already
     says. Anything past them renders as another technology chip beside the
     platform ones, which is how "AI-Q" and "cuOpt" came to read as part of the
     platform name — engine detail belongs in the Technology tab, not in the
     chip row. */
  if (arr(p.tags)) {
    if (p.tags.length !== 1 + pFacets.length) {
      fail(w, "tags holds " + p.tags.length + " entries — exactly " + (1 + pFacets.length) + ": the pattern chip, then one canonical platform label per facet");
    }
    if (str(p.categoryChip) && p.tags[0] !== p.categoryChip) {
      fail(w, 'tags[0] is "' + p.tags[0] + '" but the pattern chip renders "' + p.categoryChip + '"');
    }
    pFacets.forEach(function (id, i) {
      var wantFacetLabel = FACET_LABELS[id];
      if (wantFacetLabel && p.tags[1 + i] !== wantFacetLabel) {
        fail(w, "tags[" + (1 + i) + '] is "' + p.tags[1 + i] + '" but the technology chip renders "' + wantFacetLabel + '"');
      }
    });
  }
  if (!p.hero) fail(w, "hero missing"); else checkHeroImage(w, p.hero.image);
  if (!CFG.products[p.slug]) fail(w, "no matching SITE_CONFIG.products entry");
  else {
    if (typeof CFG.products[p.slug].videoPoster !== "string") {
      fail(w, "config.videoPoster missing (must exist, may be empty)");
    }
    /* Round 18 (Alex: "No fake and placeholder links no longer allowed"): the
       hero's video frame renders only when links.json holds the recording, so
       the `video` switch that promised a frame before one existed is retired.
       A listing that tooling writes with it back fails here, by name. */
    if (CFG.products[p.slug].video !== undefined) {
      fail(w, "config.video is retired (round 18) — the video frame renders only when links.json holds the product's video; delete the key");
    }
    /* Round 4, T1/T2: the Marketplace badge and the Marketplace facet both read
       this flag. A string would be truthy whatever it said. */
    if (typeof CFG.products[p.slug].marketplace !== "boolean") {
      fail(w, "config.marketplace missing or not a boolean (true | false)");
    }
    /* Round 18: the flag and its URL say one thing together. A flag with no
       listing URL would be an inert badge, a placeholder; a URL with the flag
       off would hide a listing that exists. */
    var mpUrl = CFG.products[p.slug].marketplaceUrl || "";
    if (CFG.products[p.slug].marketplace === true && !/^https:\/\//.test(mpUrl)) {
      fail(w, "config.marketplace is true with no https:// marketplaceUrl — no placeholder badge (round 18): set the listing's URL, or false until it exists");
    }
    if (mpUrl && CFG.products[p.slug].marketplace !== true) {
      fail(w, "config.marketplaceUrl is set but config.marketplace is false — the badge would not render for a listing that exists");
    }
  }

  /* 2.1 the problem → what changes (round 20, Alex: "too much text, heading
     indistinguishable from text, not sexy"). Each plate is a display headline
     and one short paragraph under a shared eyebrow (sectionLabels.problemEyebrow
     and .solutionEyebrow), so the per-plate title and icon are retired. The
     copy sells the business value in the reader's nouns, so no platform or
     engine name (round 19's rule, which Alex's instruction extends to it). */
  var ps = o.problemSolution;
  if (!ps) fail(w, "overview.problemSolution missing");
  else ["problem", "solution"].forEach(function (side) {
    var panel = ps[side];
    var pw = w + ".problemSolution." + side;
    if (!panel) return fail(w, "problemSolution." + side + " missing");
    ["headline", "text"].forEach(function (k) {
      if (!str(panel[k])) fail(pw, k + " missing");
      else implementationTerms(panel[k]).forEach(function (term) {
        fail(pw, k + ' names the implementation ("' + term + '") — it sells the business value; the platform and the engine belong on the Technology tab');
      });
    });
    if (str(panel.headline) && panel.headline.length > 60) {
      fail(pw, "headline is " + panel.headline.length + " characters (max 60 — two display lines)");
    }
    if (str(panel.text) && words(panel.text) > 30) fail(pw, "text is " + words(panel.text) + " words (max 30)");
    ["title", "icon"].forEach(function (k) {
      if (panel[k] !== undefined) {
        fail(pw, k + " is retired in round 20 — the eyebrow is the shared sectionLabels." + side + "Eyebrow, and the plate carries no icon");
      }
    });
  });

  /* 2.2 metrics — the numbers widget (round 20, Alex: the ROI block was "too
     wordy, and too boring"; a visual per metric that "could either point to
     number X and say that it's improvement 'from X', or show the potential
     improvement range"; no footnotes, no method, no reviewer notes; round 21:
     a chart a reader matches to its number at a glance). Two or three tiles.
     Each names its kind in one chip word, prints one figure, draws one chart
     from its own numbers, and every bar on the chart prints its value.
     Where each figure comes from is recorded in docs/PROVENANCE.md (§41), never
     in content.js: the data file ships in view-source, and nothing internal
     ships (START-HERE §4), so a `sources` key fails. */
  if (!arr(o.metrics) || o.metrics.length < 2 || o.metrics.length > 3) {
    fail(w, "overview.metrics must hold 2–3 tiles, got " + (arr(o.metrics) ? o.metrics.length : "none"));
  } else {
    var figMax = o.metrics.length === 3 ? 14 : 20;
    var metricKeys = [];
    o.metrics.forEach(function (m, i) {
      var mw = w + ".metrics[" + i + "]";
      RETIRED_METRIC_KEYS.forEach(function (k) {
        if (m[k] !== undefined) fail(mw, k + " is the retired rail-tile shape (round 20) — a tile is { key, title, kind, owner, figure, visual, line }");
      });
      ["key", "title", "kind", "owner", "line"].forEach(function (k) {
        if (!str(m[k])) fail(mw, k + " missing");
      });
      if (str(m.key)) {
        if (metricKeys.indexOf(m.key) !== -1) fail(mw, 'key "' + m.key + '" is used twice on this product');
        metricKeys.push(m.key);
      }
      if (str(m.title) && m.title.length > 40) fail(mw, "title is " + m.title.length + " characters (max 40)");
      if (str(m.owner) && m.owner.length > 40) fail(mw, "owner is " + m.owner.length + " characters (max 40)");
      if (str(m.line) && words(m.line) > 14) fail(mw, "line is " + words(m.line) + " words (max 14 — two lines under the chart)");
      if (str(m.kind) && METRIC_KINDS.indexOf(m.kind) === -1) fail(mw, 'kind "' + m.kind + '" is not ' + METRIC_KINDS.join(" / "));
      var fig = m.figure || {};
      if (!str(fig.text)) fail(mw, "figure.text missing");
      else if (fig.text.length > figMax) {
        fail(mw, 'figure.text "' + fig.text + '" is ' + fig.text.length + " characters (max " + figMax + " with " + o.metrics.length + " tiles)");
      }
      if (fig.prefix !== undefined && (!str(fig.prefix) || fig.prefix.length > 6)) {
        fail(mw, "figure.prefix must be 1–6 characters where present — it sets small beside the figure");
      }
      if (m.sources !== undefined) {
        fail(mw, "sources is internal research — a figure's provenance lives in docs/PROVENANCE.md §41, and content.js ships in view-source; delete the key");
      }
      var vz = m.visual || {};
      if (METRIC_FORMS.indexOf(vz.form) === -1) {
        return fail(mw, 'visual.form "' + vz.form + '" is not ' + METRIC_FORMS.join(" / "));
      }
      if (!str(vz.unit)) fail(mw, "visual.unit missing");
      if (["up", "down"].indexOf(vz.direction) === -1) fail(mw, 'visual.direction "' + vz.direction + '" is not up / down');
      var sc = vz.scale || {};
      var scaled = typeof sc.min === "number" && typeof sc.max === "number" && sc.max > sc.min;
      if (!scaled) fail(mw, "visual.scale needs numbers { min, max } with max > min");
      function onScale(v) { return typeof v === "number" && (!scaled || (v >= sc.min && v <= sc.max)); }
      var before = vz.before || {};
      var after = vz.after;
      var range = vz.range;
      if (!onScale(before.value)) fail(mw, "visual.before.value must be a number on the scale");
      /* Round 21 (Alex, 2026-09-29: the charts were "hard to understand from
         graphics", and "matching between number and the visual is absolutely
         unclear"). A chart is rows named Today and After, each bar with its
         value at its end, and the tile's figure is printed on the chart, on
         the mark it names (product.js kpiChart). So a label is the value
         itself, short enough for the room at a bar's end, and the figure has
         to be one of the chart's printed values. */
      var LABEL_MAX = 12;
      function shortLabel(where, text) {
        if (!str(text)) return fail(mw, where + " missing — every bar on the chart prints its value");
        if (text.length > LABEL_MAX) fail(mw, where + ' "' + text + '" is ' + text.length + " characters (max " + LABEL_MAX + " — the value printed at a bar's end)");
        if (/\b(before|after|today)\b/i.test(text)) fail(mw, where + ' "' + text + '" names its row — the row is named Today or After already; print the value alone');
      }
      function numbers(text) { return (String(text || "").match(/\d+(?:\.\d+)?/g) || []).map(Number); }
      if (vz.form === "compression" || vz.form === "dumbbell") {
        shortLabel("visual.before.label", before.label);
        if (!after || !onScale(after.value)) fail(mw, "visual.after.value must be a number on the scale (" + vz.form + ")");
        shortLabel("visual.after.label", (after || {}).label);
        if (vz.form === "compression" && !(before.value > 0)) {
          fail(mw, "visual.before.value must be above 0 — the After bar is drawn as its share of Today's");
        }
      } else if (after !== undefined) {
        fail(mw, "visual.after belongs to compression and dumbbell only — a " + vz.form + " prints no After bar");
      }
      if (vz.gap !== undefined) {
        if (vz.form !== "compression") fail(mw, "visual.gap belongs to the compression form only — it names the row that draws the difference");
        else if (!str(vz.gap) || vz.gap.length > 8) fail(mw, "visual.gap must be the difference row's name, 1–8 characters");
        else if (!(before.value > (after || {}).value)) fail(mw, "visual.gap needs Today above After — the row draws the difference between them");
      }
      if (vz.form === "range") {
        if (!range || !onScale(range.lo) || !onScale(range.hi) || !(range.hi > range.lo)) {
          fail(mw, "visual.range needs { lo, hi } on the scale, with hi above lo");
        }
        /* Today's bar is indexed to 100 and prints what it stands for
           (current rate, current cost): an unlabeled bar read as a bug. */
        shortLabel("visual.before.label", before.label);
        if (!range || range.label !== fig.text) fail(mw, "visual.range.label must equal figure.text — the After bar's span prints the figure");
      } else if (range !== undefined) {
        fail(mw, "visual.range belongs to the range form only");
      }
      if (vz.form === "baseline") {
        if (before.label !== fig.text) fail(mw, "visual.before.label must equal figure.text — a baseline's Today row prints the figure");
        /* 0–100 is a share (a meter), 0–10 a count in ten (ten dots); any other
           scale draws the Today row with its value and no bar, so the figure
           reads as today's number, never as the saving. */
        if (sc.max === 10 && before.value !== Math.round(before.value)) {
          fail(mw, "visual.scale 0–10 draws ten dots, so before.value must be a whole number");
        }
      }
      /* The figure on the chart: the result on the After row, the starting
         point on Today's (figure.prefix "from"), the difference on the gap
         row, or both numbers of a pair on both rows. */
      if (str(fig.text) && (vz.form === "compression" || vz.form === "dumbbell")) {
        var printed = (after && fig.text === after.label) || (fig.prefix === "from" && fig.text === before.label) || !!vz.gap;
        if (vz.form === "dumbbell") {
          var fn = numbers(fig.text);
          printed = fn.length === 2 && numbers(before.label)[0] === fn[0] && numbers((after || {}).label)[0] === fn[1];
        }
        if (!printed) {
          fail(mw, 'figure "' + (fig.prefix ? fig.prefix + " " : "") + fig.text + '" is not printed on its chart — make it the After label (a result), the Today label with prefix "from" (a starting point), a gap row (a difference), or a pair whose numbers are the two labels');
        }
      }
    });
  }

  /* 2.3 what the Overview no longer carries (round 20): the footnote, the ROI
     paragraph, More detail and the feature detail inside it. */
  RETIRED_OVERVIEW_KEYS.forEach(function (pair) {
    if (o[pair[0]] !== undefined) fail(w, "overview." + pair[0] + " is retired in round 20 — " + pair[1] + "; delete the key");
  });

  /* 2.4 features — not rendered since round 20: the tick-lists left How it
     works and the long-form list left with More detail. The list stays in the
     data for the Jumpstart tab next round, so its shape still holds. */
  if (!arr(o.features) || o.features.length < 6 || o.features.length > 8) {
    fail(w, "overview.features must hold 6–8 items, got " + (arr(o.features) ? o.features.length : "none"));
  } else o.features.forEach(function (f, i) {
    if (!str(f)) return fail(w, "features[" + i + "] is not a string");
    if (words(f) > 12) fail(w, 'features[' + i + '] is ' + words(f) + ' words (max 12): "' + f + '"');
  });

  /* 2.5 industries — the chips are superseded by the industryCases tabs; only
     the "where else this applies" line survives, under the tab component. */
  if (o.industries !== undefined) fail(w, "overview.industries is superseded by overview.industryCases — nothing renders it");
  if (!str(o.industriesNote)) fail(w, "overview.industriesNote missing");

  /* 2.6 scope — not rendered since round 20 (it sat inside More detail); it
     moves to the Jumpstart tab next round, so its shape still holds. More
     detail itself (2.7) is retired above, by name. */
  if (!o.scope || !arr(o.scope.in) || !arr(o.scope.out)) fail(w, "overview.scope.in / .out missing");
  else {
    if (o.scope.in.length < 4) fail(w, "overview.scope.in needs ≥4 items");
    if (o.scope.out.length < 4) fail(w, "overview.scope.out needs ≥4 items");
  }

  /* 2.8 case study — round 4, C1. An anonymized customer callout, or null.
     There is no empty state: a block whose only content is "nothing published
     yet" is worse than its absence on a page sellers demo live. */
  if (o.caseStudy === undefined) fail(w, "overview.caseStudy missing — it is null where no case study ships");
  if (o.successStory !== undefined) fail(w, "overview.successStory is superseded by overview.caseStudy — nothing renders it");
  if (o.caseStudy !== null && o.caseStudy !== undefined) {
    var cs = o.caseStudy;
    if (cs.metricsEyebrow !== undefined) {
      fail(w, "overview.caseStudy.metricsEyebrow is retired — the status chip carries the word once");
    }
    ["descriptor", "area", "industry", "status", "story", "ndaLine", "downloadLabel"].forEach(function (k) {
      if (!str(cs[k])) fail(w, "overview.caseStudy." + k + " missing");
    });
    if (cs.customer !== undefined) fail(w, "overview.caseStudy.customer is banned — no customer is named on this site");
    if (cs.logo !== undefined || cs.logoStacked !== undefined) {
      fail(w, "overview.caseStudy carries a logo — the industry medallion replaced it and no customer mark ships");
    }
    /* The header band was removed: it repeated the industry photograph the
       industry tabs render a few hundred pixels higher on the same page. */
    if (cs.image !== undefined) {
      fail(w, "overview.caseStudy.image is superseded — the callout opens on the medallion, not on a header band");
    }
    if (CASE_STATUSES.indexOf(cs.status) === -1) {
      fail(w, 'overview.caseStudy.status "' + cs.status + '" is not ' + CASE_STATUSES.join(" / "));
    }
    if (INDUSTRIES.indexOf(cs.industry) === -1) {
      fail(w, 'overview.caseStudy.industry "' + cs.industry + '" is not in the fixed set of 16');
    }
    /* One or two headline figures. Two is the default; one is correct where
       only one real outcome exists, and padding the second slot with a
       capability restatement set at 40px is the failure this allows out of. */
    if (!arr(cs.metrics) || cs.metrics.length < 1 || cs.metrics.length > 2) {
      fail(w, "overview.caseStudy.metrics must hold 1 or 2 headline figures");
    } else cs.metrics.forEach(function (m, i) {
      if (!str(m.value) || !str(m.label)) fail(w, "caseStudy.metrics[" + i + "] needs { value, label }");
      if (str(m.value) && m.value.length > 20) fail(w, 'caseStudy.metrics[' + i + '].value "' + m.value + '" is too long to set large');
    });
    if (!arr(cs.scope) || cs.scope.length !== 3) {
      fail(w, "overview.caseStudy.scope must hold exactly 3 facts — the compact scope row");
    } else cs.scope.forEach(function (f, i) {
      if (!str(f.label) || !str(f.value)) fail(w, "caseStudy.scope[" + i + "] needs { label, value }");
    });
    /* Rule 1 of VISUAL-GRAMMAR: a number never renders away from its caveat,
       and this block has no footnote row of its own. */
    if (str(cs.story) && !/illustrative|modeled simulations|not contractual/i.test(cs.story)) {
      fail(w, "caseStudy.story carries figures with no caveat sentence — the block has no footnote row of its own");
    }
  }

  /* E2 · How it works (round 20, Alex: the block did not fit one screen, the
     step heads were poorly lined up, too many fonts, the screenshots too small
     to read; round 21: the block in the main column, and screenshots without
     callouts). A row of step tabs over one frame: each step is a title of one
     or two lines and a short text, and its shot is the walkthrough's whole
     screen at 16:10, nothing drawn over it. `features` stays in the data,
     unrendered.
     The feature-coverage invariant (every overview.features item under exactly
     one step) is retired with the tick-lists: neither list renders any more,
     so the invariant has no surface to keep in step. */
  if (!arr(o.steps) || o.steps.length < 3 || o.steps.length > 5) {
    fail(w, "overview.steps must hold 3–5 workflow steps, got " + (arr(o.steps) ? o.steps.length : "none"));
  } else o.steps.forEach(function (s, i) {
    var sw = w + ".steps[" + i + "]";
    if (s.n !== i + 1) fail(sw, 'n is "' + s.n + '", expected ' + (i + 1) + " — steps are numbered in order from 1");
    ["title", "text"].forEach(function (k) {
      if (!str(s[k])) fail(sw, k + " missing");
    });
    if (str(s.title) && s.title.length > 26) fail(sw, "title is " + s.title.length + " characters (max 26 — one line in the step list)");
    if (str(s.text) && words(s.text) > 30) fail(sw, "text is " + words(s.text) + " words (max 30)");
    if (s.image !== undefined) {
      fail(sw, "image is retired in round 20 — the step's picture is shot { full, alt }");
    }
    var shot = s.shot;
    if (!shot || typeof shot !== "object") return fail(sw, "shot missing — { full, alt }");
    var stem = "assets/img/steps/" + p.slug + "-" + (i + 1);
    if (shot.full !== stem + ".jpg") fail(sw, 'shot.full "' + shot.full + '" must be ' + stem + ".jpg");
    else checkAsset(sw, "step frame", shot.full);
    /* Round 21 (Alex, 2026-09-29: "Just have screenshots without those
       callouts"): no zoom inset and no ring, so nothing to crop, place or
       anchor. Where the eye needs leading, the screenshot shows the element
       selected natively (docs/ASSETS.md §1). */
    ["zoom", "region", "anchor"].forEach(function (k) {
      if (shot[k] !== undefined) fail(sw, "shot." + k + " is retired in round 21 — a frame is the whole screen with nothing drawn over it; delete the key");
    });
    if (!str(shot.alt)) fail(sw, "shot.alt missing — the frame's text equivalent");
  });

  /* E2 · Industry use cases — the tab component */
  if (!arr(o.industryCases) || o.industryCases.length < 3 || o.industryCases.length > 6) {
    fail(w, "overview.industryCases must hold 3–6 cases, got " + (arr(o.industryCases) ? o.industryCases.length : "none"));
  } else {
    var seenKeys = [];
    o.industryCases.forEach(function (c, i) {
      var cw = w + ".industryCases[" + i + "]";
      if (INDUSTRIES.indexOf(c.industry) === -1) fail(cw, 'industry "' + c.industry + '" is not in the fixed set of 16');
      else if (seenKeys.indexOf(c.industry) !== -1) fail(cw, 'industry "' + c.industry + '" appears twice — one tab per industry');
      else seenKeys.push(c.industry);
      ["label", "image", "problem", "solution"].forEach(function (k) {
        if (!str(c[k])) fail(cw, k + " missing");
      });
      if (str(c.label) && C.shared.industryLabels[c.industry] && c.label !== C.shared.industryLabels[c.industry]) {
        fail(cw, 'label "' + c.label + '" does not match shared.industryLabels.' + c.industry);
      }
      if (str(c.image)) {
        var wantImg = new RegExp("^assets/img/industries/" + c.industry + "\\.(jpg|jpeg|png|webp)$");
        if (!wantImg.test(c.image)) fail(cw, 'image "' + c.image + '" must be assets/img/industries/' + c.industry + ".jpg");
        else checkAsset(cw, "industry image", c.image);
      }
      ["problem", "solution"].forEach(function (k) {
        if (str(c[k]) && (sentences(c[k]) < 2 || sentences(c[k]) > 3)) {
          fail(cw, k + " is " + sentences(c[k]) + " sentences (2–3)");
        }
      });
    });
  }

  /* The At-a-glance card is gone (round 3, H): every fact it denormalised is
     printed by the block that owns it — the chips, the Jumpstart investment
     card, the stack. A summary card that restates them is a second place to
     keep in sync. */
  if (o.sideFacts !== undefined) fail(w, "overview.sideFacts is superseded — the At-a-glance card was removed; nothing renders it");

  /* Round 22 · the Technology tab (Alex, 2026-09-29: "I don't like current
     Technology tabs … we have beautiful diagrams in one-pagers … You can have
     some one-liner explainers etc added, but no more than that"): the pack
     one-pager's data-flow strip, one line under it, and the Oracle products
     widget. The shapes it replaced render nowhere, so a returning one fails
     by name. */
  ["narrative", "stack", "capabilities", "groups", "layers", "integration", "notUsed", "flow", "security", "architecture"].forEach(function (k) {
    if (t[k] !== undefined) fail(w, "technology." + k + " is superseded by round 22's strip and widget — nothing renders it");
  });
  if (!str(t.line)) fail(w, "technology.line missing — the one line under the strip");
  else {
    if (sentences(t.line) !== 1) fail(w, "technology.line is " + sentences(t.line) + " sentences — one line and no more");
    if (words(t.line) > 20) fail(w, "technology.line is " + words(t.line) + " words (max 20)");
  }
  var dg = t.diagram;
  function flowBox(where, box, max) {
    var bw = w + ".technology.diagram." + where;
    if (!box || !str(box.name)) return fail(bw, "name missing");
    if (box.note !== undefined && box.note !== null && !str(box.note)) fail(bw, "note must be a non-empty string, null or absent");
    if (str(box.note) && words(box.note) > max) fail(bw, "note is " + words(box.note) + " words (max " + max + ")");
  }
  if (!dg) fail(w, "technology.diagram missing — the strip is the tab's picture");
  else {
    flowBox("source", dg.source, 14);
    if (!arr(dg.destinations) || dg.destinations.length > 2) {
      fail(w, "technology.diagram.destinations must be an array of at most 2 — empty where the source is also the destination");
    } else dg.destinations.forEach(function (box, i) { flowBox("destinations[" + i + "]", box, 12); });
    ["toPlatform", "fromPlatform"].forEach(function (k) {
      if (!str(dg[k])) fail(w, "technology.diagram." + k + " missing — every pipe carries its label");
      else if (words(dg[k]) > 10) fail(w, "technology.diagram." + k + " is " + words(dg[k]) + " words (max 10)");
    });
    if (!dg.platform || !str(dg.platform.label)) fail(w, "technology.diagram.platform.label missing — the cloud box names its platform");
    else if (dg.platform.label.indexOf("Oracle") !== 0) fail(w, 'technology.diagram.platform.label "' + dg.platform.label + '" is not an Oracle platform');
    flowBox("app", dg.app, 8);
    flowBox("engine", dg.engine, 8);
  }
  /* The widget: every entry comes from the one registry, so a system has one
     name and one glyph on every page ("same names and icons … across all
     products"); only its role is the product's, two to four words. */
  var oracleReg = ((C.shared || {}).oracleProducts || {}).items || {};
  if (!arr(t.oracle) || !t.oracle.length) fail(w, "technology.oracle missing — the Oracle products widget");
  else {
    var seenOracle = [];
    t.oracle.forEach(function (pick, i) {
      var ow = w + ".technology.oracle[" + i + "]";
      if (!pick || !oracleReg[pick.id]) return fail(ow, 'id "' + (pick || {}).id + '" is not in shared.oracleProducts.items');
      if (seenOracle.indexOf(pick.id) !== -1) fail(ow, 'id "' + pick.id + '" is listed twice');
      seenOracle.push(pick.id);
      if (!str(pick.role)) fail(ow, "role missing");
      else if (words(pick.role) < 2 || words(pick.role) > 4) fail(ow, 'role "' + pick.role + '" is ' + words(pick.role) + " words (2–4, Alex)");
      if (pick.name !== undefined || pick.icon !== undefined) fail(ow, "carries its own name or icon — both come from the registry");
    });
    if (!t.oracle.some(function (pick) { return oracleReg[(pick || {}).id] && oracleReg[pick.id].group === "platform"; })) {
      fail(w, "technology.oracle names no platform — every product runs on one");
    }
  }

  /* Round 22 · the Delivery tab (Alex, 2026-09-29: "same structure and
     content as we have in packaging table in our one-pager. Add approx.
     duration of phases (with very short footnote that it's confirmed at
     scoping); don't add prices. Everything else should be gone from this
     tab."). The Jumpstart tab's shapes render nowhere. */
  if (p.jumpstart !== undefined) fail(w, "jumpstart is superseded by delivery (round 22) — nothing renders it");
  var dl = p.delivery;
  var tierCount = DELIVERY_TIERS.length;
  if (!dl) fail(w, "delivery missing — the Delivery tab's packages table");
  else {
    if (!arr(dl.scope) || dl.scope.length !== tierCount) fail(w, "delivery.scope must hold one line per tier (" + tierCount + ")");
    else dl.scope.forEach(function (line, i) {
      if (!str(line)) fail(w, "delivery.scope[" + i + "] missing");
      else if (words(line) > 18) fail(w, "delivery.scope[" + i + "] is " + words(line) + " words (max 18) — one line under the tier's name");
    });
    if (dl.durations !== undefined && (!arr(dl.durations) || dl.durations.length !== tierCount || !dl.durations.every(str))) {
      fail(w, "delivery.durations, where present, overrides the standing durations with one string per tier");
    }
    if (!arr(dl.rows) || dl.rows.length < 4 || dl.rows.length > 8) {
      fail(w, "delivery.rows must hold 4–8 capability areas, got " + (arr(dl.rows) ? dl.rows.length : "none"));
    } else dl.rows.forEach(function (row, i) {
      var rw = w + ".delivery.rows[" + i + "]";
      if (!str(row.area)) fail(rw, "area missing");
      if (!arr(row.cells) || row.cells.length !== tierCount) return fail(rw, "cells must hold one per tier (" + tierCount + ")");
      row.cells.forEach(function (cell, j) {
        var cw = rw + ".cells[" + j + "]";
        if (!cell || DELIVERY_MARKS.indexOf(cell.mark) === -1) fail(cw, 'mark "' + (cell || {}).mark + '" is not ' + DELIVERY_MARKS.join(" / "));
        if (cell && cell.text !== undefined && cell.text !== null && !str(cell.text)) fail(cw, "text must be a non-empty string, null or absent");
        if (cell && str(cell.text) && words(cell.text) > 24) fail(cw, "text is " + words(cell.text) + " words (max 24) — a cell holds a phrase");
        if (cell && cell.mark !== "none" && !str(cell.text)) fail(cw, "a " + cell.mark + " cell says what it includes");
      });
    });
    if (!str(dl.advanced)) fail(w, "delivery.advanced missing — the legend's words for the two-dot mark");
    /* No price anywhere in the tab's data (Alex: "don't add prices"), and a
       duration only in the Duration row, never in a phrase. */
    var dlWords = [].concat(dl.scope || [], (dl.rows || []).map(function (row) {
      return [row.area].concat((row.cells || []).map(function (cell) { return (cell || {}).text || ""; })).join(" ");
    })).join(" ");
    /* A package price, not a feature that prices something (Repair-or-replace scales to "priced scope", its repair estimate). */
    var money = dlWords.match(/[€$£]|\b\d+(\.\d+)?\s?[KkMm]\b|\bfixed[- ]price\b|\bpricing\b|\bfee\b|\bprice[sd]? (at|from)\b/i);
    if (money) fail(w, 'delivery names a price ("' + money[0] + '") — the tab states durations, never prices (Alex, round 22)');
    var clock = dlWords.match(/\b\d+\s?(–|-|to)?\s?\d*\s?(weeks?|months?|days?)\b/i);
    if (clock) fail(w, 'delivery states a duration in a phrase ("' + clock[0] + '") — durations live in the Duration row only');
    var tierWord = dlWords.match(/\bPoV\b|\bRoll-?out\b|\bPOV\b/);
    if (tierWord) fail(w, 'delivery says "' + tierWord[0] + '" — the tiers are ' + DELIVERY_TIERS.join(" · "));
  }

  /* invariants carried over from SCHEMA.md */
  if (!p.tile || !arr(p.tile.outcomes) || p.tile.outcomes.length !== 3) fail(w, "tile.outcomes must hold exactly 3");
});

/* ---- E5 · the contact card ---- */
(function () {
  var k = C.shared && C.shared.contact;
  if (!k) return fail("shared.contact", "missing — the Contacts tab and the Services contact section both render it");
  ["name", "email", "blurb"].forEach(function (f) {
    if (!str(k[f])) fail("shared.contact", f + " missing");
  });
  /* The photo is allowed to be empty — the card falls back to initials — but
     the key must exist so the renderer can test it. */
  if (typeof k.photo !== "string") fail("shared.contact", "photo must be a string (empty when no confirmed headshot ships)");
  else if (!k.photo.trim()) warn("shared.contact", "photo is empty — the card renders the initials avatar");
  /* The title is allowed to be empty — it is only printed when a source
     actually carries it — but the key must exist so the renderer can test it. */
  if (typeof k.title !== "string") fail("shared.contact", "title must be a string (empty when no source states it)");
  else if (!k.title.trim()) warn("shared.contact", "title is empty — the card renders name + email only");
  if (k.email !== "oracle@softserveinc.com") {
    fail("shared.contact", 'email must be the practice mailbox "oracle@softserveinc.com", got "' + k.email + '"');
  }
  if (str(k.blurb) && sentences(k.blurb) > 1) fail("shared.contact", "blurb is more than one line");
  /* Round 10: the "Bring to the call" list is retired. It said the same thing
     three times over — the form's own placeholder, and the Jumpstart tab's
     "What we need from you" — and it stretched a person's card into a briefing
     document. The card is a person, an address and one line. */
  ["bring", "bringTitle"].forEach(function (key) {
    if (k[key] !== undefined) {
      fail("shared.contact", key + " retired 2026-09-23 — the list duplicated the form placeholder and the Jumpstart \"What we need from you\"");
    }
  });
  if (str(k.photo)) {
    if (!/^assets\/img\/people\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(k.photo)) {
      fail("shared.contact", 'photo "' + k.photo + '" is not assets/img/people/<name>.<ext>');
    } else checkAsset("shared.contact", "contact photo", k.photo);
  }
  if (k.linkedin !== undefined && !/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//.test(k.linkedin)) {
    fail("shared.contact", "linkedin, when present, must be a public linkedin.com URL — omit the key otherwise");
  }

  /* Round 13 (Alex): every product's Contacts card names a second person, the
     product's own lead, over the one practice address. Each person is stored
     once in shared.people and a product points at one by id, so a name or a
     title cannot drift across the products that share a lead. A person carries
     no address and no line of their own: the mailbox and the blurb are the
     card's, printed once under everyone. */
  var people = C.shared.people || {};
  Object.keys(people).forEach(function (id) {
    var pw = "shared.people." + id;
    var person = people[id] || {};
    ["name", "title"].forEach(function (f) {
      if (!str(person[f])) fail(pw, f + " missing");
    });
    ["email", "blurb"].forEach(function (f) {
      if (person[f] !== undefined) fail(pw, "carries " + f + " — the card prints shared.contact." + f + " once, under everyone");
    });
    if (typeof person.photo !== "string") fail(pw, "photo must be a string (empty when no confirmed headshot ships)");
    else if (!person.photo.trim()) warn(pw, "photo is empty — the card renders the initials avatar");
    else if (!new RegExp("^assets/img/people/" + id + "\\.(jpg|jpeg|png|webp)$").test(person.photo)) {
      fail(pw, 'photo "' + person.photo + '" is not assets/img/people/' + id + ".<ext>");
    } else checkAsset(pw, "contact photo", person.photo);
    if (person.linkedin !== undefined && !/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//.test(person.linkedin)) {
      fail(pw, "linkedin, when present, must be a public linkedin.com URL — omit the key otherwise");
    }
  });
  var led = {};
  (C.products || []).forEach(function (p) {
    var pw = "products[" + p.slug + "].contactPerson";
    if (!str(p.contactPerson)) return fail(pw, "missing — the Contacts card names the product's lead beside " + k.name);
    if (!people[p.contactPerson]) return fail(pw, '"' + p.contactPerson + '" is not an id in shared.people');
    led[p.contactPerson] = true;
  });
  Object.keys(people).forEach(function (id) {
    if (!led[id]) fail("shared.people." + id, "no product points at this person, so nothing renders them");
  });
  /* Round 10: five tabs, in this order. Use cases took the industry block and
     the case study off the Overview; For sellers went the other way — its kit
     request is the Contacts tab's second row, because a page that repeats one
     form under two names is a structure bug. Every retired segment redirects,
     so `legacyIds` is a list, not a single key. */
  var TAB_IDS = ["overview", "use-cases", "technology", "delivery", "contacts"];
  var tabList = C.shared.productTabs || [];
  var tabs = tabList.map(function (x) { return x.id; });
  if (tabs.join(",") !== TAB_IDS.join(",")) {
    fail("shared.productTabs", "ids are " + (tabs.join(", ") || "none") + " — expected " + TAB_IDS.join(", ") + ", in that order");
  }
  tabList.forEach(function (tab) {
    if (!str(tab.label)) fail("shared.productTabs[" + tab.id + "]", "label missing");
    if (tab.legacyId !== undefined) {
      fail("shared.productTabs[" + tab.id + "]", "carries the singular legacyId — retired segments are a `legacyIds` array since round 10");
    }
    if (tab.locked !== undefined) {
      fail("shared.productTabs[" + tab.id + "]", "carries `locked` — retired in round 8; nothing on a product page is locked");
    }
  });
  function legacyIds(id) {
    var found = tabList.filter(function (x) { return x.id === id; })[0];
    return (found && found.legacyIds) || [];
  }
  /* Round 22 (Alex): the Jumpstart tab is Delivery; both of its old segments land. */
  ["jumpstart", "pov"].forEach(function (seg) {
    if (legacyIds("delivery").indexOf(seg) === -1) {
      fail("shared.productTabs[delivery]", 'legacyIds must include "' + seg + '" so /' + seg + ' still lands on the Delivery tab');
    }
  });
  var deliveryTab = tabList.filter(function (x) { return x.id === "delivery"; })[0];
  if (deliveryTab && deliveryTab.label !== "Delivery") fail("shared.productTabs[delivery]", 'label is "' + deliveryTab.label + '" — Alex named it "Delivery"');
  ["demo", "sellers"].forEach(function (seg) {
    if (legacyIds("contacts").indexOf(seg) === -1) {
      fail("shared.productTabs[contacts]", 'legacyIds must include "' + seg + '" — /' + seg + ' redirects to the Contacts tab');
    }
  });

  /* Round 10: one contact ask site-wide. The header button, the product hero's
     button, the Contacts form's heading and its submit all read the same key,
     so the three surfaces cannot drift into three different asks. */
  var site = C.site || {};
  if ((site.primaryCta || {}).label !== (site.navCta || {}).label) {
    fail("site.primaryCta.label", 'is "' + (site.primaryCta || {}).label + '" but site.navCta.label is "' +
      (site.navCta || {}).label + '" — one contact ask site-wide');
  }

  var forms = C.forms || {};
  var demoForm = forms.demo || {};
  if (demoForm.secondarySub !== undefined) {
    fail("forms.demo", "secondarySub retired in round 10 — the Contacts tab reads `sub`, and two subs for one form drift");
  }
  /* The sales flow, stated once and in order: a workshop with the team, then a
     Jumpstart proof of value on their own data (Alex, 2026-09-23). */
  ["workshop", "proof of value"].forEach(function (phrase) {
    if (!str(demoForm.sub) || demoForm.sub.toLowerCase().indexOf(phrase) === -1) {
      fail("forms.demo.sub", 'must name the "' + phrase + '" step — the flow is workshop → Jumpstart proof of value');
    }
  });
  if ((demoForm.submitLabel || "") !== (site.primaryCta || {}).label) {
    fail("forms.demo.submitLabel", "must read site.primaryCta.label — the hero button and the form's submit are one ask");
  }

  /* The walkthrough button names exactly what its badge names (standing rule:
     the walkthrough is an "Interactive demo" everywhere). */
  var demoBadge = (((C.shared || {}).tagFamilies || {}).availability || {}).demo || {};
  if ((C.shared || {}).demoCta !== demoBadge.label) {
    fail("shared.demoCta", 'is "' + (C.shared || {}).demoCta + '" but the availability badge says "' +
      demoBadge.label + '" — the button names what the badge names');
  }

  /* The tab is called Use cases, so the industry tablist's accessible name says
     how they are cut. Round 13 (Alex): the label is no longer printed — the tab
     already names the block — so the renderer may not put a heading back. */
  var industryLabel = (((C.shared || {}).sectionLabels) || {}).industryCases;
  if (str(industryLabel) && /use case/i.test(industryLabel)) {
    fail("shared.sectionLabels.industryCases", 'says "' + industryLabel + '" — the tab already says Use cases; the block names the cut');
  }
  var productSrc = fs.readFileSync(path.join(root, "site/pages/product.js"), "utf8");
  var industryFn = (productSrc.split("function industryCases(")[1] || "").split("\n  function ")[0];
  if (!industryFn) warn("pages/product.js", "industryCases() not found — the no-heading check is reading nothing");
  else if (/blockHead\(|class="h[1-6]|<h[1-6] class="block-title/.test(industryFn)) {
    fail("pages/product.js", "industryCases() prints a heading — the Use cases tab opens on the industry tabs, with no title over them (round 13)");
  }
})();

/* ---- the case-study status words ---- */
(function () {
  var st = (C.shared && C.shared.caseStudyStatus) || {};
  CASE_STATUSES.forEach(function (k, i) {
    if (!st[k]) return;
    if (st[k].chip !== CASE_STATUS_CHIPS[i]) {
      fail("shared.caseStudyStatus." + k, 'chip is "' + st[k].chip + '", expected "' + CASE_STATUS_CHIPS[i] +
        '" — one plain word, not a sentence about the proof of value');
    }
  });
})();

/* ---- no surface states the size of the catalog (2026-09-16) ----
   Seven agents are what is packaged today, not the offering. A total, a
   denominator or a "so far" turns the catalog into a ceiling and invites the
   reader to count what is missing, so none of them ships in copy. */
(function () {
  var pp = C.productsPage || {};
  if (pp.count !== undefined) fail("productsPage.count", "retired — no surface prints the size of the catalog");
  if ((C.facets || {}).footnote !== undefined) {
    fail("facets.footnote", "retired — it existed to explain the platforms with no product, which is the gap the rail no longer shows");
  }
  var strings = [
    ["productsPage.intro", pp.intro],
    ["productsPage.askTile.title", (pp.askTile || {}).title],
    ["productsPage.askTile.body", (pp.askTile || {}).body],
    ["overview.twoWays.panels[0].body", (((C.overview || {}).twoWays || {}).panels || [])[0] && C.overview.twoWays.panels[0].body],
    ["overview.catalog.lead", ((C.overview || {}).catalog || {}).lead],
    ["overview.catalog.title", ((C.overview || {}).catalog || {}).title]
  ];
  /* Round 20: the Overview's own words, the plates, the KPI tiles and the
     steps (the metrics footnote this sweep used to read is retired). */
  (C.products || []).forEach(function (pr) {
    var ov = pr.overview || {};
    var at = "products[" + pr.slug + "].overview";
    ["problem", "solution"].forEach(function (side) {
      var plate = (ov.problemSolution || {})[side] || {};
      strings.push([at + ".problemSolution." + side + ".headline", plate.headline]);
      strings.push([at + ".problemSolution." + side + ".text", plate.text]);
    });
    (ov.metrics || []).forEach(function (m, i) {
      strings.push([at + ".metrics[" + i + "].title", m.title]);
      strings.push([at + ".metrics[" + i + "].line", m.line]);
    });
    (ov.steps || []).forEach(function (s, i) {
      strings.push([at + ".steps[" + i + "].text", s.text]);
    });
  });
  strings.forEach(function (pair) {
    var s = pair[1];
    if (!str(s)) return;
    if (/\b(seven|these seven|four are priced|three are scoped)\b/i.test(s)) {
      fail(pair[0], "states the size of the catalog — say what a reader gets, not how many there are");
    }
    if (/\bso far\b|\byet\b|\bnot seeing\b/i.test(s)) {
      fail(pair[0], "names the gap — the page says what is here, never what is not");
    }
  });
})();

/* ---- the catalog's lead sells; it never answers a reviewer (2026-09-29) ----
   Alex, on "Every product runs in your own Oracle tenancy and starts with a
   Jumpstart on your data — at a fixed price where one is published, otherwise
   scoped per engagement. Filter by the Oracle platform it runs on, or search
   for the job you need done.": "looks like a justification to reviewer, not a
   marketing copy". Each clause had answered a review note: where it runs, how
   it starts, what it costs, how to use the page. Like the home hero's, this
   lead is the promise, what the reader's business gets. The hosting, the
   stages and the price are each product's Jumpstart tab, and the rail and the
   search box name themselves. PROVENANCE §52.
   The same day Alex set the lead himself, his Products panel body on the
   home page. It sells the head start (a working product, not a blank page),
   not a metric, so §52's guard that asked for an hours, cost or revenue word
   went: that was the session's reading, not his rule. His line, 38 words,
   is the cap. PROVENANCE §54. */
(function () {
  var intro = (C.productsPage || {}).intro;
  if (!str(intro)) { fail("productsPage.intro", "missing"); return; }
  var note = intro.match(/Jumpstart|proof of value|Workshop|Integration|Scaling|tenancy|fixed[- ]scope|fixed[- ]price|\bpric(e|ed|es|ing)\b|\bscop(e|ed|ing)\b|per engagement|where one is|otherwise|published/i);
  if (note) {
    fail("productsPage.intro", 'names "' + note[0] + '" — the lead is the promise; the hosting and the stages belong to each product\'s Delivery tab');
  }
  var how = intro.match(/\b(filter|search|browse|click|tap|scroll|rail)\w*/i);
  if (how) {
    fail("productsPage.intro", 'says "' + how[0] + '" — the rail and the search box name themselves; the lead says what the reader gets');
  }
  if (words(intro) > 38) fail("productsPage.intro", "is " + words(intro) + " words (max 38, Alex's own line)");
  if (sentences(intro) > 2) fail("productsPage.intro", "is " + sentences(intro) + " sentences (max 2)");
})();

/* ---- the catalog's head is softserveinc.com's About Us hero (2026-09-29) ----
   Alex: style the catalog's head "as https://www.softserveinc.com/en-us/about-us
   hero screen", with the "Full About us crossing", on a photograph of
   "sufficient resolution and brightness". The page's name and the lead in
   white on a photograph, and the brand's crossing over it: four lines into
   the spark's four tips. Nothing else: no eyebrow, and the search box sits
   over the results it filters. The crossing is drawn from a one-line H1, so
   the title is one word. PROVENANCE §54. */
(function () {
  var pp = C.productsPage || {};
  if (str(pp.title) && /\s/.test(pp.title.trim())) {
    fail("productsPage.title", "is more than one word — the hero's crossing is placed from a one-line H1");
  }
  function jpegWidth(file) {
    var b = fs.readFileSync(file), i = 2;
    while (i + 8 < b.length && b[i] === 0xFF) {
      var m = b[i + 1];
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return b.readUInt16BE(i + 7);
      i += 2 + b.readUInt16BE(i + 2);
    }
    return 0;
  }
  var im = pp.image;
  if (!im || !str(im.file) || !str(im.alt) || !str(im.focal)) {
    fail("productsPage.image", "needs { file, alt, focal } — the hero's photograph");
  } else {
    var file = path.join(root, "site", im.file);
    if (!fs.existsSync(file)) fail("productsPage.image.file", '"' + im.file + '" is not on disk');
    else if (/\.jpe?g$/i.test(file) && jpegWidth(file) < 2400) {
      fail("productsPage.image.file", "is " + jpegWidth(file) + " px wide — a full-bleed hero needs 2400 or more (Alex: \"sufficient resolution\")");
    }
    /* Alex, the same day: "make sure we don't use same background image as
       the background for the main page (alt version) and for product page".
       The hero's photograph is no other picture on the site, by path or by
       bytes. The first cut showed the brand template's oval of light, another
       file of the scene the #/alt hero shows: bytes cannot see a scene, so
       START-HERE §4 keeps the rule for the eye as well. */
    if (fs.existsSync(file)) {
      var crypto = require("crypto");
      var md5 = function (p) { return crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex"); };
      var own = md5(file);
      var raw = fs.readFileSync(path.join(root, "site/data/content.js"), "utf8");
      if (raw.split(im.file).length - 1 > 1) {
        fail("productsPage.image.file", '"' + im.file + '" is another picture on the site too — the catalog\'s hero shares no background');
      }
      var seen = {};
      (raw.match(/assets\/img\/[\w\/.-]+\.(?:jpe?g|png|webp)/g) || []).forEach(function (p) {
        if (seen[p] || p === im.file) return;
        seen[p] = true;
        var other = path.join(root, "site", p);
        if (fs.existsSync(other) && md5(other) === own) {
          fail("productsPage.image.file", "is the same photograph as " + p + " — the catalog's hero shares no background");
        }
      });
    }
  }
  var src = fs.readFileSync(path.join(root, "site/pages/products.js"), "utf8");
  var heroFn = (src.match(/function hero\(C\) \{[\s\S]*?\n  \}\n/) || [""])[0];
  if (!heroFn) {
    fail("site/pages/products.js", "renders no hero() — the catalog's head is a photographic hero (§54)");
  } else {
    ["catalog-hero-img", "catalog-hero-scrim", "catalog-hero-spark", "catalog-hero-line--left", "catalog-hero-line--right",
      "catalog-hero-line--up", "catalog-hero-line--down"].forEach(function (cls) {
      if (heroFn.indexOf(cls) === -1) {
        fail("site/pages/products.js hero()", 'renders no "' + cls + '" — the About Us crossing is four lines into the spark\'s four tips, on a photograph under a scrim');
      }
    });
    if (/eyebrow|tagline/.test(heroFn)) fail("site/pages/products.js hero()", "renders an eyebrow — the hero carries the page's name and the lead, nothing else");
    if (/product-search|search-field/.test(heroFn)) fail("site/pages/products.js hero()", "renders the search box — it sits over the results it filters");
  }
  if (!/results-bar[\s\S]{0,300}id="product-search"/.test(src)) {
    fail("site/pages/products.js", "the search box must open the results bar, over the grid it filters");
  }
  var css = fs.readFileSync(path.join(root, "site/assets/site.css"), "utf8");
  if (!/\.catalog-hero-line--up,\s*\.catalog-hero-line--down\s*\{[^}]*rotate\(25deg\)/.test(css)) {
    fail("site/assets/site.css", "the crossing's axis line runs at 25deg, the spark's own long axis");
  }
})();

/* ---- T1 · the three tag families ---- */
(function () {
  var tf = C.shared && C.shared.tagFamilies;
  if (!tf) return fail("shared.tagFamilies", "missing — the chip row reads its tooltips and icons from here");
  ["pattern", "tech"].forEach(function (fam) {
    var g = tf[fam];
    if (!g) return fail("shared.tagFamilies." + fam, "missing");
    if (!str(g.tooltip)) fail("shared.tagFamilies." + fam, "tooltip missing — every family names itself on hover");
    if (!g.icons || typeof g.icons !== "object") return fail("shared.tagFamilies." + fam, "icons map missing");
    var want = fam === "pattern" ? PATTERN_IDS : FACET_IDS;
    want.forEach(function (id) {
      if (!str(g.icons[id])) fail("shared.tagFamilies." + fam, 'icons has no entry for "' + id + '"');
    });
    Object.keys(g.icons).forEach(function (id) {
      if (want.indexOf(id) === -1) fail("shared.tagFamilies." + fam, 'icons carries "' + id + '", which is not one of ' + want.join(" / "));
    });
  });
  var av = tf.availability;
  if (!av) return fail("shared.tagFamilies.availability", "missing — the Demo and Marketplace badges read their labels here");
  ["demo", "marketplace"].forEach(function (k) {
    var b = av[k];
    if (!b) return fail("shared.tagFamilies.availability." + k, "missing");
    ["label", "tooltip", "icon"].forEach(function (f) {
      if (!str(b[f])) fail("shared.tagFamilies.availability." + k, f + " missing");
    });
  });
  /* The three-state chip model is gone site-wide. */
  if (C.availability !== undefined) fail("availability", "the availability chip map is superseded by the two badges — nothing renders it");
})();

/* ---- C1 · the case-study status chips ---- */
(function () {
  var st = C.shared && C.shared.caseStudyStatus;
  if (!st) return fail("shared.caseStudyStatus", "missing — the status chip reads its label from here, not from a class");
  CASE_STATUSES.forEach(function (k) {
    if (!st[k]) return fail("shared.caseStudyStatus." + k, "missing");
    ["chip", "tooltip"].forEach(function (f) {
      if (!str(st[k][f])) fail("shared.caseStudyStatus." + k, f + " missing");
    });
  });
  Object.keys(st).forEach(function (k) {
    if (CASE_STATUSES.indexOf(k) === -1) fail("shared.caseStudyStatus", 'carries "' + k + '", which is not ' + CASE_STATUSES.join(" / "));
  });
  if (!str(C.shared.sectionLabels && C.shared.sectionLabels.caseStudy)) {
    fail("shared.sectionLabels", "caseStudy missing — the block title on the Overview tab");
  }
  if (C.shared.sectionLabels && C.shared.sectionLabels.successStory !== undefined) {
    fail("shared.sectionLabels", "successStory is superseded by caseStudy");
  }
})();

/* ---- round 20 · Use cases and Contacts (D-design §3, §4) ----
   Alex, 2026-09-29: "all blocks are too greyish". The Use cases tab carries one
   grey step and one dark plate: the industry tabs are text over a hairline with
   a blue underline, never grey chips; the selected industry is one split plate,
   its copy on #edf0f2 and its photograph edge to edge; the case study is the
   #1a1a1a plate, its figures Replica Light under the orange-75 fact dash, never
   Azurio. The contact component wraps itself in a full-bleed #edf0f2 band
   holding one white plate: the people on brand-fill tiles, the mailbox a link
   and never a button, the switch two text tabs, white fields. The band is the
   page's last grey, so the footer's #edf0f2 spacer is not drawn after it —
   two greys back to back read as one grey mass. Each block's rules stay in
   their region, so the home page's case cards and the #/sellers form keep
   their own look. */
(function () {
  var CSS_FILE = "site/assets/site.css";
  var cssR20 = fs.readFileSync(path.join(root, CSS_FILE), "utf8");
  var prodR20 = fs.readFileSync(path.join(root, "site/pages/product.js"), "utf8");
  var appR20 = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");

  function block(name) {
    var head = "/* ===== Round 20 · " + name + " ===== */";
    var end = "/* ===== end Round 20 · " + name + " ===== */";
    var at = cssR20.indexOf(head);
    var stop = cssR20.indexOf(end);
    if (at === -1 || stop < at) {
      fail(CSS_FILE, 'the "Round 20 · ' + name + '" block is missing its header or its end marker — one block per region');
      return "";
    }
    if (cssR20.indexOf(head, at + head.length) !== -1) {
      fail(CSS_FILE, 'the "Round 20 · ' + name + '" block appears twice — one block per region');
    }
    return cssR20.slice(at, stop);
  }
  /* The first rule for exactly this selector inside a block, braces included. */
  function rule(src, selector) {
    var at = src.indexOf("\n" + selector + " {");
    return at === -1 ? "" : src.slice(at, src.indexOf("}", at) + 1);
  }
  /* Every selector a block styles, split on the commas outside parentheses so
     an :is() list stays whole; at-rule preludes are skipped. */
  function selectorsOf(src) {
    var out = [];
    src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/([^{};]+)\{/g, function (match, prelude) {
      var text = prelude.trim();
      if (!text || text.charAt(0) === "@") return match;
      var depth = 0, cur = "";
      for (var i = 0; i < text.length; i += 1) {
        var ch = text.charAt(i);
        if (ch === "(") depth += 1;
        if (ch === ")") depth -= 1;
        if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
      }
      if (cur.trim()) out.push(cur.trim());
      return match;
    });
    return out;
  }
  function need(src, selector, pattern, message) {
    var r = rule(src, selector);
    if (!r) return fail(CSS_FILE, selector + " is not styled in its Round 20 block — " + message);
    if (!pattern.test(r)) fail(CSS_FILE, selector + " — " + message);
  }
  function never(src, selector, pattern, message) {
    var r = rule(src, selector);
    if (r && pattern.test(r)) fail(CSS_FILE, selector + " — " + message);
  }
  var grouped = (cssR20.match(/\n\.cut,\n[\s\S]*?\{\n  border-radius: 0;\n  clip-path: polygon\(/) || [""])[0];

  /* — Use cases — */
  var uses = block("Use cases");
  if (uses) {
    selectorsOf(uses).forEach(function (sel) {
      if (sel.indexOf(".ind-") === -1 && sel.indexOf(".case-callout") === -1) {
        fail(CSS_FILE, 'Round 20 · Use cases styles "' + sel + '" — every rule there is .ind-* or inside .case-callout, so the home case cards keep their look');
      }
    });
    if (/\.case-card\b/.test(uses)) fail(CSS_FILE, "Round 20 · Use cases touches .case-card — the home page's cards keep their round-19 look");
    need(uses, ".ind-tab", /background:\s*none/, "the industry tab is text on white, never a grey chip (background: none)");
    never(uses, ".ind-tab", /var\(--(bg-inset|bg-raised|surface-select)\)|border:\s*1px/, "the industry tab carries a fill or a frame — it is an underline tab");
    need(uses, ".ind-tab.is-active", /inset 0 -2px 0 var\(--action\)/, "the selected industry is ink on a 2px blue underline");
    never(uses, ".ind-tab.is-active", /background/, "the selected industry takes no fill — the underline says it");
    need(uses, ".ind-tablist", /var\(--border-hairline\)/, "the tab row sits on one #d1dae2 hairline");
    need(uses, ".ind-panel", /background:\s*var\(--bg-raised\)/, "the industry plate's copy half is the tab's one grey step, #edf0f2");
    need(uses, ".ind-panel", /--cut:\s*var\(--cut-8\)/, "the industry plate takes the 8px cut");
    /* Q1: every industry's panel in one cell, so the plate is as tall as the
       tallest and the case study under it never jumps between tabs. */
    need(uses, ".ind-panels", /display:\s*grid/, "the industry panels share one grid cell, so the plate keeps one height across tabs");
    need(uses, ".ind-panel", /grid-area:\s*1 \/ 1/, "every industry panel sits in the one cell");
    need(uses, ".ind-panel[hidden]", /visibility:\s*hidden/, "an unselected panel keeps its cell, invisible, instead of leaving it");
    never(uses, ".ind-figure", /border:/, "the photograph runs edge to edge — no frame of its own");
    need(uses, ".case-callout", /background:\s*var\(--surface-dark-raised\)/, "the case study is the tab's one dark plate, #1a1a1a");
    need(uses, ".case-callout .case-figure-value", /font-family:\s*var\(--font-sans\)/, "a case figure is set in Replica, never Azurio");
    need(uses, ".case-callout .case-figure-value", /font-weight:\s*300/, "a case figure is Replica Light");
    never(uses, ".case-callout .case-figure-value", /--font-display/, "a case figure is never Azurio");
    need(uses, ".case-callout .case-figure::before", /#fe8d6b/i, "every case figure carries the orange-75 fact dash");
    if (grouped.indexOf(".ind-panel") === -1) fail(CSS_FILE, "the grouped cut declaration does not list .ind-panel — the split plate carries the cut");
  }
  var industryFnR20 = (prodR20.split("function industryCases(")[1] || "").split("\n  function ")[0];
  if (industryFnR20) {
    var atCopy = industryFnR20.indexOf('class="ind-case"');
    var atPhoto = industryFnR20.indexOf('class="ind-figure"');
    if (atCopy === -1 || atPhoto === -1 || atPhoto < atCopy) {
      fail("site/pages/product.js industryCases()", "the plate is the copy, then the photograph (the split plate, D-design §3)");
    }
    if (!/class="ind-case-title">' \+ UI\.esc\(label\("caseProblem"\)\)/.test(industryFnR20) ||
        !/class="ind-case-title">' \+ UI\.esc\(label\("caseSolution"\)\)/.test(industryFnR20)) {
      fail("site/pages/product.js industryCases()", "the problem and the solution are each a 20px heading over their text, read from sectionLabels.caseProblem / caseSolution");
    }
    if (/class="eyebrow/.test(industryFnR20)) {
      fail("site/pages/product.js industryCases()", "prints an eyebrow — round 20 set the problem and the solution as headings; an eyebrow is never a block's only heading");
    }
  }

  /* — Contacts — */
  var contacts = block("Contacts");
  if (contacts) {
    selectorsOf(contacts).forEach(function (sel) {
      if (sel.indexOf("contact") === -1) {
        fail(CSS_FILE, 'Round 20 · Contacts styles "' + sel + '" — every rule there is scoped to the contact component, so #/sellers keeps its own form');
      }
    });
    /* 2026-09-29 (Alex: "contacts appear on grey background, while other tabs
       are white - all should be white"): the band is white, and the plate
       stands on it as the numbers widget does, white on the panel hairline. */
    never(contacts, ".contact-band", /bg-raised|border-image|background/, "the band carries a ground — it is white, as every other tab is (Alex, 2026-09-29)");
    need(contacts, ".contact-plate", /background:\s*#ffffff/i, "the band holds one white plate");
    need(contacts, ".contact-plate::before", /var\(--border-panel\)[\s\S]*evenodd/, "the white plate on white carries the panel hairline, a ring on its cut");
    need(contacts, ".contact-plate", /--cut:\s*var\(--cut-12\)/, "the white plate takes the 12px cut");
    /* 2026-09-29 (Alex, "weird blue frame"): the square brand tile behind the
       round portrait is gone; an office photograph is not a cut-out team shot. */
    if (/\.contact-tile\b/.test(contacts)) {
      fail(CSS_FILE, "Round 20 · Contacts styles a .contact-tile — the portrait stands on the plate; a brand tile behind it read as a blue frame (Alex, 2026-09-29)");
    }
    /* The band opens the home screen, and the ask fits one screen under the
       masthead (Alex, 2026-09-29). */
    need(contacts, ".home-contact", /padding-block:\s*0/, "the home contact's section gives up both paddings — the band is the screen's ground");
    need(contacts, ".contact-intro", /flex-direction:\s*column/, "the section's eyebrow and H2 open the plate's left column");
    /* Q1: blue 125, the kit pane's link style (.inline-link), 7:1 on white. */
    need(contacts, ".contact-mail", /color:\s*var\(--action-pressed\)/, "the mailbox is a blue-125 link (#0e5e8b), the kit pane's own link style — #1485c4 is 4.05:1 at 18px");
    never(contacts, ".contact-mail", /background|--fill/, "the mailbox carries a fill — an address is a link, never a button");
    need(contacts, ".contact-segmented", /background:\s*none[\s\S]*clip-path:\s*none|clip-path:\s*none[\s\S]*background:\s*none/, "the switch is two text tabs — no grey frame, no cut");
    need(contacts, ".contact-segmented .segment", /--fill:\s*transparent/, "a switch tab takes no fill");
    need(contacts, ".contact-segmented .segment", /text-transform:\s*none/, "a switch tab reads in sentence case, 16px Replica 400");
    need(contacts, '.contact-segmented .segment[aria-selected="true"]', /inset 0 -2px 0 var\(--action\)/, "the selected tab is ink on a 2px blue underline");
    need(contacts, ".contact-tabs :is(.input, .select, .textarea)", /background:\s*#ffffff/i, "the fields are white");
    need(contacts, ".contact-tabs :is(.input, .select, .textarea)", /border:\s*1px solid var\(--border\)/, "the fields carry a 1px #bdcbd7 border");
    need(contacts, ".contact-tabs .field-label", /text-transform:\s*none/, "a field label is 14px Replica 400 in ink, sentence case");
    if (/\.site-footer::before/.test(contacts)) {
      fail(CSS_FILE, "the footer's spacer is hidden after the contact band — the band is white now, so the footer follows it as it follows every other tab");
    }
    if (grouped.indexOf(".contact-plate") === -1) {
      fail(CSS_FILE, "the grouped cut declaration does not list .contact-plate");
    }
  }
  function fnOf(src, name, next) {
    var at = src.indexOf("function " + name + "(");
    var stop = src.indexOf("function " + next + "(");
    return at === -1 || stop < at ? "" : src.slice(at, stop);
  }
  var switchFn = fnOf(appR20, "contactSwitch", "mountContactSwitch");
  var cardFn = fnOf(appR20, "contactCard", "contactSplit");
  var photoFn = fnOf(appR20, "contactPhoto", "contactWho");
  var splitFn = fnOf(appR20, "contactSplit", "contactSwitch");
  if (!switchFn || !cardFn || !photoFn || !splitFn) {
    warn("site/assets/app.js", "contactSwitch / contactCard / contactPhoto / contactSplit not found — the round-20 contact checks are reading nothing");
  } else {
    if (switchFn.indexOf('class="contact-band"') === -1 || switchFn.indexOf('class="contact-plate"') === -1) {
      fail("site/assets/app.js contactSwitch()", "does not wrap itself in the contact band and its white plate — both surfaces take the ground from the component");
    }
    if (!/<a class="contact-mail" href="mailto:/.test(cardFn) || /button\(|\bbtn\b/.test(cardFn)) {
      fail("site/assets/app.js contactCard()", "the mailbox must render as a mailto link, never a button (VISUAL-GRAMMAR §9)");
    }
    if ((cardFn.match(/contact-card-copy/g) || []).length !== 1 || cardFn.indexOf('<ul class="contact-people">') === -1) {
      fail("site/assets/app.js contactCard()", "one card anatomy on both surfaces: the people as rows, then the one address and the one line");
    }
    if (photoFn.indexOf("contact-tile") !== -1 || photoFn.indexOf('class="contact-photo"') === -1) {
      fail("site/assets/app.js contactPhoto()", "the round portrait stands on the plate, with no brand tile behind it (Alex, 2026-09-29: \"weird blue frame\")");
    }
    if (!/class="contact-split-card">' \+\s*intro \+/.test(splitFn)) {
      fail("site/assets/app.js contactSplit()", "a surface's own eyebrow and H2 (`intro`) open the card's column inside the plate — a heading above the band reads unattached (2026-09-29)");
    }
  }
})();

/* ---- T2 · the Artifacts facet group (round 9: was "Availability") ----
   Two checkboxes for the two things a product can come with, named as the
   reader would name them: an interactive demo and an Oracle Marketplace
   listing. The group's own key stays `availability` — renaming it would touch
   every surface — but nothing prints that word any more. */
(function () {
  var f = C.facets || {};
  if (f.marketplace !== undefined) fail("facets.marketplace", "superseded by facets.availability — the single checkbox became a two-option group");
  var av = f.availability;
  if (!av) return fail("facets.availability", "missing — the rail's Artifacts group");
  if (av.label !== "Artifacts") {
    fail("facets.availability", 'label is "' + av.label + '", expected "Artifacts" — the group lists what ships with a product, not whether it is available');
  }
  if (!arr(av.options) || av.options.length !== 2) return fail("facets.availability", "options must hold exactly 2 checkboxes");
  [["demo", "Interactive demo"], ["marketplace", "Oracle Marketplace"]].forEach(function (want, i) {
    if (av.options[i].id !== want[0]) fail("facets.availability", 'options[' + i + '].id is "' + av.options[i].id + '", expected "' + want[0] + '"');
    if (av.options[i].label !== want[1]) {
      fail("facets.availability", 'options[' + i + '].label is "' + av.options[i].label + '", expected "' + want[1] + '"');
    }
  });
})();

/* ---- round 9 · the interactive demo is a walkthrough, not a video ----
   Alex: "ERP Q&A has an interactive demo but no Demo tag". The badge and the
   Artifacts filter both read `demoUrl` — the walkthrough they open — where they
   used to read the `video` flag, which only decides whether the product page
   carries a video frame. The two had drifted in both directions: one product
   with a frame and no walkthrough carried the badge, one with a walkthrough and
   no frame did not. */
(function () {
  var badges = (((C.shared || {}).tagFamilies || {}).availability) || {};
  var demo = badges.demo || {};
  if (demo.label !== "Interactive demo") {
    fail("shared.tagFamilies.availability.demo", 'label is "' + demo.label + '", expected "Interactive demo" — one label site-wide');
  }
  if (demo.icon !== "cursor-click") {
    fail("shared.tagFamilies.availability.demo", 'icon is "' + demo.icon + '", expected "cursor-click" — `play` is the video glyph');
  }
  if (!str(demo.tooltip)) fail("shared.tagFamilies.availability.demo", "tooltip missing");
  var mp = badges.marketplace || {};
  if (mp.label !== "Oracle Marketplace") {
    fail("shared.tagFamilies.availability.marketplace", 'label is "' + mp.label + '", expected "Oracle Marketplace"');
  }
  if (mp.icon !== "storefront") fail("shared.tagFamilies.availability.marketplace", 'icon is "' + mp.icon + '", expected "storefront"');

  /* The badge claims a walkthrough exists, so links.json has to hold one for
     exactly the products whose walkthrough ships under site/demo/. */
  (C.products || []).forEach(function (p) {
    var link = LINKS[p.slug] || {};
    var demo = link.interactiveDemo;
    var has = typeof demo === "string" && demo.trim().length > 0;
    var should = DEMO_SLUGS.indexOf(p.slug) !== -1;
    if (has && !should) fail('links.json products["' + p.slug + '"]', "interactiveDemo is set but no walkthrough ships for this product");
    if (!has && should) fail('links.json products["' + p.slug + '"]', "interactiveDemo is empty, so the interactive demo badge and filter would both miss a walkthrough that exists");
    if (has && !/^https:/.test(demo) && !fs.existsSync(path.join(root, "site", demo.replace(/\/index\.html$/, "")))) {
      warn('links.json products["' + p.slug + '"]', "interactiveDemo points at site/" + demo + ", which is not on disk");
    }
  });
})();

/* ---- T3 · the canonical technology set ---- */
(function () {
  var tech = (C.facets || {}).technology;
  if (!arr(tech) || tech.length !== FACET_IDS.length) {
    return fail("facets.technology", "must hold exactly " + FACET_IDS.length + " platforms, got " +
      (arr(tech) ? tech.length : "none"));
  }
  FACET_IDS.forEach(function (id, i) {
    var where = "facets.technology[" + i + "]";
    if (tech[i].id !== id) fail(where, 'id is "' + tech[i].id + '", expected "' + id + '"');
    if (tech[i].label !== FACET_LABELS[id]) {
      fail(where, 'label is "' + tech[i].label + '", expected the short label "' + FACET_LABELS[id] + '"');
    }
    if (tech[i].fullLabel !== FACET_FULL[id]) {
      fail(where, 'fullLabel is "' + tech[i].fullLabel + '", expected "' + FACET_FULL[id] + '"');
    }
    /* Round 9: the short label may drop the "Oracle" prefix on a chip, but the
       full form is the Oracle product name and opens on it. */
    if (str(tech[i].fullLabel) && tech[i].fullLabel.indexOf("Oracle") !== 0) {
      fail(where, 'fullLabel "' + tech[i].fullLabel + '" does not open on "Oracle" — the long form is the Oracle product name');
    }
    /* The rail carries the one-liner, the grid carries the empty state — a
       facet with no product today still has to say something in both places. */
    ["fullLabel", "description", "emptyState"].forEach(function (k) {
      if (!str(tech[i][k])) fail(where, k + " missing");
    });
    /* `catalog: false` takes a platform out of the rail. Only the one platform
       no product runs on may carry it, and no product may name that platform. */
    if (tech[i].catalog !== undefined) {
      if (tech[i].catalog !== false) fail(where, "catalog may only be set to false (it takes the platform out of the rail)");
      else if (NON_CATALOG_FACETS.indexOf(id) === -1) {
        fail(where, 'catalog: false is allowed only on ' + NON_CATALOG_FACETS.join(", ") + " — every other platform is a filter a click returns");
      }
    }
  });
  NON_CATALOG_FACETS.forEach(function (id) {
    var facet = tech.filter(function (f) { return f.id === id; })[0];
    if (facet && facet.catalog !== false) {
      fail("facets.technology[" + id + "]", "must carry catalog: false — no product runs on it, and a filter that can never return anything is not a filter");
    }
    (C.products || []).forEach(function (p) {
      if (productFacets(p).indexOf(id) !== -1) fail("products[" + p.slug + "]", 'facet "' + id + '" is not a catalog platform — a product cannot run on a platform the rail does not offer');
    });
  });
  /* Round 9: two forms of a name is the most a platform gets. A third
     (`stackLabel`, tried mid-round) put a different name on the stack from the
     rail, which is the drift this block exists to prevent. */
  tech.forEach(function (f, i) {
    if (f.stackLabel !== undefined) {
      fail("facets.technology[" + i + "]", "stackLabel is retired — a platform has two forms, `label` (rail, chips, band, stack) and `fullLabel` (Services cards, prose)");
    }
  });

  /* "Other" was a catch-all that named no Oracle platform and read as a gap in
     the set. Oracle's product name is "Oracle AI for Fusion Applications". */
  tech.forEach(function (f, i) {
    if (/^other$/i.test(f.id) || /^other\b/i.test(f.label || "")) {
      fail("facets.technology[" + i + "]", 'the "Other" catch-all is retired — the set is the four named Oracle platforms');
    }
  });

  /* The Services page's platform cards left with the page in round 18; the
     full Oracle names now reach a reader through the footer's Oracle row and
     the prose, and the home page's four platform tiles derive from
     `facets.technology` itself. */
})();

/* ---- round 9 · the six product groups ----
   The catalog is grouped by the job to be done, and this row is the only place
   a group is written: the home tiles, the rail filter, the hero stack's middle
   band and every product chip all read it. So each group carries what all four
   surfaces need — the short chip, the full name, one line a reader with no
   context understands, the tile image, and the answer the catalog gives when a
   filter on it returns nothing. */
(function () {
  var cats = (C.facets || {}).categories;
  if (!arr(cats) || cats.length !== PATTERN_IDS.length) {
    return fail("facets.categories", "must hold exactly " + PATTERN_IDS.length + " product groups, got " +
      (arr(cats) ? cats.length : "none"));
  }
  PATTERN_IDS.forEach(function (id, i) {
    var c = cats[i] || {};
    var where = "facets.categories[" + i + "]";
    if (c.id !== id) fail(where, 'id is "' + c.id + '", expected "' + id + '" — the groups render in this order everywhere');
    ["chip", "full", "line", "image", "emptyState"].forEach(function (k) {
      if (!str(c[k])) fail(where, k + " missing");
    });
    /* Round 9 (Alex): the tag on a product page is the group's exact name, so
       the short form and the long form are the same string. */
    if (str(c.chip) && c.chip !== c.full) {
      fail(where, 'chip "' + c.chip + '" differs from full "' + c.full + '" — a group has one name, on the tile, the rail and the product chip');
    }
    /* PROVENANCE §45 (Alex, on the six tiles: "some headings now are 2 lines, some 1
       line, so content looks not so clean; fix line breaks (not allowed to do
       tile renaming)"): the home tile sets the name on two lines, broken before
       its last word, and site.css fits the size to the tile so the first line
       never wraps. That fit is measured on the longest first line there is,
       "Enterprise knowledge &" at 22 characters; a longer one can wrap to a
       third line in a narrow tile, so it fails here until .gtile-name's
       divisor is re-measured. */
    if (str(c.full)) {
      var nameCut = c.full.trim().lastIndexOf(" ");
      if (nameCut === -1) {
        fail(where, 'full "' + c.full + '" is one word — the home tile sets a group name on two lines, broken before its last word');
      } else if (nameCut > 22) {
        fail(where, 'full "' + c.full + '" puts ' + nameCut + ' characters before its last word (max 22, "Enterprise knowledge &") — the tile\'s name size is fitted to that line; re-measure .gtile-name\'s --name-fit before going longer');
      }
    }
    /* The tile's one line is read in a third of the row, under the image. The
       budget counts words, not the em dashes a parenthetical rides on. */
    if (str(c.line)) {
      var lineWords = words(c.line.replace(/\s[—–-]\s/g, " "));
      if (lineWords > 26) fail(where, "line is " + lineWords + " words (max 26 — it sits under a tile image)");
      if (c.line.trim().slice(-1) !== ".") fail(where, "line does not end in a period — the six tiles are sentences and sit side by side");
      implementationTerms(c.line).forEach(function (term) {
        fail(where, 'line names the implementation ("' + term + '") — a group tile says what the buyer gets, not how it is built');
      });
    }
    /* Round 17 (Alex, on round 16's screenshot-on-a-photograph tiles: "I don't
       like current mix of screenshots with backgrounds"; each group's image
       must be "relevant to it", drawn "like at the reference page"): the tile
       art is the group's own line drawing, one SVG named after the group, in
       the one ink, cropped by the tile's top and left edges, with one spark. */
    if (str(c.image)) {
      if (c.image !== "assets/img/groups/" + id + ".svg") {
        fail(where, 'image "' + c.image + '" must be assets/img/groups/' + id + ".svg — the group's line drawing, named after the group");
      } else {
        checkGroupDrawing(where, c.image);
      }
    }
    /* The round-16 stage (a chrome photograph under the software's window) is
       what Alex rejected in round 17. */
    if (c.stage !== undefined) fail(where, "stage is retired in round 17 — the tile is a flat fill with the group's drawing, not a photograph");
    if (GROUP_TONES.indexOf(c.tone) === -1) {
      fail(where, 'tone "' + c.tone + '" must be one of ' + GROUP_TONES.join(", ") + " — the tile's flat fill");
    }
    /* The empty state is a capability, never a gap: the no-"yet" rule of §18.9
       applies to it more than to any other string, because it is the one a
       reader meets where a product does not exist. */
    if (str(c.emptyState) && /\byet\b|\bso far\b|\bcoming\b|\bnot seeing\b/i.test(c.emptyState)) {
      fail(where, "emptyState names the gap — say what the practice does deliver and what to tell us");
    }
  });
  /* Round 17: the six fills run A B C D A B, the one four-fill order in which
     no two tiles that touch share a fill in any of the three grids (3 x 2
     above 900 px, 2 x 3 down to 560, one column below). The order is pinned,
     and the adjacency is re-derived, so a reordered group or a new fill
     cannot quietly stack two blues. */
  var tones = cats.map(function (c) { return c.tone; });
  if (tones.join(" ") !== GROUP_TONE_ORDER.join(" ")) {
    fail("facets.categories", "tones run " + tones.join(", ") + " — the order is " + GROUP_TONE_ORDER.join(", "));
  }
  [3, 2, 1].forEach(function (cols) {
    tones.forEach(function (t, i) {
      var right = (i % cols) < cols - 1 ? i + 1 : -1;
      var below = i + cols < tones.length ? i + cols : -1;
      [right, below].forEach(function (j) {
        if (j > -1 && tones[j] === t) {
          fail("facets.categories", "tiles " + (i + 1) + " and " + (j + 1) + ' touch in the ' + cols + "-column grid and share the fill \"" + t + '"');
        }
      });
    });
  });
})();

/* ---- C2 · the home-page case-study cards ---- */
(function () {
  var o = C.overview || {};
  if (o.evidence !== undefined) fail("overview.evidence", "superseded by overview.caseStudies — nothing renders it");
  if (o.evidenceIntro !== undefined) fail("overview.evidenceIntro", "superseded by overview.caseStudiesIntro");
  var intro = o.caseStudiesIntro;
  if (!intro || !str(intro.title) || !str(intro.body)) fail("overview.caseStudiesIntro", "needs { title, body }");
  var cards = o.caseStudies;
  /* The grid is one card per product that carries a case study — derived, not a
     fixed count, so adding or withdrawing a case study moves both surfaces
     together instead of failing the build on an arithmetic constant. */
  var withCase = (C.products || []).filter(function (p) {
    return p.overview && p.overview.caseStudy;
  });
  if (!arr(cards) || cards.length !== withCase.length) {
    return fail("overview.caseStudies", "must hold one card per product that carries a case study (" +
      withCase.length + "), got " + (arr(cards) ? cards.length : "none"));
  }
  var slugs = (C.products || []).map(function (p) { return p.slug; });
  /* …and the cover must be complete in the other direction too: a product with
     a case study the home page never shows is a case study nobody finds. */
  withCase.forEach(function (p) {
    var shown = cards.some(function (c) { return c.product && c.product.slug === p.slug; });
    if (!shown) {
      fail("overview.caseStudies", 'no card for "' + p.slug + '", which carries overview.caseStudy');
    }
  });
  cards.forEach(function (c, i) {
    var cw = "overview.caseStudies[" + i + "]";
    if (c.metricEyebrow !== undefined) {
      fail(cw, "metricEyebrow is retired — a home card carries no status word (Alex, 2026-09-29)");
    }
    ["id", "descriptor", "area", "industry", "status", "line"].forEach(function (k) {
      if (!str(c[k])) fail(cw, k + " missing");
    });
    /* Round 11: the card opens on a photograph again, but it is the industry's
       own picture, derived from `industry` by the renderer — so no image or
       band key comes back into the data, and no logo ever does. */
    ["customer", "logo", "logoStacked", "band", "label", "image"].forEach(function (k) {
      if (c[k] !== undefined) fail(cw, k + " is superseded — the card is anonymized: no logo, and its photograph is derived from `industry`, not stored");
    });
    if (CASE_STATUSES.indexOf(c.status) === -1) fail(cw, 'status "' + c.status + '" is not ' + CASE_STATUSES.join(" / "));
    if (INDUSTRIES.indexOf(c.industry) === -1) fail(cw, 'industry "' + c.industry + '" is not in the fixed set of 16');
    else checkAsset(cw, "industry photograph", "assets/img/industries/" + c.industry + ".jpg");
    if (!c.metric || !str(c.metric.value) || !str(c.metric.label)) fail(cw, "metric needs { value, label }");
    else if (c.metric.value.length > 20) fail(cw, 'metric.value "' + c.metric.value + '" is too long to set large');
    /* Round 19 (Alex, 2026-09-29: the home case studies focus "on business value,
       not on technical details + no justifications for reviewer and unnecessary
       disclaimers"). The footnote row is retired, and since §62 the status chip
       too (Alex: "remove 'Forecast', 'Proven' etc labels on the main page in
       case studies"): the card speaks the customer's problem and what changes,
       never the engine or the engagement's mechanics. `status` stays in the
       data: it keeps the card and its product's case study telling one story,
       and the product page's chip reads it. */
    if (c.footnote !== undefined) {
      fail(cw, "footnote is retired in round 19 — no reviewer justification or disclaimer on a home card");
    }
    [["line", c.line], ["metric.label", (c.metric || {}).label]].forEach(function (pair) {
      if (!str(pair[1])) return;
      implementationTerms(pair[1]).forEach(function (term) {
        fail(cw, pair[0] + ' names the implementation ("' + term + '") — a case card says what changed for the business, not how it is built');
      });
      CASE_HEDGES.forEach(function (h) {
        if (pair[1].toLowerCase().indexOf(h) !== -1) {
          fail(cw, pair[0] + ' carries "' + h + '" — a reviewer justification or engagement mechanics, not what changed for the customer');
        }
      });
    });
    /* PROVENANCE §4 keeps two facts load-bearing on a forecast: it was
       simulated, on the customer's own history. With the footnote gone they ride
       in the figure's own line, said positively. */
    if (c.status === "modeled" && c.metric && str(c.metric.label) &&
        !(/simulat/i.test(c.metric.label) && /own (history|historical|past)/i.test(c.metric.label))) {
      fail(cw, "a Forecast card's metric.label must say the figure was simulated on the customer's own history (PROVENANCE §4)");
    }
    if (!c.product || !str(c.product.slug) || !str(c.product.name)) fail(cw, "product needs { slug, name }");
    else {
      if (slugs.indexOf(c.product.slug) === -1) fail(cw, 'product.slug "' + c.product.slug + '" is not one of the seven');
      var target = (C.products || []).filter(function (p) { return p.slug === c.product.slug; })[0];
      if (target && target.name !== c.product.name) {
        fail(cw, 'product.name "' + c.product.name + '" does not match products[' + c.product.slug + '].name "' + target.name + '"');
      }
      /* The home card and the product page tell one engagement. A card whose
         product has no case study would link a reader to an empty page. */
      if (target && !(target.overview && target.overview.caseStudy)) {
        fail(cw, 'product "' + c.product.slug + '" has overview.caseStudy null — the home card would link to a page with no case study');
      }
      if (target && target.overview && target.overview.caseStudy) {
        var full = target.overview.caseStudy;
        ["descriptor", "area", "industry", "status"].forEach(function (k) {
          if (full[k] !== c[k]) fail(cw, k + ' disagrees with products[' + c.product.slug + '].overview.caseStudy.' + k);
        });
        /* Round 11: the card's figure is the callout's headline figure. The two
           qualitative ones ("Same day", "Every variance") were rewritten on both
           surfaces at once; this keeps every card's value in step with its
           product page, so neither can be re-worded alone. */
        var headline = (arr(full.metrics) && full.metrics[0]) || {};
        if (c.metric && str(c.metric.value) && headline.value !== c.metric.value) {
          fail(cw, 'metric.value "' + c.metric.value + '" disagrees with products[' + c.product.slug +
            '].overview.caseStudy.metrics[0].value "' + headline.value + '" — the card and the product page state one figure');
        }
      }
    }
  });
  /* Round 11 (Alex, 2026-09-23, on two cards reading "Hours, not quarters" and
     "Hours, not weeks" side by side: "sounds weird"): peer cards each make their
     own claim, so no two headline figures may open on the same word — a shared
     pattern reads as a template even when no word repeats three times. */
  var openers = {};
  cards.forEach(function (c, i) {
    var first = String((c.metric || {}).value || "").trim().split(/[\s,]+/)[0].toLowerCase();
    if (!first) return;
    if (Object.prototype.hasOwnProperty.call(openers, first)) {
      fail("overview.caseStudies[" + i + "].metric.value", 'opens on "' + first + '", as card ' + openers[first] +
        " does — peer cards side by side each make their own claim");
    } else openers[first] = i;
  });
  /* The case-study footnotes carry each engagement's evidence; nothing else
     restates the engagements (the Services page, which once did, is gone). */
})();

/* ---- round 5 · the home page ----
   The seven-screen home page is not a product page, so none of the grammar
   above says anything about it. This block is its contract: one object per
   screen, every key a screen reads asserted here, and every key the old home
   page read failed outright. A retired key that still parses is how a dead
   block comes back — `overview.hero.image` and `overview.servicesTeaser` both
   had renderers a week ago. */
(function () {
  var s = C.site || {};
  var o = C.overview || {};

  function reqStr(where, obj, keys) {
    keys.forEach(function (k) {
      if (!str((obj || {})[k])) fail(where, k + " missing");
    });
  }
  function reqCta(where, cta) {
    if (!cta || !str(cta.label) || !str(cta.route)) fail(where, "needs { label, route }");
  }

  /* --- the shell: the name, the three-item bar and the three CTAs --- */
  ["name", "title", "metaDescription"].forEach(function (k) {
    if (!str(s[k])) fail("site", k + " missing");
  });
  /* The catalog's eyebrow was the tagline's one reader, and it left with the
     About Us hero (§54): Alex's lead now says what it said. */
  if (s.tagline !== undefined) fail("site.tagline", "retired in §54 — no surface renders it");
  /* Two items and no "Overview": the logo is the home link. Case studies left
     the header on 2026-09-17 (Alex) — the home page still carries its
     case-study screen. For sellers took the slot in round 8 and left it the
     same day (Alex): #/sellers stays, reached from the footer's link row (and,
     until the all-offers kit went on 2026-09-29, from the Get the full kit
     link in a product kit confirmation). Round 18
     (Alex): the Services page is gone, and "Services" lands on the home page's
     Packaged services screen, as the header's ask lands on its contact. */
  var NAV = [
    { label: "Products", route: "#/products" },
    { label: "Services", route: "#/#how-we-deliver" }
  ];
  if (!s.navCta || s.navCta.route !== "#/#request-a-demo") {
    fail("site.navCta", 'route must be "#/#request-a-demo" — the header\'s ask lands on the home page\'s contact (round 18)');
  }
  if (!arr(s.nav) || s.nav.length !== NAV.length) {
    fail("site.nav", "must hold exactly " + NAV.length + " items (Products · Services), got " +
      (arr(s.nav) ? s.nav.length : "none"));
  } else NAV.forEach(function (want, i) {
    var got = s.nav[i] || {};
    if (got.label !== want.label) fail("site.nav[" + i + "]", 'label is "' + got.label + '", expected "' + want.label + '"');
    if (got.route !== want.route) fail("site.nav[" + i + "]", 'route is "' + got.route + '", expected "' + want.route + '"');
  });
  /* Two CTAs, two jobs, and they are not interchangeable: `navCta` is the
     header button, `primaryCta` the label every product hero still carries.
     Round 6 retired `secondaryCta` with the Services hero's quiet button. */
  ["navCta", "primaryCta"].forEach(function (k) {
    reqCta("site." + k, s[k]);
  });
  if (s.secondaryCta !== undefined) fail("site.secondaryCta", "retired in round 6 — the Services hero carries one button");

  /* --- S1 · the hero --- */
  var h = o.hero || {};
  if (!str(h.eyebrow)) fail("overview.hero", "eyebrow missing");
  var hl = h.headline;
  /* Round 9: three sentences on three lines — what we build, what it is built
     on, what it is worth. The middle one is the page's one accent line. */
  if (!hl || !str(hl.lead) || !str(hl.accent) || !str(hl.proof)) {
    fail("overview.hero.headline", "needs { lead, accent, proof } — the black lead, the orange accent line, then the proof line");
  } else if (hl.rest !== undefined) {
    fail("overview.hero.headline", "carries the product-hero `rest` key — the home H1 is lead + accent + proof");
  } else if (words(hl.proof) > 3) {
    fail("overview.hero.headline", "proof is " + words(hl.proof) + " words (max 3 — it is the H1's third display line)");
  }
  if (!str(h.lead)) fail("overview.hero", "lead missing");
  else if (words(h.lead) > 45) {
    fail("overview.hero", "lead is " + words(h.lead) + " words (max 45 — it sits in a column beside the stack visual)");
  }
  /* Round 16 (Alex rewrote the lead as "leading enterprise AI practice,
     accelerated delivery methodology combined with the power of Oracle data &
     cloud … accelerate their time-to-value with AI"): the lead is the promise,
     what SoftServe and Oracle bring and the time to value it buys. The
     procedure (the stages, the scope, where it runs) is S4's, and the old lead
     that walked through it is what he replaced. */
  if (str(h.lead)) {
    if (!/\btime to value\b/i.test(h.lead)) {
      fail("overview.hero.lead", 'must carry the promise, "time to value" — the lead is what the reader gets, not how');
    }
    var procedure = h.lead.match(/Jumpstart|proof of value|Workshop|Integration|Scaling|tenancy|fixed-scope|fixed price/i);
    if (procedure) {
      fail("overview.hero.lead", 'names "' + procedure[0] + '" — the lead is the promise; the stages, the scope and the hosting belong to S4');
    }
  }
  if (!arr(h.ctas) || h.ctas.length !== 2) {
    fail("overview.hero.ctas", "must hold exactly 2 buttons, got " + (arr(h.ctas) ? h.ctas.length : "none"));
  } else h.ctas.forEach(function (c, i) {
    ["label", "route", "kind"].forEach(function (k) {
      if (!str((c || {})[k])) fail("overview.hero.ctas[" + i + "]", k + " missing");
    });
  });

  /* --- the #/alt hero's own H1 and lead (Alex, 2026-09-29, PROVENANCE §47) ---
     Three lines, one each at every width: home-alt.css sizes the H1 so its
     longest line, "ROI proven in weeks." (9.8 em), fills the copy column
     with 3 % to spare (--ahero-fit, divisor 10.1). A longer line breaks
     that fit, so re-measure the divisor before raising the cap. The first
     line runs on into the second ("Enterprise AI agents / Built on
     Oracle."), so it takes no full stop (Alex, the same evening). The lead
     is the live lead's promise on two lines from 1180 px up (35 em measure)
     and obeys the same rules: the promise, never the procedure. */
  var ah = (C.overviewAlt || {}).hero || {};
  if (ah.headline !== undefined) {
    var ahl = ah.headline || {};
    if (!str(ahl.lead) || !str(ahl.accent) || !str(ahl.proof) || ahl.rest !== undefined) {
      fail("overviewAlt.hero.headline", "needs { lead, accent, proof } — three lines, one each");
    } else {
      ["lead", "accent", "proof"].forEach(function (k) {
        if (ahl[k].length > 21) {
          fail("overviewAlt.hero.headline." + k, "is " + ahl[k].length + " characters (max 21 — each line holds one line at the H1's fitted size)");
        }
      });
      if (/[.!?…:;,]\s*$/.test(ahl.lead)) {
        fail("overviewAlt.hero.headline.lead", 'ends on a stop — it runs on into "' + ahl.accent + '", so it takes none (Alex, 2026-09-29)');
      }
    }
  }

  /* The #/alt hero carries no figures: they stand under it on white, in the
     live page's own proof strip, which overview.js renders and overview-alt.js
     leaves in place (Alex, 2026-09-29: "same or similar to how they are
     placed on the current main"). Its copy is centred in the photograph as
     the eye reads it, from the H1's capitals to the ask's foot: the flex
     centre, and the foot's padding adding back the .145 em the H1's first
     line box holds above its capitals (Alex, the same evening: "make sure to
     properly center the text"). PROVENANCE §47. */
  var altSrc = fs.readFileSync(path.join(root, "site/pages/overview-alt.js"), "utf8");
  var altCss = fs.readFileSync(path.join(root, "site/assets/home-alt.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  if (/stat-band--home|ahero-stat|ahero-band/.test(altSrc)) {
    fail("site/pages/overview-alt.js", "touches the figures — under the #/alt hero they are the live page's proof strip, left in place, on white (§47)");
  }
  if (/\.(?:ahero-stat\w*|ahero-band\w*|stat-band--home|stat-row--home)\b/.test(altCss)) {
    fail("site/assets/home-alt.css", "styles the figures — the proof strip under the #/alt hero is the live page's own, as on #/ (§47)");
  }
  if (!/\.ahero-photo\s*\{[^}]*align-items:\s*center/.test(altCss)) {
    fail("site/assets/home-alt.css", '.ahero-photo must centre its copy (align-items: center) — "make sure to properly center the text" (§47)');
  }
  if (!/\.ahero-copy\s*\{[^}]*padding-block:\s*var\(--ahero-pad\)\s+calc\(var\(--ahero-pad\)\s*\+\s*\.145\s*\*\s*var\(--ahero-h1\)\)/.test(altCss)) {
    fail("site/assets/home-alt.css", ".ahero-copy's foot must add back the .145 em of air above the H1's capitals, or the copy reads low (§47)");
  }
  if (ah.lead !== undefined) {
    if (!str(ah.lead)) fail("overviewAlt.hero.lead", "is empty");
    else {
      if (ah.lead.length > 143) {
        fail("overviewAlt.hero.lead", "is " + ah.lead.length + " characters (max 143 — two lines at a 35 em measure from 1180 px up)");
      }
      if (!/\btime to value\b/i.test(ah.lead)) {
        fail("overviewAlt.hero.lead", 'must carry the promise, "time to value" — the lead is what the reader gets, not how');
      }
      var altProcedure = ah.lead.match(/Jumpstart|proof of value|Workshop|Integration|Scaling|tenancy|fixed-scope|fixed price/i);
      if (altProcedure) {
        fail("overviewAlt.hero.lead", 'names "' + altProcedure[0] + '" — the lead is the promise; the stages, the scope and the hosting belong to S4');
      }
    }
  }

  /* Round 9: the stack is three layers read from the bottom up — Oracle's
     platforms, the SoftServe product groups built on them, the SoftServe
     services that prove, integrate and scale them. Only the services band is
     written here; the middle band derives from `facets.categories` and the
     bottom one from `facets.technology`, so the visual cannot name a group or a
     platform in words the rest of the site does not use. */
  var stack = h.stack;
  if (!stack) fail("overview.hero.stack", "missing — the built-on visual is this hero's only illustration");
  else {
    reqStr("overview.hero.stack", stack, ["ariaLabel", "productsLabel", "platformsLabel"]);
    /* The three-band model of round 5 (patterns on top, a written SoftServe
       layer in the middle) is retired: nothing renders either key. */
    ["patternsLabel", "softserve"].forEach(function (k) {
      if (stack[k] !== undefined) {
        fail("overview.hero.stack." + k, "is superseded by the round-9 three-layer stack (services · products · platforms) — nothing renders it");
      }
    });
    var sv = stack.services;
    if (!sv) fail("overview.hero.stack.services", "missing — the top band of the three");
    else {
      if (!str(sv.label)) fail("overview.hero.stack.services", "label missing");
      if (!arr(sv.items) || sv.items.length !== 4) {
        fail("overview.hero.stack.services", "items must hold exactly 4 service tiles, got " +
          (arr(sv.items) ? sv.items.length : "none"));
      } else sv.items.forEach(function (item, i) {
        if (!str((item || {}).name)) fail("overview.hero.stack.services", "items[" + i + "].name missing");
        if (!str((item || {}).icon)) fail("overview.hero.stack.services", "items[" + i + "].icon missing");
      });
    }
    /* The bottom band renders `facets.technology` in ITS order, so the stack
       cannot hold an order of its own: one canonical sequence, everywhere. */
    if (stack.platformOrder !== undefined) {
      fail("overview.hero.stack.platformOrder", "retired — the stack derives the platforms from facets.technology in the canonical order, so there is no second ordering to keep in sync");
    }
  }
  if (!arr(h.stats) || h.stats.length < 3 || h.stats.length > 4) {
    fail("overview.hero.stats", "must hold 3 or 4 tiles — the proof strip under the hero, got " +
      (arr(h.stats) ? h.stats.length : "none"));
  } else h.stats.forEach(function (st, i) {
    var sw = "overview.hero.stats[" + i + "]";
    if (!str((st || {}).value)) fail(sw, "value missing");
    else if (st.value.length > 20) fail(sw, 'value "' + st.value + '" is too long to set large');
    if (!str((st || {}).label)) fail(sw, "label missing");
    /* Round 9: an optional small word set before the figure on its own
       baseline ("from 30 days"). It is a qualifier, not a caption. */
    if ((st || {}).prefix !== undefined) {
      if (!str(st.prefix)) fail(sw, "prefix must be a non-empty string where present");
      else if (st.prefix.length > 6) fail(sw, 'prefix "' + st.prefix + '" is too long — it sets at .45em beside the figure (max 6 characters)');
    }
  });

  /* --- S2 · two ways in --- */
  var tw = o.twoWays;
  if (!tw) fail("overview.twoWays", "missing — S2, the two photographic panels");
  else {
    reqStr("overview.twoWays", tw, ["eyebrow", "title"]);
    if (!arr(tw.panels) || tw.panels.length !== 2) {
      fail("overview.twoWays.panels", "must hold exactly 2 panels — products and practice, got " +
        (arr(tw.panels) ? tw.panels.length : "none"));
    } else tw.panels.forEach(function (pn, i) {
      var pw = "overview.twoWays.panels[" + i + "]";
      reqStr(pw, pn, ["id", "icon", "title", "body"]);
      /* Peers: three bullets each, so the two panels are one shape and their
         CTAs land on one baseline. */
      if (!arr(pn.bullets) || pn.bullets.length !== 3) {
        fail(pw, "bullets must hold exactly 3 — the two panels are peers, got " +
          (arr(pn.bullets) ? pn.bullets.length : "none"));
      } else pn.bullets.forEach(function (b, j) {
        if (!str(b)) fail(pw, "bullets[" + j + "] is not a string");
      });
      reqCta(pw + ".cta", pn.cta);
      /* Round 11 (Alex): each panel is a photograph with its copy on it, so each
         carries the hero-image shape — the file, the alt that describes it for
         the docs (the renderer sets alt="" because the copy carries the panel),
         and the focal point the crop holds. */
      var im = pn.image;
      if (!im || typeof im !== "object") {
        fail(pw, "image missing — { file, alt, focal }, the photograph the panel's copy sits on");
      } else {
        ["file", "alt", "focal"].forEach(function (k) {
          if (!str(im[k])) fail(pw, "image." + k + " missing or empty");
        });
        if (str(im.file)) {
          if (!/^assets\/img\/[a-z0-9-]+\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(im.file) || im.file.indexOf("/logos/") !== -1) {
            fail(pw, 'image.file "' + im.file + '" must be a photograph under assets/img/<folder>/ (never logos/)');
          } else {
            checkAsset(pw, "panel photograph", im.file);
          }
        }
        if (str(im.focal) && !/^\d{1,3}% \d{1,3}%$/.test(im.focal)) {
          fail(pw, 'image.focal "' + im.focal + '" must be an object-position of two percentages, e.g. "50% 45%"');
        }
      }
    });
  }

  /* --- S3 · the products, one tile per group --- */
  var cat = o.catalog;
  if (!cat) fail("overview.catalog", "missing — S3, the products screen");
  else {
    reqStr("overview.catalog", cat, ["eyebrow", "title"]);
    /* Round 16 (Alex): the lead is removed. Each tile says what its group does,
       so a paragraph over the six said it a second time. */
    if (cat.lead !== undefined) {
      fail("overview.catalog.lead", "removed in round 16 — each tile says what its group does, and a lead over them says it twice");
    }
    reqCta("overview.catalog.cta", cat.cta);
    /* Round 13 (Alex): the link names where it goes, not the controls on the
       page it opens — "See all products", not "…, with filters". */
    if (cat.cta && /filter/i.test(cat.cta.label || "")) {
      fail("overview.catalog.cta.label", 'says "' + cat.cta.label + '" — name the destination, not its filters');
    }
    /* Round 9: the screen is one tile per product group, and every tile is
       derived from `facets.categories` — name, line and image all live there.
       The second list this key used to hold is retired: two lists of the same
       groups is how the home page and the rail drifted apart before. */
    if (cat.patterns !== undefined) {
      fail("overview.catalog.patterns", "retired in round 9 — the group tiles derive from facets.categories, so the data carries no second list");
    }
  }

  /* --- S4 · how we deliver --- */
  var d = o.delivery;
  if (!d) fail("overview.delivery", "missing — S4, the ladder and the three pillars");
  else {
    reqStr("overview.delivery", d, ["eyebrow", "title"]);
    if (d.anchor !== "how-we-deliver") {
      fail("overview.delivery", 'anchor is "' + d.anchor + '", expected "how-we-deliver" — the hero CTA and the S2 practice panel both link to it');
    }
    /* Round 16 (Alex): five stages. A Workshop comes first ("discover use case,
       define the fastest path to prove value on the real data + play with the
       pre-built apps"), and the managed service is a stage of its own, last,
       which the customer "MAY (but not SHOULD) opt for". */
    if (!arr(d.steps) || d.steps.length !== DELIVERY_STAGES.length) {
      fail("overview.delivery.steps", "must hold exactly " + DELIVERY_STAGES.length + " stages — " +
        DELIVERY_STAGES.join(" · ") + ", got " + (arr(d.steps) ? d.steps.length : "none"));
    } else d.steps.forEach(function (st, i) {
      reqStr("overview.delivery.steps[" + i + "]", st, ["title", "body", "factLabel", "fact"]);
      if (st.title !== DELIVERY_STAGES[i]) {
        fail("overview.delivery.steps[" + i + "]", 'title is "' + st.title + '" — stage ' + (i + 1) + ' is "' + DELIVERY_STAGES[i] + '"');
      }
    });
    var managed = arr(d.steps) ? d.steps[DELIVERY_STAGES.length - 1] : null;
    if (managed && str(managed.body)) {
      if (!/\bif you (want|choose|prefer)\b|\boptional\b|\byou may\b|\bas long as you choose\b/i.test(managed.body + " " + (managed.fact || ""))) {
        fail("overview.delivery.steps[" + (DELIVERY_STAGES.length - 1) + "]", "must say the customer may choose the managed service — it is optional");
      }
      if (/\bshould\b|\bmust\b|\brecommended\b|\bneed to\b|\brequired\b/i.test(managed.body)) {
        fail("overview.delivery.steps[" + (DELIVERY_STAGES.length - 1) + "]", "says the customer should take the managed service — it is their choice, never a need");
      }
    }
    /* Round 16 (Alex: remove the disclaimer): the durations are floors
       ("From 4 weeks", "From 3 months"), true as stated, so the block carries
       no caveat row. */
    if (d.footnote !== undefined) {
      fail("overview.delivery.footnote", "removed in round 16 — the stage durations are floors and carry no caveat");
    }
    var why = d.why;
    if (!why) fail("overview.delivery.why", "missing — the three pillars beside the ladder");
    else {
      if (!str(why.title)) fail("overview.delivery.why", "title missing");
      if (!arr(why.pillars) || why.pillars.length !== 3) {
        fail("overview.delivery.why.pillars", "must hold exactly 3 pillars, got " +
          (arr(why.pillars) ? why.pillars.length : "none"));
      } else why.pillars.forEach(function (p, i) {
        reqStr("overview.delivery.why.pillars[" + i + "]", p, ["icon", "title", "body"]);
      });
    }
  }

  /* --- S5 · the case-study rail (the cards themselves are checked in C2) --- */
  reqStr("overview.caseStudiesIntro", o.caseStudiesIntro, ["eyebrow", "title", "body"]);
  if ((o.caseStudiesIntro || {}).ndaLine !== undefined) fail("overview.caseStudiesIntro.ndaLine", "the rail has no NDA line since 2026-09-29 (PROVENANCE §51)");
  if ((o.caseStudiesIntro || {}).cta !== undefined) fail("overview.caseStudiesIntro.cta", "the rail has no link since 2026-09-29 (PROVENANCE §51)");

  /* --- S6 · about SoftServe, one of the page's two dark bands --- */
  var ab = o.about;
  if (!ab) fail("overview.about", "missing — S6, the light band");
  else {
    reqStr("overview.about", ab, ["eyebrow", "title", "body"]);
    /* Round 18 (Alex): "Remove oracle and nvidia logos from About SoftServe
       block". The band carries SoftServe's own figures only, as the footer
       has carried SoftServe's marks only since round 14. */
    ["partners", "partnerLine"].forEach(function (k) {
      if (ab[k] !== undefined) fail("overview.about." + k, "retired in round 18 — the About band carries no Oracle or NVIDIA marks");
    });
    /* Corporate figures only where softserveinc.com prints them — a tile with
       no public source is left out rather than filled from memory. */
    if (!arr(ab.stats) || ab.stats.length < 1 || ab.stats.length > 4) {
      fail("overview.about.stats", "must hold 1–4 tiles, got " + (arr(ab.stats) ? ab.stats.length : "none"));
    } else ab.stats.forEach(function (st, i) {
      var aw = "overview.about.stats[" + i + "]";
      if (!str((st || {}).value)) fail(aw, "value missing");
      else if (st.value.length > 12) fail(aw, 'value "' + st.value + '" is too long for a tile in the 2×2 grid');
      if (!str((st || {}).label)) fail(aw, "label missing");
    });
    var aboutSrc = fs.readFileSync(path.join(root, "site/pages/overview.js"), "utf8");
    var aboutFn = aboutSrc.slice(aboutSrc.indexOf("function about("), aboutSrc.indexOf("function closing("));
    if (/oracleMark|nvidiaMark|oracle-wordmark|nvidia-wordmark|about-partner/.test(aboutFn)) {
      fail("site/pages/overview.js about()", "renders an Oracle or NVIDIA mark — the About band carries SoftServe's own figures only (round 18)");
    }
    /* 2026-09-29 (Alex): "add softserve logo to the tile". The tile opens on
       SoftServe's lockup, read through brandAsset so a theme can swap it, and
       the lockup is the tile's one mark (one mark per company in one graphic):
       no spark or wordmark beside it (PROVENANCE §53). */
    if (!/brandAsset\("ssLogoWhite"/.test(aboutFn) || !/class="about-logo"/.test(aboutFn)) {
      fail("site/pages/overview.js about()", 'the tile opens on SoftServe\'s logo: brandAsset("ssLogoWhite") in an .about-logo image (PROVENANCE §53)');
    }
    var aboutImgs = (aboutFn.match(/<img\b/g) || []).length;
    if (aboutImgs !== 1 || /ssMark|ssSpark|softserve-star|softserve-wordmark/.test(aboutFn)) {
      fail("site/pages/overview.js about()", aboutImgs + " image(s) or a second SoftServe mark in the tile — the logo is its one mark (PROVENANCE §53)");
    }
    var aboutLogo = "site/assets/img/brand/softserve-logo-white.svg";
    if (fs.readFileSync(path.join(root, "site/index.html"), "utf8").indexOf('ssLogoWhite: "assets/img/brand/softserve-logo-white.svg"') < 0) {
      fail("site/index.html window.BRAND", 'must declare ssLogoWhite: "assets/img/brand/softserve-logo-white.svg", the About tile\'s logo (PROVENANCE §53)');
    }
    if (!fs.existsSync(path.join(root, aboutLogo))) fail(aboutLogo, "missing — the About tile's logo (PROVENANCE §53)");
    else {
      var aboutLogoSvg = fs.readFileSync(path.join(root, aboutLogo), "utf8");
      var aboutLogoFills = (aboutLogoSvg.match(/fill="[^"]*"/g) || []).filter(function (f, i, all) { return all.indexOf(f) === i; });
      if (aboutLogoFills.length !== 1 || aboutLogoFills[0] !== 'fill="#FFFFFF"') {
        fail(aboutLogo, "must be one white ink on the dark tile, found " + (aboutLogoFills.join(" ") || "no fill") + " (PROVENANCE §53)");
      }
      if (/<style|class=/.test(aboutLogoSvg)) fail(aboutLogo, "carries a style block or classes — the brand kit's lockup, cleaned (PROVENANCE §53)");
    }
    if (!ab.link || !str(ab.link.label) || !str(ab.link.url)) fail("overview.about.link", "needs { label, url }");
    else if (ab.link.url.indexOf("https://www.softserveinc.com") !== 0) {
      fail("overview.about.link", 'url "' + ab.link.url + '" must be on https://www.softserveinc.com — the block links to the site that prints the figures');
    }
  }

  /* --- S7 · contact --- */
  var ct = o.contact;
  if (!ct) fail("overview.contact", "missing — S7, the contact split");
  else {
    if (ct.anchor !== "request-a-demo") {
      fail("overview.contact", 'anchor is "' + ct.anchor + '", expected "request-a-demo" — every product page deep-links to #/#request-a-demo');
    }
    reqStr("overview.contact", ct, ["heading"]);
  }
  /* Round 18 (Alex): the home form is "equivalent (texts, CTAs, etc., flow) to
     what we have on per-product page (though logical difference to be
     preserved)". Equivalence is structural: both surfaces render the one
     UI.contactSwitch, and neither renders a form of its own beside it. */
  (function () {
    var home = fs.readFileSync(path.join(root, "site/pages/overview.js"), "utf8");
    var prod = fs.readFileSync(path.join(root, "site/pages/product.js"), "utf8");
    var closingFn = home.slice(home.indexOf("function closing("), home.indexOf("function overview("));
    var contactsFn = prod.slice(prod.indexOf("function contactsTab("), prod.indexOf("function product("));
    [["site/pages/overview.js closing()", closingFn], ["site/pages/product.js contactsTab()", contactsFn]].forEach(function (pair) {
      if (!pair[1]) return warn(pair[0], "not found — the contact-equivalence check is reading nothing");
      if (pair[1].indexOf("UI.contactSwitch(") === -1) {
        fail(pair[0], "does not render UI.contactSwitch — the home and product contacts are one component (round 18)");
      }
      if (/FORMS\.render\(|contactSplit\(/.test(pair[1])) {
        fail(pair[0], "renders a form or split of its own — the contact switch is the one component (round 18)");
      }
    });
    /* 2026-09-29 (Alex): the Get the sales kit tab "should not appear on the
       main page". The home page passes the component no kit, so it renders the
       ask alone; the kit lives on each product's Contacts tab and on #/sellers. */
    if (/kitOptions|kitBody|salesKit/.test(home)) {
      fail("site/pages/overview.js", "hands the contact switch a sales kit — the home page carries the ask alone (Alex, 2026-09-29)");
    }
    /* 2026-09-29 (Alex): the form read "unattached from the heading" when the
       H2 sat on white above the band. The heading is handed to the component,
       which sets it inside the plate. */
    if (closingFn && (/\bhead\(/.test(closingFn) || !/UI\.contactSwitch\(\{[^}]*intro:/.test(closingFn))) {
      fail("site/pages/overview.js closing()", "renders its heading above the contact band — pass it to UI.contactSwitch as `intro`, so it opens the plate's left column");
    }
    var appSwitch = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");
    if (!/var withKit = !!opts\.kitOptions;/.test(appSwitch) || !/var pick = !withKit \? "" :/.test(appSwitch) ||
        !/var kitPanel = !withKit \? "" :/.test(appSwitch)) {
      fail("site/assets/app.js contactSwitch()", "must render no segmented control and no kit pane when passed no kit — the home page's ask stands alone (2026-09-29)");
    }
  })();

  /* --- S4b · bespoke services, the AI factory (round 18) ---
     Alex: under Packaged services, "one more block called Bespoke Services
     (subheading) + full heading", on a dark photograph after softserveinc.com's
     "Confidence earned" banner, with "subheading and heading + content like
     others", its message on four elements — Oracle experts; decades of
     enterprise experience in AI and data; proven governance and scalable
     POD-based delivery; AI-enabled teams and lifecycle — and a heading that
     "revolve[s] around 'AI factory'". */
  var bs = o.bespoke;
  if (!bs) fail("overview.bespoke", "missing — S4b, the Bespoke services band under Packaged services");
  else {
    reqStr("overview.bespoke", bs, ["anchor", "eyebrow", "title", "lead"]);
    if (bs.eyebrow !== "Bespoke services") fail("overview.bespoke.eyebrow", 'must be "Bespoke services" — Alex\'s name for the offer (round 18)');
    if (str(bs.title) && !/\bAI factory\b/i.test(bs.title)) fail("overview.bespoke.title", 'must carry "AI factory" — Alex: the heading revolves around it');
    if (str(bs.lead) && bs.lead.length > 220) fail("overview.bespoke.lead", "is " + bs.lead.length + " characters (max 220 — two sentences over the band's four parts)");
    if (!arr(bs.points) || bs.points.length !== 4) {
      fail("overview.bespoke.points", "must hold exactly 4 — Alex's four elements, got " + (arr(bs.points) ? bs.points.length : "none"));
    } else {
      var lens = [];
      bs.points.forEach(function (pt, i) {
        var pw = "overview.bespoke.points[" + i + "]";
        reqStr(pw, pt, ["title", "body"]);
        if (str(pt.title) && words(pt.title) > 4) fail(pw, "title is " + words(pt.title) + " words (max 4)");
        if (str(pt.body)) {
          if (sentences(pt.body) > 1) fail(pw, "body is " + sentences(pt.body) + " sentences — one line under its title");
          lens.push(pt.body.length);
        }
      });
      /* Peers in one row wrap to the same number of lines only when their
         bodies sit in one length band. */
      if (lens.length === 4 && Math.max.apply(null, lens) - Math.min.apply(null, lens) > 15) {
        fail("overview.bespoke.points", "bodies run " + Math.min.apply(null, lens) + "–" + Math.max.apply(null, lens) + " characters — the four stay within 15 of each other so the row ends level");
      }
    }
    if (/PROVISIONAL/.test(JSON.stringify(bs))) fail("overview.bespoke", "still carries provisional copy");
    var bim = bs.image || {};
    ["wide", "tall", "alt"].forEach(function (k) { if (!str(bim[k])) fail("overview.bespoke.image", k + " missing"); });
    ["wide", "tall"].forEach(function (k) {
      if (!str(bim[k])) return;
      if (!/^assets\/img\/bands\/[a-z0-9-]+\.(jpg|jpeg|webp)$/.test(bim[k])) fail("overview.bespoke.image." + k, '"' + bim[k] + '" must be a picture under assets/img/bands/');
      else checkAsset("overview.bespoke.image." + k, "band photograph", bim[k]);
    });
    if (bs.cta !== undefined) reqCta("overview.bespoke.cta", bs.cta);
    /* The band is dark, so it is one of the page's two dark screens with S6
       About, and white screens stand between them. It sits directly under the
       Packaged services track (Alex, round 18: a reader who scrolls to
       Packaged services must see the band's top, so nothing may come between
       the two), then the Why list, then the case studies. */
    var order = fs.readFileSync(path.join(root, "site/pages/overview.js"), "utf8").match(/return hero\(C\)[^;]+;/);
    if (!order || !/delivery\(C\) \+ bespoke\(C\) \+\s*whyScreen\(C\) \+ caseStudies\(C\)/.test(order[0])) {
      fail("site/pages/overview.js", "overview() must render delivery, bespoke, whyScreen, then the case studies — the Bespoke band sits directly under the Packaged services track, and white screens stand between the two dark bands");
    }
  }

  /* --- what the old home page carried, and must not carry again --- */
  [
    ["trustStrip", "the three-wordmark strip — the partner wordmarks sit inside the About band now"],
    ["productsIntro", "the products intro — S3's head is overview.catalog"],
    ["servicesTeaser", "the platform-card teaser — S4 is overview.delivery"]
  ].forEach(function (pair) {
    if (o[pair[0]] !== undefined) {
      fail("overview." + pair[0], "is superseded by the round-5 home page (" + pair[1] + ") — nothing renders it");
    }
  });
  [
    ["image", "the home hero carries no photograph — the built-on stack visual is its illustration"],
    ["subhead", "the hero's copy is headline + lead"]
  ].forEach(function (pair) {
    if (h[pair[0]] !== undefined) fail("overview.hero." + pair[0], "is superseded — " + pair[1]);
  });

  /* --- round 9: the product rows the home page used to carry are gone --- */
  (C.products || []).forEach(function (p) {
    if (p.shortLine !== undefined) {
      fail("products[" + p.slug + "]", "shortLine is retired in round 9 — the home screen shows one tile per group, not a row per product, and no renderer reads it");
    }
  });

  /* --- H2 budget (START-HERE §4: five words or fewer, ≤ ~30 characters) ---
     The screens round 9 rewrote, and every screen since, are held to it; the
     two it did not touch warn, so the debt is visible without failing a build
     over old copy. S3's and S4's are Alex's own lines, each held at its own
     length instead: it may not grow, and a rewrite still fails over it. S3 is
     round 18's "Ready-to-use solutions to kick off your AI adoption" (52; his
     "kick-off" set as the verb), S4 round 17's "Service delivery that
     accelerates time to value" (48). */
  [
    ["overview.twoWays.title", (o.twoWays || {}).title, true],
    ["overview.catalog.title", (o.catalog || {}).title, true, 52],
    ["overview.caseStudiesIntro.title", (o.caseStudiesIntro || {}).title, true],
    ["overview.delivery.title", (o.delivery || {}).title, true, 48],
    ["overview.bespoke.title", (o.bespoke || {}).title, true],
    ["overview.about.title", (o.about || {}).title, false],
    ["overview.contact.heading", (o.contact || {}).heading, true]
  ].forEach(function (row) {
    var max = row[3] || 30;
    if (!str(row[1]) || row[1].length <= max) return;
    var message = "is " + row[1].length + " characters — an H2 is a display line (max " + max + "); the argument goes in the lead";
    if (row[2]) fail(row[0], message); else warn(row[0], message);
  });

  /* Round 16: the promise is the hero's, and no claim sits in more than two
     places. Round 17: Alex put it in the S4 H2 himself ("Service delivery
     that accelerates time to value"), so the page carries it three times —
     the hero lead, the S2 bullet and that heading — and nothing may add a
     fourth. The S4 H2 must still carry it: the heading is his. */
  var promiseCount = (JSON.stringify(o).match(/time[- ]to[- ]value/gi) || []).length;
  if (promiseCount > 3) {
    fail("overview", '"time to value" appears ' + promiseCount + " times on the home page — the hero lead, the S2 bullet and the S4 heading carry it, and nothing adds a fourth");
  }
  if (str((o.delivery || {}).title) && !/time to value/.test(o.delivery.title)) {
    fail("overview.delivery.title", "Alex's S4 heading states the benefit, time to value (round 17)");
  }

  /* Round 17 (Alex, on "Why SoftServe on Oracle": "Text to be same line count
     for each (now it's 3 lines vs 2 lines vs 2 lines)"): the three bodies sit
     in one length band, which measured the same line count for all three at
     every width from 320 to 1440 (two lines from 768 up, four at 375, five at
     320). A body outside the band breaks the rows' rhythm at some width. And
     the rows open on the brand's feature icons (the why-* glyphs), not on the
     small UI set in a tinted well. */
  (((d || {}).why || {}).pillars || []).forEach(function (p, i) {
    var w = "overview.delivery.why.pillars[" + i + "]";
    if (str(p.body) && (p.body.length < 105 || p.body.length > 120)) {
      fail(w, "body is " + p.body.length + " characters — the three stay within 105–120, so each wraps to the same number of lines at every width");
    }
    if (str(p.icon) && !/^why-/.test(p.icon)) {
      fail(w, 'icon "' + p.icon + '" is not one of the brand feature icons (why-*)');
    }
  });

  /* Round 16 (Alex): "Why SoftServe on Oracle" sits below the timeline, not
     beside it. Round 18: S4 is the head and the track and nothing else — its
     button led to the Services page, and the Why list moved to its own screen
     after the Bespoke band (Alex: a reader who scrolls to Packaged services
     must see the Bespoke band's top, and the list pushed it ~340 px below the
     fold at 1440 x 820). The band's copy is its head, so it does not reveal:
     a peeking band would hold its eyebrow and heading back until they cleared
     the observer's bottom margin. */
  var overviewSrc = fs.readFileSync(path.join(root, "site/pages/overview.js"), "utf8");
  var deliverySrc = overviewSrc.slice(overviewSrc.indexOf("function delivery("), overviewSrc.indexOf("function whyScreen("));
  var deliveryHtml = deliverySrc.slice(deliverySrc.lastIndexOf("return '<section"));
  if (deliveryHtml.indexOf('class="ladder3') === -1) {
    fail("site/pages/overview.js", "delivery() renders no track — S4 is the five-stage track");
  }
  if (/deliver-why|pillars/.test(deliveryHtml)) {
    fail("site/pages/overview.js", "delivery() renders the Why list — it is its own screen after the Bespoke band, so the band shows under the track (round 18)");
  }
  if (/deliver-cta|UI\.button\(/.test(deliveryHtml)) {
    fail("site/pages/overview.js", "delivery() renders a button — S4 ends on its track; the services' ask is the Bespoke band's (round 18)");
  }
  var whySrc = overviewSrc.slice(overviewSrc.indexOf("function whyScreen("), overviewSrc.indexOf("function bespoke("));
  if (!/function whyScreen\(/.test(overviewSrc) || whySrc.indexOf("pillars pillars--list") === -1) {
    fail("site/pages/overview.js", "whyScreen() must render the Why list (round 18: its own screen after the Bespoke band)");
  }
  var bespokeCopy = overviewSrc.slice(overviewSrc.indexOf("function bespoke("));
  if (/class="bespoke-copy reveal/.test(bespokeCopy)) {
    fail("site/pages/overview.js bespoke()", "the band's copy reveals — it is the band's head and shows at once under the Packaged services track (round 18)");
  }
  if ((o.delivery || {}).ctas !== undefined) {
    fail("overview.delivery.ctas", "retired in round 18 — its button led to the Services page; the services' ask closes the Bespoke band");
  }
  var bespokeSrc = overviewSrc.slice(overviewSrc.indexOf("function bespoke("), overviewSrc.indexOf("function caseStudies("));
  if (str(((o.bespoke || {}).cta || {}).label) && !/kind: "primary"/.test(bespokeSrc)) {
    fail("site/pages/overview.js bespoke()", "the band's ask is a filled button — the one between the hero and the contact (round 18)");
  }
  if (str(((o.bespoke || {}).cta || {}).label) && o.bespoke.cta.label !== (C.site.primaryCta || {}).label) {
    fail("overview.bespoke.cta.label", "must read site.primaryCta.label — one contact ask site-wide (round 10)");
  }
  /* 2026-09-29 (Alex, on the band: "content should be centered on the right
     to balance the page"; "placing CTA button above 4 bullets — is it a good
     practice?"; then, of a build that set the copy on the new picture, "very
     poor visibility of text and button placement"): the band reads claim,
     reasons, ask, so the button follows the four parts, and no word sits on
     the picture, so the band draws no scrim. The column's side and the
     picture's box are held in the stylesheet checks below. */
  var bespokeHtml = bespokeSrc.slice(bespokeSrc.lastIndexOf("return '<section"));
  var bespokePtsAt = bespokeHtml.indexOf("bespoke-points");
  var bespokeCtaAt = bespokeHtml.search(/\bcta \+/);
  if (str(((o.bespoke || {}).cta || {}).label) && (bespokePtsAt === -1 || bespokeCtaAt === -1 || bespokeCtaAt < bespokePtsAt)) {
    fail("site/pages/overview.js bespoke()", "the band's ask must follow its four parts — claim, reasons, then Talk to us (Alex, 2026-09-29)");
  }
  if (/bespoke-scrim/.test(bespokeSrc)) {
    fail("site/pages/overview.js bespoke()", "draws a scrim — no word sits on the band's picture, so it needs none (Alex, 2026-09-29: \"very poor visibility of text\")");
  }
  /* PROVENANCE §45 (Alex: group names "some 2 lines, some 1 line … fix line breaks"):
     S3 renders each name on two lines, broken before its last word, never the
     name as one run left to wrap wherever the tile's width puts it. The space
     before the break keeps the link's accessible name in words. */
  var tilesSrc = overviewSrc.slice(overviewSrc.indexOf("function groupTiles("), overviewSrc.indexOf("function delivery("));
  if (!/" <br>"/.test(tilesSrc) || !/lastIndexOf\(" "\)/.test(tilesSrc) || /class="gtile-name">' \+ UI\.esc\(category\.full\)/.test(tilesSrc)) {
    fail("site/pages/overview.js groupTiles()", "renders the group name as one run, or breaks it without a space — it breaks before the last word after a space, so every tile's name is two lines, the rows start level and the accessible name stays in words (PROVENANCE §45)");
  }

  /* --- every icon the two new screens name is in the registry --- */
  var namedIcons = [];
  ((tw || {}).panels || []).forEach(function (pn, i) {
    if (str((pn || {}).icon)) namedIcons.push(["overview.twoWays.panels[" + i + "]", pn.icon]);
  });
  (((d || {}).why || {}).pillars || []).forEach(function (p, i) {
    if (str((p || {}).icon)) namedIcons.push(["overview.delivery.why.pillars[" + i + "]", p.icon]);
  });
  /* Round 9: the stack's top band names its own glyphs, and the middle band
     takes the group glyphs — both are drawn in assets/app.js, so both are
     checked here. A group glyph that is missing leaves an empty tile. */
  ((((h || {}).stack || {}).services || {}).items || []).forEach(function (item, i) {
    if (str((item || {}).icon)) namedIcons.push(["overview.hero.stack.services.items[" + i + "]", item.icon]);
  });
  (function () {
    var fams = ((C.shared || {}).tagFamilies) || {};
    var icons = (fams.pattern || {}).icons || {};
    PATTERN_IDS.forEach(function (id) {
      if (str(icons[id])) namedIcons.push(["shared.tagFamilies.pattern.icons." + id, icons[id]]);
    });
    /* The two badge glyphs, `cursor-click` among them (round 9). */
    ["demo", "marketplace"].forEach(function (k) {
      var badge = (fams.availability || {})[k] || {};
      if (str(badge.icon)) namedIcons.push(["shared.tagFamilies.availability." + k, badge.icon]);
    });
  })();
  var appSrc = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");
  var iconKeys = [];
  var iconRe = /^\s{4}"?([A-Za-z-]+)"?:\s*'/gm;
  var hit;
  while ((hit = iconRe.exec(appSrc))) iconKeys.push(hit[1]);
  /* The data layer has twice moved ahead of the icon registry (round 4's eight
     tag glyphs, round 5's `arrowDown` and `cube`). This list is where a key
     the renderer has not drawn yet is downgraded to a warning; it is EMPTY,
     because both round-5 icons are in assets/app.js. Put a key here only while
     it is genuinely in flight, and take it out in the same change that draws
     it — a name that stays here is an unchecked icon. */
  var PENDING_ICONS = [];
  /* Round 9: the glyphs of every retired category leave the registry with their
     ids — an icon nothing can name is never checked. */
  ["pattern-processing-pipelines", "pattern-data-analysis",
   "pattern-optimization", "pattern-knowledge-assistants"].forEach(function (key) {
    if (iconKeys.indexOf(key) !== -1) {
      fail("assets/app.js", 'ICONS still carries "' + key + '" — that category is retired, and an icon no data can name is unchecked');
    }
  });
  if (!iconKeys.length) {
    warn("assets/app.js", "no ICONS entries matched — the registry's shape changed and this check is reading nothing");
  } else namedIcons.forEach(function (pair) {
    if (iconKeys.indexOf(pair[1]) !== -1) return;
    if (PENDING_ICONS.indexOf(pair[1]) !== -1) {
      warn(pair[0], 'icon "' + pair[1] + '" is not in the ICONS registry in site/assets/app.js yet — it lands with the round-5 renderer');
    } else {
      fail(pair[0], 'icon "' + pair[1] + '" is not a key of the ICONS registry in site/assets/app.js');
    }
  });

  /* --- HANDOFF §6.1: the words this page does not use ---
     Scoped to `overview` on purpose: the ban is for home-page marketing copy.
     (The seller gate that honestly "unlocked" a panel was retired in round 8 for
     the sales-kit request.) */
  var homeRaw = JSON.stringify(o).toLowerCase();
  ["cutting-edge", "seamless", "unlock", "empower", "revolutionary"].forEach(function (word) {
    if (homeRaw.indexOf(word) !== -1) {
      fail("overview", 'carries the banned word "' + word + '" (HANDOFF §6.1) — name the specific thing instead');
    }
  });
})();

/* ---- rounds 20 and 21 · the Overview (Alex, 2026-09-29) ----
   Round 21 (Alex: option b, "Problem solution and the How it works taking
   the central space (left; 4/7 to 2/3 of width); and ROI metrics look like
   widget on the right"; the charts "hard to understand"; the screenshots
   "without those callouts"): from 1240px a main column of two thirds and
   the numbers widget beside it; charts a reader matches to their number;
   screenshots with nothing drawn over them. The markup keeps round 20's order
   of the argument, the problem and what changes, the numbers, then How it
   works, which is the one-column order and a screen reader's. The renderer
   builds none of what the rounds retired (the More detail disclosure, the
   rail, its grey tiles, the ROI paragraph, the footnote, the full-bleed band,
   the ring and the zoom inset), and reads no metric `sources` (2.2). The
   words the blocks print are shared: the section labels, and the three kind
   chips, which are the case study's own vocabulary. */
(function () {
  var src = fs.readFileSync(path.join(root, "site/pages/product.js"), "utf8");
  var overviewFn = (src.split("function overviewTab(")[1] || "").split("\n  function ")[0];
  if (!overviewFn) warn("site/pages/product.js", "overviewTab() not found — the Overview order check is reading nothing");
  else if (!/problemSolution\([^)]*\)\s*\+\s*outcomesBlock\([^)]*\)\s*\+\s*howItWorks\(/.test(overviewFn)) {
    fail("site/pages/product.js overviewTab()", "must render problemSolution(), then outcomesBlock() (the numbers widget), then howItWorks() — the argument's order, which the one column and a screen reader follow");
  }
  /* Round 21: the widget and the steps. */
  var outcomesFn = (src.split("function outcomesBlock(")[1] || "").split("\n  function ")[0];
  if (!/class="kpi-widget/.test(outcomesFn) || !/data-kpi-widget/.test(outcomesFn)) {
    fail("site/pages/product.js outcomesBlock()", "must render the numbers widget (.kpi-widget, data-kpi-widget), not a full-bleed band (round 21)");
  }
  var hiwFn = (src.split("function howItWorks(")[1] || "").split("\n  function ")[0];
  var atTabs = hiwFn.indexOf('role="tablist"'), atText = hiwFn.indexOf('class="hiw-text"'), atFrame = hiwFn.indexOf("frame(step, index, \"hiw-shot\")");
  if (atTabs === -1 || atText === -1 || atFrame === -1 || !(atTabs < hiwFn.indexOf('class="hiw-panels"')) || !(atText < atFrame)) {
    fail("site/pages/product.js howItWorks()", "the steps are a tab row, then the open step's text, then its frame — the description sits between the control and the screen (START-HERE §4)");
  }
  if (!/role="tab"/.test(hiwFn) || !/aria-selected/.test(hiwFn) || !/role="tabpanel"/.test(hiwFn)) {
    fail("site/pages/product.js howItWorks()", "the step row is a tablist: each step a role=\"tab\" with aria-selected, each panel a role=\"tabpanel\"");
  }
  /* Alex, 2026-09-29: "Just have screenshots without those callouts" — no
     ring, no zoom inset, on any product or width. Where a step needs the eye
     led, the screenshot itself shows the element selected, as the product
     would (docs/ASSETS.md §1). */
  if (/hiw-region|hiw-zoom|shot\.zoom|shot\.region/.test(src)) {
    fail("site/pages/product.js", "draws a callout over a screenshot (the ring or the zoom inset) — retired in round 21: a frame is the screen alone");
  }
  var measureFn = (src.split("function measureKpiWidget(")[1] || "").split("\n  function ")[0];
  if (!/is-tall/.test(measureFn) || !/innerHeight/.test(measureFn)) {
    fail("site/pages/product.js measureKpiWidget()", "the widget is pinned only while all of it fits the window — a taller one scrolls, so its foot is never cut off (is-tall)");
  }
  var chartFn = (src.split("function kpiChart(")[1] || "").split("\n  function ")[0];
  if (!/label\("metricToday"\)/.test(chartFn) || !/label\("metricAfter"\)/.test(chartFn)) {
    fail("site/pages/product.js kpiChart()", "the chart's rows are named Today and After, from sectionLabels.metricToday / metricAfter");
  }
  if (!/kpiRow\(then, kpiBar\("after", solid \/ end\) \+ kpiBar\("span", \(hi - lo\) \/ end\), text, true\)/.test(chartFn) || !/viz\.gap/.test(chartFn)) {
    fail("site/pages/product.js kpiChart()", "a range prints the figure on the After bar's span, and a gap row prints a difference — the figure is always on the chart (Alex: \"matching between number and the visual\")");
  }
  if (/<svg/.test(chartFn)) fail("site/pages/product.js kpiChart()", "draws an SVG chart — round 21's charts are named rows of bars with their values printed");
  [
    ["disclosure--detail", "the More detail disclosure"],
    ["moreDetail", "the More detail disclosure"],
    ["featuresDetail", "the long-form feature list"],
    ["featuresNote", "the feature footnote"],
    ["metricsNote", "the metrics footnote"],
    ["ov-rail", "the Overview rail"],
    ["rail-card", "the rail card"],
    ["stat-tile", "the rail's grey tiles"],
    ["roi-band", "the ROI paragraph"],
    ["stepper-features", "the step tick-lists"]
  ].forEach(function (pair) {
    if (src.indexOf(pair[0]) !== -1) fail("site/pages/product.js", 'still builds "' + pair[0] + '" — ' + pair[1] + " is retired in round 20");
  });
  if (/\.sources\b/.test(src)) fail("site/pages/product.js", "reads a metric's `sources` — a figure's provenance lives in docs/PROVENANCE.md, never on the page");

  var css = fs.readFileSync(path.join(root, "site/assets/site.css"), "utf8");
  if (css.indexOf("/* ===== Round 20 · Overview ===== */") === -1) {
    fail("site/assets/site.css", 'has no "===== Round 20 · Overview =====" block — the Overview\'s components live in one block');
  }
  /* Round 21 · the page: two columns from 1240px, the main one between 4/7
     and 2/3 of the width (Alex's range), the widget in the other, pinned
     unless it is taller than the window. */
  var ovBlock = css.slice(css.indexOf("/* ===== Round 20 · Overview ===== */"), css.indexOf("/* ===== end Round 20 · Overview ===== */"));
  var cols = ovBlock.match(/\.tab-body--overview:has\(> \.kpi-widget\) \{[^}]*grid-template-columns:\s*minmax\(0,\s*(\d+(?:\.\d+)?)fr\)\s+minmax\(0,\s*(\d+(?:\.\d+)?)fr\)/);
  if (!cols) {
    fail("site/assets/site.css", "the Overview's two columns are missing: .tab-body--overview:has(> .kpi-widget) { grid-template-columns: minmax(0, Nfr) minmax(0, Mfr) } (round 21)");
  } else {
    var mainShare = Number(cols[1]) / (Number(cols[1]) + Number(cols[2]));
    if (mainShare < 4 / 7 - 1e-9 || mainShare > 2 / 3 + 1e-9) {
      fail("site/assets/site.css", "the Overview's main column is " + Math.round(mainShare * 1000) / 10 + "% of the width — Alex's range is 4/7 to 2/3");
    }
  }
  if (!/grid-template-areas:\s*"ps kpi"\s*"hiw kpi"/.test(ovBlock)) {
    fail("site/assets/site.css", 'the Overview grid must be "ps kpi" "hiw kpi": the problem and What changes over How it works, the widget beside both (round 21)');
  }
  if (!/@media \(min-width: 1240px\)/.test(ovBlock)) fail("site/assets/site.css", "the two columns start at 1240px (round 21)");
  if (!/\.kpi-widget \{[^}]*position:\s*sticky/.test(ovBlock) || !/\.kpi-widget\.is-tall \{[^}]*position:\s*relative/.test(ovBlock)) {
    fail("site/assets/site.css", "the widget is sticky beside the column and scrolls when .is-tall (round 21)");
  }
  /* No callout over a screenshot, and none of round 20's inset machinery. */
  [".hiw-zoom", ".hiw-region", ".kpi-band", ".kv-", ".kpi-svg", ".kpi-labels", ".hiw-list", ".hiw-step", ".hiw-head", ".hiw-frame"].forEach(function (sel) {
    if (css.indexOf(sel) !== -1) fail("site/assets/site.css", 'still styles "' + sel + '…" — retired in round 21 (no callouts over a screenshot; charts as named bars; the widget, not a band)');
  });
  /* Each is a prefix: `.stepper` stands for `.stepper-head` and the rest. */
  [".ps-strip", ".ps-panel", ".ps-mark", ".ps-arrow", ".ov-layout", ".ov-main", ".ov-rail", ".rail-card", ".stat-tile",
   ".roi-band", ".disclosure--detail", ".detail-wrap", ".detail-entry", ".stepper", ".step-frame"].forEach(function (sel) {
    if (css.indexOf(sel) !== -1) fail("site/assets/site.css", 'still styles "' + sel + '…" — retired with the round-20 Overview');
  });

  var labels = (C.shared || {}).sectionLabels || {};
  ["outcomes", "howItWorks", "problemEyebrow", "solutionEyebrow", "metricOwner", "metricToday", "metricAfter", "shotOpen", "shotPan"].forEach(function (k) {
    if (!str(labels[k])) fail("shared.sectionLabels", k + " missing — the Overview prints it");
  });
  /* The chart's two row names sit in a column of their own beside the bars. */
  ["metricToday", "metricAfter"].forEach(function (k) {
    if (str(labels[k]) && labels[k].length > 6) fail("shared.sectionLabels." + k, "is " + labels[k].length + " characters — a chart row's name (max 6)");
  });
  /* How it works is an H2 at 48px, and `outcomes` heads the widget; both are
     display lines (START-HERE §4: ≤ ~30 characters). */
  ["outcomes", "howItWorks"].forEach(function (k) {
    if (str(labels[k]) && labels[k].length > 30) fail("shared.sectionLabels." + k, "is " + labels[k].length + " characters — a display line (max 30)");
  });
  ["metrics", "metricsPlanned", "roi", "moreDetail", "moreDetailFeatures"].forEach(function (k) {
    if (labels[k] !== undefined) {
      fail("shared.sectionLabels." + k, "is retired in round 20 — the widget has one heading, `outcomes`, and More detail is gone");
    }
  });
  if (labels.metricToward !== undefined) {
    fail("shared.sectionLabels.metricToward", "is retired in round 21 — a baseline is a Today row with its value; nothing reads the chevron's words");
  }

  var kinds = (C.shared || {}).metricKinds;
  if (!kinds) return fail("shared.metricKinds", "missing — the KPI tiles' kind chips read their word and tooltip here");
  METRIC_KINDS.forEach(function (k, i) {
    var kind = kinds[k] || {};
    if (kind.chip !== METRIC_KIND_CHIPS[i]) {
      fail("shared.metricKinds." + k, 'chip is "' + kind.chip + '", expected "' + METRIC_KIND_CHIPS[i] + '" — the case study\'s own word, one word');
    }
    if (!str(kind.tooltip)) fail("shared.metricKinds." + k, "tooltip missing");
  });
  Object.keys(kinds).forEach(function (k) {
    if (METRIC_KINDS.indexOf(k) === -1) fail("shared.metricKinds", 'carries "' + k + '", which is not ' + METRIC_KINDS.join(" / "));
  });
})();

/* ---- banned strings, site-wide ---- */
var raw = fs.readFileSync(path.join(root, "site/data/content.js"), "utf8");
[
  ["GigaCloud", "internal company name"],
  ["WinP", "internal deal-state vocabulary"],
  ["€190K", "customer economics from a confidential business case"],
  ["€5.17", "customer economics from a confidential business case"],
  ["€11.03", "customer economics from a confidential business case"],
  ["Framed scope", "packaging-internal disclaimer, removed in round 3"],
  ["flexible add-ons", "packaging-internal disclaimer, removed in round 3"],
  ["beyond the frame", "packaging-internal disclaimer, removed in round 3"],
  ["set by specific constraints", "packaging-internal disclaimer, removed in round 3"],
  ["TODO", "internal marker"],
  ["(assumed)", "internal marker"],
  ["ktram@", "personal mailbox — the site prints the practice address only"],
  ["AIDP", "internal abbreviation; write Oracle AI Data Platform"],
  ["AltraDOC", "third-party product named in a customer's own estate"],
  ["modelled", "British spelling — the corpus is US English (modeled)"],
  ["minimis", "British spelling — the corpus is US English (minimize)"],
  ["optimis", "British spelling — the corpus is US English (optimize)"],
  ["organis", "British spelling — the corpus is US English (organize)"],
  ["normalis", "British spelling — the corpus is US English (normalize)"],
  ["enquir", "British spelling — the corpus is US English (inquiry)"],
  ["catalogue", "British spelling — the corpus is US English (catalog)"],
  ["prioritis", "British spelling — the corpus is US English (prioritize)"]
].forEach(function (pair) {
  if (raw.indexOf(pair[0]) !== -1) fail("content.js", 'contains banned string "' + pair[0] + '" (' + pair[1] + ")");
});

/* Round 13: four people are named on the site now, and none of their own
   mailboxes may ship. Any SoftServe address but the practice one fails. */
(raw.match(/[A-Za-z0-9._%+-]+@softserveinc\.com/g) || []).forEach(function (address) {
  if (address !== "oracle@softserveinc.com") {
    fail("content.js", 'prints "' + address + '" — the site prints the practice mailbox oracle@softserveinc.com only');
  }
});

/* Round 10: "Request a demo" is retired as a label — the site has one contact
   ask, and it is site.primaryCta.label. The `request-a-demo` anchor id keeps its
   hyphens and is deliberately not matched here; keep it that way. */
if (/request a demo/i.test(raw)) {
  fail("content.js", 'still says "request a demo" — the one contact ask is site.primaryCta.label (round 10)');
}

/* ---- round 18 · the Services page is gone (Alex, 2026-09-29) ----
   "Services link at the header - to not link to a separate page, but scroll
   down to the Packaged services block on the main page. Services page to be
   fully removed." Its copy, its renderer and its form left with it; the nav's
   "Services" lands on the home page's Packaged services screen, and a saved
   link to the old page lands on the home screen that took over its section
   (assets/app.js MOVED). Every route another surface uses must land on an id
   the home page renders. */
(function () {
  var site = C.site || {};
  var shared = C.shared || {};
  var formsCopy = C.forms || {};

  if (C.services !== undefined) fail("services", "retired in round 18 — the Services page is gone; its story is the home page's Packaged services and Bespoke services screens");
  if (site.dividerLabels !== undefined) fail("site.dividerLabels", "retired in round 6 — nothing renders the rule–label–rule divider");
  if (shared.ladderColumns !== undefined) fail("shared.ladderColumns", "retired in round 6 — nothing renders a ladder table");
  if (formsCopy.contact !== undefined) fail("forms.contact", "retired in round 18 — the scoping-call form left with the Services page; the one ask is forms.demo");
  ["submitContact", "submitRequest"].forEach(function (k) {
    if ((formsCopy.labels || {})[k] !== undefined) fail("forms.labels." + k, "retired in round 18 — every contact form submits with site.primaryCta.label");
  });
  if ((formsCopy.demo || {}).secondaryHeading !== undefined) {
    fail("forms.demo.secondaryHeading", "retired in round 18 — the home contact is the product Contacts switch, whose selected segment is the heading");
  }
  if ((formsCopy.confirmations || {}).contactPosted !== undefined) {
    fail("forms.confirmations.contactPosted", "retired in round 18 — no form asks for a scoping call any more");
  }

  if (fs.existsSync(path.join(root, "site/pages/services.js"))) {
    fail("site/pages/services.js", "the Services page is gone (round 18) — delete its renderer");
  }
  ["site/index.html", "site/index-legacy.html"].forEach(function (rel) {
    if (fs.readFileSync(path.join(root, rel), "utf8").indexOf("pages/services.js") !== -1) {
      fail(rel, "loads pages/services.js — the renderer is gone and the request 404s");
    }
  });
  if (/#\/services\b/.test(raw)) {
    fail("content.js", 'routes to "#/services" — the page is gone; link the home screen that took over its section');
  }
  ["site/pages/overview.js", "site/pages/products.js", "site/pages/product.js", "site/assets/forms.js"].forEach(function (rel) {
    if (/#\/services\b/.test(fs.readFileSync(path.join(root, rel), "utf8"))) {
      fail(rel, 'routes to "#/services" — the page is gone');
    }
  });

  /* The ids the home page renders, and so the only anchors a "#/#…" route may
     name. `talk` is its contact's ask; `kit` left the home page on 2026-09-29
     and redirects to the catalog (MOVED, below). */
  var HOME_IDS = ["top", "two-ways", "products", "how-we-deliver", ((C.overview || {}).bespoke || {}).anchor,
    "case-studies", "about", ((C.overview || {}).contact || {}).anchor, "talk"];
  var routes = [
    ["site.navCta.route", (site.navCta || {}).route],
    ["site.primaryCta.route", (site.primaryCta || {}).route],
    ["shared.engageLink.route", (shared.engageLink || {}).route],
    ["overview.bespoke.cta.route", (((C.overview || {}).bespoke || {}).cta || {}).route],
    ["productsPage.askTile.cta.route", (((C.productsPage || {}).askTile || {}).cta || {}).route],
    ["salesKit.page.routeLink.route", (((C.salesKit || {}).page || {}).routeLink || {}).route]
  ];
  (site.nav || []).forEach(function (item, i) { routes.push(["site.nav[" + i + "].route", item.route]); });
  ((((C.overview || {}).delivery || {}).ctas) || []).forEach(function (c, i) { routes.push(["overview.delivery.ctas[" + i + "].route", c.route]); });
  routes.forEach(function (pair) {
    var m = /^#\/#([a-z0-9-]+)$/.exec(pair[1] || "");
    if (m && HOME_IDS.indexOf(m[1]) === -1) fail(pair[0], '"' + pair[1] + '" names an anchor the home page does not render');
  });
  if (/\bpackages?\b/i.test((shared.engageLink || {}).label || "")) {
    fail("shared.engageLink.label", "says package — the link names the screen it opens");
  }
  var appSrcMoved = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");
  if (!/"\/services":\s*\{/.test(appSrcMoved)) {
    fail("site/assets/app.js", "MOVED has no \"/services\" entry — a saved link to the old page would land on Page not found");
  }
  /* 2026-09-29 (Alex): "For sellers in the footer - remove that link and page
     where it leads to". The page, its renderer and its route are gone; a saved
     #/sellers or #/#kit lands on the catalog, where the seller picks the
     product whose Contacts tab holds the kit (PROVENANCE §61). */
  if (!/"\/":\s*\{\s*"kit":\s*"#\/products"\s*\}/.test(appSrcMoved)) {
    fail("site/assets/app.js", "MOVED does not send \"#/#kit\" to \"#/products\" — a saved home kit link would land on a home page with no kit (2026-09-29)");
  }
  if (!/"\/sellers":\s*\{\s*"":\s*"#\/products"\s*\}/.test(appSrcMoved)) {
    fail("site/assets/app.js", "MOVED does not send \"#/sellers\" to \"#/products\" — a saved link to the retired kit page would land on Page not found (§61)");
  }
  if (/\/\^\\\/sellers\$\//.test(appSrcMoved) || fs.existsSync(path.join(root, "site/pages/sellers.js"))) {
    fail("site", "the #/sellers page is back — its route or site/pages/sellers.js; it was retired with the footer's For sellers link (§61)");
  }
  ["site/index.html", "site/index-legacy.html"].forEach(function (rel) {
    if (/pages\/sellers\.js/.test(fs.readFileSync(path.join(root, rel), "utf8"))) fail(rel, "loads pages/sellers.js — the page is gone and the request 404s (§61)");
  });
})();

/* ---- round 18 · no fake and placeholder links (Alex, 2026-09-29) ----
   "Make sure the minisite uses all the correct links (in emails, on pages) -as
   per config … It applies to video links, interactive demo links + in-email
   links. No fake and placeholder links no longer allowed." A control that
   looks like a link renders only when the link it opens exists: the video
   frame only with a recording in links.json, the Marketplace badge only with
   its listing's URL, the demo badge from links.json like the hero button. */
(function () {
  if (((C.shared || {}).videoPending) !== undefined) {
    fail("shared.videoPending", "retired in round 18 — a product with no recording shows no video frame, so nothing says one is coming");
  }
  var productSrc = fs.readFileSync(path.join(root, "site/pages/product.js"), "utf8");
  if (/data-video-pending|videoPending/.test(productSrc)) {
    fail("site/pages/product.js", "renders a pending video frame — the frame exists only when links.json holds the recording (round 18)");
  }
  var media = productSrc.slice(productSrc.indexOf("function heroMedia("), productSrc.indexOf("function demoHref("));
  if (!/if \(!videoLink && !walkthrough\) return "";/.test(media)) {
    fail("site/pages/product.js heroMedia()", "must return nothing when links.json holds neither a video nor a walkthrough — no placeholder frame (round 18, §55)");
  }
  var appSrc18 = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");
  var badges = appSrc18.slice(appSrc18.indexOf("function availabilityBadges("), appSrc18.indexOf("function badgeRow("));
  if (badges.indexOf("hasListing(slug)") === -1) {
    fail("site/assets/app.js availabilityBadges()", "must render the Marketplace badge only through hasListing() — a flag with no listing URL is a placeholder (round 18)");
  }
  var demoBadges = appSrc18.slice(appSrc18.indexOf("function initDemoBadges("), appSrc18.indexOf("function initSkipLink("));
  if (/demoHref\(\(CFG\.products/.test(demoBadges) || demoBadges.indexOf("demoHref(links(slug))") === -1) {
    fail("site/assets/app.js initDemoBadges()", "must open the walkthrough from links.json (links(slug)) — config.js holds no link since round 12");
  }
  /* Every walkthrough and video the site shows is a link it can open: a path
     inside site/ that exists (sync-links checks it) or an https:// address. */
  Object.keys(LINKS).forEach(function (slug) {
    var entry = LINKS[slug] || {};
    if (str(entry.video) && !/^https:\/\//.test(entry.video)) fail("links.json " + slug + ".video", "must be an https:// link");
  });

  /* The catalog's way out is its last tile (Alex, round 18: "convert the Have
     a workflow in mind? block into a last tile … Looking for other solution?
     Let's talk -> Link to contact form on the main page"). */
  var pp = C.productsPage || {};
  if (pp.bottomBlock !== undefined) fail("productsPage.bottomBlock", "retired in round 18 — the catalog's way out is productsPage.askTile, its last tile");
  var ask = pp.askTile;
  if (!ask || !str(ask.title) || !str(ask.body) || !ask.cta || !str(ask.cta.label) || !str(ask.cta.route)) {
    fail("productsPage.askTile", "needs { title, body, outcomes, image, cta: { label, route } }");
  } else {
    if (!/^#\/#(request-a-demo|talk)$/.test(ask.cta.route)) {
      fail("productsPage.askTile.cta.route", '"' + ask.cta.route + '" — the tile leads to the home page\'s contact form');
    }
    /* Alex, the same day, on the first cut (a title and two lines on a flat
       fill, stretched to a ~650 px product tile): "looks too empty". A tile in
       an equal-height grid takes its tallest peer's height, so it carries its
       peers' anatomy: a picture where they carry one, one line, three outcome
       lines like theirs, and the link at the foot. */
    if (!arr(ask.outcomes) || ask.outcomes.length !== 3 || ask.outcomes.some(function (x) { return !str(x); })) {
      fail("productsPage.askTile.outcomes", "must hold exactly 3 lines — the tile carries a product tile's anatomy, or it stands empty beside one");
    } else ask.outcomes.forEach(function (line, i) {
      if (line.length > 60) fail("productsPage.askTile.outcomes[" + i + "]", "is " + line.length + " characters (max 60)");
    });
    if (str(ask.body) && sentences(ask.body) > 1) fail("productsPage.askTile.body", "is " + sentences(ask.body) + " sentences — one line under the title");
    if (/PROVISIONAL/.test(JSON.stringify(ask))) fail("productsPage.askTile", "still carries provisional copy");
    if (!str(ask.image)) fail("productsPage.askTile.image", "missing — the drawing that stands where a product tile carries its photograph");
    else checkGroupDrawing("productsPage.askTile.image", ask.image);
  }
  var productsTile = fs.readFileSync(path.join(root, "site/pages/products.js"), "utf8");
  var askFn = productsTile.slice(productsTile.indexOf("function askTile("), productsTile.indexOf("function matchesHtml("));
  ["ptile-band", "ptile-title", "ptile-outcomes", "ptile-cta"].forEach(function (cls) {
    if (askFn.indexOf(cls) === -1) fail("site/pages/products.js askTile()", 'renders no "' + cls + '" — the tile is a product tile\'s peer in anatomy, not only in size (round 18)');
  });
  var productsSrc = fs.readFileSync(path.join(root, "site/pages/products.js"), "utf8");
  if (!/function resultsHtml\(\) \{\s*return matchesHtml\(\) \+ askTile\(\);/.test(productsSrc)) {
    fail("site/pages/products.js", "resultsHtml() must end every result, the empty ones included, on the ask tile");
  }
  if (/class="closing"/.test(productsSrc)) fail("site/pages/products.js", "renders the closing band — the catalog's way out is its last tile (round 18)");

  /* Alex: product tiles "more similar to softserveinc.com reference (i.e.
     boundary between image and block underneath should not be blured)". */
  if (/ptile-veil/.test(appSrc18)) fail("site/assets/app.js productTile()", "renders the veil — the photograph meets the tile body on a clean edge (round 18)");
  var css18 = fs.readFileSync(path.join(root, "site/assets/site.css"), "utf8");
  if (/\.ptile-veil\b/.test(css18)) fail("site/assets/site.css", ".ptile-veil is back — the photograph meets the tile body on a clean edge (round 18)");

  /* Alex: "Make sure the website has same site icon as softserveinc.com" — its
     favicon-web-32x32.svg, the white SoftServe spark on black. */
  var indexSrc = fs.readFileSync(path.join(root, "site/index.html"), "utf8");
  var icon = indexSrc.match(/<link rel="icon"[^>]*href="data:image\/svg\+xml,([^"]+)"/);
  var favicon = icon ? decodeURIComponent(icon[1]) : "";
  if (!/<rect width="32" height="32" fill="#000000"\/>/.test(favicon) || favicon.indexOf('d="M13.9239 17.2917') === -1) {
    fail("site/index.html", "the favicon is not softserveinc.com's (the white spark on black, favicon-web-32x32.svg) — round 18");
  }
  var faviconFile = path.join(root, "site/assets/img/brand/favicon.svg");
  if (!fs.existsSync(faviconFile) || fs.readFileSync(faviconFile, "utf8").trim() !== favicon.trim()) {
    fail("site/assets/img/brand/favicon.svg", "differs from the data URI in index.html — the file is the icon's source (ASSETS.md)");
  }

  /* Alex's two words for the delivery screen and the new band. */
  if ((((C.overview || {}).delivery) || {}).eyebrow !== "Packaged services") {
    fail("overview.delivery.eyebrow", 'must be "Packaged services" — Alex\'s name for the fixed-scope track, beside Bespoke services (round 18)');
  }
})();

/* ---- §55 · the product hero: its frame and its ground (Alex, 2026-09-29) ----
   "Make sure that this area has the video preview on the right … It should
   link to the video, and the video link should be in the config file with all
   other artifacts … If no video, but product has a walkthrough, it should be
   opening instead of the video. Only if neither walkthrough, nor video is
   available, slot should be empty." And the hero photographs, "very poor
   quality … not aligned with how softserve uses these images": the ground is
   softserveinc.com's detail-page gradient, with no photograph behind the copy. */
(function () {
  function fnSrc(src, name) {
    var at = src.indexOf("function " + name + "(");
    if (at < 0) return "";
    var next = src.indexOf("\n  function ", at + 10);
    return src.slice(at, next < 0 ? src.length : next);
  }
  var productSrc = fs.readFileSync(path.join(root, "site/pages/product.js"), "utf8");
  var appSrc = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");
  var cssSrc = fs.readFileSync(path.join(root, "site/assets/site.css"), "utf8");
  var media = fnSrc(productSrc, "heroMedia");

  /* One resolver for the walkthrough, so the frame, the button and the badge
     cannot open different things; one glyph per thing it opens (round 9). */
  if (media.indexOf("demoHref(link)") === -1) {
    fail("site/pages/product.js heroMedia()", "must read the walkthrough through demoHref(link), as the button and the badge do (§55)");
  }
  if (media.indexOf('UI.icon("play", "icon--solid")') === -1 || media.indexOf('UI.icon("cursor-click")') === -1) {
    fail("site/pages/product.js heroMedia()", "the frame's glyph is play for a recording and the badge's cursor-click for the walkthrough (round 9, §55)");
  }
  /* A SharePoint or Stream page refuses to be framed on another site and
     opens only for a signed-in viewer: it opens in its own tab. */
  var plays = fnSrc(productSrc, "playsInPage");
  if (!plays || /sharepoint|microsoftstream/i.test(plays) || /sharepoint|microsoftstream/i.test(fnSrc(productSrc, "bindVideo"))) {
    fail("site/pages/product.js", "a SharePoint or Stream recording opens in its own tab, never in the modal's iframe (§55)");
  }
  /* The badge names the walkthrough, so it never plays the frame's recording. */
  if (/video-card|\.click\(\)/.test(fnSrc(appSrc, "initDemoBadges"))) {
    fail("site/assets/app.js initDemoBadges()", "must open the walkthrough, not click the hero frame, which plays the recording where there is one (§55)");
  }
  /* No photograph behind the copy; the ground is the brand's measured gradient. */
  if (/heroBackdrop|class="hero-bg"/.test(productSrc) || /function heroBackdrop\(|class="hero-bg"/.test(appSrc)) {
    fail("site/pages/product.js", "renders a hero photograph behind the copy — the product hero's ground is softserveinc.com's gradient (§55)");
  }
  if (!/\.product-hero\.has-hero-bg \{[^}]*background: linear-gradient\(0deg, #ffffff -24\.5%, #c1dff4 39\.38%, #458fdd 99\.67%\);/.test(cssSrc)) {
    fail("site/assets/site.css .product-hero.has-hero-bg", "must carry softserveinc.com's detail-page hero gradient, linear-gradient(0deg, #ffffff -24.5%, #c1dff4 39.38%, #458fdd 99.67%) (§55)");
  }
  /* No grey on the blue (Alex, 2026-09-29: "grey elements, tags as they are
     now etc. don't really look good"): the hero's tags and its second button
     are white plates with ink words. */
  [[".product-hero .chip--meta", /--fill:\s*#ffffff/], [".product-hero .chip--outline", /--fill:\s*#ffffff[\s\S]*--ring:\s*none/],
    [".product-hero .btn--secondary", /--fill:\s*#ffffff/]].forEach(function (pair) {
    var esc = pair[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var hit = cssSrc.match(new RegExp("(?:^|\\n|,\\s*)" + esc + "\\s*(?:,[^{]*)?\\{([^}]*)\\}"));
    if (!hit || !pair[1].test(hit[1])) {
      fail("site/assets/site.css " + pair[0], "must be a white plate on the product hero's blue — no grey pill or grey button on the gradient (Alex, 2026-09-29)");
    }
  });
  /* Every frame that renders shows the product's own screen: a still on disk,
     never the tile's photograph. */
  (C.products || []).forEach(function (p) {
    var entry = LINKS[p.slug] || {};
    if (!str(entry.video) && !str(entry.interactiveDemo)) return;
    var poster = ((CFG.products || {})[p.slug] || {}).videoPoster;
    var where = "config.products." + p.slug + ".videoPoster";
    if (!str(poster)) return fail(where, "empty — the hero frame renders (links.json holds a video or a walkthrough), so it needs the product's own screen (§55)");
    if (!/^assets\/img\/posters\/[a-z0-9-]+\.(jpg|png|webp)$/.test(poster)) fail(where, '"' + poster + '" is not assets/img/posters/<slug>.<ext>');
    else if (!fs.existsSync(path.join(root, "site", poster))) fail(where, "not on disk: site/" + poster);
    if (p.hero && p.hero.image && poster === p.hero.image.file) fail(where, "is the tile's photograph — the frame shows the product's own screen (VISUAL-GRAMMAR §1)");
  });
})();

/* ---- round 7 · one proof-of-value duration (Alex, 2026-09-17) ----
   "Make sure that we always mention 4–8 weeks PoV, consistently across the
   site": every Jumpstart states it in its promise, its short form (which the
   seller CTA interpolates) and its investment figure, and no other
   proof-of-value duration survives anywhere in the data (PROVENANCE §23; the
   Services page that also carried it left in round 18). Since round 16 the home track states floors instead
   ("From 4 weeks"), and the hero tile has said "from 30 days" since round 9. */
(function () {
  var POV = "4–8 weeks";
  /* Round 22: the Delivery tab states it, the first tier's standing duration,
     and a product's override may not change it. */
  var dlShared = (C.shared || {}).delivery || {};
  var dlTiers = dlShared.tiers || [];
  if (!dlTiers[0] || dlTiers[0].duration !== POV) {
    fail("shared.delivery.tiers[0].duration", 'must be "' + POV + '" — the proof of value is "' + POV + '" everywhere');
  }
  (C.products || []).forEach(function (p) {
    var ds = (p.delivery || {}).durations;
    if (arr(ds) && ds[0] !== POV) fail("products[" + p.slug + "].delivery.durations[0]", '"' + ds[0] + '" — the proof of value is "' + POV + '" everywhere');
  });
  var o = C.overview || {};
  /* Round 16 (Alex: "4-8 weeks, 3-5 months, 3-12 months -> say 'from 4
     weeks', from 3 months"): the home track states each stage's floor. The
     Jumpstart is its second stage now, after the Workshop. Scope copy on the
     product pages keeps the ranges; that question is open. */
  var homeTrack = (o.delivery || {}).steps || [];
  var jump = homeTrack[1];
  if (!jump || jump.fact !== "From 4 weeks") {
    fail("overview.delivery.steps[1].fact", 'must be "From 4 weeks" — the home track states the floor');
  }
  [2, 3].forEach(function (i) {
    var s = homeTrack[i];
    if (!s || s.fact !== "From 3 months") fail("overview.delivery.steps[" + i + "].fact", 'must be "From 3 months" — the home track states the floor');
  });
  if (homeTrack.some(function (s) { return /\d\s*[–-]\s*\d/.test((s || {}).fact || ""); })) {
    fail("overview.delivery.steps", "a stage states a range — the home track says each stage's floor, never a range");
  }
  /* Round 9 (Alex): the hero figure is the shortest honest clock — "from 30
     days", the qualifier set small. Scope copy keeps 4–8 weeks everywhere else,
     which is what the rest of this block asserts; the two are not alternatives,
     they are a headline and a scope, and the tile leads the strip. */
  var povStatTile = ((o.hero || {}).stats || [])[0] || {};
  if (povStatTile.prefix !== "from" || povStatTile.value !== "30 days") {
    fail("overview.hero.stats[0]", 'must be the proof-of-value tile { prefix: "from", value: "30 days" } — got { prefix: "' +
      povStatTile.prefix + '", value: "' + povStatTile.value + '" }');
  }
  if (((o.hero || {}).stats || []).some(function (s) { return s.value === POV; })) {
    fail("overview.hero.stats", 'states "' + POV + '" as a figure — the hero tile is "from 30 days"; 4–8 weeks is scope copy');
  }
  var other = raw.match(/30[–-]45 days|about two months|in 2 months|Two months from kickoff|\b12 weeks\b|two-week acceptance|duration is set at scoping/);
  if (other) fail("content.js", 'carries another proof-of-value duration ("' + other[0] + '") — it is "' + POV + '" across the site');
})();

/* ---- round 8 · the sales kit (Alex, 2026-09-17) ----
   The For sellers tab and the #/sellers page request the kit by work email;
   eligibility is the domain, not a declared role. Only the auto-send
   confirmation may say the kit was emailed (PROVENANCE §24). */
(function () {
  if (C.sellerGate !== undefined) fail("sellerGate", "retired in round 8 — the kit request copy lives in salesKit");
  var kit = C.salesKit || {};
  var page = kit.page || {};
  var tab = kit.tab || {};
  var form = kit.form || {};
  function need(where, obj, keys) {
    keys.forEach(function (k) { if (!str(obj[k])) fail(where, k + " missing"); });
  }
  function token(where, value, name) {
    if (str(value) && value.indexOf("{" + name + "}") === -1) fail(where, "must carry {" + name + "}");
  }
  need("salesKit.page", page, ["eyebrow", "title", "body", "again", "povTitle", "povBody", "povLink"]);
  if (!page.routeLink || !str(page.routeLink.label) || !str(page.routeLink.route)) fail("salesKit.page.routeLink", "needs { label, route }");
  need("salesKit.tab", tab, ["title", "body", "routeLabel", "nextDemo", "nextDemoLink"]);
  token("salesKit.tab.body", tab.body, "product");
  token("salesKit.tab.nextDemo", tab.nextDemo, "link");
  need("salesKit.form", form, ["emailLabel", "emailPlaceholder", "productLabel", "productPlaceholder", "submit", "submitting",
    "eligibility", "otherRoute", "kitName", "kitNameAll", "offline"]);
  token("salesKit.form.otherRoute", form.otherRoute, "routeLink");
  token("salesKit.form.kitName", form.kitName, "product");
  token("salesKit.form.offline", form.offline, "mailbox");
  need("salesKit.form.errors", form.errors || {}, ["product", "email", "domain", "send", "limited"]);
  /* 2026-09-29 (Alex): "no 'all kits' option in dropdown". A seller asks for
     one product's kit: the select lists products only and opens on a prompt
     that cannot be sent, the form never falls back to a kit for all offers,
     and no confirmation points to a full kit. (`kitNameAll` stays: the sender
     still names an all-offers request made without the page with it.) */
  if (form.productAll !== undefined) fail("salesKit.form.productAll", "retired 2026-09-29 — the kit's select has no all-offers option (Alex)");
  ["nextAll", "nextAllLink"].forEach(function (k) {
    if (tab[k] !== undefined) fail("salesKit.tab." + k, "retired 2026-09-29 — there is no kit for all offers to point to (Alex)");
  });
  if (/whole portfolio|all offers|full kit/i.test(JSON.stringify([page, tab, form.productLabel, form.productPlaceholder]))) {
    fail("salesKit", "offers a kit for all offers — a seller asks for one product's kit (Alex, 2026-09-29)");
  }
  (function () {
    var src = fs.readFileSync(path.join(root, "site/assets/forms.js"), "utf8");
    var kitSrc = src.slice(src.indexOf("function renderKit("), src.indexOf("window.FORMS ="));
    if (!kitSrc) return warn("site/assets/forms.js", "renderKit not found — the no-all-offers check is reading nothing");
    if (/["']all["']/.test(kitSrc)) {
      fail("site/assets/forms.js", 'the kit form still carries an "all" value — no all-offers option and no fallback to one (Alex, 2026-09-29)');
    }
    if (!/<option value="" selected disabled>' \+ UI\.esc\(copy\.productPlaceholder\)/.test(kitSrc)) {
      fail("site/assets/forms.js renderKit()", "the kit's select must open on productPlaceholder, a prompt that cannot be sent (2026-09-29)");
    }
    if (!/copy\.errors\.product/.test(kitSrc)) {
      fail("site/assets/forms.js mountKit()", "must refuse a kit request with no product chosen, with errors.product (2026-09-29)");
    }
  })();
  token("salesKit.form.errors.domain", (form.errors || {}).domain, "routeLink");
  token("salesKit.form.errors.send", (form.errors || {}).send, "mailbox");
  token("salesKit.form.errors.limited", (form.errors || {}).limited, "mailbox");
  var conf = form.confirmations || {};
  ["sent", "queued"].forEach(function (k) {
    var c = conf[k] || {};
    if (!str(c.title) || !str(c.body)) return fail("salesKit.form.confirmations." + k, "needs { title, body }");
    token("salesKit.form.confirmations." + k, c.body, "kitName");
    if (k !== "sent" && /we[’']ve emailed|we have emailed|has been (sent|emailed)/i.test(c.body)) {
      fail("salesKit.form.confirmations." + k, "claims the kit was emailed — only `sent` may, and only when an auto-sender is configured");
    }
  });

  /* No form ever opens the visitor's mail app (Alex, 2026-09-24: "it just had to
     send message in the background"). A form posts and confirms the outcome, or
     says under itself, before anyone types, that this copy cannot send. */
  var formsCopy = C.forms || {};
  need("forms", formsCopy, ["offline"]);
  token("forms.offline", formsCopy.offline, "mailbox");
  /* A 429 from the sender is a send cap, not a glitch: "try again" would be wrong,
     so it gets its own line (2026-09-24: three retries all hit the cap). */
  need("forms.errors", formsCopy.errors || {}, ["send", "limited"]);
  token("forms.errors.send", (formsCopy.errors || {}).send, "mailbox");
  token("forms.errors.limited", (formsCopy.errors || {}).limited, "mailbox");
  need("forms.labels", formsCopy.labels || {}, ["sending"]);
  ["mailto", "error"].forEach(function (k) {
    if ((formsCopy.confirmations || {})[k] !== undefined) fail("forms.confirmations." + k, "is retired: a failure is a line under the form, and no form opens a mail app");
  });
  if (conf.mailto !== undefined) fail("salesKit.form.confirmations.mailto", "is retired: no form opens a mail app");
  ["mailSubject", "mailSubjectAll", "mailBody"].forEach(function (k) {
    if (form[k] !== undefined) fail("salesKit.form." + k, "is retired: no form composes an email in the visitor's mail app");
  });
  if (/mail (client|app)/i.test(JSON.stringify([formsCopy, C.salesKit || {}]))) {
    fail("forms / salesKit", "mention a mail client or mail app: a form sends in the background or says it cannot");
  }
  var formsSrc = fs.readFileSync(path.join(root, "site/assets/forms.js"), "utf8");
  if (/location\.(href|assign|replace)[^;\n]*mailto|window\.open\([^)]*mailto/.test(formsSrc)) {
    fail("site/assets/forms.js", "opens a mailto: link on submit: a form sends in the background or says it cannot");
  }
  if ((formsSrc.match(/status === 429/g) || []).length < 2) {
    fail("site/assets/forms.js", "both form kinds must answer a 429 with their errors.limited line, not the generic one");
  }

  /* 2026-09-29 (Alex, on the home contact's confirmation: "make sure this
     looks good from UI standpoint (now a bit ugly). Also, name 'SoftServe's
     Oracle dedicated practice' to disambiguate"). A confirmation takes its
     form's place with no surface of its own, at its column's full width, its
     title a step under the section's H2 and its check in the icon well; on the
     Contacts switch it takes the whole pane. And the site never names the
     practice without its owner: "the Oracle practice" reads as Oracle's own. */
  (function () {
    var cssText = fs.readFileSync(path.join(root, "site/assets/site.css"), "utf8");
    function ruleOf(selector) {
      var at = cssText.indexOf("\n" + selector + " {");
      return at === -1 ? "" : cssText.slice(at, cssText.indexOf("}", at) + 1);
    }
    var box = ruleOf(".form-confirm");
    if (!box) fail("site/assets/site.css", ".form-confirm is not styled");
    if (box && !/background:\s*none/.test(box)) {
      fail("site/assets/site.css .form-confirm", "a confirmation has no surface of its own (background: none): the plate or panel under it is the surface, and the selected tint is never a ground");
    }
    if (box && !/max-width:\s*none/.test(box)) {
      fail("site/assets/site.css .form-confirm", "a confirmation fills its column (max-width: none), so its edge is the form's edge");
    }
    var title = ruleOf(".form-confirm .h3");
    if (!/font-size:/.test(title) || /var\(--fs-h[23]\)/.test(title)) {
      fail("site/assets/site.css .form-confirm .h3", "the title sets its own size, a step under the section's H2 (at most 1.75rem), never the H3 scale");
    }
    if (!/background:\s*var\(--surface-select\)/.test(ruleOf(".form-confirm-mark"))) {
      fail("site/assets/site.css .form-confirm-mark", "the check sits in the theme's icon well (var(--surface-select)), never a white square that reads as a ticked checkbox");
    }
    if (!/function settle\(block, done\)/.test(formsSrc)) {
      fail("site/assets/forms.js", "settle(block, done) is missing: on the Contacts switch a confirmation takes its whole pane");
    }
    ["confirmation", "kitConfirmation"].forEach(function (name) {
      var at = formsSrc.indexOf("function " + name + "(");
      var body = at === -1 ? "" : formsSrc.slice(at, formsSrc.indexOf("\n  }\n", at));
      if (!/settle\(block, true\)/.test(body)) {
        fail("site/assets/forms.js " + name + "()", "must call settle(block, true): the lead that asked for the input leaves with the form");
      }
    });

    var NAME = /SoftServe[’']s Oracle dedicated practice/;
    (JSON.stringify(C).match(/\b(?:the|our) (?:Oracle )?practice\b|\bOracle practice\b/gi) || []).forEach(function (m) {
      fail("content.js", 'names "' + m + '": the practice is "SoftServe’s Oracle dedicated practice" (Alex, 2026-09-29), since "the Oracle practice" reads as Oracle\'s own');
    });
    [["forms.confirmations.posted.body", ((formsCopy.confirmations || {}).posted || {}).body], ["forms.offline", formsCopy.offline]].forEach(function (pair) {
      if (!NAME.test(pair[1] || "")) fail(pair[0], 'must name who replies: "SoftServe’s Oracle dedicated practice" (Alex, 2026-09-29)');
    });
  })();

  /* Sellers and partners are different readers: the kit goes to seller domains only. */
  var roles = (C.forms || {}).roles || [];
  ["oracle-seller", "oracle-partner"].forEach(function (value) {
    if (!roles.some(function (r) { return r.value === value; })) fail("forms.roles", 'missing "' + value + '"');
  });
  roles.forEach(function (r) {
    if (/or partner/i.test(r.label || "")) fail("forms.roles", '"' + r.label + '" lumps sellers and partners together');
  });
  /* Alex, 2026-09-29: "order of options … should be Oracle seller -> SoftServe
     seller -> Oracle partner -> Customer -> Other". */
  var ROLE_ORDER = ["oracle-seller", "softserve", "oracle-partner", "customer", "other"];
  if (roles.map(function (r) { return r.value; }).join(" ") !== ROLE_ORDER.join(" ")) {
    fail("forms.roles", "must run " + ROLE_ORDER.join(" → ") + " (Alex, 2026-09-29), got " +
      roles.map(function (r) { return r.value; }).join(" → "));
  }

  /* Alex, 2026-09-29: "As long as I input email with domain, option should be
     auto-picked (Oracle, SS by domain, otherwise - Customer is the default).
     Until domain is typed - nothing is selected. Company is autopopulated by
     domain". The rules are SITE_CONFIG.formDomains; forms.js applies them, and
     is run here on sample addresses so a rewrite cannot drop one. */
  (function () {
    var rules = CFG.formDomains || {};
    var roleValues = roles.map(function (r) { return r.value; });
    var known = rules.known || [];
    if (!known.length) return fail("config.formDomains.known", "missing — the Oracle and SoftServe domains pick their sellers");
    known.forEach(function (entry, i) {
      var w = "config.formDomains.known[" + i + "]";
      if (!str(entry.domain) || !str(entry.role) || !str(entry.company)) fail(w, "needs { domain, role, company }");
      if (roleValues.indexOf(entry.role) === -1) fail(w, 'role "' + entry.role + '" is not a forms.roles value');
    });
    /* The seller domains are the kit's domains: whoever the kit goes to is the
       seller the form picks, and no other domain is. */
    var knownDomains = known.map(function (e) { return e.domain; }).sort().join(", ");
    var gate = ((CFG.sellerGate || {}).allowedDomains || []).slice().sort().join(", ");
    if (knownDomains !== gate) fail("config.formDomains.known", "domains [" + knownDomains + "] differ from sellerGate.allowedDomains [" + gate + "]");
    if (rules.otherRole !== "customer") fail("config.formDomains.otherRole", 'must be "customer" — any other domain picks Customer (Alex, 2026-09-29)');

    var formsCode = fs.readFileSync(path.join(root, "site/assets/forms.js"), "utf8");
    var renderBody = formsCode.slice(formsCode.indexOf("function render("), formsCode.indexOf("function setError("));
    if (/checked/.test(renderBody)) fail("site/assets/forms.js render()", "checks a role at render — nothing is picked until the email has a domain (Alex, 2026-09-29)");
    var box = {
      window: {
        location: { hostname: "check.invalid", href: "" },
        fetch: function () { return Promise.resolve({ ok: false }); },
        SITE_CONFIG: CFG,
        SITE_CONTENT: C
      }
    };
    vm.createContext(box);
    try {
      vm.runInContext(formsCode, box, { filename: "site/assets/forms.js" });
    } catch (error) {
      return fail("site/assets/forms.js", "does not load: " + error.message);
    }
    var pick = box.window.FORMS && box.window.FORMS.fromEmail;
    if (typeof pick !== "function") return fail("site/assets/forms.js", "FORMS.fromEmail is missing — the checker runs the domain rules through it");
    [
      ["dana", null],
      ["dana@", null],
      ["dana@oracle", null],
      ["dana@oracle.c", null],
      ["dana@oracle.com", { role: "oracle-seller", company: "Oracle" }],
      ["Dana@US.Oracle.com", { role: "oracle-seller", company: "Oracle" }],
      ["ivan@softserveinc.com", { role: "softserve", company: "SoftServe" }],
      ["kim@acme.com", { role: "customer", company: "Acme" }],
      ["kim@acme.co.uk", { role: "customer", company: "Acme" }],
      ["kim@mail.acme.io", { role: "customer", company: "Acme" }],
      ["kim@oracle.co", { role: "customer", company: "Oracle" }],
      ["kim@gmail.com", { role: "customer", company: "" }]
    ].forEach(function (sample) {
      var got = pick(sample[0]);
      var gotText = JSON.stringify(got ? { role: got.role, company: got.company } : null);
      if (gotText !== JSON.stringify(sample[1])) {
        fail("site/assets/forms.js fromEmail()", '"' + sample[0] + '" gives ' + gotText + ", expected " + JSON.stringify(sample[1]));
      }
    });
    /* The visitor's own pick and own company are never overwritten. */
    if (!/roleChosen = true/.test(formsCode) || !/company\.value === "" \|\| company\.value === filled/.test(formsCode)) {
      fail("site/assets/forms.js bindDomain()", "must leave a role the visitor clicked and a company they typed as they are");
    }
    if (!/var applyDomain = bindDomain\(form\)/.test(formsCode) || !/applyDomain\(\);\s*var data = values\(form\)/.test(formsCode)) {
      fail("site/assets/forms.js mount()", "must bind the email to the role and Company, and apply it before a submit reads the form");
    }
  })();

  if ((((C.site || {}).footer) || {}).sellersLink !== undefined) {
    fail("site.footer.sellersLink", "retired on 2026-09-29 with the #/sellers page (Alex: \"remove that link and page where it leads to\", §61)");
  }
  if (/#\/sellers\b/.test(fs.readFileSync(path.join(root, "site/data/content.js"), "utf8"))) {
    fail("content.js", 'routes to "#/sellers" — the page is gone; a kit is on its product\'s Contacts tab');
  }
  /* Round 14 (Alex, 2026-09-24): softserveinc.com's footer, cut down. A link
     row — the brand's two legal pages, the SoftServe website (For sellers
     left it on 2026-09-29, §61) —
     with the brand's eight social glyphs, then the copyright row with the
     spark. No partner marks, no hot links, no office, no contact block.
     Round 18 added one row of text links to Oracle's pages (below). */
  (function () {
    var f = ((C.site || {}).footer) || {};
    ["heading", "description", "contactCta", "builtWith", "trademarkLine", "legalLine"].forEach(function (k) {
      if (f[k] !== undefined) fail("site.footer." + k, "retired in round 14 — the footer is softserveinc.com's, cut down: no contact block, no partner line");
    });
    var LEGAL = [
      { label: "Privacy Notice", url: "https://www.softserveinc.com/en-us/privacy" },
      { label: "Terms and Conditions", url: "https://www.softserveinc.com/en-us/terms-and-conditions" }
    ];
    if (!arr(f.legalLinks) || f.legalLinks.length !== LEGAL.length) {
      fail("site.footer.legalLinks", "must hold exactly the brand's two: Privacy Notice · Terms and Conditions");
    } else LEGAL.forEach(function (want, i) {
      var got = f.legalLinks[i] || {};
      if (got.label !== want.label || got.url !== want.url) {
        fail("site.footer.legalLinks[" + i + "]", 'expected "' + want.label + '" → ' + want.url);
      }
    });
    if (!f.siteLink || !str(f.siteLink.label) || !/^https:\/\/www\.softserveinc\.com\//.test(f.siteLink.url || "")) {
      fail("site.footer.siteLink", "needs { label, url } on https://www.softserveinc.com/");
    }
    var SOCIAL = ["LinkedIn", "YouTube", "Facebook", "Instagram", "TikTok", "X", "SoundCloud", "Bluesky"];
    var social = arr(f.social) ? f.social : [];
    var labels = social.map(function (s) { return (s || {}).label; });
    if (labels.join("|") !== SOCIAL.join("|")) {
      fail("site.footer.social", "must be softserveinc.com's eight, in its order: " + SOCIAL.join(" · ") +
        " (got " + (labels.join(" · ") || "none") + ")");
    }
    social.forEach(function (s, i) {
      if (!/^https:\/\//.test((s || {}).url || "")) fail("site.footer.social[" + i + "]", "url must be https");
    });
    if (f.copyright !== "© Copyright {year} SoftServe Inc.") {
      fail("site.footer.copyright", 'must read "© Copyright {year} SoftServe Inc." — the brand\'s line, the year filled at render');
    }
    /* Round 18 (Alex): "In the footer, add links to Oracle products: Oracle
       Cloud Infrastructure, Oracle AI Data Platform, Oracle AI Lakehouse +
       plus Oracle main page". A second text row: the three platforms the
       practice builds on in the site's canonical order, under their full
       Oracle names, then Oracle's home page. Each URL is the one Oracle's own
       page calls canonical (checked 2026-09-29). Words, never marks. */
    var ORACLE = [
      { label: FACET_FULL["oracle-ai-lakehouse"], url: "https://www.oracle.com/autonomous-database/autonomous-ai-lakehouse/" },
      { label: FACET_FULL["oracle-ai-data-platform"], url: "https://www.oracle.com/ai-data-platform/" },
      { label: "Oracle Cloud Infrastructure", url: "https://www.oracle.com/cloud/" },
      { label: "Oracle website", url: "https://www.oracle.com/" }
    ];
    if (!str(f.oracleLabel)) fail("site.footer.oracleLabel", "missing — the Oracle row's accessible name");
    if (!arr(f.oracleLinks) || f.oracleLinks.length !== ORACLE.length) {
      fail("site.footer.oracleLinks", "must hold exactly " + ORACLE.length + ": " + ORACLE.map(function (x) { return x.label; }).join(" · "));
    } else ORACLE.forEach(function (want, i) {
      var got = f.oracleLinks[i] || {};
      if (got.label !== want.label || got.url !== want.url) {
        fail("site.footer.oracleLinks[" + i + "]", 'expected "' + want.label + '" → ' + want.url);
      }
    });
    var src = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");
    var glyphs = src.match(/var SOCIAL_GLYPHS = \{([\s\S]*?)\n  \};/);
    if (!glyphs) {
      fail("assets/app.js", "SOCIAL_GLYPHS not found — the footer's social links would render empty");
    } else SOCIAL.forEach(function (label) {
      if (glyphs[1].indexOf("\n    " + label + ": [") === -1) {
        fail("assets/app.js", 'SOCIAL_GLYPHS has no "' + label + '" glyph — its footer link would render empty');
      }
    });
    var footerFn = src.match(/function renderFooter\(\) \{[\s\S]*?\n  \}/);
    if (!footerFn) {
      warn("assets/app.js", "renderFooter not found — the no-partner-marks check is reading nothing");
    } else if (/oracleMark|nvidiaMark|oracle-wordmark|nvidia-wordmark/.test(footerFn[0])) {
      fail("assets/app.js renderFooter", "renders an Oracle or NVIDIA mark — the footer carries SoftServe's marks only (Alex, 2026-09-24)");
    }
  })();
  /* Round 10b: the kit is the second tab of the Contacts switch, so a customer
     or partner is routed out of it by the site's one contact ask — the other
     tab of the same switch — and its confirmation offers that same ask by that
     same name. Two forms never sit open on one screen. */
  if (tab.routeLabel !== ((C.site || {}).primaryCta || {}).label) {
    fail("salesKit.tab.routeLabel", 'is "' + tab.routeLabel + '" — it must read site.primaryCta.label, the one contact ask');
  }
  if (tab.nextDemoLink !== ((C.site || {}).primaryCta || {}).label) {
    fail("salesKit.tab.nextDemoLink", 'is "' + tab.nextDemoLink + '" — it must read site.primaryCta.label, the one contact ask');
  }
  if (((C.salesKit || {}).page || {}).povLink !== ((C.site || {}).primaryCta || {}).label) {
    fail("salesKit.page.povLink", 'is "' + ((C.salesKit || {}).page || {}).povLink + '" — it must read site.primaryCta.label, the one contact ask');
  }
})();

/* ---- round 15 · a link lives in links.json and nowhere else (Alex, 2026-09-24) ----
   "A separate config file that stores the links, and they are not saved anywhere
   else." The site reads links.json through tools/site_links.py and the kit email
   reads it from GitHub, so no file keeps a copy: site/data/links.js may not exist
   (a publish writes its own under .work/), .gitignore keeps a stray one out of
   git, and no link from links.json may appear in any other file of the repo.
   docs/PROVENANCE.md, the round log, may quote history. */
(function () {
  var stored = "site/data/links.js";
  if (fs.existsSync(path.join(root, stored))) {
    fail(stored, "a stored copy of links.json — delete it: tools/serve.py serves data/links.js from links.json, and a publish writes it with python3 tools/site_links.py --out .work/publish/data/links.js");
  }
  var ignored = "";
  try { ignored = fs.readFileSync(path.join(root, ".gitignore"), "utf8"); } catch (error) { /* an empty list fails below */ }
  if (ignored.split(/\r?\n/).map(function (line) { return line.trim(); }).indexOf(stored) === -1) {
    fail(".gitignore", "must ignore " + stored + ", so a copy of links.json can never be committed");
  }
  var links;
  try { links = JSON.parse(fs.readFileSync(path.join(root, "links.json"), "utf8")); }
  catch (error) { return; /* the round-12 block names the problem */ }
  var needles = [];
  Object.keys(links.products || {}).forEach(function (slug) {
    Object.keys(links.products[slug] || {}).forEach(function (key) {
      var value = links.products[slug][key];
      if (typeof value === "string" && /^https:\/\//i.test(value)) needles.push({ where: slug + "." + key, text: value.split("?")[0] });
    });
  });
  var SKIP_DIRS = [".git", ".work", "node_modules"];
  var ALLOWED = ["links.json", "docs/PROVENANCE.md"];
  var TEXT = /\.(js|mjs|cjs|json|md|html|css|py|sh|txt|svg|ya?ml)$/i;
  (function walk(dir) {
    fs.readdirSync(path.join(root, dir || "."), { withFileTypes: true }).forEach(function (entry) {
      var rel = dir ? dir + "/" + entry.name : entry.name;
      if (entry.isDirectory()) { if (SKIP_DIRS.indexOf(entry.name) === -1) walk(rel); return; }
      if (!TEXT.test(entry.name) || ALLOWED.indexOf(rel) !== -1) return;
      var text = fs.readFileSync(path.join(root, rel), "utf8");
      needles.forEach(function (n) {
        if (text.indexOf(n.text) !== -1) fail(rel, "repeats the link in links.json " + n.where + " — name links.json instead: a link is stored there and nowhere else");
      });
    });
  })("");
})();

/* ---- round 12 · one links file, and the kit emailed automatically (Alex, 2026-09-23) ----
   Every link a product's kit uses lives in links.json at the repo root, outside
   site/, so the kit documents are never readable in the published files. The
   site sees only the walkthrough, its artifact copy and the video
   (tools/site_links.py, round 15); tools/sync-links.js validates the file and
   derives the email's product catalog (mail/catalog.json, names only). A stale
   catalog fails here, and the retired per-product link fields may not come back. */
(function () {
  var sync = require("./sync-links.js");
  var built = sync.build(root);
  built.errors.forEach(function (e) { fail("links.json", e); });
  if (!built.errors.length) {
    var staleFiles = sync.stale(root, built.files);
    if (staleFiles.length) fail(staleFiles.join(", "), "stale against content.js — run node tools/sync-links.js");
  }
  if (SITE_LINKS_ERROR) fail("tools/site_links.py", "did not build the site's links (the checker runs it with python3) — " + SITE_LINKS_ERROR);
  Object.keys(LINKS).forEach(function (slug) {
    Object.keys(LINKS[slug] || {}).forEach(function (key) {
      if (sync.PUBLIC_KEYS.indexOf(key) === -1) {
        fail("tools/site_links.py", slug + "." + key + " is not one of the site's keys — the kit documents never reach the site");
      }
    });
  });
  (sync.PUBLIC_KEYS || []).forEach(function (key) {
    Object.keys(LINKS).forEach(function (slug) {
      if (typeof (LINKS[slug] || {})[key] !== "string") fail("tools/site_links.py", slug + "." + key + " is missing from the site's view of links.json");
    });
  });
  ["demoUrl", "demoPreviewUrl", "videoUrl", "materials"].forEach(function (key) {
    Object.keys(CFG.products || {}).forEach(function (slug) {
      if (CFG.products[slug][key] !== undefined) {
        fail("config.products[" + slug + "]." + key, "retired in round 12 — every kit link lives in links.json (docs/CONFIG.md)");
      }
    });
  });
  (C.products || []).forEach(function (p) {
    if (p.sellers !== undefined) {
      fail("products[" + p.slug + "].sellers", "retired in round 12 — the kit is the standard set in links.json, emailed automatically");
    }
  });

  /* The sender re-checks the kit's domains against its own list: the page and
     the sender must accept exactly the same addresses. */
  var settings = null;
  try { settings = JSON.parse(fs.readFileSync(path.join(root, "mail/settings.json"), "utf8")); }
  catch (error) { fail("mail/settings.json", "missing or not valid JSON — " + error.message); }
  if (settings) {
    var gate = ((CFG.sellerGate || {}).allowedDomains || []).slice().sort().join(", ");
    var sender = ((settings.kit || {}).allowedDomains || []).slice().sort().join(", ");
    if (gate !== sender) {
      fail("mail/settings.json kit.allowedDomains", "[" + sender + "] differs from config sellerGate.allowedDomains [" + gate + "]");
    }
    if (["test", "live"].indexOf(settings.mode) === -1) fail("mail/settings.json mode", 'must be "test" or "live", got "' + settings.mode + '"');
    [["inbox.live", (settings.inbox || {}).live], ["kit.replyTo", (settings.kit || {}).replyTo]].forEach(function (pair) {
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(pair[1] || "")) fail("mail/settings.json " + pair[0], "must be an email address");
    });
    /* The repo is shared: the sender's identity and its test inbox belong to
       whoever runs it (the n8n node "Deployment settings"), never to this file. */
    if (settings.sender !== undefined) fail("mail/settings.json sender", "belongs to the deployment, not the repo (mail/README.md, \"Deployment\")");
    Object.keys(settings.inbox || {}).forEach(function (k) {
      if (k !== "live") fail("mail/settings.json inbox." + k, "belongs to the deployment, not the repo (mail/README.md, \"Deployment\")");
    });
    if (settings.mode === "live" && ((settings.inbox || {}).live || "") !== CFG.contactEmail) {
      fail("mail/settings.json inbox.live", "must be the practice mailbox the site's forms name (" + CFG.contactEmail + ")");
    }
  }

  /* A live trigger URL is never committed (AO-Personal-OS hard rule): the repo's
     config ships an empty endpoint, and a deployed copy sets its own. */
  if (CFG.formEndpoint) {
    fail("config.formEndpoint", "is set in the repo — set it on the deployed copy only (mail/README.md), never in git");
  }
  /* A local run reads its endpoint from site/data/endpoint.local.json, so that
     file must stay out of git and out of every publish. */
  var gitignore = "";
  try { gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8"); } catch (error) { /* checked below */ }
  if (gitignore.split(/\r?\n/).map(function (line) { return line.trim(); }).indexOf("site/data/endpoint.local.json") === -1) {
    fail(".gitignore", "must ignore site/data/endpoint.local.json: it holds this machine's live trigger URL");
  }
  var siteManifest = JSON.parse(fs.readFileSync(path.join(root, "site.manifest.json"), "utf8"));
  if (((siteManifest.publish || {}).neverInArtifact || []).indexOf("data/endpoint.local.json") === -1) {
    fail("site.manifest.json publish.neverInArtifact", "must list data/endpoint.local.json, so no publish carries the live trigger URL");
  }
  if (((siteManifest.neverShip || {}).paths || []).indexOf("site/data/endpoint.local.json") === -1) {
    fail("site.manifest.json neverShip.paths", "must list site/data/endpoint.local.json");
  }

  /* The emails' words (mail/copy.json) hold the site's rules, and every email the
     forms can cause renders with no token left unfilled — checked with the real
     links and with every kit link filled, so a layout path cannot hide. */
  var copy = null;
  try { copy = JSON.parse(fs.readFileSync(path.join(root, "mail/copy.json"), "utf8")); }
  catch (error) { return fail("mail/copy.json", "missing or not valid JSON — " + error.message); }
  var copyText = JSON.stringify(copy);
  if (/—/.test(copyText)) fail("mail/copy.json", "carries an em dash — the emails use a colon, a comma or a full stop");
  ["accelerator pack", "packaged", "ready-to-run", "workflow pattern", "solution pack", "pods"].forEach(function (word) {
    if (copyText.toLowerCase().indexOf(word) !== -1) fail("mail/copy.json", 'uses retired vocabulary "' + word + '"');
  });
  var render = require(path.join(root, "mail/render.js"));
  render.ARTIFACT_KEYS.forEach(function (key) {
    var a = (copy.artifacts || {})[key] || {};
    if (!str(a.name) || a.name.length > 24) fail("mail/copy.json artifacts." + key + ".name", "must be 1-24 characters");
    if (!str(a.use) || a.use.length > 95) fail("mail/copy.json artifacts." + key + ".use", "must be one line of at most 95 characters");
    if (!fs.existsSync(path.join(root, "mail/img", render.IMAGE_FILES[key]))) fail("mail/img/" + render.IMAGE_FILES[key], "missing — the kit email's picture for " + key);
  });
  if (((copy.artifacts || {}).interactiveDemo || {}).name !== (((C.shared || {}).tagFamilies || {}).availability || {}).demo.label) {
    fail("mail/copy.json artifacts.interactiveDemo.name", "must be the site's own name for the walkthrough, \"Interactive demo\"");
  }
  var links = JSON.parse(fs.readFileSync(path.join(root, "links.json"), "utf8"));
  var filled = JSON.parse(JSON.stringify(links));
  Object.keys(filled.products).forEach(function (slug) {
    ["onePager", "salesDeck", "featureList", "video"].forEach(function (k) {
      if (!filled.products[slug][k]) filled.products[slug][k] = "https://example.invalid/" + slug + "/" + k;
    });
  });
  [links, filled].forEach(function (L, pass) {
    var ctx = {
      links: L, copy: copy, settings: settings || {},
      deployment: { testInbox: "test-inbox@example.invalid", fromName: "Checker", fromAddress: "checker@example.invalid" },
      catalog: JSON.parse(fs.readFileSync(path.join(root, "mail/catalog.json"), "utf8")),
      imageSrc: function (key) { return "cid:kit-" + key; }
    };
    var mails = [];
    ["all"].concat((C.products || []).map(function (p) { return p.slug; })).forEach(function (slug) {
      var v = render.validate({ form: "kit", email: "check@oracle.com", product: slug, consent: true }, ctx);
      if (!v.ok) return fail("mail/render.js", "refuses a valid kit request for " + slug + " (" + v.code + ")");
      var kit = render.renderKit(v.request, ctx);
      mails.push(["kit " + slug, kit]);
      mails.push(["kit notice " + slug, render.renderInternal(v.request, ctx, { status: "sent", kits: kit.kits })]);
      mails.push(["kit failure " + slug, render.renderInternal(v.request, ctx, { status: "failed", kits: kit.kits, error: "x" })]);
    });
    ["demo", "contact"].forEach(function (form) {
      var v = render.validate({ form: form, name: "Check", email: "check@example.com", consent: true, role: "customer" }, ctx);
      if (!v.ok) return fail("mail/render.js", "refuses a valid " + form + " request (" + v.code + ")");
      mails.push([form + " notice", render.renderInternal(v.request, ctx)]);
    });
    mails.forEach(function (m) {
      var left = (m[1].subject + m[1].html + m[1].text).match(/\{[a-zA-Z]+\}/);
      if (left) fail("mail/render.js " + m[0] + (pass ? " (all links filled)" : ""), "leaves the token " + left[0] + " unfilled");
      if (m[1].subject.length > 90) fail("mail/render.js " + m[0], "subject is " + m[1].subject.length + " characters");
    });
  });
  /* A shared repo carries no live trigger URL and no one's sender infrastructure:
     no webhook path, no n8n instance address (AO-Personal-OS hard rule). */
  (function scan(dir) {
    fs.readdirSync(path.join(root, dir), { withFileTypes: true }).forEach(function (entry) {
      var rel = path.join(dir, entry.name);
      if (entry.isDirectory()) { if (!/^(\.git|\.work|node_modules|asset-candidates)$/.test(entry.name)) scan(rel); return; }
      if (!/\.(js|json|md|html|css|txt|ya?ml|mjs)$/.test(entry.name)) return;
      /* The one sanctioned home of this machine's endpoint: git-ignored and never
         published, both asserted above. */
      if (rel.split(path.sep).join("/") === "site/data/endpoint.local.json") return;
      var text = fs.readFileSync(path.join(root, rel), "utf8");
      var hit = text.match(/https?:\/\/[a-z0-9.-]+\/webhook(-test)?\/[A-Za-z0-9_-]+|[a-z0-9-]+\.app\.n8n\.cloud/);
      /* Masked, so a failing run never prints the secret it caught. */
      if (hit) fail(rel, "carries \"" + hit[0].slice(0, 12) + "…\": a live trigger URL or an n8n instance address never enters git; it belongs to the deployment");
      /* The sender's own files ship placeholders only: an address there is an
         example, the practice mailbox the site already prints, or the self-check's
         fixed sample (rendered, never sent). */
      if (/^mail[\/\\]n8n[\/\\]/.test(rel)) {
        (text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []).forEach(function (address) {
          if (!/@example\.(com|invalid)$/i.test(address) && !/^self-check@/i.test(address) && address !== CFG.contactEmail) {
            fail(rel, "names " + address + ": a deployment's addresses belong in n8n's Deployment settings, not in the repo");
          }
        });
      }
    });
  })(".");
  var refusals = [
    [{ form: "kit", email: "someone@gmail.com", product: "all", consent: true }, "domain"],
    [{ form: "kit", email: "a@oracle.com", product: "no-such-product", consent: true }, "product"],
    [{ form: "demo", name: "x", email: "not-an-email", consent: true }, "email"],
    [{ form: "demo", name: "x", email: "a@b.com", consent: false }, "consent"],
    [{ form: "other", email: "a@b.com", consent: true }, "form"]
  ];
  refusals.forEach(function (r) {
    var v = render.validate(r[0], { settings: settings || {}, catalog: JSON.parse(fs.readFileSync(path.join(root, "mail/catalog.json"), "utf8")) });
    if (v.ok || v.code !== r[1]) fail("mail/render.js validate", "should refuse " + JSON.stringify(r[0]) + " with " + r[1] + ", got " + (v.ok ? "ok" : v.code));
  });
})();

/* Round 4 (Alex, 2026-09-16): NO customer may be named anywhere in the shipped
   data — not in copy, not in alt text, not in a caption — and no customer logo
   may be referenced. The logo files stay in the repo, unreferenced, pending
   customer approval — since 2026-09-17 in docs/asset-candidates/logos/, outside
   the deployable root, because whole-tree publishes had carried them onto the
   link-shared preview (PROVENANCE §25). */
if (fs.existsSync(path.join(root, "site/assets/img/logos"))) {
  fail("site/assets/img/logos/", "exists again — customer marks live in docs/asset-candidates/logos/, outside site/, so no publish or deploy can carry them");
}
CUSTOMER_NAMES.forEach(function (name) {
  if (new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b").test(raw)) {
    fail("content.js", 'names the customer "' + name + '" — the site describes every customer by industry and scale only');
  }
});
if (/assets\/img\/logos\//.test(raw)) {
  fail("content.js", "references assets/img/logos/ — customer marks stay on disk, unreferenced, pending customer approval");
}

/* The Internal review panel, a checklist of the brief's open assumptions that
   anyone with the preview link could open, ran from 2026-09-17 until Alex had
   it removed on 2026-09-29 (PROVENANCE §44). Nothing internal ships in the
   site: the brief's record is docs/START-HERE.md §2, so the panel's files and
   their script tags stay gone, from the archived theme too. */
["site/data/review.js", "site/assets/review.js"].forEach(function (rel) {
  if (fs.existsSync(path.join(root, rel))) {
    fail(rel, "exists again — the Internal review panel was removed on 2026-09-29; the brief's open items live in docs/START-HERE.md §2");
  }
});
["site/index.html", "site/index-legacy.html"].forEach(function (rel) {
  if (/review\.js/.test(fs.readFileSync(path.join(root, rel), "utf8"))) {
    fail(rel, "loads a review.js — the Internal review panel was removed on 2026-09-29 (docs/START-HERE.md §8)");
  }
});

/* ——— the live theme (site.css + index.html + content-case.js) ——————————
   The current-SoftServe-brand rules, asserted so a later rewrite cannot
   quietly undo them. index-legacy.html + site-legacy.css are the archived
   pre-2026 theme and are deliberately exempt. Record: docs/SS26-THEME.md. */
(function () {
  var V2_CSS = "site/assets/site.css";
  var V2_HTML = "site/index.html";
  var V2_DATA = "site/data/content-case.js";
  if (!fs.existsSync(path.join(root, V2_CSS))) return;   /* theme not present */

  var css = fs.readFileSync(path.join(root, V2_CSS), "utf8");
  var html = fs.readFileSync(path.join(root, V2_HTML), "utf8");

  /* The retired teal must never come back — not in the stylesheet, and not in
     the artwork either. Round 27 shipped a white-ground site whose 16 step
     frames were still drawn teal-on-near-black, because the check only ever
     looked at the CSS. */
  if (/35CCBA/i.test(css)) fail(V2_CSS, "carries the retired teal #35CCBA");
  (function walk(dir) {
    fs.readdirSync(path.join(root, dir), { withFileTypes: true }).forEach(function (e) {
      var rel = dir + "/" + e.name;
      if (e.isDirectory()) return walk(rel);
      if (!/\.svg$/i.test(e.name)) return;
      var art = fs.readFileSync(path.join(root, rel), "utf8");
      if (/35CCBA/i.test(art)) fail(rel, "artwork still draws the retired teal #35CCBA");
      if (/#(10161A|0E2D4D|496683|9FB3C6)\b/i.test(art)) {
        fail(rel, "artwork still uses the previous theme's near-black palette");
      }
    });
  }("site/assets/img"));

  /* Display type is weight 400, H4-class titles 700. Nothing heavier exists
     in the brand, and with only 300/400/700 declared a stray 600 or 800
     silently renders the Bold cut. */
  var heavy = css.match(/font-weight: ?(600|800|900)\b/g);
  if (heavy) fail(V2_CSS, "uses " + heavy.length + " heading weight(s) the brand does not have (" + heavy.join(", ") + ")");

  /* Round 16 (Alex, on the home page's group tiles and "Why SoftServe on
     Oracle": "not to be grey", "not so boring/grayish"; round 11 said the same
     of S2 and S5): no grey on grey, and the Why rows are rows between hairlines
     with no fill. Round 17 (Alex: "colored / styled like Our offers tiles"):
     a group tile is a flat brand fill, never the page's grey steps, with no
     border, no shadow and no photograph; each tone class carries its fill; the
     action and accent colours never paint a tile; and the round-16 stage
     (the photograph, its veil, the window on it) is gone. */
  function cssRule(selector) {
    var at = css.indexOf("\n" + selector + " {");
    return at === -1 ? "" : css.slice(at, css.indexOf("}", at));
  }
  var tileRule = cssRule(".gtile");
  if (!tileRule || !/background:\s*var\(--tile-fill\)/.test(tileRule)) {
    fail(V2_CSS, ".gtile must be painted by its tone's fill, background: var(--tile-fill)");
  }
  if (/\bborder:|box-shadow:|var\(--bg-(raised|inset)\)|var\(--(action|accent)\b/.test(tileRule)) {
    fail(V2_CSS, ".gtile carries a border, a shadow, a grey step or the action/accent colour — it is a flat brand fill");
  }
  GROUP_TONES.forEach(function (tone) {
    var rule = css.match(new RegExp("\\.gtile--" + tone.replace("-", "\\-") + " \\{ --tile-fill: (#[0-9a-f]{6}); \\}", "i"));
    if (!rule) fail(V2_CSS, "no .gtile--" + tone + " { --tile-fill: … } rule");
    else if (rule[1].toLowerCase() !== GROUP_TONE_HEX[tone]) fail(V2_CSS, ".gtile--" + tone + " fills " + rule[1] + ", expected " + GROUP_TONE_HEX[tone]);
  });
  if (!/--tile-ink:\s*#1a1a1a/i.test(tileRule)) fail(V2_CSS, ".gtile's ink is not #1a1a1a — #4c5156 fails on blue 75, and the tile has one ink");
  if (/\.gtile-(stage|veil|window|band)\b/.test(css)) {
    fail(V2_CSS, "still styles the round-16 stage (.gtile-stage / -veil / -window / -band) — retired in round 17");
  }
  /* PROVENANCE §45: the two-line name holds only if its first line never wraps, so
     the body is the name's container and the name's size is clamped to what
     that container's measure holds; and two across stops at 720, below which a
     half row holds the longest first line only under 20 px. */
  if (!/container-type:\s*inline-size/.test(cssRule(".gtile-body"))) {
    fail(V2_CSS, ".gtile-body must be an inline-size container — the name sizes itself to the tile so its first line never wraps");
  }
  var nameRule = cssRule(".gtile-name");
  if (!/--name-fit:\s*calc\(\(100cqi - 12px\) \/ 10\.6\)/.test(nameRule) || !/font-size:\s*clamp\(1\.25rem, var\(--name-fit\), 1\.75rem\)/.test(nameRule)) {
    fail(V2_CSS, ".gtile-name must clamp its size to --name-fit, (100cqi - 12px) / 10.6 — the size at which \"Enterprise knowledge &\" holds one line");
  }
  if (!/font-size:\s*clamp\(1\.25rem, var\(--name-fit\), 1\.5rem\)/.test(css)) {
    fail(V2_CSS, "below 1280 the group name's 24 px ceiling must still clamp to --name-fit");
  }
  if (!/@media \(max-width: 720px\) \{\s*\.gtiles \{ grid-template-columns: minmax\(0, 1fr\); \}/.test(css)) {
    fail(V2_CSS, "the group tiles go to one column at 720, not lower — a narrower half row cannot hold the name's first line at 20 px");
  }
  var whyRule = cssRule(".pillars.pillars--list .pillar");
  if (!whyRule || !/background:\s*none/.test(whyRule)) {
    fail(V2_CSS, "the Why SoftServe rows must carry no fill — they are rows between hairlines, not grey cards");
  }
  /* Round 17 (Alex: the Why icons "more aligned with" softserveinc.com): the
     brand draws feature icons as bold 64 px outlines on no well, so the mark
     carries no tint and the glyph is 4rem at a 3 px stroke. */
  var whyMark = cssRule(".pillars.pillars--list .pillar-mark");
  var whyIcon = cssRule(".pillars.pillars--list .pillar-mark .icon");
  if (!whyMark || !/background:\s*none/.test(whyMark)) {
    fail(V2_CSS, "the Why SoftServe icons sit on no well — the brand's feature icons carry no tint behind them");
  }
  if (!whyIcon || !/width:\s*4rem/.test(whyIcon) || !/stroke-width:\s*1\.125/.test(whyIcon)) {
    fail(V2_CSS, "the Why SoftServe icons are 4rem at stroke-width 1.125 (3 px) — the brand's feature-icon size and weight");
  }
  /* The Bespoke band (Alex, 2026-09-29): its copy is one column on the right
     half, and its picture is a box on the band's left half that fades out
     before that column — never a cover under the copy, which read as "very
     poor visibility of text" the moment the picture changed. */
  if (!/grid-column:\s*2/.test(cssRule(".bespoke-copy, .bespoke-body"))) {
    fail(V2_CSS, "the Bespoke band's copy and parts sit in the grid's second column — the copy stands on the right (Alex, 2026-09-29)");
  }
  var bespokeMedia = cssRule(".bespoke-media");
  if (!bespokeMedia || /inset:\s*0/.test(bespokeMedia) || !/width:\s*50%/.test(bespokeMedia) || !/mask-image/.test(bespokeMedia)) {
    fail(V2_CSS, "the Bespoke band's picture is a left-half box that fades out before the copy (width: 50% and a mask), never a cover under the copy (Alex, 2026-09-29)");
  }

  /* Shape is the corner cut; the pill and the old radii are retired. */
  ["--r-pill", "--r-lg", "--r-md"].forEach(function (t) {
    if (css.indexOf("var(" + t + ")") > -1) fail(V2_CSS, "still reads " + t + " — the shape is a clip-path cut, not a radius");
  });

  /* Austin orange is the accent line of a hero H1 and one chip fill. It is
     never on a control, and never text below 24px. */
  var orange = (css.match(/var\(--accent(-dim)?\)/g) || []).length;
  if (orange > 3) fail(V2_CSS, "spends the orange accent " + orange + " times — it belongs on the hero H1's accent line and .chip--accent only");

  /* A product name's hyphenated compound is one unit (2026-09-29). Headings
     balance their lines, and balancing split "Repair-or-replace decisions" at
     its hyphen at 375 although the compound fits the line. Both headings that
     print a product name, the hero's H1 and the catalog tile's title, render
     it through keepCompounds(), a nowrap span per compound, and the data
     carries no invisible character. A text-wrap value alone is no fix: pretty
     and wrap each strand a short word on another name at 320. */
  var appNames = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");
  var headlineFn = appNames.slice(appNames.indexOf("function headline("), appNames.indexOf("function sectionHead("));
  if (!/keepCompounds\(parts\.accent\)/.test(headlineFn) || !/keepCompounds\(parts\.rest\)/.test(headlineFn)) {
    fail("site/assets/app.js headline()", "must render both parts through keepCompounds() — a balanced heading splits a hyphenated product name at its hyphen");
  }
  var tileFn = appNames.slice(appNames.indexOf("function productTile("), appNames.indexOf("function card("));
  if (!/ptile-title[^\n]*keepCompounds\(product\.name\)/.test(tileFn)) {
    fail("site/assets/app.js productTile()", "must render the tile title through keepCompounds(product.name) — a balanced heading splits a hyphenated product name at its hyphen");
  }
  var heroSrc = fs.readFileSync(path.join(root, "site/pages/product.js"), "utf8");
  if (!/UI\.headline\([^)]*product-title/.test(heroSrc)) {
    fail("site/pages/product.js", "renders .product-title without UI.headline() — the name's hyphenated compounds would split on a phone");
  }
  if (!/white-space:\s*nowrap/.test(cssRule(".compound"))) {
    fail(V2_CSS, ".compound must be white-space: nowrap — it keeps a product name's hyphenated compound whole");
  }
  C.products.forEach(function (p) {
    var name = [p.name, p.headline && p.headline.accent, p.headline && p.headline.rest].join(" ");
    if (/[­​-‍‑⁠﻿]/.test(name)) {
      fail("products." + p.slug + ".name", "carries an invisible or non-breaking character — the renderer keeps a compound whole, never the data");
    }
  });

  /* The five licensed faces ship with the theme. */
  ["Azurio-Regular.woff", "Azurio-Semibold.woff", "ReplicaLLWeb-Light.woff2",
   "ReplicaLL-Regular.ttf", "ReplicaLL-Bold.ttf"].forEach(function (f) {
    if (!fs.existsSync(path.join(root, "site/assets/fonts", f))) fail("site/assets/fonts", "missing " + f + " — the theme falls back to Georgia/Arial without it");
    if (css.indexOf("fonts/" + f) === -1) fail(V2_CSS, "declares no @font-face for " + f);
  });

  /* Sentence case is a data change, carried by the overlay. Without the tag
     the page shows the stored capitals in a serif. */
  if (html.indexOf('src="data/content.js"') === -1) fail(V2_HTML, "does not load data/content.js");
  if (html.indexOf('src="data/content-case.js"') === -1) {
    fail(V2_HTML, "does not load data/content-case.js — the uppercase strings would ship as capitals");
  } else if (html.indexOf('src="data/content.js"') > html.indexOf('src="data/content-case.js"')) {
    fail(V2_HTML, "loads content-case.js before content.js — the overrides would be overwritten");
  }
  if (html.indexOf("fonts.googleapis.com") > -1) fail(V2_HTML, "still requests a webfont service — the theme self-hosts and falls back to system faces");
  if (html.indexOf('data-theme="light"') === -1) fail(V2_HTML, 'must carry data-theme="light"');
  if (html.indexOf('content="#ffffff"') === -1) fail(V2_HTML, "theme-color must be #ffffff on a white ground");

  /* The archive stays runnable: its own stylesheet, and no drift onto the
     live one. */
  var LEGACY_HTML = "site/index-legacy.html";
  if (fs.existsSync(path.join(root, LEGACY_HTML))) {
    var legacy = fs.readFileSync(path.join(root, LEGACY_HTML), "utf8");
    if (legacy.indexOf('href="assets/site-legacy.css"') === -1) {
      fail(LEGACY_HTML, "does not load assets/site-legacy.css — the archive would render on the live theme");
    }
    if (legacy.indexOf('src="data/content-case.js"') > -1) {
      fail(LEGACY_HTML, "loads the sentence-case overlay — the archive is the uppercase theme");
    }
    if (!fs.existsSync(path.join(root, "site/assets/site-legacy.css"))) {
      fail("site/assets", "site-legacy.css is missing — index-legacy.html has no stylesheet");
    }
  }

  /* Every override must still match the string it was written against. */
  if (fs.existsSync(path.join(root, V2_DATA))) {
    var box = { window: { SITE_CONTENT: JSON.parse(JSON.stringify(C)) }, console: { warn: function () {} } };
    vm.createContext(box);
    vm.runInContext(fs.readFileSync(path.join(root, "site/assets/brand.js"), "utf8"), box);
    vm.runInContext(fs.readFileSync(path.join(root, V2_DATA), "utf8"), box, { filename: V2_DATA });
    var meta = box.window.SITE_CONTENT_V2;
    if (!meta) fail(V2_DATA, "did not report what it applied (window.SITE_CONTENT_V2)");
    else if (meta.applied !== meta.total) {
      fail(V2_DATA, meta.applied + " of " + meta.total + " re-casings applied — a string it patches has changed in content.js");
    }
  }
}());


/* ---- round 22 · the Technology and Delivery tabs (Alex, 2026-09-29) ----
   The Oracle products registry the widget reads, the Delivery tab's shared
   tiers and footnote, and the renderers: no heading on the Technology tab,
   nothing but the table on the Delivery tab, and no SVG diagram file. */
(function () {
  var sh = C.shared || {};
  var reg = sh.oracleProducts || {};
  var app22 = fs.readFileSync(path.join(root, "site/assets/app.js"), "utf8");
  if (!str(reg.title)) fail("shared.oracleProducts.title", "missing — the widget's one heading");
  ORACLE_GROUPS.forEach(function (g) {
    if (!str((reg.groups || {})[g])) fail("shared.oracleProducts.groups." + g, "missing — the group's label");
  });
  var seenNames = [];
  Object.keys(reg.items || {}).forEach(function (id) {
    var item = reg.items[id];
    var iw = "shared.oracleProducts.items[" + id + "]";
    if (!str(item.name) || item.name.indexOf("Oracle ") !== 0) fail(iw, 'name "' + item.name + '" must be the full Oracle product name');
    else if (seenNames.indexOf(item.name) !== -1) fail(iw, 'name "' + item.name + '" is used twice — one system, one entry');
    seenNames.push(item.name);
    if (ORACLE_GROUPS.indexOf(item.group) === -1) fail(iw, 'group "' + item.group + '" is not ' + ORACLE_GROUPS.join(" / "));
    if (!str(item.icon) || app22.indexOf('"' + item.icon + '":') === -1) fail(iw, 'icon "' + item.icon + '" is not in assets/app.js ICONS');
    var used = (C.products || []).some(function (p) {
      return ((p.technology || {}).oracle || []).some(function (pick) { return pick && pick.id === id; });
    });
    if (!used) fail(iw, "no product lists it — the registry holds only what a page shows");
  });
  /* One system, one name, in the strip's words too: the data once spelled the
     database four ways and Field Service two. */
  (C.products || []).forEach(function (p) {
    var odd = JSON.stringify(p.technology || {}).match(/Oracle (AI Database 26ai|Autonomous Database|Field Service|ADB)\b/);
    if (odd) fail("products[" + p.slug + "].technology", 'spells "' + odd[0] + '" — the registry names it one way on every page');
  });

  var dls = sh.delivery || {};
  var tiers = dls.tiers || [];
  if (tiers.map(function (x) { return x.name; }).join("|") !== DELIVERY_TIERS.join("|")) {
    fail("shared.delivery.tiers", "names are " + tiers.map(function (x) { return x.name; }).join(" · ") + " — expected " + DELIVERY_TIERS.join(" · "));
  }
  tiers.forEach(function (tier, i) {
    var tw = "shared.delivery.tiers[" + i + "]";
    if (tier.size !== DELIVERY_SIZES[i]) fail(tw, 'size is "' + tier.size + '", expected "' + DELIVERY_SIZES[i] + '"');
    if (!str(tier.id)) fail(tw, "id missing — the header's fill keys on it");
    if (!str(tier.duration)) fail(tw, "duration missing — Alex: an approximate duration for every phase");
    else if (/[€$£]/.test(tier.duration)) fail(tw, "duration carries a price");
  });
  if (!str(dls.durationLabel)) fail("shared.delivery.durationLabel", "missing");
  if (!str(dls.footnote) || !/scoping/.test(dls.footnote) || words(dls.footnote) > 10) {
    fail("shared.delivery.footnote", "one very short line saying the durations are confirmed at scoping (Alex), ≤ 10 words");
  }
  DELIVERY_MARKS.forEach(function (m) {
    if (!str((dls.marks || {})[m])) fail("shared.delivery.marks." + m, "missing — the legend's word for the mark");
  });

  var prod22 = fs.readFileSync(path.join(root, "site/pages/product.js"), "utf8");
  function body(name) {
    var a = prod22.indexOf("function " + name + "(");
    if (a < 0) return null;
    var b = prod22.indexOf("\n  function ", a + 10);
    var c = prod22.indexOf("\n  /* ————— tab:", a + 10);
    var end = [b, c].filter(function (x) { return x > 0; }).sort(function (x, y) { return x - y; })[0] || prod22.length;
    return prod22.slice(a, end).replace(/\/\*[\s\S]*?\*\//g, "");
  }
  var techFn = body("technologyTab");
  if (!techFn) fail("site/pages/product.js", "technologyTab() missing");
  else {
    if (/blockHead\(|<h2|<h3/.test(techFn)) fail("site/pages/product.js technologyTab()", "renders a heading — Alex took the Architecture subheading off (round 22)");
    if (/stack|capabilit|narrative|figure\(/.test(techFn)) fail("site/pages/product.js technologyTab()", "renders a retired block — the tab is the strip, its line and the widget");
  }
  var delFn = body("deliveryTab");
  if (!delFn) fail("site/pages/product.js", "deliveryTab() missing");
  else if (/price|investment|pillar|timeline|button|linkArrow|promise|outcomes|needs/i.test(delFn)) {
    fail("site/pages/product.js deliveryTab()", 'renders more than the packages table — "Everything else should be gone from this tab" (Alex, round 22)');
  }
  if (/jumpstartTab|function solutionStack|function capabilities\(/.test(prod22)) fail("site/pages/product.js", "still carries a retired Technology or Jumpstart renderer");
  if (fs.existsSync(path.join(root, "site/data/diagrams.js"))) {
    fail("site/data/diagrams.js", "retired in round 22 — the strip is HTML in product.js, its words are content.js technology.diagram");
  }
  ["site/index.html", "site/index-legacy.html"].forEach(function (rel) {
    if (fs.readFileSync(path.join(root, rel), "utf8").indexOf("data/diagrams.js") !== -1) fail(rel, "loads the retired data/diagrams.js");
  });
  var label22 = (sh.sectionLabels || {});
  ["architecture", "stack", "capabilities", "jumpstartOutcomes", "jumpstartInvestment", "jumpstartNext"].forEach(function (k) {
    if (label22[k] !== undefined) fail("shared.sectionLabels." + k, "labels a retired block (round 22) — nothing renders it");
  });
  if (C.media !== undefined) fail("media", "held the SVG diagrams' alt text, retired in round 22 — the strip is text");
}());

if (warnings.length) {
  console.warn("check-grammar: " + warnings.length + " warning(s)");
  warnings.forEach(function (x) { console.warn("  ! " + x); });
  console.warn("");
}

if (failures.length) {
  console.error("check-grammar: " + failures.length + " failure(s)\n");
  failures.forEach(function (f) { console.error("  ✗ " + f); });
  process.exit(1);
}
console.log("check-grammar: OK — " + C.products.length + " products, every grammar slot filled, and the home page's nine screens.");
