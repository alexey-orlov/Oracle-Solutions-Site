// n8n Code node "Lead alert" (Run Once for All Items): the practice's copy of a
// request could not be sent. The alert carries the whole request, so the lead
// reaches Alex on Telegram even though the email did not. Also used after a kit
// that went out when only its practice copy failed.
const base = $('Validate and render').first().json;
const r = base.request || {};
const e = $json.error || {};
const error = String(e.message || e.description || (typeof e === 'string' ? e : JSON.stringify(e)) || 'unknown error').slice(0, 300);
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
const kitSent = base.outcome === 'kit';
const lines = [
  '⚠️ <b>Oracle site: ' + (kitSent ? 'kit sent, but the practice copy failed' : 'request NOT delivered to the practice inbox') + '</b>',
  'Form: ' + esc(r.form) + (r.product ? ' · ' + esc(r.product) : ''),
  'Email: ' + esc(r.email)
];
if (r.name) lines.push('Name: ' + esc(r.name));
if (r.company) lines.push('Company: ' + esc(r.company));
if (r.role) lines.push('Role: ' + esc(r.role));
if (r.message) lines.push('Message: ' + esc(String(r.message).slice(0, 1500)));
lines.push('Error: ' + esc(error));
lines.push(kitSent ? '\nThe kit reached them; only the notice to the practice is missing.' : '\nThe visitor saw an error. Reply to them from here.');
return [{ json: { alertHtml: lines.join('\n') } }];
