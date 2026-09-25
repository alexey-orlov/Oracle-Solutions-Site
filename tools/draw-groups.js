#!/usr/bin/env node
/* The six home group tiles' line drawings, as one program so they stay one
   family (round 17, PROVENANCE §37; ASSETS.md §2b).

     node tools/draw-groups.js            writes site/assets/img/groups/<id>.svg
     node tools/draw-groups.js --sheet    also writes .work/group-sheets/sheet-<w>.svg:
                                          the 3 x 2 grid on the real fills at 400,
                                          343 and 300 px tiles, square, so
                                          `qlmanage -t -s <side>` renders it 1:1

   The style is softserveinc.com's Our Offers tile: one thin black line,
   oversized and cropped by the tile's top and left edges, gathering into one
   filled spark at the group's moment of value. Every drawing is a list of
   stroked elements plus one spark. The spark is the design answer's
   construction: a hub and three tips (back and forward on the line, 60 from
   the hub; the thorn, 60 to 90), each side a cubic from tip to tip whose
   controls sit K of the way from their tips to the hub. K = 0.68 matches the
   reference's thorn at tile scale. Change a composition here and re-run; the
   checker (checkGroupDrawing) holds each file to the family. */
"use strict";

var fs = require("fs");
var path = require("path");

var root = path.resolve(__dirname, "..");
var OUT = path.join(root, "site/assets/img/groups");
var K = 0.68;
var INK = "#1a1a1a";
var LINE = 'stroke="' + INK + '" stroke-width="1.75" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" fill="none"';

var r1 = function (v) { return Math.round(v * 10) / 10; };
var P = function (pt) { return r1(pt[0]) + " " + r1(pt[1]); };
/* a point at distance L from `from`, heading `deg` (SVG: 0 right, 90 down) */
function at(from, deg, L) {
  var a = deg * Math.PI / 180;
  return [from[0] + L * Math.cos(a), from[1] + L * Math.sin(a)];
}
function heading(a, b) { return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; }
/* the point on a circle at chord L from `from` (itself on the circle), one way round */
function chordOnCircle(c, R, from, L, dirSign) {
  var th = Math.atan2(from[1] - c[1], from[0] - c[0]);
  var d = 2 * Math.asin(L / (2 * R)) * dirSign;
  return [c[0] + R * Math.cos(th + d), c[1] + R * Math.sin(th + d)];
}
function pathEl(d) { return '<path d="' + d + '" ' + LINE + "/>"; }
function circleEl(c, r) { return '<circle cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" r="' + r1(r) + '" ' + LINE + "/>"; }
/* the spark; `push` moves the back and forward controls (the T form's back side) */
function sparkEl(hub, back, fwd, thorn, push) {
  function c(t) { return [t[0] + K * (hub[0] - t[0]), t[1] + K * (hub[1] - t[1])]; }
  var cb = c(back), cf = c(fwd), ct = c(thorn);
  if (push) { cb = [cb[0] + push[0], cb[1] + push[1]]; cf = [cf[0] + push[0], cf[1] + push[1]]; }
  return '<path data-spark="" fill="' + INK + '" d="M' + P(back) + "C" + P(cb) + " " + P(cf) + " " + P(fwd) +
    "C" + P(cf) + " " + P(ct) + " " + P(thorn) + "C" + P(ct) + " " + P(cb) + " " + P(back) + 'Z"/>';
}

var D = {};

/* Enterprise knowledge & analytics: the governed estate as two rings; the
   question runs in along the outer ring, the answer sparks, and its trace
   lands on the inner ring, the source. */
D["knowledge-analytics"] = (function () {
  var c = [40, -50], hub = [211, 104], tailEnd = [110, 83];
  return [
    circleEl(c, 150),
    pathEl("M269.1 -30A230 230 0 0 1 " + P(hub) + "L" + P(tailEnd)),
    sparkEl(hub, chordOnCircle(c, 230, hub, 60, -1), at(hub, heading(hub, tailEnd), 60), [239, 190])
  ];
})();

/* Deep research & investigation: an agent threads three systems, goes past
   the last one to the outside, turns, and brings the answer back through
   them; the answer sparks between the first two and drops toward the copy.
   The forward arm is free: the line ends at the hub. */
D["deep-research"] = (function () {
  var hub = [160, 112], turnC = [338, 76], turnR = 28;
  var legStart = [turnC[0], turnC[1] + turnR];
  var dirIn = heading(legStart, hub);
  var wave = "M-20 44C20 44 44 32 80 34S140 58 180 58S240 38 280 38S316 48 " + P([turnC[0], turnC[1] - turnR]) +
    "A" + turnR + " " + turnR + " 0 0 1 " + P(legStart) + "L" + P(hub);
  return [
    pathEl("M80 -20V150"), pathEl("M180 -20V168"), pathEl("M280 -20V142"),
    pathEl(wave),
    sparkEl(hub, at(hub, dirIn + 180, 60), at(hub, dirIn + 60, 52), at(hub, dirIn + 300, 84))
  ];
})();

/* Document processing: a long page read pass by pass; the values leave
   through its edge as checked data, where the line sparks. */
D["documents"] = [
  pathEl("M40 -20V172H250V-20"),
  pathEl("M80 -20V14A16 16 0 0 0 96 30H210A22 22 0 0 1 210 74H80A22 22 0 0 0 80 118H262L292 66"),
  sparkEl([262, 118], [202, 118], [292, 66], [302, 187.3])
];

