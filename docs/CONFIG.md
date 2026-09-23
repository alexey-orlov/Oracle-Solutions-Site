# CONFIG.md — how to change the site without touching page code

Everything that changes after launch — links, the contact address, the form destination, who can open the seller panel — lives in **one file**:

```
site/data/config.js      →  window.SITE_CONFIG
```

It is plain JavaScript, loaded before the app. Edit it with any text editor, save, reload the page. There is no build step, no npm install, nothing to compile. The file must stay valid JavaScript: every value in quotes, every line ending in a comma except the last one in its block.

Copy (headlines, product descriptions, prices, disclaimers) lives in `site/data/content.js` instead — see `SCHEMA.md`.

---

## 1. The whole file at a glance

```js
window.SITE_CONFIG = {
  contactEmail: "oracle@softserveinc.com",
  formEndpoint: "",
  sellerGate: {
    allowedDomains: ["softserveinc.com", "oracle.com"],
    kitAutoSend: false,
    kitEmailKey: "oracle-ai-solutions:kit-email",
    legacyStorageKey: "oracle-ai-solutions:seller-unlocked"
  },
  productOrder: ["<slug>", "<slug>", ...],
  products: {
    "<slug>": {
      marketplace: false,
      marketplaceUrl: "",
      video: false,
      videoUrl: "",
      videoPoster: "",
      successStoryUrl: "",
      materials: { "sales-deck": "", "one-pager": "", ... }
    }
  }
};
```

**The rule that governs every URL field: an empty string means the control is not rendered at all.** No placeholder, no greyed-out button, no "coming soon" line in its place. The page simply does not show it. Paste a URL and the control appears on the next reload.

`video` is the one field that is not a URL, and the one deliberate exception to that rule — §3 says what it does and why it exists.

---

## 2. Top-level keys

### `contactEmail`

The mailbox every form falls back to when `formEndpoint` is empty. Today: `oracle@softserveinc.com` — **the same address the contact card prints**, and that is the rule: the card and the form directly beneath it must reach one destination. They did not, once: the card printed the practice mailbox while the form composed to an unverified `RnDrequest@` alias, so a seller demoing the Contacts tab saw the mismatch the moment the mail client opened. If a different routing address is ever wanted here, it has to be verified first and the reason recorded in this file.

```js
contactEmail: "oracle@softserveinc.com",
```

This address is **never printed on a page**. It is used only as the destination of the `mailto:` the form composes. If the alias is replaced, change it here and nothing else.

### `formEndpoint`

Where the demo form and the Services contact form send their data.

| Value | What happens on submit |
|---|---|
| `""` (empty — today) | The browser opens the visitor's mail client with a pre-composed message to `contactEmail`, the form fields in the body. The page shows the "Your mail client opened with the request" confirmation. |
| A URL | The form `POST`s JSON to that URL with `fetch`, and shows the "Thanks — your request is in." confirmation on a 2xx response, or the error message on anything else. |

```js
formEndpoint: "https://example.invalid/hook/leads",
```

**Payload shape posted to the endpoint** (JSON, `Content-Type: application/json`):

```json
{
  "form": "demo",
  "name": "…",
  "email": "…",
  "company": "…",
  "role": "customer",
  "product": "workforce-optimization",
  "message": "…",
  "consent": true,
  "page": "#/products/workforce-optimization",
  "submittedAt": "2026-09-13T18:00:00.000Z"
}
```

`form` is `"demo"` or `"contact"`. `role` is one of `customer`, `oracle-seller`, `softserve`, `other`. `product` is a product slug or `""` when the visitor chose "Not sure yet".

The endpoint must answer with a 2xx status and must allow cross-origin POSTs from the site's origin (`Access-Control-Allow-Origin`). If it does not, submissions will silently fail CORS and the visitor sees the error message — test one submission from the deployed URL, not from `file://`.

