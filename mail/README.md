# The site's emails

Every form on the site ends in a real email since round 12 (PROVENANCE §32):

- **Talk to us** and **Request a scoping call**: the practice inbox gets the request, with a Reply button to the visitor.
- **Get the sales kit**: the seller gets the kit by email at once — the product page, one-pager, sales deck, feature list, interactive demo and demo video, each as a picture, a linked name and one line on when to use it — and the practice inbox gets a copy that says the kit **already went out**, so nobody sends it again by hand.

This page is the operating manual: how it works, where each part lives, what to edit for what, how to test, and what happens when something fails.

## How a submission travels

1. The page `POST`s the form as JSON to the n8n workflow **Oracle site forms (cloud)** (n8n id `co9bpWm6xVIPMfcB`).
2. n8n reads this repo's files from GitHub (`main`, through the read-only token in the credential **GitHub read (Oracle-Solutions-Site)**): `links.json`, `mail/settings.json`, `mail/catalog.json`, `mail/copy.json`, `mail/render.js` and the six pictures. A saved and pushed change is live on the next submission; git-autosync pushes within a minute on Alex's Mac.
3. It runs `mail/render.js` from those files: it re-checks the form (the email, the consent, and for the kit the domain, which only `softserveinc.com` and `oracle.com` pass), applies the send caps, and renders every email the request causes.
4. **A kit request:** it sends the kit to the seller, then the practice copy. The page hears "sent" only after the kit email was accepted, so *Check your inbox* is never a guess.
5. **Talk to us / scoping call:** it sends the practice copy, with Reply-To set to the visitor.
6. **Anything that fails** tells the page it did not send (the page offers the practice mailbox) and posts an alert to Alex in the AO Personal OS Telegram group (General topic):
   - a failed kit sends the practice a *send it by hand* notice with the exact links;
   - a practice copy that cannot be sent puts the whole request in the alert, so the lead is not lost;
   - a run that crashes outside those paths is caught by the backstop workflow **Oracle site forms — error alerts** (`ih0qkEs5xOgpH2Kd`).

## Where each part lives

| File | What it is | Who edits it |
|---|---|---|
| `links.json` (repo root) | Every kit link, per product, and `siteUrl`. Never published: it sits outside `site/`. | Alex, by hand |
| `mail/settings.json` | Test or live, the two inboxes, the sender, Reply-To, the kit domains, the caps | Alex, by hand |
| `mail/copy.json` | Every word of every email | Alex or a session, then previewed (below) |
| `mail/render.js` | Validation and the email layout. Runs in n8n and in the preview | a session |
| `mail/catalog.json` | Product names, one-liners, role labels, kit names, copied from `site/data/content.js` | generated: `node tools/sync-links.js` |
| `site/data/links.js` | The three links the site's own buttons read (interactive demo, its artifact copy, video) | generated: `node tools/sync-links.js` |
| `mail/img/*.png` | The six pictures, 480 × 300, shown at 160 × 100. Sources in `mail/img/src/*.svg` | a session |
| `mail/n8n/*.js` | The workflow's Code nodes, one file each | a session |
| `mail/n8n/workflow.json` | The workflow as built by `node tools/n8n-workflow.js`, webhook path redacted | generated |

`tools/check-grammar.js` holds the rules: `links.json` valid and complete; the two generated files current; no retired link field back in `config.js`; the kit domains identical in `config.js` and `mail/settings.json`; no endpoint committed; no em dash or retired word in the copy; every email renders with no token left unfilled, both with today's links and with every link filled.

## Everyday edits

