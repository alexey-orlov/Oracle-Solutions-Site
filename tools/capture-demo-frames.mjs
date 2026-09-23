// Drive the interactive walkthrough (site/demo/large-document-extraction/) in
// headless Chrome over the DevTools protocol and capture PNGs. No dependencies:
// Node ≥ 22 (built-in fetch + WebSocket) and Google Chrome at the path below.
//
//   node tools/capture-demo-frames.mjs <url> <outdir> [scene,scene,...]
//
// Modes (env):
//   default        — every guided-tour scene, with the guide visible (QA of the tour)
//   MODE=frames    — the four step frames + the poster, tour off: open the URL with
//                    ?tour=off&ui=clean and set DPR=2; then crop per docs/ASSETS.md §1
//   MODE=site      — the product page: hero, stepper, pending-video panel
//   MODE=script    — data-driven: STEPS=<json> of click / sleep / shot / eval / type steps
//                    (tools/capture-policy-scenario.json walks the second document type)
//                    Workforce optimization: tools/capture-wfo-tour.json drives the whole tour by clicks
//                    (tour QA), tools/capture-wfo-frames.json takes its four step frames + poster with
//                    DPR=2 and ?tour=off&ui=clean&state=start (crops per docs/ASSETS.md §1).
//   W / H          — viewport in CSS px (default 1600 × 1000)
// Fonts from Google are blocked (ALLOW_NET=1 to allow) so a slow network cannot
// stall the capture; system fallbacks render instead.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const [,, URL_, OUT, SCENES] = process.argv;
const CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
mkdirSync(OUT, { recursive: true });
const W = +(process.env.W || 1600), H = +(process.env.H || 1000);

