# HANDOFF — build the Workforce optimization interactive walkthrough

> **Done 2026-09-16, on Alex's MacBook Air** (a Mac with the repo, no Homebrew, no ffmpeg, no Node on the PATH). Built, red-teamed, captured, wired, published and documented — the record is `PROVENANCE.md` §19; the standalone demo is https://claude.ai/code/artifact/343ab0d5-1d99-4038-a395-6f177c3f5e2e. Kept as the record of the brief. Two workarounds the tooling notes below did not foresee: frames were extracted with a small Swift/AVFoundation tool instead of ffmpeg, and the capture tool ran on the Node bundled inside `/Applications/Codex.app` (v24). The narration was transcribed on-device with the macOS 26 Speech framework — no AssemblyAI key needed.

_Written 2026-09-16 on Alex's Mac (`KN7X2Y65NX`) for a session on another computer that has this repo but not this Mac's files. Everything the task needs is either in the repo or named below with how to get it. Read this whole file before starting._

## The ask (Alex, 2026-09-16)

Repeat the Large docs exercise for the **Workforce optimization** pack: an interactive, guided walkthrough of the product, generalized the way the pack's own documents generalize it, linked from the mini-site's product page with a secondary CTA, its captures replacing the product's step frames and video poster. Same standards as the first one: brand-agnostic, industry-neutral, no integrations or real inputs (upload / export / write-back mocked), the real workflow simplified to a short guided flow, hints that allow only the designated action, a cleaner UI that keeps the real product's flow, screens and information model — and a red-team pass against the pack specs before calling it done (the first demo was too narrow on its first cut; do not repeat that).

## What is in the repo (no local files needed for these)

- **Pack specs, distilled:** `context/areas/softserve/docs/2026-09-16_wfo-pack-spec-for-demo.md` — pitch, verticals, S/M/L feature rows, the feature matrix, the delivered product's flow / screens / data model / KPI formulas, the cleared figures and the prohibitions. This replaces the OneDrive one-pagers, deck, user guide and requirements for this task.
- **Site copy for the product:** `site/data/content.js`, slug `workforce-optimization` (overview steps, features, industries, technology stack) — the site's own generalization; the demo must not contradict it.
- **The reference implementation:** `site/demo/large-document-extraction/` (tour engine, click guard, mock processing, validator kinds, history, export toasts) and `tools/capture-demo-frames.mjs` + `tools/capture-policy-scenario.json` (headless-Chrome capture: tour QA, step frames, scripted scenarios).
- **The rules:** `README.md` ("The interactive walkthrough"), `docs/CONFIG.md` §3 (`demoUrl` / `demoPreviewUrl`), `docs/ASSETS.md` §1 (frame crops and the legibility rule; the WfO screenshots rejection), `docs/PROVENANCE.md` §16 (what the first build learned), `docs/VISUAL-GRAMMAR.md`.
- **Wiki context:** `context/areas/softserve/oracle-packs.md` (Pack 1 section, mini-site section), `context/index.md`.

## What lives only on Alex's Mac, and the workaround

