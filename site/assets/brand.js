/**
 * brand.js — one indirection for the brand marks, so a theme can swap them.
 *
 * Loaded FIRST, before data/ and pages/. A theme entry (index.html) sets
 * window.BRAND before this file runs; every logo path in the tree goes through
 * brandAsset(key, fallback), which returns the theme's file when the theme
 * declares one and the original dark-theme file otherwise. The default theme
 * (index.html) sets nothing, so every fallback wins and nothing moves.
 */
(function () {
  "use strict";

  window.BRAND = window.BRAND || {};

  window.brandAsset = function (key, fallback) {
    var v = window.BRAND[key];
    return (typeof v === "string" && v) ? v : fallback;
  };
}());
