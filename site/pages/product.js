(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  var lastView = { slug: null, tab: null };

  function C() { return window.SITE_CONTENT; }
  function cfg(slug) { return window.SITE_CONFIG.products[slug] || {}; }
  /* The walkthrough and video links (round 12: links.json, via data/links.js). */
  function lnk(slug) { return (window.SITE_LINKS || {})[slug] || {}; }
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
    var id = youtubeId(lnk(product.slug).video);
    if (id) return "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg";
    return "";
  }

  /* A recording plays inside the page only where its host lets another site
     frame it: YouTube, Vimeo or a plain video file. A SharePoint or Stream
     link is a page that refuses to be framed and opens only for a signed-in
     viewer, so it opens in its own tab, as the walkthrough does. */
  function playsInPage(url) {
    return /youtube\.com|youtu\.be|youtube-nocookie\.com|vimeo\.com/i.test(url) ||
      /\.(mp4|webm|m4v|mov)(\?|#|$)/i.test(url);
  }

  /* The hero's frame (Alex, 2026-09-29: "a nice preview screen and play
     button overlay"): the product's own screen, `videoPoster`, under one round
     button. It opens the recording where links.json holds one, else the
     interactive walkthrough, else there is no frame and the hero is one
     column (round 18: nothing promises what does not exist). The glyph says
     which it opens: `play` for the recording, the badge's `cursor-click` for
     the walkthrough (round 9). The recording's frame carries its caption,
     which tells it apart from the walkthrough the CTA row opens beside it;
     the walkthrough's frame carries none, since that button already says it. */
  function heroMedia(product) {
    var UI = window.UI;
    var link = lnk(product.slug);
    var videoLink = link.video || "";
    var walkthrough = demoHref(link);
    if (!videoLink && !walkthrough) return "";
    var poster = posterFor(product);
    var caption = C().shared.videoCaption;
    var name = (videoLink ? caption : C().shared.demoCta) + " — " + product.name;
    var tag = "a";
    var hook;
    if (!videoLink) {
      hook = ' href="' + UI.esc(walkthrough) + '" target="_blank" rel="noopener"';
    } else if (playsInPage(videoLink)) {
      tag = "button";
      hook = ' type="button" data-video="' + UI.esc(videoLink) + '"' +
        ' data-video-title="' + UI.esc(product.name) + '"';
    } else {
      hook = ' href="' + UI.esc(videoLink) + '" target="_blank" rel="noopener"';
    }
    return '<div class="hero-media">' +
      "<" + tag + ' class="video-card' + (videoLink ? "" : " video-card--demo") +
        (poster ? "" : " video-card--plate") + '"' + hook + ' aria-label="' + UI.esc(name) + '">' +
        (poster
          ? '<img class="video-card-poster" src="' + UI.esc(poster) +
            '" alt="" loading="eager" decoding="async">'
          : "") +
        (videoLink ? '<span class="video-card-veil" aria-hidden="true"></span>' : "") +
        '<span class="video-card-play" aria-hidden="true">' +
          (videoLink ? UI.icon("play", "icon--solid") : UI.icon("cursor-click")) + "</span>" +
        (videoLink ? '<span class="video-card-caption" aria-hidden="true">' + UI.esc(caption) + "</span>" : "") +
      "</" + tag + "></div>";
  }

  /* Where the walkthrough button goes — the same resolution the demo badge
     uses, so the two controls cannot open different things (round 9). It lives
     in assets/app.js with the badge; the fallback keeps this page working if
     it is ever rendered without the shared layer. */
  function demoHref(link) {
    if (window.UI && typeof window.UI.demoHref === "function") return window.UI.demoHref(link);
    return link.interactiveDemo || "";
  }

  function heroCtas(product) {
    var UI = window.UI;
    var link = lnk(product.slug);
    var out = [UI.button({
      label: C().site.primaryCta.label,
      href: contactsRoute(product.slug),
      kind: "primary"
    })];
    /* The interactive walkthrough opens in its own tab: it is a self-contained
       page with its own guide, and a seller mid-call must not lose the product
       page behind it. Rendered only when an interactive demo is linked. One
       icon, the badge's own pointer, leading the label — the pointer is what
       says "walkthrough you click", so a trailing external glyph would only
       dilute it (round 10). */
    if (link.interactiveDemo) {
      out.push(UI.button({
        label: C().shared.demoCta, href: demoHref(link),
        kind: "secondary", icon: "cursor-click",
        attrs: { target: "_blank", rel: "noopener" }
      }));
    }
    /* No video button: a recording always has the frame beside this row, and
       the frame is the way to it. No Marketplace button either: the
       Marketplace badge in the chip row is the link to the listing; and no
       success-story button — the case study owns its one link out. */
    return '<div class="cta-row product-hero-cta">' + out.join("") + "</div>";
  }

  /* Three families, visibly different (VISUAL-GRAMMAR §1.2): the pattern chip
     and the technology pills at the left, the availability badges at the right
     end of the same row. `tags` repeats the category chip, then one platform
     label per facet — the renderer builds those from `category` and `facet`
     (one pill per platform, 2026-09-29), so it skips them rather than
     emitting the same run twice. */
  function heroChips(product) {
    var UI = window.UI;
    var facets = UI.productFacets(product);
    var chips = [UI.tagChip("pattern", product.category)].concat(facets.map(function (id) {
      return UI.tagChip("tech", id);
    }));
    (product.tags || []).slice(1 + facets.length).forEach(function (tag) {
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

    /* No photograph behind the copy (2026-09-29, PROVENANCE §55): the ground
       is softserveinc.com's detail-page hero gradient (site.css), and the one
       picture is the product's own screen in the frame. `hero.image` still
       feeds the catalog tile. */
    return '<section class="product-hero has-hero-bg' + (media ? " product-hero--media" : "") + '">' +
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
        heroCtas(product) +
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

  /* Round 20 (Alex: "too much text, heading indistinguishable from text, not
     sexy"): two plates side by side, equal height. The problem sits on the
     screen's one grey step, what changes on the tab's one dark plate; each is a
     shared eyebrow, a display headline and one short paragraph. No icons and no
     arrow: the pair reads left to right on its own. */
  function problemSolution(block) {
    var UI = window.UI;
    if (!block || !block.problem || !block.solution) return "";
    function plate(side, eyebrowKey, tone) {
      return '<article class="ps-plate ps-plate--' + tone + '">' +
        '<p class="eyebrow ps-eyebrow">' + UI.esc(label(eyebrowKey)) + "</p>" +
        '<h2 class="ps-headline">' + UI.esc(side.headline) + "</h2>" +
        '<p class="ps-copy">' + UI.esc(side.text) + "</p>" +
        "</article>";
    }
    return '<section class="ps-pair reveal">' +
      plate(block.problem, "problemEyebrow", "problem") +
      plate(block.solution, "solutionEyebrow", "solution") +
      "</section>";
  }

  /* How it works (round 20: the block fits one screen, the step heads line
     up, two sizes of type, screenshots large and legible). Round 21 (Alex,
     2026-09-29: the block shares the main column with the problem and the
     solution, the numbers widget beside it) put the steps in a row of tabs
     over one frame, because a list beside the frame left the frame too small
     to read in that column. Under the row, the open step's text, so the
     description sits between the control that selects it and the screen it
     explains (START-HERE §4); then the frame: the walkthrough's own screen at
     16:10, nothing drawn over it. Every step's text and frame share two row
     tracks, so switching steps never moves the frame. On a phone the block is
     the steps as static cards, each ending on its screen. Both layouts are in
     the markup and CSS shows one. */
  function howItWorks(product) {
    var UI = window.UI;
    var steps = product.overview.steps;
    if (!steps || !steps.length) return "";
    var base = "hiw-" + product.slug;

    var tabs = steps.map(function (step, index) {
      var on = index === 0;
      return '<button class="hiw-tab' + (on ? " is-active" : "") + '" type="button" role="tab"' +
        ' id="' + base + "-tab-" + index + '" aria-controls="' + base + "-panel-" + index + '"' +
        ' aria-selected="' + (on ? "true" : "false") + '" tabindex="' + (on ? "0" : "-1") + '">' +
        '<span class="hiw-tab-label"><span class="hiw-num nums">' + UI.esc(step.n) + "</span>" +
        '<span class="hiw-title">' + UI.esc(step.title) + "</span></span>" +
        "</button>";
    }).join("");

    /* The frame is the screenshot and nothing drawn over it (Alex,
       2026-09-29: "Just have screenshots without those callouts"): where a
       step needs the eye led, the screen itself shows the element selected
       or open, as the product would (docs/ASSETS.md §1). In the main column a
       screen reads as a layout, not as text, so the frame is a button that
       opens it full size. */
    function frame(step, index, className) {
      var shot = step.shot || {};
      var name = label("shotOpen") + ": " + step.title;
      return '<figure class="' + className + '">' +
        '<button class="hiw-open" type="button" aria-label="' + UI.esc(name) + '"' +
          ' data-shot="' + UI.esc(shot.full) + '" data-shot-alt="' + UI.esc(shot.alt) + '"' +
          ' data-shot-title="' + UI.esc(step.n + " · " + step.title) + '">' +
          '<span class="hiw-canvas"><span class="hiw-pic">' +
            '<img class="hiw-full" src="' + UI.esc(shot.full) + '" alt="' + UI.esc(shot.alt) + '"' +
              ' decoding="async" loading="' + (index === 0 ? "eager" : "lazy") + '">' +
          "</span></span>" +
          '<span class="hiw-open-mark" aria-hidden="true">' + UI.icon("expand") + "</span>" +
          /* A phone has no hover, so the button says what it does under the
             screen, as a link would (site.css shows it below 768px). */
          '<span class="hiw-open-cue" aria-hidden="true">' + UI.icon("expand") +
            "<span>" + UI.esc(label("shotOpen")) + "</span></span>" +
        "</button>" +
        "</figure>";
    }

    var panels = steps.map(function (step, index) {
      return '<div class="hiw-panel' + (index === 0 ? " is-active" : "") + '" role="tabpanel"' +
        ' id="' + base + "-panel-" + index + '" aria-labelledby="' + base + "-tab-" + index + '">' +
        '<p class="hiw-text">' + UI.esc(step.text) + "</p>" +
        frame(step, index, "hiw-shot") +
        "</div>";
    }).join("");

    var cards = steps.map(function (step, index) {
      return '<li class="hiw-card">' +
        '<h3 class="hiw-card-head"><span class="hiw-num nums">' + UI.esc(step.n) + "</span>" +
          '<span class="hiw-title">' + UI.esc(step.title) + "</span></h3>" +
        '<p class="hiw-text">' + UI.esc(step.text) + "</p>" +
        frame(step, index + 1, "hiw-card-shot") +
        "</li>";
    }).join("");

    return '<section class="hiw reveal" data-hiw="' + UI.esc(product.slug) + '">' +
      '<h2 class="h2 ov-h2" id="' + base + '-title">' + UI.esc(label("howItWorks")) + "</h2>" +
      '<div class="hiw-body">' +
        '<div class="hiw-tabs" role="tablist" aria-labelledby="' + base + '-title">' + tabs + "</div>" +
        '<div class="hiw-panels">' + panels + "</div>" +
      "</div>" +
      '<ol class="hiw-cards">' + cards + "</ol>" +
      "</section>";
  }

  /* Round 13 (Alex): the block prints no heading. It opens the Use cases tab,
     which already names it, and a row of industry tabs names its own cut, so
     "By industry" survives only as the tablist's accessible name.
     Round 20 (D-design §3): the tabs are text over one hairline, the selected
     one on a blue underline, and the selected industry is one split plate, as
     softserveinc.com sets its "Client Voice": the copy first, on #edf0f2, the
     problem and the solution each a heading over its text, then the
     photograph edge to edge. The selected tab names the industry one line
     above, so the plate does not print it a second time. */
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
        '<div class="ind-case">' +
          '<div class="ind-case-part">' +
            '<h3 class="ind-case-title">' + UI.esc(label("caseProblem")) + "</h3>" +
            '<p class="ind-case-text">' + UI.esc(item.problem) + "</p>" +
          "</div>" +
          '<div class="ind-case-part">' +
            '<h3 class="ind-case-title">' + UI.esc(label("caseSolution")) + "</h3>" +
            '<p class="ind-case-text">' + UI.esc(item.solution) + "</p>" +
          "</div>" +
        "</div>" +
        '<figure class="ind-figure"><img src="' + UI.esc(item.image) +
          '" alt="" decoding="async" loading="' + (first ? "eager" : "lazy") + '"' +
          (first ? ' fetchpriority="high"' : "") + "></figure>" +
        "</div>";
    }).join("");

    return '<section class="panel ind-block reveal" data-industry-tabs="' + UI.esc(product.slug) + '">' +
      '<div class="ind-tablist" role="tablist" aria-label="' + UI.esc(heading) + '">' + tabs + "</div>" +
      '<div class="ind-panels">' + panels + "</div>" +
      (product.overview.industriesNote
        ? '<p class="ind-note">' + UI.esc(product.overview.industriesNote) + "</p>"
        : "") +
      "</section>";
  }

  /* ————— the numbers widget (round 20 tiles, round 21 widget) —————
     What changes in your numbers (Alex: the ROI block was "too wordy, and too
     boring"; show the metric, "from X" or the potential range, and never a
     footnote, a method or a note to the reviewer). Two or three tiles; each is
     the fact dash, the metric and its kind, one figure, one small chart drawn
     from the metric's own numbers, the chart's labels as real text, one line
     and the owner. The chart is aria-hidden and carries nothing its labels row
     does not print. Round 21 (Alex, 2026-09-29: "ROI metrics look like widget
     on the right") set the tiles in one white card beside the main column,
     where round 20 had a full-bleed band between the plates and the screens. */

  /* The chart (round 21; Alex, 2026-09-29: the round-20 charts were "hard to
     understand from graphics", and "matching between number and the visual
     is absolutely unclear"). Each chart is the plainest comparison a
     dashboard has: one row per state, named Today and After, each a bar from
     the same zero line with its value printed at the bar's end, so no legend
     and no scale is left to decode. The tile's figure is always printed on
     the chart, in bold, on the mark it names: on the After row when it is the
     result (5–15 min), on Today's when it is the starting point (from weeks),
     as the After bar's lighter span when it is a change (+4 to +10%, on bars
     indexed to today), and on both rows when it is a pair (3.0 → 2.4%). A
     baseline with no promised end is one Today row: a meter when the number
     is a share of a whole (a 0–100 scale), ten dots when it is a count in ten,
     and no chart at all otherwise, where the figure alone is the tile. The
     bars are aria-hidden; the rows are text, so a screen reader hears
     "Today ~2 days, After ~30 min". */
  var KPI_FORMS = { compression: true, range: true, dumbbell: true, baseline: true };

  function share(v) {
    var n = Number(v);
    return isFinite(n) ? Math.round(Math.max(0, Math.min(1, n)) * 1000) / 1000 : 0;
  }

  /* `from`, where given, starts the bar that far along the axis: the gap row
     floats from the After bar's end to Today's. */
  function kpiBar(kind, value, from) {
    var v = share(value);
    var o = from ? share(from) : 0;
    /* Zero is judged on the value, not its rounded share: minutes against a
       fortnight rounds to 0 and still draws its 3px sliver; only a real 0
       ("3 → 0") draws nothing. */
    var zero = !(Number(value) > 0);
    return '<span class="kpi-bar kpi-bar--' + kind + (zero ? " is-zero" : "") +
      '" style="--v: ' + v + (o ? "; --o: " + o : "") + '" aria-hidden="true"></span>';
  }

  function kpiRow(name, marks, value, strong) {
    var UI = window.UI;
    return '<div class="kpi-row">' +
      '<span class="kpi-row-name">' + UI.esc(name) + "</span>" +
      '<span class="kpi-row-plot">' + marks +
        (value ? '<span class="kpi-row-value' + (strong ? " is-figure" : "") + '">' + UI.esc(value) + "</span>" : "") +
      "</span></div>";
  }

  function kpiChart(viz, figure) {
    var before = viz.before || {};
    var after = viz.after || {};
    var range = viz.range || {};
    var scale = viz.scale || {};
    var today = label("metricToday");
    var then = label("metricAfter");
    var text = figure.text;
    var rows = "";

    if (viz.form === "compression" || viz.form === "dumbbell") {
      var top = Math.max(Number(before.value), Number(after.value)) || 1;
      var pair = viz.form === "dumbbell";
      rows = kpiRow(today, kpiBar("today", before.value / top), before.label, pair || before.label === text) +
        kpiRow(then, kpiBar("after", after.value / top), after.label, pair || after.label === text);
      /* A figure that is the difference (about $250 between a $350 call and a
         $99 one) gets its own row, the gap drawn where it is. */
      if (viz.gap) {
        rows += kpiRow(viz.gap, kpiBar("span", (before.value - after.value) / top, after.value / top), text, true);
      }
    } else if (viz.form === "range") {
      /* Indexed to today = 100: up, After runs to 100 + lo solid and on to
         100 + hi lighter; down, it runs to 100 − hi solid and on to 100 − lo. */
      var lo = Number(range.lo);
      var hi = Number(range.hi);
      var up = viz.direction !== "down";
      var end = up ? 100 + hi : 100;
      var solid = up ? 100 + lo : 100 - hi;
      rows = kpiRow(today, kpiBar("today", 100 / end), before.label, false) +
        kpiRow(then, kpiBar("after", solid / end) + kpiBar("span", (hi - lo) / end), text, true);
    } else if (viz.form === "baseline") {
      var max = Number(scale.max);
      var value = Number(before.value);
      if (max === 100) {
        rows = kpiRow(today, '<span class="kpi-meter" aria-hidden="true">' + kpiBar("today", value / 100) + "</span>", text, true);
      } else if (max === 10 && value === Math.round(value)) {
        var dots = "";
        for (var i = 0; i < 10; i += 1) dots += '<span class="kpi-dot' + (i < value ? " is-on" : "") + '"></span>';
        rows = kpiRow(today, '<span class="kpi-dots" aria-hidden="true">' + dots + "</span>", text, true);
      } else {
        /* No whole to fill: the Today row alone, so the figure reads as
           today's number and never as the saving. */
        rows = kpiRow(today, "", text, true);
      }
    }
    /* An empty chart still takes its row, so the tiles' lines stay level. */
    return '<div class="kpi-chart' + (rows ? " kpi-chart--" + viz.form : "") + '">' + rows + "</div>";
  }

  /* The figure's width in ems of its own size, estimated per glyph, so the CSS
     can shrink a long figure to its tile and never a short one (site.css,
     .kpi-value). The prefix is set at 20px beside a 56px figure. */
  function figureEm(figure) {
    var text = String(figure.text || "");
    var em = 0;
    for (var i = 0; i < text.length; i += 1) {
      var ch = text.charAt(i);
      if (ch === " ") em += 0.28;
      else if (/[.,:;'’]/.test(ch)) em += 0.3;
      else if (ch === "%") em += 0.9;
      else if (ch === "→") em += 1;
      else if (/[mwMW]/.test(ch)) em += 0.86;
      else em += 0.6;
    }
    if (figure.prefix) em += (String(figure.prefix).length * 0.55 + 0.6) * 20 / 56;
    return Math.max(1, Math.round(em * 100) / 100);
  }

  function kpiTile(metric) {
    var UI = window.UI;
    var kind = (C().shared.metricKinds || {})[metric.kind] || {};
    var viz = metric.visual || {};
    var figure = metric.figure || {};
    var chart = KPI_FORMS[viz.form] ? kpiChart(viz, figure) : '<div class="kpi-chart"></div>';
    return '<article class="kpi">' +
      '<span class="kpi-dash" aria-hidden="true"></span>' +
      '<div class="kpi-head">' +
        '<h3 class="kpi-title">' + UI.esc(metric.title) + "</h3>" +
        (kind.chip
          ? '<span class="kpi-kind"' + (kind.tooltip ? ' title="' + UI.esc(kind.tooltip) + '"' : "") + ">" +
            UI.esc(kind.chip) + "</span>"
          : "") +
      "</div>" +
      '<p class="kpi-figure nums" style="--fig-em: ' + figureEm(figure) + '">' +
        (figure.prefix ? '<span class="kpi-prefix">' + UI.esc(figure.prefix) + "</span> " : "") +
        '<span class="kpi-value">' + UI.esc(figure.text) + "</span>" +
      "</p>" +
      chart +
      '<p class="kpi-line">' + UI.esc(metric.line) + "</p>" +
      '<p class="kpi-owner">' + UI.esc(label("metricOwner")) + " · " + UI.esc(metric.owner) + "</p>" +
      "</article>";
  }

  function outcomesBlock(product) {
    var UI = window.UI;
    var metrics = product.overview.metrics;
    if (!metrics || !metrics.length) return "";
    var id = "kpi-" + product.slug;
    /* One figure size per widget: every figure is sized to fit the longest,
       so peers never stand at two sizes side by side (site.css .kpi-value). */
    var widest = metrics.reduce(function (em, metric) { return Math.max(em, figureEm(metric.figure || {})); }, 1);
    return '<section class="kpi-widget reveal" aria-labelledby="' + id + '" data-kpi-widget style="--fig-em-max: ' + widest + '">' +
      '<h2 class="kpi-widget-title" id="' + id + '">' + UI.esc(label("outcomes")) + "</h2>" +
      '<div class="kpi-grid kpi-grid--' + metrics.length + '">' +
        metrics.map(function (metric) { return kpiTile(metric); }).join("") +
      "</div>" +
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

  /* Round 21 (Alex, 2026-09-29, option b: "Problem solution and the How it
     works taking the central space (left; 4/7 to 2/3 of width); and ROI
     metrics look like widget on the right"): from 1240px the tab is a 2fr
     main column, the problem and what changes over How it works, beside the
     numbers widget in a 1fr column (site.css). The markup keeps round 20's
     order of the argument (the problem and what changes, the numbers, the
     screens), which is the one-column order below 1240px and the order a
     screen reader reads. The More detail disclosure is gone (round 20);
     `scope`, `features` and each step's `features` stay in the data,
     unrendered. The industry cases and the case study
     are the Use cases tab's (round 10). */
  function overviewTab(product) {
    return problemSolution(product.overview.problemSolution) +
      outcomesBlock(product) +
      howItWorks(product);
  }

  /* ————— tab: use cases ————— */

  /* One column at the full content width, no rail: the industry tabs, then the
     case study where one ships. Four products carry `caseStudy: null` and the
     tab is the industries block alone — no empty state (VISUAL-GRAMMAR). */
  function useCasesTab(product) {
    return industryCases(product) + caseStudy(product);
  }

  /* ————— tab: technology ————— */

  /* Round 22 (Alex, 2026-09-29: "I don't like current Technology tabs … we
     have beautiful diagrams in one-pagers … use or follow them … You can have
     some one-liner explainers etc added, but no more than that"): the tab is
     his wireframe's two blocks, the data-flow strip and the Oracle products
     widget, with one line under the strip for what the picture cannot show.
     No heading, no narrative, no layer stack, no capability list.

     The strip is the pack one-pager's composition at web scale
     (Oracle-Packaging-Skills, one-pager `_flow_from_architecture`): the
     systems on the left, the source on top and a destination-only system
     under it, one labelled pipe into the cloud and one back out, and the
     cloud box holding the app and the engine. Where the source is also the
     destination (a write-back), the column holds one box and both pipes
     touch it. Below 720px the strip turns to run top to bottom. */
  /* A short hyphenated name ("AI-Q") stays whole in a narrow box; a long one
     ("Repair-or-replace") may still break at its hyphen, or it would overflow
     the box at 1240px. Returns escaped HTML. */
  function flowText(text) {
    return window.UI.esc(text).split(/(\s+)/).map(function (part) {
      return /^\S{1,6}-\S{1,6}$/.test(part) ? '<span class="compound">' + part + "</span>" : part;
    }).join("");
  }

  function flowBox(box, className) {
    if (!box || !box.name) return "";
    return '<div class="' + className + '">' +
      '<span class="flow-name">' + flowText(box.name) + "</span>" +
      (box.note ? '<span class="flow-note">' + flowText(box.note) + "</span>" : "") +
      "</div>";
  }

  function flowPipe(text, direction) {
    return '<div class="flow-pipe flow-pipe--' + direction + '">' +
      '<span class="flow-pipe-label">' + flowText(text) + "</span>" +
      '<span class="flow-pipe-line" aria-hidden="true"></span>' +
      "</div>";
  }

  var FLOW_LINK = '<svg class="flow-link" viewBox="0 0 28 12" aria-hidden="true" focusable="false">' +
    '<path d="M2 6h24M6.5 1.5 2 6l4.5 4.5M21.5 1.5 26 6l-4.5 4.5"></path></svg>';

  function flowStrip(diagram) {
    var UI = window.UI;
    var d = diagram || {};
    if (!d.source || !d.platform || !d.app || !d.engine) return "";
    var systems = [flowBox(d.source, "flow-sys")].concat((d.destinations || []).map(function (box) {
      return flowBox(box, "flow-sys flow-sys--dest");
    })).join("");
    return '<div class="flow-strip' + ((d.destinations || []).length ? "" : " flow-strip--loop") + '">' +
        '<div class="flow-systems">' + systems + "</div>" +
        '<div class="flow-pipes">' + flowPipe(d.toPlatform, "in") + flowPipe(d.fromPlatform, "out") + "</div>" +
        '<div class="flow-cloud">' +
          '<p class="flow-cloud-label">' +
            '<span class="flow-cloud-name">' + flowText(d.platform.label) + "</span>" +
            (d.platform.services ? '<span class="flow-cloud-services">' + flowText(d.platform.services) + "</span>" : "") +
          "</p>" +
          '<div class="flow-cloud-inner">' +
            flowBox(d.app, "flow-node") + FLOW_LINK + flowBox(d.engine, "flow-node") +
          "</div>" +
        "</div>" +
      "</div>";
  }

  /* The widget names the Oracle products in play, one registry for all nine
     products (`shared.oracleProducts`), so a system carries the same name and
     the same glyph on every page; only its role line is the product's own.
     Platforms first, then the Oracle applications the product reads from or
     writes to. */
  function oracleWidget(product) {
    var UI = window.UI;
    var reg = C().shared.oracleProducts || {};
    var items = reg.items || {};
    var picks = ((product.technology || {}).oracle || []).filter(function (pick) { return items[pick.id]; });
    if (!picks.length) return "";
    function group(key) {
      var rows = picks.filter(function (pick) { return items[pick.id].group === key; });
      if (!rows.length) return "";
      return '<div class="op-group">' +
        '<p class="op-group-label">' + UI.esc((reg.groups || {})[key] || "") + "</p>" +
        '<ul class="op-list">' + rows.map(function (pick) {
          var item = items[pick.id];
          return '<li class="op-item">' +
            '<span class="op-icon" aria-hidden="true">' + UI.icon(item.icon) + "</span>" +
            '<span class="op-copy">' +
              '<span class="op-name">' + UI.esc(item.name) + "</span>" +
              '<span class="op-role">' + UI.esc(pick.role) + "</span>" +
            "</span>" +
            "</li>";
        }).join("") + "</ul>" +
        "</div>";
    }
    var id = "op-title-" + product.slug;
    return '<aside class="op-widget" aria-labelledby="' + id + '">' +
      '<h2 class="op-title" id="' + id + '">' + UI.esc(reg.title) + "</h2>" +
      group("platform") + group("connected") +
      "</aside>";
  }

  function technologyTab(product) {
    var UI = window.UI;
    var tech = product.technology || {};
    return '<section class="panel reveal tech">' +
      '<div class="tech-grid">' +
        '<figure class="flow">' +
          flowStrip(tech.diagram) +
          (tech.line ? '<figcaption class="flow-line">' + UI.esc(tech.line) + "</figcaption>" : "") +
        "</figure>" +
        oracleWidget(product) +
      "</div>" +
      "</section>";
  }

  /* ————— tab: delivery ————— */

  /* Round 22 (Alex, 2026-09-29: rename Jumpstart to Delivery; "same structure
     and content as we have in packaging table in our one-pager. Add approx.
     duration of phases (with very short footnote that it's confirmed at
     scoping); don't add prices. Everything else should be gone from this
     tab."): the one-pager's service-packages table without its price rows.
     The three tiers with their scope line, a duration row, one row per
     capability area with a mark and a phrase in every cell, the legend and
     the one footnote. The tiers, the durations and the footnote are the
     site's (`shared.delivery`); the scope lines and the rows are the
     product's. From 900px it is one table; below, one block per tier, since
     four columns do not fit a phone. Both are rendered and CSS shows one. */
  var MARKS = ["partial", "included", "advanced", "none"];

  function markOf(cell) {
    var mark = (cell || {}).mark;
    return MARKS.indexOf(mark) === -1 ? "none" : mark;
  }

  function markText(mark, product) {
    var shared = C().shared.delivery || {};
    if (mark === "advanced" && product.delivery && product.delivery.advanced) return product.delivery.advanced;
    return (shared.marks || {})[mark] || mark;
  }

  function deliveryCell(cell, product) {
    var UI = window.UI;
    var mark = markOf(cell);
    return '<span class="pk-cell">' +
      '<span class="pk-mark pk-mark--' + mark + '" aria-hidden="true"></span>' +
      '<span class="sr-only">' + UI.esc(markText(mark, product)) + ". </span>" +
      (cell && cell.text ? '<span class="pk-text">' + UI.esc(cell.text) + "</span>" : "") +
      "</span>";
  }

  function tierHead(tier, scope, tag) {
    var UI = window.UI;
    return "<" + tag + ' class="pk-tier-name">' + UI.esc(tier.name) +
        ' <span class="pk-size">' + UI.esc(tier.size) + "</span>" +
      "</" + tag + ">" +
      (scope ? '<p class="pk-scope">' + UI.esc(scope) + "</p>" : "");
  }

  function deliveryTab(product) {
    var UI = window.UI;
    var shared = C().shared.delivery || {};
    var tiers = shared.tiers || [];
    var d = product.delivery || {};
    var scope = d.scope || [];
    var rows = d.rows || [];
    var star = '<span class="pk-star" aria-hidden="true">*</span>';
    /* The standing durations are the site's; a product overrides them only where its own evidence differs. */
    var durations = (d.durations && d.durations.length === tiers.length) ? d.durations : tiers.map(function (tier) { return tier.duration; });

    var head = '<tr><td class="pk-corner"></td>' + tiers.map(function (tier, i) {
      return '<th scope="col" class="pk-tier pk-tier--' + UI.esc(tier.id) + '">' + tierHead(tier, scope[i], "span") + "</th>";
    }).join("") + "</tr>";

    var duration = '<tr class="pk-row pk-row--duration"><th scope="row">' + UI.esc(shared.durationLabel) + star + "</th>" +
      tiers.map(function (tier, i) {
        return '<td class="pk-duration">' + UI.esc(durations[i]) + "</td>";
      }).join("") + "</tr>";

    var body = rows.map(function (row) {
      return '<tr class="pk-row"><th scope="row">' + UI.esc(row.area) + "</th>" +
        (row.cells || []).map(function (cell) { return "<td>" + deliveryCell(cell, product) + "</td>"; }).join("") +
        "</tr>";
    }).join("");

    var cards = tiers.map(function (tier, i) {
      return '<section class="pk-card pk-card--' + UI.esc(tier.id) + '">' +
        '<div class="pk-card-head">' +
          tierHead(tier, scope[i], "h2") +
          '<p class="pk-card-duration">' + UI.esc(shared.durationLabel) + ": " +
            '<span class="pk-duration">' + UI.esc(durations[i]) + "</span>" + star + "</p>" +
        "</div>" +
        '<dl class="pk-card-rows">' + rows.map(function (row) {
          return "<div><dt>" + UI.esc(row.area) + "</dt><dd>" + deliveryCell((row.cells || [])[i], product) + "</dd></div>";
        }).join("") + "</dl>" +
        "</section>";
    }).join("");

    var used = MARKS.filter(function (mark) {
      return rows.some(function (row) { return (row.cells || []).some(function (cell) { return markOf(cell) === mark; }); });
    });
    var legend = used.map(function (mark) {
      return '<span class="pk-key"><span class="pk-mark pk-mark--' + mark + '" aria-hidden="true"></span>' +
        UI.esc(markText(mark, product)) + "</span>";
    }).join("");

    return '<section class="panel reveal pk">' +
      '<div class="pk-scroll"><table class="pk-table">' +
        '<caption class="sr-only">' + UI.esc(shared.caption || "") + "</caption>" +
        "<thead>" + head + "</thead><tbody>" + duration + body + "</tbody>" +
      "</table></div>" +
      '<div class="pk-cards">' + cards + "</div>" +
      '<div class="pk-foot">' +
        '<p class="pk-legend">' + legend + "</p>" +
        '<p class="pk-note">' + star + UI.esc(shared.footnote) + "</p>" +
      "</div>" +
      "</section>";
  }

  /* ————— tab: contacts ————— */

  /* The tab's own anchor: every kit link points at the form itself rather than
     at this route, because a same-route ROUTER.go re-renders the page and wipes
     whatever the reader has typed. */
  function talkHref(slug) { return contactsRoute(slug) + "#" + window.UI.contactAnchors.talk; }

  /* The product's sales-kit request (round 8), which round 10 moved off its own
     tab and onto the Contacts tab, and round 10b made the second tab of the
     switch: a page that repeats one form under two names is a structure bug,
     and two open forms on one screen are a second one. Since round 12 the kit
     is emailed automatically from links.json, the repo's one links file, and
     nothing about its contents is rendered here. A customer or partner who
     lands in the kit is routed back to the ask beside it, which is also what
     the confirmation offers. There is no kit for all offers to offer next
     (Alex, 2026-09-29), so the confirmation closes on the ask alone. */
  function kitOptions(product) {
    var tab = C().salesKit.tab;
    return {
      product: product.slug,
      routeLink: { label: tab.routeLabel, href: talkHref(product.slug) },
      next: [
        { text: tab.nextDemo, link: { label: tab.nextDemoLink, href: talkHref(product.slug) } }
      ]
    };
  }

  /* One row, and one form on the screen (round 10b): the contact switch, which
     the home page's last screen renders from the same function (UI.contactSwitch,
     round 18). Alex's correction behind it: the kit has to be reachable without
     scrolling, and two live input forms on one screen make the reader choose
     between two asks. The card needs no "Contacts" H3 — the tab already says
     it. Round 13 (Alex): the card names two people, the partnership contact and
     the product's own lead from `shared.people`, over the one practice address.
     What is this product's own: its lead, the ask preselected on it, and the
     kit fixed to it. */
  function contactsTab(product) {
    var UI = window.UI;
    var lead = product.contactPerson && (C().shared.people || {})[product.contactPerson];
    if (!window.FORMS && !UI.contactCard()) return UI.empty(C().forms.demo.sub);
    return '<section class="panel reveal">' +
        UI.contactSwitch({
          key: product.slug,
          product: product.slug,
          people: lead ? [lead] : [],
          kitBody: C().salesKit.tab.body.replace("{product}", product.name),
          kitOptions: kitOptions(product)
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
    else if (active === "delivery") body = deliveryTab(item);
    else if (active === "contacts") body = contactsTab(item);
    else body = overviewTab(item);

    return hero(item) + tabbar(item, active) +
      '<section class="section section--tight section--tabs"><div class="wrap tab-body' +
        (active === "overview" ? " tab-body--overview" : "") + '" id="tab-body">' +
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

  /* Only a recording that playsInPage() reaches here: a SharePoint or Stream
     link is rendered as a link to its own tab, because its page refuses to be
     framed on another site. */
  function bindVideo(root, item) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-video]"), function (button) {
      button.addEventListener("click", function () {
        var url = button.getAttribute("data-video");
        var title = button.getAttribute("data-video-title") || item.name;
        var embed = /youtube\.com|youtu\.be|youtube-nocookie\.com|vimeo\.com/i.test(url)
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

  /* `axis` is "horizontal", "vertical" or "both". How it works takes both: its
     steps are a row of tabs, and a list beside the frame from 1100 to 1239px. */
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

  /* One step open at a time: its tab carries the blue underline and its panel
     shows its text at once while its frame crossfades in over the last one
     (CSS, 200ms). ← → ↑ ↓ Home and End move between the steps. The phone's
     cards are static and take no binding. */
  function bindHowItWorks(root) {
    var block = root.querySelector("[data-hiw]");
    if (!block) return;
    var tabs = Array.prototype.slice.call(block.querySelectorAll(".hiw-tab"));
    var panels = Array.prototype.slice.call(block.querySelectorAll(".hiw-panel"));
    if (!tabs.length) return;

    function select(index) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.setAttribute("tabindex", on ? "0" : "-1");
        tab.classList.toggle("is-active", on);
      });
      panels.forEach(function (panel, i) {
        panel.classList.toggle("is-active", i === index);
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { select(index); });
    });
    roving(tabs, select, "both");

    /* A screen opens full size in the site's modal, its step named over it. */
    Array.prototype.forEach.call(block.querySelectorAll(".hiw-open"), function (button) {
      button.addEventListener("click", function () {
        var UI = window.UI;
        var title = button.getAttribute("data-shot-title");
        UI.modal.open('<h2 class="h3 modal-title">' + UI.esc(title) + "</h2>" +
          '<p class="modal-shot-hint">' + UI.esc(label("shotPan")) + "</p>" +
          '<div class="modal-shot-wrap"><img class="modal-shot" src="' + UI.esc(button.getAttribute("data-shot")) + '"' +
            ' alt="' + UI.esc(button.getAttribute("data-shot-alt")) + '"></div>',
          { label: title, className: "modal-panel--media modal-panel--shot" });
      });
    });
  }

  /* Round 21: beside the main column the numbers widget stays in view under
     the tab bar (site.css makes it sticky), but only while all of it fits the
     window; a taller one (three tiles on a laptop) scrolls with the page, so
     its foot is never cut off. Measured on mount, on resize and when the brand
     faces arrive; one listener for the page's lifetime. */
  var kpiWidget = null;

  function measureKpiWidget() {
    if (!kpiWidget || !kpiWidget.isConnected) return;
    kpiWidget.classList.remove("is-tall");
    var style = window.getComputedStyle(kpiWidget);
    if (style.position !== "sticky") return;
    var top = parseFloat(style.top) || 0;
    kpiWidget.classList.toggle("is-tall", top + kpiWidget.offsetHeight + 16 > window.innerHeight);
  }

  window.addEventListener("resize", measureKpiWidget);

  function bindKpiWidget(root) {
    kpiWidget = root.querySelector("[data-kpi-widget]");
    if (!kpiWidget) return;
    measureKpiWidget();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureKpiWidget);
  }

  /* Round 20: the industry tabs are one row over one hairline, and a row too
     long for its width scrolls sideways, as the tab bar above it does, so an
     underline never floats on a wrapped line. The fade that says the row goes
     on is drawn only while it overflows, measured without the fade's own end
     padding so the class cannot hold itself on. One resize listener for the
     page's lifetime; it measures whichever row is on screen. */
  var industryRow = null;

  function measureIndustryRow() {
    if (!industryRow || !industryRow.isConnected) return;
    industryRow.classList.remove("is-scrolling");
    industryRow.classList.toggle("is-scrolling", industryRow.scrollWidth > industryRow.clientWidth + 1);
  }

  window.addEventListener("resize", measureIndustryRow);

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

    industryRow = block.querySelector(".ind-tablist");
    measureIndustryRow();
    /* The row's width changes when the brand faces arrive. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureIndustryRow);
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
    bindHowItWorks(root);
    bindKpiWidget(root);
    bindIndustryTabs(root);

    /* The Contacts tab carries both forms, one per tab of the switch; the
       shared mount binds both and then the switch (assets/app.js). */
    if (active === "contacts") {
      window.UI.mountContactSwitch(root, { product: item.slug, kitOptions: kitOptions(item) },
        params && params.anchor);
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
