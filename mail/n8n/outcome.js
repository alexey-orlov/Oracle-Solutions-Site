// n8n Code node "Outcome" (Run Once for All Items). Runs after the practice copy
// was sent or failed. Decides what the page is told and whether Alex gets a
// Telegram alert. No request ends in silence: every failure alerts, and an alert
// for an undelivered practice copy carries the whole request, so the lead is
// never lost.
const base = $('Validate and render').first().json;
const r = base.request || {};
const kitFailed = $('Failure notice').isExecuted;
const e = $json.error;
const practiceError = e ? String(e.message || e.description || (typeof e === 'string' ? e : JSON.stringify(e))).slice(0, 300) : '';

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function lead(title, tail) {
  const lines = ['⚠️ <b>Oracle site: ' + title + '</b>', 'Form: ' + esc(r.form) + (r.product ? ' · ' + esc(r.product) : ''), 'Email: ' + esc(r.email)];
  if (r.name) lines.push('Name: ' + esc(r.name));
  if (r.company) lines.push('Company: ' + esc(r.company));
  if (r.role) lines.push('Role: ' + esc(r.role));
  if (r.message) lines.push('Message: ' + esc(String(r.message).slice(0, 1500)));
  lines.push('Error: ' + esc(practiceError), '', tail);
  return lines.join('\n');
}

let respond;
let alertHtml = '';
if (base.outcome === 'kit') {
  respond = kitFailed ? 'notSent' : 'sent';
  if (kitFailed) {
    alertHtml = $('Failure notice').first().json.alertHtml + (practiceError ? '\n\nThe practice copy failed too: ' + esc(practiceError) : '');
  } else if (practiceError) {
    alertHtml = lead('kit sent, but the practice copy failed', 'The kit reached them; only the notice to the practice inbox is missing.');
  }
} else {
  respond = practiceError ? 'notSent' : 'received';
  if (practiceError) alertHtml = lead('request NOT delivered to the practice inbox', 'The visitor saw an error. Reply to them from here.');
}
return [{ json: { respond, alertHtml } }];