**Security note.** Do not commit a live trigger URL for a paid or side-effectful automation (an n8n webhook, a Zapier hook). Bots scrape new URLs out of public repositories within the hour. If the endpoint has to be a webhook, require header auth on it and keep the URL out of version control — set it on the deployed copy only.

### `productOrder`

The order the seven products are presented in, everywhere at once. An array of slugs, best first.

```js
productOrder: [
  "large-document-extraction",
  "account-insights",
  "workforce-optimization",
  "plan-vs-actual-investigation",
  "case-evidence-collection",
  "cross-system-erp-qa",
  "business-metrics-qa"
],
```

One list drives every surface that shows more than one product:

- **the home page's Products screen (S3)** — this array orders the **rows inside each category column**, after the products have been split by `category`; the column a product lands in is its `category`, the position it takes inside that column is this list (round 5);
- **the home hero's stack visual** — the product chips under each of the three category tiles, in the same order;
- the Products page tiles, and the faceted counts beside the rail options that have one;
- the "Which product?" select in both forms.

There is no second place to edit and no way for two surfaces to disagree. (The Previous/Next pager that used to sit at the foot of a product page was removed in round 3, B — the tab bar and the Products grid are the navigation, and a pager that wrapped from the last product back to the first was inventing an order the reader had not asked for.)

**It is presentation order, not a list of what exists.** The products themselves are declared in `content.js`; this array only says what sequence they are shown in. That split is what makes the three fallbacks safe:

| Situation | What happens |
|---|---|
| A slug in `products[]` (`content.js`) is **missing** from this array | It still renders. It keeps its `content.js` position relative to the other unlisted ones and sorts after every listed product. |
| A slug here matches **no** product in `content.js` | Ignored silently. A typo or a slug left behind after a product is removed costs nothing. |
| `productOrder` is **empty or absent** | Every surface falls back to the order the products appear in `content.js`. |

So a partial list is legitimate: name only the two or three you care about seeing first and let the rest fall in behind them in their declared order.

The array is **sort order only** — it never filters. Every product renders whatever this list says. **The Products page reports no total at all**: the results line above the grid says what a filter returned (`3 products`, no denominator) and stays empty when nothing is filtered or when a filter returns nothing, and `productsPage.count` was deleted from `content.js` in §18.9. To take a product off the site, remove it from `content.js`, not from here.

**What the rail shows, and what it does not.** The platform group lists **only the platforms that at least one product matches today** — the option is an offer to filter, and an option returning nothing is a dead end on a page a seller demos live; a `0` beside an Oracle product name in front of an Oracle account executive reads as a scoreboard. With today's `productOrder` and facets that is *All · OCI + NVIDIA · Oracle Autonomous AI Lakehouse*; *Oracle AI Data Platform* and *Oracle AI for Fusion Applications* are absent until a product carries the facet, and the moment one does the option appears with its count, with no config change. **The deep link still works for all four** — `#/products?tech=oracle-ai-fusion` renders that option, selected, above its `emptyState`. The two **All** options carry no count (it would be the size of the catalog), and a count of zero renders no number. This reverses the round-4 behaviour recorded in `docs/PROVENANCE.md` §17.7; the reasoning is in §18.9.

### `sellerGate` — the sales-kit request (round 8)

The block keeps its old name; since round 8 it configures the **sales-kit request** — on the second tab of the switch in each product's **Contacts** tab since round 10b, and on `#/sellers` (`SCHEMA.md` §`salesKit`, `PROVENANCE.md` §24). The gate that unlocked a materials list, its seller-notes fetch (`notesUrl`) and its unlock flag are retired.

#### `allowedDomains`

The email domains that may **receive** the kit. A visitor types a work email; if the part after the `@` matches one of these (case-insensitively, subdomains included — `uk.oracle.com` passes), the request goes ahead; anything else gets the domain error, which routes customers and partners to the demo or scoping form.

```js
allowedDomains: ["softserveinc.com", "oracle.com"],
```

