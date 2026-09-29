# CONFIG.md — how to change the site without touching page code

The switches that change after launch — the contact address, the form destination, the kit's domains, the product order and each product's flags — live in **one file**:

```
site/data/config.js      →  window.SITE_CONFIG
```

It is plain JavaScript, loaded before the app. Edit it with any text editor, save, reload the page. There is no build step, no npm install, nothing to compile. The file must stay valid JavaScript: every value in quotes, every line ending in a comma except the last one in its block.

**Every link a product's sales kit uses lives in `links.json` at the repo root, not here** (round 12, §3a below): the one-pager, the sales deck, the feature list, the interactive demo and the demo video. The kit email reads that file, and the site reads the three links its own buttons need from it through `tools/site_links.py`, on request; nothing stores a copy (round 15).

Copy (headlines, product descriptions, prices, disclaimers) lives in `site/data/content.js` instead — see `SCHEMA.md`. The words of the emails live in `mail/copy.json` (`mail/README.md`).

---

## 1. The whole file at a glance

```js
window.SITE_CONFIG = {
  contactEmail: "oracle@softserveinc.com",
  formEndpoint: "",
  sellerGate: {
    allowedDomains: ["softserveinc.com", "oracle.com"],
    kitAutoSend: true,
    kitEmailKey: "oracle-ai-solutions:kit-email",
    legacyStorageKey: "oracle-ai-solutions:seller-unlocked"
  },
  productOrder: ["<slug>", "<slug>", ...],
  products: {
    "<slug>": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "",
      successStoryUrl: ""
    }
  }
};
```

**The rule that governs every URL field, here and in `links.json`: an empty string means the control is not rendered at all.** No placeholder, no greyed-out button, no "coming soon" line in its place. The page simply does not show it. Paste a URL and the control appears on the next reload (for a `links.json` link, after `node tools/sync-links.js`).

**Since round 18 the rule has no exception** (Alex: *"No fake and placeholder links no longer allowed"*). The `video` switch, which put a demo frame on the page before a recording existed, is retired and fails the build (§3); `marketplace` may be `true` only with its listing's URL.

---

## 2. Top-level keys

### `contactEmail`

The practice mailbox the forms name whenever the visitor needs a way round them. Today: `oracle@softserveinc.com`, **the same address the contact card prints**, and that is the rule: the card and the form directly beneath it point to one destination. They did not, once: the card printed the practice mailbox while the form's fallback went to an unverified `RnDrequest@` alias. If a different address is ever wanted here, it has to be verified first and the reason recorded in this file.

```js
contactEmail: "oracle@softserveinc.com",
```

Forms print it as an ordinary link in three places: the line a copy with no endpoint shows under each form, the red line after a failed send, and the kit confirmations. **No form opens a mail app with it** (START-HERE §4). If the alias is replaced, change it here and nothing else.

### `formEndpoint`

Where both forms send their data: *Talk to us* and the sales kit (the Services page's *Request a scoping call* form left with it in round 18). Since round 12 the destination is the n8n workflow that sends the emails (`mail/README.md`).

| Value | What happens on submit |
|---|---|
| `""` and no local file (the claude.ai preview, a fresh clone) | Nothing can be sent, and each form says so under itself before anyone types: *"This preview can't send forms. Email oracle@softserveinc.com…"*. A submit repeats it in red. No mail app opens. |
| A URL (a deployed copy, or a local run) | The form `POST`s JSON to that URL with `fetch` in the background, shows *Sending…*, then *Thanks, your request is in* (the kit: *Check your inbox*) on a 2xx response. On anything else it shows a red *That didn't send* line and keeps what was typed. |

**The URL is never committed.** A live trigger URL in git is the AO-Personal-OS hard rule this repo inherits, and `tools/check-grammar.js` fails a non-empty `formEndpoint` here. A deployed copy sets it in its own `config.js`. On `127.0.0.1` or `localhost` the forms read it from `site/data/endpoint.local.json` instead. That file is git-ignored, never published and works in every browser on the machine (`mail/README.md`, "Testing").

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
  "page": "http://…/#/products/workforce-optimization/contacts"
}
```

`form` is `"demo"` or `"contact"`. `role` is one of `customer`, `oracle-seller`, `oracle-partner`, `softserve`, `other`. `product` is a product slug or `""` when the visitor chose "Not sure yet". The sender stamps the time itself. The kit posts `{ form: "kit", email, product: <slug>, consent, page }`: one product's kit, never `"all"` since 2026-09-29.

The endpoint must answer with a 2xx status and must allow cross-origin POSTs from the site's origin. The workflow allows only the origins in `tools/n8n-workflow.js`, so a new host is added there before its first test (`mail/README.md`, "Moving to a public host").

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

**What the rail shows, and what it does not.** Since round 9 the platform group is a **fixed list in canonical order** — *All · AI Lakehouse · AI Data Platform · OCI + NVIDIA NeMo* — read from `facets.technology`, with *AI for Fusion Applications* left out by its `catalog: false`. An option whose count is zero is **disabled and prints no number**: a `0` beside an Oracle product name in front of an Oracle account executive reads as a scoreboard (§18.9). A product on two platforms counts under both (the two Q&A products, on AI Lakehouse and AI Data Platform since 2026-09-29), so the options are filters, not a partition. **The deep link works for all four** — `#/products?tech=oracle-ai-fusion` renders that option, selected, above its `emptyState`. The two **All** options carry no count (it would be the size of the catalog). None of this needs a config change.

