/* Internal review panel: TEMPORARY, for the prototype only.
   Renders the "Internal" button (bottom right) and a checklist of the
   assumptions still to be confirmed, from window.SITE_REVIEW
   (data/review.js). Ticks are saved in this browser only (localStorage).
   Self-contained: the styles are injected from here, and the code touches
   nothing outside its own two elements. Before launch, delete this file,
   data/review.js and their two <script> tags (docs/START-HERE.md §8). */
(function () {
  "use strict";

  var DATA = window.SITE_REVIEW;
  if (!DATA || DATA.enabled === false || !DATA.groups) return;

  var TICKS_KEY = "oracle-ai-solutions:review-ticks";
  var OPEN_KEY = "oracle-ai-solutions:review-open";

  var CLOSE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* Amber marks everything internal, so the panel never reads as part of the
     site; teal stays the site's own accent. */
  var CSS = [
    ".review-toggle, .review-panel { --review-amber: #F2B544; --review-note: #FF9F8F; }",
    ".review-toggle[hidden], .review-panel[hidden] { display: none; }",
    ".review-toggle {",
    "  position: fixed; right: 1rem; bottom: 1rem; z-index: 84;",
    "  display: inline-flex; align-items: center; gap: .5rem; min-height: 2.75rem;",
    "  padding: .375rem .875rem .375rem .375rem; border-radius: 9999px;",
    "  background: #0B0B0B; border: 1px dashed var(--review-amber); color: var(--text, #F1F0FD);",
    "  font: 600 .8125rem/1 var(--font-body, sans-serif); cursor: pointer;",
    "  box-shadow: 0 .5rem 1.5rem rgba(0, 0, 0, .55);",
    "}",
    ".review-toggle:hover { background: #1C1A14; }",
    ".review-toggle:focus-visible, .review-close:focus-visible, .review-check:focus-visible { outline: 2px solid var(--review-amber); outline-offset: 3px; }",
    ".review-tag {",
    "  padding: .375rem .5rem; border-radius: 9999px; background: var(--review-amber); color: #131313;",
    "  font: 700 .6875rem/1 var(--font-display, sans-serif); letter-spacing: .08em; text-transform: uppercase;",
    "}",
    ".review-panel {",
    "  position: fixed; top: 0; right: 0; bottom: 0; z-index: 85;",
    "  display: flex; flex-direction: column; width: min(26rem, 100%);",
    "  background: var(--bg-raised, #181818); color: var(--text-body, #CFD6DC);",
    "  border-top: 3px solid var(--review-amber); border-left: 1px solid var(--border-panel, rgba(255, 255, 255, .16));",
    "  box-shadow: -1.5rem 0 3rem rgba(0, 0, 0, .55); font-family: var(--font-body, sans-serif);",
    "  animation: review-in .25s ease-out;",
    "}",
    "@keyframes review-in { from { transform: translateX(1.5rem); opacity: 0; } to { transform: none; opacity: 1; } }",
    ".review-head { position: relative; padding: 1.125rem 1.25rem .875rem; border-bottom: 1px solid var(--border-panel, rgba(255, 255, 255, .16)); }",
    ".review-eyebrow {",
    "  margin: 0 0 .375rem; color: var(--review-amber);",
    "  font: 700 .6875rem/1.2 var(--font-display, sans-serif); letter-spacing: .1em; text-transform: uppercase;",
    "}",
    ".review-title {",
    "  margin: 0 0 .375rem; padding-right: 3rem; color: var(--text, #F1F0FD);",
    "  font: 900 1.375rem/1.1 var(--font-display, sans-serif); text-transform: uppercase;",
    "}",
    ".review-title:focus { outline: none; }",
    ".review-progress { margin: 0; color: var(--text-note, #9FB3C6); font-size: .8125rem; }",
    ".review-close {",
    "  position: absolute; top: .625rem; right: .75rem; display: grid; place-items: center;",
    "  width: 2.75rem; height: 2.75rem; padding: 0; border-radius: 9999px; cursor: pointer;",
    "  background: transparent; color: var(--text, #F1F0FD); border: 1px solid var(--border-panel, rgba(255, 255, 255, .16));",
    "}",
    ".review-close:hover { border-color: var(--review-amber); }",
    ".review-body { flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 0 1.25rem 1rem; }",
    ".review-group-title {",
    "  margin: 1rem 0 .125rem; color: var(--text-muted, #C2CDD8);",
    "  font: 700 .6875rem/1.2 var(--font-display, sans-serif); letter-spacing: .08em; text-transform: uppercase;",
    "}",
    ".review-list { list-style: none; margin: 0; padding: 0; }",
    ".review-item + .review-item { border-top: 1px solid var(--border-panel, rgba(255, 255, 255, .16)); }",
    ".review-row { display: grid; grid-template-columns: 1.125rem 1fr; gap: .75rem; align-items: start; padding: .625rem 0; cursor: pointer; }",
    ".review-check { width: 1.125rem; height: 1.125rem; margin: .125rem 0 0; accent-color: var(--review-amber); cursor: pointer; }",
    ".review-text { display: block; color: var(--text, #F1F0FD); font-size: .9375rem; line-height: 1.4; }",
    ".review-note { display: block; margin-top: .125rem; color: var(--review-note); font-size: .8125rem; line-height: 1.4; }",
    ".review-item.is-done .review-text { color: var(--text-dim, #7C93AB); text-decoration: line-through; }",
    ".review-item.is-done .review-note { opacity: .55; }",
    ".review-foot { margin: 0; padding: .75rem 1.25rem; border-top: 1px solid var(--border-panel, rgba(255, 255, 255, .16)); color: var(--text-dim, #7C93AB); font-size: .75rem; }",
    "@media (max-width: 480px) { .review-toggle { right: .75rem; bottom: .75rem; } }",
    "@media (prefers-reduced-motion: reduce) { .review-panel { animation: none; } }",
    "@media print { .review-toggle, .review-panel { display: none !important; } }"
  ].join("\n");

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  var ITEMS = [];
  DATA.groups.forEach(function (group) {
    (group.items || []).forEach(function (item) { if (item && item.id) ITEMS.push(item); });
  });

  /* Ticks live in this browser only. Storage can be missing or throw (a
     private window, blocked site data): the list still works for the visit,
     and the footer says the ticks will not be kept. */
  function loadTicks() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(TICKS_KEY) || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch (e) {
      return {};
    }
  }

  function saveTicks(ticks) {
    try {
      window.localStorage.setItem(TICKS_KEY, JSON.stringify(ticks));
      return true;
    } catch (e) {
      return false;
    }
  }

  var ticks = loadTicks();

  function doneCount() {
    return ITEMS.filter(function (item) { return ticks[item.id] === true; }).length;
  }

  function itemHtml(item) {
    var done = ticks[item.id] === true;
    return '<li class="review-item' + (done ? " is-done" : "") + '">' +
      '<label class="review-row">' +
        '<input class="review-check" type="checkbox" data-review-id="' + esc(item.id) + '"' + (done ? " checked" : "") + ">" +
        "<span>" +
          '<span class="review-text">' + esc(item.text) + "</span>" +
          (item.note ? '<span class="review-note">' + esc(item.note) + "</span>" : "") +
        "</span>" +
      "</label>" +
    "</li>";
  }

  function panelHtml() {
    return '<div class="review-head">' +
        (DATA.eyebrow ? '<p class="review-eyebrow">' + esc(DATA.eyebrow) + "</p>" : "") +
        '<h2 class="review-title" id="review-title" tabindex="-1">' + esc(DATA.title) + "</h2>" +
        '<p class="review-progress" aria-live="polite"></p>' +
        '<button type="button" class="review-close" aria-label="Close the checklist">' + CLOSE_SVG + "</button>" +
      "</div>" +
      '<div class="review-body">' +
        DATA.groups.map(function (group) {
          return '<section class="review-group">' +
            '<h3 class="review-group-title">' + esc(group.title) + "</h3>" +
            '<ul class="review-list">' + (group.items || []).map(itemHtml).join("") + "</ul>" +
          "</section>";
        }).join("") +
      "</div>" +
      '<p class="review-foot">' + esc(DATA.footer || "") + "</p>";
  }

  function mount() {
    var style = document.createElement("style");
    style.id = "review-style";
    style.textContent = CSS;
    document.head.appendChild(style);

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "review-toggle";
    toggle.setAttribute("aria-controls", "review-panel");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<span class="review-tag">Internal</span><span class="review-toggle-text"></span>';

    var panel = document.createElement("aside");
    panel.className = "review-panel";
    panel.id = "review-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "review-title");
    panel.hidden = true;
    panel.innerHTML = panelHtml();

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    function renderCounts() {
      var done = doneCount();
      var open = ITEMS.length - done;
      toggle.querySelector(".review-toggle-text").textContent = open ? open + " to confirm" : "All confirmed";
      panel.querySelector(".review-progress").textContent = done + " of " + ITEMS.length + " confirmed";
    }
    renderCounts();

    panel.addEventListener("change", function (event) {
      var box = event.target.closest(".review-check");
      if (!box) return;
      var id = box.getAttribute("data-review-id");
      if (box.checked) ticks[id] = true;
      else delete ticks[id];
      box.closest(".review-item").classList.toggle("is-done", box.checked);
      renderCounts();
      if (!saveTicks(ticks)) {
        panel.querySelector(".review-foot").textContent = "This browser can't keep the ticks: they last until you reload.";
      }
    });

    /* Open or closed survives a reload in the same tab: a republish reloads
       open previews, and a reviewer should not lose the list mid-read. */
    function rememberOpen(open) {
      try {
        if (open) window.sessionStorage.setItem(OPEN_KEY, "1");
        else window.sessionStorage.removeItem(OPEN_KEY);
      } catch (e) { /* storage unavailable: the panel just starts closed */ }
    }

    function setOpen(open, moveFocus) {
      panel.hidden = !open;
      toggle.hidden = open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      rememberOpen(open);
      if (moveFocus === false) return;
      if (open) panel.querySelector(".review-title").focus();
      else toggle.focus();
    }

    toggle.addEventListener("click", function () { setOpen(true); });
    panel.querySelector(".review-close").addEventListener("click", function () { setOpen(false); });

    /* Capture phase, so this runs before app.js closes its modal: while a
       site modal is open, Escape belongs to the modal. */
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || panel.hidden) return;
      if (document.querySelector(".modal-backdrop")) return;
      setOpen(false);
    }, true);

    var reopen = false;
    try { reopen = window.sessionStorage.getItem(OPEN_KEY) === "1"; } catch (e) { reopen = false; }
    if (reopen) setOpen(true, false);
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
