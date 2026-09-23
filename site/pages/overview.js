(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  /* The home page is seven screens, each one content-sized and separated from
     the next by a hairline: the offer, the two ways in, the catalogue, the
     delivery model, the proof, who builds it, and the way to start. Every
     screen opens on the same head — an accent eyebrow, an H2, an optional lead
     and an optional link at the right — so a reader always knows which of the
     seven they are in. */

  /* One grid, so the right-hand link sits on the H2's own baseline rather than
     wherever the lead happens to stop wrapping: eyebrow and lead span both
     columns, the H2 takes the first and the link the second. */
  function head(opts) {
    var UI = window.UI;
    return '<div class="home-head' + (opts.link ? " home-head--split" : "") + '">' +
      '<p class="eyebrow eyebrow--accent">' + UI.esc(opts.eyebrow) + "</p>" +
      '<h2 class="h2">' + UI.esc(opts.title) + "</h2>" +
      (opts.lead ? '<p class="lead home-head-lead">' + UI.esc(opts.lead) + "</p>" : "") +
      (opts.link ? '<p class="home-head-link">' + UI.linkArrow(opts.link) + "</p>" : "") +
      "</div>";
  }

  /* ————— S1: the offer, and what it is built on ————— */

  /* Three bands, drawn as peers of identical height and read from the bottom
     up: Oracle's platforms, the SoftServe product groups built on them, the
     SoftServe services that prove, integrate and scale them. The connectors
     draw in on load, which is the one thing a static diagram cannot say — that
     the foundation comes first. Everything inside is hidden from assistive
     technology; the frame carries one label that says the same in a sentence. */

  function stackLinks(position) {
    return '<svg class="bo-links bo-links--' + position + '" viewBox="0 0 100 16" ' +
      'preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="bo-link" d="M20 0V16"></path>' +
      '<path class="bo-link" d="M50 0V16"></path>' +
      '<path class="bo-link" d="M80 0V16"></path>' +
      "</svg>";
  }

  /* One tile anatomy for all three bands: a glyph in its well, the name under
     it. The name sits at the foot of the tile so the rows align across a band
     however long a name wraps, and the three bands read as one solid block. */
  function stackTile(icon, name, modifier) {
    var UI = window.UI;
    return '<li class="bo-tile' + (modifier ? " bo-tile--" + modifier : "") + '">' +
      '<span class="bo-tile-mark">' + UI.icon(icon) + "</span>" +
      '<span class="bo-tile-name">' + UI.esc(name) + "</span>" +
      "</li>";
  }

  function stackVisual(C) {
    var UI = window.UI;
    var stack = C.overview.hero.stack;
    var families = (C.shared && C.shared.tagFamilies) || {};
    var patternIcons = (families.pattern && families.pattern.icons) || {};
    var techIcons = (families.tech && families.tech.icons) || {};
    var ssMark = '<img class="bo-owner-mark" src="' +
      window.brandAsset("ssMark", "assets/img/softserve-wordmark-white.svg") +
      '" alt="" width="80" height="14" decoding="async">';

    var serviceTiles = (((stack.services || {}).items) || []).map(function (item) {
      return stackTile(item.icon, item.name, "service");
    }).join("");

    /* Derived, so the middle band can never name a group the catalog does not
       have: one tile per facets.categories entry, in the site's own order. */
    var groupTiles = (C.facets.categories || []).map(function (category) {
      return stackTile(patternIcons[category.id], category.full, "group");
    }).join("");

    /* The bottom band is every canonical platform in canonical order — the one
       "Oracle AI for Fusion Applications" the catalog does not filter on
       included: the stack says what the practice builds on, not what a filter
       would return. Tile names are the short labels. */
    var platformTiles = (C.facets.technology || []).map(function (facet) {
      return stackTile(techIcons[facet.id], facet.label, "platform");
    }).join("");

    return '<div class="bo reveal" role="img" aria-label="' + UI.esc(stack.ariaLabel) + '">' +
      '<div class="bo-band bo-band--services" aria-hidden="true">' +
        '<p class="bo-owner">' +
          '<span class="bo-owner-label">' + UI.esc(stack.services.label) + "</span>" + ssMark +
        "</p>" +
        '<ul class="bo-tiles bo-tiles--4">' + serviceTiles + "</ul>" +
      "</div>" +
      stackLinks("upper") +
      '<div class="bo-band bo-band--products" aria-hidden="true">' +
        '<p class="bo-owner">' +
          '<span class="bo-owner-label">' + UI.esc(stack.productsLabel) + "</span>" + ssMark +
        "</p>" +
        '<ul class="bo-tiles bo-tiles--6">' + groupTiles + "</ul>" +
      "</div>" +
      stackLinks("lower") +
      '<div class="bo-band bo-band--oracle" aria-hidden="true">' +
        '<p class="bo-owner">' +
          '<span class="bo-owner-label">' + UI.esc(stack.platformsLabel) + "</span>" +
          '<img class="bo-owner-mark" src="' + window.brandAsset("oracleMark", "assets/img/oracle-wordmark-white.svg") + '" ' +
            'alt="" width="77" height="10" decoding="async">' +
        "</p>" +
        '<ul class="bo-tiles bo-tiles--4">' + platformTiles + "</ul>" +
      "</div>" +
      "</div>";
  }

  function hero(C) {
    var UI = window.UI;
    var block = C.overview.hero;
    var ctas = (block.ctas || []).map(function (cta) {
      return UI.button({
        label: cta.label, href: cta.route,
        kind: cta.kind === "primary" ? "primary" : "secondary"
      });
    }).join("");

    return '<section class="home-hero has-hero-bg" id="top">' +
      '<span class="hero-glow" aria-hidden="true"></span>' +
      '<div class="wrap home-hero-inner">' +
        '<div class="home-hero-copy">' +
          '<p class="eyebrow">' + UI.esc(block.eyebrow) + "</p>" +
          /* Three sentences, three lines: what we build, what it is built on,
             what it is worth. Only the middle one is the page's accent. */
          '<h1 class="h1 home-title">' +
            '<span class="home-title-lead">' + UI.esc(block.headline.lead) + "</span> " +
            '<span class="accent home-title-accent">' + UI.esc(block.headline.accent) + "</span> " +
            '<span class="home-title-proof">' + UI.esc(block.headline.proof) + "</span>" +
          "</h1>" +
          '<p class="lead home-lead">' + UI.esc(block.lead) + "</p>" +
          '<div class="cta-row hero-cta">' + ctas + "</div>" +
        "</div>" +
        '<div class="home-hero-visual">' + stackVisual(C) + "</div>" +
      "</div>" +
      "</section>";
  }

  /* The proof strip sits directly under the hero, in the band the other pages
     use for the same job, so the figures are the first thing under the claim
     rather than a section of their own. The row carries its own modifier: the
     strip is read as one band of equal columns, which is a different count from
     the strip the practice page runs. */
  function statBand(C) {
    var UI = window.UI;
    var stats = (C.overview.hero.stats || []).map(function (stat) {
      /* The optional prefix is set small beside the figure — "from 30 days" is
         one fact, so it is one line, not a figure with a caption above it. */
      var prefix = stat.prefix
        ? '<span class="stat-prefix">' + UI.esc(stat.prefix) + "</span>"
        : "";
      return '<li class="stat">' +
        '<p class="stat-value nums">' + prefix + "<span>" + UI.esc(stat.value) + "</span></p>" +
        '<p class="stat-label">' + UI.esc(stat.label) + "</p>" +
        "</li>";
    }).join("");
    if (!stats) return "";
    return '<section class="stat-band stat-band--home">' +
      '<div class="wrap"><ul class="stat-row stat-row--band stat-row--home">' + stats + "</ul></div>" +
      "</section>";
  }

  /* ————— S2: the two ways in ————— */

  /* Two peer panels: the products and the practice are one offer read two
     ways, and a reader has to be able to take either without feeling they have
     chosen against the other. Both CTAs land on the same baseline because both
     are equally available. Round 11 (Alex): each panel is a photograph with its
     copy on it — the half-width form of softserveinc.com's photo bands — so the
     image and its focal point come from the panel's data, the scrim sits over
     the image, and the copy sits over both. The image is decorative (alt=""):
     the copy says what the panel offers; `image.alt` describes the picture for
     the docs. The shared `.way` classes stay as the Services page renders them;
     `--photo` is what turns them into photographs here. */
  function twoWays(C) {
    var UI = window.UI;
    var block = C.overview.twoWays;

    var panels = (block.panels || []).map(function (panel) {
      var bullets = (panel.bullets || []).map(function (line) {
        return "<li>" + UI.icon("check") + "<span>" + UI.esc(line) + "</span></li>";
      }).join("");
      var image = panel.image && panel.image.file
        ? '<img class="way-img" src="' + UI.esc(panel.image.file) + '" alt=""' +
            (panel.image.focal ? ' style="object-position:' + UI.esc(panel.image.focal) + '"' : "") +
            ' loading="lazy" decoding="async">' +
          '<span class="way-scrim" aria-hidden="true"></span>'
        : "";
      return '<div class="way way--photo">' +
        image +
        '<span class="way-mark" aria-hidden="true">' + UI.icon(panel.icon) + "</span>" +
        '<h3 class="h4 way-title">' + UI.esc(panel.title) + "</h3>" +
        '<p class="body-text way-body">' + UI.esc(panel.body) + "</p>" +
        '<ul class="tick-list way-list">' + bullets + "</ul>" +
        '<p class="way-cta">' + UI.linkArrow({
          label: panel.cta.label,
          href: panel.cta.route,
          icon: panel.cta.direction === "down" ? "arrowDown" : "arrow"
        }) + "</p>" +
        "</div>";
    }).join("");

    return '<section class="section home-screen" id="two-ways"><div class="wrap">' +
      head({ eyebrow: block.eyebrow, title: block.title }) +
      '<div class="ways ways--photo reveal">' + panels + "</div>" +
      "</div></section>";
  }

  /* ————— S3: the products, one tile per group ————— */

  /* A reader looking for a job to fix meets six groups, not a list of product
     names: the picture says what the software looks like, the line says what
     the group does to someone with no context, and the whole tile is the link
     into the catalog filtered to that group. Text never sits on the image
     (VISUAL-GRAMMAR §1.1), and the tile carries one action, which is itself. */
  function groupTiles(C) {
    var UI = window.UI;
    var block = C.overview.catalog;

    var tiles = (C.facets.categories || []).map(function (category) {
      return '<a class="gtile reveal" href="#/products?cat=' + UI.esc(category.id) + '">' +
        '<span class="gtile-band">' +
          (category.image
            ? '<img class="gtile-img" src="' + UI.esc(category.image) + '" alt="" loading="lazy" decoding="async">'
            : "") +
        "</span>" +
        '<span class="gtile-body">' +
          '<span class="gtile-name">' + UI.esc(category.full) + "</span>" +
          '<span class="gtile-line small">' + UI.esc(category.line) + "</span>" +
          '<span class="gtile-foot">' + UI.icon("arrow", "gtile-arrow") + "</span>" +
        "</span>" +
        "</a>";
    }).join("");

    return '<section class="section home-screen" id="products"><div class="wrap">' +
      head({
        eyebrow: block.eyebrow,
        title: block.title,
        lead: block.lead,
        link: { label: block.cta.label, href: block.cta.route }
      }) +
      '<div class="gtiles">' + tiles + "</div>" +
      "</div></section>";
  }

  /* ————— S4: how we deliver ————— */

  /* Three steps on one horizontal track, each ending on the one fact a reader
     wants from it — duration, and for the first step the price as well. The
     caveat sits under the track, in the same block as the figures it qualifies.
     The three reasons to pick this team are peers beside the ladder, not a
     fourth step in it. */
  function delivery(C) {
    var UI = window.UI;
    var block = C.overview.delivery;

    var steps = (block.steps || []).map(function (step, index) {
      return '<div class="ladder3-step">' +
        '<span class="ladder3-dot" aria-hidden="true"></span>' +
        '<span class="ladder3-index nums">' + UI.esc(String(index + 1)) + "</span>" +
        '<h3 class="ladder3-title">' + UI.esc(step.title) + "</h3>" +
        '<p class="ladder3-body small">' + UI.esc(step.body) + "</p>" +
        '<div class="ladder3-fact">' +
          '<p class="ladder3-fact-label">' + UI.esc(step.factLabel) + "</p>" +
          '<p class="ladder3-fact-value">' + UI.esc(step.fact) + "</p>" +
        "</div>" +
        "</div>";
    }).join("");

    var ctas = (block.ctas || []).map(function (cta, index) {
      return UI.button({
        label: cta.label, href: cta.route,
        kind: cta.kind === "primary" ? "primary" : "quiet",
        iconAfter: index === 0 ? "arrow" : null
      });
    }).join("");

    var pillars = ((block.why && block.why.pillars) || []).map(function (pillar) {
      return '<div class="pillar">' +
        '<span class="pillar-mark" aria-hidden="true">' + UI.icon(pillar.icon) + "</span>" +
        '<div class="pillar-copy">' +
          '<h3 class="pillar-title">' + UI.esc(pillar.title) + "</h3>" +
          '<p class="pillar-text">' + UI.esc(pillar.body) + "</p>" +
        "</div>" +
        "</div>";
    }).join("");

    return '<section class="section home-screen" id="' + UI.esc(block.anchor) + '"><div class="wrap">' +
      head({ eyebrow: block.eyebrow, title: block.title }) +
      '<div class="deliver reveal">' +
        '<div class="deliver-main">' +
          '<div class="ladder3">' + steps + "</div>" +
          '<p class="footnote deliver-note">' + UI.esc(block.footnote) + "</p>" +
          '<div class="cta-row deliver-cta">' + ctas + "</div>" +
        "</div>" +
        '<div class="deliver-why">' +
          /* One accent per screen: the teal on this one is the head eyebrow and
             the first step's dot, so the column label is the dim eyebrow. */
          '<p class="eyebrow">' + UI.esc(block.why.title) + "</p>" +
          '<div class="pillars">' + pillars + "</div>" +
        "</div>" +
      "</div>" +
      "</div></section>";
  }

  /* ————— S5: the engagements behind the products ————— */

  /* The rail says what the four cards are; the cards carry the figures. How the
     figures were arrived at is a question the reader asks after the cards, and
     the rail's link answers it on the page that owns the method. Measured,
     modeled and in preparation are three states of the same card, so no
     engagement has to be left out to keep the grid honest, and no customer is
     named on either side. */
  function caseStudies(C) {
    var UI = window.UI;
    var intro = C.overview.caseStudiesIntro;
    var cards = (C.overview.caseStudies || []).map(UI.caseCard).join("");

    return '<section class="section home-screen" id="case-studies"><div class="wrap">' +
      '<div class="cases">' +
        '<div class="cases-rail">' +
          head({ eyebrow: intro.eyebrow, title: intro.title, lead: intro.body }) +
          '<p class="small cases-nda">' + UI.esc(intro.ndaLine) + "</p>" +
          '<p class="cases-link">' + UI.linkArrow({ label: intro.cta.label, href: intro.cta.route }) + "</p>" +
        "</div>" +
        '<div class="case-grid cases-grid">' + cards + "</div>" +
      "</div>" +
      "</div></section>";
  }

  /* ————— S6: who builds it ————— */

  /* The one inverted screen on the page. The partner wordmarks sit on a navy
     strip inside the light panel rather than on the panel itself: navy is the
     surface this design system reserves for a stated fact, and the marks are
     white. The company address is a link and reads as one — the filled buttons
     on this page are kept for the two places that ask the reader for something. */
  function about(C) {
    var UI = window.UI;
    var block = C.overview.about;

    var stats = (block.stats || []).map(function (stat) {
      return '<div class="about-stat">' +
        '<p class="about-stat-value nums">' + UI.esc(stat.value) + "</p>" +
        '<p class="about-stat-label">' + UI.esc(stat.label) + "</p>" +
        "</div>";
    }).join("");

    var partners = (block.partners || []).map(function (partner) {
      return '<img class="about-partner-mark" src="' + UI.esc(partner.file) +
        '" alt="' + UI.esc(partner.name) + '" width="' + UI.esc(partner.width) +
        '" height="' + UI.esc(partner.height) + '" loading="lazy" decoding="async">';
    }).join("");

    return '<section class="section home-screen" id="about"><div class="wrap">' +
      '<div class="light-band reveal">' +
        '<div class="light-band-media">' +
          '<p class="band-label">' + UI.esc(block.eyebrow) + "</p>" +
          '<h2 class="band-title">' + UI.esc(block.title) + "</h2>" +
          '<p class="band-body">' + UI.esc(block.body) + "</p>" +
          '<a class="band-link" href="' + UI.esc(block.link.url) + '" target="_blank" rel="noopener">' +
            "<span>" + UI.esc(block.link.label) + "</span>" + UI.icon("external") +
          "</a>" +
        "</div>" +
        '<div class="light-band-copy">' +
          '<div class="about-stats">' + stats + "</div>" +
          '<div class="about-partners">' +
            '<span class="about-partners-label">' + UI.esc(block.partnerLine) + "</span>" +
            '<span class="about-partner-marks">' + partners + "</span>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "</div></section>";
  }

  /* ————— S7: the way to start ————— */

  /* The same two-column component the Services page and a product's Contacts
     tab render, from the same objects: one named human on the left, one form on
     the right. Product pages deep-link into this section, so the anchor is read
     from the data rather than written twice. */
  function closing(C) {
    var UI = window.UI;
    var block = C.overview.contact;
    var demo = C.forms.demo;
    var form = window.FORMS && typeof window.FORMS.render === "function"
      ? '<div id="demo-form-slot">' +
          window.FORMS.render("demo", { heading: false, submitLabel: C.forms.labels.submitRequest }) +
        "</div>"
      : '<div id="demo-form-slot"></div>';

    return '<section class="closing" id="' + UI.esc(block.anchor) + '"><div class="wrap">' +
      '<div class="contact-head">' +
        '<h2 class="h2">' + UI.esc(block.heading) + "</h2>" +
        '<p class="lead">' + UI.esc(block.sub) + "</p>" +
      "</div>" +
      UI.contactSplit({
        cardHeading: UI.sectionLabel("contacts"),
        heading: demo.secondaryHeading,
        form: form
      }) +
      "</div></section>";
  }

  function overview() {
    var C = window.SITE_CONTENT;
    return hero(C) + statBand(C) + twoWays(C) + groupTiles(C) + delivery(C) +
      caseStudies(C) + about(C) + closing(C);
  }

  overview.mount = function (params, root) {
    var slot = root.querySelector("#demo-form-slot");
    if (slot && window.FORMS && typeof window.FORMS.mount === "function") {
      window.FORMS.mount(slot, "demo");
    }
  };

  overview.title = function () { return window.SITE_CONTENT.site.title; };

  window.PAGES.overview = overview;
})();