### `sellerGate` — the sales-kit request (round 8)

The block keeps its old name; since round 8 it configures the **sales-kit request** — on the second tab of the switch in each product's **Contacts** tab since round 10b, and on `#/sellers` (`SCHEMA.md` §`salesKit`, `PROVENANCE.md` §24). The gate that unlocked a materials list, its seller-notes fetch (`notesUrl`) and its unlock flag are retired.

#### `allowedDomains`

The email domains that may **receive** the kit. A visitor types a work email; if the part after the `@` matches one of these (case-insensitively, subdomains included — `uk.oracle.com` passes), the request goes ahead; anything else gets the domain error, which routes customers and partners to the demo or scoping form.

```js
allowedDomains: ["softserveinc.com", "oracle.com"],
```

**This is routing, not access control.** The check runs in the browser and is bypassable, so whatever sits behind `formEndpoint` must check the domain again and send only to the address that was typed. Nothing whose exposure matters goes in either data file: a determined reader can open `content.js` in view-source.

#### `kitAutoSend`

`true` since round 12: the endpoint is the workflow that emails the kit, and it answers 2xx **only after** the kit email was accepted for delivery (`mail/README.md`). It decides which confirmation a successful POST shows: `true` → *Check your inbox* ("We've emailed the … sales kit to …"); `false` → *Your request is in* (the kit will reach the address within two working days). With no endpoint neither applies: the form says it cannot send the kit, and names `contactEmail`. **Set it back to `false` if `formEndpoint` ever points at a human-read mailbox** — the page would claim an email went out.

The endpoint receives `{ form: "kit", email, product: "all" | <slug>, consent, page }`, and checks the domain again against `mail/settings.json` `kit.allowedDomains`, which the checker holds equal to `allowedDomains` here.

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

`marketplace` is the **boolean that puts Oracle Marketplace on a customer-facing surface**, and `marketplaceUrl` is the listing it opens. **Since round 18 the two say one thing together: `true` requires an https `marketplaceUrl`**, because a flag with no listing rendered an inert badge, a placeholder for a link (Alex: *"No fake and placeholder links no longer allowed"*). No listing exists today, so `marketplace` is `false` on all seven; `workforce-optimization` and `large-document-extraction` carried `true` with no URL until round 18.

```js
marketplace: true,
marketplaceUrl: "https://cloudmarketplace.oracle.com/marketplace/en_US/listing/<id>",
```

Set both and three things appear together, on the next reload:

- the **Oracle Marketplace** badge (storefront icon) at the right end of the product hero's chip row, opening the listing in a new tab,
- the same badge top-right of that product's image band in the Products grid (the home page carries no product tiles since round 9, so no badge either),
- the count beside the **Oracle Marketplace** checkbox in the rail's *Artifacts* group, which filters on the same fact (`mp=1`, read through `UI.hasListing`). **Both Artifacts checkboxes always render**, with their faceted counts, whatever the flags say: the rail's shape does not move under the reader between visits, and `demo=1` / `mp=1` are always honored. A box whose count is zero renders disabled rather than absent, which is how the Marketplace box reads while no listing exists. Since round 9 the two **radio** rails behave the same way — every platform and every group, always, a zero-count option disabled and printing no number.

There is **no separate hero button**: a second control pointing at the same URL as the badge is one control too many.

