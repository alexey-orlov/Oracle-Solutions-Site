#!/usr/bin/env python3
"""Serve the site for a local run: this Mac only, and never cached.

Caching off, so a reload always shows the files as saved: a browser that kept
an old forms.js once ran it against a new content.js. Bound to 127.0.0.1,
because site/data/endpoint.local.json (this machine's live form endpoint)
sits in the served folder and must not be readable from the network.

data/links.js is not a file: every request for it is answered from links.json
at the repo root through tools/site_links.py, so an edit there shows on the
next reload and no copy of a link is ever stored under site/.

Usage: python3 tools/serve.py [port] [directory]   (defaults: 8765, site)
"""
import functools
import http.server
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import site_links  # noqa: E402  (tools/site_links.py, beside this file)

SITE_LINKS_PATH = "/data/links.js"


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _site_links(self, with_body):
        try:
            body = site_links.build()
        except (OSError, ValueError) as error:
            # The console gate catches this, so a broken links.json is seen at once.
            body = "console.error(" + json.dumps("links.json: " + str(error)) + ");\n"
        data = body.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/javascript; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        if with_body:
            self.wfile.write(data)

    def do_GET(self):
        if self.path.split("?", 1)[0] == SITE_LINKS_PATH:
            return self._site_links(True)
        return super().do_GET()

    def do_HEAD(self):
        if self.path.split("?", 1)[0] == SITE_LINKS_PATH:
            return self._site_links(False)
        return super().do_HEAD()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    directory = sys.argv[2] if len(sys.argv) > 2 else "site"
    handler = functools.partial(NoStoreHandler, directory=directory)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    print("Serving " + directory + " at http://127.0.0.1:" + str(port) + "/ (no cache; data/links.js from links.json)", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
