#!/usr/bin/env node
/**
 * n8n-workflow.js — builds the n8n workflow that sends the site's emails, from
 * the Code-node sources in mail/n8n/ (round 12). The shared repo holds the logic;
 * everything specific to one installation stays out of it (mail/README.md,
 * "Deployment").
 *
 *   node tools/n8n-workflow.js
 *
 * Always writes:
 *   mail/n8n/workflow.template.json      the sender, importable into any n8n, with
 *                                        placeholder credentials, a placeholder
 *                                        webhook path and placeholder Deployment settings
 *   mail/n8n/error-alerts.template.json  the backstop workflow (Error Trigger → Telegram)
 *   .work/n8n/code-nodes.json            each Code node's current code by node name,
 *                                        to update a running deployment in place
 *                                        without touching its settings or credentials
 * And, when .work/n8n/deployment.local.json exists (git-ignored, one machine only):
 *   .work/n8n/workflow.live.json         the full workflow with that deployment's
 *                                        values, for a first install or a rebuild
 */
"use strict";

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var ROOT = path.resolve(__dirname, "..");
var SRC = path.join(ROOT, "mail", "n8n");
var WORK = path.join(ROOT, ".work", "n8n");
fs.mkdirSync(WORK, { recursive: true });

function code(file) { return fs.readFileSync(path.join(SRC, file), "utf8"); }
function uuidFrom(text) {
  return crypto.createHash("md5").update(text).digest("hex").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
}

var FILES = ["mail/settings.json", "links.json", "mail/catalog.json", "mail/copy.json", "mail/render.js",
  "mail/img/product-page.png", "mail/img/one-pager.png", "mail/img/sales-deck.png",
  "mail/img/feature-list.png", "mail/img/interactive-demo.png", "mail/img/video.png"];

/* What a deployment supplies. The template ships these placeholders. */
var TEMPLATE = {
  webhookPath: "SET-A-LONG-RANDOM-PATH",
  webhookId: "00000000-0000-0000-0000-000000000000",
  origins: ["http://127.0.0.1:8765", "http://localhost:8765"],
  credentials: {
    githubRead: { id: "", name: "GitHub read (site repo)" },
    smtp: { id: "", name: "SMTP sender" },
    telegram: { id: "", name: "Telegram alerts" }
  },
  errorWorkflowId: "",
  settingsCode: code("deployment-settings.js")
};

