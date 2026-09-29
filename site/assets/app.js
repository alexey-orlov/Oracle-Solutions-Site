(function () {
  "use strict";

  var C = window.SITE_CONTENT;
  var CFG = window.SITE_CONFIG;

  /* ————— helpers ————— */

  function esc(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function attrs(map) {
    if (!map) return "";
    var out = [];
    Object.keys(map).forEach(function (key) {
      var value = map[key];
      if (value === false || value === null || value === undefined) return;
      if (value === true) { out.push(key); return; }
      out.push(key + '="' + esc(value) + '"');
    });
    return out.length ? " " + out.join(" ") : "";
  }

  var ICONS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"></path>',
    arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"></path>',
    arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"></path>',
    check: '<path d="m4 12 5 5L20 6"></path>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>',
    play: '<path d="M8 5.5v13l11-6.5z"></path>',
    download: '<path d="M12 4v11M7 12l5 5 5-5M5 20h14"></path>',
    search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"></path>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"></path>',
    close: '<path d="M6 6l12 12M18 6 6 18"></path>',
    chevron: '<path d="m9 6 6 6-6 6"></path>',
    chevronDown: '<path d="m6 9 6 6 6-6"></path>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3.5 7 8.5 6 8.5-6"></path>',
    linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"></rect><path d="M8 10.5V16M8 7.8v.2M12 16v-3.2a1.8 1.8 0 0 1 3.6 0V16"></path>',
    dot: '<circle cx="12" cy="12" r="4"></circle>',

    alert: '<path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path><path d="M12 8.5v5M12 16.6v.4"></path>',
    spark: '<path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.3l-1.8-5.7L4.5 10.8 10.2 9z"></path><path d="m18.6 16.4.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z"></path>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"></path><path d="M4 7.5l8 4.5 8-4.5M12 12v9"></path>',
    roi: '<path d="M4 18.5 9.5 13l3.5 3.2L20 8.5"></path><path d="M15.5 8.5H20v4.3"></path><path d="M3 21h18"></path>',
    clock: '<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7v5.3l3.4 2"></path>',
    gauge: '<path d="M3.5 17a8.5 8.5 0 1 1 17 0"></path><path d="m12 17 4-5.5"></path><circle cx="12" cy="17" r="1"></circle>',
    users: '<circle cx="9" cy="8.5" r="3.2"></circle><path d="M3 19.5a6 6 0 0 1 12 0"></path><path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19.5a5.8 5.8 0 0 0-2.2-4.3"></path>',
    shield: '<path d="M12 3 4.5 6v6c0 4.2 3 7.6 7.5 9 4.5-1.4 7.5-4.8 7.5-9V6z"></path>',
    trendUp: '<path d="M4 17 9.5 11.5l3.5 3.3L20 7.5"></path><path d="M15 7.5h5v5"></path>',
    trendDown: '<path d="M4 7.5 9.5 13l3.5-3.3L20 17"></path><path d="M15 17h5v-5"></path>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"></rect><path d="M3.5 10h17M8 3v4M16 3v4"></path>',
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4L11 6.6"></path><path d="M14 10a4.5 4.5 0 0 0-6.4 0L5 12.6a4.5 4.5 0 0 0 6.4 6.4L13 17.4"></path>',
    network: '<circle cx="12" cy="5" r="2.5"></circle><circle cx="5" cy="18" r="2.5"></circle><circle cx="19" cy="18" r="2.5"></circle><path d="M10.3 7.1 6.4 15.7M13.7 7.1l3.9 8.6M7.5 18h9"></path>',
    inbound: '<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M4 20h16"></path>',
    outbound: '<path d="M12 21V9"></path><path d="m7 14 5-5 5 5"></path><path d="M4 4h16"></path>',
    trigger: '<path d="M20 12a8 8 0 1 1-2.4-5.7"></path><path d="M20.5 4v4.2h-4.2"></path>',
    eye: '<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="2.8"></circle>',
    audit: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M9 8h6M9 12h6M9 16h3"></path>',
    storefront: '<path d="M4.5 10.5V20a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-9.5"></path><path d="M3 10.2 4.8 4.4a1 1 0 0 1 1-.7h12.4a1 1 0 0 1 1 .7L21 10.2a2.5 2.5 0 0 1-4.5 1.9 2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5 0A2.5 2.5 0 0 1 3 10.2Z"></path><path d="M9.5 21v-5.4h5V21"></path>',

    /* Round 9 · the two service glyphs the stack's top band needed and the
       registry did not have. Scaling is the same instance repeated wider;
       a managed service is the loop that keeps re-checking it. */
    scale: '<path d="M3.5 20.5h17"></path><rect x="5" y="13.5" width="3.6" height="7"></rect><rect x="10.2" y="9.5" width="3.6" height="11"></rect><rect x="15.4" y="5.5" width="3.6" height="15"></rect>',
    managed: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"></path><path d="M21 3.8v4.3h-4.3"></path><path d="m8.4 12.2 2.6 2.6 4.6-5.2"></path>',

    /* Round 9 · the Demo badge names the interactive walkthrough, not a video:
       a pointer with its click strokes, where `play` stays for a recording. */
    "cursor-click": '<path d="M7 4.2 17.4 11l-4.3 1.2 2.4 5.3-2.3 1-2.3-5.3L7 16.2z"></path><path d="M4.6 4.9 2.7 3M9.5 2.7 10.1 1"></path>',

    /* Round 9 · one glyph per product group (facets.categories). The retired
       ids leave the registry with their categories — a key nothing names is an
       unchecked icon: `pattern-processing-pipelines`, `pattern-data-analysis`,
       `pattern-optimization`, `pattern-knowledge-assistants`. */
    "pattern-knowledge-analytics": '<path d="M21 14.3a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.4v-3.4H5a2.5 2.5 0 0 1-2.5-2.5V6.5A2.5 2.5 0 0 1 5 4h13.5A2.5 2.5 0 0 1 21 6.5z"></path><path d="M8 13V9.5M11.7 13V7.5M15.4 13v-2"></path>',
    "pattern-deep-research": '<circle cx="10.5" cy="10.5" r="7"></circle><path d="m20.5 20.5-5-5"></path><circle cx="8.2" cy="12.4" r="1.3"></circle><circle cx="12.9" cy="12.4" r="1.3"></circle><circle cx="10.6" cy="8.1" r="1.3"></circle><path d="M9.5 11.3 10.1 9.4M11.6 11.3 11.1 9.4M9.5 12.4h2.1"></path>',
    "pattern-documents": '<path d="M6 3.5h7.5l4.5 4.5v12H6z"></path><path d="M13.5 3.5V8H18"></path><path d="M9 12h6M9 15.5h4"></path>',
    /* Round 17: the home page's "Why SoftServe on Oracle" rows, drawn as
       softserveinc.com's feature icons (its icons grid): bold geometric
       outlines, sharp joins, the brand's corner cut where a box appears, and
       the brand's own four-point spark for AI. Shown at 64 px with a 3 px
       stroke (.pillars--list), not at the 1.5 px UI weight. */
    "why-platform": '<path d="M12 3.5 21 8.5 12 13.5 3 8.5z"></path><path d="m3 12.5 9 5 9-5"></path><path d="m3 16.5 9 5 9-5"></path>',
    "why-agentic": '<path d="M12 2.5C12.8 8 16 11.2 21.5 12 16 12.8 12.8 16 12 21.5 11.2 16 8 12.8 2.5 12 8 11.2 11.2 8 12 2.5z"></path>',
    "why-scope": '<path d="M7.5 2.5h9l2.5 2.5v14l-2.5 2.5h-9L5 19V5z"></path><path d="m8.8 12.3 2.3 2.3 4.3-4.6"></path>',
    "pattern-transactions": '<rect x="2.5" y="9" width="5" height="6"></rect><rect x="9.5" y="9" width="5" height="6"></rect><rect x="16.5" y="9" width="5" height="6"></rect><path d="M7.5 12h2M14.5 12h2"></path><path d="m17.8 12.1 1.2 1.2 2-2.4"></path>',
    "pattern-forecasting-optimization": '<path d="M3 17.5 8.5 12l3.5 3.2 8-8.2"></path><path d="M15.5 7h4.5v4.5"></path><circle cx="8.5" cy="12" r="1.6"></circle><path d="M3 21h18"></path>',
    "pattern-video-image": '<rect x="2.5" y="4.5" width="19" height="15"></rect><path d="M2.5 8.5h19"></path><path d="m10.2 11 4.8 2.7-4.8 2.7z"></path>',
    "platform-oci-nvidia": '<path d="M7.6 12.2a3.4 3.4 0 0 1 .5-6.7 4.7 4.7 0 0 1 8.8.9 3.2 3.2 0 0 1 .5 5.8"></path><rect x="8.5" y="13.2" width="7" height="7" rx="1.5"></rect><path d="M10.8 20.2v1.3M13.2 20.2v1.3M8.5 15.5H7.2M8.5 17.9H7.2M16.8 15.5h-1.3M16.8 17.9h-1.3"></path>',
    "platform-oracle-ai-data-platform": '<ellipse cx="12" cy="6" rx="7.5" ry="3"></ellipse><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"></path><path d="m8.5 13 2.6 2.6 5-5"></path>',
    "platform-oracle-ai-lakehouse": '<path d="m12 3 8.5 4.2L12 11.4 3.5 7.2z"></path><path d="m3.5 12 8.5 4.2 8.5-4.2"></path><path d="m3.5 16.8 8.5 4.2 8.5-4.2"></path>',
    "platform-oracle-ai-fusion": '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"></rect><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"></rect><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"></rect><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"></rect>',

    "industry-manufacturing": '<path d="M3.5 20V11l5 3V11l5 3V7l5.5 4v9Z"></path><path d="M2.5 20h19"></path>',
    "industry-logistics": '<rect x="2.5" y="7" width="10.5" height="9" rx="1.5"></rect><path d="M13 10h4l4 3.5V16h-8z"></path><circle cx="7" cy="18.3" r="1.7"></circle><circle cx="17" cy="18.3" r="1.7"></circle>',
    "industry-utilities": '<path d="M13.2 2.5 5.5 13.2h5.6L10 21.5l7.8-11h-5.6z"></path>',
    "industry-telecom": '<path d="M12 10.5v10"></path><circle cx="12" cy="8" r="2"></circle><path d="M7.5 3.5a7 7 0 0 0 0 9M16.5 3.5a7 7 0 0 1 0 9"></path>',
    "industry-healthcare": '<rect x="3" y="3" width="18" height="18" rx="4.5"></rect><path d="M12 8v8M8 12h8"></path>',
    "industry-financial-services": '<path d="M3 10h18M4 10 12 4l8 6M6.5 10v7M10 10v7M14 10v7M17.5 10v7M3 20.5h18"></path>',
    "industry-insurance": '<path d="M12 3 4.5 6v6c0 4.2 3 7.6 7.5 9 4.5-1.4 7.5-4.8 7.5-9V6z"></path><path d="m9 12 2 2 4-4"></path>',
    "industry-retail": '<path d="M5 8h14l-1 12H6z"></path><path d="M9 8V6a3 3 0 0 1 6 0v2"></path>',
    "industry-energy": '<path d="M9 3v5M15 3v5"></path><path d="M6 8h12v3a6 6 0 0 1-12 0z"></path><path d="M12 17v4"></path>',
    "industry-public-sector": '<path d="M6 21V3.5"></path><path d="M6 4h11l-2 3.6L17 11H6"></path>',
    "industry-automotive": '<path d="M5 15.2 6.4 10A2 2 0 0 1 8.3 8.5h7.4A2 2 0 0 1 17.6 10L19 15.2"></path><rect x="3" y="15" width="18" height="4" rx="1.5"></rect><path d="M7 19v1.5M17 19v1.5"></path>',
    "industry-life-sciences": '<path d="M10 3v6L4.6 18a2 2 0 0 0 1.8 3h11.2a2 2 0 0 0 1.8-3L14 9V3"></path><path d="M9 3h6M7.3 14h9.4"></path>',
    "industry-professional-services": '<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M9 7V5.2A2.2 2.2 0 0 1 11.2 3h1.6A2.2 2.2 0 0 1 15 5.2V7M3 12.5h18"></path>',
    "industry-construction": '<path d="M4 16a8 8 0 0 1 16 0"></path><path d="M9.5 16V8.5a2.5 2.5 0 0 1 5 0V16"></path><rect x="2.5" y="16" width="19" height="3.5" rx="1.5"></rect>',
    "industry-travel-transport": '<path d="M21 3 3 10.5l7 2.8L12.8 21z"></path><path d="m10 13.3 11-10.3"></path>',
    "industry-cross-industry": '<circle cx="12" cy="12" r="8.5"></circle><path d="M3.5 12h17M12 3.5c2.4 2.5 3.6 5.4 3.6 8.5S14.4 18 12 20.5C9.6 18 8.4 15.1 8.4 12S9.6 6 12 3.5Z"></path>'
  };

  function icon(name, className) {
    var body = ICONS[name];
    if (!body) return "";
    return '<svg class="icon' + (className ? " " + className : "") +
      '" viewBox="0 0 24 24" aria-hidden="true">' + body + "</svg>";
  }

  function chip(options) {
    var opts = options || {};
    var kind = opts.kind || "meta";
    var classes = ["chip", "chip--" + kind];
    if (opts.className) classes.push(opts.className);
    var extra = opts.attrs ? Object.assign({}, opts.attrs) : {};
    if (opts.tip) {
      classes.push("tip");
      extra["data-tip"] = opts.tip;
      if (!extra.tabindex) extra.tabindex = "0";
    }
    if (opts.title) extra.title = opts.title;
    var tag = kind === "filter" ? "button" : "span";
    if (tag === "button") extra.type = "button";
    var dot = opts.dot ? '<span class="chip-dot chip-dot--' + esc(opts.dot) + '"></span>' : "";
    return "<" + tag + ' class="' + classes.join(" ") + '"' + attrs(extra) + ">" +
      dot + esc(opts.label) + "</" + tag + ">";
  }

  /* ————— the three tag families (VISUAL-GRAMMAR §1.2) —————
     A workflow pattern, the platform it runs on and what a reader can act on
     were one undifferentiated navy run until round 4. They are now three
     shapes — outlined chip, solid pill, teal badge — and each names its family
     in the tooltip, so nobody has to know the taxonomy to read the row. */

  function tagFamilies() {
    return (C.shared && C.shared.tagFamilies) || {};
  }

  function categoryEntry(id) {
    var found = (C.facets.categories || []).filter(function (c) { return c.id === id; })[0];
    return found || { id: id, chip: id, full: "" };
  }

  /* `family` is "pattern" or "tech"; `id` is the facet or category id whose
     label and glyph the chip carries. An extra `tags[]` string has no id of its
     own and passes its text as `options.label` — same family, no glyph. */
  function tagChip(family, id, options) {
    var opts = options || {};
    var fam = tagFamilies()[family] || {};
    var label = opts.label;
    var full = "";
    var glyph = "";

    if (label === undefined || label === null) {
      if (family === "pattern") {
        var category = categoryEntry(id);
        label = category.chip;
        full = category.full;
      } else {
        var facet = facetLabel(id);
        label = facet.label;
        full = facet.fullLabel;
      }
      glyph = (fam.icons && fam.icons[id]) || "";
    }

    var hint = [fam.tooltip, full && full !== label ? full : ""].filter(Boolean).join(" · ");
    var classes = ["chip", family === "pattern" ? "chip--outline" : "chip--meta", "chip--tag"];

    return '<span class="' + classes.join(" ") + '"' +
      attrs({ title: hint || null, "aria-label": hint ? label + " — " + hint : null }) + ">" +
      (glyph ? icon(glyph, "chip-icon") : "") +
      "<span>" + esc(label) + "</span></span>";
  }

  /* A badge is an action, not a label — which is why it is read off the config
     flag that decides whether the thing it claims exists at all. */
  function badgeHtml(def, options) {
    var opts = options || {};
    var inner = icon(def.icon, "badge-icon") + "<span>" + esc(def.label) + "</span>";
    var common = ' class="badge' + (opts.href || opts.action ? " badge--action" : "") + '"' +
      attrs({ title: def.tooltip, "aria-label": def.label + " — " + def.tooltip });
    if (opts.href) {
      return "<a" + common + attrs({ href: opts.href, target: "_blank", rel: "noopener" }) + ">" +
        inner + "</a>";
    }
    if (opts.action) {
      return '<button type="button"' + common + attrs(opts.attrs || {}) + ">" + inner + "</button>";
    }
    return "<span" + common + ">" + inner + "</span>";
  }

  /* Maximum two, both optional: the interactive demo where a walkthrough
     exists, and Oracle Marketplace where a listing does. Round 18 (Alex: "no
     fake and placeholder links"): the Marketplace badge needs the listing's
     URL as well as the flag, so it is always a link to the listing and never
     an inert promise of one.

     Round 9 (Alex): the demo badge reads the walkthrough it opens, not the
     video link, which only decides whether the product page carries a video
     frame. Cross-system ERP Q&A has a walkthrough and no video, and was the
     product missing its badge. */
  function hasListing(slug) {
    var conf = (CFG.products && CFG.products[slug]) || {};
    return conf.marketplace === true && /^https:\/\//.test(conf.marketplaceUrl || "");
  }

  function hasDemo(slug) {
    var link = links(slug).interactiveDemo;
    return typeof link === "string" && link.trim().length > 0;
  }

  /* Round 12: every link a product's sales kit uses lives in links.json at the
     repo root, and since round 15 nowhere else. data/links.js is built from it
     when asked (tools/site_links.py: served by tools/serve.py, written into a
     publish) and carries the three the site's buttons read — the walkthrough,
     its artifact copy, the video. The kit documents never reach the site. */
  function links(slug) {
    var all = window.SITE_LINKS || {};
    return all[slug] || {};
  }

  /* Where the walkthrough opens. `interactiveDemo` is the canonical relative
     path — the walkthrough ships inside site/ — but while the site is previewed
     as a claude.ai artifact a relative link opens a supporting file as a
     top-level page, which the host refuses; there the walkthrough's own
     artifact, `interactiveDemoArtifact`, is used instead. The product page's
     button and the demo badge both read this, so the two can never open
     different things. */
  function demoHref(entry) {
    var link = entry || {};
    if (!link.interactiveDemo) return "";
    var onArtifactHost = /(^|\.)claude\.ai$/i.test(window.location.hostname) ||
      /\/code\/frame\/|\/_f\//.test(window.location.pathname);
    if (onArtifactHost && link.interactiveDemoArtifact) return link.interactiveDemoArtifact;
    return link.interactiveDemo;
  }

  function availabilityBadges(slug) {
    var conf = (CFG.products && CFG.products[slug]) || {};
    var defs = tagFamilies().availability || {};
    var out = [];
    if (hasDemo(slug) && defs.demo) {
      out.push(badgeHtml(defs.demo, { action: true, attrs: { "data-demo-badge": slug } }));
    }
    if (hasListing(slug) && defs.marketplace) {
      out.push(badgeHtml(defs.marketplace, { href: conf.marketplaceUrl }));
    }
    return out.join("");
  }

  function badgeRow(slug, className) {
    var badges = availabilityBadges(slug);
    if (!badges) return "";
    return '<span class="badge-row' + (className ? " " + className : "") + '">' + badges + "</span>";
  }

  function button(options) {
    var opts = options || {};
    var classes = ["btn", "btn--" + (opts.kind || "secondary")];
    if (opts.sm) classes.push("btn--sm");
    if (opts.className) classes.push(opts.className);
    var extra = opts.attrs ? Object.assign({}, opts.attrs) : {};
    var inner = (opts.icon ? icon(opts.icon) : "") + "<span>" + esc(opts.label) + "</span>" +
      (opts.iconAfter ? icon(opts.iconAfter) : "");
    if (opts.href) {
      extra.href = opts.href;
      if (/^https?:/.test(opts.href)) { extra.target = "_blank"; extra.rel = "noopener"; }
      return '<a class="' + classes.join(" ") + '"' + attrs(extra) + ">" + inner + "</a>";
    }
    extra.type = extra.type || "button";
    return '<button class="' + classes.join(" ") + '"' + attrs(extra) + ">" + inner + "</button>";
  }

  function linkArrow(options) {
    var opts = options || {};
    var label = String(opts.label || "").replace(/\s*→\s*$/, "");
    var extra = opts.attrs ? Object.assign({}, opts.attrs) : {};
    extra.href = opts.href || "#/";
    extra.class = "link-arrow" + (opts.className ? " " + opts.className : "");
    return "<a" + attrs(extra) + "><span>" + esc(label) + "</span>" + icon(opts.icon || "arrow") + "</a>";
  }

  function divider(label, center) {
    return '<p class="divider' + (center ? " divider--center" : "") + '"><span>' + esc(label) + "</span></p>";
  }

  function headline(parts, tag, className) {
    var element = tag || "h1";
    var cls = className || "h1";
    return "<" + element + ' class="' + cls + '"><span class="accent">' + esc(parts.accent) +
      "</span> " + esc(parts.rest) + "</" + element + ">";
  }

  function sectionHead(options) {
    var opts = options || {};
    var count = (opts.count || opts.count === 0)
      ? '<span class="section-count nums">' + esc(opts.count) + "</span>" : "";
    var link = opts.link ? '<span class="section-link">' + linkArrow(opts.link) + "</span>" : "";
    return '<div class="section-head">' +
      '<h2 class="h2">' + esc(opts.title) + "</h2>" + count + link + "</div>";
  }

  function emptyState(text) {
    return '<div class="empty"><p>' + esc(text) + "</p></div>";
  }

  function facetLabel(id) {
    var found = C.facets.technology.filter(function (f) { return f.id === id; })[0];
    return found || { label: id, fullLabel: id };
  }

  function industryLabel(key) {
    var labels = (C.shared && C.shared.industryLabels) || {};
    return labels[key] || key;
  }

  function sectionLabel(key) {
    var labels = (C.shared && C.shared.sectionLabels) || {};
    return labels[key] || "";
  }

  function initials(name) {
    return String(name || "").trim().split(/\s+/).slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join("");
  }

  /* One named human, one address, one panel — the left column of every contact
     section, on a product's Contacts tab and on Services. The monogram is the
     avatar's own background and the photograph sits on top of it, so a missing
     file leaves initials rather than a broken frame: the image guard drops the
     <img>. Round 10 retired the "Bring to the call" list: it repeated the form's
     own placeholder and the Jumpstart tab's "What we need from you", and the
     card is now a person, not a briefing. Round 13: `people` adds names after
     `shared.contact` (a product's own lead). The card then lists each person
     as a row, photo beside name and title, over the one address and blurb:
     the people are several, the mailbox is one. */
  function contactPhoto(person) {
    return '<span class="contact-photo" aria-hidden="true">' +
      '<span class="contact-initials">' + esc(initials(person.name)) + "</span>" +
      (person.photo
        ? '<img class="contact-photo-img" src="' + esc(person.photo) +
          '" alt="" loading="lazy" decoding="async">'
        : "") +
      "</span>";
  }

  function contactWho(person) {
    return '<p class="contact-name">' + esc(person.name) + "</p>" +
      (person.title ? '<p class="contact-title">' + esc(person.title) + "</p>" : "");
  }

  function contactSocial(person) {
    return person.linkedin
      ? '<a class="contact-social" href="' + esc(person.linkedin) +
        '" target="_blank" rel="noopener">' + icon("linkedin") + "<span>LinkedIn</span></a>"
      : "";
  }

  function contactCard(options) {
    var opts = options || {};
    var person = (C.shared && C.shared.contact) || null;
    if (!person || !person.name) return "";
    var extra = (opts.people || []).filter(function (p) { return p && p.name; });
    var mail = person.email
      ? '<a class="contact-mail" href="mailto:' + esc(person.email) + '">' +
        icon("mail") + "<span>" + esc(person.email) + "</span></a>"
      : "";
    var blurb = person.blurb ? '<p class="contact-blurb">' + esc(person.blurb) + "</p>" : "";
    var cls = "contact-card" + (opts.className ? " " + esc(opts.className) : "");

    if (extra.length) {
      var rows = [person].concat(extra).map(function (p) {
        return '<li class="contact-person">' + contactPhoto(p) +
          '<div class="contact-person-copy">' + contactWho(p) + contactSocial(p) + "</div></li>";
      }).join("");
      return '<div class="' + cls + ' contact-card--team">' +
        '<ul class="contact-people">' + rows + "</ul>" +
        '<div class="contact-card-copy">' + mail + blurb + "</div></div>";
    }

    return '<div class="' + cls + '">' + contactPhoto(person) +
      '<div class="contact-card-copy">' +
        contactWho(person) + mail + blurb + contactSocial(person) +
      "</div></div>";
  }

  /* Two columns, the named human on the left, the form on the right. One
     component, rendered from one object, on both surfaces — so a reader who has
     met Karsten on a product page meets the same panel on Services. Both columns
     open with a heading on the same baseline, so the card and the form start
     level; neither is stretched to the other's height (round 10). `formId` names
     the right column, so a link elsewhere on the page can land on the form
     itself rather than re-entering the route and wiping what was typed. */
  function contactSplit(options) {
    var opts = options || {};
    var card = contactCard({ className: "contact-card--panel", people: opts.people });
    var right = '<div class="contact-split-form"' +
      (opts.formId ? ' id="' + esc(opts.formId) + '"' : "") + ">" +
      (opts.heading ? '<h3 class="h3 block-title">' + esc(opts.heading) + "</h3>" : "") +
      (opts.sub ? '<p class="body-text contact-split-sub">' + esc(opts.sub) + "</p>" : "") +
      (opts.form || "") +
      "</div>";
    if (!card) return right;
    return '<div class="contact-split">' +
      '<div class="contact-split-card">' +
        (opts.cardHeading ? '<h3 class="h3 block-title">' + esc(opts.cardHeading) + "</h3>" : "") +
        card +
      "</div>" +
      right +
      "</div>";
  }

  function heroBackdrop(image, options) {
    var opts = options || {};
    if (!image || !image.file) return "";
    return '<div class="hero-bg" aria-hidden="true">' +
      '<img class="hero-bg-img" src="' + esc(image.file) + '" alt=""' +
      (image.focal ? ' style="object-position:' + esc(image.focal) + '"' : "") +
      ' loading="' + (opts.lazy ? "lazy" : "eager") + '" decoding="async"' +
      (opts.lazy ? "" : ' fetchpriority="high"') + ">" +
      '<span class="hero-bg-veil"></span>' +
      "</div>";
  }

  function media(key) {
    return (C.media && C.media[key]) || null;
  }

  function diagram(key) {
    var registry = window.SITE_DIAGRAMS;
    if (!registry || typeof registry.render !== "function") return "";
    return registry.render(key);
  }

  function figure(key, options) {
    var opts = options || {};
    var item = media(key);
    if (!item) return "";
    var classes = ["media-figure"];
    if (opts.className) classes.push(opts.className);
    var art = item.diagram ? diagram(item.diagram) : "";
    if (art) {
      classes.push("media-figure--diagram");
      return '<figure class="' + classes.join(" ") + '" role="img" aria-label="' +
        esc(opts.alt === false ? "" : item.alt) + '">' + art + "</figure>";
    }
    if (!item.src) return "";
    return '<figure class="' + classes.join(" ") + '">' +
      '<img src="' + esc(item.src) + '" alt="' + esc(opts.alt === false ? "" : item.alt) +
      '" loading="lazy" decoding="async">' +
      "</figure>";
  }

  function orderedProducts() {
    var order = (CFG && CFG.productOrder) || [];
    var rank = {};
    order.forEach(function (slug, index) {
      if (!Object.prototype.hasOwnProperty.call(rank, slug)) rank[slug] = index;
    });
    return C.products.map(function (product, index) {
      var listed = Object.prototype.hasOwnProperty.call(rank, product.slug);
      return { product: product, index: index, rank: listed ? rank[product.slug] : order.length + index };
    }).sort(function (a, b) {
      return a.rank - b.rank || a.index - b.index;
    }).map(function (entry) {
      return entry.product;
    });
  }

  /* One tile anatomy on both grids (VISUAL-GRAMMAR §1.1): an image band over a
     solid body. Text never sits on the photograph — the band carries only the
     platform label and the availability badges, and everything a reader has to
     read is on the solid surface below it. One CTA, because a tile with two
     actions makes the reader choose before they know what the product is. */
  function productTile(product, options) {
    var opts = options || {};
    var facet = facetLabel(product.facet);
    var image = product.hero && product.hero.image;
    var href = "#/products/" + product.slug;

    var chips = [tagChip("pattern", product.category)];

    var outcomes = ((product.tile && product.tile.outcomes) || []).map(function (line) {
      return "<li>" + icon("check") + "<span>" + esc(line) + "</span></li>";
    }).join("");

    var band = '<div class="ptile-band">' +
      (image && image.file
        ? '<img class="ptile-img" src="' + esc(image.file) + '" alt=""' +
          (image.focal ? ' style="object-position:' + esc(image.focal) + '"' : "") +
          (opts.eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') +
          ' decoding="async">'
        : "") +
      '<span class="ptile-veil" aria-hidden="true"></span>' +
      '<span class="ptile-facet" title="' + esc(facet.fullLabel) + '">' + esc(facet.label) + "</span>" +
      badgeRow(product.slug, "ptile-badges") +
      "</div>";

    return '<article class="ptile' + (opts.compact ? " ptile--compact" : "") + ' reveal">' +
      band +
      '<div class="ptile-body">' +
        '<div class="chip-row ptile-chips">' + chips.join("") + "</div>" +
        '<h3 class="ptile-title"><a href="' + esc(href) + '">' + esc(product.name) + "</a></h3>" +
        '<p class="ptile-desc">' + esc(product.oneLiner) + "</p>" +
        (outcomes ? '<ul class="outcome-list ptile-outcomes">' + outcomes + "</ul>" : "") +
        '<p class="ptile-cta">' + linkArrow({ label: "Learn more", href: href }) + "</p>" +
      "</div>" +
      "</article>";
  }

  function card(product, options) {
    var opts = options || {};
    return productTile(product, { compact: true, eager: opts.eager });
  }

  /* ————— case studies —————
     No customer is named and no logo is rendered: a logo is the one element of
     a case study that cannot be anonymized, so the card is built around what
     can — the industry. The medallion sits where the mark used to, at the same
     optical weight. */

  function caseStatus(key) {
    var map = (C.shared && C.shared.caseStudyStatus) || {};
    return map[key] || null;
  }

  function caseMedallion(industry) {
    return '<span class="case-medallion" aria-hidden="true">' + icon("industry-" + industry) + "</span>";
  }

  function caseStatusChip(key) {
    var status = caseStatus(key);
    if (!status) return "";
    return '<span class="case-status case-status--' + esc(key) + '"' +
      attrs({ title: status.tooltip, "aria-label": status.chip + " — " + status.tooltip }) + ">" +
      '<span class="case-status-dot" aria-hidden="true"></span>' + esc(status.chip) + "</span>";
  }

  /* The home-page card (round 11): the industry photograph across the top with
     the customer's descriptor and area set on it in white, then a white body —
     the status chip, one headline figure, the line, the footnote and the link.
     The photograph names the industry, so the medallion stays on the product
     page's callout only. The file is derived from `industry` — the same
     assets/img/industries/<industry>.jpg the Use cases tab shows — so the card
     carries no image key of its own. Rendered from the same objects the product
     pages read, so the two surfaces cannot drift apart. */
  function caseCard(item) {
    if (!item) return "";
    return '<article class="case-card reveal">' +
      '<div class="case-card-band">' +
        '<img class="case-card-img" src="assets/img/industries/' + esc(item.industry) + '.jpg" alt="" loading="lazy" decoding="async">' +
        '<span class="case-card-veil" aria-hidden="true"></span>' +
        '<div class="case-card-title">' +
          '<h3 class="case-descriptor">' + esc(item.descriptor) + "</h3>" +
          '<p class="case-area">' + esc(item.area) + "</p>" +
        "</div>" +
      "</div>" +
      '<div class="case-card-body">' +
        caseStatusChip(item.status) +
        '<div class="case-card-metric">' +
          '<p class="case-figure-value nums">' + esc(item.metric.value) + "</p>" +
          '<p class="case-figure-label">' + esc(item.metric.label) + "</p>" +
        "</div>" +
        '<p class="case-card-line">' + esc(item.line) + "</p>" +
        '<p class="footnote case-card-note">' + esc(item.footnote) + "</p>" +
        (item.product
          ? '<p class="case-card-link">' + linkArrow({
              label: item.product.name, href: "#/products/" + item.product.slug
            }) + "</p>"
          : "") +
      "</div>" +
      "</article>";
  }

  function caseStudyById(id) {
    var list = (C.overview && C.overview.caseStudies) || [];
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  /* ————— modal ————— */

  var modalState = { node: null, lastFocus: null };

  function closeModal() {
    if (!modalState.node) return;
    modalState.node.remove();
    modalState.node = null;
    document.body.style.removeProperty("overflow");
    if (modalState.lastFocus && modalState.lastFocus.focus) modalState.lastFocus.focus();
    modalState.lastFocus = null;
  }

  function openModal(html, options) {
    var opts = options || {};
    closeModal();
    modalState.lastFocus = document.activeElement;
    var backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    if (opts.label) backdrop.setAttribute("aria-label", opts.label);
    backdrop.innerHTML = '<div class="modal-panel' + (opts.className ? " " + esc(opts.className) : "") + '">' +
      '<button class="modal-close" type="button" aria-label="Close">' + icon("close") + "</button>" +
      html + "</div>";
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop || event.target.closest(".modal-close")) closeModal();
    });
    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";
    modalState.node = backdrop;
    var focusable = backdrop.querySelector("input:not([tabindex='-1']), textarea, select") ||
      backdrop.querySelector("button, a");
    if (focusable) focusable.focus();
    return backdrop;
  }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (modalState.node) { closeModal(); return; }
      var menu = document.getElementById("mobile-menu");
      if (menu && !menu.hidden) {
        closeMobileMenu();
        var toggle = document.getElementById("menu-toggle");
        if (toggle) toggle.focus();
      }
      return;
    }
    if (event.key !== "Tab" || !modalState.node) return;
    var items = modalState.node.querySelectorAll(FOCUSABLE);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.UI = {
    esc: esc,
    attrs: attrs,
    icon: icon,
    chip: chip,
    tagChip: tagChip,
    availabilityBadges: availabilityBadges,
    demoHref: demoHref,
    hasDemo: hasDemo,
    links: links,
    badgeRow: badgeRow,
    caseStatusChip: caseStatusChip,
    caseMedallion: caseMedallion,
    caseCard: caseCard,
    caseStudyById: caseStudyById,
    button: button,
    linkArrow: linkArrow,
    divider: divider,
    headline: headline,
    sectionHead: sectionHead,
    empty: emptyState,
    card: card,
    productTile: productTile,
    orderedProducts: orderedProducts,
    media: media,
    figure: figure,
    diagram: diagram,
    facetLabel: facetLabel,
    industryLabel: industryLabel,
    contactCard: contactCard,
    contactSplit: contactSplit,
    sectionLabel: sectionLabel,
    heroBackdrop: heroBackdrop,
    modal: { open: openModal, close: closeModal }
  };

  /* ————— header & footer ————— */

  function renderNav() {
    var links = C.site.nav.map(function (item) {
      return '<a class="nav-link" data-route="' + esc(item.route) + '" href="' + esc(item.route) + '">' +
        esc(item.label) + "</a>";
    }).join("");
    var cta = button({
      label: C.site.navCta.label,
      href: C.site.navCta.route,
      kind: "secondary",
      className: "nav-cta btn--sm"
    });
    document.getElementById("primary-nav").innerHTML = links + cta;
    document.getElementById("mobile-menu").innerHTML = links + cta;
  }

  /* SoftServe's own footer glyphs, as softserveinc.com serves them
     (assets.softserveinc.com/icons/*.svg, read 2026-09-24): their paths and
     viewBoxes, the ink moved to currentColor so site.css sets it. Filled brand
     marks, not the 1.5 px line set — the one deliberate exception, because the
     footer copies softserveinc.com's. Instagram is outlined there too. Drawn
     16 px wide, the height following each viewBox. */
  var SOCIAL_GLYPHS = {
    LinkedIn: ["0 0 18 18", '<path fill-rule="evenodd" clip-rule="evenodd" d="M16.3 0H1.7C0.8 0 0 0.8 0 1.7V16.3C0 17.2 0.8 18 1.7 18H16.3C17.2 18 18 17.2 18 16.3V1.7C18 0.8 17.2 0 16.3 0ZM4.6 3.4C5.4 3.4 5.9 4 5.9 4.7C5.9 5.5 5.4 6 4.6 6C3.8 6 3.3 5.5 3.3 4.7C3.3 4 3.8 3.4 4.6 3.4ZM6 14.6H3.4V6.8H6V14.6ZM15.4 14.6H12.9V10.6C12.9 9.6 12.6 8.9 11.7 8.9C11 8.9 10.6 9.4 10.4 9.8C10.3 10 10.3 10.2 10.3 10.4V14.6H7.7C7.7 14.6 7.7 7.5 7.7 6.8H10.3V7.9C10.6 7.4 11.2 6.7 12.6 6.7C14.3 6.7 15.4 8 15.4 10.3V14.6Z"></path>'],
    YouTube: ["0 0 22 15", '<path fill-rule="evenodd" clip-rule="evenodd" d="M21.0703 1.44622C20.4711 0.394441 19.8474 0.250974 18.5022 0.131454C17.1571 0.0119345 13.8675 0 11.0059 0C8.13217 0 4.81814 -1.75071e-05 3.49743 0.131454C2.17671 0.262926 1.52862 0.394441 0.929403 1.44622C0.33019 2.49799 0 4.31463 0 7.5058C0 10.685 0.317962 12.5138 0.929403 13.5536C1.54084 14.5934 2.15226 14.7488 3.49743 14.8802C4.8426 15.0117 8.13217 14.9997 11.0059 14.9997C13.8675 14.9997 17.1815 14.9997 18.5022 14.8802C19.8229 14.7607 20.4711 14.6053 21.0703 13.5536C21.6695 12.5018 21.9997 10.685 21.9997 7.5058C22.0119 4.31463 21.694 2.46213 21.0703 1.44622ZM8.84146 11.438V3.56167L15.0781 7.5058L8.84146 11.438Z"></path>'],
    Facebook: ["0 0 20 20", '<path d="M20 10.108C20 4.56182 15.4654 0 9.95227 0C4.43913 0 0 4.56182 0 10.108C0 15.102 3.65156 19.3278 8.40096 20V12.9891H5.84727V10.108H8.40096V7.87516C8.40096 5.30613 9.95227 3.9856 12.148 3.9856C13.2458 3.9856 14.3675 4.20169 14.3675 4.20169V6.65067H13.1504C11.9332 6.65067 11.5036 7.41898 11.5036 8.21129V10.108H14.3675L13.9141 12.9891H11.599V20C16.3484 19.2318 20 15.102 20 10.108Z"></path>'],
    Instagram: ["0 0 24 24", '<rect x="4" y="3" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="2"></rect><circle cx="12.5" cy="11.5" r="3.5" fill="none" stroke="currentColor" stroke-width="2"></circle><circle cx="17.5" cy="6.5" r="1" fill="none" stroke="currentColor"></circle>'],
    TikTok: ["0 0 17 20", '<path d="M12.5322 0.760816L12.0576 0H9.18509V6.85231L9.1753 13.5455C9.1802 13.5952 9.18509 13.6499 9.18509 13.6997C9.18509 15.3754 7.84427 16.7429 6.19027 16.7429C4.53627 16.7429 3.19545 15.3804 3.19545 13.6997C3.19545 12.0239 4.53627 10.6564 6.19027 10.6564C6.53282 10.6564 6.86557 10.721 7.17386 10.8304V7.48881C6.85579 7.43411 6.52792 7.40428 6.19027 7.40428C2.77951 7.40925 0 10.2337 0 13.7046C0 17.1755 2.7795 20 6.19516 20C9.61082 20 12.3903 17.1755 12.3903 13.7046V5.74341C13.6284 7.00149 15.2286 8.22974 17 8.62257V5.20636C15.0769 4.34112 13.1635 1.78518 12.5322 0.760816Z"></path>'],
    X: ["0 0 19 15", '<path d="M6.0002 1L14.9002 14H13.0002L4.1002 1H6.0002ZM6.5002 0H2.2002L12.5002 15H16.8002L6.5002 0Z"></path><path d="M2.30029 15H3.70029L16.4003 0H15.2003L2.30029 15Z"></path>'],
    SoundCloud: ["0 0 24 12", '<path d="M14.4 0C12.6713 0 11.04 0.858745 10.08 2.24999V11.9999H20.4C22.3687 11.9999 24 10.3687 24 8.39995C24 6.43121 22.3687 4.79997 20.4 4.79997C20.16 4.79997 19.92 4.84122 19.68 4.88997C19.44 2.15436 17.1844 0 14.4 0ZM8.16 2.39999C7.82437 2.39999 7.48875 2.44124 7.2 2.48999V11.9999H8.16V2.39999ZM8.64 2.39999V11.9999H9.6V2.63999C9.31125 2.54436 8.97563 2.44874 8.64 2.39999ZM6.72 2.63999C6.38437 2.78436 6.04875 2.92873 5.76 3.11998V11.9999H6.72V2.63999ZM5.28 3.50998C4.89563 3.8456 4.56 4.27498 4.32 4.75497V11.9999H5.28V3.50998ZM3.12 5.27997C3.03562 5.2856 2.95125 5.3006 2.88 5.32497V11.9549C3.02437 12.0037 3.21563 11.9999 3.36 11.9999H3.84V5.32497C3.69563 5.27622 3.50437 5.27997 3.36 5.27997C3.28875 5.27997 3.20437 5.27435 3.12 5.27997ZM2.4 5.42997C2.06437 5.52559 1.72875 5.66997 1.44 5.90997V11.3699C1.72875 11.5612 2.06437 11.7543 2.4 11.8499V5.42997ZM0.96 6.28497C0.384375 6.90934 0 7.72871 0 8.63995C0 9.5512 0.384375 10.3706 0.96 10.9949V6.28497Z"></path>'],
    Bluesky: ["0 0 19 17", '<path d="M3.94745 1.54586C6.01111 3.09165 8.23081 6.22587 9.04577 7.90787C9.86079 6.22599 12.0804 3.09162 14.1441 1.54586C15.6331 0.43048 18.0457 -0.432538 18.0457 2.31363C18.0457 2.86208 17.7306 6.92087 17.5457 7.5798C16.9032 9.8707 14.562 10.455 12.4794 10.1014C16.1197 10.7195 17.0458 12.7672 15.0458 14.8148C11.2475 18.7037 9.58657 13.8391 9.16078 12.5926C9.08276 12.3641 9.04625 12.2572 9.04571 12.3481C9.04517 12.2572 9.00867 12.3641 8.93065 12.5926C8.50504 13.8391 6.84412 18.7038 3.04561 14.8148C1.04564 12.7672 1.97167 10.7194 5.61206 10.1014C3.52941 10.455 1.18812 9.87069 0.545709 7.5798C0.360862 6.92081 0.0457153 2.86202 0.0457153 2.31363C0.0457153 -0.432538 2.45849 0.43048 3.94745 1.54586Z"></path>']
  };

  function socialGlyph(label) {
    var glyph = SOCIAL_GLYPHS[label];
    if (!glyph) return "";
    var box = glyph[0].split(" ");
    return '<svg class="social-glyph" viewBox="' + glyph[0] + '" width="16" height="' +
      Math.round(160 * box[3] / box[2]) / 10 + '" fill="currentColor" aria-hidden="true" focusable="false">' +
      glyph[1] + "</svg>";
  }

  /* softserveinc.com's footer, cut down (Alex, 2026-09-24): a link row — text
     links on the left, the social glyphs on the right, no frame — over a
     copyright row with the SoftServe spark. No hot links, no office address,
     no partner marks. The dash separators are the brand's own. */
  function renderFooter() {
    var f = C.site.footer;
    var links = [];
    if (f.sellersLink) links.push('<a href="' + esc(f.sellersLink.route) + '">' + esc(f.sellersLink.label) + "</a>");
    f.legalLinks.concat(f.siteLink ? [f.siteLink] : []).forEach(function (item) {
      links.push('<a href="' + esc(item.url) + '" target="_blank" rel="noopener">' + esc(item.label) + "</a>");
    });
    var linkRow = links.map(function (link, i) {
      return "<li>" + link + (i < links.length - 1 ? '<span class="footer-sep" aria-hidden="true">&nbsp;-&nbsp;</span>' : "") + "</li>";
    }).join("");
    var social = f.social.map(function (item) {
      return '<li><a class="social-link" href="' + esc(item.url) + '" target="_blank" rel="noopener" aria-label="' +
        esc(item.label) + '">' + socialGlyph(item.label) + "</a></li>";
    }).join("");

    document.getElementById("site-footer").innerHTML =
      '<div class="wrap">' +
        '<div class="footer-bar">' +
          '<ul class="footer-links">' + linkRow + "</ul>" +
          '<ul class="social-row" aria-label="' + esc(f.socialLabel) + '">' + social + "</ul>" +
        "</div>" +
        '<div class="footer-copy">' +
          "<p>" + esc(f.copyright.replace("{year}", String(new Date().getFullYear()))) + "</p>" +
          '<img class="footer-mark" src="' + window.brandAsset("ssSparkWhite", "assets/img/softserve-star-white.svg") +
            '" alt="" width="24" height="27" loading="lazy" decoding="async">' +
        "</div>" +
      "</div>";
  }

  /* ————— router ————— */

  var ROUTES = [
    { pattern: /^\/$/, page: "overview", params: function () { return {}; } },
    { pattern: /^\/products$/, page: "products", params: function () { return {}; } },
    { pattern: /^\/products\/([^/]+)$/, page: "product", params: function (m) { return { slug: m[1] }; } },
    { pattern: /^\/products\/([^/]+)\/([^/]+)$/, page: "product", params: function (m) { return { slug: m[1], tab: m[2] }; } },
    { pattern: /^\/services$/, page: "services", params: function () { return {}; } },
    { pattern: /^\/sellers$/, page: "sellers", params: function () { return {}; } }
  ];

  function decodePart(value) {
    try { return decodeURIComponent(String(value).replace(/\+/g, " ")); }
    catch (error) { return String(value); }
  }

  var forcedHash = null;
  function currentHash() {
    return forcedHash !== null ? forcedHash : window.location.hash;
  }

  function parseHash() {
    var raw = currentHash().replace(/^#/, "");
    if (!raw) raw = "/";
    var anchorIndex = raw.indexOf("#");
    var anchor = "";
    if (anchorIndex >= 0) {
      anchor = raw.slice(anchorIndex + 1);
      raw = raw.slice(0, anchorIndex);
    }
    var query = {};
    var queryIndex = raw.indexOf("?");
    if (queryIndex >= 0) {
      raw.slice(queryIndex + 1).split("&").forEach(function (pair) {
        if (!pair) return;
        var eq = pair.indexOf("=");
        var key = decodePart(eq < 0 ? pair : pair.slice(0, eq));
        query[key] = eq < 0 ? "" : decodePart(pair.slice(eq + 1));
      });
      raw = raw.slice(0, queryIndex);
    }
    if (!raw) raw = "/";
    if (raw.length > 1) raw = raw.replace(/\/+$/, "");
    return { path: raw || "/", anchor: anchor, query: query };
  }

  function matchRoute(path) {
    for (var i = 0; i < ROUTES.length; i += 1) {
      var found = path.match(ROUTES[i].pattern);
      if (found) {
        var params = ROUTES[i].params(found);
        params.path = path;
        return { page: ROUTES[i].page, params: params };
      }
    }
    return null;
  }

  function notFound() {
    return '<section class="wrap route-note">' +
      '<p class="eyebrow eyebrow--accent">Page not found</p>' +
      '<h1 class="h1">NOTHING <span class="accent">HERE</span></h1>' +
      '<p class="lead">That address does not match a page on this site.</p>' +
      '<div class="cta-row">' +
        button({ label: "Back to the home page", href: "#/", kind: "secondary" }) +
        button({ label: "Browse the products", href: "#/products", kind: "quiet" }) +
      "</div></section>";
  }

  function setActiveNav(path) {
    var base = path === "/" ? "#/" : (path.indexOf("/products") === 0 ? "#/products" : "#" + path);
    var links = document.querySelectorAll(".nav-link");
    Array.prototype.forEach.call(links, function (link) {
      var isActive = link.getAttribute("data-route") === base;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
    });
  }

  /* A hero background, video poster, tile image or panel photograph that cannot
     be fetched falls back to the gradient or the ground behind it alone, never
     to a broken-image glyph or a grey placeholder. The two home-page photograph
     grounds (the two ways in, the case-card bands) are dark, so their white
     copy still reads without the picture. YouTube has maxresdefault.jpg only for videos uploaded above
     720p; for the rest it answers 200 with a 120x90 grey stand-in rather than a
     404, so size is the only honest test. A poster retries hqdefault.jpg, which
     always exists for a real video, before it goes. */
  var YT_PLACEHOLDER_W = 120;

  function guardHeroImages(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".hero-bg-img, .video-card-poster, .contact-photo-img, .ptile-img, .gtile-art, .way-img, .case-card-img"), function (img) {
      var retried = false;

      function isYouTube() { return (img.getAttribute("src") || "").indexOf("img.youtube.com/") >= 0; }
      function drop() { if (img.parentNode) img.parentNode.removeChild(img); }

      function fail() {
        var src = img.getAttribute("src") || "";
        if (!retried && isYouTube() && src.indexOf("maxresdefault") >= 0) {
          retried = true;
          img.setAttribute("src", src.replace("maxresdefault", "hqdefault"));
          return;
        }
        drop();
      }

      function settle() {
        if (!img.naturalWidth) { fail(); return; }
        if (isYouTube() && img.naturalWidth <= YT_PLACEHOLDER_W) fail();
      }

      if (img.complete) { settle(); return; }
      img.addEventListener("error", fail);
      img.addEventListener("load", settle);
    });
  }

  var revealObserver = null;

  function initReveal(root) {
    var nodes = root.querySelectorAll(".reveal");
    if (!nodes.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nodes, function (node) { node.classList.add("is-in"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    }
    Array.prototype.forEach.call(nodes, function (node) { revealObserver.observe(node); });
    window.setTimeout(function () {
      Array.prototype.forEach.call(nodes, function (node) { node.classList.add("is-in"); });
    }, 1400);
  }

  var lastKey = null;

  function render() {
    try { renderInner(); }
    catch (error) {
      var appEl = document.getElementById("app");
      if (appEl) appEl.innerHTML = '<section class="container" style="padding:6rem 0"><h2 class="section-title">This page could not be displayed</h2><p>Reload the page or <a href="#/">return to the overview</a>.</p></section>';
      if (window.console) console.error(error);
    }
  }

  function renderInner() {
    var parsed = parseHash();
    var matched = matchRoute(parsed.path);
    var app = document.getElementById("app");
    closeModal();

    var key = matched ? matched.page + ":" + (matched.params.slug || "") : "404:" + parsed.path;
    var sameView = key === lastKey;

    if (!matched || typeof window.PAGES[matched.page] !== "function") {
      app.innerHTML = notFound();
      document.title = "Page not found — " + C.site.title;
    } else {
      var params = matched.params;
      params.anchor = parsed.anchor;
      params.query = parsed.query;
      app.innerHTML = window.PAGES[matched.page](params);
      var page = window.PAGES[matched.page];
      if (typeof page.mount === "function") page.mount(params, app);
      if (typeof page.title === "function") document.title = page.title(params);
      else document.title = C.site.title;
    }

    setActiveNav(parsed.path);
    guardHeroImages(app);
    initReveal(app);
    closeMobileMenu();

    if (parsed.anchor) {
      var target = document.getElementById(parsed.anchor);
      if (target) {
        var startedAt = window.pageYOffset;
        var scrollToAnchor = function (force) {
          var top = target.getBoundingClientRect().top + window.pageYOffset - 96;
          var smooth = !force && sameView && !document.hidden &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: top, behavior: smooth ? "smooth" : "instant" });
        };
        scrollToAnchor();
        window.requestAnimationFrame(function () { scrollToAnchor(); });
        window.setTimeout(function () {
          if (Math.abs(window.pageYOffset - startedAt) < 2) scrollToAnchor(true);
        }, 700);
      }
    } else if (!sameView) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    lastKey = key;
  }

  /* ————— header behaviour ————— */

  function closeMobileMenu() {
    var menu = document.getElementById("mobile-menu");
    var toggle = document.getElementById("menu-toggle");
    if (!menu || !toggle) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function initHeader() {
    var masthead = document.getElementById("masthead") || document.querySelector(".masthead") || document.querySelector("header");
    var toggle = document.getElementById("menu-toggle") || document.querySelector(".menu-toggle");
    var menu = document.getElementById("mobile-menu") || document.querySelector(".mobile-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.hidden;
        menu.hidden = !open;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });

      menu.addEventListener("click", function (event) {
        if (event.target.closest("a")) closeMobileMenu();
      });
    }

    var onScroll = function () {
      if (masthead) masthead.classList.toggle("is-scrolled", window.pageYOffset > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initHashLinks() {
    document.addEventListener("click", function (event) {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
      if (!link || link.id === "skip-link" || link.hasAttribute("target")) return;
      var href = link.getAttribute("href");
      if (!href || href === "#") return;
      event.preventDefault();
      event.stopPropagation();
      var sameHash = currentHash() === href;
      window.ROUTER.go(href);
      if (sameHash && href.indexOf("#", 1) < 0 && link.classList.contains("nav-link")) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }, true);
  }

  /* The Demo badge is an action (VISUAL-GRAMMAR §1.2). On the product page the
     hero frame is already there, so the badge scrolls to it and opens it; on a
     product page with no frame — round 9: a product can carry a walkthrough and
     no video, which is how Cross-system ERP Q&A came to have a demo and no way
     in from the badge — it opens the walkthrough itself; on a tile it goes to
     the page that carries both. */
  function initDemoBadges() {
    document.addEventListener("click", function (event) {
      var badge = event.target.closest ? event.target.closest("[data-demo-badge]") : null;
      if (!badge) return;
      event.preventDefault();
      var slug = badge.getAttribute("data-demo-badge");
      var onProductPage = parseHash().path === "/products/" + slug;
      var frame = document.querySelector(".product-hero .video-card");
      if (frame && onProductPage) {
        var top = frame.getBoundingClientRect().top + window.pageYOffset - 120;
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: Math.max(top, 0), behavior: reduce ? "instant" : "smooth" });
        frame.click();
        return;
      }
      if (onProductPage) {
        /* links.json, like the hero button: config.js has held no walkthrough
           link since round 12, so reading it here opened nothing (round 18). */
        var href = demoHref(links(slug));
        if (href) { window.open(href, "_blank", "noopener"); return; }
      }
      window.ROUTER.go("#/products/" + slug);
    });
  }

  function initSkipLink() {
    var link = document.getElementById("skip-link");
    var app = document.getElementById("app");
    if (!link || !app) return;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      app.setAttribute("tabindex", "-1");
      app.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  window.ROUTER = {
    go: function (hash) {
      if (currentHash() === hash) { render(); return; }
      forcedHash = null;
      try { window.location.hash = hash; } catch (error) { }
      window.setTimeout(function () {
        if (window.location.hash === hash) return;
        try { window.history.pushState(null, "", hash); } catch (error) { }
        forcedHash = hash;
        render();
      }, 60);
    },
    current: parseHash,
    render: render
  };

  window.PAGES = window.PAGES || {};

  document.documentElement.classList.add("js-reveal");
  renderNav();
  renderFooter();
  initHeader();
  initHashLinks();
  initDemoBadges();
  initSkipLink();
  window.addEventListener("hashchange", function () { forcedHash = null; render(); });
  window.addEventListener("popstate", function () { forcedHash = null; render(); });
  render();
})();
