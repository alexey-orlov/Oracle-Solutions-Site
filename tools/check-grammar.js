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

var C = sandbox.window.SITE_CONTENT;
var CFG = sandbox.window.SITE_CONFIG;

var INDUSTRIES = [
  "manufacturing", "logistics", "utilities", "telecom", "healthcare",
  "financial-services", "insurance", "retail", "energy", "public-sector",
  "automotive", "life-sciences", "professional-services", "construction",
  "travel-transport", "cross-industry"
];
/* E3: the solution stack renders top → bottom in this order. A product may
   omit a layer (the Lakehouse pair has no NVIDIA engine) but may never
   re-order them — the Technology tab is the surface a technical buyer
   compares most directly across products. */
var STACK_KEYS = ["application", "ai-engine", "data-platform", "infrastructure", "custom"];
var STACK_VENDORS = ["oracle", "nvidia", "softserve"];
var DIRECTIONS = ["inbound", "outbound", "both"];
/* G: the Jumpstart block is the same three pillars on all seven, in this order. */
var PILLARS = ["fast", "low-risk", "tangible"];
/* Round 9: the tiers are PoV Jumpstart / Integration / Scaling everywhere (the
   2026-09-18 decision), because the hero stack's top band says "Scaling" and one
   page may not carry both words for one thing. */
var NEXT_TIERS = ["Integration", "Scaling"];
/* A matrix row carrying a restrictive asterisk is PARTIAL: an unqualified
   SUPPORTED tag on it would overstate the source. */
var CAP_STATES = ["supported", "partial", "roadmap"];
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
/* Round 4, T1: the three tag families and the two availability badges.
   Round 9: the catalog is grouped by the job to be done — six product groups,
   in the order the home page's tiles and the rail list them. The two retired
   ids (processing-pipelines, data-analysis) may not return, here or in the icon
   registry, and the home tiles derive from this set rather than a second list. */
var PATTERN_IDS = ["knowledge-analytics", "deep-research", "documents", "transactions", "forecasting-optimization", "video-image"];
/* Round 4, T3, rewritten in round 9 (Alex): ONE canonical technology set, in
   ONE order, with TWO forms of each name. The SHORT `label` is what the rail,
   the product chips, the tile band, `tags[1]` and the hero stack render; the
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
/* The three products with an interactive walkthrough under site/demo/. The
   Demo badge and the Artifacts filter read `demoUrl`, not the video flag. */
var DEMO_SLUGS = ["large-document-extraction", "workforce-optimization", "cross-system-erp-qa"];
/* Round 4, T1: only these two carry the muted "in preparation" status line;
   every other product's state is told by its availability badges. */
var UNPACKAGED = ["case-evidence-collection", "plan-vs-actual-investigation"];
var RETIRED_TAGS = ["Available now", "Fixed-price offer", "In preparation"];
var CUSTOMER_NAMES = ["Bosch", "Riyadh Air", "RiyadhAir", "Riyahd", "DHL", "SBG", "BSH", "Binladin", "Belron", "Channel 4", "KPN", "NHS", "OMV"];
/* E: a one-liner says what the product does, for whom, with what outcome. It is
   not the place for the packaging story — that is what the Jumpstart tab is. */
var PACKAGING_PHRASES = [
  "packaged from proof of value",
  "from proof of value to enterprise scale",
  "fixed-price",
  "fixed price",
  "quick start",
  "proof of value to enterprise"
];

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
   home-page block below fails if it returns. Services keeps its hero image, and
   so do all seven products. */
checkHeroImage("services", C.services.hero && C.services.hero.image);

/* ---- products ---- */
if (!arr(C.products) || C.products.length !== 7) {
  fail("products", "expected exactly 7 products, got " + (arr(C.products) ? C.products.length : "none"));
}

