# The site's emails

Every form on the site ends in a real email since round 12 (PROVENANCE §32):

- **Talk to us** and **Request a scoping call**: the practice inbox gets the request, with a Reply button to the visitor.
- **Get the sales kit**: the seller gets the kit by email at once, and the practice inbox gets a copy that says the kit **already went out**, so nobody sends it again by hand. The kit holds the product page, one-pager, sales deck, feature list, interactive demo and demo video, each as a picture, a linked name and one line on when to use it.

This repository holds **what** is sent and the rules for it. **How** and **from where** it is sent belongs to whoever runs the sender, and none of it is in the repository: no credential, no sender address, no test inbox, no webhook address. The repository can be shared as it is.

## The contract

Any sender that honours this contract can replace the current one, whether an n8n workflow, a Microsoft Graph integration or a serverless function. The site and the repository do not change.

**1. The site posts JSON to one URL** (`formEndpoint`, `docs/CONFIG.md`):

```json
{ "form": "demo" | "contact", "name", "email", "company", "role", "product", "message", "consent": true, "page" }
{ "form": "kit", "email", "product": "all" | "<slug>", "consent": true, "page" }
```

**2. The sender reads its content from the repository at request time** (branch `main`):

| File | What the sender uses it for |
|---|---|
| `mail/render.js` | the logic: `validate()`, `renderKit()`, `renderInternal()`, `replyTo()`, `toGraph()` |
| `mail/settings.json` | test or live, the practice mailbox, the kit's domains, the caps, the time zone |
| `mail/copy.json` | every word of every email |
| `links.json` | every kit link, and `siteUrl` |
| `mail/catalog.json` | product names and role labels, copied from the site |
| `mail/img/*.png` | the six pictures, attached inline |

**3. It renders with `render.js`**, which returns transport-neutral messages: `{ to, replyTo, subject, html, text, images: [{ key, cid, file }] }`. The HTML references each picture as `cid:<cid>`. `render.toGraph(message, attachments)` turns a message into a Microsoft Graph `sendMail` body; an SMTP sender maps the same fields one to one.

**4. It must behave like this.** `tools/check-grammar.js` exercises the first four points on every run.
- Re-check everything with `validate()`: a request can be made without the page. The kit goes only to `kit.allowedDomains`.
- Apply the caps: `limits.perHour` submissions of any kind, and `kit.perAddressPerDay` kits to one address.
- **A kit request:** send the kit email, then the practice copy (`renderInternal(…, { status: "sent" })`). If the kit email fails, send the *send it by hand* notice (`status: "failed"`) instead.
- **A contact form:** send the practice copy, with Reply-To set to the visitor.
- **Answer the page:**
  - `200` only after the kit email or the practice copy was accepted for delivery;
  - `400` refused; `429` over a cap;
  - `502` not sent; `503` the repository files did not load.
  The page shows *Check your inbox* only on `200`.
- **Report every failure** to whoever runs the sender, with the request in the report when the practice never received it. No failure is silent.
- **Check itself on a schedule:** render every email the forms can cause, send nothing, and report only a problem.

## Deployment

What one installation supplies. The repository ships placeholders for these (`mail/n8n/deployment-settings.js`), never values:

| Setting | What it is |
|---|---|
| `repo`, `ref` | the GitHub repository and branch the sender reads |
| `fromName`, `fromAddress` | the From line; the address must be the mailbox the send credential signs in as |
| `testInbox` | in test mode, every practice notice and every kit reply goes here |
| `alertChatId` | where failures and self-check problems are reported |

It also supplies three credentials: read access to the repository, the mail transport, and the alert channel. Plus the webhook path, which is a live trigger URL and never enters git.

## The n8n implementation

- **The workflow.** `mail/n8n/workflow.template.json` is the whole sender, importable into any n8n. Import it, then:
  1. set the values in its **Deployment settings** step;
  2. attach the three credentials;
  3. give the **Form POST** trigger a long random path;
  4. list the site's origin in that trigger's allowed origins.

  `mail/n8n/error-alerts.template.json` is its backstop, the workflow named in its Error Workflow setting. It catches any run that fails outside the handled paths.
- **Its Code steps are the files in `mail/n8n/`.** To change one, edit the file and run `node tools/n8n-workflow.js`. Then apply `.work/n8n/code-nodes.json` to the running workflow step by step (a session does this through the n8n connector). That updates the code in place and never touches the deployment's settings or credentials.
- **A full rebuild of one deployment:** with that deployment's values in `.work/n8n/deployment.local.json` (git-ignored, on the machine that runs the rebuild), the same command also writes `.work/n8n/workflow.live.json`.
- **A change to `mail/render.js`, the copy, the links or the settings** needs none of this: the workflow reads them from GitHub on every request, and git-autosync pushes a saved edit within a minute.
- **The self-check** runs every six hours: the schedule starts the same steps a form does, and **Validate and render** renders every email instead of sending. A broken file, an unfilled token or a missing picture is reported before a visitor meets it.

## Replacing the sender

- **With SoftServe's own mailbox, still on n8n:** replace the two SMTP send steps with HTTP Request steps. They call Microsoft Graph `POST /users/<mailbox>/sendMail`, with a SoftServe app registration and a body built by `render.toGraph()`. The pictures go as attachments with `isInline: true` and `contentId: kit-<key>`, which is exactly what the HTML references. Nothing else in the workflow changes.
- **With another platform** (a serverless function, Power Automate calling a function, a marketing platform): implement the contract above, reusing `mail/render.js` where the platform runs JavaScript. Then point the deployed site's `formEndpoint` at it and delist the old endpoint.
- The site, `links.json`, the copy, the pictures and the checker are unchanged by either route.

## Everyday edits

- **A kit document is ready** (one-pager, sales deck, feature list): paste its link into `links.json` under the product and save. Use a link anyone at Oracle or SoftServe can open; a SharePoint link "for people in SoftServe" will not open for an Oracle seller.
- **A demo video or a walkthrough changes:** edit `links.json`, run `node tools/sync-links.js`, then publish the site, because these links also drive its buttons.
- **The words:** edit `mail/copy.json`, run `node tools/mail-preview.js --sample`, then read `.work/mail-preview/as-read.txt`. It shows every email the way its reader meets it: From, Subject, the inbox preview line, then the body top to bottom. Read it cold, or hand it to a fresh reviewer, because an email is read without the site open. `.work/mail-preview/index.html` shows the rendered emails.
- **From test to live:** set `"mode": "live"` in `mail/settings.json`. Practice copies then go to the practice mailbox without the `[TEST]` prefix, and kit replies go there too. The kit always goes to the seller who asked, in both modes.
- **The pictures:** edit a source in `mail/img/src/`, then render it to PNG at 480 × 300 on a transparent ground. The command is in PROVENANCE §32.4.

## Testing

- **On the claude.ai preview nothing can send**: the artifact blocks every request to another host. So each form says under itself that the preview cannot send, and names the practice mailbox. No form ever opens a mail app.
- **On a local run** (`python3 tools/serve.py`, or `preview_start {name: "oracle-site"}`: port 8765, this Mac only, never cached), the forms read the endpoint from `site/data/endpoint.local.json`. That file is git-ignored and never published (the checker asserts both), so the URL never enters git. It works in every browser on the machine: `{ "formEndpoint": "<the deployment's webhook URL>" }`. The sender must also list the local origin among the trigger's allowed origins (today ports 8765 and 8767).
- **On a deployed copy**, set `formEndpoint` in that copy's `data/config.js`. The checker fails it in the repository.
- In every case the endpoint accepts browser requests only from the origins its trigger lists.
