// n8n Code node "Validate and render" (Run Once for All Items). The workflow keeps
// a copy of this file; mail/README.md says how to update it. It reads the repo
// files fetched by "Read from GitHub", runs mail/render.js from them, validates the
// POST, applies the send caps and renders every email the request causes.
// Started by the schedule instead of a form, it is the self-check: it renders every
// email the forms can cause, sends nothing, and reports only a problem.
const selfCheck = !$('Form POST').isExecuted;
const body = selfCheck ? {} : ($('Form POST').first().json.body || {});
const dep = $('Deployment settings').first().json;
const deployment = { testInbox: dep.testInbox, fromName: dep.fromName, fromAddress: dep.fromAddress };
const paths = $('Files to read').all().map(i => i.json.path);
const got = $input.all();

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function stop(outcome, reason, extra) {
  const alertHtml = '⚠️ <b>Oracle site forms: ' + (selfCheck ? 'self-check failed' : esc(outcome === 'config' ? 'not working' : outcome)) + '</b>\n' + esc(reason) +
    (selfCheck ? '\n\nNo visitor has hit this yet: the next form submission would.' : '\n\nThe visitor saw an error and was pointed to the practice mailbox.');
  return [{ json: Object.assign({ outcome: selfCheck ? 'selfcheck' : outcome, reason, alertHtml }, extra || {}) }];
}

const files = {};
const images = {};
for (let i = 0; i < paths.length; i++) {
  const item = got[i];
  if (!item || !item.binary || !item.binary.data) {
    const e = item && item.json && item.json.error;
    return stop('config', 'Could not read ' + paths[i] + ' from GitHub (' + String(e ? (e.message || JSON.stringify(e)) : 'no response').slice(0, 300) +
      '). Check the GitHub read credential and the repo in Deployment settings.');
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
    deployment,
    imageSrc: key => 'cid:kit-' + key
  };
} catch (e) {
  return stop('config', 'The repo files did not load: ' + e.message + '. A syntax error in a JSON file is the usual cause; run node tools/check-grammar.js in the site repo.');
}

// Anything unexpected from here on still ends on the alerted "not working"
// path, so a visitor never meets a silent failure.
try {
if (selfCheck) {
  const problems = [];
  const samples = [{ form: 'kit', email: 'self-check@oracle.com', product: 'all', consent: true }]
    .concat(ctx.catalog.products.map(p => ({ form: 'kit', email: 'self-check@oracle.com', product: p.slug, consent: true })))
    .concat([{ form: 'demo', name: 'Self check', email: 'self-check@example.com', consent: true },
             { form: 'contact', name: 'Self check', email: 'self-check@example.com', consent: true }]);
  for (const b of samples) {
    const v = render.validate(b, ctx);
    if (!v.ok) { problems.push(b.form + ' ' + (b.product || '') + ' refused: ' + v.code); continue; }
    let mails;
    if (b.form === 'kit') { const k = render.renderKit(v.request, ctx); mails = [k, render.renderInternal(v.request, ctx, { status: 'sent', kits: k.kits })]; }
    else mails = [render.renderInternal(v.request, ctx)];
    for (const m of mails) {
      const left = (m.subject + m.html).match(/\{[a-zA-Z]+\}/);
      if (left) problems.push(b.form + ' ' + (b.product || '') + ': the token ' + left[0] + ' is not filled (mail/copy.json)');
      if (!m.to) problems.push(b.form + ': no recipient (the test inbox in Deployment settings, or inbox.live in mail/settings.json)');
      for (const im of (m.images || [])) if (!images[im.file]) problems.push('missing picture ' + im.file);
    }
  }
  if (!deployment.fromAddress) problems.push('no fromAddress in Deployment settings');
  return problems.length ? stop('selfcheck', Array.from(new Set(problems)).slice(0, 12).join('\n')) : [{ json: { outcome: 'selfcheck-ok' } }];
}
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
const from = dep.fromName ? String(dep.fromName).replace(/[<>"\r\n]/g, '') + ' <' + dep.fromAddress + '>' : dep.fromAddress;
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
    kitReplyTo: render.replyTo(settings, deployment),
    kits: kit.kits,
    practiceSent: render.renderInternal(request, ctx, { status: 'sent', kits: kit.kits })
  }),
  binary
}];
} catch (e) {
  return stop('config', 'Unexpected error while rendering (mail/render.js ' + (render && render.VERSION) + '): ' + (e && e.message || e));
}