**This is routing, not access control.** The check runs in the browser and is bypassable, so whatever sits behind `formEndpoint` must check the domain again and send only to the address that was typed. Nothing whose exposure matters goes in either data file: a determined reader can open `content.js` in view-source.

#### `kitAutoSend`

`false` until something behind `formEndpoint` actually emails the kit. It decides which confirmation a successful POST shows: `true` → *Check your inbox* ("We've emailed the … sales kit to …"); `false` → *Your request is in* (the kit will reach the address within two working days). With `formEndpoint` empty neither applies: the visitor's mail client opens a request to `contactEmail` and the page says *One step left*. **Never set it to `true` for a human-read mailbox** — the page would claim an email went out.

The endpoint receives `{ form: "kit", email, product: "all" | <slug>, consent, page }`.

#### `kitEmailKey`

The `localStorage` key the last successful kit email is remembered under, to prefill the form on the next visit. Nothing else is stored.

#### `legacyStorageKey`

The retired gate's "unlocked" flag. The kit form removes it on load; delete this key once no browser can still hold the old flag.

---

## 3. Per-product keys — `products["<slug>"]`

The seven slugs, exactly:

```
account-insights
case-evidence-collection
plan-vs-actual-investigation
large-document-extraction
workforce-optimization
cross-system-erp-qa
business-metrics-qa
```

### `marketplace` and `marketplaceUrl`

`marketplace` is the **boolean that puts Oracle Marketplace on a customer-facing surface**; `marketplaceUrl` only decides whether the badge is a link. `true` today on `workforce-optimization` and `large-document-extraction`, on the owner's statement that those two are listed; `marketplaceUrl` is still empty on both, so their badges render inert until the listing URLs land.

```js
marketplace: true,
marketplaceUrl: "https://cloudmarketplace.oracle.com/marketplace/en_US/listing/000000",
```

Set `marketplace: true` and three things appear together, on the next reload:

