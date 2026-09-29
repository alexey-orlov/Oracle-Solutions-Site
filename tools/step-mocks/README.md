# Step mocks — the How it works screens of products with no walkthrough

Round 20 (PROVENANCE §41). Three products have no interactive walkthrough under `site/demo/`, so their four How it works frames are captured from these HTML mocks: `case-evidence-collection`, `plan-vs-actual-investigation` (Shell A, the Large docs / Workforce look) and `business-metrics-qa` (Shell B, the Cross-system ERP Q&A look). Account insights had mocks here until its walkthrough replaced them (PROVENANCE §49). Nothing here ships: the folder sits outside `site/`.

- `shell-a.css`, `shell-b.css` — the two app shells. `<slug>/step-<n>.html` — one fixed 1280 × 800 page per step, self-contained, system fonts, no external requests.
- Synthetic data only. The only people are the mock users: Robin Hale and Nadia Brandt in Shell A, Elena Marsh and Tomas Reyes in Shell B. The companies are invented (Arvane Group, Cedar Quay …). No customer, real company or person names, ever.
- `cap.mjs` — the headless-Chrome capture tool the frames are made with (Node ≥ 22, no dependencies; its header lists the step types). `<slug>/cap-*.json`, `_steps/*.json`, `cap-frames.json` — the round-20 capture steps (they point at the scratchpad paths of the day; re-point them before re-running, and ignore their zoom and region steps, retired in round 21). The steps of the frames round 21 recaptured from walkthroughs are in `tools/step-captures/`.

To regenerate a frame: open the page at 1280 × 800, DPR 2, headless (the recipe is `docs/ASSETS.md` §1), put the step's element in a selected state where the eye needs leading, using the shell's own styles and never an overlay (§1.1), save the full viewport as `site/assets/img/steps/<slug>-<n>.jpg` (1744 px wide, JPEG q82), and set `overview.steps[n-1].shot.alt` in `site/data/content.js`.

When a product gets its own walkthrough, capture its frames from the walkthrough instead and delete that product's folder here.
