#!/usr/bin/env python3
"""The site's view of links.json, built on request and never stored.

links.json at the repo root is the one file that holds a product's links. The
site's own buttons need three of them per product: the walkthrough, its
artifact copy and the video. The kit documents (one-pager, deck, feature list)
never leave links.json, because anything the site serves is readable by anyone.

This builds `window.SITE_LINKS` from links.json each time it is asked:

  - tools/serve.py answers GET /data/links.js with it, on every request;
  - a publish writes it beside the publish wrapper and maps data/links.js there:
        python3 tools/site_links.py --out .work/publish/data/links.js
  - tools/check-grammar.js evaluates it, so its checks see what the site sees.

No file under site/ holds a link: the checker fails site/data/links.js if it
exists, and fails any link from links.json found in another file.

Usage: python3 tools/site_links.py [--out <file>]   (prints to stdout without --out)
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINKS = ROOT / "links.json"
# The keys the site's buttons read. tools/check-grammar.js fails any other key
# here (tools/sync-links.js PUBLIC_KEYS), so a kit document can never ship.
PUBLIC_KEYS = ("interactiveDemo", "interactiveDemoArtifact", "video")


def build(path=LINKS):
    """The script the site loads as data/links.js. Raises on a missing or broken file."""
    data = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    products = data.get("products")
    if not isinstance(products, dict):
        raise ValueError("links.json has no products object")
    view = {
        slug: {key: (entry or {}).get(key, "") for key in PUBLIC_KEYS}
        for slug, entry in products.items()
    }
    return (
        "/* Built from links.json by tools/site_links.py when asked; never stored.\n"
        "   The walkthrough, its artifact copy and the video only: the kit\n"
        "   documents never leave links.json. */\n"
        "window.SITE_LINKS = " + json.dumps(view, indent=2, ensure_ascii=False) + ";\n"
    )


def main(argv):
    out = None
    if len(argv) == 2 and argv[0] == "--out":
        out = pathlib.Path(argv[1])
    elif argv:
        sys.exit("usage: python3 tools/site_links.py [--out <file>]")
    try:
        script = build()
    except (OSError, ValueError) as error:
        sys.exit("site_links: links.json: " + str(error))
    if out is None:
        sys.stdout.write(script)
        return
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(script, encoding="utf-8")
    print("site_links: wrote " + str(out))


if __name__ == "__main__":
    main(sys.argv[1:])
