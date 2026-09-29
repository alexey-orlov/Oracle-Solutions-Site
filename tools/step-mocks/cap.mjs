// Headless-Chrome capture for this round (a copy of the site's tools/capture-demo-frames.mjs
// MODE=script, with a configurable port and full-page shots). No dependencies: Node >= 22.
//
//   PORT=9334 W=1440 H=900 DPR=1 STEPS=<steps.json> node cap.mjs <url> <outdir>
//
// steps.json: an array of
//   {"sleep": ms} · {"eval": "js expression"} · {"click": "css selector"}
//   {"shot": "name"}        viewport PNG
//   {"fullshot": "name"}    whole-document PNG (viewport height kept, so vh layouts stay true)
//   {"scrollthrough": ms}   scroll to the bottom in 700 px steps (lazy images load), then back to top
//   {"clipshot": {"name": "n", "selector": "css"}}  PNG of one element's box
//   {"rectshot": {"name": "n", "x": 10, "y": 20, "w": 400, "h": 280}}  PNG of a CSS-px rectangle (at DPR)
//   {"exprshot": {"name": "n", "expr": "js returning {x, y, w, h}"}}  the same, measured on the page (page coordinates)
//   {"goto": "url"}         navigate, then wait 1800 ms
//   {"size": {"w": 375, "h": 812, "mobile": true}}  change the viewport
// Every shot prints "shot <name>" so a caller can log per unit of work.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const [,, URL_, OUT] = process.argv;
const CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = +(process.env.PORT || 9334);
mkdirSync(OUT, { recursive: true });
let W = +(process.env.W || 1440), H = +(process.env.H || 900);
const DPR = +(process.env.DPR || 1);

const chrome = spawn(CH, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--disable-extensions", "--disable-sync", `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${OUT}/../chrome-profile-${PORT}`, `--window-size=${W},${H}`, "--hide-scrollbars", "about:blank"],
  { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function targets() {
  for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json`); return await r.json(); } catch { await sleep(250); } }
  throw new Error("chrome did not start on port " + PORT);
}
const list = await targets();
const page = list.find(t => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const logs = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  if (msg.method === "Runtime.consoleAPICalled" && (msg.params.type === "error" || msg.params.type === "warning"))
    logs.push(`[console.${msg.params.type}] ` + msg.params.args.map(a => a.value ?? a.description).join(" "));
  if (msg.method === "Runtime.exceptionThrown") logs.push("[exception] " + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
};
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (m) => m.error ? rej(new Error(method + ": " + JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error("eval: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result.value; };
const click = (sel) => ev(`(()=>{const el=document.querySelector(${JSON.stringify(sel)}); if(!el) throw new Error("no element "+${JSON.stringify(sel)}); if (typeof el.click === "function") el.click(); else el.dispatchEvent(new MouseEvent("click", {bubbles:true, cancelable:true})); return true;})()`);
const save = (name, data) => { writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, "base64")); console.log("shot", name); };
const metrics = async (w, h, mobile) => send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: DPR, mobile: !!mobile });

await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
// A headless UA is refused by some sites (softserveinc.com serves an empty page to it).
await send("Network.setUserAgentOverride", { userAgent: process.env.UA || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", acceptLanguage: "en-US,en;q=0.9", platform: "MacIntel" });
await metrics(W, H, false);
await send("Page.navigate", { url: URL_ });
await sleep(1800);

const steps = JSON.parse(readFileSync(process.env.STEPS, "utf8"));
try {
  for (const s of steps) {
    if (s.sleep) await sleep(s.sleep);
    else if (s.eval) { const v = await ev(s.eval); if (v !== true && v !== undefined) console.log("eval", JSON.stringify(v)); }
    else if (s.click) await click(s.click);
    else if (s.goto) { await send("Page.navigate", { url: s.goto }); await sleep(1800); }
    else if (s.size) { W = s.size.w; H = s.size.h; await metrics(W, H, s.size.mobile); await sleep(600); }
    else if (s.shot) save(s.shot, (await send("Page.captureScreenshot", { format: "png" })).data);
    else if (s.scrollthrough) {
      const total = await ev("Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)");
      for (let y = 0; y < total; y += 700) { await ev(`window.scrollTo(0, ${y}); true`); await sleep(s.scrollthrough); }
      await ev("window.scrollTo(0, 0); true"); await sleep(400);
    }
    else if (s.fullshot) {
      const lm = await send("Page.getLayoutMetrics");
      const hgt = Math.ceil((lm.cssContentSize || lm.contentSize).height);
      const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: Math.min(hgt, 16000), scale: 1 } });
      save(s.fullshot, r.data);
    }
    else if (s.rectshot) {
      // {"rectshot": {"name": "n", "x": cssX, "y": cssY, "w": cssW, "h": cssH}} — a CSS-px rectangle of the page, at DPR.
      const q = s.rectshot;
      const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: q.x, y: q.y, width: q.w, height: q.h, scale: 1 } });
      save(q.name, r.data);
    }
    else if (s.exprshot) {
      // {"exprshot": {"name": "n", "expr": "js returning {x, y, w, h} in page CSS px"}}: measured, not guessed.
      const q = await ev(s.exprshot.expr);
      if (!q) throw new Error("exprshot: no rectangle for " + s.exprshot.name);
      const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: q.x, y: q.y, width: q.w, height: q.h, scale: 1 } });
      save(s.exprshot.name, r.data);
    }
    else if (s.clipshot) {
      const box = await ev(`(()=>{const el=document.querySelector(${JSON.stringify(s.clipshot.selector)}); if(!el) return null; const r=el.getBoundingClientRect(); return {x:r.left+scrollX, y:r.top+scrollY, w:r.width, h:r.height};})()`);
      if (!box) { console.log("clipshot: no element", s.clipshot.selector); continue; }
      const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: box.x, y: box.y, width: box.w, height: box.h, scale: 1 } });
      save(s.clipshot.name, r.data);
    }
  }
} catch (e) { console.error("FAILED:", e.message); }
console.log(logs.length ? "LOGS:\n" + logs.join("\n") : "LOGS: none");
ws.close(); chrome.kill(); process.exit(0);