/* Transaction & process execution: a step carried up through the system,
   stage by stage, to its edge, where a person approves what leaves. */
D["transactions"] = [
  pathEl("M300 -20V146A40 40 0 0 1 260 186H-20"),
  pathEl("M-20 164H50A21.3 21.3 0 0 0 70 150A21.3 21.3 0 0 1 90 136H130A21.3 21.3 0 0 0 150 122A21.3 21.3 0 0 1 170 108H210A21.3 21.3 0 0 0 230 94A21.3 21.3 0 0 1 250 80H312L342 132"),
  sparkEl([312, 80], [252, 80], [342, 132], [352, 10.7])
];

/* Forecasting & optimization: three constraints come in at once and resolve
   at the spark into one plan, which rises away off the top. */
D["forecasting-optimization"] = (function () {
  var hub = [240, 100], planEnd = at(hub, 300, 124);
  return [
    pathEl("M-20 36C50 30 110 46 160 60S215 85 " + P(hub)),
    pathEl("M-20 100C30 90 90 100 150 100L" + P(hub) + "L" + P(planEnd)),
    pathEl("M-20 164C50 170 110 156 160 140S215 115 " + P(hub)),
    sparkEl(hub, [180, 100], at(hub, 300, 60), at(hub, 60, 80))
  ];
})();

/* Video & image intelligence: a camera's field of view from just off the
   top-left corner; the spark on its upper edge flags the one object in view.
   The line runs straight through the hub, so the spark is the T form. */
D["video-image"] = (function () {
  var apex = [-16, -12], hA = 12, hB = 52;
  var tA = Math.tan(hA * Math.PI / 180);
  var hub = [250, apex[1] + (250 - apex[0]) * tA];
  var endA = [372, apex[1] + (372 - apex[0]) * tA];
  var endB = at(apex, hB, (190 - apex[1]) / Math.sin(hB * Math.PI / 180));
  return [
    pathEl("M" + P(apex) + "L" + P(endA)),
    pathEl("M" + P(apex) + "L" + P(endB)),
    circleEl([236, 130], 18),
    sparkEl(hub, at(hub, hA + 180, 60), at(hub, hA, 60), at(hub, hA + 90, 60), at([0, 0], hA - 90, 4))
  ];
})();

var ORDER = ["knowledge-analytics", "deep-research", "documents", "transactions", "forecasting-optimization", "video-image"];

ORDER.forEach(function (id) {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" fill="none">\n  ' + D[id].join("\n  ") + "\n</svg>\n";
  fs.writeFileSync(path.join(OUT, id + ".svg"), svg);
});
console.log("draw-groups: wrote " + ORDER.length + " drawings to site/assets/img/groups/");

if (process.argv.indexOf("--sheet") > -1) {
  /* the fills, read from the site so the sheet cannot drift from it */
  var css = fs.readFileSync(path.join(root, "site/assets/site.css"), "utf8");
  var box = { window: { brandAsset: function (k, d) { return d; } } };
  require("vm").runInNewContext(fs.readFileSync(path.join(root, "site/data/content.js"), "utf8"), box);
  var tones = {};
  box.window.SITE_CONTENT.facets.categories.forEach(function (c) { tones[c.id] = c.tone; });
  var fill = function (id) { return (css.match(new RegExp("\\.gtile--" + tones[id] + " \\{ --tile-fill: (#[0-9a-f]{6}); \\}", "i")) || [])[1] || "#ffffff"; };
  var dir = path.join(root, ".work/group-sheets");
  fs.mkdirSync(dir, { recursive: true });
  [400, 343, 300].forEach(function (w) {
    var gap = 24, h = Math.round(w * 1.19), S = Math.max(w * 3 + gap * 2, h * 2 + gap), s = w / 400, dh = w * 0.55;
    var cells = ORDER.map(function (id, i) {
      var x = (i % 3) * (w + gap), y = Math.floor(i / 3) * (h + gap);
      var bars = '<g fill="' + INK + '" opacity=".5">' +
        '<rect x="' + 32 * s + '" y="' + (dh + 20 * s) + '" width="' + 280 * s + '" height="' + 24 * s + '"/>' +
        '<rect x="' + 32 * s + '" y="' + (dh + 52 * s) + '" width="' + 170 * s + '" height="' + 24 * s + '"/>' +
        [0, 1, 2, 3].map(function (j) { return '<rect x="' + 32 * s + '" y="' + (dh + (96 + j * 23) * s) + '" width="' + (j === 3 ? 180 : 330 - j * 6) * s + '" height="' + 9 * s + '"/>'; }).join("") + "</g>";
      return '<g transform="translate(' + x + " " + y + ')"><rect width="' + w + '" height="' + h + '" fill="' + fill(id) + '"/>' +
        '<svg width="' + w + '" height="' + dh + '" viewBox="0 0 400 220" overflow="hidden" fill="none">' + D[id].join("") + "</svg>" + bars + "</g>";
    }).join("");
    fs.writeFileSync(path.join(dir, "sheet-" + w + ".svg"), '<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '" viewBox="0 0 ' + S + " " + S + '"><rect width="' + S + '" height="' + S + '" fill="#fff"/>' + cells + "</svg>");
  });
  console.log("draw-groups: wrote the contact sheets to .work/group-sheets/ (render with qlmanage -t -s <side>)");
}