(C.products || []).forEach(function (p) {
  var w = "products[" + p.slug + "]";
  var o = p.overview || {};
  var t = p.technology || {};
  var v = p.jumpstart || {};

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
  if (p.pov !== undefined) fail(w, "pov is superseded by jumpstart — nothing renders it");
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
  /* T3: the platform a product runs on is one of the four canonical facets, and
     the chip that names it carries that facet's label verbatim. */
  if (FACET_IDS.indexOf(p.facet) === -1) {
    fail(w, 'facet "' + p.facet + '" is not one of ' + FACET_IDS.join(" / "));
  }
  /* The hero chip row is built from `category` and `facet` and skips tags[0]
     and tags[1], so those two have to say what the renderer already says.
     Anything past them renders as a second technology chip beside the platform
     one, which is how "AI-Q" and "cuOpt" came to read as part of the platform
     name — engine detail belongs in the Technology tab, not in the chip row. */
  if (arr(p.tags)) {
    if (p.tags.length !== 2) {
      fail(w, "tags holds " + p.tags.length + " entries — exactly two: the pattern chip and the canonical platform label");
    }
    if (str(p.categoryChip) && p.tags[0] !== p.categoryChip) {
      fail(w, 'tags[0] is "' + p.tags[0] + '" but the pattern chip renders "' + p.categoryChip + '"');
    }
    var wantFacetLabel = FACET_LABELS[p.facet];
    if (wantFacetLabel && p.tags[1] !== wantFacetLabel) {
      fail(w, 'tags[1] is "' + p.tags[1] + '" but the technology chip renders "' + wantFacetLabel + '"');
    }
  }
  if (!p.hero) fail(w, "hero missing"); else checkHeroImage(w, p.hero.image);
  if (!CFG.products[p.slug]) fail(w, "no matching SITE_CONFIG.products entry");
  else {
    if (typeof CFG.products[p.slug].videoPoster !== "string") {
      fail(w, "config.videoPoster missing (must exist, may be empty)");
    }
    /* A string here would be truthy whatever it said, so "false" would turn
       the frame on. The flag decides a layout — it has to be a real boolean. */
    if (typeof CFG.products[p.slug].video !== "boolean") {
      fail(w, "config.video missing or not a boolean (true | false)");
    }
    /* Round 4, T1/T2: the Marketplace badge and the Marketplace facet both read
       this flag. A string would be truthy whatever it said. */
    if (typeof CFG.products[p.slug].marketplace !== "boolean") {
      fail(w, "config.marketplace missing or not a boolean (true | false)");
    }
    /* The two availability flags are the owner's statement that the thing
       exists; the URLs are the wiring, and they arrive later. So the only rule
       here is the type — either flag may be true with an empty URL (the badge
       renders unlinked, the video frame says a recording is in preparation),
       and neither flag is asserted to any particular value. The one cross-check
       that stays is the reverse case, where a URL exists but its flag is off and
       the control would never render. */
    if (CFG.products[p.slug].marketplaceUrl && !CFG.products[p.slug].marketplace) {
      fail(w, "config.marketplaceUrl is set but config.marketplace is false — the badge would not render for a listing that exists");
    }
  }

  /* 2.1 problem → solution */
  var ps = o.problemSolution;
  if (!ps) fail(w, "overview.problemSolution missing");
  else ["problem", "solution"].forEach(function (side) {
    var panel = ps[side];
    if (!panel) return fail(w, "problemSolution." + side + " missing");
    ["title", "text", "icon"].forEach(function (k) {
      if (!str(panel[k])) fail(w, "problemSolution." + side + "." + k + " missing");
    });
  });

  /* 2.2 metrics */
  if (!arr(o.metrics) || o.metrics.length < 1 || o.metrics.length > 4) {
    fail(w, "overview.metrics must hold 1–4 tiles, got " + (arr(o.metrics) ? o.metrics.length : "none"));
  } else o.metrics.forEach(function (m, i) {
    var mw = w + ".metrics[" + i + "]";
    if (!(m.value === null || str(m.value))) fail(mw, "value must be a non-empty string or null");
    if (str(m.value) && m.value.length > 20) fail(mw, 'value "' + m.value + '" is too long to set large');
    ["label", "qualifier", "icon"].forEach(function (k) {
      if (!str(m[k])) fail(mw, k + " missing");
    });
    if (str(m.qualifier) && words(m.qualifier) > 14) fail(mw, "qualifier is " + words(m.qualifier) + " words (max 14)");
  });
  if (!str(o.metricsNote)) fail(w, "overview.metricsNote missing — a metric row never renders without it");

  /* 2.3 roi */
  if (!o.roi) fail(w, "overview.roi missing");
  else ["icon", "text"].forEach(function (k) {
    if (!str(o.roi[k])) fail(w, "overview.roi." + k + " missing");
  });

  /* 2.4 features */
  if (!arr(o.features) || o.features.length < 6 || o.features.length > 8) {
    fail(w, "overview.features must hold 6–8 items, got " + (arr(o.features) ? o.features.length : "none"));
  } else o.features.forEach(function (f, i) {
    if (!str(f)) return fail(w, "features[" + i + "] is not a string");
    if (words(f) > 12) fail(w, 'features[' + i + '] is ' + words(f) + ' words (max 12): "' + f + '"');
  });
  if (!arr(o.featuresDetail) || o.featuresDetail.length < 6) {
    fail(w, "overview.featuresDetail must keep the long-form list (≥6 entries)");
  }

  /* 2.5 industries — the chips are superseded by the industryCases tabs; only
     the "where else this applies" line survives, under the tab component. */
  if (o.industries !== undefined) fail(w, "overview.industries is superseded by overview.industryCases — nothing renders it");
  if (!str(o.industriesNote)) fail(w, "overview.industriesNote missing");

  /* 2.6 scope */
  if (!o.scope || !arr(o.scope.in) || !arr(o.scope.out)) fail(w, "overview.scope.in / .out missing");
  else {
    if (o.scope.in.length < 4) fail(w, "overview.scope.in needs ≥4 items");
    if (o.scope.out.length < 4) fail(w, "overview.scope.out needs ≥4 items");
  }

  /* 2.7 more detail */
  if (!arr(o.moreDetail) || o.moreDetail.length < 3) fail(w, "overview.moreDetail needs ≥3 entries");
  else o.moreDetail.forEach(function (d, i) {
    if (!str(d.title) || !str(d.body)) fail(w, "moreDetail[" + i + "] needs { title, body }");
  });

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

  /* E2 · How it works — the workflow stepper */
  if (!arr(o.steps) || o.steps.length < 3 || o.steps.length > 5) {
    fail(w, "overview.steps must hold 3–5 workflow steps, got " + (arr(o.steps) ? o.steps.length : "none"));
  } else {
    var covered = [];
    o.steps.forEach(function (s, i) {
      var sw = w + ".steps[" + i + "]";
      if (s.n !== i + 1) fail(sw, 'n is "' + s.n + '", expected ' + (i + 1) + " — steps are numbered in order from 1");
      ["title", "text", "image"].forEach(function (k) {
        if (!str(s[k])) fail(sw, k + " missing");
      });
      /* ≤ 2 lines in the stepper, whose column is narrow. */
      if (str(s.text) && words(s.text) > 30) fail(sw, "text is " + words(s.text) + " words (max 30 — it has to fit two lines)");
      if (str(s.image)) {
        var want = new RegExp("^assets/img/steps/" + p.slug + "-" + (i + 1) + "\\.(jpg|jpeg|png|webp|svg)$");
        if (!want.test(s.image)) fail(sw, 'image "' + s.image + '" must be assets/img/steps/' + p.slug + "-" + (i + 1) + ".<jpg|png|webp|svg>");
        else checkAsset(sw, "step image", s.image);
      }
      if (!arr(s.features) || !s.features.length) fail(sw, "features missing — every step carries the feature bullets that belong to it");
      else s.features.forEach(function (f) {
        if (!arr(o.features) || o.features.indexOf(f) === -1) fail(sw, 'feature "' + f + '" is not one of overview.features');
        else if (covered.indexOf(f) !== -1) fail(sw, 'feature "' + f + '" is claimed by more than one step');
        else covered.push(f);
      });
    });
    /* No bullet may fall between the steps: the stepper replaces the checklist. */
    (o.features || []).forEach(function (f) {
      if (covered.indexOf(f) === -1) fail(w, 'feature "' + f + '" belongs to no step — every overview.features item lands in exactly one');
    });
  }

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

  /* 3.1 narrative */
  if (!str(t.narrative)) fail(w, "technology.narrative missing");
  else {
    var narrativeSentences = sentences(t.narrative);
    if (narrativeSentences > 3) fail(w, "technology.narrative is " + narrativeSentences + " sentences (max 3)");
  }

  /* The shapes the layered stack and the capability list replaced are gone from
     the data. A re-introduced one would render nowhere and drift out of sync in
     silence. `flow` went with the How-it-runs diagram (the stack reads top to
     bottom instead); `security` went with the Security-and-deployment block,
     its facts folded into the layer summaries, the scope lists and the
     Jumpstart pillars. */
  ["groups", "layers", "integration", "notUsed", "flow", "security"].forEach(function (k) {
    if (t[k] !== undefined) fail(w, "technology." + k + " is superseded — nothing renders it");
  });

  /* E3 · the layered solution stack */
  if (!arr(t.stack) || t.stack.length < 4 || t.stack.length > 5) {
    fail(w, "technology.stack must hold 4–5 layers, got " + (arr(t.stack) ? t.stack.length : "none"));
  } else {
    var lastIdx = -1;
    var sawSoftServe = false;
    t.stack.forEach(function (layer, i) {
      var lw = w + ".stack[" + i + "]";
      var idx = STACK_KEYS.indexOf(layer.key);
      if (idx === -1) return fail(lw, 'key "' + layer.key + '" is not one of ' + STACK_KEYS.join(" / "));
      if (idx <= lastIdx) fail(lw, 'layer "' + layer.key + '" is out of order — the stack renders ' + STACK_KEYS.join(" → "));
      lastIdx = idx;
      ["label", "summary"].forEach(function (k) {
        if (!str(layer[k])) fail(lw, k + " missing");
      });
      if (str(layer.summary) && sentences(layer.summary) > 1) fail(lw, "summary is " + sentences(layer.summary) + " sentences (the accordion row holds one line)");
      if (!arr(layer.vendors) || !layer.vendors.length) fail(lw, "vendors missing — every layer carries at least one vendor mark");
      else layer.vendors.forEach(function (vn) {
        if (STACK_VENDORS.indexOf(vn) === -1) fail(lw, 'vendor "' + vn + '" is not oracle / nvidia / softserve');
        if (vn === "softserve") sawSoftServe = true;
      });
      if (!arr(layer.items) || !layer.items.length) return fail(lw, "items empty");
      var required = 0;
      layer.items.forEach(function (item, j) {
        var iw = lw + ".items[" + j + "]";
        if (!str(item.name)) fail(iw, "name missing");
        if (typeof item.required !== "boolean") fail(iw, "required must be a boolean — Required / Optional is a tag, not a guess");
        else if (item.required) required += 1;
        if (item.direction !== undefined && DIRECTIONS.indexOf(item.direction) === -1) {
          fail(iw, 'direction "' + item.direction + '" is not inbound / outbound / both');
        }
        if (item.direction !== undefined && layer.key !== "custom") {
          fail(iw, "direction belongs on the custom layer — that is where integrations render as Inbound / Outbound lines");
        }
      });
      if (!required) fail(lw, "no Required item — a layer with nothing required is not a layer of this stack");
    });
    var keys = t.stack.map(function (l) { return l.key; });
    ["application", "data-platform", "infrastructure", "custom"].forEach(function (k) {
      if (keys.indexOf(k) === -1) fail(w, 'technology.stack has no "' + k + '" layer');
    });
    if (!sawSoftServe) fail(w, "technology.stack carries no SoftServe vendor mark");
    var custom = t.stack.filter(function (l) { return l.key === "custom"; })[0];
    if (custom && arr(custom.items)) {
      var dirs = custom.items.map(function (x) { return x.direction; }).filter(Boolean);
      if (dirs.indexOf("inbound") === -1 && dirs.indexOf("both") === -1) {
        fail(w, "stack custom layer names no inbound integration");
      }
      if (dirs.indexOf("outbound") === -1 && dirs.indexOf("both") === -1) {
        fail(w, "stack custom layer names no outbound integration");
      }
    }
  }

  /* F · the capability list, grouped by the four workflow stages */
  if (!arr(t.capabilities) || t.capabilities.length !== 4) {
    fail(w, "technology.capabilities must hold exactly 4 workflow stages, got " + (arr(t.capabilities) ? t.capabilities.length : "none"));
  } else {
    var seenStages = [];
    t.capabilities.forEach(function (group, i) {
      var gw = w + ".capabilities[" + i + "]";
      if (!str(group.stage)) fail(gw, "stage missing");
      else if (seenStages.indexOf(group.stage) !== -1) fail(gw, 'stage "' + group.stage + '" appears twice');
      else seenStages.push(group.stage);
      if (!arr(group.items) || group.items.length < 3) fail(gw, "items needs ≥3 capabilities");
      else group.items.forEach(function (item, j) {
        if (!str(item.name)) fail(gw + ".items[" + j + "]", "name missing");
        if (item.state !== undefined && CAP_STATES.indexOf(item.state) === -1) {
          fail(gw + ".items[" + j + "]", 'state "' + item.state + '" is not supported / partial / roadmap — omit the key where no source states one');
        }
      });
    });
  }

  /* G · the Jumpstart Proof-of-Value block */
  if (!v || !Object.keys(v).length) fail(w, "jumpstart missing");
  else {
    ["title", "promise", "cta"].forEach(function (k) {
      if (k === "cta" ? !(v.cta && str(v.cta.label) && str(v.cta.route)) : !str(v[k])) {
        fail(w, "jumpstart." + k + " missing");
      }
    });
    if (str(v.title) && v.title !== "Jumpstart Proof-of-Value") {
      fail(w, 'jumpstart.title is "' + v.title + '" — the block title is the same on all seven');
    }
    if (!arr(v.pillars) || v.pillars.length !== 3) fail(w, "jumpstart.pillars must hold exactly 3");
    else v.pillars.forEach(function (pillar, i) {
      if (pillar.key !== PILLARS[i]) fail(w, 'pillars[' + i + '].key is "' + pillar.key + '", expected "' + PILLARS[i] + '"');
      ["title", "text"].forEach(function (k) {
        if (!str(pillar[k])) fail(w, "pillars[" + i + "]." + k + " missing");
      });
    });
    if (!arr(v.outcomes) || v.outcomes.length < 3 || v.outcomes.length > 4) {
      fail(w, "jumpstart.outcomes must hold 3–4 outcome lines, got " + (arr(v.outcomes) ? v.outcomes.length : "none"));
    }
    if (!arr(v.timeline) || v.timeline.length < 3 || v.timeline.length > 4) {
      fail(w, "jumpstart.timeline must hold 3–4 nodes, got " + (arr(v.timeline) ? v.timeline.length : "none"));
    } else v.timeline.forEach(function (node, i) {
      if (!str(node.label) || !str(node.text)) fail(w, "timeline[" + i + "] needs { label, text }");
    });
    if (!arr(v.needs) || v.needs.length !== 3) fail(w, "jumpstart.needs must hold exactly 3 items");
    var inv = v.investment;
    if (!inv) fail(w, "jumpstart.investment missing");
    else {
      /* A figure is a string or null: where nothing is published the card
         prints one scope line, not two tiles both reading the same
         placeholder. The footnote stays required — it renders with the
         figures, and a figure never renders without it. */
      ["price", "duration"].forEach(function (k) {
        if (!(inv[k] === null || str(inv[k]))) {
          fail(w, "jumpstart.investment." + k + " must be a non-empty string, or null where none is published");
        }
      });
      if (!str(inv.footnote)) fail(w, "jumpstart.investment.footnote missing — a figure never renders without it");
      if (!arr(inv.includes) || inv.includes.length < 3) fail(w, "jumpstart.investment.includes needs ≥3 lines");
      /* One footnote, not a disclaimer stack: the packaging-internal sentences
         were removed site-wide in round 3. */
      if (str(inv.footnote) && sentences(inv.footnote) > 2) {
        fail(w, "jumpstart.investment.footnote is " + sentences(inv.footnote) + " sentences — one footnote line, not a disclaimer stack");
      }
    }
    if (!arr(v.next) || v.next.length !== 2) fail(w, "jumpstart.next must hold exactly 2 steps — Integration and Scale");
    else v.next.forEach(function (step, i) {
      if (step.tier !== NEXT_TIERS[i]) fail(w, 'next[' + i + '].tier is "' + step.tier + '", expected "' + NEXT_TIERS[i] + '"');
      if (!str(step.text)) fail(w, "next[" + i + "].text missing");
      if (!str(step.price)) fail(w, "next[" + i + "].price missing — it reads Scoped per engagement where none is published");
    });
    if (v.cta && str(v.cta.route) && v.cta.route !== "#/products/" + p.slug + "/contacts") {
      fail(w, 'jumpstart.cta.route "' + v.cta.route + '" must point at this product’s contacts tab');
    }
    ["facts", "deliverables", "pricing", "disclaimers", "ladder", "ladderFootnote", "capabilityMatrix", "statStrip", "statNotes", "howItRuns", "prerequisites"].forEach(function (k) {
      if (v[k] !== undefined) fail(w, "jumpstart." + k + " is a superseded POV-tab shape — nothing renders it");
    });
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
  /* Round 10: five tabs, in this order. Use cases took the industry block and
     the case study off the Overview; For sellers went the other way — its kit
     request is the Contacts tab's second row, because a page that repeats one
     form under two names is a structure bug. Every retired segment redirects,
     so `legacyIds` is a list, not a single key. */
  var TAB_IDS = ["overview", "use-cases", "technology", "jumpstart", "contacts"];
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
  if (legacyIds("jumpstart").indexOf("pov") === -1) {
    fail("shared.productTabs[jumpstart]", 'legacyIds must include "pov" so the old route still lands');
  }
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
  if (!str(demoForm.secondaryHeading)) {
    fail("forms.demo", "secondaryHeading missing — Home S7 and Services head the form under the contact card separately");
  }
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

  /* The tab is called Use cases, so the block inside it says how they are cut. */
  var industryLabel = (((C.shared || {}).sectionLabels) || {}).industryCases;
  if (str(industryLabel) && /use case/i.test(industryLabel)) {
    fail("shared.sectionLabels.industryCases", 'says "' + industryLabel + '" — the tab already says Use cases; the block names the cut');
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
    ["productsPage.bottomBlock.body", (pp.bottomBlock || {}).body],
    ["productsPage.bottomBlock.heading", (pp.bottomBlock || {}).heading],
    ["overview.twoWays.panels[0].body", (((C.overview || {}).twoWays || {}).panels || [])[0] && C.overview.twoWays.panels[0].body],
    ["overview.catalog.lead", ((C.overview || {}).catalog || {}).lead],
    ["overview.catalog.title", ((C.overview || {}).catalog || {}).title]
  ];
  (C.products || []).forEach(function (pr) {
    strings.push(["products[" + pr.slug + "].overview.metricsNote", (pr.overview || {}).metricsNote]);
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

  /* The badge claims a walkthrough exists, so the config has to hold one for
     exactly the products whose walkthrough ships under site/demo/. */
  (C.products || []).forEach(function (p) {
    var conf = (CFG.products || {})[p.slug] || {};
    var has = typeof conf.demoUrl === "string" && conf.demoUrl.trim().length > 0;
    var should = DEMO_SLUGS.indexOf(p.slug) !== -1;
    if (has && !should) fail("config.products[" + p.slug + "]", "demoUrl is set but no walkthrough ships for this product");
    if (!has && should) fail("config.products[" + p.slug + "]", "demoUrl is empty, so the interactive demo badge and filter would both miss a walkthrough that exists");
    if (has && !fs.existsSync(path.join(root, "site", conf.demoUrl.replace(/\/index\.html$/, "")))) {
      warn("config.products[" + p.slug + "]", "demoUrl points at site/" + conf.demoUrl + ", which is not on disk");
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
      if (p.facet === id) fail("products[" + p.slug + "]", 'facet "' + id + '" is not a catalog platform — a product cannot run on a platform the rail does not offer');
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

  /* The Services platform cards are the same four platforms under another
     shape, in the same order — otherwise a reader meets one name on the
     Products rail and a different one on Services. Round 9: a card has the room
     for the full Oracle product name, so that is what it carries, while the
     rail, the chips and the hero stack take the short label. The home page's
     four platform tiles derive from `facets.technology` itself. */
  (function () {
    var where = "services.hero.platforms";
    var list = ((C.services || {}).hero || {}).platforms;
    if (!arr(list) || list.length !== FACET_IDS.length) {
      return fail(where, "must hold one card per canonical platform (" + FACET_IDS.length + ")");
    }
    FACET_IDS.forEach(function (id, i) {
      if (list[i].name !== FACET_FULL[id]) {
        fail(where + "[" + i + "]", 'name is "' + list[i].name + '", expected the full Oracle name "' + FACET_FULL[id] + '"');
      }
    });
  })();
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
    /* The tile's one line is read in a third of the row, under the image. The
       budget counts words, not the em dashes a parenthetical rides on. */
    if (str(c.line)) {
      var lineWords = words(c.line.replace(/\s[—–-]\s/g, " "));
      if (lineWords > 26) fail(where, "line is " + lineWords + " words (max 26 — it sits under a tile image)");
      if (c.line.trim().slice(-1) !== ".") fail(where, "line does not end in a period — the six tiles are sentences and sit side by side");
    }
    /* One folder, so the tile art cannot be confused with a hero or a step
       frame, and a missing file is a warning: art ships on its own track. */
    if (str(c.image)) {
      if (!/^assets\/img\/groups\/[a-z0-9-]+\.(jpg|jpeg|png|webp|svg)$/.test(c.image)) {
        fail(where, 'image "' + c.image + '" must be assets/img/groups/<name>.<jpg|png|webp|svg>');
      } else {
        checkAsset(where, "group tile image", c.image);
      }
    }
    /* The empty state is a capability, never a gap: the no-"yet" rule of §18.9
       applies to it more than to any other string, because it is the one a
       reader meets where a product does not exist. */
    if (str(c.emptyState) && /\byet\b|\bso far\b|\bcoming\b|\bnot seeing\b/i.test(c.emptyState)) {
      fail(where, "emptyState names the gap — say what the practice does deliver and what to tell us");
    }
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
      fail(cw, "metricEyebrow is retired — the status chip carries the word once");
    }
    ["id", "descriptor", "area", "industry", "status", "line", "footnote"].forEach(function (k) {
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
    /* A card whose headline value is words disclaims figures it never shows. */
    if (c.metric && str(c.metric.value) && !/\d/.test(c.metric.value) && /figures are illustrative/i.test(c.footnote || "")) {
      fail(cw, "footnote disclaims figures, but metric.value carries no number — trim the figures clause");
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
  /* Services no longer restates the engagements, one line each: since round 6
     the case-study footnotes here carry each engagement's evidence, and
     `services.proof` is checked with the rest of the Services page below. */
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
  ["name", "title", "tagline", "metaDescription"].forEach(function (k) {
    if (!str(s[k])) fail("site", k + " missing");
  });
  /* Two items and no "Overview": the logo is the home link. Case studies left
     the header on 2026-09-17 (Alex) — the home page still carries its
     case-study screen, and Services links to it. For sellers took the slot in
     round 8 and left it the same day (Alex): #/sellers stays, reached from the
     footer's link row and from the Get the full kit link in a product kit
     confirmation. */
  var NAV = [
    { label: "Products", route: "#/products" },
    { label: "Services", route: "#/services" }
  ];
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
  if (!arr(h.ctas) || h.ctas.length !== 2) {
    fail("overview.hero.ctas", "must hold exactly 2 buttons, got " + (arr(h.ctas) ? h.ctas.length : "none"));
  } else h.ctas.forEach(function (c, i) {
    ["label", "route", "kind"].forEach(function (k) {
      if (!str((c || {})[k])) fail("overview.hero.ctas[" + i + "]", k + " missing");
    });
  });
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
    reqStr("overview.catalog", cat, ["eyebrow", "title", "lead"]);
    reqCta("overview.catalog.cta", cat.cta);
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
    if (!arr(d.steps) || d.steps.length !== 3) {
      fail("overview.delivery.steps", "must hold exactly 3 steps — proof of value, integration, scale, got " +
        (arr(d.steps) ? d.steps.length : "none"));
    } else d.steps.forEach(function (st, i) {
      reqStr("overview.delivery.steps[" + i + "]", st, ["title", "body", "factLabel", "fact"]);
    });
    /* Rule 1 of VISUAL-GRAMMAR: every step's `fact` carries a duration and the
       first one carries a price, and this block has no other caveat row. */
    if (!str(d.footnote)) {
      fail("overview.delivery", "footnote missing — the step facts carry durations and a price, and a number never renders without its caveat in the same block");
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
    if (!arr(d.ctas) || d.ctas.length < 1 || d.ctas.length > 2) {
      fail("overview.delivery.ctas", "must hold 1 or 2 — the screen ends on one action, got " +
        (arr(d.ctas) ? d.ctas.length : "none"));
    } else d.ctas.forEach(function (c, i) {
      reqCta("overview.delivery.ctas[" + i + "]", c);
    });
  }

  /* --- S5 · the case-study rail (the cards themselves are checked in C2) --- */
  reqStr("overview.caseStudiesIntro", o.caseStudiesIntro, ["eyebrow", "title", "body", "ndaLine"]);
  reqCta("overview.caseStudiesIntro.cta", (o.caseStudiesIntro || {}).cta);

  /* --- S6 · about SoftServe, the page's one light band --- */
  var ab = o.about;
  if (!ab) fail("overview.about", "missing — S6, the light band");
  else {
    reqStr("overview.about", ab, ["eyebrow", "title", "body", "partnerLine"]);
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
    if (!arr(ab.partners) || !ab.partners.length) {
      fail("overview.about.partners", "needs at least one wordmark — the partner strip is what `partnerLine` labels");
    } else ab.partners.forEach(function (pt, i) {
      var pw = "overview.about.partners[" + i + "]";
      if (!str((pt || {}).name)) fail(pw, "name missing — it is the image's alt text");
      if (!str((pt || {}).file)) fail(pw, "file missing");
      else if (pt.file.indexOf("assets/img/") !== 0) {
        fail(pw, 'file "' + pt.file + '" must be a path under assets/img/');
      } else if (pt.file.indexOf("logos/") !== -1) {
        fail(pw, 'file "' + pt.file + '" is under assets/img/logos/ — those are customer marks and stay unreferenced');
      } else {
        checkAsset(pw, "partner wordmark", pt.file);
      }
      /* Both dimensions ship so the strip reserves its space and does not
         reflow the band when the SVGs arrive. */
      ["width", "height"].forEach(function (k) {
        if (typeof (pt || {})[k] !== "number") fail(pw, k + " must be a number");
      });
    });
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
    reqStr("overview.contact", ct, ["heading", "sub"]);
  }

  /* --- what the old home page carried, and must not carry again --- */
  [
    ["trustStrip", "the three-wordmark strip — the partner wordmarks sit inside the About band now"],
    ["productsIntro", "the products intro — S3's head is overview.catalog"],
    ["servicesTeaser", "the platform-card teaser — S4 is overview.delivery, and the four platform cards live on Services"]
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
     The three screens round 9 rewrote are held to it; the two it did not touch
     warn, so the debt is visible without failing a build over old copy. */
  [
    ["overview.twoWays.title", (o.twoWays || {}).title, true],
    ["overview.catalog.title", (o.catalog || {}).title, true],
    ["overview.caseStudiesIntro.title", (o.caseStudiesIntro || {}).title, true],
    ["overview.delivery.title", (o.delivery || {}).title, false],
    ["overview.about.title", (o.about || {}).title, false],
    ["overview.contact.heading", (o.contact || {}).heading, false]
  ].forEach(function (row) {
    if (!str(row[1]) || row[1].length <= 30) return;
    var message = "is " + row[1].length + " characters — an H2 is a display line (max 30); the argument goes in the lead";
    if (row[2]) fail(row[0], message); else warn(row[0], message);
  });

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

/* Round 10: "Request a demo" is retired as a label — the site has one contact
   ask, and it is site.primaryCta.label. The `request-a-demo` anchor id keeps its
   hyphens and is deliberately not matched here; keep it that way. */
if (/request a demo/i.test(raw)) {
  fail("content.js", 'still says "request a demo" — the one contact ask is site.primaryCta.label (round 10)');
}

/* ---- rounds 6–7 · the Services page (2026-09-16, 2026-09-17) ----
   Three screens and the contact block, one message each (round 7, Alex): AI
   depth with Oracle expertise — the practice (hero and band); it's all about
   ROI — every step ends in a number (the step track); a fast proof of value,
   no hassle (the light band and two panels). The steps the page shares with
   the home track carry the home page's names, Discovery may lead them, and the
   anchors other pages link to are asserted against the routes that point at
   them (PROVENANCE §21, §23). */
(function () {
  var s = C.services || {};
  var site = C.site || {};
  var shared = C.shared || {};

  ["whatWeDo", "whySoftServe"].forEach(function (k) {
    if (s[k] !== undefined) fail("services." + k, "retired in round 6 — its substance moved into the hero or left the page (PROVENANCE §21)");
  });
  ["afterGoLive", "proof"].forEach(function (k) {
    if (s[k] !== undefined) fail("services." + k, "retired in round 7 — after go-live folds into the Scale step, the measurement into the step track, the proof into proofOfValue (PROVENANCE §23)");
  });
  if (site.dividerLabels !== undefined) fail("site.dividerLabels", "retired in round 6 — nothing renders the rule–label–rule divider");
  if (shared.ladderColumns !== undefined) fail("shared.ladderColumns", "retired in round 6 — Services renders the home step track, not a ladder table");

  var h = s.hero || {};
  ["lead", "secondParagraph", "platformsTitle"].forEach(function (k) {
    if (!str(h[k])) fail("services.hero", k + " missing");
  });
  if (!h.headline || !str(h.headline.accent) || !str(h.headline.rest)) fail("services.hero.headline", "needs { accent, rest }");
  if (!arr(h.stats) || !h.stats.length) fail("services.hero.stats", "missing");
  (h.platforms || []).forEach(function (platform, i) {
    if (platform.short !== undefined || platform.long !== undefined) {
      fail("services.hero.platforms[" + i + "]", "short/long retired in round 6 — the platforms render as chips");
    }
  });
  if (!h.cta || !str(h.cta.label) || !str(h.cta.route)) fail("services.hero.cta", "needs { label, route }");

  var e = s.howWeEngage || {};
  ["anchor", "eyebrow", "title", "lead", "footnote"].forEach(function (k) {
    if (!str(e[k])) fail("services.howWeEngage", k + " missing");
  });
  ["ladder", "ladderRules", "ladderFootnote", "howAPovRuns"].forEach(function (k) {
    if (e[k] !== undefined) fail("services.howWeEngage." + k, "retired in round 6 — the step track replaces the ladder");
  });
  var homeSteps = ((C.overview || {}).delivery || {}).steps || [];
  var steps = arr(e.steps) ? e.steps : [];
  var offset = steps.length - homeSteps.length;
  if (offset < 0 || offset > 1 || (offset === 1 && (steps[0] || {}).title !== "Discovery")) {
    fail("services.howWeEngage.steps", "must be the home delivery steps (" + homeSteps.length + "), optionally led by Discovery");
  } else steps.forEach(function (step, i) {
    var where = "services.howWeEngage.steps[" + i + "]";
    ["title", "body", "factLabel", "fact"].forEach(function (k) {
      if (!str(step[k])) fail(where, k + " missing");
    });
    /* One word for one thing: the steps both pages show carry the same names. */
    var home = homeSteps[i - offset];
    if (home && step.title !== home.title) {
      fail(where, 'title is "' + step.title + '", but the home step is "' + home.title + '"');
    }
  });

  var pov = s.proofOfValue || {};
  ["anchor", "eyebrow", "title", "lead", "footnote"].forEach(function (k) {
    if (!str(pov[k])) fail("services.proofOfValue", k + " missing");
  });
  if (!pov.stat || !str(pov.stat.value) || !str(pov.stat.label)) {
    fail("services.proofOfValue", "stat needs { value, label } — the duration, set as the band's figure");
  }
  if (!pov.cta || !str(pov.cta.label) || !str(pov.cta.route)) {
    fail("services.proofOfValue", "cta needs { label, route } — the link to the case studies that carry the figures");
  }
  if (!arr(pov.panels) || pov.panels.length !== 2) {
    fail("services.proofOfValue.panels", "must hold two panels — what the customer brings, and what they leave with");
  } else pov.panels.forEach(function (panel, i) {
    var where = "services.proofOfValue.panels[" + i + "]";
    ["id", "icon", "title", "body"].forEach(function (k) {
      if (!str(panel[k])) fail(where, k + " missing");
    });
    if (!arr(panel.bullets) || !panel.bullets.length) fail(where, "bullets missing");
    if (panel.cta !== undefined) fail(where, "carries a cta — the contact block is the page's one ask");
  });

  /* The routes other pages use to land here must keep resolving. */
  var anchors = [e.anchor, pov.anchor, ((C.forms || {}).contact || {}).anchor];
  [
    ["shared.engageLink.route", (shared.engageLink || {}).route],
    ["overview.caseStudiesIntro.cta.route", (((C.overview || {}).caseStudiesIntro || {}).cta || {}).route],
    ["site.navCta.route", (site.navCta || {}).route]
  ].forEach(function (pair) {
    var m = /^#\/services#([a-z0-9-]+)$/.exec(pair[1] || "");
    if (m && anchors.indexOf(m[1]) === -1) fail(pair[0], '"' + pair[1] + '" points at an anchor the Services page no longer has');
  });
  if (/\bpackages?\b/i.test((shared.engageLink || {}).label || "")) {
    fail("shared.engageLink.label", "says package — packaging vocabulary stays internal");
  }
})();

/* ---- round 7 · one proof-of-value duration (Alex, 2026-09-17) ----
   "Make sure that we always mention 4–8 weeks PoV, consistently across the
   site": every Jumpstart states it in its promise, its short form (which the
   seller CTA interpolates) and its investment figure; the home hero tile, the
   home step track and the Services page carry it; and no other proof-of-value
   duration survives anywhere in the data (PROVENANCE §23). */
(function () {
  var POV = "4–8 weeks";
  (C.products || []).forEach(function (p) {
    var j = p.jumpstart || {};
    var where = "products[" + p.slug + "].jumpstart";
    if (j.durationShort !== POV) fail(where + ".durationShort", '"' + j.durationShort + '" — the proof of value is "' + POV + '" everywhere');
    if (!j.investment || j.investment.duration !== POV) fail(where + ".investment.duration", 'must be "' + POV + '"');
    if (!str(j.promise) || j.promise.indexOf(POV) === -1) fail(where + ".promise", 'must state "' + POV + '"');
    var fast = (j.pillars || []).filter(function (x) { return x.key === "fast"; })[0];
    if (fast && !/4–8 weeks|Four weeks/.test(fast.text || "")) fail(where + ".pillars[fast]", "must state the " + POV + " duration");
  });
  var o = C.overview || {};
  var step = ((o.delivery || {}).steps || [])[0];
  if (!step || step.fact !== POV) fail("overview.delivery.steps[0].fact", 'must be "' + POV + '"');
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
  if (JSON.stringify(C.services || {}).indexOf(POV) === -1) fail("services", 'never states the "' + POV + '" proof of value');
  var povStat = ((C.services || {}).proofOfValue || {}).stat;
  if (povStat && povStat.value !== POV) fail("services.proofOfValue.stat.value", 'must be "' + POV + '"');
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
  need("salesKit.tab", tab, ["title", "body", "routeLabel", "nextDemo", "nextDemoLink", "nextAll", "nextAllLink"]);
  token("salesKit.tab.body", tab.body, "product");
  token("salesKit.tab.nextDemo", tab.nextDemo, "link");
  token("salesKit.tab.nextAll", tab.nextAll, "link");
  need("salesKit.form", form, ["emailLabel", "emailPlaceholder", "productLabel", "productAll", "submit", "submitting",
    "eligibility", "otherRoute", "kitName", "kitNameAll", "mailSubject", "mailSubjectAll", "mailBody"]);
  token("salesKit.form.otherRoute", form.otherRoute, "routeLink");
  token("salesKit.form.kitName", form.kitName, "product");
  token("salesKit.form.mailSubject", form.mailSubject, "product");
  need("salesKit.form.errors", form.errors || {}, ["email", "domain", "send"]);
  token("salesKit.form.errors.domain", (form.errors || {}).domain, "routeLink");
  var conf = form.confirmations || {};
  ["sent", "queued", "mailto"].forEach(function (k) {
    var c = conf[k] || {};
    if (!str(c.title) || !str(c.body)) return fail("salesKit.form.confirmations." + k, "needs { title, body }");
    token("salesKit.form.confirmations." + k, c.body, "kitName");
    if (k !== "sent" && /we[’']ve emailed|we have emailed|has been (sent|emailed)/i.test(c.body)) {
      fail("salesKit.form.confirmations." + k, "claims the kit was emailed — only `sent` may, and only when an auto-sender is configured");
    }
  });

  /* Sellers and partners are different readers: the kit goes to seller domains only. */
  var roles = (C.forms || {}).roles || [];
  ["oracle-seller", "oracle-partner"].forEach(function (value) {
    if (!roles.some(function (r) { return r.value === value; })) fail("forms.roles", 'missing "' + value + '"');
  });
  roles.forEach(function (r) {
    if (/or partner/i.test(r.label || "")) fail("forms.roles", '"' + r.label + '" lumps sellers and partners together');
  });

  var footerLink = (((C.site || {}).footer) || {}).sellersLink;
  if (!footerLink || footerLink.route !== "#/sellers" || !str(footerLink.label)) {
    fail("site.footer.sellersLink", 'needs { label, route: "#/sellers" }');
  }
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

/* The Internal review panel (2026-09-17, docs/START-HERE.md §8) is temporary,
   for the prototype only. While index.html loads it, the list must be well
   formed and name no customer, and every run warns, so it cannot reach a
   launch unnoticed. */
(function () {
  var html = fs.readFileSync(path.join(root, "site/index.html"), "utf8");
  var loadsData = html.indexOf('<script src="data/review.js"></script>') !== -1;
  var loadsPanel = html.indexOf('<script src="assets/review.js"></script>') !== -1;
  if (!loadsData && !loadsPanel) return;
  if (loadsData !== loadsPanel) {
    fail("index.html", "loads only one of data/review.js and assets/review.js — the Internal panel is added and removed as a pair");
    return;
  }
  var reviewRaw = fs.readFileSync(path.join(root, "site/data/review.js"), "utf8");
  var box = { window: {} };
  vm.createContext(box);
  try {
    vm.runInContext(reviewRaw, box, { filename: "site/data/review.js" });
  } catch (e) {
    fail("data/review.js", "does not load: " + e.message);
    return;
  }
  var R = box.window.SITE_REVIEW;
  if (!R || !Array.isArray(R.groups) || !R.groups.length) {
    fail("data/review.js", "window.SITE_REVIEW.groups must be a non-empty array");
    return;
  }
  /* Alex, 2026-09-17: "much less verbose (1-2 line items)". An item is a
     line to tick, not an analysis: id, text, and at most a short note on
     where the site does not match yet. The ticks themselves live in each
     viewer's browser, not in this file. */
  var ITEM_KEYS = ["id", "text", "note"];
  var TEXT_MAX = 70;
  var TEXT_WITH_NOTE_MAX = 47;
  var NOTE_MAX = 45;
  var ids = {};
  R.groups.forEach(function (group, gi) {
    var where = "review.groups[" + gi + "]";
    if (!group.title || !String(group.title).trim()) fail(where, "title is empty");
    if (!Array.isArray(group.items) || !group.items.length) { fail(where, "has no items"); return; }
    group.items.forEach(function (item, ii) {
      var at = where + ".items[" + ii + "]";
      Object.keys(item || {}).forEach(function (key) {
        if (ITEM_KEYS.indexOf(key) === -1) fail(at, 'key "' + key + '" — an item is only ' + ITEM_KEYS.join(", ") + " (1–2 lines; detail belongs in the docs)");
      });
      if (!item.id || !/^[a-z0-9-]+$/.test(item.id)) fail(at, "id must be kebab-case");
      else if (ids[item.id]) fail(at, 'duplicate id "' + item.id + '" — ticks are saved by id');
      else ids[item.id] = true;
      if (!item.text || !String(item.text).trim()) fail(at, "text is empty");
      else if (item.text.length > (item.note ? TEXT_WITH_NOTE_MAX : TEXT_MAX)) {
        fail(at, "text runs " + item.text.length + " characters — keep it to " + (item.note ? TEXT_WITH_NOTE_MAX + " beside a note (one line at the panel's width)" : TEXT_MAX));
      }
      if (item.note != null && (!String(item.note).trim() || item.note.length > NOTE_MAX)) {
        fail(at, "note must be non-empty and " + NOTE_MAX + " characters at most");
      }
    });
  });
  CUSTOMER_NAMES.forEach(function (name) {
    if (new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b").test(reviewRaw)) {
      fail("data/review.js", 'names the customer "' + name + '" — the panel is visible to anyone with the preview link');
    }
  });
  if (R.enabled !== false) {
    warn("Internal review panel", "on, " + Object.keys(ids).length + " items — delete data/review.js, assets/review.js and their script tags before launch");
  }
})();

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

  /* Shape is the corner cut; the pill and the old radii are retired. */
  ["--r-pill", "--r-lg", "--r-md"].forEach(function (t) {
    if (css.indexOf("var(" + t + ")") > -1) fail(V2_CSS, "still reads " + t + " — the shape is a clip-path cut, not a radius");
  });

  /* Austin orange is the accent line of a hero H1 and one chip fill. It is
     never on a control, and never text below 24px. */
  var orange = (css.match(/var\(--accent(-dim)?\)/g) || []).length;
  if (orange > 3) fail(V2_CSS, "spends the orange accent " + orange + " times — it belongs on the hero H1's accent line and .chip--accent only");

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
console.log("check-grammar: OK — 7 products, every grammar slot filled, and the home page's seven screens.");
