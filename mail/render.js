/**
 * mail/render.js — validates a form submission from the site and renders every
 * email it causes (round 12). One file, no dependencies, so the same code runs
 * in the n8n workflow that sends the mail and in tools/mail-preview.js, which
 * renders every variant to .work/mail-preview/ for review.
 *
 * Inputs are the repo's own files, read by the caller:
 *   links     links.json            the kit links, per product, and siteUrl
 *   catalog   mail/catalog.json     product names, role labels, kit names (generated)
 *   copy      mail/copy.json        every word of every email
 *   settings  mail/settings.json    test or live, the practice inbox, limits
 * and one object the repo never holds, because it belongs to whoever runs the sender:
 *   deployment { testInbox, fromName, fromAddress }   (mail/README.md, "Deployment")
 *
 * Exports: validate(body, ctx) · renderKit(request, ctx) · renderInternal(request, ctx, kitResult)
 * · replyTo(settings, deployment) · toGraph(message, attachments),
 * where ctx = { links, catalog, copy, settings, deployment, imageSrc(key) }. imageSrc turns an
 * artifact key into the <img src>: "cid:…" when sending, a file path in the preview.
 *
 * Every render returns a transport-neutral message, the contract any sender maps:
 *   { to, replyTo, subject, html, text, images: [{ key, cid, file }] }
 * images are the pictures the HTML references as cid:<cid>, to attach inline from
 * the repo file named. toGraph() maps a message to Microsoft Graph sendMail.
 */
"use strict";

var VERSION = "2026-09-23.2";

