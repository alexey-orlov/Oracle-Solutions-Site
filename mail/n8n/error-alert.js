// n8n Code node "Build alert" in the workflow "Oracle site forms — error alerts"
// (Error Trigger → this → Telegram). The backstop for "Oracle site forms (cloud)":
// any run that ends in an error none of its own paths handled reaches the
// deployment's alert chat, so a form submission never fails in silence.
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
const j = items[0].json || {};
const ex = j.execution || {};
const err = ex.error || j.error || {};
const node = (err.node && err.node.name) || ex.lastNodeExecuted || '';
let html = '⚠️ <b>Oracle site forms: a run failed</b>\n';
if (node) html += '<b>Node:</b> ' + esc(node) + '\n';
html += '<b>Error:</b> ' + esc(String(err.message || err.description || 'unknown').slice(0, 600)) + '\n';
html += '\nThe visitor saw an error. A request may be lost: check the execution for its data.';
if (ex.url) html += '\n<a href="' + esc(ex.url) + '">Open the execution</a>';
return [{ json: { telegramHtml: html } }];