function build(d) {
  function codeNode(id, name, x, y, js) {
    return { id: id, name: name, type: "n8n-nodes-base.code", typeVersion: 2, position: [x, y], parameters: { jsCode: js } };
  }
  function respond(id, name, x, y, status, body) {
    return { id: id, name: name, type: "n8n-nodes-base.respondToWebhook", typeVersion: 1.4, position: [x, y],
      parameters: { respondWith: "json", responseBody: body, options: { responseCode: status } } };
  }
  function telegram(id, name, x, y) {
    return { id: id, name: name, type: "n8n-nodes-base.telegram", typeVersion: 1.2, position: [x, y],
      parameters: { chatId: "={{ $('Deployment settings').first().json.alertChatId }}", text: "={{ $json.alertHtml }}",
        additionalFields: { parse_mode: "HTML", disable_web_page_preview: true } },
      credentials: { telegramApi: d.credentials.telegram }, onError: "continueRegularOutput", webhookId: uuidFrom(id) };
  }
  function sendEmail(id, name, x, y, f) {
    return { id: id, name: name, type: "n8n-nodes-base.emailSend", typeVersion: 2.1, position: [x, y],
      parameters: { fromEmail: f.from, toEmail: f.to, subject: f.subject, emailFormat: "both", text: f.text, html: f.html,
        options: Object.assign({ appendAttribution: false, replyTo: f.replyTo }, f.inline ? { attachments: f.inline } : {}) },
      credentials: { smtp: d.credentials.smtp }, onError: "continueErrorOutput" };
  }
  function rules(field, keys) {
    return { rules: { values: keys.map(function (key, i) {
      return { outputKey: key, renameOutput: true, conditions: {
        options: { version: 2, leftValue: "", caseSensitive: true, typeValidation: "strict" }, combinator: "and",
        conditions: [{ id: field + "-" + i, leftValue: "={{ $json." + field + " }}", rightValue: key, operator: { type: "string", operation: "equals" } }] } };
    }) }, options: {} };
  }
  function ifNode(id, name, x, y, left, op) {
    return { id: id, name: name, type: "n8n-nodes-base.if", typeVersion: 2.2, position: [x, y],
      parameters: { conditions: { options: { version: 2, leftValue: "", caseSensitive: true, typeValidation: "strict" }, combinator: "and",
        conditions: [{ id: id + "-0", leftValue: left, rightValue: "", operator: op }] }, options: {} } };
  }

  var nodes = [
    { id: "form-post", name: "Form POST", type: "n8n-nodes-base.webhook", typeVersion: 2.1, position: [0, 300], webhookId: d.webhookId,
      parameters: { httpMethod: "POST", path: d.webhookPath, responseMode: "responseNode", options: { allowedOrigins: d.origins.join(",") } } },
    { id: "self-check", name: "Every 6 hours", type: "n8n-nodes-base.scheduleTrigger", typeVersion: 1.2, position: [0, 520],
      parameters: { rule: { interval: [{ field: "hours", hoursInterval: 6 }] } } },
    codeNode("deployment", "Deployment settings", 220, 400, d.settingsCode),
    codeNode("files-to-read", "Files to read", 440, 400,
      "// The repo files the sender reads on every request (mail/README.md).\nreturn " + JSON.stringify(FILES) + ".map(path => ({ json: { path } }));"),
    { id: "read-github", name: "Read from GitHub", type: "n8n-nodes-base.httpRequest", typeVersion: 4.2, position: [660, 400],
      parameters: {
        url: "=https://api.github.com/repos/{{ $('Deployment settings').first().json.repo }}/contents/{{ $json.path }}?ref={{ $('Deployment settings').first().json.ref }}",
        authentication: "genericCredentialType", genericAuthType: "httpHeaderAuth", sendHeaders: true,
        headerParameters: { parameters: [{ name: "Accept", value: "application/vnd.github.raw+json" }, { name: "X-GitHub-Api-Version", value: "2022-11-28" }] },
        options: { response: { response: { responseFormat: "file", outputPropertyName: "data" } }, timeout: 15000 } },
      credentials: { httpHeaderAuth: d.credentials.githubRead },
      onError: "continueRegularOutput", retryOnFail: true, maxTries: 2, waitBetweenTries: 1000 },
    codeNode("validate-render", "Validate and render", 880, 400, code("validate-and-render.js")),
    { id: "route", name: "Route", type: "n8n-nodes-base.switch", typeVersion: 3.2, position: [1100, 400],
      parameters: rules("outcome", ["kit", "practice", "refused", "limited", "config", "selfcheck"]) },

    sendEmail("send-kit", "Send kit", 1320, 120, { from: "={{ $json.from }}", to: "={{ $json.kit.to }}", subject: "={{ $json.kit.subject }}",
      text: "={{ $json.kit.text }}", html: "={{ $json.kit.html }}", replyTo: "={{ $json.kitReplyTo }}", inline: "={{ $json.kit.inline }}" }),
    codeNode("prep-kit-sent", "Practice copy: kit sent", 1540, 40,
      "const b = $('Validate and render').first().json;\nreturn [{ json: { mail: b.practiceSent, from: b.from } }];"),
    codeNode("failure-notice", "Failure notice", 1540, 220, code("failure-notice.js")),
    codeNode("prep-form", "Practice copy: form", 1320, 400,
      "const b = $('Validate and render').first().json;\nreturn [{ json: { mail: b.practice, from: b.from } }];"),
    sendEmail("send-practice", "Send practice copy", 1760, 220, { from: "={{ $json.from }}", to: "={{ $json.mail.to }}", subject: "={{ $json.mail.subject }}",
      text: "={{ $json.mail.text }}", html: "={{ $json.mail.html }}", replyTo: "={{ $json.mail.replyTo }}" }),
    codeNode("outcome", "Outcome", 1980, 220, code("outcome.js")),
    ifNode("alert-needed", "Alert needed?", 2200, 100, "={{ $json.alertHtml }}", { type: "string", operation: "notEmpty", singleValue: true }),
    telegram("tg-alert", "Telegram: alert", 2420, 100),
    { id: "respond-with", name: "Respond with", type: "n8n-nodes-base.switch", typeVersion: 3.2, position: [2200, 320],
      parameters: rules("respond", ["sent", "received", "notSent"]) },
    respond("respond-sent", "Respond: sent", 2420, 260, 200, '{"ok":true,"sent":true}'),
    respond("respond-received", "Respond: received", 2420, 400, 200, '{"ok":true}'),
    respond("respond-not-sent", "Respond: not sent", 2420, 540, 502, '{"ok":false,"code":"send"}'),

    respond("respond-refused", "Respond: refused", 1320, 600, 400, "={{ JSON.stringify({ ok: false, code: $json.code }) }}"),
    ifNode("cap-alert", "Cap alert?", 1320, 780, "={{ $json.alert }}", { type: "boolean", operation: "true", singleValue: true }),
    telegram("tg-cap", "Telegram: cap reached", 1540, 740),
    respond("respond-limited", "Respond: too many", 1760, 800, 429, '{"ok":false,"code":"rate"}'),
    telegram("tg-config", "Telegram: not working", 1320, 960),
    respond("respond-config", "Respond: unavailable", 1540, 960, 503, '{"ok":false,"code":"config"}'),
    telegram("tg-selfcheck", "Telegram: self-check failed", 1320, 1120)
  ];

  function to(name) { return { node: name, type: "main", index: 0 }; }
  var connections = {
    "Form POST": { main: [[to("Deployment settings")]] },
    "Every 6 hours": { main: [[to("Deployment settings")]] },
    "Deployment settings": { main: [[to("Files to read")]] },
    "Files to read": { main: [[to("Read from GitHub")]] },
    "Read from GitHub": { main: [[to("Validate and render")]] },
    "Validate and render": { main: [[to("Route")]] },
    "Route": { main: [[to("Send kit")], [to("Practice copy: form")], [to("Respond: refused")], [to("Cap alert?")], [to("Telegram: not working")], [to("Telegram: self-check failed")]] },
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
  var settings = { executionOrder: "v1", timezone: "Europe/Berlin", saveManualExecutions: true, saveDataErrorExecution: "all", saveDataSuccessExecution: "all" };
  if (d.errorWorkflowId) settings.errorWorkflow = d.errorWorkflowId;
  return { name: "Oracle site forms (cloud)", nodes: nodes, connections: connections, settings: settings };
}

function errorAlerts(d) {
  return {
    name: "Oracle site forms — error alerts",
    nodes: [
      { id: "osf-err-trigger", name: "Error Trigger", type: "n8n-nodes-base.errorTrigger", typeVersion: 1, position: [0, 0], parameters: {} },
      { id: "osf-err-build", name: "Build alert", type: "n8n-nodes-base.code", typeVersion: 2, position: [240, 0], parameters: { jsCode: code("error-alert.js") } },
      { id: "osf-err-tg", name: "Send Telegram", type: "n8n-nodes-base.telegram", typeVersion: 1.2, position: [480, 0], webhookId: uuidFrom("osf-err-tg"),
        parameters: { chatId: d.alertChatId || "TELEGRAM_CHAT_ID", text: "={{ $json.telegramHtml }}", additionalFields: { disable_web_page_preview: true, parse_mode: "HTML" } },
        credentials: { telegramApi: d.credentials.telegram } }
    ],
    connections: { "Error Trigger": { main: [[{ node: "Build alert", type: "main", index: 0 }]] }, "Build alert": { main: [[{ node: "Send Telegram", type: "main", index: 0 }]] } },
    settings: { executionOrder: "v1" }
  };
}

function write(file, obj) { fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n"); }

write(path.join(SRC, "workflow.template.json"), build(TEMPLATE));
write(path.join(SRC, "error-alerts.template.json"), errorAlerts(TEMPLATE));
var codeNodes = {};
build(TEMPLATE).nodes.forEach(function (n) {
  if (n.type === "n8n-nodes-base.code" && n.name !== "Deployment settings") codeNodes[n.name] = n.parameters.jsCode;
});
write(path.join(WORK, "code-nodes.json"), codeNodes);
var out = ["mail/n8n/workflow.template.json", "mail/n8n/error-alerts.template.json", ".work/n8n/code-nodes.json"];

/* One deployment's own values, never committed: .work/ is git-ignored. */
var localFile = path.join(WORK, "deployment.local.json");
if (fs.existsSync(localFile)) {
  var local = JSON.parse(fs.readFileSync(localFile, "utf8"));
  var s = local.settings || {};
  var d = Object.assign({}, TEMPLATE, local, {
    credentials: Object.assign({}, TEMPLATE.credentials, local.credentials || {}),
    settingsCode: TEMPLATE.settingsCode.replace(/return \[\{[\s\S]*\}\];\s*$/, "return [{ json: " + JSON.stringify(s, null, 2) + " }];\n")
  });
  write(path.join(WORK, "workflow.live.json"), build(d));
  write(path.join(WORK, "error-alerts.live.json"), errorAlerts(Object.assign({}, d, { alertChatId: s.alertChatId })));
  out.push(".work/n8n/workflow.live.json", ".work/n8n/error-alerts.live.json");
}
console.log("n8n-workflow: wrote " + out.join(", "));