**Why a boolean and a URL rather than the URL alone (round 4).** The badge and the facet checkbox are two surfaces of one fact, read through one function (`UI.hasListing`, round 18), so they cannot disagree. `check-grammar.js` fails a `marketplaceUrl` set while `marketplace` is `false` (a listing hidden) and `marketplace: true` without an https URL (a placeholder shown). Turning it on is a claim about a third party: confirm the listing exists first. The URL is a link stored outside `links.json`, the one such field left; moving it there is a change to the links contract that the packaging plugin shares (`START-HERE.md` §9).

### `video` — retired in round 18

The hero's frame **renders only when `links.json` holds a recording (`video`) or a walkthrough (`interactiveDemo`) for the product** (§55): the recording where there is one, else the walkthrough (§3a). A product with neither has the single-column hero on the gradient: no frame, no poster, no play button. The `video` boolean that used to put the frame on the page before a recording existed — *"the owner's statement that a recording exists or is coming"*, answered on click by a *"The demo recording is being prepared"* panel — is retired, and `check-grammar.js` fails the key on any product (Alex, round 18: *"No fake and placeholder links no longer allowed"*). A listing written with it, for example from the packaging plugin's exemplar, fails by name until the key is deleted.

A recording's frame *is* its watch affordance, so no "Watch the demo" button joins the CTA row, and *Talk to us* stays the only primary CTA; *Interactive demo* stays in the row wherever a walkthrough exists, beside a frame that may open it too. The demo badge opens the walkthrough itself, from `links.json` like the hero button, and never clicks the frame (§55). Neither the badge nor the *Interactive demo* filter reads the video: they read the walkthrough link, `interactiveDemo`.

### `videoPoster`

The still inside the hero's frame: the product's own screen, over the recording or, where there is none, over the walkthrough (§55). The key keeps its round-3 name because the packaging plugin writes it. **Required wherever the frame renders**, that is wherever `links.json` holds a `video` or an `interactiveDemo`: `check-grammar.js` fails an empty one there, a path outside `assets/img/posters/`, a file not on disk, and the tile's photograph. On a product with neither it is dead weight and stays empty.

```js
videoPoster: "assets/img/posters/workforce-optimization.jpg",   // over the recording
videoPoster: "assets/img/posters/account-insights.jpg",         // over the walkthrough
```

A path relative to `site/index.html`, under `assets/img/posters/`. Landscape, 16:9, 1600 × 900, under 300 KB.

Six products carry one: `large-document-extraction` and `workforce-optimization` over their recordings, and `account-insights`, `cross-system-erp-qa`, `fleet-route-optimization` and `repair-or-replace-decisions` over their walkthroughs (ASSETS §1.6).

The renderer resolves the poster in this order, first non-empty wins:

1. **`videoPoster`** — what you set here.
2. **The YouTube thumbnail** — `https://img.youtube.com/vi/<id>/maxresdefault.jpg`, derived automatically when the `video` link is a YouTube link.

There is no third step, and the product's `hero.image` is explicitly **not** one: it is the catalog tile's photograph, and inside the frame it once read as a brighter cut-out of the wallpaper with a play button on it (`PROVENANCE.md` §14.6).

A YouTube recording would find its own thumbnail, but the checker still asks for `videoPoster` wherever the frame renders, so the frame never falls back. The fallback exists for a poster that fails to load: no `<img>`, the `video-card--plate` ground, the button and, for a recording, the caption.

A poster is a distinct capture of the product's own screen, leading with its before → after band where it has one, taken from the walkthrough on synthetic data. Never point it at the tile's photograph, and never take it from a recording that runs on a customer's data.

**If the poster cannot be loaded, it is dropped rather than shown broken.** The media frame keeps its veil, play button and caption over the inset panel, which already reads as a deliberate frame. One case needs naming: YouTube has `maxresdefault.jpg` only for videos uploaded above 720p, and for the rest it answers `200` with a 120×90 grey stand-in instead of a `404`. The renderer therefore treats a 120-pixel-wide YouTube thumbnail as a miss, retries `hqdefault.jpg` (which exists for every real video), and drops the poster only if that fails too. Nothing about this reaches the console.

### `successStoryUrl`

A hosted case summary. When non-empty, the Overview tab's **case study** gains its one link out, labelled from that case's `downloadLabel`, which opens the file in a new tab. It is deliberately not a forced download: browsers ignore the `download` attribute on a cross-origin URL, so a button labelled "Download" would have opened a tab anyway and the label would have been a small lie. There is no hero button — the case study owns the link.

The case study itself is governed by `content.js`, not by this URL: it renders only where `overview.caseStudy` is an object, and not at all where it is `null`. A section whose only content is "no customers yet" is worse than no section on a page sellers demo live.