1. **The product demo video** — Alex uploads it to his personal Google Drive. Getting it onto the build machine:
   - Best: if Google Drive for desktop is installed there, read it from the synced folder.
   - Otherwise ask Alex to share it as **"Anyone with the link"** and pull it with curl (works for files over 100 MB, which trip Google's virus-scan interstitial):
     ```bash
     ID=<file id from the share link>
     curl -L -o demo.mp4 "https://drive.usercontent.google.com/download?id=$ID&export=download&confirm=t"
     # fallback: pip install gdown && gdown "$ID" -O demo.mp4
     ```
   - The Google Drive MCP connector (claude.ai, account-level — it works from any session) can **find** the file (`search_files`, e.g. `mimeType contains 'video/' and modifiedTime > '2026-09-16T00:00:00Z'`) and give its id, but its `download_file_content` returns base64 into the context window — not usable for a video.
   - Then read it frame by frame: `ffmpeg -i demo.mp4 -vf "fps=1/4,scale=960:-1" frames/f_%03d.jpg` and tile contact sheets with `ffmpeg -i frames/f_%03d.jpg -vf "scale=480:-1,tile=4x5" sheet_%02d.jpg`; view the sheets, then zoom into the frames that show each screen. **Check for narration first** (`ffprobe` for an audio stream; a 20-second `ffmpeg -t 20 … -vn` clip listened to via transcription if a key exists). The Large docs recording had none; the narrative was screen-derived and that was fine.
2. **AssemblyAI key** (macOS Keychain `ASSEMBLYAI_API_KEY`) — not in the repo. Only needed if the video has narration worth transcribing; ask Alex for the key as an environment variable, or skip transcription.
3. **Tools:** Node ≥ 22 (the capture tool uses built-in fetch + WebSocket), **Google Chrome** at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (edit `CH` in the capture tool on another OS), **ffmpeg** (frames, contact sheets, JPEG conversion of the captures). No Python needed. `git-autosync` may not run on that machine — `git pull` first, commit with conventional messages (`feat(oracle-site): …`) as you go.

## Plan (mirror the first build, in this order)

1. Orient: `context/index.md` → `oracle-packs.md` → the spec doc → the Large docs demo code → `docs/PROVENANCE.md` §16.
2. Get the video; extract frames; reconstruct the real product's screens and flow (the spec doc §3 says what to expect: Run optimization → dashboard with map + tables → compare → filters → Zone View decisions → Technician View KPIs → export).
3. Design the generalization before coding (write it down, 10 lines): a fictional metro ("Harborview" or similar) with ~12 work zones and ~18 technicians over a 4-week period, two skill groups, a few rules that visibly matter (a planned absence, a non-movable appointment, a max-load day, a specialist-only zone), original vs optimized allocations, KPIs before/after per zone and per technician computed by the methodology in the spec (productivity, capacity at 7 jobs/day, wait time in calendar days), 2–3 dispatcher exceptions to resolve (a zone whose wait time worsens, a technician over capacity, an uncovered ZIP), a re-optimize with feedback, export + a mocked write-back to the field-service system. Multi-region and the integration list (booking, inventory, HR/WFM, forecasting, BI) as surfaces, not flows.
4. Build `site/demo/workforce-optimization/` (index.html + demo.css + demo.js + data.js) on the Large docs pattern: same tour engine, same URL switches, an inline-SVG map (no tiles), six guided steps, free exploration after. Keep the app name generic ("Workforce optimization"), no SoftServe / Oracle / NVIDIA marks, no customer.
5. Red-team it against the spec's S/M/L rows and feature matrix; close the gaps that don't change the flow.
6. Capture: extend `tools/capture-demo-frames.mjs` (or add a `MODE=frames-wfo`) for four step frames + a 16:9 poster, `?tour=off&ui=clean`, DPR 2, crops per `ASSETS.md` §1. Convert with ffmpeg to `site/assets/img/steps/workforce-optimization-1..4.jpg` and `site/assets/img/posters/workforce-optimization.jpg`; delete the four `.svg` illustrations they replace.
7. Wire the site: `site/data/config.js` → `products["workforce-optimization"]`: `demoUrl: "demo/workforce-optimization/index.html"`, `videoPoster`, and later `demoPreviewUrl`; `site/data/content.js` → the four step `image` paths to `.jpg`. Run `node --check` on both and `node tools/check-grammar.js`. The hero button and the pending-video panel already render from `demoUrl` (`pages/product.js`, `demoHref`).
8. Publish. (a) The standalone demo as its own artifact — stage a wrapper-free copy (strip `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` lines and the charset/viewport metas; keep `<title>`), under a folder inside the working directory (`.work/` is git-ignored) with `demo.css`, `demo.js`, `data.js` as supporting files; its URL becomes `demoPreviewUrl`, because claude.ai refuses to open an artifact's supporting file as a top-level page. (b) The site artifact: **read it first** (`Artifact` action `read`, url `https://claude.ai/artifact/98wafGUphFSyGSr6ctJiiN`), stage the stripped `site/index.html` the same way, publish with `url` set and `root` = `outputs/oracle-solutions-site/site`, passing the changed files (the new demo folder, the four frames, the poster, `data/config.js`, `data/content.js`) and `null` for the removed `.svg` frames. Check `git status` for another session's uncommitted site edits before publishing shared files.
9. Docs: `docs/ASSETS.md` §1 (a second product-frames block), `docs/PROVENANCE.md` §17, `README.md` walkthrough section (now two demos), `docs/CONFIG.md` only if a key changes. Then fold the outcome into the wiki with the `context-update` skill (pasted content → `oracle-packs.md` + index Now line).
10. Verify the live product page in a browser with the account signed in (Chrome extension or Browser pane): the CTA opens the demo in a new tab.

## Pitfalls already paid for

- The Browser pane tool can be unavailable (name collision); the CDP capture tool is the fallback and doubles as the tour test — it reports console exceptions.
- Google Fonts on a slow network stalls headless captures; the tool blocks the font hosts unless `ALLOW_NET=1`.
- A full-screen capture is not a step frame — crop to the region the step is about (13–14 px UI text must land near 10 px at the frame's 454 px render width).
- Approve-all must never touch a flagged item; the tour should resolve one exception itself and leave the rest for free exploration.
- The demo states counts, not the one-pager's claims; KPI deltas stay inside the cleared band (median +4.5% productivity), no € figures, no real geography.
- Route mechanical subtasks (frame extraction, captures, conversions) to Opus subagents; keep the design decisions and the red-team pass on the main model.

## Definition of done

Standalone demo artifact live · site artifact republished with the CTA, frames and poster · `check-grammar` clean · docs + wiki folded · a short report to Alex with both links, the red-team findings and the decisions he still owns (which figures, if any, the demo may carry).

## Prompt to paste into the new session

> Build the Workforce optimization interactive walkthrough for the Oracle solutions mini-site. Start by reading `outputs/oracle-solutions-site/docs/HANDOFF-workforce-demo.md` in this repo and follow it end to end: orient on the wiki and the spec doc it names, get the demo video from my Google Drive (I have uploaded it as "<file name>" — shared with anyone with the link: <link>), reconstruct the real product's flow from the frames, design the generalization per the pack specs, build the demo on the Large docs pattern, red-team it against the specs, capture the step frames and poster, wire the product page, publish both artifacts, update the docs, fold the wiki, and report. Ask me only where the handoff says a decision is mine.
