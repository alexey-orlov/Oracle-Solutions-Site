#!/usr/bin/env node
/**
 * mail-preview.js — renders every email the site's forms cause into
 * .work/mail-preview/, with an index page, using the same mail/render.js the
 * sender runs (round 12). Open .work/mail-preview/index.html in a browser.
 *
 *   node tools/mail-preview.js            today's links.json
 *   node tools/mail-preview.js --sample   every empty kit link filled with a
 *                                         placeholder, to see the full layout
 *   node tools/mail-preview.js --copy <path>   a draft copy.json instead of mail/copy.json
 *
 * Images point at mail/img/*.png on disk; the sender attaches them inline.
 */

"use strict";

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var OUT = path.join(ROOT, ".work", "mail-preview");
var render = require(path.join(ROOT, "mail", "render.js"));

function arg(name) {
  var i = process.argv.indexOf(name);
  return i === -1 ? null : (process.argv[i + 1] || "");
}
function readJson(rel) { return JSON.parse(fs.readFileSync(path.isAbsolute(rel) ? rel : path.join(ROOT, rel), "utf8")); }

var sample = process.argv.indexOf("--sample") !== -1;
var links = readJson("links.json");
if (sample) {
  Object.keys(links.products).forEach(function (slug) {
    var entry = links.products[slug];
    ["onePager", "salesDeck", "featureList", "video"].forEach(function (key) {
      if (!entry[key]) entry[key] = "https://example.invalid/" + slug + "/" + key;
    });
  });
}
var ctx = {
  links: links,
  catalog: readJson("mail/catalog.json"),
  copy: readJson(arg("--copy") || "mail/copy.json"),
  settings: readJson("mail/settings.json"),
  /* A stand-in for the deployment, which the repo never holds (mail/README.md). */
  deployment: { testInbox: "test-inbox@example.invalid", fromName: "The sender", fromAddress: "sender@example.invalid" },
  imageSrc: function (key) { return "../../mail/img/" + render.IMAGE_FILES[key]; }
};

var PAGE = "https://oracle-ai-solutions.example/#/products/workforce-optimization/contacts";
var people = {
  demo: { form: "demo", name: "Dana Whitfield", email: "dana.whitfield@oracle.com", company: "Oracle", role: "oracle-seller",
    product: "workforce-optimization", consent: true, page: PAGE,
    message: "A utilities account in the UK plans field work in spreadsheets.\nThey want to see the proof of value scope before their Q4 budget review." },
  contact: { form: "contact", name: "Marcus Bell", email: "marcus.bell@example.com", company: "A regional utility", role: "customer",
    product: "", consent: true, page: "https://oracle-ai-solutions.example/#/services", message: "" }
};

fs.mkdirSync(OUT, { recursive: true });
var index = [];
var asRead = [];

/* The email as its reader meets it: From, Reply-To, Subject, the inbox preview,
   then the visible body in reading order, a thumbnail shown as [picture: …].
   This file, not copy.json, is what a copy review reads (client-documents.md:
   a message read outside the product stands alone). */
function visible(html) {
  return html.replace(/^[^]*?<body[^>]*>/, "").replace(/<div style="display:none[^]*?<\/div>/, "")
    .replace(/<img [^>]*alt="([^"]*)"[^>]*>/g, "[picture: $1] ")
    .replace(/<\/(p|h1|h2|tr|table)>/g, "\n").replace(/<br>/g, "\n").replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&middot;/g, "·").replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ").split("\n").map(function (l) { return l.trim(); }).filter(Boolean).join("\n");
}
function preheaderOf(html) {
  var m = html.match(/<div style="display:none[^>]*>([^]*?)<\/div>/);
  return m ? visible(m[1]) : "";
}
function write(file, mail, note) {
  fs.writeFileSync(path.join(OUT, file), mail.html);
  index.push('<li><a href="' + file + '">' + file + "</a> · to <code>" + mail.to + "</code> · <strong>" +
    mail.subject.replace(/</g, "&lt;") + "</strong>" + (note ? " <em>(" + note + ")</em>" : "") + "</li>");
  var dep = ctx.deployment;
  asRead.push("==== " + file + (note ? " (" + note + ")" : "") + " ====\n" +
    "From: " + dep.fromName + " <" + dep.fromAddress + ">\nTo: " + mail.to +
    "\nReply-To: " + (mail.replyTo || render.replyTo(ctx.settings, dep)) +
    "\nSubject: " + mail.subject + "\nInbox preview: " + preheaderOf(mail.html) + "\n\n" + visible(mail.html));
}
function must(result) {
  if (!result.ok) throw new Error("sample request refused: " + result.code + " — " + result.reason);
  return result.request;
}

/* The kit, one product at a time, then all offers, then the practice's copies. */
ctx.catalog.products.forEach(function (p) {
  var request = must(render.validate({ form: "kit", email: "dana.whitfield@oracle.com", product: p.slug, consent: true, page: PAGE }, ctx));
  write("kit-" + p.slug + ".html", render.renderKit(request, ctx));
});
var allRequest = must(render.validate({ form: "kit", email: "dana.whitfield@oracle.com", product: "all", consent: true, page: PAGE }, ctx));
var allKit = render.renderKit(allRequest, ctx);
write("kit-all.html", allKit);

var oneRequest = must(render.validate({ form: "kit", email: "dana.whitfield@oracle.com", product: "workforce-optimization", consent: true, page: PAGE }, ctx));
var oneKit = render.renderKit(oneRequest, ctx);
write("internal-kit-sent.html", render.renderInternal(oneRequest, ctx, { status: "sent", kits: oneKit.kits }));
write("internal-kit-sent-all.html", render.renderInternal(allRequest, ctx, { status: "sent", kits: allKit.kits }));
write("internal-kit-failed.html", render.renderInternal(oneRequest, ctx, { status: "failed", kits: oneKit.kits, error: "SMTP 554: sample failure" }), "what the practice sees when the send failed");
write("internal-demo.html", render.renderInternal(must(render.validate(people.demo, ctx)), ctx));
write("internal-contact.html", render.renderInternal(must(render.validate(people.contact, ctx)), ctx));

fs.writeFileSync(path.join(OUT, "as-read.txt"), asRead.join("\n\n") + "\n");
fs.writeFileSync(path.join(OUT, "index.html"),
  '<!DOCTYPE html><meta charset="utf-8"><title>Mail preview</title>' +
  '<body style="font:15px/1.6 system-ui,sans-serif;margin:32px;max-width:980px">' +
  "<h1>Mail preview" + (sample ? " (sample links)" : "") + "</h1>" +
  "<p>mode <code>" + ctx.settings.mode + "</code> · renderer " + render.VERSION + " · copy <code>" + (arg("--copy") || "mail/copy.json") + "</code></p>" +
  "<ul>" + index.join("") + '</ul><p><a href="as-read.txt">as-read.txt</a>: every email as its reader receives it. Review copy there.</p></body>');
console.log("mail-preview: wrote " + index.length + " emails and as-read.txt to .work/mail-preview/" + (sample ? " (sample links)" : ""));