- **A kit document is ready** (one-pager, sales deck, feature list): paste its link into `links.json` under the product and save. Use a link anyone at Oracle or SoftServe can open; a SharePoint link "for people in SoftServe" will not open for an Oracle seller. Nothing else to run.
- **A demo video or a walkthrough changes:** edit `links.json`, run `node tools/sync-links.js`, then publish the site: these links also drive its buttons.
- **The words:** edit `mail/copy.json`, run `node tools/mail-preview.js --sample`, then read `.work/mail-preview/as-read.txt`. It shows every email the way its reader meets it: From, Subject, the inbox preview line, then the body top to bottom. Read it cold, or hand it to a fresh reviewer, because an email is read without the site open (AO-Personal-OS `client-documents.md`, "A message read outside the product stands alone"). `.work/mail-preview/index.html` shows the rendered emails.
- **From test to live:** in `mail/settings.json` set `"mode": "live"`. Practice copies then go to `oracle@softserveinc.com` without the `[TEST]` prefix, and kit replies go there too. The kit always goes to the seller who asked, in both modes.
- **The sender:** `sender.address` must be the mailbox the n8n send credential logs in as (today `alex@alexorlov.co` over Zoho SMTP). Changing the mailbox means changing that credential too, below.
- **The pictures:** edit a source in `mail/img/src/`, then render it to PNG with headless Chrome at 480 × 300 on a transparent ground. The command is in PROVENANCE §32.

## Testing locally

The claude.ai preview cannot send: the artifact blocks every request to another host. There, every form opens the visitor's mail client, and the page says so. Test on the local preview instead:

1. Start the site: `preview_start {name: "oracle-site"}` (port 8765).
2. In that tab's console, point the forms at the workflow. The URL is `https://alexorlovco.app.n8n.cloud/webhook/` followed by the path in `.work/n8n/webhook-path.txt`, which exists only on the Mac that built the workflow and never enters git:
   `localStorage.setItem("oracle-ai-solutions:form-endpoint", "<that URL>")`
3. Submit a kit request to a `@softserveinc.com` address, or a Talk to us form. In test mode every practice copy goes to `olekorlov@softserveinc.com`.

`forms.js` reads that key on `127.0.0.1` and `localhost` only. The workflow accepts browser requests only from the origins listed in `tools/n8n-workflow.js` (`ORIGINS`).

## The n8n workflow

- **Credentials:** **Read from GitHub** uses *GitHub read (Oracle-Solutions-Site)* (a fine-grained token: Contents, read-only, this repo only). **Send kit** and **Send practice copy** use the sender credential. The three Telegram nodes use *Telegram bot (AO)*.
- **Its Code nodes are the files in `mail/n8n/`.** To change one: edit the file, run `node tools/n8n-workflow.js`, and have a session push `.work/n8n/workflow.live.json` to n8n through the n8n connector (`n8n_update_full_workflow`). A change to `mail/render.js` needs none of this: the workflow fetches it on every run.
- **Caps** (`mail/settings.json`): `limits.perHour` submissions of any kind, and `kit.perAddressPerDay` kits to one address. Past a cap the page is refused (429), and Alex gets one alert an hour. They exist so the form cannot be used to flood an inbox from SoftServe's name.
- **Executions** keep their data, the requests included, in n8n's execution log for as long as the plan retains it. Set `saveDataSuccessExecution` to `none` in `tools/n8n-workflow.js` once testing is over, if that is too long.

## Moving to a public host

Once the site has a real address:

1. Set `formEndpoint` in the **deployed copy's** `data/config.js` only; the checker fails it in the repo.
2. Add the host's origin to `ORIGINS` in `tools/n8n-workflow.js`, run it, and push the workflow.
3. Set `siteUrl` in `links.json` to the host. A claude.ai link drops the `#/products/<slug>` route and lands on the home page; a real host keeps it, so the email's product links open the product.
4. `interactiveDemoArtifact` stops mattering there: off claude.ai, the walkthrough opens from the site itself.

## Switching the sender

The sender is one credential on two nodes. For SoftServe's own mailbox, connect a **Microsoft Outlook** credential in n8n. If SoftServe's tenant asks for admin approval, that route needs IT. Then replace **Send kit** and **Send practice copy** with HTTP Request nodes that call Microsoft Graph `POST /me/sendMail`, or `/users/oracle@softserveinc.com/sendMail` with Send As rights on the practice mailbox. The pictures go as attachments with `isInline: true` and `contentId: kit-<key>`, which is exactly what the HTML references. `mail/render.js` does not change.