const chrome = spawn(CH, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-sync",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${OUT}/../chrome-profile-cdp`, `--window-size=${W},${H}`, "--hide-scrollbars", "about:blank"],
  { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function targets() {
  for (let i = 0; i < 40; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json`); return await r.json(); } catch { await sleep(250); } }
  throw new Error("chrome did not start");
}
const list = await targets();
const page = list.find(t => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const logs = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  if (msg.method === "Runtime.consoleAPICalled") logs.push(`[console.${msg.params.type}] ` + msg.params.args.map(a => a.value ?? a.description).join(" "));
  if (msg.method === "Runtime.exceptionThrown") logs.push("[exception] " + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
};
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (m) => m.error ? rej(new Error(method + ": " + JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error("eval: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) + " in " + expr); return r.result.value; };
// SVG elements (the walkthrough maps' zones and technician homes) have no .click(); dispatch a bubbling click instead.
const click = (sel) => ev(`(()=>{const el=document.querySelector(${JSON.stringify(sel)}); if(!el) throw new Error("no element "+${JSON.stringify(sel)}); if (typeof el.click === "function") el.click(); else el.dispatchEvent(new MouseEvent("click", {bubbles:true, cancelable:true})); return true;})()`);
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.data, "base64")); console.log("shot", name); };

await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
if (!process.env.ALLOW_NET) await send("Network.setBlockedURLs", { urls: ["*://fonts.googleapis.com/*", "*://fonts.gstatic.com/*"] });
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: +(process.env.DPR || 1), mobile: false });
await send("Page.navigate", { url: URL_ });
await sleep(1800);

if (process.env.MODE === "site") {
  // The marketing site itself: product hero with the new CTA, then the stepper frames.
  await sleep(1500); await shot("site-hero");
  await ev("(function(){ var s=document.querySelector('.stepper, [class*=\"step\"] button, .how-it-works'); window.scrollTo(0, 900); return true; })()"); await sleep(700); await shot("site-stepper");
  await ev("(function(){ var b=[].slice.call(document.querySelectorAll('button')).filter(function(x){return /Score, cite, validate/.test(x.textContent)})[0]; if(b) b.click(); return !!b; })()"); await sleep(600); await shot("site-stepper-3");
  await ev("(function(){ var v=document.querySelector('.video-card'); if(v) v.click(); return !!v; })()"); await sleep(700); await shot("site-video-pending");
  console.log(logs.length ? "LOGS:\n" + logs.join("\n") : "LOGS: none"); ws.close(); chrome.kill(); process.exit(0);
}
if (process.env.MODE === "frames") {
  // Clean product frames for the site's stepper (tour off): 1 upload+classify · 2 extract · 3 score/cite/validate · 4 review+export
  await click("#dropzone"); await sleep(300); await click("#picker-list li.is-main"); await sleep(200); await click("#picker-open"); await sleep(2600); await shot("frame-1");
  await sleep(4200); await click("#doc-table tr.is-new"); await sleep(500); await click('.group[data-group="cleaning"] .group-head'); await sleep(500); await shot("frame-2");
  await click('[data-cite="msa:cleaning:0"]'); await sleep(700); await click("#details .act-approve"); await sleep(300);
  await click('.group[data-group="cleaning"] .group-head'); await sleep(200);
  await click('.group[data-group="discount"] .group-head'); await sleep(300); await click('.group[data-group="discount"] tr.has-flag'); await sleep(900); await shot("frame-3");
  await click("#details .act-fix"); await sleep(300); await click("#approve-all"); await sleep(3400); await click('.tab[data-tab="ratecard"]'); await sleep(600); await shot("frame-4");
  await ev("document.querySelector('#tour-toggle').hidden = true; document.querySelector('.tab[data-tab=\"review\"]').click(); true"); await sleep(400);
  await ev("(function(){ var g=document.querySelector('.group[data-group=\"discount\"]'); if (g && g.classList.contains('is-open')) g.querySelector('.group-head').click(); var c=document.querySelector('.group[data-group=\"cleaning\"]'); if (c && !c.classList.contains('is-open')) c.querySelector('.group-head').click(); document.querySelector('[data-close-details]') && document.querySelector('[data-close-details]').click(); return true; })()"); await sleep(500); await shot("poster");
  console.log(logs.length ? "LOGS:\n" + logs.join("\n") : "LOGS: none"); ws.close(); chrome.kill(); process.exit(0);
}
if (process.env.MODE === "script") {
  // Data-driven: STEPS=<json file> holding [{click:sel}|{sleep:ms}|{shot:name}|{eval:expr}|{type:{sel,text}}]
  const steps = JSON.parse(readFileSync(process.env.STEPS, "utf8"));
  try {
    for (const s of steps) {
      if (s.click) await click(s.click);
      else if (s.sleep) await sleep(s.sleep);
      else if (s.shot) await shot(s.shot);
      else if (s.eval) await ev(s.eval);
      else if (s.type) await ev(`(()=>{const el=document.querySelector(${JSON.stringify(s.type.sel)}); if(!el) throw new Error("no element "+${JSON.stringify(s.type.sel)}); el.value=${JSON.stringify(s.type.text)}; el.dispatchEvent(new Event('input',{bubbles:true})); return true;})()`);
    }
  } catch (e) { console.error("FAILED:", e.message); }
  console.log(logs.length ? "LOGS:\n" + logs.join("\n") : "LOGS: none"); ws.close(); chrome.kill(); process.exit(0);
}
const want = SCENES ? SCENES.split(",") : null;
const scenes = {
  async tour_gate() { await shot("00-gate"); },
  async tour_step1() { await click("#gate-start"); await sleep(600); await shot("01-tour-upload"); },
  async tour_pick() { await click("#dropzone"); await sleep(500); await shot("02-tour-picker"); await click("#picker-list li.is-main"); await sleep(400); await shot("03-tour-picker-open"); },
  async processing() { await click("#picker-open"); await sleep(2300); await shot("04-processing"); },
  async documents() { await sleep(4500); await shot("05-documents"); },
  async review() { await click("#doc-table tr.is-new"); await sleep(600); await shot("06-review"); },
  async expand() { await click('.group[data-group="cleaning"] .group-head'); await sleep(500); await shot("07-review-expanded"); },
  async cite() { await click('[data-cite="msa:cleaning:0"]'); await sleep(900); await shot("08-cite-details"); },
  async approve_row() { await click("#details .act-approve"); await sleep(500); await shot("09-approved-row"); },
  async flag() { await click('.group[data-group="discount"] .group-head'); await sleep(400); await click('.group[data-group="discount"] tr.has-flag'); await sleep(600); await shot("10-flag-details"); },
  async fix() { await click("#details .act-fix"); await sleep(500); await shot("11-fixed"); },
  async approve_all() { await click("#approve-all"); await sleep(500); await shot("12-approve-all"); },
  async ratecard() { await click('.tab[data-tab="ratecard"]'); await sleep(500); await shot("13-ratecard"); },
  async download() { await click("#download-xlsx"); await sleep(600); await shot("14-downloaded"); await sleep(400); await shot("15-end"); }
};
try {
  for (const [name, fn] of Object.entries(scenes)) { if (want && !want.includes(name)) continue; await fn(); }
} catch (e) { console.error("FAILED:", e.message); }
console.log(logs.length ? "LOGS:\n" + logs.join("\n") : "LOGS: none");
ws.close(); chrome.kill();
