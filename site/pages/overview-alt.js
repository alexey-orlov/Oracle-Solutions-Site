(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  /* The alternative home page, at #/alt (Alex, 2026-09-29), kept beside the
     live one until he picks. It is the live home page with three changes:

     S1, the hero, is one dark screen. A photograph carries the H1 and the two
     actions, after softserveinc.com/en-us/services, with one line and the
     spark in the dark gap between the copy and the oval of light. The
     photograph dissolves into a solid ground of its own darkest tone, and the
     promise and the three figures sit there. It stops short of the viewport,
     so S2's heading shows under it.

     S2 keeps the live page's two photographic panels, under the umbrella
     heading, with a new photograph on the products panel (the hero carries
     the oval now).

     "Why SoftServe on Oracle" gains the portfolio diagram on its left, the
     three reasons on its right: products beside services, the services split
     into packaged and bespoke, all built on Oracle's platforms.

     Everything else is rendered by overview.js and taken whole, so the two
     versions cannot drift while they are compared. Adopting this page moves
     hero() and diagram() into overview.js and retires this file
     (PROVENANCE §47). */

  var BASE = "#/alt";

  /* The glyphs the diagram needs beyond the shared set, in its style: a 24
     box, a 1.5 px line. */
  var GLYPHS = {
    workshop: '<rect x="4" y="4" width="16" height="11" rx="1"></rect><path d="M12 15v5M8.5 20h7"></path>',
    plus: '<path d="M12 5.5v13M5.5 12h13"></path>'
  };

  function glyph(name) {
    var UI = window.UI;
    if (!GLYPHS[name]) return UI.icon(name);
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + GLYPHS[name] + "</svg>";
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
        /* Everything pictorial sits in one layer, which dissolves into the
           hero's solid ground at its foot; the words are outside it. */
        '<div class="ahero-media" aria-hidden="true">' +
          (image.file
            ? '<img class="ahero-img" src="' + UI.esc(image.file) + '" alt="" decoding="async" fetchpriority="high">'
            : "") +
          '<span class="ahero-scrim"></span>' +
          /* One line in the dark gap between the copy and the oval, the spark
             on it, turned to the line's angle in mount(). Up to 768 px the
             oval sits further right and the narrow line follows it. */
          '<svg class="ahero-line" viewBox="0 0 100 100" preserveAspectRatio="none">' +
            '<line class="ahero-line-desk" x1="54" y1="100" x2="66" y2="0"></line>' +
            '<line class="ahero-line-narrow" x1="70" y1="100" x2="86" y2="0"></line>' +
          "</svg>" +
          '<img class="ahero-spark" src="' + UI.esc(spark) + '" alt="" width="135" height="154" decoding="async">' +
        "</div>" +
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

  /* ————— the portfolio diagram ————— */

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

  /* The whole offer in one picture. One SoftServe mark heads the two things
     SoftServe sells, side by side: the products (the six groups in their
     home-tile fills) and the services, split in two, the packaged track (five
     outlined steps on a line, the managed one dashed) over the bespoke team
     (three pods and an open one, the team that grows). Under both, "Built
     on" and the Oracle card with Oracle's mark and its four platforms, AI
     Data Platform first (Alex). Light grounds only; nothing in it is a
     control. It is hidden from assistive technology, and one sentence says
     the same. */
  function diagram(C) {
    var UI = window.UI;
    var copy = (C.overviewAlt || {}).diagram || {};
    var families = (C.shared && C.shared.tagFamilies) || {};
    var patternIcons = (families.pattern && families.pattern.icons) || {};
    var techIcons = (families.tech && families.tech.icons) || {};
    var steps = (C.overview.delivery || {}).steps || [];
    var stageIcons = copy.stageIcons || [];
    var stack = C.overview.hero.stack;

    var groups = (C.facets.categories || []).map(function (category) {
      return '<li class="amap-bar amap-bar--' + UI.esc(category.tone) + '">' +
        UI.icon(patternIcons[category.id]) +
        '<span class="amap-bar-name">' + UI.esc(category.full) + "</span>" +
        "</li>";
    }).join("");

    var stages = steps.map(function (step, index) {
      var last = index === steps.length - 1;
      return '<li class="amap-step">' +
        node(28, last, glyph(stageIcons[index] || "dot")) +
        '<span class="amap-step-name">' + UI.esc(step.title) +
          (last && copy.optionalNote ? ' <span class="amap-optional">' + UI.esc(copy.optionalNote) + "</span>" : "") +
        "</span>" +
        "</li>";
    }).join("");

    var pods = [0, 1, 2].map(function () {
      return "<li>" + node(36, false, glyph("users")) + "</li>";
    }).join("") + "<li>" + node(36, true, glyph("plus")) + "</li>";

    /* The platforms in the diagram's own order, any the order does not name
       after it, so a platform added to the site still shows. */
    var order = copy.platformOrder || [];
    var technology = (C.facets.technology || []).slice().sort(function (a, b) {
      var ia = order.indexOf(a.id), ib = order.indexOf(b.id);
      return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
    });
    var platforms = technology.map(function (facet) {
      return '<li class="amap-chip">' +
        UI.icon(techIcons[facet.id]) +
        '<span class="amap-chip-name">' + UI.esc(facet.label) + "</span>" +
        "</li>";
    }).join("");

    var ssMark = window.brandAsset("ssMark", "assets/img/softserve-wordmark-white.svg");
    var oracleMark = window.brandAsset("oracleMark", "assets/img/oracle-wordmark-white.svg");

    return '<p class="sr-only">' + UI.esc(copy.ariaLabel) + "</p>" +
      '<div class="amap" aria-hidden="true">' +
        '<div class="amap-head">' +
          '<img class="amap-mark amap-mark--softserve" src="' + UI.esc(ssMark) + '" alt="" width="96" height="16" decoding="async">' +
          '<p class="amap-caption">' + UI.esc(copy.softserveCaption) + "</p>" +
        "</div>" +
        '<div class="amap-split">' +
          '<div class="amap-panel amap-panel--products">' +
            '<p class="amap-label">' + UI.esc(copy.productsLabel) + "</p>" +
            '<ul class="amap-bars">' + groups + "</ul>" +
          "</div>" +
          '<div class="amap-panel amap-panel--services">' +
            '<p class="amap-label">' + UI.esc(copy.servicesLabel) + "</p>" +
            '<div class="amap-sub amap-sub--packaged">' +
              '<p class="amap-sublabel">' + UI.esc(copy.packagedLabel) + "</p>" +
              '<ol class="amap-steps">' + stages + "</ol>" +
            "</div>" +
            '<div class="amap-sub amap-sub--bespoke">' +
              '<p class="amap-sublabel">' + UI.esc(copy.bespokeLabel) + "</p>" +
              '<div class="amap-pods-row">' +
                '<ul class="amap-pods">' + pods + "</ul>" +
                '<p class="amap-pods-caption">' + UI.esc(copy.bespokeCaption) + "</p>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<p class="amap-builton">' + UI.icon("arrowDown") + "<span>" + UI.esc(copy.builtOn) + "</span>" + UI.icon("arrowDown") + "</p>" +
        '<div class="amap-oracle">' +
          '<div class="amap-head">' +
            '<img class="amap-mark amap-mark--oracle" src="' + UI.esc(oracleMark) + '" alt="" width="84" height="11" decoding="async">' +
            '<p class="amap-caption">' + UI.esc(copy.oracleCaption) + "</p>" +
          "</div>" +
          '<p class="amap-label">' + UI.esc(stack.platformsLabel) + "</p>" +
          '<ul class="amap-chips">' + platforms + "</ul>" +
        "</div>" +
      "</div>";
  }

  /* ————— the live page, with S2 and the Why screen adjusted ————— */

  /* overview.js renders the whole live page. Its hero and its proof strip
     (both now the alt hero) come out; S2 takes the umbrella heading and the
     products panel's new photograph; the Why screen takes the diagram on its
     left and keeps its three reasons on its right. */
  function liveScreens(C, params) {
    var template = document.createElement("template");
    template.innerHTML = window.PAGES.overview(params);
    var root = template.content;

    ["section.home-hero", "section.stat-band--home"].forEach(function (selector) {
      var node = root.querySelector(selector);
      if (node) node.parentNode.removeChild(node);
    });

    var offer = (C.overviewAlt || {}).offer || {};
    var s2 = root.querySelector("section#two-ways");
    if (s2) {
      s2.classList.add("aoffer");
      var title = s2.querySelector(".home-head .h2");
      if (title && offer.title) title.textContent = offer.title;
      var productsImage = s2.querySelector(".way--photo .way-img");
      if (productsImage && offer.productsImage && offer.productsImage.file) {
        productsImage.setAttribute("src", offer.productsImage.file);
        productsImage.style.objectPosition = offer.productsImage.focal || "";
      }
    }

    var why = root.querySelector("section#why-softserve .deliver-why");
    if (why) {
      var reasons = why.querySelector(".pillars");
      var grid = document.createElement("div");
      grid.className = "awhy-grid";
      var map = document.createElement("div");
      map.className = "awhy-map";
      map.innerHTML = diagram(C);
      var side = document.createElement("div");
      side.className = "awhy-reasons";
      if (reasons) side.appendChild(reasons);
      grid.appendChild(map);
      grid.appendChild(side);
      why.appendChild(grid);
      why.classList.add("awhy");
    }

    var holder = document.createElement("div");
    holder.appendChild(root);
    return holder.innerHTML;
  }

  function overviewAlt(params) {
    var C = window.SITE_CONTENT;
    return hero(C) + liveScreens(C, params);
  }

  /* The spark glyph's long axis stands 25.5 degrees off vertical; the line
     runs between two fixed points of the photograph, so its angle changes
     with the photograph's shape. The spark is turned by the difference on
     every resize, so glyph and line always read as one mark. */
  var sparkObserver = null;

  function alignSpark(photo) {
    var spark = photo.querySelector(".ahero-spark");
    var line = Array.prototype.filter.call(photo.querySelectorAll(".ahero-line line"), function (candidate) {
      return window.getComputedStyle(candidate).display !== "none";
    })[0];
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
