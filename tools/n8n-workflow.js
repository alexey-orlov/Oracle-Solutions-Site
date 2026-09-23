#!/usr/bin/env node
/**
 * n8n-workflow.js — builds the n8n workflow that sends the site's emails, from
 * the Code-node sources in mail/n8n/ (round 12). One source for the logic: the
 * workflow runs mail/render.js from GitHub, and its Code nodes are these files.
 *
 *   node tools/n8n-workflow.js
 *
 * Writes mail/n8n/workflow.json (committed, the webhook path redacted) and
 * .work/n8n/workflow.live.json (git-ignored, with the live path, which a
 * session sends to n8n through the n8n connector). The live path is created
 * once in .work/n8n/webhook-path.txt and never enters git (AO-Personal-OS hard
 * rule on live trigger URLs).
 */
"use strict";

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var ROOT = path.resolve(__dirname, "..");
var SRC = path.join(ROOT, "mail", "n8n");
var WORK = path.join(ROOT, ".work", "n8n");
fs.mkdirSync(WORK, { recursive: true });

var pathFile = path.join(WORK, "webhook-path.txt");
if (!fs.existsSync(pathFile)) fs.writeFileSync(pathFile, "oracle-site-forms-" + crypto.randomBytes(12).toString("hex") + "\n");
var livePath = fs.readFileSync(pathFile, "utf8").trim();
var idFile = path.join(WORK, "webhook-id.txt");
if (!fs.existsSync(idFile)) fs.writeFileSync(idFile, crypto.randomUUID() + "\n");
var webhookId = fs.readFileSync(idFile, "utf8").trim();

function code(file) { return fs.readFileSync(path.join(SRC, file), "utf8"); }

/* Origins allowed to POST from a browser: the local preview today. Add the
   public host here when the site moves to one (mail/README.md). */
var ORIGINS = ["http://127.0.0.1:8765", "http://localhost:8765"];
var TELEGRAM = { telegramApi: { id: "FnBXEhAZd1GlsgSP", name: "Telegram bot (AO)" } };
var TELEGRAM_CHAT = "-1003902528359"; // the AO Personal OS group, General topic
var REPO = "alexey-orlov/Oracle-Solutions-Site";
var FILES = ["mail/settings.json", "links.json", "mail/catalog.json", "mail/copy.json", "mail/render.js",
  "mail/img/product-page.png", "mail/img/one-pager.png", "mail/img/sales-deck.png",
  "mail/img/feature-list.png", "mail/img/interactive-demo.png", "mail/img/video.png"];

function codeNode(id, name, x, y, js) {
  return { id: id, name: name, type: "n8n-nodes-base.code", typeVersion: 2, position: [x, y], parameters: { jsCode: js } };
}
function respond(id, name, x, y, status, body) {
  return {
    id: id, name: name, type: "n8n-nodes-base.respondToWebhook", typeVersion: 1.4, position: [x, y],
    parameters: { respondWith: "json", responseBody: body, options: { responseCode: status } }
  };
}
function telegram(id, name, x, y, textExpr) {
  return {
    id: id, name: name, type: "n8n-nodes-base.telegram", typeVersion: 1.2, position: [x, y],
    parameters: { chatId: TELEGRAM_CHAT, text: textExpr, additionalFields: { parse_mode: "HTML", disable_web_page_preview: true } },
    credentials: TELEGRAM, onError: "continueRegularOutput", webhookId: crypto.createHash("md5").update(id).digest("hex").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5")
  };
}
function sendEmail(id, name, x, y, fields) {
  return {
    id: id, name: name, type: "n8n-nodes-base.emailSend", typeVersion: 2.1, position: [x, y],
    parameters: {
      fromEmail: fields.from, toEmail: fields.to, subject: fields.subject, emailFormat: "both",
      text: fields.text, html: fields.html,
      options: Object.assign({ appendAttribution: false, replyTo: fields.replyTo }, fields.inline ? { attachments: fields.inline } : {})
    },
    onError: "continueErrorOutput"
  };
}
function rules(field, keys) {
  return {
    rules: {
      values: keys.map(function (key, i) {
        return {
          outputKey: key, renameOutput: true,
          conditions: {
            options: { version: 2, leftValue: "", caseSensitive: true, typeValidation: "strict" },
            combinator: "and",
            conditions: [{ id: field.replace(/\W/g, "") + "-" + i, leftValue: "={{ $json." + field + " }}", rightValue: key, operator: { type: "string", operation: "equals" } }]
          }
        };
      })
    },
    options: {}
  };
}

