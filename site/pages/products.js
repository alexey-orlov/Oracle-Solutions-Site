(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  var EMPTY = { tech: "", cat: "", demo: false, mp: false, q: "" };

  var state = Object.assign({}, EMPTY);

  function readState(query) {
    var q = query || {};
    var techIds = window.SITE_CONTENT.facets.technology.map(function (f) { return f.id; });
    var catIds = window.SITE_CONTENT.facets.categories.map(function (c) { return c.id; });
    state = {
      tech: techIds.indexOf(q.tech) >= 0 ? q.tech : "",
      cat: catIds.indexOf(q.cat) >= 0 ? q.cat : "",
      demo: q.demo === "1",
      mp: q.mp === "1",
      q: typeof q.q === "string" ? q.q : ""
    };
  }

  function hashForState() {
    var parts = [];
    if (state.tech) parts.push("tech=" + encodeURIComponent(state.tech));
    if (state.cat) parts.push("cat=" + encodeURIComponent(state.cat));
    if (state.demo) parts.push("demo=1");
    if (state.mp) parts.push("mp=1");
    if (state.q) parts.push("q=" + encodeURIComponent(state.q));
    return "#/products" + (parts.length ? "?" + parts.join("&") : "");
  }

  /* Both artifact facets read exactly what the badges read, so a filter and a
     badge can never disagree about whether the thing exists. Round 9: the
     interactive demo is a walkthrough at `demoUrl`, not the `video` flag — that
     one only decides whether the product page carries a video frame. */
  function hasFlag(product, option) {
    if (option === "demo") return window.UI.hasDemo(product.slug);
    var entry = window.SITE_CONFIG.products[product.slug] || {};
    return entry.marketplace === true;
  }

  /* Both availability checkboxes always render, with the faceted count beside
     them, and both query flags are honored. The group is part of the rail's
     shape, not a function of today's config: hiding a box when its count is
     zero moved the rail under the reader between visits and hid the one filter
     a seller reaches for first. */
  function availabilityOptions() {
    return window.SITE_CONTENT.facets.availability.options || [];
  }

  function haystack(product) {
    var UI = window.UI;
    return [
      product.name,
      product.oneLiner,
      product.subLine || "",
      product.statusNote || "",
      product.categoryChip,
      UI.facetLabel(product.facet).label,
      UI.facetLabel(product.facet).fullLabel,
      product.tags.join(" "),
      product.tile.outcomes.join(" ")
    ].join(" ").toLowerCase();
  }

  function matches(product, filters) {
    if (filters.tech && product.facet !== filters.tech) return false;
    if (filters.cat && product.category !== filters.cat) return false;
    if (filters.demo && !hasFlag(product, "demo")) return false;
    if (filters.mp && !hasFlag(product, "marketplace")) return false;
    if (filters.q) {
      var needle = filters.q.trim().toLowerCase();
      if (needle && haystack(product).indexOf(needle) < 0) return false;
    }
    return true;
  }

  function filtered(overrides) {
    var filters = Object.assign({}, state, overrides || {});
    return window.UI.orderedProducts().filter(function (product) {
      return matches(product, filters);
    });
  }

  function resultsHtml() {
    var UI = window.UI;
    var C = window.SITE_CONTENT;
    var list = filtered();
    if (list.length) {
      return list.map(function (product, index) {
        return UI.productTile(product, { eager: index < 2 });
      }).join("");
    }
    if (state.tech && !state.cat && !state.demo && !state.mp && !state.q) {
      return UI.empty(UI.facetLabel(state.tech).emptyState);
    }
    /* Round 9: a group tile on the home page links straight here, so a group
       whose products are all still engagements has to answer for itself —
       the same branch the platform facets take, in the group's own words. */
    if (state.cat && !state.tech && !state.demo && !state.mp && !state.q) {
      var category = C.facets.categories.filter(function (item) {
        return item.id === state.cat;
      })[0];
      if (category && category.emptyState) return UI.empty(category.emptyState);
    }
    return UI.empty(C.facets.noResults);
  }

  /* A facet that can only ever return an empty result is a dead end on a page
     someone demos live, so a zero-count option renders unclickable. The count
     is optional: it is what a click on that option returns, so the option that
     clears the group carries none. */
  function railOption(options) {
    var UI = window.UI;
    /* A count says what a click would return. Zero says what is not here, so
       it renders no number — the one option that can reach zero is the active
       one a saved link selected, and the grid's empty state speaks for it. */
    var counted = typeof options.count === "number" && options.count > 0;
    var empty = options.count === 0 && !options.on;
    return '<button class="rail-option' + (empty ? " is-empty" : "") +
      '" type="button" role="radio" tabindex="' + (options.on ? "0" : "-1") + '"' +
      (empty ? ' disabled aria-disabled="true"' : "") +
      ' data-group="' + UI.esc(options.group) +
      '" data-value="' + UI.esc(options.value) + '" aria-checked="' + (options.on ? "true" : "false") + '"' +
      (options.title ? ' title="' + UI.esc(options.title) + '"' : "") + ">" +
      '<span class="rail-option-label">' + UI.esc(options.label) + "</span>" +
      (counted ? '<span class="rail-option-count nums">' + UI.esc(options.count) + "</span>" : "") +
      "</button>";
  }

  /* One checkbox per availability flag, faceted the way the radio groups are:
     the count is what the result would be if this box alone were ticked, and a
     box that can only ever return nothing is disabled rather than a dead end. */
  function availabilityCheck(option) {
    var UI = window.UI;
    var key = option.id === "marketplace" ? "mp" : option.id;
    var on = !!state[key];
    var override = {};
    override[key] = true;
    var count = filtered(override).length;
    var dead = count === 0 && !on;
    return '<label class="checkline' + (dead ? " is-empty" : "") + '">' +
      '<input type="checkbox" data-avail="' + UI.esc(key) + '"' +
        (on ? " checked" : "") + (dead ? " disabled" : "") + ">" +
      '<span class="rail-option-label">' + UI.esc(option.label) + "</span>" +
      '<span class="rail-option-count nums">' + UI.esc(count) + "</span>" +
      "</label>";
  }

  function railHtml() {
    var UI = window.UI;
    var C = window.SITE_CONTENT;
    var avail = availabilityOptions();

    /* Round 9 (Alex): both radio groups are FIXED lists — every platform a
       product can run on, every group, always in canonical order, so the rail
       has one shape whatever the catalog holds today. A count is what a click
       returns; zero prints no number and its option is unclickable, unless it is
       the one a deep link arrived on, which renders selected above its own empty
       state. "Oracle AI for Fusion Applications" carries `catalog: false` and is
       not offered at all: no product runs on it, and it is on the page as a
       platform the practice delivers on, not as a filter. */
    var tech = [railOption({
      group: "tech", value: "", label: C.facets.allLabel, on: !state.tech
    })].concat(C.facets.technology.filter(function (facet) {
      return facet.catalog !== false || state.tech === facet.id;
    }).map(function (facet) {
      return railOption({
        group: "tech", value: facet.id, label: facet.label, title: facet.fullLabel,
        on: state.tech === facet.id, count: filtered({ tech: facet.id }).length
      });
    })).join("");

    var cats = [railOption({
      group: "cat", value: "", label: C.facets.allLabel, on: !state.cat
    })].concat(C.facets.categories.map(function (category) {
      return railOption({
        group: "cat", value: category.id, label: category.chip, title: category.full,
        on: state.cat === category.id, count: filtered({ cat: category.id }).length
      });
    })).join("");

    return '<div class="rail-group">' +
        '<p class="rail-label" id="facet-tech-label">' + UI.esc(C.facets.technologyLabel) + "</p>" +
        '<div class="rail-options" role="radiogroup" aria-labelledby="facet-tech-label">' + tech + "</div>" +
      "</div>" +
      '<div class="rail-group">' +
        '<p class="rail-label" id="facet-cat-label">' + UI.esc(C.facets.categoryLabel) + "</p>" +
        '<div class="rail-options" role="radiogroup" aria-labelledby="facet-cat-label">' + cats + "</div>" +
      "</div>" +
      '<div class="rail-group">' +
        '<p class="rail-label" id="facet-avail-label">' + UI.esc(C.facets.availability.label) + "</p>" +
        '<div class="rail-checks" role="group" aria-labelledby="facet-avail-label">' +
          avail.map(availabilityCheck).join("") +
        "</div>" +
      "</div>" +
      '<div class="rail-group">' +
        '<button class="btn btn--quiet btn--sm rail-clear" type="button" id="facet-clear">' +
          UI.icon("close") + "<span>" + UI.esc(C.facets.clearLabel) + "</span></button>" +
      "</div>";
  }

  function isFiltered() {
    return !!(state.tech || state.cat || state.demo || state.mp || state.q.trim());
  }

  /* The line reports what a filter returned, not how big the catalog is, so
     with nothing filtered it says nothing. The element itself stays in the
     DOM either way: it is the live region that announces the next change. */
  /* A count is what a filter returned, never the size of the catalog — so no
     denominator, nothing when no filter is on, and nothing at zero: the grid's
     own empty state says that better than a nought would. */
  function countLine() {
    if (!isFiltered()) return "";
    var shown = filtered().length;
    if (!shown) return "";
    return String(shown) + (shown === 1 ? " product" : " products");
  }

  function products(params) {
    var UI = window.UI;
    var C = window.SITE_CONTENT;
    var page = C.productsPage;
    readState(params && params.query);

    return '<section class="section section--tight">' +
        '<div class="wrap products-head">' +
          '<p class="eyebrow eyebrow--accent">' + UI.esc(C.site.owner) + " · " + UI.esc(C.site.tagline) + "</p>" +
          '<h1 class="h1">' + UI.esc(page.title) + "</h1>" +
          '<p class="lead products-intro">' + UI.esc(page.intro) + "</p>" +
          '<div class="search-field products-search">' + UI.icon("search") +
            '<label class="sr-only" for="product-search">' + UI.esc(page.searchPlaceholder) + "</label>" +
            '<input class="input" type="search" id="product-search" placeholder="' +
              UI.esc(page.searchPlaceholder) + '" value="' + UI.esc(state.q) + '">' +
          "</div>" +
        "</div>" +
      "</section>" +
      '<section class="section section--flush-top">' +
        '<div class="wrap">' +
          '<div class="rail-layout">' +
            '<aside class="rail" id="facet-rail" aria-label="' + UI.esc(C.facets.technologyLabel) + '">' +
              railHtml() +
            "</aside>" +
            '<div class="rail-content">' +
              '<div class="results-bar">' +
                '<p class="results-count" id="results-count" role="status" aria-live="polite">' +
                  UI.esc(countLine()) + "</p>" +
              "</div>" +
              '<div class="ptile-grid" id="product-results">' + resultsHtml() + "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +
      '<section class="closing">' +
        '<div class="wrap closing-inner">' +
          "<div>" +
            '<h2 class="h2">' + UI.esc(page.bottomBlock.heading) + "</h2>" +
            '<p class="lead" style="margin-top:1.25rem">' + UI.esc(page.bottomBlock.body) + "</p>" +
          "</div>" +
          '<div class="cta-row">' +
            UI.button({
              label: page.bottomBlock.cta.label.replace(/\s*→\s*$/, ""),
              href: page.bottomBlock.cta.route, kind: "primary"
            }) +
            UI.button({ label: "See the services", href: "#/services", kind: "quiet" }) +
          "</div>" +
        "</div>" +
      "</section>";
  }

  function revealNow(container) {
    var nodes = container.querySelectorAll(".reveal");
    window.setTimeout(function () {
      Array.prototype.forEach.call(nodes, function (node) { node.classList.add("is-in"); });
    }, 0);
  }

  products.mount = function (params, root) {
    var rail = root.querySelector("#facet-rail");
    var results = root.querySelector("#product-results");
    var count = root.querySelector("#results-count");
    var search = root.querySelector("#product-search");
    if (!rail || !results) return;

    function sync(keepFocus) {
      var active = keepFocus ? document.activeElement : null;
      var activeKey = active && active.getAttribute ?
        (active.getAttribute("data-group") || "") + ":" + (active.getAttribute("data-value") || "") : null;
      rail.innerHTML = railHtml();
      results.innerHTML = resultsHtml();
      count.textContent = countLine();
      if (activeKey && activeKey !== ":") {
        var next = rail.querySelector('[data-group="' + activeKey.split(":")[0] +
          '"][data-value="' + activeKey.split(":")[1] + '"]');
        if (next) next.focus();
      }
      if (window.history && window.history.replaceState) {
        try { window.history.replaceState(null, "", hashForState()); } catch (error) { }
      }
      revealNow(results);
    }

    rail.addEventListener("click", function (event) {
      var option = event.target.closest(".rail-option");
      if (option) {
        var group = option.getAttribute("data-group");
        state[group] = option.getAttribute("data-value");
        sync(true);
        return;
      }
      if (event.target.closest("#facet-clear")) {
        state = Object.assign({}, EMPTY);
        if (search) search.value = "";
        sync(false);
      }
    });

    rail.addEventListener("change", function (event) {
      var key = event.target.getAttribute && event.target.getAttribute("data-avail");
      if (!key) return;
      state[key] = event.target.checked;
      sync(false);
      var next = rail.querySelector('[data-avail="' + key + '"]');
      if (next && !next.disabled) next.focus();
    });

    rail.addEventListener("keydown", function (event) {
      var option = event.target.closest(".rail-option");
      if (!option) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      var group = option.parentNode.querySelectorAll(".rail-option");
      var index = Array.prototype.indexOf.call(group, option);
      var step = event.key === "ArrowDown" ? 1 : group.length - 1;
      var next = null;
      for (var hop = 1; hop < group.length; hop += 1) {
        var candidate = group[(index + step * hop) % group.length];
        if (candidate && !candidate.disabled) { next = candidate; break; }
      }
      if (!next) return;
      next.focus();
      next.click();
    });

    if (search) {
      search.addEventListener("input", function () {
        state.q = search.value;
        results.innerHTML = resultsHtml();
        count.textContent = countLine();
        rail.innerHTML = railHtml();
        if (window.history && window.history.replaceState) {
          try { window.history.replaceState(null, "", hashForState()); } catch (error) { }
        }
        revealNow(results);
      });
      search.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && search.value) {
          search.value = "";
          state.q = "";
          sync(false);
        }
      });
    }
  };

  products.title = function () {
    return window.SITE_CONTENT.productsPage.title.charAt(0) +
      window.SITE_CONTENT.productsPage.title.slice(1).toLowerCase() +
      " — " + window.SITE_CONTENT.site.title;
  };

  window.PAGES.products = products;
})();
