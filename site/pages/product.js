(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  /* The three stack vendors, resolved through brandAsset so a theme with a
     light ground can swap in ink-on-white marks (assets/brand.js). */
  var VENDOR_MARK = {
    oracle: { src: window.brandAsset("oracleMark", "assets/img/oracle-wordmark-white.svg"), alt: "Oracle" },
    nvidia: { src: window.brandAsset("nvidiaMark", "assets/img/nvidia-wordmark.svg"), alt: "NVIDIA" },
    softserve: { src: window.brandAsset("ssMark", "assets/img/softserve-wordmark-white.svg"), alt: "SoftServe" }
  };

  var lastView = { slug: null, tab: null };

  function C() { return window.SITE_CONTENT; }
  function cfg(slug) { return window.SITE_CONFIG.products[slug] || {}; }
  function label(key) { return window.UI.sectionLabel(key); }

  function findProduct(slug) {
    var list = C().products;
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].slug === slug) return list[i];
    }
    return null;
  }

  /* A retired route segment resolves to the tab that replaced it and is
     reported as legacy, so the page renders the right content on the first
     paint and the address bar is corrected afterwards rather than bouncing. */
  function resolveTab(params) {
    var tabs = C().shared.productTabs;
    var wanted = (params && params.tab) || "overview";
    var i;
    for (i = 0; i < tabs.length; i += 1) {
      if (tabs[i].id === wanted) return { id: wanted, legacy: false };
    }
    for (i = 0; i < tabs.length; i += 1) {
      if ((tabs[i].legacyIds || []).indexOf(wanted) !== -1) return { id: tabs[i].id, legacy: true };
    }
    return { id: "overview", legacy: wanted !== "overview" };
  }

  function tabId(params) { return resolveTab(params).id; }

  function tabRoute(slug, tab) { return "#/products/" + slug + "/" + tab; }
  function contactsRoute(slug) { return tabRoute(slug, "contacts"); }

  /* ————— small blocks ————— */

  function blockHead(title) {
    return '<h2 class="h3 block-title">' + window.UI.esc(title) + "</h2>";
  }

  function bulletList(items, className) {
    var UI = window.UI;
    return '<ul class="tick-list' + (className ? " " + className : "") + '">' + items.map(function (item) {
      return "<li>" + UI.icon("check") + "<span>" + UI.esc(item) + "</span></li>";
    }).join("") + "</ul>";
  }

  function plainList(items) {
    var UI = window.UI;
    return '<ul class="dash-list">' + items.map(function (item) {
      return "<li>" + UI.esc(item) + "</li>";
    }).join("") + "</ul>";
  }

  /* ————— hero ————— */

  function youtubeId(url) {
    var found = String(url || "").match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i
    );
    return found ? found[1] : "";
  }

  function posterFor(product) {
    var conf = cfg(product.slug);
    if (conf.videoPoster) return conf.videoPoster;
    var id = youtubeId(conf.videoUrl);
    if (id) return "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg";
    return "";
  }

  /* The frame is promised before the file exists: `video: true` puts it on the
     page, `videoUrl` decides whether the click plays a recording or says when
     one is coming. Either way the hero keeps the same two-column shape, so a
     product does not change layout the day its video lands. */
  function heroMedia(product) {
    var UI = window.UI;
    var conf = cfg(product.slug);
    if (!conf.video && !conf.videoUrl) return "";
    var poster = posterFor(product);
    var caption = C().shared.videoCaption;
    var hook = conf.videoUrl
      ? ' data-video="' + UI.esc(conf.videoUrl) + '"' +
        ' data-video-title="' + UI.esc(product.name) + '"'
      : ' data-video-pending="' + UI.esc(product.slug) + '"';
    return '<div class="hero-media">' +
      '<button class="video-card' + (poster ? "" : " video-card--plate") + '" type="button"' + hook +
        ' aria-label="' + UI.esc(caption + " — " + product.name) + '">' +
        (poster
          ? '<img class="video-card-poster" src="' + UI.esc(poster) +
            '" alt="" loading="eager" decoding="async">'
          : "") +
        '<span class="video-card-veil" aria-hidden="true"></span>' +
        '<span class="video-card-play" aria-hidden="true">' + UI.icon("play", "icon--solid") + "</span>" +
        '<span class="video-card-caption">' + UI.esc(caption) + "</span>" +
      "</button></div>";
  }

  /* Where the walkthrough button goes — the same resolution the demo badge
     uses, so the two controls cannot open different things (round 9). It lives
     in assets/app.js with the badge; the fallback keeps this page working if
     it is ever rendered without the shared layer. */
  function demoHref(conf) {
    if (window.UI && typeof window.UI.demoHref === "function") return window.UI.demoHref(conf);
    return conf.demoUrl || "";
  }

  function heroCtas(product, hasMedia) {
    var UI = window.UI;
    var conf = cfg(product.slug);
    var out = [UI.button({
      label: C().site.primaryCta.label,
      href: contactsRoute(product.slug),
      kind: "primary"
    })];
    /* The interactive walkthrough opens in its own tab: it is a self-contained
       page with its own guide, and a seller mid-call must not lose the product
       page behind it. Rendered only when a demoUrl is configured. One icon, the
       badge's own pointer, leading the label — the pointer is what says
       "walkthrough you click", so a trailing external glyph would only dilute it
       (round 10). */
    if (conf.demoUrl) {
      out.push(UI.button({
        label: C().shared.demoCta, href: demoHref(conf),
        kind: "secondary", icon: "cursor-click",
        attrs: { target: "_blank", rel: "noopener" }
      }));
    }
    if (conf.videoUrl && !hasMedia) {
      out.push(UI.button({
        label: C().shared.videoCaption, kind: "secondary", icon: "play",
        attrs: { "data-video": conf.videoUrl, "data-video-title": product.name }
      }));
    }
    /* No Marketplace button here: the Marketplace badge in the chip row is the
       link to the listing, and no success-story button either — the case study
       owns its one link out. */
    return '<div class="cta-row product-hero-cta">' + out.join("") + "</div>";
  }

  /* Three families, visibly different (VISUAL-GRAMMAR §1.2): the pattern chip
     and the technology pills at the left, the availability badges at the right
     end of the same row. `tags` entries 0 and 1 repeat the category chip and
     the facet label — the renderer builds those two from `category` and
     `facet`, so it skips them rather than emitting the same run twice. */
  function heroChips(product) {
    var UI = window.UI;
    var chips = [
      UI.tagChip("pattern", product.category),
      UI.tagChip("tech", product.facet)
    ];
    (product.tags || []).slice(2).forEach(function (tag) {
      chips.push(UI.tagChip("tech", null, { label: tag }));
    });
    return '<div class="tag-row product-hero-chips">' +
      '<div class="chip-row">' + chips.join("") + "</div>" +
      UI.badgeRow(product.slug) +
      "</div>";
  }

  function hero(product) {
    var UI = window.UI;
    var line = product.heroLine || product.heroCaption || "";
    var badges = product.badges
      ? '<ul class="hero-badges">' + product.badges.map(function (badge) {
          return "<li>" + UI.esc(badge) + "</li>";
        }).join("") + "</ul>"
      : "";

    var media = heroMedia(product);

    return '<section class="product-hero has-hero-bg' + (media ? " product-hero--media" : "") + '">' +
      UI.heroBackdrop(product.hero && product.hero.image) +
      '<span class="hero-glow" aria-hidden="true"></span>' +
      '<div class="wrap product-hero-inner' + (media ? "" : " product-hero-inner--single") + '">' +
      '<div class="product-hero-copy">' +
        '<nav class="crumbs" aria-label="Breadcrumb">' +
          '<a href="#/products">' + UI.esc(C().productsPage.title) + "</a>" +
          "<span aria-hidden=\"true\">/</span>" +
          "<span>" + UI.esc(product.categoryChip) + "</span>" +
        "</nav>" +
        (line ? '<p class="eyebrow eyebrow--accent hero-line">' + UI.esc(line) + "</p>" : "") +
        UI.headline(product.headline, "h1", "h1 product-title") +
        heroChips(product) +
        '<p class="lead product-lead">' + UI.esc(product.oneLiner) + "</p>" +
        (product.statusNote
          ? '<p class="hero-status-note">' + UI.esc(product.statusNote) + "</p>"
          : "") +
        (product.subLine ? '<p class="body-text product-subline">' + UI.esc(product.subLine) + "</p>" : "") +
        badges +
        heroCtas(product, !!media) +
      "</div>" +
      media +
      "</div>" +
      "</section>";
  }

  function tabbar(product, active) {
    var UI = window.UI;
    var tabs = C().shared.productTabs.map(function (tab) {
      return '<a class="tab' + (tab.id === active ? " is-active" : "") +
        '" href="' + UI.esc(tabRoute(product.slug, tab.id)) + '"' +
        (tab.id === active ? ' aria-current="page"' : "") + ">" +
        "<span>" + UI.esc(tab.label) + "</span></a>";
    }).join("");
    return '<nav class="tabbar" id="product-tabs" aria-label="' + UI.esc(product.name) +
      ' sections"><div class="wrap tabbar-inner">' + tabs + "</div></nav>";
  }

  /* ————— tab: overview ————— */

  function problemSolution(block) {
    var UI = window.UI;
    if (!block) return "";
    function panel(side, isSolution) {
      return '<article class="ps-panel' + (isSolution ? " ps-panel--solution" : "") + '">' +
        '<span class="ps-mark">' + UI.icon(side.icon) + "</span>" +
        '<p class="eyebrow' + (isSolution ? " eyebrow--accent" : "") + '">' + UI.esc(side.title) + "</p>" +
        '<p class="ps-text">' + UI.esc(side.text) + "</p>" +
        "</article>";
    }
    return '<section class="panel panel--flat reveal"><div class="ps-strip">' +
      panel(block.problem, false) +
      '<span class="ps-arrow" aria-hidden="true">' + UI.icon("arrow") + "</span>" +
      panel(block.solution, true) +
      "</div></section>";
  }

  /* How it works: the workflow, not a list of nouns. Each feature bullet sits
     under the step it belongs to, and the frame is the same 16:10 whether it
     holds a product screenshot or a designed illustration.
     Round 10 — the frame becomes the block. On a desktop the steps are a strip
     of heads across the top (one grid cell each), the frame spans the whole row
     under them at the MAIN column's full width, and the active step's body sits
     under the frame. `.stepper-list` and `.stepper-step` are `display: contents`
     there, so the heads, the frames and the open body are all children of the
     one grid; `--steps` tells that grid how many columns to cut. Below 901px the
     same markup falls back to the accordion, body under head. */
  function stepper(product) {
    var UI = window.UI;
    var steps = product.overview.steps;
    if (!steps || !steps.length) return "";
    var base = "wf-" + product.slug;

    var list = steps.map(function (step, index) {
      var on = index === 0;
      var features = (step.features || []).length
        ? bulletList(step.features, "stepper-features")
        : "";
      return '<li class="stepper-step' + (on ? " is-active" : "") + '">' +
        '<button class="stepper-head" type="button" data-step="' + index + '"' +
          ' id="' + base + "-head-" + index + '"' +
          ' aria-expanded="' + (on ? "true" : "false") + '"' +
          ' aria-controls="' + base + "-body-" + index + '">' +
          '<span class="stepper-num nums">' + UI.esc(step.n) + "</span>" +
          '<span class="stepper-title">' + UI.esc(step.title) + "</span>" +
        "</button>" +
        '<div class="stepper-body" id="' + base + "-body-" + index + '"' + (on ? "" : " hidden") + ">" +
          '<p class="stepper-text">' + UI.esc(step.text) + "</p>" +
          features +
        "</div>" +
        "</li>";
    }).join("");

    var frames = steps.map(function (step, index) {
      return '<figure class="step-frame' + (index === 0 ? " is-active" : "") + '"' +
        ' data-frame="' + index + '"' + (index === 0 ? "" : " hidden") + ">" +
        '<img src="' + UI.esc(step.image) + '" alt="' + UI.esc(step.title) +
        '" loading="lazy" decoding="async">' +
        "</figure>";
    }).join("");

    return '<section class="panel reveal" data-stepper="' + UI.esc(product.slug) + '">' +
      blockHead(label("howItWorks")) +
      '<div class="stepper" style="--steps: ' + steps.length + '">' +
        '<ol class="stepper-list">' + list + "</ol>" +
        '<div class="step-frames">' + frames + "</div>" +
      "</div></section>";
  }

  function industryCases(product) {
    var UI = window.UI;
    var cases = product.overview.industryCases;
    if (!cases || !cases.length) return "";
    var base = "ind-" + product.slug;
    var heading = label("industryCases");

    var tabs = cases.map(function (item, index) {
      var on = index === 0;
      return '<button class="ind-tab' + (on ? " is-active" : "") + '" type="button" role="tab"' +
        ' id="' + base + "-tab-" + index + '" aria-controls="' + base + "-panel-" + index + '"' +
        ' aria-selected="' + (on ? "true" : "false") + '" tabindex="' + (on ? "0" : "-1") + '">' +
        UI.icon("industry-" + item.industry) + "<span>" + UI.esc(item.label) + "</span></button>";
    }).join("");

    var panels = cases.map(function (item, index) {
      var first = index === 0;
      return '<div class="ind-panel" role="tabpanel" id="' + base + "-panel-" + index + '"' +
        ' aria-labelledby="' + base + "-tab-" + index + '" tabindex="0"' +
        (first ? "" : " hidden") + ">" +
        '<figure class="ind-figure"><img src="' + UI.esc(item.image) +
          '" alt="" decoding="async" loading="' + (first ? "eager" : "lazy") + '"' +
          (first ? ' fetchpriority="high"' : "") + "></figure>" +
        '<div class="ind-case">' +
          '<h3 class="ind-case-name">' + UI.esc(item.label) + "</h3>" +
          '<p class="eyebrow">' + UI.esc(label("caseProblem")) + "</p>" +
          '<p class="ind-case-text">' + UI.esc(item.problem) + "</p>" +
          '<p class="eyebrow eyebrow--accent">' + UI.esc(label("caseSolution")) + "</p>" +
          '<p class="ind-case-text">' + UI.esc(item.solution) + "</p>" +
        "</div></div>";
    }).join("");

    return '<section class="panel reveal" data-industry-tabs="' + UI.esc(product.slug) + '">' +
      blockHead(heading) +
      '<div class="ind-tablist" role="tablist" aria-label="' + UI.esc(heading) + '">' + tabs + "</div>" +
      '<div class="ind-panels">' + panels + "</div>" +
      (product.overview.industriesNote
        ? '<p class="footnote ind-note">' + UI.esc(product.overview.industriesNote) + "</p>"
        : "") +
      "</section>";
  }

  function detailEntries(items) {
    var UI = window.UI;
    return (items || []).map(function (item) {
      return '<div class="detail-entry">' +
        '<h3 class="detail-title">' + UI.esc(item.title) + "</h3>" +
        '<p class="detail-text">' + UI.esc(item.body) + "</p>" +
        "</div>";
    }).join("");
  }

  /* The disclosure at the foot of the tab: detail entries, scope and the
     feature detail, all behind one click. */
  function moreDetail(o) {
    var UI = window.UI;
    var parts = [detailEntries(o.moreDetail)];

    if (o.scope) {
      parts.push('<p class="eyebrow detail-sub">' + UI.esc(label("scope")) + "</p>" +
        '<div class="detail-full"><div class="scope-grid">' +
          '<div class="scope-col">' +
            '<p class="eyebrow eyebrow--accent">' + UI.esc(label("scopeIn")) + "</p>" +
            bulletList(o.scope.in) +
          "</div>" +
          '<div class="scope-col">' +
            '<p class="eyebrow">' + UI.esc(label("scopeOut")) + "</p>" +
            plainList(o.scope.out) +
          "</div></div></div>");
    }

    var features = detailEntries(o.featuresDetail);
    if (features) {
      parts.push('<p class="eyebrow detail-sub">' + UI.esc(label("moreDetailFeatures")) + "</p>" + features);
    }
    if (o.featuresNote) {
      parts.push('<div class="detail-full"><p class="footnote">' + UI.esc(o.featuresNote) + "</p></div>");
    }

    var body = parts.filter(Boolean).join("");
    if (!body) return "";

    return '<section class="panel panel--flat reveal">' +
      '<details class="disclosure disclosure--detail">' +
        "<summary><span>" + UI.esc(label("moreDetail")) + "</span>" + UI.icon("chevronDown") + "</summary>" +
        '<div class="detail-wrap">' + body + "</div>" +
      "</details></section>";
  }

  /* Rule 2 of the visual grammar: a number never renders away from the
     disclaimer that belongs to it, so tiles, ROI and footnote are one block. */
  function outcomesBlock(o) {
    var UI = window.UI;
    if (!o.metrics || !o.metrics.length) return "";
    function valued(metric) {
      return metric.value !== null && metric.value !== undefined && metric.value !== "";
    }
    var anyValue = o.metrics.some(valued);
    var tiles = o.metrics.map(function (metric) {
      var hasValue = valued(metric);
      return '<div class="stat-tile">' +
        '<div class="stat-tile-top">' +
          (hasValue
            ? '<p class="stat-tile-value nums">' + UI.esc(metric.value) + "</p>"
            : '<span class="stat-tile-mark">' + UI.icon(metric.icon) + "</span>") +
        "</div>" +
        '<p class="stat-tile-label">' +
          (hasValue ? UI.icon(metric.icon) : "") +
          "<span>" + UI.esc(metric.label) + "</span></p>" +
        '<p class="stat-tile-qual">' + UI.esc(metric.qualifier) + "</p>" +
        "</div>";
    }).join("");

    var roi = o.roi && o.roi.text
      ? '<div class="roi-band roi-band--compact">' +
          '<span class="roi-mark">' + UI.icon((o.roi && o.roi.icon) || "roi") + "</span>" +
          '<div class="roi-copy">' +
            '<p class="eyebrow eyebrow--accent">' + UI.esc(label("roi")) + "</p>" +
            '<p class="roi-text">' + UI.esc(o.roi.text) + "</p>" +
          "</div></div>"
      : "";

    return '<section class="panel panel--tight rail-card reveal">' +
      blockHead(label(anyValue ? "metrics" : "metricsPlanned")) +
      '<div class="stat-tiles stat-tiles--stack">' + tiles + "</div>" +
      roi +
      (o.metricsNote ? '<p class="footnote stat-tiles-note">' + UI.esc(o.metricsNote) + "</p>" : "") +
      "</section>";
  }

  /* No case, no block: `caseStudy: null` renders nothing at all — a section
     whose only content is "nothing published yet" is worse than its absence on
     a page a seller demos live. No customer is named and no logo is rendered;
     the industry medallion sits where the mark used to, and the card opens on
     it rather than on a photograph the industry tabs already show further up
     the same page. The figure caveat is the last sentence of `story`, because
     the panel has no footnote row; the download link renders only where a URL
     exists. */
  /* Round 10 — the callout now sits in the full content column of the Use cases
     tab rather than in the narrow Overview main, so it is built as two
     containers: the narrative on the left, the evidence on the right behind a
     hairline. `.case-callout--wide` is what turns that into two columns at
     ≥ 901px; below it the same two containers stack, main then side. */
  function caseStudy(product) {
    var UI = window.UI;
    var item = product.overview.caseStudy;
    var conf = cfg(product.slug);
    if (!item) return "";

    var figures = (item.metrics || []).map(function (metric) {
      return '<div class="case-figure">' +
        '<p class="case-figure-value nums">' + UI.esc(metric.value) + "</p>" +
        '<p class="case-figure-label">' + UI.esc(metric.label) + "</p>" +
        "</div>";
    }).join("");

    var scope = (item.scope || []).map(function (fact) {
      return "<div><dt>" + UI.esc(fact.label) + "</dt><dd>" + UI.esc(fact.value) + "</dd></div>";
    }).join("");

    return '<section class="panel panel--flat reveal">' +
      '<div class="case-callout case-callout--wide">' +
        '<div class="case-body">' +
          '<div class="case-main">' +
            '<p class="eyebrow eyebrow--accent">' + UI.esc(label("caseStudy")) + "</p>" +
            '<div class="case-head">' +
              UI.caseMedallion(item.industry) +
              '<div class="case-head-copy">' +
                '<h3 class="case-descriptor">' + UI.esc(item.descriptor) + "</h3>" +
                '<p class="case-area">' + UI.esc(item.area) + "</p>" +
              "</div>" +
            "</div>" +
            '<p class="case-text">' + UI.esc(item.story) + "</p>" +
            '<p class="case-nda">' + UI.esc(item.ndaLine) + "</p>" +
            (conf.successStoryUrl && item.downloadLabel
              ? '<p class="case-link">' + UI.linkArrow({
                  label: item.downloadLabel, href: conf.successStoryUrl
                }) + "</p>"
              : "") +
          "</div>" +
          '<div class="case-side">' +
            UI.caseStatusChip(item.status) +
            '<div class="case-metrics">' +
              '<div class="case-figures' +
                ((item.metrics || []).length < 2 ? " case-figures--single" : "") + '">' +
                figures +
              "</div>" +
            "</div>" +
            (scope ? '<dl class="case-scope">' + scope + "</dl>" : "") +
          "</div>" +
        "</div>" +
      "</div></section>";
  }

  /* Round 10 — the Overview argues the product: the problem it solves, how it
     works, and the detail behind that, with the outcomes in the rail. The
     industry cases and the case study moved to their own tab, because they
     answer a different question ("where does this apply, and has it worked?")
     and were pushing How it works out of the first screen. */
  function overviewTab(product) {
    var o = product.overview;
    return '<div class="ov-layout">' +
      '<div class="ov-main">' +
        problemSolution(o.problemSolution) +
        stepper(product) +
        moreDetail(o) +
      "</div>" +
      '<aside class="ov-rail" aria-label="' + window.UI.esc(label("outcomes")) + '">' +
        outcomesBlock(o) +
      "</aside>" +
      "</div>";
  }

  /* ————— tab: use cases ————— */

  /* One column at the full content width, no rail: the industry tabs, then the
     case study where one ships. Four products carry `caseStudy: null` and the
     tab is the industries block alone — no empty state (VISUAL-GRAMMAR). */
  function useCasesTab(product) {
    return industryCases(product) + caseStudy(product);
  }

  /* ————— tab: technology ————— */

  function vendorMarks(vendors) {
    var UI = window.UI;
    return (vendors || []).map(function (vendor) {
      var mark = VENDOR_MARK[vendor];
      return mark
        ? '<img class="group-mark group-mark--' + UI.esc(vendor) + '" src="' + UI.esc(mark.src) +
          '" alt="' + UI.esc(mark.alt) + '">'
        : "";
    }).join("");
  }

  function stackItem(item) {
    var UI = window.UI;
    return '<li class="stack-item">' +
      '<span class="stack-item-name">' + UI.esc(item.name) + "</span>" +
      '<span class="stack-tags">' +
        '<span class="stack-tag' + (item.required ? " stack-tag--required" : "") + '">' +
          UI.esc(label(item.required ? "layerRequired" : "layerOptional")) + "</span>" +
        (item.note ? '<span class="stack-tag stack-tag--when">' + UI.esc(item.note) + "</span>" : "") +
      "</span>" +
      "</li>";
  }

  function stackItems(items) {
    var UI = window.UI;
    function group(iconName, title, list) {
      if (!list.length) return "";
      return '<p class="eyebrow eyebrow--accent stack-dir">' + UI.icon(iconName) +
        "<span>" + UI.esc(title) + "</span></p>" +
        '<ul class="stack-items">' + list.map(stackItem).join("") + "</ul>";
    }
    function has(item, direction) {
      return item.direction === direction || item.direction === "both";
    }
    var plain = items.filter(function (item) { return !item.direction; });
    var inbound = items.filter(function (item) { return has(item, "inbound"); });
    var outbound = items.filter(function (item) { return has(item, "outbound"); });

    return (plain.length ? '<ul class="stack-items">' + plain.map(stackItem).join("") + "</ul>" : "") +
      group("inbound", label("directionInbound"), inbound) +
      group("outbound", label("directionOutbound"), outbound);
  }

  /* The stack read top to bottom is the flow, with the components attached:
     application on top, infrastructure at the foot, each band expandable. */
  function solutionStack(product) {
    var UI = window.UI;
    var tech = product.technology;
    if (!tech.stack || !tech.stack.length) return "";
    var base = "stack-" + product.slug;

    var rows = tech.stack.map(function (layer, index) {
      var open = index === 0;
      return '<div class="stack-layer stack-layer--' + UI.esc(layer.key) +
        (open ? " is-open" : "") + '">' +
        '<button class="stack-row" type="button" aria-expanded="' + (open ? "true" : "false") + '"' +
          ' aria-controls="' + base + "-body-" + index + '">' +
          '<span class="stack-marks" aria-hidden="true">' + vendorMarks(layer.vendors) + "</span>" +
          '<span class="stack-name">' + UI.esc(layer.label) + "</span>" +
          '<span class="stack-summary">' + UI.esc(layer.summary) + "</span>" +
          UI.icon("chevronDown", "stack-chev") +
        "</button>" +
        '<div class="stack-body" id="' + base + "-body-" + index + '"' + (open ? "" : " hidden") + ">" +
          stackItems(layer.items || []) +
        "</div></div>";
    }).join("");

    return '<div class="stack-accordion" data-stack="' + UI.esc(product.slug) + '">' + rows + "</div>";
  }

  /* A capability matrix that prints a restrictive asterisk gets PARTIAL, not
     SUPPORTED — an unqualified tag on a partial row is a claim. */
  var CAP_STATE = {
    supported: "stateSupported",
    partial: "statePartial",
    roadmap: "stateRoadmap"
  };

  /* The complete feature list, grouped under the four workflow stages the
     Overview stepper walks through — so two products compare stage for stage.
     A state tag renders only where a shipped capability matrix states one; an
     untagged item gets no tag at all, because a guessed tag is a claim. */
  function capabilities(product) {
    var UI = window.UI;
    var groups = product.technology.capabilities;
    if (!groups || !groups.length) return "";

    var columns = groups.map(function (group, index) {
      var items = (group.items || []).map(function (item) {
        var state = CAP_STATE[item.state] ? item.state : "";
        return '<li class="cap-item">' +
          '<span class="cap-name">' + UI.esc(item.name) + "</span>" +
          (state
            ? '<span class="cap-tag cap-tag--' + state + '">' + UI.esc(label(CAP_STATE[state])) + "</span>"
            : "") +
          "</li>";
      }).join("");
      return '<div class="cap-stage">' +
        '<p class="cap-stage-head">' +
          '<span class="cap-stage-index nums">' + (index + 1) + "</span>" +
          '<span class="cap-stage-name">' + UI.esc(group.stage) + "</span>" +
        "</p>" +
        '<ul class="cap-list">' + items + "</ul>" +
        "</div>";
    }).join("");

    return '<section class="panel reveal">' +
      blockHead(label("capabilities")) +
      '<div class="cap-grid">' + columns + "</div>" +
      "</section>";
  }

  /* Exactly two blocks (VISUAL-GRAMMAR §3): Architecture — the narrative and
     the layer stack under one heading — then Capabilities. */
  function technologyTab(product) {
    var UI = window.UI;
    var tech = product.technology;
    var figure = UI.figure(product.slug);

    return '<section class="panel reveal">' +
        blockHead(label("architecture")) +
        '<div class="arch-head">' +
          '<p class="lead arch-narrative">' + UI.esc(tech.narrative) + "</p>" +
          figure +
        "</div>" +
        '<p class="eyebrow arch-stack-label">' + UI.esc(label("stack")) + "</p>" +
        solutionStack(product) +
      "</section>" +
      capabilities(product);
  }

  /* ————— tab: Jumpstart ————— */

  var PILLAR_ICON = { fast: "clock", "low-risk": "shield", tangible: "trendUp" };

  function hasFigure(inv) {
    return !!((inv && inv.price) || (inv && inv.duration));
  }

  /* The card prints the figures that are published. Where neither price nor
     duration is set, one line says so — two tiles both reading "scoped per
     engagement" is an unfilled template, not an investment. */
  function investFigures(inv) {
    var UI = window.UI;
    if (!hasFigure(inv)) {
      return '<p class="invest-scope">' + UI.esc(label("jumpstartScoped")) + "</p>";
    }
    function figure(value, name) {
      return '<div class="invest-figure">' +
        '<p class="invest-value nums">' + UI.esc(value) + "</p>" +
        '<p class="invest-label">' + UI.esc(name) + "</p>" +
        "</div>";
    }
    var both = inv.price && inv.duration;
    return '<div class="invest-figures' + (both ? "" : " invest-figures--single") + '">' +
      (inv.price ? figure(inv.price, "Price") : "") +
      (inv.duration ? figure(inv.duration, "Duration") : "") +
      "</div>";
  }

  /* Fast · low-risk · tangible: the same six pieces in the same order on all
     seven products, so the page does not move when a seller changes tab.
     One footnote under the price, never a stack. */
  function jumpstartTab(product) {
    var UI = window.UI;
    var js = product.jumpstart;

    var pillars = (js.pillars || []).map(function (pillar) {
      return '<article class="pillar">' +
        '<span class="pillar-mark">' + UI.icon(PILLAR_ICON[pillar.key] || "spark") + "</span>" +
        '<h3 class="pillar-title">' + UI.esc(pillar.title) + "</h3>" +
        '<p class="pillar-text">' + UI.esc(pillar.text) + "</p>" +
        "</article>";
    }).join("");

    var timeline = (js.timeline || []).map(function (node) {
      return '<li class="tl-node">' +
        '<span class="tl-mark" aria-hidden="true"></span>' +
        '<p class="tl-label">' + UI.esc(node.label) + "</p>" +
        '<p class="tl-text">' + UI.esc(node.text) + "</p>" +
        "</li>";
    }).join("");

    var inv = js.investment || {};
    var includes = (inv.includes || []).map(function (line) {
      return "<li>" + UI.icon("check") + "<span>" + UI.esc(line) + "</span></li>";
    }).join("");

    var next = (js.next || []).map(function (tier) {
      return '<article class="next-tier">' +
        '<p class="eyebrow eyebrow--accent">' + UI.esc(tier.tier) + "</p>" +
        '<p class="next-tier-text">' + UI.esc(tier.text) + "</p>" +
        '<dl class="next-tier-facts">' +
          (tier.duration
            ? "<div><dt>Duration</dt><dd>" + UI.esc(tier.duration) + "</dd></div>"
            : "") +
          (tier.price
            ? "<div><dt>Pricing</dt><dd>" + UI.esc(tier.price) + "</dd></div>"
            : "") +
        "</dl>" +
        "</article>";
    }).join("");

    return '<section class="panel reveal">' +
        blockHead(js.title) +
        '<p class="lead js-promise">' + UI.esc(js.promise) + "</p>" +
        '<div class="pillar-row">' + pillars + "</div>" +
      "</section>" +
      '<section class="panel reveal">' +
        '<div class="js-split">' +
          '<div class="js-col">' +
            blockHead(label("jumpstartOutcomes")) +
            bulletList(js.outcomes || []) +
          "</div>" +
          '<div class="js-col js-col--rail">' +
            blockHead(label("jumpstartTimeline")) +
            '<ol class="tl">' + timeline + "</ol>" +
          "</div>" +
        "</div>" +
      "</section>" +
      '<section class="panel reveal">' +
        '<div class="js-split js-split--invest">' +
          '<div class="js-col">' +
            blockHead(label("jumpstartNeeds")) +
            bulletList(js.needs || []) +
          "</div>" +
          '<div class="invest-card">' +
            '<p class="eyebrow eyebrow--accent">' + UI.esc(label("jumpstartInvestment")) + "</p>" +
            investFigures(inv) +
            '<ul class="tick-list invest-includes">' + includes + "</ul>" +
            (hasFigure(inv) && inv.footnote
              ? '<p class="footnote invest-note">' + UI.esc(inv.footnote) + "</p>"
              : "") +
          "</div>" +
        "</div>" +
      "</section>" +
      '<section class="panel reveal">' +
        blockHead(label("jumpstartNext")) +
        '<div class="next-grid">' + next + "</div>" +
      "</section>" +
      '<section class="panel panel--flat reveal">' +
        '<div class="cta-row">' +
          UI.button({
            label: js.cta.label,
            href: js.cta.route || contactsRoute(product.slug),
            kind: "primary"
          }) +
        "</div>" +
        '<p class="panel-link">' + UI.linkArrow({
          label: C().shared.engageLink.label, href: C().shared.engageLink.route
        }) + "</p>" +
      "</section>";
  }

  /* ————— tab: contacts ————— */

  /* The tab's own anchor: every kit link points at the form itself rather than
     at this route, because a same-route ROUTER.go re-renders the page and wipes
     whatever the reader has typed. */
  var TALK_ANCHOR = "talk";
  var KIT_ANCHOR = "kit";
  function talkHref(slug) { return contactsRoute(slug) + "#" + TALK_ANCHOR; }

  /* The product's sales-kit request (round 8), which round 10 moved off its own
     tab and onto the Contacts tab, and round 10b made the second tab of the
     switch: a page that repeats one form under two names is a structure bug,
     and two open forms on one screen are a second one. The materials list it
     replaced stays as data in `product.sellers.materials` and the config links
     — the manifest for whoever sends the kit — and is no longer rendered. A
     customer or partner who lands in the kit is routed back to the ask beside
     it, which is also what the confirmation offers. */
  function kitOptions(product) {
    var tab = C().salesKit.tab;
    return {
      product: product.slug,
      routeLink: { label: tab.routeLabel, href: talkHref(product.slug) },
      next: [
        { text: tab.nextDemo, link: { label: tab.nextDemoLink, href: talkHref(product.slug) } },
        { text: tab.nextAll, link: { label: tab.nextAllLink, href: "#/sellers" } }
      ]
    };
  }

  /* One row, and one form on the screen (round 10b). The contact card on the
     left, and on the right a two-tab switch on the theme's own segmented
     control: the ask first, the seller's kit behind the second tab. Alex's
     correction: the kit has to be reachable without scrolling, and two live
     input forms on one screen make the reader choose between two asks. The
     selected segment is the column's heading, so neither panel repeats it, and
     the card needs no "Contacts" H3 either — the tab already says it. Both
     forms are mounted whether their panel is open or not, so a switch never
     lands on an unbound field. */
  function contactsTab(product) {
    var UI = window.UI;
    var demo = C().forms.demo;
    var ask = C().site.primaryCta.label;
    var kit = C().salesKit;
    var base = "contact-" + product.slug;
    var talkTab = base + "-tab-talk";
    var kitTab = base + "-tab-kit";
    var talkPane = base + "-pane-talk";
    var form = window.FORMS
      ? '<div id="product-demo-form">' + window.FORMS.render("demo", {
          product: product.slug, heading: false, submitLabel: ask
        }) + "</div>"
      : "";

    if (!form && !UI.contactCard()) return UI.empty(demo.sub);

    function segment(id, controls, text, on) {
      return '<button class="segment" type="button" role="tab" id="' + id + '"' +
        ' aria-controls="' + controls + '" aria-selected="' + (on ? "true" : "false") + '"' +
        ' tabindex="' + (on ? "0" : "-1") + '">' + UI.esc(text) + "</button>";
    }

    var pick = '<div class="segmented contact-segmented" role="tablist" aria-label="' +
      UI.esc(label("contacts")) + '">' +
        segment(talkTab, talkPane, ask, true) +
        segment(kitTab, KIT_ANCHOR, kit.tab.title, false) +
      "</div>";

    var talkPanel = '<div class="contact-pane" role="tabpanel" id="' + talkPane + '"' +
      ' aria-labelledby="' + talkTab + '">' +
        '<p class="body-text contact-split-sub">' + UI.esc(demo.sub) + "</p>" +
        form +
      "</div>";

    var kitPanel = '<div class="contact-pane" role="tabpanel" id="' + KIT_ANCHOR + '"' +
      ' aria-labelledby="' + kitTab + '" hidden>' +
        '<p class="eyebrow eyebrow--accent">' + UI.esc(kit.page.eyebrow) + "</p>" +
        '<p class="body-text">' + UI.esc(kit.tab.body.replace("{product}", product.name)) + "</p>" +
        (window.FORMS && window.FORMS.renderKit ? window.FORMS.renderKit(kitOptions(product)) : "") +
      "</div>";

    return '<section class="panel reveal">' +
        UI.contactSplit({
          formId: TALK_ANCHOR,
          form: '<div class="contact-tabs" data-contact-tabs="' + UI.esc(product.slug) + '">' +
            pick + talkPanel + kitPanel + "</div>"
        }) +
      "</section>";
  }

  /* ————— page ————— */

  function product(params) {
    var UI = window.UI;
    var item = findProduct(params.slug);
    if (!item) {
      return '<section class="wrap route-note">' +
        '<p class="eyebrow eyebrow--accent">Not found</p>' +
        '<h1 class="h1">NO SUCH <span class="accent">PRODUCT</span></h1>' +
        '<p class="lead">' + UI.esc(C().productsPage.intro) + "</p>" +
        '<div class="cta-row">' +
          UI.button({ label: "Browse the products", href: "#/products", kind: "secondary" }) +
        "</div></section>";
    }

    var active = tabId(params);
    var body;
    if (active === "use-cases") body = useCasesTab(item);
    else if (active === "technology") body = technologyTab(item);
    else if (active === "jumpstart") body = jumpstartTab(item);
    else if (active === "contacts") body = contactsTab(item);
    else body = overviewTab(item);

    return hero(item) + tabbar(item, active) +
      '<section class="section section--tight section--tabs"><div class="wrap tab-body' +
        (active === "overview" ? " tab-body--compact" : "") + '" id="tab-body">' +
        body +
      "</div></section>";
  }

  function embedUrl(url) {
    var value = String(url || "");
    var found;
    if (/youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|player\.vimeo\.com\/video\//i.test(value)) {
      return value;
    }
    found = value.match(/youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/)([A-Za-z0-9_-]{6,})/i) ||
      value.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/i);
    if (found) return "https://www.youtube.com/embed/" + found[1];
    found = value.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (found) return "https://player.vimeo.com/video/" + found[1];
    return value;
  }

  function bindVideo(root, item) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-video]"), function (button) {
      button.addEventListener("click", function () {
        var url = button.getAttribute("data-video");
        var title = button.getAttribute("data-video-title") || item.name;
        var embed = /youtube\.com|youtu\.be|youtube-nocookie\.com|vimeo\.com|\.sharepoint\.com|web\.microsoftstream\.com/i.test(url)
          ? '<iframe class="video-frame" src="' + window.UI.esc(embedUrl(url)) +
            '" title="' + window.UI.esc(title) +
            '" allow="autoplay; fullscreen; picture-in-picture"></iframe>'
          : '<video class="video-frame" src="' + window.UI.esc(url) + '" controls playsinline></video>';
        window.UI.modal.open('<h2 class="h3 modal-title">' + window.UI.esc(title) + "</h2>" +
          '<div class="video-wrap">' + embed + "</div>",
          { label: title, className: "modal-panel--media" });
      });
    });
  }

  /* A frame with no recording behind it names the product, says the recording
     is not ready, and offers a live demo instead — and, where the product has an
     interactive walkthrough, that too, in a new tab. */
  function bindPendingVideo(root, item) {
    var UI = window.UI;
    var pending = C().shared.videoPending;
    var conf = cfg(item.slug);
    Array.prototype.forEach.call(root.querySelectorAll("[data-video-pending]"), function (button) {
      button.addEventListener("click", function () {
        var demo = conf.demoUrl
          ? UI.button({
              label: C().shared.demoCta, href: demoHref(conf),
              kind: "secondary", icon: "cursor-click",
              attrs: { target: "_blank", rel: "noopener" }
            })
          : "";
        var panel = UI.modal.open('<h2 class="h3 modal-title">' + UI.esc(item.name) + "</h2>" +
          '<p class="body-text">' + UI.esc(pending.body) + "</p>" +
          '<div class="cta-row modal-cta">' + UI.button({
            label: pending.cta,
            href: contactsRoute(item.slug),
            kind: "primary"
          }) + demo + "</div>",
          { label: item.name, className: "modal-panel--note" });
        var cta = panel.querySelector(".modal-cta a");
        if (cta) cta.addEventListener("click", function () { UI.modal.close(); });
      });
    });
  }

  /* `axis` is "horizontal", "vertical" or "both". The stepper takes both: its
     heads are a horizontal strip on a desktop and a vertical accordion below
     901px, and one component may not answer to different keys at two widths. */
  var ROVING_KEYS = {
    horizontal: { forward: ["ArrowRight"], back: ["ArrowLeft"] },
    vertical: { forward: ["ArrowDown"], back: ["ArrowUp"] },
    both: { forward: ["ArrowRight", "ArrowDown"], back: ["ArrowLeft", "ArrowUp"] }
  };

  function roving(buttons, onSelect, axis) {
    var keys = ROVING_KEYS[axis] || ROVING_KEYS.vertical;
    buttons.forEach(function (button, index) {
      button.addEventListener("keydown", function (event) {
        var next = null;
        if (keys.forward.indexOf(event.key) !== -1) next = (index + 1) % buttons.length;
        else if (keys.back.indexOf(event.key) !== -1) next = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = buttons.length - 1;
        if (next === null) return;
        event.preventDefault();
        onSelect(next);
        buttons[next].focus();
      });
    });
  }

  function bindStepper(root) {
    var block = root.querySelector("[data-stepper]");
    if (!block) return;
    var heads = Array.prototype.slice.call(block.querySelectorAll(".stepper-head"));
    var frames = Array.prototype.slice.call(block.querySelectorAll(".step-frame"));
    if (!heads.length) return;

    function select(index) {
      heads.forEach(function (head, i) {
        var on = i === index;
        head.setAttribute("aria-expanded", on ? "true" : "false");
        head.parentNode.classList.toggle("is-active", on);
        var body = document.getElementById(head.getAttribute("aria-controls"));
        if (body) body.hidden = !on;
      });
      frames.forEach(function (frame, i) {
        frame.hidden = i !== index;
        frame.classList.toggle("is-active", i === index);
      });
    }

    heads.forEach(function (head, index) {
      head.addEventListener("click", function () { select(index); });
    });
    roving(heads, select, "both");
  }

  function bindIndustryTabs(root) {
    var block = root.querySelector("[data-industry-tabs]");
    if (!block) return;
    var tabs = Array.prototype.slice.call(block.querySelectorAll(".ind-tab"));
    if (!tabs.length) return;

    function select(index) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.setAttribute("tabindex", on ? "0" : "-1");
        tab.classList.toggle("is-active", on);
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { select(index); });
    });
    roving(tabs, select, "horizontal");
  }

  /* The Contacts switch. The anchor decides which tab opens, and it decides it
     here — mount runs before the router scrolls to the anchor (app.js), so a
     kit link from anywhere lands on an open kit panel, and every other entry,
     `#talk` included, lands on the ask. */
  function bindContactTabs(root, anchor) {
    var block = root.querySelector("[data-contact-tabs]");
    if (!block) return;
    var tabs = Array.prototype.slice.call(block.querySelectorAll(".segment"));
    if (!tabs.length) return;

    function select(index) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.setAttribute("tabindex", on ? "0" : "-1");
        var pane = document.getElementById(tab.getAttribute("aria-controls"));
        if (pane) pane.hidden = !on;
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { select(index); });
    });
    roving(tabs, select, "horizontal");
    select(anchor === KIT_ANCHOR ? 1 : 0);
  }

  function bindStack(root) {
    var block = root.querySelector("[data-stack]");
    if (!block) return;
    Array.prototype.forEach.call(block.querySelectorAll(".stack-row"), function (row) {
      row.addEventListener("click", function () {
        var open = row.getAttribute("aria-expanded") !== "true";
        row.setAttribute("aria-expanded", open ? "true" : "false");
        row.parentNode.classList.toggle("is-open", open);
        var body = document.getElementById(row.getAttribute("aria-controls"));
        if (body) body.hidden = !open;
      });
    });
  }

  /* The tab strip scrolls sideways on a phone, so a reader who lands on a
     later tab would otherwise see the active one parked off-screen. The
     bar scrolls itself, never the page. */
  function centerActiveTab(root) {
    var bar = root.querySelector("#product-tabs");
    if (!bar) return;
    var on = bar.querySelector(".tab.is-active");
    if (!on || bar.scrollWidth <= bar.clientWidth) return;
    var barBox = bar.getBoundingClientRect();
    var tabBox = on.getBoundingClientRect();
    bar.scrollLeft += (tabBox.left - barBox.left) - (bar.clientWidth - tabBox.width) / 2;
  }

  product.mount = function (params, root) {
    var item = findProduct(params.slug);
    if (!item) return;
    var resolved = resolveTab(params);
    var active = resolved.id;

    /* A retired segment — /demo, /pov, and since round 10 /sellers — is
       rewritten in place rather than pushed, so Back returns to wherever the
       reader came from, not to the redirect. */
    if (resolved.legacy && window.history && window.history.replaceState) {
      try { window.history.replaceState(null, "", tabRoute(params.slug, active)); }
      catch (error) { /* the tab is already rendered; the address bar lags */ }
    }

    bindVideo(root, item);
    bindPendingVideo(root, item);
    bindStepper(root);
    bindIndustryTabs(root);
    bindStack(root);

    /* The Contacts tab carries both forms, one per tab of the switch. Both are
       mounted at render, open or hidden, and the switch is bound after them so
       the tab it opens is already live. */
    if (active === "contacts") {
      if (window.FORMS) {
        var slot = root.querySelector("#product-demo-form");
        if (slot) window.FORMS.mount(slot, "demo", { product: item.slug });
        if (window.FORMS.mountKit) {
          window.FORMS.mountKit(root.querySelector("#" + KIT_ANCHOR), kitOptions(item));
        }
      }
      bindContactTabs(root, params && params.anchor);
    }

    centerActiveTab(root);

    var switched = lastView.slug === params.slug && lastView.tab !== active;
    lastView = { slug: params.slug, tab: active };

    if (switched) {
      var tabs = root.querySelector("#product-tabs");
      if (tabs) {
        var top = tabs.getBoundingClientRect().top + window.pageYOffset - 76;
        if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: "instant" });
      }
    }
  };

  product.title = function (params) {
    var item = findProduct(params.slug);
    return (item ? item.name + " — " : "") + C().site.title;
  };

  window.PAGES.product = product;
})();