var ARTIFACT_KEYS = ["productPage", "onePager", "salesDeck", "featureList", "interactiveDemo", "video"];
var IMAGE_FILES = {
  productPage: "product-page.png",
  onePager: "one-pager.png",
  salesDeck: "sales-deck.png",
  featureList: "feature-list.png",
  interactiveDemo: "interactive-demo.png",
  video: "video.png"
};
var FORMS = ["demo", "contact", "kit"];
var EMAIL_RE = /^[^\s@<>()"',;:\\]+@[^\s@<>()"',;:\\]+\.[a-z]{2,}$/i;

/* Brand tokens (docs/SS26-THEME.md), reduced to what an email client renders. */
var INK = "#000000";
var BODY = "#26292b";
var MUTED = "#4c5156";
var ACTION = "#1485c4";
var ACCENT = "#f46a4a";
var CARD = "#edf0f2";
var HAIRLINE = "#e1e7eb";
var SELECT = "#c1dff4";
var DANGER = "#c74040";
var DANGER_TINT = "#fbe3e0";
var SERIF = "Georgia, 'Times New Roman', serif";
var SANS = "Arial, Helvetica, sans-serif";

/* ————— text helpers ————— */

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* One line, no control characters: for subjects, headers and table cells. */
function line(value) {
  return String(value == null ? "" : value).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

/* Multi-line user text: control characters out, line breaks kept. */
function block(value) {
  return String(value == null ? "" : value).replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function fill(template, vars) {
  return String(template || "").replace(/\{([a-zA-Z]+)\}/g, function (match, key) {
    return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match;
  });
}

/* Escapes the template and the values, so a token can never carry markup. */
function fillHtml(template, vars) {
  var safe = {};
  Object.keys(vars).forEach(function (k) { safe[k] = esc(vars[k]); });
  return fill(esc(template), safe);
}

function domainAllowed(email, domains) {
  var at = email.lastIndexOf("@");
  var domain = at >= 0 ? email.slice(at + 1).toLowerCase() : "";
  return (domains || []).some(function (allowed) {
    return domain === allowed || domain.slice(-(allowed.length + 1)) === "." + allowed;
  });
}

/* The calendar day a request arrived on, in the practice's time zone, as a
   UTC midnight so day arithmetic cannot drift across a DST change. */
function localDay(iso, timeZone) {
  var date = iso ? new Date(iso) : new Date();
  if (isNaN(date.getTime())) date = new Date();
  var ymd;
  try {
    ymd = new Intl.DateTimeFormat("en-CA", { timeZone: timeZone || "UTC", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  } catch (error) {
    ymd = date.toISOString().slice(0, 10);
  }
  var p = ymd.split("-");
  return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
}

/* "Within two working days", as a date the reader does not have to work out. */
function addWorkingDays(day, n) {
  var d = new Date(day.getTime());
  while (n > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) n--;
  }
  return d;
}

function formatDay(day, short) {
  return day.toLocaleDateString("en-GB", short
    ? { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }
    : { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(iso, timeZone) {
  var date = iso ? new Date(iso) : new Date();
  if (isNaN(date.getTime())) date = new Date();
  try {
    return date.toLocaleString("en-GB", {
      timeZone: timeZone || "UTC", day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZoneName: "short"
    });
  } catch (error) {
    return date.toISOString().replace("T", " ").slice(0, 16) + " UTC";
  }
}

/* ————— the catalog and the links ————— */

function productBySlug(catalog, slug) {
  return (catalog.products || []).filter(function (p) { return p.slug === slug; })[0] || null;
}

function roleLabel(catalog, value) {
  var found = (catalog.roles || []).filter(function (r) { return r.value === value; })[0];
  return found ? found.label : "";
}

function siteBase(siteUrl) {
  return String(siteUrl || "").replace(/[#?].*$/, "").replace(/index\.html$/, "").replace(/\/+$/, "");
}

function onArtifactHost(siteUrl) {
  return /^https:\/\/([a-z0-9-]+\.)*claude\.ai\//i.test(String(siteUrl || ""));
}

function productUrl(siteUrl, slug) {
  return siteBase(siteUrl) + "#/products/" + slug;
}

/* The walkthrough's address from outside the site: an absolute link as is; on a
   claude.ai host its own artifact (a supporting file will not open as a page);
   anywhere else, the path inside the deployed site. */
function demoUrl(siteUrl, entry) {
  var demo = entry.interactiveDemo || "";
  if (!demo) return "";
  if (/^https:\/\//i.test(demo)) return demo;
  if (onArtifactHost(siteUrl)) return entry.interactiveDemoArtifact || "";
  return siteBase(siteUrl) + "/" + demo.replace(/^\/+/, "");
}

/* Every artifact of one product's kit, in the copy's order, with its URL or
   none. The product page always exists. */
function kitFor(slug, ctx) {
  var entry = ((ctx.links || {}).products || {})[slug] || {};
  var siteUrl = (ctx.links || {}).siteUrl;
  var urls = {
    productPage: productUrl(siteUrl, slug),
    onePager: entry.onePager || "",
    salesDeck: entry.salesDeck || "",
    featureList: entry.featureList || "",
    interactiveDemo: demoUrl(siteUrl, entry),
    video: entry.video || ""
  };
  var order = (ctx.copy.order || ARTIFACT_KEYS).filter(function (k) { return ARTIFACT_KEYS.indexOf(k) !== -1; });
  var included = [];
  var missing = [];
  order.forEach(function (key) {
    var copy = (ctx.copy.artifacts || {})[key] || {};
    var item = { key: key, name: copy.name || key, use: copy.use || "", url: urls[key] };
    (item.url ? included : missing).push(item);
  });
  return { slug: slug, included: included, missing: missing };
}

/* ————— validation ————— */

/* Normalises a POST body into a request, or says why it is refused. The page
   checks the same things; this is the check that counts, because the endpoint
   can be called without the page. */
function validate(body, ctx) {
  var b = body && typeof body === "object" ? body : {};
  var settings = ctx.settings || {};
  var form = line(b.form);
  if (FORMS.indexOf(form) === -1) return { ok: false, code: "form", reason: "unknown form" };
  var email = line(b.email).toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, code: "email", reason: "email missing or malformed" };
  if (b.consent !== true) return { ok: false, code: "consent", reason: "consent not given" };
  var page = line(b.page);
  if (!/^https?:\/\//i.test(page) || page.length > 500) page = "";

  if (form === "kit") {
    var slug = line(b.product) || "all";
    if (slug !== "all" && !productBySlug(ctx.catalog, slug)) return { ok: false, code: "product", reason: "unknown product" };
    if (!domainAllowed(email, (settings.kit || {}).allowedDomains)) return { ok: false, code: "domain", reason: "domain not allowed for the kit" };
    return { ok: true, request: { form: form, email: email, product: slug, page: page, submittedAt: new Date().toISOString() } };
  }

  var name = line(b.name);
  if (!name || name.length > 120) return { ok: false, code: "name", reason: "name missing or too long" };
  var company = line(b.company).slice(0, 160);
  var role = line(b.role);
  if (role && !roleLabel(ctx.catalog, role)) role = "";
  var product = line(b.product);
  if (product && !productBySlug(ctx.catalog, product)) product = "";
  var message = block(b.message).slice(0, 4000);
  return {
    ok: true,
    request: {
      form: form, name: name, email: email, company: company, role: role,
      product: product, message: message, page: page, submittedAt: new Date().toISOString()
    }
  };
}

/* ————— the shell every email shares ————— */

function shell(title, preheader, rows) {
  return "<!DOCTYPE html>\n" +
    '<html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">' +
    "<title>" + esc(title) + "</title>" +
    "<style>" +
      "body{margin:0;padding:0;background:" + CARD + ";}" +
      "a{color:" + ACTION + ";}" +
      "@media (max-width:520px){" +
        ".wrap{padding:0 !important;}" +
        ".pad{padding-left:20px !important;padding-right:20px !important;}" +
        ".thumb{width:112px !important;}" +
        ".thumb img{width:112px !important;height:auto !important;}" +
        ".h1{font-size:26px !important;}" +
      "}" +
    "</style></head>" +
    '<body style="margin:0;padding:0;background:' + CARD + ';">' +
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">' + esc(preheader) + "</div>" +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + CARD + ';">' +
    '<tr><td class="wrap" align="center" style="padding:24px 12px;">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;">' +
    rows.join("") +
    "</table></td></tr></table></body></html>";
}

function row(html, padding) {
  return '<tr><td class="pad" style="padding:' + (padding || "0 32px") + ';">' + html + "</td></tr>";
}

function brandLine() {
  return row('<p style="margin:0;font-family:' + SANS + ';font-size:12px;line-height:1.4;letter-spacing:.08em;' +
    'text-transform:uppercase;color:' + MUTED + ';">SoftServe <span style="color:' + HAIRLINE + ';">|</span> Oracle AI &amp; Data Solutions</p>',
    "28px 32px 0");
}

/* The display line, then the brand's one orange accent rule under it. */
function heading(text) {
  return row('<h1 class="h1" style="margin:0;font-family:' + SERIF + ';font-weight:400;font-size:30px;line-height:1.2;color:' + INK + ';">' +
    esc(text) + "</h1>" +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;"><tr>' +
    '<td style="width:48px;height:3px;background:' + ACCENT + ';font-size:0;line-height:0;padding:0;">&nbsp;</td></tr></table>',
    "14px 32px 0");
}

function para(html, style) {
  return '<p style="margin:0 0 14px;font-family:' + SANS + ';font-size:16px;line-height:1.55;color:' + BODY + ';' + (style || "") + '">' + html + "</p>";
}

function small(html) {
  return '<p style="margin:0;font-family:' + SANS + ';font-size:12px;line-height:1.5;color:' + MUTED + ';">' + html + "</p>";
}

function link(url, text, style) {
  return '<a href="' + esc(url) + '" style="color:' + ACTION + ';' + (style || "") + '">' + esc(text) + "</a>";
}

function button(url, label) {
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td bgcolor="' + ACTION + '" style="background:' + ACTION + ';padding:12px 20px;">' +
    '<a href="' + esc(url) + '" style="font-family:' + SANS + ';font-size:15px;font-weight:bold;line-height:1.2;color:#ffffff;text-decoration:none;">' +
    esc(label) + "</a></td></tr></table>";
}

/* ————— the kit email, to the person who asked for it ————— */

function card(item, ctx, linked) {
  /* No background on the image: its transparent corners are the brand's
     octagonal cut, which a fill would square off. */
  var img = '<img src="' + esc(ctx.imageSrc(item.key)) + '" width="160" height="100" alt="' + esc(item.name) +
    '" style="display:block;width:160px;height:auto;border:0;">';
  var name = linked
    ? '<a href="' + esc(item.url) + '" style="font-family:' + SANS + ';font-size:17px;line-height:1.3;font-weight:bold;color:' + ACTION + ';text-decoration:none;">' + esc(item.name) + "</a>"
    : '<span style="font-family:' + SANS + ';font-size:17px;line-height:1.3;font-weight:bold;color:' + INK + ';">' + esc(item.name) + "</span>";
  return row(
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
      '<td class="thumb" width="160" valign="top" style="width:160px;">' +
        (linked ? '<a href="' + esc(item.url) + '">' + img + "</a>" : img) +
      "</td>" +
      '<td valign="middle" style="padding:0 0 0 20px;">' + name +
        '<p style="margin:6px 0 0;font-family:' + SANS + ';font-size:14px;line-height:1.45;color:' + MUTED + ';">' + esc(item.use) + "</p>" +
      "</td>" +
    "</tr></table>",
    "0 32px 18px");
}

/* Where a kit reader's reply lands, and where every practice notice goes: the
   practice mailbox when live; the deployment's own test inbox in test mode. */
function replyTo(settings, deployment) {
  if (settings.mode === "live") return ((settings.kit || {}).replyTo) || ((settings.inbox || {}).live) || "";
  return ((deployment || {}).testInbox) || "";
}

function practiceInbox(settings, deployment) {
  return settings.mode === "live" ? ((settings.inbox || {}).live || "") : (((deployment || {}).testInbox) || "");
}

function kitVars(request, ctx) {
  var all = request.product === "all";
  var product = all ? null : productBySlug(ctx.catalog, request.product);
  var name = product ? product.name : "";
  var kitName = all ? ctx.catalog.kitNameAll : fill(ctx.catalog.kitName, { product: name });
  var settings = ctx.settings || {};
  return {
    product: name, email: request.email, kitName: kitName, replyTo: replyTo(settings, ctx.deployment),
    date: formatDay(localDay(request.submittedAt, settings.timezone), false)
  };
}

/* The site's one-liners use em dashes; the emails do not (client-documents.md). */
function plainDashes(text) {
  return String(text || "").replace(/\s*—\s*/g, ": ");
}

function sectionHead(title, intro) {
  return row(
    (title ? '<h2 style="margin:0 0 6px;font-family:' + SERIF + ';font-weight:400;font-size:22px;line-height:1.25;color:' + INK + ';">' + esc(title) + "</h2>" : "") +
    (intro ? para(esc(intro), "font-size:15px;color:" + MUTED + ";") : ""),
    "18px 32px 4px");
}

function renderKit(request, ctx) {
  var copy = ctx.copy.kit || {};
  var all = request.product === "all";
  var vars = kitVars(request, ctx);
  var slugs = all ? (ctx.catalog.products || []).map(function (p) { return p.slug; }) : [request.product];
  var kits = slugs.map(function (slug) { return kitFor(slug, ctx); });
  var subject = line(fill(all ? copy.subjectAll : copy.subject, vars));
  var preheader = fill(all ? copy.preheaderAll : copy.preheader, vars);
  var rows = [brandLine(), heading(fill(all ? copy.headingAll : copy.heading, vars))];
  /* Cold read (PROVENANCE §32.3): a reader who forgot the form first learns
     what the product is and why this email came, then the rest. */
  var product = all ? null : productBySlug(ctx.catalog, request.product);
  var opening = "";
  if (copy.reason) opening += para(fillHtml(copy.reason, vars), "font-size:15px;color:" + MUTED + ";");
  if (product && product.oneLiner) {
    opening += para(esc(plainDashes(product.oneLiner)), "font-size:17px;line-height:1.5;color:" + INK + ";");
  }
  rows.push(row(opening + para(fillHtml(all ? copy.thanksAll : copy.thanks, vars)) + para(fillHtml(copy.followUp, vars)), "18px 32px 4px"));

  var used = {};
  if (!all) {
    rows.push(row(para(fillHtml(copy.listIntro, vars), "font-weight:bold;color:" + INK + ";"), "10px 32px 4px"));
    kits[0].included.forEach(function (item) { used[item.key] = true; rows.push(card(item, ctx, true)); });
  } else {
    /* Fable's layout (PROVENANCE §32): the links are the payload, so the
       product rows come first — the name to its page, its one-liner, then its
       other pieces — and a row never names what is absent. The six kinds follow
       once, as a legend, because their pictures are the same for every product. */
    var a = copy.all || {};
    rows.push(sectionHead(a.productsHeading, a.productsIntro));
    kits.forEach(function (k) {
      var p = productBySlug(ctx.catalog, k.slug) || { name: k.slug, oneLiner: "" };
      var page = k.included.filter(function (i) { return i.key === "productPage"; })[0];
      var others = k.included.filter(function (i) { return i.key !== "productPage"; });
      rows.push(row(
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ' + HAIRLINE + ';padding:14px 0 0;">' +
          '<a href="' + esc(page.url) + '" style="font-family:' + SANS + ';font-size:17px;line-height:1.3;font-weight:bold;color:' + ACTION + ';text-decoration:none;">' + esc(p.name) + "</a>" +
          (p.oneLiner ? '<p style="margin:4px 0 0;font-family:' + SANS + ';font-size:14px;line-height:1.5;color:' + BODY + ';">' + esc(plainDashes(p.oneLiner)) + "</p>" : "") +
          (others.length
            ? '<p style="margin:8px 0 0;font-family:' + SANS + ';font-size:14px;line-height:1.6;color:' + BODY + ';">' +
                others.map(function (item) { return link(item.url, item.name, "text-decoration:underline;"); })
                  .join('<span style="color:' + MUTED + ';">' + esc(a.rowSeparator || " · ") + "</span>") +
              "</p>"
            : "") +
        "</td></tr></table>",
        "0 32px 14px"));
    });
    rows.push(sectionHead(a.legendHeading, a.legendIntro));
    var kinds = {};
    kits.forEach(function (k) { k.included.forEach(function (item) { kinds[item.key] = item; }); });
    (ctx.copy.order || ARTIFACT_KEYS).forEach(function (key) {
      if (!kinds[key]) return;
      used[key] = true;
      rows.push(card(kinds[key], ctx, false));
    });
  }

  rows.push(row(para(fillHtml(copy.signoff, vars), "margin-bottom:4px;") + para(fillHtml(copy.contact, vars), "font-size:14px;color:" + MUTED + ";") +
    (copy.replyNote ? para(fillHtml(copy.replyNote, vars), "font-size:14px;color:" + MUTED + ";") : ""), "12px 32px 8px"));
  rows.push(row(small(fillHtml(copy.footer, vars)), "12px 32px 28px"));

  var textLines = [fill(all ? copy.headingAll : copy.heading, vars), ""]
    .concat(copy.reason ? [fill(copy.reason, vars), ""] : [])
    .concat(product && product.oneLiner ? [plainDashes(product.oneLiner), ""] : [])
    .concat([fill(all ? copy.thanksAll : copy.thanks, vars), fill(copy.followUp, vars), ""]);
  kits.forEach(function (k) {
    if (all) textLines.push((productBySlug(ctx.catalog, k.slug) || {}).name || k.slug);
    k.included.forEach(function (item) { textLines.push("- " + item.name + ": " + item.url + (all ? "" : "\n  " + item.use)); });
    textLines.push("");
  });
  textLines.push(fill(copy.signoff, vars), fill(copy.contact, vars), fill(copy.replyNote, vars), "", fill(copy.footer, vars));

  return {
    to: request.email,
    subject: subject,
    html: shell(subject, preheader, rows),
    text: textLines.join("\n"),
    images: Object.keys(used).map(function (key) { return { key: key, cid: "kit-" + key, file: "mail/img/" + IMAGE_FILES[key] }; }),
    kits: kits
  };
}

/* ————— the practice's copy of the request ————— */

function detailRows(pairs) {
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ' + HAIRLINE + ';">' +
    pairs.map(function (pair) {
      return "<tr>" +
        '<td valign="top" style="width:132px;padding:10px 12px 10px 0;border-bottom:1px solid ' + HAIRLINE + ';font-family:' + SANS +
          ';font-size:13px;line-height:1.45;color:' + MUTED + ';">' + esc(pair[0]) + "</td>" +
        '<td valign="top" style="padding:10px 0;border-bottom:1px solid ' + HAIRLINE + ';font-family:' + SANS +
          ';font-size:15px;line-height:1.5;color:' + BODY + ';">' + pair[1] + "</td>" +
        "</tr>";
    }).join("") + "</table>";
}

function renderInternal(request, ctx, kitResult) {
  var copy = ctx.copy.internal || {};
  var labels = copy.labels || {};
  var settings = ctx.settings || {};
  var test = settings.mode !== "live";
  var inbox = practiceInbox(settings, ctx.deployment);
  var product = request.product && request.product !== "all" ? productBySlug(ctx.catalog, request.product) : null;
  var isKit = request.form === "kit";
  var state = isKit ? (kitResult && kitResult.status === "sent" ? "kitSent" : "kitFailed") : request.form;
  var failed = state === "kitFailed";
  var siteUrl = (ctx.links || {}).siteUrl;
  var day = localDay(request.submittedAt, settings.timezone);

  var kitName = isKit ? kitVars(request, ctx).kitName : "";
  var productName = product ? product.name : (request.product === "all" ? ctx.catalog.kitNameAll : (labels.notSure || ctx.catalog.productNotSure));
  var kits = (kitResult && kitResult.kits) || [];
  var vars = {
    product: productName,
    email: request.email,
    name: request.name || request.email,
    company: request.company || "",
    role: roleLabel(ctx.catalog, request.role) || "",
    time: formatTime(request.submittedAt, settings.timezone),
    date: formatDay(day, false),
    due: formatDay(addWorkingDays(day, 2), true),
    kitName: kitName,
    count: "",
    missing: "",
    links: "",
    error: kitResult && kitResult.error ? line(kitResult.error).slice(0, 300) : "",
    replyTo: replyTo(settings, ctx.deployment)
  };
  if (isKit) {
    vars.count = String(kits.reduce(function (n, k) { return n + k.included.length; }, 0));
    vars.missing = kits.map(function (k) {
      if (!k.missing.length) return "";
      var names = k.missing.map(function (m) { return m.name; }).join(", ");
      return kits.length > 1 ? ((productBySlug(ctx.catalog, k.slug) || {}).name || k.slug) + ": " + names : names;
    }).filter(Boolean).join("; ");
    /* The links as a person would paste them: name, then the URL, visible. */
    vars.links = kits.map(function (k) {
      var items = k.included.map(function (i) { return (kits.length > 1 ? "  " : "") + i.name + ": " + i.url; });
      return (kits.length > 1 ? ((productBySlug(ctx.catalog, k.slug) || {}).name || k.slug) + "\n" : "") + items.join("\n");
    }).join("\n\n");
  }
  /* Subjects and buttons are short lines: a long name or company is cut there
     (copy-notes v3: name and company together at most 32 characters, so the
     subject holds 70), and printed in full in the body. With no company the
     brackets drop out (tidy, below). */
  var short = {};
  Object.keys(vars).forEach(function (k) { short[k] = vars[k]; });
  short.name = clip(vars.name, 18);
  short.company = clip(request.company || "", 14);
  /* "{name} ({company})" with no company would print empty brackets. */
  function tidy(text) { return String(text || "").replace(/\s*\(\s*\)/g, "").replace(/\s+([,.;:])/g, "$1"); }

  var subjectKey = state === "kitFailed" && request.product === "all" && (copy.subjects || {}).kitFailedAll ? "kitFailedAll" : state;
  var title = line(tidy(fill((copy.subjects || {})[subjectKey], short)));
  var subject = line((test ? (copy.testPrefix || "") : "") + title);
  var banner = tidy(fill((copy.banners || {})[state], vars));
  var warning = copy.replyWarning ? tidy(fill(copy.replyWarning, vars)) : "";
  var cta = (copy.cta || {})[state] || {};
  var replySubject = fill(copy.replySubject || "", vars);
  /* A failed kit: the button opens a message that already holds the links. */
  var message = failed && copy.failedMessage ? fill(copy.failedMessage, vars) : "";
  var mailto = "mailto:" + request.email + "?" + [
    replySubject ? "subject=" + encodeURIComponent(replySubject) : "",
    message ? "body=" + encodeURIComponent(message) : ""
  ].filter(Boolean).join("&");

  var rows = [brandLine()];
  rows.push(row('<p style="margin:0;font-family:' + SANS + ';font-size:13px;line-height:1.4;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;color:' +
    (failed ? DANGER : ACTION) + ';">' + esc(((copy.formNames || {})[request.form]) || request.form) +
    (test ? ' <span style="color:' + MUTED + ';font-weight:normal;">&middot; test mode</span>' : "") + "</p>", "18px 32px 0"));
  rows.push(heading(title));
  /* Cold read (PROVENANCE §32.3): the first thing under the heading says where
     Reply goes, so an internal question never reaches the customer. */
  if (warning) {
    rows.push(row('<p style="margin:0;font-family:' + SANS + ';font-size:14px;line-height:1.45;font-weight:bold;color:' + DANGER + ';">' + esc(warning) + "</p>", "14px 32px 0"));
  }
  rows.push(row('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td style="background:' + (failed ? DANGER_TINT : SELECT) + ';border-left:4px solid ' + (failed ? DANGER : ACTION) + ';padding:14px 16px;font-family:' + SANS +
    ';font-size:16px;line-height:1.5;font-weight:bold;color:' + INK + ';">' + esc(banner) + "</td></tr></table>" +
    '<p style="margin:8px 0 0;font-family:' + SANS + ';font-size:13px;line-height:1.4;color:' + MUTED + ';">' + fillHtml(labels.received || "", vars) + "</p>",
    "16px 32px 0"));
  var ctaHtml = para(fillHtml(cta.text || "", vars));
  if (message) {
    ctaHtml += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;"><tr>' +
      '<td style="border:1px solid ' + HAIRLINE + ';background:#fafbfc;padding:14px 16px;font-family:' + SANS + ';font-size:14px;line-height:1.55;color:' + BODY + ';">' +
      esc(message).replace(/\n/g, "<br>") + "</td></tr></table>";
  }
  rows.push(row(ctaHtml + button(mailto, fill(cta.button || "", short)), "18px 32px 6px"));

  var blank = esc(labels.blank || labels.none || "-");
  var pairs = [];
  if (!isKit) {
    pairs.push([labels.name, esc(request.name)]);
    pairs.push([labels.email, link("mailto:" + request.email, request.email)]);
    pairs.push([labels.company, request.company ? esc(request.company) : blank]);
    pairs.push([labels.role, vars.role ? esc(vars.role) : blank]);
    pairs.push([labels.product, product ? link(productUrl(siteUrl, product.slug), product.name) : esc(labels.notSure || ctx.catalog.productNotSure)]);
    pairs.push([labels.message, request.message ? esc(request.message).replace(/\n/g, "<br>") : blank]);
  } else {
    pairs.push([labels.email, link("mailto:" + request.email, request.email)]);
    pairs.push([labels.kit, esc(kitName)]);
    var sent = kits.map(function (k) {
      var items = k.included.map(function (i) { return link(i.url, i.name); }).join(", ");
      return kits.length > 1 ? "<strong>" + esc((productBySlug(ctx.catalog, k.slug) || {}).name || k.slug) + ":</strong> " + items : items;
    }).join("<br>");
    if (!message) pairs.push([failed ? (labels.toSend || "Links to send by hand") : (labels.sentLinks || "Links sent"), sent || blank]);
    if (vars.missing) pairs.push([labels.missing, esc(vars.missing)]);
  }
  if (request.page) pairs.push([labels.page, link(request.page, request.page.replace(/^https?:\/\//, ""))]);
  if (failed && vars.error) {
    pairs.push([labels.error || "Why it failed", esc(copy.errorNote ? fill(copy.errorNote, vars) : vars.error)]);
  }
  rows.push(row(detailRows(pairs), "18px 32px 8px"));
  var siteLine = copy.siteLine ? fill(copy.siteLine, vars) : "";
  rows.push(row((siteLine ? small(esc(siteLine)) + '<div style="height:8px;line-height:8px;font-size:0;">&nbsp;</div>' : "") +
    small(fillHtml(copy.footer || "", vars)), "16px 32px 28px"));

  var text = [title, ""]
    .concat(warning ? [warning, ""] : [])
    .concat([banner, fill(labels.received || "", vars), "", fill(cta.text || "", vars)])
    .concat(message ? ["", message] : [])
    .concat(["", "Reply: " + request.email, ""])
    .concat(pairs.map(function (p) { return p[0] + ": " + htmlToText(p[1]); }))
    .concat(["", siteLine, fill(copy.footer || "", vars)].filter(function (l, i) { return i === 0 || l; })).join("\n");

  return { to: inbox, replyTo: request.email, subject: subject, html: shell(subject, banner, rows), text: text, images: [] };
}

function clip(value, max) {
  var s = line(value);
  return s.length > max ? s.slice(0, max - 1).replace(/\s+$/, "") + "…" : s;
}

function htmlToText(html) {
  return String(html).replace(/<br>/g, "\n  ").replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

/* A message as a Microsoft Graph sendMail body (POST /me/sendMail, or
   /users/<mailbox>/sendMail with an app registration): the route a SoftServe
   integration is most likely to take. attachments: [{ cid, name, base64 }], the
   message's images read from the repo and base64-encoded by the caller. */
function toGraph(message, attachments) {
  var m = {
    subject: message.subject,
    body: { contentType: "HTML", content: message.html },
    toRecipients: [{ emailAddress: { address: message.to } }]
  };
  if (message.replyTo) m.replyTo = [{ emailAddress: { address: message.replyTo } }];
  if (attachments && attachments.length) {
    m.attachments = attachments.map(function (a) {
      return { "@odata.type": "#microsoft.graph.fileAttachment", name: a.name, contentType: "image/png",
        contentBytes: a.base64, isInline: true, contentId: a.cid };
    });
  }
  return { message: m, saveToSentItems: true };
}

var api = {
  VERSION: VERSION, ARTIFACT_KEYS: ARTIFACT_KEYS, IMAGE_FILES: IMAGE_FILES, replyTo: replyTo, toGraph: toGraph,
  validate: validate, renderKit: renderKit, renderInternal: renderInternal, kitFor: kitFor,
  productUrl: productUrl, demoUrl: demoUrl
};
if (typeof module !== "undefined" && module.exports) module.exports = api;