- the **Oracle Marketplace** badge (storefront icon) at the right end of the product hero's chip row,
- the same badge top-right of that product's image band in the Products grid (the home page carries no product tiles since round 9, so no badge either),
- the count beside the **Oracle Marketplace** checkbox in the rail's *Artifacts* group, which filters on this same boolean (`mp=1`). **Both Artifacts checkboxes always render**, with their faceted counts, whatever the flags say: the rail's shape does not move under the reader between visits, and `demo=1` / `mp=1` are always honored. A box whose count is zero renders disabled rather than absent. Since round 9 the two **radio** rails behave the same way — every platform and every group, always, a zero-count option disabled and printing no number — so this is the house style again rather than an exception (§18.9's objection to a `0` beside an Oracle product name is answered by printing no number at all).

With `marketplaceUrl` set, the badge opens the listing in a new tab; without one it renders inert — the flag says the listing exists, and a link to nowhere would be worse than no link. There is **no separate hero button**: a second control pointing at the same URL as the badge is one control too many.

**Why a boolean and a URL rather than the URL alone (round 4).** The badge and the facet checkbox are two surfaces of one fact, and inferring that fact from a URL meant the filter and the badge could disagree the moment one of them was read differently. `check-grammar.js` fails a `marketplaceUrl` set while `marketplace` is `false`, so a listing cannot appear half-wired. Turning either on is a claim about a third party: confirm the listing exists first.

### `demoUrl`

The interactive walkthrough — a self-contained guided demo of the product on prepared data, described in `README.md` ("The interactive walkthroughs"). Set today on `large-document-extraction`, `workforce-optimization` and `cross-system-erp-qa`, each pointed at a folder **inside** `site/`, so it deploys with the site and the link stays relative:

```js
demoUrl: "demo/large-document-extraction/index.html",
demoUrl: "demo/workforce-optimization/index.html",
demoUrl: "demo/cross-system-erp-qa/index.html",
```

**Round 9: `demoUrl` is the single source for everything that claims an interactive demo exists.** Non-empty → four things appear together:

- the secondary **Interactive demo** button in the product hero (its label is `shared.demoCta` in `content.js`, which round 10 set to the badge's own words and glyph), and the same button inside the panel the pending video frame opens;
- the **Interactive demo** badge (`cursor-click` glyph) in that product's hero chip row and on its Products-page tile;
- the count beside the **Interactive demo** checkbox in the rail's *Artifacts* group (`demo=1`), which filters on the same field.

Both buttons open the walkthrough in a **new tab** — it carries its own guide and locks every control but the one it points at, and a seller mid-call must keep the product page behind it. Empty → none of the four exists. An absolute URL on another host works the same way.

Until round 9 the badge and the filter read `video` instead, which is why *Account insights* carried a badge with no walkthrough behind it while *Cross-system ERP Q&A* had a walkthrough and no badge (Alex: *"ERP Q&A has an interactive demo but no Demo tag"*). The resolution of where the badge and the hero button point now lives once, in `UI.demoHref` (`assets/app.js`), and `pages/product.js` delegates to it, so the two controls cannot open different things. On a product page with a video frame the badge scrolls to the frame and opens it; on one without, it opens the walkthrough itself; from a tile it goes to the product page. `tools/check-grammar.js` asserts that `demoUrl` is set for exactly the three products whose walkthrough ships under `site/demo/`, and warns if the path is not on disk.

### `demoPreviewUrl`

Only matters while the site itself is previewed as a **claude.ai artifact**. There, a relative `demoUrl` opens the artifact's supporting file as a top-level page, which the artifact host refuses (`ERR_BLOCKED_BY_RESPONSE`, seen 2026-09-16). So on that host — and only there (`pages/product.js` checks the hostname) — the two buttons go to this URL instead: the walkthrough published as its **own** artifact.

```js
demoPreviewUrl: "https://claude.ai/artifact/NdxY4f1D6hxC7pjyMRs6zP",
demoPreviewUrl: "https://claude.ai/code/artifact/343ab0d5-1d99-4038-a395-6f177c3f5e2e",
demoPreviewUrl: "https://claude.ai/code/artifact/6c822cc7-1c05-4504-ad61-7b64c86e9ceb",   // cross-system-erp-qa
```

On the site's real host it is ignored and the relative `demoUrl` is used, so nothing has to change at deployment. Keep it in step with `demoUrl`: republish the standalone demo artifact whenever the walkthrough changes, or the preview shows an older demo than the site ships.

Empty while the walkthrough exists is a **known intermediate state**, not a bug: the demo ships in `site/` and works everywhere except inside the site's own artifact preview, where the button falls back to the relative path and the host refuses it. All three walkthroughs now carry their own artifact, so no product is in that state today — but a rebuilt walkthrough needs its artifact republished at the same URL, not a new one, or the site's preview links to the old build (the ERP Q&A demo was rebuilt on 2026-09-17, `docs/PROVENANCE.md` §22.20).

### `video`

A boolean — the only non-URL field in a product block. **It decides whether the hero carries a demo frame at all, and nothing else** (round 9), which is also the switch between the hero's two layouts. It no longer drives the demo badge or the *Interactive demo* filter: those read `demoUrl`, the walkthrough they open.

```js
video: true,
```

| `video` | `videoUrl` | Product hero |
|---|---|---|
| `false` | `""` | Single column: text over the hero background image. No video frame, no poster, no greyed play button, no "coming soon" line. |
| `true` | `""` — today on the three | Two columns: text left, a 16:9 media frame right — poster, teal play button, caption "Watch the demo". Clicking it opens a small panel: the product name, the line *"The demo recording is being prepared."*, and a **"Request a live demo"** button that goes to that product's Contacts tab and closes the panel. Escape and the close button work as on any modal. |
| `true` or `false` | a URL | Same two-column frame; clicking it plays the video in a modal. A URL turns the frame on by itself, so a product whose video arrives before anyone edits this flag still gets its frame. |

In every case where the frame renders, the frame *is* the watch affordance, so the separate secondary "Watch the demo" button drops out of the CTA row and **"Request a demo"** stays the only primary CTA.

`true` today on `large-document-extraction`, `workforce-optimization` and `account-insights` — the interactive walkthrough on the first, and demo recordings in preparation for the other two. `false` on the other four.

**Why the flag rather than the URL.** The flag is **the owner's statement that a recording exists or is coming**, and the URL is the wiring that arrives after it — which is why `video: true` with an empty `videoUrl` is a supported state, not a half-finished one: the hero frame renders its *recording in preparation* panel, which is the site's own designed answer for an asset that has not landed. Set the flag when the owner says the recording is real; paste the URL when the file exists. **What the flag may not do is speak for a demo it is not** — round 4 had it driving the badge and the facet as well, and by round 9 the two had drifted apart in both directions. A claim now reads the thing it claims: the badge and the filter read `demoUrl`, the frame reads `video`.

### `videoUrl`

The demo video itself. Paste the link when the recording lands, **and set `video: true` in the same edit** — the URL turns the frame on by itself, but the badge and the facet read the flag.

```js
videoUrl: "https://www.youtube.com/watch?v=…",
```

A normal share link is fine. YouTube `watch?v=`, `youtu.be/`, `youtube.com/shorts/` and `vimeo.com/<id>` links are converted to their embed form before the player is framed; links already in embed/player form are passed through unchanged.

Expected to be filled first for `workforce-optimization`, `large-document-extraction` and `account-insights`. Empty on all seven today.

### `videoPoster`

The still image shown inside that media frame. **Only ever used where the frame renders** — that is, where `video` is `true` or `videoUrl` is set; on a product with neither it is dead weight, which is why it is safe to leave empty everywhere.

```js
videoPoster: "assets/img/posters/workforce-optimization.jpg",
videoPoster: "assets/img/posters/cross-system-erp-qa.jpg",   // set, but video: false today
```

A path relative to `site/index.html`, or an absolute `https://` URL. Landscape, 16:9, at least 1280×720.

`cross-system-erp-qa` carries a poster with `video: false`, so nothing renders it yet: the file is captured and wired so that turning the frame on is a one-word change, not another capture round.

The renderer resolves the poster in this order, first non-empty wins:

1. **`videoPoster`** — what you set here.
2. **The YouTube thumbnail** — `https://img.youtube.com/vi/<id>/maxresdefault.jpg`, derived automatically when `videoUrl` is a YouTube link.

There is no third step, and the product's hero image is explicitly **not** one. It used to be, and the result was the hero photograph rendered inside a frame sitting on top of the same photograph — a brighter cut-out of the wallpaper with a play button on it, in the first screen of the page (`PROVENANCE.md` §14.6).

So a YouTube demo needs nothing here at all, and a frame waiting for its recording (`video: true`, no URL) renders with no `<img>`: the `video-card--plate` ground, the teal play button and the caption. That is the pending state, and it is the site's own rule for a missing asset. The backdrop behind the hero is held a stop darker on this layout so the frame still reads as a card and not as a hole cut in the background.

Set `videoPoster` when the auto-derived thumbnail is a bad frame, when the video is on Vimeo or Stream (no public thumbnail), when you want a designed still rather than a screenshot, or when you want a pending frame to carry a picture — a product screenshot, a step frame, a desaturated crop at another focal point. Never point it at the hero file. Set today on `large-document-extraction` and `workforce-optimization`: each carries a 1600 × 900 still of its own walkthrough (`ASSETS.md` §1), so the pending frame shows the product rather than the plate.

**If the poster cannot be loaded, it is dropped rather than shown broken.** The media frame keeps its veil, teal play button and caption over the inset panel, which already reads as a deliberate frame. One case needs naming: YouTube has `maxresdefault.jpg` only for videos uploaded above 720p, and for the rest it answers `200` with a 120×90 grey stand-in instead of a `404`. The renderer therefore treats a 120-pixel-wide YouTube thumbnail as a miss, retries `hqdefault.jpg` (which exists for every real video), and drops the poster only if that fails too. Nothing about this reaches the console.

Empty on all seven today.

### `successStoryUrl`

A hosted case summary. When non-empty, the Overview tab's **case study** gains its one link out, labelled from that case's `downloadLabel`, which opens the file in a new tab. It is deliberately not a forced download: browsers ignore the `download` attribute on a cross-origin URL, so a button labelled "Download" would have opened a tab anyway and the label would have been a small lie. There is no hero button — the case study owns the link.

The case study itself is governed by `content.js`, not by this URL: it renders only where `overview.caseStudy` is an object, and not at all where it is `null`. A section whose only content is "no customers yet" is worse than no section on a page sellers demo live.

The key keeps its round-3 name although the block was renamed: it is a config key rather than shipped copy, and renaming it would touch seven entries for no reader-facing gain.

Expected first for `workforce-optimization` and `large-document-extraction`. Empty on all seven today.

### `materials` — the sales-kit manifest links

A map of **material key → URL**. The key must match a `key` in that product's `sellers.materials` array in `content.js`; the title, description and state come from there, and only the URL comes from here. **Not rendered since round 8**: together with `sellers.materials` it is the manifest whoever sends the kit works from — keep the links current here so they have one home.

```js
materials: {
  "sales-deck": "https://softserveinc.sharepoint.com/:p:/s/…",
  "one-pager": "",
  "feature-list": "",
  "demo-video": ""
}
```

- URL present → an enabled **Open** button, which opens the material in a new tab.
- Empty string → a disabled **Link pending** control, with the row's title and description still shown.

Keys in use, per product:

| Product | Material keys |
|---|---|
| account-insights | `accelerator-pack-onepager`, `sales-deck`, `one-pager`, `feature-list`, `demo-video` |
| case-evidence-collection | `sales-deck`, `one-pager`, `feature-list`, `demo-video` |
| plan-vs-actual-investigation | `sales-deck`, `one-pager`, `feature-list`, `demo-video` |
| large-document-extraction | `sales-deck`, `one-pager`, `feature-list`, `demo-video`, `marketplace-package` |
| workforce-optimization | `sales-deck`, `one-pager`, `feature-list`, `demo-video`, `marketplace-package` |
| cross-system-erp-qa | `lakehouse-jumpstart-deck`, `lakehouse-quickstart-deck`, `one-pager`, `feature-list`, `demo-video` |
| business-metrics-qa | `lakehouse-jumpstart-deck`, `lakehouse-quickstart-deck`, `one-pager`, `feature-list`, `demo-video` |

A row whose `state` in `content.js` is `superseded` stays disabled even if a URL is pasted here — that state exists to stop a file circulating, and the URL alone must not override it. Change the state in `content.js` once the file is confirmed current.

**Share-link scope.** A SharePoint or OneDrive link generated "for people in SoftServe" will not open for an Oracle seller. Generate links at the scope you actually want before pasting them, and remember that anyone who unlocks the panel can pass the link on.

---

## 3b. Hero images — where they live and how to swap one

Hero background images are **not** in `config.js`. They are content, so they live in `content.js`:

| Surface | Key |
|---|---|
| Services page | `services.hero.image` |
| Each product page | `products[].hero.image` |

**The home page has no hero image.** Round 5 replaced the photograph with the built-on stack visual; `overview.hero.image` is retired and `check-grammar.js` fails if it returns. `assets/img/heroes/overview.jpg` **stays on disk, unreferenced** — the same treatment the customer logos get (`ASSETS.md` §4), because the grade it was put through is the expensive half to redo — and its `heroes.json` entry stays with it, carrying `"unreferenced": true` and a one-line note. So nine files, eight of them referenced.

Each is `{ file, alt, focal }`:

```js
hero: {
  image: {
    file: "assets/img/heroes/workforce-optimization.jpg",
    alt: "An overhead field of interlocking hexagonal plates, with loose ones still settling into the pattern from above",
    focal: "50% 55%"
  }
}
```

- **`file`** — path relative to `site/index.html`. The files sit in `site/assets/img/heroes/`, named by product slug, plus `overview.jpg` and `services.jpg`.
- **`alt`** — a plain description of the picture, kept as a record of what the file actually shows. The hero image is decorative — the headline beside it carries the meaning — so it ships as `alt=""` and is hidden from assistive tech. Keep the description truthful anyway: it is how the next person knows which file is which without opening all nine.
- **`focal`** — a CSS `object-position` value, e.g. `"55% 40%"`. This is the knob to turn when a crop clips the wrong part of the image on a wide screen; it changes nothing else.

### The manifest — `site/assets/img/heroes/heroes.json`

The manifest is the source of truth for `alt` and `focal`. `content.js` holds a copy so the page needs no runtime fetch — **when you change one, change the other.** Nothing in the page ever loads `heroes.json`; it is an operator record that happens to sit in the served root.

Each entry carries five fields — `file`, `alt`, `focal`, `source` and `credit` — and `source` / `credit` are **deliberately generic** on every entry: `"SoftServe deck imagery"` and `"SoftServe"`.

> **Ship-gate rule:** `heroes.json` is publicly fetchable. It must carry **no source-deck filename, no media path, no customer or opportunity code, no internal path.** A per-file provenance line belongs in `PROVENANCE.md` §11.1, which is not served — record a new image's real source there, and leave the manifest generic.

### The register a replacement has to hold

**All nine hero files are photography from SoftServe's own decks, put through one grade** (eight of them referenced since round 5 — see above) — cool slate-teal, median luminance 55–63, 1920 × 900, progressive JPEG at quality 84. That is the constraint, not a coincidence: a hero set assembled from several looks reads as whatever was to hand rather than as one system.

A replacement image must therefore:

- land in the same grade — cool (blue above green above red), median luminance in the 45–65 band, bright points at p99 ≥ 200, 1920 × 900, under 350 KB;
- carry **no rendered text, no fake UI labels, no identifiable face and no legible customer name, logo or screen text** — a hero carrying garbled glyphs or malformed anatomy is the loudest "AI page" tell on a surface sellers demo live;
- keep its brightest element clear of the bottom edge, which fades into the page ground, and clear of the left third, which the veil darkens for the headline.

The grade recipe and its constants are in `PROVENANCE.md` §11.1. Do not compensate with a CSS filter: `.hero-bg-img` ships near-neutral (`opacity: 1`, `brightness(1.05) contrast(1.02) saturate(1.05)`) precisely because the grade is baked into the pixels, and an image that needs the filter bent to fit is the wrong image.

**If a hero image is missing**, the renderer drops the `<img>` and the hero falls back to the gradient alone. That is a safety net, not a mode to ship in: it makes every hero identical and flat, which is exactly what the per-product image is there to prevent. `node tools/check-grammar.js` warns for each hero file that is not on disk.

**To swap a hero image:** drop the new file into `site/assets/img/heroes/`, point `file` at it, adjust `focal` until the crop sits right, update the same entry in `heroes.json` (generic `source` / `credit` only), and record where it actually came from in `PROVENANCE.md` §11.1. On a page the image is the background of the **top block only** — never the Overview tab, never a full-screen wash. It renders at 60–70vh maximum on desktop under a left-to-right dark veil plus a bottom fade, so the headline always sits on near-black; below 900 px the veil becomes a top-to-bottom fade and the image drops to `opacity: .62`.

**A product hero has a second surface: its Products-page tile.** Every tile on `#/products` is that product's own `hero.image`, same file and same `focal`, cropped by CSS under a heavier gradient veil so the name, chips, one-liner and outcome bullets stay legible on top of it. Swapping a hero therefore changes two things at once — check the tile as well as the page, and pick a `focal` that survives both crops (16:9-ish on the page, roughly 4:3 in the tile). A product with no hero file on disk falls back to the flat tile ground rather than a broken frame.

### The other image families

| Family | Path | Keyed by | Used by |
|---|---|---|---|
| Step frames | `assets/img/steps/<slug>-<n>.<ext>` | product **and** step number | the How-it-works stepper on the Overview tab, one 16:10 frame per step — a real product screenshot where one exists, otherwise a designed illustration built to the same frame |
| Industry photographs | `assets/img/industries/<key>.<ext>` | **industry**, not product | the industry use-case tabs; one file serves every product whose tabs include that industry |
| The contact portrait | `assets/img/people/<name>.<ext>` | the one person in `shared.contact` | the contact card on every Contacts tab and above the Services form, as a circle. **None ships today** — `shared.contact.photo` is empty and the card renders an initials avatar until a portrait is confirmed to be the person named (`ASSETS.md` §3) |

All three are named in `content.js` (`overview.steps[].image`, `overview.industryCases[].image`, `shared.contact.photo`), not here — they are copy-side facts, not switches. A missing file is a warning from `check-grammar.js`, never a failure; the contact portrait degrades to an initials monogram, and the other two to an empty frame.

---

## 4. Adding an eighth product

1. Add the product object to `products[]` in `content.js` (see `SCHEMA.md` for every field).
2. Add a matching `products["<new-slug>"]` block to `config.js` with all seven keys (`marketplace`, `marketplaceUrl`, `video`, `videoUrl`, `videoPoster`, `successStoryUrl`, `materials`). `video` and `marketplace` must both be real booleans — `check-grammar.js` rejects a missing one and a quoted `"false"`, which would be truthy and turn the frame or the badge on.
3. Add the slug to `productOrder` where you want it to appear. Skipping this step is not an error — the product lands at the end of every list instead — but the position is a judgement about what a seller should meet first, so make it deliberately rather than by omission.
4. Set its `facet` to one of the **four canonical technology ids**, and nothing else: `oci-nvidia` (*OCI + NVIDIA*), `oracle-ai-data-platform` (*Oracle AI Data Platform*), `oracle-ai-lakehouse` (*Oracle Autonomous AI Lakehouse*), `oracle-ai-fusion` (*Oracle AI for Fusion Applications*). There is no fifth platform and no `other` catch-all; a new Oracle platform is a new facet, added to `facets.technology`, to `shared.tagFamilies.tech.icons`, to both platform-card lists and to `check-grammar.js` in one edit. If it lands on a facet that currently has no products, nothing else is needed — the facet is already declared and will stop rendering its empty state once a product carries it.
5. Give it a two-entry `tags` array: its `categoryChip`, then its facet's `label` **verbatim**. The engine it runs on — AI-Q, cuOpt, Select AI, a source system — goes in `technology`, never appended to the platform chip; `check-grammar.js` fails a third tag.

If the config block is missing, the product page still renders; every optional control simply stays hidden, exactly as if all its URLs were empty.

---

## 5. Checking a change

After editing either data file:

```
node --check site/data/config.js
node --check site/data/content.js
node tools/check-grammar.js
```

The first two must print nothing. A syntax error there blanks the whole site, because the page cannot read its own content — a trailing comma in the wrong place is the usual cause.

`check-grammar.js` must print `OK`. It asserts that every product still fills every slot of the component grammar (see `VISUAL-GRAMMAR.md`): hero image, problem/solution pair, 1–4 metric tiles with their note, ROI band, 6–8 short feature lines each landing in exactly one workflow step, 3–5 steps, 3–6 industry cases with keys from the fixed set, the at-a-glance side facts, in/out of scope, the four-step flow, the 4–5 layer solution stack with a Required item in every layer and both an inbound and an outbound integration, and the POV fact strip. Site-wide it also asserts the contact card, the `contacts` tab and the absence of the retired `demo` tab. It also fails on any banned string — internal vocabulary or an uncleared customer name — reaching the data layer. It exits non-zero and names each failure.
