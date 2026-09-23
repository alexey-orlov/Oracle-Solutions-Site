// n8n Code node "Failure notice" (Run Once for All Items): the kit email failed.
// Re-renders the practice's copy as the "send it by hand" notice, with the error,
// and builds the Telegram alert. Runs the same mail/render.js the request loaded.
const base = $('Validate and render').first().json;
const f = base.files;
const m = { exports: {} };
new Function('module', 'exports', f['mail/render.js'])(m, m.exports);
const ctx = {
  settings: JSON.parse(f['mail/settings.json']),
  links: JSON.parse(f['links.json']),
  catalog: JSON.parse(f['mail/catalog.json']),
  copy: JSON.parse(f['mail/copy.json']),
  imageSrc: key => 'cid:kit-' + key
};
const e = $json.error || {};
const error = String(e.message || e.description || (typeof e === 'string' ? e : JSON.stringify(e)) || 'unknown error').slice(0, 300);
const mail = m.exports.renderInternal(base.request, ctx, { status: 'failed', kits: base.kits, error });
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
const alertHtml = '⚠️ <b>Oracle site: sales kit NOT sent</b>\nTo: ' + esc(base.request.email) +
  '\nKit: ' + esc(base.request.product) + '\nError: ' + esc(error) +
  '\n\nThe practice copy (' + esc(mail.to) + ') says to send it by hand; the visitor saw an error.';
return [{ json: { mail, from: base.from, alertHtml } }];
