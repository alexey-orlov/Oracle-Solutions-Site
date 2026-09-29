(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  /* The alternative home page, at #/alt (Alex, 2026-09-29), kept beside the
     live one until he picks. Its first two screens are re-cut; everything
     after them is the live home page's own.

     S1 is a photographic hero after softserveinc.com/en-us/services: the
     claim set large in white on a dark photograph, crossed by the brand's
     hairline and spark, with the proof strip at its foot. It is held short of
     the viewport, so the next screen shows under it.

     S2 is the whole offer on one screen. The built-on diagram leaves the hero
     and joins the two ways in: the products and the services stand side by
     side, each block over its own layer, and both stand on the Oracle
     foundation that spans the two.

     The screens after S2 are rendered by overview.js and taken whole, so the
     two versions cannot drift while they are compared. Adopting this page
     moves hero() and offer() into overview.js and retires this file
     (PROVENANCE §47). */

  var BASE = "#/alt";

  /* The home page's screen head, as overview.js draws it. */
  function head(opts) {
    var UI = window.UI;
    return '<div class="home-head">' +
      (opts.eyebrow ? '<p class="eyebrow eyebrow--accent">' + UI.esc(opts.eyebrow) + "</p>" : "") +
      '<h2 class="h2">' + UI.esc(opts.title) + "</h2>" +
      (opts.lead ? '<p class="lead home-head-lead">' + UI.esc(opts.lead) + "</p>" : "") +
      "</div>";
  }

  /* ————— S1: the claim, on a photograph ————— */

  /* The live hero's words, unchanged: its eyebrow, three-sentence H1, lead,
     two buttons and three figures. What changes is the setting. The hairline
     runs edge to edge under the H1 and the spark sits on it where a second
     line crosses at the brand's own angle, the long axis of the spark's
     glyph, so the two read as one mark (softserveinc.com draws the same
     crossing into its hero photographs). The figures sit under the hairline,
     beside the lead, so the proof is still read before the first scroll. */
  function hero(C) {
    var UI = window.UI;
    var block = C.overview.hero;
    var image = ((C.overviewAlt || {}).hero || {}).image || {};

    var ctas = (block.ctas || []).map(function (cta) {
      return UI.button({
        label: cta.label, href: cta.route,
        kind: cta.kind === "primary" ? "primary" : "secondary"
      });
    }).join("");

    var stats = (block.stats || []).map(function (stat) {
      var prefix = stat.prefix
        ? '<span class="ahero-stat-prefix">' + UI.esc(stat.prefix) + "</span>"
        : "";
      return '<li class="ahero-stat">' +
        '<p class="ahero-stat-value nums">' + prefix + "<span>" + UI.esc(stat.value) + "</span></p>" +
        '<p class="ahero-stat-label">' + UI.esc(stat.label) + "</p>" +
        "</li>";
    }).join("");

    var spark = window.brandAsset("ssSparkWhite", "assets/img/softserve-star-white.svg");

    return '<section class="ahero" id="top">' +
      (image.file
        ? '<img class="ahero-img" src="' + UI.esc(image.file) + '" alt="" decoding="async" fetchpriority="high">'
        : "") +
      '<span class="ahero-scrim" aria-hidden="true"></span>' +
      '<div class="wrap ahero-inner">' +
        '<p class="eyebrow ahero-eyebrow">' + UI.esc(block.eyebrow) + "</p>" +
        '<h1 class="h1 ahero-title">' +
          '<span class="ahero-line">' + UI.esc(block.headline.lead) + "</span> " +
          '<span class="ahero-line accent">' + UI.esc(block.headline.accent) + "</span> " +
          '<span class="ahero-line">' + UI.esc(block.headline.proof) + "</span>" +
        "</h1>" +
        '<div class="ahero-rule" aria-hidden="true">' +
          '<span class="ahero-cross">' +
            '<span class="ahero-diag"></span>' +
            '<img class="ahero-spark" src="' + UI.esc(spark) + '" alt="" width="135" height="154" decoding="async">' +
          "</span>" +
        "</div>" +
        '<div class="ahero-foot">' +
          '<div class="ahero-copy">' +
            '<p class="lead ahero-lead">' + UI.esc(block.lead) + "</p>" +
            '<div class="cta-row ahero-cta">' + ctas + "</div>" +
          "</div>" +
          (stats ? '<ul class="ahero-stats">' + stats + "</ul>" : "") +
        "</div>" +
      "</div>" +
      "</section>";
  }

  /* ————— S2: the whole offer ————— */

  /* The two ways in, as the live S2 words them, without their photographs:
     the photograph now carries the hero, and the diagram under each block is
     its picture. Both CTAs sit on one baseline, as they did. */
  function wayBlock(panel) {
    var UI = window.UI;
    var bullets = (panel.bullets || []).map(function (line) {
      return "<li>" + UI.icon("check") + "<span>" + UI.esc(line) + "</span></li>";
    }).join("");
    return '<div class="ablock ablock--' + UI.esc(panel.id) + '">' +
      '<h3 class="ablock-title">' + UI.esc(panel.title) + "</h3>" +
      '<p class="body-text ablock-body">' + UI.esc(panel.body) + "</p>" +
      '<ul class="tick-list ablock-list">' + bullets + "</ul>" +
      '<p class="ablock-cta">' + UI.linkArrow({
        label: panel.cta.label,
        href: panel.cta.route,
        icon: panel.cta.direction === "down" ? "arrowDown" : "arrow"
      }) + "</p>" +
      "</div>";
  }

  /* A layer's owner, as the hero stack labelled it: the words, then the mark
     of the company it belongs to. The marks are the ink files, turned white
     by the stylesheet on the black panels. */
  function owner(label, mark, width, height) {
    var UI = window.UI;
    return '<p class="apanel-owner">' +
      '<span class="apanel-label">' + UI.esc(label) + "</span>" +
      '<img class="apanel-mark" src="' + UI.esc(mark) + '" alt="" width="' + width + '" height="' + height + '" decoding="async">' +
      "</p>";
  }

  /* One short line per tile column, from a panel's foot to the foundation:
     the products and the services both run on the Oracle platforms. */
  function links(positions) {
    return '<svg class="alinks" viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true">' +
      positions.map(function (x) {
        return '<path class="alink" d="M' + x + ' 0V16"></path>';
      }).join("") +
      "</svg>";
  }

  /* The diagram's three layers, recoloured after softserveinc.com's Offers
     band: each SoftServe layer is a black panel, the six product groups in
     their own home-tile fills (a group keeps its colour wherever it
     appears), the four services as white tiles numbered in their order, and
     the Oracle platforms as the black foundation under both. Everything in
     it is hidden from assistive technology; the stack's one label says the
     same in a sentence. */
  function offer(C) {
    var UI = window.UI;
    var block = C.overview.twoWays;
    var copy = (C.overviewAlt || {}).offer || {};
    var stack = C.overview.hero.stack;
    var families = (C.shared && C.shared.tagFamilies) || {};
    var patternIcons = (families.pattern && families.pattern.icons) || {};
    var techIcons = (families.tech && families.tech.icons) || {};
    var panels = block.panels || [];
    var productsPanel = panels.filter(function (p) { return p.id === "products"; })[0] || panels[0];
    var servicesPanel = panels.filter(function (p) { return p.id === "practice"; })[0] || panels[1];

    var ssMark = window.brandAsset("ssMark", "assets/img/softserve-wordmark-white.svg");
    var oracleMark = window.brandAsset("oracleMark", "assets/img/oracle-wordmark-white.svg");

    var groupTiles = (C.facets.categories || []).map(function (category, index) {
      return '<li class="atile atile--' + UI.esc(category.tone) + '" style="--i:' + index + '">' +
        '<span class="atile-mark">' + UI.icon(patternIcons[category.id]) + "</span>" +
        '<span class="atile-name">' + UI.esc(category.full) + "</span>" +
        "</li>";
    }).join("");

    var serviceTiles = (((stack.services || {}).items) || []).map(function (item, index) {
      return '<li class="atile atile--service" style="--i:' + index + '">' +
        '<span class="atile-top">' +
          '<span class="atile-index nums">' + UI.esc(String(index + 1)) + "</span>" +
          '<span class="atile-mark">' + UI.icon(item.icon) + "</span>" +
        "</span>" +
        '<span class="atile-name">' + UI.esc(item.name) + "</span>" +
        "</li>";
    }).join("");

    /* Every canonical platform, as the stack drew them: what the practice
       builds on, not what the catalog filters by. */
    var platforms = (C.facets.technology || []).map(function (facet, index) {
      return '<li class="aplat" style="--i:' + index + '">' +
        UI.icon(techIcons[facet.id]) +
        '<span class="aplat-name">' + UI.esc(facet.label) + "</span>" +
        "</li>";
    }).join("");

    return '<section class="section home-screen aoffer" id="two-ways"><div class="wrap">' +
      head({ eyebrow: block.eyebrow, title: copy.title || block.title, lead: copy.lead }) +
      '<p class="sr-only">' + UI.esc(stack.ariaLabel) + "</p>" +
      '<div class="aoffer-grid reveal">' +
        wayBlock(productsPanel) +
        '<div class="apanel apanel--products" aria-hidden="true">' +
          owner(stack.productsLabel, ssMark, 80, 14) +
          '<ul class="atiles atiles--products">' + groupTiles + "</ul>" +
        "</div>" +
        '<div class="alinks-cell alinks-cell--products">' + links([18, 50, 82]) + "</div>" +
        wayBlock(servicesPanel) +
        '<div class="apanel apanel--services" aria-hidden="true">' +
          owner((stack.services || {}).label, ssMark, 80, 14) +
          '<ol class="atiles atiles--services">' + serviceTiles + "</ol>" +
        "</div>" +
        '<div class="alinks-cell alinks-cell--services">' + links([26, 74]) + "</div>" +
        '<div class="abase" aria-hidden="true">' +
          owner(stack.platformsLabel, oracleMark, 77, 10) +
          '<ul class="aplats">' + platforms + "</ul>" +
        "</div>" +
      "</div>" +
      "</div></section>";
  }

  /* ————— the screens after S2: the live home page's own ————— */

  /* overview.js renders the whole live page; its hero, its proof strip (now
     the hero's foot) and its S2 come out, and the rest stays as rendered. */
  function liveScreens(params) {
    var template = document.createElement("template");
    template.innerHTML = window.PAGES.overview(params);
    ["section.home-hero", "section.stat-band--home", "section#two-ways"].forEach(function (selector) {
      var node = template.content.querySelector(selector);
      if (node) node.parentNode.removeChild(node);
    });
    var holder = document.createElement("div");
    holder.appendChild(template.content);
    return holder.innerHTML;
  }

  function overviewAlt(params) {
    var C = window.SITE_CONTENT;
    return hero(C) + offer(C) + liveScreens(params);
  }

  /* The live page's own wiring: the contact switch at its foot. */
  overviewAlt.mount = function (params, root) {
    if (typeof window.PAGES.overview.mount === "function") window.PAGES.overview.mount(params, root);
  };

  overviewAlt.title = function () { return window.SITE_CONTENT.site.title; };

  /* While this page is open, a link into a home screen ("#/#products", the
     header's Services and Talk to us) lands on the same screen of this page
     rather than on the live one, so the version being judged is the one
     scrolled through. This listener is added before the router's (this file
     loads first), so the router never sees the click it re-routes. */
  document.addEventListener("click", function (event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest ? event.target.closest('a[href^="#/#"]') : null;
    if (!link || link.hasAttribute("target") || !window.ROUTER) return;
    if (window.ROUTER.current().path !== "/alt") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.ROUTER.go(BASE + link.getAttribute("href").slice(2));
  }, true);

  window.PAGES.overviewAlt = overviewAlt;
})();