var nodes = [
  {
    id: "form-post", name: "Form POST", type: "n8n-nodes-base.webhook", typeVersion: 2.1, position: [0, 400], webhookId: webhookId,
    parameters: { httpMethod: "POST", path: livePath, responseMode: "responseNode", options: { allowedOrigins: ORIGINS.join(",") } }
  },
  codeNode("files-to-read", "Files to read", 220, 400,
    "// The repo files the sender reads on every request (mail/README.md).\nreturn " + JSON.stringify(FILES) + ".map(path => ({ json: { path } }));"),
  {
    id: "read-github", name: "Read from GitHub", type: "n8n-nodes-base.httpRequest", typeVersion: 4.2, position: [440, 400],
    parameters: {
      url: "=https://api.github.com/repos/" + REPO + "/contents/{{ $json.path }}?ref=main",
      authentication: "genericCredentialType", genericAuthType: "httpHeaderAuth",
      sendHeaders: true,
      headerParameters: { parameters: [
        { name: "Accept", value: "application/vnd.github.raw+json" },
        { name: "X-GitHub-Api-Version", value: "2022-11-28" }
      ] },
      options: { response: { response: { responseFormat: "file", outputPropertyName: "data" } }, timeout: 15000 }
    },
    onError: "continueRegularOutput", retryOnFail: true, maxTries: 2, waitBetweenTries: 1000
  },
  codeNode("validate-render", "Validate and render", 660, 400, code("validate-and-render.js")),
  { id: "route", name: "Route", type: "n8n-nodes-base.switch", typeVersion: 3.2, position: [880, 400],
    parameters: rules("outcome", ["kit", "practice", "refused", "limited", "config"]) },

  sendEmail("send-kit", "Send kit", 1100, 120, {
    from: "={{ $json.from }}", to: "={{ $json.kit.to }}", subject: "={{ $json.kit.subject }}",
    text: "={{ $json.kit.text }}", html: "={{ $json.kit.html }}", replyTo: "={{ $json.kitReplyTo }}", inline: "={{ $json.kit.inline }}"
  }),
  codeNode("prep-kit-sent", "Practice copy: kit sent", 1320, 40,
    "const b = $('Validate and render').first().json;\nreturn [{ json: { mail: b.practiceSent, from: b.from } }];"),
  codeNode("failure-notice", "Failure notice", 1320, 220, code("failure-notice.js")),
  codeNode("prep-form", "Practice copy: form", 1100, 400,
    "const b = $('Validate and render').first().json;\nreturn [{ json: { mail: b.practice, from: b.from } }];"),
  sendEmail("send-practice", "Send practice copy", 1540, 220, {
    from: "={{ $json.from }}", to: "={{ $json.mail.to }}", subject: "={{ $json.mail.subject }}",
    text: "={{ $json.mail.text }}", html: "={{ $json.mail.html }}", replyTo: "={{ $json.mail.replyTo }}"
  }),
  codeNode("outcome", "Outcome", 1760, 220, code("outcome.js")),
  { id: "alert-needed", name: "Alert needed?", type: "n8n-nodes-base.if", typeVersion: 2.2, position: [1980, 100],
    parameters: { conditions: { options: { version: 2, leftValue: "", caseSensitive: true, typeValidation: "strict" }, combinator: "and",
      conditions: [{ id: "alert-needed-0", leftValue: "={{ $json.alertHtml }}", rightValue: "", operator: { type: "string", operation: "notEmpty", singleValue: true } }] }, options: {} } },
  telegram("tg-alert", "Telegram: alert", 2200, 100, "={{ $json.alertHtml }}"),
  { id: "respond-with", name: "Respond with", type: "n8n-nodes-base.switch", typeVersion: 3.2, position: [1980, 320],
    parameters: rules("respond", ["sent", "received", "notSent"]) },
  respond("respond-sent", "Respond: sent", 2200, 260, 200, '{"ok":true,"sent":true}'),
  respond("respond-received", "Respond: received", 2200, 400, 200, '{"ok":true}'),
  respond("respond-not-sent", "Respond: not sent", 2200, 540, 502, '{"ok":false,"code":"send"}'),

  respond("respond-refused", "Respond: refused", 1100, 600, 400, "={{ JSON.stringify({ ok: false, code: $json.code }) }}"),
  { id: "cap-alert", name: "Cap alert?", type: "n8n-nodes-base.if", typeVersion: 2.2, position: [1100, 780],
    parameters: { conditions: { options: { version: 2, leftValue: "", caseSensitive: true, typeValidation: "strict" }, combinator: "and",
      conditions: [{ id: "cap-alert-0", leftValue: "={{ $json.alert }}", rightValue: "", operator: { type: "boolean", operation: "true", singleValue: true } }] }, options: {} } },
  telegram("tg-cap", "Telegram: cap reached", 1320, 740, "={{ $json.alertHtml }}"),
  respond("respond-limited", "Respond: too many", 1540, 800, 429, '{"ok":false,"code":"rate"}'),
  telegram("tg-config", "Telegram: not working", 1100, 960, "={{ $json.alertHtml }}"),
  respond("respond-config", "Respond: unavailable", 1320, 960, 503, '{"ok":false,"code":"config"}')
];

