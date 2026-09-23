#!/usr/bin/env node
/**
 * sync-links.js — derives the two files that read links.json, the repo's one
 * links file (round 12):
 *
 *   site/data/links.js   the public subset the site's buttons need: the
 *                        walkthrough, its artifact copy, the video. The kit
 *                        documents (one-pager, deck, feature list) never go
 *                        here — anything under site/ is readable by anyone.
 *   mail/catalog.json    each product's name, one-liner and group, from
 *                        content.js, for the kit email (the sender cannot run
 *                        content.js).
 *
 *   node tools/sync-links.js           validate, then write whatever changed
 *   node tools/sync-links.js --check   validate and compare only; exit 1 if stale
 *
 * tools/check-grammar.js runs the same comparison, so a publish cannot ship a
 * stale copy. No dependencies.
 */

"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.resolve(__dirname, "..");
var LINKS = "links.json";
var SITE_OUT = "site/data/links.js";
var CATALOG_OUT = "mail/catalog.json";

/* The six keys every product carries, in the order the file lists them. */
var KEYS = ["onePager", "salesDeck", "featureList", "interactiveDemo", "interactiveDemoArtifact", "video"];
/* The ones the site's own buttons read; the rest stay out of site/. */
var PUBLIC_KEYS = ["interactiveDemo", "interactiveDemoArtifact", "video"];

function loadSite(root) {
  var box = { window: {} };
  vm.createContext(box);
  ["site/assets/brand.js", "site/data/content.js", "site/data/config.js"].forEach(function (rel) {
    vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), box, { filename: rel });
  });
  return { content: box.window.SITE_CONTENT, config: box.window.SITE_CONFIG };
}