The key keeps its round-3 name although the block was renamed: it is a config key rather than shipped copy, and renaming it would touch seven entries for no reader-facing gain.

Expected first for `workforce-optimization` and `large-document-extraction`. Empty on all seven today.

---

## 3a. `links.json` — every link, in one file and nowhere else (rounds 12, 15)

`links.json` at the **repo root** holds every link a product's sales kit uses (Alex, 2026-09-23: "links to all those sources stored in the repo in a simple, easily configurable and human-editable config file"), and since round 15 it is the only file that stores one (Alex, 2026-09-24: "a separate config file that stores the links, and they are not saved anywhere else"). It sits outside `site/` on purpose: nothing under `site/` is private — anyone can read `config.js` in view-source — and the kit documents carry the package prices the site keeps off its pages. The kit email reads the file from GitHub on every request. The site reads the three links its own buttons need through `tools/site_links.py`, which builds `data/links.js` from this file when asked: on every request in `tools/serve.py`, once for a publish. No copy is kept under `site/`.

**Keys are product slugs**, the one id a product has everywhere: its `slug` in `content.js`, the pack's `slug:` in Oracle-Packaging-Skills `packs/<slug>/pack-spec.md`, and the walkthrough's folder `site/demo/<slug>/`. A listing, its pack spec and its links therefore map onto each other with no lookup table. `sync-links.js` fails a key that is not a slug, and a walkthrough path outside its product's folder.

```json
{
  "siteUrl": "https://claude.ai/artifact/HTEJADBQF3ZevFPuSoTHri",
  "products": {
    "workforce-optimization": {
      "onePager": "https://softserveinc-my.sharepoint.com/:b:/p/…",
      "salesDeck": "https://softserveinc-my.sharepoint.com/:p:/p/…",
      "featureList": "https://softserveinc-my.sharepoint.com/:b:/p/…",
      "interactiveDemo": "demo/workforce-optimization/index.html",
      "interactiveDemoArtifact": "https://claude.ai/code/artifact/…",
      "video": ""
    }
  }
}
```

Every product in `content.js` needs an entry with all six keys; an empty string means the artifact does not exist yet. The kit email leaves it out, and the practice's copy of the request names it as missing, so the practice can follow up.

| Key | What it is | Who reads it |
|---|---|---|
| `onePager`, `salesDeck`, `featureList` | The kit documents, as full `https://` links anyone at Oracle or SoftServe can open. A SharePoint or OneDrive link generated "for people in SoftServe" will not open for an Oracle seller, and SoftServe's OneDrive makes no other kind today (tenant policy, checked 2026-09-24; START-HERE §9). | the kit email only |
| `interactiveDemo` | The walkthrough: a path inside `site/` (`demo/<slug>/index.html`), or a full `https://` link. Never a localhost or preview address: the local server, the published site and the email each resolve the path against their own address | the site and the kit email |
| `interactiveDemoArtifact` | The same walkthrough standing on its own: a claude.ai artifact, or (Account insights, §49) its single-file copy on OneDrive | the site on claude.ai, and the kit email while `siteUrl` is a claude.ai link |
| `video` | The recorded demo: YouTube, Vimeo, SharePoint or Stream | the site and the kit email |
| `siteUrl` (top level) | The address the kit email links product pages to | the kit email |

**After changing `interactiveDemo`, `interactiveDemoArtifact` or `video`, publish the site.** The local server shows the change on the next reload, and a publish builds `data/links.js` from this file (`python3 tools/site_links.py --out .work/publish/data/links.js`, START-HERE §6). `node tools/sync-links.js` validates the file and rewrites `mail/catalog.json` (product names for the email, no links). `tools/check-grammar.js` runs the same validation. It also fails `site/data/links.js` if a copy ever appears there, and fails a link from this file found in any other file of the repo (`docs/PROVENANCE.md`, the round log, excepted). The kit documents need no command: the email picks them up on the next request.

### `interactiveDemo`

The interactive walkthrough — a self-contained guided demo of the product on prepared data, described in `README.md` ("The interactive walkthroughs"). Set today on six products (`large-document-extraction`, `workforce-optimization`, `cross-system-erp-qa`, `fleet-route-optimization`, `repair-or-replace-decisions`, `account-insights`), each pointed at a folder **inside** `site/`, so it deploys with the site and the link stays relative.

**It is the single source for everything that claims an interactive demo exists** (round 9). Non-empty → three things appear together:

- the secondary **Interactive demo** button in the product hero (its label is `shared.demoCta` in `content.js`, the badge's own words and glyph since round 10);
- the **Interactive demo** badge (`cursor-click` glyph) in that product's hero chip row and on its Products-page tile;
- the count beside the **Interactive demo** checkbox in the rail's *Artifacts* group (`demo=1`), which filters on the same link.

Both buttons open the walkthrough in a **new tab** — it carries its own guide and locks every control but the one it points at, and a seller mid-call must keep the product page behind it. Empty → none of them exists. The resolution of where the badge and the button point lives once, in `UI.demoHref` (`assets/app.js`), and `pages/product.js` delegates to it, so the two controls cannot open different things. On its product page, from any tab, the badge opens the walkthrough itself; from a tile it goes to the product page. Where the product has no recording, the hero's frame opens the walkthrough too, through the same `UI.demoHref` (§55). `tools/check-grammar.js` asserts that the link is set for exactly the products whose walkthrough ships under `site/demo/` (its `DEMO_SLUGS`), and `tools/sync-links.js` fails a path that is not on disk or not in the product's own folder, `demo/<slug>/`.

### `interactiveDemoArtifact`

Only matters while the site itself runs as a **claude.ai artifact**. There, a relative walkthrough link opens the artifact's supporting file as a top-level page, which the artifact host refuses (`ERR_BLOCKED_BY_RESPONSE`, seen 2026-09-16). So on that host — and only there (`assets/app.js` checks the hostname) — the two buttons go to this URL instead: the walkthrough published as its **own** artifact. The kit email uses it on the same condition: while `siteUrl` is a claude.ai link, the email's *Interactive demo* opens this artifact.

Account insights' is a OneDrive link to the walkthrough's single-file copy, Alex's choice (§49), rather than an artifact: it opens only as far as its sharing setting allows (see `onePager` above for what SoftServe's OneDrive permits), and OneDrive may offer the HTML file as a download rather than a page.

On a real host it is ignored and the relative path is used, so nothing has to change at deployment. Keep it in step with the walkthrough: republish the standalone artifact **at the same URL** whenever the walkthrough changes, or the preview shows an older demo than the site ships (the ERP Q&A demo was rebuilt on 2026-09-17, `docs/PROVENANCE.md` §22.20). `sync-links.js` fails this key set while `interactiveDemo` is empty.

### `video`

The demo video itself. Paste the link when the recording lands, and on the next reload the hero's frame opens it instead of the walkthrough: since round 18 nothing else puts a recording on the page (§3, the retired `video` switch). A normal share link is fine. YouTube `watch?v=`, `youtu.be/`, `youtube.com/shorts/` and `vimeo.com/<id>` links, and a plain video file, play in the modal, converted to their embed form first; a SharePoint or Stream link opens in its own tab, because its page refuses to be framed on another site and opens only for a signed-in viewer (§55). The kit email lists it as *Demo video*. Set for `large-document-extraction` and `workforce-optimization` (§55, SharePoint links that open only for people signed in to SoftServe); empty on the other seven.

### Retired in round 12

`config.js` `products[].demoUrl`, `demoPreviewUrl`, `videoUrl` and `materials`, and `content.js` `products[].sellers.materials` (the unrendered kit manifest), moved into the six keys above; the checker fails any of them if it comes back. Their values carried over one to one: `demoUrl` → `interactiveDemo`, `demoPreviewUrl` → `interactiveDemoArtifact`, `videoUrl` → `video`. Every `materials` link was empty. The manifest's non-standard rows have no slot in the standard kit: the *Accelerator pack one-pager* (Account insights), the two *AI Lakehouse* decks (Cross-system ERP Q&A and Business metrics Q&A) and the *Marketplace package* (the two Marketplace products). If one of those files *is* the product's one-pager or sales deck, paste its link into that key.

---

## 3b. Hero images — where they live and how to swap one

Hero background images are **not** in `config.js`. They are content, so they live in `content.js`:

| Surface | Key |
|---|---|
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

- **`file`** — path relative to `site/index.html`. The files sit in `site/assets/img/heroes/`, named by product slug, plus `overview.jpg` and `services.jpg`, the home page's two S2 panel photographs (`overview.twoWays.panels[].image`). The Bespoke band's two photographs sit in `site/assets/img/bands/` (round 18, `overview.bespoke.image`).
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
| The contact portrait | `assets/img/people/<name>.<ext>` | the one person in `shared.contact` | the contact card on every Contacts tab and on the home page's contact switch, as a circle. It ships filled since 2026-09-14, when Alex confirmed the headshot (`ASSETS.md` §3); an empty `photo` renders an initials avatar |