function to(name, index) { return { node: name, type: "main", index: index || 0 }; }
var connections = {
  "Form POST": { main: [[to("Files to read")]] },
  "Files to read": { main: [[to("Read from GitHub")]] },
  "Read from GitHub": { main: [[to("Validate and render")]] },
  "Validate and render": { main: [[to("Route")]] },
  "Route": { main: [[to("Send kit")], [to("Practice copy: form")], [to("Respond: refused")], [to("Cap alert?")], [to("Telegram: not working")]] },
  "Send kit": { main: [[to("Practice copy: kit sent")], [to("Failure notice")]] },
  "Practice copy: kit sent": { main: [[to("Send practice copy")]] },
  "Failure notice": { main: [[to("Send practice copy")]] },
  "Practice copy: form": { main: [[to("Send practice copy")]] },
  "Send practice copy": { main: [[to("Outcome")], [to("Outcome")]] },
  "Outcome": { main: [[to("Alert needed?"), to("Respond with")]] },
  "Alert needed?": { main: [[to("Telegram: alert")], []] },
  "Respond with": { main: [[to("Respond: sent")], [to("Respond: received")], [to("Respond: not sent")]] },
  "Cap alert?": { main: [[to("Telegram: cap reached")], [to("Respond: too many")]] },
  "Telegram: cap reached": { main: [[to("Respond: too many")]] },
  "Telegram: not working": { main: [[to("Respond: unavailable")]] }
};

var workflow = {
  name: "Oracle site forms (cloud)",
  nodes: nodes,
  connections: connections,
  /* errorWorkflow: "Oracle site forms — error alerts" (Error Trigger → Telegram),
     the backstop for any run that fails outside the handled paths. */
  settings: { executionOrder: "v1", timezone: "Europe/Berlin", saveManualExecutions: true, saveDataErrorExecution: "all", saveDataSuccessExecution: "all", errorWorkflow: "ih0qkEs5xOgpH2Kd" }
};

fs.writeFileSync(path.join(WORK, "workflow.live.json"), JSON.stringify(workflow, null, 2) + "\n");
var redacted = JSON.parse(JSON.stringify(workflow));
redacted.nodes[0].parameters.path = "REDACTED-see-.work/n8n/webhook-path.txt";
redacted.nodes[0].webhookId = "REDACTED";
fs.writeFileSync(path.join(SRC, "workflow.json"), JSON.stringify(redacted, null, 2) + "\n");
console.log("n8n-workflow: " + nodes.length + " nodes; wrote mail/n8n/workflow.json (path redacted) and .work/n8n/workflow.live.json");
