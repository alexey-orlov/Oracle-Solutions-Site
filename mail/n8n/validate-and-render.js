// n8n Code node "Validate and render" (Run Once for All Items). The workflow keeps
// a copy of this file; mail/README.md says how to update it. It reads the repo
// files fetched by "Read from GitHub", runs mail/render.js from them, validates the
// POST, applies the send caps and renders every email the request causes.
const body = $('Form POST').first().json.body || {};
const paths = $('Files to read').all().map(i => i.json.path);
const got = $input.all();

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function stop(outcome, reason, extra) {
  const alertHtml = '⚠️ <b>Oracle site forms: ' + esc(outcome === 'config' ? 'not working' : outcome) + '</b>\n' + esc(reason) +
    '\n\nThe visitor saw an error and was pointed to oracle@softserveinc.com.';
  return [{ json: Object.assign({ outcome, reason, alertHtml }, extra || {}) }];
}

const files = {};
const images = {};
for (let i = 0; i < paths.length; i++) {
  const item = got[i];
  if (!item || !item.binary || !item.binary.data) {
    const e = item && item.json && item.json.error;
    return stop('config', 'Could not read ' + paths[i] + ' from GitHub (' + String(e ? (e.message || JSON.stringify(e)) : 'no response').slice(0, 300) +
      '). Check the "GitHub read (Oracle-Solutions-Site)" credential.');
  }
  if (/\.png$/.test(paths[i])) images[paths[i]] = item.binary.data;
  else files[paths[i]] = (await this.helpers.getBinaryDataBuffer(i, 'data')).toString('utf8');
}

let render, ctx;
try {
  const m = { exports: {} };
  new Function('module', 'exports', files['mail/render.js'])(m, m.exports);
  render = m.exports;
  ctx = {
    settings: JSON.parse(files['mail/settings.json']),
    links: JSON.parse(files['links.json']),
    catalog: JSON.parse(files['mail/catalog.json']),
    copy: JSON.parse(files['mail/copy.json']),
    imageSrc: key => 'cid:kit-' + key
  };
} catch (e) {
  return stop('config', 'The repo files did not load: ' + e.message + '. A syntax error in a JSON file is the usual cause; run node tools/check-grammar.js in the site repo.');
}

// Anything unexpected from here on still ends on the alerted "not working"
// path, so a visitor never meets a silent failure.
try {
const verdict = render.validate(body, ctx);
if (!verdict.ok) return [{ json: { outcome: 'refused', code: verdict.code, reason: verdict.reason } }];
const request = verdict.request;
const settings = ctx.settings;

// Caps: submissions per hour, and kit emails per address per day. Kept in the
// workflow's static data, which persists between production runs.
const store = $getWorkflowStaticData('global');
const now = Date.now();
store.hits = (store.hits || []).filter(t => now - t < 3600e3);
store.kit = store.kit || {};
for (const addr of Object.keys(store.kit)) {
  const recent = store.kit[addr].filter(t => now - t < 86400e3);
  if (recent.length) store.kit[addr] = recent; else delete store.kit[addr];
}
const perHour = (settings.limits || {}).perHour || 30;
const perDay = (settings.kit || {}).perAddressPerDay || 3;
let limit = '';
if (store.hits.length >= perHour) limit = perHour + ' submissions in the last hour';
else if (request.form === 'kit' && (store.kit[request.email] || []).length >= perDay) limit = perDay + ' kits to ' + request.email + ' in the last day';
if (limit) {
  const alert = !store.lastLimitAlert || now - store.lastLimitAlert > 3600e3;
  if (alert) store.lastLimitAlert = now;
  return [{ json: { outcome: 'limited', alert, alertHtml: '⚠️ <b>Oracle site forms: send cap reached</b>\n' + esc(limit) +
    '. Further requests are refused until the window passes (mail/settings.json).' } }];
}
store.hits.push(now);
if (request.form === 'kit') (store.kit[request.email] = store.kit[request.email] || []).push(now);

const mode = settings.mode === 'live' ? 'live' : 'test';
const sender = settings.sender || {};
const from = sender.name ? sender.name.replace(/[<>"\r\n]/g, '') + ' <' + sender.address + '>' : sender.address;
const base = { request, from, mode, files, renderVersion: render.VERSION };

if (request.form !== 'kit') {
  return [{ json: Object.assign(base, { outcome: 'practice', practice: render.renderInternal(request, ctx) }) }];
}

const kit = render.renderKit(request, ctx);
const binary = {};
for (const im of kit.images) {
  if (!images[im.file]) return stop('config', 'The kit image ' + im.file + ' was not read from GitHub.');
  binary[im.cid] = images[im.file];
}
return [{
  json: Object.assign(base, {
    outcome: 'kit',
    kit: { to: kit.to, subject: kit.subject, html: kit.html, text: kit.text, inline: kit.images.map(im => im.cid).join(',') },
    kitReplyTo: ((sender.replyTo || {})[mode]) || '',
    kits: kit.kits,
    practiceSent: render.renderInternal(request, ctx, { status: 'sent', kits: kit.kits })
  }),
  binary
}];
} catch (e) {
  return stop('config', 'Unexpected error while rendering (mail/render.js ' + (render && render.VERSION) + '): ' + (e && e.message || e));
}