function isHttps(value) { return /^https:\/\/[^\s"<>]+$/.test(value); }

/* Checks the file and returns every problem, so one run names them all. */
function validate(links, slugs) {
  var errors = [];
  if (!links || typeof links !== "object") return ["links.json: not a JSON object"];
  if (!isHttps(links.siteUrl || "")) errors.push('siteUrl: must be an https:// address, got "' + links.siteUrl + '"');
  var products = links.products;
  if (!products || typeof products !== "object") return errors.concat(["products: missing"]);

  slugs.forEach(function (slug) {
    if (!products[slug]) errors.push("products: no entry for \"" + slug + "\" (every product in content.js needs one)");
  });
  Object.keys(products).forEach(function (slug) {
    var where = 'products["' + slug + '"]';
    if (slugs.indexOf(slug) === -1) errors.push(where + ": no product with this slug in content.js");
    var entry = products[slug] || {};
    KEYS.forEach(function (key) {
      if (typeof entry[key] !== "string") errors.push(where + "." + key + ': missing (use "" while it does not exist)');
    });
    Object.keys(entry).forEach(function (key) {
      if (KEYS.indexOf(key) === -1) errors.push(where + "." + key + ": unknown key (known: " + KEYS.join(", ") + ")");
    });
    ["onePager", "salesDeck", "featureList", "video", "interactiveDemoArtifact"].forEach(function (key) {
      var value = entry[key];
      if (typeof value === "string" && value && !isHttps(value)) {
        errors.push(where + "." + key + ': must be a full https:// link, got "' + value + '"');
      }
    });
    var demo = entry.interactiveDemo;
    if (typeof demo === "string" && demo && !isHttps(demo)) {
      if (/^(\/|\.\.|[a-z]+:)/i.test(demo) || !/\.html$/.test(demo)) {
        errors.push(where + '.interactiveDemo: a path inside site/ such as "demo/' + slug + '/index.html", or a full https:// link');
      } else if (!fs.existsSync(path.join(ROOT, "site", demo))) {
        errors.push(where + ".interactiveDemo: site/" + demo + " is not on disk");
      }
    }
    if (entry.interactiveDemoArtifact && !entry.interactiveDemo) {
      errors.push(where + ".interactiveDemoArtifact: set while interactiveDemo is empty — the artifact copy needs the walkthrough it copies");
    }
  });
  return errors;
}

function ordered(content, config) {
  var order = (config.productOrder || []).slice();
  var products = (content.products || []).slice();
  return products.sort(function (a, b) {
    var ia = order.indexOf(a.slug); if (ia === -1) ia = order.length + products.indexOf(a);
    var ib = order.indexOf(b.slug); if (ib === -1) ib = order.length + products.indexOf(b);
    return ia - ib;
  });
}

function build(root) {
  var raw;
  try { raw = fs.readFileSync(path.join(root, LINKS), "utf8"); }
  catch (error) { return { errors: [LINKS + ": cannot be read (" + error.code + ")"] }; }
  var links;
  try { links = JSON.parse(raw); }
  catch (error) { return { errors: [LINKS + ": not valid JSON — " + error.message + ' (a missing comma, or a comma after the last value, is the usual cause)'] }; }

  var site = loadSite(root);
  var list = ordered(site.content, site.config);
  var slugs = list.map(function (p) { return p.slug; });
  var errors = validate(links, slugs);
  if (errors.length) return { errors: errors };

  var publicLinks = {};
  list.forEach(function (p) {
    var entry = links.products[p.slug];
    publicLinks[p.slug] = {};
    PUBLIC_KEYS.forEach(function (key) { publicLinks[p.slug][key] = entry[key]; });
  });
  var siteJs =
    "/* GENERATED by tools/sync-links.js from links.json at the repo root. Do not edit\n" +
    "   here: change links.json, then run  node tools/sync-links.js . Only the links the\n" +
    "   site's own buttons read are copied; the kit documents never enter site/. */\n" +
    "window.SITE_LINKS = " + JSON.stringify(publicLinks, null, 2) + ";\n";

  /* The site's own words for what the email repeats: product names, the role
     labels, the kit names and "Not sure yet", so a page and its email never
     name one thing two ways. */
  var forms = site.content.forms || {};
  var kitForm = ((site.content.salesKit || {}).form) || {};
  var catalog = {
    $generated: "tools/sync-links.js from site/data/content.js and config.productOrder. Do not edit.",
    products: list.map(function (p) {
      return { slug: p.slug, name: p.name, oneLiner: p.oneLiner, group: p.categoryChip };
    }),
    roles: (forms.roles || []).map(function (r) { return { value: r.value, label: r.label }; }),
    productNotSure: forms.productPlaceholder || "",
    kitName: kitForm.kitName || "",
    kitNameAll: kitForm.kitNameAll || ""
  };
  var catalogJson = JSON.stringify(catalog, null, 2) + "\n";

  return { errors: [], files: [[SITE_OUT, siteJs], [CATALOG_OUT, catalogJson]] };
}

/* Which generated files differ from what is on disk. */
function stale(root, files) {
  return files.filter(function (file) {
    var current = null;
    try { current = fs.readFileSync(path.join(root, file[0]), "utf8"); } catch (error) { /* missing = stale */ }
    return current !== file[1];
  }).map(function (file) { return file[0]; });
}

module.exports = { build: build, stale: stale, KEYS: KEYS, PUBLIC_KEYS: PUBLIC_KEYS };

if (require.main === module) {
  var checkOnly = process.argv.indexOf("--check") !== -1;
  var result = build(ROOT);
  if (result.errors.length) {
    console.error("sync-links: links.json has " + result.errors.length + " problem(s):");
    result.errors.forEach(function (e) { console.error("  - " + e); });
    process.exit(1);
  }
  var changed = stale(ROOT, result.files);
  if (checkOnly) {
    if (changed.length) {
      console.error("sync-links: stale — " + changed.join(", ") + ". Run: node tools/sync-links.js");
      process.exit(1);
    }
    console.log("sync-links: OK (up to date)");
    process.exit(0);
  }
  result.files.forEach(function (file) {
    if (changed.indexOf(file[0]) === -1) return;
    fs.mkdirSync(path.dirname(path.join(ROOT, file[0])), { recursive: true });
    fs.writeFileSync(path.join(ROOT, file[0]), file[1]);
  });
  console.log(changed.length ? "sync-links: wrote " + changed.join(", ") : "sync-links: OK (nothing to change)");
}