All three are named in `content.js` (`overview.steps[].image`, `overview.industryCases[].image`, `shared.contact.photo`), not here — they are copy-side facts, not switches. A missing file is a warning from `check-grammar.js`, never a failure; the contact portrait degrades to an initials monogram, and the other two to an empty frame.

---

## 4. Adding an eighth product

1. Add the product object to `products[]` in `content.js` (see `SCHEMA.md` for every field).
2. Add a matching `products["<new-slug>"]` block to `config.js` with all four keys (`marketplace`, `marketplaceUrl`, `videoPoster`, `successStoryUrl`). `marketplace` must be a real boolean, `true` only with an https `marketplaceUrl` — `check-grammar.js` rejects a missing one, a quoted `"false"` (truthy, so it would turn the badge on) and a flag with no listing. **No `video` key**: it is retired in round 18, the frame follows the `video` link in `links.json`, and the checker fails the key by name (the packaging plugin's exemplar still carries it).
   Then add its entry to `links.json` with all six keys, `""` for whatever does not exist yet (§3a), and run `node tools/sync-links.js`: the checker fails a product with no entry, and the kit email names the product from `mail/catalog.json`, which that command writes.
3. Add the slug to `productOrder` where you want it to appear. Skipping this step is not an error — the product lands at the end of every list instead — but the position is a judgement about what a seller should meet first, so make it deliberately rather than by omission.
4. Set its `facet` to one of the **four canonical technology ids**, and nothing else: `oci-nvidia` (*OCI + NVIDIA*), `oracle-ai-data-platform` (*Oracle AI Data Platform*), `oracle-ai-lakehouse` (*Oracle Autonomous AI Lakehouse*), `oracle-ai-fusion` (*Oracle AI for Fusion Applications*). A product whose own engine is part of two platforms takes an array of both, in that canonical order, with one `tags` label per platform and each platform listed in its Technology tab's Oracle products widget, `technology.oracle` (`SCHEMA.md`, `facet`; PROVENANCE §46, §58). There is no fifth platform and no `other` catch-all; a new Oracle platform is a new facet, added to `facets.technology`, to `shared.tagFamilies.tech.icons` and to `check-grammar.js` in one edit (and, if it has a public Oracle page, to the footer's `oracleLinks`). If it lands on a facet that currently has no products, nothing else is needed — the facet is already declared and will stop rendering its empty state once a product carries it.
5. Give it a two-entry `tags` array: its `categoryChip`, then its facet's `label` **verbatim**. The engine it runs on — AI-Q, cuOpt, Select AI, a source system — goes in `technology`, never appended to the platform chip; `check-grammar.js` fails a third tag.

If the config block is missing, the product page still renders; every optional control simply stays hidden, exactly as if all its URLs were empty.

---

## 5. Checking a change

After editing either data file, or `links.json`:

```
node --check site/data/config.js
node --check site/data/content.js
node tools/sync-links.js
node tools/check-grammar.js
```

The first two must print nothing. A syntax error there blanks the whole site, because the page cannot read its own content — a trailing comma in the wrong place is the usual cause. `sync-links.js` names every problem in `links.json` (a missing comma, an unknown key, a key that is not a slug, a path not on disk) and rewrites `mail/catalog.json`.

`check-grammar.js` must print `OK`. It asserts that every product still fills every slot of the component grammar (see `VISUAL-GRAMMAR.md`): hero image, problem/solution pair, 1–4 metric tiles with their note, ROI band, 6–8 short feature lines each landing in exactly one workflow step, 3–5 steps, 3–6 industry cases with keys from the fixed set, the at-a-glance side facts, in/out of scope, the four-step flow, the 4–5 layer solution stack with a Required item in every layer and both an inbound and an outbound integration, and the POV fact strip. Site-wide it also asserts the contact card, the `contacts` tab and the absence of the retired `demo` tab. It also fails on any banned string — internal vocabulary or an uncleared customer name — reaching the data layer. Since round 12 it also holds the links and the emails: `links.json` valid and complete, no copy of it stored and none of its links repeated in another file (round 15), the email's catalog current, no retired link field back, the kit's domains identical in `config.js` and `mail/settings.json`, no endpoint committed, and every email rendering with no token left unfilled (`mail/README.md`). It exits non-zero and names each failure.
