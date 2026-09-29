# Step mocks — the How it works screens of products with no walkthrough

Round 20 (PROVENANCE §41). Four products have no interactive walkthrough under `site/demo/`, so their four How it works frames are captured from these HTML mocks: `account-insights`, `case-evidence-collection`, `plan-vs-actual-investigation` (Shell A, the Large docs / Workforce look) and `business-metrics-qa` (Shell B, the Cross-system ERP Q&A look). Nothing here ships: the folder sits outside `site/`.

- `shell-a.css`, `shell-b.css` — the two app shells. `<slug>/step-<n>.html` — one fixed 1280 × 800 page per step, self-contained, system fonts, no external requests.
- Synthetic data only. The only people are the mock users: Robin Hale and Nadia Brandt in Shell A, Elena Marsh and Tomas Reyes in Shell B. The companies are invented (Alder Foods, Baltic Packaging, Arvane Group, Cedar Quay …). No customer, real company or person names, ever.
- `cap.mjs` — the headless-Chrome capture tool the frames were made with (Node ≥ 22, no dependencies; its header lists the step types, including `rectshot`, which crops a CSS-px rectangle at DPR 2 for the zoom). `<slug>/cap-*.json`, `_steps/*.json`, `cap-frames.json` — the capture steps used (they point at the scratchpad paths of the day; re-point them before re-running).
- `frames-preview.html#<slug>` — shows each full frame inside the page's 872 × 545 frame with the region ring and the zoom inset, to check the anchor corner.

To regenerate a frame: open the page at 1280 × 800, DPR 2, headless (the capture recipe and the region legibility rule are in `docs/ASSETS.md` §1), save the full viewport as `site/assets/img/steps/<slug>-<n>.jpg` (1744 px wide, JPEG q82) and the region as `<slug>-<n>-zoom.jpg` (802 px wide, q85), and set `overview.steps[n-1].shot.region / anchor / alt` in `site/data/content.js`.

When a product gets its own walkthrough, capture its frames from the walkthrough instead and delete that product's folder here.
