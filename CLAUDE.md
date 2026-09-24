# Oracle AI & Data Solutions: the mini-site

SoftServe's Oracle AI & Data practice site, owned by Alex Orlov. **Start every session at [docs/START-HERE.md](docs/START-HERE.md)**. It holds the brief, the standing rules, how a round runs, the learnings and the map of the other docs.

This repository is private and stays private: `docs/` holds customer names and logos that must never ship.

## Layout

- `site/` is the publish root: a static, hash-routed site with no build step.
- `links.json` holds every link a product's sales kit uses and `mail/` the emails the forms send (manual: `mail/README.md`). Neither is ever published. A live trigger URL (the n8n webhook) never enters git: it lives in `.work/n8n/` on the Mac that built the workflow.
- `tools/check-grammar.js` is the site's checker and its gate. Every owner rule that can be checked becomes an assertion there.
- `docs/` holds the site's own records.
- `site.manifest.json` is the site's machine-readable description of itself: the publish target and the artifacts never to publish, the wrapper's strip lines, the paths that never ship, the checker command, the preview entry and the contract round. The `oracle-packs` plugin's listing and demo skills read it before they touch the site. Change it in the same commit as the thing it describes, and bump `contract.round` in any round that changes a `content.js` key, a config switch, a product tab, a checker rule or a publish rule.

## Neighbours on this Mac

- **AO-Personal-OS** (`~/Documents/GitHub/AO-Personal-OS`): Alex's personal OS. The practice wiki is `context/areas/softserve/oracle*.md`, and the general client-document rules are `.claude/references/client-documents.md`. Read them from here. Wiki updates go through that repo's `context-update` skill, run in a session there.
- **Oracle-Packaging-Skills** (`~/Documents/GitHub/Oracle-Packaging-Skills`): the `oracle-packs` plugin. `/oracle-packs:listing` and `/oracle-packs:demo` write product entries and walkthroughs into this site. They find it through `--site`, `$ORACLE_SITE_ROOT` or a session opened here, and they follow `site.manifest.json`. Changes to the plugin are made in that repo.

## Rules carried over from AO-Personal-OS

A session here does not load AO-Personal-OS's `CLAUDE.md`, so the rules this site depends on are restated:

- GigaCloud never appears anywhere. No customer names or logos in anything shipped.
- Docs are rewritten to current truth; never append a dated "UPDATE". A subagent that finds a doc wrong reports it, and the main session rewrites it.
- Subagents run on Opus, with the model spelled out in every call. Fable is kept for the judgement steps: the messaging, UX and design pass, and the final synthesis. The report says which steps used it.
- Subagents read with Read/Grep and edit with Edit/Write. They use Bash only for allow-listed commands, each as its own call, never a `cd … && …` chain: an unattended agent that hits a permission prompt hangs.
- A long-running agent writes progress to a file early, one line per unit of work (per screen, per file). Silence is not progress.
- One state-changing command is one reviewable step.
- Commit messages are conventional (`feat(site):`, `fix(site):`, `docs:`). On this Mac git-autosync commits the repo about every 30 seconds, so commit right after editing when the message matters. On another machine, `git pull` first and commit by hand.
