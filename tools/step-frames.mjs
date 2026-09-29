// step-frames.mjs — turn one capture run into a product's How it works files,
// by the contract in docs/ASSETS.md §1 and docs/VISUAL-GRAMMAR.md §2.2:
//   <slug>-<n>.jpg        the whole screen, 1744 px wide, JPEG q82
//   <slug>-<n>-zoom.jpg   the region, 802 px wide (its own width if narrower), JPEG q85
// and prints each step's `shot` fields for content.js: region in % of the
// 1280 × 800 capture, the anchor picked by the §1.1 rule (br, bl, tr, tl: the
// first corner whose inset does not cover the region), and the alt.
//
// Input: the stdout of a capture run (tools/step-mocks/cap.mjs) whose steps
// print, per step, one `eval {"region": {n, x, y, w, h, alt}}` line in viewport
// CSS px, and save step-<n>-full.png and step-<n>-zoom.png (the zoom shot of the
// same rectangle, in page coordinates, at DPR 2). tools/capture-ai-frames.json
// is a worked example.
//
//   node tools/step-frames.mjs <capture stdout> <raw png dir> <out dir> <slug>
//
// It refuses, rather than writes, a region under the legibility floor
// (inset scale < 0.92), an inset taller than half the frame, or a region no
// corner leaves clear: move or shorten the region in the walkthrough's frame,
// never shrink the scale. macOS only (sips).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const [, , RUNLOG, RAW, OUT, SLUG] = process.argv;
if (!SLUG) { console.error("usage: node tools/step-frames.mjs <capture stdout> <raw png dir> <out dir> <slug>"); process.exit(2); }
mkdirSync(OUT, { recursive: true });
const W = 1280, H = 800;               // the capture, CSS px
const FW = 872, FH = 545;              // the page's frame at 1440, CSS px
const IW = 401, IMAXH = 272, PAD = 24; // the zoom inset and its offset from the corner
const r1 = (v) => Math.round(v * 10) / 10;

const steps = [];
for (const line of readFileSync(RUNLOG, "utf8").split("\n")) {
  const m = line.match(/^eval (\{"region".*\})$/);
  if (!m) continue;
  const R = JSON.parse(m[1]).region;
  const s = IW / R.w, insetH = R.h * s;
  if (s < 0.919) throw new Error(`step ${R.n}: region ${R.w} px wide, inset scale ${s.toFixed(3)} under 0.92`);
  if (insetH > IMAXH + 0.5) throw new Error(`step ${R.n}: inset ${insetH.toFixed(0)} px tall, over ${IMAXH}`);
  const f = FW / W, rb = { x: R.x * f, y: R.y * f, w: R.w * f, h: R.h * f };
  const box = {
    br: { x: FW - PAD - IW, y: FH - PAD - insetH }, bl: { x: PAD, y: FH - PAD - insetH },
    tr: { x: FW - PAD - IW, y: PAD }, tl: { x: PAD, y: PAD }
  };
  const anchor = ["br", "bl", "tr", "tl"].find((k) => {
    const b = box[k];
    return b.x + IW <= rb.x || b.x >= rb.x + rb.w || b.y + insetH <= rb.y || b.y >= rb.y + rb.h;
  });
  if (!anchor) throw new Error(`step ${R.n}: every corner's inset covers the region; move or shorten it`);
  steps.push({ n: R.n, region: [r1(R.x / W * 100), r1(R.y / H * 100), r1(R.w / W * 100), r1(R.h / H * 100)], anchor, alt: R.alt || "", scale: s, insetH });
}
if (!steps.length) throw new Error("no `eval {\"region\": …}` lines in " + RUNLOG);

const sips = (args) => execFileSync("sips", args, { stdio: ["ignore", "pipe", "pipe"] }).toString();
for (const st of steps) {
  const full = `${RAW}/step-${st.n}-full.png`, zoom = `${RAW}/step-${st.n}-zoom.png`;
  sips(["--resampleWidth", "1744", full, "--out", `${OUT}/tmp-${st.n}.png`]);
  sips(["-s", "format", "jpeg", "-s", "formatOptions", "82", `${OUT}/tmp-${st.n}.png`, "--out", `${OUT}/${SLUG}-${st.n}.jpg`]);
  const zw = +sips(["-g", "pixelWidth", zoom]).match(/pixelWidth: (\d+)/)[1];
  let src = zoom;
  if (zw > 802) { sips(["--resampleWidth", "802", zoom, "--out", `${OUT}/tmpz-${st.n}.png`]); src = `${OUT}/tmpz-${st.n}.png`; }
  sips(["-s", "format", "jpeg", "-s", "formatOptions", "85", src, "--out", `${OUT}/${SLUG}-${st.n}-zoom.jpg`]);
  rmSync(`${OUT}/tmp-${st.n}.png`, { force: true });
  rmSync(`${OUT}/tmpz-${st.n}.png`, { force: true });
  console.log(`step ${st.n}: region [${st.region.join(", ")}] · anchor ${st.anchor} · inset ${st.scale.toFixed(3)}x, ${Math.round(st.insetH)} px tall · zoom ${Math.min(zw, 802)} px`);
}
writeFileSync(`${OUT}/shots.json`, JSON.stringify(steps.map(({ n, region, anchor, alt }) => ({ n, region, anchor, alt })), null, 2) + "\n");
console.log(`wrote ${steps.length * 2} JPEGs and shots.json to ${OUT}`);
