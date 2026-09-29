(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  /* The home page (Alex, 2026-09-29: "We are ready to move 'alt' page and
     set it as main"), first built as the alternative at #/alt, which now
     lands on #/. It is round 18's home page, rendered by overview.js, with
     three changes:

     S1, the hero, carries the H1, its promise and the two actions on the
     left, and on the right a white robot among people under a warm sky
     (Alex, 2026-09-29: "robots and people ... ai automation bundled with
     humans"; PROVENANCE §60). The three figures sit under it on white, in
     the live page's own proof strip (Alex: "same or similar to how they are
     placed on the current main"), so the strip shows under the hero on a
     laptop.

     S2 keeps the live page's two ways in, under the umbrella heading, as
     dark tiles after softserveinc.com's Solutions tile: the picture across
     the tile's top at its own proportions, dissolving into black, and the
     words on the black under it, never on the picture (home-alt.css). The
     products tile takes a new picture, since the hero carries the oval now.

     "Why SoftServe on Oracle" gains the portfolio diagram on its left, the
     three reasons on its right: packaged services over the products, bespoke
     services beside both, all on Oracle's platforms.

     Everything else is rendered by overview.js and taken whole. Folding
     hero() and diagram() into overview.js, and home-alt.css into site.css,
     retires this file; until then the router's "home" is this page wherever
     it is loaded, and overview.js alone where it is not (the archive). */

  /* The glyphs the diagram needs beyond the shared set, in its style: a 24
     box, a 1.5 px line. */
  var GLYPHS = {
    workshop: '<rect x="4" y="4" width="16" height="11" rx="1"></rect><path d="M12 15v5M8.5 20h7"></path>',
    plus: '<path d="M12 5.5v13M5.5 12h13"></path>',
    /* The three kinds of pod (Alex, 2026-09-29): one person each, with what
       the pod brings at the shoulder: the spark for AI, a database for data,
       a mortarboard for enablement. */
    "pod-ai": '<circle cx="9" cy="9.5" r="3.2"></circle><path d="M3 20.5a6 6 0 0 1 12 0"></path><path d="M18 3l1.1 2.9L22 7l-2.9 1.1L18 11l-1.1-2.9L14 7l2.9-1.1z"></path>',
    "pod-data": '<circle cx="9" cy="9.5" r="3.2"></circle><path d="M3 20.5a6 6 0 0 1 12 0"></path><ellipse cx="18.5" cy="4.6" rx="3" ry="1.2"></ellipse><path d="M15.5 4.6v5.6c0 .66 1.34 1.2 3 1.2s3-.54 3-1.2V4.6"></path><path d="M15.5 7.4c0 .66 1.34 1.2 3 1.2s3-.54 3-1.2"></path>',
    "pod-enablement": '<circle cx="9" cy="9.5" r="3.2"></circle><path d="M3 20.5a6 6 0 0 1 12 0"></path><path d="M14.4 5.6 18.2 3.8 22 5.6l-3.8 1.8z"></path><path d="M16.2 6.5v2.6c0 .6.9 1.1 2 1.1s2-.5 2-1.1V6.5"></path>'
  };

  function glyph(name) {
    var UI = window.UI;
    if (!GLYPHS[name]) return UI.icon(name);
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + GLYPHS[name] + "</svg>";
  }

  /* ————— S1: the claim, its promise and the ask on a photograph ————— */

  function hero(C) {
    var UI = window.UI;
    var block = C.overview.hero;
    var alt = (C.overviewAlt || {}).hero || {};
    var image = alt.image || {};
    /* This page's own H1 and lead (Alex's cut), the live page's otherwise. */
    var headline = alt.headline || block.headline;
    var lead = alt.lead || block.lead;
    var ctas = block.ctas || [];
    var primary = ctas.filter(function (cta) { return cta.kind === "primary"; })[0] || ctas[0];
    var secondary = ctas.filter(function (cta) { return cta !== primary; })[0];

    /* The one ask is the site's blue button on the light hero; the second
       route is an arrow link beside it. */
    var actions = (primary
      ? UI.button({ label: primary.label, href: primary.route, kind: "primary", iconAfter: "arrow", className: "ahero-primary" })
      : "") +
      (secondary ? UI.linkArrow({ label: secondary.label, href: secondary.route, className: "ahero-link" }) : "");

    return '<section class="ahero" id="top">' +
      '<div class="ahero-photo">' +
        /* The picture's sky and the scene, in one layer behind the words
           (home-alt.css); under 1024 px the scene stacks above them. */
        '<div class="ahero-media" aria-hidden="true">' +
          (image.file
            ? '<img class="ahero-img" src="' + UI.esc(image.file) + '" alt="" width="2400" height="1352" decoding="async" fetchpriority="high">'
            : "") +
        "</div>" +
        '<div class="wrap ahero-inner">' +
          /* The claim, its promise, then the ask: the reader has the reason
             before the button, as on softserveinc.com's own heroes. */
          '<div class="ahero-copy">' +
            '<h1 class="h1 ahero-title">' +
              '<span class="ahero-sentence">' + UI.esc(headline.lead) + "</span> " +
              '<span class="ahero-sentence accent">' + UI.esc(headline.accent) + "</span> " +
              '<span class="ahero-sentence">' + UI.esc(headline.proof) + "</span>" +
            "</h1>" +
            /* "fast-track" stays whole on a phone. */
            '<p class="ahero-lead">' + UI.keepCompounds(lead) + "</p>" +
            '<div class="ahero-actions">' + actions + "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "</section>";
  }

  /* ————— the portfolio diagram ————— */

  /* An outlined chip: an octagon with 4 px cuts drawn as a path, so the
     stroke follows the cut corners (a clipped border would lose them), and
     dashed where the thing it stands for is optional or still to come. The
     stroke keeps its width when the chip is drawn larger than its box. */
  function octagon(w, h) {
    var c = 4, e = .75;
    return "M" + c + " " + e + "H" + (w - c) + "L" + (w - e) + " " + c + "V" + (h - c) +
      "L" + (w - c) + " " + (h - e) + "H" + c + "L" + e + " " + (h - c) + "V" + c + "Z";
  }

  /* A fitted chip takes its box's shape, not a square: fitNodes() redraws its
     outline at its own size, so the cuts stay 4 px on any proportion. */
  function node(size, dashed, inner, fit) {
    var s = size;
    return '<span class="amap-node' + (dashed ? " amap-node--dashed" : "") + (fit ? " amap-node--fit" : "") + '">' +
      '<svg class="amap-node-shape" viewBox="0 0 ' + s + " " + s + '"' + (fit ? ' preserveAspectRatio="none"' : "") +
        ' aria-hidden="true"><path d="' + octagon(s, s) + '"></path></svg>' +
      inner +
      "</span>";
  }

  function fitNodes(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".amap-node--fit"), function (el) {
      var w = el.clientWidth, h = el.clientHeight;
      var svg = el.querySelector(".amap-node-shape");
      if (!w || !h || !svg) return;
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.firstChild.setAttribute("d", octagon(w, h));
    });
  }

  /* One block of the diagram: its name, its line of two to four words, and
     its picture. */
  function mapBlock(key, words, picture) {
    var UI = window.UI;
    return '<div class="amap-block amap-block--' + key + '">' +
      '<p class="amap-name">' + UI.esc(words.name) + "</p>" +
      '<p class="amap-line">' + UI.esc(words.line) + "</p>" +
      '<div class="amap-pic">' + picture + "</div>" +
      "</div>";
  }

  /* The whole offer in one picture, in Alex's layout: two layers, each a box
     with its company's mark inside it. SoftServe's holds the packaged
     services over the products on the left and the bespoke services beside
     both on the right; Oracle's, under it, holds the four platforms. Each
     SoftServe block says what it is in a name and one short line and shows
     the rest: the packaged services a run of steps (the last dashed: managed
     services are optional), the products the six groups as tiles in their
     own fills and icons, the bespoke services a team of pods with an open
     one (it grows). What the pictures stand for is listed on the
     screens around this one, so the diagram names none of it (Alex:
     "overloaded with text"). Light grounds; nothing in it is a control. It is
     hidden from assistive technology, and one sentence says the same. */
  function diagram(C) {
    var UI = window.UI;
    var copy = (C.overviewAlt || {}).diagram || {};
    var families = (C.shared && C.shared.tagFamilies) || {};
    var patternIcons = (families.pattern && families.pattern.icons) || {};
    var techIcons = (families.tech && families.tech.icons) || {};
    var steps = (C.overview.delivery || {}).steps || [];
    var stageIcons = copy.stageIcons || [];

    /* The six groups, each in its home tile's fill with its icon. */
    var tiles = '<ul class="amap-tiles">' + (C.facets.categories || []).map(function (category) {
      return '<li class="amap-tile amap-tile--' + UI.esc(category.tone) + '">' + UI.icon(patternIcons[category.id]) + "</li>";
    }).join("") + "</ul>";

    var flow = '<ol class="amap-flow">' + steps.map(function (step, index) {
      var last = index === steps.length - 1;
      return (index ? '<li class="amap-arrow' + (last ? " amap-arrow--dashed" : "") + '"></li>' : "") +
        '<li class="amap-step">' + node(36, last, glyph(stageIcons[index] || "dot")) + "</li>";
    }).join("") + "</ol>";

    /* Alex's sketch (2026-09-29, "too many pods ... looks like a swarm"): a
       governance block across the top, then five pods of three kinds, AI,
       data and enablement, three by two, the last place the open one that
       adds more. Three rows of one height, as he drew them. */
    var team = copy.team || {};
    var pods = '<div class="amap-team">' +
      '<div class="amap-gov">' +
        node(48, false, glyph(team.governanceIcon || "shield") +
          '<span class="amap-gov-label">' + UI.esc(team.governance || "") + "</span>", true) +
      "</div>" +
      '<ul class="amap-pods">' + (team.pods || []).map(function (kind) {
        return '<li class="amap-pod amap-pod--' + UI.esc(kind) + '">' + node(48, false, glyph("pod-" + kind), true) + "</li>";
      }).join("") + '<li class="amap-pod amap-pod--open">' + node(48, true, glyph("plus"), true) + "</li></ul>" +
      "</div>";

    /* The platforms in the diagram's own order, any the order does not name
       after it, so a platform added to the site still shows. */
    var order = copy.platformOrder || [];
    var technology = (C.facets.technology || []).slice().sort(function (a, b) {
      var ia = order.indexOf(a.id), ib = order.indexOf(b.id);
      return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
    });
    var platforms = technology.map(function (facet) {
      return '<li class="amap-chip">' + UI.icon(techIcons[facet.id]) + "<span>" + UI.esc(facet.label) + "</span></li>";
    }).join("");

    var ssMark = window.brandAsset("ssMark", "assets/img/softserve-wordmark-white.svg");
    var oracleMark = window.brandAsset("oracleMark", "assets/img/oracle-wordmark-white.svg");

    return '<p class="sr-only">' + UI.esc(copy.ariaLabel) + "</p>" +
      '<div class="amap" aria-hidden="true">' +
        '<div class="amap-layer amap-layer--softserve">' +
          '<img class="amap-mark amap-mark--softserve" src="' + UI.esc(ssMark) + '" alt="" width="96" height="16" decoding="async">' +
          '<div class="amap-grid">' +
            mapBlock("packaged", copy.packaged || {}, flow) +
            mapBlock("products", copy.products || {}, tiles) +
            mapBlock("bespoke", copy.bespoke || {}, pods) +
          "</div>" +
        "</div>" +
        '<div class="amap-layer amap-layer--oracle">' +
          '<img class="amap-mark amap-mark--oracle" src="' + UI.esc(oracleMark) + '" alt="" width="84" height="11" decoding="async">' +
          '<ul class="amap-chips">' + platforms + "</ul>" +
        "</div>" +
      "</div>";
  }

  /* ————— the live page, with S2 and the Why screen adjusted ————— */

  /* overview.js renders the whole live page. Its hero comes out (the alt hero
     takes its place) and its proof strip stays, so the figures under the
     hero are the live page's own on both versions; S2 takes the umbrella
     heading and the products tile's new picture, and home-alt.css re-lays
     its two tiles; the Why screen takes the diagram on its left and keeps
     its three reasons on its right. */
  function liveScreens(C, params) {
    var template = document.createElement("template");
    template.innerHTML = window.PAGES.overview(params);
    var root = template.content;

    var liveHero = root.querySelector("section.home-hero");
    if (liveHero) liveHero.parentNode.removeChild(liveHero);

    var offer = (C.overviewAlt || {}).offer || {};
    var s2 = root.querySelector("section#two-ways");
    if (s2) {
      s2.classList.add("aoffer");
      var title = s2.querySelector(".home-head .h2");
      if (title && offer.title) title.textContent = offer.title;
      /* Both tiles take this page's own pictures (products, then services),
         the careers site's, upscaled so a 2x screen never draws them past
         their pixels (PROVENANCE §62). */
      var images = s2.querySelectorAll(".way--photo .way-img");
      [offer.productsImage, offer.servicesImage].forEach(function (image, index) {
        if (!images[index] || !image || !image.file) return;
        images[index].setAttribute("src", image.file);
        images[index].style.objectPosition = image.focal || "";
      });
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

  var mapObserver = null;

  overviewAlt.mount = function (params, root) {
    if (typeof window.PAGES.overview.mount === "function") window.PAGES.overview.mount(params, root);
    var map = root.querySelector(".amap");
    if (mapObserver) mapObserver.disconnect();
    if (map) {
      fitNodes(map);
      if ("ResizeObserver" in window) {
        mapObserver = new ResizeObserver(function () { fitNodes(map); });
        mapObserver.observe(map);
      }
    }
  };

  overviewAlt.title = function () { return window.SITE_CONTENT.site.title; };

  window.PAGES.overviewAlt = overviewAlt;
  window.PAGES.home = overviewAlt;
})();
