(function () {
  "use strict";

  window.PAGES = window.PAGES || {};

  function C() { return window.SITE_CONTENT; }

  /* ————— #/sellers: the sales kit for all offers (round 8) ————— */

  /* One screen with a URL a seller can paste into a thread: the kit request with
     the product select visible (All offers first), then the demo route for a
     seller who already has an account in mind. Customers and partners who land
     here are routed out by the form's own line and its domain error. */
  function kitOptions() {
    var page = C().salesKit.page;
    return {
      routeLink: { label: page.routeLink.label, href: page.routeLink.route },
      again: true
    };
  }

  function sellers() {
    var UI = window.UI;
    var page = C().salesKit.page;

    return '<section class="section sellers-page"><div class="wrap sellers-wrap">' +
      '<div class="panel panel--gate panel--kit" id="sales-kit">' +
        '<p class="eyebrow eyebrow--accent">' + UI.esc(page.eyebrow) + "</p>" +
        '<h1 class="h2 sellers-title">' + UI.esc(page.title) + "</h1>" +
        '<p class="body-text">' + UI.esc(page.body) + "</p>" +
        (window.FORMS && window.FORMS.renderKit ? window.FORMS.renderKit(kitOptions()) : "") +
      "</div>" +
      '<div class="panel panel--cta sellers-pov">' +
        '<h2 class="h3 block-title">' + UI.esc(page.povTitle) + "</h2>" +
        '<p class="body-text">' + UI.esc(page.povBody) + "</p>" +
        '<p><button class="link-arrow link-button" type="button" id="sellers-demo"><span>' +
          UI.esc(page.povLink) + "</span>" + UI.icon("arrow") + "</button></p>" +
      "</div>" +
      "</div></section>";
  }

  sellers.mount = function (params, root) {
    if (window.FORMS && window.FORMS.mountKit) window.FORMS.mountKit(root.querySelector("#sales-kit"), kitOptions());

    /* The existing demo modal, with nothing preselected: both audiences use it. */
    var demo = root.querySelector("#sellers-demo");
    if (demo && window.FORMS) {
      demo.addEventListener("click", function () {
        window.UI.modal.open(
          window.FORMS.render("demo", { role: null }),
          { label: C().forms.demo.heading }
        );
        var panel = document.querySelector(".modal-panel");
        if (panel) window.FORMS.mount(panel, "demo");
      });
    }
  };

  sellers.title = function () {
    return C().salesKit.page.eyebrow + " — " + C().site.title;
  };

  window.PAGES.sellers = sellers;
})();
