(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  /* The alternative home page, at #/alt (Alex, 2026-09-29), kept beside the
     live one until he picks. Its first two screens are re-cut; everything
     after them is the live home page's own.

     Version 2, after Alex's review of the first cut, designed afresh:

     S1 is a photograph that carries only the H1 and the two actions, after
     softserveinc.com/en-us/services, with one line and the spark in the dark
     gap between the copy and the oval of light. Under it, a light band holds
     the promise and the three figures, after the stats band under the
     brand's AI-page hero. Photograph and band stop short of the viewport, so
     S2's heading shows under them.

     S2 is the whole offer: the two ways in as photographic tiles, stacked on
     the left, beside a compact diagram of the portfolio on the right, its
     lanes in the tiles' order: the SoftServe card (products, then the
     packaged and bespoke services), then the Oracle card they are built on.

     The screens after S2 are rendered by overview.js and taken whole, so the
     two versions cannot drift while they are compared. Adopting this page
     moves hero() and offer() into overview.js and retires this file
     (PROVENANCE §47). */

  var BASE = "#/alt";

  /* The glyphs the diagram needs beyond the shared set, in its style: a 24
     box, a 1.5 px line. */
  var GLYPHS = {
    workshop: '<rect x="4" y="4" width="16" height="11" rx="1"></rect><path d="M12 15v5M8.5 20h7"></path>',
    upDown: '<path d="M12 3.5v17M8 7.5l4-4 4 4M8 16.5l4 4 4-4"></path>',
    plus: '<path d="M12 5.5v13M5.5 12h13"></path>'
  };

  function glyph(name) {
    var UI = window.UI;
    if (!GLYPHS[name]) return UI.icon(name);
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + GLYPHS[name] + "</svg>";
  }

  /* The home page's screen head, as overview.js draws it. */
  function head(opts) {
    var UI = window.UI;
    return '<div class="home-head">' +
      (opts.eyebrow ? '<p class="eyebrow eyebrow--accent">' + UI.esc(opts.eyebrow) + "</p>" : "") +
      '<h2 class="h2">' + UI.esc(opts.title) + "</h2>" +
      "</div>";
  }

  /* ————— S1: the claim on a photograph, the promise and the proof under it ————— */

  function hero(C) {
    var UI = window.UI;
    var block = C.overview.hero;
    var image = ((C.overviewAlt || {}).hero || {}).image || {};
    var ctas = block.ctas || [];
    var primary = ctas.filter(function (cta) { return cta.kind === "primary"; })[0] || ctas[0];
    var secondary = ctas.filter(function (cta) { return cta !== primary; })[0];

    /* The one ask is the brand's ask on a dark ground, a white button; the
       second route is an arrow link beside it. */
    var actions = (primary
      ? UI.button({ label: primary.label, href: primary.route, kind: "dark", iconAfter: "arrow", className: "ahero-primary" })
      : "") +
      (secondary ? UI.linkArrow({ label: secondary.label, href: secondary.route, className: "ahero-link" }) : "");

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
      '<div class="ahero-photo">' +
        (image.file
          ? '<img class="ahero-img" src="' + UI.esc(image.file) + '" alt="" decoding="async" fetchpriority="high">'
          : "") +
        '<span class="ahero-scrim" aria-hidden="true"></span>' +
        /* One line in the dark gap between the copy and the oval, the spark
           on it, turned to the line's angle in mount(). */
        '<svg class="ahero-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
          '<line x1="54" y1="100" x2="66" y2="0"></line>' +
        "</svg>" +
        '<img class="ahero-spark" src="' + UI.esc(spark) + '" alt="" width="135" height="154" decoding="async" aria-hidden="true">' +
        '<div class="wrap ahero-inner">' +
          '<div class="ahero-copy">' +
            '<h1 class="h1 ahero-title">' +
              '<span class="ahero-sentence">' + UI.esc(block.headline.lead) + "</span> " +
              '<span class="ahero-sentence accent">' + UI.esc(block.headline.accent) + "</span> " +
              '<span class="ahero-sentence">' + UI.esc(block.headline.proof) + "</span>" +
            "</h1>" +
            '<div class="ahero-actions">' + actions + "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="ahero-band">' +
        '<div class="wrap ahero-band-inner">' +
          '<div class="ahero-promise">' +
            '<span class="ahero-dash" aria-hidden="true"></span>' +
            '<p class="ahero-lead">' + UI.esc(block.lead) + "</p>" +
          "</div>" +
          (stats ? '<ul class="ahero-stats">' + stats + "</ul>" : "") +
        "</div>" +
      "</div>" +
      "</section>";
  }

  /* ————— S2: the whole offer ————— */

  /* A way in, as the live S2 words it, on its own photograph. */
  function wayTile(panel, image) {
    var UI = window.UI;
    var bullets = (panel.bullets || []).map(function (line) {
      return "<li>" + UI.icon("check") + "<span>" + UI.esc(line) + "</span></li>";
    }).join("");
    var picture = image && image.file
      ? '<img class="away-img" src="' + UI.esc(image.file) + '" alt=""' +
          (image.focal ? ' style="object-position:' + UI.esc(image.focal) + '"' : "") +
          ' loading="lazy" decoding="async">' +
        '<span class="away-scrim" aria-hidden="true"></span>'
      : "";
    return '<div class="away away--' + UI.esc(panel.id) + '">' +
      picture +
      '<h3 class="away-title">' + UI.esc(panel.title) + "</h3>" +
      '<p class="away-body">' + UI.esc(panel.body) + "</p>" +
      '<ul class="tick-list away-list">' + bullets + "</ul>" +
      '<p class="away-cta">' + UI.linkArrow({
        label: panel.cta.label,
        href: panel.cta.route,
        icon: panel.cta.direction === "down" ? "arrowDown" : "arrow"
      }) + "</p>" +
      "</div>";
  }

  /* A group's name breaks where its home tile breaks it, before its last
     word; an ampersand holds to the word before it. */
  function groupName(name) {
    var UI = window.UI;
    var cut = name.lastIndexOf(" ");
    var lines = cut === -1 ? [name] : [name.slice(0, cut), name.slice(cut + 1)];
    return lines.map(function (line) {
      return UI.esc(line).replace(/ &amp;/g, " &amp;");
    }).join("<br>");
  }

  /* An outlined chip: an octagon with 4 px cuts drawn as a path, so the
     stroke follows the cut corners (a clipped border would lose them), and
     dashed where the thing it stands for is optional or still to come. */
  function node(size, dashed, inner) {
    var s = size, c = 4, h = .75;
    var d = "M" + c + " " + h + "H" + (s - c) + "L" + (s - h) + " " + c + "V" + (s - c) +
      "L" + (s - c) + " " + (s - h) + "H" + c + "L" + h + " " + (s - c) + "V" + c + "Z";
    return '<span class="amap-node amap-node--' + s + (dashed ? " amap-node--dashed" : "") + '">' +
      '<svg class="amap-node-shape" viewBox="0 0 ' + s + " " + s + '" aria-hidden="true"><path d="' + d + '"></path></svg>' +
      inner +
      "</span>";
  }

  /* The portfolio in one picture, beside the two tiles and in their order:
     the SoftServe card (one SoftServe mark over its three lanes: the product
     groups in their home-tile fills, the packaged track as outlined steps on
     a line, the bespoke pods with an open one that says the team grows),
     then the Oracle card it is all built on, in Lviv blue 50. Light grounds
     only; nothing in it is a control. The picture is hidden from assistive
     technology and one sentence says the same. */
  function diagram(C) {
    var UI = window.UI;
    var copy = (((C.overviewAlt || {}).offer || {}).diagram) || {};
    var stack = C.overview.hero.stack;
    var families = (C.shared && C.shared.tagFamilies) || {};
    var patternIcons = (families.pattern && families.pattern.icons) || {};
    var techIcons = (families.tech && families.tech.icons) || {};
    var steps = (C.overview.delivery || {}).steps || [];
    var stageIcons = copy.stageIcons || [];

    var groups = (C.facets.categories || []).map(function (category) {
      return '<li class="amap-chip amap-chip--' + UI.esc(category.tone) + '">' +
        UI.icon(patternIcons[category.id]) +
        '<span class="amap-chip-name">' + groupName(category.full) + "</span>" +
        "</li>";
    }).join("");

    var stages = steps.map(function (step, index) {
      var last = index === steps.length - 1;
      return '<li class="amap-stage">' +
        node(28, last, glyph(stageIcons[index] || "dot")) +
        '<span class="amap-stage-name">' + UI.esc(step.title) +
          (last && copy.optionalNote ? ' <span class="amap-optional">' + UI.esc(copy.optionalNote) + "</span>" : "") +
        "</span>" +
        "</li>";
    }).join("");

    var pods = [0, 1, 2].map(function () {
      return "<li>" + node(36, false, glyph("users")) + "</li>";
    }).join("") + "<li>" + node(36, true, glyph("plus")) + "</li>";

    var platforms = (C.facets.technology || []).map(function (facet) {
      return '<li class="amap-chip amap-chip--platform">' +
        UI.icon(techIcons[facet.id]) +
        '<span class="amap-chip-name">' + UI.esc(facet.label) + "</span>" +
        "</li>";
    }).join("");

    var ssMark = window.brandAsset("ssMark", "assets/img/softserve-wordmark-white.svg");
    var oracleMark = window.brandAsset("oracleMark", "assets/img/oracle-wordmark-white.svg");

    return '<div class="amap" aria-hidden="true">' +
      '<div class="amap-card amap-card--softserve">' +
        '<div class="amap-head">' +
          '<img class="amap-mark amap-mark--softserve" src="' + UI.esc(ssMark) + '" alt="" width="96" height="16" decoding="async">' +
          '<p class="amap-caption">' + UI.esc(copy.softserveCaption) + "</p>" +
        "</div>" +
        '<div class="amap-lane amap-lane--products">' +
          '<p class="amap-label">' + UI.esc(copy.productsLabel) + "</p>" +
          '<ul class="amap-chips amap-chips--products">' + groups + "</ul>" +
        "</div>" +
        '<p class="amap-link">' + glyph("upDown") + "<span>" + UI.esc(copy.link) + "</span></p>" +
        '<div class="amap-lane amap-lane--packaged">' +
          '<p class="amap-label">' + UI.esc(copy.packagedLabel) + "</p>" +
          '<ol class="amap-track">' + stages + "</ol>" +
        "</div>" +
        '<div class="amap-lane amap-lane--bespoke">' +
          '<p class="amap-label">' + UI.esc(copy.bespokeLabel) + "</p>" +
          '<div class="amap-pods-row">' +
            '<ul class="amap-pods">' + pods + "</ul>" +
            '<p class="amap-pods-caption">' + UI.esc(copy.bespokeCaption) + "</p>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<p class="amap-builton"><span>' + UI.esc(copy.builtOn) + "</span>" + UI.icon("arrowDown") + "</p>" +
      '<div class="amap-card amap-card--oracle">' +
        '<div class="amap-head">' +
          '<img class="amap-mark amap-mark--oracle" src="' + UI.esc(oracleMark) + '" alt="" width="84" height="11" decoding="async">' +
          '<p class="amap-caption">' + UI.esc(copy.oracleCaption) + "</p>" +
        "</div>" +
        '<p class="amap-label">' + UI.esc(stack.platformsLabel) + "</p>" +
        '<ul class="amap-chips amap-chips--platforms">' + platforms + "</ul>" +
      "</div>" +
      "</div>";
  }

  function offer(C) {
    var UI = window.UI;
    var block = C.overview.twoWays;
    var copy = (C.overviewAlt || {}).offer || {};
    var images = copy.images || {};
    var tiles = (block.panels || []).map(function (panel) {
      return wayTile(panel, images[panel.id]);
    }).join("");

    return '<section class="section home-screen aoffer" id="two-ways"><div class="wrap">' +
      head({ eyebrow: block.eyebrow, title: copy.title || block.title }) +
      '<p class="sr-only">' + UI.esc((copy.diagram || {}).ariaLabel) + "</p>" +
      '<div class="aoffer-grid">' + tiles + diagram(C) + "</div>" +
      "</div></section>";
  }

  /* ————— the screens after S2: the live home page's own ————— */

  /* overview.js renders the whole live page; its hero, its proof strip (now
     the hero's band) and its S2 come out, and the rest stays as rendered. */
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

  /* The spark glyph's long axis stands 25.5 degrees off vertical; the line
     runs between two fixed points of the photograph, so its angle changes
     with the photograph's shape. The spark is turned by the difference on
     every resize, so glyph and line always read as one mark. */
  var sparkObserver = null;

  function alignSpark(photo) {
    var spark = photo.querySelector(".ahero-spark");
    var line = photo.querySelector(".ahero-line line");
    if (!spark || !line) return;
    var box = photo.getBoundingClientRect();
    var dx = (Number(line.getAttribute("x2")) - Number(line.getAttribute("x1"))) / 100 * box.width;
    var dy = (Number(line.getAttribute("y1")) - Number(line.getAttribute("y2"))) / 100 * box.height;
    if (!dy) return;
    var degrees = Math.atan2(dx, dy) * 180 / Math.PI;
    spark.style.setProperty("--spark-turn", (degrees - 25.5).toFixed(2) + "deg");
  }

  overviewAlt.mount = function (params, root) {
    if (typeof window.PAGES.overview.mount === "function") window.PAGES.overview.mount(params, root);
    var photo = root.querySelector(".ahero-photo");
    if (sparkObserver) sparkObserver.disconnect();
    if (!photo) return;
    alignSpark(photo);
    if ("ResizeObserver" in window) {
      sparkObserver = new ResizeObserver(function () { alignSpark(photo); });
      sparkObserver.observe(photo);
    }
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
